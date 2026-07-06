'use client';

import { Button, Input } from '@novadesk/ui';
import { FormEvent, useEffect, useState } from 'react';
import { settingsClient } from '@/shared/services';

export function SettingsView() {
  const [contactEmail, setContactEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    void settingsClient
      .getContactEmail()
      .then((email) => {
        setContactEmail(email ?? '');
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load settings');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const saved = await settingsClient.updateContactEmail(contactEmail.trim());
      setContactEmail(saved);
      setSuccess('Contact destination updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Settings</h1>
        <p className="text-sm text-neutral-500">
          Configure platform-wide options used by the public website.
        </p>
      </div>

      {loading ? <p className="text-neutral-500">Loading settings…</p> : null}

      {!loading ? (
        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="max-w-lg rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <Input
            label="Contact form destination email"
            type="email"
            value={contactEmail}
            onChange={(event) => {
              setContactEmail(event.target.value);
            }}
            placeholder="contact@example.com"
            required
          />
          <p className="mt-2 text-sm text-neutral-500">
            Messages submitted on the NovaDesk website contact form are sent to this inbox.
          </p>

          {success ? <p className="mt-4 text-sm text-emerald-600">{success}</p> : null}
          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

          <div className="mt-6">
            <Button type="submit" loading={saving}>
              Save settings
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
