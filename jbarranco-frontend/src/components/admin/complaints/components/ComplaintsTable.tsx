import { Ticket } from "../../../../types";
import { ComplaintsListRow } from "../ComplaintsListRow";

interface ComplaintsTableProps {
    readonly loading: boolean;
    readonly tickets: Ticket[];
    readonly selectedIds: Set<string>;
    readonly sortConfig: {
        readonly key: string;
        readonly direction: "asc" | "desc";
    } | null;
    readonly onSort: (key: string) => void;
    readonly onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readonly onSelectOne: (e: React.SyntheticEvent, id: string) => void;
    readonly onViewTicket: (ticket: Ticket) => void;
    readonly isObsView: boolean;
    readonly hideTypeColumn?: boolean;
}

const SortIcon = ({
    columnKey,
    sortConfig,
}: {
    columnKey: string;
    sortConfig: { key: string; direction: "asc" | "desc" } | null;
}) => {
    if (sortConfig?.key !== columnKey) {
        return <span className="ml-1 text-gray-300">↕</span>;
    }
    return (
        <span className="ml-1 text-brand-blue">
            {sortConfig.direction === "asc" ? "↑" : "↓"}
        </span>
    );
};

const TableHeader = ({
    label,
    columnKey,
    className = "",
    onSort,
    sortConfig,
}: {
    label: string;
    columnKey: string;
    className?: string;
    onSort: (key: string) => void;
    sortConfig: { key: string; direction: "asc" | "desc" } | null;
}) => (
    <th
        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none ${className}`}
        onClick={() => onSort(columnKey)}
    >
        <div className="flex items-center">
            {label}
            <SortIcon columnKey={columnKey} sortConfig={sortConfig} />
        </div>
    </th>
);

interface ComplaintsTableProps {
    readonly loading: boolean;
    readonly tickets: Ticket[];
    readonly selectedIds: Set<string>;
    readonly sortConfig: {
        readonly key: string;
        readonly direction: "asc" | "desc";
    } | null;
    readonly onSort: (key: string) => void;
    readonly onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readonly onSelectOne: (e: React.SyntheticEvent, id: string) => void;
    readonly onViewTicket: (ticket: Ticket) => void;
    readonly isObsView: boolean;
    readonly hideTypeColumn?: boolean;
}

// ... SortIcon and TableHeader helpers ... (omitted for brevity, assume they are there or I just replace the component)
// Actually I need to be careful not to delete them if I'm replacing the whole file or large chunk.
// I'll replace from `ComplaintsTable` definition downwards.

export function ComplaintsTable({
    loading,
    tickets,
    selectedIds,
    sortConfig,
    onSort,
    onSelectAll,
    onSelectOne,
    onViewTicket,
    isObsView,
    hideTypeColumn,
}: ComplaintsTableProps) {
    if (loading) {
        return (
            <div className="p-12 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto mb-2">
                </div>
                Cargando centro de control...
            </div>
        );
    }

    if (tickets.length === 0) {
        return (
            <div className="p-12 text-center text-gray-500">
                <p className="text-lg font-medium text-gray-900 mb-2">
                    No se encontraron tickets
                </p>
                <p className="text-sm">
                    Intenta cambiar los filtros de búsqueda.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 w-10 bg-gray-50">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue cursor-pointer"
                                onChange={onSelectAll}
                                checked={tickets.length > 0 &&
                                    selectedIds.size === tickets.length}
                            />
                        </th>
                        <TableHeader
                            label="Fecha"
                            columnKey="fecha"
                            className="w-32"
                            onSort={onSort}
                            sortConfig={sortConfig}
                        />
                        <TableHeader
                            label="Estado"
                            columnKey="estado"
                            className="w-32"
                            onSort={onSort}
                            sortConfig={sortConfig}
                        />
                        <TableHeader
                            label="Cliente"
                            columnKey="cliente"
                            onSort={onSort}
                            sortConfig={sortConfig}
                        />
                        {isObsView && (
                            <TableHeader
                                label="Limpieza Completada"
                                columnKey="column_4"
                                className="w-24 text-center"
                                onSort={onSort}
                                sortConfig={sortConfig}
                            />
                        )}
                        <TableHeader
                            label={isObsView ? "Observación" : "Asunto"}
                            columnKey="column_5"
                            onSort={onSort}
                            sortConfig={sortConfig}
                        />
                        {(isObsView || !hideTypeColumn) && (
                            <TableHeader
                                label={isObsView ? "Empleado" : "Tipo"}
                                columnKey="column_6"
                                className="w-24"
                                onSort={onSort}
                                sortConfig={sortConfig}
                            />
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {tickets.map((ticket) => (
                        <ComplaintsListRow
                            key={ticket.id}
                            ticket={ticket}
                            isSelected={selectedIds.has(ticket.id)}
                            isObsView={isObsView}
                            hideTypeColumn={hideTypeColumn}
                            onSelect={onSelectOne}
                            onClick={onViewTicket}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
