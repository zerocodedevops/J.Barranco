import { createEvent, createEvents, EventAttributes } from "ics";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { CalendarEvent } from "../types";

// Helper para convertir fechas
const toDate = (date: Date | Timestamp): Date =>
    date instanceof Timestamp ? date.toDate() : new Date(date);

/**
 * Convierte un evento de nuestra app al formato ICS
 */
function convertToICSFormat(event: CalendarEvent): EventAttributes {
    const start = toDate(event.start);
    const end = toDate(event.end);

    return {
        title: event.title,
        description: event.description || event.title,
        start: [
            start.getFullYear(),
            start.getMonth() + 1, // ICS usa meses 1-12
            start.getDate(),
            start.getHours(),
            start.getMinutes(),
        ],
        end: [
            end.getFullYear(),
            end.getMonth() + 1,
            end.getDate(),
            end.getHours(),
            end.getMinutes(),
        ],
        location: event.location || "",
        status: "CONFIRMED",
        busyStatus: "BUSY",
        organizer: { name: "J-Barranco", email: "info@j-barranco.com" },
    };
}

/**
 * Exporta un solo evento a archivo .ics
 */
export async function exportEventToICS(
    event: CalendarEvent,
    filename = "evento",
): Promise<boolean> {
    try {
        const icsEvent = convertToICSFormat(event);

        const { error, value } = createEvent(icsEvent);

        if (error) {
            console.error("Error al crear evento ICS:", error);
            return false;
        }

        const blob = new Blob([value || ""], {
            type: "text/calendar;charset=utf-8",
        });
        saveAs(blob, `${filename}.ics`);

        return true;
    } catch (error) {
        console.error("Error al exportar evento:", error);
        return false;
    }
}

/**
 * Exporta múltiples eventos a un solo archivo .ics
 */
export async function exportEventsToICS(
    events: CalendarEvent[],
    filename = "calendario",
): Promise<boolean> {
    try {
        if (!events || events.length === 0) {
            return false;
        }

        const icsEvents = events.map(convertToICSFormat);

        const { error, value } = createEvents(icsEvents);

        if (error) {
            console.error("Error al crear archivo ICS:", error);
            return false;
        }

        const blob = new Blob([value || ""], {
            type: "text/calendar;charset=utf-8",
        });
        saveAs(blob, `${filename}.ics`);

        return true;
    } catch (error) {
        console.error("Error al exportar eventos:", error);
        return false;
    }
}

// Alias para mantener compatibilidad con código existente
export const exportCalendarToICS = exportEventsToICS;

/**
 * Exporta eventos a formato CSV (Compatible con Excel)
 */
export async function exportEventsToCSV(
    events: CalendarEvent[],
    filename = "listado_trabajos",
): Promise<boolean> {
    try {
        if (!events || events.length === 0) {
            return false;
        }

        // Headers
        const headers = [
            "ID",
            "Título",
            "Inicio",
            "Fin",
            "Ubicación",
            "Estado",
            "Cliente",
            "Empleado",
            "Descripción",
        ];

        // Data rows
        const rows = events.map((e) => {
            const start = toDate(e.start);
            const end = toDate(e.end);

            const clientId =
                (e.resource as { clienteId?: string })?.clienteId || "";
            const empId = (e.resource as { empleadoId?: string })?.empleadoId ||
                "";

            return [
                String(e.id),
                `"${e.title.replaceAll('"', '""')}"`, // Escape quotes
                format(start, "dd/MM/yyyy HH:mm"),
                format(end, "dd/MM/yyyy HH:mm"),
                `"${(e.location || "").replaceAll('"', '""')}"`,
                String((e.resource as { estado?: string })?.estado || "N/A"),
                `"${String(clientId).replaceAll('"', '""')}"`,
                `"${String(empId).replaceAll('"', '""')}"`,
                `"${(e.description || "").replaceAll('"', '""')}"`,
            ].join(",");
        });

        const csvContent = [headers.join(","), ...rows].join("\n");
        // Add BOM for Excel UTF-8 compatibility
        const blob = new Blob(["\uFEFF" + csvContent], {
            type: "text/csv;charset=utf-8",
        });
        saveAs(blob, `${filename}.csv`);

        return true;
    } catch (error) {
        console.error("Error al exportar CSV:", error);
        return false;
    }
}

// Unused date helpers removed

/**
 * Genera URL para añadir evento a Google Calendar
 */
export function getGoogleCalendarURL(event: CalendarEvent): string {
    const start = toDate(event.start);
    const end = toDate(event.end);

    const formatDateForGoogle = (date: Date): string => {
        return date.toISOString().replaceAll("-", "").replaceAll(":", "").split(
            ".",
        )[0] || "";
    };

    const params = new URLSearchParams();
    params.append("action", "TEMPLATE");
    params.append("text", event.title);
    params.append(
        "dates",
        `${formatDateForGoogle(start)}/${formatDateForGoogle(end)}`,
    );
    if (event.description) params.append("details", event.description);
    if (event.location) params.append("location", event.location);

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Abre Google Calendar para añadir un evento
 */
export function addToGoogleCalendar(event: CalendarEvent): void {
    const url = getGoogleCalendarURL(event);
    window.open(url, "_blank");
}
