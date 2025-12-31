import React, { useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer, SlotInfo } from "react-big-calendar";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarView.css";
import { CalendarEvent } from "../../types";

const locales = {
    "es": es,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

// Calendar event types
interface CalendarViewProps<T = unknown> {
    readonly events?: CalendarEvent<T>[];
    readonly onSelectEvent?: (event: CalendarEvent<T>) => void;
    readonly onSelectSlot?: (slotInfo: SlotInfo) => void;
    readonly defaultView?: string;
    readonly view?: string;
    readonly onView?: (view: string) => void;
    readonly date?: Date;
    readonly onNavigate?: (date: Date) => void;
}

// Calendar event types
function CalendarView<T = unknown>({
    events = [],
    onSelectEvent,
    onSelectSlot,
    defaultView = "month",
    view: controlledView,
    onView: onControlledViewChange,
    date: controlledDate,
    onNavigate: onControlledNavigate,
}: CalendarViewProps<T>) {
    const [localView, setLocalView] = useState(defaultView);
    const [localDate, setLocalDate] = useState(new Date());

    const currentView = controlledView ?? localView;
    const currentDate = controlledDate ?? localDate;

    const handleViewChange = React.useCallback((newView: string) => {
        if (onControlledViewChange) {
            onControlledViewChange(newView);
        } else {
            setLocalView(newView);
        }
    }, [onControlledViewChange]);

    const handleNavigate = React.useCallback((newDate: Date) => {
        if (onControlledNavigate) {
            onControlledNavigate(newDate);
        } else {
            setLocalDate(newDate);
        }
    }, [onControlledNavigate]);

    const formattedEvents = useMemo(() => {
        return events.map((event: CalendarEvent<T>) => ({
            ...event,
            start: event.start instanceof Date
                ? event.start
                : new Date(event.start as string),
            end: event.end instanceof Date
                ? event.end
                : new Date(event.end as string),
            allDay: true,
        }));
    }, [events]);

    const eventStyleGetter = React.useCallback((event: CalendarEvent<T>) => {
        let backgroundColor = "#003366";
        const color = "#FFFFFF";

        const resource = event.resource as {
            estado?: string;
            tipo?: string;
        } | undefined;

        if (resource?.estado === "completado") {
            backgroundColor = "#00A86B";
        } else if (resource?.estado === "cancelado") {
            backgroundColor = "#DC3545";
        } else if (resource?.estado === "pendiente") {
            backgroundColor = "#FF7F50";
        } else if (resource?.tipo === "queja") {
            backgroundColor = "#DC3545";
        }

        return {
            style: {
                backgroundColor,
                color,
                borderRadius: "5px",
                opacity: 0.9,
                border: "none",
                display: "block",
            },
        };
    }, []);

    const messages = useMemo(() => ({
        allDay: "Todo el día",
        previous: "Anterior",
        next: "Siguiente",
        today: "Hoy",
        month: "Mes",
        week: "Semana",
        day: "Día",
        agenda: "Agenda",
        date: "Fecha",
        time: "Hora",
        event: "Evento",
        noEventsInRange: "No hay eventos en este rango",
        showMore: (total: number) => `+ Ver más (${total})`,
    }), []);

    return (
        <div className="calendar-container">
            <Calendar
                localizer={localizer}
                events={formattedEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 800 }}
                view={currentView as "month" | "week" | "day" | "agenda"}
                onView={handleViewChange}
                date={currentDate}
                onNavigate={handleNavigate}
                onSelectEvent={onSelectEvent}
                onSelectSlot={onSelectSlot}
                selectable
                eventPropGetter={eventStyleGetter}
                messages={messages}
                culture="es"
                views={["month", "week", "day", "agenda"]}
                step={30}
                showMultiDayTimes
                defaultDate={new Date()}
                popup
            />
        </div>
    );
}

export default CalendarView;
