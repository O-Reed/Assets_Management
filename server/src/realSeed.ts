import bcrypt from 'bcryptjs';
import fs from 'fs';
import type { Database } from 'sql.js';

type AssetStatus = 'In Use' | 'Stored' | 'Under Repair' | 'Broken' | 'Lost' | 'Disposed';
type OwnershipType = 'personal' | 'team';

interface CsvRow {
  owner: string;
  item: string;
  rawType: string;
  specification: string;
  quantity: number;
  rawStatus: string;
  receiver: string;
  registrationDate: string;
  notes: string;
}

interface NormalizedItem {
  itemName: string;
  category: string;
}

interface ParsedComponent {
  rawLabel: string;
  quantity: number;
}

interface AssetSeedRow {
  assignee: string;
  itemName: string;
  category: string;
  specification: string;
  quantity: number;
  status: AssetStatus;
  ownershipType: OwnershipType;
  ownerUserName: string | null;
  receiverName: string;
  registrationDate: string;
  notes: string;
  createdByName: string;
}

const DEFAULT_PASSWORD = 'password123';
const DEFAULT_CSV_PATH =
  process.env.REAL_ASSET_CSV_PATH ??
  'c:/Users/antho/OneDrive/Documentos/Fixed Assets - 03_08_2026.csv';

const TEAM_POOLS = new Set(['', 'Rest', 'boss']);

const ITEM_MAP: Record<string, NormalizedItem> = {
  액정화면: { itemName: 'Monitor', category: 'Displays' },
  노트형콤퓨터: { itemName: 'Laptop', category: 'Computing' },
  Macbook: { itemName: 'Laptop', category: 'Computing' },
  'Macbook Air': { itemName: 'Laptop', category: 'Computing' },
  콤퓨터본체: { itemName: 'Desktop Computer', category: 'Computing' },
  '탁상형콤퓨터(본체)': { itemName: 'Desktop Computer', category: 'Computing' },
  봉사기: { itemName: 'Server', category: 'Computing' },
  판형콤퓨터: { itemName: 'Tablet', category: 'Mobile' },
  손전화기: { itemName: 'Mobile Phone', category: 'Mobile' },
  건반: { itemName: 'Keyboard', category: 'Peripherals' },
  마우스: { itemName: 'Mouse', category: 'Peripherals' },
  카메라: { itemName: 'Camera', category: 'Peripherals' },
  Web카메라: { itemName: 'Webcam', category: 'Peripherals' },
  레시바: { itemName: 'Wireless Receiver', category: 'Peripherals' },
  'USB-C 하부': { itemName: 'USB-C Hub', category: 'Peripherals' },
  노트콤받치개: { itemName: 'Laptop Stand', category: 'Peripherals' },
  화면설치대: { itemName: 'Monitor Stand', category: 'Displays' },
  배경막: { itemName: 'Backdrop', category: 'AV Equipment' },
  TV: { itemName: 'Television', category: 'AV Equipment' },
  TV설치틀: { itemName: 'TV Mount', category: 'AV Equipment' },
  Router: { itemName: 'Router', category: 'Networking' },
  WiFi: { itemName: 'WiFi Access Point', category: 'Networking' },
  Yota: { itemName: 'Mobile Hotspot', category: 'Networking' },
  'POE Hub': { itemName: 'PoE Switch', category: 'Networking' },
  'USB Ethernet Adapter': { itemName: 'USB Ethernet Adapter', category: 'Networking' },
  UPS: { itemName: 'UPS', category: 'Power' },
  'HDMI-HDMI 변환선': { itemName: 'HDMI Cable', category: 'Cables & Adapters' },
  'HDMI-HDMI선': { itemName: 'HDMI Cable', category: 'Cables & Adapters' },
  'VGA-VGA 변환선': { itemName: 'VGA Cable', category: 'Cables & Adapters' },
  'VGA-VGA선': { itemName: 'VGA Cable', category: 'Cables & Adapters' },
  'HDMI-VGA 변환선': { itemName: 'HDMI to VGA Adapter', category: 'Cables & Adapters' },
  'USBC-HDMI 변환선': { itemName: 'USB-C to HDMI Adapter', category: 'Cables & Adapters' },
  'USB-C': { itemName: 'USB-C to HDMI Adapter', category: 'Cables & Adapters' },
  'VGA-DP선': { itemName: 'VGA to DisplayPort Adapter', category: 'Cables & Adapters' },
  'VGA-DP 변환선': { itemName: 'VGA to DisplayPort Adapter', category: 'Cables & Adapters' },
  'VGA-DPI 변환선': { itemName: 'VGA to DisplayPort Adapter', category: 'Cables & Adapters' },
  'VGA-HDMI 변환선': { itemName: 'VGA to HDMI Adapter', category: 'Cables & Adapters' },
  인쇄기: { itemName: 'Printer', category: 'Office Equipment' },
  인쇄기모선: { itemName: 'Printer Cable', category: 'Cables & Adapters' },
  록상기: { itemName: 'Copier', category: 'Office Equipment' },
  금고: { itemName: 'Safe', category: 'Office Equipment' },
  종이소각기: { itemName: 'Paper Shredder', category: 'Office Equipment' },
  칠판: { itemName: 'Whiteboard', category: 'Office Equipment' },
  시계: { itemName: 'Clock', category: 'Office Equipment' },
  오물통: { itemName: 'Trash Bin', category: 'Office Equipment' },
  저울: { itemName: 'Scale', category: 'Office Equipment' },
  사무용사물함: { itemName: 'Storage Cabinet', category: 'Furniture' },
  사물장: { itemName: 'Storage Cabinet', category: 'Furniture' },
  책상: { itemName: 'Desk', category: 'Furniture' },
  사무의자: { itemName: 'Office Chair', category: 'Furniture' },
  '바퀴달린 의자': { itemName: 'Rolling Chair', category: 'Furniture' },
  의자: { itemName: 'Chair', category: 'Furniture' },
  물정수기: { itemName: 'Water Purifier', category: 'Appliances' },
  리발기: { itemName: 'Hair Clipper', category: 'Appliances' },
  충전접속구: { itemName: 'Charging Adapter', category: 'Power' },
  충전모선: { itemName: 'Charging Cable', category: 'Cables & Adapters' },
};

function normalizeInline(value: string): string {
  return value.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
}

function normalizeMultiline(value: string): string {
  return value.replace(/\r\n/g, '\n').replace(/\n+/g, ' / ').replace(/\s+/g, ' ').trim();
}

function parseCsv(text: string): CsvRow[] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        currentCell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = '';
      continue;
    }

    currentCell += char;
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  if (rows.length === 0) return [];

  const [header, ...dataRows] = rows;
  const headerIndex = new Map(header.map((cell, index) => [normalizeInline(cell), index]));

  return dataRows
    .filter((row) => row.some((cell) => normalizeInline(cell) !== ''))
    .map((row) => ({
      owner: normalizeInline(row[headerIndex.get('관리자') ?? -1] ?? ''),
      item: normalizeInline(row[headerIndex.get('품명') ?? -1] ?? ''),
      rawType: normalizeInline(row[headerIndex.get('종류') ?? -1] ?? ''),
      specification: normalizeMultiline(row[headerIndex.get('규격') ?? -1] ?? ''),
      quantity: Number.parseInt(normalizeInline(row[headerIndex.get('수량') ?? -1] ?? '1'), 10) || 1,
      rawStatus: normalizeInline(row[headerIndex.get('상태') ?? -1] ?? ''),
      receiver: normalizeInline(row[headerIndex.get('접수자') ?? -1] ?? ''),
      registrationDate: normalizeInline(row[headerIndex.get('등록날자') ?? -1] ?? ''),
      notes: normalizeMultiline(row[headerIndex.get('비고') ?? -1] ?? ''),
    }));
}

function parseDate(rawDate: string): string {
  const value = normalizeInline(rawDate);
  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return value;
  const [, month, day, year] = match;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function translateStatus(rawStatus: string, notes: string): AssetStatus {
  const status = `${rawStatus} ${notes}`;
  if (/페기/.test(status)) return 'Disposed';
  if (/보관/.test(status)) return 'Stored';
  if (/고장/.test(status) && !/리용중/.test(rawStatus)) return 'Broken';
  return 'In Use';
}

function parseItemComponents(rawItem: string): ParsedComponent[] {
  return rawItem
    .split(',')
    .map((part) => normalizeInline(part))
    .filter(Boolean)
    .map((part) => {
      const match = part.match(/^(.*?)(?:\s*\*\s*(\d+))?$/);
      const label = normalizeInline(match?.[1] ?? part);
      const quantity = Number.parseInt(match?.[2] ?? '1', 10) || 1;
      return { rawLabel: label, quantity };
    });
}

function splitSpecTokens(rawSpec: string): string[] {
  return rawSpec
    .split(',')
    .map((part) => normalizeInline(part))
    .filter(Boolean);
}

function isNamedUser(name: string | null): name is string {
  return typeof name === 'string' && name.length > 0 && !TEAM_POOLS.has(name);
}

function mapItem(rawLabel: string): NormalizedItem {
  return ITEM_MAP[rawLabel] ?? { itemName: rawLabel || 'Unclassified Asset', category: 'Other' };
}

function buildNotes(row: CsvRow, options?: { bundled?: boolean; originalItem?: string }): string {
  const parts: string[] = [];
  if (row.notes) parts.push(row.notes);
  if (row.rawType) parts.push(`Raw type: ${row.rawType}`);
  if (options?.bundled) parts.push(`Split from bundle: ${options.originalItem ?? row.item}`);
  return parts.join(' | ');
}

function normalizeRow(row: CsvRow): AssetSeedRow[] {
  const ownershipType: OwnershipType = TEAM_POOLS.has(row.owner) ? 'team' : 'personal';
  const ownerUserName = ownershipType === 'personal' ? row.owner : null;
  const receiverName = row.owner || row.receiver || 'Shared Inventory';
  const status = translateStatus(row.rawStatus, row.notes);
  const createdByName = row.receiver || '장원주';
  const registrationDate = parseDate(row.registrationDate);

  const baseRecord = {
    assignee: row.owner,
    ownershipType,
    ownerUserName,
    receiverName,
    status,
    registrationDate,
    createdByName,
  };

  const components = parseItemComponents(row.item);
  const isBundled = components.length > 1;

  if (!isBundled) {
    const mapped = mapItem(row.item);
    return [{
      ...baseRecord,
      itemName: mapped.itemName,
      category: mapped.category,
      specification: row.specification,
      quantity: row.quantity,
      notes: buildNotes(row),
    }];
  }

  const specTokens = splitSpecTokens(row.specification);
  const componentCount = components.length;
  const expandedCount = components.reduce((sum, component) => sum + component.quantity, 0);

  if (specTokens.length === expandedCount) {
    const records: AssetSeedRow[] = [];
    let specIndex = 0;

    for (const component of components) {
      const mapped = mapItem(component.rawLabel);
      for (let i = 0; i < component.quantity; i += 1) {
        records.push({
          ...baseRecord,
          itemName: mapped.itemName,
          category: mapped.category,
          specification: specTokens[specIndex] ?? '',
          quantity: row.quantity,
          notes: buildNotes(row, { bundled: true, originalItem: row.item }),
        });
        specIndex += 1;
      }
    }

    return records;
  }

  return components.map((component, index) => {
    const mapped = mapItem(component.rawLabel);
    const componentSpec = specTokens.length === componentCount ? (specTokens[index] ?? '') : row.specification;

    return {
      ...baseRecord,
      itemName: mapped.itemName,
      category: mapped.category,
      specification: componentSpec,
      quantity: component.quantity * row.quantity,
      notes: buildNotes(row, { bundled: true, originalItem: row.item }),
    };
  });
}

function insertUser(
  db: Database,
  params: {
    name: string;
    email: string;
    passwordHash: string;
    role: 'admin' | 'asset_manager' | 'team_member';
    now: string;
  },
): number {
  db.run(
    'INSERT INTO users (name, email, password_hash, role, is_active, created_at, updated_at) VALUES (?,?,?,?,1,?,?)',
    [params.name, params.email, params.passwordHash, params.role, params.now, params.now],
  );
  const result = db.exec('SELECT last_insert_rowid() AS id');
  return result[0].values[0][0] as number;
}

function insertItem(db: Database, name: string, now: string): number {
  db.run(
    'INSERT INTO item_master (name, is_active, created_at, updated_at) VALUES (?,1,?,?)',
    [name, now, now],
  );
  const result = db.exec('SELECT last_insert_rowid() AS id');
  return result[0].values[0][0] as number;
}

export function seedRealData(db: Database) {
  if (!fs.existsSync(DEFAULT_CSV_PATH)) {
    throw new Error(`Real asset CSV not found at ${DEFAULT_CSV_PATH}`);
  }

  const csvText = fs.readFileSync(DEFAULT_CSV_PATH, 'utf8');
  const rows = parseCsv(csvText);
  const normalizedAssets = rows.flatMap(normalizeRow);
  const now = new Date().toISOString();
  const passwordHash = bcrypt.hashSync(DEFAULT_PASSWORD, 10);

  const userNames = Array.from(
    new Set(
      normalizedAssets
        .flatMap((asset) => [asset.ownerUserName, asset.createdByName])
        .filter(isNamedUser),
    ),
  );

  const userIdByName = new Map<string, number>();

  const prioritizedUsers = ['장원주', '유 정'];
  for (const name of prioritizedUsers) {
    if (!userNames.includes(name)) userNames.unshift(name);
  }

  let teamMemberCounter = 1;
  for (const name of userNames) {
    let role: 'admin' | 'asset_manager' | 'team_member' = 'team_member';
    let email = `member${String(teamMemberCounter).padStart(3, '0')}@assets.local`;

    if (name === '장원주') {
      role = 'admin';
      email = 'admin@assets.local';
    } else if (name === '유 정') {
      role = 'asset_manager';
      email = 'manager@assets.local';
    } else {
      teamMemberCounter += 1;
    }

    const id = insertUser(db, { name, email, passwordHash, role, now });
    userIdByName.set(name, id);
  }

  const itemIdByName = new Map<string, number>();
  for (const itemName of Array.from(new Set(normalizedAssets.map((asset) => asset.itemName))).sort()) {
    itemIdByName.set(itemName, insertItem(db, itemName, now));
  }

  for (const asset of normalizedAssets) {
    const itemId = itemIdByName.get(asset.itemName);
    const createdByUserId = userIdByName.get(asset.createdByName) ?? userIdByName.get('장원주');
    if (!itemId || !createdByUserId) {
      throw new Error(`Failed to resolve foreign keys for ${asset.itemName}`);
    }

    db.run(
      `INSERT INTO assets (item_master_id, item_name_snapshot, category, specification, quantity, price, status,
        ownership_type, owner_user_id, receiver_user_name, registration_date, notes, created_by_user_id, created_at, updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        itemId,
        asset.itemName,
        asset.category,
        asset.specification,
        asset.quantity,
        0,
        asset.status,
        asset.ownershipType,
        asset.ownerUserName ? (userIdByName.get(asset.ownerUserName) ?? null) : null,
        asset.receiverName,
        asset.registrationDate,
        asset.notes,
        createdByUserId,
        now,
        now,
      ],
    );
  }
}
