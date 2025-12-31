import { z } from "zod";

export const employeeSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    apellidos: z.string().min(
        2,
        "Los apellidos deben tener al menos 2 caracteres",
    ),
    dni: z.string().regex(
        /^(\d{8}[A-Za-z]|[XYZxyz]\d{7}[A-Za-z])$/,
        { message: "Introduzca un DNI o NIE válido (ej: 12345678A)" },
    ),
    telefono: z.string().regex(
        /^\d{9,}$/,
        { message: "El teléfono debe tener al menos 9 dígitos" },
    ),
    email: z.string().email(),
    fechaContratacion: z.string().min(
        1,
        "La fecha de contratación es obligatoria",
    ),
    especialidad: z.string().optional(),
    password: z.string().optional().refine((val) => !val || val.length >= 6, {
        message: "La contraseña debe tener al menos 6 caracteres",
    }),
    idUsuario: z.string().optional(),
    costeHora: z.number().optional().default(0),
    horasMensuales: z.number().optional().default(160),
    activo: z.boolean().default(true),
});

export type EmployeeFormInputs = z.infer<typeof employeeSchema>;
