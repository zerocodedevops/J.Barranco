import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
    CalendarDaysIcon,
    ChatBubbleLeftRightIcon,
    DocumentTextIcon,
    PlusCircleIcon,
    SparklesIcon,
} from "@heroicons/react/24/outline";
import { useClientDashboardData } from "../../hooks/useClientDashboardData";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function ClientDashboard() {
    const { user } = useAuth();
    const [greeting, setGreeting] = useState("");
    const { nextJob, loading } = useClientDashboardData();

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("¡Buenos días");
        else if (hour < 20) setGreeting("¡Buenas tardes");
        else setGreeting("¡Buenas noches");
    }, []);

    const quickActions = [
        {
            name: "Mi Calendario",
            description: "Ver próximas visitas",
            icon: CalendarDaysIcon,
            color: "bg-blue-50 text-blue-600",
            hover: "hover:bg-blue-100",
            path: "/client/calendar",
        },
        {
            name: "Solicitar / Quejas",
            description: "Contactar con administración",
            icon: ChatBubbleLeftRightIcon,
            color: "bg-orange-50 text-orange-600",
            hover: "hover:bg-orange-100",
            path: "/client/requests",
        },
        {
            name: "Trabajos Extra",
            description: "Necesito una limpieza especial",
            icon: PlusCircleIcon,
            color: "bg-purple-50 text-purple-600",
            hover: "hover:bg-purple-100",
            path: "/client/extra-jobs",
        },
        {
            name: "Documentos",
            description: "Facturas e informes",
            icon: DocumentTextIcon,
            color: "bg-green-50 text-green-600",
            hover: "hover:bg-green-100",
            path: "/client/documents",
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header de Bienvenida con Fondo Decorativo */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-blue to-blue-400 p-8 text-white shadow-xl">
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                        {greeting}, {user?.displayName || "Cliente"}!
                        <span className="text-4xl">👋</span>
                    </h1>
                    <p className="mt-2 text-blue-100 text-lg">
                        ¿En qué podemos ayudarte hoy para que tu comunidad
                        brille?
                    </p>
                    <p className="mt-1 text-sm text-blue-200 opacity-80 capitalize">
                        {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", {
                            locale: es,
                        })}
                    </p>
                </div>

                {/* Decoración de fondo */}
                <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 transform translate-x-12 -translate-y-6">
                    <SparklesIcon className="w-full h-full" />
                </div>
            </div>

            {/* Widget de Estado Rápido */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        Estado del Servicio
                    </h3>
                    <p className="text-gray-500 text-sm">
                        {(() => {
                            if (loading) return "Cargando información...";
                            if (nextJob) {
                                return `Próxima visita programada para el ${
                                    format(
                                        nextJob.fecha,
                                        "d 'de' MMMM",
                                        {
                                            locale: es,
                                        },
                                    )
                                }`;
                            }
                            return "No hay visitas programadas próximamente.";
                        })()}
                    </p>
                </div>
                <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm ${
                        nextJob
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                    }`}
                >
                    {nextJob && (
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75">
                            </span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500">
                            </span>
                        </span>
                    )}
                    {nextJob ? "Servicio Activo" : "Sin actividad pendiente"}
                </div>
            </div>

            {/* Grid de Accesos Rápidos (Acciones Divertidas) */}
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 px-1">
                    Accesos Rápidos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickActions.map((action) => (
                        <Link
                            key={action.name}
                            to={action.path}
                            className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white border border-gray-100`}
                        >
                            <div
                                className={`w-14 h-14 rounded-2xl ${action.color} ${action.hover} flex items-center justify-center mb-4 transition-colors`}
                            >
                                <action.icon className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-blue transition-colors">
                                {action.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {action.description}
                            </p>

                            {/* Arrow hint on hover */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300">
                                →
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Link
                    to="/client/history"
                    className="lg:col-start-3 group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex flex-col items-center justify-center text-center h-full"
                >
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
                        ⭐
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        Tu Opinión Importa
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Valora los servicios completados
                    </p>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-300">
                        →
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default ClientDashboard;
