# DSL 国际化：声明、词条与切换

## 使用前提

以下三种是 **作者态 YAML** 的字段声明，同一字段选一种，可在同一页面混用。优先使用方式三 `$i18n{完整键:默认文案}`；只有局部少量文案适合方式一，动态插值或需要显式参数时用方式二。业务页面由服务端 `@pactor-app/i18n` 按请求语言转换后下发；浏览器不会自动查找作者态 `$i18n`。检查目标项目的 Pactor 版本和接入链，不能假定纯 `StaticDslLoader` 自动支持此转换。

```yaml
dsl: '1.0'
page:
  id: users
  title: '$i18n{user.title:用户管理}'
i18n:
  namespaces: [app]
body:
  type: Button
  props:
    text: '$i18n{common.save:保存}'
```

### 三种声明

1. **属性内联**：适合少量不复用的文案，不必建立语言包。

   ```yaml
   text:
     $i18n:
       messages: { zh-CN: 保存, en-US: Save }
       fallback: 保存
   ```

2. **属性引用语言包**：适合需要动态参数或显式配置回退的文案。

   ```yaml
   text:
     $i18n:
       key: user.greeting
       fallback: '你好，{{name}}'
       params:
         name: '${state.name}'
   ```

   语言包写 `user.greeting: 'Hello, {{name}}'`；表达式放在 DSL 的 `params` 中，不能写进译文。运行时参数仅用于经过 Runtime 表达式求值的字段；静态 `page.title` 不保证动态插值。

3. **字段内简写（默认首选）**：`text: '$i18n{common.save:保存}'`。必须是完整字段值，key 非空且稳定，第一个冒号分隔 key 和 fallback；fallback 可以为空或包含冒号。默认文案中的 `}`、反斜杠分别写 `\}`、`\\`，使用 YAML 单引号。不能拼接普通文本或直接放动态参数。

`$i18n` 对象的 `key` 与 `messages` 二选一；旧 `i18n.bindings` 已移除，不要新增。只在支持的静态元信息及已注册组件展示字段、动作参数使用；不要翻译 state、业务数据、URL、路由、ID、权限或请求参数。未注册字段会报错，必要时通过 `createDefaultTranslatableFieldRegistry()` 的 `register` / `registerAction` 扩展，并将同一 registry 注入本地化调用。

## 建立语言包与接入

1. 确定支持语言、默认语言、完整稳定 key 和 namespace。页面的 `i18n.namespaces` 是加载分组而非 key 前缀；例如上例 `app` 分组可以包含 `common.save` 和 `user.title`。
2. 为每种语言创建扁平 YAML 字符串表，例如 `src/backend/resources/i18n/locales/zh-CN/app.yaml`：

   ```yaml
   common.save: 保存
   user.title: 用户管理
   ```

   `src/backend/resources/i18n/locales/en-US/app.yaml`：

   ```yaml
   common.save: Save
   user.title: User management
   ```

3. Next starter 的 `src/backend/resources/i18n/index.ts` 中配置 `localeConfig.supportedLocales`、默认语言及 `YamlMessageProvider` 的 manifest（每个 locale / namespace 的相对路径和版本），发布词条时更新版本。其他宿主可注入 `YamlMessageProvider` 或远程 `ApiMessageProvider`；不要发明 YAML `messageSource` 配置。避免不同 namespace 重复完整 key。
4. 宿主按 URL、Cookie、`Accept-Language` 和默认语言解析请求；对页面执行 `localizeYamlResource` 或加载词条后 `localizePageDsl`，并分别处理 sitemap、布局、懒加载页面等资源。当前语言缺词时按配置的语言回退链、默认语言、字段 fallback 查找。确认下发内容无作者态 `$i18n`。业务数据的翻译由数据服务负责。
5. 对已有工程先检查其具体加载链与语言包路径，不覆盖既有方案；客户端兼容模式 `${t('key')}`、`instance.setLocale` 只能更新客户端词条，不能自动转换或重取服务端本地化资源。

## 语言切换与验收

Next starter 已提供 `src/frontend/locale.tsx` 的 `useLocale`、账户菜单语言选择器和 `src/frontend/App.tsx` 接线。切换需更新有效 locale、Cookie、URL 的 `locale` 参数与文档 `lang`，并以新语言重新获取 sitemap、布局及页面；starter 使用 `key={locale}` 重挂载 `SitemapApp`。保持路由、查询参数和登录会话；重挂载会重置页面、未提交表单及布局临时状态，涉及未保存编辑时应先处理。自定义 React 组件文案放 `src/frontend/i18n/messages.ts`；页面 DSL 文案仍走服务端 YAML 语言包。其他宿主自行接好等效流程，不要只调用 `setLocale` 就声称服务端内容已切换。

新增语言时同步扩展服务端 supported locales、manifest、语言包及客户端选择器；按项目实际实现检查请求、缓存和失败反馈。验收至少覆盖两种语言：页面标题、按钮、菜单、布局、懒加载页和提示；检查语言包、缺词 fallback、切换后 URL / Cookie / 刷新保持、请求使用目标 locale，确认无原始 `$i18n` 或本地化错误。根据实际情况测试动态参数及未保存状态。
