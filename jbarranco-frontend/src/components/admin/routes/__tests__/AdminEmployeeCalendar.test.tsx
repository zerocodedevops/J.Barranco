/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminEmployeeCalendar from "../AdminEmployeeCalendar";
import { useAdminEmployeeCalendar } from "../hooks/useAdminEmployeeCalendar";

// Mock the hook
vi.mock("../hooks/useAdminEmployeeCalendar");

// Mock child components
vi.mock("../../../common/CalendarView", () => ({
    default: (
        { events, onSelectEvent, onSelectSlot, onView, onNavigate }: any,
    ) => (
        <div data-testid="calendar-view">
            <div data-testid="calendar-events-count">{events?.length || 0}</div>
            <button onClick={() => onSelectEvent(events[0])}>
                Select Event
            </button>
            <button onClick={() => onSelectSlot({ start: new Date() })}>
                Select Slot
            </button>
            <button onClick={() => onView("week")}>Change View</button>
            <button onClick={() => onNavigate(new Date())}>Navigate</button>
        </div>
    ),
}));

vi.mock("../components/EventModal", () => ({
    default: ({ isOpen, onClose, onSubmit, onDelete, title }: any) => (
        isOpen
            ? (
                <div data-testid="event-modal">
                    <h1>{title}</h1>
                    <button onClick={onClose}>Close</button>
                    <button onClick={onSubmit}>Submit</button>
                    <button onClick={onDelete}>Delete</button>
                </div>
            )
            : null
    ),
}));

describe("AdminEmployeeCalendar", () => {
    const mockHookReturn = {
        events: [],
        loading: false,
        currentDate: new Date(),
        setCurrentDate: vi.fn(),
        currentView: "month",
        setCurrentView: vi.fn(),
        showModal: false,
        setShowModal: vi.fn(),
        selectedEvent: null,
        setSelectedEvent: vi.fn(),
        setSelectedSlot: vi.fn(),
        formData: {},
        setFormData: vi.fn(),
        clients: [],
        handleSelectSlot: vi.fn(),
        handleSelectEvent: vi.fn(),
        handleSubmit: vi.fn(),
        handleDelete: vi.fn(),
        handleClearRoute: vi.fn(),
        getViewLabel: vi.fn().mockReturnValue("del MES"),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useAdminEmployeeCalendar as any).mockReturnValue(mockHookReturn);
    });

    it("renders loading state correctly", () => {
        (useAdminEmployeeCalendar as any).mockReturnValue({
            ...mockHookReturn,
            loading: true,
        });

        render(
            <AdminEmployeeCalendar employeeId="123" employeeName="John Doe" />,
        );
        expect(screen.getByText("Cargando eventos...")).toBeInTheDocument();
    });

    it("renders empty state message when no employee selected", () => {
        render(<AdminEmployeeCalendar employeeId="" employeeName="" />);
        expect(screen.getByText(/Selecciona un empleado/i)).toBeInTheDocument();
    });

    it("renders calendar with events when loaded", () => {
        const mockEvents = [
            { id: "1", title: "Job 1", start: new Date(), end: new Date() },
            { id: "2", title: "Job 2", start: new Date(), end: new Date() },
        ];
        (useAdminEmployeeCalendar as any).mockReturnValue({
            ...mockHookReturn,
            events: mockEvents,
        });

        render(
            <AdminEmployeeCalendar employeeId="123" employeeName="John Doe" />,
        );

        expect(screen.getByText("Calendario Real: John Doe"))
            .toBeInTheDocument();
        expect(screen.getByTestId("calendar-view")).toBeInTheDocument();
        expect(screen.getByTestId("calendar-events-count")).toHaveTextContent(
            "2",
        );
    });

    it("opens 'New Job' modal when button clicked", () => {
        render(
            <AdminEmployeeCalendar employeeId="123" employeeName="John Doe" />,
        );

        const newJobBtn = screen.getByText("Nuevo Trabajo");
        fireEvent.click(newJobBtn);

        expect(mockHookReturn.setSelectedSlot).toHaveBeenCalled();
        expect(mockHookReturn.setSelectedEvent).toHaveBeenCalledWith(null);
        expect(mockHookReturn.setShowModal).toHaveBeenCalledWith(true);
    });

    it("calls handleClearRoute when 'Vaciar' button clicked", () => {
        render(
            <AdminEmployeeCalendar employeeId="123" employeeName="John Doe" />,
        );

        const clearBtn = screen.getByText(/Vaciar/i);
        expect(clearBtn).toHaveTextContent("Vaciar del MES"); // Check dynamic label
        fireEvent.click(clearBtn);

        expect(mockHookReturn.handleClearRoute).toHaveBeenCalled();
    });

    it("renders EventModal with correct title for new job", () => {
        (useAdminEmployeeCalendar as any).mockReturnValue({
            ...mockHookReturn,
            showModal: true,
            selectedEvent: null,
        });

        render(
            <AdminEmployeeCalendar employeeId="123" employeeName="John Doe" />,
        );

        expect(screen.getByTestId("event-modal")).toBeInTheDocument();
        expect(screen.getByText("Nuevo Trabajo (Día Completo)"))
            .toBeInTheDocument();
    });

    it("renders EventModal with correct title for editing", () => {
        (useAdminEmployeeCalendar as any).mockReturnValue({
            ...mockHookReturn,
            showModal: true,
            selectedEvent: { id: "1", title: "Existing Job" },
        });

        render(
            <AdminEmployeeCalendar employeeId="123" employeeName="John Doe" />,
        );

        expect(screen.getByTestId("event-modal")).toBeInTheDocument();
        expect(screen.getByText("Editar Trabajo")).toBeInTheDocument();
    });

    it("CalendarView callbacks trigger hook functions", () => {
        (useAdminEmployeeCalendar as any).mockReturnValue({
            ...mockHookReturn,
            events: [{ id: "1" }], // need at least one event for the mock button
        });

        render(
            <AdminEmployeeCalendar employeeId="123" employeeName="John Doe" />,
        );

        // Trigger mock buttons in CalendarView
        fireEvent.click(screen.getByText("Select Event"));
        expect(mockHookReturn.handleSelectEvent).toHaveBeenCalled();

        fireEvent.click(screen.getByText("Select Slot"));
        expect(mockHookReturn.handleSelectSlot).toHaveBeenCalled();

        fireEvent.click(screen.getByText("Change View"));
        expect(mockHookReturn.setCurrentView).toHaveBeenCalledWith("week");

        fireEvent.click(screen.getByText("Navigate"));
        expect(mockHookReturn.setCurrentDate).toHaveBeenCalled();
    });
});
