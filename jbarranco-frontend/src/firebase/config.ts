// Importa las funciones que necesitas de los SDKs de Firebase
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import {
    Firestore,
    initializeFirestore,
    persistentLocalCache,
} from "firebase/firestore";

// Interfaz para la configuración de Firebase
interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
}

// Tu configuración de Firebase, usando las variables de entorno de VITE
const firebaseConfig: FirebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey) {
    console.error(
        "[Firebase Config] API Key is missing! Check .env file and server restart.",
    );
}

// Inicializa Firebase
export const app: FirebaseApp = initializeApp(firebaseConfig);

// Inicializa los servicios y expórtalos
export const auth: Auth = getAuth(app);

// Firestore con persistencia habilitada (PWA Offline)
export const db: Firestore = initializeFirestore(app, {
    localCache: persistentLocalCache(),
});
