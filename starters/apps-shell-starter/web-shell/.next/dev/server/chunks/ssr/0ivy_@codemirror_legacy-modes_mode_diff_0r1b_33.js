module.exports = [
"[project]/node_modules/.pnpm/@codemirror+legacy-modes@6.5.5/node_modules/@codemirror/legacy-modes/mode/diff.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "diff",
    ()=>diff
]);
var TOKEN_NAMES = {
    '+': 'inserted',
    '-': 'deleted',
    '@': 'meta'
};
const diff = {
    name: "diff",
    token: function(stream) {
        var tw_pos = stream.string.search(/[\t ]+?$/);
        if (!stream.sol() || tw_pos === 0) {
            stream.skipToEnd();
            return ("error " + (TOKEN_NAMES[stream.string.charAt(0)] || '')).replace(/ $/, '');
        }
        var token_name = TOKEN_NAMES[stream.peek()] || stream.skipToEnd();
        if (tw_pos === -1) {
            stream.skipToEnd();
        } else {
            stream.pos = tw_pos;
        }
        return token_name;
    }
};
}),
];

//# sourceMappingURL=0ivy_%40codemirror_legacy-modes_mode_diff_0r1b_33.js.map