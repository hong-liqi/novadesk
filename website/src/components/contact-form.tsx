'use client';

import { Button, Input, Stack, Surface, Text } from '@novadesk/ui';
import { FormEvent, useEffect, useState } from 'react';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const CONTACT_ENDPOINT = '/api/v1/notifications/send';
const CONTACT_SETTINGS_ENDPOINT = '/api/v1/settings/contact-email';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [destinationEmail, setDestinationEmail] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    void fetch(CONTACT_SETTINGS_ENDPOINT)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Could not load contact settings');
        }

        const payload = (await response.json()) as { contactEmail?: string | null };
        const contactEmail = payload.contactEmail?.trim();
        if (!contactEmail) {
          throw new Error('Contact email is not configured yet');
        }

        setDestinationEmail(contactEmail);
      })
      .catch((error: unknown) => {
        setSettingsError(
          error instanceof Error
            ? error.message
            : 'Contact form is unavailable until an admin configures the destination email.',
        );
      });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? `Request failed (${String(response.status)})`);
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

  const formDisabled = Boolean(settingsError) || !destinationEmail;

  return (
    <section id="contact" className="border-t border-slate-800/80 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <Stack gap="sm" className="mb-8 text-center">
          <Text as="h2" size="xl" weight="bold" className="!text-white">
            Get in touch
          </Text>
          <Text as="p" tone="muted" className="!text-slate-400">
            Messages are delivered by email to the destination configured in Admin → Settings.
          </Text>
          {destinationEmail ? (
            <Text as="p" size="sm" className="!text-slate-500">
              Destination: {destinationEmail}
            </Text>
          ) : null}
        </Stack>

        <Surface variant="outline" padding="lg" className="border-slate-800 bg-slate-900/50">
          {settingsError ? (
            <Text as="p" size="sm" tone="danger" role="alert">
              {settingsError}
            </Text>
          ) : (
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
                  disabled={formDisabled}
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
                  disabled={formDisabled}
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
                    disabled={formDisabled}
                    className="ui-input w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
                  />
                </label>

                {status === 'success' ? (
                  <Text as="p" size="sm" className="!text-emerald-400" role="status">
                    Message sent successfully
                    {destinationEmail ? ` to ${destinationEmail}` : ''}.
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
                  disabled={formDisabled}
                  className="w-full"
                >
                  Send message
                </Button>
              </Stack>
            </form>
          )}
        </Surface>
      </div>
    </section>
  );
}
