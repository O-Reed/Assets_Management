import { Router } from 'express';
import { z } from 'zod';
import { getAll, getOne, runQuery, runInsert } from '../db.js';
import { requireAuth, requireRole } from '../middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', (_req, res) => {
  const items = getAll('SELECT * FROM item_master ORDER BY name');
  res.json(items);
});

const createSchema = z.object({ name: z.string().min(1).max(200) });

router.post('/', requireRole('admin', 'asset_manager'), (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid item name' });
    return;
  }
  const now = new Date().toISOString();
  const existing = getOne('SELECT id FROM item_master WHERE name = ?', [parsed.data.name]);
  if (existing) {
    res.status(409).json({ error: 'Item name already exists' });
    return;
  }
  const id = runInsert('INSERT INTO item_master (name, is_active, created_at, updated_at) VALUES (?,1,?,?)', [parsed.data.name, now, now]);
  res.status(201).json({ id, name: parsed.data.name, is_active: 1 });
});

const updateSchema = z.object({ name: z.string().min(1).max(200).optional(), is_active: z.boolean().optional() });

router.patch('/:id', requireRole('admin', 'asset_manager'), (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid payload' });
    return;
  }
  const id = Number(req.params.id);
  const now = new Date().toISOString();
  const fields: string[] = ['updated_at = ?'];
  const values: unknown[] = [now];
  if (parsed.data.name !== undefined) {
    fields.push('name = ?');
    values.push(parsed.data.name);
  }
  if (parsed.data.is_active !== undefined) {
    fields.push('is_active = ?');
    values.push(parsed.data.is_active ? 1 : 0);
  }
  values.push(id);
  runQuery(`UPDATE item_master SET ${fields.join(', ')} WHERE id = ?`, values);
  const item = getOne('SELECT * FROM item_master WHERE id = ?', [id]);
  res.json(item);
});

router.delete('/:id', requireRole('admin', 'asset_manager'), (req, res) => {
  const id = Number(req.params.id);
  runQuery('UPDATE item_master SET is_active = 0, updated_at = ? WHERE id = ?', [new Date().toISOString(), id]);
  res.json({ ok: true });
});

export default router;
