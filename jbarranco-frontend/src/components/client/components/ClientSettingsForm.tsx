import {
    DevicePhoneMobileIcon,
    EnvelopeIcon,
    KeyIcon,
} from "@heroicons/react/24/outline";
import { ClientSettingsFormData } from "../hooks/useClientSettings";

interface ClientSettingsFormProps {
    readonly formData: ClientSettingsFormData;
    readonly loading: boolean;
    readonly onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readonly onSubmit: (e: React.FormEvent) => void;
    readonly onResetPassword: () => void;
    readonly onCancel: () => void;
}

export function ClientSettingsForm({
    formData,
    loading,
    onChange,
    onSubmit,
    onResetPassword,
    onCancel,
}: ClientSettingsFormProps) {
    return (
        <form
            onSubmit={onSubmit}
            className="bg-white shadow sm:rounded-lg p-6 space-y-6"
        >
            {/* Sección Contacto */}
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Correo Electrónico
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={onChange}
                            className="focus:ring-brand-blue focus:border-brand-blue block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                            placeholder="tu@email.com"
                        />
                    </div>
                </div>

                <div className="sm:col-span-4">
                    <label
                        htmlFor="telefono"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Teléfono de Contacto
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="tel"
                            name="telefono"
                            id="telefono"
                            value={formData.telefono}
                            onChange={onChange}
                            className="focus:ring-brand-blue focus:border-brand-blue block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                            placeholder="+34 600 000 000"
                        />
                    </div>
                </div>
            </div>

            <div className="hidden sm:block" aria-hidden="true">
                <div className="py-2">
                    <div className="border-t border-gray-200" />
                </div>
            </div>

            {/* Sección Seguridad */}
            <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center mb-4">
                    <KeyIcon className="h-5 w-5 mr-2 text-gray-500" />
                    Seguridad
                </h3>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                        <label
                            htmlFor="currentPassword"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Contraseña Actual{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="currentPassword"
                            id="currentPassword"
                            value={formData.currentPassword}
                            onChange={onChange}
                            className="mt-1 focus:ring-brand-blue focus:border-brand-blue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                            placeholder="Necesaria para guardar cambios sensibles"
                        />
                        <div className="mt-2 text-right">
                            <button
                                type="button"
                                onClick={onResetPassword}
                                className="text-xs text-brand-blue hover:text-blue-500 font-medium"
                            >
                                He olvidado mi contraseña actual
                            </button>
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Nueva Contraseña
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            value={formData.newPassword}
                            onChange={onChange}
                            className="mt-1 focus:ring-brand-blue focus:border-brand-blue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                            placeholder="Opcional"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Confirmar Nueva
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={onChange}
                            className="mt-1 focus:ring-brand-blue focus:border-brand-blue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-5">
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-50"
                    >
                        {loading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                </div>
            </div>
        </form>
    );
}
