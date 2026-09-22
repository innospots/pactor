/**
 * 「DSL 结构」章节岛：DslNode 调用结构 JSON 展示 + 复制按钮。
 * JSON 字符串由 Astro 构建期序列化传入（服务端直出内容），
 * 岛仅承载复制交互，client:visible 惰性水合。
 */
import { useState, type ReactElement } from 'react';

export default function DslStructure({ json }: { json: string }): ReactElement {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 剪贴板不可用（非安全上下文 / 权限拒绝）：退化为选中代码块文本
      const code = document.getElementById('dsl-json-code');
      if (code) {
        const range = document.createRange();
        range.selectNodeContents(code);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  };

  return (
    <div className="dsl-structure">
      <div className="dsl-structure-bar">
        <span className="dsl-structure-label">DslNode</span>
        <button type="button" className="dsl-copy-btn" onClick={copy}>
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre className="dsl-json" id="dsl-json-code">
        <code>{json}</code>
      </pre>
    </div>
  );
}
