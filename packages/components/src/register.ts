import { Registry } from 'pactor-core';
import type { ComponentRegistry } from 'pactor-runtime';

import { Alert } from './components/Alert/index.js';
import { Button } from './components/Button/index.js';
import { Card } from './components/Card/index.js';
import { Flex } from './components/Flex/index.js';
import { Form } from './components/Form/index.js';
import { Grid } from './components/Grid/index.js';
import { Input } from './components/Input/index.js';
import { Page } from './components/Page/index.js';
import { Select } from './components/Select/index.js';
import { Statistic } from './components/Statistic/index.js';
import { Table } from './components/Table/index.js';
import { Tabs } from './components/Tabs/index.js';

/**
 * 内置组件表：DSL 类型名 → 组件适配器。
 * 容器组件（Tabs / Table）经 `useRenderer().renderChildren` 渲染 DSL 子树，
 * 无需 withScope 包装。
 */
export const builtinComponents = {
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
} as const;

/** 把全部 V1 内置组件按 DSL 类型名注册到给定 ComponentRegistry */
export function registerBuiltinComponents(registry: ComponentRegistry): void {
  for (const [type, component] of Object.entries(builtinComponents)) {
    registry.register(type, component);
  }
}

/** 创建并返回注册了全部 V1 内置组件的新 ComponentRegistry */
export function createBuiltinComponentRegistry(): ComponentRegistry {
  const registry = new Registry<unknown>('ComponentRegistry');
  registerBuiltinComponents(registry);
  return registry;
}
