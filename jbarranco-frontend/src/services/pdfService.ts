import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

// Tipos
interface ClientData {
  nombre: string;
  direccion?: string;
  cif?: string;
  nombreContacto?: string;
  telefono?: string;
}

interface JobData {
  tipo: string;
  descripcion: string;
  precio: number;
  estado?: string;
  empleado?: string;
  observaciones?: string;
  comunidad?: string;
}

// Configuración Base (Logo, Colores)
const COMPANY_INFO = {
  name: "J. Barranco Limpieza de Comunidades",
  address: "Calle Calahorra 34, 28032 Madrid",
  phone: "618507163 / 679958119",
  email: "administracion@jbarrancolimpieza.com",
  web: "jbarrancolimpieza.com",
  cif: "B-XXXXXXXX",
};

const COLOR_PRIMARY = [0, 51, 102] as [number, number, number]; // Azul oscuro

// Helper: Cargar Imagen a Base64 (Robusto con Fetch para evitar problemas CORS/Canvas)
const loadImage = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error cargando logo:", error);
    return "";
  }
};

// Helper: Cabecera Común (Async para cargar logo)
const addHeader = async (doc: jsPDF, title: string, docNumber?: string) => {
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;

  // Geometría
  const centerX = pageWidth / 2;
  const leftCenter = margin + (centerX - margin) / 2; // Centro del hueco izquierdo
  const rightCenter = centerX + (pageWidth - margin - centerX) / 2; // Centro del hueco derecho

  // Bloque Izquierdo (Logo + Nombre)
  // Nombre Empresa (Centrado en su hueco)
  doc.setFontSize(22);
  doc.setTextColor(0, 51, 102);
  doc.setFont("helvetica", "bold");
  doc.text("J. BARRANCO", leftCenter, 30, { align: "center" });

  // Logo Imagen (Centrado en su hueco)
  try {
    const logoBase64 = await loadImage("/logo-light.png");
    if (logoBase64) {
      const logoSize = 30;
      // X = Center - (Size/2)
      doc.addImage(
        logoBase64,
        "PNG",
        leftCenter - (logoSize / 2),
        35,
        logoSize,
        logoSize,
      );
    }
  } catch (e) {
    console.warn("No se pudo pintar el logo", e);
  }

  // Separador Vertical (Centrado exacto y gris)
  doc.setDrawColor(200, 200, 200); // Gris más suave
  doc.setLineWidth(0.5);
  doc.line(centerX, 25, centerX, 75);

  // Bloque Derecho (Info)

  // Título Equipo (Centrado en su hueco)
  doc.setFontSize(14);
  doc.setTextColor(0, 51, 102);
  doc.text("Equipo J.Barranco", rightCenter, 30, { align: "center" });

  // Subtítulo (Centrado en su hueco)
  doc.setFontSize(10);
  doc.setTextColor(0, 153, 204);
  doc.text("Limpieza de Comunidades", rightCenter, 35, { align: "center" });

  // Datos Contacto
  // "Alineados a la izquierda pero pegados al borde derecho de su hueco"
  // Calculamos una posición X fija desplazada a la derecha
  // Empezar en centerX + 12 centra mejor el bloque de texto (aprox 70mm ancho) en el hueco de 85mm.
  const contactStartX = centerX + 12;
  let yPos = 45;
  const lineHeight = 5;
  const labelWidth = 18;

  // Email
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 51, 102);
  doc.text("Email:", contactStartX, yPos);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text(COMPANY_INFO.email, contactStartX + labelWidth, yPos);
  yPos += lineHeight;

  // Teléfonos
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 51, 102);
  doc.text("Teléfonos:", contactStartX, yPos);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text(COMPANY_INFO.phone, contactStartX + labelWidth, yPos);
  yPos += lineHeight;

  // Dirección
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 51, 102);
  doc.text("Dirección:", contactStartX, yPos);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  // Dirección puede ser larga, ajustamos split si es necesario, o dejamos que corra
  doc.text(COMPANY_INFO.address, contactStartX + labelWidth, yPos);
  yPos += lineHeight;

  // Web
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 51, 102);
  doc.text("Web:", contactStartX, yPos);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 153, 204);
  doc.text(COMPANY_INFO.web, contactStartX + labelWidth, yPos);

  // Líneas Decorativas (Header y Separador inferior)
  doc.setDrawColor(0, 153, 204);
  doc.setLineWidth(1);
  doc.line(margin, 15, pageWidth - margin, 15); // Arriba

  doc.setLineWidth(0.5);
  doc.line(margin, 80, pageWidth - margin, 80); // Abajo

  // Título del Documento (Abajo)
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(title.toUpperCase(), 20, 90);

  if (docNumber) {
    doc.setFontSize(12);
    doc.setTextColor(100);
    // Alineado a la derecha completamente
    doc.text(`# ${docNumber}`, pageWidth - 20, 90, { align: "right" });
  }
};

// Helper: Datos Cliente
const addClientInfo = (doc: jsPDF, client: ClientData, yPos: number) => {
  doc.setFontSize(11);
  doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
  doc.text("CLIENTE:", 20, yPos);

  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(client.nombre, 20, yPos + 6);
  doc.text(client.direccion || "Dirección no disponible", 20, yPos + 11);
  doc.text(`CIF: ${client.cif || "N/A"}`, 20, yPos + 16);
  if (client.nombreContacto) {
    doc.text(`Att: ${client.nombreContacto}`, 20, yPos + 21);
  }
};

// Helper: Footer
const addFooter = (doc: jsPDF) => {
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    "Documento generado automáticamente por Sistema J. Barranco",
    20,
    pageHeight - 10,
  );
  doc.text(`Página 1 de 1`, doc.internal.pageSize.width - 20, pageHeight - 10, {
    align: "right",
  });
};

// 1. PRESUPUESTO
export const generateBudget = async (
  client: ClientData,
  job: JobData,
  docNumber: string,
) => {
  const doc = new jsPDF();
  await addHeader(doc, "Presupuesto", docNumber);
  const pageWidth = doc.internal.pageSize.width;

  addClientInfo(doc, client, 100); // Bajado Y

  // Datos derecha: Fecha y Validez
  doc.setFontSize(10);
  doc.setTextColor(0);

  // Alineado a la derecha
  doc.text(
    `Fecha Emisión: ${format(new Date(), "dd/MM/yyyy")}`,
    pageWidth - 20,
    100,
    { align: "right" },
  );
  doc.text(`Validez: 30 días`, pageWidth - 20, 105, { align: "right" });

  // Tabla
  const tableData = [
    [job.tipo, job.descripcion, `${job.precio.toFixed(2)}€`],
  ];

  autoTable(doc, {
    startY: 125, // Bajada la tabla
    margin: { left: 20, right: 20 },
    head: [["Concepto", "Descripción", "Importe"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: COLOR_PRIMARY },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
      2: { halign: "right", cellWidth: 30 },
    },
  });

  // Totales
  // Totales
  const finalY =
    (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 10;
  const iva = job.precio * 0.21;
  const total = job.precio + iva;

  doc.text(`Base Imponible:`, 140, finalY);
  doc.text(`${job.precio.toFixed(2)}€`, 190, finalY, { align: "right" });

  doc.text(`I.V.A. (21%):`, 140, finalY + 6);
  doc.text(`${iva.toFixed(2)}€`, 190, finalY + 6, { align: "right" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL:`, 140, finalY + 14);
  doc.text(`${total.toFixed(2)}€`, 190, finalY + 14, { align: "right" });

  // Firma
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Conformidad Cliente:", 20, finalY + 40);
  doc.line(20, finalY + 55, 80, finalY + 55);

  addFooter(doc);
  doc.save(`${docNumber}.pdf`);
};

// 2. FACTURA
export const generateInvoice = async (
  client: ClientData,
  job: JobData,
  docNumber: string,
) => {
  const doc = new jsPDF();
  await addHeader(doc, "Factura", docNumber);
  const pageWidth = doc.internal.pageSize.width;

  addClientInfo(doc, client, 100);

  // Datos derecha
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(
    `Fecha Emisión: ${format(new Date(), "dd/MM/yyyy")}`,
    pageWidth - 20,
    100,
    { align: "right" },
  );
  doc.text(
    `Vencimiento: ${format(new Date(), "dd/MM/yyyy")}`,
    pageWidth - 20,
    105,
    { align: "right" },
  );

  const tableData = [
    [
      job.tipo,
      job.descripcion,
      "1",
      `${job.precio.toFixed(2)}€`,
      `${job.precio.toFixed(2)}€`,
    ],
  ];

  autoTable(doc, {
    startY: 125, // Bajada la tabla
    margin: { left: 20, right: 20 },
    head: [["Item", "Descripción", "Cant.", "Precio Unit.", "Total"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: COLOR_PRIMARY },
    columnStyles: {
      3: { halign: "right" },
      4: { halign: "right" },
    },
  });

  const finalY =
    (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 10;
  const iva = job.precio * 0.21;
  const total = job.precio + iva;

  // Sección Totales
  doc.setFontSize(10);
  doc.text(`Base Imponible:`, 140, finalY);
  doc.text(`${job.precio.toFixed(2)}€`, 190, finalY, { align: "right" });

  doc.text(`I.V.A. (21%):`, 140, finalY + 6);
  doc.text(`${iva.toFixed(2)}€`, 190, finalY + 6, { align: "right" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL:`, 140, finalY + 14); // Corregido etiqueta
  doc.text(`${total.toFixed(2)}€`, 190, finalY + 14, { align: "right" });

  // Método pago
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Forma de Pago: Transferencia Bancaria", 20, finalY + 30);
  doc.text("IBAN: ES00 0000 0000 0000 0000 0000", 20, finalY + 35);

  addFooter(doc);
  doc.save(`${docNumber}.pdf`);
};

// 3. INFORME DE TRABAJO
export const generateJobReport = async (job: JobData, docNumber: string) => {
  const doc = new jsPDF();
  await addHeader(doc, "Informe de Trabajo", docNumber);

  doc.setFontSize(11);
  doc.text(`Cliente / Comunidad: ${job.comunidad}`, 20, 100);
  doc.text(
    `Fecha Realización: ${format(new Date(), "dd/MM/yyyy HH:mm")}`,
    20,
    106,
  );
  doc.text(`Técnico/Responsable: ${job.empleado || "No asignado"}`, 20, 112);
  doc.text(`Tipo de Servicio: ${job.tipo}`, 20, 118);

  // Checklist
  const checklist = [
    ["Limpieza de accesos y portal", "Realizado", "Sí"],
    ["Limpieza de ascensores (espejos, botonera)", "Realizado", "Sí"],
    ["Barrido y fregado de escaleras", "Realizado", "Sí"],
    ["Limpieza de cristales zonas comunes", "Realizado", "Sí"],
    ["Revisión de luces y bombillas", "Realizado", "No incidencia"],
    ["Olorización", "Realizado", "Sí"],
  ];

  autoTable(doc, {
    startY: 130, // Bajada la tabla
    margin: { left: 20, right: 20 },
    head: [["Tarea / Zona", "Estado", "Conformidad"]],
    body: checklist,
    theme: "striped",
    headStyles: { fillColor: COLOR_PRIMARY, textColor: 255 },
  });

  const finalY =
    (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 10;

  if (job.observaciones) {
    doc.setFont("helvetica", "bold");
    doc.text("Observaciones / Incidencias:", 20, finalY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(job.observaciones, 20, finalY + 6, { maxWidth: 170 });
  }

  // Firmas
  const signY = finalY + 30;
  doc.text("Firma Operario", 20, signY);
  doc.line(20, signY + 15, 70, signY + 15);

  doc.text("VºBº Cliente (Sello)", 120, signY);
  doc.line(120, signY + 15, 170, signY + 15);

  addFooter(doc);
  doc.save(`${docNumber}.pdf`);
};
