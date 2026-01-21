  /***********************
   * DATA (demo)
   ***********************/

export type Client = {
  id: string
  title: string
  initials: string
  hours: number | null
  colorClass: string
}


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

export type ResourceExtendedProps = {
  colorClass: ColorKey
  initials?: string
  hours?: number | null
}