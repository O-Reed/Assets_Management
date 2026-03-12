import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { getAll, getOne, runInsert, runQuery } from '../db.js';
import { requireAuth, requireRole, type AuthRequest } from '../middleware.js';
import type { UserRow } from '../types.js';

const router = Router();

router.use(requireAuth);

function isAdmin(req: AuthRequest) {
  return req.user?.role === 'admin';
}

function canManageUser(req: AuthRequest, target: UserRow) {
  if (isAdmin(req)) return true;
  return target.role !== 'admin';
}

router.get('/', requireRole('admin', 'asset_manager'), (_req, res) => {
  const users = getAll('SELECT id, name, email, role, is_active, created_at, updated_at FROM users ORDER BY id');
  res.json(users);
});

const createSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(6).max(120),
  role: z.enum(['admin', 'asset_manager', 'team_member']).default('team_member'),
});

router.post('/', requireRole('admin', 'asset_manager'), (req: AuthRequest, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid user payload', details: parsed.error.flatten() });
    return;
  }

  if (!isAdmin(req) && parsed.data.role === 'admin') {
    res.status(403).json({ error: 'Asset managers cannot create administrators' });
    return;
  }

  const existing = getOne('SELECT id FROM users WHERE email = ?', [parsed.data.email]);
  if (existing) {
    res.status(409).json({ error: 'Email already exists' });
    return;
  }

  const now = new Date().toISOString();
  const passwordHash = bcrypt.hashSync(parsed.data.password, 10);
  const id = runInsert(
    'INSERT INTO users (name, email, password_hash, role, is_active, created_at, updated_at) VALUES (?,?,?,?,1,?,?)',
    [parsed.data.name, parsed.data.email, passwordHash, parsed.data.role, now, now],
  );

  const created = getOne(
    'SELECT id, name, email, role, is_active, created_at, updated_at FROM users WHERE id = ?',
    [id],
  );
  res.status(201).json(created);
});

const patchRoleSchema = z.object({ role: z.enum(['admin', 'asset_manager', 'team_member']) });

router.patch('/:id/role', requireRole('admin', 'asset_manager'), (req: AuthRequest, res) => {
  const parsed = patchRoleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid role' });
    return;
  }
  const id = Number(req.params.id);
  if (id === req.user!.userId) {
    res.status(400).json({ error: 'Cannot change your own role' });
    return;
  }

  const target = getOne('SELECT * FROM users WHERE id = ?', [id]) as UserRow | undefined;
  if (!target) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  if (!canManageUser(req, target)) {
    res.status(403).json({ error: 'Insufficient permissions to manage this user' });
    return;
  }
  if (!isAdmin(req) && parsed.data.role === 'admin') {
    res.status(403).json({ error: 'Asset managers cannot assign administrator role' });
    return;
  }

  const now = new Date().toISOString();
  runQuery('UPDATE users SET role = ?, updated_at = ? WHERE id = ?', [parsed.data.role, now, id]);
  res.json({ ok: true });
});

const patchActiveSchema = z.object({ is_active: z.boolean() });

router.patch('/:id/active', requireRole('admin', 'asset_manager'), (req: AuthRequest, res) => {
  const parsed = patchActiveSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid payload' });
    return;
  }
  const id = Number(req.params.id);
  if (id === req.user!.userId) {
    res.status(400).json({ error: 'Cannot deactivate yourself' });
    return;
  }

  const target = getOne('SELECT * FROM users WHERE id = ?', [id]) as UserRow | undefined;
  if (!target) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  if (!canManageUser(req, target)) {
    res.status(403).json({ error: 'Insufficient permissions to manage this user' });
    return;
  }

  const now = new Date().toISOString();
  runQuery('UPDATE users SET is_active = ?, updated_at = ? WHERE id = ?', [parsed.data.is_active ? 1 : 0, now, id]);
  res.json({ ok: true });
});

router.delete('/:id', requireRole('admin', 'asset_manager'), (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  if (id === req.user!.userId) {
    res.status(400).json({ error: 'Cannot delete yourself' });
    return;
  }

  const target = getOne('SELECT * FROM users WHERE id = ?', [id]) as UserRow | undefined;
  if (!target) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  if (!canManageUser(req, target)) {
    res.status(403).json({ error: 'Insufficient permissions to manage this user' });
    return;
  }

  const now = new Date().toISOString();
  runQuery('UPDATE users SET is_active = 0, updated_at = ? WHERE id = ?', [now, id]);
  res.json({ ok: true });
});

export default router;
