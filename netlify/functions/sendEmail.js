import { Resend } from 'resend';

const jsonResponse = (statusCode, payload) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
});

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { message: 'Method Not Allowed' });
  }

  let formData;

  try {
    formData = JSON.parse(event.body ?? '{}');
  } catch {
    return jsonResponse(400, { message: 'Invalid request body' });
  }

  const { name, email, message, servicio, _honey } = formData;

  if (_honey) {
    return jsonResponse(200, { message: 'Email sent successfully' });
  }

  if (!name || !email || !message || !servicio) {
    return jsonResponse(400, { message: 'Missing required fields' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.error('RESEND_API_KEY is not configured');
    return jsonResponse(500, { message: 'Email service is not configured' });
  }

  try {
    const resend = new Resend(resendApiKey);
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'Retorica Website <contacto@retorica.cl>',
      to: process.env.CONTACT_TO_EMAIL ?? 'contacto@retorica.cl',
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
      console.error('Resend error:', error);
      return jsonResponse(400, { message: error.message ?? 'Email could not be sent' });
    }

    return jsonResponse(200, { message: 'Email sent successfully', id: data?.id });
  } catch (error) {
    console.error('Email function error:', error);
    return jsonResponse(500, { message: error instanceof Error ? error.message : 'Email could not be sent' });
  }
};
