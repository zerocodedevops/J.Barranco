import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Ticket, TicketType } from "../../../types";
import { createTicket } from "../../../services/ticketService";
import toast from "react-hot-toast";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { db } from "../../../firebase/config";

export interface TicketFormState {
    subject: string;
    message: string;
    type: TicketType;
}

export function useClientRequests() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"abierto" | "cerrado">(
        "abierto",
    );
    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formState, setFormState] = useState<TicketFormState>({
        subject: "",
        message: "",
        type: "averia",
    });

    useEffect(() => {
        if (!user?.uid) return;

        setLoading(true);

        const q = query(
            collection(db, "tickets"),
            where("clienteId", "==", user.uid),
            orderBy("fechaCreacion", "desc"),
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedTickets = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            } as Ticket));
            setTickets(fetchedTickets);
            setLoading(false);
        }, (error) => {
            console.error("Error listening to tickets:", error);
            toast.error("Error de conexión en tiempo real");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSubmitting(true);
        try {
            await createTicket({
                clienteId: user.uid,
                clienteNombre: user.nombre || "Cliente",
                tipo: formState.type,
                asunto: formState.subject,
                mensaje: formState.message,
                prioridad: "media",
            });

            toast.success("Ticket creado correctamente");
            setModalOpen(false);
            setFormState({
                subject: "",
                message: "",
                type: "averia",
            });
        } catch (error) {
            console.error("Error creating ticket:", error);
            toast.error("Error al crear el ticket");
        } finally {
            setSubmitting(false);
        }
    };

    const updateForm = (key: keyof TicketFormState, value: string) => {
        setFormState((prev) => ({ ...prev, [key]: value }));
    };

    const filteredTickets = tickets.filter((t) => {
        if (activeTab === "abierto") {
            return t.estado === "abierto" || t.estado === "en_progreso";
        } else {
            return t.estado === "resuelto" || t.estado === "cerrado";
        }
    });

    return {
        tickets: filteredTickets,
        allTickets: tickets, // In case needed
        loading,
        activeTab,
        modalOpen,
        submitting,
        formState,
        setActiveTab,
        setModalOpen,
        handleCreateTicket,
        updateForm,
    };
}
