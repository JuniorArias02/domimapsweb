import React, { useState, useRef, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuthStore from '../../../store/authStore';

export default function MapUserMenu() {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsOpen(false);
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

  // Cierra el menú al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="absolute top-6 right-8 z-[400]" ref={menuRef}>
      {/* Botón del avatar estilo Google Maps */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Perfil de usuario"
        className="w-11 h-11 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-base shadow-lg border border-white hover:scale-105 hover:shadow-xl active:scale-95 transition-all cursor-pointer pointer-events-auto"
      >
        {user?.nombre_completo?.charAt(0) || 'A'}
      </button>

      {/* Menú desplegable flotante */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 p-4 animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-auto">
          {/* Detalles del usuario */}
          <div className="flex flex-col items-center text-center pb-4 border-b border-gray-100">
            <div className="w-14 h-14 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xl shadow-md mb-2">
              {user?.nombre_completo?.charAt(0) || 'A'}
            </div>
            <p className="text-sm font-bold text-[#111827] capitalize max-w-full truncate">
              {user?.nombre_completo?.toLowerCase() || 'Administrador'}
            </p>
            <p className="text-xs text-[#6B7280] mt-0.5 max-w-full truncate">
              {user?.rol?.nombre || 'ROL'}
            </p>
          </div>

          {/* Opciones */}
          <div className="pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
