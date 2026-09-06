import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { GET as getBadge } from "../api/dsl/badge/route";
import { RemoteDemoClient } from "./remote-demo-client";

/** 把 http 引用 /api/dsl/badge 映射到 route handler 模块（顺带集成测试路由） */
function stubDslFetch() {
  vi.stubGlobal("fetch", async (input: unknown) => {
    const url =
      typeof input === "string"
        ? input
        : ((input as { url?: string })?.url ?? "");
    if (url.includes("/api/dsl/badge")) {
      return getBadge();
    }
    throw new Error(`测试中未预期的 fetch: ${url}`);
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("RemoteDemoClient（动态引用演示）", () => {
  it("内联节点立即渲染，远端卡片 / 徽标 / 通知按各自延迟依次落地", async () => {
    stubDslFetch();
    render(<RemoteDemoClient />);

    // 内联 Alert：同步渲染（页面运行时 ready 后即出现）
    expect(
      await screen.findByText("内联节点：同步渲染，无需等待", undefined, {
        timeout: 3000,
      }),
    ).toBeTruthy();

    // 远端卡片：service dsl.cardBody（600ms）
    expect(
      await screen.findByText("本卡片由 dsl.cardBody 服务下发", undefined, {
        timeout: 3000,
      }),
    ).toBeTruthy();
    expect(screen.getByText("远端卡片")).toBeTruthy();

    // 徽标：http 引用 /api/dsl/badge（900ms，经 stub 走 route handler）
    expect(
      await screen.findByText(
        "本 Alert 由 /api/dsl/badge 端点下发的命名组件渲染",
        undefined,
        { timeout: 3000 },
      ),
    ).toBeTruthy();

    // 通知：service dsl.notice（1200ms）
    expect(
      await screen.findByText("本通知由 dsl.notice 服务下发", undefined, {
        timeout: 3000,
      }),
    ).toBeTruthy();
  });
});
