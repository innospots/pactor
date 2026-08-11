import * as RadixTabs from '@radix-ui/react-tabs';
import type { TabsProps } from 'pactor-ui-antd/components';
import { useRenderer } from 'pactor-runtime';

/**
 * Tabs 容器（Radix kit，语义对齐 antd 版）：
 * 基于 @radix-ui/react-tabs，每个 pane 的内容经 renderChildren 渲染；
 * 未传 activeKey 时缺省激活第一个页签。
 */
export function Tabs({ items = [], activeKey, onChange }: TabsProps) {
  const { renderChildren } = useRenderer();
  return (
    <RadixTabs.Root
      className="pcr-tabs"
      value={activeKey}
      defaultValue={activeKey === undefined ? items[0]?.key : undefined}
      onValueChange={(key) => onChange?.(key)}
    >
      <RadixTabs.List className="pcr-tabs-list">
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.key}
            value={item.key}
            className="pcr-tabs-trigger"
          >
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map((item) => (
        <RadixTabs.Content
          key={item.key}
          value={item.key}
          className="pcr-tabs-content"
        >
          {renderChildren(item.children)}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}
