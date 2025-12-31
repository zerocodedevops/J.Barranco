import { useCallback, useState } from "react";
import {
    addDoc,
    collection,
    getDocs,
    orderBy,
    query,
    Timestamp,
    where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Rating, RatingStats } from "../types/rating";
import toast from "react-hot-toast";

export function useRatings() {
    const [loading, setLoading] = useState(false);

    // Crear nueva valoración
    const createRating = useCallback(async (
        ratingData: Omit<Rating, "id" | "createdAt">,
    ) => {
        setLoading(true);
        try {
            const ratingsRef = collection(db, "ratings");
            await addDoc(ratingsRef, {
                ...ratingData,
                createdAt: Timestamp.now(),
            });
            toast.success("¡Valoración enviada correctamente!");
            return true;
        } catch (error) {
            console.error("Error creating rating:", error);
            toast.error("Error al enviar la valoración");
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Obtener valoraciones de un empleado
    const getEmployeeRatings = useCallback(async (
        employeeId: string,
    ): Promise<Rating[]> => {
        try {
            const ratingsRef = collection(db, "ratings");
            const q = query(
                ratingsRef,
                where("employeeId", "==", employeeId),
                orderBy("createdAt", "desc"),
            );
            const snapshot = await getDocs(q);

            return snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt.toDate(),
            })) as Rating[];
        } catch (error) {
            console.error("Error fetching employee ratings:", error);
            return [];
        }
    }, []);

    // Obtener valoraciones hechas por un cliente
    const getClientRatings = useCallback(
        async (clientId: string): Promise<Rating[]> => {
            try {
                const ratingsRef = collection(db, "ratings");
                const q = query(
                    ratingsRef,
                    where("clientId", "==", clientId),
                    orderBy("createdAt", "desc"),
                );
                const snapshot = await getDocs(q);

                return snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt.toDate(),
                })) as Rating[];
            } catch (error) {
                console.error("Error fetching client ratings:", error);
                // Don't toast here to avoid loops if called frequently, let caller handle UI
                return [];
            }
        },
        [],
    );

    // Calcular estadísticas de un empleado
    const getEmployeeStats = useCallback(async (
        employeeId: string,
    ): Promise<RatingStats | null> => {
        const ratings = await getEmployeeRatings(employeeId);

        if (ratings.length === 0) {
            return null;
        }

        const totalStars = ratings.reduce((sum, r) => sum + r.stars, 0);
        const totalPuntualidad = ratings.reduce(
            (sum, r) => sum + r.categories.puntualidad,
            0,
        );
        const totalCalidad = ratings.reduce(
            (sum, r) => sum + r.categories.calidad,
            0,
        );
        const totalTrato = ratings.reduce(
            (sum, r) => sum + r.categories.trato,
            0,
        );

        return {
            employeeId,
            employeeName: ratings[0]?.employeeName || "",
            totalRatings: ratings.length,
            averageStars: totalStars / ratings.length,
            averageCategories: {
                puntualidad: totalPuntualidad / ratings.length,
                calidad: totalCalidad / ratings.length,
                trato: totalTrato / ratings.length,
            },
            recentRatings: ratings.slice(0, 5),
        };
    }, [getEmployeeRatings]);

    return {
        loading,
        createRating,
        getEmployeeRatings,
        getClientRatings,
        getEmployeeStats,
    };
}
