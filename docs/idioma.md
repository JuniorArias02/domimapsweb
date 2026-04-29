# 🌎 Convención de Idioma en el Proyecto

## 🎯 Objetivo

Definir una convención clara y consistente para el uso del idioma en el proyecto, asegurando claridad tanto para desarrolladores como para herramientas de IA.

---

## 🧱 Estructura base del proyecto (Core)

El núcleo del proyecto debe mantenerse en **inglés**, ya que sigue estándares globales del ecosistema frontend.

```bash
api/
app/
config/
constants/
layout/
utils/
store/
modules/
```

---

## 🧩 Dominios de negocio (modules)

Los módulos deben nombrarse en **español**, ya que representan el dominio del negocio.

```bash
modules/
 ├── pacientes/
 ├── citas/
 ├── usuarios/
 ├── facturacion/
 ├── geolocalizacion/
```

---

## 📁 Estructura interna de módulos

Todo el contenido dentro de cada módulo debe estar en **español**.

```bash
pacientes/
 ├── components/
 │    ├── PacienteCard.jsx
 │    ├── PacienteForm.jsx
 │
 ├── hooks/
 │    ├── usePacientes.js
 │
 ├── pages/
 │    ├── PacientesPage.jsx
 │    ├── DetallePacientePage.jsx
 │
 ├── services/
 │    ├── pacientesService.js
 │
 ├── queries/
 │    ├── usePacientesQuery.js
 │
 ├── store/
 │    ├── pacientesStore.js
 │
 ├── routes/
 │    ├── pacientesRoutes.jsx
```

---

## 🧠 Reglas de nomenclatura

### ✅ Correcto (en español)

* Funciones: `obtenerPacientes()`
* Hooks: `usePacientes()`
* Componentes: `PacientesPage`
* Variables: `listaPacientes`

---

### ❌ Incorrecto (mezcla de idiomas)

* `getPatients()`
* `PatientsPage`
* `usePatients()`

---

## ⚠️ Excepciones (mantener en inglés)

Las siguientes cosas deben permanecer en inglés por estándar técnico:

* Librerías externas (`axios`, `react-query`, etc.)
* Props de React (`onClick`, `className`, etc.)
* APIs de librerías (`useQuery`, `useState`, etc.)

---

## 🧠 Beneficios

* Código alineado con el negocio
* Mayor claridad para el equipo
* Mejor integración con IA
* Evita mezcla inconsistente de idiomas
* Mantiene estándares técnicos globales

---

## 🧠 Regla final

> El dominio del negocio habla en español.
> La tecnología base se mantiene en inglés.
