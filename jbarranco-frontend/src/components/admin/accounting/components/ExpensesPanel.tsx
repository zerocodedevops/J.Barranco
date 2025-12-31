import type {
    InventoryExpenseItem,
    PayrollExpenseItem,
    TransactionItem,
} from "../../../../hooks/useAccountingData";
import ManualExpensesSection from "./ManualExpensesSection";
import PayrollSection from "./PayrollSection";
import InventorySection from "./InventorySection";

interface ExpensesPanelProps {
    readonly manualExpenses: TransactionItem[];
    readonly payrollExpenses: PayrollExpenseItem[];
    readonly inventoryExpenses: InventoryExpenseItem[];
    readonly onViewDocument: (path: string) => void;
}

export default function ExpensesPanel({
    manualExpenses,
    payrollExpenses,
    inventoryExpenses,
    onViewDocument,
}: ExpensesPanelProps) {
    return (
        <div className="p-4 space-y-8">
            <ManualExpensesSection
                manualExpenses={manualExpenses}
                onViewDocument={onViewDocument}
            />
            <PayrollSection payrollExpenses={payrollExpenses} />
            <InventorySection inventoryExpenses={inventoryExpenses} />
        </div>
    );
}
