import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface ComplaintsFilterProps {
    readonly searchTerm: string;
    readonly onSearchChange: (value: string) => void;
    readonly filterType: string;
    readonly onFilterChange: (value: string) => void;
    readonly hideTypeFilter?: boolean;
}

export function ComplaintsFilter({
    searchTerm,
    onSearchChange,
    filterType,
    onFilterChange,
    hideTypeFilter = false,
}: ComplaintsFilterProps) {
    return (
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                    placeholder="Buscar por cliente, asunto..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {!hideTypeFilter && (
                <div className="relative min-w-[200px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FunnelIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                        value={filterType}
                        onChange={(e) => onFilterChange(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm appearance-none"
                    >
                        <option value="all">Todo el Sistema</option>
                        <option value="incidencia">Incidencias / Quejas</option>
                        <option value="extra">Trabajos Extra</option>
                        <option value="observacion">
                            Observaciones Empleado
                        </option>
                        <option value="material">Solicitud Material</option>
                    </select>
                </div>
            )}
        </div>
    );
}
