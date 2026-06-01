import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Board } from "@/components/board/Board";
import { Button } from "@/components/ui/button";
import { KanbanSquare, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/board")({
  head: () => ({ meta: [{ title: "Your board — Flowboard" }] }),
  component: BoardPage,
});

function BoardPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login", replace: true });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    toast.success("Logged out");
    navigate({ to: "/login", replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <KanbanSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">Flowboard</p>
              <p className="text-xs text-muted-foreground truncate max-w-[180px] sm:max-w-none">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Board userId={user.id} />
      </main>
    </div>
  );
}
