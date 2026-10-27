# 🎓 GDG on Campus Universidad de Huelva — Open Badges System

Sistema de credenciales y certificación digital oficial para **GDG on Campus en la Universidad de Huelva (UHU)**, basado en la especificación internacional **Open Badges v2.0** (estandarizado por 1EdTech / IMS Global).

Inspirado en la plataforma de [GDG on Campus UAM](https://gdguam.es).

---

## ⚡ Análisis Técnico y Arquitectura ("¿Qué sobra o qué está mal?")

Al plantear la arquitectura inicial con *Astro + Web Components FAST de Microsoft + React Native + PocketBase/Supabase*, identificamos los siguientes puntos críticos:

1. ❌ **React Native sobra por completo**:
   - React Native está diseñado exclusivamente para apps móviles nativas (iOS y Android) compilando a vistas del sistema operativo.
   - Forzarlo en la web mediante `react-native-web` produce HTML no semántico, rompe el Open Graph para compartir en LinkedIn / redes, y destruye la ligereza y velocidad que necesitas para servir certificados accesibles públicamente.
   - **Solución adoptada**: Astro puro con Tailwind CSS. Carga instantánea, puntuación de 100 en Google Lighthouse, SEO impecable y cero overhead.

2. ⚠️ **Microsoft FAST vs Web Components Nativos**:
   - FAST es una librería de Microsoft para Custom Elements. Sin embargo, su desarrollo ha sido ralentizado por Microsoft en favor de Fluent UI, y añade dependencias pesadas innecesarias.
   - **Solución adoptada**: Web Component nativo W3C (`<badge-modal>`). Cumple el estándar oficial de Custom Elements del navegador con **0 dependencias adicionales**, 0 KB de bundle y 100% de compatibilidad.

3. 🗄️ **Base de Datos: Git / Astro Collections vs PocketBase vs Supabase**:
   - **PocketBase** requiere un servidor VPS corriendo 24/7 (Fly.io, Railway, DigitalOcean, etc.), lo cual genera costes o problemas de mantenimiento.
   - **Supabase** es excelente, pero en su capa gratuita *pausa los proyectos* si pasan 7 días sin actividad (un desastre si un estudiante intenta validar su certificado meses después).
   - **Nuestra solución (Git-driven / Static)**:
     - Los certificados e insignias se almacenan como archivos JSON en `src/content/badges/` y `src/content/assertions/`.
     - **Ventajas**:
       - **100% Gratuito de por vida**: Desplegado en **GitHub Pages** con certificado SSL automático.
       - **Inmutabilidad y Confianza**: Cada certificado emitido es un commit en tu repositorio de GitHub, garantizando que nadie pueda falsificarlo ("*Como hosteas tú los datos, se asume que los datos son reales si solo tu asociación tiene control sobre lo que se publica en la web*").
       - **Disponibilidad 24/7/365 sin caídas ni pausas**.
       - Si en el futuro quieres añadir Supabase para un panel web con login, la estructura de datos ya está desacoplada y lista.

---

## 📐 Estructura Open Badges v2.0

El sistema implementa los 3 componentes esenciales del estándar JSON-LD:

1. **Issuer (Emisor)**:
   - Endpoint: `/api/badges/issuer.json`
   - Define la identidad oficial de GDG on Campus UHU (nombre, URL de la comunidad, email institucional y logotipo).
2. **BadgeClass (Insignia / Evento)**:
   - Endpoint: `/api/badges/class/[id].json`
   - Define el evento o competencia (nombre, descripción, imagen SVG oficial, criterios narrativos de consecución y tags).
3. **Assertion (Acreditación Individual)**:
   - Endpoint: `/api/badges/assertion/[id].json`
   - Vincula al estudiante con la insignia. El email se almacena cifrado con **hash SHA-256 con salt** (`sha256$...`) para respetar la privacidad según el estándar.
4. **Visualizador Web de Certificado**:
   - URL: `/cert/[id]`
   - Disponible en dos estilos:
     - **Estilo Clásico**: Institucional, limpio, con paleta oficial de colores Google.
     - **Estilo Hackathon**: Modo oscuro cyberpunk, bordes degradados y tipografía mono.

---

## 🚀 Instalación y Desarrollo Local

### Requisitos
- Node.js 18+ o 20+

### Pasos
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo local
npm run dev

# Abrir en el navegador: http://localhost:4321
```

---

## 🎓 Cómo emitir nuevos certificados

Hemos incluido un script interactivo en la terminal:

```bash
npm run issue
```

El script te preguntará:
1. Nombre completo del alumno (ej. *María López Serrano*)
2. Email del alumno (calculará automáticamente el hash criptográfico SHA-256)
3. Insignia a otorgar (`hackathon-2026`, `workshop-ai-cloud`, etc.)
4. Rol o reconocimiento (ej. *1er Premio*, *Participante*)
5. Enlace a evidencia / repositorio (opcional)

Generará automáticamente el archivo `src/content/assertions/<id>.json`.
Solo tienes que hacer commit y push a GitHub:

```bash
git add .
git commit -m "feat(cert): emitir certificado para María López"
git push origin main
```

---

## 🌐 Despliegue en tu GitHub Personal (GitHub Pages)

El repositorio incluye un flujo de trabajo de GitHub Actions en `.github/workflows/deploy.yml`.

Para activarlo en tu GitHub:
1. Crea un repositorio en tu cuenta de GitHub (ej. `gdgoc-uhu-openbadges`).
2. Sube este código:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/gdgoc-uhu-openbadges.git
   git branch -M main
   git push -u origin main
   ```
3. En GitHub, ve a **Settings** -> **Pages**:
   - En **Build and deployment > Source**, selecciona **GitHub Actions**.
4. ¡Listo! En 1 minuto tu web estará disponible en `https://TU_USUARIO.github.io/gdgoc-uhu-openbadges/`.

### Dominio personalizado (Opcional)
Si quieres usar un dominio propio como `badges.gdgocuhu.es`:
1. En `src/config/site.ts`, actualiza `siteConfig.url`.
2. En GitHub Pages, añade tu dominio personalizado en la sección **Custom domain**.
