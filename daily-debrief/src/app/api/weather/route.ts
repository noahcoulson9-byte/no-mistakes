import { NextResponse, type NextRequest } from "next/server";

const WEATHER_CODE_LABELS: Record<number, string> = {
  200: "Thunderstorm",
  300: "Drizzle",
  500: "Rain",
  600: "Snow",
  700: "Atmosphere",
  800: "Clear",
  801: "Partly Cloudy",
  802: "Cloudy",
};

function labelFor(code: number) {
  const bucket = Math.floor(code / 100) * 100;
  return WEATHER_CODE_LABELS[code] ?? WEATHER_CODE_LABELS[bucket] ?? "—";
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENWEATHER_API_KEY is not configured." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat") ?? "40.7128";
  const lon = searchParams.get("lon") ?? "-74.0060";

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(
    lat,
  )}&lon=${encodeURIComponent(lon)}&units=imperial&appid=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch weather." }, { status: res.status });
  }

  const data = await res.json();

  return NextResponse.json({
    location: data.name as string,
    temp: Math.round(data.main?.temp ?? 0),
    feelsLike: Math.round(data.main?.feels_like ?? 0),
    high: Math.round(data.main?.temp_max ?? 0),
    low: Math.round(data.main?.temp_min ?? 0),
    condition: labelFor(data.weather?.[0]?.id ?? 800),
    icon: data.weather?.[0]?.icon ?? "01d",
    humidity: data.main?.humidity ?? 0,
    windMph: Math.round(data.wind?.speed ?? 0),
  });
}
