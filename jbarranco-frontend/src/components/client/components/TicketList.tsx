import { Ticket, TicketStatus, TicketType } from "../../../types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TagIcon } from "@heroicons/react/24/outline";

interface TicketListProps {
    readonly tickets: Ticket[];
    readonly loading: boolean;
}

const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
        case "abierto":
            return (
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    Abierto
                </span>
            );
        case "en_progreso":
            return (
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                    En Progreso
                </span>
            );
        case "resuelto":
            return (
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Resuelto
                </span>
            );
        case "cerrado":
            return (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                    Cerrado
                </span>
            );
        default:
            return null;
    }
};

const getTypeLabel = (type: TicketType) => {
    switch (type) {
        case "averia":
            return "Avería";
        case "limpieza":
            return "Limpieza";
        case "sugerencia":
            return "Sugerencia";
        case "administrativo":
            return "Administrativo";
        case "otro":
            return "Otro";
        default:
            return type;
    }
};

export function TicketList({ tickets, loading }: TicketListProps) {
    if (loading) {
        return (
            <div className="p-12 text-center text-gray-500">
                Cargando tickets...
            </div>
        );
    }

    if (tickets.length === 0) {
        return (
            <div className="p-12 text-center text-gray-500">
                No hay tickets en esta sección.
            </div>
        );
    }

    return (
        <ul className="divide-y divide-gray-200">
            {tickets.map((ticket) => (
                <li
                    key={ticket.id}
                    className="block hover:bg-gray-50 transition"
                >
                    <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-brand-blue truncate">
                                {ticket.asunto}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                                {getStatusBadge(ticket.estado)}
                            </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500 mr-6">
                                    <TagIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                    {getTypeLabel(ticket.tipo)}
                                </p>
                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                    {ticket.mensaje.length > 50
                                        ? ticket.mensaje.substring(0, 50) +
                                            "..."
                                        : ticket.mensaje}
                                </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <p>
                                    Creado el {ticket.fechaCreacion
                                        ? format(
                                            ticket.fechaCreacion.toDate(),
                                            "PPP",
                                            { locale: es },
                                        )
                                        : "-"}
                                </p>
                            </div>
                        </div>
                        {ticket.mensajes && ticket.mensajes.length > 0 &&
                            (() => {
                                const lastMsg =
                                    ticket.mensajes[ticket.mensajes.length - 1];
                                if (!lastMsg) return null;
                                return (
                                    <div className="mt-2 text-xs text-gray-400 bg-gray-50 p-2 rounded">
                                        Última respuesta de{" "}
                                        {lastMsg.autorNombre}: "{lastMsg
                                            .mensaje}"
                                    </div>
                                );
                            })()}
                    </div>
                </li>
            ))}
        </ul>
    );
}
