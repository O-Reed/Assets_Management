import { z } from 'zod';
import { STATUS_OPTIONS, OWNERSHIP_TYPES } from './constants';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const assetSchema = z.object({
  item_master_id: z.number({ required_error: 'Select an item', invalid_type_error: 'Select an item' }).int().positive('Select an item'),
  category: z.string(),
  specification: z.string(),
  quantity: z.number().int().min(1, 'At least 1'),
  price: z.number().min(0, 'Price must be positive'),
  status: z.enum(STATUS_OPTIONS),
  ownership_type: z.enum(OWNERSHIP_TYPES),
  owner_user_id: z.number().int().positive().nullable(),
  receiver_user_name: z.string(),
  registration_date: z.string(),
  notes: z.string(),
});
export type AssetValues = z.infer<typeof assetSchema>;

export const itemMasterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
});
export type ItemMasterValues = z.infer<typeof itemMasterSchema>;
