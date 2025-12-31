import { useNavigate } from "react-router-dom";
import {
    ArrowLeftIcon,
    ChevronRightIcon,
    PlusCircleIcon,
} from "@heroicons/react/20/solid";

interface Task {
    id: string;
    clienteNombre?: string;
    comunidad?: string;
    direccion?: string;
    estado?: string;
    esExtra?: boolean;
    tipoServicio?: string;
}

interface EmployeeTaskListViewProps {
    tasks: Task[];
    date: Date;
    onBack: () => void;
}

function EmployeeTaskListView(
    { tasks, date, onBack }: EmployeeTaskListViewProps,
) {
    const navigate = useNavigate();

    const formattedDate = date.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    const getStatusColor = (status?: string) => {
        if (status === "completado") return "bg-brand-green";
        if (status === "en_progreso") return "bg-blue-500";
        return "bg-gray-300";
    };

    return (
        <div>
            <div className="flex items-center mb-4">
                <button
                    onClick={onBack}
                    className="mr-3 p-1 rounded-full hover:bg-gray-100 text-gray-600"
                >
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Ruta del Día
                    </h2>
                    <p className="text-sm text-gray-500 capitalize">
                        {formattedDate}
                    </p>
                </div>
            </div>

            <div className="mt-4 space-y-4">
                {tasks.length === 0
                    ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-100">
                            <p className="text-gray-500 text-lg">
                                No hay tareas programadas para este día.
                            </p>
                            <button
                                onClick={onBack}
                                className="mt-4 text-brand-blue hover:underline text-sm"
                            >
                                Volver al calendario
                            </button>
                        </div>
                    )
                    : (
                        tasks.map((task) => (
                            <button
                                key={task.id}
                                onClick={() =>
                                    navigate(`/employee/task/${task.id}`)}
                                className={`w-full bg-white p-4 rounded-lg shadow text-left flex items-center justify-between transition-transform hover:scale-[1.02] ${
                                    task.estado === "completado"
                                        ? "opacity-75 bg-gray-50"
                                        : ""
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div
                                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                            getStatusColor(task.estado)
                                        }`}
                                    >
                                    </div>

                                    <div>
                                        <p className="font-medium text-gray-900 line-clamp-1">
                                            {task.clienteNombre ||
                                                task.comunidad || "Cliente"}
                                        </p>
                                        <p className="text-sm text-gray-500 line-clamp-1">
                                            {task.direccion || "Sin dirección"}
                                        </p>

                                        {task.esExtra && (
                                            <p className="text-xs text-brand-orange font-medium mt-1 flex items-center">
                                                <PlusCircleIcon className="h-3 w-3 inline mr-1" />
                                                {task.tipoServicio}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <ChevronRightIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                            </button>
                        ))
                    )}
            </div>
        </div>
    );
}

export default EmployeeTaskListView;
