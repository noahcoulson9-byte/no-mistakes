import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GNEWS_API_KEY is not configured." }, { status: 500 });
  }

  const url = `https://gnews.io/api/v4/top-headlines?lang=en&max=6&apikey=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch news." }, { status: res.status });
  }

  const data = await res.json();

  const articles = (data.articles ?? []).map(
    (a: { title: string; url: string; source: { name: string }; publishedAt: string }) => ({
      title: a.title,
      url: a.url,
      source: a.source?.name ?? "",
      publishedAt: a.publishedAt,
    }),
  );

  return NextResponse.json({ articles });
}
