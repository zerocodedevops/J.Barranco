import type { PayrollExpenseItem } from "../../../../hooks/useAccountingData";

interface PayrollSectionProps {
    readonly payrollExpenses: PayrollExpenseItem[];
}

export default function PayrollSection(
    { payrollExpenses }: PayrollSectionProps,
) {
    const totalPayroll = payrollExpenses.reduce(
        (sum, item) => sum + item.costeMensual,
        0,
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                    Estimación Nóminas (Mensual)
                </h3>
                <div className="text-right">
                    <p className="text-sm text-gray-500">
                        Total Nóminas
                    </p>
                    <p className="text-xl font-bold text-red-600">
                        {totalPayroll.toLocaleString("es-ES")}€
                    </p>
                </div>
            </div>
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Empleado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Puesto
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Coste Estimado
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {payrollExpenses.length > 0
                            ? (
                                payrollExpenses.map((expense) => (
                                    <tr key={expense.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {expense.empleado}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {expense.puesto}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                                            {expense.costeMensual
                                                .toLocaleString(
                                                    "es-ES",
                                                )}€
                                        </td>
                                    </tr>
                                ))
                            )
                            : (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-6 py-4 text-center text-gray-500"
                                    >
                                        No hay empleados registrados
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
