import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import SearchCarerDropdown from '@/components/SearchCareerDropdown'
import EventListItem from '@/components/calendar/EventListItem'
import ResourceLabel from './ResourceLabel'

interface ReusableCalendarProps {
  calendarRef: any
  view: string
  currentDate: Date
  setCurrentDate: (d: Date) => void
  filteredClients: any[]
  events: any[]
  open: boolean
  setOpen: (v: boolean) => void
  setSearch: (v: string) => void
  selected: any[]
  toggleValue: (v: any) => void
  filterSearchedClients: any[]
  setSelectedFilterSelection: (v: any[]) => void,
  expandView: boolean
}

export default function CalendarScheduler({
  calendarRef,
  view,
  currentDate,
  setCurrentDate,
  filteredClients,
  events,
  open,
  setOpen,
  setSearch,
  selected,
  toggleValue,
  filterSearchedClients,
  setSelectedFilterSelection,
  expandView
}: ReusableCalendarProps) {
  return (
    <FullCalendar
      key={expandView ? "stack-on" : "stack-off"}
      ref={calendarRef}
      plugins={[resourceTimelinePlugin, interactionPlugin]}
      initialView={view}
      schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
      headerToolbar={false}
      initialDate={currentDate}
      datesSet={(arg) => setCurrentDate(arg.start)}
      resourceAreaWidth={300}
      firstDay={1}
      editable={true}
      droppable={true}
      eventResizableFromStart={true}
      resourceAreaHeaderContent={() => (
        <SearchCarerDropdown
          open={open}
          onClose={() => {
            setOpen(false)
            setSearch("")
          }}
          onConfirm={() => {
            setSearch("")
            setSelectedFilterSelection(selected)
            setOpen(false)
          }}
          setSearch={setSearch}
          setOpen={setOpen}
          selected={selected}
          onSelect={toggleValue}
          users={filterSearchedClients}
        />
      )}
      resources={filteredClients}
      resourceLabelContent={(arg) => <ResourceLabel {...arg} />}
      events={events}
      eventMaxStack={expandView ? undefined : 2}
      eventClassNames="bg-transparent! border-0! p-0!"
      moreLinkClassNames="bg-transparent! px-2 [&>div]:p-0!"
      eventOrder={"title"}
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
          <div className="p-2 bg-gray-50 border-l-2 border-green-600">
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
    />
  )
}
