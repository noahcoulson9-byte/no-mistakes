"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import GlassCard from "@/components/GlassCard";

type Weather = {
  location: string;
  temp: number;
  feelsLike: number;
  high: number;
  low: number;
  condition: string;
  icon: string;
  humidity: number;
  windMph: number;
};

export default function WeatherCard({ lat, lon }: { lat: number; lon: number }) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/weather?lat=${lat}&lon=${lon}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => !cancelled && setWeather(data))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  return (
    <GlassCard delay={0} className="flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">
          {weather?.location ?? (error ? "Weather unavailable" : "Loading…")}
        </p>
        {weather && (
          <Image
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.condition}
            width={40}
            height={40}
          />
        )}
      </div>

      {weather ? (
        <>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-5xl font-semibold tracking-tight">{weather.temp}°</span>
            <span className="text-sm text-muted">{weather.condition}</span>
          </div>
          <div className="mt-4 flex gap-4 text-xs text-muted">
            <span>H:{weather.high}° L:{weather.low}°</span>
            <span>Feels {weather.feelsLike}°</span>
            <span>Wind {weather.windMph}mph</span>
          </div>
        </>
      ) : (
        <div className="mt-2 h-16 animate-pulse rounded-xl bg-white/40" />
      )}
    </GlassCard>
  );
}
