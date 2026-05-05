import React from 'react';
import AgendamientoListPage from '../pages/AgendamientoListPage';
import CrearAgendamientoPage from '../pages/CrearAgendamientoPage';

export const rutasAgendamiento = [
  { path: 'agendamiento', element: <AgendamientoListPage /> },
  { path: 'agendamiento/nueva', element: <CrearAgendamientoPage /> }
];
