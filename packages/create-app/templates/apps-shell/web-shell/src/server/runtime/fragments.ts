import fragmentsIndex from "@generated/pactor/fragments.json";

import type { FragmentsIndexFile } from "@/modules/types";
import type { ShellUser } from "@/server/auth/session";

const fragments = fragmentsIndex as FragmentsIndexFile;

export function getRuntimeFragmentDsl(
  fragmentId: string,
  _user: ShellUser | null,
): unknown | null {
  return fragments.fragments[fragmentId] ?? null;
}
