// @vitest-environment node
import { describe, expect, it } from "vitest";

import { GET } from "./route";

describe("GET /api/dsl/detail-panel", () => {
  it("返回 200 与 Card DslNode（500ms 模拟延迟）", async () => {
    const res = await GET();
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.type).toBe("Card");
    expect(body.props.title).toBe("客户详情");
    expect(body.props.style).toEqual({ flex: 1 });
  });

  it("children 为 3 个 Statistic，value 保留 ${data.detail.x} 表达式占位", async () => {
    const res = await GET();
    const body = await res.json();

    expect(body.children).toHaveLength(3);
    const titles = body.children.map(
      (c: { props: { title: string } }) => c.props.title,
    );
    expect(titles).toEqual(["联系人", "等级", "电话"]);

    for (const child of body.children) {
      expect(child.type).toBe("Statistic");
    }
    expect(body.children[0].props.value).toBe("${data.detail.contact}");
    expect(body.children[1].props.value).toBe("${data.detail.level}");
    expect(body.children[2].props.value).toBe("${data.detail.phone}");
  });
});
