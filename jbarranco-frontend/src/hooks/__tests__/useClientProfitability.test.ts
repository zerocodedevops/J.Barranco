import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { useClientProfitability } from "../useClientProfitability";
import * as firestore from "firebase/firestore";

// Mock Firebase
vi.mock("firebase/firestore", () => ({
    collection: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    getDocs: vi.fn(),
}));

vi.mock("../firebase/config", () => ({
    db: {},
}));

describe("useClientProfitability", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calculates profitability correctly", async () => {
        // Mock Data
        // 1. Client
        const clientDocs = [{
            id: "c1",
            data: () => ({
                nombre: "Client A",
                cuotaMensual: 100,
                diasContrato: [],
                empleadoAsignadoId: "emp1",
            }),
        }];

        // 2. Transactions (Revenue)
        const txDocs = [{
            data: () => ({
                tipo: "ingreso",
                clienteId: "c1",
                importe: 50,
                entidad: "Client A",
            }),
        }];

        // 3. Works (Labor)
        const worksDocs = [{
            data: () => ({
                clienteId: "c1",
                empleadoId: "emp1",
                estado: "completado",
            }), // 1 work done
        }];

        // 4. Employees (Rates)
        const empDocs = [{
            id: "emp1",
            data: () => ({ costeHora: "10" }), // 10€/hour
        }];

        // 5. Material Requests
        const reqDocs = [{
            data: () => ({
                clienteId: "c1",
                producto: "P1",
                cantidad: 2,
                estado: "aprobada",
            }),
        }];

        // 6. Inventory (Prices)
        const itemDocs = [{
            data: () => ({ producto: "P1", precio: 5 }), // 5€/unit
        }];

        // Mock getDocs to return these in order
        // Order in Promise.all: clients, tx, works, emps, req, items
        (firestore.getDocs as Mock)
            .mockResolvedValueOnce({ docs: clientDocs }) // Clients
            .mockResolvedValueOnce({ docs: txDocs }) // Transactions
            .mockResolvedValueOnce({ docs: worksDocs }) // Works
            .mockResolvedValueOnce({ docs: empDocs }) // Employees
            .mockResolvedValueOnce({ docs: reqDocs }) // Requests
            .mockResolvedValueOnce({ docs: itemDocs }); // Inventory

        const { result } = renderHook(() => useClientProfitability());

        expect(result.current.loading).toBe(true);

        await waitFor(() => expect(result.current.loading).toBe(false));

        // Calculations:
        // Revenue: 100 (Fee) + 50 (Tx) = 150
        // Labor: 1 work * 1 hour (default logic implies work duration?
        // Logic says: "return sum + (empCost * 1)". So 1 hour per work assumed if not specified.
        // Cost: 1 * 10 = 10.
        // Material: 2 qty * 5 price = 10.
        // Total Cost: 10 + 10 = 20.
        // Profit: 150 - 20 = 130.
        // Margin: (130 / 150) * 100 = 86.66%

        const data = result.current.data[0];
        if (!data) throw new Error("Data should be defined");
        expect(data.clientName).toBe("Client A");
        expect(data.revenue).toBe(150);
        expect(data.laborCost).toBe(10);
        expect(data.materialCost).toBe(10);
        expect(data.profit).toBe(130);
        expect(data.margin).toBeCloseTo(86.67, 1);
    });

    it("uses estimated cost if contract implies higher cost than actuals", async () => {
        // Client with contract of 2 days/week
        // But only 0 actual works
        const clientDocs = [{
            id: "c1",
            data: () => ({
                nombre: "Client B",
                cuotaMensual: 500,
                diasContrato: ["L", "M"], // 2 days
                empleadoAsignadoId: "emp1",
            }),
        }];

        const empDocs = [{
            id: "emp1",
            data: () => ({ costeHora: 10 }),
        }];

        // Empty other collections
        (firestore.getDocs as Mock)
            .mockResolvedValueOnce({ docs: clientDocs }) // Clients
            .mockResolvedValueOnce({ docs: [] }) // Tx
            .mockResolvedValueOnce({ docs: [] }) // Works (Actual = 0)
            .mockResolvedValueOnce({ docs: empDocs }) // Emps
            .mockResolvedValueOnce({ docs: [] }) // Reqs
            .mockResolvedValueOnce({ docs: [] }); // Items

        const { result } = renderHook(() => useClientProfitability());

        await waitFor(() => expect(result.current.loading).toBe(false));

        const data = result.current.data[0];
        if (!data) throw new Error("Data should be defined");

        // Estimated Calculation:
        // Weekly Hours: 2 days * 1 hour (assumed? logic: "(client.diasContrato?.length || 0) * 1") = 2 hours/week
        // Monthly: 2 * 4.33 = 8.66 hours
        // Cost: 8.66 * 10 = 86.6
        expect(data.laborCost).toBeCloseTo(86.6, 1);
    });

    it("handles errors gracefully", async () => {
        (firestore.getDocs as Mock).mockRejectedValue(
            new Error("Firebase fail"),
        );

        const { result } = renderHook(() => useClientProfitability());

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.error).toBeTruthy();
    });
});
