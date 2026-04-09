# 🧠 Arquitectura Frontend (React + Vite + Tailwind)



## 🎯 Objetivo
Definir una arquitectura modular, escalable y consistente para desarrollo asistido por IA.

## 📁 Estructura del proyecto

```bash
src/
 ├── api/              # configuración central de axios (baseURL, interceptores, headers, manejo de token)
 ├── app/              # configuración global de la app (providers, router principal, composición de rutas)
 │
 ├── config/           # variables globales (env, constantes de entorno, flags del sistema)
 ├── constants/        # llaves estáticas (queryKeys, roles, rutas base, nombres reutilizables)
 │
 ├── layout/           # layouts globales (MainLayout, AuthLayout, sidebar, navbar)
 ├── utils/            # funciones utilitarias puras (formatos, helpers, no lógica de negocio)
 │
 ├── store/            # estado global con zustand (auth, usuario, UI global como sidebar o tema)
 │
 ├── modules/          # arquitectura modular por dominio de negocio
 │    ├── {nombreModulo}/
 │    │    ├── components/   # componentes reutilizables SOLO dentro del módulo
 │    │    ├── hooks/        # lógica de UI del módulo (no llamadas directas a API)
 │    │    ├── pages/        # vistas principales (pantallas)
 │    │    ├── services/     # llamadas HTTP (axios) hacia backend
 │    │    ├── queries/      # integración con React Query (cache, fetching, estado async)
 │    │    ├── store/        # estado interno del módulo (si aplica, opcional)
 │    │    └── routes/       # definición de rutas del módulo (se integran al router global)
 │
 ├── types/            # (opcional) tipados o estructuras de datos compartidas (pensando en escalabilidad / TS)
```

---

## 🧠 Principios de Arquitectura

### 1. Modularidad
Cada funcionalidad debe vivir dentro de un módulo independiente.

### 2. Separación de responsabilidades
- UI ≠ lógica ≠ datos
- Cada capa tiene una función clara

### 3. Escalabilidad
El sistema debe permitir agregar módulos sin afectar los existentes.

---

## 🔥 Reglas estrictas (IA y desarrollo)

- ❌ No consumir axios directamente en componentes
- ❌ No mezclar lógica de negocio en components
- ❌ No acceder directamente al backend fuera de services

- ✅ Todo acceso a API debe pasar por `services/`
- ✅ Todo consumo de datos debe usar `queries/` (React Query)
- ✅ Estado global solo en `store/`
- ✅ Cada módulo debe ser independiente
- ✅ Las rutas deben definirse dentro de cada módulo

---

## 🧩 Flujo de datos correcto

```text
Component → Hook → Query → Service → API
```

---

## 🧠 Responsabilidades por carpeta

### api/
- Configuración de axios
- Interceptores (token, errores)
- Base URL global

---

### app/
- Providers globales (React Query, Router)
- Composición de rutas
- Configuración principal de la aplicación

---

### config/
- Variables de entorno
- Configuración centralizada

---

### constants/
- Query keys
- Roles
- Rutas base
- Strings reutilizables

---

### layout/
- Estructura visual global
- Sidebar, navbar, layouts

---

### utils/
- Funciones puras reutilizables
- Sin dependencias de negocio

---

### store/
- Zustand global
- Auth (usuario, token)
- UI global

---

### modules/
Cada módulo representa un dominio del negocio.

#### components/
Componentes internos del módulo

#### hooks/
Lógica de UI del módulo

#### pages/
Pantallas principales

#### services/
Peticiones HTTP (axios)

#### queries/
Uso de React Query (cache, fetching, estado)

#### store/
Estado local del módulo

#### routes/
Definición de rutas del módulo

---

### types/
- Interfaces o modelos de datos
- Preparación para migración a TypeScript

---

## 🧠 Reglas para IA (CRÍTICO)

> Toda nueva funcionalidad debe implementarse como un módulo independiente siguiendo la estructura definida.  
> No se permite lógica de negocio fuera de `modules`.

---

## 🚀 Stack tecnológico

- React (Vite)
- TailwindCSS
- Axios
- Zustand
- React Query

---

## ⚠️ Errores a evitar

- Mezclar lógica de negocio en componentes
- No usar React Query para datos remotos
- Crear dependencias entre módulos
- Repetir lógica en múltiples lugares

---

## 🧠 Resultado esperado

- Código limpio
- Escalable
- Mantenible
- IA guiada correctamente
