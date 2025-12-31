import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db } from "../../../firebase/config";
import { cleanAutoObservations } from "../../../services/cleanupService";
import { getEmployees } from "../../../firebase/services";
import { Cliente, Empleado } from "../../../types";
import { ClientFormInputs, mapClientToForm } from "./clientHelpers";
import { ClientFormFields } from "./ClientFormFields";
import { useClientSubmit } from "../../../hooks/useClientSubmit";

import { clientSchema } from "../../../schemas/clientSchema";

// Schema definition moved to src/schemas/clientSchema.ts

function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Empleado[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = !!id && id !== "new";
  const { onSubmit } = useClientSubmit(employees);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<
    ClientFormInputs
  >({
    // @ts-expect-error - Type mismatch in RHF/Zod versions but functional
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nombre: "",
      cif: "",
      direccion: "",
      codigoPostal: "",
      ciudad: "",
      nombreContacto: "",
      telefono: "",
      email: "",
      password: "",
      idUsuario: "",
      diasContrato: [],
      empleadoAsignadoId: "",
    },
  });

  // Cargar empleados
  useEffect(() => {
    getEmployees().then(setEmployees).catch(console.error);
  }, []);

  // Cargar datos del cliente si estamos editando
  useEffect(() => {
    const loadClient = async () => {
      if (isEditing) {
        setLoading(true);
        try {
          const docRef = doc(db, "clientes", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as Cliente;
            reset(mapClientToForm(data));
          } else {
            toast.error("Cliente no encontrado");
            navigate("/admin/clients");
          }
        } catch (error) {
          console.error("Error loading client:", error);
          toast.error("Error al cargar los datos del cliente");
        } finally {
          setLoading(false);
        }
      }
    };

    loadClient();
  }, [id, isEditing, navigate, reset]);

  // Debug: Notificar errores de validación si el submit falla
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error("Formulario incompleto: Revisa los campos en rojo");
      console.error("Validation Errors:", errors);
    }
  }, [errors]);

  // AUTO-CLEANUP: Borrar observaciones al entrar (Temporal)
  useEffect(() => {
    cleanAutoObservations().then((count) => {
      if (count > 0) {
        toast.success(`Limpieza Completada: ${count} observaciones borradas.`);
      }
    });
  }, []);

  const onSubmitHandler: SubmitHandler<ClientFormInputs> = async (data) => {
    setIsSaving(true);
    await onSubmit(data, id);
    setIsSaving(false);
  };

  const handleCancel = () => navigate("/admin/clients");
  const noOp = () => undefined; // Helper for empty functions if strictly needed

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
        onClick={handleCancel}
        className="text-brand-blue hover:underline mb-4 flex items-center gap-2"
      >
        <span>←</span> Volver al Listado
      </button>

      <h2 className="text-2xl font-bold text-gray-900">
        {isEditing ? "Editar Cliente" : "Añadir Nuevo Cliente"}
      </h2>

      <form
        onSubmit={handleSubmit((data) =>
          onSubmitHandler(data as unknown as ClientFormInputs)
        )}
      >
        <ClientFormFields
          register={register}
          errors={errors}
          employees={employees}
          isEditing={isEditing}
          isSaving={isSaving}
          onCancel={handleCancel}
          onSubmit={noOp}
        />
      </form>
    </div>
  );
}

export default ClientDetail;
