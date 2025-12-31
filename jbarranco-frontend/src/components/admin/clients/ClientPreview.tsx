import { useCallback, useEffect, useState } from "react";
import {
    CalendarDaysIcon,
    EnvelopeIcon,
    InformationCircleIcon,
    MapPinIcon,
    PencilIcon,
    PhoneIcon,
    TrashIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import {
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
import CalendarView from "../../common/CalendarView";
import EntityAttachments from "../../common/EntityAttachments";
import {
    CalendarEvent,
    Cliente,
    Empleado,
    Extra,
    Ticket,
    Trabajo,
} from "../../../types";
import EventModal from "../routes/components/EventModal";

interface ClientPreviewProps {
    readonly client: Cliente | null;
    readonly onClose: () => void;
    readonly onDelete?: () => void;
}

export default function ClientPreview(
    { client, onClose, onDelete }: ClientPreviewProps,
) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"info" | "calendar">("info");
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [employees, setEmployees] = useState<Empleado[]>([]);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
        null,
    );
    const [formData, setFormData] = useState({
        clienteId: "",
        empleadoId: "",
        descripcion: "",
        fecha: "",
    });

    // Load Employees for Modal
    useEffect(() => {
        const loadEmployees = async () => {
            // Only load if not already loaded and tab is calendar (optimization)
            if (activeTab === "calendar" && employees.length === 0) {
                try {
                    const snap = await getDocs(collection(db, "empleados"));
                    setEmployees(
                        snap.docs.map(
                            (d) => ({ id: d.id, ...d.data() } as Empleado),
                        ),
                    );
                } catch (e) {
                    console.error("Error loading employees", e);
                }
            }
        };
        loadEmployees();
    }, [activeTab, employees.length]);

    // Cargar eventos cuando se activa la pestaña calendario
    const fetchEvents = useCallback(async () => {
        if (activeTab === "calendar" && client?.id) {
            setLoadingEvents(true);
            try {
                // Buscar trabajos de este cliente
                const q = query(
                    collection(db, "trabajos"),
                    where("clienteId", "==", client.id),
                );
                const querySnapshot = await getDocs(q);

                const fetchedEvents = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    let start = new Date();
                    let end: Date;

                    if (data.fecha instanceof Timestamp) {
                        start = data.fecha.toDate();
                    } else if (data.fecha) {
                        start = new Date(data.fecha);
                    }

                    if (data.fechaFin instanceof Timestamp) {
                        end = data.fechaFin.toDate();
                    } else if (data.fechaFin) {
                        end = new Date(data.fechaFin);
                    } else {
                        end = new Date(start.getTime() + 60 * 60 * 1000);
                    }

                    return {
                        id: doc.id,
                        title: data.titulo || data.descripcion ||
                            "Trabajo sin título",
                        resource: data,
                        start,
                        end,
                    };
                });

                setEvents(fetchedEvents);
            } catch (error) {
                console.error("Error fetching client events:", error);
            } finally {
                setLoadingEvents(false);
            }
        }
    }, [activeTab, client?.id]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleSelectEvent = (event: CalendarEvent) => {
        setSelectedEvent(event);
        const resource = event.resource as Trabajo;
        setFormData({
            clienteId: client?.id || "",
            empleadoId: resource?.empleadoId || "",
            descripcion: resource?.descripcion || "",
            fecha: event.start.toISOString().split("T")[0] || "",
        });
        setShowModal(true);
    };

    const handleModalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEvent?.id) return;

        try {
            const emp = employees.find((ep) => ep.id === formData.empleadoId);

            const targetDate = formData.fecha
                ? new Date(formData.fecha)
                : selectedEvent.start;
            const startDateTime = new Date(targetDate);
            startDateTime.setHours(selectedEvent.start.getHours()); // Preserve time? Or reset? Using 00:00 for full day logic usually.
            // Actually, if we are editing date, we often want the full day logic or preserve time.
            // ClientPreview calendar view was creating events as 1 hour or start/end.
            // Let's assume we want to update the DATE part.
            // Ideally, construct new date with same time, or 00:00 if it's a day task.
            // Simpler: use startOfDay like other places for consistency if we treat them as Day Tasks.
            // But existing tasks might have times.
            // Let's use startOfDay to match the new logic unless we want time.
            // For now, let's keep it simple: date string -> date object at 00:00 local (or whatever startOfDay does).

            await updateDoc(doc(db, "trabajos", selectedEvent.id), {
                empleadoId: formData.empleadoId,
                empleadoNombre: emp?.nombre || "Desconocido", // Update name too
                descripcion: formData.descripcion,
                clienteId: client?.id,
                fecha: startDateTime, // Update date
                updatedAt: new Date(),
            });

            toast.success("Trabajo actualizado");
            setShowModal(false);
            fetchEvents(); // Refresh
        } catch (err) {
            console.error(err);
            toast.error("Error al actualizar");
        }
    };

    const handleModalDelete = async () => {
        if (!selectedEvent?.id) return;
        if (!confirm("¿Eliminar este trabajo?")) return;

        try {
            await deleteDoc(doc(db, "trabajos", selectedEvent.id));
            toast.success("Trabajo eliminado");
            setShowModal(false);
            fetchEvents();
        } catch (err) {
            console.error(err);
            toast.error("Error al eliminar");
        }
    };

    if (!client) return null;

    return (
        <div className="space-y-6 h-full flex flex-col relative">
            {/* Modal needs to be outside overflow container or using Portal, but fixed position works relative to viewport usually */}

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("info")}
                    className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center gap-2 ${
                        activeTab === "info"
                            ? "border-brand-blue text-brand-blue"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                    <InformationCircleIcon className="h-5 w-5" />
                    Información
                </button>
                <button
                    onClick={() => setActiveTab("calendar")}
                    className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center gap-2 ${
                        activeTab === "calendar"
                            ? "border-brand-blue text-brand-blue"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                    <CalendarDaysIcon className="h-5 w-5" />
                    Calendario de Trabajos
                </button>
            </div>

            {/* Contenido Pestañas */}
            <div className="flex-1 overflow-y-auto min-h-0">
                {activeTab === "info"
                    ? (
                        <div className="space-y-6 p-1">
                            {/* Cabecera / Acciones */}
                            <div className="flex justify-center pb-6 border-b border-gray-100 gap-3">
                                <button
                                    onClick={() =>
                                        navigate(`/admin/clients/${client.id}`)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg shadow hover:bg-blue-700 transition"
                                >
                                    <PencilIcon className="h-4 w-4" />
                                    Editar Ficha
                                </button>
                                {onDelete && (
                                    <button
                                        onClick={onDelete}
                                        className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"
                                        title="Eliminar Cliente"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Datos Principales */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                                    Información General
                                </h4>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-white p-2 rounded shadow-sm text-brand-blue">
                                            <MapPinIcon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {client.direccion}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {client.codigoPostal},{" "}
                                                {client.ciudad}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200">
                                        <p className="text-xs text-gray-400">
                                            CIF
                                        </p>
                                        <p className="font-mono text-gray-700">
                                            {client.cif}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Contacto */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                                    Contacto
                                </h4>
                                <div className="bg-white border border-gray-200 p-4 rounded-lg space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">
                                            Persona de Contacto
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {client.nombreContacto}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                                        <a
                                            href={`tel:${client.telefono}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {client.telefono}
                                        </a>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                        <a
                                            href={`mailto:${client.email}`}
                                            className="text-blue-600 hover:underline break-all"
                                        >
                                            {client.email}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Empleado Asignado (Titular) */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                                    Empleado Titular
                                </h4>
                                <div className="bg-white border border-gray-200 p-4 rounded-lg flex items-center gap-4">
                                    <div className="bg-blue-50 p-2 rounded-full text-brand-blue">
                                        <UserCircleIcon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">
                                            Responsable del Servicio
                                        </p>
                                        <p className="font-medium text-gray-900 text-lg">
                                            {client.empleadoAsignadoNombre || (
                                                <span className="text-gray-400 italic font-normal">
                                                    Sin Asignar
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Documentación */}
                            <EntityAttachments
                                entityId={client.id}
                                folderPath={`clients/${client.id}`}
                                title="Documentación del Cliente"
                            />

                            {/* Notas / Extra */}
                            {client.descripcion && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                                        Notas
                                    </h4>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded italic">
                                        "{client.descripcion}"
                                    </p>
                                </div>
                            )}
                        </div>
                    )
                    : (
                        <div className="h-full flex flex-col">
                            {loadingEvents
                                ? (
                                    <div className="flex items-center justify-center h-64">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue">
                                        </div>
                                    </div>
                                )
                                : (
                                    <div className="flex-1">
                                        <CalendarView<
                                            | Trabajo
                                            | Extra
                                            | Ticket
                                            | Record<string, unknown>
                                        >
                                            events={events}
                                            defaultView="month"
                                            onSelectEvent={handleSelectEvent}
                                        />
                                    </div>
                                )}
                            <p className="text-xs text-gray-500 mt-4 italic text-center">
                                Haz click en un evento para editarlo.
                            </p>
                        </div>
                    )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end shrink-0">
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium hover:underline"
                >
                    Cerrar
                </button>
            </div>

            <EventModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleModalSubmit}
                onDelete={handleModalDelete}
                title="Editar Trabajo"
                clients={[client]} // Only this client available in selector
                employees={employees}
                formData={formData}
                setFormData={setFormData}
                isEditing={true}
            />
        </div>
    );
}
