# @pactor-app/theme

[Pactor](https://github.com/innospots/pactor) 的可安装预置皮肤包：14 套皮肤，零运行时依赖，不绑定 React / Next.js。

两种使用方式可单用或混用：

- **静态 CSS**：`import '@pactor-app/theme/skins/qing-hui.css'`，无运行时代码；
- **JS 运行时**：`applyTheme('zhu-cao')` 按需加载并注入 `<style>`，用于设置面板里的即时换肤。

## 安装

```bash
npm install @pactor-app/theme
```

皮肤是基础样式的覆盖层，页面还需要 Pactor 的样式基线（已安装则跳过）：

```bash
npm install pactor-app          # meta 包
# 或只装 UI 层
npm install @pactor-app/ui
```

## 加载顺序

皮肤必须在基础样式**之后**加载（后加载者胜出）：

```ts
import 'pactor-app/styles.css'; // 或 '@pactor-app/ui/styles.css'
import '@pactor-app/theme/skins/qing-hui.css';
```

`skins/*.css` 是构建期生成的自包含文件，不含 `@import`，可被 Vite / Next.js / Rspack 直接当作普通 CSS 处理。

## 方式一：静态 CSS

整套应用固定使用一套皮肤：

```ts
import 'pactor-app/styles.css';
import '@pactor-app/theme/skins/zhu-cao.css';
```

可用皮肤名见下方[预置皮肤](#预置皮肤)。

## 方式二：运行时切换

```ts
import {
  DEFAULT_THEME,
  applyTheme,
  readStoredTheme,
} from '@pactor-app/theme';

// 启动：恢复上次选择，否则用包默认皮肤
await applyTheme(readStoredTheme() ?? DEFAULT_THEME);

// 用户在设置面板选择另一套
await applyTheme('zhu-cao');
```

`applyTheme` 会：

1. 校验皮肤名，非法值回退到 `qing-hui`；
2. 首次调用时才加载对应 CSS chunk（内置 loader 结果按皮肤名缓存）；
3. 复用唯一的 `<style data-pactor-theme-style>`，避免先删后插造成闪白；
4. 设置 `documentElement` 的 `data-pactor-skin` 与 `data-requested-skin`；
5. 默认写入 `localStorage['pactor.theme']`（可用 `persist: false` 关闭）；
6. 在 `window` 上派发 `pactor:theme-change` 和 `pactor:skin-change`——图表包监听后者自动重绘。

连续快速切换时只有最后一次生效，较慢的旧 CSS 不会覆盖新选择。

### 首屏不闪烁

`applyTheme` 是异步懒加载的，不建议把首屏渲染完全押在它身上。推荐在 layout 里静态引入默认皮肤，运行时只负责切换：

```tsx
// app/layout.tsx
import 'pactor-app/styles.css';
import '@pactor-app/theme/skins/qing-hui.css';
```

如果首屏皮肤来自用户存储，可在 SSR 输出或首屏内联脚本中直接写 `data-pactor-skin` 并引入对应 CSS，避免闪烁。

### 暗色模式

**暗色由宿主控制，本包不设置也不修改 `data-pactor-theme`。** 每套皮肤都包含亮/暗两组令牌：

- 亮色：`:root:not([data-pactor-theme='dark'])`
- 暗色：`[data-pactor-theme='dark']`

使用皮肤时请把系统偏好或用户选择解析成显式属性，否则皮肤会保持亮色：

```ts
const media = window.matchMedia('(prefers-color-scheme: dark)');
const sync = () => {
  document.documentElement.dataset.pactorTheme = media.matches
    ? 'dark'
    : 'light';
};
sync();
media.addEventListener('change', sync);
```

基础样式自带的系统暗色媒体查询优先级低于皮肤亮色块，因此**仅依赖 `prefers-color-scheme` 不会让皮肤变暗**；显式设置属性才会命中皮肤的暗色令牌。

### 密度不受影响

所有皮肤都不定义 `--pactor-control-*`。表格/表单密度仍由 `data-pactor-size` 独立控制：

```html
<html data-pactor-size="compact">
```

构建脚本和测试会强制检查这一契约。

### CSP nonce

CSP 禁止内联 `<style>` 时传入 nonce：

```ts
await applyTheme('jin-yu', { nonce: window.__CSP_NONCE__ });
```

通过 `import '.../skins/xxx.css'` 静态引入不受影响。

### 跨标签页同步

`subscribeTheme` 同时监听应用内换肤事件和 `storage` 事件，第二个参数带 `source`：

```ts
import { applyTheme, subscribeTheme } from '@pactor-app/theme';

subscribeTheme((theme, detail) => {
  // 只响应其他标签页的变化，避免本页 applyTheme 再次触发自己
  if (detail.source === 'storage') {
    void applyTheme(theme);
  }
});
```

### 从 starter 迁移

starter 使用 `mc-skin` 作为存储键，迁移时复用已有用户选择：

```ts
import { applyTheme, readStoredTheme } from '@pactor-app/theme';

const stored = readStoredTheme({ storageKey: 'mc-skin' });
await applyTheme(stored ?? 'qing-ming', { storageKey: 'mc-skin' });
```

## API

### 清单与本地化

| API | 说明 |
| --- | --- |
| `THEMES` | 全部皮肤定义（`readonly ThemeDefinition[]`，顺序同 `themes.json`） |
| `THEME_NAMES` | 全部皮肤名 |
| `DEFAULT_THEME` | 包默认皮肤 `'qing-hui'` |
| `getTheme(name)` | 按名字取定义，不存在返回 `undefined` |
| `isThemeName(value)` | 类型守卫，只接受内置皮肤名 |
| `resolveTheme(value)` | 非法/空值回退到 `DEFAULT_THEME` |
| `themeText(theme, locale)` | 按语言返回 `{ label, family, source }`；`en` 前缀用英文元数据 |

`ThemeDefinition`：

```ts
interface ThemeDefinition {
  name: ThemeName;
  label: string;      // 朱草绛红
  labelEn: string;    // Vermilion Red
  family: string;     // 红色系
  familyEn: string;   // Red
  color: string;      // #A64036
  source: string;     // 朱草
  sourceEn: string;   // Zhu Cao
  kind: 'tokens' | 'full';
}
```

### 运行时

| API | 说明 |
| --- | --- |
| `loadThemeCss(name, loaders?)` | 返回皮肤 CSS；未知皮肤、空 CSS 会 reject |
| `applyTheme(name, options?)` | 异步应用内置皮肤，返回实际生效的 `ThemeName` |
| `applyCustomTheme(name, css, options?)` | 同步应用任意 CSS，默认不持久化 |
| `readAppliedTheme(options?)` | 读取 `data-pactor-skin` |
| `readStoredTheme(options?)` | 读取并校验存储值，只返回内置皮肤名 |
| `subscribeTheme(listener, options?)` | 订阅换肤，返回取消函数 |

`ApplyThemeOptions`：

| 选项 | 默认 | 说明 |
| --- | --- | --- |
| `document` | 全局 `document` | 注入其他文档（iframe / 测试） |
| `storage` | 全局 `localStorage` | 传 `null` 禁用持久化 |
| `storageKey` | `'pactor.theme'` | 自定义存储键，如 `'mc-skin'` |
| `persist` | `true` | `applyTheme` 是否写存储；`applyCustomTheme` 默认 `false` |
| `nonce` | — | 注入 `<style>` 的 CSP nonce |
| `loaders` | 内置 loader | 覆盖皮肤加载方式（测试或自托管 CSS） |

导出的常量：

```ts
THEME_STORAGE_KEY;     // 'pactor.theme'
THEME_ATTR;            // 'data-pactor-skin'
THEME_REQUESTED_ATTR;  // 'data-requested-skin'
THEME_STYLE_ATTR;      // 'data-pactor-theme-style'
THEME_EVENT;           // 'pactor:theme-change'
CHART_SKIN_EVENT;      // 'pactor:skin-change'
```

自定义皮肤：

```ts
import { applyCustomTheme } from '@pactor-app/theme';

applyCustomTheme('brand-2026', `
  :root:not([data-pactor-theme='dark']) { --primary: #0f766e; }
  [data-pactor-theme='dark'] { --primary: #5eead4; }
`);
```

自定义 CSS 不经过校验，调用方需自行保证亮/暗两组令牌。即使 `persist: true`，`readStoredTheme` 也只识别内置皮肤名，自定义皮肤的持久化标识需宿主自行管理。

### SSR

包在模块顶层不访问 `window` / `document`，可在 RSC、Node 或任何无 DOM 环境安全导入。无 DOM 时：

- `applyTheme` 直接返回解析后的皮肤名；
- `applyCustomTheme` 直接返回传入的名字；
- `readAppliedTheme` / `readStoredTheme` 返回 `null`；
- `subscribeTheme` 返回空的取消函数。

## 预置皮肤

包默认 `qing-hui`；starter 的默认 `qing-ming` 保持不变。

| 名字 | 中文标签 | 色系 | 种子色 | kind |
| --- | --- | --- | --- | --- |
| `zhu-cao` | 朱草绛红 | 红色系 | `#A64036` | tokens |
| `jin-yun` | 缙云暖橙 | 橙色系 | `#EE7959` | tokens |
| `qiu-xiang` | 秋香金黄 | 黄色系 | `#BF9C46` | tokens |
| `bi-shan` | 碧山青绿 | 绿色系 | `#779649` | tokens |
| `tian-shui` | 天水澄青 | 青色系 | `#5AA4AE` | tokens |
| `qing-ming` | 青冥深蓝 | 蓝色系 | `#3271AE` | tokens |
| `qing-hui` | 青灰冷调 | 蓝灰色系 | `#536B7F` | tokens |
| `ning-ye` | 凝夜幽紫 | 紫色系 | `#422256` | tokens |
| `lian-hong` | 莲红浅粉 | 粉色系 | `#D9A0B3` | tokens |
| `li-ke` | 栗壳暖褐 | 棕褐色系 | `#775039` | tokens |
| `wan-yan` | 琬琰米杏 | 米杏色系 | `#A9A886` | tokens |
| `yue-po` | 月魄素灰 | 白灰色系 | `#B2B6B6` | tokens |
| `jin-yu` | 瑾瑜玄墨 | 黑墨色系 | `#1E2732` | tokens |
| `portal` | Portal 深海蓝 | 品牌色系 | `#3271AE` | full |

`kind: "tokens"` 只覆盖设计令牌；`kind: "full"` 还包含 `body`、标题层级与 `[data-slot]` 等全局结构样式（`portal`）。运行时切换会整体替换 `<style>` 内容，因此 full 皮肤的结构样式不会在切走后残留。

## 开发

```bash
pnpm --filter @pactor-app/theme build        # 生成 skins/ + 构建 dist
pnpm --filter @pactor-app/theme build:skins  # 只重新生成自包含 CSS
pnpm --filter @pactor-app/theme check:skins  # 校验已提交的 skins/ 是否最新
pnpm --filter @pactor-app/theme test
pnpm --filter @pactor-app/theme typecheck
pnpm --filter @pactor-app/theme test:dist    # ESM + CJS 产物冒烟
```

`skins/` 是生成物但**需要提交**：发布前 `prepublishOnly` 会重建并跑产物冒烟；`check:skins` 用于确认生成物与源文件一致。

### 新增一套皮肤

1. 新建 `src/skins/<name>.css`。薄皮肤首行写 `@import './_base.css';` 复用中性底，再覆盖差异令牌；
2. 同时提供 `:root:not([data-pactor-theme='dark'])` 与 `[data-pactor-theme='dark']` 两个块，各自声明 `color-scheme`，并设置 `--theme-source: <种子色>`；
3. 不要定义任何 `--pactor-control-*` 令牌（密度契约）；
4. 在 `themes.json` 注册元数据（`name` / `label` / `labelEn` / `family` / `familyEn` / `color` / `source` / `sourceEn` / `kind`）；
5. 在 `src/loaders.ts` 加一行字面量动态导入，保证打包器能静态切分：

   ```ts
   'my-theme': () => import('../skins/my-theme.css').then((m) => m.default),
   ```

6. 运行 `pnpm --filter @pactor-app/theme build:skins`，提交 `skins/<name>.css`；
7. 运行 `test` / `test:dist` 验证。

`qing-hui` 是完整令牌皮肤，不依赖 `_base.css`；新增皮肤也可以照此写全量令牌。

## License

MIT
