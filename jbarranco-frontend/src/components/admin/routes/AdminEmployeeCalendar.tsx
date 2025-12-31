import CalendarView from "../../common/CalendarView";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import EventModal from "./components/EventModal";
import { useAdminEmployeeCalendar } from "./hooks/useAdminEmployeeCalendar";
import { CalendarEvent, Extra, Ticket, Trabajo } from "../../../types";

interface AdminEmployeeCalendarProps {
    readonly employeeId: string;
    readonly employeeName: string;
    readonly lastUpdate?: number;
}

function AdminEmployeeCalendar(
    { employeeId, employeeName, lastUpdate }: AdminEmployeeCalendarProps,
) {
    const {
        events,
        loading,
        currentDate,
        setCurrentDate,
        currentView,
        setCurrentView,
        showModal,
        setShowModal,
        selectedEvent,
        setSelectedEvent,
        setSelectedSlot,
        formData,
        setFormData,
        clients,
        handleSelectSlot,
        handleSelectEvent,
        handleSubmit,
        handleDelete,
        handleClearRoute,
        getViewLabel,
        formErrors,
        employees,
    } = useAdminEmployeeCalendar(employeeId, employeeName, lastUpdate);

    if (!employeeId) {
        return (
            <div className="text-center p-10 text-gray-500">
                Selecciona un empleado para ver su calendario real.
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow h-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
                <h3 className="font-bold text-lg text-gray-800 w-full sm:w-auto text-center sm:text-left">
                    Calendario Real: {employeeName}
                </h3>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                    <button
                        onClick={handleClearRoute}
                        className="flex items-center justify-center text-sm bg-red-100 text-red-700 px-3 py-1.5 rounded hover:bg-red-200 border border-red-200 transition-colors"
                        title="Eliminar todos los trabajos de la vista actual"
                    >
                        <TrashIcon className="h-4 w-4 mr-1" /> Vaciar{" "}
                        {getViewLabel()}
                    </button>

                    <button
                        onClick={() => {
                            setSelectedSlot(new Date());
                            setSelectedEvent(null);
                            setShowModal(true);
                        }}
                        className="flex items-center justify-center text-sm bg-brand-blue text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors"
                    >
                        <PlusIcon className="h-4 w-4 mr-1" /> Nuevo Trabajo
                    </button>
                </div>
            </div>

            {loading
                ? <div className="text-center py-20">Cargando eventos...</div>
                : (
                    <CalendarView<
                        Trabajo | Ticket | Record<string, unknown> | Extra
                    >
                        events={events}
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={(event) =>
                            handleSelectEvent(
                                event as unknown as CalendarEvent,
                            )}
                        defaultView="month"
                        view={currentView}
                        onView={(view: string) => setCurrentView(view)}
                        date={currentDate}
                        onNavigate={(date: Date) => setCurrentDate(date)}
                    />
                )}

            <EventModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                title={selectedEvent
                    ? "Editar Trabajo"
                    : "Nuevo Trabajo (Día Completo)"}
                clients={clients}
                employees={employees}
                formData={formData}
                setFormData={setFormData}
                isEditing={!!selectedEvent}
                errors={formErrors}
            />
        </div>
    );
}

export default AdminEmployeeCalendar;
