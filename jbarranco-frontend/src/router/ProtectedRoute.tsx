import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardRoute } from '../utils/navigation';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Role } from '../types';

interface ProtectedRouteProps {
    allowedRoles?: Role[];
    children: ReactNode;
}

/**
 * Componente para proteger rutas que requieren autenticación y roles específicos
 */
function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
    const { user, userRole, loading } = useAuth();

    // Mientras carga, mostrar spinner
    if (loading) {
        return <LoadingSpinner message="Verificando permisos..." />;
    }

    // Si no hay usuario, redirigir a login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Si el rol del usuario no está permitido, redirigir a su dashboard
    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        return <Navigate to={getDashboardRoute(userRole)} replace />;
    }

    // Usuario autenticado y autorizado
    return <>{children}</>;
}

export default ProtectedRoute;
