import { useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { calendarViewOptions, events, type Client } from "@/helpers/common";
import CalendarScheduler from "@/components/calendar";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import { useParams } from "react-router-dom";
import { useAllUsersQuery } from "@/features/api/users";
import AddShiftsModal from "@/components/calendar/Modals/AddShiftsModal";

export default function StaffCalendar() {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [view, setCurrentView] = useState(calendarViewOptions.timeGrid[2].id);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calDate, setCalDate] = useState(new Date());
  const [expandView, setExpandView] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Client | null>(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const params = useParams();
  const userId = params.id;
  const { data: clients = [] } = useAllUsersQuery();
  const careers = useMemo(() => {
    if (clients.length > 0) {
      return clients.filter((c) => c.type === "carer");
    }
    return [];
  }, [clients]);
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
    if (view === "resourceTimelineWeek") {
      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(currentDate);
    } else {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(currentDate);
    }
  }, [currentDate, view]);

  useEffect(() => {
    import("@/assets/scss/calendar/calendar.css");
  }, []);
  useEffect(() => {
    if (clients.length > 0) {
      const user = clients.find((c) => c.id == userId && c.type === "carer");
      if (user) setSelectedUser(user);
    }
  }, [clients]);

  return (
    <div className="p-4 max-w-[1496px] mx-auto">
      <CalendarHeader
        title={formattedTitle}
        user={selectedUser}
        view={view}
        calDate={calDate}
        addShift={true}
        isExpandView={expandView}
        viewOptions={calendarViewOptions.timeGrid}
        setCalDate={setCalDate}
        handlePrev={handlePrev}
        handleToday={handleToday}
        handleNext={handleNext}
        handleViewChange={handleViewChange}
        onExpandView={setExpandView}
        onAddClick={() => setOpenAddModal(true)}
        onGotoDate={(d) => {
          if (calendarRef.current) {
            calendarRef.current.getApi().gotoDate(d);
          }
        }}
      />
      <div className="bg-white">
        <CalendarScheduler
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          calendarRef={calendarRef}
          view={view}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          events={events}
          expandView={expandView}
        />
      </div>
      <AddShiftsModal
        open={openAddModal}
        setOpen={setOpenAddModal}
        user={selectedUser}
        carers={careers}
      />
    </div>
  );
}
