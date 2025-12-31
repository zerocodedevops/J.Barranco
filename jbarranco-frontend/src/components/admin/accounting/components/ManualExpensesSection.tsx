import type { TransactionItem } from "../../../../hooks/useAccountingData";
import { EyeIcon } from "@heroicons/react/24/outline";

interface ManualExpensesSectionProps {
    readonly manualExpenses: TransactionItem[];
    readonly onViewDocument: (path: string) => void;
}

export default function ManualExpensesSection(
    { manualExpenses, onViewDocument }: ManualExpensesSectionProps,
) {
    const totalManualExpenses = manualExpenses.reduce(
        (sum, item) => sum + item.importe,
        0,
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                    Gastos Varios y Suministros
                </h3>
                <div className="text-right">
                    <p className="text-sm text-gray-500">
                        Total Varios
                    </p>
                    <p className="text-xl font-bold text-red-600">
                        {totalManualExpenses.toLocaleString("es-ES")}€
                    </p>
                </div>
            </div>
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Concepto
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Importe
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Justificante
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {manualExpenses.length > 0
                            ? (
                                manualExpenses.map((expense) => (
                                    <tr key={expense.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {expense.fecha.toLocaleDateString(
                                                "es-ES",
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {expense.concepto}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                                            {expense.importe.toLocaleString(
                                                "es-ES",
                                            )}€
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                            {expense.archivo
                                                ? (
                                                    <button
                                                        onClick={() =>
                                                            onViewDocument(
                                                                expense.archivo
                                                                    ?.path ||
                                                                    "",
                                                            )}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="Ver Justificante"
                                                    >
                                                        <EyeIcon className="h-5 w-5 inline" />
                                                    </button>
                                                )
                                                : (
                                                    <span className="text-gray-400">
                                                        -
                                                    </span>
                                                )}
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
                                        No hay gastos varios registrados
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
