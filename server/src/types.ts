export type Role = 'admin' | 'asset_manager' | 'team_member';

export interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface ItemMasterRow {
  id: number;
  name: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface AssetRow {
  id: number;
  item_master_id: number;
  item_name_snapshot: string;
  category: string;
  specification: string;
  quantity: number;
  price: number;
  status: string;
  ownership_type: 'personal' | 'team';
  owner_user_id: number | null;
  receiver_user_name: string;
  registration_date: string;
  notes: string;
  created_by_user_id: number;
  created_at: string;
  updated_at: string;
}

export interface JwtPayload {
  userId: number;
  role: Role;
}
