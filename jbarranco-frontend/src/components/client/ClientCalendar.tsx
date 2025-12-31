import { useEffect, useState } from "react";
import { ArrowDownTrayIcon, CalendarIcon } from "@heroicons/react/24/outline";
import {
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import CalendarView from "../common/CalendarView";
import {
  addToGoogleCalendar,
  exportCalendarToICS,
} from "../../utils/calendarUtils";
import { CalendarEvent, Extra, Trabajo } from "../../types";

// Union type for the resource
// Resource type that covers both Trabajo and Extra properties
// Resource type that covers both Trabajo and Extra properties
interface ClientEventResource {
  id: string;
  tipoOriginal: "trabajo" | "extra";
  color: string;
  estado: string;
  tipo: string;
  empleado?: string;
  observaciones?: string;
  precio?: number;
  // Common fields from Trabajo/Extra
  clienteId: string;
  clienteNombre: string;
  direccion: string;
  fecha: Timestamp;
  fechaCreacion?: Timestamp;
  [key: string]: unknown; // Allow other properties
}

function ClientCalendar() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent<ClientEventResource>[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<
    CalendarEvent<ClientEventResource> | null
  >(null);

  // Cargar trabajos y extras del cliente desde Firestore (Real-time)
  useEffect(() => {
    if (!user?.uid) return;

    let unsubscribeTrabajos: () => void;
    let unsubscribeExtras: () => void;

    // Local caches to merge updates
    let cachedTrabajos: CalendarEvent<ClientEventResource>[] = [];
    let cachedExtras: CalendarEvent<ClientEventResource>[] = [];

    const updateCombinedEvents = () => {
      setEvents([...cachedTrabajos, ...cachedExtras]);
    };

    try {
      setLoading(true);

      // 1. Trabajos (Limpiezas Regulares) - Real-time
      const qTrabajos = query(
        collection(db, "trabajos"),
        where("clienteId", "==", user.uid),
      );

      unsubscribeTrabajos = onSnapshot(qTrabajos, (snapshot) => {
        cachedTrabajos = snapshot.docs.map((doc) => {
          const data = doc.data() as Trabajo;
          return {
            id: doc.id,
            title: data.descripcion || "Servicio de limpieza",
            start: data.fecha?.toDate ? data.fecha.toDate() : new Date(),
            end: data.fecha?.toDate
              ? new Date(data.fecha.toDate().getTime() + 2 * 60 * 60 * 1000)
              : new Date(),
            description: data.descripcion,
            location: data.direccion || user.direccion || "", // Ubicacion vs Direccion
            resource: {
              ...data,
              tipoOriginal: "trabajo",
              estado: data.estado || "pendiente",
              color: "blue",
              horaInicio: "09:00", // Dummy value needed by interface
              horaFin: "11:00",
            },
          };
        });
        updateCombinedEvents();
        setLoading(false); // First load done
      }, (error) => {
        console.error("Error watching trabajos:", error);
      });

      // 2. Extras - Real-time
      const qExtras = query(
        collection(db, "extras"),
        where("clienteId", "==", user.uid),
      );

      unsubscribeExtras = onSnapshot(qExtras, (snapshot) => {
        cachedExtras = snapshot.docs.map((doc) => {
          const data = doc.data() as Extra;
          const startDate = data.fecha?.toDate
            ? data.fecha.toDate()
            : (data.fecha as unknown as { toDate: () => Date })?.toDate?.() ||
              new Date();
          return {
            id: doc.id,
            title: `[EXTRA] ${data.descripcion || "Solicitud Extra"}`,
            start: startDate,
            end: new Date(startDate.getTime() + 1 * 60 * 60 * 1000),
            description: data.descripcion,
            location: data.direccion || user.direccion || "",
            resource: {
              ...data,
              tipoOriginal: "extra",
              tipo: data.tipo || "otro",
              estado: data.estado || "pendiente",
              color: "purple",
              empleado: data.empleadoNombre || "Pendiente de asignar",
              horaInicio: "00:00",
              horaFin: "00:00",
              direccion: data.direccion || user.direccion || "",
              fechaCreacion: data.fechaCreacion || Timestamp.now(),
            },
          };
        });
        updateCombinedEvents();
      }, (error) => {
        console.error("Error watching extras:", error);
      });
    } catch (error) {
      console.error("Error setup listeners:", error);
      setLoading(false);
    }

    return () => {
      if (unsubscribeTrabajos) unsubscribeTrabajos();
      if (unsubscribeExtras) unsubscribeExtras();
    };
  }, [user]);

  const handleSelectEvent = (event: CalendarEvent<ClientEventResource>) => {
    setSelectedEvent(event);
  };

  const handleExportCalendar = async () => {
    // Generic error handling
    // Cast needed because export function expects strict Trabajo type but we have extended resource
    await exportCalendarToICS(
      events as unknown as CalendarEvent<Trabajo>[],
      "mis-servicios-jbarranco",
    );
  };

  const handleAddToGoogle = () => {
    if (selectedEvent) {
      addToGoogleCalendar(selectedEvent);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "completado" || status === "realizado") {
      return "bg-green-100 text-green-800";
    }
    if (status === "pendiente" || status === "pendiente_presupuesto") {
      return "bg-orange-100 text-orange-800";
    }
    return "bg-blue-100 text-blue-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-brand-blue text-xl animate-pulse">
          Cargando calendario...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CalendarIcon className="h-8 w-8 text-brand-blue mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mi Calendario</h1>
            <p className="text-sm text-gray-600">
              Visualiza tus servicios programados
            </p>
          </div>
        </div>

        {/* Botones de exportación */}
        <div className="flex space-x-3">
          <button
            onClick={handleExportCalendar}
            className="flex items-center px-4 py-2 text-sm text-white bg-brand-blue rounded-lg hover:bg-blue-700 transition"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Descargar .ics
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Servicios</p>
          <p className="text-2xl font-bold text-brand-blue">{events.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Completados</p>
          <p className="text-2xl font-bold text-brand-green">
            {events.filter((e) => e.resource?.estado === "completado").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Pendientes</p>
          <p className="text-2xl font-bold text-brand-orange">
            {events.filter((e) => e.resource?.estado === "pendiente").length}
          </p>
        </div>
      </div>

      {/* Calendario */}
      <CalendarView<ClientEventResource>
        events={events}
        onSelectEvent={(event) =>
          handleSelectEvent(event as CalendarEvent<ClientEventResource>)}
        defaultView="month"
      />

      {/* Modal de detalles del evento seleccionado */}
      {selectedEvent?.resource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3
              className={`text-xl font-bold mb-4 ${
                selectedEvent.resource.tipoOriginal === "extra"
                  ? "text-purple-600"
                  : "text-brand-blue"
              }`}
            >
              {selectedEvent.resource.tipoOriginal === "extra"
                ? "Detalle de Extra"
                : "Detalles del Servicio"}
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Descripción / Concepto</p>
                <p className="font-medium">{selectedEvent.title}</p>
                {selectedEvent.resource.observaciones && (
                  <p className="text-sm text-gray-500 mt-1">
                    "{selectedEvent.resource.observaciones}"
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-600">Fecha y Hora</p>
                <p className="font-medium">
                  {selectedEvent.start.toLocaleString("es-ES", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              {/* Mostrar precio si es extra y está presupuestado */}
              {selectedEvent.resource.tipoOriginal === "extra" &&
                selectedEvent.resource?.precio && (
                <div>
                  <p className="text-sm text-gray-600">Presupuesto</p>
                  <p className="font-medium text-green-600">
                    {selectedEvent.resource.precio} €
                  </p>
                </div>
              )}

              {selectedEvent.resource.empleado && (
                <div>
                  <p className="text-sm text-gray-600">Empleado Asignado</p>
                  <p className="font-medium">
                    {selectedEvent.resource.empleado}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    getStatusBadge(selectedEvent.resource.estado)
                  }`}
                >
                  {selectedEvent.resource.estado.replace("_", " ")}
                </span>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={handleAddToGoogle}
                className={`flex-1 px-4 py-2 text-sm text-white rounded hover:opacity-90 transition ${
                  selectedEvent.resource.tipoOriginal === "extra"
                    ? "bg-purple-600"
                    : "bg-brand-green"
                }`}
              >
                Añadir a Google Calendar
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="flex-1 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientCalendar;
