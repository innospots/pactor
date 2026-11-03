module.exports = [
"[project]/packages/app/dist/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Application",
    ()=>Application,
    "DslPageLoader",
    ()=>DslPageLoader,
    "PactorPage",
    ()=>PactorPage,
    "PageErrorBoundary",
    ()=>PageErrorBoundary,
    "ReactRouterBinding",
    ()=>ReactRouterBinding,
    "SitemapApp",
    ()=>SitemapApp,
    "createHttpHooks",
    ()=>createHttpHooks,
    "createLocalStorageLocaleStorage",
    ()=>createLocalStorageLocaleStorage,
    "createPactorApplication",
    ()=>createPactorApplication,
    "createPactorPage",
    ()=>createPactorPage,
    "createRuntimeHttpAdapter",
    ()=>createRuntimeHttpAdapter,
    "createSitemapLoader",
    ()=>createSitemapLoader,
    "createSitemapSessionServices",
    ()=>createSitemapSessionServices,
    "defaultSitemapActions",
    ()=>defaultSitemapActions,
    "defaultSitemapGuard",
    ()=>defaultSitemapGuard,
    "fetchSitemap",
    ()=>fetchSitemap,
    "mergeSitemapMenus",
    ()=>mergeSitemapMenus,
    "resolveLayoutChain",
    ()=>resolveLayoutChain,
    "resolveSitemapRoute",
    ()=>resolveSitemapRoute,
    "toSitemapNavItems",
    ()=>toSitemapNavItems,
    "withHttpHooks",
    ()=>withHttpHooks,
    "wrapHttpAdapter",
    ()=>wrapHttpAdapter
]);
// src/application.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$FOBSAKNK$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/dist/chunk-FOBSAKNK.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$permission$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/permission/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$resource$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/resource/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/router/dist/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/runtime/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react-dom/client.js [app-ssr] (ecmascript)");
// src/app-shell.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$chunk$2d$JY7Z55CR$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/router/dist/chunk-JY7Z55CR.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/router/dist/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$router$2d$dom$40$7$2e$18$2e$2_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$router$2d$dom$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-router-dom@7.18.2_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/react-router-dom/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$V5RS22V3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/dist/chunk-V5RS22V3.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$VGLBASGO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/dist/chunk-VGLBASGO.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$2OQU2IE6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/dist/chunk-2OQU2IE6.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
var centerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};
function BootstrapSpinner({ style }) {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useI18n"])();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
        className: "pactor-app-spin",
        style: {
            ...centerStyle,
            ...style
        },
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("svg", {
            width: "32",
            height: "32",
            viewBox: "0 0 32 32",
            role: "status",
            "aria-label": t("pactor.app.loading"),
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("circle", {
                cx: "16",
                cy: "16",
                r: "12",
                fill: "none",
                stroke: "#1677ff",
                strokeWidth: "3",
                strokeLinecap: "round",
                strokeDasharray: "56",
                strokeDashoffset: "28",
                children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("animateTransform", {
                    attributeName: "transform",
                    type: "rotate",
                    from: "0 16 16",
                    to: "360 16 16",
                    dur: "0.8s",
                    repeatCount: "indefinite"
                })
            })
        })
    });
}
function ResultView({ className, title, subTitle, extra }) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
        className,
        style: {
            ...centerStyle,
            padding: 24
        },
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
            style: {
                textAlign: "center",
                maxWidth: 480
            },
            children: [
                /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                    style: {
                        fontSize: 24,
                        fontWeight: 600,
                        marginBottom: 8
                    },
                    children: title
                }),
                subTitle !== void 0 && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                    style: {
                        color: "rgba(0, 0, 0, 0.45)",
                        marginBottom: 16
                    },
                    children: subTitle
                }),
                extra
            ]
        })
    });
}
function PrimaryButton({ onClick, children }) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("button", {
        type: "button",
        onClick: ()=>onClick?.(),
        style: {
            padding: "6px 16px",
            border: "none",
            borderRadius: 6,
            background: "#1677ff",
            color: "#fff",
            fontSize: 14,
            cursor: "pointer"
        },
        children
    });
}
;
;
;
;
;
var PageErrorBoundaryImpl = class extends __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Component"] {
    constructor(){
        super(...arguments);
        this.state = {
            error: null
        };
    }
    static getDerivedStateFromError(error) {
        return {
            error
        };
    }
    componentDidCatch(error, info) {
        console.error("[@pactor-app/app] \u9875\u9762\u6E32\u67D3\u5F02\u5E38", error, info.componentStack);
    }
    render() {
        const { error } = this.state;
        if (error !== null) {
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ResultView, {
                className: "pactor-app-page-render-error",
                title: this.props.title,
                subTitle: error.message,
                extra: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(PrimaryButton, {
                    onClick: ()=>this.setState({
                            error: null
                        }),
                    children: this.props.retryLabel
                })
            });
        }
        return this.props.children;
    }
};
function PageErrorBoundary({ children }) {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useI18n"])();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(PageErrorBoundaryImpl, {
        title: t("pactor.app.renderError"),
        retryLabel: t("pactor.page.retry"),
        children
    });
}
;
function DslPageLoader({ app, pageId, route }) {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useI18n"])();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        status: "loading"
    });
    const [retryTick, setRetryTick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        let runtime = null;
        void (async ()=>{
            try {
                const pageDsl = await app.resolvePage(pageId);
                if (cancelled) {
                    return;
                }
                runtime = app.createPageRuntime(pageDsl, route);
                setState({
                    status: "ready",
                    runtime
                });
                void runtime.ready();
                void runtime.show();
            } catch (cause) {
                if (!cancelled) {
                    setState({
                        status: "error",
                        error: cause instanceof Error ? cause : new Error(String(cause))
                    });
                }
            }
        })();
        return ()=>{
            cancelled = true;
            if (runtime !== null && !runtime.destroyed) {
                void runtime.hide();
                void runtime.destroy();
            }
        };
    }, [
        app,
        pageId,
        retryTick
    ]);
    if (state.status === "loading") {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
            className: "pactor-app-page-loading",
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(BootstrapSpinner, {
                style: {
                    minHeight: 0,
                    padding: 48
                }
            })
        });
    }
    if (state.status === "error") {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ResultView, {
            className: "pactor-app-page-load-error",
            title: t("pactor.page.loadFailed"),
            subTitle: state.error.message,
            extra: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(PrimaryButton, {
                onClick: ()=>setRetryTick((n)=>n + 1),
                children: t("pactor.page.retry")
            })
        });
    }
    const OverlayHostView = app.interactionKit.OverlayHost;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(PageErrorBoundary, {
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PageRuntimeView"], {
            runtime: state.runtime,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(OverlayHostView, {
                manager: app.overlayManager,
                resolvePage: app.resolvePage
            })
        })
    });
}
;
function Application({ app }) {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useI18n"])();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        status: "loading"
    });
    const [retryTick, setRetryTick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        void app.loadSession().then((session)=>{
            if (!cancelled) {
                setState({
                    status: "ready",
                    session
                });
            }
        }, (cause)=>{
            if (!cancelled) {
                setState({
                    status: "error",
                    error: cause instanceof Error ? cause : new Error(String(cause))
                });
            }
        });
        return ()=>{
            cancelled = true;
        };
    }, [
        app,
        retryTick
    ]);
    if (state.status === "loading") {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
            className: "pactor-app-bootstrap-loading",
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(BootstrapSpinner, {})
        });
    }
    if (state.status === "error") {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ResultView, {
            className: "pactor-app-bootstrap-error",
            title: t("pactor.app.startFailed"),
            subTitle: state.error.message,
            extra: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(PrimaryButton, {
                onClick: ()=>setRetryTick((n)=>n + 1),
                children: t("pactor.page.retry")
            })
        });
    }
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(AppShell, {
        app,
        session: state.session
    });
}
function AppShell({ app, session: initialSession }) {
    const liveSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(app.subscribeSession, app.getSession);
    const session = liveSession ?? initialSession;
    const Router = app.routerOptions.type === "hash" ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$router$2d$dom$40$7$2e$18$2e$2_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$router$2d$dom$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HashRouter"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$router$2d$dom$40$7$2e$18$2e$2_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$router$2d$dom$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BrowserRouter"];
    const InteractionKit = app.interactionKit.Provider;
    const Providers = app.providers;
    const i18n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createI18nContext"])({
        locale: session.locale,
        defaultLocale: session.defaultLocale,
        messages: session.messages
    });
    const shell = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["I18nContextProvider"], {
        value: i18n,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(InteractionKit, {
            bridge: app.uiBridge,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ShellLayout, {
                app,
                session
            })
        })
    });
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(Router, {
        basename: app.routerOptions.basename,
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(RouterBridgeSync, {
                binding: app.navigation
            }),
            Providers !== void 0 ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Providers, {
                children: shell
            }) : shell
        ]
    });
}
function RouterBridgeSync({ binding }) {
    const bridge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReactRouterBridge"])();
    const location = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$router$2d$dom$40$7$2e$18$2e$2_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$router$2d$dom$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLocation"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        binding.bind(bridge, {
            pathname: location.pathname,
            search: location.search
        });
    }, [
        bridge,
        binding
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        binding.sync({
            pathname: location.pathname,
            search: location.search
        });
    }, [
        binding,
        location.pathname,
        location.search
    ]);
    return null;
}
function ShellLayout({ app, session }) {
    const location = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$router$2d$dom$40$7$2e$18$2e$2_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$router$2d$dom$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLocation"])();
    const route = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$chunk$2d$JY7Z55CR$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveRoute"])(session.menuRegistry, {
        pathname: location.pathname,
        search: location.search
    });
    const LayoutComponent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$FOBSAKNK$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveLayout"])(app.layoutRegistry, session.layoutType);
    const outlet = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$router$2d$dom$40$7$2e$18$2e$2_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$router$2d$dom$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Routes"], {
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$router$2d$dom$40$7$2e$18$2e$2_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$router$2d$dom$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Route"], {
            path: "*",
            element: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DynamicDslRoute"], {
                registry: session.menuRegistry,
                permissionChecker: app.permissionStore,
                fallback: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(NotFoundPage, {}),
                forbidden: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ForbiddenPage, {}),
                render: ({ pageId, route: pageRoute })=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(DslPageLoader, {
                        app,
                        pageId,
                        route: pageRoute
                    }, pageLoaderKey(pageId, pageRoute, session.i18nVersion))
            })
        })
    });
    if (session.layoutType === "admin") {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(LayoutComponent, {
            config: session.layoutConfig,
            brand: session.brand,
            registry: session.menuRegistry,
            bridge: app.navigation,
            route: route ?? void 0,
            permissionChecker: app.permissionStore,
            headerExtra: app.headerExtra,
            children: outlet
        });
    }
    if (session.layoutType === "chat") {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(LayoutComponent, {
            brand: session.brand,
            registry: session.menuRegistry,
            bridge: app.navigation,
            route: route ?? void 0,
            permissionChecker: app.permissionStore,
            collapsible: session.layoutConfig.collapsible,
            children: outlet
        });
    }
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(LayoutComponent, {
        brand: session.brand,
        children: outlet
    });
}
function pageLoaderKey(pageId, route, i18nVersion) {
    return `${pageId}|${i18nVersion}|${JSON.stringify(route.params)}|${JSON.stringify(route.query)}`;
}
function NotFoundPage() {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useI18n"])();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ResultView, {
        className: "pactor-app-not-found",
        title: "404",
        subTitle: t("pactor.app.pageNotFound")
    });
}
function ForbiddenPage() {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useI18n"])();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ResultView, {
        className: "pactor-app-forbidden",
        title: "403",
        subTitle: t("pactor.app.forbidden")
    });
}
;
;
;
;
function upsert(registry, name, item) {
    if (registry.has(name)) {
        registry.unregister(name);
    }
    registry.register(name, item);
}
function upsertAll(registry, entries) {
    for (const [name, item] of Object.entries(entries ?? {})){
        upsert(registry, name, item);
    }
}
function createRuntimeHttpAdapter(authTokenProvider) {
    const base = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createFetchHttpAdapter"])();
    if (authTokenProvider === void 0) {
        return base;
    }
    return {
        async request (config) {
            const token = await authTokenProvider();
            if (token === void 0 || token === "") {
                return base.request(config);
            }
            return base.request({
                ...config,
                headers: {
                    ...config.headers,
                    authorization: `Bearer ${token}`
                }
            });
        }
    };
}
function wrapHttpAdapter(base, hooks) {
    if (!hooks) {
        return base;
    }
    return {
        async request (config) {
            const finalConfig = hooks.request ? await hooks.request(config) : config;
            const data = await base.request(finalConfig);
            return hooks.response ? hooks.response(data) : data;
        }
    };
}
function createPactorAssembly(options) {
    const overlayManager = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$VGLBASGO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OverlayManager"]();
    const uiBridge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$VGLBASGO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createUiBridge"])();
    const interactionKit = options.interactionKit ?? {
        Provider: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$VGLBASGO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InteractionProvider"],
        OverlayHost: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$VGLBASGO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OverlayHost"]
    };
    const components = options.componentRegistry?.() ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$V5RS22V3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createComponentRegistry"])();
    upsertAll(components, options.components);
    const actions = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Registry"]("ActionRegistry");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$VGLBASGO$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerInteractionActions"])(actions, overlayManager, uiBridge);
    upsert(actions, "navigate", (action)=>{
        const to = action.params?.["to"];
        if (typeof to !== "string" || to === "") {
            return {
                ok: false,
                error: new Error("[@pactor-app/app] navigate \u52A8\u4F5C\u7F3A\u5C11 params.to\uFF08string\uFF09")
            };
        }
        options.navigate(to);
        return {
            ok: true
        };
    });
    upsertAll(actions, options.actions);
    const services = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Registry"]("ServiceRegistry");
    upsertAll(services, options.services);
    const capabilities = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Registry"]("CapabilityRegistry");
    upsertAll(capabilities, options.capabilities);
    return {
        components,
        actions,
        services,
        capabilities,
        overlayManager,
        uiBridge,
        interactionKit,
        httpAdapter: wrapHttpAdapter(createRuntimeHttpAdapter(options.authTokenProvider), options.httpAdapter)
    };
}
// src/locale-storage.ts
function createLocalStorageLocaleStorage(key = "pactor.locale") {
    return {
        get () {
            if (typeof localStorage === "undefined") {
                return void 0;
            }
            try {
                const value = localStorage.getItem(key);
                return typeof value === "string" && value !== "" ? value : void 0;
            } catch  {
                return void 0;
            }
        },
        set (locale) {
            if (typeof localStorage === "undefined") {
                return;
            }
            try {
                localStorage.setItem(key, locale);
            } catch  {}
        }
    };
}
// src/application.ts
var ReactRouterBinding = class {
    constructor(){
        this.location = {
            pathname: "/",
            search: ""
        };
        this.listeners = /* @__PURE__ */ new Set();
    }
    /** 绑定真实桥接与初始 location（RouterBridgeSync 挂载时调用） */ bind(delegate, initial) {
        this.delegate = delegate;
        this.location = initial;
    }
    /** location 变化同步并通知订阅者 */ sync(location) {
        this.location = location;
        for (const listener of [
            ...this.listeners
        ]){
            listener(location);
        }
    }
    getLocation() {
        return this.location;
    }
    push(to) {
        if (this.delegate === void 0) {
            console.warn(`[@pactor-app/app] \u8DEF\u7531\u5C1A\u672A\u6302\u8F7D\uFF0Cpush("${to}") \u5DF2\u5FFD\u7565`);
            return;
        }
        this.delegate.push(to);
    }
    replace(to) {
        if (this.delegate === void 0) {
            console.warn(`[@pactor-app/app] \u8DEF\u7531\u5C1A\u672A\u6302\u8F7D\uFF0Creplace("${to}") \u5DF2\u5FFD\u7565`);
            return;
        }
        this.delegate.replace(to);
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return ()=>{
            this.listeners.delete(listener);
        };
    }
};
function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function createResourceHttpAdapter(authTokenProvider) {
    const base = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$resource$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createFetchAdapter"])();
    if (authTokenProvider === void 0) {
        return base;
    }
    return async (request)=>{
        const token = await authTokenProvider();
        if (token === void 0 || token === "") {
            return base(request);
        }
        return base({
            ...request,
            headers: {
                ...request.headers,
                authorization: `Bearer ${token}`
            }
        });
    };
}
var MENU_TYPES = /* @__PURE__ */ new Set([
    "group",
    "page",
    "link"
]);
function sanitizeMenus(raw) {
    if (!Array.isArray(raw)) {
        return [];
    }
    const menus = [];
    for (const item of raw){
        if (!isRecord(item) || typeof item["id"] !== "string") {
            continue;
        }
        const menu = item;
        menus.push({
            ...menu,
            title: typeof item["title"] === "string" ? item["title"] : menu.id,
            type: MENU_TYPES.has(menu.type) ? menu.type : "page",
            children: item["children"] !== void 0 ? sanitizeMenus(item["children"]) : void 0
        });
    }
    return menus;
}
var LAYOUT_MODES = [
    "top-side",
    "top-bottom",
    "side-full",
    "two-column"
];
var LAYOUT_BREAKPOINTS = [
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "xxl"
];
function pickLayoutConfig(layout) {
    const config = {};
    for (const key of [
        "header",
        "sidebar",
        "tabs",
        "breadcrumb",
        "footer",
        "fixedHeader",
        "fixedSider",
        "collapsible",
        "collapsed"
    ]){
        const value = layout?.[key];
        if (typeof value === "boolean") {
            config[key] = value;
        }
    }
    const mode = layout?.["mode"];
    if (typeof mode === "string" && LAYOUT_MODES.includes(mode)) {
        config.mode = mode;
    }
    const breakpoint = layout?.["breakpoint"];
    if (typeof breakpoint === "string" && LAYOUT_BREAKPOINTS.includes(breakpoint)) {
        config.breakpoint = breakpoint;
    }
    return config;
}
function createPactorApplication(options) {
    if (typeof options.appId !== "string" || options.appId === "") {
        throw new Error("[@pactor-app/app] createPactorApplication: appId \u5FC5\u586B");
    }
    const { appId } = options;
    const routerOptions = options.router ?? {};
    const permissionStore = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$permission$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PermissionStore"]();
    const layoutRegistry = options.layoutRegistry?.() ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$FOBSAKNK$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createLayoutRegistry"])();
    const navigation = new ReactRouterBinding();
    const assembly = createPactorAssembly({
        componentRegistry: options.componentRegistry,
        interactionKit: options.interactionKit,
        components: options.components,
        actions: options.actions,
        services: options.services,
        capabilities: options.capabilities,
        authTokenProvider: options.authTokenProvider,
        httpAdapter: options.httpAdapter,
        navigate: (to)=>navigation.push(to)
    });
    const { components, actions, services, capabilities, httpAdapter } = assembly;
    const { overlayManager, uiBridge, interactionKit } = assembly;
    const customLoader = options.loader;
    const resourceAdapter = createResourceHttpAdapter(options.authTokenProvider);
    const permissionAdapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$permission$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPermissionAdapter"])(permissionStore);
    const routerAdapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createRouterAdapter"])(navigation);
    let session = null;
    const sessionListeners = /* @__PURE__ */ new Set();
    let pendingLocale = null;
    const httpLoaders = /* @__PURE__ */ new Map();
    function resolveLoader() {
        if (customLoader !== void 0) {
            return customLoader;
        }
        const locale = session?.locale;
        const key = locale ?? "";
        let cached = httpLoaders.get(key);
        if (cached === void 0) {
            cached = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$resource$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HttpDslResourceLoader"]({
                baseUrl: options.api?.baseURL,
                adapter: resourceAdapter,
                locale
            });
            const pageVersions = session?.bootstrap.pageVersions;
            if (pageVersions !== void 0) {
                cached.updateVersions(pageVersions);
            }
            httpLoaders.set(key, cached);
        }
        return cached;
    }
    function updateSession(next) {
        session = next;
        for (const listener of [
            ...sessionListeners
        ]){
            listener();
        }
    }
    const localeStorage = options.localeStorage === false ? void 0 : options.localeStorage ?? createLocalStorageLocaleStorage();
    const handle = {
        appId,
        overlayManager,
        uiBridge,
        permissionStore,
        layoutRegistry,
        interactionKit,
        routerOptions,
        providers: options.providers,
        headerExtra: options.headerExtra,
        navigation,
        async loadSession () {
            const bootstrap = await resolveLoader().loadBootstrap();
            permissionStore.setPermissions(Array.isArray(bootstrap.permissions) ? bootstrap.permissions.filter((code)=>typeof code === "string") : []);
            const menuRegistry = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["MenuRegistry"](sanitizeMenus(bootstrap.menus));
            const layout = isRecord(bootstrap.layout) ? bootstrap.layout : void 0;
            const layoutType = options.layout ?? (typeof layout?.["type"] === "string" ? layout["type"] : void 0) ?? "admin";
            const appRecord = {
                id: appId,
                ...isRecord(bootstrap.app) ? bootstrap.app : {}
            };
            const brand = options.brand ?? {
                title: typeof appRecord["name"] === "string" ? appRecord["name"] : appId,
                logo: void 0
            };
            const browserLocale = typeof navigator !== "undefined" && typeof navigator.language === "string" ? navigator.language : "zh-CN";
            const locale = options.locale ?? localeStorage?.get() ?? (typeof bootstrap.locale === "string" ? bootstrap.locale : void 0) ?? browserLocale;
            const defaultLocale = options.defaultLocale ?? (typeof bootstrap.defaultLocale === "string" ? bootstrap.defaultLocale : void 0) ?? "zh-CN";
            const messages = options.messages ?? (isRecord(bootstrap.messages) ? bootstrap.messages : void 0) ?? {};
            let next = {
                bootstrap,
                menuRegistry,
                layoutType,
                layoutConfig: pickLayoutConfig(layout),
                brand,
                user: isRecord(bootstrap.user) ? bootstrap.user : {},
                app: appRecord,
                locale,
                defaultLocale,
                messages,
                i18nVersion: 0
            };
            if (pendingLocale !== null) {
                next = {
                    ...next,
                    locale: pendingLocale.locale,
                    messages: pendingLocale.messages ?? next.messages
                };
                pendingLocale = null;
                localeStorage?.set(next.locale);
            }
            updateSession(next);
            return next;
        },
        subscribeSession (listener) {
            sessionListeners.add(listener);
            return ()=>{
                sessionListeners.delete(listener);
            };
        },
        getSession () {
            return session;
        },
        createPageRuntime (pageDsl, route) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPageRuntime"])(pageDsl, {
                components,
                actions,
                services,
                capabilities,
                permission: permissionAdapter,
                router: routerAdapter,
                http: httpAdapter,
                route: {
                    params: route.params,
                    query: route.query
                },
                user: session?.user ?? {},
                app: session?.app ?? {
                    id: appId
                },
                locale: session?.locale ?? "zh-CN",
                defaultLocale: session?.defaultLocale ?? "zh-CN",
                messages: session?.messages ?? {}
            });
        },
        async resolvePage (pageId) {
            const resource = await resolveLoader().loadPage(pageId);
            return resource.schema;
        }
    };
    let root = null;
    return {
        appId,
        mount (selector) {
            const target = document.querySelector(selector);
            if (target === null) {
                throw new Error(`[@pactor-app/app] mount \u76EE\u6807\u5143\u7D20\u4E0D\u5B58\u5728: ${selector}`);
            }
            if (root !== null) {
                root.unmount();
                root = null;
            }
            root = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createRoot"])(target);
            root.render(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"])(Application, {
                app: handle
            }));
        },
        unmount () {
            if (root !== null) {
                root.unmount();
                root = null;
            }
        },
        registerComponent (name, component) {
            upsert(components, name, component);
        },
        registerAction (name, handler) {
            upsert(actions, name, handler);
        },
        registerService (name, handler) {
            upsert(services, name, handler);
        },
        registerCapability (name, capability) {
            upsert(capabilities, name, capability);
        },
        setLocale (locale, messages) {
            if (session === null) {
                pendingLocale = {
                    locale,
                    messages
                };
                return;
            }
            const nextMessages = messages ?? session.messages;
            if (locale === session.locale && nextMessages === session.messages) {
                return;
            }
            updateSession({
                ...session,
                locale,
                messages: nextMessages,
                i18nVersion: session.i18nVersion + 1
            });
            localeStorage?.set(locale);
        }
    };
}
;
;
;
;
;
function createPactorPage(options = {}) {
    const navigate = options.navigate ?? ((to)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    });
    const assembly = createPactorAssembly({
        ...options,
        navigate
    });
    let permission;
    if (options.permission !== void 0) {
        permission = options.permission;
    } else if (options.permissions !== void 0) {
        const store = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$permission$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PermissionStore"]();
        store.setPermissions(options.permissions);
        permission = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$permission$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPermissionAdapter"])(store);
    } else {
        permission = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createDefaultPermissionAdapter"])();
    }
    const i18n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createI18nContext"])({
        locale: options.locale,
        defaultLocale: options.defaultLocale,
        messages: options.messages
    });
    function createRuntime(pageDsl, route) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPageRuntime"])(pageDsl, {
            components: assembly.components,
            actions: assembly.actions,
            services: assembly.services,
            capabilities: assembly.capabilities,
            permission,
            // route.navigate 与 DSL navigate 动作共用同一实现（宿主注入或缺省整页跳转）
            router: {
                navigate
            },
            http: assembly.httpAdapter,
            route: {
                params: route?.params ?? {},
                query: route?.query ?? {}
            },
            locale: options.locale ?? "zh-CN",
            defaultLocale: options.defaultLocale ?? "zh-CN",
            messages: options.messages ?? {}
        });
    }
    return function ConfiguredPactorPage(props) {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["I18nContextProvider"], {
            value: i18n,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(EmbeddedPage, {
                assembly,
                options,
                createRuntime,
                resolvePage: options.loader ? resolvePage : void 0,
                ...props
            })
        });
    };
    //TURBOPACK unreachable
    ;
    async function resolvePage(pageId) {
        if (!options.loader) {
            throw new Error("[@pactor-app/app] PactorPage: \u6309 pageId \u52A0\u8F7D\u9700\u8981 options.loader");
        }
        const resource = await options.loader.loadPage(pageId);
        return resource.schema;
    }
}
function PactorPage(props) {
    const { pageId, pageDsl, route, ...options } = props;
    const factoryRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    if (factoryRef.current === null) {
        factoryRef.current = createPactorPage(options);
    }
    const ConfiguredPage = factoryRef.current;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ConfiguredPage, {
        pageId,
        pageDsl,
        route
    });
}
function EmbeddedPage({ assembly, options, createRuntime, resolvePage, pageId, pageDsl, route }) {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useI18n"])();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        status: "loading"
    });
    const [retryTick, setRetryTick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const onError = options.onError;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        let runtime = null;
        void (async ()=>{
            try {
                let resolved = pageDsl;
                if (resolved === void 0) {
                    if (pageId === void 0) {
                        throw new Error("[@pactor-app/app] PactorPage: pageId \u4E0E pageDsl \u5FC5\u4F20\u5176\u4E00");
                    }
                    if (resolvePage === void 0) {
                        throw new Error("[@pactor-app/app] PactorPage: \u6309 pageId \u52A0\u8F7D\u9700\u8981 options.loader");
                    }
                    resolved = await resolvePage(pageId);
                } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDslSourceRef"])(resolved)) {
                    const resolver = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DslSourceResolver"]({
                        services: assembly.services,
                        http: assembly.httpAdapter,
                        locale: options.locale,
                        getScope: ()=>({
                                route: {
                                    params: route?.params ?? {},
                                    query: route?.query ?? {}
                                }
                            })
                    });
                    resolved = await resolver.resolve(resolved);
                }
                if (cancelled) {
                    return;
                }
                runtime = createRuntime(resolved, route);
                setState({
                    status: "ready",
                    runtime
                });
                void runtime.ready();
                void runtime.show();
            } catch (cause) {
                if (!cancelled) {
                    const error = cause instanceof Error ? cause : new Error(String(cause));
                    onError?.(error);
                    setState({
                        status: "error",
                        error
                    });
                }
            }
        })();
        return ()=>{
            cancelled = true;
            if (runtime !== null && !runtime.destroyed) {
                void runtime.hide();
                void runtime.destroy();
            }
        };
    }, [
        pageId,
        pageDsl,
        retryTick
    ]);
    const InteractionProvider2 = assembly.interactionKit.Provider;
    const OverlayHost2 = assembly.interactionKit.OverlayHost;
    let content;
    if (state.status === "loading") {
        content = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
            className: "pactor-app-page-loading",
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(BootstrapSpinner, {
                style: {
                    minHeight: 0,
                    padding: 48
                }
            })
        });
    } else if (state.status === "error") {
        content = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ResultView, {
            className: "pactor-app-page-load-error",
            title: t("pactor.page.loadFailed"),
            subTitle: state.error.message,
            extra: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(PrimaryButton, {
                onClick: ()=>setRetryTick((n)=>n + 1),
                children: t("pactor.page.retry")
            })
        });
    } else {
        content = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(PageErrorBoundary, {
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PageRuntimeView"], {
                runtime: state.runtime,
                children: resolvePage !== void 0 ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(OverlayHost2, {
                    manager: assembly.overlayManager,
                    resolvePage
                }) : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(OverlayHost2, {
                    manager: assembly.overlayManager
                })
            })
        });
    }
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(InteractionProvider2, {
        bridge: assembly.uiBridge,
        children: content
    });
}
// src/sitemap/actions.ts
var defaultSitemapActions = {
    "app.reload": (action)=>{
        const to = action.params?.["to"];
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return {
            ok: true
        };
    },
    "service.call": async (action, ctx)=>{
        const name = action.params?.["service"];
        if (typeof name !== "string" || name === "") {
            return {
                ok: false,
                error: new Error("[@pactor-app/app] service.call \u7F3A\u5C11 params.service")
            };
        }
        const handler = ctx.context.services.get(name);
        if (!handler) {
            return {
                ok: false,
                error: new Error(`[@pactor-app/app] service \u672A\u6CE8\u518C: ${name}`)
            };
        }
        try {
            const callParams = action.params?.["params"];
            const data = await handler(typeof callParams === "object" && callParams !== null ? callParams : {});
            return {
                ok: true,
                data
            };
        } catch (cause) {
            return {
                ok: false,
                error: cause instanceof Error ? cause : new Error(String(cause))
            };
        }
    }
};
;
;
;
;
;
;
var NAV_EVENT = "pactor:sitemap-navigate";
function readLocation() {
    return `${window.location.pathname}${window.location.search}`;
}
function subscribe(callback) {
    window.addEventListener("popstate", callback);
    window.addEventListener(NAV_EVENT, callback);
    return ()=>{
        window.removeEventListener("popstate", callback);
        window.removeEventListener(NAV_EVENT, callback);
    };
}
function useBrowserRoute() {
    const location = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribe, readLocation, // SSR 快照：服务端无 window，宿主应注入 pathname / navigate
    ()=>"/");
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((to)=>{
        window.history.pushState(null, "", to);
        window.dispatchEvent(new Event(NAV_EVENT));
    }, []);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const qIndex = location.indexOf("?");
        return {
            pathname: qIndex >= 0 ? location.slice(0, qIndex) : location,
            query: Object.fromEntries(new URLSearchParams(qIndex >= 0 ? location.slice(qIndex + 1) : "")),
            navigate
        };
    }, [
        location,
        navigate
    ]);
}
;
// src/sitemap/http.ts
function createHttpHooks(options = {}) {
    const { proxyPrefix } = options;
    const envelope = options.envelope ?? true;
    return {
        request (config) {
            let url = config.url;
            if (proxyPrefix !== void 0 && /^https?:\/\//.test(url) && ("TURBOPACK compile-time value", "undefined") !== "undefined" && !url.startsWith(window.location.origin)) //TURBOPACK unreachable
            ;
            const extra = typeof options.headers === "function" ? options.headers() : options.headers;
            return {
                ...config,
                url,
                headers: {
                    ...config.headers,
                    ...extra
                }
            };
        },
        response (data) {
            if (!envelope) {
                return data;
            }
            if (typeof data === "object" && data !== null && "code" in data && "data" in data) {
                const wrapped = data;
                if (wrapped.code !== 0) {
                    throw new Error(wrapped.message ?? `\u4E1A\u52A1\u9519\u8BEF\u7801 ${wrapped.code}`);
                }
                return wrapped.data;
            }
            return data;
        }
    };
}
function withHttpHooks(fetcher, hooks) {
    if (hooks === void 0) {
        return fetcher;
    }
    return async (input, init)=>{
        let url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        let requestInit = init;
        if (hooks.request !== void 0) {
            const config = await hooks.request({
                method: init?.method ?? "GET",
                url,
                headers: headersToRecord(init?.headers),
                body: init?.body ?? void 0
            });
            url = config.url;
            requestInit = {
                ...init,
                method: config.method ?? init?.method ?? "GET",
                headers: config.headers,
                body: config.body === void 0 ? init?.body ?? null : config.body
            };
        }
        const res = await fetcher(url, requestInit);
        if (hooks.response === void 0 || !res.ok) {
            return res;
        }
        const data = await hooks.response(await res.json());
        return new Response(JSON.stringify(data), {
            status: res.status,
            statusText: res.statusText,
            headers: res.headers
        });
    };
}
function headersToRecord(headers) {
    if (headers === void 0) {
        return void 0;
    }
    if (headers instanceof Headers) {
        return Object.fromEntries(headers.entries());
    }
    if (Array.isArray(headers)) {
        return Object.fromEntries(headers);
    }
    return {
        ...headers
    };
}
// src/sitemap/url.ts
function resolveUrl(url, baseUrl) {
    if (baseUrl === void 0 || baseUrl === "" || /^(https?:)?\/\//i.test(url)) {
        return url;
    }
    return `${baseUrl.replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;
}
// src/sitemap/fetch.ts
async function fetchSitemap(sources, options = {}) {
    const fetcher = withHttpHooks(options.fetcher ?? fetch, options.httpHooks);
    const sourceUrl = (url)=>{
        const resolved = resolveUrl(url, options.baseUrl);
        return options.locale ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$resource$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withLocaleParam"])(resolved, options.locale) : resolved;
    };
    const responses = await Promise.all(sources.map(async (url)=>{
        const res = await fetcher(sourceUrl(url), {
            cache: "no-store",
            // 跨源 cookie 会话（服务端开通 CORS + Allow-Credentials 时生效；
            // 同源行为不变）
            credentials: "include"
        });
        if (!res.ok) {
            throw new Error(`[@pactor-app/app] sitemap \u6E90 ${url} \u8BF7\u6C42\u5931\u8D25\uFF1AHTTP ${res.status}`);
        }
        return await res.json();
    }));
    if (responses.length === 0) {
        throw new Error("[@pactor-app/app] sources \u4E3A\u7A7A\uFF1A\u8BF7\u914D\u7F6E\u81F3\u5C11\u4E00\u4E2A sitemap \u63A5\u53E3 URL");
    }
    const [first, ...rest] = responses;
    const merged = {
        ...first,
        layouts: {
            ...first.layouts
        },
        pages: [
            ...first.pages
        ],
        menus: [
            ...first.menus
        ]
    };
    for (const source of rest){
        mergeById(merged.pages, source.pages, "pages");
        mergeById(merged.menus, source.menus, "menus");
        for (const [name, layout] of Object.entries(source.layouts ?? {})){
            if (merged.layouts[name] !== void 0) {
                console.warn(`[@pactor-app/app] sitemap layouts \u952E\u51B2\u7A81\uFF1A${name}\uFF0C\u540E\u6E90\u8986\u76D6\u524D\u6E90`);
            }
            merged.layouts[name] = layout;
        }
    }
    return merged;
}
function mergeById(target, incoming, label) {
    for (const item of incoming){
        const index = target.findIndex((t)=>t.id === item.id || item.path !== void 0 && t.path === item.path);
        if (index >= 0) {
            console.warn(`[@pactor-app/app] sitemap ${label} \u51B2\u7A81\uFF1A${item.id}\uFF0C\u540E\u6E90\u8986\u76D6\u524D\u6E90`);
            target[index] = item;
        } else {
            target.push(item);
        }
    }
}
;
var defaultPageEndpoint = (pageId)=>`/api/pages/${pageId}`;
function createSitemapLoader(sitemap, options = {}) {
    const pageEndpoint = options.pageEndpoint ?? defaultPageEndpoint;
    const sessionService = options.sessionService ?? "session.context";
    const fetcher = withHttpHooks(options.fetcher ?? fetch, options.httpHooks);
    const pageById = new Map(sitemap.pages.map((p)=>[
            p.id,
            p
        ]));
    const cache = /* @__PURE__ */ new Map();
    const locale = options.locale;
    return {
        async loadPage (pageId) {
            const entry = pageById.get(pageId);
            const version = entry?.version ?? 1;
            const cacheKey = `${pageId}@${version}${locale ? `@${locale}` : ""}`;
            const hit = cache.get(cacheKey);
            if (hit) {
                return hit;
            }
            let resource;
            if (entry?.pageDsl !== void 0) {
                resource = {
                    id: pageId,
                    resourceType: "page",
                    version,
                    dslVersion: entry.pageDsl.dsl ?? "1.0",
                    schema: entry.pageDsl
                };
            } else {
                const resolved = resolveUrl(pageEndpoint(pageId), options.baseUrl);
                const res = await fetcher(locale ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$resource$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withLocaleParam"])(resolved, locale) : resolved, {
                    cache: "no-store",
                    credentials: "include"
                });
                if (!res.ok) {
                    throw new Error(`[@pactor-app/app] \u9875\u9762 ${pageId} \u52A0\u8F7D\u5931\u8D25\uFF1AHTTP ${res.status}`);
                }
                resource = await res.json();
            }
            if (typeof resource.schema === "object" && resource.schema !== null) {
                const schema = resource.schema;
                schema.dataSources = {
                    session: {
                        type: "service",
                        service: sessionService,
                        autoLoad: true
                    },
                    ...schema.dataSources
                };
            }
            cache.set(cacheKey, resource);
            return resource;
        },
        async loadFragment (fragmentId) {
            throw new Error(`[@pactor-app/app] \u672A\u5B9E\u73B0\u7684 fragment \u52A0\u8F7D\uFF1A${fragmentId}`);
        },
        async loadBootstrap () {
            return sitemap;
        }
    };
}
// src/sitemap/merge.ts
function mergeSitemapMenus(sitemap) {
    const pageById = new Map(sitemap.pages.map((p)=>[
            p.id,
            p
        ]));
    const walk = (items)=>items.map((item)=>{
            const page = item.pageId !== void 0 ? pageById.get(item.pageId) : void 0;
            const merged = {
                ...item,
                path: item.path ?? page?.path,
                title: item.title ?? page?.title ?? item.id
            };
            if (item.children !== void 0) {
                merged.children = walk(item.children);
            }
            return merged;
        });
    return walk(sitemap.menus ?? []);
}
function toSitemapNavItems(menuTree) {
    return menuTree.map((item)=>({
            key: item.path ?? item.id,
            label: item.title,
            icon: item.icon,
            disabled: item.disabled,
            children: item.children !== void 0 ? toSitemapNavItems(item.children) : void 0
        }));
}
;
function resolveSitemapRoute(sitemap, registry, pathname) {
    const match = registry.findByPath(pathname);
    const menu = match?.menu ?? null;
    if (match === null || menu === null || menu.pageId === void 0) {
        return {
            menu,
            route: null
        };
    }
    const layoutName = menu.layout ?? sitemap.layout ?? Object.keys(sitemap.layouts)[0] ?? "";
    const highlightId = menu.activeMenu ?? menu.id;
    const highlightItem = registry.findById(highlightId);
    const page = sitemap.pages.find((p)=>p.id === menu.pageId);
    const params = page !== void 0 && page.path !== menu.path ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$chunk$2d$JY7Z55CR$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["match"])(page.path, pathname)?.params ?? match.params : match.params;
    return {
        menu,
        route: {
            pageId: menu.pageId,
            layoutName,
            layoutChain: resolveLayoutChain(sitemap, layoutName),
            highlightKey: highlightItem?.path ?? highlightId,
            params
        }
    };
}
function resolveLayoutChain(sitemap, layoutName) {
    const chain = [
        layoutName
    ];
    const seen = new Set(chain);
    let current = layoutName;
    for(;;){
        const parent = sitemap.layouts[current]?.parent;
        if (parent === void 0 || seen.has(parent) || sitemap.layouts[parent] === void 0) {
            return chain;
        }
        chain.unshift(parent);
        seen.add(parent);
        current = parent;
    }
}
var defaultSitemapGuard = ({ sitemap, pathname, menu })=>{
    const loginPath = sitemap.auth?.loginPath ?? "/login";
    if (sitemap.user === void 0 && pathname !== loginPath && (menu === null || menu.public !== true)) {
        return {
            allow: false,
            redirectTo: loginPath
        };
    }
    return {
        allow: true
    };
};
// src/sitemap/session.ts
function createSitemapSessionServices(session, serviceName = "session.context") {
    return {
        [serviceName]: ()=>Promise.resolve(session)
    };
}
;
var OutletContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function PageOutlet() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["use"])(OutletContext);
}
var NavHighlightContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])("");
function SitemapMenu({ items, collapsible, onSelect }) {
    const highlight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["use"])(NavHighlightContext);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$2OQU2IE6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Menu"], {
        items,
        collapsible,
        selectedKey: highlight,
        onSelect
    });
}
function SitemapApp(props) {
    const i18n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createI18nContext"])({
            locale: props.locale,
            defaultLocale: props.defaultLocale,
            messages: props.messages
        }), [
        props.locale,
        props.defaultLocale,
        props.messages
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["I18nContextProvider"], {
        value: i18n,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(SitemapAppInner, {
            ...props
        })
    });
}
function SitemapAppInner(props) {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useI18n"])();
    const { sources, fetcher, baseUrl } = props;
    const browserRoute = useBrowserRoute();
    const pathname = props.pathname ?? browserRoute.pathname;
    const query = props.query ?? browserRoute.query;
    const navigate = props.navigate ?? browserRoute.navigate;
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        status: "loading"
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        setState({
            status: "loading"
        });
        fetchSitemap(sources, {
            fetcher,
            baseUrl,
            httpHooks: props.httpAdapter,
            locale: props.locale
        }).then((sitemap2)=>{
            if (!cancelled) {
                setState({
                    status: "ready",
                    sitemap: sitemap2
                });
            }
        }).catch((error)=>{
            if (!cancelled) {
                setState({
                    status: "error",
                    error: error instanceof Error ? error : new Error(String(error))
                });
            }
        });
        return ()=>{
            cancelled = true;
        };
    }, [
        fetcher,
        baseUrl,
        props.httpAdapter,
        JSON.stringify(sources)
    ]);
    const registry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>state.status === "ready" ? new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["MenuRegistry"](mergeSitemapMenus(state.sitemap)) : null, [
        state
    ]);
    const resolution = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>state.status === "ready" && registry !== null ? resolveSitemapRoute(state.sitemap, registry, pathname) : null, [
        state,
        registry,
        pathname
    ]);
    const sitemap = state.status === "ready" ? state.sitemap : null;
    const guard = props.guard ?? defaultSitemapGuard;
    const decision = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>sitemap !== null && resolution !== null ? guard({
            sitemap,
            pathname,
            menu: resolution.menu
        }) : {
            allow: true
        }, [
        sitemap,
        resolution,
        guard,
        pathname
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!decision.allow) {
            navigate(decision.redirectTo);
        }
    }, [
        decision,
        navigate
    ]);
    if (state.status === "loading") {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Centered, {
            children: props.loading ?? t("pactor.table.loading")
        });
    }
    if (state.status === "error") {
        return props.renderError !== void 0 ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: props.renderError(state.error)
        }) : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Centered, {
            children: t("pactor.sitemap.loadError", {
                message: state.error.message
            })
        });
    }
    if (sitemap === null || registry === null || resolution === null) {
        return null;
    }
    if (!decision.allow) {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Centered, {
            children: t("pactor.sitemap.redirecting")
        });
    }
    if (resolution.route === null) {
        return props.renderNotFound !== void 0 ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: props.renderNotFound(pathname)
        }) : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Centered, {
            children: t("pactor.sitemap.notFound", {
                path: pathname
            })
        });
    }
    const { pageId, layoutChain, highlightKey, params } = resolution.route;
    return(// key 只随最外层布局名变化：布局链共享前缀时外层布局常驻，
    // 仅分叉的内层布局与 PageOutlet 内页面随路由重建
    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(NavHighlightContext.Provider, {
        value: highlightKey,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(SitemapLayout, {
            sitemap,
            registry,
            pageId,
            layoutChain,
            pathname,
            query,
            navigate,
            routeParams: params,
            props
        }, layoutChain[0])
    }));
}
function SitemapLayout({ sitemap, registry, pageId, layoutChain, pathname, query, navigate: hostNavigate, routeParams, props }) {
    const sessionService = props.sessionService ?? "session.context";
    const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            user: sitemap.user,
            app: {
                name: "Pactor App",
                ...sitemap.app
            },
            menus: toSitemapNavItems(registry.tree())
        }), [
        sitemap,
        registry
    ]);
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(to)=>{
            if (/^https?:\/\//.test(to)) {
                window.open(to, "_blank", "noopener");
            } else {
                hostNavigate(to);
            }
        }, [
        hostNavigate
    ]);
    const loader = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>createSitemapLoader(sitemap, {
            pageEndpoint: props.pageEndpoint,
            fetcher: props.fetcher,
            sessionService,
            baseUrl: props.baseUrl,
            httpHooks: props.httpAdapter,
            locale: props.locale
        }), [
        sitemap,
        props.pageEndpoint,
        props.fetcher,
        props.baseUrl,
        props.httpAdapter,
        sessionService,
        props.locale
    ]);
    const services = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            ...createSitemapSessionServices(session, sessionService),
            ...props.services
        }), [
        session,
        sessionService,
        props.services
    ]);
    const actions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            ...defaultSitemapActions,
            ...props.actions
        }), [
        props.actions
    ]);
    const messagesSignature = JSON.stringify(props.messages ?? {});
    const pageFactory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>createPactorPage({
            loader,
            services,
            actions,
            navigate,
            httpAdapter: props.httpAdapter,
            permissions: sitemap.permissions ?? [],
            components: props.components,
            componentRegistry: props.componentRegistry,
            locale: props.locale,
            defaultLocale: props.defaultLocale,
            messages: props.messages
        }), // eslint-disable-next-line react-hooks/exhaustive-deps
    [
        loader,
        services,
        actions,
        navigate,
        props.httpAdapter,
        props.components,
        props.componentRegistry,
        sitemap,
        props.locale,
        props.defaultLocale,
        messagesSignature
    ]);
    const layoutFactory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>createPactorPage({
            // loader 注入使布局运行时的 OverlayHost 支持 page 类型弹层
            //（布局内按钮经 overlay.open 打开懒加载表单页，如创建实例）
            loader,
            services,
            actions,
            navigate,
            httpAdapter: props.httpAdapter,
            components: {
                PageOutlet,
                SitemapMenu,
                ...props.components
            },
            componentRegistry: props.componentRegistry,
            locale: props.locale,
            defaultLocale: props.defaultLocale,
            messages: props.messages
        }), // eslint-disable-next-line react-hooks/exhaustive-deps
    [
        loader,
        services,
        actions,
        navigate,
        props.httpAdapter,
        props.components,
        props.componentRegistry,
        props.locale,
        props.defaultLocale,
        messagesSignature
    ]);
    const Page = pageFactory;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(LayoutLevel, {
        sitemap,
        chain: layoutChain,
        index: 0,
        sessionService,
        layoutFactory,
        outlet: // 页面实例：key 随 pageId + pathname 变化（route 参数变化需重建，
        // PactorPage 的 route prop 不参与运行时重建）——布局保持挂载
        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Page, {
            pageId,
            route: {
                params: routeParams,
                query
            }
        }, `${pageId}@${pathname}`)
    });
}
function LayoutLevel({ sitemap, chain, index, sessionService, layoutFactory, outlet }) {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useI18n"])();
    const layoutName = chain[index];
    const layoutDsl = sitemap.layouts[layoutName];
    const layoutPage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (layoutDsl === void 0) {
            return null;
        }
        return {
            dsl: layoutDsl.dsl,
            page: {
                id: `layout:${layoutName}`,
                title: layoutName
            },
            // 布局级 state / lifecycle 透传（布局运行时常驻，state 跨页面保持）
            state: layoutDsl.state,
            lifecycle: layoutDsl.lifecycle,
            dataSources: {
                session: {
                    type: "service",
                    service: sessionService,
                    autoLoad: true
                }
            },
            body: layoutDsl.body
        };
    }, [
        layoutDsl,
        layoutName,
        sessionService
    ]);
    if (layoutDsl === void 0 || layoutPage === null) {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Centered, {
            children: t("pactor.sitemap.layoutMissing", {
                name: layoutName
            })
        });
    }
    const LayoutPage = layoutFactory;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(OutletContext.Provider, {
        value: index === chain.length - 1 ? outlet : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(LayoutLevel, {
            sitemap,
            chain,
            index: index + 1,
            sessionService,
            layoutFactory,
            outlet
        }, chain[index + 1]),
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(LayoutPage, {
            pageDsl: layoutPage
        }, layoutName)
    });
}
function Centered({ children }) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
        style: {
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            color: "var(--muted-foreground, #6b7280)"
        },
        children
    });
}
;
}),
"[project]/packages/chart/dist/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AreaChart",
    ()=>AreaChart,
    "BarChart",
    ()=>BarChart2,
    "BubbleChart",
    ()=>BubbleChart,
    "ColumnChart",
    ()=>ColumnChart,
    "ComposedChart",
    ()=>ComposedChart,
    "DonutChart",
    ()=>DonutChart,
    "EChartBase",
    ()=>EChartBase,
    "FunnelChart",
    ()=>FunnelChart2,
    "GaugeChart",
    ()=>GaugeChart2,
    "Heatmap",
    ()=>Heatmap,
    "LineChart",
    ()=>LineChart2,
    "MapChart",
    ()=>MapChart2,
    "MetricCard",
    ()=>MetricCard,
    "PieChart",
    ()=>PieChart2,
    "RadarChart",
    ()=>RadarChart2,
    "SankeyChart",
    ()=>SankeyChart2,
    "ScatterChart",
    ()=>ScatterChart2,
    "TreeChart",
    ()=>TreeChart2,
    "chartComponents",
    ()=>chartComponents,
    "createChartComponentRegistry",
    ()=>createChartComponentRegistry,
    "registerChartComponents",
    ()=>registerChartComponents
]);
// src/index.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/dist/index.js [app-ssr] (ecmascript)");
// src/components/MetricCard/index.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$34$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDownRight$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@1.34.0_react@19.2.8/node_modules/lucide-react/dist/esm/icons/arrow-down-right.mjs [app-ssr] (ecmascript) <export default as ArrowDownRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$34$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@1.34.0_react@19.2.8/node_modules/lucide-react/dist/esm/icons/arrow-up-right.mjs [app-ssr] (ecmascript) <export default as ArrowUpRight>");
// src/lib/utils.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$6$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tailwind-merge@3.6.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
// src/components/MetricCard/index.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
// src/components/EChartBase/index.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/runtime/dist/index.js [app-ssr] (ecmascript)");
// src/components/echarts-modules.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$extension$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/extension.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$echarts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/echarts.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$bar$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__BarChart$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/bar/install.js [app-ssr] (ecmascript) <export install as BarChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$funnel$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__FunnelChart$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/funnel/install.js [app-ssr] (ecmascript) <export install as FunnelChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$gauge$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__GaugeChart$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/gauge/install.js [app-ssr] (ecmascript) <export install as GaugeChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$heatmap$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__HeatmapChart$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/heatmap/install.js [app-ssr] (ecmascript) <export install as HeatmapChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__LineChart$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/line/install.js [app-ssr] (ecmascript) <export install as LineChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__MapChart$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/map/install.js [app-ssr] (ecmascript) <export install as MapChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$pie$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__PieChart$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/pie/install.js [app-ssr] (ecmascript) <export install as PieChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$radar$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__RadarChart$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/radar/install.js [app-ssr] (ecmascript) <export install as RadarChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$sankey$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__SankeyChart$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/sankey/install.js [app-ssr] (ecmascript) <export install as SankeyChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$scatter$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__ScatterChart$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/scatter/install.js [app-ssr] (ecmascript) <export install as ScatterChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__TreeChart$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/tree/install.js [app-ssr] (ecmascript) <export install as TreeChart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$dataZoom$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__DataZoomComponent$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/dataZoom/install.js [app-ssr] (ecmascript) <export install as DataZoomComponent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$geo$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__GeoComponent$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/geo/install.js [app-ssr] (ecmascript) <export install as GeoComponent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$grid$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__GridComponent$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/grid/install.js [app-ssr] (ecmascript) <export install as GridComponent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$legend$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__LegendComponent$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/legend/install.js [app-ssr] (ecmascript) <export install as LegendComponent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$radar$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__RadarComponent$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/radar/install.js [app-ssr] (ecmascript) <export install as RadarComponent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$title$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__TitleComponent$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/title/install.js [app-ssr] (ecmascript) <export install as TitleComponent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$tooltip$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__TooltipComponent$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/tooltip/install.js [app-ssr] (ecmascript) <export install as TooltipComponent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$visualMap$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__VisualMapComponent$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/visualMap/install.js [app-ssr] (ecmascript) <export install as VisualMapComponent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$renderer$2f$installCanvasRenderer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__CanvasRenderer$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/renderer/installCanvasRenderer.js [app-ssr] (ecmascript) <export install as CanvasRenderer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$V5RS22V3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/dist/chunk-V5RS22V3.js [app-ssr] (ecmascript) <locals>");
;
;
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$6$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
;
function MetricCard({ title, value, prefix, suffix, trend, trendLabel, className, style }) {
    const showTrend = typeof trend === "number" && trend !== 0;
    const rising = (trend ?? 0) > 0;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
        "data-slot": "metric-card",
        className: cn("rounded-lg border bg-card p-4 text-card-foreground shadow-sm", className),
        style,
        children: [
            title ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                "data-slot": "metric-card-title",
                className: "text-sm text-muted-foreground",
                children: title
            }) : null,
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                "data-slot": "metric-card-value",
                className: "mt-1 text-2xl font-semibold tracking-tight tabular-nums",
                children: [
                    prefix,
                    value,
                    suffix
                ]
            }),
            showTrend ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                "data-slot": "metric-card-trend",
                "data-trend": rising ? "up" : "down",
                className: cn("mt-1 inline-flex items-center gap-0.5 text-sm", rising ? "text-success" : "text-destructive"),
                children: [
                    rising ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$34$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
                        className: "size-4"
                    }) : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$1$2e$34$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDownRight$3e$__["ArrowDownRight"], {
                        className: "size-4"
                    }),
                    Math.abs(trend ?? 0),
                    "%",
                    trendLabel ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("span", {
                        className: "ml-1 text-muted-foreground",
                        children: trendLabel
                    }) : null
                ]
            }) : null
        ]
    });
}
;
;
;
;
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$extension$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["use"]([
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__LineChart$3e$__["LineChart"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$bar$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__BarChart$3e$__["BarChart"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$pie$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__PieChart$3e$__["PieChart"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$scatter$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__ScatterChart$3e$__["ScatterChart"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$radar$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__RadarChart$3e$__["RadarChart"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$funnel$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__FunnelChart$3e$__["FunnelChart"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$gauge$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__GaugeChart$3e$__["GaugeChart"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$heatmap$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__HeatmapChart$3e$__["HeatmapChart"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__TreeChart$3e$__["TreeChart"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$sankey$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__SankeyChart$3e$__["SankeyChart"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__MapChart$3e$__["MapChart"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$grid$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__GridComponent$3e$__["GridComponent"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$tooltip$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__TooltipComponent$3e$__["TooltipComponent"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$legend$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__LegendComponent$3e$__["LegendComponent"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$title$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__TitleComponent$3e$__["TitleComponent"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$visualMap$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__VisualMapComponent$3e$__["VisualMapComponent"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$dataZoom$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__DataZoomComponent$3e$__["DataZoomComponent"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$geo$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__GeoComponent$3e$__["GeoComponent"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$radar$2f$install$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__RadarComponent$3e$__["RadarComponent"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$renderer$2f$installCanvasRenderer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__install__as__CanvasRenderer$3e$__["CanvasRenderer"]
]);
;
function isEmptyOption(option) {
    const series = option.series;
    if (!Array.isArray(series)) return false;
    if (series.some((item)=>item?.map)) return false;
    return series.every((item)=>{
        const data = item?.data;
        return !Array.isArray(data) || data.length === 0;
    });
}
function EChartBase({ option, height = 256, onSelect, className, style, slot }) {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useI18n"])();
    const hostRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const chartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const onSelectRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(onSelect);
    onSelectRef.current = onSelect;
    const [failed, setFailed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const empty = isEmptyOption(option);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (empty) return;
        const host = hostRef.current;
        if (!host) return;
        let chart = null;
        try {
            chart = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$echarts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["init"](host);
        } catch  {
            setFailed(true);
            return;
        }
        chartRef.current = chart;
        chart.on("click", (params)=>{
            onSelectRef.current?.({
                name: params.name,
                value: params.value,
                seriesName: params.seriesName,
                dataIndex: params.dataIndex
            });
        });
        const observer2 = new ResizeObserver(()=>chart?.resize());
        observer2.observe(host);
        return ()=>{
            observer2.disconnect();
            chart?.dispose();
            chartRef.current = null;
        };
    }, [
        empty
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            chartRef.current?.setOption(option, {
                notMerge: true
            });
        } catch  {}
    }, [
        option
    ]);
    if (failed) {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
            "data-slot": "chart-fallback",
            className: cn("flex h-32 w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground", className),
            style,
            children: "\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301\u56FE\u8868\u6E32\u67D3"
        });
    }
    if (empty) {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
            "data-slot": "chart-empty",
            className: cn("flex w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground", className),
            style: {
                height: typeof height === "number" ? `${height}px` : height,
                ...style
            },
            children: t("pactor.chart.empty")
        });
    }
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
        ref: hostRef,
        "data-slot": slot,
        className: cn("w-full", className),
        style: {
            height: typeof height === "number" ? `${height}px` : height,
            ...style
        }
    });
}
// src/components/lib/option-builders.ts
function pickColor(theme, colors, index) {
    if (colors && colors.length > 0) return colors[index % colors.length];
    return theme.palette[index % theme.palette.length];
}
function toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
}
function axisLabel(theme) {
    return {
        color: theme.muted
    };
}
function grid() {
    return {
        left: 8,
        right: 16,
        top: 40,
        bottom: 4,
        containLabel: true
    };
}
function axisTooltip(theme) {
    return {
        trigger: "axis",
        backgroundColor: theme.card,
        borderColor: theme.border,
        textStyle: {
            color: theme.foreground
        }
    };
}
function itemTooltip(theme) {
    return {
        trigger: "item",
        backgroundColor: theme.card,
        borderColor: theme.border,
        textStyle: {
            color: theme.foreground
        }
    };
}
function titleOption(title) {
    return title ? {
        text: title,
        left: 8,
        top: 4
    } : void 0;
}
function legendOption(theme, show) {
    return show ? {
        top: 4,
        textStyle: {
            color: theme.muted
        }
    } : void 0;
}
function categorySeries(input, theme, kind, area) {
    const rows = input.data;
    const keys = input.yKeys && input.yKeys.length > 0 ? input.yKeys : [
        "value"
    ];
    const series = keys.map((key, index)=>({
            type: kind,
            name: key,
            data: rows.map((row)=>toNumber(row[key])),
            ...kind === "line" ? {
                smooth: input.smooth ?? false,
                symbolSize: 6
            } : {},
            ...area ? {
                areaStyle: {
                    opacity: input.fillOpacity ?? 0.25
                }
            } : {},
            ...input.stacked ? {
                stack: "total"
            } : {},
            ...kind === "line" ? {
                emphasis: {
                    focus: "series"
                }
            } : {},
            itemStyle: {
                color: pickColor(theme, input.colors, index)
            },
            ...kind === "line" ? {
                lineStyle: {
                    color: pickColor(theme, input.colors, index)
                }
            } : {},
            ...area ? {
                lineStyle: {
                    color: pickColor(theme, input.colors, index)
                }
            } : {}
        }));
    const legend = legendOption(theme, keys.length > 1);
    return {
        color: input.colors && input.colors.length > 0 ? input.colors : theme.palette,
        title: titleOption(input.title),
        grid: grid(),
        tooltip: axisTooltip(theme),
        ...legend ? {
            legend
        } : {},
        xAxis: {
            type: "category",
            data: rows.map((row)=>String(input.xKey ? row[input.xKey] : "")),
            axisLabel: axisLabel(theme),
            axisLine: {
                lineStyle: {
                    color: theme.border
                }
            }
        },
        yAxis: {
            type: "value",
            axisLabel: axisLabel(theme),
            splitLine: {
                lineStyle: {
                    color: theme.border
                }
            }
        },
        series
    };
}
function buildLineOption(input, theme) {
    return categorySeries(input, theme, "line", input.showArea ?? false);
}
function buildColumnOption(input, theme) {
    return categorySeries(input, theme, "bar", false);
}
function buildBarOption(input, theme) {
    const rows = input.data;
    const keys = input.yKeys && input.yKeys.length > 0 ? input.yKeys : [
        "value"
    ];
    const series = keys.map((key, index)=>({
            type: "bar",
            name: key,
            data: rows.map((row)=>toNumber(row[key])),
            ...input.stacked ? {
                stack: "total"
            } : {},
            itemStyle: {
                color: pickColor(theme, input.colors, index)
            }
        }));
    const legend = legendOption(theme, keys.length > 1);
    return {
        color: input.colors && input.colors.length > 0 ? input.colors : theme.palette,
        title: titleOption(input.title),
        grid: grid(),
        tooltip: axisTooltip(theme),
        ...legend ? {
            legend
        } : {},
        xAxis: {
            type: "value",
            axisLabel: axisLabel(theme),
            splitLine: {
                lineStyle: {
                    color: theme.border
                }
            }
        },
        yAxis: {
            type: "category",
            data: rows.map((row)=>String(input.yKey ? row[input.yKey] : "")),
            axisLabel: axisLabel(theme),
            axisLine: {
                lineStyle: {
                    color: theme.border
                }
            }
        },
        series
    };
}
function buildAreaOption(input, theme) {
    const withArea = {
        ...input,
        showArea: true
    };
    return categorySeries(withArea, theme, "line", true);
}
function pieOption(input, theme, radius, extra) {
    const nameKey = input.nameKey ?? "name";
    const valueKey = input.valueKey ?? "value";
    return {
        color: input.colors && input.colors.length > 0 ? input.colors : theme.palette,
        title: titleOption(input.title),
        tooltip: itemTooltip(theme),
        legend: {
            bottom: 0,
            textStyle: {
                color: theme.muted
            }
        },
        series: [
            {
                type: "pie",
                radius,
                center: [
                    "50%",
                    "52%"
                ],
                data: input.data.map((row)=>({
                        name: String(row[nameKey] ?? ""),
                        value: toNumber(row[valueKey])
                    })),
                label: {
                    show: input.showLabel ?? false,
                    color: theme.muted
                },
                emphasis: {
                    scaleSize: 6
                }
            }
        ],
        ...extra
    };
}
function buildPieOption(input, theme) {
    return pieOption(input, theme, [
        0,
        "72%"
    ], {});
}
function buildDonutOption(input, theme) {
    const inner = input.innerRadius ?? "48%";
    const outer = input.outerRadius ?? "72%";
    const extra = {};
    if (input.centerValue !== void 0 || input.centerLabel !== void 0) {
        extra.title = {
            text: input.centerValue !== void 0 ? String(input.centerValue) : "",
            subtext: input.centerLabel ?? "",
            left: "center",
            top: "40%",
            textStyle: {
                color: theme.foreground,
                fontSize: 22
            },
            subtextStyle: {
                color: theme.muted
            }
        };
    }
    return pieOption(input, theme, [
        inner,
        outer
    ], extra);
}
function scatterSeries(input, theme, extra) {
    const xKey = input.xKey ?? "x";
    const yKey = input.yKey ?? "y";
    const groups = /* @__PURE__ */ new Map();
    if (input.seriesKey) {
        for (const row of input.data){
            const g = String(row[input.seriesKey] ?? "");
            if (!groups.has(g)) groups.set(g, []);
            groups.get(g).push(row);
        }
    } else {
        groups.set("", input.data);
    }
    const names = [
        ...groups.keys()
    ];
    const series = names.map((name, index)=>({
            type: "scatter",
            name: name || void 0,
            data: groups.get(name).map((row)=>extra?.datum ? extra.datum(row) : [
                    toNumber(row[xKey]),
                    toNumber(row[yKey])
                ]),
            symbolSize: extra?.symbolSize ?? 10,
            itemStyle: {
                color: pickColor(theme, input.colors, index)
            }
        }));
    const legend = legendOption(theme, input.seriesKey !== void 0 && names.length > 1);
    return {
        color: input.colors && input.colors.length > 0 ? input.colors : theme.palette,
        title: titleOption(input.title),
        grid: grid(),
        tooltip: axisTooltip(theme),
        ...legend ? {
            legend
        } : {},
        xAxis: {
            type: "value",
            axisLabel: axisLabel(theme),
            splitLine: {
                lineStyle: {
                    color: theme.border
                }
            }
        },
        yAxis: {
            type: "value",
            axisLabel: axisLabel(theme),
            splitLine: {
                lineStyle: {
                    color: theme.border
                }
            }
        },
        series
    };
}
function buildScatterOption(input, theme) {
    return scatterSeries(input, theme);
}
function buildBubbleOption(input, theme) {
    const sizeKey = input.sizeKey ?? "size";
    const sizes = input.data.map((row)=>toNumber(row[sizeKey]));
    const min = Math.min(...sizes, 0);
    const max = Math.max(...sizes, 1);
    const span = max - min || 1;
    return scatterSeries(input, theme, {
        datum: (row)=>[
                toNumber(row[input.xKey ?? "x"]),
                toNumber(row[input.yKey ?? "y"]),
                toNumber(row[sizeKey])
            ],
        symbolSize: (datum)=>{
            const [x, y, size] = datum;
            void x;
            void y;
            return 12 + (toNumber(size) - min) / span * 36;
        }
    });
}
function buildRadarOption(input, theme) {
    const indicatorKey = input.indicatorKey ?? "indicator";
    const keys = input.yKeys && input.yKeys.length > 0 ? input.yKeys : [
        "value"
    ];
    return {
        color: input.colors && input.colors.length > 0 ? input.colors : theme.palette,
        title: titleOption(input.title),
        tooltip: itemTooltip(theme),
        ...keys.length > 1 ? {
            legend: legendOption(theme, true)
        } : {},
        radar: {
            indicator: input.data.map((row)=>({
                    name: String(row[indicatorKey] ?? ""),
                    max: 100
                })),
            axisName: {
                color: theme.muted
            },
            splitLine: {
                lineStyle: {
                    color: theme.border
                }
            },
            splitArea: {
                areaStyle: {
                    color: []
                }
            }
        },
        series: [
            {
                type: "radar",
                data: keys.map((key)=>({
                        name: key,
                        value: input.data.map((row)=>toNumber(row[key]))
                    }))
            }
        ]
    };
}
function buildFunnelOption(input, theme) {
    const nameKey = input.nameKey ?? "name";
    const valueKey = input.valueKey ?? "value";
    return {
        color: input.colors && input.colors.length > 0 ? input.colors : theme.palette,
        title: titleOption(input.title),
        tooltip: itemTooltip(theme),
        series: [
            {
                type: "funnel",
                left: "12%",
                width: "76%",
                sort: input.sort ?? "descending",
                gap: 2,
                label: {
                    show: true,
                    position: "inside",
                    color: theme.card
                },
                data: input.data.map((row)=>({
                        name: String(row[nameKey] ?? ""),
                        value: toNumber(row[valueKey])
                    }))
            }
        ]
    };
}
function buildGaugeOption(input, theme) {
    const min = input.min ?? 0;
    const max = input.max ?? 100;
    const span = max - min || 1;
    const defaultThresholds = [
        {
            value: max,
            color: theme.palette[0]
        }
    ];
    const stops = (input.thresholds && input.thresholds.length > 0 ? input.thresholds : defaultThresholds).slice().sort((a, b)=>a.value - b.value).map((t, index, arr)=>{
        const upper = index < arr.length - 1 ? t.value : max;
        return [
            (upper - min) / span,
            t.color ?? theme.palette[0]
        ];
    });
    return {
        title: titleOption(input.title),
        series: [
            {
                type: "gauge",
                min,
                max,
                startAngle: 210,
                endAngle: -30,
                progress: {
                    show: true,
                    width: 10
                },
                axisLine: {
                    lineStyle: {
                        width: 10,
                        color: stops
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                pointer: {
                    show: false
                },
                anchor: {
                    show: false
                },
                title: {
                    show: false
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: [
                        0,
                        0
                    ],
                    fontSize: 26,
                    color: theme.foreground,
                    formatter: (value)=>`${value}${input.unit ?? ""}`
                },
                data: [
                    {
                        value: toNumber(input.value)
                    }
                ]
            }
        ]
    };
}
function valueRange(values) {
    if (values.length === 0) return {
        min: 0,
        max: 1
    };
    const min = Math.min(...values);
    const max = Math.max(...values);
    return max === min ? {
        min,
        max: min + 1
    } : {
        min,
        max
    };
}
function buildHeatmapOption(input, theme) {
    const xKey = input.xKey ?? "x";
    const yKey = input.yKey ?? "y";
    const valueKey = input.valueKey ?? "value";
    const xs = [
        ...new Set(input.data.map((row)=>String(row[xKey])))
    ];
    const ys = [
        ...new Set(input.data.map((row)=>String(row[yKey])))
    ];
    const range = valueRange(input.data.map((row)=>toNumber(row[valueKey])));
    return {
        title: titleOption(input.title),
        grid: grid(),
        tooltip: itemTooltip(theme),
        xAxis: {
            type: "category",
            data: xs,
            axisLabel: axisLabel(theme),
            splitArea: {
                show: true
            }
        },
        yAxis: {
            type: "category",
            data: ys,
            axisLabel: axisLabel(theme),
            splitArea: {
                show: true
            }
        },
        visualMap: {
            min: range.min,
            max: range.max,
            calculable: true,
            orient: "horizontal",
            left: "center",
            bottom: 0,
            textStyle: {
                color: theme.muted
            },
            inRange: {
                color: [
                    theme.palette[2] ?? theme.palette[0],
                    theme.palette[0]
                ]
            }
        },
        series: [
            {
                type: "heatmap",
                data: input.data.map((row)=>[
                        String(row[xKey]),
                        String(row[yKey]),
                        toNumber(row[valueKey])
                    ]),
                label: {
                    show: false
                }
            }
        ]
    };
}
function buildTreeOption(input, theme) {
    const horizontal = input.orient === "horizontal";
    return {
        title: titleOption(input.title),
        tooltip: itemTooltip(theme),
        series: [
            {
                type: "tree",
                data: input.data,
                layout: "orthogonal",
                orient: horizontal ? "LR" : "TB",
                edgeShape: input.edgeShape ?? "curve",
                roam: false,
                expandAndCollapse: true,
                initialTreeDepth: input.initialTreeDepth ?? 2,
                label: {
                    show: true,
                    position: horizontal ? "right" : "bottom",
                    color: theme.foreground,
                    fontSize: 12
                },
                itemStyle: {
                    color: theme.palette[0],
                    borderColor: theme.palette[0]
                },
                lineStyle: {
                    color: theme.border,
                    width: 1.5,
                    curveness: 0.5
                },
                leaves: {
                    itemStyle: {
                        color: theme.palette[1],
                        borderColor: theme.palette[1]
                    }
                },
                emphasis: {
                    focus: "relative"
                }
            }
        ]
    };
}
function buildSankeyOption(input, theme) {
    return {
        color: theme.palette,
        title: titleOption(input.title),
        tooltip: itemTooltip(theme),
        series: [
            {
                type: "sankey",
                left: 24,
                right: 64,
                top: 40,
                bottom: 24,
                nodeWidth: 16,
                nodeGap: 12,
                draggable: false,
                label: {
                    color: theme.muted
                },
                lineStyle: {
                    color: "gradient",
                    curveness: 0.5
                },
                emphasis: {
                    focus: "adjacency"
                },
                data: input.nodes,
                links: input.links
            }
        ]
    };
}
function buildMapOption(input, theme) {
    const nameKey = input.nameKey ?? "name";
    const valueKey = input.valueKey ?? "value";
    const range = valueRange(input.data.map((row)=>toNumber(row[valueKey])));
    return {
        title: titleOption(input.title),
        tooltip: itemTooltip(theme),
        visualMap: {
            min: range.min,
            max: range.max,
            left: 8,
            bottom: 8,
            textStyle: {
                color: theme.muted
            },
            inRange: {
                color: [
                    theme.palette[2] ?? theme.palette[0],
                    theme.palette[0]
                ]
            }
        },
        series: [
            {
                type: "map",
                map: input.mapName,
                roam: false,
                label: {
                    show: false
                },
                emphasis: {
                    label: {
                        show: true,
                        color: theme.foreground
                    }
                },
                itemStyle: {
                    borderColor: theme.card,
                    borderWidth: 1
                },
                data: input.data.map((row)=>({
                        name: String(row[nameKey] ?? ""),
                        value: toNumber(row[valueKey])
                    }))
            }
        ]
    };
}
function buildComposedOption(input, theme) {
    const rows = input.data;
    const hasSecondAxis = input.series.some((s)=>s.yAxisIndex === 1);
    const series = input.series.map((s, index)=>{
        const color = pickColor(theme, input.colors, index);
        return {
            type: s.type === "area" ? "line" : s.type,
            name: s.name ?? s.dataKey,
            data: rows.map((row)=>toNumber(row[s.dataKey])),
            ...s.type === "line" ? {
                smooth: false,
                symbolSize: 6
            } : {},
            ...s.type === "area" ? {
                areaStyle: {
                    opacity: 0.25
                }
            } : {},
            yAxisIndex: s.yAxisIndex ?? 0,
            itemStyle: {
                color
            },
            ...s.type !== "bar" ? {
                lineStyle: {
                    color
                }
            } : {}
        };
    });
    return {
        color: input.colors && input.colors.length > 0 ? input.colors : theme.palette,
        title: titleOption(input.title),
        grid: grid(),
        tooltip: axisTooltip(theme),
        legend: legendOption(theme, true),
        xAxis: {
            type: "category",
            data: rows.map((row)=>String(input.xKey ? row[input.xKey] : "")),
            axisLabel: axisLabel(theme),
            axisLine: {
                lineStyle: {
                    color: theme.border
                }
            }
        },
        yAxis: hasSecondAxis ? [
            {
                type: "value",
                axisLabel: axisLabel(theme),
                splitLine: {
                    lineStyle: {
                        color: theme.border
                    }
                }
            },
            {
                type: "value",
                axisLabel: axisLabel(theme),
                splitLine: {
                    show: false
                }
            }
        ] : {
            type: "value",
            axisLabel: axisLabel(theme),
            splitLine: {
                lineStyle: {
                    color: theme.border
                }
            }
        },
        series
    };
}
;
// src/components/lib/color.ts
var LPAREN = String.fromCharCode(40);
var RPAREN = String.fromCharCode(41);
var OKLCH_RE = new RegExp("^oklch" + String.fromCharCode(92) + LPAREN + "\\s*([\\d.]+%?)\\s+([-\\d.eE]+)\\s+([-\\d.eE]+)(?:\\s*\\/\\s*[\\d.]+%?)?\\s*" + String.fromCharCode(92) + RPAREN + "$", "i");
var OKLAB_RE = new RegExp("^oklab" + String.fromCharCode(92) + LPAREN + "\\s*([\\d.]+%?)\\s+([-\\d.eE]+)\\s+([-\\d.eE]+)(?:\\s*\\/\\s*[\\d.]+%?)?\\s*" + String.fromCharCode(92) + RPAREN + "$", "i");
function parseLightness(raw) {
    const value = parseFloat(raw);
    return raw.endsWith("%") ? value / 100 : value;
}
function oklabToLinearSrgbColor(L, a, b) {
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.291485548 * b;
    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;
    return [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
    ];
}
function linearToSrgbChannel(c) {
    const clamped = Math.min(1, Math.max(0, c));
    const encoded = clamped <= 31308e-7 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
    return Math.round(encoded * 255);
}
function formatSrgbString(r, g, b) {
    return "rgb" + LPAREN + `${linearToSrgbChannel(r)}, ${linearToSrgbChannel(g)}, ${linearToSrgbChannel(b)}` + RPAREN;
}
function normalizeColor(value) {
    const trimmed = value.trim();
    const oklch = OKLCH_RE.exec(trimmed);
    if (oklch) {
        const L = parseLightness(oklch[1]);
        const C = parseFloat(oklch[2]);
        const h = parseFloat(oklch[3]) * Math.PI / 180;
        const [r, g, b] = oklabToLinearSrgbColor(L, C * Math.cos(h), C * Math.sin(h));
        return formatSrgbString(r, g, b);
    }
    const oklab = OKLAB_RE.exec(trimmed);
    if (oklab) {
        const L = parseLightness(oklab[1]);
        const a = parseFloat(oklab[2]);
        const b = parseFloat(oklab[3]);
        const [r, g, bl] = oklabToLinearSrgbColor(L, a, b);
        return formatSrgbString(r, g, bl);
    }
    return trimmed;
}
// src/components/lib/theme.ts
var FALLBACK_THEME = {
    palette: [
        "steelblue",
        "seagreen",
        "darkorange",
        "slateblue",
        "tomato"
    ],
    foreground: "black",
    muted: "gray",
    border: "gainsboro",
    card: "white",
    success: "seagreen",
    warning: "darkorange",
    destructive: "tomato",
    info: "steelblue"
};
var cached = null;
function getChartTheme() {
    if (cached) return cached;
    if (typeof document === "undefined") return FALLBACK_THEME;
    try {
        const style = getComputedStyle(document.documentElement);
        const read = (name)=>normalizeColor(style.getPropertyValue(name));
        const readColor = (name, fallback)=>read(name) || fallback;
        const palette = [
            1,
            2,
            3,
            4,
            5
        ].map((i, index)=>readColor(`--chart-${i}`, FALLBACK_THEME.palette[index]));
        cached = {
            palette,
            foreground: readColor("--foreground", FALLBACK_THEME.foreground),
            muted: readColor("--muted-foreground", FALLBACK_THEME.muted),
            border: readColor("--border", FALLBACK_THEME.border),
            card: readColor("--card", FALLBACK_THEME.card),
            success: readColor("--success", FALLBACK_THEME.success),
            warning: readColor("--warning", FALLBACK_THEME.warning),
            destructive: readColor("--destructive", FALLBACK_THEME.destructive),
            info: readColor("--info", FALLBACK_THEME.info)
        };
        return cached;
    } catch  {
        return FALLBACK_THEME;
    }
}
function resetChartTheme() {
    cached = null;
}
var CHART_SKIN_CHANGE_EVENT = "pactor:skin-change";
var listeners = /* @__PURE__ */ new Set();
var observer = null;
var scheduled = false;
function scheduleNotify() {
    if (scheduled) return;
    scheduled = true;
    const enqueue = typeof requestAnimationFrame === "function" ? requestAnimationFrame : (cb)=>setTimeout(cb, 0);
    enqueue(()=>{
        scheduled = false;
        resetChartTheme();
        for (const listener of [
            ...listeners
        ]){
            listener();
        }
    });
}
function handleResourceLoad(event) {
    const target = event.target;
    if (target instanceof HTMLLinkElement || target instanceof HTMLStyleElement) {
        scheduleNotify();
    }
}
function subscribeChartTheme(listener) {
    if (typeof document === "undefined" || typeof MutationObserver === "undefined") {
        return ()=>{};
    }
    listeners.add(listener);
    if (!observer) {
        observer = new MutationObserver(scheduleNotify);
        observer.observe(document.documentElement, {
            attributes: true
        });
        observer.observe(document.head, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
        });
        document.addEventListener("load", handleResourceLoad, true);
        window.addEventListener(CHART_SKIN_CHANGE_EVENT, scheduleNotify);
    }
    return ()=>{
        listeners.delete(listener);
        if (listeners.size === 0 && observer) {
            observer.disconnect();
            observer = null;
            document.removeEventListener("load", handleResourceLoad, true);
            window.removeEventListener(CHART_SKIN_CHANGE_EVENT, scheduleNotify);
        }
    };
}
// src/components/lib/use-chart-theme.ts
function useChartTheme() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribeChartTheme, getChartTheme, getChartTheme);
}
;
function LineChart2({ data = [], xKey, yKeys, smooth = false, showArea = false, stacked = false, colors, title, height, onSelect, className, style }) {
    const option = buildLineOption({
        data,
        xKey,
        yKeys,
        smooth,
        showArea,
        stacked,
        colors,
        title
    }, useChartTheme());
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(EChartBase, {
        slot: "line-chart",
        option,
        height,
        onSelect,
        className,
        style
    });
}
;
function ColumnChart({ data = [], xKey, yKeys, stacked = false, colors, title, height, onSelect, className, style }) {
    const option = buildColumnOption({
        data,
        xKey,
        yKeys,
        stacked,
        colors,
        title
    }, useChartTheme());
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(EChartBase, {
        slot: "column-chart",
        option,
        height,
        onSelect,
        className,
        style
    });
}
;
function BarChart2({ data = [], yKey, xKeys, stacked = false, colors, title, height, onSelect, className, style }) {
    const option = buildBarOption({
        data,
        yKey,
        yKeys: xKeys,
        stacked,
        colors,
        title
    }, useChartTheme());
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(EChartBase, {
        slot: "bar-chart",
        option,
        height,
        onSelect,
        className,
        style
    });
}
;
function AreaChart({ data = [], xKey, yKeys, stacked = false, fillOpacity, colors, title, height, onSelect, className, style }) {
    const option = buildAreaOption({
        data,
        xKey,
        yKeys,
        stacked,
        fillOpacity,
        colors,
        title
    }, useChartTheme());
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(EChartBase, {
        slot: "area-chart",
        option,
        height,
        onSelect,
        className,
        style
    });
}
;
function PieChart2({ data = [], nameKey, valueKey, showLabel, colors, title, height, onSelect, className, style }) {
    const option = buildPieOption({
        data,
        nameKey,
        valueKey,
        showLabel,
        colors,
        title
    }, useChartTheme());
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(EChartBase, {
        slot: "pie-chart",
        option,
        height,
        onSelect,
        className,
        style
    });
}
;
function DonutChart({ data = [], nameKey, valueKey, innerRadius, outerRadius, centerLabel, centerValue, showLabel, colors, title, height, onSelect, className, style }) {
    const option = buildDonutOption({
        data,
        nameKey,
        valueKey,
        innerRadius,
        outerRadius,
        centerLabel,
        centerValue,
        showLabel,
        colors,
        title
    }, useChartTheme());
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(EChartBase, {
        slot: "donut-chart",
        option,
        height,
        onSelect,
        className,
        style
    });
}
;
function ScatterChart2({ data = [], xKey, yKey, seriesKey, colors, title, height, onSelect, className, style }) {
    const option = buildScatterOption({
        data,
        xKey,
        yKey,
        seriesKey,
        colors,
        title
    }, useChartTheme());
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(EChartBase, {
        slot: "scatter-chart",
        option,
        height,
        onSelect,
        className,
        style
    });
}
;
function BubbleChart({ data = [], xKey, yKey, sizeKey, seriesKey, colors, title, height, onSelect, className, style }) {
    const option = buildBubbleOption({
        data,
        xKey,
        yKey,
        sizeKey,
        seriesKey,
        colors,
        title
    }, useChartTheme());
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(EChartBase, {
        slot: "bubble-chart",
        option,
        height,
        onSelect,
        className,
        style
    });
}
;
function RadarChart2({ data = [], indicatorKey, yKeys, colors, title, height, onSelect, className, style }) {
    const option = buildRadarOption({
        data,
        indicatorKey,
        yKeys,
        colors,
        title
    }, useChartTheme());
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(EChartBase, {
        slot: "radar-chart",
        option,
        height,
        onSelect,
        className,
        style
    });
}
;
function FunnelChart2({ data = [], nameKey, valueKey, sort, colors, title, height, onSelect, className, style }) {
    const option = buildFunnelOption({
        data,
        nameKey,
        valueKey,
        sort,
        colors,
        title
    }, useChartTheme());
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(EChartBase, {
        slot: "funnel-chart",
        option,
        height,
        onSelect,
        className,
        style
    });
}
;
function GaugeChart2({ value = 0, min, max, thresholds, unit, title, height, onSelect, className, style }) {
    const option = buildGaugeOption({
        value,
        min,
        max,
        thresholds,
        unit,
        title
    }, useChartTheme());
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(EChartBase, {
        slot: "gauge-chart",
        option,
        height,
        onSelect,
        className,
        style
    });
}
;
function Heatmap({ data = [], xKey, yKey, valueKey, title, height, onSelect, className, style }) {
    const option = buildHeatmapOption({
        data,
        xKey,
        yKey,
        valueKey,
        title
    }, useChartTheme());
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(EChartBase, {
        slot: "heatmap",
        option,
        height,
        onSelect,
        className,
        style
    });
}
;
function TreeChart2({ data = [], title, orient, edgeShape, initialTreeDepth, height, onSelect, className, style }) {
    const option = buildTreeOption({
        data,
        title,
        orient,
        edgeShape,
        initialTreeDepth
    }, useChartTheme());
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(EChartBase, {
        slot: "tree-chart",
        option,
        height,
        onSelect,
        className,
        style
    });
}
;
function SankeyChart2({ nodes = [], links = [], title, height, onSelect, className, style }) {
    const option = buildSankeyOption({
        nodes,
        links,
        title
    }, useChartTheme());
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(EChartBase, {
        slot: "sankey-chart",
        option,
        height,
        onSelect,
        className,
        style
    });
}
;
;
;
var fetchedMaps = /* @__PURE__ */ new Set();
function hasRegisteredMap(mapName) {
    try {
        return typeof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$echarts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getMap"] === "function" && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$echarts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getMap"](mapName) != null;
    } catch  {
        return false;
    }
}
function MapChart2({ mapName = "map", data = [], nameKey, valueKey, geoJson, geoJsonUrl, title, height, onSelect, className, style }) {
    const theme = useChartTheme();
    const [loadState, setLoadState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>geoJson || !geoJsonUrl || hasRegisteredMap(mapName) ? "idle" : "loading");
    if (geoJson) {
        try {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$echarts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["registerMap"](mapName, geoJson);
        } catch  {}
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (geoJson || !geoJsonUrl || hasRegisteredMap(mapName) || fetchedMaps.has(mapName)) {
            setLoadState("idle");
            return;
        }
        let cancelled = false;
        setLoadState("loading");
        fetch(geoJsonUrl).then((res)=>{
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        }).then((json)=>{
            if (cancelled) return;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$echarts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["registerMap"](mapName, json);
            fetchedMaps.add(mapName);
            setLoadState("ready");
        }).catch(()=>{
            if (cancelled) return;
            console.warn(`[MapChart] \u5730\u56FE\u6570\u636E\u52A0\u8F7D\u5931\u8D25\uFF1A${geoJsonUrl}`);
            setLoadState("error");
        });
        return ()=>{
            cancelled = true;
        };
    }, [
        geoJson,
        geoJsonUrl,
        mapName
    ]);
    if (geoJsonUrl && !geoJson && loadState === "loading") {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
            "data-slot": "map-chart-loading",
            className,
            style: {
                height: typeof height === "number" ? `${height}px` : height ?? 256,
                ...style
            }
        });
    }
    if (!geoJson && loadState === "error") {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$V5RS22V3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Empty"], {
            title: "\u5730\u56FE\u52A0\u8F7D\u5931\u8D25",
            description: "\u8BF7\u68C0\u67E5 geoJsonUrl \u7F51\u7EDC\u53EF\u8FBE\u6027\uFF0C\u6216\u6539\u7528 geoJson / \u9884\u6CE8\u518C\u5730\u56FE",
            className,
            style
        });
    }
    if (!geoJson && !hasRegisteredMap(mapName)) {
        console.warn(`[MapChart] \u5730\u56FE "${mapName}" \u672A\u6CE8\u518C\uFF1A\u8BF7\u4F20\u5165 geoJson / geoJsonUrl\uFF0C\u6216\u5728\u5E94\u7528\u542F\u52A8\u65F6 echarts.registerMap`);
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$V5RS22V3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Empty"], {
            title: "\u5730\u56FE\u672A\u6CE8\u518C",
            description: "\u8BF7\u4F20\u5165 geoJson / geoJsonUrl\uFF0C\u6216\u5728\u5E94\u7528\u542F\u52A8\u65F6\u6CE8\u518C\u5730\u56FE\u6570\u636E",
            className,
            style
        });
    }
    const option = buildMapOption({
        mapName,
        data,
        nameKey,
        valueKey,
        title
    }, theme);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(EChartBase, {
        slot: "map-chart",
        option,
        height,
        onSelect,
        className,
        style
    });
}
;
function ComposedChart({ data = [], xKey, series = [], colors, title, height, onSelect, className, style }) {
    const option = buildComposedOption({
        data,
        xKey,
        series,
        colors,
        title
    }, useChartTheme());
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(EChartBase, {
        slot: "composed-chart",
        option,
        height,
        onSelect,
        className,
        style
    });
}
// src/index.ts
var chartComponents = {
    MetricCard,
    LineChart: LineChart2,
    ColumnChart,
    BarChart: BarChart2,
    AreaChart,
    PieChart: PieChart2,
    DonutChart,
    ScatterChart: ScatterChart2,
    BubbleChart,
    RadarChart: RadarChart2,
    FunnelChart: FunnelChart2,
    GaugeChart: GaugeChart2,
    Heatmap,
    TreeChart: TreeChart2,
    SankeyChart: SankeyChart2,
    MapChart: MapChart2,
    ComposedChart
};
function registerChartComponents(registry) {
    for (const [type, component] of Object.entries(chartComponents)){
        registry.register(type, component);
    }
}
function createChartComponentRegistry() {
    const registry = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Registry"]("ComponentRegistry");
    registerChartComponents(registry);
    return registry;
}
;
}),
"[project]/packages/core/dist/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RUNTIME_SCOPES",
    ()=>RUNTIME_SCOPES,
    "Registry",
    ()=>Registry,
    "createI18nContext",
    ()=>createI18nContext,
    "isDslFragmentPayload",
    ()=>isDslFragmentPayload,
    "isDslSourceRef",
    ()=>isDslSourceRef,
    "isI18nDescriptor",
    ()=>isI18nDescriptor,
    "isLocalizedText",
    ()=>isLocalizedText,
    "lookupI18nMessage",
    ()=>lookupI18nMessage,
    "resolveRootNodes",
    ()=>resolveRootNodes
]);
// src/node.ts
function isDslSourceRef(value) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return false;
    }
    const source = value.source;
    return typeof source === "object" && source !== null && (source.type === "service" || source.type === "http");
}
// src/document.ts
function resolveRootNodes(pageDsl) {
    if (pageDsl.body) {
        return [
            pageDsl.body
        ];
    }
    if (Array.isArray(pageDsl.children)) {
        return pageDsl.children;
    }
    return [];
}
function isDslFragmentPayload(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value) && Array.isArray(value.children);
}
// src/scope.ts
var RUNTIME_SCOPES = [
    "global",
    "app",
    "page",
    "overlay",
    "form",
    "component",
    "row",
    "event"
];
// src/registry.ts
var Registry = class {
    /**
   * @param label 用于错误信息中标识 Registry 用途，如 "ComponentRegistry"
   */ constructor(label = "Registry"){
        this.label = label;
        this.items = /* @__PURE__ */ new Map();
    }
    /** 注册条目；重复注册同名条目抛出错误 */ register(name, item) {
        if (this.items.has(name)) {
            throw new Error(`[${this.label}] duplicate registration: "${name}"`);
        }
        this.items.set(name, item);
    }
    /** 获取条目；未注册时返回 undefined，不抛错 */ get(name) {
        return this.items.get(name);
    }
    has(name) {
        return this.items.has(name);
    }
    /** 注销条目；返回是否存在并被移除 */ unregister(name) {
        return this.items.delete(name);
    }
    /** 全部已注册名称 */ list() {
        return [
            ...this.items.keys()
        ];
    }
};
// src/i18n.ts
function interpolate(template, params) {
    return template.replace(/\{\{(\w+)\}\}/g, (_, name)=>{
        const value = params[name];
        return value === void 0 || value === null ? "" : String(value);
    });
}
function isStringMap(value) {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    return Object.values(value).every((v)=>typeof v === "string");
}
function isRecord(value) {
    return typeof value === "object" && value !== null;
}
function isI18nDescriptor(value) {
    if (!isRecord(value) || !isRecord(value.$i18n)) {
        return false;
    }
    const inner = value.$i18n;
    if (typeof inner.key === "string") {
        return true;
    }
    return isStringMap(inner.messages);
}
function isLocalizedText(value) {
    return isRecord(value) && isRecord(value.$localizedText) && typeof value.$localizedText.template === "string";
}
function lookupI18nMessage(messages, locale, defaultLocale, key) {
    const currentLocaleMessages = messages[locale];
    if (isStringMap(currentLocaleMessages)) {
        const value = currentLocaleMessages[key];
        if (typeof value === "string") {
            return {
                found: true,
                value,
                resolvedLocale: locale
            };
        }
    }
    const flatValue = messages[key];
    if (typeof flatValue === "string") {
        return {
            found: true,
            value: flatValue
        };
    }
    if (locale !== defaultLocale) {
        const defaultLocaleMessages = messages[defaultLocale];
        if (isStringMap(defaultLocaleMessages)) {
            const value = defaultLocaleMessages[key];
            if (typeof value === "string") {
                return {
                    found: true,
                    value,
                    resolvedLocale: defaultLocale
                };
            }
        }
    }
    return {
        found: false,
        value: key
    };
}
function createI18nContext(options = {}) {
    const locale = options.locale ?? "zh-CN";
    const defaultLocale = options.defaultLocale ?? "zh-CN";
    const messages = options.messages ?? {};
    const t = (key, params)=>{
        const { found, value } = lookupI18nMessage(messages, locale, defaultLocale, key);
        if (!found) {
            return key;
        }
        return params ? interpolate(value, params) : value;
    };
    return {
        locale,
        defaultLocale,
        t
    };
}
;
}),
"[project]/packages/expression/dist/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExpressionError",
    ()=>ExpressionError,
    "evaluateExpression",
    ()=>evaluateExpression,
    "hasExpression",
    ()=>hasExpression,
    "parseExpression",
    ()=>parseExpression,
    "resolveTemplate",
    ()=>resolveTemplate
]);
// src/evaluator.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/dist/index.js [app-ssr] (ecmascript)");
// src/error.ts
var ExpressionError = class extends Error {
    constructor(message, pos){
        super(pos === void 0 ? message : `${message} (at position ${pos})`);
        this.pos = pos;
        this.name = "ExpressionError";
    }
};
// src/tokenizer.ts
var PUNCTUATORS = [
    "===",
    "!==",
    "&&",
    "||",
    "==",
    "!=",
    "<=",
    ">=",
    "(",
    ")",
    ",",
    ".",
    "?",
    ":",
    "<",
    ">",
    "+",
    "-",
    "*",
    "/",
    "%",
    "!",
    "[",
    "]",
    "{",
    "}"
];
var IDENTIFIER_START = /[A-Za-z_$]/;
var IDENTIFIER_PART = /[A-Za-z0-9_$]/;
var DIGIT = /[0-9]/;
function tokenize(source) {
    const tokens = [];
    let i = 0;
    while(i < source.length){
        const ch = source[i];
        if (/\s/.test(ch)) {
            i += 1;
            continue;
        }
        if (DIGIT.test(ch)) {
            const start = i;
            while(i < source.length && DIGIT.test(source[i]))i += 1;
            if (source[i] === ".") {
                i += 1;
                while(i < source.length && DIGIT.test(source[i]))i += 1;
            }
            tokens.push({
                type: "number",
                value: source.slice(start, i),
                pos: start
            });
            continue;
        }
        if (ch === "'" || ch === '"') {
            const start = i;
            const quote = ch;
            i += 1;
            let value = "";
            let closed = false;
            while(i < source.length){
                const c = source[i];
                if (c === "\\") {
                    const next = source[i + 1];
                    if (next === void 0) break;
                    value += next === "n" ? "\n" : next === "t" ? "	" : next;
                    i += 2;
                    continue;
                }
                if (c === quote) {
                    closed = true;
                    i += 1;
                    break;
                }
                value += c;
                i += 1;
            }
            if (!closed) {
                throw new ExpressionError("unterminated string literal", start);
            }
            tokens.push({
                type: "string",
                value,
                pos: start
            });
            continue;
        }
        if (IDENTIFIER_START.test(ch)) {
            const start = i;
            while(i < source.length && IDENTIFIER_PART.test(source[i]))i += 1;
            tokens.push({
                type: "identifier",
                value: source.slice(start, i),
                pos: start
            });
            continue;
        }
        const punct = PUNCTUATORS.find((p)=>source.startsWith(p, i));
        if (punct) {
            tokens.push({
                type: "punctuator",
                value: punct,
                pos: i
            });
            i += punct.length;
            continue;
        }
        throw new ExpressionError(`unexpected character "${ch}"`, i);
    }
    return tokens;
}
// src/parser.ts
function parseExpression(source) {
    const parser = new Parser(tokenize(source));
    const node = parser.parseConditional();
    parser.expectEnd();
    return node;
}
var Parser = class {
    constructor(tokens){
        this.tokens = tokens;
        this.index = 0;
    }
    peek() {
        return this.tokens[this.index];
    }
    next() {
        const token = this.tokens[this.index];
        if (!token) {
            throw new ExpressionError("unexpected end of expression");
        }
        this.index += 1;
        return token;
    }
    isPunctuator(value) {
        const token = this.peek();
        return token?.type === "punctuator" && token.value === value;
    }
    eatPunctuator(value) {
        if (this.isPunctuator(value)) {
            this.index += 1;
            return true;
        }
        return false;
    }
    expectPunctuator(value) {
        const token = this.peek();
        if (!this.eatPunctuator(value)) {
            throw new ExpressionError(`expected "${value}" but got "${token?.value ?? "end of expression"}"`, token?.pos);
        }
    }
    expectEnd() {
        const token = this.peek();
        if (token) {
            throw new ExpressionError(`unexpected token "${token.value}"`, token.pos);
        }
    }
    parseConditional() {
        const test = this.parseLogicalOr();
        if (this.eatPunctuator("?")) {
            const consequent = this.parseConditional();
            this.expectPunctuator(":");
            const alternate = this.parseConditional();
            return {
                type: "ConditionalExpression",
                test,
                consequent,
                alternate
            };
        }
        return test;
    }
    parseLogicalOr() {
        return this.parseBinaryChain(()=>this.parseLogicalAnd(), [
            "||"
        ], "LogicalExpression");
    }
    parseLogicalAnd() {
        return this.parseBinaryChain(()=>this.parseEquality(), [
            "&&"
        ], "LogicalExpression");
    }
    parseEquality() {
        return this.parseBinaryChain(()=>this.parseRelational(), [
            "==",
            "!=",
            "===",
            "!=="
        ], "BinaryExpression");
    }
    parseRelational() {
        return this.parseBinaryChain(()=>this.parseAdditive(), [
            "<",
            "<=",
            ">",
            ">="
        ], "BinaryExpression");
    }
    parseAdditive() {
        return this.parseBinaryChain(()=>this.parseMultiplicative(), [
            "+",
            "-"
        ], "BinaryExpression");
    }
    parseMultiplicative() {
        return this.parseBinaryChain(()=>this.parseUnary(), [
            "*",
            "/",
            "%"
        ], "BinaryExpression");
    }
    parseBinaryChain(parseOperand, operators, kind) {
        let left = parseOperand();
        for(;;){
            const token = this.peek();
            if (token?.type !== "punctuator" || !operators.includes(token.value)) {
                return left;
            }
            this.next();
            const right = parseOperand();
            if (kind === "LogicalExpression") {
                left = {
                    type: "LogicalExpression",
                    operator: token.value,
                    left,
                    right
                };
            } else {
                left = {
                    type: "BinaryExpression",
                    operator: token.value,
                    left,
                    right
                };
            }
        }
    }
    parseUnary() {
        const token = this.peek();
        if (token?.type === "punctuator" && (token.value === "!" || token.value === "-" || token.value === "+")) {
            this.next();
            return {
                type: "UnaryExpression",
                operator: token.value,
                argument: this.parseUnary()
            };
        }
        return this.parseMemberOrCall();
    }
    parseMemberOrCall() {
        let node = this.parsePrimary();
        for(;;){
            if (this.eatPunctuator(".")) {
                const property = this.next();
                if (property.type !== "identifier") {
                    throw new ExpressionError(`expected property name after "." but got "${property.value}"`, property.pos);
                }
                node = {
                    type: "MemberExpression",
                    object: node,
                    property: {
                        type: "Identifier",
                        name: property.value
                    },
                    computed: false
                };
                continue;
            }
            if (this.eatPunctuator("[")) {
                const property = this.parseConditional();
                this.expectPunctuator("]");
                node = {
                    type: "MemberExpression",
                    object: node,
                    property,
                    computed: true
                };
                continue;
            }
            if (this.isPunctuator("(")) {
                if (node.type !== "Identifier") {
                    throw new ExpressionError("member method calls are not allowed; only whitelisted functions can be called", this.peek()?.pos);
                }
                this.next();
                const args = [];
                if (!this.isPunctuator(")")) {
                    for(;;){
                        args.push(this.parseConditional());
                        if (!this.eatPunctuator(",")) break;
                    }
                }
                this.expectPunctuator(")");
                node = {
                    type: "CallExpression",
                    callee: node,
                    arguments: args
                };
                continue;
            }
            return node;
        }
    }
    parsePrimary() {
        const token = this.next();
        if (token.type === "number") {
            return {
                type: "Literal",
                value: Number(token.value)
            };
        }
        if (token.type === "string") {
            return {
                type: "Literal",
                value: token.value
            };
        }
        if (token.type === "identifier") {
            switch(token.value){
                case "true":
                    return {
                        type: "Literal",
                        value: true
                    };
                case "false":
                    return {
                        type: "Literal",
                        value: false
                    };
                case "null":
                    return {
                        type: "Literal",
                        value: null
                    };
                case "undefined":
                    return {
                        type: "Literal",
                        value: void 0
                    };
                default:
                    return {
                        type: "Identifier",
                        name: token.value
                    };
            }
        }
        if (token.type === "punctuator" && token.value === "(") {
            const node = this.parseConditional();
            this.expectPunctuator(")");
            return node;
        }
        if (token.type === "punctuator" && token.value === "{") {
            const properties = [];
            if (!this.isPunctuator("}")) {
                for(;;){
                    const keyToken = this.next();
                    if (keyToken.type !== "identifier" && keyToken.type !== "string") {
                        throw new ExpressionError(`expected object key but got "${keyToken.value}"`, keyToken.pos);
                    }
                    this.expectPunctuator(":");
                    properties.push({
                        key: keyToken.value,
                        value: this.parseConditional()
                    });
                    if (!this.eatPunctuator(",")) break;
                }
            }
            this.expectPunctuator("}");
            return {
                type: "ObjectExpression",
                properties
            };
        }
        throw new ExpressionError(`unexpected token "${token.value}"`, token.pos);
    }
};
;
var FORBIDDEN_KEYS = /* @__PURE__ */ new Set([
    "__proto__",
    "prototype",
    "constructor"
]);
function isRecord(value) {
    return typeof value === "object" && value !== null;
}
function readProperty(source, key) {
    if (FORBIDDEN_KEYS.has(key)) {
        return void 0;
    }
    if (Array.isArray(source)) {
        if (key === "length") return source.length;
        const index = Number(key);
        if (Number.isInteger(index)) return source[index];
        return void 0;
    }
    if (isRecord(source)) {
        return Object.prototype.hasOwnProperty.call(source, key) ? source[key] : void 0;
    }
    return void 0;
}
function resolveFunction(name, scope, options) {
    const { functions } = options;
    let candidate;
    if (functions instanceof __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Registry"]) {
        candidate = functions.get(name);
    } else if (functions) {
        candidate = readProperty(functions, name);
    }
    if (typeof candidate !== "function") {
        candidate = readProperty(scope, name);
    }
    if (typeof candidate !== "function") {
        throw new ExpressionError(`function "${name}" is not registered`);
    }
    return candidate;
}
function evaluateNode(node, scope, options) {
    switch(node.type){
        case "Literal":
            return node.value;
        case "Identifier":
            return readProperty(scope, node.name);
        case "MemberExpression":
            {
                const object = evaluateNode(node.object, scope, options);
                if (object === null || object === void 0) {
                    return void 0;
                }
                const property = node.computed ? evaluateNode(node.property, scope, options) : node.property.name;
                if (typeof property !== "string" && typeof property !== "number") {
                    return void 0;
                }
                return readProperty(object, String(property));
            }
        case "UnaryExpression":
            {
                const argument = evaluateNode(node.argument, scope, options);
                switch(node.operator){
                    case "!":
                        return !argument;
                    case "-":
                        return -argument;
                    case "+":
                        return +argument;
                }
                break;
            }
        case "BinaryExpression":
            {
                const left = evaluateNode(node.left, scope, options);
                const right = evaluateNode(node.right, scope, options);
                switch(node.operator){
                    case "==":
                        return left == right;
                    case "!=":
                        return left != right;
                    case "===":
                        return left === right;
                    case "!==":
                        return left !== right;
                    case "<":
                        return left < right;
                    case "<=":
                        return left <= right;
                    case ">":
                        return left > right;
                    case ">=":
                        return left >= right;
                    case "+":
                        return left + right;
                    case "-":
                        return left - right;
                    case "*":
                        return left * right;
                    case "/":
                        return left / right;
                    case "%":
                        return left % right;
                }
                break;
            }
        case "LogicalExpression":
            if (node.operator === "&&") {
                const left = evaluateNode(node.left, scope, options);
                return left ? evaluateNode(node.right, scope, options) : left;
            }
            {
                const left = evaluateNode(node.left, scope, options);
                return left ? left : evaluateNode(node.right, scope, options);
            }
        case "ConditionalExpression":
            return evaluateNode(node.test, scope, options) ? evaluateNode(node.consequent, scope, options) : evaluateNode(node.alternate, scope, options);
        case "CallExpression":
            {
                const fn = resolveFunction(node.callee.name, scope, options);
                const args = node.arguments.map((arg)=>evaluateNode(arg, scope, options));
                return fn(...args);
            }
        case "ObjectExpression":
            {
                const out = {};
                for (const { key, value } of node.properties){
                    if (FORBIDDEN_KEYS.has(key)) {
                        throw new ExpressionError(`object literal key "${key}" is not allowed`);
                    }
                    out[key] = evaluateNode(value, scope, options);
                }
                return out;
            }
    }
}
function evaluateExpression(source, scope = {}, options = {}) {
    const node = typeof source === "string" ? parseExpression(source) : source;
    return evaluateNode(node, scope, options);
}
// src/template.ts
function hasExpression(value) {
    return value.includes("${");
}
function splitTemplate(value) {
    const segments = [];
    let textStart = 0;
    let i = 0;
    while(i < value.length){
        if (value[i] === "$" && value[i + 1] === "{") {
            if (i > textStart) {
                segments.push({
                    kind: "text",
                    text: value.slice(textStart, i)
                });
            }
            const exprPos = i;
            i += 2;
            let depth = 1;
            let quote;
            let source = "";
            let closed = false;
            while(i < value.length){
                const c = value[i];
                if (quote !== void 0) {
                    if (c === "\\" && i + 1 < value.length) {
                        source += c + value[i + 1];
                        i += 2;
                        continue;
                    }
                    if (c === quote) {
                        quote = void 0;
                    }
                    source += c;
                    i += 1;
                    continue;
                }
                if (c === "'" || c === '"') {
                    quote = c;
                    source += c;
                    i += 1;
                    continue;
                }
                if (c === "{") {
                    depth += 1;
                    source += c;
                    i += 1;
                    continue;
                }
                if (c === "}") {
                    depth -= 1;
                    if (depth === 0) {
                        closed = true;
                        i += 1;
                        break;
                    }
                    source += c;
                    i += 1;
                    continue;
                }
                source += c;
                i += 1;
            }
            if (!closed) {
                throw new ExpressionError('unterminated "${" in template', exprPos);
            }
            segments.push({
                kind: "expr",
                source,
                pos: exprPos
            });
            textStart = i;
            continue;
        }
        i += 1;
    }
    if (textStart < value.length) {
        segments.push({
            kind: "text",
            text: value.slice(textStart)
        });
    }
    return segments;
}
function stringify(value) {
    return value === null || value === void 0 ? "" : String(value);
}
function resolveTemplate(value, scope = {}, options = {}) {
    if (!hasExpression(value)) {
        return value;
    }
    const segments = splitTemplate(value);
    if (segments.length === 1 && segments[0].kind === "expr") {
        return evaluateExpression(segments[0].source, scope, options);
    }
    return segments.map((segment)=>segment.kind === "text" ? segment.text : stringify(evaluateExpression(segment.source, scope, options))).join("");
}
;
}),
"[project]/packages/markdown/dist/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CodeBlock",
    ()=>CodeBlock,
    "MARKDOWN_DSL_TYPE",
    ()=>MARKDOWN_DSL_TYPE,
    "MARKDOWN_EDITOR_DSL_TYPE",
    ()=>MARKDOWN_EDITOR_DSL_TYPE,
    "MarkdownDslComponent",
    ()=>MarkdownDslComponent,
    "MarkdownEditor",
    ()=>MarkdownEditor,
    "MarkdownEditorDslComponent",
    ()=>MarkdownEditorDslComponent,
    "MarkdownRenderer",
    ()=>MarkdownRenderer,
    "isSafeUrl",
    ()=>isSafeUrl,
    "registerCodeLanguages",
    ()=>registerCodeLanguages,
    "registerMarkdownComponents",
    ()=>registerMarkdownComponents
]);
// src/renderer.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$markdown$40$10$2e$1$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-markdown@10.1.0_@types+react@19.2.18_react@19.2.8/node_modules/react-markdown/lib/index.js [app-ssr] (ecmascript) <export Markdown as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rehype$2d$katex$40$7$2e$0$2e$1$2f$node_modules$2f$rehype$2d$katex$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/rehype-katex@7.0.1/node_modules/rehype-katex/lib/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$remark$2d$gfm$40$4$2e$0$2e$1$2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/remark-gfm@4.0.1/node_modules/remark-gfm/lib/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$remark$2d$math$40$6$2e$0$2e$0$2f$node_modules$2f$remark$2d$math$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/remark-math@6.0.0/node_modules/remark-math/lib/index.js [app-ssr] (ecmascript)");
// src/code-block.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$prism$2d$light$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PrismLight$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-syntax-highlighter@16.1.1_react@19.2.8/node_modules/react-syntax-highlighter/dist/esm/prism-light.js [app-ssr] (ecmascript) <export default as PrismLight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$bash$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-syntax-highlighter@16.1.1_react@19.2.8/node_modules/react-syntax-highlighter/dist/esm/languages/prism/bash.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$css$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-syntax-highlighter@16.1.1_react@19.2.8/node_modules/react-syntax-highlighter/dist/esm/languages/prism/css.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$javascript$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-syntax-highlighter@16.1.1_react@19.2.8/node_modules/react-syntax-highlighter/dist/esm/languages/prism/javascript.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$json$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-syntax-highlighter@16.1.1_react@19.2.8/node_modules/react-syntax-highlighter/dist/esm/languages/prism/json.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$jsx$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-syntax-highlighter@16.1.1_react@19.2.8/node_modules/react-syntax-highlighter/dist/esm/languages/prism/jsx.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$markdown$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-syntax-highlighter@16.1.1_react@19.2.8/node_modules/react-syntax-highlighter/dist/esm/languages/prism/markdown.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$python$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-syntax-highlighter@16.1.1_react@19.2.8/node_modules/react-syntax-highlighter/dist/esm/languages/prism/python.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$tsx$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-syntax-highlighter@16.1.1_react@19.2.8/node_modules/react-syntax-highlighter/dist/esm/languages/prism/tsx.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$typescript$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-syntax-highlighter@16.1.1_react@19.2.8/node_modules/react-syntax-highlighter/dist/esm/languages/prism/typescript.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$yaml$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-syntax-highlighter@16.1.1_react@19.2.8/node_modules/react-syntax-highlighter/dist/esm/languages/prism/yaml.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$styles$2f$prism$2f$one$2d$dark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-syntax-highlighter@16.1.1_react@19.2.8/node_modules/react-syntax-highlighter/dist/esm/styles/prism/one-dark.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$styles$2f$prism$2f$one$2d$light$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-syntax-highlighter@16.1.1_react@19.2.8/node_modules/react-syntax-highlighter/dist/esm/styles/prism/one-light.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$components$2f$BlockTypeSelect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mdxeditor+editor@4.3.4_@codemirror+language@6.13.1_@lezer+highlight@1.2.5_@types+react_2c5e7d739d7bd20c0a7f796fcc387530/node_modules/@mdxeditor/editor/dist/plugins/toolbar/components/BlockTypeSelect.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$components$2f$BoldItalicUnderlineToggles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mdxeditor+editor@4.3.4_@codemirror+language@6.13.1_@lezer+highlight@1.2.5_@types+react_2c5e7d739d7bd20c0a7f796fcc387530/node_modules/@mdxeditor/editor/dist/plugins/toolbar/components/BoldItalicUnderlineToggles.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$codeblock$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mdxeditor+editor@4.3.4_@codemirror+language@6.13.1_@lezer+highlight@1.2.5_@types+react_2c5e7d739d7bd20c0a7f796fcc387530/node_modules/@mdxeditor/editor/dist/plugins/codeblock/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$codemirror$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mdxeditor+editor@4.3.4_@codemirror+language@6.13.1_@lezer+highlight@1.2.5_@types+react_2c5e7d739d7bd20c0a7f796fcc387530/node_modules/@mdxeditor/editor/dist/plugins/codemirror/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$components$2f$CodeToggle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mdxeditor+editor@4.3.4_@codemirror+language@6.13.1_@lezer+highlight@1.2.5_@types+react_2c5e7d739d7bd20c0a7f796fcc387530/node_modules/@mdxeditor/editor/dist/plugins/toolbar/components/CodeToggle.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$components$2f$CreateLink$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mdxeditor+editor@4.3.4_@codemirror+language@6.13.1_@lezer+highlight@1.2.5_@types+react_2c5e7d739d7bd20c0a7f796fcc387530/node_modules/@mdxeditor/editor/dist/plugins/toolbar/components/CreateLink.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$headings$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mdxeditor+editor@4.3.4_@codemirror+language@6.13.1_@lezer+highlight@1.2.5_@types+react_2c5e7d739d7bd20c0a7f796fcc387530/node_modules/@mdxeditor/editor/dist/plugins/headings/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$components$2f$InsertCodeBlock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mdxeditor+editor@4.3.4_@codemirror+language@6.13.1_@lezer+highlight@1.2.5_@types+react_2c5e7d739d7bd20c0a7f796fcc387530/node_modules/@mdxeditor/editor/dist/plugins/toolbar/components/InsertCodeBlock.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$components$2f$InsertTable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mdxeditor+editor@4.3.4_@codemirror+language@6.13.1_@lezer+highlight@1.2.5_@types+react_2c5e7d739d7bd20c0a7f796fcc387530/node_modules/@mdxeditor/editor/dist/plugins/toolbar/components/InsertTable.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$components$2f$InsertThematicBreak$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mdxeditor+editor@4.3.4_@codemirror+language@6.13.1_@lezer+highlight@1.2.5_@types+react_2c5e7d739d7bd20c0a7f796fcc387530/node_modules/@mdxeditor/editor/dist/plugins/toolbar/components/InsertThematicBreak.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$link$2d$dialog$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mdxeditor+editor@4.3.4_@codemirror+language@6.13.1_@lezer+highlight@1.2.5_@types+react_2c5e7d739d7bd20c0a7f796fcc387530/node_modules/@mdxeditor/editor/dist/plugins/link-dialog/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$link$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mdxeditor+editor@4.3.4_@codemirror+language@6.13.1_@lezer+highlight@1.2.5_@types+react_2c5e7d739d7bd20c0a7f796fcc387530/node_modules/@mdxeditor/editor/dist/plugins/link/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$lists$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mdxeditor+editor@4.3.4_@codemirror+language@6.13.1_@lezer+highlight@1.2.5_@types+react_2c5e7d739d7bd20c0a7f796fcc387530/node_modules/@mdxeditor/editor/dist/plugins/lists/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$components$2f$ListsToggle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mdxeditor+editor@4.3.4_@codemirror+language@6.13.1_@lezer+highlight@1.2.5_@types+react_2c5e7d739d7bd20c0a7f796fcc387530/node_modules/@mdxeditor/editor/dist/plugins/toolbar/components/ListsToggle.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$markdown$2d$shortcut$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mdxeditor+editor@4.3.4_@codemirror+language@6.13.1_@lezer+highlight@1.2.5_@types+react_2c5e7d739d7bd20c0a7f796fcc387530/node_modules/@mdxeditor/editor/dist/plugins/markdown-shortcut/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$MDXEditor$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mdxeditor+editor@4.3.4_@codemirror+language@6.13.1_@lezer+highlight@1.2.5_@types+react_2c5e7d739d7bd20c0a7f796fcc387530/node_modules/@mdxeditor/editor/dist/MDXEditor.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$quote$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mdxeditor+editor@4.3.4_@codemirror+language@6.13.1_@lezer+highlight@1.2.5_@types+react_2c5e7d739d7bd20c0a7f796fcc387530/node_modules/@mdxeditor/editor/dist/plugins/quote/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$primitives$2f$toolbar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mdxeditor+editor@4.3.4_@codemirror+language@6.13.1_@lezer+highlight@1.2.5_@types+react_2c5e7d739d7bd20c0a7f796fcc387530/node_modules/@mdxeditor/editor/dist/plugins/toolbar/primitives/toolbar.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$table$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mdxeditor+editor@4.3.4_@codemirror+language@6.13.1_@lezer+highlight@1.2.5_@types+react_2c5e7d739d7bd20c0a7f796fcc387530/node_modules/@mdxeditor/editor/dist/plugins/table/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$thematic$2d$break$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mdxeditor+editor@4.3.4_@codemirror+language@6.13.1_@lezer+highlight@1.2.5_@types+react_2c5e7d739d7bd20c0a7f796fcc387530/node_modules/@mdxeditor/editor/dist/plugins/thematic-break/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mdxeditor+editor@4.3.4_@codemirror+language@6.13.1_@lezer+highlight@1.2.5_@types+react_2c5e7d739d7bd20c0a7f796fcc387530/node_modules/@mdxeditor/editor/dist/plugins/toolbar/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$components$2f$UndoRedo$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@mdxeditor+editor@4.3.4_@codemirror+language@6.13.1_@lezer+highlight@1.2.5_@types+react_2c5e7d739d7bd20c0a7f796fcc387530/node_modules/@mdxeditor/editor/dist/plugins/toolbar/components/UndoRedo.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
var LANGUAGES = {
    bash: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$bash$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    css: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$css$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    javascript: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$javascript$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    js: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$javascript$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    json: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$json$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    jsx: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$jsx$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    markdown: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$markdown$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    md: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$markdown$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    python: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$python$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    py: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$python$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    tsx: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$tsx$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    typescript: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$typescript$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    ts: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$typescript$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    yaml: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$yaml$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    yml: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$languages$2f$prism$2f$yaml$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
};
var registered = false;
function registerCodeLanguages() {
    if (registered) {
        return;
    }
    registered = true;
    for (const [name, language] of Object.entries(LANGUAGES)){
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$prism$2d$light$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PrismLight$3e$__["PrismLight"].registerLanguage(name, language);
    }
}
function isCodeLanguageRegistered(language) {
    return language.toLowerCase() in LANGUAGES;
}
function resolveDarkMode() {
    if (typeof document === "undefined") {
        return false;
    }
    const theme = document.documentElement.getAttribute("data-pactor-theme");
    if (theme === "dark") {
        return true;
    }
    if (theme === "light") {
        return false;
    }
    return ("TURBOPACK compile-time value", "undefined") !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function useDarkMode() {
    const [dark, setDark] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(resolveDarkMode);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (typeof document === "undefined") {
            return;
        }
        const update = ()=>setDark(resolveDarkMode());
        const observer = new MutationObserver(update);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: [
                "data-pactor-theme"
            ]
        });
        const media = window.matchMedia?.("(prefers-color-scheme: dark)");
        media?.addEventListener?.("change", update);
        return ()=>{
            observer.disconnect();
            media?.removeEventListener?.("change", update);
        };
    }, []);
    return dark;
}
function CodeBlock({ language, children }) {
    const dark = useDarkMode();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$prism$2d$light$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PrismLight$3e$__["PrismLight"], {
        language: language.toLowerCase(),
        style: dark ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$styles$2f$prism$2f$one$2d$dark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$syntax$2d$highlighter$40$16$2e$1$2e$1_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$syntax$2d$highlighter$2f$dist$2f$esm$2f$styles$2f$prism$2f$one$2d$light$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
        customStyle: {
            margin: 0,
            background: "transparent",
            fontSize: "0.85em"
        },
        codeTagProps: {
            className: `language-${language.toLowerCase()}`
        },
        children: children.replace(/\n$/, "")
    });
}
function extractFencedCode(preChildren) {
    if (!/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidElement"])(preChildren)) {
        return null;
    }
    const { className, children } = preChildren.props;
    const match = /language-([\w-]+)/.exec(className ?? "");
    if (!match) {
        return null;
    }
    return {
        language: match[1],
        code: String(children ?? "")
    };
}
;
var LINK_PROTOCOL_WHITELIST = /* @__PURE__ */ new Set([
    "http:",
    "https:",
    "mailto:"
]);
var IMAGE_PROTOCOL_WHITELIST = /* @__PURE__ */ new Set([
    "http:",
    "https:"
]);
function extractProtocol(url) {
    const match = /^([a-zA-Z][a-zA-Z0-9+.-]*):/.exec(url.trim());
    return match ? `${match[1].toLowerCase()}:` : null;
}
function isSafeUrl(url, kind) {
    if (typeof url !== "string" || url.trim() === "") {
        return false;
    }
    const protocol = extractProtocol(url);
    if (protocol === null) {
        return true;
    }
    const whitelist = kind === "link" ? LINK_PROTOCOL_WHITELIST : IMAGE_PROTOCOL_WHITELIST;
    return whitelist.has(protocol);
}
var SafeLink = ({ href, children })=>{
    if (!isSafeUrl(href, "link")) {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children
        });
    }
    const protocol = extractProtocol(href);
    if (protocol === "http:" || protocol === "https:") {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("a", {
            href,
            target: "_blank",
            rel: "noreferrer",
            children
        });
    }
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("a", {
        href,
        children
    });
};
var SafeImage = ({ src, alt })=>{
    if (!isSafeUrl(src, "image")) {
        return null;
    }
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("img", {
        src,
        alt: alt ?? ""
    });
};
var baseComponents = {
    a: SafeLink,
    img: SafeImage
};
var highlightingComponents = {
    ...baseComponents,
    pre: ({ children })=>{
        const fenced = extractFencedCode(children);
        if (fenced && isCodeLanguageRegistered(fenced.language)) {
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(CodeBlock, {
                language: fenced.language,
                children: fenced.code
            });
        }
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("pre", {
            children
        });
    }
};
function MarkdownRenderer({ content = "", className, style, math = true, codeHighlight = true }) {
    if (codeHighlight) {
        registerCodeLanguages();
    }
    const containerClass = className ? `pactor-markdown ${className}` : "pactor-markdown";
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
        className: containerClass,
        style,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$markdown$40$10$2e$1$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
            remarkPlugins: math ? [
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$remark$2d$gfm$40$4$2e$0$2e$1$2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$remark$2d$math$40$6$2e$0$2e$0$2f$node_modules$2f$remark$2d$math$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
            ] : [
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$remark$2d$gfm$40$4$2e$0$2e$1$2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
            ],
            rehypePlugins: math ? [
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$rehype$2d$katex$40$7$2e$0$2e$1$2f$node_modules$2f$rehype$2d$katex$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
            ] : [],
            components: codeHighlight ? highlightingComponents : baseComponents,
            children: content
        })
    });
}
;
function MarkdownDslComponent({ content, className, style }) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(MarkdownRenderer, {
        content: content ?? "",
        className,
        style
    });
}
;
;
;
function usePactorTheme() {
    const read = ()=>typeof document !== "undefined" && document.documentElement.getAttribute("data-pactor-theme") === "dark" ? "dark" : "light";
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(read);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (typeof document === "undefined") return;
        const observer = new MutationObserver(()=>setTheme(read()));
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: [
                "data-pactor-theme"
            ]
        });
        return ()=>observer.disconnect();
    }, []);
    return theme;
}
var defaultToolbarContents = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
    children: [
        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$components$2f$UndoRedo$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UndoRedo"], {}),
        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$primitives$2f$toolbar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Separator"], {}),
        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$components$2f$BoldItalicUnderlineToggles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoldItalicUnderlineToggles"], {}),
        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$components$2f$CodeToggle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CodeToggle"], {}),
        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$primitives$2f$toolbar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Separator"], {}),
        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$components$2f$ListsToggle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ListsToggle"], {}),
        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$primitives$2f$toolbar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Separator"], {}),
        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$components$2f$BlockTypeSelect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BlockTypeSelect"], {}),
        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$primitives$2f$toolbar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Separator"], {}),
        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$components$2f$CreateLink$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CreateLink"], {}),
        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$components$2f$InsertTable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InsertTable"], {}),
        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$components$2f$InsertThematicBreak$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InsertThematicBreak"], {}),
        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$components$2f$InsertCodeBlock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InsertCodeBlock"], {})
    ]
});
var MarkdownEditor = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(function MarkdownEditor2({ value = "", onChange, onBlur, placeholder, readOnly = false, autoFocus, className, style, theme, toolbar = true, renderToolbar, plugins, editorProps }, ref) {
    const showToolbar = toolbar && !readOnly;
    const containerClass = className ? `pactor-markdown-editor ${className}` : "pactor-markdown-editor";
    const pactorTheme = usePactorTheme();
    const resolvedTheme = theme ?? pactorTheme;
    const instanceId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])().replace(/[^a-zA-Z0-9_-]/g, "");
    const instanceClass = `pactor-markdown-editor-instance-${instanceId}`;
    const mdxEditorClassName = [
        "pactor-markdown-editor-root",
        instanceClass,
        editorProps?.className
    ].filter(Boolean).join(" ");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (typeof document === "undefined") return;
        const selector = `.${instanceClass}`;
        const applyTheme = ()=>{
            document.querySelectorAll(selector).forEach((element)=>{
                element.classList.toggle("dark", resolvedTheme === "dark");
                element.classList.toggle("light", resolvedTheme === "light");
            });
        };
        applyTheme();
        const observer = new MutationObserver((records)=>{
            for (const record of records){
                for (const node of record.addedNodes){
                    if (node instanceof Element && (node.matches(selector) || node.querySelector(selector))) {
                        applyTheme();
                        return;
                    }
                }
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        return ()=>observer.disconnect();
    }, [
        instanceClass,
        resolvedTheme
    ]);
    const innerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useImperativeHandle"])(ref, ()=>innerRef.current, []);
    const lastEmittedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(value);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (value !== lastEmittedRef.current) {
            lastEmittedRef.current = value;
            innerRef.current?.setMarkdown(value);
        }
    }, [
        value
    ]);
    const handleChange = (next)=>{
        lastEmittedRef.current = next;
        onChange?.(next);
    };
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
        className: containerClass,
        style,
        "data-theme": resolvedTheme,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$MDXEditor$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MDXEditor"], {
            ref: innerRef,
            markdown: value,
            onChange: handleChange,
            onBlur,
            readOnly,
            autoFocus,
            placeholder,
            contentEditableClassName: "pactor-markdown-editor-content",
            plugins: [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$headings$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["headingsPlugin"])(),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$lists$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["listsPlugin"])(),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$quote$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["quotePlugin"])(),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$thematic$2d$break$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["thematicBreakPlugin"])(),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$link$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["linkPlugin"])(),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$link$2d$dialog$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["linkDialogPlugin"])(),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$table$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["tablePlugin"])(),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$codeblock$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["codeBlockPlugin"])({
                    defaultCodeBlockLanguage: ""
                }),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$codemirror$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["codeMirrorPlugin"])({
                    codeBlockLanguages: {
                        "": "Plain text",
                        js: "JavaScript",
                        ts: "TypeScript",
                        tsx: "TSX",
                        css: "CSS",
                        html: "HTML",
                        json: "JSON",
                        yaml: "YAML",
                        bash: "Bash",
                        python: "Python",
                        go: "Go",
                        rust: "Rust",
                        sql: "SQL"
                    }
                }),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$markdown$2d$shortcut$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["markdownShortcutPlugin"])(),
                ...showToolbar ? [
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$mdxeditor$2b$editor$40$4$2e$3$2e$4_$40$codemirror$2b$language$40$6$2e$13$2e$1_$40$lezer$2b$highlight$40$1$2e$2$2e$5_$40$types$2b$react_2c5e7d739d7bd20c0a7f796fcc387530$2f$node_modules$2f40$mdxeditor$2f$editor$2f$dist$2f$plugins$2f$toolbar$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toolbarPlugin"])({
                        toolbarClassName: "pactor-markdown-editor-toolbar",
                        toolbarContents: ()=>renderToolbar ? renderToolbar(defaultToolbarContents) : defaultToolbarContents
                    })
                ] : [],
                ...plugins ?? []
            ],
            ...editorProps,
            className: mdxEditorClassName
        })
    });
});
;
function MarkdownEditorDslComponent({ value, placeholder, readOnly, toolbar, autoFocus, onChange, className, style, theme }) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(MarkdownEditor, {
        value,
        placeholder,
        readOnly,
        toolbar,
        autoFocus,
        onChange,
        className,
        style,
        theme
    });
}
// src/register.ts
var MARKDOWN_DSL_TYPE = "Markdown";
var MARKDOWN_EDITOR_DSL_TYPE = "MarkdownEditor";
function registerMarkdownComponents(registry) {
    registry.register(MARKDOWN_DSL_TYPE, MarkdownDslComponent);
    registry.register(MARKDOWN_EDITOR_DSL_TYPE, MarkdownEditorDslComponent);
}
;
}),
"[project]/packages/markdown/dist/index.js [app-ssr] (ecmascript) <export MarkdownDslComponent as Markdown>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Markdown",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$markdown$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MarkdownDslComponent"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$markdown$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/markdown/dist/index.js [app-ssr] (ecmascript)");
}),
"[project]/packages/pactor/dist/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// src/index.ts
__turbopack_context__.s([
    "SitemapApp",
    ()=>SitemapApp,
    "createPactorComponentRegistry",
    ()=>createPactorComponentRegistry
]);
// src/sitemap-app.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$app$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/app/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$chat$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/chat/dist/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$blocks$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/blocks/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$chart$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/chart/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
function createPactorComponentRegistry() {
    const registry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$chat$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createChatComponentRegistry"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$blocks$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerBlockComponents"])(registry);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$chart$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerChartComponents"])(registry);
    return registry;
}
function SitemapApp(props) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$app$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SitemapApp"], {
        componentRegistry: createPactorComponentRegistry,
        ...props
    });
}
;
;
;
;
}),
"[project]/packages/permission/dist/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PermissionStore",
    ()=>PermissionStore,
    "checkPagePermission",
    ()=>checkPagePermission,
    "createPermissionAdapter",
    ()=>createPermissionAdapter,
    "createPermissionFunction",
    ()=>createPermissionFunction,
    "filterMenusByPermission",
    ()=>filterMenusByPermission,
    "resolvePermissionCheck",
    ()=>resolvePermissionCheck,
    "resolvePermissionCodes",
    ()=>resolvePermissionCodes
]);
// src/store.ts
var PermissionStore = class {
    constructor(){
        this.codes = /* @__PURE__ */ new Set();
        this.listeners = /* @__PURE__ */ new Set();
    }
    /** 整体替换权限码集合并通知订阅者 */ setPermissions(codes) {
        this.codes = new Set(codes);
        this.notify();
    }
    /** 清空权限码并通知订阅者 */ clear() {
        this.codes.clear();
        this.notify();
    }
    /** 是否持有某权限码；未设置（含空集合）一律返回 false */ has(code) {
        return this.codes.has(code);
    }
    /** 任一命中即返回 true（组件 / 动作配置数组的语义） */ hasAny(codes) {
        return codes.some((code)=>this.codes.has(code));
    }
    /** 全部命中才返回 true */ hasAll(codes) {
        return codes.every((code)=>this.codes.has(code));
    }
    /** 订阅权限变更，返回退订函数 */ subscribe(listener) {
        this.listeners.add(listener);
        return ()=>{
            this.listeners.delete(listener);
        };
    }
    notify() {
        for (const listener of [
            ...this.listeners
        ]){
            listener();
        }
    }
};
// src/resolve.ts
function resolvePermissionCodes(config) {
    if (typeof config === "string") {
        return [
            config
        ];
    }
    if (Array.isArray(config)) {
        return config;
    }
    return Array.isArray(config.code) ? config.code : [
        config.code
    ];
}
function resolvePermissionCheck(config, checker) {
    if (config === void 0) {
        return {
            allowed: true,
            denied: "hidden"
        };
    }
    const denied = typeof config === "object" && !Array.isArray(config) ? config.denied ?? "hidden" : "hidden";
    return {
        allowed: checker.hasAny(resolvePermissionCodes(config)),
        denied
    };
}
// src/adapter.ts
function createPermissionAdapter(store) {
    return {
        check (permission) {
            return resolvePermissionCheck(permission, store).allowed;
        }
    };
}
// src/guards.ts
function filterMenusByPermission(menus, checker) {
    const result = [];
    for (const menu of menus){
        if (!resolvePermissionCheck(menu.permission, checker).allowed) {
            continue;
        }
        if (menu.children === void 0) {
            result.push(menu);
            continue;
        }
        const children = filterMenusByPermission(menu.children, checker);
        if (menu.children.length > 0 && children.length === 0) {
            continue;
        }
        result.push({
            ...menu,
            children
        });
    }
    return result;
}
function checkPagePermission(page, checker) {
    return resolvePermissionCheck(page.permission, checker).allowed;
}
// src/expression.ts
function createPermissionFunction(store) {
    return (code)=>store.has(code);
}
;
}),
"[project]/packages/resource/dist/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HttpDslResourceLoader",
    ()=>HttpDslResourceLoader,
    "MemoryResourceCache",
    ()=>MemoryResourceCache,
    "ResourceError",
    ()=>ResourceError,
    "StaticDslLoader",
    ()=>StaticDslLoader,
    "createFetchAdapter",
    ()=>createFetchAdapter,
    "parseBootstrapResource",
    ()=>parseBootstrapResource,
    "parseEnvelope",
    ()=>parseEnvelope,
    "withLocaleParam",
    ()=>withLocaleParam
]);
// src/errors.ts
var ResourceError = class extends Error {
    constructor(message, options){
        super(message);
        this.name = "ResourceError";
        this.status = options?.status;
        this.cause = options?.cause;
    }
};
// src/types.ts
function isRecord(value) {
    return typeof value === "object" && value !== null;
}
function parseEnvelope(raw, options) {
    const data = isRecord(raw) ? raw : {};
    const schema = "schema" in data ? data.schema : raw;
    const dslVersion = typeof data.dslVersion === "string" ? data.dslVersion : isRecord(schema) && typeof schema.dsl === "string" ? schema.dsl : "1.0";
    const representation = data.representation === "source" || data.representation === "localized" ? data.representation : void 0;
    const localization = isRecord(data.localization) ? data.localization : void 0;
    if (representation === "localized" && typeof localization?.locale !== "string") {
        throw new ResourceError(`localized \u8D44\u6E90\u7F3A\u5C11 localization.locale: ${typeof data.id === "string" ? data.id : options.id}`);
    }
    return {
        id: typeof data.id === "string" ? data.id : options.id,
        resourceType: typeof data.resourceType === "string" ? data.resourceType : options.resourceType,
        version: typeof data.version === "number" ? data.version : 1,
        dslVersion,
        representation,
        localization,
        etag: typeof data.etag === "string" ? data.etag : void 0,
        requires: data.requires,
        schema,
        updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : void 0
    };
}
function parseBootstrapResource(raw) {
    const data = isRecord(raw) ? raw : {};
    return {
        ...data,
        id: typeof data.id === "string" ? data.id : "bootstrap",
        resourceType: typeof data.resourceType === "string" ? data.resourceType : "bootstrap",
        version: typeof data.version === "number" ? data.version : 1,
        dslVersion: typeof data.dslVersion === "string" ? data.dslVersion : "1.0",
        etag: typeof data.etag === "string" ? data.etag : void 0,
        updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : void 0,
        pageVersions: isRecord(data.pageVersions) ? data.pageVersions : void 0
    };
}
// src/http-adapter.ts
function createFetchAdapter(fetchImpl) {
    const doFetch = fetchImpl ?? globalThis.fetch;
    if (!doFetch) {
        throw new ResourceError("\u5F53\u524D\u73AF\u5883\u65E0\u5168\u5C40 fetch\uFF0C\u8BF7\u663E\u5F0F\u4F20\u5165 fetch \u5B9E\u73B0\u6216\u81EA\u5B9A\u4E49 HttpAdapter");
    }
    return async (request)=>{
        let response;
        try {
            response = await doFetch(request.url, {
                method: request.method ?? "GET",
                headers: request.headers
            });
        } catch (error) {
            throw new ResourceError(`\u8BF7\u6C42\u5931\u8D25: ${request.method ?? "GET"} ${request.url}`, {
                cause: error
            });
        }
        const { status } = response;
        if (!(status >= 200 && status < 300 || status === 304)) {
            throw new ResourceError(`\u8BF7\u6C42\u8FD4\u56DE ${status}: ${request.method ?? "GET"} ${request.url}`, {
                status
            });
        }
        const etag = response.headers.get("etag") ?? void 0;
        let data;
        if (status !== 304) {
            data = await response.json().catch(()=>void 0);
        }
        return {
            status,
            data,
            etag
        };
    };
}
// src/cache/memory-cache.ts
var MemoryResourceCache = class {
    constructor(){
        this.entries = /* @__PURE__ */ new Map();
    }
    get(key) {
        return this.entries.get(key);
    }
    set(key, entry) {
        this.entries.set(key, entry);
    }
    delete(key) {
        return this.entries.delete(key);
    }
    clear() {
        this.entries.clear();
    }
    /** 当前全部缓存键（版本失效 / invalidate 时使用） */ keys() {
        return [
            ...this.entries.keys()
        ];
    }
};
// src/loaders/http-loader.ts
function withLocaleParam(url, locale) {
    const hashIndex = url.indexOf("#");
    const hash = hashIndex >= 0 ? url.slice(hashIndex) : "";
    const withoutHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
    const queryIndex = withoutHash.indexOf("?");
    const path = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
    const query = queryIndex >= 0 ? withoutHash.slice(queryIndex + 1) : "";
    const kept = query.split("&").filter((pair)=>pair !== "" && pair.split("=")[0] !== "locale");
    kept.push(`locale=${encodeURIComponent(locale)}`);
    return `${path}?${kept.join("&")}${hash}`;
}
var HttpDslResourceLoader = class {
    constructor(options = {}){
        this.versions = {};
        this.inflight = /* @__PURE__ */ new Map();
        this.baseUrl = (options.baseUrl ?? "/api/runtime").replace(/\/+$/, "");
        this.adapter = options.adapter ?? createFetchAdapter();
        this.cache = options.cache ?? new MemoryResourceCache();
        this.locale = options.locale;
        this.release = options.release;
    }
    loadPage(pageId) {
        return this.load("page", pageId);
    }
    loadFragment(fragmentId) {
        return this.load("fragment", fragmentId);
    }
    async loadBootstrap() {
        const response = await this.request(this.urlFor(`${this.baseUrl}/bootstrap`));
        const bootstrap = parseBootstrapResource(response.data);
        if (bootstrap.pageVersions) {
            this.updateVersions(bootstrap.pageVersions);
        }
        return bootstrap;
    }
    /** 手动更新页面版本表（pageId → version）；版本变化后同 id 资源以新键重新加载 */ updateVersions(versions) {
        this.versions = {
            ...this.versions,
            ...versions
        };
    }
    /** 删除该 id 全部版本的缓存条目 */ invalidate(id) {
        for (const key of this.keysOf(id)){
            this.cache.delete(key);
        }
    }
    /** 清空缓存与版本表 */ clear() {
        this.cache.clear();
        this.versions = {};
    }
    load(kind, id) {
        const inflightKey = `${kind}:${id}`;
        const pending = this.inflight.get(inflightKey);
        if (pending) {
            return pending;
        }
        const promise = this.doLoad(kind, id).finally(()=>{
            this.inflight.delete(inflightKey);
        });
        this.inflight.set(inflightKey, promise);
        return promise;
    }
    async doLoad(kind, id) {
        const resourceType = kind;
        const url = this.urlFor(`${this.baseUrl}/${kind === "page" ? "pages" : "fragments"}/${encodeURIComponent(id)}`);
        const version = this.versions[id];
        if (version !== void 0) {
            const key = this.cacheKey(id, version);
            const hit = this.cache.get(key);
            if (hit) {
                return hit.value;
            }
            const response2 = await this.request(url);
            const resource2 = parseEnvelope(response2.data, {
                id,
                resourceType
            });
            this.cache.set(key, {
                value: resource2,
                etag: response2.etag ?? resource2.etag
            });
            return resource2;
        }
        const cached = this.findCached(id);
        if (cached && !cached.etag) {
            return cached.value;
        }
        const response = await this.request(url, cached?.etag ? {
            "If-None-Match": cached.etag
        } : void 0, cached?.etag ? [
            304
        ] : []);
        if (response.status === 304 && cached) {
            return cached.value;
        }
        const resource = parseEnvelope(response.data, {
            id,
            resourceType
        });
        for (const key of this.keysOf(id)){
            if (this.matchesContext(key, id)) {
                this.cache.delete(key);
            }
        }
        this.cache.set(this.cacheKey(id, resource.version), {
            value: resource,
            etag: response.etag ?? resource.etag
        });
        return resource;
    }
    /** 为请求 URL 追加当前 locale 上下文（未配置时原样返回） */ urlFor(url) {
        return this.locale ? withLocaleParam(url, this.locale) : url;
    }
    /**
   * 缓存键：无 locale 时保持旧键形 `id@version`；
   * 配置 locale 后扩展为 `id@version@locale`，release 可得时再追加 `@release`。
   */ cacheKey(id, version) {
        return `${id}@${version}${this.contextSuffix()}`;
    }
    contextSuffix() {
        let suffix = "";
        if (this.locale) {
            suffix += `@${this.locale}`;
        }
        if (this.release) {
            suffix += `@${this.release}`;
        }
        return suffix;
    }
    /** 判断缓存键是否属于当前 locale/release 上下文 */ matchesContext(key, id) {
        const rest = key.slice(`${id}@`.length);
        const suffix = this.contextSuffix();
        if (!rest.endsWith(suffix)) {
            return false;
        }
        const versionPart = rest.slice(0, rest.length - suffix.length);
        return /^\d+$/.test(versionPart);
    }
    async request(url, headers, extraOkStatuses = []) {
        const response = await this.adapter({
            url,
            method: "GET",
            headers
        });
        const ok = response.status >= 200 && response.status < 300 || extraOkStatuses.includes(response.status);
        if (!ok) {
            throw new ResourceError(`\u8BF7\u6C42\u8FD4\u56DE ${response.status}: GET ${url}`, {
                status: response.status
            });
        }
        return response;
    }
    /** 查找该 id 在当前 locale/release 上下文下的缓存条目（无版本表时用于 ETag / 普通缓存） */ findCached(id) {
        for (const key of this.keysOf(id)){
            if (!this.matchesContext(key, id)) {
                continue;
            }
            const entry = this.cache.get(key);
            if (entry) {
                return entry;
            }
        }
        return void 0;
    }
    keysOf(id) {
        const prefix = `${id}@`;
        return this.cache.keys().filter((key)=>key.startsWith(prefix));
    }
};
// src/loaders/static-loader.ts
var StaticDslLoader = class {
    constructor(data = {}){
        this.pages = data.pages ?? {};
        this.fragments = data.fragments ?? {};
        this.bootstrap = data.bootstrap;
    }
    loadPage(pageId) {
        const raw = this.pages[pageId];
        if (raw === void 0) {
            return Promise.reject(new ResourceError(`\u9875\u9762\u8D44\u6E90\u4E0D\u5B58\u5728: ${pageId}`));
        }
        return Promise.resolve(parseEnvelope(raw, {
            id: pageId,
            resourceType: "page"
        }));
    }
    loadFragment(fragmentId) {
        const raw = this.fragments[fragmentId];
        if (raw === void 0) {
            return Promise.reject(new ResourceError(`Fragment \u8D44\u6E90\u4E0D\u5B58\u5728: ${fragmentId}`));
        }
        return Promise.resolve(parseEnvelope(raw, {
            id: fragmentId,
            resourceType: "fragment"
        }));
    }
    loadBootstrap() {
        if (this.bootstrap === void 0) {
            return Promise.reject(new ResourceError("StaticDslLoader \u4E0D\u63D0\u4F9B bootstrap \u8D44\u6E90"));
        }
        return Promise.resolve(parseBootstrapResource(this.bootstrap));
    }
};
;
}),
"[project]/packages/router/dist/chunk-JY7Z55CR.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "match",
    ()=>match,
    "parseQuery",
    ()=>parseQuery,
    "resolveRoute",
    ()=>resolveRoute
]);
// src/path-matcher.ts
function toSegments(path) {
    return path.split("/").filter((segment)=>segment.length > 0);
}
function match(pattern, pathname) {
    const patternSegments = toSegments(pattern);
    const pathSegments = toSegments(pathname);
    if (patternSegments.length !== pathSegments.length) {
        return null;
    }
    const params = {};
    for(let i = 0; i < patternSegments.length; i += 1){
        const patternSegment = patternSegments[i];
        const pathSegment = pathSegments[i];
        if (patternSegment.startsWith(":")) {
            params[patternSegment.slice(1)] = pathSegment;
        } else if (patternSegment !== pathSegment) {
            return null;
        }
    }
    return {
        params
    };
}
function parseQuery(search) {
    const query = {};
    if (search === "" || search === "?") {
        return query;
    }
    for (const [key, value] of new URLSearchParams(search)){
        query[key] = value;
    }
    return query;
}
function resolveRoute(registry, location) {
    const hit = registry.findByPath(location.pathname);
    if (hit === null) {
        return null;
    }
    const { menu, params } = hit;
    return {
        path: location.pathname,
        params,
        query: parseQuery(location.search ?? ""),
        pageId: menu.pageId,
        menuId: menu.id,
        activeMenu: menu.activeMenu ?? menu.id
    };
}
;
}),
"[project]/packages/router/dist/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MemoryNavigation",
    ()=>MemoryNavigation,
    "MenuRegistry",
    ()=>MenuRegistry,
    "createRouterAdapter",
    ()=>createRouterAdapter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$chunk$2d$JY7Z55CR$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/router/dist/chunk-JY7Z55CR.js [app-ssr] (ecmascript)");
;
// src/menu.ts
function filterHidden(items) {
    const result = [];
    for (const item of items){
        if (item.hidden) {
            continue;
        }
        if (item.children !== void 0) {
            result.push({
                ...item,
                children: filterHidden(item.children)
            });
        } else {
            result.push(item);
        }
    }
    return result;
}
function sortByOrder(items) {
    return [
        ...items
    ].sort((a, b)=>(a.order ?? Number.POSITIVE_INFINITY) - (b.order ?? Number.POSITIVE_INFINITY));
}
var MenuRegistry = class {
    constructor(menus){
        this.byId = /* @__PURE__ */ new Map();
        this.visibleTree = filterHidden(menus);
        const flat = [];
        const walk = (items)=>{
            for (const item of items){
                this.byId.set(item.id, item);
                if (item.type !== "group" && item.path !== void 0) {
                    flat.push(item);
                }
                if (item.children !== void 0) {
                    walk(item.children);
                }
            }
        };
        walk(menus);
        this.entries = sortByOrder(flat);
    }
    /** 可见菜单树（过滤 hidden，供 layout 渲染） */ tree() {
        return this.visibleTree;
    }
    /** 扁平可路由条目列表，按 order 排序（未指定者保持声明顺序在后） */ list() {
        return this.entries;
    }
    /** 按 id 查找（含 group 与隐藏项），未找到返回 undefined */ findById(id) {
        return this.byId.get(id);
    }
    /** 按 list() 顺序逐个模式匹配；隐藏页参与匹配；未命中返回 null */ findByPath(pathname) {
        for (const menu of this.entries){
            const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$chunk$2d$JY7Z55CR$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["match"])(menu.path, pathname);
            if (result !== null) {
                return {
                    menu,
                    params: result.params
                };
            }
        }
        return null;
    }
};
// src/navigation.ts
function splitTo(to) {
    const queryIndex = to.indexOf("?");
    if (queryIndex === -1) {
        return {
            pathname: to,
            search: ""
        };
    }
    return {
        pathname: to.slice(0, queryIndex),
        search: to.slice(queryIndex)
    };
}
var MemoryNavigation = class {
    constructor(initial = "/"){
        this.index = 0;
        this.listeners = /* @__PURE__ */ new Set();
        this.history = [
            splitTo(initial)
        ];
    }
    getLocation() {
        return this.history[this.index];
    }
    push(to) {
        this.history = this.history.slice(0, this.index + 1);
        this.history.push(splitTo(to));
        this.index += 1;
        this.notify();
    }
    replace(to) {
        this.history[this.index] = splitTo(to);
        this.notify();
    }
    /** 回退一步；已在栈底时不动作并返回 false */ back() {
        if (this.index === 0) {
            return false;
        }
        this.index -= 1;
        this.notify();
        return true;
    }
    /** 当前历史栈长度（调试与测试观察用） */ get size() {
        return this.history.length;
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return ()=>{
            this.listeners.delete(listener);
        };
    }
    notify() {
        const location = this.getLocation();
        for (const listener of [
            ...this.listeners
        ]){
            listener(location);
        }
    }
};
function createRouterAdapter(bridge) {
    return {
        navigate (to) {
            bridge.push(to);
        }
    };
}
;
}),
"[project]/packages/router/dist/react.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DynamicDslRoute",
    ()=>DynamicDslRoute,
    "useReactRouterBridge",
    ()=>useReactRouterBridge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$chunk$2d$JY7Z55CR$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/router/dist/chunk-JY7Z55CR.js [app-ssr] (ecmascript)");
// src/react.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$permission$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/permission/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$router$2d$dom$40$7$2e$18$2e$2_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$router$2d$dom$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-router-dom@7.18.2_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/react-router-dom/dist/index.js [app-ssr] (ecmascript)");
;
;
;
;
function DynamicDslRoute(props) {
    const { registry, render, fallback = null, forbidden = null, permissionChecker } = props;
    const location = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$router$2d$dom$40$7$2e$18$2e$2_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$router$2d$dom$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLocation"])();
    const hit = registry.findByPath(location.pathname);
    const route = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$chunk$2d$JY7Z55CR$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveRoute"])(registry, {
        pathname: location.pathname,
        search: location.search
    });
    if (hit === null || route === null || hit.menu.pageId === void 0) {
        return fallback;
    }
    if (permissionChecker !== void 0 && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$permission$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkPagePermission"])(hit.menu, permissionChecker)) {
        return forbidden;
    }
    return render({
        pageId: hit.menu.pageId,
        route
    });
}
function useReactRouterBridge() {
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$router$2d$dom$40$7$2e$18$2e$2_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$router$2d$dom$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useNavigate"])();
    const location = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$router$2d$dom$40$7$2e$18$2e$2_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$router$2d$dom$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLocation"])();
    const locationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(location);
    locationRef.current = location;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            getLocation: ()=>({
                    pathname: locationRef.current.pathname,
                    search: locationRef.current.search
                }),
            push: (to)=>navigate(to),
            replace: (to)=>navigate(to, {
                    replace: true
                }),
            subscribe: ()=>()=>{}
        }), [
        navigate
    ]);
}
;
}),
"[project]/packages/runtime/dist/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionEngine",
    ()=>ActionEngine,
    "DataStore",
    ()=>DataStore,
    "DslRenderer",
    ()=>DslRenderer,
    "DslSourceBoundary",
    ()=>DslSourceBoundary,
    "DslSourceResolver",
    ()=>DslSourceResolver,
    "I18nContextProvider",
    ()=>I18nContextProvider,
    "LocalizationProtocolError",
    ()=>LocalizationProtocolError,
    "PageRuntimeError",
    ()=>PageRuntimeError,
    "PageRuntimeVersionError",
    ()=>PageRuntimeVersionError,
    "PageRuntimeView",
    ()=>PageRuntimeView,
    "RUNTIME_VERSION",
    ()=>RUNTIME_VERSION,
    "StateStore",
    ()=>StateStore,
    "UnsupportedComponent",
    ()=>UnsupportedComponent,
    "buildScope",
    ()=>buildScope,
    "createDefaultPermissionAdapter",
    ()=>createDefaultPermissionAdapter,
    "createDefaultRouterAdapter",
    ()=>createDefaultRouterAdapter,
    "createFetchHttpAdapter",
    ()=>createFetchHttpAdapter,
    "createPageRuntime",
    ()=>createPageRuntime,
    "createRuntimeContext",
    ()=>createRuntimeContext,
    "dslSourceKey",
    ()=>dslSourceKey,
    "registerBuiltinActions",
    ()=>registerBuiltinActions,
    "resolveDeep",
    ()=>resolveDeep,
    "useDataSource",
    ()=>useDataSource,
    "useI18n",
    ()=>useI18n,
    "useRenderer",
    ()=>useRenderer,
    "useRuntimeState",
    ()=>useRuntimeState
]);
// src/context/context.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$expression$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/expression/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/schema/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$semver$40$7$2e$8$2e$5$2f$node_modules$2f$semver$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/semver@7.8.5/node_modules/semver/index.js [app-ssr] (ecmascript)");
// src/context/adapters.ts
function createDefaultPermissionAdapter() {
    return {
        check: ()=>true
    };
}
function createDefaultRouterAdapter() {
    return {
        navigate (to) {
            console.warn(`[@pactor-app/runtime] RouterAdapter \u672A\u6CE8\u5165\uFF0Cnavigate("${to}") \u5DF2\u5FFD\u7565`);
        }
    };
}
function createFetchHttpAdapter() {
    return {
        async request (config) {
            const method = (config.method ?? "GET").toUpperCase();
            let url = config.url;
            if (config.params) {
                const search = new URLSearchParams();
                for (const [key, value] of Object.entries(config.params)){
                    if (value !== void 0 && value !== null) {
                        search.set(key, String(value));
                    }
                }
                const query = search.toString();
                if (query) {
                    url += (url.includes("?") ? "&" : "?") + query;
                }
            }
            const headers = {
                ...config.headers
            };
            let body;
            if (config.body !== void 0) {
                headers["content-type"] ?? (headers["content-type"] = "application/json");
                body = JSON.stringify(config.body);
            }
            const response = await fetch(url, {
                method,
                headers,
                body,
                // 跨源 cookie 会话（服务端开通 CORS + Allow-Credentials 时生效；
                // 同源行为不变）
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error(`[@pactor-app/runtime] http request failed: ${response.status} ${response.statusText} (${config.url})`);
            }
            const text = await response.text();
            if (!text) {
                return void 0;
            }
            try {
                return JSON.parse(text);
            } catch  {
                return text;
            }
        }
    };
}
;
;
;
function isPlainRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
var LocalizationProtocolError = class extends Error {
    constructor(message){
        super(`[@pactor-app/runtime] ${message}`);
        this.name = "LocalizationProtocolError";
    }
};
function interpolateLocalizedText(template, params) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, name)=>{
        const value = params[name];
        if (value === void 0 || value === null) {
            console.warn(`[@pactor-app/runtime] $localizedText \u672A\u77E5\u53C2\u6570 "${name}"\uFF0C\u4FDD\u7559\u5360\u4F4D\u7B26 ${match}`);
            return match;
        }
        return String(value);
    });
}
function resolveLocalizedText(value, scope, options) {
    const { template, params } = value.$localizedText;
    const resolvedParams = {};
    if (isPlainRecord(params)) {
        for (const [key, item] of Object.entries(params)){
            resolvedParams[key] = resolveDeep(item, scope, options);
        }
    }
    return interpolateLocalizedText(template, resolvedParams);
}
function resolveDeep(value, scope, options = {}) {
    if (typeof value === "string") {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$expression$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasExpression"])(value) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$expression$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveTemplate"])(value, scope) : value;
    }
    if (Array.isArray(value)) {
        return value.map((item)=>resolveDeep(item, scope, options));
    }
    if (isPlainRecord(value)) {
        if (options.localizationMode === "server" && (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isI18nDescriptor"])(value)) {
            throw new LocalizationProtocolError("server \u672C\u5730\u5316\u6A21\u5F0F\u4E0B\u4F5C\u8005\u6001 `$i18n` \u4E0D\u5141\u8BB8\u51FA\u73B0\u5728\u5BA2\u6237\u7AEF\u89E3\u6790\u8DEF\u5F84");
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isLocalizedText"])(value)) {
            return resolveLocalizedText(value, scope, options);
        }
        if (options.isOpaque?.(value)) {
            return value;
        }
        const out = {};
        for (const [key, item] of Object.entries(value)){
            out[key] = resolveDeep(item, scope, options);
        }
        return out;
    }
    return value;
}
function toError(cause) {
    return cause instanceof Error ? cause : new Error(String(cause));
}
// src/datasource/data-store.ts
var DataStore = class {
    constructor(deps){
        this.statuses = /* @__PURE__ */ new Map();
        this.listeners = /* @__PURE__ */ new Set();
        this.version = 0;
        this.configs = deps.dataSources;
        this.services = deps.services;
        this.http = deps.http;
        this.getScope = deps.getScope;
        this.localizationMode = deps.localizationMode;
        for (const name of Object.keys(deps.dataSources)){
            this.statuses.set(name, {
                loading: false
            });
        }
    }
    /** 状态快照（未知名返回空状态，不抛错） */ get(name) {
        return this.statuses.get(name) ?? {
            loading: false
        };
    }
    /** 同 `get(name)`，语义化别名 */ getStatus(name) {
        return this.get(name);
    }
    getData(name) {
        return this.get(name).data;
    }
    /** 各数据源当前数据，供表达式作用域的 `data` 键使用 */ getAllData() {
        const out = {};
        for (const [name, status] of this.statuses){
            out[name] = status.data;
        }
        return out;
    }
    /** 各数据源的加载状态（loading / error），供表达式作用域的 `dataStatus` 键使用 */ getAllStatus() {
        const out = {};
        for (const [name, status] of this.statuses){
            out[name] = {
                loading: status.loading,
                error: status.error
            };
        }
        return out;
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return ()=>{
            this.listeners.delete(listener);
        };
    }
    /** 版本号，供 `useSyncExternalStore` 的 getSnapshot 使用 */ getVersion() {
        return this.version;
    }
    /** 触发所有 `autoLoad: true` 的数据源（PageRuntime 初始化阶段调用） */ init() {
        return Promise.all(this.autoLoadNames().map((name)=>this.load(name)));
    }
    /**
   * 运行时注册数据源（如 DslSourceRef 片段载荷携带的 dataSources）：
   * 名称冲突时告警并跳过（同一引用重复注册幂等），成功时播种空状态、
   * 递增版本并通知订阅者。返回是否注册成功。
   */ register(name, config) {
        if (this.configs[name] !== void 0) {
            console.warn(`[@pactor-app/runtime] dataSource \u540D\u79F0\u51B2\u7A81\uFF1A"${name}" \u5DF2\u6CE8\u518C\uFF0C\u8DF3\u8FC7\u91CD\u590D\u6CE8\u518C`);
            return false;
        }
        this.configs[name] = config;
        this.statuses.set(name, {
            loading: false
        });
        this.notify();
        return true;
    }
    /** 批量运行时注册，返回实际注册成功的名称列表（冲突名跳过） */ registerAll(configs) {
        const registered = [];
        for (const [name, config] of Object.entries(configs)){
            if (this.register(name, config)) {
                registered.push(name);
            }
        }
        return registered;
    }
    /** 注销运行时注册的数据源（如片段边界卸载时回收）；未知名为 no-op */ unregister(name) {
        if (this.configs[name] === void 0) {
            return;
        }
        delete this.configs[name];
        this.statuses.delete(name);
        this.notify();
    }
    /**
   * 加载指定数据源。状态流转：开始置 loading 并清空 error；
   * 成功写入 data；失败写入 error（保留旧 data）。MUST NOT 抛出。
   */ async load(name) {
        const config = this.configs[name];
        if (!config) {
            throw new Error(`[@pactor-app/runtime] unknown dataSource: "${name}"`);
        }
        const previous = this.get(name);
        this.update(name, {
            loading: true,
            error: void 0,
            data: previous.data
        });
        try {
            const raw = await this.loadByType(config);
            const data = applyOptionMapping(raw, config);
            this.update(name, {
                loading: false,
                data,
                error: void 0
            });
        } catch (cause) {
            this.update(name, {
                loading: false,
                error: toError(cause),
                data: previous.data
            });
        }
    }
    /** 重新加载指定数据源（语义同 `load`，供模板与 Action 调用） */ refresh(name) {
        return this.load(name);
    }
    /**
   * reload 语义：指定名称时刷新该数据源；
   * 缺省时刷新全部 autoLoad 数据源（供 Action 引擎 `reload` 动作调用）。
   */ reload(name) {
        if (name !== void 0) {
            return this.load(name);
        }
        return Promise.all(this.autoLoadNames().map((n)=>this.load(n)));
    }
    autoLoadNames() {
        return Object.entries(this.configs).filter(([, config])=>config.autoLoad === true).map(([name])=>name);
    }
    async loadByType(config) {
        switch(config.type){
            case "static":
                return config.value;
            case "service":
                {
                    const serviceName = config.service ?? "";
                    const handler = this.services.get(serviceName);
                    if (!handler) {
                        throw new Error(`[@pactor-app/runtime] service not registered: "${serviceName}"`);
                    }
                    const params = resolveDeep(config.params ?? {}, this.getScope(), {
                        localizationMode: this.localizationMode
                    });
                    return handler(params);
                }
            case "http":
                {
                    if (!config.request) {
                        throw new Error("[@pactor-app/runtime] http dataSource \u7F3A\u5C11 request \u914D\u7F6E");
                    }
                    const request = resolveDeep(config.request, this.getScope(), {
                        localizationMode: this.localizationMode
                    });
                    return this.http.request(request);
                }
            default:
                throw new Error(`[@pactor-app/runtime] unsupported dataSource type: "${config.type}"`);
        }
    }
    update(name, status) {
        this.statuses.set(name, status);
        this.notify();
    }
    notify() {
        this.version += 1;
        for (const listener of [
            ...this.listeners
        ]){
            listener();
        }
    }
};
function applyOptionMapping(data, config) {
    if (!config.valueField && !config.labelField && !config.disabledField) {
        return data;
    }
    if (!Array.isArray(data)) {
        return data;
    }
    const valueField = config.valueField ?? "value";
    const labelField = config.labelField ?? "label";
    return data.map((item)=>{
        if (item === null || typeof item !== "object") {
            return item;
        }
        const record = item;
        return {
            ...record,
            label: record[labelField],
            value: record[valueField],
            disabled: config.disabledField ? Boolean(record[config.disabledField]) : Boolean(record.disabled)
        };
    });
}
// src/datasource/dsl-source-resolver.ts
function dslSourceKey(ref, locale) {
    const source = ref.source;
    const base = source.type === "service" ? `service:${source.service}:${JSON.stringify(source.params ?? {})}` : `http:${(source.request.method ?? "GET").toUpperCase()}:${source.request.url}:${JSON.stringify(source.request.params ?? {})}:${JSON.stringify(source.request.headers ?? {})}`;
    return locale ? `${locale}|${base}` : base;
}
var DslSourceResolver = class {
    constructor(deps){
        this.deps = deps;
        this.cache = /* @__PURE__ */ new Map();
    }
    resolve(ref) {
        const key = dslSourceKey(ref, this.deps.locale);
        let cached = this.cache.get(key);
        if (cached === void 0) {
            cached = this.load(ref);
            this.cache.set(key, cached);
        }
        return cached;
    }
    async load(ref) {
        const scope = this.deps.getScope();
        const resolveOptions = {
            localizationMode: this.deps.localizationMode
        };
        const source = ref.source;
        if (source.type === "service") {
            const handler = this.deps.services.get(source.service);
            if (!handler) {
                throw new Error(`[@pactor-app/runtime] service not registered: "${source.service}"`);
            }
            const params = resolveDeep(source.params ?? {}, scope, resolveOptions);
            return handler(params);
        }
        const request = resolveDeep(source.request, scope, resolveOptions);
        return this.deps.http.request(request);
    }
};
// src/context/scope.ts
function buildScope(context, local) {
    return {
        app: context.app,
        page: context.page,
        state: context.state.getState(),
        form: context.state.get("form"),
        data: context.data.getAllData(),
        dataStatus: context.data.getAllStatus(),
        route: context.route,
        user: context.user,
        params: context.route.params,
        actions: context.actionResults,
        locale: context.locale,
        t: context.i18n.t,
        ...local
    };
}
// src/context/state-store.ts
var StateStore = class {
    constructor(initialState = {}){
        this.listeners = /* @__PURE__ */ new Set();
        this.version = 0;
        this.initialState = initialState;
        this.state = initialState;
    }
    /** 当前完整 state 对象 */ getState() {
        return this.state;
    }
    /** 按点路径读取，如 `get('user.name')`；路径不存在时返回 undefined */ get(path) {
        let current = this.state;
        for (const key of path.split(".")){
            if (typeof current !== "object" || current === null) {
                return void 0;
            }
            current = current[key];
        }
        return current;
    }
    set(patchOrPath, value) {
        if (typeof patchOrPath === "string") {
            this.state = setPath(this.state, patchOrPath.split("."), value);
        } else {
            this.state = {
                ...this.state,
                ...patchOrPath
            };
        }
        this.notify();
    }
    /** 恢复为创建时的初始值 */ reset() {
        this.state = this.initialState;
        this.notify();
    }
    /** 订阅变化，返回退订函数 */ subscribe(listener) {
        this.listeners.add(listener);
        return ()=>{
            this.listeners.delete(listener);
        };
    }
    /**
   * 单调递增的版本号，供 `useSyncExternalStore` 的 getSnapshot 使用
   * （V1 简化策略：任一变化重渲染整棵 DSL 树）。
   */ getVersion() {
        return this.version;
    }
    notify() {
        this.version += 1;
        for (const listener of [
            ...this.listeners
        ]){
            listener();
        }
    }
};
function setPath(source, path, value) {
    const [key, ...rest] = path;
    if (key === void 0) {
        return source;
    }
    const clone = {
        ...source
    };
    if (rest.length === 0) {
        clone[key] = value;
        return clone;
    }
    const child = clone[key];
    clone[key] = setPath(typeof child === "object" && child !== null && !Array.isArray(child) ? child : {}, rest, value);
    return clone;
}
// src/context/context.ts
function createRuntimeContext(options = {}) {
    const state = new StateStore(options.state);
    const services = options.services ?? new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Registry"]("ServiceRegistry");
    const components = options.components ?? new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Registry"]("ComponentRegistry");
    const actions = options.actions ?? new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Registry"]("ActionRegistry");
    const forms = options.forms ?? new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Registry"]("FormRegistry");
    const capabilities = options.capabilities ?? new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Registry"]("CapabilityRegistry");
    const permission = options.permission ?? createDefaultPermissionAdapter();
    const router = options.router ?? createDefaultRouterAdapter();
    const http = options.http ?? createFetchHttpAdapter();
    const route = {
        params: options.route?.params ?? {},
        query: options.route?.query ?? {},
        navigate: (to)=>router.navigate(to)
    };
    let context;
    const data = new DataStore({
        dataSources: options.dataSources ?? {},
        services,
        http,
        getScope: ()=>buildScope(context),
        localizationMode: options.localizationMode
    });
    const dslSources = new DslSourceResolver({
        services,
        http,
        getScope: ()=>buildScope(context),
        localizationMode: options.localizationMode,
        // 语言上下文注入（G25）：页面运行时按语言重建，缓存键随 locale 隔离
        locale: options.locale
    });
    context = {
        app: options.app ?? {},
        page: options.page ?? {},
        state,
        data,
        route,
        user: options.user ?? {},
        services,
        components,
        actions,
        forms,
        actionResults: {},
        namedActions: options.namedActions ?? {},
        pageComponents: options.pageComponents ?? {},
        permission,
        capabilities,
        http,
        dslSources,
        locale: options.locale ?? "zh-CN",
        i18n: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createI18nContext"])({
            locale: options.locale,
            defaultLocale: options.defaultLocale,
            messages: options.messages
        }),
        localizationMode: options.localizationMode ?? "client"
    };
    return context;
}
;
;
// src/context/locales/en-US.ts
var enUS = {
    "pactor.layout.expandSidebar": "Expand sidebar",
    "pactor.layout.collapseSidebar": "Collapse sidebar",
    "pactor.layout.openNavigation": "Open navigation",
    "pactor.layout.closeTab": "Close {{title}}",
    "pactor.layout.breadcrumb": "Breadcrumb",
    "pactor.table.loading": "Loading\u2026",
    "pactor.table.empty": "No data",
    "pactor.table.selectAll": "Select all",
    "pactor.table.selectRow": "Select row",
    "pactor.table.expandRow": "Expand row",
    "pactor.table.collapseRow": "Collapse row",
    "pactor.table.dragRow": "Drag to reorder",
    "pactor.form.required": "Required",
    "pactor.control.clear": "Clear",
    "pactor.select.clear": "Clear",
    "pactor.select.search": "Search options",
    "pactor.input.clear": "Clear",
    "pactor.input.showPassword": "Show password",
    "pactor.input.hidePassword": "Hide password",
    "pactor.input.placeholder": "Please enter",
    "pactor.numberInput.increase": "Increase",
    "pactor.numberInput.decrease": "Decrease",
    "pactor.alertDialog.confirm": "Confirm",
    "pactor.alertDialog.cancel": "Cancel",
    "pactor.command.empty": "No results found",
    "pactor.overlay.close": "Close",
    "pactor.overlay.cancel": "Cancel",
    "pactor.overlay.confirm": "Confirm",
    "pactor.datePicker.placeholder": "Select date",
    "pactor.datePicker.placeholderRange": "Select date range",
    "pactor.datePicker.today": "Today",
    "pactor.datePicker.thisWeek": "This Week",
    "pactor.datePicker.thisMonth": "This Month",
    "pactor.login.title": "Sign in",
    "pactor.login.username": "Username",
    "pactor.login.usernamePlaceholder": "Enter username",
    "pactor.login.usernameRequired": "Please enter username",
    "pactor.login.password": "Password",
    "pactor.login.passwordPlaceholder": "Enter password",
    "pactor.login.passwordRequired": "Please enter password",
    "pactor.login.submit": "Sign in",
    "pactor.cardList.total": "Total {{count}}",
    "pactor.formCardList.item": "Item {{index}}",
    "pactor.formCardList.add": "Add item",
    "pactor.formCardList.removeItem": "Remove item {{index}}",
    "pactor.formCardList.removeConfirm": "Remove this item? Filled content will be lost.",
    "pactor.formModal.submit": "Submit",
    "pactor.formModal.cancel": "Cancel",
    "pactor.fileManager.empty": "Select a file on the left to view its content",
    "pactor.fileManager.edit": "Edit",
    "pactor.fileManager.finish": "Done",
    "pactor.fileManager.copy": "Copy file content",
    "pactor.fileManager.copyFailed": "Copy failed",
    "pactor.fileManager.discardTitle": "Discard unsaved changes?",
    "pactor.fileManager.discardDesc": "Switching to another file will lose unsaved changes in the current file.",
    "pactor.fileManager.discardConfirm": "Discard changes",
    "pactor.fileManager.discardCancel": "Keep editing",
    "pactor.chart.empty": "No data",
    "pactor.select.placeholder": "Please select",
    "pactor.pagination.total": "Total {{count}}",
    "pactor.pagination.pageSize": "{{size}} per page",
    "pactor.pagination.itemsPerPage": "{{size}} / page",
    "pactor.pagination.prev": "Previous",
    "pactor.pagination.next": "Next",
    "pactor.upload.dragText": "Click or drag files here",
    "pactor.upload.selectFile": "Select file",
    "pactor.upload.rejected": "{{count}} invalid file(s) ignored",
    "pactor.upload.remove": "Remove {{name}}",
    "pactor.tree.newNode": "New node",
    "pactor.tree.nodeActions": "Node actions",
    "pactor.tree.dragToReorder": "Drag to reorder",
    "pactor.tree.expand": "Expand",
    "pactor.tree.collapse": "Collapse",
    "pactor.transfer.listOne": "List 1",
    "pactor.transfer.listTwo": "List 2",
    "pactor.transfer.selectAll": "Select all {{title}}",
    "pactor.transfer.itemCount": "{{count}} items",
    "pactor.transfer.moveRight": "Move to right",
    "pactor.transfer.moveLeft": "Move to left",
    "pactor.imageViewer.open": "View image",
    "pactor.imageViewer.prev": "Previous image",
    "pactor.imageViewer.next": "Next image",
    "pactor.imageViewer.zoomIn": "Zoom in",
    "pactor.imageViewer.zoomOut": "Zoom out",
    "pactor.imageViewer.rotate": "Rotate",
    "pactor.imageViewer.reset": "Reset",
    "pactor.imageViewer.close": "Close preview",
    "pactor.tour.prev": "Previous",
    "pactor.tour.next": "Next",
    "pactor.tour.done": "Done",
    "pactor.timePicker.placeholder": "Select time",
    "pactor.timePicker.now": "Now",
    "pactor.colorPicker.placeholder": "Select color",
    "pactor.colorPicker.hexLabel": "hex color value",
    "pactor.colorPicker.channel": "{{label}} channel",
    "pactor.colorPicker.invalidFormat": "Invalid color format, please enter a hex value",
    "pactor.rate.star": "Star {{index}}",
    "pactor.rate.starLeft": "Star {{index}} left half",
    "pactor.rate.starRight": "Star {{index}} right half",
    "pactor.documentPreview.prev": "Previous page",
    "pactor.documentPreview.next": "Next page",
    "pactor.documentPreview.zoomIn": "Zoom in",
    "pactor.documentPreview.zoomOut": "Zoom out",
    "pactor.documentPreview.page": "Page {{page}}",
    "pactor.documentPreview.empty": "No document content",
    "pactor.jsonViewer.copy": "Copy JSON",
    "pactor.jsonViewer.items": "[\u2026] {{count}} items",
    "pactor.jsonViewer.keys": "{\u2026} {{count}} keys",
    "pactor.filePreview.unnamed": "Untitled file",
    "pactor.filePreview.download": "Download",
    "pactor.image.preview": "Image preview",
    "pactor.backTop.top": "Back to top",
    "pactor.chatInput.send": "Send",
    "pactor.chatInput.stop": "Stop generating",
    "pactor.codeBlock.copy": "Copy code",
    "pactor.copyButton.ariaLabel": "Copy",
    "pactor.timeline.inProgress": "In progress",
    "pactor.header.themeToLight": "Switch to light mode",
    "pactor.header.themeToDark": "Switch to dark mode",
    "pactor.header.themeToggle": "Toggle theme",
    "pactor.sitemap.loadError": "Sitemap loading failed: {{message}}",
    "pactor.sitemap.redirecting": "Redirecting\u2026",
    "pactor.sitemap.notFound": "Page not found ({{path}})",
    "pactor.sitemap.layoutMissing": "Layout not defined: {{name}}",
    "pactor.page.loadFailed": "Page loading failed",
    "pactor.page.retry": "Retry",
    "pactor.userMenu.trigger": "Account menu, {{name}}",
    "pactor.userMenu.triggerWithStatus": "Account menu, {{name}}, {{status}}",
    "pactor.userMenu.title": "Account menu",
    "pactor.userMenu.status": "Status",
    "pactor.userMenu.theme": "Theme",
    "pactor.userMenu.language": "Language",
    "pactor.userMenu.languageWithCurrent": "Language (current: {{language}})",
    "pactor.userMenu.signOut": "Sign out",
    "pactor.userMenu.signingOut": "Signing out",
    "pactor.userMenu.statusAvailable": "Available",
    "pactor.userMenu.statusBusy": "Busy",
    "pactor.userMenu.statusAway": "Away",
    "pactor.userMenu.themeLight": "Light",
    "pactor.userMenu.themeDark": "Dark",
    "pactor.userMenu.themeSystem": "System",
    "pactor.splitButton.moreOptions": "More options",
    "pactor.confirmMorph.success": "Done",
    "pactor.confirmMorph.undo": "Undo",
    "pactor.expandingButtonGroup.confirm": "Confirm",
    "pactor.operator.equal": "Equal",
    "pactor.operator.greater": "Greater than",
    "pactor.operator.greaterEqual": "Greater than or equal",
    "pactor.operator.less": "Less than",
    "pactor.operator.lessEqual": "Less than or equal",
    "pactor.operator.unequal": "Not equal",
    "pactor.operator.between": "Between",
    "pactor.operator.hasValue": "Has value",
    "pactor.operator.noValue": "No value",
    "pactor.operator.isTrue": "Is true",
    "pactor.operator.isFalse": "Is false",
    "pactor.operator.contains": "Contains",
    "pactor.operator.notContains": "Does not contain",
    "pactor.operator.like": "Like",
    "pactor.operator.empty": "Is empty",
    "pactor.operator.notEmpty": "Is not empty",
    "pactor.condition.add": "Add condition",
    "pactor.fieldCondition.selectField": "Select field",
    "pactor.fieldCondition.valuePlaceholder": "Enter a value",
    "pactor.fieldCondition.and": "AND",
    "pactor.fieldCondition.or": "OR",
    "pactor.ruleConfig.weight": "Weight",
    "pactor.ruleConfig.score": "Score",
    "pactor.ruleConfig.scoreValue": "Score: {{score}}",
    "pactor.ruleConfig.weightPlaceholder": "Enter weight",
    "pactor.ruleConfig.valueRequired": "Please enter a value",
    "pactor.ruleConfig.scoreRequired": "Please enter a score",
    "pactor.ruleConfig.issueSeparator": "; ",
    "pactor.ruleConfig.tagPlaceholder": "Press Enter after typing",
    "pactor.expressionEditor.edit": "Edit",
    "pactor.expressionEditor.invalidFormat": "Invalid input format",
    "pactor.searchableSelect.search": "Search\u2026",
    "pactor.searchableSelect.noOptions": "No options",
    "pactor.recording.listTitle": "Recording list",
    "pactor.recording.newRecording": "Start new recording",
    "pactor.recording.empty": "No recordings",
    "pactor.recording.selectDone": "Done",
    "pactor.recording.selectedCount": "{{count}} selected",
    "pactor.recording.delete": "Delete",
    "pactor.recording.deleteTitle": "Delete recording",
    "pactor.recording.deleteConfirm": "Delete the {{count}} selected recording(s)? This cannot be undone.",
    "pactor.recording.speakerDialogTitle": "Change speaker",
    "pactor.recording.marked": "\u2691 Marked",
    "pactor.recording.sharePopoverTitle": "Select content to share",
    "pactor.recording.shareDialogTitle": "Share meeting content",
    "pactor.recording.copyLink": "Copy link",
    "pactor.recording.copied": "Copied",
    "pactor.recording.mail": "Email",
    "pactor.recording.systemShare": "System share",
    "pactor.recording.speakerDialogHint": "Choose meeting info, a recognized person, or a contact you created manually.",
    "pactor.recording.speakerInputPlaceholder": "Enter name",
    "pactor.recording.speakerApply": "Apply name",
    "pactor.recording.summary.mindmap": "Mind map",
    "pactor.recording.summary.overview": "Meeting overview",
    "pactor.recording.summary.topics": "Key topics",
    "pactor.recording.summary.conclusions": "Review conclusions and next steps",
    "pactor.recording.summary.item": "Item",
    "pactor.recording.summary.conclusion": "Conclusion",
    "pactor.recording.summary.owner": "Owner",
    "pactor.recording.summary.materials": "Related materials",
    "pactor.recording.summary.todos": "Action items",
    "pactor.recording.insight.basics": "Basic info",
    "pactor.recording.insight.chapters": "Chapter overview and analysis",
    "pactor.recording.insight.viewpoints": "Viewpoint analysis",
    "pactor.recording.insight.autoTag": "Auto-detected",
    "pactor.recording.insight.perspectiveTitle": "Change analysis perspective",
    "pactor.recording.insight.perspectiveHint": "Describe your role and focus for this meeting in natural language.",
    "pactor.recording.insight.perspectiveApply": "Apply perspective",
    "pactor.recording.insight.labelSeparator": ": ",
    "pactor.recording.translation.target": "Translation",
    "pactor.recording.translation.dialogTitle": "Select translation language",
    "pactor.recording.translation.sourceTitle": "Detected source language",
    "pactor.recording.translation.targetTitle": "Target language",
    "pactor.app.startFailed": "Failed to start app",
    "pactor.app.loading": "Loading",
    "pactor.app.pageNotFound": "Page not found or not registered",
    "pactor.app.forbidden": "You do not have permission to access this page",
    "pactor.app.renderError": "Page render error",
    "pactor.chat.nav.label": "Conversation navigation",
    "pactor.chat.serviceMissing": "Chat service is not configured. Wrap Chat with ChatServicesProvider to provide a transport and retry.",
    "pactor.chat.agentStatus.elapsed": "Elapsed {{seconds}}s",
    "pactor.chat.artifact.title": "Artifacts",
    "pactor.chat.artifact.empty": "No artifacts yet",
    "pactor.chat.artifact.emptyInChat": "No artifacts yet. Files generated from messages will appear here.",
    "pactor.chat.artifact.list": "Artifact list",
    "pactor.chat.artifact.output": "Output",
    "pactor.chat.artifact.resize": "Drag to resize panel",
    "pactor.chat.artifact.back": "Back to content",
    "pactor.chat.artifact.download": "Download artifact",
    "pactor.chat.artifact.collapsePanel": "Collapse artifacts panel",
    "pactor.chat.artifact.openInPanel": "Open in panel: {{title}}",
    "pactor.chat.artifact.expand": "Expand",
    "pactor.chat.artifact.collapse": "Collapse",
    "pactor.chat.artifact.viewAll": "View all artifacts ({{count}})",
    "pactor.chat.artifact.generated": "Generated {{count}} artifact(s)",
    "pactor.chat.dsl.denied": "This component is not allowed in artifact preview: {{type}}",
    "pactor.chat.dsl.deniedNoType": "This component is not allowed in artifact preview",
    "pactor.chat.dsl.renderFailed": "DSL artifact failed to render; showing fallback",
    "pactor.chat.dsl.previewUnavailable": "DSL preview unavailable (Safe Registry not provided)",
    "pactor.chat.dsl.invalid": "Invalid DSL artifact content",
    "pactor.chat.attachment.retry": "Retry {{name}}",
    "pactor.chat.attachment.remove": "Remove {{name}}",
    "pactor.chat.attachment.uploadFailed": "Upload failed",
    "pactor.chat.message.user": "Me",
    "pactor.chat.message.assistant": "Assistant",
    "pactor.chat.message.system": "System",
    "pactor.chat.message.date": "{{month}}/{{day}} {{time}}",
    "pactor.chat.message.edit": "Edit",
    "pactor.chat.message.editMessage": "Edit message",
    "pactor.chat.message.confirmSend": "Confirm and send",
    "pactor.chat.message.copy": "Copy",
    "pactor.chat.message.regenerate": "Regenerate",
    "pactor.chat.message.retry": "Retry",
    "pactor.chat.message.copied": "Copied",
    "pactor.chat.question.label": "Questions",
    "pactor.chat.question.nav": "Question navigation",
    "pactor.chat.question.jump": "Jump to question: {{question}}",
    "pactor.chat.composer.addContext": "Add context",
    "pactor.chat.composer.addAttachment": "Add attachment",
    "pactor.chat.composer.selectModel": "Select model",
    "pactor.chat.composer.placeholder": "Type a message. Enter to send, Shift+Enter for a new line",
    "pactor.chat.composer.removeAttachment": "Remove attachment",
    "pactor.chat.composer.removeContext": "Remove context {{label}}",
    "pactor.chat.composer.more": "More actions",
    "pactor.chat.mentions.empty": "No matches",
    "pactor.chat.conversation.search": "Search conversations",
    "pactor.chat.conversation.delete": "Delete {{title}}",
    "pactor.chat.conversation.empty": "No matching conversations",
    "pactor.chat.steps.title": "Steps",
    "pactor.chat.steps.empty": "No steps in this conversation",
    "pactor.chat.thinking.thinking": "Thinking\u2026",
    "pactor.chat.thinking.done": "Thought complete",
    "pactor.chat.toolCall.title": "Tool call",
    "pactor.chat.toolCall.args": "Arguments",
    "pactor.chat.toolCall.result": "Result",
    "pactor.chat.welcome.title": "How can I help?",
    "pactor.chat.welcome.greeting": "Hello, how can I help?",
    "pactor.chat.workspace.select": "Select workspace",
    "pactor.chat.workspace.search": "Search workspaces",
    "pactor.chat.workspace.empty": "No matching workspaces",
    "pactor.chat.workspace.create": "New workspace",
    "pactor.chat.workspace.none": "No workspace",
    "pactor.chat.workspace.namePlaceholder": "Enter workspace name",
    "pactor.chat.workspace.createAction": "Create",
    "pactor.chat.export.user": "User",
    "pactor.chat.export.assistant": "Assistant",
    "pactor.chat.export.system": "System",
    "pactor.chat.activity.thinking": "Thinking\u2026",
    "pactor.chat.activity.tool": "Calling tool\u2026",
    "pactor.chat.activity.generating": "Generating response\u2026",
    "pactor.chat.activity.responding": "Responding\u2026",
    "pactor.chat.activity.error": "Something went wrong",
    "pactor.chat.activity.stopped": "Stopped",
    "pactor.chat.activity.done": "Completed",
    "pactor.chat.activity.doneWithTools": "Completed \xB7 {{count}} tool call(s)",
    "pactor.chat.activity.noReturn": "(No output)",
    "pactor.chat.activity.failed": "Failed",
    "pactor.chat.activity.thinkingProcess": "Thinking process",
    "pactor.chat.view.backToBottom": "Back to bottom",
    "pactor.chat.part.denied": "This component is not allowed in chat: {{type}}",
    "pactor.chat.part.deniedNoType": "This component is not allowed in chat",
    "pactor.chat.part.renderUnavailable": "DSL rendering unavailable (Safe Registry not provided)",
    "pactor.chat.part.generating": "Generating content\u2026",
    "pactor.chat.header.exportMarkdown": "Export Markdown",
    "pactor.chat.header.clear": "Clear conversation",
    "pactor.chat.header.editTitle": "Edit title",
    "pactor.chat.header.clickToEditTitle": "Click to edit title",
    "pactor.chat.panel.close": "Close panel"
};
// src/context/locales/zh-CN.ts
var zhCN = {
    "pactor.layout.expandSidebar": "\u5C55\u5F00\u4FA7\u8FB9\u680F",
    "pactor.layout.collapseSidebar": "\u6536\u8D77\u4FA7\u8FB9\u680F",
    "pactor.layout.openNavigation": "\u6253\u5F00\u5BFC\u822A",
    "pactor.layout.closeTab": "\u5173\u95ED {{title}}",
    "pactor.layout.breadcrumb": "\u9762\u5305\u5C51",
    "pactor.table.loading": "\u52A0\u8F7D\u4E2D\u2026",
    "pactor.table.empty": "\u6682\u65E0\u6570\u636E",
    "pactor.table.selectAll": "\u5168\u9009",
    "pactor.table.selectRow": "\u9009\u62E9\u884C",
    "pactor.table.expandRow": "\u5C55\u5F00\u884C",
    "pactor.table.collapseRow": "\u6536\u8D77\u884C",
    "pactor.table.dragRow": "\u62D6\u62FD\u6392\u5E8F",
    "pactor.form.required": "\u5FC5\u586B",
    "pactor.control.clear": "\u6E05\u9664",
    "pactor.select.clear": "\u6E05\u9664",
    "pactor.select.search": "\u641C\u7D22\u9009\u9879",
    "pactor.input.clear": "\u6E05\u9664",
    "pactor.input.showPassword": "\u663E\u793A\u5BC6\u7801",
    "pactor.input.hidePassword": "\u9690\u85CF\u5BC6\u7801",
    "pactor.input.placeholder": "\u8BF7\u8F93\u5165",
    "pactor.numberInput.increase": "\u589E\u52A0",
    "pactor.numberInput.decrease": "\u51CF\u5C11",
    "pactor.alertDialog.confirm": "\u786E\u5B9A",
    "pactor.alertDialog.cancel": "\u53D6\u6D88",
    "pactor.command.empty": "\u65E0\u5339\u914D\u7ED3\u679C",
    "pactor.overlay.close": "\u5173\u95ED",
    "pactor.overlay.cancel": "\u53D6\u6D88",
    "pactor.overlay.confirm": "\u786E\u8BA4",
    "pactor.datePicker.placeholder": "\u9009\u62E9\u65E5\u671F",
    "pactor.datePicker.placeholderRange": "\u9009\u62E9\u65E5\u671F\u8303\u56F4",
    "pactor.datePicker.today": "\u4ECA\u5929",
    "pactor.datePicker.thisWeek": "\u672C\u5468",
    "pactor.datePicker.thisMonth": "\u672C\u6708",
    "pactor.login.title": "\u767B\u5F55",
    "pactor.login.username": "\u7528\u6237\u540D",
    "pactor.login.usernamePlaceholder": "\u8BF7\u8F93\u5165\u7528\u6237\u540D",
    "pactor.login.usernameRequired": "\u8BF7\u8F93\u5165\u7528\u6237\u540D",
    "pactor.login.password": "\u5BC6\u7801",
    "pactor.login.passwordPlaceholder": "\u8BF7\u8F93\u5165\u5BC6\u7801",
    "pactor.login.passwordRequired": "\u8BF7\u8F93\u5165\u5BC6\u7801",
    "pactor.login.submit": "\u767B \u5F55",
    "pactor.cardList.total": "\u5171 {{count}} \u4E2A",
    "pactor.formCardList.item": "\u7B2C {{index}} \u9879",
    "pactor.formCardList.add": "\u6DFB\u52A0\u4E00\u9879",
    "pactor.formCardList.removeItem": "\u5220\u9664\u7B2C {{index}} \u9879",
    "pactor.formCardList.removeConfirm": "\u786E\u5B9A\u5220\u9664\u8BE5\u5217\u8868\u9879\u5417\uFF1F\u5DF2\u586B\u5199\u7684\u5185\u5BB9\u5C06\u4E22\u5931\u3002",
    "pactor.formModal.submit": "\u63D0\u4EA4",
    "pactor.formModal.cancel": "\u53D6\u6D88",
    "pactor.fileManager.empty": "\u70B9\u51FB\u5DE6\u4FA7\u6587\u4EF6\u67E5\u770B\u5185\u5BB9",
    "pactor.fileManager.edit": "\u7F16\u8F91",
    "pactor.fileManager.finish": "\u5B8C\u6210",
    "pactor.fileManager.copy": "\u590D\u5236\u6587\u4EF6\u5185\u5BB9",
    "pactor.fileManager.copyFailed": "\u590D\u5236\u5931\u8D25",
    "pactor.fileManager.discardTitle": "\u653E\u5F03\u672A\u4FDD\u5B58\u7684\u4FEE\u6539\uFF1F",
    "pactor.fileManager.discardDesc": "\u5207\u6362\u5230\u5176\u4ED6\u6587\u4EF6\u5C06\u4E22\u5931\u5F53\u524D\u6587\u4EF6\u4E2D\u672A\u4FDD\u5B58\u7684\u4FEE\u6539\u3002",
    "pactor.fileManager.discardConfirm": "\u653E\u5F03\u4FEE\u6539",
    "pactor.fileManager.discardCancel": "\u7EE7\u7EED\u7F16\u8F91",
    "pactor.chart.empty": "\u6682\u65E0\u6570\u636E",
    "pactor.select.placeholder": "\u8BF7\u9009\u62E9",
    "pactor.pagination.total": "\u5171 {{count}} \u6761",
    "pactor.pagination.pageSize": "\u6BCF\u9875 {{size}} \u6761",
    "pactor.pagination.itemsPerPage": "{{size}} \u6761/\u9875",
    "pactor.pagination.prev": "\u4E0A\u4E00\u9875",
    "pactor.pagination.next": "\u4E0B\u4E00\u9875",
    "pactor.upload.dragText": "\u70B9\u51FB\u6216\u62D6\u62FD\u6587\u4EF6\u5230\u6B64\u533A\u57DF",
    "pactor.upload.selectFile": "\u9009\u62E9\u6587\u4EF6",
    "pactor.upload.rejected": "\u5DF2\u5FFD\u7565 {{count}} \u4E2A\u4E0D\u7B26\u5408\u8981\u6C42\u7684\u6587\u4EF6",
    "pactor.upload.remove": "\u79FB\u9664 {{name}}",
    "pactor.tree.newNode": "\u65B0\u8282\u70B9",
    "pactor.tree.nodeActions": "\u8282\u70B9\u64CD\u4F5C",
    "pactor.tree.dragToReorder": "\u62D6\u62FD\u6392\u5E8F",
    "pactor.tree.expand": "\u5C55\u5F00",
    "pactor.tree.collapse": "\u6536\u8D77",
    "pactor.transfer.listOne": "\u5217\u8868 1",
    "pactor.transfer.listTwo": "\u5217\u8868 2",
    "pactor.transfer.selectAll": "\u5168\u9009{{title}}",
    "pactor.transfer.itemCount": "{{count}} \u9879",
    "pactor.transfer.moveRight": "\u79FB\u5230\u53F3\u4FA7",
    "pactor.transfer.moveLeft": "\u79FB\u5230\u5DE6\u4FA7",
    "pactor.imageViewer.open": "\u56FE\u7247\u67E5\u770B",
    "pactor.imageViewer.prev": "\u4E0A\u4E00\u5F20",
    "pactor.imageViewer.next": "\u4E0B\u4E00\u5F20",
    "pactor.imageViewer.zoomIn": "\u653E\u5927",
    "pactor.imageViewer.zoomOut": "\u7F29\u5C0F",
    "pactor.imageViewer.rotate": "\u65CB\u8F6C",
    "pactor.imageViewer.reset": "\u590D\u4F4D",
    "pactor.imageViewer.close": "\u5173\u95ED\u9884\u89C8",
    "pactor.tour.prev": "\u4E0A\u4E00\u6B65",
    "pactor.tour.next": "\u4E0B\u4E00\u6B65",
    "pactor.tour.done": "\u5B8C\u6210",
    "pactor.timePicker.placeholder": "\u8BF7\u9009\u62E9\u65F6\u95F4",
    "pactor.timePicker.now": "\u6B64\u523B",
    "pactor.colorPicker.placeholder": "\u8BF7\u9009\u62E9\u989C\u8272",
    "pactor.colorPicker.hexLabel": "hex \u989C\u8272\u503C",
    "pactor.colorPicker.channel": "{{label}} \u901A\u9053",
    "pactor.colorPicker.invalidFormat": "\u989C\u8272\u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u8BF7\u8F93\u5165\u5341\u516D\u8FDB\u5236\u8272\u503C",
    "pactor.rate.star": "\u7B2C {{index}} \u661F",
    "pactor.rate.starLeft": "\u7B2C {{index}} \u661F\u5DE6\u534A",
    "pactor.rate.starRight": "\u7B2C {{index}} \u661F\u53F3\u534A",
    "pactor.documentPreview.prev": "\u4E0A\u4E00\u9875",
    "pactor.documentPreview.next": "\u4E0B\u4E00\u9875",
    "pactor.documentPreview.zoomIn": "\u653E\u5927",
    "pactor.documentPreview.zoomOut": "\u7F29\u5C0F",
    "pactor.documentPreview.page": "\u7B2C {{page}} \u9875",
    "pactor.documentPreview.empty": "\u6682\u65E0\u6587\u6863\u5185\u5BB9",
    "pactor.jsonViewer.copy": "\u590D\u5236 JSON",
    "pactor.jsonViewer.items": "[\u2026] {{count}} \u9879",
    "pactor.jsonViewer.keys": "{\u2026} {{count}} \u952E",
    "pactor.filePreview.unnamed": "\u672A\u547D\u540D\u6587\u4EF6",
    "pactor.filePreview.download": "\u4E0B\u8F7D",
    "pactor.image.preview": "\u56FE\u7247\u9884\u89C8",
    "pactor.backTop.top": "\u56DE\u5230\u9876\u90E8",
    "pactor.chatInput.send": "\u53D1\u9001",
    "pactor.chatInput.stop": "\u505C\u6B62\u751F\u6210",
    "pactor.codeBlock.copy": "\u590D\u5236\u4EE3\u7801",
    "pactor.copyButton.ariaLabel": "\u590D\u5236",
    "pactor.timeline.inProgress": "\u8FDB\u884C\u4E2D",
    "pactor.header.themeToLight": "\u5207\u6362\u4E3A\u6D45\u8272",
    "pactor.header.themeToDark": "\u5207\u6362\u4E3A\u6DF1\u8272",
    "pactor.header.themeToggle": "\u5207\u6362\u660E\u6697\u4E3B\u9898",
    "pactor.sitemap.loadError": "sitemap \u52A0\u8F7D\u5931\u8D25\uFF1A{{message}}",
    "pactor.sitemap.redirecting": "\u91CD\u5B9A\u5411\u2026",
    "pactor.sitemap.notFound": "\u9875\u9762\u4E0D\u5B58\u5728\uFF08{{path}}\uFF09",
    "pactor.sitemap.layoutMissing": "\u5E03\u5C40\u672A\u5B9A\u4E49\uFF1A{{name}}",
    "pactor.page.loadFailed": "\u9875\u9762\u52A0\u8F7D\u5931\u8D25",
    "pactor.page.retry": "\u91CD\u8BD5",
    "pactor.userMenu.trigger": "\u8D26\u6237\u83DC\u5355\uFF0C{{name}}",
    "pactor.userMenu.triggerWithStatus": "\u8D26\u6237\u83DC\u5355\uFF0C{{name}}\uFF0C{{status}}",
    "pactor.userMenu.title": "\u8D26\u6237\u83DC\u5355",
    "pactor.userMenu.status": "\u72B6\u6001",
    "pactor.userMenu.theme": "\u4E3B\u9898",
    "pactor.userMenu.language": "\u5207\u6362\u8BED\u8A00",
    "pactor.userMenu.languageWithCurrent": "\u5207\u6362\u8BED\u8A00\uFF08\u5F53\u524D {{language}}\uFF09",
    "pactor.userMenu.signOut": "\u9000\u51FA\u767B\u5F55",
    "pactor.userMenu.signingOut": "\u6B63\u5728\u9000\u51FA",
    "pactor.userMenu.statusAvailable": "\u5728\u7EBF",
    "pactor.userMenu.statusBusy": "\u5FD9\u788C",
    "pactor.userMenu.statusAway": "\u79BB\u5F00",
    "pactor.userMenu.themeLight": "\u6D45\u8272",
    "pactor.userMenu.themeDark": "\u6DF1\u8272",
    "pactor.userMenu.themeSystem": "\u8DDF\u968F\u7CFB\u7EDF",
    "pactor.splitButton.moreOptions": "\u66F4\u591A\u9009\u9879",
    "pactor.confirmMorph.success": "\u5DF2\u5B8C\u6210",
    "pactor.confirmMorph.undo": "\u64A4\u9500",
    "pactor.expandingButtonGroup.confirm": "\u786E\u8BA4",
    "pactor.operator.equal": "\u7B49\u4E8E",
    "pactor.operator.greater": "\u5927\u4E8E",
    "pactor.operator.greaterEqual": "\u5927\u4E8E\u7B49\u4E8E",
    "pactor.operator.less": "\u5C0F\u4E8E",
    "pactor.operator.lessEqual": "\u5C0F\u4E8E\u7B49\u4E8E",
    "pactor.operator.unequal": "\u4E0D\u7B49\u4E8E",
    "pactor.operator.between": "\u8303\u56F4",
    "pactor.operator.hasValue": "\u6709\u503C",
    "pactor.operator.noValue": "\u65E0\u503C",
    "pactor.operator.isTrue": "\u4E3A\u771F",
    "pactor.operator.isFalse": "\u4E3A\u5047",
    "pactor.operator.contains": "\u5305\u542B",
    "pactor.operator.notContains": "\u4E0D\u5305\u542B",
    "pactor.operator.like": "\u7C7B\u4F3C",
    "pactor.operator.empty": "\u4E3A\u7A7A",
    "pactor.operator.notEmpty": "\u4E0D\u4E3A\u7A7A",
    "pactor.condition.add": "\u6DFB\u52A0\u6761\u4EF6",
    "pactor.fieldCondition.selectField": "\u9009\u62E9\u5B57\u6BB5",
    "pactor.fieldCondition.valuePlaceholder": "\u8BF7\u8F93\u5165\u503C",
    "pactor.fieldCondition.and": "\u4E14",
    "pactor.fieldCondition.or": "\u6216",
    "pactor.ruleConfig.weight": "\u6743\u91CD",
    "pactor.ruleConfig.score": "\u8BC4\u5206",
    "pactor.ruleConfig.scoreValue": "\u8BC4\u5206: {{score}}",
    "pactor.ruleConfig.weightPlaceholder": "\u8BF7\u8F93\u5165\u6743\u91CD",
    "pactor.ruleConfig.valueRequired": "\u8BF7\u586B\u5199\u53D6\u503C",
    "pactor.ruleConfig.scoreRequired": "\u8BF7\u586B\u5199\u8BC4\u5206",
    "pactor.ruleConfig.issueSeparator": "\uFF1B",
    "pactor.ruleConfig.tagPlaceholder": "\u8F93\u5165\u540E\u6309 Enter",
    "pactor.expressionEditor.edit": "\u7F16\u8F91",
    "pactor.expressionEditor.invalidFormat": "\u8F93\u5165\u683C\u5F0F\u4E0D\u6B63\u786E",
    "pactor.searchableSelect.search": "\u641C\u7D22\u2026",
    "pactor.searchableSelect.noOptions": "\u65E0\u9009\u9879",
    "pactor.recording.listTitle": "\u5F55\u97F3\u8BB0\u5F55\u5217\u8868",
    "pactor.recording.newRecording": "\u5F00\u59CB\u65B0\u5F55\u97F3",
    "pactor.recording.empty": "\u6682\u65E0\u5F55\u97F3",
    "pactor.recording.selectDone": "\u5B8C\u6210",
    "pactor.recording.selectedCount": "\u5DF2\u9009 {{count}} \u6761",
    "pactor.recording.delete": "\u5220\u9664",
    "pactor.recording.deleteTitle": "\u5220\u9664\u5F55\u97F3",
    "pactor.recording.deleteConfirm": "\u786E\u5B9A\u5220\u9664\u9009\u4E2D\u7684 {{count}} \u6761\u5F55\u97F3\u5417\uFF1F\u5220\u9664\u540E\u4E0D\u53EF\u6062\u590D\u3002",
    "pactor.recording.speakerDialogTitle": "\u4FEE\u6539\u53D1\u8A00\u4EBA",
    "pactor.recording.marked": "\u2691 \u5DF2\u6807\u8BB0",
    "pactor.recording.sharePopoverTitle": "\u9009\u62E9\u5206\u4EAB\u5185\u5BB9",
    "pactor.recording.shareDialogTitle": "\u5206\u4EAB\u4F1A\u8BAE\u5185\u5BB9",
    "pactor.recording.copyLink": "\u590D\u5236\u94FE\u63A5",
    "pactor.recording.copied": "\u5DF2\u590D\u5236",
    "pactor.recording.mail": "\u90AE\u4EF6",
    "pactor.recording.systemShare": "\u7CFB\u7EDF\u5206\u4EAB",
    "pactor.recording.speakerDialogHint": "\u9009\u62E9\u53C2\u4F1A\u4FE1\u606F\u3001\u5DF2\u8BC6\u522B\u4EBA\u5458\u6216\u4F60\u66FE\u624B\u52A8\u521B\u5EFA\u7684\u8054\u7CFB\u4EBA\u3002",
    "pactor.recording.speakerInputPlaceholder": "\u8F93\u5165\u59D3\u540D",
    "pactor.recording.speakerApply": "\u5E94\u7528\u59D3\u540D",
    "pactor.recording.summary.mindmap": "\u601D\u7EF4\u5BFC\u56FE",
    "pactor.recording.summary.overview": "\u4F1A\u8BAE\u6982\u51B5",
    "pactor.recording.summary.topics": "\u4E3B\u8981\u8BAE\u9898",
    "pactor.recording.summary.conclusions": "\u8BC4\u5BA1\u7ED3\u8BBA\u4E0E\u540E\u7EED\u5B89\u6392",
    "pactor.recording.summary.item": "\u4E8B\u9879",
    "pactor.recording.summary.conclusion": "\u4F1A\u8BAE\u7ED3\u8BBA",
    "pactor.recording.summary.owner": "\u8D1F\u8D23\u4EBA",
    "pactor.recording.summary.materials": "\u76F8\u5173\u6750\u6599",
    "pactor.recording.summary.todos": "\u5F85\u529E\u4E8B\u9879",
    "pactor.recording.insight.basics": "\u57FA\u7840\u4FE1\u606F",
    "pactor.recording.insight.chapters": "\u7AE0\u8282\u901F\u89C8\u4E0E\u89E3\u8BFB",
    "pactor.recording.insight.viewpoints": "\u89C2\u70B9\u5206\u6790",
    "pactor.recording.insight.autoTag": "\u81EA\u52A8\u8BC6\u522B",
    "pactor.recording.insight.perspectiveTitle": "\u4FEE\u6539\u89E3\u8BFB\u8EAB\u4EFD",
    "pactor.recording.insight.perspectiveHint": "\u7528\u81EA\u7136\u8BED\u8A00\u8BF4\u660E\u4F60\u5728\u672C\u6B21\u4F1A\u8BAE\u4E2D\u7684\u8EAB\u4EFD\u4E0E\u5173\u6CE8\u70B9\u3002",
    "pactor.recording.insight.perspectiveApply": "\u5E94\u7528\u8EAB\u4EFD",
    "pactor.recording.insight.labelSeparator": "\uFF1A",
    "pactor.recording.translation.target": "\u8BD1\u6587",
    "pactor.recording.translation.dialogTitle": "\u9009\u62E9\u7FFB\u8BD1\u8BED\u8A00",
    "pactor.recording.translation.sourceTitle": "\u539F\u6587\u8BED\u8A00\u8BC6\u522B",
    "pactor.recording.translation.targetTitle": "\u8BD1\u6587\u8BED\u8A00\u9009\u62E9",
    "pactor.app.startFailed": "\u5E94\u7528\u542F\u52A8\u5931\u8D25",
    "pactor.app.loading": "\u52A0\u8F7D\u4E2D",
    "pactor.app.pageNotFound": "\u9875\u9762\u4E0D\u5B58\u5728\u6216\u5C1A\u672A\u6CE8\u518C",
    "pactor.app.forbidden": "\u6CA1\u6709\u8BBF\u95EE\u8BE5\u9875\u9762\u7684\u6743\u9650",
    "pactor.app.renderError": "\u9875\u9762\u6E32\u67D3\u5F02\u5E38",
    "pactor.chat.nav.label": "\u4F1A\u8BDD\u5BFC\u822A",
    "pactor.chat.serviceMissing": "\u672A\u914D\u7F6E\u804A\u5929\u670D\u52A1\uFF1A\u8BF7\u5728 Chat \u5916\u5C42\u4F7F\u7528 ChatServicesProvider \u6CE8\u5165 transport \u7B49\u670D\u52A1\u540E\u91CD\u8BD5\u3002",
    "pactor.chat.agentStatus.elapsed": "\u5DF2\u7528\u65F6 {{seconds}}s",
    "pactor.chat.artifact.title": "\u4EA7\u7269",
    "pactor.chat.artifact.empty": "\u6682\u65E0\u4EA7\u7269",
    "pactor.chat.artifact.emptyInChat": "\u6682\u65E0\u4EA7\u7269\uFF0C\u53D1\u9001\u6D88\u606F\u540E\u751F\u6210\u7684\u6587\u4EF6\u5C06\u5C55\u793A\u5728\u8FD9\u91CC",
    "pactor.chat.artifact.list": "\u4EA7\u7269\u76EE\u5F55",
    "pactor.chat.artifact.output": "\u4EA7\u51FA\u7269",
    "pactor.chat.artifact.resize": "\u62D6\u52A8\u8C03\u6574\u9762\u677F\u5BBD\u5EA6",
    "pactor.chat.artifact.back": "\u8FD4\u56DE\u5185\u5BB9",
    "pactor.chat.artifact.download": "\u4E0B\u8F7D\u4EA7\u7269",
    "pactor.chat.artifact.collapsePanel": "\u6536\u8D77\u4EA7\u7269\u533A",
    "pactor.chat.artifact.openInPanel": "\u5728\u9762\u677F\u4E2D\u6253\u5F00\uFF1A{{title}}",
    "pactor.chat.artifact.expand": "\u5C55\u5F00",
    "pactor.chat.artifact.collapse": "\u6536\u8D77",
    "pactor.chat.artifact.viewAll": "\u67E5\u770B\u6240\u6709\u4EA7\u7269({{count}})",
    "pactor.chat.artifact.generated": "\u5DF2\u751F\u6210 {{count}} \u4E2A\u4EA7\u7269",
    "pactor.chat.dsl.denied": "\u8BE5\u7EC4\u4EF6\u4E0D\u5141\u8BB8\u5728\u4EA7\u7269\u9884\u89C8\u4E2D\u4F7F\u7528\uFF1A{{type}}",
    "pactor.chat.dsl.deniedNoType": "\u8BE5\u7EC4\u4EF6\u4E0D\u5141\u8BB8\u5728\u4EA7\u7269\u9884\u89C8\u4E2D\u4F7F\u7528",
    "pactor.chat.dsl.renderFailed": "DSL \u4EA7\u7269\u6E32\u67D3\u5931\u8D25\uFF0C\u5DF2\u964D\u7EA7\u5C55\u793A",
    "pactor.chat.dsl.previewUnavailable": "DSL \u9884\u89C8\u4E0D\u53EF\u7528\uFF08\u672A\u6CE8\u5165 Safe Registry\uFF09",
    "pactor.chat.dsl.invalid": "DSL \u4EA7\u7269\u5185\u5BB9\u65E0\u6548",
    "pactor.chat.attachment.retry": "\u91CD\u8BD5 {{name}}",
    "pactor.chat.attachment.remove": "\u79FB\u9664 {{name}}",
    "pactor.chat.attachment.uploadFailed": "\u4E0A\u4F20\u5931\u8D25",
    "pactor.chat.message.user": "\u6211",
    "pactor.chat.message.assistant": "\u52A9\u624B",
    "pactor.chat.message.system": "\u7CFB\u7EDF",
    "pactor.chat.message.date": "{{month}}\u6708{{day}}\u65E5 {{time}}",
    "pactor.chat.message.edit": "\u7F16\u8F91",
    "pactor.chat.message.editMessage": "\u7F16\u8F91\u6D88\u606F",
    "pactor.chat.message.confirmSend": "\u786E\u8BA4\u53D1\u9001",
    "pactor.chat.message.copy": "\u590D\u5236",
    "pactor.chat.message.regenerate": "\u91CD\u65B0\u751F\u6210",
    "pactor.chat.message.retry": "\u91CD\u8BD5",
    "pactor.chat.message.copied": "\u5DF2\u590D\u5236",
    "pactor.chat.question.label": "\u63D0\u95EE",
    "pactor.chat.question.nav": "\u63D0\u95EE\u5BFC\u822A",
    "pactor.chat.question.jump": "\u8DF3\u8F6C\u5230\u63D0\u95EE\uFF1A{{question}}",
    "pactor.chat.composer.addContext": "\u6DFB\u52A0\u4E0A\u4E0B\u6587",
    "pactor.chat.composer.addAttachment": "\u6DFB\u52A0\u9644\u4EF6",
    "pactor.chat.composer.selectModel": "\u9009\u62E9\u6A21\u578B",
    "pactor.chat.composer.placeholder": "\u8F93\u5165\u6D88\u606F\uFF0CEnter \u53D1\u9001\uFF0CShift+Enter \u6362\u884C",
    "pactor.chat.composer.removeAttachment": "\u79FB\u9664\u9644\u4EF6",
    "pactor.chat.composer.removeContext": "\u79FB\u9664\u4E0A\u4E0B\u6587 {{label}}",
    "pactor.chat.composer.more": "\u66F4\u591A\u529F\u80FD",
    "pactor.chat.mentions.empty": "\u65E0\u5339\u914D\u9879",
    "pactor.chat.conversation.search": "\u641C\u7D22\u4F1A\u8BDD",
    "pactor.chat.conversation.delete": "\u5220\u9664 {{title}}",
    "pactor.chat.conversation.empty": "\u65E0\u5339\u914D\u4F1A\u8BDD",
    "pactor.chat.steps.title": "\u6267\u884C\u6B65\u9AA4",
    "pactor.chat.steps.empty": "\u5F53\u524D\u4F1A\u8BDD\u6682\u65E0\u6267\u884C\u6B65\u9AA4",
    "pactor.chat.thinking.thinking": "\u601D\u8003\u4E2D\u2026",
    "pactor.chat.thinking.done": "\u601D\u8003\u5B8C\u6210",
    "pactor.chat.toolCall.title": "\u5DE5\u5177\u8C03\u7528",
    "pactor.chat.toolCall.args": "\u53C2\u6570",
    "pactor.chat.toolCall.result": "\u7ED3\u679C",
    "pactor.chat.welcome.title": "\u6709\u4EC0\u4E48\u53EF\u4EE5\u5E2E\u4F60\uFF1F",
    "pactor.chat.welcome.greeting": "\u4F60\u597D\uFF0C\u6709\u4EC0\u4E48\u53EF\u4EE5\u5E2E\u4F60\uFF1F",
    "pactor.chat.workspace.select": "\u9009\u62E9\u5DE5\u4F5C\u7A7A\u95F4",
    "pactor.chat.workspace.search": "\u641C\u7D22\u5DE5\u4F5C\u7A7A\u95F4",
    "pactor.chat.workspace.empty": "\u65E0\u5339\u914D\u7684\u5DE5\u4F5C\u7A7A\u95F4",
    "pactor.chat.workspace.create": "\u65B0\u5EFA\u5DE5\u4F5C\u7A7A\u95F4",
    "pactor.chat.workspace.none": "\u4E0D\u4F7F\u7528\u5DE5\u4F5C\u7A7A\u95F4",
    "pactor.chat.workspace.namePlaceholder": "\u8BF7\u8F93\u5165\u5DE5\u4F5C\u7A7A\u95F4\u540D\u79F0",
    "pactor.chat.workspace.createAction": "\u521B\u5EFA",
    "pactor.chat.export.user": "\u7528\u6237",
    "pactor.chat.export.assistant": "\u52A9\u624B",
    "pactor.chat.export.system": "\u7CFB\u7EDF",
    "pactor.chat.activity.thinking": "\u6B63\u5728\u601D\u8003\u2026",
    "pactor.chat.activity.tool": "\u6B63\u5728\u8C03\u7528\u5DE5\u5177\u2026",
    "pactor.chat.activity.generating": "\u6B63\u5728\u751F\u6210\u56DE\u590D\u2026",
    "pactor.chat.activity.responding": "\u6B63\u5728\u54CD\u5E94\u2026",
    "pactor.chat.activity.error": "\u51FA\u9519\u4E86",
    "pactor.chat.activity.stopped": "\u5DF2\u505C\u6B62",
    "pactor.chat.activity.done": "\u5DF2\u5B8C\u6210",
    "pactor.chat.activity.doneWithTools": "\u5DF2\u5B8C\u6210 \xB7 {{count}} \u4E2A\u5DE5\u5177\u8C03\u7528",
    "pactor.chat.activity.noReturn": "\uFF08\u65E0\u8FD4\u56DE\uFF09",
    "pactor.chat.activity.failed": "\u6267\u884C\u5931\u8D25",
    "pactor.chat.activity.thinkingProcess": "\u601D\u8003\u8FC7\u7A0B",
    "pactor.chat.view.backToBottom": "\u56DE\u5230\u5E95\u90E8",
    "pactor.chat.part.denied": "\u8BE5\u7EC4\u4EF6\u4E0D\u5141\u8BB8\u5728 Chat \u4E2D\u4F7F\u7528\uFF1A{{type}}",
    "pactor.chat.part.deniedNoType": "\u8BE5\u7EC4\u4EF6\u4E0D\u5141\u8BB8\u5728 Chat \u4E2D\u4F7F\u7528",
    "pactor.chat.part.renderUnavailable": "DSL \u6E32\u67D3\u4E0D\u53EF\u7528\uFF08\u672A\u6CE8\u5165 Safe Registry\uFF09",
    "pactor.chat.part.generating": "\u5185\u5BB9\u751F\u6210\u4E2D\u2026",
    "pactor.chat.header.exportMarkdown": "\u5BFC\u51FA Markdown",
    "pactor.chat.header.clear": "\u6E05\u7A7A\u4F1A\u8BDD",
    "pactor.chat.header.editTitle": "\u7F16\u8F91\u6807\u9898",
    "pactor.chat.header.clickToEditTitle": "\u70B9\u51FB\u7F16\u8F91\u6807\u9898",
    "pactor.chat.panel.close": "\u5173\u95ED\u9762\u677F"
};
// src/context/locales/index.ts
var defaultMessages = {
    "zh-CN": zhCN,
    "en-US": enUS
};
// src/context/i18n-context.ts
var I18nReactContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
var I18nContextProvider = I18nReactContext.Provider;
function createDefaultI18n(locale) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createI18nContext"])({
        locale,
        messages: defaultMessages
    });
}
var defaultI18n = createDefaultI18n();
function useI18n() {
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(I18nReactContext);
    if (value === null) {
        return defaultI18n;
    }
    const fallback = createDefaultI18n(value.locale);
    return {
        ...value,
        t: (key, params)=>{
            const translated = value.t(key, params);
            return translated === key ? fallback.t(key, params) : translated;
        }
    };
}
// src/action/builtins.ts
function registerBuiltinActions(registry) {
    const register = (name, handler)=>{
        if (!registry.has(name)) {
            registry.register(name, handler);
        }
    };
    register("setState", (action, ctx)=>{
        ctx.context.state.set(action.params ?? {});
        return {
            ok: true
        };
    });
    register("resetState", (_action, ctx)=>{
        ctx.context.state.reset();
        return {
            ok: true
        };
    });
    register("reload", async (action, ctx)=>{
        const target = action.params?.["dataSource"];
        await ctx.context.data.reload(typeof target === "string" ? target : void 0);
        return {
            ok: true
        };
    });
    register("delay", async (action)=>{
        const raw = Number(action.params?.["ms"] ?? 300);
        await new Promise((resolve)=>setTimeout(resolve, Number.isFinite(raw) ? raw : 300));
        return {
            ok: true
        };
    });
    register("request", async (action, ctx)=>{
        const params = action.params ?? {};
        const { target, method, url, headers, body } = params;
        if (typeof url !== "string" || !url) {
            return {
                ok: false,
                error: new Error("[@pactor-app/runtime] request \u52A8\u4F5C\u7F3A\u5C11 url \u53C2\u6570")
            };
        }
        try {
            const data = await ctx.context.http.request({
                method: typeof method === "string" ? method : void 0,
                url,
                params: isRecord(params["params"]) ? params["params"] : void 0,
                headers: isStringRecord(headers) ? headers : void 0,
                body
            });
            if (typeof target === "string" && target) {
                const path = target.startsWith("state.") ? target.slice(6) : target;
                ctx.context.state.set(path, data);
            }
            return {
                ok: true,
                data
            };
        } catch (cause) {
            return {
                ok: false,
                error: cause instanceof Error ? cause : new Error(String(cause))
            };
        }
    });
    register("service.call", async (action, ctx)=>{
        const name = action.params?.["service"];
        if (typeof name !== "string" || name === "") {
            return {
                ok: false,
                error: new Error("[@pactor-app/runtime] service.call \u7F3A\u5C11 params.service")
            };
        }
        const handler = ctx.context.services.get(name);
        if (!handler) {
            return {
                ok: false,
                error: new Error(`[@pactor-app/runtime] service \u672A\u6CE8\u518C: ${name}`)
            };
        }
        try {
            const callParams = action.params?.["params"];
            const data = await handler(isRecord(callParams) ? callParams : {});
            return {
                ok: true,
                data
            };
        } catch (cause) {
            return {
                ok: false,
                error: cause instanceof Error ? cause : new Error(String(cause))
            };
        }
    });
    register("sequence", async (action, ctx)=>{
        for (const child of asActions(action.params?.["actions"])){
            const result = await ctx.execute(child);
            if (!result.ok) {
                return result;
            }
        }
        return {
            ok: true
        };
    });
    register("call", async (action, ctx)=>{
        const name = action.params?.["name"];
        if (typeof name !== "string" || !name) {
            return {
                ok: false,
                error: new Error("[@pactor-app/runtime] call \u52A8\u4F5C\u7F3A\u5C11 name \u53C2\u6570")
            };
        }
        const target = ctx.context.namedActions[name];
        if (target === void 0) {
            return {
                ok: false,
                error: new Error(`[@pactor-app/runtime] unknown named action: "${name}"`)
            };
        }
        const depth = (callDepth.get(ctx.context) ?? 0) + 1;
        if (depth > MAX_CALL_DEPTH) {
            return {
                ok: false,
                error: new Error(`[@pactor-app/runtime] call \u5D4C\u5957\u8D85\u8FC7 ${MAX_CALL_DEPTH} \u5C42\uFF08\u7591\u4F3C\u5FAA\u73AF\u5F15\u7528\uFF09: "${name}"`)
            };
        }
        callDepth.set(ctx.context, depth);
        try {
            for (const child of asActions(target)){
                const result = await ctx.execute(child);
                if (!result.ok) {
                    return result;
                }
            }
            return {
                ok: true
            };
        } finally{
            callDepth.set(ctx.context, depth - 1);
        }
    });
    register("parallel", async (action, ctx)=>{
        const results = await Promise.all(asActions(action.params?.["actions"]).map((child)=>ctx.execute(child)));
        const failed = results.find((result)=>!result.ok);
        return failed ?? {
            ok: true,
            data: results
        };
    });
    register("if", async (action, ctx)=>{
        const branch = action.params?.["condition"] ? action.params?.["then"] : action.params?.["else"];
        for (const child of asActions(branch)){
            const result = await ctx.execute(child);
            if (!result.ok) {
                return result;
            }
        }
        return {
            ok: true
        };
    });
    register("delay", (action)=>new Promise((resolve)=>{
            const ms = Number(action.params?.["ms"] ?? 0);
            setTimeout(()=>resolve({
                    ok: true
                }), Number.isFinite(ms) ? ms : 0);
        }));
    register("form.setValues", (action, ctx)=>{
        const formName = action.params?.["form"];
        const name = typeof formName === "string" && formName !== "" ? formName : "default";
        const handle = ctx.context.forms.get(name);
        if (!handle) {
            return {
                ok: false,
                error: new Error(`[@pactor-app/runtime] form.setValues \u76EE\u6807\u8868\u5355\u672A\u6CE8\u518C: "${name}"`)
            };
        }
        const values = action.params?.["values"];
        if (!isRecord(values)) {
            return {
                ok: false,
                error: new Error("[@pactor-app/runtime] form.setValues \u7F3A\u5C11 params.values\uFF08object\uFF09")
            };
        }
        handle.setValues(values);
        return {
            ok: true
        };
    });
    register("form.submit", (action, ctx)=>{
        const formName = action.params?.["form"];
        const name = typeof formName === "string" && formName !== "" ? formName : "default";
        const handle = ctx.context.forms.get(name);
        if (!handle) {
            return {
                ok: false,
                error: new Error(`[@pactor-app/runtime] form.submit \u76EE\u6807\u8868\u5355\u672A\u6CE8\u518C: "${name}"`)
            };
        }
        if (typeof handle.submit !== "function") {
            return {
                ok: false,
                error: new Error(`[@pactor-app/runtime] form.submit \u76EE\u6807\u8868\u5355\u4E0D\u652F\u6301\u63D0\u4EA4: "${name}"`)
            };
        }
        handle.submit();
        return {
            ok: true
        };
    });
}
function asActions(value) {
    if (Array.isArray(value)) {
        return value;
    }
    if (isRecord(value) && typeof value["action"] === "string") {
        return [
            value
        ];
    }
    return [];
}
var callDepth = /* @__PURE__ */ new WeakMap();
var MAX_CALL_DEPTH = 20;
function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isStringRecord(value) {
    return isRecord(value) && Object.values(value).every((v)=>typeof v === "string");
}
;
var ActionEngine = class {
    constructor(context){
        this.context = context;
    }
    async execute(action, localScope) {
        const scope = buildScope(this.context, localScope);
        let result;
        try {
            if (action.condition !== void 0) {
                const expression = typeof action.condition === "string" ? action.condition : action.condition.expression;
                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$expression$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveTemplate"])(expression, scope)) {
                    result = {
                        ok: true,
                        skipped: true
                    };
                    this.recordNamedResult(action, result);
                    return result;
                }
            }
            if (action.permission !== void 0 && !this.context.permission.check(action.permission)) {
                result = {
                    ok: false,
                    error: new Error(`[@pactor-app/runtime] permission denied for action "${action.action}"`)
                };
                this.recordNamedResult(action, result);
                return result;
            }
            const handler = this.context.actions.get(action.action);
            if (!handler) {
                result = {
                    ok: false,
                    error: new Error(`[@pactor-app/runtime] action not registered: "${action.action}"`)
                };
                this.recordNamedResult(action, result);
                return result;
            }
            const resolvedAction = {
                ...action,
                // 内嵌的子动作配置（sequence/parallel/if 的 actions/then/else）
                // 与内嵌的 DslNode 子树（overlay.open 的 content 等，约定同
                // Renderer 的 resolveProps）保持原样，由各自执行/渲染时
                // 按当时的 state 与作用域求值
                params: resolveDeep(action.params ?? {}, scope, {
                    localizationMode: this.context.localizationMode,
                    isOpaque: (value)=>typeof value["action"] === "string" || typeof value["type"] === "string" || typeof value["component"] === "string"
                })
            };
            const ctx = {
                context: this.context,
                scope,
                // 子动作继承局部作用域（而非作用域快照），保证 state 始终取当前值
                execute: (child)=>this.execute(child, localScope)
            };
            result = await handler(resolvedAction, ctx);
        } catch (cause) {
            result = {
                ok: false,
                error: toError(cause)
            };
        }
        this.recordNamedResult(action, result);
        return result;
    }
    /** 命名动作结果落盘：成功 → data；失败 → `{ ok: false, error }` */ recordNamedResult(action, result) {
        if (action.id === void 0) {
            return;
        }
        this.context.actionResults[action.id] = result.ok ? result.data : {
            ok: false,
            error: result.error
        };
    }
    /** 事件动作数组按声明顺序串行执行 */ async executeAll(actions, localScope) {
        const list = Array.isArray(actions) ? actions : [
            actions
        ];
        const results = [];
        for (const action of list){
            results.push(await this.execute(action, localScope));
        }
        return results;
    }
};
;
;
;
;
;
;
;
function DslSourceBoundary({ context, sourceRef, placeholder, children }) {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        status: "loading"
    });
    const key = dslSourceKey(sourceRef);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        let registeredSources = [];
        setState({
            status: "loading"
        });
        context.dslSources.resolve(sourceRef).then((content)=>{
            if (cancelled) {
                return;
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDslFragmentPayload"])(content)) {
                if (content.state) {
                    context.state.set(content.state);
                }
                if (content.dataSources) {
                    registeredSources = context.data.registerAll(content.dataSources);
                    for (const name of registeredSources){
                        if (content.dataSources[name]?.autoLoad === true) {
                            context.data.load(name).catch((cause)=>{
                                console.warn(`[@pactor-app/runtime] \u7247\u6BB5\u6570\u636E\u6E90 "${name}" \u52A0\u8F7D\u5931\u8D25`, cause);
                            });
                        }
                    }
                }
            }
            setState({
                status: "ready",
                content
            });
        }, (cause)=>{
            if (!cancelled) {
                console.warn("[@pactor-app/runtime] DSL \u52A8\u6001\u5F15\u7528\u89E3\u6790\u5931\u8D25", cause);
                setState({
                    status: "error"
                });
            }
        });
        return ()=>{
            cancelled = true;
            for (const name of registeredSources){
                context.data.unregister(name);
            }
        };
    }, [
        context,
        key
    ]);
    if (state.status === "ready") {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children(state.content)
        });
    }
    if (state.status === "error") {
        return null;
    }
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: placeholder ?? null
    });
}
;
var RendererReactContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
var RendererContextProvider = RendererReactContext.Provider;
function useRenderer() {
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(RendererReactContext);
    if (!value) {
        throw new Error("[@pactor-app/runtime] useRenderer \u5FC5\u987B\u5728 <DslRenderer> \u5185\u4F7F\u7528");
    }
    return value;
}
function useRuntimeState(path) {
    const { context } = useRenderer();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])((onChange)=>context.state.subscribe(onChange), ()=>path === void 0 ? context.state.getState() : context.state.get(path));
}
function useDataSource(name) {
    const { context } = useRenderer();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])((onChange)=>context.data.subscribe(onChange), ()=>context.data.get(name));
}
;
function UnsupportedComponent({ type }) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
        "data-pactor-unsupported": type,
        style: {
            border: "1px dashed #d97706",
            borderRadius: 4,
            padding: 8,
            color: "#b45309",
            fontSize: 12
        },
        children: [
            "Unsupported component: ",
            type
        ]
    });
}
;
function DslRenderer({ context, node, engine, children }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])((onChange)=>{
        const offState = context.state.subscribe(onChange);
        const offData = context.data.subscribe(onChange);
        return ()=>{
            offState();
            offData();
        };
    }, ()=>`${context.state.getVersion()}:${context.data.getVersion()}`);
    const resolvedEngine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>engine ?? new ActionEngine(context), [
        engine,
        context
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const root = {
            context,
            engine: resolvedEngine,
            scope: {},
            referenceStack: [],
            renderChildren: (children2, extraScope)=>renderChildrenOf(root, children2, extraScope)
        };
        return root;
    }, [
        context,
        resolvedEngine
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(RendererContextProvider, {
        value,
        children: [
            node ? renderNode(node, value, node.id ?? "root") : null,
            children
        ]
    });
}
function renderNode(node, value, key) {
    const scope = buildScope(value.context, value.scope);
    if (node.component !== void 0) {
        const name = node.component;
        const stack = value.referenceStack ?? [];
        if (stack.includes(name)) {
            console.warn(`[@pactor-app/runtime] \u7EC4\u4EF6\u5F15\u7528\u5FAA\u73AF\uFF1A${[
                ...stack,
                name
            ].join(" \u2192 ")}`);
            return null;
        }
        const subtree = value.context.pageComponents[name];
        if (!subtree) {
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(UnsupportedComponent, {
                type: `component(${name})`
            }, key);
        }
        const scoped = {
            ...value,
            referenceStack: [
                ...stack,
                name
            ]
        };
        scoped.renderChildren = (children, extraScope)=>renderChildrenOf(scoped, children, extraScope);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDslSourceRef"])(subtree)) {
            const ref = subtree;
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(RendererContextProvider, {
                value: scoped,
                children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(DslSourceBoundary, {
                    context: value.context,
                    sourceRef: ref,
                    placeholder: ref.placeholder ? renderNode(ref.placeholder, scoped, "placeholder") : null,
                    children: (content)=>{
                        const resolved = validateResolvedNode(content, `components.${name}`);
                        if (!resolved) {
                            return null;
                        }
                        return renderNode(mergeReferenceNode(resolved, node), scoped, key);
                    }
                })
            }, key);
        }
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(RendererContextProvider, {
            value: scoped,
            children: renderNode(mergeReferenceNode(subtree, node), scoped, key)
        }, key);
    }
    if (node.when !== void 0) {
        const expression = typeof node.when === "string" ? node.when : node.when.expression;
        let visible;
        try {
            visible = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$expression$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveTemplate"])(expression, scope);
        } catch (cause) {
            console.warn(`[@pactor-app/runtime] when \u8868\u8FBE\u5F0F\u6C42\u503C\u5931\u8D25\uFF08\u8282\u70B9 "${node.type}"\uFF09`, cause);
            visible = false;
        }
        if (!visible) {
            return null;
        }
    }
    let deniedStrategy;
    if (node.permission !== void 0 && !value.context.permission.check(node.permission)) {
        deniedStrategy = resolveDeniedStrategy(node.permission);
        if (deniedStrategy === "hidden") {
            return null;
        }
    }
    const entry = value.context.components.get(node.type);
    const normalized = normalizeEntry(entry);
    if (!normalized) {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(UnsupportedComponent, {
            type: node.type
        }, key);
    }
    const props = resolveProps(node.props, scope, value.context.localizationMode);
    if (node.events) {
        for (const [name, actions] of Object.entries(node.events)){
            props[name] = (event)=>{
                void value.engine.executeAll(actions, {
                    ...value.scope,
                    event
                });
            };
        }
    }
    if (deniedStrategy === "disabled") {
        props["disabled"] = true;
    } else if (deniedStrategy === "readonly") {
        props["readOnly"] = true;
    }
    if (normalized.withScope) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"])(normalized.component, {
            key,
            ...props,
            dslChildren: node.children
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"])(normalized.component, {
        key,
        ...props
    }, renderChildrenOf(value, node.children));
}
function resolveDeniedStrategy(permission) {
    if (typeof permission === "object" && !Array.isArray(permission)) {
        return permission.denied ?? "hidden";
    }
    return "hidden";
}
function mergeReferenceNode(definition, reference) {
    return {
        ...definition,
        props: {
            ...definition.props,
            ...reference.props
        },
        events: {
            ...definition.events,
            ...reference.events
        },
        when: reference.when ?? definition.when,
        permission: reference.permission ?? definition.permission,
        id: reference.id ?? definition.id
    };
}
function validateResolvedNode(content, label) {
    const errors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateDslNode"])(content);
    if (errors.length > 0) {
        console.warn(`[@pactor-app/runtime] \u52A8\u6001\u5F15\u7528\uFF08${label}\uFF09\u8FD4\u56DE\u5185\u5BB9\u672A\u901A\u8FC7\u6821\u9A8C`, errors);
        return null;
    }
    return content;
}
function validateResolvedNodes(content, label) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDslFragmentPayload"])(content)) {
        const errors2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateDslFragmentPayload"])(content);
        if (errors2.length > 0) {
            console.warn(`[@pactor-app/runtime] \u52A8\u6001\u5F15\u7528\uFF08${label}\uFF09\u8FD4\u56DE\u7684\u7247\u6BB5\u8F7D\u8377\u672A\u901A\u8FC7\u6821\u9A8C`, errors2);
            return null;
        }
        return content.children;
    }
    const errors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateDslNodes"])(content);
    if (errors.length > 0) {
        console.warn(`[@pactor-app/runtime] \u52A8\u6001\u5F15\u7528\uFF08${label}\uFF09\u8FD4\u56DE\u5185\u5BB9\u672A\u901A\u8FC7\u6821\u9A8C`, errors);
        return null;
    }
    return content;
}
function renderChildItem(value, item, key) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDslSourceRef"])(item)) {
        const ref = item;
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(DslSourceBoundary, {
            context: value.context,
            sourceRef: ref,
            placeholder: ref.placeholder ? renderNode(ref.placeholder, value, "placeholder") : null,
            children: (content)=>{
                const nodes = validateResolvedNodes(content, "children");
                if (!nodes) {
                    return null;
                }
                return nodes.map((child, index)=>renderChildItem(value, child, (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDslSourceRef"])(child) ? `ref-${index}` : child.id ?? index));
            }
        }, key);
    }
    return renderNode(item, value, key);
}
function renderChildrenOf(value, children, extraScope) {
    if (!children || Array.isArray(children) && children.length === 0) {
        return null;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDslSourceRef"])(children)) {
        const ref = children;
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(DslSourceBoundary, {
            context: value.context,
            sourceRef: ref,
            placeholder: ref.placeholder ? renderNode(ref.placeholder, value, "placeholder") : null,
            children: (content)=>{
                const nodes = validateResolvedNodes(content, "children");
                if (!nodes) {
                    return null;
                }
                return nodes.map((child, index)=>renderChildItem(value, child, (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDslSourceRef"])(child) ? `ref-${index}` : child.id ?? index));
            }
        }, "dsl-source");
    }
    const itemKey = (child, index)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDslSourceRef"])(child) ? `ref-${index}` : child.id ?? index;
    if (!extraScope) {
        return children.map((child, index)=>renderChildItem(value, child, itemKey(child, index)));
    }
    const scoped = {
        context: value.context,
        engine: value.engine,
        scope: {
            ...value.scope,
            ...extraScope
        },
        referenceStack: value.referenceStack,
        renderChildren: (nested, nestedScope)=>renderChildrenOf(scoped, nested, nestedScope)
    };
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(RendererContextProvider, {
        value: scoped,
        children: children.map((child, index)=>renderChildItem(scoped, child, itemKey(child, index)))
    });
}
function normalizeEntry(entry) {
    if (!entry) {
        return void 0;
    }
    if (typeof entry === "object" && "component" in entry) {
        return entry;
    }
    return {
        component: entry
    };
}
function resolveProps(props, scope, localizationMode) {
    if (!props) {
        return {};
    }
    const out = {};
    for (const [key, value] of Object.entries(props)){
        out[key] = typeof value === "string" && key.startsWith("on") ? value : resolveDeep(value, scope, {
            isOpaque: isEmbeddedDslNode,
            localizationMode
        });
    }
    return out;
}
function isEmbeddedDslNode(value) {
    return typeof value.type === "string" || typeof value.component === "string";
}
;
;
;
// package.json
var version = "1.61.0";
// src/version.ts
var RUNTIME_VERSION = version;
;
var PageRuntimeError = class extends Error {
    constructor(errors){
        super(`Page DSL \u6821\u9A8C\u5931\u8D25\uFF08${errors.length} \u4E2A\u9519\u8BEF\uFF09\uFF1A${errors.map((error)=>`${error.path}: ${error.message}`).join("\uFF1B")}`);
        this.name = "PageRuntimeError";
        this.errors = errors;
    }
};
var PageRuntimeVersionError = class extends PageRuntimeError {
    constructor(requirement, runtimeVersion, message){
        super([
            {
                path: "/requires/runtime",
                keyword: "version",
                message
            }
        ]);
        this.name = "PageRuntimeVersionError";
        this.requirement = requirement;
        this.runtimeVersion = runtimeVersion;
    }
};
function assertRuntimeVersion(pageDsl) {
    const requirement = pageDsl?.requires?.runtime;
    if (typeof requirement !== "string") {
        return;
    }
    const pageId = pageDsl?.page?.id;
    const label = pageId === void 0 ? "\u9875\u9762" : `\u9875\u9762\uFF08${pageId}\uFF09`;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$semver$40$7$2e$8$2e$5$2f$node_modules$2f$semver$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validRange"])(requirement) === null) {
        throw new PageRuntimeVersionError(requirement, RUNTIME_VERSION, `${label}\u7684 requires.runtime \u4E0D\u662F\u5408\u6CD5\u7684\u7248\u672C\u8303\u56F4\uFF1A"${requirement}"`);
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$semver$40$7$2e$8$2e$5$2f$node_modules$2f$semver$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["satisfies"])(RUNTIME_VERSION, requirement)) {
        throw new PageRuntimeVersionError(requirement, RUNTIME_VERSION, `${label}\u8981\u6C42 Runtime ${requirement}\uFF0C\u5F53\u524D Runtime \u7248\u672C\u4E3A ${RUNTIME_VERSION}`);
    }
}
function createPageRuntime(pageDsl, options = {}) {
    assertRuntimeVersion(pageDsl);
    const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validatePageDsl"])(pageDsl);
    if (!validation.valid) {
        throw new PageRuntimeError(validation.errors);
    }
    const context = createRuntimeContext({
        ...options,
        page: pageDsl.page,
        state: pageDsl.state ?? options.state,
        dataSources: pageDsl.dataSources ?? options.dataSources,
        namedActions: pageDsl.actions ?? options.namedActions,
        pageComponents: pageDsl.components ?? options.pageComponents
    });
    registerBuiltinActions(context.actions);
    const engine = new ActionEngine(context);
    let destroyed = false;
    const lifecycleListeners = /* @__PURE__ */ new Set();
    const runLifecycle = async (name)=>{
        for (const listener of [
            ...lifecycleListeners
        ]){
            listener(name);
        }
        const actions = pageDsl.lifecycle?.[name];
        if (actions) {
            await engine.executeAll(actions);
        }
    };
    const initialized = Promise.resolve().then(async ()=>{
        const loading = context.data.init();
        await runLifecycle("onInit");
        await loading;
        await runLifecycle("onLoad");
    });
    const triggerWhenAlive = async (name)=>{
        if (destroyed) {
            return;
        }
        await runLifecycle(name);
    };
    return {
        pageDsl,
        context,
        engine,
        initialized,
        get destroyed () {
            return destroyed;
        },
        render () {
            return renderRoots(pageDsl, context, engine);
        },
        ready: ()=>triggerWhenAlive("onReady"),
        show: ()=>triggerWhenAlive("onShow"),
        hide: ()=>triggerWhenAlive("onHide"),
        async destroy () {
            if (destroyed) {
                return;
            }
            destroyed = true;
            await runLifecycle("onDestroy");
            lifecycleListeners.clear();
            for (const key of Object.keys(context.actionResults)){
                delete context.actionResults[key];
            }
        },
        onLifecycle (listener) {
            lifecycleListeners.add(listener);
            return ()=>{
                lifecycleListeners.delete(listener);
            };
        }
    };
}
function PageRuntimeView({ runtime, children }) {
    return renderRoots(runtime.pageDsl, runtime.context, runtime.engine, children);
}
function renderRoots(pageDsl, context, engine, children) {
    if (!pageDsl.body && (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDslSourceRef"])(pageDsl.children)) {
        const ref = pageDsl.children;
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(DslSourceBoundary, {
            context,
            sourceRef: ref,
            placeholder: ref.placeholder ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(DslRenderer, {
                context,
                node: ref.placeholder,
                engine
            }) : null,
            children: (content)=>renderResolvedRoots(content, context, engine, children)
        });
    }
    const roots = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveRootNodes"])(pageDsl);
    if (roots.length === 0) {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children ?? null
        });
    }
    return renderRootItems(roots, context, engine, children);
}
function renderResolvedRoots(content, context, engine, children) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDslFragmentPayload"])(content)) {
        const fragmentErrors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateDslFragmentPayload"])(content);
        if (fragmentErrors.length > 0) {
            console.warn("[@pactor-app/runtime] \u6839\u7EA7 children \u52A8\u6001\u5F15\u7528\u8FD4\u56DE\u7684\u7247\u6BB5\u8F7D\u8377\u672A\u901A\u8FC7\u6821\u9A8C", fragmentErrors);
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: children ?? null
            });
        }
        return renderRootItems(content.children, context, engine, children);
    }
    const errors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateDslNodes"])(content);
    if (errors.length > 0) {
        console.warn("[@pactor-app/runtime] \u6839\u7EA7 children \u52A8\u6001\u5F15\u7528\u8FD4\u56DE\u5185\u5BB9\u672A\u901A\u8FC7\u6821\u9A8C", errors);
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children ?? null
        });
    }
    return renderRootItems(content, context, engine, children);
}
function renderRootItems(items, context, engine, children) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: items.map((item, index)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDslSourceRef"])(item) ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(DslSourceBoundary, {
                context,
                sourceRef: item,
                placeholder: item.placeholder ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(DslRenderer, {
                    context,
                    node: item.placeholder,
                    engine
                }) : null,
                children: (content)=>renderResolvedRoots(content, context, engine, children)
            }, dslSourceKey(item)) : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(DslRenderer, {
                context,
                node: item,
                engine,
                children: index === items.length - 1 ? children : null
            }, item.id ?? index))
    });
}
;
}),
"[project]/packages/schema/dist/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ACTION_CONFIG_SCHEMA_ID",
    ()=>ACTION_CONFIG_SCHEMA_ID,
    "AUTHOR_PAGE_DSL_SCHEMA_ID",
    ()=>AUTHOR_PAGE_DSL_SCHEMA_ID,
    "DSL_FRAGMENT_PAYLOAD_SCHEMA_ID",
    ()=>DSL_FRAGMENT_PAYLOAD_SCHEMA_ID,
    "DSL_NODE_SCHEMA_ID",
    ()=>DSL_NODE_SCHEMA_ID,
    "DSL_SOURCE_REF_SCHEMA_ID",
    ()=>DSL_SOURCE_REF_SCHEMA_ID,
    "DSL_VERSION",
    ()=>DSL_VERSION,
    "I18N_VALUE_DESCRIPTOR_SCHEMA_ID",
    ()=>I18N_VALUE_DESCRIPTOR_SCHEMA_ID,
    "LOCALIZED_PAGE_DSL_SCHEMA_ID",
    ()=>LOCALIZED_PAGE_DSL_SCHEMA_ID,
    "LOCALIZED_TEXT_SCHEMA_ID",
    ()=>LOCALIZED_TEXT_SCHEMA_ID,
    "PAGE_DSL_SCHEMA_ID",
    ()=>PAGE_DSL_SCHEMA_ID,
    "actionConfigSchema",
    ()=>actionConfigSchema,
    "authorPageDslSchema",
    ()=>authorPageDslSchema,
    "dslFragmentPayloadSchema",
    ()=>dslFragmentPayloadSchema,
    "dslNodeSchema",
    ()=>dslNodeSchema,
    "dslSourceRefSchema",
    ()=>dslSourceRefSchema,
    "i18nValueDescriptorSchema",
    ()=>i18nValueDescriptorSchema,
    "localizedPageDslSchema",
    ()=>localizedPageDslSchema,
    "localizedTextSchema",
    ()=>localizedTextSchema,
    "pageDslSchema",
    ()=>pageDslSchema,
    "pageI18nSchema",
    ()=>pageI18nSchema,
    "validateAuthorPageDsl",
    ()=>validateAuthorPageDsl,
    "validateDslFragmentPayload",
    ()=>validateDslFragmentPayload,
    "validateDslNode",
    ()=>validateDslNode,
    "validateDslNodes",
    ()=>validateDslNodes,
    "validateDslSourceRef",
    ()=>validateDslSourceRef,
    "validateLocalizedPageDsl",
    ()=>validateLocalizedPageDsl,
    "validatePageDsl",
    ()=>validatePageDsl
]);
// src/validate.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ajv$40$8$2e$20$2e$0$2f$node_modules$2f$ajv$2f$dist$2f$ajv$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/ajv@8.20.0/node_modules/ajv/dist/ajv.js [app-ssr] (ecmascript)");
// src/version.ts
var DSL_VERSION = "1.0";
// src/schemas/dsl-node.ts
var ACTION_CONFIG_SCHEMA_ID = "pactor:action-config";
var DSL_NODE_SCHEMA_ID = "pactor:dsl-node";
var permissionSchema = {
    anyOf: [
        {
            type: "string",
            minLength: 1
        },
        {
            type: "array",
            items: {
                type: "string",
                minLength: 1
            }
        },
        {
            type: "object",
            required: [
                "code"
            ],
            properties: {
                code: {
                    anyOf: [
                        {
                            type: "string",
                            minLength: 1
                        },
                        {
                            type: "array",
                            items: {
                                type: "string",
                                minLength: 1
                            }
                        }
                    ]
                },
                denied: {
                    enum: [
                        "hidden",
                        "disabled",
                        "readonly"
                    ]
                }
            },
            additionalProperties: false
        }
    ]
};
var conditionSchema = {
    anyOf: [
        {
            type: "string"
        },
        {
            type: "object",
            required: [
                "expression"
            ],
            properties: {
                expression: {
                    type: "string"
                }
            },
            additionalProperties: false
        }
    ]
};
var actionConfigSchema = {
    $id: ACTION_CONFIG_SCHEMA_ID,
    type: "object",
    required: [
        "action"
    ],
    properties: {
        id: {
            type: "string",
            minLength: 1
        },
        action: {
            type: "string",
            minLength: 1
        },
        params: {
            type: "object"
        },
        condition: conditionSchema,
        permission: permissionSchema
    },
    additionalProperties: false
};
var actionOrArraySchema = {
    anyOf: [
        {
            $ref: ACTION_CONFIG_SCHEMA_ID
        },
        {
            type: "array",
            items: {
                $ref: ACTION_CONFIG_SCHEMA_ID
            }
        }
    ]
};
var DSL_SOURCE_REF_SCHEMA_ID = "pactor:dsl-source-ref";
var dslSourceRefSchema = {
    $id: DSL_SOURCE_REF_SCHEMA_ID,
    type: "object",
    required: [
        "source"
    ],
    properties: {
        source: {
            anyOf: [
                {
                    type: "object",
                    required: [
                        "type",
                        "service"
                    ],
                    properties: {
                        type: {
                            const: "service"
                        },
                        service: {
                            type: "string",
                            minLength: 1
                        },
                        params: {
                            type: "object"
                        }
                    },
                    additionalProperties: false
                },
                {
                    type: "object",
                    required: [
                        "type",
                        "request"
                    ],
                    properties: {
                        type: {
                            const: "http"
                        },
                        request: {
                            type: "object",
                            required: [
                                "url"
                            ],
                            properties: {
                                method: {
                                    type: "string"
                                },
                                url: {
                                    type: "string",
                                    minLength: 1
                                },
                                params: {
                                    type: "object"
                                },
                                headers: {
                                    type: "object",
                                    additionalProperties: {
                                        type: "string"
                                    }
                                }
                            },
                            additionalProperties: false
                        }
                    },
                    additionalProperties: false
                }
            ]
        },
        placeholder: {
            $ref: DSL_NODE_SCHEMA_ID
        }
    },
    additionalProperties: false
};
var dslChildrenSchema = {
    anyOf: [
        {
            type: "array",
            items: {
                anyOf: [
                    {
                        $ref: DSL_NODE_SCHEMA_ID
                    },
                    {
                        $ref: DSL_SOURCE_REF_SCHEMA_ID
                    }
                ]
            }
        },
        {
            $ref: DSL_SOURCE_REF_SCHEMA_ID
        }
    ]
};
var dslNodeSchema = {
    $id: DSL_NODE_SCHEMA_ID,
    type: "object",
    anyOf: [
        {
            required: [
                "type"
            ]
        },
        {
            required: [
                "component"
            ]
        }
    ],
    properties: {
        id: {
            type: "string"
        },
        type: {
            type: "string",
            minLength: 1
        },
        /** 引用节点：页面级命名组件（PageDsl.components）的 key */ component: {
            type: "string",
            minLength: 1
        },
        props: {
            type: "object"
        },
        children: dslChildrenSchema,
        events: {
            type: "object",
            additionalProperties: actionOrArraySchema
        },
        permission: permissionSchema,
        when: conditionSchema
    },
    additionalProperties: false
};
// src/schemas/i18n.ts
var I18N_VALUE_DESCRIPTOR_SCHEMA_ID = "pactor:i18n-value-descriptor";
var LOCALIZED_TEXT_SCHEMA_ID = "pactor:localized-text";
var i18nTranslationDescriptorSchema = {
    type: "object",
    oneOf: [
        {
            required: [
                "key"
            ]
        },
        {
            required: [
                "messages"
            ]
        }
    ],
    properties: {
        /** 完整稳定键名（如 common.save），不解析表达式 */ key: {
            type: "string",
            minLength: 1
        },
        /** 内联多语言：locale → 文案，禁止嵌套 */ messages: {
            type: "object",
            additionalProperties: {
                type: "string"
            }
        },
        /** 参数对象（`{{name}}` 插值） */ params: {
            type: "object"
        },
        /** 词条回退失败后的兜底文案 */ fallback: {
            type: "string"
        }
    },
    additionalProperties: false
};
var i18nValueDescriptorSchema = {
    $id: I18N_VALUE_DESCRIPTOR_SCHEMA_ID,
    type: "object",
    required: [
        "$i18n"
    ],
    properties: {
        $i18n: i18nTranslationDescriptorSchema
    },
    additionalProperties: false
};
var pageI18nSchema = {
    type: "object",
    properties: {
        /** 语言包分组（namespace），不是 key 前缀 */ namespaces: {
            type: "array",
            items: {
                type: "string",
                minLength: 1
            }
        }
    },
    additionalProperties: false
};
var localizedTextSchema = {
    $id: LOCALIZED_TEXT_SCHEMA_ID,
    type: "object",
    required: [
        "$localizedText"
    ],
    properties: {
        $localizedText: {
            type: "object",
            required: [
                "template"
            ],
            properties: {
                template: {
                    type: "string"
                },
                params: {
                    type: "object"
                }
            },
            additionalProperties: false
        }
    },
    additionalProperties: false
};
// src/schemas/page-dsl.ts
var PAGE_DSL_SCHEMA_ID = "pactor:page-dsl";
var permissionSchema2 = {
    anyOf: [
        {
            type: "string",
            minLength: 1
        },
        {
            type: "array",
            items: {
                type: "string",
                minLength: 1
            }
        },
        {
            type: "object",
            required: [
                "code"
            ],
            properties: {
                code: {
                    anyOf: [
                        {
                            type: "string",
                            minLength: 1
                        },
                        {
                            type: "array",
                            items: {
                                type: "string",
                                minLength: 1
                            }
                        }
                    ]
                },
                denied: {
                    enum: [
                        "hidden",
                        "disabled",
                        "readonly"
                    ]
                }
            },
            additionalProperties: false
        }
    ]
};
var actionOrArraySchema2 = {
    anyOf: [
        {
            $ref: ACTION_CONFIG_SCHEMA_ID
        },
        {
            type: "array",
            items: {
                $ref: ACTION_CONFIG_SCHEMA_ID
            }
        }
    ]
};
var dataSourceSchema = {
    type: "object",
    required: [
        "type"
    ],
    properties: {
        type: {
            enum: [
                "http",
                "service",
                "static",
                "computed",
                "resource"
            ]
        },
        service: {
            type: "string",
            minLength: 1
        },
        autoLoad: {
            type: "boolean"
        },
        params: {
            type: "object"
        },
        /** 选项字段映射（该数据源用作选项源时声明） */ valueField: {
            type: "string",
            minLength: 1
        },
        labelField: {
            type: "string",
            minLength: 1
        },
        /** 选项禁用标记字段 */ disabledField: {
            type: "string",
            minLength: 1
        },
        request: {
            type: "object",
            required: [
                "url"
            ],
            properties: {
                method: {
                    type: "string"
                },
                url: {
                    type: "string",
                    minLength: 1
                },
                params: {
                    type: "object"
                },
                headers: {
                    type: "object",
                    additionalProperties: {
                        type: "string"
                    }
                },
                body: true
            },
            additionalProperties: false
        },
        pagination: {
            type: "object",
            properties: {
                page: true,
                pageSize: true
            },
            additionalProperties: false
        },
        value: true
    },
    additionalProperties: false
};
var pageDslSchema = {
    $id: PAGE_DSL_SCHEMA_ID,
    type: "object",
    required: [
        "dsl",
        "page"
    ],
    properties: {
        /** DSL Specification Version，如 "1.0" */ dsl: {
            type: "string",
            minLength: 1
        },
        requires: {
            type: "object",
            properties: {
                /** Runtime 版本范围（semver range 字符串），如 ">=1.0.0" */ runtime: {
                    type: "string",
                    minLength: 1
                },
                /** 组件 API 版本要求：组件名 → semver range 字符串 */ components: {
                    type: "object",
                    additionalProperties: {
                        type: "string",
                        minLength: 1
                    }
                }
            },
            additionalProperties: false
        },
        page: {
            type: "object",
            required: [
                "id"
            ],
            properties: {
                id: {
                    type: "string",
                    minLength: 1
                },
                title: {
                    type: "string"
                },
                /** 页面名称（标识用途） */ name: {
                    type: "string"
                },
                /** 页面描述 */ description: {
                    type: "string"
                },
                type: {
                    type: "string"
                },
                /** 页面权限分组（宿主按分组做页面访问校验与权限查看） */ grantGroup: {
                    type: "string"
                },
                /** 页面级扩展元数据（自由键值，Runtime 不消费） */ meta: {
                    type: "object"
                },
                permission: permissionSchema2
            },
            additionalProperties: false
        },
        /** 文档级扩展元数据（自由键值，如 version / author），Runtime 不消费 */ meta: {
            type: "object"
        },
        state: {
            type: "object"
        },
        dataSources: {
            type: "object",
            additionalProperties: dataSourceSchema
        },
        /** 页面级命名动作定义（供 call 动作按名引用复用） */ actions: {
            type: "object",
            additionalProperties: actionOrArraySchema2
        },
        /** 页面级命名组件定义（子树复用；值可为 DslSourceRef 远端惰性加载） */ components: {
            type: "object",
            additionalProperties: {
                anyOf: [
                    {
                        $ref: DSL_NODE_SCHEMA_ID
                    },
                    {
                        $ref: DSL_SOURCE_REF_SCHEMA_ID
                    }
                ]
            }
        },
        lifecycle: {
            type: "object",
            properties: {
                onInit: actionOrArraySchema2,
                onLoad: actionOrArraySchema2,
                onReady: actionOrArraySchema2,
                onShow: actionOrArraySchema2,
                onHide: actionOrArraySchema2,
                onDestroy: actionOrArraySchema2
            },
            additionalProperties: false
        },
        body: {
            $ref: DSL_NODE_SCHEMA_ID
        },
        /**
     * UI 树根（节点数组形态，或 DslSourceRef 动态引用）：`body` 缺失时作为替代，
     * 用于 DSL 描述页面局部（无需 Page 等包装节点）
     */ children: dslChildrenSchema
    },
    additionalProperties: false
};
var AUTHOR_PAGE_DSL_SCHEMA_ID = "pactor:author-page-dsl";
var authorPageDslSchema = {
    ...pageDslSchema,
    $id: AUTHOR_PAGE_DSL_SCHEMA_ID,
    properties: {
        ...pageDslSchema.properties,
        i18n: pageI18nSchema
    }
};
var LOCALIZED_PAGE_DSL_SCHEMA_ID = "pactor:localized-page-dsl";
var localizedPageDslSchema = {
    ...pageDslSchema,
    $id: LOCALIZED_PAGE_DSL_SCHEMA_ID
};
// src/schemas/dsl-fragment.ts
var DSL_FRAGMENT_PAYLOAD_SCHEMA_ID = "pactor:dsl-fragment-payload";
var dslFragmentPayloadSchema = {
    $id: DSL_FRAGMENT_PAYLOAD_SCHEMA_ID,
    type: "object",
    required: [
        "children"
    ],
    properties: {
        /** 子树声明（元素可为 DslNode 或 DslSourceRef 混排） */ children: dslChildrenSchema,
        /** 片段携带的数据源，渲染边界解析成功后运行时注册 */ dataSources: {
            type: "object",
            additionalProperties: dataSourceSchema
        },
        /** 片段携带的初始 state，解析成功后合并进页面 state */ state: {
            type: "object"
        }
    },
    additionalProperties: false
};
;
var ajv;
var codegenUnavailableWarned = false;
function isCodeGenerationError(error) {
    return error instanceof EvalError || error instanceof Error && /Code generation from strings/.test(error.message);
}
function getAjv() {
    if (ajv !== void 0) {
        return ajv;
    }
    try {
        const instance = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$ajv$40$8$2e$20$2e$0$2f$node_modules$2f$ajv$2f$dist$2f$ajv$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]({
            allErrors: true,
            strict: false
        });
        instance.addSchema(actionConfigSchema);
        instance.addSchema(dslSourceRefSchema);
        instance.addSchema(dslNodeSchema);
        instance.addSchema(pageDslSchema);
        instance.addSchema(authorPageDslSchema);
        instance.addSchema(localizedPageDslSchema);
        instance.addSchema(i18nValueDescriptorSchema);
        instance.addSchema(localizedTextSchema);
        instance.addSchema(dslFragmentPayloadSchema);
        ajv = instance;
    } catch (error) {
        if (isCodeGenerationError(error)) {
            warnCodegenUnavailable();
            ajv = null;
        } else {
            throw error;
        }
    }
    return ajv;
}
function warnCodegenUnavailable() {
    if (!codegenUnavailableWarned) {
        codegenUnavailableWarned = true;
        globalThis.console?.warn("[@pactor-app/schema] \u5F53\u524D\u8FD0\u884C\u65F6\u7981\u6B62\u4EE3\u7801\u751F\u6210\uFF08\u5982 Cloudflare Workers\uFF09\uFF0CDSL Schema \u6821\u9A8C\u5DF2\u8DF3\u8FC7");
    }
}
function getCompiledValidator(schemaId) {
    const instance = getAjv();
    if (!instance) {
        return void 0;
    }
    try {
        const validate = instance.getSchema(schemaId);
        if (!validate) {
            throw new Error(`schema not registered: ${schemaId}`);
        }
        return validate;
    } catch (error) {
        if (isCodeGenerationError(error)) {
            warnCodegenUnavailable();
            return void 0;
        }
        throw error;
    }
}
function toStructuredErrors(errors) {
    return errors.map((error)=>{
        let path = error.instancePath || "/";
        if (error.keyword === "required") {
            const missing = error.params.missingProperty;
            if (missing) {
                path = `${path === "/" ? "" : path}/${missing}`;
            }
        }
        return {
            path,
            message: error.message ?? "invalid",
            keyword: error.keyword
        };
    });
}
function validatePageDsl(document) {
    const validate = getCompiledValidator(PAGE_DSL_SCHEMA_ID);
    if (!validate) {
        return {
            valid: true,
            errors: [],
            warnings: collectWarnings(document)
        };
    }
    const valid = validate(document);
    return {
        valid,
        errors: valid ? [] : toStructuredErrors(validate.errors ?? []),
        warnings: collectWarnings(document)
    };
}
function walkDocument(value, path, visit) {
    if (!visit(value, path)) {
        return;
    }
    if (Array.isArray(value)) {
        value.forEach((item, index)=>walkDocument(item, `${path}/${index}`, visit));
        return;
    }
    if (typeof value === "object" && value !== null) {
        for (const [key, child] of Object.entries(value)){
            walkDocument(child, `${path}/${key}`, visit);
        }
    }
}
function atPath(path, errors) {
    return errors.map((error)=>({
            ...error,
            path: `${path}${error.path === "/" ? "" : error.path}`
        }));
}
function collectI18nDescriptorErrors(document) {
    const validate = getCompiledValidator(I18N_VALUE_DESCRIPTOR_SCHEMA_ID);
    if (!validate) {
        return [];
    }
    const errors = [];
    walkDocument(document, "", (value, path)=>{
        if (typeof value === "object" && value !== null && !Array.isArray(value) && "$i18n" in value) {
            if (!validate(value)) {
                errors.push(...atPath(path, toStructuredErrors(validate.errors ?? [])));
            }
            return false;
        }
        return true;
    });
    return errors;
}
function validateAuthorPageDsl(document) {
    const validate = getCompiledValidator(AUTHOR_PAGE_DSL_SCHEMA_ID);
    if (!validate) {
        return {
            valid: true,
            errors: [],
            warnings: collectWarnings(document)
        };
    }
    const valid = validate(document);
    const errors = [
        ...valid ? [] : toStructuredErrors(validate.errors ?? []),
        ...collectI18nDescriptorErrors(document)
    ];
    return {
        valid: errors.length === 0,
        errors,
        warnings: collectWarnings(document)
    };
}
function collectLocalizedResidualErrors(document) {
    const validateText = getCompiledValidator(LOCALIZED_TEXT_SCHEMA_ID);
    if (!validateText) {
        return [];
    }
    const errors = [];
    walkDocument(document, "", (value, path)=>{
        if (typeof value !== "object" || value === null || Array.isArray(value)) {
            return true;
        }
        if ("$i18n" in value) {
            errors.push({
                path,
                message: "\u4E0B\u53D1\u6001 DSL \u4E0D\u5141\u8BB8\u6B8B\u7559 $i18n \u7FFB\u8BD1\u63CF\u8FF0",
                keyword: "prohibited"
            });
            return false;
        }
        if ("$localizedText" in value) {
            if (!validateText(value)) {
                errors.push(...atPath(path, toStructuredErrors(validateText.errors ?? [])));
            }
            return false;
        }
        return true;
    });
    return errors;
}
function validateLocalizedPageDsl(document) {
    const validate = getCompiledValidator(LOCALIZED_PAGE_DSL_SCHEMA_ID);
    if (!validate) {
        return {
            valid: true,
            errors: [],
            warnings: collectWarnings(document)
        };
    }
    const valid = validate(document);
    const errors = [
        ...valid ? [] : toStructuredErrors(validate.errors ?? []),
        ...collectLocalizedResidualErrors(document)
    ];
    return {
        valid: errors.length === 0,
        errors,
        warnings: collectWarnings(document)
    };
}
function collectWarnings(document) {
    if (typeof document !== "object" || document === null) {
        return [];
    }
    const doc = document;
    if (doc.body !== void 0 && doc.children !== void 0) {
        return [
            {
                path: "/children",
                message: "body \u4E0E\u6839\u7EA7 children \u540C\u65F6\u58F0\u660E\uFF0Cchildren \u5C06\u88AB\u5FFD\u7565\uFF08body \u4F18\u5148\uFF09",
                keyword: "conflict"
            }
        ];
    }
    return [];
}
function validateDslNode(value) {
    const validate = getCompiledValidator(DSL_NODE_SCHEMA_ID);
    if (!validate) {
        return [];
    }
    const valid = validate(value);
    return valid ? [] : toStructuredErrors(validate.errors ?? []);
}
function validateDslSourceRef(value) {
    const validate = getCompiledValidator(DSL_SOURCE_REF_SCHEMA_ID);
    if (!validate) {
        return [];
    }
    const valid = validate(value);
    return valid ? [] : toStructuredErrors(validate.errors ?? []);
}
function validateDslFragmentPayload(value) {
    const validate = getCompiledValidator(DSL_FRAGMENT_PAYLOAD_SCHEMA_ID);
    if (!validate) {
        return [];
    }
    const valid = validate(value);
    return valid ? [] : toStructuredErrors(validate.errors ?? []);
}
function validateDslNodes(value) {
    if (!Array.isArray(value)) {
        return [
            {
                path: "/",
                message: "\u5FC5\u987B\u662F DslNode \u6570\u7EC4",
                keyword: "type"
            }
        ];
    }
    return value.flatMap((item, index)=>{
        const isRef = typeof item === "object" && item !== null && !Array.isArray(item) && "source" in item;
        const errors = isRef ? validateDslSourceRef(item) : validateDslNode(item);
        return errors.map((error)=>({
                ...error,
                path: `/${index}${error.path === "/" ? "" : error.path}`
            }));
    });
}
;
}),
];

//# sourceMappingURL=packages_1nptnva._.js.map