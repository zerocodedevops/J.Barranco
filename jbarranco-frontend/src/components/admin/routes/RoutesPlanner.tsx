import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../../firebase/config";
import {
  ArrowPathIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import AdminEmployeeCalendar from "./AdminEmployeeCalendar";
import AdminClientCalendar from "./AdminClientCalendar";
import RouteTemplateView from "./RouteTemplateView";
import PendingTasksSidebar from "./PendingTasksSidebar";
import { Cliente, Empleado, RoutesMap, TareaEspecial } from "../../../types";

function RoutesPlanner() {
  const [activeTab, setActiveTab] = useState<"calendar" | "template">(
    "calendar",
  );
  const [routes, setRoutes] = useState<RoutesMap>({
    Lunes: [],
    Martes: [],
    Miércoles: [],
    Jueves: [],
    Viernes: [],
  });
  const [clients, setClients] = useState<Cliente[]>([]);
  const [employees, setEmployees] = useState<Empleado[]>([]);
  const [pendingTasks, setPendingTasks] = useState<TareaEspecial[]>([]);
  const [loading, setLoading] = useState(true);

  // Selección de Vista
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");

  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedClientName, setSelectedClientName] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedEmployeeId) {
      const emp = employees.find((e) => e.id === selectedEmployeeId);
      setSelectedEmployeeName(
        emp ? `${emp.nombre} ${emp.apellidos || ""}` : "",
      );
      if (activeTab === "template") {
        loadEmployeeRoutes(selectedEmployeeId);
      }
    } else {
      // If switching away from employee, clear routes
      setRoutes({
        Lunes: [],
        Martes: [],
        Miércoles: [],
        Jueves: [],
        Viernes: [],
      });
    }
  }, [selectedEmployeeId, activeTab, employees]);

  useEffect(() => {
    if (selectedClientId) {
      const cli = clients.find((c) => c.id === selectedClientId);
      setSelectedClientName(cli?.nombre || "");
    }
  }, [selectedClientId, clients]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const clientsSnapshot = await getDocs(collection(db, "clientes"));
      const clientsData = clientsSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Cliente),
      );
      setClients(clientsData);

      const employeesSnapshot = await getDocs(collection(db, "empleados"));
      const employeesData = employeesSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Empleado),
      );
      setEmployees(employeesData);

      const tasksSnapshot = await getDocs(collection(db, "tareasEspeciales"));
      const tasksData = tasksSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          sourceCollection: "tareasEspeciales",
        } as unknown as TareaEspecial))
        .filter((task) => task.estado === "pendiente");

      const unassignedWorksQuery = query(
        collection(db, "trabajos"),
        where("empleadoId", "==", ""),
        where("estado", "==", "pendiente"),
      );
      const worksSnapshot = await getDocs(unassignedWorksQuery);
      const worksData = worksSnapshot.docs.map((doc) => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          descripcion: data.descripcion || "Trabajo sin descripción",
          idComunidad: data.clienteId,
          estado: data.estado,
          sourceCollection: "trabajos",
          ...data,
        } as unknown as TareaEspecial;
      });

      setPendingTasks([...tasksData, ...worksData]);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error al cargar datos iniciales");
    } finally {
      setLoading(false);
    }
  };

  const loadEmployeeRoutes = async (employeeId: string) => {
    try {
      const docRef = doc(db, "rutas", employeeId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRoutes(docSnap.data() as RoutesMap);
      } else {
        setRoutes({
          Lunes: [],
          Martes: [],
          Miércoles: [],
          Jueves: [],
          Viernes: [],
        });
      }
    } catch (error) {
      console.error("Error loading routes:", error);
    }
  };

  const handleRoutesUpdated = (newRoutes: RoutesMap) => {
    setRoutes(newRoutes);
  };

  const handleTaskAssigned = () => {
    loadInitialData();
  };

  // Handlers for selection
  const handleEmployeeSelect = (id: string) => {
    setSelectedEmployeeId(id);
    setSelectedClientId(""); // Mutual exclusive
  };

  const handleClientSelect = (id: string) => {
    setSelectedClientId(id);
    setSelectedEmployeeId(""); // Mutual exclusive
  };

  if (loading) return <div className="text-center py-20">Cargando...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-100px)]">
      <div className="flex-grow flex flex-col min-h-0">
        {/* Header y Selectores */}
        <div className="flex flex-col xl:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center md:text-left w-full xl:w-auto">
            Gestión de Rutas y Trabajos
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
            {/* Selector Empleado */}
            <div
              className={`flex items-center gap-2 bg-white p-2 rounded-lg shadow border transition-colors w-full md:w-auto ${
                selectedEmployeeId
                  ? "border-brand-blue ring-1 ring-brand-blue"
                  : "border-gray-200"
              }`}
            >
              <UserIcon
                className={`h-5 w-5 ${
                  selectedEmployeeId ? "text-brand-blue" : "text-gray-500"
                }`}
              />
              <select
                value={selectedEmployeeId}
                onChange={(e) => handleEmployeeSelect(e.target.value)}
                className="border-none focus:ring-0 text-gray-700 font-medium bg-transparent flex-grow md:min-w-[200px]"
              >
                <option value="">Selecciona empleado...</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nombre} {emp.apellidos}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-gray-400 font-medium hidden md:block">O</span>

            {/* Selector Cliente */}
            <div
              className={`flex items-center gap-2 bg-white p-2 rounded-lg shadow border transition-colors w-full md:w-auto ${
                selectedClientId
                  ? "border-brand-blue ring-1 ring-brand-blue"
                  : "border-gray-200"
              }`}
            >
              <BuildingOfficeIcon
                className={`h-5 w-5 ${
                  selectedClientId ? "text-brand-blue" : "text-gray-500"
                }`}
              />
              <select
                value={selectedClientId}
                onChange={(e) => handleClientSelect(e.target.value)}
                className="border-none focus:ring-0 text-gray-700 font-medium bg-transparent flex-grow md:min-w-[200px]"
              >
                <option value="">Selecciona cliente...</option>
                {clients.map((cli) => (
                  <option key={cli.id} value={cli.id}>
                    {cli.nombre}{" "}
                    {cli.nombreComercial ? `(${cli.nombreComercial})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Modo Planificacion tabs (Solo visible si hay Empleado seleccionado) */}
            {selectedEmployeeId && (
              <div className="bg-gray-100 p-1 rounded-lg flex w-full md:w-auto justify-center animate-fadeIn">
                <button
                  onClick={() => setActiveTab("calendar")}
                  className={`flex-1 md:flex-none px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                    activeTab === "calendar"
                      ? "bg-white text-brand-blue shadow"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <CalendarDaysIcon className="w-4 h-4 mr-1.5" />
                  Calendario Real
                </button>
                <button
                  onClick={() => setActiveTab("template")}
                  className={`flex-1 md:flex-none px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                    activeTab === "template"
                      ? "bg-white text-brand-blue shadow"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <ArrowPathIcon className="w-4 h-4 mr-1.5" />
                  Plantilla Recurrente
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="flex-grow bg-gray-50 rounded-xl border border-gray-200 p-4 overflow-hidden flex flex-col min-h-[500px] lg:min-h-0">
          {(() => {
            if (selectedEmployeeId) {
              return (
                <>
                  {/* VISTA EMPLEADO: CALENDARIO REAL */}
                  {activeTab === "calendar" && (
                    <AdminEmployeeCalendar
                      employeeId={selectedEmployeeId}
                      employeeName={selectedEmployeeName}
                    />
                  )}

                  {/* VISTA EMPLEADO: PLANTILLA RECURRENTE */}
                  {activeTab === "template" && (
                    <RouteTemplateView
                      selectedEmployeeId={selectedEmployeeId}
                      selectedEmployeeName={selectedEmployeeName}
                      routes={routes}
                      clients={clients}
                      onRoutesUpdated={handleRoutesUpdated}
                    />
                  )}
                </>
              );
            }

            if (selectedClientId) {
              /* VISTA CLIENTE */
              return (
                <AdminClientCalendar
                  clientId={selectedClientId}
                  clientName={selectedClientName}
                />
              );
            }

            return (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <div className="flex gap-4 mb-4 opacity-30">
                  <UserIcon className="h-16 w-16" />
                  <BuildingOfficeIcon className="h-16 w-16" />
                </div>
                <p>
                  Selecciona un empleado o un cliente para gestionar sus
                  trabajos.
                </p>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Sidebar: Tareas Pendientes */}
      <PendingTasksSidebar
        pendingTasks={pendingTasks}
        employees={employees}
        clients={clients}
        onTaskAssigned={handleTaskAssigned}
      />
    </div>
  );
}

export default RoutesPlanner;
