import { Link, useLocation } from 'react-router-dom';
import { MapIcon, ClipboardDocumentListIcon, DocumentTextIcon, UserIcon, HomeIcon } from '@heroicons/react/24/outline';
import { 
    MapIcon as MapIconSolid, 
    ClipboardDocumentListIcon as ClipboardSolid, 
    DocumentTextIcon as DocumentSolid,
    UserIcon as UserSolid,
    HomeIcon as HomeSolid
} from '@heroicons/react/24/solid';

function EmployeeBottomNav() {
  const location = useLocation();

  const navItems = [
    { name: 'Inicio', path: '/employee', icon: HomeIcon, activeIcon: HomeSolid },
    { name: 'Ruta de Hoy', path: '/employee/route', icon: MapIcon, activeIcon: MapIconSolid },
    { name: 'Inventario', path: '/employee/inventory', icon: ClipboardDocumentListIcon, activeIcon: ClipboardSolid },
    { name: 'Documentos', path: '/employee/documents', icon: DocumentTextIcon, activeIcon: DocumentSolid },
    { name: 'Perfil', path: '/employee/settings', icon: UserIcon, activeIcon: UserSolid },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          // Check active state. Exact match for root, startsWith for others to handle sub-routes if any.
          // For '/employee', we want exact match or '/employee/' but not '/employee/inventory'.
          const isActive = item.path === '/employee' 
            ? location.pathname === '/employee' 
            : location.pathname.startsWith(item.path);

          const Icon = isActive ? item.activeIcon : item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default EmployeeBottomNav;
