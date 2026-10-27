# GDGoC Universidad de Huelva - Open Badges

Bienvenido al manual oficial de gestión y emisión de certificados digitales para enuestro equipo organizador. Esta integración permite emitir credenciales digitales verificables basadas en el estándar internacional **Open Badges 2.0** de 1EdTech. Solo los organizadores (con acceso al correo del GDGoC, quien administra el repositorio) pueden administrar las acreditaciones.

---

## Índice

1. [Arquitectura del Sistema](#1-arquitectura-del-sistema)
2. [Estructura de Archivos](#2-estructura-de-archivos)
3. [Cómo crear una nueva badge (`BadgeClass`)](#3-cómo-crear-una-nueva-badge-badgeclass)
4. [Cómo crear certificados para los miembros (`Assertion`)](#4-cómo-crear-certificados-para-los-miembros-assertion)
   - [Método A: Asistente Interactivo en Terminal (Recomendado)](#método-a-asistente-interactivo-en-terminal-recomendado)
   - [Método B: Creación Manual con archivo JSON](#método-b-creación-manual-con-archivo-json)
5. [Cómo PUBLICAR los Certificados en Internet (`git push`)](#5-cómo-publicar-los-certificados-en-internet-git-push)
6. [Cómo Compartir el Certificado con el Alumno](#6-cómo-compartir-el-certificado-con-el-alumno)
7. [Privacidad y Protección de Datos (RGPD)](#7-privacidad-y-protección-de-datos-rgpd)
8. [Resolución de Dudas y Problemas Frecuentes](#8-resolución-de-dudas-y-problemas-frecuentes)

---

## 1. Arquitectura del Sistema

- **Registrador del dominio**: Ariel via DonDominio `https://www.dondominio.com/es/`
- **Web de verificación**: `https://gdguhu.es`
- **Hosting**: GitHub Pages
- **Estándar**: Open Badges 2.0 firmado por GDGoC UHU con hash SHA-256

---

## 2. Estructura de Archivos

```text
Open Badges/
├── public/
│   └── images/
│       └── badges/                  <-- Aquí se guardan los logo.svg de las badges
├── src/
│   ├── content/
│   │   ├── badges/                  <-- Aquí se definen los badge.json
│   │   └── assertions/              <-- Aquí se guardan los certificado.json de los alumnos
│   └── config/
│       └── site.ts                  <-- Datos del emisor o issuer (GDGoC UHU)
└── scripts/
    └── issue-badge.mjs              <-- Asistente automático para emitir certificados
```

---

## 3. Cómo crear una nueva badge (`BadgeClass`)

### --- 1: Crear el logo
Formato `.svg` o `.png` con fondo transparente

### --- 2: Guardar el logo
Almacenar en `public/images/badges/`

### --- 3: Definir la badge
Crear y guardar el archivo `.json` en `src/content/badges/`

**Plantilla a usar:**
```json
{
  "name": "Capture The Flag - Reversing de Binarios",
  "description": "Certificado oficial de asistencia al taller organizado por GDGoC Universidad de Huelva",
  "image": "/images/badges/capture-the-flag-reversing-de-binarios.svg",
  "criteria": {
    "narrative": "Otorgado por asistir presencialmente al 100% del taller y participar en las actividades"
  },
  "tags": ["CTF", "Reversing", "Binarios", "Ghidra"],
  "style": "classic",
  "issuerId": "gdgoc-uhu"
}
```

#### Opciones de estilo (`style`):
- `classic`: Institucional, blanco
- `cyber`: Modo oscuro, neón

---

## 4. Cómo crear certificados para los miembros (`Assertion`)

### --- Método A: Asistente automático

Abre tu terminal en la carpeta `Open Badges` y ejecuta:

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

### --- Método B: Creación manual

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
