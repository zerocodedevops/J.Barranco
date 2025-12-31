import { useEffect, useState } from "react";
import {
    collection,
    limit,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";
import { db } from "../../../firebase/config";
import { COLLECTIONS } from "../../../constants";
import { Trabajo } from "../../../types";
import { useNavigate } from "react-router-dom";
import {
    ArrowRightIcon,
    CalendarDaysIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";

export default function UnassignedTasksWidget() {
    const [tasks, setTasks] = useState<Trabajo[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Buscar trabajos pendientes SIN empleado asignado
        const q = query(
            collection(db, COLLECTIONS.TRABAJOS),
            where("empleadoId", "==", ""),
            where("estado", "==", "pendiente"),
            limit(5),
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tasksData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Trabajo[];
            setTasks(tasksData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-8 bg-gray-100 rounded w-full"></div>
                    <div className="h-8 bg-gray-100 rounded w-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <UserCircleIcon className="h-5 w-5 text-yellow-500" />
                    Tareas por Asignar
                </h3>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {tasks.length} Pendientes
                </span>
            </div>

            <div className="divide-y divide-gray-200">
                {tasks.length === 0
                    ? (
                        <div className="p-6 text-center text-gray-500">
                            <p className="text-sm">
                                ¡Todo al día! No hay tareas sin asignar.
                            </p>
                        </div>
                    )
                    : (
                        tasks.map((task) => (
                            <div
                                key={task.id}
                                className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center group"
                            >
                                <div className="flex-1 min-w-0 pr-4">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {task.clienteNombre ||
                                            "Cliente Desconocido"}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate mt-0.5">
                                        {task.descripcion}
                                    </p>
                                    <div className="flex items-center mt-1 text-xs text-gray-400">
                                        <CalendarDaysIcon className="h-3 w-3 mr-1" />
                                        {task.horaInicio
                                            ? `Inicio: ${task.horaInicio}`
                                            : "Sin hora"}
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(`/admin/routes`)} // Redirigir a rutas/calendario
                                    className="text-brand-blue hover:text-blue-800 text-xs font-medium border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-md group-hover:bg-blue-100 transition-colors"
                                >
                                    Asignar
                                </button>
                            </div>
                        ))
                    )}
            </div>

            {tasks.length > 0 && (
                <div className="bg-gray-50 p-3 text-center border-t border-gray-200">
                    <button
                        onClick={() => navigate("/admin/routes")}
                        className="text-sm font-medium text-brand-blue hover:text-blue-800 flex items-center justify-center gap-1 w-full"
                    >
                        Ver todas <ArrowRightIcon className="h-3 w-3" />
                    </button>
                </div>
            )}
        </div>
    );
}
