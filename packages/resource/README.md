# @pactor/resource

[Pactor](https://github.com/426-330/pactor) 的资源加载包：DSL 资源 Envelope 模型、HTTP / Static 两种资源加载器、带版本控制与 ETag 条件请求的内存缓存。

## 安装

```bash
npm install @pactor/resource
# 或
pnpm add @pactor/resource
```

## 示例

```ts
import { HttpDslResourceLoader, StaticDslLoader } from '@pactor/resource';

// HTTP 加载器：默认访问 /api/runtime/{pages,fragments,bootstrap}
const loader = new HttpDslResourceLoader({ baseUrl: '/api/runtime' });

const bootstrap = await loader.loadBootstrap(); // 自动更新版本表（pageVersions）
const page = await loader.loadPage('customer-list'); // id@version 缓存 + ETag 条件请求

loader.updateVersions({ 'customer-list': 104 }); // 版本表更新后自动重载
loader.invalidate('customer-list'); // 删除该 id 全部版本缓存条目

// 静态加载器：examples / 单测 / 本地 DSL 开发
const staticLoader = new StaticDslLoader({
  pages: { demo: pageDsl }, // 裸 DSL 自动包装为 version 1 的 envelope
});
```

特点：

- 零 React 依赖，仅依赖 `@pactor/core` 类型，浏览器 / Node 通用
- HTTP 层可替换：结构化 `HttpAdapter` 接口 + 默认 fetch 实现，便于统一认证与测试
- 内存缓存：`id@version` 键、bootstrap 版本表自动失效、ETag 条件请求、并发 inflight 去重
- Envelope 宽容解析：缺省字段给默认值，DSL 本体校验由 PageRuntime（@pactor/schema）负责

## 文档

完整文档见 <https://github.com/426-330/pactor/tree/main/docs>（`pnpm docs:dev` 本地启动文档站）。

## License

[MIT](../../LICENSE)
