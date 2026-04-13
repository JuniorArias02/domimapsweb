import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import useUIStore from '../store/uiStore';

export default function Navbar({ isMapRoute }) {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

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

      {/* Container derecho (Notificaciones, etc) */}
      <div className={`flex items-center gap-4 ${isMapRoute ? 'pointer-events-auto mt-4 mr-4' : ''}`}>
        <button className={`p-2 rounded-lg relative transition-colors ${
          isMapRoute 
            ? 'bg-white shadow-md text-gray-700 hover:bg-gray-50' 
            : 'text-gray-500 hover:bg-gray-100'
        }`}>
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
      </div>
    </header>
  );
}
