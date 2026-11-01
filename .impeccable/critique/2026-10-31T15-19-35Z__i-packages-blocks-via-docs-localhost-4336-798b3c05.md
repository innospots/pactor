---
target: "packages/ui + packages/blocks（docs localhost:4336 渲染）"
total_score: 30
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
target_identity: "file:/Users/Zhuanz/Documents/workspace/pactor/packages/ui+packages/blocks via docs localhost:4336"
timestamp: 2026-10-31T15-19-35Z
slug: i-packages-blocks-via-docs-localhost-4336-798b3c05
---
# Impeccable Critique — Pactor UI & Blocks（packages/ui + packages/blocks）

Method: dual-agent (A: agent-2 设计评审 · B: agent-3 检测器 + 浏览器证据)
目标：packages/ui（约 100 个 DSL 适配器组件）+ packages/blocks（业务积木），渲染面 http://localhost:4336 文档站（亮/暗双主题，14 页面浏览器实测 + 源码核对）

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | loading/Skeleton/Progress 齐备；表单提交失败后焦点不动、无引导 |
| 2 | Match System / Real World | 4 | antd 语义无缝迁移，中文文案地道，错误文案走 i18n |
| 3 | User Control and Freedom | 2 | FormCardList 删除一点即删整张卡（含已填数据），无确认无撤销 |
| 4 | Consistency and Standards | 3 | variant 命名一致；阴影三套机制并行；FormCardList 内两套 label 机制 |
| 5 | Error Prevention | 3 | required 星号+提交拦截有效；破坏性操作无护栏 |
| 6 | Recognition Rather Than Recall | 3 | link 与 text 变体静止态几乎不可区分，可发现性弱 |
| 7 | Flexibility and Efficiency | 3 | 双层皮肤令牌体系强；文档无交互式 props 调试台 |
| 8 | Aesthetic and Minimalist Design | 3 | 扁平克制、暗色分层漂亮；Empty 过骨感、Hero 装饰层失效 |
| 9 | Error Recovery | 2 | 校验错误仅红字：无 aria-invalid、无 role=alert、边框不变红、焦点不动 |
| 10 | Help and Documentation | 4 | 「何时用/何时不用/变体/API/Design Token」五段式是文档标杆 |
| Total | | 30/40 | Good（75%） |

## Design Specificity Verdict

LLM 评估：「刻意的 shadcn 基线」占主体且可信——DSL 契约映射、组件级皮肤令牌双层回退、暗色 Panel/Paper 半阶分层是真差异化。但三处不是基线选择而是执行漏洞：① Flat-By-Default Rule 只在 Card 落实，10 个静止态控件仍带未令牌化 shadow-xs，Login 硬编码 shadow-xl；② 阴影体系三套机制并行（--card-shadow / shadow-xs / shadow-xl），换肤者无法一处调深度；③ HeroSection 签名装饰层因 hsl(var(--primary)) 与 OKLCH 令牌约定错配而 100% 不渲染、无声失败。源码 grep 确认 ui/blocks 零硬编码颜色字面值（唯一例外恰是坏了的 Hero 装饰层），Skin Authority Rule 在颜色维度执行近乎完美。

确定性扫描：CLI 检测器 1 条 advisory（ColorPicker/index.tsx:451 off-ramp 10px 字级）；浏览器 overlay 4 页共 212 条，归属过滤后落在组件库 demo 的真实信号仅 nested-cards ×3（/components/blocks/form-card-list 渲染区卡片嵌套卡片），其余命中文档站皮肤（#98a2b3 等 docs 调色板），straggler 4 条为 CJK 排版误报。检测器抓不到的 P0（Hero 静默失效、表单语义缺失）由 LLM 评审捕获；评审标的焦点环/输入框边框低对比由检测器像素回读给出实测佐证。

对比度实测（canvas 像素回读，WCAG 公式）：primary 按钮亮 17.18:1 / 暗 14.23:1 ✅；输入框文字 19.8:1 / 17.18:1 ✅；placeholder 4.74:1 / 6.94:1 ✅；muted 文字 ≈4.74:1 / ≈6.94:1 ✅；**输入框边框 vs 背景 亮 1.26:1 / 暗 1.58:1 ❌（非文字 UI 阈值 3:1）**；disabled 按钮 opacity-50 合成后 1.93:1 / 3.30:1（WCAG 豁免 inactive，记观察项）；焦点环 ring/50 混合后约 1.4:1（A 实测，低于焦点指示器 3:1 期望）。

## Overall Impression

颜色维度的令牌纪律是全库最强资产（零硬编码颜色、暗色零撞色、双层回退契约真实执行），文档「何时不用」段落是组件库文档的标杆。但一致性目前靠约定而非机制维持，约定已在阴影（三套机制）与表单错误（无程序化语义）两条线上破窗；HeroSection 装饰层静默死亡说明「有性格的元素」恰恰从未被验证过渲染结果。最大机会：把表单校验从「渲染一行红字」升级为「一次有焦点、有播报、有字段状态的事件」，这是可用性与可达性的双修复。

## What's Working

1. 暗色主题色调分层是真功夫：--card 0.205 vs --background 0.145 半阶差在无阴影下给出清晰层级，Alert/Select 弹层/Dialog 暗色全部正确适配。
2. 组件级皮肤令牌双层回退（--switch-track-checked → var(--primary)）真实执行：radio/slider/switch/calendar/pagination 全部守约，源码零硬编码颜色。
3. 文档五段式结构与「何时不用」反向指引，直接降低 DSL 作者误用率。

## Priority Issues

1. [P0] HeroSection 装饰层静默失效：mesh.tsx:7-14 用旧 shadcn HSL 三通道约定 hsl(var(--primary))/hsl(var(--border))，pactor 令牌是完整 OKLCH 值，hsl() 收非法参数整条 background-image 作废，实测 computed 为 none。Why：光斑+点阵是 Hero 唯一视觉性格来源，无声失败会让皮肤作者怀疑令牌体系坏了。Fix：改 color-mix(in oklch, var(--primary) 18%, transparent) 直接消费颜色值。建议：$impeccable harden
2. [P0] 表单校验错误态无程序化语义：form-item.tsx:78-82 仅渲染红字 div；Input 无 aria-required/aria-invalid/aria-describedby；Form/index.tsx:142-144 校验失败焦点不动。实测弹层点保存，屏幕阅读器零播报。Why：可用性+可达性双不及格，Sam 完全失明。Fix：① 错误容器 role="alert" + 稳定 id；② 控件 aria-invalid/aria-describedby/aria-required；③ aria-invalid:border-destructive 边框变红；④ 失败后 focus 首个错误控件。建议：$impeccable harden
3. [P1] Flat-By-Default Rule 破窗：ui/{input,textarea,select,combobox,checkbox,radio-group,switch,input-group,input-otp,menubar}.tsx 含未令牌化 shadow-xs；Login/index.tsx:397,476,496 硬编码 shadow-xl。Why：文档承诺与实现漂移，换肤者无法统一调深度。Fix：静止态控件移除 shadow-xs；Login float 变体改经 --card-shadow 或新增 --login-* 组件级令牌回退。建议：$impeccable distill
4. [P1] FormCardList 删除无护栏 + 硬编码英文 aria-label：index.tsx:190-201 aria-label="delete-item"（全库唯一非 i18n 文案），点击即删整张卡。Why：误点丢全部已填字段；SR 用户听到的文案既非中文也不知删第几项。Fix：aria-label 走 i18n 带序号；可选 confirmRemove prop 或二次确认。建议：$impeccable harden
5. [P2] 非文字指示器对比度不足（LLM+检测器双向印证）：输入框边框亮 1.26:1 / 暗 1.58:1（阈值 3:1）；焦点环 ring/50 约 1.4:1。Why：Sam 键盘导航反复丢焦点；浅色皮肤下输入框边界消失。Fix：--input 与 --ring 默认值加深（如亮 0.922→0.85、ring 0.708→0.55 或 ring 不透明度提至 60-70%），单令牌修复、皮肤可覆盖。建议：$impeccable audit
6. [P2] ColorPicker 通道标签 off-ramp 字级（检测器）：index.tsx:451 text-[10px]。Fix：改 text-xs 或纳入字级阶梯。

## Persona Red Flags

Alex（换肤/调令牌的 power user）：改 --primary 后 Login 装饰与气泡色跟随但 Hero 光斑纹丝不动（P0-1），会怀疑令牌体系有 bug；想统一调深度发现四套机制（--card-shadow / --shadow-color / shadow-xs 谁都不看 / shadow-xl 写死）；暗色 sidebar-primary 刻意蓝紫覆盖与「灰阶=全部结构色」心智模型打架（DESIGN.md 有声明但需知晓）。

Sam（accessibility）：表单失败完全静默（无 aria-invalid/aria-describedby/role=alert/焦点不动）；必填星号 aria-hidden 但控件无 aria-required；Dialog 关闭按钮 sr-only 硬编码英文「Close」（ui/dialog.tsx:84）；焦点环 1.4:1 键盘导航丢焦点；输入框边框 1.26:1 低视力下边界不可辨。

Riley（stress tester）：EntityCardList 网格 repeat(${columns}, minmax(0,1fr)) 无响应式断点，320px 视口三列溢出；禁用态按钮 opacity-50 叠 hairline 边框亮色下几乎隐形，极端浅色皮肤下 disabled/loading 区分度塌陷；html 手动设 data-pactor-theme 后 docs 外壳不跟随（docs 站问题，暴露三态切换缺跨层契约）。

## Minor Observations

- link 变体静止态与 text 变体几乎不可区分（同为墨水色文字，仅 hover 下划线），可发现性弱
- Empty 无图标/插画插槽，与 antd Empty 心智预期有落差；空态是全库最贫瘠组件却最需要安抚
- Table 表头与数据行字重对比不足；分页只有「1」无总数语境
- RadioGroup/Checkbox 卡片式选项徽标贴右缘像游离元素
- FormCardList fields 模式 label 裸 span 无 htmlFor，与 itemForm 模式 FieldShell 不一致
- FormModal 默认 sm:max-w-lg 对两列横向布局表单偏窄
- Login 5 种布局变体文档页签只露出 3 个，第 4、5 形态认知成本转嫁给翻页
- Button variant×danger×size 组合矩阵对 DSL 作者是 >4 选项决策点，文档宜给「90% 场景默认路径」
- 文档站自身：SideNavBar TabsTrigger 非 button（Base UI 警告）+ SSR 水合 mismatch（docs 侧问题）

## Questions to Consider

1. 「刻意中性」的边界在哪？link 与 text 静止态不可区分、Empty 贫瘠到读作「坏了」时，中性已侵蚀功能可达性——是否该为 link/Empty 这类「功能性强调」开独立语义通道（如 --link 令牌、Empty icon 槽）？
2. 设计文档与代码漂移时谁是权威？Flat-By-Default 已破窗，删文档这句话还是把阴影修复列为工程任务，必须二选一。
3. 校验失败是「一次事件」还是「一段文本」？当作事件会自然衍生摘要条、错误计数、首个错误定位；FormCardList 10 张卡各 3 必填时文本方案还成立吗？
