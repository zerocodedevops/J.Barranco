import { useState } from "react";
import {
    collection,
    doc,
    getDoc,
    setDoc,
    writeBatch,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { db } from "../../../firebase/config";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Cliente, RoutesMap } from "../../../types";

const weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

interface RouteTemplateViewProps {
    readonly selectedEmployeeId: string;
    readonly selectedEmployeeName: string;
    readonly routes: RoutesMap;
    readonly clients: Cliente[];
    readonly onRoutesUpdated: (newRoutes: RoutesMap) => void;
}

// Helper para obtener fechas de un día específico en el mes actual
const getDatesForDayOfWeek = (dayName: string) => {
    const dayIndexMap: Record<string, number> = {
        "Domingo": 0,
        "Lunes": 1,
        "Martes": 2,
        "Miércoles": 3,
        "Jueves": 4,
        "Viernes": 5,
        "Sábado": 6,
    };
    const targetDay = dayIndexMap[dayName];
    if (targetDay === undefined) return [];

    const dates = [];
    const date = new Date();
    const month = date.getMonth();

    // Ir al primer día del mes
    date.setDate(1);

    // Encontrar el primer día que coincida
    while (date.getDay() !== targetDay) {
        date.setDate(date.getDate() + 1);
    }

    // Añadir todos los días coincidentes del mes
    while (date.getMonth() === month) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 7);
    }
    return dates;
};

export default function RouteTemplateView({
    selectedEmployeeId,
    selectedEmployeeName,
    routes,
    clients,
    onRoutesUpdated,
}: RouteTemplateViewProps) {
    const [generating, setGenerating] = useState(false);

    // Modal State
    const [showDayModal, setShowDayModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [selectedClients, setSelectedClients] = useState<string[]>([]);

    const getClientName = (clientId: string) => {
        const client = clients.find((c) => c.id === clientId);
        return client ? client.nombre : clientId;
    };

    const handleEditDay = (day: string) => {
        setSelectedDay(day);
        const dayData = routes[day];
        setSelectedClients(Array.isArray(dayData) ? dayData : []);
        setShowDayModal(true);
    };

    const toggleClient = (clientId: string) => {
        if (selectedClients.includes(clientId)) {
            setSelectedClients(selectedClients.filter((id) => id !== clientId));
        } else {
            setSelectedClients([...selectedClients, clientId]);
        }
    };

    const handleSaveDay = async () => {
        if (!selectedEmployeeId || !selectedDay) return;
        try {
            const newRoutes = {
                ...routes,
                [selectedDay]: selectedClients,
                updatedAt: new Date(),
            };
            await setDoc(doc(db, "rutas", selectedEmployeeId), newRoutes);
            onRoutesUpdated(newRoutes);
            toast.success(`Ruta del ${selectedDay} actualizada`);
            setShowDayModal(false);
        } catch (error) {
            console.error("Error saving plan:", error);
            toast.error("Error al guardar el planificador");
        }
    };

    const processDayRoutes = (
        dayName: string,
        clientIds: string[],
        batch: ReturnType<typeof writeBatch>,
    ) => {
        let createdCount = 0;
        const dates = getDatesForDayOfWeek(dayName);

        for (const date of dates) {
            for (const clientId of clientIds) {
                const client = clients.find((c) => c.id === clientId);

                const startDate = new Date(date);
                startDate.setHours(9, 0, 0);
                const endDate = new Date(startDate);
                endDate.setHours(11, 0, 0);

                const newJobRef = doc(collection(db, "trabajos"));
                batch.set(newJobRef, {
                    empleadoId: selectedEmployeeId,
                    empleadoNombre: selectedEmployeeName,
                    clienteId: clientId,
                    clienteNombre: client?.nombre || "Cliente",
                    descripcion: `Servicio Recurrente (${dayName})`,
                    fecha: startDate,
                    fechaFin: endDate,
                    estado: "pendiente",
                    origen: "plantilla_mensual",
                    createdAt: new Date(),
                });
                createdCount++;
            }
        }
        return createdCount;
    };

    const handleGenerateMonth = async () => {
        if (!selectedEmployeeId) {
            toast.error("Selecciona un empleado primero");
            return;
        }
        if (
            !globalThis.confirm(
                `¿Generar trabajos reales para este mes basados en la plantilla de ${selectedEmployeeName}? Esto creará eventos en el calendario.`,
            )
        ) return;

        setGenerating(true);
        try {
            const docRef = doc(db, "rutas", selectedEmployeeId);
            const docSnap = await getDoc(docRef);
            const currentRoutes = docSnap.exists()
                ? (docSnap.data() as RoutesMap)
                : routes;

            const batch = writeBatch(db);
            let count = 0;

            for (const dayName of weekDays) {
                const dayData = currentRoutes[dayName];
                const clientIds = Array.isArray(dayData)
                    ? (dayData as string[])
                    : [];

                if (clientIds.length > 0) {
                    count += processDayRoutes(dayName, clientIds, batch);
                }
            }

            if (count > 0) {
                await batch.commit();
                toast.success(
                    `${count} trabajos generados correctamente. Revisa el calendario.`,
                );
            } else {
                toast(
                    "No hay rutas configuradas en la plantilla para generar.",
                    {
                        icon: "ℹ️",
                    },
                );
            }
        } catch (error) {
            console.error("Error generating routes:", error);
            toast.error("Error al generar rutas");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100 gap-4">
                <div className="text-center sm:text-left">
                    <h4 className="font-bold text-blue-900">
                        Definición de Rutas Base
                    </h4>
                    <p className="text-sm text-blue-700">
                        Configura qué clientes visita este empleado cada día de
                        la semana.
                    </p>
                </div>
                <button
                    onClick={handleGenerateMonth}
                    disabled={generating}
                    className="w-full sm:w-auto bg-brand-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center shadow-sm"
                >
                    {generating ? "Generando..." : "🔄 Generar Mes Actual"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-y-auto">
                {weekDays.map((day) => (
                    <div
                        key={day}
                        className="bg-white p-4 rounded-lg shadow border border-gray-100 h-fit"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-gray-800">
                                {day}
                            </h3>
                            <button
                                onClick={() => handleEditDay(day)}
                                className="text-brand-blue hover:text-blue-700 p-1 hover:bg-blue-50 rounded"
                            >
                                <PencilIcon className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="space-y-2 min-h-[100px]">
                            {Array.isArray(routes[day]) &&
                                routes[day].map((
                                    clientId: string,
                                    index: number,
                                ) => (
                                    <div
                                        key={`${clientId}-${index}`}
                                        className="bg-brand-blue text-white text-xs p-2 rounded text-center shadow-sm"
                                    >
                                        {getClientName(clientId)}
                                    </div>
                                ))}
                            {(!routes[day] ||
                                (Array.isArray(routes[day]) &&
                                    routes[day].length === 0)) &&
                                (
                                    <div className="text-gray-400 text-xs text-center p-4 italic">
                                        Sin ruta
                                    </div>
                                )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal - Could be extracted further but fits here */}
            {showDayModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="font-bold mb-4">Editar {selectedDay}</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                            {clients.map((c) => (
                                <label
                                    key={c.id}
                                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedClients.includes(c.id)}
                                        onChange={() => toggleClient(c.id)}
                                    />
                                    <span>{c.nombre}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowDayModal(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveDay}
                                className="px-4 py-2 bg-brand-blue text-white rounded"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
