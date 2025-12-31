/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    fireEvent,
    render,
    screen,
    waitFor,
    within,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import EmployeesList from "../EmployeesList";
import { deleteEmployee, getEmployees } from "../../../../firebase/services";
import { Empleado } from "../../../../types";
import { Timestamp } from "firebase/firestore";

// Mock Firebase services
vi.mock("../../../../firebase/services", () => ({
    getEmployees: vi.fn(),
    deleteEmployee: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

// Mock SlideOver and EmployeePreview to avoid complex child rendering
vi.mock("../../common/SlideOver", () => ({
    default: ({ children, isOpen, title, onClose }: any) => (
        isOpen
            ? (
                <dialog open aria-label={title}>
                    <button onClick={onClose}>Close</button>
                    {children}
                </dialog>
            )
            : null
    ),
}));

vi.mock("../EmployeePreview", () => ({
    default: ({ employee, onDelete }: any) => (
        <div>
            <p>Preview: {employee?.nombre}</p>
            <button onClick={onDelete}>Confirm Delete</button>
        </div>
    ),
}));

describe("EmployeesList", () => {
    const mockEmployees: Empleado[] = [
        {
            id: "1",
            uid: "u1",
            nombre: "Ana",
            apellidos: "García",
            email: "ana@test.com",
            telefono: "111222333",
            dni: "12345678A",
            fechaContratacion: Timestamp.fromDate(new Date("2023-01-01")),
            activo: true,
        },
        {
            id: "2",
            uid: "u2",
            nombre: "Zacarias",
            apellidos: "López",
            email: "zac@test.com",
            telefono: "444555666",
            dni: "87654321B",
            fechaContratacion: Timestamp.fromDate(new Date("2023-02-01")),
            activo: true,
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        // Default success response
        (getEmployees as Mock).mockResolvedValue([...mockEmployees]);
        // Mock window methods
        vi.spyOn(globalThis, "confirm").mockReturnValue(true);
        vi.spyOn(globalThis, "alert").mockImplementation(() => undefined);

        // Add debug to deleteEmployee mock
        (deleteEmployee as Mock).mockImplementation((id) => {
            console.log("Mock deleteEmployee called with", id);
            return Promise.resolve();
        });
    });

    it("renders loading skeleton initially then list", async () => {
        render(<EmployeesList />);
        // Check for skeleton/loading state implicitly (or verify calls didn't happen yet immediately if sync)
        // Wait for data load
        await waitFor(() => {
            expect(screen.getByText("Ana García")).toBeInTheDocument();
            expect(screen.getByText("Zacarias López")).toBeInTheDocument();
        });
    });

    it("renders empty state when no employees found", async () => {
        (getEmployees as Mock).mockResolvedValue([]);
        render(<EmployeesList />);
        await waitFor(() => {
            expect(screen.getByText("No se encontraron empleados."))
                .toBeInTheDocument();
        });
    });

    it("filters employees by search term", async () => {
        render(<EmployeesList />);
        await waitFor(() => screen.getByText("Ana García"));

        const searchInput = screen.getByPlaceholderText(
            "Buscar por nombre o apellidos...",
        );
        fireEvent.change(searchInput, { target: { value: "Zac" } });

        expect(screen.queryByText("Ana García")).not.toBeInTheDocument();
        expect(screen.getByText("Zacarias López")).toBeInTheDocument();
    });

    it("sorts employees by name and surname", async () => {
        render(<EmployeesList />);
        await waitFor(() => screen.getByText("Ana García"));

        // Default is filtered by name ASC (Ana first)
        const rows = screen.getAllByRole("row");
        // Row 0 is header. Row 1 should be Ana.
        const row1 = rows[1];
        if (row1) {
            expect(within(row1).getByText("Ana García")).toBeInTheDocument();
        }

        // Click sort by Name (Toggle to DESC)
        const nameSortBtn = screen.getByText(/Nombre/i).closest("button");
        if (nameSortBtn) fireEvent.click(nameSortBtn);

        const rowsDesc = screen.getAllByRole("row");
        // Now Zacarias should be first
        const row1Desc = rowsDesc[1];
        if (row1Desc) {
            expect(within(row1Desc).getByText("Zacarias López"))
                .toBeInTheDocument();
        }
    });

    it("navigates to new employee page on button click", async () => {
        render(<EmployeesList />);
        const addBtn = await screen.findByText("Añadir Nuevo Empleado");
        fireEvent.click(addBtn);
        expect(mockNavigate).toHaveBeenCalledWith("/admin/employees/new");
    });

    it("opens details and deletes employee", async () => {
        render(<EmployeesList />);
        await waitFor(() => screen.getByText("Ana García"));

        // Click on row to open SlideOver
        fireEvent.click(screen.getByText("Ana García"));

        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByText("Preview: Ana")).toBeInTheDocument();

        // Click delete in preview
        const deleteBtn = screen.getByText("Confirm Delete");
        fireEvent.click(deleteBtn);

        // Expect deleteEmployee to be called
        await waitFor(() => {
            expect(deleteEmployee).toHaveBeenCalledTimes(1);
            expect(deleteEmployee).toHaveBeenCalledWith("1");
        });

        // Verify removed from list visually
        expect(screen.queryByText("Ana García")).not.toBeInTheDocument();
    });
});
