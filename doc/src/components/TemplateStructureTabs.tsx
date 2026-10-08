/**
 * 线框模板「结构」块岛：Tab 切换「DSL 结构 / yaml 结构」。
 * - DSL 结构：构建期解析 yaml 得到的 JSON 结构视图（解析失败回退原文）；
 * - yaml 结构：原始 yaml 代码块，可复制。
 * block 由 Astro 构建期序列化传入（服务端直出），岛仅承载 Tab 与复制交互。
 */
import { useState, type ReactElement } from 'react';

export interface StructureBlock {
  /** 所属布局/套标题 */
  title: string;
  /** yaml 原文 */
  yaml: string;
  /** 解析出的结构 JSON（null 时 DSL 结构视图回退为原文） */
  structureJson: string | null;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export default function TemplateStructureTabs({
  block,
}: {
  block: StructureBlock;
}): ReactElement {
  const [tab, setTab] = useState<'dsl' | 'yaml'>('dsl');
  const [copied, setCopied] = useState(false);
  const text = tab === 'dsl' ? (block.structureJson ?? block.yaml) : block.yaml;
  const copy = async () => {
    const ok = await copyText(text);
    setCopied(ok);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="tpl-structure">
      <div className="tpl-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'dsl'}
          className={`tpl-tab${tab === 'dsl' ? ' active' : ''}`}
          onClick={() => setTab('dsl')}
        >
          DSL 结构
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'yaml'}
          className={`tpl-tab${tab === 'yaml' ? ' active' : ''}`}
          onClick={() => setTab('yaml')}
        >
          yaml 结构
        </button>
      </div>
      <div className="dsl-structure">
        <div className="dsl-structure-bar" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="dsl-copy-btn" onClick={copy}>
            {copied ? '已复制' : '复制'}
          </button>
        </div>
        <pre className="dsl-json">
          <code>{text}</code>
        </pre>
        {tab === 'dsl' && block.structureJson === null && (
          <div className="preview-note" style={{ padding: '0 16px 12px' }}>
            该骨架含占位语法无法解析为结构，展示原文。
          </div>
        )}
      </div>
    </div>
  );
}
