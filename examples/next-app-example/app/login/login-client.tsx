"use client";

import { useEffect, useState } from "react";
import type { DslNode, PageDsl } from "@pactor-app/core";
import { PactorPage } from "@pactor-app/app";

/**
 * 登录页 DSL（嵌入模式：不经路由/外壳，直接作为 React 组件挂在 Next.js 页面里）。
 * 页面结构由 business/Login 组件承载（品牌区 + 认证区 + 辅助入口 + 页脚）：
 * - 左右分栏（split）：认证区经 children 插槽自定义——注册引导行 + Tabs 切换
 *   「手机验证码 / 账号密码」两个独立 Form（各自编排校验与提交事件）+ 协议行 +
 *   「其他方式登录」分隔 + 微信 / Telegram 第三方入口（演示环境以 message 反馈）；
 * - 其余布局：内置账号密码表单，onSubmit → auth.login 动作（本地 mock）→
 *   命名结果经 ${actions.login} 读取，成功 message + navigate（嵌入模式退化为整页跳转）。
 * 记住账号（仅 split 的插槽表单）：勾选后登录成功写入 localStorage，下次进入
 * 页面回填账号输入框（挂载后经 page.state 注入，避免 SSR 水合不一致）。
 */
const REMEMBER_KEY = "next-app-example.remembered-account";

/** 协议行：点击「登录」表示已阅读并同意 服务条款 和 隐私协议
 * （各片段 nowrap，容器 flex-wrap：换行只发生在片段之间，不截断文本） */
const agreementNode: DslNode = {
  type: "Flex",
  props: { justify: "center", align: "center", gap: "small", className: "mt-4 flex-wrap" },
  children: [
    {
      type: "Text",
      props: { text: "点击「登录」表示已阅读并同意", type: "secondary", size: "small", className: "whitespace-nowrap" },
    },
    {
      type: "Button",
      props: { text: "服务条款", variant: "link", size: "small", className: "px-0" },
      events: {
        onClick: [
          { action: "message", params: { messageType: "info", text: "演示环境未配置服务条款页面" } },
        ],
      },
    },
    { type: "Text", props: { text: "和", type: "secondary", size: "small" } },
    {
      type: "Button",
      props: { text: "隐私协议", variant: "link", size: "small", className: "px-0" },
      events: {
        onClick: [
          { action: "message", params: { messageType: "info", text: "演示环境未配置隐私协议页面" } },
        ],
      },
    },
  ],
};

/** 其他方式登录：分隔线 + 微信 / Telegram 入口 */
const thirdPartyNode: DslNode = {
  type: "Flex",
  props: { direction: "vertical", gap: "middle", className: "mt-6" },
  children: [
    {
      type: "Flex",
      props: { align: "center", gap: "middle" },
      children: [
        { type: "Separator", props: { className: "flex-1" } },
        { type: "Text", props: { text: "其他方式登录", type: "secondary", size: "small" } },
        { type: "Separator", props: { className: "flex-1" } },
      ],
    },
    {
      type: "Flex",
      props: { gap: "middle" },
      children: [
        {
          type: "Button",
          props: { text: "微信登录", icon: "message-circle", className: "flex-1" },
          events: {
            onClick: [
              { action: "message", params: { messageType: "info", text: "演示环境暂未接入微信登录" } },
            ],
          },
        },
        {
          type: "Button",
          props: { text: "Telegram 登录", icon: "share-2", className: "flex-1" },
          events: {
            onClick: [
              { action: "message", params: { messageType: "info", text: "演示环境暂未接入 Telegram 登录" } },
            ],
          },
        },
      ],
    },
  ],
};

/** 手机验证码登录表单（默认页签） */
const smsFormNode: DslNode = {
  type: "Form",
  // Field 在 vertical 布局自带 mb-2 与 mb-2 合计保持 16px 视觉间距
  props: { name: "smsLogin", className: "flex flex-col pt-2" },
  children: [
    // 表单项必须放 Field 内（label 归 Field；此处无 label 的 Field 仅作控件容器）
    {
      type: "Field",
      children: [
        {
          type: "Input",
          props: {
            name: "phone",
            placeholder: "请输入手机号",
            size: "large",
            // 记住账号回填：page.state.rememberedAccount 作为字段初始值
            value: "${state.rememberedAccount}",
            rules: [{ required: true, message: "请输入手机号" }],
          },
        },
      ],
    },
    { type: "Field", children: [{ type: "Checkbox", props: { name: "remember", label: "记住账号" } }] },
    {
      type: "Field",
      children: [
        {
          type: "Button",
          props: { submit: true, size: "large", variant: "primary", text: "登录", className: "w-full" },
        },
      ],
    },
  ],
  events: {
    onSubmit: [
      {
        id: "smsLogin",
        action: "auth.smsLogin",
        params: { phone: "${event.phone}", remember: "${event.remember}" },
      },
      {
        action: "if",
        params: {
          condition: "${actions.smsLogin != null && actions.smsLogin.ok == false}",
          then: [
            {
              action: "message",
              params: { messageType: "error", text: "请输入正确的 11 位手机号" },
            },
          ],
        },
      },
      {
        action: "if",
        params: {
          condition: "${actions.smsLogin != null && actions.smsLogin.ok == true}",
          then: [
            { action: "message", params: { messageType: "success", text: "登录成功，正在跳转…" } },
            { action: "navigate", params: { to: "/dashboard" } },
          ],
        },
      },
    ],
  },
};

/** 账号密码登录表单 */
const passwordFormNode: DslNode = {
  type: "Form",
  // Field 在 vertical 布局自带 mb-2，gap-2 与 mb-2 合计保持 16px 视觉间距
  props: { name: "passwordLogin", className: "flex flex-col pt-2" },
  children: [
    // 表单项必须放 Field 内（label 归 Field；此处无 label 的 Field 仅作控件容器）
    {
      type: "Field",
      children: [
        {
          type: "Input",
          props: {
            name: "username", size: "large",
            placeholder: "请输入账号",
            value: "${state.rememberedAccount}",
            rules: [{ required: true, message: "请输入账号" }],
          },
        },
      ],
    },
    {
      type: "Field",
      children: [
        {
          type: "Input",
          props: {
            name: "password",
            type: "password", size: "large",
            placeholder: "请输入密码",
            rules: [{ required: true, message: "请输入密码" }],
          },
        },
      ],
    },
    { type: "Field", children: [{ type: "Checkbox", props: { name: "remember", label: "记住账号" } }] },
    {
      type: "Field",
      children: [
        {
          type: "Button",
          props: { submit: true, size: "large", variant: "primary", text: "登录", className: "w-full" },
        },
      ],
    },
    {
      type: "Field",
      children: [
        {
          type: "Text",
          props: { text: "演示账号 admin / pactor123", type: "secondary", size: "small" },
        },
      ],
    },
  ],
  events: {
    onSubmit: [
      {
        id: "login",
        action: "auth.login",
        params: {
          username: "${event.username}",
          password: "${event.password}",
          remember: "${event.remember}",
        },
      },
      {
        action: "if",
        params: {
          condition: "${actions.login != null && actions.login.ok == false}",
          then: [
            {
              action: "message",
              params: {
                messageType: "error",
                text: "用户名或密码错误（演示账号 admin / pactor123）",
              },
            },
          ],
        },
      },
      {
        action: "if",
        params: {
          condition: "${actions.login != null && actions.login.ok == true}",
          then: [
            { action: "message", params: { messageType: "success", text: "登录成功，正在跳转…" } },
            { action: "navigate", params: { to: "/dashboard" } },
          ],
        },
      },
    ],
  },
};

/**
 * 默认登录节点（centered 及其余布局）：内置账号密码表单，
 * onSubmit → auth.login 动作（下方 actions 里注册的本地 mock）→
 * 命名结果经 ${actions.login} 读取，成功 message + navigate（嵌入模式退化为整页跳转）。
 */
const loginNode: DslNode = {
  type: "Login",
  props: {
    layout: "centered",
    brand: {
      name: "Pactor",
      title: "DSL 驱动的应用构建平台",
      description: "用 YAML 描述页面结构，以组件渲染一切。",
    },
    subtitle: "演示账号 admin / pactor123",
    registerLink: { text: "注册账号" },
    forgotLink: { text: "忘记密码" },
    footer: "© 2026 Pactor",
  },
  events: {
    onSubmit: [
      {
        id: "login",
        action: "auth.login",
        params: {
          username: "${event.username}",
          password: "${event.password}",
        },
      },
      {
        action: "if",
        params: {
          condition: "${actions.login != null && actions.login.ok == false}",
          then: [
            {
              action: "message",
              params: {
                messageType: "error",
                text: "用户名或密码错误（演示账号 admin / pactor123）",
              },
            },
          ],
        },
      },
      {
        action: "if",
        params: {
          condition: "${actions.login != null && actions.login.ok == true}",
          then: [
            {
              action: "message",
              params: {
                messageType: "success",
                text: "登录成功，正在跳转…",
              },
            },
            { action: "navigate", params: { to: "/dashboard" } },
          ],
        },
      },
    ],
    onRegisterClick: [
      {
        action: "message",
        params: { messageType: "info", text: "演示环境不开放注册" },
      },
    ],
    onForgotClick: [
      {
        action: "message",
        params: {
          messageType: "info",
          text: "演示环境请联系管理员重置密码",
        },
      },
    ],
  },
};

/**
 * 左右分栏（split）登录节点：认证区经 children 插槽自定义为
 * 注册引导行 + Tabs 双方式登录（手机验证码 / 账号密码，各自 Form 独立编排）+
 * 协议行 +「其他方式登录」分隔 + 微信 / Telegram 第三方入口（message 反馈）。
 * 记住账号：勾选后登录成功写入 localStorage，下次进入回填账号输入框。
 */
const splitLoginNode: DslNode = {
  type: "Login",
  props: {
    layout: "split",
    brand: {
      name: "Pactor",
      title: "DSL 驱动的应用构建平台",
      description: "用 YAML 描述页面结构，以组件渲染一切。",
    },
    title: "登录你的设计账号",
    footer: "© 2026 Pactor",
  },
  // 认证区插槽：注册引导行 + 双方式登录 Tabs + 协议行 + 第三方登录
  children: [
    {
      type: "Flex",
      props: { align: "center", gap: "small", className: "-mt-4 mb-4" },
      children: [
        { type: "Text", props: { text: "还没有账号？", type: "secondary", size: "small" } },
        {
          type: "Button",
          props: { text: "立即注册", variant: "link", size: "small" },
          events: {
            onClick: [
              { action: "message", params: { messageType: "info", text: "演示环境不开放注册" } },
            ],
          },
        },
        // { type: "Icon", props: { name: "help-circle", className: "text-muted-foreground" } },
      ],
    },
    {
      type: "Tabs",
      props: {
        items: [
          { key: "sms", label: "手机验证码登录", children: [smsFormNode] },
          { key: "password", label: "账号密码登录", children: [passwordFormNode] },
        ],
      },
    },
    agreementNode,
    thirdPartyNode,
  ],
};

const loginPage: PageDsl = {
  dsl: "1.0",
  page: {
    id: "login",
    title: "登录",
    name: "login",
    description: "Pactor 嵌入式登录页（Next.js 示例）",
  },
  children: [loginNode],
};

/** 演示账号（写死，仅示例；真实项目把 auth.login 换成 request 动作打后端接口） */
const DEMO_ACCOUNT = { username: "admin", password: "pactor123" };

/** 结构模式选项（对应 LoginVariant；缺省 centered） */
const LOGIN_LAYOUTS = [
  { value: "split", label: "左右分栏" },
  { value: "centered", label: "居中" },
  { value: "brand-card", label: "品牌卡片" },
  { value: "overlap", label: "叠压卡片" },
  { value: "backdrop", label: "渐变背景悬浮" },
] as const;

/** 认证区容器选项（authVariant；仅 split / centered 生效） */
const AUTH_VARIANTS = [
  { value: "card", label: "常规卡片" },
  { value: "float", label: "悬浮大卡" },
  { value: "plain", label: "裸表单" },
] as const;

/** 品牌区方向选项（brandSide；centered 无分栏不适用） */
const BRAND_SIDES = [
  { value: "left", label: "品牌在左" },
  { value: "right", label: "品牌在右" },
] as const;

type LayoutValue = (typeof LOGIN_LAYOUTS)[number]["value"];
type AuthValue = (typeof AUTH_VARIANTS)[number]["value"];
type SideValue = (typeof BRAND_SIDES)[number]["value"];

export function LoginClient() {
  // 样式由右上角下拉切换；初始值在挂载后从 URL 参数读取（保持 URL 可直达），
  // 避免 SSR 与首帧客户端渲染不一致导致的水合告警。
  const [layout, setLayout] = useState<LayoutValue | undefined>(undefined);
  const [authVariant, setAuthVariant] = useState<AuthValue | undefined>(undefined);
  const [brandSide, setBrandSide] = useState<SideValue | undefined>(undefined);
  const [wide, setWide] = useState(false);
  // 记住账号回填（localStorage 仅客户端可读，挂载后注入 page.state）
  const [rememberedAccount, setRememberedAccount] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const layoutParam = params.get("layout");
    const authParam = params.get("auth");
    const sideParam = params.get("side");
    if (LOGIN_LAYOUTS.some((v) => v.value === layoutParam)) {
      setLayout(layoutParam as LayoutValue);
    }
    if (AUTH_VARIANTS.some((v) => v.value === authParam)) {
      setAuthVariant(authParam as AuthValue);
    }
    if (BRAND_SIDES.some((v) => v.value === sideParam)) {
      setBrandSide(sideParam as SideValue);
    }
    setWide(params.get("ratio") === "0.6");
    setRememberedAccount(window.localStorage.getItem(REMEMBER_KEY) ?? "");
  }, []);

  const syncUrl = (key: string, value: string | undefined) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
    window.history.replaceState(null, "", url);
  };

  // 仅左右分栏（split）使用插槽形态；其余布局为内置账号密码表单
  const activeNode = layout === "split" ? splitLoginNode : loginNode;
  const page: PageDsl = {
    ...loginPage,
    state: { rememberedAccount },
    children: [
      {
        ...activeNode,
        props: {
          ...activeNode.props,
          ...(layout ? { layout } : {}),
          ...(authVariant ? { authVariant } : {}),
          ...(brandSide ? { brandSide } : {}),
          ...(wide ? { brandRatio: 0.6 } : {}),
        },
      },
    ],
  };

  /** 登录成功后按 remember 持久化/清除记住的账号 */
  const persistRemembered = (remember: unknown, account: unknown) => {
    if (remember === true && typeof account === "string" && account !== "") {
      window.localStorage.setItem(REMEMBER_KEY, account);
    } else {
      window.localStorage.removeItem(REMEMBER_KEY);
    }
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-xs text-neutral-600 shadow-sm backdrop-blur">
        登录样式
        <select
          aria-label="结构模式切换"
          value={layout ?? ""}
          onChange={(event) => {
            const value = (event.target.value || undefined) as LayoutValue | undefined;
            setLayout(value);
            syncUrl("layout", value);
          }}
          className="cursor-pointer bg-transparent outline-none"
        >
          <option value="">默认（居中）</option>
          {LOGIN_LAYOUTS.map((variant) => (
            <option key={variant.value} value={variant.value}>
              {variant.label}
            </option>
          ))}
        </select>
        <select
          aria-label="认证容器切换"
          value={authVariant ?? ""}
          onChange={(event) => {
            const value = (event.target.value || undefined) as AuthValue | undefined;
            setAuthVariant(value);
            syncUrl("auth", value);
          }}
          className="cursor-pointer bg-transparent outline-none"
        >
          <option value="">卡片默认</option>
          {AUTH_VARIANTS.map((variant) => (
            <option key={variant.value} value={variant.value}>
              {variant.label}
            </option>
          ))}
        </select>
        <select
          aria-label="品牌方向切换"
          value={brandSide ?? ""}
          onChange={(event) => {
            const value = (event.target.value || undefined) as SideValue | undefined;
            setBrandSide(value);
            syncUrl("side", value);
          }}
          className="cursor-pointer bg-transparent outline-none"
        >
          <option value="">方向默认</option>
          {BRAND_SIDES.map((side) => (
            <option key={side.value} value={side.value}>
              {side.label}
            </option>
          ))}
        </select>
        <label className="flex cursor-pointer items-center gap-1">
          <input
            type="checkbox"
            checked={wide}
            onChange={(event) => {
              setWide(event.target.checked);
              syncUrl("ratio", event.target.checked ? "0.6" : undefined);
            }}
          />
          宽品牌区
        </label>
      </div>
      <PactorPage
        // 记住账号挂载后经 page.state 注入；key 随其变化强制重建运行时，
        // 让表单字段以回填值作为初始值重新注册（React 否则会复用旧 Form 实例）
        key={`login-${rememberedAccount}`}
        pageDsl={page}
        actions={{
          // 本地 mock 登录：命名结果 data 写入 ${actions.login}
          "auth.login": async (action) => {
            const username = action.params?.["username"];
            const password = action.params?.["password"];
            await new Promise((resolve) => setTimeout(resolve, 500));
            if (
              username === DEMO_ACCOUNT.username &&
              password === DEMO_ACCOUNT.password
            ) {
              window.localStorage.setItem(
                "next-app-example.session",
                JSON.stringify({ token: "demo-token", user: { name: "admin" } }),
              );
              persistRemembered(action.params?.["remember"], username);
              return { ok: true as const, data: { ok: true } };
            }
            return { ok: true as const, data: { ok: false } };
          },
          // 本地 mock 验证码登录：演示环境校验手机号格式即放行（不发短信）
          "auth.smsLogin": async (action) => {
            const phone = action.params?.["phone"];
            await new Promise((resolve) => setTimeout(resolve, 500));
            if (typeof phone === "string" && /^1\d{10}$/.test(phone)) {
              window.localStorage.setItem(
                "next-app-example.session",
                JSON.stringify({ token: "demo-token", user: { name: phone } }),
              );
              persistRemembered(action.params?.["remember"], phone);
              return { ok: true as const, data: { ok: true } };
            }
            return { ok: true as const, data: { ok: false } };
          },
        }}
      />
    </>
  );
}
