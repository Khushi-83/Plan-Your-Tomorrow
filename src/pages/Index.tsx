import { useState, useEffect } from "react";
import { TaskCard, Task } from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { StreakCalendar } from "@/components/StreakCalendar";
import { ProgressStats } from "@/components/ProgressStats";
import { useTaskTracking } from "@/hooks/useTaskTracking";

const DEFAULT_ROUTINE: Task[] = [
  {
    id: "1",
    title: "Morning Yoga",
    duration: "30 minutes",
    urgency: 4,
    importance: 4,
    completed: false,
    color: "lavender",
  },
  {
    id: "2",
    title: "DSA Practice",
    duration: "1 hour",
    urgency: 5,
    importance: 5,
    completed: false,
    color: "mint",
  },
  {
    id: "3",
    title: "Learning Session",
    duration: "45 minutes",
    urgency: 4,
    importance: 5,
    completed: false,
    color: "peach",
  },
  {
    id: "4",
    title: "Reading Time",
    duration: "30 minutes",
    urgency: 3,
    importance: 4,
    completed: false,
    color: "sky",
  },
];

const Index = () => {
  const [routineTasks, setRoutineTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem("routineTasks");
    return stored ? JSON.parse(stored) : DEFAULT_ROUTINE;
  });
  const [tomorrowTasks, setTomorrowTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem("tomorrowTasks");
    return stored ? JSON.parse(stored) : [];
  });
  const { completionData, getTodayStats } = useTaskTracking(routineTasks, tomorrowTasks);
  const { completedToday, totalToday } = getTodayStats();

  const colors: Task["color"][] = ["lavender", "mint", "peach", "sky"];

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("routineTasks", JSON.stringify(routineTasks));
  }, [routineTasks]);

  useEffect(() => {
    localStorage.setItem("tomorrowTasks", JSON.stringify(tomorrowTasks));
  }, [tomorrowTasks]);

  // Check for new day and reset tasks at midnight
  useEffect(() => {
    const checkAndResetForNewDay = () => {
      const lastResetDate = localStorage.getItem("lastResetDate");
      const today = new Date().toISOString().split('T')[0];
      
      if (lastResetDate !== today) {
        // New day detected - reset all task completion statuses
        setRoutineTasks(prev => prev.map(task => ({ ...task, completed: false })));
        setTomorrowTasks(prev => prev.map(task => ({ ...task, completed: false })));
        localStorage.setItem("lastResetDate", today);
      }
    };

    // Check immediately on mount
    checkAndResetForNewDay();

    // Check every minute for midnight crossing
    const interval = setInterval(checkAndResetForNewDay, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleAddTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: "New Task",
      duration: "",
      urgency: 3,
      importance: 3,
      completed: false,
      color: colors[tomorrowTasks.length % colors.length],
    };
    setTomorrowTasks([...tomorrowTasks, newTask]);
    toast.success("Task added to Tomorrow's list");
  };

  const handleUpdateRoutineTask = (updatedTask: Task) => {
    setRoutineTasks(
      routineTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleUpdateTomorrowTask = (updatedTask: Task) => {
    setTomorrowTasks(
      tomorrowTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleDeleteRoutineTask = (id: string) => {
    setRoutineTasks(routineTasks.filter((task) => task.id !== id));
    toast.success("Task removed from routine");
  };

  const handleDeleteTomorrowTask = (id: string) => {
    setTomorrowTasks(tomorrowTasks.filter((task) => task.id !== id));
    toast.success("Task removed");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="mb-3 text-5xl font-bold tracking-tight text-foreground">
            Tomorrow Planner
          </h1>
          <p className="text-lg text-muted-foreground">
            Plan your day with clarity and focus
          </p>
        </header>

        {/* Progress Statistics */}
        <section className="mb-12">
          <ProgressStats 
            completionData={completionData}
            totalTasksToday={totalToday}
            completedToday={completedToday}
          />
        </section>

        {/* Streak Calendar */}
        <section className="mb-12">
          <StreakCalendar completionData={completionData} />
        </section>

        {/* Default Daily Routine Section */}
        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-foreground">
              Default Daily Routine
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {routineTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={handleUpdateRoutineTask}
                onDelete={handleDeleteRoutineTask}
              />
            ))}
          </div>
        </section>

        {/* Tomorrow's Tasks Section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-foreground">
              Tomorrow's Tasks
            </h2>
            <Button
              onClick={handleAddTask}
              className="rounded-xl shadow-soft transition-all hover:shadow-medium"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
          {tomorrowTasks.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border bg-muted/30 p-12 text-center">
              <p className="text-lg text-muted-foreground">
                No tasks planned for tomorrow yet.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Click "Add Task" to get started!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tomorrowTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={handleUpdateTomorrowTask}
                  onDelete={handleDeleteTomorrowTask}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Index;
