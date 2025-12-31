import {
    CalendarIcon,
    TrashIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { CalendarEvent, Trabajo } from "../../../types";

interface AdminTaskModalProps {
    readonly event: CalendarEvent<Trabajo>;
    readonly onClose: () => void;
    readonly onUpdateStatus: (newStatus: string) => void;
    readonly onDelete: () => void;
}

export default function AdminTaskModal({
    event,
    onClose,
    onUpdateStatus,
    onDelete,
}: AdminTaskModalProps) {
    if (!event.resource) return null;

    const { clienteNombre, estado, empleadoNombre } = event.resource;

    const getStatusStyle = (currentStatus: string, btnStatus: string) => {
        const isActive = currentStatus === btnStatus;
        if (!isActive) {
            return "bg-white border-gray-300 text-gray-700 hover:bg-gray-50";
        }

        switch (btnStatus) {
            case "pendiente":
                return "bg-orange-100 border-orange-500 text-orange-700";
            case "completado":
                return "bg-green-100 border-green-500 text-green-700";
            case "cancelado":
                return "bg-red-100 border-red-500 text-red-700";
            default:
                return "";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-gray-500" />
                        Gestión de Trabajo
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div>
                        <p className="block text-xs font-bold text-gray-500 uppercase mb-1">
                            Cliente
                        </p>
                        <p className="text-lg font-medium text-gray-900">
                            {clienteNombre || "Cliente Desconocido"}
                        </p>
                    </div>

                    <div>
                        <p className="block text-xs font-bold text-gray-500 uppercase mb-1">
                            Descripción
                        </p>
                        <p className="text-gray-700 whitespace-pre-wrap">
                            {event.description || "Sin descripción"}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                Inicio
                            </p>
                            <p className="text-gray-900 font-mono text-sm">
                                {event.start.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                Fin
                            </p>
                            <p className="text-gray-900 font-mono text-sm">
                                {event.end.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {empleadoNombre && (
                        <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                            <p className="text-sm text-blue-800">
                                <strong>Asignado a:</strong> {empleadoNombre}
                            </p>
                        </div>
                    )}

                    <hr className="my-4 border-gray-100" />

                    <div>
                        <p className="block text-sm font-medium text-gray-700 mb-2">
                            Cambiar Estado
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {["pendiente", "completado", "cancelado"].map((
                                status,
                            ) => (
                                <button
                                    key={status}
                                    onClick={() => onUpdateStatus(status)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium border transition-all ${
                                        getStatusStyle(
                                            estado || "pendiente",
                                            status,
                                        )
                                    }`}
                                >
                                    {status.charAt(0).toUpperCase() +
                                        status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                    <button
                        onClick={onDelete}
                        className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Eliminar Trabajo
                    </button>

                    <button
                        onClick={onClose}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 font-medium shadow-sm transition-all"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
