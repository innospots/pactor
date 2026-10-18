# pactor-prd 模板工程

可运行的参考实现：Next.js + pactor，页面全部由 YAML DSL 描述（`src/server/yaml/`），数据一律使用 http 数据源，经纯转发层（`app/api/d/[...parts]`）转发到 `NEXT_PUBLIC_API_BASE_URL`；没有服务层接口时返回空数据，页面按空态渲染。

## 包含内容

- **公共页面**：`yaml/common/`（login 登录页、dashboard 仪表盘）
- **参考模块与骨架**：`yaml/provider/`、`yaml/route/`，以及 `yaml/models/data-list.yaml` 数据列表标准骨架
- **完整接线**：`src/pactor/`（SitemapApp、pageEndpoint、皮肤加载、自定义组件与动作）、`src/server/`（YAML 递归加载 + 会话裁剪）、`app/api/`（sitemap / public/pages / d 转发层 / auth / users）
- **默认皮肤**：`public/skins/neutral.css` 提供一套 neutral 默认皮肤，包含完整的亮色、暗色语义令牌；Header 可切换皮肤与明暗模式
- **中性品牌素材**：`public/logo.svg` 与 `app/icon.svg`

## 复制、替换与冒烟

生成新项目时**整体复制本目录**为 `<project>`。以下 `prd-template.mjs` 命令均从包含 `skills/` 的仓库根目录执行：

1. 按 `skills/pactor-prd/template-placeholders.json` 准备 `<values.json>`。values 必须是 flat JSON object，恰好包含清单登记的全部 12 个键，每个值都是字符串；键含义和可用示例值直接读取清单，不自行增删键。
2. 执行 render 和 rendered check：

   ```bash
   node skills/scripts/prd-template.mjs render <project> --values <values.json>
   node skills/scripts/prd-template.mjs check <project> --rendered
   ```

   render 会校验源模板和 values，并对字符串做 JSON 编码后替换。不要手工逐文件替换，也不要只修改 `package.json`；rendered check 未通过时不得生成页面。
3. rendered check 通过后安装依赖并启动开发服务器冒烟：

   ```bash
   pnpm -C <project> install
   pnpm -C <project> dev
   ```

   默认端口为 9011；无后端时数据区显示空态。冒烟通过后再生成 PRD 页面。
4. 页面生成阶段按 PRD 清单更新 `src/server/yaml/sitemap.yaml` 的 pages、menus（保留 layouts 和 render 写入的 app 名称），保留或调整 `common/`，参照 provider/route/models 新增业务模块。全站生成完成后删除参考模块与 models。
5. dataSources 的 url 写最终接口路径（`/api/d/...`，路径即契约）；接真实后端时修改 `next.config.js` 的 `API_BASE_URLS`，页面 YAML 不动。

维护源模板时，使用 source check 校验占位清单、完整字面量和禁止数据：

```bash
node skills/scripts/prd-template.mjs check skills/pactor-prd/template --source
```

## 皮肤与品牌素材

- **追加皮肤**：可将 Theme Studio 导出的 CSS 追加为 `public/skins/<key>.css`，补齐亮色和暗色令牌；在 `src/pactor/skin.ts` 的 `SKINS` 注册可选项，并同步 `app/layout.tsx` 首屏脚本的皮肤允许值，确保刷新后仍使用所选皮肤。默认皮肤保持 neutral，除非明确修改默认配置。
- **替换 logo**：直接替换 `public/logo.svg` 可保留现有引用；若改文件名或路径，同步更新 `src/server/yaml/sitemap.yaml` 中品牌区的 `logo`。
- **替换浏览器 icon**：替换 `app/icon.svg`，沿用 Next.js 文件约定，无需新增样式或脚本。

## 演示账号

render 后的账号与登录提示见 `src/server/accounts.ts` 和登录页；它们由 values JSON 中对应的演示账号键生成，仅用于本地模板冒烟。
