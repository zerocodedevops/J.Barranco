import { useCallback, useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { Rating } from "../../../types/rating";
import RatingStars from "../../common/RatingStars";
import LoadingSpinner from "../../common/LoadingSpinner";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface EmployeeRatingData {
  employeeId: string;
  employeeName: string;
  avgStars: number;
  totalRatings: number;
}

export default function RatingsStats() {
  const [allRatings, setAllRatings] = useState<Rating[]>([]);
  const [employeeStats, setEmployeeStats] = useState<EmployeeRatingData[]>([]);
  const [loading, setLoading] = useState(true);

  // Definir calculateEmployeeStats antes de usarlo en loadAllRatings o dentro de loadAllRatings
  const calculateEmployeeStats = useCallback((ratings: Rating[]) => {
    const employeeMap = new Map<
      string,
      { total: number; count: number; name: string }
    >();

    ratings.forEach((rating) => {
      const existing = employeeMap.get(rating.employeeId) || {
        total: 0,
        count: 0,
        name: rating.employeeName,
      };

      employeeMap.set(rating.employeeId, {
        total: existing.total + rating.stars,
        count: existing.count + 1,
        name: existing.name,
      });
    });

    const stats: EmployeeRatingData[] = Array.from(employeeMap.entries()).map(
      ([employeeId, data]) => ({
        employeeId,
        employeeName: data.name,
        avgStars: data.total / data.count,
        totalRatings: data.count,
      }),
    );

    // Sort by average stars descending
    stats.sort((a, b) => b.avgStars - a.avgStars);
    setEmployeeStats(stats);
  }, []);

  const loadAllRatings = useCallback(async () => {
    setLoading(true);
    try {
      const ratingsRef = collection(db, "ratings");
      const q = query(ratingsRef, orderBy("createdAt", "desc"), limit(100));
      const snapshot = await getDocs(q);

      const ratings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Rating[];

      setAllRatings(ratings);
      calculateEmployeeStats(ratings);
    } catch (error) {
      console.error("Error loading ratings:", error);
    } finally {
      setLoading(false);
    }
  }, [calculateEmployeeStats]);

  useEffect(() => {
    loadAllRatings();
  }, [loadAllRatings]);

  const lowRatedEmployees = employeeStats.filter((e) => e.avgStars < 3);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Estadísticas de Valoraciones
      </h1>

      {/* Alerts for low ratings */}
      {lowRatedEmployees.length > 0 && (
        <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">Atención:</span>{" "}
                {lowRatedEmployees.length}{" "}
                empleado{lowRatedEmployees.length > 1 ? "s" : ""}{" "}
                con valoración baja ( &lt;3 estrellas)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Employee Stats */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Ranking de Empleados por Valoración
          </h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {employeeStats.length === 0
            ? (
              <p className="text-gray-500 text-center">
                No hay valoraciones aún
              </p>
            )
            : (
              <div className="space-y-4">
                {employeeStats.map((employee, index) => (
                  <div
                    key={employee.employeeId}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      employee.avgStars < 3 ? "bg-red-50" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-gray-400">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">
                          {employee.employeeName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {employee.totalRatings} valoración
                          {employee.totalRatings > 1 ? "es" : ""}
                        </p>
                      </div>
                    </div>
                    <RatingStars rating={employee.avgStars} size="lg" />
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* Recent Ratings */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Últimas Valoraciones
          </h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            {allRatings.slice(0, 10).map((rating) => (
              <div
                key={rating.id}
                className="border-b border-gray-200 pb-4 last:border-b-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      {rating.employeeName}
                    </p>
                    <p className="text-sm text-gray-500">
                      por {rating.clientName} •{" "}
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <RatingStars rating={rating.stars} size="md" />
                </div>
                {rating.comment && (
                  <p className="text-sm text-gray-700 italic mt-2">
                    "{rating.comment}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
