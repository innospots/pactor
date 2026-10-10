/**
 * 复制到剪贴板助手。
 * 复制内容末尾固定追加两行来源注释（构建版本 + Git 提交号），
 * 注释风格按内容自适应（# 或 //），buildCopyText 为纯函数便于测试。
 */
import buildInfo from '../generated/build-info.json';

export interface BuildInfoLike {
  version: string;
  commit: string;
}

/** 当前构建信息（构建期注入的 build-info.json） */
export const BUILD_INFO: BuildInfoLike = {
  version: buildInfo.version,
  commit: buildInfo.commit,
};

export type CommentStyle = 'hash' | 'slash' | 'auto';

/** 内容是否更像 JS/TS/CSS 等使用 // 注释的代码 */
function detectSlashComment(text: string): boolean {
  return (
    /^\s*(?:export\s+)?(?:const|let|var|function|import|interface|type|class)\s/m.test(
      text,
    ) ||
    text.includes('=>') ||
    text.includes('//')
  );
}

/**
 * 生成实际写入剪贴板的内容：原文（去除尾部空白）+ 两行来源注释。
 * @param text     要复制的原始内容
 * @param info     构建信息（测试可注入；缺省用站点 build-info.json）
 * @param style    注释风格，auto 按内容启发式选择 # 或 //
 */
export function buildCopyText(
  text: string,
  info: BuildInfoLike = BUILD_INFO,
  style: CommentStyle = 'auto',
): string {
  const marker =
    style === 'auto' ? (detectSlashComment(text) ? '//' : '#') : style === 'slash' ? '//' : '#';
  const body = text.replace(/\s+$/, '');
  return `${body}\n${marker} 来源：Pactor UI 资产库\n${marker} 构建版本 ${info.version} · Git ${info.commit}`;
}

/**
 * 写入剪贴板：优先 Clipboard API，不可用时回退 document.execCommand。
 * Clipboard API 在无焦点 / 权限受限环境可能悬挂（不 resolve 也不 reject），
 * 加超时竞速（1.5s）降级，避免复制按钮无反馈。
 * 返回是否成功（成功/失败均由调用方给出明确反馈）。
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      const result = await Promise.race([
        navigator.clipboard.writeText(text).then(() => 'ok' as const),
        new Promise<'timeout'>((resolve) => {
          setTimeout(() => resolve('timeout'), 1500);
        }),
      ]);
      if (result === 'ok') return true;
    }
  } catch {
    // 继续尝试 execCommand 回退
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}
