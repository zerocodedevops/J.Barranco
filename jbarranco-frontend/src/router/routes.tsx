import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardRoute } from "../utils/navigation";
import ProtectedRoute from "./ProtectedRoute";
import LoadingSpinner from "../components/common/LoadingSpinner";

import PublicLayout from "../components/public/PublicLayout";
import AdminLayout from "../components/admin/layout_components/AdminLayout";
import ClientLayout from "../components/client/ClientLayout";
import EmployeeLayout from "../components/employee/EmployeeLayout";

// ... (skipping unchanged lines)

// Public Pages - lazy loading
const Home = lazy(() => import("../components/public/Home"));
const About = lazy(() => import("../components/public/About"));
const Services = lazy(() => import("../components/public/Services"));
const Contact = lazy(() => import("../components/public/Contact"));
const FaqPage = lazy(() => import("../components/public/FAQ"));
const Technology = lazy(() => import("../components/public/Technology"));
const Blog = lazy(() => import("../components/public/Blog"));
const BlogPost1 = lazy(() => import("../components/public/blog/BlogPost1"));
const BlogPost2 = lazy(() => import("../components/public/blog/BlogPost2"));
const BlogPost3 = lazy(() => import("../components/public/blog/BlogPost3"));
const BlogPost4 = lazy(() => import("../components/public/blog/BlogPost4"));
const BlogPost5 = lazy(() => import("../components/public/blog/BlogPost5"));
const BlogPost6 = lazy(() => import("../components/public/blog/BlogPost6"));
const BlogPost7 = lazy(() => import("../components/public/blog/BlogPost7"));
const PrivacyPolicy = lazy(() => import("../components/public/PrivacyPolicy"));
const LegalNotice = lazy(() => import("../components/public/LegalNotice"));
const CookiesPolicy = lazy(() => import("../components/public/CookiesPolicy"));

// Auth Pages - lazy loading
const Login = lazy(() => import("../components/auth/Login"));
const AppLogin = lazy(() => import("../components/auth/AppLogin"));

// Admin Pages - lazy loading
const DashboardMain = lazy(() =>
    import("../components/admin/dashboard/DashboardMain")
);
const ClientsList = lazy(() =>
    import("../components/admin/clients/ClientsList")
);
const ClientDetail = lazy(() =>
    import("../components/admin/clients/ClientDetail")
);
const EmployeesList = lazy(() =>
    import("../components/admin/employees/EmployeesList")
);
const RoutesPlanner = lazy(() =>
    import("../components/admin/routes/RoutesPlanner")
);
const Inventory = lazy(() => import("../components/admin/inventory/Inventory"));
const Accounting = lazy(() =>
    import("../components/admin/accounting/Accounting")
);
const Documents = lazy(() => import("../components/admin/documents/Documents"));
const Cms = lazy(() => import("../components/admin/cms/Cms"));
const ComplaintsList = lazy(() =>
    import("../components/admin/complaints/ComplaintsList")
);
const ExtraJobsList = lazy(() =>
    import("../components/admin/extras/ExtraJobsList")
);
const ObservationsList = lazy(() =>
    import("../components/admin/observations/ObservationsList")
);
const RatingsStats = lazy(() =>
    import("../components/admin/ratings/RatingsStats")
);

const EmployeeDetail = lazy(() =>
    import("../components/admin/employees/EmployeeDetail")
);
const AdminCalendar = lazy(() =>
    import("../components/admin/calendar/AdminCalendar")
);
const ProfileSettings = lazy(() =>
    import("../components/admin/ProfileSettings")
);

// Client Pages - lazy loading
const ClientDashboard = lazy(() =>
    import("../components/client/ClientDashboard")
);
const ClientCalendar = lazy(() =>
    import("../components/client/ClientCalendar")
);
const ClientRequests = lazy(() =>
    import("../components/client/ClientRequests")
);
const ClientExtraJobs = lazy(() =>
    import("../components/client/ClientExtraJobs")
);
const ClientDocuments = lazy(() =>
    import("../components/client/ClientDocuments")
);
const ClientCompletedJobs = lazy(() =>
    import("../components/client/ClientCompletedJobs")
);
const ClientSettings = lazy(() =>
    import("../components/client/ClientSettings")
);

// Employee Pages - lazy loading
const EmployeeDashboard = lazy(() =>
    import("../components/employee/EmployeeDashboard")
);
const EmployeeSchedulePage = lazy(() =>
    import("../components/employee/EmployeeSchedulePage")
);
const EmployeeTaskDetail = lazy(() =>
    import("../components/employee/EmployeeTaskDetail")
);
const EmployeeInventory = lazy(() =>
    import("../components/employee/EmployeeInventory")
);
const EmployeeDocuments = lazy(() =>
    import("../components/employee/EmployeeDocuments")
);
const MyRatings = lazy(() => import("../components/employee/MyRatings"));
const EmployeeSettings = lazy(() =>
    import("../components/employee/EmployeeSettings")
);

// Other Pages - lazy loading
const AccessDenied = lazy(() => import("../components/common/AccessDenied"));

// Skeleton loaders for better UX
// import { BlogListSkeleton } from '../components/common/skeletons/BlogSkeleton';
// import { DashboardGridSkeleton } from '../components/common/skeletons/DashboardSkeleton';
// import { TableSkeleton } from '../components/common/skeletons/ListSkeleton';

function AppRoutes() {
    const { user, userRole, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                {/* Rutas Públicas */}
                <Route path="/" element={<PublicLayout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="services" element={<Services />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="faq" element={<FaqPage />} />
                    <Route path="tecnologia" element={<Technology />} />
                    <Route path="blog" element={<Blog />} />
                    <Route
                        path="blog/como-mantener-limpia-comunidad-vecinos"
                        element={<BlogPost1 />}
                    />
                    <Route
                        path="blog/errores-comunes-limpiar-oficinas"
                        element={<BlogPost2 />}
                    />
                    <Route
                        path="blog/abrillantado-suelos-cuando-como"
                        element={<BlogPost3 />}
                    />
                    <Route
                        path="blog/limpieza-cristales-profesional-vs-casera"
                        element={<BlogPost4 />}
                    />
                    <Route
                        path="blog/checklist-limpieza-comunidades"
                        element={<BlogPost5 />}
                    />
                    <Route
                        path="blog/cuanto-cuesta-limpieza-comunidad-madrid"
                        element={<BlogPost6 />}
                    />
                    <Route
                        path="blog/por-que-contratar-empresa-limpieza-profesional"
                        element={<BlogPost7 />}
                    />
                    <Route path="privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="legal-notice" element={<LegalNotice />} />
                    <Route path="cookies-policy" element={<CookiesPolicy />} />
                </Route>

                {/* Login */}
                <Route
                    path="/login"
                    element={user && userRole
                        ? <Navigate to={getDashboardRoute(userRole)} replace />
                        : <Login />}
                />

                {/* App Login (Ruta App Nativa) */}
                <Route
                    path="/app-login"
                    element={user && userRole
                        ? <Navigate to={getDashboardRoute(userRole)} replace />
                        : <AppLogin />}
                />

                {/* Rutas Admin */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<DashboardMain />} />
                    <Route path="clients" element={<ClientsList />} />
                    <Route path="clients/:id" element={<ClientDetail />} />
                    <Route path="employees" element={<EmployeesList />} />
                    <Route path="employees/:id" element={<EmployeeDetail />} />
                    <Route path="routes" element={<RoutesPlanner />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="accounting" element={<Accounting />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="cms" element={<Cms />} />
                    <Route
                        path="complaints"
                        element={
                            <ComplaintsList
                                title="Gestión de Quejas e Incidencias"
                                allowedTypes={[
                                    "incidencia",
                                    "averia",
                                    "limpieza",
                                    "sugerencia",
                                    "administrativo",
                                    "otro",
                                ]}
                            />
                        }
                    />
                    <Route path="extra-jobs" element={<ExtraJobsList />} />
                    <Route path="observations" element={<ObservationsList />} />
                    <Route path="calendar" element={<AdminCalendar />} />
                    <Route path="settings" element={<ProfileSettings />} />
                    <Route path="ratings" element={<RatingsStats />} />
                </Route>

                {/* Rutas Cliente */}
                <Route
                    path="/client"
                    element={
                        <ProtectedRoute allowedRoles={["cliente"]}>
                            <ClientLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<ClientDashboard />} />
                    <Route path="calendar" element={<ClientCalendar />} />
                    <Route path="requests" element={<ClientRequests />} />
                    <Route path="extra-jobs" element={<ClientExtraJobs />} />
                    <Route path="documents" element={<ClientDocuments />} />
                    <Route path="history" element={<ClientCompletedJobs />} />
                    <Route path="settings" element={<ClientSettings />} />
                </Route>

                {/* Rutas Empleado */}
                <Route
                    path="/employee"
                    element={
                        <ProtectedRoute allowedRoles={["empleado"]}>
                            <EmployeeLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<EmployeeDashboard />} />
                    <Route path="route" element={<EmployeeSchedulePage />} />
                    <Route path="task/:id" element={<EmployeeTaskDetail />} />
                    <Route path="inventory" element={<EmployeeInventory />} />
                    <Route path="documents" element={<EmployeeDocuments />} />
                    <Route path="ratings" element={<MyRatings />} />
                    <Route path="settings" element={<EmployeeSettings />} />
                </Route>

                {/* Acceso Denegado */}
                <Route path="/access-denied" element={<AccessDenied />} />

                {/* 404 - Redirigir a Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
}

export default AppRoutes;
