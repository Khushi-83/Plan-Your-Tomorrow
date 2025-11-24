import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StreakCalendarProps {
  completionData: Record<string, number>; // date string -> completion count
}

export const StreakCalendar = ({ completionData }: StreakCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar data for the selected month
  const generateCalendarData = () => {
    const weeks: Date[][] = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of current month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Start from the first day of the week containing the first day of the month
    const firstDay = firstDayOfMonth.getDay();
    const adjustedStart = new Date(firstDayOfMonth);
    adjustedStart.setDate(firstDayOfMonth.getDate() - firstDay);
    
    let currentDate = new Date(adjustedStart);
    let currentWeek: Date[] = [];
    
    // Generate weeks until we've covered the entire month
    while (currentDate <= lastDayOfMonth || currentWeek.length > 0) {
      if (currentWeek.length < 7) {
        currentWeek.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    return weeks;
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

  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  const canGoNext = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth <= new Date();
  };

  const weeks = generateCalendarData();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Get current month name
  const currentMonthName = months[currentMonth.getMonth()];
  const currentYear = currentMonth.getFullYear();

  return (
    <div className="w-full overflow-x-auto rounded-2xl bg-card p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Daily Streak - {currentMonthName} {currentYear}</h3>
          <p className="text-sm text-muted-foreground">Your productivity this month</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextMonth}
            disabled={!canGoNext()}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="relative">
        {/* Week day labels */}
        <div className="mb-2 flex gap-[3px] text-xs text-muted-foreground">
          <div className="w-[10px]">S</div>
          <div className="w-[10px]">M</div>
          <div className="w-[10px]">T</div>
          <div className="w-[10px]">W</div>
          <div className="w-[10px]">T</div>
          <div className="w-[10px]">F</div>
          <div className="w-[10px]">S</div>
        </div>
        
        {/* Calendar grid */}
        <div className="flex flex-col gap-[3px]">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex gap-[3px]">
              {week.map((date, dayIndex) => {
                const dateStr = formatDate(date);
                const count = completionData[dateStr] || 0;
                const isToday = formatDate(new Date()) === dateStr;
                const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                
                return (
                  <div
                    key={dayIndex}
                    title={`${dateStr}: ${count} task${count !== 1 ? 's' : ''} completed`}
                    className={cn(
                      "h-[32px] w-[32px] rounded-lg transition-all hover:ring-2 hover:ring-primary/50 flex items-center justify-center text-xs font-medium",
                      isCurrentMonth ? getIntensityClass(count) : "bg-muted/10 text-muted-foreground/30",
                      isToday && "ring-2 ring-primary"
                    )}
                  >
                    {date.getDate()}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="h-[10px] w-[10px] rounded-sm bg-muted/30" />
            <div className="h-[10px] w-[10px] rounded-sm bg-primary/20" />
            <div className="h-[10px] w-[10px] rounded-sm bg-primary/40" />
            <div className="h-[10px] w-[10px] rounded-sm bg-primary/60" />
            <div className="h-[10px] w-[10px] rounded-sm bg-primary/80" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
