import { useEffect, useState } from "react";
import {
    BriefcaseIcon,
    BuildingOfficeIcon,
    CalendarDaysIcon,
    EnvelopeIcon,
    IdentificationIcon,
    PencilIcon,
    PhoneIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import EntityAttachments from "../../common/EntityAttachments";
import { Cliente, Empleado } from "../../../types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { formatFirestoreDate } from "../../../utils/dateHelpers";

interface EmployeePreviewProps {
    employee: Empleado | null;
    onClose: () => void;
    onDelete?: () => void;
}

export default function EmployeePreview(
    { employee, onClose, onDelete }: EmployeePreviewProps,
) {
    const navigate = useNavigate();
    const [assignedClients, setAssignedClients] = useState<Partial<Cliente>[]>(
        [],
    );
    const [loadingClients, setLoadingClients] = useState(false);

    useEffect(() => {
        if (employee?.id) {
            const fetchClients = async () => {
                setLoadingClients(true);
                try {
                    const q = query(
                        collection(db, "clientes"),
                        where("empleadoAsignadoId", "==", employee.id),
                    );
                    const snapshot = await getDocs(q);
                    setAssignedClients(
                        snapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        })),
                    );
                } catch (error) {
                    console.error("Error fetching assigned clients:", error);
                } finally {
                    setLoadingClients(false);
                }
            };
            fetchClients();
        }
    }, [employee?.id]);

    const renderAssignedClients = () => {
        if (loadingClients) {
            return (
                <div className="p-4 text-center text-sm text-gray-500">
                    Cargando asignaciones...
                </div>
            );
        }

        if (assignedClients.length === 0) {
            return (
                <div className="p-4 text-center text-sm text-gray-400 italic">
                    No tiene clientes asignados actualmente.
                </div>
            );
        }

        return (
            <ul className="divide-y divide-gray-100">
                {assignedClients.map((client) => (
                    <li
                        key={client.id}
                        className="p-3 hover:bg-gray-50 transition flex items-center gap-3"
                    >
                        <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded bg-purple-100 flex items-center justify-center text-purple-600">
                                <BuildingOfficeIcon className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="flex-grow min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {client.nombre}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {client.direccion}
                            </p>
                        </div>
                        <button
                            onClick={() =>
                                navigate(`/admin/clients/${client.id}`)}
                            className="text-xs text-brand-blue hover:underline whitespace-nowrap"
                        >
                            Ver
                        </button>
                    </li>
                ))}
            </ul>
        );
    };

    if (!employee) return null;

    return (
        <div className="space-y-6">
            {/* Cabecera / Acciones */}
            <div className="flex justify-center pb-6 border-b border-gray-100 gap-3">
                <button
                    onClick={() => navigate(`/admin/employees/${employee.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                    <PencilIcon className="h-4 w-4" />
                    Editar Perfil
                </button>
                {onDelete && (
                    <button
                        onClick={onDelete}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"
                        title="Eliminar Empleado"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Datos Personales */}

            {/* Identificación */}
            <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                    Datos Personales
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center gap-3">
                        <IdentificationIcon className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-400">DNI</p>
                            <p className="font-mono font-medium text-gray-900">
                                {employee.dni}
                            </p>
                        </div>
                    </div>
                    {employee.fechaContratacion && (
                        <div className="flex items-center gap-3">
                            <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-400">
                                    Fecha de Contratación
                                </p>
                                <p className="text-sm text-gray-900">
                                    {formatFirestoreDate(
                                        employee.fechaContratacion,
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                    {employee.especialidad && (
                        <div className="flex items-center gap-3">
                            <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-400">
                                    Especialidad
                                </p>
                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                    {employee.especialidad}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Contacto */}
            <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                    Contacto
                </h4>
                <div className="bg-white border border-gray-200 p-4 rounded-lg space-y-4">
                    <div className="flex items-center gap-3">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                        <a
                            href={`tel:${employee.telefono}`}
                            className="text-blue-600 hover:underline"
                        >
                            {employee.telefono}
                        </a>
                    </div>

                    <div className="flex items-center gap-3">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        <a
                            href={`mailto:${employee.email}`}
                            className="text-blue-600 hover:underline break-all"
                        >
                            {employee.email}
                        </a>
                    </div>
                </div>
            </div>

            {/* Clientes Asignados - Requested Feature */}
            <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                    Clientes Asignados
                </h4>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    {renderAssignedClients()}
                </div>
            </div>

            {/* Documentación */}
            <EntityAttachments
                entityId={employee.id}
                folderPath={`employees/${employee.id}`}
                title="Documentación del Empleado"
            />

            {/* Estadísticas rápidas (Mockup para el futuro) */}
            <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                    Actividad
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 p-3 rounded border border-green-100 text-center">
                        <p className="text-2xl font-bold text-green-700">4.8</p>
                        <p className="text-xs text-green-600">Valoración</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded border border-purple-100 text-center">
                        <p className="text-2xl font-bold text-purple-700">-</p>
                        <p className="text-xs text-purple-600">Servicios</p>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium hover:underline"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}
