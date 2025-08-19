import { EVENT_TYPES, EVENT_STATUS, EVENT_CATEGORIES } from './constants';

export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];
export type EventStatus = typeof EVENT_STATUS[keyof typeof EVENT_STATUS];
export type EventCategory = typeof EVENT_CATEGORIES[keyof typeof EVENT_CATEGORIES];
export type ViewType = 'month' | 'week' | 'day';

export interface Event {
  id: number;
  title: string;
  description: string;
  start: string;
  end: string;
  type: EventType;
  status: EventStatus;
  customer: string;
  item: string;
  category: EventCategory;
  location?: string;
  color: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
}

export interface NewEvent {
  title: string;
  description: string;
  start: string;
  end: string;
  type: EventType;
  customer: string;
  item: string;
  category: string;
  location: string;
}

export interface MonthStats {
  totalEvents: number;
  activeRentals: number;
  scheduledMaintenance: number;
  upcomingReminders: number;
}