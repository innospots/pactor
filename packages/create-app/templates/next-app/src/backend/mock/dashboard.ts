const MODEL_NAMES = ["通用文本模型", "行业知识模型", "轻量推理模型", "多模态模型"];
const CLIENT_NAMES = ["运营中台", "数据分析服务", "智能客服", "内部工具"];

export function GET() {
  const now = new Date();
  const trend = Array.from({ length: 12 }, (_, index) => {
    const hour = (now.getHours() - 11 + index + 24) % 24;
    return {
      t: `${String(hour).padStart(2, "0")}:00`,
      requests: 680 + index * 84 + ((index * 37) % 190),
      tokens: 24800 + index * 2160 + ((index * 311) % 4200),
      cost: 15 + index * 1.28,
      latency: 248 + ((index * 29) % 82),
    };
  });

  return Response.json(
    {
      stats: {
        requests: 128640,
        activeClients: 16,
        tokens: "8.42M",
        successRate: 99.2,
        failures: 1032,
        errorRate: 0.8,
        avgLatency: 286,
        cost: "¥ 2,486.20",
        avgCost: "¥ 0.019",
      },
      realtime: { rpm: 326, tpm: 12480 },
      trend,
      metricKeys: {
        requests: ["requests"],
        tokens: ["tokens"],
        cost: ["cost"],
        latency: ["latency"],
      },
      models: MODEL_NAMES.map((name, index) => ({
        name,
        percent: [38, 27, 21, 14][index],
      })),
      clients: CLIENT_NAMES.map((name, index) => ({
        name,
        percent: [34, 26, 23, 17][index],
      })),
    },
    { headers: { "cache-control": "no-store" } },
  );
}
