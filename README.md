# 🎓 Manual de Operaciones GDGoC UHU — Sistema de Certificados Open Badges

Bienvenido al manual oficial de gestión y emisión de certificados digitales para el equipo organizador de **Google Developer Groups on Campus (GDGoC) en la Universidad de Huelva**.

Este sistema permite emitir credenciales digitales verificables basadas en el estándar internacional **Open Badges v2.0** (IMS Global / 1EdTech), alojadas en **`https://gdguhu.es`**.

---

## 📑 Índice de Contenidos

1. [Arquitectura del Sistema en 1 Minuto](#1-arquitectura-del-sistema-en-1-minuto)
2. [Estructura de Archivos del Proyecto](#2-estructura-de-archivos-del-proyecto)
3. [Cómo Registrar un NUEVO EVENTO o Insignia (`BadgeClass`)](#3-cómo-registrar-un-nuevo-evento-o-insignia-badgeclass)
4. [Cómo EMITIR CERTIFICADOS a los Alumnos (`Assertion`)](#4-cómo-emitir-certificados-a-los-alumnos-assertion)
   - [Método A: Asistente Interactivo en Terminal (Recomendado)](#método-a-asistente-interactivo-en-terminal-recomendado)
   - [Método B: Creación Manual con archivo JSON](#método-b-creación-manual-con-archivo-json)
5. [Cómo PUBLICAR los Certificados en Internet (`git push`)](#5-cómo-publicar-los-certificados-en-internet-git-push)
6. [Cómo Compartir el Certificado con el Alumno](#6-cómo-compartir-el-certificado-con-el-alumno)
7. [Privacidad y Protección de Datos (RGPD)](#7-privacidad-y-protección-de-datos-rgpd)
8. [Resolución de Dudas y Problemas Frecuentes](#8-resolución-de-dudas-y-problemas-frecuentes)

---

## 1. Arquitectura del Sistema en 1 Minuto

- **Web Oficial**: `https://gdguhu.es`
- **Hosting**: GitHub Pages (100% gratuito de por vida, sin mantenimiento de servidores).
- **Dominio**: `gdguhu.es` gestionado en DonDominio.
- **Formato Criptográfico**: Open Badges v2.0. Cada certificado está firmado digitalmente por GDGoC UHU con hash SHA-256.
- **Inmutabilidad**: Solo los organizadores con acceso al repositorio de GitHub pueden emitir credenciales oficiales.

---

## 2. Estructura de Archivos del Proyecto

```text
Open Badges/
├── public/
│   └── images/
│       └── badges/                  <-- Aquí se guardan los logotipos/imágenes de los eventos
│           ├── hackathon-2026.svg
│           └── workshop-ai-cloud.svg
├── src/
│   ├── content/
│   │   ├── badges/                  <-- Aquí se define cada EVENTO / INSIGNIA
│   │   │   ├── hackathon-2026.json
│   │   │   └── workshop-ai-cloud.json
│   │   └── assertions/              <-- Aquí se guardan los CERTIFICADOS individuales de los alumnos
│   │       ├── 69679d9fa12d24f4a673b54b.json
│   │       └── 6ae00a61a65e3dd2d40bcb0f.json
│   └── config/
│       └── site.ts                  <-- Datos institucionales del emisor (GDGoC UHU)
└── scripts/
    └── issue-badge.mjs              <-- Asistente automático para emitir certificados
```

---

## 3. Cómo Registrar un NUEVO EVENTO o Insignia (`BadgeClass`)

Cada vez que el GDGoC organice un nuevo taller, charla o hackathon, debéis dar de alta la insignia en **2 sencillos pasos**:

### Paso 1: Guarda la imagen de la insignia
Coloca el diseño gráfico (preferiblemente en formato `.svg` o `.png` con fondo transparente) en:
👉 `public/images/badges/<nombre-evento>.svg`

### Paso 2: Crea la ficha del evento
Crea un archivo JSON dentro de `src/content/badges/<nombre-evento>.json`.

**Ejemplo de plantilla:**
```json
{
  "name": "Taller: Desarrollo Multiplataforma con Flutter",
  "description": "Certificado oficial de aprovechamiento por completar el taller intensivo de desarrollo móvil y web con Flutter y Dart impartido por GDG on Campus UHU.",
  "image": "/images/badges/flutter-masterclass.svg",
  "criteria": {
    "narrative": "Asistencia presencial al 100% de la sesión práctica y entrega del proyecto funcional de la app móvil desarrollada durante el taller."
  },
  "tags": ["Flutter", "Dart", "Mobile", "Cross-Platform", "Google Tech"],
  "style": "classic",
  "issuerId": "gdgoc-uhu"
}
```

#### Opciones de estilo visual (`"style"`):
- `"classic"`: Diseño institucional limpio, sobre fondo blanco, con la barra de los 4 colores de Google y marco formal. Ideal para cursos, workshops y charlas académicas.
- `"hackathon"`: Diseño modo oscuro (dark mode / cyberpunk), con bordes de neón degradados y tipografía mono. Ideal para hackathons, game jams y competiciones técnicas.

---

## 4. Cómo EMITIR CERTIFICADOS a los Alumnos (`Assertion`)

### Método A: Asistente Interactivo en Terminal (Recomendado)

Es la forma más rápida y sin errores. Abre tu terminal en la carpeta `Open Badges` y ejecuta:

```bash
npm run issue
```

El asistente te irá guiando paso a paso:
1. **Nombre completo del alumno**: (ej: `Laura Benítez Romero`)
2. **Email del alumno**: (ej: `laura@alu.uhu.es`). *El email solo se usa para calcular el hash criptográfico SHA-256; nunca se guarda en el repositorio*.
3. **ID de la insignia**: Introduce el identificador del evento (ej: `hackathon-2026`).
4. **Rol o Reconocimiento**: (ej: `Participante`, `1er Premio - Mejor Proyecto`, `Ponente`).
5. **Enlace a proyecto / evidencia (opcional)**: Si es un hackathon o workshop, puedes poner el link a su GitHub.

El script generará automáticamente un archivo con un ID único de 24 caracteres en `src/content/assertions/<id>.json`.

---

### Método B: Creación Manual con archivo JSON

Si prefieres crearlo a mano o mediante un script de hojas de cálculo (Google Sheets / Excel), crea un archivo con un ID aleatorio de 24 caracteres hexadecimales (ej. `69679d9fa12d24f4a673b54b.json`) dentro de `src/content/assertions/`:

```json
{
  "recipient": {
    "name": "Laura Benítez Romero",
    "identity": "sha256$a8b2c4...",
    "hashed": true,
    "type": "email",
    "salt": "gdgoc-uhu-salt-2026"
  },
  "badgeId": "workshop-ai-cloud",
  "role": "Asistente Certificado",
  "issuedOn": "2026-10-27T18:00:00Z",
  "evidence": "https://github.com/laura/proyecto-final"
}
```

---

## 5. Cómo PUBLICAR los Certificados en Internet (`git push`)

Una vez que hayas creado una nueva insignia o emitido certificados, solo tienes que subir los cambios a GitHub.

En tu terminal ejecuta:

```bash
git add .
git commit -m "feat(cert): emitir certificados para Taller Flutter"
git push origin main
```

¡Listo! No tienes que hacer nada más.
El sistema de **GitHub Actions** detectará el push, compilará la web y en **~1 minuto** el certificado estará visible en `https://gdguhu.es`.

---

## 6. Cómo Compartir el Certificado con el Alumno

Una vez publicado, el certificado del alumno tiene su propia URL única e intransferible:

👉 **`https://gdguhu.es/cert/<ID-DEL-CERTIFICADO>`**  
*(Ejemplo real: `https://gdguhu.es/cert/69679d9fa12d24f4a673b54b`)*

### ¿Qué puede hacer el alumno con su enlace?
1. **Añadir a LinkedIn con 1 clic**: El certificado incluye un botón directo que abre LinkedIn con los campos oficiales pre-rellenados (Nombre del certificado, Organización emisora: GDG on Campus UHU, fecha de emisión y URL de verificación).
2. **Importar a carteras digitales (Backpacks)**: Al pulsar en *"Añadir a tu perfil"*, el alumno puede copiar el enlace de la aserción Open Badges para importarlo a plataformas como **OpenBadge Passport**, **Badgr**, **Credly** o **Parchment**.
3. **Validación oficial**: Incluye un botón para validar la autenticidad técnica de la credencial en [BadgeCheck.io](https://badgecheck.io) (validador oficial de IMS Global).

---

## 7. Privacidad y Protección de Datos (RGPD / LOPD)

El sistema está diseñado respetando escrupulosamente la normativa europea de protección de datos:

- 🛡️ **Correos electrónicos jamás expuestos**: Los emails nunca se guardan en el repositorio de GitHub ni se muestran en la web. Se anonimizan mediante un hash criptográfico **SHA-256 con salt** unidireccional e irreversible.
- 🔒 **Falsificación imposible**: Solo los miembros del equipo organizador que tengan permisos en el repositorio pueden publicar o modificar certificados.
- 🌐 **Soberanía del emisor**: La autenticidad se basa en el estándar *hosted verification*: mientras el certificado provenga del dominio oficial `gdguhu.es`, cualquier entidad reconoce su legitimidad.

---

## 8. Resolución de Dudas y Problemas Frecuentes

### ¿Dónde consulto los endpoints JSON oficiales de Open Badges?
- **Perfil del Emisor (Issuer)**: `https://gdguhu.es/api/badges/issuer.json`
- **Insignia / Clase (BadgeClass)**: `https://gdguhu.es/api/badges/class/<badgeId>.json`
- **Acreditación del Alumno (Assertion)**: `https://gdguhu.es/api/badges/assertion/<id>.json`

### ¿Cómo pruebo la web en mi ordenador antes de subirla?
Si tienes Node.js instalado en tu equipo, puedes probar la web localmente ejecutando:
```bash
npm install
npm run dev
```
Y abriendo en tu navegador: `http://localhost:4321`.

---

*Manual elaborado para el equipo organizador de Google Developer Groups on Campus — Universidad de Huelva (UHU).*
