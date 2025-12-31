import {
    BellIcon,
    ChatBubbleLeftRightIcon,
    ClipboardDocumentCheckIcon,
    ExclamationTriangleIcon,
    TicketIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { Notification } from "../../../hooks/useNotifications";
import { useNavigate } from "react-router-dom";

interface NotificationDropdownProps {
    notifications: Notification[];
    onClose: () => void;
    onRead: (notif: Notification) => void;
}

export default function NotificationDropdown(
    { notifications, onClose, onRead }: Readonly<NotificationDropdownProps>,
) {
    const navigate = useNavigate();

    const handleClick = (notif: Notification) => {
        onRead(notif);
        navigate(notif.link);
        onClose();
    };

    const getIcon = (type: Notification["type"]) => {
        switch (type) {
            case "stock_bajo":
                return (
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                );
            case "tarea_pendiente":
                return (
                    <ClipboardDocumentCheckIcon className="h-5 w-5 text-orange-500" />
                );
            case "comunicacion":
                return (
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-500" />
                );
            case "reposicion":
                return (
                    <ClipboardDocumentCheckIcon className="h-5 w-5 text-yellow-500" />
                );
            case "ticket":
                return <TicketIcon className="h-5 w-5 text-indigo-500" />;
            default:
                return <BellIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    const getTypeLabel = (type: Notification["type"]) => {
        switch (type) {
            case "stock_bajo":
                return "Stock Bajo";
            case "tarea_pendiente":
                return "Sin Asignar";
            case "comunicacion":
                return "Mensaje";
            case "reposicion":
                return "Material";
            case "extra":
                return "Extra";
            case "observacion":
                return "Observación";
            case "ticket":
                return "Incidencia";
            default:
                return "Notificación";
        }
    };

    return (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            <div className="py-1">
                <div className="px-4 py-2 flex justify-between items-center border-b border-gray-100 bg-gray-50 rounded-t-md">
                    <h3 className="text-gray-700 text-sm font-semibold">
                        Notificaciones
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <XMarkIcon className="h-4 w-4" />
                    </button>
                </div>

                <div className="max-h-[20rem] overflow-y-auto">
                    {notifications.length > 0
                        ? (
                            notifications.map((notif) => (
                                <button
                                    key={notif.id}
                                    onClick={() => handleClick(notif)}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 group"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {getIcon(notif.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                                                {getTypeLabel(notif.type)}
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 group-hover:text-brand-blue truncate">
                                                {notif.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {notif.timestamp?.toDate
                                                    ? notif.timestamp.toDate()
                                                        .toLocaleString(
                                                            "es-ES",
                                                            {
                                                                day: "numeric",
                                                                month: "short",
                                                                hour: "2-digit",
                                                                minute:
                                                                    "2-digit",
                                                            },
                                                        )
                                                    : "Reciente"}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )
                        : (
                            <div className="px-4 py-8 text-center text-gray-500">
                                <BellIcon className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                                <p className="text-sm">Todo al día</p>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}
