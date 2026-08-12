---
title: 事件与表单联动
description: 在 YAML 中配置组件事件（events / ActionConfig / event 载荷），以及表单字段级联、选项联动、多表单寻址的完整写法
---

本页详细说明两件事：DSL 中**事件如何配置**（`events` 映射、动作参数、事件载荷），以及**表单联动**（选项联动、字段值联动、多表单寻址）。所有示例均可在 `examples/admin`（Radix）与 `examples/admin-antd`（antd）中直接运行——同一份 DSL，双 UI kit 行为一致。

## 事件配置（events）

任何组件节点都可以声明 `events`：事件名 → **单个动作**或**动作数组**（数组按声明顺序串行执行，前一个失败不中断后续——需要中断语义时用 `sequence` 组合）。

```yaml
- type: Button
  props: { text: 查询, variant: primary }
  events:
    # 单个动作
    onClick:
      action: message
      params: { type: info, text: 已点击 }
```

```yaml
- type: Button
  props: { text: 保存, submit: true }
  events:
    # 动作数组：串行执行
    onClick:
      - action: setState
        params: { submitting: true }
      - action: reload
        params: { dataSource: customers }
```

### 动作配置（ActionConfig）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `action` | string（必填） | 动作名（Action Registry 注册名），目录见 [DSL 参考](/reference/dsl/#动作目录) |
| `id` | string | 命名动作：结果写入 `actions.<id>` 作用域，供后续动作引用 |
| `params` | object | 动作参数，值可含 `${...}` 表达式，**执行前求值** |
| `condition` | 表达式 | 条件为假时跳过该动作 |
| `permission` | PermissionConfig | 无权限时跳过该动作 |

```yaml
- id: saveResult                    # 命名动作
  action: service.call
  params:
    service: customer.update
    params:
      name: ${event.name}           # 表达式：执行前以求值后的值传入
  condition: ${state.dirty}         # state.dirty 为假则跳过
- action: if                        # 读取命名动作结果
  params:
    condition: ${actions.saveResult.id}   # 成功时为结果数据
    then: [{ action: message, params: { type: success, text: 已保存 } }]
    else: [{ action: message, params: { type: error, text: 保存失败 } }]
```

命名动作结果的两种形态：**成功 → 结果数据本身；失败 → `{ ok: false, error }`**。因此用结果里的业务字段（如 `actions.saveResult.id`）做真假判断即可覆盖成败分支。

### 事件载荷（event 作用域）

事件触发时，回调的第一个参数进入 `event` 局部作用域，经 `${event}` 或 `${event.<field>}` 引用：

| 组件事件 | `event` 内容 |
| --- | --- |
| Button `onClick` | 无（不携带载荷） |
| Input `onChange` | 输入的字符串（`${event}`） |
| Select `onChange` | 选中的 value（`${event}`） |
| Tabs `onChange` | 新激活的 key（`${event}`） |
| Table `onChange` | `{ current, pageSize, total }` |
| Form `onSubmit` | 表单 values（`${event.name}`） |
| Form `onValuesChange` | **变化字段单键对象** `{ <field>: <newValue> }`（`${event.region}`） |

两个容易误解的点：

- `onValuesChange` 的 `event` 不是完整表单值，只有变化的那个字段（Renderer 只捕获回调首参）。要拿全量值，在 `onSubmit` 里取，或读 `${form.<field>}`（提交后）。
- 行模板（Table 列 `cell`）里的事件额外拥有 `row` / `rowIndex` 局部作用域：`${row.id}`。

## 常用事件配方

### 查询表单（setState + reload）

```yaml
- type: Form
  props: { layout: inline }
  events:
    onSubmit:
      - action: setState
        params: { keyword: ${event.keyword} }
      - action: reload                  # 数据源 params 引用 state.keyword，自动按新值重新加载
        params: { dataSource: customers }
  children:
    - type: Input
      props: { name: keyword, placeholder: 客户名 / 负责人 }
    - type: Button
      props: { text: 查询, variant: primary, submit: true }
```

### 提交中 loading（state 驱动 Button.loading）

```yaml
state:
  submitting: false
body:
  type: Form
  events:
    onSubmit:
      - action: setState
        params: { submitting: true }
      - id: loginResult
        action: service.call
        params: { service: auth.login, params: { username: ${event.username}, password: ${event.password} } }
      - action: setState
        params: { submitting: false }
      - action: if
        params:
          condition: ${actions.loginResult.token}
          then: [{ action: app.reload, params: { to: / } }]
          else: [{ action: message, params: { type: error, text: 登录失败 } }]
  children:
    # ...字段略
    - type: Button
      props: { text: 登 录, variant: primary, submit: true, loading: ${state.submitting} }
```

### 确认后执行（confirm + if）

```yaml
events:
  onClick:
    - id: confirmed
      action: confirm
      params: { title: 删除确认, content: 删除后不可恢复 }
    - action: if
      params:
        condition: ${actions.confirmed}    # 确认 true / 取消 false
        then: [{ action: message, params: { type: success, text: 已删除 } }]
```

### 抽屉编辑（overlay.open 命名动作 + close payload）

`overlay.open` 会**等待弹层关闭**，其结果就是 `overlay.close` 携带的 payload：

```yaml
events:
  onClick:
    - id: editResult
      action: overlay.open
      params:
        overlay:
          type: drawer
          title: 编辑客户
          width: 420
          params: { id: ${row.id}, name: ${row.name} }   # 注入 overlay 作用域
          content:
            type: Form
            props: { name: edit }
            events:
              onSubmit:
                - id: updateResult
                  action: service.call
                  params:
                    service: customer.update
                    params: { id: ${params.id}, name: ${event.name} }
                - action: if
                  params:
                    condition: ${actions.updateResult.id}
                    then:
                      # 成功语义关闭：payload 成为 overlay.open 的结果
                      - action: overlay.close
                        params: { payload: { success: true } }
                    else:
                      - action: message
                        params: { type: error, text: 保存失败，请重试 }
            children: [...]
    # 抽屉以成功语义关闭后才刷新列表；点 X / 遮罩 / Escape 关闭为取消语义，不进入 then
    - action: if
      params:
        condition: ${actions.editResult.success}
        then:
          - action: reload
            params: { dataSource: customers }
          - action: message
            params: { type: success, text: 客户已更新 }
```

要点：overlay 内容的表达式在 **overlay 作用域**求值——`${params.x}` 取注入参数，`${parent.x}` 取父页面作用域快照，`${state.x}` / `${data.x}` 照常可用且**随 store 变化自动重渲染**（这是联动写法在抽屉里同样成立的前提）。

## 表单联动

按联动目标分三层，由浅到深：

### 1. 选项 / 禁用 / 显隐联动（纯 state 绑定）

字段的 `options`、`disabled` 和节点的 `when` 都可以绑 state，源字段变化时 `setState` 即可：

```yaml
state:
  cityOptions: []
body:
  type: Form
  children:
    - type: Select
      props:
        name: region
        label: 省份
        options: [{ label: 浙江, value: 浙江 }, { label: 江苏, value: 江苏 }]
      events:
        onChange:
          # event 为选中的新值；计算成员访问查映射表
          - action: setState
            params:
              cityOptions: ${state.cityMap[event]}
    - type: Select
      props:
        name: city
        label: 城市
        options: ${state.cityOptions}
        disabled: ${state.cityOptions.length === 0}   # 也可以联动禁用
```

### 2. 字段值联动（form.setValues）

选项变了但**旧值还残留在字段里**——这时需要 `form.setValues` 动作直接写字段值（不触发校验、不触发 `onValuesChange`，不会循环）：

```yaml
- type: Select
  props: { name: region, label: 省份, options: [...] }
  events:
    onChange:
      - action: form.setValues          # 先清空下级字段
        params:
          values: { city: '' }
      - action: setState                # 再更新下级选项
        params:
          cityOptions: ${state.cityMap[event]}
```

`form.setValues` 参数：

| 字段 | 说明 |
| --- | --- |
| `values`（必填） | 要写入的字段键值，值可含表达式 |
| `form` | 目标表单名，缺省 `default`；未注册时动作受控失败（不崩溃） |

### 3. 多表单寻址（Form 的 name prop）

Form 挂载时按 `name`（缺省 `default`）注册句柄。**同页存在多个表单时必须显式命名**，否则同名重复注册会抛错——典型场景：页面上的查询表单（default）+ 抽屉里的编辑表单：

```yaml
content:
  type: Form
  props:
    name: edit          # 抽屉表单显式命名
  events:
    onSubmit: [...]
  children:
    - type: Select
      props: { name: region, label: 省份, options: [...] }
      events:
        onChange:
          - action: form.setValues
            params:
              form: edit            # 明确指向抽屉表单
              values: { city: '' }
```

### 完整级联示例（打开时初始化）

级联字段带初始值时（编辑回填），下级选项需要在打开表单时就绪——在进入表单前按初始值先 `setState` 一次：

```yaml
# 行内"编辑"按钮
events:
  onClick:
    # 1. 按当前行的 region 初始化城市选项
    - action: setState
      params:
        cityOptions: ${state.cityMap[row.region]}
    # 2. 打开抽屉，行数据注入 params
    - id: editResult
      action: overlay.open
      params:
        overlay:
          type: drawer
          title: 编辑客户
          params: { region: ${row.region}, city: ${row.city} }
          content:
            type: Form
            props: { name: edit }
            children:
              - type: Select
                props:
                  name: region
                  label: 省份
                  value: ${params.region}          # 字段级初始值回填
                  options:
                    - { label: 浙江, value: 浙江 }
                    - { label: 江苏, value: 江苏 }
                    - { label: 广东, value: 广东 }
                events:
                  onChange:
                    - action: form.setValues
                      params: { form: edit, values: { city: '' } }
                    - action: setState
                      params: { cityOptions: ${state.cityMap[event]} }
              - type: Select
                props:
                  name: city
                  label: 城市（随省份联动）
                  value: ${params.city}
                  options: ${state.cityOptions}
```

可运行完整版见 `examples/admin/src/pages/customer-list.page.yaml`。

### 注意事项

- `form.setValues` 写入**不触发校验与 `onValuesChange`**——这是刻意设计，避免"A 联动 B、B 又联动 A"的死循环；需要连锁反应时在同一个事件里显式写多个动作。
- 校验在**提交时**统一进行：级联清空的必填字段会在提交时正常报"必填"错误。
- 表达式支持计算成员访问（`${state.cityMap[event]}`）与比较运算符（`${event === '浙江'}`），不支持三元表达式——分支逻辑用 `if` 动作。

## 相关参考

- [DSL 参考](/reference/dsl/)：动作目录、组件 props、作用域完整表
- [pactor-expression](/packages/expression/)：表达式语法细节（类型保留规则、白名单函数）
