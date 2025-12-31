import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface RequestExtraJobModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly onSubmit: (
        description: string,
        preferredDate: string,
    ) => Promise<void>;
}

export function RequestExtraJobModal(
    { isOpen, onClose, onSubmit }: RequestExtraJobModalProps,
) {
    const [description, setDescription] = useState("");
    const [preferredDate, setPreferredDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description) return;

        setIsSubmitting(true);
        await onSubmit(description, preferredDate);
        setIsSubmitting(false);
        setDescription("");
        setPreferredDate("");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Solicitar Trabajo Extra
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label
                            htmlFor="description"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Descripción del Trabajo *
                        </label>
                        <textarea
                            id="description"
                            rows={4}
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ej: Limpieza profunda de cristales en fachada norte..."
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-brand-blue focus:border-brand-blue"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="date"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Fecha Preferente (Opcional)
                        </label>
                        <input
                            type="date"
                            id="date"
                            value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full p-2.5"
                        />
                    </div>

                    <div className="flex justify-end pt-4 gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-50"
                        >
                            {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
