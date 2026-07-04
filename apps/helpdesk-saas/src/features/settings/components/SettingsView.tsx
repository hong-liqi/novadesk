'use client';

import { useWorkspace } from '@/shared/hooks/use-workspace';

export function SettingsView() {
  const { workspace } = useWorkspace();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Settings</h1>
        <p className="text-sm text-neutral-500">Workspace preferences</p>
      </div>
      <dl className="grid max-w-md gap-3 rounded-lg border border-neutral-200 bg-white p-4 text-sm">
        <div>
          <dt className="text-neutral-500">Workspace</dt>
          <dd className="font-medium text-neutral-900">{workspace?.name ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Slug</dt>
          <dd className="font-medium text-neutral-900">{workspace?.slug ?? '—'}</dd>
        </div>
      </dl>
    </div>
  );
}
