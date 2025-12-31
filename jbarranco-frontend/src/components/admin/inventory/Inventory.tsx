import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../../firebase/config";
import {
  BuildingOfficeIcon,
  ClipboardDocumentCheckIcon,
  PlusIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { getClients } from "../../../firebase/services";
import { Cliente, ItemInventario, StockCliente } from "../../../types";
import { InventoryTable } from "./InventoryTable";
import { InventoryFormModal } from "./InventoryFormModal";
import { InventoryTransferModal } from "./InventoryTransferModal";
import { RequestsList } from "./RequestsList";

function Inventory() {
  const [activeTab, setActiveTab] = useState<
    "warehouse" | "clients" | "requests"
  >("warehouse");
  const [warehouseItems, setWarehouseItems] = useState<ItemInventario[]>([]);
  const [clients, setClients] = useState<Cliente[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [clientStockItems, setClientStockItems] = useState<StockCliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<
    ItemInventario | StockCliente | null
  >(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferItem, setTransferItem] = useState<ItemInventario | null>(null);
  const [transferData, setTransferData] = useState({
    clienteId: "",
    cantidad: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isCustomProduct, setIsCustomProduct] = useState(false);
  const [formData, setFormData] = useState({
    producto: "",
    cantidad: 0,
    precio: 0,
    stockMinimo: 5,
    categoria: "Limpieza",
  });

  const productCatalog = useMemo(() => {
    const unique = new Map();
    warehouseItems.forEach((item) => {
      if (!unique.has(item.producto)) unique.set(item.producto, item.categoria);
    });
    return Array.from(unique.entries()).map(([producto, categoria]) => ({
      producto,
      categoria,
    }));
  }, [warehouseItems]);

  useEffect(() => {
    loadWarehouseInventory();
    fetchClientsList();
  }, []);

  useEffect(() => {
    if (activeTab === "clients" && selectedClientId) {
      loadClientStock(selectedClientId);
    } else if (activeTab === "clients" && !selectedClientId) {
      setClientStockItems([]);
    }
  }, [selectedClientId, activeTab]);

  const fetchClientsList = async () => {
    try {
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error("Error loading clients", error);
    }
  };

  const loadWarehouseInventory = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "inventario"));
      const data = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() } as ItemInventario),
      );
      setWarehouseItems(data);
    } catch (error) {
      console.error("Error loading inventory:", error);
      toast.error("Error al cargar inventario de almacén");
    } finally {
      setLoading(false);
    }
  };

  const loadClientStock = async (clientId: string) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "stock_clientes"),
        where("clienteId", "==", clientId),
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((
        d,
      ) => ({ id: d.id, ...d.data() } as StockCliente));
      setClientStockItems(data);
    } catch (error) {
      console.error("Error loading client stock:", error);
      toast.error("Error al cargar stock del cliente");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item: ItemInventario | null) => {
    if (activeTab === "clients" && !selectedClientId) {
      toast.error("Selecciona un cliente primero");
      return;
    }
    setEditingItem(item);
    if (item) {
      const existingInCatalog = productCatalog.some((p) =>
        p.producto === item.producto
      );
      setIsCustomProduct(!existingInCatalog);
      setFormData({
        producto: item.producto ?? "",
        cantidad: Number(item.cantidad ?? 0),
        precio: 0,
        stockMinimo: Number(item.stockMinimo ?? 5),
        categoria: item.categoria ?? "Limpieza",
      });
    } else {
      setIsCustomProduct(false);
      setFormData({
        producto: "",
        cantidad: 0,
        precio: 0,
        stockMinimo: 5,
        categoria: "Limpieza",
      });
    }
    setShowModal(true);
  };

  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "NEW_PRODUCT_ENTRY") {
      setIsCustomProduct(true);
      setFormData((prev) => ({ ...prev, producto: "", categoria: "Limpieza" }));
    } else {
      setIsCustomProduct(false);
      const catalogItem = productCatalog.find((p) => p.producto === val);
      setFormData((prev) => ({
        ...prev,
        producto: val,
        categoria: catalogItem?.categoria || "Limpieza",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const collectionName = activeTab === "warehouse"
        ? "inventario"
        : "stock_clientes";
      const payload: Partial<ItemInventario & StockCliente> = {
        producto: formData.producto,
        categoria: formData.categoria,
        cantidad: Number(formData.cantidad),
        stockMinimo: Number(formData.stockMinimo),
        ultimaActualizacion: new Date(),
      };
      if (activeTab === "clients") {
        payload.clienteId = selectedClientId;
        const clientName = clients.find((c) =>
          c.id === selectedClientId
        )?.nombre || "Desconocido";
        payload.clienteNombre = clientName;
      }
      if (editingItem) {
        await updateDoc(doc(db, collectionName, editingItem.id), payload);
        toast.success("Actualizado correctamente");
      } else {
        await addDoc(collection(db, collectionName), {
          ...payload,
          createdAt: new Date(),
        });
        toast.success("Añadido correctamente");
      }
      setShowModal(false);
      if (activeTab === "warehouse") loadWarehouseInventory();
      else if (selectedClientId) loadClientStock(selectedClientId);
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item: ItemInventario | StockCliente) => {
    if (!globalThis.confirm(`¿Eliminar "${item.producto}"?`)) return;
    try {
      const collectionName = activeTab === "warehouse"
        ? "inventario"
        : "stock_clientes";
      await deleteDoc(doc(db, collectionName, item.id));
      toast.success("Eliminado");
      if (activeTab === "warehouse") loadWarehouseInventory();
      else if (selectedClientId) loadClientStock(selectedClientId);
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar");
    }
  };

  const handleOpenTransfer = (item: ItemInventario) => {
    setTransferItem(item);
    setTransferData({ clienteId: "", cantidad: 1 });
    setShowTransferModal(true);
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferItem || !transferData.clienteId) return;
    const qty = Number(transferData.cantidad);
    if (qty <= 0) {
      toast.error("Cantidad inválida");
      return;
    }
    if (qty > transferItem.cantidad) {
      toast.error("No hay suficiente stock en almacén");
      return;
    }
    setLoading(true);
    try {
      const batch = writeBatch(db);
      const warehouseRef = doc(db, "inventario", transferItem.id);
      batch.update(warehouseRef, { cantidad: transferItem.cantidad - qty });

      const q = query(
        collection(db, "stock_clientes"),
        where("clienteId", "==", transferData.clienteId),
        where("producto", "==", transferItem.producto),
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        const clientRef = doc(collection(db, "stock_clientes"));
        const clientName = clients.find((c) =>
          c.id === transferData.clienteId
        )?.nombre || "Desconocido";
        batch.set(clientRef, {
          producto: transferItem.producto,
          categoria: transferItem.categoria,
          cantidad: qty,
          clienteId: transferData.clienteId,
          clienteNombre: clientName,
          ultimaActualizacion: new Date(),
          createdAt: new Date(),
        });
      } else {
        const clientDoc = querySnapshot.docs[0];
        if (clientDoc) {
          const currentClientQty = clientDoc.data().cantidad || 0;
          batch.update(clientDoc.ref, {
            cantidad: currentClientQty + qty,
            ultimaActualizacion: new Date(),
          });
        }
      }
      await batch.commit();
      toast.success(`Transferidas ${qty} uds de ${transferItem.producto}`);
      setShowTransferModal(false);
      loadWarehouseInventory();
    } catch (error) {
      console.error("Error transfer:", error);
      toast.error("Error al transferir stock");
    } finally {
      setLoading(false);
    }
  };

  const itemsToShow = activeTab === "warehouse"
    ? warehouseItems
    : clientStockItems;
  const filteredItems = itemsToShow
    .filter((item) =>
      (item.producto || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.categoria || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (a.producto || "").localeCompare(b.producto || ""));

  return (
    <div>
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Gestión de Inventario
          </h2>
          <p className="text-sm text-gray-500">
            Control de Almacén, Stock en Clientes y Solicitudes
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("warehouse")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "warehouse"
                  ? "bg-white text-brand-blue shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <BuildingOfficeIcon className="h-4 w-4" />
              Almacén
            </button>
            <button
              onClick={() => setActiveTab("clients")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "clients"
                  ? "bg-white text-brand-blue shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <UserGroupIcon className="h-4 w-4" />
              Clientes
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "requests"
                  ? "bg-white text-brand-blue shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <ClipboardDocumentCheckIcon className="h-4 w-4" />
              Solicitudes
            </button>
          </div>

          {activeTab !== "requests" && (
            <button
              onClick={() => handleOpenModal(null)}
              className="bg-brand-blue text-white px-3 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm font-medium"
              disabled={activeTab === "clients" && !selectedClientId}
              title={activeTab === "clients" && !selectedClientId
                ? "Selecciona un cliente primero"
                : ""}
            >
              <PlusIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Añadir Item</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === "requests" ? <RequestsList /> : (
        <>
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
              />
              {activeTab === "clients" && (
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue bg-blue-50"
                >
                  <option value="">
                    -- Seleccionar Cliente para ver su Stock --
                  </option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombreComercial || c.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <InventoryTable
              items={filteredItems}
              activeTab={activeTab}
              loading={loading}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
              onTransfer={handleOpenTransfer}
              selectedClientId={selectedClientId}
            />
          </div>
        </>
      )}

      <InventoryFormModal
        showModal={showModal}
        editingItem={editingItem}
        activeTab={activeTab}
        formData={formData}
        productCatalog={productCatalog}
        isCustomProduct={isCustomProduct}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        setFormData={setFormData}
        setIsCustomProduct={setIsCustomProduct}
        handleProductSelect={handleProductSelect}
      />

      <InventoryTransferModal
        showTransferModal={showTransferModal}
        transferItem={transferItem}
        clients={clients}
        transferData={transferData}
        loading={loading}
        onClose={() => setShowTransferModal(false)}
        onSubmit={handleTransferSubmit}
        setTransferData={setTransferData}
      />
    </div>
  );
}

export default Inventory;
