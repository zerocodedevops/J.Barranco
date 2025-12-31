import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import IncomePanel from "../components/IncomePanel";
import ExpensesPanel from "../components/ExpensesPanel";
import Accounting from "../Accounting";
import { MemoryRouter } from "react-router-dom";

// Mock del hook useAccountingData
const mockAccountingData = {
    loading: false,
    incomes: [
        {
            id: "1",
            fecha: new Date("2023-12-01T12:00:00Z"),
            cliente: "Cliente Test",
            descripcion: "Servicio de Limpieza",
            importe: 1000,
        },
    ],
    manualExpenses: [
        {
            id: "2",
            concepto: "Gasto Test 1",
            fecha: new Date("2023-12-02T12:00:00Z"),
            tipo: "gasto" as const,
            importe: 500,
        },
    ],
    payrollExpenses: [
        {
            id: "3",
            empleado: "Empleado Test",
            puesto: "Operario",
            costeMensual: 1500,
        },
    ],
    inventoryExpenses: [
        {
            id: "4",
            producto: "Producto Test",
            cantidad: 10,
            costeUnitario: 5,
            total: 50,
        },
    ],
    stats: {
        totalIncome: 1000,
        totalExpenses: 2050,
        netBalance: -1050,
    },
    refreshData: vi.fn(),
};

vi.mock("../../../../hooks/useAccountingData", () => ({
    useAccountingData: () => mockAccountingData,
}));

vi.mock("../AddTransactionModal", () => ({
    default: () => <div data-testid="add-transaction-modal" />,
}));

vi.mock("../../../../services/storageService", () => ({
    getSignedDocumentUrl: vi.fn(),
}));

vi.mock("../../../common/LoadingSpinner", () => ({
    default: () => <div data-testid="loading-spinner" />,
}));

vi.mock("@heroicons/react/24/outline", () => ({
    PlusIcon: () => <svg data-testid="plus-icon" />,
}));

// Polyfill para ResizeObserver (requerido por Headless UI)
// Polyfill para ResizeObserver (requerido por Headless UI)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).ResizeObserver = class ResizeObserver {
    observe() {/* mock */}
    unobserve() {/* mock */}
    disconnect() {/* mock */}
};

describe("Accounting Module Snapshots", () => {
    it("IncomePanel renders correctly with data", () => {
        const { container } = render(
            <MemoryRouter>
                <IncomePanel incomes={mockAccountingData.incomes} />
            </MemoryRouter>,
        );
        expect(container).toMatchSnapshot();
    });

    it("IncomePanel empty state renders correctly", () => {
        const { container } = render(
            <MemoryRouter>
                <IncomePanel incomes={[]} />
            </MemoryRouter>,
        );
        expect(container).toMatchSnapshot();
    });

    it("ExpensesPanel renders correctly with all sections", () => {
        const { container } = render(
            <MemoryRouter>
                <ExpensesPanel
                    manualExpenses={mockAccountingData.manualExpenses}
                    payrollExpenses={mockAccountingData.payrollExpenses}
                    inventoryExpenses={mockAccountingData.inventoryExpenses}
                    onViewDocument={vi.fn()}
                />
            </MemoryRouter>,
        );
        expect(container).toMatchSnapshot();
    });

    it("Accounting main component renders correctly", () => {
        const { container } = render(
            <MemoryRouter>
                <Accounting />
            </MemoryRouter>,
        );
        expect(container).toMatchSnapshot();
    });
});
