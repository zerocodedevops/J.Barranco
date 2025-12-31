import {
    collection,
    doc,
    getDocs,
    query,
    where,
    writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/config";

export const cleanAutoObservations = async () => {
    try {
        const q = query(
            collection(db, "trabajos"),
            where(
                "observaciones",
                "==",
                "Generado automáticamente por contrato",
            ),
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) return 0;

        const batch = writeBatch(db);
        let count = 0;

        snapshot.forEach((document) => {
            const docRef = doc(db, "trabajos", document.id);
            // Actualizamos el campo observaciones a cadena vacía
            batch.update(docRef, {
                observaciones: "",
            });
            count++;
        });

        await batch.commit();
        return count;
    } catch (error) {
        console.error("Error cleaning observations:", error);
        throw error;
    }
};

export const deleteAllAutoObservations = async () => {
    try {
        // Buscamos TODOS los trabajos que tengan alguna observación no vacía
        const q = query(
            collection(db, "trabajos"),
            where("observaciones", "!=", ""),
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) return 0;

        const batch = writeBatch(db);
        let count = 0;

        snapshot.forEach((document) => {
            const docRef = doc(db, "trabajos", document.id);
            batch.update(docRef, { observaciones: "" });
            count++;
        });

        await batch.commit();
        return count;
    } catch (error) {
        console.error("Error deleting all observations:", error);
        throw error;
    }
};

export const deleteLegacyContractualServices = async () => {
    try {
        // Borrar todos los trabajos que empiecen por "Servicio Contractual"
        const jobsRef = collection(db, "trabajos");

        const q = query(
            jobsRef,
            where("estado", "==", "pendiente"),
        );
        const snapshot = await getDocs(q);

        const batch = writeBatch(db);
        let count = 0;

        snapshot.forEach((doc) => {
            const data = doc.data();
            if (
                data.descripcion &&
                data.descripcion.startsWith("Servicio Contractual")
            ) {
                batch.delete(doc.ref);
                count++;
            }
        });

        if (count > 0) await batch.commit();
        return count;
    } catch (error) {
        console.error("Error deleting legacy jobs:", error);
        throw error;
    }
};
