import type { Stage, Task } from "./Board";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColumnProps {
  title: string;
  stage: Stage;
  tone: "todo" | "progress" | "done";
  tasks: Task[];
  onAdd: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, stage: Stage) => void;
}

const TONE_STYLES: Record<ColumnProps["tone"], string> = {
  todo: "bg-todo text-todo-foreground",
  progress: "bg-progress text-progress-foreground",
  done: "bg-done text-done-foreground",
};

const ALL_STAGES: { stage: Stage; label: string }[] = [
  { stage: "todo", label: "Todo" },
  { stage: "in_progress", label: "In Progress" },
  { stage: "done", label: "Done" },
];

export function Column({ title, stage, tone, tasks, onAdd, onEdit, onDelete, onMove }: ColumnProps) {
  return (
    <section className="flex flex-col rounded-xl border border-border bg-card">
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={cn("rounded-md px-2 py-0.5 text-xs font-semibold", TONE_STYLES[tone])}>
            {title}
          </span>
          <span className="text-xs text-muted-foreground">{tasks.length}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onAdd} aria-label={`Add task to ${title}`}>
          <Plus className="h-4 w-4" />
        </Button>
      </header>

      <div className="flex min-h-[200px] flex-col gap-2 p-3 pt-0">
        {tasks.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border py-10 text-center">
            <Inbox className="h-6 w-6 text-muted-foreground/60" />
            <p className="mt-2 text-sm text-muted-foreground">No tasks here</p>
            <button onClick={onAdd} className="mt-1 text-xs font-medium text-primary hover:underline">
              Add one
            </button>
          </div>
        ) : (
          tasks.map((task) => (
            <article
              key={task.id}
              className="group rounded-lg border border-border bg-background p-3 transition hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <button
                  onClick={() => onEdit(task)}
                  className="flex-1 text-left"
                >
                  <h3 className="text-sm font-medium leading-tight">{task.title}</h3>
                  {task.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
                  )}
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 transition group-hover:opacity-100 data-[state=open]:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(task)}>Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {ALL_STAGES.filter((s) => s.stage !== stage).map((s) => (
                      <DropdownMenuItem key={s.stage} onClick={() => onMove(task.id, s.stage)}>
                        Move to {s.label}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(task.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
