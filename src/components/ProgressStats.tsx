import { TrendingUp, Target, Clock, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStatsProps {
  completionData: Record<string, number>;
  totalTasksToday: number;
  completedToday: number;
}

export const ProgressStats = ({ completionData, totalTasksToday, completedToday }: ProgressStatsProps) => {



  // Calculate statistics
  const calculateStats = () => {
    const dates = Object.keys(completionData).sort();
    const last7Days = dates.slice(-7);
    const last30Days = dates.slice(-30);
    
    // Completion rate today
    const todayRate = totalTasksToday > 0 ? Math.round((completedToday / totalTasksToday) * 100) : 0;
    
    // Average completions last 7 days
    const avg7Days = last7Days.length > 0
      ? Math.round(last7Days.reduce((sum, date) => sum + (completionData[date] || 0), 0) / last7Days.length)
      : 0;
    
    // Average completions last 30 days
    const avg30Days = last30Days.length > 0
      ? Math.round(last30Days.reduce((sum, date) => sum + (completionData[date] || 0), 0) / last30Days.length)
      : 0;
    
    // Current streak
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (completionData[dateStr] && completionData[dateStr] > 0) {
        streak++;
      } else {
        break;
      }
    }
    
    // Productivity trend (comparing last 7 days to previous 7 days)
    const previous7Days = dates.slice(-14, -7);
    const prevAvg = previous7Days.length > 0
      ? previous7Days.reduce((sum, date) => sum + (completionData[date] || 0), 0) / previous7Days.length
      : 0;
    
    const trend = prevAvg > 0 ? Math.round(((avg7Days - prevAvg) / prevAvg) * 100) : 0;
    
    return { todayRate, avg7Days, avg30Days, streak, trend };


  };

  const stats = calculateStats();

  const statCards = [
    {
      icon: Target,
      label: "Today's Progress",
      value: `${stats.todayRate}%`,
      subtitle: `${completedToday}/${totalTasksToday} tasks`,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: TrendingUp,
      label: "7-Day Trend",
      value: stats.trend >= 0 ? `+${stats.trend}%` : `${stats.trend}%`,
      subtitle: `Avg: ${stats.avg7Days} tasks/day`,
      color: stats.trend >= 0 ? "text-primary" : "text-destructive",
      bgColor: stats.trend >= 0 ? "bg-primary/10" : "bg-destructive/10",
    },
    {
      icon: Clock,
      label: "30-Day Average",
      value: `${stats.avg30Days}`,
      subtitle: "tasks per day",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: `${stats.streak}`,
      subtitle: stats.streak === 1 ? "day" : "days",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="rounded-2xl bg-card p-6 shadow-soft transition-all hover:shadow-medium"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className={cn("text-3xl font-bold", stat.color)}>{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </div>
              <div className={cn("rounded-xl p-3", stat.bgColor)}>
                <Icon className={cn("h-5 w-5", stat.color)} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
