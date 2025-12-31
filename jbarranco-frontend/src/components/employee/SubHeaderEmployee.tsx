import { useLocation, Link } from 'react-router-dom';

function SubHeaderEmployee() {
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    if (pathname === '/employee' || pathname === '/employee/') return '';
    if (pathname.includes('/route')) return 'Mi Ruta';
    if (pathname.includes('/inventory')) return 'Solicitar Material';
    if (pathname.includes('/documents')) return 'Documentos';
    if (pathname.includes('/settings')) return 'Perfil';
    return 'Panel de Empleado';
  };

  const title = getPageTitle(location.pathname);

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-end h-[60px]">
         {/* Mobile Title (Right/Center) */}
         <h1 className="text-lg font-semibold text-gray-800 lg:hidden ml-auto">{title}</h1>

         {/* Desktop Centered Navigation */}
         <nav className="hidden lg:flex items-center justify-center space-x-8 w-full">
            <Link to="/employee" className={`text-sm font-medium hover:text-brand-blue ${location.pathname === '/employee' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-500'}`}>Inicio</Link>
            <Link to="/employee/route" className={`text-sm font-medium hover:text-brand-blue ${location.pathname.includes('/route') ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-500'}`}>Mi Ruta</Link>
            <Link to="/employee/inventory" className={`text-sm font-medium hover:text-brand-blue ${location.pathname.includes('/inventory') ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-500'}`}>Inventario</Link>
            <Link to="/employee/documents" className={`text-sm font-medium hover:text-brand-blue ${location.pathname.includes('/documents') ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-500'}`}>Documentos</Link>
            <Link to="/employee/settings" className={`text-sm font-medium hover:text-brand-blue ${location.pathname.includes('/settings') ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-500'}`}>Perfil</Link>
         </nav>
      </div>
    </div>
  );
}

export default SubHeaderEmployee;