import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { useClientSubmit } from "../useClientSubmit";
import * as firestore from "firebase/firestore";

import * as scheduleGen from "../../services/scheduleGenerator";
import { ClientFormInputs } from "../../components/admin/clients/clientHelpers";
import { Empleado } from "../../types";

// Mock Firebase
vi.mock("firebase/firestore", () => ({
    collection: vi.fn(),
    doc: vi.fn(),
    addDoc: vi.fn(),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
        loading: vi.fn(),
        dismiss: vi.fn(),
    },
}));

vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(),
}));

vi.mock("../../firebase/config", () => ({
    db: {},
}));

vi.mock("../../utils/authAdmin", () => ({
    createAuthUser: vi.fn(),
}));

vi.mock("../../services/scheduleGenerator", () => ({
    generateClientSchedule: vi.fn(),
}));

describe("useClientSubmit", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockEmployees = [{ id: "emp1", nombre: "Juan", apellidos: "Perez" }];

    it("creates a new client successfully", async () => {
        // Mock checks (empty)
        (firestore.getDocs as Mock).mockResolvedValue({ empty: true });

        // Mock Add
        (firestore.addDoc as Mock).mockResolvedValue({ id: "new-client-id" });

        const { result } = renderHook(() =>
            useClientSubmit(mockEmployees as unknown as Empleado[])
        );

        await result.current.onSubmit({
            nombre: "New Client",
            email: "test@test.com",
            cif: "123",
            telefono: "555",
            direccion: "Dir",
            codigoPostal: "28000", // Add required fields
            ciudad: "Madrid",
            provincia: "Madrid",
            tipo: "residencial",
        } as unknown as ClientFormInputs);

        expect(firestore.addDoc).toHaveBeenCalled();
        expect(firestore.setDoc).toHaveBeenCalledWith(
            undefined,
            expect.objectContaining({
                rol: "cliente",
            }),
        ); // User mirror creation
    });

    it("throws error on duplicate CIF", async () => {
        (firestore.getDocs as Mock)
            .mockResolvedValueOnce({ empty: false }) // CIF exists
            .mockResolvedValueOnce({ empty: true }); // Phone ok

        const { result } = renderHook(() =>
            useClientSubmit(mockEmployees as unknown as Empleado[])
        );

        await result.current.onSubmit(
            { cif: "EXIST", telefono: "555" } as unknown as ClientFormInputs,
        );

        // Toast error should be called
        // Expecting toast.error with "El CIF ya existe."
        const toast = (await import("react-hot-toast")).default;
        expect(toast.error).toHaveBeenCalledWith("El CIF ya existe.");
    });

    it("updates existing client", async () => {
        const { result } = renderHook(() =>
            useClientSubmit(mockEmployees as unknown as Empleado[])
        );

        // Mock checks (Promise.all - CIF check, Phone check)
        // For Update, find returns doc.id !== id to duplicate.
        // Return empty so no duplicates found
        (firestore.getDocs as Mock).mockResolvedValue({ docs: [] });

        await result.current.onSubmit({
            nombre: "Updated Client",
            cif: "123",
            telefono: "555",
        } as unknown as ClientFormInputs, "client-id-123");

        expect(firestore.updateDoc).toHaveBeenCalled();
    });

    it("generates schedule if contract days provided", async () => {
        (firestore.getDocs as Mock).mockResolvedValue({ empty: true });
        (firestore.addDoc as Mock).mockResolvedValue({ id: "new-id" });

        const { result } = renderHook(() =>
            useClientSubmit(mockEmployees as unknown as Empleado[])
        );

        await result.current.onSubmit({
            nombre: "Contract Client",
            diasContrato: ["1", "3"], // Mon, Wed
            empleadoAsignadoId: "emp1",
        } as unknown as ClientFormInputs);

        expect(scheduleGen.generateClientSchedule).toHaveBeenCalled();
    });
});
