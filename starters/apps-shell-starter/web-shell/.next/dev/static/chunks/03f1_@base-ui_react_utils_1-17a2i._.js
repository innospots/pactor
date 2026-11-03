(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/FloatingPortalLite.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingPortalLite",
    ()=>FloatingPortalLite
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$components$2f$FloatingPortal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/floating-ui-react/components/FloatingPortal.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
'use client';
;
;
;
;
const FloatingPortalLite = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function FloatingPortalLite(componentProps, forwardedRef) {
    const { children, container, className, render, style, ...elementProps } = componentProps;
    const { node: portalNode, subtree: portalSubtree } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$components$2f$FloatingPortal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFloatingPortalNode"])({
        container,
        ref: forwardedRef,
        componentProps,
        elementProps
    });
    if (!portalSubtree && !portalNode) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            portalSubtree,
            portalNode && /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"](children, portalNode)
        ]
    });
});
if ("TURBOPACK compile-time truthy", 1) FloatingPortalLite.displayName = "FloatingPortalLite";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/FocusGuard.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FocusGuard",
    ()=>FocusGuard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useIsoLayoutEffect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__platform$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/platform/parts.mjs [app-client] (ecmascript) <export * as platform>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$visuallyHidden$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/visuallyHidden.mjs [app-client] (ecmascript)");
/**
 * @internal
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
'use client';
;
;
;
;
;
const FocusGuard = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function FocusGuard(props, ref) {
    const [role, setRole] = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "FocusGuard.FocusGuard.useIsoLayoutEffect": ()=>{
            // Unlike NVDA and JAWS, VoiceOver's virtual cursor triggers `onFocus` as
            // it moves — but only on focusable/role-button elements through WebKit's
            // NSAccessibility path. Setting `role="button"` lets the focus trap catch
            // the cursor.
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__platform$3e$__["platform"].screenReader.voiceOver && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__platform$3e$__["platform"].engine.webkit) {
                setRole('button');
            }
        }
    }["FocusGuard.FocusGuard.useIsoLayoutEffect"], []);
    const restProps = {
        tabIndex: 0,
        // Role is only for VoiceOver
        role
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
        ...props,
        ref: ref,
        style: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$visuallyHidden$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["visuallyHidden"],
        "aria-hidden": role ? undefined : true,
        ...restProps,
        "data-base-ui-focus-guard": ""
    });
});
if ("TURBOPACK compile-time truthy", 1) FocusGuard.displayName = "FocusGuard";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/InternalBackdrop.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InternalBackdrop",
    ()=>InternalBackdrop
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
/**
 * @internal
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
const InternalBackdrop = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function InternalBackdrop(props, ref) {
    const { cutout, ...otherProps } = props;
    let clipPath;
    if (cutout) {
        const rect = cutout.getBoundingClientRect();
        clipPath = `polygon(0% 0%,100% 0%,100% 100%,0% 100%,0% 0%,${rect.left}px ${rect.top}px,${rect.left}px ${rect.bottom}px,${rect.right}px ${rect.bottom}px,${rect.right}px ${rect.top}px,${rect.left}px ${rect.top}px)`;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
        ref: ref,
        role: "presentation",
        "data-base-ui-inert": "",
        ...otherProps,
        style: {
            position: 'fixed',
            inset: 0,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            clipPath
        }
    });
});
if ("TURBOPACK compile-time truthy", 1) InternalBackdrop.displayName = "InternalBackdrop";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/NullStore.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NullStore",
    ()=>NullStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$ReactStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/store/ReactStore.mjs [app-client] (ecmascript)");
;
class NullStore extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$store$2f$ReactStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReactStore"] {
    // `update`/`set`/`notifyAll` funnel through `setState` in the base `Store`, so overriding
    // `setState` alone would neutralize them today. They are overridden explicitly so the store stays
    // inert even if a future base-class change stops routing a mutator through `setState`.
    setState(_newState) {}
    update(_changes) {}
    set(_key, _value) {}
    notifyAll() {}
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/adaptiveOriginConstants.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_SIDES",
    ()=>DEFAULT_SIDES
]);
const DEFAULT_SIDES = {
    sideX: 'left',
    sideY: 'top'
}; // Self-contained stand-in for Floating UI's `Middleware` type. Referencing the real type in
 // store state makes `tsc` declaration emit reference `Platform`/`detectOverflow` from
 // `@floating-ui/core` internals, which fails as non-portable (TS2883) in consuming builds.
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/adaptiveOriginMiddleware.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adaptiveOrigin",
    ()=>adaptiveOrigin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$owner$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/owner.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__getWindow__as__ownerWindow$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs [app-client] (ecmascript) <export getWindow as ownerWindow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$adaptiveOriginConstants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/adaptiveOriginConstants.mjs [app-client] (ecmascript)");
;
;
;
const adaptiveOrigin = {
    name: 'adaptiveOrigin',
    async fn (state) {
        const { x: rawX, y: rawY, rects: { floating: floatRect }, elements: { floating }, platform, strategy, placement } = state;
        const win = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__getWindow__as__ownerWindow$3e$__["ownerWindow"])(floating);
        const styles = win.getComputedStyle(floating);
        const hasTransition = styles.transitionDuration !== '0s' && styles.transitionDuration !== '';
        if (!hasTransition) {
            return {
                x: rawX,
                y: rawY,
                data: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$adaptiveOriginConstants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SIDES"]
            };
        }
        const offsetParent = await platform.getOffsetParent?.(floating);
        let offsetDimensions = {
            width: 0,
            height: 0
        };
        // For fixed strategy, prefer visualViewport if available
        if (strategy === 'fixed' && win?.visualViewport) {
            offsetDimensions = {
                width: win.visualViewport.width,
                height: win.visualViewport.height
            };
        } else if (offsetParent === win) {
            const doc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$owner$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ownerDocument"])(floating);
            offsetDimensions = {
                width: doc.documentElement.clientWidth,
                height: doc.documentElement.clientHeight
            };
        } else if (await platform.isElement?.(offsetParent)) {
            offsetDimensions = await platform.getDimensions(offsetParent);
        }
        const currentSide = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSide"])(placement);
        let x = rawX;
        let y = rawY;
        if (currentSide === 'left') {
            x = offsetDimensions.width - (rawX + floatRect.width);
        }
        if (currentSide === 'top') {
            y = offsetDimensions.height - (rawY + floatRect.height);
        }
        const sideX = currentSide === 'left' ? 'right' : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$adaptiveOriginConstants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SIDES"].sideX;
        const sideY = currentSide === 'top' ? 'bottom' : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$adaptiveOriginConstants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SIDES"].sideY;
        return {
            x,
            y,
            data: {
                sideX,
                sideY
            }
        };
    }
};
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/closePart.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClosePartContext",
    ()=>ClosePartContext,
    "useClosePartCount",
    ()=>useClosePartCount,
    "useClosePartRegistration",
    ()=>useClosePartRegistration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useIsoLayoutEffect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useStableCallback.mjs [app-client] (ecmascript)");
'use client';
;
;
;
const ClosePartContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](undefined);
if ("TURBOPACK compile-time truthy", 1) ClosePartContext.displayName = "ClosePartContext";
function useClosePartCount() {
    const [closePartCount, setClosePartCount] = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](0);
    const register = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "useClosePartCount.useStableCallback[register]": ()=>{
            setClosePartCount({
                "useClosePartCount.useStableCallback[register]": (count)=>count + 1
            }["useClosePartCount.useStableCallback[register]"]);
            return ({
                "useClosePartCount.useStableCallback[register]": ()=>{
                    setClosePartCount({
                        "useClosePartCount.useStableCallback[register]": (count)=>Math.max(0, count - 1)
                    }["useClosePartCount.useStableCallback[register]"]);
                }
            })["useClosePartCount.useStableCallback[register]"];
        }
    }["useClosePartCount.useStableCallback[register]"]);
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "useClosePartCount.useMemo[context]": ()=>({
                register
            })
    }["useClosePartCount.useMemo[context]"], [
        register
    ]);
    return {
        context,
        hasClosePart: closePartCount > 0
    };
}
function useClosePartRegistration() {
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](ClosePartContext);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "useClosePartRegistration.useIsoLayoutEffect": ()=>{
            return context?.register();
        }
    }["useClosePartRegistration.useIsoLayoutEffect"], [
        context
    ]);
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/collapsibleOpenStateMapping.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "collapsibleOpenStateMapping",
    ()=>collapsibleOpenStateMapping,
    "triggerOpenStateMapping",
    ()=>triggerOpenStateMapping
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$panel$2f$CollapsiblePanelDataAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/collapsible/panel/CollapsiblePanelDataAttributes.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$trigger$2f$CollapsibleTriggerDataAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/collapsible/trigger/CollapsibleTriggerDataAttributes.mjs [app-client] (ecmascript)");
;
;
const PANEL_OPEN_HOOK = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$panel$2f$CollapsiblePanelDataAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CollapsiblePanelDataAttributes"].open]: ''
};
const PANEL_CLOSED_HOOK = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$panel$2f$CollapsiblePanelDataAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CollapsiblePanelDataAttributes"].closed]: ''
};
const triggerOpenStateMapping = {
    open (value) {
        if (value) {
            return {
                [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$collapsible$2f$trigger$2f$CollapsibleTriggerDataAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CollapsibleTriggerDataAttributes"].panelOpen]: ''
            };
        }
        return null;
    }
};
const collapsibleOpenStateMapping = {
    open (value) {
        if (value) {
            return PANEL_OPEN_HOOK;
        }
        return PANEL_CLOSED_HOOK;
    }
};
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/dispatchClickWithModifiers.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dispatchClickWithModifiers",
    ()=>dispatchClickWithModifiers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__getWindow__as__ownerWindow$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs [app-client] (ecmascript) <export getWindow as ownerWindow>");
;
function dispatchClickWithModifiers(target, sourceEvent, { detail = 0 } = {}) {
    target.dispatchEvent(new ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__getWindow__as__ownerWindow$3e$__["ownerWindow"])(target)).PointerEvent('click', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail,
        shiftKey: sourceEvent.shiftKey,
        ctrlKey: sourceEvent.ctrlKey,
        altKey: sourceEvent.altKey,
        metaKey: sourceEvent.metaKey
    }));
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/formatNumber.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cache",
    ()=>cache,
    "formatNumber",
    ()=>formatNumber,
    "getFormatter",
    ()=>getFormatter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$stringifyLocale$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/stringifyLocale.mjs [app-client] (ecmascript)");
;
const cache = new Map();
function getFormatter(locale, options) {
    const optionsString = JSON.stringify({
        locale: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$stringifyLocale$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringifyLocale"])(locale),
        options
    });
    const cachedFormatter = cache.get(optionsString);
    if (cachedFormatter) {
        return cachedFormatter;
    }
    const formatter = new Intl.NumberFormat(locale, options);
    cache.set(optionsString, formatter);
    return formatter;
}
function formatNumber(value, locale, options) {
    if (value == null) {
        return '';
    }
    return getFormatter(locale, options).format(value);
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/getCssDimensions.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCssDimensions",
    ()=>getCssDimensions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs [app-client] (ecmascript)");
;
;
function getCssDimensions(element) {
    const css = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getComputedStyle"])(element);
    // In testing environments, the `width` and `height` properties are empty
    // strings for SVG elements, returning NaN. Fallback to `0` in this case.
    let width = parseFloat(css.width) || 0;
    let height = parseFloat(css.height) || 0;
    const hasOffset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHTMLElement"])(element);
    const offsetWidth = hasOffset ? element.offsetWidth : width;
    const offsetHeight = hasOffset ? element.offsetHeight : height;
    const shouldFallback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(width) !== offsetWidth || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(height) !== offsetHeight;
    if (shouldFallback) {
        width = offsetWidth;
        height = offsetHeight;
    }
    return {
        width,
        height
    };
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/getElementAtPoint.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// `Document.elementFromPoint` retargets shadow content to the shadow host, which then fails
// `contains()` checks against a popup inside that shadow root, so callers pass `getRootNode()`
// (a document or a shadow root) rather than `ownerDocument()`.
__turbopack_context__.s([
    "getElementAtPoint",
    ()=>getElementAtPoint
]);
function getElementAtPoint(root, x, y) {
    return typeof root?.elementFromPoint === 'function' ? root.elementFromPoint(x, y) : null;
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/getPseudoElementBounds.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPseudoElementBounds",
    ()=>getPseudoElementBounds,
    "isMouseWithinBounds",
    ()=>isMouseWithinBounds
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__getWindow__as__ownerWindow$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs [app-client] (ecmascript) <export getWindow as ownerWindow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__platform$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/platform/parts.mjs [app-client] (ecmascript) <export * as platform>");
;
;
// Tolerance around the element bounds so a fast click whose pointer drifts slightly
// during press-release isn't mistaken for a drag-off-and-release cancellation.
// Matches typical OS/browser drag-initiation thresholds.
const BOUNDARY_OFFSET = 5;
function isMouseWithinBounds(event, element) {
    const bounds = getPseudoElementBounds(element);
    return event.clientX >= bounds.left - BOUNDARY_OFFSET && event.clientX <= bounds.right + BOUNDARY_OFFSET && event.clientY >= bounds.top - BOUNDARY_OFFSET && event.clientY <= bounds.bottom + BOUNDARY_OFFSET;
}
function getPseudoElementBounds(element) {
    const elementRect = element.getBoundingClientRect();
    const win = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__getWindow__as__ownerWindow$3e$__["ownerWindow"])(element);
    // Avoid "Not implemented: window.getComputedStyle(elt, pseudoElt)" in jsdom.
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__platform$3e$__["platform"].env.jsdom) {
        return elementRect;
    }
    const beforeStyles = win.getComputedStyle(element, '::before');
    const afterStyles = win.getComputedStyle(element, '::after');
    const hasPseudoElements = beforeStyles.content !== 'none' || afterStyles.content !== 'none';
    if (!hasPseudoElements) {
        return elementRect;
    }
    // Get dimensions of pseudo-elements
    const beforeWidth = parseFloat(beforeStyles.width) || 0;
    const beforeHeight = parseFloat(beforeStyles.height) || 0;
    const afterWidth = parseFloat(afterStyles.width) || 0;
    const afterHeight = parseFloat(afterStyles.height) || 0;
    // Calculate max dimensions including pseudo-elements
    const totalWidth = Math.max(elementRect.width, beforeWidth, afterWidth);
    const totalHeight = Math.max(elementRect.height, beforeHeight, afterHeight);
    // Calculate the differences to extend the bounds
    const widthDiff = totalWidth - elementRect.width;
    const heightDiff = totalHeight - elementRect.height;
    return {
        left: elementRect.left - widthDiff / 2,
        right: elementRect.right + widthDiff / 2,
        top: elementRect.top - heightDiff / 2,
        bottom: elementRect.bottom + heightDiff / 2
    };
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/hideMiddleware.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hide",
    ()=>hide
]);
const hide = {
    name: 'hide',
    async fn (state) {
        const { width, height, x, y } = state.rects.reference;
        const anchorHidden = width === 0 && height === 0 && x === 0 && y === 0;
        // Mirrors Floating UI's `hide()` referenceHidden strategy. Floating UI injects
        // `detectOverflow` into the middleware platform before invoking middleware.
        const overflow = await state.platform.detectOverflow(state, {
            elementContext: 'reference'
        });
        const referenceHidden = overflow.top - height >= 0 || overflow.right - width >= 0 || overflow.bottom - height >= 0 || overflow.left - width >= 0;
        return {
            data: {
                referenceHidden: referenceHidden || anchorHidden
            }
        };
    }
};
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/listbox-separator/ListboxSeparator.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ListboxSeparator",
    ()=>ListboxSeparator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
'use client';
;
;
const ListboxSeparator = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function ListboxSeparator(componentProps, forwardedRef) {
    const { className, render, orientation = 'horizontal', style, ...elementProps } = componentProps;
    const state = {
        orientation
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('div', componentProps, {
        state,
        ref: forwardedRef,
        props: [
            {
                role: 'presentation'
            },
            elementProps
        ]
    });
});
if ("TURBOPACK compile-time truthy", 1) ListboxSeparator.displayName = "ListboxSeparator";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/popupStateMapping.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CommonPopupDataAttributes",
    ()=>CommonPopupDataAttributes,
    "CommonTriggerDataAttributes",
    ()=>CommonTriggerDataAttributes,
    "popupStateMapping",
    ()=>popupStateMapping,
    "popupTransitionStateMapping",
    ()=>popupTransitionStateMapping,
    "pressableTriggerOpenStateMapping",
    ()=>pressableTriggerOpenStateMapping,
    "triggerOpenStateMapping",
    ()=>triggerOpenStateMapping
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/stateAttributesMapping.mjs [app-client] (ecmascript)");
;
let CommonPopupDataAttributes = function(CommonPopupDataAttributes) {
    /**
   * Present when the popup is open.
   */ CommonPopupDataAttributes["open"] = "data-open";
    /**
   * Present when the popup is closed.
   */ CommonPopupDataAttributes["closed"] = "data-closed";
    /**
   * Present when the popup begins animating in.
   */ CommonPopupDataAttributes[CommonPopupDataAttributes["startingStyle"] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransitionStatusDataAttributes"].startingStyle] = "startingStyle";
    /**
   * Present when the popup is animating out.
   */ CommonPopupDataAttributes[CommonPopupDataAttributes["endingStyle"] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransitionStatusDataAttributes"].endingStyle] = "endingStyle";
    /**
   * Present when the anchor is hidden.
   */ CommonPopupDataAttributes["anchorHidden"] = "data-anchor-hidden";
    /**
   * Indicates which side the popup is positioned relative to the trigger.
   * @type { 'top' | 'bottom' | 'left' | 'right' | 'inline-end' | 'inline-start'}
   */ CommonPopupDataAttributes["side"] = "data-side";
    /**
   * Indicates how the popup is aligned relative to specified side.
   * @type {'start' | 'center' | 'end'}
   */ CommonPopupDataAttributes["align"] = "data-align";
    return CommonPopupDataAttributes;
}({});
let CommonTriggerDataAttributes = /*#__PURE__*/ function(CommonTriggerDataAttributes) {
    /**
   * Present when the popup is open.
   */ CommonTriggerDataAttributes["popupOpen"] = "data-popup-open";
    /**
   * Present when a pressable trigger is pressed.
   */ CommonTriggerDataAttributes["pressed"] = "data-pressed";
    return CommonTriggerDataAttributes;
}({});
// Literal keys (instead of enum member references) keep the docs-only enums above
// tree-shakeable: a runtime reference would retain the whole enum IIFE in every bundle.
const TRIGGER_HOOK = {
    'data-popup-open': ''
};
const PRESSABLE_TRIGGER_HOOK = {
    'data-popup-open': '',
    'data-pressed': ''
};
const POPUP_OPEN_HOOK = {
    'data-open': ''
};
const POPUP_CLOSED_HOOK = {
    'data-closed': ''
};
const ANCHOR_HIDDEN_HOOK = {
    'data-anchor-hidden': ''
};
const triggerOpenStateMapping = {
    open (value) {
        if (value) {
            return TRIGGER_HOOK;
        }
        return null;
    }
};
const pressableTriggerOpenStateMapping = {
    open (value) {
        if (value) {
            return PRESSABLE_TRIGGER_HOOK;
        }
        return null;
    }
};
const popupStateMapping = {
    open (value) {
        if (value) {
            return POPUP_OPEN_HOOK;
        }
        return POPUP_CLOSED_HOOK;
    },
    anchorHidden (value) {
        if (value) {
            return ANCHOR_HIDDEN_HOOK;
        }
        return null;
    }
};
const popupTransitionStateMapping = {
    ...popupStateMapping,
    ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$stateAttributesMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transitionStatusMapping"]
};
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/popups/inlineRect.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createInlineMiddleware",
    ()=>createInlineMiddleware,
    "getInlineRectTriggerProps",
    ()=>getInlineRectTriggerProps,
    "updateInlineRectCoords",
    ()=>updateInlineRectCoords
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs [app-client] (ecmascript)");
;
// Floating UI ships an `inline()` middleware. This local version mirrors its line-rect
// selection while adding trigger identity checks, delayed-open hit-line reuse, and
// improved left/right edge grouping for Preview Card's reusable trigger model.
function createRect(left, top, right, bottom) {
    return {
        left,
        top,
        right,
        bottom,
        x: left,
        y: top,
        width: right - left,
        height: bottom - top
    };
}
function copyRect(rect) {
    return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height
    };
}
function getLineRects(rects) {
    const lines = [];
    let previousRect;
    let left = Number.POSITIVE_INFINITY;
    let top = Number.POSITIVE_INFINITY;
    let right = Number.NEGATIVE_INFINITY;
    let bottom = Number.NEGATIVE_INFINITY;
    for (const rect of Array.from(rects).sort((a, b)=>a.top - b.top)){
        left = Math.min(left, rect.left);
        top = Math.min(top, rect.top);
        right = Math.max(right, rect.right);
        bottom = Math.max(bottom, rect.bottom);
        if (!previousRect || rect.top - previousRect.top > previousRect.height / 2) {
            lines.push(copyRect(rect));
        } else {
            const line = lines[lines.length - 1];
            line.left = Math.min(line.left, rect.left);
            line.right = Math.max(line.right, rect.right);
            line.bottom = Math.max(line.bottom, rect.bottom);
            line.width = line.right - line.left;
            line.height = line.bottom - line.top;
        }
        previousRect = rect;
    }
    return {
        lines,
        fallback: createRect(left, top, right, bottom)
    };
}
function findLineIndex(lines, x, y) {
    return lines.findIndex((lineRect)=>x > lineRect.left - 2 && x < lineRect.right + 2 && y > lineRect.top - 2 && y < lineRect.bottom + 2);
}
function createClientRect(rect) {
    return createRect(rect.left, rect.top, rect.right, rect.bottom);
}
function getInlineRectCoords(element, clientX, clientY) {
    const { lines } = getLineRects(element.getClientRects());
    if (lines.length < 2) {
        return undefined;
    }
    const lineIndex = findLineIndex(lines, clientX, clientY);
    return {
        x: clientX,
        y: clientY,
        lineIndex: lineIndex === -1 ? undefined : lineIndex,
        element
    };
}
function getInlineReferenceRect(reference, placement, coords) {
    const { lines, fallback } = getLineRects(reference.getClientRects());
    if (lines.length < 2) {
        return null;
    }
    const x = coords?.x;
    const y = coords?.y;
    const side = placement[0];
    if (coords?.lineIndex != null && lines[coords.lineIndex]) {
        return createClientRect(lines[coords.lineIndex]);
    }
    if (x != null && y != null) {
        const lineIndex = findLineIndex(lines, x, y);
        if (lineIndex !== -1) {
            return createClientRect(lines[lineIndex]);
        }
    }
    if (lines.length === 2 && lines[0].left > lines[1].right && x != null && y != null) {
        return fallback;
    }
    if (side === 't' || side === 'b') {
        const firstRect = lines[0];
        const lastRect = lines[lines.length - 1];
        const targetRect = side === 't' ? firstRect : lastRect;
        return createRect(targetRect.left, firstRect.top, targetRect.right, lastRect.bottom);
    }
    const isLeft = side === 'l';
    let left = lines[0].left;
    let right = lines[0].right;
    let edge = isLeft ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    let targetFirstRect = lines[0];
    let targetLastRect = lines[0];
    for (const rect of lines){
        left = Math.min(left, rect.left);
        right = Math.max(right, rect.right);
        const nextEdge = isLeft ? rect.left : rect.right;
        if (isLeft && nextEdge < edge || !isLeft && nextEdge > edge) {
            edge = nextEdge;
            targetFirstRect = rect;
            targetLastRect = rect;
        } else if (nextEdge === edge) {
            targetLastRect = rect;
        }
    }
    return createRect(left, targetFirstRect.top, right, targetLastRect.bottom);
}
function getContextElement(reference) {
    if ('contextElement' in reference && reference.contextElement) {
        return reference.contextElement;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isElement"])(reference) ? reference : undefined;
}
function getInlineRectTriggerProps(coordsRef, isOpen) {
    function updateCoords(event) {
        updateInlineRectCoords(coordsRef, event.currentTarget, event.clientX, event.clientY);
    }
    function updateCoordsIfClosed(event) {
        if (!isOpen) {
            updateCoords(event);
        }
    }
    return {
        onFocus () {
            coordsRef.current = undefined;
        },
        onMouseEnter: updateCoordsIfClosed,
        onMouseMove: updateCoordsIfClosed
    };
}
function updateInlineRectCoords(coordsRef, element, clientX, clientY) {
    const nextCoords = getInlineRectCoords(element, clientX, clientY);
    coordsRef.current = nextCoords;
    return nextCoords;
}
function createInlineMiddleware(coordsRef) {
    return {
        name: 'inline',
        async fn (state) {
            const reference = state.elements.reference;
            if (typeof reference?.getClientRects !== 'function') {
                return {};
            }
            const contextElement = getContextElement(reference);
            const coords = coordsRef.current;
            const currentCoords = coords?.element === reference || coords?.element === contextElement ? coords : undefined;
            const rect = getInlineReferenceRect(reference, state.placement, currentCoords);
            if (!rect || typeof state.platform.getElementRects !== 'function') {
                return {};
            }
            const resetRects = await state.platform.getElementRects({
                reference: {
                    contextElement,
                    getBoundingClientRect () {
                        return rect;
                    }
                },
                floating: state.elements.floating,
                strategy: state.strategy
            });
            if (state.rects.reference.x === resetRects.reference.x && state.rects.reference.y === resetRects.reference.y && state.rects.reference.width === resetRects.reference.width && state.rects.reference.height === resetRects.reference.height) {
                return {};
            }
            return {
                reset: {
                    rects: resetRects
                }
            };
        }
    };
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/popups/popupHandle.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BasePopupHandle",
    ()=>BasePopupHandle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useAnimationFrame$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useAnimationFrame.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/createBaseUIEventDetails.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/reason-parts.mjs [app-client] (ecmascript) <export * as REASONS>");
;
;
;
;
class BasePopupHandle {
    /**
   * Stores of every root currently using this handle, in attach order. A handle is meant to be used
   * by a single mounted root, but roots can transiently overlap (e.g. during an animated route
   * transition), so this stack lets `attachStore`'s cleanup restore the previous root instead of
   * leaving a still-mounted root uncontrollable when a newer overlapping root detaches first.
   */ attachedStores = [];
    /**
   * Store of the root that currently controls the handle: the most recently attached one still
   * mounted, or `null` when no root is attached. Imperative methods are no-ops while this is `null`.
   */ attachedStoreValue = null;
    /**
   * Listeners notified when `attachedStore` changes, so detached triggers can follow the store pointer.
   */ storeListeners = new Set();
    /**
   * Creates a handle backed by the store used while no root is attached.
   *
   * @param fallbackStore Inert, closed store handed to detached triggers while no root is attached,
   * so they can render and register without a mounted root. Triggers register into whichever store
   * `store` currently resolves to, so while detached they live in this store's trigger map and
   * migrate themselves to the root's store (and back) as it attaches/detaches.
   * @param componentName Component name used to prefix dev warnings, e.g. `'Menu'` produces
   * `MenuHandle.open()` in warning text.
   * @param throwOnMissingTrigger Whether `open(triggerId)` throws when no trigger with that id is
   * registered. Anchored popups (Menu, Popover, Tooltip, PreviewCard) need a trigger to anchor to,
   * so they throw; Dialog is not anchored and instead opens unassociated with a dev warning.
   */ constructor(fallbackStore, componentName, throwOnMissingTrigger = true){
        this.fallbackStore = fallbackStore;
        this.componentName = componentName;
        this.throwOnMissingTrigger = throwOnMissingTrigger;
    }
    get attachedStore() {
        return this.attachedStoreValue;
    }
    /**
   * Store that detached triggers read from: the attached root's store, or an inert fallback store
   * used while no root is attached.
   * @internal
   */ get store() {
        return this.attachedStoreValue ?? this.fallbackStore;
    }
    /**
   * Stable fallback store used for server rendering and hydration. Root stores cannot be recorded on
   * the handle during render because a handle can be shared by concurrent server-rendered requests.
   * @internal
   */ get serverStore() {
        return this.fallbackStore;
    }
    /**
   * Subscribes to changes of the attached store pointer so detached triggers re-render and re-bind
   * when a root attaches or detaches. Returns a function that removes the listener.
   * @internal
   */ subscribeStore(listener) {
        this.storeListeners.add(listener);
        return ()=>{
            this.storeListeners.delete(listener);
        };
    }
    /**
   * Points the handle at a root's store and notifies subscribers so detached triggers re-render and
   * re-register into it (their registration ref re-fires on the store-pointer change). Returns a
   * cleanup function that detaches the store again.
   * @internal
   */ attachStore(newStore) {
        this.attachedStores.push(newStore);
        this.setActiveStore(newStore);
        if ("TURBOPACK compile-time truthy", 1) {
            if (this.attachedStores.length > 1) {
                // More than one root is attached at once. This is usually a transient overlap during an
                // animated route transition, where the outgoing root unmounts shortly after the incoming
                // one mounts. Defer the check by a frame and only warn if the overlap is still present once
                // the transition has settled (more than one root stayed mounted), so a clean handoff doesn't
                // warn regardless of the exact unmount timing.
                // The warning frame only exists in development; it is created lazily so it never appears on
                // instances in production (like `controlledValues` in `ReactStore`).
                const dev = this;
                (dev.overlapWarningFrame ??= __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useAnimationFrame$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimationFrame"].create()).request(()=>{
                    if (this.attachedStores.length > 1) {
                        console.warn('Base UI: A handle is attached to more than one mounted root at the same time. ' + 'The most recently mounted root takes over and the previous one stops being controlled by the handle. ' + 'A handle should be used by a single root that stays mounted for the lifetime of the handle.');
                    }
                });
            }
        }
        return ()=>{
            const index = this.attachedStores.lastIndexOf(newStore);
            if (index !== -1) {
                this.attachedStores.splice(index, 1);
            }
            // Restore control to the most recently attached root that is still mounted (or detach fully if
            // none remain). Clearing unconditionally would leave a still-mounted older root uncontrollable
            // when a newer overlapping root detaches first (e.g. a canceled route transition).
            this.setActiveStore(this.attachedStores[this.attachedStores.length - 1] ?? null);
        };
    }
    /**
   * Sets the store that currently controls the handle and notifies subscribers when it changes, so
   * detached triggers re-render and migrate their registration to the new store.
   */ setActiveStore(store) {
        if (this.attachedStoreValue !== store) {
            this.attachedStoreValue = store;
            this.storeListeners.forEach((listener)=>{
                listener();
            });
        }
    }
    /**
   * Opens the attached root's store and associates it with the trigger with the given id, or a
   * no-op (with a dev warning) while no root is attached. Shared by every concrete handle's public
   * `open()` method, which only narrows the parameter type.
   *
   * When a trigger id is given but no matching trigger is registered, anchored popups throw (see
   * `throwOnMissingTrigger`); Dialog opens unassociated with a dev warning instead.
   *
   * This method should only be called in an event handler or an effect (not during rendering).
   *
   * @param triggerId ID of the trigger to associate with the popup, or `null`/`undefined` to open
   * without associating any trigger.
   */ openByTrigger(triggerId) {
        const attachedStore = this.attachedStore;
        if (attachedStore === null) {
            if ("TURBOPACK compile-time truthy", 1) {
                console.warn(`Base UI: ${this.componentName}Handle.open() was called while no root using this handle is mounted. ` + 'The call was ignored; mount a root with this handle before opening it imperatively.');
            }
            return;
        }
        // Registered triggers normally live in the active root's store. During the commit in which a
        // root attaches, a still-mounted detached trigger has not re-registered into that store yet (it
        // migrates on its next render): it is still registered wherever it lived before — the fallback
        // store when this is the first root to attach, or a previously attached root's store during a
        // transient overlap (e.g. an animated route transition). Search the whole attachment stack
        // (newest first) and the fallback map so an imperative open-by-id called in that commit (e.g.
        // from a layout effect) still resolves the trigger instead of treating it as missing.
        let triggerElement;
        if (triggerId) {
            for(let i = this.attachedStores.length - 1; i >= 0 && !triggerElement; i -= 1){
                triggerElement = this.attachedStores[i].context.triggerElements.getById(triggerId);
            }
            triggerElement ??= this.fallbackStore.context.triggerElements.getById(triggerId);
        }
        if (triggerId && !triggerElement) {
            if (this.throwOnMissingTrigger) {
                throw new Error(("TURBOPACK compile-time truthy", 1) ? `Base UI: ${this.componentName}Handle.open() was called with the trigger id "${triggerId}", ` + 'but no matching trigger is registered with this handle. ' + 'An anchored popup cannot open without a trigger to anchor to. ' + `Pass the id of a mounted ${this.componentName}.Trigger that has this handle set on its "handle" prop.` : "TURBOPACK unreachable");
            }
            if ("TURBOPACK compile-time truthy", 1) {
                console.warn(`Base UI: ${this.componentName}Handle.open: No trigger found with id "${triggerId}". ` + 'The popup will open, but the trigger will not be associated with it.');
            }
        }
        attachedStore.setOpen(true, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].imperativeAction, undefined, triggerElement));
    }
    /**
   * Closes the popup by setting the attached root's store to closed, or a no-op (with a dev warning)
   * while no root is attached. Shared by every concrete handle's public `close()` method.
   *
   * This method should only be called in an event handler or an effect (not during rendering).
   */ closePopup() {
        const attachedStore = this.attachedStore;
        if (attachedStore === null) {
            if ("TURBOPACK compile-time truthy", 1) {
                console.warn(`Base UI: ${this.componentName}Handle.close() was called while no root using this handle is mounted. ` + 'The call was ignored.');
            }
            return;
        }
        attachedStore.setOpen(false, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].imperativeAction));
    }
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/popups/popupStoreUtils.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FOCUSABLE_POPUP_PROPS",
    ()=>FOCUSABLE_POPUP_PROPS,
    "PopupHandleAttachment",
    ()=>PopupHandleAttachment,
    "applyPopupOpenChange",
    ()=>applyPopupOpenChange,
    "attachPreventUnmountOnClose",
    ()=>attachPreventUnmountOnClose,
    "createDefaultInitialFocus",
    ()=>createDefaultInitialFocus,
    "setPopupOpenState",
    ()=>setPopupOpenState,
    "useImplicitActiveTrigger",
    ()=>useImplicitActiveTrigger,
    "useOpenStateTransitions",
    ()=>useOpenStateTransitions,
    "usePopupInteractionProps",
    ()=>usePopupInteractionProps,
    "usePopupRootStore",
    ()=>usePopupRootStore,
    "usePopupRootSync",
    ()=>usePopupRootSync,
    "useTriggerDataForwarding",
    ()=>useTriggerDataForwarding,
    "useTriggerRegistration",
    ()=>useTriggerRegistration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/empty.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useId$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useId.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useStableCallback.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useIsoLayoutEffect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useRefWithInit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useRefWithInit.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/floating-ui-react/utils/constants.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$components$2f$FloatingTree$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/floating-ui-react/components/FloatingTree.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$hooks$2f$useSyncedFloatingRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/floating-ui-react/hooks/useSyncedFloatingRootContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useTransitionStatus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/useTransitionStatus.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useOpenChangeComplete$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/useOpenChangeComplete.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/createBaseUIEventDetails.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/reason-parts.mjs [app-client] (ecmascript) <export * as REASONS>");
'use client';
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
const FOCUSABLE_POPUP_PROPS = {
    tabIndex: -1,
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$constants$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FOCUSABLE_ATTRIBUTE"]]: ''
};
function createDefaultInitialFocus(popupRef) {
    return (interactionType)=>interactionType === 'touch' ? popupRef.current : true;
}
function usePopupRootStore(createStore, treatPopupAsFloatingElement = false) {
    const floatingId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useId$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const nested = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$components$2f$FloatingTree$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFloatingParentNodeId"])() != null;
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useRefWithInit$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRefWithInit"])({
        "usePopupRootStore.useRefWithInit": ()=>createStore(floatingId, nested)
    }["usePopupRootStore.useRefWithInit"]).current;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$hooks$2f$useSyncedFloatingRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncedFloatingRootContext"])({
        popupStore: store,
        treatPopupAsFloatingElement,
        floatingRootContext: store.state.floatingRootContext,
        floatingId,
        nested,
        onOpenChange: store.setOpen
    });
    return store;
}
function PopupHandleAttachment({ handle, store }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "PopupHandleAttachment.useIsoLayoutEffect": ()=>{
            return handle.attachStore(store);
        }
    }["PopupHandleAttachment.useIsoLayoutEffect"], [
        handle,
        store
    ]);
    return null;
}
function useTriggerRegistration(id, store) {
    // Keep track of the currently registered element to unregister it on unmount or id change.
    const registeredElementIdRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const registeredElementRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    return __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useTriggerRegistration.useCallback": (element)=>{
            if (id === undefined) {
                return;
            }
            let shouldSyncTriggerCount = false;
            if (registeredElementIdRef.current !== null) {
                const registeredId = registeredElementIdRef.current;
                const registeredElement = registeredElementRef.current;
                const currentElement = store.context.triggerElements.getById(registeredId);
                if (registeredElement && currentElement === registeredElement) {
                    store.context.triggerElements.delete(registeredId);
                    shouldSyncTriggerCount = true;
                }
                registeredElementIdRef.current = null;
                registeredElementRef.current = null;
            }
            if (element !== null) {
                registeredElementIdRef.current = id;
                registeredElementRef.current = element;
                store.context.triggerElements.add(id, element);
                shouldSyncTriggerCount = true;
            }
            if (shouldSyncTriggerCount) {
                const triggerCount = store.context.triggerElements.size;
                if (store.select('open') && store.state.triggerCount !== triggerCount) {
                    store.set('triggerCount', triggerCount);
                }
            }
        }
    }["useTriggerRegistration.useCallback"], [
        store,
        id
    ]);
}
function setPopupOpenState(state, open, trigger, preventUnmountOnClose = false) {
    if (open) {
        // Opening starts a new close cycle, so clear any previous request to keep the popup mounted.
        state.preventUnmountingOnClose = false;
    } else if (preventUnmountOnClose) {
        state.preventUnmountingOnClose = true;
    }
    const triggerId = trigger?.id ?? null;
    // If a popup is closing, the `trigger` may be undefined.
    // We want to keep the previous value so that exit animations are played and focus is returned correctly.
    if (triggerId || open) {
        state.activeTriggerId = triggerId;
        state.activeTriggerElement = trigger ?? null;
    }
}
function attachPreventUnmountOnClose(eventDetails) {
    let preventUnmountOnClose = false;
    eventDetails.preventUnmountOnClose = ()=>{
        preventUnmountOnClose = true;
    };
    return ()=>preventUnmountOnClose;
}
function applyPopupOpenChange(store, nextOpen, eventDetails, options = {}) {
    const reason = eventDetails.reason;
    const isHover = reason === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].triggerHover;
    const isFocusOpen = nextOpen && reason === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].triggerFocus;
    const isDismissClose = !nextOpen && (reason === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].triggerPress || reason === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].escapeKey);
    const shouldPreventUnmountOnClose = attachPreventUnmountOnClose(eventDetails);
    store.context.onOpenChange?.(nextOpen, eventDetails);
    if (eventDetails.isCanceled) {
        return;
    }
    options.onBeforeDispatch?.();
    store.state.floatingRootContext.dispatchOpenChange(nextOpen, eventDetails);
    const changeState = ()=>{
        // Spread `extraState` first so `open` always reflects `nextOpen`, keeping it in
        // sync with the value already passed to `dispatchOpenChange`/`setPopupOpenState`.
        const updatedState = {
            ...options.extraState,
            open: nextOpen
        };
        if (isFocusOpen) {
            updatedState.instantType = 'focus';
        } else if (isDismissClose) {
            updatedState.instantType = 'dismiss';
        } else if (isHover) {
            updatedState.instantType = undefined;
        }
        setPopupOpenState(updatedState, nextOpen, eventDetails.trigger, shouldPreventUnmountOnClose());
        store.update(updatedState);
    };
    if (isHover) {
        // Flush synchronously for hover so `node.getAnimations()` sees the new state.
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flushSync"](changeState);
    } else {
        changeState();
    }
}
function useTriggerDataForwarding(triggerId, triggerElementRef, store, stateUpdates) {
    const isMountedByThisTrigger = store.useState('isMountedByTrigger', triggerId);
    const baseRegisterTrigger = useTriggerRegistration(triggerId, store);
    // Applies trigger-owned state (active-trigger ownership and payload) when the trigger registers.
    // Stable so payload/`stateUpdates` changes do not change the ref identity (which would needlessly
    // churn registration); it reads the latest closure values when invoked.
    const applyTriggerData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "useTriggerDataForwarding.useStableCallback[applyTriggerData]": (element)=>{
            const open = store.select('open');
            const activeTriggerId = store.select('activeTriggerId');
            if (activeTriggerId === triggerId) {
                store.update({
                    activeTriggerElement: element,
                    ...open ? stateUpdates : null
                });
                return;
            }
            if (activeTriggerId == null && open) {
                // If a popup is already open, a detached trigger can mount before any active trigger
                // has been established. Claim the first registered trigger so trigger-owned focus
                // management and ARIA relationships work.
                store.update({
                    activeTriggerId: triggerId,
                    activeTriggerElement: element,
                    ...stateUpdates
                });
            }
        }
    }["useTriggerDataForwarding.useStableCallback[applyTriggerData]"]);
    // Intentionally NOT stable. Its identity is derived from `baseRegisterTrigger`, which is keyed on
    // `[store, id]`, so when a handle-backed trigger's store pointer swaps the merged ref re-fires —
    // unregistering from the previous store and registering into the new one. This lets a detached
    // trigger follow its handle's currently-attached store across attach/detach/remount. (A stable
    // callback would keep its identity and never re-fire on a store swap.)
    const registerTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useTriggerDataForwarding.useCallback[registerTrigger]": (element)=>{
            baseRegisterTrigger(element);
            if (element) {
                applyTriggerData(element);
            }
        }
    }["useTriggerDataForwarding.useCallback[registerTrigger]"], [
        baseRegisterTrigger,
        applyTriggerData
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "useTriggerDataForwarding.useIsoLayoutEffect": ()=>{
            if (isMountedByThisTrigger) {
                store.update({
                    activeTriggerElement: triggerElementRef.current,
                    ...stateUpdates
                });
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["useTriggerDataForwarding.useIsoLayoutEffect"], [
        isMountedByThisTrigger,
        store,
        triggerElementRef,
        ...Object.values(stateUpdates)
    ]);
    return {
        registerTrigger,
        isMountedByThisTrigger
    };
}
function useImplicitActiveTrigger(store, options = {}) {
    const { closeOnActiveTriggerUnmount = false } = options;
    // Distinguishes a trigger that unmounted from a new active trigger that has not hydrated yet.
    const resolvedActiveTriggerIdRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const open = store.useState('open');
    const reactiveTriggerCount = store.useState('triggerCount');
    // Subscribe to the active trigger id so the reconciliation below reruns when ownership moves to
    // another trigger while the popup stays open (e.g. a focus/hover handoff between triggers).
    const activeTriggerId = store.useState('activeTriggerId');
    // Subscribe to the active trigger element so the reconciliation reruns when a pending active
    // trigger registers in a commit where the trigger count nets out unchanged (registration
    // forwards the element to the store when the registering trigger matches the active id).
    // Without this, the id would never be marked resolved and a later genuine unmount would be
    // misclassified as pending, disabling `closeOnActiveTriggerUnmount`.
    const reactiveActiveTriggerElement = store.useState('activeTriggerElement');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "useImplicitActiveTrigger.useIsoLayoutEffect": ()=>{
            if (!open) {
                resolvedActiveTriggerIdRef.current = null;
                if (store.state.triggerCount !== 0) {
                    store.set('triggerCount', 0);
                }
                return;
            }
            const triggerCount = store.context.triggerElements.size;
            const stateUpdates = {};
            if (store.state.triggerCount !== triggerCount) {
                stateUpdates.triggerCount = triggerCount;
            }
            const currentActiveTriggerId = store.select('activeTriggerId');
            let lostActiveTriggerId = null;
            if (currentActiveTriggerId) {
                const activeTriggerElement = store.context.triggerElements.getById(currentActiveTriggerId);
                if (!activeTriggerElement) {
                    for (const [triggerId, triggerElement] of store.context.triggerElements.entries()){
                        if (triggerElement === store.state.activeTriggerElement) {
                            stateUpdates.activeTriggerId = triggerId;
                            stateUpdates.activeTriggerElement = triggerElement;
                            resolvedActiveTriggerIdRef.current = triggerId;
                            break;
                        }
                    }
                    if (stateUpdates.activeTriggerId === undefined) {
                        if (resolvedActiveTriggerIdRef.current === currentActiveTriggerId) {
                            lostActiveTriggerId = currentActiveTriggerId;
                        } else {
                            resolvedActiveTriggerIdRef.current = null;
                        }
                    }
                } else {
                    resolvedActiveTriggerIdRef.current = currentActiveTriggerId;
                    if (activeTriggerElement !== store.state.activeTriggerElement) {
                        stateUpdates.activeTriggerElement = activeTriggerElement;
                    }
                }
            } else {
                resolvedActiveTriggerIdRef.current = null;
            }
            if (!lostActiveTriggerId && !currentActiveTriggerId && triggerCount === 1) {
                const iteratorResult = store.context.triggerElements.entries().next();
                if (!iteratorResult.done) {
                    const [implicitTriggerId, implicitTriggerElement] = iteratorResult.value;
                    stateUpdates.activeTriggerId = implicitTriggerId;
                    stateUpdates.activeTriggerElement = implicitTriggerElement;
                    resolvedActiveTriggerIdRef.current = implicitTriggerId;
                }
            }
            if (stateUpdates.triggerCount !== undefined || stateUpdates.activeTriggerId !== undefined || stateUpdates.activeTriggerElement !== undefined) {
                store.update(stateUpdates);
            }
            if (lostActiveTriggerId) {
                if (closeOnActiveTriggerUnmount) {
                    // Defer so a same-tick replacement trigger with the same id can register first.
                    queueMicrotask({
                        "useImplicitActiveTrigger.useIsoLayoutEffect": ()=>{
                            if (store.select('open') && store.select('activeTriggerId') === lostActiveTriggerId && !store.context.triggerElements.getById(lostActiveTriggerId)) {
                                const eventDetails = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].none);
                                store.setOpen(false, eventDetails);
                                // If closing is canceled, keep the previous active trigger ownership for the
                                // still-open popup instead of claiming another trigger implicitly.
                                if (!eventDetails.isCanceled) {
                                    store.update({
                                        activeTriggerId: null,
                                        activeTriggerElement: null
                                    });
                                }
                            }
                        }
                    }["useImplicitActiveTrigger.useIsoLayoutEffect"]);
                }
            }
        }
    }["useImplicitActiveTrigger.useIsoLayoutEffect"], [
        open,
        store,
        reactiveTriggerCount,
        activeTriggerId,
        reactiveActiveTriggerElement,
        closeOnActiveTriggerUnmount
    ]);
}
function useOpenStateTransitions(open, store, onUnmount) {
    const { mounted, setMounted, transitionStatus } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useTransitionStatus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransitionStatus"])(open);
    const preventUnmountingOnClose = store.useState('preventUnmountingOnClose');
    // Opening starts a new close cycle. Clear during render so the close-completion hook below
    // reads the synchronized value on the same pass.
    const syncedPreventUnmountingOnClose = open ? false : preventUnmountingOnClose;
    store.useSyncedValues({
        mounted,
        transitionStatus,
        preventUnmountingOnClose: syncedPreventUnmountingOnClose
    });
    const forceUnmount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "useOpenStateTransitions.useStableCallback[forceUnmount]": ()=>{
            setMounted(false);
            store.update({
                activeTriggerId: null,
                activeTriggerElement: null,
                mounted: false,
                preventUnmountingOnClose: false
            });
            onUnmount?.();
            store.context.onOpenChangeComplete?.(false);
        }
    }["useOpenStateTransitions.useStableCallback[forceUnmount]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useOpenChangeComplete$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOpenChangeComplete"])({
        enabled: mounted && !open && !syncedPreventUnmountingOnClose,
        open,
        ref: store.context.popupRef,
        onComplete () {
            if (!open) {
                forceUnmount();
            }
        }
    });
    return {
        forceUnmount,
        transitionStatus
    };
}
function usePopupInteractionProps(store, statePart) {
    store.useSyncedValues(statePart);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "usePopupInteractionProps.useIsoLayoutEffect": ()=>({
                "usePopupInteractionProps.useIsoLayoutEffect": ()=>{
                    store.update({
                        activeTriggerProps: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_OBJECT"],
                        inactiveTriggerProps: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_OBJECT"],
                        popupProps: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_OBJECT"]
                    });
                }
            })["usePopupInteractionProps.useIsoLayoutEffect"]
    }["usePopupInteractionProps.useIsoLayoutEffect"], [
        store
    ]);
}
function usePopupRootSync(store, open) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "usePopupRootSync.useIsoLayoutEffect": ()=>{
            if (!open && store.state.openMethod !== null) {
                store.set('openMethod', null);
            }
        }
    }["usePopupRootSync.useIsoLayoutEffect"], [
        open,
        store
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "usePopupRootSync.useIsoLayoutEffect": ()=>({
                "usePopupRootSync.useIsoLayoutEffect": ()=>{
                    if (store.state.openMethod !== null) {
                        store.set('openMethod', null);
                    }
                }
            })["usePopupRootSync.useIsoLayoutEffect"]
    }["usePopupRootSync.useIsoLayoutEffect"], [
        store
    ]);
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/popups/popupTriggerMap.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PopupTriggerMap",
    ()=>PopupTriggerMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * Development-only reverse index of element to registered id, keyed by the owning map.
 *
 * Registration would otherwise have to scan every entry to detect an element claimed by two ids,
 * making the mount of many triggers sharing one handle quadratic. Kept module-scoped, lazily
 * initialized, and read only from `process.env.NODE_ENV` guards so production builds drop it along
 * with the checks.
 */ let devElementIdsByMap;
function getDevElementIds(map) {
    devElementIdsByMap ??= new WeakMap();
    let elementIds = devElementIdsByMap.get(map);
    if (!elementIds) {
        elementIds = new WeakMap();
        devElementIdsByMap.set(map, elementIds);
    }
    return elementIds;
}
class PopupTriggerMap {
    constructor(){
        this.idMap = new Map();
    }
    /**
   * Adds a trigger element with the given ID.
   *
   * Note: The provided element is assumed to not be registered under multiple IDs.
   */ add(id, element) {
        if ("TURBOPACK compile-time truthy", 1) {
            const elementIds = getDevElementIds(this);
            const existingId = elementIds.get(element);
            if (existingId !== undefined && existingId !== id) {
                // TODO: fix mui/no-guarded-throw
                // eslint-disable-next-line mui/no-guarded-throw
                throw new Error('Base UI: A trigger element cannot be registered under multiple IDs in PopupTriggerMap.');
            }
            // Reusing an id for a different element evicts the previous one, so it must lose its claim
            // on the id or a later registration under a different id would be reported as a duplicate.
            const previousElement = this.idMap.get(id);
            if (previousElement !== undefined && previousElement !== element) {
                elementIds.delete(previousElement);
            }
            elementIds.set(element, id);
        }
        this.idMap.set(id, element);
    }
    /**
   * Removes the trigger element with the given ID.
   */ delete(id) {
        if ("TURBOPACK compile-time truthy", 1) {
            const element = this.idMap.get(id);
            if (element !== undefined) {
                devElementIdsByMap?.get(this)?.delete(element);
            }
        }
        this.idMap.delete(id);
    }
    /**
   * Whether the given element is registered as a trigger.
   */ hasElement(element) {
        for (const registered of this.idMap.values()){
            if (registered === element) {
                return true;
            }
        }
        return false;
    }
    /**
   * Whether there is a registered trigger element matching the given predicate.
   */ hasMatchingElement(predicate) {
        for (const element of this.idMap.values()){
            if (predicate(element)) {
                return true;
            }
        }
        return false;
    }
    /**
   * Returns the trigger element associated with the given ID, or undefined if no such element exists.
   */ getById(id) {
        return this.idMap.get(id);
    }
    /**
   * Returns an iterable of all registered trigger entries, where each entry is a tuple of [id, element].
   */ entries() {
        return this.idMap.entries();
    }
    /**
   * Returns an iterable of all registered trigger elements.
   */ elements() {
        return this.idMap.values();
    }
    /**
   * Returns the number of registered trigger elements.
   */ get size() {
        return this.idMap.size;
    }
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/popups/store.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createInitialPopupStoreState",
    ()=>createInitialPopupStoreState,
    "createPopupFloatingRootContext",
    ()=>createPopupFloatingRootContext,
    "popupStoreSelectors",
    ()=>popupStoreSelectors
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/empty.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$components$2f$FloatingRootStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/floating-ui-react/components/FloatingRootStore.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$getEmptyRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/floating-ui-react/utils/getEmptyRootContext.mjs [app-client] (ecmascript)");
;
;
;
function createInitialPopupStoreState() {
    return {
        open: false,
        openProp: undefined,
        mounted: false,
        transitionStatus: undefined,
        floatingRootContext: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$getEmptyRootContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEmptyRootContext"])(),
        floatingId: undefined,
        triggerCount: 0,
        preventUnmountingOnClose: false,
        payload: undefined,
        activeTriggerId: null,
        activeTriggerElement: null,
        triggerIdProp: undefined,
        popupElement: null,
        positionerElement: null,
        activeTriggerProps: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_OBJECT"],
        inactiveTriggerProps: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_OBJECT"],
        popupProps: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_OBJECT"]
    };
}
function createPopupFloatingRootContext(triggerElements, floatingId, nested = false) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$components$2f$FloatingRootStore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingRootStore"]({
        open: false,
        transitionStatus: undefined,
        floatingElement: null,
        referenceElement: null,
        triggerElements,
        floatingId,
        syncOnly: true,
        nested,
        onOpenChange: undefined
    });
}
const activeTriggerIdSelector = (state)=>state.triggerIdProp ?? state.activeTriggerId;
const openSelector = (state)=>state.openProp ?? state.open;
const popupIdSelector = (state)=>{
    const popupId = state.popupElement?.id ?? state.floatingId;
    return popupId || undefined;
};
function triggerOwnsOpenPopup(state, triggerId) {
    return triggerId !== undefined && openSelector(state) && activeTriggerIdSelector(state) === triggerId;
}
function triggerOwnsOpenPopupOrIsOnlyTrigger(state, triggerId) {
    if (triggerOwnsOpenPopup(state, triggerId)) {
        return true;
    }
    return triggerId !== undefined && openSelector(state) && activeTriggerIdSelector(state) == null && state.triggerCount === 1;
}
const popupStoreSelectors = {
    open: openSelector,
    mounted: (state)=>state.mounted,
    transitionStatus: (state)=>state.transitionStatus,
    floatingRootContext: (state)=>state.floatingRootContext,
    triggerCount: (state)=>state.triggerCount,
    preventUnmountingOnClose: (state)=>state.preventUnmountingOnClose,
    payload: (state)=>state.payload,
    activeTriggerId: activeTriggerIdSelector,
    activeTriggerElement: (state)=>state.mounted ? state.activeTriggerElement : null,
    popupId: popupIdSelector,
    /**
   * Whether the trigger with the given ID was used to open the popup.
   */ isTriggerActive: (state, triggerId)=>triggerId !== undefined && activeTriggerIdSelector(state) === triggerId,
    /**
   * Whether the popup is open and was activated by a trigger with the given ID.
   */ isOpenedByTrigger: (state, triggerId)=>triggerOwnsOpenPopup(state, triggerId),
    /**
   * Whether the popup is mounted and was activated by a trigger with the given ID.
   */ isMountedByTrigger: (state, triggerId)=>triggerId !== undefined && activeTriggerIdSelector(state) === triggerId && state.mounted,
    triggerProps: (state, isActive)=>isActive ? state.activeTriggerProps : state.inactiveTriggerProps,
    /**
   * Popup id for the trigger that currently owns the open popup.
   */ triggerPopupId: (state, triggerId)=>triggerOwnsOpenPopupOrIsOnlyTrigger(state, triggerId) ? popupIdSelector(state) : undefined,
    popupProps: (state)=>state.popupProps,
    popupElement: (state)=>state.popupElement,
    positionerElement: (state)=>state.positionerElement
}; /**
 * Store members a detached handle-backed trigger reads or invokes for trigger registration and data
 * forwarding. `set`/`update` are included only for trigger-count and trigger-data bookkeeping; on a
 * detached (inert) store they are intentionally no-ops, so a write through them is not guaranteed to
 * be durable. Component handle-store views Pick these from their concrete store (preserving its
 * context and selectors) and add any component-specific trigger-invoked members such as `setOpen`.
 */  /**
 * The subset of a popup store that trigger registration and data forwarding rely on. Narrow enough
 * that an inert store can be passed while detached.
 */ 
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/popups/usePopupHandleStore.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePopupHandleStore",
    ()=>usePopupHandleStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/use-sync-external-store@1.6.0_react@19.2.8/node_modules/use-sync-external-store/shim/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/empty.mjs [app-client] (ecmascript)");
'use client';
;
;
;
function usePopupHandleStore(handle) {
    const subscribe = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "usePopupHandleStore.useCallback[subscribe]": (listener)=>{
            if (handle === undefined) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NOOP"];
            }
            return handle.subscribeStore(listener);
        }
    }["usePopupHandleStore.useCallback[subscribe]"], [
        handle
    ]);
    const getSnapshot = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "usePopupHandleStore.useCallback[getSnapshot]": ()=>{
            return handle === undefined ? undefined : handle.store;
        }
    }["usePopupHandleStore.useCallback[getSnapshot]"], [
        handle
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribe, getSnapshot, {
        "usePopupHandleStore.useSyncExternalStore": ()=>handle?.serverStore
    }["usePopupHandleStore.useSyncExternalStore"]);
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/popups/useTriggerFocusGuards.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTriggerFocusGuards",
    ()=>useTriggerFocusGuards
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/shadowDom.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$tabbable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/floating-ui-react/utils/tabbable.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/createBaseUIEventDetails.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/reason-parts.mjs [app-client] (ecmascript) <export * as REASONS>");
'use client';
;
;
;
;
;
function useTriggerFocusGuards(store, triggerElementRef) {
    const preFocusGuardRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    function handlePreFocusGuardFocus(event) {
        __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flushSync"](()=>{
            store.setOpen(false, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].focusOut, event.nativeEvent, event.currentTarget));
        });
        const previousTabbable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$tabbable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTabbableBeforeElement"])(preFocusGuardRef.current);
        previousTabbable?.focus();
    }
    function handleFocusTargetFocus(event) {
        const positionerElement = store.select('positionerElement');
        if (positionerElement && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$tabbable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isOutsideEvent"])(event, positionerElement)) {
            store.context.beforeContentFocusGuardRef.current?.focus();
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flushSync"](()=>{
                store.setOpen(false, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$createBaseUIEventDetails$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChangeEventDetails"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$reason$2d$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__REASONS$3e$__["REASONS"].focusOut, event.nativeEvent, event.currentTarget));
            });
            let nextTabbable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$tabbable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTabbableAfterElement"])(store.context.triggerFocusTargetRef.current || triggerElementRef.current);
            while(nextTabbable !== null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contains"])(positionerElement, nextTabbable)){
                const prevTabbable = nextTabbable;
                nextTabbable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$floating$2d$ui$2d$react$2f$utils$2f$tabbable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNextTabbable"])(nextTabbable);
                if (nextTabbable === prevTabbable) {
                    break;
                }
            }
            nextTabbable?.focus();
        }
    }
    return {
        preFocusGuardRef,
        handlePreFocusGuardFocus,
        handleFocusTargetFocus
    };
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/resolveAriaLabelledBy.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDefaultLabelId",
    ()=>getDefaultLabelId,
    "resolveAriaLabelledBy",
    ()=>resolveAriaLabelledBy
]);
'use client';
function getDefaultLabelId(id) {
    return id == null ? undefined : `${id}-label`;
}
function resolveAriaLabelledBy(fieldLabelId, localLabelId) {
    return fieldLabelId ?? localLabelId;
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/resolveClassName.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * If the provided className is a string, it will be returned as is.
 * Otherwise, the function will call the className function with the state as the first argument.
 *
 * @param className
 * @param state
 */ __turbopack_context__.s([
    "resolveClassName",
    ()=>resolveClassName
]);
function resolveClassName(className, state) {
    return typeof className === 'function' ? className(state) : className;
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/resolveRef.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * If the provided argument is a ref object, returns its `current` value.
 * Otherwise, returns the argument itself.
 */ __turbopack_context__.s([
    "resolveRef",
    ()=>resolveRef
]);
function resolveRef(maybeRef) {
    if (maybeRef == null) {
        return maybeRef;
    }
    return 'current' in maybeRef ? maybeRef.current : maybeRef;
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/resolveStyle.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * If the provided style is an object, it will be returned as is.
 * Otherwise, the function will call the style function with the state as the first argument.
 *
 * @param style
 * @param state
 */ __turbopack_context__.s([
    "resolveStyle",
    ()=>resolveStyle
]);
function resolveStyle(style, state) {
    return typeof style === 'function' ? style(state) : style;
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/scrollEdges.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SCROLL_EDGE_TOLERANCE_PX",
    ()=>SCROLL_EDGE_TOLERANCE_PX,
    "getMaxScrollOffset",
    ()=>getMaxScrollOffset,
    "normalizeScrollOffset",
    ()=>normalizeScrollOffset
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$clamp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/clamp.mjs [app-client] (ecmascript)");
;
const SCROLL_EDGE_TOLERANCE_PX = 1;
function getMaxScrollOffset(scrollSize, clientSize) {
    return Math.max(0, scrollSize - clientSize);
}
function normalizeScrollOffset(value, max) {
    if (max <= 0) {
        return 0;
    }
    const clamped = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$clamp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(value, 0, max);
    const startDistance = clamped;
    const endDistance = max - clamped;
    const withinStartTolerance = startDistance <= SCROLL_EDGE_TOLERANCE_PX;
    const withinEndTolerance = endDistance <= SCROLL_EDGE_TOLERANCE_PX;
    if (withinStartTolerance && withinEndTolerance) {
        return startDistance <= endDistance ? 0 : max;
    }
    if (withinStartTolerance) {
        return 0;
    }
    if (withinEndTolerance) {
        return max;
    }
    return clamped;
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/scrollable.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "findScrollableTouchTarget",
    ()=>findScrollableTouchTarget,
    "hasScrollableAncestor",
    ()=>hasScrollableAncestor,
    "isScrollable",
    ()=>isScrollable,
    "isScrollableX",
    ()=>isScrollableX,
    "isScrollableY",
    ()=>isScrollableY
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs [app-client] (ecmascript)");
;
function isScrollableY(element, allowOverflowIntent = false) {
    const { overflowY } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getComputedStyle"])(element);
    if (overflowY !== 'auto' && overflowY !== 'scroll') {
        return false;
    }
    // When `allowOverflowIntent` is true, a container that overflows only once extra space is
    // added (e.g. drawer keyboard scroll slack) still counts, as long as it has layout size on
    // the axis.
    return allowOverflowIntent ? element.clientHeight > 0 : element.scrollHeight > element.clientHeight;
}
function isScrollableX(element, allowOverflowIntent = false) {
    const { overflowX } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getComputedStyle"])(element);
    if (overflowX !== 'auto' && overflowX !== 'scroll') {
        return false;
    }
    return allowOverflowIntent ? element.clientWidth > 0 : element.scrollWidth > element.clientWidth;
}
function isScrollable(element, axis, allowOverflowIntent = false) {
    return axis === 'vertical' ? isScrollableY(element, allowOverflowIntent) : isScrollableX(element, allowOverflowIntent);
}
function hasScrollableAncestor(target, root, axes) {
    // `getParentNode` crosses shadow boundaries (and slots), so a target inside a shadow root
    // still walks up to scrollable ancestors in the light DOM.
    let node = target;
    while((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHTMLElement"])(node) && node !== root && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLastTraversableNode"])(node)){
        for (const axis of axes){
            if (isScrollable(node, axis)) {
                return true;
            }
        }
        node = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getParentNode"])(node);
    }
    return false;
}
function findScrollableTouchTarget(target, root, axis = 'vertical', allowOverflowIntent = false) {
    // `getParentNode` crosses shadow boundaries (and slots), so a target inside a shadow root
    // still reaches a scrollable ancestor in the light DOM.
    let node = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHTMLElement"])(target) ? target : null;
    while((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHTMLElement"])(node) && node !== root && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLastTraversableNode"])(node)){
        if (isScrollable(node, axis, allowOverflowIntent)) {
            return node;
        }
        node = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getParentNode"])(node);
    }
    return isScrollable(root, axis, allowOverflowIntent) ? root : null;
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/stringifyLocale.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "stringifyLocale",
    ()=>stringifyLocale
]);
function stringifyLocale(locale) {
    if (Array.isArray(locale)) {
        return locale.map((value)=>stringifyLocale(value)).join(',');
    }
    if (locale == null) {
        return '';
    }
    return String(locale);
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/styles.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "styleDisableScrollbar",
    ()=>styleDisableScrollbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
const DISABLE_SCROLLBAR_CLASS_NAME = 'base-ui-disable-scrollbar';
const styleDisableScrollbar = {
    className: DISABLE_SCROLLBAR_CLASS_NAME,
    getElement (nonce) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("style", {
            nonce: nonce,
            href: DISABLE_SCROLLBAR_CLASS_NAME,
            precedence: "base-ui:low",
            children: `.${DISABLE_SCROLLBAR_CLASS_NAME}{scrollbar-width:none}.${DISABLE_SCROLLBAR_CLASS_NAME}::-webkit-scrollbar{display:none}`
        });
    }
};
if ("TURBOPACK compile-time truthy", 1) styleDisableScrollbar.getElement.displayName = "styleDisableScrollbar.getElement";
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/useAnchoredPopupScrollLock.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAnchoredPopupScrollLock",
    ()=>useAnchoredPopupScrollLock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$owner$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/owner.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useScrollLock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useScrollLock.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useIsoLayoutEffect.mjs [app-client] (ecmascript)");
'use client';
;
;
;
;
// Touch-opened popups normally avoid scroll locking so users can still swipe outside to dismiss.
// This hook re-enables scroll lock only when the popup is effectively full-width.
// Treat popups with up to 20px of total horizontal gutter as full-width so common ~10px side
// padding still locks scroll, since that leaves too little outside space for a reliable swipe.
const VIEWPORT_WIDTH_TOLERANCE_PX = 20;
function useAnchoredPopupScrollLock(enabled, touchOpen, positionerElement, referenceElement) {
    const [touchOpenShouldLockScroll, setTouchOpenShouldLockScroll] = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "useAnchoredPopupScrollLock.useIsoLayoutEffect": ()=>{
            if (!enabled || !touchOpen || positionerElement == null) {
                setTouchOpenShouldLockScroll(false);
                return;
            }
            const viewportWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$owner$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ownerDocument"])(positionerElement).documentElement.clientWidth;
            const popupWidth = positionerElement.offsetWidth;
            setTouchOpenShouldLockScroll(viewportWidth > 0 && popupWidth > 0 && popupWidth >= viewportWidth - VIEWPORT_WIDTH_TOLERANCE_PX);
        }
    }["useAnchoredPopupScrollLock.useIsoLayoutEffect"], [
        enabled,
        touchOpen,
        positionerElement
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useScrollLock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScrollLock"])(enabled && (!touchOpen || touchOpenShouldLockScroll), referenceElement);
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/useFocusableWhenDisabled.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useFocusableWhenDisabled",
    ()=>useFocusableWhenDisabled
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
function useFocusableWhenDisabled(parameters) {
    const { focusableWhenDisabled, disabled, composite = false, tabIndex: tabIndexProp = 0, isNativeButton } = parameters;
    const isFocusableComposite = composite && focusableWhenDisabled !== false;
    const isNonFocusableComposite = composite && focusableWhenDisabled === false;
    // we can't explicitly assign `undefined` to any of these props because it
    // would otherwise prevent subsequently merged props from setting them
    const props = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "useFocusableWhenDisabled.useMemo[props]": ()=>{
            const additionalProps = {
                // allow Tabbing away from focusableWhenDisabled elements
                onKeyDown (event) {
                    if (disabled && focusableWhenDisabled && event.key !== 'Tab') {
                        event.preventDefault();
                    }
                }
            };
            if (!composite) {
                additionalProps.tabIndex = tabIndexProp;
                if (!isNativeButton && disabled) {
                    additionalProps.tabIndex = focusableWhenDisabled ? tabIndexProp : -1;
                }
            }
            if (isNativeButton && (focusableWhenDisabled || isFocusableComposite) || !isNativeButton && disabled) {
                additionalProps['aria-disabled'] = disabled;
            }
            if (isNativeButton && (!focusableWhenDisabled || isNonFocusableComposite)) {
                additionalProps.disabled = disabled;
            }
            return additionalProps;
        }
    }["useFocusableWhenDisabled.useMemo[props]"], [
        composite,
        disabled,
        focusableWhenDisabled,
        isFocusableComposite,
        isNonFocusableComposite,
        isNativeButton,
        tabIndexProp
    ]);
    return {
        props
    };
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/useIsHydrating.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useIsHydrating",
    ()=>useIsHydrating
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/use-sync-external-store@1.6.0_react@19.2.8/node_modules/use-sync-external-store/shim/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/empty.mjs [app-client] (ecmascript)");
;
;
function subscribe() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NOOP"];
}
function getSnapshot() {
    return false;
}
function getServerSnapshot() {
    return true;
}
function useIsHydrating() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$8$2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribe, getSnapshot, getServerSnapshot);
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/useMixedToggleClickHandler.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMixedToggleClickHandler",
    ()=>useMixedToggleClickHandler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$owner$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/owner.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/empty.mjs [app-client] (ecmascript)");
'use client';
;
;
;
function useMixedToggleClickHandler(params) {
    const { enabled = true, mouseDownAction, open } = params;
    const ignoreClickRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    return __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "useMixedToggleClickHandler.useMemo": ()=>{
            if (!enabled) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_OBJECT"];
            }
            return {
                onMouseDown: ({
                    "useMixedToggleClickHandler.useMemo": (event)=>{
                        if (mouseDownAction === 'open' && !open || mouseDownAction === 'close' && open) {
                            ignoreClickRef.current = true;
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$owner$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ownerDocument"])(event.currentTarget).addEventListener('click', {
                                "useMixedToggleClickHandler.useMemo": ()=>{
                                    ignoreClickRef.current = false;
                                }
                            }["useMixedToggleClickHandler.useMemo"], {
                                once: true
                            });
                        }
                    }
                })["useMixedToggleClickHandler.useMemo"],
                onClick: ({
                    "useMixedToggleClickHandler.useMemo": (event)=>{
                        if (ignoreClickRef.current) {
                            ignoreClickRef.current = false;
                            event.preventBaseUIHandler();
                        }
                    }
                })["useMixedToggleClickHandler.useMemo"]
            };
        }
    }["useMixedToggleClickHandler.useMemo"], [
        enabled,
        mouseDownAction,
        open
    ]);
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/useOpenInteractionType.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOpenInteractionType",
    ()=>useOpenInteractionType,
    "useOpenMethodTriggerProps",
    ()=>useOpenMethodTriggerProps
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useStableCallback.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useEnhancedClickHandler$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useEnhancedClickHandler.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__platform$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/platform/parts.mjs [app-client] (ecmascript) <export * as platform>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useValueChanged$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/useValueChanged.mjs [app-client] (ecmascript)");
'use client';
;
;
;
;
;
function useOpenMethodTriggerProps(open, setOpenMethod) {
    const handleTriggerClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "useOpenMethodTriggerProps.useStableCallback[handleTriggerClick]": (_, interactionType)=>{
            const isOpen = typeof open === 'function' ? open() : open;
            if (!isOpen) {
                setOpenMethod(interactionType || (// On iOS Safari, the hitslop around touch targets means tapping outside an element's
                // bounds does not fire `pointerdown` but does fire `mousedown`. The `interactionType`
                // will be "" in that case.
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$platform$2f$parts$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__platform$3e$__["platform"].os.ios ? 'touch' : ''));
            }
        }
    }["useOpenMethodTriggerProps.useStableCallback[handleTriggerClick]"]);
    const { onClick, onPointerDown } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useEnhancedClickHandler$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEnhancedClickHandler"])(handleTriggerClick);
    return __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "useOpenMethodTriggerProps.useMemo": ()=>({
                onClick,
                onPointerDown
            })
    }["useOpenMethodTriggerProps.useMemo"], [
        onClick,
        onPointerDown
    ]);
}
function useOpenInteractionType(open) {
    const [openMethod, setOpenMethod] = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const triggerProps = useOpenMethodTriggerProps(open, setOpenMethod);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useValueChanged$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useValueChanged"])(open, {
        "useOpenInteractionType.useValueChanged": (previousOpen)=>{
            if (previousOpen && !open) {
                setOpenMethod(null);
            }
        }
    }["useOpenInteractionType.useValueChanged"]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "useOpenInteractionType.useMemo": ()=>({
                openMethod,
                triggerProps
            })
    }["useOpenInteractionType.useMemo"], [
        openMethod,
        triggerProps
    ]);
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/usePopupAutoResize.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePopupAutoResize",
    ()=>usePopupAutoResize
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useAnimationFrame$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useAnimationFrame.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useIsoLayoutEffect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useStableCallback.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/empty.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useAnimationsFinished$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/useAnimationsFinished.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$getCssDimensions$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/getCssDimensions.mjs [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function usePopupAutoResize(parameters) {
    const { popupElement, positionerElement, content, mounted, onMeasureLayout: onMeasureLayoutParam, onMeasureLayoutComplete: onMeasureLayoutCompleteParam, side, direction } = parameters;
    const runOnceAnimationsFinish = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useAnimationsFinished$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnimationsFinished"])(popupElement, true);
    const animationFrame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useAnimationFrame$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnimationFrame"])();
    const committedDimensionsRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const isInitialRenderRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](true);
    const restoreAnchoringStylesRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NOOP"]);
    const onMeasureLayout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])(onMeasureLayoutParam);
    const onMeasureLayoutComplete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])(onMeasureLayoutCompleteParam);
    const anchoringStyles = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "usePopupAutoResize.useMemo[anchoringStyles]": ()=>getPopupAnchoringStyles(side, direction)
    }["usePopupAutoResize.useMemo[anchoringStyles]"], [
        side,
        direction
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "usePopupAutoResize.useIsoLayoutEffect": ()=>{
            // Reset the state when the popup is closed.
            if (!mounted) {
                restoreAnchoringStylesRef.current = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NOOP"];
                isInitialRenderRef.current = true;
                committedDimensionsRef.current = null;
                return undefined;
            }
            if (!popupElement || !positionerElement) {
                return undefined;
            }
            restoreAnchoringStylesRef.current = applyElementStyles(popupElement, anchoringStyles);
            // Measure the rendered size to enable transitions:
            setPopupCssSize(popupElement, 'auto');
            const restorePopupPosition = overrideElementStyle(popupElement, 'position', 'static');
            const restorePopupTransform = overrideElementStyle(popupElement, 'transform', 'none');
            const restorePopupScale = overrideElementStyle(popupElement, 'scale', '1');
            const restorePositionerAvailableSize = applyElementStyles(positionerElement, {
                '--available-width': 'max-content',
                '--available-height': 'max-content'
            });
            function restoreMeasurementOverrides() {
                restorePopupPosition();
                restorePopupTransform();
                restorePositionerAvailableSize();
            }
            function restoreMeasurementOverridesIncludingScale() {
                restoreMeasurementOverrides();
                restorePopupScale();
            }
            onMeasureLayout?.();
            // Initial render (for each time the popup opens).
            if (isInitialRenderRef.current || committedDimensionsRef.current === null) {
                setPositionerCssSize(positionerElement, 'max-content');
                const dimensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$getCssDimensions$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCssDimensions"])(popupElement);
                committedDimensionsRef.current = dimensions;
                setPositionerCssSize(positionerElement, dimensions);
                restoreMeasurementOverridesIncludingScale();
                onMeasureLayoutComplete?.(null, dimensions);
                isInitialRenderRef.current = false;
                return ({
                    "usePopupAutoResize.useIsoLayoutEffect": ()=>{
                        restoreAnchoringStylesRef.current();
                        restoreAnchoringStylesRef.current = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NOOP"];
                    }
                })["usePopupAutoResize.useIsoLayoutEffect"];
            }
            // Subsequent renders while open (when `content` changes).
            setPositionerCssSize(positionerElement, 'max-content');
            const previousDimensions = committedDimensionsRef.current;
            const newDimensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$getCssDimensions$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCssDimensions"])(popupElement);
            // Commit immediately so future content changes have a stable previous size.
            committedDimensionsRef.current = newDimensions;
            setPopupCssSize(popupElement, previousDimensions);
            restoreMeasurementOverridesIncludingScale();
            onMeasureLayoutComplete?.(previousDimensions, newDimensions);
            setPositionerCssSize(positionerElement, newDimensions);
            const abortController = new AbortController();
            animationFrame.request({
                "usePopupAutoResize.useIsoLayoutEffect": ()=>{
                    setPopupCssSize(popupElement, newDimensions);
                    runOnceAnimationsFinish({
                        "usePopupAutoResize.useIsoLayoutEffect": ()=>{
                            popupElement.style.setProperty('--popup-width', 'auto');
                            popupElement.style.setProperty('--popup-height', 'auto');
                        }
                    }["usePopupAutoResize.useIsoLayoutEffect"], abortController.signal);
                }
            }["usePopupAutoResize.useIsoLayoutEffect"]);
            return ({
                "usePopupAutoResize.useIsoLayoutEffect": ()=>{
                    abortController.abort();
                    animationFrame.cancel();
                    restoreAnchoringStylesRef.current();
                    restoreAnchoringStylesRef.current = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NOOP"];
                }
            })["usePopupAutoResize.useIsoLayoutEffect"];
        }
    }["usePopupAutoResize.useIsoLayoutEffect"], [
        content,
        popupElement,
        positionerElement,
        runOnceAnimationsFinish,
        animationFrame,
        mounted,
        onMeasureLayout,
        onMeasureLayoutComplete,
        anchoringStyles
    ]);
}
function getPopupAnchoringStyles(side, direction) {
    // Ensure popup size transitions correctly when anchored to `bottom` (side=top) or `right` (side=left).
    const isPhysicalTop = side === 'top';
    const isPhysicalLeft = side === 'left' || side === (direction === 'rtl' ? 'inline-end' : 'inline-start');
    if (!isPhysicalTop && !isPhysicalLeft) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMPTY_OBJECT"];
    }
    return {
        position: 'absolute',
        [isPhysicalTop ? 'bottom' : 'top']: '0',
        [isPhysicalLeft ? 'right' : 'left']: '0'
    };
}
function overrideElementStyle(element, property, value) {
    const originalValue = element.style.getPropertyValue(property);
    element.style.setProperty(property, value);
    return ()=>{
        element.style.setProperty(property, originalValue);
    };
}
function applyElementStyles(element, styles) {
    const restorers = [];
    for (const [key, value] of Object.entries(styles)){
        restorers.push(overrideElementStyle(element, key, value));
    }
    return restorers.length ? ()=>{
        restorers.forEach((restore)=>restore());
    } : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$empty$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NOOP"];
}
function setPopupCssSize(popupElement, size) {
    const width = size === 'auto' ? 'auto' : `${size.width}px`;
    const height = size === 'auto' ? 'auto' : `${size.height}px`;
    popupElement.style.setProperty('--popup-width', width);
    popupElement.style.setProperty('--popup-height', height);
}
function setPositionerCssSize(positionerElement, size) {
    const width = size === 'max-content' ? 'max-content' : `${size.width}px`;
    const height = size === 'max-content' ? 'max-content' : `${size.height}px`;
    positionerElement.style.setProperty('--positioner-width', width);
    positionerElement.style.setProperty('--positioner-height', height);
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/usePopupViewport.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "popupViewportStateMapping",
    ()=>popupViewportStateMapping,
    "usePopupViewport",
    ()=>usePopupViewport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$inertValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/inertValue.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useAnimationFrame$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useAnimationFrame.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$usePreviousValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/usePreviousValue.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useIsoLayoutEffect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useStableCallback.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$owner$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/owner.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useAnimationsFinished$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/useAnimationsFinished.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$usePopupAutoResize$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/usePopupAutoResize.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$direction$2d$context$2f$DirectionContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/direction-context/DirectionContext.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$adaptiveOriginMiddleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/adaptiveOriginMiddleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
'use client';
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
const popupViewportStateMapping = {
    activationDirection: (value)=>value ? {
            'data-activation-direction': value
        } : null
};
function usePopupViewport(parameters) {
    const { store, side, children } = parameters;
    const direction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$direction$2d$context$2f$DirectionContext$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDirection"])();
    const activeTrigger = store.useState('activeTriggerElement');
    const activeTriggerId = store.useState('activeTriggerId');
    const open = store.useState('open');
    const payload = store.useState('payload');
    const mounted = store.useState('mounted');
    const popupElement = store.useState('popupElement');
    const positionerElement = store.useState('positionerElement');
    const previousActiveTrigger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$usePreviousValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePreviousValue"])(open ? activeTrigger : null);
    // Remount current content on trigger changes (and once more when payload lags) to avoid DOM reuse flashes.
    // The key bumps immediately on trigger switches, then again if the payload arrives on a later render.
    const currentContentKey = usePopupContentKey(activeTriggerId, payload);
    const capturedNodeRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const [previousContentNode, setPreviousContentNode] = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [newTriggerOffset, setNewTriggerOffset] = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const currentContainerRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const previousContainerRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const onAnimationsFinished = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useAnimationsFinished$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnimationsFinished"])(currentContainerRef, true);
    const cleanupFrame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useAnimationFrame$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnimationFrame"])();
    const cleanupControllerRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const [previousContentDimensions, setPreviousContentDimensions] = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [showStartingStyleAttribute, setShowStartingStyleAttribute] = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "usePopupViewport.useIsoLayoutEffect": ()=>{
            store.set('adaptiveOrigin', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$adaptiveOriginMiddleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adaptiveOrigin"]);
            return ({
                "usePopupViewport.useIsoLayoutEffect": ()=>{
                    store.set('adaptiveOrigin', undefined);
                }
            })["usePopupViewport.useIsoLayoutEffect"];
        }
    }["usePopupViewport.useIsoLayoutEffect"], [
        store
    ]);
    const handleMeasureLayout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "usePopupViewport.useStableCallback[handleMeasureLayout]": ()=>{
            currentContainerRef.current?.style.setProperty('animation', 'none');
            currentContainerRef.current?.style.setProperty('transition', 'none');
            previousContainerRef.current?.style.setProperty('display', 'none');
        }
    }["usePopupViewport.useStableCallback[handleMeasureLayout]"]);
    const handleMeasureLayoutComplete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "usePopupViewport.useStableCallback[handleMeasureLayoutComplete]": (previousDimensions)=>{
            currentContainerRef.current?.style.removeProperty('animation');
            currentContainerRef.current?.style.removeProperty('transition');
            previousContainerRef.current?.style.removeProperty('display');
            if (previousDimensions) {
                setPreviousContentDimensions(previousDimensions);
            }
        }
    }["usePopupViewport.useStableCallback[handleMeasureLayoutComplete]"]);
    const armViewportCleanup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "usePopupViewport.useStableCallback[armViewportCleanup]": ()=>{
            cleanupControllerRef.current?.abort();
            const controller = new AbortController();
            cleanupControllerRef.current = controller;
            onAnimationsFinished({
                "usePopupViewport.useStableCallback[armViewportCleanup]": ()=>{
                    setPreviousContentNode(null);
                    setPreviousContentDimensions(null);
                    capturedNodeRef.current = null;
                }
            }["usePopupViewport.useStableCallback[armViewportCleanup]"], controller.signal);
        }
    }["usePopupViewport.useStableCallback[armViewportCleanup]"]);
    const lastHandledTriggerRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "usePopupViewport.useIsoLayoutEffect": ()=>{
            if (!open || !mounted) {
                lastHandledTriggerRef.current = null;
            }
        }
    }["usePopupViewport.useIsoLayoutEffect"], [
        open,
        mounted
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "usePopupViewport.useIsoLayoutEffect": ()=>{
            // When a trigger changes, set the captured children HTML to state,
            // so we can render both new and old content.
            if (activeTrigger && previousActiveTrigger && activeTrigger !== previousActiveTrigger && lastHandledTriggerRef.current !== activeTrigger && capturedNodeRef.current) {
                setPreviousContentNode(capturedNodeRef.current);
                setShowStartingStyleAttribute(true);
                // Calculate the relative position between the previous and new trigger,
                // so we can pass it to the style hook for animation purposes.
                const offset = calculateRelativePosition(previousActiveTrigger, activeTrigger);
                setNewTriggerOffset(offset);
                lastHandledTriggerRef.current = activeTrigger;
            }
        }
    }["usePopupViewport.useIsoLayoutEffect"], [
        activeTrigger,
        previousActiveTrigger
    ]);
    // Arm cleanup after a trigger change, and re-arm it if the current container remounts
    // mid-transition when a lagging payload bumps `currentContentKey`. The remount discards
    // the running entry animation (and with transition-style CSS the replacement mounts at
    // final styles with no animation at all), so re-run the starting-style choreography —
    // otherwise the watcher either strands or fires before the previous container's exit
    // animation finishes.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "usePopupViewport.useIsoLayoutEffect": ()=>{
            if (previousContentNode == null) {
                return;
            }
            // Abort the stale watcher synchronously. The remount cancels the old container's
            // animations, and the resulting promise rejection would otherwise run the cleanup
            // in a microtask before the re-armed watcher below is in place.
            cleanupControllerRef.current?.abort();
            setShowStartingStyleAttribute(true);
            cleanupFrame.request({
                "usePopupViewport.useIsoLayoutEffect": ()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flushSync"]({
                        "usePopupViewport.useIsoLayoutEffect": ()=>{
                            setShowStartingStyleAttribute(false);
                        }
                    }["usePopupViewport.useIsoLayoutEffect"]);
                    armViewportCleanup();
                }
            }["usePopupViewport.useIsoLayoutEffect"]);
        }
    }["usePopupViewport.useIsoLayoutEffect"], [
        currentContentKey,
        previousContentNode,
        armViewportCleanup,
        cleanupFrame
    ]);
    // Capture a clone of the current content DOM subtree when not transitioning.
    // We can't store previous React nodes as they may be stateful; instead we capture DOM clones for visual continuity.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "usePopupViewport.useIsoLayoutEffect": ()=>{
            // When a transition is in progress, we store the next content in capturedNodeRef.
            // This handles the case where the trigger changes multiple times before the transition finishes.
            // We want to always capture the latest content for the previous snapshot.
            // So clicking quickly on T1, T2, T3 will result in the following sequence:
            // 1. T1 -> T2: previousContent = T1, currentContent = T2
            // 2. T2 -> T3: previousContent = T2, currentContent = T3
            const source = currentContainerRef.current;
            if (!source) {
                return;
            }
            const wrapper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$owner$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ownerDocument"])(source).createElement('div');
            for (const child of Array.from(source.childNodes)){
                wrapper.appendChild(child.cloneNode(true));
            }
            capturedNodeRef.current = wrapper;
        }
    }["usePopupViewport.useIsoLayoutEffect"]);
    const isTransitioning = previousContentNode != null;
    let childrenToRender;
    if (!isTransitioning) {
        childrenToRender = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
            "data-current": true,
            ref: currentContainerRef,
            children: children
        }, currentContentKey);
    } else {
        childrenToRender = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                    "data-previous": true,
                    inert: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$inertValue$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inertValue"])(true),
                    ref: previousContainerRef,
                    style: {
                        ...previousContentDimensions ? {
                            '--popup-width': `${previousContentDimensions.width}px`,
                            '--popup-height': `${previousContentDimensions.height}px`
                        } : null,
                        position: 'absolute'
                    },
                    "data-ending-style": showStartingStyleAttribute ? undefined : ''
                }, "previous"),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                    "data-current": true,
                    ref: currentContainerRef,
                    "data-starting-style": showStartingStyleAttribute ? '' : undefined,
                    children: children
                }, currentContentKey)
            ]
        });
    }
    // When previousContentNode is present, imperatively populate the previous container with the cloned children.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "usePopupViewport.useIsoLayoutEffect": ()=>{
            const container = previousContainerRef.current;
            if (!container || !previousContentNode) {
                return;
            }
            container.replaceChildren(...Array.from(previousContentNode.childNodes));
        }
    }["usePopupViewport.useIsoLayoutEffect"], [
        previousContentNode
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$usePopupAutoResize$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePopupAutoResize"])({
        popupElement,
        positionerElement,
        mounted,
        content: payload,
        onMeasureLayout: handleMeasureLayout,
        onMeasureLayoutComplete: handleMeasureLayoutComplete,
        side,
        direction
    });
    const state = {
        activationDirection: getActivationDirection(newTriggerOffset),
        transitioning: isTransitioning
    };
    return {
        children: childrenToRender,
        state
    };
}
/**
 * Returns a string describing the provided offset.
 * It describes both the horizontal and vertical offset, separated by a space.
 *
 * @param offset
 */ function getActivationDirection(offset) {
    if (!offset) {
        return undefined;
    }
    return `${getValueWithTolerance(offset.horizontal, 5, 'right', 'left')} ${getValueWithTolerance(offset.vertical, 5, 'down', 'up')}`;
}
/**
 * Returns a label describing the value (positive/negative) treating values
 * within tolerance as zero.
 *
 * @param value Value to check
 * @param tolerance Tolerance to treat the value as zero.
 * @param positiveLabel
 * @param negativeLabel
 * @returns If 0 < abs(value) < tolerance, returns an empty string. Otherwise returns positiveLabel or negativeLabel.
 */ function getValueWithTolerance(value, tolerance, positiveLabel, negativeLabel) {
    if (value > tolerance) {
        return positiveLabel;
    }
    if (value < -tolerance) {
        return negativeLabel;
    }
    return '';
}
/**
 * Calculates the relative position between centers of two elements.
 */ function calculateRelativePosition(from, to) {
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();
    const fromCenter = {
        x: fromRect.left + fromRect.width / 2,
        y: fromRect.top + fromRect.height / 2
    };
    const toCenter = {
        x: toRect.left + toRect.width / 2,
        y: toRect.top + toRect.height / 2
    };
    return {
        horizontal: toCenter.x - fromCenter.x,
        vertical: toCenter.y - fromCenter.y
    };
}
/**
 * Returns a key that forces remounting content when triggers change or a payload is updated.
 */ function usePopupContentKey(activeTriggerId, payload) {
    const [contentKey, setContentKey] = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](0);
    const previousActiveTriggerIdRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](activeTriggerId);
    const previousPayloadRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](payload);
    const pendingPayloadUpdateRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "usePopupContentKey.useIsoLayoutEffect": ()=>{
            // Compare against the last committed values to decide whether we need a new DOM subtree.
            const previousActiveTriggerId = previousActiveTriggerIdRef.current;
            const previousPayload = previousPayloadRef.current;
            const triggerIdChanged = activeTriggerId !== previousActiveTriggerId;
            const payloadChanged = payload !== previousPayload;
            if (triggerIdChanged) {
                // Remount immediately on trigger change; remember if payload hasn't caught up yet.
                setContentKey({
                    "usePopupContentKey.useIsoLayoutEffect": (value)=>value + 1
                }["usePopupContentKey.useIsoLayoutEffect"]);
                pendingPayloadUpdateRef.current = !payloadChanged;
            } else if (pendingPayloadUpdateRef.current && payloadChanged) {
                // Payload arrived a render later, so remount once more to avoid reusing the old <img>.
                setContentKey({
                    "usePopupContentKey.useIsoLayoutEffect": (value)=>value + 1
                }["usePopupContentKey.useIsoLayoutEffect"]);
                pendingPayloadUpdateRef.current = false;
            }
            // Persist current values for the next render's comparison.
            previousActiveTriggerIdRef.current = activeTriggerId;
            previousPayloadRef.current = payload;
        }
    }["usePopupContentKey.useIsoLayoutEffect"], [
        activeTriggerId,
        payload
    ]);
    return `${activeTriggerId ?? 'current'}-${contentKey}`;
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/usePositioner.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePositioner",
    ()=>usePositioner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$popupStateMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/popupStateMapping.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/useRenderElement.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$getDisabledMountTransitionStyles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/getDisabledMountTransitionStyles.mjs [app-client] (ecmascript)");
'use client';
;
;
;
function usePositioner(componentProps, state, { styles, transitionStatus, props, refs, hidden, inert = false }) {
    const style = {
        ...styles
    };
    if (inert) {
        style.pointerEvents = 'none';
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useRenderElement$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRenderElement"])('div', componentProps, {
        state,
        ref: refs,
        props: [
            {
                role: 'presentation',
                hidden,
                style
            },
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$getDisabledMountTransitionStyles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDisabledMountTransitionStyles"])(transitionStatus),
            props
        ],
        stateAttributesMapping: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$popupStateMapping$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["popupStateMapping"]
    });
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/useRegisteredLabelId.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useRegisteredLabelId",
    ()=>useRegisteredLabelId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useIsoLayoutEffect.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useBaseUiId$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/useBaseUiId.mjs [app-client] (ecmascript)");
'use client';
;
;
function useRegisteredLabelId(idProp, setLabelId) {
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$useBaseUiId$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBaseUiId"])(idProp);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useIsoLayoutEffect$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsoLayoutEffect"])({
        "useRegisteredLabelId.useIsoLayoutEffect": ()=>{
            setLabelId(id);
            return ({
                "useRegisteredLabelId.useIsoLayoutEffect": ()=>{
                    setLabelId({
                        "useRegisteredLabelId.useIsoLayoutEffect": (currentId)=>currentId === id ? undefined : currentId
                    }["useRegisteredLabelId.useIsoLayoutEffect"]);
                }
            })["useRegisteredLabelId.useIsoLayoutEffect"];
        }
    }["useRegisteredLabelId.useIsoLayoutEffect"], [
        id,
        setLabelId
    ]);
    return id;
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/useSwipeDismiss.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDisplacement",
    ()=>getDisplacement,
    "getElementTransform",
    ()=>getElementTransform,
    "useSwipeDismiss",
    ()=>useSwipeDismiss
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/useStableCallback.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$owner$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+utils@0.3.2_@types+react@19.2.18_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/utils/owner.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__getWindow__as__ownerWindow$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs [app-client] (ecmascript) <export getWindow as ownerWindow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/shadowDom.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$scrollable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/scrollable.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$clamp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/internals/clamp.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$getElementAtPoint$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/getElementAtPoint.mjs [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
;
const DEFAULT_SWIPE_THRESHOLD = 40;
const REVERSE_CANCEL_THRESHOLD = 10;
const MIN_DRAG_THRESHOLD = 1;
const MIN_VELOCITY_DURATION_MS = 50;
const MIN_RELEASE_VELOCITY_DURATION_MS = 16;
const MAX_RELEASE_VELOCITY_AGE_MS = 80;
const DEFAULT_IGNORE_SELECTOR = 'button,a,input,select,textarea,label,[role="button"]';
function getDisplacement(direction, deltaX, deltaY) {
    switch(direction){
        case 'up':
            return -deltaY;
        case 'down':
            return deltaY;
        case 'left':
            return -deltaX;
        case 'right':
            return deltaX;
        default:
            return 0;
    }
}
function getElementTransform(element) {
    const computedStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$floating$2d$ui$2b$utils$40$0$2e$2$2e$12$2f$node_modules$2f40$floating$2d$ui$2f$utils$2f$dist$2f$floating$2d$ui$2e$utils$2e$dom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__getWindow__as__ownerWindow$3e$__["ownerWindow"])(element).getComputedStyle(element);
    const transform = computedStyle.transform;
    let translateX = 0;
    let translateY = 0;
    let scale = 1;
    if (transform && transform !== 'none') {
        const matrix = transform.match(/matrix(?:3d)?\(([^)]+)\)/);
        if (matrix) {
            const values = matrix[1].split(', ').map(parseFloat);
            if (values.length === 6) {
                translateX = values[4];
                translateY = values[5];
                scale = Math.sqrt(values[0] * values[0] + values[1] * values[1]);
            } else if (values.length === 16) {
                translateX = values[12];
                translateY = values[13];
                scale = values[0];
            }
        }
    }
    return {
        x: translateX,
        y: translateY,
        scale
    };
}
function getValidTimeStamp(timeStamp) {
    return Number.isFinite(timeStamp) && timeStamp > 0 ? timeStamp : null;
}
function getDragTransform(dragOffset, scale) {
    return `translate3d(${dragOffset.x}px,${dragOffset.y}px,0) scale(${scale})`;
}
function hasPrimaryMouseButton(buttons) {
    return buttons % 2 === 1;
}
function safelyChangePointerCapture(element, pointerId, method) {
    const pointerCaptureMethod = element[method];
    if (typeof pointerCaptureMethod !== 'function') {
        return;
    }
    try {
        pointerCaptureMethod.call(element, pointerId);
    } catch (error) {
        if (error && typeof error === 'object' && 'name' in error && error.name === 'NotFoundError') {
            return;
        }
        throw error;
    }
}
function useSwipeDismiss(options) {
    const { enabled, directions, elementRef, movementCssVars, canStart, ignoreSelectorWhenTouch = true, ignoreScrollableAncestors = false, swipeThreshold: swipeThresholdProp, onDismiss, onProgress, onCancel, onSwipeStart, onRelease, onSwipingChange, trackDrag = true } = options;
    const ignoreSelector = DEFAULT_IGNORE_SELECTOR;
    const primaryDirection = directions.length === 1 ? directions[0] : undefined;
    const swipeThresholdDefault = Math.max(0, typeof swipeThresholdProp === 'number' ? swipeThresholdProp : DEFAULT_SWIPE_THRESHOLD);
    const allowLeft = directions.includes('left');
    const allowRight = directions.includes('right');
    const allowUp = directions.includes('up');
    const allowDown = directions.includes('down');
    const hasHorizontal = allowLeft || allowRight;
    const hasVertical = allowUp || allowDown;
    const scrollAxes = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "useSwipeDismiss.useMemo[scrollAxes]": ()=>{
            const axes = [];
            if (hasVertical) {
                axes.push('vertical');
            }
            if (hasHorizontal) {
                axes.push('horizontal');
            }
            return axes;
        }
    }["useSwipeDismiss.useMemo[scrollAxes]"], [
        hasHorizontal,
        hasVertical
    ]);
    const [currentSwipeDirection, setCurrentSwipeDirection] = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](undefined);
    const [isSwiping, setIsSwiping] = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [dragDismissed, setDragDismissed] = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const dragStartPosRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"]({
        x: 0,
        y: 0
    });
    const dragOffsetRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"]({
        x: 0,
        y: 0
    });
    const lastMovePosRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const initialTransformRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"]({
        x: 0,
        y: 0,
        scale: 1
    });
    const intendedSwipeDirectionRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](undefined);
    const maxSwipeDisplacementRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](0);
    const cancelledSwipeRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    const swipeCancelBaselineRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"]({
        x: 0,
        y: 0
    });
    const lockedDirectionRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const isFirstPointerMoveRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    const pendingSwipeRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    const pendingSwipeStartPosRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const swipeFromScrollableRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    const sawPrimaryButtonsOnMoveRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    const elementSizeRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"]({
        width: 0,
        height: 0
    });
    const swipeProgressRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](0);
    const swipeThresholdRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](swipeThresholdDefault);
    const swipeThresholdFunctionRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const swipeStartTimeRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const lastDragSampleRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const lastDragVelocityRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"]({
        x: 0,
        y: 0
    });
    const lastProgressDetailsRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const isSwipingRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](false);
    const dragStyleSnapshotRef = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const setSwiping = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "useSwipeDismiss.useStableCallback[setSwiping]": (nextSwiping)=>{
            if (isSwipingRef.current === nextSwiping) {
                return;
            }
            isSwipingRef.current = nextSwiping;
            setIsSwiping(nextSwiping);
            onSwipingChange?.(nextSwiping);
        }
    }["useSwipeDismiss.useStableCallback[setSwiping]"]);
    function resolveSwipeThreshold(direction) {
        if (!direction) {
            return;
        }
        const element = elementRef.current;
        const thresholdFunction = swipeThresholdFunctionRef.current;
        if (!element || !thresholdFunction) {
            return;
        }
        const value = thresholdFunction({
            element,
            direction
        });
        swipeThresholdRef.current = Math.max(0, value);
    }
    const updateSwipeProgress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "useSwipeDismiss.useStableCallback[updateSwipeProgress]": (progress, details)=>{
            const nextProgress = Number.isFinite(progress) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$clamp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clamp"])(progress, 0, 1) : 0;
            const progressChanged = nextProgress !== swipeProgressRef.current;
            let detailsChanged = false;
            if (details) {
                const lastDetails = lastProgressDetailsRef.current;
                detailsChanged = !lastDetails || lastDetails.deltaX !== details.deltaX || lastDetails.deltaY !== details.deltaY || lastDetails.direction !== details.direction;
            }
            if (!progressChanged && !detailsChanged) {
                return;
            }
            swipeProgressRef.current = nextProgress;
            if (details) {
                lastProgressDetailsRef.current = details;
            } else if (progressChanged) {
                lastProgressDetailsRef.current = null;
            }
            onProgress?.(nextProgress, details);
        }
    }["useSwipeDismiss.useStableCallback[updateSwipeProgress]"]);
    const syncDragStyles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "useSwipeDismiss.useStableCallback[syncDragStyles]": (swiping)=>{
            const element = elementRef.current;
            if (!trackDrag || !element) {
                if (!swiping) {
                    dragStyleSnapshotRef.current = null;
                }
                return;
            }
            const style = element.style;
            const dragStyleSnapshot = dragStyleSnapshotRef.current;
            if (swiping) {
                if (!dragStyleSnapshot) {
                    dragStyleSnapshotRef.current = [
                        style.transition,
                        style.transform
                    ];
                }
                style.transition = 'none';
            } else if (dragStyleSnapshot) {
                [style.transition, style.transform] = dragStyleSnapshot;
                dragStyleSnapshotRef.current = null;
            }
            const dragOffset = dragOffsetRef.current;
            const initialTransform = initialTransformRef.current;
            const deltaX = dragOffset.x - initialTransform.x;
            const deltaY = dragOffset.y - initialTransform.y;
            if (swiping) {
                style.transform = getDragTransform(dragOffset, initialTransform.scale);
            }
            style.setProperty(movementCssVars.x, `${deltaX}px`);
            style.setProperty(movementCssVars.y, `${deltaY}px`);
        }
    }["useSwipeDismiss.useStableCallback[syncDragStyles]"]);
    function recordDragSample(offset, timeStamp) {
        if (timeStamp === null) {
            return;
        }
        const lastSample = lastDragSampleRef.current;
        if (lastSample && timeStamp > lastSample.time) {
            const durationMs = Math.max(timeStamp - lastSample.time, MIN_RELEASE_VELOCITY_DURATION_MS);
            lastDragVelocityRef.current = {
                x: (offset.x - lastSample.x) / durationMs,
                y: (offset.y - lastSample.y) / durationMs
            };
        }
        lastDragSampleRef.current = {
            x: offset.x,
            y: offset.y,
            time: timeStamp
        };
    }
    const reset = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useSwipeDismiss.useCallback[reset]": ()=>{
            setCurrentSwipeDirection(undefined);
            setSwiping(false);
            setDragDismissed(false);
            updateSwipeProgress(0);
            swipeThresholdRef.current = swipeThresholdDefault;
            swipeThresholdFunctionRef.current = null;
            dragStartPosRef.current = {
                x: 0,
                y: 0
            };
            dragOffsetRef.current = {
                x: 0,
                y: 0
            };
            initialTransformRef.current = {
                x: 0,
                y: 0,
                scale: 1
            };
            intendedSwipeDirectionRef.current = undefined;
            maxSwipeDisplacementRef.current = 0;
            cancelledSwipeRef.current = false;
            swipeCancelBaselineRef.current = {
                x: 0,
                y: 0
            };
            lockedDirectionRef.current = null;
            isFirstPointerMoveRef.current = false;
            lastMovePosRef.current = null;
            pendingSwipeRef.current = false;
            pendingSwipeStartPosRef.current = null;
            swipeFromScrollableRef.current = false;
            sawPrimaryButtonsOnMoveRef.current = false;
            elementSizeRef.current = {
                width: 0,
                height: 0
            };
            swipeStartTimeRef.current = null;
            lastDragSampleRef.current = null;
            lastDragVelocityRef.current = {
                x: 0,
                y: 0
            };
            lastProgressDetailsRef.current = null;
            syncDragStyles(false);
        }
    }["useSwipeDismiss.useCallback[reset]"], [
        setSwiping,
        swipeThresholdDefault,
        syncDragStyles,
        updateSwipeProgress
    ]);
    function getPrimaryPointerPosition(event) {
        if ('touches' in event) {
            const touch = event.touches[0];
            return touch ? {
                x: touch.clientX,
                y: touch.clientY
            } : null;
        }
        return {
            x: event.clientX,
            y: event.clientY
        };
    }
    function isTouchLikeEvent(event) {
        if ('touches' in event) {
            return true;
        }
        return event.pointerType === 'touch';
    }
    function getTargetAtPoint(position, nativeEvent) {
        const root = elementRef.current?.getRootNode();
        const elementAtPoint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$getElementAtPoint$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getElementAtPoint"])(root, position.x, position.y);
        const target = elementAtPoint ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTarget"])(nativeEvent);
        return target;
    }
    function findGestureScrollableTouchTarget(target, root) {
        if (hasHorizontal && !hasVertical) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$scrollable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findScrollableTouchTarget"])(target, root, 'horizontal');
        }
        if (hasVertical && !hasHorizontal) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$scrollable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findScrollableTouchTarget"])(target, root, 'vertical');
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$scrollable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findScrollableTouchTarget"])(target, root, 'vertical') ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$scrollable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findScrollableTouchTarget"])(target, root, 'horizontal');
    }
    function startSwipeAtPosition(event, position, startOptions) {
        swipeFromScrollableRef.current = false;
        const touchLike = isTouchLikeEvent(event);
        const target = getTargetAtPoint(position, event.nativeEvent);
        const doc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$owner$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ownerDocument"])(elementRef.current);
        const body = doc.body;
        const scrollableTarget = touchLike && body ? findGestureScrollableTouchTarget(target, body) : null;
        const ignoreScrollableTarget = startOptions?.ignoreScrollableTarget ?? false;
        if (scrollableTarget && !ignoreScrollableTarget) {
            return false;
        }
        swipeFromScrollableRef.current = Boolean(scrollableTarget && ignoreScrollableTarget);
        const isInteractiveElement = target ? target.closest(ignoreSelector) : false;
        if (isInteractiveElement && (!touchLike || ignoreSelectorWhenTouch)) {
            return false;
        }
        const element = elementRef.current;
        if (ignoreScrollableAncestors && element && target && scrollAxes.length > 0) {
            const ignoreAncestors = startOptions?.ignoreScrollableAncestors ?? false;
            if (!ignoreAncestors && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$utils$2f$scrollable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasScrollableAncestor"])(target, element, scrollAxes)) {
                return false;
            }
        }
        cancelledSwipeRef.current = false;
        intendedSwipeDirectionRef.current = undefined;
        maxSwipeDisplacementRef.current = 0;
        dragStartPosRef.current = position;
        swipeStartTimeRef.current = getValidTimeStamp(event.timeStamp);
        swipeCancelBaselineRef.current = position;
        lastMovePosRef.current = position;
        swipeThresholdRef.current = swipeThresholdDefault;
        swipeThresholdFunctionRef.current = typeof swipeThresholdProp === 'function' ? swipeThresholdProp : null;
        if (element) {
            elementSizeRef.current = {
                width: element.offsetWidth,
                height: element.offsetHeight
            };
            resolveSwipeThreshold(primaryDirection);
            const transform = getElementTransform(element);
            initialTransformRef.current = transform;
            dragOffsetRef.current = {
                x: transform.x,
                y: transform.y
            };
            recordDragSample({
                x: transform.x,
                y: transform.y
            }, swipeStartTimeRef.current);
            if (!('touches' in event)) {
                safelyChangePointerCapture(element, event.pointerId, 'setPointerCapture');
            }
        }
        onSwipeStart?.(event.nativeEvent);
        setSwiping(true);
        lockedDirectionRef.current = null;
        isFirstPointerMoveRef.current = true;
        updateSwipeProgress(0);
        syncDragStyles(true);
        return true;
    }
    function resetPendingSwipeState() {
        clearPendingSwipeStartState();
        swipeFromScrollableRef.current = false;
        lastMovePosRef.current = null;
    }
    function clearPendingSwipeStartState() {
        pendingSwipeRef.current = false;
        pendingSwipeStartPosRef.current = null;
    }
    function cancelSwipeInteraction(event) {
        resetPendingSwipeState();
        if (!isSwipingRef.current) {
            return;
        }
        setSwiping(false);
        lockedDirectionRef.current = null;
        const resolvedInitialTransform = initialTransformRef.current;
        dragOffsetRef.current = {
            x: resolvedInitialTransform.x,
            y: resolvedInitialTransform.y
        };
        setCurrentSwipeDirection(undefined);
        sawPrimaryButtonsOnMoveRef.current = false;
        syncDragStyles(false);
        const element = elementRef.current;
        if (element) {
            safelyChangePointerCapture(element, event.pointerId, 'releasePointerCapture');
        }
        updateSwipeProgress(0, {
            deltaX: 0,
            deltaY: 0,
            direction: undefined
        });
        onCancel?.(event.nativeEvent);
    }
    function applyDirectionalDamping(deltaX, deltaY) {
        const exponent = (value)=>Math.sign(value) * Math.abs(value) ** 0.5;
        const dampAxis = (delta, allowNegative, allowPositive)=>{
            if (!allowNegative && delta < 0 || !allowPositive && delta > 0) {
                return exponent(delta);
            }
            return delta;
        };
        const newDeltaX = hasHorizontal ? dampAxis(deltaX, allowLeft, allowRight) : exponent(deltaX);
        const newDeltaY = hasVertical ? dampAxis(deltaY, allowUp, allowDown) : exponent(deltaY);
        return {
            x: newDeltaX,
            y: newDeltaY
        };
    }
    function canSwipeFromScrollEdgeOnPendingMove(scrollTarget, deltaX, deltaY) {
        // Swiping toward the axis start edge (down/right) is allowed when scrolled to the start;
        // toward the end edge (up/left) when scrolled to the end.
        const canSwipeOnAxis = (delta, scrollOffset, maxScrollOffset, allowTowardStart, allowTowardEnd)=>delta > 0 && scrollOffset <= 0 && allowTowardStart || delta < 0 && scrollOffset >= Math.max(0, maxScrollOffset) && allowTowardEnd;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        if (hasVertical && deltaY !== 0 && (!hasHorizontal || absDeltaY >= absDeltaX)) {
            return canSwipeOnAxis(deltaY, scrollTarget.scrollTop, scrollTarget.scrollHeight - scrollTarget.clientHeight, allowDown, allowUp);
        }
        if (hasHorizontal && deltaX !== 0 && (!hasVertical || absDeltaX > absDeltaY)) {
            return canSwipeOnAxis(deltaX, scrollTarget.scrollLeft, scrollTarget.scrollWidth - scrollTarget.clientWidth, allowRight, allowLeft);
        }
        return null;
    }
    const handleStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "useSwipeDismiss.useStableCallback[handleStart]": (event)=>{
            if (!enabled) {
                return;
            }
            if (event.defaultPrevented || event.nativeEvent.defaultPrevented) {
                return;
            }
            if (!('touches' in event) && event.button !== 0) {
                return;
            }
            const startPos = getPrimaryPointerPosition(event);
            if (!startPos) {
                return;
            }
            pendingSwipeRef.current = true;
            pendingSwipeStartPosRef.current = startPos;
            swipeFromScrollableRef.current = false;
            sawPrimaryButtonsOnMoveRef.current = !('touches' in event);
            const allowedToStart = canStart ? canStart(startPos, {
                nativeEvent: event.nativeEvent,
                direction: primaryDirection
            }) : true;
            if (!allowedToStart) {
                return;
            }
            if (startSwipeAtPosition(event, startPos)) {
                clearPendingSwipeStartState();
            }
        }
    }["useSwipeDismiss.useStableCallback[handleStart]"]);
    function handleMoveCore(event, position, movement) {
        if (!enabled || !isSwipingRef.current) {
            return;
        }
        const target = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTarget"])(event.nativeEvent);
        if (isTouchLikeEvent(event) && !swipeFromScrollableRef.current) {
            const boundaryElement = event.currentTarget;
            if (findGestureScrollableTouchTarget(target, boundaryElement)) {
                return;
            }
        }
        if (!('touches' in event)) {
            // Prevent text selection on Safari
            event.preventDefault();
        }
        if (isFirstPointerMoveRef.current) {
            isFirstPointerMoveRef.current = false;
            // Reset the drag origin to the first move's position to absorb the gap between the press and
            // the first move event — notably on iOS touch, where the first `touchmove` arrives already
            // offset from the `touchstart` — which would otherwise make the dragged element jump. This
            // only matters when an element follows the pointer; when `trackDrag` is false (e.g. the
            // swipe-area, which only opens the drawer) keep the original press position so a quick flick
            // still registers: on a low-refresh-rate display the whole travel can land in this single
            // first move, and discarding it would drop the gesture.
            if (trackDrag) {
                dragStartPosRef.current = position;
                const moveTime = getValidTimeStamp(event.timeStamp);
                if (moveTime !== null) {
                    swipeStartTimeRef.current = moveTime;
                }
            }
        }
        const clientX = position.x;
        const clientY = position.y;
        const movementX = movement.x;
        const movementY = movement.y;
        if (movementY < 0 && clientY > swipeCancelBaselineRef.current.y || movementY > 0 && clientY < swipeCancelBaselineRef.current.y) {
            swipeCancelBaselineRef.current = {
                x: swipeCancelBaselineRef.current.x,
                y: clientY
            };
        }
        if (movementX < 0 && clientX > swipeCancelBaselineRef.current.x || movementX > 0 && clientX < swipeCancelBaselineRef.current.x) {
            swipeCancelBaselineRef.current = {
                x: clientX,
                y: swipeCancelBaselineRef.current.y
            };
        }
        const deltaX = clientX - dragStartPosRef.current.x;
        const deltaY = clientY - dragStartPosRef.current.y;
        const cancelDeltaY = clientY - swipeCancelBaselineRef.current.y;
        const cancelDeltaX = clientX - swipeCancelBaselineRef.current.x;
        let lockedDirection = lockedDirectionRef.current;
        if (lockedDirection === null && hasHorizontal && hasVertical) {
            const movementDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            if (movementDistance >= MIN_DRAG_THRESHOLD) {
                lockedDirection = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
                lockedDirectionRef.current = lockedDirection;
            }
        }
        let candidate;
        if (!intendedSwipeDirectionRef.current) {
            if (lockedDirection === 'vertical') {
                if (deltaY > 0) {
                    candidate = 'down';
                } else if (deltaY < 0) {
                    candidate = 'up';
                }
            } else if (lockedDirection === 'horizontal') {
                if (deltaX > 0) {
                    candidate = 'right';
                } else if (deltaX < 0) {
                    candidate = 'left';
                }
            } else if (Math.abs(deltaX) >= Math.abs(deltaY)) {
                candidate = deltaX > 0 ? 'right' : 'left';
            } else {
                candidate = deltaY > 0 ? 'down' : 'up';
            }
            if (candidate) {
                const isAllowed = candidate === 'left' && allowLeft || candidate === 'right' && allowRight || candidate === 'up' && allowUp || candidate === 'down' && allowDown;
                if (isAllowed) {
                    intendedSwipeDirectionRef.current = candidate;
                    maxSwipeDisplacementRef.current = getDisplacement(candidate, deltaX, deltaY);
                    setCurrentSwipeDirection(candidate);
                    resolveSwipeThreshold(candidate);
                }
            }
        } else {
            const direction = intendedSwipeDirectionRef.current;
            const currentDisplacement = getDisplacement(direction, cancelDeltaX, cancelDeltaY);
            if (currentDisplacement > swipeThresholdRef.current) {
                cancelledSwipeRef.current = false;
                setCurrentSwipeDirection(direction);
            } else if (!(allowLeft && allowRight) && !(allowUp && allowDown) && maxSwipeDisplacementRef.current - currentDisplacement >= REVERSE_CANCEL_THRESHOLD) {
                // Mark that a change-of-mind has occurred
                cancelledSwipeRef.current = true;
            }
        }
        const dampedDelta = applyDirectionalDamping(deltaX, deltaY);
        let newOffsetX = initialTransformRef.current.x;
        let newOffsetY = initialTransformRef.current.y;
        if (lockedDirection === 'horizontal') {
            if (hasHorizontal) {
                newOffsetX += dampedDelta.x;
            }
        } else if (lockedDirection === 'vertical') {
            if (hasVertical) {
                newOffsetY += dampedDelta.y;
            }
        } else {
            if (hasHorizontal) {
                newOffsetX += dampedDelta.x;
            }
            if (hasVertical) {
                newOffsetY += dampedDelta.y;
            }
        }
        // Only rewrite drag styles when the drag offset actually changed. `syncDragStyles` writes the
        // raw (undamped) frozen transform and movement vars, relying on the consumer's `onProgress`
        // to overwrite them with damped styles — but `updateSwipeProgress` dedupes unchanged
        // deltas and skips `onProgress`. A move that doesn't change the offset (e.g. the cursor
        // pinned at a screen edge during an off-screen drag, jittering only on the ignored axis)
        // would otherwise reinstate the raw styles with no correction, jumping the element to the
        // undamped position.
        const previousOffset = dragOffsetRef.current;
        const offsetChanged = newOffsetX !== previousOffset.x || newOffsetY !== previousOffset.y;
        dragOffsetRef.current = {
            x: newOffsetX,
            y: newOffsetY
        };
        if (offsetChanged) {
            syncDragStyles(true);
        }
        recordDragSample({
            x: newOffsetX,
            y: newOffsetY
        }, getValidTimeStamp(event.timeStamp));
        const dragDeltaX = newOffsetX - initialTransformRef.current.x;
        const dragDeltaY = newOffsetY - initialTransformRef.current.y;
        const progressDetails = {
            deltaX: dragDeltaX,
            deltaY: dragDeltaY,
            direction: intendedSwipeDirectionRef.current
        };
        let progress = 0;
        const progressDirection = primaryDirection ?? intendedSwipeDirectionRef.current;
        if (progressDirection) {
            const size = progressDirection === 'left' || progressDirection === 'right' ? elementSizeRef.current.width : elementSizeRef.current.height;
            const scale = initialTransformRef.current.scale || 1;
            const progressDisplacement = getDisplacement(progressDirection, dragDeltaX, dragDeltaY);
            if (size > 0 && scale > 0 && progressDisplacement > 0) {
                progress = progressDisplacement / (size * scale);
            }
        }
        updateSwipeProgress(progress, progressDetails);
    }
    const handleEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "useSwipeDismiss.useStableCallback[handleEnd]": (event)=>{
            if (!enabled) {
                return;
            }
            const resolvedDragOffset = dragOffsetRef.current;
            const resolvedInitialTransform = initialTransformRef.current;
            const releaseDeltaX = resolvedDragOffset.x - resolvedInitialTransform.x;
            const releaseDeltaY = resolvedDragOffset.y - resolvedInitialTransform.y;
            const progressDetails = {
                deltaX: releaseDeltaX,
                deltaY: releaseDeltaY,
                direction: intendedSwipeDirectionRef.current
            };
            if (!isSwipingRef.current) {
                resetPendingSwipeState();
                updateSwipeProgress(0, progressDetails);
                return;
            }
            setSwiping(false);
            lockedDirectionRef.current = null;
            resetPendingSwipeState();
            sawPrimaryButtonsOnMoveRef.current = false;
            const element = elementRef.current;
            if (element) {
                if (!('touches' in event)) {
                    safelyChangePointerCapture(element, event.pointerId, 'releasePointerCapture');
                }
            }
            const deltaX = releaseDeltaX;
            const deltaY = releaseDeltaY;
            const startTime = swipeStartTimeRef.current;
            const endTime = getValidTimeStamp(event.timeStamp);
            const durationMs = startTime !== null && endTime !== null && endTime > startTime ? endTime - startTime : 0;
            const velocityDurationMs = durationMs > 0 ? Math.max(durationMs, MIN_VELOCITY_DURATION_MS) : 0;
            const velocityX = velocityDurationMs > 0 ? deltaX / velocityDurationMs : 0;
            const velocityY = velocityDurationMs > 0 ? deltaY / velocityDurationMs : 0;
            let releaseVelocityX = lastDragVelocityRef.current.x;
            let releaseVelocityY = lastDragVelocityRef.current.y;
            const lastSample = lastDragSampleRef.current;
            if (lastSample && endTime !== null && endTime >= lastSample.time) {
                const ageMs = endTime - lastSample.time;
                if (ageMs <= MAX_RELEASE_VELOCITY_AGE_MS) {
                    const sampleDurationMs = Math.max(ageMs, MIN_RELEASE_VELOCITY_DURATION_MS);
                    const deltaFromLastSampleX = resolvedDragOffset.x - lastSample.x;
                    const deltaFromLastSampleY = resolvedDragOffset.y - lastSample.y;
                    const sampleVelocityX = deltaFromLastSampleX / sampleDurationMs;
                    const sampleVelocityY = deltaFromLastSampleY / sampleDurationMs;
                    if (sampleVelocityX !== 0) {
                        releaseVelocityX = sampleVelocityX;
                    }
                    if (sampleVelocityY !== 0) {
                        releaseVelocityY = sampleVelocityY;
                    }
                } else {
                    releaseVelocityX = 0;
                    releaseVelocityY = 0;
                }
            }
            const releaseDecision = onRelease?.({
                event: event.nativeEvent,
                direction: intendedSwipeDirectionRef.current,
                deltaX,
                deltaY,
                velocityX,
                velocityY,
                releaseVelocityX,
                releaseVelocityY
            });
            const hasReleaseDecision = typeof releaseDecision === 'boolean';
            if (cancelledSwipeRef.current && !hasReleaseDecision) {
                dragOffsetRef.current = {
                    x: resolvedInitialTransform.x,
                    y: resolvedInitialTransform.y
                };
                setCurrentSwipeDirection(undefined);
                syncDragStyles(false);
                updateSwipeProgress(0, progressDetails);
                return;
            }
            let shouldClose = false;
            let dismissDirection;
            if (hasReleaseDecision) {
                shouldClose = releaseDecision;
                dismissDirection = intendedSwipeDirectionRef.current ?? primaryDirection;
            } else {
                for (const direction of directions){
                    if (getDisplacement(direction, deltaX, deltaY) > swipeThresholdRef.current) {
                        shouldClose = true;
                        dismissDirection = direction;
                        break;
                    }
                }
            }
            if (shouldClose && dismissDirection) {
                setCurrentSwipeDirection(dismissDirection);
                setDragDismissed(true);
                syncDragStyles(false);
                onDismiss?.(event.nativeEvent, {
                    direction: dismissDirection
                });
            } else {
                dragOffsetRef.current = {
                    x: resolvedInitialTransform.x,
                    y: resolvedInitialTransform.y
                };
                setCurrentSwipeDirection(undefined);
                syncDragStyles(false);
                updateSwipeProgress(0, progressDetails);
            }
        }
    }["useSwipeDismiss.useStableCallback[handleEnd]"]);
    const handleMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "useSwipeDismiss.useStableCallback[handleMove]": (event)=>{
            const currentPos = getPrimaryPointerPosition(event);
            if (!currentPos) {
                return;
            }
            let endAfterMove = false;
            if (!('touches' in event)) {
                const hasPrimaryButton = hasPrimaryMouseButton(event.buttons);
                if (hasPrimaryButton) {
                    sawPrimaryButtonsOnMoveRef.current = true;
                }
                // Cancel the swipe if a non-primary button takes over the interaction.
                // This handles cases where a right-click interrupts dragging.
                if (event.buttons !== 0 && !hasPrimaryButton) {
                    cancelSwipeInteraction(event);
                    return;
                }
                // A `buttons: 0` pointermove means the primary button was already released, so the gesture is
                // over even if no pointerup reached us. On fast trackpad flicks this trailing move is
                // dispatched just before pointerup; treat it as the release (mirroring touchend) instead of
                // cancelling and snapping the element back.
                if (event.buttons === 0 && sawPrimaryButtonsOnMoveRef.current) {
                    if (!isSwipingRef.current) {
                        // The gesture never activated — discard it.
                        handleEnd(event);
                        return;
                    }
                    // This release move can itself carry the threshold-crossing displacement (and the peak
                    // release velocity), so let it flow through `handleMoveCore` below to update the drag
                    // offset / velocity sample, then commit the release afterwards.
                    endAfterMove = true;
                }
            }
            if (!isSwiping && pendingSwipeRef.current) {
                if (!isTouchLikeEvent(event) && (event.defaultPrevented || event.nativeEvent.defaultPrevented)) {
                    resetPendingSwipeState();
                    return;
                }
                const allowedToStart = canStart ? canStart(currentPos, {
                    nativeEvent: event.nativeEvent,
                    direction: primaryDirection
                }) : true;
                if (allowedToStart) {
                    const pendingStartPos = pendingSwipeStartPosRef.current;
                    let ignoreScrollableOnStart = false;
                    if (isTouchLikeEvent(event)) {
                        const element = elementRef.current;
                        if (pendingStartPos && element) {
                            const target = getTargetAtPoint(currentPos, event.nativeEvent);
                            const doc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$owner$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ownerDocument"])(element);
                            const body = doc.body;
                            const scrollTarget = body ? findGestureScrollableTouchTarget(target, body) : null;
                            if (scrollTarget && ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contains"])(element, scrollTarget) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$react$40$1$2e$7$2e$0_$40$date$2d$fns$2b$tz$40$1$2e$5$2e$0_$40$types$2b$react$40$19$2e$2$2e$18_date$2d$fns$40$4$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$react$2f$internals$2f$shadowDom$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contains"])(scrollTarget, element))) {
                                const deltaX = currentPos.x - pendingStartPos.x;
                                const deltaY = currentPos.y - pendingStartPos.y;
                                const canSwipeFromEdge = canSwipeFromScrollEdgeOnPendingMove(scrollTarget, deltaX, deltaY);
                                if (canSwipeFromEdge === false) {
                                    return;
                                }
                                if (canSwipeFromEdge === true) {
                                    ignoreScrollableOnStart = true;
                                }
                            }
                        }
                    }
                    const started = startSwipeAtPosition(event, currentPos, {
                        ignoreScrollableTarget: ignoreScrollableOnStart,
                        ignoreScrollableAncestors: ignoreScrollableOnStart
                    });
                    if (started) {
                        if (pendingStartPos && ignoreScrollableOnStart) {
                            // Preserve displacement between touchstart and the move that activates swipe from
                            // a scroll-edge so quick flicks can dismiss.
                            clearPendingSwipeStartState();
                            dragStartPosRef.current = pendingStartPos;
                            swipeCancelBaselineRef.current = pendingStartPos;
                            lastMovePosRef.current = pendingStartPos;
                            isFirstPointerMoveRef.current = false;
                        } else {
                            // Start from the current in-bounds position without dropping follow-up move
                            // displacement; this avoids jumps when entering from outside the element while
                            // keeping swipe tracking responsive on the next move.
                            clearPendingSwipeStartState();
                            swipeFromScrollableRef.current = false;
                        }
                    }
                }
            }
            const previousPos = lastMovePosRef.current;
            const movement = previousPos === null ? {
                x: 0,
                y: 0
            } : {
                x: currentPos.x - previousPos.x,
                y: currentPos.y - previousPos.y
            };
            lastMovePosRef.current = currentPos;
            handleMoveCore(event, currentPos, movement);
            // `endAfterMove` is only set in the non-touch branch above; the `'touches'` guard re-narrows the
            // event type for `handleEnd` after the shared move handling has run.
            if (endAfterMove && !('touches' in event)) {
                handleEnd(event);
            }
        }
    }["useSwipeDismiss.useStableCallback[handleMove]"]);
    // Feeds a native touchmove into the swipe pipeline. Used by consumers that claim the gesture
    // in a capture-phase listener and stop it from reaching React's delegated touch handlers.
    const moveNative = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$base$2d$ui$2b$utils$40$0$2e$3$2e$2_$40$types$2b$react$40$19$2e$2$2e$18_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f40$base$2d$ui$2f$utils$2f$useStableCallback$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStableCallback"])({
        "useSwipeDismiss.useStableCallback[moveNative]": (nativeEvent, currentTarget)=>{
            handleMove({
                touches: nativeEvent.touches,
                currentTarget,
                nativeEvent,
                defaultPrevented: nativeEvent.defaultPrevented,
                timeStamp: nativeEvent.timeStamp
            });
        }
    }["useSwipeDismiss.useStableCallback[moveNative]"]);
    const getDragStyles = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useSwipeDismiss.useCallback[getDragStyles]": ()=>{
            // Read `isSwipingRef`, not the lagging `isSwiping` state, to match the imperative writer
            // `syncDragStyles`. Otherwise a render that commits before `setSwiping(true)` flushes strips the
            // transform it just wrote, flashing the popup to its resting position for a frame.
            const swiping = isSwipingRef.current;
            const dragOffset = dragOffsetRef.current;
            const initialTransform = initialTransformRef.current;
            const deltaX = dragOffset.x - initialTransform.x;
            const deltaY = dragOffset.y - initialTransform.y;
            if (!swiping && deltaX === 0 && deltaY === 0 && !dragDismissed) {
                return {
                    [movementCssVars.x]: '0px',
                    [movementCssVars.y]: '0px'
                };
            }
            return {
                transition: swiping ? 'none' : undefined,
                // While swiping, freeze the element at its current visual transform so it doesn't snap to the
                // end position.
                transform: swiping ? getDragTransform(dragOffset, initialTransform.scale) : undefined,
                [movementCssVars.x]: `${deltaX}px`,
                [movementCssVars.y]: `${deltaY}px`
            };
        }
    }["useSwipeDismiss.useCallback[getDragStyles]"], [
        dragDismissed,
        movementCssVars
    ]);
    const getPointerProps = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useSwipeDismiss.useCallback[getPointerProps]": ()=>{
            if (!enabled) {
                return {};
            }
            return {
                onPointerDown: handleStart,
                onPointerMove: handleMove,
                onPointerUp: handleEnd,
                onPointerCancel: handleEnd
            };
        }
    }["useSwipeDismiss.useCallback[getPointerProps]"], [
        enabled,
        handleEnd,
        handleMove,
        handleStart
    ]);
    const getTouchProps = __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useSwipeDismiss.useCallback[getTouchProps]": ()=>{
            if (!enabled) {
                return {};
            }
            return {
                onTouchStart: handleStart,
                onTouchMove: handleMove,
                onTouchEnd: handleEnd,
                onTouchCancel: handleEnd
            };
        }
    }["useSwipeDismiss.useCallback[getTouchProps]"], [
        enabled,
        handleEnd,
        handleMove,
        handleStart
    ]);
    return {
        swiping: isSwiping,
        swipeDirection: currentSwipeDirection,
        dragDismissed,
        getPointerProps,
        getTouchProps,
        moveNative,
        getDragStyles,
        reset
    };
}
}),
"[project]/node_modules/.pnpm/@base-ui+react@1.7.0_@date-fns+tz@1.5.0_@types+react@19.2.18_date-fns@4.4.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/@base-ui/react/utils/valueToPercent.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "valueToPercent",
    ()=>valueToPercent
]);
function valueToPercent(value, min, max) {
    return (value - min) * 100 / (max - min);
}
}),
]);

//# sourceMappingURL=03f1_%40base-ui_react_utils_1-17a2i._.js.map