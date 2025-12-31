import { useEffect } from "react";
import { Cliente, Empleado } from "../../../../types";

interface EventModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly onSubmit: (e: React.FormEvent) => void;
    readonly onDelete: () => void;
    readonly title: string;
    readonly clients: Cliente[];
    readonly employees: Empleado[];
    readonly formData: {
        readonly clienteId: string;
        readonly empleadoId: string;
        readonly descripcion: string;
        readonly fecha: string;
    };
    readonly setFormData: (
        data: {
            clienteId: string;
            empleadoId: string;
            descripcion: string;
            fecha: string;
        },
    ) => void;
    readonly isEditing: boolean;
    readonly errors?: Record<string, string | undefined>;
}

export default function EventModal({
    isOpen,
    onClose,
    onSubmit,
    onDelete,
    title,
    clients,
    employees,
    formData,
    setFormData,
    isEditing,
    errors,
}: EventModalProps) {
    // Auto-assign employee when client changes
    useEffect(() => {
        if (formData.clienteId) {
            const client = clients.find((c) => c.id === formData.clienteId);
            if (client?.empleadoAsignadoId) {
                // Only auto-switch if no employee selected OR we just switched clients
                // To avoid overriding if user manually picked someone else?
                // For now, straightforward: Client has assigned employee -> Select them.
                // But we must preserve the REST of formData.
                // Warning: This effect runs on formData.clienteId change.
                // We need to be careful not to create loops.
                // Check if current employeeId is DIFFERENT from assigned to avoid redundant updates
                if (formData.empleadoId !== client.empleadoAsignadoId) {
                    setFormData({
                        ...formData,
                        empleadoId: client.empleadoAsignadoId || "",
                    });
                }
            }
        }
    }, [
        formData.clienteId,
        clients,
        formData.empleadoId,
        setFormData,
        formData,
    ]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h3 className="text-lg font-bold mb-4">{title}</h3>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="clienteId"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Cliente
                        </label>
                        <select
                            id="clienteId"
                            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue ${
                                errors?.clienteId
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            value={formData.clienteId}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    clienteId: e.target.value,
                                })}
                            required
                        >
                            <option value="">Selecciona cliente...</option>
                            {clients.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.nombre}
                                </option>
                            ))}
                        </select>
                        {errors?.clienteId && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.clienteId}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="empleadoId"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Empleado Asignado
                        </label>
                        <select
                            id="empleadoId"
                            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue ${
                                errors?.empleadoId
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            value={formData.empleadoId}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    empleadoId: e.target.value,
                                })}
                            required
                        >
                            <option value="">Selecciona empleado...</option>
                            {employees.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.nombre}{" "}
                                    {e.apellidos ? ` ${e.apellidos}` : ""}
                                </option>
                            ))}
                        </select>
                        {errors?.empleadoId && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.empleadoId}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Se auto-selecciona según el cliente, pero puedes
                            cambiarlo.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="fecha"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Fecha del Trabajo
                        </label>
                        <input
                            type="date"
                            id="fecha"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue"
                            value={formData.fecha || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    fecha: e.target.value,
                                })}
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="descripcion"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Descripción (Opcional)
                        </label>
                        <textarea
                            id="descripcion"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue"
                            rows={3}
                            value={formData.descripcion}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    descripcion: e.target.value,
                                })}
                            placeholder="Detalles del trabajo..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                        {isEditing && (
                            <button
                                type="button"
                                onClick={onDelete}
                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md mr-auto"
                            >
                                Eliminar
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-700"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
