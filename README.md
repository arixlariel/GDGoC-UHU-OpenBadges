# GDGoC Universidad de Huelva - Open Badges

Bienvenido al manual oficial de gestión y emisión de certificados digitales para enuestro equipo organizador. Esta integración permite emitir credenciales digitales verificables basadas en el estándar internacional **Open Badges 2.0** de 1EdTech. Solo los organizadores (con acceso al correo del GDGoC, quien administra el repositorio) pueden administrar las acreditaciones.

---

## Índice

1. [Arquitectura del Sistema](#1-arquitectura-del-sistema)
2. [Estructura de Archivos](#2-estructura-de-archivos)
3. [Cómo crear una nueva badge (`BadgeClass`)](#3-cómo-crear-una-nueva-badge-badgeclass)
4. [Cómo crear certificados para los miembros (`Assertion`)](#4-cómo-crear-certificados-para-los-miembros-assertion)
   - [Método A: Asistente automático](#método-a-asistente-automático)
   - [Método B: Creación manual](#método-b-creación-manual)
   - [Método C: Emisión masiva con `.csv`](#método-c-emisión-masiva-con-.csv)
   - [Método D: Emisión masiva con GitHub Actions](#método-d-emisión-masiva-con-github-actions)
5. [Cómo publicar los certificados (`git push`)](#5-cómo-publicar-los-certificados-git-push)
6. [Cómo compartir los certificados con los miembros](#6-cómo-compartir-los-certificados-con-los-miembros)
7. [Privacidad y Protección de Datos (RGPD)](#7-privacidad-y-protección-de-datos-rgpd)

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

> Si tienes el proyecto instalado. De uno en uno

Abre un terminal, navega a `Open Badges` y ejecuta:

```bash
npm run issue
```

El asistente te pedirá:
1. **Nombre completo**
2. **Email de contacto** (solo se usa para calcular el hash `SHA-256`)
3. **`name` de la badge**
4. **Rol o reconocimiento** (`Participante`, `1er Premio - Mejor Proyecto`, `Ponente`, ...)
5. **Enlace a proyecto o evidencia** (opcional)

El script generará automáticamente un archivo con un nombre único de 24 caracteres hexadecimales en `src/content/assertions/`

---

### --- Método B: Creación manual

> Si no tienes el proyecto instalado. De uno en uno

Crea un `.json` con un nombre aleatorio de 24 caracteres hexadecimales en `src/content/assertions/` usando la siguiente plantilla:

```json
{
  "recipient": {
    "name": "Laura Benítez Romero",
    "identity": "sha256$a8b2c4...",        <-- Correo cifrado (SHA-256)
    "hashed": true,
    "type": "email",
    "salt": "gdgoc-uhu-salt-2026"
  },
  "badgeId": "workshop-ai-cloud",         <-- Campo `name` de la badge
  "role": "Asistente Certificado",
  "issuedOn": "2026-10-27T18:00:00Z",
  "evidence": "https://github.com/laura/proyecto-final"
}
```

---

### --- Método C: Emisión masiva con `.csv`

> Si tienes el proyecto instalado. Va por tandas

Esta opción está diseñada para funcionar con los `.csv` de Bevy (GDG Community). Detecta las columnas `First Name`, `Last Name`, `Email`, `Checkin Date (UTC)` y procesa correctamente los nombres. Abre un terminal, navega a `Open Badges` y ejecuta:

```bash
npm run bulk -- ARCHIVO.csv --badge workshop-ai-cloud --role "ELQUESEA"
```

- Si añades `--only-checked-in`, solo emitirá certificado a quienes tengan asistencia registrada

---


### --- Método D: Emisión masiva con GitHub Actions

> Si no tienes el proyecto instalado. Va por tandas y permite mandar correos automáticamente

1. Entra arriba en la pestaña **Actions**
2. En la lista de flujos de trabajo, corre el siguiente workflow:  
   > **Emitir certificados y emails**
3. Rellena los campos:
   - **`name` de la badge**
   - **Rol o reconocimiento** (`Participante`, `1er Premio - Mejor Proyecto`, `Ponente`, ...)
   - **¿Solo emitir a check-ins?**
   - **¿Enviar `gmail` automático con `URL` del certificado?**
   - **Pega el contenido del `.csv`**: Abre el archivo con cualquier bloc de notas para copiar y pegar todo el texto

***Este método publica automáticamente los certificados y manda los correos***

---

## 5. Cómo publicar los certificados

```bash
git add .
git commit -m "feat(cert): emitir certificados para Capture The Flag - Reversing de Binarios"
git push origin main
```

---

## 6. Cómo compartir los certificados con los miembros

Una vez publicado, el certificado del alumno tiene su propia `URL`, única e intransferible:

**`https://gdguhu.es/cert/<NOMBRE24CIFRASHEX>`**  

---

## 7. Privacidad y Protección de Datos (RGPD / LOPD)

El sistema está diseñado respetando escrupulosamente la normativa europea de protección de datos:

- **Correos electrónicos jamás expuestos**: Los emails nunca se guardan en el repositorio ni se muestran en la web, se anonimizan mediante el hash **SHA-256** con salt unidireccional e irreversible.
- **Falsificación imposible**: Solo los organizadores con permisos en el repositorio pueden publicar o modificar certificados.
- **Verificación confiable**: La autenticidad se basa en el estándar **hosted verification**. Mientras el certificado provenga del dominio oficial privado `gdguhu.es`, cualquier entidad reconoce su legitimidad
