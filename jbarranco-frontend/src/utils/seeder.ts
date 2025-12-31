import { db } from "../firebase/config";
import { addDoc, collection, Timestamp } from "firebase/firestore";

const getRandom = (max = 1) => {
    const crypto = globalThis.crypto;
    if (!crypto) {
        // Fallback simple por si falla entorno
        // eslint-disable-next-line sonarjs/pseudo-random
        return Math.random() * max;
    }
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    // Access array safely
    return ((array[0] ?? 0) / (0xffffffff + 1)) * max;
};

const CLIENT_NAMES = [
    "Comunidad Las Encinas",
    "Edificio Panorama",
    "Residencial Jardines del Sur",
    "Oficinas Centrales Tech",
    "Comunidad Los Rosales",
    "Torre Picasso Business",
    "Urbanización El Bosque",
    "Centro Comercial Plaza",
    "Comunidad Mirador",
    "Edificio Innova",
];

const EMPLOYEES = [
    "Juan Pérez",
    "María García",
    "Carlos López",
    "Ana Martínez",
];

export const seedDatabase = async () => {
    try {
        console.log("🌱 Iniciando Seed...");
        const clientsRef = collection(db, "clientes");
        const tasksRef = collection(db, "trabajos");

        const createdClientIds: string[] = [];

        // 1. Crear 10 Clientes Ficticios
        for (const name of CLIENT_NAMES) {
            const docRef = await addDoc(clientsRef, {
                nombre: name,
                direccion: "Calle Falsa 123",
                ciudad: "Madrid",
                telefono: "600000000",
                email: `contacto@${name.replaceAll(" ", "").toLowerCase()}.com`,
                fechaRegistro: Timestamp.now(),
                valorContrato: Math.floor(getRandom(500)) + 200,
            });
            createdClientIds.push(docRef.id);
            console.log(`✅ Cliente creado: ${name}`);
        }

        // 2. Generar Trabajos para la semana del 15 al 19 de Diciembre 2025
        // Fechas: 15 (Lun), 16 (Mar), 17 (Mié), 18 (Jue), 19 (Vie)
        const startDay = 15;
        const year = 2025;
        const month = 11; // Diciembre es 11 en JS (0-indexed)

        // Map para controlar frecuencia semanal por cliente (Max 3)
        const weeklyCount: Record<number, number> = {};
        createdClientIds.forEach((_, index) => (weeklyCount[index] = 0));

        for (let i = 0; i < 5; i++) {
            // 5 días laborables
            const currentDay = startDay + i;

            // Seleccionar clientes para hoy
            // Aleatoriedad controlada: Intentar llenar el día con clientes que tengan < 3 turnos
            const availableClients = createdClientIds
                .map((id, index) => ({
                    id,
                    index,
                    name: CLIENT_NAMES[index],
                }))
                .filter((c) => (weeklyCount[c.index] || 0) < 3);

            // Mezclar y coger subset. Usamos copia para sort
            const dailyClients = [...availableClients]
                .sort(() => 0.5 - getRandom())
                .slice(0, 8);

            for (const client of dailyClients) {
                // Incrementar contador semanal
                weeklyCount[client.index] = (weeklyCount[client.index] || 0) +
                    1;

                // Crear Trabajo
                // Duración 2 horas, inicio aleatorio entre 8:00 y 16:00
                const startHour = 8 + Math.floor(getRandom(8));
                const startTime = new Date(
                    year,
                    month,
                    currentDay,
                    startHour,
                    0,
                    0,
                );
                const endTime = new Date(startTime);
                endTime.setHours(startTime.getHours() + 2);

                await addDoc(tasksRef, {
                    clienteId: client.id,
                    clienteNombre: client.name,
                    empleadoId: "dummy_employee", // No importa mucho para la foto visual
                    empleadoNombre:
                        EMPLOYEES[Math.floor(getRandom(EMPLOYEES.length))],
                    descripcion: "Limpieza General Recurrente",
                    estado: getRandom() > 0.5 ? "completado" : "pendiente",
                    tipo: "normal",
                    fecha: Timestamp.fromDate(startTime),
                    fechaCompleta: Timestamp.fromDate(endTime),
                    creadoPor: "admin_seed",
                });
                console.log(
                    `📅 Trabajo creado: ${client.name} para el día ${currentDay}`,
                );
            }
        }

        alert("✅ Seed completado con éxito. Revisa el calendario.");
    } catch (error) {
        console.error("Error seeding:", error);
        alert("❌ Error al ejecutar seed. Revisa consola.");
    }
};
