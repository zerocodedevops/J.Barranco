import { z } from "zod";

export const jobSchema = z.object({
    clienteId: z.string().min(1, "Debes seleccionar un cliente"),
    descripcion: z.string().optional(),
});

export type JobSchema = z.infer<typeof jobSchema>;
