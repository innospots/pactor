/**
 * 画廊页皮肤注入桥（spec: theme-studio / 工作室布局与预览隔离）：
 * 工作室左栏 postMessage 发来的皮肤 CSS 在 gallery 页内 upsert 单个
 * `<style data-theme-studio>` 节点生效——与宿主真实加载方式
 * （在 `pactor-ui/styles.css` 之后级联覆盖）完全一致。
 *
 * 时序：监听器在模块加载时同步安装（早于 app mount），保证不丢消息；
 * 画廊页挂载完成后向父页面发送 ready，左栏收到 ready 才发首次皮肤。
 */

export const SKIN_MESSAGE_TYPE = 'theme-studio:skin';
export const READY_MESSAGE_TYPE = 'theme-studio:ready';
export const MODE_MESSAGE_TYPE = 'theme-studio:mode';
const STYLE_ATTR = 'data-theme-studio';

/** 安装 skin 消息监听（两个路由均安装，代价为零） */
export function installGalleryBridge(): void {
  // 预览默认亮色（工作室编辑亮色令牌，暗色仅作验收）；等候 mode 消息切换
  if (!document.documentElement.hasAttribute('data-pactor-theme')) {
    document.documentElement.setAttribute('data-pactor-theme', 'light');
  }
  window.addEventListener('message', (event) => {
    if (event.source !== window.parent) {
      return;
    }
    const data = event.data as { type?: string; css?: unknown } | null;
    if (
      data?.type === MODE_MESSAGE_TYPE &&
      (data as { mode?: string }).mode !== undefined
    ) {
      const mode = (data as { mode: string }).mode;
      document.documentElement.setAttribute(
        'data-pactor-theme',
        mode === 'dark' ? 'dark' : 'light',
      );
      return;
    }
    if (data?.type !== SKIN_MESSAGE_TYPE || typeof data.css !== 'string') {
      return;
    }
    let styleEl = document.querySelector<HTMLStyleElement>(`style[${STYLE_ATTR}]`);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.setAttribute(STYLE_ATTR, '');
      document.head.append(styleEl);
    }
    styleEl.textContent = data.css;
  });
}

/** 画廊页挂载完成后向父页面通告就绪（仅当运行在 iframe 中） */
export function announceGalleryReady(): void {
  if (window.parent !== window) {
    window.parent.postMessage(
      { type: READY_MESSAGE_TYPE },
      window.location.origin,
    );
  }
}
