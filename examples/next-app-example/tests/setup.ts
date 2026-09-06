import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

/**
 * jsdom 测试环境 polyfill：matchMedia / ResizeObserver / IntersectionObserver
 * 等浏览器 API，jsdom 未实现，这里统一补齐（参照 packages/ui/tests/components/setup.ts）。
 */

// vitest 未开启 globals，@testing-library/react 的自动清理不生效，这里显式 cleanup
afterEach(cleanup);

if (typeof window !== "undefined") {
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

  if (!window.IntersectionObserver) {
    window.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    } as unknown as typeof IntersectionObserver;
  }

  if (!window.scrollTo) {
    window.scrollTo = () => {};
  }

  // Base UI 弹层（Select/Popover 等）依赖 Pointer Capture / scrollIntoView，jsdom 未实现
  if (!HTMLElement.prototype.hasPointerCapture) {
    HTMLElement.prototype.hasPointerCapture = () => false;
    HTMLElement.prototype.setPointerCapture = () => {};
    HTMLElement.prototype.releasePointerCapture = () => {};
  }

  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
}
