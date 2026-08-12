# Tasks: add-input-type-prop

## 1. antd 实现

- [x] 1.1 `packages/ui-antd` InputProps 新增 `type?: 'text' | 'password'`，Form 内外渲染路径在 `type: 'password'` 时使用 `Input.Password`
- [x] 1.2 补 antd 侧测试：缺省明文、Form 内 password 掩码、独立 password 掩码且 onChange 传 string

## 2. Radix 实现

- [x] 2.1 `packages/ui-radix` Input 透传 `type` 到 `<input>`（Form 内外一致），缺省 `text`
- [x] 2.2 补 Radix 侧测试：Form 内 password 渲染 `type="password"`、缺省 text 行为一致

## 3. 验收

- [x] 3.1 相关包 `pnpm test` 与 `pnpm typecheck` 通过
