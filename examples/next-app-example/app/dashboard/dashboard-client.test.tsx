import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { GET as getDetailPanel } from "../api/dsl/detail-panel/route";
import { DashboardClient } from "./dashboard-client";

/** 把 http 引用 /api/dsl/detail-panel 映射到 route handler 模块（顺带集成测试路由） */
function stubDslFetch() {
  vi.stubGlobal("fetch", async (input: unknown) => {
    const url =
      typeof input === "string"
        ? input
        : ((input as { url?: string })?.url ?? "");
    if (url.includes("/api/dsl/detail-panel")) {
      return getDetailPanel();
    }
    throw new Error(`测试中未预期的 fetch: ${url}`);
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("DashboardClient（工作台）", () => {
  it("渲染 Layout（Header / Sider 菜单 / Content）", async () => {
    stubDslFetch();
    render(<DashboardClient />);

    // Header
    expect(await screen.findByText("Pactor 工作台")).toBeTruthy();
    // Sider 菜单（static dataSource）
    expect(screen.getByText("客户管理")).toBeTruthy();
    expect(screen.getByText("订单管理")).toBeTruthy();
    expect(screen.getByText("报表统计")).toBeTruthy();
    // Footer
    expect(screen.getByText("Pactor Admin Demo © 2026")).toBeTruthy();
  });

  it("customers 表渲染出行数据，service 引用表头区落地", async () => {
    stubDslFetch();
    render(<DashboardClient />);

    // customer.list（300ms）
    expect(await screen.findByText("云栖科技")).toBeTruthy();
    expect(screen.getByText("远山生物")).toBeTruthy();
    expect(screen.getByText("恒星能源")).toBeTruthy();
    expect(screen.getByText("绿洲农业")).toBeTruthy();
    // dsl.listHeader（400ms）下发的说明区
    expect(
      await screen.findByText(
        "本说明区由 dsl.listHeader 服务下发；点击行内「查看」联动右侧详情",
        undefined,
        { timeout: 3000 },
      ),
    ).toBeTruthy();
  });

  it("Header 结构区域渲染（品牌/菜单/下拉/语言/用户区），点选菜单弹出提示", async () => {
    stubDslFetch();
    const user = userEvent.setup();
    const { container } = render(<DashboardClient />);

    // 品牌区：logo + 标题
    expect(await screen.findByText("Pactor 工作台")).toBeTruthy();
    expect(container.querySelector('img[src="/next.svg"]')).toBeTruthy();
    // 菜单项图标渲染于文字前（icon: "home" → 按钮内首个子节点为 [data-slot=icon]）
    const homeItem = screen.getByText("首页");
    const icon = homeItem.querySelector('[data-slot="icon"]');
    expect(icon).toBeTruthy();
    expect(homeItem.firstChild).toBe(icon);
    // 横向菜单（含子菜单触发器）、右侧下拉、语言切换、用户区
    expect(screen.getByText("文档")).toBeTruthy();
    expect(screen.getByText("产品")).toBeTruthy();
    expect(screen.getByText("切换团队")).toBeTruthy();
    expect(screen.getByText("中文")).toBeTruthy();
    expect(screen.getByText("管理员")).toBeTruthy();

    // 点选叶子菜单项 → onMenuSelect 传出 key → message 提示
    await user.click(screen.getByText("文档"));
    expect(await screen.findByText("菜单：docs")).toBeTruthy();
  });

  it("点击第二行「查看」联动详情面板（customer.detail → 李华）", async () => {
    stubDslFetch();
    const user = userEvent.setup();
    render(<DashboardClient />);

    // 等待表格数据（300ms）与 http 引用详情面板（500ms）落地
    await screen.findByText("云栖科技");
    await screen.findByText("客户详情", undefined, { timeout: 3000 });

    // 初始 selectedId=1：详情面板展示张明；李华仅出现在表格第二行（1 处）
    await waitFor(() =>
      expect(screen.getAllByText("张明").length).toBeGreaterThanOrEqual(2),
    );
    expect(screen.getAllByText("李华")).toHaveLength(1);

    // 点击第二行「查看」→ setState + reload → customer.detail(id=2)
    const viewButtons = screen.getAllByRole("button", { name: "查看" });
    expect(viewButtons.length).toBe(4);
    await user.click(viewButtons[1]);

    // 详情面板刷新后，李华同时出现在详情区（共 2 处）
    await waitFor(
      () => expect(screen.getAllByText("李华")).toHaveLength(2),
      { timeout: 3000 },
    );
  });
});
