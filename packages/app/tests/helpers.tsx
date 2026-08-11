// @vitest-environment jsdom
/**
 * 端到端测试共享工具：标准 bootstrap / 页面 DSL / 挂载辅助。
 */
import { act } from '@testing-library/react';
import type { PageDsl } from 'pactor-core';
import type { DslResourceLoader, StaticDslLoaderData } from 'pactor-resource';

import type { PactorApplication } from '../src/index.js';

/** 标准菜单（含隐藏详情页与受限页面） */
export const standardMenus = [
  { id: 'home', type: 'page', title: '首页', path: '/', pageId: 'home' },
  {
    id: 'customers',
    type: 'page',
    title: '客户管理',
    path: '/customers',
    pageId: 'customer-list',
  },
  {
    id: 'customer-detail',
    type: 'page',
    title: '客户详情',
    path: '/customers/:id',
    pageId: 'customer-detail',
    hidden: true,
  },
  {
    id: 'sys',
    type: 'page',
    title: '系统管理',
    path: '/admin',
    pageId: 'sys-admin',
    permission: 'sys:admin',
  },
];

/** 标准 bootstrap（app/user/permissions/menus/layout 全字段） */
export function createBootstrap(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    app: { name: '风控运营平台' },
    user: { name: '张三' },
    permissions: ['customer:view'],
    menus: standardMenus,
    layout: { type: 'admin', tabs: true },
    ...overrides,
  };
}

/** 标准首页：表达式（user/app 作用域）+ setState 动作 + 受限按钮 */
export const homePage: PageDsl = {
  dsl: '1.0',
  page: { id: 'home', title: '首页' },
  state: { saved: false },
  body: {
    type: 'Page',
    props: { title: '首页' },
    children: [
      { type: 'Alert', props: { variant: 'info', message: '欢迎使用 Pactor' } },
      {
        type: 'Alert',
        props: {
          variant: 'success',
          message: '你好 ${user.name}，欢迎来到 ${app.name}',
        },
      },
      {
        type: 'Button',
        props: { text: '修改状态', variant: 'primary' },
        events: {
          onClick: { action: 'setState', params: { saved: true } },
        },
      },
      {
        type: 'Alert',
        when: '${state.saved}',
        props: { variant: 'warning', message: '状态已更新' },
      },
      {
        type: 'Button',
        permission: 'risk:view',
        props: { text: '高危操作' },
      },
    ],
  },
};

/** 客户列表页 */
export const customerListPage: PageDsl = {
  dsl: '1.0',
  page: { id: 'customer-list', title: '客户管理' },
  body: {
    type: 'Page',
    props: { title: '客户管理' },
    children: [
      { type: 'Alert', props: { variant: 'info', message: '客户列表页内容' } },
    ],
  },
};

/** 客户详情页：route.params / route.query 注入验证 */
export const customerDetailPage: PageDsl = {
  dsl: '1.0',
  page: { id: 'customer-detail', title: '客户详情' },
  body: {
    type: 'Page',
    props: { title: '客户详情' },
    children: [
      {
        type: 'Alert',
        props: {
          variant: 'info',
          message: '客户 ${route.params.id} 页签 ${route.query.tab}',
        },
      },
    ],
  },
};

/** 受限页面（菜单已配 permission: sys:admin） */
export const sysAdminPage: PageDsl = {
  dsl: '1.0',
  page: { id: 'sys-admin', title: '系统管理' },
  body: {
    type: 'Page',
    props: { title: '系统管理' },
    children: [
      { type: 'Alert', props: { variant: 'info', message: '系统管理页内容' } },
    ],
  },
};

/** 标准页面集合 */
export const standardPages: StaticDslLoaderData['pages'] = {
  home: homePage,
  'customer-list': customerListPage,
  'customer-detail': customerDetailPage,
  'sys-admin': sysAdminPage,
};

/** 设置 jsdom 当前 URL（mount 前调用） */
export function setUrl(url: string): void {
  window.history.pushState({}, '', url);
}

/**
 * 挂载应用到新建容器（#root），初始渲染与 bootstrap 异步链路
 * 在 act 中冲刷，减少 act 告警。
 */
export async function mountApp(app: PactorApplication): Promise<HTMLElement> {
  const target = document.createElement('div');
  target.id = 'root';
  document.body.appendChild(target);
  await act(async () => {
    app.mount('#root');
  });
  return target;
}

/** 卸载应用 */
export async function unmountApp(app: PactorApplication): Promise<void> {
  await act(async () => {
    app.unmount();
  });
}

/**
 * 包装 loader：loadBootstrap 首次 reject（模拟网络异常），之后恢复正常。
 * 用于 bootstrap 失败重试场景。
 */
export function failBootstrapOnceLoader(inner: DslResourceLoader): DslResourceLoader {
  let failed = false;
  return {
    loadBootstrap: () => {
      if (!failed) {
        failed = true;
        return Promise.reject(new Error('网络异常：bootstrap 加载失败'));
      }
      return inner.loadBootstrap();
    },
    loadPage: (pageId) => inner.loadPage(pageId),
    loadFragment: (fragmentId) => inner.loadFragment(fragmentId),
  };
}
