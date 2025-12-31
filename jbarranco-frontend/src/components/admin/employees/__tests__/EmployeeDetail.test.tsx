import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import EmployeeDetail from "../EmployeeDetail";
import * as employeeActions from "../employeeActions";
import { useParams } from "react-router-dom";

// Mocks
vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(),
    useParams: vi.fn(),
}));

vi.mock("../../../../firebase/config", () => ({
    db: {},
}));

vi.mock("firebase/firestore", () => ({
    doc: vi.fn(),
    getDoc: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock actions
vi.mock("../employeeActions", () => ({
    checkDuplicates: vi.fn(),
    createEmployee: vi.fn(),
    updateEmployee: vi.fn(),
}));

vi.mock("../../../../utils/authAdmin", () => ({
    createAuthUser: vi.fn(),
}));

describe("EmployeeDetail (Form)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default param: id = "new" (Create mode)
        (useParams as Mock).mockReturnValue({ id: "new" });

        (employeeActions.checkDuplicates as Mock).mockResolvedValue({
            duplicateDni: false,
            duplicatePhone: false,
        });

        (employeeActions.createEmployee as Mock).mockResolvedValue({
            authCreated: true,
        });
    });

    it("renders create form correctly", () => {
        render(<EmployeeDetail />);
        expect(screen.getByText("Añadir Nuevo Empleado")).toBeInTheDocument();
        expect(screen.getByLabelText(/Fecha de Contratación/))
            .toBeInTheDocument();
    });

    it("displays validation errors for empty required fields", async () => {
        render(<EmployeeDetail />);

        // Submit without filling anything
        const submitBtn = screen.getByText("Crear Empleado");
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(
                screen.getByText("El nombre debe tener al menos 2 caracteres"),
            ).toBeInTheDocument();
            expect(
                screen.getByText(
                    "Los apellidos deben tener al menos 2 caracteres",
                ),
            ).toBeInTheDocument();
            expect(screen.getByText(/Invalid email/i)).toBeInTheDocument();
            expect(screen.getByText("La fecha de contratación es obligatoria"))
                .toBeInTheDocument();
            // Debug if email fails
        });

        expect(employeeActions.createEmployee).not.toHaveBeenCalled();
    });

    it("displays error for invalid DNI", async () => {
        render(<EmployeeDetail />);

        const dniInput = screen.getByLabelText(/DNI/);
        fireEvent.change(dniInput, { target: { value: "123" } });
        fireEvent.blur(dniInput); // Trigger validation

        const submitBtn = screen.getByText("Crear Empleado");
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText(/Introduzca un DNI o NIE válido/))
                .toBeInTheDocument();
        });
    });

    it("submits form with valid data", async () => {
        render(<EmployeeDetail />);

        fireEvent.change(screen.getByLabelText("Nombre *"), {
            target: { value: "Juan" },
        });
        fireEvent.change(screen.getByLabelText("Apellidos *"), {
            target: { value: "Pérez" },
        });
        fireEvent.change(screen.getByLabelText("DNI / NIE *"), {
            target: { value: "12345678A" },
        });
        fireEvent.change(screen.getByLabelText("Teléfono *"), {
            target: { value: "666777888" },
        });
        fireEvent.change(screen.getByLabelText("Email *"), {
            target: { value: "juan@test.com" },
        });

        // Date input needs YYYY-MM-DD
        const dateInput = screen.getByLabelText("Fecha de Contratación *");
        fireEvent.change(dateInput, { target: { value: "2024-01-01" } });

        const submitBtn = screen.getByText("Crear Empleado");
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(employeeActions.createEmployee).toHaveBeenCalled();
        });

        // Verify arguments
        const calledArg = (employeeActions.createEmployee as Mock).mock.calls[0]
            ?.[0];
        expect(calledArg.nombre).toBe("Juan");
        expect(calledArg.fechaContratacion).toBe("2024-01-01");
    });
});
