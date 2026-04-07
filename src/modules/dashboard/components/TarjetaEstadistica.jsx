import React from 'react';

export default function TarjetaEstadistica({ nombre, valor, icono: Icono, colorIcono, fondoIcono }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group">
      <div className={`p-3.5 rounded-xl ${fondoIcono} transition-transform group-hover:scale-105`}>
        <Icono className={`w-6 h-6 ${colorIcono}`} />
      </div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">{nombre}</p>
        <p className="text-3xl font-black text-gray-900 leading-none tracking-tighter">{valor}</p>
      </div>
    </div>
  );
}
