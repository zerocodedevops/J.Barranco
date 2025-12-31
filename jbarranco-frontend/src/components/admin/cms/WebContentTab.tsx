import { ChangeEvent, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../../firebase/config";
import { ServiceItem, WebContent } from "../../../types";

interface WebContentTabProps {
    readonly initialContent: WebContent;
    readonly initialServices: ServiceItem[];
    readonly onContentUpdate: (newContent: WebContent) => void;
    readonly onServicesUpdate: (newServices: ServiceItem[]) => void;
}

export default function WebContentTab({
    initialContent,
    initialServices,
    onContentUpdate,
    onServicesUpdate,
}: WebContentTabProps) {
    const [content, setContent] = useState<WebContent>(initialContent);
    const [services, setServices] = useState<ServiceItem[]>(initialServices);
    const [saving, setSaving] = useState(false);

    const handleContentChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        const newContent = { ...content, [name]: value };
        setContent(newContent);
        onContentUpdate(newContent);
    };

    const handleServiceChange = (
        id: number,
        field: keyof ServiceItem,
        value: string,
    ) => {
        const newServices = services.map((s) =>
            s.id === id ? { ...s, [field]: value } : s
        );
        setServices(newServices);
        onServicesUpdate(newServices);
    };

    const handleSaveContent = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, "configuracion", "webContent"), {
                ...content,
                updatedAt: new Date(),
            });
            toast.success("Contenido web guardado");
        } catch (error) {
            console.error("Error saving web content:", error);
            toast.error("Error al guardar el contenido");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveServices = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, "configuracion", "servicios"), {
                lista: services,
                updatedAt: new Date(),
            });
            toast.success("Servicios guardados");
        } catch (error) {
            console.error("Error saving services:", error);
            toast.error("Error al guardar los servicios");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Home */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Página Home
                </h3>
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="web-homeTitle"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Título Principal
                        </label>
                        <input
                            id="web-homeTitle"
                            type="text"
                            name="homeTitle"
                            value={content.homeTitle}
                            onChange={handleContentChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                            placeholder="Servicios de Limpieza Profesionales"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="web-homeDescription"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Descripción
                        </label>
                        <textarea
                            id="web-homeDescription"
                            name="homeDescription"
                            value={content.homeDescription}
                            onChange={handleContentChange}
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                            placeholder="Texto introductorio de la página principal..."
                        />
                    </div>
                </div>
            </div>

            {/* Quiénes Somos */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Quiénes Somos
                </h3>
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="web-aboutTitle"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Título
                        </label>
                        <input
                            id="web-aboutTitle"
                            type="text"
                            name="aboutTitle"
                            value={content.aboutTitle}
                            onChange={handleContentChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="web-aboutDescription"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Contenido
                        </label>
                        <textarea
                            id="web-aboutDescription"
                            name="aboutDescription"
                            value={content.aboutDescription}
                            onChange={handleContentChange}
                            rows={6}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                            placeholder="Historia de la empresa, misión, valores..."
                        />
                    </div>
                </div>
            </div>

            {/* Servicios */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Nuestros Servicios
                </h3>
                <div className="space-y-4 mb-6">
                    <div>
                        <label
                            htmlFor="web-servicesTitle"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Título de Sección
                        </label>
                        <input
                            id="web-servicesTitle"
                            type="text"
                            name="servicesTitle"
                            value={content.servicesTitle}
                            onChange={handleContentChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="web-servicesDescription"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Descripción General
                        </label>
                        <textarea
                            id="web-servicesDescription"
                            name="servicesDescription"
                            value={content.servicesDescription}
                            onChange={handleContentChange}
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                        />
                    </div>
                </div>

                <h4 className="font-medium text-gray-900 mb-3">
                    Servicios Específicos
                </h4>
                <div className="space-y-4">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="border border-gray-200 p-4 rounded-md"
                        >
                            <input
                                type="text"
                                value={service.titulo}
                                onChange={(e) =>
                                    handleServiceChange(
                                        service.id,
                                        "titulo",
                                        e.target.value,
                                    )}
                                className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                                placeholder="Nombre del servicio"
                            />
                            <textarea
                                value={service.descripcion}
                                onChange={(e) =>
                                    handleServiceChange(
                                        service.id,
                                        "descripcion",
                                        e.target.value,
                                    )}
                                rows={2}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                                placeholder="Descripción del servicio..."
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex gap-3">
                    <button
                        onClick={handleSaveContent}
                        disabled={saving}
                        className="flex-1 bg-brand-blue text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? "Guardando..." : "Guardar Contenido"}
                    </button>
                    <button
                        onClick={handleSaveServices}
                        disabled={saving}
                        className="flex-1 bg-brand-orange text-white px-6 py-3 rounded-md hover:bg-orange-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? "Guardando..." : "Guardar Servicios"}
                    </button>
                </div>
            </div>
        </div>
    );
}
