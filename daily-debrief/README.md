# Daily Debrief

A personal morning briefing — weather, today's calendar, tasks, and headlines — in a frosted-glass PWA installable on your iPhone home screen.

## Stack

- Next.js (App Router) + Tailwind CSS, Framer Motion
- Supabase (Postgres + Auth) for tasks and settings
- OpenWeatherMap for weather, GNews for headlines, iCloud CalDAV for today's events
- Deploys to Vercel

## 1. Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/schema.sql` from this repo — it creates the `tasks` and `settings` tables with row-level security scoped to each signed-in user.
3. In **Project Settings → API**, copy the **Project URL** and **anon public** key.
4. In **Authentication → URL Configuration**, add your deployed URL (and `http://localhost:3000` for local dev) to the redirect allow list, since sign-in uses a magic-link email.

## 2. API keys

- **Weather** — create a free key at [openweathermap.org/api](https://openweathermap.org/api).
- **News** — create a free key at [gnews.io](https://gnews.io) (the free tier works in production, unlike NewsAPI.org).
- **Calendar** — Daily Debrief reads your iCloud calendar over CalDAV using an **app-specific password**, not your real Apple ID password:
  1. Sign in at [account.apple.com](https://account.apple.com/account/manage).
  2. Go to **Sign-In and Security → App-Specific Passwords → Generate**.
  3. Use your iCloud email as `ICLOUD_USERNAME` and the generated password as `ICLOUD_APP_PASSWORD`.

## 3. Environment variables

Copy `.env.local.example` to `.env.local` and fill in the values from steps 1–2:

```bash
cp .env.local.example .env.local
```

## 4. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign in with the magic link sent to your email, and the dashboard loads.

## 5. Deploy to Vercel

1. Push this repo (or the `daily-debrief/` subfolder as its own project) to GitHub.
2. In Vercel, **Add New Project**, point the root directory at `daily-debrief/`.
3. Add all the variables from `.env.local` under **Settings → Environment Variables**.
4. Deploy. Vercel gives you an HTTPS URL.

## 6. Install on iPhone

1. Open the deployed URL in **Safari** on your iPhone.
2. Tap the **Share** icon → **Add to Home Screen**.
3. Daily Debrief now launches full-screen from your home screen like a native app.
