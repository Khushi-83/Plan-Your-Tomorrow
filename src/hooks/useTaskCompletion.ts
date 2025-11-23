import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/components/TaskCard";

interface CompletionData {
  [date: string]: number;
}

export const useTaskCompletion = (
  userId: string | undefined,
  routineTasks: Task[],
  tomorrowTasks: Task[]
) => {
  const [completionData, setCompletionData] = useState<CompletionData>({});

  useEffect(() => {
    if (userId) {
      fetchCompletionData();
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      updateTodayCompletion();
    }
  }, [routineTasks, tomorrowTasks, userId]);

  const fetchCompletionData = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("task_completions")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      const completions: CompletionData = {};
      data.forEach((item) => {
        completions[item.completion_date] = item.completed_count;
      });

      setCompletionData(completions);
    } catch (error) {
      console.error("Failed to fetch completion data:", error);
    }
  };

  const updateTodayCompletion = async () => {
    if (!userId) return;

    const today = new Date().toISOString().split("T")[0];
    const allTasks = [...routineTasks, ...tomorrowTasks];
    const completedCount = allTasks.filter((task) => task.completed).length;

    try {
      const { error } = await supabase
        .from("task_completions")
        .upsert({
          user_id: userId,
          completion_date: today,
          completed_count: completedCount,
        });

      if (error) throw error;

      setCompletionData((prev) => ({
        ...prev,
        [today]: completedCount,
      }));
    } catch (error) {
      console.error("Failed to update completion data:", error);
    }
  };

  const getTodayStats = () => {
    const allTasks = [...routineTasks, ...tomorrowTasks];
    const completedToday = allTasks.filter((task) => task.completed).length;
    const totalToday = allTasks.length;

    return { completedToday, totalToday };
  };

  return { completionData, getTodayStats };
};
