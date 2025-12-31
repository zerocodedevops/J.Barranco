import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { deleteEmployee, getEmployees } from "../../../firebase/services";
import { Empleado } from "../../../types";
import SlideOver from "../../common/SlideOver";
import EmployeePreview from "./EmployeePreview";
import { TableSkeleton } from "../../common/skeletons/ListSkeleton";
import { formatFirestoreDate } from "../../../utils/dateHelpers";

function EmployeesList() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<
    { key: "nombre" | "apellidos"; direction: "asc" | "desc" }
  >({ key: "nombre", direction: "asc" });

  // SlideOver State
  const [selectedEmployee, setSelectedEmployee] = useState<Empleado | null>(
    null,
  );

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(data);
      setLoading(false);
    };
    fetchEmployees();
  }, []);

  const handleDelete = React.useCallback(
    async (e: React.MouseEvent | null, id: string, name: string) => {
      if (e) e.stopPropagation();
      if (
        globalThis.confirm(
          `¿Estás seguro de que quieres eliminar a "${name}"? Esta acción no se puede deshacer.`,
        )
      ) {
        try {
          await deleteEmployee(id);
          setEmployees((current) => current.filter((e) => e.id !== id));
          if (selectedEmployee?.id === id) setSelectedEmployee(null);
          alert("Empleado eliminado correctamente.");
        } catch (error) {
          console.error("Error al eliminar empleado:", error);
          alert("Hubo un error al eliminar el empleado.");
        }
      }
    },
    [selectedEmployee],
  );

  const filteredEmployees = React.useMemo(() => {
    return employees
      .filter((employee) =>
        `${employee.nombre} ${employee.apellidos}`.toLowerCase().includes(
          searchTerm.toLowerCase(),
        )
      )
      .sort((a, b) => {
        // Safe access using keyof Empleado is tricky because key is dynamic, but we know it matches 'nombre' | 'apellidos'
        // and both exist on Empleado (apellidos is optional).
        const aValue = (a[sortConfig.key] || "").toLowerCase();
        const bValue = (b[sortConfig.key] || "").toLowerCase();

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
  }, [employees, searchTerm, sortConfig]);

  const handleSort = React.useCallback((key: "nombre" | "apellidos") => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc"
        ? "desc"
        : "asc",
    }));
  }, []);

  const handleCloseSlideOver = React.useCallback(
    () => setSelectedEmployee(null),
    [],
  );

  const handleConfirmDelete = React.useCallback(() => {
    if (selectedEmployee) {
      handleDelete(
        null,
        selectedEmployee.id,
        `${selectedEmployee.nombre} ${selectedEmployee.apellidos}`,
      );
    }
  }, [selectedEmployee, handleDelete]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Listado de Empleados
        </h2>
        <button
          onClick={() => navigate("/admin/employees/new")}
          className="bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Añadir Nuevo Empleado
        </button>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-grow w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar por nombre o apellidos..."
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

        <div className="flex items-center gap-2 w-full sm:w-auto text-sm text-gray-500">
          <span>Ordenar por:</span>
          <button
            onClick={() => handleSort("nombre")}
            className={`px-3 py-1 rounded border ${
              sortConfig.key === "nombre"
                ? "bg-blue-50 border-blue-200 text-brand-blue"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            Nombre {sortConfig.key === "nombre" &&
              (sortConfig.direction === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("apellidos")}
            className={`px-3 py-1 rounded border ${
              sortConfig.key === "apellidos"
                ? "bg-blue-50 border-blue-200 text-brand-blue"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            Apellidos {sortConfig.key === "apellidos" &&
              (sortConfig.direction === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>

      <div className="mt-6">
        {loading
          ? <TableSkeleton columns={4} rows={5} />
          : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {filteredEmployees.length === 0
                ? (
                  <div className="p-8 text-center text-gray-500">
                    No se encontraron empleados.
                  </div>
                )
                : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort("nombre")}
                        >
                          Empleado {sortConfig.key === "nombre" &&
                            (sortConfig.direction === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          DNI
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contacto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha Ingreso
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEmployees.map((employee) => (
                        <tr
                          key={employee.id}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => setSelectedEmployee(employee)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-brand-blue">
                              {employee.nombre} {employee.apellidos}
                            </div>
                            <div className="text-xs text-gray-500">
                              {employee.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {employee.dni}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {employee.telefono}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatFirestoreDate(employee.fechaContratacion)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
            </div>
          )}
      </div>

      {/* SlideOver de detalle */}
      <SlideOver
        isOpen={!!selectedEmployee}
        onClose={handleCloseSlideOver}
        title={selectedEmployee?.nombre
          ? `${selectedEmployee.nombre} ${selectedEmployee.apellidos}`
          : "Detalle Empleado"}
      >
        <EmployeePreview
          employee={selectedEmployee}
          onClose={handleCloseSlideOver}
          onDelete={handleConfirmDelete}
        />
      </SlideOver>
    </div>
  );
}

export default EmployeesList;
