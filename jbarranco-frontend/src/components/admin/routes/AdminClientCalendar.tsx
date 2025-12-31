import { useCallback, useEffect, useState } from "react";
import {
    Calendar as BigCalendar,
    dateFnsLocalizer,
    SlotInfo,
    View,
} from "react-big-calendar";
import {
    endOfDay,
    format,
    getDay,
    parse,
    startOfDay,
    startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../../firebase/config";
import { CalendarEvent, Cliente, Empleado, Trabajo } from "../../../types";
import EventModal from "./components/EventModal";
import { z } from "zod";

const locales = {
    es: es,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const messages = {
    allDay: "Todo el día",
    previous: "Anterior",
    next: "Siguiente",
    today: "Hoy",
    month: "Mes",
    week: "Semana",
    day: "Día",
    agenda: "Agenda",
    date: "Fecha",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "No hay eventos en este rango",
};

// Validation Schema
const jobSchema = z.object({
    clienteId: z.string().min(1, "El cliente es obligatorio"),
    empleadoId: z.string().min(1, "El empleado es obligatorio"),
    descripcion: z.string().optional(),
    fecha: z.string().optional(),
});

interface AdminClientCalendarProps {
    readonly clientId: string;
    readonly clientName: string;
}

export default function AdminClientCalendar(
    { clientId, clientName }: AdminClientCalendarProps,
) {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [view, setView] = useState<View>("month");
    const [date, setDate] = useState(new Date());

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
        null,
    );

    // Data Loading State
    const [employees, setEmployees] = useState<Empleado[]>([]);

    const [formData, setFormData] = useState<{
        clienteId: string;
        empleadoId: string;
        descripcion: string;
        fecha: string;
    }>({
        clienteId: clientId,
        empleadoId: "",
        descripcion: "",
        fecha: "",
    });
    const [formErrors, setFormErrors] = useState<
        Record<string, string | undefined>
    >({});

    // Load Events
    const loadTasks = useCallback(async () => {
        if (!clientId) return;
        try {
            const q = query(
                collection(db, "trabajos"),
                where("clienteId", "==", clientId),
            );
            const snapshot = await getDocs(q);
            const tasksData: CalendarEvent[] = snapshot.docs.map((doc) => {
                const data = doc.data() as Trabajo;
                // Handle Timestamps
                // Handle Timestamps
                let start: Date;
                if (data.fecha instanceof Timestamp) {
                    start = data.fecha.toDate();
                } else if (data.fecha) {
                    start = new Date(data.fecha);
                } else {
                    start = new Date();
                }

                let end: Date;
                if (data.fechaFin instanceof Timestamp) {
                    end = data.fechaFin.toDate();
                } else if (data.fechaFin) {
                    end = new Date(data.fechaFin);
                } else {
                    end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
                }

                return {
                    id: doc.id,
                    title: data.descripcion || "Servicio", // Show description mostly
                    start,
                    end,
                    resource: data,
                    allDay: true,
                };
            });
            setEvents(tasksData);
        } catch (error) {
            console.error("Error loading tasks:", error);
            toast.error("Error al cargar el calendario");
        }
    }, [clientId]);

    const loadEmployees = useCallback(async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "empleados"));
            const empsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            } as Empleado));
            setEmployees(empsData);
        } catch (error) {
            console.error("Error loading employees:", error);
        }
    }, []);

    useEffect(() => {
        loadEmployees();
    }, [loadEmployees]);

    useEffect(() => {
        if (clientId) {
            loadTasks();
            setFormData((prev) => ({ ...prev, clienteId: clientId }));
        }
    }, [clientId, loadTasks]);

    const handleSelectSlot = (slotInfo: SlotInfo) => {
        setSelectedSlot(slotInfo.start);
        setSelectedEvent(null);
        setFormData({
            clienteId: clientId,
            empleadoId: "", // Let user pick or auto-assign by modal logic if we had client detail
            descripcion: "",
            fecha: slotInfo.start.toISOString().split("T")[0] || "",
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleSelectEvent = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setSelectedSlot(event.start);
        const resource = event.resource as Trabajo;
        setFormData({
            clienteId: resource?.clienteId || clientId,
            empleadoId: resource?.empleadoId || "",
            descripcion: resource?.descripcion || "",
            fecha: event.start.toISOString().split("T")[0] || "",
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validation = jobSchema.safeParse(formData);
        if (!validation.success) {
            const errors: Record<string, string> = {};
            const issues = validation.error.issues; // Correct property
            issues.forEach((err) => {
                const field = err.path[0];
                if (field) {
                    errors[field.toString()] = err.message;
                }
            });
            setFormErrors(errors);
            return;
        }

        try {
            const employee = employees.find((e) =>
                e.id === formData.empleadoId
            );

            const targetDate = formData.fecha
                ? new Date(formData.fecha)
                : (selectedSlot || new Date());
            const startDateTime = startOfDay(targetDate);
            const endDateTime = endOfDay(targetDate);

            const taskData = {
                empleadoId: formData.empleadoId,
                empleadoNombre: employee?.nombre || "Desconocido",
                clienteId: clientId,
                clienteNombre: clientName,
                descripcion: formData.descripcion ||
                    `Servicio para ${clientName}`,
                fecha: startDateTime,
                fechaFin: endDateTime,
                estado: "pendiente",
                origen: "admin_client_calendar",
                updatedAt: new Date(),
            };

            if (selectedEvent?.id) {
                await updateDoc(
                    doc(db, "trabajos", selectedEvent.id),
                    taskData,
                );
                toast.success("Trabajo actualizado");
            } else {
                await addDoc(collection(db, "trabajos"), {
                    ...taskData,
                    createdAt: new Date(),
                });
                toast.success("Trabajo creado");
            }

            setShowModal(false);
            loadTasks();
        } catch (error) {
            console.error("Error saving task:", error);
            toast.error("Error al guardar");
        }
    };

    const handleDelete = async () => {
        if (!selectedEvent?.id) return;
        if (!confirm("¿Eliminar este trabajo?")) return;

        try {
            await deleteDoc(doc(db, "trabajos", selectedEvent.id));
            toast.success("Trabajo eliminado");
            setShowModal(false);
            loadTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
            toast.error("Error al eliminar");
        }
    };

    const eventStyleGetter = (event: CalendarEvent) => {
        const resource = event.resource as Trabajo;
        const style = {
            backgroundColor: "#f97316", // Orange for pending
            borderRadius: "4px",
            opacity: 0.8,
            color: "white",
            border: "0px",
            display: "block",
        };

        if (resource?.estado === "completado") {
            style.backgroundColor = "#10b981"; // green
        } else if (resource?.estado === "cancelado") {
            style.backgroundColor = "#ef4444"; // red
        }

        return { style };
    };

    // Construct a minimal client object for the modal selector
    const currentClientObj: Cliente = {
        id: clientId,
        nombre: clientName,
        // other fields optional/mocked if needed by EventModal types?
        // EventModal expects Cliente[] with at least id and nombre.
    } as Cliente;

    return (
        <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">
                    Calendario de {clientName}
                </span>
                <div className="flex gap-2 text-sm text-gray-500">
                    <span className="flex items-center">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mr-1">
                        </div>{" "}
                        Pendiente
                    </span>
                    <span className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-1">
                        </div>{" "}
                        Realizado
                    </span>
                    <span className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-1">
                        </div>{" "}
                        No Realizado
                    </span>
                </div>
            </div>

            <div className="flex-grow p-4 min-h-[600px]">
                <BigCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "100%" }}
                    views={["month", "week", "day", "agenda"]}
                    view={view} // Controlled view
                    onView={setView} // Update view
                    date={date} // Controlled date
                    onNavigate={setDate} // Update date
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    selectable
                    messages={messages}
                    culture="es"
                    eventPropGetter={eventStyleGetter}
                />
            </div>

            <EventModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                title={selectedEvent ? "Editar Trabajo" : "Nuevo Trabajo"}
                clients={[currentClientObj]}
                employees={employees}
                formData={formData}
                setFormData={setFormData}
                isEditing={!!selectedEvent}
                errors={formErrors}
            />
        </div>
    );
}
