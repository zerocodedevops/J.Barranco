import { useEffect, useState } from "react";
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    sendPasswordResetEmail,
    updateEmail,
    updatePassword,
    User,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase/config";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

export interface ClientSettingsFormData {
    email: string;
    telefono: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export function useClientSettings() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<ClientSettingsFormData>({
        email: "",
        telefono: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                email: user.email || "",
                telefono: user.telefono || "",
            }));

            if (!user.telefono) {
                const fetchPhone = async () => {
                    try {
                        const uid = user.firestoreId || user.uid;
                        const docRef = doc(db, "clientes", uid);
                        const docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            setFormData((prev) => ({
                                ...prev,
                                telefono: docSnap.data().telefono || "",
                            }));
                        }
                    } catch (e) {
                        console.error("Error fetching phone:", e);
                    }
                };
                fetchPhone();
            }
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const reauthenticate = async (currentPass: string) => {
        const currentUser = auth.currentUser;
        if (!currentUser || !currentPass || !currentUser.email) return false;

        try {
            const credential = EmailAuthProvider.credential(
                currentUser.email,
                currentPass,
            );
            await reauthenticateWithCredential(currentUser, credential);
            return true;
        } catch (error) {
            console.error("Error reauthenticating:", error);
            return false;
        }
    };

    const updateEmailLogic = async (currentUser: User) => {
        const emailChanged = formData.email !== currentUser.email;
        if (emailChanged) {
            if (!formData.currentPassword) {
                toast.error(
                    "Para cambiar el email, introduce tu contraseña actual",
                );
                return false;
            }
            const isAuth = await reauthenticate(formData.currentPassword);
            if (!isAuth) {
                toast.error(
                    "Contraseña incorrecta. No se puede actualizar email.",
                );
                return false;
            }
            await updateEmail(currentUser, formData.email);
        }
        return true;
    };

    const updatePasswordLogic = async (
        currentUser: User,
        emailChanged: boolean,
    ) => {
        if (!formData.newPassword) return true;

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Las nuevas contraseñas no coinciden");
            return false;
        }
        if (formData.newPassword.length < 6) {
            toast.error("La contraseña debe tener al menos 6 caracteres");
            return false;
        }

        // Si no cambiamos email (que ya re-autenticó), necesitamos re-autenticar aquí
        if (!emailChanged) {
            if (!formData.currentPassword) {
                toast.error("Para cambiar la contraseña, introduce la actual");
                return false;
            }
            const isAuth = await reauthenticate(formData.currentPassword);
            if (!isAuth) {
                toast.error("Contraseña actual incorrecta");
                return false;
            }
        }

        await updatePassword(currentUser, formData.newPassword);
        toast.success("Contraseña actualizada");
        setFormData((prev) => ({
            ...prev,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        }));
        return true;
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const currentUser = auth.currentUser;

        if (!currentUser || !user) {
            toast.error("No hay sesión activa");
            setLoading(false);
            return;
        }

        try {
            const emailSuccess = await updateEmailLogic(currentUser);
            if (!emailSuccess) {
                setLoading(false);
                return;
            }

            const uid = user.firestoreId || user.uid;
            const updates = {
                email: formData.email,
                telefono: formData.telefono,
            };

            await updateDoc(doc(db, "clientes", uid), updates);
            try {
                await updateDoc(doc(db, "usuarios", uid), updates);
            } catch {
                // Ignore
            }

            toast.success("Perfil actualizado correctamente");

            const passSuccess = await updatePasswordLogic(
                currentUser,
                formData.email !== currentUser.email,
            );

            // Just usage to avoid unused var warning if lint is strict, but logically ok.
            if (!passSuccess) {
                // Already handled alerts inside
            }
        } catch (error: unknown) {
            const err = error as { code?: string; message?: string };
            if (err.code === "auth/requires-recent-login") {
                toast.error("Por seguridad, cierra sesión y vuelve a entrar");
            } else if (err.code === "auth/email-already-in-use") {
                toast.error("Ese correo ya está en uso");
            } else {
                toast.error("Error: " + (err.message || "Desconocido"));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!formData.email) {
            toast.error("No hay email registrado.");
            return;
        }
        if (globalThis.confirm(`¿Enviar correo a ${formData.email}?`)) {
            try {
                await sendPasswordResetEmail(auth, formData.email);
                toast.success("Correo enviado.");
            } catch (error) {
                console.error(error);
                toast.error("Error al enviar correo.");
            }
        }
    };

    return {
        formData,
        loading,
        handleChange,
        handleUpdateProfile,
        handleResetPassword,
    };
}
