declare module '*.page.yaml' {
  import type { PageDsl } from '@pactor-app/core';
  const page: PageDsl;
  export const dslVersion: string;
  export default page;
}

declare module '*.fragment.yaml' {
  import type { FragmentDsl } from '@pactor-app/core';
  const fragment: FragmentDsl;
  export const dslVersion: string;
  export default fragment;
}
