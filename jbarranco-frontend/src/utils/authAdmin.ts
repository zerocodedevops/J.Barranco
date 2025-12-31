import { getApp, getApps, initializeApp } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    signOut,
} from "firebase/auth";

// Recreamos la config para no importar la app principal y evitar conflictos
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Nombre único para la app secundaria
const SECONDARY_APP_NAME = "SecondaryAppForUserCreation";

export const createAuthUser = async (
    email: string,
    password: string,
): Promise<string> => {
    let secondaryApp;

    // Evitar crear multiples instancias si ya existe
    if (getApps().some((app) => app.name === SECONDARY_APP_NAME)) {
        secondaryApp = getApp(SECONDARY_APP_NAME);
    } else {
        secondaryApp = initializeApp(firebaseConfig, SECONDARY_APP_NAME);
    }

    const secondaryAuth = getAuth(secondaryApp);

    try {
        // 1. Crear usuario en la instancia secundaria
        const userCredential = await createUserWithEmailAndPassword(
            secondaryAuth,
            email,
            password,
        );
        const uid = userCredential.user.uid;

        // 2. Cerrar sesión INMEDIATAMENTE en la instancia secundaria para limpieza
        // (Esto NO afecta a la instancia principal 'auth' donde está el admin)
        await signOut(secondaryAuth);

        return uid;
    } catch (error: unknown) {
        console.error("Error creando usuario en Auth secundario:", error);
        // Mapear errores comunes de Firebase a mensajes legibles
        const err = error as { code?: string };
        if (err.code === "auth/email-already-in-use") {
            throw new Error(
                "El correo electrónico ya está en uso por otra cuenta.",
            );
        }
        if (err.code === "auth/weak-password") {
            throw new Error(
                "La contraseña es muy débil (mínimo 6 caracteres).",
            );
        }
        if (err.code === "auth/invalid-email") {
            throw new Error("El formato del correo electrónico no es válido.");
        }
        throw error;
    }
};
