import FullCalendar from '@fullcalendar/react'
import type { PluginDef } from '@fullcalendar/core'
import EventListItem from '@/components/calendar/EventListItem'
import type React from 'react'
import type { ResourceLabelContentArg } from "@fullcalendar/resource"
import toast from 'react-hot-toast'

interface ReusableCalendarProps {
    calendarRef: any
    view: string
    currentDate: Date
    resources?: any[]
    events: any[]
    expandView: boolean,
    plugins: PluginDef[]
    setCurrentDate: (d: Date) => void
    resourceAreaHeaderContent?: () => React.JSX.Element,
    resourceLabelContent?: (arg: ResourceLabelContentArg) => React.JSX.Element
}

export default function CalendarScheduler({
    calendarRef,
    view,
    currentDate,
    resources,
    events = [],
    expandView,
    plugins,
    setCurrentDate,
    resourceAreaHeaderContent,
    resourceLabelContent
}: ReusableCalendarProps) {
    return (
        <FullCalendar
            key={expandView ? "stack-on" : "stack-off"}
            ref={calendarRef}
            plugins={plugins}
            initialView={view}
            schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
            headerToolbar={false}
            initialDate={currentDate}
            datesSet={(arg) => setCurrentDate(arg.start)}
            resourceAreaWidth={300}
            firstDay={1}
            editable={true}
            droppable={true}
            eventResizeStop={() => toast.success("Shift has been updated successfully")}
            eventDrop={() => toast.success("Shift has been updated successfully")}
            eventResizableFromStart={true}
            resources={resources}
            resourceAreaHeaderContent={resourceAreaHeaderContent}
            resourceLabelContent={resourceLabelContent}
            events={events}
            eventMaxStack={expandView ? undefined : 2}
            eventClassNames="bg-transparent! border-0! p-0!"
            moreLinkClassNames="bg-transparent! px-2 [&>div]:p-0!"
            eventOrder={"title"}
            height="calc(100vh - 90px)"
            moreLinkContent={(arg) => {
                const { num } = arg
                return (
                    <span className="text-blue-600 px-2 font-medium font-sm">
                        +{num} more shift
                    </span>
                )
            }}
            moreLinkClick={(info) => {
                info.jsEvent.preventDefault()
            }}
            eventContent={(el) => {
                const { event } = el
                return (
                    <div className="p-2 bg-gray-50 border-l-2 border-green-600 w-full">
                        <EventListItem event={event} onClick={(event) => console.log(event)} />
                    </div>
                )
            }}
            slotDuration={
                view === "resourceTimelineWeek" ? { days: 1 } : "00:05:00"
            }
            slotLabelClassNames={"[&>div]:justify-center!"}
            slotLabelFormat={
                view === "resourceTimelineWeek"
                    ? [{ weekday: "short", day: "numeric" }]
                    : [{ hour: "numeric", minute: "2-digit", hour12: true }]
            }
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            dayPopoverFormat={{ month: 'short', day: 'numeric', year: 'numeric' }}
            viewDidMount={() => {
                const el = calendarRef.current?.el;
                if (el) el.classList.add("fc-no-animation");
            }}
        />
    )
}
