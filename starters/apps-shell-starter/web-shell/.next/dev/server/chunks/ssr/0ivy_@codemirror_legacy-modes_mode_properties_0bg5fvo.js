module.exports = [
"[project]/node_modules/.pnpm/@codemirror+legacy-modes@6.5.5/node_modules/@codemirror/legacy-modes/mode/properties.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "properties",
    ()=>properties
]);
const properties = {
    name: "properties",
    token: function(stream, state) {
        var sol = stream.sol() || state.afterSection;
        var eol = stream.eol();
        state.afterSection = false;
        if (sol) {
            if (state.nextMultiline) {
                state.inMultiline = true;
                state.nextMultiline = false;
            } else {
                state.position = "def";
            }
        }
        if (eol && !state.nextMultiline) {
            state.inMultiline = false;
            state.position = "def";
        }
        if (sol) {
            while(stream.eatSpace()){}
        }
        var ch = stream.next();
        if (sol && (ch === "#" || ch === "!" || ch === ";")) {
            state.position = "comment";
            stream.skipToEnd();
            return "comment";
        } else if (sol && ch === "[") {
            state.afterSection = true;
            stream.skipTo("]");
            stream.eat("]");
            return "header";
        } else if (ch === "=" || ch === ":") {
            state.position = "quote";
            return null;
        } else if (ch === "\\" && state.position === "quote") {
            if (stream.eol()) {
                // Multiline value
                state.nextMultiline = true;
            }
        }
        return state.position;
    },
    startState: function() {
        return {
            position: "def",
            nextMultiline: false,
            inMultiline: false,
            afterSection: false // Did we just open a section
        };
    }
};
}),
];

//# sourceMappingURL=0ivy_%40codemirror_legacy-modes_mode_properties_0bg5fvo.js.map