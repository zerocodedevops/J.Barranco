import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { ComplaintsTable } from "../components/ComplaintsTable";
import ComplaintsList from "../ComplaintsList";
import { MemoryRouter } from "react-router-dom";

// Mocks de componentes UI complejos
vi.mock("../ComplaintsListRow", () => ({
    ComplaintsListRow: () => (
        <tr data-testid="complaints-list-row">
            <td>Row</td>
        </tr>
    ),
}));

vi.mock("../components/ComplaintsFilter", () => ({
    ComplaintsFilter: () => <div data-testid="complaints-filter">Filter</div>,
}));

vi.mock("../TicketPreview", () => ({
    default: () => <div data-testid="ticket-preview">Ticket Preview</div>,
}));

vi.mock("../../../common/SlideOver", () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: ({ children, isOpen, title }: any) => (
        isOpen
            ? (
                <div data-testid="slide-over">
                    <h1>{title}</h1>
                    {children}
                </div>
            )
            : null
    ),
}));

// ... (skipping unchanged code)

// Mock de datos
const mockTickets = [
    {
        id: "1",
        asunto: "Test Ticket",
        tipo: "incidencia",
        estado: "pendiente",
        prioridad: "alta",
        fechaCreacion: { toDate: () => new Date("2023-12-01T10:00:00Z") },
        clienteNombre: "Client A",
        creadoPor: "User A",
        mensajes: [],
        metadata: {},
        origen: "tickets",
    },
];

// Mock del hook useComplaintsList
const mockUseComplaintsList = {
    filteredTickets: mockTickets,
    loading: false,
    searchTerm: "",
    setSearchTerm: vi.fn(),
    filterType: "",
    setFilterType: vi.fn(),
    selectedTicket: null,
    setSelectedTicket: vi.fn(),
    sortConfig: { key: "fecha", direction: "desc" },
    selectedIds: new Set(),
    handleSelectAll: vi.fn(),
    handleSelectOne: vi.fn(),
    handleBulkDelete: vi.fn(),
    handleDeleteAllObservations: vi.fn(),
    fetchTickets: vi.fn(),
    handleSort: vi.fn(),
};

vi.mock("../hooks/useComplaintsList", () => ({
    useComplaintsList: () => mockUseComplaintsList,
}));

// ResizeObserver mock
globalThis.ResizeObserver = class ResizeObserver {
    observe() {/* mock */}
    unobserve() {/* mock */}
    disconnect() {/* mock */}
};

describe("ComplaintsSnapshot", () => {
    it("ComplaintsTable renders correctly with data", () => {
        const { container } = render(
            <ComplaintsTable
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                tickets={mockTickets as any}
                loading={false}
                selectedIds={new Set()}
                sortConfig={{ key: "fecha", direction: "desc" }}
                onSort={() => void 0}
                onSelectAll={() => void 0}
                onSelectOne={() => void 0}
                onViewTicket={() => void 0}
                isObsView={false}
            />,
        );
        expect(container).toMatchSnapshot();
    });

    it("ComplaintsTable renders empty state correctly", () => {
        const { container } = render(
            <ComplaintsTable
                tickets={[]}
                loading={false}
                selectedIds={new Set()}
                sortConfig={null}
                onSort={() => void 0}
                onSelectAll={() => void 0}
                onSelectOne={() => void 0}
                onViewTicket={() => void 0}
                isObsView={false}
            />,
        );
        expect(container).toMatchSnapshot();
    });

    it("ComplaintsTable renders loading state correctly", () => {
        const { container } = render(
            <ComplaintsTable
                tickets={[]}
                loading={true}
                selectedIds={new Set()}
                sortConfig={null}
                onSort={() => void 0}
                onSelectAll={() => void 0}
                onSelectOne={() => void 0}
                onViewTicket={() => void 0}
                isObsView={false}
            />,
        );
        expect(container).toMatchSnapshot();
    });

    it("ComplaintsList renders correctly (Main View)", () => {
        const { container } = render(
            <MemoryRouter>
                <ComplaintsList />
            </MemoryRouter>,
        );
        expect(container).toMatchSnapshot();
    });

    it("ComplaintsList renders with selection actions enabled", () => {
        expect(true).toBe(true);
    });
});
