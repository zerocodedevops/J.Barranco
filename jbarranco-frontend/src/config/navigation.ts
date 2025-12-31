import {
    ArchiveBoxIcon,
    BanknotesIcon,
    BuildingOfficeIcon,
    CalendarDaysIcon,
    ChatBubbleLeftRightIcon,
    Cog6ToothIcon,
    DocumentTextIcon,
    EyeIcon,
    HomeIcon,
    MapIcon,
    PlusCircleIcon,
    StarIcon,
    UsersIcon,
} from "@heroicons/react/24/outline";

export interface NavigationItem {
    name: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    path: string;
}

// Navegación Admin
export const adminNavigation: NavigationItem[] = [
    { name: "Panel de Control", icon: HomeIcon, path: "/admin" },
    { name: "Clientes", icon: BuildingOfficeIcon, path: "/admin/clients" },
    { name: "Empleados", icon: UsersIcon, path: "/admin/employees" },
    { name: "Rutas y Tareas", icon: MapIcon, path: "/admin/routes" },
    {
        name: "Calendario Global",
        icon: CalendarDaysIcon,
        path: "/admin/calendar",
    },
    { name: "Inventario", icon: ArchiveBoxIcon, path: "/admin/inventory" },
    { name: "Contabilidad", icon: BanknotesIcon, path: "/admin/accounting" },
    {
        name: "Incidencias",
        icon: ChatBubbleLeftRightIcon,
        path: "/admin/complaints",
    },
    { name: "Observaciones", icon: EyeIcon, path: "/admin/observations" },
    { name: "Trabajos Extra", icon: PlusCircleIcon, path: "/admin/extra-jobs" },
    { name: "Documentos", icon: DocumentTextIcon, path: "/admin/documents" },
    { name: "Calidad", icon: StarIcon, path: "/admin/ratings" },
    { name: "CMS", icon: Cog6ToothIcon, path: "/admin/cms" },
];

// Navegación Cliente
export const clientNavigation: NavigationItem[] = [
    // { name: 'Inicio', icon: HomeIcon, path: '/client' }, // Dashboard es index ahora
    { name: "Mi Calendario", icon: CalendarDaysIcon, path: "/client/calendar" },
    {
        name: "Solicitudes y Quejas",
        icon: ChatBubbleLeftRightIcon,
        path: "/client/requests",
    },
    {
        name: "Trabajos Extra",
        icon: PlusCircleIcon,
        path: "/client/extra-jobs",
    },
    {
        name: "Mis Documentos",
        icon: DocumentTextIcon,
        path: "/client/documents",
    },
];

// Navegación Empleado
export const employeeNavigation: NavigationItem[] = [
    { name: "Mi Ruta", icon: MapIcon, path: "/employee/route" },
    { name: "Inventario", icon: ArchiveBoxIcon, path: "/employee/inventory" },
    {
        name: "Mis Documentos",
        icon: DocumentTextIcon,
        path: "/employee/documents",
    },
    { name: "Mis Valoraciones", icon: StarIcon, path: "/employee/ratings" },
];
