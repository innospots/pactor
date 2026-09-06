import { useI18n } from '@pactor-app/runtime';
import type { CSSProperties } from 'react';

import {
  Command as ShadcnCommand,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../../ui/command.js';
import { Icon } from '../Icon/index.js';

/** Command 命令项 */
export interface CommandItemData {
  label: string;
  value: string;
  /** 图标名（Icon 白名单，kebab/Pascal 均可），渲染于文字前 */
  icon?: string;
  disabled?: boolean;
}

/** Command 分组 */
export interface CommandGroupData {
  heading?: string;
  items: CommandItemData[];
}

export interface CommandProps {
  /** 分组列表 */
  groups?: CommandGroupData[];
  /** 搜索框占位文本 */
  placeholder?: string;
  /** 空结果文案（缺省取 i18n `pactor.command.empty`） */
  emptyText?: string;
  /** 选中事件，传出选中项 value */
  onSelect?: (value: string) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * Command 适配器（shadcn kit）：基于 vendored Command（cmdk）；
 * 支持搜索过滤（按 value 与 label 匹配）；onSelect 传出选中项 value
 * （DSL 语义值）。
 */
export function Command({
  groups = [],
  placeholder,
  emptyText,
  onSelect,
  className,
  style,
}: CommandProps) {
  const { t } = useI18n();
  return (
    <ShadcnCommand className={className} style={style}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>{emptyText ?? t('pactor.command.empty')}</CommandEmpty>
        {groups.map((group, index) => (
          <CommandGroup key={group.heading ?? index} heading={group.heading}>
            {group.items.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                keywords={[item.label]}
                disabled={item.disabled}
                onSelect={(value) => onSelect?.(value)}
              >
                {item.icon ? <Icon name={item.icon} size="sm" /> : null}
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </ShadcnCommand>
  );
}
