import type { PageDsl } from "@pactor-app/core";

import type { LayoutDsl, SitemapResource } from "pactor-app";

import type { DemoUser } from "./accounts";

/**
 * Mock sitemap 数据源（design/dynamic-page.md 方案 B 示例实现）。
 * 真实项目由后端接口返回同构对象——端点按会话裁剪：
 * 匿名 → public 页（登录/注册）；登录后 → 该角色可见的 menus / pages / permissions。
 */

/**
 * 服务端下发的接口地址：DSL 中直接引用后端绝对地址（跨域），
 * 客户端 httpHooks 自动改写进项目内代理前缀。登录 / 登出即普通 HTTP
 * 调用，DSL 用内置 request 动作表达，无需客户端注册服务。
 */
const apiBase = "http://localhost:9011";

/* ---------------- 布局（DSL 定义，PageOutlet 为页面内容出口） ---------------- */
/* 布局 body 内 ${data.session.*} 由客户端注入的 session dataSource 提供
 *（user / app / menus）；${route.params.pathname} 为当前路径（客户端注入）。 */

const layouts: Record<string, LayoutDsl> = {
  admin: {
    dsl: "1.0",
    body: {
      type: "Flex",
      props: { gap:0, direction: "horizontal", style: { height: "100vh" } },
      children: [
        {
          type: "Flex",
          props: {
            direction: "vertical",
            style: {
              width: 224,
              flexShrink: 0,
              borderRight: "1px solid var(--border)",
            },
          },
          children: [
            {
              type: "Flex",
              props: {
                style: {
                  padding: "16px 16px",
                  fontWeight: 600,
                  borderBottom: "1px solid var(--border)",
                },
              },
              children: [
                { type: "Text", props: { text: "${data.session.app.name}" } },
              ],
            },
            {
              type: "SitemapMenu",
              props: {
                items: "${data.session.menus}",
                collapsible: true,
              },
              events: {
                onSelect: [
                  { action: "navigate", params: { to: "${event}" } },
                ],
              },
            },
          ],
        },
        {
          type: "Flex",
          props: { direction: "vertical", style: { flex: 1, minWidth: 0 } },
          children: [
            {
              type: "Flex",
              props: {
                justify: "end",
                align: "center",
                style: {
                  padding: "10px 20px",
                  borderBottom: "1px solid var(--border)",
                },
              },
              children: [
                {
                  type: "DropdownMenu",
                  props: {
                    items: [
                      {
                        label: "个人设置",
                        value: "settings",
                        icon: "settings",
                      },
                      { label: "退出登录", value: "logout", icon: "log-out" },
                    ],
                  },
                  events: {
                    onSelect: [
                      {
                        action: "if",
                        params: {
                          condition: "${event == 'logout'}",
                          then: [
                            {
                              action: "request",
                              params: {
                                method: "POST",
                                url: `${apiBase}/api/auth/logout`,
                              },
                            },
                            {
                              action: "app.reload",
                              params: { to: "/login" },
                            },
                          ],
                          else: [
                            {
                              action: "message",
                              params: { text: "演示环境未实现个人设置" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                  children: [
                    {
                      type: "Button",
                      props: {
                        text: "${data.session.user.name}",
                        variant: "text",
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: "Flex",
              props: {
                direction: "vertical",
                style: { flex: 1, minHeight: 0, overflow: "auto" },
              },
              children: [{ type: "PageOutlet" }],
            },
          ],
        },
      ],
    },
  },
  login: {
    dsl: "1.0",
    body: {
      type: "Flex",
      props: {
        direction: "vertical",
        justify: "center",
        align: "center",
        style: { minHeight: "100vh", padding: 24 },
      },
      children: [
        {
          type: "Flex",
          props: {
            direction: "vertical",
            style: {
              width: 380,
              padding: 24,
              border: "1px solid var(--border)",
              borderRadius: 12,
            },
          },
          children: [{ type: "PageOutlet" }],
        },
      ],
    },
  },
  blank: { dsl: "1.0", body: { type: "PageOutlet" } },
};

/* ---------------- 页面 DSL（内联页） ---------------- */

const loginPage: PageDsl = {
  dsl: "1.0",
  page: { id: "login", title: "登录" },
  state: { submitting: false },
  body: {
    type: "Form",
    events: {
      onSubmit: [
        { action: "setState", params: { submitting: true } },
        {
          id: "loginResult",
          action: "request",
          params: {
            method: "POST",
            url: `${apiBase}/api/auth/login`,
            body: {
              username: "${event.username}",
              password: "${event.password}",
            },
          },
        },
        { action: "setState", params: { submitting: false } },
        {
          action: "if",
          params: {
            condition: "${actions.loginResult.token}",
            then: [
              // 登录成功整页重载：sitemap 端点按已登录会话重新裁剪内容
              { action: "app.reload", params: { to: "/" } },
            ],
            else: [
              {
                action: "message",
                params: {
                  messageType: "error",
                  text: "登录失败：用户名或密码错误",
                },
              },
            ],
          },
        },
      ],
    },
    children: [
      {
        type: "Alert",
        props: {
          variant: "info",
          message: "演示账号 admin / pactor123，guest / guest123",
          description:
            "admin 可见「报表」菜单（report:view）；guest 仅可见首页。登录后 sitemap 按角色重新下发。",
          style: { marginBottom: 16 },
        },
      },
      {
        type: "Input",
        props: {
          name: "username",
          label: "用户名",
          placeholder: "请输入用户名",
          rules: [{ required: true, message: "请输入用户名" }],
        },
      },
      {
        type: "Input",
        props: {
          name: "password",
          label: "密码",
          type: "password",
          placeholder: "请输入密码",
          rules: [{ required: true, message: "请输入密码" }],
        },
      },
      {
        type: "Flex",
        props: { justify: "end" },
        children: [
          {
            type: "Button",
            props: {
              text: "登 录",
              variant: "primary",
              submit: true,
              loading: "${state.submitting}",
            },
          },
        ],
      },
    ],
  },
};

const registerPage: PageDsl = {
  dsl: "1.0",
  page: { id: "register", title: "注册" },
  body: {
    type: "Page",
    props: { title: "注册" },
    children: [
      {
        type: "Alert",
        props: {
          variant: "warning",
          message: "演示环境不开放注册",
          description: "请使用登录页的演示账号体验不同角色的菜单差异。",
          style: { marginBottom: 16 },
        },
      },
      {
        type: "Button",
        props: { text: "返回登录", variant: "primary" },
        events: {
          onClick: [{ action: "navigate", params: { to: "/login" } }],
        },
      },
    ],
  },
};

const homePage: PageDsl = {
  dsl: "1.0",
  page: { id: "home", title: "首页" },
  body: {
    type: "Page",
    props: { title: "首页" },
    children: [
      {
        type: "Alert",
        props: {
          variant: "info",
          message: "欢迎回来，${data.session.user.name}！",
          description:
            "本页与外壳布局均由 sitemap 对象下发（design/dynamic-page.md）；菜单随角色裁剪。",
          style: { marginBottom: 16 },
        },
      },
      {
        type: "Button",
        props: { text: "查看月报（需 report:view）" },
        events: {
          onClick: [
            { action: "navigate", params: { to: "/reports/monthly" } },
          ],
        },
      },
    ],
  },
};

const monthlyDetailPage: PageDsl = {
  dsl: "1.0",
  page: { id: "monthly-detail", title: "月报详情" },
  body: {
    type: "Page",
    props: { title: "月报详情" },
    children: [
      {
        type: "Alert",
        props: {
          variant: "info",
          message: "路径参数演示：id = ${route.params.id}",
          description: "隐藏页（不出现在菜单），经列表页跳转进入。",
          style: { marginBottom: 16 },
        },
      },
      {
        type: "Button",
        props: { text: "返回月报" },
        events: {
          onClick: [
            { action: "navigate", params: { to: "/reports/monthly" } },
          ],
        },
      },
    ],
  },
};

/** 懒加载页（pageDsl 不下发，客户端经 loadPage 按需获取） */
const lazyPages: Record<string, { version: number; pageDsl: PageDsl }> = {
  monthly: {
    version: 7,
    pageDsl: {
      dsl: "1.0",
      page: { id: "monthly", title: "月报" },
      body: {
        type: "Page",
        props: { title: "本月经营月报" },
        children: [
          {
            type: "Flex",
            props: { gap: 16, style: { marginBottom: 16 } },
            children: [
              {
                type: "Card",
                props: { title: "营收" },
                children: [
                  {
                    type: "Statistic",
                    props: { title: "本月（万元）", value: 128.6 },
                  },
                ],
              },
              {
                type: "Card",
                props: { title: "新增客户" },
                children: [
                  { type: "Statistic", props: { title: "本月（家）", value: 342 } },
                ],
              },
              {
                type: "Card",
                props: { title: "转化率" },
                children: [
                  { type: "Statistic", props: { title: "本月（%）", value: 23.8 } },
                ],
              },
            ],
          },
          {
            type: "Alert",
            props: {
              variant: "success",
              message: "本页 DSL 由 /api/pages/monthly 懒加载下发",
              description:
                "sitemap 中该页仅声明 id / path / version（monthly@7），点击进入时才请求页面 DSL。",
              style: { marginBottom: 16 },
            },
          },
          {
            type: "Button",
            props: { text: "查看详情（隐藏页 + 路径参数）" },
            events: {
              onClick: [
                {
                  action: "navigate",
                  params: { to: "/reports/monthly/2026-09" },
                },
              ],
            },
          },
        ],
      },
    },
  },
};

/* ---------------- 页面 / 菜单定义 ---------------- */

function canViewReports(user: DemoUser | null): boolean {
  return user !== null && user.permissions.includes("report:view");
}

/**
 * 按会话构建 sitemap：同一 URL，不同用户拿到不同内容。
 * 匿名 → 仅 public 页；guest → + 首页；admin → + 报表组。
 */
export function buildSitemap(user: DemoUser | null): SitemapResource {
  const reports = canViewReports(user);

  const pages: SitemapResource["pages"] = [
    { id: "login", path: "/login", title: "登录", version: 1, pageDsl: loginPage },
    {
      id: "register",
      path: "/register",
      title: "注册",
      version: 1,
      pageDsl: registerPage,
    },
  ];
  if (user) {
    pages.push({ id: "home", path: "/", title: "首页", version: 3, pageDsl: homePage });
  }
  if (reports) {
    // 懒加载：不下发 pageDsl，仅 id / path / version（monthly@7）
    pages.push({ id: "monthly", path: "/reports/monthly", title: "月报", version: 7 });
    pages.push({
      id: "monthly-detail",
      path: "/reports/monthly/:id",
      title: "月报详情",
      version: 2,
      pageDsl: monthlyDetailPage,
    });
  }

  const menus: SitemapResource["menus"] = [
    {
      id: "login",
      type: "page",
      pageId: "login",
      title: "登录",
      layout: "login",
      public: true,
      hidden: true,
    },
    {
      id: "register",
      type: "page",
      pageId: "register",
      title: "注册",
      layout: "login",
      public: true,
      hidden: true,
    },
  ];
  if (user) {
    // path / title 缺省继承自 pages[]，仅导航元数据（icon / order / layout）
    menus.push({ id: "home", type: "page", pageId: "home", title: "首页", icon: "home", layout: "admin", order: 1 });
  }
  if (reports) {
    menus.push({
      id: "reports",
      type: "group",
      title: "报表",
      icon: "chart",
      order: 2,
      children: [
        {
          id: "monthly",
          type: "page",
          pageId: "monthly",
          title: "报表中心",
          icon: "chart",
          layout: "admin",
          permission: "report:view",
        },
        {
          id: "monthly-detail",
          type: "page",
          pageId: "monthly-detail",
          title: "月报详情",
          layout: "admin",
          hidden: true,
          activeMenu: "monthly",
        },
      ],
    });
    menus.push({
      id: "help",
      type: "link",
      title: "帮助",
      path: "https://github.com/",
      external: true,
      order: 3,
    });
  }

  return {
    id: "site",
    resourceType: "sitemap",
    version: 12,
    dslVersion: "1.0",
    updatedAt: new Date().toISOString(),
    app: { name: "动态页面 Starter" },
    ...(user ? { user: { ...user }, permissions: user.permissions } : {}),
    layout: "admin",
    auth: { loginPath: "/login" },
    layouts,
    pages,
    menus,
  };
}

/** 懒加载页：校验会话与角色（前端权限只控制 UI，接口必须鉴权） */
export function getLazyPage(
  pageId: string,
  user: DemoUser | null,
): { version: number; pageDsl: PageDsl } | null {
  const entry = lazyPages[pageId];
  if (!entry) {
    return null;
  }
  if (pageId === "monthly" && !canViewReports(user)) {
    return null;
  }
  return entry;
}
