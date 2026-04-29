import React from 'react';
import PacientesPage from '../pages/PacientesPage';
import AutorizacionPages from '../pages/AutorizacionPages';

export const rutasPacientes = [
  {
    path: 'pacientes',
    element: <PacientesPage />,
  },
  {
    path: 'pacientes/autorizacion/:id',
    element: <AutorizacionPages />,
  },
];
