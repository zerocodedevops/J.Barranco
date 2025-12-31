import { ChangeEvent, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../../firebase/config";
import { CompanyData } from "../../../types";

interface CompanyTabProps {
    readonly initialData: CompanyData;
    readonly onUpdate: (newData: CompanyData) => void;
}

export default function CompanyTab({ initialData, onUpdate }: CompanyTabProps) {
    const [data, setData] = useState<CompanyData>(initialData);
    const [saving, setSaving] = useState(false);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        const newData = { ...data, [name]: value };
        setData(newData);
        // Update parent state as well to keep in sync if needed, though local state handles input
        onUpdate(newData);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, "configuracion", "empresa"), {
                ...data,
                updatedAt: new Date(),
            });
            toast.success("Configuración de empresa guardada");
        } catch (error) {
            console.error("Error saving company data:", error);
            toast.error("Error al guardar la configuración");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Datos de la Empresa
            </h3>

            <div className="space-y-4">
                <div>
                    <label
                        htmlFor="company-nombre"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Nombre de la Empresa
                    </label>
                    <input
                        id="company-nombre"
                        type="text"
                        name="nombre"
                        value={data.nombre}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                    />
                </div>

                <div>
                    <label
                        htmlFor="company-direccion"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Dirección
                    </label>
                    <input
                        id="company-direccion"
                        type="text"
                        name="direccion"
                        value={data.direccion}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="company-telefono"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Teléfono
                        </label>
                        <input
                            id="company-telefono"
                            type="tel"
                            name="telefono"
                            value={data.telefono}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="company-email"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Email
                        </label>
                        <input
                            id="company-email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="company-cif"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        CIF
                    </label>
                    <input
                        id="company-cif"
                        type="text"
                        name="cif"
                        value={data.cif}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                    />
                </div>

                <div>
                    <label
                        htmlFor="company-descripcion"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Descripción
                    </label>
                    <textarea
                        id="company-descripcion"
                        name="descripcion"
                        value={data.descripcion}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                        placeholder="Descripción breve de la empresa..."
                    />
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-brand-blue text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? "Guardando..." : "Guardar Configuración"}
                </button>
            </div>
        </div>
    );
}
