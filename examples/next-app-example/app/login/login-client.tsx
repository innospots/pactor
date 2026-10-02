"use client";

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
    layout: "centered-card",
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

export function LoginClient() {
  // 演示：?layout=split-card-float 等可切换 10 种布局（见 LoginVariant）
  const layout =
    typeof window === "undefined"
      ? undefined
      : ((new URLSearchParams(window.location.search).get("layout") ??
          undefined) as never);
  const page: PageDsl = {
    ...loginPage,
    children: [
      {
        ...loginNode,
        props: { ...loginNode.props, ...(layout ? { layout } : {}) },
      },
    ],
  };
  return (
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
  );
}
