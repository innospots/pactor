module.exports = [
"[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalAutoLinkPlugin.dev.mjs [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AutoLinkPlugin",
    ()=>AutoLinkPlugin
]);
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$link$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$link$2f$dist$2f$LexicalLink$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+link@0.48.0_typescript@5.9.3/node_modules/@lexical/link/dist/LexicalLink.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalComposerContext.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
;
;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ // Do not require this module directly! Use normal `invariant` calls.
function formatDevErrorMessage(message) {
    throw new Error(message);
}
function useAutoLink(editor, matchers, onChange, excludeParents) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!editor.hasNodes([
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$link$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$link$2f$dist$2f$LexicalLink$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AutoLinkNode"]
        ])) {
            {
                formatDevErrorMessage(`LexicalAutoLinkPlugin: AutoLinkNode not registered on editor`);
            }
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$link$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$link$2f$dist$2f$LexicalLink$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerAutoLink"])(editor, {
            changeHandlers: onChange ? [
                onChange
            ] : [],
            excludeParents: excludeParents ?? [],
            matchers
        });
    }, [
        editor,
        matchers,
        onChange,
        excludeParents
    ]);
}
/**
 * Automatically converts text that matches one of the provided `matchers` into
 * {@link AutoLinkNode}s as the user types, and reverts them back to plain text
 * when they no longer match. Provide `onChange` to react to links being
 * created, updated, or removed, and `excludeParents` to skip matching inside
 * particular ancestor nodes. The editor must have the {@link AutoLinkNode}
 * registered.
 *
 * This is a legacy plugin. When building an editor with the extension API,
 * configure {@link AutoLinkExtension} instead.
 *
 * @returns `null`, this plugin renders no DOM of its own.
 */ function AutoLinkPlugin({ matchers, onChange, excludeParents }) {
    const [editor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLexicalComposerContext"])();
    useAutoLink(editor, matchers, onChange, excludeParents);
    return null;
}
;
}),
"[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalCheckListPlugin.dev.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CheckListPlugin",
    ()=>CheckListPlugin
]);
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$list$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$list$2f$dist$2f$LexicalList$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+list@0.48.0_typescript@5.9.3/node_modules/@lexical/list/dist/LexicalList.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalComposerContext.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ /**
 * Enables check list support, wiring up the keyboard and pointer interactions
 * that toggle the checked state of check list items. Pass
 * `disableTakeFocusOnClick` to stop the editor from taking focus when a
 * checkbox is clicked.
 *
 * This is a legacy plugin. When building an editor with the extension API,
 * configure {@link CheckListExtension} instead.
 *
 * @returns `null`, this plugin renders no DOM of its own.
 */ function CheckListPlugin({ disableTakeFocusOnClick = false }) {
    const [editor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLexicalComposerContext"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$list$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$list$2f$dist$2f$LexicalList$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerCheckList"])(editor, {
            disableTakeFocusOnClick
        });
    }, [
        editor,
        disableTakeFocusOnClick
    ]);
    return null;
}
;
}),
"[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalComposerContext.dev.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LexicalComposerContext",
    ()=>LexicalComposerContext,
    "createLexicalComposerContext",
    ()=>createLexicalComposerContext,
    "useLexicalComposerContext",
    ()=>useLexicalComposerContext
]);
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ // Do not require this module directly! Use normal `invariant` calls.
function formatDevErrorMessage(message) {
    throw new Error(message);
}
/**
 * The context value provided alongside a {@link LexicalEditor} by a
 * {@link LexicalComposer}. It exposes a `getTheme()` function that resolves the
 * active {@link EditorThemeClasses}, falling back to any parent composer's
 * theme.
 */ /**
 * A tuple of the {@link LexicalEditor} and its
 * {@link LexicalComposerContextType}, as stored in {@link LexicalComposerContext}
 * and returned by {@link useLexicalComposerContext}.
 */ /**
 * The React context used to share the {@link LexicalEditor} and its
 * {@link LexicalComposerContextType} with descendant plugins and components.
 * Most code should read it through {@link useLexicalComposerContext} rather than
 * consuming the context directly.
 */ const LexicalComposerContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
/**
 * Creates a {@link LexicalComposerContextType} for a composer. Theme resolution
 * falls back to the optional `parent` context, so nested composers inherit the
 * parent's theme unless they provide their own.
 *
 * @param parent - The parent composer context to inherit from, if any.
 * @param theme - The theme classes for this composer, or `null`/`undefined` to
 * inherit from `parent`.
 * @returns The new composer context value.
 */ function createLexicalComposerContext(parent, theme) {
    let parentContext = null;
    if (parent != null) {
        parentContext = parent[1];
    }
    function getTheme() {
        if (theme != null) {
            return theme;
        }
        return parentContext != null ? parentContext.getTheme() : null;
    }
    return {
        getTheme
    };
}
/**
 * Returns the {@link LexicalEditor} and its {@link LexicalComposerContextType}
 * from the nearest {@link LexicalComposer} (or nested composer). This is the
 * primary way plugins and components access the editor instance.
 *
 * @returns The `[editor, context]` tuple for the current composer.
 * @throws If called outside of a LexicalComposer.
 */ function useLexicalComposerContext() {
    const composerContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(LexicalComposerContext);
    if (composerContext == null) {
        {
            formatDevErrorMessage(`LexicalComposerContext.useLexicalComposerContext: cannot find a LexicalComposerContext`);
        }
    }
    return composerContext;
}
;
}),
"[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalContentEditable.dev.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ContentEditable",
    ()=>ContentEditable,
    "ContentEditableElement",
    ()=>ContentEditableElement
]);
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalComposerContext.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lexical@0.48.0_typescript@5.9.3/node_modules/lexical/dist/Lexical.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$text$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$text$2f$dist$2f$LexicalText$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+text@0.48.0_typescript@5.9.3/node_modules/@lexical/text/dist/LexicalText.dev.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ function mergeRefs(...refs) {
    return (value)=>{
        for (const ref of refs){
            if (typeof ref === 'function') {
                ref(value);
            } else if (ref != null) {
                ref.current = value;
            }
        }
    };
}
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ // This workaround is no longer necessary in React 19,
// but we currently support React >=18.x
// https://github.com/facebook/react/pull/26395
const useLayoutEffectImpl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CAN_USE_DOM"] ? __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"] : __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"];
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ function ContentEditableElementImpl({ editor, ariaActiveDescendant, ariaAutoComplete, ariaControls, ariaDescribedBy, ariaErrorMessage, ariaExpanded, ariaInvalid, ariaLabel, ariaLabelledBy, ariaMultiline, ariaOwns, ariaRequired, autoCapitalize, className, id, role = 'textbox', spellCheck = true, style, tabIndex, 'data-testid': testid, ...rest }, ref) {
    const [isEditable, setEditable] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(editor.isEditable());
    const handleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((rootElement)=>{
        // defaultView is required for a root element.
        // In multi-window setups, the defaultView may not exist at certain points.
        if (rootElement && rootElement.ownerDocument && rootElement.ownerDocument.defaultView) {
            editor.setRootElement(rootElement);
        } else {
            editor.setRootElement(null);
        }
    }, [
        editor
    ]);
    const mergedRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>mergeRefs(ref, handleRef), [
        handleRef,
        ref
    ]);
    useLayoutEffectImpl(()=>{
        setEditable(editor.isEditable());
        return editor.registerEditableListener((currentIsEditable)=>{
            setEditable(currentIsEditable);
        });
    }, [
        editor
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
        "aria-activedescendant": isEditable ? ariaActiveDescendant : undefined,
        "aria-autocomplete": isEditable ? ariaAutoComplete : 'none',
        "aria-controls": isEditable ? ariaControls : undefined,
        "aria-describedby": ariaDescribedBy,
        ...ariaErrorMessage != null ? {
            'aria-errormessage': ariaErrorMessage
        } : {},
        "aria-expanded": isEditable && role === 'combobox' ? !!ariaExpanded : undefined,
        ...ariaInvalid != null ? {
            'aria-invalid': ariaInvalid
        } : {},
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-multiline": ariaMultiline,
        "aria-owns": isEditable ? ariaOwns : undefined,
        "aria-readonly": isEditable ? undefined : true,
        "aria-required": ariaRequired,
        autoCapitalize: autoCapitalize,
        className: className,
        contentEditable: isEditable,
        "data-testid": testid,
        id: id,
        ref: mergedRefs,
        role: role,
        spellCheck: spellCheck,
        style: style,
        tabIndex: tabIndex ?? (isEditable ? undefined : -1),
        ...rest
    });
}
/**
 * A lower-level building block for the editor's editable `<div>`. It binds the
 * given `editor` to the rendered element via
 * {@link LexicalEditor.setRootElement}, reflects the editor's editable state on
 * the `contentEditable` attribute, and applies the provided ARIA and HTML
 * attributes. Prefer {@link ContentEditable}, which reads the editor from
 * context and adds placeholder support, unless you need this extra control.
 */ const ContentEditableElement = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(ContentEditableElementImpl);
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ function canShowPlaceholderFromCurrentEditorState(editor) {
    const currentCanShowPlaceholder = editor.read('latest', (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$text$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$text$2f$dist$2f$LexicalText$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$canShowPlaceholderCurry"])(editor.isComposing()));
    return currentCanShowPlaceholder;
}
function useCanShowPlaceholder(editor) {
    const [canShowPlaceholder, setCanShowPlaceholder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>canShowPlaceholderFromCurrentEditorState(editor));
    useLayoutEffectImpl(()=>{
        function resetCanShowPlaceholder() {
            const currentCanShowPlaceholder = canShowPlaceholderFromCurrentEditorState(editor);
            setCanShowPlaceholder(currentCanShowPlaceholder);
        }
        resetCanShowPlaceholder();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeRegister"])(editor.registerUpdateListener(()=>{
            resetCanShowPlaceholder();
        }), editor.registerEditableListener(()=>{
            resetCanShowPlaceholder();
        }));
    }, [
        editor
    ]);
    return canShowPlaceholder;
}
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ /**
 * Props for the {@link ContentEditable} component. These are the
 * {@link ContentEditableElementProps} (minus `editor`, which is read from
 * context) plus an optional `placeholder`; when a `placeholder` is provided an
 * `aria-placeholder` string is also required for accessibility.
 */ /**
 * The editable surface of a Lexical editor: the `contentEditable` element that
 * users type into. Render it inside a {@link LexicalComposer} (it reads the
 * editor from context) and pass it to {@link RichTextPlugin} or
 * {@link PlainTextPlugin}. An optional `placeholder` is shown while the editor
 * is empty. The `ref` is forwarded to the underlying `<div>`.
 */ const ContentEditable = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(ContentEditableImpl);
function ContentEditableImpl(props, ref) {
    const { placeholder, ...rest } = props;
    const [editor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLexicalComposerContext"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ContentEditableElement, {
                editor: editor,
                ...rest,
                ref: ref
            }),
            placeholder != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Placeholder, {
                editor: editor,
                content: placeholder
            })
        ]
    });
}
function Placeholder({ content, editor }) {
    const showPlaceholder = useCanShowPlaceholder(editor);
    const [isEditable, setEditable] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(editor.isEditable());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"])(()=>{
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEditable(editor.isEditable());
        return editor.registerEditableListener((currentIsEditable)=>{
            setEditable(currentIsEditable);
        });
    }, [
        editor
    ]);
    if (!showPlaceholder) {
        return null;
    }
    let placeholder = null;
    if (typeof content === 'function') {
        placeholder = content(isEditable);
    } else if (content !== null) {
        placeholder = content;
    }
    if (placeholder === null) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
        "aria-hidden": true,
        children: placeholder
    });
}
;
}),
"[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalErrorBoundary.dev.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LexicalErrorBoundary",
    ()=>LexicalErrorBoundary
]);
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
;
;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ // React error boundaries must be class components. This one stays private: the
// exported LexicalErrorBoundary is a function component so that its props keep
// the variance that lets it satisfy the (single-argument `onError`) boundary
// prop accepted by RichTextPlugin/PlainTextPlugin.
class ErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Component"] {
    state = {
        hasError: false
    };
    static getDerivedStateFromError() {
        return {
            hasError: true
        };
    }
    componentDidCatch(error, info) {
        this.props.onError(error instanceof Error ? error : new Error(String(error), {
            cause: error
        }), info);
    }
    render() {
        return this.state.hasError ? this.props.fallback : this.props.children;
    }
}
/**
 * An error boundary used by {@link RichTextPlugin} and {@link PlainTextPlugin}
 * to isolate failures thrown while rendering decorator nodes. It renders
 * `fallback` in place of the failed subtree and forwards the error (coerced to
 * an `Error`) along with the React {@link ErrorInfo} to the `onError` callback.
 * When `fallback` is omitted a small default message is shown; pass
 * `fallback={null}` to render nothing.
 *
 * @returns The wrapped `children`, or the fallback if an error is caught.
 */ function LexicalErrorBoundary({ children, fallback, onError }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ErrorBoundary, {
        fallback: fallback === undefined ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
            style: {
                border: '1px solid #f00',
                color: '#f00',
                padding: '8px'
            },
            children: "An error was thrown."
        }) : fallback,
        onError: onError,
        children: children
    });
}
;
}),
"[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalExtensionEditorComposer.dev.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LexicalExtensionEditorComposer",
    ()=>LexicalExtensionEditorComposer
]);
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$extension$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$extension$2f$dist$2f$LexicalExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+extension@0.48.0_typescript@5.9.3/node_modules/@lexical/extension/dist/LexicalExtension.dev.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalReactExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalReactExtension.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
;
;
;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ /**
 * The equivalent of LexicalComposer for an editor that was already built for
 * extensions, typically used with nested editors.
 *
 * Make sure that your initialEditor argument is stable (e.g. using module scope or useMemo) so
 * that you are not re-creating the editor on every render! The editor should be built with
 * ReactProviderExtension and ReactExtension dependencies.
 */ function LexicalExtensionEditorComposer({ initialEditor: editor, children }) {
    const { Component } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$extension$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$extension$2f$dist$2f$LexicalExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getExtensionDependencyFromEditor"])(editor, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalReactExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReactExtension"]).output;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Component, {
        children: children
    });
}
;
}),
"[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalHorizontalRuleNode.dev.mjs [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "$createHorizontalRuleNode",
    ()=>$createHorizontalRuleNode,
    "HorizontalRuleNode",
    ()=>HorizontalRuleNode
]);
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$extension$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$extension$2f$dist$2f$LexicalExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+extension@0.48.0_typescript@5.9.3/node_modules/@lexical/extension/dist/LexicalExtension.dev.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalComposerContext.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$useLexicalNodeSelection$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/useLexicalNodeSelection.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lexical@0.48.0_typescript@5.9.3/node_modules/lexical/dist/Lexical.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ function HorizontalRuleComponent({ nodeKey }) {
    const [editor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLexicalComposerContext"])();
    const [isSelected, setSelected, clearSelection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$useLexicalNodeSelection$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLexicalNodeSelection"])(nodeKey);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeRegister"])(editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CLICK_COMMAND"], (event)=>{
            const hrElem = editor.getElementByKey(nodeKey);
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getComposedEventTarget"])(event) === hrElem) {
                if (!event.shiftKey) {
                    clearSelection();
                }
                setSelected(!isSelected);
                return true;
            }
            return false;
        }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_LOW"]));
    }, [
        clearSelection,
        editor,
        isSelected,
        nodeKey,
        setSelected
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const hrElem = editor.getElementByKey(nodeKey);
        const isSelectedClassName = editor._config.theme.hrSelected ?? 'selected';
        if (hrElem !== null) {
            if (isSelected) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addClassNamesToElement"])(hrElem, isSelectedClassName);
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removeClassNamesFromElement"])(hrElem, isSelectedClassName);
            }
        }
    }, [
        editor,
        isSelected,
        nodeKey
    ]);
    return null;
}
/**
 * @deprecated A pure Lexical implementation is available in `@lexical/extension` as HorizontalRuleExtension
 */ class HorizontalRuleNode extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$extension$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$extension$2f$dist$2f$LexicalExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["HorizontalRuleNode"] {
    static getType() {
        return 'horizontalrule';
    }
    static clone(node) {
        return new HorizontalRuleNode(node.__key);
    }
    static importJSON(serializedNode) {
        return $createHorizontalRuleNode().updateFromJSON(serializedNode);
    }
    static importDOM() {
        return {
            hr: ()=>({
                    conversion: $convertHorizontalRuleElement,
                    priority: 0
                })
        };
    }
    decorate() {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(HorizontalRuleComponent, {
            nodeKey: this.__key
        });
    }
}
function $convertHorizontalRuleElement() {
    return {
        node: $createHorizontalRuleNode()
    };
}
/**
 * @deprecated A pure Lexical implementation is available in `@lexical/extension` as HorizontalRuleExtension
 */ function $createHorizontalRuleNode() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$applyNodeReplacement"])(new HorizontalRuleNode());
}
;
}),
"[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalHorizontalRulePlugin.dev.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HorizontalRulePlugin",
    ()=>HorizontalRulePlugin
]);
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalComposerContext.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$extension$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$extension$2f$dist$2f$LexicalExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+extension@0.48.0_typescript@5.9.3/node_modules/@lexical/extension/dist/LexicalExtension.dev.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalHorizontalRuleNode$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalHorizontalRuleNode.dev.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$utils$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$utils$2f$dist$2f$LexicalUtils$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+utils@0.48.0_typescript@5.9.3/node_modules/@lexical/utils/dist/LexicalUtils.dev.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lexical@0.48.0_typescript@5.9.3/node_modules/lexical/dist/Lexical.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
;
;
;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ /**
 * This is a legacy plugin. When building an editor with the extension API,
 * configure {@link HorizontalRuleExtension} instead.
 *
 * @deprecated A pure Lexical implementation is available in `@lexical/extension`
 * as {@link HorizontalRuleExtension}
 */ function HorizontalRulePlugin() {
    const [editor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLexicalComposerContext"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$extension$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$extension$2f$dist$2f$LexicalExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["INSERT_HORIZONTAL_RULE_COMMAND"], (type)=>{
            const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
                return false;
            }
            const focusNode = selection.focus.getNode();
            if (focusNode !== null) {
                const horizontalRuleNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalHorizontalRuleNode$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$createHorizontalRuleNode"])();
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$utils$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$utils$2f$dist$2f$LexicalUtils$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$insertNodeToNearestRoot"])(horizontalRuleNode);
            }
            return true;
        }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]);
    }, [
        editor
    ]);
    return null;
}
;
}),
"[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalLinkPlugin.dev.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LinkPlugin",
    ()=>LinkPlugin
]);
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$extension$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$extension$2f$dist$2f$LexicalExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+extension@0.48.0_typescript@5.9.3/node_modules/@lexical/extension/dist/LexicalExtension.dev.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$link$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$link$2f$dist$2f$LexicalLink$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+link@0.48.0_typescript@5.9.3/node_modules/@lexical/link/dist/LexicalLink.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalComposerContext.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
;
;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ /**
 * Enables {@link LinkNode} support, registering the commands and transforms
 * that toggle and normalize links. Pass `validateUrl` to restrict which URLs
 * may be applied (which also enables automatic link creation when pasting a
 * matching URL) and `attributes` to set defaults such as `target` or `rel`.
 * The editor must have the {@link LinkNode} registered.
 *
 * This is a legacy plugin. When building an editor with the extension API,
 * configure {@link LinkExtension} instead.
 *
 * @returns `null`, this plugin renders no DOM of its own.
 */ function LinkPlugin({ validateUrl, attributes }) {
    const [editor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLexicalComposerContext"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!editor.hasNodes([
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$link$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$link$2f$dist$2f$LexicalLink$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LinkNode"]
        ])) {
            throw new Error('LinkPlugin: LinkNode not registered on editor');
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$link$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$link$2f$dist$2f$LexicalLink$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerLink"])(editor, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$extension$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$extension$2f$dist$2f$LexicalExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["namedSignals"])({
            attributes,
            validateUrl
        }));
    }, [
        editor,
        validateUrl,
        attributes
    ]);
    return null;
}
;
}),
"[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalListPlugin.dev.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ListPlugin",
    ()=>ListPlugin
]);
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$list$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$list$2f$dist$2f$LexicalList$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+list@0.48.0_typescript@5.9.3/node_modules/@lexical/list/dist/LexicalList.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalComposerContext.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lexical@0.48.0_typescript@5.9.3/node_modules/lexical/dist/Lexical.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
;
;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ function useList(editor) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$list$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$list$2f$dist$2f$LexicalList$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerList"])(editor);
    }, [
        editor
    ]);
}
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ /**
 * Props for the {@link ListPlugin} component.
 */ /**
 * Enables ordered, unordered, and check list support, registering the commands
 * and transforms that create and maintain {@link ListNode} and
 * {@link ListItemNode} structures. The editor must have both nodes registered.
 *
 * This is a legacy plugin. When building an editor with the extension API,
 * configure {@link ListExtension} instead.
 *
 * @returns `null`, this plugin renders no DOM of its own.
 */ function ListPlugin({ hasStrictIndent = false, shouldPreserveNumbering = false }) {
    const [editor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLexicalComposerContext"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!editor.hasNodes([
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$list$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$list$2f$dist$2f$LexicalList$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ListNode"],
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$list$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$list$2f$dist$2f$LexicalList$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ListItemNode"]
        ])) {
            throw new Error('ListPlugin: ListNode and/or ListItemNode not registered on editor');
        }
    }, [
        editor
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeRegister"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$list$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$list$2f$dist$2f$LexicalList$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerList"])(editor, {
            restoreNumbering: shouldPreserveNumbering
        }), hasStrictIndent ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$list$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$list$2f$dist$2f$LexicalList$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerListStrictIndentTransform"])(editor) : ()=>{});
    }, [
        editor,
        hasStrictIndent,
        shouldPreserveNumbering
    ]);
    useList(editor);
    return null;
}
;
}),
"[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalMarkdownShortcutPlugin.dev.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_TRANSFORMERS",
    ()=>DEFAULT_TRANSFORMERS,
    "MarkdownShortcutPlugin",
    ()=>MarkdownShortcutPlugin
]);
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$extension$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$extension$2f$dist$2f$LexicalExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+extension@0.48.0_typescript@5.9.3/node_modules/@lexical/extension/dist/LexicalExtension.dev.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$markdown$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$markdown$2f$dist$2f$LexicalMarkdown$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+markdown@0.48.0_typescript@5.9.3/node_modules/@lexical/markdown/dist/LexicalMarkdown.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalComposerContext.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
;
;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ const HR = {
    dependencies: [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$extension$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$extension$2f$dist$2f$LexicalExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["HorizontalRuleNode"]
    ],
    export: (node)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$extension$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$extension$2f$dist$2f$LexicalExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$isHorizontalRuleNode"])(node) ? '***' : null;
    },
    regExp: /^(---|\*\*\*|___)\s?$/,
    replace: (parentNode, _1, _2, isImport)=>{
        const line = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$extension$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$extension$2f$dist$2f$LexicalExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$createHorizontalRuleNode"])();
        // TODO: Get rid of isImport flag
        if (isImport || parentNode.getNextSibling() != null) {
            parentNode.replace(line);
        } else {
            parentNode.insertBefore(line);
        }
        line.selectNext();
    },
    triggerOnEnter: true,
    type: 'element'
};
/**
 * The default set of Markdown {@link Transformer}s used by
 * {@link MarkdownShortcutPlugin}: the core `@lexical/markdown` `TRANSFORMERS`
 * plus a transformer that turns `---`, `***`, or `___` into a horizontal rule.
 */ const DEFAULT_TRANSFORMERS = [
    HR,
    ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$markdown$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$markdown$2f$dist$2f$LexicalMarkdown$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRANSFORMERS"]
];
/**
 * Registers Markdown shortcuts so that typing Markdown syntax (for example
 * `# ` for a heading or `- ` for a list item) is automatically converted into
 * the corresponding nodes as you type. Pass `transformers` to customize which
 * shortcuts are active; it defaults to {@link DEFAULT_TRANSFORMERS}.
 *
 * @returns `null`, this plugin renders no DOM of its own.
 */ function MarkdownShortcutPlugin({ transformers = DEFAULT_TRANSFORMERS }) {
    const [editor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLexicalComposerContext"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$markdown$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$markdown$2f$dist$2f$LexicalMarkdown$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerMarkdownShortcuts"])(editor, transformers);
    }, [
        editor,
        transformers
    ]);
    return null;
}
;
}),
"[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalReactExtension.dev.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DefaultEditorChildrenComponent",
    ()=>DefaultEditorChildrenComponent,
    "ReactExtension",
    ()=>ReactExtension
]);
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalContentEditable$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalContentEditable.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalErrorBoundary$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalErrorBoundary.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalReactProviderExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalReactProviderExtension.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lexical@0.48.0_typescript@5.9.3/node_modules/lexical/dist/Lexical.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalComposerContext.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ // Do not require this module directly! Use normal `invariant` calls.
function formatDevErrorMessage(message) {
    throw new Error(message);
}
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ function useReactDecorators(editor, ErrorBoundary) {
    const [subscribe, getSnapshot] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            (cb)=>editor.registerDecoratorListener(cb),
            ()=>editor.getDecorators()
        ], [
        editor
    ]);
    const decorators = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribe, getSnapshot, getSnapshot);
    // Return decorators defined as React Portals
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const decoratedPortals = [];
        for(const nodeKey in decorators){
            const element = editor.getElementByKey(nodeKey);
            if (element !== null) {
                const reactDecorator = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ErrorBoundary, {
                    onError: (e)=>{
                        editor._onError(e);
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
                        fallback: null,
                        children: decorators[nodeKey]
                    })
                });
                decoratedPortals.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(reactDecorator, element, nodeKey));
            }
        }
        return decoratedPortals;
    }, [
        ErrorBoundary,
        decorators,
        editor
    ]);
}
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ function buildEditorComponent(config, context) {
    const [editor] = context;
    const rawConfigDecorators = config.decorators.map((El)=>// eslint-disable-next-line react/jsx-key -- wrapped later
        typeof El === 'function' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(El, {
            context: context
        }) : El);
    return function EditorComponent(props) {
        const { EditorChildrenComponent = config.EditorChildrenComponent, ErrorBoundary = config.ErrorBoundary, contentEditable = config.contentEditable, children } = props;
        const decorators = useReactDecorators(editor, ErrorBoundary);
        const configDecorators = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>rawConfigDecorators.map((decorator, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ErrorBoundary, {
                    onError: (e)=>{
                        editor._onError(e);
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
                        fallback: null,
                        children: decorator
                    })
                }, i)), [
            ErrorBoundary
        ]);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LexicalComposerContext"].Provider, {
            value: context,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(EditorChildrenComponent, {
                context: context,
                contentEditable: contentEditable,
                children: [
                    children,
                    configDecorators,
                    decorators
                ]
            })
        });
    };
}
/**
 * @example
 * The default EditorChildrenComponent implementation
 * ```jsx
 * return (
 *   <>
 *     {contentEditable}
 *     {children}
 *   </>
 * );
 * ```
 */ function DefaultEditorChildrenComponent({ contentEditable, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            contentEditable,
            children
        ]
    });
}
const initialConfig = {
    EditorChildrenComponent: DefaultEditorChildrenComponent,
    ErrorBoundary: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalErrorBoundary$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LexicalErrorBoundary"],
    contentEditable: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalContentEditable$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContentEditable"], {}),
    decorators: []
};
/**
 * An extension to use or configure React for use with Lexical. In an editor, you
 * would typically use {@link LexicalExtensionComposer} (for React projects) or
 * {@link ReactPluginHostExtension} (to use React Extensions and plug-ins in a non-React
 * project).
 *
 * See {@link ReactConfig} for more detailed exextensionations of how to use
 * the config for this Extension.
 *
 * For an Extension developer, you can defineConfig() override the extension with
 * decorators to add JSX inside the editor context that is not
 * location-dependent (e.g. floating UI that does not need to be mounted in
 * some specific location, or effects that return null).
 */ const ReactExtension = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defineExtension"])({
    build (editor, config, state) {
        const providerPeer = state.getPeer(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalReactProviderExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReactProviderExtension"].name);
        if (!providerPeer) {
            {
                formatDevErrorMessage(`No ReactProviderExtension detected. You must use ReactPluginHostExtension or LexicalExtensionComposer to host React extensions. The following extensions depend on ReactExtension: ${[
                    ...state.getDirectDependentNames()
                ].join(' ')}`);
            }
        }
        const context = [
            editor,
            {
                getTheme: ()=>editor._config.theme
            }
        ];
        const Component = buildEditorComponent(config, context);
        return {
            Component,
            context
        };
    },
    config: initialConfig,
    mergeConfig (a, b) {
        const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shallowMergeConfig"])(a, b);
        if (b.decorators) {
            config.decorators = b.decorators.length > 0 ? [
                ...a.decorators,
                ...b.decorators
            ] : a.decorators;
        }
        return config;
    },
    name: '@lexical/react/React',
    peerDependencies: [
        // We are not trying to avoid the import, just the direct dependency,
        // so using the extension directly is fine.
        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["declarePeerDependency"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalReactProviderExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReactProviderExtension"].name)
    ]
});
;
}),
"[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalReactProviderExtension.dev.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReactProviderExtension",
    ()=>ReactProviderExtension
]);
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lexical@0.48.0_typescript@5.9.3/node_modules/lexical/dist/Lexical.dev.mjs [app-ssr] (ecmascript)");
;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ /**
 * An extension used to declare that there is a LexicalExtensionComposer or
 * ReactPluginHostExtension available so that we can issue runtime warnings
 * when plugins that depend on React are hosted in an environment
 * where it is not ever going to be rendered.
 *
 * It is a separate extension so it can be used as a peer dependency.
 */ const ReactProviderExtension = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defineExtension"])({
    name: '@lexical/react/ReactProvider'
});
;
}),
"[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalRichTextPlugin.dev.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RichTextPlugin",
    ()=>RichTextPlugin
]);
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalComposerContext.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$useLexicalEditable$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/useLexicalEditable.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$extension$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$extension$2f$dist$2f$LexicalExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+extension@0.48.0_typescript@5.9.3/node_modules/@lexical/extension/dist/LexicalExtension.dev.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalReactProviderExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalReactProviderExtension.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lexical@0.48.0_typescript@5.9.3/node_modules/lexical/dist/Lexical.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$text$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$text$2f$dist$2f$LexicalText$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+text@0.48.0_typescript@5.9.3/node_modules/@lexical/text/dist/LexicalText.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$dragon$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$dragon$2f$dist$2f$LexicalDragon$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+dragon@0.48.0_typescript@5.9.3/node_modules/@lexical/dragon/dist/LexicalDragon.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$rich$2d$text$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$rich$2d$text$2f$dist$2f$LexicalRichText$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+rich-text@0.48.0_typescript@5.9.3/node_modules/@lexical/rich-text/dist/LexicalRichText.dev.mjs [app-ssr] (ecmascript) <locals>");
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
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ // Do not require this module directly! Use normal `invariant` calls.
function formatDevErrorMessage(message) {
    throw new Error(message);
}
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ // This workaround is no longer necessary in React 19,
// but we currently support React >=18.x
// https://github.com/facebook/react/pull/26395
const useLayoutEffectImpl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CAN_USE_DOM"] ? __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"] : __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"];
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ function useDecorators(editor, ErrorBoundary) {
    const [decorators, setDecorators] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>editor.getDecorators());
    // Subscribe to changes
    useLayoutEffectImpl(()=>{
        return editor.registerDecoratorListener((nextDecorators)=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["flushSync"])(()=>{
                setDecorators(nextDecorators);
            });
        });
    }, [
        editor
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // If the content editable mounts before the subscription is added, then
        // nothing will be rendered on initial pass. We can get around that by
        // ensuring that we set the value.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDecorators(editor.getDecorators());
    }, [
        editor
    ]);
    // Return decorators defined as React Portals
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const decoratedPortals = [];
        const decoratorKeys = Object.keys(decorators);
        for(let i = 0; i < decoratorKeys.length; i++){
            const nodeKey = decoratorKeys[i];
            const reactDecorator = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ErrorBoundary, {
                onError: (e)=>editor._onError(e),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
                    fallback: null,
                    children: decorators[nodeKey]
                })
            });
            const element = editor.getElementByKey(nodeKey);
            if (element !== null) {
                decoratedPortals.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(reactDecorator, element, nodeKey));
            }
        }
        return decoratedPortals;
    }, [
        ErrorBoundary,
        decorators,
        editor
    ]);
}
function isUsingReactExtension(editor) {
    const builder = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$extension$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$extension$2f$dist$2f$LexicalExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LexicalBuilder"].maybeFromEditor(editor);
    if (builder && builder.hasExtensionByName(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalReactProviderExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReactProviderExtension"].name)) {
        for (const name of [
            '@lexical/plain-text',
            '@lexical/rich-text'
        ]){
            if (!!builder.hasExtensionByName(name)) {
                formatDevErrorMessage(`LexicalBuilder: @lexical/react legacy text plugins conflict with the ${name} extension. Remove the legacy <RichTextPlugin/> or <PlainTextPlugin/> component.`);
            }
        }
        return true;
    }
    return false;
}
function Decorators({ editor, ErrorBoundary }) {
    return useDecorators(editor, ErrorBoundary);
}
/**
 * @internal
 *
 * When using @lexical/extension, the ReactProvider is expected to handle
 * rendering decorators. This component allows RichTextPlugin and
 * PlainTextPlugin to be used in extension projects that have not yet
 * migrated to use RichTextExtension or PlainTextExtension.
 **/ function LegacyDecorators({ editor, ErrorBoundary }) {
    return isUsingReactExtension(editor) ? null : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Decorators, {
        editor: editor,
        ErrorBoundary: ErrorBoundary
    });
}
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ function canShowPlaceholderFromCurrentEditorState(editor) {
    const currentCanShowPlaceholder = editor.read('latest', (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$text$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$text$2f$dist$2f$LexicalText$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$canShowPlaceholderCurry"])(editor.isComposing()));
    return currentCanShowPlaceholder;
}
function useCanShowPlaceholder(editor) {
    const [canShowPlaceholder, setCanShowPlaceholder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>canShowPlaceholderFromCurrentEditorState(editor));
    useLayoutEffectImpl(()=>{
        function resetCanShowPlaceholder() {
            const currentCanShowPlaceholder = canShowPlaceholderFromCurrentEditorState(editor);
            setCanShowPlaceholder(currentCanShowPlaceholder);
        }
        resetCanShowPlaceholder();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeRegister"])(editor.registerUpdateListener(()=>{
            resetCanShowPlaceholder();
        }), editor.registerEditableListener(()=>{
            resetCanShowPlaceholder();
        }));
    }, [
        editor
    ]);
    return canShowPlaceholder;
}
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ function useRichTextSetup(editor) {
    useLayoutEffectImpl(()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeRegister"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$rich$2d$text$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$rich$2d$text$2f$dist$2f$LexicalRichText$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["registerRichText"])(editor), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$dragon$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$dragon$2f$dist$2f$LexicalDragon$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerDragonSupport"])(editor));
    }, [
        editor
    ]);
}
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ function RichTextPlugin({ contentEditable, // TODO Remove. This property is now part of ContentEditable
placeholder = null, ErrorBoundary }) {
    const [editor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLexicalComposerContext"])();
    useRichTextSetup(editor);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            contentEditable,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Placeholder, {
                content: placeholder
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(LegacyDecorators, {
                editor: editor,
                ErrorBoundary: ErrorBoundary
            })
        ]
    });
}
// TODO remove
function Placeholder({ content }) {
    const [editor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLexicalComposerContext"])();
    const showPlaceholder = useCanShowPlaceholder(editor);
    const editable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$useLexicalEditable$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLexicalEditable"])();
    if (!showPlaceholder) {
        return null;
    }
    if (typeof content === 'function') {
        return content(editable);
    } else {
        return content;
    }
}
;
}),
"[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalTabIndentationPlugin.dev.mjs [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TabIndentationPlugin",
    ()=>TabIndentationPlugin
]);
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$extension$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$extension$2f$dist$2f$LexicalExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+extension@0.48.0_typescript@5.9.3/node_modules/@lexical/extension/dist/LexicalExtension.dev.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalComposerContext.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
;
;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ /**
 * This plugin adds the ability to indent content using the tab key. Generally, we don't
 * recommend using this plugin as it could negatively affect accessibility for keyboard
 * users, causing focus to become trapped within the editor.
 *
 * This is a legacy plugin. When building an editor with the extension API,
 * configure {@link TabIndentationExtension} instead.
 */ function TabIndentationPlugin({ maxIndent, $canIndent }) {
    const [editor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLexicalComposerContext"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$extension$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$extension$2f$dist$2f$LexicalExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["registerTabIndentation"])(editor, maxIndent, $canIndent);
    }, [
        editor,
        maxIndent,
        $canIndent
    ]);
    return null;
}
;
}),
"[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/useLexicalEditable.dev.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLexicalEditable",
    ()=>useLexicalEditable
]);
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalComposerContext.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lexical@0.48.0_typescript@5.9.3/node_modules/lexical/dist/Lexical.dev.mjs [app-ssr] (ecmascript)");
;
;
;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ // This workaround is no longer necessary in React 19,
// but we currently support React >=18.x
// https://github.com/facebook/react/pull/26395
const useLayoutEffectImpl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CAN_USE_DOM"] ? __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"] : __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"];
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ /**
 * Describes how {@link useLexicalSubscription} reads a value from the editor: an
 * `initialValueFn` that computes the current value, and a `subscribe` function
 * that registers a listener for changes and returns an unsubscribe callback.
 */ /**
 * Shortcut to Lexical subscriptions when values are used for render.
 * @param subscription - The function to create the {@link LexicalSubscription}. This function's identity must be stable (e.g. defined at module scope or with useCallback).
 */ function useLexicalSubscription(subscription) {
    const [editor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLexicalComposerContext"])();
    const initializedSubscription = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>subscription(editor), [
        editor,
        subscription
    ]);
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>initializedSubscription.initialValueFn());
    const valueRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(value);
    useLayoutEffectImpl(()=>{
        const { initialValueFn, subscribe } = initializedSubscription;
        const currentValue = initialValueFn();
        if (valueRef.current !== currentValue) {
            valueRef.current = currentValue;
            setValue(currentValue);
        }
        return subscribe((newValue)=>{
            valueRef.current = newValue;
            setValue(newValue);
        });
    }, [
        initializedSubscription,
        subscription
    ]);
    return value;
}
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ function subscription(editor) {
    return {
        initialValueFn: ()=>editor.isEditable(),
        subscribe: (callback)=>{
            return editor.registerEditableListener(callback);
        }
    };
}
/**
 * Get the current value for {@link LexicalEditor.isEditable}
 * using {@link useLexicalSubscription}.
 * You should prefer this over manually observing the value with
 * {@link LexicalEditor.registerEditableListener},
 * which is a bit tricky to do correctly, particularly when using
 * React StrictMode (the default for development) or concurrency.
 */ function useLexicalEditable() {
    return useLexicalSubscription(subscription);
}
;
}),
"[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/useLexicalNodeSelection.dev.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLexicalNodeSelection",
    ()=>useLexicalNodeSelection
]);
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+react@0.48.0_react-dom@19.2.8_react@19.2.8__react@19.2.8_typescript@5.9.3_yjs@13.6.33/node_modules/@lexical/react/dist/LexicalComposerContext.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lexical@0.48.0_typescript@5.9.3/node_modules/lexical/dist/Lexical.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
;
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ /**
 * A helper function to determine if a specific node is selected in a Lexical editor.
 *
 * @param {LexicalEditor} editor - The LexicalEditor instance.
 * @param {NodeKey} key - The key of the node to check.
 * @returns {boolean} Whether the node is selected.
 */ function isNodeSelected(editor, key) {
    return editor.read('latest', ()=>{
        const node = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getNodeByKey"])(key);
        if (node === null) {
            return false; // Node doesn't exist, so it's not selected.
        }
        return node.isSelected(); // Check if the node is selected.
    });
}
/**
 * A custom hook to manage the selection state of a specific node in a Lexical editor.
 *
 * This hook provides utilities to:
 * - Check if a node is selected.
 * - Update its selection state.
 * - Clear the selection.
 *
 * @param {NodeKey} key - The key of the node to track selection for.
 * @returns {[boolean, (selected: boolean) => void, () => void]} A tuple containing:
 * - `isSelected` (boolean): Whether the node is currently selected.
 * - `setSelected` (function): A function to set the selection state of the node.
 * - `clearSelected` (function): A function to clear the selection of the node.
 *
 */ function useLexicalNodeSelection(key) {
    const [editor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$react$40$0$2e$48$2e$0_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8_typescript$40$5$2e$9$2e$3_yjs$40$13$2e$6$2e$33$2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLexicalComposerContext"])();
    // State to track whether the node is currently selected.
    const [isSelected, setIsSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>isNodeSelected(editor, key));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let isMounted = true;
        const unregister = editor.registerUpdateListener(()=>{
            if (isMounted) {
                setIsSelected(isNodeSelected(editor, key));
            }
        });
        return ()=>{
            isMounted = false; // Prevent updates after component unmount.
            unregister();
        };
    }, [
        editor,
        key
    ]);
    const setSelected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((selected)=>{
        editor.update(()=>{
            let selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isNodeSelection"])(selection)) {
                selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$createNodeSelection"])();
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$setSelection"])(selection);
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isNodeSelection"])(selection)) {
                if (selected) {
                    selection.add(key);
                } else {
                    selection.delete(key);
                }
            }
        });
    }, [
        editor,
        key
    ]);
    const clearSelected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        editor.update(()=>{
            const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isNodeSelection"])(selection)) {
                selection.clear();
            }
        });
    }, [
        editor
    ]);
    return [
        isSelected,
        setSelected,
        clearSelected
    ];
}
;
}),
];

//# sourceMappingURL=0hv9_%40lexical_react_dist_034llk_._.js.map