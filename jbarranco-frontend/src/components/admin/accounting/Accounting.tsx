import { useEffect, useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useSearchParams } from "react-router-dom";
import { useAccountingData } from "../../../hooks/useAccountingData";
import LoadingSpinner from "../../common/LoadingSpinner";
import AddTransactionModal from "./AddTransactionModal";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getSignedDocumentUrl } from "../../../services/storageService";
import IncomePanel from "./components/IncomePanel";

import ExpensesPanel from "./components/ExpensesPanel";
import ProfitabilityDashboard from "../finance/ProfitabilityDashboard";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function Accounting() {
    const {
        incomes,
        inventoryExpenses,
        payrollExpenses,
        manualExpenses,
        loading,
        refreshData,
    } = useAccountingData();
    const [categories] = useState(["Ingresos", "Gastos", "Rentabilidad"]);
    const [searchParams] = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Controlar índice de pestañas
    const tabParam = searchParams.get("tab");
    const initialIndex = tabParam === "gastos" ? 1 : 0;
    const [selectedIndex, setSelectedIndex] = useState(initialIndex);

    // Actualizar si cambia la URL (opcional, pero buena práctica)
    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab === "gastos") setSelectedIndex(1);
        else if (tab === "ingresos") setSelectedIndex(0);
        else if (tab === "rentabilidad") setSelectedIndex(2);
    }, [searchParams]);

    const handleViewDocument = async (path: string) => {
        if (!path) return;
        try {
            const url = await getSignedDocumentUrl(path);
            if (url) window.open(url, "_blank");
            else alert("No se pudo generar el enlace");
        } catch (error) {
            console.error(error);
            alert("Error al abrir documento");
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="w-full px-2 py-4 sm:px-0">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Contabilidad
                </h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-x-2 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                    Añadir Movimiento
                </button>
            </div>

            <TabGroup
                selectedIndex={selectedIndex}
                onChange={setSelectedIndex}
            >
                <TabList className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6 max-w-md">
                    {categories.map((category) => (
                        <Tab
                            key={category}
                            className={({ selected }) =>
                                classNames(
                                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                                    "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                                    selected
                                        ? "bg-white text-blue-700 shadow"
                                        : "text-gray-600 hover:bg-white/[0.12] hover:text-blue-900",
                                )}
                        >
                            {category}
                        </Tab>
                    ))}
                </TabList>
                <TabPanels className="mt-2">
                    {/* Panel Ingresos */}
                    <TabPanel
                        className={classNames(
                            "rounded-xl bg-white p-3 shadow",
                            "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                        )}
                    >
                        <IncomePanel incomes={incomes} />
                    </TabPanel>

                    {/* Panel Gastos */}
                    <TabPanel
                        className={classNames(
                            "rounded-xl bg-white p-3 shadow",
                            "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                        )}
                    >
                        <ExpensesPanel
                            manualExpenses={manualExpenses}
                            payrollExpenses={payrollExpenses}
                            inventoryExpenses={inventoryExpenses}
                            onViewDocument={handleViewDocument}
                        />
                    </TabPanel>

                    {/* Panel Rentabilidad */}
                    <TabPanel
                        className={classNames(
                            "rounded-xl bg-white p-3 shadow",
                            "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                        )}
                    >
                        <ProfitabilityDashboard />
                    </TabPanel>
                </TabPanels>
            </TabGroup>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTransactionAdded={refreshData}
            />
        </div>
    );
}
