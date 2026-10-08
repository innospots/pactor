/**
 * DSL 预览容器：以真实 RuntimeContext + 内置注册表渲染 DSL 片段。
 * 用于依赖 Renderer 上下文的容器/弹层类组件（Tabs/Accordion/Resizable/
 * Carousel/Dialog/Popover/Form/Table/DataTable/Layout 等）的运行态预览——
 * 预览即真实 DSL 渲染，与业务页面同一代码路径。
 */
import { useMemo, type ComponentType, type ReactElement } from 'react';
import type { DslNode } from '@pactor-app/core';
import {
  createRuntimeContext,
  DslRenderer,
  registerBuiltinActions,
} from '@pactor-app/runtime';
import { createComponentRegistry } from '@pactor-app/ui/components';
import { previewExtraComponents } from './preview-extras';

export default function DslPreview({
  node,
  state,
  extraComponents,
}: {
  node: DslNode;
  /** 初始 state（受控组件演示：表达式 ${state.x} 绑定 + setState 回写） */
  state?: Record<string, unknown>;
  /** 额外注册的组件（线框模板预览：SitemapMenu 等项目级组件） */
  extraComponents?: Record<string, ComponentType<never>>;
}): ReactElement {
  const context = useMemo(() => {
    const ctx = createRuntimeContext({ components: createComponentRegistry(), state });
    for (const [name, comp] of Object.entries(extraComponents ?? {})) {
      ctx.components.register(name, comp);
    }
    registerBuiltinActions(ctx.actions);
    return ctx;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <DslRenderer context={context} node={node} />;
}
