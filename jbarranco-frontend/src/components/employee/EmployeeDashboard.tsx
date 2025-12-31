import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import {
    ArrowRightIcon,
    CalendarIcon,
    ClipboardDocumentCheckIcon,
    DocumentTextIcon,
    SparklesIcon,
    StarIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../common/LoadingSpinner";

function EmployeeDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [todayStats, setTodayStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
    });

    useEffect(() => {
        if (!user) return;

        const userId = user.firestoreId || user.uid;
        const q = query(
            collection(db, "trabajos"),
            where("empleadoId", "==", userId),
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const now = new Date();
            const todayTasks = snapshot.docs.filter((doc) => {
                const data = doc.data();
                const taskDate = data.fecha?.toDate();
                if (!taskDate) return false;

                return taskDate.getDate() === now.getDate() &&
                    taskDate.getMonth() === now.getMonth() &&
                    taskDate.getFullYear() === now.getFullYear();
            });

            const total = todayTasks.length;
            const completed = todayTasks.filter((doc) =>
                doc.data().estado === "completado"
            ).length;

            setTodayStats({
                total,
                completed,
                pending: total - completed,
            });
            setLoading(false);
        }, (error) => {
            console.error("Error loading dashboard stats:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const progressPercentage = todayStats.total > 0
        ? Math.round((todayStats.completed / todayStats.total) * 100)
        : 0;

    if (loading) return <LoadingSpinner />;

    const currentDate = new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    return (
        <div className="space-y-8">
            {/* Hero Section - Matching Client Style Exact matches */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-blue to-blue-400 p-8 text-white shadow-xl">
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                        Hola, {user?.displayName?.split(" ")[0] || "Compañero"}
                        {" "}
                        <span className="text-4xl">👋</span>
                    </h1>

                    {/* Progress Section: Compressed to 1 Line (Text + Bar + %) to match Client's 1-line subtitle */}
                    <div className="mt-2 flex items-center gap-4">
                        <span className="text-blue-100 text-lg whitespace-nowrap hidden sm:inline">
                            Tu Progreso:
                        </span>
                        <div className="flex-1 bg-blue-900/40 rounded-full h-3 backdrop-blur-sm relative">
                            <div
                                className="bg-brand-green h-3 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(72,187,120,0.5)]"
                                style={{ width: `${progressPercentage}%` }}
                            >
                            </div>
                        </div>
                        <span className="text-xl font-bold min-w-[3.5rem] text-right">
                            {progressPercentage}%
                        </span>
                    </div>

                    <p className="mt-1 text-sm text-blue-200 opacity-80 capitalize">
                        {currentDate} • {todayStats.completed} de{" "}
                        {todayStats.total} tareas
                    </p>
                </div>

                {/* Decoración de fondo (Match Client) */}
                <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 transform translate-x-12 -translate-y-6">
                    <SparklesIcon className="w-full h-full" />
                </div>
            </div>

            {/* Main Action Card (Mi Ruta) - Matched to Client (No border-l-4) */}
            <div
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transform transition hover:scale-[1.01] cursor-pointer"
                onClick={() => navigate("/employee/route")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        navigate(
                            "/employee/route",
                        );
                    }
                }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                            Mi Ruta de Hoy
                        </h2>
                        <p className="text-gray-500">
                            {todayStats.pending > 0
                                ? `Tienes ${todayStats.pending} paradas pendientes 📍`
                                : "¡Todo listo! Ruta finalizada ✅"}
                        </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-full">
                        <ArrowRightIcon className="h-6 w-6 text-brand-blue" />
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid - Matched to Client Style */}
            <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-4 px-1">
                Accesos Rápidos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <button
                    onClick={() => navigate("/employee/inventory")}
                    className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white border border-gray-100 text-left"
                >
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 text-brand-orange group-hover:bg-orange-100 flex items-center justify-center mb-4 transition-colors">
                        <ClipboardDocumentCheckIcon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-blue transition-colors">
                        Inventario
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Material y stock
                    </p>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300">
                        →
                    </div>
                </button>

                <button
                    onClick={() => navigate("/employee/ratings")}
                    className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white border border-gray-100 text-left"
                >
                    <div className="w-14 h-14 rounded-2xl bg-yellow-50 text-yellow-500 group-hover:bg-yellow-100 flex items-center justify-center mb-4 transition-colors">
                        <StarIcon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-blue transition-colors">
                        Mis Valoraciones
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Tus puntuaciones
                    </p>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300">
                        →
                    </div>
                </button>

                <button
                    onClick={() => navigate("/employee/documents")}
                    className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white border border-gray-100 text-left"
                >
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-600 group-hover:bg-gray-100 flex items-center justify-center mb-4 transition-colors">
                        <DocumentTextIcon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-blue transition-colors">
                        Documentos
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Documentación y Nóminas
                    </p>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300">
                        →
                    </div>
                </button>

                <button
                    onClick={() => navigate("/employee/route")}
                    className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white border border-gray-100 text-left"
                >
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-blue group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
                        <CalendarIcon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-blue transition-colors">
                        Ver Calendario
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Turnos y horarios
                    </p>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300">
                        →
                    </div>
                </button>
            </div>
        </div>
    );
}

export default EmployeeDashboard;
