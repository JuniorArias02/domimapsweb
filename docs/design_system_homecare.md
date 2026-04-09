# 🎨 Design System - Atención Domiciliaria (Nivel Empresa)
iconos lucide-react
## 🎯 Concepto
El sistema debe transmitir:
- Confianza
- Salud
- Calma
- Profesionalismo

---

## 🎨 Paleta de colores

### 🔵 Primario
- #2563EB (Azul principal)
- #1E40AF (Hover / activo)

### 🟢 Secundario
- #16A34A (Éxito / estados positivos)

### ⚪ Neutros
- #F9FAFB (Fondo general)
- #FFFFFF (Cards)
- #E5E7EB (Bordes)
- #6B7280 (Texto secundario)
- #111827 (Texto principal)

### 🧠 Regla de uso
- 70% blanco / gris
- 20% azul
- 10% verde

---

## 🔤 Tipografía

- Fuente: Inter (recomendada)
- Alternativa: Roboto

```css
font-family: 'Inter', sans-serif;
```

---

## 🧱 Layout

Estructura tipo dashboard:

- Sidebar (izquierda, fijo)
- Navbar (arriba, ligero)
- Contenido (derecha)

---

## 🧩 Componentes

### 🟦 Cards
- Fondo blanco
- Bordes suaves
- Sombra ligera

```css
rounded-2xl shadow-sm border
```

---

### 🔘 Botones

#### Primario
- Fondo azul
- Texto blanco

#### Secundario
- Fondo gris claro
- Texto oscuro

---

### 🧾 Inputs
- Borde gris
- Focus azul

---

## 🧩 Iconos

Librería: Lucide

Iconos sugeridos:
- user → pacientes
- home → dashboard
- calendar → citas
- file-text → historia clínica
- settings → configuración

Estilo:
- Tamaño: 20px - 24px
- Stroke normal

---

## 🎨 Fondo

✔ Correcto:
- Gris claro (#F9FAFB)

❌ Evitar:
- Colores saturados
- Degradados fuertes

---

## 🧠 UX

### Espaciado
- Usar padding amplio
- Evitar elementos pegados

### Jerarquía
- Títulos grandes
- Subtítulos en gris
- Contenido claro

---

## 📱 Vista ejemplo (Pacientes)

- Título: "Pacientes"
- Botón: "Nuevo paciente" (azul)
- Tabla dentro de card blanca
- Buscador superior
- Iconos sutiles

---

## 🗺️ Integración con mapa

- Usar mapa como componente principal en vistas de geolocalización
- Mantener fondo neutro alrededor
- Usar marcadores simples (azul / verde)
- Evitar sobrecargar con muchos elementos visuales

---

## ⚠️ Errores a evitar

- Demasiados colores
- Sombras exageradas
- Tipografías no profesionales
- Interfaces recargadas

---

## 🔧 Tailwind Config (Referencia)

```js
colors: {
  primary: '#2563EB',
  secondary: '#16A34A',
  background: '#F9FAFB'
}
```

---

## 🧠 Regla final

El diseño debe sentirse:
- Limpio
- Rápido
- Confiable
- Profesional (sector salud)

