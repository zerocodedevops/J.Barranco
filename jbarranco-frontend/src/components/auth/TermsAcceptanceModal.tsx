import { useState } from "react";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function TermsAcceptanceModal() {
    const { user, userRole } = useAuth();
    const [accepted, setAccepted] = useState(false);
    const [loading, setLoading] = useState(false);

    // Generic error handling
    const usuario = user;
    if (!usuario || usuario.terminosAceptados === true) return null;

    if (usuario.terminosAceptados && usuario.fechaAceptacionTerminos) {
        const val = usuario.fechaAceptacionTerminos;
        // Check if it has toDate method (Firestore Timestamp)
        const fecha = typeof val === "object" && "toDate" in val
            ? val.toDate()
            : val;

        return (
            <div className="p-4 bg-gray-50 border rounded-lg text-sm text-gray-600 mb-4">
                Términos aceptados el {fecha.toLocaleDateString()}
            </div>
        );
    }
    const handleAccept = async () => {
        if (!accepted) return;
        setLoading(true);
        try {
            const userId = usuario.uid;
            await updateDoc(doc(db, "usuarios", userId), {
                terminosAceptados: true,
                fechaAceptacionTerminos: Timestamp.now(),
            });

            globalThis.location.reload();
        } catch (error) {
            console.error("Error aceptando términos:", error);
            toast.error("Error al guardar la aceptación. Inténtalo de nuevo.");
            setLoading(false);
        }
    };

    const getRoleLabel = () => {
        if (userRole === "admin") return "Administrador";
        if (userRole === "empleado") return "Empleado";
        return "Cliente";
    };

    return (
        <div className="fixed inset-0 z-[100] bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
                {/* Header */}
                <div className="bg-brand-blue px-6 py-4">
                    <h2 className="text-xl font-bold text-white text-center">
                        Bienvenido a J.Barranco
                    </h2>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-gray-600 text-sm text-center">
                        Para continuar accediendo a tu panel de{" "}
                        {getRoleLabel()}, necesitamos que leas y aceptes
                        nuestras políticas de privacidad y condiciones de uso.
                    </p>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 space-y-2">
                        <p>
                            En cumplimiento del <strong>RGPD</strong> y la{" "}
                            <strong>LOPDGDD</strong>, te informamos que tus
                            datos serán tratados por{" "}
                            <strong>J.Barranco Limpieza</strong>{" "}
                            para la gestión del servicio contratado y la
                            relación laboral/comercial.
                        </p>
                        <div className="flex flex-col gap-1 mt-2">
                            <Link
                                to="/privacy-policy"
                                target="_blank"
                                className="text-brand-blue hover:underline font-medium flex items-center"
                            >
                                📄 Leer Política de Privacidad
                            </Link>
                            <Link
                                to="/legal-notice"
                                target="_blank"
                                className="text-brand-blue hover:underline font-medium flex items-center"
                            >
                                ⚖️ Leer Aviso Legal
                            </Link>
                        </div>
                    </div>

                    <label className="flex items-start gap-3 p-2 cursor-pointer hover:bg-gray-50 rounded transition-colors group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={accepted}
                                onChange={(e) => setAccepted(e.target.checked)}
                                className="h-5 w-5 text-brand-blue border-gray-300 rounded focus:ring-brand-blue mt-0.5 cursor-pointer"
                            />
                        </div>
                        <span className="text-sm text-gray-700 select-none group-hover:text-gray-900">
                            He leído y acepto la{" "}
                            <strong>Política de Privacidad</strong> y el{" "}
                            <strong>Aviso Legal</strong>, y consiento el
                            tratamiento de mis datos personales.
                        </span>
                    </label>

                    <button
                        onClick={handleAccept}
                        disabled={!accepted || loading}
                        className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-md transition-all
                    ${
                            accepted && !loading
                                ? "bg-brand-blue hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
                                : "bg-gray-300 cursor-not-allowed"
                        }`}
                    >
                        {loading
                            ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        >
                                        </circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        >
                                        </path>
                                    </svg>
                                    Guardando...
                                </span>
                            )
                            : "Continuar al Panel"}
                    </button>
                </div>
            </div>
        </div>
    );
}
