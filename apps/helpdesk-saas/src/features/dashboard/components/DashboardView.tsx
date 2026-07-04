'use client';

import type { DashboardSummary } from '@portfolio/sdk';
import { Surface, Text } from '@portfolio/ui';
import { useCallback, useEffect, useState } from 'react';
import { helpdeskClient } from '@/shared/services';
import { useWorkspace } from '@/shared/hooks/use-workspace';

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Surface variant="raised" padding="lg" className="flex flex-col gap-2">
      <Text tone="muted" size="sm">
        {label}
      </Text>
      <Text as="span" size="2xl" weight="semibold">
        {value.toLocaleString()}
      </Text>
    </Surface>
  );
}

export function DashboardView() {
  const { workspaceId, isLoading: workspaceLoading } = useWorkspace();
  const [stats, setStats] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    if (!workspaceId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await helpdeskClient.getDashboard();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  if (workspaceLoading || loading) {
    return <p className="text-neutral-500">Loading dashboard…</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!stats) {
    return <p className="text-neutral-500">No dashboard data available.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-500">Overview of your support queue</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Open tickets" value={stats.openTickets} />
        <StatCard label="Resolved today" value={stats.resolvedToday} />
        <StatCard label="Total customers" value={stats.totalCustomers} />
      </div>
    </div>
  );
}
