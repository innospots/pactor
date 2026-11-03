module.exports = [
"[project]/node_modules/.pnpm/@lexical+rich-text@0.48.0_typescript@5.9.3/node_modules/@lexical/rich-text/dist/LexicalRichText.dev.mjs [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "$createHeadingNode",
    ()=>$createHeadingNode,
    "$createQuoteNode",
    ()=>$createQuoteNode,
    "$isHeadingNode",
    ()=>$isHeadingNode,
    "$isQuoteNode",
    ()=>$isQuoteNode,
    "DRAG_DROP_PASTE",
    ()=>DRAG_DROP_PASTE,
    "HeadingNode",
    ()=>HeadingNode,
    "QuoteNode",
    ()=>QuoteNode,
    "RichTextExtension",
    ()=>RichTextExtension,
    "RichTextImportExtension",
    ()=>RichTextImportExtension,
    "RichTextImportRules",
    ()=>RichTextImportRules,
    "ShadowRootQuoteRule",
    ()=>ShadowRootQuoteRule,
    "quoteShadowRootState",
    ()=>quoteShadowRootState,
    "registerRichText",
    ()=>registerRichText
]);
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$clipboard$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$clipboard$2f$dist$2f$LexicalClipboard$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+clipboard@0.48.0_typescript@5.9.3/node_modules/@lexical/clipboard/dist/LexicalClipboard.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$extension$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$extension$2f$dist$2f$LexicalExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+extension@0.48.0_typescript@5.9.3/node_modules/@lexical/extension/dist/LexicalExtension.dev.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$selection$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$selection$2f$dist$2f$LexicalSelection$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+selection@0.48.0_typescript@5.9.3/node_modules/@lexical/selection/dist/LexicalSelection.dev.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$utils$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$utils$2f$dist$2f$LexicalUtils$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+utils@0.48.0_typescript@5.9.3/node_modules/@lexical/utils/dist/LexicalUtils.dev.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lexical@0.48.0_typescript@5.9.3/node_modules/lexical/dist/Lexical.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$dragon$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$dragon$2f$dist$2f$LexicalDragon$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+dragon@0.48.0_typescript@5.9.3/node_modules/@lexical/dragon/dist/LexicalDragon.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$html$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$html$2f$dist$2f$LexicalHtml$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@lexical+html@0.48.0_typescript@5.9.3/node_modules/@lexical/html/dist/LexicalHtml.dev.mjs [app-ssr] (ecmascript)");
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
 */ /**
 * Heuristic copied (in spirit) from the legacy `isGoogleDocsTitle`:
 * Google Docs serializes the document title as a `<span style="font-size:
 * 26pt">` (sometimes wrapped in a `<p>`). The presence of a 26pt span at
 * the start of a `<p>` is treated as a heading-1 marker.
 */ function isGoogleDocsTitleSpan(node) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isHTMLElement"])(node) && node.nodeName === 'SPAN' && node.style.fontSize === '26pt';
}
const HeadingRule = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$html$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$html$2f$dist$2f$LexicalHtml$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defineImportRule"])({
    $import: (ctx, el)=>{
        const tag = el.nodeName.toLowerCase();
        const node = $createHeadingNode(tag);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setNodeIndentFromDOM"])(el, node);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$setFormatFromDOM"])(node, el);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$setDirectionFromDOM"])(node, el);
        return [
            node.splice(0, 0, ctx.$importChildren(el))
        ];
    },
    match: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$html$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$html$2f$dist$2f$LexicalHtml$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sel"].tag('h1', 'h2', 'h3', 'h4', 'h5', 'h6'),
    name: '@lexical/rich-text/heading'
});
const QuoteRule = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$html$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$html$2f$dist$2f$LexicalHtml$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defineImportRule"])({
    $import: (ctx, el)=>{
        const node = $createQuoteNode();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$setFormatFromDOM"])(node, el);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setNodeIndentFromDOM"])(el, node);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$setDirectionFromDOM"])(node, el);
        return [
            node.splice(0, 0, ctx.$importChildren(el))
        ];
    },
    match: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$html$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$html$2f$dist$2f$LexicalHtml$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sel"].tag('blockquote'),
    name: '@lexical/rich-text/blockquote'
});
/**
 * Opt-in replacement for the default `<blockquote>` rule that imports the
 * quote as a shadow root {@link QuoteNode} (see `quoteShadowRootState`).
 * Block-level children such as `<p>` are preserved as blocks and runs of
 * inline content are wrapped in paragraphs (`BlockSchema`), so structured
 * blockquote HTML round-trips faithfully instead of being flattened to
 * inline content.
 *
 * Not part of {@link RichTextImportRules}; without it `<blockquote>`
 * import behavior is unchanged. To opt in, register it with a higher
 * priority than the default rules, e.g.:
 * ```ts
 * configExtension(DOMImportExtension, {rules: [ShadowRootQuoteRule]})
 * ```
 * (rules from later configuration take priority, so this shadows the
 * default `@lexical/rich-text/blockquote` rule).
 *
 * @experimental
 */ const ShadowRootQuoteRule = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$html$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$html$2f$dist$2f$LexicalHtml$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defineImportRule"])({
    $import: (ctx, el)=>{
        const node = $createQuoteNode({
            shadowRoot: true
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$setFormatFromDOM"])(node, el);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setNodeIndentFromDOM"])(el, node);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$setDirectionFromDOM"])(node, el);
        return [
            node.splice(0, 0, ctx.$importChildren(el, {
                schema: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$html$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$html$2f$dist$2f$LexicalHtml$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BlockSchema"]
            }))
        ];
    },
    match: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$html$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$html$2f$dist$2f$LexicalHtml$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sel"].tag('blockquote'),
    name: '@lexical/rich-text/blockquote-shadow-root'
});
/**
 * Google-Docs paragraph wrapper around a title span: drop the paragraph,
 * let the span rule below promote to a heading. The body deliberately
 * returns the children unwrapped (no schema, no own node) so the
 * descendant rules — including {@link GoogleDocsTitleSpanRule} — fire and
 * produce the heading at this level.
 */ const GoogleDocsTitleParagraphRule = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$html$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$html$2f$dist$2f$LexicalHtml$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defineImportRule"])({
    $import: (ctx, el, $next)=>{
        const first = el.firstChild;
        if (first && isGoogleDocsTitleSpan(first)) {
            return ctx.$importChildren(el);
        }
        return $next();
    },
    match: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$html$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$html$2f$dist$2f$LexicalHtml$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sel"].tag('p'),
    name: '@lexical/rich-text/google-docs-title-p'
});
const GoogleDocsTitleSpanRule = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$html$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$html$2f$dist$2f$LexicalHtml$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defineImportRule"])({
    $import: (ctx, el, $next)=>el.style.fontSize !== '26pt' ? $next() : [
            $createHeadingNode('h1').splice(0, 0, ctx.$importChildren(el))
        ],
    match: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$html$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$html$2f$dist$2f$LexicalHtml$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sel"].tag('span'),
    name: '@lexical/rich-text/google-docs-title-span'
});
/**
 * Import rules for {@link HeadingNode} and {@link QuoteNode}, including
 * the Google Docs title heuristic that the legacy `HeadingNode.importDOM`
 * declared. The Google-Docs rules are registered last (highest priority)
 * so they precede the generic `<p>` and `<span>` rules from
 * {@link CoreImportRules}.
 *
 * Registered by {@link RichTextExtension} itself (together with
 * `CoreImportExtension`), so any editor that uses the rich-text
 * extension can import these tags through the `DOMImportExtension`
 * pipeline without further configuration.
 *
 * @experimental
 */ const RichTextImportRules = [
    HeadingRule,
    QuoteRule,
    GoogleDocsTitleParagraphRule,
    GoogleDocsTitleSpanRule
];
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ /**
 * Configuration for {@link RichTextExtension}.
 *
 * @property escapeFormatTriggers - Per-format trigger configuration that
 *   controls which text formats are automatically cleared from the selection
 *   on specific user interactions.
 *
 *   Defaults to:
 *   ```ts
 *   {
 *     capitalize: {enter: true, space: true, tab: true},
 *     lowercase: {enter: true, space: true, tab: true},
 *     uppercase: {enter: true, space: true, tab: true},
 *   }
 *   ```
 *
 *   To opt in to escaping `code` formatting at text node boundaries:
 *   ```ts
 *   configExtension(RichTextExtension, {
 *     escapeFormatTriggers: {
 *       code: {onlyAtBoundary: true, enter: true, click: true, arrow: true},
 *     },
 *   })
 *   ```
 */ const DEFAULT_RICH_TEXT_CONFIG = {
    escapeFormatTriggers: {
        capitalize: {
            enter: true,
            space: true,
            tab: true
        },
        lowercase: {
            enter: true,
            space: true,
            tab: true
        },
        uppercase: {
            enter: true,
            space: true,
            tab: true
        }
    }
};
function mergeTriggerConfig(config, override) {
    if (!config || override === null) {
        return override;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shallowMergeConfig"])(config, override);
}
function mergeEscapeFormatTriggers(config, overrides) {
    const merged = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shallowMergeConfig"])(config, overrides);
    for (const k of Object.keys(overrides)){
        merged[k] = mergeTriggerConfig(config[k], overrides[k]);
    }
    return merged;
}
function mergeRichTextConfig(config, overrides) {
    const merged = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shallowMergeConfig"])(config, overrides);
    if (overrides.escapeFormatTriggers) {
        merged.escapeFormatTriggers = mergeEscapeFormatTriggers(config.escapeFormatTriggers, overrides.escapeFormatTriggers);
    }
    return merged;
}
const RichTextExtension = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defineExtension"])({
    build: (_editor, config)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$extension$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$extension$2f$dist$2f$LexicalExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["namedSignals"])(config),
    config: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeCast"])(DEFAULT_RICH_TEXT_CONFIG),
    conflictsWith: [
        '@lexical/plain-text'
    ],
    dependencies: [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$dragon$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$dragon$2f$dist$2f$LexicalDragon$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DragonExtension"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$extension$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$extension$2f$dist$2f$LexicalExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["NormalizeInlineElementsExtension"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$extension$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$extension$2f$dist$2f$LexicalExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["NormalizeTripleClickSelectionExtension"],
        // DOMImportExtension support for the nodes registered here. Inert
        // unless the editor routes HTML through the pipeline (e.g. via
        // ClipboardDOMImportExtension or $generateNodesFromDOMViaExtension).
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$html$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$html$2f$dist$2f$LexicalHtml$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CoreImportExtension"],
        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["configExtension"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$html$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$html$2f$dist$2f$LexicalHtml$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DOMImportExtension"], {
            rules: RichTextImportRules
        })
    ],
    mergeConfig: mergeRichTextConfig,
    name: '@lexical/rich-text',
    nodes: ()=>[
            HeadingNode,
            QuoteNode
        ],
    register: (editor, _config, state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$extension$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$extension$2f$dist$2f$LexicalExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["effect"])(()=>registerRichText(editor, state.getOutput().escapeFormatTriggers))
});
/**
 * Bundles {@link RichTextImportRules} together with the runtime
 * {@link RichTextExtension}.
 *
 * @experimental
 * @deprecated {@link RichTextExtension} now registers
 * {@link RichTextImportRules} (and `CoreImportExtension`) itself —
 * depend on it directly instead.
 */ const RichTextImportExtension = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defineExtension"])({
    dependencies: [
        RichTextExtension
    ],
    name: '@lexical/rich-text/Import'
});
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */ const DRAG_DROP_PASTE = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCommand"])('DRAG_DROP_PASTE_FILE');
/**
 * Opt-in state for {@link QuoteNode.isShadowRoot}. When `true`, the quote
 * behaves like a multi-block region (similar to a table cell): it holds
 * block-level children (paragraphs, headings, ...) instead of inline
 * content, which allows more faithful HTML and Markdown import/export of
 * `<blockquote>` content. Defaults to `false`, in which case there is no
 * change to the legacy behavior (and nothing extra is serialized).
 */ const quoteShadowRootState = /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createState"])('shadowRoot', {
    parse: Boolean
});
/** @noInheritDoc */ class QuoteNode extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ElementNode"] {
    static getType() {
        return 'quote';
    }
    static clone(node) {
        return new QuoteNode(node.__key);
    }
    $config() {
        return this.config('quote', {
            extends: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ElementNode"],
            stateConfigs: [
                {
                    flat: true,
                    stateConfig: quoteShadowRootState
                }
            ]
        });
    }
    /**
   * `true` when this quote has opted in to shadow root behavior with
   * {@link setIsShadowRoot} or `$createQuoteNode({shadowRoot: true})`,
   * in which case it contains block-level children rather than inline
   * content. `false` (the legacy inline-content behavior) by default.
   */ isShadowRoot() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getState"])(this, quoteShadowRootState);
    }
    /**
   * Opt this quote in to (or out of) shadow root behavior. See
   * {@link quoteShadowRootState}. Note that this does not restructure any
   * existing children; a shadow root quote is expected to contain
   * block-level children (non-element children will be normalized into
   * paragraphs by the built-in shadow root transform).
   */ setIsShadowRoot(isShadowRoot) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$setState"])(this, quoteShadowRootState, isShadowRoot);
    }
    // View
    createDOM(config) {
        const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getDocument"])().createElement('blockquote');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addClassNamesToElement"])(element, config.theme.quote);
        return element;
    }
    updateDOM(prevNode, dom) {
        return false;
    }
    static importDOM() {
        return {
            blockquote: (node)=>({
                    conversion: $convertBlockquoteElement,
                    priority: 0
                })
        };
    }
    exportDOM(editor) {
        const { element } = super.exportDOM(editor);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isHTMLElement"])(element)) {
            if (this.isEmpty()) {
                element.append((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getDocument"])().createElement('br'));
            }
            const formatType = this.getFormatType();
            if (formatType) {
                element.style.textAlign = formatType;
            }
            const direction = this.getDirection();
            if (direction) {
                element.dir = direction;
            }
        }
        return {
            element
        };
    }
    static importJSON(serializedNode) {
        return $createQuoteNode().updateFromJSON(serializedNode);
    }
    exportJSON() {
        return super.exportJSON();
    }
    // Mutation
    insertNewAfter(_, restoreSelection) {
        const newBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$createParagraphNode"])();
        const direction = this.getDirection();
        newBlock.setDirection(direction);
        this.insertAfter(newBlock, restoreSelection);
        return newBlock;
    }
    collapseAtStart() {
        if (this.isShadowRoot()) {
            // A shadow root quote holds block-level children, so collapsing
            // dissolves the quote and lifts the blocks out as siblings rather
            // than merging them into a single paragraph.
            for (const child of this.getChildren()){
                this.insertBefore(child);
            }
            this.remove();
            return true;
        }
        const paragraph = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$createParagraphNode"])();
        const children = this.getChildren();
        children.forEach((child)=>paragraph.append(child));
        this.replace(paragraph);
        return true;
    }
    canMergeWhenEmpty() {
        return true;
    }
}
function $createQuoteNode(options) {
    const node = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$applyNodeReplacement"])(new QuoteNode());
    return options && options.shadowRoot ? node.setIsShadowRoot(true) : node;
}
function $isQuoteNode(node) {
    return node instanceof QuoteNode;
}
/** @noInheritDoc */ class HeadingNode extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ElementNode"] {
    /** @internal */ __tag;
    static getType() {
        return 'heading';
    }
    static clone(node) {
        return new HeadingNode(node.__tag, node.__key);
    }
    afterCloneFrom(prevNode) {
        super.afterCloneFrom(prevNode);
        this.__tag = prevNode.__tag;
    }
    constructor(tag = 'h1', key){
        super(key);
        this.__tag = tag;
    }
    getTag() {
        return this.getLatest().__tag;
    }
    setTag(tag) {
        const self = this.getWritable();
        self.__tag = tag;
        return self;
    }
    // View
    createDOM(config) {
        const tag = this.__tag;
        const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getDocument"])().createElement(tag);
        const theme = config.theme;
        const classNames = theme.heading;
        if (classNames !== undefined) {
            const className = classNames[tag];
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addClassNamesToElement"])(element, className);
        }
        return element;
    }
    updateDOM(prevNode, dom, config) {
        return prevNode.__tag !== this.__tag;
    }
    static importDOM() {
        return {
            h1: (node)=>({
                    conversion: $convertHeadingElement,
                    priority: 0
                }),
            h2: (node)=>({
                    conversion: $convertHeadingElement,
                    priority: 0
                }),
            h3: (node)=>({
                    conversion: $convertHeadingElement,
                    priority: 0
                }),
            h4: (node)=>({
                    conversion: $convertHeadingElement,
                    priority: 0
                }),
            h5: (node)=>({
                    conversion: $convertHeadingElement,
                    priority: 0
                }),
            h6: (node)=>({
                    conversion: $convertHeadingElement,
                    priority: 0
                }),
            p: (node)=>{
                // domNode is a <p> since we matched it by nodeName
                const paragraph = node;
                const firstChild = paragraph.firstChild;
                if (firstChild !== null && isGoogleDocsTitle(firstChild)) {
                    return {
                        conversion: ()=>({
                                node: null
                            }),
                        priority: 3
                    };
                }
                return null;
            },
            span: (node)=>{
                if (isGoogleDocsTitle(node)) {
                    return {
                        conversion: (domNode)=>{
                            return {
                                node: $createHeadingNode('h1')
                            };
                        },
                        priority: 3
                    };
                }
                return null;
            }
        };
    }
    exportDOM(editor) {
        const { element } = super.exportDOM(editor);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isHTMLElement"])(element)) {
            if (this.isEmpty()) {
                element.append((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getDocument"])().createElement('br'));
            }
            const formatType = this.getFormatType();
            if (formatType) {
                element.style.textAlign = formatType;
            }
            const direction = this.getDirection();
            if (direction) {
                element.dir = direction;
            }
        }
        return {
            element
        };
    }
    static importJSON(serializedNode) {
        return $createHeadingNode(serializedNode.tag).updateFromJSON(serializedNode);
    }
    updateFromJSON(serializedNode) {
        return super.updateFromJSON(serializedNode).setTag(serializedNode.tag);
    }
    exportJSON() {
        return {
            ...super.exportJSON(),
            tag: this.getTag()
        };
    }
    // Mutation
    insertNewAfter(selection, restoreSelection = true) {
        const anchorOffet = selection ? selection.anchor.offset : 0;
        const lastDesc = this.getLastDescendant();
        const isAtEnd = !lastDesc || selection && selection.anchor.key === lastDesc.getKey() && anchorOffet === lastDesc.getTextContentSize();
        const newElement = isAtEnd || !selection ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$createParagraphNode"])() : $createHeadingNode(this.getTag());
        const direction = this.getDirection();
        newElement.setDirection(direction);
        this.insertAfter(newElement, restoreSelection);
        if (anchorOffet === 0 && !this.isEmpty() && selection) {
            const paragraph = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$createParagraphNode"])();
            paragraph.select();
            this.replace(paragraph, true);
        }
        return newElement;
    }
    collapseAtStart() {
        if (this.isEmpty()) {
            const paragraph = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$createParagraphNode"])();
            const children = this.getChildren();
            children.forEach((child)=>paragraph.append(child));
            this.replace(paragraph);
        }
        return true;
    }
    extractWithChild() {
        return true;
    }
}
function isGoogleDocsTitle(domNode) {
    if (domNode.nodeName.toLowerCase() === 'span') {
        return domNode.style.fontSize === '26pt';
    }
    return false;
}
function $convertHeadingElement(element) {
    const nodeName = element.nodeName.toLowerCase();
    let node = null;
    if (nodeName === 'h1' || nodeName === 'h2' || nodeName === 'h3' || nodeName === 'h4' || nodeName === 'h5' || nodeName === 'h6') {
        node = $createHeadingNode(nodeName);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setNodeIndentFromDOM"])(element, node);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$setFormatFromDOM"])(node, element);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$setDirectionFromDOM"])(node, element);
    }
    return {
        node
    };
}
function $convertBlockquoteElement(element) {
    const node = $createQuoteNode();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$setFormatFromDOM"])(node, element);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setNodeIndentFromDOM"])(element, node);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$setDirectionFromDOM"])(node, element);
    return {
        node
    };
}
function $createHeadingNode(headingTag = 'h1') {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$applyNodeReplacement"])(new HeadingNode(headingTag));
}
function $isHeadingNode(node) {
    return node instanceof HeadingNode;
}
function onPasteForRichText(event, editor) {
    event.preventDefault();
    editor.update(()=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        const clipboardData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$utils$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$utils$2f$dist$2f$LexicalUtils$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["objectKlassEquals"])(event, InputEvent) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$utils$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$utils$2f$dist$2f$LexicalUtils$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["objectKlassEquals"])(event, KeyboardEvent) ? null : event.clipboardData;
        if (clipboardData != null && selection !== null) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$clipboard$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$clipboard$2f$dist$2f$LexicalClipboard$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$insertDataTransferForRichText"])(clipboardData, selection, editor);
        }
    }, {
        // PASTE_TAG gives the paste its own undo entry: @lexical/history treats
        // the tag as a history boundary so undoing a paste does not also undo any
        // typing that preceded it (see #8609).
        tag: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PASTE_TAG"]
    });
}
async function onCutForRichText(event, editor) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$clipboard$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$clipboard$2f$dist$2f$LexicalClipboard$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["copyToClipboard"])(editor, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$utils$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$utils$2f$dist$2f$LexicalUtils$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["objectKlassEquals"])(event, ClipboardEvent) ? event : null);
    editor.update(()=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
            selection.removeText();
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isNodeSelection"])(selection)) {
            selection.getNodes().forEach((node)=>node.remove());
        }
    }, {
        // CUT_TAG gives the cut its own undo entry: @lexical/history treats the
        // tag as a history boundary so undoing a cut does not also undo any typing
        // that preceded it (see #8609).
        tag: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CUT_TAG"]
    });
}
function $isTargetWithinDecorator(target) {
    const node = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getNearestNodeFromDOMNode"])(target);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isDecoratorNode"])(node);
}
function $isSelectionAtEndOfRoot(selection) {
    const focus = selection.focus;
    return focus.key === 'root' && focus.offset === (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getRoot"])().getChildrenSize();
}
function $isSelectionCollapsedAtFrontOfIndentedBlock(selection) {
    if (!selection.isCollapsed()) {
        return false;
    }
    const { anchor } = selection;
    if (anchor.offset !== 0) {
        return false;
    }
    const anchorNode = anchor.getNode();
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRootNode"])(anchorNode)) {
        return false;
    }
    const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$utils$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$utils$2f$dist$2f$LexicalUtils$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$getNearestBlockElementAncestorOrThrow"])(anchorNode);
    return element.getIndent() > 0 && (element.is(anchorNode) || anchorNode.is(element.getFirstDescendant()));
}
/**
 * Trigger types that cause format escape at text node boundaries.
 * - `enter`: Escape on Enter key press
 * - `click`: Escape on mouse click
 * - `arrow`: Escape on arrow key navigation (left/right)
 * - `space`: Escape on Space key press
 * - `tab`: Escape on Tab key press
 */ /**
 * Trigger flags for a single format type. Set a trigger key to `true` to
 * escape that format when the corresponding user interaction occurs.
 *
 * When `onlyAtBoundary` is `true`, the format is only escaped when the cursor
 * is at the start or end of a formatted text node with no adjacent sibling in
 * that direction. When `onlyAtBoundary` is `false` or omitted the format is
 * always escaped regardless of cursor position (matching the legacy
 * `$resetCapitalization` behavior).
 */ /**
 * Per-format trigger configuration. Each {@link TextFormatType} maps to its
 * own set of triggers, or `null` to explicitly disable escape for that format
 * (useful when overriding defaults via `configExtension`).
 */ function $escapeFormatsForTrigger(selection, trigger, direction, config) {
    let isBoundary = false;
    let anchorNode = null;
    if (selection.isCollapsed() && selection.anchor.type === 'text') {
        const node = selection.anchor.getNode();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isTextNode"])(node)) {
            anchorNode = node;
            const offset = selection.anchor.offset;
            const atEnd = offset === node.getTextContentSize() && node.getNextSibling() === null;
            const atStart = offset === 0 && node.getPreviousSibling() === null;
            isBoundary = direction === 'end' && atEnd || direction === 'start' && atStart || direction === 'both' && (atEnd || atStart);
        }
    }
    let didEscapeBoundary = false;
    for (const [formatKey, triggers] of Object.entries(config)){
        if (triggers == null || !triggers[trigger]) {
            continue;
        }
        const format = formatKey;
        if (triggers.onlyAtBoundary) {
            if (!isBoundary || !anchorNode || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isTextNode"])(anchorNode) || !anchorNode.hasFormat(format)) {
                continue;
            }
            didEscapeBoundary = true;
        }
        if (selection.hasFormat(format)) {
            selection.toggleFormat(format);
        }
    }
    if (didEscapeBoundary) {
        selection.setStyle('');
    }
}
const DEFAULT_ESCAPE_FORMAT_TRIGGERS = {
    capitalize: {
        enter: true,
        space: true,
        tab: true
    },
    lowercase: {
        enter: true,
        space: true,
        tab: true
    },
    uppercase: {
        enter: true,
        space: true,
        tab: true
    }
};
function $tryEnterFromBlockCursor(selection, direction) {
    if (!selection.isCollapsed() || selection.anchor.type !== 'element') {
        return false;
    }
    const caret = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$caretFromPoint"])(selection.anchor, direction);
    const child = caret.getNodeAtCaret();
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isShadowRootNode"])(child) && !child.isInline()) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$setSelectionFromCaretRange"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getCollapsedCaretRange"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$normalizeCaret"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getChildCaret"])(child, direction))));
        return true;
    }
    return false;
}
function $tryBlockCursorShadowRootNavigation(selection, direction) {
    return $tryExitShadowRootToBlockCursor(selection, direction) || $tryEnterFromBlockCursor(selection, direction);
}
function $tryExitShadowRootToBlockCursor(selection, direction) {
    if (!selection.isCollapsed()) {
        return false;
    }
    const focusCaret = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$caretFromPoint"])(selection.focus, direction);
    // Walk up from focus to find the nearest shadow root ancestor.
    // Start from the focus node itself since it may be a
    // shadow root (e.g. LayoutItem with element-type selection).
    const shadowRoot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$findMatchingParent"])(focusCaret.origin, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isShadowRootNode"]);
    if (!shadowRoot) {
        return false;
    }
    // When focus is an element-type point, $caretFromPoint returns a caret
    // whose origin is a child of the focus node. If that child happens to be
    // (or sit inside) a shadow root, $findMatchingParent matches it even
    // though the selection is at the parent level, not inside the shadow root.
    // Skip the exit logic when the focus node is not actually inside the
    // found shadow root.
    const focusNode = selection.focus.getNode();
    if (!shadowRoot.is(focusNode) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$hasAncestor"])(focusNode, shadowRoot)) {
        return false;
    }
    // Check that the focus is at the edge of the shadow root in the given
    // direction. If focus is the shadow root itself, check the offset directly.
    // Otherwise walk toward the deepest first/last descendant.
    const textRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getCaretRange"])(focusCaret, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSiblingCaret"])(shadowRoot, direction));
    // If there's text we're not at the edge
    if (textRange.getTextSlices().some((slice)=>slice && slice.getTextContentSize() > 0)) {
        return false;
    }
    // Normalize the anchor in case it started with a ChildCaret
    const range = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getCaretRange"])(textRange.anchor.getSiblingCaret(), textRange.focus);
    // When traversing from the edge to the root we expect to see only parent nodes
    // as sibling carets
    let prevOrigin = range.anchor.origin;
    for (const caret of range){
        if (!((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isSiblingCaret"])(caret) && caret.origin.is(prevOrigin.getParent()))) {
            return false;
        }
        prevOrigin = caret.origin;
    }
    // Walk outward from the shadow root through nested shadow roots until
    // we find a sibling that needs a block cursor beside it.
    let prevShadow = shadowRoot;
    for (const caret of (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$extendCaretToRange"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSiblingCaret"])(shadowRoot, direction))){
        // A caret whose origin is the parent of the current level is the "leave"
        // step walking outward; only keep going while those parents are shadow
        // roots. Any other origin is the adjacent sibling at this level.
        if (caret.origin.is(prevShadow.getParent())) {
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isShadowRootNode"])(caret.origin)) {
                break;
            }
            prevShadow = caret.origin;
            continue;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$needsBlockCursorBeside"])(caret.origin)) {
            const sr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSiblingCaret"])(prevShadow, direction);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$setSelectionFromCaretRange"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getCaretRange"])(sr, sr));
            return true;
        }
        break;
    }
    return false;
}
function $isSelectableBlockDecorator(node) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isDecoratorNode"])(node) && !node.isInline() && !node.isIsolated() && node.isKeyboardSelectable();
}
function $selectNode(key) {
    const nodeSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$createNodeSelection"])();
    nodeSelection.add(key);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$setSelection"])(nodeSelection);
}
function $tryDecoratorLineNavigation(selection, isBackward) {
    if (!selection.isCollapsed()) {
        return false;
    }
    const focus = selection.focus;
    const focusNode = focus.getNode();
    const direction = isBackward ? 'previous' : 'next';
    const focusCaret = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$caretFromPoint"])(focus, direction);
    if (focus.type === 'element' && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isElementNode"])(focusNode) && ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRootNode"])(focusNode) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isShadowRootNode"])(focusNode))) {
        const adjacentChild = focusCaret.getNodeAtCaret();
        if (adjacentChild !== null && $isSelectableBlockDecorator(adjacentChild)) {
            $selectNode(adjacentChild.__key);
            return true;
        }
        return false;
    }
    const topBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$findMatchingParent"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isElementNode"])(focusNode) ? focusNode : focusNode.getParentOrThrow(), (n)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isElementNode"])(n) && !n.isInline() && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRootOrShadowRoot"])(n.getParent()));
    if (topBlock === null) {
        return false;
    }
    const adjacentSibling = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSiblingCaret"])(topBlock, direction).getNodeAtCaret();
    if (adjacentSibling === null || !$isSelectableBlockDecorator(adjacentSibling)) {
        return false;
    }
    // Empty blocks always escape on line-move, so skip the DOM probe.
    if (topBlock.getTextContentSize() === 0) {
        $selectNode(adjacentSibling.__key);
        return true;
    }
    const rootElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getEditor"])().getRootElement();
    if (rootElement === null) {
        return false;
    }
    const domSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDOMSelection"])(rootElement.ownerDocument.defaultView);
    if (domSelection === null || domSelection.rangeCount === 0) {
        return false;
    }
    const savedAnchorNode = domSelection.anchorNode;
    const savedAnchorOffset = domSelection.anchorOffset;
    const savedFocusNode = domSelection.focusNode;
    const savedFocusOffset = domSelection.focusOffset;
    domSelection.modify('move', isBackward ? 'backward' : 'forward', 'line');
    const newAnchorNode = domSelection.anchorNode;
    const newAnchorOffset = domSelection.anchorOffset;
    if (newAnchorNode === null) {
        restoreDOMSelection(domSelection, savedAnchorNode, savedAnchorOffset, savedFocusNode, savedFocusOffset);
        return false;
    }
    const movedNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getNearestNodeFromDOMNode"])(newAnchorNode);
    restoreDOMSelection(domSelection, savedAnchorNode, savedAnchorOffset, savedFocusNode, savedFocusOffset);
    if (movedNode === null) {
        return false;
    }
    // Firefox stays in place when modify('move', 'backward', 'line') hits
    // the top of a block — treat no movement as reaching the block edge.
    const didNotMove = newAnchorNode === savedAnchorNode && newAnchorOffset === savedAnchorOffset;
    if (didNotMove) {
        $selectNode(adjacentSibling.__key);
        return true;
    }
    const stillInSameBlock = movedNode.is(topBlock) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$hasAncestor"])(movedNode, topBlock);
    if (stillInSameBlock) {
        return false;
    }
    $selectNode(adjacentSibling.__key);
    return true;
}
function restoreDOMSelection(domSelection, anchorNode, anchorOffset, focusNode, focusOffset) {
    if (anchorNode !== null && focusNode !== null) {
        domSelection.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
    }
}
function $tryInlineGridLineNavigation(selection, isBackward) {
    if (!selection.isCollapsed()) {
        return false;
    }
    const focusNode = selection.focus.getNode();
    const parentBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$findMatchingParent"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isElementNode"])(focusNode) ? focusNode : focusNode.getParentOrThrow(), (n)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isElementNode"])(n) && !n.isInline());
    if (parentBlock === null) {
        return false;
    }
    const editor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getEditor"])();
    const rootElement = editor.getRootElement();
    if (rootElement === null) {
        return false;
    }
    const win = rootElement.ownerDocument.defaultView;
    if (win === null) {
        return false;
    }
    let hasGrid = false;
    for (const child of parentBlock.getChildren()){
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isElementNode"])(child) && child.isInline()) {
            const dom = editor.getElementByKey(child.getKey());
            if (dom !== null) {
                const d = win.getComputedStyle(dom).display;
                if (d === 'inline-grid' || d === 'inline-flex') {
                    hasGrid = true;
                    break;
                }
            }
        }
    }
    if (!hasGrid) {
        return false;
    }
    const direction = isBackward ? 'previous' : 'next';
    const siblingBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSiblingCaret"])(parentBlock, direction).getNodeAtCaret();
    if (siblingBlock === null || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isElementNode"])(siblingBlock)) {
        if (isBackward) {
            const first = parentBlock.getFirstDescendant();
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isTextNode"])(first)) {
                first.select(0, 0);
            } else {
                parentBlock.select(0, 0);
            }
        } else {
            const last = parentBlock.getLastDescendant();
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isTextNode"])(last)) {
                const len = last.getTextContentSize();
                last.select(len, len);
            } else {
                const count = parentBlock.getChildrenSize();
                parentBlock.select(count, count);
            }
        }
        return true;
    }
    const siblingDOM = editor.getElementByKey(siblingBlock.getKey());
    if (siblingDOM === null) {
        return false;
    }
    const domSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDOMSelection"])(win);
    if (domSelection === null || domSelection.rangeCount === 0) {
        return false;
    }
    const curRange = domSelection.getRangeAt(0).cloneRange();
    curRange.collapse(true);
    const curRect = curRange.getBoundingClientRect();
    const sibRect = siblingDOM.getBoundingClientRect();
    const targetY = sibRect.top + sibRect.height / 2;
    if (curRect.height > 0) {
        const hit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$clipboard$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$clipboard$2f$dist$2f$LexicalClipboard$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["caretFromPoint"])(curRect.left, targetY, rootElement);
        if (hit !== null && siblingDOM.contains(hit.node)) {
            const hitRange = rootElement.ownerDocument.createRange();
            hitRange.setStart(hit.node, hit.offset);
            hitRange.collapse(true);
            selection.applyDOMRange(hitRange);
            selection.dirty = true;
            return true;
        }
    }
    const targetDesc = isBackward ? siblingBlock.getLastDescendant() : siblingBlock.getFirstDescendant();
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isTextNode"])(targetDesc)) {
        const offset = isBackward ? targetDesc.getTextContentSize() : 0;
        targetDesc.select(offset, offset);
    } else {
        const childCount = siblingBlock.getChildrenSize();
        siblingBlock.select(isBackward ? childCount : 0, isBackward ? childCount : 0);
    }
    return true;
}
function $exitNodeSelectionToward(node, direction) {
    const caret = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSiblingCaret"])(node, direction);
    const sibling = caret.getAdjacentCaret();
    if (sibling !== null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isElementNode"])(sibling.origin) && !sibling.origin.isInline() && sibling.origin.isShadowRoot()) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$setSelectionFromCaretRange"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getCollapsedCaretRange"])(caret));
    } else if (direction === 'next') {
        node.selectNext(0, 0);
    } else {
        node.selectPrevious();
    }
}
/**
 * Collapse a NodeSelection to a caret at the surrounding block's edge for
 * MOVE_TO_START / MOVE_TO_END. Picks the document-order first node for
 * MOVE_TO_START (`isBackward = true`) or last for MOVE_TO_END, walks up
 * to the picked node's nearest non-inline ancestor, and lands the caret
 * at that block's offset `0` or `childrenSize`.
 *
 * Document order is resolved via `$comparePointCaretNext` over each
 * selected node's `'next'` sibling caret — `NodeSelection.getNodes()`
 * iterates `_nodes: Set<NodeKey>` in click-insertion order, so a Set-
 * index pick would land on the most-recently-clicked node, not the
 * document-order first / last.
 *
 * A decorator nested inside an element-decorator host (e.g. inside a
 * card title paragraph) promotes to the surrounding paragraph rather
 * than the host's edge — the `n !== targetNode` guard excludes the
 * node itself, so a whole-element NodeSelection (the host) snaps to
 * its parent block, not its own interior. Falls back to the root when
 * no non-inline ancestor below the root matches, which lands the
 * caret at the document edge.
 *
 * Distinct from `KEY_ARROW_LEFT_COMMAND` / `KEY_ARROW_RIGHT_COMMAND`,
 * which step to the immediate sibling via `selectPrevious` /
 * `selectNext`. Cmd+Arrow is a line-end command rather than a one-step
 * caret move, so the block edge is the intended target. `event.shiftKey`
 * is not honored — NodeSelection has no natural "extend toward block
 * edge" semantic.
 *
 * Always calls `preventDefault` and `stopPropagation` so Chrome's
 * native Cmd+Arrow page-navigate cannot fall through.
 *
 * @internal
 */ function $promoteNodeSelectionToBlockEdge(selection, isBackward, event) {
    event.preventDefault();
    event.stopPropagation();
    const nodes = selection.getNodes();
    if (nodes.length === 0) {
        return true;
    }
    const sorted = nodes.map((node)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSiblingCaret"])(node, 'next')).sort(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$comparePointCaretNext"]);
    const targetNode = (isBackward ? sorted[0] : sorted[sorted.length - 1]).origin;
    const block = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$findMatchingParent"])(targetNode, (n)=>n !== targetNode && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isElementNode"])(n) && !n.isInline()) ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getRoot"])();
    const offset = isBackward ? 0 : block.getChildrenSize();
    block.select(offset, offset);
    return true;
}
function registerRichText(editor, escapeFormatTriggers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$extension$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$extension$2f$dist$2f$LexicalExtension$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["signal"])(DEFAULT_ESCAPE_FORMAT_TRIGGERS)) {
    const removeListener = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeRegister"])(editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CLICK_COMMAND"], ()=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isNodeSelection"])(selection)) {
            selection.clear();
            return true;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
            $escapeFormatsForTrigger(selection, 'click', 'both', escapeFormatTriggers.peek());
        }
        return false;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DELETE_CHARACTER_COMMAND"], (isBackward)=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
            selection.deleteCharacter(isBackward);
            return true;
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isNodeSelection"])(selection)) {
            selection.deleteNodes();
            return true;
        }
        return false;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DELETE_WORD_COMMAND"], (isBackward)=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
            return false;
        }
        selection.deleteWord(isBackward);
        return true;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DELETE_LINE_COMMAND"], (isBackward)=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
            return false;
        }
        selection.deleteLine(isBackward);
        return true;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONTROLLED_TEXT_INSERTION_COMMAND"], (eventOrText)=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if (typeof eventOrText === 'string') {
            if (selection !== null) {
                selection.insertText(eventOrText);
            }
        } else {
            if (selection === null) {
                return false;
            }
            const dataTransfer = eventOrText.dataTransfer;
            if (dataTransfer != null) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$clipboard$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$clipboard$2f$dist$2f$LexicalClipboard$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$insertDataTransferForRichText"])(dataTransfer, selection, editor);
            } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
                const data = eventOrText.data;
                if (data) {
                    selection.insertText(data);
                }
                return true;
            }
        }
        return true;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REMOVE_TEXT_COMMAND"], ()=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
            return false;
        }
        selection.removeText();
        return true;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FORMAT_TEXT_COMMAND"], (format)=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isNodeSelection"])(selection)) {
            return false;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$formatText"])(selection, format);
        return true;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SET_TEXT_FORMAT_COMMAND"], (formats)=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isNodeSelection"])(selection)) {
            return false;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$setTextFormat"])(selection, formats);
        return true;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FORMAT_ELEMENT_COMMAND"], (format)=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isNodeSelection"])(selection)) {
            return false;
        }
        const nodes = selection.getNodes();
        for (const node of nodes){
            const element = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$findMatchingParent"])(node, (parentNode)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isElementNode"])(parentNode) && !parentNode.isInline());
            if (element !== null) {
                element.setFormat(format);
            }
        }
        return true;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INSERT_LINE_BREAK_COMMAND"], (selectStart)=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
            return false;
        }
        selection.insertLineBreak(selectStart);
        return true;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INSERT_PARAGRAPH_COMMAND"], ()=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
            return false;
        }
        selection.insertParagraph();
        return true;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INSERT_TAB_COMMAND"], ()=>{
        const tabNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$createTabNode"])();
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
            tabNode.setFormat(selection.format);
            tabNode.setStyle(selection.style);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$insertNodes"])([
            tabNode
        ]);
        return true;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INDENT_CONTENT_COMMAND"], ()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$utils$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$utils$2f$dist$2f$LexicalUtils$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$handleIndentAndOutdent"])((block)=>{
            const indent = block.getIndent();
            block.setIndent(indent + 1);
        });
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OUTDENT_CONTENT_COMMAND"], ()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$utils$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$utils$2f$dist$2f$LexicalUtils$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$handleIndentAndOutdent"])((block)=>{
            const indent = block.getIndent();
            if (indent > 0) {
                block.setIndent(Math.max(0, indent - 1));
            }
        });
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KEY_ARROW_UP_COMMAND"], (event)=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isNodeSelection"])(selection)) {
            // If selection is on a node, let's try and move selection
            // back to being a range selection.
            const nodes = selection.getNodes();
            if (nodes.length > 0) {
                event.preventDefault();
                $exitNodeSelectionToward(nodes[0], 'previous');
                return true;
            }
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
            if (!event.shiftKey && $tryBlockCursorShadowRootNavigation(selection, 'previous')) {
                event.preventDefault();
                return true;
            }
            if (!event.shiftKey && $tryDecoratorLineNavigation(selection, true)) {
                event.preventDefault();
                return true;
            }
            if (!event.shiftKey && $tryInlineGridLineNavigation(selection, true)) {
                event.preventDefault();
                return true;
            }
        }
        return false;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KEY_ARROW_DOWN_COMMAND"], (event)=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isNodeSelection"])(selection)) {
            // If selection is on a node, let's try and move selection
            // back to being a range selection.
            const nodes = selection.getNodes();
            if (nodes.length > 0) {
                event.preventDefault();
                $exitNodeSelectionToward(nodes[0], 'next');
                return true;
            }
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
            if ($isSelectionAtEndOfRoot(selection)) {
                event.preventDefault();
                return true;
            }
            if (!event.shiftKey && $tryBlockCursorShadowRootNavigation(selection, 'next')) {
                event.preventDefault();
                return true;
            }
            if (!event.shiftKey && $tryDecoratorLineNavigation(selection, false)) {
                event.preventDefault();
                return true;
            }
            if (!event.shiftKey && $tryInlineGridLineNavigation(selection, false)) {
                event.preventDefault();
                return true;
            }
        }
        return false;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KEY_ARROW_LEFT_COMMAND"], (event)=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isNodeSelection"])(selection)) {
            // If selection is on a node, let's try and move selection
            // back to being a range selection.
            const nodes = selection.getNodes();
            if (nodes.length > 0) {
                event.preventDefault();
                $exitNodeSelectionToward(nodes[0], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$selection$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$selection$2f$dist$2f$LexicalSelection$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$isParentRTL"])(nodes[0]) ? 'next' : 'previous');
                return true;
            }
        }
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
            return false;
        }
        if (!event.shiftKey && $tryBlockCursorShadowRootNavigation(selection, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$selection$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$selection$2f$dist$2f$LexicalSelection$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$isParentRTL"])(selection.anchor.getNode()) ? 'next' : 'previous')) {
            event.preventDefault();
            return true;
        }
        if (!event.shiftKey) {
            $escapeFormatsForTrigger(selection, 'arrow', 'start', escapeFormatTriggers.peek());
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$selection$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$selection$2f$dist$2f$LexicalSelection$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$shouldOverrideDefaultCharacterSelection"])(selection, true)) {
            const isHoldingShift = event.shiftKey;
            event.preventDefault();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$selection$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$selection$2f$dist$2f$LexicalSelection$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$moveCharacter"])(selection, isHoldingShift, true);
            return true;
        }
        return false;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KEY_ARROW_RIGHT_COMMAND"], (event)=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isNodeSelection"])(selection)) {
            // If selection is on a node, let's try and move selection
            // back to being a range selection.
            const nodes = selection.getNodes();
            if (nodes.length > 0) {
                event.preventDefault();
                $exitNodeSelectionToward(nodes[0], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$selection$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$selection$2f$dist$2f$LexicalSelection$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$isParentRTL"])(nodes[0]) ? 'previous' : 'next');
                return true;
            }
        }
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
            return false;
        }
        if (!event.shiftKey && $tryBlockCursorShadowRootNavigation(selection, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$selection$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$selection$2f$dist$2f$LexicalSelection$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$isParentRTL"])(selection.anchor.getNode()) ? 'previous' : 'next')) {
            event.preventDefault();
            return true;
        }
        if (!event.shiftKey) {
            $escapeFormatsForTrigger(selection, 'arrow', 'end', escapeFormatTriggers.peek());
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$selection$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$selection$2f$dist$2f$LexicalSelection$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$shouldOverrideDefaultCharacterSelection"])(selection, false)) {
            const isHoldingShift = event.shiftKey;
            event.preventDefault();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$selection$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$selection$2f$dist$2f$LexicalSelection$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$moveCharacter"])(selection, isHoldingShift, false);
            return true;
        }
        return false;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KEY_BACKSPACE_COMMAND"], (event)=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        // A NodeSelection (e.g. a click that selected a block decorator) is
        // the user's explicit "delete this node" gesture. The decorator
        // pass-through below is meant to keep keystrokes flowing into an
        // editable nested inside a decorator (image caption, etc.), but a
        // NodeSelection is exactly the case where the user wants us to
        // handle backspace ourselves.
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isNodeSelection"])(selection)) {
            if ($isTargetWithinDecorator(event.target)) {
                return false;
            }
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
            if ($isSelectionCollapsedAtFrontOfIndentedBlock(selection)) {
                event.preventDefault();
                return editor.dispatchCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OUTDENT_CONTENT_COMMAND"], undefined);
            }
            // On iOS, blocking the keydown event's default prevents the system
            // keyboard from updating its autocomplete/autocorrect suggestion bar
            // after Backspace. Returning false here skips event.preventDefault()
            // on keydown; the beforeinput deleteContentBackward handler still runs
            // and performs the deletion, so editing behavior is unchanged.
            // See https://github.com/facebook/lexical/issues/5841
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IS_IOS"] && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CAN_USE_BEFORE_INPUT"]) {
                return false;
            }
        } else if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isNodeSelection"])(selection)) {
            return false;
        }
        event.preventDefault();
        return editor.dispatchCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DELETE_CHARACTER_COMMAND"], true);
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KEY_DELETE_COMMAND"], (event)=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        // Same NodeSelection bypass as KEY_BACKSPACE_COMMAND above: a click
        // that selected a block decorator is the user's "delete this node"
        // gesture, even though the click target lives inside a decorator.
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isNodeSelection"])(selection)) {
            if ($isTargetWithinDecorator(event.target)) {
                return false;
            }
        }
        if (!((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isNodeSelection"])(selection))) {
            return false;
        }
        event.preventDefault();
        return editor.dispatchCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DELETE_CHARACTER_COMMAND"], false);
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KEY_ENTER_COMMAND"], (event)=>{
        let selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        // When a block-level DecoratorNode is selected as a NodeSelection
        // (e.g. it is the only root child after the user removed all
        // surrounding paragraphs), Enter has no RangeSelection to act on
        // and the default handler bails out, leaving the editor stuck.
        // Convert to a RangeSelection past the decorator so the default
        // RangeSelection handler below inserts a paragraph and places
        // the caret.
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isNodeSelection"])(selection)) {
            const nodes = selection.getNodes();
            if (nodes.length === 1 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isDecoratorNode"])(nodes[0]) && !nodes[0].isInline()) {
                selection = nodes[0].selectNext();
            }
        }
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
            return false;
        }
        $escapeFormatsForTrigger(selection, 'enter', 'both', escapeFormatTriggers.peek());
        if (event !== null) {
            // If we have beforeinput, then we can avoid blocking
            // the default behavior. This ensures that the iOS can
            // intercept that we're actually inserting a paragraph,
            // and autocomplete, autocapitalize etc work as intended.
            // This can also cause a strange performance issue in
            // Safari, where there is a noticeable pause due to
            // preventing the key down of enter.
            if ((__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IS_IOS"] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IS_SAFARI"] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IS_APPLE_WEBKIT"]) && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CAN_USE_BEFORE_INPUT"]) {
                return false;
            }
            event.preventDefault();
            if (event.shiftKey) {
                return editor.dispatchCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INSERT_LINE_BREAK_COMMAND"], false);
            }
        }
        return editor.dispatchCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INSERT_PARAGRAPH_COMMAND"], undefined);
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KEY_ESCAPE_COMMAND"], ()=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
            return false;
        }
        editor.blur();
        return true;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DROP_COMMAND"], (event)=>{
        const [, files] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$utils$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$utils$2f$dist$2f$LexicalUtils$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["eventFiles"])(event);
        if (files.length > 0) {
            const x = event.clientX;
            const y = event.clientY;
            const eventRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$clipboard$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$clipboard$2f$dist$2f$LexicalClipboard$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["caretFromPoint"])(x, y, editor.getRootElement());
            if (eventRange !== null) {
                const { offset: domOffset, node: domNode } = eventRange;
                const node = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getNearestNodeFromDOMNode"])(domNode);
                if (node !== null) {
                    const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$createRangeSelection"])();
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isTextNode"])(node)) {
                        selection.anchor.set(node.getKey(), domOffset, 'text');
                        selection.focus.set(node.getKey(), domOffset, 'text');
                    } else {
                        const parentKey = node.getParentOrThrow().getKey();
                        const offset = node.getIndexWithinParent() + 1;
                        selection.anchor.set(parentKey, offset, 'element');
                        selection.focus.set(parentKey, offset, 'element');
                    }
                    const normalizedSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$normalizeSelection__EXPERIMENTAL"])(selection);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$setSelection"])(normalizedSelection);
                }
                editor.dispatchCommand(DRAG_DROP_PASTE, files);
            }
            event.preventDefault();
            return true;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$clipboard$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$clipboard$2f$dist$2f$LexicalClipboard$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$handleRichTextDrop"])(event, editor);
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DRAGSTART_COMMAND"], (event)=>{
        const [isFileTransfer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$utils$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$utils$2f$dist$2f$LexicalUtils$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["eventFiles"])(event);
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if (isFileTransfer && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
            return false;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection) && !selection.isCollapsed() && event.dataTransfer !== null) {
            // Populate Lexical's own serialization so custom nodes (images,
            // decorators) survive a drop back into a Lexical editor rather than
            // being downgraded to text/html.
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$clipboard$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$clipboard$2f$dist$2f$LexicalClipboard$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setLexicalClipboardDataTransfer"])(event.dataTransfer, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$clipboard$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$clipboard$2f$dist$2f$LexicalClipboard$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getClipboardDataFromSelection"])(selection));
            // Mark the drag source so a drop in a different editor can remove
            // the source range to produce cut-and-paste semantics.
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$clipboard$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$clipboard$2f$dist$2f$LexicalClipboard$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$writeDragSourceToDataTransfer"])(event.dataTransfer, editor);
        }
        return true;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DRAGOVER_COMMAND"], (event)=>{
        const [isFileTransfer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$utils$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$utils$2f$dist$2f$LexicalUtils$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["eventFiles"])(event);
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if (isFileTransfer && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
            return false;
        }
        // Do NOT call event.preventDefault() here for text drags. Canceling
        // dragover tells the browser the page will handle the drop itself,
        // which suppresses the native editable drop behavior (drop caret
        // tracking and the beforeinput insertFromDrop that $doDrop relies on
        // for drags that don't originate in a Lexical editor). The only
        // exception is a decorator node, which the browser can't show a drop
        // caret for anyway and whose drops are fully handled by DROP_COMMAND.
        const x = event.clientX;
        const y = event.clientY;
        const eventRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$clipboard$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$clipboard$2f$dist$2f$LexicalClipboard$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["caretFromPoint"])(x, y, editor.getRootElement());
        if (eventRange !== null) {
            const node = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getNearestNodeFromDOMNode"])(eventRange.node);
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isDecoratorNode"])(node)) {
                event.preventDefault();
            }
        }
        return true;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SELECT_ALL_COMMAND"], ()=>{
        // Scope SELECT_ALL only when the caret is inside a named-slot frame:
        // slots are shadow-root isolated, so a whole-document select-all
        // would escape the slot and let a single keystroke replace the host.
        // Every other context (including TableCell shadow roots) keeps the
        // legacy whole-document behavior; block/document scoping elsewhere
        // is provided by the opt-in SelectBlockExtension.
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$selectAll"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSlotFrame"])(selection.anchor.getNode()) !== null ? selection : null);
        return true;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COPY_COMMAND"], (event)=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$clipboard$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$clipboard$2f$dist$2f$LexicalClipboard$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["copyToClipboard"])(editor, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$utils$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$utils$2f$dist$2f$LexicalUtils$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["objectKlassEquals"])(event, ClipboardEvent) ? event : null);
        return true;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CUT_COMMAND"], (event)=>{
        onCutForRichText(event, editor);
        return true;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PASTE_COMMAND"], (event)=>{
        const [, files, hasTextContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$lexical$2b$utils$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f40$lexical$2f$utils$2f$dist$2f$LexicalUtils$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["eventFiles"])(event);
        if (files.length > 0 && !hasTextContent) {
            editor.dispatchCommand(DRAG_DROP_PASTE, files);
            return true;
        }
        // if inputs then paste within the input ignore creating a new node on paste event
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDOMNode"])(event.target) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isSelectionCapturedInDecoratorInput"])(event.target)) {
            return false;
        }
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if (selection !== null) {
            onPasteForRichText(event, editor);
            return true;
        }
        return false;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KEY_SPACE_COMMAND"], ()=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
            $escapeFormatsForTrigger(selection, 'space', 'both', escapeFormatTriggers.peek());
        }
        return false;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KEY_TAB_COMMAND"], ()=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
            $escapeFormatsForTrigger(selection, 'tab', 'both', escapeFormatTriggers.peek());
        }
        return false;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOVE_TO_END"], (event)=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isNodeSelection"])(selection)) {
            return $promoteNodeSelectionToBlockEdge(selection, false, event);
        }
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
            return false;
        }
        const { anchor } = selection;
        if (anchor.type !== 'element' || anchor.offset !== 0) {
            return false;
        }
        const element = anchor.getNode();
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isElementNode"])(element)) {
            return false;
        }
        const firstChild = element.getFirstChild();
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isDecoratorNode"])(firstChild) || !firstChild.isInline()) {
            return false;
        }
        // Native browser cursor traversal stops at the inline decorator's
        // contenteditable=false boundary when the caret starts at element
        // offset 0, so MOVE_TO_END leaves the caret stuck. Move it
        // ourselves. `element.selectEnd()` already handles every
        // last-descendant case correctly — text descendant produces a
        // text-type selection at the end of the run, decorator descendant
        // and the empty-element fallback both produce an element-type
        // selection at offset childrenSize.
        const elementKey = element.getKey();
        const ending = element.selectEnd();
        if (event.shiftKey) {
            ending.anchor.set(elementKey, 0, 'element');
        }
        event.preventDefault();
        event.stopPropagation();
        return true;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]), editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOVE_TO_START"], (event)=>{
        const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isNodeSelection"])(selection)) {
            return $promoteNodeSelectionToBlockEdge(selection, true, event);
        }
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) {
            return false;
        }
        const { anchor, focus } = selection;
        const focusBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$findMatchingParent"])(focus.getNode(), (node)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isElementNode"])(node) && !node.isInline());
        if (focusBlock === null) {
            return false;
        }
        const firstChild = focusBlock.getFirstChild();
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isDecoratorNode"])(firstChild) || !firstChild.isInline()) {
            return false;
        }
        // Cross-block selections fall through to native handling. The
        // Chromium boundary bug only matters when both endpoints sit
        // inside the block whose first child is the inline decorator.
        const anchorBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$findMatchingParent"])(anchor.getNode(), (node)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isElementNode"])(node) && !node.isInline());
        if (anchorBlock !== focusBlock) {
            return false;
        }
        const blockKey = focusBlock.getKey();
        if (focus.type === 'element' && focus.key === blockKey && focus.offset === 0) {
            return false;
        }
        // Symmetric to the MOVE_TO_END case: Chromium stops the native
        // caret at the inline decorator's contenteditable=false boundary
        // when moving backwards, so element offset 0 is unreachable.
        selection.focus.set(blockKey, 0, 'element');
        if (!event.shiftKey) {
            selection.anchor.set(blockKey, 0, 'element');
        }
        event.preventDefault();
        event.stopPropagation();
        return true;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lexical$40$0$2e$48$2e$0_typescript$40$5$2e$9$2e$3$2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_EDITOR"]));
    return removeListener;
}
;
}),
];

//# sourceMappingURL=0_64_%40lexical_rich-text_dist_LexicalRichText_dev_mjs_1d--__q._.js.map