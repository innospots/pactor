/**
 * 极简安全 Markdown 子集渲染器（用于使用指引等短文本）。
 * 仅支持：段落、`##`/`###` 标题、`-` 无序列表、GFM 风格管道表格
 * （首行表头 + 分隔行触发，单元格内容全部转义并支持行内格式）、
 * 行内 `code`、**加粗**、[链接](url)。全部输入先经 HTML 转义再排版，不输出原始 HTML。
 * 富内容请直接以 Astro 片段传入组件，不走本渲染器。
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inline(s: string): string {
  return escapeHtml(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
    );
}

/** 管道表格分隔行：| --- | :---: | ---: | */
function isTableSeparator(line: string): boolean {
  const t = line.trim();
  if (!t.includes('-')) return false;
  return /^\|?[\s\-:|]+\|?$/.test(t) && t.replace(/[\s\-:|]/g, '').length === 0;
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());
}

/** 将 Markdown 子集渲染为安全 HTML 字符串 */
export function renderMarkdown(src: string): string {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  let list: string[] = [];
  const flushList = () => {
    if (list.length > 0) {
      out.push(`<ul>${list.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`);
      list = [];
    }
  };
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();
    // GFM 管道表格：当前行与下一行构成「表头 + 分隔行」时触发
    if (
      line.startsWith('|') &&
      i + 1 < lines.length &&
      isTableSeparator(lines[i + 1].trim())
    ) {
      flushList();
      const header = splitRow(line);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(splitRow(lines[i].trim()));
        i++;
      }
      i--;
      out.push(
        '<table class="data-table"><thead><tr>' +
          header.map((h) => `<th>${inline(h)}</th>`).join('') +
          '</tr></thead><tbody>' +
          rows
            .map(
              (r) =>
                `<tr>${header.map((_, j) => `<td>${inline(r[j] ?? '')}</td>`).join('')}</tr>`,
            )
            .join('') +
          '</tbody></table>',
      );
      continue;
    }
    if (line === '') {
      flushList();
      continue;
    }
    if (line.startsWith('### ')) {
      flushList();
      out.push(`<h4>${inline(line.slice(4))}</h4>`);
    } else if (line.startsWith('## ')) {
      flushList();
      out.push(`<h3>${inline(line.slice(3))}</h3>`);
    } else if (line.startsWith('- ')) {
      list.push(line.slice(2));
    } else {
      flushList();
      out.push(`<p>${inline(line)}</p>`);
    }
  }
  flushList();
  return out.join('');
}
