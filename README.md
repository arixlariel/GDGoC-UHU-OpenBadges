# GDGoC Universidad de Huelva — Open Badges (`gdguhu.com/openbadges`)

Bienvenido al repositorio oficial del sistema de emisión, firma criptográfica y verificación de certificados digitales de **Google Developer Group on Campus Huelva University (GDGoC UHU)**, basados en los estándares internacionales **Open Badges 2.0 & 3.0** (*W3C Verifiable Credentials v2*) de **1EdTech Global**. Solo los organizadores con acceso al repositorio pueden administrar las insignias y emitir acreditaciones.

---

## Índice

1. [Integración Multi-Zone dentro de `gdguhu.com`](#1-integración-multi-zone-dentro-de-gdguhucom)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Estructura de Archivos](#3-estructura-de-archivos)
4. [Cómo crear una nueva badge (`BadgeClass`)](#4-cómo-crear-una-nueva-badge-badgeclass)
5. [Cómo crear certificados para los miembros (`Assertion`)](#5-cómo-crear-certificados-para-los-miembros-assertion)
   - [Método A: Asistente automático](#----método-a-asistente-automático)
   - [Método B: Creación manual](#----método-b-creación-manual)
   - [Método C: Emisión masiva desde `.csv`](#----método-c-emisión-masiva-desde-csv)
   - [Método D: Emisión masiva desde `.csv` con GitHub Actions](#----método-d-emisión-masiva-desde-csv-con-github-actions)
   - [Método E: Generador visual local (`generador-local.html`)](#----método-e-generador-visual-local-generador-localhtml)
6. [Cómo publicar los certificados (`git push`)](#6-cómo-publicar-los-certificados-git-push)
7. [Cómo compartir los certificados con los miembros](#7-cómo-compartir-los-certificados-con-los-miembros)
8. [Cómo verificar un certificado (en tiempo real y en 1EdTech Global)](#8-cómo-verificar-un-certificado-en-tiempo-real-y-en-1edtech-global)
9. [Privacidad y Protección de Datos (RGPD/LOPD)](#9-privacidad-y-protección-de-datos-rgpdlopd)

---

## 1. Integración Multi-Zone dentro de `gdguhu.com`

Este repositorio (`GDGoC-UHU-OpenBadges`) despliega de forma independiente el servicio dedicado de certificados en Vercel (`gdguhu-openbadges`) y queda montado de manera transparente bajo [`https://gdguhu.com`](https://gdguhu.com) a través del portal principal **[`GDGoC-UHU-Web`](https://github.com/arixlariel/GDGoC-UHU-Web)**:

| Ruta oficial en `gdguhu.com` | Servicio | Cómo se sirve |
| :--- | :--- | :--- |
| **`https://gdguhu.com/openbadges/`** | **Portal oficial de Open Badges** (buscador, vitrina y verificación) | Generado en este repositorio (`src/pages/openbadges/index.astro`) y servido vía Multi-Zone |
| **`https://gdguhu.com/openbadges/cert/<ID>/`** | **Diploma público verificable** (verificación Ed25519 en vivo, PDF A4, LinkedIn, QR, OB 3.0) | Generado en este repositorio (`src/pages/openbadges/cert/[id].astro`) |
| **`https://gdguhu.com/cert/<ID>/`** | **Compatibilidad heredada** para enlaces y códigos QR emitidos anteriormente | Redirección automática a `/openbadges/cert/<ID>/` (`src/pages/cert/[id].astro`) |
| **`https://gdguhu.com/.well-known/did.json`** y **`/api/badges/**`** | **Identidad `did:web:gdguhu.com` y JSON-LD firmados OB 3.0 / OB 2.0** | Generados en este repositorio para mantener 100% válidas todas las firmas emitidas |
| **`https://gdguhu.com/og/openbadges.png`** y **`/og/cert/<ID>.png`** | **Tarjetas Open Graph `1200×630`** en el estilo de cada diploma | Generadas automáticamente en cada build (`scripts/generate-og-images.mjs`) |
| **`https://gdguhu.com/openbadges/generador-local.html`** | **Generador visual online/offline** de badges, certificados y `publish.json` | Publicado automáticamente en cada build desde `generador-local.html` |

> La portada general de `gdguhu.com`, los eventos de Bevy, los enlaces cortos, las páginas de mantenimiento y el proxy de Cyber Trainer viven en **[`GDGoC-UHU-Web`](https://github.com/arixlariel/GDGoC-UHU-Web)**; el tema de Cyber Trainer vive en **[`GDGoC-UHU-CTFd`](https://github.com/arixlariel/GDGoC-UHU-CTFd)**.

---

## 2. Arquitectura del Sistema

- **Hosting y Multi-Zone**: **Vercel** (proyecto dedicado `gdguhu-openbadges`, assets aislados en `/_astro-ob/*` para cero colisiones con el portal principal y despliegue automático vía GitHub Actions en cada `push` a `main`).
- **Web de verificación Open Badges**: `https://gdguhu.com/openbadges/`
- **Estándares emitidos en paralelo**:
  - **Open Badges 3.0 (`W3C Verifiable Credentials v2`)**: Cada certificado se compila y firma automáticamente durante el build en `/api/badges/v3/<id>.json` con firma criptográfica **Ed25519** (`DataIntegrityProof` · `eddsa-rdfc-2022`), vinculada a la identidad descentralizada oficial `did:web:gdguhu.com` publicada en `https://gdguhu.com/.well-known/did.json`.
  - **Verificación criptográfica en tiempo real en navegador**: Al abrir cualquier certificado online, `src/utils/verifyOb3Client.ts` descarga en vivo `/.well-known/did.json` y `/api/badges/v3/<id>.json`, canoniza con `URDNA2015` y verifica matemáticamente la firma Ed25519 en el propio navegador (`WebCrypto Ed25519` con respaldo puro RFC 8032).
  - **Open Badges 2.0 (retrocompatibilidad)**: Se mantienen intactos los endpoints `/api/badges/assertion/<id>.json`, `/api/badges/class/<badgeId>.json` y `/api/badges/issuer.json` con verificación *hosted* y hash `SHA-256` + salt.
- **LinkedIn y Open Graph (`1200×630`)**:
  - El botón **Añadir a LinkedIn** incluye el `organizationId` oficial de GDGoC UHU (`146739355`) para mostrar el logotipo de la organización en el perfil del alumno.
  - En cada build se generan tarjetas Open Graph `1200×630` PNG optimizadas (< 120 KB) para el portal y cada certificado individual usando **Satori**, **Resvg** y **Sharp**.
- **Envío automático de correos (`Resend` + respaldo Gmail)**:
  - Los correos se emiten automáticamente tras el despliegue mediante **Resend** desde `GDG on Campus Universidad de Huelva <certificados@gdguhu.com>` (dominio `gdguhu.com` verificado con DKIM, SPF y DMARC en Cloudflare DNS), con `Reply-To: gdgoc.huelva@gmail.com` y copia oculta `BCC: gdgoc.huelva+enviados@gmail.com`.
  - Cualquier respuesta enviada a `certificados@gdguhu.com` se reenvía automáticamente a `gdgoc.huelva@gmail.com` mediante **Cloudflare Email Routing**.
  - Si alguna vez `RESEND_API_KEY` no estuviera disponible, `scripts/send-emails.mjs` cuenta con respaldo automático vía Gmail SMTP (`GMAIL_USER` / `GMAIL_APP_PASSWORD`).
- **Secretos en GitHub Actions (`Settings -> Secrets and variables -> Actions`)**:
  - `OB3_PRIVATE_KEY`: clave privada Ed25519 para firmar credenciales Open Badges 3.0 (nunca en el repositorio; rotación con `node scripts/generate-ob3-key.mjs --write`).
  - `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`: despliegue del proyecto `gdguhu-openbadges`.
  - `RESEND_API_KEY` *(y `GMAIL_USER` / `GMAIL_APP_PASSWORD` como respaldo)*: envío automatizado de certificados.

---

## 3. Estructura de Archivos

```text
Open Badges/
├── .github/
│   └── workflows/
│       ├── deploy.yml                   <-- Build OB3/OG, deploy a Vercel y envío de emails Resend
│       └── issue-certificates.yml       <-- Emisión masiva desde CSV en GitHub Actions
├── public/
│   ├── .well-known/
│   │   └── did.json                     <-- Clave pública oficial Ed25519 (did:web:gdguhu.com)
│   ├── robots.txt                       <-- Bloquea indexación directa del dominio interno *.vercel.app
│   └── images/
│       └── badges/                      <-- Aquí se guardan los logo.png de las badges (512×512)
├── scripts/
│   ├── issue-badge.mjs                  <-- Asistente automático para emitir certificados individuales
│   ├── bulk-issue.mjs                   <-- Emisión masiva de certificados desde archivo .csv
│   ├── send-emails.mjs                  <-- Envío automático vía Resend (certificados@gdguhu.com) + Gmail
│   ├── process-publish.mjs              <-- Procesa publish.json y limpia archivos temporales en CI
│   ├── optimize-badge-thumbs.mjs        <-- Genera miniaturas WebP 128×128 para la vitrina
│   ├── generate-og-images.mjs           <-- Genera /og/openbadges.png y /og/cert/<id>.png (1200×630)
│   └── generate-ob3-key.mjs             <-- Utilidad de rotación de clave Ed25519 (did:web)
├── src/
│   ├── content/
│   │   ├── badges/                      <-- Aquí se guardan los badge.json
│   │   │   └── publish/                 <-- Carpeta temporal para subir nuevas badges
│   │   └── assertions/                  <-- Aquí se guardan los certificados
│   │       └── publish/                 <-- Carpeta temporal para subir nuevos certificados
│   ├── pages/
│   │   ├── 404.astro                    <-- Página 404 para certificados no encontrados
│   │   ├── openbadges/
│   │   │   ├── index.astro              <-- Portal principal Open Badges (/openbadges/)
│   │   │   └── cert/[id].astro          <-- Página oficial del diploma (/openbadges/cert/<id>/)
│   │   ├── cert/[id].astro              <-- Redirección retrocompatible (/cert/<id>/ -> /openbadges/cert/<id>/)
│   │   └── api/badges/
│   │       ├── v3/[id].json.ts          <-- Generador y firmador automático Open Badges 3.0
│   │       ├── assertion/[id].json.ts   <-- Endpoint Open Badges 2.0 (Assertion)
│   │       ├── class/[id].json.ts       <-- Endpoint Open Badges 2.0 (BadgeClass)
│   │       ├── issuer.json.ts           <-- Endpoint Open Badges 2.0 (Issuer)
│   │       ├── styles.json.ts           <-- Mapa de estilos bloqueados para mantenimiento Multi-Zone
│   │       └── showcase.json.ts         <-- Lista de certificados públicos para sitemap.xml global
│   ├── utils/
│   │   ├── openbadges3.ts               <-- Construcción y firma Ed25519 (eddsa-rdfc-2022)
│   │   ├── verifyOb3Client.ts           <-- Verificación criptográfica Ed25519 en tiempo real en cliente
│   │   └── pdfDownload.ts               <-- Exportación directa del diploma en PDF A4 horizontal
│   └── config/
│       └── site.ts                      <-- Configuración del portal, LinkedIn orgId y vitrina
├── astro.config.mjs                     <-- Configuración Astro Multi-Zone (`assets: '_astro-ob'`)
├── vercel.json                          <-- Cabeceras CORS, caché y redirección raíz -> /openbadges/
└── generador-local.html                 <-- Generador visual offline (gdguhu.com/openbadges/generador-local.html)
```

---

## 4. Cómo crear una nueva badge (`BadgeClass`)

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

## 5. Cómo crear certificados para los miembros (`Assertion`)

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
- Usando este método se mandarán correos automáticos desde `certificados@gdguhu.com` a la hora de publicar los certificados (punto 6)

---

### --- Método D: Emisión masiva desde `.csv` con GitHub Actions

> No requiere tener instalado el proyecto. Esta es la opción más completa y que conlleva menos riesgo

1. Entra arriba en la pestaña `Actions`
2. En la lista de flujos de trabajo, corre el workflow `Emitir certificados y emails`
3. Rellena los campos:
   - **ID de la badge** (nombre `.json` en `src/content/badges/`, ej: `cumpleanos-feliz`)
   - **Rol o reconocimiento** (`Asistencia certificada`, `1er Premio - Mejor Proyecto`, `Ponente`, ...)
   - **¿Solo emitir a check-ins?**
   - **¿Enviar correo automático con la `URL` del certificado?**
   - **Pega el contenido del `.csv`**: Abre el archivo con cualquier bloc de notas para copiar y pegar todo el texto

***Publica automáticamente los certificados (punto 6) y envía correos personalizados en masa desde `certificados@gdguhu.com`***

---

### --- Método E: Generador visual local (`generador-local.html`)

> Funciona en **Chrome, Brave, Opera, Mozilla Firefox y Safari**. Permite tanto crear nuevas badges como emitir certificados individuales o en masa arrastrando el `.csv`. Incluye vistas previas en tiempo real del diploma, del correo HTML y del archivo `.json`

1. Descarga el archivo `generador-local.html` situado en la carpeta raíz del proyecto o abre su versión siempre actualizada en este **[enlace](https://gdguhu.com/openbadges/generador-local.html)**
2. Configura las badges, certificados y correos a generar
3. Pulsa `Descargar publish.json` para guardar el archivo maestro
4. Arrastra `publish.json` directamente a la raíz del repositorio en GitHub y haz el commit (o continúa al punto 6)

> Al subir `publish.json`, el pipeline clasifica automáticamente cada archivo en `src/content/badges/` y `src/content/assertions/`, borra `publish.json`, publica y firma los certificados en Vercel y envía automáticamente el correo oficial desde `certificados@gdguhu.com` con el diseño exacto de la vista previa (en 1–2 minutos). Si subes únicamente un `.json` de assertion suelto sin `publish.json`, se colocará y publicará en la web automáticamente pero no se enviará correo porque el archivo individual no contiene emails en texto plano.

---

## 6. Cómo publicar los certificados (`git push`)

Abre una terminal, navega a la ruta donde guardes el proyecto y ejecuta:

```bash
git add .
git commit -m "feat(cert): Emisión de certificados para Cumpleaños feliz!"
git push origin main
```

---

## 7. Cómo compartir los certificados con los miembros

Una vez publicado, el certificado del alumno tiene su propia `URL`, única e intransferible:

**`https://gdguhu.com/openbadges/cert/<NOMBRE24CIFRASHEX>/`**

*(Los enlaces anteriores con el formato `https://gdguhu.com/cert/<ID>/` siguen funcionando y redirigen automáticamente a la nueva ruta definitiva. Al compartir el enlace en LinkedIn o redes compatibles se muestra automáticamente su tarjeta Open Graph `1200×630` personalizada.)*

---

## 8. Cómo verificar un certificado (en tiempo real y en 1EdTech Global)

### --- Verificación automática en tiempo real en la web
Cada vez que cualquier persona abre un certificado online en `https://gdguhu.com/openbadges/cert/<ID>/`, el navegador descarga en vivo `/.well-known/did.json` y `/api/badges/v3/<ID>.json`, canoniza el documento con `URDNA2015` y verifica matemáticamente la firma **Ed25519** mostrando la píldora **«Verificado en tiempo real · Firma Ed25519 auténtica»**. Pulsando **Detalles** se puede consultar el DID emisor, la clave pública, la huella SHA-256 real del documento y repetir la verificación al instante.

### --- Verificación externa en el Validador Oficial de 1EdTech Global
Cualquier persona, empresa o universidad puede comprobar además la autenticidad de forma independiente usando el **validador oficial de 1EdTech Global (Open Badges 3.0)**:

1. Abre la página pública de tu certificado (`https://gdguhu.com/openbadges/cert/<ID>/`)
2. Pulsa el botón **Añadir a tu cartera** (o **Verificar en 1EdTech Global ↗** dentro de *Detalles*)
3. Copia el enlace de la credencial **Open Badges 3.0** (`https://gdguhu.com/api/badges/v3/<ID>.json`) o descarga el archivo `.json` firmado
4. Accede al **[Validador 1EdTech Global (Open Badges 3.0)](https://vc.1ed.tech/upload?validatorId=OB30Inspector)**
5. Pega el enlace o sube el `.json` y pulsa **Upload** para verificar su firma criptográfica sin errores

El validador resolverá automáticamente la identidad `did:web:gdguhu.com` (`https://gdguhu.com/.well-known/did.json`), comprobará el esquema JSON-LD de Open Badges 3.0 y verificará la firma criptográfica **Ed25519**, devolviendo **`VALID` (0 errores y 0 advertencias)**.

> El validador oficial de 1EdTech Global no almacena una base de datos central de certificados; comprueba en tiempo real que el documento cumple la especificación internacional y que su firma criptográfica corresponde exactamente a la clave pública alojada en `gdguhu.com`

---

## 9. Privacidad y Protección de Datos (RGPD/LOPD)

El sistema está diseñado respetando escrupulosamente la normativa europea de protección de datos:

- **Correos electrónicos jamás expuestos**: Los emails nunca se guardan en el repositorio ni se muestran en la web, se anonimizan mediante el hash **SHA-256** con salt variable unidireccional e irreversible.
- **Privacidad de asistentes en portada y buscadores**: En `/openbadges/` y en `sitemap.xml` solo rotan los certificados del equipo organizador (configurados en `src/config/site.ts`). Los certificados del resto de asistentes se publican con `noindex` y solo son accesibles mediante su enlace o ID único de 24 caracteres hexadecimales.
- **Falsificación imposible**: Solo los organizadores con permisos en el repositorio pueden publicar certificados, cada credencial Open Badges 3.0 lleva una firma digital **Ed25519** generada con nuestra clave privada protegida en GitHub Secrets (`OB3_PRIVATE_KEY`).
- **Verificación confiable**: La autenticidad está respaldada por identidad descentralizada **`did:web:gdguhu.com`** (Open Badges 3.0) y verificación *hosted* en `gdguhu.com` (Open Badges 2.0), de modo que cualquier entidad puede verificar su legitimidad incluso si el archivo `.json` se descarga y se comprueba fuera de la web.
