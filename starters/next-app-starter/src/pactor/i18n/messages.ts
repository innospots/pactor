/**
 * 业务语言包（国际化设计见 openspec/specs/i18n）：按语言分组的词条表，
 * 宿主（src/pactor/App.tsx）按当前 locale 取一组传给 SitemapApp 的
 * messages prop；页面 / 布局 DSL 经 `${t('key')}` / `${t('key', {...})}`
 * 消费，参数插值用 {{name}} 占位符。
 *
 * 约定：
 * - key 用业务命名空间（shell.* / gate.* / home.* / dashboard.*），
 *   严禁占用框架保留的 pactor.* 前缀（内置组件默认文案）；
 * - 两种语言的 key 集合保持一致，缺失时按框架回退链（defaultLocale → key）。
 * 词条量级增大后可改为按 locale 动态 import（如 `await import('./zh-CN')`）。
 */

export const SUPPORTED_LOCALES = ["zh-CN", "en-US"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "zh-CN";

const zhCN = {
  // 外壳布局（sitemap.yaml admin 布局 Header）
  "shell.userMenu.defaultName": "用户",
  "shell.userMenu.profile": "个人中心",
  "shell.userMenu.logout": "退出登录",
  "shell.userMenu.profileToast": "打开个人中心",

  // 页面访问门禁（src/pactor/page-access.tsx，SitemapApp 之外的宿主视图）
  "gate.checking": "正在校验页面访问权限…",
  "gate.redirecting": "正在跳转登录页…",
  "gate.denied.title": "无访问权限",
  "gate.denied.retry": "重新校验",
  "gate.denied.back": "返回上一页",
  "gate.denied.home": "回到首页",
  "gate.denied.noAccess": "无页面访问权限",
  "gate.error.http": "页面权限校验失败：HTTP {{status}}",
  "gate.error.unavailable": "页面权限校验服务不可用：{{message}}",

  // 首页（yaml/pages/home.page.yaml）
  "home.title": "首页",
  "home.welcome": "欢迎回来，{{name}}！",
  "home.description":
    "本页与外壳布局均由 sitemap 对象下发（design/dynamic-page.md）；菜单随角色裁剪。",
  "home.viewMonthly": "查看月报（需 report:view）",

  // 仪表盘（yaml/common/dashboard.yaml）
  "dashboard.title": "仪表盘",
  "dashboard.subtitle": "运营概览",
  "dashboard.realtime": "实时 {{rpm}} RPM · {{tpm}} TPM",
  "dashboard.refresh": "↻ 刷新",
  "dashboard.refreshed": "看板数据已刷新",
  "dashboard.rangeLabel": "分析时间范围",
  "dashboard.rangePlaceholder": "选择时间范围",
  "dashboard.preset.today": "今天",
  "dashboard.preset.lastDays": "近{{days}}天",
  "dashboard.coreOverview": "核心概览 · {{start}} — {{end}}",
  "dashboard.stats.requests": "请求量",
  "dashboard.stats.activeClients": "{{clients}} 位活跃客户端 · {{tokens}} Token",
  "dashboard.stats.successRate": "成功率",
  "dashboard.stats.failures": "{{failures}} 个失败 · 错误率 {{errorRate}}%",
  "dashboard.toast.callLog": "跳转调用日志（失败筛选）",
  "dashboard.stats.avgLatency": "平均响应时间",
  "dashboard.link.reliability": "查看可靠性分析 →",
  "dashboard.toast.providerAvailability": "跳转供应商可用性",
  "dashboard.stats.cost": "计费金额",
  "dashboard.stats.avgCost": "平均每次 {{cost}}",
  "dashboard.trend.title": "趋势分析",
  "dashboard.trend.subtitle": "观察流量变化与异常峰值",
  "dashboard.metric.requests": "请求",
  "dashboard.metric.cost": "费用",
  "dashboard.metric.latency": "延迟",
  "dashboard.usage.models": "用量构成 · 模型",
  "dashboard.usage.modelsSubtitle": "按请求量分布，识别主要模型流量来源",
  "dashboard.link.allModels": "查看全部 → 模型用量",
  "dashboard.toast.models": "跳转模型用量",
  "dashboard.usage.clients": "用量构成 · 客户端",
  "dashboard.usage.clientsSubtitle": "按请求量分布，识别主要客户端流量来源",
  "dashboard.link.allClients": "查看全部 → 客户端用量",
  "dashboard.toast.clients": "跳转客户端用量",
};

export type MessageKey = keyof typeof zhCN;

const enUS: Record<MessageKey, string> = {
  "shell.userMenu.defaultName": "User",
  "shell.userMenu.profile": "Profile",
  "shell.userMenu.logout": "Log out",
  "shell.userMenu.profileToast": "Open profile",

  "gate.checking": "Checking page access…",
  "gate.redirecting": "Redirecting to sign in…",
  "gate.denied.title": "Access denied",
  "gate.denied.retry": "Retry",
  "gate.denied.back": "Back",
  "gate.denied.home": "Home",
  "gate.denied.noAccess": "No permission to access this page",
  "gate.error.http": "Page access check failed: HTTP {{status}}",
  "gate.error.unavailable": "Page access service unavailable: {{message}}",

  "home.title": "Home",
  "home.welcome": "Welcome back, {{name}}!",
  "home.description":
    "This page and the shell layout are both delivered by the sitemap (design/dynamic-page.md); menus are trimmed by role.",
  "home.viewMonthly": "View monthly report (requires report:view)",

  "dashboard.title": "Dashboard",
  "dashboard.subtitle": "Operations overview",
  "dashboard.realtime": "Live {{rpm}} RPM · {{tpm}} TPM",
  "dashboard.refresh": "↻ Refresh",
  "dashboard.refreshed": "Dashboard refreshed",
  "dashboard.rangeLabel": "Analysis range",
  "dashboard.rangePlaceholder": "Select range",
  "dashboard.preset.today": "Today",
  "dashboard.preset.lastDays": "Last {{days}} days",
  "dashboard.coreOverview": "Overview · {{start}} — {{end}}",
  "dashboard.stats.requests": "Requests",
  "dashboard.stats.activeClients": "{{clients}} active clients · {{tokens}} tokens",
  "dashboard.stats.successRate": "Success rate",
  "dashboard.stats.failures": "{{failures}} failed · error rate {{errorRate}}%",
  "dashboard.toast.callLog": "Jump to call log (failures)",
  "dashboard.stats.avgLatency": "Avg. response time",
  "dashboard.link.reliability": "View reliability analysis →",
  "dashboard.toast.providerAvailability": "Jump to provider availability",
  "dashboard.stats.cost": "Billing amount",
  "dashboard.stats.avgCost": "Avg. {{cost}} per request",
  "dashboard.trend.title": "Trend analysis",
  "dashboard.trend.subtitle": "Watch traffic trends and spikes",
  "dashboard.metric.requests": "Requests",
  "dashboard.metric.cost": "Cost",
  "dashboard.metric.latency": "Latency",
  "dashboard.usage.models": "Usage · Models",
  "dashboard.usage.modelsSubtitle":
    "Distribution by requests — spot the dominant model traffic",
  "dashboard.link.allModels": "View all → Model usage",
  "dashboard.toast.models": "Jump to model usage",
  "dashboard.usage.clients": "Usage · Clients",
  "dashboard.usage.clientsSubtitle":
    "Distribution by requests — spot the dominant client traffic",
  "dashboard.link.allClients": "View all → Client usage",
  "dashboard.toast.clients": "Jump to client usage",
};

export const MESSAGES: Record<Locale, Record<MessageKey, string>> = {
  "zh-CN": zhCN,
  "en-US": enUS,
};
