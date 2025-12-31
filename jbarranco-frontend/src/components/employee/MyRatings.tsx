import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRatings } from "../../hooks/useRatings";
import { Rating } from "../../types/rating";
import RatingStars from "../common/RatingStars";
import LoadingSpinner from "../common/LoadingSpinner";

export default function MyRatings() {
  const { user } = useAuth();
  const { getEmployeeRatings, getEmployeeStats } = useRatings();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageStars, setAverageStars] = useState(0);
  const [averageCategories, setAverageCategories] = useState({
    puntualidad: 0,
    calidad: 0,
    trato: 0,
  });

  useEffect(() => {
    const loadRatings = async () => {
      if (!user?.uid) return;

      setLoading(true);
      try {
        const [employeeRatings, stats] = await Promise.all([
          getEmployeeRatings(user.uid),
          getEmployeeStats(user.uid),
        ]);

        setRatings(employeeRatings);
        if (stats) {
          setAverageStars(stats.averageStars);
          setAverageCategories(stats.averageCategories);
        }
      } catch (error) {
        console.error("Error loading ratings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRatings();
  }, [user, getEmployeeRatings, getEmployeeStats]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Mis Valoraciones
      </h1>

      {ratings.length === 0
        ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">Aún no has recibido valoraciones</p>
          </div>
        )
        : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-500 mb-2">Promedio General</p>
                <RatingStars rating={averageStars} size="lg" />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-500 mb-2">Puntualidad</p>
                <RatingStars rating={averageCategories.puntualidad} size="md" />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-500 mb-2">Calidad</p>
                <RatingStars rating={averageCategories.calidad} size="md" />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-500 mb-2">Trato</p>
                <RatingStars rating={averageCategories.trato} size="md" />
              </div>
            </div>

            {/* Ratings List */}
            <div className="space-y-4">
              {ratings.map((rating) => (
                <div key={rating.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {rating.clientName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(rating.createdAt).toLocaleDateString(
                          "es-ES",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    <RatingStars rating={rating.stars} size="md" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Puntualidad</p>
                      <RatingStars
                        rating={rating.categories.puntualidad}
                        size="sm"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Calidad</p>
                      <RatingStars
                        rating={rating.categories.calidad}
                        size="sm"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Trato</p>
                      <RatingStars rating={rating.categories.trato} size="sm" />
                    </div>
                  </div>

                  {rating.comment && (
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-700 italic">
                        "{rating.comment}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
    </div>
  );
}
