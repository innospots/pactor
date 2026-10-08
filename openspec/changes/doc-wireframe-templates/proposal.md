## Why

`product-design/skills/innos-diagram/references` 已沉淀 14 篇线框结构模式文档（控制台外壳、搜索列表、卡片列表、树形主从、详情、表单、侧滑层、弹窗、授权、登录、仪表盘、信息卡片、聊天），每篇含 ASCII 线框与「DSL 配置（预留）」yaml 骨架，但只存在于 skill 参考库中，无法浏览检索。资产库站点（doc/）的「模板」分类目前是硬编码菜单 + 全量「待接入」占位，没有内容接入机制。需要把线框案例总结为资产库模板，并建立「放入 markdown 即自动出现菜单与页面」的内容驱动机制。

## What Changes

- 在 doc/ 资产库新增「线框模板」内容目录（markdown 驱动）：将某一模板的 markdown 文档放入该目录后，构建期自动收集，「模板」分类导航自动新增对应菜单项，无需修改 `site-nav.ts` 硬编码。
- 每个模板页面展示两部分：**模板预览**（线框结构与布局说明，渲染 markdown 正文，ASCII 线框等宽展示）与 **yaml 结构**（从 markdown 中提取的 ```yaml DSL 骨架代码块，按布局分套展示）。
- 将 innos-diagram/references 的 14 篇案例总结接入为首批模板内容（保持原文结构模式与 DSL 骨架，按资产库模板格式整理 frontmatter）。
- 模板详情页路由：模板分类下每个 markdown 对应一个页面（如 `/templates/wireframe/<slug>`），支持深链。
- 模板总览页更新：如实展示已接入的线框模板列表（名称、说明、布局数），替代「待接入」占位。

## Capabilities

### New Capabilities

- `wireframe-template-gallery`: markdown 驱动的线框模板展示机制——内容目录约定、构建期收集与菜单自动生成、模板页（预览 + yaml 结构）渲染。

### Modified Capabilities

- `asset-library-pages`: 「模板」分类由全量「待接入」骨架改为内容驱动——已接入的线框模板板块展示真实条目与详情页，未接入板块保持「待接入」；导航支持数据生成的菜单项与硬编码项并存。

## Impact

- 代码：`doc/` 站点新增模板内容目录、模板数据加载模块（`import.meta.glob` 构建期收集）、模板详情/总览路由与渲染模板；`site-nav.ts` 模板分类支持动态项。
- 数据：新增 14 篇线框模板 markdown（来源：innos-diagram/references 总结）。
- 依赖：不新增运行时依赖；markdown 解析使用 Astro/构建期能力。
- 不影响 packages/* 与 skills/*；innos-diagram 源文件只读引用，不修改。
