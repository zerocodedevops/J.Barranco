import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Ticket } from "../../../types";
import { StatusBadge } from "./StatusBadge";
import { TypeBadge } from "./TypeBadge";

interface ComplaintsListRowProps {
    ticket: Ticket;
    isSelected: boolean;
    isObsView: boolean;
    hideTypeColumn?: boolean;
    onSelect: (e: React.SyntheticEvent, id: string) => void;
    onClick: (ticket: Ticket) => void;
}

export const ComplaintsListRow = ({
    ticket,
    isSelected,
    isObsView,
    hideTypeColumn,
    onSelect,
    onClick,
}: ComplaintsListRowProps) => {
    const getCleanlinessBadge = () => {
        const status = ticket.metadata?.limpiezaCompletada;
        if (status === "SI") {
            return (
                <span className="px-2 py-1 text-xs rounded-full font-bold bg-green-100 text-green-800">
                    SI
                </span>
            );
        }
        if (status === "NO") {
            return (
                <span className="px-2 py-1 text-xs rounded-full font-bold bg-red-100 text-red-800">
                    NO
                </span>
            );
        }
        return (
            <span className="px-2 py-1 text-xs rounded-full font-bold bg-gray-100 text-gray-800">
                {String(status || "-")}
            </span>
        );
    };

    return (
        <tr
            className="hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onClick(ticket)}
        >
            <td
                className="px-6 py-4 whitespace-nowrap"
                onClick={(e) => e.stopPropagation()}
            >
                <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue cursor-pointer"
                    checked={isSelected}
                    onChange={(e) => onSelect(e, ticket.id)}
                />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {ticket.fechaCreacion?.toDate
                    ? format(ticket.fechaCreacion.toDate(), "dd MMM HH:mm", {
                        locale: es,
                    })
                    : "N/A"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={ticket.estado} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                    {ticket.clienteNombre}
                </div>
                {ticket.origen === "reposicion" && (
                    <div className="text-xs text-gray-500">
                        Empleado Solicitante
                    </div>
                )}
            </td>
            {isObsView && (
                <td className="px-6 py-4 whitespace-nowrap text-center">
                    {getCleanlinessBadge()}
                </td>
            )}
            <td className="px-6 py-4">
                <div
                    className="text-sm text-gray-900 font-medium truncate max-w-md"
                    title={ticket.asunto}
                >
                    {ticket.asunto}
                </div>
            </td>
            {(isObsView || !hideTypeColumn) && (
                <td className="px-6 py-4 whitespace-nowrap">
                    {isObsView
                        ? (
                            <div className="text-sm font-medium text-gray-900">
                                {String(
                                    ticket.metadata?.empleadoNombre ||
                                        "Sin Asignar",
                                )}
                            </div>
                        )
                        : <TypeBadge type={ticket.tipo} />}
                </td>
            )}
        </tr>
    );
};
