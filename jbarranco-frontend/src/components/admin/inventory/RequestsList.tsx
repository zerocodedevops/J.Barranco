import { useEffect, useState } from "react";
import { MaterialRequest } from "../../../types";
import {
    approveRequest,
    rejectRequest,
    subscribeToPendingRequests,
    subscribeToRequestsHistory,
} from "../../../services/requestsService";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import toast from "react-hot-toast";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

// Extracted component
const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case "aprobada":
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Aprobada
                </span>
            );
        case "rechazada":
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Rechazada
                </span>
            );
        case "pendiente":
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pendiente
                </span>
            );
        default:
            return null;
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSafeDate = (date: any): Date => {
    if (!date) return new Date();
    if (typeof date.toDate === "function") return date.toDate();
    return new Date(date);
};

export const RequestsList = () => {
    const [requests, setRequests] = useState<MaterialRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"pending" | "history">("pending");

    useEffect(() => {
        setLoading(true);
        let unsubscribe: () => void;

        try {
            if (viewMode === "pending") {
                unsubscribe = subscribeToPendingRequests((data) => {
                    setRequests(data);
                    setLoading(false);
                });
            } else {
                unsubscribe = subscribeToRequestsHistory((data) => {
                    setRequests(data);
                    setLoading(false);
                });
            }
        } catch (error) {
            console.error("Error subscribing:", error);
            setLoading(false);
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [viewMode]);

    const handleApprove = async (request: MaterialRequest) => {
        if (
            !confirm(
                `¿Aprobar solicitud de ${request.cantidad} uds de ${request.producto}?`,
            )
        ) return;

        setProcessingId(request.id);
        try {
            await approveRequest(request.id);
            toast.success("Solicitud aprobada y stock actualizado");
        } catch (error: unknown) {
            toast.error(
                (error as Error).message || "Error al aprobar la solicitud",
            );
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (request: MaterialRequest) => {
        const reason = prompt("Motivo del rechazo:");
        if (reason === null) return; // Cancelled

        setProcessingId(request.id);
        try {
            await rejectRequest(
                request.id,
                reason || "Sin motivo especificado",
            );
            toast.success("Solicitud rechazada");
        } catch (error) {
            console.error(error); // Log error
            toast.error("Error al rechazar solicitud");
        } finally {
            setProcessingId(null);
        }
    };

    // Render Helpers to avoid nested ternaries
    const renderContent = () => {
        if (loading) {
            return (
                <div className="p-8 text-center text-gray-500">
                    Cargando solicitudes...
                </div>
            );
        }

        if (requests.length === 0) {
            return (
                <div className="p-8 text-center text-gray-500">
                    <p>No hay solicitudes en esta vista.</p>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Empleado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Producto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cant.
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Destino
                            </th>
                            {viewMode === "history" && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                            )}
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {requests.map((req) => (
                            <tr key={req.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {req.fechaSolicitud && format(
                                        getSafeDate(req.fechaSolicitud),
                                        "d MMM HH:mm",
                                        { locale: es },
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {req.empleadoNombre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {req.producto}
                                    {req.observaciones && (
                                        <div
                                            className="text-xs text-gray-500 italic truncate max-w-[200px]"
                                            title={req.observaciones}
                                        >
                                            {req.observaciones}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                    {req.cantidad}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {req.clienteNombre
                                        ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {req.clienteNombre}
                                            </span>
                                        )
                                        : (
                                            <span className="text-gray-400">
                                                -
                                            </span>
                                        )}
                                </td>
                                {viewMode === "history" && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <StatusBadge status={req.estado} />
                                        {req.motivoRechazo && (
                                            <div className="text-xs text-red-500 mt-1">
                                                {req.motivoRechazo}
                                            </div>
                                        )}
                                    </td>
                                )}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {viewMode === "pending" && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    handleApprove(req)}
                                                disabled={!!processingId}
                                                className="text-green-600 hover:text-green-900 mr-4 disabled:opacity-50"
                                                title="Aprobar"
                                            >
                                                <CheckCircleIcon className="h-6 w-6" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleReject(req)}
                                                disabled={!!processingId}
                                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                title="Rechazar"
                                            >
                                                <XCircleIcon className="h-6 w-6" />
                                            </button>
                                        </>
                                    )}
                                    {viewMode === "history" && (
                                        <span className="text-gray-400 text-xs">
                                            -
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-2">
                <h3 className="text-lg font-medium text-gray-900">
                    {viewMode === "pending"
                        ? "Solicitudes Pendientes"
                        : "Historial de Solicitudes"}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode("pending")}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            viewMode === "pending"
                                ? "bg-brand-blue text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        Pendientes
                    </button>
                    <button
                        onClick={() => setViewMode("history")}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            viewMode === "history"
                                ? "bg-brand-blue text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        Historial
                    </button>
                </div>
            </div>

            {renderContent()}
        </div>
    );
};
