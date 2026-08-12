# Design: add-example-vite-starter

## 定位

最小化是核心约束：一个页面、一个数据源、零登录零路由，让用户 5 分钟看清"vite-plugin 把 `.page.yaml` 变成可 import 的 JS 模块"这条链路。复杂场景（路由/权限/overlay/双 kit）指向 example-admin。

## 工程骨架

```text
examples/vite-starter/
  index.html
  package.json          example-vite-starter（private）
  vite.config.ts        pactor() 插件 + 5499 strictPort
  tsconfig.json
  src/
    main.tsx            createPactorApplication + StaticDslLoader + 单页挂载
    dsl-modules.d.ts    '*.page.yaml' 模块声明
    services.ts         一个内存 mock service（todo.list）
    pages/
      home.page.yaml    唯一页面
```

不经 react-router：`createPactorApplication` 的 bootstrap 直接返回单页布局/单页面（参考 example-admin 的 login 形态——无菜单 admin 布局或直接渲染页）。选择最简单路径：bootstrap 返回 `layout: none` 形态（若 app 支持）或直接 `StaticDslLoader` + `createPactorApplication` 单页。实现时以 pactor-app 现有 API 为准，取最简。

## 页面内容（home.page.yaml）

一个"待办清单"页，覆盖插件用户最先写的 DSL 要素：

- `state.keyword` + Form（Input + submit Button）→ setState + reload；
- `dataSources.todos`：type service（todo.list，内存 mock ~200ms），params 绑 `${state.keyword}`；
- Table 渲染 `${data.todos}`；
- Alert 说明文字指出"改这个 yaml 文件即热更新"。

## 验证

1. `pnpm --filter example-vite-starter typecheck` 与 `build` 通过；
2. 浏览器：页面渲染、查询过滤生效；
3. 插件特性实测：改 yaml 触发热更新；往 yaml 写非法字段构建期报错（验证后改回）。

## 非目标

- 不做登录、路由、权限、多页面；
- 不演示 antd kit（默认 Radix）。
