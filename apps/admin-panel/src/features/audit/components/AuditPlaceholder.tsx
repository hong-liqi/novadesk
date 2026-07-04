import { Surface, Text } from '@novadesk/ui';

export function AuditPlaceholder() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Audit logs</h1>
        <p className="text-sm text-neutral-500">Security and platform activity</p>
      </div>
      <Surface variant="raised" padding="lg">
        <Text tone="muted">
          Audit log browsing will be available in a future milestone. Events are currently recorded
          by auth-service for login, logout, role changes, and password updates.
        </Text>
      </Surface>
    </div>
  );
}
