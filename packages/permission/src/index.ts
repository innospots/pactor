export { PermissionStore } from './store.js';
export type { PermissionListener } from './store.js';

export {
  resolvePermissionCheck,
  resolvePermissionCodes,
} from './resolve.js';
export type {
  PermissionChecker,
  ResolvedPermission,
} from './resolve.js';

export { createPermissionAdapter } from './adapter.js';

export {
  checkPagePermission,
  filterMenusByPermission,
} from './guards.js';
export type { MenuItemWithPermission } from './guards.js';

export { createPermissionFunction } from './expression.js';
