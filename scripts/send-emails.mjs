#!/usr/bin/env node

/**
 * 📧 GDGoC UHU — Envío automático de emails con certificados individuales
 *
 * USO:
 *   node scripts/send-emails.mjs /ruta/al/archivo-lista.json
 *
 * Formato del archivo JSON de entrada:
 *   [
 *     {
 *       "nombre": "Aarón Garrido",
 *       "email": "aarongarridosilvera@gmail.com",
 *       "assertionId": "69679d9fa12d24f4a673b54b",
 *       "badgeId": "workshop-ai-cloud",
 *       "url": "https://gdguhu.es/cert/69679d9fa12d24f4a673b54b"
 *     }
 *   ]
 *
 * VARIABLES DE ENTORNO REQUERIDAS:
 *   - GMAIL_USER: Correo de Gmail del GDGoC (ej: gdgoc.huelva@gmail.com)
 *   - GMAIL_APP_PASSWORD: Contraseña de aplicación de Google de 16 caracteres
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createTransport } from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const badgesDir = path.join(rootDir, 'src', 'content', 'badges');

const siteUrl = process.env.SITE_URL || 'https://gdguhu.es';
const gmailUser = process.env.GMAIL_USER;
const gmailPassword = process.env.GMAIL_APP_PASSWORD;

function loadBadge(badgeId) {
  const candidates = [
    path.join(badgesDir, `${badgeId}.json`),
    path.join(badgesDir, 'publish', `${badgeId}.json`),
  ];
  for (const badgePath of candidates) {
    if (fs.existsSync(badgePath)) {
      try {
        return JSON.parse(fs.readFileSync(badgePath, 'utf-8'));
      } catch {
        // continuar
      }
    }
  }
  return { name: badgeId, description: '' };
}

const EMAIL_THEMES = {
  google: {
    bodyBg: '#f8fafc', cardBg: '#ffffff', cardBorder: '#e2e8f0', headerBorder: '#f1f5f9',
    textPrimary: '#0f172a', textSecondary: '#64748b', accent: '#4285F4', accentDark: '#1967D2',
    pillBg: '#e8f0fe', pillBorder: '#d2e3fc', pillText: '#1967D2',
    boxBg: '#f8fafc', boxBorder: '#e2e8f0', btnBg: '#4285F4', btnText: '#ffffff',
    barColors: ['#4285F4', '#EA4335', '#FBBC04', '#34A853'],
  },
  cyber: {
    bodyBg: '#060B19', cardBg: '#0B132B', cardBorder: '#00F0FF', headerBorder: '#1E293B',
    textPrimary: '#F8FAFC', textSecondary: '#94A3B8', accent: '#00F0FF', accentDark: '#00F0FF',
    pillBg: '#091D34', pillBorder: '#00F0FF', pillText: '#00F0FF',
    boxBg: '#091326', boxBorder: '#1E293B', btnBg: '#00F0FF', btnText: '#060B19',
    barColors: ['#00F0FF', '#FF007F', '#00FF66', '#00F0FF'],
  },
  piscina: {
    bodyBg: '#E0F7FA', cardBg: '#FFFFFF', cardBorder: '#00E5FF', headerBorder: '#CCFBF1',
    textPrimary: '#042F2E', textSecondary: '#0F766E', accent: '#00ACC1', accentDark: '#00838F',
    pillBg: '#CCFBF1', pillBorder: '#2DD4BF', pillText: '#0F766E',
    boxBg: '#F0FDFA', boxBorder: '#99F6E4', btnBg: '#00ACC1', btnText: '#ffffff',
    barColors: ['#00F2FE', '#00E5FF', '#0284C7', '#00ACC1'],
  },
  nieve: {
    bodyBg: '#F0F9FF', cardBg: '#FFFFFF', cardBorder: '#BAE6FD', headerBorder: '#E0F2FE',
    textPrimary: '#0C4A6E', textSecondary: '#0369A1', accent: '#0284C7', accentDark: '#0369A1',
    pillBg: '#E0F2FE', pillBorder: '#7DD3FC', pillText: '#0369A1',
    boxBg: '#F8FAFC', boxBorder: '#BAE6FD', btnBg: '#0284C7', btnText: '#ffffff',
    barColors: ['#7DD3FC', '#38BDF8', '#0284C7', '#bae6fd'],
  },
  caramelos: {
    bodyBg: '#FFF5F9', cardBg: '#FFFFFF', cardBorder: '#F9A8D4', headerBorder: '#FCE7F3',
    textPrimary: '#831843', textSecondary: '#9D174D', accent: '#DB2777', accentDark: '#BE185D',
    pillBg: '#FCE7F3', pillBorder: '#F472B6', pillText: '#BE185D',
    boxBg: '#FDF2F8', boxBorder: '#FBCFE8', btnBg: '#DB2777', btnText: '#ffffff',
    barColors: ['#FF1493', '#FF85C0', '#FF69B4', '#DB2777'],
  },
};

export function buildEmailHTML(
  name,
  badge,
  certUrl,
  assertionJsonUrl,
  role = 'Asistente Certificado',
  assertionId = '',
  style = 'google',
  evidence = ''
) {
  const badgeName = badge.name || 'Certificado Oficial GDGoC UHU';
  const badgeDesc = badge.description || '';
  const resolvedStyle = style || badge.style || 'google';
  const t = EMAIL_THEMES[resolvedStyle] || EMAIL_THEMES.google;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${badgeName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${t.bodyBg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: ${t.textPrimary};">

  <!-- Barra de Estilo -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td width="25%" height="5" style="background-color: ${t.barColors[0]};"></td>
      <td width="25%" height="5" style="background-color: ${t.barColors[1]};"></td>
      <td width="25%" height="5" style="background-color: ${t.barColors[2]};"></td>
      <td width="25%" height="5" style="background-color: ${t.barColors[3]};"></td>
    </tr>
  </table>

  <!-- Contenedor Principal -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${t.bodyBg}; padding: 40px 15px;">
    <tr>
      <td align="center">
        
        <table role="presentation" width="100%" style="max-width: 600px; background-color: ${t.cardBg}; border-radius: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); overflow: hidden; border: 1px solid ${t.cardBorder};" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Encabezado con Identidad GDGoC UHU -->
          <tr>
            <td style="padding: 35px 35px 20px 35px; text-align: center; border-bottom: 1px solid ${t.headerBorder};">
              <h2 style="margin: 0; font-size: 20px; color: ${t.textPrimary}; font-weight: 800; letter-spacing: -0.5px;">
                GDG on Campus
              </h2>
              <div style="font-size: 13px; color: ${t.accentDark}; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">
                Universidad de Huelva
              </div>
            </td>
          </tr>

          <!-- Insignia y Enhorabuena -->
          <tr>
            <td style="padding: 35px 35px 25px 35px; text-align: center;">
              
              <div style="display: inline-block; padding: 6px 14px; background-color: ${t.pillBg}; border: 1px solid ${t.pillBorder}; border-radius: 50px; font-size: 12px; font-weight: 700; color: ${t.pillText}; margin-bottom: 20px;">
                ✓ Credencial Digital Oficial Emitida
              </div>

              <div style="font-size: 13px; color: ${t.textSecondary}; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 6px;">
                Este certificado digital se otorga a:
              </div>
              <h1 style="margin: 0 0 12px 0; font-size: 26px; color: ${t.textPrimary}; font-weight: 800; letter-spacing: -0.5px;">
                ${name}
              </h1>

              ${role ? `<div style="display: inline-block; padding: 4px 12px; background-color: ${t.pillBg}; border: 1px solid ${t.pillBorder}; border-radius: 50px; font-size: 11px; font-weight: 700; color: ${t.pillText}; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 16px;">${role}</div>` : ''}

              <div style="background-color: ${t.boxBg}; border: 1px solid ${t.boxBorder}; border-radius: 16px; padding: 24px; margin: 16px 0 20px 0; text-align: center;">
                <div style="font-size: 11px; color: ${t.accent}; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin-bottom: 6px;">
                  Insignia Acreditada
                </div>
                <h3 style="margin: 0 0 10px 0; font-size: 20px; color: ${t.textPrimary}; font-weight: 800;">
                  ${badgeName}
                </h3>
                ${badgeDesc ? `<p style="margin: 0; font-size: 13px; color: ${t.textSecondary}; line-height: 1.5;">${badgeDesc}</p>` : ''}
                ${evidence ? `<div style="margin-top: 10px;"><a href="${evidence}" target="_blank" style="font-size: 12px; font-weight: 700; color: ${t.accent}; text-decoration: underline;">Ver Evidencia / Proyecto ↗</a></div>` : ''}
                ${assertionId ? `<div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed ${t.boxBorder}; font-size: 11px; color: ${t.textSecondary}; font-family: monospace;">ID del Certificado: <strong style="color: ${t.textPrimary};">${assertionId}</strong></div>` : ''}
              </div>

              <!-- Botón Principal -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0 15px 0;">
                <tr>
                  <td align="center">
                    <a href="${certUrl}" target="_blank" style="display: inline-block; background-color: ${t.btnBg}; color: ${t.btnText}; text-decoration: none; padding: 15px 32px; border-radius: 12px; font-size: 15px; font-weight: 700; text-align: center;">
                      🎓 Abrir Mi Certificado Oficial →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 12px; color: ${t.textSecondary}; margin: 15px 0 0 0; line-height: 1.5;">
                Haz clic en el botón para ver tu certificado en línea, descargarlo en <strong>PDF (1 página horizontal)</strong> listo para imprimir o añadirlo directamente a <strong>LinkedIn</strong> o a tu cartera preferida (OpenBadge Passport, Parchment o Credly).
              </p>

            </td>
          </tr>

          <!-- Pie de página del correo -->
          <tr>
            <td style="padding: 25px 35px; background-color: ${t.boxBg}; border-top: 1px solid ${t.boxBorder}; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 11px; color: ${t.textSecondary}; line-height: 1.4;">
                Certificado verificado bajo el estándar internacional <strong>Open Badges 2.0</strong> (IMS Global).<br>
                Alojado oficialmente en <a href="${siteUrl}" style="color: ${t.accent}; text-decoration: none; font-weight: 600;">${siteUrl}</a>
              </p>
              <div style="font-size: 10px; color: ${t.textSecondary}; font-family: monospace; word-break: break-all; margin-top: 6px;">
                Aserción técnica JSON: <a href="${assertionJsonUrl}" style="color: ${t.accent};">${assertionJsonUrl}</a>
              </div>
            </td>
          </tr>

        </table>

        <!-- Copyright final -->
        <table role="presentation" width="100%" style="max-width: 600px; margin-top: 20px;" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td align="center" style="font-size: 11px; color: ${t.textSecondary};">
              Google Developer Group on Campus · Universidad de Huelva (UHU)
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

async function main() {
  console.log('\n📧 GDGoC UHU — Envío Automatizado de Certificados por Gmail\n');

  if (!gmailUser || !gmailPassword) {
    console.error('⚠️  No se han configurado GMAIL_USER y GMAIL_APP_PASSWORD.');
    console.error('   Los certificados ya están publicados en la web.');
    console.error('   Para activar el envío de emails, añade los dos secretos en GitHub Settings > Secrets.\n');
    process.exit(0);
  }

  const listArg = process.argv[2];
  if (!listArg) {
    console.error('❌ Error: Falta la ruta al archivo JSON con la lista de destinatarios.');
    console.error('Uso: node scripts/send-emails.mjs /ruta/al/archivo.json\n');
    process.exit(1);
  }

  const listPath = path.resolve(listArg);
  if (!fs.existsSync(listPath)) {
    console.error(`❌ Error: El archivo "${listPath}" no existe.`);
    process.exit(1);
  }

  const recipients = JSON.parse(fs.readFileSync(listPath, 'utf-8'));
  if (!Array.isArray(recipients) || recipients.length === 0) {
    console.log('ℹ️  No hay destinatarios en la lista. Nada que enviar.');
    process.exit(0);
  }

  console.log(`📫 Conectando a Gmail con la cuenta: ${gmailUser}`);
  console.log(`📋 Total de emails a enviar: ${recipients.length}\n`);

  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPassword,
    },
  });

  // Verificar conexión SMTP
  try {
    await transporter.verify();
    console.log('✅ Conexión con Gmail establecida correctamente.\n');
  } catch (err) {
    console.error(`❌ Error al autenticar con Gmail: ${err.message}`);
    console.error('Verifica que GMAIL_APP_PASSWORD sea una contraseña de aplicación válida de 16 caracteres.');
    process.exit(1);
  }

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < recipients.length; i++) {
    const item = recipients[i];
    const badge = loadBadge(item.badgeId);
    const certUrl = item.url || `${siteUrl}/cert/${item.assertionId}`;
    const assertionJsonUrl = `${siteUrl}/api/badges/assertion/${item.assertionId}.json`;
    const subject = `🎓 Tu certificado oficial: ${badge.name || item.badgeId} — GDG on Campus UHU`;

    const mailOptions = {
      from: `"GDG on Campus Universidad de Huelva" <${gmailUser}>`,
      to: item.email,
      subject,
      html: buildEmailHTML(
        item.nombre,
        badge,
        certUrl,
        assertionJsonUrl,
        item.role || 'Asistente Certificado',
        item.assertionId || '',
        item.style || badge.style || 'google',
        item.evidence || ''
      ),
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`[${i + 1}/${recipients.length}] ✅ Enviado a ${item.nombre} <${item.email}>`);
      sent++;
      // Pequeña pausa de 800ms para respetar las tasas de envío de Gmail
      await new Promise((resolve) => setTimeout(resolve, 800));
    } catch (err) {
      console.error(`[${i + 1}/${recipients.length}] ❌ Error enviando a ${item.email}: ${err.message}`);
      failed++;
    }
  }

  console.log('\n══════════════════════════════════════════════════════════');
  console.log(`  📊 RESUMEN DE ENVÍO: ${sent} enviados con éxito, ${failed} fallos.`);
  console.log('══════════════════════════════════════════════════════════\n');
}

main().catch(console.error);
