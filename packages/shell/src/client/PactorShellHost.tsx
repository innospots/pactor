import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';

import { createHttpHooks, SitemapApp } from 'pactor-app';
import type { PactorHttpHooks } from 'pactor-app';
import type { ActionHandler } from '@pactor-app/runtime';

import {
  mergeModuleActions,
  mergeModuleComponents,
  type ModuleExtensionBundle,
} from './register-extensions.js';
import { SkinSwitcher } from './SkinSwitcher.js';

export interface PactorShellHostProps {
  /** 装配生成的模块扩展注册表（宿主从 @generated/pactor/client-registry 导入 moduleExtensions） */
  extensions: Record<string, ModuleExtensionBundle>;
  /** sitemap 源，缺省 /api/runtime/bootstrap */
  sitemapSource?: string;
  /** 懒加载页面端点，缺省 /api/runtime/pages/{globalPageId}（encodeURIComponent 编码） */
  pageEndpoint?: (pageId: string) => string;
  /** HTTP 钩子覆盖；缺省 createHttpHooks()（拆 { code, data, message } 包裹协议） */
  httpAdapter?: PactorHttpHooks;
  /** 追加宿主自定义组件（在模块组件之后合并，同名宿主优先） */
  components?: Record<string, unknown>;
  /** 追加宿主自定义动作（在模块动作之后合并，同名宿主优先） */
  actions?: Record<string, ActionHandler>;
  /** 是否向 DSL 注册 SkinSwitcher 组件（布局 YAML 可以 type: SkinSwitcher 引用），缺省 true */
  skinSwitcher?: boolean;
}

/** 模块级缺省实例：引用稳定，避免 SitemapApp 页面工厂随渲染重建 */
const defaultHttpAdapter = createHttpHooks();
const defaultPageEndpoint = (pageId: string) =>
  `/api/runtime/pages/${encodeURIComponent(pageId)}`;

function PactorShellHostInner(props: PactorShellHostProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const components = useMemo(
    () => ({
      ...(props.skinSwitcher === false ? {} : { SkinSwitcher }),
      ...mergeModuleComponents(props.extensions),
      ...props.components,
    }),
    [props.extensions, props.components, props.skinSwitcher],
  );
  const actions = useMemo(
    () => ({ ...mergeModuleActions(props.extensions), ...props.actions }),
    [props.extensions, props.actions],
  );

  return (
    <SitemapApp
      sources={[props.sitemapSource ?? '/api/runtime/bootstrap']}
      baseUrl=""
      pathname={pathname}
      query={Object.fromEntries(searchParams.entries())}
      navigate={(to: string) => {
        router.push(to);
      }}
      components={components}
      actions={actions}
      httpAdapter={props.httpAdapter ?? defaultHttpAdapter}
      pageEndpoint={props.pageEndpoint ?? defaultPageEndpoint}
    />
  );
}

export function PactorShellHost(props: PactorShellHostProps) {
  return (
    <Suspense fallback={null}>
      <PactorShellHostInner {...props} />
    </Suspense>
  );
}
