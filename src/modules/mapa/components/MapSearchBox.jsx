import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, User, MapPin, Loader2, X, Menu } from 'lucide-react';
import { useMapaStore } from '../store/mapaStore';
import { usePacientesQuery } from '../../pacientes/queries/usePacientesQuery';
import useUIStore from '../../../store/uiStore';

export default function MapSearchBox() {
  const { mostrarPacientes, toggleMostrarPacientes, seleccionarPaciente } = useMapaStore();
  const toggleGlobalSidebar = useUIStore((state) => state.toggleSidebar);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Debounce para evitar llamadas innecesarias al API
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const queryParams = useMemo(() => {
    if (!debouncedSearch.trim() || debouncedSearch.length < 2) return null;
    const isNumber = /^[0-9]+$/.test(debouncedSearch.trim());
    return {
      pagina: 1,
      por_pagina: 5,
      [isNumber ? 'identificacion' : 'nombre']: debouncedSearch.trim()
    };
  }, [debouncedSearch]);

  const { data: searchData, isFetching } = usePacientesQuery(
    queryParams || { pagina: 1 }, 
    { enabled: !!queryParams }
  );

  const searchResults = searchData?.data || [];

  const handleSelectPaciente = (paciente) => {
    setSearchTerm('');
    setDebouncedSearch('');
    setIsDropdownOpen(false);
    
    // Cerramos teclado (Mobile)
    document.activeElement?.blur();
    
    // Seleccionar paciente puntualmente y que el mapa vuele a él
    setTimeout(() => {
      seleccionarPaciente(paciente.id_paciente, paciente);
    }, 100);
  };

  // Click fuera para cerrar el menú flotante
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[400px] max-w-[90vw] z-[400]" ref={dropdownRef}>
      <div className="relative w-full shadow-lg rounded-2xl bg-white/95 backdrop-blur-md border border-gray-100 flex items-center overflow-hidden transition-all hover:shadow-xl">
        <button 
          onClick={toggleGlobalSidebar}
          className="pl-4 pr-3 py-4 text-gray-500 hover:text-[#2563EB] transition-colors bg-transparent border-none outline-none focus:outline-none"
          title="Menú Principal"
        >
           <Menu size={22} />
        </button>
        <input
          type="text"
          placeholder="Buscar paciente en el mapa..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => {
            if (searchTerm.length >= 2) setIsDropdownOpen(true);
          }}
          className="w-full py-3.5 pr-10 text-sm font-bold text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
        />
        
        {searchTerm && (
          <button 
            onClick={() => {
              setSearchTerm('');
              setIsDropdownOpen(false);
            }}
            className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Menú Flotante de Resultados */}
      {isDropdownOpen && searchTerm.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden max-h-[400px] flex flex-col animate-in slide-in-from-top-2 duration-200">
          {isFetching ? (
            <div className="flex items-center justify-center p-8 text-gray-400">
              <Loader2 size={24} className="animate-spin text-blue-500" />
              <span className="ml-3 text-sm font-medium">Buscando...</span>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2 overflow-y-auto w-full">
              <div className="px-5 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                Sugerencias ({searchResults.length})
              </div>
              {searchResults.map((paciente) => (
                <button
                  key={paciente.id_paciente}
                  onClick={() => handleSelectPaciente(paciente)}
                  className="w-full text-left px-5 py-3 hover:bg-blue-50/80 flex items-start gap-4 transition-colors border-b border-gray-50 last:border-0 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                    <User size={18} />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center h-full pt-0.5">
                    <p className="text-sm font-bold text-gray-900 truncate leading-tight">
                      {paciente.nombre_completo}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate flex items-center gap-1.5 mt-1.5 font-medium">
                      <MapPin size={12} className="text-gray-400" />
                      {paciente.comuna?.nombre || 'Sin clasificación'} • #{paciente.identificacion}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-1">
                <Search size={20} />
              </div>
              <p className="text-sm font-bold text-gray-900">Sin resultados</p>
              <p className="text-xs text-gray-500">No encontramos coincidencias para "{searchTerm}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
