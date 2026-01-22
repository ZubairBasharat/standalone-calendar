import { useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { clients, events, type CalendarFilters, type Client, type EventType } from "@/helpers/common";
import CalendarScheduler from "@/components/calendar";
import CalendarHeader from "@/components/calendar/CalendarHeader";

export default function App() {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [view, setCurrentView] = useState("resourceTimelineWeek");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selected, setSelected] = useState<Client[]>([]);
  const [filterSelection, setSelectedFilterSelection] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [calendarReady, setCalendarReady] = useState(false);
  const [calDate, setCalDate] = useState(new Date());
  const [expandView, setExpandView] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>([]);
  const [filters, setFilters] = useState<CalendarFilters>({
    status: "all",
    shiftType: "all",
  });

  const handleViewChange = (val: string) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(val);
      setCurrentView(val);
      setCurrentDate(calendarApi.getDate());
    }
  };

  const handlePrev = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
      setCurrentDate(calendarApi.getDate());
    }
  };

  const handleNext = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
      setCurrentDate(calendarApi.getDate());
    }
  };

  const handleToday = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
      setCurrentDate(calendarApi.getDate());
    }
  };

  const formattedTitle = useMemo(() => {
    if(view === "resourceTimelineWeek") {
      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(currentDate)
    }
    else {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(currentDate)
    }
  }, [currentDate, view]);

  const filterSearchedClients = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clients.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(q) ||
        c.initials.toLowerCase().includes(q);

      return matchesSearch;
    });
  }, [search, clients]);

  const filteredClients = useMemo(() => {
    const selectedIds = new Set(
      filterSelection.map((s) => (typeof s === "object" ? s.id : s)),
    );

    return clients.filter((c) => {
      const selected = selectedIds.has(c.id);

      return selected;
    });
  }, [clients, filterSelection]);

  function toggleValue(option: Client) {
    const exists = selected.some((v) => v.id === option.id);
    const newValue = exists
      ? selected.filter((v) => v.id !== option.id)
      : [...selected, option];
    setSelected(newValue);
  }

  useEffect(() => {
    if (clients.length > 0) {
      setSelected(clients);
      setSelectedFilterSelection(clients);
      requestAnimationFrame(() => {
        setCalendarReady(true);
      });
    }
  }, [clients]);

  useEffect(() => {
    import("@/assets/scss/calendar/calendar.css");
  }, []);

 useEffect(() => {
  const data = events.filter((e) => {
    const status = filters.status
    const shiftType = filters.shiftType

    if (status === "all" && shiftType === "all") {
      return true
    } else if (status === "all") {
      return e.shiftType === shiftType
    } else if (shiftType === "all") {
      return e.status === status
    } else {
      return e.status === status && e.shiftType === shiftType
    }
  })

  setFilteredEvents(data)

  setCalendarReady(true)
}, [events, filters.status, filters.shiftType])


  return (
    <div className="p-4">
      <CalendarHeader
        title={formattedTitle}
        view={view}
        calDate={calDate}
        isExpandView={expandView}
        setCalDate={setCalDate}
        handlePrev={handlePrev}
        handleToday={handleToday}
        handleNext={handleNext}
        handleViewChange={handleViewChange}
        filters={filters}
        onExpandView={setExpandView}
        setFilters={setFilters}
        onGotoDate={(d) => {
          if (calendarRef.current) {
            calendarRef.current.getApi().gotoDate(d);
          }
        }}
      />
      <div className="bg-white">
        {calendarReady && (
          <CalendarScheduler
            calendarRef={calendarRef}
            view={view}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            filteredClients={filteredClients}
            events={filteredEvents}
            open={open}
            setOpen={setOpen}
            setSearch={setSearch}
            selected={selected}
            toggleValue={toggleValue}
            filterSearchedClients={filterSearchedClients}
            setSelectedFilterSelection={setSelectedFilterSelection}
            expandView={expandView}
          />
        )}
      </div>
    </div>
  );
}
