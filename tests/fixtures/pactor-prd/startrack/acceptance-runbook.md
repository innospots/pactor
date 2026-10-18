# 星轨项目台验收 Runbook

本文件只供验收操作者使用。真实生成阶段的新代理只能获得 `README.md`、`pages/*.md` 和空目标目录；不得提供本文件、`expected-project.json`、`mock-server.mjs`、静态检查器或任何黄金 YAML。生成结果不得手工补丁后再验收。

## 1. 准备与固定变量

在包含 `skills/`、`tests/` 的 Pactor 仓库根目录开启一个验收 shell：

```bash
export REPO="$PWD"
export FIXTURE="$REPO/tests/fixtures/pactor-prd/startrack"
export PROJECT="/absolute/path/to/generated-startrack-project"
export MOCK_ORIGIN="http://127.0.0.1:19011"
export APP_ORIGIN="http://127.0.0.1:9011"
```

确认 `$PROJECT` 是最后一次从空目录生成、未经手工补丁的项目。每轮完整验收都重新执行以下准备，不复用上一轮内存数据：

```bash
node "$FIXTURE/mock-server.mjs"
```

另开验收 shell 并设置同样变量，然后：

```bash
curl -sS -X POST "$MOCK_ORIGIN/__mock/reset"
curl -sS "$MOCK_ORIGIN/__mock/mode"
# 预期第二条返回 {"mode":"normal"}；reset 总是恢复两条初始项目。

pnpm -C "$PROJECT" install
NEXT_PUBLIC_API_BASE_URL="$MOCK_ORIGIN" pnpm -C "$PROJECT" dev
```

dev server 固定为 9011。若修改 YAML 或 `next.config.js`，重启 dev server；仅切换 mock 模式不需要重启。验收结束关闭两个服务器进程，并确认 19011/9011 不再监听。

## 2. 工程与静态门禁

按顺序记录命令、退出码和完整失败摘要：

```bash
node "$REPO/skills/scripts/prd-template.mjs" check "$PROJECT" --rendered
node "$REPO/tests/scripts/check-prd-project.mjs" "$PROJECT" \
  --expected "$FIXTURE/expected-project.json"
pnpm -C "$PROJECT" build
pnpm -C "$PROJECT" exec tsc --noEmit
pnpm -C "$PROJECT" lint
```

对生成清单中的四个实际页面文件逐个执行 `pnpm -C "$PROJECT" exec pactor validate <page.yaml>`；不要用 sitemap 或参考页代替。核对 `docs/prd/ui-plan.md` 有且仅有 login/dashboard/project-list/project-detail 对应的完整计划行，并检查实现与计划一致。

静态检查器通过只表示结构、依赖解析和残留规则通过；它不判断组件 props 语义、功能或美观，不能替代后续浏览器与目检。

## 3. Mock 控制面与确定性数据

切换模式（四值逐字使用）：

```bash
curl -sS -X POST "$MOCK_ORIGIN/__mock/mode" \
  -H 'content-type: application/json' \
  -d '{"mode":"normal"}'
```

| 模式 | 固定行为 |
| --- | --- |
| `normal` | dashboard、查询、详情、保存正常 |
| `list-error` | 仅 GET `/api/d/projects` 持续返回 500 |
| `detail-error` | 仅 GET `/api/d/projects/:id` 持续返回 500 |
| `save-error` | 仅 POST `/api/d/ops/project-save` 持续返回 500，且不修改数据 |

模式持续生效；恢复 `normal` 后在原页面点击重试/保存。每个负向用例开始前执行 `POST /__mock/reset`，再切到目标模式，避免上一个用例的新建/编辑影响数量与预填值。

可用以下只读/数据面命令核对上游，不代替浏览器操作：

```bash
curl -sS --get "$MOCK_ORIGIN/api/d/projects" \
  --data-urlencode 'keyword=atlas' --data-urlencode 'status=COMPLETED'
curl -sS "$MOCK_ORIGIN/api/d/projects/prj-aurora"
curl -sS "$MOCK_ORIGIN/api/d/dashboard"
```

列表过滤应只返回 `prj-atlas`；详情应为极光移动端；dashboard 初始统计为 total=2、active=1、completed=1。

## 4. 正常路径（独立网络与控制台记录）

先 `POST /__mock/reset`，保持 `normal`。整段操作期间，除明确填空的客户端校验外，每个页面数据源与保存请求都应为预期 2xx；不得出现意外 401/404/500。正常路径单独记录 console error/warning，目标为 0，不用第 5 节的预期失败冲淡或解释本节结果。

### N01 登录与工作台

1. 打开 `/login`，确认 split + card、品牌“星轨项目台”、账号提示和两个必填字段。
2. 空表单提交：用户名/密码就地报错，Network 无登录 POST。
3. 使用 `startrack-admin / Orbit#2026` 登录，预期进入 `/`。
4. 工作台显示项目总数 2、进行中 1、已完成 1；最近项目依次有极光移动端、星图数据迁移。数据周期为 2026-10-01 — 2026-10-31。
5. 点击极光移动端所在行“查看”，预期进入 `/projects/prj-aurora`，再点击“返回项目列表”进入 `/projects`。此步同时证明菜单之外的 hidden 详情有真实入口。

### N02 查询、重置与空态

1. 项目列表初始显示两条；关键词输入 `极光`，状态保持全部，点击查询：只显示 `prj-aurora`，请求同时带 `keyword=极光&status=all`。
2. 关键词改为 `atlas`，状态选已完成，点击查询：只显示 `prj-atlas`，证明 code 不区分大小写和双条件过滤。
3. 点击重置：控件变为关键词空/状态全部，列表恢复两条，并产生一次对应请求。
4. 再查询关键词 `不存在的项目`：出现“没有找到匹配的项目”和“清除筛选”，不出现表格错误。
5. 点击清除筛选：控件和请求状态都复位，列表恢复两条。

### N03 新建、编辑与详情

1. 点击“+ 新建项目”，直接保存：必填错误就地出现，Network 无 project-save POST。
2. 在同一抽屉填写：名称 `验收新项目`、编码 `ACCEPTANCE`、状态进行中、负责人 `林澈`、进度 `25`、截止日期 `2026-12-01`、说明 `正常路径新建验证。`。
3. 保存：仅当拆包结果 `{ok:true}` 时提示成功、关闭抽屉并刷新；列表总数变为 3，新记录 id 应为 `prj-3`。
4. 打开极光移动端的“编辑”：确认名称/编码/状态/负责人/进度/日期/说明均由 `prj-aurora` 详情预填，编码 disabled；不修改字段直接保存，预期成功且仍只有 3 条。
5. 打开 `/projects/prj-3`：详情为验收新项目；点击“编辑项目”，把进度改为 `30` 并保存。抽屉关闭、详情刷新为 30%；返回列表后对应行也是 30%。
6. 再次进入 `/`，预期统计 total=3、active=2、completed=1，最近项目包含验收新项目。

## 5. 负向网络（单独记录，不混入正常路径）

以下 401/404/500 都是主动注入的预期结果。每个用例单独记录“注入响应、页面反馈、数据/输入是否保留、恢复后请求和 UI”，不要把这些响应算进第 4 节，也不要因为接口已按预期失败就省略 UI 断言。浏览器可能为主动 500 输出 failed-request 控制台日志；将其列在负向表中，与应用自身 exception 分开说明。

### E01 错误登录（预期 401）

1. reset 为 normal，退出并打开 `/login`。
2. 使用 `startrack-admin / wrong-password` 登录。
3. 预期登录 POST 为 401，显示“用户名或密码错误”，停留 `/login`，用户名仍保留；随后用正确密码登录恢复。

### E02 列表失败与重试（预期 500）

1. reset 后切到 `list-error`，以已登录会话打开 `/projects`。
2. 预期列表 GET 为 500；显示“项目列表加载失败”和“重试”，不显示 Empty。
3. 不刷新页面，切回 `normal`，点击“重试”。预期重新发起同条件 GET 并返回 200，显示两条初始项目。

### E03 详情失败与重试（预期 500）

1. reset 后切到 `detail-error`，打开 `/projects/prj-aurora`。
2. 预期详情 GET 为 500；显示“项目详情加载失败”和“重试”，返回操作仍可用，不显示旧详情或 Empty。
3. 不刷新页面，切回 `normal`，点击“重试”。预期同 id 请求返回 200，显示极光移动端完整资料。

### E04 保存失败不丢输入（预期 500，随后恢复 200）

1. reset 后切到 `save-error`，打开 `/projects` 并进入极光移动端编辑抽屉。
2. 把负责人改为 `待重试负责人`、进度改为 `77`，其他预填值保持不变，点击保存。
3. 预期 project-save POST 为 500；出现保存失败反馈，抽屉不关闭，负责人仍为 `待重试负责人`、进度仍为 `77`，名称/日期/说明等也未被旧值覆盖；列表不得提前显示这次修改。
4. 不刷新页面、不关闭抽屉，切回 `normal`，再次点击同一个保存。预期成功拆包 `{ok:true}`、抽屉关闭并刷新列表，极光移动端显示负责人 `待重试负责人`、进度 `77%`。

### E05 未知详情（预期 404）

reset 为 normal 后访问 `/projects/not-found`。预期详情 GET 为 404，显示“项目不存在或已删除”和“返回项目列表”；点击返回可到达 `/projects`，无上一项目缓存残留。

## 6. 视觉、键盘与证据矩阵

对 login/dashboard/project-list/project-detail 逐页执行：

1. 视口 `1440×900` 与 `390×844`，分别检查亮色和暗色；登录、正常列表、详情、抽屉均保留截图。列表额外保留 empty 和 list-error，详情保留 detail-error，保存保留 save-error 且抽屉仍打开的截图。
2. 每张截图检查 PRD 区域顺序、标题与按钮、信息层级、Field 间距、label/error 遮挡、组件选择、对比度和状态后的下一步操作。元素存在或自动截图不等于目检通过。
3. 两个视口都执行 `document.documentElement.scrollWidth <= document.documentElement.clientWidth`；表格只允许自身区域滚动。抽屉/Select 等 body 浮层也要检查窄屏和暗色。
4. 实际用键盘覆盖登录提交、搜索、抽屉字段、取消/保存和重试：Tab 顺序合理，focus 环可见，Enter/Space 可触发按钮，Escape 关闭抽屉后焦点回到触发按钮；保存失败时 Escape 不得被当作恢复手段。
5. 证据按 `docs/prd/ui-evidence/<page-id>/<state>-<desktop|narrow>-<light|dark>.png` 保存；报告引用实际路径并列明未覆盖范围。原产品对比记为“不适用：未提供；已按 PRD + UI 计划 + 模板目检”。

## 7. 结果记录模板

正常与负向网络至少分两表，不合并成笼统“通过”：

| 正常用例 | 路由/交互 | 预期数据 | 实际网络（应全为预期 2xx） | 正常 console | 结论/证据 |
| --- | --- | --- | --- | --- | --- |
| N01–N03 | 逐项填写 | 逐项填写 | 逐项填写 | error=0 / warning=0 |  |

| 负向用例 | 注入模式与预期响应 | 页面反馈 | 重试/输入保留 | 恢复后响应 | 负向 console | 结论/证据 |
| --- | --- | --- | --- | --- | --- | --- |
| E01–E05 | 逐项填写 | 逐项填写 | 逐项填写 | 逐项填写 | 单独归因 |  |

最终报告还需列出 install/build/tsc/lint/逐页 validate/静态检查命令结果、4/4 路由、残留检查、截图目检、所有未覆盖项。结论只适用于本次 fixture、当前依赖和实际执行矩阵，不声称所有 PRD、后端或设备绝对无 BUG。
