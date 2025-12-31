import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Empleado } from "../../../types";
import { ClientFormInputs } from "./clientHelpers";

interface ClientFormFieldsProps {
    register: UseFormRegister<ClientFormInputs>;
    errors: FieldErrors<ClientFormInputs>;
    employees: Empleado[];
    isEditing: boolean;
    isSaving: boolean;
    onCancel: () => void;
    onSubmit: () => void; // Passed via handleSubmit in parent
}

export const ClientFormFields = ({
    register,
    errors,
    employees,
    isEditing,
    isSaving,
    onCancel,
}: ClientFormFieldsProps) => {
    const getSubmitButtonText = () => {
        if (isSaving) return "Guardando...";
        if (isEditing) return "Guardar Cambios";
        return "Crear Cliente";
    };

    return (
        <div className="mt-6 space-y-4 bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label
                        htmlFor="nombre"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Nombre de la Comunidad *
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
                        htmlFor="cif"
                        className="block text-sm font-medium text-gray-700"
                    >
                        CIF *
                    </label>
                    <input
                        id="cif"
                        type="text"
                        {...register("cif")}
                        className={`mt-1 block w-full p-2 border rounded-md focus:ring-brand-blue focus:border-brand-blue ${
                            errors.cif ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Ej: B12345678"
                    />
                    {errors.cif && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.cif.message}
                        </p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label
                        htmlFor="direccion"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Dirección *
                    </label>
                    <input
                        id="direccion"
                        type="text"
                        {...register("direccion")}
                        className={`mt-1 block w-full p-2 border rounded-md focus:ring-brand-blue focus:border-brand-blue ${
                            errors.direccion
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                    />
                    {errors.direccion && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.direccion.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="codigoPostal"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Código Postal *
                    </label>
                    <input
                        id="codigoPostal"
                        type="text"
                        {...register("codigoPostal")}
                        maxLength={5}
                        className={`mt-1 block w-full p-2 border rounded-md focus:ring-brand-blue focus:border-brand-blue ${
                            errors.codigoPostal
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                    />
                    {errors.codigoPostal && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.codigoPostal.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="ciudad"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Ciudad *
                    </label>
                    <input
                        id="ciudad"
                        type="text"
                        {...register("ciudad")}
                        className={`mt-1 block w-full p-2 border rounded-md focus:ring-brand-blue focus:border-brand-blue ${
                            errors.ciudad ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {errors.ciudad && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.ciudad.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="nombreContacto"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Nombre de Contacto *
                    </label>
                    <input
                        id="nombreContacto"
                        type="text"
                        {...register("nombreContacto")}
                        className={`mt-1 block w-full p-2 border rounded-md focus:ring-brand-blue focus:border-brand-blue ${
                            errors.nombreContacto
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                    />
                    {errors.nombreContacto && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.nombreContacto.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="telefono"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Teléfono de Contacto *
                    </label>
                    <input
                        id="telefono"
                        type="tel"
                        {...register("telefono")}
                        className={`mt-1 block w-full p-2 border rounded-md focus:ring-brand-blue focus:border-brand-blue ${
                            errors.telefono
                                ? "border-red-500"
                                : "border-gray-300"
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
                        Email de Contacto *
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

                <div>
                    <label
                        htmlFor="cuotaMensual"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Cuota Mensual (€)
                    </label>
                    <input
                        id="cuotaMensual"
                        type="number"
                        step="0.01"
                        {...register("cuotaMensual", { valueAsNumber: true })}
                        className={`mt-1 block w-full p-2 border rounded-md focus:ring-brand-blue focus:border-brand-blue ${
                            errors.cuotaMensual
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                        placeholder="0.00"
                    />
                    {errors.cuotaMensual && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.cuotaMensual.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="iban"
                        className="block text-sm font-medium text-gray-700"
                    >
                        IBAN (Cuenta de Cargo)
                    </label>
                    <input
                        id="iban"
                        type="text"
                        {...register("iban")}
                        className={`mt-1 block w-full p-2 border rounded-md focus:ring-brand-blue focus:border-brand-blue ${
                            errors.iban ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="ES00 0000 0000 0000 0000 0000"
                        maxLength={34}
                    />
                    {errors.iban && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.iban.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="fechaCargo"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Día de Cargo (1-31)
                    </label>
                    <input
                        id="fechaCargo"
                        type="number"
                        min="1"
                        max="31"
                        {...register("fechaCargo", { valueAsNumber: true })}
                        className={`mt-1 block w-full p-2 border rounded-md focus:ring-brand-blue focus:border-brand-blue ${
                            errors.fechaCargo
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                        placeholder="Ej: 19"
                    />
                    {errors.fechaCargo && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.fechaCargo.message}
                        </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        Día del mes para domiciliación bancaria
                    </p>
                </div>

                {/* Sección de Contrato */}
                <div className="md:col-span-2 bg-purple-50 p-4 rounded-md border border-purple-200">
                    <h3 className="text-sm font-bold text-purple-900 mb-3">
                        Configuración de Contrato (Planificación Automática)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="block text-sm font-medium text-purple-800 mb-2">
                                Días de Limpieza
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { value: 1, label: "L" },
                                    { value: 2, label: "M" },
                                    { value: 3, label: "X" },
                                    { value: 4, label: "J" },
                                    { value: 5, label: "V" },
                                    { value: 6, label: "S" },
                                    { value: 0, label: "D" },
                                ].map((day) => (
                                    <label
                                        key={day.value}
                                        className="inline-flex items-center"
                                    >
                                        <input
                                            type="checkbox"
                                            value={day.value}
                                            {...register("diasContrato")}
                                            className="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                        />
                                        <span className="ml-2 mr-4 text-gray-700 font-medium">
                                            {day.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            {errors.diasContrato && (
                                <p className="text-red-500 text-xs mt-1 font-bold">
                                    {errors.diasContrato.message ||
                                        "Selección de días inválida"}
                                </p>
                            )}
                            <p className="text-xs text-purple-600 mt-1">
                                Selecciona los días fijos de servicio.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="empleadoAsignadoId"
                                className="block text-sm font-medium text-purple-800 mb-2"
                            >
                                Empleado Titular
                            </label>
                            <select
                                id="empleadoAsignadoId"
                                {...register("empleadoAsignadoId")}
                                className="mt-1 block w-full p-2 border border-purple-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white"
                            >
                                <option value="">-- Sin asignar --</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.nombre} {emp.apellidos}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-purple-600 mt-1">
                                Se le asignarán automáticamente los trabajos
                                creados.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sección de Auth */}
                <div className="md:col-span-2 bg-blue-50 p-4 rounded-md border border-blue-200">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-blue-800"
                    >
                        Contraseña Provisional (Para acceso Web)
                    </label>
                    <p className="text-xs text-blue-600 mb-2">
                        Si escribes una contraseña, se creará automáticamente el
                        usuario en Firebase Auth.
                        {isEditing && " (Dejar vacío para mantener la actual)"}
                    </p>
                    <input
                        id="password"
                        type="password"
                        {...register("password")}
                        placeholder="Ej: jbarranco2025"
                        className={`mt-1 block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm ${
                            errors.password
                                ? "border-red-500"
                                : "border-blue-300"
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

                {/* Sección ID Avanzado */}
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-md border border-gray-200">
                    <label
                        htmlFor="idUsuario"
                        className="block text-sm font-medium text-gray-800"
                    >
                        ID de Usuario (Auth UID) - Avanzado
                    </label>
                    <p className="text-xs text-gray-600 mb-2">
                        Opcional. Vincular a usuario existente por UID.
                    </p>
                    <input
                        id="idUsuario"
                        type="text"
                        {...register("idUsuario")}
                        placeholder="Ej: 7h8sd8f7h8sd7f8h..."
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500 text-sm font-mono"
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {getSubmitButtonText()}
                </button>
            </div>
        </div>
    );
};
