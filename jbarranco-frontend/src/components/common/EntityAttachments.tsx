import { useCallback, useEffect, useState } from "react";
import {
    deleteDocument,
    listDocumentsByCategory,
    StorageDocument,
    uploadDocument,
} from "../../services/storageService";
import {
    ArrowUpTrayIcon,
    DocumentArrowDownIcon,
    DocumentIcon,
    EyeIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface EntityAttachmentsProps {
    entityId: string;
    folderPath: string; // Ej: 'clients/123' o 'employees/456'
    title?: string;
}

export default function EntityAttachments(
    { entityId, folderPath, title = "Documentación" }: EntityAttachmentsProps,
) {
    const [files, setFiles] = useState<StorageDocument[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const loadFiles = useCallback(async () => {
        setLoading(true);
        try {
            // Usamos listDocumentsByCategory pasando el folderPath como categoría
            // Esto asume que el servicio lista el contenido de ese "prefijo"
            const docs = await listDocumentsByCategory(folderPath);
            setFiles(docs);
        } catch (error) {
            console.error("Error loading files:", error);
            // No mostramos error toast aquí para no ser intrusivos si está vacío o falla silenciosamente
        } finally {
            setLoading(false);
        }
    }, [folderPath]);

    useEffect(() => {
        if (entityId) {
            loadFiles();
        }
    }, [entityId, loadFiles]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            // Subir archivo a la ruta especificada
            await uploadDocument(selectedFile, folderPath);

            toast.success("Documento subido");
            setSelectedFile(null);
            loadFiles(); // Recargar lista
        } catch (error) {
            console.error("Error uploading:", error);
            toast.error("Error al subir documento");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (path: string) => {
        if (!window.confirm("¿Eliminar este documento?")) return;

        try {
            await deleteDocument(path);
            toast.success("Eliminado");
            setFiles(files.filter((f) => f.path !== path));
        } catch (error) {
            console.error(error);
            toast.error("Error al eliminar");
        }
    };

    const renderFileList = () => {
        if (loading) {
            return (
                <p className="text-xs text-gray-400 text-center py-2">
                    Cargando...
                </p>
            );
        }

        if (files.length === 0) {
            return (
                <p className="text-xs text-gray-400 italic text-center py-2">
                    No hay documentos adjuntos.
                </p>
            );
        }

        return files.map((file, idx) => (
            <div
                key={idx}
                className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100"
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <DocumentIcon className="h-4 w-4 text-gray-400 shrink-0" />
                    <span
                        className="text-sm text-gray-700 truncate"
                        title={file.name}
                    >
                        {file.name}
                    </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-500 hover:text-brand-blue p-1"
                        title="Ver"
                    >
                        <EyeIcon className="h-4 w-4" />
                    </a>
                    <a
                        href={file.url}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-500 hover:text-green-600 p-1"
                        title="Descargar"
                    >
                        <DocumentArrowDownIcon className="h-4 w-4" />
                    </a>
                    <button
                        onClick={() => handleDelete(file.path)}
                        className="text-gray-500 hover:text-red-600 p-1"
                        title="Eliminar"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        ));
    };

    return (
        <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                {title}
            </h4>

            <div className="bg-white border border-gray-200 p-4 rounded-lg space-y-4">
                {/* Uploader */}
                <div className="flex gap-2 items-center">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-brand-blue
                          hover:file:bg-blue-100
                        "
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                        className="bg-brand-blue text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Subir Archivo"
                    >
                        {uploading
                            ? (
                                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                            )
                            : <ArrowUpTrayIcon className="h-5 w-5" />}
                    </button>
                </div>

                {/* File List */}
                <div className="space-y-2 mt-2">
                    {renderFileList()}
                </div>
            </div>
        </div>
    );
}
