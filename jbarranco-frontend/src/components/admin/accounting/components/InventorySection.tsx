import type { InventoryExpenseItem } from "../../../../hooks/useAccountingData";

interface InventorySectionProps {
    readonly inventoryExpenses: InventoryExpenseItem[];
}

export default function InventorySection(
    { inventoryExpenses }: InventorySectionProps,
) {
    const totalInventory = inventoryExpenses.reduce(
        (sum, item) => sum + item.total,
        0,
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                    Valoración Inventario (Stock Total)
                </h3>
                <div className="text-right">
                    <p className="text-sm text-gray-500">
                        Valor Total Stock
                    </p>
                    <p className="text-xl font-bold text-orange-600">
                        {totalInventory.toLocaleString("es-ES")}€
                    </p>
                </div>
            </div>
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Producto
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cantidad
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Coste Unit. Est.
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Valor Total
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {inventoryExpenses.length > 0
                            ? (
                                inventoryExpenses.map((expense) => (
                                    <tr key={expense.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {expense.producto}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                            {expense.cantidad}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                            {expense.costeUnitario}€
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-orange-600">
                                            {expense.total.toLocaleString(
                                                "es-ES",
                                            )}€
                                        </td>
                                    </tr>
                                ))
                            )
                            : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-4 text-center text-gray-500"
                                    >
                                        No hay datos de inventario
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
