import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import WeatherCard from "@/components/WeatherCard";
import CalendarCard from "@/components/CalendarCard";
import TasksCard from "@/components/TasksCard";
import NewsCard from "@/components/NewsCard";
import SignOutButton from "@/components/SignOutButton";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    redirect("/login");
  }

  const { data: settings } = await supabase
    .from("settings")
    .select("city, lat, lon")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  const lat = settings?.lat ?? 40.7128;
  const lon = settings?.lon ?? -74.006;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-5 py-10 sm:px-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">{greeting()}</h1>
        </div>
        <SignOutButton />
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <WeatherCard lat={lat} lon={lon} />
        <CalendarCard />
        <TasksCard userId={userData.user.id} />
        <NewsCard />
      </div>
    </main>
  );
}
