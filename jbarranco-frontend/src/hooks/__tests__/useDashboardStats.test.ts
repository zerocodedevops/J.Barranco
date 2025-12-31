import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDashboardStats } from "../useDashboardStats";

// Mock completo de Firebase Firestore
vi.mock("../../firebase/config", () => ({
    db: {
        type: "firestore",
    },
}));

// Mock de funciones de Firestore
vi.mock("firebase/firestore", () => ({
    collection: vi.fn(() => ({ _path: "test-collection" })),
    query: vi.fn(() => ({ _type: "query" })),
    where: vi.fn(() => ({ _type: "where" })),
    getCountFromServer: vi.fn(() =>
        Promise.resolve({
            data: () => ({ count: 5 }),
        })
    ),
    getDocs: vi.fn(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSnapshot: vi.fn((_q: any, callback: any) => {
        // Simular datos de Firestore de forma síncrona
        callback({
            docs: [
                { id: "1", data: () => ({ estado: "completado" }) },
                { id: "2", data: () => ({ estado: "pendiente" }) },
            ],
        });
        return () => undefined;
    }),
}));

describe("useDashboardStats", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns stats object", () => {
        const { result } = renderHook(() => useDashboardStats());

        expect(result.current).toHaveProperty("stats");
        expect(typeof result.current.stats).toBe("object");
    });

    it("returns loading property", () => {
        const { result } = renderHook(() => useDashboardStats());

        expect(result.current).toHaveProperty("loading");
        expect(typeof result.current.loading).toBe("boolean");
    });

    it("stats object has required structure", () => {
        const { result } = renderHook(() => useDashboardStats());

        // Verificar que stats tiene las propiedades correctas
        expect(result.current.stats).toHaveProperty("quejasPendientes");
        expect(result.current.stats).toHaveProperty("solicitudesExtra");
        expect(result.current.stats).toHaveProperty("observacionesNuevas");
        expect(result.current.stats).toHaveProperty("tareasPorAsignar");
    });

    it("hook is callable and returns consistent structure", () => {
        const { result } = renderHook(() => useDashboardStats());

        expect(result.current).toBeDefined();
        expect(result.current.stats).toBeDefined();
        expect(result.current.loading).toBeDefined();
    });
});
