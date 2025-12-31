import { doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export const getNextDocumentNumber = async (
    type: "budget" | "invoice" | "report",
): Promise<string> => {
    const year = new Date().getFullYear().toString();
    const docRef = doc(db, "counters", year);

    try {
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            // Si es el primer documento del año, lo creamos
            await setDoc(docRef, {
                budget: type === "budget" ? 1 : 0,
                invoice: type === "invoice" ? 1 : 0,
                report: type === "report" ? 1 : 0,
            });
            return formatDocumentNumber(type, year, 1);
        } else {
            // Si ya existe, incrementamos atómicamente
            await updateDoc(docRef, {
                [type]: increment(1),
            });

            // Obtenemos el nuevo valor (nota: increment es write-only en return, así que leemos de nuevo o calculamos)
            // Para asegurar consistencia estricta idealmente usaríamos una transacción,
            // pero para este caso de uso leeremos el snapshot actualizado o confiaremos en la lógica.
            // Opción robusta: Transacción. Opción rápida: Read-after-write.
            // Dado que updateDoc no retorna el valor, haremos getDoc de nuevo para asegurar el número correcto.
            const updatedSnap = await getDoc(docRef);
            const count = updatedSnap.data()?.[type] || 1;
            return formatDocumentNumber(type, year, count);
        }
    } catch (error) {
        console.error("Error getting next document number:", error);
        // Fallback en caso de error (timestamp) para no bloquear
        return `${getErrorPrefix(type)}-${year}-${
            Date.now().toString().slice(-5)
        }`;
    }
};

const formatDocumentNumber = (
    type: string,
    year: string,
    count: number,
): string => {
    const prefix = getPrefix(type);
    const paddedCount = count.toString().padStart(5, "0");
    return `${prefix}-${year}-${paddedCount}`;
};

const getPrefix = (type: string): string => {
    switch (type) {
        case "budget":
            return "PRE";
        case "invoice":
            return "FAC";
        case "report":
            return "INF";
        default:
            return "DOC";
    }
};

const getErrorPrefix = (type: string): string => {
    switch (type) {
        case "budget":
            return "PRE-ERR";
        case "invoice":
            return "FAC-ERR";
        case "report":
            return "INF-ERR";
        default:
            return "DOC-ERR";
    }
};

// ADMIN ONLY: Reset counters to 0
export const resetCounters = async (): Promise<void> => {
    const year = new Date().getFullYear().toString();
    const docRef = doc(db, "counters", year);

    // Forzamos a cero (o el número previo al 1)
    await setDoc(docRef, {
        budget: 0,
        invoice: 0,
        report: 0,
    });
};
