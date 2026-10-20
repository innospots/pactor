import { Icon } from '@pactor-app/ui/components';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
} from '@pactor-app/ui/ui';
import { useMemo, useState } from 'react';

import { cn } from '../../lib/utils.js';

/** 工作空间选项 */
export interface WorkspaceOption {
  label: string;
  value: string;
}

export interface WorkspaceSwitcherProps {
  /** 受控选中值（'' 表示未选择）：DSL 闭环 value ↔ events.onChange */
  value?: string;
  /** 候选工作空间（初始列表；新建项由组件内部追加） */
  options?: WorkspaceOption[];
  /** 未选择时的触发文案，缺省「选择工作空间」 */
  placeholder?: string;
  /** 选择 / 清除 / 新建后回调，传出最新选中值（清除传 ''） */
  onChange?: (value: string) => void;
  /** 新建工作空间回调：弹框创建成功后传出名称（随后经 onChange 选中） */
  onCreate?: (name: string) => void;
  /** 通用：挂到触发按钮的 class（与内置样式合并） */
  className?: string;
}

const itemClass =
  'flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';

/**
 * 工作空间切换器（Chat 展示组件，常用于 ChatPage 的 Composer footer）：
 * 触发按钮 + 自定义下拉弹层（搜索框 / 工作空间列表（max-h 390px）/
 * 「新建工作空间」入口），已选时出现「不使用工作空间」清除项；新建经
 * Dialog 弹框输入名称，创建即选中。受控 value + onChange 闭环，新建项
 * 在组件内部追加，并另经 onCreate 上报新名称（供宿主持久化）。
 */
export function WorkspaceSwitcher({
  value = '',
  options = [],
  placeholder = '选择工作空间',
  onChange,
  onCreate,
  className,
}: WorkspaceSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  // 新建的空间追加在内部（props options 为初始列表，不可变）
  const [created, setCreated] = useState<WorkspaceOption[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');

  const all = useMemo(() => [...options, ...created], [options, created]);
  const filtered = keyword
    ? all.filter((item) => item.label.includes(keyword))
    : all;

  const select = (next: string): void => {
    onChange?.(next);
    setOpen(false);
    setKeyword('');
  };

  const createWorkspace = (): void => {
    const name = newName.trim();
    if (!name) {
      return;
    }
    if (!all.some((item) => item.value === name)) {
      setCreated((prev) => [...prev, { label: name, value: name }]);
      // 仅真正新建时上报（同名项存在时视为选择已有项）
      onCreate?.(name);
    }
    setNewName('');
    setCreateOpen(false);
    select(name);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={className}
              data-slot="workspace-switcher-trigger"
            />
          }
        >
          <Icon name="folder" />
          <span className="max-w-56 truncate">{value || placeholder}</span>
          <Icon name="chevron-down" />
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="start"
          className="w-[280px] p-2"
          data-slot="workspace-switcher-popover"
        >
          {/* 1. 带图标的搜索输入框 */}
          <InputGroup className="h-8 gap-0 border-0 bg-muted shadow-none focus-within:border-transparent focus-within:ring-0">
            <InputGroupAddon className="px-2">
              <Icon name="search" size="sm" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="搜索工作空间"
              className="h-8 px-2 text-[13px] md:text-[13px]"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </InputGroup>

          {/* 2. 工作空间列表（max-h 390px，超出滚动） */}
          <div className="mt-1 max-h-[390px] overflow-y-auto py-0.5">
            {filtered.length === 0 ? (
              <div className="py-4 text-center text-[13px] text-muted-foreground">
                无匹配的工作空间
              </div>
            ) : (
              filtered.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={cn(itemClass, 'mb-1')}
                  onClick={() => select(item.value)}
                >
                  <Icon name="folder" />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {item.value === value ? (
                    <Icon name="check" size="sm" className="shrink-0" />
                  ) : null}
                </button>
              ))
            )}
          </div>

          <Separator className="my-1" />

          {/* 3. 新建工作空间（弹框输入名称） */}
          <button
            type="button"
            className={itemClass}
            onClick={() => {
              setOpen(false);
              setCreateOpen(true);
            }}
          >
            <Icon name="plus" />
            <span>新建工作空间</span>
          </button>

          {/* 已选时提供「不使用工作空间」清除项 */}
          {value ? (
            <button
              type="button"
              className={cn(itemClass, 'mt-1 text-muted-foreground')}
              onClick={() => select('')}
            >
              <Icon name="x-circle" />
              <span>不使用工作空间</span>
            </button>
          ) : null}
        </PopoverContent>
      </Popover>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建工作空间</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="请输入工作空间名称"
            value={newName}
            autoFocus
            onChange={(event) => setNewName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                createWorkspace();
              }
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              取消
            </Button>
            <Button onClick={createWorkspace} disabled={!newName.trim()}>
              创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
