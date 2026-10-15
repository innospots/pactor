/**
 * 「预览与 DSL」合并章节的页签切换（React 岛，vendored ui Tabs line 变体）。
 * 页签为图标 + 文字：预览 / DSL 结构（JSON）/ YAML 结构。
 * 三个面板内容（预览岛 / 结构代码块）由 Astro 经命名 slot 传入，
 * 内部嵌套的 client 岛（ComponentPreview / DslStructure）正常水合。
 * previewExpandable 时页签栏右端出展开图标按钮：预览内容移入整页弹层
 * （PreviewOverlay；移出即重挂载，预览交互态重置）。
 */
import { useState, type ReactNode } from 'react';
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@pactor-app/ui/ui';
import { Icon } from '@pactor-app/ui/components';
import PreviewOverlay from './previews/PreviewOverlay';

interface Props {
  preview?: ReactNode;
  dsl?: ReactNode;
  yaml?: ReactNode;
  /** 预览已接入（非「不适用」）时展示展开按钮 */
  previewExpandable?: boolean;
}

export default function PreviewDslTabs({ preview, dsl, yaml, previewExpandable }: Props) {
  const [tab, setTab] = useState('preview');
  const [expanded, setExpanded] = useState(false);
  return (
    <Tabs value={tab} onValueChange={setTab}>
      <div className="preview-tabs-row">
        <TabsList variant="line">
          <TabsTrigger value="preview">
            <Icon name="eye" size={14} />
            预览
          </TabsTrigger>
          <TabsTrigger value="dsl">
            <Icon name="code" size={14} />
            DSL 结构
          </TabsTrigger>
          <TabsTrigger value="yaml">
            <Icon name="file-text" size={14} />
            YAML 结构
          </TabsTrigger>
        </TabsList>
        {previewExpandable ? (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setExpanded(true)}
            aria-label="展开预览"
            className="preview-expand-btn"
          >
            <Icon name="maximize-2" size={16} />
          </Button>
        ) : null}
      </div>
      <TabsContent value="preview" className="pt-4">
        {expanded ? null : preview}
      </TabsContent>
      <TabsContent value="dsl" className="pt-4">
        {dsl}
      </TabsContent>
      <TabsContent value="yaml" className="pt-4">
        {yaml}
      </TabsContent>
      {expanded ? (
        <PreviewOverlay onClose={() => setExpanded(false)}>{preview}</PreviewOverlay>
      ) : null}
    </Tabs>
  );
}
