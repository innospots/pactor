#!/usr/bin/env node
/**
 * 模块 API 运行时冒烟：验证 /api/modules/<moduleId>/* 分发契约。
 * 用法：SHELL_BASE_URL=http://127.0.0.1:9020 node scripts/smoke-module-api.mjs
 */
const BASE = process.env.SHELL_BASE_URL ?? "http://127.0.0.1:9020";
const MODULE = "pactor-app-risk-analysis";
const DATA_VALUE = `${BASE}/api/modules/${MODULE}/risk-analysis/data-value?start=2026-08-12&end=2026-08-12`;
const SUMMARY = `${BASE}/api/modules/${MODULE}/risk-analysis/feature-source-summary?page=2&pageSize=10&start=2026-08-12&end=2026-08-12`;

const failures = [];

function check(name, condition, detail = "") {
  if (condition) {
    console.log(`  ✓ ${name}`);
  } else {
    failures.push(`${name}${detail ? `（${detail}）` : ""}`);
    console.log(`  ✗ ${name}${detail ? `（${detail}）` : ""}`);
  }
}

async function main() {
  console.log(`[smoke] ${BASE}`);

  const dataValue = await fetch(DATA_VALUE);
  const dataValueBody = await dataValue.json();
  check("GET data-value → 200", dataValue.status === 200, `status=${dataValue.status}`);
  check("data-value code=0", dataValueBody.code === 0);
  check(
    "data-value 回显 range",
    dataValueBody.data?.range?.start === "2026-08-12" &&
      dataValueBody.data?.range?.end === "2026-08-12",
  );
  check(
    "data-value cache-control=no-store",
    dataValue.headers.get("cache-control") === "no-store",
    dataValue.headers.get("cache-control") ?? "missing",
  );

  const summary = await fetch(SUMMARY);
  const summaryBody = await summary.json();
  check("GET feature-source-summary → 200", summary.status === 200);
  check("分页参数生效", summaryBody.data?.page === 2 && summaryBody.data?.pageSize === 10);

  const head = await fetch(DATA_VALUE, { method: "HEAD" });
  const headText = await head.text();
  check("HEAD → 200 且无响应体", head.status === 200 && headText === "", `status=${head.status}, len=${headText.length}`);

  const options = await fetch(DATA_VALUE, { method: "OPTIONS" });
  const allow = options.headers.get("allow") ?? "";
  check("OPTIONS → 204", options.status === 204, `status=${options.status}`);
  check(
    "OPTIONS Allow 含 GET/HEAD/OPTIONS 且不含 POST",
    allow.includes("GET") && allow.includes("HEAD") && allow.includes("OPTIONS") && !allow.includes("POST"),
    allow,
  );

  const post = await fetch(DATA_VALUE, { method: "POST" });
  const postAllow = post.headers.get("allow") ?? "";
  check("POST → 405", post.status === 405, `status=${post.status}`);
  check("POST Allow 与 OPTIONS 一致", postAllow === allow, postAllow);

  const cases = [
    ["未知模块", `${BASE}/api/modules/nope/risk-analysis/data-value`, 404],
    ["未知路径", `${BASE}/api/modules/${MODULE}/risk-analysis/nope`, 404],
    ["模块根路径", `${BASE}/api/modules/${MODULE}`, 404],
    ["前缀外路径", `${BASE}/api/modules/${MODULE}/api/runtime/bootstrap`, 404],
    ["旧业务路径", `${BASE}/api/risk-analysis/data-value`, 404],
    ["无 server 的 risk-decision", `${BASE}/api/modules/pactor-app-risk-decision/risk-decision/data`, 404],
  ];
  for (const [name, url, expected] of cases) {
    const response = await fetch(url);
    check(`${name} → ${expected}`, response.status === expected, `status=${response.status}`);
  }

  const bootstrap = await fetch(`${BASE}/api/runtime/bootstrap`);
  check("/api/runtime/bootstrap 仍可用", bootstrap.status === 200);

  const page = await fetch(`${BASE}/pactor-app-risk-analysis`);
  check("风险分析页面可访问", page.status === 200);

  if (failures.length > 0) {
    console.error(`\n[smoke] 失败 ${failures.length} 项：\n- ${failures.join("\n- ")}`);
    process.exit(1);
  }
  console.log("\n[smoke] 全部通过");
}

main().catch((error) => {
  console.error("[smoke] 异常", error);
  process.exit(1);
});
