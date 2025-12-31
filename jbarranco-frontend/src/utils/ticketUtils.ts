import { Ticket } from "../types";

interface SortConfig {
    key: string;
    direction: "asc" | "desc";
}

export const sortTickets = (
    tickets: Ticket[],
    sortConfig: SortConfig | null,
    allowedTypes?: string[],
): Ticket[] => {
    if (!sortConfig) return tickets;
    const { key, direction } = sortConfig;

    const isObsView = allowedTypes?.includes("observacion") &&
        allowedTypes.length === 1;

    return [...tickets].sort((a, b) => {
        const valA = getSortValue(a, key, isObsView);
        const valB = getSortValue(b, key, isObsView);

        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        return 0;
    });
};

const getSortValue = (
    ticket: Ticket,
    key: string,
    isObsView: boolean | undefined,
): string | number => {
    switch (key) {
        case "fecha":
            return ticket.fechaCreacion?.toDate
                ? ticket.fechaCreacion.toDate().getTime()
                : 0;
        case "estado":
            return ticket.estado || "";
        case "cliente":
            return (ticket.clienteNombre || "").toLowerCase();
        case "column_4": { // Custom: Limpieza Completada OR Prioridad
            if (isObsView) {
                return (ticket.metadata?.limpiezaCompletada as string) || "NO";
            }
            const pMap: Record<string, number> = {
                urgente: 4,
                alta: 3,
                media: 2,
                baja: 1,
            };
            return pMap[ticket.prioridad || "media"] || 0;
        }

        case "column_5": // Asunto
            return (ticket.asunto || "").toLowerCase();
        case "column_6": // Type OR Employee
            if (isObsView) {
                return ((ticket.metadata?.empleadoNombre as string) || "")
                    .toLowerCase();
            }
            return ticket.tipo || "";
        default:
            return 0;
    }
};
