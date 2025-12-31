import {
    ArrowRightCircleIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { ItemInventario, StockCliente } from "../../../types";

interface InventoryTableProps {
    items: (ItemInventario | StockCliente)[];
    activeTab: "warehouse" | "clients";
    loading: boolean;
    onEdit: (item: ItemInventario | StockCliente) => void;
    onDelete: (item: ItemInventario | StockCliente) => void;
    onTransfer: (item: ItemInventario) => void;
    selectedClientId?: string; // To show nice message if no client selected
}

export const InventoryTable = ({
    items,
    activeTab,
    loading,
    onEdit,
    onDelete,
    onTransfer,
    selectedClientId,
}: InventoryTableProps) => {
    if (activeTab === "clients" && !selectedClientId) {
        return (
            <div className="p-12 text-center text-gray-500">
                <p>
                    Selecciona un cliente arriba para gestionar su inventario.
                </p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                {loading ? "Cargando..." : "No hay artículos registrados."}
            </div>
        );
    }

    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio U.
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.producto}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.categoria}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span
                                className={`font-semibold ${
                                    Number(item.cantidad) <
                                            (item.stockMinimo || 5)
                                        ? "text-red-600"
                                        : "text-gray-900"
                                }`}
                            >
                                {Number(item.cantidad)}
                            </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {Number(item.precio || 0).toLocaleString("es-ES", {
                                style: "currency",
                                currency: "EUR",
                            })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {activeTab === "warehouse" && (
                                <button
                                    onClick={() =>
                                        onTransfer(item as ItemInventario)}
                                    className="text-green-600 hover:text-green-900 mr-3 inline-flex items-center gap-1"
                                    title="Transferir a Cliente"
                                >
                                    <ArrowRightCircleIcon className="h-5 w-5" />
                                </button>
                            )}
                            <button
                                onClick={() =>
                                    onEdit(item)}
                                className="text-brand-blue hover:text-blue-900 mr-3"
                            >
                                <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() =>
                                    onDelete(item)}
                                className="text-red-600 hover:text-red-900"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
