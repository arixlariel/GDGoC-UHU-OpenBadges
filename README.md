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
5. [Cómo PUBLICAR los Certificados en Internet (`git push`)](#5-cómo-publicar-los-certificados-en-internet-git-push)
6. [Cómo Compartir el Certificado con el Alumno](#6-cómo-compartir-el-certificado-con-el-alumno)
7. [Privacidad y Protección de Datos (RGPD)](#7-privacidad-y-protección-de-datos-rgpd)
8. [Resolución de Dudas y Problemas Frecuentes](#8-resolución-de-dudas-y-problemas-frecuentes)
9. [Envío Automático de Correos por Gmail](#9-envío-automático-de-correos-por-gmail)
10. [Dar acceso a otros organizadores del GDG](#10-dar-acceso-a-otros-organizadores-del-gdg)

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
2. En la lista de flujos de trabajo de la izquierda, selecciona:  
   **"Emitir certificados y emails"**
3. Haz clic en el botón **"Run workflow"** (a la derecha).
4. Rellena los campos:
   - **ID de la insignia**: el identificador del evento (ej: `workshop-ai-cloud`, `hackathon-2026` o `capture-the-flag-reversing-de-binarios`).
   - **Rol o Reconocimiento**: por defecto `Asistente Certificado`.
   - **Solo emitir a quienes hicieron Check-in**: marca la casilla si solo quieres emitir a quienes acudieron presencialmente al evento en Bevy.
   - **¿Enviar email automático por Gmail?**: déjalo marcado para que les llegue el correo con su enlace.
   - **Pega el contenido del CSV**: Abre el CSV descargado de la plataforma Bevy (`gdg.community.dev`) con cualquier bloc de notas, copia todo su texto y pégalo directamente en este cuadro.
5. Pulsa el botón verde **"Run workflow"**.

**¿Qué hace automáticamente GitHub Actions?**
- Lee el CSV en la memoria efímera de la nube.
- Genera todos los archivos de certificados con hash SHA-256 (sin exponer emails).
- Hace el commit y push automático a la rama `main`.
- Despliega la web en `https://gdguhu.es`.
- Envía a cada alumno un email desde la cuenta oficial de Gmail del GDGoC con su botón y enlace único.

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

---

## 9. Envío Automático de Correos por Gmail

El sistema puede enviar **automáticamente un email oficial y personalizado** a cada alumno cuando se emite su certificado, usando la cuenta de Gmail del GDGoC (`gdgoc.uhu@gmail.com`).

### Configuración inicial (Solo una vez en GitHub)

#### Paso 1: Generar una Contraseña de Aplicación en Google
1. Inicia sesión con la cuenta de Gmail del GDG en:  
   👉 `https://myaccount.google.com/apppasswords`
   *(Si no te sale la opción, asegúrate de tener la verificación en dos pasos activada en la cuenta).*
2. En el nombre de la app, pon: `Certificados GDGoC`
3. Pulsa **Crear**. Google te mostrará una contraseña de **16 letras** (ej: `abcd efgh ijkl mnop`).
4. Cópiala **sin espacios** (`abcdefghijklmnop`).

#### Paso 2: Guardarla como Secreto en GitHub
1. En tu repositorio, ve a:  
   👉 `Settings > Secrets and variables > Actions`
2. Pulsa en **New repository secret** y añade estos dos:
   - Nombre: `GMAIL_USER`  
     Valor: `gdgoc.uhu@gmail.com` (o la cuenta de Gmail del GDG)
   - Nombre: `GMAIL_APP_PASSWORD`  
     Valor: El código de 16 caracteres que copiaste de Google.

A partir de ese momento, cada vez que emitas certificados desde la web de GitHub Actions marcando la opción de enviar correos, el sistema enviará los emails automáticamente.

---

## 10. Dar acceso a otros organizadores del GDG

Para que cualquier compañero de la directiva o del equipo del GDGoC UHU pueda emitir certificados:

1. Ve a los ajustes de colaboradores de tu repositorio:  
   👉 `Settings > Collaborators` (o `Settings > Collaborators and teams`)
2. Pulsa en **"Add people"**.
3. Busca el usuario de GitHub de tu compañero y envíale la invitación con permisos de **Write** (Escritura).
4. En cuanto acepte la invitación, ya podrá entrar a la pestaña **Actions** y usar el **Método C** desde el navegador para emitir certificados masivos con Bevy CSV sin tener que clonar nada en su ordenador.
