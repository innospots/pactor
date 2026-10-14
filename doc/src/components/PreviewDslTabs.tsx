/**
 * 「预览与 DSL」合并章节的页签切换（React 岛，vendored ui Tabs line 变体）。
 * 页签为图标 + 文字：预览 / DSL 结构（JSON）/ YAML 结构。
 * 三个面板内容（预览岛 / 结构代码块）由 Astro 经命名 slot 传入，
 * 内部嵌套的 client 岛（ComponentPreview / DslStructure）正常水合。
 */
import { useState, type ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@pactor-app/ui/ui';
import { Icon } from '@pactor-app/ui/components';

interface Props {
  preview?: ReactNode;
  dsl?: ReactNode;
  yaml?: ReactNode;
}

export default function PreviewDslTabs({ preview, dsl, yaml }: Props) {
  const [tab, setTab] = useState('preview');
  return (
    <Tabs value={tab} onValueChange={setTab}>
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
      <TabsContent value="preview" className="pt-4">
        {preview}
      </TabsContent>
      <TabsContent value="dsl" className="pt-4">
        {dsl}
      </TabsContent>
      <TabsContent value="yaml" className="pt-4">
        {yaml}
      </TabsContent>
    </Tabs>
  );
}
