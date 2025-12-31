import { useEffect, useState } from "react";
import {
    addDoc,
    collection,
    doc,
    DocumentData,
    getDoc,
    getDocs,
    query,
    Timestamp,
    where,
} from "firebase/firestore";
import { Cliente, MaterialRequest, RequestStatus } from "../../types";
import { auth, db } from "../../firebase/config";
import { format, startOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import toast from "react-hot-toast";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { subscribeToEmployeeRequests } from "../../services/requestsService";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSafeDate = (date: any): Date => {
    if (!date) return new Date();
    if (typeof date.toDate === "function") return date.toDate();
    return new Date(date);
};

export default function EmployeeInventory() {
    const [clients, setClients] = useState<Cliente[]>([]);
    const [products, setProducts] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [myRequests, setMyRequests] = useState<MaterialRequest[]>([]);

    const [formData, setFormData] = useState({
        clienteId: "",
        producto: "",
        cantidad: 1,
        observaciones: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const user = auth.currentUser;
                // Fix: Ensure we return if no user, preventing further execution issues if any
                if (!user) {
                    setLoading(false);
                    return undefined;
                }

                // 1. Obtener productos del inventario general
                const inventorySnapshot = await getDocs(
                    collection(db, "inventario"),
                );
                const inventoryList = inventorySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProducts(inventoryList);

                // 2. Obtener clientes asignados este mes
                const start = startOfMonth(new Date());

                const qTrabajos = query(
                    collection(db, "trabajos"),
                    where("empleadoId", "==", user.uid),
                );

                const trabajosSnapshot = await getDocs(qTrabajos);
                const trabajos = trabajosSnapshot.docs.map((doc) => doc.data());

                const currentMonthJobs = trabajos.filter((t: DocumentData) => {
                    let jobDate;
                    if (t.fecha?.toDate) {
                        jobDate = t.fecha.toDate();
                    } else {
                        jobDate = new Date(t.fecha);
                    }
                    return jobDate >= start;
                });

                const clientIds = new Set(
                    currentMonthJobs.map((t: DocumentData) => t.clienteId)
                        .filter(Boolean),
                );

                if (clientIds.size > 0) {
                    const clientsPromises = Array.from(clientIds).map(
                        (clientId) =>
                            getDoc(doc(db, "clientes", clientId as string)),
                    );

                    const clientsSnapshots = await Promise.all(clientsPromises);

                    const myClients = clientsSnapshots
                        .filter((snap) => snap.exists())
                        .map(
                            (snap) => ({
                                id: snap.id,
                                ...snap.data(),
                            } as Cliente),
                        );

                    setClients(myClients);
                } else {
                    setClients([]);
                }

                // 3. Load requests via subscription
                // Fix: Return the unsubscribe function for cleanup
                return subscribeToEmployeeRequests(
                    user.uid,
                    (data) => {
                        setMyRequests(data);
                    },
                );
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Error al cargar datos");
                return undefined;
            } finally {
                setLoading(false);
            }
        };

        // Fix: Properly handle the async result which might be an unsub function
        let unsubscribe: (() => void) | undefined;
        fetchData().then((unsub) => {
            if (typeof unsub === "function") {
                unsubscribe = unsub;
            }
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.clienteId || !formData.producto) {
            toast.error("Selecciona cliente y producto");
            return;
        }

        try {
            const user = auth.currentUser;
            const selectedClient = clients.find((c) =>
                c.id === formData.clienteId
            );

            await addDoc(collection(db, "reposicion"), {
                empleadoId: user?.uid,
                empleadoEmail: user?.email,
                clienteId: formData.clienteId, // Cliente destino
                clienteNombre: selectedClient?.nombreComercial ||
                    selectedClient?.nombre || "Cliente desconocido",
                empleadoNombre: user?.displayName || "Empleado",
                producto: formData.producto,
                cantidad: Number(formData.cantidad),
                estado: "pendiente",
                fecha: Timestamp.now(), // Match Admin expectation
                fechaSolicitud: Timestamp.now(), // Keep for record
                comentarios: formData.observaciones, // Match Admin expectation
                observaciones: formData.observaciones,
            });

            toast.success("Solicitud enviada correctamente");
            setFormData((prev) => ({
                ...prev,
                cantidad: 1,
                observaciones: "",
            }));
        } catch (error) {
            console.error("Error sending request:", error);
            toast.error("Error al enviar solicitud");
        }
    };

    const getStatusColor = (status: RequestStatus) => {
        switch (status) {
            case "aprobada":
                return "text-green-600 bg-green-50 border-green-200";
            case "rechazada":
                return "text-red-600 bg-red-50 border-red-200";
            default:
                return "text-yellow-600 bg-yellow-50 border-yellow-200";
        }
    };

    if (loading) return <div className="text-center p-4">Cargando...</div>;

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Solicitar Material
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    Pide reposición de productos para tus clientes asignados.
                </p>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="clienteId"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Cliente *
                            </label>
                            <select
                                id="clienteId"
                                value={formData.clienteId}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        clienteId: e.target.value,
                                    })}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                                required
                            >
                                <option value="">
                                    -- Seleccionar Cliente --
                                </option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.nombreComercial ||
                                            client.nombre}
                                    </option>
                                ))}
                            </select>
                            {clients.length === 0 && (
                                <p className="text-xs text-orange-500 mt-1">
                                    No tienes clientes asignados este mes.
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="producto"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Producto *
                            </label>
                            <select
                                id="producto"
                                value={formData.producto}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        producto: e.target.value,
                                    })}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                                required
                            >
                                <option value="">
                                    -- Seleccionar Producto --
                                </option>
                                {products.map((prod) => (
                                    <option key={prod.id} value={prod.producto}>
                                        {prod.producto}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="cantidad"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Cantidad *
                            </label>
                            <input
                                id="cantidad"
                                type="number"
                                min="1"
                                value={formData.cantidad}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        cantidad: Number(e.target.value),
                                    })}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="observaciones"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Observaciones
                            </label>
                            <textarea
                                id="observaciones"
                                value={formData.observaciones}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        observaciones: e.target.value,
                                    })}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                                rows={2}
                                placeholder="Detalles adicionales..."
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full flex justify-center items-center gap-2 bg-brand-blue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                            >
                                <PaperAirplaneIcon className="h-5 w-5" />
                                Enviar Solicitud
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {myRequests.length > 0 && (
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Mis Solicitudes
                    </h3>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            {myRequests.map((req) => (
                                <li
                                    key={req.id}
                                    className="p-4 hover:bg-gray-50"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {req.producto}{" "}
                                                <span className="text-gray-500 font-normal">
                                                    x{req.cantidad}
                                                </span>
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {req.clienteNombre}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {req.fechaSolicitud && format(
                                                    getSafeDate(
                                                        req.fechaSolicitud,
                                                    ),
                                                    "d MMM HH:mm",
                                                    { locale: es },
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={`inline-block px-2 py-1 text-xs font-semibold rounded-full border ${
                                                    getStatusColor(req.estado)
                                                }`}
                                            >
                                                {req.estado.charAt(0)
                                                    .toUpperCase() +
                                                    req.estado.slice(1)}
                                            </span>
                                            {req.motivoRechazo && (
                                                <p className="text-xs text-red-500 mt-1 max-w-[150px]">
                                                    {req.motivoRechazo}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}
        </div>
    );
}
