import { useClientProfitability } from "../../../hooks/useClientProfitability";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function ClientProfitabilityReport() {
    const { data, loading, error } = useClientProfitability();
    const [sortField, setSortField] = useState<
        "profit" | "revenue" | "totalCost" | "margin"
    >("profit");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    const handleSort = (field: typeof sortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("desc");
        }
    };

    const sortedData = [...data].sort((a, b) => {
        const factor = sortDirection === "asc" ? 1 : -1;
        return (a[sortField] - b[sortField]) * factor;
    });

    if (loading) {
        return (
            <p className="text-gray-500 text-sm">
                Cargando reporte detallado...
            </p>
        );
    }

    if (error) {
        return <p className="text-red-500 text-sm">{error}</p>;
    }

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden mt-6">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Rentabilidad por Cliente
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Desglose de ingresos (Transacciones + Cuota) vs Costes (Mano
                    de obra + Materiales).
                </p>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Cliente
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                                onClick={() => handleSort("revenue")}
                            >
                                Ingresos{" "}
                                <SortIcon
                                    field="revenue"
                                    sortField={sortField}
                                    sortDirection={sortDirection}
                                />
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                                onClick={() => handleSort("totalCost")}
                            >
                                Costes{" "}
                                <SortIcon
                                    field="totalCost"
                                    sortField={sortField}
                                    sortDirection={sortDirection}
                                />
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                                onClick={() => handleSort("profit")}
                            >
                                Beneficio{" "}
                                <SortIcon
                                    field="profit"
                                    sortField={sortField}
                                    sortDirection={sortDirection}
                                />
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                                onClick={() => handleSort("margin")}
                            >
                                Margen{" "}
                                <SortIcon
                                    field="margin"
                                    sortField={sortField}
                                    sortDirection={sortDirection}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedData.map((client) => {
                            let marginColor = "text-red-600";
                            if (client.margin >= 20) {
                                marginColor = "text-green-600";
                            } else if (client.margin > 0) {
                                marginColor = "text-yellow-600";
                            }

                            return (
                                <tr
                                    key={client.clientId}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {client.clientName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                        {client.revenue.toLocaleString(
                                            "es-ES",
                                            {
                                                style: "currency",
                                                currency: "EUR",
                                            },
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400 text-right">
                                        {client.totalCost.toLocaleString(
                                            "es-ES",
                                            {
                                                style: "currency",
                                                currency: "EUR",
                                            },
                                        )}
                                    </td>
                                    <td
                                        className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${
                                            client.profit >= 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {client.profit.toLocaleString("es-ES", {
                                            style: "currency",
                                            currency: "EUR",
                                        })}
                                    </td>
                                    <td
                                        className={`px-6 py-4 whitespace-nowrap text-sm text-right ${marginColor}`}
                                    >
                                        {client.margin.toFixed(1)}%
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Extracted Component
const SortIcon = (
    { field, sortField, sortDirection }: {
        field: string;
        sortField: string;
        sortDirection: "asc" | "desc";
    },
) => {
    if (sortField !== field) return null;
    return sortDirection === "asc"
        ? <ArrowUpIcon className="h-3 w-3 inline ml-1" />
        : <ArrowDownIcon className="h-3 w-3 inline ml-1" />;
};
