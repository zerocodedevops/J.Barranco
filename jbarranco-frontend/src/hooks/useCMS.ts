import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export interface CompanyData {
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
    cif: string;
    descripcion: string;
}

export interface WebContent {
    homeTitle: string;
    homeDescription: string;
    aboutTitle: string;
    aboutDescription: string;
    servicesTitle: string;
    servicesDescription: string;
}

export interface ServiceItem {
    id: number;
    titulo: string;
    descripcion: string;
}

export function useCMS() {
    const [company, setCompany] = useState<CompanyData | null>(null);
    const [content, setContent] = useState<WebContent | null>(null);
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [companySnap, contentSnap, servicesSnap] = await Promise
                    .all([
                        getDoc(doc(db, "configuracion", "empresa")),
                        getDoc(doc(db, "configuracion", "webContent")),
                        getDoc(doc(db, "configuracion", "servicios")),
                    ]);

                if (companySnap.exists()) {
                    setCompany(companySnap.data() as CompanyData);
                }
                if (contentSnap.exists()) {
                    setContent(contentSnap.data() as WebContent);
                }
                if (servicesSnap.exists()) {
                    setServices(servicesSnap.data().lista || []);
                }
            } catch (error) {
                console.error("Error fetching CMS data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { company, content, services, loading };
}
