(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/packages/app/dist/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$FOBSAKNK$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/dist/chunk-FOBSAKNK.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$permission$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/permission/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$resource$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/resource/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/router/dist/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/runtime/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react-dom/client.js [app-client] (ecmascript)");
// src/app-shell.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/core/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$chunk$2d$JY7Z55CR$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/router/dist/chunk-JY7Z55CR.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/router/dist/react.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$router$40$7$2e$18$2e$2_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$62JRHF6Z$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-router@7.18.2_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/react-router/dist/development/chunk-62JRHF6Z.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$V5RS22V3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/dist/chunk-V5RS22V3.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$VGLBASGO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/dist/chunk-VGLBASGO.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$2OQU2IE6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/dist/chunk-2OQU2IE6.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature(), _s9 = __turbopack_context__.k.signature(), _s10 = __turbopack_context__.k.signature(), _s11 = __turbopack_context__.k.signature(), _s12 = __turbopack_context__.k.signature(), _s13 = __turbopack_context__.k.signature(), _s14 = __turbopack_context__.k.signature(), _s15 = __turbopack_context__.k.signature();
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
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useI18n"])();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
        className: "pactor-app-spin",
        style: {
            ...centerStyle,
            ...style
        },
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("svg", {
            width: "32",
            height: "32",
            viewBox: "0 0 32 32",
            role: "status",
            "aria-label": t("pactor.app.loading"),
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("circle", {
                cx: "16",
                cy: "16",
                r: "12",
                fill: "none",
                stroke: "#1677ff",
                strokeWidth: "3",
                strokeLinecap: "round",
                strokeDasharray: "56",
                strokeDashoffset: "28",
                children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("animateTransform", {
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
_s(BootstrapSpinner, "82N5KF9nLzZ6+2WH7KIjzIXRkLw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useI18n"]
    ];
});
_c = BootstrapSpinner;
function ResultView({ className, title, subTitle, extra }) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
        className,
        style: {
            ...centerStyle,
            padding: 24
        },
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])("div", {
            style: {
                textAlign: "center",
                maxWidth: 480
            },
            children: [
                /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                    style: {
                        fontSize: 24,
                        fontWeight: 600,
                        marginBottom: 8
                    },
                    children: title
                }),
                subTitle !== void 0 && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
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
_c1 = ResultView;
function PrimaryButton({ onClick, children }) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("button", {
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
_c2 = PrimaryButton;
;
;
;
;
;
var PageErrorBoundaryImpl = class extends __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Component"] {
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
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(ResultView, {
                className: "pactor-app-page-render-error",
                title: this.props.title,
                subTitle: error.message,
                extra: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(PrimaryButton, {
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
    _s1();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useI18n"])();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(PageErrorBoundaryImpl, {
        title: t("pactor.app.renderError"),
        retryLabel: t("pactor.page.retry"),
        children
    });
}
_s1(PageErrorBoundary, "i7XNAHLiMkaG0w9mPHbOCgTsuIM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useI18n"]
    ];
});
_c3 = PageErrorBoundary;
;
function DslPageLoader({ app, pageId, route }) {
    _s2();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useI18n"])();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        status: "loading"
    });
    const [retryTick, setRetryTick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DslPageLoader.useEffect": ()=>{
            let cancelled = false;
            let runtime = null;
            void ({
                "DslPageLoader.useEffect": async ()=>{
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
                }
            })["DslPageLoader.useEffect"]();
            return ({
                "DslPageLoader.useEffect": ()=>{
                    cancelled = true;
                    if (runtime !== null && !runtime.destroyed) {
                        void runtime.hide();
                        void runtime.destroy();
                    }
                }
            })["DslPageLoader.useEffect"];
        }
    }["DslPageLoader.useEffect"], [
        app,
        pageId,
        retryTick
    ]);
    if (state.status === "loading") {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
            className: "pactor-app-page-loading",
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(BootstrapSpinner, {
                style: {
                    minHeight: 0,
                    padding: 48
                }
            })
        });
    }
    if (state.status === "error") {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(ResultView, {
            className: "pactor-app-page-load-error",
            title: t("pactor.page.loadFailed"),
            subTitle: state.error.message,
            extra: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(PrimaryButton, {
                onClick: ()=>setRetryTick((n)=>n + 1),
                children: t("pactor.page.retry")
            })
        });
    }
    const OverlayHostView = app.interactionKit.OverlayHost;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(PageErrorBoundary, {
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageRuntimeView"], {
            runtime: state.runtime,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(OverlayHostView, {
                manager: app.overlayManager,
                resolvePage: app.resolvePage
            })
        })
    });
}
_s2(DslPageLoader, "S5fpifrQTYMeir7Tq3w2XisF5+c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useI18n"]
    ];
});
_c4 = DslPageLoader;
;
function Application({ app }) {
    _s3();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useI18n"])();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        status: "loading"
    });
    const [retryTick, setRetryTick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Application.useEffect2": ()=>{
            let cancelled = false;
            void app.loadSession().then({
                "Application.useEffect2": (session)=>{
                    if (!cancelled) {
                        setState({
                            status: "ready",
                            session
                        });
                    }
                }
            }["Application.useEffect2"], {
                "Application.useEffect2": (cause)=>{
                    if (!cancelled) {
                        setState({
                            status: "error",
                            error: cause instanceof Error ? cause : new Error(String(cause))
                        });
                    }
                }
            }["Application.useEffect2"]);
            return ({
                "Application.useEffect2": ()=>{
                    cancelled = true;
                }
            })["Application.useEffect2"];
        }
    }["Application.useEffect2"], [
        app,
        retryTick
    ]);
    if (state.status === "loading") {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
            className: "pactor-app-bootstrap-loading",
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(BootstrapSpinner, {})
        });
    }
    if (state.status === "error") {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(ResultView, {
            className: "pactor-app-bootstrap-error",
            title: t("pactor.app.startFailed"),
            subTitle: state.error.message,
            extra: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(PrimaryButton, {
                onClick: ()=>setRetryTick((n)=>n + 1),
                children: t("pactor.page.retry")
            })
        });
    }
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(AppShell, {
        app,
        session: state.session
    });
}
_s3(Application, "SI6mMKfJhrQw7CJ4XfaYOUx7L20=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useI18n"],
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]
    ];
});
_c5 = Application;
function AppShell({ app, session: initialSession }) {
    _s4();
    const liveSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(app.subscribeSession, app.getSession);
    const session = liveSession ?? initialSession;
    const Router = app.routerOptions.type === "hash" ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$router$40$7$2e$18$2e$2_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$62JRHF6Z$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HashRouter"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$router$40$7$2e$18$2e$2_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$62JRHF6Z$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BrowserRouter"];
    const InteractionKit = app.interactionKit.Provider;
    const Providers = app.providers;
    const i18n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createI18nContext"])({
        locale: session.locale,
        defaultLocale: session.defaultLocale,
        messages: session.messages
    });
    const shell = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I18nContextProvider"], {
        value: i18n,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(InteractionKit, {
            bridge: app.uiBridge,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(ShellLayout, {
                app,
                session
            })
        })
    });
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(Router, {
        basename: app.routerOptions.basename,
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(RouterBridgeSync, {
                binding: app.navigation
            }),
            Providers !== void 0 ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Providers, {
                children: shell
            }) : shell
        ]
    });
}
_s4(AppShell, "vlDng8tTH8kFZVZ7LPamPk8raqE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
_c6 = AppShell;
function RouterBridgeSync({ binding }) {
    _s5();
    const bridge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReactRouterBridge"])();
    const location = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$router$40$7$2e$18$2e$2_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$62JRHF6Z$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocation"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RouterBridgeSync.useEffect2": ()=>{
            binding.bind(bridge, {
                pathname: location.pathname,
                search: location.search
            });
        }
    }["RouterBridgeSync.useEffect2"], [
        bridge,
        binding
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RouterBridgeSync.useEffect2": ()=>{
            binding.sync({
                pathname: location.pathname,
                search: location.search
            });
        }
    }["RouterBridgeSync.useEffect2"], [
        binding,
        location.pathname,
        location.search
    ]);
    return null;
}
_s5(RouterBridgeSync, "KK2LuavASPMlwefOkdFG2PAOtdk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReactRouterBridge"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$router$40$7$2e$18$2e$2_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$62JRHF6Z$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"],
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]
    ];
});
_c7 = RouterBridgeSync;
function ShellLayout({ app, session }) {
    _s6();
    const location = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$router$40$7$2e$18$2e$2_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$62JRHF6Z$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocation"])();
    const route = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$chunk$2d$JY7Z55CR$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveRoute"])(session.menuRegistry, {
        pathname: location.pathname,
        search: location.search
    });
    const LayoutComponent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$FOBSAKNK$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveLayout"])(app.layoutRegistry, session.layoutType);
    const outlet = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$router$40$7$2e$18$2e$2_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$62JRHF6Z$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Routes"], {
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$router$40$7$2e$18$2e$2_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$62JRHF6Z$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Route"], {
            path: "*",
            element: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DynamicDslRoute"], {
                registry: session.menuRegistry,
                permissionChecker: app.permissionStore,
                fallback: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(NotFoundPage, {}),
                forbidden: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(ForbiddenPage, {}),
                render: ({ pageId, route: pageRoute })=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(DslPageLoader, {
                        app,
                        pageId,
                        route: pageRoute
                    }, pageLoaderKey(pageId, pageRoute, session.i18nVersion))
            })
        })
    });
    if (session.layoutType === "admin") {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(LayoutComponent, {
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
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(LayoutComponent, {
            brand: session.brand,
            registry: session.menuRegistry,
            bridge: app.navigation,
            route: route ?? void 0,
            permissionChecker: app.permissionStore,
            collapsible: session.layoutConfig.collapsible,
            children: outlet
        });
    }
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(LayoutComponent, {
        brand: session.brand,
        children: outlet
    });
}
_s6(ShellLayout, "pkHmaVRPskBaU4tMJuJJpV42k1I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$router$40$7$2e$18$2e$2_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$react$2d$router$2f$dist$2f$development$2f$chunk$2d$62JRHF6Z$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocation"]
    ];
});
_c8 = ShellLayout;
function pageLoaderKey(pageId, route, i18nVersion) {
    return `${pageId}|${i18nVersion}|${JSON.stringify(route.params)}|${JSON.stringify(route.query)}`;
}
function NotFoundPage() {
    _s7();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useI18n"])();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(ResultView, {
        className: "pactor-app-not-found",
        title: "404",
        subTitle: t("pactor.app.pageNotFound")
    });
}
_s7(NotFoundPage, "YB390gVmM2xrhkIRNqFv7IbCWQk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useI18n"]
    ];
});
_c9 = NotFoundPage;
function ForbiddenPage() {
    _s8();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useI18n"])();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(ResultView, {
        className: "pactor-app-forbidden",
        title: "403",
        subTitle: t("pactor.app.forbidden")
    });
}
_s8(ForbiddenPage, "YB390gVmM2xrhkIRNqFv7IbCWQk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useI18n"]
    ];
});
_c10 = ForbiddenPage;
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
    const base = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFetchHttpAdapter"])();
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
    const overlayManager = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$VGLBASGO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OverlayManager"]();
    const uiBridge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$VGLBASGO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createUiBridge"])();
    const interactionKit = options.interactionKit ?? {
        Provider: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$VGLBASGO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InteractionProvider"],
        OverlayHost: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$VGLBASGO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OverlayHost"]
    };
    const components = options.componentRegistry?.() ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$V5RS22V3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createComponentRegistry"])();
    upsertAll(components, options.components);
    const actions = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Registry"]("ActionRegistry");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$VGLBASGO$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerInteractionActions"])(actions, overlayManager, uiBridge);
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
    const services = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Registry"]("ServiceRegistry");
    upsertAll(services, options.services);
    const capabilities = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Registry"]("CapabilityRegistry");
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
    const base = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$resource$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFetchAdapter"])();
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
    const permissionStore = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$permission$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PermissionStore"]();
    const layoutRegistry = options.layoutRegistry?.() ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$FOBSAKNK$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createLayoutRegistry"])();
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
    const permissionAdapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$permission$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPermissionAdapter"])(permissionStore);
    const routerAdapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createRouterAdapter"])(navigation);
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
            cached = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$resource$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HttpDslResourceLoader"]({
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
            const menuRegistry = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["MenuRegistry"](sanitizeMenus(bootstrap.menus));
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPageRuntime"])(pageDsl, {
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
            root = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$client$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRoot"])(target);
            root.render(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(Application, {
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
        if ("TURBOPACK compile-time truthy", 1) {
            window.location.assign(to);
        }
    });
    const assembly = createPactorAssembly({
        ...options,
        navigate
    });
    let permission;
    if (options.permission !== void 0) {
        permission = options.permission;
    } else if (options.permissions !== void 0) {
        const store = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$permission$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PermissionStore"]();
        store.setPermissions(options.permissions);
        permission = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$permission$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPermissionAdapter"])(store);
    } else {
        permission = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDefaultPermissionAdapter"])();
    }
    const i18n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createI18nContext"])({
        locale: options.locale,
        defaultLocale: options.defaultLocale,
        messages: options.messages
    });
    function createRuntime(pageDsl, route) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPageRuntime"])(pageDsl, {
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
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I18nContextProvider"], {
            value: i18n,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(EmbeddedPage, {
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
    _s9();
    const { pageId, pageDsl, route, ...options } = props;
    const factoryRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    if (factoryRef.current === null) {
        factoryRef.current = createPactorPage(options);
    }
    const ConfiguredPage = factoryRef.current;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(ConfiguredPage, {
        pageId,
        pageDsl,
        route
    });
}
_s9(PactorPage, "gSqHweiW65Lqsmtk6y/RiWw6yA8=");
_c11 = PactorPage;
function EmbeddedPage({ assembly, options, createRuntime, resolvePage, pageId, pageDsl, route }) {
    _s10();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useI18n"])();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        status: "loading"
    });
    const [retryTick, setRetryTick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const onError = options.onError;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EmbeddedPage.useEffect3": ()=>{
            let cancelled = false;
            let runtime = null;
            void ({
                "EmbeddedPage.useEffect3": async ()=>{
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
                        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDslSourceRef"])(resolved)) {
                            const resolver = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DslSourceResolver"]({
                                services: assembly.services,
                                http: assembly.httpAdapter,
                                locale: options.locale,
                                getScope: {
                                    "EmbeddedPage.useEffect3": ()=>({
                                            route: {
                                                params: route?.params ?? {},
                                                query: route?.query ?? {}
                                            }
                                        })
                                }["EmbeddedPage.useEffect3"]
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
                }
            })["EmbeddedPage.useEffect3"]();
            return ({
                "EmbeddedPage.useEffect3": ()=>{
                    cancelled = true;
                    if (runtime !== null && !runtime.destroyed) {
                        void runtime.hide();
                        void runtime.destroy();
                    }
                }
            })["EmbeddedPage.useEffect3"];
        }
    }["EmbeddedPage.useEffect3"], [
        pageId,
        pageDsl,
        retryTick
    ]);
    const InteractionProvider2 = assembly.interactionKit.Provider;
    const OverlayHost2 = assembly.interactionKit.OverlayHost;
    let content;
    if (state.status === "loading") {
        content = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
            className: "pactor-app-page-loading",
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(BootstrapSpinner, {
                style: {
                    minHeight: 0,
                    padding: 48
                }
            })
        });
    } else if (state.status === "error") {
        content = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(ResultView, {
            className: "pactor-app-page-load-error",
            title: t("pactor.page.loadFailed"),
            subTitle: state.error.message,
            extra: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(PrimaryButton, {
                onClick: ()=>setRetryTick((n)=>n + 1),
                children: t("pactor.page.retry")
            })
        });
    } else {
        content = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(PageErrorBoundary, {
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageRuntimeView"], {
                runtime: state.runtime,
                children: resolvePage !== void 0 ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(OverlayHost2, {
                    manager: assembly.overlayManager,
                    resolvePage
                }) : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(OverlayHost2, {
                    manager: assembly.overlayManager
                })
            })
        });
    }
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(InteractionProvider2, {
        bridge: assembly.uiBridge,
        children: content
    });
}
_s10(EmbeddedPage, "aaXK1qzrhWxseh479cvKypXI8NU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useI18n"],
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]
    ];
});
_c12 = EmbeddedPage;
// src/sitemap/actions.ts
var defaultSitemapActions = {
    "app.reload": (action)=>{
        const to = action.params?.["to"];
        if ("TURBOPACK compile-time truthy", 1) {
            window.location.assign(typeof to === "string" && to !== "" ? to : "/");
        }
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
    _s11();
    const location = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribe, readLocation, {
        "useBrowserRoute.useSyncExternalStore2[location]": // SSR 快照：服务端无 window，宿主应注入 pathname / navigate
        ()=>"/"
    }["useBrowserRoute.useSyncExternalStore2[location]"]);
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBrowserRoute.useCallback[navigate]": (to)=>{
            window.history.pushState(null, "", to);
            window.dispatchEvent(new Event(NAV_EVENT));
        }
    }["useBrowserRoute.useCallback[navigate]"], []);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useBrowserRoute.useMemo": ()=>{
            const qIndex = location.indexOf("?");
            return {
                pathname: qIndex >= 0 ? location.slice(0, qIndex) : location,
                query: Object.fromEntries(new URLSearchParams(qIndex >= 0 ? location.slice(qIndex + 1) : "")),
                navigate
            };
        }
    }["useBrowserRoute.useMemo"], [
        location,
        navigate
    ]);
}
_s11(useBrowserRoute, "nHBFAV9vwIyLxpc+kKnIMvUuOZ0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
;
// src/sitemap/http.ts
function createHttpHooks(options = {}) {
    const { proxyPrefix } = options;
    const envelope = options.envelope ?? true;
    return {
        request (config) {
            let url = config.url;
            if (proxyPrefix !== void 0 && /^https?:\/\//.test(url) && ("TURBOPACK compile-time value", "object") !== "undefined" && !url.startsWith(window.location.origin)) {
                const target = new URL(url);
                url = `${proxyPrefix}${target.pathname}${target.search}`;
            }
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
        return options.locale ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$resource$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withLocaleParam"])(resolved, options.locale) : resolved;
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
                const res = await fetcher(locale ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$resource$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withLocaleParam"])(resolved, locale) : resolved, {
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
    const params = page !== void 0 && page.path !== menu.path ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$chunk$2d$JY7Z55CR$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["match"])(page.path, pathname)?.params ?? match.params : match.params;
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
var OutletContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function PageOutlet() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(OutletContext);
}
_c13 = PageOutlet;
var NavHighlightContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])("");
function SitemapMenu({ items, collapsible, onSelect }) {
    const highlight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(NavHighlightContext);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$dist$2f$chunk$2d$2OQU2IE6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Menu"], {
        items,
        collapsible,
        selectedKey: highlight,
        onSelect
    });
}
_c14 = SitemapMenu;
function SitemapApp(props) {
    _s12();
    const i18n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SitemapApp.useMemo2[i18n]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createI18nContext"])({
                locale: props.locale,
                defaultLocale: props.defaultLocale,
                messages: props.messages
            })
    }["SitemapApp.useMemo2[i18n]"], [
        props.locale,
        props.defaultLocale,
        props.messages
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["I18nContextProvider"], {
        value: i18n,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(SitemapAppInner, {
            ...props
        })
    });
}
_s12(SitemapApp, "zqChOUCdxvU5XKQ9kvFrygL9OA4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]
    ];
});
_c15 = SitemapApp;
function SitemapAppInner(props) {
    _s13();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useI18n"])();
    const { sources, fetcher, baseUrl } = props;
    const browserRoute = useBrowserRoute();
    const pathname = props.pathname ?? browserRoute.pathname;
    const query = props.query ?? browserRoute.query;
    const navigate = props.navigate ?? browserRoute.navigate;
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        status: "loading"
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SitemapAppInner.useEffect4": ()=>{
            let cancelled = false;
            setState({
                status: "loading"
            });
            fetchSitemap(sources, {
                fetcher,
                baseUrl,
                httpHooks: props.httpAdapter,
                locale: props.locale
            }).then({
                "SitemapAppInner.useEffect4": (sitemap2)=>{
                    if (!cancelled) {
                        setState({
                            status: "ready",
                            sitemap: sitemap2
                        });
                    }
                }
            }["SitemapAppInner.useEffect4"]).catch({
                "SitemapAppInner.useEffect4": (error)=>{
                    if (!cancelled) {
                        setState({
                            status: "error",
                            error: error instanceof Error ? error : new Error(String(error))
                        });
                    }
                }
            }["SitemapAppInner.useEffect4"]);
            return ({
                "SitemapAppInner.useEffect4": ()=>{
                    cancelled = true;
                }
            })["SitemapAppInner.useEffect4"];
        }
    }["SitemapAppInner.useEffect4"], [
        fetcher,
        baseUrl,
        props.httpAdapter,
        JSON.stringify(sources)
    ]);
    const registry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SitemapAppInner.useMemo2[registry]": ()=>state.status === "ready" ? new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$router$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["MenuRegistry"](mergeSitemapMenus(state.sitemap)) : null
    }["SitemapAppInner.useMemo2[registry]"], [
        state
    ]);
    const resolution = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SitemapAppInner.useMemo2[resolution]": ()=>state.status === "ready" && registry !== null ? resolveSitemapRoute(state.sitemap, registry, pathname) : null
    }["SitemapAppInner.useMemo2[resolution]"], [
        state,
        registry,
        pathname
    ]);
    const sitemap = state.status === "ready" ? state.sitemap : null;
    const guard = props.guard ?? defaultSitemapGuard;
    const decision = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SitemapAppInner.useMemo2[decision]": ()=>sitemap !== null && resolution !== null ? guard({
                sitemap,
                pathname,
                menu: resolution.menu
            }) : {
                allow: true
            }
    }["SitemapAppInner.useMemo2[decision]"], [
        sitemap,
        resolution,
        guard,
        pathname
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SitemapAppInner.useEffect4": ()=>{
            if (!decision.allow) {
                navigate(decision.redirectTo);
            }
        }
    }["SitemapAppInner.useEffect4"], [
        decision,
        navigate
    ]);
    if (state.status === "loading") {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Centered, {
            children: props.loading ?? t("pactor.table.loading")
        });
    }
    if (state.status === "error") {
        return props.renderError !== void 0 ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: props.renderError(state.error)
        }) : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Centered, {
            children: t("pactor.sitemap.loadError", {
                message: state.error.message
            })
        });
    }
    if (sitemap === null || registry === null || resolution === null) {
        return null;
    }
    if (!decision.allow) {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Centered, {
            children: t("pactor.sitemap.redirecting")
        });
    }
    if (resolution.route === null) {
        return props.renderNotFound !== void 0 ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: props.renderNotFound(pathname)
        }) : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Centered, {
            children: t("pactor.sitemap.notFound", {
                path: pathname
            })
        });
    }
    const { pageId, layoutChain, highlightKey, params } = resolution.route;
    return(// key 只随最外层布局名变化：布局链共享前缀时外层布局常驻，
    // 仅分叉的内层布局与 PageOutlet 内页面随路由重建
    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(NavHighlightContext.Provider, {
        value: highlightKey,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(SitemapLayout, {
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
_s13(SitemapAppInner, "u/XpVelvBDrx4q45799el+CKnRk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useI18n"],
        useBrowserRoute,
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"],
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"],
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"],
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"],
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]
    ];
});
_c16 = SitemapAppInner;
function SitemapLayout({ sitemap, registry, pageId, layoutChain, pathname, query, navigate: hostNavigate, routeParams, props }) {
    _s14();
    const sessionService = props.sessionService ?? "session.context";
    const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SitemapLayout.useMemo2[session]": ()=>({
                user: sitemap.user,
                app: {
                    name: "Pactor App",
                    ...sitemap.app
                },
                menus: toSitemapNavItems(registry.tree())
            })
    }["SitemapLayout.useMemo2[session]"], [
        sitemap,
        registry
    ]);
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SitemapLayout.useMemo2[navigate]": ()=>({
                "SitemapLayout.useMemo2[navigate]": (to)=>{
                    if (/^https?:\/\//.test(to)) {
                        window.open(to, "_blank", "noopener");
                    } else {
                        hostNavigate(to);
                    }
                }
            })["SitemapLayout.useMemo2[navigate]"]
    }["SitemapLayout.useMemo2[navigate]"], [
        hostNavigate
    ]);
    const loader = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SitemapLayout.useMemo2[loader]": ()=>createSitemapLoader(sitemap, {
                pageEndpoint: props.pageEndpoint,
                fetcher: props.fetcher,
                sessionService,
                baseUrl: props.baseUrl,
                httpHooks: props.httpAdapter,
                locale: props.locale
            })
    }["SitemapLayout.useMemo2[loader]"], [
        sitemap,
        props.pageEndpoint,
        props.fetcher,
        props.baseUrl,
        props.httpAdapter,
        sessionService,
        props.locale
    ]);
    const services = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SitemapLayout.useMemo2[services]": ()=>({
                ...createSitemapSessionServices(session, sessionService),
                ...props.services
            })
    }["SitemapLayout.useMemo2[services]"], [
        session,
        sessionService,
        props.services
    ]);
    const actions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SitemapLayout.useMemo2[actions]": ()=>({
                ...defaultSitemapActions,
                ...props.actions
            })
    }["SitemapLayout.useMemo2[actions]"], [
        props.actions
    ]);
    const messagesSignature = JSON.stringify(props.messages ?? {});
    const pageFactory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SitemapLayout.useMemo2[pageFactory]": ()=>createPactorPage({
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
            })
    }["SitemapLayout.useMemo2[pageFactory]"], // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const layoutFactory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SitemapLayout.useMemo2[layoutFactory]": ()=>createPactorPage({
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
            })
    }["SitemapLayout.useMemo2[layoutFactory]"], // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(LayoutLevel, {
        sitemap,
        chain: layoutChain,
        index: 0,
        sessionService,
        layoutFactory,
        outlet: // 页面实例：key 随 pageId + pathname 变化（route 参数变化需重建，
        // PactorPage 的 route prop 不参与运行时重建）——布局保持挂载
        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Page, {
            pageId,
            route: {
                params: routeParams,
                query
            }
        }, `${pageId}@${pathname}`)
    });
}
_s14(SitemapLayout, "9Sr3MMvJAC9JY3x4+OvPZIlmP88=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"],
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"],
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"],
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"],
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"],
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"],
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]
    ];
});
_c17 = SitemapLayout;
function LayoutLevel({ sitemap, chain, index, sessionService, layoutFactory, outlet }) {
    _s15();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useI18n"])();
    const layoutName = chain[index];
    const layoutDsl = sitemap.layouts[layoutName];
    const layoutPage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LayoutLevel.useMemo2[layoutPage]": ()=>{
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
        }
    }["LayoutLevel.useMemo2[layoutPage]"], [
        layoutDsl,
        layoutName,
        sessionService
    ]);
    if (layoutDsl === void 0 || layoutPage === null) {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Centered, {
            children: t("pactor.sitemap.layoutMissing", {
                name: layoutName
            })
        });
    }
    const LayoutPage = layoutFactory;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(OutletContext.Provider, {
        value: index === chain.length - 1 ? outlet : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(LayoutLevel, {
            sitemap,
            chain,
            index: index + 1,
            sessionService,
            layoutFactory,
            outlet
        }, chain[index + 1]),
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(LayoutPage, {
            pageDsl: layoutPage
        }, layoutName)
    });
}
_s15(LayoutLevel, "fn8YTK/BObjfSI4YPrpk3ICVq8s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$runtime$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useI18n"],
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]
    ];
});
_c18 = LayoutLevel;
function Centered({ children }) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
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
_c19 = Centered;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14, _c15, _c16, _c17, _c18, _c19;
__turbopack_context__.k.register(_c, "BootstrapSpinner");
__turbopack_context__.k.register(_c1, "ResultView");
__turbopack_context__.k.register(_c2, "PrimaryButton");
__turbopack_context__.k.register(_c3, "PageErrorBoundary");
__turbopack_context__.k.register(_c4, "DslPageLoader");
__turbopack_context__.k.register(_c5, "Application");
__turbopack_context__.k.register(_c6, "AppShell");
__turbopack_context__.k.register(_c7, "RouterBridgeSync");
__turbopack_context__.k.register(_c8, "ShellLayout");
__turbopack_context__.k.register(_c9, "NotFoundPage");
__turbopack_context__.k.register(_c10, "ForbiddenPage");
__turbopack_context__.k.register(_c11, "PactorPage");
__turbopack_context__.k.register(_c12, "EmbeddedPage");
__turbopack_context__.k.register(_c13, "PageOutlet");
__turbopack_context__.k.register(_c14, "SitemapMenu");
__turbopack_context__.k.register(_c15, "SitemapApp");
__turbopack_context__.k.register(_c16, "SitemapAppInner");
__turbopack_context__.k.register(_c17, "SitemapLayout");
__turbopack_context__.k.register(_c18, "LayoutLevel");
__turbopack_context__.k.register(_c19, "Centered");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=packages_app_dist_index_00u7_we.js.map