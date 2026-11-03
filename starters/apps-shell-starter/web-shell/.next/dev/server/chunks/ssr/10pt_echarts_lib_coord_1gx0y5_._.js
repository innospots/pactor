module.exports = [
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/Axis.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisTickLabelBuilder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisTickLabelBuilder.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/helper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisBand$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisBand.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisHelper.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
var NORMALIZED_EXTENT = [
    0,
    1
];
/**
 * Base class of Axis.
 *
 * Lifetime: recreate for each main process.
 * [NOTICE]: Some caches is stored on the axis instance (e.g., `axisTickLabelBuilder.ts`, `scaleRawExtentInfo.ts`),
 *  which is based on this lifetime.
 */ var Axis = /** @class */ function() {
    function Axis(dim, scale, extent) {
        // NOTICE: Must ensure `true` is only available on 'category' axis.
        this.onBand = false;
        // Make sure that `extent[0] > extent[1]` only if `inverse: true`.
        // `inverse` can be inferred by `extent` unless `extent[0] === extent[1]`.
        this.inverse = false;
        this.dim = dim;
        this.scale = scale;
        this._extent = extent || [
            0,
            0
        ];
    }
    /**
   * If axis extent contain given coord
   */ Axis.prototype.contain = function(coord) {
        var extent = this._extent;
        var min = Math.min(extent[0], extent[1]);
        var max = Math.max(extent[0], extent[1]);
        return coord >= min && coord <= max;
    };
    /**
   * If axis extent contain given data
   */ Axis.prototype.containData = function(data) {
        return this.scale.contain(this.scale.parse(data));
    };
    /**
   * Get coord extent.
   */ Axis.prototype.getExtent = function() {
        return this._extent.slice();
    };
    /**
   * Set coord extent
   */ Axis.prototype.setExtent = function(start, end) {
        var extent = this._extent;
        extent[0] = start;
        extent[1] = end;
    };
    /**
   * Convert data to coord. Data is the rank if it has an ordinal scale
   */ Axis.prototype.dataToCoord = function(data, clamp) {
        var scale = this.scale;
        data = scale.normalize(scale.parse(data));
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["linearMap"])(data, NORMALIZED_EXTENT, makeExtentWithBands(this), clamp);
    };
    /**
   * Convert coord to data. Data is the rank if it has an ordinal scale
   */ Axis.prototype.coordToData = function(coord, clamp) {
        var t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["linearMap"])(coord, makeExtentWithBands(this), NORMALIZED_EXTENT, clamp);
        return this.scale.scale(t);
    };
    /**
   * Convert pixel point to data in axis
   */ Axis.prototype.pointToData = function(point, clamp) {
        // Should be implemented in derived class if necessary.
        return;
    };
    /**
   * Different from `zrUtil.map(axis.getTicks(), axis.dataToCoord, axis)`,
   * `axis.getTicksCoords` considers `onBand`, which is used by
   * `boundaryGap:true` of category axis and splitLine and splitArea.
   * @param opt.tickModel default: axis.model.getModel('axisTick')
   */ Axis.prototype.getTicksCoords = function(opt) {
        opt = opt || {};
        var tickModel = opt.tickModel || this.getTickModel();
        var result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisTickLabelBuilder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createAxisTicks"])(this, tickModel, {
            breakTicks: opt.breakTicks,
            pruneByBreak: opt.pruneByBreak
        });
        var preTicksCoords = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(result.ticks, function(tick) {
            return {
                coord: this.dataToCoord((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTickValueOutermost"])(this.scale, tick)),
                tick: tick
            };
        }, this);
        var alignWithLabel = tickModel.get('alignWithLabel');
        var onBandModified = fixOnBandTicksCoords(this, preTicksCoords, alignWithLabel);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(preTicksCoords, function(item) {
            return {
                coord: item.coord,
                tickValue: item.tick.value,
                onBand: onBandModified
            };
        });
    };
    Axis.prototype.getMinorTicksCoords = function() {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOrdinalScale"])(this.scale)) {
            // Category axis doesn't support minor ticks
            return [];
        }
        var minorTickModel = this.model.getModel('minorTick');
        var splitNumber = minorTickModel.get('splitNumber');
        // Protection.
        if (!(splitNumber > 0 && splitNumber < 100)) {
            splitNumber = 5;
        }
        var minorTicks = this.scale.getMinorTicks(splitNumber);
        var minorTicksCoords = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(minorTicks, function(minorTicksGroup) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(minorTicksGroup, function(minorTick) {
                return {
                    coord: this.dataToCoord(minorTick),
                    tickValue: minorTick
                };
            }, this);
        }, this);
        return minorTicksCoords;
    };
    Axis.prototype.getViewLabels = function(ctx) {
        ctx = ctx || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisTickLabelBuilder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createAxisLabelsComputingContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisTickLabelBuilder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AxisTickLabelComputingKind"].determine);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisTickLabelBuilder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createAxisLabels"])(this, ctx).labels;
    };
    Axis.prototype.getLabelModel = function() {
        return this.model.getModel('axisLabel');
    };
    /**
   * Notice here we only get the default tick model. For splitLine
   * or splitArea, we should pass the splitLineModel or splitAreaModel
   * manually when calling `getTicksCoords`.
   * In GL, this method may be overridden to:
   * `axisModel.getModel('axisTick', grid3DModel.getModel('axisTick'));`
   */ Axis.prototype.getTickModel = function() {
        return this.model.getModel('axisTick');
    };
    /**
   * @deprecated Use `calcBandWidth` instead.
   */ Axis.prototype.getBandWidth = function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisBand$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calcBandWidth"])(this, {
            min: 1
        }).w;
    // NOTICE: Do not add logic here. Implement everthing in `calcBandWidth`.
    };
    /**
   * Only be called in category axis.
   * Can be overridden, consider other axes like in 3D.
   * @return Auto interval for category axis tick and label
   */ Axis.prototype.calculateCategoryInterval = function(ctx) {
        ctx = ctx || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisTickLabelBuilder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createAxisLabelsComputingContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisTickLabelBuilder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AxisTickLabelComputingKind"].determine);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisTickLabelBuilder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateCategoryInterval"])(this, ctx);
    };
    return Axis;
}();
function makeExtentWithBands(axis) {
    var extent = axis.getExtent();
    if (axis.onBand) {
        var size = extent[1] - extent[0];
        var margin = size / axis.scale.count() / 2;
        extent[0] += margin;
        extent[1] -= margin;
    }
    return extent;
}
/**
 * `axis.onBand: true` (i.e., `boundaryGap: true` in ec option) and `CategoryTickLabelSplitIntervalOption`
 *  affects `axisTick`/`axisLabel`/`splitLine`/`splitArea`.
 *
 * Currently, the visual result is best only when `axisTick/splitLine/splitArea.interval === 0`.
 * The typical case is:
 *      |---|---|---|     <= This is the input `preTicksCoords`
 *      0   1   2   3        (having been added half band width by `makeExtentWithBands`).
 *    |---|---|---|---|  <= This is the result.
 *      0   1   2   3
 *
 * When `interval > 0`, the visual result may be odd for `axisLabel` and `customValues`, but acceptable
 * for `axisTick` `splitLine` and `splitArea`:
 *      |---~---|---~---~---|---|    <= This is the input `preTicksCoords`; `interval: 2; min: 1; max: 7`.
 *      ₁   ₂   3   ₄   ₅   6   ₇       Subscript numbers (`₀`, `₁`, `₃`) indicate axis labels are hidden
 *                                      (by default settings) due to off-interval.
 *                                      A tilde (`~`) indicates a tick ignored due to off-interval.
 *    |---~---|---~---~---|---~---|  <= This is the result.
 *      ₁   ₂   3   ₄   ₅   6   ₇
 *
 * NOTE:
 *  - A inappropriate result may cause misleading (e.g., split 2 bars of a single data item when there
 *    are two bar series).
 *  - See also #11176 #11186 .
 * PENDING:
 *  - The show/hide of `axisLabel` may be optimized when `interval > 1 and be an even number`,
 *    but that may introduce complex and still not perfect in odd number, and may not necessary if
 *    `axisTick: {show: false}` and `axisLabel` can auto hidden when overlapping.
 */ function fixOnBandTicksCoords(axis, preTicksCoords, alignWithLabel) {
    var ticksLen = preTicksCoords.length;
    if (!axis.onBand || alignWithLabel || !ticksLen) {
        return false;
    }
    // Assume:
    //  - If `onBand: true`, `bandWidth` has been calculated by `ticksLen + 1` rather than `ticksLen`.
    //  - If `interval > 0`, some ticks may be ignored, but `ticksCoords` has always included boundary
    //    ticks of axis extent, and be `offInterval: true` if off-interval.
    //  - No need to consider breaks, since axis break is not supported in category axis.
    var bandWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisBand$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calcBandWidth"])(axis).w;
    if (!bandWidth) {
        return false;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(preTicksCoords, function(ticksItem) {
        ticksItem.coord -= bandWidth / 2;
    });
    var dataExtent = axis.scale.getExtent();
    var oldLast = preTicksCoords[ticksLen - 1];
    if (oldLast.tick.offInterval) {
        preTicksCoords.pop();
    }
    preTicksCoords.push({
        coord: oldLast.coord + bandWidth,
        tick: {
            value: dataExtent[1] + 1
        }
    });
    return true;
}
const __TURBOPACK__default__export__ = Axis;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/CoordinateSystem.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
*/ __turbopack_context__.s([
    "isCoordinateSystemType",
    ()=>isCoordinateSystemType,
    "isGeoLikeCoordSys",
    ()=>isGeoLikeCoordSys
]);
function isCoordinateSystemType(coordSys, type) {
    return coordSys.type === type;
}
function isGeoLikeCoordSys(coordSys) {
    var dimensions = coordSys.dimensions;
    // Not use coordSys.type === 'geo' because coordSys maybe extended
    return dimensions[0] === 'lng' && dimensions[1] === 'lat' && !!coordSys.getViewRect;
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/View.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VIEW_COORD_SYS_TRANS_OVERALL",
    ()=>VIEW_COORD_SYS_TRANS_OVERALL,
    "VIEW_COORD_SYS_TRANS_RAW",
    ()=>VIEW_COORD_SYS_TRANS_RAW,
    "VIEW_COORD_SYS_TRANS_ROAM",
    ()=>VIEW_COORD_SYS_TRANS_ROAM,
    "VIEW_COORD_SYS_TYPE",
    ()=>VIEW_COORD_SYS_TYPE,
    "applyViewCoordSysTransToElement",
    ()=>applyViewCoordSysTransToElement,
    "calcCompensationScaleToPreserveNodeSize",
    ()=>calcCompensationScaleToPreserveNodeSize,
    "clampByZoomLimit",
    ()=>clampByZoomLimit,
    "default",
    ()=>__TURBOPACK__default__export__,
    "getOwnRoamViewCoordSys",
    ()=>getOwnRoamViewCoordSys,
    "isViewCoordSys",
    ()=>isViewCoordSys,
    "ownRoamModelCoordSysUpdateInAction",
    ()=>ownRoamModelCoordSysUpdateInAction,
    "ownRoamViewUpdateDirectlyInAction",
    ()=>ownRoamViewUpdateDirectlyInAction,
    "useLegacyViewCoordSysCenterBase",
    ()=>useLegacyViewCoordSysCenterBase,
    "viewCoordSysCopyBoundingRect",
    ()=>viewCoordSysCopyBoundingRect,
    "viewCoordSysCopyOverallMatrix",
    ()=>viewCoordSysCopyOverallMatrix,
    "viewCoordSysCopyTrans",
    ()=>viewCoordSysCopyTrans,
    "viewCoordSysCopyViewRect",
    ()=>viewCoordSysCopyViewRect,
    "viewCoordSysGetZoomOption",
    ()=>viewCoordSysGetZoomOption,
    "viewCoordSysSetBoundingRect",
    ()=>viewCoordSysSetBoundingRect,
    "viewCoordSysSetRoamOptionFromModel",
    ()=>viewCoordSysSetRoamOptionFromModel,
    "viewCoordSysSetViewRect",
    ()=>viewCoordSysSetViewRect
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.3.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/BoundingRect.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/Transformable.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$ExtensionAPI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/ExtensionAPI.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/graphic.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/animation/basicTransition.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/matrix.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/vector.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
var VIEW_COORD_SYS_TRANS_RAW = 0;
var VIEW_COORD_SYS_TRANS_ROAM = 1;
var VIEW_COORD_SYS_TRANS_OVERALL = 2;
function inner(viewCoordSys) {
    return viewCoordSys;
}
var VIEW_COORD_SYS_TYPE = 'view';
/**
 * [VIEW_COORD_SYS]
 *
 * @final [NOTICE] Inheritance of this class is not recommended. Use composition instead.
 */ var View = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__extends"])(View, _super);
    function View(invertY, legacyCenterBase, legacyGeo) {
        var _this = _super.call(this) || this;
        _this.type = VIEW_COORD_SYS_TYPE;
        _this.dimensions = [
            'x',
            'y'
        ];
        var viewInner = inner(_this);
        viewInner.invertY = invertY;
        viewInner.lgCt = legacyCenterBase;
        viewInner.lgGeo = legacyGeo;
        var trans = viewInner.trans = [];
        trans[VIEW_COORD_SYS_TRANS_RAW] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transformableCreate"])();
        trans[VIEW_COORD_SYS_TRANS_ROAM] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transformableCreate"])();
        trans[VIEW_COORD_SYS_TRANS_OVERALL] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transformableCreate"])();
        viewInner.mtRaw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])();
        viewInner.mtRawInv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])();
        viewInner.mtOverall = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])();
        viewInner.mtOverallInv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])();
        viewInner.zoom = 1;
        return _this;
    }
    /**
   * @implements CoordinateSystem['getBoundingRect']
   * @see VIEW_COORD_SYS_TRANS_RAW
   *
   * This is a rect in data space.
   * For historicall reason, the name is `getBoundingRect` - preserve it for backward compatibility.
   */ View.prototype.getBoundingRect = function() {
        return viewCoordSysCopyBoundingRect(null, this);
    };
    /**
   * @implements CoordinateSystem['getViewRect']
   * @see VIEW_COORD_SYS_TRANS_RAW
   */ View.prototype.getViewRect = function() {
        return viewCoordSysCopyViewRect(null, this);
    };
    /**
   * @implements CoordinateSystem['getRoamTransform']
   */ View.prototype.getRoamTransform = function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transformableGetLocalTransform"])(inner(this).trans[VIEW_COORD_SYS_TRANS_ROAM]);
    };
    View.prototype.dataToPoint = function(data, noRoam, out) {
        var transform = noRoam ? inner(this).mtRaw : inner(this).mtOverall;
        out = out || [];
        return transform ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyTransform"])(out, data, transform) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["copy"])(out, data);
    };
    View.prototype.pointToData = function(point, reserved, out) {
        out = out || [];
        var invTransform = inner(this).mtOverallInv;
        return invTransform ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyTransform"])(out, point, invTransform) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["copy"])(out, point);
    };
    View.prototype.convertToPixel = function(ecModel, finder, value) {
        var coordSys = getCoordSys(finder);
        return coordSys === this ? coordSys.dataToPoint(value) : null;
    };
    View.prototype.convertFromPixel = function(ecModel, finder, pixel) {
        var coordSys = getCoordSys(finder);
        return coordSys === this ? coordSys.pointToData(pixel) : null;
    };
    View.prototype.containPoint = function(point) {
        var viewInner = inner(this);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["boundingRectCopy"])(tmpPixelRectForContain, viewInner.dataRect);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["boundingRectApplyTransform"])(tmpPixelRectForContain, tmpPixelRectForContain, viewInner.mtOverall);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["boundingRectContain"])(tmpPixelRectForContain, point[0], point[1]);
    };
    View.dimensions = [
        'x',
        'y'
    ];
    return View;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
var tmpPixelRectForContain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["boundingRectCreate"])();
function viewCoordSysCopyOverallMatrix(out, viewCoordSys) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["copy"])(out || [], inner(viewCoordSys).mtOverall);
}
function viewCoordSysGetZoomOption(viewCoordSys) {
    return inner(viewCoordSys).zoom;
}
function viewCoordSysCopyBoundingRect(out, viewCoordSys) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["boundingRectCopy"])(out || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["boundingRectCreate"])(), inner(viewCoordSys).dataRect);
}
function viewCoordSysCopyViewRect(out, viewCoordSys) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["boundingRectCopy"])(out || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["boundingRectCreate"])(), inner(viewCoordSys).viewRect);
}
function viewCoordSysCopyTrans(out, viewCoordSys, transKind) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["copyTransform"])(out || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transformableCreate"])(), inner(viewCoordSys).trans[transKind]);
}
function viewCoordSysIsInputReady(viewInner) {
    return !!(viewInner.dataRect && viewInner.viewRect);
// NOTE: Other parameters has default values. Only parameters
// above are required to be input.
}
function calcOverallTransFromSyncBackEl(out, viewInner, syncBackEl, syncBackType) {
    if (syncBackType === VIEW_COORD_SYS_TRANS_ROAM) {
        calcOverallTrans(out, viewInner.trans[VIEW_COORD_SYS_TRANS_RAW], syncBackEl);
    } else {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["copyTransform"])(out, syncBackEl);
    }
}
function calcRoamTransFromOverallTrans(out, viewInner, overallTrans) {
    // Convert overallTrans to roamTrans. If update animation is applied to overallTrans,
    // we assume that rawTrans is changed instantly, and roamTrans takes that animation.
    // Formula:
    //  overallTrans = roamTrans * rawTrans
    //  overallTrans * invert(rawTrans) = roamTrans
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transformableGetLocalTransform"])(overallTrans, tmpMtRTO);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mul"])(tmpMtRTO, tmpMtRTO, viewInner.mtRawInv);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["decomposeTransform"])(out, tmpMtRTO);
}
var tmpMtRTO = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])();
function viewCoordSysSetRoamOptionFromModel(viewCoordSys, hostModel) {
    var viewInner = inner(viewCoordSys);
    viewInner.centerOption = hostModel.getShallow('center');
    var zoomLimit = viewInner.zoomLimit = hostModel.getShallow('scaleLimit');
    var zoomOption = hostModel.getShallow('zoom');
    viewInner.zoom = clampByZoomLimit(zoomOption || 1, zoomLimit) || 1;
    if (viewCoordSysIsInputReady(viewInner)) {
        viewCoordSysUpdateTransform(viewInner);
    }
}
function viewCoordSysSetBoundingRect(viewCoordSys, x, y, width, height) {
    var viewInner = inner(viewCoordSys);
    viewInner.dataRect = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](x, y, width, height);
    if (viewCoordSysIsInputReady(viewInner)) {
        viewCoordSysUpdateTransform(viewInner);
    }
}
function viewCoordSysSetViewRect(viewCoordSys, x, y, width, height) {
    var viewInner = inner(viewCoordSys);
    viewInner.viewRect = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](x, y, width, height);
    if (viewCoordSysIsInputReady(viewInner)) {
        viewCoordSysUpdateTransform(viewInner);
    }
}
function viewCoordSysUpdateTransform(viewInner) {
    // The order matters.
    viewCoordSysUpdateRawTrans(viewInner);
    viewCoordSysUpdateRoamTrans(viewInner);
    viewCoordSysUpdateOverallTrans(viewInner);
}
function viewCoordSysUpdateRawTrans(viewInner) {
    var dataRect = viewInner.dataRect;
    var viewRect = viewInner.viewRect;
    var rawTrans = viewInner.trans[VIEW_COORD_SYS_TRANS_RAW];
    var invertY = viewInner.invertY;
    if (invertY) {
        dataRect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["boundingRectCopy"])(tmpRectURT, dataRect);
        dataRect.y = -dataRect.y - dataRect.height;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["boundingRectCalculateTransform"])(tmpMtURT, dataRect, viewRect);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["decomposeTransform"])(rawTrans, tmpMtURT);
    if (invertY) {
        rawTrans.scaleY = -rawTrans.scaleY;
    }
    var mtRaw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transformableGetLocalTransform"])(rawTrans, viewInner.mtRaw);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invert"])(viewInner.mtRawInv, mtRaw);
}
var tmpMtURT = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])();
var tmpRectURT = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["boundingRectCreate"])();
/**
 * NOTICE: It depends on `viewCoordSysUpdateRawTrans`.
 */ function viewCoordSysUpdateRoamTrans(viewInner) {
    var viewRectCenter = viewCoordSysGetViewRectCenter(viewInner);
    var roamViewCenter = parseCenterOption(tmpCenterURT, viewInner, viewInner.centerOption) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyTransform"])(tmpCenterURT, tmpCenterURT, viewInner.mtRaw) : viewRectCenter;
    var zoom = viewInner.zoom;
    var roamTrans = viewInner.trans[VIEW_COORD_SYS_TRANS_ROAM];
    roamTrans.x = viewRectCenter[0] - zoom * roamViewCenter[0];
    roamTrans.y = viewRectCenter[1] - zoom * roamViewCenter[1];
    roamTrans.scaleX = roamTrans.scaleY = zoom;
// [VIEW_COORD_SYS_APPLY_ROAM_CENTER_AND_ZOOM]
// Ordinarily, the definition is:
//  roamTrans.originX = roamViewCenter[0];
//  roamTrans.originY = roamViewCenter[1];
//  roamTrans.x = viewRectCenter[0] - roamViewCenter[0];
//  roamTrans.y = viewRectCenter[1] - roamViewCenter[1];
//  roamTrans.scaleX = roamTrans.scaleY = zoom;
// But `el.originX`/`originY` should not be set.
// (see VIEW_COORD_SYS_ANIMATION_PROPS_CONSTRAINT for the reason),
// so we use the above formula instead.
}
var tmpCenterURT = [];
/**
 * NOTICE: It depends on `viewCoordSysUpdateRoamTrans` and `viewCoordSysUpdateRawTrans`
 */ function viewCoordSysUpdateOverallTrans(viewInner) {
    var trans = viewInner.trans;
    var roamTrans = trans[VIEW_COORD_SYS_TRANS_ROAM];
    var rawTrans = trans[VIEW_COORD_SYS_TRANS_RAW];
    var overallTrans = trans[VIEW_COORD_SYS_TRANS_OVERALL];
    calcOverallTrans(overallTrans, rawTrans, roamTrans);
    var mtOverall = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transformableGetLocalTransform"])(overallTrans, viewInner.mtOverall);
    var mtOverallInv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invert"])(viewInner.mtOverallInv, mtOverall);
    legacyCopyOverallTrans(viewInner, overallTrans, mtOverall, mtOverallInv);
    legacyCopyOverallTrans(viewInner.lgGeo, overallTrans, mtOverall, mtOverallInv);
}
/**
 * [VIEW_COORD_SYS_TRANS_OVERALL_BACKWARD_COMPATIBILITY]
 *   VIEW_COORD_SYS_TRANS_OVERALL transformable has long been View or Geo instance itself.
 *   We keep backward compatibility, since some users may have visited it directly (e.g.
 *   for drawing a computed bounding rect).
 */ function legacyCopyOverallTrans(target, overallTrans, mtOverall, mtOverallInv) {
    if (target) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["copyTransform"])(target, overallTrans);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["copy"])(target.transform || (target.transform = []), mtOverall);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["copy"])(target.invTransform || (target.invTransform = []), mtOverallInv);
    }
}
function calcOverallTrans(out, rawTrans, roamTrans) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transformableGetLocalTransform"])(rawTrans, tmpMtCOT1);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transformableGetLocalTransform"])(roamTrans, tmpMtCOT2);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mul"])(tmpMtCOT2, tmpMtCOT2, tmpMtCOT1);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["decomposeTransform"])(out, tmpMtCOT2);
}
var tmpMtCOT1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])();
var tmpMtCOT2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])();
function getCoordSys(finder) {
    var seriesModel = finder.seriesModel;
    return seriesModel ? seriesModel.coordinateSystem : null; // e.g., graph.
}
function viewCoordSysGetViewRectCenter(viewInner) {
    var viewRect = viewInner.viewRect;
    tmpViewRectCenter[0] = viewRect.x + viewRect.width / 2;
    tmpViewRectCenter[1] = viewRect.y + viewRect.height / 2;
    return tmpViewRectCenter;
}
var tmpViewRectCenter = [];
function isViewCoordSys(coordSys) {
    return coordSys && coordSys.type === 'view';
}
function applyViewCoordSysTransToElement(syncBackEl, syncBackType, viewCoordSys, // If NullUndefined, no animation.
// Typically, there should be no animation in the first render and in `__updateOnOwnRoam`.
animatableModel) {
    var viewInner = inner(viewCoordSys);
    viewInner.syncBackEl = syncBackEl;
    viewInner.syncBackType = syncBackType;
    if (!animatableModel) {
        viewCoordSysCopyTrans(syncBackEl, viewCoordSys, syncBackType);
        syncBackEl.dirty();
    } else {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateProps"])(syncBackEl, viewCoordSysCopyTrans(null, viewCoordSys, syncBackType), animatableModel);
    }
}
/**
 * FIXME: [FIXME_VIEW_COORD_SYS_SYNC_BACK]
 *  Currently the "sync back" is only performed on roam action. But these cases are not
 *  covered:
 *  1. Consider both center change and series data adding is requested via `setOption`
 *    and animation is not finished, the new added series symbols should lay out based
 *    on the "intermediate state" rather than the "final state" of the VIEW_COORD_SYS,
 *    otherwise, visual artifacts can arise.
 *  2. See the case of FIXME_SYMBOL_CLIP_CONSIDERING_COORD_SYS_ALIGNMENT_DURING_ANIMATION .
 */ function viewCoordSysSyncBack(viewCoordSys, hostModel, otherModelsToSync, payload) {
    var viewInner = inner(viewCoordSys);
    var syncBackEl = viewInner.syncBackEl;
    if (syncBackEl) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(viewInner.syncBackType != null);
        }
        // @see VIEW_COORD_SYS_ANIMATION_INTERRUPTION
        syncBackEl.stopAnimation();
        // syncBackEl may have been changed regardless of animation,
        // therefore, need to sync back.
        calcOverallTransFromSyncBackEl(tmpTransSB1, viewInner, syncBackEl, viewInner.syncBackType);
    } else {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["copyTransform"])(tmpTransSB1, viewInner.trans[VIEW_COORD_SYS_TRANS_OVERALL]);
    }
    // Sync back to model.
    calcRoamTransFromOverallTrans(tmpTransSB2, viewInner, tmpTransSB1);
    payload ? applyRoamPayloadToOverallTrans(tmpTransSB1, tmpTransSB2, viewInner, payload) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["copyTransform"])(tmpTransSB1, tmpTransSB2);
    calcRoamTransFromOverallTrans(tmpTransSB1, viewInner, tmpTransSB1);
    syncBackToRoamOptionFromRoamTrans(viewInner, hostModel, otherModelsToSync, tmpTransSB1);
}
var tmpTransSB1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transformableCreate"])();
var tmpTransSB2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transformableCreate"])();
function ownRoamModelCoordSysUpdateInAction(payload, hostModel, // This is only used for MAP_SERIES_GROUP, where the change need to sync to all series,
// otherwise when legend filter some series and the other series take the responsibility
// to draw map, or roam then legend restored, the result will be incorrect.
otherModelsToSync) {
    // NOTE: VIEW_COORD_SYS instances are depended on by this action handler.
    // Under the current design, actions should not be triggered before `setOption`
    // being called, therefore coord sys instances always exist.
    var viewCoordSys = getOwnRoamViewCoordSys(hostModel);
    if (viewCoordSys) {
        // Sync back to model.
        viewCoordSysSyncBack(viewCoordSys, hostModel, otherModelsToSync, payload);
        // Recalculate from model.
        viewCoordSysSetRoamOptionFromModel(viewCoordSys, hostModel);
    }
}
function getOwnRoamViewCoordSys(hostModel) {
    return hostModel.__ownRoamView ? hostModel.__ownRoamView() : null;
}
function ownRoamViewUpdateDirectlyInAction(payload, componentOrSeries, ecModel, api) {
    // Tricky: disable animation in `updateProps` of `graphic.ts`.
    ecModel.setUpdatePayload((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["payloadDisableAnimation"])(payload));
    var componentOrSeriesView = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$ExtensionAPI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getViewOfComponentOrSeries"])(api, componentOrSeries);
    if (componentOrSeriesView && componentOrSeriesView.__updateOnOwnRoam) {
        componentOrSeriesView.__updateOnOwnRoam(payload, componentOrSeries, api);
    }
}
function applyRoamPayloadToOverallTrans(targetOverallTrans, roamTrans, viewInner, payload) {
    // NOTE: payload.dx/dy should always applied to pixel space, i.e., "overallTrans".
    if (payload.dx != null && payload.dy != null) {
        targetOverallTrans.x += payload.dx;
        targetOverallTrans.y += payload.dy;
    }
    var deltaZoom = payload.zoom;
    if (deltaZoom != null) {
        // Although `zoomOption` is defined on roamTrans
        var oldZoom = getZoomFromRoamTrans(roamTrans);
        var newZoom = clampByZoomLimit(oldZoom * deltaZoom, viewInner.zoomLimit);
        var deltaZoom2 = newZoom / oldZoom;
        // Keep the mouse center when scaling.
        targetOverallTrans.x -= (payload.originX - targetOverallTrans.x) * (deltaZoom2 - 1);
        targetOverallTrans.y -= (payload.originY - targetOverallTrans.y) * (deltaZoom2 - 1);
        // Although `zoomOption` is defined on roamTrans,
        // deltaZoom can be applied to overallTrans directly.
        targetOverallTrans.scaleX *= deltaZoom2;
        targetOverallTrans.scaleY *= deltaZoom2;
    }
}
function getZoomFromRoamTrans(trans) {
    if ("TURBOPACK compile-time truthy", 1) {
        // scaleX and scaleY should be the same even during animation.
        // See VIEW_COORD_SYS_APPLY_ROAM_CENTER_AND_ZOOM .
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathAbs"])(trans.scaleX - trans.scaleY) < 1e-5);
    }
    return trans.scaleX;
}
function parseCenterOption(// `out` is a center in `dataRect` space.
out, viewInner, centerOption) {
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(viewCoordSysIsInputReady(viewInner));
    }
    var dataRect = viewInner.dataRect;
    if (!centerOption) {
        return false;
    }
    // #16904 introduced percentage string here, such as '33%'. But it was based on canvas
    // width/height, which is not reasonable - the unit may incorrect, and it is unpredictable if
    // the `ViewInner['dataRect']` is not calculated based on the current canvas rect. Therefore the percentage
    // value is changed to based on `ViewInner['dataRect'].width/height` since v6. Under this definition, users
    // can use '0%' to map the top-left of `ViewInner['dataRect']` to the center of `ViewInner['viewRect']`.
    var lgCt = viewInner.lgCt;
    if (lgCt) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["set"])(out, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePercent"])(centerOption[0], lgCt.w), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePercent"])(centerOption[1], lgCt.h));
    } else if (dataRect) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["set"])(out, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePercent"])(centerOption[0], dataRect.width, dataRect.x), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePercent"])(centerOption[1], dataRect.height, dataRect.y));
    }
    return true;
}
/**
 * An inverse operation to `parseCenterOption`.
 * Mainly for percentage center option.
 */ function invertBackToCenterOption(viewInner, center) {
    var lastCenterOption = viewInner.centerOption;
    var dataRect = viewInner.dataRect;
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(center && dataRect);
    }
    return !lastCenterOption || viewInner.lgCt ? center.slice() : [
        invertToPercentPerCenterDim(0, center, lastCenterOption, dataRect),
        invertToPercentPerCenterDim(1, center, lastCenterOption, dataRect)
    ];
}
function invertToPercentPerCenterDim(dimIdx, center, lastCenterOption, dataRect) {
    return lastCenterOption && dataRect && dataRect[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WH"][dimIdx]] && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isPositionSizeOptionPercent"])(lastCenterOption[dimIdx]) ? (center[dimIdx] - dataRect[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["XY"][dimIdx]]) / dataRect[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WH"][dimIdx]] * 100 + '%' : center[dimIdx];
}
function useLegacyViewCoordSysCenterBase(ecModel, api) {
    return api && ecModel && ecModel.getShallow('legacyViewCoordSysCenterBase') ? {
        w: api.getWidth(),
        h: api.getHeight()
    } : null;
}
/**
 * @see VIEW_COORD_SYS_ANIMATION_INTERRUPTION
 */ function syncBackToRoamOptionFromRoamTrans(viewInner, hostModel, otherModelsToSync, roamTrans) {
    // This is the inverse operation of `viewCoordSysSetRoamOptionFromModel`.
    var viewRectCenter = viewCoordSysGetViewRectCenter(viewInner);
    var zoom = getZoomFromRoamTrans(roamTrans);
    var notZoomNearZero = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathAbs"])(zoom) > 1e-6;
    tmpCenterITR[0] = notZoomNearZero ? (viewRectCenter[0] - roamTrans.x) / zoom : viewRectCenter[0]; // Unlikely to occur.
    tmpCenterITR[1] = notZoomNearZero ? (viewRectCenter[1] - roamTrans.y) / zoom : viewRectCenter[1]; // Unlikely to occur.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyTransform"])(tmpCenterITR, tmpCenterITR, viewInner.mtRawInv);
    var centerOption = invertBackToCenterOption(viewInner, tmpCenterITR);
    syncBackRoamOptionToRoamHostModel(hostModel, centerOption, zoom);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(otherModelsToSync, function(otherModel) {
        if (otherModel !== hostModel) {
            syncBackRoamOptionToRoamHostModel(otherModel, centerOption.slice(), zoom);
        }
    });
}
var tmpCenterITR = [];
/**
 * Models should be updated, otherwise consequent `setOption()` can cause outdated `center`
 * and `zoom` to be used.
 */ function syncBackRoamOptionToRoamHostModel(hostModel, center, zoom) {
    var option = hostModel.option;
    option.center = center;
    option.zoom = zoom;
}
function clampByZoomLimit(zoom, zoomLimit) {
    if (zoomLimit) {
        var zoomMin = zoomLimit.min || 0;
        var zoomMax = zoomLimit.max || Infinity;
        zoom = Math.max(Math.min(zoomMax, zoom), zoomMin);
    }
    return zoom;
}
function calcCompensationScaleToPreserveNodeSize(viewCoordSys, model) {
    var nodeScaleRatio = model.getShallow('nodeScaleRatio', true) || 1;
    var viewInner = inner(viewCoordSys);
    // Scale node when zoom changes
    return ((viewInner.zoom - 1) * nodeScaleRatio + 1) / (viewInner.trans[VIEW_COORD_SYS_TRANS_OVERALL].scaleX || 1);
}
const __TURBOPACK__default__export__ = View;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisAlignTicks.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "scaleCalcAlign",
    ()=>scaleCalcAlign
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Interval$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/Interval.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/Log.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisHelper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/helper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$scaleRawExtentInfo$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/scaleRawExtentInfo.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/break.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
function scaleCalcAlign(targetAxis, alignToScale) {
    var targetScale = targetAxis.scale;
    var targetAxisModel = targetAxis.model;
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(targetScale && targetAxisModel && (targetScale instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Interval$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"] || targetScale instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]) && (alignToScale instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Interval$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"] || alignToScale instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]));
    }
    var targetExtentInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$scaleRawExtentInfo$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["adoptScaleRawExtentInfoAndPrepare"])(targetScale, targetAxisModel, targetAxisModel.ecModel, targetAxis, null);
    // FIXME:
    //  (1) Axis inverse is not considered yet.
    //  (2) `SCALE_EXTENT_KIND_MAPPING` is not considered yet.
    var isTargetLogScale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isLogScale"])(targetScale);
    var alignToScaleLinear = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isLogScale"])(alignToScale) ? alignToScale.intervalStub : alignToScale;
    var targetIntervalStub = isTargetLogScale ? targetScale.intervalStub : targetScale;
    var targetLogScaleBase = targetScale.base;
    var alignToTicks = alignToScaleLinear.getTicks();
    var alignToExpNiceTicks = alignToScaleLinear.getTicks({
        expandToNicedExtent: true
    });
    var alignToSegCount = alignToTicks.length - 1;
    if ("TURBOPACK compile-time truthy", 1) {
        // This is guards for future changes of `Interval#getTicks`.
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasBreaks"])(alignToScale) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasBreaks"])(targetScale));
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(alignToSegCount > 0); // Ticks length >= 2 even on a blank scale.
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(alignToExpNiceTicks.length === alignToTicks.length);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(alignToTicks[0].value <= alignToTicks[alignToSegCount].value);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(alignToExpNiceTicks[0].value <= alignToTicks[0].value && alignToTicks[alignToSegCount].value <= alignToExpNiceTicks[alignToSegCount].value);
        if (alignToSegCount >= 2) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(alignToExpNiceTicks[1].value === alignToTicks[1].value);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(alignToExpNiceTicks[alignToSegCount - 1].value === alignToTicks[alignToSegCount - 1].value);
        }
    }
    // The Current strategy: Find a proper interval and an extent for the target scale to derive ticks
    // matching exactly to ticks of `alignTo` scale.
    // Adjust min, max based on the extent of alignTo. When min or max is set in alignTo scale
    var t0; // diff ratio on min not-nice segment. 0 <= t0 < 1
    var t1; // diff ratio on max not-nice segment. 0 <= t1 < 1
    var alignToNiceSegCount; // >= 1
    // Consider ticks of `alignTo`, only these cases below may occur:
    if (alignToSegCount === 1) {
        // `alignToTicks` is like:
        //  |--|
        // In this case, we make the corresponding 2 target ticks "nice".
        t0 = t1 = 0;
        alignToNiceSegCount = 1;
    } else if (alignToSegCount === 2) {
        // `alignToTicks` is like:
        //  |-|-----| or
        //  |-----|-| or
        //  |-----|-----|
        // Notices that nice ticks do not necessarily exist in this case.
        // In this case, we choose the larger segment as the "nice segment" and
        // the corresponding target ticks are made "nice".
        var interval0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathAbs"])(alignToTicks[0].value - alignToTicks[1].value);
        var interval1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathAbs"])(alignToTicks[1].value - alignToTicks[2].value);
        t0 = t1 = 0;
        if (interval0 === interval1) {
            alignToNiceSegCount = 2;
        } else {
            alignToNiceSegCount = 1;
            if (interval0 < interval1) {
                t0 = interval0 / interval1;
            } else {
                t1 = interval1 / interval0;
            }
        }
    } else {
        // alignToSegCount >= 3
        // `alignToTicks` is like:
        //  |-|-----|-----|-| or
        //  |-----|-----|-| or
        //  |-|-----|-----| or ...
        // At least one nice segment is present, and not-nice segments are only present on
        // the start and/or the end.
        // In this case, ticks corresponding to nice segments are made "nice".
        var alignToInterval = alignToScaleLinear.getConfig().interval;
        t0 = (1 - (alignToTicks[0].value - alignToExpNiceTicks[0].value) / alignToInterval) % 1;
        t1 = (1 - (alignToExpNiceTicks[alignToSegCount].value - alignToTicks[alignToSegCount].value) / alignToInterval) % 1;
        alignToNiceSegCount = alignToSegCount - (t0 ? 1 : 0) - (t1 ? 1 : 0);
    }
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(alignToNiceSegCount >= 1);
    }
    // NOTE:
    //  Consider a case:
    //    dataZoom controls all Y axes;
    //    dataZoom end is 90% (maxFixed: true, dataZoomFixMinMax[0]: true);
    //    but dataZoom start is 0% (minFixed: false, dataZoomFixMinMax[1]: false);
    //  In this case,
    //    - `Interval#calcNiceTicks` only uses `targetExtentInfo.max` as the upper bound, but expand the
    //      lower bound to a "nice" tick and can get an acceptable result.
    //    - `scaleCalcAlign` has to use both `targetExtentInfo.min/max` as the bounds without any expansion,
    //      otherwise the lower bound may become negative unexpectedly, especially for all positive series data.
    var dataZoomFixMinMax = targetExtentInfo.zoomFixMM;
    var hasDataZoomFixMinMax = dataZoomFixMinMax[0] || dataZoomFixMinMax[1];
    var targetMinMaxFixed = [
        targetExtentInfo.fixMM[0] || hasDataZoomFixMinMax,
        targetExtentInfo.fixMM[1] || hasDataZoomFixMinMax
    ];
    // MEMO: When only `xxxAxis.min` or `xxxAxis.max` is fixed,
    //  - Even a "nice" interval can be calculated, ticks accumulated based on `min`/`max` can be "nice" only if
    //    `min` or `max` is a "nice" number.
    //  - Generating a "nice" interval may cause the extent have both positive and negative ticks, which may be
    //    not preferable for all positive (very common) or all negative series data. But it can be simply resolved
    //    by specifying `xxxAxis.min: 0`/`xxxAxis.max: 0`, so we do not specially handle this case here.
    //  Therefore, we prioritize generating "nice" interval over preventing from crossing zero.
    //  e.g., if series data are all positive and the max data is `11739`,
    //      If setting `yAxis.max: 'dataMax'`, ticks may be like:
    //          `11739, 8739, 5739, 2739, -1739` (not "nice" enough)
    //      If setting `yAxis.max: 'dataMax', yAxis.min: 0`, ticks may be like:
    //          `11739, 8805, 5870, 2935, 0` (not "nice" enough but may be acceptable)
    //      If setting `yAxis.max: 12000, yAxis.min: 0`, ticks may be like:
    //          `12000, 9000, 6000, 3000, 0` ("nice")
    var targetOldOutermostExtent = targetScale.getExtent();
    var targetOldIntervalExtent = targetIntervalStub.getExtent();
    var targetExtent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["intervalScaleEnsureValidExtent"])(targetOldIntervalExtent, targetMinMaxFixed);
    var min;
    var max;
    var interval;
    var intervalPrecision;
    var maxNice;
    var minNice;
    function loopIncreaseInterval(cb) {
        // Typically this loop runs less than 5 times. But we still
        // use a fail-safe for future changes.
        var LOOP_MAX = 50;
        var loopGuard = 0;
        for(; loopGuard < LOOP_MAX; loopGuard++){
            if (cb()) {
                break;
            }
            interval = isTargetLogScale ? interval * (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathMax"])(targetLogScaleBase, 2) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["increaseInterval"])(interval);
            intervalPrecision = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getIntervalPrecision"])(interval);
        }
        if ("TURBOPACK compile-time truthy", 1) {
            if (loopGuard >= LOOP_MAX) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warn"])('incorrect impl in `scaleCalcAlign`.');
            }
        }
    }
    function updateMinFromMinNice() {
        min = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["round"])(minNice - interval * t0, intervalPrecision);
    }
    function updateMaxFromMaxNice() {
        max = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["round"])(maxNice + interval * t1, intervalPrecision);
    }
    function updateMinNiceFromMinT0Interval() {
        minNice = t0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["round"])(min + interval * t0, intervalPrecision) : min;
    }
    function updateMaxNiceFromMaxT1Interval() {
        maxNice = t1 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["round"])(max - interval * t1, intervalPrecision) : max;
    }
    // NOTE: The new calculated `min`/`max` must NOT shrink the original extent; otherwise some series
    // data may be outside of the extent. They can expand the original extent slightly to align with
    // ticks of `alignTo`. In this case, more blank space is added but visually fine.
    if (targetMinMaxFixed[0] && targetMinMaxFixed[1]) {
        // Both `min` and `max` are specified (via dataZoom or ec option; consider both Cartesian, radar and
        // other possible axes). In this case, "nice" ticks can hardly be calculated, but reasonable ticks should
        // still be calculated whenever possible, especially `intervalPrecision` should be tuned for better
        // appearance and lower cumulative error.
        min = targetExtent[0];
        max = targetExtent[1];
        interval = (max - min) / (alignToNiceSegCount + t0 + t1);
        // Typically axis pixel extent is ready here. See `create` in `Grid.ts`.
        var axisPxExtent = targetAxis.getExtent();
        // NOTICE: this pxSpan may be not accurate yet due to "outerBounds" logic, but acceptable so far.
        var pxSpan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathAbs"])(axisPxExtent[1] - axisPxExtent[0]);
        // We imperically choose `pxDiffAcceptable` as `0.5 / alignToNiceSegCount` for reduce cumulative
        // error, otherwise a discernible misalign (> 1px) may occur.
        // PENDING: We do not find a acceptable precision for LogScale here.
        //  Theoretically it can be addressed but introduce more complexity. Is it necessary?
        intervalPrecision = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAcceptableTickPrecision"])([
            max,
            min
        ], pxSpan, 0.5 / alignToNiceSegCount);
        updateMinNiceFromMinT0Interval();
        updateMaxNiceFromMaxT1Interval();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNullableNumberFinite"])(intervalPrecision)) {
            interval = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["round"])(interval, intervalPrecision);
        }
    } else {
        // Make a minimal enough `interval`, increase it later.
        // It is a similar logic as `IntervalScale#calcNiceTicks` and `LogScale#calcNiceTicks`.
        // Axis break is not supported, which is guranteed by the caller of this function.
        var targetSpan = targetExtent[1] - targetExtent[0];
        interval = isTargetLogScale ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathMax"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["quantity"])(targetSpan), 1) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nice"])(targetSpan / alignToNiceSegCount, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NICE_MODE_MIN"]);
        intervalPrecision = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getIntervalPrecision"])(interval);
        if (targetMinMaxFixed[0]) {
            min = targetExtent[0];
            loopIncreaseInterval(function() {
                updateMinNiceFromMinT0Interval();
                maxNice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["round"])(minNice + interval * alignToNiceSegCount, intervalPrecision);
                updateMaxFromMaxNice();
                if (max >= targetExtent[1]) {
                    return true;
                }
            });
        } else if (targetMinMaxFixed[1]) {
            max = targetExtent[1];
            loopIncreaseInterval(function() {
                updateMaxNiceFromMaxT1Interval();
                minNice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["round"])(maxNice - interval * alignToNiceSegCount, intervalPrecision);
                updateMinFromMinNice();
                if (min <= targetExtent[0]) {
                    return true;
                }
            });
        } else {
            loopIncreaseInterval(function() {
                minNice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["round"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathCeil"])(targetExtent[0] / interval) * interval, intervalPrecision);
                maxNice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["round"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathFloor"])(targetExtent[1] / interval) * interval, intervalPrecision);
                // NOTE:
                //  - `maxNice - minNice >= -interval` here.
                //  - While `interval` increases, `currIntervalCount` decreases, minimum `-1`.
                var currIntervalCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathRound"])((maxNice - minNice) / interval);
                if (currIntervalCount <= alignToNiceSegCount) {
                    var moreCount = alignToNiceSegCount - currIntervalCount;
                    // Consider cases that negative tick do not make sense (or vice versa), users can simply
                    // specify `xxxAxis.min/max: 0` to avoid negative. But we still automatically handle it
                    // for some common cases whenever possible:
                    //  - When ec option is `xxxAxis.scale: false` (the default), it is usually unexpected if
                    //    negative (or positive) ticks are introduced.
                    //  - In LogScale, series data are usually either all > 1 or all < 1, rather than both,
                    //    that is, logarithm result is typically either all positive or all negative.
                    var moreCountPair = void 0;
                    var mayEnhanceZero = targetExtentInfo.incl0 || isTargetLogScale;
                    // `bounds < 0` or `bounds > 0` may require more complex handling, so we only auto handle
                    // `bounds === 0`.
                    if (mayEnhanceZero && targetExtent[0] === 0) {
                        // 0 has been included in extent and all positive.
                        moreCountPair = [
                            0,
                            moreCount
                        ];
                    } else if (mayEnhanceZero && targetExtent[1] === 0) {
                        // 0 has been included in extent and all negative.
                        moreCountPair = [
                            moreCount,
                            0
                        ];
                    } else {
                        // Try to center ticks in axis space whenever possible, which is especially preferable
                        // in `LogScale`.
                        var lessHalfCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathFloor"])(moreCount / 2);
                        moreCountPair = moreCount % 2 === 0 ? [
                            lessHalfCount,
                            lessHalfCount
                        ] : min + max < targetExtent[0] + targetExtent[1] ? [
                            lessHalfCount,
                            lessHalfCount + 1
                        ] : [
                            lessHalfCount + 1,
                            lessHalfCount
                        ];
                    }
                    minNice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["round"])(minNice - interval * moreCountPair[0], intervalPrecision);
                    maxNice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["round"])(maxNice + interval * moreCountPair[1], intervalPrecision);
                    updateMinFromMinNice();
                    updateMaxFromMaxNice();
                    if (min <= targetExtent[0] && max >= targetExtent[1]) {
                        return true;
                    }
                }
            });
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateIntervalOrLogScaleForNiceOrAligned"])(targetScale, targetMinMaxFixed, targetOldIntervalExtent, [
        min,
        max
    ], targetOldOutermostExtent, {
        // NOTE: Even in LogScale, `interval` should not be in log space.
        interval: interval,
        // Force ticks count, otherwise cumulative error may cause more unexpected ticks to be generated.
        // Though the overlapping tick labels may be auto-ignored, but probably unexpected, e.g., the min
        // tick label is ignored but the secondary min tick label is shown, which is unexpected when
        // `axis.min` is user-specified or dataZoom-specified.
        intervalCount: alignToNiceSegCount,
        intervalPrecision: intervalPrecision,
        niceExtent: [
            minNice,
            maxNice
        ]
    });
    if ("TURBOPACK compile-time truthy", 1) {
        targetScale.freeze();
    }
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisBand.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calcBandWidth",
    ()=>calcBandWidth
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/helper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisStatistics.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/scaleMapper.js [app-ssr] (ecmascript)");
;
;
;
;
;
// Arbitrary, leave some space to avoid overflowing when dataZoom moving.
var FALLBACK_BAND_WIDTH_RATIO = 0.8;
function calcBandWidth(axis, opt) {
    opt = opt || {};
    var out = {
        w: NaN,
        w2: NaN
    };
    var scale = axis.scale;
    var fromStat = opt.fromStat;
    var min = opt.min;
    // [BAND_WIDTH_USED_SCALE_LINEAR_SPAN]
    //  - Band width should always respect to the currently specified extent, and `SCALE_EXTENT_KIND_MAPPING`
    //    should be used if specified.
    //    Otherwise, the result may incorrect, especially when data count is small.
    //    For example, when "containShape" is calculating, no `SCALE_EXTENT_KIND_MAPPING` is set, so here only
    //    `SCALE_EXTENT_KIND_EFFECTIVE` is returned, say, `[3, 5]`, based on which a `SCALE_EXTENT_KIND_MAPPING`
    //    is calculated, say `[2.5, 5.5]` (expanded by `0.5`). Then when rendering, that `SCALE_EXTENT_KIND_MAPPING`
    //    is returned here.
    //    See AXIS_CONTAIN_SHAPE_COMMON_STRATEGY for more details.
    //  - The span should be in the linear space (typically, the innermost space).
    //  - We use the scale extent after being zoommed and `intervalScaleEnsureValidExtent`-ish applied and
    //    "nice"/"align" applied, because:
    //    - For OrdinalScale, fine;
    //    - For numeric scale, `scaleLinearSpan` is normally not used for a consistent result when `dataZoom`
    //      is applied, but used when none or single data item case.
    var scaleLinearSpan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getScaleLinearSpanForMapping"])(scale);
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNullableNumberFinite"])(scaleLinearSpan)) {
        // scale may be `[Infinity, -Infinity]`.
        scaleLinearSpan = NaN;
    }
    var axisExtent = axis.getExtent();
    // Always use a new pxSpan because it may be changed in `grid` contain label calculation.
    var pxSpan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathAbs"])(axisExtent[1] - axisExtent[0]);
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOrdinalScale"])(scale)) {
        calcBandWidthForCategoryAxis(out, axis, scaleLinearSpan, pxSpan);
    } else if (fromStat) {
        calcBandWidthForNumericAxis(out, axis, scaleLinearSpan, pxSpan, fromStat);
    } else if (min == null) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(false);
        }
    }
    if (min != null) {
        out.w = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNullableNumberFinite"])(out.w) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathMax"])(min, out.w) : min;
    }
    return out;
}
function calcBandWidthForCategoryAxis(out, axis, scaleLinearSpan, pxSpan) {
    var onBand = axis.onBand;
    var len = scaleLinearSpan + (onBand ? 1 : 0);
    // Fix #2728, avoid NaN when only one data.
    len === 0 && (len = 1);
    out.w = pxSpan / len;
    // NOTE:
    //  - When `scaleLinearSpan === 0`, no need to expand extent.
    //  - `onBand: true` (`boundaryGap: true`) does not need to support `containShape`,
    //    thereby no `invRatio`.
    if (!onBand && scaleLinearSpan && pxSpan) {
        out.w2 = out.w * scaleLinearSpan / pxSpan;
    }
}
function calcBandWidthForNumericAxis(out, axis, scaleLinearSpan, pxSpan, fromStat) {
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(fromStat);
    }
    var onlySingular = false;
    var bandWidthInData = -Infinity;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(fromStat.key ? [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAxisStat"])(axis, fromStat.key)
    ] : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAxisStatBySeries"])(axis, fromStat.sers || []), function(stat) {
        var liPosMinGap = stat.liPosMinGap;
        // NOTE: `liPosMinGap == null` may indicate that `requireAxisStatistics`
        // is not used by any series on this axis. We should not make `bandWidth`
        // for this case.
        if (liPosMinGap != null) {
            if (liPosMinGap > 0) {
                if (liPosMinGap > bandWidthInData) {
                    bandWidthInData = liPosMinGap;
                }
                onlySingular = false;
            } else if (liPosMinGap === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LINEAR_POSITIVE_MIN_GAP_SINGLE_VALID_VALUE"]) {
                onlySingular = true;
            }
        }
    });
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNullableNumberFinite"])(scaleLinearSpan) && scaleLinearSpan > 0 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNullableNumberFinite"])(bandWidthInData)) {
        out.w = pxSpan / scaleLinearSpan * bandWidthInData;
        out.w2 = bandWidthInData;
    } else if (onlySingular) {
        // This is the special handing for single value case, where min gap can not
        // be calculated, but `w` and `w2` (for "containShape") are still needed.
        out.w = pxSpan * FALLBACK_BAND_WIDTH_RATIO;
        out.w2 = out.w * scaleLinearSpan / pxSpan;
    // Consider an axis has both candlestick and bar series, where candlestick has multiple data
    // but the bar series has no data. In this case, that bar series should be ignored; otherwise,
    // the axis will be significantly expanded by "containShape" but no bar shape displayed.
    }
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisCommonTypes.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
*/ __turbopack_context__.s([
    "AXIS_TYPES",
    ()=>AXIS_TYPES
]);
var AXIS_TYPES = {
    value: 1,
    category: 1,
    time: 1,
    log: 1
};
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisDefault.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/tokens.js [app-ssr] (ecmascript)");
;
;
var defaultOption = {
    show: true,
    // zlevel: 0,
    z: 0,
    // Inverse the axis.
    inverse: false,
    // Axis name displayed.
    name: '',
    // 'start' | 'middle' | 'end'
    nameLocation: 'end',
    // By degree. By default auto rotate by nameLocation.
    nameRotate: null,
    nameTruncate: {
        maxWidth: null,
        ellipsis: '...',
        placeholder: '.'
    },
    // Use global text style by default.
    nameTextStyle: {
    },
    // The gap between axisName and axisLine.
    nameGap: 15,
    // Default `false` to support tooltip.
    silent: false,
    // Default `false` to avoid legacy user event listener fail.
    triggerEvent: false,
    tooltip: {
        show: false
    },
    axisPointer: {},
    axisLine: {
        show: true,
        onZero: 'auto',
        onZeroAxisIndex: null,
        lineStyle: {
            color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].color.axisLine,
            width: 1,
            type: 'solid'
        },
        // The arrow at both ends the the axis.
        symbol: [
            'none',
            'none'
        ],
        symbolSize: [
            10,
            15
        ],
        breakLine: true
    },
    axisTick: {
        show: true,
        // Whether axisTick is inside the grid or outside the grid.
        inside: false,
        // The length of axisTick.
        length: 5,
        lineStyle: {
            width: 1
        }
    },
    axisLabel: {
        show: true,
        // Whether axisLabel is inside the grid or outside the grid.
        inside: false,
        rotate: 0,
        // true | false | null/undefined (auto)
        showMinLabel: null,
        // true | false | null/undefined (auto)
        showMaxLabel: null,
        margin: 8,
        // formatter: null,
        fontSize: 12,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].color.axisLabel,
        // In scenarios like axis labels, when labels text's progression direction matches the label
        // layout direction (e.g., when all letters are in a single line), extra start/end margin is
        // needed to prevent the text from appearing visually joined. In the other case, when lables
        // are stacked (e.g., having rotation or horizontal labels on yAxis), the layout needs to be
        // compact, so NO extra top/bottom margin should be applied.
        textMargin: [
            0,
            3
        ]
    },
    splitLine: {
        show: true,
        showMinLine: true,
        showMaxLine: true,
        lineStyle: {
            color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].color.axisSplitLine,
            width: 1,
            type: 'solid'
        }
    },
    splitArea: {
        show: false,
        areaStyle: {
            color: [
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].color.backgroundTint,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].color.backgroundTransparent
            ]
        }
    },
    breakArea: {
        show: true,
        itemStyle: {
            color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].color.neutral00,
            // Break border color should be darker than the splitLine
            // because it has opacity and should be more prominent
            borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].color.border,
            borderWidth: 1,
            borderType: [
                3,
                3
            ],
            opacity: 0.6
        },
        zigzagAmplitude: 4,
        zigzagMinSpan: 4,
        zigzagMaxSpan: 20,
        zigzagZ: 100,
        expandOnClick: true
    },
    breakLabelLayout: {
        moveOverlap: 'auto'
    }
};
var categoryAxis = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["merge"]({
    // The gap at both ends of the axis. For categoryAxis, boolean.
    boundaryGap: true,
    // Set false to faster category collection.
    deduplication: null,
    jitter: 0,
    jitterOverlap: true,
    jitterMargin: 2,
    // splitArea: {
    // show: false
    // },
    splitLine: {
        show: false
    },
    axisTick: {
        // If tick is align with label when boundaryGap is true
        alignWithLabel: false,
        interval: 'auto',
        show: 'auto'
    },
    axisLabel: {
        interval: 'auto'
    }
}, defaultOption);
var valueAxis = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["merge"]({
    boundaryGap: [
        0,
        0
    ],
    axisLine: {
        // Not shown when other axis is categoryAxis in cartesian
        show: 'auto'
    },
    axisTick: {
        // Not shown when other axis is categoryAxis in cartesian
        show: 'auto'
    },
    // TODO
    // min/max: [30, datamin, 60] or [20, datamin] or [datamin, 60]
    splitNumber: 5,
    minorTick: {
        // Minor tick, not available for cateogry axis.
        show: false,
        // Split number of minor ticks. The value should be in range of (0, 100)
        splitNumber: 5,
        // Length of minor tick
        length: 3,
        // Line style
        lineStyle: {
        }
    },
    minorSplitLine: {
        show: false,
        lineStyle: {
            color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].color.axisMinorSplitLine,
            width: 1
        }
    }
}, defaultOption);
var timeAxis = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["merge"]({
    splitNumber: 6,
    axisLabel: {
        // The default value of TimeScale is determined in `AxisBuilder`
        // showMinLabel: false,
        // showMaxLabel: false,
        rich: {
            primary: {
                fontWeight: 'bold'
            }
        }
    },
    splitLine: {
        show: false
    }
}, valueAxis);
var logAxis = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaults"]({
    logBase: 10
}, valueAxis);
const __TURBOPACK__default__export__ = {
    category: categoryAxis,
    value: valueAxis,
    time: timeAxis,
    log: logAxis
};
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisHelper.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SCALE_VALUE_POSITION_KIND_EDGE",
    ()=>SCALE_VALUE_POSITION_KIND_EDGE,
    "SCALE_VALUE_POSITION_KIND_INSIDE",
    ()=>SCALE_VALUE_POSITION_KIND_INSIDE,
    "SCALE_VALUE_POSITION_KIND_OUTSIDE",
    ()=>SCALE_VALUE_POSITION_KIND_OUTSIDE,
    "createScaleByModel",
    ()=>createScaleByModel,
    "determineAxisType",
    ()=>determineAxisType,
    "discourageOnAxisZero",
    ()=>discourageOnAxisZero,
    "getAxisRawValue",
    ()=>getAxisRawValue,
    "getDataDimensionsOnAxis",
    ()=>getDataDimensionsOnAxis,
    "getOptionCategoryInterval",
    ()=>getOptionCategoryInterval,
    "getScaleValuePositionKind",
    ()=>getScaleValuePositionKind,
    "getTickValueOutermost",
    ()=>getTickValueOutermost,
    "isAxisOnBand",
    ()=>isAxisOnBand,
    "isNameLocationCenter",
    ()=>isNameLocationCenter,
    "isOnAxisZeroDiscouraged",
    ()=>isOnAxisZeroDiscouraged,
    "makeLabelFormatter",
    ()=>makeLabelFormatter,
    "retrieveAxisBreaksOption",
    ()=>retrieveAxisBreaksOption,
    "shouldAxisShow",
    ()=>shouldAxisShow,
    "shouldShowAllLabels",
    ()=>shouldShowAllLabels,
    "updateIntervalOrLogScaleForNiceOrAligned",
    ()=>updateIntervalOrLogScaleForNiceOrAligned
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Ordinal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/Ordinal.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Interval$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/Interval.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Scale$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/Scale.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Time$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/Time.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/Log.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisCommonTypes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisCommonTypes.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataStackHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/dataStackHelper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/time.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/break.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/helper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/scaleMapper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Component.js [app-ssr] (ecmascript)");
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
var axisInner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeInner"])();
function determineAxisType(model) {
    var type = model.get('type');
    if (// In ec option, `xxxAxis.type` may be undefined.
    type == null || !__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasOwn"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisCommonTypes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AXIS_TYPES"], type) && !__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Scale$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getClass(type)) {
        type = 'value';
    }
    return type;
}
function createScaleByModel(model, type, coordSysSupportAxisBreaks) {
    var breakHelper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getScaleBreakHelper"])();
    var breakOption;
    if (breakHelper) {
        breakOption = retrieveAxisBreaksOption(model, type, coordSysSupportAxisBreaks);
    }
    switch(type){
        case 'category':
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Ordinal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]({
                ordinalMeta: model.getOrdinalMeta ? model.getOrdinalMeta() : model.getCategories(),
                extent: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initExtentForUnion"])()
            });
        case 'time':
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Time$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]({
                locale: model.ecModel.getLocaleModel(),
                useUTC: model.ecModel.get('useUTC'),
                breakOption: breakOption
            });
        case 'log':
            // See also #3749
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]({
                logBase: model.get('logBase'),
                breakOption: breakOption
            });
        case 'value':
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Interval$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]({
                breakOption: breakOption
            });
        default:
            // case others.
            return new (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Scale$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getClass(type) || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Interval$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({});
    }
}
function getScaleValuePositionKind(scale, value, considerMappingExtent) {
    var dataExtent = considerMappingExtent ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getScaleExtentForMappingUnsafe"])(scale, null) : scale.getExtentUnsafe(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SCALE_EXTENT_KIND_EFFECTIVE"], null);
    var min = dataExtent[0];
    var max = dataExtent[1];
    return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidBoundsForExtent"])(min, max) ? SCALE_VALUE_POSITION_KIND_OUTSIDE : min === value || max === value ? SCALE_VALUE_POSITION_KIND_EDGE : min < value && max > value ? SCALE_VALUE_POSITION_KIND_INSIDE : SCALE_VALUE_POSITION_KIND_OUTSIDE;
}
var SCALE_VALUE_POSITION_KIND_INSIDE = 1;
var SCALE_VALUE_POSITION_KIND_EDGE = 2;
var SCALE_VALUE_POSITION_KIND_OUTSIDE = 3;
function discourageOnAxisZero(axis) {
    axisInner(axis).noOnMyZero = true;
}
function isOnAxisZeroDiscouraged(axis) {
    return axisInner(axis).noOnMyZero;
}
function makeLabelFormatter(axis) {
    var labelFormatter = axis.getLabelModel().get('formatter');
    if (axis.type === 'time') {
        var parsed_1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseTimeAxisLabelFormatter"])(labelFormatter);
        return function(tick, idx) {
            return axis.scale.getFormattedLabel(tick, idx, parsed_1);
        };
    } else if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"](labelFormatter)) {
        return function(tick) {
            // For category axis, get raw value; for numeric axis,
            // get formatted label like '1,333,444'.
            var label = axis.scale.getLabel(tick);
            var text = labelFormatter.replace('{value}', label != null ? label : '');
            return text;
        };
    } else if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"](labelFormatter)) {
        if (axis.type === 'category') {
            return function(tick, idx) {
                // The original intention of `idx` is "the index of the tick in all ticks".
                // But the previous implementation of category axis do not consider the
                // `axisLabel.interval`, which cause that, for example, the `interval` is
                // `1`, then the ticks "name5", "name7", "name9" are displayed, where the
                // corresponding `idx` are `0`, `2`, `4`, but not `0`, `1`, `2`. So we keep
                // the definition here for back compatibility.
                return labelFormatter(getAxisRawValue(axis, tick), tick.value - axis.scale.getExtent()[0], null // Using `null` just for backward compat.
                );
            };
        }
        var scaleBreakHelper_1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getScaleBreakHelper"])();
        return function(tick, idx) {
            // Using `null` just for backward compat. It's been found that in the `test/axis-customTicks.html`,
            // there is a formatter `function (value, index, revers = true) { ... }`. Although the third param
            // `revers` is incorrect and always `null`, changing it might introduce a breaking change.
            var extra = null;
            if (scaleBreakHelper_1) {
                extra = scaleBreakHelper_1.makeAxisLabelFormatterParamBreak(extra, tick["break"]);
            }
            return labelFormatter(getAxisRawValue(axis, tick), idx, extra);
        };
    } else {
        return function(tick) {
            return axis.scale.getLabel(tick);
        };
    }
}
function getAxisRawValue(axis, tick) {
    // In category axis with data zoom, tick is not the original
    // index of axis.data. So tick should not be exposed to user
    // in category axis.
    var scale = axis.scale;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOrdinalScale"])(scale) ? scale.getLabel(tick) : tick.value;
}
function getOptionCategoryInterval(model) {
    var interval = model.get('interval');
    return interval == null ? 'auto' : interval;
}
function shouldShowAllLabels(axis) {
    return axis.type === 'category' && getOptionCategoryInterval(axis.getLabelModel()) === 0;
}
function getDataDimensionsOnAxis(data, axisDim) {
    // Remove duplicated dat dimensions caused by `getStackedDimension`.
    var dataDimMap = {};
    // Currently `mapDimensionsAll` will contain stack result dimension ('__\0ecstackresult').
    // PENDING: is it reasonable? Do we need to remove the original dim from "coord dim" since
    // there has been stacked result dim?
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](data.mapDimensionsAll(axisDim), function(dataDim) {
        // For example, the extent of the original dimension
        // is [0.1, 0.5], the extent of the `stackResultDimension`
        // is [7, 9], the final extent should NOT include [0.1, 0.5],
        // because there is no graphic corresponding to [0.1, 0.5].
        // See the case in `test/area-stack.html` `main1`, where area line
        // stack needs `yAxis` not start from 0.
        dataDimMap[(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataStackHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStackedDimension"])(data, dataDim)] = true;
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keys"](dataDimMap);
}
function isNameLocationCenter(nameLocation) {
    return nameLocation === 'middle' || nameLocation === 'center';
}
function shouldAxisShow(axisModel) {
    return axisModel.getShallow('show');
}
function retrieveAxisBreaksOption(model, axisType, coordSysSupportAxisBreaks) {
    var option = model.get('breaks', true);
    if (option != null) {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getScaleBreakHelper"])()) {
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["error"])('Must `import {AxisBreak} from "echarts/features.js"; use(AxisBreak);` first if using breaks option.');
            }
            return undefined;
        }
        if (!coordSysSupportAxisBreaks || !isAxisTypeSupportAxisBreak(axisType)) {
            if ("TURBOPACK compile-time truthy", 1) {
                // Users have provided `breaks` in ec option but not supported.
                var axisInfo = model instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"] ? " " + model.type + "[" + model.componentIndex + "]" : '';
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["error"])("Axis" + axisInfo + " does not support break.");
            }
            return undefined;
        }
        return option;
    }
}
function isAxisTypeSupportAxisBreak(axisType) {
    return axisType !== 'category';
}
function updateIntervalOrLogScaleForNiceOrAligned(scale, fixMinMax, oldIntervalExtent, newIntervalExtent, oldOutermostExtent, cfg) {
    var isTargetLogScale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isLogScale"])(scale);
    var intervalStub = isTargetLogScale ? scale.intervalStub : scale;
    intervalStub.setExtent(newIntervalExtent[0], newIntervalExtent[1]);
    if (isTargetLogScale) {
        // Sync intervalStub extent to the outermost extent (i.e., `powStub` for `LogScale`).
        var powStub = scale.powStub;
        var opt = {
            depth: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SCALE_MAPPER_DEPTH_OUT_OF_BREAK"]
        };
        var minPow = scale.transformOut(newIntervalExtent[0], opt);
        var maxPow = scale.transformOut(newIntervalExtent[1], opt);
        // Log transform is probably not inversible by rounding error, which causes min/max tick may be
        // displayed as `5.999999999999999` unexpectedly when min/max are required to be fixed (specified
        // by users or by dataZoom). Therefore we set `powStub` with respect to `oldOutermostExtent` if
        // interval extent is not changed. But `intervalStub` should not be inversely changed by this
        // handling, otherwise its monotonicity between `niceExtent` and `extent` may be broken and cause
        // unexpected ticks generation.
        var extentChanged = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extentDiffers"])(oldIntervalExtent, newIntervalExtent);
        // NOTE: extent may still be changed even when min/max are required to be fixed,
        // e.g., by `intervalScaleEnsureValidExtent`.
        if (fixMinMax[0] && !extentChanged[0]) {
            minPow = oldOutermostExtent[0];
        }
        if (fixMinMax[1] && !extentChanged[1]) {
            maxPow = oldOutermostExtent[1];
        }
        powStub.setExtent(minPow, maxPow);
    }
    intervalStub.setConfig(cfg);
}
function getTickValueOutermost(scale, tick) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOrdinalScale"])(scale) ? scale.getRawOrdinalNumber(tick.value) : tick.value;
}
function isAxisOnBand(scale, axisModel) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOrdinalScale"])(scale) && !!axisModel.get('boundaryGap');
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisModelCommonMixin.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AxisModelCommonMixin",
    ()=>AxisModelCommonMixin
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
*/ // eslint-disable-next-line @typescript-eslint/no-unused-vars
var AxisModelCommonMixin = /** @class */ function() {
    function AxisModelCommonMixin() {}
    AxisModelCommonMixin.prototype.needIncludeZero = function() {
        return !this.option.scale;
    };
    /**
   * Should be implemented by each axis model if necessary.
   * @return coordinate system model
   */ AxisModelCommonMixin.prototype.getCoordSysModel = function() {
        return;
    };
    return AxisModelCommonMixin;
}();
;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisModelCreator.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>axisModelCreator
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.3.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisDefault$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisDefault.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/layout.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$OrdinalMeta$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/OrdinalMeta.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisCommonTypes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisCommonTypes.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$axis$2f$axisBreakHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/axis/axisBreakHelper.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
function axisModelCreator(registers, axisName, BaseAxisModelClass, extraDefaultOption) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisCommonTypes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AXIS_TYPES"], function(v, axisType) {
        var defaultOption = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["merge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["merge"])({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisDefault$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"][axisType], true), extraDefaultOption, true);
        var AxisModel = /** @class */ function(_super) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__extends"])(AxisModel, _super);
            function AxisModel() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.type = axisName + 'Axis.' + axisType;
                return _this;
            }
            AxisModel.prototype.mergeDefaultAndTheme = function(option, ecModel) {
                var layoutMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchLayoutMode"])(this);
                var inputPositionParams = layoutMode ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getLayoutParams"])(option) : {};
                var themeModel = ecModel.getTheme();
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["merge"])(option, themeModel.get(axisType + 'Axis'));
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["merge"])(option, this.getDefaultOption());
                option.type = getAxisType(option);
                if (layoutMode) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeLayoutParam"])(option, inputPositionParams, layoutMode);
                }
            };
            AxisModel.prototype.optionUpdated = function() {
                var thisOption = this.option;
                if (thisOption.type === 'category') {
                    this.__ordinalMeta = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$OrdinalMeta$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createByAxisModel(this);
                }
            };
            /**
       * Should not be called before all of 'getInitailData' finished.
       * Because categories are collected during initializing data.
       */ AxisModel.prototype.getCategories = function(rawData) {
                var option = this.option;
                // FIXME
                // warning if called before all of 'getInitailData' finished.
                if (option.type === 'category') {
                    if (rawData) {
                        // NOTICE: return the raw data even if not existing; never use a fallback like `[]`;
                        // Its existence matters in some legacy cases.
                        return option.data;
                    }
                    return this.__ordinalMeta.categories;
                }
            };
            AxisModel.prototype.getOrdinalMeta = function() {
                return this.__ordinalMeta;
            };
            AxisModel.prototype.updateAxisBreaks = function(payload) {
                var axisBreakHelper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$axis$2f$axisBreakHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAxisBreakHelper"])();
                return axisBreakHelper ? axisBreakHelper.updateModelAxisBreak(this, payload) : {
                    breaks: []
                };
            };
            AxisModel.type = axisName + 'Axis.' + axisType;
            AxisModel.defaultOption = defaultOption;
            return AxisModel;
        }(BaseAxisModelClass);
        registers.registerComponentModel(AxisModel);
    });
    registers.registerSubTypeDefaulter(axisName + 'Axis', getAxisType);
}
function getAxisType(option) {
    // Default axis with data is category axis
    return option.type || (option.data ? 'category' : 'value');
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisNiceTicks.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "scaleCalcNice",
    ()=>scaleCalcNice,
    "scaleCalcNice2",
    ()=>scaleCalcNice2,
    "scaleCalcNiceDirectly",
    ()=>scaleCalcNiceDirectly
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/helper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisHelper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Time$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/Time.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$scaleRawExtentInfo$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/scaleRawExtentInfo.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/scaleMapper.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
// ------ START: LinearIntervalScaleStub Nice ------
function calcNiceForIntervalOrLogScale(scale, opt) {
    // [CAVEAT]: If updating this impl, need to sync it to `axisAlignTicks.ts`.
    var isTargetLogScale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isLogScale"])(scale);
    var intervalStub = isTargetLogScale ? scale.intervalStub : scale;
    var fixMinMax = opt.fixMinMax || [];
    var oldOutermostExtent = isTargetLogScale ? scale.getExtent() : null;
    var oldIntervalExtent = intervalStub.getExtent();
    var newIntervalExtent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["intervalScaleEnsureValidExtent"])(oldIntervalExtent, fixMinMax, opt.rawExtentResult);
    intervalStub.setExtent(newIntervalExtent[0], newIntervalExtent[1]);
    newIntervalExtent = intervalStub.getExtent();
    var config = isTargetLogScale ? logScaleCalcNiceTicks(intervalStub, opt) : intervalScaleCalcNiceTicks(intervalStub, opt);
    var autoIntervalPrecision = config.intervalPrecision;
    var autoInterval = config.interval;
    // When auto calculated interval is not preferable, users are allowed to explicity specify
    // `interval`, `min`, `max` to customize the axis. A typical case is, in angle axis with angle
    // 0 - 360, where the internally calculated interval is not 60-based.
    // NOTICE:
    //  - In `xxxAxis.type: 'log'`, ec option `xxxAxis.interval` requires a logarithm-applied
    //    value rather than a value in the raw scale.
    //  - Follow the historical behavior:
    //    - even `interval` is specified, the scale extent is still expanded based on the auto-calculated
    //      interval.
    //    - No validation to the specified `interval`.
    var userInterval = opt.userInterval;
    if (userInterval != null) {
        config.interval = userInterval;
        config.intervalPrecision = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getIntervalPrecision"])(userInterval);
    }
    if (!fixMinMax[0]) {
        newIntervalExtent[0] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["round"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathFloor"])(newIntervalExtent[0] / autoInterval) * autoInterval, autoIntervalPrecision);
    }
    if (!fixMinMax[1]) {
        newIntervalExtent[1] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["round"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathCeil"])(newIntervalExtent[1] / autoInterval) * autoInterval, autoIntervalPrecision);
    }
    if (userInterval != null) {
        // Historical behavior.
        config.niceExtent = newIntervalExtent.slice();
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateIntervalOrLogScaleForNiceOrAligned"])(scale, fixMinMax, oldIntervalExtent, newIntervalExtent, oldOutermostExtent, config);
}
// ------ END: LinearIntervalScaleStub Nice ------
// ------ START: IntervalScale Nice ------
function intervalScaleCalcNiceTicks(scale, opt) {
    var splitNumber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ensureValidSplitNumber"])(opt.splitNumber, 5);
    // Use the span in the innermost linear space to calculate nice ticks.
    var span = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getScaleLinearSpanEffective"])(scale);
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(isFinite(span) && span > 0); // It should have been ensured by `intervalScaleEnsureValidExtent`.
    }
    var minInterval = opt.minInterval;
    var maxInterval = opt.maxInterval;
    var interval = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nice"])(span / splitNumber, true);
    if (minInterval != null && interval < minInterval) {
        interval = minInterval;
    }
    if (maxInterval != null && interval > maxInterval) {
        interval = maxInterval;
    }
    var intervalPrecision = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getIntervalPrecision"])(interval);
    var extent = scale.getExtent();
    // By design, the `niceExtent` is inside the original extent
    var niceExtent = [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["round"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathCeil"])(extent[0] / interval) * interval, intervalPrecision),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["round"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathFloor"])(extent[1] / interval) * interval, intervalPrecision)
    ];
    return {
        interval: interval,
        intervalPrecision: intervalPrecision,
        niceExtent: niceExtent
    };
}
;
// ------ END: IntervalScale Nice ------
// ------ START: LogScale Nice ------
function logScaleCalcNiceTicks(intervalStub, opt) {
    // [CAVEAT]: If updating this impl, need to sync it to `axisAlignTicks.ts`.
    var splitNumber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ensureValidSplitNumber"])(opt.splitNumber, 10);
    // Find nice ticks in the "logarithmic space". Notice that "logarithmic space" is a middle space
    // rather than the innermost linear space when axis breaks exist.
    var intervalExtent = intervalStub.getExtent();
    // But use the span in the innermost linear space to calculate nice ticks.
    var span = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getScaleLinearSpanEffective"])(intervalStub);
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(isFinite(span) && span > 0); // It should be ensured by `intervalScaleEnsureValidExtent`.
    }
    // Interval should be integer
    var interval = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathMax"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["quantity"])(span), 1);
    var err = splitNumber / span * interval;
    // Filter ticks to get closer to the desired count.
    if (err <= 0.5) {
        // TODO: support other bases other than 10?
        interval *= 10;
    }
    var intervalPrecision = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getIntervalPrecision"])(interval);
    // For LogScale, we use a `niceExtent` in the "logarithmic space" rather than
    // the original "pow space", because it is used in `intervalStub.getTicks()` thereafter.
    var niceExtent = [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["round"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathCeil"])(intervalExtent[0] / interval) * interval, intervalPrecision),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["round"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathFloor"])(intervalExtent[1] / interval) * interval, intervalPrecision)
    ];
    return {
        intervalPrecision: intervalPrecision,
        interval: interval,
        niceExtent: niceExtent
    };
}
;
function scaleCalcNice(axisLike) {
    var scale = axisLike.scale;
    var model = axisLike.model;
    var axis = model.axis;
    var ecModel = model.ecModel;
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(axis && ecModel);
    }
    scaleCalcNice2(scale, model, axis, ecModel, null);
}
function scaleCalcNice2(scale, model, // Some call from external source, such as echarts-gl, may have no `axis` and `ecModel`,
// but has `externalDataExtent`.
axis, ecModel, externalDataExtent) {
    var rawExtentResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$scaleRawExtentInfo$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["adoptScaleRawExtentInfoAndPrepare"])(scale, model, ecModel, axis, externalDataExtent);
    var isIntervalOrTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isIntervalScale"])(scale) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTimeScale"])(scale);
    scaleCalcNiceDirectly(scale, {
        splitNumber: model.get('splitNumber'),
        fixMinMax: rawExtentResult.fixMM,
        userInterval: model.get('interval'),
        minInterval: isIntervalOrTime ? model.get('minInterval') : null,
        maxInterval: isIntervalOrTime ? model.get('maxInterval') : null,
        rawExtentResult: rawExtentResult
    });
    if (axis && ecModel) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$scaleRawExtentInfo$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["adoptScaleExtentKindMapping"])(axis, scale, rawExtentResult, ecModel);
    }
    if ("TURBOPACK compile-time truthy", 1) {
        scale.freeze();
    }
}
function scaleCalcNiceDirectly(scale, opt) {
    scaleCalcNiceMethods[scale.type](scale, opt);
}
var scaleCalcNiceMethods = {
    interval: calcNiceForIntervalOrLogScale,
    log: calcNiceForIntervalOrLogScale,
    time: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Time$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calcNiceForTimeScale"],
    ordinal: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"]
}; // ------ END: scaleCalcNice Entry ------
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisStatistics.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AXIS_STAT_KEY_DELIMITER",
    ()=>AXIS_STAT_KEY_DELIMITER,
    "LINEAR_POSITIVE_MIN_GAP_NO_VALID_VALUE",
    ()=>LINEAR_POSITIVE_MIN_GAP_NO_VALID_VALUE,
    "LINEAR_POSITIVE_MIN_GAP_SINGLE_VALID_VALUE",
    ()=>LINEAR_POSITIVE_MIN_GAP_SINGLE_VALID_VALUE,
    "associateSeriesWithAxis",
    ()=>associateSeriesWithAxis,
    "countSeriesOnAxisOnKey",
    ()=>countSeriesOnAxisOnKey,
    "eachAxisOnKey",
    ()=>eachAxisOnKey,
    "eachKeyOnAxis",
    ()=>eachKeyOnAxis,
    "eachSeriesDealForAxisStat",
    ()=>eachSeriesDealForAxisStat,
    "eachSeriesOnAxis",
    ()=>eachSeriesOnAxis,
    "eachSeriesOnAxisOnKey",
    ()=>eachSeriesOnAxisOnKey,
    "getAxisStat",
    ()=>getAxisStat,
    "getAxisStatBySeries",
    ()=>getAxisStatBySeries,
    "registerMetricImpl",
    ()=>registerMetricImpl,
    "requireAxisStatistics",
    ()=>requireAxisStatistics
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$cycleCache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/cycleCache.js [app-ssr] (ecmascript)");
;
;
;
var callOnlyOnce = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeCallOnlyOnce"])();
var AXIS_STAT_KEY_DELIMITER = '|&';
var ecModelCacheFullUpdateInner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeInner"])();
var LINEAR_POSITIVE_MIN_GAP_SINGLE_VALID_VALUE = -2;
var LINEAR_POSITIVE_MIN_GAP_NO_VALID_VALUE = -1;
var ecModelCachePrepareInner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeInner"])();
var validateInputAxis;
if ("TURBOPACK compile-time truthy", 1) {
    validateInputAxis = function(axis) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(axis && axis.model && axis.model.uid && axis.model.ecModel);
    };
}
function getAxisStatPerKeyPerAxis(axis, axisStatKey) {
    var axisModel = axis.model;
    var keyed = ecModelCacheFullUpdateInner((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$cycleCache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCachePerECFullUpdate"])(axisModel.ecModel)).keyed;
    var perKey = keyed && keyed.get(axisStatKey);
    return perKey && perKey.get(axisModel.uid);
}
function getAxisStat(axis, axisStatKey) {
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(axisStatKey != null);
        validateInputAxis(axis);
    }
    return wrapStatResult(getAxisStatPerKeyPerAxis(axis, axisStatKey));
}
function getAxisStatBySeries(axis, seriesList) {
    if ("TURBOPACK compile-time truthy", 1) {
        validateInputAxis(axis);
    }
    var result = [];
    eachKeyEachAxis(axis.model.ecModel, function(perKeyPerAxis) {
        for(var idx = 0; idx < seriesList.length; idx++){
            if (seriesList[idx] && perKeyPerAxis.serByIdx[seriesList[idx].seriesIndex]) {
                result.push(wrapStatResult(perKeyPerAxis));
            }
        }
    });
    return result;
}
function eachKeyEachAxis(ecModel, cb) {
    var keyed = ecModelCacheFullUpdateInner((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$cycleCache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCachePerECFullUpdate"])(ecModel)).keyed;
    keyed && keyed.each(function(perKey, axisStatKey) {
        perKey.each(function(perKeyPerAxis, axisModelUid) {
            cb(perKeyPerAxis, axisStatKey, axisModelUid);
        });
    });
}
function wrapStatResult(record) {
    return {
        liPosMinGap: record ? record.liPosMinGap : undefined
    };
}
function eachSeriesOnAxis(axis, cb) {
    if ("TURBOPACK compile-time truthy", 1) {
        validateInputAxis(axis);
    }
    var ecModel = axis.model.ecModel;
    var seriesOnAxisMap = ecModelCacheFullUpdateInner((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$cycleCache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCachePerECFullUpdate"])(ecModel)).axSer;
    seriesOnAxisMap && eachSeriesDealForAxisStat(ecModel, seriesOnAxisMap.get(axis.model.uid), cb);
}
function eachSeriesOnAxisOnKey(axis, axisStatKey, cb) {
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(axisStatKey != null);
        validateInputAxis(axis);
    }
    var perKeyPerAxis = getAxisStatPerKeyPerAxis(axis, axisStatKey);
    perKeyPerAxis && eachSeriesDealForAxisStat(axis.model.ecModel, perKeyPerAxis.sers, cb);
}
function eachSeriesDealForAxisStat(ecModel, seriesList, cb) {
    if (!seriesList) {
        return;
    }
    for(var i = 0; i < seriesList.length; i++){
        var seriesModel = seriesList[i];
        // Legend-filtered series need to be ignored since series are registered before `legendFilter`.
        if (!ecModel.isSeriesFiltered(seriesModel)) {
            cb(seriesModel);
        }
    }
}
function countSeriesOnAxisOnKey(axis, axisStatKey) {
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(axisStatKey != null);
        validateInputAxis(axis);
    }
    var perKeyPerAxis = getAxisStatPerKeyPerAxis(axis, axisStatKey);
    if (!perKeyPerAxis || !perKeyPerAxis.sers.length) {
        return 0;
    }
    var count = 0;
    eachSeriesDealForAxisStat(axis.model.ecModel, perKeyPerAxis.sers, function() {
        count++;
    });
    return count;
}
function eachAxisOnKey(ecModel, axisStatKey, cb) {
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(axisStatKey != null);
    }
    var keyed = ecModelCacheFullUpdateInner((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$cycleCache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCachePerECFullUpdate"])(ecModel)).keyed;
    var perKey = keyed && keyed.get(axisStatKey);
    perKey && perKey.each(function(perKeyPerAxis) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(perKeyPerAxis.sers.length > 0); // This is to avoid irrelevant axes to enter `cb`.
        }
        cb(perKeyPerAxis.axis);
    });
}
function eachKeyOnAxis(axis, cb) {
    if ("TURBOPACK compile-time truthy", 1) {
        validateInputAxis(axis);
    }
    var model = axis.model;
    var keysByAxisModelUid = ecModelCacheFullUpdateInner((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$cycleCache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCachePerECFullUpdate"])(model.ecModel)).keys;
    keysByAxisModelUid && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(keysByAxisModelUid.get(model.uid), function(axisStatKey) {
        if ("TURBOPACK compile-time truthy", 1) {
            var stat = getAxisStatPerKeyPerAxis(axis, axisStatKey);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(stat && stat.sers.length > 0); // This is to avoid irrelevant `AxisStatKey` to enter `cb`.
        }
        cb(axisStatKey);
    });
}
/**
 * NOTICE: this processor may be omitted - it is registered only if required.
 */ function performAxisStatisticsOnOverallReset(ecModel) {
    var ecPrepareCache = ecModelCachePrepareInner((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$cycleCache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCachePerECPrepare"])(ecModel));
    var ecPrepareCacheKeyed = ecPrepareCache.keyed || (ecPrepareCache.keyed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])());
    eachKeyEachAxis(ecModel, function(perKeyPerAxis, axisStatKey, axisModelUid) {
        var ecPrepareCachePerKey = ecPrepareCacheKeyed.get(axisStatKey) || ecPrepareCacheKeyed.set(axisStatKey, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])());
        var ecPreparePerKeyPerAxis = ecPrepareCachePerKey.get(axisModelUid) || ecPrepareCachePerKey.set(axisModelUid, {});
        if (perKeyPerAxis.metrics.liPosMinGap) {
            // We should assert the impl exists -- fail-fast if missing `registerMetricImpl`.
            _metricImpl.liPosMinGap(ecModel, perKeyPerAxis, ecPreparePerKeyPerAxis);
        }
    });
}
function registerMetricImpl(metricType, impl) {
    _metricImpl[metricType] = impl;
}
var _metricImpl = {};
function associateSeriesWithAxis(axis, seriesModel, coordSysType) {
    if (!axis) {
        return;
    }
    var ecModel = seriesModel.ecModel;
    var ecFullUpdateCache = ecModelCacheFullUpdateInner((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$cycleCache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCachePerECFullUpdate"])(ecModel));
    var axisModelUid = axis.model.uid;
    if ("TURBOPACK compile-time truthy", 1) {
        validateInputAxis(axis);
        // - An axis can be associated with multiple `axisStatKey`s. For example, if `axisStatKey`s are
        //   "candlestick" and "bar", they can be associated with the same "xAxis".
        // - Within an individual axis, it is a typically incorrect usage if a <axis, series> pair is
        //   associated with multiple `perKeyPerAxis`, which may cause repeated calculation and
        //   performance degradation, had hard to be found without the checking below. For example, If
        //   `axisStatKey` are "grid-bar" (see `barGrid.ts`) and "polar-bar" (see `barPolar.ts`), and
        //   a <xAxis-series> pair is wrongly associated with both "polar-bar" and "grid-bar", the
        //   relevant statistics will be computed twice.
        var axSerPairCheck = ecFullUpdateCache.axSerPairCheck || (ecFullUpdateCache.axSerPairCheck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])());
        var pairKey = "" + axisModelUid + AXIS_STAT_KEY_DELIMITER + seriesModel.uid;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(!axSerPairCheck.get(pairKey));
        axSerPairCheck.set(pairKey, 1);
    }
    var seriesOnAxisMap = ecFullUpdateCache.axSer || (ecFullUpdateCache.axSer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])());
    var seriesListPerAxis = seriesOnAxisMap.get(axisModelUid) || seriesOnAxisMap.set(axisModelUid, []);
    if ("TURBOPACK compile-time truthy", 1) {
        var lastSeries = seriesListPerAxis[seriesListPerAxis.length - 1];
        if (lastSeries) {
            // Series order should respect to the input order, since it matters in some cases
            // (e.g., see `barGrid.ts` and `barPolar.ts` - ec option declaration order matters).
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(lastSeries.seriesIndex < seriesModel.seriesIndex);
        }
    }
    seriesListPerAxis.push(seriesModel);
    var seriesType = seriesModel.subType;
    var isBaseAxis = seriesModel.getBaseAxis() === axis;
    var client = clientsForLookup.get(makeClientLookupKey(seriesType, isBaseAxis, coordSysType)) || clientsForLookup.get(makeClientLookupKey(seriesType, isBaseAxis, null));
    if (!client) {
        return;
    }
    var keyed = ecFullUpdateCache.keyed || (ecFullUpdateCache.keyed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])());
    var keys = ecFullUpdateCache.keys || (ecFullUpdateCache.keys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])());
    var axisStatKey = client.key;
    var perKey = keyed.get(axisStatKey) || keyed.set(axisStatKey, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])());
    var perKeyPerAxis = perKey.get(axisModelUid);
    if (!perKeyPerAxis) {
        perKeyPerAxis = perKey.set(axisModelUid, {
            axis: axis,
            sers: [],
            serByIdx: []
        });
        // They should only be executed for each <key, axis> pair once:
        perKeyPerAxis.metrics = client.getMetrics(axis);
        (keys.get(axisModelUid) || keys.set(axisModelUid, [])).push(axisStatKey);
    }
    // series order should respect to the input order.
    perKeyPerAxis.sers.push(seriesModel);
    perKeyPerAxis.serByIdx[seriesModel.seriesIndex] = seriesModel;
}
/**
 * NOTE: Currently, the scenario is simple enough to look up clients by hash map.
 * Otherwise, a caller-provided `filter` may be an alternative if more complex requirements arise.
 */ function makeClientLookupKey(seriesType, isBaseAxis, coordSysType) {
    return seriesType + AXIS_STAT_KEY_DELIMITER + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(isBaseAxis, true) + AXIS_STAT_KEY_DELIMITER + (coordSysType || '');
}
function requireAxisStatistics(registers, client) {
    var clientKey = makeClientLookupKey(client.seriesType, client.baseAxis, client.coordSysType);
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(client.seriesType && client.key && !clientsForCheckingStatKey.get(client.key) && !clientsForLookup.get(clientKey)); // More checking is performed in `axSerPairCheck`.
        clientsForCheckingStatKey.set(client.key, 1);
    }
    clientsForLookup.set(clientKey, client);
    callOnlyOnce(registers, function() {
        registers.registerProcessor(registers.PRIORITY.PROCESSOR.AXIS_STATISTICS, {
            // NOTE: Theoretically, `appendData` requires `dirtyOnOverallProgress: true` here to re-calculate them.
            // But this OVERALL_STAGE_TASK is applied to all series (no `getTargetSeries` specified),
            // `dirtyOnOverallProgress: true` can cause irrelevant series (e.g., series on geo)
            // to be re-rendered when `appendData` is called, which cause `appendData` meaningless,
            // thereby not setting `dirtyOnOverallProgress: true`.
            overallReset: performAxisStatisticsOnOverallReset
        });
    });
}
var clientsForCheckingStatKey;
if ("TURBOPACK compile-time truthy", 1) {
    clientsForCheckingStatKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
}
var clientsForLookup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisStatisticsMetricsImpl.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "registerMetricImplLiPosMinGap",
    ()=>registerMetricImplLiPosMinGap
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataValueHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/dataValueHelper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$vendor$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/vendor.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisStatistics.js [app-ssr] (ecmascript)");
;
;
;
;
;
function registerMetricImplLiPosMinGap() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerMetricImpl"])('liPosMinGap', metricLiPosMinGapImpl);
}
function metricLiPosMinGapImpl(ecModel, perKeyPerAxis, ecPreparePerKeyPerAxis) {
    var newSerUids = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
    var ecPrepareSerUids = ecPreparePerKeyPerAxis.serUids;
    var ecPrepareLiPosMinGap = ecPreparePerKeyPerAxis.liPosMinGap;
    var ecPrepareCacheMiss;
    var axis = perKeyPerAxis.axis;
    var scale = axis.scale;
    // const linearValueExtent = initExtentForUnion();
    var needTransform = scale.needTransform();
    var filter = scale.getFilter ? scale.getFilter() : null;
    var filterParsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataValueHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseSanitizationFilter"])(filter);
    // const timeRetrieve: number[] = []; // _EC_PERF_
    // const timeSort: number[] = []; // _EC_PERF_
    // const timeAll: number[] = []; // _EC_PERF_
    // timeAll[0] = Date.now(); // _EC_PERF_
    function eachSeries(cb) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["eachSeriesDealForAxisStat"])(ecModel, perKeyPerAxis.sers, function(seriesModel) {
            var rawData = seriesModel.getRawData();
            // NOTE: Currently there is no series that a "base axis" can map to multiple dimensions.
            var dimStoreIdx = rawData.getDimensionIndex(rawData.mapDimension(axis.dim));
            if (dimStoreIdx >= 0) {
                cb(dimStoreIdx, seriesModel, rawData.getStore());
            }
        });
    }
    var bufferCapacity = 0;
    eachSeries(function(dimStoreIdx, seriesModel, rawDataStore) {
        newSerUids.set(seriesModel.uid, 1);
        if (!ecPrepareSerUids || !ecPrepareSerUids.hasKey(seriesModel.uid)) {
            ecPrepareCacheMiss = true;
        }
        bufferCapacity += rawDataStore.count();
    });
    if (!ecPrepareSerUids || ecPrepareSerUids.keys().length !== newSerUids.keys().length) {
        ecPrepareCacheMiss = true;
    }
    if (!ecPrepareCacheMiss && ecPrepareLiPosMinGap != null) {
        // Consider the fact in practice:
        //  - Series data can only be changed in EC_PREPARE.
        //  - The relationship between series and axes can only be changed in EC_PREPARE and
        //    SERIES_FILTER.
        //  (See EC_CYCLE for more info)
        // Therefore, some statistics results can be cached in `GlobalModelCachePerECPrepare` to avoid
        // repeated time-consuming calculation for large data (e.g., over 1e5 data items).
        perKeyPerAxis.liPosMinGap = ecPrepareLiPosMinGap;
        return;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$vendor$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tryEnsureTypedArray"])(tmpValueBuffer, bufferCapacity);
    // timeRetrieve[0] = Date.now(); // _EC_PERF_
    var writeIdx = 0;
    eachSeries(function(dimStoreIdx, seriesModel, store) {
        // NOTE: It appears to be optimized by traveling only in a specific window (e.g., the current window)
        // instead of the entire data, but that would likely generate inconsistent result and bring
        // jitter when dataZoom roaming.
        for(var i = 0, cnt = store.count(); i < cnt; ++i){
            // Manually inline some code for performance, since no other optimization
            // (such as, progressive) can be applied here.
            var val = store.get(dimStoreIdx, i);
            // NOTE: in most cases, filter does not exist.
            if (isFinite(val) && (!filter || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataValueHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["passesSanitizationFilter"])(filterParsed, val))) {
                if (needTransform) {
                    // PENDING: time-consuming if axis break is applied.
                    val = scale.transformIn(val, null);
                }
                tmpValueBuffer.arr[writeIdx++] = val;
            // val < linearValueExtent[0] && (linearValueExtent[0] = val);
            // val > linearValueExtent[1] && (linearValueExtent[1] = val);
            }
        }
    });
    // Indicatively, retrieving values above costs 40ms for 1e6 values in a certain platform.
    // timeRetrieve[1] = Date.now(); // _EC_PERF_
    var tmpValueBufferView = tmpValueBuffer.typed ? tmpValueBuffer.arr.subarray(0, writeIdx) : (tmpValueBuffer.arr.length = writeIdx, tmpValueBuffer.arr);
    // timeSort[0] = Date.now(); // _EC_PERF_
    // Sort axis values into ascending order to calculate gaps.
    if (tmpValueBuffer.typed) {
        // Indicatively, 5ms for 1e6 values in a certain platform.
        tmpValueBufferView.sort();
    } else {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asc"])(tmpValueBufferView);
    }
    // timeAll[1] = timeSort[1] = Date.now(); // _EC_PERF_
    // console.log('axisStatistics_minGap_retrieve', timeRetrieve[1] - timeRetrieve[0]); // _EC_PERF_
    // console.log('axisStatistics_minGap_sort', timeSort[1] - timeSort[0]); // _EC_PERF_
    // console.log('axisStatistics_minGap_all', timeAll[1] - timeAll[0]); // _EC_PERF_
    var min = Infinity;
    for(var j = 1; j < writeIdx; ++j){
        var delta = tmpValueBufferView[j] - tmpValueBufferView[j - 1];
        if (// - Different series normally have the same values (e.g., barA, barB, barC),
        //   which should be ignored.
        // - A single series with multiple same values is often not meaningful to
        //   create `bandWidth`, so it is also ignored.
        delta > 0 && delta < min) {
            min = delta;
        }
    }
    ecPreparePerKeyPerAxis.liPosMinGap = perKeyPerAxis.liPosMinGap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNullableNumberFinite"])(min) ? min : writeIdx > 0 ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LINEAR_POSITIVE_MIN_GAP_SINGLE_VALID_VALUE"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LINEAR_POSITIVE_MIN_GAP_NO_VALID_VALUE"];
    ecPreparePerKeyPerAxis.serUids = newSerUids;
}
// For performance optimization.
var tmpValueBuffer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$vendor$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tryEnsureTypedArray"])({
    ctor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$vendor$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float64ArrayCtor"]
}, 50 // An arbitrary initial capability.
);
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisTickLabelBuilder.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AxisTickLabelComputingKind",
    ()=>AxisTickLabelComputingKind,
    "calculateCategoryInterval",
    ()=>calculateCategoryInterval,
    "createAxisLabels",
    ()=>createAxisLabels,
    "createAxisLabelsComputingContext",
    ()=>createAxisLabelsComputingContext,
    "createAxisTicks",
    ()=>createAxisTicks
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$contain$2f$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/contain/text.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisHelper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/helper.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
var modelInner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeInner"])();
var axisInner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeInner"])();
var AxisTickLabelComputingKind = {
    estimate: 1,
    determine: 2
};
function createAxisLabelsComputingContext(kind) {
    return {
        out: {
            noPxChangeTryDetermine: []
        },
        kind: kind
    };
}
function createAxisLabels(axis, ctx) {
    var custom = axis.getLabelModel().get('customValues');
    if (custom) {
        var scale_1 = axis.scale;
        return {
            labels: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"](parseTickLabelCustomValues(custom, scale_1), function(tick, index) {
                return {
                    formattedLabel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLabelFormatter"])(axis)(tick, index),
                    rawLabel: scale_1.getLabel(tick),
                    tick: tick
                };
            })
        };
    }
    // Only ordinal scale support tick interval
    return axis.type === 'category' ? makeCategoryLabels(axis, ctx) : makeRealNumberLabels(axis);
}
function createAxisTicks(axis, tickModel, opt) {
    var scale = axis.scale;
    var custom = axis.getTickModel().get('customValues');
    if (custom) {
        return {
            ticks: parseTickLabelCustomValues(custom, scale)
        };
    }
    // Only ordinal scale support tick interval
    return axis.type === 'category' ? makeCategoryTicks(axis, tickModel) : {
        ticks: scale.getTicks(opt)
    };
}
function parseTickLabelCustomValues(customValues, scale) {
    var extent = scale.getExtent();
    var tickNumbers = [];
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](customValues, function(val) {
        val = scale.parse(val);
        if (val >= extent[0] && val <= extent[1]) {
            tickNumbers.push(val);
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removeDuplicates"])(tickNumbers, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removeDuplicatesGetKeyFromItemItself"], null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asc"])(tickNumbers);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"](tickNumbers, function(tickVal) {
        return {
            value: tickVal
        };
    });
}
function makeCategoryLabels(axis, ctx) {
    var labelModel = axis.getLabelModel();
    var result = makeCategoryLabelsActually(axis, labelModel, ctx);
    return !labelModel.get('show') || axis.scale.isBlank() ? {
        labels: []
    } : result;
}
function makeCategoryLabelsActually(axis, labelModel, ctx) {
    var labelsCache = ensureCategoryLabelCache(axis);
    var optionLabelInterval = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getOptionCategoryInterval"])(labelModel);
    var isEstimate = ctx.kind === AxisTickLabelComputingKind.estimate;
    // In AxisTickLabelComputingKind.estimate, the result likely varies during a single
    // pass of ec main process,due to the change of axisExtent, and will not be shared with
    // splitLine. Therefore no cache is used.
    if (!isEstimate) {
        // PENDING: check necessary?
        var result_1 = axisCacheGet(labelsCache, optionLabelInterval);
        if (result_1) {
            return result_1;
        }
    }
    var labels;
    var numericLabelInterval;
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"](optionLabelInterval)) {
        labels = makeTicksLabelsByCategoryIntervalNumOrCb(axis, optionLabelInterval, false);
    } else {
        numericLabelInterval = optionLabelInterval === 'auto' ? makeAutoCategoryInterval(axis, ctx) : optionLabelInterval;
        labels = makeTicksLabelsByCategoryIntervalNumOrCb(axis, numericLabelInterval, false);
    }
    var result = {
        labels: labels,
        labelCategoryInterval: numericLabelInterval
    };
    if (!isEstimate) {
        axisCacheSet(labelsCache, optionLabelInterval, result);
    } else {
        ctx.out.noPxChangeTryDetermine.push(function() {
            axisCacheSet(labelsCache, optionLabelInterval, result);
            return true;
        });
    }
    return result;
}
function makeCategoryTicks(axis, tickModel) {
    var ticksCache = ensureCategoryTickCache(axis);
    var optionTickInterval = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getOptionCategoryInterval"])(tickModel);
    var result = axisCacheGet(ticksCache, optionTickInterval);
    if (result) {
        return result;
    }
    var ticks;
    var tickCategoryInterval;
    // Optimize for the case that large category data and no label displayed,
    // we should not return all ticks.
    if (!tickModel.get('show') || axis.scale.isBlank()) {
        ticks = [];
    }
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"](optionTickInterval)) {
        ticks = makeTicksLabelsByCategoryIntervalNumOrCb(axis, optionTickInterval, true);
    } else if (optionTickInterval === 'auto') {
        var labelsResult = makeCategoryLabelsActually(axis, axis.getLabelModel(), createAxisLabelsComputingContext(AxisTickLabelComputingKind.determine));
        tickCategoryInterval = labelsResult.labelCategoryInterval;
        ticks = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"](labelsResult.labels, function(labelItem) {
            return labelItem.tick;
        });
    } else {
        tickCategoryInterval = optionTickInterval;
        ticks = makeTicksLabelsByCategoryIntervalNumOrCb(axis, tickCategoryInterval, true);
    }
    // Cache to avoid calling interval function repeatedly.
    return axisCacheSet(ticksCache, optionTickInterval, {
        ticks: ticks,
        tickCategoryInterval: tickCategoryInterval
    });
}
function makeRealNumberLabels(axis) {
    var ticks = axis.scale.getTicks();
    var labelFormatter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLabelFormatter"])(axis);
    return {
        labels: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"](ticks, function(tick, idx) {
            return {
                formattedLabel: labelFormatter(tick, idx),
                rawLabel: axis.scale.getLabel(tick),
                tick: tick
            };
        })
    };
}
// Large category data calculation is performance sensitive, and ticks and label probably will
// be fetched multiple times (e.g. shared by splitLine and axisTick). So we cache the result.
// axis is created each time during a ec process, so we do not need to clear cache.
var ensureCategoryTickCache = initAxisCacheMethod('axisTick');
var ensureCategoryLabelCache = initAxisCacheMethod('axisLabel');
/**
 * PENDING: refactor to JS Map? Because key can be a function or more complicated object, and
 * cache size always is small, and currently no JS Map object key polyfill, we use a simple
 * array cache instead of plain object hash.
 */ function initAxisCacheMethod(prop) {
    return function ensureCache(axis) {
        return axisInner(axis)[prop] || (axisInner(axis)[prop] = {
            list: []
        });
    };
}
function axisCacheGet(cache, key) {
    for(var i = 0; i < cache.list.length; i++){
        if (cache.list[i].key === key) {
            return cache.list[i].value;
        }
    }
}
function axisCacheSet(cache, key, value) {
    cache.list.push({
        key: key,
        value: value
    });
    return value;
}
function makeAutoCategoryInterval(axis, ctx) {
    if (ctx.kind === AxisTickLabelComputingKind.estimate) {
        // Currently axisTick is not involved in estimate kind, and the result likely varies during a
        // single pass of ec main process, due to the change of axisExtent. Therefore no cache is used.
        var result_2 = axis.calculateCategoryInterval(ctx);
        ctx.out.noPxChangeTryDetermine.push(function() {
            axisInner(axis).autoInterval = result_2;
            return true;
        });
        return result_2;
    }
    // Both tick and label uses this result, cacah it to avoid recompute.
    var result = axisInner(axis).autoInterval;
    return result != null ? result : axisInner(axis).autoInterval = axis.calculateCategoryInterval(ctx);
}
function calculateCategoryInterval(axis, ctx) {
    var kind = ctx.kind;
    var params = fetchAutoCategoryIntervalCalculationParams(axis);
    var labelFormatter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLabelFormatter"])(axis);
    var rotation = (params.axisRotate - params.labelRotate) / 180 * Math.PI;
    var ordinalScale = axis.scale;
    var ordinalExtent = ordinalScale.getExtent();
    // Providing this method is for optimization:
    // avoid generating a long array by `getTicks`
    // in large category data case.
    var tickCount = ordinalScale.count();
    if (ordinalExtent[1] - ordinalExtent[0] < 1) {
        return 0;
    }
    var step = 1;
    // Simple optimization. Arbitrary value.
    var maxCount = 40;
    if (tickCount > maxCount) {
        step = Math.max(1, Math.floor(tickCount / maxCount));
    }
    var tickValue = ordinalExtent[0];
    var unitSpan = axis.dataToCoord(tickValue + 1) - axis.dataToCoord(tickValue);
    var unitW = Math.abs(unitSpan * Math.cos(rotation));
    var unitH = Math.abs(unitSpan * Math.sin(rotation));
    var maxW = 0;
    var maxH = 0;
    // Caution: Performance sensitive for large category data.
    // Consider dataZoom, we should make appropriate step to avoid O(n) loop.
    for(; tickValue <= ordinalExtent[1]; tickValue += step){
        var width = 0;
        var height = 0;
        // Not precise, do not consider align and vertical align
        // and each distance from axis line yet.
        var rect = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$contain$2f$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getBoundingRect"](labelFormatter({
            value: tickValue
        }), params.font, 'center', 'top');
        // Magic number
        width = rect.width * 1.3;
        height = rect.height * 1.3;
        // Min size, void long loop.
        maxW = Math.max(maxW, width, 7);
        maxH = Math.max(maxH, height, 7);
    }
    var dw = maxW / unitW;
    var dh = maxH / unitH;
    // 0/0 is NaN, 1/0 is Infinity.
    isNaN(dw) && (dw = Infinity);
    isNaN(dh) && (dh = Infinity);
    var interval = Math.max(0, Math.floor(Math.min(dw, dh)));
    if (kind === AxisTickLabelComputingKind.estimate) {
        // In estimate kind, the inteval likely varies, thus do not erase the cache.
        ctx.out.noPxChangeTryDetermine.push(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bind"](calculateCategoryIntervalTryDetermine, null, axis, interval, tickCount));
        return interval;
    }
    var lastInterval = calculateCategoryIntervalDealCache(axis, interval, tickCount);
    return lastInterval != null ? lastInterval : interval;
}
function calculateCategoryIntervalTryDetermine(axis, interval, tickCount) {
    return calculateCategoryIntervalDealCache(axis, interval, tickCount) == null;
}
// Return the lastInterval if need to use it, otherwise return NullUndefined and save cache.
function calculateCategoryIntervalDealCache(axis, interval, tickCount) {
    var cache = modelInner(axis.model);
    var axisExtent = axis.getExtent();
    var lastAutoInterval = cache.lastAutoInterval;
    var lastTickCount = cache.lastTickCount;
    // Use cache to keep interval stable while moving zoom window,
    // otherwise the calculated interval might jitter when the zoom
    // window size is close to the interval-changing size.
    // For example, if all of the axis labels are `a, b, c, d, e, f, g`.
    // The jitter will cause that sometimes the displayed labels are
    // `a, d, g` (interval: 2) sometimes `a, c, e`(interval: 1).
    if (lastAutoInterval != null && lastTickCount != null && Math.abs(lastAutoInterval - interval) <= 1 && Math.abs(lastTickCount - tickCount) <= 1 && lastAutoInterval > interval && cache.axisExtent0 === axisExtent[0] && cache.axisExtent1 === axisExtent[1]) {
        return lastAutoInterval;
    } else {
        cache.lastTickCount = tickCount;
        cache.lastAutoInterval = interval;
        cache.axisExtent0 = axisExtent[0];
        cache.axisExtent1 = axisExtent[1];
    }
}
function fetchAutoCategoryIntervalCalculationParams(axis) {
    var labelModel = axis.getLabelModel();
    return {
        axisRotate: axis.getRotate ? axis.getRotate() : axis.isHorizontal && !axis.isHorizontal() ? 90 : 0,
        labelRotate: labelModel.get('rotate') || 0,
        font: labelModel.getFont()
    };
}
function makeTicksLabelsByCategoryIntervalNumOrCb(axis, categoryInterval, onlyTick) {
    var labelFormatter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeLabelFormatter"])(axis);
    var ordinalScale = axis.scale;
    var result = [];
    var categoryIntervalIsCb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"](categoryInterval);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ordinalScaleCreateTicks"])(ordinalScale, categoryIntervalIsCb ? 0 : categoryInterval, function(tickObj, isExtentBoundary) {
        var tickLabel = ordinalScale.getLabel(tickObj);
        if (categoryIntervalIsCb) {
            // When interval is function, a falsy return means ignore the tick.
            // It is time consuming for large category data.
            var isOnInterval = !!categoryInterval(tickObj.value, tickLabel);
            tickObj.offInterval = !isOnInterval;
            // axis extent min max labels should be always included and the display strategy
            // is adopted uniformly later in `AxisBuilder`.
            if (!isOnInterval && !isExtentBoundary) {
                return;
            }
        }
        result.push(onlyTick ? tickObj : {
            formattedLabel: labelFormatter(tickObj),
            rawLabel: tickLabel,
            tick: tickObj
        });
    });
    return result;
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/cartesian/Axis2D.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.3.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$Axis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/Axis.js [app-ssr] (ecmascript)");
;
;
var Axis2D = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__extends"])(Axis2D, _super);
    function Axis2D(dim, scale, coordExtent, axisType, position) {
        var _this = _super.call(this, dim, scale, coordExtent) || this;
        /**
     * Index of axis, can be used as key
     * Injected outside.
     */ _this.index = 0;
        _this.type = axisType || 'value';
        _this.position = position || 'bottom';
        return _this;
    }
    Axis2D.prototype.isHorizontal = function() {
        var position = this.position;
        return position === 'top' || position === 'bottom';
    };
    /**
   * Each item cooresponds to this.getExtent(), which
   * means globalExtent[0] may greater than globalExtent[1],
   * unless `asc` is input.
   *
   * @param {boolean} [asc]
   * @return {Array.<number>}
   */ Axis2D.prototype.getGlobalExtent = function(asc) {
        var ret = this.getExtent();
        ret[0] = this.toGlobalCoord(ret[0]);
        ret[1] = this.toGlobalCoord(ret[1]);
        asc && ret[0] > ret[1] && ret.reverse();
        return ret;
    };
    Axis2D.prototype.pointToData = function(point, clamp) {
        return this.coordToData(this.toLocalCoord(point[this.dim === 'x' ? 0 : 1]), clamp);
    };
    /**
   * Set ordinalSortInfo
   * @param info new OrdinalSortInfo
   */ Axis2D.prototype.setCategorySortInfo = function(info) {
        if (this.type !== 'category') {
            return false;
        }
        this.model.option.categorySortInfo = info;
        this.scale.setSortInfo(info);
    };
    return Axis2D;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$Axis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = Axis2D;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/cartesian/AxisModel.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartesianAxisModel",
    ()=>CartesianAxisModel,
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.3.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Component.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisModelCommonMixin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisModelCommonMixin.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
;
;
;
;
;
var CartesianAxisModel = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__extends"])(CartesianAxisModel, _super);
    function CartesianAxisModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CartesianAxisModel.prototype.getCoordSysModel = function() {
        return this.getReferringComponents('grid', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SINGLE_REFERRING"]).models[0];
    };
    CartesianAxisModel.type = 'cartesian2dAxis';
    return CartesianAxisModel;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mixin"](CartesianAxisModel, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisModelCommonMixin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AxisModelCommonMixin"]);
const __TURBOPACK__default__export__ = CartesianAxisModel;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/cartesian/Cartesian.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
;
var Cartesian = /** @class */ function() {
    function Cartesian(name) {
        this.type = 'cartesian';
        this._dimList = [];
        this._axes = {};
        this.name = name || '';
    }
    Cartesian.prototype.getAxis = function(dim) {
        return this._axes[dim];
    };
    Cartesian.prototype.getAxes = function() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"](this._dimList, function(dim) {
            return this._axes[dim];
        }, this);
    };
    Cartesian.prototype.getAxesByScale = function(scaleType) {
        scaleType = scaleType.toLowerCase();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filter"](this.getAxes(), function(axis) {
            return axis.scale.type === scaleType;
        });
    };
    Cartesian.prototype.addAxis = function(axis) {
        var dim = axis.dim;
        this._axes[dim] = axis;
        this._dimList.push(dim);
    };
    return Cartesian;
}();
;
const __TURBOPACK__default__export__ = Cartesian;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/cartesian/Cartesian2D.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cartesian2DDimensions",
    ()=>cartesian2DDimensions,
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.3.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/BoundingRect.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$Cartesian$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/cartesian/Cartesian.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$GridModel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/cartesian/GridModel.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/matrix.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/vector.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/scaleMapper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/break.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
var cartesian2DDimensions = [
    'x',
    'y'
];
function canCalculateAffineTransform(scale) {
    // Only supported on linear space.
    return (scale.type === 'interval' || scale.type === 'time') && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasBreaks"])(scale);
}
var Cartesian2D = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__extends"])(Cartesian2D, _super);
    function Cartesian2D() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$GridModel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COORD_SYS_TYPE_CARTESIAN_2D"];
        _this.dimensions = cartesian2DDimensions;
        return _this;
    }
    /**
   * Calculate an affine transform matrix if two axes are time or value.
   * It's mainly for accelartion on the large time series data.
   */ Cartesian2D.prototype.calcAffineTransform = function() {
        this._transform = this._invTransform = null;
        var xAxisScale = this.getAxis('x').scale;
        var yAxisScale = this.getAxis('y').scale;
        if (!canCalculateAffineTransform(xAxisScale) || !canCalculateAffineTransform(yAxisScale)) {
            return;
        }
        var xScaleExtent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getScaleExtentForMappingUnsafe"])(xAxisScale, null);
        var yScaleExtent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getScaleExtentForMappingUnsafe"])(yAxisScale, null);
        var start = this.dataToPoint([
            xScaleExtent[0],
            yScaleExtent[0]
        ]);
        var end = this.dataToPoint([
            xScaleExtent[1],
            yScaleExtent[1]
        ]);
        var xScaleSpan = xScaleExtent[1] - xScaleExtent[0];
        var yScaleSpan = yScaleExtent[1] - yScaleExtent[0];
        if (!xScaleSpan || !yScaleSpan) {
            return;
        }
        // Accelerate data to point calculation on the special large time series data.
        var scaleX = (end[0] - start[0]) / xScaleSpan;
        var scaleY = (end[1] - start[1]) / yScaleSpan;
        var translateX = start[0] - xScaleExtent[0] * scaleX;
        var translateY = start[1] - yScaleExtent[0] * scaleY;
        var m = this._transform = [
            scaleX,
            0,
            0,
            scaleY,
            translateX,
            translateY
        ];
        this._invTransform = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invert"])([], m);
    };
    /**
   * Base axis will be used on stacking and series such as 'bar', 'pictorialBar', etc.
   */ Cartesian2D.prototype.getBaseAxis = function() {
        // FIXME:
        //  (1) We should allow series (e.g., bar) to specify a base axis when
        //      both axes are type "value", rather than force to xAxis or angleAxis.
        //      NOTE: At present BoxplotSeries has its own overide `getBaseAxis`.
        //      `CoordinateSystem['getBaseAxis']` probably should not exist, since it
        //      may introduce inconsistency with `Series['getBaseAxis']`.
        //  (2) "base axis" info is required in "createSeriesData" stage for "stack",
        //      (see `dataStackHelper.ts` for details). Currently it is hard coded there.
        return this.getAxesByScale('ordinal')[0] || this.getAxesByScale('time')[0] || this.getAxis('x');
    };
    Cartesian2D.prototype.containPoint = function(point) {
        var axisX = this.getAxis('x');
        var axisY = this.getAxis('y');
        return axisX.contain(axisX.toLocalCoord(point[0])) && axisY.contain(axisY.toLocalCoord(point[1]));
    };
    Cartesian2D.prototype.containData = function(data) {
        return this.getAxis('x').containData(data[0]) && this.getAxis('y').containData(data[1]);
    };
    Cartesian2D.prototype.containZone = function(data1, data2) {
        var zoneDiag1 = this.dataToPoint(data1);
        var zoneDiag2 = this.dataToPoint(data2);
        var area = this.getArea();
        var zone = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](zoneDiag1[0], zoneDiag1[1], zoneDiag2[0] - zoneDiag1[0], zoneDiag2[1] - zoneDiag1[1]);
        return area.intersect(zone);
    };
    Cartesian2D.prototype.dataToPoint = function(data, clamp, out) {
        out = out || [];
        var xVal = data[0];
        var yVal = data[1];
        // [CAVEAT]: Do not add time consuming operation within and before fast path.
        // Fast path.
        if (this._transform && xVal != null && isFinite(xVal) && yVal != null && isFinite(yVal)) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyTransform"])(out, data, this._transform);
        }
        var xAxis = this.getAxis('x');
        var yAxis = this.getAxis('y');
        out[0] = xAxis.toGlobalCoord(xAxis.dataToCoord(xVal, clamp));
        out[1] = yAxis.toGlobalCoord(yAxis.dataToCoord(yVal, clamp));
        return out;
    };
    Cartesian2D.prototype.clampData = function(data, out) {
        var xScale = this.getAxis('x').scale;
        var yScale = this.getAxis('y').scale;
        var xAxisExtent = xScale.getExtent();
        var yAxisExtent = yScale.getExtent();
        var x = xScale.parse(data[0]);
        var y = yScale.parse(data[1]);
        out = out || [];
        out[0] = Math.min(Math.max(Math.min(xAxisExtent[0], xAxisExtent[1]), x), Math.max(xAxisExtent[0], xAxisExtent[1]));
        out[1] = Math.min(Math.max(Math.min(yAxisExtent[0], yAxisExtent[1]), y), Math.max(yAxisExtent[0], yAxisExtent[1]));
        return out;
    };
    Cartesian2D.prototype.pointToData = function(point, clamp, out) {
        out = out || [];
        if (this._invTransform) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyTransform"])(out, point, this._invTransform);
        }
        var xAxis = this.getAxis('x');
        var yAxis = this.getAxis('y');
        out[0] = xAxis.coordToData(xAxis.toLocalCoord(point[0]), clamp);
        out[1] = yAxis.coordToData(yAxis.toLocalCoord(point[1]), clamp);
        return out;
    };
    Cartesian2D.prototype.getOtherAxis = function(axis) {
        return this.getAxis(axis.dim === 'x' ? 'y' : 'x');
    };
    /**
   * Get rect area of cartesian.
   * Area will have a contain function to determine if a point is in the coordinate system.
   */ Cartesian2D.prototype.getArea = function(tolerance) {
        tolerance = tolerance || 0;
        var xExtent = this.getAxis('x').getGlobalExtent();
        var yExtent = this.getAxis('y').getGlobalExtent();
        var x = Math.min(xExtent[0], xExtent[1]) - tolerance;
        var y = Math.min(yExtent[0], yExtent[1]) - tolerance;
        var width = Math.max(xExtent[0], xExtent[1]) - x + tolerance;
        var height = Math.max(yExtent[0], yExtent[1]) - y + tolerance;
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](x, y, width, height);
    };
    return Cartesian2D;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$Cartesian$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
;
const __TURBOPACK__default__export__ = Cartesian2D;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/cartesian/Grid.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "registerLegacyGridContainLabelImpl",
    ()=>registerLegacyGridContainLabelImpl
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
*/ /**
 * Grid is a region which contains at most 4 cartesian systems
 *
 * TODO Default cartesian
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/layout.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisHelper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$Cartesian2D$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/cartesian/Cartesian2D.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$Axis2D$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/cartesian/Axis2D.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
// Depends on GridModel, AxisModel, which performs preprocess.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$GridModel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/cartesian/GridModel.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$cartesianAxisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/cartesian/cartesianAxisHelper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/helper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisAlignTicks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisAlignTicks.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/graphic.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$axis$2f$AxisBuilder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/axis/AxisBuilder.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisTickLabelBuilder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisTickLabelBuilder.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/CoordinateSystem.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisNiceTicks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisNiceTicks.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$SeriesDataSchema$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/SeriesDataSchema.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$scaleRawExtentInfo$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/scaleRawExtentInfo.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/break.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisStatistics.js [app-ssr] (ecmascript)");
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
;
// margin is [top, right, bottom, left]
var XY_TO_MARGIN_IDX = [
    [
        3,
        1
    ],
    [
        0,
        2
    ] // xyIdx 1 => 'y'
];
var Grid = /** @class */ function() {
    function Grid(gridModel, ecModel, api) {
        // FIXME:TS where used (different from registered type 'cartesian2d')?
        this.type = 'grid';
        this._coordsMap = {};
        this._coordsList = [];
        this._axesMap = {};
        this._axesList = [];
        this.axisPointerEnabled = true;
        this.dimensions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$Cartesian2D$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cartesian2DDimensions"];
        this._initCartesian(gridModel, ecModel, api);
        this.model = gridModel;
    }
    Grid.prototype.getRect = function() {
        return this._rect;
    };
    Grid.prototype.update = function(ecModel, api) {
        var axesMap = this._axesMap;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(this._axesList, function(axis) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$scaleRawExtentInfo$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scaleRawExtentInfoCreate"])(axis, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$scaleRawExtentInfo$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AXIS_EXTENT_INFO_BUILD_FROM_COORD_SYS_UPDATE"]);
            var scale = axis.scale;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOrdinalScale"])(scale)) {
                scale.setSortInfo(axis.model.get('categorySortInfo'));
            }
        });
        function updateAxisTicks(axes) {
            // Axis is added in order of axisIndex.
            var axesIndices = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keys"])(axes);
            var axisNeedsAlign = [];
            for(var i = axesIndices.length - 1; i >= 0; i--){
                // Reverse order
                var axis = axes[+axesIndices[i]];
                if (axis.__alignTo) {
                    axisNeedsAlign.push(axis);
                } else {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisNiceTicks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scaleCalcNice"])(axis);
                }
            }
            ;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(axisNeedsAlign, function(axis) {
                if (incapableOfAlignNeedFallback(axis, axis.__alignTo)) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisNiceTicks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scaleCalcNice"])(axis);
                } else {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisAlignTicks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scaleCalcAlign"])(axis, axis.__alignTo.scale);
                }
            });
        }
        updateAxisTicks(axesMap.x);
        updateAxisTicks(axesMap.y);
        // Key: axisDim_axisIndex, value: boolean, whether onZero target.
        var onZeroRecords = {};
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(axesMap.x, function(xAxis) {
            fixAxisOnZero(axesMap, 'y', xAxis, onZeroRecords);
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(axesMap.y, function(yAxis) {
            fixAxisOnZero(axesMap, 'x', yAxis, onZeroRecords);
        });
        // Resize again if containLabel is enabled
        // FIXME It may cause getting wrong grid size in data processing stage
        this.resize(this.model, api);
    };
    /**
   * Resize the grid.
   *
   * [NOTE]
   * If both "grid.containLabel/grid.contain" and pixel-required-data-processing (such as, "dataSampling")
   * exist, circular dependency occurs in logic.
   * The final compromised sequence is:
   *  1. Calculate "axis.extent" (pixel extent) and AffineTransform based on only "grid layout options".
   *      Not accurate if "grid.containLabel/grid.contain" is required, but it is a compromise to avoid
   *      circular dependency.
   *  2. Perform "series data processing" (where "dataSampling" requires "axis.extent").
   *  3. Calculate "scale.extent" (data extent) based on "processed series data".
   *  4. Modify "axis.extent" for "grid.containLabel/grid.contain":
   *      4.1. Calculate "axis labels" based on "scale.extent".
   *      4.2. Modify "axis.extent" by the bounding rects of "axis labels and names".
   */ Grid.prototype.resize = function(gridModel, api, beforeDataProcessing) {
        var layoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBoxLayoutReference"])(gridModel, api);
        var gridRect = this._rect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getLayoutRect"])(gridModel.getBoxLayoutParams(), layoutRef.refContainer);
        // PENDING: whether to support that if the input `coord` is out of the base coord sys,
        //  do not render anything. At present, the behavior is undefined.
        var axesMap = this._axesMap;
        var coordsList = this._coordsList;
        var optionContainLabel = gridModel.get('containLabel'); // No `.get(, true)` for backward compat.
        // NOTE: The axis pixel extent is also required by some estimation, e.g., in coord sys update stage,
        // bars on 'time'/'value' axis need it to calculate the supplementary scale extent to avoid edge bars
        // overflowing the axis (see `barGrid.ts`). Therefore, axis pixel extent need to be set early, even
        // may not be accurate.
        updateAllAxisExtentTransByGridRect(axesMap, gridRect);
        if (!beforeDataProcessing) {
            var axisBuilderSharedCtx = createAxisBiulders(gridRect, coordsList, axesMap, optionContainLabel, api);
            var noPxChange = void 0;
            if (optionContainLabel) {
                if (legacyLayOutGridByContainLabel) {
                    // console.time('legacyLayOutGridByContainLabel');
                    legacyLayOutGridByContainLabel(this._axesList, gridRect);
                    updateAllAxisExtentTransByGridRect(axesMap, gridRect);
                // console.timeEnd('legacyLayOutGridByContainLabel');
                } else {
                    if ("TURBOPACK compile-time truthy", 1) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["log"])('Specified `grid.containLabel` but no `use(LegacyGridContainLabel)`;' + 'use `grid.outerBounds` instead.', true);
                    }
                    noPxChange = layOutGridByOuterBounds(gridRect.clone(), 'axisLabel', null, gridRect, axesMap, axisBuilderSharedCtx, layoutRef);
                }
            } else {
                var _a = prepareOuterBounds(gridModel, gridRect, layoutRef), outerBoundsRect = _a.outerBoundsRect, parsedOuterBoundsContain = _a.parsedOuterBoundsContain, outerBoundsClamp = _a.outerBoundsClamp;
                if (outerBoundsRect) {
                    // console.time('layOutGridByOuterBounds');
                    noPxChange = layOutGridByOuterBounds(outerBoundsRect, parsedOuterBoundsContain, outerBoundsClamp, gridRect, axesMap, axisBuilderSharedCtx, layoutRef);
                // console.timeEnd('layOutGridByOuterBounds');
                }
            }
            // console.time('buildAxesView_determine');
            createOrUpdateAxesView(gridRect, axesMap, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisTickLabelBuilder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AxisTickLabelComputingKind"].determine, null, noPxChange, layoutRef);
            // console.timeEnd('buildAxesView_determine');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(this._coordsList, function(coord) {
                // Calculate affine matrix to accelerate the data to point transform.
                // If all the axes scales are time or value.
                coord.calcAffineTransform();
            });
        } // End of beforeDataProcessing
    };
    Grid.prototype.getAxis = function(dim, axisIndex) {
        var axesMapOnDim = this._axesMap[dim];
        if (axesMapOnDim != null) {
            return axesMapOnDim[axisIndex || 0];
        }
    };
    Grid.prototype.getAxes = function() {
        return this._axesList.slice();
    };
    Grid.prototype.getCartesian = function(xAxisIndex, yAxisIndex) {
        if (xAxisIndex != null && yAxisIndex != null) {
            var key = 'x' + xAxisIndex + 'y' + yAxisIndex;
            return this._coordsMap[key];
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(xAxisIndex)) {
            yAxisIndex = xAxisIndex.yAxisIndex;
            xAxisIndex = xAxisIndex.xAxisIndex;
        }
        for(var i = 0, coordList = this._coordsList; i < coordList.length; i++){
            if (coordList[i].getAxis('x').index === xAxisIndex || coordList[i].getAxis('y').index === yAxisIndex) {
                return coordList[i];
            }
        }
    };
    Grid.prototype.getCartesians = function() {
        return this._coordsList.slice();
    };
    /**
   * @implements
   */ Grid.prototype.convertToPixel = function(ecModel, finder, value) {
        var target = this._findConvertTarget(finder);
        return target.cartesian ? target.cartesian.dataToPoint(value) : target.axis ? target.axis.toGlobalCoord(target.axis.dataToCoord(value)) : null;
    };
    /**
   * @implements
   */ Grid.prototype.convertFromPixel = function(ecModel, finder, value) {
        var target = this._findConvertTarget(finder);
        return target.cartesian ? target.cartesian.pointToData(value) : target.axis ? target.axis.coordToData(target.axis.toLocalCoord(value)) : null;
    };
    Grid.prototype._findConvertTarget = function(finder) {
        var seriesModel = finder.seriesModel;
        var xAxisModel = finder.xAxisModel || seriesModel && seriesModel.getReferringComponents('xAxis', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SINGLE_REFERRING"]).models[0];
        var yAxisModel = finder.yAxisModel || seriesModel && seriesModel.getReferringComponents('yAxis', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SINGLE_REFERRING"]).models[0];
        var gridModel = finder.gridModel;
        var coordsList = this._coordsList;
        var cartesian;
        var axis;
        if (seriesModel) {
            cartesian = seriesModel.coordinateSystem;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["indexOf"])(coordsList, cartesian) < 0 && (cartesian = null);
        } else if (xAxisModel && yAxisModel) {
            cartesian = this.getCartesian(xAxisModel.componentIndex, yAxisModel.componentIndex);
        } else if (xAxisModel) {
            axis = this.getAxis('x', xAxisModel.componentIndex);
        } else if (yAxisModel) {
            axis = this.getAxis('y', yAxisModel.componentIndex);
        } else if (gridModel) {
            var grid = gridModel.coordinateSystem;
            if (grid === this) {
                cartesian = this._coordsList[0];
            }
        }
        return {
            cartesian: cartesian,
            axis: axis
        };
    };
    /**
   * @implements
   */ Grid.prototype.containPoint = function(point) {
        var coord = this._coordsList[0];
        if (coord) {
            return coord.containPoint(point);
        }
    };
    /**
   * Initialize cartesian coordinate systems
   */ Grid.prototype._initCartesian = function(gridModel, ecModel, api) {
        var _this = this;
        var grid = this;
        var axisPositionUsed = {
            left: false,
            right: false,
            top: false,
            bottom: false
        };
        var axesMap = {
            x: {},
            y: {}
        };
        var axesCount = {
            x: 0,
            y: 0
        };
        // Create axis
        ecModel.eachComponent('xAxis', createAxisCreator('x'), this);
        ecModel.eachComponent('yAxis', createAxisCreator('y'), this);
        if (!axesCount.x || !axesCount.y) {
            // Roll back when there no either x or y axis
            this._axesMap = {};
            this._axesList = [];
            return;
        }
        this._axesMap = axesMap;
        // Create cartesian2d
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(axesMap.x, function(xAxis, xAxisIndex) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(axesMap.y, function(yAxis, yAxisIndex) {
                var key = 'x' + xAxisIndex + 'y' + yAxisIndex;
                var cartesian = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$Cartesian2D$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](key);
                cartesian.master = _this;
                cartesian.model = gridModel;
                _this._coordsMap[key] = cartesian;
                _this._coordsList.push(cartesian);
                cartesian.addAxis(xAxis);
                cartesian.addAxis(yAxis);
            });
        });
        prepareAlignToInCoordSysCreate(axesMap.x);
        prepareAlignToInCoordSysCreate(axesMap.y);
        function createAxisCreator(dimName) {
            return function(axisModel, idx) {
                if (!isAxisUsedInTheGrid(axisModel, gridModel)) {
                    return;
                }
                var axisPosition = axisModel.get('position');
                if (dimName === 'x') {
                    // Fix position
                    if (axisPosition !== 'top' && axisPosition !== 'bottom') {
                        // Default bottom of X
                        axisPosition = axisPositionUsed.bottom ? 'top' : 'bottom';
                    }
                } else {
                    // Fix position
                    if (axisPosition !== 'left' && axisPosition !== 'right') {
                        // Default left of Y
                        axisPosition = axisPositionUsed.left ? 'right' : 'left';
                    }
                }
                axisPositionUsed[axisPosition] = true;
                var axisType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["determineAxisType"])(axisModel);
                var axis = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$Axis2D$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](dimName, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createScaleByModel"])(axisModel, axisType, true), [
                    0,
                    0
                ], axisType, axisPosition);
                axis.onBand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isAxisOnBand"])(axis.scale, axisModel);
                axis.inverse = axisModel.get('inverse');
                // Inject axis into axisModel
                axisModel.axis = axis;
                // Inject axisModel into axis
                axis.model = axisModel;
                // Inject grid info axis
                axis.grid = grid;
                // Index of axis, can be used as key
                axis.index = idx;
                grid._axesList.push(axis);
                axesMap[dimName][idx] = axis;
                axesCount[dimName]++;
            };
        }
    };
    /**
   * @param dim 'x' or 'y' or 'auto' or null/undefined
   */ Grid.prototype.getTooltipAxes = function(dim) {
        var baseAxes = [];
        var otherAxes = [];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(this.getCartesians(), function(cartesian) {
            var baseAxis = dim != null && dim !== 'auto' ? cartesian.getAxis(dim) : cartesian.getBaseAxis();
            var otherAxis = cartesian.getOtherAxis(baseAxis);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["indexOf"])(baseAxes, baseAxis) < 0 && baseAxes.push(baseAxis);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["indexOf"])(otherAxes, otherAxis) < 0 && otherAxes.push(otherAxis);
        });
        return {
            baseAxes: baseAxes,
            otherAxes: otherAxes
        };
    };
    Grid.create = function(ecModel, api) {
        var grids = [];
        ecModel.eachComponent('grid', function(gridModel, idx) {
            var grid = new Grid(gridModel, ecModel, api);
            grid.name = 'grid_' + idx;
            // dataSampling requires axis extent, so resize
            // should be performed in create stage.
            grid.resize(gridModel, api, true);
            gridModel.coordinateSystem = grid;
            grids.push(grid);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(grid._axesList, function(axis) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$scaleRawExtentInfo$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scaleRawExtentInfoEnableBoxCoordSysUsage"])(axis, Grid.dimIdxMap);
            });
        });
        // Inject the coordinateSystems into seriesModel
        ecModel.eachSeries(function(seriesModel) {
            var xAxis;
            var yAxis;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["injectCoordSysByOption"])({
                targetModel: seriesModel,
                coordSysType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$GridModel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COORD_SYS_TYPE_CARTESIAN_2D"],
                coordSysProvider: coordSysProvider
            });
            function coordSysProvider() {
                var axesModelMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$cartesianAxisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findAxisModels"])(seriesModel);
                var xAxisModel = axesModelMap.xAxisModel;
                var yAxisModel = axesModelMap.yAxisModel;
                xAxis = xAxisModel.axis;
                yAxis = yAxisModel.axis;
                var gridModel = xAxisModel.getCoordSysModel();
                if ("TURBOPACK compile-time truthy", 1) {
                    if (!gridModel) {
                        throw new Error('Grid "' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve3"])(xAxisModel.get('gridIndex'), xAxisModel.get('gridId'), 0) + '" not found');
                    }
                    if (xAxisModel.getCoordSysModel() !== yAxisModel.getCoordSysModel()) {
                        throw new Error('xAxis and yAxis must use the same grid');
                    }
                }
                var grid = gridModel.coordinateSystem;
                return grid.getCartesian(xAxisModel.componentIndex, yAxisModel.componentIndex);
            }
            if (xAxis && yAxis) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["associateSeriesWithAxis"])(xAxis, seriesModel, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$GridModel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COORD_SYS_TYPE_CARTESIAN_2D"]);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["associateSeriesWithAxis"])(yAxis, seriesModel, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$GridModel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COORD_SYS_TYPE_CARTESIAN_2D"]);
            }
        }, this);
        return grids;
    };
    // For deciding which dimensions to use when creating list data
    Grid.dimensions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$Cartesian2D$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cartesian2DDimensions"];
    Grid.dimIdxMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$SeriesDataSchema$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createDimNameMap"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$Cartesian2D$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cartesian2DDimensions"]);
    return Grid;
}();
/**
 * Check if the axis is used in the specified grid.
 */ function isAxisUsedInTheGrid(axisModel, gridModel) {
    return axisModel.getCoordSysModel() === gridModel;
}
function fixAxisOnZero(axesMap, otherAxisDim, axis, // Key: see `getOnZeroRecordKey`
onZeroRecords) {
    axis.getAxesOnZeroOf = function() {
        // TODO: onZero of multiple axes.
        return otherAxisOnZeroOf ? [
            otherAxisOnZeroOf
        ] : [];
    };
    // onZero can not be enabled in these two situations:
    // 1. When any other axis is a category axis.
    // 2. When no axis is cross 0 point.
    var otherAxes = axesMap[otherAxisDim];
    var otherAxisOnZeroOf;
    var axisModel = axis.model;
    var onZero = axisModel.get([
        'axisLine',
        'onZero'
    ]);
    var onZeroAxisIndex = axisModel.get([
        'axisLine',
        'onZeroAxisIndex'
    ]);
    // For historical reason, ec option `axisLine.onZero: undefined` leads to "not on zero"
    // while leaving `axisLine.onZero` unspecified causes "on zero". This inconsistency goes
    // against common sense, but is preserved for backward compatibility.
    if (!onZero) {
        return;
    }
    // If target axis is specified.
    if (onZeroAxisIndex != null) {
        if (canOnZeroToAxis(onZero, otherAxes[onZeroAxisIndex])) {
            otherAxisOnZeroOf = otherAxes[onZeroAxisIndex];
        }
    } else {
        // Find the first available other axis.
        for(var idx in otherAxes){
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasOwn"])(otherAxes, idx) && canOnZeroToAxis(onZero, otherAxes[idx]) && !onZeroRecords[getOnZeroRecordKey(otherAxes[idx])]) {
                otherAxisOnZeroOf = otherAxes[idx];
                break;
            }
        }
    }
    if (otherAxisOnZeroOf) {
        onZeroRecords[getOnZeroRecordKey(otherAxisOnZeroOf)] = true;
    }
    function getOnZeroRecordKey(axis) {
        return axis.dim + '_' + axis.index;
    }
}
/**
 * CAVEAT: Must not be called before `CoordinateSystem#update` due to `__dontOnMyZero`.
 */ function canOnZeroToAxis(onZeroOption, axis) {
    if (!axis) {
        return false;
    }
    var scale = axis.scale;
    var kindEffective = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getScaleValuePositionKind"])(scale, 0, false);
    var can = axis && axis.type !== 'category' && axis.type !== 'time' && kindEffective !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SCALE_VALUE_POSITION_KIND_OUTSIDE"];
    if (can && onZeroOption === 'auto' && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOnAxisZeroDiscouraged"])(axis)) {
        can = false;
    }
    // falsy value of `onZeroOption` has been handled in the previous logic.
    return can;
}
/**
 * [CAVEAT] This method is called before data processing stage.
 *  Do not rely on any info that is determined afterward.
 */ function prepareAlignToInCoordSysCreate(axes) {
    // Axis is added in order of axisIndex.
    var axesIndices = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keys"])(axes);
    var alignTo;
    var axisNeedsAlign = [];
    for(var i = axesIndices.length - 1; i >= 0; i--){
        // Reverse order
        var axis = axes[+axesIndices[i]];
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isIntervalOrLogScale"])(axis.scale) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieveAxisBreaksOption"])(axis.model, axis.type, true) == null) {
            // Request `alignTicks`.
            if (axis.model.get('alignTicks') && axis.model.get('interval') == null) {
                axisNeedsAlign.push(axis);
            } else {
                // `alignTo` the last one that does not request `alignTicks`
                // (This rule is retained for backward compat).
                alignTo = axis;
            }
        }
    }
    ;
    // If all axes has set alignTicks, pick the first one as alignTo.
    // PENDING. Should we find the axis that both set interval, min, max and align to this one?
    // PENDING. Should we allow specifying alignTo via ec option?
    if (!alignTo) {
        alignTo = axisNeedsAlign.pop();
    }
    if (alignTo) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(axisNeedsAlign, function(axis) {
            axis.__alignTo = alignTo;
        });
    }
}
/**
 * This is just a defence code. They are unlikely to be actually `true`,
 * since these cases have been addressed in `prepareAlignToInCoordSysCreate`.
 *
 * Can not be called BEFORE "nice" performed.
 */ function incapableOfAlignNeedFallback(targetAxis, alignTo) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasBreaks"])(targetAxis.scale) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasBreaks"])(alignTo.scale) || alignTo.scale.getTicks().length < 2;
}
function updateAxisTransform(axis, coordBase) {
    var axisExtent = axis.getExtent();
    var axisExtentSum = axisExtent[0] + axisExtent[1];
    // Fast transform
    axis.toGlobalCoord = axis.dim === 'x' ? function(coord) {
        return coord + coordBase;
    } : function(coord) {
        return axisExtentSum - coord + coordBase;
    };
    axis.toLocalCoord = axis.dim === 'x' ? function(coord) {
        return coord - coordBase;
    } : function(coord) {
        return axisExtentSum - coord + coordBase;
    };
}
function updateAllAxisExtentTransByGridRect(axesMap, gridRect) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(axesMap.x, function(axis) {
        return updateAxisExtentTransByGridRect(axis, gridRect.x, gridRect.width);
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(axesMap.y, function(axis) {
        return updateAxisExtentTransByGridRect(axis, gridRect.y, gridRect.height);
    });
}
function updateAxisExtentTransByGridRect(axis, gridXY, gridWH) {
    var extent = [
        0,
        gridWH
    ];
    var idx = axis.inverse ? 1 : 0;
    axis.setExtent(extent[idx], extent[1 - idx]);
    updateAxisTransform(axis, gridXY);
}
var legacyLayOutGridByContainLabel;
function registerLegacyGridContainLabelImpl(impl) {
    legacyLayOutGridByContainLabel = impl;
}
// Return noPxChange.
function layOutGridByOuterBounds(outerBoundsRect, outerBoundsContain, outerBoundsClamp, gridRect, axesMap, axisBuilderSharedCtx, layoutRef) {
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(outerBoundsContain === 'all' || outerBoundsContain === 'axisLabel');
    }
    // Assume `updateAllAxisExtentTransByGridRect` has been performed once before this call.
    // [NOTE]:
    // - The bounding rect of the axis elements might be sensitve to variations in `axis.extent` due to strategies
    //  like hideOverlap/moveOverlap. @see the comment in `LabelLayoutBase['suggestIgnore']`.
    // - The final `gridRect` might be slightly smaller than the ideally expected result if labels are giant and
    //  get hidden due to overlapping. More iterations could improve precision, but not performant. We consider
    //  the current result acceptable, since no alignment among charts can be guaranteed when using this feature.
    createOrUpdateAxesView(gridRect, axesMap, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisTickLabelBuilder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AxisTickLabelComputingKind"].estimate, outerBoundsContain, false, layoutRef);
    var margin = [
        0,
        0,
        0,
        0
    ];
    fillLabelNameOverflowOnOneDimension(0);
    fillLabelNameOverflowOnOneDimension(1);
    // If axis is blank, no label can be used to detect overflow.
    // gridRect itself should not overflow.
    fillMarginOnOneDimension(gridRect, 0, NaN);
    fillMarginOnOneDimension(gridRect, 1, NaN);
    var noPxChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["find"])(margin, function(item) {
        return item > 0;
    }) == null;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["expandOrShrinkRect"])(gridRect, margin, true, true, outerBoundsClamp);
    updateAllAxisExtentTransByGridRect(axesMap, gridRect);
    return noPxChange;
    //TURBOPACK unreachable
    ;
    function fillLabelNameOverflowOnOneDimension(xyIdx) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(axesMap[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["XY"][xyIdx]], function(axis) {
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shouldAxisShow"])(axis.model)) {
                return;
            }
            // FIXME: zr Group.union may wrongly union (0, 0, 0, 0) and not performant.
            // unionRect.union(axis.axisBuilder.group.getBoundingRect());
            // If ussing Group.getBoundingRect to calculate shrink space, it is not strictly accurate when
            // the outermost label is ignored and the secondary label is very long and contribute to the
            // union extension:
            //      -|---|---|---|
            //         1,000,000,000
            // Therefore we calculate them one by one.
            // Also considered axis may be blank or no labels.
            var sharedRecord = axisBuilderSharedCtx.ensureRecord(axis.model);
            var labelInfoList = sharedRecord.labelInfoList;
            if (labelInfoList) {
                for(var idx = 0; idx < labelInfoList.length; idx++){
                    var labelInfo = labelInfoList[idx];
                    var proportion = axis.scale.normalize((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTickValueOutermost"])(axis.scale, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$axis$2f$AxisBuilder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getLabelInner"])(labelInfo.label).labelInfo.tick));
                    proportion = xyIdx === 1 ? 1 - proportion : proportion;
                    // xAxis use proportion on x, yAxis use proprotion on y, otherwise not.
                    fillMarginOnOneDimension(labelInfo.rect, xyIdx, proportion);
                    fillMarginOnOneDimension(labelInfo.rect, 1 - xyIdx, NaN);
                }
            }
            var nameLayout = sharedRecord.nameLayout;
            if (nameLayout) {
                var proportion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNameLocationCenter"])(sharedRecord.nameLocation) ? 0.5 : NaN;
                fillMarginOnOneDimension(nameLayout.rect, xyIdx, proportion);
                fillMarginOnOneDimension(nameLayout.rect, 1 - xyIdx, NaN);
            }
        });
    }
    function fillMarginOnOneDimension(itemRect, xyIdx, proportion // NaN mean no use proportion
    ) {
        var overflow1 = outerBoundsRect[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["XY"][xyIdx]] - itemRect[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["XY"][xyIdx]];
        var overflow2 = itemRect[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WH"][xyIdx]] + itemRect[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["XY"][xyIdx]] - (outerBoundsRect[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WH"][xyIdx]] + outerBoundsRect[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["XY"][xyIdx]]);
        overflow1 = applyProportion(overflow1, 1 - proportion);
        overflow2 = applyProportion(overflow2, proportion);
        var minIdx = XY_TO_MARGIN_IDX[xyIdx][0];
        var maxIdx = XY_TO_MARGIN_IDX[xyIdx][1];
        margin[minIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathMax"])(margin[minIdx], overflow1);
        margin[maxIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathMax"])(margin[maxIdx], overflow2);
    }
    function applyProportion(overflow, proportion) {
        // proportion is not likely to near zero. If so, give up shrink
        if (overflow > 0 && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["eqNaN"])(proportion) && proportion > 1e-4) {
            overflow /= proportion;
        }
        return overflow;
    }
}
function createAxisBiulders(gridRect, cartesians, axesMap, optionContainLabel, api) {
    var axisBuilderSharedCtx = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$axis$2f$AxisBuilder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AxisBuilderSharedContext"](resolveAxisNameOverlapForGrid);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(axesMap, function(axisList) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(axisList, function(axis) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shouldAxisShow"])(axis.model)) {
                // See `AxisBaseOptionCommon['nameMoveOverlap']`.
                var defaultNameMoveOverlap = !optionContainLabel;
                axis.axisBuilder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$cartesianAxisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCartesianAxisViewCommonPartBuilder"])(gridRect, cartesians, axis.model, api, axisBuilderSharedCtx, defaultNameMoveOverlap);
            }
        });
    });
    return axisBuilderSharedCtx;
}
/**
 * Promote the axis-elements-building from "view render" stage to "coordinate system resize" stage.
 * This is aimed to resovle overlap across multiple axes, since currently it's hard to reconcile
 * multiple axes in "view render" stage.
 *
 * [CAUTION] But this promotion assumes that the subsequent "visual mapping" stage does not affect
 * this axis-elements-building; otherwise we have to refactor it again.
 */ function createOrUpdateAxesView(gridRect, axesMap, kind, outerBoundsContain, noPxChange, layoutRef) {
    var isDetermine = kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisTickLabelBuilder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AxisTickLabelComputingKind"].determine;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(axesMap, function(axisList) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(axisList, function(axis) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shouldAxisShow"])(axis.model)) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$cartesianAxisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateCartesianAxisViewCommonPartBuilder"])(axis.axisBuilder, gridRect, axis.model);
                axis.axisBuilder.build(isDetermine ? {
                    axisTickLabelDetermine: true
                } : {
                    axisTickLabelEstimate: true
                }, {
                    noPxChange: noPxChange
                });
            }
        });
    });
    var nameMarginLevelMap = {
        x: 0,
        y: 0
    };
    calcNameMarginLevel(0);
    calcNameMarginLevel(1);
    function calcNameMarginLevel(xyIdx) {
        nameMarginLevelMap[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["XY"][1 - xyIdx]] = gridRect[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WH"][xyIdx]] <= layoutRef.refContainer[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WH"][xyIdx]] * 0.5 ? 0 : 1 - xyIdx === 1 ? 2 : 1;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(axesMap, function(axisList, xy) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(axisList, function(axis) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shouldAxisShow"])(axis.model)) {
                if (outerBoundsContain === 'all' || isDetermine) {
                    // To resolve overlap, `axisName` layout depends on `axisTickLabel` layout result
                    // (all of the axes of the same `grid`; consider multiple x or y axes).
                    axis.axisBuilder.build({
                        axisName: true
                    }, {
                        nameMarginLevel: nameMarginLevelMap[xy]
                    });
                }
                if (isDetermine) {
                    axis.axisBuilder.build({
                        axisLine: true
                    });
                }
            }
        });
    });
}
function prepareOuterBounds(gridModel, rawGridRect, layoutRef) {
    var outerBoundsRect;
    var optionOuterBoundsMode = gridModel.get('outerBoundsMode', true);
    if (optionOuterBoundsMode === 'same') {
        outerBoundsRect = rawGridRect.clone();
    } else if (optionOuterBoundsMode == null || optionOuterBoundsMode === 'auto') {
        outerBoundsRect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getLayoutRect"])(gridModel.get('outerBounds', true) || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$GridModel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OUTER_BOUNDS_DEFAULT"], layoutRef.refContainer);
    } else if (optionOuterBoundsMode !== 'none') {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["error"])("Invalid grid[" + gridModel.componentIndex + "].outerBoundsMode.");
        }
    }
    var optionOuterBoundsContain = gridModel.get('outerBoundsContain', true);
    var parsedOuterBoundsContain;
    if (optionOuterBoundsContain == null || optionOuterBoundsContain === 'auto') {
        parsedOuterBoundsContain = 'all';
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["indexOf"])([
        'all',
        'axisLabel'
    ], optionOuterBoundsContain) < 0) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["error"])("Invalid grid[" + gridModel.componentIndex + "].outerBoundsContain.");
        }
        parsedOuterBoundsContain = 'all';
    } else {
        parsedOuterBoundsContain = optionOuterBoundsContain;
    }
    var outerBoundsClamp = [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePositionSizeOption"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(gridModel.get('outerBoundsClampWidth', true), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$GridModel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OUTER_BOUNDS_CLAMP_DEFAULT"][0]), rawGridRect.width),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePositionSizeOption"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(gridModel.get('outerBoundsClampHeight', true), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$GridModel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OUTER_BOUNDS_CLAMP_DEFAULT"][1]), rawGridRect.height)
    ];
    return {
        outerBoundsRect: outerBoundsRect,
        parsedOuterBoundsContain: parsedOuterBoundsContain,
        outerBoundsClamp: outerBoundsClamp
    };
}
var resolveAxisNameOverlapForGrid = function(cfg, ctx, axisModel, nameLayoutInfo, nameMoveDirVec, thisRecord) {
    var perpendicularDim = axisModel.axis.dim === 'x' ? 'y' : 'x';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$axis$2f$AxisBuilder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveAxisNameOverlapDefault"])(cfg, ctx, axisModel, nameLayoutInfo, nameMoveDirVec, thisRecord);
    // If nameLocation 'center', and there are multiple axes parallel to this axis, do not adjust by
    //  other axes, because the axis name should be close to its axis line as much as possible even
    //  if overlapping; otherwise it might cause misleading.
    // If nameLocation 'center', do not adjust by perpendicular axes, since they are not likely to overlap.
    // If nameLocation 'start'/'end', move name within the same direction to escape overlap with the
    //  perpendicular axes.
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNameLocationCenter"])(cfg.nameLocation)) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(ctx.recordMap[perpendicularDim], function(perpenRecord) {
            // perpendicular axis may be no name.
            if (perpenRecord && perpenRecord.labelInfoList && perpenRecord.dirVec) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$axis$2f$AxisBuilder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["moveIfOverlapByLinearLabels"])(perpenRecord.labelInfoList, perpenRecord.dirVec, nameLayoutInfo, nameMoveDirVec);
            }
        });
    }
};
const __TURBOPACK__default__export__ = Grid;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/cartesian/GridModel.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COORD_SYS_TYPE_CARTESIAN_2D",
    ()=>COORD_SYS_TYPE_CARTESIAN_2D,
    "OUTER_BOUNDS_CLAMP_DEFAULT",
    ()=>OUTER_BOUNDS_CLAMP_DEFAULT,
    "OUTER_BOUNDS_DEFAULT",
    ()=>OUTER_BOUNDS_DEFAULT,
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.3.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Component.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/layout.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/tokens.js [app-ssr] (ecmascript)");
;
;
;
;
var OUTER_BOUNDS_DEFAULT = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
};
var OUTER_BOUNDS_CLAMP_DEFAULT = [
    '25%',
    '25%'
];
var COORD_SYS_TYPE_CARTESIAN_2D = 'cartesian2d';
var GridModel = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__extends"])(GridModel, _super);
    function GridModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GridModel.prototype.mergeDefaultAndTheme = function(option, ecModel) {
        var outerBoundsCp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getLayoutParams"])(option.outerBounds);
        _super.prototype.mergeDefaultAndTheme.apply(this, arguments);
        if (outerBoundsCp && option.outerBounds) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeLayoutParam"])(option.outerBounds, outerBoundsCp);
        }
    };
    GridModel.prototype.mergeOption = function(newOption, ecModel) {
        _super.prototype.mergeOption.apply(this, arguments);
        if (this.option.outerBounds && newOption.outerBounds) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeLayoutParam"])(this.option.outerBounds, newOption.outerBounds);
        }
    };
    GridModel.type = 'grid';
    GridModel.dependencies = [
        'xAxis',
        'yAxis'
    ];
    GridModel.layoutMode = 'box';
    GridModel.defaultOption = {
        show: false,
        // zlevel: 0,
        z: 0,
        left: '15%',
        top: 65,
        right: '10%',
        bottom: 80,
        // If grid size contain label
        containLabel: false,
        outerBoundsMode: 'auto',
        outerBounds: OUTER_BOUNDS_DEFAULT,
        outerBoundsContain: 'all',
        outerBoundsClampWidth: OUTER_BOUNDS_CLAMP_DEFAULT[0],
        outerBoundsClampHeight: OUTER_BOUNDS_CLAMP_DEFAULT[1],
        // width: {totalWidth} - left - right,
        // height: {totalHeight} - top - bottom,
        backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].color.transparent,
        borderWidth: 1,
        borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].color.neutral30
    };
    return GridModel;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = GridModel;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/cartesian/cartesianAxisHelper.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCartesianAxisViewCommonPartBuilder",
    ()=>createCartesianAxisViewCommonPartBuilder,
    "findAxisModels",
    ()=>findAxisModels,
    "getCartesianAxisHashKey",
    ()=>getCartesianAxisHashKey,
    "isCartesian2DDeclaredSeries",
    ()=>isCartesian2DDeclaredSeries,
    "isCartesian2DInjectedAsDataCoordSys",
    ()=>isCartesian2DInjectedAsDataCoordSys,
    "layout",
    ()=>layout,
    "updateCartesianAxisViewCommonPartBuilder",
    ()=>updateCartesianAxisViewCommonPartBuilder
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$axis$2f$AxisBuilder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/axis/AxisBuilder.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/helper.js [app-ssr] (ecmascript)");
;
;
;
;
function layout(rect, axisModel, opt) {
    opt = opt || {};
    var axis = axisModel.axis;
    var layout = {};
    var otherAxisOnZeroOf = axis.getAxesOnZeroOf()[0];
    var rawAxisPosition = axis.position;
    var axisPosition = otherAxisOnZeroOf ? 'onZero' : rawAxisPosition;
    var axisDim = axis.dim;
    var rectBound = [
        rect.x,
        rect.x + rect.width,
        rect.y,
        rect.y + rect.height
    ];
    var idx = {
        left: 0,
        right: 1,
        top: 0,
        bottom: 1,
        onZero: 2
    };
    var axisOffset = axisModel.get('offset') || 0;
    var posBound = axisDim === 'x' ? [
        rectBound[2] - axisOffset,
        rectBound[3] + axisOffset
    ] : [
        rectBound[0] - axisOffset,
        rectBound[1] + axisOffset
    ];
    if (otherAxisOnZeroOf) {
        var onZeroCoord = otherAxisOnZeroOf.toGlobalCoord(otherAxisOnZeroOf.dataToCoord(0));
        posBound[idx.onZero] = Math.max(Math.min(onZeroCoord, posBound[1]), posBound[0]);
    }
    // Axis position
    layout.position = [
        axisDim === 'y' ? posBound[idx[axisPosition]] : rectBound[0],
        axisDim === 'x' ? posBound[idx[axisPosition]] : rectBound[3]
    ];
    // Axis rotation
    layout.rotation = Math.PI / 2 * (axisDim === 'x' ? 0 : 1);
    // Tick and label direction, x y is axisDim
    var dirMap = {
        top: -1,
        bottom: 1,
        left: -1,
        right: 1
    };
    layout.labelDirection = layout.tickDirection = layout.nameDirection = dirMap[rawAxisPosition];
    layout.labelOffset = otherAxisOnZeroOf ? posBound[idx[rawAxisPosition]] - posBound[idx.onZero] : 0;
    if (axisModel.get([
        'axisTick',
        'inside'
    ])) {
        layout.tickDirection = -layout.tickDirection;
    }
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve"](opt.labelInside, axisModel.get([
        'axisLabel',
        'inside'
    ]))) {
        layout.labelDirection = -layout.labelDirection;
    }
    // Special label rotation
    var labelRotate = axisModel.get([
        'axisLabel',
        'rotate'
    ]);
    layout.labelRotate = axisPosition === 'top' ? -labelRotate : labelRotate;
    // Over splitLine and splitArea
    layout.z2 = 1;
    return layout;
}
function isCartesian2DDeclaredSeries(seriesModel) {
    return seriesModel.get('coordinateSystem') === 'cartesian2d';
}
function isCartesian2DInjectedAsDataCoordSys(seriesModel) {
    return seriesModel.coordinateSystem && seriesModel.coordinateSystem.type === 'cartesian2d';
}
function findAxisModels(seriesModel) {
    var axisModelMap = {
        xAxisModel: null,
        yAxisModel: null
    };
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](axisModelMap, function(v, key) {
        var axisType = key.replace(/Model$/, '');
        var axisModel = seriesModel.getReferringComponents(axisType, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SINGLE_REFERRING"]).models[0];
        if ("TURBOPACK compile-time truthy", 1) {
            if (!axisModel) {
                throw new Error(axisType + ' "' + __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve3"](seriesModel.get(axisType + 'Index'), seriesModel.get(axisType + 'Id'), 0) + '" not found');
            }
        }
        axisModelMap[key] = axisModel;
    });
    return axisModelMap;
}
function createCartesianAxisViewCommonPartBuilder(gridRect, cartesians, axisModel, api, ctx, defaultNameMoveOverlap) {
    var layoutResult = layout(gridRect, axisModel);
    var axisLineAutoShow = false;
    var axisTickAutoShow = false;
    // Not show axisTick or axisLine if other axis is category / time
    for(var i = 0; i < cartesians.length; i++){
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isIntervalOrLogScale"])(cartesians[i].getOtherAxis(axisModel.axis).scale)) {
            // Still show axis tick or axisLine if other axis is value / log
            axisLineAutoShow = axisTickAutoShow = true;
            if (axisModel.axis.type === 'category' && axisModel.axis.onBand) {
                axisTickAutoShow = false;
            }
        }
    }
    layoutResult.axisLineAutoShow = axisLineAutoShow;
    layoutResult.axisTickAutoShow = axisTickAutoShow;
    layoutResult.defaultNameMoveOverlap = defaultNameMoveOverlap;
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$axis$2f$AxisBuilder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](axisModel, api, layoutResult, ctx);
}
function updateCartesianAxisViewCommonPartBuilder(axisBuilder, gridRect, axisModel) {
    var newRaw = layout(gridRect, axisModel);
    if ("TURBOPACK compile-time truthy", 1) {
        var oldRaw_1 = axisBuilder.__getRawCfg();
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keys"](newRaw), function(prop) {
            if (prop !== 'position' && prop !== 'labelOffset') {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"](newRaw[prop] === oldRaw_1[prop]);
            }
        });
    }
    axisBuilder.updateCfg(newRaw);
}
function getCartesianAxisHashKey(axis) {
    return axis.dim + '_' + axis.index;
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/Geo.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "geo2DDimensions",
    ()=>geo2DDimensions
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.3.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$View$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/View.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$geoSourceManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/geoSourceManager.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/Transformable.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
var GEO_DEFAULT_PARAMS = {
    'geoJSON': {
        aspectScale: 0.75,
        invertLongitute: true
    },
    'geoSVG': {
        aspectScale: 1,
        invertLongitute: false
    }
};
var geo2DDimensions = [
    'lng',
    'lat'
];
var Geo = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__extends"])(Geo, _super); // See VIEW_COORD_SYS_TRANS_OVERALL_BACKWARD_COMPATIBILITY
    function Geo(name, map, opt) {
        var _this = _super.call(this) || this;
        _this.dimensions = geo2DDimensions;
        _this.type = 'geo';
        // Only store specified name coord via `addGeoCoord`.
        _this._nameCoordMap = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"]();
        _this.name = name;
        var projection = opt.projection;
        var source = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$geoSourceManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].load(map, opt.nameMap, opt.nameProperty);
        var resource = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$geoSourceManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getGeoResource(map);
        var resourceType = _this.resourceType = resource ? resource.type : null;
        var regions = _this.regions = source.regions;
        var defaultParams = GEO_DEFAULT_PARAMS[resource.type];
        _this._clip = opt.clip;
        // Not invert longitude if projection exits.
        var invertLongitute = projection ? false : defaultParams.invertLongitute;
        _this.view = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$View$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](invertLongitute, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$View$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLegacyViewCoordSysCenterBase"])(opt.ecModel, opt.api), _this);
        _this.map = map;
        _this._regionsMap = source.regionsMap;
        _this.regions = source.regions;
        if (("TURBOPACK compile-time value", "development") !== 'production' && projection) {
            // Do some check
            if (resourceType === 'geoSVG') {
                if ("TURBOPACK compile-time truthy", 1) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warn"])("Map " + map + " with SVG source can't use projection. Only GeoJSON source supports projection.");
                }
                projection = null;
            }
            if (!(projection.project && projection.unproject)) {
                if ("TURBOPACK compile-time truthy", 1) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warn"])('project and unproject must be both provided in the projeciton.');
                }
                projection = null;
            }
        }
        _this.projection = projection;
        var boundingRect;
        if (projection) {
            // Can't reuse the raw bounding rect
            for(var i = 0; i < regions.length; i++){
                var regionRect = regions[i].getBoundingRect(projection);
                boundingRect = boundingRect || regionRect.clone();
                boundingRect.union(regionRect);
            }
        } else {
            boundingRect = source.boundingRect;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$View$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["viewCoordSysSetBoundingRect"])(_this.view, boundingRect.x, boundingRect.y, boundingRect.width, boundingRect.height);
        // aspectScale and invertLongitute actually is the parameters default raw projection.
        // So we ignore them if projection is given.
        // Ignore default aspect scale if projection exits.
        _this.aspectScale = projection ? 1 : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"](opt.aspectScale, defaultParams.aspectScale);
        return _this;
    }
    Geo.prototype.getRegion = function(name) {
        return this._regionsMap.get(name);
    };
    Geo.prototype.getRegionByCoord = function(coord) {
        var regions = this.regions;
        for(var i = 0; i < regions.length; i++){
            var region = regions[i];
            if (region.type === 'geoJSON' && region.contain(coord)) {
                return regions[i];
            }
        }
    };
    /**
   * Add geoCoord for indexing by name
   */ Geo.prototype.addGeoCoord = function(name, geoCoord) {
        this._nameCoordMap.set(name, geoCoord);
    };
    /**
   * Get geoCoord by name
   */ Geo.prototype.getGeoCoord = function(name) {
        var region = this._regionsMap.get(name);
        // Calculate center only on demand.
        return this._nameCoordMap.get(name) || region && region.getCenter();
    };
    Geo.prototype.dataToPoint = function(data, noRoam, out) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"](data)) {
            // Map area name to geoCoord
            data = this.getGeoCoord(data);
        }
        if (data) {
            var projection = this.projection;
            if (projection) {
                // projection may return null point.
                data = projection.project(data);
            }
            return data && this.view.dataToPoint(data, noRoam, out);
        }
    };
    Geo.prototype.pointToData = function(point, reserved, out) {
        var projection = this.projection;
        if (projection) {
            // projection may return null point.
            point = projection.unproject(point);
        }
        // FIXME: if no `point`, should return [NaN, NaN], rather than undefined.
        //  null/undefined has special meaning in `convertFromPixel`.
        return point && this.view.pointToData(point, out);
    };
    Geo.prototype.convertToPixel = function(ecModel, finder, value) {
        var coordSys = getCoordSys(finder);
        return coordSys === this ? coordSys.dataToPoint(value) : null;
    };
    Geo.prototype.convertFromPixel = function(ecModel, finder, pixel) {
        var coordSys = getCoordSys(finder);
        return coordSys === this ? coordSys.pointToData(pixel) : null;
    };
    Geo.prototype.containPoint = function(point) {
        return this.view.containPoint(point);
    };
    Geo.prototype.getArea = function(tolerance) {
        tolerance = tolerance || 0;
        var rect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$View$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["viewCoordSysCopyViewRect"])(null, this.view);
        rect.x -= tolerance;
        rect.y -= tolerance;
        rect.width += 2 * tolerance;
        rect.height += 2 * tolerance;
        return rect;
    };
    Geo.prototype.shouldClip = function() {
        return this._clip;
    };
    /**
   * @implements CoordinateSystem['getBoundingRect']
   */ Geo.prototype.getBoundingRect = function() {
        return this.view.getBoundingRect();
    };
    /**
   * @implements CoordinateSystem['getViewRect']
   */ Geo.prototype.getViewRect = function() {
        return this.view.getViewRect();
    };
    /**
   * @implements CoordinateSystem['getRoamTransform']
   */ Geo.prototype.getRoamTransform = function() {
        return this.view.getRoamTransform();
    };
    return Geo;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"] // See VIEW_COORD_SYS_TRANS_OVERALL_BACKWARD_COMPATIBILITY
);
;
function getCoordSys(finder) {
    var geoModel = finder.geoModel;
    var seriesModel = finder.seriesModel;
    return geoModel ? geoModel.coordinateSystem : seriesModel ? seriesModel.coordinateSystem // For map series.
     || (seriesModel.getReferringComponents('geo', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SINGLE_REFERRING"]).models[0] || {}).coordinateSystem : null;
}
const __TURBOPACK__default__export__ = Geo;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/GeoJSONResource.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GeoJSONResource",
    ()=>GeoJSONResource
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$parseGeoJson$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/parseGeoJson.js [app-ssr] (ecmascript)");
// Built-in GEO fixer.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$fix$2f$nanhai$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/fix/nanhai.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$fix$2f$textCoord$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/fix/textCoord.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$fix$2f$diaoyuIsland$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/fix/diaoyuIsland.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/BoundingRect.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
var DEFAULT_NAME_PROPERTY = 'name';
var GeoJSONResource = /** @class */ function() {
    function GeoJSONResource(mapName, geoJSON, specialAreas) {
        this.type = 'geoJSON';
        this._parsedMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
        this._mapName = mapName;
        this._specialAreas = specialAreas;
        // PENDING: delay the parse to the first usage to rapid up the FMP?
        this._geoJSON = parseInput(geoJSON);
    }
    /**
   * @param nameMap can be null/undefined
   * @param nameProperty can be null/undefined
   */ GeoJSONResource.prototype.load = function(nameMap, nameProperty) {
        nameProperty = nameProperty || DEFAULT_NAME_PROPERTY;
        var parsed = this._parsedMap.get(nameProperty);
        if (!parsed) {
            var rawRegions = this._parseToRegions(nameProperty);
            parsed = this._parsedMap.set(nameProperty, {
                regions: rawRegions,
                boundingRect: calculateBoundingRect(rawRegions)
            });
        }
        var regionsMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
        var finalRegions = [];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(parsed.regions, function(region) {
            var regionName = region.name;
            // Try use the alias in geoNameMap
            if (nameMap && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasOwn"])(nameMap, regionName)) {
                region = region.cloneShallow(regionName = nameMap[regionName]);
            }
            finalRegions.push(region);
            regionsMap.set(regionName, region);
        });
        return {
            regions: finalRegions,
            boundingRect: parsed.boundingRect || new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](0, 0, 0, 0),
            regionsMap: regionsMap
        };
    };
    GeoJSONResource.prototype._parseToRegions = function(nameProperty) {
        var mapName = this._mapName;
        var geoJSON = this._geoJSON;
        var rawRegions;
        // https://jsperf.com/try-catch-performance-overhead
        try {
            rawRegions = geoJSON ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$parseGeoJson$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(geoJSON, nameProperty) : [];
        } catch (e) {
            throw new Error('Invalid geoJson format\n' + e.message);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$fix$2f$nanhai$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(mapName, rawRegions);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(rawRegions, function(region) {
            var regionName = region.name;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$fix$2f$textCoord$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(mapName, region);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$fix$2f$diaoyuIsland$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(mapName, region);
            // Some area like Alaska in USA map needs to be tansformed
            // to look better
            var specialArea = this._specialAreas && this._specialAreas[regionName];
            if (specialArea) {
                region.transformTo(specialArea.left, specialArea.top, specialArea.width, specialArea.height);
            }
        }, this);
        return rawRegions;
    };
    /**
   * Only for exporting to users.
   * **MUST NOT** used internally.
   */ GeoJSONResource.prototype.getMapForUser = function() {
        return {
            // For backward compatibility, use geoJson
            // PENDING: it has been returning them without clone.
            // do we need to avoid outsite modification?
            geoJson: this._geoJSON,
            geoJSON: this._geoJSON,
            specialAreas: this._specialAreas
        };
    };
    return GeoJSONResource;
}();
;
function calculateBoundingRect(regions) {
    var rect;
    for(var i = 0; i < regions.length; i++){
        var regionRect = regions[i].getBoundingRect();
        rect = rect || regionRect.clone();
        rect.union(regionRect);
    }
    return rect;
}
function parseInput(source) {
    return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(source) ? source : typeof JSON !== 'undefined' && JSON.parse ? JSON.parse(source) : new Function('return (' + source + ');')();
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/GeoModel.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.3.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Component.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$geoCreator$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/geoCreator.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$geoSourceManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/geoSourceManager.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/tokens.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
var GeoModel = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__extends"])(GeoModel, _super);
    function GeoModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = GeoModel.type;
        return _this;
    }
    GeoModel.prototype.init = function(option, parentModel, ecModel) {
        this.mergeDefaultAndTheme(option, ecModel);
        var source = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$geoSourceManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getGeoResource(option.map);
        if (source && source.type === 'geoJSON') {
            var itemStyle = option.itemStyle = option.itemStyle || {};
            if (!('color' in itemStyle)) {
                itemStyle.color = option.defaultItemStyleColor || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].color.backgroundTint;
            }
        }
        // Default label emphasis `show`
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultEmphasis"](option, 'label', [
            'show'
        ]);
    };
    GeoModel.prototype.optionUpdated = function() {
        var _this = this;
        var option = this.option;
        option.regions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$geoCreator$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getFilledRegions(option.regions, option.map, option.nameMap, option.nameProperty);
        var selectedMap = {};
        this._optionModelMap = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["reduce"](option.regions || [], function(optionModelMap, regionOpt) {
            var regionName = regionOpt.name;
            if (regionName) {
                optionModelMap.set(regionName, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](regionOpt, _this, _this.ecModel));
                if (regionOpt.selected) {
                    selectedMap[regionName] = true;
                }
            }
            return optionModelMap;
        }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"]());
        if (!option.selectedMap) {
            option.selectedMap = selectedMap;
        }
    };
    /**
   * Get model of region.
   */ GeoModel.prototype.getRegionModel = function(name) {
        return this._optionModelMap.get(name) || new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](null, this, this.ecModel);
    };
    /**
   * Format label
   * @param name Region name
   */ GeoModel.prototype.getFormattedLabel = function(name, status) {
        var regionModel = this.getRegionModel(name);
        var formatter = status === 'normal' ? regionModel.get([
            'label',
            'formatter'
        ]) : regionModel.get([
            'emphasis',
            'label',
            'formatter'
        ]);
        var params = {
            name: name
        };
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"](formatter)) {
            params.status = status;
            return formatter(params);
        } else if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"](formatter)) {
            return formatter.replace('{a}', name != null ? name : '');
        }
    };
    // PENGING If selectedMode is null ?
    GeoModel.prototype.select = function(name) {
        var option = this.option;
        var selectedMode = option.selectedMode;
        if (!selectedMode) {
            return;
        }
        if (selectedMode !== 'multiple') {
            option.selectedMap = null;
        }
        var selectedMap = option.selectedMap || (option.selectedMap = {});
        selectedMap[name] = true;
    };
    GeoModel.prototype.unSelect = function(name) {
        var selectedMap = this.option.selectedMap;
        if (selectedMap) {
            selectedMap[name] = false;
        }
    };
    GeoModel.prototype.toggleSelected = function(name) {
        this[this.isSelected(name) ? 'unSelect' : 'select'](name);
    };
    GeoModel.prototype.isSelected = function(name) {
        var selectedMap = this.option.selectedMap;
        return !!(selectedMap && selectedMap[name]);
    };
    GeoModel.prototype.__ownRoamView = function() {
        return this.coordinateSystem.view;
    };
    GeoModel.type = 'geo';
    GeoModel.layoutMode = 'box';
    GeoModel.defaultOption = {
        // zlevel: 0,
        z: 0,
        show: true,
        left: 'center',
        top: 'center',
        // Default value:
        // for geoSVG source: 1,
        // for geoJSON source: 0.75.
        aspectScale: null,
        // /// Layout with center and size
        // If you want to put map in a fixed size box with right aspect ratio
        // This two properties may be more convenient
        // layoutCenter: [50%, 50%]
        // layoutSize: 100
        silent: false,
        // Map type
        map: '',
        // Define left-top, right-bottom coords to control view
        // For example, [ [180, 90], [-180, -90] ]
        boundingCoords: null,
        // Default on center of map
        center: null,
        zoom: 1,
        scaleLimit: null,
        // selectedMode: false
        label: {
            show: false,
            color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].color.tertiary
        },
        itemStyle: {
            borderWidth: 0.5,
            borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].color.border
        },
        emphasis: {
            label: {
                show: true,
                color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].color.primary
            },
            itemStyle: {
                color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].color.highlight
            }
        },
        select: {
            label: {
                show: true,
                color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].color.primary
            },
            itemStyle: {
                color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].color.highlight
            }
        },
        regions: []
    };
    return GeoModel;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = GeoModel;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/GeoSVGResource.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GeoSVGResource",
    ()=>GeoSVGResource
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$parseSVG$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/tool/parseSVG.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Group.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Rect.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/BoundingRect.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$parseXML$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/tool/parseXML.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$Region$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/Region.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
/**
 * "region available" means that: enable users to set attribute `name="xxx"` on those tags
 * to make it be a region.
 * 1. region styles and its label styles can be defined in echarts opton:
 * ```js
 * geo: {
 *     regions: [{
 *         name: 'xxx',
 *         itemStyle: { ... },
 *         label: { ... }
 *     }, {
 *         ...
 *     },
 *     ...]
 * };
 * ```
 * 2. name can be duplicated in different SVG tag. All of the tags with the same name share
 * a region option. For exampel if there are two <path> representing two lung lobes. They have
 * no common parents but both of them need to display label "lung" inside.
 */ var REGION_AVAILABLE_SVG_TAG_MAP = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])([
    'rect',
    'circle',
    'line',
    'ellipse',
    'polygon',
    'polyline',
    'path',
    // <text> <tspan> are also enabled because some SVG might paint text itself,
    // but still need to trigger events or tooltip.
    'text',
    'tspan',
    // <g> is also enabled because this case: if multiple tags share one name
    // and need label displayed, every tags will display the name, which is not
    // expected. So we can put them into a <g name="xxx">. Thereby only one label
    // displayed and located based on the bounding rect of the <g>.
    'g'
]);
var GeoSVGResource = /** @class */ function() {
    function GeoSVGResource(mapName, svg) {
        this.type = 'geoSVG';
        // All used graphics. key: hostKey, value: root
        this._usedGraphicMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
        // All unused graphics.
        this._freedGraphics = [];
        this._mapName = mapName;
        // Only perform parse to XML object here, which might be time
        // consiming for large SVG.
        // Although convert XML to zrender element is also time consiming,
        // if we do it here, the clone of zrender elements has to be
        // required. So we do it once for each geo instance, util real
        // performance issues call for optimizing it.
        this._parsedXML = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$parseXML$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseXML"])(svg);
    }
    GeoSVGResource.prototype.load = function() {
        // In the "load" stage, graphic need to be built to
        // get boundingRect for geo coordinate system.
        var firstGraphic = this._firstGraphic;
        // Create the return data structure only when first graphic created.
        // Because they will be used in geo coordinate system update stage,
        // and `regions` will be mounted at `geo` coordinate system,
        // in which there is no "view" info, so that it should better not to
        // make references to graphic elements.
        if (!firstGraphic) {
            firstGraphic = this._firstGraphic = this._buildGraphic(this._parsedXML);
            this._freedGraphics.push(firstGraphic);
            this._boundingRect = this._firstGraphic.boundingRect.clone();
            // PENDING: `nameMap` will not be supported until some real requirement come.
            // if (nameMap) {
            //     named = applyNameMap(named, nameMap);
            // }
            var _a = createRegions(firstGraphic.named), regions = _a.regions, regionsMap = _a.regionsMap;
            this._regions = regions;
            this._regionsMap = regionsMap;
        }
        return {
            boundingRect: this._boundingRect,
            regions: this._regions,
            regionsMap: this._regionsMap
        };
    };
    GeoSVGResource.prototype._buildGraphic = function(svgXML) {
        var result;
        var rootFromParse;
        try {
            result = svgXML && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$parseSVG$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["parseSVG"])(svgXML, {
                ignoreViewBox: true,
                ignoreRootClip: true
            }) || {};
            rootFromParse = result.root;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(rootFromParse != null);
        } catch (e) {
            throw new Error('Invalid svg format\n' + e.message);
        }
        // Note: we keep the covenant that the root has no transform. So always add an extra root.
        var root = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]();
        root.add(rootFromParse);
        root.isGeoSVGGraphicRoot = true;
        // [THE_RULE_OF_VIEWPORT_AND_VIEWBOX]
        //
        // Consider: `<svg width="..." height="..." viewBox="...">`
        // - the `width/height` we call it `svgWidth/svgHeight` for short.
        // - `(0, 0, svgWidth, svgHeight)` defines the viewport of the SVG, or say,
        //   "viewport boundingRect", or `boundingRect` for short.
        // - `viewBox` defines the transform from the real content ot the viewport.
        //   `viewBox` has the same unit as the content of SVG.
        //   If `viewBox` exists, a transform is defined, so the unit of `svgWidth/svgHeight` become
        //   different from the content of SVG. Otherwise, they are the same.
        //
        // If both `svgWidth/svgHeight/viewBox` are specified in a SVG file, the transform rule will be:
        // 0. `boundingRect` is `(0, 0, svgWidth, svgHeight)`. Set it to Geo['_rect'] (View['_rect']).
        // 1. Make a transform from `viewBox` to `boundingRect`.
        //    Note: only support `preserveAspectRatio 'xMidYMid'` here. That is, this transform will preserve
        //    the aspect ratio.
        // 2. Make a transform from boundingRect to Geo['_viewRect'] (View['_viewRect'])
        //    (`Geo`/`View` will do this job).
        //    Note: this transform might not preserve aspect radio, which depending on how users specify
        //    viewRect in echarts option (e.g., `geo.left/top/width/height` will not preserve aspect ratio,
        //    but `geo.layoutCenter/layoutSize` will preserve aspect ratio).
        //
        // If `svgWidth/svgHeight` not specified, we use `viewBox` as the `boundingRect` to make the SVG
        // layout look good.
        //
        // If neither `svgWidth/svgHeight` nor `viewBox` are not specified, we calculate the boundingRect
        // of the SVG content and use them to make SVG layout look good.
        var svgWidth = result.width;
        var svgHeight = result.height;
        var viewBoxRect = result.viewBoxRect;
        var boundingRect = this._boundingRect;
        if (!boundingRect) {
            var bRectX = void 0;
            var bRectY = void 0;
            var bRectWidth = void 0;
            var bRectHeight = void 0;
            if (svgWidth != null) {
                bRectX = 0;
                bRectWidth = svgWidth;
            } else if (viewBoxRect) {
                bRectX = viewBoxRect.x;
                bRectWidth = viewBoxRect.width;
            }
            if (svgHeight != null) {
                bRectY = 0;
                bRectHeight = svgHeight;
            } else if (viewBoxRect) {
                bRectY = viewBoxRect.y;
                bRectHeight = viewBoxRect.height;
            }
            // If both viewBox and svgWidth/svgHeight not specified,
            // we have to determine how to layout those element to make them look good.
            if (bRectX == null || bRectY == null) {
                var calculatedBoundingRect = rootFromParse.getBoundingRect();
                if (bRectX == null) {
                    bRectX = calculatedBoundingRect.x;
                    bRectWidth = calculatedBoundingRect.width;
                }
                if (bRectY == null) {
                    bRectY = calculatedBoundingRect.y;
                    bRectHeight = calculatedBoundingRect.height;
                }
            }
            boundingRect = this._boundingRect = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](bRectX, bRectY, bRectWidth, bRectHeight);
        }
        if (viewBoxRect) {
            var viewBoxTransform = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$parseSVG$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["makeViewBoxTransform"])(viewBoxRect, boundingRect);
            // Only support `preserveAspectRatio 'xMidYMid'`
            rootFromParse.scaleX = rootFromParse.scaleY = viewBoxTransform.scale;
            rootFromParse.x = viewBoxTransform.x;
            rootFromParse.y = viewBoxTransform.y;
        }
        // SVG needs to clip based on `viewBox`. And some SVG files really rely on this feature.
        // They do not strictly confine all of the content inside a display rect, but deliberately
        // use a `viewBox` to define a displayable rect.
        // PENDING:
        // The drawback of the `setClipPath` here is: the region label (genereted by echarts) near the
        // edge might also be clipped, because region labels are put as `textContent` of the SVG path.
        root.setClipPath(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]({
            shape: boundingRect.plain()
        }));
        var named = [];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(result.named, function(namedItem) {
            if (REGION_AVAILABLE_SVG_TAG_MAP.get(namedItem.svgNodeTagLower) != null) {
                named.push(namedItem);
                setSilent(namedItem.el);
            }
        });
        return {
            root: root,
            boundingRect: boundingRect,
            named: named
        };
    };
    /**
   * Consider:
   * (1) One graphic element can not be shared by different `geoView` running simultaneously.
   *     Notice, also need to consider multiple echarts instances share a `mapRecord`.
   * (2) Converting SVG to graphic elements is time consuming.
   * (3) In the current architecture, `load` should be called frequently to get boundingRect,
   *     and it is called without view info.
   * So we maintain graphic elements in this module, and enables `view` to use/return these
   * graphics from/to the pool with it's uid.
   */ GeoSVGResource.prototype.useGraphic = function(hostKey /* , nameMap: NameMap */ ) {
        var usedRootMap = this._usedGraphicMap;
        var svgGraphic = usedRootMap.get(hostKey);
        if (svgGraphic) {
            return svgGraphic;
        }
        svgGraphic = this._freedGraphics.pop() || this._buildGraphic(this._parsedXML);
        usedRootMap.set(hostKey, svgGraphic);
        // PENDING: `nameMap` will not be supported until some real requirement come.
        // `nameMap` can only be obtained from echarts option.
        // The original `named` must not be modified.
        // if (nameMap) {
        //     svgGraphic = extend({}, svgGraphic);
        //     svgGraphic.named = applyNameMap(svgGraphic.named, nameMap);
        // }
        return svgGraphic;
    };
    GeoSVGResource.prototype.freeGraphic = function(hostKey) {
        var usedRootMap = this._usedGraphicMap;
        var svgGraphic = usedRootMap.get(hostKey);
        if (svgGraphic) {
            usedRootMap.removeKey(hostKey);
            this._freedGraphics.push(svgGraphic);
        }
    };
    return GeoSVGResource;
}();
;
function setSilent(el) {
    // Only named element has silent: false, other elements should
    // act as background and has no user interaction.
    el.silent = false;
    // text|tspan will be converted to group.
    if (el.isGroup) {
        el.traverse(function(child) {
            child.silent = false;
        });
    }
}
function createRegions(named) {
    var regions = [];
    var regionsMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
    // Create resions only for the first graphic.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(named, function(namedItem) {
        // Region has feature to calculate center for tooltip or other features.
        // If there is a <g name="xxx">, the center should be the center of the
        // bounding rect of the g.
        if (namedItem.namedFrom != null) {
            return;
        }
        var region = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$Region$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GeoSVGRegion"](namedItem.name, namedItem.el);
        // PENDING: if `nameMap` supported, this region can not be mounted on
        // `this`, but can only be created each time `load()` called.
        regions.push(region);
        // PENDING: if multiple tag named with the same name, only one will be
        // found by `_regionsMap`. `_regionsMap` is used to find a coordinate
        // by name. We use `region.getCenter()` as the coordinate.
        regionsMap.set(namedItem.name, region);
    });
    return {
        regions: regions,
        regionsMap: regionsMap
    };
} // PENDING: `nameMap` will not be supported until some real requirement come.
 // /**
 //  * Use the alias in geoNameMap.
 //  * The input `named` must not be modified.
 //  */
 // function applyNameMap(
 //     named: GeoSVGGraphicRecord['named'],
 //     nameMap: NameMap
 // ): GeoSVGGraphicRecord['named'] {
 //     const result = [] as GeoSVGGraphicRecord['named'];
 //     for (let i = 0; i < named.length; i++) {
 //         let regionGraphic = named[i];
 //         const name = regionGraphic.name;
 //         if (nameMap && nameMap.hasOwnProperty(name)) {
 //             regionGraphic = extend({}, regionGraphic);
 //             regionGraphic.name = name;
 //         }
 //         result.push(regionGraphic);
 //     }
 //     return result;
 // }
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/Region.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GeoJSONLineStringGeometry",
    ()=>GeoJSONLineStringGeometry,
    "GeoJSONPolygonGeometry",
    ()=>GeoJSONPolygonGeometry,
    "GeoJSONRegion",
    ()=>GeoJSONRegion,
    "GeoSVGRegion",
    ()=>GeoSVGRegion,
    "Region",
    ()=>Region
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.3.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/BoundingRect.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/vector.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$contain$2f$polygon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/contain/polygon.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/matrix.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
var TMP_TRANSFORM = [];
function transformPoints(points, transform) {
    for(var p = 0; p < points.length; p++){
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyTransform"](points[p], points[p], transform);
    }
}
function updateBBoxFromPoints(points, min, max, projection) {
    for(var i = 0; i < points.length; i++){
        var p = points[i];
        if (projection) {
            // projection may return null point.
            p = projection.project(p);
        }
        if (p && isFinite(p[0]) && isFinite(p[1])) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["min"](min, min, p);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["max"](max, max, p);
        }
    }
}
function centroid(points) {
    var signedArea = 0;
    var cx = 0;
    var cy = 0;
    var len = points.length;
    var x0 = points[len - 1][0];
    var y0 = points[len - 1][1];
    // Polygon should been closed.
    for(var i = 0; i < len; i++){
        var x1 = points[i][0];
        var y1 = points[i][1];
        var a = x0 * y1 - x1 * y0;
        signedArea += a;
        cx += (x0 + x1) * a;
        cy += (y0 + y1) * a;
        x0 = x1;
        y0 = y1;
    }
    return signedArea ? [
        cx / signedArea / 3,
        cy / signedArea / 3,
        signedArea
    ] : [
        points[0][0] || 0,
        points[0][1] || 0
    ];
}
var Region = /** @class */ function() {
    function Region(name) {
        this.name = name;
    }
    Region.prototype.setCenter = function(center) {
        this._center = center;
    };
    /**
   * Get center point in data unit. That is,
   * for GeoJSONRegion, the unit is lat/lng,
   * for GeoSVGRegion, the unit is SVG local coord.
   */ Region.prototype.getCenter = function() {
        var center = this._center;
        if (!center) {
            // In most cases there are no need to calculate this center.
            // So calculate only when called.
            center = this._center = this.calcCenter();
        }
        return center;
    };
    return Region;
}();
;
var GeoJSONPolygonGeometry = /** @class */ function() {
    function GeoJSONPolygonGeometry(exterior, interiors) {
        this.type = 'polygon';
        this.exterior = exterior;
        this.interiors = interiors;
    }
    return GeoJSONPolygonGeometry;
}();
;
var GeoJSONLineStringGeometry = /** @class */ function() {
    function GeoJSONLineStringGeometry(points) {
        this.type = 'linestring';
        this.points = points;
    }
    return GeoJSONLineStringGeometry;
}();
;
var GeoJSONRegion = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__extends"])(GeoJSONRegion, _super);
    function GeoJSONRegion(name, geometries, cp) {
        var _this = _super.call(this, name) || this;
        _this.type = 'geoJSON';
        _this.geometries = geometries;
        _this._center = cp && [
            cp[0],
            cp[1]
        ];
        return _this;
    }
    GeoJSONRegion.prototype.calcCenter = function() {
        var geometries = this.geometries;
        var largestGeo;
        var largestGeoSize = 0;
        for(var i = 0; i < geometries.length; i++){
            var geo = geometries[i];
            var exterior = geo.exterior;
            // Simple trick to use points count instead of polygon area as region size.
            // Ignore linestring
            var size = exterior && exterior.length;
            if (size > largestGeoSize) {
                largestGeo = geo;
                largestGeoSize = size;
            }
        }
        if (largestGeo) {
            return centroid(largestGeo.exterior);
        }
        // from bounding rect by default.
        var rect = this.getBoundingRect();
        return [
            rect.x + rect.width / 2,
            rect.y + rect.height / 2
        ];
    };
    GeoJSONRegion.prototype.getBoundingRect = function(projection) {
        var rect = this._rect;
        // Always recalculate if using projection.
        if (rect && !projection) {
            return rect;
        }
        var min = [
            Infinity,
            Infinity
        ];
        var max = [
            -Infinity,
            -Infinity
        ];
        var geometries = this.geometries;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(geometries, function(geo) {
            if (geo.type === 'polygon') {
                // Doesn't consider hole
                updateBBoxFromPoints(geo.exterior, min, max, projection);
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(geo.points, function(points) {
                    updateBBoxFromPoints(points, min, max, projection);
                });
            }
        });
        // Normalie invalid bounding.
        if (!(isFinite(min[0]) && isFinite(min[1]) && isFinite(max[0]) && isFinite(max[1]))) {
            min[0] = min[1] = max[0] = max[1] = 0;
        }
        rect = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](min[0], min[1], max[0] - min[0], max[1] - min[1]);
        if (!projection) {
            this._rect = rect;
        }
        return rect;
    };
    GeoJSONRegion.prototype.contain = function(coord) {
        var rect = this.getBoundingRect();
        var geometries = this.geometries;
        if (!rect.contain(coord[0], coord[1])) {
            return false;
        }
        loopGeo: for(var i = 0, len = geometries.length; i < len; i++){
            var geo = geometries[i];
            // Only support polygon.
            if (geo.type !== 'polygon') {
                continue;
            }
            var exterior = geo.exterior;
            var interiors = geo.interiors;
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$contain$2f$polygon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["contain"](exterior, coord[0], coord[1])) {
                // Not in the region if point is in the hole.
                for(var k = 0; k < (interiors ? interiors.length : 0); k++){
                    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$contain$2f$polygon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["contain"](interiors[k], coord[0], coord[1])) {
                        continue loopGeo;
                    }
                }
                return true;
            }
        }
        return false;
    };
    /**
   * Transform the raw coords to target bounding.
   * @param x
   * @param y
   * @param width
   * @param height
   */ GeoJSONRegion.prototype.transformTo = function(x, y, width, height) {
        var rect = this.getBoundingRect();
        var aspect = rect.width / rect.height;
        if (!width) {
            width = aspect * height;
        } else if (!height) {
            height = width / aspect;
        }
        var target = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](x, y, width, height);
        var transform = rect.calculateTransform(target);
        var geometries = this.geometries;
        for(var i = 0; i < geometries.length; i++){
            var geo = geometries[i];
            if (geo.type === 'polygon') {
                transformPoints(geo.exterior, transform);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(geo.interiors, function(interior) {
                    transformPoints(interior, transform);
                });
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(geo.points, function(points) {
                    transformPoints(points, transform);
                });
            }
        }
        rect = this._rect;
        rect.copy(target);
        // Update center
        this._center = [
            rect.x + rect.width / 2,
            rect.y + rect.height / 2
        ];
    };
    GeoJSONRegion.prototype.cloneShallow = function(name) {
        name == null && (name = this.name);
        var newRegion = new GeoJSONRegion(name, this.geometries, this._center);
        newRegion._rect = this._rect;
        newRegion.transformTo = null; // Simply avoid to be called.
        return newRegion;
    };
    return GeoJSONRegion;
}(Region);
;
var GeoSVGRegion = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__extends"])(GeoSVGRegion, _super);
    function GeoSVGRegion(name, elOnlyForCalculate) {
        var _this = _super.call(this, name) || this;
        _this.type = 'geoSVG';
        _this._elOnlyForCalculate = elOnlyForCalculate;
        return _this;
    }
    GeoSVGRegion.prototype.calcCenter = function() {
        var el = this._elOnlyForCalculate;
        var rect = el.getBoundingRect();
        var center = [
            rect.x + rect.width / 2,
            rect.y + rect.height / 2
        ];
        var mat = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["identity"](TMP_TRANSFORM);
        var target = el;
        while(target && !target.isGeoSVGGraphicRoot){
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mul"](mat, target.getLocalTransform(), mat);
            target = target.parent;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invert"](mat, mat);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyTransform"](center, center, mat);
        return center;
    };
    return GeoSVGRegion;
}(Region);
;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/fix/diaoyuIsland.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>fixDiaoyuIsland
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
*/ // Fix for 钓鱼岛
// let Region = require('../Region');
// let zrUtil = require('zrender/lib/core/util');
// let geoCoord = [126, 25];
var points = [
    [
        [
            123.45165252685547,
            25.73527164402261
        ],
        [
            123.49731445312499,
            25.73527164402261
        ],
        [
            123.49731445312499,
            25.750734064600884
        ],
        [
            123.45165252685547,
            25.750734064600884
        ],
        [
            123.45165252685547,
            25.73527164402261
        ]
    ]
];
function fixDiaoyuIsland(mapType, region) {
    if (mapType === 'china' && region.name === '台湾') {
        region.geometries.push({
            type: 'polygon',
            exterior: points[0]
        });
    }
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/fix/nanhai.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>fixNanhai
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
*/ // Fix for 南海诸岛
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$Region$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/Region.js [app-ssr] (ecmascript)");
;
;
var geoCoord = [
    126,
    25
];
var nanhaiName = '南海诸岛';
var points = [
    [
        [
            0,
            3.5
        ],
        [
            7,
            11.2
        ],
        [
            15,
            11.9
        ],
        [
            30,
            7
        ],
        [
            42,
            0.7
        ],
        [
            52,
            0.7
        ],
        [
            56,
            7.7
        ],
        [
            59,
            0.7
        ],
        [
            64,
            0.7
        ],
        [
            64,
            0
        ],
        [
            5,
            0
        ],
        [
            0,
            3.5
        ]
    ],
    [
        [
            13,
            16.1
        ],
        [
            19,
            14.7
        ],
        [
            16,
            21.7
        ],
        [
            11,
            23.1
        ],
        [
            13,
            16.1
        ]
    ],
    [
        [
            12,
            32.2
        ],
        [
            14,
            38.5
        ],
        [
            15,
            38.5
        ],
        [
            13,
            32.2
        ],
        [
            12,
            32.2
        ]
    ],
    [
        [
            16,
            47.6
        ],
        [
            12,
            53.2
        ],
        [
            13,
            53.2
        ],
        [
            18,
            47.6
        ],
        [
            16,
            47.6
        ]
    ],
    [
        [
            6,
            64.4
        ],
        [
            8,
            70
        ],
        [
            9,
            70
        ],
        [
            8,
            64.4
        ],
        [
            6,
            64.4
        ]
    ],
    [
        [
            23,
            82.6
        ],
        [
            29,
            79.8
        ],
        [
            30,
            79.8
        ],
        [
            25,
            82.6
        ],
        [
            23,
            82.6
        ]
    ],
    [
        [
            37,
            70.7
        ],
        [
            43,
            62.3
        ],
        [
            44,
            62.3
        ],
        [
            39,
            70.7
        ],
        [
            37,
            70.7
        ]
    ],
    [
        [
            48,
            51.1
        ],
        [
            51,
            45.5
        ],
        [
            53,
            45.5
        ],
        [
            50,
            51.1
        ],
        [
            48,
            51.1
        ]
    ],
    [
        [
            51,
            35
        ],
        [
            51,
            28.7
        ],
        [
            53,
            28.7
        ],
        [
            53,
            35
        ],
        [
            51,
            35
        ]
    ],
    [
        [
            52,
            22.4
        ],
        [
            55,
            17.5
        ],
        [
            56,
            17.5
        ],
        [
            53,
            22.4
        ],
        [
            52,
            22.4
        ]
    ],
    [
        [
            58,
            12.6
        ],
        [
            62,
            7
        ],
        [
            63,
            7
        ],
        [
            60,
            12.6
        ],
        [
            58,
            12.6
        ]
    ],
    [
        [
            0,
            3.5
        ],
        [
            0,
            93.1
        ],
        [
            64,
            93.1
        ],
        [
            64,
            0
        ],
        [
            63,
            0
        ],
        [
            63,
            92.4
        ],
        [
            1,
            92.4
        ],
        [
            1,
            3.5
        ],
        [
            0,
            3.5
        ]
    ]
];
for(var i = 0; i < points.length; i++){
    for(var k = 0; k < points[i].length; k++){
        points[i][k][0] /= 10.5;
        points[i][k][1] /= -10.5 / 0.75;
        points[i][k][0] += geoCoord[0];
        points[i][k][1] += geoCoord[1];
    }
}
function fixNanhai(mapType, regions) {
    if (mapType === 'china') {
        for(var i = 0; i < regions.length; i++){
            // Already exists.
            if (regions[i].name === nanhaiName) {
                return;
            }
        }
        regions.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$Region$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GeoJSONRegion"](nanhaiName, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"](points, function(exterior) {
            return {
                type: 'polygon',
                exterior: exterior
            };
        }), geoCoord));
    }
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/fix/textCoord.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>fixTextCoords
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
*/ var coordsOffsetMap = {
    '南海诸岛': [
        32,
        80
    ],
    // 全国
    '广东': [
        0,
        -10
    ],
    '香港': [
        10,
        5
    ],
    '澳门': [
        -10,
        10
    ],
    // '北京': [-10, 0],
    '天津': [
        5,
        5
    ]
};
function fixTextCoords(mapType, region) {
    if (mapType === 'china') {
        var coordFix = coordsOffsetMap[region.name];
        if (coordFix) {
            var cp = region.getCenter();
            cp[0] += coordFix[0] / 10.5;
            cp[1] += -coordFix[1] / (10.5 / 0.75);
            region.setCenter(cp);
        }
    }
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/geoCreator.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$Geo$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/Geo.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/layout.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$geoSourceManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/geoSourceManager.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapSeries$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/map/MapSeries.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/vector.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/CoordinateSystem.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$View$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/View.js [app-ssr] (ecmascript)");
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
 * Resize method bound to the geo
 */ function resizeGeo(geoModel, api) {
    var viewCoordSys = this.view;
    var boundingCoords = geoModel.get('boundingCoords');
    if (boundingCoords != null) {
        var leftTop_1 = boundingCoords[0];
        var rightBottom_1 = boundingCoords[1];
        if (!(isFinite(leftTop_1[0]) && isFinite(leftTop_1[1]) && isFinite(rightBottom_1[0]) && isFinite(rightBottom_1[1]))) {
            if ("TURBOPACK compile-time truthy", 1) {
                console.error('Invalid boundingCoords');
            }
        } else {
            // Sample around the lng/lat rect and use projection to calculate actual bounding rect.
            var projection_1 = this.projection;
            if (projection_1) {
                var xMin = leftTop_1[0];
                var yMin = leftTop_1[1];
                var xMax = rightBottom_1[0];
                var yMax = rightBottom_1[1];
                leftTop_1 = [
                    Infinity,
                    Infinity
                ];
                rightBottom_1 = [
                    -Infinity,
                    -Infinity
                ];
                // TODO better way?
                var sampleLine = function(x0, y0, x1, y1) {
                    var dx = x1 - x0;
                    var dy = y1 - y0;
                    for(var i = 0; i <= 100; i++){
                        var p = i / 100;
                        var pt = projection_1.project([
                            x0 + dx * p,
                            y0 + dy * p
                        ]);
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["min"](leftTop_1, leftTop_1, pt);
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["max"](rightBottom_1, rightBottom_1, pt);
                    }
                };
                // Top
                sampleLine(xMin, yMin, xMax, yMin);
                // Right
                sampleLine(xMax, yMin, xMax, yMax);
                // Bottom
                sampleLine(xMax, yMax, xMin, yMax);
                // Left
                sampleLine(xMin, yMax, xMax, yMin);
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$View$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["viewCoordSysSetBoundingRect"])(viewCoordSys, leftTop_1[0], leftTop_1[1], rightBottom_1[0] - leftTop_1[0], rightBottom_1[1] - leftTop_1[1]);
        }
    }
    var rect = viewCoordSys.getBoundingRect();
    var centerOption = geoModel.get('layoutCenter');
    var sizeOption = geoModel.get('layoutSize');
    // Laying out geo on Cartesian works theoretically but not supported yet.
    // Currently, we only support to lay out on matrix/calendar.
    var refContainer = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBoxLayoutReference"](geoModel, api).refContainer;
    var aspect = rect.width / rect.height * this.aspectScale;
    var useCenterAndSize = false;
    var center;
    var size;
    if (centerOption && sizeOption) {
        center = [
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePercent"](centerOption[0], refContainer.width) + refContainer.x,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePercent"](centerOption[1], refContainer.height) + refContainer.y
        ];
        size = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePercent"](sizeOption, Math.min(refContainer.width, refContainer.height));
        if (!isNaN(center[0]) && !isNaN(center[1]) && !isNaN(size)) {
            useCenterAndSize = true;
        } else {
            if ("TURBOPACK compile-time truthy", 1) {
                console.warn('Given layoutCenter or layoutSize data are invalid. Use left/top/width/height instead.');
            }
        }
    }
    var viewRect;
    if (useCenterAndSize) {
        viewRect = {};
        if (aspect > 1) {
            // Width is same with size
            viewRect.width = size;
            viewRect.height = size / aspect;
        } else {
            viewRect.height = size;
            viewRect.width = size * aspect;
        }
        viewRect.y = center[1] - viewRect.height / 2;
        viewRect.x = center[0] - viewRect.width / 2;
    } else {
        // Use left/top/width/height
        var boxLayoutOption = geoModel.getBoxLayoutParams();
        boxLayoutOption.aspect = aspect;
        viewRect = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getLayoutRect"](boxLayoutOption, refContainer);
        viewRect = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyPreserveAspect"](geoModel, viewRect, aspect);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$View$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["viewCoordSysSetViewRect"])(viewCoordSys, viewRect.x, viewRect.y, viewRect.width, viewRect.height);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$View$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["viewCoordSysSetRoamOptionFromModel"])(viewCoordSys, geoModel);
}
// Back compat for ECharts2, where the coord map is set on map series:
// {type: 'map', geoCoord: {'cityA': [116.46,39.92], 'cityA': [119.12,24.61]}},
function setGeoCoords(geo, model) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](model.get('geoCoord'), function(geoCoord, name) {
        geo.addGeoCoord(name, geoCoord);
    });
}
var GeoCreator = /** @class */ function() {
    function GeoCreator() {
        // For deciding which dimensions to use when creating list data
        this.dimensions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$Geo$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["geo2DDimensions"];
    }
    GeoCreator.prototype.create = function(ecModel, api) {
        var geoList = [];
        function getCommonGeoProperties(model) {
            return {
                nameProperty: model.get('nameProperty'),
                aspectScale: model.get('aspectScale'),
                projection: model.get('projection'),
                clip: model.getShallow('clip', true)
            };
        }
        // FIXME Create each time may be slow
        ecModel.eachComponent('geo', function(geoModel, idx) {
            var mapName = geoModel.get('map');
            var geo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$Geo$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](mapName + idx, mapName, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"]({
                nameMap: geoModel.get('nameMap'),
                api: api,
                ecModel: ecModel
            }, getCommonGeoProperties(geoModel)));
            geoList.push(geo);
            // setGeoCoords(geo, geoModel);
            geoModel.coordinateSystem = geo;
            geo.model = geoModel;
            // Inject resize method
            geo.resize = resizeGeo;
            geo.resize(geoModel, api);
        });
        ecModel.eachSeries(function(seriesModel) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["injectCoordSysByOption"])({
                targetModel: seriesModel,
                coordSysType: 'geo',
                coordSysProvider: function() {
                    var geoModel = seriesModel.subType === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapSeries$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIES_TYPE_MAP"] ? seriesModel.getHostGeoModel() : seriesModel.getReferringComponents('geo', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SINGLE_REFERRING"]).models[0];
                    return geoModel && geoModel.coordinateSystem;
                },
                allowNotFound: true
            });
        });
        // If has map series
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"]((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapSeries$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildAllMapSeriesGroups"])(ecModel, true), function(mapSeriesGroup, groupKey) {
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapSeries$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapSeriesGroupHasOwnGeo"])(groupKey)) {
                return;
            }
            var firstDeclaredMapSeries = mapSeriesGroup.r[0];
            var nameMapList = [];
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](mapSeriesGroup.r, function(mapSeries) {
                nameMapList.push(mapSeries.get('nameMap'));
                // MAP_SERIES_GROUP must not be set here, as series filtering is not performed.
                // Clear it first, including series to be filtered.
                mapSeries.seriesGroup = null;
            });
            var mapType = groupKey.slice(1);
            var geo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$Geo$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](mapType, mapType, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"]({
                nameMap: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeAll"](nameMapList),
                api: api,
                ecModel: ecModel
            }, getCommonGeoProperties(firstDeclaredMapSeries)));
            var scaleLimit;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](mapSeriesGroup.r, function(mapSeries) {
                scaleLimit = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"](scaleLimit, mapSeries.get('scaleLimit'));
            });
            geoList.push(geo);
            // Inject resize method
            geo.resize = resizeGeo;
            geo.resize(firstDeclaredMapSeries, api);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](mapSeriesGroup.r, function(mapSeries) {
                mapSeries.coordinateSystem = geo;
                setGeoCoords(geo, mapSeries);
            });
        });
        return geoList;
    };
    /**
   * Fill given regions array
   */ GeoCreator.prototype.getFilledRegions = function(originRegionArr, mapName, nameMap, nameProperty) {
        // Not use the original
        var regionsArr = (originRegionArr || []).slice();
        var dataNameMap = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"]();
        for(var i = 0; i < regionsArr.length; i++){
            dataNameMap.set(regionsArr[i].name, regionsArr[i]);
        }
        var source = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$geoSourceManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].load(mapName, nameMap, nameProperty);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](source.regions, function(region) {
            var name = region.name;
            var regionOption = dataNameMap.get(name);
            // apply specified echarts style in GeoJSON data
            var specifiedGeoJSONRegionStyle = region.properties && region.properties.echartsStyle;
            if (!regionOption) {
                regionOption = {
                    name: name
                };
                regionsArr.push(regionOption);
            }
            specifiedGeoJSONRegionStyle && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["merge"](regionOption, specifiedGeoJSONRegionStyle);
        });
        return regionsArr;
    };
    return GeoCreator;
}();
var geoCreator = new GeoCreator();
const __TURBOPACK__default__export__ = geoCreator;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/geoSourceManager.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$GeoSVGResource$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/GeoSVGResource.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$GeoJSONResource$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/GeoJSONResource.js [app-ssr] (ecmascript)");
;
;
;
var storage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
const __TURBOPACK__default__export__ = {
    /**
   * Compatible with previous `echarts.registerMap`.
   *
   * @usage
   * ```js
   *
   * echarts.registerMap('USA', geoJson, specialAreas);
   *
   * echarts.registerMap('USA', {
   *     geoJson: geoJson,
   *     specialAreas: {...}
   * });
   * echarts.registerMap('USA', {
   *     geoJSON: geoJson,
   *     specialAreas: {...}
   * });
   *
   * echarts.registerMap('airport', {
   *     svg: svg
   * }
   * ```
   *
   * Note:
   * Do not support that register multiple geoJSON or SVG
   * one map name. Because different geoJSON and SVG have
   * different unit. It's not easy to make sure how those
   * units are mapping/normalize.
   * If intending to use multiple geoJSON or SVG, we can
   * use multiple geo coordinate system.
   */ registerMap: function(mapName, rawDef, rawSpecialAreas) {
        if (rawDef.svg) {
            var resource = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$GeoSVGResource$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GeoSVGResource"](mapName, rawDef.svg);
            storage.set(mapName, resource);
        } else {
            // Recommend:
            //     echarts.registerMap('eu', { geoJSON: xxx, specialAreas: xxx });
            // Backward compatibility:
            //     echarts.registerMap('eu', geoJSON, specialAreas);
            //     echarts.registerMap('eu', { geoJson: xxx, specialAreas: xxx });
            var geoJSON = rawDef.geoJson || rawDef.geoJSON;
            if (geoJSON && !rawDef.features) {
                rawSpecialAreas = rawDef.specialAreas;
            } else {
                geoJSON = rawDef;
            }
            var resource = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$GeoJSONResource$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GeoJSONResource"](mapName, geoJSON, rawSpecialAreas);
            storage.set(mapName, resource);
        }
    },
    getGeoResource: function(mapName) {
        return storage.get(mapName);
    },
    /**
   * Only for exporting to users.
   * **MUST NOT** used internally.
   */ getMapForUser: function(mapName) {
        var resource = storage.get(mapName);
        // Do not support return SVG until some real requirement come.
        return resource && resource.type === 'geoJSON' && resource.getMapForUser();
    },
    load: function(mapName, nameMap, nameProperty) {
        var resource = storage.get(mapName);
        if (!resource) {
            if ("TURBOPACK compile-time truthy", 1) {
                console.error('Map ' + mapName + ' not exists. The GeoJSON of the map must be provided.');
            }
            return;
        }
        return resource.load(nameMap, nameProperty);
    }
};
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/parseGeoJson.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>parseGeoJSON
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
*/ /**
 * Parse and decode geo json
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$Region$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/Region.js [app-ssr] (ecmascript)");
;
;
function decode(json) {
    if (!json.UTF8Encoding) {
        return json;
    }
    var jsonCompressed = json;
    var encodeScale = jsonCompressed.UTF8Scale;
    if (encodeScale == null) {
        encodeScale = 1024;
    }
    var features = jsonCompressed.features;
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](features, function(feature) {
        var geometry = feature.geometry;
        var encodeOffsets = geometry.encodeOffsets;
        var coordinates = geometry.coordinates;
        // Geometry may be appeded manually in the script after json loaded.
        // In this case this geometry is usually not encoded.
        if (!encodeOffsets) {
            return;
        }
        switch(geometry.type){
            case 'LineString':
                geometry.coordinates = decodeRing(coordinates, encodeOffsets, encodeScale);
                break;
            case 'Polygon':
                decodeRings(coordinates, encodeOffsets, encodeScale);
                break;
            case 'MultiLineString':
                decodeRings(coordinates, encodeOffsets, encodeScale);
                break;
            case 'MultiPolygon':
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](coordinates, function(rings, idx) {
                    return decodeRings(rings, encodeOffsets[idx], encodeScale);
                });
        }
    });
    // Has been decoded
    jsonCompressed.UTF8Encoding = false;
    return jsonCompressed;
}
function decodeRings(rings, encodeOffsets, encodeScale) {
    for(var c = 0; c < rings.length; c++){
        rings[c] = decodeRing(rings[c], encodeOffsets[c], encodeScale);
    }
}
function decodeRing(coordinate, encodeOffsets, encodeScale) {
    var result = [];
    var prevX = encodeOffsets[0];
    var prevY = encodeOffsets[1];
    for(var i = 0; i < coordinate.length; i += 2){
        var x = coordinate.charCodeAt(i) - 64;
        var y = coordinate.charCodeAt(i + 1) - 64;
        // ZigZag decoding
        x = x >> 1 ^ -(x & 1);
        y = y >> 1 ^ -(y & 1);
        // Delta deocding
        x += prevX;
        y += prevY;
        prevX = x;
        prevY = y;
        // Dequantize
        result.push([
            x / encodeScale,
            y / encodeScale
        ]);
    }
    return result;
}
function parseGeoJSON(geoJson, nameProperty) {
    geoJson = decode(geoJson);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filter"](geoJson.features, function(featureObj) {
        // Output of mapshaper may have geometry null
        return featureObj.geometry && featureObj.properties && featureObj.geometry.coordinates.length > 0;
    }), function(featureObj) {
        var properties = featureObj.properties;
        var geo = featureObj.geometry;
        var geometries = [];
        switch(geo.type){
            case 'Polygon':
                var coordinates = geo.coordinates;
                // According to the GeoJSON specification.
                // First must be exterior, and the rest are all interior(holes).
                geometries.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$Region$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GeoJSONPolygonGeometry"](coordinates[0], coordinates.slice(1)));
                break;
            case 'MultiPolygon':
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](geo.coordinates, function(item) {
                    if (item[0]) {
                        geometries.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$Region$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GeoJSONPolygonGeometry"](item[0], item.slice(1)));
                    }
                });
                break;
            case 'LineString':
                geometries.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$Region$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GeoJSONLineStringGeometry"]([
                    geo.coordinates
                ]));
                break;
            case 'MultiLineString':
                geometries.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$Region$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GeoJSONLineStringGeometry"](geo.coordinates));
        }
        var region = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$Region$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GeoJSONRegion"](properties[nameProperty || 'name'], geometries, properties.cp);
        region.properties = properties;
        return region;
    });
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/radar/IndicatorAxis.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.3.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$Axis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/Axis.js [app-ssr] (ecmascript)");
;
;
var IndicatorAxis = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__extends"])(IndicatorAxis, _super);
    function IndicatorAxis(dim, scale, radiusExtent) {
        var _this = _super.call(this, dim, scale, radiusExtent) || this;
        _this.type = 'value';
        _this.angle = 0;
        _this.name = '';
        return _this;
    }
    return IndicatorAxis;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$Axis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = IndicatorAxis;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/radar/Radar.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$radar$2f$IndicatorAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/radar/IndicatorAxis.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Interval$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/Interval.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$radar$2f$RadarModel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/radar/RadarModel.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisAlignTicks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisAlignTicks.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/layout.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$scaleRawExtentInfo$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/scaleRawExtentInfo.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/helper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisStatistics.js [app-ssr] (ecmascript)");
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
var Radar = /** @class */ function() {
    function Radar(radarModel, ecModel, api) {
        this.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$radar$2f$RadarModel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COORD_SYS_TYPE_RADAR"];
        /**
     *
     * Radar dimensions
     */ this.dimensions = [];
        this._model = radarModel;
        this._indicatorAxes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(radarModel.getIndicatorModels(), function(indicatorModel, idx) {
            var dim = 'indicator_' + idx;
            var indicatorAxis = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$radar$2f$IndicatorAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](dim, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Interval$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]());
            indicatorAxis.name = indicatorModel.get('name');
            // Inject model and axis
            indicatorAxis.model = indicatorModel;
            indicatorModel.axis = indicatorAxis;
            this.dimensions.push(dim);
            return indicatorAxis;
        }, this);
        this.resize(radarModel, api);
    }
    Radar.prototype.getIndicatorAxes = function() {
        return this._indicatorAxes;
    };
    Radar.prototype.dataToPoint = function(value, indicatorIndex) {
        var indicatorAxis = this._indicatorAxes[indicatorIndex];
        return this.coordToPoint(indicatorAxis.dataToCoord(value), indicatorIndex);
    };
    // TODO: API should be coordToPoint([coord, indicatorIndex])
    Radar.prototype.coordToPoint = function(coord, indicatorIndex) {
        var indicatorAxis = this._indicatorAxes[indicatorIndex];
        var angle = indicatorAxis.angle;
        var x = this.cx + coord * Math.cos(angle);
        var y = this.cy - coord * Math.sin(angle);
        return [
            x,
            y
        ];
    };
    Radar.prototype.pointToData = function(pt) {
        var dx = pt[0] - this.cx;
        var dy = pt[1] - this.cy;
        var radius = Math.sqrt(dx * dx + dy * dy);
        dx /= radius;
        dy /= radius;
        var radian = Math.atan2(-dy, dx);
        // Find the closest angle
        // FIXME index can calculated directly
        var minRadianDiff = Infinity;
        var closestAxis;
        var closestAxisIdx = -1;
        for(var i = 0; i < this._indicatorAxes.length; i++){
            var indicatorAxis = this._indicatorAxes[i];
            var diff = Math.abs(radian - indicatorAxis.angle);
            if (diff < minRadianDiff) {
                closestAxis = indicatorAxis;
                closestAxisIdx = i;
                minRadianDiff = diff;
            }
        }
        return [
            closestAxisIdx,
            +(closestAxis && closestAxis.coordToData(radius))
        ];
    };
    Radar.prototype.resize = function(radarModel, api) {
        var refContainer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBoxLayoutReference"])(radarModel, api).refContainer;
        var center = radarModel.get('center');
        var clockwise = radarModel.get('clockwise') || false;
        var viewSize = Math.min(refContainer.width, refContainer.height) / 2;
        this.cx = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePercent"](center[0], refContainer.width) + refContainer.x;
        this.cy = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePercent"](center[1], refContainer.height) + refContainer.y;
        this.startAngle = radarModel.get('startAngle') * Math.PI / 180;
        // radius may be single value like `20`, `'80%'`, or array like `[10, '80%']`
        var radius = radarModel.get('radius');
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(radius) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNumber"])(radius)) {
            radius = [
                0,
                radius
            ];
        }
        this.r0 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePercent"](radius[0], viewSize);
        this.r = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePercent"](radius[1], viewSize);
        var sign = clockwise ? -1 : 1;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(this._indicatorAxes, function(indicatorAxis, idx) {
            indicatorAxis.setExtent(this.r0, this.r);
            var angle = this.startAngle + sign * idx * Math.PI * 2 / this._indicatorAxes.length;
            // Normalize to [-PI, PI]
            angle = Math.atan2(Math.sin(angle), Math.cos(angle));
            indicatorAxis.angle = angle;
        }, this);
    };
    Radar.prototype.update = function(ecModel, api) {
        var indicatorAxes = this._indicatorAxes;
        var radarModel = this._model;
        var splitNumber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ensureValidSplitNumber"])(radarModel.get('splitNumber'), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$radar$2f$RadarModel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RADAR_DEFAULT_SPLIT_NUMBER"]);
        var dummyScale = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$Interval$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]();
        dummyScale.setExtent(0, splitNumber);
        dummyScale.setConfig({
            interval: 1
        });
        // Force all the axis fixing the maxSplitNumber.
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(indicatorAxes, function(indicatorAxis) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$scaleRawExtentInfo$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scaleRawExtentInfoCreate"])(indicatorAxis, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$scaleRawExtentInfo$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AXIS_EXTENT_INFO_BUILD_FROM_COORD_SYS_UPDATE"]);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisAlignTicks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scaleCalcAlign"])(indicatorAxis, dummyScale);
        });
    };
    Radar.prototype.convertToPixel = function(ecModel, finder, value) {
        console.warn('Not implemented.');
        return null;
    };
    Radar.prototype.convertFromPixel = function(ecModel, finder, pixel) {
        console.warn('Not implemented.');
        return null;
    };
    Radar.prototype.containPoint = function(point) {
        console.warn('Not implemented.');
        return false;
    };
    Radar.create = function(ecModel, api) {
        var radarList = [];
        ecModel.eachComponent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$radar$2f$RadarModel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMPONENT_TYPE_RADAR"], function(radarModel) {
            var radar = new Radar(radarModel, ecModel, api);
            radarList.push(radar);
            radarModel.coordinateSystem = radar;
        });
        ecModel.eachSeriesByType(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$radar$2f$RadarModel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIES_TYPE_RADAR"], function(radarSeries) {
            if (radarSeries.get('coordinateSystem') === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$radar$2f$RadarModel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COORD_SYS_TYPE_RADAR"]) {
                // Inject coordinate system
                // @ts-ignore
                var radar = radarSeries.coordinateSystem = radarList[radarSeries.get('radarIndex') || 0];
                if (radar) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(radar.getIndicatorAxes(), function(indicatorAxis) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["associateSeriesWithAxis"])(indicatorAxis, radarSeries, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$radar$2f$RadarModel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COORD_SYS_TYPE_RADAR"]);
                    });
                }
            }
        });
        return radarList;
    };
    /**
   * Radar dimensions is based on the data
   */ Radar.dimensions = [];
    return Radar;
}();
const __TURBOPACK__default__export__ = Radar;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/radar/RadarModel.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COMPONENT_TYPE_RADAR",
    ()=>COMPONENT_TYPE_RADAR,
    "COORD_SYS_TYPE_RADAR",
    ()=>COORD_SYS_TYPE_RADAR,
    "RADAR_DEFAULT_SPLIT_NUMBER",
    ()=>RADAR_DEFAULT_SPLIT_NUMBER,
    "SERIES_TYPE_RADAR",
    ()=>SERIES_TYPE_RADAR,
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.3.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisDefault$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisDefault.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisModelCommonMixin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisModelCommonMixin.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Component.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/tokens.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/component.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
var valueAxisDefault = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisDefault$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].value;
var COORD_SYS_TYPE_RADAR = 'radar';
var COMPONENT_TYPE_RADAR = COORD_SYS_TYPE_RADAR;
var SERIES_TYPE_RADAR = COORD_SYS_TYPE_RADAR;
var RADAR_DEFAULT_SPLIT_NUMBER = 5;
function defaultsShow(opt, show) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaults"]({
        show: show
    }, opt);
}
var RadarModel = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__extends"])(RadarModel, _super);
    function RadarModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = RadarModel.type;
        return _this;
    }
    RadarModel.prototype.optionUpdated = function() {
        var boundaryGap = this.get('boundaryGap');
        var splitNumber = this.get('splitNumber');
        var clockwise = this.get('clockwise');
        var scale = this.get('scale');
        var axisLine = this.get('axisLine');
        var axisTick = this.get('axisTick');
        // let axisType = this.get('axisType');
        var axisLabel = this.get('axisLabel');
        var nameTextStyle = this.get('axisName');
        var showName = this.get([
            'axisName',
            'show'
        ]);
        var nameFormatter = this.get([
            'axisName',
            'formatter'
        ]);
        var nameGap = this.get('axisNameGap');
        var triggerEvent = this.get('triggerEvent');
        var indicatorModels = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"](this.get('indicator') || [], function(indicatorOpt) {
            // PENDING
            if (indicatorOpt.max != null && indicatorOpt.max > 0 && !indicatorOpt.min) {
                indicatorOpt.min = 0;
            } else if (indicatorOpt.min != null && indicatorOpt.min < 0 && !indicatorOpt.max) {
                indicatorOpt.max = 0;
            }
            var iNameTextStyle = nameTextStyle;
            if (indicatorOpt.color != null) {
                iNameTextStyle = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaults"]({
                    color: indicatorOpt.color
                }, nameTextStyle);
            }
            // Use same configuration
            var innerIndicatorOpt = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["merge"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clone"](indicatorOpt), {
                boundaryGap: boundaryGap,
                splitNumber: splitNumber,
                clockwise: clockwise,
                scale: scale,
                axisLine: axisLine,
                axisTick: axisTick,
                // axisType: axisType,
                axisLabel: axisLabel,
                // Compatible with 2 and use text
                name: indicatorOpt.text,
                showName: showName,
                nameLocation: 'end',
                nameGap: nameGap,
                // min: 0,
                nameTextStyle: iNameTextStyle,
                triggerEvent: triggerEvent
            }, false);
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"](nameFormatter)) {
                var indName = innerIndicatorOpt.name;
                innerIndicatorOpt.name = nameFormatter.replace('{value}', indName != null ? indName : '');
            } else if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"](nameFormatter)) {
                innerIndicatorOpt.name = nameFormatter(innerIndicatorOpt.name, innerIndicatorOpt);
            }
            var model = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](innerIndicatorOpt, null, this.ecModel);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mixin"](model, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisModelCommonMixin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AxisModelCommonMixin"].prototype);
            // For triggerEvent.
            model.mainType = 'radar';
            model.componentIndex = this.componentIndex;
            // FIXME: construct an AxisBaseModel directly, rather than mixin.
            // @ts-ignore
            model.uid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUID"])('ec_radar');
            return model;
        }, this);
        this._indicatorModels = indicatorModels;
    };
    RadarModel.prototype.getIndicatorModels = function() {
        return this._indicatorModels;
    };
    RadarModel.type = COMPONENT_TYPE_RADAR;
    RadarModel.defaultOption = {
        // zlevel: 0,
        z: 0,
        center: [
            '50%',
            '50%'
        ],
        radius: '50%',
        startAngle: 90,
        clockwise: false,
        axisName: {
            show: true,
            color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].color.axisLabel
        },
        boundaryGap: [
            0,
            0
        ],
        splitNumber: RADAR_DEFAULT_SPLIT_NUMBER,
        axisNameGap: 15,
        scale: false,
        // Polygon or circle
        shape: 'polygon',
        axisLine: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["merge"]({
            lineStyle: {
                color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].color.neutral20
            }
        }, valueAxisDefault.axisLine),
        axisLabel: defaultsShow(valueAxisDefault.axisLabel, false),
        axisTick: defaultsShow(valueAxisDefault.axisTick, false),
        // axisType: 'value',
        splitLine: defaultsShow(valueAxisDefault.splitLine, true),
        splitArea: defaultsShow(valueAxisDefault.splitArea, true),
        // {text, min, max}
        indicator: []
    };
    return RadarModel;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = RadarModel;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/scaleRawExtentInfo.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AXIS_EXTENT_INFO_BUILD_FROM_COORD_SYS_UPDATE",
    ()=>AXIS_EXTENT_INFO_BUILD_FROM_COORD_SYS_UPDATE,
    "AXIS_EXTENT_INFO_BUILD_FROM_DATA_ZOOM",
    ()=>AXIS_EXTENT_INFO_BUILD_FROM_DATA_ZOOM,
    "ScaleRawExtentInfo",
    ()=>ScaleRawExtentInfo,
    "adoptScaleExtentKindMapping",
    ()=>adoptScaleExtentKindMapping,
    "adoptScaleRawExtentInfoAndPrepare",
    ()=>adoptScaleRawExtentInfoAndPrepare,
    "registerAxisContainShapeHandler",
    ()=>registerAxisContainShapeHandler,
    "scaleRawExtentInfoCreate",
    ()=>scaleRawExtentInfoCreate,
    "scaleRawExtentInfoEnableBoxCoordSysUsage",
    ()=>scaleRawExtentInfoEnableBoxCoordSysUsage
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$contain$2f$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/contain/text.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/helper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisHelper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/CoordinateSystem.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/scaleMapper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisStatistics.js [app-ssr] (ecmascript)");
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
 * NOTICE: Can be only used in `ensureScaleStore(axisLike)`.
 *
 * In most cases the instances of `Axis` and `Scale` are one-to-one mapping and share the same lifecycle.
 * But in some external usage (such as echarts-gl), axis instance does not necessarily exist, and only
 * scale instance and axisModel are used. Therefore we store the internal info on scale instance directly.
 */ var scaleInner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeInner"])();
var AXIS_EXTENT_INFO_BUILD_FROM_COORD_SYS_UPDATE = 1;
var AXIS_EXTENT_INFO_BUILD_FROM_DATA_ZOOM = 2;
var AXIS_EXTENT_INFO_BUILD_FROM_EMPTY = 3;
var ScaleRawExtentInfo = /** @class */ function() {
    function ScaleRawExtentInfo(scale, model, // Typically: data extent from all series on this axis.
    dataExtent, requireStartValue, requireContainShape) {
        var isOrdinal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOrdinalScale"])(scale);
        var axisDataLen = isOrdinal ? model.getCategories().length : null;
        // [CATEGORY_AXIS_MODEL_DATA_IS_EMPTY_ARRAY]:
        // This is only for backward compatibility - `xxxAxis: {data: []}` can declare this axis as
        // a "category" axis and use `series.data` to determine its extent but the axis is blank - only
        // axis line is displayed. This is a conincidence, but it is used in some cases.
        var categoryAxisModelDataIsEmptyArray;
        if (isOrdinal) {
            var axisModelDataArray = model.getCategories(true);
            categoryAxisModelDataIsEmptyArray = axisModelDataArray && !axisModelDataArray.length;
        }
        // NOTE: also considered the input dataExtent may be still in the initialized state `[Infinity, -Infinity]`.
        var dataMM = dataExtent.slice();
        // custom dataMin/dataMax.
        // Also considered `modelDataMinMax[0] > modelDataMinMax[1]` may occur.
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isIntervalScale"])(scale) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isLogScale"])(scale) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTimeScale"])(scale)) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unionExtentStartFromNumber"])(dataMM, parseAxisModelMinMax(scale, model.get('dataMin', true)));
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unionExtentEndFromNumber"])(dataMM, parseAxisModelMinMax(scale, model.get('dataMax', true)));
        }
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extentHasValue"])(dataMM)) {
            // dataMM may be still `[Infinity, -Infinity]`, we use `NaN` on the subsequent calculations
            // to force the `noZoomEffMM` to be `[NaN, NaN]` if needed.
            dataMM[0] = dataMM[1] = NaN;
        }
        var noZoomEffMM = [];
        var fixMM = [
            false,
            false
        ];
        // Notice: When min/max is not set (that is, when there are null/undefined,
        // which is the most common case), these cases should be ensured:
        // (1) For 'ordinal', show all axis.data.
        // (2) For others:
        //      + `boundaryGap` is applied (if min/max set, boundaryGap is
        //      disabled).
        //      + If `needIncludeZero`, min/max should be zero, otherwise, min/max should
        //      be the result that originalExtent enlarged by boundaryGap.
        // (3) If no data, it should be ensured that `scale.setBlank` is set.
        var modelMinRaw = model.get('min', true);
        if (modelMinRaw === 'dataMin') {
            noZoomEffMM[0] = dataMM[0];
            fixMM[0] = true;
        } else {
            noZoomEffMM[0] = parseAxisModelMinMax(scale, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"])(modelMinRaw) ? modelMinRaw({
                min: dataMM[0],
                max: dataMM[1]
            }) : modelMinRaw);
            // If `xxxAxis.min: null/undefined`, min should not be fixed.
            fixMM[0] = noZoomEffMM[0] != null;
        }
        var modelMaxRaw = model.get('max', true);
        if (modelMaxRaw === 'dataMax') {
            noZoomEffMM[1] = dataMM[1];
            fixMM[1] = true;
        } else {
            noZoomEffMM[1] = parseAxisModelMinMax(scale, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"])(modelMaxRaw) ? modelMaxRaw({
                min: dataMM[0],
                max: dataMM[1]
            }) : modelMaxRaw);
            // If `xxxAxis.max: null/undefined`, max should not be fixed.
            fixMM[1] = noZoomEffMM[1] != null;
        }
        var boundaryGap = parseBoundaryGapOption(scale, model);
        var span = !isOrdinal ? dataMM[1] - dataMM[0] || Math.abs(dataMM[0]) : null;
        // NOTE: If a numeric axis min/max is specified as 'dataMin'/'dataMax',
        // `boundaryGap` will not be used.
        if (noZoomEffMM[0] == null) {
            noZoomEffMM[0] = isOrdinal ? categoryAxisModelDataIsEmptyArray ? dataMM[0] : axisDataLen ? 0 : NaN : dataMM[0] - boundaryGap[0] * span;
        }
        if (noZoomEffMM[1] == null) {
            noZoomEffMM[1] = isOrdinal ? categoryAxisModelDataIsEmptyArray ? dataMM[1] : axisDataLen ? axisDataLen - 1 : NaN : dataMM[1] + boundaryGap[1] * span;
        }
        // Normalize to `NaN` if invalid; e.g., this may occur when `dataMM` has Infinity.
        !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidNumberForExtent"])(noZoomEffMM[0]) && (noZoomEffMM[0] = NaN);
        !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidNumberForExtent"])(noZoomEffMM[1]) && (noZoomEffMM[1] = NaN);
        var isBlank = categoryAxisModelDataIsEmptyArray || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["eqNaN"])(noZoomEffMM[0]) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["eqNaN"])(noZoomEffMM[1]) || isOrdinal && !axisDataLen;
        // NOTE: `needIncludeZero` is not applicable to LogScale, TimeScale, OrdinalScale.
        var needIncludeZeroApplicable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isIntervalScale"])(scale);
        var needIncludeZero = needIncludeZeroApplicable && model.needIncludeZero && model.needIncludeZero();
        if (needIncludeZero) {
            if (noZoomEffMM[0] > 0 && noZoomEffMM[1] > 0 && !fixMM[0]) {
                noZoomEffMM[0] = 0;
            // fixMM[0] = true;
            }
            if (noZoomEffMM[0] < 0 && noZoomEffMM[1] < 0 && !fixMM[1]) {
                noZoomEffMM[1] = 0;
            // fixMM[1] = true;
            }
        }
        var needToggleAxisInverse = false;
        if (noZoomEffMM[0] > noZoomEffMM[1]) {
            // Historically, if users set `xxxAxis.min > xxxAxis.max`, or `xxxAxis.max < dataExtent[0]`,
            // or `xxxAxis.min > dataExtent[1]` the behavior is sometimes like `xxxAxis.inverse = true`,
            // sometimes abnormal. We remain backward compatible with the former one, though this feature
            // may not be reasonable.
            // And handle it after "needIncludeZero" is also for backward compatibility.
            noZoomEffMM.reverse();
            needToggleAxisInverse = true;
        }
        var startValue = parseAxisModelMinMax(scale, model.get('startValue', true));
        var startValueSpecified = startValue != null;
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNullableNumberFinite"])(startValue) && requireStartValue) {
            startValue = scale.getDefaultStartValue ? scale.getDefaultStartValue() : 0;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNullableNumberFinite"])(startValue) && (startValueSpecified || !needIncludeZeroApplicable || needIncludeZero)) {
            if (startValue < noZoomEffMM[0] && !fixMM[0]) {
                noZoomEffMM[0] = startValue;
                fixMM[0] = true;
            } else if (startValue > noZoomEffMM[1] && !fixMM[1]) {
                noZoomEffMM[1] = startValue;
                fixMM[1] = true;
            }
        }
        var internal = this._i = {
            scale: scale,
            dataMM: dataMM,
            noZoomEffMM: noZoomEffMM,
            zoomMM: [],
            fixMM: fixMM,
            zoomFixMM: [
                false,
                false
            ],
            startValue: startValue,
            isBlank: isBlank,
            incl0: needIncludeZero,
            tggAxInv: needToggleAxisInverse,
            ctnShp: requireContainShape
        };
        sanitizeExtent(internal, noZoomEffMM);
    }
    ScaleRawExtentInfo.prototype.makeNoZoom = function() {
        return this._i.noZoomEffMM.slice();
    };
    ScaleRawExtentInfo.prototype.makeFinal = function() {
        var internal = this._i;
        var zoomMM = internal.zoomMM;
        var noZoomEffMM = internal.noZoomEffMM;
        var zoomFixMM = internal.zoomFixMM;
        var fixMM = internal.fixMM;
        var result = {
            fixMM: fixMM,
            zoomFixMM: zoomFixMM,
            isBlank: internal.isBlank,
            incl0: internal.incl0,
            tggAxInv: internal.tggAxInv,
            ctnShp: internal.ctnShp,
            effMM: noZoomEffMM.slice()
        };
        var effMM = result.effMM;
        // NOTE: Switching `fixMM` probably leads to abrupt extent changes when draging a `dataZoom`
        //  handle, since `fixMM` impact the "nice extent" and "nice ticks" calculation.
        //  Consider a case:
        //    dataZoom `start` is 2% but its `end` is 100%, (or vice versa), we currently only set `fixMM[0]`
        //    as `true` but remain `fixMM[1]` as `false` for this case to avoid unnecessary abrupt change.
        //    Incidentally, the effect is not unacceptable if we set both `fixMM[0]/[1]` as `true`.
        if (zoomMM[0] != null) {
            effMM[0] = zoomMM[0];
            fixMM[0] = zoomFixMM[0] = true;
        }
        if (zoomMM[1] != null) {
            effMM[1] = zoomMM[1];
            fixMM[1] = zoomFixMM[1] = true;
        }
        sanitizeExtent(internal, effMM);
        return result;
    };
    ScaleRawExtentInfo.prototype.makeRenderInfo = function() {
        return {
            startValue: this._i.startValue
        };
    };
    /**
   * NOTICE:
   *  - Do not set them if the percent are 0% or 100%. (See `AxisProxy['reset']`.)
   *  - The caller must ensure `start <= end` and the range is equal or less then `noZoomEffMM`.
   *    (See `AxisProxy['calculateDataWindow']`.)
   *  - The outcome `_zoomMM` may have both `NullUndefined` and a finite value, like `[undefined, 123]`.
   */ ScaleRawExtentInfo.prototype.setZoomMM = function(idxMinMax, val) {
        this._i.zoomMM[idxMinMax] = val;
    };
    return ScaleRawExtentInfo;
}();
;
/**
 * Should be called when a new extent is created or modified.
 */ function sanitizeExtent(internal, mm) {
    var scale = internal.scale;
    var dataMM = internal.dataMM;
    if (scale.sanitize) {
        mm[0] = scale.sanitize(mm[0], dataMM);
        mm[1] = scale.sanitize(mm[1], dataMM);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ensureExtentAscSimply"])(mm);
    }
}
function parseAxisModelMinMax(scale, minMax) {
    return minMax == null ? null // null/undefined means not specified and other default values can be applied.
     : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["eqNaN"])(minMax) ? NaN // NaN means a deliberate invalid number.
     : scale.parse(minMax);
}
function parseBoundaryGapOption(scale, model) {
    var boundaryGapOptionArr;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOrdinalScale"])(scale)) {
        boundaryGapOptionArr = [
            0,
            0
        ];
    } else {
        var boundaryGap = model.get('boundaryGap');
        if (typeof boundaryGap === 'boolean') {
            if ("TURBOPACK compile-time truthy", 1) {
                if (boundaryGap === true) {
                    console.warn('Boolean type for boundaryGap is only ' + 'allowed for ordinal axis. Please use string in ' + 'percentage instead, e.g., "20%". Currently, ' + 'boundaryGap is set to 0.');
                }
            }
            boundaryGap = null;
        }
        boundaryGapOptionArr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"])(boundaryGap) ? boundaryGap : [
            boundaryGap,
            boundaryGap
        ];
    }
    return [
        parseBoundaryGapOptionItem(boundaryGapOptionArr[0]),
        parseBoundaryGapOptionItem(boundaryGapOptionArr[1])
    ];
}
function parseBoundaryGapOptionItem(opt) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$contain$2f$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePercent"])(typeof opt === 'boolean' ? 0 : opt, 1) || 0;
}
/**
 * NOTE: `associateSeriesWithAxis` is not necessarily called, e.g., when
 * an axis is not used by any series.
 */ function ensureScaleStore(axisLike) {
    var store = scaleInner(axisLike.scale);
    if (!store.extent) {
        store.extent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initExtentForUnion"])();
    }
    return store;
}
function scaleRawExtentInfoEnableBoxCoordSysUsage(axisLike, coordSysDimIdxMap) {
    ensureScaleStore(axisLike).dimIdxInCoord = coordSysDimIdxMap.get(axisLike.dim);
}
function scaleRawExtentInfoCreate(axis, from) {
    var scale = axis.scale;
    var model = axis.model;
    var axisDim = axis.dim;
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(scale && model && axisDim);
    }
    if (scale.rawExtentInfo) {
        if ("TURBOPACK compile-time truthy", 1) {
            // Check for incorrect impl - the duplicated calling of this method is only allowed in
            // these cases:
            //  - First in `AxisProxy['reset']` (for dataZoom)
            //  - Then in `CoordinateSystem['update']`.
            //  - Then after `chart.appendData()` due to `dirtyOnOverallProgress: true`
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(scale.rawExtentInfo.from !== from || from === AXIS_EXTENT_INFO_BUILD_FROM_DATA_ZOOM);
        }
        return;
    }
    scaleRawExtentInfoCreateDeal(scale, axis, axisDim, model, from);
}
function scaleRawExtentInfoCreateDeal(scale, axis, axisDim, model, from) {
    var scaleStore = ensureScaleStore(axis);
    var extent = scaleStore.extent;
    var requireStartValue = false;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["eachSeriesOnAxis"])(axis, function(seriesModel) {
        if (seriesModel.boxCoordinateSystem) {
            // This supports union extent on case like: pie (or other similar series)
            // lays out on cartesian2d.
            var coord = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCoordForCoordSysUsageKindBox"])(seriesModel).coord;
            var dimIdx = scaleStore.dimIdxInCoord;
            if (!(dimIdx >= 0)) {
                if ("TURBOPACK compile-time truthy", 1) {
                    // Require `scaleRawExtentInfoEnableBoxCoordSysUsage` have been called to support it.
                    // But if users set it, give a error log but no exceptions.
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["error"])("Property \"series.coord\" is not supported on axis " + seriesModel.boxCoordinateSystem.type + ".");
                }
            } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"])(coord)) {
                var coordItem = coord[dimIdx];
                if (coordItem != null && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"])(coordItem)) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unionExtentFromNumber"])(extent, scale.parse(coordItem));
                }
            }
        } else if (seriesModel.coordinateSystem) {
            // NOTE: This data may have been filtered by dataZoom on orthogonal axes.
            var data_1 = seriesModel.getData();
            if (data_1) {
                var filter_1 = scale.getFilter ? scale.getFilter() : null;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDataDimensionsOnAxis"])(data_1, axisDim), function(dim) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unionExtentFromExtent"])(extent, data_1.getApproximateExtent(dim, filter_1));
                });
            }
            if (seriesModel.__requireStartValue && seriesModel.__requireStartValue(axis)) {
                requireStartValue = true;
            }
        }
    });
    var requireContainShape = determineRequireContainShape(scale, axis, model);
    var rawExtentInfo = new ScaleRawExtentInfo(scale, model, extent, requireStartValue, requireContainShape);
    injectScaleRawExtentInfo(scale, rawExtentInfo, from);
    scaleStore.extent = null; // Clean up
}
/**
 * `rawExtentInfo` may not be created in some cases, such as no series declared or extra useless
 * axes declared in ec option. In this case we still create a default one for that empty axis.
 */ function scaleRawExtentInfoBuildDefault(axisLike, dataExtent) {
    var scale = axisLike.scale;
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(!scale.rawExtentInfo);
    }
    injectScaleRawExtentInfo(scale, new ScaleRawExtentInfo(scale, axisLike.model, dataExtent, false, false), AXIS_EXTENT_INFO_BUILD_FROM_EMPTY);
}
function injectScaleRawExtentInfo(scale, scaleRawExtentInfo, from) {
    // @ts-ignore
    scale.rawExtentInfo = scaleRawExtentInfo;
    // @ts-ignore
    scaleRawExtentInfo.from = from;
}
function registerAxisContainShapeHandler(// `axisStatKey` is used to quickly omit irrelevant handlers,
// since handlers need to be iterated per axis.
axisStatKey, handler) {
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(!axisContainShapeHandlerMap.get(axisStatKey));
    }
    axisContainShapeHandlerMap.set(axisStatKey, handler);
}
var axisContainShapeHandlerMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
function adoptScaleRawExtentInfoAndPrepare(scale, model, ecModel, axis, externalDataExtent) {
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(!externalDataExtent || !scale.rawExtentInfo);
    }
    if (!scale.rawExtentInfo) {
        scaleRawExtentInfoBuildDefault({
            scale: scale,
            model: model
        }, externalDataExtent || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initExtentForUnion"])());
    }
    var rawExtentResult = scale.rawExtentInfo.makeFinal();
    // NOTE: This `scale.setExtent()` is required by:
    //  - `axisNiceTicks.ts` and `axisAlignTicks.ts`, where the internal `scaleMapper` may be required.
    var effectiveMinMax = rawExtentResult.effMM;
    scale.setExtent(effectiveMinMax[0], effectiveMinMax[1]);
    scale.setBlank(rawExtentResult.isBlank);
    if (axis && rawExtentResult.tggAxInv && ecModel && !ecModel.get('legacyMinMaxDontInverseAxis')) {
        axis.inverse = !axis.inverse;
    }
    return rawExtentResult;
}
function determineRequireContainShape(scale, axis, model) {
    var onBand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isAxisOnBand"])(scale, model);
    var modelContainShape = model.get('containShape', true);
    if (modelContainShape == null && !onBand) {
        modelContainShape = true;
    }
    if (!modelContainShape) {
        return false;
    }
    var requireContainShape = false;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["eachKeyOnAxis"])(axis, function(axisStatKey) {
        requireContainShape = !!axisContainShapeHandlerMap.get(axisStatKey) || requireContainShape;
    });
    return requireContainShape;
}
function adoptScaleExtentKindMapping(axis, scale, rawExtentResult, ecModel) {
    if (!rawExtentResult.ctnShp) {
        return;
    }
    var linearSupplement;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["eachKeyOnAxis"])(axis, function(axisStatKey) {
        var handler = axisContainShapeHandlerMap.get(axisStatKey);
        if (handler) {
            // This feature can be implemented by either expanding axis extent or scale extent. The choice depends
            // on whether series shape sizes are defined in pixels or data space. For example, scatter series glyph
            // sizes is mainly defined in pixel, while bar series `bandWidth` is mainly determined by given percents
            // of data scale. Since currently scatter does not require this feature, we implement it only on the
            // data scale.
            var singleLinearSupplement = handler(axis, ecModel);
            if (singleLinearSupplement) {
                linearSupplement = linearSupplement || [
                    0,
                    0
                ];
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unionExtentStartFromNumber"])(linearSupplement, singleLinearSupplement[0]);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unionExtentEndFromNumber"])(linearSupplement, singleLinearSupplement[1]);
                // Consider the consistency of `onZero` behavior (not varying by series data; otherwise error-prone
                // to users), if any `containShape` really performed on this axis, discourage `onZero`.
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["discourageOnAxisZero"])(axis);
            }
        }
    });
    if (!linearSupplement) {
        return;
    }
    var scaleExtent = scale.getExtent();
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOrdinalScale"])(scale)) {
        if (!axis.onBand) {
            // - Zooming on `OrdinalScale` auto "snaps" to integer ticks, which causes edge shapes to
            //   always overlap and be clipped at the boundaries. Therefore we always supplement it with
            //   half bandWith to avoid that overlapping.
            // - `linearSupplement` is typically [-0.5, 0.5] in this case. `linearSupplement` exists only
            //   if any series call `registerAxisContainShapeHandler`.
            // - PENDING: For historical reason, `onBand: true` has another implementation to handle
            //   this case. Merge them to this?
            scale.setExtent2(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SCALE_EXTENT_KIND_MAPPING"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathMin"])(scaleExtent[0], scaleExtent[0] + linearSupplement[0]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathMax"])(scaleExtent[1], scaleExtent[1] + linearSupplement[1]));
        }
    } else {
        // For other cases, `SCALE_EXTENT_KIND_MAPPING` is only used on the full window of `dataZoom`,
        // where the visual result is more intuitive when zooming: when dataZoom is applied and its ends
        // (i.e., `zoomMM`) do not reach 0% or 100%, the axis ends should exactly respect to the dataZoom
        // ends, and shapes are clipped if overflowing.
        var scaleExtentExpanded = scaleExtent.slice();
        if (!rawExtentResult.zoomFixMM[0]) {
            scaleExtentExpanded[0] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathMin"])(scaleExtentExpanded[0], scale.transformOut(scale.transformIn(scaleExtentExpanded[0], null) + linearSupplement[0], null));
        }
        if (!rawExtentResult.zoomFixMM[1]) {
            scaleExtentExpanded[1] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathMax"])(scaleExtentExpanded[1], scale.transformOut(scale.transformIn(scaleExtentExpanded[1], null) + linearSupplement[1], null));
        }
        if (scaleExtentExpanded[0] < scaleExtent[0] || scaleExtentExpanded[1] > scaleExtent[1]) {
            scale.setExtent2(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$scaleMapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SCALE_EXTENT_KIND_MAPPING"], scaleExtentExpanded[0], scaleExtentExpanded[1]);
        }
    }
// NOTE: since currently `SCALE_EXTENT_KIND_MAPPING` is never required to be displayed, we
// do not need to find a proper precision for that. But if it is required in the future, We
// can use `getAcceptableTickPrecision` to find a proper precision.
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/single/AxisModel.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COMPONENT_TYPE_SINGLE_AXIS",
    ()=>COMPONENT_TYPE_SINGLE_AXIS,
    "COORD_SYS_TYPE_SINGLE",
    ()=>COORD_SYS_TYPE_SINGLE,
    "COORD_SYS_TYPE_SINGLE_AXIS_COMPATIBLE",
    ()=>COORD_SYS_TYPE_SINGLE_AXIS_COMPATIBLE,
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.3.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Component.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisModelCommonMixin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisModelCommonMixin.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
;
;
;
;
var COORD_SYS_TYPE_SINGLE = 'single';
var COORD_SYS_TYPE_SINGLE_AXIS_COMPATIBLE = 'singleAxis';
var COMPONENT_TYPE_SINGLE_AXIS = 'singleAxis';
var SingleAxisModel = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__extends"])(SingleAxisModel, _super);
    function SingleAxisModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = SingleAxisModel.type;
        return _this;
    }
    SingleAxisModel.prototype.getCoordSysModel = function() {
        return this;
    };
    SingleAxisModel.type = COMPONENT_TYPE_SINGLE_AXIS;
    SingleAxisModel.layoutMode = 'box';
    SingleAxisModel.defaultOption = {
        left: '5%',
        top: '5%',
        right: '5%',
        bottom: '5%',
        type: 'value',
        position: 'bottom',
        orient: 'horizontal',
        axisLine: {
            show: true,
            lineStyle: {
                width: 1,
                type: 'solid'
            }
        },
        // Single coordinate system and single axis is the,
        // which is used as the parent tooltip model.
        // same model, so we set default tooltip show as true.
        tooltip: {
            show: true
        },
        axisTick: {
            show: true,
            length: 6,
            lineStyle: {
                width: 1
            }
        },
        axisLabel: {
            show: true,
            interval: 'auto'
        },
        splitLine: {
            show: true,
            lineStyle: {
                type: 'dashed',
                opacity: 0.2
            }
        },
        jitter: 0,
        jitterOverlap: true,
        jitterMargin: 2
    };
    return SingleAxisModel;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mixin"])(SingleAxisModel, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisModelCommonMixin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AxisModelCommonMixin"].prototype);
const __TURBOPACK__default__export__ = SingleAxisModel;
}),
];

//# sourceMappingURL=10pt_echarts_lib_coord_1gx0y5_._.js.map