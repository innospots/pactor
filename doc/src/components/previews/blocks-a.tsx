/**
 * 组件运行态预览注册表（区块批）：@pactor-app/blocks 包组件。
 * 9 个组件均已从包入口导出并在 register.ts 注册 DSL；Login / SiteFooter
 * 内部经 Form / Link 依赖 Renderer 上下文（useRenderer），与 basic-a 的
 * Layout / Tabs 同类，经 DslPreview 以真实 DSL 渲染；其余组件为
 * 纯受控 React 组件，局部 state 受控。
 */
import { useState, type ReactElement } from 'react';
import type { DslNode } from '@pactor-app/core';
import {
  CardList,
  EntityCard,
  ExpressionEditor,
  FieldCondition,
  RuleConfig,
  RuleExpression,
  ScriptEditor,
  type CardListItem,
  type FieldConditionValue,
  type RuleConfigValue,
  type RuleExpressionValue,
} from '@pactor-app/blocks';
import DslPreview from './DslPreview';

const columnStyle = { display: 'flex', flexDirection: 'column', gap: 12 } as const;

const ENTITY_ACTIONS = [
  { text: '编辑', key: 'edit' },
  { text: '删除', key: 'remove', variant: 'text' as const, danger: true },
];

function EntityCardPreview() {
  return (
    <div style={columnStyle}>
      <EntityCard
        icon="cube"
        title="客户实体"
        subtitle="cust_profile"
        tags={[{ text: '启用', color: 'success' }]}
        description="客户画像主实体，含基础属性与扩展属性，用于导入决策与规则配置。"
        meta="创建于 2026-09-01"
        actions={ENTITY_ACTIONS}
        hoverable
      />
    </div>
  );
}

const CARD_ITEMS: CardListItem[] = [
  {
    icon: 'code',
    title: '规则引擎',
    subtitle: 'v1.2.0',
    tags: [{ text: '已发布', color: 'success' }],
    description: '可视化规则配置与评分引擎。',
    meta: '更新于 2 小时前',
    actions: [{ text: '配置', key: 'config' }],
  },
  {
    icon: 'database',
    title: '数据源管理',
    subtitle: 'v0.9.1',
    tags: [{ text: '灰度', color: 'warning' }],
    description: '数据源接入与字段元数据维护。',
    actions: [{ text: '配置', key: 'config' }],
  },
  {
    icon: 'workflow',
    title: '消息网关',
    subtitle: 'v0.5.0',
    tags: [{ text: '开发中', color: 'info' }],
    description: '通过节点和连线配置业务流程。',
    actions: [{ text: '配置', key: 'config' }],
  },
];

function CardListPreview() {
  return (
    <div style={columnStyle}>
      <CardList
        items={CARD_ITEMS}
        columns={3}
        createText="新建插件"
        showCount
      />
    </div>
  );
}

const LOGIN_BASE_PROPS = {
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
  // 预览框定高：经 --login-min-h 让登录页内容自适应容器（默认 100svh 撑满视口）
  style: { '--login-min-h': '100%' },
} as const;

// 5 种结构模式（layout）各一份 DSL，经左侧「Login」组子菜单 ?layout=<模式> 切换
const LOGIN_MODE_NODES: Record<string, DslNode> = {
  split: { type: 'Login', props: { ...LOGIN_BASE_PROPS, layout: 'split' } },
  centered: { type: 'Login', props: { ...LOGIN_BASE_PROPS, layout: 'centered' } },
  'brand-card': { type: 'Login', props: { ...LOGIN_BASE_PROPS, layout: 'brand-card' } },
  overlap: { type: 'Login', props: { ...LOGIN_BASE_PROPS, layout: 'overlap' } },
  backdrop: { type: 'Login', props: { ...LOGIN_BASE_PROPS, layout: 'backdrop' } },
};
const LOGIN_MODE_LABELS: Record<string, string> = {
  split: '分栏',
  centered: '居中',
  'brand-card': '品牌卡',
  overlap: '叠加',
  backdrop: '背景',
};

// 认证区插槽演示：内嵌 Tabs 切换「手机验证码 / 账号密码」两种登录方式，
// 插槽内表单字段与提交事件由 DSL 自行编排（预览内提交触发 message 反馈）
const LOGIN_TABS_NODE: DslNode = {
  type: 'Login',
  props: {
    layout: 'centered',
    authVariant: 'card',
    title: '登录你的设计账号',
    registerLink: { text: '立即注册' },
    footer: '© 2026 Pactor',
  },
  children: [
    {
      type: 'Tabs',
      props: {
        items: [
          {
            key: 'sms',
            label: '手机验证码登录',
            children: [
              {
                type: 'Form',
                props: { name: 'smsLogin', className: 'flex flex-col gap-4 pt-2' },
                children: [
                  {
                    type: 'Input',
                    props: { name: 'phone', placeholder: '请输入手机号' },
                  },
                  {
                    type: 'Input',
                    props: { name: 'code', placeholder: '请输入验证码' },
                  },
                  {
                    type: 'Button',
                    props: { submit: true, variant: 'primary', text: '登录' },
                  },
                ],
                events: {
                  onSubmit: {
                    action: 'message',
                    params: { text: '验证码登录提交：${event.phone}', messageType: 'success' },
                  },
                },
              },
            ],
          },
          {
            key: 'password',
            label: '账号密码登录',
            children: [
              {
                type: 'Form',
                props: { name: 'passwordLogin', className: 'flex flex-col gap-4 pt-2' },
                children: [
                  {
                    type: 'Input',
                    props: { name: 'username', placeholder: '请输入账号' },
                  },
                  {
                    type: 'Input',
                    props: { name: 'password', type: 'password', placeholder: '请输入密码' },
                  },
                  {
                    type: 'Button',
                    props: { submit: true, variant: 'primary', text: '登录' },
                  },
                ],
                events: {
                  onSubmit: {
                    action: 'message',
                    params: { text: '账号密码登录提交：${event.username}', messageType: 'success' },
                  },
                },
              },
            ],
          },
        ],
      },
    },
  ],
};

/** 当前 URL 中的结构模式（?layout=，SSR 安全，缺省 split） */
export function currentLoginMode(): string {
  if (typeof window === 'undefined') return 'split';
  return new URLSearchParams(window.location.search).get('layout') || 'split';
}

/** 状态页签：brandSide 仅分栏类模式生效（centered 无分栏不适用）；默认落第一项（基本状态） */
export function loginStateTabs(mode: string): { key: string; label: string }[] {
  return mode !== 'centered' && LOGIN_MODE_NODES[mode] !== undefined
    ? [
        { key: 'left', label: '品牌区居左' },
        { key: 'right', label: '品牌区居右' },
        { key: 'slot', label: '认证区插槽' },
      ]
    : [
        { key: 'basic', label: '基本状态' },
        { key: 'slot', label: '认证区插槽' },
      ];
}

/** 预览节点：插槽演示跟随当前结构模式（品牌配置沿用基础 props，保留自身标题与 authVariant） */
export function buildLoginPreviewNode(mode: string, stateKey: string): DslNode {
  if (stateKey === 'slot') {
    return {
      ...LOGIN_TABS_NODE,
      props: { ...LOGIN_BASE_PROPS, ...LOGIN_TABS_NODE.props, layout: mode },
    };
  }
  const node = LOGIN_MODE_NODES[mode] ?? LOGIN_MODE_NODES.split;
  return stateKey === 'left' || stateKey === 'right'
    ? { ...node, props: { ...node.props, brandSide: stateKey } }
    : node;
}

/** DSL / YAML 页签展示用节点：剔除预览专用的 --login-min-h 覆盖，补齐事件编排 */
export function buildLoginDisplayDsl(mode: string, stateKey: string): DslNode {
  const { style: _previewOnly, ...base } = LOGIN_BASE_PROPS;
  if (stateKey === 'slot') {
    return {
      ...LOGIN_TABS_NODE,
      props: { ...base, ...LOGIN_TABS_NODE.props, layout: mode },
    };
  }
  return {
    type: 'Login',
    props: {
      ...base,
      layout: mode,
      ...(stateKey === 'left' || stateKey === 'right' ? { brandSide: stateKey } : {}),
    },
    events: {
      onSubmit: { action: 'setState', params: { loggingIn: true } },
      onRegisterClick: { action: 'navigate', params: { to: '/register' } },
    },
  };
}

/** 预览框 + 模式回显（LoginPreviewSection 岛与注册表预览共用）；fill 时预览框撑满全屏弹层高度 */
export function LoginPreviewFrame({
  mode,
  stateKey,
  fill = false,
}: {
  mode: string;
  stateKey: string;
  fill?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        ...(fill ? { height: '100%' } : {}),
      }}
    >
      <div
        style={{
          ...(fill
            ? { flex: 1, minHeight: 0, borderRadius: 0 }
            : { height: 520, borderRadius: 8 }),
          overflow: 'auto',
          border: '1px solid var(--border)',
        }}
      >
        <DslPreview node={buildLoginPreviewNode(mode, stateKey)} />
      </div>
    </div>
  );
}

function LoginPreview() {
  const [mode] = useState(currentLoginMode);
  return <LoginPreviewFrame mode={mode} stateKey={loginStateTabs(mode)[0].key} />;
}


const CONDITION_FIELDS = [
  { featureCode: 'age', featureName: '年龄', fieldType: 'NUMBER' },
  { featureCode: 'name', featureName: '姓名', fieldType: 'STRING' },
  { featureCode: 'registerTime', featureName: '注册时间', fieldType: 'DATE' },
  { featureCode: 'isVip', featureName: '是否会员', fieldType: 'BOOLEAN' },
];

function FieldConditionPreview() {
  const [value, setValue] = useState<FieldConditionValue>({
    relation: 'AND',
    children: [
      {
        relation: 'AND',
        children: [
          {
            field: { value: 'age', label: '年龄', dataType: 'NUMBER' },
            term: { value: 'GREATER_EQUAL', label: '大于等于' },
            value: 18,
          },
        ],
      },
    ],
  });
  return (
    <div style={columnStyle}>
      <FieldCondition value={value} onChange={setValue} fields={CONDITION_FIELDS} />
    </div>
  );
}

function ExpressionEditorPreview() {
  const [value, setValue] = useState('return ft.period(1, 12)');
  return (
    <div style={columnStyle}>
      <ExpressionEditor
        label="周期表达式"
        required
        value={value}
        onChange={setValue}
        valueTemplate="return ft.period(${a}, ${b})"
        valueMapping={{
          a: { label: '起始周期', type: 'number', default: 1, required: true },
          b: { label: '结束周期', type: 'number', default: 12, required: true },
        }}
      />
    </div>
  );
}

function RuleConfigPreview() {
  const [value, setValue] = useState<RuleConfigValue>({
    score: 1,
    ruleConditions: [{ key: 1, opt: 'GREATER', value: 100, score: 10 }],
  });
  return (
    <div style={columnStyle}>
      <RuleConfig value={value} onChange={setValue} />
    </div>
  );
}

const RULE_FIELDS = [
  { label: '年龄', value: 'age' },
  { label: '注册时间', value: 'registerTime' },
  { label: '订单金额', value: 'orderAmount' },
];

function RuleExpressionPreview() {
  const [value, setValue] = useState<RuleExpressionValue | null>({
    expression: 'age > 18',
    expressionLabel: '年龄 > 18',
    sourceField: ['age'],
  });
  return (
    <div style={columnStyle}>
      <RuleExpression
        options={RULE_FIELDS}
        value={value}
        onChange={setValue}
        placeholder="输入字段名匹配候选，Enter 选中为 chip"
      />
    </div>
  );
}

function ScriptEditorPreview() {
  const [code, setCode] = useState('def commission(amount, rate):\n    return amount * rate');
  return (
    <div style={columnStyle}>
      <ScriptEditor
        value={code}
        onChange={setCode}
        language="python"
        placeholder="输入脚本，函数 / 变量自动联想"
        functions={[
          { name: 'SUM', description: '求和', parameters: [{ name: 'field', type: 'string' }] },
          { name: 'COUNT', description: '计数', parameters: [{ name: 'field', type: 'string' }] },
        ]}
        variables={[
          { name: 'order_amount', type: 'number', description: '订单金额' },
          { name: 'user_level', type: 'string', description: '用户等级' },
        ]}
      />
    </div>
  );
}

const SITE_FOOTER_NODE: DslNode = {
  type: 'SiteFooter',
  props: {
    brand: {
      name: 'Pactor',
      description: 'DSL 驱动的应用构建平台，组件 / 模板 / 规范一站式管理。',
    },
    groups: [
      {
        title: '产品',
        links: [
          { text: '组件库', href: '/components' },
          { text: '模板中心', href: '/templates' },
          { text: '主题生成器', href: '/themes' },
        ],
      },
      {
        title: '资源',
        links: [{ text: '文档', href: '/' }, { text: '反馈问题' }],
      },
      {
        title: '支持',
        links: [{ text: '更新日志', href: '/' }],
      },
    ],
    copyright: '© 2026 Pactor',
    bottomLinks: [
      { text: '隐私协议', href: '/privacy' },
      { text: '服务条款' },
    ],
  },
};

function SiteFooterPreview() {
  return <DslPreview node={SITE_FOOTER_NODE} />;
}

export const PREVIEWS_BLOCKS: Record<string, () => ReactElement> = {
  'component.entity-card': EntityCardPreview,
  'component.card-list': CardListPreview,
  'component.login': LoginPreview,
  'component.site-footer': SiteFooterPreview,
  'component.field-condition': FieldConditionPreview,
  'component.expression-editor': ExpressionEditorPreview,
  'component.rule-config': RuleConfigPreview,
  'component.rule-expression': RuleExpressionPreview,
  'component.script-editor': ScriptEditorPreview,
};
