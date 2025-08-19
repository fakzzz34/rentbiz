export const EVENT_TYPES = {
  RENTAL: 'rental',
  MAINTENANCE: 'maintenance', 
  MEETING: 'meeting',
  REMINDER: 'reminder'
} as const;

export const EVENT_STATUS = {
  SCHEDULED: 'scheduled',
  ONGOING: 'ongoing', 
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const EVENT_CATEGORIES = {
  VEHICLE: 'vehicle',
  GAMING: 'gaming',
  PHOTOGRAPHY: 'photography',
  GENERAL: 'general',
  FINANCIAL: 'financial'
} as const;

export const EVENT_COLORS = {
  PRIMARY: '#4f46e5',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
  PURPLE: '#8b5cf6'
} as const;

export const DAYS_OF_WEEK = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export const VIEW_TYPES = ['month', 'week', 'day'] as const;

export const DEFAULT_EVENTS = [
  {
    id: 1,
    title: 'Honda Beat - Rental',
    description: 'Rental Honda Beat untuk Andi Pratama',
    start: '2024-01-15T09:00:00',
    end: '2024-01-15T17:00:00',
    type: EVENT_TYPES.RENTAL,
    status: EVENT_STATUS.ONGOING,
    customer: 'Andi Pratama',
    item: 'Honda Beat 2020',
    category: EVENT_CATEGORIES.VEHICLE,
    location: 'Depot Utama',
    color: EVENT_COLORS.PRIMARY
  },
  {
    id: 2,
    title: 'PS5 - Rental',
    description: 'Rental PlayStation 5 untuk weekend',
    start: '2024-01-15T14:00:00',
    end: '2024-01-16T10:00:00',
    type: EVENT_TYPES.RENTAL,
    status: EVENT_STATUS.SCHEDULED,
    customer: 'Budi Santoso',
    item: 'PlayStation 5',
    category: EVENT_CATEGORIES.GAMING,
    location: 'Cabang Gaming',
    color: EVENT_COLORS.SUCCESS
  },
  {
    id: 3,
    title: 'Canon EOS R6 - Maintenance',
    description: 'Scheduled maintenance untuk Canon EOS R6',
    start: '2024-01-16T10:00:00',
    end: '2024-01-16T14:00:00',
    type: EVENT_TYPES.MAINTENANCE,
    status: EVENT_STATUS.SCHEDULED,
    customer: 'Tech Support',
    item: 'Canon EOS R6',
    category: EVENT_CATEGORIES.PHOTOGRAPHY,
    location: 'Workshop',
    color: EVENT_COLORS.WARNING
  },
  {
    id: 4,
    title: 'Monthly Meeting',
    description: 'Meeting bulanan dengan semua operator',
    start: '2024-01-16T15:00:00',
    end: '2024-01-16T17:00:00',
    type: EVENT_TYPES.MEETING,
    status: EVENT_STATUS.SCHEDULED,
    customer: 'All Operators',
    item: 'Meeting Room',
    category: EVENT_CATEGORIES.GENERAL,
    location: 'Kantor Pusat',
    color: EVENT_COLORS.PURPLE
  },
  {
    id: 5,
    title: 'Payment Reminder',
    description: 'Reminder pembayaran sewa tempat bulan ini',
    start: '2024-01-20T09:00:00',
    end: '2024-01-20T09:30:00',
    type: EVENT_TYPES.REMINDER,
    status: EVENT_STATUS.SCHEDULED,
    customer: 'System',
    item: 'Sewa Tempat',
    category: EVENT_CATEGORIES.FINANCIAL,
    location: '',
    color: EVENT_COLORS.DANGER
  },
  {
    id: 6,
    title: 'Xbox Series X - Rental',
    description: 'Rental Xbox Series X untuk Sari Dewi',
    start: '2024-01-17T11:00:00',
    end: '2024-01-17T20:00:00',
    type: EVENT_TYPES.RENTAL,
    status: EVENT_STATUS.SCHEDULED,
    customer: 'Sari Dewi',
    item: 'Xbox Series X',
    category: EVENT_CATEGORIES.GAMING,
    location: 'Cabang Gaming',
    color: EVENT_COLORS.SUCCESS
  },
  {
    id: 7,
    title: 'Yamaha Aerox - Rental',
    description: 'Rental Yamaha Aerox untuk Maya Putri',
    start: '2024-01-17T08:30:00',
    end: '2024-01-17T18:30:00',
    type: EVENT_TYPES.RENTAL,
    status: EVENT_STATUS.SCHEDULED,
    customer: 'Maya Putri',
    item: 'Yamaha Aerox 155',
    category: EVENT_CATEGORIES.VEHICLE,
    location: 'Depot Utama',
    color: EVENT_COLORS.PRIMARY
  },
  {
    id: 8,
    title: 'Hair Styling Equipment - Maintenance',
    description: 'Maintenance peralatan salon mingguan',
    start: '2024-01-18T09:00:00',
    end: '2024-01-18T12:00:00',
    type: EVENT_TYPES.MAINTENANCE,
    status: EVENT_STATUS.SCHEDULED,
    customer: 'Salon Team',
    item: 'Hair Dryer Professional',
    category: EVENT_CATEGORIES.GENERAL,
    location: 'Salon Workshop',
    color: EVENT_COLORS.WARNING
  },
  {
    id: 9,
    title: 'Sony A7 III - Rental',
    description: 'Rental kamera untuk acara wedding',
    start: '2024-01-18T14:00:00',
    end: '2024-01-19T22:00:00',
    type: EVENT_TYPES.RENTAL,
    status: EVENT_STATUS.SCHEDULED,
    customer: 'Reza Photographer',
    item: 'Sony A7 III + Lens Kit',
    category: EVENT_CATEGORIES.PHOTOGRAPHY,
    location: 'Photo Studio',
    color: EVENT_COLORS.INFO
  },
  {
    id: 10,
    title: 'Nintendo Switch - Rental',
    description: 'Rental Nintendo Switch untuk event ulang tahun',
    start: '2024-01-19T13:00:00',
    end: '2024-01-20T13:00:00',
    type: EVENT_TYPES.RENTAL,
    status: EVENT_STATUS.SCHEDULED,
    customer: 'Ahmad Family',
    item: 'Nintendo Switch OLED',
    category: EVENT_CATEGORIES.GAMING,
    location: 'Cabang Gaming',
    color: EVENT_COLORS.SUCCESS
  },
  {
    id: 11,
    title: 'Honda Scoopy - Rental',
    description: 'Rental Honda Scoopy untuk keperluan harian',
    start: '2024-01-19T07:00:00',
    end: '2024-01-19T19:00:00',
    type: EVENT_TYPES.RENTAL,
    status: EVENT_STATUS.SCHEDULED,
    customer: 'Lina Sari',
    item: 'Honda Scoopy 110',
    category: EVENT_CATEGORIES.VEHICLE,
    location: 'Depot Utama',
    color: EVENT_COLORS.PRIMARY
  },
  {
    id: 12,
    title: 'Monthly Expense Reminder',
    description: 'Reminder pembayaran listrik dan internet',
    start: '2024-01-21T08:00:00',
    end: '2024-01-21T08:30:00',
    type: EVENT_TYPES.REMINDER,
    status: EVENT_STATUS.SCHEDULED,
    customer: 'System',
    item: 'Utility Bills',
    category: EVENT_CATEGORIES.FINANCIAL,
    location: '',
    color: EVENT_COLORS.DANGER
  },
  {
    id: 13,
    title: 'Team Training Session',
    description: 'Training customer service untuk operator baru',
    start: '2024-01-22T13:00:00',
    end: '2024-01-22T16:00:00',
    type: EVENT_TYPES.MEETING,
    status: EVENT_STATUS.SCHEDULED,
    customer: 'New Operators',
    item: 'Training Room',
    category: EVENT_CATEGORIES.GENERAL,
    location: 'Kantor Pusat',
    color: EVENT_COLORS.PURPLE
  },
  {
    id: 14,
    title: 'MacBook Pro - Rental',
    description: 'Rental laptop untuk presentasi business',
    start: '2024-01-22T09:00:00',
    end: '2024-01-23T17:00:00',
    type: EVENT_TYPES.RENTAL,
    status: EVENT_STATUS.SCHEDULED,
    customer: 'PT. Digital Solution',
    item: 'MacBook Pro M2',
    category: EVENT_CATEGORIES.GENERAL,
    location: 'Tech Center',
    color: EVENT_COLORS.INFO
  },
  {
    id: 15,
    title: 'Inventory Check',
    description: 'Pengecekan inventori bulanan semua item',
    start: '2024-01-23T10:00:00',
    end: '2024-01-23T15:00:00',
    type: EVENT_TYPES.MAINTENANCE,
    status: EVENT_STATUS.SCHEDULED,
    customer: 'Inventory Team',
    item: 'All Items',
    category: EVENT_CATEGORIES.GENERAL,
    location: 'All Locations',
    color: EVENT_COLORS.WARNING
  }
];