import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ChatClient } from "./chat-client";

/** 对话区头部的产物开关（关闭态 panel-right-open / 展开态 panel-right-close 图标按钮） */
function artifactToggle(container: HTMLElement): HTMLElement {
  const icon = container.querySelector(
    ".lucide-panel-right-open, .lucide-panel-right-close",
  )!;
  return icon.closest("button")! as HTMLElement;
}

/** 行内提及输入区（contenteditable，聊天框配置了 contexts 后启用） */
function composerField(): HTMLElement {
  return document.querySelector("[data-slot=mention-input]")! as HTMLElement;
}

/** 向输入区追加文本并把光标置于末尾（jsdom 无 contenteditable 默认编辑行为） */
function typeInComposer(text: string): void {
  const field = composerField();
  const node = document.createTextNode(text);
  field.appendChild(node);
  const range = document.createRange();
  range.setStart(node, text.length);
  range.collapse(true);
  const selection = window.getSelection()!;
  selection.removeAllRanges();
  selection.addRange(range);
  fireEvent.input(field);
}

function pressEnterInComposer(): void {
  fireEvent.keyDown(composerField(), { key: "Enter" });
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
    expect(await screen.findByText("已生成 1 个产物")).toBeTruthy();
    // 行内提及输入区（contenteditable）+ 占位提示
    expect(composerField()).toBeTruthy();
    expect(screen.getByText("输入消息，Enter 发送…")).toBeTruthy();

    // 产物区默认不展示；经头部开关展开后展示最新产物详情（extract.ts 为最新）
    await userEvent.setup().click(artifactToggle(container));
    expect(
      (await screen.findAllByText("extract_dialogue.ts")).length,
    ).toBeGreaterThanOrEqual(1);
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

  it("产物区默认关闭，可展开 / 再收起", async () => {
    const user = userEvent.setup();
    const { container } = render(<ChatClient />);

    await screen.findByText("已生成 1 个产物");
    expect(screen.queryByText("extract_dialogue.ts")).toBeNull();

    await user.click(artifactToggle(container));
    expect(
      (await screen.findAllByText("extract_dialogue.ts")).length,
    ).toBeGreaterThanOrEqual(1);

    // 展开后对话区重挂载，开关需重新查询
    await user.click(artifactToggle(container));
    expect(screen.queryByText("extract_dialogue.ts")).toBeNull();
  });

  it("发送消息：用户消息上屏，助手回复并生成新产物", async () => {
    const { container } = render(<ChatClient />);

    await screen.findByText("输入消息，Enter 发送…");
    typeInComposer("帮我写个标语");
    pressEnterInComposer();

    // chat.send（400ms）后 reload：回复出现
    expect(
      await screen.findByText(/已收到「帮我写个标语」/, undefined, {
        timeout: 3000,
      }),
    ).toBeTruthy();
    // 产物区默认关闭，展开后展示新产物详情
    await userEvent.setup().click(artifactToggle(container));
    expect(
      (await screen.findAllByText("帮我写个标语-方案.md")).length,
    ).toBeGreaterThanOrEqual(1);
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

  it("聊天框：模型 chip、上下文 / 附件入口、工作空间切换器与免责声明", async () => {
    render(<ChatClient />);
    // 等待消息加载（用例间共享模块级 store，可能存在多条产物计数文案）
    await screen.findAllByText("已生成 1 个产物");

    // 模型 chip（Composer 工具栏右端）
    expect(
      screen.getByRole("button", { name: "选择模型" }).textContent,
    ).toContain("demo-mock");
    // '+' 上下文与附件入口
    expect(screen.getByRole("button", { name: "添加上下文" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "添加附件" })).toBeTruthy();
    // composerFooter 工作空间切换器 + composerBottom 免责声明
    expect(screen.getByText("选择工作空间")).toBeTruthy();
    expect(screen.getByText("内容由 AI 生成，仅供参考")).toBeTruthy();
  });

  it("切换模型 + 引用上下文后发送，回复回显模型与上下文", async () => {
    const user = userEvent.setup();
    render(<ChatClient />);

    await screen.findByText("输入消息，Enter 发送…");
    await user.click(screen.getByRole("button", { name: "选择模型" }));
    await user.click(screen.getByRole("option", { name: "demo-pro" }));
    await user.click(screen.getByRole("button", { name: "添加上下文" }));
    await user.click(screen.getByText("记忆：偏好设置"));

    // 选中后输入区插入行内提及块（图标 + 文字、浅色背景圆角）
    const chip = composerField().querySelector("[data-mention-chip]")!;
    expect(chip.textContent).toContain("记忆：偏好设置");
    expect(chip.className).toContain("bg-muted");
    expect(chip.querySelector("svg")).not.toBeNull();

    typeInComposer("帮我总结下");
    pressEnterInComposer();

    // 回复开头回显「当前模型 / 引用上下文」（chat.send 400ms）；
    // 用例间共享模块级 store，可能有多条回显行，定位本条回复的那一条
    expect(
      await screen.findByText(/已收到「\+记忆：偏好设置 帮我总结下」/, undefined, { timeout: 3000 }),
    ).toBeTruthy();
    const noteLines = screen.getAllByText(/当前模型/);
    expect(
      noteLines.some(
        (el) =>
          el.textContent?.includes("demo-pro") &&
          el.textContent?.includes("引用上下文：记忆：偏好设置"),
      ),
    ).toBe(true);
    // 发送后行内提及块清空
    expect(composerField().querySelector("[data-mention-chip]")).toBeNull();
  });
});
