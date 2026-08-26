import type { ReactNode } from 'react';

export interface PageProps {
  /** 页面标题，可选 */
  title?: string;
  children?: ReactNode;
}

/** Page 容器（shadcn kit）：可选标题 + 内容区（纵向节奏 space-y-5） */
export function Page({ title, children }: PageProps) {
  return (
    <div data-slot="page" className="p-6">
      {title ? (
        <h2 data-slot="page-title" className="mb-5 text-xl font-semibold">
          {title}
        </h2>
      ) : null}
      <div data-slot="page-content" className="space-y-5">
        {children}
      </div>
    </div>
  );
}
