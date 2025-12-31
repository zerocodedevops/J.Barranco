import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

function PublicHeader() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Inicio', path: '/' },
        { name: 'Quiénes Somos', path: '/about' },
        { name: 'Servicios', path: '/services' },
        { name: 'Tecnología', path: '/tecnologia' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Blog', path: '/blog' },
        { name: 'Contacto', path: '/contact' },
    ];

    const handleLoginClick = () => {
        navigate('/login');
        setMobileMenuOpen(false);
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/');
            setMobileMenuOpen(false);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const handleNavClick = () => {
        setMobileMenuOpen(false);
    };

    return (
        <header className="bg-gradient-to-r from-brand-blue to-blue-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center pl-[30px]">
                {/* Logo - Tamaño y posición fijos (Igual en Móvil y PC) */}
                <Link to="/" className="flex-shrink-0 relative z-50">
                    <img
                        className="h-[100px] w-auto translate-y-[29px] cursor-pointer"
                        src="/logo-light.png"
                        alt="J.Barranco - Limpieza de Comunidades"
                    />
                </Link>

                {/* Navegación Desktop */}
                <nav className="hidden md:flex space-x-8">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`${isActive
                                    ? 'text-white border-b-2 border-white'
                                    : 'text-gray-300 hover:text-white'
                                    } px-3 py-2 text-sm font-medium transition-colors`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Botón de Acceso / Usuario - Desktop */}
                <div className="hidden md:block relative z-50">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-200">{user.email}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                             aria-label="Cerrar sesión">
                                Cerrar Sesión
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleLoginClick}
                            className="bg-white text-brand-blue hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Acceso Clientes
                        </button>
                    )}
                </div>

                {/* Botón Hamburguesa - Mobile (Posicionado en el SubHeader) */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden absolute right-4 top-[78px] p-2 rounded-md text-brand-blue hover:bg-gray-100 transition-colors z-50"
                    aria-label="Abrir menú de navegación" 
                    aria-expanded={mobileMenuOpen}>
                    {mobileMenuOpen ? (
                        <XMarkIcon className="h-8 w-8" />
                    ) : (
                        <Bars3Icon className="h-8 w-8" />
                    )}
                </button>
            </div>

            {/* Menú Mobile - Desplegable debajo del SubHeader */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-[128px] left-0 w-full bg-brand-blue border-t border-blue-500 shadow-xl z-40">
                    <nav className="px-4 pt-2 pb-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={handleNavClick}
                                    className={`${isActive
                                        ? 'bg-blue-700 text-white'
                                        : 'text-gray-200 hover:bg-blue-700 hover:text-white'
                                        } block px-3 py-2 rounded-md text-base font-medium transition-colors`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                        
                        {/* Botón de Login/Logout en Mobile */}
                        <div className="pt-4 border-t border-blue-500">
                            {user ? (
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-300 px-3">{user.email}</p>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleLoginClick}
                                    className="w-full text-left bg-white text-brand-blue hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium transition-colors"
                                >
                                    Acceso Clientes
                                </button>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

export default PublicHeader;