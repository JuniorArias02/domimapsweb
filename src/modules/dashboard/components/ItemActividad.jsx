import React from 'react';

export default function ItemActividad({ etiqueta, tiempo, icono: Icono, color }) {
  return (
    <div className="flex gap-4 items-center group cursor-pointer hover:bg-gray-50/50 p-2 -mx-2 rounded-xl transition-colors">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${color}`}>
        <Icono size={18} />
      </div>
      <div>
        <p className="text-[13px] font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{etiqueta}</p>
        <p className="text-[11px] font-bold text-gray-400 mt-0.5">{tiempo}</p>
      </div>
    </div>
  );
}
