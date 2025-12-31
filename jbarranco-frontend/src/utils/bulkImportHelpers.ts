import { Timestamp } from "firebase/firestore";

export interface ClientRow {
    nombre: string;
    nif: string;
    direccion: string;
    iban: string;
    importe: string;
    fechaCargo: string;
}

export interface ImportResult {
    nombre: string;
    email: string;
    password: string;
    status: "success" | "error";
    error?: string;
}

/**
 * Parse TXT file content into structured client rows
 */
export function parseTxtFile(content: string): ClientRow[] {
    const lines = content.split("\n").filter((line) => line.trim());
    const rows: ClientRow[] = [];

    // Skip header line (index 0)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line?.trim()) continue;

        // Split by tab
        const columns = line.split("\t");
        if (columns.length < 6) continue; // Skip invalid lines

        rows.push({
            nombre: columns[0]?.trim() || "",
            direccion: columns[1]?.trim() || "",
            nif: columns[2]?.trim() || "",
            iban: columns[3]?.trim() || "",
            importe: columns[4]?.trim() || "",
            fechaCargo: columns[5]?.trim() || "",
        });
    }

    return rows;
}

/**
 * Generate email from client name
 * Example: "CONVENTO 5" → "convento5@clientejbarranco.com"
 */
export function generateEmail(nombre: string): string {
    const cleanName = nombre
        .toLowerCase()
        .replaceAll(/\s+/g, "") // Remove all spaces
        .replaceAll(/[^a-z0-9]/g, ""); // Remove special chars

    return `${cleanName}@clientejbarranco.com`;
}

/**
 * Generate password from client name and NIF
 * - With NIF: "H-79311130" → "H79311130"
 * - Without NIF: "ENCISO 1" → "Enciso*1"
 */
export function generatePassword(nombre: string, nif?: string): string {
    if (nif?.trim()) {
        // Remove hyphens, keep uppercase letter
        return nif.replaceAll("-", "").trim();
    }

    // No NIF: capitalize first letter, replace space with *
    const words = nombre.trim().split(/\s+/);
    if (words.length === 0) return "Cliente*1"; // Fallback

    const capitalized = words.map((word, index) =>
        index === 0
            ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            : word.toLowerCase()
    );

    return capitalized.join("*");
}

/**
 * Parse amount string to number
 * Example: "134,15 €" → 134.15
 */
export function parseAmount(importe: string): number {
    if (!importe) return 0;

    // Remove currency symbol and spaces
    const cleaned = importe.replaceAll("€", "").trim();

    // Replace comma with dot for decimal
    const normalized = cleaned.replaceAll(",", ".");

    return Number.parseFloat(normalized) || 0;
}

/**
 * Parse billing day from date string
 * Example: "19/12/2025" → 19
 */
export function parseBillingDay(fecha: string): number | undefined {
    if (!fecha || fecha.trim() === "") return undefined;

    const parts = fecha.split("/");
    if (parts.length < 1) return undefined;

    const day = Number.parseInt(parts[0] || "", 10);
    return Number.isNaN(day) ? undefined : day;
}

/**
 * Validate IBAN format (basic check)
 */
export function isValidIBAN(iban: string): boolean {
    if (!iban || iban.trim() === "") return true; // Empty is valid (optional field)

    // Remove spaces
    const cleaned = iban.replaceAll(/\s+/g, "");

    // Basic check: starts with 2 letters, followed by 2 digits, then alphanumeric
    const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]+$/;

    return ibanRegex.test(cleaned);
}

/**
 * Map ClientRow to Firestore Cliente document
 */
export function mapRowToClientData(row: ClientRow) {
    const billingDay = parseBillingDay(row.fechaCargo);

    const data: Record<string, unknown> = {
        nombre: row.nombre,
        cif: row.nif || "",
        direccion: row.direccion,
        codigoPostal: "28032",
        ciudad: "Madrid",
        nombreContacto: "",
        telefono: "",
        email: "", // Contact email (not auth email)
        cuotaMensual: parseAmount(row.importe),
        iban: row.iban || "",
        activo: true,
        fechaCreacion: Timestamp.now(),
        diasContrato: [],
        empleadoAsignadoId: "",
        empleadoAsignadoNombre: "",
    };

    // Only add fechaCargo if it's a valid number (Firestore rejects undefined)
    if (billingDay !== undefined) {
        data.fechaCargo = billingDay;
    }

    return data;
}
