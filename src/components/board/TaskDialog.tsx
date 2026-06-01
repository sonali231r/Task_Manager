import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Stage, Task } from "./Board";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userId: string;
  task: Task | null;
  defaultStage: Stage;
}

export function TaskDialog({ open, onOpenChange, userId, task, defaultStage }: Props) {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState<Stage>("todo");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitle(task?.title ?? "");
      setDescription(task?.description ?? "");
      setStage(task?.stage ?? defaultStage);
      setError(null);
    }
  }, [open, task, defaultStage]);

  const mutation = useMutation({
    mutationFn: async () => {
      const trimmed = title.trim();
      if (!trimmed) throw new Error("Title is required");
      const payload = {
        title: trimmed,
        description: description.trim() || "",
        stage,
      };
      if (task) {
        await api.put(`/api/tasks/${task.id}`, payload);
      } else {
        await api.post("/api/tasks", payload);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks", userId] });
      toast.success(task ? "Task updated" : "Task created");
      onOpenChange(false);
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      toast.error(msg);
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>
            {task ? "Update the details below." : "Add a new task to your board."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description <span className="text-muted-foreground">(optional)</span></Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stage">Stage</Label>
            <Select value={stage} onValueChange={(v) => setStage(v as Stage)}>
              <SelectTrigger id="stage">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {task ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
