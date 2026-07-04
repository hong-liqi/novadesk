'use client';

import { Badge, Surface, Text } from '@novadesk/ui';
import { useCallback, useEffect, useState } from 'react';
import { fetchPlatformHealth, type HealthCheckResult } from '@/shared/services';

function statusVariant(status: string): 'success' | 'danger' | 'warning' | 'default' {
  if (status === 'up' || status === 'ok') {
    return 'success';
  }
  if (status === 'down' || status === 'error') {
    return 'danger';
  }
  return 'warning';
}

function ServiceCard({ name, status }: { name: string; status: string }) {
  return (
    <Surface variant="raised" padding="lg" className="flex items-center justify-between gap-4">
      <Text weight="semibold">{name}</Text>
      <Badge variant={statusVariant(status)}>{status}</Badge>
    </Surface>
  );
}

export function DashboardView() {
  const [health, setHealth] = useState<HealthCheckResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHealth = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchPlatformHealth();
      setHealth(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load platform health');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHealth();
  }, [loadHealth]);

  const services = health?.details ?? health?.info ?? {};

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
          <p className="text-sm text-neutral-500">Platform overview and service health</p>
        </div>
        {health ? <Badge variant={statusVariant(health.status)}>{health.status}</Badge> : null}
      </div>

      {loading ? <p className="text-neutral-500">Loading service health…</p> : null}
      {error ? <p className="text-red-600">{error}</p> : null}

      {!loading && !error && health ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(services).map(([name, service]) => (
            <ServiceCard key={name} name={name} status={service.status} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
