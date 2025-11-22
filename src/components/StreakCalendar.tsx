import { cn } from "@/lib/utils";

interface StreakCalendarProps {
  completionData: Record<string, number>; // date string -> completion count
}

export const StreakCalendar = ({ completionData }: StreakCalendarProps) => {
  // Generate last 12 months of dates
  const generateCalendarData = () => {
    const weeks: Date[][] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 11);
    startDate.setDate(1);
    
    // Start from the first day of the week
    const firstDay = startDate.getDay();
    const adjustedStart = new Date(startDate);
    adjustedStart.setDate(startDate.getDate() - firstDay);
    
    let currentDate = new Date(adjustedStart);
    let currentWeek: Date[] = [];
    
    // Generate 52 weeks
    for (let i = 0; i < 52 * 7; i++) {
      if (currentDate <= today) {
        currentWeek.push(new Date(currentDate));
      }
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
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

  const weeks = generateCalendarData();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Get month labels for display
  const getMonthLabels = () => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    
    weeks.forEach((week, index) => {
      const month = week[0]?.getMonth();
      if (month !== undefined && month !== lastMonth && index % 4 === 0) {
        labels.push({ month: months[month], weekIndex: index });
        lastMonth = month;
      }
    });
    
    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <div className="w-full overflow-x-auto rounded-2xl bg-card p-6 shadow-soft">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Daily Streak</h3>
        <p className="text-sm text-muted-foreground">Your productivity journey</p>
      </div>
      
      <div className="relative">
        {/* Month labels */}
        <div className="mb-2 flex gap-[3px] text-xs text-muted-foreground">
          {monthLabels.map((label, i) => (
            <div
              key={i}
              style={{ marginLeft: i === 0 ? 0 : `${(label.weekIndex - (monthLabels[i - 1]?.weekIndex || 0)) * 12}px` }}
            >
              {label.month}
            </div>
          ))}
        </div>
        
        {/* Day labels */}
        <div className="flex gap-2">
          <div className="flex flex-col gap-[3px] text-xs text-muted-foreground">
            <div className="h-[10px]">Mon</div>
            <div className="h-[10px]"></div>
            <div className="h-[10px]">Wed</div>
            <div className="h-[10px]"></div>
            <div className="h-[10px]">Fri</div>
            <div className="h-[10px]"></div>
            <div className="h-[10px]"></div>
          </div>
          
          {/* Calendar grid */}
          <div className="flex gap-[3px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map((date, dayIndex) => {
                  const dateStr = formatDate(date);
                  const count = completionData[dateStr] || 0;
                  const isToday = formatDate(new Date()) === dateStr;
                  
                  return (
                    <div
                      key={dayIndex}
                      title={`${dateStr}: ${count} task${count !== 1 ? 's' : ''} completed`}
                      className={cn(
                        "h-[10px] w-[10px] rounded-sm transition-all hover:ring-2 hover:ring-primary/50",
                        getIntensityClass(count),
                        isToday && "ring-2 ring-primary"
                      )}
                    />
                  );
                })}
              </div>
            ))}
          </div>
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
