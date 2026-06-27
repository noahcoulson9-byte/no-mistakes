"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/GlassCard";

type Article = { title: string; url: string; source: string; publishedAt: string };

export default function NewsCard() {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/news")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => !cancelled && setArticles(data.articles))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <GlassCard delay={0.15} className="md:col-span-2">
      <p className="text-sm font-medium text-muted">Headlines</p>

      {error && <p className="mt-3 text-sm text-muted">News unavailable.</p>}

      {!articles && !error && (
        <div className="mt-3 flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-white/40" />
          ))}
        </div>
      )}

      {articles && (
        <ul className="mt-3 flex flex-col gap-3">
          {articles.map((article) => (
            <li key={article.url}>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-baseline justify-between gap-3 text-sm"
              >
                <span className="line-clamp-1 font-medium text-foreground group-hover:text-accent">
                  {article.title}
                </span>
                <span className="shrink-0 text-xs text-muted">{article.source}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}
