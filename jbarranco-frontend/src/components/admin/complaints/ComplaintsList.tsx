import { TrashIcon } from "@heroicons/react/24/outline";
import SlideOver from "../../common/SlideOver";
import TicketPreview from "./TicketPreview";
import { useComplaintsList } from "./hooks/useComplaintsList";
import { ComplaintsFilter } from "./components/ComplaintsFilter";
import { ComplaintsTable } from "./components/ComplaintsTable";

interface ComplaintsListProps {
  readonly title?: string;
  readonly allowedTypes?: string[];
  readonly hideTypeFilter?: boolean;
}

function ComplaintsList({
  title = "Gestión de Tickets e Incidencias",
  allowedTypes,
  hideTypeFilter = false,
}: ComplaintsListProps) {
  const {
    filteredTickets,
    loading,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    selectedTicket,
    setSelectedTicket,
    sortConfig,
    selectedIds,
    fetchTickets,
    handleSelectAll,
    handleSelectOne,
    handleBulkDelete,
    handleSort,
  } = useComplaintsList(allowedTypes);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 text-sm bg-red-600 text-white border border-red-700 rounded-md hover:bg-red-700 flex items-center gap-2 shadow-sm"
            >
              <TrashIcon className="h-4 w-4" />
              Eliminar ({selectedIds.size})
            </button>
          )}

          <button
            onClick={fetchTickets}
            className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <span>↻</span> Actualizar
          </button>
        </div>
      </div>

      <ComplaintsFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterType={filterType}
        onFilterChange={setFilterType}
        hideTypeFilter={hideTypeFilter}
      />

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <ComplaintsTable
          loading={loading}
          tickets={filteredTickets}
          selectedIds={selectedIds}
          sortConfig={sortConfig}
          onSort={handleSort}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onViewTicket={setSelectedTicket}
          isObsView={!!(allowedTypes?.includes("observacion") &&
            allowedTypes.length === 1)}
          hideTypeColumn={hideTypeFilter} // Reusing hideTypeFilter as logical proxy for "we are in a specific single-type view so type column might be redundant" OR explicitly pass it.
          // Better to add explicit prop to ComplaintsList
        />
      </div>

      <SlideOver
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title="Detalle del Ticket"
      >
        {selectedTicket && (
          <TicketPreview
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            onUpdate={() => {
              fetchTickets();
              setSelectedTicket(null);
            }}
          />
        )}
      </SlideOver>
    </div>
  );
}

export default ComplaintsList;
