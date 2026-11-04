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
  hardware: {
    strip: ['#00E676', '#D4AF37', '#00BFA5', '#FFD54F'],
    outerBg: '#03120C',
    cardBg: '#062115',
    cardBorder: '#D4AF37',
    headerBorder: 'rgba(212, 175, 55, 0.3)',
    textPrimary: '#ECFDF5',
    textSecondary: '#A7F3D0',
    textMuted: '#86EFAC',
    accent: '#FFD54F',
    verifiedBg: 'rgba(0, 230, 118, 0.14)',
    verifiedBorder: '#00E676',
    verifiedText: '#00E676',
    rolePillBg: 'rgba(212, 175, 55, 0.16)',
    rolePillBorder: '#D4AF37',
    rolePillText: '#FFD54F',
    boxBg: '#04160E',
    boxBorder: 'rgba(212, 175, 55, 0.5)',
    btnBg: '#00E676',
    btnText: '#03120C',
    footerBg: '#04160E',
  },
  cyberpunk: {
    strip: ['#FCEE0A', '#FF0055', '#00F0FF', '#FCEE0A'],
    outerBg: '#07040E',
    cardBg: '#0F071E',
    cardBorder: '#FCEE0A',
    headerBorder: 'rgba(255, 0, 85, 0.4)',
    textPrimary: '#FFFFFF',
    textSecondary: '#E2E8F0',
    textMuted: '#00F0FF',
    accent: '#FCEE0A',
    verifiedBg: 'rgba(252, 238, 10, 0.15)',
    verifiedBorder: '#FCEE0A',
    verifiedText: '#FCEE0A',
    rolePillBg: '#FCEE0A',
    rolePillBorder: '#FF0055',
    rolePillText: '#07040E',
    boxBg: '#160A2A',
    boxBorder: '#FF0055',
    btnBg: '#FCEE0A',
    btnText: '#07040E',
    footerBg: '#090514',
  },
  aurora: {
    strip: ['#00FFAA', '#38BDF8', '#A855F7', '#EC4899'],
    outerBg: '#030511',
    cardBg: '#080D26',
    cardBorder: '#00FFAA',
    headerBorder: 'rgba(0, 255, 170, 0.28)',
    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#A5F3FC',
    accent: '#00FFAA',
    verifiedBg: 'rgba(0, 255, 170, 0.14)',
    verifiedBorder: '#00FFAA',
    verifiedText: '#00FFAA',
    rolePillBg: 'rgba(168, 85, 247, 0.2)',
    rolePillBorder: '#A855F7',
    rolePillText: '#E9D5FF',
    boxBg: '#0D1538',
    boxBorder: 'rgba(0, 255, 170, 0.45)',
    btnBg: '#00FFAA',
    btnText: '#030511',
    footerBg: '#050819',
  },
  blueprint: {
    strip: ['#60A5FA', '#EFF6FF', '#2563EB', '#93C5FD'],
    outerBg: '#061534',
    cardBg: '#09204E',
    cardBorder: '#60A5FA',
    headerBorder: 'rgba(147, 197, 253, 0.35)',
    textPrimary: '#FFFFFF',
    textSecondary: '#DBEAFE',
    textMuted: '#93C5FD',
    accent: '#60A5FA',
    verifiedBg: 'rgba(59, 130, 246, 0.25)',
    verifiedBorder: '#93C5FD',
    verifiedText: '#EFF6FF',
    rolePillBg: 'rgba(30, 64, 175, 0.6)',
    rolePillBorder: '#93C5FD',
    rolePillText: '#FFFFFF',
    boxBg: '#07193E',
    boxBorder: '#60A5FA',
    btnBg: '#3B82F6',
    btnText: '#FFFFFF',
    footerBg: '#07193E',
  },
  antiguo: {
    strip: ['#1B365D', '#D4AF37', '#9A3412', '#D4AF37'],
    outerBg: '#F4EBDC',
    cardBg: '#FAF5E8',
    cardBorder: '#D4AF37',
    headerBorder: '#E6D5B8',
    textPrimary: '#1C1610',
    textSecondary: '#44331F',
    textMuted: '#6B5132',
    accent: '#92400E',
    verifiedBg: '#FDF6E2',
    verifiedBorder: '#D4AF37',
    verifiedText: '#92400E',
    rolePillBg: '#FDF6E2',
    rolePillBorder: '#B45309',
    rolePillText: '#92400E',
    boxBg: '#F5ECDA',
    boxBorder: '#D4AF37',
    btnBg: '#1B365D',
    btnText: '#FAF5E8',
    footerBg: '#EFE4CE',
  },
  japon: {
    strip: ['#C82829', '#D4AF37', '#1C1917', '#FDA4AF'],
    outerBg: '#F5EFE6',
    cardBg: '#FDFBF7',
    cardBorder: '#C82829',
    headerBorder: '#E7E0D6',
    textPrimary: '#1C1917',
    textSecondary: '#44403C',
    textMuted: '#57534E',
    accent: '#C82829',
    verifiedBg: '#FFF1F2',
    verifiedBorder: '#C82829',
    verifiedText: '#9F1239',
    rolePillBg: '#FFF1F2',
    rolePillBorder: '#C82829',
    rolePillText: '#9F1239',
    boxBg: '#F9F4EC',
    boxBorder: '#C82829',
    btnBg: '#C82829',
    btnText: '#FFFFFF',
    footerBg: '#F3ECE1',
  },
  voynich: {
    strip: ['#E11D48', '#F59E0B', '#10B981', '#6366F1'],
    outerBg: '#0C0714',
    cardBg: '#180E29',
    cardBorder: '#F59E0B',
    headerBorder: 'rgba(245, 158, 11, 0.3)',
    textPrimary: '#FFFBEB',
    textSecondary: '#FEF3C7',
    textMuted: '#FDE68A',
    accent: '#FBBF24',
    verifiedBg: 'rgba(16, 185, 129, 0.16)',
    verifiedBorder: '#34D399',
    verifiedText: '#6EE7B7',
    rolePillBg: 'rgba(245, 158, 11, 0.2)',
    rolePillBorder: '#FBBF24',
    rolePillText: '#FEF3C7',
    boxBg: '#120A20',
    boxBorder: 'rgba(244, 63, 94, 0.5)',
    btnBg: '#D97706',
    btnText: '#FFFBEB',
    footerBg: '#120A20',
  },
  mixteca: {
    strip: ['#00A86B', '#F59E0B', '#C41E3A', '#2DD4BF'],
    outerBg: '#05140E',
    cardBg: '#09241A',
    cardBorder: '#F59E0B',
    headerBorder: 'rgba(245, 158, 11, 0.3)',
    textPrimary: '#FEF3C7',
    textSecondary: '#D1FAE5',
    textMuted: '#6EE7B7',
    accent: '#F59E0B',
    verifiedBg: 'rgba(0, 168, 107, 0.2)',
    verifiedBorder: '#10B981',
    verifiedText: '#6EE7B7',
    rolePillBg: 'rgba(245, 158, 11, 0.2)',
    rolePillBorder: '#F59E0B',
    rolePillText: '#FCD34D',
    boxBg: '#061912',
    boxBorder: '#00A86B',
    btnBg: '#00A86B',
    btnText: '#FFFFFF',
    footerBg: '#061912',
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
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 22px auto 14px auto;">
                <tr>
                  <td align="center" bgcolor="${t.btnBg}" style="border-radius: 12px; background-color: ${t.btnBg};">
                    <a href="${certUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 14px 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 800; color: ${t.btnText}; text-decoration: none; border-radius: 12px; -webkit-text-size-adjust: none; mso-padding-alt: 0; cursor: pointer; text-align: center;">
                      Abrir mi certificado oficial
                    </a>
                  </td>
                </tr>
              </table>

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
