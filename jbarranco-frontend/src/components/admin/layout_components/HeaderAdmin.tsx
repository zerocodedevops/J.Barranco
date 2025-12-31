import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { useNotifications } from "../../../hooks/useNotifications";
import { useAuth } from "../../../context/AuthContext";
import NotificationDropdown from "../notifications/NotificationDropdown";

interface HeaderAdminProps {
  onMenuClick?: () => void;
}

function HeaderAdmin({ onMenuClick }: Readonly<HeaderAdminProps>) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Lógica de Notificaciones
  const notifications = useNotifications();
  const [readIds, setReadIds] = useState<string[]>([]);
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

  // Filtrar notificaciones que ya han sido clicadas (leídas localmente)
  const activeNotifications = notifications.filter((n) =>
    !readIds.includes(n.id)
  );
  const unreadCount = activeNotifications.length;

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
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/admin" className="flex-shrink-0 relative z-50">
            <img
              className="h-[100px] w-auto translate-y-[29px] cursor-pointer"
              src="/logo-light.png"
              alt="J.Barranco. Limpieza de Comunidades"
            />
          </Link>
        </div>

        {/* Sección central para mostrar la información del usuario */}
        <div className="flex items-center space-x-3">
          <span className="text-base font-medium hidden md:block">
            {user?.nombre || "Administrador"}
          </span>
          <img
            className="h-8 w-8 rounded-full bg-white object-cover"
            src={user?.urlImagenPerfil ||
              `https://ui-avatars.com/api/?name=${
                user?.nombre || "Admin"
              }&background=fff&color=0D47A1`}
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
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full border-2 border-brand-blue">
                  {unreadCount > 9 ? "+9" : unreadCount}
                </span>
              )}
            </button>

            {/* Panel de notificaciones */}
            {isNotificationOpen && (
              <NotificationDropdown
                notifications={activeNotifications}
                onClose={() => setIsNotificationOpen(false)}
                onRead={(notif) => setReadIds((prev) => [...prev, notif.id])}
              />
            )}
          </div>

          {/* Botón de Configuración */}
          <button
            onClick={() => navigate("/admin/settings")}
            className="relative p-1 rounded-full text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-blue focus:ring-white"
            title="Configuración"
          >
            <span className="sr-only">Configuración</span>
            <Cog6ToothIcon className="h-6 w-6" aria-hidden="true" />
          </button>

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

          {/* Botón Menú Móvil (Movido a la derecha) */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-200 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white -mr-2"
            onClick={onMenuClick}
          >
            <span className="sr-only">Abrir menú</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default HeaderAdmin;
