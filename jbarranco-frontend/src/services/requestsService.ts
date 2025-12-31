import {
    addDoc,
    collection,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    runTransaction,
    Timestamp,
    Unsubscribe,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { ItemInventario, MaterialRequest } from "../types";

const REQUESTS_COLLECTION = "solicitudes_material";
const INVENTORY_COLLECTION = "inventario";
const CLIENT_STOCK_COLLECTION = "stock_clientes";

export const getPendingRequests = async (): Promise<MaterialRequest[]> => {
    try {
        const q = query(
            collection(db, REQUESTS_COLLECTION),
            where("estado", "==", "pendiente"),
            orderBy("fechaSolicitud", "asc"),
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(
            (d) => ({ id: d.id, ...d.data() } as MaterialRequest),
        );
    } catch (error) {
        console.error("Error fetching pending requests:", error);
        throw error;
    }
};

export const subscribeToPendingRequests = (
    callback: (requests: MaterialRequest[]) => void,
): Unsubscribe => {
    const q = query(
        collection(db, REQUESTS_COLLECTION),
        where("estado", "==", "pendiente"),
        orderBy("fechaSolicitud", "asc"),
    );

    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(
            (d) => ({ id: d.id, ...d.data() } as MaterialRequest),
        );
        callback(data);
    }, (error) => {
        console.error("Error subscribing to pending requests:", error);
    });
};

export const getRequestsHistory = async (): Promise<MaterialRequest[]> => {
    try {
        const q = query(
            collection(db, REQUESTS_COLLECTION),
            orderBy("fechaSolicitud", "desc"),
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(
            (d) => ({ id: d.id, ...d.data() } as MaterialRequest),
        );
    } catch (error) {
        console.error("Error fetching requests history:", error);
        throw error;
    }
};

export const subscribeToRequestsHistory = (
    callback: (requests: MaterialRequest[]) => void,
): Unsubscribe => {
    const q = query(
        collection(db, REQUESTS_COLLECTION),
        orderBy("fechaSolicitud", "desc"),
    );

    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(
            (d) => ({ id: d.id, ...d.data() } as MaterialRequest),
        );
        callback(data);
    }, (error) => {
        console.error("Error subscribing to requests history:", error);
    });
};

export const createRequest = async (
    request: Omit<MaterialRequest, "id" | "estado" | "fechaSolicitud">,
): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, REQUESTS_COLLECTION), {
            ...request,
            estado: "pendiente",
            fechaSolicitud: Timestamp.now(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating request:", error);
        throw error;
    }
};

export const subscribeToEmployeeRequests = (
    employeeId: string,
    callback: (requests: MaterialRequest[]) => void,
): Unsubscribe => {
    const q = query(
        collection(db, REQUESTS_COLLECTION),
        where("empleadoId", "==", employeeId),
        orderBy("fechaSolicitud", "desc"),
    );

    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(
            (d) => ({ id: d.id, ...d.data() } as MaterialRequest),
        );
        callback(data);
    }, (error) => {
        console.warn(
            "Error subscribing to employee requests (index issue?):",
            error,
        );
    });
};

export const approveRequest = async (requestId: string): Promise<void> => {
    try {
        await runTransaction(db, async (transaction) => {
            // 1. Get the request
            const requestRef = doc(db, REQUESTS_COLLECTION, requestId);
            const requestDoc = await transaction.get(requestRef);
            if (!requestDoc.exists()) throw new Error("Request not found");

            const requestData = requestDoc.data() as MaterialRequest;
            if (requestData.estado !== "pendiente") {
                throw new Error("Request is not pending");
            }

            // 2. Check Warehouse Stock
            const warehouseQuery = query(
                collection(db, INVENTORY_COLLECTION),
                where("producto", "==", requestData.producto),
            );
            const warehouseSnapshot = await getDocs(warehouseQuery);

            if (warehouseSnapshot.empty) {
                throw new Error(
                    `Product "${requestData.producto}" not found in warehouse`,
                );
            }

            const warehouseItemDoc = warehouseSnapshot.docs[0];
            if (!warehouseItemDoc) {
                throw new Error("Warehouse item document reference is invalid");
            }

            const warehouseItem = warehouseItemDoc.data() as ItemInventario;

            if (warehouseItem.cantidad < requestData.cantidad) {
                throw new Error("Insufficient stock in warehouse");
            }

            // 3. Deduct from Warehouse
            transaction.update(warehouseItemDoc.ref, {
                cantidad: warehouseItem.cantidad - requestData.cantidad,
                ultimaActualizacion: Timestamp.now(),
            });

            // 4. Update Client Stock (if applicable)
            if (requestData.clienteId) {
                const clientStockQuery = query(
                    collection(db, CLIENT_STOCK_COLLECTION),
                    where("clienteId", "==", requestData.clienteId),
                    where("producto", "==", requestData.producto),
                );
                const clientStockSnapshot = await getDocs(clientStockQuery);

                if (clientStockSnapshot.empty) {
                    const newClientStockRef = doc(
                        collection(db, CLIENT_STOCK_COLLECTION),
                    );
                    transaction.set(newClientStockRef, {
                        clienteId: requestData.clienteId,
                        clienteNombre: requestData.clienteNombre || "Unknown",
                        producto: requestData.producto,
                        categoria: warehouseItem.categoria,
                        cantidad: requestData.cantidad,
                        ubicacion: "En cliente",
                        ultimaActualizacion: Timestamp.now(),
                        createdAt: Timestamp.now(),
                    });
                } else {
                    const clientStockDoc = clientStockSnapshot.docs[0];
                    if (clientStockDoc) {
                        const currentQty = clientStockDoc.data().cantidad || 0;
                        transaction.update(clientStockDoc.ref, {
                            cantidad: currentQty + requestData.cantidad,
                            ultimaActualizacion: Timestamp.now(),
                        });
                    }
                }
            }

            // 5. Update Request Status
            transaction.update(requestRef, {
                estado: "aprobada",
                fechaResolucion: Timestamp.now(),
            });
        });
    } catch (error) {
        console.error("Error approving request:", error);
        throw error;
    }
};

export const rejectRequest = async (
    requestId: string,
    reason: string,
): Promise<void> => {
    try {
        await updateDoc(doc(db, REQUESTS_COLLECTION, requestId), {
            estado: "rechazada",
            motivoRechazo: reason,
            fechaResolucion: Timestamp.now(),
        });
    } catch (error) {
        console.error("Error rejecting request:", error);
        throw error;
    }
};
