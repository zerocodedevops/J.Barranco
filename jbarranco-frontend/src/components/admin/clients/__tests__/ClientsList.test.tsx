/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    fireEvent,
    render,
    screen,
    waitFor,
    within,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import ClientsList from "../ClientsList";
import * as firebaseServices from "../../../../firebase/services";

// Mocks
vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(),
}));

vi.mock("../../../../firebase/services", () => ({
    getClients: vi.fn(),
    getEmployees: vi.fn(),
    deleteClient: vi.fn(),
}));

// Mock Supabase to prevent "Missing credentials" error during test execution
vi.mock("../../../../supabase/client", () => ({
    supabase: {
        storage: {
            from: vi.fn(() => ({
                getPublicUrl: vi.fn(() => ({
                    data: { publicUrl: "https://mock.url/file.jpg" },
                })),
            })),
        },
    },
    default: {},
}));

vi.mock("../../common/SlideOver", () => ({
    default: ({ isOpen, children, title }: any) => (
        isOpen
            ? <div data-testid="slide-over" title={title}>{children}</div>
            : null
    ),
}));

vi.mock("./ClientPreview", () => ({
    default: ({ client }: any) => (
        <div data-testid="client-preview">{client?.nombre}</div>
    ),
}));

describe("ClientsList (Pagination & Sort)", () => {
    const mockClients = Array.from({ length: 25 }, (_, i) => ({
        id: `client-${i + 1}`,
        nombre: `Cliente ${String(i + 1).padStart(2, "0")}`,
        cif: `CIF-${i + 1}`,
        direccion: `Direccion ${i + 1}`,
        ciudad: "Madrid",
        codigoPostal: "28000",
        nombreContacto: "Contacto",
        email: "test@test.com",
        telefono: "666777888",
        createdAt: new Date().toISOString(),
    }));

    beforeEach(() => {
        vi.clearAllMocks();
        (firebaseServices.getClients as Mock).mockResolvedValue(mockClients);
        (firebaseServices.getEmployees as Mock).mockResolvedValue([]);
    });

    it("renders first page of clients (10 items)", async () => {
        render(<ClientsList />);

        // Wait for data to load
        const client1 = await screen.findByText("Cliente 01");
        expect(client1).toBeInTheDocument();

        // Check if loading skeleton is gone
        // expect(screen.queryByTestId("table-skeleton")).not.toBeInTheDocument(); // assuming skeleton has testid

        // Check columns
        // Use regex or partial match because of the sort arrow
        expect(screen.getByText(/Empresa \/ Comunidad/i)).toBeInTheDocument();

        // Check that page 1 has 10 items
        // Filter rows to exclude header -> tbody rows
        const rows = screen.getAllByRole("row").filter((r) =>
            r.closest("tbody")
        );
        expect(rows).toHaveLength(10);

        expect(screen.getByText("Cliente 10")).toBeInTheDocument();
        expect(screen.queryByText("Cliente 11")).not.toBeInTheDocument();
    });

    it("paginates via Next/Prev buttons", async () => {
        render(<ClientsList />);

        await screen.findByText("Cliente 01");

        // There are two "Siguiente" buttons (mobile/desktop). Pick the first one.
        const nextBtns = screen.getAllByRole("button", { name: /siguiente/i });
        fireEvent.click(nextBtns[0] as HTMLElement);

        // Page 2: Clients 11-20
        await screen.findByText("Cliente 11");
        expect(screen.queryByText("Cliente 01")).not.toBeInTheDocument();
        expect(screen.queryByText("Cliente 21")).not.toBeInTheDocument();

        // Page 3: Clients 21-25
        fireEvent.click(nextBtns[0] as HTMLElement);
        await screen.findByText("Cliente 21");
        const rows = screen.getAllByRole("row").filter((r) =>
            r.closest("tbody")
        );
        expect(rows).toHaveLength(5);
    });

    it("filters and resets pagination", async () => {
        render(<ClientsList />);

        await screen.findByText("Cliente 01");

        // Go to page 2 first
        const nextBtns = screen.getAllByRole("button", { name: /siguiente/i });
        fireEvent.click(nextBtns[0] as HTMLElement);
        await screen.findByText("Cliente 11");

        // Search for "Cliente 01"
        const searchInput = screen.getByPlaceholderText(/buscar/i);
        fireEvent.change(searchInput, { target: { value: "Cliente 01" } });

        // Should return to page 1
        await screen.findByText("Cliente 01");

        // Ensure we are back on page 1
        expect(screen.getByText("Cliente 01")).toBeInTheDocument();
    });

    it("sorts clients by name asc/desc", async () => {
        // Use a smaller subset for sorting test clarity
        (firebaseServices.getClients as Mock).mockResolvedValue([
            { ...mockClients[0], nombre: "Ana" },
            { ...mockClients[1], nombre: "Zacarias" },
            { ...mockClients[2], nombre: "Berto" },
        ]);

        render(<ClientsList />);
        await waitFor(() => screen.getByText("Ana"));

        const sortHeader = screen.getByText(/Empresa/i);

        // Dictionary order: Ana, Berto, Zacarias (Asc default)
        let rows = screen.getAllByRole("row").filter((r) => r.closest("tbody"));
        expect(rows.length).toBeGreaterThan(2);

        expect(within(rows[0] as HTMLElement).getByText("Ana"))
            .toBeInTheDocument();
        expect(within(rows[1] as HTMLElement).getByText("Berto"))
            .toBeInTheDocument();
        expect(within(rows[2] as HTMLElement).getByText("Zacarias"))
            .toBeInTheDocument();

        // Toggle Sort -> Desc: Zacarias, Berto, Ana
        fireEvent.click(sortHeader);
        rows = screen.getAllByRole("row").filter((r) => r.closest("tbody"));

        expect(within(rows[0] as HTMLElement).getByText("Zacarias"))
            .toBeInTheDocument();
        expect(within(rows[1] as HTMLElement).getByText("Berto"))
            .toBeInTheDocument();
        expect(within(rows[2] as HTMLElement).getByText("Ana"))
            .toBeInTheDocument();
    });
});
