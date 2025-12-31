import { useCallback, useEffect, useState } from "react";
import {
    collection,
    doc,
    onSnapshot,
    query,
    where,
    writeBatch,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../../../firebase/config";
import { Ticket } from "../../../../types";
import { getAllTickets } from "../../../../services/ticketService";
import { deleteAllAutoObservations } from "../../../../services/cleanupService";
import { sortTickets } from "../../../../utils/ticketUtils";

export function useComplaintsList(allowedTypes?: string[]) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [sortConfig, setSortConfig] = useState<
        {
            key: string;
            direction: "asc" | "desc";
        } | null
    >({ key: "fecha", direction: "desc" });
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const fetchTickets = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllTickets();
            setTickets(data);
        } catch (error) {
            console.error("Error loading tickets:", error);
            toast.error("Error al cargar los tickets");
        } finally {
            setLoading(false);
        }
    }, []);

    // Listeners Real-time unificados
    useEffect(() => {
        let debounceTimer: ReturnType<typeof setTimeout>;

        const triggerRefresh = () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                fetchTickets();
            }, 500);
        };

        const unsubCom = onSnapshot(
            collection(db, "comunicaciones"),
            triggerRefresh,
        );
        const unsubTickets = onSnapshot(
            collection(db, "tickets"),
            triggerRefresh,
        );
        const unsubExtras = onSnapshot(
            collection(db, "extras"),
            triggerRefresh,
        );
        const unsubRepo = onSnapshot(
            collection(db, "reposicion"),
            triggerRefresh,
        );

        const qObs = query(
            collection(db, "trabajos"),
            where("observaciones", "!=", ""),
        );
        const unsubObs = onSnapshot(qObs, triggerRefresh);

        fetchTickets();

        return () => {
            unsubCom();
            unsubTickets();
            unsubExtras();
            unsubRepo();
            unsubObs();
            clearTimeout(debounceTimer);
        };
    }, [fetchTickets]);

    // Reset selection on filter change
    useEffect(() => {
        setSelectedIds(new Set());
    }, [filterType, searchTerm, allowedTypes]);

    const filteredTickets = sortTickets(
        tickets.filter((ticket) => {
            const lowerSearch = searchTerm.toLowerCase();
            const matchesSearch =
                (ticket.clienteNombre || "").toLowerCase().includes(
                    lowerSearch,
                ) ||
                (ticket.asunto || "").toLowerCase().includes(lowerSearch) ||
                (ticket.tipo || "").toLowerCase().includes(lowerSearch);

            const matchesAllowedType = allowedTypes
                ? allowedTypes.includes(ticket.tipo)
                : true;
            const matchesLocalFilter = filterType === "all" ||
                ticket.tipo === filterType;

            return matchesSearch && matchesAllowedType && matchesLocalFilter;
        }),
        sortConfig,
        allowedTypes,
    );

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allIds = new Set(filteredTickets.map((t) => t.id));
            setSelectedIds(allIds);
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectOne = (e: React.SyntheticEvent, id: string) => {
        e.stopPropagation();
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleBulkDelete = async () => {
        if (
            !globalThis.confirm(
                `¿Estás seguro de ELIMINAR ${selectedIds.size} elementos? Esta acción NO se puede deshacer.`,
            )
        ) return;

        try {
            setLoading(true);
            const batch = writeBatch(db);
            selectedIds.forEach((id) => {
                const ticket = tickets.find((t) => t.id === id);
                const collectionName = ticket?.origen || "tickets";
                const ref = doc(db, collectionName, id);
                batch.delete(ref);
            });
            await batch.commit();
            toast.success(`${selectedIds.size} elementos eliminados.`);
            setSelectedIds(new Set());
            fetchTickets();
        } catch (error) {
            console.error(error);
            toast.error("Error al eliminar.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAllObservations = async () => {
        if (
            !globalThis.confirm(
                "¿ATENCIÓN: Estás seguro de BORRAR TODAS las observaciones del sistema? Esto limpiará el texto de observación de todos los trabajos.",
            )
        ) return;
        try {
            setLoading(true);
            const count = await deleteAllAutoObservations();
            toast.success(`Eliminadas ${count} observaciones.`);
            fetchTickets();
        } catch (e) {
            console.error(e);
            toast.error("Error al eliminar todas.");
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (
            sortConfig?.key === key &&
            sortConfig?.direction === "asc"
        ) {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    return {
        tickets,
        filteredTickets,
        loading,
        searchTerm,
        setSearchTerm,
        filterType,
        setFilterType,
        selectedTicket,
        setSelectedTicket,
        sortConfig,
        selectedIds,
        fetchTickets,
        handleSelectAll,
        handleSelectOne,
        handleBulkDelete,
        handleDeleteAllObservations,
        handleSort,
    };
}
