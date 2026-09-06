import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { LoginClient } from "./login-client";

const SESSION_KEY = "next-app-example.session";

describe("LoginClient（嵌入模式登录页）", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("渲染登录卡片与表单（用户名 / 密码 / 登录按钮）", async () => {
    render(<LoginClient />);

    // 卡片标题与演示账号提示
    expect(await screen.findByText("Pactor 登录111")).toBeTruthy();
    expect(screen.getByText("演示账号 admin / pactor123")).toBeTruthy();
    // 表单字段与提交按钮
    expect(screen.getByLabelText("用户名")).toBeTruthy();
    expect(screen.getByLabelText("密码")).toHaveProperty("type", "password");
    expect(screen.getByRole("button", { name: "登 录" })).toBeTruthy();
  });

  it("空表单提交被 required 校验拦截，不触发 auth.login（无 session 写入）", async () => {
    const user = userEvent.setup();
    render(<LoginClient />);

    const submit = await screen.findByRole("button", { name: "登 录" });
    await user.click(submit);

    // 必填校验提示落地
    expect(await screen.findByText("请输入用户名")).toBeTruthy();
    expect(screen.getByText("请输入密码")).toBeTruthy();
    // 校验拦截：auth.login 未执行，无 session 写入
    expect(window.localStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it("错误凭据提交后出现错误提示，且不写入 session", async () => {
    const user = userEvent.setup();
    render(<LoginClient />);

    await user.type(await screen.findByLabelText("用户名"), "admin");
    await user.type(screen.getByLabelText("密码"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "登 录" }));

    // auth.login mock 延迟 500ms，随后走 message error 动作（经交互层渲染）
    expect(
      await screen.findByText(
        "用户名或密码错误（演示账号 admin / pactor123）",
        undefined,
        { timeout: 3000 },
      ),
    ).toBeTruthy();
    expect(window.localStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it("正确凭据提交后写入 demo-token session", async () => {
    const user = userEvent.setup();
    render(<LoginClient />);

    await user.type(await screen.findByLabelText("用户名"), "admin");
    await user.type(screen.getByLabelText("密码"), "pactor123");
    await user.click(screen.getByRole("button", { name: "登 录" }));

    // auth.login 500ms 后写入 localStorage；navigate 在 jsdom 仅产生
    // "Not implemented: navigation" virtual console 噪音，不抛错
    await waitFor(
      () => {
        const raw = window.localStorage.getItem(SESSION_KEY);
        expect(raw).not.toBeNull();
        expect(JSON.parse(raw!)).toEqual({
          token: "demo-token",
          user: { name: "admin" },
        });
      },
      { timeout: 3000 },
    );
  });
});
