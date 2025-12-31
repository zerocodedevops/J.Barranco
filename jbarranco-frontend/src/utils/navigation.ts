import { getDashboardRouteByRole } from "../constants";

/**
 * Obtiene la ruta del dashboard según el rol del usuario
 * @param rol - El rol del usuario
 * @returns La ruta del dashboard correspondiente
 */
export function getDashboardRoute(rol: string): string {
    // Usar helper de constants
    return getDashboardRouteByRole(rol);
}

// Re-exportar constantes útiles para navegación
export { DASHBOARD_ROUTES, ROLES, RUTAS } from "../constants";
