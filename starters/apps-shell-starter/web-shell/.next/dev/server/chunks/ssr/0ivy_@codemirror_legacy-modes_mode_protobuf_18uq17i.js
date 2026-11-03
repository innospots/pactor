module.exports = [
"[project]/node_modules/.pnpm/@codemirror+legacy-modes@6.5.5/node_modules/@codemirror/legacy-modes/mode/protobuf.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "protobuf",
    ()=>protobuf
]);
function wordRegexp(words) {
    return new RegExp("^((" + words.join(")|(") + "))\\b", "i");
}
;
var keywordArray = [
    "package",
    "message",
    "import",
    "syntax",
    "required",
    "optional",
    "repeated",
    "reserved",
    "default",
    "extensions",
    "packed",
    "bool",
    "bytes",
    "double",
    "enum",
    "float",
    "string",
    "int32",
    "int64",
    "uint32",
    "uint64",
    "sint32",
    "sint64",
    "fixed32",
    "fixed64",
    "sfixed32",
    "sfixed64",
    "option",
    "service",
    "rpc",
    "returns"
];
var keywords = wordRegexp(keywordArray);
var identifiers = new RegExp("^[_A-Za-z\xa1-\uffff][_A-Za-z0-9\xa1-\uffff]*");
function tokenBase(stream) {
    // whitespaces
    if (stream.eatSpace()) return null;
    // Handle one line Comments
    if (stream.match("//")) {
        stream.skipToEnd();
        return "comment";
    }
    // Handle Number Literals
    if (stream.match(/^[0-9\.+-]/, false)) {
        if (stream.match(/^[+-]?0x[0-9a-fA-F]+/)) return "number";
        if (stream.match(/^[+-]?\d*\.\d+([EeDd][+-]?\d+)?/)) return "number";
        if (stream.match(/^[+-]?\d+([EeDd][+-]?\d+)?/)) return "number";
    }
    // Handle Strings
    if (stream.match(/^"([^"]|(""))*"/)) {
        return "string";
    }
    if (stream.match(/^'([^']|(''))*'/)) {
        return "string";
    }
    // Handle words
    if (stream.match(keywords)) {
        return "keyword";
    }
    if (stream.match(identifiers)) {
        return "variable";
    }
    ;
    // Handle non-detected items
    stream.next();
    return null;
}
;
const protobuf = {
    name: "protobuf",
    token: tokenBase,
    languageData: {
        autocomplete: keywordArray
    }
};
}),
];

//# sourceMappingURL=0ivy_%40codemirror_legacy-modes_mode_protobuf_18uq17i.js.map