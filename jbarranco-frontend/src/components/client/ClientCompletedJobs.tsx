import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRatings } from "../../hooks/useRatings";
import RateEmployeeModal from "./RateEmployeeModal";
import { Rating, Trabajo } from "../../types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CheckCircleIcon,
  MapPinIcon,
  StarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../common/LoadingSpinner";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { COLLECTIONS } from "../../constants";
import toast from "react-hot-toast";

export default function ClientCompletedJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Trabajo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Trabajo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { getClientRatings } = useRatings();
  const [clientRatings, setClientRatings] = useState<Rating[]>([]);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Cargar ratings del cliente
        const ratingsData = await getClientRatings(user.uid);
        setClientRatings(ratingsData);

        // Cargar trabajos completados
        const q = query(
          collection(db, COLLECTIONS.TRABAJOS),
          where("clienteId", "==", user.uid),
          where("estado", "==", "completado"),
          orderBy("fecha", "desc"),
        );

        const snapshot = await getDocs(q);
        const jobsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Trabajo[];

        setJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Error al cargar historial de trabajos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.uid, getClientRatings]);

  const handleRate = (job: Trabajo) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const isRated = (jobId: string) => {
    return clientRatings.some((r) => r.jobId === jobId); // Error corregido aquí
  };

  const handleGenerateTestData = async () => {
    if (!user?.uid) return;
    try {
      await addDoc(collection(db, COLLECTIONS.TRABAJOS), {
        clienteId: user.uid,
        empleadoId: "emp_demo",
        empleadoNombre: "Juan Pérez (Demo)",
        tipo: "mantenimiento",
        descripcion: "Mantenimiento mensual - Generado por Test",
        estado: "completado",
        fecha: Timestamp.now(),
        direccion: "Oficina Principal",
        comentariosCliente: "",
      });
      toast.success("Trabajo de prueba generado");
    } catch (error) {
      console.error("Error generando datos:", error);
      toast.error("Error al generar datos");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
          Mis Trabajos Completados
        </h1>
        <button
          onClick={handleGenerateTestData}
          className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded border border-gray-300"
        >
          🛠️ Generar Datos Test
        </button>
      </div>

      {jobs.length === 0
        ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No hay trabajos completados
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Los trabajos finalizados por nuestro equipo aparecerán aquí para
              tu valoración.
            </p>
            <button
              onClick={handleGenerateTestData}
              className="mt-4 text-sm text-brand-blue hover:underline"
            >
              (Debug: Crear uno ahora)
            </button>
          </div>
        )
        : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wide text-green-700 bg-green-50 px-2 py-1 rounded-full w-fit mb-2">
                      Completado
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPinIcon className="h-4 w-4" />
                      {job.fecha
                        ? format(job.fecha.toDate(), "PPP", { locale: es })
                        : "Fecha desconocida"}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {job.tipo.charAt(0).toUpperCase() + job.tipo.slice(1)}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 bg-gray-50 p-2 rounded-md">
                    {job.descripcion || "Sin descripción"}
                  </p>
                </div>

                <div className="flex items-center gap-3 mb-6 p-3 border border-gray-100 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                    <UserIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {job.empleadoNombre || "Empleado Asignado"}
                    </p>
                    <p className="text-xs text-gray-500">Realizado por</p>
                  </div>
                </div>

                {isRated(job.id)
                  ? (
                    <div className="text-center p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-semibold border border-yellow-100 flex items-center justify-center gap-2">
                      <StarIcon className="h-5 w-5 text-yellow-500" />
                      Valorado
                    </div>
                  )
                  : (
                    <button
                      onClick={() => handleRate(job)}
                      className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors"
                    >
                      <StarIcon className="h-5 w-5" />
                      Valorar Servicio
                    </button>
                  )}
              </div>
            ))}
          </div>
        )}

      {selectedJob && (
        <RateEmployeeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          employeeId={selectedJob.empleadoId || ""}
          employeeName={selectedJob.empleadoNombre || "Empleado"}
          jobId={selectedJob.id}
        />
      )}
    </div>
  );
}
