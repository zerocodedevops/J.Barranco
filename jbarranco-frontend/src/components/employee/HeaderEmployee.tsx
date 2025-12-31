import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";

function HeaderEmployee() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="bg-brand-blue text-white shadow-md relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo a la izquierda (Colgando) */}
        <div className="flex items-center w-1/3">
          <Link to="/employee" className="flex-shrink-0 relative z-50">
            <img
              className="h-[100px] w-auto translate-y-[29px] cursor-pointer"
              src="/logo-light.png"
              alt="J.Barranco"
            />
          </Link>
        </div>

        {/* User Avatar Centered */}
        <div className="flex items-center justify-center w-1/3">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium hidden md:inline-block">
              {user?.displayName || "Empleado"}
            </span>
            <img
              className="h-9 w-9 rounded-full border-2 border-white/20"
              src={user?.photoURL ||
                `https://ui-avatars.com/api/?name=${
                  user?.displayName || "Employee"
                }&background=ffffff&color=0D47A1`}
              alt="Perfil"
            />
          </div>
        </div>

        {/* Botones Derecha: Salir */}
        <div className="flex items-center justify-end space-x-4 w-1/3">
          {/* Salir */}
          <button
            onClick={handleLogout}
            className="p-1 rounded-full text-gray-300 hover:text-white focus:outline-none"
            title="Cerrar sesión"
          >
            <span className="sr-only">Cerrar sesión</span>
            <ArrowRightStartOnRectangleIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default HeaderEmployee;
