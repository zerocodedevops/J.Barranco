import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../../firebase/config";
import {
  deleteDocument,
  listDocumentsByCategory,
  StorageDocument,
  uploadDocument,
} from "../../../services/storageService";
import {
  ArrowUpTrayIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../../context/AuthContext";
import Modal from "../../common/Modal";
import { Cliente } from "../../../types";

interface DocumentUploaderProps {
  clients: Cliente[];
}

function DocumentUploader({ clients }: DocumentUploaderProps) {
  const { user } = useAuth();
  const [uploadCategory, setUploadCategory] = useState("facturas");
  const [uploadClientId, setUploadClientId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<StorageDocument[]>([]);

  // Estado para la previsualización
  const [selectedDoc, setSelectedDoc] = useState<StorageDocument | null>(null);

  const loadUploadedDocs = useCallback(async () => {
    if (uploadCategory) {
      const docs = await listDocumentsByCategory(
        uploadCategory,
        uploadClientId || null,
      );
      setUploadedDocs(docs);
    }
  }, [uploadCategory, uploadClientId]);

  useEffect(() => {
    loadUploadedDocs();
  }, [loadUploadedDocs]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Por favor, selecciona un archivo");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadDocument(
        selectedFile,
        uploadCategory,
        uploadClientId || null,
      );

      // Guardar referencia en Firestore
      await addDoc(collection(db, "documentosSubidos"), {
        ...result,
        clienteId: uploadClientId || null,
        uploadedBy: user?.email || "admin",
        createdAt: new Date(),
      });

      toast.success("Documento subido correctamente");
      setSelectedFile(null);
      toast.success("Documento subido correctamente");
      setSelectedFile(null);
      loadUploadedDocs();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error al subir el documento");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDoc = async (path: string) => {
    if (!window.confirm("¿Eliminar este documento?")) return;

    try {
      await deleteDocument(path);
      toast.success("Documento eliminado");
      await deleteDocument(path);
      toast.success("Documento eliminado");
      loadUploadedDocs();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Error al eliminar el documento");
    }
  };

  const getFileType = (name: string) => {
    if (!name) return "other";
    const ext = name.split(".").pop()?.toLowerCase() || "";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (["pdf"].includes(ext)) return "pdf";
    return "other";
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Subir Documentos
      </h2>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="category-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Categoría *
            </label>
            <select
              id="category-select"
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
            >
              <option value="facturas">Facturas</option>
              <option value="presupuestos">Presupuestos</option>
              <option value="nominas">Nóminas</option>
              <option value="albaranes">Albaranes</option>
              <option value="gastos-empresa">Gastos de empresa</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="client-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Cliente (opcional)
            </label>
            <select
              id="client-select"
              value={uploadClientId}
              onChange={(e) => setUploadClientId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
            >
              <option value="">Sin cliente específico</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="file-upload"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Archivo *
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {selectedFile && (
            <p className="mt-2 text-sm text-gray-600">
              Archivo seleccionado: {selectedFile.name}
            </p>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
          className="w-full bg-brand-orange text-white px-6 py-3 rounded-md hover:bg-orange-600 flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowUpTrayIcon className="h-5 w-5" />
          {uploading ? "Subiendo..." : "Subir Documento"}
        </button>
      </div>

      {/* Lista de documentos subidos */}
      {uploadedDocs.length > 0 && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Documentos en {uploadCategory}
          </h3>
          <div className="space-y-2">
            {uploadedDocs.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {doc.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {doc.uploadDate &&
                      new Date(doc.uploadDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {/* Botón Visualizar (Incrustado) */}
                  <button
                    onClick={() => setSelectedDoc(doc)}
                    className="text-gray-600 hover:text-brand-blue"
                    title="Visualizar"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  {/* Botón Descargar */}
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-blue hover:text-blue-700"
                    title="Descargar"
                    download
                  >
                    <DocumentArrowDownIcon className="h-5 w-5" />
                  </a>
                  <button
                    onClick={() => handleDeleteDoc(doc.path)}
                    className="text-red-600 hover:text-red-900"
                    title="Eliminar"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Previsualización */}
      <Modal
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        title={selectedDoc?.name || "Documento"}
        size="7xl"
      >
        <div className="h-[80vh] flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
          {selectedDoc && (() => {
            const type = getFileType(selectedDoc.name);
            if (type === "image") {
              return (
                <img
                  src={selectedDoc.url}
                  alt={selectedDoc.name}
                  className="max-w-full max-h-full object-contain"
                />
              );
            } else if (type === "pdf") {
              return (
                <iframe
                  src={selectedDoc.url}
                  className="w-full h-full border-none"
                  title="Visor de PDF"
                />
              );
            } else {
              return (
                <div className="text-center p-8">
                  <DocumentArrowDownIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg text-gray-600 mb-4">
                    Este tipo de archivo no se puede previsualizar.
                  </p>
                  <a
                    href={selectedDoc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Descargar Archivo
                  </a>
                </div>
              );
            }
          })()}
        </div>
      </Modal>
    </div>
  );
}

export default DocumentUploader;
