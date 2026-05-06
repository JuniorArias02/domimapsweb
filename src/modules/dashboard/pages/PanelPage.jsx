import React from 'react';
import { useDashboardQuery } from '../queries/useDashboardQuery';
import DashboardPrincipal from '../components/DashboardPrincipal';
import DashboardIndicadores from '../components/DashboardIndicadores';


export default function PanelPage() {
  const [activeTab, setActiveTab] = React.useState('principal');
  const { data, isLoading, isError } = useDashboardQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Cargando panel...</span>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-red-500 font-bold p-8 text-center bg-red-50 border border-red-100 rounded-2xl max-w-sm">
          Ocurrió un error cargando los datos del dashboard.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight">Panel de Control</h1>
          <p className="text-sm font-medium text-[#6B7280] mt-1 tracking-tight">Gestión operativa y visión de red en tiempo real</p>
        </div>

        {/* Tab Selector / Slider style */}
        <div className="relative inline-flex p-1.5 bg-gray-100/80 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-inner w-fit overflow-hidden">
          {/* Fondo deslizante (Slider) */}
          <div 
            className={`absolute top-1.5 left-1.5 h-[calc(100%-12px)] w-[calc(50%-6px)] bg-white rounded-xl shadow-md transition-all duration-500 ease-in-out z-0 ${
              activeTab === 'principal' ? 'translate-x-0' : 'translate-x-full'
            }`}
          />

          <button
            onClick={() => setActiveTab('principal')}
            className={`relative z-10 px-10 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'principal'
                ? 'text-blue-600 scale-105'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Principal
          </button>
          <button
            onClick={() => setActiveTab('indicadores')}
            className={`relative z-10 px-10 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'indicadores'
                ? 'text-blue-600 scale-105'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Indicadores
          </button>
        </div>
      </div>

      {activeTab === 'principal' ? (
        <DashboardPrincipal data={data} />
      ) : (
        <DashboardIndicadores />
      )}
    </div>
  );
}
