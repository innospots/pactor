import { getFragmentsIndex, type ShellGeneratedOptions } from './registry.js';
import type { ShellUser } from './session.js';

export function getRuntimeFragmentDsl(
  fragmentId: string,
  _user: ShellUser | null,
  options?: ShellGeneratedOptions,
): unknown | null {
  return getFragmentsIndex(options).fragments[fragmentId] ?? null;
}
