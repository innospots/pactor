/**
 * jsdom 测试环境 polyfill：matchMedia / ResizeObserver
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

// 本包测试直接经 createPactorApplication().mount() 走 createRoot，
// 声明 act 环境以便 React 正确批处理测试中的异步更新。
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;
