/** Browser-owned messages. Add product strings here or load a versioned JSON bundle. */
export const messages = {
  "zh-CN": {
    "demo.menu": "前端国际化示例",
    "demo.title": "前端国际化",
    "demo.description": "这段页面文案由浏览器语言包提供。",
    "demo.greeting": "你好，{{name}}！",
    "demo.button": "显示提示",
    "demo.notice": "语言包和表达式都在前端执行。",
  },
  "en-US": {
    "demo.menu": "Client i18n example",
    "demo.title": "Client-side internationalization",
    "demo.description": "This page uses a language bundle owned by the browser.",
    "demo.greeting": "Hello, {{name}}!",
    "demo.button": "Show message",
    "demo.notice": "The language bundle and expressions run in the browser.",
  },
} as const;
