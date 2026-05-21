import React, { useState, useEffect, useRef } from 'react';
import { Loader2, X, ChevronDown, Activity } from 'lucide-react';
import { useBuscarServiciosQuery } from '../queries/useBuscarServiciosQuery';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function BuscadorServicio({
  nombreServicio,
  onSeleccionar,
  onLimpiar,
  error
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const debouncedSearch = useDebounce(inputValue, 300);
  const wrapperRef = useRef(null);

  // Ejecutar búsqueda usando el query hook del módulo de registro de programa
  const { data: resultados, isLoading, isFetching } = useBuscarServiciosQuery(debouncedSearch);

  // Cerrar el dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (s) => {
    onSeleccionar(s);
    setIsOpen(false);
    setInputValue('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onLimpiar();
    setInputValue('');
    setIsOpen(false);
  };

  const isSearching = isLoading || isFetching;
  const showResults = isOpen && debouncedSearch.trim().length >= 2;

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div 
        className="relative group cursor-pointer"
        onClick={() => !nombreServicio && setIsOpen(true)}
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#2563EB] transition-colors">
          <Activity size={18} />
        </div>

        {nombreServicio ? (
          // Modo: Seleccionado
          <div className="w-full pl-11 pr-10 py-3 bg-blue-50/60 border border-blue-100 rounded-2xl text-sm font-bold text-gray-900 flex items-center shadow-inner min-h-[46px]">
            <span className="truncate flex-1 pr-2 uppercase text-xs leading-normal">{nombreServicio}</span>
            <button 
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          // Modo: Buscando
          <>
            <input
              type="text"
              placeholder="Buscar servicio por nombre o código..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              className={`w-full pl-11 pr-10 py-3 text-sm font-bold bg-white border rounded-2xl focus:outline-none focus:ring-4 transition-all ${
                error ? 'border-red-500 focus:ring-red-100' : 'border-gray-100 focus:border-blue-500 focus:ring-blue-500/10'
              }`}
            />
            {inputValue && (
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setInputValue('');
                }}
                className="absolute inset-y-0 right-8 pr-1 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={14} />
              </button>
            )}
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
              {isSearching && debouncedSearch.trim().length >= 2 ? (
                <Loader2 size={16} className="animate-spin text-[#2563EB]" />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>
          </>
        )}
      </div>

      {/* Resultados Popover */}
      {showResults && !nombreServicio && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
          {isSearching && (!resultados || resultados.length === 0) ? (
            <div className="p-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Buscando...
            </div>
          ) : resultados && resultados.length > 0 ? (
            <ul className="py-2">
              {resultados.map((s, index) => (
                <li 
                  key={s.id_servicio || index}
                  onClick={() => handleSelect(s)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors group flex flex-col"
                >
                  <p className="text-sm font-black text-gray-900 group-hover:text-[#2563EB] uppercase">
                    {s.nombre_servicio}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 mt-0.5">
                    CÓDIGO: {s.codigo_servicio}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No se encontraron servicios</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
