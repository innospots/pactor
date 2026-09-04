import type { DslSourceRef } from '@pactor-app/core';
import { useEffect, useState, type ReactNode } from 'react';

import type { RuntimeContext } from '../context/context.js';
import { dslSourceKey } from '../datasource/dsl-source-resolver.js';

/** DslSourceBoundary 内部状态机 */
type BoundaryState =
  | { status: 'loading' }
  | { status: 'ready'; content: unknown }
  | { status: 'error' };

export interface DslSourceBoundaryProps {
  context: RuntimeContext;
  sourceRef: DslSourceRef;
  /** 解析中渲染的内容（调用方预渲染 placeholder 子树；缺省为空） */
  placeholder?: ReactNode;
  /** 渲染解析结果（调用方负责形态校验与降级） */
  children: (content: unknown) => ReactNode;
}

/**
 * 动态 DSL 引用渲染边界（spec: dsl-renderer，renderer 内部组件，
 * 非 DSL 组件类型）：解析中渲染 placeholder（缺省空）、成功交给
 * 调用方渲染、失败告警并渲染空——MUST NOT 抛错击穿渲染层。
 * 解析经 `context.dslSources`（Promise 级缓存去重）。
 */
export function DslSourceBoundary({
  context,
  sourceRef,
  placeholder,
  children,
}: DslSourceBoundaryProps) {
  const [state, setState] = useState<BoundaryState>({ status: 'loading' });
  const key = dslSourceKey(sourceRef);

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    context.dslSources.resolve(sourceRef).then(
      (content) => {
        if (!cancelled) {
          setState({ status: 'ready', content });
        }
      },
      (cause) => {
        if (!cancelled) {
          console.warn('[@pactor-app/runtime] DSL 动态引用解析失败', cause);
          setState({ status: 'error' });
        }
      },
    );
    return () => {
      cancelled = true;
    };
    // sourceRef 为 DSL 静态配置对象，以序列化 key 判等
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, key]);

  if (state.status === 'ready') {
    return <>{children(state.content)}</>;
  }
  if (state.status === 'error') {
    return null;
  }
  return <>{placeholder ?? null}</>;
}
