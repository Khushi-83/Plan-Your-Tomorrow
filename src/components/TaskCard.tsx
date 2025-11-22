import { useState } from "react";
import { Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export interface Task {
  id: string;
  title: string;
  duration?: string;
  urgency: number;
  importance: number;
  completed: boolean;
  color: "lavender" | "mint" | "peach" | "sky";
  notes?: string;
}

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
}

const getPriorityLabel = (urgency: number, importance: number): string => {
  const score = urgency + importance;
  if (score >= 9) return "Do First";
  if (score >= 7) return "Do Next";
  if (score >= 5) return "Do Later";
  return "Skip Today";
};

const getPriorityColor = (urgency: number, importance: number): string => {
  const score = urgency + importance;
  if (score >= 9) return "text-destructive";
  if (score >= 7) return "text-primary";
  if (score >= 5) return "text-secondary";
  return "text-muted-foreground";
};

export const TaskCard = ({ task, onUpdate, onDelete }: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const priorityLabel = getPriorityLabel(task.urgency, task.importance);
  const priorityColor = getPriorityColor(task.urgency, task.importance);

  return (
    <div
      className={cn(
        "group relative rounded-2xl p-6 transition-all duration-300 hover:shadow-medium",
        "shadow-soft",
        task.color === "lavender" && "bg-card-lavender",
        task.color === "mint" && "bg-card-mint",
        task.color === "peach" && "bg-card-peach",
        task.color === "sky" && "bg-card-sky",
        task.completed && "opacity-60"
      )}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            {isEditing ? (
              <Input
                value={task.title}
                onChange={(e) => onUpdate({ ...task, title: e.target.value })}
                onBlur={() => setIsEditing(false)}
                className="border-0 bg-white/50 text-lg font-medium shadow-none focus-visible:ring-1"
                autoFocus
              />
            ) : (
              <h3
                onClick={() => setIsEditing(true)}
                className={cn(
                  "cursor-pointer text-lg font-medium transition-colors hover:text-primary",
                  task.completed && "line-through"
                )}
              >
                {task.title}
              </h3>
            )}
            {task.duration && (
              <p className="text-sm text-muted-foreground">{task.duration}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onUpdate({ ...task, completed: !task.completed })}
              className={cn(
                "h-8 w-8 rounded-lg transition-all",
                task.completed && "bg-primary text-primary-foreground"
              )}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 rounded-lg text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Duration Input */}
        <Input
          value={task.duration || ""}
          onChange={(e) => onUpdate({ ...task, duration: e.target.value })}
          placeholder="Duration (optional)"
          className="border-0 bg-white/50 text-sm shadow-none focus-visible:ring-1"
        />

        {/* Notes Textarea */}
        <Textarea
          value={task.notes || ""}
          onChange={(e) => onUpdate({ ...task, notes: e.target.value })}
          placeholder="Add notes..."
          className="min-h-[80px] resize-none border-0 bg-white/50 text-sm shadow-none focus-visible:ring-1"
        />

        {/* Urgency Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Urgency</label>
            <span className="text-sm font-semibold text-primary">{task.urgency}</span>
          </div>
          <Slider
            value={[task.urgency]}
            onValueChange={([value]) => onUpdate({ ...task, urgency: value })}
            min={1}
            max={5}
            step={1}
            className="cursor-pointer"
          />
        </div>

        {/* Importance Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Importance</label>
            <span className="text-sm font-semibold text-secondary">{task.importance}</span>
          </div>
          <Slider
            value={[task.importance]}
            onValueChange={([value]) => onUpdate({ ...task, importance: value })}
            min={1}
            max={5}
            step={1}
            className="cursor-pointer"
          />
        </div>

        {/* Priority Label */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Priority
          </span>
          <span className={cn("text-sm font-bold", priorityColor)}>
            {priorityLabel}
          </span>
        </div>
      </div>
    </div>
  );
};
