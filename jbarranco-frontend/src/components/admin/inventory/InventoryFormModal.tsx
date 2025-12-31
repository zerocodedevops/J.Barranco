import { XMarkIcon } from "@heroicons/react/24/outline";
import { ItemInventario, StockCliente } from "../../../types";

interface InventoryFormModalProps {
    showModal: boolean;
    editingItem: ItemInventario | StockCliente | null;
    activeTab: "warehouse" | "clients" | "requests";
    formData: {
        producto: string;
        cantidad: number;
        precio: number;
        stockMinimo: number;
        categoria: string;
    };
    productCatalog: { producto: string; categoria: string }[];
    isCustomProduct: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    setFormData: (
        data: {
            producto: string;
            cantidad: number;
            precio: number;
            stockMinimo: number;
            categoria: string;
        },
    ) => void;
    setIsCustomProduct: (isCustom: boolean) => void;
    handleProductSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const InventoryFormModal = ({
    showModal,
    editingItem,
    activeTab,
    formData,
    productCatalog,
    isCustomProduct,
    onClose,
    onSubmit,
    setFormData,
    setIsCustomProduct,
    handleProductSelect,
}: InventoryFormModalProps) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {editingItem ? "Editar Artículo" : "Nuevo Artículo"}
                    {activeTab === "clients" && (
                        <span className="text-sm font-normal text-gray-500 ml-2">
                            (En Cliente)
                        </span>
                    )}
                </h3>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="producto"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Producto *
                        </label>
                        {isCustomProduct
                            ? (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.producto}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                producto: e.target.value,
                                            })}
                                        required
                                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                                        placeholder="Nombre del nuevo producto"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsCustomProduct(false)}
                                        className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md"
                                        title="Volver a la lista"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            )
                            : (
                                <select
                                    id="producto"
                                    value={formData.producto}
                                    onChange={handleProductSelect}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                                >
                                    <option value="">
                                        -- Seleccionar Producto --
                                    </option>
                                    {productCatalog.map((prod) => (
                                        <option
                                            key={prod.producto}
                                            value={prod.producto}
                                        >
                                            {prod.producto}
                                        </option>
                                    ))}
                                    <option disabled>----------------</option>
                                    <option value="NEW_PRODUCT_ENTRY">
                                        ➕ Nuevo Producto...
                                    </option>
                                </select>
                            )}
                    </div>

                    <div>
                        <label
                            htmlFor="categoria"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Categoría *
                        </label>
                        <select
                            id="categoria"
                            value={formData.categoria}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    categoria: e.target.value,
                                })}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                        >
                            <option value="Limpieza">Limpieza</option>
                            <option value="Herramientas">Herramientas</option>
                            <option value="Equipamiento">Equipamiento</option>
                            <option value="Consumibles">Consumibles</option>
                            <option value="Otros">Otros</option>
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
                            value={formData.cantidad}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    cantidad: Number(e.target.value),
                                })}
                            required
                            min="0"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="precio"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Precio Coste Unitario (€)
                        </label>
                        <input
                            id="precio"
                            type="number"
                            step="0.01"
                            value={formData.precio}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    precio: Number(e.target.value),
                                })}
                            min="0"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                            placeholder="0.00"
                        />
                    </div>

                    {activeTab === "warehouse" && (
                        <div>
                            <label
                                htmlFor="stockMinimo"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Stock Mínimo (Alerta)
                            </label>
                            <input
                                id="stockMinimo"
                                type="number"
                                value={formData.stockMinimo}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        stockMinimo: Number(e.target.value),
                                    })}
                                min="0"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                                placeholder="Por defecto: 5"
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-700"
                        >
                            {editingItem ? "Guardar Cambios" : "Añadir"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
