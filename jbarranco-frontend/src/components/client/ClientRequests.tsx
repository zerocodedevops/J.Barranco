import { PlusIcon } from "@heroicons/react/24/outline";
import { useClientRequests } from "./hooks/useClientRequests";
import { TicketList } from "./components/TicketList";
import { RequestModal } from "./components/RequestModal";

function ClientRequests() {
    const {
        tickets,
        loading,
        activeTab,
        modalOpen,
        submitting,
        formState,
        setActiveTab,
        setModalOpen,
        handleCreateTicket,
        updateForm,
    } = useClientRequests();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Mis Tickets e Incidencias
                </h2>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <PlusIcon className="h-5 w-5" />
                    Nuevo Ticket
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab("abierto")}
                        className={`${
                            activeTab === "abierto"
                                ? "border-brand-blue text-brand-blue"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Abiertos / En Progreso
                    </button>
                    <button
                        onClick={() => setActiveTab("cerrado")}
                        className={`${
                            activeTab === "cerrado"
                                ? "border-brand-blue text-brand-blue"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Historial (Cerrados)
                    </button>
                </nav>
            </div>

            {/* Listado */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <TicketList tickets={tickets} loading={loading} />
            </div>

            {/* Modal */}
            <RequestModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleCreateTicket}
                submitting={submitting}
                formState={formState}
                onUpdate={updateForm}
            />
        </div>
    );
}

export default ClientRequests;
