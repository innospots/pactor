/**
 * 国际化（i18n）示例模块：
 *
 * - `getLocale` / `switchLocale`：语言偏好持久化在 localStorage；
 *   切换后整页刷新（与框架 app.setLocale 的 V1 策略一致），
 *   刷新后 options.locale / bootstrap / antd ConfigProvider 均按新语言重建。
 * - `messages`：zh-CN / en-US 双语文案表，喂给 createPactorApplication
 *   的 options.messages，供页面 DSL 的 ${t('key')} 表达式使用。
 * - `translate`：bootstrap（菜单标题、应用名）不走表达式求值，
 *   由示例侧按当前语言直接查表。
 */
import type { I18nMessages, Locale } from 'pactor-core';

const LOCALE_KEY = 'example-admin-antd:locale';

export const DEFAULT_LOCALE: Locale = 'zh-CN';

export const messages: I18nMessages = {
  'zh-CN': {
    'app.name': 'Pactor Admin 示例',

    'menu.login': '登录',
    'menu.dashboard': '工作台',
    'menu.customers': '客户管理',
    'menu.customerList': '客户列表',
    'menu.customerEdit': '编辑客户',
    'menu.settings': '系统设置',

    'login.hint.message': '演示账号 admin / pactor123',
    'login.hint.description':
      '登录成功后写入本地会话并整页重载，bootstrap 按会话返回 admin 布局。',
    'login.username.label': '用户名',
    'login.username.placeholder': '请输入用户名',
    'login.username.required': '请输入用户名',
    'login.password.label': '密码',
    'login.password.placeholder': '请输入密码',
    'login.password.required': '请输入密码',
    'login.submit': '登 录',
    'login.error': '登录失败：用户名或密码错误',

    'dashboard.welcome.message': '欢迎回来，{{name}}！',
    'dashboard.welcome.description':
      '当前应用：{{app}}（user / app 作用域表达式绑定）· 今日有 {{count}} 条待办工单',
    'dashboard.stats.customerTotal': '客户总数',
    'dashboard.stats.activeToday': '今日活跃',
    'dashboard.stats.pendingTickets': '待办工单',
    'dashboard.stats.conversionRate': '转化率',
    'dashboard.stats.unit.customer': '家',
    'dashboard.stats.unit.ticket': '条',
    'dashboard.notice.title': '公告与待办',
    'dashboard.notice.tab': '公告',
    'dashboard.todo.tab': '待办',
    'dashboard.notice.message':
      '本示例为纯前端演示：页面 DSL 本地导入，数据为内存 mock。',
    'dashboard.todo.message': '你有 {{count}} 条待办工单（数据源表达式）。',
    'dashboard.quickActions.title': '快捷操作',
    'dashboard.quickActions.message': '常用入口一键直达（navigate 动作）。',
    'dashboard.quickActions.customers': '客户列表',
    'dashboard.quickActions.customerEdit': '编辑客户',
    'dashboard.logout.message': '退出登录演示：清除本地会话并整页重载回 /login。',
    'dashboard.logout': '退出登录',

    'customers.title': '客户列表',
    'customers.intro.message': '客户列表演示查询、抽屉编辑与权限禁用',
    'customers.intro.description':
      '查询走 setState + reload 链路；行内"删除"因 permissions 不含 customer:delete 而禁用。',
    'customers.search.title': '客户查询',
    'customers.search.keyword.label': '关键词',
    'customers.search.keyword.placeholder': '客户名 / 负责人',
    'customers.search.submit': '查询',
    'customers.table.title': '客户数据（service 数据源）',
    'customers.column.name': '客户名称',
    'customers.column.phone': '联系电话',
    'customers.column.level': '等级',
    'customers.column.owner': '负责人',
    'customers.column.actions': '操作',
    'customers.action.edit': '编辑',
    'customers.action.delete': '删除',
    'customers.drawer.title': '编辑客户',
    'customers.drawer.editing': '正在编辑：{{name}}（ID {{id}}）',
    'customers.form.name.label': '客户名称',
    'customers.form.name.placeholder': '请输入客户名称',
    'customers.form.name.required': '请输入客户名称',
    'customers.form.phone.label': '联系电话',
    'customers.form.phone.placeholder': '请输入联系电话',
    'customers.form.level.label': '等级',
    'customers.form.level.a': 'A 级',
    'customers.form.level.b': 'B 级',
    'customers.form.level.c': 'C 级',
    'customers.form.region.label': '省份',
    'customers.form.city.label': '城市（随省份联动）',
    'customers.form.save': '保存',
    'customers.form.saveError': '保存失败，请重试',
    'customers.updated': '客户已更新',

    'customerEdit.title': '编辑客户',
    'customerEdit.back': '← 返回列表',
    'customerEdit.card.title': '客户信息',
    'customerEdit.editing': '正在编辑：{{name}}（路由参数 id = {{id}}）',
    'customerEdit.keepPlaceholder': '留空则保持不变',
    'customerEdit.saved': '保存成功',
  },
  'en-US': {
    'app.name': 'Pactor Admin Demo',

    'menu.login': 'Sign In',
    'menu.dashboard': 'Dashboard',
    'menu.customers': 'Customers',
    'menu.customerList': 'Customer List',
    'menu.customerEdit': 'Edit Customer',
    'menu.settings': 'Settings',

    'login.hint.message': 'Demo account: admin / pactor123',
    'login.hint.description':
      'After sign-in a local session is stored and the page reloads; bootstrap returns the admin layout for the session.',
    'login.username.label': 'Username',
    'login.username.placeholder': 'Enter username',
    'login.username.required': 'Username is required',
    'login.password.label': 'Password',
    'login.password.placeholder': 'Enter password',
    'login.password.required': 'Password is required',
    'login.submit': 'Sign In',
    'login.error': 'Sign-in failed: invalid username or password',

    'dashboard.welcome.message': 'Welcome back, {{name}}!',
    'dashboard.welcome.description':
      'Current app: {{app}} (user/app scope expression binding) · {{count}} pending tickets today',
    'dashboard.stats.customerTotal': 'Total Customers',
    'dashboard.stats.activeToday': 'Active Today',
    'dashboard.stats.pendingTickets': 'Pending Tickets',
    'dashboard.stats.conversionRate': 'Conversion Rate',
    'dashboard.stats.unit.customer': '',
    'dashboard.stats.unit.ticket': '',
    'dashboard.notice.title': 'Notices & Todos',
    'dashboard.notice.tab': 'Notice',
    'dashboard.todo.tab': 'Todo',
    'dashboard.notice.message':
      'This demo runs fully in the browser: page DSL is imported locally and data is mocked in memory.',
    'dashboard.todo.message':
      'You have {{count}} pending tickets (data source expression).',
    'dashboard.quickActions.title': 'Quick Actions',
    'dashboard.quickActions.message': 'One-click shortcuts (navigate action).',
    'dashboard.quickActions.customers': 'Customer List',
    'dashboard.quickActions.customerEdit': 'Edit Customer',
    'dashboard.logout.message':
      'Sign-out demo: clears the local session and reloads to /login.',
    'dashboard.logout': 'Sign Out',

    'customers.title': 'Customer List',
    'customers.intro.message':
      'Customer list demo: search, drawer editing and permission-based disabling',
    'customers.intro.description':
      'Search runs through the setState + reload pipeline; the row "Delete" button is disabled because permissions lack customer:delete.',
    'customers.search.title': 'Search Customers',
    'customers.search.keyword.label': 'Keyword',
    'customers.search.keyword.placeholder': 'Name / Owner',
    'customers.search.submit': 'Search',
    'customers.table.title': 'Customer Data (service data source)',
    'customers.column.name': 'Name',
    'customers.column.phone': 'Phone',
    'customers.column.level': 'Level',
    'customers.column.owner': 'Owner',
    'customers.column.actions': 'Actions',
    'customers.action.edit': 'Edit',
    'customers.action.delete': 'Delete',
    'customers.drawer.title': 'Edit Customer',
    'customers.drawer.editing': 'Editing: {{name}} (ID {{id}})',
    'customers.form.name.label': 'Name',
    'customers.form.name.placeholder': 'Enter customer name',
    'customers.form.name.required': 'Customer name is required',
    'customers.form.phone.label': 'Phone',
    'customers.form.phone.placeholder': 'Enter phone number',
    'customers.form.level.label': 'Level',
    'customers.form.level.a': 'Level A',
    'customers.form.level.b': 'Level B',
    'customers.form.level.c': 'Level C',
    'customers.form.region.label': 'Province',
    'customers.form.city.label': 'City (linked to province)',
    'customers.form.save': 'Save',
    'customers.form.saveError': 'Save failed, please retry',
    'customers.updated': 'Customer updated',

    'customerEdit.title': 'Edit Customer',
    'customerEdit.back': '← Back to List',
    'customerEdit.card.title': 'Customer Info',
    'customerEdit.editing': 'Editing: {{name}} (route param id = {{id}})',
    'customerEdit.keepPlaceholder': 'Leave empty to keep unchanged',
    'customerEdit.saved': 'Saved',
  },
};

/** 读取持久化的语言偏好（缺省中文） */
export function getLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(LOCALE_KEY);
    if (stored === 'zh-CN' || stored === 'en-US') {
      return stored;
    }
  } catch {
    // localStorage 不可用（隐私模式等）时回落默认语言
  }
  return DEFAULT_LOCALE;
}

/**
 * 切换语言：写入 localStorage 后整页刷新。
 * 刷新后 main.tsx 的 options.locale、bootstrap 文案与 antd
 * ConfigProvider locale 均按新语言重建（与 app.setLocale 的
 * V1 刷新策略等价，且避免了将 app 实例回传给 headerExtra）。
 */
export function switchLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(LOCALE_KEY, locale);
  } catch {
    // 忽略持久化失败，仍刷新以应用当前会话语言
  }
  window.location.reload();
}

/** 示例侧查表翻译（bootstrap 菜单标题 / 应用名等非 DSL 场景） */
export function translate(key: string, locale: Locale = getLocale()): string {
  const table = messages[locale];
  if (typeof table === 'object' && table !== null && key in table) {
    const value = table[key];
    if (typeof value === 'string') {
      return value;
    }
  }
  const fallback = messages[DEFAULT_LOCALE];
  if (typeof fallback === 'object' && fallback !== null && key in fallback) {
    const value = fallback[key];
    if (typeof value === 'string') {
      return value;
    }
  }
  return key;
}
