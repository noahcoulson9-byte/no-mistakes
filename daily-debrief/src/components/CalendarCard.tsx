"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/GlassCard";

type Event = { title: string; start: string; end: string; allDay: boolean };

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function CalendarCard() {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/calendar")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => !cancelled && setEvents(data.events))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <GlassCard delay={0.05}>
      <p className="text-sm font-medium text-muted">Today</p>

      {error && <p className="mt-3 text-sm text-muted">Calendar unavailable.</p>}

      {!events && !error && (
        <div className="mt-3 flex flex-col gap-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-white/40" />
          ))}
        </div>
      )}

      {events && events.length === 0 && (
        <p className="mt-3 text-sm text-muted">Nothing on your calendar today.</p>
      )}

      {events && events.length > 0 && (
        <ul className="mt-3 flex flex-col gap-3">
          {events.map((event, i) => (
            <li key={i} className="flex items-baseline gap-3 text-sm">
              <span className="w-16 shrink-0 text-xs tabular-nums text-muted">
                {event.allDay ? "All day" : formatTime(event.start)}
              </span>
              <span className="font-medium">{event.title}</span>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}
