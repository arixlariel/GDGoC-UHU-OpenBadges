# GDGoC Universidad de Huelva - Open Badges

Bienvenido al manual oficial de gestión y emisión de certificados digitales para nuestro equipo organizador. Esta integración permite emitir credenciales digitales verificables basadas en los estándares internacionales **Open Badges 2.0 & 3.0** (*W3C Verifiable Credentials*) de **1EdTech Global**. Solo los organizadores (con acceso al correo del GDGoC, quien controla el repositorio) pueden administrar las acreditaciones.

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
7. [Cómo verificar un certificado en el Validador Oficial de 1EdTech](#7-cómo-verificar-un-certificado-en-el-validador-oficial-de-1edtech)
8. [Privacidad y Protección de Datos (RGPD/LOPD)](#8-privacidad-y-protección-de-datos-rgpdlopd)

---

## 1. Arquitectura del Sistema

- **Registrador del dominio**: Cloudflare
- **Web de verificación**: `https://gdguhu.com`
- **Hosting**: GitHub Pages (desplegado automáticamente con GitHub Actions)
- **Estándares emitidos en paralelo**:
  - **Open Badges 3.0 (`W3C Verifiable Credentials v2`)**: Cada certificado se compila y firma automáticamente durante el build en `/api/badges/v3/<id>.json` con firma criptográfica **Ed25519** (`DataIntegrityProof` · `eddsa-rdfc-2022`), vinculada a la identidad descentralizada oficial `did:web:gdguhu.com` publicada en `https://gdguhu.com/.well-known/did.json`.
  - **Open Badges 2.0 (retrocompatibilidad)**: Se mantienen intactos los endpoints `/api/badges/assertion/<id>.json`, `/api/badges/class/<badgeId>.json` y `/api/badges/issuer.json` con verificación *hosted* y hash `SHA-256` + salt.
- **Secreto de firma en GitHub Actions**: La clave privada Ed25519 se almacena exclusivamente en `Settings -> Secrets and variables -> Actions -> OB3_PRIVATE_KEY` (nunca en el repositorio). Si alguna vez fuera necesario rotarla, existe el asistente `node scripts/generate-ob3-key.mjs --write`.

---

## 2. Estructura de Archivos

```text
Open Badges/
├── public/
│   ├── .nojekyll                    <-- Permite servir .well-known/ en GitHub Pages
│   ├── .well-known/
│   │   └── did.json                 <-- Clave pública oficial Ed25519 (did:web:gdguhu.com)
│   └── images/
│       └── badges/                  <-- Aquí se guardan los logo.png de las badges
├── scripts/
│   ├── issue-badge.mjs              <-- Asistente automático para emitir certificados individuales
│   ├── bulk-issue.mjs               <-- Emisión masiva de certificados desde archivo .csv
│   ├── send-emails.mjs              <-- Envío automático de correos para los certificados
│   └── generate-ob3-key.mjs         <-- Utilidad de rotación de clave Ed25519 (did:web)
├── src/
│   ├── content/
│   │   ├── badges/                  <-- Aquí se guardan los badge.json
│   │   │   └── publish/             <-- Carpeta temporal para subir nuevas badges
│   │   └── assertions/              <-- Aquí se guardan los certificados
│   │       └── publish/             <-- Carpeta temporal para subir nuevos certificados
│   ├── pages/api/badges/
│   │   ├── v3/[id].json.ts          <-- Generador y firmador automático Open Badges 3.0
│   │   ├── assertion/[id].json.ts   <-- Endpoint Open Badges 2.0 (Assertion)
│   │   ├── class/[id].json.ts       <-- Endpoint Open Badges 2.0 (BadgeClass)
│   │   └── issuer.json.ts           <-- Endpoint Open Badges 2.0 (Issuer)
│   ├── utils/
│   │   └── openbadges3.ts           <-- Construcción y firma Ed25519 (eddsa-rdfc-2022)
│   └── config/
│       └── site.ts                  <-- Datos del emisor (GDGoC UHU) y organizadores visibles en portada
└── generador-local.html             <-- Generador visual offline (también desplegado en gdguhu.com/generador-local.html)
```

---

## 3. Cómo crear una nueva badge (`BadgeClass`)

### --- 1: Crear el logo
Formato `.png` con fondo transparente, 512x512

### --- 2: Guardar el logo
Almacenar en `public/images/badges/`

### --- 3: Definir la badge
Crear y guardar el archivo `.json` en `src/content/badges/`

**Plantilla a usar:**
```json
{
  "name": "Cumpleaños feliz!",
  "description": "Certificado oficial de cumpleaños por GDGoC Universidad de Huelva",
  "image": "/images/badges/cumpleanos-feliz.png",
  "criteria": {
    "narrative": "Efectivamente, ha llegado tu día de entre los 365 que hay"
  },
  "tags": ["Cumpleaños", "Vuelta al sol", "Un día más", "Un día menos?"],
  "style": "caramelos",
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
3. **ID de la badge** (nombre `.json` en `src/content/badges/`, ej: `cumpleanos-feliz`)
4. **Rol o reconocimiento** (`Asistencia certificada`, `1er Premio - Mejor Proyecto`, `Ponente`, ...)
5. **Enlace a proyecto o evidencia** (opcional)

El script generará automáticamente un archivo con un nombre único de 24 caracteres hexadecimales en `src/content/assertions/`

---

### --- Método B: Creación manual

> Puede usarse sin tener el proyecto instalado. Es útil en casos puntuales

Crea un `.json` con un nombre aleatorio de 24 caracteres hexadecimales en `src/content/assertions/` usando la siguiente plantilla:

```json
{
  "recipient": {
    "name": "John Doe Doe",
    "identity": "sha256$abe802...",       <-- Correo cifrado (SHA-256) con prefijo mandatorio `sha256$`
    "hashed": true,                       <-- Siempre en `true`
    "type": "email",
    "salt": "gdgoc-uhu-salt-2026"         <-- Se pega justo detrás del email, y ese conjunto es lo que se cifra (el año varía)
  },
  "badgeId": "cumpleanos-feliz",          <-- Nombre del archivo .json de la badge (sin .json)
  "role": "Cumpleañero",
  "issuedOn": "2026-10-27T18:00:00Z",
  "evidence": "https://github.com/johndoedoe/proyecto-final"
}
```

---

### --- Método C: Emisión masiva desde `.csv`

> Requiere tener instalado el proyecto. Diseñada para emitir por tandas con los `.csv` de Bevy (GDG Community)

Detecta automáticamente las columnas `First Name`, `Last Name`, `Email`, `Checkin Date (UTC)` y procesa correctamente los nombres. Abre una terminal, navega a la ruta donde guardes el proyecto y ejecuta:

```bash
git pull
npm run bulk -- ARCHIVO.csv --badge cumpleanos-feliz --role "Asistencia certificada"
```

- Si añades `--only-checked-in`, solo se emitirán certificados a quienes tengan asistencia registrada
- Usando este método se mandarán correos automáticos a la hora de publicar los certificados (punto 5)

---


### --- Método D: Emisión masiva desde `.csv` con GitHub Actions

> No requiere tener instalado el proyecto. Esta es la opción más completa y que conlleva menos riesgo

1. Entra arriba en la pestaña `Actions`
2. En la lista de flujos de trabajo, corre el workflow `Emitir certificados y emails`
3. Rellena los campos:
   - **ID de la badge** (nombre `.json` en `src/content/badges/`, ej: `cumpleanos-feliz`)
   - **Rol o reconocimiento** (`Asistencia certificada`, `1er Premio - Mejor Proyecto`, `Ponente`, ...)
   - **¿Solo emitir a check-ins?**
   - **¿Enviar `gmail` automático con la `URL` del certificado?**
   - **Pega el contenido del `.csv`**: Abre el archivo con cualquier bloc de notas para copiar y pegar todo el texto

***Publica automáticamente los certificados (punto 5) y permite mandar correos personalizados en masa***

---

### --- Método E: Generador visual local (`generador-local.html`)

> Funciona en **Chrome, Brave, Opera, Mozilla Firefox y Safari**. Permite tanto crear nuevas badges como emitir certificados individuales o en masa arrastrando el `.csv`. Incluye vista previas en tiempo real y demás

1. Descarga el archivo `generador-local.html` situado en la carpeta raíz del proyecto o abre su versión siempre actualizada en este **[enlace](https://gdguhu.com/generador-local.html)**
2. Configura las badges, certificados y correos a generar
3. Pulsa `Descargar publish.json` para guardar el archivo maestro
4. Arrastra `publish.json` (o la carpeta `publish` si usas archivos sueltos) directamente a la raíz del repositorio en GitHub y haz el commit (o continua al punto 5)

---

## 5. Cómo publicar los certificados (`git push`)

Abre una terminal, navega a la ruta donde guardes el proyecto y ejecuta:

```bash
git add .
git commit -m "feat(cert): Emisión de certificados para Cumpleaños feliz!"
git push origin main
```

---

## 6. Cómo compartir los certificados con los miembros

Una vez publicado, el certificado del alumno tiene su propia `URL`, única e intransferible:

**`https://gdguhu.com/cert/<NOMBRE24CIFRASHEX>`**

---

## 7. Cómo verificar un certificado con el Validador Oficial de 1EdTech

Cualquier persona, empresa o universidad puede comprobar la autenticidad e integridad criptográfica de un certificado emitido por GDGoC UHU usando el **validador oficial de 1EdTech Global (Open Badges 3.0)**:

1. Abre la página pública de tu certificado (`https://gdguhu.com/cert/<ID>`)
2. Pulsa el botón **Añadir a tu cartera**
3. Copia el enlace de la credencial **Open Badges 3.0** (`https://gdguhu.com/api/badges/v3/<ID>.json`) o descarga el archivo `.json` firmado
4. Accede al **[Validador 1EdTech Global (Open Badges 3.0)](https://vc.1ed.tech/upload?validatorId=OB30Inspector)**
5. Pega el enlace o sube el `.json` y pulsa **Upload** para verificar su firma criptográfica sin errores

El validador resolverá automáticamente la identidad `did:web:gdguhu.com` (`https://gdguhu.com/.well-known/did.json`), comprobará el esquema JSON-LD de Open Badges 3.0 y verificará la firma criptográfica **Ed25519**, devolviendo **`VALID` (0 errores y 0 advertencias)**.

> El validador oficial de 1EdTech Global no almacena una base de datos central de certificados; comprueba en tiempo real que el documento cumple la especificación internacional y que su firma criptográfica corresponde exactamente a la clave pública alojada en `gdguhu.com`

---

## 8. Privacidad y Protección de Datos (RGPD/LOPD)

El sistema está diseñado respetando escrupulosamente la normativa europea de protección de datos:

- **Correos electrónicos jamás expuestos**: Los emails nunca se guardan en el repositorio ni se muestran en la web, se anonimizan mediante el hash **SHA-256** con salt variable unidireccional e irreversible.
- **Privacidad de asistentes en portada y buscadores**: En la portada y en `sitemap.xml` solo rotan los certificados del equipo organizador (configurados en `src/config/site.ts`). Los certificados del resto de asistentes se publican con `noindex` y solo son accesibles mediante su enlace o ID único de 24 caracteres hexadecimales.
- **Falsificación imposible**: Solo los organizadores con permisos en el repositorio pueden publicar certificados, cada credencial Open Badges 3.0 lleva una firma digital **Ed25519** generada con nuestra clave privada protegida en GitHub Secrets (`OB3_PRIVATE_KEY`).
- **Verificación confiable**: La autenticidad está respaldada por identidad descentralizada **`did:web:gdguhu.com`** (Open Badges 3.0) y verificación *hosted* en `gdguhu.com` (Open Badges 2.0), de modo que cualquier entidad puede verificar su legitimidad incluso si el archivo `.json` se descarga y se comprueba fuera de la web.
