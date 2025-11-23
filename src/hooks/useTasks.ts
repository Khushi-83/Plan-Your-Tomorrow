import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/components/TaskCard";
import { toast } from "sonner";

export const useTasks = (userId: string | undefined) => {
  const [routineTasks, setRoutineTasks] = useState<Task[]>([]);
  const [tomorrowTasks, setTomorrowTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const routine = data
        .filter((t) => t.task_type === "routine")
        .map((t) => ({
          id: t.id,
          title: t.title,
          duration: t.duration,
          urgency: t.urgency,
          importance: t.importance,
          completed: t.completed,
          color: t.color as Task["color"],
          notes: t.notes || "",
        }));

      const tomorrow = data
        .filter((t) => t.task_type === "tomorrow")
        .map((t) => ({
          id: t.id,
          title: t.title,
          duration: t.duration,
          urgency: t.urgency,
          importance: t.importance,
          completed: t.completed,
          color: t.color as Task["color"],
          notes: t.notes || "",
        }));

      setRoutineTasks(routine);
      setTomorrowTasks(tomorrow);
    } catch (error: any) {
      toast.error("Failed to load tasks");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task: Omit<Task, "id">, type: "routine" | "tomorrow") => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          user_id: userId,
          title: task.title,
          duration: task.duration,
          urgency: task.urgency,
          importance: task.importance,
          completed: task.completed,
          color: task.color,
          notes: task.notes || null,
          task_type: type,
        })
        .select()
        .single();

      if (error) throw error;

      const newTask: Task = {
        id: data.id,
        title: data.title,
        duration: data.duration,
        urgency: data.urgency,
        importance: data.importance,
        completed: data.completed,
        color: data.color as Task["color"],
        notes: data.notes || "",
      };

      if (type === "routine") {
        setRoutineTasks([...routineTasks, newTask]);
      } else {
        setTomorrowTasks([...tomorrowTasks, newTask]);
      }

      toast.success("Task added successfully");
    } catch (error: any) {
      toast.error("Failed to add task");
      console.error(error);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>, type: "routine" | "tomorrow") => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          title: updates.title,
          duration: updates.duration,
          urgency: updates.urgency,
          importance: updates.importance,
          completed: updates.completed,
          color: updates.color,
          notes: updates.notes || null,
        })
        .eq("id", taskId);

      if (error) throw error;

      const updateList = type === "routine" ? setRoutineTasks : setTomorrowTasks;
      const currentList = type === "routine" ? routineTasks : tomorrowTasks;

      updateList(
        currentList.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      );
    } catch (error: any) {
      toast.error("Failed to update task");
      console.error(error);
    }
  };

  const deleteTask = async (taskId: string, type: "routine" | "tomorrow") => {
    if (!userId) return;

    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);

      if (error) throw error;

      if (type === "routine") {
        setRoutineTasks(routineTasks.filter((task) => task.id !== taskId));
      } else {
        setTomorrowTasks(tomorrowTasks.filter((task) => task.id !== taskId));
      }

      toast.success("Task deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete task");
      console.error(error);
    }
  };

  return {
    routineTasks,
    tomorrowTasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
};
