import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useEmployeeSettings } from "./hooks/useEmployeeSettings";
import { EmployeeSettingsForm } from "./components/EmployeeSettingsForm";

function EmployeeSettings() {
    const {
        formData,
        loading,
        handleChange,
        handleUpdateProfile,
        handleResetPassword,
    } = useEmployeeSettings();

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 shadow-sm rounded-t-lg">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <UserCircleIcon className="h-6 w-6 mr-2 text-brand-blue" />
                    Configuración de mi Cuenta
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    Actualiza tu información de contacto y credenciales.
                </p>
            </div>

            <EmployeeSettingsForm
                formData={formData}
                loading={loading}
                onChange={handleChange}
                onSubmit={handleUpdateProfile}
                onResetPassword={handleResetPassword}
                onCancel={() => globalThis.history.back()}
            />
        </div>
    );
}

export default EmployeeSettings;
