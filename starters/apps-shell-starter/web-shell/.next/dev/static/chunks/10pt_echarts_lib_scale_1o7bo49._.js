(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/Interval.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/ /**
 * AUTO-GENERATED FILE. DO NOT MODIFY.
 */ /*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.3.0/node_modules/tslib/tslib.es6.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/format.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Scale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/Scale.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/helper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/break.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$minorTicks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/minorTicks.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/scaleMapper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-client] (ecmascript)");
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
var IntervalScale = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(IntervalScale, _super);
    function IntervalScale(setting) {
        var _this = _super.call(this) || this;
        _this.type = 'interval';
        _this.parse = IntervalScale.parse;
        setting = setting || {};
        var breakParsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["simplyParseBreakOption"])(_this, setting);
        var res = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initBreakOrLinearMapper"])(_this, breakParsed, null);
        // @ts-ignore
        _this.brk = res.brk;
        _this._cfg = {
            interval: 0,
            intervalPrecision: 2,
            intervalCount: undefined,
            niceExtent: undefined
        };
        return _this;
    }
    IntervalScale.parse = function(val) {
        // `Scale#parse` (and its overrids) are typically applied at the axis values input
        // in echarts option. e.g., `axis.min/max`, `dataZoom.min/max`, etc.
        // but `series.data` is not included, which uses `dataValueHelper.ts`#`parseDataValue`.
        // `Scale#parse` originally introduced in fb8c813215098b9d2458966229bb95c510883d5e
        // at 2016 for dataZoom start/end settings (See `parseAxisModelMinMax`).
        //
        // Historically `scale/Interval.ts` returns the input value directly. But numeric
        // values (such as a number-like string '123') effectively passed through here and
        // were involved in calculations, which was error-prone and inconsistent with the
        // declared TS return type. Previously such issues are fixed separately in different
        // places case by case (such as #2475).
        //
        // Now, we perform actual parse to ensure its `number` type here. The parsing rule
        // follows the series data parsing rule (`dataValueHelper.ts`#`parseDataValue`)
        // and maintains compatibility as much as possible (thus a more strict parsing
        // `number.ts`#`numericToNumber` is not used here.)
        //
        // FIXME: `ScaleDataValue` also need to be modified to include numeric string type,
        //  since it effectively does.
        return val == null || val === '' ? NaN : Number(val);
    };
    IntervalScale.prototype.getConfig = function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clone"])(this._cfg);
    };
    IntervalScale.prototype.setConfig = function(cfg) {
        var extent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScaleExtentForTickUnsafe"])(this);
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])(cfg.interval != null);
            if (cfg.intervalCount != null) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])(cfg.intervalCount >= -1 && cfg.intervalPrecision != null && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasBreaks"])(this));
            }
            if (cfg.niceExtent != null) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])(isFinite(cfg.niceExtent[0]) && isFinite(cfg.niceExtent[1]));
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])(extent[0] <= cfg.niceExtent[0] && cfg.niceExtent[1] <= extent[1]);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(cfg.niceExtent[0] - cfg.niceExtent[1], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrecision"])(cfg.interval)) <= cfg.interval);
            }
        }
        // Reset all.
        this._cfg = cfg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clone"])(cfg);
        if (cfg.niceExtent == null) {
            // Dropped the auto calculated niceExtent and use user-set extent.
            // We assume users want to set both interval and extent to get a better result.
            cfg.niceExtent = extent.slice();
        }
        if (cfg.intervalPrecision == null) {
            cfg.intervalPrecision = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getIntervalPrecision"])(cfg.interval);
        }
    };
    /**
   * In ascending order.
   */ IntervalScale.prototype.getTicks = function(opt) {
        opt = opt || {};
        var cfg = this._cfg;
        var interval = cfg.interval;
        var extent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScaleExtentForTickUnsafe"])(this);
        var niceExtent = cfg.niceExtent;
        var intervalPrecision = cfg.intervalPrecision;
        var scaleBreakHelper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScaleBreakHelper"])();
        var brk = this.brk;
        var brkAvailable = scaleBreakHelper && brk;
        var ticks = [];
        // If interval is 0, return [];
        if (!interval) {
            return ticks;
        }
        if (opt.breakTicks === 'only_break' && brkAvailable) {
            scaleBreakHelper.addBreaksToTicks(ticks, brk.breaks, extent);
            return ticks;
        }
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])(niceExtent != null);
        }
        // [CAVEAT]: If changing this logic, must sync it to `axisAlignTicks.ts`.
        // A fail-safe is required since `interval` can be user specified, or for the case
        // that using dataZoom toolbox and zoom repeatedly.
        var safeLimit = 3000;
        if (extent[0] < niceExtent[0]) {
            ticks.push({
                value: opt.expandToNicedExtent ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(niceExtent[0] - interval, intervalPrecision) : extent[0]
            });
        }
        var estimateNiceMultiple = function(tickVal, targetTick) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathRound"])((targetTick - tickVal) / interval);
        };
        var intervalCount = cfg.intervalCount;
        for(var tick = niceExtent[0], niceTickIdx = 0;; niceTickIdx++){
            // Consider case `_extent: [5.2, 5.8], _niceExtent: [6, 5], interval: 1`,
            //  `_intervalCount` makes sense iff `-1`.
            // Consider case `_extent: [5, 5.8], _niceExtent: [5, 5], interval: 1`,
            //  `_intervalCount` makes sense iff `0`.
            if (intervalCount == null) {
                if (tick > niceExtent[1] || !isFinite(tick) || !isFinite(niceExtent[1])) {
                    break;
                }
            } else {
                if (niceTickIdx > intervalCount) {
                    break;
                }
                // Consider cumulative error, especially caused by rounding, the last nice
                // `tick` may be less than or greater than `niceExtent[1]` slightly.
                tick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathMin"])(tick, niceExtent[1]);
                if (niceTickIdx === intervalCount) {
                    tick = niceExtent[1];
                }
            }
            ticks.push({
                value: tick
            });
            // Avoid rounding error
            tick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(tick + interval, intervalPrecision);
            if (brk) {
                var moreMultiple = brk.calcNiceTickMultiple(tick, estimateNiceMultiple);
                if (moreMultiple >= 0) {
                    tick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(tick + moreMultiple * interval, intervalPrecision);
                }
            }
            if (ticks.length > 0 && tick === ticks[ticks.length - 1].value) {
                break;
            }
            if (ticks.length > safeLimit) {
                if ("TURBOPACK compile-time truthy", 1) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warn"])('Exceed safe limit in IntervalScale["getTicks"].');
                }
                return [];
            }
        }
        // Consider this case: the last item of ticks is smaller
        // than niceExtent[1] and niceExtent[1] === extent[1].
        var lastNiceTick = ticks.length ? ticks[ticks.length - 1].value : niceExtent[1];
        if (extent[1] > lastNiceTick) {
            ticks.push({
                value: opt.expandToNicedExtent ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(lastNiceTick + interval, intervalPrecision) : extent[1]
            });
        }
        if (brkAvailable) {
            scaleBreakHelper.pruneTicksByBreak(opt.pruneByBreak, ticks, brk.breaks, function(item) {
                return item.value;
            }, cfg.interval, extent);
        }
        if (brkAvailable && opt.breakTicks !== 'none') {
            scaleBreakHelper.addBreaksToTicks(ticks, brk.breaks, extent);
        }
        return ticks;
    };
    IntervalScale.prototype.getMinorTicks = function(splitNumber) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$minorTicks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMinorTicks"])(this, splitNumber, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBreaksUnsafe"])(this), this._cfg.interval);
    };
    IntervalScale.prototype.getLabel = function(tick, opt) {
        if (tick == null) {
            return '';
        }
        var precision = opt && opt.precision;
        if (precision == null) {
            precision = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrecision"])(tick.value) || 0;
        } else if (precision === 'auto') {
            // Should be more precise then tick.
            precision = this._cfg.intervalPrecision;
        }
        // (1) If `precision` is set, 12.005 should be display as '12.00500'.
        // (2) Use `round` (toFixed) to avoid scientific notation like '3.5e-7'.
        var dataNum = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(tick.value, precision, true);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["addCommas"])(dataNum);
    };
    IntervalScale.type = 'interval';
    return IntervalScale;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Scale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Scale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].registerClass(IntervalScale);
const __TURBOPACK__default__export__ = IntervalScale;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/Log.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/ /**
 * AUTO-GENERATED FILE. DO NOT MODIFY.
 */ /*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.3.0/node_modules/tslib/tslib.es6.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Scale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/Scale.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Interval$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/Interval.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/helper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/break.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$minorTicks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/minorTicks.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/scaleMapper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-client] (ecmascript)");
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
var LOOKUP_IDX_EXTENT_START = 0;
var LOOKUP_IDX_EXTENT_END = 1;
var LOOKUP_IDX_BREAK_START = 2;
/**
 * @final NEVER inherit me!
 */ var LogScale = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(LogScale, _super);
    function LogScale(setting) {
        var _this = _super.call(this) || this;
        _this.type = 'log';
        _this.parse = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Interval$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].parse;
        _this.base = setting.logBase || 10;
        var lookupFrom = [];
        var lookupTo = [];
        var lookup = _this._lookup = {
            from: lookupFrom,
            to: lookupTo
        };
        lookupFrom[LOOKUP_IDX_EXTENT_START] = lookupFrom[LOOKUP_IDX_EXTENT_END] = lookupTo[LOOKUP_IDX_EXTENT_START] = lookupTo[LOOKUP_IDX_EXTENT_END] = NaN;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decorateScaleMapper"])(_this, LogScale.mapperMethods);
        var scaleBreakHelper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScaleBreakHelper"])();
        var breakOption = setting.breakOption;
        var out = {
            lookup: lookup
        };
        if (scaleBreakHelper) {
            scaleBreakHelper.parseAxisBreakOptionInwardTransform(breakOption, _this, {
                noNegative: true
            }, LOOKUP_IDX_BREAK_START, out);
        }
        _this.powStub = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Interval$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]({
            breakParsed: out.original
        });
        _this.intervalStub = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Interval$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]({
            breakParsed: out.transformed
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enableScaleMapperFreeze"])(_this, _this.intervalStub);
        return _this;
    }
    LogScale.prototype.getTicks = function(opt) {
        var base = this.base;
        var powStub = this.powStub;
        var scaleBreakHelper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScaleBreakHelper"])();
        var intervalStub = this.intervalStub;
        var intervalExtent = intervalStub.getExtent();
        var powExtent = powStub.getExtent();
        var powOpt = {
            lookup: {
                from: intervalExtent,
                to: powExtent
            }
        };
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(intervalStub.getTicks(opt || {}), function(tick) {
            var val = tick.value;
            var powVal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logScalePowTick"])(val, base, powOpt);
            var vBreak;
            if (scaleBreakHelper) {
                var brkPowResult = scaleBreakHelper.getTicksBreakOutwardTransform(this, tick, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBreaksUnsafe"])(powStub), this._lookup);
                if (brkPowResult) {
                    vBreak = brkPowResult.vBreak;
                    powVal = brkPowResult.tickVal;
                }
            }
            return {
                value: powVal,
                "break": vBreak
            };
        }, this);
    };
    LogScale.prototype.getMinorTicks = function(splitNumber) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$minorTicks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMinorTicks"])(this, splitNumber, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBreaksUnsafe"])(this.powStub), // NOTE: minor ticks are in the log scale value to visually hint users "logarithm".
        this.intervalStub.getConfig().interval);
    };
    LogScale.prototype.getLabel = function(data, opt) {
        return this.intervalStub.getLabel(data, opt);
    };
    LogScale.type = 'log';
    LogScale.mapperMethods = {
        needTransform: function() {
            return true;
        },
        normalize: function(val) {
            return this.intervalStub.normalize((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logScaleLogTick"])(val, this.base));
        },
        scale: function(val) {
            // PENDING: Input `intervalStub.getExtent()` and `powStub.getExtent()` may
            // break monotonicity. Do not do it until real problems found.
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logScalePowTick"])(this.intervalStub.scale(val), this.base, null);
        },
        transformIn: function(val, opt) {
            val = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logScaleLogTick"])(val, this.base);
            return opt && opt.depth === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SCALE_MAPPER_DEPTH_OUT_OF_BREAK"] ? val : this.intervalStub.transformIn(val, opt);
        },
        transformOut: function(val, opt) {
            var depth = opt ? opt.depth : null;
            tmpTransformOutOpt1.depth = depth;
            tmpTransformOutOpt2.lookup = this._lookup;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logScalePowTick"])(depth === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SCALE_MAPPER_DEPTH_OUT_OF_BREAK"] ? val : this.intervalStub.transformOut(val, tmpTransformOutOpt1), this.base, tmpTransformOutOpt2);
        },
        contain: function(val) {
            return this.powStub.contain(val);
        },
        /**
     * NOTICE: The caller should ensure `start` and `end` are both non-negative.
     */ setExtent: function(start, end) {
            this.setExtent2(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SCALE_EXTENT_KIND_EFFECTIVE"], start, end);
        },
        setExtent2: function(kind, start, end) {
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidBoundsForExtent"])(start, end) || start <= 0 || end <= 0) {
                return;
            }
            var lookupTo = tmpNotUsedArr;
            var lookupFrom = tmpNotUsedArr;
            if (kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SCALE_EXTENT_KIND_EFFECTIVE"]) {
                var lookup = this._lookup;
                lookupTo = lookup.to;
                lookupFrom = lookup.from;
            }
            this.powStub.setExtent2(kind, lookupTo[LOOKUP_IDX_EXTENT_START] = start, lookupTo[LOOKUP_IDX_EXTENT_END] = end);
            var base = this.base;
            this.intervalStub.setExtent2(kind, lookupFrom[LOOKUP_IDX_EXTENT_START] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logScaleLogTick"])(start, base), lookupFrom[LOOKUP_IDX_EXTENT_END] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logScaleLogTick"])(end, base));
        },
        getFilter: function() {
            return {
                g: 0
            };
        },
        sanitize: function(value, dataExtent) {
            // Conservative - if dataExtent is invalid, do not sanitize.
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidBoundsForExtent"])(dataExtent[0], dataExtent[1]) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNullableNumberFinite"])(value) && value <= 0) {
                // `DataStore` has ensured that `dataExtent` is valid for LogScale.
                value = dataExtent[0];
            }
            return value;
        },
        getDefaultStartValue: function() {
            return 1;
        },
        getExtent: function() {
            return this.powStub.getExtent();
        },
        getExtentUnsafe: function(kind, depth) {
            return depth === null ? this.powStub.getExtentUnsafe(kind, null) : this.intervalStub.getExtentUnsafe(kind, depth);
        }
    };
    return LogScale;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Scale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Scale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].registerClass(LogScale);
var tmpTransformOutOpt1 = {};
var tmpTransformOutOpt2 = {};
var tmpNotUsedArr = [];
const __TURBOPACK__default__export__ = LogScale;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/Ordinal.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/ /**
 * AUTO-GENERATED FILE. DO NOT MODIFY.
 */ /*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.3.0/node_modules/tslib/tslib.es6.js [app-client] (ecmascript)");
/**
 * Linear continuous scale
 * http://en.wikipedia.org/wiki/Level_of_measurement
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Scale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/Scale.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$OrdinalMeta$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/OrdinalMeta.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/scaleMapper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/helper.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
var OrdinalScale = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(OrdinalScale, _super);
    function OrdinalScale(setting) {
        var _this = _super.call(this) || this;
        _this.type = 'ordinal';
        _this.parse = OrdinalScale.parse;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decorateScaleMapper"])(_this, OrdinalScale.decoratedMethods);
        var ordinalMeta = setting.ordinalMeta;
        // Caution: Should not use instanceof, consider ec-extensions using
        // import approach to get OrdinalMeta class.
        if (!ordinalMeta) {
            ordinalMeta = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$OrdinalMeta$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]({});
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(ordinalMeta)) {
            ordinalMeta = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$OrdinalMeta$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]({
                categories: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(ordinalMeta, function(item) {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObject"])(item) ? item.value : item;
                })
            });
        }
        _this._ordinalMeta = ordinalMeta;
        // Create an interval LinearScaleMapper, and decorate it.
        var res = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initBreakOrLinearMapper"])(null, null, // Do not support break in OrdinalScale yet.
        setting.extent || [
            0,
            ordinalMeta.categories.length - 1
        ]);
        _this._mapper = res.mapper;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enableScaleMapperFreeze"])(_this, res.mapper);
        return _this;
    }
    OrdinalScale.parse = function(val) {
        // Caution: Math.round(null) will return `0` rather than `NaN`
        if (val == null) {
            val = NaN;
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"])(val)) {
            val = this._ordinalMeta.getOrdinal(val);
            if (val == null) {
                val = NaN;
            }
        } else {
            // The val from user input might be float.
            val = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathRound"])(val);
        }
        return val;
    };
    /**
   * PENDING: currently this method is not used.
   * `makeCategoryTicks` is effectively used.
   */ OrdinalScale.prototype.getTicks = function() {
        var ticks = [];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ordinalScaleCreateTicks"])(this, 0, function(tick) {
            ticks.push(tick);
        });
        return ticks;
    };
    OrdinalScale.prototype.getMinorTicks = function(splitNumber) {
        // Not support.
        return;
    };
    /**
   * @see `Ordinal['_ordinalNumbersByTick']`
   */ OrdinalScale.prototype.setSortInfo = function(info) {
        if (info == null) {
            this._ordinalNumbersByTick = this._ticksByOrdinalNumber = null;
            return;
        }
        var infoOrdinalNumbers = info.ordinalNumbers;
        var ordinalsByTick = this._ordinalNumbersByTick = [];
        var ticksByOrdinal = this._ticksByOrdinalNumber = [];
        // Unnecessary support negative tick in `realtimeSort`.
        var tickNum = 0;
        var allCategoryLen = this._ordinalMeta.categories.length;
        for(var len = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathMin"])(allCategoryLen, infoOrdinalNumbers.length); tickNum < len; ++tickNum){
            var ordinalNumber = ordinalsByTick[tickNum] = infoOrdinalNumbers[tickNum];
            ticksByOrdinal[ordinalNumber] = tickNum;
        }
        // Handle that `series.data` only covers part of the `axis.category.data`.
        var unusedOrdinal = 0;
        for(; tickNum < allCategoryLen; ++tickNum){
            while(ticksByOrdinal[unusedOrdinal] != null){
                unusedOrdinal++;
            }
            ;
            ordinalsByTick[tickNum] = unusedOrdinal;
            ticksByOrdinal[unusedOrdinal] = tickNum;
        }
    };
    OrdinalScale.prototype._getTickNumber = function(ordinal) {
        var ticksByOrdinalNumber = this._ticksByOrdinalNumber;
        // also support ordinal out of range of `ordinalMeta.categories.length`,
        // where ordinal numbers are used as tick value directly.
        return ticksByOrdinalNumber && ordinal >= 0 && ordinal < ticksByOrdinalNumber.length ? ticksByOrdinalNumber[ordinal] : ordinal;
    };
    /**
   * @usage
   * ```js
   * const ordinalNumber = ordinalScale.getRawOrdinalNumber(tick.value);
   * // case0
   * const rawOrdinalValue = axisModel.getCategories()[ordinalNumber];
   * // case1
   * const rawOrdinalValue = this._ordinalMeta.categories[ordinalNumber];
   * // case2
   * const coord = axis.dataToCoord(ordinalNumber);
   * ```
   *
   * value may be out of range, e.g., when axis max is larger than `ordinalMeta.categories.length`,
   * where ordinal numbers are used as tick value directly.
   */ OrdinalScale.prototype.getRawOrdinalNumber = function(tickValue) {
        var ordinalNumbersByTick = this._ordinalNumbersByTick;
        return ordinalNumbersByTick && tickValue >= 0 && tickValue < ordinalNumbersByTick.length ? ordinalNumbersByTick[tickValue] : tickValue;
    };
    /**
   * Get item on tick
   */ OrdinalScale.prototype.getLabel = function(tick) {
        if (!this.isBlank()) {
            var ordinalNumber = this.getRawOrdinalNumber(tick.value);
            var category = this._ordinalMeta.categories[ordinalNumber];
            // Note that if no data, ordinalMeta.categories is an empty array.
            // Return empty if it's not exist.
            return category == null ? '' : category + '';
        }
    };
    /**
   * NOTICE: This is different from `.getOrdinalMeta().length` when extent
   * is specified by `xxxAxis.min/max` or by `dataZoom`.
   */ OrdinalScale.prototype.count = function() {
        var extent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScaleExtentForTickUnsafe"])(this._mapper);
        return extent[1] - extent[0] + 1;
    };
    OrdinalScale.prototype.getOrdinalMeta = function() {
        return this._ordinalMeta;
    };
    OrdinalScale.type = 'ordinal';
    OrdinalScale.decoratedMethods = {
        needTransform: function() {
            return this._mapper.needTransform();
        },
        contain: function(val) {
            return this._mapper.contain(this._getTickNumber(val)) && val >= 0 && val < this._ordinalMeta.categories.length;
        },
        normalize: function(val) {
            return this._mapper.normalize(this._getTickNumber(val));
        },
        scale: function(val) {
            return this.getRawOrdinalNumber((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathRound"])(this._mapper.scale(val)));
        },
        transformIn: function(val, opt) {
            return this._mapper.transformIn(this._getTickNumber(val), opt);
        },
        transformOut: function(val, opt) {
            return this.getRawOrdinalNumber(this._mapper.transformOut(val, opt));
        },
        getExtent: function() {
            return this._mapper.getExtent();
        },
        getExtentUnsafe: function(kind, depth) {
            return this._mapper.getExtentUnsafe(kind, depth);
        },
        /**
     * NOTICE: OrdinalScale extent should always originates from
     * `[0, ordinalMeta.categories.length - 1]`, regardless of min/max of `series.data`.
     * But settings like `xxxAxis.min/max` can still modify the extent.
     * It is handled by constructor of `ScaleRawExtentInfo`.
     */ setExtent: function(start, end) {
            return this._mapper.setExtent(start, end);
        },
        setExtent2: function(kind, start, end) {
            return this._mapper.setExtent2(kind, start, end);
        }
    };
    return OrdinalScale;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Scale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Scale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].registerClass(OrdinalScale);
const __TURBOPACK__default__export__ = OrdinalScale;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/Scale.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/ /**
 * AUTO-GENERATED FILE. DO NOT MODIFY.
 */ /*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/clazz.js [app-client] (ecmascript)");
;
var Scale = /** @class */ function() {
    function Scale() {}
    /**
   * When axis extent depends on data and no data exists,
   * axis ticks should not be drawn, which is named 'blank'.
   *
   * @final NEVER override!
   */ Scale.prototype.isBlank = function() {
        return this._isBlank;
    };
    /**
   * When axis extent depends on data and no data exists,
   * axis ticks should not be drawn, which is named 'blank'.
   *
   * @final NEVER override!
   */ Scale.prototype.setBlank = function(isBlank) {
        this._isBlank = isBlank;
    };
    return Scale;
}();
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enableClassManagement"](Scale);
const __TURBOPACK__default__export__ = Scale;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/Time.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calcNiceForTimeScale",
    ()=>calcNiceForTimeScale,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/ /**
 * AUTO-GENERATED FILE. DO NOT MODIFY.
 */ /*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.3.0/node_modules/tslib/tslib.es6.js [app-client] (ecmascript)");
/*
* A third-party license is embedded for some of the code in this file:
* The "scaleLevels" was originally copied from "d3.js" with some
* modifications made for this project.
* (See more details in the comment on the definition of "scaleLevels" below.)
* The use of the source code of this file is also subject to the terms
* and consitions of the license of "d3.js" (BSD-3Clause, see
* </licenses/LICENSE-d3>).
*/ // [About UTC and local time zone]:
// In most cases, `number.parseDate` will treat input data string as local time
// (except time zone is specified in time string). And `format.formateTime` returns
// local time by default. option.useUTC is false by default. This design has
// considered these common cases:
// (1) Time that is persistent in server is in UTC, but it is needed to be displayed
// in local time by default.
// (2) By default, the input data string (e.g., '2011-01-02') should be displayed
// as its original time, without any time difference.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/time.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/helper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Scale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/Scale.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/break.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$minorTicks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/minorTicks.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/scaleMapper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
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
// FIXME 公用？
var bisect = function(a, x, lo, hi) {
    while(lo < hi){
        var mid = lo + hi >>> 1;
        if (a[mid][1] < x) {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    return lo;
};
var TimeScale = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(TimeScale, _super);
    function TimeScale(setting) {
        var _this = _super.call(this) || this;
        _this.type = 'time';
        _this.parse = TimeScale.parse;
        _this._locale = setting.locale;
        _this._useUTC = setting.useUTC;
        _this._interval = 0;
        var breakParsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["simplyParseBreakOption"])(_this, setting);
        var res = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initBreakOrLinearMapper"])(_this, breakParsed, null);
        // @ts-ignore
        _this.brk = res.brk;
        return _this;
    }
    /**
   * Get label is mainly for other components like dataZoom, tooltip.
   */ TimeScale.prototype.getLabel = function(tick) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["format"])(tick.value, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fullLeveledFormatter"][(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDefaultFormatPrecisionOfInterval"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrimaryTimeUnit"])(this._minLevelUnit))] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fullLeveledFormatter"].second, this._useUTC, this._locale);
    };
    TimeScale.prototype.getFormattedLabel = function(tick, idx, labelFormatter) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["leveledFormat"])(tick, idx, labelFormatter, this._locale, this._useUTC);
    };
    TimeScale.prototype.getTicks = function(opt) {
        opt = opt || {};
        var interval = this._interval;
        var extent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScaleExtentForTickUnsafe"])(this);
        var scaleBreakHelper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScaleBreakHelper"])();
        var brk = this.brk;
        var brkAvailable = scaleBreakHelper && brk;
        var ticks = [];
        // If interval is 0, return [];
        if (!interval) {
            return ticks;
        }
        var useUTC = this._useUTC;
        if (brkAvailable && opt.breakTicks === 'only_break') {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScaleBreakHelper"])().addBreaksToTicks(ticks, brk.breaks, extent);
            return ticks;
        }
        ticks = createIntervalTicks(this._minLevelUnit, this._approxInterval, useUTC, extent, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScaleLinearSpanEffective"])(this), brk);
        var upperUnitIndex = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["primaryTimeUnits"].length - 1;
        var maxLevel = 0;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(ticks, function(tick) {
            if (tick.time) {
                upperUnitIndex = Math.min(upperUnitIndex, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indexOf"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["primaryTimeUnits"], tick.time.upperTimeUnit));
                maxLevel = Math.max(maxLevel, tick.time.level);
            }
        });
        if (brkAvailable) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScaleBreakHelper"])().pruneTicksByBreak(opt.pruneByBreak, ticks, brk.breaks, function(item) {
                return item.value;
            }, this._approxInterval, extent);
        }
        if (brkAvailable && opt.breakTicks !== 'none') {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScaleBreakHelper"])().addBreaksToTicks(ticks, brk.breaks, extent, function(trimmedBrk) {
                // @see `parseTimeAxisLabelFormatterDictionary`.
                var lowerBrkUnitIndex = Math.max((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indexOf"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["primaryTimeUnits"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUnitFromValue"])(trimmedBrk.vmin, useUTC)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indexOf"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["primaryTimeUnits"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUnitFromValue"])(trimmedBrk.vmax, useUTC)));
                var upperBrkUnitIndex = 0;
                for(var unitIdx = 0; unitIdx < __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["primaryTimeUnits"].length; unitIdx++){
                    if (!isPrimaryUnitValueAndGreaterSame(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["primaryTimeUnits"][unitIdx], trimmedBrk.vmin, trimmedBrk.vmax, useUTC)) {
                        upperBrkUnitIndex = unitIdx;
                        break;
                    }
                }
                var upperIdx = Math.min(upperBrkUnitIndex, upperUnitIndex);
                var lowerIdx = Math.max(upperIdx, lowerBrkUnitIndex);
                return {
                    level: maxLevel,
                    lowerTimeUnit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["primaryTimeUnits"][lowerIdx],
                    upperTimeUnit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["primaryTimeUnits"][upperIdx]
                };
            });
        }
        return ticks;
    };
    TimeScale.prototype.getMinorTicks = function(splitNumber) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$minorTicks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMinorTicks"])(this, splitNumber, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBreaksUnsafe"])(this), this._interval);
    };
    TimeScale.prototype.setTimeInterval = function(opt) {
        this._interval = opt.interval;
        this._approxInterval = opt.approxInterval;
        this._minLevelUnit = opt.minLevelUnit;
    };
    TimeScale.parse = function(val) {
        // `val` might be a float (e.g., calculated from percent), so call `round`.
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(val) ? Math.round(val) : +__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseDate"](val);
    };
    TimeScale.type = 'time';
    return TimeScale;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Scale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
/**
 * This implementation was originally copied from "d3.js"
 * <https://github.com/d3/d3/blob/b516d77fb8566b576088e73410437494717ada26/src/time/scale.js>
 * with some modifications made for this program.
 * See the license statement at the head of this file.
 */ var scaleIntervals = [
    // Format                           interval
    [
        'second',
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ONE_SECOND"]
    ],
    [
        'minute',
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ONE_MINUTE"]
    ],
    [
        'hour',
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ONE_HOUR"]
    ],
    [
        'quarter-day',
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ONE_HOUR"] * 6
    ],
    [
        'half-day',
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ONE_HOUR"] * 12
    ],
    [
        'day',
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ONE_DAY"] * 1.2
    ],
    [
        'half-week',
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ONE_DAY"] * 3.5
    ],
    [
        'week',
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ONE_DAY"] * 7
    ],
    [
        'month',
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ONE_DAY"] * 31
    ],
    [
        'quarter',
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ONE_DAY"] * 95
    ],
    [
        'half-year',
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ONE_YEAR"] / 2
    ],
    [
        'year',
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ONE_YEAR"]
    ] // 1Y
];
function isPrimaryUnitValueAndGreaterSame(unit, valueA, valueB, isUTC) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["roundTime"])(new Date(valueA), unit, isUTC).getTime() === (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["roundTime"])(new Date(valueB), unit, isUTC).getTime();
}
// function isUnitValueSame(
//     unit: PrimaryTimeUnit,
//     valueA: number,
//     valueB: number,
//     isUTC: boolean
// ): boolean {
//     const dateA = numberUtil.parseDate(valueA) as any;
//     const dateB = numberUtil.parseDate(valueB) as any;
//     const isSame = (unit: PrimaryTimeUnit) => {
//         return getUnitValue(dateA, unit, isUTC)
//             === getUnitValue(dateB, unit, isUTC);
//     };
//     const isSameYear = () => isSame('year');
//     // const isSameHalfYear = () => isSameYear() && isSame('half-year');
//     // const isSameQuater = () => isSameYear() && isSame('quarter');
//     const isSameMonth = () => isSameYear() && isSame('month');
//     const isSameDay = () => isSameMonth() && isSame('day');
//     // const isSameHalfDay = () => isSameDay() && isSame('half-day');
//     const isSameHour = () => isSameDay() && isSame('hour');
//     const isSameMinute = () => isSameHour() && isSame('minute');
//     const isSameSecond = () => isSameMinute() && isSame('second');
//     const isSameMilliSecond = () => isSameSecond() && isSame('millisecond');
//     switch (unit) {
//         case 'year':
//             return isSameYear();
//         case 'month':
//             return isSameMonth();
//         case 'day':
//             return isSameDay();
//         case 'hour':
//             return isSameHour();
//         case 'minute':
//             return isSameMinute();
//         case 'second':
//             return isSameSecond();
//         case 'millisecond':
//             return isSameMilliSecond();
//     }
// }
// const primaryUnitGetters = {
//     year: fullYearGetterName(),
//     month: monthGetterName(),
//     day: dateGetterName(),
//     hour: hoursGetterName(),
//     minute: minutesGetterName(),
//     second: secondsGetterName(),
//     millisecond: millisecondsGetterName()
// };
// const primaryUnitUTCGetters = {
//     year: fullYearGetterName(true),
//     month: monthGetterName(true),
//     day: dateGetterName(true),
//     hour: hoursGetterName(true),
//     minute: minutesGetterName(true),
//     second: secondsGetterName(true),
//     millisecond: millisecondsGetterName(true)
// };
// function moveTick(date: Date, unitName: TimeUnit, step: number, isUTC: boolean) {
//     step = step || 1;
//     switch (getPrimaryTimeUnit(unitName)) {
//         case 'year':
//             date[fullYearSetterName(isUTC)](date[fullYearGetterName(isUTC)]() + step);
//             break;
//         case 'month':
//             date[monthSetterName(isUTC)](date[monthGetterName(isUTC)]() + step);
//             break;
//         case 'day':
//             date[dateSetterName(isUTC)](date[dateGetterName(isUTC)]() + step);
//             break;
//         case 'hour':
//             date[hoursSetterName(isUTC)](date[hoursGetterName(isUTC)]() + step);
//             break;
//         case 'minute':
//             date[minutesSetterName(isUTC)](date[minutesGetterName(isUTC)]() + step);
//             break;
//         case 'second':
//             date[secondsSetterName(isUTC)](date[secondsGetterName(isUTC)]() + step);
//             break;
//         case 'millisecond':
//             date[millisecondsSetterName(isUTC)](date[millisecondsGetterName(isUTC)]() + step);
//             break;
//     }
//     return date.getTime();
// }
// const DATE_INTERVALS = [[8, 7.5], [4, 3.5], [2, 1.5]];
// const MONTH_INTERVALS = [[6, 5.5], [3, 2.5], [2, 1.5]];
// const MINUTES_SECONDS_INTERVALS = [[30, 30], [20, 20], [15, 15], [10, 10], [5, 5], [2, 2]];
function getDateInterval(approxInterval, daysInMonth) {
    approxInterval /= __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ONE_DAY"];
    return approxInterval > 16 ? 16 : approxInterval > 7.5 ? 7 // TODO week 7 or day 8?
     : approxInterval > 3.5 ? 4 : approxInterval > 1.5 ? 2 : 1;
}
function getMonthInterval(approxInterval) {
    var APPROX_ONE_MONTH = 30 * __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ONE_DAY"];
    approxInterval /= APPROX_ONE_MONTH;
    return approxInterval > 6 ? 6 : approxInterval > 3 ? 3 : approxInterval > 2 ? 2 : 1;
}
function getHourInterval(approxInterval) {
    approxInterval /= __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ONE_HOUR"];
    return approxInterval > 12 ? 12 : approxInterval > 6 ? 6 : approxInterval > 3.5 ? 4 : approxInterval > 2 ? 2 : 1;
}
function getMinutesAndSecondsInterval(approxInterval, isMinutes) {
    approxInterval /= isMinutes ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ONE_MINUTE"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ONE_SECOND"];
    return approxInterval > 30 ? 30 : approxInterval > 20 ? 20 : approxInterval > 15 ? 15 : approxInterval > 10 ? 10 : approxInterval > 5 ? 5 : approxInterval > 2 ? 2 : 1;
}
function getMillisecondsInterval(approxInterval) {
    // If less than 1, the getTicks loop will inevitably deed loop and read safeLimit.
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathMax"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nice"](approxInterval, true), 1);
}
// e.g., if the input unit is 'day', start calculate ticks from the first day of
// that month to make ticks "nice".
function getFirstTimestampOfUnit(timestamp, unitName, isUTC) {
    var upperUnitIdx = Math.max(0, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indexOf"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["primaryTimeUnits"], unitName) - 1);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["roundTime"])(new Date(timestamp), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["primaryTimeUnits"][upperUnitIdx], isUTC).getTime();
}
function createEstimateNiceMultiple(setMethodName, dateMethodInterval) {
    var tmpDate = new Date(0);
    tmpDate[setMethodName](1);
    var tmpTime = tmpDate.getTime();
    tmpDate[setMethodName](1 + dateMethodInterval);
    var approxTimeInterval = tmpDate.getTime() - tmpTime;
    return function(tickVal, targetValue) {
        // Only in month that accurate result can not get by division of
        // timestamp interval, but no need accurate here.
        return Math.max(0, Math.round((targetValue - tickVal) / approxTimeInterval));
    };
}
function createIntervalTicks(bottomUnitName, approxInterval, isUTC, extent, innermostSpan, brk) {
    // A fail-safe is required since `interval` can be user specified, or for the case
    // that using dataZoom toolbox and zoom repeatedly.
    var safeLimit = 3000;
    var unitNames = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeUnits"];
    var iter = 0;
    function addTicksInSpan(interval, minTimestamp, maxTimestamp, getMethodName, setMethodName, isDate, out) {
        var estimateNiceMultiple = createEstimateNiceMultiple(setMethodName, interval);
        var dateTime = minTimestamp;
        var date = new Date(dateTime);
        // if (isDate) {
        //     d -= 1; // Starts with 0;   PENDING
        // }
        while(dateTime < maxTimestamp && dateTime <= extent[1]){
            out.push({
                value: dateTime
            });
            if (iter++ > safeLimit) {
                if ("TURBOPACK compile-time truthy", 1) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warn"])('Exceed safe limit in TimeScale["getTicks"].');
                }
                break;
            }
            date[setMethodName](date[getMethodName]() + interval);
            dateTime = date.getTime();
            if (brk) {
                var moreMultiple = brk.calcNiceTickMultiple(dateTime, estimateNiceMultiple);
                if (moreMultiple > 0) {
                    date[setMethodName](date[getMethodName]() + moreMultiple * interval);
                    dateTime = date.getTime();
                }
            }
        }
        // This extra tick is for calculating ticks of next level. Will not been added to the final result
        out.push({
            value: dateTime,
            // extent[1] should be added; deduplication will be performed later.
            notAdd: dateTime > extent[1]
        });
    }
    function addLevelTicks(unitName, lastLevelTicks, levelTicks) {
        var newAddedTicks = [];
        var isFirstLevel = !lastLevelTicks.length;
        if (isPrimaryUnitValueAndGreaterSame((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrimaryTimeUnit"])(unitName), extent[0], extent[1], isUTC)) {
            return;
        }
        if (isFirstLevel) {
            lastLevelTicks = [
                {
                    value: getFirstTimestampOfUnit(extent[0], unitName, isUTC)
                },
                {
                    value: extent[1]
                }
            ];
        }
        for(var i = 0; i < lastLevelTicks.length - 1; i++){
            var startTick = lastLevelTicks[i].value;
            var endTick = lastLevelTicks[i + 1].value;
            if (startTick === endTick) {
                continue;
            }
            var interval = void 0;
            var getterName = void 0;
            var setterName = void 0;
            var isDate = false;
            switch(unitName){
                case 'year':
                    interval = Math.max(1, Math.round(approxInterval / __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ONE_DAY"] / 365));
                    getterName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fullYearGetterName"])(isUTC);
                    setterName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fullYearSetterName"])(isUTC);
                    break;
                case 'half-year':
                case 'quarter':
                case 'month':
                    interval = getMonthInterval(approxInterval);
                    getterName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["monthGetterName"])(isUTC);
                    setterName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["monthSetterName"])(isUTC);
                    break;
                case 'week':
                case 'half-week':
                case 'day':
                    interval = getDateInterval(approxInterval, 31); // Use 32 days and let interval been 16
                    getterName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dateGetterName"])(isUTC);
                    setterName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dateSetterName"])(isUTC);
                    isDate = true;
                    break;
                case 'half-day':
                case 'quarter-day':
                case 'hour':
                    interval = getHourInterval(approxInterval);
                    getterName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hoursGetterName"])(isUTC);
                    setterName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hoursSetterName"])(isUTC);
                    break;
                case 'minute':
                    interval = getMinutesAndSecondsInterval(approxInterval, true);
                    getterName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minutesGetterName"])(isUTC);
                    setterName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["minutesSetterName"])(isUTC);
                    break;
                case 'second':
                    interval = getMinutesAndSecondsInterval(approxInterval, false);
                    getterName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["secondsGetterName"])(isUTC);
                    setterName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["secondsSetterName"])(isUTC);
                    break;
                case 'millisecond':
                    interval = getMillisecondsInterval(approxInterval);
                    getterName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["millisecondsGetterName"])(isUTC);
                    setterName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["millisecondsSetterName"])(isUTC);
                    break;
            }
            // Notice: This expansion by `getFirstTimestampOfUnit` may cause too many ticks and
            // iteration. e.g., when three levels of ticks is displayed, which can be caused by
            // data zoom and axis breaks. Thus trim them here.
            if (endTick >= extent[0] && startTick <= extent[1]) {
                addTicksInSpan(interval, startTick, endTick, getterName, setterName, isDate, newAddedTicks);
            }
            if (unitName === 'year' && levelTicks.length > 1 && i === 0) {
                // Add nearest years to the left extent.
                levelTicks.unshift({
                    value: levelTicks[0].value - interval
                });
            }
        }
        for(var i = 0; i < newAddedTicks.length; i++){
            levelTicks.push(newAddedTicks[i]);
        }
    }
    var levelsTicks = [];
    var currentLevelTicks = [];
    var tickCount = 0;
    var lastLevelTickCount = 0;
    for(var i = 0; i < unitNames.length; ++i){
        var primaryTimeUnit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrimaryTimeUnit"])(unitNames[i]);
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPrimaryTimeUnit"])(unitNames[i])) {
            continue;
        }
        addLevelTicks(unitNames[i], levelsTicks[levelsTicks.length - 1] || [], currentLevelTicks);
        var nextPrimaryTimeUnit = unitNames[i + 1] ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrimaryTimeUnit"])(unitNames[i + 1]) : null;
        if (primaryTimeUnit !== nextPrimaryTimeUnit) {
            if (currentLevelTicks.length) {
                lastLevelTickCount = tickCount;
                // Remove the duplicate so the tick count can be precisely.
                currentLevelTicks.sort(function(a, b) {
                    return a.value - b.value;
                });
                var levelTicksRemoveDuplicated = [];
                for(var i_1 = 0; i_1 < currentLevelTicks.length; ++i_1){
                    var tickValue = currentLevelTicks[i_1].value;
                    if (i_1 === 0 || currentLevelTicks[i_1 - 1].value !== tickValue) {
                        levelTicksRemoveDuplicated.push(currentLevelTicks[i_1]);
                        if (tickValue >= extent[0] && tickValue <= extent[1]) {
                            tickCount++;
                        }
                    }
                }
                var targetTickNum = innermostSpan / approxInterval;
                // Added too much in this level and not too less in last level
                if (tickCount > targetTickNum * 1.5 && lastLevelTickCount > targetTickNum / 1.5) {
                    break;
                }
                // Only treat primary time unit as one level.
                levelsTicks.push(levelTicksRemoveDuplicated);
                if (tickCount > targetTickNum || bottomUnitName === unitNames[i]) {
                    break;
                }
            }
            // Reset if next unitName is primary
            currentLevelTicks = [];
        }
    }
    var levelsTicksInExtent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(levelsTicks, function(levelTicks) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])(levelTicks, function(tick) {
            return tick.value >= extent[0] && tick.value <= extent[1] && !tick.notAdd;
        });
    }), function(levelTicks) {
        return levelTicks.length > 0;
    });
    var maxLevel = levelsTicksInExtent.length - 1;
    var ticks = [];
    for(var i = 0; i < levelsTicksInExtent.length; ++i){
        var levelTicks = levelsTicksInExtent[i];
        for(var k = 0; k < levelTicks.length; ++k){
            var unit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUnitFromValue"])(levelTicks[k].value, isUTC);
            ticks.push({
                value: levelTicks[k].value,
                time: {
                    level: maxLevel - i,
                    upperTimeUnit: unit,
                    lowerTimeUnit: unit
                }
            });
        }
    }
    // Remove duplicates, which may cause jitter of `splitArea` and other bad cases.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeDuplicates"])(ticks, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeDuplicatesGetKeyFromValueProp"], null);
    ticks.sort(function(a, b) {
        return a.value - b.value;
    });
    var currMinTick = ticks[0];
    var currMaxTick = ticks[ticks.length - 1];
    var extent0Unit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUnitFromValue"])(extent[0], isUTC);
    var extent1Unit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUnitFromValue"])(extent[1], isUTC);
    if (!currMinTick || currMinTick.value > extent[0]) {
        ticks.unshift({
            value: extent[0],
            time: {
                level: 0,
                upperTimeUnit: extent0Unit,
                lowerTimeUnit: extent0Unit
            },
            notNice: true
        });
    }
    if (!currMaxTick || currMaxTick.value < extent[1]) {
        ticks.push({
            value: extent[1],
            time: {
                level: 0,
                upperTimeUnit: extent1Unit,
                lowerTimeUnit: extent1Unit
            },
            notNice: true
        });
    }
    return ticks;
}
var calcNiceForTimeScale = function(scale, opt) {
    var extent = scale.getExtent();
    // If extent start and end are same, expand them
    if (extent[0] === extent[1]) {
        // Expand extent
        extent[0] -= __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ONE_DAY"];
        extent[1] += __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ONE_DAY"];
    }
    // If there are no data and extent are [Infinity, -Infinity]
    if (extent[1] === -Infinity && extent[0] === Infinity) {
        var d = new Date();
        extent[1] = +new Date(d.getFullYear(), d.getMonth(), d.getDate());
        extent[0] = extent[1] - __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ONE_DAY"];
    }
    scale.setExtent(extent[0], extent[1]);
    var splitNumber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureValidSplitNumber"])(opt.splitNumber, 10);
    var approxInterval = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScaleLinearSpanEffective"])(scale) / splitNumber;
    var minInterval = opt.minInterval;
    var maxInterval = opt.maxInterval;
    if (minInterval != null && approxInterval < minInterval) {
        approxInterval = minInterval;
    }
    if (maxInterval != null && approxInterval > maxInterval) {
        approxInterval = maxInterval;
    }
    var scaleIntervalsLen = scaleIntervals.length;
    var idx = Math.min(bisect(scaleIntervals, approxInterval, 0, scaleIntervalsLen), scaleIntervalsLen - 1);
    // Interval that can be used to calculate ticks
    var interval = scaleIntervals[idx][1];
    // Min level used when picking ticks from top down.
    // We check one more level to avoid the ticks are to sparse in some case.
    var minLevelUnit = scaleIntervals[Math.max(idx - 1, 0)][0];
    scale.setTimeInterval({
        approxInterval: approxInterval,
        interval: interval,
        minLevelUnit: minLevelUnit
    });
};
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Scale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].registerClass(TimeScale);
const __TURBOPACK__default__export__ = TimeScale;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/break.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getBreaksUnsafe",
    ()=>getBreaksUnsafe,
    "getScaleBreakHelper",
    ()=>getScaleBreakHelper,
    "hasBreaks",
    ()=>hasBreaks,
    "registerScaleBreakHelperImpl",
    ()=>registerScaleBreakHelperImpl,
    "simplyParseBreakOption",
    ()=>simplyParseBreakOption
]);
/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/ /**
 * AUTO-GENERATED FILE. DO NOT MODIFY.
 */ /*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/ ;
var _impl = null;
function registerScaleBreakHelperImpl(impl) {
    if (!_impl) {
        _impl = impl;
    }
}
function getScaleBreakHelper() {
    return _impl;
}
function simplyParseBreakOption(scale, opt) {
    var scaleBreakHelper = getScaleBreakHelper();
    var breakOption = opt.breakOption;
    var breakParsed = opt.breakParsed;
    if (!breakParsed && scaleBreakHelper) {
        breakParsed = scaleBreakHelper.parseAxisBreakOption(breakOption, scale);
    }
    return breakParsed;
}
function getBreaksUnsafe(scale) {
    var brk = scale.brk;
    return brk ? brk.breaks : [];
}
function hasBreaks(scale) {
    var brk = scale.brk;
    return brk ? brk.hasBreaks() : false;
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/helper.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ensureValidSplitNumber",
    ()=>ensureValidSplitNumber,
    "extentDiffers",
    ()=>extentDiffers,
    "getIntervalPrecision",
    ()=>getIntervalPrecision,
    "increaseInterval",
    ()=>increaseInterval,
    "intervalScaleEnsureValidExtent",
    ()=>intervalScaleEnsureValidExtent,
    "intervalScaleNiceTicks",
    ()=>intervalScaleNiceTicks,
    "isIntervalOrLogScale",
    ()=>isIntervalOrLogScale,
    "isIntervalOrTimeScale",
    ()=>isIntervalOrTimeScale,
    "isIntervalScale",
    ()=>isIntervalScale,
    "isLogScale",
    ()=>isLogScale,
    "isOrdinalScale",
    ()=>isOrdinalScale,
    "isTimeScale",
    ()=>isTimeScale,
    "logScaleLogTick",
    ()=>logScaleLogTick,
    "logScalePowTick",
    ()=>logScalePowTick,
    "ordinalScaleCreateTicks",
    ()=>ordinalScaleCreateTicks
]);
/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/ /**
 * AUTO-GENERATED FILE. DO NOT MODIFY.
 */ /*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/scaleMapper.js [app-client] (ecmascript)");
;
;
;
function isIntervalOrLogScale(scale) {
    return isIntervalScale(scale) || isLogScale(scale);
}
function isIntervalOrTimeScale(scale) {
    return isIntervalScale(scale) || isTimeScale(scale);
}
function isIntervalScale(scale) {
    return scale.type === 'interval';
}
function isTimeScale(scale) {
    return scale.type === 'time';
}
function isLogScale(scale) {
    return scale.type === 'log';
}
function isOrdinalScale(scale) {
    return scale.type === 'ordinal';
}
function intervalScaleNiceTicks(extent, spanWithBreaks, splitNumber, minInterval, maxInterval) {
    var result = {};
    var interval = result.interval = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nice"])(spanWithBreaks / splitNumber, true);
    if (minInterval != null && interval < minInterval) {
        interval = result.interval = minInterval;
    }
    if (maxInterval != null && interval > maxInterval) {
        interval = result.interval = maxInterval;
    }
    var precision = result.intervalPrecision = getIntervalPrecision(interval);
    // Niced extent inside original extent
    result.niceTickExtent = [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathCeil"])(extent[0] / interval) * interval, precision),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathFloor"])(extent[1] / interval) * interval, precision)
    ];
    return result;
}
function increaseInterval(niceInterval) {
    var exponent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["quantityExponent"])(niceInterval);
    // No rounding error in Math.pow(10, integer).
    var exp10 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathPow"])(10, exponent);
    // Fix IEEE 754 float rounding error
    var f = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathRound"])(niceInterval / exp10);
    if (!f) {
        f = 1;
    } else if (f === 2) {
        f = 3;
    } else if (f === 3) {
        f = 5;
    } else {
        // f is 1 or 5
        f *= 2;
    }
    // Fix IEEE 754 float rounding error
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(f * exp10, -exponent);
}
function getIntervalPrecision(niceInterval) {
    // Tow more digital for tick.
    // NOTE: `2` was introduced in commit `af2a2a9f6303081d7c3b52f0a38add07b4c6e0c7`;
    // it works on "nice" interval, but seems not necessarily mathematically required.
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrecision"])(niceInterval) + 2;
}
function logScaleLogTick(val, base) {
    // NOTE:
    //  - rounding error may happen above, typically expecting `log10(1000)` but actually
    //    getting `2.9999999999999996`, but generally it does not matter since they are not
    //    used to display.
    //  - Consider backward compatibility and other log bases, do not use `Math.log10`.
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathLog"])(val) / (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathLog"])(base);
}
function logScalePowTick(// `tickVal` should be in the linear space.
linearTickVal, base, opt) {
    var lookup = opt && opt.lookup;
    if (lookup) {
        for(var i = 0; i < lookup.from.length; i++){
            if (linearTickVal === lookup.from[i]) {
                return lookup.to[i];
            }
        }
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathPow"])(base, linearTickVal);
}
function intervalScaleEnsureValidExtent(rawExtent, fixMinMax, rawExtentResult) {
    var extent = rawExtent.slice();
    // PENDING:
    //  This implementation is not rigorous, but has long been in use.
    // If extent start and end are same, expand them
    if (extent[0] === extent[1]) {
        // If `containShape`, the extent must be evenly distributed to both sides;
        // otherwise, shape (e.g., bars) may be overflow and clipped.
        var containShapeRequired = rawExtentResult && rawExtentResult.ctnShp;
        if (extent[0] !== 0) {
            // Expand extent
            // Note that extents can be both negative. See #13154
            var expandSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathAbs"])(extent[0]);
            // In the fowllowing case
            //      Axis has been fixed max 100
            //      Plus data are all 100 and axis extent are [100, 100].
            // Extend to the both side will cause expanded max is larger than fixed max.
            // So only expand to the smaller side.
            if (!fixMinMax[1]) {
                extent[1] += expandSize / 2;
                extent[0] -= expandSize / 2;
            } else {
                extent[0] -= expandSize / 2;
            }
        } else {
            if (containShapeRequired) {
                extent[0] = -1;
                extent[1] = 1;
            } else {
                extent[1] = 1;
            }
        }
    }
    // For example, if there are no series data, extent may be `[Infinity, -Infinity]` here.
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidNumberForExtent"])(extent[0]) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidNumberForExtent"])(extent[1])) {
        extent[0] = 0;
        extent[1] = 1;
    }
    if (extent[1] < extent[0]) {
        extent.reverse();
    }
    return extent;
}
function extentDiffers(extent1, extent2) {
    return [
        extent1[0] !== extent2[0],
        extent1[1] !== extent2[1]
    ];
}
function ensureValidSplitNumber(rawSplitNumber, defaultSplitNumber) {
    rawSplitNumber = rawSplitNumber || defaultSplitNumber;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathRound"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathMax"])(rawSplitNumber, 1));
}
function ordinalScaleCreateTicks(ordinalScale, // `categoryInterval` is the number part of `CategoryTickLabelSplitIntervalOption`.
categoryInterval, addItem) {
    var extent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScaleExtentForTickUnsafe"])(ordinalScale);
    var startTick = extent[0];
    var tickCount = ordinalScale.count();
    var step = Math.max((categoryInterval || 0) + 1, 1);
    // Calculate start tick based on zero if possible to keep label consistent
    // while zooming and moving while interval > 0. Otherwise the selection
    // of displayable ticks and symbols probably keep changing.
    if (startTick !== 0 && step > 1 && tickCount / step > 2) {
        startTick = Math.round(Math.ceil(startTick / step) * step);
    }
    // min max labels may be excluded if `startTick > 0`, but they should be always
    // included and the label display strategy is adopted uniformly later in `AxisBuilder`.
    if (startTick !== extent[0]) {
        addItemInternally(extent[0], true, true);
    }
    var tickValue = startTick;
    for(; tickValue <= extent[1]; tickValue += step){
        addItemInternally(tickValue, false, tickValue === extent[0] || tickValue === extent[1]);
    }
    if (tickValue - step !== extent[1]) {
        addItemInternally(extent[1], true, true);
    }
    function addItemInternally(tickValue, offInterval, isExtentBoundary) {
        addItem({
            value: tickValue,
            offInterval: offInterval
        }, isExtentBoundary);
    }
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/minorTicks.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getMinorTicks",
    ()=>getMinorTicks
]);
/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/ /**
 * AUTO-GENERATED FILE. DO NOT MODIFY.
 */ /*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/break.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/helper.js [app-client] (ecmascript)");
;
;
;
function getMinorTicks(scale, splitNumber, breaks, scaleInterval) {
    var ticks = scale.getTicks({
        expandToNicedExtent: true
    });
    // NOTE: In log-scale, do not support minor ticks when breaks exist.
    //  because currently log-scale minor ticks is calculated based on raw values
    //  rather than log-transformed value, due to an odd effect when breaks exist.
    var minorTicks = [];
    var extent = scale.getExtent();
    for(var i = 1; i < ticks.length; i++){
        var nextTick = ticks[i];
        var prevTick = ticks[i - 1];
        if (prevTick["break"] || nextTick["break"]) {
            continue;
        }
        var count = 0;
        var minorTicksGroup = [];
        var interval = nextTick.value - prevTick.value;
        var minorInterval = interval / splitNumber;
        var minorIntervalPrecision = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getIntervalPrecision"])(minorInterval);
        while(count < splitNumber - 1){
            var minorTick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(prevTick.value + (count + 1) * minorInterval, minorIntervalPrecision);
            // For the first and last interval. The count may be less than splitNumber.
            if (minorTick > extent[0] && minorTick < extent[1]) {
                minorTicksGroup.push(minorTick);
            }
            count++;
        }
        var scaleBreakHelper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScaleBreakHelper"])();
        scaleBreakHelper && scaleBreakHelper.pruneTicksByBreak('auto', minorTicksGroup, breaks, function(value) {
            return value;
        }, scaleInterval, extent);
        minorTicks.push(minorTicksGroup);
    }
    return minorTicks;
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/scaleMapper.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SCALE_EXTENT_KIND_EFFECTIVE",
    ()=>SCALE_EXTENT_KIND_EFFECTIVE,
    "SCALE_EXTENT_KIND_MAPPING",
    ()=>SCALE_EXTENT_KIND_MAPPING,
    "SCALE_MAPPER_DEPTH_INNERMOST",
    ()=>SCALE_MAPPER_DEPTH_INNERMOST,
    "SCALE_MAPPER_DEPTH_OUT_OF_BREAK",
    ()=>SCALE_MAPPER_DEPTH_OUT_OF_BREAK,
    "decorateScaleMapper",
    ()=>decorateScaleMapper,
    "enableScaleMapperFreeze",
    ()=>enableScaleMapperFreeze,
    "getScaleExtentForMappingUnsafe",
    ()=>getScaleExtentForMappingUnsafe,
    "getScaleExtentForTickUnsafe",
    ()=>getScaleExtentForTickUnsafe,
    "getScaleLinearSpanEffective",
    ()=>getScaleLinearSpanEffective,
    "getScaleLinearSpanForMapping",
    ()=>getScaleLinearSpanForMapping,
    "initBreakOrLinearMapper",
    ()=>initBreakOrLinearMapper,
    "initLinearScaleMapper",
    ()=>initLinearScaleMapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$starters$2f$apps$2d$shell$2d$starter$2f$web$2d$shell$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$5_$40$babel$2b$core$40$7$2e$29$2e$7_$40$types$2b$node$40$20$2e$19$2e$43_react$2d$dom$40$19$2e$2$2e$8_react$40$19$2e$2$2e$8_$5f$react$40$19$2e$2$2e$8$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/starters/apps-shell-starter/web-shell/node_modules/.pnpm/next@16.3.5_@babel+core@7.29.7_@types+node@20.19.43_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/ /**
 * AUTO-GENERATED FILE. DO NOT MODIFY.
 */ /*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/break.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-client] (ecmascript)");
;
;
;
;
var SCALE_EXTENT_KIND_EFFECTIVE = 0;
var SCALE_EXTENT_KIND_MAPPING = 1;
var SCALE_MAPPER_METHOD_NAMES_MAP = {
    needTransform: 1,
    normalize: 1,
    scale: 1,
    transformIn: 1,
    transformOut: 1,
    contain: 1,
    getExtent: 1,
    getExtentUnsafe: 1,
    setExtent: 1,
    setExtent2: 1,
    getFilter: 1,
    sanitize: 1,
    getDefaultStartValue: 1,
    freeze: 1
};
var SCALE_MAPPER_METHOD_NAMES = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keys"])(SCALE_MAPPER_METHOD_NAMES_MAP);
var SCALE_MAPPER_DEPTH_OUT_OF_BREAK = 2;
var SCALE_MAPPER_DEPTH_INNERMOST = 3;
function initBreakOrLinearMapper(// If input `null/undefined`, a mapper will be created.
mapper, breakParsed, initialExtent) {
    var brk;
    mapper = mapper || {};
    var scaleBreakHelper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScaleBreakHelper"])();
    if (scaleBreakHelper) {
        var brkMapper_1 = scaleBreakHelper.createBreakScaleMapper(breakParsed, initialExtent);
        if (brkMapper_1.hasBreaks()) {
            // Some `ScaleMapper` methods (such as `normalize`) needs to be fast for large data
            // when no breaks, so mount break methods only when breaks really exist.
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(SCALE_MAPPER_METHOD_NAMES, function(methodName) {
                if (brkMapper_1[methodName]) {
                    mapper[methodName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bind"])(brkMapper_1[methodName], brkMapper_1);
                }
            });
            brk = brkMapper_1;
        }
    }
    if (brk == null) {
        initLinearScaleMapper(mapper, initialExtent);
    }
    return {
        brk: brk,
        mapper: mapper
    };
}
function decorateScaleMapper(host, decoratedMapperMethods) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(SCALE_MAPPER_METHOD_NAMES, function(methodName) {
        host[methodName] = decoratedMapperMethods[methodName];
    });
}
function enableScaleMapperFreeze(host, subMapper) {
    host.freeze = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"];
    if ("TURBOPACK compile-time truthy", 1) {
        host.freeze = function() {
            subMapper.freeze();
        };
    }
    ;
}
function getScaleExtentForTickUnsafe(mapper) {
    return mapper.getExtentUnsafe(SCALE_EXTENT_KIND_EFFECTIVE, SCALE_MAPPER_DEPTH_OUT_OF_BREAK);
}
function getScaleExtentForMappingUnsafe(mapper, // NullUndefined means the outermost space.
depth) {
    return mapper.getExtentUnsafe(SCALE_EXTENT_KIND_MAPPING, depth) || mapper.getExtentUnsafe(SCALE_EXTENT_KIND_EFFECTIVE, depth);
}
function getScaleLinearSpanForMapping(mapper) {
    var extent = getScaleExtentForMappingUnsafe(mapper, SCALE_MAPPER_DEPTH_INNERMOST);
    return extent[1] - extent[0];
}
function getScaleLinearSpanEffective(mapper) {
    var extent = mapper.getExtentUnsafe(SCALE_EXTENT_KIND_EFFECTIVE, SCALE_MAPPER_DEPTH_INNERMOST);
    return extent[1] - extent[0];
}
function initLinearScaleMapper(// If input `null/undefined`, a mapper will be created.
mapper, initialExtent) {
    var linearMapper = mapper || {};
    var extendList = [];
    // @ts-ignore
    linearMapper._extents = extendList;
    extendList[SCALE_EXTENT_KIND_EFFECTIVE] = initialExtent ? initialExtent.slice() : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initExtentForUnion"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])(linearMapper, linearScaleMapperMethods);
    return linearMapper;
}
var linearScaleMapperMethods = {
    needTransform: function() {
        return false;
    },
    normalize: function(val) {
        var extent = this._extents[SCALE_EXTENT_KIND_MAPPING] || this._extents[SCALE_EXTENT_KIND_EFFECTIVE];
        if (extent[1] === extent[0]) {
            return 0.5;
        }
        return (val - extent[0]) / (extent[1] - extent[0]);
    },
    scale: function(val) {
        var extent = this._extents[SCALE_EXTENT_KIND_MAPPING] || this._extents[SCALE_EXTENT_KIND_EFFECTIVE];
        return val * (extent[1] - extent[0]) + extent[0];
    },
    transformIn: function(val) {
        return val;
    },
    transformOut: function(val) {
        return val;
    },
    contain: function(val) {
        // This method is typically used in axis trigger and markers.
        // Users may be confused if the extent is restricted to `SCALE_EXTENT_KIND_EFFECTIVE`.
        var extent = getScaleExtentForMappingUnsafe(this, null);
        return val >= extent[0] && val <= extent[1];
    },
    getExtent: function() {
        return this._extents[SCALE_EXTENT_KIND_EFFECTIVE].slice();
    },
    getExtentUnsafe: function(kind) {
        return this._extents[kind];
    },
    setExtent: function(start, end) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])(!this._frozen);
        }
        writeExtent(this._extents, SCALE_EXTENT_KIND_EFFECTIVE, start, end);
    },
    setExtent2: function(kind, start, end) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])(!this._frozen);
        }
        var extentList = this._extents;
        if (!extentList[kind]) {
            extentList[kind] = extentList[SCALE_EXTENT_KIND_EFFECTIVE].slice();
        }
        writeExtent(extentList, kind, start, end);
    },
    freeze: function() {
        if ("TURBOPACK compile-time truthy", 1) {
            // @ts-ignore
            this._frozen = true;
        }
    }
};
function writeExtent(extentList, kind, start, end) {
    // NOTE: `NaN` should be excluded. e.g., `scaleRawExtentInfo.resultMinMax` may be `[NaN, NaN]`.
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidBoundsForExtent"])(start, end)) {
        extentList[kind][0] = start;
        extentList[kind][1] = end;
    } else {
        if ("TURBOPACK compile-time truthy", 1) {
            // PENDING: should use `assert` after fixing all invalid calls.
            if (start != null && end != null && start <= end) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["error"])("Invalid setExtent call - start: " + start + ", end: " + end);
            }
        }
    }
} // ------ END: Linear Scale Mapper ------
}),
]);

//# sourceMappingURL=10pt_echarts_lib_scale_1o7bo49._.js.map