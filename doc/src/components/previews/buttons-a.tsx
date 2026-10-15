/**
 * 组件运行态预览注册表（按钮族）：ButtonGroup 与 7 个扩展按钮组件。
 * 组件从 '@pactor-app/ui/ui' 导入（vendored 原语层，含扩展按钮），
 * 图标 prop（ReactNode）用 '@pactor-app/ui/components' 的 Icon 白名单渲染；
 * 交互形态用局部 state 受控（IconMorph 切换、FloatingButtonGroup 当前项、
 * ConfirmMorph 异步结果），保证预览可操作。
 */
import { useState, type ReactElement } from 'react';
import { Icon } from '@pactor-app/ui/components';
import {
  ActionButton,
  Button,
  ButtonGroup,
  ConfirmMorph,
  CopyButton,
  ExpandingButtonGroup,
  FloatingButtonGroup,
  IconMorph,
  SplitButton,
} from '@pactor-app/ui/ui';

const rowStyle = { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' } as const;
const columnStyle = { display: 'flex', flexDirection: 'column', gap: 12 } as const;
const noteStyle = { fontSize: 13, color: 'var(--muted-foreground)' } as const;

function ButtonGroupPreview() {
  return (
    <div style={columnStyle}>
      <ButtonGroup>
        <Button variant="outline">年</Button>
        <Button>季</Button>
        <Button variant="outline">月</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">左对齐</Button>
        <Button variant="outline">居中</Button>
        <Button variant="outline">右对齐</Button>
      </ButtonGroup>
    </div>
  );
}

function ActionButtonPreview() {
  return (
    <div style={rowStyle}>
      <ActionButton icon={<Icon name="save" size={16} />} label="保存" />
      <ActionButton icon={<Icon name="download" size={16} />} label="导出" variant="outline" />
      <ActionButton
        icon={<Icon name="settings" size={16} />}
        variant="ghost"
        tooltip="偏好设置"
        aria-label="偏好设置"
      />
      <ActionButton
        icon={<Icon name="trash" size={16} />}
        variant="ghost"
        tooltip="删除"
        aria-label="删除"
      />
    </div>
  );
}

function SplitButtonPreview() {
  const [last, setLast] = useState('');
  return (
    <div style={rowStyle}>
      <SplitButton
        onClick={() => setLast('已触发主操作：保存')}
        onSelect={(value) => setLast(`已选择备选：${value}`)}
        options={[
          { value: 'save-draft', label: '存为草稿', icon: <Icon name="file-text" size={16} /> },
          { value: 'save-copy', label: '另存副本', icon: <Icon name="copy" size={16} /> },
          { value: 'save-template', label: '存为模板', icon: <Icon name="bookmark" size={16} /> },
        ]}
      >
        保存
      </SplitButton>
      <span style={noteStyle}>{last || '点击主按钮或展开下拉选择备选操作'}</span>
    </div>
  );
}

function CopyButtonPreview() {
  return (
    <div style={rowStyle}>
      <CopyButton
        value="npm install @pactor-app/ui"
        label="复制安装命令"
        copiedLabel="已复制"
      />
      <CopyButton
        value="https://pactor-docs.xp-java.workers.dev"
        aria-label="复制文档地址"
      />
      <span style={noteStyle}>npm install @pactor-app/ui</span>
    </div>
  );
}

function IconMorphPreview() {
  const [state, setState] = useState<'a' | 'b'>('a');
  return (
    <div style={rowStyle}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setState((s) => (s === 'a' ? 'b' : 'a'))}
      >
        切换状态
      </Button>
      <IconMorph morph="menu-close" state={state} className="size-5" />
      <IconMorph morph="play-pause" state={state} className="size-5" />
      <IconMorph morph="plus-minus" state={state} className="size-5" />
      <span style={noteStyle}>当前 state = {state}（受控驱动）</span>
    </div>
  );
}

function ConfirmMorphPreview() {
  return (
    <div style={rowStyle}>
      <ConfirmMorph
        label="删除"
        confirmLabel="确认删除"
        successLabel="已删除"
        onConfirm={() => new Promise((resolve) => setTimeout(resolve, 1200))}
      />
      <ConfirmMorph
        label="清空"
        confirmLabel="确认清空"
        variant="outline"
        onConfirm={() => new Promise((_, reject) => setTimeout(reject, 800))}
        onUndo={() => {}}
      />
      <span style={noteStyle}>左侧演示成功流程，右侧演示失败后可撤销</span>
    </div>
  );
}

function FloatingButtonGroupPreview() {
  const [value, setValue] = useState('list');
  return (
    <div style={rowStyle}>
      <FloatingButtonGroup
        value={value}
        onSelect={setValue}
        options={[
          { value: 'list', label: '列表', icon: <Icon name="list" size={16} /> },
          { value: 'grid', label: '网格', icon: <Icon name="grid" size={16} /> },
          { value: 'chart', label: '图表', icon: <Icon name="chart" size={16} /> },
        ]}
      />
      <span style={noteStyle}>当前视图：{value}（悬停高亮跟随，点击落定）</span>
    </div>
  );
}

function ExpandingButtonGroupPreview() {
  const [last, setLast] = useState('');
  return (
    <div style={rowStyle}>
      <ExpandingButtonGroup
        onSelect={(value) => setLast(`已触发：${value}`)}
        options={[
          { value: 'edit', label: '编辑', icon: <Icon name="pencil" size={16} /> },
          { value: 'share', label: '分享', icon: <Icon name="share" size={16} /> },
          { value: 'download', label: '下载', icon: <Icon name="download" size={16} /> },
          {
            value: 'delete',
            label: '删除',
            icon: <Icon name="trash" size={16} />,
            confirm: true,
            confirmLabel: '确认删除',
          },
        ]}
      />
      <span style={noteStyle}>{last || '悬停展开 label；「删除」需二次点击确认'}</span>
    </div>
  );
}

export const PREVIEWS_BUTTONS: Record<string, () => ReactElement> = {
  'component.button-group': ButtonGroupPreview,
  'component.action-button': ActionButtonPreview,
  'component.split-button': SplitButtonPreview,
  'component.copy-button': CopyButtonPreview,
  'component.icon-morph': IconMorphPreview,
  'component.confirm-morph': ConfirmMorphPreview,
  'component.floating-button-group': FloatingButtonGroupPreview,
  'component.expanding-button-group': ExpandingButtonGroupPreview,
};
