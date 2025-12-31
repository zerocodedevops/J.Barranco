import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import {
  checkDuplicates,
  createEmployee,
  updateEmployee,
} from "./employeeActions";
import {
  EmployeeFormInputs,
  employeeSchema,
} from "../../../schemas/employeeSchema";
import toast from "react-hot-toast";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db } from "../../../firebase/config";

function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = !!id && id !== "new";

  const { register, handleSubmit, reset, formState: { errors } } = useForm<
    EmployeeFormInputs
  >({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(employeeSchema) as any,
    defaultValues: {
      nombre: "",
      apellidos: "",
      dni: "",
      telefono: "",
      email: "",
      password: "",
      idUsuario: "",
      fechaContratacion: "",
      especialidad: "",
      costeHora: 0,
      activo: true,
      horasMensuales: 160,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any, // Cast to avoid TS strict mismatch with optional/undefined fields
  });

  // Cargar datos del empleado si estamos editando
  useEffect(() => {
    const loadEmployee = async () => {
      if (isEditing) {
        setLoading(true);
        try {
          const docRef = doc(db, "empleados", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            reset({
              nombre: data.nombre || "",
              apellidos: data.apellidos || "",
              dni: data.dni || "",
              telefono: data.telefono || "",
              email: data.email || "",
              password: "", // No cargamos la contraseña
              idUsuario: data.idUsuario || "",
              fechaContratacion: data.fechaContratacion || data.fechaIngreso ||
                "", // Fallback for old data
              especialidad: data.especialidad || "",
              costeHora: data.costeHora || 0,
              horasMensuales: data.horasMensuales || 160,
            });
          } else {
            toast.error("Empleado no encontrado");
            navigate("/admin/employees");
          }
        } catch (error) {
          console.error("Error loading employee:", error);
          toast.error("Error al cargar los datos del empleado");
        } finally {
          setLoading(false);
        }
      }
    };

    loadEmployee();
  }, [id, isEditing, navigate, reset]);

  const onSubmitHandler: SubmitHandler<EmployeeFormInputs> = async (data) => {
    setIsSaving(true);
    try {
      // 1. Verificar duplicados
      const { duplicateDni, duplicatePhone } = await checkDuplicates(
        data.dni,
        data.telefono,
        isEditing ? id : undefined,
      );

      if (duplicateDni) {
        toast.error(`El DNI ${data.dni} ya está registrado.`);
        setIsSaving(false);
        return;
      }
      if (duplicatePhone) {
        toast.error(`El teléfono ${data.telefono} ya está registrado.`);
        setIsSaving(false);
        return;
      }

      // 2. Guardar
      if (isEditing) {
        if (!id) throw new Error("ID no válido para edición");
        await updateEmployee(id, data);
        toast.success("Empleado actualizado correctamente");
      } else {
        const { authCreated } = await createEmployee(data);
        toast.success(
          authCreated
            ? "Empleado creado con acceso Web"
            : "Empleado creado correctamente",
        );
      }

      navigate("/admin/employees");
    } catch (error) {
      console.error("Error saving employee:", error);
      toast.error("Error al guardar el empleado");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue">
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate("/admin/employees")}
        className="text-brand-blue hover:underline mb-4 flex items-center gap-2"
      >
        <span>←</span> Volver al Listado
      </button>

      <h2 className="text-2xl font-bold text-gray-900">
        {isEditing ? "Editar Empleado" : "Añadir Nuevo Empleado"}
      </h2>

      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="mt-6 space-y-4 bg-white p-6 rounded-lg shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre *
            </label>
            <input
              id="nombre"
              type="text"
              {...register("nombre")}
              className={`mt-1 block w-full p-2 border rounded-md focus:ring-brand-blue focus:border-brand-blue ${
                errors.nombre ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.nombre && (
              <p className="text-red-500 text-xs mt-1">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="apellidos"
              className="block text-sm font-medium text-gray-700"
            >
              Apellidos *
            </label>
            <input
              id="apellidos"
              type="text"
              {...register("apellidos")}
              className={`mt-1 block w-full p-2 border rounded-md focus:ring-brand-blue focus:border-brand-blue ${
                errors.apellidos ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.apellidos && (
              <p className="text-red-500 text-xs mt-1">
                {errors.apellidos.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="dni"
              className="block text-sm font-medium text-gray-700"
            >
              DNI / NIE *
            </label>
            <input
              id="dni"
              type="text"
              {...register("dni")}
              placeholder="12345678A"
              className={`mt-1 block w-full p-2 border rounded-md focus:ring-brand-blue focus:border-brand-blue ${
                errors.dni ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.dni && (
              <p className="text-red-500 text-xs mt-1">{errors.dni.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="telefono"
              className="block text-sm font-medium text-gray-700"
            >
              Teléfono *
            </label>
            <input
              id="telefono"
              type="tel"
              {...register("telefono")}
              className={`mt-1 block w-full p-2 border rounded-md focus:ring-brand-blue focus:border-brand-blue ${
                errors.telefono ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.telefono && (
              <p className="text-red-500 text-xs mt-1">
                {errors.telefono.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email *
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`mt-1 block w-full p-2 border rounded-md focus:ring-brand-blue focus:border-brand-blue ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2 bg-blue-50 p-4 rounded-md border border-blue-200">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-blue-800"
            >
              Contraseña Provisional (Para acceso Web)
            </label>
            <p className="text-xs text-blue-600 mb-2">
              Si escribes una contraseña, se creará automáticamente el usuario
              en Firebase Auth y se vinculará. El empleado podrá cambiarla
              después. Mínimo 6 caracteres.
            </p>
            <input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Ej: jbarranco2025"
              className={`mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm ${
                errors.password ? "border-red-500" : "border-blue-300"
              }`}
              disabled={isEditing}
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2 bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <label
              htmlFor="idUsuario"
              className="block text-sm font-medium text-yellow-800"
            >
              ID de Usuario (Auth UID) - Avanzado
            </label>
            <p className="text-xs text-yellow-600 mb-2">
              Usar SOLO si el usuario ya existe y conoces su UID. Si rellenas
              esto, la contraseña de arriba se ignorará.
            </p>
            <input
              id="idUsuario"
              type="text"
              {...register("idUsuario")}
              placeholder="Ej: Upl9281rOKMs9l1sYdD5bHL3HE33"
              className="mt-1 block w-full p-2 border border-yellow-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 font-mono text-sm"
              disabled={isEditing}
            />
          </div>

          <div>
            <label
              htmlFor="fechaContratacion"
              className="block text-sm font-medium text-gray-700"
            >
              Fecha de Contratación *
            </label>
            <input
              id="fechaContratacion"
              type="date"
              {...register("fechaContratacion")}
              className={`mt-1 block w-full p-2 border rounded-md focus:ring-brand-blue focus:border-brand-blue ${
                errors.fechaContratacion ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.fechaContratacion && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fechaContratacion.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="costeHora"
                className="block text-sm font-medium text-gray-700"
              >
                Coste Hora (€)
              </label>
              <input
                id="costeHora"
                type="number"
                step="0.01"
                {...register("costeHora", { valueAsNumber: true })}
                className={`mt-1 block w-full p-2 border rounded-md focus:ring-brand-blue focus:border-brand-blue ${
                  errors.costeHora ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.costeHora && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.costeHora.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="horasMensuales"
                className="block text-sm font-medium text-gray-700"
              >
                Horas Mensuales Contrato
              </label>
              <input
                id="horasMensuales"
                type="number"
                step="0.5"
                {...register("horasMensuales", { valueAsNumber: true })}
                className={`mt-1 block w-full p-2 border rounded-md focus:ring-brand-blue focus:border-brand-blue ${
                  errors.horasMensuales ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.horasMensuales && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.horasMensuales.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate("/admin/employees")}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {(() => {
              if (isSaving) return "Guardando...";
              return isEditing ? "Guardar Cambios" : "Crear Empleado";
            })()}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeDetail;
