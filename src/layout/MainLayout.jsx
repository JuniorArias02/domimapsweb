import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import useUIStore from '../store/uiStore';

export default function MainLayout() {
  const location = useLocation();
  const isMapRoute = location.pathname.includes('/mapa');
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);

  // Auto contraer y expandir sidebar según si estamos en mapa o no
  useEffect(() => {
    if (isMapRoute) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMapRoute, setSidebarOpen]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex relative overflow-hidden">
      <Sidebar />
      <main className="relative flex-1 flex flex-col h-screen h-[100dvh] overflow-hidden min-w-0 transition-all duration-300">
        <Navbar isMapRoute={isMapRoute} />
        <div className={`flex-1 overflow-y-auto relative ${isMapRoute ? 'p-0' : 'p-8'}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

