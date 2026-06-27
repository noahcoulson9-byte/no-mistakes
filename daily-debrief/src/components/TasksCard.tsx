"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Task = { id: string; title: string; done: boolean };

export default function TasksCard({ userId }: { userId: string }) {
  const supabase = createSupabaseBrowserClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("tasks")
      .select("id, title, done")
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setTasks(data ?? []);
        setLoading(false);
      });
  }, [supabase]);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    const value = title.trim();
    if (!value) return;
    setTitle("");

    const { data, error } = await supabase
      .from("tasks")
      .insert({ title: value, user_id: userId })
      .select("id, title, done")
      .single();

    if (!error && data) setTasks((prev) => [...prev, data]);
  }

  async function toggleTask(task: Task) {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)),
    );
    await supabase.from("tasks").update({ done: !task.done }).eq("id", task.id);
  }

  async function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await supabase.from("tasks").delete().eq("id", id);
  }

  return (
    <GlassCard delay={0.1}>
      <p className="text-sm font-medium text-muted">Tasks</p>

      <form onSubmit={addTask} className="mt-3 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task"
          className="flex-1 rounded-xl border border-white/60 bg-white/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/40"
        />
        <button
          type="submit"
          className="rounded-xl bg-accent px-3 py-2 text-sm font-medium text-white transition active:scale-[0.96]"
        >
          Add
        </button>
      </form>

      <ul className="mt-4 flex flex-col gap-2">
        {loading && <div className="h-4 animate-pulse rounded bg-white/40" />}

        {!loading && tasks.length === 0 && (
          <p className="text-sm text-muted">No tasks yet.</p>
        )}

        <AnimatePresence initial={false}>
          {tasks.map((task) => (
            <motion.li
              key={task.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="flex items-center gap-3 text-sm"
            >
              <button
                onClick={() => toggleTask(task)}
                aria-label="Toggle task"
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                  task.done
                    ? "border-accent bg-accent text-white"
                    : "border-black/20 bg-white/50"
                }`}
              >
                {task.done && "✓"}
              </button>
              <span className={task.done ? "flex-1 text-muted line-through" : "flex-1"}>
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                aria-label="Delete task"
                className="text-muted transition hover:text-red-500"
              >
                ✕
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </GlassCard>
  );
}
