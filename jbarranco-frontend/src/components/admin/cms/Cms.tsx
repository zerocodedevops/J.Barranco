import { useCallback, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../../firebase/config";
import {
  BuildingOffice2Icon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { CompanyData, ServiceItem, WebContent } from "../../../types";
import CompanyTab from "./CompanyTab";
import WebContentTab from "./WebContentTab";

function Cms() {
  const [activeTab, setActiveTab] = useState("company");
  const [loading, setLoading] = useState(true);

  // Configuración de empresa
  const [companyData, setCompanyData] = useState<CompanyData>({
    nombre: "J-Barranco Servicios de Limpieza",
    direccion: "",
    telefono: "",
    email: "",
    cif: "",
    descripcion: "",
  });

  // Contenido web
  const [webContent, setWebContent] = useState<WebContent>({
    homeTitle: "",
    homeDescription: "",
    aboutTitle: "",
    aboutDescription: "",
    servicesTitle: "",
    servicesDescription: "",
  });

  // Servicios
  const [services, setServices] = useState<ServiceItem[]>([
    { id: 1, titulo: "Limpieza General", descripcion: "" },
    { id: 2, titulo: "Limpieza Profunda", descripcion: "" },
    { id: 3, titulo: "Mantenimiento", descripcion: "" },
    { id: 4, titulo: "Cristales", descripcion: "" },
  ]);

  const loadCMSData = useCallback(async () => {
    setLoading(true);
    try {
      // Cargar configuración de empresa
      const companyDoc = await getDoc(doc(db, "configuracion", "empresa"));
      if (companyDoc.exists()) {
        const data = companyDoc.data();
        setCompanyData({
          nombre: data.nombre || "",
          direccion: data.direccion || "",
          telefono: data.telefono || "",
          email: data.email || "",
          cif: data.cif || "",
          descripcion: data.descripcion || "",
        });
      }

      // Cargar contenido web
      const webDoc = await getDoc(doc(db, "configuracion", "webContent"));
      if (webDoc.exists()) {
        const data = webDoc.data();
        setWebContent({
          homeTitle: data.homeTitle || "",
          homeDescription: data.homeDescription || "",
          aboutTitle: data.aboutTitle || "",
          aboutDescription: data.aboutDescription || "",
          servicesTitle: data.servicesTitle || "",
          servicesDescription: data.servicesDescription || "",
        });
      }

      // Cargar servicios
      const servicesDoc = await getDoc(doc(db, "configuracion", "servicios"));
      if (servicesDoc.exists()) {
        setServices((prev) =>
          (servicesDoc.data().lista as ServiceItem[]) || prev
        );
      }
    } catch (error) {
      console.error("Error loading CMS data:", error);
      toast.error("Error al cargar la configuración");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCMSData();
  }, [loadCMSData]);

  const handleCompanyUpdate = (newData: CompanyData) => {
    setCompanyData(newData);
  };

  const handleContentUpdate = (newContent: WebContent) => {
    setWebContent(newContent);
  };

  const handleServicesUpdate = (newServices: ServiceItem[]) => {
    setServices(newServices);
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Gestión de Contenido Web (CMS)
      </h2>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("company")}
              className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === "company"
                  ? "border-brand-blue text-brand-blue"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <BuildingOffice2Icon className="h-5 w-5 inline mr-2" />
              Configuración Empresa
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`pb-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === "content"
                  ? "border-brand-blue text-brand-blue"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <DocumentTextIcon className="h-5 w-5 inline mr-2" />
              Contenido Web
            </button>
          </div>
        </div>
      </div>

      {/* Configuración de Empresa */}
      {activeTab === "company" && (
        <CompanyTab
          initialData={companyData}
          onUpdate={handleCompanyUpdate}
        />
      )}

      {/* Contenido Web */}
      {activeTab === "content" && (
        <WebContentTab
          initialContent={webContent}
          initialServices={services}
          onContentUpdate={handleContentUpdate}
          onServicesUpdate={handleServicesUpdate}
        />
      )}
    </div>
  );
}

export default Cms;
