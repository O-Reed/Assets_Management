export const STATUS_OPTIONS = [
  'In Use',
  'Stored',
  'Under Repair',
  'Broken',
  'Lost',
  'Disposed',
] as const;

export type AssetStatus = (typeof STATUS_OPTIONS)[number];

export const OWNERSHIP_TYPES = ['personal', 'team'] as const;
export type OwnershipType = (typeof OWNERSHIP_TYPES)[number];

export const ROLES = ['admin', 'asset_manager', 'team_member'] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrator',
  asset_manager: 'Asset Manager',
  team_member: 'Team Member',
};

export const STATUS_COLORS: Record<AssetStatus, { bg: string; text: string }> = {
  'In Use': { bg: 'bg-success-light dark:bg-success-dark/20', text: 'text-success dark:text-success' },
  'Stored': { bg: 'bg-info-light dark:bg-info-dark/20', text: 'text-info dark:text-info' },
  'Under Repair': { bg: 'bg-warning-light dark:bg-warning-dark/20', text: 'text-warning-dark dark:text-warning' },
  'Broken': { bg: 'bg-danger-light dark:bg-danger-dark/20', text: 'text-danger dark:text-danger' },
  'Lost': { bg: 'bg-gray-200 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300' },
  'Disposed': { bg: 'bg-gray-200 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400' },
};

export const API_BASE = '/api';
