import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import router from './router';
import useAuthStore from '../store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  // Proactivamente revisar si el token expira mientras el usuario está en la app
  useEffect(() => {
    const checkAuthTimer = setInterval(() => {
      useAuthStore.getState().checkTokenExpiration();
    }, 30000); // Revisar cada 30 segundos

    // Validar en el montaje principal
    useAuthStore.getState().checkTokenExpiration();

    return () => clearInterval(checkAuthTimer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
