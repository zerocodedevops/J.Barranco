import React from "react";

interface TypeBadgeProps {
    type: string;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
    switch (type) {
        case "incidencia":
            return (
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-red-50 text-red-700 border border-red-200">
                    Incidencia
                </span>
            );
        case "extra":
            return (
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-purple-50 text-purple-700 border border-purple-200">
                    Extra
                </span>
            );
        case "observacion":
            return (
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-50 text-amber-700 border border-amber-200">
                    Observación
                </span>
            );
        case "material":
            return (
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-cyan-50 text-cyan-700 border border-cyan-200">
                    Material
                </span>
            );
        default:
            return (
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-gray-50 text-gray-700 border border-gray-200">
                    {type}
                </span>
            );
    }
};
