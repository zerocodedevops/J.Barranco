import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { Cliente, ItemInventario } from "../../../types";

interface InventoryTransferModalProps {
    showTransferModal: boolean;
    transferItem: ItemInventario | null;
    clients: Cliente[];
    transferData: { clienteId: string; cantidad: number };
    loading: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    setTransferData: (data: { clienteId: string; cantidad: number }) => void;
}

export const InventoryTransferModal = ({
    showTransferModal,
    transferItem,
    clients,
    transferData,
    loading,
    onClose,
    onSubmit,
    setTransferData,
}: InventoryTransferModalProps) => {
    if (!showTransferModal || !transferItem) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ArrowRightCircleIcon className="h-6 w-6 text-green-600" />
                    Transferir Stock
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                    Mover <strong>{transferItem.producto}</strong>{" "}
                    del Almacén a un Cliente.
                    <br />
                    <span className="text-xs">
                        Disponible en almacén: {transferItem.cantidad}
                    </span>
                </p>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="destCliente"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Destino (Cliente) *
                        </label>
                        <select
                            id="destCliente"
                            value={transferData.clienteId}
                            onChange={(e) =>
                                setTransferData({
                                    ...transferData,
                                    clienteId: e.target.value,
                                })}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue bg-blue-50"
                        >
                            <option value="">-- Seleccionar Cliente --</option>
                            {clients.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.nombreComercial || c.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="transCantidad"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Cantidad a Transferir *
                        </label>
                        <input
                            id="transCantidad"
                            type="number"
                            min="1"
                            max={transferItem.cantidad}
                            value={transferData.cantidad}
                            onChange={(e) =>
                                setTransferData({
                                    ...transferData,
                                    cantidad: Number(e.target.value),
                                })}
                            required
                            className="w-full p-2 border border-blue-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            {loading
                                ? "Transfiriendo..."
                                : "Confirmar Transferencia"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
