import { Resend } from 'resend';

const fallbackResendApiKey = 're_GE2k4CQT_FZZRDC6jyWK1xxdhtqedAsb7';

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const resendApiKey = process.env.RESEND_API_KEY ?? fallbackResendApiKey;

  if (!resendApiKey) {
    return res.status(500).json({ message: 'Email service is not configured' });
  }

  const { name, email, message, servicio } = req.body ?? {};

  if (!name || !email || !message || !servicio) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const resend = new Resend(resendApiKey);
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'Retorica Website <cristobal@retorica.cl>',
      to: process.env.CONTACT_TO_EMAIL ?? 'cristobal@retorica.cl',
      replyTo: email,
      subject: `Nuevo contacto: ${name} - ${servicio}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333;">Nuevo mensaje de contacto desde la Web</h2>
          <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Area de interes:</strong> ${escapeHtml(servicio)}</p>
          <hr />
          <p><strong>Mensaje:</strong></p>
          <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      `,
    });

    if (error) {
      return res.status(400).json({ message: error.message ?? 'Email could not be sent', error });
    }

    return res.status(200).json({ message: 'Email sent successfully', id: data?.id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
