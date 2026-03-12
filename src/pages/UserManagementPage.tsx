import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCreateUser, useDeleteUser, useUsers, useUpdateUserRole, useUpdateUserActive } from '@/hooks/useUsers';
import { ROLES, ROLE_LABELS, type Role } from '@/lib/constants';
import { Badge, Button, Card, CardHeader, Input, Modal, PaginationControls, Select } from '@/components/ui';

export default function UserManagementPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const updateRole = useUpdateUserRole();
  const updateActive = useUpdateUserActive();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'team_member' as Role,
  });

  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'asset_manager') navigate('/');
  }, [user, navigate]);

  const roleOptions = ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] }));
  const totalUsers = users?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize));
  const pagedUsers = useMemo(() => {
    if (!users) return [];
    const start = (page - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [users, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const canManageUser = (target: { id: number; role: Role }) => {
    if (!user) return false;
    if (target.id === user.id) return false;
    if (user.role === 'admin') return true;
    return target.role !== 'admin';
  };

  const handleCreateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await createUser.mutateAsync(newUser);
    setNewUser({ name: '', email: '', password: '', role: 'team_member' });
    setShowAdd(false);
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    await deleteUser.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  if (!user || (user.role !== 'admin' && user.role !== 'asset_manager')) return null;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-hero font-medium text-secondary-900 dark:text-secondary-50">
          User Management
          </h1>
          <p className="mt-1 text-body text-gray-500 dark:text-gray-400">
            Manage team members, roles, and account status
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)}>Add Member</Button>
      </div>

      <Card padding="none">
        <div className="p-5 md:p-6">
          <CardHeader
            title="Team Members"
            action={<Badge variant="soft">{totalUsers} users</Badge>}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-y border-gray-150 dark:border-secondary-700">
                {['Name', 'Email', 'Role', 'Active', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 md:px-6"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-secondary-700">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-sm text-gray-400 dark:text-secondary-500 md:px-6"
                  >
                    Loading users…
                  </td>
                </tr>
              ) : !pagedUsers.length ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-sm text-gray-400 dark:text-secondary-500 md:px-6"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                pagedUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-secondary-800/60"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-secondary-900 dark:text-secondary-50 md:px-6">
                      {u.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300 md:px-6">
                      {u.email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 md:px-6">
                      <Select
                        options={roleOptions}
                        value={u.role}
                        onChange={(e) =>
                          updateRole.mutate({ id: u.id, role: e.target.value as Role })
                        }
                        disabled={!canManageUser(u)}
                      />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 md:px-6">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={!!u.is_active}
                        onClick={() =>
                          updateActive.mutate({ id: u.id, is_active: !u.is_active })
                        }
                        disabled={!canManageUser(u)}
                        className={`
                          relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-pill
                          transition-colors duration-base
                          disabled:cursor-not-allowed disabled:opacity-50
                          ${u.is_active ? 'bg-primary-400 dark:bg-primary-500' : 'bg-gray-300 dark:bg-secondary-600'}
                        `}
                      >
                        <span
                          className={`
                            pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-base
                            ${u.is_active ? 'translate-x-6' : 'translate-x-1'}
                          `}
                        />
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 md:px-6">
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={!canManageUser(u)}
                        onClick={() => setDeleteTarget({ id: u.id, name: u.name })}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <PaginationControls
          page={page}
          pageSize={pageSize}
          total={totalUsers}
          onPageChange={setPage}
          onPageSizeChange={(nextPageSize) => {
            setPageSize(nextPageSize);
            setPage(1);
          }}
        />
      </Card>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Member">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input
            label="Name"
            value={newUser.name}
            onChange={(event) => setNewUser((current) => ({ ...current, name: event.target.value }))}
            required
          />
          <Input
            label="Email"
            type="email"
            value={newUser.email}
            onChange={(event) => setNewUser((current) => ({ ...current, email: event.target.value }))}
            required
          />
          <Input
            label="Password"
            type="password"
            value={newUser.password}
            onChange={(event) => setNewUser((current) => ({ ...current, password: event.target.value }))}
            required
            minLength={6}
          />
          <Select
            label="Role"
            value={newUser.role}
            onChange={(event) => setNewUser((current) => ({ ...current, role: event.target.value as Role }))}
            options={roleOptions.filter((option) => user.role === 'admin' || option.value !== 'admin')}
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createUser.isPending}>
              {createUser.isPending ? 'Creating…' : 'Create Member'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Member"
      >
        <div className="space-y-4">
          <p className="text-body text-gray-600 dark:text-secondary-300">
            Delete <span className="font-medium text-secondary-900 dark:text-secondary-50">{deleteTarget?.name}</span>?
            This will deactivate the member account.
          </p>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              disabled={deleteUser.isPending}
              onClick={handleDeleteUser}
            >
              {deleteUser.isPending ? 'Deleting…' : 'Delete Member'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
