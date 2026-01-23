import { useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from '@fullcalendar/interaction'
import { calendarViewOptions, events } from "@/helpers/common";
import CalendarScheduler from "@/components/calendar";
import CalendarHeader from "@/components/calendar/CalendarHeader";

export default function StaffCalendar() {
    const calendarRef = useRef<FullCalendar | null>(null);
    const [view, setCurrentView] = useState(calendarViewOptions.timeGrid[2].id);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calDate, setCalDate] = useState(new Date());
    const [expandView, setExpandView] = useState(false);

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

    useEffect(() => {
        import("@/assets/scss/calendar/calendar.css");
    }, []);

    return (
        <div className="p-4">
            <CalendarHeader
                title={formattedTitle}
                view={view}
                calDate={calDate}
                addShift={true}
                isExpandView={expandView}
                setCalDate={setCalDate}
                handlePrev={handlePrev}
                handleToday={handleToday}
                handleNext={handleNext}
                handleViewChange={handleViewChange}
                onExpandView={setExpandView}
                viewOptions={calendarViewOptions.timeGrid}
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
        </div>
    );
}
