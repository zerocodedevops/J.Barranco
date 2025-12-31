import { useState } from "react";
import toast from "react-hot-toast";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import {
  generateBudget,
  generateInvoice,
  generateJobReport,
} from "../../../services/pdfService";
import { getNextDocumentNumber } from "../../../services/counterService";

import { Cliente, Empleado } from "../../../types";

function DocumentGenerator(
  { clients, employees = [], loading }: {
    readonly clients: Cliente[];
    readonly employees?: Empleado[];
    readonly loading: boolean;
  },
) {
  const [selectedClient, setSelectedClient] = useState("");
  const [documentType, setDocumentType] = useState("budget");
  const [formData, setFormData] = useState({
    descripcion: "",
    precio: "",
    tipo: "Limpieza general",
    invoiceNumber: "", // Start: Deprecated but kept for compatibility just in case
    estado: "completado",
    empleado: "",
    observaciones: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    const client = clients.find((c) => c.id === selectedClient);
    if (!client) {
      toast.error("Por favor, selecciona un cliente");
      return;
    }

    if (!formData.precio || !formData.descripcion) {
      toast.error("Por favor, completa todos los campos obligatorios");
      return;
    }

    const toastId = toast.loading("Generando documento...");

    try {
      // Obtener siguiente número correlativo desde Firestore
      // documentType key matches the counter service keys
      const docNumber = await getNextDocumentNumber(
        documentType as "budget" | "invoice" | "report",
      );

      const clientData = {
        nombre: client.nombre,
        direccion: client.direccion,
        nombreContacto: client.nombreContacto,
        telefono: client.telefono,
        cif: client.cif || "N/A",
      };

      const jobData = {
        tipo: formData.tipo,
        descripcion: formData.descripcion,
        precio: Number.parseFloat(formData.precio),
        estado: formData.estado,
        empleado: formData.empleado,
        observaciones: formData.observaciones,
        comunidad: client.nombre,
      };

      let docName = "";
      switch (documentType) {
        case "budget":
          generateBudget(clientData, jobData, docNumber);
          docName = `Presupuesto ${docNumber}`;
          break;
        case "invoice":
          generateInvoice(clientData, jobData, docNumber);
          docName = `Factura ${docNumber}`;
          break;
        case "report":
          generateJobReport(jobData, docNumber);
          docName = `Informe ${docNumber}`;
          break;
      }

      toast.success(`${docName} generado con éxito`, { id: toastId });

      // Reset form (parcial)
      setFormData((prev) => ({
        ...prev,
        descripcion: "",
        precio: "",
        observaciones: "",
      }));
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error al generar el documento", { id: toastId });
    }
  };

  const getButtonLabel = () => {
    switch (documentType) {
      case "budget":
        return "Presupuesto";
      case "invoice":
        return "Factura";
      case "report":
        return "Informe";
      default:
        return "Documento";
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Generador de Documentos PDF
      </h2>

      <div className="bg-white p-6 rounded-lg shadow">
        {/* Selector de tipo de documento */}
        <div className="mb-6">
          <p className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Documento
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setDocumentType("budget")}
              className={`px-4 py-2 rounded-md ${
                documentType === "budget"
                  ? "bg-brand-blue text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Presupuesto
            </button>
            <button
              onClick={() => setDocumentType("invoice")}
              className={`px-4 py-2 rounded-md ${
                documentType === "invoice"
                  ? "bg-brand-blue text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Factura
            </button>
            <button
              onClick={() => setDocumentType("report")}
              className={`px-4 py-2 rounded-md ${
                documentType === "report"
                  ? "bg-brand-blue text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Informe de Trabajo
            </button>
          </div>
        </div>

        {/* Selector de cliente */}
        <div className="mb-4">
          <label
            htmlFor="client"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Cliente *
          </label>
          <select
            id="client"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
            disabled={loading}
          >
            <option value="">Selecciona un cliente...</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Formulario dinámico según tipo */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="tipo"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tipo de Servicio *
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option>Limpieza general</option>
              <option>Limpieza profunda</option>
              <option>Mantenimiento</option>
              <option>Desinfección</option>
              <option>Cristales</option>
              <option>Abrillantado</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="descripcion"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Descripción *
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Descripción detallada del servicio..."
            />
          </div>

          <div>
            <label
              htmlFor="precio"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Precio (€) *
            </label>
            <input
              type="number"
              id="precio"
              name="precio"
              value={formData.precio}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="0.00"
            />
          </div>

          {documentType === "invoice" && (
            <div>
              <label
                htmlFor="invoiceNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Número de Factura (opcional)
              </label>
              <input
                type="text"
                id="invoiceNumber"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="FAC-001"
              />
            </div>
          )}

          {documentType === "report" && (
            <>
              <div>
                <label
                  htmlFor="empleado"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Empleado Asignado
                </label>
                <select
                  id="empleado"
                  name="empleado"
                  value={formData.empleado}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="">Selecciona un empleado...</option>
                  {employees.map((emp) => (
                    <option
                      key={emp.id}
                      value={`${emp.nombre} ${emp.apellidos}`}
                    >
                      {emp.nombre} {emp.apellidos}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="observaciones"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Observaciones
                </label>
                <textarea
                  id="observaciones"
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Observaciones del trabajo realizado..."
                />
              </div>
            </>
          )}
        </div>

        {/* Botón generar */}
        <div className="mt-6">
          <button
            onClick={handleGenerate}
            className="w-full bg-brand-blue text-white px-6 py-3 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 font-medium transition-colors"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
            Generar {getButtonLabel()}
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          * Campos obligatorios
        </p>
      </div>
    </div>
  );
}

export default DocumentGenerator;
