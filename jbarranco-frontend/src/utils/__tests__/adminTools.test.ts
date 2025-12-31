import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { assignAllTasksToEmployee } from "../adminTools";
import * as firestore from "firebase/firestore";

// Mock Firebase
vi.mock("firebase/firestore", () => ({
    collection: vi.fn(),
    doc: vi.fn(),
    getDocs: vi.fn(),
    writeBatch: vi.fn(),
}));

vi.mock("../firebase/config", () => ({
    db: {},
}));

describe("adminTools", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("assignAllTasksToEmployee", () => {
        it("assigns all tasks and commits batch", async () => {
            const mockDocs = [
                { id: "t1" },
                { id: "t2" },
            ];
            (firestore.getDocs as Mock).mockResolvedValue({ docs: mockDocs });

            const mockBatch = {
                update: vi.fn(),
                commit: vi.fn(),
            };
            (firestore.writeBatch as Mock).mockReturnValue(mockBatch);

            const result = await assignAllTasksToEmployee("emp1", "Manuel");

            expect(result).toBe(2);
            expect(mockBatch.update).toHaveBeenCalledTimes(2);
            expect(mockBatch.update).toHaveBeenCalledWith(
                undefined, // doc ref is mocked as undefined return of doc() if not specified,
                // or we can verify second arg
                {
                    empleadoId: "emp1",
                    empleadoNombre: "Manuel",
                    estado: "pendiente",
                },
            );
            expect(mockBatch.commit).toHaveBeenCalled();
        });

        it("handles errors", async () => {
            (firestore.getDocs as Mock).mockRejectedValue(
                new Error("DB Error"),
            );
            await expect(assignAllTasksToEmployee("e1", "Name"))
                .rejects.toThrow("DB Error");
        });
    });
});
