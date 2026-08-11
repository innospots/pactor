# Tasks: polish-example-admin

## 1. 皮肤微调（packages/ui-radix/styles.css，class 名不变）

- [x] 1.1 Statistic 数值/标题/suffix 层次（28px/700、13px muted）
- [x] 1.2 Page 标题与内容区间距节奏；Card hover 质感；Table 密度微调

## 2. 示例页面重设计（examples/admin）

- [x] 2.1 dashboard：欢迎横幅 + 4 指标卡 + 双栏（公告/待办 Tabs + 快捷操作 navigate 按钮组）
- [x] 2.2 customer-list：说明区 + 查询区 + 表格区层次
- [x] 2.3 customer-edit：返回 + 表单卡层次
- [x] 2.4 src/theme.css：token 覆盖 + 结构性美化（横幅渐变、指标卡强调条），注释指向主题指南

## 3. 验证与文档

- [x] 3.1 构建通过、既有测试零回归
- [x] 3.2 playwright 截图评审（light + dark），迭代至主代理认可
- [x] 3.3 主题指南提及 examples/admin/theme.css 为参考实现
