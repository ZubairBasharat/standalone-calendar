import type { AssignedScheduler, CarerResponse } from '@/features/api/types';

export const carers = [
    { id: "k1", name: "Makhdoom", initials: "MK", hours: 8 },
    { id: "k2", name: "Iqra gfalid", initials: "IG", hours: 8 },
    { id: "k3", name: "John Doe", initials: "JD", hours: 8 },
    { id: "k4", name: "Sarah Smith", initials: "SS", hours: 8 },
]

export const colorMap: Record<ColorKey, string> = {
  red: "bg-red-600",
  green: "bg-green-600",
  blue: "bg-blue-600",
  yellow: "bg-yellow-600",
  purple: "bg-purple-600",
  orange: "bg-orange-600",
  teal: "bg-teal-600",
  pink: "bg-pink-600",
  cyan: "bg-cyan-600",
  gray: "bg-gray-600",
}

export const events = [
  {
    id: "1",
    title: "Booking 1",
    startRecur: "2026-01-19",        // recurrence starts on this date
    endRecur: "2026-02-19",          // recurrence ends on this date (exclusive)
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Sunday (0) to Saturday (6)
    startTime: "08:00:00",            // time of day the event starts
    endTime: "10:15:00",              // time of day the event ends
    resourceId: "c1",
    status: "pending",
    shiftType: "nursing",
    carer: {
      name: "Makhdoom",
    }
  },
   {
    id: "2",
    title: "Booking 2",
    start: "2026-01-19",
    end: "2026-01-19",
    resourceId: "c1",
    status: "dropped",
    shiftType: "companionship",
    carer: {
      name: "Makhdoom",
    }
  },
   {
    id: "3",
    title: "Booking 3",
    start: "2026-01-19",
    end: "2026-01-19",
    resourceId: "c1",
    status: "Vacant",
    shiftType: "personal_care",
    carer: {
      name: "Makhdoom",
    }
  },
  {
    id: "4",
    title: "Booking 4",
    start: "2026-01-20",
    end: "2026-01-2202",
    resourceId: "c1",
    status: "confirmed",
    shiftType: "domestic_care",
    carer: {
      name: "Makhdoom",
    }
  },
]

export const calendarViewOptions = {
  resource: [
    { id: "resourceTimelineWeek", name: "Weekly" },
    { id: "resourceTimelineDay", name: "Daily" }
  ],
  timeGrid: [
    { id: "timeGridDay", name: "Daily" },
    { id: "timeGridWeek", name: "Weekly" },
    { id: "dayGridMonth", name: "Monthly" }
  ]
}


export type Client = {
  id: string
  title: string
  initials: string
  hours: number | null
  colorClass: string;
  type: string;
}

export type ColorKey =
  | "red"
  | "green"
  | "blue"
  | "yellow"
  | "purple"
  | "orange"
  | "teal"
  | "pink"
  | "cyan"
  | "gray"

export const statusColorMap: Record<string, string> = {
  'all': 'bg-slate-400',
  'job board': 'bg-purple-500',
  'pending': 'bg-red-500',
  'confirmed': 'bg-green-700',
  'Vacant': 'bg-red-600',
  'dropped': 'bg-slate-500',
};

export const statuses = [
  { id: "all", name: "All Status" },
  { id: "confirmed", name: "Confirmed" },
  { id: "pending", name: "Pending" },
  { id: "Vacant", name: "Vacant" },
  { id: "job board", name: "Job Board" },
  { id: "dropped", name: "Dropped" },
]

export const shiftTypes = [
  { id: "all", name: "All Types" },
  { id: "personal_care", name: "Personal Care" },
  { id: "domestic_care", name: "Domestic Care" },
  { id: "nursing", name: "Nursing" },
  { id: "companionship", name: "Companionship" },
]

export const formatTime12Hours = (time: Date | null) => {
  return (time || new Date()).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}


export const mapSchedulerToEvent = (
  scheduler: AssignedScheduler
): EventType => {
  const base = {
    id: scheduler.id+'_sh_'+Math.random().toString(36).substring(7),
    title: scheduler.title,
    resourceId: scheduler.pivot.carer_id,
    status: "confirmed",
    shiftType: "personal_care",
    carer: {
      name: 'Career',
    },
  };

  // ✅ Recurring event
  if (scheduler.is_recurring === "1") {
    const daysOfWeek: number[] = [0, 1, 2, 3, 4, 5, 6];

    return {
      ...base,
      startRecur: scheduler.start_date,
      // endRecur: scheduler.end_date,
      daysOfWeek,
      startTime: scheduler.start_time,
      endTime: scheduler.end_time,
    };
  }

  // ✅ Single event
  return {
    ...base,
    start: `${scheduler.start_date}T${scheduler.start_time}`,
    end: `${scheduler.end_date}T${scheduler.end_time}`,
  };
};


export type ResourceExtendedProps = {
  colorClass: ColorKey
  initials?: string
  hours?: number | null
}

type BaseEvent = {
  id: string
  title: string
  resourceId: string
  status: string
  shiftType: string
  carer: {
    name: string
  }
}


export type EventType =
  | (BaseEvent & {
      start: string
      end: string
      startRecur?: never
      endRecur?: never
      daysOfWeek?: never
      startTime?: never
      endTime?: never
    })
  | (BaseEvent & {
      startRecur: string
      endRecur?: string
      daysOfWeek: number[]
      startTime: string
      endTime: string
      start?: never
      end?: never
    })

export type EventExtendedProps = {
  status: string
  carer: {
    name: string
  }
}

export interface CalendarFilters {
  status: string
  shiftType: string
}
export interface SelectOptions {
  id: string
  name: string
}