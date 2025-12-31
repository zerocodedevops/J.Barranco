import { useState } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { sanitizeUserInput } from "../../../../utils/sanitize";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../../../firebase/config";

export interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    message: string;
    consent: boolean;
}

export function useContactForm() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        phone: "",
        message: "",
        consent: false,
    });
    const [sending, setSending] = useState<boolean>(false);
    const { executeRecaptcha } = useGoogleReCaptcha();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ): void => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCheckboxChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.checked,
        });
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();

        // Validación básica
        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Por favor, completa todos los campos obligatorios");
            return;
        }

        // Validación de email mejorada
        if (!validateEmail(formData.email)) {
            toast.error("Por favor, introduce un email válido");
            return;
        }

        // Validación de consentimiento GDPR
        if (!formData.consent) {
            toast.error(
                "Debes aceptar la Política de Privacidad para continuar",
            );
            return;
        }

        // Validar reCAPTCHA v3
        if (!executeRecaptcha) {
            toast.error(
                "reCAPTCHA no está listo. Por favor, recarga la página.",
            );
            return;
        }

        setSending(true);

        try {
            // Ejecutar reCAPTCHA v3
            const token = await executeRecaptcha("contact_form");

            // Sanitizar contenido del mensaje para prevenir XSS
            const sanitizedMessage = sanitizeUserInput(formData.message);

            // 1. Enviar con EmailJS
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    phone: formData.phone,
                    message: sanitizedMessage,
                    to_email: "administracion@jbarrancolimpieza.com",
                    "g-recaptcha-response": token,
                },
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
            );

            // 2. Guardar en Firestore para Notificaciones Admin
            await addDoc(collection(db, "comunicaciones"), {
                nombre: formData.name,
                email: formData.email,
                telefono: formData.phone,
                asunto: `Mensaje Web: ${formData.name}`,
                mensaje: sanitizedMessage,
                fechaCreacion: Timestamp.now(),
                estado: "recibido", // Importante para useNotifications
                tipo: "contacto_web",
                origen: "web",
                leido: false,
            });

            toast.success("¡Mensaje enviado! Te contactaremos pronto.", {
                duration: 5000,
                icon: "✅",
                style: {
                    background: "#10b981",
                    color: "#fff",
                },
            });

            // Limpiar formulario
            setFormData({
                name: "",
                email: "",
                phone: "",
                message: "",
                consent: false,
            });
        } catch (error) {
            console.error("Error sending message:", error);

            // Fallback: mostrar error genérico
            toast.error(
                "Error al enviar. Por favor intenta más tarde o contacta directo a: administracion@jbarrancolimpieza.com",
                { duration: 5000 },
            );
        } finally {
            setSending(false);
        }
    };

    return {
        formData,
        sending,
        handleChange,
        handleCheckboxChange,
        handleSubmit,
    };
}
