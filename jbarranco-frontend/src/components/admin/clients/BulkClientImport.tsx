import { useState } from "react";
import {
    ArrowUpTrayIcon,
    DocumentArrowDownIcon,
    UserGroupIcon,
    WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { ImportResult, parseTxtFile } from "../../../utils/bulkImportHelpers";
import {
    createClientBatch,
    downloadCSV,
    exportResultsToCSV,
} from "../../../services/bulkImportService";
import { fixMissingClients } from "../../../utils/fixMissingClients";
import { importEmployees } from "../../../utils/bulkEmployeeImport";
import toast from "react-hot-toast";

interface BulkClientImportProps {
    readonly onClose: () => void;
    readonly onComplete: () => void;
}

export default function BulkClientImport({
    onClose,
    onComplete,
}: BulkClientImportProps) {
    const [file, setFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);
    const [fixing, setFixing] = useState(false);
    const [importingEmployees, setImportingEmployees] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [results, setResults] = useState<ImportResult[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setResults([]); // Clear previous results
        }
    };

    const handleImport = async () => {
        if (!file) {
            toast.error("Selecciona un archivo primero");
            return;
        }

        setImporting(true);
        setResults([]);

        try {
            // Read file content
            const content = await file.text();

            // Parse TXT file
            const rows = parseTxtFile(content);

            if (rows.length === 0) {
                toast.error("No se encontraron clientes en el archivo");
                setImporting(false);
                return;
            }

            toast.success(
                `${rows.length} clientes encontrados. Iniciando importación...`,
            );

            // Process batch
            const importResults = await createClientBatch(
                rows,
                (current, total) => {
                    setProgress({ current, total });
                },
            );

            setResults(importResults);

            const successCount = importResults.filter((r) =>
                r.status === "success"
            ).length;
            const errorCount = importResults.filter((r) =>
                r.status === "error"
            ).length;

            if (errorCount === 0) {
                toast.success(
                    `✅ ${successCount} clientes importados correctamente`,
                );
            } else {
                toast.error(
                    `⚠️ ${successCount} éxitos, ${errorCount} errores. Revisa el reporte.`,
                );
            }

            onComplete();
        } catch (error) {
            console.error("Error during import:", error);
            toast.error("Error al procesar el archivo");
        } finally {
            setImporting(false);
        }
    };

    const handleDownloadReport = () => {
        if (results.length === 0) {
            toast.error("No hay resultados para exportar");
            return;
        }

        const csvContent = exportResultsToCSV(results);
        const timestamp = new Date().toISOString().split("T")[0];
        downloadCSV(csvContent, `importacion_clientes_${timestamp}.csv`);
        toast.success("Reporte descargado");
    };

    const handleFixMissing = async () => {
        setFixing(true);
        try {
            const fixResults = await fixMissingClients();
            fixResults.forEach((msg) => {
                if (msg.startsWith("✅")) {
                    toast.success(msg);
                } else {
                    toast.error(msg);
                }
            });
            onComplete();
        } catch (error) {
            console.error("Fix error:", error);
            toast.error("Error al completar clientes");
        } finally {
            setFixing(false);
        }
    };

    const handleImportEmployees = async () => {
        setImportingEmployees(true);
        try {
            const empResults = await importEmployees();
            empResults.forEach((msg) => {
                if (msg.startsWith("✅")) {
                    toast.success(msg);
                } else {
                    toast.error(msg);
                }
            });
            onComplete();
        } catch (error) {
            console.error("Employee import error:", error);
            toast.error("Error al importar empleados");
        } finally {
            setImportingEmployees(false);
        }
    };

    const successCount = results.filter((r) => r.status === "success").length;
    const errorCount = results.filter((r) => r.status === "error").length;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Importación Masiva de Clientes
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Sube un archivo TXT con los datos de los clientes
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    {/* File Upload */}
                    <div>
                        <label
                            htmlFor="file-upload"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Archivo TXT
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                id="file-upload"
                                type="file"
                                accept=".txt"
                                onChange={handleFileChange}
                                disabled={importing}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-white hover:file:bg-blue-700 disabled:opacity-50"
                            />
                        </div>
                        {file && (
                            <p className="text-sm text-gray-600 mt-2">
                                📄 {file.name} ({(file.size / 1024).toFixed(2)}
                                {" "}
                                KB)
                            </p>
                        )}
                    </div>

                    {/* Fix Missing Clients Button */}
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-800 mb-2">
                            <strong>¿3 clientes fallaron?</strong>{" "}
                            Usa este botón para completar ENCISO 1, TITICACA 6 y
                            RASTRO 6.
                        </p>
                        <button
                            onClick={handleFixMissing}
                            disabled={fixing}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
                        >
                            <WrenchScrewdriverIcon className="h-5 w-5" />
                            {fixing
                                ? "Reparando..."
                                : "Reparar 3 Clientes Faltantes"}
                        </button>
                    </div>

                    {/* Import Employees Button */}
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <p className="text-sm text-purple-800 mb-2">
                            <strong>Importar 3 Empleados:</strong>{" "}
                            Beatriz, Margarita y Marlete (del 02/01/2026)
                        </p>
                        <button
                            onClick={handleImportEmployees}
                            disabled={importingEmployees}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                        >
                            <UserGroupIcon className="h-5 w-5" />
                            {importingEmployees
                                ? "Importando..."
                                : "Importar 3 Empleados"}
                        </button>
                    </div>

                    {/* Progress */}
                    {importing && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-blue-900">
                                    Procesando...
                                </span>
                                <span className="text-sm text-blue-700">
                                    {progress.current} / {progress.total}
                                </span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-2">
                                <div
                                    className="bg-brand-blue h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${
                                            (progress.current /
                                                progress.total) * 100
                                        }%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Results Summary */}
                    {results.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Resumen de Importación
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-green-100 p-3 rounded">
                                    <p className="text-sm text-green-800">
                                        Éxitos
                                    </p>
                                    <p className="text-2xl font-bold text-green-900">
                                        {successCount}
                                    </p>
                                </div>
                                <div className="bg-red-100 p-3 rounded">
                                    <p className="text-sm text-red-800">
                                        Errores
                                    </p>
                                    <p className="text-2xl font-bold text-red-900">
                                        {errorCount}
                                    </p>
                                </div>
                            </div>

                            {/* Error List */}
                            {errorCount > 0 && (
                                <div className="mt-4 max-h-40 overflow-y-auto">
                                    <p className="text-sm font-medium text-red-900 mb-2">
                                        Errores:
                                    </p>
                                    {results
                                        .filter((r) => r.status === "error")
                                        .map((r, idx) => (
                                            <div
                                                key={`${r.nombre}-${idx}`}
                                                className="text-xs text-red-700 bg-red-50 p-2 rounded mb-1"
                                            >
                                                <strong>{r.nombre}:</strong>
                                                {" "}
                                                {r.error}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-gray-200 flex justify-between">
                    <button
                        onClick={onClose}
                        disabled={importing}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cerrar
                    </button>

                    <div className="flex gap-2">
                        {results.length > 0 && (
                            <button
                                onClick={handleDownloadReport}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                <DocumentArrowDownIcon className="h-5 w-5" />
                                Descargar Reporte
                            </button>
                        )}

                        <button
                            onClick={handleImport}
                            disabled={!file || importing}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ArrowUpTrayIcon className="h-5 w-5" />
                            {importing
                                ? "Importando..."
                                : "Iniciar Importación"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
