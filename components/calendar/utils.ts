import { CalendarDay, Event, MonthStats } from './types';
import { EVENT_TYPES, EVENT_STATUS } from './constants';
import { 
  Calendar,
  Car,
  Gamepad2,
  Camera,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const getDaysInMonth = (date: Date, events: Event[]): CalendarDay[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days: CalendarDay[] = [];
  const currentDate = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === currentDate.toDateString();
    });
    
    days.push({
      date: new Date(currentDate),
      isCurrentMonth: currentDate.getMonth() === month,
      isToday: currentDate.toDateString() === new Date().toDateString(),
      events: dayEvents
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return days;
};

export const getEventIcon = (type: string) => {
  switch (type) {
    case EVENT_TYPES.RENTAL:
      return Car;
    case EVENT_TYPES.MAINTENANCE:
      return AlertCircle;
    case EVENT_TYPES.MEETING:
      return User;
    case EVENT_TYPES.REMINDER:
      return Clock;
    default:
      return Calendar;
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case EVENT_STATUS.COMPLETED:
      return CheckCircle;
    case EVENT_STATUS.ONGOING:
      return Clock;
    case EVENT_STATUS.CANCELLED:
      return XCircle;
    default:
      return AlertCircle;
  }
};

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'vehicle':
      return Car;
    case 'gaming':
      return Gamepad2;
    case 'photography':
      return Camera;
    default:
      return Calendar;
  }
};

export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const getMonthStats = (events: Event[], currentDate: Date): MonthStats => {
  return {
    totalEvents: events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getMonth() === currentDate.getMonth() &&
             eventDate.getFullYear() === currentDate.getFullYear();
    }).length,
    activeRentals: events.filter(event => event.type === EVENT_TYPES.RENTAL && event.status === EVENT_STATUS.ONGOING).length,
    scheduledMaintenance: events.filter(event => event.type === EVENT_TYPES.MAINTENANCE && event.status === EVENT_STATUS.SCHEDULED).length,
    upcomingReminders: events.filter(event => event.type === EVENT_TYPES.REMINDER && new Date(event.start) >= new Date()).length
  };
};

export const filterEvents = (events: Event[], searchTerm: string): Event[] => {
  return events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.item.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const getUpcomingEvents = (events: Event[], limit: number = 5): Event[] => {
  return events
    .filter(event => new Date(event.start) >= new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, limit);
};

export const getTodayEvents = (events: Event[]): Event[] => {
  return events.filter(event => {
    const eventDate = new Date(event.start);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  });
};