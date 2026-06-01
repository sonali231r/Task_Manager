import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Column } from "./Column";
import { TaskDialog } from "./TaskDialog";

export type Stage = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  stage: Stage;
  created_at: string;
  updated_at: string;
}

const COLUMNS: { stage: Stage; title: string; tone: "todo" | "progress" | "done" }[] = [
  { stage: "todo", title: "Todo", tone: "todo" },
  { stage: "in_progress", title: "In Progress", tone: "progress" },
  { stage: "done", title: "Done", tone: "done" },
];

export function Board({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStage, setDefaultStage] = useState<Stage>("todo");

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ["tasks", userId],
    queryFn: async (): Promise<Task[]> => {
      const { data } = await api.get("/api/tasks");
      return data as Task[];
    },
  });

  const grouped = useMemo(() => {
    const map: Record<Stage, Task[]> = { todo: [], in_progress: [], done: [] };
    (tasks ?? []).forEach((t) => map[t.stage].push(t));
    return map;
  }, [tasks]);

  const moveMutation = useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: Stage }) => {
      const task = (tasks ?? []).find((t) => t.id === id);
      const { data } = await api.put(`/api/tasks/${id}`, {
        title: task?.title,
        description: task?.description,
        stage,
      });
      return data;
    },
    onMutate: async ({ id, stage }) => {
      await qc.cancelQueries({ queryKey: ["tasks", userId] });
      const prev = qc.getQueryData<Task[]>(["tasks", userId]);
      qc.setQueryData<Task[]>(["tasks", userId], (old) =>
        (old ?? []).map((t) => (t.id === id ? { ...t, stage } : t))
      );
      return { prev };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["tasks", userId], ctx.prev);
      toast.error(err instanceof Error ? err.message : "Failed to move task");
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["tasks", userId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/tasks/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks", userId] });
      toast.success("Task deleted");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to delete"),
  });

  const openNew = (stage: Stage = "todo") => {
    setEditingTask(null);
    setDefaultStage(stage);
    setDialogOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
        Failed to load tasks: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your board</h1>
          <p className="text-sm text-muted-foreground">
            {tasks?.length ?? 0} task{tasks?.length === 1 ? "" : "s"} total
          </p>
        </div>
        <Button onClick={() => openNew("todo")}>
          <Plus className="mr-2 h-4 w-4" /> New task
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => (
          <Column
            key={col.stage}
            title={col.title}
            stage={col.stage}
            tone={col.tone}
            tasks={grouped[col.stage]}
            onAdd={() => openNew(col.stage)}
            onEdit={openEdit}
            onDelete={(id) => deleteMutation.mutate(id)}
            onMove={(id, stage) => moveMutation.mutate({ id, stage })}
          />
        ))}
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        userId={userId}
        task={editingTask}
        defaultStage={defaultStage}
      />
    </>
  );
}
