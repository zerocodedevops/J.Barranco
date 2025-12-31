import { useEffect, useState } from "react";
import { Ticket, TicketStatus } from "../../../types";
import {
    addTicketResponse,
    updateTicketStatus,
} from "../../../services/ticketService";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    ArrowUpTrayIcon,
    CalendarIcon,
    ChatBubbleLeftRightIcon,
    DocumentCheckIcon,
    TagIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { supabase } from "../../../supabase/client";
import {
    addDoc,
    collection,
    doc,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase/config";

interface TicketPreviewProps {
    readonly ticket: Ticket;
    readonly onClose: () => void;
    readonly onUpdate: () => void;
}

export default function TicketPreview(
    { ticket, onClose, onUpdate }: TicketPreviewProps,
) {
    const [updating, setUpdating] = useState(false);
    const [responseText, setResponseText] = useState("");
    const [uploadingBudget, setUploadingBudget] = useState(false);

    const handleStatusChange = async (newStatus: TicketStatus) => {
        setUpdating(true);
        try {
            if (responseText.trim()) {
                await addTicketResponse(ticket.id, {
                    autorId: "admin",
                    autorNombre: "Administrador",
                    mensaje: responseText.trim(),
                    esAdmin: true,
                }, ticket.origen);
            }

            await updateTicketStatus(ticket.id, newStatus, ticket.origen);
            toast.success(
                `Ticket actualizado a: ${newStatus.replaceAll("_", " ")}`,
            );
            setResponseText("");
            onUpdate();
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Error al actualizar el estado");
        } finally {
            setUpdating(false);
        }
    };

    const handleUploadBudget = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (!e.target.files || e.target.files.length === 0) return;

        // Ensure file is defined
        const file = e.target.files[0];
        if (!file) return;

        setUploadingBudget(true);

        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${ticket.id}.${fileExt}`;
            // FIX: Removed redundant 'budgets/' prefix. The bucket is specified in .from("budgets")
            const filePath = `${ticket.clienteId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("budgets")
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // We don't get a public URL for private buckets. We store the path.
            // Actualizar documento Extra
            const extraRef = doc(db, "extras", ticket.id);
            await updateDoc(extraRef, {
                budgetPath: filePath, // Store path for Signed URL generation
                estado: "presupuestado",
                fechaActualizacion: Timestamp.now(),
            });

            toast.success("Presupuesto enviado correctamente");
            onUpdate();
        } catch (err: unknown) {
            console.error("Error uploading budget:", err);

            const errorMessage = err instanceof Error
                ? err.message
                : String(err);

            if (
                errorMessage.includes(
                    "new row violates row-level security policy",
                )
            ) {
                toast.error(
                    "Error de Permisos: Ejecuta las políticas SQL en Supabase",
                );
            } else {
                toast.error("Error al subir el presupuesto");
            }
        } finally {
            setUploadingBudget(false);
        }
    };

    const handleConvertToJob = async () => {
        if (!confirm("¿Convertir solicitud en trabajo pendiente?")) return;
        setUpdating(true);
        try {
            // 1. Crear Trabajo en estado pendiente
            await addDoc(collection(db, "trabajos"), {
                clienteId: ticket.clienteId,
                clienteNombre: ticket.clienteNombre,
                descripcion: `${ticket.asunto} (Origen: Solicitud Extra)`,
                observaciones: "", // Dejar vacío para no falsear el contador de observaciones
                estado: "pendiente",
                empleadoId: "", // Sin asignar -> Tarea Pendiente
                empleadoNombre: "",
                fecha: Timestamp.now(), // Fecha dummy, se cambiará al agendar
                horaInicio: "09:00",
                tipo: "otro",
                origenExtraId: ticket.id,
                fechaCreacion: Timestamp.now(),
            });

            // 2. Marcar Extra como Aprobado
            const extraRef = doc(db, "extras", ticket.id);
            await updateDoc(extraRef, { estado: "aprobado" });

            toast.success("Trabajo creado. Asignalo en el Calendario/Rutas.");
            onUpdate();
        } catch (error) {
            console.error("Error converting to job:", error);
            toast.error("Error al convertir en trabajo");
        } finally {
            setUpdating(false);
        }
    };

    // State to hold the temporary signed URL
    const [signedUrl, setSignedUrl] = useState<string | null>(null);

    // Effect to fetch signed URL if budgetPath exists
    useEffect(() => {
        const fetchSignedUrl = async () => {
            // @ts-ignore
            if (ticket.metadata?.budgetPath) {
                // @ts-ignore
                const { data } = await supabase.storage.from("budgets")
                    .createSignedUrl(
                        ticket.metadata.budgetPath as string,
                        3600,
                    );
                if (data) setSignedUrl(data.signedUrl);
            } else if (ticket.metadata?.budgetUrl) {
                // Fallback for old public URLs
                setSignedUrl(ticket.metadata.budgetUrl as string);
            }
        };
        fetchSignedUrl();
    }, [ticket.metadata]);

    const getStatusColor = (status: TicketStatus) => {
        switch (status) {
            case "abierto":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "en_progreso":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "resuelto":
                return "bg-green-100 text-green-800 border-green-200";
            case "cerrado":
                return "bg-gray-100 text-gray-800 border-gray-200";
            case "pendiente":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "solicitado":
                return "bg-orange-100 text-orange-800 border-orange-200";
            case "presupuestado":
                return "bg-indigo-100 text-indigo-800 border-indigo-200";
            case "presupuesto_aceptado":
                return "bg-teal-100 text-teal-800 border-teal-200";
            // @ts-ignore
            case "aprobado":
                return "bg-green-100 text-green-800 border-green-200";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getTypeBadgeClass = (type: string) => {
        switch (type) {
            case "incidencia":
                return "bg-red-50 text-red-700 border-red-200";
            case "extra":
                return "bg-purple-50 text-purple-700 border-purple-200";
            case "observacion":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "material":
                return "bg-cyan-50 text-cyan-700 border-cyan-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header / Actions */}
            <div className="pb-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {ticket.asunto}
                        </h2>
                        <span
                            className={`inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-xs font-medium border ${
                                getStatusColor(ticket.estado)
                            }`}
                        >
                            {ticket.estado.toUpperCase().replaceAll("_", " ")}
                        </span>
                    </div>
                </div>
            </div>

            {/* ACTION AREA FOR EXTRA JOBS */}
            {ticket.tipo === "extra" && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 animate-in fade-in">
                    <h3 className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
                        Gestionar Trabajo Extra
                    </h3>

                    <div className="flex flex-wrap items-center gap-4">
                        {(ticket.estado === "pendiente" ||
                            ticket.estado === "solicitado") && (
                            <label
                                className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                                    uploadingBudget
                                        ? "opacity-50 pointer-events-none"
                                        : ""
                                }`}
                            >
                                <ArrowUpTrayIcon
                                    className="-ml-1 mr-2 h-5 w-5"
                                    aria-hidden="true"
                                />
                                {uploadingBudget
                                    ? "Subiendo..."
                                    : "Subir y Enviar Presupuesto"}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="application/pdf"
                                    onChange={handleUploadBudget}
                                    disabled={uploadingBudget}
                                />
                            </label>
                        )}

                        {ticket.estado === "presupuestado" && (
                            <span className="text-sm text-purple-700 flex items-center gap-2 border border-purple-200 bg-white px-3 py-1 rounded-md">
                                <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse">
                                </span>{" "}
                                Esperando respuesta del cliente...
                            </span>
                        )}

                        {ticket.estado === "presupuesto_aceptado" && (
                            <button
                                onClick={handleConvertToJob}
                                disabled={updating}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <DocumentCheckIcon
                                    className="-ml-1 mr-2 h-5 w-5"
                                    aria-hidden="true"
                                />
                                Convertir en Trabajo Pendiente
                            </button>
                        )}

                        {/* Link to budget if exists */}
                        {signedUrl && (
                            <a
                                href={signedUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-purple-600 underline hover:text-purple-800"
                            >
                                Ver Presupuesto Actual
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* Quick Actions (Status) */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Resolución / Respuesta
                </h4>

                <textarea
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm mb-3 p-2"
                    placeholder="Escribe aquí una respuesta o nota para el cliente antes de cambiar el estado..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                >
                </textarea>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => handleStatusChange("abierto")}
                        disabled={updating || ticket.estado === "abierto"}
                        className={`px-3 py-1 text-xs rounded border transition ${
                            ticket.estado === "abierto"
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        Reabrir
                    </button>
                    <button
                        onClick={() => handleStatusChange("en_progreso")}
                        disabled={updating || ticket.estado === "en_progreso"}
                        className={`px-3 py-1 text-xs rounded border transition ${
                            ticket.estado === "en_progreso"
                                ? "bg-yellow-500 text-white border-yellow-500"
                                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        En Progreso
                    </button>
                    <button
                        onClick={() => handleStatusChange("resuelto")}
                        disabled={updating || ticket.estado === "resuelto"}
                        className={`px-3 py-1 text-xs rounded border transition ${
                            ticket.estado === "resuelto"
                                ? "bg-green-600 text-white border-green-600"
                                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        Resolver
                    </button>
                    <button
                        onClick={() => handleStatusChange("cerrado")}
                        disabled={updating || ticket.estado === "cerrado"}
                        className={`px-3 py-1 text-xs rounded border transition ${
                            ticket.estado === "cerrado"
                                ? "bg-gray-600 text-white border-gray-600"
                                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        Cerrar
                    </button>
                </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <UserIcon className="h-3 w-3" /> Cliente
                    </p>
                    <p className="font-medium text-sm text-gray-900">
                        {ticket.clienteNombre}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <TagIcon className="h-3 w-3" /> Tipo
                    </p>
                    <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                            getTypeBadgeClass(ticket.tipo)
                        } uppercase mt-1`}
                    >
                        {ticket.tipo}
                    </span>
                </div>
                <div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" /> Fecha
                    </p>
                    <p className="font-medium text-sm text-gray-900">
                        {ticket.fechaCreacion?.toDate
                            ? format(
                                ticket.fechaCreacion.toDate(),
                                "dd MMM yyyy HH:mm",
                                { locale: es },
                            )
                            : "N/A"}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <TagIcon className="h-3 w-3" /> Prioridad
                    </p>
                    <p
                        className={`font-medium text-sm capitalize ${
                            ticket.prioridad === "alta" ||
                                ticket.prioridad === "urgente"
                                ? "text-red-600"
                                : "text-gray-900"
                        }`}
                    >
                        {ticket.prioridad}
                    </p>
                </div>
            </div>

            {/* Message Body */}
            <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide flex items-center gap-2">
                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                    Descripción del Problema
                </h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {ticket.mensaje}
                </div>
            </div>

            {/* Future: Chat/Responses Section could go here */}
            {ticket.mensajes && ticket.mensajes.length > 0 && (
                <div className="mt-6 border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-4">
                        Historial de Respuestas
                    </h4>
                    <div className="space-y-4">
                        {ticket.mensajes?.map((msg, idx) => (
                            <div
                                key={`${msg.fecha.toMillis()}-${idx}`} // Used a key based on content
                                className={`p-3 rounded-lg text-sm ${
                                    msg.esAdmin
                                        ? "bg-blue-50 ml-4"
                                        : "bg-gray-100 mr-4"
                                }`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-xs text-gray-700">
                                        {msg.autorNombre}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {format(
                                            msg.fecha.toDate(),
                                            "dd/MM HH:mm",
                                            { locale: es },
                                        )}
                                    </span>
                                </div>
                                <p className="text-gray-800">{msg.mensaje}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* Close Button Mobile Friendly */}
            <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                    Cerrar Detalle
                </button>
            </div>
        </div>
    );
}
