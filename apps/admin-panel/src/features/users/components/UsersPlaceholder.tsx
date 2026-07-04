import { Surface, Text } from '@portfolio/ui';

export function UsersPlaceholder() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Users</h1>
        <p className="text-sm text-neutral-500">Platform user management</p>
      </div>
      <Surface variant="raised" padding="lg">
        <Text tone="muted">
          User management is handled via auth-service. A users list API is not available in this
          milestone — check back once the admin users endpoints are exposed through the gateway.
        </Text>
      </Surface>
    </div>
  );
}
