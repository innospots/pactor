#!/usr/bin/env node
/**
 * 模块 API 运行时冒烟：验证 /api/modules/<moduleId>/* 分发契约。
 * 用法：SHELL_BASE_URL=http://127.0.0.1:9020 node scripts/smoke-module-api.mjs
 */
const BASE = process.env.SHELL_BASE_URL ?? "http://127.0.0.1:9020";
const MODULE = "pactor-app-general-app";
const API = `${BASE}/api/modules/${MODULE}/general-app/dashboard`;

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

  const dashboard = await fetch(API);
  const dashboardBody = await dashboard.json();
  check("GET dashboard → 200", dashboard.status === 200, `status=${dashboard.status}`);
  check("dashboard 返回指标数据", dashboardBody?.stats?.requests > 0);
  check(
    "dashboard cache-control=no-store",
    dashboard.headers.get("cache-control") === "no-store",
    dashboard.headers.get("cache-control") ?? "missing",
  );

  const head = await fetch(API, { method: "HEAD" });
  const headText = await head.text();
  check("HEAD → 200 且无响应体", head.status === 200 && headText === "", `status=${head.status}, len=${headText.length}`);

  const options = await fetch(API, { method: "OPTIONS" });
  const allow = options.headers.get("allow") ?? "";
  check("OPTIONS → 204", options.status === 204, `status=${options.status}`);
  check(
    "OPTIONS Allow 含 GET/HEAD/OPTIONS",
    allow.includes("GET") && allow.includes("HEAD") && allow.includes("OPTIONS"),
    allow,
  );

  const post = await fetch(API, { method: "POST" });
  check("POST（dashboard 仅支持 GET）→ 405", post.status === 405, `status=${post.status}`);

  const cases = [
    ["未知模块", `${BASE}/api/modules/nope/general-app/dashboard`, 404],
    ["未知路径", `${BASE}/api/modules/${MODULE}/general-app/nope`, 404],
    ["模块根路径", `${BASE}/api/modules/${MODULE}`, 404],
    ["前缀外路径", `${BASE}/api/modules/${MODULE}/api/runtime/bootstrap`, 404],
    ["旧业务路径", `${BASE}/api/general-app/dashboard`, 404],
    ["无 server 的 product-center", `${BASE}/api/modules/pactor-app-product-center/product-center/products`, 404],
  ];
  for (const [name, url, expected] of cases) {
    const response = await fetch(url);
    check(`${name} → ${expected}`, response.status === expected, `status=${response.status}`);
  }

  const bootstrap = await fetch(`${BASE}/api/runtime/bootstrap`);
  check("/api/runtime/bootstrap 仍可用", bootstrap.status === 200);

  const page = await fetch(`${BASE}/data-analysis/dashboard`);
  check("数据分析页面可访问", page.status === 200);

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
