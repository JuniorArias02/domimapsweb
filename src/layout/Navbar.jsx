import React from 'react';
import { Bell, Search, Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useUIStore from '../store/uiStore';
import useAuthStore from '../store/authStore';

export default function Navbar({ isMapRoute }) {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const cerrarSesion = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas salir de la aplicación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'rounded-[2rem] font-bold text-gray-900 border border-gray-100 shadow-xl p-8',
        confirmButton: 'bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg transition-all active:scale-95 outline-none border-none cursor-pointer mr-3',
        cancelButton: 'bg-gray-100 hover:bg-gray-200 text-gray-750 px-6 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg transition-all active:scale-95 outline-none border-none cursor-pointer'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/login');
      }
    });
  };

  return (
    <header 
      className={`flex items-center justify-between px-8 flex-shrink-0 transition-all duration-300 z-50 ${
        isMapRoute 
          ? 'absolute top-0 left-0 right-0 h-20 bg-transparent pointer-events-none' 
          : 'h-16 bg-white border-b border-gray-200'
      }`}
    >
      {/* Container izquierdo (Menú hamburguesa + Buscador opcional) */}
      <div className={`flex items-center gap-4 relative ${!isMapRoute ? 'w-96 max-w-sm' : 'pointer-events-auto mt-4 ml-4'}`}>
        <button 
          onClick={toggleSidebar}
          className={`p-2 rounded-lg transition-colors ${
            isMapRoute 
              ? 'bg-white shadow-md text-gray-700 hover:bg-gray-50' 
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Menu size={20} />
        </button>

        {/* Solo mostramos el buscador estático en rutas normales, se oculta en el mapa */}
        
      </div>

      {/* Container derecho (Usuario y Cerrar Sesión) */}
      <div className={`flex items-center gap-4 ${isMapRoute ? 'pointer-events-auto mt-4 mr-4' : ''}`}>
        {/* Notificación comentada/documentada según lo solicitado */}
        {/* 
        <button className={`p-2 rounded-lg relative transition-colors ${
          isMapRoute 
            ? 'bg-white shadow-md text-gray-700 hover:bg-gray-50' 
            : 'text-gray-500 hover:bg-gray-100'
        }`}>
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        */}

        {/* Datos del usuario */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-sm font-bold text-[#111827] capitalize leading-tight">
              {user?.nombre_completo?.toLowerCase() || 'Administrador'}
            </span>
            <span className="text-xs text-[#6B7280] leading-normal mt-0.5">
              {user?.rol?.nombre || 'ROL'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-bold text-sm shadow-sm border border-white">
            {user?.nombre_completo?.charAt(0) || 'A'}
          </div>
        </div>

        {/* Botón de cerrar sesión */}
        <button
          onClick={cerrarSesion}
          title="Cerrar sesión"
          className="p-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

