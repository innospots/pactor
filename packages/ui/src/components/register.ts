import { Registry } from '@pactor-app/core';
import type { ComponentRegistry } from '@pactor-app/runtime';

import { Accordion } from './components/Accordion/index.js';
import { Alert } from './components/Alert/index.js';
import { AlertDialog } from './components/AlertDialog/index.js';
import { AspectRatio } from './components/AspectRatio/index.js';
import { Avatar } from './components/Avatar/index.js';
import { Badge } from './components/Badge/index.js';
import { Breadcrumb } from './components/Breadcrumb/index.js';
import { Button } from './components/Button/index.js';
import { ButtonGroup } from './components/ButtonGroup/index.js';
import { Calendar } from './components/Calendar/index.js';
import { Card } from './components/Card/index.js';
import { Carousel } from './components/Carousel/index.js';
import { Checkbox } from './components/Checkbox/index.js';
import { Collapsible } from './components/Collapsible/index.js';
import { Combobox } from './components/Combobox/index.js';
import { Command } from './components/Command/index.js';
import { Chart } from './components/Chart/index.js';
import { Content } from './components/Content/index.js';
import { ContextMenu } from './components/ContextMenu/index.js';
import { DataTable } from './components/DataTable/index.js';
import { Dialog } from './components/Dialog/index.js';
import { Drawer } from './components/Drawer/index.js';
import { DropdownMenu } from './components/DropdownMenu/index.js';
import { Empty } from './components/Empty/index.js';
import { Field } from './components/Field/index.js';
import { Flex } from './components/Flex/index.js';
import { Footer } from './components/Footer/index.js';
import { Form } from './components/Form/index.js';
import { Grid } from './components/Grid/index.js';
import { Header } from './components/Header/index.js';
import { HoverCard } from './components/HoverCard/index.js';
import { Icon } from './components/Icon/index.js';
import { Input } from './components/Input/index.js';
import { InputGroup } from './components/InputGroup/index.js';
import { InputOTP } from './components/InputOTP/index.js';
import { Item } from './components/Item/index.js';
import { Kbd } from './components/Kbd/index.js';
import { Label } from './components/Label/index.js';
import { Layout } from './components/Layout/index.js';
import { Link } from './components/Link/index.js';
import { Menu } from './components/Menu/index.js';
import { Menubar } from './components/Menubar/index.js';
import { NavigationMenu } from './components/NavigationMenu/index.js';
import { Page } from './components/Page/index.js';
import { Pagination } from './components/Pagination/index.js';
import { Popover } from './components/Popover/index.js';
import { Progress } from './components/Progress/index.js';
import { RadioGroup } from './components/RadioGroup/index.js';
import { Resizable } from './components/Resizable/index.js';
import { ScrollArea } from './components/ScrollArea/index.js';
import { Select } from './components/Select/index.js';
import { Separator } from './components/Separator/index.js';
import { Sheet } from './components/Sheet/index.js';
import { Sidebar } from './components/Sidebar/index.js';
import { Sider } from './components/Sider/index.js';
import { Skeleton } from './components/Skeleton/index.js';
import { Slider } from './components/Slider/index.js';
import { Sonner } from './components/Sonner/index.js';
import { Spinner } from './components/Spinner/index.js';
import { Statistic } from './components/Statistic/index.js';
import { Switch } from './components/Switch/index.js';
import { Table } from './components/Table/index.js';
import { Tabs } from './components/Tabs/index.js';
import { Text } from './components/Text/index.js';
import { Textarea } from './components/Textarea/index.js';
import { Toggle } from './components/Toggle/index.js';
import { ToggleGroup } from './components/ToggleGroup/index.js';
import { Tooltip } from './components/Tooltip/index.js';
import { Typography } from './components/Typography/index.js';

/**
 * shadcn kit 组件表：DSL 类型名 → 组件适配器。
 * 类型名集合与 pactor-components 的 builtinComponents 完全一致；
 * 容器组件（Tabs / Table）经 `useRenderer().renderChildren` 渲染 DSL 子树。
 */
export const shadcnComponents = {
  Page,
  Grid,
  Flex,
  Card,
  Button,
  Alert,
  Statistic,
  Tabs,
  Table,
  Form,
  Input,
  Select,
  // Layout 需要原始 DSL 子树做方向推导（含 Sider 判定），以 withScope 注册
  Layout: { component: Layout, withScope: true },
  Header,
  Sider,
  Content,
  Footer,
  Menu,
  Link,
  Text,
  // 展示类扩展组件
  Badge,
  Avatar,
  Skeleton,
  Separator,
  Kbd,
  Spinner,
  Empty,
  AspectRatio,
  Progress,
  // 表单类扩展组件
  Textarea,
  Checkbox,
  RadioGroup,
  Switch,
  Slider,
  Label,
  Field,
  // 导航类扩展组件
  Breadcrumb,
  Pagination,
  Menubar,
  NavigationMenu,
  DropdownMenu,
  ContextMenu,
  // 反馈与弹层类扩展组件
  Dialog,
  AlertDialog,
  Drawer,
  Sheet,
  Popover,
  Sonner,
  Accordion,
  Collapsible,
  Tooltip,
  HoverCard,
  // 复合类扩展组件（第三批）
  Calendar,
  InputOTP,
  Combobox,
  Carousel,
  Command,
  Resizable,
  ScrollArea,
  Toggle,
  ToggleGroup,
  ButtonGroup,
  InputGroup,
  Item,
  Typography,
  // 页面级组合类扩展组件（第四批）
  Sidebar,
  DataTable,
  Chart,
  // 图标（lucide 白名单）
  Icon,
} as const;

/** 把全部 V1 内置组件（shadcn 实现）按 DSL 类型名注册到给定 ComponentRegistry */
export function registerShadcnComponents(registry: ComponentRegistry): void {
  for (const [type, component] of Object.entries(shadcnComponents)) {
    registry.register(type, component);
  }
}

/** 创建并返回注册了全部 V1 内置组件（shadcn 实现）的新 ComponentRegistry */
export function createShadcnComponentRegistry(): ComponentRegistry {
  const registry = new Registry<unknown>('ComponentRegistry');
  registerShadcnComponents(registry);
  return registry;
}
