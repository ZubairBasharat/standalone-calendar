import { useEffect, useMemo, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import { clients, colorMap, type Client, type ResourceExtendedProps } from '@/helpers/common'
import SearchCarerDropdown from '@/components/SearchCareerDropdown'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Clock } from 'lucide-react'
import { cn } from './lib/utils'
import { DatePickerDropdown } from './components/DatePickerCalendar'

export default function App() {
  const calendarRef = useRef<FullCalendar | null>(null)
  const [view, setCurrentView] = useState('resourceTimelineWeek')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selected, setSelected] = useState<Client[]>([])
  const [filterSelection, setSelectedFilterSelection] = useState<Client[]>([])
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("");
  const [calendarReady, setCalendarReady] = useState(false)
  const [calDate, setCalDate] = useState(new Date())

  const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      calendarApi.changeView(e.target.value)
      setCurrentView(e.target.value)
      setCurrentDate(calendarApi.getDate())
    }
  }

  const handlePrev = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      calendarApi.prev()
      setCurrentDate(calendarApi.getDate())
    }
  }

  const handleNext = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      calendarApi.next()
      setCurrentDate(calendarApi.getDate())
    }
  }

  const handleToday = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      calendarApi.today()
      setCurrentDate(calendarApi.getDate())
    }
  }

  const formattedTitle = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(currentDate)

  const filterSearchedClients = useMemo(() => {
    const q = search.trim().toLowerCase()
    return clients.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(q) ||
        c.initials.toLowerCase().includes(q)

      return matchesSearch
    })
  }, [search, clients])

  const filteredClients = useMemo(() => {
    const selectedIds = new Set(
      filterSelection.map((s) => (typeof s === 'object' ? s.id : s))
    )

    return clients.filter((c) => {
      const selected = selectedIds.has(c.id)

      return selected
    })
  }, [clients, filterSelection])

  function toggleValue(option: Client) {
    const exists = selected.some(v => v.id === option.id)
    const newValue = exists
      ? selected.filter(v => v.id !== option.id)
      : [...selected, option]
    console.log(newValue)
    setSelected(newValue)
  }

  useEffect(() => {
    if (clients.length > 0) {
      setSelected(clients)
      setSelectedFilterSelection(clients)
      requestAnimationFrame(() => {
        setCalendarReady(true)
      })
    }
  }, [clients])


  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handlePrev}
          >
            Prev
          </button>
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleToday}
          >
            Today
          </button>
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
        <div className="text-xl font-semibold">{formattedTitle}</div>

        <div className='flex items-center gap-3'>
          <DatePickerDropdown onChange={(d) => {
            setCalDate(d)
            if (calendarRef.current) {
              const calendarApi = calendarRef.current.getApi()
              calendarApi?.gotoDate(d)
            }
          }} date={calDate} />
          <select
            className="px-2 py-1 border rounded"
            value={view}
            onChange={handleViewChange}
          >
            <option value="resourceTimelineWeek">Week</option>
            <option value="resourceTimelineDay">Day</option>
          </select>
        </div>
      </div>
      {calendarReady && (
        <FullCalendar
          ref={calendarRef}
          plugins={[resourceTimelinePlugin, interactionPlugin]}
          initialView={view}
          schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
          headerToolbar={false}
          initialDate={currentDate}
          datesSet={(arg) => setCurrentDate(arg.start)}
          resourceAreaWidth={300}
          firstDay={1}
          
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
          resourceLabelContent={(arg) => {
            const { resource } = arg
            const props = resource.extendedProps as ResourceExtendedProps
            return (
              <div className="flex gap-3 px-2">
                <Avatar>
                  <AvatarFallback
                    className={cn(
                      "text-white text-sm font-medium",
                      colorMap[props.colorClass]
                    )}
                  >
                    {resource.extendedProps.initials ?? "LR"}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="font-medium">{resource.title}</div>
                  <div className="text-[12px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {resource.extendedProps.hours ?? 0} hours
                  </div>
                  <div className="text-green-600 cursor-pointer text-[12px]">
                    View availability
                  </div>
                </div>
              </div>
            )
          }}
          events={[
            {
              title: "Booking",
              start: "2026-01-19",
              end: "2026-01-20",
              resourceId: "a",
            },
          ]}
          slotDuration={view === "resourceTimelineWeek" ? { days: 1 } : "00:15:00"}
          slotLabelClassNames={"[&>div]:justify-center!"}
          slotLabelFormat={
            view === "resourceTimelineWeek"
              ? [{ weekday: "short", day: "numeric" }]
              : [{ hour: "numeric", minute: "2-digit", hour12: true }]
          }
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
        />
      )}

    </div>
  )
}
