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
const assertionsDir = path.join(rootDir, 'src', 'content', 'assertions');

const siteUrl = process.env.SITE_URL || 'https://gdguhu.es';
const gmailUser = process.env.GMAIL_USER || 'arielbustilloleon@gmail.com';
const gmailPassword = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');

function loadBadge(badgeId) {
  const candidates = [
    path.join(badgesDir, `${badgeId}.json`),
    path.join(badgesDir, 'publish', `${badgeId}.json`),
    path.join(rootDir, 'publish', `${badgeId}.json`),
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

function loadAssertion(assertionId) {
  if (!assertionId) return null;
  const candidates = [
    path.join(assertionsDir, `${assertionId}.json`),
    path.join(assertionsDir, 'publish', `${assertionId}.json`),
    path.join(rootDir, 'publish', `${assertionId}.json`),
  ];
  for (const assertionPath of candidates) {
    if (fs.existsSync(assertionPath)) {
      try {
        return JSON.parse(fs.readFileSync(assertionPath, 'utf-8'));
      } catch {
        // continuar
      }
    }
  }
  return null;
}

const EMAIL_THEMES = {
  google: {
    strip: ['#4285F4', '#EA4335', '#FBBC04', '#34A853'],
    outerBg: '#f8fafc',
    cardBg: '#ffffff',
    cardBorder: '#dadce0',
    headerBorder: '#f1f5f9',
    textPrimary: '#202124',
    textSecondary: '#475569',
    textMuted: '#5f6368',
    accent: '#1967D2',
    verifiedBg: '#e6f4ea',
    verifiedBorder: '#ceead6',
    verifiedText: '#137333',
    rolePillBg: '#e8f0fe',
    rolePillBorder: '#d2e3fc',
    rolePillText: '#1967D2',
    boxBg: '#f8f9fa',
    boxBorder: '#dadce0',
    btnBg: '#4285F4',
    btnText: '#ffffff',
    footerBg: '#f8fafc',
  },
  cyber: {
    strip: ['#00F0FF', '#FF007F', '#FFE600', '#00FF66'],
    outerBg: '#05070F',
    cardBg: '#070B19',
    cardBorder: '#00F0FF',
    headerBorder: 'rgba(0, 240, 255, 0.25)',
    textPrimary: '#F0F9FF',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',
    accent: '#00F0FF',
    verifiedBg: 'rgba(0, 255, 102, 0.12)',
    verifiedBorder: '#00FF66',
    verifiedText: '#00FF66',
    rolePillBg: 'rgba(0, 240, 255, 0.14)',
    rolePillBorder: '#00F0FF',
    rolePillText: '#00F0FF',
    boxBg: '#0C142C',
    boxBorder: 'rgba(255, 0, 127, 0.45)',
    btnBg: '#00F0FF',
    btnText: '#05070F',
    footerBg: '#070B19',
  },
  piscina: {
    strip: ['#00F2FE', '#4FACFE', '#00E5FF', '#0284C7'],
    outerBg: '#E0F7FA',
    cardBg: '#FFFFFF',
    cardBorder: '#00BCD4',
    headerBorder: '#B2EBF2',
    textPrimary: '#002B3D',
    textSecondary: '#004D61',
    textMuted: '#00587A',
    accent: '#0284C7',
    verifiedBg: '#E0F2FE',
    verifiedBorder: '#00E5FF',
    verifiedText: '#004D61',
    rolePillBg: '#E0F7FA',
    rolePillBorder: '#00BCD4',
    rolePillText: '#006064',
    boxBg: '#F0FDFF',
    boxBorder: '#00BCD4',
    btnBg: '#0284C7',
    btnText: '#FFFFFF',
    footerBg: '#E0F7FA',
  },
  nieve: {
    strip: ['#FFFFFF', '#7DD3FC', '#38BDF8', '#BAE6FD'],
    outerBg: '#071527',
    cardBg: '#08182E',
    cardBorder: '#7DD3FC',
    headerBorder: 'rgba(186, 230, 253, 0.3)',
    textPrimary: '#F0F9FF',
    textSecondary: '#E0F2FE',
    textMuted: '#BAE6FD',
    accent: '#7DD3FC',
    verifiedBg: 'rgba(186, 230, 253, 0.15)',
    verifiedBorder: '#7DD3FC',
    verifiedText: '#E0F2FE',
    rolePillBg: 'rgba(224, 242, 254, 0.18)',
    rolePillBorder: '#BAE6FD',
    rolePillText: '#FFFFFF',
    boxBg: '#0E2442',
    boxBorder: 'rgba(125, 211, 252, 0.5)',
    btnBg: '#38BDF8',
    btnText: '#040D1A',
    footerBg: '#08182E',
  },
  caramelos: {
    strip: ['#FF1493', '#FF85C0', '#FF69B4', '#D81B60'],
    outerBg: '#FFE4F2',
    cardBg: '#FFF9FC',
    cardBorder: '#FF4D94',
    headerBorder: '#FFD1E8',
    textPrimary: '#880E4F',
    textSecondary: '#AD1457',
    textMuted: '#C2185B',
    accent: '#D81B60',
    verifiedBg: '#FFF0F6',
    verifiedBorder: '#FF69B4',
    verifiedText: '#AD1457',
    rolePillBg: '#FFE0F0',
    rolePillBorder: '#FF1493',
    rolePillText: '#AD1457',
    boxBg: '#FFE0F0',
    boxBorder: '#FF69B4',
    btnBg: '#FF1493',
    btnText: '#FFFFFF',
    footerBg: '#FFE8F3',
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
  const badgeName = badge.name || 'Certificado oficial GDGoC UHU';
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
<body style="margin: 0; padding: 0; background-color: ${t.outerBg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: ${t.textPrimary};">

  <!-- Barra de Estilo -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td width="25%" height="6" style="background-color: ${t.strip[0]};"></td>
      <td width="25%" height="6" style="background-color: ${t.strip[1]};"></td>
      <td width="25%" height="6" style="background-color: ${t.strip[2]};"></td>
      <td width="25%" height="6" style="background-color: ${t.strip[3]};"></td>
    </tr>
  </table>

  <!-- Contenedor Principal -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${t.outerBg}; padding: 30px 15px;">
    <tr>
      <td align="center">
        
        <table role="presentation" width="100%" style="max-width: 580px; background-color: ${t.cardBg}; border-radius: 20px; overflow: hidden; border: 2px solid ${t.cardBorder};" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Encabezado con Identidad GDGoC UHU -->
          <tr>
            <td style="padding: 28px 30px 18px 30px; text-align: center; border-bottom: 1px solid ${t.headerBorder};">
              <h2 style="margin: 0; font-size: 20px; color: ${t.textPrimary}; font-weight: 800; letter-spacing: -0.5px;">
                GDG on Campus
              </h2>
              <div style="font-size: 13px; color: ${t.accent}; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">
                Universidad de Huelva
              </div>
            </td>
          </tr>

          <!-- Insignia y Enhorabuena -->
          <tr>
            <td style="padding: 30px 30px 24px 30px; text-align: center;">
              
              <div style="display: inline-block; padding: 6px 14px; background-color: ${t.verifiedBg}; border: 1px solid ${t.verifiedBorder}; border-radius: 50px; font-size: 12px; font-weight: 700; color: ${t.verifiedText}; margin-bottom: 18px;">
                ✓ Credencial Digital Oficial Emitida
              </div>

              <div style="font-size: 12px; color: ${t.textMuted}; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 6px;">
                Este certificado digital se otorga a:
              </div>
              <h1 style="margin: 0 0 12px 0; font-size: 25px; color: ${t.textPrimary}; font-weight: 800;">
                ${name}
              </h1>

              ${role ? `<div style="display: inline-block; padding: 5px 14px; background-color: ${t.rolePillBg}; border: 1.5px solid ${t.rolePillBorder}; border-radius: 50px; font-size: 11px; font-weight: 700; color: ${t.rolePillText}; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 14px;">${role}</div>` : ''}

              <div style="background-color: ${t.boxBg}; border: 1.5px solid ${t.boxBorder}; border-radius: 16px; padding: 20px; margin: 14px 0 20px 0; text-align: center;">
                <div style="font-size: 11px; color: ${t.accent}; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin-bottom: 6px;">
                  Insignia Acreditativa
                </div>
                <h3 style="margin: 0 0 8px 0; font-size: 19px; color: ${t.textPrimary}; font-weight: 800;">
                  ${badgeName}
                </h3>
                ${badgeDesc ? `<p style="margin: 0; font-size: 13px; color: ${t.textSecondary}; line-height: 1.5;">${badgeDesc}</p>` : ''}
                ${assertionId ? `<div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed ${t.cardBorder}; font-size: 11px; color: ${t.textMuted}; font-family: monospace;">ID del certificado: <strong style="color: ${t.textPrimary};">${assertionId}</strong></div>` : ''}
              </div>

              <!-- Botón Principal Bulletproof para Móviles y Clientes de Correo -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 22px auto 10px auto;">
                <tr>
                  <td align="center" bgcolor="${t.btnBg}" style="border-radius: 12px; background-color: ${t.btnBg};">
                    <a href="${certUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 14px 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 800; color: ${t.btnText}; text-decoration: none; border-radius: 12px; -webkit-text-size-adjust: none; mso-padding-alt: 0; cursor: pointer; text-align: center;">
                      Abrir mi certificado oficial
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Enlace alternativo directo en caso de clientes móviles restrictivos -->
              <div style="margin: 8px 0 16px 0; font-size: 11px; color: ${t.textMuted}; word-break: break-all; line-height: 1.4; text-align: center;">
                Si el botón no abre, accede directamente desde este enlace:<br>
                <a href="${certUrl}" target="_blank" rel="noopener noreferrer" style="color: ${t.accent}; text-decoration: underline; font-weight: 600;">${certUrl}</a>
              </div>

              ${evidence ? `<div style="margin: 10px 0 14px 0;"><a href="${evidence}" target="_blank" style="display: inline-block; color: ${t.accent}; font-size: 12.5px; font-weight: 700; text-decoration: underline;">Ver Evidencia / Proyecto ↗</a></div>` : ''}

              <p style="font-size: 12px; color: ${t.textMuted}; margin: 12px 0 0 0; line-height: 1.5;">
                Haz clic en el botón para ver tu certificado en línea, descargarlo como PDF o añadirlo a tu LinkedIn o cartera favorita
              </p>

            </td>
          </tr>

          <!-- Pie de página del correo -->
          <tr>
            <td style="padding: 20px 30px; background-color: ${t.footerBg}; border-top: 1px solid ${t.headerBorder}; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: ${t.textMuted}; line-height: 1.4;">
                Certificado verificado bajo el estándar internacional <strong>Open Badges 2.0</strong> de 1EdTech.<br>
                Alojado oficialmente en <a href="${siteUrl}" style="color: ${t.accent}; text-decoration: none; font-weight: 700;">${siteUrl}</a>
              </p>
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
    const assertionData = loadAssertion(item.assertionId);
    const resolvedStyle = item.style || assertionData?.styleOverride || badge.style || 'google';
    const resolvedEvidence = item.evidence || assertionData?.evidence || '';
    const resolvedRole = item.role || assertionData?.role || 'Asistente Certificado';
    const rawCertUrl = item.url || `${siteUrl}/cert/${item.assertionId}`;
    const certUrl = rawCertUrl.endsWith('/') ? rawCertUrl : `${rawCertUrl}/`;
    const assertionJsonUrl = `${siteUrl}/api/badges/assertion/${item.assertionId}.json`;
    const subject = `Certificado: ${badge.name || item.badgeId}`;

    const mailOptions = {
      from: `"GDG on Campus Universidad de Huelva" <${gmailUser}>`,
      to: item.email,
      subject,
      html: buildEmailHTML(
        item.nombre,
        badge,
        certUrl,
        assertionJsonUrl,
        resolvedRole,
        item.assertionId || '',
        resolvedStyle,
        resolvedEvidence
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
