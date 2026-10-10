import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { LoginClient } from "./login-client";

const SESSION_KEY = "next-app-example.session";
const REMEMBER_KEY = "next-app-example.remembered-account";

/** 右上角切换为「左右分栏」（split 使用插槽形态），并等待布局落地 */
async function switchToSplit(user: ReturnType<typeof userEvent.setup>) {
  const select = await screen.findByRole("combobox", { name: "结构模式切换" });
  await user.selectOptions(select, "split");
  await waitFor(() =>
    expect(document.querySelector('[data-layout="split"]')).not.toBeNull(),
  );
}

describe("LoginClient（嵌入模式登录页）", () => {
  beforeEach(() => {
    window.localStorage.clear();
    // jsdom 的 location 在同一文件的用例间共享：样式切换器会写 ?layout=split，
    // 需重置 URL 避免后续用例读到残留参数
    window.history.replaceState(null, "", "/login");
  });

  it("默认（居中）渲染内置账号密码表单：品牌区 / 用户名 / 密码 / 登录按钮 / 辅助入口", async () => {
    render(<LoginClient />);

    expect(await screen.findAllByText("Pactor")).not.toHaveLength(0);
    expect(screen.getByText("演示账号 admin / pactor123")).toBeTruthy();
    expect(screen.getByPlaceholderText("请输入用户名")).toBeTruthy();
    expect(screen.getByPlaceholderText("请输入密码")).toHaveProperty("type", "password");
    expect(screen.getByRole("button", { name: "登 录" })).toBeTruthy();
    expect(screen.getByText("注册账号")).toBeTruthy();
    expect(screen.getByText("忘记密码")).toBeTruthy();
    // 非分栏布局不渲染插槽 Tabs
    expect(screen.queryByRole("tab", { name: "手机验证码登录" })).toBeNull();
  });

  it("内置表单：空表单提交被 required 校验拦截，不触发 auth.login（无 session 写入）", async () => {
    const user = userEvent.setup();
    render(<LoginClient />);

    const submit = await screen.findByRole("button", { name: "登 录" });
    await user.click(submit);

    expect(await screen.findByText("请输入用户名")).toBeTruthy();
    expect(screen.getByText("请输入密码")).toBeTruthy();
    expect(window.localStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it("内置表单：错误凭据提交后出现错误提示，且不写入 session", async () => {
    const user = userEvent.setup();
    render(<LoginClient />);

    await user.type(await screen.findByPlaceholderText("请输入用户名"), "admin");
    await user.type(screen.getByPlaceholderText("请输入密码"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "登 录" }));

    expect(
      await screen.findByText(
        "用户名或密码错误（演示账号 admin / pactor123）",
        undefined,
        { timeout: 3000 },
      ),
    ).toBeTruthy();
    expect(window.localStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it("左右分栏（split）：认证区为插槽形态（注册引导 / Tabs / 协议行 / 第三方入口）", async () => {
    const user = userEvent.setup();
    render(<LoginClient />);
    await switchToSplit(user);

    expect(await screen.findByText("登录你的设计账号")).toBeTruthy();
    expect(screen.getByText("还没有账号？")).toBeTruthy();
    expect(screen.getByRole("button", { name: "立即注册" })).toBeTruthy();
    expect(
      screen.getByRole("tab", { name: "手机验证码登录" }),
    ).toBeTruthy();
    expect(screen.getByRole("tab", { name: "账号密码登录" })).toBeTruthy();
    expect(screen.getByPlaceholderText("请输入手机号")).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: "记住账号" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "登录" })).toBeTruthy();
    expect(screen.getByText(/点击「登录」表示已阅读并同意/)).toBeTruthy();
    expect(screen.getByText("其他方式登录")).toBeTruthy();
    expect(screen.getByRole("button", { name: "微信登录" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Telegram 登录" })).toBeTruthy();
    // 插槽替换内置表单
    expect(screen.queryByPlaceholderText("请输入用户名")).toBeNull();
  });

  it("split 手机验证码页签：空表单被 required 校验拦截，不写 session", async () => {
    const user = userEvent.setup();
    render(<LoginClient />);
    await switchToSplit(user);

    await user.click(await screen.findByRole("button", { name: "登录" }));

    expect(await screen.findByText("请输入手机号")).toBeTruthy();
    expect(window.localStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it("split 手机验证码页签：手机号格式错误提示报错，不写 session", async () => {
    const user = userEvent.setup();
    render(<LoginClient />);
    await switchToSplit(user);

    await user.type(await screen.findByPlaceholderText("请输入手机号"), "123");
    await user.click(screen.getByRole("button", { name: "登录" }));

    expect(
      await screen.findByText("请输入正确的 11 位手机号", undefined, {
        timeout: 3000,
      }),
    ).toBeTruthy();
    expect(window.localStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it("split 手机号登录成功写入 session，勾选记住账号持久化手机号", async () => {
    const user = userEvent.setup();
    render(<LoginClient />);
    await switchToSplit(user);

    await user.type(await screen.findByPlaceholderText("请输入手机号"), "13800001111");
    await user.click(screen.getByRole("checkbox", { name: "记住账号" }));
    await user.click(screen.getByRole("button", { name: "登录" }));

    await waitFor(
      () => {
        const raw = window.localStorage.getItem(SESSION_KEY);
        expect(raw).not.toBeNull();
        expect(JSON.parse(raw!)).toEqual({
          token: "demo-token",
          user: { name: "13800001111" },
        });
        expect(window.localStorage.getItem(REMEMBER_KEY)).toBe("13800001111");
      },
      { timeout: 3000 },
    );
  });

  it("split 切换到账号密码页签：正确凭据写入 demo-token session", async () => {
    const user = userEvent.setup();
    render(<LoginClient />);
    await switchToSplit(user);

    await user.click(await screen.findByRole("tab", { name: "账号密码登录" }));
    await user.type(await screen.findByPlaceholderText("请输入账号"), "admin");
    await user.type(screen.getByPlaceholderText("请输入密码"), "pactor123");
    await user.click(screen.getByRole("button", { name: "登录" }));

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

  it("split 记住的账号在下次进入页面时回填到账号输入框", async () => {
    window.localStorage.setItem(REMEMBER_KEY, "13912345678");
    const user = userEvent.setup();
    render(<LoginClient />);
    await switchToSplit(user);

    // 挂载后回填经 page.state 注入会重建运行时，需在断言内重新查询节点
    await screen.findByPlaceholderText("请输入手机号");
    await waitFor(() =>
      expect(screen.getByPlaceholderText("请输入手机号")).toHaveProperty(
        "value",
        "13912345678",
      ),
    );
  });

  it("右上角下拉框切换登录页样式（backdrop → 切回默认）", async () => {
    const user = userEvent.setup();
    render(<LoginClient />);

    const select = await screen.findByRole("combobox", {
      name: "结构模式切换",
    });
    // 默认居中（页面 DSL 的 layout 基线；异步挂载经 waitFor 等待落地）
    await waitFor(() =>
      expect(
        document.querySelector('[data-layout="centered"]'),
      ).not.toBeNull(),
    );

    await user.selectOptions(select, "backdrop");
    await waitFor(() =>
      expect(document.querySelector('[data-layout="backdrop"]')).not.toBeNull(),
    );
    // backdrop 等非分栏布局仍是内置表单，不渲染插槽 Tabs
    expect(screen.queryByRole("tab", { name: "手机验证码登录" })).toBeNull();
    expect(
      document.querySelector('[data-layout="centered"]'),
    ).toBeNull();

    await user.selectOptions(select, "");
    await waitFor(() =>
      expect(document.querySelector('[data-layout="backdrop"]')).toBeNull(),
    );
    await waitFor(() =>
      expect(
        document.querySelector('[data-layout="centered"]'),
      ).not.toBeNull(),
    );
  });
});
