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
 *   - GMAIL_USER: Correo de Gmail del GDGoC (ej: gdgoc.uhu@gmail.com)
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
  try {
    const badgePath = path.join(badgesDir, `${badgeId}.json`);
    return JSON.parse(fs.readFileSync(badgePath, 'utf-8'));
  } catch {
    return { name: badgeId, description: '' };
  }
}

function buildEmailHTML(name, badge, certUrl, assertionJsonUrl) {
  const badgeName = badge.name || 'Certificado Oficial GDGoC UHU';
  const badgeDesc = badge.description || '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${badgeName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">

  <!-- Barra Google Colors -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td width="25%" height="5" style="background-color: #4285F4;"></td>
      <td width="25%" height="5" style="background-color: #EA4335;"></td>
      <td width="25%" height="5" style="background-color: #FBBC04;"></td>
      <td width="25%" height="5" style="background-color: #34A853;"></td>
    </tr>
  </table>

  <!-- Contenedor Principal -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; padding: 40px 15px;">
    <tr>
      <td align="center">
        
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e2e8f0;" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Encabezado con Identidad GDGoC UHU -->
          <tr>
            <td style="padding: 35px 35px 20px 35px; text-align: center; border-bottom: 1px solid #f1f5f9;">
              <h2 style="margin: 0; font-size: 20px; color: #1e293b; font-weight: 800; letter-spacing: -0.5px;">
                GDG <span style="font-weight: 400; color: #64748b;">on Campus</span>
              </h2>
              <div style="font-size: 13px; color: #003366; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 3px;">
                Universidad de Huelva
              </div>
            </td>
          </tr>

          <!-- Insignia y Enhorabuena -->
          <tr>
            <td style="padding: 35px 35px 25px 35px; text-align: center;">
              
              <div style="display: inline-block; padding: 6px 14px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 50px; font-size: 12px; font-weight: 700; color: #047857; margin-bottom: 20px;">
                ✓ Credencial Digital Oficial Emitida
              </div>

              <div style="font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 6px;">
                Otorgado con orgullo a:
              </div>
              <h1 style="margin: 0 0 16px 0; font-size: 26px; color: #0f172a; font-weight: 800; letter-spacing: -0.5px;">
                ${name}
              </h1>

              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin: 20px 0; text-align: center;">
                <div style="font-size: 11px; color: #4285F4; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin-bottom: 6px;">
                  Insignia Acreditada
                </div>
                <h3 style="margin: 0 0 10px 0; font-size: 20px; color: #1e293b; font-weight: 800;">
                  ${badgeName}
                </h3>
                ${badgeDesc ? `<p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">${badgeDesc}</p>` : ''}
              </div>

              <!-- Botón Principal -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 28px 0 15px 0;">
                <tr>
                  <td align="center">
                    <a href="${certUrl}" target="_blank" style="display: inline-block; background-color: #4285F4; color: #ffffff; text-decoration: none; padding: 15px 32px; border-radius: 12px; font-size: 15px; font-weight: 700; box-shadow: 0 4px 14px rgba(66, 133, 244, 0.35); text-align: center;">
                      🎓 Ver y Descargar Mi Certificado →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 12px; color: #94a3b8; margin: 15px 0 0 0; line-height: 1.5;">
                Haz clic en el botón para ver tu certificado en línea, añadirlo directamente a tu perfil de <strong>LinkedIn</strong> o exportarlo a carteras digitales (OpenBadge Passport, Badgr o Credly).
              </p>

            </td>
          </tr>

          <!-- Pie de página del correo -->
          <tr>
            <td style="padding: 25px 35px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 11px; color: #64748b; line-height: 1.4;">
                Certificado verificado bajo el estándar internacional <strong>Open Badges v2.0</strong> (1EdTech).<br>
                Alojado oficialmente en <a href="${siteUrl}" style="color: #4285F4; text-decoration: none; font-weight: 600;">${siteUrl}</a>
              </p>
              <div style="font-size: 10px; color: #94a3b8; font-family: monospace; word-break: break-all; margin-top: 6px;">
                Aserción técnica JSON: <a href="${assertionJsonUrl}" style="color: #64748b;">${assertionJsonUrl}</a>
              </div>
            </td>
          </tr>

        </table>

        <!-- Copyright final -->
        <table role="presentation" width="100%" style="max-width: 600px; margin-top: 20px;" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td align="center" style="font-size: 11px; color: #94a3b8;">
              Google Developer Groups on Campus · Universidad de Huelva (UHU)
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
      html: buildEmailHTML(item.nombre, badge, certUrl, assertionJsonUrl),
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
