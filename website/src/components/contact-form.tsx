'use client';

import { Button, Input, Stack, Surface, Text } from '@novadesk/ui';
import { FormEvent, useState } from 'react';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const CONTACT_ENDPOINT = '/api/v1/notifications/send';
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'contact@novadesk.local';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: CONTACT_EMAIL,
          subject: `NovaDesk contact from ${name}`,
          body: `From: ${name} <${email}>\n\n${message}`,
          html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message.replace(/\n/g, '<br/>')}</p>`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed (${String(response.status)})`);
      }

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to send message. Please try again.',
      );
    }
  }

  return (
    <section id="contact" className="border-t border-slate-800/80 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <Stack gap="sm" className="mb-8 text-center">
          <Text as="h2" size="xl" weight="bold" className="!text-white">
            Get in touch
          </Text>
          <Text as="p" tone="muted" className="!text-slate-400">
            Send a message via the Notification Service through the API Gateway.
          </Text>
        </Stack>

        <Surface variant="outline" padding="lg" className="border-slate-800 bg-slate-900/50">
          <form
            onSubmit={(event) => {
              void handleSubmit(event);
            }}
          >
            <Stack gap="md">
              <Input
                label="Name"
                name="name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
                required
                autoComplete="name"
                placeholder="Your name"
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
              <label className="ui-input-field">
                <span className="ui-input-field__label">Message</span>
                <textarea
                  name="message"
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value);
                  }}
                  required
                  rows={5}
                  placeholder="Tell me about your project..."
                  className="ui-input w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </label>

              {status === 'success' ? (
                <Text as="p" size="sm" className="!text-emerald-400" role="status">
                  Message sent successfully. Thank you!
                </Text>
              ) : null}

              {status === 'error' ? (
                <Text as="p" size="sm" tone="danger" role="alert">
                  {errorMessage}
                </Text>
              ) : null}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={status === 'submitting'}
                className="w-full"
              >
                Send message
              </Button>
            </Stack>
          </form>
        </Surface>
      </div>
    </section>
  );
}
