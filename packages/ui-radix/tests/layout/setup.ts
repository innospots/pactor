/**
 * jsdom 测试环境 polyfill：补齐 jsdom 未实现的浏览器 API
 * （matchMedia / ResizeObserver / Pointer Capture 等，Radix 原语依赖）。
 * 在需要的测试文件顶部 `import './setup.js';`（或对应相对路径）引入。
 */

if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;
  }

  if (!window.ResizeObserver) {
    window.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  }

  if (!window.scrollTo) {
    window.scrollTo = () => {};
  }

  // Radix 原语依赖 Pointer Capture / scrollIntoView，jsdom 未实现
  if (!HTMLElement.prototype.hasPointerCapture) {
    HTMLElement.prototype.hasPointerCapture = () => false;
    HTMLElement.prototype.setPointerCapture = () => {};
    HTMLElement.prototype.releasePointerCapture = () => {};
  }

  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
}
