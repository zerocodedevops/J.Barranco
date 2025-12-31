import {
  ArrowRightStartOnRectangleIcon,
  BellIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Notificacion } from "../../types";

function HeaderClient() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const notifications: Notificacion[] = []; // Desactivado temporalmente por error permisos
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.length;

  const handleNotificationClick = (notifLink: string) => {
    navigate(notifLink);
    setIsNotificationOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="bg-brand-blue text-white shadow-md relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo a la izquierda */}
        <Link to="/client" className="flex-shrink-0 relative z-50">
          <img
            className="h-[100px] w-auto translate-y-[29px] cursor-pointer"
            src="/logo-light.png"
            alt="J.Barranco. Limpieza de Comunidades"
          />
        </Link>

        {/* Sección Usuario (Derecha) */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium hidden md:inline-block">
            {user?.nombre || user?.displayName || "Cliente"}
          </span>
          <img
            className="h-9 w-9 rounded-full border-2 border-white/20"
            src={user?.urlImagenPerfil ||
              `https://ui-avatars.com/api/?name=${
                user?.nombre || "Cliente"
              }&background=ffffff&color=0D47A1`}
            alt="Avatar"
          />
        </div>

        {/* Contenedor para los botones a la derecha */}
        <div className="flex items-center space-x-4">
          {/* Botón de Notificaciones */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-1 rounded-full text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-blue focus:ring-white"
              title="Ver notificaciones"
            >
              <span className="sr-only">Ver notificaciones</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Panel de notificaciones */}
            {isNotificationOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-gray-800 focus:outline-none z-50">
                <div className="py-1">
                  <div className="px-4 py-2 flex justify-between items-center border-b border-gray-700">
                    <h3 className="text-white text-sm font-medium">
                      Notificaciones
                    </h3>
                    <button onClick={() => setIsNotificationOpen(false)}>
                      <XMarkIcon className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0
                      ? (
                        notifications.map((notif) => (
                          <button
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif.link)}
                            className="block w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-700"
                          >
                            <p className="font-medium">{notif.message}</p>
                            <p className="text-gray-400 text-xs mt-1">
                              {notif.timestamp.toDate().toLocaleString(
                                "es-ES",
                                {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </button>
                        ))
                      )
                      : (
                        <p className="block px-4 py-3 text-sm text-gray-400">
                          No tienes notificaciones nuevas.
                        </p>
                      )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botón de Cerrar Sesión */}
          <button
            onClick={handleLogout}
            className="relative p-1 rounded-full text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-blue focus:ring-white"
            title="Cerrar sesión"
          >
            <span className="sr-only">Cerrar sesión</span>
            <ArrowRightStartOnRectangleIcon
              className="h-6 w-6"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </header>
  );
}

export default HeaderClient;
