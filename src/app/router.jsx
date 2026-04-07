import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import LoginPage from '../modules/auth/pages/LoginPage';
import useAuthStore from '../store/authStore';
import { rutasProtegidas } from './routesRegistry';

// Ruta protegida: requiere autenticación
function RutaProtegida({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Ruta de autenticación: redirige al panel si ya está logueado
function RutaAuth({ children }) {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/panel" replace />;
}

/**
 * Router principal — NO modificar para agregar módulos.
 * Para agregar rutas ve a: src/app/routesRegistry.jsx
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/panel" replace />,
  },
  {
    path: '/login',
    element: (
      <RutaAuth>
        <LoginPage />
      </RutaAuth>
    ),
  },
  {
    path: '/',
    element: (
      <RutaProtegida>
        <MainLayout />
      </RutaProtegida>
    ),
    children: rutasProtegidas,
  },
  {
    path: '*',
    element: <Navigate to="/panel" replace />,
  },
]);

export default router;
