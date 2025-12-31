import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { createAuthUser } from "../utils/authAdmin";
import {
    ClientRow,
    generateEmail,
    generatePassword,
    ImportResult,
    mapRowToClientData,
} from "../utils/bulkImportHelpers";

/**
 * Create a single client in all 3 locations:
 * 1. Firebase Auth
 * 2. users collection (rol='cliente')
 * 3. clientes collection
 */
export async function createBulkClient(
    row: ClientRow,
): Promise<ImportResult> {
    const email = generateEmail(row.nombre);
    const password = generatePassword(row.nombre, row.nif);

    try {
        // Step 1: Create user in Firebase Auth
        const uid = await createAuthUser(email, password);

        // Step 2: Create document in 'users' collection
        await setDoc(doc(db, "users", uid), {
            uid,
            email,
            rol: "cliente",
            nombre: row.nombre,
            activo: true,
            fechaCreacion: Timestamp.now(),
        });

        // Step 3: Create document in 'clientes' collection
        const clientData = mapRowToClientData(row);
        await setDoc(doc(db, "clientes", uid), {
            id: uid,
            idUsuario: uid,
            ...clientData,
        });

        return {
            nombre: row.nombre,
            email,
            password,
            status: "success",
        };
    } catch (error) {
        console.error(`Error creating client ${row.nombre}:`, error);

        // Try to clean up if partially created
        try {
            // Note: We can't delete Auth users from client-side
            // Admin would need to clean up manually or via backend
        } catch (cleanupError) {
            console.error("Cleanup error:", cleanupError);
        }

        return {
            nombre: row.nombre,
            email,
            password,
            status: "error",
            error: error instanceof Error ? error.message : "Error desconocido",
        };
    }
}

/**
 * Process multiple clients in batch
 */
export async function createClientBatch(
    rows: ClientRow[],
    onProgress?: (current: number, total: number) => void,
): Promise<ImportResult[]> {
    const results: ImportResult[] = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row) continue; // Skip if undefined

        if (onProgress) {
            onProgress(i + 1, rows.length);
        }

        const result = await createBulkClient(row);
        results.push(result);

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return results;
}

/**
 * Export results to CSV format
 */
export function exportResultsToCSV(results: ImportResult[]): string {
    const headers = "Nombre,Email,Contraseña,Estado,Error\n";

    const rows = results.map((r) =>
        [
            `"${r.nombre}"`,
            r.email,
            r.password,
            r.status === "success" ? "Éxito" : "Error",
            r.error ? `"${r.error}"` : "",
        ].join(",")
    );

    return headers + rows.join("\n");
}

/**
 * Download CSV file
 */
export function downloadCSV(content: string, filename: string) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    link.remove();
}
