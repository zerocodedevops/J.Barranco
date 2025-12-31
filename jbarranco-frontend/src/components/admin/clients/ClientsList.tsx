import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  deleteClient,
  getClients,
  getEmployees,
} from "../../../firebase/services";
import { Cliente } from "../../../types";
import SlideOver from "../../common/SlideOver";
import ClientPreview from "./ClientPreview";
import { TableSkeleton } from "../../common/skeletons/ListSkeleton";
import BulkClientImport from "./BulkClientImport";

function ClientsList() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // SlideOver State
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);

  // Bulk Import State
  const [showBulkImport, setShowBulkImport] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [employeesMap, setEmployeesMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [clientsData, employeesData] = await Promise.all([
          getClients(),
          getEmployees(),
        ]);

        setClients(clientsData);

        const empMap: Record<string, string> = {};
        employeesData.forEach((emp) => {
          empMap[emp.id] = `${emp.nombre} ${emp.apellidos || ""}`.trim();
        });
        setEmployeesMap(empMap);
      } catch (e) {
        console.error("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Memoize handleDelete to avoid re-creation
  const handleDelete = React.useCallback(
    async (e: React.MouseEvent | null, id: string, name: string) => {
      if (e) e.stopPropagation();
      if (
        window.confirm(
          `¿Estás seguro de que quieres eliminar a "${name}"? Esta acción no se puede deshacer.`,
        )
      ) {
        try {
          await deleteClient(id);
          setClients((currentClients) =>
            currentClients.filter((c) => c.id !== id)
          );
          if (selectedClient?.id === id) setSelectedClient(null);
          alert("Cliente eliminado correctamente.");
        } catch (error) {
          console.error("Error al eliminar cliente:", error);
          alert("Hubo un error al eliminar el cliente.");
        }
      }
    },
    [selectedClient],
  ); // Note: clients dependency might trigger re-creations, but it's consistent.

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // useMemo for filtering AND sorting
  const filteredClients = React.useMemo(() => {
    const result = clients.filter((client) =>
      client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.direccion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      const nameA = a.nombre.toLowerCase();
      const nameB = b.nombre.toLowerCase();
      if (sortOrder === "asc") return nameA.localeCompare(nameB);
      return nameB.localeCompare(nameA);
    });

    return result;
  }, [clients, searchTerm, sortOrder]);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const toggleSort = () => {
    setSortOrder((prev) => prev === "asc" ? "desc" : "asc");
  };

  const handleCloseSlideOver = React.useCallback(
    () => setSelectedClient(null),
    [],
  );

  const handleConfirmDelete = React.useCallback(() => {
    if (selectedClient) {
      handleDelete(null, selectedClient.id, selectedClient.nombre);
    }
  }, [selectedClient, handleDelete]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Listado de Clientes
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBulkImport(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            <ArrowUpTrayIcon className="h-5 w-5" />
            Importación Masiva
          </button>
          <button
            onClick={() => navigate("/admin/clients/new")}
            className="bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Añadir Nuevo Cliente
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar por nombre o dirección..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        {loading
          ? <TableSkeleton columns={3} rows={5} />
          : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {filteredClients.length === 0
                ? (
                  <div className="p-8 text-center text-gray-500">
                    No se encontraron clientes.
                  </div>
                )
                : (
                  <>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        {/* ... existing headers ... */}
                        <tr>
                          <th
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group select-none"
                            onClick={toggleSort}
                          >
                            <div className="flex items-center gap-1">
                              Empresa / Comunidad
                              {sortOrder === "asc" ? " ↓" : " ↑"}
                            </div>
                          </th>

                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dirección
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contacto
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedClients.map((client) => (
                          <tr
                            key={client.id}
                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => setSelectedClient(client)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-brand-blue">
                                {client.nombre}
                              </div>
                              <div className="text-xs text-gray-500">
                                CIF: {client.cif}
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {client.ciudad}
                              </div>
                              <div className="text-xs text-gray-500">
                                {client.direccion}
                              </div>
                              <div className="text-xs text-gray-500">
                                CP: {client.codigoPostal}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {client.nombreContacto}
                              </div>
                              <div className="text-xs text-gray-500">
                                {client.email}
                              </div>
                              <div className="text-xs text-gray-500">
                                {client.telefono}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* Pagination Controls */}
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          Anterior
                        </button>
                        <button
                          onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          Siguiente
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Mostrando{" "}
                            <span className="font-medium">
                              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                            </span>{" "}
                            a{" "}
                            <span className="font-medium">
                              {Math.min(
                                currentPage * ITEMS_PER_PAGE,
                                filteredClients.length,
                              )}
                            </span>{" "}
                            de{" "}
                            <span className="font-medium">
                              {filteredClients.length}
                            </span>{" "}
                            resultados
                          </p>
                        </div>
                        <div>
                          <nav
                            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                            aria-label="Pagination"
                          >
                            <button
                              onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100"
                            >
                              <span className="sr-only">Anterior</span>
                              {/* ChevronLeft */}
                              <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                            {/* Page numbers could go here, for now just simple Prev/Next */}
                            <button
                              onClick={() =>
                                setCurrentPage((p) =>
                                  Math.min(totalPages, p + 1)
                                )}
                              disabled={currentPage === totalPages}
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100"
                            >
                              <span className="sr-only">Siguiente</span>
                              {/* ChevronRight */}
                              <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </>
                )}
            </div>
          )}
      </div>

      {/* SlideOver de detalle */}
      <SlideOver
        isOpen={!!selectedClient}
        onClose={handleCloseSlideOver}
        title={selectedClient?.nombre || "Detalle Cliente"}
      >
        <ClientPreview
          client={selectedClient
            ? {
              ...selectedClient,
              empleadoAsignadoNombre: selectedClient.empleadoAsignadoId
                ? employeesMap[selectedClient.empleadoAsignadoId]
                : undefined,
            }
            : null}
          onClose={handleCloseSlideOver}
          onDelete={handleConfirmDelete}
        />
      </SlideOver>

      {/* Bulk Import Modal */}
      {showBulkImport && (
        <BulkClientImport
          onClose={() => setShowBulkImport(false)}
          onComplete={() => {
            // Refresh clients list
            getClients().then(setClients).catch(console.error);
          }}
        />
      )}
    </div>
  );
}

export default ClientsList;
