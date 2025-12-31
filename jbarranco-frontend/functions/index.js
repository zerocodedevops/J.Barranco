const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const { Timestamp } = require("firebase-admin/firestore");

admin.initializeApp();
const db = admin.firestore();

/**
 * Generación automática de facturas el día 1 de cada mes.
 * Recorre todos los clientes activos, calcula la cuota y genera un registro en 'facturas'.
 */
exports.generateMonthlyInvoices = onSchedule("0 0 1 * *", async (event) => {
    console.log("Iniciando generación automática de facturas para el mes actual...");
    
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    const currentYear = now.getFullYear();
    const invoiceDate = Timestamp.now();
    
    // Mes en texto (Español)
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const monthName = monthNames[currentMonth];

    try {
        // 1. Obtener clientes activos con cuota mensual
        const clientsSnap = await db.collection("clientes")
            .where("activo", "==", true)
            .get();

        if (clientsSnap.empty) {
            console.log("No hay clientes activos para facturar.");
            return;
        }

        const batch = db.batch();
        let count = 0;

        clientsSnap.forEach((doc) => {
            const client = doc.data();
            
            // Validar que tenga cuota definida
            if (!client.cuotaMensual || client.cuotaMensual <= 0) {
                console.log(`Cliente ${client.nombre} (ID: ${doc.id}) no tiene cuota mensual definida. Saltando.`);
                return;
            }

            // Crear referencia a nueva factura
            const invoiceRef = db.collection("facturas").doc();
            
            // Datos de la factura
            const invoiceData = {
                clienteId: doc.id,
                clienteNombre: client.nombreComercial || client.nombre,
                cif: client.cif || "N/A",
                direccion: client.direccion || "N/A",
                concepto: `Servicio de Limpieza - ${monthName} ${currentYear}`,
                baseImponible: client.cuotaMensual,
                iva: client.cuotaMensual * 0.21, // 21% IVA estándar
                total: client.cuotaMensual * 1.21,
                fechaEmision: invoiceDate,
                estado: "pendiente", // pendiente, pagada, enviada
                numeroFactura: `F-${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${doc.id.substring(0, 4).toUpperCase()}`, // Ejemplo de numeración
                creadoAutomaticamente: true,
                tipo: "mensual"
            };

            batch.set(invoiceRef, invoiceData);
            count++;
        });

        // Ejecutar batch
        if (count > 0) {
            await batch.commit();
            console.log(`✅ Se generaron ${count} facturas automáticamente para ${monthName} ${currentYear}.`);
        } else {
            console.log("⚠️ No se generó ninguna factura (posiblemente falta de cuotas definidas).");
        }

    } catch (error) {
        console.error("❌ Error fatal generando facturas:", error);
    }
});
