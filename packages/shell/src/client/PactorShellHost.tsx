import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useContext, useMemo } from 'react';

import { createHttpHooks, SitemapApp } from 'pactor-app';
import type { PactorHttpHooks } from 'pactor-app';
import { Login } from '@pactor-app/blocks';
import type { ActionHandler } from '@pactor-app/runtime';

import {
  mergeModuleActions,
  mergeModuleComponents,
  type ModuleExtensionBundle,
} from './register-extensions.js';
import { NavigationShell } from './NavigationShell.js';
import {
  ShellUserMenu,
  ShellUserMenuConfigContext,
  type ShellUserMenuConfig,
} from './ShellUserMenu.js';
import { SkinGallery } from './SkinGallery.js';
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
  /** 外壳内 DSL UserMenu 的默认配置（在线状态 / 主题 / 密度 / 语言缺省全开）；
   *  DSL 节点显式 props 优先；外层 AppShell 的 userMenu 配置会被本 prop 覆盖合并 */
  userMenu?: ShellUserMenuConfig;
}

/** 内建 DSL 组件：包默认站点的布局 / 页面依赖；宿主 components 同名覆盖优先。
 *  UserMenu 覆盖 UI kit 同名注册：叠加外壳默认配置与外观模式同步 */
const builtinComponents = { NavigationShell, SkinGallery, Login, UserMenu: ShellUserMenu };

/** 模块级缺省实例：引用稳定，避免 SitemapApp 页面工厂随渲染重建 */
const defaultHttpAdapter = createHttpHooks();
const defaultPageEndpoint = (pageId: string) =>
  `/api/runtime/pages/${encodeURIComponent(pageId)}`;

function PactorShellHostInner(props: PactorShellHostProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // 与外层（AppShell）配置合并：本 prop 字段优先
  const inheritedUserMenu = useContext(ShellUserMenuConfigContext);
  const userMenuConfig = useMemo(
    () => (props.userMenu ? { ...inheritedUserMenu, ...props.userMenu } : inheritedUserMenu),
    [inheritedUserMenu, props.userMenu],
  );

  const components = useMemo(
    () => ({
      ...builtinComponents,
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
    <ShellUserMenuConfigContext.Provider value={userMenuConfig}>
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
    </ShellUserMenuConfigContext.Provider>
  );
}

export function PactorShellHost(props: PactorShellHostProps) {
  return (
    <Suspense fallback={null}>
      <PactorShellHostInner {...props} />
    </Suspense>
  );
}
