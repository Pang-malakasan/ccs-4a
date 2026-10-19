import { json } from '@sveltejs/kit';
import * as env from '$app/env/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, url, fetch, cookies }) => {
  if (request.headers.get('origin') !== url.origin) {
    return json({ message: 'Please submit the form from this website.' }, { status: 403 });
  }
  const length = Number(request.headers.get('content-length') || 0);
  if (length > 24000) return json({ message: 'Your message is too large.' }, { status: 413 });
  let data: FormData;
  try { data = await request.formData(); }
  catch { return json({ message: 'Please check your form and try again.' }, { status: 400 }); }
  const field = (key: string) => typeof data.get(key) === 'string' ? (data.get(key) as string).trim() : '';
  if (field('website')) return json({ message: 'Unable to submit this enquiry.' }, { status: 400 });
  const name = field('name');
  const email = field('email');
  const phone = field('phone');
  const message = field('message');
  if (!name || name.length > 100 || /[\r\n]/.test(name) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
      phone.length > 40 || message.length < 10 || message.length > 5000) {
    return json({ message: 'Enter a valid name, email, and message (10–5,000 characters).' }, { status: 400 });
  }
  if (cookies.get('contact-cooldown')) {
    return json({ message: 'Please wait a minute before sending another message.' }, { status: 429 });
  }
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL) {
    return json({ message: 'The message service is not configured yet. Please email syphecreative@solutions.com directly.' }, { status: 503 });
  }
  // This cookie is a basic cooldown, not a substitute for deployment-level rate limiting.
  cookies.set('contact-cooldown', '1', { path: '/', httpOnly: true, sameSite: 'strict', secure: url.protocol === 'https:', maxAge: 60 });
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: ['syphecreative@solutions.com'],
        reply_to: email,
        subject: `Website enquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return json({ message: 'Your message could not be sent. Please try again later or email us directly.' }, { status: 502 });
    return json({ message: 'Message sent.' });
  } catch {
    return json({ message: 'The email service is unavailable. Please try again later or email us directly.' }, { status: 502 });
  }
};