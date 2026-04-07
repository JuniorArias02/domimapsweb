import React from 'react';
import { Clock } from 'lucide-react';

export default function FilaVisita({ nombre, servicio, hora, estado, colorEstado }) {
  return (
    <tr className="hover:bg-emerald-50/30 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs uppercase shadow-inner">
            {nombre.charAt(0)}
          </div>
          <span className="text-[13px] font-black text-gray-900 group-hover:text-blue-600 transition-colors">{nombre}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-[12px] text-gray-500 font-bold uppercase tracking-wide">{servicio}</td>
      <td className="px-6 py-4 text-[12px] text-gray-900 font-black">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-[#10B981]" />
          {hora}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${colorEstado}`}>
          {estado}
        </span>
      </td>
    </tr>
  );
}
