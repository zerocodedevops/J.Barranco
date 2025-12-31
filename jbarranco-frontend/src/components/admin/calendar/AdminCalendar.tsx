import { useEffect, useState } from "react";
import {
    ArrowDownTrayIcon,
    BuildingOfficeIcon,
    CalendarIcon,
    FunnelIcon,
    UserGroupIcon,
} from "@heroicons/react/24/outline";
import {
    collection,
    deleteDoc,
    doc,
    DocumentData,
    getDocs,
    onSnapshot,
    QueryDocumentSnapshot,
    updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase/config";
import CalendarView from "../../common/CalendarView";
import {
    exportCalendarToICS,
    exportEventsToCSV,
} from "../../../utils/calendarUtils";
import { CalendarEvent, Cliente, Trabajo, Usuario } from "../../../types";
import toast from "react-hot-toast";
import AdminTaskModal from "./AdminTaskModal";

// Helper type safe mapper
const mapDocToEvent = (
    docSnapshot: QueryDocumentSnapshot<DocumentData, DocumentData>,
): CalendarEvent<Trabajo> => {
    const data = docSnapshot.data() as Trabajo;
    return {
        id: docSnapshot.id,
        title: `${data.clienteNombre || "Cliente"}`,
        start: data.fecha?.toDate ? data.fecha.toDate() : new Date(),
        end: data.fecha?.toDate
            ? new Date(data.fecha.toDate().getTime() + 2 * 60 * 60 * 1000)
            : new Date(),
        description: data.descripcion,
        location: data.direccion || "",
        resource: {
            ...data,
            id: docSnapshot.id,
        },
    };
};

function AdminCalendar() {
    const [events, setEvents] = useState<CalendarEvent<Trabajo>[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("todos");
    const [employeeFilter, setEmployeeFilter] = useState("all");
    const [clientFilter, setClientFilter] = useState("all");
    const [employees, setEmployees] = useState<Usuario[]>([]);
    const [clients, setClients] = useState<Cliente[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<
        CalendarEvent<Trabajo> | null
    >(null);

    // Load data and setup real-time listener
    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const loadData = async () => {
            try {
                setLoading(true);

                // 1. Static Data (Employees & Clients)
                const snapEmp = await getDocs(collection(db, "users"));
                const empList = snapEmp.docs
                    .map((
                        d,
                    ) => ({ id: d.id, ...d.data() } as unknown as Usuario))
                    .filter((u) => u.rol === "empleado");
                setEmployees(empList);

                const snapClients = await getDocs(collection(db, "clientes"));
                const clientList = snapClients.docs.map(
                    (d) => ({ id: d.id, ...d.data() } as unknown as Cliente),
                );
                setClients(clientList);

                // 2. Real-time Data (Trabajos)
                const q = collection(db, "trabajos");
                unsubscribe = onSnapshot(q, (snapshot) => {
                    const trabajosEvents = snapshot.docs.map(mapDocToEvent);
                    setEvents(trabajosEvents);
                    setLoading(false);
                }, (error) => {
                    console.error(
                        "Error connecting to real-time updates:",
                        error,
                    );
                    toast.error("Error de conexión en tiempo real");
                    setLoading(false);
                });
            } catch (e) {
                console.error("Error loading initial data", e);
                setLoading(false);
            }
        };

        loadData();

        return () => {
            unsubscribe?.();
        };
    }, []);

    // Actions
    const handleEventClick = (event: CalendarEvent<Trabajo>) => {
        setSelectedEvent(event);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
    };

    const handleUpdateStatus = async (newStatus: string) => {
        if (!selectedEvent || !selectedEvent.resource || !selectedEvent.id) {
            return;
        }
        try {
            await updateDoc(doc(db, "trabajos", selectedEvent.id), {
                estado: newStatus,
            });
            toast.success(`Estado actualizado a: ${newStatus}`);

            // Optimistic update
            setSelectedEvent((prev) => {
                if (!prev || !prev.resource) return null;
                return {
                    ...prev,
                    resource: {
                        ...prev.resource,
                        estado: newStatus,
                    } as Trabajo,
                };
            });
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar estado");
        }
    };

    const handleDelete = async () => {
        if (!selectedEvent || !selectedEvent.id) return;
        if (
            !confirm(
                "¿Estás seguro de eliminar este trabajo? Esta acción es irreversible.",
            )
        ) return;

        try {
            await deleteDoc(doc(db, "trabajos", selectedEvent.id));
            toast.success("Trabajo eliminado correctamente");
            setSelectedEvent(null);
            setEvents((prev) => prev.filter((e) => e.id !== selectedEvent?.id));
        } catch (error) {
            console.error(error);
            toast.error("Error al eliminar trabajo");
        }
    };

    // Filter Logic
    const filteredEvents = events.filter((e) => {
        if (!e.resource) return false;
        const statusMatch = filter === "todos"
            ? true
            : e.resource.estado === filter;
        const employeeMatch = employeeFilter === "all"
            ? true
            : e.resource.empleadoId === employeeFilter;
        const clientMatch = clientFilter === "all"
            ? true
            : e.resource.clienteId === clientFilter;

        return statusMatch && employeeMatch && clientMatch;
    });

    const handleExportCalendar = async () => {
        await exportCalendarToICS(filteredEvents, "calendario-trabajos-admin");
    };

    if (loading) {
        return (
            <div className="text-center py-20 animate-pulse">
                Cargando calendario...
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center">
                    <CalendarIcon className="h-8 w-8 text-brand-blue mr-3" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Calendario de Trabajos
                        </h1>
                        <p className="text-sm text-gray-600">
                            Vista general y gestión de servicios
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Filters */}
                    <div className="flex items-center space-x-2">
                        <UserGroupIcon className="h-5 w-5 text-gray-500" />
                        <select
                            value={employeeFilter}
                            onChange={(e) => setEmployeeFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue min-w-[180px]"
                        >
                            <option value="all">Todos los Empleados</option>
                            {employees.map((emp) => (
                                <option
                                    key={emp.uid || emp.id}
                                    value={emp.uid || emp.id}
                                >
                                    {emp.nombre || "Empleado"}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <BuildingOfficeIcon className="h-5 w-5 text-gray-500" />
                        <select
                            value={clientFilter}
                            onChange={(e) => setClientFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue min-w-[180px]"
                        >
                            <option value="all">Todos los Clientes</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.nombre || "Cliente"}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <FunnelIcon className="h-5 w-5 text-gray-500" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue min-w-[180px]"
                        >
                            <option value="todos">Todos los Estados</option>
                            <option value="pendiente">Pendientes</option>
                            <option value="completado">Completados</option>
                            <option value="cancelado">Cancelados</option>
                        </select>
                    </div>

                    {/* Exports */}
                    <div className="flex space-x-2">
                        <button
                            onClick={handleExportCalendar}
                            className="flex items-center px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                            title="Exportar archivo de calendario (.ics)"
                        >
                            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                            ICS
                        </button>
                        <button
                            onClick={async () =>
                                await exportEventsToCSV(
                                    filteredEvents,
                                    "listado-trabajos",
                                )}
                            className="flex items-center px-3 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
                            title="Exportar listado a Excel (.csv)"
                        >
                            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                            Excel
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-brand-blue">
                    <p className="text-xs text-gray-500 uppercase">Total</p>
                    <p className="text-2xl font-bold text-gray-800">
                        {events.length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-400">
                    <p className="text-xs text-gray-500 uppercase">
                        Pendientes
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                        {events.filter((e) =>
                            e.resource?.estado === "pendiente"
                        ).length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                    <p className="text-xs text-gray-500 uppercase">
                        Completados
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                        {events.filter((e) =>
                            e.resource?.estado === "completado"
                        ).length}
                    </p>
                </div>
            </div>

            {/* Calendar */}
            <CalendarView<Trabajo>
                events={filteredEvents}
                onSelectEvent={handleEventClick}
                onSelectSlot={() => undefined}
                defaultView="week"
            />

            {/* Modal */}
            {selectedEvent && (
                <AdminTaskModal
                    event={selectedEvent}
                    onClose={handleCloseModal}
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}

export default AdminCalendar;
