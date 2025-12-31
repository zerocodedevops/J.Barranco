import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  updatePassword,
} from "firebase/auth";
import { auth } from "../../firebase/config";
import toast from "react-hot-toast";
import { seedDatabase } from "../../utils/seeder";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const passwordSchema = z.object({
  current: z.string().min(1, "La contraseña actual es requerida"),
  new: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirm: z.string().min(1, "Confirma la contraseña"),
}).refine((data) => data.new === data.confirm, {
  message: "Las contraseñas no coinciden",
  path: ["confirm"],
});

type PasswordFormInputs = z.infer<typeof passwordSchema>;

function ProfileSettings() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormInputs>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormInputs) => {
    try {
      const user = auth.currentUser;

      if (!user || !user.email) {
        toast.error("No hay usuario autenticado o sin email");
        return;
      }

      // Re-autenticar
      const credential = EmailAuthProvider.credential(
        user.email,
        data.current,
      );
      await reauthenticateWithCredential(user, credential);

      // Actualizar contraseña en Firebase
      await updatePassword(user, data.new);

      toast.success("✅ Contraseña actualizada correctamente");
      reset();
    } catch (error: unknown) {
      console.error("Error updating password:", error);
      const e = error as { code?: string; message?: string };

      if (e.code === "auth/requires-recent-login") {
        toast.error(
          "Por seguridad, cierra sesión y vuelve a entrar antes de cambiar la contraseña",
        );
      } else if (e.code === "auth/wrong-password") {
        toast.error("La contraseña actual es incorrecta");
      } else {
        toast.error("Error al actualizar la contraseña");
      }
    }
  };

  const handleResetPassword = async () => {
    const user = auth.currentUser;
    if (!user || !user.email) {
      toast.error(
        "No se puede enviar el correo porque no hay email registrado.",
      );
      return;
    }

    const confirmSend = window.confirm(
      `¿Quieres enviar un correo de restablecimiento de contraseña a ${user.email}?`,
    );
    if (!confirmSend) return;

    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success(
        "Correo de restablecimiento enviado. Revisa tu bandeja de entrada.",
      );
    } catch (error: unknown) {
      console.error("Error sending reset email:", error);
      toast.error("Error al enviar el correo: " + (error as Error).message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Configuración de Perfil
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Cambiar Contraseña
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="current"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  id="current"
                  {...register("current")}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.current ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.current && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.current.message}
                  </p>
                )}
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="text-xs text-brand-blue hover:text-blue-500 font-medium"
                  >
                    He olvidado mi contraseña actual
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="new"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  id="new"
                  {...register("new")}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.new ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.new && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.new.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirm"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  id="confirm"
                  {...register("confirm")}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.confirm ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Repite la nueva contraseña"
                />
                {errors.confirm && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirm.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Actualizando..." : "Actualizar Contraseña"}
            </button>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Nota importante:</strong>{" "}
                  Si hace mucho tiempo que iniciaste sesión, es posible que te
                  pida volver a autenticarte por seguridad.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Zona Avanzada */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6 border-t-4 border-red-500">
        <h3 className="text-lg font-bold text-red-600 mb-4">Zona de Peligro</h3>
        <p className="text-sm text-gray-600 mb-4">
          Acciones irreversibles para administración del sistema.
        </p>

        <button
          onClick={async () => {
            if (
              window.confirm(
                "¿Estás SEGURO de que quieres reiniciar los contadores de facturas y presupuestos a 0? Esto no se puede deshacer.",
              )
            ) {
              try {
                const { resetCounters } = await import(
                  "../../services/counterService"
                );
                await resetCounters();
                toast.success("Contadores reiniciados a 00000");
              } catch (e) {
                console.error(e);
                toast.error("Error al reiniciar contadores");
              }
            }
          }}
          className="w-full border border-red-500 text-red-500 py-2 px-4 rounded-md hover:bg-red-50 transition-colors font-medium mb-4"
        >
          ⚠️ Reiniciar Contadores de Documentos (00000)
        </button>

        <button
          onClick={async () => {
            if (
              window.confirm(
                "¿Seguro? Esto creará 10 clientes y docenas de trabajos para la semana del 15dic.",
              )
            ) {
              await seedDatabase();
              toast.success("¡Datos generados!");
            }
          }}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md shadow-sm transition-colors font-medium"
        >
          🌱 Generar Datos Demo (Semana 15 Dic)
        </button>
        <button
          onClick={async () => {
            if (
              window.confirm(
                "¿Seguro? Esto asignará TODOS los trabajos existentes al empleado demo (Upl...).",
              )
            ) {
              try {
                const { assignAllTasksToEmployee } = await import(
                  "../../utils/adminTools"
                );
                const count = await assignAllTasksToEmployee(
                  "Upl9281rOKMs9l1sYdD5bHL3HE33",
                  "Empleado Demo",
                );
                toast.success(`¡${count} trabajos asignados!`);
              } catch {
                toast.error("Error al asignar");
              }
            }
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm transition-colors font-medium mt-4"
        >
          👤 Asignar TODO a Empleado Demo (Upl...)
        </button>
      </div>
    </div>
  );
}

export default ProfileSettings;
