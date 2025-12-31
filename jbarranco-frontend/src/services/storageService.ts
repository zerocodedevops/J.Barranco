import { supabase } from "../supabase/client";

export interface StorageDocument {
    url: string;
    path: string;
    name: string;
    size: number;
    type: string;
    category: string;
    uploadDate: Date;
    createdAt?: Date | string;
}

/**
 * Subir documento a Supabase Storage
 * @param {File} file - Archivo a subir
 * @param {string} category - Categoría (facturas, presupuestos, nominas, albaranes, otros)
 * @param {string} clientId - ID del cliente (opcional)
 * @returns {Promise<StorageDocument>}
 */
export const uploadDocument = async (
    file: File,
    category: string,
    clientId: string | null = null,
): Promise<StorageDocument> => {
    try {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        const path = clientId
            ? `${category}/${clientId}/${fileName}`
            : `${category}/${fileName}`;

        const { data, error } = await supabase.storage
            .from("documentos")
            .upload(path, file, { cacheControl: "3600", upsert: false });

        if (error) {
            console.error("Supabase upload error:", error);
            throw error;
        }

        // Obtener URL firmada (Privada)
        const signedUrl = await getSignedDocumentUrl(path);

        return {
            url: signedUrl,
            path: data.path,
            name: file.name,
            size: file.size,
            type: file.type,
            category,
            uploadDate: new Date(),
            createdAt: new Date(),
        };
    } catch (error) {
        console.error("Error uploading document:", error);
        throw new Error("Error al subir el documento");
    }
};

/**
 * Obtener URL firmada (temporal) de un documento
 * @param {string} path - Path del documento
 * @returns {Promise<string>}
 */
export const getSignedDocumentUrl = async (path: string): Promise<string> => {
    // Validez: 1 hora (3600 segundos)
    const { data, error } = await supabase.storage
        .from("documentos")
        .createSignedUrl(path, 3600);

    if (error) {
        console.error("Error getting signed URL:", error);
        return "";
    }
    return data.signedUrl;
};

// getDocumentUrl and downloadDocument removed (unused)

/**
 * Eliminar documento
 */
export const deleteDocument = async (path: string) => {
    try {
        const { error } = await supabase.storage
            .from("documentos")
            .remove([path]);
        if (error) throw error;
    } catch (error) {
        console.error("Error deleting document:", error);
        throw new Error("Error al eliminar el documento");
    }
};

/**
 * Listar documentos por categoría con URLs firmadas
 */
export const listDocumentsByCategory = async (
    category: string,
    clientId: string | null = null,
): Promise<StorageDocument[]> => {
    try {
        const path = clientId ? `${category}/${clientId}` : category;

        const { data, error } = await supabase.storage
            .from("documentos")
            .list(path);

        if (error) throw error;

        // Generar URLs firmadas para todos
        const docsWithUrls = await Promise.all(data.map(async (file) => {
            const filePath = `${path}/${file.name}`;
            const signedUrl = await getSignedDocumentUrl(filePath);

            return {
                name: file.name,
                path: filePath,
                url: signedUrl,
                size: file.metadata?.size || 0,
                type: file.metadata?.mimetype || "unknown",
                category: category,
                uploadDate: new Date(file.created_at),
                createdAt: new Date(file.created_at),
            };
        }));

        return docsWithUrls;
    } catch (error) {
        console.error("Error listing documents:", error);
        return [];
    }
};
