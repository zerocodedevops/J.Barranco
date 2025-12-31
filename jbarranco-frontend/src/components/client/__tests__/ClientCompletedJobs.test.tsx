import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ClientCompletedJobs from "../ClientCompletedJobs";
import * as firebaseFirestore from "firebase/firestore";

// Mock Hooks
vi.mock("../../../context/AuthContext", () => ({
    useAuth: () => ({ user: { uid: "client-1" } }),
}));

vi.mock("../../../hooks/useRatings", () => ({
    useRatings: vi.fn(() => ({
        getClientRatings: vi.fn(),
        submitRating: vi.fn(),
    })),
}));

// Mock Firestore
vi.mock("firebase/firestore", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual as object,
        collection: vi.fn(),
        query: vi.fn(),
        where: vi.fn(),
        orderBy: vi.fn(),
        getDocs: vi.fn(),
        addDoc: vi.fn(),
        Timestamp: {
            now: () => ({ toDate: () => new Date() }),
        },
    };
});

// Import hook to mock return values inside tests
import { useRatings } from "../../../hooks/useRatings";

describe("ClientCompletedJobs", () => {
    const mockGetClientRatings = vi.fn();
    const mockSubmitRating = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        // Since we are mocking the module above, we can just spy on the hook implementation
        // or re-assign the return value if it's a mock.
        (useRatings as Mock).mockReturnValue({
            getClientRatings: mockGetClientRatings,
            submitRating: mockSubmitRating,
        });
    });

    it("renders empty state", async () => {
        mockGetClientRatings.mockResolvedValue([]);
        (firebaseFirestore.getDocs as Mock).mockResolvedValue({ docs: [] });

        render(<ClientCompletedJobs />);

        await waitFor(() => {
            expect(screen.getByText("No hay trabajos completados"))
                .toBeInTheDocument();
        });
    });

    it("renders completed jobs and allows rating", async () => {
        // Workaround for specific date format in test env
        const jobDate = new Date("2025-01-01T10:00:00");

        mockGetClientRatings.mockResolvedValue([]); // No ratings yet

        const mockJob = {
            id: "job-1",
            data: () => ({
                fecha: { toDate: () => jobDate },
                tipo: "mantenimiento",
                descripcion: "Limpieza general",
                empleadoNombre: "Juan Limpieza",
                estado: "completado",
            }),
        };

        (firebaseFirestore.getDocs as Mock).mockResolvedValue({
            docs: [mockJob],
        });

        render(<ClientCompletedJobs />);

        await waitFor(() => {
            expect(screen.getByText("Mantenimiento")).toBeInTheDocument();
            expect(screen.getByText("Juan Limpieza")).toBeInTheDocument();
        });

        const rateBtn = screen.getByRole("button", {
            name: /Valorar Servicio/i,
        });
        expect(rateBtn).toBeInTheDocument();

        fireEvent.click(rateBtn);
        // Modal should open (looking for modal text)
        expect(screen.getByText("Valorar Servicio")).toBeInTheDocument();
    });

    it("shows 'Valorado' badge if job is already rated", async () => {
        const jobDate = new Date();

        // Mock existing rating
        mockGetClientRatings.mockResolvedValue([{ jobId: "job-1", rating: 5 }]);

        const mockJob = {
            id: "job-1",
            data: () => ({
                fecha: { toDate: () => jobDate },
                tipo: "averia",
                estado: "completado",
            }),
        };

        (firebaseFirestore.getDocs as Mock).mockResolvedValue({
            docs: [mockJob],
        });

        render(<ClientCompletedJobs />);

        await waitFor(() => {
            expect(screen.getByText("Averia")).toBeInTheDocument();
        });

        expect(screen.getByText("Valorado")).toBeInTheDocument();
        expect(screen.queryByText(/Valorar Servicio/i)).not.toBeInTheDocument();
    });
});
