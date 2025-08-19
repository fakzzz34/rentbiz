import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Calendar, Clock, AlertCircle, Car, Plus } from 'lucide-react';
import { CalendarGrid } from './calendar/CalendarGrid';
import { CalendarSidebar } from './calendar/CalendarSidebar';
import { EventModal } from './calendar/EventModal';
import { Event, NewEvent, ViewType } from './calendar/types';
import { EVENT_TYPES, EVENT_COLORS, DEFAULT_EVENTS } from './calendar/constants';
import { 
  getDaysInMonth, 
  getMonthStats, 
  filterEvents, 
  getUpcomingEvents, 
  getTodayEvents 
} from './calendar/utils';

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<ViewType>('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<Event[]>(DEFAULT_EVENTS);

  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: '',
    description: '',
    start: '',
    end: '',
    type: EVENT_TYPES.RENTAL,
    customer: '',
    item: '',
    category: '',
    location: ''
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'today' as any) {
      setCurrentDate(new Date());
      return;
    }
    
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.start || !newEvent.end) return;

    const event: Event = {
      id: Date.now(),
      title: newEvent.title,
      description: newEvent.description,
      start: newEvent.start,
      end: newEvent.end,
      type: newEvent.type,
      status: 'scheduled',
      customer: newEvent.customer,
      item: newEvent.item,
      category: newEvent.category || 'general',
      location: newEvent.location,
      color: EVENT_COLORS.PRIMARY
    };

    setEvents(prev => [...prev, event]);
    setNewEvent({
      title: '',
      description: '',
      start: '',
      end: '',
      type: EVENT_TYPES.RENTAL,
      customer: '',
      item: '',
      category: '',
      location: ''
    });
    setShowEventModal(false);
  };

  const filteredEvents = filterEvents(events, searchTerm);
  const upcomingEvents = getUpcomingEvents(filteredEvents);
  const todayEvents = getTodayEvents(events);
  const monthStats = getMonthStats(events, currentDate);
  const calendarDays = getDaysInMonth(currentDate, events);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-foreground">Calendar & Scheduling</h2>
          <p className="text-muted-foreground">Kelola jadwal rental, maintenance, dan agenda bisnis</p>
        </div>
        <div className="flex gap-3">
          <div className="flex border border-border rounded-lg">
            {(['month', 'week', 'day'] as const).map((v) => (
              <Button
                key={v}
                variant={view === v ? "default" : "ghost"}
                size="sm"
                onClick={() => setView(v)}
                className={`rounded-none first:rounded-l-lg last:rounded-r-lg ${
                  view === v ? 'bg-primary text-primary-foreground' : ''
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </Button>
            ))}
          </div>
          <Button onClick={() => setShowEventModal(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold text-foreground">{monthStats.totalEvents}</p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Rentals</p>
                <p className="text-2xl font-bold text-blue-600">{monthStats.activeRentals}</p>
              </div>
              <Car className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Maintenance</p>
                <p className="text-2xl font-bold text-orange-600">{monthStats.scheduledMaintenance}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reminders</p>
                <p className="text-2xl font-bold text-red-600">{monthStats.upcomingReminders}</p>
              </div>
              <Clock className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <CalendarGrid
            currentDate={currentDate}
            calendarDays={calendarDays}
            onNavigateMonth={navigateMonth}
            onDateSelect={setSelectedDate}
            onEventSelect={setSelectedEvent}
          />
        </div>

        {/* Sidebar */}
        <CalendarSidebar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          todayEvents={todayEvents}
          upcomingEvents={upcomingEvents}
          onEventSelect={setSelectedEvent}
        />
      </div>

      {/* Event Modal */}
      <EventModal
        show={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSubmit={handleAddEvent}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
      />
    </div>
  );
}