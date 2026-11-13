/**
 * jsdom 不随包发布类型声明；测试只用到 JSDOM 构造器与 window。
 * @see https://github.com/jsdom/jsdom#readme
 */
declare module 'jsdom' {
  export class JSDOM {
    constructor(html?: string, options?: Record<string, unknown>);
    readonly window: Window & typeof globalThis;
  }
}
