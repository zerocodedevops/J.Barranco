import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ClientDetail from "../ClientDetail";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import * as firebaseServices from "../../../../firebase/services";
import * as useClientSubmitHook from "../../../../hooks/useClientSubmit";
// Mock react-hot-toast to avoid errors
vi.mock("react-hot-toast", () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock services
vi.mock("../../../../firebase/services", () => ({
    getEmployees: vi.fn(),
}));

// Mock custom hook
vi.mock("../../../../hooks/useClientSubmit", () => ({
    useClientSubmit: vi.fn(),
}));

// Mock cleanup service to prevent firestore errors
vi.mock("../../../../services/cleanupService", () => ({
    cleanAutoObservations: vi.fn().mockResolvedValue(0),
}));

// Mock Firestore parts used in component
vi.mock("firebase/firestore", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual as object,
        doc: vi.fn(),
        getDoc: vi.fn(),
        query: vi.fn(),
        where: vi.fn(),
        collection: vi.fn(),
        getDocs: vi.fn(),
    };
});

describe("ClientDetail Integration", () => {
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (firebaseServices.getEmployees as Mock).mockResolvedValue([
            { id: "emp1", nombre: "Juan", apellidos: "Pérez" },
        ]);
        (useClientSubmitHook.useClientSubmit as Mock).mockReturnValue({
            onSubmit: mockOnSubmit,
        });
    });

    it("renders 'Añadir Nuevo Cliente' when creating new", async () => {
        render(
            <MemoryRouter initialEntries={["/admin/clients/new"]}>
                <Routes>
                    <Route
                        path="/admin/clients/:id"
                        element={<ClientDetail />}
                    />
                </Routes>
            </MemoryRouter>,
        );

        expect(screen.getByText("Añadir Nuevo Cliente")).toBeInTheDocument();
        expect(screen.getByText("←")).toBeInTheDocument(); // Back button
    });

    it("validates required fields on empty submit", async () => {
        render(
            <MemoryRouter initialEntries={["/admin/clients/new"]}>
                <Routes>
                    <Route
                        path="/admin/clients/:id"
                        element={<ClientDetail />}
                    />
                </Routes>
            </MemoryRouter>,
        );

        const btn = screen.getByRole("button", {
            name: /Crear Cliente/i,
        });
        fireEvent.click(btn);

        // Expect validation errors (checked via text presence or toast)
        // Zod messages:
        await waitFor(() => {
            expect(
                screen.getByText("El nombre debe tener al menos 2 caracteres"),
            ).toBeInTheDocument();
            // Using regex for partial match
            expect(
                screen.getByText(/CIF debe tener 9 caracteres/i),
            ).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("submits valid data correctly", async () => {
        render(
            <MemoryRouter initialEntries={["/admin/clients/new"]}>
                <Routes>
                    <Route
                        path="/admin/clients/:id"
                        element={<ClientDetail />}
                    />
                </Routes>
            </MemoryRouter>,
        );

        // Fill Form
        fireEvent.change(screen.getByLabelText(/Nombre de la Comunidad/i), {
            target: { value: "Empresa Test" },
        });
        fireEvent.change(screen.getByLabelText(/CIF/i), {
            target: { value: "B12345678" },
        });
        fireEvent.change(screen.getByLabelText(/^Dirección/i), {
            target: { value: "Calle Falsa 123" },
        });
        fireEvent.change(screen.getByLabelText(/Ciudad/i), {
            target: { value: "Madrid" },
        });
        fireEvent.change(screen.getByLabelText(/Código Postal/i), {
            target: { value: "28001" },
        });
        fireEvent.change(screen.getByLabelText(/Nombre de Contacto/i), {
            target: { value: "Persona Contacto" },
        });
        fireEvent.change(screen.getByLabelText(/Email de Contacto/i), {
            target: { value: "test@test.com" },
        });
        fireEvent.change(screen.getByLabelText(/Teléfono de Contacto/i), {
            target: { value: "600123456" },
        });
        fireEvent.change(screen.getByLabelText(/Cuota Mensual/i), {
            target: { value: "100" },
        });

        const submitBtn = screen.getByRole("button", {
            name: /Crear Cliente/i,
        });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalled();
        });

        // Verify args passed to onSubmit
        const calls = mockOnSubmit.mock.calls;
        if (calls.length > 0) {
            const firstCall = calls[0];
            if (!firstCall) throw new Error("Call not found");
            const [formData, id] = firstCall;
            expect(id).toBe("new");
            expect(formData).toMatchObject({
                nombre: "Empresa Test",
                cif: "B12345678",
                ciudad: "Madrid",
            });
        }
    });
});
