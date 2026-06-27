import { NextResponse } from "next/server";
import { createDAVClient } from "tsdav";
import ICAL from "ical.js";

type Event = { title: string; start: string; end: string; allDay: boolean };

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function endOfDay(d: Date) {
  const end = startOfDay(d);
  end.setDate(end.getDate() + 1);
  return end;
}

export async function GET() {
  const username = process.env.ICLOUD_USERNAME;
  const password = process.env.ICLOUD_APP_PASSWORD;

  if (!username || !password) {
    return NextResponse.json(
      { error: "ICLOUD_USERNAME / ICLOUD_APP_PASSWORD are not configured." },
      { status: 500 },
    );
  }

  try {
    const client = await createDAVClient({
      serverUrl: "https://caldav.icloud.com",
      credentials: { username, password },
      authMethod: "Basic",
      defaultAccountType: "caldav",
    });

    const calendars = await client.fetchCalendars();

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const events: Event[] = [];

    for (const calendar of calendars) {
      const objects = await client.fetchCalendarObjects({
        calendar,
        timeRange: {
          start: todayStart.toISOString(),
          end: todayEnd.toISOString(),
        },
      });

      for (const obj of objects) {
        if (!obj.data) continue;
        try {
          const jcalData = ICAL.parse(obj.data);
          const comp = new ICAL.Component(jcalData);
          const vevents = comp.getAllSubcomponents("vevent");

          for (const vevent of vevents) {
            const event = new ICAL.Event(vevent);
            const start = event.startDate.toJSDate();
            const end = event.endDate.toJSDate();

            if (start < todayEnd && end > todayStart) {
              events.push({
                title: event.summary ?? "(untitled)",
                start: start.toISOString(),
                end: end.toISOString(),
                allDay: event.startDate.isDate,
              });
            }
          }
        } catch {
          continue;
        }
      }
    }

    events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ error: "Failed to fetch calendar." }, { status: 502 });
  }
}
