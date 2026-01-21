  /***********************
   * DATA (demo)
   ***********************/
export const clients = [
  {
    id: "vacant",
    title: "Vacant Shift",
    initials: "VS",
    hours: null,
    colorClass: "gray",
  },
  {
    id: "c1",
    title: "Alice Johnson",
    initials: "AJ",
    hours: 8,
    colorClass: "red",
  },
  {
    id: "c2",
    title: "Brian Smith",
    initials: "BS",
    hours: 8,
    colorClass: "green",
  },
  {
    id: "c3",
    title: "Charlotte Lee",
    initials: "CL",
    hours: 6,
    colorClass: "blue",
  },
  {
    id: "c4",
    title: "Daniel Kim",
    initials: "DK",
    hours: 7,
    colorClass: "yellow",
  },
  {
    id: "c5",
    title: "Eva Martinez",
    initials: "EM",
    hours: 8,
    colorClass: "purple",
  },
  {
    id: "c6",
    title: "Franklin Moore",
    initials: "FM",
    hours: 5,
    colorClass: "orange",
  },
  {
    id: "c7",
    title: "Grace Wilson",
    initials: "GW",
    hours: 8,
    colorClass: "teal",
  },
  {
    id: "c8",
    title: "Henry Brown",
    initials: "HB",
    hours: 8,
    colorClass: "pink",
  },
  {
    id: "c9",
    title: "Isabella Davis",
    initials: "ID",
    hours: 8,
    colorClass: "cyan",
  },
] satisfies Array<{
  id: string
  title: string
  colorClass: ColorKey
  initials?: string
  hours?: number | null
}>;

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
    carer: {
      name: "Makhdoom",
    }
  },
   {
    id: "2",
    title: "Booking 2",
    start: "2026-01-19",
    end: "2026-01-20",
    resourceId: "c1",
    status: "pending",
    carer: {
      name: "Makhdoom",
    }
  },
   {
    id: "3",
    title: "Booking 3",
    start: "2026-01-19",
    end: "2026-01-20",
    resourceId: "c1",
    status: "pending",
    carer: {
      name: "Makhdoom",
    }
  },
  {
    id: "4",
    title: "Booking 4",
    start: "2026-01-19",
    end: "2026-01-20",
    resourceId: "c1",
    status: "pending",
    carer: {
      name: "Makhdoom",
    }
  },
]

export type Client = {
  id: string
  title: string
  initials: string
  hours: number | null
  colorClass: string
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
  'all status': 'bg-slate-400',
  'job board': 'bg-purple-500',
  'pending': 'bg-red-500',
  'cancelled': 'bg-orange-500',
  'booked': 'bg-green-500',
  'approved': 'bg-green-700',
  'rejected': 'bg-red-600',
  'invoiced': 'bg-sky-400',
};

export const formatTime12Hours = (time: Date | null) => {
  return (time || new Date()).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export type ResourceExtendedProps = {
  colorClass: ColorKey
  initials?: string
  hours?: number | null
}

export type EventType = {
  id: string,
  title: string
  start: string
  end: string
  resourceId: string
  status: string
  carer: {
    name: string
  }
}

export type EventExtendedProps = {
  status: string
  carer: {
    name: string
  }
}