"use client";

import { Icon } from "@pactor-app/ui/components";
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
} from "@pactor-app/ui/ui";
import { useMemo, useState } from "react";

import "./workspace-switcher.css";

export interface WorkspaceOption {
  label: string;
  value: string;
}

export interface WorkspaceSwitcherProps {
  /** 受控选中值（'' 表示未选择）：DSL 闭环 value ↔ events.onChange */
  value?: string;
  /** 候选工作空间（DSL 声明的初始列表；新建项由组件内部追加） */
  options?: WorkspaceOption[];
  /** 选择 / 清除 / 新建后回调，传出最新选中值（清除传 ''） */
  onChange?: (value: string) => void;
}

/**
 * 工作空间切换器（chat 页 composerFooter 自定义组件，迁移自
 * CreditWeaveAI/chat）：触发按钮 + 自定义下拉弹层（搜索框 / 工作空间
 * 列表（max-h 390px）/「新建工作空间」入口），已选时出现「不使用工作
 * 空间」清除项；新建经 Dialog 弹框输入名称，创建即选中。
 * 样式在 workspace-switcher.css（.workspace-*），颜色走语义令牌。
 */
export function WorkspaceSwitcher({
  value = "",
  options = [],
  onChange,
}: WorkspaceSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  // 新建的空间追加在内部（DSL props 为初始列表，不可变）
  const [created, setCreated] = useState<WorkspaceOption[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const all = useMemo(() => [...options, ...created], [options, created]);
  const filtered = keyword
    ? all.filter((item) => item.label.includes(keyword))
    : all;

  const select = (next: string) => {
    onChange?.(next);
    setOpen(false);
    setKeyword("");
  };

  const createWorkspace = () => {
    const name = newName.trim();
    if (!name) {
      return;
    }
    if (!all.some((item) => item.value === name)) {
      setCreated((prev) => [...prev, { label: name, value: name }]);
    }
    setNewName("");
    setCreateOpen(false);
    select(name);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={<Button variant="ghost" size="sm" />}>
          <Icon name="folder" />
          <span>{value || "选择工作空间"}</span>
          <Icon name="chevron-down" />
        </PopoverTrigger>
        <PopoverContent side="top" align="start" className="workspace-popover">
          {/* 1. 带图标的搜索输入框 */}
          <InputGroup>
            <InputGroupAddon className="px-2">
              <Icon name="search" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="搜索工作空间"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </InputGroup>

          {/* 2. 工作空间列表（max-h 390px，超出滚动） */}
          <div className="workspace-list py-1">
            {filtered.length === 0 ? (
              <div className="workspace-empty">无匹配的工作空间</div>
            ) : (
              filtered.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className="workspace-item"
                  onClick={() => select(item.value)}
                >
                  <Icon name="folder" />
                  <span className="workspace-item-label">{item.label}</span>
                  {item.value === value ? <Icon name="check" /> : null}
                </button>
              ))
            )}
          </div>

          <Separator className="my-1" />

          {/* 3. 新建工作空间（弹框输入名称） */}
          <button
            type="button"
            className="workspace-item"
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
              className="workspace-item workspace-item-clear"
              onClick={() => select("")}
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
              if (event.key === "Enter") {
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
