import type { DslNode } from '@pactor-app/core';
import { useRenderer } from '@pactor-app/runtime';
import { Fragment, type CSSProperties } from 'react';

import {
  Panel,
  PanelGroup,
  ResizableHandle,
} from '../../../ui/resizable.js';

/** 可拖拽面板；`children` 为 DSL 子树，经 renderChildren 渲染 */
export interface ResizablePanelData {
  children?: DslNode[];
  /** 默认尺寸（百分比，0-100） */
  defaultSize?: number;
  /** 默认尺寸（像素；与 defaultSize 同时提供时优先生效） */
  defaultSizePx?: number;
  /** 最小尺寸（像素） */
  minSizePx?: number;
  /** 最大尺寸（像素） */
  maxSizePx?: number;
}

export interface ResizableProps {
  /** 面板列表（相邻面板间渲染拖拽手柄） */
  panels?: ResizablePanelData[];
  /** 排列方向（缺省 horizontal） */
  direction?: 'horizontal' | 'vertical';
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * Resizable 适配器（shadcn kit）：基于 vendored Resizable
 * （react-resizable-panels）；panels 声明面板，相邻面板间为可拖拽手柄；
 * DSL 的 defaultSize 统一按百分比解释，defaultSizePx/minSizePx/maxSizePx
 * 按像素解释（像素优先级高于百分比）。
 */
export function Resizable({
  panels = [],
  direction = 'horizontal',
  className,
  style,
}: ResizableProps) {
  const { renderChildren } = useRenderer();
  return (
    <PanelGroup orientation={direction} className={className} style={style}>
      {panels.map((panel, index) => (
        <Fragment key={index}>
          {index > 0 ? <ResizableHandle withHandle /> : null}
          <Panel
            defaultSize={
              typeof panel.defaultSizePx === 'number'
                ? `${panel.defaultSizePx}px`
                : typeof panel.defaultSize === 'number'
                  ? `${panel.defaultSize}%`
                  : undefined
            }
            minSize={
              typeof panel.minSizePx === 'number'
                ? `${panel.minSizePx}px`
                : undefined
            }
            maxSize={
              typeof panel.maxSizePx === 'number'
                ? `${panel.maxSizePx}px`
                : undefined
            }
          >
            {renderChildren(panel.children)}
          </Panel>
        </Fragment>
      ))}
    </PanelGroup>
  );
}
