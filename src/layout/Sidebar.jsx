import React from 'react';
import { Heart, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useUIStore from '../store/uiStore';
import { itemsNavegacion, itemsNavegacionSecundaria } from '../constants/navegacion';

function ItemNavegacion({ icono: Icono, etiqueta, ruta }) {
  return (
    <NavLink
      to={ruta}
      className={({ isActive }) =>
        `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
          isActive
            ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
        }`
      }
    >
      <Icono size={20} />
      {etiqueta}
    </NavLink>
  );
}

export default function Sidebar() {
  const { logout, user } = useAuthStore();
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const navigate = useNavigate();

  const cerrarSesion = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside 
      className={`bg-white border-r border-gray-200 hidden md:flex flex-col flex-shrink-0 transition-all duration-300 z-50 overflow-hidden ${
        isSidebarOpen ? 'w-64' : 'w-0 border-r-0 opacity-0'
      }`}
    >
      <div className="p-6 flex-1 min-w-[16rem]">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center">
            <Heart className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-[#111827]">Domiciliaria</span>
        </div>

        {/* Navegación principal */}
        <nav className="space-y-1">
          {itemsNavegacion.map((item) => (
            <ItemNavegacion key={item.ruta} {...item} />
          ))}
          <div className="pt-4 mt-4 border-t border-gray-100">
            {itemsNavegacionSecundaria.map((item) => (
              <ItemNavegacion key={item.ruta} {...item} />
            ))}
          </div>
        </nav>
      </div>

      {/* Usuario */}
      <div className="p-4 border-t border-gray-200 bg-gray-50/50">
        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-bold text-sm">
            {user?.nombre_completo?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate capitalize">
              {user?.nombre_completo?.toLowerCase() || 'Administrador'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.rol?.nombre || 'ROL'}</p>
          </div>
        </div>
        <button
          onClick={cerrarSesion}
          className="w-full mt-4 flex items-center gap-2 p-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
