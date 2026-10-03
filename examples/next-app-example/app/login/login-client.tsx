"use client";

import { useEffect, useState } from "react";
import type { DslNode, PageDsl } from "@pactor-app/core";
import { PactorPage } from "@pactor-app/app";

/**
 * 登录页 DSL（嵌入模式：不经路由/外壳，直接作为 React 组件挂在 Next.js 页面里）。
 * 页面结构由 business/Login 组件承载（品牌区 + 认证卡片 + 辅助入口 + 页脚）；
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

/** 品牌区方向选项（brandSide；仅 split 生效） */
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

  const page: PageDsl = {
    ...loginPage,
    children: [
      {
        ...loginNode,
        props: {
          ...loginNode.props,
          ...(layout ? { layout } : {}),
          ...(authVariant ? { authVariant } : {}),
          ...(brandSide ? { brandSide } : {}),
          ...(wide ? { brandRatio: 0.6 } : {}),
        },
      },
    ],
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
              return { ok: true as const, data: { ok: true } };
            }
            return { ok: true as const, data: { ok: false } };
          },
        }}
      />
    </>
  );
}
