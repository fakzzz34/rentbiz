import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { Event } from './types';
import { getEventIcon, getCategoryIcon, getStatusIcon, formatTime, formatDate } from './utils';

interface CalendarSidebarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  todayEvents: Event[];
  upcomingEvents: Event[];
  onEventSelect: (event: Event) => void;
}

export function CalendarSidebar({ 
  searchTerm, 
  onSearchChange, 
  todayEvents, 
  upcomingEvents, 
  onEventSelect 
}: CalendarSidebarProps) {
  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Search */}
      <Card className="card-shadow">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Cari event..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Today's Events */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-sm">Today's Events</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {todayEvents.length > 0 ? (
            <div className="space-y-3">
              {todayEvents.map((event) => {
                const EventIcon = getEventIcon(event.type);
                const StatusIcon = getStatusIcon(event.status);
                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg cursor-pointer"
                    onClick={() => onEventSelect(event)}
                  >
                    <div className="mt-1">
                      <EventIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">{event.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(event.start)} - {formatTime(event.end)}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <StatusIcon className="w-4 h-4" />
                        <span className="text-xs text-muted-foreground capitalize">{event.status}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Tidak ada event hari ini
            </p>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-sm">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {upcomingEvents.map((event) => {
              const CategoryIcon = getCategoryIcon(event.category);
              return (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg cursor-pointer"
                  onClick={() => onEventSelect(event)}
                >
                  <div className="mt-1">
                    <CategoryIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">{event.title}</h4>
                    <p className="text-xs text-muted-foreground">{formatDate(event.start)}</p>
                    <p className="text-xs text-muted-foreground">{event.customer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}