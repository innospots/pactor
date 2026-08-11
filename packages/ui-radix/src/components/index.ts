// 注册入口
export {
  createRadixComponentRegistry,
  radixComponents,
  registerRadixComponents,
} from './register.js';

// 展示与布局组件
export { Page } from './components/Page/index.js';
export { Grid } from './components/Grid/index.js';
export { Flex } from './components/Flex/index.js';
export { Card } from './components/Card/index.js';
export { Button } from './components/Button/index.js';
export { Alert } from './components/Alert/index.js';
export { Statistic } from './components/Statistic/index.js';
export { Tabs } from './components/Tabs/index.js';

// 表单组件
export { Form } from './components/Form/index.js';
export { useFormContext } from './components/Form/context.js';
export type { FormContextValue } from './components/Form/context.js';
export { Input } from './components/Input/index.js';
export { Select } from './components/Select/index.js';

// 数据组件
export { Table } from './components/Table/index.js';

// props 契约类型：直接复用 pactor-ui-antd components 层（antd 版）的导出，保证双实现契约一致
export type {
  AlertProps,
  AlertVariant,
  ButtonProps,
  ButtonSize,
  ButtonVariant,
  CardProps,
  FieldRule,
  FlexProps,
  FormProps,
  GridProps,
  InputProps,
  PageProps,
  SelectOption,
  SelectProps,
  StatisticProps,
  TabItem,
  TableColumn,
  TablePagination,
  TablePaginationInfo,
  TableProps,
  TabsProps,
} from 'pactor-ui-antd/components';
