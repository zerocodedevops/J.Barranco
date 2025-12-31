import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { useNotifications } from "../useNotifications";
import * as firestore from "firebase/firestore";

// Mock Firebase
vi.mock("firebase/firestore", () => ({
    collection: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    onSnapshot: vi.fn(),
    Timestamp: {
        now: () => ({ toMillis: () => Date.now(), toDate: () => new Date() }),
        fromDate: (d: Date) => ({
            toMillis: () => d.getTime(),
            toDate: () => d,
        }),
    },
}));

vi.mock("../firebase/config", () => ({
    db: {},
}));

describe("useNotifications", () => {
    let mockCallbacks: Record<string, (snapshot: unknown) => void> = {};
    let mockUnsubscribes: (() => void)[] = [];

    beforeEach(() => {
        vi.clearAllMocks();
        mockCallbacks = {};
        mockUnsubscribes = [];

        // Mock onSnapshot to capture callbacks by simple order inference or scanning query?
        // Since useNotifications calls onSnapshot 7 times sequentially, we can mock generic implementation
        // that stores callback and returns a mock unsub.
        // Queries are: comunicaciones, extras, observaciones, reposicion, inventario, trabajos (tareas), tickets
        // The hook defines them in order.
        let callCount = 0;
        const sourceNames = [
            "comunicaciones",
            "extras",
            "observaciones",
            "reposiciones",
            "inventario",
            "tareas",
            "tickets",
        ];

        (firestore.onSnapshot as Mock).mockImplementation(
            (_query, callback) => {
                const index = callCount++;
                const source = sourceNames[index];
                // Store callback
                if (source) {
                    mockCallbacks[source] = callback;
                }

                const unsub = vi.fn();
                mockUnsubscribes.push(unsub);
                return unsub;
            },
        );
    });

    it("initializes with empty notifications and sets up listeners", () => {
        const { result } = renderHook(() => useNotifications());
        expect(result.current).toEqual([]);
        expect(firestore.onSnapshot).toHaveBeenCalledTimes(7);
    });

    it("aggregates data from multiple sources", async () => {
        const { result } = renderHook(() => useNotifications());

        // Simulate Comunicaciones
        const now = Date.now();
        const msgTime = { toMillis: () => now };

        await waitFor(() => {
            if (mockCallbacks["comunicaciones"]) {
                mockCallbacks["comunicaciones"]({
                    docs: [
                        {
                            id: "msg1",
                            data: () => ({
                                tipo: "Queja",
                                asunto: "Ruido",
                                fechaCreacion: msgTime,
                            }),
                        },
                    ],
                });
            }
        });

        // Simulate Tickets (Newer)
        const conflictTime = { toMillis: () => now + 1000 };
        await waitFor(() => {
            if (mockCallbacks["tickets"]) {
                mockCallbacks["tickets"]({
                    docs: [
                        {
                            id: "ticket1",
                            data: () => ({
                                asunto: "Ticket Urgente",
                                fechaCreacion: conflictTime,
                            }),
                        },
                    ],
                });
            }
        });

        // Verify aggregation and sorting (ticket1 should be first due to newer time)
        await waitFor(() => {
            expect(result.current).toHaveLength(2);
            expect(result.current[0]?.type).toBe("ticket");
            expect(result.current[1]?.type).toBe("comunicacion");
        });
    });

    it("handles low stock inventory logic", async () => {
        const { result } = renderHook(() => useNotifications());

        await waitFor(() => {
            if (mockCallbacks["inventario"]) {
                mockCallbacks["inventario"]({
                    docs: [
                        {
                            id: "item1",
                            data: () => ({
                                producto: "Lejía",
                                cantidad: 2,
                                stockMinimo: 5,
                            }), // Low stock
                        },
                        {
                            id: "item2",
                            data: () => ({
                                producto: "Jabón",
                                cantidad: 10,
                                stockMinimo: 5,
                            }), // Normal stock
                        },
                    ],
                });
            }
        });

        await waitFor(() => {
            const stockNotifs = result.current.filter((n) =>
                n.type === "stock_bajo"
            );
            expect(stockNotifs).toHaveLength(1);
            expect(stockNotifs[0]?.message).toContain("Lejía");
        });
    });

    it("unsubscribes on unmount", () => {
        const { unmount } = renderHook(() => useNotifications());
        unmount();
        mockUnsubscribes.forEach((unsub) => {
            expect(unsub).toHaveBeenCalled();
        });
    });
});
