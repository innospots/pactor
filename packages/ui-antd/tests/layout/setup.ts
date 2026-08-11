/**
 * jsdom 测试环境 polyfill：antd（rc-*）依赖 matchMedia / ResizeObserver
 * 等浏览器 API，jsdom 未实现，这里统一补齐。
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
}
