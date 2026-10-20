import type { DslSourceRef } from '@pactor-app/core';
import { isDslFragmentPayload } from '@pactor-app/core';
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
 *
 * 解析结果为片段载荷（DslFragmentPayload）时，在 effect 中应用副作用
 * （MUST NOT 在 render 期注册——注册会推高 DataStore 版本引发重渲染循环）：
 * `state` 合并进页面 state、`dataSources` 运行时注册（冲突名跳过），
 * 随后触发其中 `autoLoad: true` 的数据源加载；卸载时注销本边界注册的
 * 数据源名。裸数组形态无任何副作用。
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
    /** 本边界注册成功的数据源名（卸载时注销；冲突跳过的不在其中） */
    let registeredSources: string[] = [];
    setState({ status: 'loading' });
    context.dslSources.resolve(sourceRef).then(
      (content) => {
        if (cancelled) {
          return;
        }
        if (isDslFragmentPayload(content)) {
          // 先合并 state，片段数据源的 ${state.*} 表达式加载时按合并后作用域求值
          if (content.state) {
            context.state.set(content.state);
          }
          if (content.dataSources) {
            registeredSources = context.data.registerAll(content.dataSources);
            // init 已于页面级执行，片段中 autoLoad 源由边界补触发
            for (const name of registeredSources) {
              if (content.dataSources[name]?.autoLoad === true) {
                context.data.load(name).catch((cause: unknown) => {
                  console.warn(
                    `[@pactor-app/runtime] 片段数据源 "${name}" 加载失败`,
                    cause,
                  );
                });
              }
            }
          }
        }
        setState({ status: 'ready', content });
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
      for (const name of registeredSources) {
        context.data.unregister(name);
      }
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
