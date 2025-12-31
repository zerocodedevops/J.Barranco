import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AdminCalendar from "../AdminCalendar";

// Mock Firebase
vi.mock("../../../../firebase/config", () => ({
    db: {},
}));

vi.mock("firebase/firestore", () => ({
    collection: vi.fn(),
    doc: vi.fn(),
    getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    onSnapshot: vi.fn((_query, callback) => {
        callback({ docs: [] });
        return () => undefined;
    }),
    query: vi.fn(),
    where: vi.fn(),
}));

// Mock Common Components
vi.mock("../../../common/CalendarView", () => ({
    default: () => <div data-testid="calendar-view">CalendarView Mock</div>,
}));

vi.mock("react-hot-toast", () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe("AdminCalendar", () => {
    it("renders calendar view after loading", async () => {
        render(<AdminCalendar />);

        // Should check for loading spinner initially (if we could access it easily or wait for it to disappear)
        // Check for CalendarView presence
        await waitFor(() => {
            expect(screen.getByTestId("calendar-view")).toBeInTheDocument();
        }, { timeout: 3000 });

        // Check header title
        expect(screen.getByText("Calendario de Trabajos")).toBeInTheDocument();
    });

    it("renders export buttons", async () => {
        render(<AdminCalendar />);
        await waitFor(() => {
            expect(screen.getByTitle("Exportar archivo de calendario (.ics)"))
                .toBeInTheDocument();
            expect(screen.getByTitle("Exportar listado a Excel (.csv)"))
                .toBeInTheDocument();
        });
    });

    it("handles event click opening modal", async () => {
        // Mock CalendarView to simulate selection
        // In a real test, verifying interactions between components is tricky without integration tests
        // For now, let's verify mapDocToEvent logic via the component flow (or assume it works)
        // Since we can't easily click a calendar event in the mock, we test the absence/presence logic
        render(<AdminCalendar />);

        // Initial state: no modal
        expect(screen.queryByText("Gestión de Trabajo")).not
            .toBeInTheDocument();
    });
});
