import React from 'react';
import RegistroProgramaPage from '../pages/RegistroProgramaPage';
import AutorizacionPacientePage from '../pages/AutorizacionPacientePage';

export const rutasAgendamientoPaciente = [
  {
    path: 'RegistroAlPrograma',
    element: <RegistroProgramaPage />,
  },
  {
    path: 'registro-programa/paciente/:id/autorizaciones',
    element: <AutorizacionPacientePage />,
  }
];
