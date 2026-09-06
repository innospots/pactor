// @vitest-environment node
import { describe, expect, it } from "vitest";

import { GET } from "./route";

describe("GET /api/dsl/badge", () => {
  it("返回 200 与 Alert DslNode（900ms 模拟延迟）", async () => {
    const res = await GET();
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toEqual({
      type: "Alert",
      props: {
        message: "本 Alert 由 /api/dsl/badge 端点下发的命名组件渲染",
        variant: "warning",
      },
    });
  });

  it("响应为 JSON content-type", async () => {
    const res = await GET();
    expect(res.headers.get("content-type")).toContain("application/json");
  });
});
