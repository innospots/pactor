module.exports = [
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[project]/starters/apps-shell-starter/web-shell/.generated/pactor/assembly.json.[json].cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    "generatedAt": "2026-11-03T01:49:41.414Z",
    "modules": [
        {
            "id": "pactor-app-risk-analysis",
            "name": "risk-analysis",
            "package": "risk-analysis",
            "version": "0.1.0",
            "basePath": "/pactor-app-risk-analysis"
        },
        {
            "id": "pactor-app-risk-decision",
            "name": "risk-decision",
            "package": "risk-decision",
            "version": "0.1.0",
            "basePath": "/pactor-app-risk-decision"
        }
    ],
    "routes": [
        {
            "publicPath": "/pactor-app-risk-analysis",
            "moduleId": "pactor-app-risk-analysis",
            "pageId": "risk-data-value",
            "globalPageId": "pactor-app-risk-analysis:risk-data-value",
            "pattern": "/pactor-app-risk-analysis",
            "paramNames": []
        },
        {
            "publicPath": "/pactor-app-risk-decision",
            "moduleId": "pactor-app-risk-decision",
            "pageId": "risk-decision",
            "globalPageId": "pactor-app-risk-decision:risk-decision",
            "pattern": "/pactor-app-risk-decision",
            "paramNames": []
        },
        {
            "publicPath": "/pactor-app-risk-decision/integration-logs",
            "moduleId": "pactor-app-risk-decision",
            "pageId": "integration-logs",
            "globalPageId": "pactor-app-risk-decision:integration-logs",
            "pattern": "/pactor-app-risk-decision/integration-logs",
            "paramNames": []
        }
    ]
};
}),
"[project]/starters/apps-shell-starter/web-shell/.generated/pactor/menus.json.[json].cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    "menus": [
        {
            "id": "risk-analysis",
            "type": "page",
            "pageId": "pactor-app-risk-analysis:risk-data-value",
            "path": "/pactor-app-risk-analysis",
            "title": "风险分析",
            "icon": "chart",
            "order": 1,
            "public": true
        },
        {
            "id": "risk-decision",
            "type": "page",
            "pageId": "pactor-app-risk-decision:risk-decision",
            "path": "/pactor-app-risk-decision",
            "title": "风险决策",
            "icon": "shield",
            "order": 2,
            "public": true
        },
        {
            "id": "risk-analysis",
            "type": "page",
            "pageId": "pactor-app-risk-analysis:risk-data-value",
            "title": "风险分析",
            "icon": "chart",
            "public": true,
            "hidden": true
        },
        {
            "id": "risk-decision",
            "type": "page",
            "pageId": "pactor-app-risk-decision:risk-decision",
            "title": "风险决策",
            "icon": "shield",
            "public": true,
            "hidden": true
        },
        {
            "id": "integration-logs",
            "type": "page",
            "pageId": "pactor-app-risk-decision:integration-logs",
            "title": "对接日志",
            "icon": "file-text",
            "public": true,
            "hidden": true
        }
    ]
};
}),
"[project]/starters/apps-shell-starter/web-shell/.generated/pactor/pages.json.[json].cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    "pages": [
        {
            "globalPageId": "pactor-app-risk-analysis:risk-data-value",
            "moduleId": "pactor-app-risk-analysis",
            "pageId": "risk-data-value",
            "path": "/pactor-app-risk-analysis",
            "title": "数据价值分析工作台",
            "version": 1,
            "public": true,
            "dslRef": "dsl/pactor-app-risk-analysis/risk-data-value.yaml"
        },
        {
            "globalPageId": "pactor-app-risk-decision:risk-decision",
            "moduleId": "pactor-app-risk-decision",
            "pageId": "risk-decision",
            "path": "/pactor-app-risk-decision",
            "title": "总览",
            "version": 1,
            "public": true,
            "dslRef": "dsl/pactor-app-risk-decision/risk-decision.yaml"
        },
        {
            "globalPageId": "pactor-app-risk-decision:integration-logs",
            "moduleId": "pactor-app-risk-decision",
            "pageId": "integration-logs",
            "path": "/pactor-app-risk-decision/integration-logs",
            "title": "对接日志",
            "version": 1,
            "public": true,
            "dslRef": "dsl/pactor-app-risk-decision/integration-logs.yaml"
        }
    ]
};
}),
"[project]/starters/apps-shell-starter/web-shell/.generated/pactor/sitemap-meta.json.[json].cjs [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    "layout": "shell",
    "dslVersion": "1.0",
    "app": {
        "name": "InnoSpots"
    },
    "auth": {
        "loginPath": "/login"
    },
    "layouts": {
        "admin": {
            "dsl": "1.0",
            "body": {
                "type": "Layout",
                "props": {
                    "className": "shell-root"
                },
                "children": [
                    {
                        "type": "Content",
                        "props": {
                            "className": "shell-content"
                        },
                        "children": [
                            {
                                "type": "PageOutlet"
                            }
                        ]
                    }
                ]
            }
        },
        "shell": {
            "dsl": "1.0",
            "body": {
                "type": "Layout",
                "props": {
                    "className": "h-dvh overflow-hidden bg-zinc-50"
                },
                "children": [
                    {
                        "type": "Sidebar",
                        "props": {
                            "className": "flex-1",
                            "style": {
                                "minHeight": 0
                            },
                            "brand": {
                                "title": "InnoSpots"
                            },
                            "collapsible": false,
                            "content": {
                                "type": "SitemapMenu",
                                "props": {
                                    "items": "${data.session.menus}"
                                },
                                "events": {
                                    "onSelect": [
                                        {
                                            "action": "navigate",
                                            "params": {
                                                "to": "${event}"
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        "children": [
                            {
                                "type": "Content",
                                "props": {
                                    "className": "overflow-y-auto",
                                    "style": {
                                        "background": "var(--background)"
                                    }
                                },
                                "children": [
                                    {
                                        "type": "PageOutlet"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    }
};
}),
"[project]/starters/apps-shell-starter/web-shell/app/api/runtime/bootstrap/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$src$2f$server$2f$runtime$2f$bootstrap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/src/server/runtime/bootstrap.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$src$2f$server$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/src/server/auth/session.ts [app-route] (ecmascript)");
;
;
;
async function GET() {
    const store = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$src$2f$server$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveSessionUser"])(store);
    const body = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$src$2f$server$2f$runtime$2f$bootstrap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildRuntimeBootstrap"])(user);
    return Response.json(body, {
        headers: {
            "cache-control": "no-store"
        }
    });
}
}),
"[project]/starters/apps-shell-starter/web-shell/src/modules/registry.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAssembly",
    ()=>getAssembly,
    "getAssemblySummary",
    ()=>getAssemblySummary,
    "getMenusIndex",
    ()=>getMenusIndex,
    "getPagesIndex",
    ()=>getPagesIndex,
    "getSitemapMeta",
    ()=>getSitemapMeta
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f2e$generated$2f$pactor$2f$assembly$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/.generated/pactor/assembly.json.[json].cjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f2e$generated$2f$pactor$2f$menus$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/.generated/pactor/menus.json.[json].cjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f2e$generated$2f$pactor$2f$pages$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/.generated/pactor/pages.json.[json].cjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f2e$generated$2f$pactor$2f$sitemap$2d$meta$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/.generated/pactor/sitemap-meta.json.[json].cjs [app-route] (ecmascript)");
;
;
;
;
const assemblyData = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f2e$generated$2f$pactor$2f$assembly$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"];
const pagesData = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f2e$generated$2f$pactor$2f$pages$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"];
const menusData = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f2e$generated$2f$pactor$2f$menus$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"];
function getAssembly() {
    return assemblyData;
}
function getPagesIndex() {
    return pagesData;
}
function getMenusIndex() {
    return menusData;
}
function getSitemapMeta() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f2e$generated$2f$pactor$2f$sitemap$2d$meta$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"];
}
function getAssemblySummary() {
    return {
        modules: assemblyData.modules,
        routeCount: assemblyData.routes.length
    };
}
}),
"[project]/starters/apps-shell-starter/web-shell/src/server/auth/session.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "resolveSessionUser",
    ()=>resolveSessionUser
]);
function resolveSessionUser(_store) {
    return null;
}
}),
"[project]/starters/apps-shell-starter/web-shell/src/server/runtime/assembly-io.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "readGeneratedDsl",
    ()=>readGeneratedDsl
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$yaml$40$2$2e$9$2e$1$2f$node_modules$2f$yaml$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/yaml@2.9.1/node_modules/yaml/dist/index.js [app-route] (ecmascript)");
;
;
;
const GENERATED_ROOT = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(process.cwd(), ".generated/pactor");
function readGeneratedDsl(relativePath) {
    const abs = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(GENERATED_ROOT, relativePath);
    const doc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$yaml$40$2$2e$9$2e$1$2f$node_modules$2f$yaml$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseDocument"])((0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["readFileSync"])(abs, "utf8"));
    if (doc.errors.length > 0) {
        throw new Error(`${relativePath} 解析失败：${doc.errors.map((e)=>e.message.split("\n")[0]).join("；")}`);
    }
    return doc.toJS();
}
}),
"[project]/starters/apps-shell-starter/web-shell/src/server/runtime/bootstrap.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildRuntimeBootstrap",
    ()=>buildRuntimeBootstrap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$src$2f$modules$2f$registry$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/src/modules/registry.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$src$2f$server$2f$runtime$2f$assembly$2d$io$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/src/server/runtime/assembly-io.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$src$2f$server$2f$runtime$2f$visibility$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/src/server/runtime/visibility.ts [app-route] (ecmascript)");
;
;
;
function buildRuntimeBootstrap(user) {
    const meta = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$src$2f$modules$2f$registry$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSitemapMeta"])();
    const { pages } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$src$2f$modules$2f$registry$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPagesIndex"])();
    const { menus } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$src$2f$modules$2f$registry$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMenusIndex"])();
    const visiblePages = pages.filter((p)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$src$2f$server$2f$runtime$2f$visibility$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canSeePage"])(p, user));
    const sitemapPages = visiblePages.map((p)=>{
        const base = {
            id: p.globalPageId,
            path: p.path,
            title: p.title,
            version: p.version
        };
        if (p.lazy) return base;
        if (!p.dslRef) return base;
        return {
            ...base,
            pageDsl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$src$2f$server$2f$runtime$2f$assembly$2d$io$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readGeneratedDsl"])(p.dslRef)
        };
    });
    const layouts = meta.layouts;
    const filteredMenus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$src$2f$server$2f$runtime$2f$visibility$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["filterVisibleMenus"])(menus, user, pages);
    return {
        id: "innospots-web-shell",
        resourceType: "sitemap",
        version: 1,
        dslVersion: meta.dslVersion,
        app: meta.app,
        layout: meta.layout,
        auth: meta.auth,
        layouts,
        updatedAt: new Date().toISOString(),
        ...user ? {
            user: {
                id: user.id,
                username: user.username,
                name: user.name ?? user.username
            },
            permissions: user.permissions
        } : {},
        pages: sitemapPages,
        menus: filteredMenus
    };
}
}),
"[project]/starters/apps-shell-starter/web-shell/src/server/runtime/visibility.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "canSeePage",
    ()=>canSeePage,
    "filterVisibleMenus",
    ()=>filterVisibleMenus
]);
function canSeePage(entry, user) {
    if (entry.public) return true;
    if (!user) return false;
    if (entry.permission) {
        return user.permissions.includes(entry.permission);
    }
    return true;
}
function filterVisibleMenus(menus, user, pages) {
    const pagesById = new Map(pages.map((p)=>[
            p.globalPageId,
            p
        ]));
    const visit = (menu)=>{
        if (menu === null || typeof menu !== "object" || Array.isArray(menu)) return menu;
        const item = menu;
        const children = Array.isArray(item.children) ? item.children.map(visit).filter((child)=>child !== null) : undefined;
        let visible;
        if (item.public === true) {
            visible = true;
        } else if (typeof item.permission === "string") {
            visible = user !== null && user.permissions.includes(item.permission);
        } else if (typeof item.pageId === "string") {
            const page = pagesById.get(item.pageId);
            visible = page !== undefined && canSeePage(page, user);
        } else if (children !== undefined) {
            visible = children.length > 0;
        } else {
            visible = user !== null;
        }
        if (!visible) return null;
        return children !== undefined ? {
            ...item,
            children
        } : item;
    };
    return menus.map(visit).filter((menu)=>menu !== null);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0bp53lf._.js.map