/**
 * 「DSL 结构」章节岛：DslNode 调用结构展示 + 复制按钮（pactor CodeBlock 渲染，
 * 右上角复制按钮、复制成功变 √ 两秒由 CodeBlock 内置承载）。
 * JSON 字符串由 Astro 构建期序列化传入（服务端直出内容），
 * 岛仅承载结构展示，client:visible 惰性水合。
 */
import type { ReactElement } from 'react';
import { CodeBlock, Text } from '@pactor-app/ui/components';

export default function DslStructure({ json }: { json: string }): ReactElement {
  return (
    <div className="dsl-structure">
      <div className="dsl-structure-bar">
        <Text type="secondary" size="small" text="DslNode" />
      </div>
      <CodeBlock code={json} language="json" copyable />
    </div>
  );
}
