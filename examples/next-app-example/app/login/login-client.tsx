"use client";

import type { PageDsl } from "@pactor-app/core";
import { PactorPage } from "@pactor-app/app";

/**
 * 登录页 DSL（嵌入模式：不经路由/外壳，直接作为 React 组件挂在 Next.js 页面里）。
 * Form 提交 → auth.login 动作（下方 actions 里注册的本地 mock）→
 * 命名结果经 ${actions.login} 读取，成功 message + navigate（嵌入模式退化为整页跳转）。
 */
const loginPage: PageDsl = {
  dsl: "1.0",
  page: {
    id: "login",
    title: "登录",
    name: "login",
    description: "Pactor 嵌入式登录页（Next.js 示例）",
  },
  children: [
    {
      type: "Card",
      props: {
        title: "Pactor 登录111",
        style: { width: 380, margin: "auto", marginTop: 120 },
      },
      children: [
        {
          type: "Alert",
          props: {
            message: "演示账号 admin / pactor123",
            variant: "info",
          },
        },
        {
          type: "Form",
          props: { name: "login", style: { marginTop: 16 } },
          events: {
            onSubmit: [
              {
                id: "login",
                action: "auth.login",
                params: {
                  username: "${form.username}",
                  password: "${form.password}",
                },
              },
              {
                action: "if",
                params: {
                  condition:
                    "${actions.login != null && actions.login.ok == false}",
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
                  condition:
                    "${actions.login != null && actions.login.ok == true}",
                  then: [
                    {
                      action: "message",
                      params: { messageType: "success", text: "登录成功，正在跳转…" },
                    },
                    { action: "navigate", params: { to: "/dashboard" } },
                  ],
                },
              },
            ],
          },
          children: [
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
              type: "Button",
              props: {
                text: "登 录",
                variant: "primary",
                submit: true,
                size: "large",
                style: { width: "100%", marginTop: 8 },
              },
            },
          ],
        },
      ],
    },
  ],
};

/** 演示账号（写死，仅示例；真实项目把 auth.login 换成 request 动作打后端接口） */
const DEMO_ACCOUNT = { username: "admin", password: "pactor123" };

export function LoginClient() {
  return (
    <PactorPage
      pageDsl={loginPage}
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
