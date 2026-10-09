/**
 * 组件运行态预览注册表（业务批）：packages/ui business 子目录组件。
 * CardList / EntityCard / Login 已从包入口导出并在 register.ts 注册 DSL；
 * Login 内部经 Form / Link 依赖 Renderer 上下文（useRenderer），与
 * basic-a 的 Layout / Tabs 同类，经 DslPreview 以真实 DSL 渲染。
 * 其余 business 组件（ExpressionEditor / FieldCondition / RuleConfig /
 * RuleExpression / ScriptEditor / SearchableSelect）本期未从包入口导出，
 * 详情页经 previewNote 呈现静态结构说明。
 */
import { useState, type ReactElement } from 'react';
import type { DslNode } from '@pactor-app/core';
import { CardList, EntityCard, type CardListItem } from '@pactor-app/ui/components';
import DslPreview from './DslPreview';

const columnStyle = { display: 'flex', flexDirection: 'column', gap: 12 } as const;

const ENTITY_ACTIONS = [
  { text: '编辑', key: 'edit' },
  { text: '删除', key: 'remove', variant: 'text' as const, danger: true },
];

function EntityCardPreview() {
  const [lastAction, setLastAction] = useState('');
  return (
    <div style={columnStyle}>
      <EntityCard
        icon="cube"
        title="客户实体"
        subtitle="cust_profile"
        tags={[{ text: '启用', color: 'green' }]}
        description="客户画像主实体，含基础属性与扩展属性，用于导入决策与规则配置。"
        meta="创建于 2026-09-01"
        actions={ENTITY_ACTIONS}
        hoverable
        onClick={() => setLastAction('整卡点击')}
        onAction={(e) => setLastAction(`操作：${e.key}`)}
      />
      <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
        事件回显：{lastAction || '点击卡片或操作按钮'}
      </span>
    </div>
  );
}

const CARD_ITEMS: CardListItem[] = [
  {
    icon: 'code',
    title: '规则引擎',
    subtitle: 'v1.2.0',
    tags: [{ text: '已发布', color: 'green' }],
    description: '可视化规则配置与评分引擎。',
    meta: '更新于 2 小时前',
    actions: [{ text: '配置', key: 'config' }],
  },
  {
    icon: 'database',
    title: '数据源管理',
    subtitle: 'v0.9.1',
    tags: [{ text: '灰度', color: 'orange' }],
    description: '数据源接入与字段元数据维护。',
    actions: [{ text: '配置', key: 'config' }],
  },
  {
    icon: 'workflow',
    title: '流程设计器',
    subtitle: 'v0.5.0',
    tags: [{ text: '开发中', color: 'blue' }],
    description: '通过节点和连线配置业务流程。',
    actions: [{ text: '配置', key: 'config' }],
  },
];

function CardListPreview() {
  const [lastEvent, setLastEvent] = useState('');
  return (
    <div style={columnStyle}>
      <CardList
        items={CARD_ITEMS}
        columns={3}
        createText="新建插件"
        showCount
        onItemClick={(e) => setLastEvent(`整卡点击：${e.item.title}（index ${e.index}）`)}
        onItemAction={(e) => setLastEvent(`操作：${e.key}（${e.item.title}）`)}
        onCreateClick={() => setLastEvent('新建占位卡点击')}
      />
      <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
        事件回显：{lastEvent || '点击卡片、操作按钮或新建占位卡'}
      </span>
    </div>
  );
}

const LOGIN_NODE: DslNode = {
  type: 'Login',
  props: {
    layout: 'split',
    brand: {
      name: 'Pactor',
      title: '资产化开发平台',
      description: '组件 / 模板 / 规范一站式管理',
    },
    title: '欢迎回来',
    subtitle: '使用企业账号登录（预览内任意输入即可提交）',
    registerLink: { text: '立即注册' },
    forgotLink: { text: '忘记密码' },
    footer: '© 2026 Pactor',
  },
};

function LoginPreview() {
  return (
    <div style={{ height: 440, overflow: 'auto', borderRadius: 8, border: '1px solid var(--border)' }}>
      <DslPreview node={LOGIN_NODE} />
    </div>
  );
}

export const PREVIEWS_BUSINESS: Record<string, () => ReactElement> = {
  'component.entity-card': EntityCardPreview,
  'component.card-list': CardListPreview,
  'component.login': LoginPreview,
};
