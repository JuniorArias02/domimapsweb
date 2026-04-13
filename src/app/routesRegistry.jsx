/**
 * 📋 REGISTRO CENTRAL DE RUTAS
 *
 * Este es el ÚNICO archivo que se edita al crear un nuevo módulo.
 * Pasos para agregar un módulo:
 *   1. Crea tu módulo en src/modules/{nombreModulo}/routes/{nombreModulo}Routes.jsx
 *   2. Importa las rutas aquí abajo en la sección de imports
 *   3. Agrégalas al array rutasProtegidas con un spread: ...rutasTuModulo
 *
 * El router.jsx NO se toca nunca.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';

// ─── Importa aquí las rutas de cada módulo ────────────────────────────────────
import { rutasDashboard } from '../modules/dashboard/routes/dashboardRoutes';
import { rutasMapa }      from '../modules/mapa/routes/mapaRoutes';
import { rutasPacientes }   from '../modules/pacientes/routes/pacientesRoutes';
import { rutasAgenda }      from '../modules/agenda/routes/agendaRoutes';
// import { rutasCitas }       from '../modules/citas/routes/citasRoutes';
// import { rutasUsuarios }    from '../modules/usuarios/routes/usuariosRoutes';
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Rutas hijas del layout protegido (MainLayout).
 * El primaryRedirect lleva al usuario a la ruta por defecto.
 */
export const rutasProtegidas = [
  // Redirección por defecto: / → /panel
  { index: true, element: <Navigate to="panel" replace /> },

  // ─── Agrega las rutas de cada módulo aquí ───────────────────────────────
  ...rutasDashboard,
  ...rutasMapa,
  ...rutasPacientes,
  ...rutasAgenda,
  // ...rutasCitas,
  // ...rutasUsuarios,
  // ────────────────────────────────────────────────────────────────────────
];
