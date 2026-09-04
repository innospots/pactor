import { Registry } from '@pactor-app/core';
import type { ComponentRegistry } from '@pactor-app/runtime';

import { Alert } from './components/Alert/index.js';
import { Button } from './components/Button/index.js';
import { Card } from './components/Card/index.js';
import { Content } from './components/Content/index.js';
import { Flex } from './components/Flex/index.js';
import { Footer } from './components/Footer/index.js';
import { Form } from './components/Form/index.js';
import { Grid } from './components/Grid/index.js';
import { Header } from './components/Header/index.js';
import { Input } from './components/Input/index.js';
import { Layout } from './components/Layout/index.js';
import { Link } from './components/Link/index.js';
import { Menu } from './components/Menu/index.js';
import { Page } from './components/Page/index.js';
import { Select } from './components/Select/index.js';
import { Sider } from './components/Sider/index.js';
import { Statistic } from './components/Statistic/index.js';
import { Table } from './components/Table/index.js';
import { Tabs } from './components/Tabs/index.js';

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
