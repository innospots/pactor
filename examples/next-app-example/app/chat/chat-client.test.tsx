import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ChatClient } from "./chat-client";

/** 对话区头部的产物开关（panel-right-open 图标按钮） */
function artifactToggle(container: HTMLElement): HTMLElement {
  return container
    .querySelector(".lucide-panel-right-open")!
    .closest("button")! as HTMLElement;
}

describe("ChatClient（对话页）", () => {
  it("渲染图标栏、展开菜单区、对话区与产物区", async () => {
    const { container } = render(<ChatClient />);

    // 展开菜单区：品牌 + 图标文字菜单
    expect(screen.getByText("Pactor Chat")).toBeTruthy();
    expect(screen.getByText("发现应用")).toBeTruthy();
    expect(screen.getByText("助理")).toBeTruthy();
    expect(screen.getByText("定时任务")).toBeTruthy();

    // 图标栏：仅图标按钮（square-pen 等 lucide 图标，无文字）
    expect(container.querySelector(".lucide-square-pen")).toBeTruthy();
    expect(container.querySelector(".lucide-database")).toBeTruthy();

    // 任务会话列表（chat.conversations service，150ms）
    expect(await screen.findByText("检查保健品群聊骗局剧本")).toBeTruthy();

    // 对话区：会话标题 + 历史消息（chat.messages service）
    expect(await screen.findByText("小 P")).toBeTruthy();
    expect(
      screen.getByPlaceholderText("输入消息，Enter 发送…"),
    ).toBeTruthy();

    // 产物区：产物菜单项 + 默认展示最新产物详情（菜单 label 与预览标题同名 → 多处）
    expect(
      (await screen.findAllByText("extract_dialogue.ts")).length,
    ).toBeGreaterThanOrEqual(2);
    expect(await screen.findByText("骗局风险分析报告.md")).toBeTruthy();
  });

  it("图标栏 hover（focus）在图标右侧展示菜单名 Tooltip", async () => {
    const { container } = render(<ChatClient />);

    const railTrigger = container
      .querySelector(".lucide-square-pen")!
      .closest("[data-slot=tooltip-trigger-wrap]")!;
    fireEvent.focus(railTrigger);

    const tip = await screen.findByText("新建任务", {
      selector: "[data-slot=tooltip-content]",
    });
    expect(tip.closest("[data-side]")?.getAttribute("data-side")).toBe("right");
  });

  it("产物区可隐藏 / 再展示", async () => {
    const user = userEvent.setup();
    const { container } = render(<ChatClient />);

    await screen.findAllByText("extract_dialogue.ts");

    await user.click(artifactToggle(container));
    expect(screen.queryByText("extract_dialogue.ts")).toBeNull();

    // 隐藏后对话区重挂载，开关需重新查询
    await user.click(artifactToggle(container));
    expect(
      (await screen.findAllByText("extract_dialogue.ts")).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("发送消息：用户消息上屏，助手回复并生成新产物", async () => {
    render(<ChatClient />);

    const input = await screen.findByPlaceholderText("输入消息，Enter 发送…");
    fireEvent.change(input, { target: { value: "帮我写个标语" } });
    fireEvent.keyDown(input, { key: "Enter" });

    // chat.send（400ms）后 reload：回复与产物出现
    expect(
      await screen.findByText(/已收到「帮我写个标语」/, undefined, {
        timeout: 3000,
      }),
    ).toBeTruthy();
    // 新产物同时出现在产物菜单与预览标题
    expect(
      (await screen.findAllByText("帮我写个标语-方案.md")).length,
    ).toBeGreaterThanOrEqual(2);
  });

  it("新建任务：图标栏按钮创建空会话并切换（展示 Welcome）", async () => {
    const user = userEvent.setup();
    const { container } = render(<ChatClient />);

    await screen.findByText("检查保健品群聊骗局剧本");

    const railTrigger = container
      .querySelector(".lucide-square-pen")!
      .closest("[data-slot=tooltip-trigger-wrap]")!;
    await user.click(railTrigger.querySelector("button")!);

    // 新会话无消息 → Welcome 空态 + 会话列表出现「新任务」
    expect(await screen.findByText("新任务")).toBeTruthy();
    expect(await screen.findByText("有什么可以帮你？")).toBeTruthy();
  });
});
