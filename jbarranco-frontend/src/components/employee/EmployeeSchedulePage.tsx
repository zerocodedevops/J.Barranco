import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import CalendarView from "../common/CalendarView";
import LoadingSpinner from "../common/LoadingSpinner";
import EmployeeTaskListView from "./EmployeeTaskListView";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { CalendarEvent, Trabajo } from "../../types";

interface SlotInfo {
    start: Date;
    end: Date;
    slots: Date[];
    action: "select" | "click" | "doubleClick";
}

const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
};

function EmployeeSchedulePage() {
    const { user } = useAuth();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);

    // Vista State
    const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        if (!user) return;
        setLoading(true);

        const userId = user.firestoreId || user.uid;

        // Traemos TODOS los trabajos asignados al empleado para pintar el calendario
        // Suscripción en tiempo real (onSnapshot) para actualizaciones "en caliente"
        const q = query(
            collection(db, "trabajos"),
            where("empleadoId", "==", userId),
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tasksData: CalendarEvent[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                const startDate = data.fecha?.toDate() || new Date();
                // Duración por defecto 1h si no hay fecha fin
                const endDate = data.fechaFin?.toDate() ||
                    new Date(startDate.getTime() + 60 * 60 * 1000);

                return {
                    id: doc.id,
                    title: data.clienteNombre || data.descripcion || "Tarea",
                    start: startDate,
                    end: endDate,
                    resource: data as Trabajo, // Guardamos toda la data original
                    allDay: false,
                };
            });

            setEvents(tasksData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching employee tasks:", error);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [user]);

    // Filtrar tareas para el día seleccionado
    const selectedDayTasks = useMemo(() => {
        return events
            .filter((event) => isSameDay(event.start as Date, selectedDate))
            .map((event) => ({
                id: event.id || "",
                ...event.resource,
            }));
    }, [events, selectedDate]);

    const handleSelectSlot = (slotInfo: SlotInfo) => {
        // Al hacer click en un día vacío o con eventos
        setSelectedDate(slotInfo.start);
        setViewMode("list");
    };

    const handleSelectEvent = (event: CalendarEvent) => {
        // Al hacer click en un evento concreto
        setSelectedDate(event.start as Date);
        setViewMode("list");
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            {viewMode === "calendar"
                ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <CalendarIcon className="h-8 w-8 text-brand-blue mr-3" />
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Mi Calendario
                                    </h1>
                                    <p className="text-sm text-gray-600">
                                        Gestión de rutas y tareas
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow">
                            <CalendarView
                                events={events}
                                onSelectSlot={handleSelectSlot}
                                onSelectEvent={handleSelectEvent}
                                defaultView="month"
                            />
                            <p className="text-xs text-gray-400 mt-2 text-center">
                                Pincha en un día o evento para ver la ruta
                                detallada.
                            </p>
                        </div>
                    </div>
                )
                : (
                    <EmployeeTaskListView
                        tasks={selectedDayTasks}
                        date={selectedDate}
                        onBack={() => setViewMode("calendar")}
                    />
                )}
        </div>
    );
}

export default EmployeeSchedulePage;
