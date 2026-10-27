# 🎓 Documentación Oficial GDGoC UHU — Open Badges System

> Este documento contiene la guía operativa completa para que el equipo organizador de **GDG on Campus Universidad de Huelva** pueda crear eventos, diseñar insignias y emitir certificados digitales verificables en **`https://gdguhu.es`**.

---

## 1. Resumen Rápido (Cheat Sheet)

| Tarea | Dónde se hace | Comando / Archivo |
| :--- | :--- | :--- |
| **Crear nuevo evento** | Crear ficha JSON | `src/content/badges/<id>.json` |
| **Añadir gráfico insignia** | Guardar imagen SVG | `public/images/badges/<id>.svg` |
| **Emitir un certificado** | Terminal interactiva | `npm run issue` |
| **Publicar en internet** | Subir a GitHub | `git add . && git commit -m "..." && git push` |
| **Ver certificado online** | En el navegador | `https://gdguhu.es/cert/<id>` |
| **Endpoints Open Badges** | APIs JSON-LD | `https://gdguhu.es/api/badges/...` |

---

## 2. Registro de Nuevas Insignias / Eventos

Crea un archivo `src/content/badges/<nombre-evento>.json`:

```json
{
  "name": "Nombre Oficial del Evento",
  "description": "Explicación del contenido técnico del taller o evento.",
  "image": "/images/badges/<nombre-evento>.svg",
  "criteria": {
    "narrative": "Requisitos específicos superados por el participante."
  },
  "tags": ["Tecnología1", "Tecnología2"],
  "style": "classic",
  "issuerId": "gdgoc-uhu"
}
```

*Estilos disponibles:*
- `"classic"`: Fondo claro, elegante y formal con detalles en colores Google.
- `"hackathon"`: Modo oscuro con acentos cibernéticos, neón y bordes degradados.

---

## 3. Emisión de Certificados

Ejecuta en tu terminal:
```bash
npm run issue
```
Introduce:
1. Nombre del estudiante.
2. Email del estudiante (se cifrará con hash SHA-256 automáticamente).
3. Selecciona la insignia correspondiente.
4. Rol (`Participante`, `1er Premio`, `Ponente`...).
5. Enlace al proyecto/evidencia (opcional).

---

## 4. Publicación

```bash
git add .
git commit -m "feat(cert): emitir nuevos certificados"
git push origin main
```
GitHub Actions compilará y publicará los certificados en `https://gdguhu.es` en menos de un minuto.

---

## 5. Privacidad y Seguridad

- **RGPD / LOPD**: Los correos reales nunca se guardan en Git ni en la web. La identidad se almacena únicamente como un hash criptográfico `sha256$...`.
- **Integridad**: Ninguna persona externa puede emitir o falsificar certificados; solo quienes tengan acceso de escritura al repositorio oficial.
