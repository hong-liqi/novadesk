'use client';

import { useAuth } from '@novadesk/auth/client';
import { ROLES } from '@novadesk/shared';
import {
  Badge,
  Button,
  Input,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@novadesk/ui';
import { Modal, useDisclosure } from '@novadesk/ui/client';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  tenantsClient,
  type CreateTenantInput,
  type Tenant,
  type UpdateTenantInput,
} from '@/shared/services';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function TenantsView() {
  const { user } = useAuth();
  const canCreate = user?.roles.includes(ROLES.SUPER_ADMIN) ?? false;
  const createModal = useDisclosure();
  const editModal = useDisclosure();

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [form, setForm] = useState<CreateTenantInput>({ name: '', slug: '' });

  const loadTenants = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await tenantsClient.list();
      setTenants(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tenants');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTenants();
  }, [loadTenants]);

  function openCreateModal() {
    setForm({ name: '', slug: '' });
    setFormError(null);
    createModal.open();
  }

  function openEditModal(tenant: Tenant) {
    setSelectedTenant(tenant);
    setForm({ name: tenant.name, slug: tenant.slug });
    setFormError(null);
    editModal.open();
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFormError(null);

    try {
      await tenantsClient.create(form);
      createModal.close();
      await loadTenants();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create tenant');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTenant) {
      return;
    }

    setSaving(true);
    setFormError(null);

    const payload: UpdateTenantInput = {
      name: form.name,
      slug: form.slug,
    };

    try {
      await tenantsClient.update(selectedTenant.id, payload);
      editModal.close();
      setSelectedTenant(null);
      await loadTenants();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to update tenant');
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(tenant: Tenant) {
    setError(null);

    try {
      await tenantsClient.update(tenant.id, { isActive: !tenant.isActive });
      await loadTenants();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tenant status');
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Tenants</h1>
          <p className="text-sm text-neutral-500">Manage platform tenants</p>
        </div>
        {canCreate ? <Button onClick={openCreateModal}>Create tenant</Button> : null}
      </div>

      {loading ? <p className="text-neutral-500">Loading tenants…</p> : null}
      {error ? <p className="text-red-600">{error}</p> : null}

      {!loading && !error ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Slug</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Created</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell>{tenant.name}</TableCell>
                <TableCell>{tenant.slug}</TableCell>
                <TableCell>
                  <Badge variant={tenant.isActive ? 'success' : 'danger'}>
                    {tenant.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(tenant.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        openEditModal(tenant);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        void toggleActive(tenant);
                      }}
                    >
                      {tenant.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}

      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        title="Create tenant"
        footer={
          <Button type="submit" form="create-tenant-form" loading={saving}>
            Create
          </Button>
        }
      >
        <form
          id="create-tenant-form"
          onSubmit={(event) => {
            void handleCreate(event);
          }}
        >
          <Stack gap="md">
            <Input
              label="Name"
              value={form.name}
              onChange={(event) => {
                const name = event.target.value;
                setForm((current) => ({
                  name,
                  slug: current.slug || slugify(name),
                }));
              }}
              required
            />
            <Input
              label="Slug"
              value={form.slug}
              onChange={(event) => {
                setForm((current) => ({ ...current, slug: event.target.value }));
              }}
              required
            />
            {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
          </Stack>
        </form>
      </Modal>

      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title="Edit tenant"
        footer={
          <Button type="submit" form="edit-tenant-form" loading={saving}>
            Save changes
          </Button>
        }
      >
        <form
          id="edit-tenant-form"
          onSubmit={(event) => {
            void handleUpdate(event);
          }}
        >
          <Stack gap="md">
            <Input
              label="Name"
              value={form.name}
              onChange={(event) => {
                setForm((current) => ({ ...current, name: event.target.value }));
              }}
              required
            />
            <Input
              label="Slug"
              value={form.slug}
              onChange={(event) => {
                setForm((current) => ({ ...current, slug: event.target.value }));
              }}
              required
            />
            {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
          </Stack>
        </form>
      </Modal>
    </div>
  );
}
