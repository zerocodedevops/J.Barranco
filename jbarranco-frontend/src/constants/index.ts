/**
 * Constantes de la aplicación J-Barranco
 * Centraliza todos los valores constantes para mantener consistencia
 */

// ==========================================
// ROLES DE USUARIO
// ==========================================

export const ROLES = {
    ADMIN: "admin",
    CLIENTE: "cliente",
    EMPLEADO: "empleado",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// Array de roles válidos para validaciones
export const ROLES_ARRAY: readonly Role[] = Object.values(ROLES);

// ==========================================
// ESTADOS DE TRABAJO
// ==========================================

export const ESTADOS_TRABAJO = {
    PENDIENTE: "pendiente",
    EN_PROGRESO: "en_progreso",
    COMPLETADO: "completado",
    CANCELADO: "cancelado",
    NO_COMPLETADA: "no_completada",
} as const;

export type EstadoTrabajo =
    typeof ESTADOS_TRABAJO[keyof typeof ESTADOS_TRABAJO];

// ==========================================
// RUTAS DE LA APLICACIÓN
// ==========================================

export const RUTAS = {
    // Públicas
    HOME: "/",
    ABOUT: "/about",
    SERVICES: "/services",
    CONTACT: "/contact",
    LOGIN: "/login",

    // Admin
    ADMIN_BASE: "/admin",
    ADMIN_DASHBOARD: "/admin",
    ADMIN_CLIENTS: "/admin/clients",
    ADMIN_EMPLOYEES: "/admin/employees",
    ADMIN_ROUTES: "/admin/routes",
    ADMIN_INVENTORY: "/admin/inventory",
    ADMIN_DOCUMENTS: "/admin/documents",
    ADMIN_CMS: "/admin/cms",
    ADMIN_COMPLAINTS: "/admin/complaints",
    ADMIN_EXTRA_JOBS: "/admin/extra-jobs",
    ADMIN_OBSERVATIONS: "/admin/observations",

    // Cliente
    CLIENT_BASE: "/client",
    CLIENT_DASHBOARD: "/client",
    CLIENT_CALENDAR: "/client/calendar",
    CLIENT_REQUESTS: "/client/requests",
    CLIENT_EXTRA_JOBS: "/client/extra-jobs",
    CLIENT_DOCUMENTS: "/client/documents",

    // Empleado
    EMPLOYEE_BASE: "/employee",
    EMPLOYEE_ROUTE: "/employee/route",
    EMPLOYEE_INVENTORY: "/employee/inventory",
    EMPLOYEE_DOCUMENTS: "/employee/documents",

    // Errores
    ACCESS_DENIED: "/access-denied",
} as const;

// Mapeo de roles a su dashboard principal
export const DASHBOARD_ROUTES: Record<string, string> = {
    [ROLES.ADMIN]: RUTAS.ADMIN_DASHBOARD,
    [ROLES.CLIENTE]: RUTAS.CLIENT_DASHBOARD,
    [ROLES.EMPLEADO]: RUTAS.EMPLOYEE_BASE,
    unassigned: RUTAS.ACCESS_DENIED,
    default: RUTAS.HOME,
};

// ==========================================
// COLECCIONES FIRESTORE
// ==========================================

export const COLLECTIONS = {
    USUARIOS: "usuarios",
    TRABAJOS: "trabajos",
    COMUNICACIONES: "comunicaciones",
    EXTRAS: "extras",
    TAREAS: "tareas",
    INVENTARIO: "inventario",
    DOCUMENTOS: "documentos",
    CMS: "cms",
} as const;

export type Collection = typeof COLLECTIONS[keyof typeof COLLECTIONS];

// ==========================================
// HELPERS
// ==========================================

/**
 * Obtiene la ruta del dashboard según el rol
 * @param rol - El rol del usuario
 * @returns Ruta del dashboard
 */
export const getDashboardRouteByRole = (rol: string): string => {
    return DASHBOARD_ROUTES[rol] || RUTAS.HOME;
};

/**
 * Valida si un rol es válido
 * @param rol - El rol a validar
 * @returns true si el rol es válido
 */
export const isValidRole = (rol: string): rol is Role => {
    return ROLES_ARRAY.includes(rol as Role);
};
