import React from 'react';
import AgendamientoListPage from '../pages/AgendamientoListPage';
import CrearAgendamientoPage from '../pages/CrearAgendamientoPage';
import CrearAgendamientoDos from '../pages/CrearAgendamientoDos';

export const rutasAgendamiento = [
  { path: 'agendamiento', element: <AgendamientoListPage /> },
  { path: 'agendamiento/nueva', element: <CrearAgendamientoPage /> },
  { path: 'agendamiento/nueva-dos', element: <CrearAgendamientoDos /> }
];
