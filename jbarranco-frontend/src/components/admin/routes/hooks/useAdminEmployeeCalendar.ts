import { useCallback, useEffect, useState } from "react";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    updateDoc,
    where,
    writeBatch,
} from "firebase/firestore";
import toast from "react-hot-toast";
import {
    endOfDay,
    endOfMonth,
    endOfWeek,
    startOfDay,
    startOfMonth,
    startOfWeek,
} from "date-fns";
import { db } from "../../../../firebase/config";
import { CalendarEvent, Cliente, Empleado, Trabajo } from "../../../../types";
import { jobSchema } from "../../../../schemas/jobSchema";

// Simple SlotInfo interface for React Big Calendar
interface SlotInfo {
    start: Date;
    end: Date;
    slots: Date[];
    action: "select" | "click" | "doubleClick";
}

export function useAdminEmployeeCalendar(
    employeeId: string,
    employeeName: string,
    lastUpdate?: number,
) {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(false);

    // Calendar Control State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState("month"); // month, week, day

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
        null,
    );

    // Form state
    const [clients, setClients] = useState<Cliente[]>([]);
    const [employees, setEmployees] = useState<Empleado[]>([]); // New: Load Employees
    const [formData, setFormData] = useState({
        clienteId: "",
        empleadoId: "",
        descripcion: "",
        fecha: "", // New
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Load Data
    const loadEmployees = useCallback(async () => {
        try {
            const snap = await getDocs(collection(db, "empleados"));
            setEmployees(
                snap.docs.map((d) => ({ id: d.id, ...d.data() } as Empleado)),
            );
        } catch (e) {
            console.error("Error loading employees", e);
        }
    }, []);

    const loadClients = useCallback(async () => {
        try {
            const snap = await getDocs(collection(db, "clientes"));
            setClients(
                snap.docs.map((d) => ({ id: d.id, ...d.data() } as Cliente)),
            );
        } catch (e) {
            console.error("Error loading clients", e);
        }
    }, []);

    const loadTasks = useCallback(async () => {
        if (!employeeId) return;
        setLoading(true);
        try {
            const q = query(
                collection(db, "trabajos"),
                where("empleadoId", "==", employeeId),
            );
            const snapshot = await getDocs(q);
            const eventsData: CalendarEvent[] = snapshot.docs.map((doc) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const data = doc.data() as any; // Using any to safely check .toDate methods

                let start = new Date();
                if (data.fecha) {
                    if (typeof data.fecha.toDate === "function") {
                        start = data.fecha.toDate();
                    } else if (data.fecha instanceof Date) {
                        start = data.fecha;
                    } else {
                        start = new Date(data.fecha);
                    }
                }

                let end = new Date(start.getTime() + 60 * 60 * 1000); // Default 1 hour
                if (data.fechaFin) {
                    if (typeof data.fechaFin.toDate === "function") {
                        end = data.fechaFin.toDate();
                    } else if (data.fechaFin instanceof Date) {
                        end = data.fechaFin;
                    } else {
                        end = new Date(data.fechaFin);
                    }
                }

                return {
                    id: doc.id,
                    title: `${data.clienteNombre || "Sin Cliente"} - ${
                        data.descripcion || "Sin descripción"
                    }`,
                    start,
                    end,
                    resource: data as Trabajo,
                };
            });
            setEvents(eventsData);
        } catch (error) {
            console.error("Error loading tasks:", error);
            toast.error("Error al cargar calendario");
        } finally {
            setLoading(false);
        }
    }, [employeeId]);

    useEffect(() => {
        loadEmployees();
        loadClients();
    }, [loadEmployees, loadClients]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks, lastUpdate]);

    const handleSelectSlot = (slotInfo: SlotInfo) => {
        if (!employeeId) return;
        setSelectedSlot(slotInfo.start);
        setSelectedEvent(null);
        setFormData({
            clienteId: "",
            empleadoId: employeeId || "",
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
            clienteId: resource?.clienteId || "",
            empleadoId: resource?.empleadoId || employeeId || "",
            descripcion: resource?.descripcion || "",
            fecha: event.start.toISOString().split("T")[0] || "",
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        // Note: jobSchema might need update if it validates strictly, checking...
        // Assuming jobSchema allows extra fields or we just ignore validation for empleadoId since it's required in UI
        const validation = jobSchema.safeParse({
            ...formData,
            empleadoId: formData.empleadoId,
        });
        if (!validation.success) {
            const errors: Record<string, string> = {};
            // Use 'issues' array directly from ZodError
            validation.error.issues.forEach((issue) => {
                const field = issue.path[0];
                if (field) {
                    errors[field.toString()] = issue.message;
                }
            });
            setFormErrors(errors);
            toast.error("Por favor revisa el formulario.");
            return;
        }

        try {
            const client = clients.find((c) => c.id === formData.clienteId);
            const employee = employees.find((e) =>
                e.id === formData.empleadoId
            );

            // Use DATE from form if available, else selectedSlot
            const targetDate = formData.fecha
                ? new Date(formData.fecha)
                : (selectedSlot || new Date());

            // Asignar al día completo (00:00 - 23:59)
            const startDateTime = startOfDay(targetDate);
            const endDateTime = endOfDay(targetDate);

            const taskData = {
                empleadoId: formData.empleadoId || "", // Updated from form
                empleadoNombre: employee?.nombre || employeeName ||
                    "Sin Asignar", // Update name
                clienteId: formData.clienteId || "",
                clienteNombre: client?.nombre || "Cliente Manual",
                descripcion: formData.descripcion ||
                    `Servicio para ${client?.nombre || "Cliente"}`,
                fecha: startDateTime,
                fechaFin: endDateTime,
                estado: "pendiente",
                origen: "admin_manual",
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
        if (
            !selectedEvent?.id ||
            !globalThis.confirm("¿Seguro que quieres borrar este trabajo?")
        ) return;
        try {
            await deleteDoc(doc(db, "trabajos", selectedEvent.id));
            toast.success("Trabajo eliminado");
            setShowModal(false);
            loadTasks();
        } catch (error) {
            console.error("Error deleting:", error);
            toast.error("Error al eliminar");
        }
    };

    const getViewLabel = () => {
        if (currentView === "month") return "Mes";
        if (currentView === "week") return "Semana";
        return "Día";
    };

    const handleClearRoute = async () => {
        let start, end, label;

        // Definir rango según vista
        if (currentView === "month") {
            start = startOfMonth(currentDate);
            end = endOfMonth(currentDate);
            label = "del MES";
        } else if (currentView === "week") {
            start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Semana empieza Lunes
            end = endOfWeek(currentDate, { weekStartsOn: 1 });
            label = "de la SEMANA";
        } else { // Day or Agenda
            start = startOfDay(currentDate);
            end = endOfDay(currentDate);
            label = "del DÍA";
        }

        if (
            !globalThis.confirm(
                `🚧 ATENCIÓN: Estás a punto de borrar TODOS los trabajos asignados ${label} actual.\n\nEsta acción eliminará las rutas de ${employeeName} para este periodo.\n\n¿Estás seguro?`,
            )
        ) {
            return;
        }

        setLoading(true);
        try {
            // Buscamos trabajos en el rango
            const q = query(
                collection(db, "trabajos"),
                where("empleadoId", "==", employeeId),
                where("fecha", ">=", start),
                where("fecha", "<=", end),
            );

            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                toast("No hay trabajos para borrar en este periodo.");
                return;
            }

            // Borrado en batch (lotes de 500)
            const batch = writeBatch(db);
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });

            await batch.commit();

            toast.success(
                `Ruta ${label} vaciada correctamente (${snapshot.size} trabajos eliminados).`,
            );
            loadTasks();
        } catch (error) {
            console.error("Error cleaning route:", error);
            toast.error("Error al vaciar la ruta.");
        } finally {
            setLoading(false);
        }
    };

    return {
        events,
        loading,
        currentDate,
        setCurrentDate,
        currentView,
        setCurrentView,
        showModal,
        setShowModal,
        selectedEvent,
        setSelectedEvent,
        setSelectedSlot,
        formData,
        setFormData,
        formErrors,
        clients,
        handleSelectSlot,
        handleSelectEvent,
        handleSubmit,
        handleDelete,
        handleClearRoute,
        getViewLabel,
        employees, // Export employees
    };
}
