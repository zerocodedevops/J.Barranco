import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, CalendarIcon, ChatBubbleLeftRightIcon, BriefcaseIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { 
    HomeIcon as HomeSolid,
    CalendarIcon as CalendarSolid, 
    ChatBubbleLeftRightIcon as ChatSolid, 
    BriefcaseIcon as BriefcaseSolid,
    DocumentTextIcon as DocumentSolid 
} from '@heroicons/react/24/solid';

const ClientBottomNav = () => {
  const { pathname } = useLocation();

  const navItems = [
    { name: 'Inicio', path: '/client', icon: HomeIcon, activeIcon: HomeSolid },
    { name: 'Mi Calendario', path: '/client/calendar', icon: CalendarIcon, activeIcon: CalendarSolid },
    { name: 'Solicitudes', path: '/client/requests', icon: ChatBubbleLeftRightIcon, activeIcon: ChatSolid },
    { name: 'Trabajos', path: '/client/extra-jobs', icon: BriefcaseIcon, activeIcon: BriefcaseSolid },
    { name: 'Documentos', path: '/client/documents', icon: DocumentTextIcon, activeIcon: DocumentSolid },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          // Determina si el item está activo
          // Para "Inicio" (/client), coincidencia exacta o /client/ (pero no otras subrutas si se quiere estricto)
          // Para otros, startsWith funciona bien.
          const isActive = item.path === '/client' 
            ? pathname === '/client' || pathname === '/client/' 
            : pathname.startsWith(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-brand-blue' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-[10px] font-medium truncate max-w-[70px] leading-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default ClientBottomNav;
