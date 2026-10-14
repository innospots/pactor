/**
 * 结构代码块岛：pactor CodeBlock 渲染（语法高亮 + 右上角复制按钮，
 * 复制成功变 √ 两秒由 CodeBlock 内置承载）。
 * 代码字符串由 Astro 构建期序列化传入（服务端直出内容），
 * 岛仅承载展示，client:visible 惰性水合。
 */
import type { ReactElement } from 'react';
import { CodeBlock } from '@pactor-app/ui/components';

export default function DslStructure({
  code,
  language = 'json',
}: {
  code: string;
  language?: string;
}): ReactElement {
  return <CodeBlock code={code} language={language} copyable />;
}
