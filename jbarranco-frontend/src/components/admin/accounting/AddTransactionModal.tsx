import { ChangeEvent, FormEvent, Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PaperClipIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { uploadDocument } from "../../../services/storageService";
import toast from "react-hot-toast";

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTransactionAdded: () => void;
}

interface FormDataState {
    fecha: string;
    tipo: "ingreso" | "gasto"; // Must match value in select options
    concepto: string;
    importe: string;
    archivo: File | null;
}

export default function AddTransactionModal(
    { isOpen, onClose, onTransactionAdded }: AddTransactionModalProps,
) {
    const [formData, setFormData] = useState<FormDataState>({
        fecha: new Date().toISOString().substring(0, 10),
        tipo: "gasto",
        concepto: "",
        importe: "",
        archivo: null,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let archivoRef = null;

            // 1. Subir a Supabase si hay archivo
            if (formData.archivo) {
                const result = await uploadDocument(
                    formData.archivo,
                    "gastos-empresa",
                );
                archivoRef = {
                    path: result.path,
                    name: formData.archivo.name,
                };
            }

            // 2. Guardar en Firestore
            await addDoc(collection(db, "transactions"), {
                fecha: new Date(formData.fecha),
                tipo: formData.tipo,
                concepto: formData.concepto,
                importe: parseFloat(formData.importe) || 0,
                archivo: archivoRef,
                createdAt: new Date(),
                origen: "manual",
            });

            toast.success("Movimiento registrado");
            onTransactionAdded();
            onClose();
            setFormData({
                fecha: new Date().toISOString().substring(0, 10),
                tipo: "gasto",
                concepto: "",
                importe: "",
                archivo: null,
            });
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, archivo: e.target.files[0] });
        }
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                <button
                                    type="button"
                                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                                    onClick={onClose}
                                >
                                    <span className="sr-only">Cerrar</span>
                                    <XMarkIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-semibold leading-6 text-gray-900"
                                    >
                                        Registrar Movimiento
                                    </Dialog.Title>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="mt-6 space-y-4"
                                    >
                                        <div>
                                            <label
                                                htmlFor="tipo"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Tipo
                                            </label>
                                            <select
                                                id="tipo"
                                                value={formData.tipo}
                                                onChange={(
                                                    e: ChangeEvent<
                                                        HTMLSelectElement
                                                    >,
                                                ) => setFormData({
                                                    ...formData,
                                                    tipo: e.target.value as
                                                        | "ingreso"
                                                        | "gasto",
                                                })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                            >
                                                <option value="gasto">
                                                    Gasto
                                                </option>
                                                <option value="ingreso">
                                                    Ingreso
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="fecha"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Fecha
                                            </label>
                                            <input
                                                id="fecha"
                                                type="date"
                                                required
                                                value={formData.fecha}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        fecha: e.target.value,
                                                    })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="concepto"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Concepto
                                            </label>
                                            <input
                                                id="concepto"
                                                type="text"
                                                required
                                                value={formData.concepto}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        concepto:
                                                            e.target.value,
                                                    })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                                placeholder="Ej: Compra material oficina"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="importe"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Importe (€)
                                            </label>
                                            <input
                                                id="importe"
                                                type="number"
                                                step="0.01"
                                                required
                                                value={formData.importe}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        importe: e.target.value,
                                                    })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                            />
                                        </div>

                                        <div>
                                            <p className="block text-sm font-medium text-gray-700">
                                                Justificante (Opcional)
                                            </p>
                                            <div className="mt-1 flex items-center">
                                                <label className="flex items-center gap-2 cursor-pointer rounded-md bg-white border border-gray-300 py-2 px-3 shadow-sm text-sm font-medium leading-4 text-gray-700 hover:bg-gray-50 focus:outline-none">
                                                    <PaperClipIcon className="h-5 w-5 text-gray-500" />
                                                    <span className="truncate max-w-[200px]">
                                                        {formData.archivo
                                                            ? formData.archivo
                                                                .name
                                                            : "Adjuntar archivo"}
                                                    </span>
                                                    <input
                                                        type="file"
                                                        className="sr-only"
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        onChange={handleFileChange}
                                                    />
                                                </label>
                                            </div>
                                        </div>

                                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50"
                                            >
                                                {loading
                                                    ? "Guardando..."
                                                    : "Guardar"}
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                onClick={onClose}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
