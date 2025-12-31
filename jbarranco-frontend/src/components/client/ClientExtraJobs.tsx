import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { COLLECTIONS } from "../../constants";
import { useRatings } from "../../hooks/useRatings";
import { RequestExtraJobModal } from "./components/RequestExtraJobModal";
import { MapPinIcon, StarIcon, UserIcon } from "@heroicons/react/24/outline";
import RateEmployeeModal from "./RateEmployeeModal";
import RatingStars from "../common/RatingStars";
import LoadingSpinner from "../common/LoadingSpinner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import toast from "react-hot-toast";
import { supabase } from "../../supabase/client";
import { Extra, Rating } from "../../types";

const BudgetLink = ({ request }: { request: Extra }) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUrl = async () => {
      if (request.budgetPath) {
        const { data } = await supabase.storage.from("budgets").createSignedUrl(
          request.budgetPath,
          3600,
        );
        if (data) setSignedUrl(data.signedUrl);
      } else if (request.budgetUrl) {
        setSignedUrl(request.budgetUrl);
      }
    };
    fetchUrl();
  }, [request]);

  if (!signedUrl || request.estado !== "presupuestado") return null;

  return (
    <a
      href={signedUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-800 text-sm font-medium underline mr-2"
    >
      Ver Presupuesto
    </a>
  );
};

function ClientExtraJobs() {
  const { user } = useAuth();
  const [extraJobs, setExtraJobs] = useState<Extra[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Extra[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Extra | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getClientRatings } = useRatings();
  const [clientRatings, setClientRatings] = useState<Rating[]>([]);

  useEffect(() => {
    if (!user?.uid) return;

    const loadRatings = async () => {
      const data = await getClientRatings(user.uid);
      setClientRatings(data);
    };
    loadRatings();

    // Query for Completed Jobs (History)
    const qHistory = query(
      collection(db, COLLECTIONS.EXTRAS),
      where("clienteId", "==", user.uid),
      where("estado", "==", "completado"),
      orderBy("fecha", "desc"),
    );

    const unsubscribeHistory = onSnapshot(qHistory, (snapshot) => {
      const jobsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Extra[];
      setExtraJobs(jobsData);
      setLoading(false);
    });

    // Query for Pending/Active Requests
    // Note: ensure 'extra_request' has 'createdAt' or we order by something else.
    // Creating composite index might be needed if we order.
    // for now let's just fetch where clienteId == user.uid and filter in memory if the dataset is small?
    // No, better to be specific.
    // Let's assume we want 'extra_request' type specifically or just anything that is NOT completed?
    // Let's try fetching 'estado' == 'pendiente'
    const qPending = query(
      collection(db, COLLECTIONS.EXTRAS),
      where("clienteId", "==", user.uid),
      where("estado", "in", [
        "pendiente",
        "solicitado",
        "presupuestado",
        "presupuesto_aceptado",
      ]),
      // orderBy("createdAt", "desc") // Warning: might need index
    );

    const unsubscribePending = onSnapshot(qPending, (snapshot) => {
      const requests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Extra[];
      setPendingRequests(requests);
    });

    return () => {
      unsubscribeHistory();
      unsubscribePending();
    };
  }, [user?.uid, getClientRatings]);

  const handleRate = (job: Extra) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const getJobRating = (jobId: string) => {
    return clientRatings.find((r) => r.jobId === jobId);
  };

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const handleRequestSubmit = async (
    description: string,
    preferredDate: string,
  ) => {
    if (!user?.uid) return;
    try {
      await addDoc(collection(db, COLLECTIONS.EXTRAS), {
        clienteId: user.uid,
        clienteNombre: user.nombre || "Cliente Web", // Added Name
        // No employee assigned yet
        empleadoId: "",
        empleadoNombre: "",
        tipo: "extra_request", // New type for requests
        descripcion: description,
        fechaSolicitud: Timestamp.now(),
        fechaPreferente: preferredDate
          ? Timestamp.fromDate(new Date(preferredDate))
          : null,
        estado: "pendiente", // Pending approval
        direccion: user.direccion || "Dirección Principal", // Fallback
        comentariosCliente: "",
        createdAt: Timestamp.now(),
        fechaCreacion: Timestamp.now(), // Compatibility
      });
      toast.success("Solicitud enviada correctamente");
      setIsRequestModalOpen(false);
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Error al enviar la solicitud");
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      await toast.promise(
        deleteDoc(doc(db, COLLECTIONS.EXTRAS, requestId)),
        {
          loading: "Cancelando solicitud...",
          success: "Solicitud cancelada",
          error: "Error al cancelar la solicitud",
        },
      );
    } catch (error) {
      console.error("Error cancelling request:", error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Trabajos Extra</h2>
        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium"
        >
          Solicitar Nuevo Trabajo
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900">
          Solicitudes Pendientes
        </h3>
        {pendingRequests.length === 0
          ? (
            <div className="mt-4 bg-white shadow rounded-lg p-6 text-center text-gray-500">
              <p>No tienes solicitudes activas en este momento.</p>
            </div>
          )
          : (
            <div className="mt-4 bg-white shadow rounded-lg">
              <ul className="divide-y divide-gray-200">
                {pendingRequests.map((req) => (
                  <li key={req.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {req.descripcion}
                        </p>
                        <p className="text-sm text-gray-500">
                          Solicitado el {req.createdAt
                            ? format(req.createdAt.toDate(), "dd 'de' MMMM", {
                              locale: es,
                            })
                            : "Fecha desconocida"}
                          {req.fechaPreferente &&
                            ` - Para el: ${
                              format(req.fechaPreferente.toDate(), "dd/MM/yyyy")
                            }`}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {req.estado === "presupuestado" && req.budgetUrl && (
                          <div className="flex items-center gap-2 mr-2">
                            {/* Deprecated Public Link Fallback */}
                            <a
                              href={req.budgetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                            >
                              Ver (Público)
                            </a>
                          </div>
                        )}

                        {/* Budget Link Component to handle signed URLs */}
                        <BudgetLink request={req} />

                        <div className="flex items-center gap-2">
                          {req.estado === "presupuestado" && (
                            <>
                              <button
                                onClick={async () => {
                                  if (
                                    !confirm(
                                      "¿Aceptar presupuesto? El administrador será notificado.",
                                    )
                                  ) return;
                                  try {
                                    await updateDoc(
                                      doc(db, COLLECTIONS.EXTRAS, req.id),
                                      {
                                        estado: "presupuesto_aceptado",
                                      },
                                    );
                                    toast.success("Presupuesto aceptado");
                                  } catch (e) {
                                    console.error(e);
                                    toast.error("Error");
                                  }
                                }}
                                className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold hover:bg-green-200"
                              >
                                Aceptar
                              </button>
                              <button
                                onClick={async () => {
                                  if (!confirm("¿Rechazar presupuesto?")) {
                                    return;
                                  }
                                  try {
                                    await updateDoc(
                                      doc(db, COLLECTIONS.EXTRAS, req.id),
                                      {
                                        estado: "rechazado",
                                      },
                                    );
                                    toast.success("Presupuesto rechazado");
                                  } catch (e) {
                                    console.error(e);
                                    toast.error("Error");
                                  }
                                }}
                                className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold hover:bg-red-200"
                              >
                                Rechazar
                              </button>
                            </>
                          )}
                        </div>

                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            (() => {
                              switch (req.estado) {
                                case "presupuestado":
                                  return "bg-indigo-100 text-indigo-800";
                                case "presupuesto_aceptado":
                                  return "bg-teal-100 text-teal-800";
                                default:
                                  return "bg-yellow-100 text-yellow-800";
                              }
                            })()
                          }`}
                        >
                          {(() => {
                            switch (req.estado) {
                              case "presupuestado":
                                return "Presupuesto Listo";
                              case "presupuesto_aceptado":
                                return "Aceptado";
                              default:
                                return "Pendiente";
                            }
                          })()}
                        </span>

                        {(req.estado === "pendiente" ||
                          req.estado === "solicitado") && (
                          <button
                            onClick={() => handleCancelRequest(req.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium p-1 hover:bg-red-50 rounded"
                            title="Cancelar solicitud"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>

      {/* Historial de Trabajos Extra Dinámico */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Historial de Trabajos Realizados
          </h3>
          {/* Debug Button Hidden or kept small */}
        </div>

        {extraJobs.length === 0
          ? (
            <p className="text-gray-500 text-sm italic">
              No hay trabajos extra completados aún.
            </p>
          )
          : (
            <div className="mt-4 bg-white shadow rounded-lg overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {extraJobs.map((job) => {
                  const rating = getJobRating(job.id);
                  return (
                    <li
                      key={job.id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      {/* ... (existing job item content) ... */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-gray-900">
                            {job.descripcion || "Trabajo Extra"}
                          </h4>
                          <div className="mt-1 text-sm text-gray-500 flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span className="flex items-center">
                              <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                              {job.direccion || "Sin dirección"}
                            </span>
                            <span className="flex items-center">
                              <UserIcon className="h-4 w-4 mr-1 text-gray-400" />
                              {job.empleadoNombre || "Empleado"}
                            </span>
                            <span>
                              {job.fecha
                                ? format(job.fecha.toDate(), "PPP", {
                                  locale: es,
                                })
                                : ""}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completado
                          </span>

                          {rating
                            ? (
                              <div className="flex flex-col items-end sm:items-end">
                                <span className="text-xs text-gray-500 mb-1 font-medium">
                                  Tu valoración:
                                </span>
                                <div className="bg-yellow-50 px-2 py-1 rounded border border-yellow-100">
                                  <RatingStars
                                    rating={rating.stars}
                                    size="sm"
                                  />
                                </div>
                              </div>
                            )
                            : (
                              <button
                                onClick={() => handleRate(job)}
                                className="inline-flex items-center px-4 py-2 border border-brand-blue text-sm font-medium rounded-md text-brand-blue bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                              >
                                <StarIcon className="h-4 w-4 mr-2" />
                                Valorar
                              </button>
                            )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
      </div>

      {selectedJob && (
        <RateEmployeeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          employeeId={selectedJob?.empleadoId || ""}
          employeeName={selectedJob?.empleadoNombre || "Empleado"}
          jobId={selectedJob?.id}
        />
      )}

      <RequestExtraJobModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handleRequestSubmit}
      />
    </div>
  );
}

export default ClientExtraJobs;
