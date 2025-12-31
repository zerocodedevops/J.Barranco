import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { adminNavigation } from "../../../config/navigation";

interface AdminSidebarProps {
  readonly isOpen?: boolean;
  readonly onClose?: () => void;
}

import { useNotifications } from "../../../hooks/useNotifications";

function SidebarContent() {
  const location = useLocation();
  const notifications = useNotifications();

  // Calcular conteos
  const extrasCount = notifications.filter((n) => n.type === "extra").length;
  const complaintsCount =
    notifications.filter((n) =>
      n.type === "comunicacion" || n.type === "ticket"
    ).length;
  const inventoryCount =
    notifications.filter((n) =>
      n.type === "stock_bajo" || n.type === "reposicion"
    ).length;
  const observationsCount =
    notifications.filter((n) => n.type === "observacion").length;

  const getBadgeCount = (path: string) => {
    if (path === "/admin/extra-jobs") return extrasCount;
    if (path === "/admin/complaints") return complaintsCount;
    if (path === "/admin/inventory") return inventoryCount;
    if (path === "/admin/observations") return observationsCount;
    return 0;
  };

  return (
    <nav className="mt-5 px-2 space-y-3">
      {adminNavigation.map((item) => {
        const isActive = location.pathname === item.path;
        const count = getBadgeCount(item.path);

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`${
              isActive
                ? "bg-brand-blue text-white group"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 group"
            } w-full flex items-center px-2 py-2 text-sm font-medium rounded-md justify-between`}
          >
            <div className="flex items-center">
              <item.icon
                className={`${
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-gray-500"
                } mr-3 h-5 w-5`}
                aria-hidden="true"
              />
              {item.name}
            </div>
            {count > 0 && (
              <span
                className={`${
                  isActive
                    ? "bg-white text-brand-blue"
                    : "bg-red-100 text-red-800"
                } ml-auto inline-block py-0.5 px-2.5 text-xs font-medium rounded-full`}
              >
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function AdminSidebar(
  { isOpen = false, onClose = () => undefined }: AdminSidebarProps,
) {
  return (
    <>
      {/* Mobile Sidebar (Slide-over) */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 md:hidden" onClose={onClose}>
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </TransitionChild>

          <div className="fixed inset-0 z-40 flex flex-row-reverse">
            <TransitionChild
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <DialogPanel className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                <div className="absolute top-0 left-0 -ml-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={onClose}
                  >
                    <span className="sr-only">Cerrar menú</span>
                    <XMarkIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </button>
                </div>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <div className="flex-shrink-0 flex items-center justify-center px-4 mb-5 bg-white py-4">
                    <img
                      className="h-16 w-auto"
                      src="/logo-email.jpg"
                      alt="J.Barranco"
                    />
                  </div>
                  <SidebarContent />
                </div>
              </DialogPanel>
            </TransitionChild>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Desktop Sidebar (Static - matches original behavior) */}
      <div className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 shadow-md">
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}

export default AdminSidebar;
