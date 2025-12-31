/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, renderHook, waitFor } from "@testing-library/react";
import { useAdminEmployeeCalendar } from "../useAdminEmployeeCalendar";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import * as firestore from "firebase/firestore";
import toast from "react-hot-toast";

vi.mock("firebase/firestore", async () => {
    const actual = await vi.importActual("firebase/firestore");
    return {
        ...actual,
        collection: vi.fn(),
        query: vi.fn(),
        where: vi.fn(),
        getDocs: vi.fn(),
        addDoc: vi.fn(),
        updateDoc: vi.fn(),
        deleteDoc: vi.fn(),
        doc: vi.fn(),
        writeBatch: vi.fn(),
    };
});

vi.mock("react-hot-toast", () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock("../../../../firebase/config", () => ({
    db: {},
}));

describe("useAdminEmployeeCalendar", () => {
    const employeeId = "emp123";
    const employeeName = "John Doe";

    beforeEach(() => {
        vi.clearAllMocks();
        (firestore.collection as Mock).mockReturnValue("collectionRef");
        // Mock getDocs empty by default
        (firestore.getDocs as Mock).mockResolvedValue({
            docs: [],
            empty: true,
            size: 0,
        });
    });

    it("should load clients on mount", async () => {
        const mockClients = [
            { id: "c1", data: () => ({ nombre: "Cliente 1" }) },
        ];
        (firestore.getDocs as Mock).mockResolvedValue({ docs: [] });
        (firestore.getDocs as Mock)
            .mockResolvedValueOnce({ docs: [] }) // employees
            .mockResolvedValueOnce({
                docs: mockClients,
            }); // clients

        const { result } = renderHook(() =>
            useAdminEmployeeCalendar(employeeId, employeeName)
        );

        await waitFor(() => {
            expect(result.current.clients).toHaveLength(1);
            expect(result.current.clients[0]?.id).toBe("c1");
        });
    });

    it("should load tasks when employeeId changes", async () => {
        const mockTasks = [
            {
                id: "t1",
                data: () => ({
                    clienteNombre: "Cliente Test",
                    descripcion: "Tarea Prueba",
                    fecha: { toDate: () => new Date("2024-01-01") },
                    fechaFin: { toDate: () => new Date("2024-01-01T02:00:00") },
                }),
            },
        ];
        // First call is clients, second is tasks
        (firestore.getDocs as Mock).mockResolvedValue({ docs: mockTasks }); // Default for tasks
        (firestore.getDocs as Mock)
            .mockResolvedValueOnce({ docs: [] }) // employees
            .mockResolvedValueOnce({ docs: [] }); // clients

        const { result } = renderHook(() =>
            useAdminEmployeeCalendar(employeeId, employeeName)
        );

        await waitFor(() => {
            expect(result.current.events).toHaveLength(1);
            expect(result.current.events[0]?.title).toBe(
                "Cliente Test - Tarea Prueba",
            );
        });
    });

    it("should open modal on slot selection", async () => {
        const { result } = renderHook(() =>
            useAdminEmployeeCalendar(employeeId, employeeName)
        );

        // Wait for initial load to settle to avoid act warnings from useEffects
        await waitFor(() => expect(result.current.loading).toBe(false));

        act(() => {
            result.current.handleSelectSlot({
                start: new Date(),
                end: new Date(),
                slots: [],
                action: "select",
            });
        });

        expect(result.current.showModal).toBe(true);
        expect(result.current.selectedEvent).toBeNull();
    });

    it("should open modal on event selection", async () => {
        const { result } = renderHook(() =>
            useAdminEmployeeCalendar(employeeId, employeeName)
        );

        await waitFor(() => expect(result.current.loading).toBe(false));

        const event = {
            id: "t1",
            title: "Test",
            start: new Date(),
            end: new Date(),
            resource: { clienteId: "c1", descripcion: "Desc" },
        };

        act(() => {
            result.current.handleSelectEvent(event as any);
        });

        expect(result.current.showModal).toBe(true);
        expect(result.current.selectedEvent).toBe(event);
        expect(result.current.formData.clienteId).toBe("c1");
    });

    it("should create new task on submit", async () => {
        const { result } = renderHook(() =>
            useAdminEmployeeCalendar(employeeId, employeeName)
        );

        await waitFor(() => expect(result.current.loading).toBe(false));

        act(() => {
            result.current.handleSelectSlot({ start: new Date() } as any);
        });

        act(() => {
            result.current.setFormData({
                ...result.current.formData,
                clienteId: "c1",
                descripcion: "New Task",
                empleadoId: employeeId,
                fecha: "2024-01-01",
            });
        });

        await act(async () => {
            await result.current.handleSubmit(
                { preventDefault: vi.fn() } as any,
            );
        });

        expect(firestore.addDoc).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith("Trabajo creado");
        expect(result.current.showModal).toBe(false);
    });

    it("should prevent submission when validation fails", async () => {
        const { result } = renderHook(() =>
            useAdminEmployeeCalendar(employeeId, employeeName)
        );

        await waitFor(() => expect(result.current.loading).toBe(false));

        // Open modal
        act(() => {
            result.current.handleSelectSlot({ start: new Date() } as any);
        });

        // Set invalid data (empty client)
        act(() => {
            result.current.setFormData({
                ...result.current.formData,
                clienteId: "",
                descripcion: "Invalid Task",
            });
        });

        await act(async () => {
            await result.current.handleSubmit(
                { preventDefault: vi.fn() } as any,
            );
        });

        expect(firestore.addDoc).not.toHaveBeenCalled();
        // Since we fixed Zod access, expecting just the error call
        expect(result.current.formErrors.clienteId).toBeDefined();
    });

    it("should update existing task on submit", async () => {
        const { result } = renderHook(() =>
            useAdminEmployeeCalendar(employeeId, employeeName)
        );

        await waitFor(() => expect(result.current.loading).toBe(false));

        act(() => {
            result.current.handleSelectEvent({
                id: "t1",
                start: new Date(),
                resource: { clienteId: "c1", descripcion: "Desc" },
            } as any);
        });

        await act(async () => {
            await result.current.handleSubmit(
                { preventDefault: vi.fn() } as any,
            );
        });

        expect(firestore.updateDoc).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith("Trabajo actualizado");
    });

    it("should delete task with confirmation", async () => {
        const { result } = renderHook(() =>
            useAdminEmployeeCalendar(employeeId, employeeName)
        );
        vi.spyOn(globalThis, "confirm").mockReturnValue(true);

        await waitFor(() => expect(result.current.loading).toBe(false));

        act(() => {
            result.current.handleSelectEvent({
                id: "t1",
                start: new Date(),
            } as any);
        });

        await act(async () => {
            await result.current.handleDelete();
        });

        expect(firestore.deleteDoc).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith("Trabajo eliminado");
    });

    it("should handle batch clear route", async () => {
        const { result } = renderHook(() =>
            useAdminEmployeeCalendar(employeeId, employeeName)
        );
        vi.spyOn(globalThis, "confirm").mockReturnValue(true);

        // Mock getting docs to delete
        const mockDocs = [
            { ref: "ref1", data: () => ({}) },
            { ref: "ref2", data: () => ({}) },
        ];
        (firestore.getDocs as Mock).mockResolvedValue({
            docs: mockDocs,
            empty: false,
            size: 2,
        });

        const mockBatch = {
            delete: vi.fn(),
            commit: vi.fn(),
        };
        (firestore.writeBatch as Mock).mockReturnValue(mockBatch);

        await act(async () => {
            await result.current.handleClearRoute();
        });

        expect(firestore.writeBatch).toHaveBeenCalled();
        expect(mockBatch.delete).toHaveBeenCalledTimes(2);
        expect(mockBatch.commit).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(
            expect.stringContaining("Ruta del MES vaciada correctamente"),
        );
    });
});
