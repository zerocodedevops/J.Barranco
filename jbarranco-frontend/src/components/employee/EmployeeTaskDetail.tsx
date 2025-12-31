import { useEffect, useState } from "react";
import { Trabajo } from "../../types";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeftIcon,
    CheckCircleIcon,
    MapPinIcon,
} from "@heroicons/react/24/outline";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { notifyNewTicket } from "../../utils/notifications";

function EmployeeTaskDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    // Extend Trabajo type to include optional fields used in this component
    type ExtendedTrabajo = Trabajo & {
        comunidad?: string; // Legacy field
        esExtra?: boolean;
        tipoServicio?: string;
        incidencia?: string;
    };

    const [task, setTask] = useState<ExtendedTrabajo | null>(null);
    const [loading, setLoading] = useState(true);
    const [observation, setObservation] = useState("");

    useEffect(() => {
        const fetchTask = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "trabajos", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setTask(
                        {
                            id: docSnap.id,
                            ...docSnap.data(),
                        } as ExtendedTrabajo,
                    );
                } else {
                    setTask(null);
                }
            } catch (error) {
                console.error("Error fetching task:", error);
                toast.error("Error al cargar la tarea");
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id]);

    const getCurrentLocation = (): Promise<
        { lat: number; lng: number } | null
    > => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve(null);
                return;
            }
            // eslint-disable-next-line sonarjs/no-intrusive-permissions
            navigator.geolocation.getCurrentPosition(
                (pos) =>
                    resolve({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    }),
                (err) => {
                    console.warn("Geolocation error:", err);
                    resolve(null);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
            );
        });
    };

    const handleStart = async () => {
        if (!task || !id) return;

        setLoading(true);
        try {
            const location = await getCurrentLocation();
            const taskRef = doc(db, "trabajos", id);
            const updateData: Record<string, unknown> = {
                estado: "en_progreso",
                startedAt: new Date(),
            };
            if (location) updateData.startLocation = location;

            await updateDoc(taskRef, updateData);

            toast.success("Trabajo iniciado ⏳");
            setTask({ ...task, estado: "en_progreso" });
        } catch (error) {
            console.error("Error starting task:", error);
            toast.error("Error al iniciar");
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async () => {
        if (!task || !id) return;

        if (!globalThis.confirm("¿Confirmar que has completado esta tarea?")) {
            return;
        }

        setLoading(true);
        try {
            const location = await getCurrentLocation();
            const taskRef = doc(db, "trabajos", id);

            const updateData: Record<string, unknown> = {
                estado: "completado",
                completedAt: new Date(),
                observaciones: observation,
            };
            if (location) updateData.endLocation = location;

            await updateDoc(taskRef, updateData);

            // Si hay observaciones, enviar notificación
            if (observation.trim()) {
                notifyNewTicket({
                    type: "observacion",
                    clientName: task.clienteNombre || task.comunidad ||
                        "Cliente",
                    description: observation,
                    authorName: user?.nombre || "Empleado",
                });
            }

            toast.success("¡Tarea completada excelente!");
            setTask({ ...task, estado: "completado" });

            // Opcional: volver atrás después de un breve delay
            setTimeout(() => navigate(-1), 1500);
        } catch (error) {
            console.error("Error updating task:", error);
            toast.error("Hubo un error al completar la tarea");
        } finally {
            setLoading(false);
        }
    };

    const handleIncomplete = async () => {
        if (!task || !id) return;

        // Si no hay observación, preguntamos confirmación extra o asumimos que es 'Sin motivo'
        const reason = observation || "Sin motivo especificado";

        if (
            !observation &&
            !globalThis.confirm("¿Marcar como NO realizada sin indicar motivo?")
        ) {
            return;
        }

        try {
            const taskRef = doc(db, "trabajos", id);
            await updateDoc(taskRef, {
                /* valid error handling */
                estado: "no_completada",
                incidencia: reason, // Mantenemos compatibilidad con campo incidencia
                observaciones: observation, // Guardamos observación para notificación admin
                completionDate: new Date(),
            });

            // Siempre notificar incidencia si no se completa
            notifyNewTicket({
                type: "incidencia",
                clientName: task.clienteNombre || task.comunidad || "Cliente",
                description: `TAREA NO REALIZADA: ${reason}`,
                authorName: user?.nombre || "Empleado",
            });

            toast.error("Tarea marcada como NO realizada");
            /* valid error handling */
            setTask({ ...task, estado: "no_completada" });
            setTimeout(() => navigate(-1), 1500);
        } catch (error) {
            console.error("Error updating task:", error);
            toast.error("Error al actualizar la tarea");
        }
    };

    const getStatusInfo = (status: string) => {
        if (status === "completado") {
            return {
                style: "bg-green-100 text-green-800",
                text: "Completada ✅",
            };
        }
        if (status === "en_progreso") {
            return {
                style: "bg-blue-600 text-white animate-pulse",
                text: "En Progreso ⏳",
            };
        }
        if (status === "no_completada") {
            return {
                style: "bg-red-100 text-red-800",
                text: "No Realizada ❌",
            };
        }
        return {
            style: "bg-blue-100 text-blue-800",
            text: "Pendiente ⏳",
        };
    };

    if (loading) {
        return (
            <div className="p-10 text-center text-gray-500">
                Cargando detalles...
            </div>
        );
    }

    if (!task) {
        return (
            <div className="p-10 text-center">
                <p className="text-xl text-gray-800 mb-4">
                    Tarea no encontrada
                </p>
                <button
                    onClick={() => navigate("/employee/route")}
                    className="text-brand-blue hover:underline"
                >
                    Volver al calendario
                </button>
            </div>
        );
    }

    const { style: badgeStyle, text: badgeText } = getStatusInfo(
        task.estado as string,
    );

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex items-center bg-gray-50 border-b border-gray-200">
                <button
                    onClick={() => navigate(-1)}
                    className="mr-4 text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <h3 className="text-lg leading-6 font-bold text-gray-900">
                    {task.clienteNombre || task.comunidad || "Detalle de Tarea"}
                </h3>
            </div>

            <div className="px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                    {/* Comunidad / Cliente */}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                            Cliente / Comunidad
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {task.clienteNombre || task.comunidad || "N/A"}
                        </dd>
                    </div>

                    {/* Dirección */}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                            Dirección
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                            <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                            {task.direccion || "Sin dirección registrada"}
                        </dd>
                    </div>

                    {/* Descripción */}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                        <dt className="text-sm font-medium text-gray-500">
                            Descripción del Trabajo
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {/* Descripción específica de la tarea */}
                            {task.descripcion && (
                                <p className="whitespace-pre-wrap mb-4 font-medium">
                                    {task.descripcion}
                                </p>
                            )}

                            {/* Tareas Estándar (Información Fija) */}
                            <div className="bg-white p-4 rounded-md border border-gray-200 text-gray-700 space-y-4">
                                <div>
                                    <h4 className="font-bold flex items-center text-brand-blue mb-2">
                                        <span>🏢</span>{" "}
                                        <span className="ml-2">
                                            Portal y escaleras
                                        </span>
                                    </h4>
                                    <ul className="list-disc list-inside space-y-1 ml-1 text-sm">
                                        <li>Barrido y fregado de suelos</li>
                                        <li>
                                            Limpieza de barandillas y pasamanos
                                        </li>
                                        <li>
                                            Eliminación de telarañas y polvo en
                                            techos
                                        </li>
                                        <li>
                                            Limpieza de buzones y portero
                                            automático
                                        </li>
                                    </ul>
                                </div>

                                <div className="border-t border-gray-100 pt-3">
                                    <h4 className="font-bold flex items-center text-brand-blue mb-2">
                                        <span>🛗</span>{" "}
                                        <span className="ml-2">Ascensores</span>
                                    </h4>
                                    <ul className="list-disc list-inside space-y-1 ml-1 text-sm">
                                        <li>Limpieza de espejos y paredes</li>
                                        <li>Desinfección de botoneras</li>
                                        <li>Fregado del suelo</li>
                                        <li>Ventilación adecuada</li>
                                    </ul>
                                </div>
                            </div>
                        </dd>
                    </div>

                    {/* Servicios Especiales (si es extra) */}
                    {(task.esExtra || task.tipoServicio) && (
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-orange-50 border-l-4 border-orange-400">
                            <dt className="text-sm font-bold text-orange-800">
                                Servicio Especial
                            </dt>
                            <dd className="mt-1 text-sm text-orange-800 sm:mt-0 sm:col-span-2 font-medium">
                                {task.tipoServicio || "Servicio Extra"}
                            </dd>
                        </div>
                    )}

                    {/* Estado */}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                            Estado Actual
                        </dt>
                        <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                            <span
                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeStyle}`}
                            >
                                {badgeText}
                            </span>
                        </dd>
                    </div>
                </dl>
            </div>

            {/* Observaciones (Antes de las acciones) */}
            {task.estado !== "completado" &&
                (task.estado as string) !== "no_completada" &&
                (
                    <div className="px-4 py-5 sm:px-6 bg-white border-t border-gray-200">
                        <label
                            htmlFor="observaciones"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Observaciones (Opcional)
                        </label>
                        <textarea
                            id="observaciones"
                            rows={3}
                            className="shadow-sm focus:ring-brand-blue focus:border-brand-blue block w-full sm:text-sm border-gray-300 rounded-md p-3 border"
                            placeholder="Añadir notas, incidencias o comentarios sobre el trabajo..."
                            value={observation}
                            onChange={(e) => setObservation(e.target.value)}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Si escribes algo aquí, se notificará al
                            administrador.
                        </p>
                    </div>
                )}

            {/* Acciones */}
            {task.estado !== "completado" &&
                (task.estado as string) !== "no_completada" &&
                (
                    <div className="px-4 py-6 bg-gray-50 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 border-t border-gray-200">
                        <button
                            onClick={handleIncomplete}
                            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                            <span className="mr-2">❌</span> No se pudo realizar
                        </button>

                        {task.estado === "en_progreso"
                            ? (
                                <button
                                    onClick={handleComplete}
                                    className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                >
                                    <CheckCircleIcon
                                        className="-ml-1 mr-2 h-5 w-5"
                                        aria-hidden="true"
                                    />
                                    Finalizar Trabajo
                                </button>
                            )
                            : (
                                <button
                                    onClick={handleStart}
                                    className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    <MapPinIcon
                                        className="-ml-1 mr-2 h-5 w-5"
                                        aria-hidden="true"
                                    />
                                    Iniciar Trabajo
                                </button>
                            )}
                    </div>
                )}

            {/* Mensaje si está en estado final no exitoso */}
            {/* icon padding */}
            {task.estado === "no_completada" && (
                <div className="px-4 py-6 bg-red-50 border-t border-red-200 text-center">
                    <p className="text-red-700 font-bold flex items-center justify-center">
                        <span className="mr-2">❌</span>{" "}
                        Tarea marcada como NO realizada
                    </p>
                </div>
            )}
        </div>
    );
}

export default EmployeeTaskDetail;
