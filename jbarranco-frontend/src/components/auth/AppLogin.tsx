import { useEffect, useState } from "react";
import { auth } from "../../firebase/config";
import {
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDashboardRoute } from "../../utils/navigation";

function AppLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    const navigate = useNavigate();
    const { user, userRole } = useAuth();

    useEffect(() => {
        if (user && userRole) {
            navigate(getDashboardRoute(userRole), { replace: true });
        }
    }, [user, userRole, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError("Usuario o contraseña incorrectos.");
            console.error(err);
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error(error);
            setError("No se pudo iniciar sesión con Google.");
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError("Indica tu email para continuar.");
            return;
        }
        setLoading(true);
        setError("");

        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Enlace enviado. Revisa tu correo.");
            setIsResetting(false);
        } catch (err: unknown) {
            console.error(err);
            if ((err as { code?: string }).code === "auth/user-not-found") {
                setError("Email no registrado.");
            } else {
                setError("Error al enviar. Inténtalo tarde.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <img
                    src="/logo-light.png"
                    alt="J.Barranco Logo"
                    className="h-20 w-auto mx-auto mb-4"
                />
                <h2 className="text-center text-3xl font-bold brand-blue">
                    {isResetting
                        ? "Recuperar Contraseña"
                        : "Acceso Clientes y Empleados"}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {isResetting
                        ? "Te enviaremos las instrucciones a tu correo."
                        : "Gestiona tus servicios de limpieza y mantenimiento."}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-gray-100">
                    {isResetting
                        ? (
                            // Formulario RESET
                            <form
                                className="space-y-6"
                                onSubmit={handleResetPassword}
                            >
                                {error && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                                        <p className="text-sm text-red-700">
                                            {error}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <label
                                        htmlFor="reset-email"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Email
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="reset-email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                                            placeholder="tu@email.com"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-50 transition-colors"
                                    >
                                        {loading
                                            ? "Enviando..."
                                            : "Enviar enlace"}
                                    </button>
                                </div>
                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsResetting(false);
                                            setError("");
                                        }}
                                        className="text-sm font-medium text-brand-blue hover:text-blue-500"
                                    >
                                        Volver al inicio de sesión
                                    </button>
                                </div>
                            </form>
                        )
                        : (
                            // Formulario LOGIN
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {error && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                                        <div className="flex">
                                            <div className="ml-3">
                                                <p className="text-sm text-red-700">
                                                    {error}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Email
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="username"
                                            required
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Contraseña
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end">
                                    <div className="text-sm">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsResetting(true);
                                                setError("");
                                            }}
                                            className="font-medium text-brand-blue hover:text-blue-500"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-50 transition-colors"
                                >
                                    {loading
                                        ? "Iniciando Sesión..."
                                        : "Iniciar Sesión"}
                                </button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">
                                            O accede con
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                                >
                                    <img
                                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                        alt="Google"
                                        className="w-5 h-5 mr-2"
                                    />
                                    Google
                                </button>
                            </form>
                        )}
                </div>
            </div>
        </div>
    );
}

export default AppLogin;
