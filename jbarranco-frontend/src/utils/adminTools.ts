import { db } from "../firebase/config";
import { collection, doc, getDocs, writeBatch } from "firebase/firestore";

export const assignAllTasksToEmployee = async (
    employeeId: string,
    employeeName: string,
) => {
    try {
        console.log(`🔄 Asignando todo a ${employeeName} (${employeeId})...`);
        const tasksRef = collection(db, "trabajos");
        const snapshot = await getDocs(tasksRef);

        const batch = writeBatch(db);
        let count = 0;

        snapshot.docs.forEach((d) => {
            const ref = doc(db, "trabajos", d.id);
            batch.update(ref, {
                empleadoId: employeeId,
                empleadoNombre: employeeName,
                estado: "pendiente", // Reset state just in case
            });
            count++;
        });

        await batch.commit();
        console.log(`✅ ${count} trabajos asignados a ${employeeName}`);
        return count;
    } catch (error) {
        console.error("Error batch update:", error);
        throw error;
    }
};
