import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { CalendarDay, Event } from './types';
import { DAYS_OF_WEEK } from './constants';

interface CalendarGridProps {
  currentDate: Date;
  calendarDays: CalendarDay[];
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onDateSelect: (date: Date) => void;
  onEventSelect: (event: Event) => void;
}

export function CalendarGrid({ 
  currentDate, 
  calendarDays, 
  onNavigateMonth, 
  onDateSelect, 
  onEventSelect 
}: CalendarGridProps) {
  return (
    <Card className="card-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => onNavigateMonth('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="text-xl font-semibold">
              {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigateMonth('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onNavigateMonth('today' as any)}>
              Today
            </Button>
            <Button variant="ghost" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`min-h-[80px] p-1 border border-border rounded-lg cursor-pointer transition-colors ${
                day.isCurrentMonth ? 'bg-background' : 'bg-muted/20'
              } ${
                day.isToday ? 'ring-2 ring-primary' : ''
              } hover:bg-muted/40`}
              onClick={() => onDateSelect(day.date)}
            >
              <div className={`text-sm font-medium mb-1 ${
                day.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
              } ${
                day.isToday ? 'text-primary font-bold' : ''
              }`}>
                {day.date.getDate()}
              </div>
              
              <div className="space-y-1">
                {day.events.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className="text-xs p-1 rounded text-white truncate"
                    style={{ backgroundColor: event.color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventSelect(event);
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {day.events.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{day.events.length - 2} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}