import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    Timestamp,
    where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

export interface DashboardStats {
    nextJob: {
        id: string;
        fecha: Date;
        tipo: string;
        estado?: string;
    } | null;
    loading: boolean;
}

export const useClientDashboardData = (): DashboardStats => {
    const { user } = useAuth();
    const [nextJob, setNextJob] = useState<DashboardStats["nextJob"]>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNextJob = async () => {
            if (!user) return;

            try {
                // Buscar trabajos futuros
                const q = query(
                    collection(db, "trabajos"),
                    where("clienteId", "==", user.uid),
                    where("fecha", ">=", Timestamp.now()),
                    orderBy("fecha", "asc"),
                    limit(1),
                );

                const snapshot = await getDocs(q);

                if (snapshot.empty) {
                    setNextJob(null);
                } else {
                    const doc = snapshot.docs[0];
                    if (doc) {
                        const data = doc.data();
                        setNextJob({
                            id: doc.id,
                            fecha: data.fecha.toDate(),
                            tipo: data.tipo,
                            estado: data.estado,
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching next job:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNextJob();
    }, [user]);

    return { nextJob, loading };
};
