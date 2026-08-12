# Tasks: add-form-linkage

## 1. runtime 桥接与动作

- [x] 1.1 `pactor-runtime`：RuntimeContext 增加 `forms` 注册表（FormHandle `{ setValues(values) }`），createRuntimeContext 初始化，index 导出类型
- [x] 1.2 内置动作 `form.setValues`（params.form 缺省 default；未注册受控失败）+ 单测

## 2. 双 kit Form 接入

- [x] 2.1 antd Form：`name` prop（缺省 default），挂载注册 `setFieldsValue` 句柄、卸载注销 + 测试
- [x] 2.2 Radix Form：上下文补 `setValues(partial)`（不触发 onValuesChange），同样注册/注销 + 测试

## 3. 示例与文档

- [x] 3.1 客户 mock 增加 region/city 字段，编辑抽屉加级联演示（region 变化 → city 选项更新 + 清空 city），双示例 DSL 同步
- [x] 3.2 docs DSL 参考补 `form.setValues`、onValuesChange 载荷说明与级联示例

## 4. 验收

- [x] 4.1 相关包测试 + typecheck 通过，重建受影响包
- [x] 4.2 浏览器验证双 kit 示例的级联行为
