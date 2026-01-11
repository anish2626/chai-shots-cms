import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ('admin' | 'editor' | 'viewer')[]) =>
  SetMetadata(ROLES_KEY, roles);
