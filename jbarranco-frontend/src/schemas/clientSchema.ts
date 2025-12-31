import * as z from "zod";

export const clientSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    cif: z.string().regex(
        /^[a-zA-Z0-9]{9}$/,
        "El CIF debe tener 9 caracteres (letras/números)",
    ),
    direccion: z.string().min(5, "La dirección es muy corta"),
    codigoPostal: z.string().regex(
        /^\d{5}$/,
        "El Código Postal debe tener 5 dígitos",
    ),
    ciudad: z.string().min(2, "La ciudad es obligatoria"),
    nombreContacto: z.string().min(2, "El nombre de contacto es obligatorio"),
    telefono: z.string().regex(
        /^\d{9,}$/,
        "El teléfono debe tener al menos 9 dígitos",
    ),
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().optional().refine((val) => !val || val.length >= 6, {
        message: "La contraseña debe tener al menos 6 caracteres",
    }),
    idUsuario: z.string().optional(),
    cuotaMensual: z.number().optional().default(0),
    // Contract
    diasContrato: z.array(z.coerce.number()).optional(),
    empleadoAsignadoId: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
