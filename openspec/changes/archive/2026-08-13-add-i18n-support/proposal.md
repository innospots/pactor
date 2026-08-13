## Why

Pactor 当前没有内建的国际化（i18n）支持。企业级 Server-Driven UI 应用通常需要面向多语言用户，页面 DSL、组件文案、布局外壳、菜单标题等都需要支持动态切换语言。缺乏统一 i18n 机制会导致各业务自行拼接文案，无法保证一致性，也无法利用运行时表达式能力。

## What Changes

- 新增 **i18n 运行时支持**：`RuntimeContext` 注入当前 locale 与翻译函数，表达式引擎提供 `t(key)` / `t(key, params)` 白名单函数。
- 新增 **应用级 i18n 配置**：`createPactorApplication` 支持 `locale`、`messages`、`defaultLocale` 等选项；bootstrap 可下发 `locale` 与 `messages`。
- 新增 **DSL 文案国际化**：页面 DSL 中的文本属性（title、label、placeholder、text 等）支持 `${t('key')}` 表达式；内置组件的默认文案可通过 i18n 覆盖。
- 新增 **布局与菜单国际化**：菜单标题、品牌区、面包屑等外壳文案支持按 locale 渲染。
- 无破坏性变更；缺省行为保持现有硬编码文案不变。

## Capabilities

### New Capabilities

- `i18n`: Pactor 框架国际化支持，覆盖运行时上下文、表达式函数、应用配置、DSL 文案与外壳文案。

### Modified Capabilities

- `runtime-context`: 在 RuntimeContext 中增加 `locale` 与 `i18n` 字段，供表达式与组件读取当前语言环境。
- `application-bootstrap`: bootstrap 与 `createPactorApplication` 支持 locale/messages 配置，并注入到应用级上下文。
- `dsl-expression-engine`: 表达式引擎新增 `t()` 翻译函数白名单，支持参数插值与回退。

## Impact

- 影响包：`pactor-core`（i18n 类型）、`pactor-expression`（`t()` 函数）、`pactor-runtime`（RuntimeContext 扩展）、`pactor-app`（启动编排与选项）、`pactor-ui-radix` / `pactor-ui-antd`（布局与组件文案）。
- 影响 DSL：页面/菜单/布局 DSL 可使用 `${t('...')}`。
- 新增文档：i18n 使用指南与 DSL 参考。
- 示例：`examples/admin` / `examples/admin-antd` 增加 locale 切换演示。
