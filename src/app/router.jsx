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

// Ruta de fallback: Evalúa el login para llevarte a tu panel o botarte al login
function RutaCatchAll() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/panel" replace /> : <Navigate to="/login" replace />;
}

/**
 * Router principal — NO modificar para agregar módulos.
 * Para agregar rutas ve a: src/app/routesRegistry.jsx
 */
const router = createBrowserRouter([
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
    children: [
      // Redirigir la raíz exacta a panel si entra a '/'
      { index: true, element: <Navigate to="/panel" replace /> },
      ...rutasProtegidas
    ],
  },
  {
    // Cualquier otra ruta que ponga mal el usuario (Ej: /asdf)
    path: '*',
    element: <RutaCatchAll />,
  },
]);

export default router;
