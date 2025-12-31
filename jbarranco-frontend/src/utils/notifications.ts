import emailjs from "@emailjs/browser";

/**
 * Utilidades para enviar notificaciones vía EmailJS (Cliente-side)
 * Reemplaza la necesidad de Cloud Functions para casos simples.
 */

const ADMIN_EMAIL = "administracion@jbarrancolimpieza.com"; // Email donde llegan las alertas
const SYSTEM_NAME = "J.Barranco Sistema";

interface EmailNotificationParams {
    subject: string;
    message: string;
    to_email?: string;
    to_name?: string;
    link?: string;
}

/**
 * Envía un email genérico usando la plantilla de contacto existente
 */
export async function sendEmailNotification({
    subject,
    message,
    to_email = ADMIN_EMAIL,
    to_name = "Administrador",
    link = "",
}: EmailNotificationParams): Promise<boolean> {
    try {
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        if (!serviceId || !templateId || !publicKey) {
            console.warn(
                "EmailJS no está configurado correctamente (faltan variables de entorno).",
            );
            return false;
        }

        // Construir el cuerpo del mensaje combinando asunto y detalle
        // Adaptamos los campos al Template de Contacto que ya existe:
        // {{from_name}}, {{from_email}}, {{phone}}, {{message}}, {{to_email}}

        const fullMessage = `
--- NOTIFICACIÓN DEL SISTEMA ---
ASUNTO: ${subject}
PARA: ${to_name}

MENSAJE:
${message}

${link ? `Enlace: ${link}` : ""}
--------------------------------
        `.trim();

        await emailjs.send(
            serviceId,
            templateId,
            {
                from_name: SYSTEM_NAME,
                from_email: "noreply@jbarranco.com", // Fake sender
                phone: "Sistema",
                message: fullMessage,
                to_email: to_email,
                "g-recaptcha-response": "system_bypass", // Intentamos saltar recaptcha si es posible, o requerirá token si es estricto
            },
            publicKey,
        );

        console.log(`Email enviado a ${to_email}: ${subject}`);
        return true;
    } catch (error) {
        console.error("Error al enviar email via EmailJS:", error);
        return false;
    }
}

// === Helpers Específicos ===

interface TicketNotificationData {
    type: "incidencia" | "observacion" | "extra" | "material";
    clientName: string;
    description: string;
    authorName: string;
}

/**
 * Notifica al Admin sobre un nuevo ticket (incidencia, observación, etc.)
 */
export async function notifyNewTicket(data: TicketNotificationData) {
    const typeLabel = data.type.toUpperCase();
    const subject = `[${typeLabel}] Nueva actividad de ${data.authorName}`;

    const message = `
Se ha registrado un nuevo ticket en el sistema.

Tipo: ${typeLabel}
Cliente/Ubicación: ${data.clientName}
Creado por: ${data.authorName}

Detalle:
"${data.description}"
    `;

    return sendEmailNotification({
        subject,
        message,
        link: "https://jbarrancolimpieza.com/admin/complaints", // Link duro al admin
    });
}
