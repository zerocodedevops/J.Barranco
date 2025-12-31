import { Timestamp } from "firebase/firestore";

/**
 * Formatea una fecha que puede venir como Firestore Timestamp, Date, string o null/undefined
 */
export const formatFirestoreDate = (
    date: Timestamp | Date | string | number | null | undefined,
    locale = "es-ES",
): string => {
    if (!date) return "-";

    let dateObj: Date;

    if (
        date instanceof Timestamp ||
        (typeof date === "object" && "toDate" in date)
    ) {
        // Es un Timestamp de Firestore (o similar)
        dateObj = (date as Timestamp).toDate();
    } else {
        // Es string, number o Date nativo
        dateObj = new Date(date);
    }

    // Verificar si es fecha válida
    if (Number.isNaN(dateObj.getTime())) return "Fecha inválida";

    return dateObj.toLocaleDateString(locale);
};
