import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import RatingStars from "../common/RatingStars";
import { useRatings } from "../../hooks/useRatings";
import { useAuth } from "../../context/AuthContext";

type RatingValue = 1 | 2 | 3 | 4 | 5;

interface RateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  employeeName: string;
  jobId: string;
}

export default function RateEmployeeModal({
  isOpen,
  onClose,
  employeeId,
  employeeName,
  jobId,
}: RateEmployeeModalProps) {
  const { user } = useAuth();
  const { createRating, loading } = useRatings();

  const [puntualidad, setPuntualidad] = useState(0);
  const [calidad, setCalidad] = useState(0);
  const [trato, setTrato] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!puntualidad || !calidad || !trato) {
      alert("Por favor, valora todas las categorías");
      return;
    }

    const averageStars = Math.round((puntualidad + calidad + trato) / 3);

    const success = await createRating({
      clientId: user?.uid || "",
      clientName: user?.displayName || "Cliente",
      employeeId,
      employeeName,
      jobId,
      stars: averageStars as RatingValue,
      categories: {
        puntualidad: puntualidad as RatingValue,
        calidad: calidad as RatingValue,
        trato: trato as RatingValue,
      },
      comment: comment.trim(),
    });

    if (success) {
      // Reset form
      setPuntualidad(0);
      setCalidad(0);
      setTrato(0);
      setComment("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onClose();
            }
          }}
        />

        {/* Modal */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Valorar servicio
              </h3>
              <button
                onClick={onClose}
                className="rounded-md text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Valora el trabajo de{" "}
              <span className="font-semibold">{employeeName}</span>
            </p>

            <form onSubmit={handleSubmit}>
              {/* Puntualidad */}
              <div className="mb-6">
                <RatingStars
                  rating={puntualidad}
                  size="lg"
                  interactive
                  onChange={setPuntualidad}
                  label="Puntualidad"
                />
              </div>

              {/* Calidad */}
              <div className="mb-6">
                <RatingStars
                  rating={calidad}
                  size="lg"
                  interactive
                  onChange={setCalidad}
                  label="Calidad del trabajo"
                />
              </div>

              {/* Trato */}
              <div className="mb-6">
                <RatingStars
                  rating={trato}
                  size="lg"
                  interactive
                  onChange={setTrato}
                  label="Trato profesional"
                />
              </div>

              {/* Comentario */}
              <div className="mb-6">
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Comentario (opcional)
                </label>
                <textarea
                  id="comment"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="¿Algún comentario sobre el servicio?"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Enviando..." : "Enviar valoración"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
