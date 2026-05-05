import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X, ChevronDown } from 'lucide-react';

/**
 * Hook para manejar debounce local
 */
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

/**
 * Componente AsyncSearchSelect
 * 
 * @param {Function} useQueryHook - El hook de react-query a usar (ej: useIngresosBusqueda)
 * @param {string} placeholder - Texto del placeholder
 * @param {Function} onSelect - Callback cuando se selecciona un item (recibe el item completo)
 * @param {Function} renderOption - Función para renderizar cada opción en la lista `(item) => ReactNode`
 * @param {string} valueDisplay - El texto a mostrar en el input cuando hay algo seleccionado
 * @param {Function} onClear - Callback para cuando se borra la selección
 * @param {ReactNode} icon - Icono de Lucide (opcional)
 */
export default function AsyncSearchSelect({
  useQueryHook,
  placeholder = 'Buscar...',
  onSelect,
  renderOption,
  valueDisplay = '',
  onClear,
  icon: Icon = Search,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const debouncedSearch = useDebounce(inputValue, 400);
  const wrapperRef = useRef(null);

  // Ejecutar el hook de búsqueda
  const { data: results, isLoading, isFetching } = useQueryHook(debouncedSearch);

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

  // Sincronizar el input con el valor seleccionado externo si cambia a vacío
  useEffect(() => {
    if (!valueDisplay) {
      setInputValue('');
    }
  }, [valueDisplay]);

  const handleSelect = (item) => {
    onSelect(item);
    setIsOpen(false);
    setInputValue('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onClear) onClear();
    setInputValue('');
    setIsOpen(false);
  };

  const isSearching = isLoading || isFetching;
  const showResults = isOpen && debouncedSearch.length >= 2;

  return (
    <div className={`relative w-full ${className}`} ref={wrapperRef}>
      
      {/* Input de Búsqueda o Valor Seleccionado */}
      <div 
        className="relative group cursor-pointer"
        onClick={() => !valueDisplay && setIsOpen(true)}
      >
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2563EB] transition-colors">
          <Icon size={16} />
        </div>
        
        {valueDisplay ? (
          // Modo: Valor Seleccionado
          <div className="w-full pl-10 pr-10 py-3 bg-blue-50 border border-blue-100 rounded-xl text-sm font-black text-gray-900 flex items-center shadow-inner min-h-[48px]">
            <span className="line-clamp-2 flex-1 leading-snug break-words pr-2">{valueDisplay}</span>
            <button 
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          // Modo: Buscando
          <>
            <input
              type="text"
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all text-sm font-medium"
            />
            {inputValue && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setInputValue('');
                }}
                className="absolute inset-y-0 right-8 pr-1 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={14} />
              </button>
            )}
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              {isSearching && debouncedSearch.length >= 2 ? (
                <Loader2 size={16} className="animate-spin text-[#2563EB]" />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>
          </>
        )}
      </div>

      {/* Resultados Popover */}
      {showResults && !valueDisplay && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 max-h-60 overflow-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
          
          {isSearching && (!results || results.length === 0) ? (
            <div className="p-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Buscando...
            </div>
          ) : results && results.length > 0 ? (
            <ul className="py-2">
              {results.map((item, index) => (
                <li 
                  key={item.id_ingreso || item.id_servicio || item.id_personal || index}
                  onClick={() => handleSelect(item)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors group"
                >
                  {renderOption(item)}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No se encontraron resultados</p>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
