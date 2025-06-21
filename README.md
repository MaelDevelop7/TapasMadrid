# 🍻 TapasRadar

**TapasRadar** es una aplicación web intuitiva para descubrir **bares y fiestas con ambiente en Madrid**.  
Inspirada en Waze, pero para el tapeo: descubre, comenta y califica bares en tiempo real.

---

## 🚀 Características principales

- 🗺️ Mapa interactivo con Leaflet centrado en Madrid  
- 📍 Añade bares fácilmente con un formulario  
- 🌑 Soporte para modo oscuro persistente  
- 👤 Autenticación anónima con Firebase  
- ⚙️ Página de ajustes personalizable  
- 💬 Sistema de comentarios y notas por bar  

---

## 🧾 Historial de versiones

### ✅ Versión 1.0 `<Beta>`
- Interfaz UI/UX inicial
- Formulario para añadir bares
- Mapa con marcadores de ejemplo
- Créditos en el footer
- Estructura de código organizada

### ✅ Versión 1.0 `<Stable>`
- 🔐 Autenticación anónima con Firebase

### ✅ Versión 1.5 `<Stable>`
- 🎨 Íconos integrados
- ⚙️ Página de configuración
- 🌙 **Modo oscuro persistente** con `localStorage`

```ts
const [darkMode, setDarkMode] = useState(() =>
  localStorage.getItem('darkMode') === 'true'
);

const toggleDarkMode = () => {
  const newMode = !darkMode;
  setDarkMode(newMode);
  localStorage.setItem('darkMode', String(newMode));
  document.documentElement.classList.toggle("dark-mode", newMode);
};
```
👨‍💻 Autor
Mael Gruand – Desarrollador Web 
GitHub: [@MaelDevelop7](https://github.com/MaelDevelop7)

