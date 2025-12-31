import React from "react";

interface StatusBadgeProps {
    status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    // Sanitize status if it comes as a stringified array or weird format
    const cleanStatus = status?.includes('"') ? "recibido" : status;

    switch (cleanStatus) {
        case "abierto":
        case "recibido": // Fallback for 'recibido'
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
        case "pendiente":
            return (
                <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                    Pendiente
                </span>
            );
        default:
            return (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                    {cleanStatus || "Desconocido"}
                </span>
            );
    }
};
