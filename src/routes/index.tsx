import type { ReactNode } from "react"
import CalendarDashboard from "@/pages"
import StaffCalendar from "@/pages/staff/StaffCalendar"

export interface AppRoute {
  path: string
  element: ReactNode
}

export const routes: AppRoute[] = [
  {
    path: "/",
    element: <CalendarDashboard />,
  },
  {
    path: "staff/:id",
    element: <StaffCalendar />,
  }
]
