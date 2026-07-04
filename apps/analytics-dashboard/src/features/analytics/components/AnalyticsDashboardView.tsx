'use client';

import type { AnalyticsKpis, AnalyticsTrends } from '@novadesk/sdk';
import { Button, Surface, Text } from '@novadesk/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { analyticsClient } from '@/shared/services';
import { useWorkspace } from '@/shared/hooks/use-workspace';

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <Surface variant="raised" padding="lg" className="flex flex-col gap-2">
      <Text tone="muted" size="sm">
        {label}
      </Text>
      <Text as="span" size="2xl" weight="semibold">
        {value}
      </Text>
    </Surface>
  );
}

function TrendsChart({ trends }: { trends: AnalyticsTrends }) {
  const maxValue = useMemo(
    () =>
      Math.max(
        1,
        ...trends.points.map((point) =>
          Math.max(point.openCount, point.createdCount, point.resolvedCount),
        ),
      ),
    [trends.points],
  );

  return (
    <Surface variant="raised" padding="lg" className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Daily ticket activity</h2>
        <p className="text-sm text-neutral-500">Last {trends.days} days</p>
      </div>
      <div className="flex items-end gap-3 overflow-x-auto pb-2">
        {trends.points.map((point) => (
          <div key={point.date} className="flex min-w-[3rem] flex-col items-center gap-2">
            <div className="flex h-40 w-10 items-end justify-center gap-1">
              <div
                className="w-2 rounded-t bg-sky-500"
                style={{ height: `${String((point.openCount / maxValue) * 100)}%` }}
                title={`Open: ${String(point.openCount)}`}
              />
              <div
                className="w-2 rounded-t bg-emerald-500"
                style={{ height: `${String((point.resolvedCount / maxValue) * 100)}%` }}
                title={`Resolved: ${String(point.resolvedCount)}`}
              />
            </div>
            <span className="text-[10px] text-neutral-500">{point.date.slice(5)}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 text-xs text-neutral-600">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-sky-500" />
          Open
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          Resolved
        </span>
      </div>
    </Surface>
  );
}

export function AnalyticsDashboardView() {
  const { workspaceId, workspace, isLoading: workspaceLoading } = useWorkspace();
  const [kpis, setKpis] = useState<AnalyticsKpis | null>(null);
  const [trends, setTrends] = useState<AnalyticsTrends | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    if (!workspaceId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [kpiData, trendData] = await Promise.all([
        analyticsClient.getKpis(workspaceId),
        analyticsClient.getTrends({ workspaceId, days: 7 }),
      ]);
      setKpis(kpiData);
      setTrends(trendData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
      setKpis(null);
      setTrends(null);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  async function handleExport() {
    if (!workspaceId) {
      return;
    }

    setExporting(true);
    try {
      const csv = await analyticsClient.exportCsv(workspaceId);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `analytics-${workspaceId.slice(0, 8)}.csv`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export CSV');
    } finally {
      setExporting(false);
    }
  }

  if (workspaceLoading || loading) {
    return <p className="text-neutral-500">Loading analytics…</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!kpis || !trends) {
    return <p className="text-neutral-500">No analytics data available.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Analytics</h1>
          <p className="text-sm text-neutral-500">
            {workspace?.name ?? 'Workspace'} KPIs and ticket trends
          </p>
        </div>
        <Button
          variant="secondary"
          loading={exporting}
          onClick={() => {
            void handleExport();
          }}
        >
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Open tickets" value={kpis.open.toLocaleString()} />
        <KpiCard label="Resolved tickets" value={kpis.resolved.toLocaleString()} />
        <KpiCard label="Avg resolution time" value={`${kpis.avgResolutionTimeHours.toFixed(1)}h`} />
      </div>

      <TrendsChart trends={trends} />
    </div>
  );
}
