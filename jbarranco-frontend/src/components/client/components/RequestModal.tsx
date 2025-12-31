import { TicketFormState } from "../hooks/useClientRequests";
import { TicketType } from "../../../types";

interface RequestModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly onSubmit: (e: React.FormEvent) => void;
    readonly submitting: boolean;
    readonly formState: TicketFormState;
    readonly onUpdate: (key: keyof TicketFormState, value: string) => void;
}

export function RequestModal({
    isOpen,
    onClose,
    onSubmit,
    submitting,
    formState,
    onUpdate,
}: RequestModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
                <div className="flex items-center justify-between p-4 border-b rounded-t">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Nuevo Ticket / Incidencia
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                    >
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    <div>
                        <label
                            htmlFor="newTicketType"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Tipo de Incidencia
                        </label>
                        <select
                            id="newTicketType"
                            value={formState.type}
                            onChange={(e) =>
                                onUpdate("type", e.target.value as TicketType)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        >
                            <option value="averia">
                                Avería / Mantenimiento
                            </option>
                            <option value="limpieza">
                                Limpieza Deficiente
                            </option>
                            <option value="sugerencia">
                                Sugerencia / Mejora
                            </option>
                            <option value="administrativo">
                                Administrativo / Facturación
                            </option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="newTicketSubject"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Asunto
                        </label>
                        <input
                            id="newTicketSubject"
                            type="text"
                            required
                            value={formState.subject}
                            onChange={(e) =>
                                onUpdate("subject", e.target.value)}
                            placeholder="Ej: Bombilla fundida en portal"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="newTicketMessage"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Descripción Detallada
                        </label>
                        <textarea
                            id="newTicketMessage"
                            rows={4}
                            required
                            value={formState.message}
                            onChange={(e) =>
                                onUpdate("message", e.target.value)}
                            placeholder="Describe el problema con el mayor detalle posible..."
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        >
                        </textarea>
                    </div>

                    <div className="flex items-center justify-end pt-4 border-t border-gray-200 rounded-b">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 mr-2"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            {submitting ? "Enviando..." : "Crear Ticket"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
