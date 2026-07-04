'use client';

import { useAuth } from '@novadesk/auth/client';
import type { Workspace } from '@novadesk/shared';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { helpdeskClient, setApiTenantId } from '@/shared/services';

interface WorkspaceContextValue {
  workspaces: Workspace[];
  workspace: Workspace | null;
  workspaceId: string | null;
  isLoading: boolean;
  error: string | null;
  setWorkspaceId: (id: string) => void;
  refreshWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspaceId, setWorkspaceIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshWorkspaces = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const list = await helpdeskClient.listWorkspaces();
      setWorkspaces(list);

      setWorkspaceIdState((current) => {
        if (current && list.some((item) => item.id === current)) {
          return current;
        }
        return list[0]?.id ?? null;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workspaces');
      setWorkspaces([]);
      setWorkspaceIdState(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      setWorkspaces([]);
      setWorkspaceIdState(null);
      setApiTenantId(null);
      return;
    }

    void refreshWorkspaces();
  }, [authLoading, isAuthenticated, refreshWorkspaces]);

  useEffect(() => {
    setApiTenantId(workspaceId);
  }, [workspaceId]);

  const setWorkspaceId = useCallback((id: string) => {
    setWorkspaceIdState(id);
  }, []);

  const workspace = useMemo(
    () => workspaces.find((item) => item.id === workspaceId) ?? null,
    [workspaces, workspaceId],
  );

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      workspaces,
      workspace,
      workspaceId,
      isLoading: authLoading || isLoading,
      error,
      setWorkspaceId,
      refreshWorkspaces,
    }),
    [
      workspaces,
      workspace,
      workspaceId,
      authLoading,
      isLoading,
      error,
      setWorkspaceId,
      refreshWorkspaces,
    ],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspaceContext(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspaceContext must be used within WorkspaceProvider');
  }
  return context;
}
