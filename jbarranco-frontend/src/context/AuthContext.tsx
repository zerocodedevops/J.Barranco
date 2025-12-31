import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    User as FirebaseUser,
    UserCredential,
} from "firebase/auth";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { Role } from "../types";

export interface AuthUser extends FirebaseUser {
    rol?: Role;
    nombre?: string;
    urlImagenPerfil?: string;
    firestoreId?: string;
    direccion?: string;
    telefono?: string;
    terminosAceptados?: boolean;
    fechaAceptacionTerminos?: { toDate: () => Date } | Date;
}

export interface AuthContextType {
    user: AuthUser | null;
    userRole: Role | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<UserCredential>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

declare global {
    interface Window {
        Cypress?: unknown;
        mockAuth?: (mockUser: AuthUser, mockRole: Role) => void;
        clearMockAuth?: () => void;
    }
}

export function AuthProvider({ children }: Readonly<AuthProviderProps>) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [userRole, setUserRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    // Ref para controlar si estamos usando un mock (solo para Cypress)
    const isMocking = useRef<boolean>(false);

    if (globalThis.window?.Cypress) {
        globalThis.window.mockAuth = (mockUser: AuthUser, mockRole: Role) => {
            isMocking.current = true;

            // Store in sessionStorage for persistence across navigations
            sessionStorage.setItem("cypressMockUser", JSON.stringify(mockUser));
            sessionStorage.setItem("cypressMockRole", mockRole);
            setUser(mockUser);
            setUserRole(mockRole);
            setLoading(false);
        };

        globalThis.window.clearMockAuth = () => {
            isMocking.current = false;
            sessionStorage.removeItem("cypressMockUser");
            sessionStorage.removeItem("cypressMockRole");
        };
    }

    useEffect(() => {
        // Check if we have mock data from Cypress
        if (globalThis.window?.Cypress) {
            const mockUser = sessionStorage.getItem("cypressMockUser");
            const mockRole = sessionStorage.getItem("cypressMockRole");
            if (mockUser && mockRole) {
                isMocking.current = true;
                setUser(JSON.parse(mockUser));
                setUserRole(mockRole as Role);
                setLoading(false);
                return () => undefined; // Don't set up Firebase listener
            }
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (isMocking.current) return;

            if (firebaseUser) {
                // Usuario autenticado, buscar su rol
                let foundUser = false;

                const findUserInCollections = async () => {
                    // 1. Primero intentar en la colección 'usuarios' (por UID)
                    try {
                        const userDoc = await getDoc(
                            doc(db, "usuarios", firebaseUser.uid),
                        );
                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            setUser(
                                { ...firebaseUser, ...userData } as AuthUser,
                            );
                            setUserRole(userData.rol as Role);
                            foundUser = true;
                            return; // Encontrado
                        }
                    } catch {
                        // Ignorar
                    }

                    // 2. Si no existe en usuarios, buscar en empleados por UID
                    try {
                        const employeesSnapshot = await getDoc(
                            doc(db, "empleados", firebaseUser.uid),
                        );
                        if (employeesSnapshot.exists()) {
                            setUser(
                                {
                                    ...firebaseUser,
                                    ...employeesSnapshot.data(),
                                } as AuthUser,
                            );
                            setUserRole("empleado");
                            foundUser = true;
                            return;
                        }
                    } catch {
                        // Ignorar
                    }

                    // 3. FALLBACK: Buscar en empleados por EMAIL
                    try {
                        const qEmployee = query(
                            collection(db, "empleados"),
                            where("email", "==", firebaseUser.email),
                        );
                        const employeeQuerySnapshot = await getDocs(qEmployee);

                        if (!employeeQuerySnapshot.empty) {
                            const doc = employeeQuerySnapshot.docs[0];
                            if (doc) {
                                const employeeData = doc.data();
                                setUser({
                                    ...firebaseUser,
                                    ...employeeData,
                                    firestoreId: doc.id,
                                } as AuthUser);
                                setUserRole("empleado");
                                foundUser = true;
                                return;
                            }
                        }
                    } catch {
                        // Ignorar
                    }

                    // 4. Buscar en clientes por UID
                    try {
                        const clientsSnapshot = await getDoc(
                            doc(db, "clientes", firebaseUser.uid),
                        );
                        if (clientsSnapshot.exists()) {
                            const clientData = clientsSnapshot.data();
                            const finalUser = {
                                ...firebaseUser,
                                ...clientData,
                            } as AuthUser;
                            setUser(finalUser);
                            setUserRole("cliente");
                            foundUser = true;
                            return;
                        }
                    } catch {
                        // Ignorar
                    }

                    // 5. FALLBACK: Buscar en clientes por EMAIL
                    try {
                        const qClient = query(
                            collection(db, "clientes"),
                            where("email", "==", firebaseUser.email),
                        );
                        const clientQuerySnapshot = await getDocs(qClient);

                        if (!clientQuerySnapshot.empty) {
                            const doc = clientQuerySnapshot.docs[0];
                            if (doc) {
                                const clientData = doc.data();
                                setUser({
                                    ...firebaseUser,
                                    ...clientData,
                                    firestoreId: doc.id,
                                } as AuthUser);
                                setUserRole("cliente");
                                foundUser = true;
                            }
                        }
                    } catch {
                        // Ignorar
                    }
                };

                await findUserInCollections();

                if (!foundUser) {
                    console.warn(
                        "AuthContext: Usuario no encontrado en ninguna colección. Cerrando sesión.",
                    );
                    await firebaseSignOut(auth);
                    setUser(null);
                    setUserRole(null);
                }
            } else {
                setUser(null);
                setUserRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = useCallback(async (
        email: string,
        password: string,
    ): Promise<UserCredential> => {
        try {
            const result = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );
            return result;
        } catch (error) {
            console.error("Error signing in:", error);
            throw error;
        }
    }, []);

    const signOut = useCallback(async (): Promise<void> => {
        try {
            await firebaseSignOut(auth);
            setUser(null);
            setUserRole(null);
        } catch (error) {
            console.error("Error signing out:", error);
            throw error;
        }
    }, []);

    const value = useMemo<AuthContextType>(() => ({
        user,
        userRole,
        loading,
        signIn,
        signOut,
    }), [user, userRole, loading, signIn, signOut]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
