// 注册入口
export {
  createShadcnComponentRegistry,
  registerShadcnComponents,
  shadcnComponents,
} from './register.js';

// 展示与布局组件
export { Page } from './components/Page/index.js';
export type { PageProps } from './components/Page/index.js';
export { Grid } from './components/Grid/index.js';
export type { GridProps } from './components/Grid/index.js';
export { Flex } from './components/Flex/index.js';
export type { FlexProps } from './components/Flex/index.js';
export { Card } from './components/Card/index.js';
export type { CardProps } from './components/Card/index.js';
export { Button } from './components/Button/index.js';
export type {
  ButtonProps,
  ButtonSize,
  ButtonVariant,
} from './components/Button/index.js';
export { Alert } from './components/Alert/index.js';
export type { AlertProps, AlertVariant } from './components/Alert/index.js';
export { Statistic } from './components/Statistic/index.js';
export type { StatisticProps } from './components/Statistic/index.js';
export { Text } from './components/Text/index.js';
export type { TextProps, TextType } from './components/Text/index.js';
export { Tabs } from './components/Tabs/index.js';
export type { TabItem, TabsProps } from './components/Tabs/index.js';

// 布局组件（页面级自由组合，见 spec: layout-components）
export { Layout } from './components/Layout/index.js';
export type { LayoutProps } from './components/Layout/index.js';
export { Header } from './components/Header/index.js';
export type { HeaderProps } from './components/Header/index.js';
export { Sider } from './components/Sider/index.js';
export type { SiderProps } from './components/Sider/index.js';
export { Content } from './components/Content/index.js';
export type { ContentProps } from './components/Content/index.js';
export { Footer } from './components/Footer/index.js';
export type { FooterProps } from './components/Footer/index.js';
export { Menu } from './components/Menu/index.js';
export type { MenuItem, MenuProps } from './components/Menu/index.js';
export { Link } from './components/Link/index.js';
export type { LinkProps } from './components/Link/index.js';

// 表单组件
export { Form } from './components/Form/index.js';
export type { FormProps } from './components/Form/index.js';
export { useFormContext } from './components/Form/context.js';
export type { FormContextValue } from './components/Form/context.js';
export { Input } from './components/Input/index.js';
export type { FieldRule, InputProps } from './components/Input/index.js';
export { Select } from './components/Select/index.js';
export type { SelectOption, SelectProps } from './components/Select/index.js';

// 数据组件
export { Table } from './components/Table/index.js';
export type {
  TableColumn,
  TablePagination,
  TablePaginationInfo,
  TableProps,
} from './components/Table/index.js';
