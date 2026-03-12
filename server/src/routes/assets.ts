import { Router } from 'express';
import { z } from 'zod';
import { getOne, getAll, runQuery, runInsert } from '../db.js';
import { requireAuth, type AuthRequest } from '../middleware.js';
import type { AssetRow } from '../types.js';

const router = Router();

router.use(requireAuth);

router.get('/stats', (_req, res) => {
  const total = getOne('SELECT COUNT(*) as c FROM assets') as { c: number };
  const assigned = getOne("SELECT COUNT(*) as c FROM assets WHERE ownership_type='personal'") as { c: number };
  const inRepair = getOne("SELECT COUNT(*) as c FROM assets WHERE status='Under Repair'") as { c: number };
  const totalValue = getOne('SELECT COALESCE(SUM(price),0) as v FROM assets') as { v: number };
  const byStatus = getAll('SELECT status, COUNT(*) as count FROM assets GROUP BY status');
  const byCategory = getAll('SELECT category, COUNT(*) as count FROM assets GROUP BY category ORDER BY count DESC');
  res.json({
    total: total.c,
    assigned: assigned.c,
    inRepair: inRepair.c,
    totalValue: totalValue.v,
    byStatus,
    byCategory,
  });
});

router.get('/', (req, res) => {
  const {
    search, status, ownershipType, category, ownerId,
    sortBy = 'id', sortOrder = 'desc',
    page = '1', limit = '20',
  } = req.query as Record<string, string>;

  let where = '';
  const params: unknown[] = [];

  const conditions: string[] = [];
  if (search) {
    conditions.push('(a.item_name_snapshot LIKE ? OR a.specification LIKE ? OR a.notes LIKE ? OR a.receiver_user_name LIKE ?)');
    const s = `%${search}%`;
    params.push(s, s, s, s);
  }
  if (status) { conditions.push('a.status = ?'); params.push(status); }
  if (ownershipType) { conditions.push('a.ownership_type = ?'); params.push(ownershipType); }
  if (category) { conditions.push('a.category = ?'); params.push(category); }
  if (ownerId) { conditions.push('a.owner_user_id = ?'); params.push(Number(ownerId)); }

  if (conditions.length) where = `WHERE ${conditions.join(' AND ')}`;

  const allowedSort = ['id', 'item_name_snapshot', 'category', 'quantity', 'price', 'status', 'registration_date', 'created_at'];
  const col = allowedSort.includes(sortBy) ? sortBy : 'id';
  const dir = sortOrder === 'asc' ? 'ASC' : 'DESC';
  const lim = Math.min(Number(limit) || 20, 100);
  const offset = (Math.max(Number(page) || 1, 1) - 1) * lim;

  const countRow = getOne(`SELECT COUNT(*) as c FROM assets a ${where}`, params) as { c: number };

  const countParams = [...params];
  const rows = getAll(
    `SELECT a.*, u.name as owner_name FROM assets a LEFT JOIN users u ON a.owner_user_id = u.id ${where} ORDER BY a.${col} ${dir} LIMIT ? OFFSET ?`,
    [...countParams, lim, offset],
  );

  res.json({ data: rows, total: countRow.c, page: Number(page) || 1, limit: lim });
});

router.get('/:id', (req, res) => {
  const row = getOne(
    'SELECT a.*, u.name as owner_name FROM assets a LEFT JOIN users u ON a.owner_user_id = u.id WHERE a.id = ?',
    [Number(req.params.id)],
  );
  if (!row) { res.status(404).json({ error: 'Asset not found' }); return; }
  res.json(row);
});

const assetSchema = z.object({
  item_master_id: z.number().int().positive(),
  category: z.string().default(''),
  specification: z.string().default(''),
  quantity: z.number().int().min(1).default(1),
  price: z.number().min(0).default(0),
  status: z.enum(['In Use', 'Stored', 'Under Repair', 'Broken', 'Lost', 'Disposed']).default('In Use'),
  ownership_type: z.enum(['personal', 'team']).default('team'),
  owner_user_id: z.number().int().positive().nullable().default(null),
  receiver_user_name: z.string().default(''),
  registration_date: z.string().default(''),
  notes: z.string().default(''),
});

function canModifyAsset(req: AuthRequest, asset?: Record<string, unknown>): boolean {
  if (!req.user) return false;
  const { role, userId } = req.user;
  if (role === 'admin' || role === 'asset_manager') return true;
  if (!asset) return true;
  return asset.ownership_type === 'personal' && asset.created_by_user_id === userId;
}

router.post('/', (req: AuthRequest, res) => {
  const parsed = assetSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() }); return; }

  const item = getOne('SELECT name FROM item_master WHERE id = ? AND is_active = 1', [parsed.data.item_master_id]) as { name: string } | undefined;
  if (!item) { res.status(400).json({ error: 'Invalid item_master_id' }); return; }

  if (req.user!.role === 'team_member' && parsed.data.ownership_type !== 'personal') {
    res.status(403).json({ error: 'Team members can only add personal assets' });
    return;
  }

  const now = new Date().toISOString();
  const d = parsed.data;
  const id = runInsert(
    `INSERT INTO assets (item_master_id, item_name_snapshot, category, specification, quantity, price, status,
      ownership_type, owner_user_id, receiver_user_name, registration_date, notes, created_by_user_id, created_at, updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [d.item_master_id, item.name, d.category, d.specification, d.quantity, d.price, d.status,
      d.ownership_type, d.owner_user_id, d.receiver_user_name, d.registration_date || now.slice(0, 10), d.notes,
      req.user!.userId, now, now],
  );
  res.status(201).json({ id });
});

router.patch('/:id', (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const existing = getOne('SELECT * FROM assets WHERE id = ?', [id]);
  if (!existing) { res.status(404).json({ error: 'Asset not found' }); return; }
  if (!canModifyAsset(req, existing)) { res.status(403).json({ error: 'Insufficient permissions' }); return; }

  const parsed = assetSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() }); return; }

  const now = new Date().toISOString();
  const fields: string[] = ['updated_at = ?'];
  const values: unknown[] = [now];

  for (const [key, val] of Object.entries(parsed.data)) {
    if (val !== undefined) {
      if (key === 'item_master_id') {
        const item = getOne('SELECT name FROM item_master WHERE id = ? AND is_active = 1', [val as number]) as { name: string } | undefined;
        if (!item) { res.status(400).json({ error: 'Invalid item_master_id' }); return; }
        fields.push('item_master_id = ?', 'item_name_snapshot = ?');
        values.push(val, item.name);
      } else {
        fields.push(`${key} = ?`);
        values.push(val);
      }
    }
  }
  values.push(id);
  runQuery(`UPDATE assets SET ${fields.join(', ')} WHERE id = ?`, values);
  const updated = getOne('SELECT a.*, u.name as owner_name FROM assets a LEFT JOIN users u ON a.owner_user_id = u.id WHERE a.id = ?', [id]);
  res.json(updated);
});

router.delete('/:id', (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const existing = getOne('SELECT * FROM assets WHERE id = ?', [id]) as AssetRow | undefined;
  if (!existing) { res.status(404).json({ error: 'Asset not found' }); return; }
  if (!canModifyAsset(req, existing as unknown as Record<string, unknown>)) { res.status(403).json({ error: 'Insufficient permissions' }); return; }
  runQuery('DELETE FROM assets WHERE id = ?', [id]);
  res.json({ ok: true });
});

export default router;
