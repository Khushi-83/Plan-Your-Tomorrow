import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, subMonths } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthlyProductivityCalendarProps {
  completionData: { [date: string]: number };
}

export const MonthlyProductivityCalendar = ({ completionData }: MonthlyProductivityCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getIntensity = (count: number) => {
    if (count === 0) return "bg-muted";
    if (count <= 2) return "bg-primary/20";
    if (count <= 4) return "bg-primary/40";
    if (count <= 6) return "bg-primary/60";
    return "bg-primary";
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + 1);
      return next;
    });
  };

  const canGoNext = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth <= new Date();
  };

  const startingDayOfWeek = monthStart.getDay();

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-semibold">
            Monthly Productivity
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousMonth}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {format(currentMonth, "MMMM yyyy")}
            </span>
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
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Week day labels */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {/* Days of the month */}
            {daysInMonth.map((day) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const completedCount = completionData[dateKey] || 0;
              const intensity = getIntensity(completedCount);
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={dateKey}
                  className="aspect-square relative group"
                >
                  <div
                    className={`
                      w-full h-full rounded-lg flex flex-col items-center justify-center
                      transition-all duration-200
                      ${intensity}
                      ${isCurrentDay ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}
                      hover:scale-110 hover:shadow-lg cursor-pointer
                    `}
                  >
                    <span className={`text-sm font-medium ${completedCount > 3 ? "text-primary-foreground" : "text-foreground"}`}>
                      {format(day, "d")}
                    </span>
                    {completedCount > 0 && (
                      <span className={`text-[10px] ${completedCount > 3 ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        {completedCount}
                      </span>
                    )}
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-lg text-xs whitespace-nowrap border border-border">
                      <div className="font-medium">{format(day, "MMM d, yyyy")}</div>
                      <div className="text-muted-foreground">
                        {completedCount} task{completedCount !== 1 ? "s" : ""} completed
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-border/50">
            <span className="text-xs text-muted-foreground mr-2">Less</span>
            {[0, 2, 4, 6, 8].map((count) => (
              <div
                key={count}
                className={`w-4 h-4 rounded ${getIntensity(count)}`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-2">More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
