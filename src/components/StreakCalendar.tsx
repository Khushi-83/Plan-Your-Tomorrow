import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface StreakCalendarProps {
  completionData: Record<string, number>; // date string -> completion count
}

export const StreakCalendar = ({ completionData }: StreakCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar data for the current month
  const generateMonthCalendar = () => {
    const weeks: Date[][] = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from the first day of the week (Sunday)
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    let currentDate = new Date(startDate);
    let currentWeek: Date[] = [];
    
    // Generate 6 weeks to cover any month layout
    for (let i = 0; i < 42; i++) {
      currentWeek.push(new Date(currentDate));
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return { weeks, month: firstDay, lastDay };
  };

  const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-muted/30";
    if (count <= 2) return "bg-primary/20";
    if (count <= 4) return "bg-primary/40";
    if (count <= 6) return "bg-primary/60";
    return "bg-primary/80";
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const { weeks, month, lastDay } = generateMonthCalendar();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    const today = new Date();
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    if (nextMonth <= today) {
      setCurrentMonth(nextMonth);
    }
  };

  const isCurrentMonth = () => {
    const today = new Date();
    return currentMonth.getMonth() === today.getMonth() && 
           currentMonth.getFullYear() === today.getFullYear();
  };

  return (
    <div className="w-full rounded-2xl bg-card p-6 shadow-soft">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Daily Streak</h3>
          <p className="text-sm text-muted-foreground">
            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousMonth}
            className="h-8 w-8 p-0"
          >
            ←
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextMonth}
            disabled={isCurrentMonth()}
            className="h-8 w-8 p-0"
          >
            →
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="space-y-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-2">
              {week.map((date, dayIndex) => {
                const dateStr = formatDate(date);
                const count = completionData[dateStr] || 0;
                const isToday = formatDate(new Date()) === dateStr;
                const isCurrentMonthDate = date.getMonth() === currentMonth.getMonth();
                const isFutureDate = date > new Date();
                
                return (
                  <div
                    key={dayIndex}
                    title={isCurrentMonthDate && !isFutureDate ? `${dateStr}: ${count} task${count !== 1 ? 's' : ''} completed` : ''}
                    className={cn(
                      "aspect-square rounded-lg transition-all flex items-center justify-center text-xs font-medium relative",
                      isCurrentMonthDate && !isFutureDate && "hover:ring-2 hover:ring-primary/50 cursor-pointer",
                      !isCurrentMonthDate && "opacity-30",
                      isFutureDate && "opacity-20 cursor-not-allowed",
                      isCurrentMonthDate && !isFutureDate && getIntensityClass(count),
                      isToday && "ring-2 ring-primary"
                    )}
                  >
                    <span className={cn(
                      "relative z-10",
                      count > 0 && isCurrentMonthDate ? "text-primary-foreground font-semibold" : "text-muted-foreground"
                    )}>
                      {date.getDate()}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-6 flex items-center justify-end gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded-sm bg-muted/30" />
            <div className="h-3 w-3 rounded-sm bg-primary/20" />
            <div className="h-3 w-3 rounded-sm bg-primary/40" />
            <div className="h-3 w-3 rounded-sm bg-primary/60" />
            <div className="h-3 w-3 rounded-sm bg-primary/80" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
