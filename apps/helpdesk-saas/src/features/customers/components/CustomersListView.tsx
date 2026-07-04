'use client';

import type { HelpdeskCustomer } from '@novadesk/sdk';
import {
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
import { useCallback, useEffect, useState } from 'react';
import { helpdeskClient } from '@/shared/services';
import { useWorkspace } from '@/shared/hooks/use-workspace';

export function CustomersListView() {
  const { workspaceId, isLoading: workspaceLoading } = useWorkspace();
  const formModal = useDisclosure();
  const [customers, setCustomers] = useState<HelpdeskCustomer[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<HelpdeskCustomer | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const loadCustomers = useCallback(async () => {
    if (!workspaceId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await helpdeskClient.listCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  function openCreate() {
    setEditing(null);
    setName('');
    setEmail('');
    formModal.open();
  }

  function openEdit(customer: HelpdeskCustomer) {
    setEditing(customer);
    setName(customer.name);
    setEmail(customer.email ?? '');
    formModal.open();
  }

  async function handleSave() {
    if (!name.trim()) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editing) {
        await helpdeskClient.updateCustomer(editing.id, {
          name: name.trim(),
          email: email.trim() || null,
        });
      } else {
        await helpdeskClient.createCustomer({
          name: name.trim(),
          email: email.trim() || undefined,
        });
      }
      formModal.close();
      await loadCustomers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save customer');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(customer: HelpdeskCustomer) {
    if (!window.confirm(`Delete customer "${customer.name}"?`)) {
      return;
    }

    setError(null);

    try {
      await helpdeskClient.deleteCustomer(customer.id);
      await loadCustomers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer');
    }
  }

  if (workspaceLoading || loading) {
    return <p className="text-neutral-500">Loading customers…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Customers</h1>
          <p className="text-sm text-neutral-500">Manage customer records</p>
        </div>
        <Button onClick={openCreate}>Add customer</Button>
      </div>

      {error ? <p className="text-red-600">{error}</p> : null}

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Created</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.length ? (
            customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email ?? '—'}</TableCell>
                <TableCell>{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        openEdit(customer);
                      }}
                    >
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => void handleDelete(customer)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>No customers found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        title={editing ? 'Edit customer' : 'Add customer'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={formModal.close}>
              Cancel
            </Button>
            <Button loading={saving} onClick={() => void handleSave()}>
              Save
            </Button>
          </div>
        }
      >
        <Stack gap="md">
          <Input
            label="Name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
            required
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </Stack>
      </Modal>
    </div>
  );
}
