import React from 'react';
import AgendaListPage from '../pages/AgendaListPage';
import CrearAgendaPage from '../pages/CrearAgendaPage';

export const rutasAgenda = [
  { path: 'agenda', element: <AgendaListPage /> },
  { path: 'agenda/nueva', element: <CrearAgendaPage /> }
];
