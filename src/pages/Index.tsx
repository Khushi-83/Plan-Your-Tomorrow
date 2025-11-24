import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TaskCard, Task } from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { StreakCalendar } from "@/components/StreakCalendar";
import { ProgressStats } from "@/components/ProgressStats";
import { TemplateSelector } from "@/components/TemplateSelector";
import { useTasks } from "@/hooks/useTasks";
import { useTaskCompletion } from "@/hooks/useTaskCompletion";
import { User, Session } from '@supabase/supabase-js';
import { TaskTemplate } from "@/data/taskTemplates";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  const { routineTasks, tomorrowTasks, loading, addTask, updateTask, deleteTask } = useTasks(user?.id);
  const { completionData, getTodayStats } = useTaskCompletion(user?.id, routineTasks, tomorrowTasks);
  const { completedToday, totalToday } = getTodayStats();

  const colors: Task["color"][] = ["lavender", "mint", "peach", "sky"];

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          setTimeout(() => {
            navigate("/auth");
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
    toast.success("Signed out successfully");
  };

  const handleAddRoutineTask = () => {
    const newTask: Omit<Task, "id"> = {
      title: "New Routine Task",
      duration: "",
      urgency: 3,
      importance: 3,
      completed: false,
      color: colors[routineTasks.length % colors.length],
      notes: "",
    };
    addTask(newTask, "routine");
  };

  const handleAddTask = () => {
    const newTask: Omit<Task, "id"> = {
      title: "New Task",
      duration: "",
      urgency: 3,
      importance: 3,
      completed: false,
      color: colors[tomorrowTasks.length % colors.length],
      notes: "",
    };
    addTask(newTask, "tomorrow");
  };

  const handleUpdateRoutineTask = (updatedTask: Task) => {
    updateTask(updatedTask.id, updatedTask, "routine");
  };

  const handleUpdateTomorrowTask = (updatedTask: Task) => {
    updateTask(updatedTask.id, updatedTask, "tomorrow");
  };

  const handleDeleteRoutineTask = (id: string) => {
    deleteTask(id, "routine");
  };

  const handleDeleteTomorrowTask = (id: string) => {
    deleteTask(id, "tomorrow");
  };

  const handleSelectRoutineTemplate = (template: TaskTemplate) => {
    template.tasks.forEach((taskData, index) => {
      const newTask: Omit<Task, "id"> = {
        ...taskData,
        color: colors[(routineTasks.length + index) % colors.length],
        completed: false,
      };
      addTask(newTask, "routine");
    });
    toast.success(`Added ${template.tasks.length} tasks from ${template.name}`);
  };

  const handleSelectTomorrowTemplate = (template: TaskTemplate) => {
    template.tasks.forEach((taskData, index) => {
      const newTask: Omit<Task, "id"> = {
        ...taskData,
        color: colors[(tomorrowTasks.length + index) % colors.length],
        completed: false,
      };
      addTask(newTask, "tomorrow");
    });
    toast.success(`Added ${template.tasks.length} tasks from ${template.name}`);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-5xl font-bold tracking-tight text-foreground">
              Tomorrow Planner
            </h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
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
            <div className="flex items-center gap-2">
              <TemplateSelector onSelectTemplate={handleSelectRoutineTemplate} />
              <Button
                onClick={handleAddRoutineTask}
                variant="outline"
                className="rounded-xl shadow-soft transition-all hover:shadow-medium"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Routine Task
              </Button>
            </div>
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
            <div className="flex items-center gap-2">
              <TemplateSelector onSelectTemplate={handleSelectTomorrowTemplate} />
              <Button
                onClick={handleAddTask}
                className="rounded-xl shadow-soft transition-all hover:shadow-medium"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
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
