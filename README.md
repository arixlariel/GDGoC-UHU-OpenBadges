# GDGoC Universidad de Huelva - Open Badges

Bienvenido al manual oficial de gestión y emisión de certificados digitales para nuestro equipo organizador. Esta integración permite emitir credenciales digitales verificables basadas en el estándar internacional **Open Badges 2.0** de 1EdTech (IMS Global). Solo los organizadores (con acceso al correo del GDGoC, quien administra el repositorio) pueden administrar las acreditaciones.

---

## Índice

1. [Arquitectura del Sistema](#1-arquitectura-del-sistema)
2. [Estructura de Archivos](#2-estructura-de-archivos)
3. [Cómo crear una nueva badge (`BadgeClass`)](#3-cómo-crear-una-nueva-badge-badgeclass)
4. [Cómo crear certificados para los miembros (`Assertion`)](#4-cómo-crear-certificados-para-los-miembros-assertion)
   - [Método A: Asistente automático](#----método-a-asistente-automático)
   - [Método B: Creación manual](#----método-b-creación-manual)
   - [Método C: Emisión masiva desde `.csv`](#----método-c-emisión-masiva-desde-csv)
   - [Método D: Emisión masiva desde `.csv` con GitHub Actions](#----método-d-emisión-masiva-desde-csv-con-github-actions)
   - [Método E: Generador visual local (`generador-local.html`)](#----método-e-generador-visual-local-generador-localhtml)
5. [Cómo publicar los certificados (`git push`)](#5-cómo-publicar-los-certificados-git-push)
6. [Cómo compartir los certificados con los miembros](#6-cómo-compartir-los-certificados-con-los-miembros)
7. [Privacidad y Protección de Datos (RGPD/LOPD)](#7-privacidad-y-protección-de-datos-rgpdlopd)

---

## 1. Arquitectura del Sistema

- **Registrador del dominio**: Ariel Bustillo via DonDominio `https://www.dondominio.com/es/`
- **Web de verificación**: `https://gdguhu.es`
- **Hosting**: GitHub Pages
- **Estándar**: Open Badges 2.0 firmado por GDGoC UHU con hash SHA-256

---

## 2. Estructura de Archivos

```text
Open Badges/
├── generador-local.html             <-- Generador visual offline (Badges, CSV y vista previa)
├── public/
│   └── images/
│       └── badges/                  <-- Aquí se guardan los logo.png de las badges
├── src/
│   ├── content/
│   │   ├── badges/                  <-- Aquí se definen los badge.json
│   │   │   └── publish/             <-- Carpeta temporal para subir nuevas badges
│   │   └── assertions/              <-- Aquí se guardan los certificado.json de los alumnos
│   │       └── publish/             <-- Carpeta temporal para subir nuevos certificados
│   └── config/
│       └── site.ts                  <-- Datos del emisor o issuer (GDGoC UHU)
└── scripts/
    ├── issue-badge.mjs              <-- Asistente automático para emitir certificados individuales
    ├── bulk-issue.mjs               <-- Emisión masiva de certificados desde archivo .csv
    └── send-emails.mjs              <-- Envío automático de correos con los certificados
```

---

## 3. Cómo crear una nueva badge (`BadgeClass`)

### --- 1: Crear el logo
Formato `.png` con fondo transparente

### --- 2: Guardar el logo
Almacenar en `public/images/badges/`

### --- 3: Definir la badge
Crear y guardar el archivo `.json` en `src/content/badges/`

**Plantilla a usar:**
```json
{
  "name": "Capture The Flag - Reversing de Binarios",
  "description": "Certificado oficial de asistencia al taller organizado por GDGoC Universidad de Huelva",
  "image": "/images/badges/capture-the-flag-reversing-de-binarios.png",
  "criteria": {
    "narrative": "Otorgado por asistir presencialmente al 100% del taller y participar en las actividades"
  },
  "tags": ["CTF", "Reversing", "Binarios", "Ghidra"],
  "style": "google",
  "issuerId": "gdgoc-uhu"
}
```

#### Opciones de estilo (`style`):
- `google`: Clásico Google institucional, blanco
- `cyber`: Modo oscuro, neón y estética matrix/glitch
- `piscina`: Verano refrescante lleno de oleaje y burbujas
- `nieve`: Invierno polar en medio de una ventisca helada con nieve y granizo
- `caramelos`: Dulces empalagosos con toppings rosas y unicornios arcoíris

---

## 4. Cómo crear certificados para los miembros (`Assertion`)

La primera vez es recomendable crear una carpeta para el proyecto y sus herramientas en nuestro ordenador, en ella se ejecutará un `clone` para instalar el proyecto desde GitHub y un `npm` para las utilidades propietarias. Una vez hecho, ya se puede proceder

```bash
git clone https://github.com/arixlariel/GDGoC-UHU-OpenBadges.git
npm install
```

**Todas las demás veces que se vaya a hacer un `push` o emisión de certificados es vital hacer antes un `pull`, si no se borrarían los certificados que no se hayan sincronizado**. Si esto ocurre, un organizador que tuviera la base de datos al día deberá restaurarla al punto anterior a la última emisión con un `push`, por lo que es recomendable mantenerlas siempre actualizadas

### --- Método A: Asistente automático

> Requiere tener instalado el proyecto. Es útil para certificados individuales

Abre una terminal, navega a la ruta donde guardes el proyecto y ejecuta:

```bash
git pull
npm run issue
```

El asistente te pedirá:
1. **Nombre completo**
2. **Email de contacto** (solo se usa para calcular el hash `SHA-256`)
3. **ID de la badge** (nombre `.json` en `src/content/badges/`, ej: `capture-the-flag-reversing-de-binarios`)
4. **Rol o reconocimiento** (`Participante`, `1er Premio - Mejor Proyecto`, `Ponente`, ...)
5. **Enlace a proyecto o evidencia** (opcional)

El script generará automáticamente un archivo con un nombre único de 24 caracteres hexadecimales en `src/content/assertions/`

---

### --- Método B: Creación manual

> Puede usarse sin tener el proyecto instalado. Es útil en casos puntuales

Crea un `.json` con un nombre aleatorio de 24 caracteres hexadecimales en `src/content/assertions/` usando la siguiente plantilla:

```json
{
  "recipient": {
    "name": "Laura Benítez Romero",
    "identity": "sha256$a8b2c4...",       <-- Correo cifrado (SHA-256) con prefijo mandatorio `sha256$`
    "hashed": true,                       <-- Siempre en `true`
    "type": "email",
    "salt": "gdgoc-uhu-salt-2026"         <-- Se pega justo detrás del email, y ese conjunto es lo que se cifra
  },
  "badgeId": "workshop-ai-cloud",         <-- Nombre del archivo .json de la badge (sin .json)
  "role": "Asistente Certificado",
  "issuedOn": "2026-10-27T18:00:00Z",
  "evidence": "https://github.com/laura/proyecto-final"
}
```

---

### --- Método C: Emisión masiva desde `.csv`

> Requiere tener instalado el proyecto. Esta opción está diseñada para emitir por tandas con los `.csv` de Bevy (GDG Community)

Detecta automáticamente las columnas `First Name`, `Last Name`, `Email`, `Checkin Date (UTC)` y procesa correctamente los nombres. Abre una terminal, navega a la ruta donde guardes el proyecto y ejecuta:

```bash
git pull
npm run bulk -- ARCHIVO.csv --badge workshop-ai-cloud --role "ELQUESEA"
```

- Si añades `--only-checked-in`, solo se emitirán certificados a quienes tengan asistencia registrada
- Usando este método se mandarán correos automáticos a la hora de publicar los certificados (punto 5)

---


### --- Método D: Emisión masiva desde `.csv` con GitHub Actions

> No requiere tener instalado el proyecto. Esta es la opción más completa y que conlleva menos riesgo

1. Entra arriba en la pestaña **Actions**
2. En la lista de flujos de trabajo, corre el siguiente workflow:
3. 
   > **Emitir certificados y emails**
4. Rellena los campos:
   - **ID de la badge** (nombre `.json` en `src/content/badges/`, ej: `capture-the-flag-reversing-de-binarios`)
   - **Rol o reconocimiento** (`Participante`, `1er Premio - Mejor Proyecto`, `Ponente`, ...)
   - **¿Solo emitir a check-ins?**
   - **¿Enviar `gmail` automático con la `URL` del certificado?**
   - **Pega el contenido del `.csv`**: Abre el archivo con cualquier bloc de notas para copiar y pegar todo el texto

***Este método publica automáticamente los certificados (punto 5) y permite mandar correos personalizados en masa***

---

### --- Método E: Generador visual local (`generador-local.html`)

> Funciona en **Chrome, Brave, Opera, Mozilla Firefox y Safari**. Permite tanto crear nuevas badges como emitir certificados individuales o en masa arrastrando el `.csv`. Incluye vista previa en tiempo real del certificado, el correo, el `.json` y demás

1. Descarga el archivo `generador-local.html` situado en la carpeta raíz del proyecto o abre este enlace al **[generador local](https://raw.githack.com/arixlariel/GDGoC-UHU-OpenBadges/main/generador-local.html)**
2. Configura las badges, certificados y correos a generar
3. Pulsa **Descargar carpeta** para bajar automáticamente el paquete `publish.zip` con los .json
4. Arrastra la carpeta `publish` a `src/content/badges/` o `src/content/assertions/` en GitHub y haz el commit (o haz `git push` desde el punto 5): **GitHub colocará automáticamente los archivos en su carpeta definitiva y enviará los correos electrónicos con su estilo visual correspondiente a cada asistente**

---

## 5. Cómo publicar los certificados (`git push`)

Abre una terminal, navega a la ruta donde guardes el proyecto y ejecuta:

```bash
git add .
git commit -m "feat(cert): Emisión de certificados para Capture The Flag - Reversing de Binarios"
git push origin main
```

---

## 6. Cómo compartir los certificados con los miembros

Una vez publicado, el certificado del alumno tiene su propia `URL`, única e intransferible:

**`https://gdguhu.es/cert/<NOMBRE24CIFRASHEX>`**  

---

## 7. Privacidad y Protección de Datos (RGPD/LOPD)

El sistema está diseñado respetando escrupulosamente la normativa europea de protección de datos:

- **Correos electrónicos jamás expuestos**: Los emails nunca se guardan en el repositorio ni se muestran en la web, se anonimizan mediante el hash **SHA-256** con salt unidireccional e irreversible.
- **Falsificación imposible**: Solo los organizadores con permisos en el repositorio pueden publicar o modificar certificados.
- **Verificación confiable**: La autenticidad se basa en el estándar **hosted verification**. Mientras el certificado provenga del dominio oficial privado `gdguhu.es`, cualquier entidad reconoce su legitimidad
