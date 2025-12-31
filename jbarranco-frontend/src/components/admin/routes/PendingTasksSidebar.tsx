import { useState } from "react";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { db } from "../../../firebase/config";
import { Cliente, Empleado, TareaEspecial } from "../../../types";

interface PendingTasksSidebarProps {
    readonly pendingTasks: TareaEspecial[];
    readonly employees: Empleado[];
    readonly clients: Cliente[];
    readonly onTaskAssigned: () => void;
}

export default function PendingTasksSidebar({
    pendingTasks,
    employees,
    clients,
    onTaskAssigned,
}: PendingTasksSidebarProps) {
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TareaEspecial | null>(
        null,
    );
    const [selectedTaskEmployee, setSelectedTaskEmployee] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("09:00");

    const getClientName = (clientId: string) => {
        const client = clients.find((c) => c.id === clientId);
        return client ? client.nombre : clientId;
    };

    const handleAssignTask = (task: TareaEspecial) => {
        setSelectedTask(task);
        setSelectedTaskEmployee("");
        // Set default date to today
        const today = new Date().toISOString().split("T")[0] ?? "";
        setSelectedDate(today);
        setSelectedTime("09:00");
        setShowTaskModal(true);
    };

    const handleSaveTaskAssignment = async () => {
        if (!selectedTaskEmployee || !selectedTask) {
            toast.error("Selecciona empleado");
            return;
        }
        if (!selectedDate) {
            toast.error("Selecciona una fecha");
            return;
        }
        try {
            // @ts-ignore
            const rawCollection = selectedTask.sourceCollection;
            const collectionName = typeof rawCollection === "string"
                ? rawCollection
                : "tareasEspeciales";

            // Convert selected date and time to Timestamp
            const dateTimeString = `${selectedDate}T${selectedTime}:00`;
            const selectedDateTime = new Date(dateTimeString);
            const fechaTimestamp = Timestamp.fromDate(selectedDateTime);

            await updateDoc(doc(db, collectionName, selectedTask.id), {
                empleadoId: selectedTaskEmployee,
                estado: "asignada",
                fecha: fechaTimestamp,
                horaInicio: selectedTime,
                fechaAsignacion: Timestamp.now(),
            });
            toast.success("Tarea asignada");
            setShowTaskModal(false);
            onTaskAssigned();
        } catch (error) {
            console.error("Error assigning task:", error);
            toast.error("Error al asignar");
        }
    };

    return (
        <>
            <div className="w-full lg:w-80 flex-shrink-0 bg-white p-4 rounded-xl border border-gray-200 flex flex-col h-[400px] lg:h-auto">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-center lg:justify-start">
                    <span className="w-2 h-2 bg-brand-orange rounded-full mr-2">
                    </span>{" "}
                    Solicitudes Pendientes
                </h3>
                <div className="flex-grow overflow-y-auto pr-2 space-y-3">
                    {pendingTasks.length === 0
                        ? (
                            <div className="text-center text-gray-400 text-sm py-8 opacity-60">
                                No hay tareas pendientes
                            </div>
                        )
                        : (
                            pendingTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:border-brand-orange transition-colors"
                                >
                                    <h4 className="font-medium text-gray-900 text-sm">
                                        {task.descripcion}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1 mb-2">
                                        Cliente:{" "}
                                        {getClientName(task.idComunidad)}
                                    </p>
                                    <button
                                        onClick={() => handleAssignTask(task)}
                                        className="w-full text-xs bg-brand-orange text-white px-2 py-1.5 rounded hover:bg-orange-600 font-medium"
                                    >
                                        Asignar
                                    </button>
                                </div>
                            ))
                        )}
                </div>
            </div>

            {showTaskModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-sm">
                        <h3 className="font-bold mb-4">Asignar Tarea</h3>
                        <p className="mb-4 text-sm">
                            {selectedTask?.descripcion}
                        </p>
                        <select
                            className="w-full border p-2 rounded mb-4"
                            value={selectedTaskEmployee}
                            onChange={(e) =>
                                setSelectedTaskEmployee(e.target.value)}
                        >
                            <option value="">Seleccionar empleado...</option>
                            {employees.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.nombre} {e.apellidos}
                                </option>
                            ))}
                        </select>

                        <label
                            htmlFor="task-date"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Fecha
                        </label>
                        <input
                            id="task-date"
                            type="date"
                            className="w-full border p-2 rounded mb-4"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />

                        <label
                            htmlFor="task-time"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Hora de inicio
                        </label>
                        <input
                            id="task-time"
                            type="time"
                            className="w-full border p-2 rounded mb-4"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowTaskModal(false)}
                                className="px-3 py-1 border rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveTaskAssignment}
                                className="px-3 py-1 bg-brand-orange text-white rounded"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
