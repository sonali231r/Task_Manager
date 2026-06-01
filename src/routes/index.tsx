import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { KanbanSquare, Lock, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flowboard — Organize tasks effortlessly" },
      { name: "description", content: "A clean kanban-style task manager to track your work across Todo, In Progress, and Done." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/board" });
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <KanbanSquare className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Flowboard</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl">
          Organize your work with a board that just flows.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-muted-foreground">
          Capture tasks, drag them across Todo, In Progress, and Done. Your private board — fast and focused.
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <Button size="lg" asChild>
            <Link to="/signup">Create your board</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/login">Log in</Link>
          </Button>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-3 text-left">
          {[
            { icon: KanbanSquare, title: "Kanban-first", desc: "Three columns. No clutter. Move tasks with a tap." },
            { icon: Zap, title: "Fast", desc: "Instant updates, optimistic UI, zero waiting around." },
            { icon: Lock, title: "Private", desc: "Each user only sees their own tasks. Always." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-5">
              <Icon className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
