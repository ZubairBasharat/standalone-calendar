import { useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import dayjs from "dayjs";

import CalendarScheduler from "@/components/calendar";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import SearchCarerDropdown from "@/components/SearchCareerDropdown";
import ResourceLabel from "@/components/calendar/ResourceLabel";

import { calendarViewOptions, type CalendarFilters } from "@/helpers/common";
import { useAllUsersQuery } from "@/features/api/users";
import { useGetAllEventsQuery } from "@/features/api/calendar/events";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import MultiStepModal from "@/components/calendar/Modals/MultiStepsModal";

export default function CalendarDashboard() {
  const calendarRef = useRef<FullCalendar | null>(null);

  // --------------------------
  // State
  // --------------------------
  const [openStepsSheet, setOpenStepsSheet] = useState(false);
  const [view, setCurrentView] = useState(calendarViewOptions.resource[0].id);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [calendarReady, setCalendarReady] = useState(false);
  const [expandView, setExpandView] = useState(false);
  const [filters, setFilters] = useState<CalendarFilters>({
    status: "all",
    shiftType: "all",
  });

  // --------------------------
  // Queries
  // --------------------------
  const { data: clients = [] } = useAllUsersQuery();
  const reqDate = useMemo(() => {
    if (view === "resourceTimelineWeek") {
      return {
        start: dayjs(currentDate).format("YYYY-MM-DD"),
        end: dayjs(currentDate).add(6, "day").format("YYYY-MM-DD"),
      };
    }
    return {
      start: dayjs(currentDate).format("YYYY-MM-DD"),
      end: dayjs(currentDate).format("YYYY-MM-DD"),
    };
  }, [currentDate]);

  const {
    data: events = [],
    isLoading: isLoadingEvents,
    isFetching: isFetchingEvents,
  } = useGetAllEventsQuery(
    {
      startDate: reqDate.start,
      endDate: reqDate.end,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  // --------------------------
  // Derived State
  // --------------------------
  const selectedClients = useMemo(() => clients, [clients]);
  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = clients.filter((c) => {
      const title = c.title?.toLowerCase() ?? "";
      const initials = c.initials?.toLowerCase() ?? "";

      return title.includes(q) || initials.includes(q);
    });

    return filtered.length > 0 ? filtered : clients;
  }, [clients, search]);

  //   const filteredEvents = useMemo(() => {
  //     return events.filter((e) => {
  //       const status = filters.status;
  //       const shiftType = filters.shiftType;

  //       if (status === "all" && shiftType === "all") return true;
  //       if (status === "all") return e.shiftType === shiftType;
  //       if (shiftType === "all") return e.status === status;
  //       return e.status === status && e.shiftType === shiftType;
  //     });
  //   }, [events, filters.status, filters.shiftType]);

  // --------------------------
  // Calendar Ready
  // --------------------------
  useEffect(() => {
    if (clients.length > 0 && !calendarReady) {
      requestAnimationFrame(() => setCalendarReady(true));
    }
  }, [clients, calendarReady]);

  // --------------------------
  // Load CSS
  // --------------------------
  useEffect(() => {
    import("@/assets/scss/calendar/calendar.css");
  }, []);

  // --------------------------
  // Calendar Handlers
  // --------------------------
  const handleViewChange = (val: string) => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;
    calendarApi.changeView(val);
    setCurrentView(val);
    setCurrentDate(calendarApi.getDate());
  };

  const handlePrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;
    calendarApi.prev();
    setCurrentDate(calendarApi.getDate());
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;
    calendarApi.next();
    setCurrentDate(calendarApi.getDate());
  };

  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;
    calendarApi.today();
    setCurrentDate(calendarApi.getDate());
  };

  const toggleClientSelection = () => {
    // You can implement selection logic if needed
    // Currently using search & selectedClients
  };

  const formattedTitle = useMemo(() => {
    if (view === "resourceTimelineWeek") {
      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(currentDate);
    }
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(currentDate);
  }, [currentDate, view]);

  return (
    <>
      <div className="p-4 max-w-[1496px] mx-auto">
        <CalendarHeader
          title={formattedTitle}
          view={view}
          viewOptions={calendarViewOptions.resource}
          publishShift={true}
          calDate={currentDate}
          isExpandView={expandView}
          setCalDate={setCurrentDate}
          handlePrev={handlePrev}
          handleToday={handleToday}
          handleNext={handleNext}
          handleViewChange={handleViewChange}
          filters={filters}
          onExpandView={setExpandView}
          setFilters={setFilters}
          onPublishClick={() => setOpenStepsSheet(true)}
          onGotoDate={(d) => calendarRef.current?.getApi().gotoDate(d)}
        />

        <div className="bg-white">
          {calendarReady && (
            <CalendarScheduler
              plugins={[resourceTimelinePlugin, interactionPlugin]}
              calendarRef={calendarRef}
              view={view}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              resources={filteredClients}
              events={events}
              expandView={expandView}
              resourceLabelContent={(arg) => <ResourceLabel {...arg} />}
              resourceAreaHeaderContent={() => (
                <SearchCarerDropdown
                  open={open}
                  onClose={() => {
                    setOpen(false);
                    setSearch("");
                  }}
                  onConfirm={() => {
                    setSearch("");
                    setOpen(false);
                  }}
                  setSearch={setSearch}
                  setOpen={setOpen}
                  selected={selectedClients}
                  onSelect={toggleClientSelection}
                  users={filteredClients}
                />
              )}
            />
          )}
        </div>
      </div>
      {(isFetchingEvents || isLoadingEvents) && <FullScreenLoader />}
      <MultiStepModal open={openStepsSheet} setOpen={setOpenStepsSheet} />
    </>
  );
}
