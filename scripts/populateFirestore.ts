// Script para poblar Firestore con datos de prueba
// Ejecutar con: npx ts-node scripts/populateFirestore.ts

import * as admin from "firebase-admin";
import serviceAccount from "../firebase-service-account.json"; // Necesitarás este archivo y "resolveJsonModule": true en tsconfig

// Inicializar Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
});

const db = admin.firestore();
const auth = admin.auth();

// Datos de ejemplo
const COMUNIDADES = [
    "Comunidad Residencial El Sol",
    "Residencial Vista Alegre",
    "Comunidad del Parque",
    "Edificio Torres Blancas",
    "Urbanización Los Olivos",
];

const TIPOS_SERVICIO = [
    "Limpieza general",
    "Limpieza profunda",
    "Abrillantado",
    "Cristales",
    "Desinfección",
    "Mantenimiento",
];

async function createUser(
    email: string,
    password: string,
    rol: string,
    additionalData: any,
) {
    try {
        // Crear usuario en Firebase Auth
        const userRecord = await auth.createUser({
            email,
            password,
            emailVerified: false,
        });

        // Crear documento en Firestore
        await db.collection("usuarios").doc(userRecord.uid).set({
            email,
            rol,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            ...additionalData,
        });

        console.log(`✅ Usuario creado: ${email} (${rol})`);
        return userRecord.uid;
    } catch (error: any) {
        if (error.code === "auth/email-already-exists") {
            console.log(`⚠️  Usuario ya existe: ${email}`);
            const userRecord = await auth.getUserByEmail(email);
            return userRecord.uid;
        }
        throw error;
    }
}

async function populateData() {
    console.log("🚀 Iniciando población de datos...\n");

    try {
        // 1. CREAR USUARIOS
        console.log("📝 Creando usuarios...");

        // Admin
        const adminId = await createUser(
            "admin@jbarranco.com",
            "admin123",
            "admin",
            { nombre: "Administrador", apellidos: "Sistema" },
        );

        // Clientes
        const clientsData = [
            {
                nombre: "Comunidad El Sol",
                direccion: "C/ Gran Vía, 23, Barcelona",
                nombreContacto: "Juan Pérez",
                telefono: "912345671",
                email: "elsol@example.com",
            },
            {
                nombre: "Vista Alegre",
                direccion: "Av de Libertad 12, Valencia",
                nombreContacto: "María García",
                telefono: "912345672",
                email: "vistaalegre@example.com",
            },
            {
                nombre: "Comunidad del Parque",
                direccion: "C/ Olmo 7, Sevilla",
                nombreContacto: "Carlos López",
                telefono: "912345673",
                email: "parque@example.com",
            },
            {
                nombre: "Torres Blancas",
                direccion: "Plaza Mayor 1, Madrid",
                nombreContacto: "Ana Martínez",
                telefono: "912345674",
                email: "torres@example.com",
            },
            {
                nombre: "Los Olivos",
                direccion: "Ronda Norte 45, Bilbao",
                nombreContacto: "Pedro Sánchez",
                telefono: "912345675",
                email: "olivos@example.com",
            },
        ];

        const clientIds: string[] = [];
        for (let i = 0; i < clientsData.length; i++) {
            const client = clientsData[i];
            const userId = await createUser(
                client.email,
                "cliente123",
                "cliente",
                {
                    nombre: client.nombre,
                    fcmToken: null,
                },
            );

            // Crear documento en clientes
            await db.collection("clientes").doc(userId).set({
                ...client,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            clientIds.push(userId);
        }

        // Empleados
        const employeesData = [
            {
                nombre: "Luis",
                apellidos: "Fernández",
                dni: "12345678A",
                telefono: "612345671",
                email: "luis@jbarranco.com",
            },
            {
                nombre: "Carmen",
                apellidos: "Ruiz",
                dni: "87654321B",
                telefono: "612345672",
                email: "carmen@jbarranco.com",
            },
            {
                nombre: "Miguel",
                apellidos: "Torres",
                dni: "11223344C",
                telefono: "612345673",
                email: "miguel@jbarranco.com",
            },
        ];

        const employeeIds: string[] = [];
        for (let i = 0; i < employeesData.length; i++) {
            const employee = employeesData[i];
            const userId = await createUser(
                employee.email,
                "empleado123",
                "empleado",
                {
                    nombre: employee.nombre,
                    apellidos: employee.apellidos,
                    fcmToken: null,
                },
            );

            // Crear documento en empleados
            await db.collection("empleados").doc(userId).set({
                ...employee,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            employeeIds.push(userId);
        }

        console.log("\n📦 Creando trabajos...");

        // 2. CREAR TRABAJOS
        const trabajos: any[] = [];
        const estados = ["pendiente", "en proceso", "completado"];

        for (let i = 0; i < 15; i++) {
            const estado = estados[Math.floor(Math.random() * estados.length)];
            const clientId =
                clientIds[Math.floor(Math.random() * clientIds.length)];
            const tipo =
                TIPOS_SERVICIO[
                    Math.floor(Math.random() * TIPOS_SERVICIO.length)
                ];
            const precio = Math.floor(Math.random() * 600) + 200; // 200-800€

            // Fecha aleatoria en los últimos 90 días
            const daysAgo = Math.floor(Math.random() * 90);
            const createdDate = new Date();
            createdDate.setDate(createdDate.getDate() - daysAgo);

            const trabajo = {
                idComunidad: clientId,
                tipo,
                descripcion: `${tipo} de zonas comunes`,
                estado,
                precio,
                createdAt: admin.firestore.Timestamp.fromDate(createdDate),
                empleadoAsignado: estado !== "pendiente"
                    ? employeeIds[
                        Math.floor(Math.random() * employeeIds.length)
                    ]
                    : null,
            };

            const ref = await db.collection("trabajos").add(trabajo);
            trabajos.push({ id: ref.id, ...trabajo });
            console.log(`✅ Trabajo creado: ${tipo} - ${estado}`);
        }

        console.log("\n⚠️  Creando quejas...");

        // 3. CREAR QUEJAS
        for (let i = 0; i < 8; i++) {
            const estado = i < 3 ? "resuelta" : "pendiente";
            const clientId =
                clientIds[Math.floor(Math.random() * clientIds.length)];

            await db.collection("quejas").add({
                idComunidad: clientId,
                descripcion: `Queja sobre la calidad del servicio #${i + 1}`,
                estado,
                fecha: admin.firestore.FieldValue.serverTimestamp(),
                respuesta: estado === "resuelta"
                    ? "Queja resuelta satisfactoriamente"
                    : null,
            });
            console.log(`✅ Queja creada: ${estado}`);
        }

        console.log("\n💬 Creando observaciones...");

        // 4. CREAR OBSERVACIONES
        for (let i = 0; i < 12; i++) {
            const clientId =
                clientIds[Math.floor(Math.random() * clientIds.length)];

            await db.collection("observaciones").add({
                idComunidad: clientId,
                descripcion: `Observación sobre el servicio #${i + 1}`,
                estado: Math.random() > 0.5 ? "nueva" : "vista",
                fecha: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log(`✅ Observación creada`);
        }

        console.log("\n➕ Creando solicitudes extra...");

        // 5. CREAR SOLICITUDES EXTRA
        const estadosSolicitud = ["aprobada", "pendiente", "rechazada"];
        for (let i = 0; i < 6; i++) {
            const estado =
                estadosSolicitud[
                    Math.floor(Math.random() * estadosSolicitud.length)
                ];
            const clientId =
                clientIds[Math.floor(Math.random() * clientIds.length)];

            await db.collection("solicitudesExtra").add({
                idComunidad: clientId,
                descripcion: `Solicitud de servicio extra #${i + 1}`,
                estado,
                fecha: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log(`✅ Solicitud creada: ${estado}`);
        }

        console.log("\n📋 Creando tareas...");

        // 6. CREAR TAREAS
        for (let i = 0; i < 20; i++) {
            const clientId =
                clientIds[Math.floor(Math.random() * clientIds.length)];
            const employeeId =
                employeeIds[Math.floor(Math.random() * employeeIds.length)];
            const completado = Math.random() > 0.6;

            await db.collection("tareas").add({
                idComunidad: clientId,
                idEmpleado: employeeId,
                descripcion: `Tarea de ${
                    TIPOS_SERVICIO[
                        Math.floor(Math.random() * TIPOS_SERVICIO.length)
                    ]
                }`,
                estado: completado ? "completada" : "pendiente",
                fecha: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log(
                `✅ Tarea creada: ${completado ? "completada" : "pendiente"}`,
            );
        }

        console.log("\n✨ ¡Población de datos completada!\n");
        console.log("📊 Resumen:");
        console.log("  - 1 Admin");
        console.log("  - 5 Clientes");
        console.log("  - 3 Empleados");
        console.log("  - 15 Trabajos");
        console.log("  - 8 Quejas");
        console.log("  - 12 Observaciones");
        console.log("  - 6 Solicitudes Extra");
        console.log("  - 20 Tareas");
        console.log("\n🎉 Total: 70 registros creados\n");
    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        process.exit();
    }
}

// Ejecutar
populateData();
