(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/bar/BarSeries.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$bar$2f$BaseBarSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/bar/BaseBarSeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createSeriesData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createSeriesData.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/tokens.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$layout$2f$barCommon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/layout/barCommon.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
var BarSeriesModel = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(BarSeriesModel, _super);
    function BarSeriesModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = BarSeriesModel.type;
        return _this;
    }
    BarSeriesModel.prototype.getInitialData = function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createSeriesData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(null, this, {
            useEncodeDefaulter: true,
            createInvertedIndices: !!this.get('realtimeSort', true) || null
        });
    };
    /**
   * @override
   */ BarSeriesModel.prototype.getProgressive = function() {
        // Do not support progressive in normal mode.
        return this.get('large') ? this.get('progressive') : false;
    };
    /**
   * @implement
   */ BarSeriesModel.prototype.__preparePipelineContext = function(view, pipeline) {
        var context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["preparePipelineContext"])(this, view, pipeline);
        // Do not support progressive in normal mode.
        if (context.progressiveRender) {
            context.large = true;
        }
        return context;
    };
    BarSeriesModel.prototype.brushSelector = function(dataIndex, data, selectors) {
        return selectors.rect(data.getItemLayout(dataIndex));
    };
    BarSeriesModel.type = 'series.' + __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$layout$2f$barCommon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_BAR"];
    BarSeriesModel.dependencies = [
        'grid',
        'polar'
    ];
    BarSeriesModel.defaultOption = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inheritDefaultOption"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$bar$2f$BaseBarSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].defaultOption, {
        // If clipped
        // Only available on cartesian2d
        clip: true,
        roundCap: false,
        showBackground: false,
        backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)',
            borderColor: null,
            borderWidth: 0,
            borderType: 'solid',
            borderRadius: 0,
            shadowBlur: 0,
            shadowColor: null,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            opacity: 1
        },
        select: {
            itemStyle: {
                borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.primary,
                borderWidth: 2
            }
        },
        realtimeSort: false
    });
    return BarSeriesModel;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$bar$2f$BaseBarSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = BarSeriesModel;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/bar/BarView.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Path.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Group.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rect$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Rect.js [app-client] (ecmascript) <export default as Rect>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Sector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sector$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Sector.js [app-client] (ecmascript) <export default as Sector>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/animation/basicTransition.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/graphic.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/innerStore.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/states.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/label/labelStyle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$throttle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/throttle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createClipPathFromCoordSys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createClipPathFromCoordSys.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$shape$2f$sausage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/shape/sausage.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/view/Chart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$CoordinateSystem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/CoordinateSystem.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$labelHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/labelHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$sectorLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/label/sectorLabel.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$sectorHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/sectorHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$layout$2f$barCommon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/layout/barCommon.js [app-client] (ecmascript)");
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
var mathMax = Math.max;
var mathMin = Math.min;
var BarView = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(BarView, _super);
    function BarView() {
        var _this = _super.call(this) || this;
        _this.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$layout$2f$barCommon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_BAR"];
        _this._isFirstFrame = true;
        return _this;
    }
    BarView.prototype.render = function(seriesModel, ecModel, api, payload) {
        this._model = seriesModel;
        this._removeOnRenderedListener(api);
        this._updateDrawMode(seriesModel);
        var coordinateSystemType = seriesModel.get('coordinateSystem');
        if (coordinateSystemType === 'cartesian2d' || coordinateSystemType === 'polar') {
            // Clear previously rendered progressive elements.
            this._progressiveEls = null;
            this._isLargeDraw ? this._renderLarge(seriesModel, ecModel, api) : this._renderNormal(seriesModel, ecModel, api, payload);
        } else if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warn"])('Only cartesian2d and polar supported for bar.');
        }
    };
    BarView.prototype.incrementalPrepareRender = function(seriesModel) {
        this._clear();
        this._updateDrawMode(seriesModel);
        // incremental also need to clip, otherwise might be overlow.
        // But must not set clip in each frame, otherwise all of the children will be marked redraw.
        this._updateLargeClip(seriesModel);
    };
    BarView.prototype.incrementalRender = function(params, seriesModel) {
        // Reset for eachRendered
        this._progressiveEls = [];
        // Do not support progressive in normal mode.
        this._incrementalRenderLarge(params, seriesModel);
    };
    BarView.prototype.eachRendered = function(cb) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["traverseElements"])(this._progressiveEls || this.group, cb);
    };
    BarView.prototype._updateDrawMode = function(seriesModel) {
        var isLargeDraw = seriesModel.pipelineContext.large;
        if (this._isLargeDraw == null || isLargeDraw !== this._isLargeDraw) {
            this._isLargeDraw = isLargeDraw;
            this._clear();
        }
    };
    BarView.prototype._renderNormal = function(seriesModel, ecModel, api, payload) {
        var group = this.group;
        var data = seriesModel.getData();
        var oldData = this._data;
        var coord = seriesModel.coordinateSystem;
        var baseAxis = coord.getBaseAxis();
        var isHorizontalOrRadial;
        if (coord.type === 'cartesian2d') {
            isHorizontalOrRadial = baseAxis.isHorizontal();
        } else if (coord.type === 'polar') {
            isHorizontalOrRadial = baseAxis.dim === 'angle';
        }
        var animationModel = seriesModel.isAnimationEnabled() ? seriesModel : null;
        var realtimeSortCfg = shouldRealtimeSort(seriesModel, coord);
        if (realtimeSortCfg) {
            this._enableRealtimeSort(realtimeSortCfg, data, api);
        }
        var needsClip = seriesModel.get('clip', true) || realtimeSortCfg;
        // Both `cartesian2d` and `polar` has `getArea()`.
        var coordSysClipArea = coord.getArea();
        // If there is clipPath created in large mode. Remove it.
        group.removeClipPath();
        // We don't use clipPath in normal mode because we needs a perfect animation
        // And don't want the label are clipped.
        // Instead, `Clipper` is used in normal mode.
        var roundCap = seriesModel.get('roundCap', true);
        var drawBackground = seriesModel.get('showBackground', true);
        var backgroundModel = seriesModel.getModel('backgroundStyle');
        var barBorderRadius = backgroundModel.get('borderRadius') || 0;
        var bgEls = [];
        var oldBgEls = this._backgroundEls;
        var isInitSort = payload && payload.isInitSort;
        var isChangeOrder = payload && payload.type === 'changeAxisOrder';
        function createBackground(dataIndex) {
            var bgLayout = getLayout[coord.type](data, dataIndex);
            if (!bgLayout) {
                return null;
            }
            var bgEl = createBackgroundEl(coord, isHorizontalOrRadial, bgLayout);
            bgEl.useStyle(backgroundModel.getItemStyle());
            // Only cartesian2d support borderRadius.
            if (coord.type === 'cartesian2d') {
                bgEl.setShape('r', barBorderRadius);
            } else {
                bgEl.setShape('cornerRadius', barBorderRadius);
            }
            bgEls[dataIndex] = bgEl;
            return bgEl;
        }
        ;
        data.diff(oldData).add(function(dataIndex) {
            var itemModel = data.getItemModel(dataIndex);
            var layout = getLayout[coord.type](data, dataIndex, itemModel);
            if (!layout) {
                return;
            }
            if (drawBackground) {
                createBackground(dataIndex);
            }
            // If dataZoom in filteMode: 'empty', the baseValue can be set as NaN in "axisProxy".
            if (!data.hasValue(dataIndex) || !isValidLayout[coord.type](layout)) {
                return;
            }
            var isClipped = false;
            if (needsClip) {
                // Clip will modify the layout params.
                // And return a boolean to determine if the shape are fully clipped.
                isClipped = clip[coord.type](coordSysClipArea, layout);
            }
            var el = elementCreator[coord.type](seriesModel, data, dataIndex, layout, isHorizontalOrRadial, animationModel, baseAxis.model, false, roundCap);
            if (realtimeSortCfg) {
                /**
         * Force label animation because even if the element is
         * ignored because it's clipped, it may not be clipped after
         * changing order. Then, if not using forceLabelAnimation,
         * the label animation was never started, in which case,
         * the label will be the final value and doesn't have label
         * animation.
         */ el.forceLabelAnimation = true;
            }
            updateStyle(el, data, dataIndex, itemModel, layout, seriesModel, isHorizontalOrRadial, coord.type === 'polar');
            if (isInitSort) {
                el.attr({
                    shape: layout
                });
            } else if (realtimeSortCfg) {
                updateRealtimeAnimation(realtimeSortCfg, animationModel, el, layout, dataIndex, isHorizontalOrRadial, false, false);
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initProps"])(el, {
                    shape: layout
                }, seriesModel, dataIndex);
            }
            data.setItemGraphicEl(dataIndex, el);
            group.add(el);
            el.ignore = isClipped;
        }).update(function(newIndex, oldIndex) {
            var itemModel = data.getItemModel(newIndex);
            var layout = getLayout[coord.type](data, newIndex, itemModel);
            if (!layout) {
                return;
            }
            if (drawBackground) {
                var bgEl = void 0;
                if (oldBgEls.length === 0) {
                    bgEl = createBackground(oldIndex);
                } else {
                    bgEl = oldBgEls[oldIndex];
                    bgEl.useStyle(backgroundModel.getItemStyle());
                    // Only cartesian2d support borderRadius.
                    if (coord.type === 'cartesian2d') {
                        bgEl.setShape('r', barBorderRadius);
                    } else {
                        bgEl.setShape('cornerRadius', barBorderRadius);
                    }
                    bgEls[newIndex] = bgEl;
                }
                var bgLayout = getLayout[coord.type](data, newIndex);
                var shape = createBackgroundShape(isHorizontalOrRadial, bgLayout, coord);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProps"])(bgEl, {
                    shape: shape
                }, animationModel, newIndex);
            }
            var el = oldData.getItemGraphicEl(oldIndex);
            if (!data.hasValue(newIndex) || !isValidLayout[coord.type](layout)) {
                group.remove(el);
                return;
            }
            var isClipped = false;
            if (needsClip) {
                isClipped = clip[coord.type](coordSysClipArea, layout);
                if (isClipped) {
                    group.remove(el);
                }
            }
            var roundCapChanged = el && (el.type === 'sector' && roundCap || el.type === 'sausage' && !roundCap);
            if (roundCapChanged) {
                // roundCap changed, there is no way to use animation from a `sector` to a `sausage` shape,
                // so remove the old one and create a new shape
                el && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeElementWithFadeOut"])(el, seriesModel, oldIndex);
                el = null;
            }
            if (!el) {
                el = elementCreator[coord.type](seriesModel, data, newIndex, layout, isHorizontalOrRadial, animationModel, baseAxis.model, true, roundCap);
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveOldStyle"])(el);
            }
            if (realtimeSortCfg) {
                el.forceLabelAnimation = true;
            }
            if (isChangeOrder) {
                var textEl = el.getTextContent();
                if (textEl) {
                    var labelInnerStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["labelInner"])(textEl);
                    if (labelInnerStore.prevValue != null) {
                        /**
             * Set preValue to be value so that no new label
             * should be started, otherwise, it will take a full
             * `animationDurationUpdate` time to finish the
             * animation, which is not expected.
             */ labelInnerStore.prevValue = labelInnerStore.value;
                    }
                }
            } else {
                updateStyle(el, data, newIndex, itemModel, layout, seriesModel, isHorizontalOrRadial, coord.type === 'polar');
            }
            if (isInitSort) {
                el.attr({
                    shape: layout
                });
            } else if (realtimeSortCfg) {
                updateRealtimeAnimation(realtimeSortCfg, animationModel, el, layout, newIndex, isHorizontalOrRadial, true, isChangeOrder);
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProps"])(el, {
                    shape: layout
                }, seriesModel, newIndex, null);
            }
            data.setItemGraphicEl(newIndex, el);
            el.ignore = isClipped;
            group.add(el);
        }).remove(function(dataIndex) {
            var el = oldData.getItemGraphicEl(dataIndex);
            el && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeElementWithFadeOut"])(el, seriesModel, dataIndex);
        }).execute();
        var bgGroup = this._backgroundGroup || (this._backgroundGroup = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]());
        bgGroup.removeAll();
        for(var i = 0; i < bgEls.length; ++i){
            bgGroup.add(bgEls[i]);
        }
        group.add(bgGroup);
        this._backgroundEls = bgEls;
        this._data = data;
    };
    BarView.prototype._renderLarge = function(seriesModel, ecModel, api) {
        this._clear();
        createLarge(seriesModel, this.group);
        this._updateLargeClip(seriesModel);
    };
    BarView.prototype._incrementalRenderLarge = function(params, seriesModel) {
        this._removeBackground();
        createLarge(seriesModel, this.group, this._progressiveEls, true);
    };
    BarView.prototype._updateLargeClip = function(seriesModel) {
        // Use clipPath in large mode.
        var clipPath = seriesModel.get('clip', true) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createClipPathFromCoordSys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClipPath"])(seriesModel.coordinateSystem, false, seriesModel);
        var group = this.group;
        if (clipPath) {
            group.setClipPath(clipPath);
        } else {
            group.removeClipPath();
        }
    };
    BarView.prototype._enableRealtimeSort = function(realtimeSortCfg, data, api) {
        var _this = this;
        // If no data in the first frame, wait for data to initSort
        if (!data.count()) {
            return;
        }
        var baseAxis = realtimeSortCfg.baseAxis;
        if (this._isFirstFrame) {
            this._dispatchInitSort(data, realtimeSortCfg, api);
            this._isFirstFrame = false;
        } else {
            var orderMapping_1 = function(idx) {
                var el = data.getItemGraphicEl(idx);
                var shape = el && el.shape;
                return shape && // The result should be consistent with the initial sort by data value.
                // Do not support the case that both positive and negative exist.
                Math.abs(baseAxis.isHorizontal() ? shape.height : shape.width) || 0;
            };
            this._onRendered = function() {
                _this._updateSortWithinSameData(data, orderMapping_1, baseAxis, api);
            };
            api.getZr().on('rendered', this._onRendered);
        }
    };
    BarView.prototype._dataSort = function(data, baseAxis, orderMapping) {
        var info = [];
        data.each(data.mapDimension(baseAxis.dim), function(ordinalNumber, dataIdx) {
            var mappedValue = orderMapping(dataIdx);
            mappedValue = mappedValue == null ? NaN : mappedValue;
            info.push({
                dataIndex: dataIdx,
                mappedValue: mappedValue,
                ordinalNumber: ordinalNumber
            });
        });
        info.sort(function(a, b) {
            // If NaN, it will be treated as min val.
            return b.mappedValue - a.mappedValue;
        });
        return {
            ordinalNumbers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(info, function(item) {
                return item.ordinalNumber;
            })
        };
    };
    BarView.prototype._isOrderChangedWithinSameData = function(data, orderMapping, baseAxis) {
        var scale = baseAxis.scale;
        var ordinalDataDim = data.mapDimension(baseAxis.dim);
        var lastValue = Number.MAX_VALUE;
        for(var tickNum = 0, len = scale.getOrdinalMeta().categories.length; tickNum < len; ++tickNum){
            var rawIdx = data.rawIndexOf(ordinalDataDim, scale.getRawOrdinalNumber(tickNum));
            var value = rawIdx < 0 ? Number.MIN_VALUE : orderMapping(data.indexOfRawIndex(rawIdx));
            if (value > lastValue) {
                return true;
            }
            lastValue = value;
        }
        return false;
    };
    /*
   * Consider the case when A and B changed order, whose representing
   * bars are both out of sight, we don't wish to trigger reorder action
   * as long as the order in the view doesn't change.
   */ BarView.prototype._isOrderDifferentInView = function(orderInfo, baseAxis) {
        var scale = baseAxis.scale;
        var extent = scale.getExtent();
        var tickNum = Math.max(0, extent[0]);
        var tickMax = Math.min(extent[1], scale.getOrdinalMeta().categories.length - 1);
        for(; tickNum <= tickMax; ++tickNum){
            if (orderInfo.ordinalNumbers[tickNum] !== scale.getRawOrdinalNumber(tickNum)) {
                return true;
            }
        }
    };
    BarView.prototype._updateSortWithinSameData = function(data, orderMapping, baseAxis, api) {
        if (!this._isOrderChangedWithinSameData(data, orderMapping, baseAxis)) {
            return;
        }
        var sortInfo = this._dataSort(data, baseAxis, orderMapping);
        if (this._isOrderDifferentInView(sortInfo, baseAxis)) {
            this._removeOnRenderedListener(api);
            api.dispatchAction({
                type: 'changeAxisOrder',
                componentType: baseAxis.dim + 'Axis',
                axisId: baseAxis.index,
                sortInfo: sortInfo
            });
        }
    };
    BarView.prototype._dispatchInitSort = function(data, realtimeSortCfg, api) {
        var baseAxis = realtimeSortCfg.baseAxis;
        var sortResult = this._dataSort(data, baseAxis, function(dataIdx) {
            return data.get(data.mapDimension(realtimeSortCfg.otherAxis.dim), dataIdx);
        });
        api.dispatchAction({
            type: 'changeAxisOrder',
            componentType: baseAxis.dim + 'Axis',
            isInitSort: true,
            axisId: baseAxis.index,
            sortInfo: sortResult
        });
    };
    BarView.prototype.remove = function(ecModel, api) {
        this._clear(this._model);
        this._removeOnRenderedListener(api);
    };
    BarView.prototype.dispose = function(ecModel, api) {
        this._removeOnRenderedListener(api);
    };
    BarView.prototype._removeOnRenderedListener = function(api) {
        if (this._onRendered) {
            api.getZr().off('rendered', this._onRendered);
            this._onRendered = null;
        }
    };
    BarView.prototype._clear = function(model) {
        var group = this.group;
        var data = this._data;
        if (model && model.isAnimationEnabled() && data && !this._isLargeDraw) {
            this._removeBackground();
            this._backgroundEls = [];
            data.eachItemGraphicEl(function(el) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeElementWithFadeOut"])(el, model, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getECData"])(el).dataIndex);
            });
        } else {
            group.removeAll();
        }
        this._data = null;
        this._isFirstFrame = true;
    };
    BarView.prototype._removeBackground = function() {
        this.group.remove(this._backgroundGroup);
        this._backgroundGroup = null;
    };
    BarView.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$layout$2f$barCommon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_BAR"];
    return BarView;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
var clip = {
    cartesian2d: function(coordSysClipArea, layout) {
        var signWidth = layout.width < 0 ? -1 : 1;
        var signHeight = layout.height < 0 ? -1 : 1;
        // Needs positive width and height
        if (signWidth < 0) {
            layout.x += layout.width;
            layout.width = -layout.width;
        }
        if (signHeight < 0) {
            layout.y += layout.height;
            layout.height = -layout.height;
        }
        var coordSysX2 = coordSysClipArea.x + coordSysClipArea.width;
        var coordSysY2 = coordSysClipArea.y + coordSysClipArea.height;
        var x = mathMax(layout.x, coordSysClipArea.x);
        var x2 = mathMin(layout.x + layout.width, coordSysX2);
        var y = mathMax(layout.y, coordSysClipArea.y);
        var y2 = mathMin(layout.y + layout.height, coordSysY2);
        var xClipped = x2 < x;
        var yClipped = y2 < y;
        // When xClipped or yClipped, the element will be marked as `ignore`.
        // But we should also place the element at the edge of the coord sys bounding rect.
        // Because if data changed and the bar shows again, its transition animation
        // will begin at this place.
        layout.x = xClipped && x > coordSysX2 ? x2 : x;
        layout.y = yClipped && y > coordSysY2 ? y2 : y;
        layout.width = xClipped ? 0 : x2 - x;
        layout.height = yClipped ? 0 : y2 - y;
        // Reverse back
        if (signWidth < 0) {
            layout.x += layout.width;
            layout.width = -layout.width;
        }
        if (signHeight < 0) {
            layout.y += layout.height;
            layout.height = -layout.height;
        }
        return xClipped || yClipped;
    },
    polar: function(coordSysClipArea, layout) {
        var signR = layout.r0 <= layout.r ? 1 : -1;
        // Make sure r is larger than r0
        if (signR < 0) {
            var tmp = layout.r;
            layout.r = layout.r0;
            layout.r0 = tmp;
        }
        var r = mathMin(layout.r, coordSysClipArea.r);
        var r0 = mathMax(layout.r0, coordSysClipArea.r0);
        layout.r = r;
        layout.r0 = r0;
        var clipped = r - r0 < 0;
        // Reverse back
        if (signR < 0) {
            var tmp = layout.r;
            layout.r = layout.r0;
            layout.r0 = tmp;
        }
        return clipped;
    }
};
var elementCreator = {
    cartesian2d: function(seriesModel, data, newIndex, layout, isHorizontal, animationModel, axisModel, isUpdate, roundCap) {
        var rect = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rect$3e$__["Rect"]({
            shape: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])({}, layout),
            z2: 1
        });
        rect.__dataIndex = newIndex;
        rect.name = 'item';
        if (animationModel) {
            var rectShape = rect.shape;
            var animateProperty = isHorizontal ? 'height' : 'width';
            rectShape[animateProperty] = 0;
        }
        return rect;
    },
    polar: function(seriesModel, data, newIndex, layout, isRadial, animationModel, axisModel, isUpdate, roundCap) {
        var ShapeClass = !isRadial && roundCap ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$shape$2f$sausage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Sector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sector$3e$__["Sector"];
        var sector = new ShapeClass({
            shape: layout,
            z2: 1
        });
        sector.name = 'item';
        var positionMap = createPolarPositionMapping(isRadial);
        sector.calculateTextPosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$sectorLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSectorCalculateTextPosition"])(positionMap, {
            isRoundCap: ShapeClass === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$shape$2f$sausage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
        });
        // Animation
        if (animationModel) {
            var sectorShape = sector.shape;
            var animateProperty = isRadial ? 'r' : 'endAngle';
            var animateTarget = {};
            sectorShape[animateProperty] = isRadial ? layout.r0 : layout.startAngle;
            animateTarget[animateProperty] = layout[animateProperty];
            (isUpdate ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProps"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initProps"])(sector, {
                shape: animateTarget
            }, animationModel);
        }
        return sector;
    }
};
function shouldRealtimeSort(seriesModel, coordSys) {
    var realtimeSortOption = seriesModel.get('realtimeSort', true);
    var baseAxis = coordSys.getBaseAxis();
    if ("TURBOPACK compile-time truthy", 1) {
        if (realtimeSortOption) {
            if (baseAxis.type !== 'category') {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warn"])('`realtimeSort` will not work because this bar series is not based on a category axis.');
            }
            if (coordSys.type !== 'cartesian2d') {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warn"])('`realtimeSort` will not work because this bar series is not on cartesian2d.');
            }
        }
    }
    if (realtimeSortOption && baseAxis.type === 'category' && coordSys.type === 'cartesian2d') {
        return {
            baseAxis: baseAxis,
            otherAxis: coordSys.getOtherAxis(baseAxis)
        };
    }
}
function updateRealtimeAnimation(realtimeSortCfg, seriesAnimationModel, el, layout, newIndex, isHorizontal, isUpdate, isChangeOrder) {
    var seriesTarget;
    var axisTarget;
    if (isHorizontal) {
        axisTarget = {
            x: layout.x,
            width: layout.width
        };
        seriesTarget = {
            y: layout.y,
            height: layout.height
        };
    } else {
        axisTarget = {
            y: layout.y,
            height: layout.height
        };
        seriesTarget = {
            x: layout.x,
            width: layout.width
        };
    }
    if (!isChangeOrder) {
        // Keep the original growth animation if only axis order changed.
        // Not start a new animation.
        (isUpdate ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProps"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initProps"])(el, {
            shape: seriesTarget
        }, seriesAnimationModel, newIndex, null);
    }
    var axisAnimationModel = seriesAnimationModel ? realtimeSortCfg.baseAxis.model : null;
    (isUpdate ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProps"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initProps"])(el, {
        shape: axisTarget
    }, axisAnimationModel, newIndex);
}
function checkPropertiesNotValid(obj, props) {
    for(var i = 0; i < props.length; i++){
        if (!isFinite(obj[props[i]])) {
            return true;
        }
    }
    return false;
}
var rectPropties = [
    'x',
    'y',
    'width',
    'height'
];
var polarPropties = [
    'cx',
    'cy',
    'r',
    'startAngle',
    'endAngle'
];
var isValidLayout = {
    cartesian2d: function(layout) {
        return !checkPropertiesNotValid(layout, rectPropties);
    },
    polar: function(layout) {
        return !checkPropertiesNotValid(layout, polarPropties);
    }
};
var getLayout = {
    // itemModel is only used to get borderWidth, which is not needed
    // when calculating bar background layout.
    cartesian2d: function(data, dataIndex, itemModel) {
        var layout = data.getItemLayout(dataIndex);
        if (!layout) {
            return null;
        }
        var fixedLineWidth = itemModel ? getLineWidth(itemModel, layout) : 0;
        // fix layout with lineWidth
        var signX = layout.width > 0 ? 1 : -1;
        var signY = layout.height > 0 ? 1 : -1;
        return {
            x: layout.x + signX * fixedLineWidth / 2,
            y: layout.y + signY * fixedLineWidth / 2,
            width: layout.width - signX * fixedLineWidth,
            height: layout.height - signY * fixedLineWidth
        };
    },
    polar: function(data, dataIndex, itemModel) {
        var layout = data.getItemLayout(dataIndex);
        return {
            cx: layout.cx,
            cy: layout.cy,
            r0: layout.r0,
            r: layout.r,
            startAngle: layout.startAngle,
            endAngle: layout.endAngle,
            clockwise: layout.clockwise
        };
    }
};
function isZeroOnPolar(layout) {
    return layout.startAngle != null && layout.endAngle != null && layout.startAngle === layout.endAngle;
}
function createPolarPositionMapping(isRadial) {
    return function(isRadial) {
        var arcOrAngle = isRadial ? 'Arc' : 'Angle';
        return function(position) {
            switch(position){
                case 'start':
                case 'insideStart':
                case 'end':
                case 'insideEnd':
                    return position + arcOrAngle;
                default:
                    return position;
            }
        };
    }(isRadial);
}
function updateStyle(el, data, dataIndex, itemModel, layout, seriesModel, isHorizontalOrRadial, isPolar) {
    var style = data.getItemVisual(dataIndex, 'style');
    if (!isPolar) {
        var borderRadius = itemModel.get([
            'itemStyle',
            'borderRadius'
        ]) || 0;
        el.setShape('r', borderRadius);
    } else if (!seriesModel.get('roundCap')) {
        var sectorShape = el.shape;
        var cornerRadius = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$sectorHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSectorCornerRadius"])(itemModel.getModel('itemStyle'), sectorShape, true);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])(sectorShape, cornerRadius);
        el.setShape(sectorShape);
    }
    el.useStyle(style);
    var cursorStyle = itemModel.getShallow('cursor');
    cursorStyle && el.attr('cursor', cursorStyle);
    var labelPositionOutside = isPolar ? isHorizontalOrRadial ? layout.r >= layout.r0 ? 'endArc' : 'startArc' : layout.endAngle >= layout.startAngle ? 'endAngle' : 'startAngle' : isHorizontalOrRadial ? getLabelPositionForHorizontal(layout, seriesModel.coordinateSystem) : getLabelPositionForVertical(layout, seriesModel.coordinateSystem);
    var labelStatesModels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLabelStatesModels"])(itemModel);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLabelStyle"])(el, labelStatesModels, {
        labelFetcher: seriesModel,
        labelDataIndex: dataIndex,
        defaultText: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$labelHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDefaultLabel"])(seriesModel.getData(), dataIndex),
        inheritColor: style.fill,
        defaultOpacity: style.opacity,
        defaultOutsidePosition: labelPositionOutside
    });
    var label = el.getTextContent();
    if (isPolar && label) {
        var position = itemModel.get([
            'label',
            'position'
        ]);
        el.textConfig.inside = position === 'middle' ? true : null;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$sectorLabel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setSectorTextRotation"])(el, position === 'outside' ? labelPositionOutside : position, createPolarPositionMapping(isHorizontalOrRadial), itemModel.get([
            'label',
            'rotate'
        ]));
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLabelValueAnimation"])(label, labelStatesModels, seriesModel.getRawValue(dataIndex), function(value) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$labelHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDefaultInterpolatedLabel"])(data, value);
    });
    var emphasisModel = itemModel.getModel([
        'emphasis'
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toggleHoverEmphasis"])(el, emphasisModel.get('focus'), emphasisModel.get('blurScope'), emphasisModel.get('disabled'));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setStatesStylesFromModel"])(el, itemModel);
    if (isZeroOnPolar(layout)) {
        el.style.fill = 'none';
        el.style.stroke = 'none';
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(el.states, function(state) {
            if (state.style) {
                state.style.fill = state.style.stroke = 'none';
            }
        });
    }
}
// In case width or height are too small.
function getLineWidth(itemModel, rawLayout) {
    // Has no border.
    var borderColor = itemModel.get([
        'itemStyle',
        'borderColor'
    ]);
    if (!borderColor || borderColor === 'none') {
        return 0;
    }
    var lineWidth = itemModel.get([
        'itemStyle',
        'borderWidth'
    ]) || 0;
    // width or height may be NaN for empty data
    var width = isNaN(rawLayout.width) ? Number.MAX_VALUE : Math.abs(rawLayout.width);
    var height = isNaN(rawLayout.height) ? Number.MAX_VALUE : Math.abs(rawLayout.height);
    return Math.min(lineWidth, width, height);
}
var LagePathShape = /** @class */ function() {
    function LagePathShape() {}
    return LagePathShape;
}();
var LargePath = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(LargePath, _super);
    function LargePath(opts) {
        var _this = _super.call(this, opts) || this;
        _this.type = 'largeBar';
        return _this;
    }
    LargePath.prototype.getDefaultShape = function() {
        return new LagePathShape();
    };
    LargePath.prototype.buildPath = function(ctx, shape) {
        // Drawing lines is more efficient than drawing
        // a whole line or drawing rects.
        var points = shape.points;
        var baseDimIdx = this.baseDimIdx;
        var valueDimIdx = 1 - this.baseDimIdx;
        var startPoint = [];
        var size = [];
        var barWidth = this.barWidth;
        for(var i = 0; i < points.length; i += 3){
            size[baseDimIdx] = barWidth;
            size[valueDimIdx] = points[i + 2];
            startPoint[baseDimIdx] = points[i + baseDimIdx];
            startPoint[valueDimIdx] = points[i + valueDimIdx];
            ctx.rect(startPoint[0], startPoint[1], size[0], size[1]);
        }
    };
    return LargePath;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
function createLarge(seriesModel, group, progressiveEls, incremental) {
    // TODO support polar
    var data = seriesModel.getData();
    var baseDimIdx = data.getLayout('valueAxisHorizontal') ? 1 : 0;
    var largeDataIndices = data.getLayout('largeDataIndices');
    var barWidth = data.getLayout('size');
    var backgroundModel = seriesModel.getModel('backgroundStyle');
    var bgPoints = data.getLayout('largeBackgroundPoints');
    var incrementalId = incremental ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getIncrementalId"])(seriesModel) : 0;
    if (bgPoints) {
        var bgEl = new LargePath({
            shape: {
                points: bgPoints
            },
            incremental: incrementalId,
            silent: true,
            z2: 0
        });
        bgEl.baseDimIdx = baseDimIdx;
        bgEl.largeDataIndices = largeDataIndices;
        bgEl.barWidth = barWidth;
        bgEl.useStyle(backgroundModel.getItemStyle());
        group.add(bgEl);
        progressiveEls && progressiveEls.push(bgEl);
    }
    var el = new LargePath({
        shape: {
            points: data.getLayout('largePoints')
        },
        incremental: incrementalId,
        ignoreCoarsePointer: true,
        z2: 1
    });
    el.baseDimIdx = baseDimIdx;
    el.largeDataIndices = largeDataIndices;
    el.barWidth = barWidth;
    group.add(el);
    el.useStyle(data.getVisual('style'));
    // Stroke is rendered first to avoid overlapping with fill. See #20465
    el.style.stroke = null;
    // Enable tooltip and user mouse/touch event handlers.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getECData"])(el).seriesIndex = seriesModel.seriesIndex;
    if (!seriesModel.get('silent')) {
        el.on('mousedown', largePathUpdateDataIndex);
        el.on('mousemove', largePathUpdateDataIndex);
    }
    progressiveEls && progressiveEls.push(el);
}
// Use throttle to avoid frequently traverse to find dataIndex.
var largePathUpdateDataIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$throttle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["throttle"])(function(event) {
    var largePath = this;
    var dataIndex = largePathFindDataIndex(largePath, event.offsetX, event.offsetY);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getECData"])(largePath).dataIndex = dataIndex >= 0 ? dataIndex : null;
}, 30, false);
function largePathFindDataIndex(largePath, x, y) {
    var baseDimIdx = largePath.baseDimIdx;
    var valueDimIdx = 1 - baseDimIdx;
    var points = largePath.shape.points;
    var largeDataIndices = largePath.largeDataIndices;
    var startPoint = [];
    var size = [];
    var barWidth = largePath.barWidth;
    for(var i = 0, len = points.length / 3; i < len; i++){
        var ii = i * 3;
        size[baseDimIdx] = barWidth;
        size[valueDimIdx] = points[ii + 2];
        startPoint[baseDimIdx] = points[ii + baseDimIdx];
        startPoint[valueDimIdx] = points[ii + valueDimIdx];
        if (size[valueDimIdx] < 0) {
            startPoint[valueDimIdx] += size[valueDimIdx];
            size[valueDimIdx] = -size[valueDimIdx];
        }
        if (x >= startPoint[0] && x <= startPoint[0] + size[0] && y >= startPoint[1] && y <= startPoint[1] + size[1]) {
            return largeDataIndices[i];
        }
    }
    return -1;
}
function createBackgroundShape(isHorizontalOrRadial, layout, coord) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$CoordinateSystem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isCoordinateSystemType"])(coord, 'cartesian2d')) {
        var rectShape = layout;
        var coordLayout = coord.getArea();
        return {
            x: isHorizontalOrRadial ? rectShape.x : coordLayout.x,
            y: isHorizontalOrRadial ? coordLayout.y : rectShape.y,
            width: isHorizontalOrRadial ? rectShape.width : coordLayout.width,
            height: isHorizontalOrRadial ? coordLayout.height : rectShape.height
        };
    } else {
        var coordLayout = coord.getArea();
        var sectorShape = layout;
        return {
            cx: coordLayout.cx,
            cy: coordLayout.cy,
            r0: isHorizontalOrRadial ? coordLayout.r0 : sectorShape.r0,
            r: isHorizontalOrRadial ? coordLayout.r : sectorShape.r,
            startAngle: isHorizontalOrRadial ? sectorShape.startAngle : 0,
            endAngle: isHorizontalOrRadial ? sectorShape.endAngle : Math.PI * 2
        };
    }
}
function createBackgroundEl(coord, isHorizontalOrRadial, layout) {
    var ElementClz = coord.type === 'polar' ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Sector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sector$3e$__["Sector"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rect$3e$__["Rect"];
    return new ElementClz({
        shape: createBackgroundShape(isHorizontalOrRadial, layout, coord),
        silent: true,
        z2: 0
    });
}
function getLabelPositionForHorizontal(layout, coordSys) {
    if (layout.height === 0) {
        // For zero height, determine position based on axis inverse status
        var valueAxis = coordSys.getOtherAxis(coordSys.getBaseAxis());
        return valueAxis.inverse ? 'bottom' : 'top';
    }
    return layout.height > 0 ? 'bottom' : 'top';
}
function getLabelPositionForVertical(layout, coordSys) {
    if (layout.width === 0) {
        // For zero width, determine position based on axis inverse status
        var valueAxis = coordSys.getOtherAxis(coordSys.getBaseAxis());
        return valueAxis.inverse ? 'left' : 'right';
    }
    return layout.width >= 0 ? 'right' : 'left';
}
const __TURBOPACK__default__export__ = BarView;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/bar/BaseBarSeries.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Series.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createSeriesData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createSeriesData.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
;
;
;
;
var BaseBarSeriesModel = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(BaseBarSeriesModel, _super);
    function BaseBarSeriesModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = BaseBarSeriesModel.type;
        return _this;
    }
    BaseBarSeriesModel.prototype.getInitialData = function(option, ecModel) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createSeriesData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(null, this, {
            useEncodeDefaulter: true
        });
    };
    BaseBarSeriesModel.prototype.getMarkerPosition = function(value, dims, startingAtTick) {
        var coordSys = this.coordinateSystem;
        if (coordSys && coordSys.clampData) {
            // PENDING if clamp ?
            var clampData_1 = coordSys.clampData(value);
            var pt_1 = coordSys.dataToPoint(clampData_1);
            if (startingAtTick) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(coordSys.getAxes(), function(axis, idx) {
                    // If axis type is category, use tick coords instead
                    if (axis.type === 'category' && dims != null) {
                        var tickCoords = axis.getTicksCoords();
                        var alignTicksWithLabel = axis.getTickModel().get('alignWithLabel');
                        var targetTickId = clampData_1[idx];
                        // The index of rightmost tick of markArea is 1 larger than x1/y1 index
                        var isEnd = dims[idx] === 'x1' || dims[idx] === 'y1';
                        if (isEnd && !alignTicksWithLabel) {
                            targetTickId += 1;
                        }
                        // The only contains one tick, tickCoords is
                        // like [{coord: 0, tickValue: 0}, {coord: 0}]
                        // to the length should always be larger than 1
                        if (tickCoords.length < 2) {
                            return;
                        } else if (tickCoords.length === 2) {
                            // The left value and right value of the axis are
                            // the same. coord is 0 in both items. Use the max
                            // value of the axis as the coord
                            pt_1[idx] = axis.toGlobalCoord(axis.getExtent()[isEnd ? 1 : 0]);
                            return;
                        }
                        var leftCoord = void 0;
                        var coord = void 0;
                        var stepTickValue = 1;
                        for(var i = 0; i < tickCoords.length; i++){
                            var tickCoord = tickCoords[i].coord;
                            // The last item of tickCoords doesn't contain
                            // tickValue
                            var tickValue = i === tickCoords.length - 1 ? tickCoords[i - 1].tickValue + stepTickValue : tickCoords[i].tickValue;
                            if (tickValue === targetTickId) {
                                coord = tickCoord;
                                break;
                            } else if (tickValue < targetTickId) {
                                leftCoord = tickCoord;
                            } else if (leftCoord != null && tickValue > targetTickId) {
                                coord = (tickCoord + leftCoord) / 2;
                                break;
                            }
                            if (i === 1) {
                                // Here we assume the step of category axes is
                                // the same
                                stepTickValue = tickValue - tickCoords[0].tickValue;
                            }
                        }
                        if (coord == null) {
                            if (!leftCoord) {
                                // targetTickId is smaller than all tick ids in the
                                // visible area, use the leftmost tick coord
                                coord = tickCoords[0].coord;
                            } else if (leftCoord) {
                                // targetTickId is larger than all tick ids in the
                                // visible area, use the rightmost tick coord
                                coord = tickCoords[tickCoords.length - 1].coord;
                            }
                        }
                        pt_1[idx] = axis.toGlobalCoord(coord);
                    }
                });
            } else {
                var data = this.getData();
                var offset = data.getLayout('offset');
                var size = data.getLayout('size');
                var offsetIndex = coordSys.getBaseAxis().isHorizontal() ? 0 : 1;
                pt_1[offsetIndex] += offset + size / 2;
            }
            return pt_1;
        }
        return [
            NaN,
            NaN
        ];
    };
    /**
   * @implements
   */ BaseBarSeriesModel.prototype.__requireStartValue = function(axis) {
        return this.getBaseAxis() !== axis;
    };
    BaseBarSeriesModel.type = 'series.__base_bar__';
    BaseBarSeriesModel.defaultOption = {
        // zlevel: 0,
        z: 2,
        coordinateSystem: 'cartesian2d',
        legendHoverLink: true,
        // stack: null
        // Cartesian coordinate system
        // xAxisIndex: 0,
        // yAxisIndex: 0,
        barMinHeight: 0,
        barMinAngle: 0,
        // cursor: null,
        large: false,
        largeThreshold: 400,
        progressive: 3e3,
        progressiveChunkMode: 'mod',
        defaultBarGap: '10%'
    };
    return BaseBarSeriesModel;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].registerClass(BaseBarSeriesModel);
const __TURBOPACK__default__export__ = BaseBarSeriesModel;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/bar/install.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "install",
    ()=>install
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$layout$2f$barGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/layout/barGrid.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$processor$2f$dataSample$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/processor/dataSample.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$bar$2f$BarSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/bar/BarSeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$bar$2f$BarView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/bar/BarView.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$layout$2f$barCommon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/layout/barCommon.js [app-client] (ecmascript)");
;
;
;
;
;
function install(registers) {
    registers.registerChartView(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$bar$2f$BarView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
    registers.registerSeriesModel(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$bar$2f$BarSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
    registers.registerLayout(registers.PRIORITY.VISUAL.LAYOUT, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$layout$2f$barGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrossSeriesLayoutHandler"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$layout$2f$barCommon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_BAR"]));
    // Do layout after other overall layout, which can prepare some information.
    registers.registerLayout(registers.PRIORITY.VISUAL.PROGRESSIVE_LAYOUT, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$layout$2f$barGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createProgressiveLayout"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$layout$2f$barCommon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_BAR"]));
    // Down sample after filter
    registers.registerProcessor(registers.PRIORITY.PROCESSOR.STATISTIC, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$processor$2f$dataSample$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$layout$2f$barCommon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_BAR"]));
    /**
   * @payload
   * @property {string} [componentType=series]
   * @property {number} [dx]
   * @property {number} [dy]
   * @property {number} [zoom]
   * @property {number} [originX]
   * @property {number} [originY]
   */ registers.registerAction({
        type: 'changeAxisOrder',
        event: 'changeAxisOrder',
        update: 'update'
    }, function(payload, ecModel) {
        var componentType = payload.componentType || 'series';
        ecModel.eachComponent({
            mainType: componentType,
            query: payload
        }, function(componentModel) {
            if (payload.sortInfo) {
                componentModel.axis.setCategorySortInfo(payload.sortInfo);
            }
        });
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$layout$2f$barGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerBarGridAxisHandlers"])(registers);
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/bar/install.js [app-client] (ecmascript) <export install as BarChart>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BarChart",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$bar$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["install"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$bar$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/bar/install.js [app-client] (ecmascript)");
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/custom/customSeriesRegister.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCustomSeries",
    ()=>getCustomSeries,
    "registerCustomSeries",
    ()=>registerCustomSeries
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
*/ var customRenderers = {};
function registerCustomSeries(type, renderItem) {
    customRenderers[type] = renderItem;
}
function getCustomSeries(type) {
    return customRenderers[type];
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/funnel/FunnelSeries.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SERIES_TYPE_FUNNEL",
    ()=>SERIES_TYPE_FUNNEL,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createSeriesDataSimply$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createSeriesDataSimply.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$sourceHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/sourceHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$LegendVisualProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/LegendVisualProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Series.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/tokens.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
var SERIES_TYPE_FUNNEL = 'funnel';
var FunnelSeriesModel = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(FunnelSeriesModel, _super);
    function FunnelSeriesModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = FunnelSeriesModel.type;
        return _this;
    }
    FunnelSeriesModel.prototype.init = function(option) {
        _super.prototype.init.apply(this, arguments);
        // Enable legend selection for each data item
        // Use a function instead of direct access because data reference may changed
        this.legendVisualProvider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$LegendVisualProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bind"](this.getData, this), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bind"](this.getRawData, this));
        // Extend labelLine emphasis
        this._defaultLabelLine(option);
    };
    FunnelSeriesModel.prototype.getInitialData = function(option, ecModel) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createSeriesDataSimply$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(this, {
            coordDimensions: [
                'value'
            ],
            encodeDefaulter: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["curry"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$sourceHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeSeriesEncodeForNameBased"], this)
        });
    };
    FunnelSeriesModel.prototype._defaultLabelLine = function(option) {
        // Extend labelLine emphasis
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultEmphasis"])(option, 'labelLine', [
            'show'
        ]);
        var labelLineNormalOpt = option.labelLine;
        var labelLineEmphasisOpt = option.emphasis.labelLine;
        // Not show label line if `label.normal.show = false`
        labelLineNormalOpt.show = labelLineNormalOpt.show && option.label.show;
        labelLineEmphasisOpt.show = labelLineEmphasisOpt.show && option.emphasis.label.show;
    };
    // Overwrite
    FunnelSeriesModel.prototype.getDataParams = function(dataIndex) {
        var data = this.getData();
        var params = _super.prototype.getDataParams.call(this, dataIndex);
        var valueDim = data.mapDimension('value');
        var sum = data.getSum(valueDim);
        // Percent is 0 if sum is 0
        params.percent = !sum ? 0 : +(data.get(valueDim, dataIndex) / sum * 100).toFixed(2);
        params.$vars.push('percent');
        return params;
    };
    FunnelSeriesModel.type = 'series.' + SERIES_TYPE_FUNNEL;
    FunnelSeriesModel.defaultOption = {
        coordinateSystemUsage: 'box',
        // zlevel: 0,                  // 一级层叠
        z: 2,
        legendHoverLink: true,
        colorBy: 'data',
        left: 80,
        top: 60,
        right: 80,
        bottom: 65,
        // width: {totalWidth} - left - right,
        // height: {totalHeight} - top - bottom,
        // 默认取数据最小最大值
        // min: 0,
        // max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        orient: 'vertical',
        gap: 0,
        funnelAlign: 'center',
        label: {
            show: true,
            position: 'outer'
        },
        labelLine: {
            show: true,
            length: 20,
            lineStyle: {
                // color: 各异,
                width: 1
            }
        },
        itemStyle: {
            // color: 各异,
            borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.neutral00,
            borderWidth: 1
        },
        emphasis: {
            label: {
                show: true
            }
        },
        select: {
            itemStyle: {
                borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.primary
            }
        }
    };
    return FunnelSeriesModel;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = FunnelSeriesModel;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/funnel/FunnelView.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/animation/basicTransition.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Point$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/Point.js [app-client] (ecmascript) <export default as Point>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Polyline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Polyline$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Polyline.js [app-client] (ecmascript) <export default as Polyline>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Text$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Text.js [app-client] (ecmascript) <export default as Text>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Polygon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Polygon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Polygon.js [app-client] (ecmascript) <export default as Polygon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/states.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/view/Chart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$funnel$2f$FunnelSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/funnel/FunnelSeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelGuideHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/label/labelGuideHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/label/labelStyle.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
var opacityAccessPath = [
    'itemStyle',
    'opacity'
];
/**
 * Piece of pie including Sector, Label, LabelLine
 */ var FunnelPiece = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(FunnelPiece, _super);
    function FunnelPiece(data, idx) {
        var _this = _super.call(this) || this;
        var polygon = _this;
        var labelLine = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Polyline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Polyline$3e$__["Polyline"]();
        var text = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Text$3e$__["Text"]();
        polygon.setTextContent(text);
        _this.setTextGuideLine(labelLine);
        _this.updateData(data, idx, true);
        return _this;
    }
    FunnelPiece.prototype.updateData = function(data, idx, firstCreate) {
        var polygon = this;
        var seriesModel = data.hostModel;
        var itemModel = data.getItemModel(idx);
        var layout = data.getItemLayout(idx);
        var emphasisModel = itemModel.getModel('emphasis');
        var opacity = itemModel.get(opacityAccessPath);
        opacity = opacity == null ? 1 : opacity;
        if (!firstCreate) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveOldStyle"])(polygon);
        }
        // Update common style
        polygon.useStyle(data.getItemVisual(idx, 'style'));
        polygon.style.lineJoin = 'round';
        if (firstCreate) {
            polygon.setShape({
                points: layout.points
            });
            polygon.style.opacity = 0;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initProps"](polygon, {
                style: {
                    opacity: opacity
                }
            }, seriesModel, idx);
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProps"](polygon, {
                style: {
                    opacity: opacity
                },
                shape: {
                    points: layout.points
                }
            }, seriesModel, idx);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setStatesStylesFromModel"])(polygon, itemModel);
        this._updateLabel(data, idx);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toggleHoverEmphasis"])(this, emphasisModel.get('focus'), emphasisModel.get('blurScope'), emphasisModel.get('disabled'));
    };
    FunnelPiece.prototype._updateLabel = function(data, idx) {
        var polygon = this;
        var labelLine = this.getTextGuideLine();
        var labelText = polygon.getTextContent();
        var seriesModel = data.hostModel;
        var itemModel = data.getItemModel(idx);
        var layout = data.getItemLayout(idx);
        var labelLayout = layout.label;
        var style = data.getItemVisual(idx, 'style');
        var visualColor = style.fill;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLabelStyle"])(// position will not be used in setLabelStyle
        labelText, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLabelStatesModels"])(itemModel), {
            labelFetcher: data.hostModel,
            labelDataIndex: idx,
            defaultOpacity: style.opacity,
            defaultText: data.getName(idx)
        }, {
            normal: {
                align: labelLayout.textAlign,
                verticalAlign: labelLayout.verticalAlign
            }
        });
        var labelModel = itemModel.getModel('label');
        var labelColor = labelModel.get('color');
        var overrideColor = labelColor === 'inherit' ? visualColor : null;
        polygon.setTextConfig({
            local: true,
            inside: !!labelLayout.inside,
            insideStroke: overrideColor,
            outsideFill: overrideColor
        });
        var linePoints = labelLayout.linePoints;
        labelLine.setShape({
            points: linePoints
        });
        polygon.textGuideLineConfig = {
            anchor: linePoints ? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Point$3e$__["Point"](linePoints[0][0], linePoints[0][1]) : null
        };
        // Make sure update style on labelText after setLabelStyle.
        // Because setLabelStyle will replace a new style on it.
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProps"](labelText, {
            style: {
                x: labelLayout.x,
                y: labelLayout.y
            }
        }, seriesModel, idx);
        labelText.attr({
            rotation: labelLayout.rotation,
            originX: labelLayout.x,
            originY: labelLayout.y,
            z2: 10
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelGuideHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLabelLineStyle"])(polygon, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelGuideHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLabelLineStatesModels"])(itemModel), {
            // Default use item visual color
            stroke: visualColor
        });
    };
    return FunnelPiece;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Polygon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Polygon$3e$__["Polygon"]);
var FunnelView = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(FunnelView, _super);
    function FunnelView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$funnel$2f$FunnelSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_FUNNEL"];
        _this.ignoreLabelLineUpdate = true;
        return _this;
    }
    FunnelView.prototype.render = function(seriesModel, ecModel, api) {
        var data = seriesModel.getData();
        var oldData = this._data;
        var group = this.group;
        data.diff(oldData).add(function(idx) {
            var funnelPiece = new FunnelPiece(data, idx);
            data.setItemGraphicEl(idx, funnelPiece);
            group.add(funnelPiece);
        }).update(function(newIdx, oldIdx) {
            var piece = oldData.getItemGraphicEl(oldIdx);
            piece.updateData(data, newIdx);
            group.add(piece);
            data.setItemGraphicEl(newIdx, piece);
        }).remove(function(idx) {
            var piece = oldData.getItemGraphicEl(idx);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeElementWithFadeOut"](piece, seriesModel, idx);
        }).execute();
        this._data = data;
    };
    FunnelView.prototype.remove = function() {
        this.group.removeAll();
        this._data = null;
    };
    FunnelView.prototype.dispose = function() {};
    FunnelView.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$funnel$2f$FunnelSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_FUNNEL"];
    return FunnelView;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = FunnelView;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/funnel/funnelLayout.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "funnelLayoutStageHandler",
    ()=>funnelLayoutStageHandler
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/layout.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$funnel$2f$FunnelSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/funnel/FunnelSeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
;
;
;
;
;
function getSortedIndices(data, sort) {
    var valueDim = data.mapDimension('value');
    var valueArr = data.mapArray(valueDim, function(val) {
        return val;
    });
    var indices = [];
    var isAscending = sort === 'ascending';
    for(var i = 0, len = data.count(); i < len; i++){
        indices[i] = i;
    }
    // Add custom sortable function & none sortable opetion by "options.sort"
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFunction"])(sort)) {
        indices.sort(sort);
    } else if (sort !== 'none') {
        indices.sort(function(a, b) {
            return isAscending ? valueArr[a] - valueArr[b] : valueArr[b] - valueArr[a];
        });
    }
    return indices;
}
function labelLayout(data) {
    var seriesModel = data.hostModel;
    var isHorizontal = isOrientHorizontal(seriesModel);
    data.each(function(idx) {
        var itemModel = data.getItemModel(idx);
        var labelModel = itemModel.getModel('label');
        var labelPosition = labelModel.get('position');
        var labelLineModel = itemModel.getModel('labelLine');
        var layout = data.getItemLayout(idx);
        var points = layout.points;
        var isLabelInside = labelPosition === 'inner' || labelPosition === 'inside' || labelPosition === 'center' || labelPosition === 'insideLeft' || labelPosition === 'insideRight';
        var textAlign;
        var textX;
        var textY;
        var linePoints;
        if (isLabelInside) {
            if (labelPosition === 'insideLeft') {
                textX = (points[0][0] + points[3][0]) / 2 + 5;
                textY = (points[0][1] + points[3][1]) / 2;
                textAlign = 'left';
            } else if (labelPosition === 'insideRight') {
                textX = (points[1][0] + points[2][0]) / 2 - 5;
                textY = (points[1][1] + points[2][1]) / 2;
                textAlign = 'right';
            } else {
                textX = (points[0][0] + points[1][0] + points[2][0] + points[3][0]) / 4;
                textY = (points[0][1] + points[1][1] + points[2][1] + points[3][1]) / 4;
                textAlign = 'center';
            }
            linePoints = [
                [
                    textX,
                    textY
                ],
                [
                    textX,
                    textY
                ]
            ];
        } else {
            var x1 = void 0;
            var y1 = void 0;
            var x2 = void 0;
            var y2 = void 0;
            var labelLineLen = labelLineModel.get('length');
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"])(labelPosition)) {
                if (!isHorizontal && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indexOf"])([
                    'top',
                    'bottom'
                ], labelPosition) > -1) {
                    labelPosition = 'left';
                    if ("TURBOPACK compile-time truthy", 1) {
                        console.warn('Position error: Funnel chart on vertical orient dose not support top and bottom.');
                    }
                }
                if (isHorizontal && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indexOf"])([
                    'left',
                    'right'
                ], labelPosition) > -1) {
                    labelPosition = 'bottom';
                    if ("TURBOPACK compile-time truthy", 1) {
                        console.warn('Position error: Funnel chart on horizontal orient dose not support left and right.');
                    }
                }
            }
            if (labelPosition === 'left') {
                // Left side
                x1 = (points[3][0] + points[0][0]) / 2;
                y1 = (points[3][1] + points[0][1]) / 2;
                x2 = x1 - labelLineLen;
                textX = x2 - 5;
                textAlign = 'right';
            } else if (labelPosition === 'right') {
                // Right side
                x1 = (points[1][0] + points[2][0]) / 2;
                y1 = (points[1][1] + points[2][1]) / 2;
                x2 = x1 + labelLineLen;
                textX = x2 + 5;
                textAlign = 'left';
            } else if (labelPosition === 'top') {
                // Top side
                x1 = (points[3][0] + points[0][0]) / 2;
                y1 = (points[3][1] + points[0][1]) / 2;
                y2 = y1 - labelLineLen;
                textY = y2 - 5;
                textAlign = 'center';
            } else if (labelPosition === 'bottom') {
                // Bottom side
                x1 = (points[1][0] + points[2][0]) / 2;
                y1 = (points[1][1] + points[2][1]) / 2;
                y2 = y1 + labelLineLen;
                textY = y2 + 5;
                textAlign = 'center';
            } else if (labelPosition === 'rightTop') {
                // RightTop side
                x1 = isHorizontal ? points[3][0] : points[1][0];
                y1 = isHorizontal ? points[3][1] : points[1][1];
                if (isHorizontal) {
                    y2 = y1 - labelLineLen;
                    textY = y2 - 5;
                    textAlign = 'center';
                } else {
                    x2 = x1 + labelLineLen;
                    textX = x2 + 5;
                    textAlign = 'top';
                }
            } else if (labelPosition === 'rightBottom') {
                // RightBottom side
                x1 = points[2][0];
                y1 = points[2][1];
                if (isHorizontal) {
                    y2 = y1 + labelLineLen;
                    textY = y2 + 5;
                    textAlign = 'center';
                } else {
                    x2 = x1 + labelLineLen;
                    textX = x2 + 5;
                    textAlign = 'bottom';
                }
            } else if (labelPosition === 'leftTop') {
                // LeftTop side
                x1 = points[0][0];
                y1 = isHorizontal ? points[0][1] : points[1][1];
                if (isHorizontal) {
                    y2 = y1 - labelLineLen;
                    textY = y2 - 5;
                    textAlign = 'center';
                } else {
                    x2 = x1 - labelLineLen;
                    textX = x2 - 5;
                    textAlign = 'right';
                }
            } else if (labelPosition === 'leftBottom') {
                // LeftBottom side
                x1 = isHorizontal ? points[1][0] : points[3][0];
                y1 = isHorizontal ? points[1][1] : points[2][1];
                if (isHorizontal) {
                    y2 = y1 + labelLineLen;
                    textY = y2 + 5;
                    textAlign = 'center';
                } else {
                    x2 = x1 - labelLineLen;
                    textX = x2 - 5;
                    textAlign = 'right';
                }
            } else {
                // Right side or Bottom side
                x1 = (points[1][0] + points[2][0]) / 2;
                y1 = (points[1][1] + points[2][1]) / 2;
                if (isHorizontal) {
                    y2 = y1 + labelLineLen;
                    textY = y2 + 5;
                    textAlign = 'center';
                } else {
                    x2 = x1 + labelLineLen;
                    textX = x2 + 5;
                    textAlign = 'left';
                }
            }
            if (isHorizontal) {
                x2 = x1;
                textX = x2;
            } else {
                y2 = y1;
                textY = y2;
            }
            linePoints = [
                [
                    x1,
                    y1
                ],
                [
                    x2,
                    y2
                ]
            ];
        }
        layout.label = {
            linePoints: linePoints,
            x: textX,
            y: textY,
            verticalAlign: 'middle',
            textAlign: textAlign,
            inside: isLabelInside
        };
    });
}
var funnelLayoutStageHandler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSimpleOverallStageHandler"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$funnel$2f$FunnelSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_FUNNEL"], funnelLayout);
function funnelLayout(ecModel, api) {
    ecModel.eachSeriesByType(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$funnel$2f$FunnelSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_FUNNEL"], function(seriesModel) {
        var data = seriesModel.getData();
        var valueDim = data.mapDimension('value');
        var sort = seriesModel.get('sort');
        var layoutRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBoxLayoutReference"](seriesModel, api);
        var viewRect = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLayoutRect"](seriesModel.getBoxLayoutParams(), layoutRef.refContainer);
        var isHorizontal = isOrientHorizontal(seriesModel);
        var viewWidth = viewRect.width;
        var viewHeight = viewRect.height;
        var indices = getSortedIndices(data, sort);
        var x = viewRect.x;
        var y = viewRect.y;
        var sizeExtent = isHorizontal ? [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(seriesModel.get('minSize'), viewHeight),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(seriesModel.get('maxSize'), viewHeight)
        ] : [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(seriesModel.get('minSize'), viewWidth),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(seriesModel.get('maxSize'), viewWidth)
        ];
        var dataExtent = data.getDataExtent(valueDim);
        var min = seriesModel.get('min');
        var max = seriesModel.get('max');
        if (min == null) {
            min = Math.min(dataExtent[0], 0);
        }
        if (max == null) {
            max = dataExtent[1];
        }
        var funnelAlign = seriesModel.get('funnelAlign');
        var gap = seriesModel.get('gap');
        var viewSize = isHorizontal ? viewWidth : viewHeight;
        var itemSize = (viewSize - gap * (data.count() - 1)) / data.count();
        var getLinePoints = function(idx, offset) {
            // End point index is data.count() and we assign it 0
            if (isHorizontal) {
                var val_1 = data.get(valueDim, idx) || 0;
                var itemHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["linearMap"])(val_1, [
                    min,
                    max
                ], sizeExtent, true);
                var y0 = void 0;
                switch(funnelAlign){
                    case 'top':
                        y0 = y;
                        break;
                    case 'center':
                        y0 = y + (viewHeight - itemHeight) / 2;
                        break;
                    case 'bottom':
                        y0 = y + (viewHeight - itemHeight);
                        break;
                }
                return [
                    [
                        offset,
                        y0
                    ],
                    [
                        offset,
                        y0 + itemHeight
                    ]
                ];
            }
            var val = data.get(valueDim, idx) || 0;
            var itemWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["linearMap"])(val, [
                min,
                max
            ], sizeExtent, true);
            var x0;
            switch(funnelAlign){
                case 'left':
                    x0 = x;
                    break;
                case 'center':
                    x0 = x + (viewWidth - itemWidth) / 2;
                    break;
                case 'right':
                    x0 = x + viewWidth - itemWidth;
                    break;
            }
            return [
                [
                    x0,
                    offset
                ],
                [
                    x0 + itemWidth,
                    offset
                ]
            ];
        };
        if (sort === 'ascending') {
            // From bottom to top
            itemSize = -itemSize;
            gap = -gap;
            if (isHorizontal) {
                x += viewWidth;
            } else {
                y += viewHeight;
            }
            indices = indices.reverse();
        }
        for(var i = 0; i < indices.length; i++){
            var idx = indices[i];
            var nextIdx = indices[i + 1];
            var itemModel = data.getItemModel(idx);
            if (isHorizontal) {
                var width = itemModel.get([
                    'itemStyle',
                    'width'
                ]);
                if (width == null) {
                    width = itemSize;
                } else {
                    width = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(width, viewWidth);
                    if (sort === 'ascending') {
                        width = -width;
                    }
                }
                var start = getLinePoints(idx, x);
                var end = getLinePoints(nextIdx, x + width);
                x += width + gap;
                data.setItemLayout(idx, {
                    points: start.concat(end.slice().reverse())
                });
            } else {
                var height = itemModel.get([
                    'itemStyle',
                    'height'
                ]);
                if (height == null) {
                    height = itemSize;
                } else {
                    height = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(height, viewHeight);
                    if (sort === 'ascending') {
                        height = -height;
                    }
                }
                var start = getLinePoints(idx, y);
                var end = getLinePoints(nextIdx, y + height);
                y += height + gap;
                data.setItemLayout(idx, {
                    points: start.concat(end.slice().reverse())
                });
            }
        }
        labelLayout(data);
    });
}
function isOrientHorizontal(seriesModel) {
    return seriesModel.get('orient') === 'horizontal';
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/funnel/install.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "install",
    ()=>install
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$funnel$2f$FunnelView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/funnel/FunnelView.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$funnel$2f$FunnelSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/funnel/FunnelSeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$processor$2f$dataFilter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/processor/dataFilter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$funnel$2f$funnelLayout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/funnel/funnelLayout.js [app-client] (ecmascript)");
;
;
;
;
function install(registers) {
    registers.registerChartView(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$funnel$2f$FunnelView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
    registers.registerSeriesModel(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$funnel$2f$FunnelSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
    registers.registerLayout(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$funnel$2f$funnelLayout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["funnelLayoutStageHandler"]);
    registers.registerProcessor((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$processor$2f$dataFilter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$funnel$2f$FunnelSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_FUNNEL"]));
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/funnel/install.js [app-client] (ecmascript) <export install as FunnelChart>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FunnelChart",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$funnel$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["install"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$funnel$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/funnel/install.js [app-client] (ecmascript)");
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/gauge/GaugeSeries.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createSeriesDataSimply$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createSeriesDataSimply.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Series.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/tokens.js [app-client] (ecmascript)");
;
;
;
;
var GaugeSeriesModel = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(GaugeSeriesModel, _super);
    function GaugeSeriesModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = GaugeSeriesModel.type;
        _this.visualStyleAccessPath = 'itemStyle';
        return _this;
    }
    GaugeSeriesModel.prototype.getInitialData = function(option, ecModel) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createSeriesDataSimply$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(this, [
            'value'
        ]);
    };
    GaugeSeriesModel.type = 'series.gauge';
    GaugeSeriesModel.defaultOption = {
        // zlevel: 0,
        z: 2,
        colorBy: 'data',
        // 默认全局居中
        center: [
            '50%',
            '50%'
        ],
        legendHoverLink: true,
        radius: '75%',
        startAngle: 225,
        endAngle: -45,
        clockwise: true,
        // 最小值
        min: 0,
        // 最大值
        max: 100,
        // 分割段数，默认为10
        splitNumber: 10,
        // 坐标轴线
        axisLine: {
            // 默认显示，属性show控制显示与否
            show: true,
            roundCap: false,
            lineStyle: {
                color: [
                    [
                        1,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.neutral10
                    ]
                ],
                width: 10
            }
        },
        // 坐标轴线
        progress: {
            // 默认显示，属性show控制显示与否
            show: false,
            overlap: true,
            width: 10,
            roundCap: false,
            clip: true
        },
        // 分隔线
        splitLine: {
            // 默认显示，属性show控制显示与否
            show: true,
            // 属性length控制线长
            length: 10,
            distance: 10,
            // 属性lineStyle（详见lineStyle）控制线条样式
            lineStyle: {
                color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.axisTick,
                width: 3,
                type: 'solid'
            }
        },
        // 坐标轴小标记
        axisTick: {
            // 属性show控制显示与否，默认不显示
            show: true,
            // 每份split细分多少段
            splitNumber: 5,
            // 属性length控制线长
            length: 6,
            distance: 10,
            // 属性lineStyle控制线条样式
            lineStyle: {
                color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.axisTickMinor,
                width: 1,
                type: 'solid'
            }
        },
        axisLabel: {
            show: true,
            distance: 15,
            // formatter: null,
            color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.axisLabel,
            fontSize: 12,
            rotate: 0
        },
        pointer: {
            icon: null,
            offsetCenter: [
                0,
                0
            ],
            show: true,
            showAbove: true,
            length: '60%',
            width: 6,
            keepAspect: false
        },
        anchor: {
            show: false,
            showAbove: false,
            size: 6,
            icon: 'circle',
            offsetCenter: [
                0,
                0
            ],
            keepAspect: false,
            itemStyle: {
                color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.neutral00,
                borderWidth: 0,
                borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.theme[0]
            }
        },
        title: {
            show: true,
            // x, y，单位px
            offsetCenter: [
                0,
                '20%'
            ],
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.secondary,
            fontSize: 16,
            valueAnimation: false
        },
        detail: {
            show: true,
            backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.transparent,
            borderWidth: 0,
            borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.neutral40,
            width: 100,
            height: null,
            padding: [
                5,
                10
            ],
            // x, y，单位px
            offsetCenter: [
                0,
                '40%'
            ],
            // formatter: null,
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.primary,
            fontSize: 30,
            fontWeight: 'bold',
            lineHeight: 30,
            valueAnimation: false
        }
    };
    return GaugeSeriesModel;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = GaugeSeriesModel;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/gauge/GaugeView.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$gauge$2f$PointerPath$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/gauge/PointerPath.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Sector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sector$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Sector.js [app-client] (ecmascript) <export default as Sector>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Line$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Line.js [app-client] (ecmascript) <export default as Line>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Text$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Text.js [app-client] (ecmascript) <export default as Text>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/animation/basicTransition.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Group$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Group.js [app-client] (ecmascript) <export default as Group>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/states.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/label/labelStyle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/view/Chart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$shape$2f$sausage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/shape/sausage.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/symbol.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/innerStore.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$PathProxy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/PathProxy.js [app-client] (ecmascript)");
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
function parsePosition(seriesModel, api) {
    var center = seriesModel.get('center');
    var width = api.getWidth();
    var height = api.getHeight();
    var size = Math.min(width, height);
    var cx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(center[0], api.getWidth());
    var cy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(center[1], api.getHeight());
    var r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(seriesModel.get('radius'), size / 2);
    return {
        cx: cx,
        cy: cy,
        r: r
    };
}
function formatLabel(value, labelFormatter) {
    var label = value == null ? '' : value + '';
    if (labelFormatter) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"])(labelFormatter)) {
            label = labelFormatter.replace('{value}', label);
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFunction"])(labelFormatter)) {
            label = labelFormatter(value);
        }
    }
    return label;
}
var GaugeView = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(GaugeView, _super);
    function GaugeView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = GaugeView.type;
        return _this;
    }
    GaugeView.prototype.render = function(seriesModel, ecModel, api) {
        this.group.removeAll();
        var colorList = seriesModel.get([
            'axisLine',
            'lineStyle',
            'color'
        ]);
        var posInfo = parsePosition(seriesModel, api);
        this._renderMain(seriesModel, ecModel, api, colorList, posInfo);
        this._data = seriesModel.getData();
    };
    GaugeView.prototype.dispose = function() {};
    GaugeView.prototype._renderMain = function(seriesModel, ecModel, api, colorList, posInfo) {
        var group = this.group;
        var clockwise = seriesModel.get('clockwise');
        var startAngle = -seriesModel.get('startAngle') / 180 * Math.PI;
        var endAngle = -seriesModel.get('endAngle') / 180 * Math.PI;
        var axisLineModel = seriesModel.getModel('axisLine');
        var roundCap = axisLineModel.get('roundCap');
        var MainPath = roundCap ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$shape$2f$sausage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Sector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sector$3e$__["Sector"];
        var showAxis = axisLineModel.get('show');
        var lineStyleModel = axisLineModel.getModel('lineStyle');
        var axisLineWidth = lineStyleModel.get('width');
        var angles = [
            startAngle,
            endAngle
        ];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$PathProxy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeArcAngles"])(angles, !clockwise);
        startAngle = angles[0];
        endAngle = angles[1];
        var angleRangeSpan = endAngle - startAngle;
        var prevEndAngle = startAngle;
        var sectors = [];
        for(var i = 0; showAxis && i < colorList.length; i++){
            // Clamp
            var percent = Math.min(Math.max(colorList[i][0], 0), 1);
            endAngle = startAngle + angleRangeSpan * percent;
            var sector = new MainPath({
                shape: {
                    startAngle: prevEndAngle,
                    endAngle: endAngle,
                    cx: posInfo.cx,
                    cy: posInfo.cy,
                    clockwise: clockwise,
                    r0: posInfo.r - axisLineWidth,
                    r: posInfo.r
                },
                silent: true
            });
            sector.setStyle({
                fill: colorList[i][1]
            });
            sector.setStyle(lineStyleModel.getLineStyle(// Because we use sector to simulate arc
            // so the properties for stroking are useless
            [
                'color',
                'width'
            ]));
            sectors.push(sector);
            prevEndAngle = endAngle;
        }
        sectors.reverse();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(sectors, function(sector) {
            return group.add(sector);
        });
        var getColor = function(percent) {
            // Less than 0
            if (percent <= 0) {
                return colorList[0][1];
            }
            var i;
            for(i = 0; i < colorList.length; i++){
                if (colorList[i][0] >= percent && (i === 0 ? 0 : colorList[i - 1][0]) < percent) {
                    return colorList[i][1];
                }
            }
            // More than 1
            return colorList[i - 1][1];
        };
        this._renderTicks(seriesModel, ecModel, api, getColor, posInfo, startAngle, endAngle, clockwise, axisLineWidth);
        this._renderTitleAndDetail(seriesModel, ecModel, api, getColor, posInfo);
        this._renderAnchor(seriesModel, posInfo);
        this._renderPointer(seriesModel, ecModel, api, getColor, posInfo, startAngle, endAngle, clockwise, axisLineWidth);
    };
    GaugeView.prototype._renderTicks = function(seriesModel, ecModel, api, getColor, posInfo, startAngle, endAngle, clockwise, axisLineWidth) {
        var group = this.group;
        var cx = posInfo.cx;
        var cy = posInfo.cy;
        var r = posInfo.r;
        var minVal = +seriesModel.get('min');
        var maxVal = +seriesModel.get('max');
        var splitLineModel = seriesModel.getModel('splitLine');
        var tickModel = seriesModel.getModel('axisTick');
        var labelModel = seriesModel.getModel('axisLabel');
        var splitNumber = seriesModel.get('splitNumber');
        var subSplitNumber = tickModel.get('splitNumber');
        var splitLineLen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(splitLineModel.get('length'), r);
        var tickLen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(tickModel.get('length'), r);
        var angle = startAngle;
        var step = (endAngle - startAngle) / splitNumber;
        var subStep = step / subSplitNumber;
        var splitLineStyle = splitLineModel.getModel('lineStyle').getLineStyle();
        var tickLineStyle = tickModel.getModel('lineStyle').getLineStyle();
        var splitLineDistance = splitLineModel.get('distance');
        var unitX;
        var unitY;
        for(var i = 0; i <= splitNumber; i++){
            unitX = Math.cos(angle);
            unitY = Math.sin(angle);
            // Split line
            if (splitLineModel.get('show')) {
                var distance = splitLineDistance ? splitLineDistance + axisLineWidth : axisLineWidth;
                var splitLine = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Line$3e$__["Line"]({
                    shape: {
                        x1: unitX * (r - distance) + cx,
                        y1: unitY * (r - distance) + cy,
                        x2: unitX * (r - splitLineLen - distance) + cx,
                        y2: unitY * (r - splitLineLen - distance) + cy
                    },
                    style: splitLineStyle,
                    silent: true
                });
                if (splitLineStyle.stroke === 'auto') {
                    splitLine.setStyle({
                        stroke: getColor(i / splitNumber)
                    });
                }
                group.add(splitLine);
            }
            // Label
            if (labelModel.get('show')) {
                var distance = labelModel.get('distance') + splitLineDistance;
                var label = formatLabel(// multiply firstly to avoid rounding error.
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(i * (maxVal - minVal) / splitNumber + minVal, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_PRECISION_FOR_ROUNDING_ERROR"]), labelModel.get('formatter'));
                var autoColor = getColor(i / splitNumber);
                var textStyleX = unitX * (r - splitLineLen - distance) + cx;
                var textStyleY = unitY * (r - splitLineLen - distance) + cy;
                var rotateType = labelModel.get('rotate');
                var rotate = 0;
                if (rotateType === 'radial') {
                    rotate = -angle + 2 * Math.PI;
                    if (rotate > Math.PI / 2) {
                        rotate += Math.PI;
                    }
                } else if (rotateType === 'tangential') {
                    rotate = -angle - Math.PI / 2;
                } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(rotateType)) {
                    rotate = rotateType * Math.PI / 180;
                }
                if (rotate === 0) {
                    group.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Text$3e$__["Text"]({
                        style: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createTextStyle"])(labelModel, {
                            text: label,
                            x: textStyleX,
                            y: textStyleY,
                            verticalAlign: unitY < -0.8 ? 'top' : unitY > 0.8 ? 'bottom' : 'middle',
                            align: unitX < -0.4 ? 'left' : unitX > 0.4 ? 'right' : 'center'
                        }, {
                            inheritColor: autoColor
                        }),
                        silent: true
                    }));
                } else {
                    group.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Text$3e$__["Text"]({
                        style: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createTextStyle"])(labelModel, {
                            text: label,
                            x: textStyleX,
                            y: textStyleY,
                            verticalAlign: 'middle',
                            align: 'center'
                        }, {
                            inheritColor: autoColor
                        }),
                        silent: true,
                        originX: textStyleX,
                        originY: textStyleY,
                        rotation: rotate
                    }));
                }
            }
            // Axis tick
            if (tickModel.get('show') && i !== splitNumber) {
                var distance = tickModel.get('distance');
                distance = distance ? distance + axisLineWidth : axisLineWidth;
                for(var j = 0; j <= subSplitNumber; j++){
                    unitX = Math.cos(angle);
                    unitY = Math.sin(angle);
                    var tickLine = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Line$3e$__["Line"]({
                        shape: {
                            x1: unitX * (r - distance) + cx,
                            y1: unitY * (r - distance) + cy,
                            x2: unitX * (r - tickLen - distance) + cx,
                            y2: unitY * (r - tickLen - distance) + cy
                        },
                        silent: true,
                        style: tickLineStyle
                    });
                    if (tickLineStyle.stroke === 'auto') {
                        tickLine.setStyle({
                            stroke: getColor((i + j / subSplitNumber) / splitNumber)
                        });
                    }
                    group.add(tickLine);
                    angle += subStep;
                }
                angle -= subStep;
            } else {
                angle += step;
            }
        }
    };
    GaugeView.prototype._renderPointer = function(seriesModel, ecModel, api, getColor, posInfo, startAngle, endAngle, clockwise, axisLineWidth) {
        var group = this.group;
        var oldData = this._data;
        var oldProgressData = this._progressEls;
        var progressList = [];
        var showPointer = seriesModel.get([
            'pointer',
            'show'
        ]);
        var progressModel = seriesModel.getModel('progress');
        var showProgress = progressModel.get('show');
        var data = seriesModel.getData();
        var valueDim = data.mapDimension('value');
        var minVal = +seriesModel.get('min');
        var maxVal = +seriesModel.get('max');
        var valueExtent = [
            minVal,
            maxVal
        ];
        var angleExtent = [
            startAngle,
            endAngle
        ];
        function createPointer(idx, angle) {
            var itemModel = data.getItemModel(idx);
            var pointerModel = itemModel.getModel('pointer');
            var pointerWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(pointerModel.get('width'), posInfo.r);
            var pointerLength = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(pointerModel.get('length'), posInfo.r);
            var pointerStr = seriesModel.get([
                'pointer',
                'icon'
            ]);
            var pointerOffset = pointerModel.get('offsetCenter');
            var pointerOffsetX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(pointerOffset[0], posInfo.r);
            var pointerOffsetY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(pointerOffset[1], posInfo.r);
            var pointerKeepAspect = pointerModel.get('keepAspect');
            var pointer;
            // not exist icon type will be set 'rect'
            if (pointerStr) {
                pointer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSymbol"])(pointerStr, pointerOffsetX - pointerWidth / 2, pointerOffsetY - pointerLength, pointerWidth, pointerLength, null, pointerKeepAspect);
            } else {
                pointer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$gauge$2f$PointerPath$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]({
                    shape: {
                        angle: -Math.PI / 2,
                        width: pointerWidth,
                        r: pointerLength,
                        x: pointerOffsetX,
                        y: pointerOffsetY
                    }
                });
            }
            pointer.rotation = -(angle + Math.PI / 2);
            pointer.x = posInfo.cx;
            pointer.y = posInfo.cy;
            return pointer;
        }
        function createProgress(idx, endAngle) {
            var roundCap = progressModel.get('roundCap');
            var ProgressPath = roundCap ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$shape$2f$sausage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Sector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sector$3e$__["Sector"];
            var isOverlap = progressModel.get('overlap');
            var progressWidth = isOverlap ? progressModel.get('width') : axisLineWidth / data.count();
            var r0 = isOverlap ? posInfo.r - progressWidth : posInfo.r - (idx + 1) * progressWidth;
            var r = isOverlap ? posInfo.r : posInfo.r - idx * progressWidth;
            var progress = new ProgressPath({
                shape: {
                    startAngle: startAngle,
                    endAngle: endAngle,
                    cx: posInfo.cx,
                    cy: posInfo.cy,
                    clockwise: clockwise,
                    r0: r0,
                    r: r
                }
            });
            isOverlap && (progress.z2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["linearMap"])(data.get(valueDim, idx), [
                minVal,
                maxVal
            ], [
                100,
                0
            ], true));
            return progress;
        }
        if (showProgress || showPointer) {
            data.diff(oldData).add(function(idx) {
                var val = data.get(valueDim, idx);
                if (showPointer) {
                    var pointer = createPointer(idx, startAngle);
                    // TODO hide pointer on NaN value?
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initProps"](pointer, {
                        rotation: -((isNaN(+val) ? angleExtent[0] : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["linearMap"])(val, valueExtent, angleExtent, true)) + Math.PI / 2)
                    }, seriesModel);
                    group.add(pointer);
                    data.setItemGraphicEl(idx, pointer);
                }
                if (showProgress) {
                    var progress = createProgress(idx, startAngle);
                    var isClip = progressModel.get('clip');
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initProps"](progress, {
                        shape: {
                            endAngle: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["linearMap"])(val, valueExtent, angleExtent, isClip)
                        }
                    }, seriesModel);
                    group.add(progress);
                    // Add data index and series index for indexing the data by element
                    // Useful in tooltip
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setCommonECData"])(seriesModel.seriesIndex, data.dataType, idx, progress);
                    progressList[idx] = progress;
                }
            }).update(function(newIdx, oldIdx) {
                var val = data.get(valueDim, newIdx);
                if (showPointer) {
                    var previousPointer = oldData.getItemGraphicEl(oldIdx);
                    var previousRotate = previousPointer ? previousPointer.rotation : startAngle;
                    var pointer = createPointer(newIdx, previousRotate);
                    pointer.rotation = previousRotate;
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProps"](pointer, {
                        rotation: -((isNaN(+val) ? angleExtent[0] : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["linearMap"])(val, valueExtent, angleExtent, true)) + Math.PI / 2)
                    }, seriesModel);
                    group.add(pointer);
                    data.setItemGraphicEl(newIdx, pointer);
                }
                if (showProgress) {
                    var previousProgress = oldProgressData[oldIdx];
                    var previousEndAngle = previousProgress ? previousProgress.shape.endAngle : startAngle;
                    var progress = createProgress(newIdx, previousEndAngle);
                    var isClip = progressModel.get('clip');
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProps"](progress, {
                        shape: {
                            endAngle: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["linearMap"])(val, valueExtent, angleExtent, isClip)
                        }
                    }, seriesModel);
                    group.add(progress);
                    // Add data index and series index for indexing the data by element
                    // Useful in tooltip
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setCommonECData"])(seriesModel.seriesIndex, data.dataType, newIdx, progress);
                    progressList[newIdx] = progress;
                }
            }).execute();
            data.each(function(idx) {
                var itemModel = data.getItemModel(idx);
                var emphasisModel = itemModel.getModel('emphasis');
                var focus = emphasisModel.get('focus');
                var blurScope = emphasisModel.get('blurScope');
                var emphasisDisabled = emphasisModel.get('disabled');
                var autoColor = getColor((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["linearMap"])(data.get(valueDim, idx), valueExtent, [
                    0,
                    1
                ], true));
                if (showPointer) {
                    var pointer = data.getItemGraphicEl(idx);
                    var symbolStyle = data.getItemVisual(idx, 'style');
                    var visualColor = symbolStyle.fill;
                    if (pointer instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]) {
                        var pathStyle = pointer.style;
                        pointer.useStyle((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])({
                            image: pathStyle.image,
                            x: pathStyle.x,
                            y: pathStyle.y,
                            width: pathStyle.width,
                            height: pathStyle.height
                        }, symbolStyle));
                    } else {
                        pointer.useStyle(symbolStyle);
                        pointer.type !== 'pointer' && pointer.setColor(visualColor);
                    }
                    pointer.setStyle(itemModel.getModel([
                        'pointer',
                        'itemStyle'
                    ]).getItemStyle());
                    if (pointer.style.fill === 'auto') {
                        pointer.setStyle('fill', autoColor);
                    }
                    pointer.z2EmphasisLift = 0;
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setStatesStylesFromModel"])(pointer, itemModel);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toggleHoverEmphasis"])(pointer, focus, blurScope, emphasisDisabled);
                }
                if (showProgress) {
                    var progress = progressList[idx];
                    progress.useStyle(data.getItemVisual(idx, 'style'));
                    progress.setStyle(itemModel.getModel([
                        'progress',
                        'itemStyle'
                    ]).getItemStyle());
                    if (progress.style.fill === 'auto') {
                        progress.setStyle('fill', autoColor);
                    }
                    progress.z2EmphasisLift = 0;
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setStatesStylesFromModel"])(progress, itemModel);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toggleHoverEmphasis"])(progress, focus, blurScope, emphasisDisabled);
                }
            });
            this._progressEls = progressList;
        }
    };
    GaugeView.prototype._renderAnchor = function(seriesModel, posInfo) {
        var anchorModel = seriesModel.getModel('anchor');
        var showAnchor = anchorModel.get('show');
        if (showAnchor) {
            var anchorSize = anchorModel.get('size');
            var anchorType = anchorModel.get('icon');
            var offsetCenter = anchorModel.get('offsetCenter');
            var anchorKeepAspect = anchorModel.get('keepAspect');
            var anchor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSymbol"])(anchorType, posInfo.cx - anchorSize / 2 + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(offsetCenter[0], posInfo.r), posInfo.cy - anchorSize / 2 + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(offsetCenter[1], posInfo.r), anchorSize, anchorSize, null, anchorKeepAspect);
            anchor.z2 = anchorModel.get('showAbove') ? 1 : 0;
            anchor.setStyle(anchorModel.getModel('itemStyle').getItemStyle());
            this.group.add(anchor);
        }
    };
    GaugeView.prototype._renderTitleAndDetail = function(seriesModel, ecModel, api, getColor, posInfo) {
        var _this = this;
        var data = seriesModel.getData();
        var valueDim = data.mapDimension('value');
        var minVal = +seriesModel.get('min');
        var maxVal = +seriesModel.get('max');
        var contentGroup = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Group$3e$__["Group"]();
        var newTitleEls = [];
        var newDetailEls = [];
        var hasAnimation = seriesModel.isAnimationEnabled();
        var showPointerAbove = seriesModel.get([
            'pointer',
            'showAbove'
        ]);
        data.diff(this._data).add(function(idx) {
            newTitleEls[idx] = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Text$3e$__["Text"]({
                silent: true
            });
            newDetailEls[idx] = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Text$3e$__["Text"]({
                silent: true
            });
        }).update(function(idx, oldIdx) {
            newTitleEls[idx] = _this._titleEls[oldIdx];
            newDetailEls[idx] = _this._detailEls[oldIdx];
        }).execute();
        data.each(function(idx) {
            var itemModel = data.getItemModel(idx);
            var value = data.get(valueDim, idx);
            var itemGroup = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Group$3e$__["Group"]();
            var autoColor = getColor((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["linearMap"])(value, [
                minVal,
                maxVal
            ], [
                0,
                1
            ], true));
            var itemTitleModel = itemModel.getModel('title');
            if (itemTitleModel.get('show')) {
                var titleOffsetCenter = itemTitleModel.get('offsetCenter');
                var titleX = posInfo.cx + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(titleOffsetCenter[0], posInfo.r);
                var titleY = posInfo.cy + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(titleOffsetCenter[1], posInfo.r);
                var labelEl = newTitleEls[idx];
                labelEl.attr({
                    z2: showPointerAbove ? 0 : 2,
                    style: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createTextStyle"])(itemTitleModel, {
                        x: titleX,
                        y: titleY,
                        text: data.getName(idx),
                        align: 'center',
                        verticalAlign: 'middle'
                    }, {
                        inheritColor: autoColor
                    })
                });
                itemGroup.add(labelEl);
            }
            var itemDetailModel = itemModel.getModel('detail');
            if (itemDetailModel.get('show')) {
                var detailOffsetCenter = itemDetailModel.get('offsetCenter');
                var detailX = posInfo.cx + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(detailOffsetCenter[0], posInfo.r);
                var detailY = posInfo.cy + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(detailOffsetCenter[1], posInfo.r);
                var width = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(itemDetailModel.get('width'), posInfo.r);
                var height = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(itemDetailModel.get('height'), posInfo.r);
                var detailColor = seriesModel.get([
                    'progress',
                    'show'
                ]) ? data.getItemVisual(idx, 'style').fill : autoColor;
                var labelEl = newDetailEls[idx];
                var formatter_1 = itemDetailModel.get('formatter');
                labelEl.attr({
                    z2: showPointerAbove ? 0 : 2,
                    style: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createTextStyle"])(itemDetailModel, {
                        x: detailX,
                        y: detailY,
                        text: formatLabel(value, formatter_1),
                        width: isNaN(width) ? null : width,
                        height: isNaN(height) ? null : height,
                        align: 'center',
                        verticalAlign: 'middle'
                    }, {
                        inheritColor: detailColor
                    })
                });
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLabelValueAnimation"])(labelEl, {
                    normal: itemDetailModel
                }, value, function(value) {
                    return formatLabel(value, formatter_1);
                });
                hasAnimation && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["animateLabelValue"])(labelEl, idx, data, seriesModel, {
                    getFormattedLabel: function(labelDataIndex, status, dataType, labelDimIndex, fmt, extendParams) {
                        return formatLabel(extendParams ? extendParams.interpolatedValue : value, formatter_1);
                    }
                });
                itemGroup.add(labelEl);
            }
            contentGroup.add(itemGroup);
        });
        this.group.add(contentGroup);
        this._titleEls = newTitleEls;
        this._detailEls = newDetailEls;
    };
    GaugeView.type = 'gauge';
    return GaugeView;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = GaugeView;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/gauge/PointerPath.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Path.js [app-client] (ecmascript)");
;
;
var PointerShape = /** @class */ function() {
    function PointerShape() {
        this.angle = 0;
        this.width = 10;
        this.r = 10;
        this.x = 0;
        this.y = 0;
    }
    return PointerShape;
}();
var PointerPath = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(PointerPath, _super);
    function PointerPath(opts) {
        var _this = _super.call(this, opts) || this;
        _this.type = 'pointer';
        return _this;
    }
    PointerPath.prototype.getDefaultShape = function() {
        return new PointerShape();
    };
    PointerPath.prototype.buildPath = function(ctx, shape) {
        var mathCos = Math.cos;
        var mathSin = Math.sin;
        var r = shape.r;
        var width = shape.width;
        var angle = shape.angle;
        var x = shape.x - mathCos(angle) * width * (width >= r / 3 ? 1 : 2);
        var y = shape.y - mathSin(angle) * width * (width >= r / 3 ? 1 : 2);
        angle = shape.angle - Math.PI / 2;
        ctx.moveTo(x, y);
        ctx.lineTo(shape.x + mathCos(angle) * width, shape.y + mathSin(angle) * width);
        ctx.lineTo(shape.x + mathCos(shape.angle) * r, shape.y + mathSin(shape.angle) * r);
        ctx.lineTo(shape.x - mathCos(angle) * width, shape.y - mathSin(angle) * width);
        ctx.lineTo(x, y);
    };
    return PointerPath;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = PointerPath;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/gauge/install.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "install",
    ()=>install
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$gauge$2f$GaugeView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/gauge/GaugeView.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$gauge$2f$GaugeSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/gauge/GaugeSeries.js [app-client] (ecmascript)");
;
;
function install(registers) {
    registers.registerChartView(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$gauge$2f$GaugeView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
    registers.registerSeriesModel(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$gauge$2f$GaugeSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/gauge/install.js [app-client] (ecmascript) <export install as GaugeChart>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GaugeChart",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$gauge$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["install"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$gauge$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/gauge/install.js [app-client] (ecmascript)");
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/heatmap/HeatmapLayer.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
*/ /* global Uint8ClampedArray */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$platform$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/platform.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/tokens.js [app-client] (ecmascript)");
;
;
var GRADIENT_LEVELS = 256;
var HeatmapLayer = /** @class */ function() {
    function HeatmapLayer() {
        this.blurSize = 30;
        this.pointSize = 20;
        this.maxOpacity = 1;
        this.minOpacity = 0;
        this._gradientPixels = {
            inRange: null,
            outOfRange: null
        };
        var canvas = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$platform$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["platformApi"].createCanvas();
        this.canvas = canvas;
    }
    /**
   * Renders Heatmap and returns the rendered canvas
   * @param data array of data, each has x, y, value
   * @param width canvas width
   * @param height canvas height
   */ HeatmapLayer.prototype.update = function(data, width, height, normalize, colorFunc, isInRange) {
        var brush = this._getBrush();
        var gradientInRange = this._getGradient(colorFunc, 'inRange');
        var gradientOutOfRange = this._getGradient(colorFunc, 'outOfRange');
        var r = this.pointSize + this.blurSize;
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');
        var len = data.length;
        canvas.width = width;
        canvas.height = height;
        for(var i = 0; i < len; ++i){
            var p = data[i];
            var x = p[0];
            var y = p[1];
            var value = p[2];
            // calculate alpha using value
            var alpha = normalize(value);
            // draw with the circle brush with alpha
            ctx.globalAlpha = alpha;
            ctx.drawImage(brush, x - r, y - r);
        }
        if (!canvas.width || !canvas.height) {
            // Avoid "Uncaught DOMException: Failed to execute 'getImageData' on
            // 'CanvasRenderingContext2D': The source height is 0."
            return canvas;
        }
        // colorize the canvas using alpha value and set with gradient
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var pixels = imageData.data;
        var offset = 0;
        var pixelLen = pixels.length;
        var minOpacity = this.minOpacity;
        var maxOpacity = this.maxOpacity;
        var diffOpacity = maxOpacity - minOpacity;
        while(offset < pixelLen){
            var alpha = pixels[offset + 3] / 256;
            var gradientOffset = Math.floor(alpha * (GRADIENT_LEVELS - 1)) * 4;
            // Simple optimize to ignore the empty data
            if (alpha > 0) {
                var gradient = isInRange(alpha) ? gradientInRange : gradientOutOfRange;
                // Any alpha > 0 will be mapped to [minOpacity, maxOpacity]
                alpha > 0 && (alpha = alpha * diffOpacity + minOpacity);
                pixels[offset++] = gradient[gradientOffset];
                pixels[offset++] = gradient[gradientOffset + 1];
                pixels[offset++] = gradient[gradientOffset + 2];
                pixels[offset++] = gradient[gradientOffset + 3] * alpha * 256;
            } else {
                offset += 4;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        return canvas;
    };
    /**
   * get canvas of a black circle brush used for canvas to draw later
   */ HeatmapLayer.prototype._getBrush = function() {
        var brushCanvas = this._brushCanvas || (this._brushCanvas = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$platform$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["platformApi"].createCanvas());
        // set brush size
        var r = this.pointSize + this.blurSize;
        var d = r * 2;
        brushCanvas.width = d;
        brushCanvas.height = d;
        var ctx = brushCanvas.getContext('2d');
        ctx.clearRect(0, 0, d, d);
        // in order to render shadow without the distinct circle,
        // draw the distinct circle in an invisible place,
        // and use shadowOffset to draw shadow in the center of the canvas
        ctx.shadowOffsetX = d;
        ctx.shadowBlur = this.blurSize;
        // draw the shadow in black, and use alpha and shadow blur to generate
        // color in color map
        ctx.shadowColor = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.neutral99;
        // draw circle in the left to the canvas
        ctx.beginPath();
        ctx.arc(-r, r, this.pointSize, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        return brushCanvas;
    };
    /**
   * get gradient color map
   * @private
   */ HeatmapLayer.prototype._getGradient = function(colorFunc, state) {
        var gradientPixels = this._gradientPixels;
        var pixelsSingleState = gradientPixels[state] || (gradientPixels[state] = new Uint8ClampedArray(256 * 4));
        var color = [
            0,
            0,
            0,
            0
        ];
        var off = 0;
        for(var i = 0; i < 256; i++){
            colorFunc[state](i / 255, true, color);
            pixelsSingleState[off++] = color[0];
            pixelsSingleState[off++] = color[1];
            pixelsSingleState[off++] = color[2];
            pixelsSingleState[off++] = color[3];
        }
        return pixelsSingleState;
    };
    return HeatmapLayer;
}();
const __TURBOPACK__default__export__ = HeatmapLayer;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/heatmap/HeatmapSeries.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Series.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createSeriesData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createSeriesData.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/CoordinateSystem.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/tokens.js [app-client] (ecmascript)");
;
;
;
;
;
var HeatmapSeriesModel = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(HeatmapSeriesModel, _super);
    function HeatmapSeriesModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = HeatmapSeriesModel.type;
        return _this;
    }
    HeatmapSeriesModel.prototype.getInitialData = function(option, ecModel) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createSeriesData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(null, this, {
            generateCoord: 'value'
        });
    };
    HeatmapSeriesModel.prototype.preventIncremental = function() {
        var coordSysCreator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(this.get('coordinateSystem'));
        if (coordSysCreator && coordSysCreator.dimensions) {
            return coordSysCreator.dimensions[0] === 'lng' && coordSysCreator.dimensions[1] === 'lat';
        }
    };
    HeatmapSeriesModel.type = 'series.heatmap';
    HeatmapSeriesModel.dependencies = [
        'grid',
        'geo',
        'calendar',
        'matrix'
    ];
    HeatmapSeriesModel.defaultOption = {
        coordinateSystem: 'cartesian2d',
        // zlevel: 0,
        z: 2,
        // Cartesian coordinate system
        // xAxisIndex: 0,
        // yAxisIndex: 0,
        // Geo coordinate system
        geoIndex: 0,
        blurSize: 30,
        pointSize: 20,
        maxOpacity: 1,
        minOpacity: 0,
        select: {
            itemStyle: {
                borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.primary
            }
        }
    };
    return HeatmapSeriesModel;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = HeatmapSeriesModel;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/heatmap/HeatmapView.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/graphic.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rect$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Rect.js [app-client] (ecmascript) <export default as Rect>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/states.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$heatmap$2f$HeatmapLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/heatmap/HeatmapLayer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/view/Chart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$CoordinateSystem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/CoordinateSystem.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/label/labelStyle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisBand$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisBand.js [app-client] (ecmascript)");
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
function getIsInPiecewiseRange(dataExtent, pieceList, selected) {
    var dataSpan = dataExtent[1] - dataExtent[0];
    pieceList = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"](pieceList, function(piece) {
        return {
            interval: [
                (piece.interval[0] - dataExtent[0]) / dataSpan,
                (piece.interval[1] - dataExtent[0]) / dataSpan
            ]
        };
    });
    var len = pieceList.length;
    var lastIndex = 0;
    return function(val) {
        var i;
        // Try to find in the location of the last found
        for(i = lastIndex; i < len; i++){
            var interval = pieceList[i].interval;
            if (interval[0] <= val && val <= interval[1]) {
                lastIndex = i;
                break;
            }
        }
        if (i === len) {
            // Not found, back interation
            for(i = lastIndex - 1; i >= 0; i--){
                var interval = pieceList[i].interval;
                if (interval[0] <= val && val <= interval[1]) {
                    lastIndex = i;
                    break;
                }
            }
        }
        return i >= 0 && i < len && selected[i];
    };
}
function getIsInContinuousRange(dataExtent, range) {
    var dataSpan = dataExtent[1] - dataExtent[0];
    range = [
        (range[0] - dataExtent[0]) / dataSpan,
        (range[1] - dataExtent[0]) / dataSpan
    ];
    return function(val) {
        return val >= range[0] && val <= range[1];
    };
}
var HeatmapView = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(HeatmapView, _super);
    function HeatmapView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = HeatmapView.type;
        return _this;
    }
    HeatmapView.prototype.render = function(seriesModel, ecModel, api) {
        var visualMapOfThisSeries;
        ecModel.eachComponent('visualMap', function(visualMap) {
            visualMap.eachTargetSeries(function(targetSeries) {
                if (targetSeries === seriesModel) {
                    visualMapOfThisSeries = visualMap;
                }
            });
        });
        if ("TURBOPACK compile-time truthy", 1) {
            if (!visualMapOfThisSeries) {
                throw new Error('Heatmap must use with visualMap');
            }
        }
        // Clear previously rendered progressive elements.
        this._progressiveEls = null;
        this.group.removeAll();
        var coordSys = seriesModel.coordinateSystem;
        if (coordSys.type === 'cartesian2d' || coordSys.type === 'calendar' || coordSys.type === 'matrix') {
            this._renderOnGridLike(seriesModel, api, 0, seriesModel.getData().count());
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$CoordinateSystem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isGeoLikeCoordSys"])(coordSys)) {
            this._renderOnGeo(coordSys, seriesModel, visualMapOfThisSeries, api);
        }
    };
    HeatmapView.prototype.incrementalPrepareRender = function(seriesModel, ecModel, api) {
        this.group.removeAll();
    };
    HeatmapView.prototype.incrementalRender = function(params, seriesModel, ecModel, api) {
        var coordSys = seriesModel.coordinateSystem;
        if (coordSys) {
            // geo does not support incremental rendering?
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$CoordinateSystem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isGeoLikeCoordSys"])(coordSys)) {
                this.render(seriesModel, ecModel, api);
            } else {
                this._progressiveEls = [];
                this._renderOnGridLike(seriesModel, api, params.start, params.end, true);
            }
        }
    };
    HeatmapView.prototype.eachRendered = function(cb) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["traverseElements"](this._progressiveEls || this.group, cb);
    };
    HeatmapView.prototype._renderOnGridLike = function(seriesModel, api, start, end, useIncremental) {
        var coordSys = seriesModel.coordinateSystem;
        var isCartesian2d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$CoordinateSystem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isCoordinateSystemType"])(coordSys, 'cartesian2d');
        var isMatrix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$CoordinateSystem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isCoordinateSystemType"])(coordSys, 'matrix');
        var width;
        var height;
        var xAxisExtent;
        var yAxisExtent;
        if (isCartesian2d) {
            var xAxis = coordSys.getAxis('x');
            var yAxis = coordSys.getAxis('y');
            if ("TURBOPACK compile-time truthy", 1) {
                if (!(xAxis.type === 'category' && yAxis.type === 'category')) {
                    throw new Error('Heatmap on cartesian must have two category axes');
                }
                if (!(xAxis.onBand && yAxis.onBand)) {
                    throw new Error('Heatmap on cartesian must have two axes with boundaryGap true');
                }
            }
            // add 0.5px to avoid the gaps
            width = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisBand$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calcBandWidth"])(xAxis).w + .5;
            height = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisBand$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calcBandWidth"])(yAxis).w + .5;
            xAxisExtent = xAxis.scale.getExtent();
            yAxisExtent = yAxis.scale.getExtent();
        }
        var group = this.group;
        var data = seriesModel.getData();
        var emphasisStyle = seriesModel.getModel([
            'emphasis',
            'itemStyle'
        ]).getItemStyle();
        var blurStyle = seriesModel.getModel([
            'blur',
            'itemStyle'
        ]).getItemStyle();
        var selectStyle = seriesModel.getModel([
            'select',
            'itemStyle'
        ]).getItemStyle();
        var borderRadius = seriesModel.get([
            'itemStyle',
            'borderRadius'
        ]);
        var labelStatesModels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLabelStatesModels"])(seriesModel);
        var emphasisModel = seriesModel.getModel('emphasis');
        var focus = emphasisModel.get('focus');
        var blurScope = emphasisModel.get('blurScope');
        var emphasisDisabled = emphasisModel.get('disabled');
        var dataDims = isCartesian2d || isMatrix ? [
            data.mapDimension('x'),
            data.mapDimension('y'),
            data.mapDimension('value')
        ] : [
            data.mapDimension('time'),
            data.mapDimension('value')
        ];
        for(var idx = start; idx < end; idx++){
            var rect = void 0;
            var style = data.getItemVisual(idx, 'style');
            if (isCartesian2d) {
                var dataDimX = data.get(dataDims[0], idx);
                var dataDimY = data.get(dataDims[1], idx);
                // Ignore empty data and out of extent data
                if (isNaN(data.get(dataDims[2], idx)) || isNaN(dataDimX) || isNaN(dataDimY) || dataDimX < xAxisExtent[0] || dataDimX > xAxisExtent[1] || dataDimY < yAxisExtent[0] || dataDimY > yAxisExtent[1]) {
                    continue;
                }
                var point = coordSys.dataToPoint([
                    dataDimX,
                    dataDimY
                ]);
                rect = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rect$3e$__["Rect"]({
                    shape: {
                        x: point[0] - width / 2,
                        y: point[1] - height / 2,
                        width: width,
                        height: height
                    },
                    style: style
                });
            } else if (isMatrix) {
                var shape = coordSys.dataToLayout([
                    data.get(dataDims[0], idx),
                    data.get(dataDims[1], idx)
                ]).rect;
                if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eqNaN"](shape.x)) {
                    continue;
                }
                rect = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rect$3e$__["Rect"]({
                    z2: 1,
                    shape: shape,
                    style: style
                });
            } else {
                // Calendar
                // Ignore empty data
                if (isNaN(data.get(dataDims[1], idx))) {
                    continue;
                }
                var layout = coordSys.dataToLayout([
                    data.get(dataDims[0], idx)
                ]);
                var shape = layout.contentRect || layout.rect;
                if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eqNaN"](shape.x) || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eqNaN"](shape.y)) {
                    continue;
                }
                rect = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rect$3e$__["Rect"]({
                    z2: 1,
                    shape: shape,
                    style: style
                });
            }
            // Optimization for large dataset
            if (data.hasItemOption) {
                var itemModel = data.getItemModel(idx);
                var emphasisModel_1 = itemModel.getModel('emphasis');
                emphasisStyle = emphasisModel_1.getModel('itemStyle').getItemStyle();
                blurStyle = itemModel.getModel([
                    'blur',
                    'itemStyle'
                ]).getItemStyle();
                selectStyle = itemModel.getModel([
                    'select',
                    'itemStyle'
                ]).getItemStyle();
                // Each item value struct in the data would be firstly
                // {
                //     itemStyle: { borderRadius: [30, 30] },
                //     value: [2022, 02, 22]
                // }
                borderRadius = itemModel.get([
                    'itemStyle',
                    'borderRadius'
                ]);
                focus = emphasisModel_1.get('focus');
                blurScope = emphasisModel_1.get('blurScope');
                emphasisDisabled = emphasisModel_1.get('disabled');
                labelStatesModels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLabelStatesModels"])(itemModel);
            }
            rect.shape.r = borderRadius;
            var rawValue = seriesModel.getRawValue(idx);
            var defaultText = '-';
            if (rawValue && rawValue[2] != null) {
                defaultText = rawValue[2] + '';
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLabelStyle"])(rect, labelStatesModels, {
                labelFetcher: seriesModel,
                labelDataIndex: idx,
                defaultOpacity: style.opacity,
                defaultText: defaultText
            });
            rect.ensureState('emphasis').style = emphasisStyle;
            rect.ensureState('blur').style = blurStyle;
            rect.ensureState('select').style = selectStyle;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toggleHoverEmphasis"])(rect, focus, blurScope, emphasisDisabled);
            rect.incremental = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getIncrementalId"])(seriesModel, useIncremental);
            // PENDING
            if (useIncremental) {
                // Rect must use hover layer if it's incremental.
                rect.states.emphasis.hoverLayer = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["HOVER_LAYER_FOR_INCREMENTAL"];
            }
            group.add(rect);
            data.setItemGraphicEl(idx, rect);
            if (this._progressiveEls) {
                this._progressiveEls.push(rect);
            }
        }
    };
    HeatmapView.prototype._renderOnGeo = function(geo, seriesModel, visualMapModel, api) {
        var inRangeVisuals = visualMapModel.targetVisuals.inRange;
        var outOfRangeVisuals = visualMapModel.targetVisuals.outOfRange;
        // if (!visualMapping) {
        //     throw new Error('Data range must have color visuals');
        // }
        var data = seriesModel.getData();
        var hmLayer = this._hmLayer || this._hmLayer || new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$heatmap$2f$HeatmapLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]();
        hmLayer.blurSize = seriesModel.get('blurSize');
        hmLayer.pointSize = seriesModel.get('pointSize');
        hmLayer.minOpacity = seriesModel.get('minOpacity');
        hmLayer.maxOpacity = seriesModel.get('maxOpacity');
        var rect = geo.getViewRect().clone();
        var roamTransform = geo.getRoamTransform();
        rect.applyTransform(roamTransform);
        // Clamp on viewport
        var x = Math.max(rect.x, 0);
        var y = Math.max(rect.y, 0);
        var x2 = Math.min(rect.width + rect.x, api.getWidth());
        var y2 = Math.min(rect.height + rect.y, api.getHeight());
        var width = x2 - x;
        var height = y2 - y;
        var dims = [
            data.mapDimension('lng'),
            data.mapDimension('lat'),
            data.mapDimension('value')
        ];
        var points = data.mapArray(dims, function(lng, lat, value) {
            var pt = geo.dataToPoint([
                lng,
                lat
            ]);
            pt[0] -= x;
            pt[1] -= y;
            pt.push(value);
            return pt;
        });
        var dataExtent = visualMapModel.getExtent();
        var isInRange = visualMapModel.type === 'visualMap.continuous' ? getIsInContinuousRange(dataExtent, visualMapModel.option.range) : getIsInPiecewiseRange(dataExtent, visualMapModel.getPieceList(), visualMapModel.option.selected);
        hmLayer.update(points, width, height, inRangeVisuals.color.getNormalizer(), {
            inRange: inRangeVisuals.color.getColorMapper(),
            outOfRange: outOfRangeVisuals.color.getColorMapper()
        }, isInRange);
        var img = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"]({
            style: {
                width: width,
                height: height,
                x: x,
                y: y,
                image: hmLayer.canvas
            },
            silent: true
        });
        this.group.add(img);
    };
    HeatmapView.type = 'heatmap';
    return HeatmapView;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = HeatmapView;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/heatmap/install.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "install",
    ()=>install
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$heatmap$2f$HeatmapView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/heatmap/HeatmapView.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$heatmap$2f$HeatmapSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/heatmap/HeatmapSeries.js [app-client] (ecmascript)");
;
;
function install(registers) {
    registers.registerChartView(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$heatmap$2f$HeatmapView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
    registers.registerSeriesModel(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$heatmap$2f$HeatmapSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/heatmap/install.js [app-client] (ecmascript) <export install as HeatmapChart>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HeatmapChart",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$heatmap$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["install"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$heatmap$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/heatmap/install.js [app-client] (ecmascript)");
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/LargeSymbolDraw.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
/* global Float32Array */ // TODO Batch by color
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BoundingRect$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/BoundingRect.js [app-client] (ecmascript) <export default as BoundingRect>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Path$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Path.js [app-client] (ecmascript) <export default as Path>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Group$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Group.js [app-client] (ecmascript) <export default as Group>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/symbol.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/innerStore.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
;
;
;
;
;
var BOOST_SIZE_THRESHOLD = 4;
var LargeSymbolPathShape = /** @class */ function() {
    function LargeSymbolPathShape() {}
    return LargeSymbolPathShape;
}();
var LargeSymbolPath = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(LargeSymbolPath, _super);
    function LargeSymbolPath(opts) {
        var _this = _super.call(this, opts) || this;
        _this._off = 0;
        _this.hoverDataIdx = -1;
        return _this;
    }
    LargeSymbolPath.prototype.getDefaultShape = function() {
        return new LargeSymbolPathShape();
    };
    LargeSymbolPath.prototype.reset = function() {
        this.notClear = false;
        this._off = 0;
    };
    LargeSymbolPath.prototype.beforeBrush = function(param) {
        if (param && !param.contentRetained) {
            this.reset();
        }
    };
    LargeSymbolPath.prototype.buildPath = function(path, shape) {
        var points = shape.points;
        var size = shape.size;
        var symbolProxy = this.symbolProxy;
        var symbolProxyShape = symbolProxy.shape;
        var ctx = path.getContext ? path.getContext() : path;
        var canBoost = ctx && size[0] < BOOST_SIZE_THRESHOLD;
        var softClipShape = this.softClipShape;
        var i;
        // Do draw in afterBrush.
        if (canBoost) {
            this._ctx = ctx;
            return;
        }
        this._ctx = null;
        for(i = this._off; i < points.length;){
            var x = points[i++];
            var y = points[i++];
            if (isNaN(x) || isNaN(y)) {
                continue;
            }
            if (softClipShape && !softClipShape.contain(x, y)) {
                continue;
            }
            symbolProxyShape.x = x - size[0] / 2;
            symbolProxyShape.y = y - size[1] / 2;
            symbolProxyShape.width = size[0];
            symbolProxyShape.height = size[1];
            symbolProxy.buildPath(path, symbolProxyShape, true);
        }
        if (this.incremental) {
            this._off = i;
            this.notClear = true;
        }
    };
    LargeSymbolPath.prototype.afterBrush = function() {
        var shape = this.shape;
        var points = shape.points;
        var size = shape.size;
        var ctx = this._ctx;
        var softClipShape = this.softClipShape;
        var i;
        if (!ctx) {
            return;
        }
        // PENDING If style or other canvas status changed?
        for(i = this._off; i < points.length;){
            var x = points[i++];
            var y = points[i++];
            if (isNaN(x) || isNaN(y)) {
                continue;
            }
            if (softClipShape && !softClipShape.contain(x, y)) {
                continue;
            }
            // fillRect is faster than building a rect path and draw.
            // And it support light globalCompositeOperation.
            ctx.fillRect(x - size[0] / 2, y - size[1] / 2, size[0], size[1]);
        }
        if (this.incremental) {
            this._off = i;
            this.notClear = true;
        }
    };
    LargeSymbolPath.prototype.findDataIndex = function(x, y) {
        // TODO ???
        // Consider transform
        var shape = this.shape;
        var points = shape.points;
        var size = shape.size;
        var w = Math.max(size[0], 4);
        var h = Math.max(size[1], 4);
        // Not consider transform
        // Treat each element as a rect
        // top down traverse
        for(var idx = points.length / 2 - 1; idx >= 0; idx--){
            var i = idx * 2;
            var x0 = points[i] - w / 2;
            var y0 = points[i + 1] - h / 2;
            if (x >= x0 && y >= y0 && x <= x0 + w && y <= y0 + h) {
                return idx;
            }
        }
        return -1;
    };
    LargeSymbolPath.prototype.contain = function(x, y) {
        var localPos = this.transformCoordToLocal(x, y);
        var rect = this.getBoundingRect();
        x = localPos[0];
        y = localPos[1];
        if (rect.contain(x, y)) {
            // Cache found data index.
            var dataIdx = this.hoverDataIdx = this.findDataIndex(x, y);
            return dataIdx >= 0;
        }
        this.hoverDataIdx = -1;
        return false;
    };
    LargeSymbolPath.prototype.getBoundingRect = function() {
        // Ignore stroke for large symbol draw.
        var rect = this._rect;
        if (!rect) {
            var shape = this.shape;
            var points = shape.points;
            var size = shape.size;
            var w = size[0];
            var h = size[1];
            var minX = Infinity;
            var minY = Infinity;
            var maxX = -Infinity;
            var maxY = -Infinity;
            for(var i = 0; i < points.length;){
                var x = points[i++];
                var y = points[i++];
                minX = Math.min(x, minX);
                maxX = Math.max(x, maxX);
                minY = Math.min(y, minY);
                maxY = Math.max(y, maxY);
            }
            rect = this._rect = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BoundingRect$3e$__["BoundingRect"](minX - w / 2, minY - h / 2, maxX - minX + w, maxY - minY + h);
        }
        return rect;
    };
    return LargeSymbolPath;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Path$3e$__["Path"]);
var LargeSymbolDraw = /** @class */ function() {
    function LargeSymbolDraw() {
        this.group = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Group$3e$__["Group"]();
    }
    /**
   * Update symbols draw by new data
   */ LargeSymbolDraw.prototype.updateData = function(data, opt) {
        this._clear();
        this._data = data;
        var symbolEl = this._create();
        symbolEl.setShape({
            points: data.getLayout('points')
        });
        this._setCommon(symbolEl, data, opt);
    };
    LargeSymbolDraw.prototype.updateLayout = function(opt) {
        var data = this._data;
        if (!data) {
            return;
        }
        var points = data.getLayout('points');
        this.group.eachChild(function(child) {
            if (child.startIndex != null) {
                var len = (child.endIndex - child.startIndex) * 2;
                var byteOffset = child.startIndex * 4 * 2;
                points = new Float32Array(points.buffer, byteOffset, len);
            }
            child.setShape('points', points);
            // Reset draw cursor.
            child.reset();
            child.stopAnimation();
        });
    };
    LargeSymbolDraw.prototype.incrementalPrepareUpdate = function(data) {
        this._clear();
    };
    LargeSymbolDraw.prototype.incrementalUpdate = function(taskParams, data, incrementalId, opt) {
        var lastAdded = this._newAdded[0];
        var points = data.getLayout('points');
        var oldPoints = lastAdded && lastAdded.shape.points;
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateUpstreamOutputRange"])(data.getLayout('pointsRange'), taskParams);
        }
        // Merging the exists. Each element has 1e4 points.
        // Consider the performance balance between too much elements and too much points in one shape(may affect hover optimization)
        if (oldPoints && oldPoints.length < 2e4) {
            var oldLen = oldPoints.length;
            var newPoints = new Float32Array(oldLen + points.length);
            // Concat two array
            newPoints.set(oldPoints);
            newPoints.set(points, oldLen);
            // Update endIndex
            lastAdded.endIndex = taskParams.end;
            lastAdded.setShape({
                points: newPoints
            });
        } else {
            this._newAdded = [];
            var symbolEl = this._create();
            symbolEl.startIndex = taskParams.start;
            symbolEl.endIndex = taskParams.end;
            symbolEl.incremental = incrementalId;
            symbolEl.setShape({
                points: points
            });
            this._setCommon(symbolEl, data, opt);
        }
    };
    LargeSymbolDraw.prototype.eachRendered = function(cb) {
        this._newAdded[0] && cb(this._newAdded[0]);
    };
    LargeSymbolDraw.prototype._create = function() {
        var symbolEl = new LargeSymbolPath({
            cursor: 'default'
        });
        symbolEl.ignoreCoarsePointer = true;
        this.group.add(symbolEl);
        this._newAdded.push(symbolEl);
        return symbolEl;
    };
    LargeSymbolDraw.prototype._setCommon = function(symbolEl, data, opt) {
        var hostModel = data.hostModel;
        opt = opt || {};
        var size = data.getVisual('symbolSize');
        symbolEl.setShape('size', size instanceof Array ? size : [
            size,
            size
        ]);
        symbolEl.softClipShape = opt.clipShape || null;
        // Create symbolProxy to build path for each data
        symbolEl.symbolProxy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSymbol"])(data.getVisual('symbol'), 0, 0, 0, 0);
        // Use symbolProxy setColor method
        symbolEl.setColor = symbolEl.symbolProxy.setColor;
        var extrudeShadow = symbolEl.shape.size[0] < BOOST_SIZE_THRESHOLD;
        symbolEl.useStyle(// Draw shadow when doing fillRect is extremely slow.
        hostModel.getModel('itemStyle').getItemStyle(extrudeShadow ? [
            'color',
            'shadowBlur',
            'shadowColor'
        ] : [
            'color'
        ]));
        var globalStyle = data.getVisual('style');
        var visualColor = globalStyle && globalStyle.fill;
        if (visualColor) {
            symbolEl.setColor(visualColor);
        }
        var ecData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getECData"])(symbolEl);
        // Enable tooltip
        // PENDING May have performance issue when path is extremely large
        ecData.seriesIndex = hostModel.seriesIndex;
        symbolEl.on('mousemove', function(e) {
            ecData.dataIndex = null;
            var dataIndex = symbolEl.hoverDataIdx;
            if (dataIndex >= 0) {
                // Provide dataIndex for tooltip
                ecData.dataIndex = dataIndex + (symbolEl.startIndex || 0);
            }
        });
    };
    LargeSymbolDraw.prototype.remove = function() {
        this._clear();
    };
    LargeSymbolDraw.prototype._clear = function() {
        this._newAdded = [];
        this.group.removeAll();
    };
    return LargeSymbolDraw;
}();
const __TURBOPACK__default__export__ = LargeSymbolDraw;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/Symbol.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/symbol.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/animation/basicTransition.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Group$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Group.js [app-client] (ecmascript) <export default as Group>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/innerStore.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/states.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$labelHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/labelHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/label/labelStyle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Image.js [app-client] (ecmascript)");
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
var Symbol = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(Symbol, _super);
    function Symbol(data, idx, seriesScope, opts) {
        var _this = _super.call(this) || this;
        _this.updateData(data, idx, seriesScope, opts);
        return _this;
    }
    Symbol.prototype._createSymbol = function(symbolType, data, idx, symbolSize, z2, keepAspect) {
        // Remove paths created before
        this.removeAll();
        // let symbolPath = createSymbol(
        //     symbolType, -0.5, -0.5, 1, 1, color
        // );
        // If width/height are set too small (e.g., set to 1) on ios10
        // and macOS Sierra, a circle stroke become a rect, no matter what
        // the scale is set. So we set width/height as 2. See #4150.
        var symbolPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSymbol"])(symbolType, -1, -1, 2, 2, null, keepAspect);
        symbolPath.attr({
            z2: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["retrieve2"])(z2, 100),
            culling: true,
            scaleX: symbolSize[0] / 2,
            scaleY: symbolSize[1] / 2
        });
        // Rewrite drift method
        symbolPath.drift = driftSymbol;
        this._symbolType = symbolType;
        this.add(symbolPath);
    };
    /**
   * Stop animation
   * @param {boolean} toLastFrame
   */ Symbol.prototype.stopSymbolAnimation = function(toLastFrame) {
        this.childAt(0).stopAnimation(null, toLastFrame);
    };
    Symbol.prototype.getSymbolType = function() {
        return this._symbolType;
    };
    /**
   * FIXME:
   * Caution: This method breaks the encapsulation of this module,
   * but it indeed brings convenience. So do not use the method
   * unless you detailedly know all the implements of `Symbol`,
   * especially animation.
   *
   * Get symbol path element.
   */ Symbol.prototype.getSymbolPath = function() {
        return this.childAt(0);
    };
    /**
   * Highlight symbol
   */ Symbol.prototype.highlight = function() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enterEmphasis"])(this.childAt(0));
    };
    /**
   * Downplay symbol
   */ Symbol.prototype.downplay = function() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["leaveEmphasis"])(this.childAt(0));
    };
    /**
   * @param {number} zlevel
   * @param {number} z
   */ Symbol.prototype.setZ = function(zlevel, z) {
        var symbolPath = this.childAt(0);
        symbolPath.zlevel = zlevel;
        symbolPath.z = z;
    };
    Symbol.prototype.setDraggable = function(draggable, hasCursorOption) {
        var symbolPath = this.childAt(0);
        symbolPath.draggable = draggable;
        symbolPath.cursor = !hasCursorOption && draggable ? 'move' : symbolPath.cursor;
    };
    /**
   * Update symbol properties
   */ Symbol.prototype.updateData = function(data, idx, seriesScope, opts) {
        this.silent = false;
        var symbolType = data.getItemVisual(idx, 'symbol') || 'circle';
        var seriesModel = data.hostModel;
        var symbolSize = Symbol.getSymbolSize(data, idx);
        var z2 = Symbol.getSymbolZ2(data, idx);
        var isInit = symbolType !== this._symbolType;
        var disableAnimation = opts && opts.disableAnimation;
        if (isInit) {
            var keepAspect = data.getItemVisual(idx, 'symbolKeepAspect');
            this._createSymbol(symbolType, data, idx, symbolSize, z2, keepAspect);
        } else {
            var symbolPath = this.childAt(0);
            symbolPath.silent = false;
            var target = {
                scaleX: symbolSize[0] / 2,
                scaleY: symbolSize[1] / 2
            };
            disableAnimation ? symbolPath.attr(target) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProps"](symbolPath, target, seriesModel, idx);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveOldStyle"])(symbolPath);
        }
        this._updateCommon(data, idx, symbolSize, seriesScope, opts);
        if (isInit) {
            var symbolPath = this.childAt(0);
            if (!disableAnimation) {
                var target = {
                    scaleX: this._sizeX,
                    scaleY: this._sizeY,
                    style: {
                        // Always fadeIn. Because it has fadeOut animation when symbol is removed..
                        opacity: symbolPath.style.opacity
                    }
                };
                symbolPath.scaleX = symbolPath.scaleY = 0;
                symbolPath.style.opacity = 0;
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initProps"](symbolPath, target, seriesModel, idx);
            }
        }
        if (disableAnimation) {
            // Must stop leave transition manually if don't call initProps or updateProps.
            this.childAt(0).stopAnimation('leave');
        }
    };
    Symbol.prototype._updateCommon = function(data, idx, symbolSize, seriesScope, opts) {
        var symbolPath = this.childAt(0);
        var seriesModel = data.hostModel;
        var emphasisItemStyle;
        var blurItemStyle;
        var selectItemStyle;
        var focus;
        var blurScope;
        var emphasisDisabled;
        var labelStatesModels;
        var hoverScale;
        var cursorStyle;
        if (seriesScope) {
            emphasisItemStyle = seriesScope.emphasisItemStyle;
            blurItemStyle = seriesScope.blurItemStyle;
            selectItemStyle = seriesScope.selectItemStyle;
            focus = seriesScope.focus;
            blurScope = seriesScope.blurScope;
            labelStatesModels = seriesScope.labelStatesModels;
            hoverScale = seriesScope.hoverScale;
            cursorStyle = seriesScope.cursorStyle;
            emphasisDisabled = seriesScope.emphasisDisabled;
        }
        if (!seriesScope || data.hasItemOption) {
            var itemModel = seriesScope && seriesScope.itemModel ? seriesScope.itemModel : data.getItemModel(idx);
            var emphasisModel = itemModel.getModel('emphasis');
            emphasisItemStyle = emphasisModel.getModel('itemStyle').getItemStyle();
            selectItemStyle = itemModel.getModel([
                'select',
                'itemStyle'
            ]).getItemStyle();
            blurItemStyle = itemModel.getModel([
                'blur',
                'itemStyle'
            ]).getItemStyle();
            focus = emphasisModel.get('focus');
            blurScope = emphasisModel.get('blurScope');
            emphasisDisabled = emphasisModel.get('disabled');
            labelStatesModels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLabelStatesModels"])(itemModel);
            hoverScale = emphasisModel.getShallow('scale');
            cursorStyle = itemModel.getShallow('cursor');
        }
        var symbolRotate = data.getItemVisual(idx, 'symbolRotate');
        symbolPath.attr('rotation', (symbolRotate || 0) * Math.PI / 180 || 0);
        var symbolOffset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeSymbolOffset"])(data.getItemVisual(idx, 'symbolOffset'), symbolSize);
        if (symbolOffset) {
            symbolPath.x = symbolOffset[0];
            symbolPath.y = symbolOffset[1];
        }
        cursorStyle && symbolPath.attr('cursor', cursorStyle);
        var symbolStyle = data.getItemVisual(idx, 'style');
        var visualColor = symbolStyle.fill;
        if (symbolPath instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]) {
            var pathStyle = symbolPath.style;
            symbolPath.useStyle((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])({
                // TODO other properties like x, y ?
                image: pathStyle.image,
                x: pathStyle.x,
                y: pathStyle.y,
                width: pathStyle.width,
                height: pathStyle.height
            }, symbolStyle));
        } else {
            if (symbolPath.__isEmptyBrush) {
                // fill and stroke will be swapped if it's empty.
                // So we cloned a new style to avoid it affecting the original style in visual storage.
                // TODO Better implementation. No empty logic!
                symbolPath.useStyle((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])({}, symbolStyle));
            } else {
                symbolPath.useStyle(symbolStyle);
            }
            // Disable decal because symbol scale will been applied on the decal.
            symbolPath.style.decal = null;
            symbolPath.setColor(visualColor, opts && opts.symbolInnerColor);
            symbolPath.style.strokeNoScale = true;
        }
        var liftZ = data.getItemVisual(idx, 'liftZ');
        var z2Origin = this._z2;
        if (liftZ != null) {
            if (z2Origin == null) {
                this._z2 = symbolPath.z2;
                symbolPath.z2 += liftZ;
            }
        } else if (z2Origin != null) {
            symbolPath.z2 = z2Origin;
            this._z2 = null;
        }
        var useNameLabel = opts && opts.useNameLabel;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLabelStyle"])(symbolPath, labelStatesModels, {
            labelFetcher: seriesModel,
            labelDataIndex: idx,
            defaultText: getLabelDefaultText,
            inheritColor: visualColor,
            defaultOpacity: symbolStyle.opacity
        });
        // Do not execute util needed.
        function getLabelDefaultText(idx) {
            return useNameLabel ? data.getName(idx) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$labelHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDefaultLabel"])(data, idx);
        }
        this._sizeX = symbolSize[0] / 2;
        this._sizeY = symbolSize[1] / 2;
        var emphasisState = symbolPath.ensureState('emphasis');
        emphasisState.style = emphasisItemStyle;
        symbolPath.ensureState('select').style = selectItemStyle;
        symbolPath.ensureState('blur').style = blurItemStyle;
        // null / undefined / true means to use default strategy.
        // 0 / false / negative number / NaN / Infinity means no scale.
        var scaleRatio = hoverScale == null || hoverScale === true ? Math.max(1.1, 3 / this._sizeY) : isFinite(hoverScale) && hoverScale > 0 ? +hoverScale : 1;
        // always set scale to allow resetting
        emphasisState.scaleX = this._sizeX * scaleRatio;
        emphasisState.scaleY = this._sizeY * scaleRatio;
        this.setSymbolScale(1);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toggleHoverEmphasis"])(this, focus, blurScope, emphasisDisabled);
    };
    Symbol.prototype.setSymbolScale = function(scale) {
        this.scaleX = this.scaleY = scale;
    };
    Symbol.prototype.fadeOut = function(cb, seriesModel, opt) {
        var symbolPath = this.childAt(0);
        var dataIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getECData"])(this).dataIndex;
        var animationOpt = opt && opt.animation;
        // Avoid mistaken hover when fading out
        this.silent = symbolPath.silent = true;
        // Not show text when animating
        if (opt && opt.fadeLabel) {
            var textContent = symbolPath.getTextContent();
            if (textContent) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeElement"](textContent, {
                    style: {
                        opacity: 0
                    }
                }, seriesModel, {
                    dataIndex: dataIndex,
                    removeOpt: animationOpt,
                    cb: function() {
                        symbolPath.removeTextContent();
                    }
                });
            }
        } else {
            symbolPath.removeTextContent();
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeElement"](symbolPath, {
            style: {
                opacity: 0
            },
            scaleX: 0,
            scaleY: 0
        }, seriesModel, {
            dataIndex: dataIndex,
            cb: cb,
            removeOpt: animationOpt
        });
    };
    Symbol.getSymbolSize = function(data, idx) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeSymbolSize"])(data.getItemVisual(idx, 'symbolSize'));
    };
    Symbol.getSymbolZ2 = function(data, idx) {
        return data.getItemVisual(idx, 'z2');
    };
    return Symbol;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Group$3e$__["Group"]);
function driftSymbol(dx, dy) {
    this.parent.drift(dx, dy);
}
const __TURBOPACK__default__export__ = Symbol;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/SymbolDraw.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/animation/basicTransition.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/graphic.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Group$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Group.js [app-client] (ecmascript) <export default as Group>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$Symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/Symbol.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/label/labelStyle.js [app-client] (ecmascript)");
;
;
;
;
function symbolNeedsDraw(data, point, idx, opt) {
    return point && !isNaN(point[0]) && !isNaN(point[1]) && !(opt && opt.isIgnore && opt.isIgnore(idx)) && !(opt && opt.clipShape && !opt.clipShape.contain(point[0], point[1])) && data.getItemVisual(idx, 'symbol') !== 'none';
}
function normalizeUpdateOpt(opt) {
    if (opt != null && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObject"])(opt)) {
        opt = {
            isIgnore: opt
        };
    }
    return opt || {};
}
function makeSeriesScope(data) {
    var seriesModel = data.hostModel;
    var emphasisModel = seriesModel.getModel('emphasis');
    return {
        emphasisItemStyle: emphasisModel.getModel('itemStyle').getItemStyle(),
        blurItemStyle: seriesModel.getModel([
            'blur',
            'itemStyle'
        ]).getItemStyle(),
        selectItemStyle: seriesModel.getModel([
            'select',
            'itemStyle'
        ]).getItemStyle(),
        focus: emphasisModel.get('focus'),
        blurScope: emphasisModel.get('blurScope'),
        emphasisDisabled: emphasisModel.get('disabled'),
        hoverScale: emphasisModel.get('scale'),
        labelStatesModels: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLabelStatesModels"])(seriesModel),
        cursorStyle: seriesModel.get('cursor')
    };
}
function createEl(SymbolCtor, data, newIdx, seriesScope, symbolUpdateOpt, point, group) {
    var symbolEl = new SymbolCtor(data, newIdx, seriesScope, symbolUpdateOpt);
    symbolEl.setPosition(point);
    data.setItemGraphicEl(newIdx, symbolEl);
    group.add(symbolEl);
    return symbolEl;
}
var SymbolDraw = /** @class */ function() {
    function SymbolDraw(SymbolCtor) {
        this.group = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Group$3e$__["Group"]();
        this._SymbolCtor = SymbolCtor || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$Symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
    }
    /**
   * Update symbols draw by new data
   */ SymbolDraw.prototype.updateData = function(data, opt) {
        // Remove progressive els.
        this._progressiveEls = null;
        opt = normalizeUpdateOpt(opt);
        var group = this.group;
        var seriesModel = data.hostModel;
        var oldData = this._data;
        var SymbolCtor = this._SymbolCtor;
        var disableAnimation = opt.disableAnimation;
        var seriesScope = this._seriesScope = makeSeriesScope(data);
        var symbolUpdateOpt = {
            disableAnimation: disableAnimation
        };
        var getSymbolPoint = opt.getSymbolPoint || function(idx) {
            return data.getItemLayout(idx);
        };
        // There is no oldLineData only when first rendering or switching from
        // stream mode to normal mode, where previous elements should be removed.
        if (!oldData) {
            group.removeAll();
        }
        data.diff(oldData).add(function(newIdx) {
            var point = getSymbolPoint(newIdx);
            if (symbolNeedsDraw(data, point, newIdx, opt)) {
                createEl(SymbolCtor, data, newIdx, seriesScope, symbolUpdateOpt, point, group);
            }
        }).update(function(newIdx, oldIdx) {
            var symbolEl = oldData.getItemGraphicEl(oldIdx);
            var point = getSymbolPoint(newIdx);
            if (!symbolNeedsDraw(data, point, newIdx, opt)) {
                group.remove(symbolEl);
                return;
            }
            var newSymbolType = data.getItemVisual(newIdx, 'symbol') || 'circle';
            var oldSymbolType = symbolEl && symbolEl.getSymbolType && symbolEl.getSymbolType();
            if (!symbolEl || oldSymbolType && oldSymbolType !== newSymbolType) {
                group.remove(symbolEl);
                symbolEl = new SymbolCtor(data, newIdx, seriesScope, symbolUpdateOpt);
                symbolEl.setPosition(point);
            } else {
                symbolEl.updateData(data, newIdx, seriesScope, symbolUpdateOpt);
                var target = {
                    x: point[0],
                    y: point[1]
                };
                disableAnimation ? symbolEl.attr(target) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProps"](symbolEl, target, seriesModel);
            }
            // Add back
            group.add(symbolEl);
            data.setItemGraphicEl(newIdx, symbolEl);
        }).remove(function(oldIdx) {
            var el = oldData.getItemGraphicEl(oldIdx);
            el && el.fadeOut(function() {
                group.remove(el);
            }, seriesModel);
        }).execute();
        this._getSymbolPoint = getSymbolPoint;
        this._data = data;
    };
    ;
    SymbolDraw.prototype.updateLayout = function(opt) {
        var data = this._data;
        if (!data) {
            return;
        }
        var symbolDraw = this;
        var store = data.getStore();
        for(var idx = 0, len = store.count(); idx < len; idx++){
            var el = data.getItemGraphicEl(idx);
            var point = symbolDraw._getSymbolPoint(idx);
            // FIXME: [FIXME_SYMBOL_CLIP_CONSIDERING_COORD_SYS_ALIGNMENT_DURING_ANIMATION]
            //  See VIEW_COORD_SYS animation (by center/zoom change) and FIXME_VIEW_COORD_SYS_SYNC_BACK.
            //  If we create symbols when roaming them into the clip area, they can not be laid out
            //  based on the intermediate state but can only based on the final state of VIEW_COORD_SYS,
            //  and introduce visual artifacts.
            // Consider clip, need to handle create or remove.
            if (symbolNeedsDraw(data, point, idx, opt)) {
                el = el || createEl(symbolDraw._SymbolCtor, data, idx, symbolDraw._seriesScope, {
                    disableAnimation: true
                }, point, symbolDraw.group);
                el.stopAnimation();
                el.setPosition(point);
                el.markRedraw();
            } else if (el) {
                symbolDraw.group.remove(el);
                data.setItemGraphicEl(idx, null);
            }
        }
    };
    ;
    SymbolDraw.prototype.incrementalPrepareUpdate = function(data) {
        this._seriesScope = makeSeriesScope(data);
        this._data = null;
        this.group.removeAll();
    };
    ;
    SymbolDraw.prototype.incrementalUpdate = function(taskParams, data, incrementalId, opt) {
        // Clear
        this._progressiveEls = [];
        opt = normalizeUpdateOpt(opt);
        function updateIncrementalAndHover(el) {
            if (!el.isGroup) {
                el.incremental = incrementalId;
                el.ensureState('emphasis').hoverLayer = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["HOVER_LAYER_FOR_INCREMENTAL"];
            }
        }
        for(var idx = taskParams.start; idx < taskParams.end; idx++){
            var point = data.getItemLayout(idx);
            if (symbolNeedsDraw(data, point, idx, opt)) {
                var el = new this._SymbolCtor(data, idx, this._seriesScope);
                el.traverse(updateIncrementalAndHover);
                el.setPosition(point);
                this.group.add(el);
                data.setItemGraphicEl(idx, el);
                this._progressiveEls.push(el);
            }
        }
    };
    ;
    SymbolDraw.prototype.eachRendered = function(cb) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["traverseElements"](this._progressiveEls || this.group, cb);
    };
    SymbolDraw.prototype.remove = function(enableAnimation) {
        var group = this.group;
        var data = this._data;
        // Incremental model do not have this._data.
        if (data && enableAnimation) {
            data.eachItemGraphicEl(function(el) {
                el.fadeOut(function() {
                    group.remove(el);
                }, data.hostModel);
            });
        } else {
            group.removeAll();
        }
    };
    ;
    return SymbolDraw;
}();
const __TURBOPACK__default__export__ = SymbolDraw;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/axisSnippets.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createBandWidthBasedAxisContainShapeHandler",
    ()=>createBandWidthBasedAxisContainShapeHandler,
    "createMetricsNonOrdinalLinearPositiveMinGap",
    ()=>createMetricsNonOrdinalLinearPositiveMinGap,
    "makeAxisStatKey",
    ()=>makeAxisStatKey,
    "makeAxisStatKey2",
    ()=>makeAxisStatKey2
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisBand$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisBand.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisStatistics.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatisticsMetricsImpl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisStatisticsMetricsImpl.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/helper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-client] (ecmascript)");
;
;
;
;
;
function createBandWidthBasedAxisContainShapeHandler(axisStatKey) {
    // [AXIS_CONTAIN_SHAPE_COMMON_STRATEGY]:
    //  The calculation below is based on a proportion mapping
    //  from `[barsBoundVal[0], barsBoundVal[1]]` to `[minValNew, maxValNew]`:
    //                  |------|------------------------------|---|
    //     barsBoundVal[0]   minValOld                 maxValOld barsBoundVal[1]
    //                         |----|----------------------|--|
    //                  minValNew    minValOld     maxValOld maxValNew
    //     (Note: `|---|` above represents "pixels" rather than "data".)
    return function(axis, ecModel) {
        var bandWidthResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisBand$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calcBandWidth"])(axis, {
            fromStat: {
                key: axisStatKey
            }
        });
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNullableNumberFinite"])(bandWidthResult.w2)) {
            return [
                -bandWidthResult.w2 / 2,
                bandWidthResult.w2 / 2
            ];
        }
    };
}
function makeAxisStatKey(seriesType) {
    return seriesType + __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AXIS_STAT_KEY_DELIMITER"];
}
function makeAxisStatKey2(seriesType, coordSysType) {
    return seriesType + __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AXIS_STAT_KEY_DELIMITER"] + coordSysType;
}
function createMetricsNonOrdinalLinearPositiveMinGap(axis) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatisticsMetricsImpl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerMetricImplLiPosMinGap"])();
    return {
        // non-category scale do not use `liPosMinGap` to calculate `bandWidth`.
        liPosMinGap: !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isOrdinalScale"])(axis.scale)
    };
}
;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createClipPathFromCoordSys.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SHAPE_CLIP_KIND_FULLY_CLIPPED",
    ()=>SHAPE_CLIP_KIND_FULLY_CLIPPED,
    "SHAPE_CLIP_KIND_NOT_CLIPPED",
    ()=>SHAPE_CLIP_KIND_NOT_CLIPPED,
    "SHAPE_CLIP_KIND_PARTIALLY_CLIPPED",
    ()=>SHAPE_CLIP_KIND_PARTIALLY_CLIPPED,
    "createClipPath",
    ()=>createClipPath,
    "createCoordSysClipAreaSimply",
    ()=>createCoordSysClipAreaSimply,
    "createGridClipPath",
    ()=>createGridClipPath,
    "createPolarClipPath",
    ()=>createPolarClipPath,
    "updateClipPath",
    ()=>updateClipPath
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rect$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Rect.js [app-client] (ecmascript) <export default as Rect>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/animation/basicTransition.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Sector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sector$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Sector.js [app-client] (ecmascript) <export default as Sector>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
;
;
;
function createGridClipPath(cartesian, hasAnimation, seriesModel, done, during) {
    var rect = cartesian.getArea();
    var x = rect.x;
    var y = rect.y;
    var width = rect.width;
    var height = rect.height;
    var lineWidth = seriesModel.get([
        'lineStyle',
        'width'
    ]) || 0;
    // Expand the clip path a bit to avoid the border is clipped and looks thinner
    x -= lineWidth / 2;
    y -= lineWidth / 2;
    width += lineWidth;
    height += lineWidth;
    // fix: https://github.com/apache/incubator-echarts/issues/11369
    width = Math.ceil(width);
    if (x !== Math.floor(x)) {
        x = Math.floor(x);
        // if no extra 1px on `width`, it will still be clipped since `x` is floored
        width++;
    }
    var clipPath = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rect$3e$__["Rect"]({
        shape: {
            x: x,
            y: y,
            width: width,
            height: height
        }
    });
    if (hasAnimation) {
        var baseAxis = cartesian.getBaseAxis();
        var isHorizontal = baseAxis.isHorizontal();
        var isAxisInversed = baseAxis.inverse;
        if (isHorizontal) {
            if (isAxisInversed) {
                clipPath.shape.x += width;
            }
            clipPath.shape.width = 0;
        } else {
            if (!isAxisInversed) {
                clipPath.shape.y += height;
            }
            clipPath.shape.height = 0;
        }
        var duringCb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFunction"])(during) ? function(percent) {
            during(percent, clipPath);
        } : null;
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initProps"](clipPath, {
            shape: {
                width: width,
                height: height,
                x: x,
                y: y
            }
        }, seriesModel, null, done, duringCb);
    }
    return clipPath;
}
function createPolarClipPath(polar, hasAnimation, seriesModel) {
    var sectorArea = polar.getArea();
    // Avoid float number rounding error for symbol on the edge of axis extent.
    var r0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(sectorArea.r0, 1);
    var r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(sectorArea.r, 1);
    var clipPath = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Sector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sector$3e$__["Sector"]({
        shape: {
            cx: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(polar.cx, 1),
            cy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(polar.cy, 1),
            r0: r0,
            r: r,
            startAngle: sectorArea.startAngle,
            endAngle: sectorArea.endAngle,
            clockwise: sectorArea.clockwise
        }
    });
    if (hasAnimation) {
        var isRadial = polar.getBaseAxis().dim === 'angle';
        if (isRadial) {
            clipPath.shape.endAngle = sectorArea.startAngle;
        } else {
            clipPath.shape.r = r0;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initProps"](clipPath, {
            shape: {
                endAngle: sectorArea.endAngle,
                r: r
            }
        }, seriesModel);
    }
    return clipPath;
}
function createClipPath(coordSys, hasAnimation, seriesModel, done, during) {
    if (!coordSys) {
        return null;
    } else if (coordSys.type === 'polar') {
        return createPolarClipPath(coordSys, hasAnimation, seriesModel);
    } else if (coordSys.type === 'cartesian2d') {
        return createGridClipPath(coordSys, hasAnimation, seriesModel, done, during);
    }
    return null;
}
var SHAPE_CLIP_KIND_NOT_CLIPPED = 0;
var SHAPE_CLIP_KIND_PARTIALLY_CLIPPED = 1;
var SHAPE_CLIP_KIND_FULLY_CLIPPED = 2;
function updateClipPath(clip, symbolEl, clipPath) {
    if (clip) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])(clipPath);
        }
        symbolEl.setClipPath(clipPath);
    } else {
        symbolEl.removeClipPath();
    }
}
function createCoordSysClipAreaSimply(seriesModel) {
    var coordSys = seriesModel.coordinateSystem;
    if (seriesModel.get('clip', true) && coordSys && (!coordSys.shouldClip || coordSys.shouldClip())) {
        // PENDING make `0.1` configurable, for example, `clipTolerance`?
        return coordSys.getArea && coordSys.getArea(.1);
    }
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createGraphFromNodeEdge.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>createGraphFromNodeEdge
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$SeriesData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/SeriesData.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Graph$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/Graph.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$linkSeriesData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/linkSeriesData.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$createDimensions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/createDimensions.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/CoordinateSystem.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createSeriesData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createSeriesData.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
function createGraphFromNodeEdge(nodes, edges, seriesModel, directed, beforeLink) {
    // ??? TODO
    // support dataset?
    var graph = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Graph$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](directed);
    for(var i = 0; i < nodes.length; i++){
        graph.addNode(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["retrieve"](// Id, name, dataIndex
        nodes[i].id, nodes[i].name, i), i);
    }
    var linkNameList = [];
    var validEdges = [];
    var linkCount = 0;
    for(var i = 0; i < edges.length; i++){
        var link = edges[i];
        var source = link.source;
        var target = link.target;
        // addEdge may fail when source or target not exists
        if (graph.addEdge(source, target, linkCount)) {
            validEdges.push(link);
            linkNameList.push(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["retrieve"]((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertOptionIdName"])(link.id, null), source + ' > ' + target));
            linkCount++;
        }
    }
    var coordSys = seriesModel.get('coordinateSystem');
    var nodeData;
    if (coordSys === 'cartesian2d' || coordSys === 'polar' || coordSys === 'matrix') {
        nodeData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createSeriesData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(nodes, seriesModel);
    } else {
        var coordSysCtor = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(coordSys);
        var coordDimensions = coordSysCtor ? coordSysCtor.dimensions || [] : [];
        // FIXME: Some geo do not need `value` dimenson, whereas `calendar` needs
        // `value` dimension, but graph need `value` dimension. It's better to
        // uniform this behavior.
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indexOf"](coordDimensions, 'value') < 0) {
            coordDimensions.concat([
                'value'
            ]);
        }
        var dimensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$createDimensions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(nodes, {
            coordDimensions: coordDimensions,
            encodeDefine: seriesModel.getEncode()
        }).dimensions;
        nodeData = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$SeriesData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](dimensions, seriesModel);
        nodeData.initData(nodes);
    }
    var edgeData = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$SeriesData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]([
        'value'
    ], seriesModel);
    edgeData.initData(validEdges, linkNameList);
    beforeLink && beforeLink(nodeData, edgeData);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$linkSeriesData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        mainData: nodeData,
        struct: graph,
        structAttr: 'graph',
        datas: {
            node: nodeData,
            edge: edgeData
        },
        datasAttr: {
            node: 'data',
            edge: 'edgeData'
        }
    });
    // Update dataIndex of nodes and edges because invalid edge may be removed
    graph.update();
    return graph;
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createRenderPlanner.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>createRenderPlanner
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
;
function createRenderPlanner() {
    var inner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeInner"])();
    return function(seriesModel) {
        var fields = inner(seriesModel);
        var pipelineContext = seriesModel.pipelineContext;
        var originalLarge = !!fields.large;
        var originalProgressive = !!fields.progressiveRender;
        // FIXME: if the planner works on a filtered series, `pipelineContext` does not
        // exists. See #11611 . Probably we need to modify this structure, see the comment
        // on `performRawSeries` in `Schedular.js`.
        var large = fields.large = !!(pipelineContext && pipelineContext.large);
        var progressive = fields.progressiveRender = !!(pipelineContext && pipelineContext.progressiveRender);
        return !!(originalLarge !== large || originalProgressive !== progressive) && 'reset';
    };
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createSeriesData.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$SeriesData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/SeriesData.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$createDimensions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/createDimensions.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dimensionHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/dimensionHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/CoordinateSystem.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$referHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/referHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Source$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/Source.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataStackHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/dataStackHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$sourceHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/sourceHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/types.js [app-client] (ecmascript)");
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
function getCoordSysDimDefs(seriesModel, coordSysInfo) {
    var coordSysName = seriesModel.get('coordinateSystem');
    var registeredCoordSys = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(coordSysName);
    var coordSysDimDefs;
    if (coordSysInfo && coordSysInfo.coordSysDims) {
        coordSysDimDefs = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"](coordSysInfo.coordSysDims, function(dim) {
            var dimInfo = {
                name: dim
            };
            var axisModel = coordSysInfo.axisMap.get(dim);
            if (axisModel) {
                var axisType = axisModel.get('type');
                dimInfo.type = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dimensionHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDimensionTypeByAxis"])(axisType);
            }
            return dimInfo;
        });
    }
    if (!coordSysDimDefs) {
        // Get dimensions from registered coordinate system
        coordSysDimDefs = registeredCoordSys && (registeredCoordSys.getDimensionsInfo ? registeredCoordSys.getDimensionsInfo() : registeredCoordSys.dimensions.slice()) || [
            'x',
            'y'
        ];
    }
    return coordSysDimDefs;
}
function injectOrdinalMeta(dimInfoList, createInvertedIndices, coordSysInfo) {
    var firstCategoryDimIndex;
    var hasNameEncode;
    coordSysInfo && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](dimInfoList, function(dimInfo, dimIndex) {
        var coordDim = dimInfo.coordDim;
        var categoryAxisModel = coordSysInfo.categoryAxisMap.get(coordDim);
        if (categoryAxisModel) {
            if (firstCategoryDimIndex == null) {
                firstCategoryDimIndex = dimIndex;
            }
            dimInfo.ordinalMeta = categoryAxisModel.getOrdinalMeta();
            if (createInvertedIndices) {
                dimInfo.createInvertedIndices = true;
            }
        }
        if (dimInfo.otherDims.itemName != null) {
            hasNameEncode = true;
        }
    });
    if (!hasNameEncode && firstCategoryDimIndex != null) {
        dimInfoList[firstCategoryDimIndex].otherDims.itemName = 0;
    }
    return firstCategoryDimIndex;
}
/**
 * Caution: there are side effects to `sourceManager` in this method.
 * Should better only be called in `Series['getInitialData']`.
 */ function createSeriesData(sourceRaw, seriesModel, opt) {
    opt = opt || {};
    var sourceManager = seriesModel.getSourceManager();
    var source;
    var isOriginalSource = false;
    if (sourceRaw) {
        isOriginalSource = true;
        source = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Source$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSourceFromSeriesDataOption"])(sourceRaw);
    } else {
        source = sourceManager.getSource();
        // Is series.data. not dataset.
        isOriginalSource = source.sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ORIGINAL"];
    }
    var coordSysInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$referHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCoordSysInfoBySeries"])(seriesModel);
    var coordSysDimDefs = getCoordSysDimDefs(seriesModel, coordSysInfo);
    var useEncodeDefaulter = opt.useEncodeDefaulter;
    var encodeDefaulter = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFunction"](useEncodeDefaulter) ? useEncodeDefaulter : useEncodeDefaulter ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["curry"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$sourceHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeSeriesEncodeForAxisCoordSys"], coordSysDimDefs, seriesModel) : null;
    var createDimensionOptions = {
        coordDimensions: coordSysDimDefs,
        generateCoord: opt.generateCoord,
        encodeDefine: seriesModel.getEncode(),
        encodeDefaulter: encodeDefaulter,
        canOmitUnusedDimensions: !isOriginalSource
    };
    var schema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$createDimensions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(source, createDimensionOptions);
    var firstCategoryDimIndex = injectOrdinalMeta(schema.dimensions, opt.createInvertedIndices, coordSysInfo);
    var store = !isOriginalSource ? sourceManager.getSharedDataStore(schema) : null;
    var stackCalculationInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataStackHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enableDataStack"])(seriesModel, {
        schema: schema,
        store: store
    });
    var data = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$SeriesData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](schema, seriesModel);
    data.setCalculationInfo(stackCalculationInfo);
    var dimValueGetter = firstCategoryDimIndex != null && isNeedCompleteOrdinalData(source) ? function(itemOpt, dimName, dataIndex, dimIndex) {
        // Use dataIndex as ordinal value in categoryAxis
        return dimIndex === firstCategoryDimIndex ? dataIndex : this.defaultDimValueGetter(itemOpt, dimName, dataIndex, dimIndex);
    } : null;
    data.hasItemOption = false;
    data.initData(// Try to reuse the data store in sourceManager if using dataset.
    isOriginalSource ? source : store, null, dimValueGetter);
    return data;
}
function isNeedCompleteOrdinalData(source) {
    if (source.sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ORIGINAL"]) {
        var sampleItem = firstDataNotNull(source.data || []);
        return !__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"]((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDataItemValue"])(sampleItem));
    }
}
function firstDataNotNull(arr) {
    var i = 0;
    while(i < arr.length && arr[i] == null){
        i++;
    }
    return arr[i];
}
const __TURBOPACK__default__export__ = createSeriesData;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createSeriesDataSimply.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>createSeriesDataSimply
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$createDimensions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/createDimensions.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$SeriesData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/SeriesData.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
;
;
;
function createSeriesDataSimply(seriesModel, opt, nameList) {
    opt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(opt) && {
        coordDimensions: opt
    } || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])({
        encodeDefine: seriesModel.getEncode()
    }, opt);
    var source = seriesModel.getSource();
    var dimensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$createDimensions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(source, opt).dimensions;
    var list = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$SeriesData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](dimensions, seriesModel);
    list.initData(source, nameList);
    return list;
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/labelHelper.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDefaultInterpolatedLabel",
    ()=>getDefaultInterpolatedLabel,
    "getDefaultLabel",
    ()=>getDefaultLabel
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/dataProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
;
;
function getDefaultLabel(data, dataIndex) {
    var labelDims = data.mapDimensionsAll('defaultedLabel');
    var len = labelDims.length;
    // Simple optimization (in lots of cases, label dims length is 1)
    if (len === 1) {
        var rawVal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["retrieveRawValue"])(data, dataIndex, labelDims[0]);
        return rawVal != null ? rawVal + '' : null;
    } else if (len) {
        var vals = [];
        for(var i = 0; i < labelDims.length; i++){
            vals.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["retrieveRawValue"])(data, dataIndex, labelDims[i]));
        }
        return vals.join(' ');
    }
}
function getDefaultInterpolatedLabel(data, interpolatedValue) {
    var labelDims = data.mapDimensionsAll('defaultedLabel');
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(interpolatedValue)) {
        return interpolatedValue + '';
    }
    var vals = [];
    for(var i = 0; i < labelDims.length; i++){
        var dimIndex = data.getDimensionIndex(labelDims[i]);
        if (dimIndex >= 0) {
            vals.push(interpolatedValue[dimIndex]);
        }
    }
    return vals.join(' ');
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/sectorHelper.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSectorCornerRadius",
    ()=>getSectorCornerRadius
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$contain$2f$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/contain/text.js [app-client] (ecmascript)");
;
;
function getSectorCornerRadius(model, shape, zeroIfNull) {
    var cornerRadius = model.get('borderRadius');
    if (cornerRadius == null) {
        return zeroIfNull ? {
            cornerRadius: 0
        } : null;
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(cornerRadius)) {
        cornerRadius = [
            cornerRadius,
            cornerRadius,
            cornerRadius,
            cornerRadius
        ];
    }
    var dr = Math.abs(shape.r || 0 - shape.r0 || 0);
    return {
        cornerRadius: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(cornerRadius, function(cr) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$contain$2f$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(cr, dr);
        })
    };
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/treeHelper.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "aboveViewRoot",
    ()=>aboveViewRoot,
    "getPathToRoot",
    ()=>getPathToRoot,
    "retrieveTargetInfo",
    ()=>retrieveTargetInfo,
    "wrapTreePathInfo",
    ()=>wrapTreePathInfo
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
;
function retrieveTargetInfo(payload, validPayloadTypes, seriesModel) {
    if (payload && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indexOf"](validPayloadTypes, payload.type) >= 0) {
        var root = seriesModel.getData().tree.root;
        var targetNode = payload.targetNode;
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"](targetNode)) {
            targetNode = root.getNodeById(targetNode);
        }
        if (targetNode && root.contains(targetNode)) {
            return {
                node: targetNode
            };
        }
        var targetNodeId = payload.targetNodeId;
        if (targetNodeId != null && (targetNode = root.getNodeById(targetNodeId))) {
            return {
                node: targetNode
            };
        }
    }
}
function getPathToRoot(node) {
    var path = [];
    while(node){
        node = node.parentNode;
        node && path.push(node);
    }
    return path.reverse();
}
function aboveViewRoot(viewRoot, node) {
    var viewPath = getPathToRoot(viewRoot);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indexOf"](viewPath, node) >= 0;
}
function wrapTreePathInfo(node, seriesModel) {
    var treePathInfo = [];
    while(node){
        var nodeDataIndex = node.dataIndex;
        treePathInfo.push({
            name: node.name,
            dataIndex: nodeDataIndex,
            value: seriesModel.getRawValue(nodeDataIndex)
        });
        node = node.parentNode;
    }
    treePathInfo.reverse();
    return treePathInfo;
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/line/LineSeries.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createSeriesData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createSeriesData.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Series.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/symbol.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Group$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Group.js [app-client] (ecmascript) <export default as Group>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/tokens.js [app-client] (ecmascript)");
;
;
;
;
;
;
var LineSeriesModel = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(LineSeriesModel, _super);
    function LineSeriesModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = LineSeriesModel.type;
        _this.hasSymbolVisual = true;
        return _this;
    }
    LineSeriesModel.prototype.getInitialData = function(option) {
        if ("TURBOPACK compile-time truthy", 1) {
            var coordSys = option.coordinateSystem;
            if (coordSys !== 'polar' && coordSys !== 'cartesian2d') {
                throw new Error('Line not support coordinateSystem besides cartesian and polar');
            }
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createSeriesData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(null, this, {
            useEncodeDefaulter: true
        });
    };
    LineSeriesModel.prototype.getLegendIcon = function(opt) {
        var group = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Group$3e$__["Group"]();
        var line = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSymbol"])('line', 0, opt.itemHeight / 2, opt.itemWidth, 0, opt.lineStyle.stroke, false);
        group.add(line);
        line.setStyle(opt.lineStyle);
        var visualType = this.getData().getVisual('symbol');
        var visualRotate = this.getData().getVisual('symbolRotate');
        var symbolType = visualType === 'none' ? 'circle' : visualType;
        // Symbol size is 80% when there is a line
        var size = opt.itemHeight * 0.8;
        var symbol = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSymbol"])(symbolType, (opt.itemWidth - size) / 2, (opt.itemHeight - size) / 2, size, size, opt.itemStyle.fill);
        group.add(symbol);
        symbol.setStyle(opt.itemStyle);
        var symbolRotate = opt.iconRotate === 'inherit' ? visualRotate : opt.iconRotate || 0;
        symbol.rotation = symbolRotate * Math.PI / 180;
        symbol.setOrigin([
            opt.itemWidth / 2,
            opt.itemHeight / 2
        ]);
        if (symbolType.indexOf('empty') > -1) {
            symbol.style.stroke = symbol.style.fill;
            symbol.style.fill = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.neutral00;
            symbol.style.lineWidth = 2;
        }
        return group;
    };
    LineSeriesModel.type = 'series.line';
    LineSeriesModel.dependencies = [
        'grid',
        'polar'
    ];
    LineSeriesModel.defaultOption = {
        // zlevel: 0,
        z: 3,
        coordinateSystem: 'cartesian2d',
        legendHoverLink: true,
        clip: true,
        label: {
            position: 'top'
        },
        // itemStyle: {
        // },
        endLabel: {
            show: false,
            valueAnimation: true,
            distance: 8
        },
        lineStyle: {
            width: 2,
            type: 'solid'
        },
        emphasis: {
            scale: true
        },
        // areaStyle: {
        // origin of areaStyle. Valid values:
        // `'auto'/null/undefined`: from axisLine to data
        // `'start'`: from min to data
        // `'end'`: from data to max
        // origin: 'auto'
        // },
        // false, 'start', 'end', 'middle'
        step: false,
        // Disabled if step is true
        smooth: false,
        smoothMonotone: null,
        symbol: 'emptyCircle',
        symbolSize: 6,
        symbolRotate: null,
        showSymbol: true,
        // `false`: follow the label interval strategy.
        // `true`: show all symbols.
        // `'auto'`: If possible, show all symbols, otherwise
        //           follow the label interval strategy.
        showAllSymbol: 'auto',
        // Whether to connect break point. (non-finite values)
        connectNulls: false,
        // Sampling for large data. Can be: 'average', 'max', 'min', 'sum', 'lttb'.
        sampling: 'none',
        animationEasing: 'linear',
        // Disable progressive
        progressive: 0,
        hoverLayerThreshold: Infinity,
        universalTransition: {
            divideShape: 'clone'
        },
        /**
     * @deprecated
     */ triggerLineEvent: false,
        triggerEvent: false
    };
    return LineSeriesModel;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = LineSeriesModel;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/line/LineView.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
// FIXME step not support polar
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$SymbolDraw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/SymbolDraw.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$Symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/Symbol.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$lineAnimationDiff$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/line/lineAnimationDiff.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Group$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Group.js [app-client] (ecmascript) <export default as Group>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/animation/basicTransition.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Text$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Text.js [app-client] (ecmascript) <export default as Text>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$LinearGradient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LinearGradient$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/LinearGradient.js [app-client] (ecmascript) <export default as LinearGradient>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$poly$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/line/poly.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/view/Chart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/line/helper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createClipPathFromCoordSys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createClipPathFromCoordSys.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$CoordinateSystem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/CoordinateSystem.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/states.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/label/labelStyle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$labelHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/labelHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/innerStore.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$vendor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/vendor.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/format.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$styleCompat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/styleCompat.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/tool/color.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisHelper.js [app-client] (ecmascript)");
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
function isPointsSame(points1, points2) {
    if (points1.length !== points2.length) {
        return;
    }
    for(var i = 0; i < points1.length; i++){
        if (points1[i] !== points2[i]) {
            return;
        }
    }
    return true;
}
function xyExtentFromPoints(points) {
    var xExtent = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initExtentForUnion"]();
    var yExtent = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initExtentForUnion"]();
    for(var i = 0; i < points.length;){
        var x = points[i++];
        var y = points[i++];
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPointIllegal"])(x, y)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unionExtentFromNumber"](xExtent, x);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unionExtentFromNumber"](yExtent, y);
        }
    }
    return [
        xExtent,
        yExtent
    ];
}
function getBoundingDiff(points1, points2) {
    var _a = xyExtentFromPoints(points1), xExtent1 = _a[0], yExtent1 = _a[1];
    var _b = xyExtentFromPoints(points2), xExtent2 = _b[0], yExtent2 = _b[1];
    // Get a max value from each corner of two boundings.
    return Math.max(Math.abs(xExtent1[0] - xExtent2[0]), Math.abs(yExtent1[0] - yExtent2[0]), Math.abs(xExtent1[1] - xExtent2[1]), Math.abs(yExtent1[1] - yExtent2[1]));
}
function getSmooth(smooth) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"](smooth) ? smooth : smooth ? 0.5 : 0;
}
function getStackedOnPoints(coordSys, data, dataCoordInfo) {
    if (dataCoordInfo.valueDim == null) {
        return [];
    }
    var len = data.count();
    var points = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$vendor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFloat32Array"])(len * 2);
    for(var idx = 0; idx < len; idx++){
        var pt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStackedOnPoint"])(dataCoordInfo, coordSys, data, idx);
        points[idx * 2] = pt[0];
        points[idx * 2 + 1] = pt[1];
    }
    return points;
}
/**
 * Filter the null data and extend data for step considering `stepTurnAt`
 *
 * @param points data to convert, that may containing null
 * @param basePoints base data to reference, used only for areaStyle points
 * @param coordSys coordinate system
 * @param stepTurnAt 'start' | 'end' | 'middle' | true
 * @param connectNulls whether to connect nulls
 * @returns converted point positions
 */ function turnPointsIntoStep(points, basePoints, coordSys, stepTurnAt, connectNulls) {
    var baseAxis = coordSys.getBaseAxis();
    var baseIndex = baseAxis.dim === 'x' || baseAxis.dim === 'radius' ? 0 : 1;
    var stepPoints = [];
    var i = 0;
    var stepPt = [];
    var pt = [];
    var nextPt = [];
    var filteredPoints = [];
    if (connectNulls) {
        for(i = 0; i < points.length; i += 2){
            /**
       * For areaStyle of stepped lines, `stackedOnPoints` should be
       * filtered the same as `points` so that the base axis values
       * should stay the same as the lines above. See #20021
       */ var reference = basePoints || points;
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPointIllegal"])(reference[i], reference[i + 1])) {
                filteredPoints.push(points[i], points[i + 1]);
            }
        }
        points = filteredPoints;
    }
    for(i = 0; i < points.length - 2; i += 2){
        nextPt[0] = points[i + 2];
        nextPt[1] = points[i + 3];
        pt[0] = points[i];
        pt[1] = points[i + 1];
        stepPoints.push(pt[0], pt[1]);
        switch(stepTurnAt){
            case 'end':
                stepPt[baseIndex] = nextPt[baseIndex];
                stepPt[1 - baseIndex] = pt[1 - baseIndex];
                stepPoints.push(stepPt[0], stepPt[1]);
                break;
            case 'middle':
                var middle = (pt[baseIndex] + nextPt[baseIndex]) / 2;
                var stepPt2 = [];
                stepPt[baseIndex] = stepPt2[baseIndex] = middle;
                stepPt[1 - baseIndex] = pt[1 - baseIndex];
                stepPt2[1 - baseIndex] = nextPt[1 - baseIndex];
                stepPoints.push(stepPt[0], stepPt[1]);
                stepPoints.push(stepPt2[0], stepPt2[1]);
                break;
            default:
                // default is start
                stepPt[baseIndex] = pt[baseIndex];
                stepPt[1 - baseIndex] = nextPt[1 - baseIndex];
                stepPoints.push(stepPt[0], stepPt[1]);
        }
    }
    // Last points
    stepPoints.push(points[i++], points[i++]);
    return stepPoints;
}
/**
 * Clip color stops to edge. Avoid creating too large gradients.
 * Which may lead to blurry when GPU acceleration is enabled. See #15680
 *
 * The stops has been sorted from small to large.
 */ function clipColorStops(colorStops, maxSize) {
    var newColorStops = [];
    var len = colorStops.length;
    // coord will always < 0 in prevOutOfRangeColorStop.
    var prevOutOfRangeColorStop;
    var prevInRangeColorStop;
    function lerpStop(stop0, stop1, clippedCoord) {
        var coord0 = stop0.coord;
        var p = (clippedCoord - coord0) / (stop1.coord - coord0);
        var color = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lerp"])(p, [
            stop0.color,
            stop1.color
        ]);
        return {
            coord: clippedCoord,
            color: color
        };
    }
    for(var i = 0; i < len; i++){
        var stop_1 = colorStops[i];
        var coord = stop_1.coord;
        if (coord < 0) {
            prevOutOfRangeColorStop = stop_1;
        } else if (coord > maxSize) {
            if (prevInRangeColorStop) {
                newColorStops.push(lerpStop(prevInRangeColorStop, stop_1, maxSize));
            } else if (prevOutOfRangeColorStop) {
                // If there are two stops and coord range is between these two stops
                newColorStops.push(lerpStop(prevOutOfRangeColorStop, stop_1, 0), lerpStop(prevOutOfRangeColorStop, stop_1, maxSize));
            }
            break;
        } else {
            if (prevOutOfRangeColorStop) {
                newColorStops.push(lerpStop(prevOutOfRangeColorStop, stop_1, 0));
                // Reset
                prevOutOfRangeColorStop = null;
            }
            newColorStops.push(stop_1);
            prevInRangeColorStop = stop_1;
        }
    }
    return newColorStops;
}
function getVisualGradient(data, coordSys, api) {
    var visualMetaList = data.getVisual('visualMeta');
    if (!visualMetaList || !visualMetaList.length || !data.count()) {
        // When data.count() is 0, gradient range can not be calculated.
        return;
    }
    if (coordSys.type !== 'cartesian2d') {
        if ("TURBOPACK compile-time truthy", 1) {
            console.warn('Visual map on line style is only supported on cartesian2d.');
        }
        return;
    }
    var coordDim;
    var visualMeta;
    for(var i = visualMetaList.length - 1; i >= 0; i--){
        var dimInfo = data.getDimensionInfo(visualMetaList[i].dimension);
        coordDim = dimInfo && dimInfo.coordDim;
        // Can only be x or y
        if (coordDim === 'x' || coordDim === 'y') {
            visualMeta = visualMetaList[i];
            break;
        }
    }
    if (!visualMeta) {
        if ("TURBOPACK compile-time truthy", 1) {
            console.warn('Visual map on line style only support x or y dimension.');
        }
        return;
    }
    // If the area to be rendered is bigger than area defined by LinearGradient,
    // the canvas spec prescribes that the color of the first stop and the last
    // stop should be used. But if two stops are added at offset 0, in effect
    // browsers use the color of the second stop to render area outside
    // LinearGradient. So we can only infinitesimally extend area defined in
    // LinearGradient to render `outerColors`.
    var axis = coordSys.getAxis(coordDim);
    // dataToCoord mapping may not be linear, but must be monotonic.
    var colorStops = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"](visualMeta.stops, function(stop) {
        // offset will be calculated later.
        return {
            coord: axis.toGlobalCoord(axis.dataToCoord(stop.value)),
            color: stop.color
        };
    });
    var stopLen = colorStops.length;
    var outerColors = visualMeta.outerColors.slice();
    if (stopLen && colorStops[0].coord > colorStops[stopLen - 1].coord) {
        colorStops.reverse();
        outerColors.reverse();
    }
    var colorStopsInRange = clipColorStops(colorStops, coordDim === 'x' ? api.getWidth() : api.getHeight());
    var inRangeStopLen = colorStopsInRange.length;
    if (!inRangeStopLen && stopLen) {
        // All stops are out of range. All will be the same color.
        return colorStops[0].coord < 0 ? outerColors[1] ? outerColors[1] : colorStops[stopLen - 1].color : outerColors[0] ? outerColors[0] : colorStops[0].color;
    }
    var tinyExtent = 10; // Arbitrary value: 10px
    var minCoord = colorStopsInRange[0].coord - tinyExtent;
    var maxCoord = colorStopsInRange[inRangeStopLen - 1].coord + tinyExtent;
    var coordSpan = maxCoord - minCoord;
    if (coordSpan < 1e-3) {
        return 'transparent';
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](colorStopsInRange, function(stop) {
        stop.offset = (stop.coord - minCoord) / coordSpan;
    });
    colorStopsInRange.push({
        // NOTE: inRangeStopLen may still be 0 if stoplen is zero.
        offset: inRangeStopLen ? colorStopsInRange[inRangeStopLen - 1].offset : 0.5,
        color: outerColors[1] || 'transparent'
    });
    colorStopsInRange.unshift({
        offset: inRangeStopLen ? colorStopsInRange[0].offset : 0.5,
        color: outerColors[0] || 'transparent'
    });
    var gradient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$LinearGradient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LinearGradient$3e$__["LinearGradient"](0, 0, 0, 0, colorStopsInRange, true);
    gradient[coordDim] = minCoord;
    gradient[coordDim + '2'] = maxCoord;
    return gradient;
}
function getIsIgnoreFunc(seriesModel, data, coordSys) {
    var showAllSymbol = seriesModel.get('showAllSymbol');
    var isAuto = showAllSymbol === 'auto';
    if (showAllSymbol && !isAuto) {
        return;
    }
    var categoryAxis = coordSys.getAxesByScale('ordinal')[0];
    if (!categoryAxis) {
        return;
    }
    // Note that category label interval strategy might bring some weird effect
    // in some scenario: users may wonder why some of the symbols are not
    // displayed. So we show all symbols as possible as we can.
    if (isAuto && canShowAllSymbolForCategory(categoryAxis, data)) {
        return;
    }
    // Otherwise follow the label interval strategy on category axis.
    var categoryDataDim = data.mapDimension(categoryAxis.dim);
    var labelMap = {};
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](categoryAxis.getViewLabels(), function(labelItem) {
        if (!labelItem.tick.offInterval) {
            labelMap[(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTickValueOutermost"])(categoryAxis.scale, labelItem.tick)] = 1;
        }
    });
    return function(dataIndex) {
        return !labelMap.hasOwnProperty(data.get(categoryDataDim, dataIndex));
    };
}
function canShowAllSymbolForCategory(categoryAxis, data) {
    // In most cases, line is monotonous on category axis, and the label size
    // is close with each other. So we check the symbol size and some of the
    // label size alone with the category axis to estimate whether all symbol
    // can be shown without overlap.
    var axisExtent = categoryAxis.getExtent();
    var availSize = Math.abs(axisExtent[1] - axisExtent[0]) / categoryAxis.scale.count();
    isNaN(availSize) && (availSize = 0); // 0/0 is NaN.
    // Sampling some points, max 5.
    var dataLen = data.count();
    var step = Math.max(1, Math.round(dataLen / 5));
    for(var dataIndex = 0; dataIndex < dataLen; dataIndex += step){
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$Symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getSymbolSize(data, dataIndex)[categoryAxis.isHorizontal() ? 1 : 0] * 1.5 > availSize) {
            return false;
        }
    }
    return true;
}
function getLastIndexNotNull(points) {
    var len = points.length / 2;
    for(; len > 0; len--){
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPointIllegal"])(points[len * 2 - 2], points[len * 2 - 1])) {
            break;
        }
    }
    return len - 1;
}
function getPointAtIndex(points, idx) {
    return [
        points[idx * 2],
        points[idx * 2 + 1]
    ];
}
function getIndexRange(points, xOrY, dim) {
    var len = points.length / 2;
    var dimIdx = dim === 'x' ? 0 : 1;
    var a;
    var b;
    var prevIndex = 0;
    var nextIndex = -1;
    for(var i = 0; i < len; i++){
        b = points[i * 2 + dimIdx];
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPointIllegal"])(b, points[i * 2 + 1 - dimIdx])) {
            continue;
        }
        if (i === 0) {
            a = b;
            continue;
        }
        if (a <= xOrY && b >= xOrY || a >= xOrY && b <= xOrY) {
            nextIndex = i;
            break;
        }
        prevIndex = i;
        a = b;
    }
    return {
        range: [
            prevIndex,
            nextIndex
        ],
        t: (xOrY - a) / (b - a)
    };
}
function anyStateShowEndLabel(seriesModel) {
    if (seriesModel.get([
        'endLabel',
        'show'
    ])) {
        return true;
    }
    for(var i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SPECIAL_STATES"].length; i++){
        if (seriesModel.get([
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SPECIAL_STATES"][i],
            'endLabel',
            'show'
        ])) {
            return true;
        }
    }
    return false;
}
function createLineClipPath(lineView, coordSys, hasAnimation, seriesModel) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$CoordinateSystem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isCoordinateSystemType"])(coordSys, 'cartesian2d')) {
        var endLabelModel_1 = seriesModel.getModel('endLabel');
        var valueAnimation_1 = endLabelModel_1.get('valueAnimation');
        var data_1 = seriesModel.getData();
        var labelAnimationRecord_1 = {
            lastFrameIndex: 0
        };
        var during = anyStateShowEndLabel(seriesModel) ? function(percent, clipRect) {
            lineView._endLabelOnDuring(percent, clipRect, data_1, labelAnimationRecord_1, valueAnimation_1, endLabelModel_1, coordSys);
        } : null;
        var isHorizontal = coordSys.getBaseAxis().isHorizontal();
        var clipPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createClipPathFromCoordSys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createGridClipPath"])(coordSys, hasAnimation, seriesModel, function() {
            var endLabel = lineView._endLabel;
            if (endLabel && hasAnimation) {
                if (labelAnimationRecord_1.originalX != null) {
                    endLabel.attr({
                        x: labelAnimationRecord_1.originalX,
                        y: labelAnimationRecord_1.originalY
                    });
                }
            }
        }, during);
        // Expand clip shape to avoid clipping when line value exceeds axis
        if (!seriesModel.get('clip', true)) {
            var rectShape = clipPath.shape;
            var expandSize = Math.max(rectShape.width, rectShape.height);
            if (isHorizontal) {
                rectShape.y -= expandSize;
                rectShape.height += expandSize * 2;
            } else {
                rectShape.x -= expandSize;
                rectShape.width += expandSize * 2;
            }
        }
        // Set to the final frame. To make sure label layout is right.
        if (during) {
            during(1, clipPath);
        }
        return clipPath;
    } else {
        if ("TURBOPACK compile-time truthy", 1) {
            if (seriesModel.get([
                'endLabel',
                'show'
            ])) {
                console.warn('endLabel is not supported for lines in polar systems.');
            }
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createClipPathFromCoordSys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPolarClipPath"])(coordSys, hasAnimation, seriesModel);
    }
}
function getEndLabelStateSpecified(endLabelModel, coordSys) {
    var baseAxis = coordSys.getBaseAxis();
    var isHorizontal = baseAxis.isHorizontal();
    var isBaseInversed = baseAxis.inverse;
    var align = isHorizontal ? isBaseInversed ? 'right' : 'left' : 'center';
    var verticalAlign = isHorizontal ? 'middle' : isBaseInversed ? 'top' : 'bottom';
    return {
        normal: {
            align: endLabelModel.get('align') || align,
            verticalAlign: endLabelModel.get('verticalAlign') || verticalAlign
        }
    };
}
var LineView = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(LineView, _super);
    function LineView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LineView.prototype.init = function() {
        var lineGroup = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Group$3e$__["Group"]();
        var symbolDraw = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$SymbolDraw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]();
        this.group.add(symbolDraw.group);
        this._symbolDraw = symbolDraw;
        this._lineGroup = lineGroup;
        this._changePolyState = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bind"](this._changePolyState, this);
    };
    LineView.prototype.render = function(seriesModel, ecModel, api) {
        var coordSys = seriesModel.coordinateSystem;
        var group = this.group;
        var data = seriesModel.getData();
        var lineStyleModel = seriesModel.getModel('lineStyle');
        var areaStyleModel = seriesModel.getModel('areaStyle');
        var points = data.getLayout('points') || [];
        var isCoordSysPolar = coordSys.type === 'polar';
        var prevCoordSys = this._coordSys;
        var symbolDraw = this._symbolDraw;
        var polyline = this._polyline;
        var polygon = this._polygon;
        var lineGroup = this._lineGroup;
        var hasAnimation = !ecModel.ssr && seriesModel.get('animation');
        var isAreaChart = !areaStyleModel.isEmpty();
        var valueOrigin = areaStyleModel.get('origin');
        var dataCoordInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["prepareDataCoordInfo"])(coordSys, data, valueOrigin);
        var stackedOnPoints = isAreaChart && getStackedOnPoints(coordSys, data, dataCoordInfo);
        var showSymbol = seriesModel.get('showSymbol');
        var connectNulls = seriesModel.get('connectNulls');
        var isIgnoreFunc = showSymbol && !isCoordSysPolar && getIsIgnoreFunc(seriesModel, data, coordSys);
        // Remove temporary symbols
        var oldData = this._data;
        oldData && oldData.eachItemGraphicEl(function(el, idx) {
            if (el.__temp) {
                group.remove(el);
                oldData.setItemGraphicEl(idx, null);
            }
        });
        // Remove previous created symbols if showSymbol changed to false
        if (!showSymbol) {
            symbolDraw.remove();
        }
        group.add(lineGroup);
        // FIXME step not support polar
        var step = !isCoordSysPolar ? seriesModel.get('step') : false;
        var clipShapeForSymbol;
        if (coordSys && coordSys.getArea && seriesModel.get('clip', true)) {
            clipShapeForSymbol = coordSys.getArea();
            // Avoid float number rounding error for symbol on the edge of axis extent.
            // See #7913 and `test/dataZoom-clip.html`.
            if (clipShapeForSymbol.width != null) {
                clipShapeForSymbol.x -= 0.1;
                clipShapeForSymbol.y -= 0.1;
                clipShapeForSymbol.width += 0.2;
                clipShapeForSymbol.height += 0.2;
            } else if (clipShapeForSymbol.r0) {
                clipShapeForSymbol.r0 -= 0.5;
                clipShapeForSymbol.r += 0.5;
            }
        }
        this._clipShapeForSymbol = clipShapeForSymbol;
        var visualColor = getVisualGradient(data, coordSys, api) || data.getVisual('style')[data.getVisual('drawType')];
        // Initialization animation or coordinate system changed
        if (!(polyline && prevCoordSys.type === coordSys.type && step === this._step)) {
            showSymbol && symbolDraw.updateData(data, {
                isIgnore: isIgnoreFunc,
                clipShape: clipShapeForSymbol,
                disableAnimation: true,
                getSymbolPoint: function(idx) {
                    return [
                        points[idx * 2],
                        points[idx * 2 + 1]
                    ];
                }
            });
            hasAnimation && this._initSymbolLabelAnimation(data, coordSys, clipShapeForSymbol);
            if (step) {
                if (stackedOnPoints) {
                    stackedOnPoints = turnPointsIntoStep(stackedOnPoints, points, coordSys, step, connectNulls);
                }
                // TODO If stacked series is not step
                points = turnPointsIntoStep(points, null, coordSys, step, connectNulls);
            }
            polyline = this._newPolyline(points);
            if (isAreaChart) {
                polygon = this._newPolygon(points, stackedOnPoints);
            } else if (polygon) {
                lineGroup.remove(polygon);
                polygon = this._polygon = null;
            }
            // NOTE: Must update _endLabel before setClipPath.
            if (!isCoordSysPolar) {
                this._initOrUpdateEndLabel(seriesModel, coordSys, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertToColorString"])(visualColor));
            }
            lineGroup.setClipPath(createLineClipPath(this, coordSys, true, seriesModel));
        } else {
            if (isAreaChart && !polygon) {
                // If areaStyle is added
                polygon = this._newPolygon(points, stackedOnPoints);
            } else if (polygon && !isAreaChart) {
                // If areaStyle is removed
                lineGroup.remove(polygon);
                polygon = this._polygon = null;
            }
            // NOTE: Must update _endLabel before setClipPath.
            if (!isCoordSysPolar) {
                this._initOrUpdateEndLabel(seriesModel, coordSys, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertToColorString"])(visualColor));
            }
            // Update clipPath
            var oldClipPath = lineGroup.getClipPath();
            if (oldClipPath) {
                var newClipPath = createLineClipPath(this, coordSys, false, seriesModel);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initProps"](oldClipPath, {
                    shape: newClipPath.shape
                }, seriesModel);
            } else {
                lineGroup.setClipPath(createLineClipPath(this, coordSys, true, seriesModel));
            }
            // Always update, or it is wrong in the case turning on legend
            // because points are not changed.
            showSymbol && symbolDraw.updateData(data, {
                isIgnore: isIgnoreFunc,
                clipShape: clipShapeForSymbol,
                disableAnimation: true,
                getSymbolPoint: function(idx) {
                    return [
                        points[idx * 2],
                        points[idx * 2 + 1]
                    ];
                }
            });
            // In the case data zoom triggered refreshing frequently
            // Data may not change if line has a category axis. So it should animate nothing.
            if (!isPointsSame(this._stackedOnPoints, stackedOnPoints) || !isPointsSame(this._points, points)) {
                if (hasAnimation) {
                    this._doUpdateAnimation(data, stackedOnPoints, coordSys, api, step, valueOrigin, connectNulls);
                } else {
                    // Not do it in update with animation
                    if (step) {
                        if (stackedOnPoints) {
                            stackedOnPoints = turnPointsIntoStep(stackedOnPoints, points, coordSys, step, connectNulls);
                        }
                        // TODO If stacked series is not step
                        points = turnPointsIntoStep(points, null, coordSys, step, connectNulls);
                    }
                    polyline.setShape({
                        points: points
                    });
                    polygon && polygon.setShape({
                        points: points,
                        stackedOnPoints: stackedOnPoints
                    });
                }
            }
        }
        var emphasisModel = seriesModel.getModel('emphasis');
        var focus = emphasisModel.get('focus');
        var blurScope = emphasisModel.get('blurScope');
        var emphasisDisabled = emphasisModel.get('disabled');
        polyline.useStyle(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaults"](// Use color in lineStyle first
        lineStyleModel.getLineStyle(), {
            fill: 'none',
            stroke: visualColor,
            lineJoin: 'bevel'
        }));
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setStatesStylesFromModel"])(polyline, seriesModel, 'lineStyle');
        if (polyline.style.lineWidth > 0 && seriesModel.get([
            'emphasis',
            'lineStyle',
            'width'
        ]) === 'bolder') {
            var emphasisLineStyle = polyline.getState('emphasis').style;
            emphasisLineStyle.lineWidth = +polyline.style.lineWidth + 1;
        }
        // Needs seriesIndex for focus
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getECData"])(polyline).seriesIndex = seriesModel.seriesIndex;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toggleHoverEmphasis"])(polyline, focus, blurScope, emphasisDisabled);
        var smooth = getSmooth(seriesModel.get('smooth'));
        var smoothMonotone = seriesModel.get('smoothMonotone');
        polyline.setShape({
            smooth: smooth,
            smoothMonotone: smoothMonotone,
            connectNulls: connectNulls
        });
        if (polygon) {
            var stackedOnSeries = data.getCalculationInfo('stackedOnSeries');
            var stackedOnSmooth = 0;
            polygon.useStyle(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaults"](areaStyleModel.getAreaStyle(), {
                fill: visualColor,
                opacity: 0.7,
                lineJoin: 'bevel',
                decal: data.getVisual('style').decal
            }));
            if (stackedOnSeries) {
                stackedOnSmooth = getSmooth(stackedOnSeries.get('smooth'));
            }
            polygon.setShape({
                smooth: smooth,
                stackedOnSmooth: stackedOnSmooth,
                smoothMonotone: smoothMonotone,
                connectNulls: connectNulls
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setStatesStylesFromModel"])(polygon, seriesModel, 'areaStyle');
            // Needs seriesIndex for focus
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getECData"])(polygon).seriesIndex = seriesModel.seriesIndex;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toggleHoverEmphasis"])(polygon, focus, blurScope, emphasisDisabled);
        }
        var changePolyState = this._changePolyState;
        data.eachItemGraphicEl(function(el) {
            // Switch polyline / polygon state if element changed its state.
            el && (el.onHoverStateChange = changePolyState);
        });
        this._polyline.onHoverStateChange = changePolyState;
        this._data = data;
        // Save the coordinate system for transition animation when data changed
        this._coordSys = coordSys;
        this._stackedOnPoints = stackedOnPoints;
        this._points = points;
        this._step = step;
        this._valueOrigin = valueOrigin;
        var triggerEvent = seriesModel.get('triggerEvent');
        var triggerLineEvent = seriesModel.get('triggerLineEvent');
        if ("TURBOPACK compile-time truthy", 1) {
            triggerLineEvent && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$styleCompat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warnDeprecated"])('triggerLineEvent', 'Use the `triggerEvent` option instead.');
        }
        var shouldTriggerLineEvent = triggerLineEvent === true || triggerEvent === true || triggerEvent === 'line';
        var shouldTriggerAreaEvent = triggerLineEvent === true || triggerEvent === true || triggerEvent === 'area';
        this.packEventData(seriesModel, polyline, shouldTriggerLineEvent);
        polygon && this.packEventData(seriesModel, polygon, shouldTriggerAreaEvent);
    };
    LineView.prototype.packEventData = function(seriesModel, el, enable) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getECData"])(el).eventData = enable ? {
            componentType: 'series',
            componentSubType: 'line',
            componentIndex: seriesModel.componentIndex,
            seriesIndex: seriesModel.seriesIndex,
            seriesName: seriesModel.name,
            seriesType: 'line',
            // for determining this event is triggered by area or line
            selfType: el === this._polygon ? 'area' : 'line'
        } : null;
    };
    LineView.prototype.highlight = function(seriesModel, ecModel, api, payload) {
        var data = seriesModel.getData();
        var dataIndex = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryDataIndex"](data, payload);
        this._changePolyState('emphasis');
        if (!(dataIndex instanceof Array) && dataIndex != null && dataIndex >= 0) {
            var points = data.getLayout('points');
            var symbol = data.getItemGraphicEl(dataIndex);
            if (!symbol) {
                // Create a temporary symbol if it is not exists
                var x = points[dataIndex * 2];
                var y = points[dataIndex * 2 + 1];
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPointIllegal"])(x, y)) {
                    // Null data
                    return;
                }
                // fix #11360: shouldn't draw symbol outside clipShapeForSymbol
                if (this._clipShapeForSymbol && !this._clipShapeForSymbol.contain(x, y)) {
                    return;
                }
                var zlevel = seriesModel.get('zlevel') || 0;
                var z = seriesModel.get('z') || 0;
                symbol = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$Symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](data, dataIndex);
                symbol.x = x;
                symbol.y = y;
                symbol.setZ(zlevel, z);
                // ensure label text of the temporary symbol is in front of line and area polygon
                var symbolLabel = symbol.getSymbolPath().getTextContent();
                if (symbolLabel) {
                    symbolLabel.zlevel = zlevel;
                    symbolLabel.z = z;
                    symbolLabel.z2 = this._polyline.z2 + 1;
                }
                symbol.__temp = true;
                data.setItemGraphicEl(dataIndex, symbol);
                // Stop scale animation
                symbol.stopSymbolAnimation(true);
                this.group.add(symbol);
            }
            symbol.highlight();
        } else {
            // Highlight whole series
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].prototype.highlight.call(this, seriesModel, ecModel, api, payload);
        }
    };
    LineView.prototype.downplay = function(seriesModel, ecModel, api, payload) {
        var data = seriesModel.getData();
        var dataIndex = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryDataIndex"](data, payload);
        this._changePolyState('normal');
        if (dataIndex != null && dataIndex >= 0) {
            var symbol = data.getItemGraphicEl(dataIndex);
            if (symbol) {
                if (symbol.__temp) {
                    data.setItemGraphicEl(dataIndex, null);
                    this.group.remove(symbol);
                } else {
                    symbol.downplay();
                }
            }
        } else {
            // FIXME
            // can not downplay completely.
            // Downplay whole series
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].prototype.downplay.call(this, seriesModel, ecModel, api, payload);
        }
    };
    LineView.prototype._changePolyState = function(toState) {
        var polygon = this._polygon;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setStatesFlag"])(this._polyline, toState);
        polygon && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setStatesFlag"])(polygon, toState);
    };
    LineView.prototype._newPolyline = function(points) {
        var polyline = this._polyline;
        // Remove previous created polyline
        if (polyline) {
            this._lineGroup.remove(polyline);
        }
        polyline = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$poly$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ECPolyline"]({
            shape: {
                points: points
            },
            segmentIgnoreThreshold: 2,
            z2: 10
        });
        this._lineGroup.add(polyline);
        this._polyline = polyline;
        return polyline;
    };
    LineView.prototype._newPolygon = function(points, stackedOnPoints) {
        var polygon = this._polygon;
        // Remove previous created polygon
        if (polygon) {
            this._lineGroup.remove(polygon);
        }
        polygon = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$poly$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ECPolygon"]({
            shape: {
                points: points,
                stackedOnPoints: stackedOnPoints
            },
            segmentIgnoreThreshold: 2
        });
        this._lineGroup.add(polygon);
        this._polygon = polygon;
        return polygon;
    };
    LineView.prototype._initSymbolLabelAnimation = function(data, coordSys, clipShape) {
        var isHorizontalOrRadial;
        var isCoordSysPolar;
        var baseAxis = coordSys.getBaseAxis();
        var isAxisInverse = baseAxis.inverse;
        if (coordSys.type === 'cartesian2d') {
            isHorizontalOrRadial = baseAxis.isHorizontal();
            isCoordSysPolar = false;
        } else if (coordSys.type === 'polar') {
            isHorizontalOrRadial = baseAxis.dim === 'angle';
            isCoordSysPolar = true;
        }
        var seriesModel = data.hostModel;
        var seriesDuration = seriesModel.get('animationDuration');
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFunction"](seriesDuration)) {
            seriesDuration = seriesDuration(null);
        }
        var seriesDelay = seriesModel.get('animationDelay') || 0;
        var seriesDelayValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFunction"](seriesDelay) ? seriesDelay(null) : seriesDelay;
        data.eachItemGraphicEl(function(symbol, idx) {
            var el = symbol;
            if (el) {
                var point = [
                    symbol.x,
                    symbol.y
                ];
                var start = void 0;
                var end = void 0;
                var current = void 0;
                if (clipShape) {
                    if (isCoordSysPolar) {
                        var polarClip = clipShape;
                        var coord = coordSys.pointToCoord(point);
                        if (isHorizontalOrRadial) {
                            start = polarClip.startAngle;
                            end = polarClip.endAngle;
                            current = -coord[1] / 180 * Math.PI;
                        } else {
                            start = polarClip.r0;
                            end = polarClip.r;
                            current = coord[0];
                        }
                    } else {
                        var gridClip = clipShape;
                        if (isHorizontalOrRadial) {
                            start = gridClip.x;
                            end = gridClip.x + gridClip.width;
                            current = symbol.x;
                        } else {
                            start = gridClip.y + gridClip.height;
                            end = gridClip.y;
                            current = symbol.y;
                        }
                    }
                }
                var ratio = end === start ? 0 : (current - start) / (end - start);
                if (isAxisInverse) {
                    ratio = 1 - ratio;
                }
                var delay = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFunction"](seriesDelay) ? seriesDelay(idx) : seriesDuration * ratio + seriesDelayValue;
                var symbolPath = el.getSymbolPath();
                var text = symbolPath.getTextContent();
                el.attr({
                    scaleX: 0,
                    scaleY: 0
                });
                el.animateTo({
                    scaleX: 1,
                    scaleY: 1
                }, {
                    duration: 200,
                    setToFinal: true,
                    delay: delay
                });
                if (text) {
                    text.animateFrom({
                        style: {
                            opacity: 0
                        }
                    }, {
                        duration: 300,
                        delay: delay
                    });
                }
                symbolPath.disableLabelAnimation = true;
            }
        });
    };
    LineView.prototype._initOrUpdateEndLabel = function(seriesModel, coordSys, inheritColor) {
        var endLabelModel = seriesModel.getModel('endLabel');
        if (anyStateShowEndLabel(seriesModel)) {
            var data_2 = seriesModel.getData();
            var polyline = this._polyline;
            // series may be filtered.
            var points = data_2.getLayout('points');
            if (!points) {
                polyline.removeTextContent();
                this._endLabel = null;
                return;
            }
            var endLabel = this._endLabel;
            if (!endLabel) {
                endLabel = this._endLabel = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Text$3e$__["Text"]({
                    z2: 200 // should be higher than item symbol
                });
                endLabel.ignoreClip = true;
                polyline.setTextContent(this._endLabel);
                polyline.disableLabelAnimation = true;
            }
            // Find last non-NaN data to display data
            var dataIndex = getLastIndexNotNull(points);
            if (dataIndex >= 0) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLabelStyle"])(polyline, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLabelStatesModels"])(seriesModel, 'endLabel'), {
                    inheritColor: inheritColor,
                    labelFetcher: seriesModel,
                    labelDataIndex: dataIndex,
                    defaultText: function(dataIndex, opt, interpolatedValue) {
                        return interpolatedValue != null ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$labelHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDefaultInterpolatedLabel"])(data_2, interpolatedValue) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$labelHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDefaultLabel"])(data_2, dataIndex);
                    },
                    enableTextSetter: true
                }, getEndLabelStateSpecified(endLabelModel, coordSys));
                polyline.textConfig.position = null;
            }
        } else if (this._endLabel) {
            this._polyline.removeTextContent();
            this._endLabel = null;
        }
    };
    LineView.prototype._endLabelOnDuring = function(percent, clipRect, data, animationRecord, valueAnimation, endLabelModel, coordSys) {
        var endLabel = this._endLabel;
        var polyline = this._polyline;
        if (endLabel) {
            // NOTE: Don't remove percent < 1. percent === 1 means the first frame during render.
            // The label is not prepared at this time.
            if (percent < 1 && animationRecord.originalX == null) {
                animationRecord.originalX = endLabel.x;
                animationRecord.originalY = endLabel.y;
            }
            var points = data.getLayout('points');
            var seriesModel = data.hostModel;
            var connectNulls = seriesModel.get('connectNulls');
            var precision = endLabelModel.get('precision');
            var distance = endLabelModel.get('distance') || 0;
            var baseAxis = coordSys.getBaseAxis();
            var isHorizontal = baseAxis.isHorizontal();
            var isBaseInversed = baseAxis.inverse;
            var clipShape = clipRect.shape;
            var xOrY = isBaseInversed ? isHorizontal ? clipShape.x : clipShape.y + clipShape.height : isHorizontal ? clipShape.x + clipShape.width : clipShape.y;
            var distanceX = (isHorizontal ? distance : 0) * (isBaseInversed ? -1 : 1);
            var distanceY = (isHorizontal ? 0 : -distance) * (isBaseInversed ? -1 : 1);
            var dim = isHorizontal ? 'x' : 'y';
            var dataIndexRange = getIndexRange(points, xOrY, dim);
            var indices = dataIndexRange.range;
            var diff = indices[1] - indices[0];
            var value = void 0;
            if (diff >= 1) {
                // diff > 1 && connectNulls, which is on the null data.
                if (diff > 1 && !connectNulls) {
                    var pt = getPointAtIndex(points, indices[0]);
                    endLabel.attr({
                        x: pt[0] + distanceX,
                        y: pt[1] + distanceY
                    });
                    valueAnimation && (value = seriesModel.getRawValue(indices[0]));
                } else {
                    var pt = polyline.getPointOn(xOrY, dim);
                    pt && endLabel.attr({
                        x: pt[0] + distanceX,
                        y: pt[1] + distanceY
                    });
                    var startValue = seriesModel.getRawValue(indices[0]);
                    var endValue = seriesModel.getRawValue(indices[1]);
                    valueAnimation && (value = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["interpolateRawValues"](data, precision, startValue, endValue, dataIndexRange.t));
                }
                animationRecord.lastFrameIndex = indices[0];
            } else {
                // If diff <= 0, which is the range is not found(Include NaN)
                // Choose the first point or last point.
                var idx = percent === 1 || animationRecord.lastFrameIndex > 0 ? indices[0] : 0;
                var pt = getPointAtIndex(points, idx);
                valueAnimation && (value = seriesModel.getRawValue(idx));
                endLabel.attr({
                    x: pt[0] + distanceX,
                    y: pt[1] + distanceY
                });
            }
            if (valueAnimation) {
                var inner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["labelInner"])(endLabel);
                if (typeof inner.setLabelText === 'function') {
                    inner.setLabelText(value);
                }
            }
        }
    };
    /**
   * @private
   */ // FIXME Two value axis
    LineView.prototype._doUpdateAnimation = function(data, stackedOnPoints, coordSys, api, step, valueOrigin, connectNulls) {
        var polyline = this._polyline;
        var polygon = this._polygon;
        var seriesModel = data.hostModel;
        var diff = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$lineAnimationDiff$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(this._data, data, this._stackedOnPoints, stackedOnPoints, this._coordSys, coordSys, this._valueOrigin, valueOrigin);
        var current = diff.current;
        var stackedOnCurrent = diff.stackedOnCurrent;
        var next = diff.next;
        var stackedOnNext = diff.stackedOnNext;
        if (step) {
            // TODO If stacked series is not step
            stackedOnCurrent = turnPointsIntoStep(diff.stackedOnCurrent, diff.current, coordSys, step, connectNulls);
            current = turnPointsIntoStep(diff.current, null, coordSys, step, connectNulls);
            stackedOnNext = turnPointsIntoStep(diff.stackedOnNext, diff.next, coordSys, step, connectNulls);
            next = turnPointsIntoStep(diff.next, null, coordSys, step, connectNulls);
        }
        // Don't apply animation if diff is large.
        // For better result and avoid memory explosion problems like
        // https://github.com/apache/incubator-echarts/issues/12229
        if (getBoundingDiff(current, next) > 3000 || polygon && getBoundingDiff(stackedOnCurrent, stackedOnNext) > 3000) {
            polyline.stopAnimation();
            polyline.setShape({
                points: next
            });
            if (polygon) {
                polygon.stopAnimation();
                polygon.setShape({
                    points: next,
                    stackedOnPoints: stackedOnNext
                });
            }
            return;
        }
        polyline.shape.__points = diff.current;
        polyline.shape.points = current;
        var target = {
            shape: {
                points: next
            }
        };
        // Also animate the original points.
        // If points reference is changed when turning into step line.
        if (diff.current !== current) {
            target.shape.__points = diff.next;
        }
        // Stop previous animation.
        polyline.stopAnimation();
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProps"](polyline, target, seriesModel);
        if (polygon) {
            polygon.setShape({
                // Reuse the points with polyline.
                points: current,
                stackedOnPoints: stackedOnCurrent
            });
            polygon.stopAnimation();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProps"](polygon, {
                shape: {
                    stackedOnPoints: stackedOnNext
                }
            }, seriesModel);
            // If use attr directly in updateProps.
            if (polyline.shape.points !== polygon.shape.points) {
                polygon.shape.points = polyline.shape.points;
            }
        }
        var updatedDataInfo = [];
        var diffStatus = diff.status;
        for(var i = 0; i < diffStatus.length; i++){
            var cmd = diffStatus[i].cmd;
            if (cmd === '=') {
                var el = data.getItemGraphicEl(diffStatus[i].idx1);
                if (el) {
                    updatedDataInfo.push({
                        el: el,
                        ptIdx: i // Index of points
                    });
                }
            }
        }
        if (polyline.animators && polyline.animators.length) {
            polyline.animators[0].during(function() {
                polygon && polygon.dirtyShape();
                var points = polyline.shape.__points;
                for(var i = 0; i < updatedDataInfo.length; i++){
                    var el = updatedDataInfo[i].el;
                    var offset = updatedDataInfo[i].ptIdx * 2;
                    el.x = points[offset];
                    el.y = points[offset + 1];
                    el.markRedraw();
                }
            });
        }
    };
    LineView.prototype.remove = function(ecModel) {
        var group = this.group;
        var oldData = this._data;
        this._lineGroup.removeAll();
        this._symbolDraw.remove(true);
        // Remove temporary created elements when highlighting
        oldData && oldData.eachItemGraphicEl(function(el, idx) {
            if (el.__temp) {
                group.remove(el);
                oldData.setItemGraphicEl(idx, null);
            }
        });
        this._polyline = this._polygon = this._coordSys = this._points = this._stackedOnPoints = this._endLabel = this._data = null;
    };
    LineView.type = 'line';
    return LineView;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = LineView;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/line/helper.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getStackedOnPoint",
    ()=>getStackedOnPoint,
    "isPointIllegal",
    ()=>isPointIllegal,
    "prepareDataCoordInfo",
    ()=>prepareDataCoordInfo
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataStackHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/dataStackHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
;
;
function prepareDataCoordInfo(coordSys, data, valueOrigin) {
    var baseAxis = coordSys.getBaseAxis();
    var valueAxis = coordSys.getOtherAxis(baseAxis);
    var valueStart = getValueStart(valueAxis, valueOrigin);
    var baseAxisDim = baseAxis.dim;
    var valueAxisDim = valueAxis.dim;
    var valueDim = data.mapDimension(valueAxisDim);
    var baseDim = data.mapDimension(baseAxisDim);
    var baseDataOffset = valueAxisDim === 'x' || valueAxisDim === 'radius' ? 1 : 0;
    var dims = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(coordSys.dimensions, function(coordDim) {
        return data.mapDimension(coordDim);
    });
    var stacked = false;
    var stackResultDim = data.getCalculationInfo('stackResultDimension');
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataStackHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDimensionStacked"])(data, dims[0])) {
        // jshint ignore:line
        stacked = true;
        dims[0] = stackResultDim;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataStackHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDimensionStacked"])(data, dims[1])) {
        // jshint ignore:line
        stacked = true;
        dims[1] = stackResultDim;
    }
    return {
        dataDimsForPoint: dims,
        valueStart: valueStart,
        valueAxisDim: valueAxisDim,
        baseAxisDim: baseAxisDim,
        stacked: !!stacked,
        valueDim: valueDim,
        baseDim: baseDim,
        baseDataOffset: baseDataOffset,
        stackedOverDimension: data.getCalculationInfo('stackedOverDimension')
    };
}
function getValueStart(valueAxis, valueOrigin) {
    var valueStart = 0;
    var extent = valueAxis.scale.getExtent();
    if (valueOrigin === 'start') {
        valueStart = extent[0];
    } else if (valueOrigin === 'end') {
        valueStart = extent[1];
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(valueOrigin) && !isNaN(valueOrigin)) {
        valueStart = valueOrigin;
    } else {
        // Both positive
        if (extent[0] > 0) {
            valueStart = extent[0];
        } else if (extent[1] < 0) {
            valueStart = extent[1];
        }
    // If is one positive, and one negative, onZero shall be true
    }
    return valueStart;
}
function getStackedOnPoint(dataCoordInfo, coordSys, data, idx) {
    var value = NaN;
    if (dataCoordInfo.stacked) {
        value = data.get(data.getCalculationInfo('stackedOverDimension'), idx);
    }
    if (isNaN(value)) {
        value = dataCoordInfo.valueStart;
    }
    var baseDataOffset = dataCoordInfo.baseDataOffset;
    var stackedData = [];
    stackedData[baseDataOffset] = data.get(dataCoordInfo.baseDim, idx);
    stackedData[1 - baseDataOffset] = value;
    return coordSys.dataToPoint(stackedData);
}
function isPointIllegal(xOrY, yOrX) {
    // NOTE:
    //  - `NaN` point x/y may be generated by, e.g.,
    //    original series data `NaN`, '-', `null`, `undefined`,
    //    negative values in LogScale.
    //  - `Infinite` point x/y may be generated by, e.g.,
    //    original series data `Infinite`, `0` in LogScale.
    return !isFinite(xOrY) || !isFinite(yOrX);
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/line/install.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "install",
    ()=>install
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$LineSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/line/LineSeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$LineView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/line/LineView.js [app-client] (ecmascript)");
// In case developer forget to include grid component
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$layout$2f$points$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/layout/points.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$processor$2f$dataSample$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/processor/dataSample.js [app-client] (ecmascript)");
;
;
;
;
function install(registers) {
    registers.registerChartView(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$LineView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
    registers.registerSeriesModel(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$LineSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
    registers.registerLayout((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$layout$2f$points$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('line', true));
    registers.registerVisual({
        seriesType: 'line',
        reset: function(seriesModel) {
            var data = seriesModel.getData();
            // Visual coding for legend
            var lineStyle = seriesModel.getModel('lineStyle').getLineStyle();
            if (lineStyle && !lineStyle.stroke) {
                // Fill in visual should be palette color if
                // has color callback
                lineStyle.stroke = data.getVisual('style').fill;
            }
            data.setVisual('legendLineStyle', lineStyle);
        }
    });
    // Down sample after filter
    registers.registerProcessor(registers.PRIORITY.PROCESSOR.STATISTIC, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$processor$2f$dataSample$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('line'));
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/line/install.js [app-client] (ecmascript) <export install as LineChart>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LineChart",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["install"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/line/install.js [app-client] (ecmascript)");
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/line/lineAnimationDiff.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>lineAnimationDiff
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/line/helper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$vendor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/vendor.js [app-client] (ecmascript)");
;
;
function diffData(oldData, newData) {
    var diffResult = [];
    newData.diff(oldData).add(function(idx) {
        diffResult.push({
            cmd: '+',
            idx: idx
        });
    }).update(function(newIdx, oldIdx) {
        diffResult.push({
            cmd: '=',
            idx: oldIdx,
            idx1: newIdx
        });
    }).remove(function(idx) {
        diffResult.push({
            cmd: '-',
            idx: idx
        });
    }).execute();
    return diffResult;
}
function lineAnimationDiff(oldData, newData, oldStackedOnPoints, newStackedOnPoints, oldCoordSys, newCoordSys, oldValueOrigin, newValueOrigin) {
    var diff = diffData(oldData, newData);
    // let newIdList = newData.mapArray(newData.getId);
    // let oldIdList = oldData.mapArray(oldData.getId);
    // convertToIntId(newIdList, oldIdList);
    // // FIXME One data ?
    // diff = arrayDiff(oldIdList, newIdList);
    var currPoints = [];
    var nextPoints = [];
    // Points for stacking base line
    var currStackedPoints = [];
    var nextStackedPoints = [];
    var status = [];
    var sortedIndices = [];
    var rawIndices = [];
    var newDataOldCoordInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["prepareDataCoordInfo"])(oldCoordSys, newData, oldValueOrigin);
    // const oldDataNewCoordInfo = prepareDataCoordInfo(newCoordSys, oldData, newValueOrigin);
    var oldPoints = oldData.getLayout('points') || [];
    var newPoints = newData.getLayout('points') || [];
    for(var i = 0; i < diff.length; i++){
        var diffItem = diff[i];
        var pointAdded = true;
        var oldIdx2 = void 0;
        var newIdx2 = void 0;
        // FIXME, animation is not so perfect when dataZoom window moves fast
        // Which is in case remvoing or add more than one data in the tail or head
        switch(diffItem.cmd){
            case '=':
                oldIdx2 = diffItem.idx * 2;
                newIdx2 = diffItem.idx1 * 2;
                var currentX = oldPoints[oldIdx2];
                var currentY = oldPoints[oldIdx2 + 1];
                var nextX = newPoints[newIdx2];
                var nextY = newPoints[newIdx2 + 1];
                // If previous data is NaN, use next point directly
                if (isNaN(currentX) || isNaN(currentY)) {
                    currentX = nextX;
                    currentY = nextY;
                }
                currPoints.push(currentX, currentY);
                nextPoints.push(nextX, nextY);
                currStackedPoints.push(oldStackedOnPoints[oldIdx2], oldStackedOnPoints[oldIdx2 + 1]);
                nextStackedPoints.push(newStackedOnPoints[newIdx2], newStackedOnPoints[newIdx2 + 1]);
                rawIndices.push(newData.getRawIndex(diffItem.idx1));
                break;
            case '+':
                var newIdx = diffItem.idx;
                var newDataDimsForPoint = newDataOldCoordInfo.dataDimsForPoint;
                var oldPt = oldCoordSys.dataToPoint([
                    newData.get(newDataDimsForPoint[0], newIdx),
                    newData.get(newDataDimsForPoint[1], newIdx)
                ]);
                newIdx2 = newIdx * 2;
                currPoints.push(oldPt[0], oldPt[1]);
                nextPoints.push(newPoints[newIdx2], newPoints[newIdx2 + 1]);
                var stackedOnPoint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStackedOnPoint"])(newDataOldCoordInfo, oldCoordSys, newData, newIdx);
                currStackedPoints.push(stackedOnPoint[0], stackedOnPoint[1]);
                nextStackedPoints.push(newStackedOnPoints[newIdx2], newStackedOnPoints[newIdx2 + 1]);
                rawIndices.push(newData.getRawIndex(newIdx));
                break;
            case '-':
                pointAdded = false;
        }
        // Original indices
        if (pointAdded) {
            status.push(diffItem);
            sortedIndices.push(sortedIndices.length);
        }
    }
    // Diff result may be crossed if all items are changed
    // Sort by data index
    sortedIndices.sort(function(a, b) {
        return rawIndices[a] - rawIndices[b];
    });
    var len = currPoints.length;
    var sortedCurrPoints = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$vendor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFloat32Array"])(len);
    var sortedNextPoints = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$vendor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFloat32Array"])(len);
    var sortedCurrStackedPoints = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$vendor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFloat32Array"])(len);
    var sortedNextStackedPoints = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$vendor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFloat32Array"])(len);
    var sortedStatus = [];
    for(var i = 0; i < sortedIndices.length; i++){
        var idx = sortedIndices[i];
        var i2 = i * 2;
        var idx2 = idx * 2;
        sortedCurrPoints[i2] = currPoints[idx2];
        sortedCurrPoints[i2 + 1] = currPoints[idx2 + 1];
        sortedNextPoints[i2] = nextPoints[idx2];
        sortedNextPoints[i2 + 1] = nextPoints[idx2 + 1];
        sortedCurrStackedPoints[i2] = currStackedPoints[idx2];
        sortedCurrStackedPoints[i2 + 1] = currStackedPoints[idx2 + 1];
        sortedNextStackedPoints[i2] = nextStackedPoints[idx2];
        sortedNextStackedPoints[i2 + 1] = nextStackedPoints[idx2 + 1];
        sortedStatus[i] = status[idx];
    }
    return {
        current: sortedCurrPoints,
        next: sortedNextPoints,
        stackedOnCurrent: sortedCurrStackedPoints,
        stackedOnNext: sortedNextStackedPoints,
        status: sortedStatus
    };
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/line/poly.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ECPolygon",
    ()=>ECPolygon,
    "ECPolyline",
    ()=>ECPolyline
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
// Poly path support NaN point
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Path.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$PathProxy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/PathProxy.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/curve.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/tokens.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/line/helper.js [app-client] (ecmascript)");
;
;
;
;
;
;
var mathMin = Math.min;
var mathMax = Math.max;
/**
 * Draw smoothed line in non-monotone, in may cause undesired curve in extreme
 * situations. This should be used when points are non-monotone neither in x or
 * y dimension.
 */ function drawSegment(ctx, points, start, segLen, allLen, dir, smooth, smoothMonotone, connectNulls) {
    var prevX;
    var prevY;
    var cpx0;
    var cpy0;
    var cpx1;
    var cpy1;
    var idx = start;
    var k = 0;
    for(; k < segLen; k++){
        var x = points[idx * 2];
        var y = points[idx * 2 + 1];
        if (idx >= allLen || idx < 0) {
            break;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPointIllegal"])(x, y)) {
            if (connectNulls) {
                idx += dir;
                continue;
            }
            break;
        }
        if (idx === start) {
            ctx[dir > 0 ? 'moveTo' : 'lineTo'](x, y);
            cpx0 = x;
            cpy0 = y;
        } else {
            var dx = x - prevX;
            var dy = y - prevY;
            // Ignore tiny segment.
            if (dx * dx + dy * dy < 0.5) {
                idx += dir;
                continue;
            }
            if (smooth > 0) {
                var nextIdx = idx + dir;
                var nextX = points[nextIdx * 2];
                var nextY = points[nextIdx * 2 + 1];
                // Ignore duplicate point
                while(nextX === x && nextY === y && k < segLen){
                    k++;
                    nextIdx += dir;
                    idx += dir;
                    nextX = points[nextIdx * 2];
                    nextY = points[nextIdx * 2 + 1];
                    x = points[idx * 2];
                    y = points[idx * 2 + 1];
                    dx = x - prevX;
                    dy = y - prevY;
                }
                var tmpK = k + 1;
                if (connectNulls) {
                    // Find next point not null
                    while((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPointIllegal"])(nextX, nextY) && tmpK < segLen){
                        tmpK++;
                        nextIdx += dir;
                        nextX = points[nextIdx * 2];
                        nextY = points[nextIdx * 2 + 1];
                    }
                }
                var ratioNextSeg = 0.5;
                var vx = 0;
                var vy = 0;
                var nextCpx0 = void 0;
                var nextCpy0 = void 0;
                // Is last point
                if (tmpK >= segLen || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPointIllegal"])(nextX, nextY)) {
                    cpx1 = x;
                    cpy1 = y;
                } else {
                    vx = nextX - prevX;
                    vy = nextY - prevY;
                    var dx0 = x - prevX;
                    var dx1 = nextX - x;
                    var dy0 = y - prevY;
                    var dy1 = nextY - y;
                    var lenPrevSeg = void 0;
                    var lenNextSeg = void 0;
                    if (smoothMonotone === 'x') {
                        lenPrevSeg = Math.abs(dx0);
                        lenNextSeg = Math.abs(dx1);
                        var dir_1 = vx > 0 ? 1 : -1;
                        cpx1 = x - dir_1 * lenPrevSeg * smooth;
                        cpy1 = y;
                        nextCpx0 = x + dir_1 * lenNextSeg * smooth;
                        nextCpy0 = y;
                    } else if (smoothMonotone === 'y') {
                        lenPrevSeg = Math.abs(dy0);
                        lenNextSeg = Math.abs(dy1);
                        var dir_2 = vy > 0 ? 1 : -1;
                        cpx1 = x;
                        cpy1 = y - dir_2 * lenPrevSeg * smooth;
                        nextCpx0 = x;
                        nextCpy0 = y + dir_2 * lenNextSeg * smooth;
                    } else {
                        lenPrevSeg = Math.sqrt(dx0 * dx0 + dy0 * dy0);
                        lenNextSeg = Math.sqrt(dx1 * dx1 + dy1 * dy1);
                        // Use ratio of seg length
                        ratioNextSeg = lenNextSeg / (lenNextSeg + lenPrevSeg);
                        cpx1 = x - vx * smooth * (1 - ratioNextSeg);
                        cpy1 = y - vy * smooth * (1 - ratioNextSeg);
                        // cp0 of next segment
                        nextCpx0 = x + vx * smooth * ratioNextSeg;
                        nextCpy0 = y + vy * smooth * ratioNextSeg;
                        // Smooth constraint between point and next point.
                        // Avoid exceeding extreme after smoothing.
                        nextCpx0 = mathMin(nextCpx0, mathMax(nextX, x));
                        nextCpy0 = mathMin(nextCpy0, mathMax(nextY, y));
                        nextCpx0 = mathMax(nextCpx0, mathMin(nextX, x));
                        nextCpy0 = mathMax(nextCpy0, mathMin(nextY, y));
                        // Reclaculate cp1 based on the adjusted cp0 of next seg.
                        vx = nextCpx0 - x;
                        vy = nextCpy0 - y;
                        cpx1 = x - vx * lenPrevSeg / lenNextSeg;
                        cpy1 = y - vy * lenPrevSeg / lenNextSeg;
                        // Smooth constraint between point and prev point.
                        // Avoid exceeding extreme after smoothing.
                        cpx1 = mathMin(cpx1, mathMax(prevX, x));
                        cpy1 = mathMin(cpy1, mathMax(prevY, y));
                        cpx1 = mathMax(cpx1, mathMin(prevX, x));
                        cpy1 = mathMax(cpy1, mathMin(prevY, y));
                        // Adjust next cp0 again.
                        vx = x - cpx1;
                        vy = y - cpy1;
                        nextCpx0 = x + vx * lenNextSeg / lenPrevSeg;
                        nextCpy0 = y + vy * lenNextSeg / lenPrevSeg;
                    }
                }
                ctx.bezierCurveTo(cpx0, cpy0, cpx1, cpy1, x, y);
                cpx0 = nextCpx0;
                cpy0 = nextCpy0;
            } else {
                ctx.lineTo(x, y);
            }
        }
        prevX = x;
        prevY = y;
        idx += dir;
    }
    return k;
}
var ECPolylineShape = /** @class */ function() {
    function ECPolylineShape() {
        this.smooth = 0;
        this.smoothConstraint = true;
    }
    return ECPolylineShape;
}();
var ECPolyline = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(ECPolyline, _super);
    function ECPolyline(opts) {
        var _this = _super.call(this, opts) || this;
        _this.type = 'ec-polyline';
        return _this;
    }
    ECPolyline.prototype.getDefaultStyle = function() {
        return {
            stroke: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.neutral99,
            fill: null
        };
    };
    ECPolyline.prototype.getDefaultShape = function() {
        return new ECPolylineShape();
    };
    ECPolyline.prototype.buildPath = function(ctx, shape) {
        var points = shape.points;
        var i = 0;
        var len = points.length / 2;
        // const result = getBoundingBox(points, shape.smoothConstraint);
        if (shape.connectNulls) {
            // Must remove first and last null values avoid draw error in polygon
            for(; len > 0; len--){
                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPointIllegal"])(points[len * 2 - 2], points[len * 2 - 1])) {
                    break;
                }
            }
            for(; i < len; i++){
                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPointIllegal"])(points[i * 2], points[i * 2 + 1])) {
                    break;
                }
            }
        }
        while(i < len){
            i += drawSegment(ctx, points, i, len, len, 1, shape.smooth, shape.smoothMonotone, shape.connectNulls) + 1;
        }
    };
    ECPolyline.prototype.getPointOn = function(xOrY, dim) {
        if (!this.path) {
            this.createPathProxy();
            this.buildPath(this.path, this.shape);
        }
        var path = this.path;
        var data = path.data;
        var CMD = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$PathProxy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].CMD;
        var x0;
        var y0;
        var isDimX = dim === 'x';
        var roots = [];
        for(var i = 0; i < data.length;){
            var cmd = data[i++];
            var x = void 0;
            var y = void 0;
            var x2 = void 0;
            var y2 = void 0;
            var x3 = void 0;
            var y3 = void 0;
            var t = void 0;
            switch(cmd){
                case CMD.M:
                    x0 = data[i++];
                    y0 = data[i++];
                    break;
                case CMD.L:
                    x = data[i++];
                    y = data[i++];
                    t = isDimX ? (xOrY - x0) / (x - x0) : (xOrY - y0) / (y - y0);
                    if (t <= 1 && t >= 0) {
                        var val = isDimX ? (y - y0) * t + y0 : (x - x0) * t + x0;
                        return isDimX ? [
                            xOrY,
                            val
                        ] : [
                            val,
                            xOrY
                        ];
                    }
                    x0 = x;
                    y0 = y;
                    break;
                case CMD.C:
                    x = data[i++];
                    y = data[i++];
                    x2 = data[i++];
                    y2 = data[i++];
                    x3 = data[i++];
                    y3 = data[i++];
                    var nRoot = isDimX ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cubicRootAt"])(x0, x, x2, x3, xOrY, roots) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cubicRootAt"])(y0, y, y2, y3, xOrY, roots);
                    if (nRoot > 0) {
                        for(var i_1 = 0; i_1 < nRoot; i_1++){
                            var t_1 = roots[i_1];
                            if (t_1 <= 1 && t_1 >= 0) {
                                var val = isDimX ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cubicAt"])(y0, y, y2, y3, t_1) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cubicAt"])(x0, x, x2, x3, t_1);
                                return isDimX ? [
                                    xOrY,
                                    val
                                ] : [
                                    val,
                                    xOrY
                                ];
                            }
                        }
                    }
                    x0 = x3;
                    y0 = y3;
                    break;
            }
        }
    };
    return ECPolyline;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
;
var ECPolygonShape = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(ECPolygonShape, _super);
    function ECPolygonShape() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ECPolygonShape;
}(ECPolylineShape);
var ECPolygon = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(ECPolygon, _super);
    function ECPolygon(opts) {
        var _this = _super.call(this, opts) || this;
        _this.type = 'ec-polygon';
        return _this;
    }
    ECPolygon.prototype.getDefaultShape = function() {
        return new ECPolygonShape();
    };
    ECPolygon.prototype.buildPath = function(ctx, shape) {
        var points = shape.points;
        var stackedOnPoints = shape.stackedOnPoints;
        var i = 0;
        var len = points.length / 2;
        var smoothMonotone = shape.smoothMonotone;
        if (shape.connectNulls) {
            // Must remove first and last null values avoid draw error in polygon
            for(; len > 0; len--){
                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPointIllegal"])(points[len * 2 - 2], points[len * 2 - 1])) {
                    break;
                }
            }
            for(; i < len; i++){
                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$line$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPointIllegal"])(points[i * 2], points[i * 2 + 1])) {
                    break;
                }
            }
        }
        while(i < len){
            var k = drawSegment(ctx, points, i, len, len, 1, shape.smooth, smoothMonotone, shape.connectNulls);
            drawSegment(ctx, stackedOnPoints, i + k - 1, k, len, -1, shape.stackedOnSmooth, smoothMonotone, shape.connectNulls);
            i += k + 1;
            ctx.closePath();
        }
    };
    return ECPolygon;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/map/MapSeries.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SERIES_TYPE_MAP",
    ()=>SERIES_TYPE_MAP,
    "buildAllMapSeriesGroups",
    ()=>buildAllMapSeriesGroups,
    "default",
    ()=>__TURBOPACK__default__export__,
    "getMainMapSeries",
    ()=>getMainMapSeries,
    "mapSeriesGroupHasOwnGeo",
    ()=>mapSeriesGroupHasOwnGeo,
    "mapSeriesNeedsDrawMap",
    ()=>mapSeriesNeedsDrawMap
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createSeriesDataSimply$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createSeriesDataSimply.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Series.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$geoSourceManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/geo/geoSourceManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$sourceHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/sourceHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$tooltip$2f$tooltipMarkup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/tooltip/tooltipMarkup.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/symbol.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/CoordinateSystem.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/tokens.js [app-client] (ecmascript)");
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
var SERIES_TYPE_MAP = 'map';
var MapSeries = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(MapSeries, _super);
    function MapSeries() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = MapSeries.type;
        _this.getTooltipPosition = function(dataIndex) {
            if (dataIndex != null) {
                var name_1 = this.getData().getName(dataIndex);
                var geo = this.coordinateSystem;
                var region = geo.getRegion(name_1);
                return region && geo.dataToPoint(region.getCenter());
            }
        };
        return _this;
    }
    MapSeries.prototype.getInitialData = function(option) {
        var data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createSeriesDataSimply$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(this, {
            coordDimensions: [
                'value'
            ],
            encodeDefaulter: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["curry"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$sourceHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeSeriesEncodeForNameBased"], this)
        });
        var dataNameIndexMap = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHashMap"]();
        var toAppendItems = [];
        for(var i = 0, len = data.count(); i < len; i++){
            var name_2 = data.getName(i);
            dataNameIndexMap.set(name_2, i);
        }
        var geoSource = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$geo$2f$geoSourceManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].load(this.getMapType(), this.option.nameMap, this.option.nameProperty);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](geoSource.regions, function(region) {
            var name = region.name;
            var dataNameIdx = dataNameIndexMap.get(name);
            // apply specified echarts style in GeoJSON data
            var specifiedGeoJSONRegionStyle = region.properties && region.properties.echartsStyle;
            var dataItem;
            if (dataNameIdx == null) {
                dataItem = {
                    name: name
                };
                toAppendItems.push(dataItem);
            } else {
                dataItem = data.getRawDataItem(dataNameIdx);
            }
            specifiedGeoJSONRegionStyle && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"](dataItem, specifiedGeoJSONRegionStyle);
        });
        // Complete data with missing regions. The consequent processes (like visual
        // map and render) can not be performed without a "full data". For example,
        // find `dataIndex` by name.
        data.appendData(toAppendItems);
        return data;
    };
    /**
   * If no host geo model, return null, which means using a
   * inner exclusive geo model.
   */ MapSeries.prototype.getHostGeoModel = function() {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decideCoordSysUsageKind"])(this).kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COORD_SYS_USAGE_KIND_BOX"]) {
            // Always use an internal geo if specify as `COORD_SYS_USAGE_KIND_BOX`.
            // Notice that currently we do not support laying out a geo based on
            // another geo, but preserve the possibility.
            return;
        }
        return this.getReferringComponents('geo', {
            useDefault: false,
            enableAll: false,
            enableNone: false
        }).models[0];
    };
    MapSeries.prototype.getMapType = function() {
        return (this.getHostGeoModel() || this).option.map;
    };
    // _fillOption(option, mapName) {
    // Shallow clone
    // option = zrUtil.extend({}, option);
    // option.data = geoCreator.getFilledRegions(option.data, mapName, option.nameMap);
    // return option;
    // }
    MapSeries.prototype.getRawValue = function(dataIndex) {
        // Use value stored in data instead because it is calculated from multiple series
        // FIXME Provide all value of multiple series ?
        var data = this.getData();
        return data.get(data.mapDimension('value'), dataIndex);
    };
    /**
   * Get model of region
   */ MapSeries.prototype.getRegionModel = function(regionName) {
        var data = this.getData();
        return data.getItemModel(data.indexOfName(regionName));
    };
    /**
   * Map tooltip formatter
   */ MapSeries.prototype.formatTooltip = function(dataIndex, multipleSeries, dataType) {
        // FIXME originalData and data is a bit confusing
        var data = this.getData();
        var value = this.getRawValue(dataIndex);
        var name = data.getName(dataIndex);
        var seriesNames = [];
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](this.seriesGroup.f, function(mapSeries) {
            var otherIndex = mapSeries.originalData.indexOfName(name);
            var valueDim = data.mapDimension('value');
            if (!isNaN(mapSeries.originalData.get(valueDim, otherIndex))) {
                seriesNames.push(mapSeries.name);
            }
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$tooltip$2f$tooltipMarkup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createTooltipMarkup"])('section', {
            header: seriesNames.join(', '),
            noHeader: !seriesNames.length,
            blocks: [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$tooltip$2f$tooltipMarkup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createTooltipMarkup"])('nameValue', {
                    name: name,
                    value: value
                })
            ]
        });
    };
    MapSeries.prototype.getLegendIcon = function(opt) {
        var iconType = opt.icon || 'roundRect';
        var icon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSymbol"])(iconType, 0, 0, opt.itemWidth, opt.itemHeight, opt.itemStyle.fill);
        icon.setStyle(opt.itemStyle);
        // Map do not use itemStyle.borderWidth as border width
        icon.style.stroke = 'none';
        // No rotation because no series visual symbol for map
        if (iconType.indexOf('empty') > -1) {
            icon.style.stroke = icon.style.fill;
            icon.style.fill = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.neutral00;
            icon.style.lineWidth = 2;
        }
        return icon;
    };
    MapSeries.prototype.__ownRoamView = function() {
        return mapSeriesNeedsDrawMap(this) ? this.coordinateSystem.view : null;
    };
    MapSeries.type = 'series.' + SERIES_TYPE_MAP;
    MapSeries.dependencies = [
        'geo'
    ];
    MapSeries.layoutMode = 'box';
    MapSeries.defaultOption = {
        // 一级层叠
        // zlevel: 0,
        // 二级层叠
        z: 2,
        coordinateSystem: 'geo',
        // map should be explicitly specified since ec3.
        map: '',
        // If `geoIndex` is not specified, a exclusive geo will be
        // created. Otherwise use the specified geo component, and
        // `map` and `mapType` are ignored.
        // geoIndex: 0,
        // 'center' | 'left' | 'right' | 'x%' | {number}
        left: 'center',
        // 'center' | 'top' | 'bottom' | 'x%' | {number}
        top: 'center',
        // right
        // bottom
        // width:
        // height
        // Aspect is width / height. Inited to be geoJson bbox aspect
        // This parameter is used for scale this aspect
        // Default value:
        // for geoSVG source: 1,
        // for geoJSON source: 0.75.
        aspectScale: null,
        // Layout with center and size
        // If you want to put map in a fixed size box with right aspect ratio
        // This two properties may be more convenient.
        // layoutCenter: [50%, 50%]
        // layoutSize: 100
        showLegendSymbol: true,
        // Define left-top, right-bottom coords to control view
        // For example, [ [180, 90], [-180, -90] ],
        // higher priority than center and zoom
        boundingCoords: null,
        // Default on center of map
        center: null,
        zoom: 1,
        scaleLimit: null,
        selectedMode: true,
        label: {
            show: false,
            color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.tertiary
        },
        // scaleLimit: null,
        itemStyle: {
            borderWidth: 0.5,
            borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.border,
            areaColor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.background
        },
        emphasis: {
            label: {
                show: true,
                color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.primary
            },
            itemStyle: {
                areaColor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.highlight
            }
        },
        select: {
            label: {
                show: true,
                color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.primary
            },
            itemStyle: {
                color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.highlight
            }
        },
        nameProperty: 'name'
    };
    return MapSeries;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
function mapSeriesGroupHasOwnGeo(groupKey) {
    return groupKey.indexOf('i') === 0;
}
function mapSeriesNeedsDrawMap(mapSeries) {
    // Within a MAP_SERIES_GROUP, only `mainSeries` has `needsDrawMap: true`.
    return getMainMapSeries(mapSeries.seriesGroup) === mapSeries && !mapSeries.getHostGeoModel();
}
function getMainMapSeries(mapSeriesGroup) {
    // The first series after filtering in a MAP_SERIES_GROUP.
    return mapSeriesGroup.f[0];
}
function buildAllMapSeriesGroups(ecModel, beforeSeriesFiltering) {
    var allMapSeriesGroups = {};
    ecModel.eachRawSeriesByType(SERIES_TYPE_MAP, function(seriesModel) {
        var hostGeoModel = seriesModel.getHostGeoModel();
        var key = hostGeoModel ? 'o' + hostGeoModel.id : 'i' + seriesModel.getMapType();
        var group = allMapSeriesGroups[key] = allMapSeriesGroups[key] || {
            f: [],
            r: []
        };
        if (!ecModel.isSeriesFiltered(seriesModel) && !beforeSeriesFiltering) {
            group.f.push(seriesModel);
        }
        group.r.push(seriesModel);
    });
    return allMapSeriesGroups;
}
const __TURBOPACK__default__export__ = MapSeries;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/map/MapView.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Circle.js [app-client] (ecmascript) <export default as Circle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$helper$2f$MapDraw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/helper/MapDraw.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/view/Chart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/map/MapSeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/label/labelStyle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/states.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
var MapView = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(MapView, _super);
    function MapView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_MAP"];
        return _this;
    }
    MapView.prototype.render = function(mapModel, ecModel, api, payload) {
        // Not render if it is an toggleSelect action from self
        if (payload && payload.type === 'mapToggleSelect' && payload.from === this.uid) {
            return;
        }
        var group = this.group;
        group.removeAll();
        if (mapModel.getHostGeoModel()) {
            return;
        }
        var mapDraw = this._mapDraw;
        if (mapDraw && payload && payload.type === 'geoRoam') {
            mapDraw.resetForLabelLayout();
        }
        // Not update map if it is an roam action from self
        if (!(payload && payload.type === 'geoRoam' && payload.componentType === 'series' && payload.seriesId === mapModel.id)) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapSeriesNeedsDrawMap"])(mapModel)) {
                mapDraw = mapDraw || (this._mapDraw = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$helper$2f$MapDraw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](api));
                group.add(mapDraw.group);
                mapDraw.draw(mapModel, ecModel, api, this, payload);
            } else {
                this._clearMapDraw();
            }
        } else {
            mapDraw && group.add(mapDraw.group);
        }
        mapModel.get('showLegendSymbol') && ecModel.getComponent('legend') && this._renderSymbols(mapModel);
    };
    /**
   * @implements RoamHostView['__updateOnOwnRoam']
   */ MapView.prototype.__updateOnOwnRoam = function(payload, model, api) {
        var mapDraw = this._mapDraw;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapSeriesNeedsDrawMap"])(model) && mapDraw) {
            mapDraw.__updateOnOwnRoam(model);
        }
    };
    MapView.prototype.remove = function() {
        this._clearMapDraw();
        this.group.removeAll();
    };
    MapView.prototype.dispose = function() {
        this._clearMapDraw();
    };
    MapView.prototype._clearMapDraw = function() {
        this._mapDraw && this._mapDraw.remove();
        this._mapDraw = null;
    };
    MapView.prototype._renderSymbols = function(mapModel) {
        var originalData = mapModel.originalData;
        var group = this.group;
        originalData.each(originalData.mapDimension('value'), function(value, originalDataIndex) {
            if (isNaN(value)) {
                return;
            }
            var layout = originalData.getItemLayout(originalDataIndex);
            if (!layout || !layout.point) {
                // Not exists in map
                return;
            }
            var point = layout.point;
            var offset = layout.offset;
            var circle = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__["Circle"]({
                style: {
                    // Because the special of map draw.
                    // Which needs statistic of multiple series and draw on one map.
                    // And each series also need a symbol with legend color
                    //
                    // Layout and visual are put one the different data
                    // TODO
                    fill: mapModel.getData().getVisual('style').fill
                },
                shape: {
                    cx: point[0] + offset * 9,
                    cy: point[1],
                    r: 3
                },
                silent: true,
                // Do not overlap the first series, on which labels are displayed.
                z2: 8 + (!offset ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Z2_EMPHASIS_LIFT"] + 1 : 0)
            });
            // Only the series that has the first value on the same region is in charge of rendering the label.
            // But consider the case:
            // series: [
            //     {id: 'X', type: 'map', map: 'm', {data: [{name: 'A', value: 11}, {name: 'B', {value: 22}]},
            //     {id: 'Y', type: 'map', map: 'm', {data: [{name: 'A', value: 21}, {name: 'C', {value: 33}]}
            // ]
            // The offset `0` of item `A` is at series `X`, but of item `C` is at series `Y`.
            // For backward compatibility, we follow the rule that render label `A` by the
            // settings on series `X` but render label `C` by the settings on series `Y`.
            if (!offset) {
                // `mapModel.seriesGroup.f` must not be empty here.
                var fullData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMainMapSeries"])(mapModel.seriesGroup).getData();
                var name_1 = originalData.getName(originalDataIndex);
                var fullIndex_1 = fullData.indexOfName(name_1);
                var itemModel = originalData.getItemModel(originalDataIndex);
                var labelModel = itemModel.getModel('label');
                var regionGroup = fullData.getItemGraphicEl(fullIndex_1);
                // `getFormattedLabel` needs to use `getData` inside. Here
                // `mapModel.getData()` is shallow cloned from `mainSeries.getData()`.
                // FIXME
                // If this is not the `mainSeries`, the item model (like label formatter)
                // set on original data item will never get. But it has been working
                // like that from the beginning, and this scenario is rarely encountered.
                // So it won't be fixed until we have to.
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLabelStyle"])(circle, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLabelStatesModels"])(itemModel), {
                    labelFetcher: {
                        getFormattedLabel: function(idx, state) {
                            return mapModel.getFormattedLabel(fullIndex_1, state);
                        }
                    },
                    defaultText: name_1
                });
                circle.disableLabelAnimation = true;
                if (!labelModel.get('position')) {
                    circle.setTextConfig({
                        position: 'bottom'
                    });
                }
                regionGroup.onHoverStateChange = function(toState) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setStatesFlag"])(circle, toState);
                };
            }
            group.add(circle);
        });
    };
    MapView.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_MAP"];
    return MapView;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = MapView;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/map/install.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "install",
    ()=>install
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$extension$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/extension.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/map/MapView.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/map/MapSeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$legacy$2f$dataSelectAction$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/legacy/dataSelectAction.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$geo$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/geo/install.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$mapSymbolLayout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/map/mapSymbolLayout.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$mapDataStatistic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/map/mapDataStatistic.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
function install(registers) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$extension$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$geo$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["install"]);
    registers.registerChartView(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
    registers.registerSeriesModel(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
    registers.registerLayout(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$mapSymbolLayout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapSymbolLayoutStageHandler"]);
    registers.registerProcessor(registers.PRIORITY.PROCESSOR.STATISTIC, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$mapDataStatistic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapDataStatisticStageHandler"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$legacy$2f$dataSelectAction$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createLegacyDataSelectAction"])('map', registers.registerAction);
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/map/install.js [app-client] (ecmascript) <export install as MapChart>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MapChart",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["install"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/map/install.js [app-client] (ecmascript)");
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/map/mapDataStatistic.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapDataStatisticStageHandler",
    ()=>mapDataStatisticStageHandler
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/map/MapSeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
;
;
;
// FIXME 公用？
function dataStatistics(datas, statisticType) {
    var dataNameMap = {};
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](datas, function(data) {
        data.each(data.mapDimension('value'), function(value, idx) {
            // Add prefix to avoid conflict with Object.prototype.
            var mapKey = 'ec-' + data.getName(idx);
            dataNameMap[mapKey] = dataNameMap[mapKey] || [];
            if (!isNaN(value)) {
                dataNameMap[mapKey].push(value);
            }
        });
    });
    return datas[0].map(datas[0].mapDimension('value'), function(value, idx) {
        var mapKey = 'ec-' + datas[0].getName(idx);
        var sum = 0;
        var min = Infinity;
        var max = -Infinity;
        var len = dataNameMap[mapKey].length;
        for(var i = 0; i < len; i++){
            min = Math.min(min, dataNameMap[mapKey][i]);
            max = Math.max(max, dataNameMap[mapKey][i]);
            sum += dataNameMap[mapKey][i];
        }
        var result;
        if (statisticType === 'min') {
            result = min;
        } else if (statisticType === 'max') {
            result = max;
        } else if (statisticType === 'average') {
            result = sum / len;
        } else {
            result = sum;
        }
        return len === 0 ? NaN : result;
    });
}
var mapDataStatisticStageHandler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSimpleOverallStageHandler"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_MAP"], mapDataStatistic);
function mapDataStatistic(ecModel) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"]((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildAllMapSeriesGroups"])(ecModel), function(seriesGroup) {
        var mainSeries = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMainMapSeries"])(seriesGroup);
        if (!mainSeries) {
            return;
        }
        var data = dataStatistics(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"](seriesGroup.f, function(seriesModel) {
            return seriesModel.getData();
        }), // PENDING: It has long been using `seriesGroup[0]` here, but if the first map series
        // is filtered out by legend, `seriesGroup[0]` is the second series in ec option, therefore,
        // this definition is not reasonable enough for users.
        mainSeries.get('mapValueCalculation'));
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](seriesGroup.f, function(series) {
            series.seriesGroup = seriesGroup;
            series.originalData = series.getData();
            series.setData(data.cloneShallow());
        });
    });
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/map/mapSymbolLayout.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapSymbolLayoutStageHandler",
    ()=>mapSymbolLayoutStageHandler
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/map/MapSeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
;
;
;
var mapSymbolLayoutStageHandler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSimpleOverallStageHandler"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_MAP"], mapSymbolLayout);
function mapSymbolLayout(ecModel) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildAllMapSeriesGroups"])(ecModel), function(mapSeriesGroup, groupKey) {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMainMapSeries"])(mapSeriesGroup) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapSeriesGroupHasOwnGeo"])(groupKey)) {
            // map series on separate geo components only provide "choropleth map", but symbols are ignored.
            return;
        }
        var mapSymbolOffsets = {};
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(mapSeriesGroup.f, function(subMapSeries) {
            var geo = subMapSeries.coordinateSystem;
            var data = subMapSeries.originalData;
            if (subMapSeries.get('showLegendSymbol') && ecModel.getComponent('legend')) {
                data.each(data.mapDimension('value'), function(value, idx) {
                    var name = data.getName(idx);
                    var region = geo.getRegion(name);
                    // If input series.data is [11, 22, '-'/null/undefined, 44],
                    // it will be filled with NaN: [11, 22, NaN, 44] and NaN will
                    // not be drawn. So here must validate if value is NaN.
                    if (!region || isNaN(value)) {
                        return;
                    }
                    var offset = mapSymbolOffsets[name] || 0;
                    var point = geo.dataToPoint(region.getCenter());
                    mapSymbolOffsets[name] = offset + 1;
                    data.setItemLayout(idx, {
                        point: point,
                        offset: offset
                    });
                });
            }
        });
        // Show label of those region not has legendIcon (which is offset 0)
        var data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$map$2f$MapSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMainMapSeries"])(mapSeriesGroup).getData();
        data.each(function(idx) {
            var name = data.getName(idx);
            var layout = data.getItemLayout(idx) || {};
            layout.showLabel = !mapSymbolOffsets[name];
            data.setItemLayout(idx, layout);
        });
    });
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/pie/PieSeries.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SERIES_TYPE_PIE",
    ()=>SERIES_TYPE_PIE,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createSeriesDataSimply$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createSeriesDataSimply.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$sourceHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/sourceHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$LegendVisualProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/LegendVisualProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Series.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/CoordinateSystem.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
var SERIES_TYPE_PIE = 'pie';
var innerData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeInner"]();
var PieSeriesModel = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(PieSeriesModel, _super);
    function PieSeriesModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = PieSeriesModel.type;
        return _this;
    }
    /**
   * @overwrite
   */ PieSeriesModel.prototype.init = function(option) {
        _super.prototype.init.apply(this, arguments);
        // Enable legend selection for each data item
        // Use a function instead of direct access because data reference may changed
        this.legendVisualProvider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$LegendVisualProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bind"](this.getData, this), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bind"](this.getRawData, this));
        this._defaultLabelLine(option);
    };
    /**
   * @overwrite
   */ PieSeriesModel.prototype.mergeOption = function() {
        _super.prototype.mergeOption.apply(this, arguments);
    };
    /**
   * @overwrite
   */ PieSeriesModel.prototype.getInitialData = function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createSeriesDataSimply$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(this, {
            coordDimensions: [
                'value'
            ],
            encodeDefaulter: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["curry"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$sourceHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeSeriesEncodeForNameBased"], this)
        });
    };
    /**
   * @overwrite
   */ PieSeriesModel.prototype.getDataParams = function(dataIndex) {
        var data = this.getData();
        // update seats when data is changed
        var dataInner = innerData(data);
        var seats = dataInner.seats;
        if (!seats) {
            var valueList_1 = [];
            data.each(data.mapDimension('value'), function(value) {
                valueList_1.push(value);
            });
            seats = dataInner.seats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPercentSeats"])(valueList_1, data.hostModel.get('percentPrecision'));
        }
        var params = _super.prototype.getDataParams.call(this, dataIndex);
        // seats may be empty when sum is 0
        params.percent = seats[dataIndex] || 0;
        params.$vars.push('percent');
        return params;
    };
    PieSeriesModel.prototype._defaultLabelLine = function(option) {
        // Extend labelLine emphasis
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultEmphasis"](option, 'labelLine', [
            'show'
        ]);
        var labelLineNormalOpt = option.labelLine;
        var labelLineEmphasisOpt = option.emphasis.labelLine;
        // Not show label line if `label.normal.show = false`
        labelLineNormalOpt.show = labelLineNormalOpt.show && option.label.show;
        labelLineEmphasisOpt.show = labelLineEmphasisOpt.show && option.emphasis.label.show;
    };
    PieSeriesModel.type = 'series.' + SERIES_TYPE_PIE;
    PieSeriesModel.defaultOption = {
        // zlevel: 0,
        z: 2,
        legendHoverLink: true,
        colorBy: 'data',
        // 默认全局居中
        center: [
            '50%',
            '50%'
        ],
        radius: [
            0,
            '50%'
        ],
        // 默认顺时针
        clockwise: true,
        startAngle: 90,
        endAngle: 'auto',
        padAngle: 0,
        // 最小角度改为0
        minAngle: 0,
        // If the angle of a sector less than `minShowLabelAngle`,
        // the label will not be displayed.
        minShowLabelAngle: 0,
        // 选中时扇区偏移量
        selectedOffset: 10,
        // 选择模式，默认关闭，可选single，multiple
        // selectedMode: false,
        // 南丁格尔玫瑰图模式，'radius'（半径） | 'area'（面积）
        // roseType: null,
        percentPrecision: 2,
        // If still show when all data zero.
        stillShowZeroSum: true,
        // cursor: null,
        coordinateSystemUsage: 'box',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: null,
        height: null,
        label: {
            // color: 'inherit',
            // If rotate around circle
            rotate: 0,
            show: true,
            overflow: 'truncate',
            // 'outer', 'inside', 'center'
            position: 'outer',
            // 'none', 'labelLine', 'edge'. Works only when position is 'outer'
            alignTo: 'none',
            // Closest distance between label and chart edge.
            // Works only position is 'outer' and alignTo is 'edge'.
            edgeDistance: '25%',
            // Works only position is 'outer' and alignTo is not 'edge'.
            // The default `bleedMargin` is auto determined according to view rect size.
            // bleedMargin: 10,
            // Distance between text and label line.
            distanceToLabelLine: 5
        },
        // Enabled when label.normal.position is 'outer'
        labelLine: {
            show: true,
            // 引导线两段中的第一段长度
            length: 15,
            // 引导线两段中的第二段长度
            length2: 30,
            smooth: false,
            minTurnAngle: 90,
            maxSurfaceAngle: 90,
            lineStyle: {
                // color: 各异,
                width: 1,
                type: 'solid'
            }
        },
        itemStyle: {
            borderWidth: 1,
            borderJoin: 'round'
        },
        showEmptyCircle: true,
        emptyCircleStyle: {
            color: 'lightgray',
            opacity: 1
        },
        labelLayout: {
            // Hide the overlapped label.
            hideOverlap: true
        },
        emphasis: {
            scale: true,
            scaleSize: 5
        },
        // If use strategy to avoid label overlapping
        avoidLabelOverlap: true,
        // Animation type. Valid values: expansion, scale
        animationType: 'expansion',
        animationDuration: 1000,
        // Animation type when update. Valid values: transition, expansion
        animationTypeUpdate: 'transition',
        animationEasingUpdate: 'cubicInOut',
        animationDurationUpdate: 500,
        animationEasing: 'cubicInOut'
    };
    return PieSeriesModel;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerLayOutOnCoordSysUsage"])({
    fullType: PieSeriesModel.type,
    getCoord2: function(model) {
        // Not able to validate `center` type here.
        // But percentage center, such as '12%', is not allowed in this case.
        return model.getShallow('center');
    }
});
const __TURBOPACK__default__export__ = PieSeriesModel;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/pie/PieView.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/animation/basicTransition.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Polyline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Polyline$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Polyline.js [app-client] (ecmascript) <export default as Polyline>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Text$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Text.js [app-client] (ecmascript) <export default as Text>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Sector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sector$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Sector.js [app-client] (ecmascript) <export default as Sector>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/states.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/view/Chart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$pie$2f$PieSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/pie/PieSeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$pie$2f$labelLayout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/pie/labelLayout.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelGuideHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/label/labelGuideHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/label/labelStyle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$sectorHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/sectorHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$pie$2f$pieLayout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/pie/pieLayout.js [app-client] (ecmascript)");
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
/**
 * Piece of pie including Sector, Label, LabelLine
 */ var PiePiece = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(PiePiece, _super);
    function PiePiece(data, idx, startAngle) {
        var _this = _super.call(this) || this;
        _this.z2 = 2;
        var text = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Text$3e$__["Text"]();
        _this.setTextContent(text);
        _this.updateData(data, idx, startAngle, true);
        return _this;
    }
    PiePiece.prototype.updateData = function(data, idx, startAngle, firstCreate) {
        var sector = this;
        var seriesModel = data.hostModel;
        var itemModel = data.getItemModel(idx);
        var emphasisModel = itemModel.getModel('emphasis');
        var layout = data.getItemLayout(idx);
        // cornerRadius & innerCornerRadius doesn't exist in the item layout. Use `0` if null value is specified.
        // see `setItemLayout` in `pieLayout.ts`.
        var sectorShape = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$sectorHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSectorCornerRadius"])(itemModel.getModel('itemStyle'), layout, true), layout);
        // Ignore NaN data.
        if (isNaN(sectorShape.startAngle)) {
            // Use NaN shape to avoid drawing shape.
            sector.setShape(sectorShape);
            return;
        }
        if (firstCreate) {
            sector.setShape(sectorShape);
            var animationType = seriesModel.getShallow('animationType');
            if (seriesModel.ecModel.ssr) {
                // Use scale animation in SSR mode(opacity?)
                // Because CSS SVG animation doesn't support very customized shape animation.
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initProps"](sector, {
                    scaleX: 0,
                    scaleY: 0
                }, seriesModel, {
                    dataIndex: idx,
                    isFrom: true
                });
                sector.originX = sectorShape.cx;
                sector.originY = sectorShape.cy;
            } else if (animationType === 'scale') {
                sector.shape.r = layout.r0;
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initProps"](sector, {
                    shape: {
                        r: layout.r
                    }
                }, seriesModel, idx);
            } else {
                if (startAngle != null) {
                    sector.setShape({
                        startAngle: startAngle,
                        endAngle: startAngle
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initProps"](sector, {
                        shape: {
                            startAngle: layout.startAngle,
                            endAngle: layout.endAngle
                        }
                    }, seriesModel, idx);
                } else {
                    sector.shape.endAngle = layout.startAngle;
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProps"](sector, {
                        shape: {
                            endAngle: layout.endAngle
                        }
                    }, seriesModel, idx);
                }
            }
        } else {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveOldStyle"])(sector);
            // Transition animation from the old shape
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProps"](sector, {
                shape: sectorShape
            }, seriesModel, idx);
        }
        sector.useStyle(data.getItemVisual(idx, 'style'));
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setStatesStylesFromModel"])(sector, itemModel);
        var midAngle = (layout.startAngle + layout.endAngle) / 2;
        var offset = seriesModel.get('selectedOffset');
        var dx = Math.cos(midAngle) * offset;
        var dy = Math.sin(midAngle) * offset;
        var cursorStyle = itemModel.getShallow('cursor');
        cursorStyle && sector.attr('cursor', cursorStyle);
        this._updateLabel(seriesModel, data, idx);
        sector.ensureState('emphasis').shape = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])({
            r: layout.r + (emphasisModel.get('scale') ? emphasisModel.get('scaleSize') || 0 : 0)
        }, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$sectorHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSectorCornerRadius"])(emphasisModel.getModel('itemStyle'), layout));
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])(sector.ensureState('select'), {
            x: dx,
            y: dy,
            shape: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$sectorHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSectorCornerRadius"])(itemModel.getModel([
                'select',
                'itemStyle'
            ]), layout)
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])(sector.ensureState('blur'), {
            shape: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$sectorHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSectorCornerRadius"])(itemModel.getModel([
                'blur',
                'itemStyle'
            ]), layout)
        });
        var labelLine = sector.getTextGuideLine();
        var labelText = sector.getTextContent();
        labelLine && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])(labelLine.ensureState('select'), {
            x: dx,
            y: dy
        });
        // TODO: needs dx, dy in zrender?
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])(labelText.ensureState('select'), {
            x: dx,
            y: dy
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toggleHoverEmphasis"])(this, emphasisModel.get('focus'), emphasisModel.get('blurScope'), emphasisModel.get('disabled'));
    };
    PiePiece.prototype._updateLabel = function(seriesModel, data, idx) {
        var sector = this;
        var itemModel = data.getItemModel(idx);
        var labelLineModel = itemModel.getModel('labelLine');
        var style = data.getItemVisual(idx, 'style');
        var visualColor = style && style.fill;
        var visualOpacity = style && style.opacity;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLabelStyle"])(sector, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLabelStatesModels"])(itemModel), {
            labelFetcher: data.hostModel,
            labelDataIndex: idx,
            inheritColor: visualColor,
            defaultOpacity: visualOpacity,
            defaultText: seriesModel.getFormattedLabel(idx, 'normal') || data.getName(idx)
        });
        var labelText = sector.getTextContent();
        // Set textConfig on sector.
        sector.setTextConfig({
            // reset position, rotation
            position: null,
            rotation: null
        });
        // Make sure update style on labelText after setLabelStyle.
        // Because setLabelStyle will replace a new style on it.
        labelText.attr({
            z2: 10
        });
        var labelPosition = itemModel.get([
            'label',
            'position'
        ]);
        if (labelPosition !== 'outside' && labelPosition !== 'outer') {
            sector.removeTextGuideLine();
        } else {
            var polyline = this.getTextGuideLine();
            if (!polyline) {
                polyline = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Polyline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Polyline$3e$__["Polyline"]();
                this.setTextGuideLine(polyline);
            }
            // Default use item visual color
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelGuideHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLabelLineStyle"])(this, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelGuideHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLabelLineStatesModels"])(itemModel), {
                stroke: visualColor,
                opacity: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["retrieve3"])(labelLineModel.get([
                    'lineStyle',
                    'opacity'
                ]), visualOpacity, 1)
            });
        }
    };
    return PiePiece;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Sector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sector$3e$__["Sector"]);
var PieView = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(PieView, _super);
    function PieView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$pie$2f$PieSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_PIE"];
        _this.ignoreLabelLineUpdate = true;
        return _this;
    }
    PieView.prototype.render = function(seriesModel, ecModel, api, payload) {
        var data = seriesModel.getData();
        var oldData = this._data;
        var group = this.group;
        var startAngle;
        // First render
        if (!oldData && data.count() > 0) {
            var shape = data.getItemLayout(0);
            for(var s = 1; isNaN(shape && shape.startAngle) && s < data.count(); ++s){
                shape = data.getItemLayout(s);
            }
            if (shape) {
                startAngle = shape.startAngle;
            }
        }
        // remove empty-circle if it exists
        if (this._emptyCircleSector) {
            group.remove(this._emptyCircleSector);
        }
        // when all data are filtered, show lightgray empty circle
        if (data.count() === 0 && seriesModel.get('showEmptyCircle')) {
            var layoutData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$pie$2f$pieLayout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSeriesLayoutData"])(seriesModel);
            var sector = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Sector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sector$3e$__["Sector"]({
                shape: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clone"])(layoutData)
            });
            sector.useStyle(seriesModel.getModel('emptyCircleStyle').getItemStyle());
            this._emptyCircleSector = sector;
            group.add(sector);
        }
        data.diff(oldData).add(function(idx) {
            var piePiece = new PiePiece(data, idx, startAngle);
            data.setItemGraphicEl(idx, piePiece);
            group.add(piePiece);
        }).update(function(newIdx, oldIdx) {
            var piePiece = oldData.getItemGraphicEl(oldIdx);
            piePiece.updateData(data, newIdx, startAngle);
            piePiece.off('click');
            group.add(piePiece);
            data.setItemGraphicEl(newIdx, piePiece);
        }).remove(function(idx) {
            var piePiece = oldData.getItemGraphicEl(idx);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeElementWithFadeOut"](piePiece, seriesModel, idx);
        }).execute();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$pie$2f$labelLayout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(seriesModel);
        // Always use initial animation.
        if (seriesModel.get('animationTypeUpdate') !== 'expansion') {
            this._data = data;
        }
    };
    PieView.prototype.dispose = function() {};
    PieView.prototype.containPoint = function(point, seriesModel) {
        var data = seriesModel.getData();
        var itemLayout = data.getItemLayout(0);
        if (itemLayout) {
            var dx = point[0] - itemLayout.cx;
            var dy = point[1] - itemLayout.cy;
            var radius = Math.sqrt(dx * dx + dy * dy);
            return radius <= itemLayout.r && radius >= itemLayout.r0;
        }
    };
    PieView.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$pie$2f$PieSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_PIE"];
    return PieView;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = PieView;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/pie/install.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "install",
    ()=>install
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$legacy$2f$dataSelectAction$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/legacy/dataSelectAction.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$processor$2f$dataFilter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/processor/dataFilter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$pie$2f$PieView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/pie/PieView.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$pie$2f$PieSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/pie/PieSeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$processor$2f$negativeDataFilter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/processor/negativeDataFilter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$pie$2f$pieLayout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/pie/pieLayout.js [app-client] (ecmascript)");
;
;
;
;
;
;
function install(registers) {
    registers.registerChartView(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$pie$2f$PieView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
    registers.registerSeriesModel(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$pie$2f$PieSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$legacy$2f$dataSelectAction$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createLegacyDataSelectAction"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$pie$2f$PieSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_PIE"], registers.registerAction);
    registers.registerLayout(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$pie$2f$pieLayout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pieLayoutStageHandler"]);
    registers.registerProcessor((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$processor$2f$dataFilter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$pie$2f$PieSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_PIE"]));
    registers.registerProcessor((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$processor$2f$negativeDataFilter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$pie$2f$PieSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_PIE"]));
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/pie/install.js [app-client] (ecmascript) <export install as PieChart>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PieChart",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$pie$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["install"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$pie$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/pie/install.js [app-client] (ecmascript)");
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/pie/labelLayout.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>pieLabelLayout
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
*/ // FIXME emphasis label position is not same with normal label position
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Point$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/Point.js [app-client] (ecmascript) <export default as Point>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/BoundingRect.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelGuideHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/label/labelGuideHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelLayoutHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/label/labelLayoutHelper.js [app-client] (ecmascript)");
;
;
;
;
;
;
var RADIAN = Math.PI / 180;
function adjustSingleSide(list, cx, cy, r, dir, viewWidth, viewHeight, viewLeft, viewTop, farthestX) {
    if (list.length < 2) {
        return;
    }
    ;
    function recalculateXOnSemiToAlignOnEllipseCurve(semi) {
        var rB = semi.rB;
        var rB2 = rB * rB;
        for(var i = 0; i < semi.list.length; i++){
            var item = semi.list[i];
            var dy = Math.abs(item.label.y - cy);
            // horizontal r is always same with original r because x is not changed.
            var rA = r + item.len;
            var rA2 = rA * rA;
            // Use ellipse implicit function to calculate x
            var dx = Math.sqrt(Math.abs((1 - dy * dy / rB2) * rA2));
            var newX = cx + (dx + item.len2) * dir;
            var deltaX = newX - item.label.x;
            var newTargetWidth = item.targetTextWidth - deltaX * dir;
            // text x is changed, so need to recalculate width.
            constrainTextWidth(item, newTargetWidth, true);
            item.label.x = newX;
        }
    }
    // Adjust X based on the shifted y. Make tight labels aligned on an ellipse curve.
    function recalculateX(items) {
        // Extremes of
        var topSemi = {
            list: [],
            maxY: 0
        };
        var bottomSemi = {
            list: [],
            maxY: 0
        };
        for(var i = 0; i < items.length; i++){
            if (items[i].labelAlignTo !== 'none') {
                continue;
            }
            var item = items[i];
            var semi = item.label.y > cy ? bottomSemi : topSemi;
            var dy = Math.abs(item.label.y - cy);
            if (dy >= semi.maxY) {
                var dx = item.label.x - cx - item.len2 * dir;
                // horizontal r is always same with original r because x is not changed.
                var rA = r + item.len;
                // Canculate rB based on the topest / bottemest label.
                var rB = Math.abs(dx) < rA ? Math.sqrt(dy * dy / (1 - dx * dx / rA / rA)) : rA;
                semi.rB = rB;
                semi.maxY = dy;
            }
            semi.list.push(item);
        }
        recalculateXOnSemiToAlignOnEllipseCurve(topSemi);
        recalculateXOnSemiToAlignOnEllipseCurve(bottomSemi);
    }
    var len = list.length;
    for(var i = 0; i < len; i++){
        if (list[i].position === 'outer' && list[i].labelAlignTo === 'labelLine') {
            var dx = list[i].label.x - farthestX;
            list[i].linePoints[1][0] += dx;
            list[i].label.x = farthestX;
        }
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelLayoutHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shiftLayoutOnXY"])(list, 1, viewTop, viewTop + viewHeight)) {
        recalculateX(list);
    }
}
function avoidOverlap(labelLayoutList, cx, cy, r, viewWidth, viewHeight, viewLeft, viewTop) {
    var leftList = [];
    var rightList = [];
    var leftmostX = Number.MAX_VALUE;
    var rightmostX = -Number.MAX_VALUE;
    for(var i = 0; i < labelLayoutList.length; i++){
        var label = labelLayoutList[i].label;
        if (isPositionCenter(labelLayoutList[i])) {
            continue;
        }
        if (label.x < cx) {
            leftmostX = Math.min(leftmostX, label.x);
            leftList.push(labelLayoutList[i]);
        } else {
            rightmostX = Math.max(rightmostX, label.x);
            rightList.push(labelLayoutList[i]);
        }
    }
    for(var i = 0; i < labelLayoutList.length; i++){
        var layout = labelLayoutList[i];
        if (!isPositionCenter(layout) && layout.linePoints) {
            if (layout.labelStyleWidth != null) {
                continue;
            }
            var label = layout.label;
            var linePoints = layout.linePoints;
            var targetTextWidth = void 0;
            if (layout.labelAlignTo === 'edge') {
                if (label.x < cx) {
                    targetTextWidth = linePoints[2][0] - layout.labelDistance - viewLeft - layout.edgeDistance;
                } else {
                    targetTextWidth = viewLeft + viewWidth - layout.edgeDistance - linePoints[2][0] - layout.labelDistance;
                }
            } else if (layout.labelAlignTo === 'labelLine') {
                if (label.x < cx) {
                    targetTextWidth = leftmostX - viewLeft - layout.bleedMargin;
                } else {
                    targetTextWidth = viewLeft + viewWidth - rightmostX - layout.bleedMargin;
                }
            } else {
                if (label.x < cx) {
                    targetTextWidth = label.x - viewLeft - layout.bleedMargin;
                } else {
                    targetTextWidth = viewLeft + viewWidth - label.x - layout.bleedMargin;
                }
            }
            layout.targetTextWidth = targetTextWidth;
            constrainTextWidth(layout, targetTextWidth, false);
        }
    }
    adjustSingleSide(rightList, cx, cy, r, 1, viewWidth, viewHeight, viewLeft, viewTop, rightmostX);
    adjustSingleSide(leftList, cx, cy, r, -1, viewWidth, viewHeight, viewLeft, viewTop, leftmostX);
    for(var i = 0; i < labelLayoutList.length; i++){
        var layout = labelLayoutList[i];
        if (!isPositionCenter(layout) && layout.linePoints) {
            var label = layout.label;
            var linePoints = layout.linePoints;
            var isAlignToEdge = layout.labelAlignTo === 'edge';
            var padding = label.style.padding;
            var paddingH = padding ? padding[1] + padding[3] : 0;
            // textRect.width already contains paddingH if bgColor is set
            var extraPaddingH = label.style.backgroundColor ? 0 : paddingH;
            var realTextWidth = layout.rect.width + extraPaddingH;
            var dist = linePoints[1][0] - linePoints[2][0];
            if (isAlignToEdge) {
                if (label.x < cx) {
                    linePoints[2][0] = viewLeft + layout.edgeDistance + realTextWidth + layout.labelDistance;
                } else {
                    linePoints[2][0] = viewLeft + viewWidth - layout.edgeDistance - realTextWidth - layout.labelDistance;
                }
            } else {
                if (label.x < cx) {
                    linePoints[2][0] = label.x + layout.labelDistance;
                } else {
                    linePoints[2][0] = label.x - layout.labelDistance;
                }
                linePoints[1][0] = linePoints[2][0] + dist;
            }
            linePoints[1][1] = linePoints[2][1] = label.y;
        }
    }
}
/**
 * Set max width of each label, and then wrap each label to the max width.
 *
 * @param layout label layout
 * @param availableWidth max width for the label to display
 * @param forceRecalculate recaculate the text layout even if the current width
 * is smaller than `availableWidth`. This is useful when the text was previously
 * wrapped by calling `constrainTextWidth` but now `availableWidth` changed, in
 * which case, previous wrapping should be redo.
 */ function constrainTextWidth(layout, availableWidth, forceRecalculate) {
    if (layout.labelStyleWidth != null) {
        // User-defined style.width has the highest priority.
        return;
    }
    var label = layout.label;
    var style = label.style;
    var textRect = layout.rect;
    var bgColor = style.backgroundColor;
    var padding = style.padding;
    var paddingH = padding ? padding[1] + padding[3] : 0;
    var overflow = style.overflow;
    // textRect.width already contains paddingH if bgColor is set
    var oldOuterWidth = textRect.width + (bgColor ? 0 : paddingH);
    if (availableWidth < oldOuterWidth || forceRecalculate) {
        if (overflow && overflow.match('break')) {
            // Temporarily set background to be null to calculate
            // the bounding box without background.
            label.setStyle('backgroundColor', null);
            // Set constraining width
            label.setStyle('width', availableWidth - paddingH);
            // This is the real bounding box of the text without padding.
            var innerRect = label.getBoundingRect();
            label.setStyle('width', Math.ceil(innerRect.width));
            label.setStyle('backgroundColor', bgColor);
        } else {
            var availableInnerWidth = availableWidth - paddingH;
            var newWidth = availableWidth < oldOuterWidth ? availableInnerWidth : // Current available width is enough, but the text may have
            // already been wrapped with a smaller available width.
            forceRecalculate ? availableInnerWidth > layout.unconstrainedWidth ? null : availableInnerWidth : null;
            label.setStyle('width', newWidth);
        }
        computeLabelGlobalRect(textRect, label);
    }
}
function computeLabelGlobalRect(out, label) {
    _tmpLabelGeometry.rect = out;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelLayoutHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computeLabelGeometry"])(_tmpLabelGeometry, label, _computeLabelGeometryOpt);
}
var _computeLabelGeometryOpt = {
    minMarginForce: [
        null,
        0,
        null,
        0
    ],
    marginDefault: [
        1,
        0,
        1,
        0
    ]
};
var _tmpLabelGeometry = {};
function isPositionCenter(sectorShape) {
    // Not change x for center label
    return sectorShape.position === 'center';
}
function pieLabelLayout(seriesModel) {
    var data = seriesModel.getData();
    var labelLayoutList = [];
    var cx;
    var cy;
    var hasLabelRotate = false;
    var minShowLabelRadian = (seriesModel.get('minShowLabelAngle') || 0) * RADIAN;
    var viewRect = data.getLayout('viewRect');
    var r = data.getLayout('r');
    var viewWidth = viewRect.width;
    var viewLeft = viewRect.x;
    var viewTop = viewRect.y;
    var viewHeight = viewRect.height;
    function setNotShow(el) {
        el.ignore = true;
    }
    function isLabelShown(label) {
        if (!label.ignore) {
            return true;
        }
        for(var key in label.states){
            if (label.states[key].ignore === false) {
                return true;
            }
        }
        return false;
    }
    data.each(function(idx) {
        var sector = data.getItemGraphicEl(idx);
        var sectorShape = sector.shape;
        var label = sector.getTextContent();
        var labelLine = sector.getTextGuideLine();
        var itemModel = data.getItemModel(idx);
        var labelModel = itemModel.getModel('label');
        // Use position in normal or emphasis
        var labelPosition = labelModel.get('position') || itemModel.get([
            'emphasis',
            'label',
            'position'
        ]);
        var labelDistance = labelModel.get('distanceToLabelLine');
        var labelAlignTo = labelModel.get('alignTo');
        var edgeDistance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(labelModel.get('edgeDistance'), viewWidth);
        var bleedMargin = labelModel.get('bleedMargin');
        if (bleedMargin == null) {
            // An arbitrary strategy for small viewRect - especial pie is layout in calendar or matrix coord sys.
            bleedMargin = Math.min(viewWidth, viewHeight) > 200 ? 10 : 2;
        }
        var labelLineModel = itemModel.getModel('labelLine');
        var labelLineLen = labelLineModel.get('length');
        labelLineLen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(labelLineLen, viewWidth);
        var labelLineLen2 = labelLineModel.get('length2');
        labelLineLen2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(labelLineLen2, viewWidth);
        if (Math.abs(sectorShape.endAngle - sectorShape.startAngle) < minShowLabelRadian) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(label.states, setNotShow);
            label.ignore = true;
            if (labelLine) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(labelLine.states, setNotShow);
                labelLine.ignore = true;
            }
            return;
        }
        if (!isLabelShown(label)) {
            return;
        }
        var midAngle = (sectorShape.startAngle + sectorShape.endAngle) / 2;
        var nx = Math.cos(midAngle);
        var ny = Math.sin(midAngle);
        var textX;
        var textY;
        var linePoints;
        var textAlign;
        cx = sectorShape.cx;
        cy = sectorShape.cy;
        var isLabelInside = labelPosition === 'inside' || labelPosition === 'inner';
        if (labelPosition === 'center') {
            textX = sectorShape.cx;
            textY = sectorShape.cy;
            textAlign = 'center';
        } else {
            var x1 = (isLabelInside ? (sectorShape.r + sectorShape.r0) / 2 * nx : sectorShape.r * nx) + cx;
            var y1 = (isLabelInside ? (sectorShape.r + sectorShape.r0) / 2 * ny : sectorShape.r * ny) + cy;
            textX = x1 + nx * 3;
            textY = y1 + ny * 3;
            if (!isLabelInside) {
                // For roseType
                var x2 = x1 + nx * (labelLineLen + r - sectorShape.r);
                var y2 = y1 + ny * (labelLineLen + r - sectorShape.r);
                var x3 = x2 + (nx < 0 ? -1 : 1) * labelLineLen2;
                var y3 = y2;
                if (labelAlignTo === 'edge') {
                    // Adjust textX because text align of edge is opposite
                    textX = nx < 0 ? viewLeft + edgeDistance : viewLeft + viewWidth - edgeDistance;
                } else {
                    textX = x3 + (nx < 0 ? -labelDistance : labelDistance);
                }
                textY = y3;
                linePoints = [
                    [
                        x1,
                        y1
                    ],
                    [
                        x2,
                        y2
                    ],
                    [
                        x3,
                        y3
                    ]
                ];
            }
            textAlign = isLabelInside ? 'center' : labelAlignTo === 'edge' ? nx > 0 ? 'right' : 'left' : nx > 0 ? 'left' : 'right';
        }
        var PI = Math.PI;
        var labelRotate = 0;
        var rotate = labelModel.get('rotate');
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(rotate)) {
            labelRotate = rotate * (PI / 180);
        } else if (labelPosition === 'center') {
            labelRotate = 0;
        } else if (rotate === 'radial' || rotate === true) {
            var radialAngle = nx < 0 ? -midAngle + PI : -midAngle;
            labelRotate = radialAngle;
        } else if (rotate === 'tangential' || rotate === 'tangential-noflip' && labelPosition !== 'outside' && labelPosition !== 'outer') {
            var rad = Math.atan2(nx, ny);
            if (rad < 0) {
                rad = PI * 2 + rad;
            }
            var isDown = ny > 0;
            if (isDown && rotate !== 'tangential-noflip') {
                rad = PI + rad;
            }
            labelRotate = rad - PI;
        }
        hasLabelRotate = !!labelRotate;
        label.x = textX;
        label.y = textY;
        label.rotation = labelRotate;
        label.setStyle({
            verticalAlign: 'middle'
        });
        // Not sectorShape the inside label
        if (!isLabelInside) {
            var textRect = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](0, 0, 0, 0);
            computeLabelGlobalRect(textRect, label);
            labelLayoutList.push({
                label: label,
                labelLine: labelLine,
                position: labelPosition,
                len: labelLineLen,
                len2: labelLineLen2,
                minTurnAngle: labelLineModel.get('minTurnAngle'),
                maxSurfaceAngle: labelLineModel.get('maxSurfaceAngle'),
                surfaceNormal: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Point$3e$__["Point"](nx, ny),
                linePoints: linePoints,
                textAlign: textAlign,
                labelDistance: labelDistance,
                labelAlignTo: labelAlignTo,
                edgeDistance: edgeDistance,
                bleedMargin: bleedMargin,
                rect: textRect,
                unconstrainedWidth: textRect.width,
                labelStyleWidth: label.style.width
            });
        } else {
            label.setStyle({
                align: textAlign
            });
            var selectState = label.states.select;
            if (selectState) {
                selectState.x += label.x;
                selectState.y += label.y;
            }
        }
        sector.setTextConfig({
            inside: isLabelInside
        });
    });
    if (!hasLabelRotate && seriesModel.get('avoidLabelOverlap')) {
        avoidOverlap(labelLayoutList, cx, cy, r, viewWidth, viewHeight, viewLeft, viewTop);
    }
    for(var i = 0; i < labelLayoutList.length; i++){
        var layout = labelLayoutList[i];
        var label = layout.label;
        var labelLine = layout.labelLine;
        var notShowLabel = isNaN(label.x) || isNaN(label.y);
        if (label) {
            label.setStyle({
                align: layout.textAlign
            });
            if (notShowLabel) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(label.states, setNotShow);
                label.ignore = true;
            }
            var selectState = label.states.select;
            if (selectState) {
                selectState.x += label.x;
                selectState.y += label.y;
            }
        }
        if (labelLine) {
            var linePoints = layout.linePoints;
            if (notShowLabel || !linePoints) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(labelLine.states, setNotShow);
                labelLine.ignore = true;
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelGuideHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["limitTurnAngle"])(linePoints, layout.minTurnAngle);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelGuideHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["limitSurfaceAngle"])(linePoints, layout.surfaceNormal, layout.maxSurfaceAngle);
                labelLine.setShape({
                    points: linePoints
                });
                // Set the anchor to the midpoint of sector
                label.__hostTarget.textGuideLineConfig = {
                    anchor: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Point$3e$__["Point"](linePoints[0][0], linePoints[0][1])
                };
            }
        }
    }
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/pie/pieLayout.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSeriesLayoutData",
    ()=>getSeriesLayoutData,
    "pieLayoutStageHandler",
    ()=>pieLayoutStageHandler
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$pie$2f$PieSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/pie/PieSeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$PathProxy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/PathProxy.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/layout.js [app-client] (ecmascript)");
;
;
;
;
;
var PI2 = Math.PI * 2;
var RADIAN = Math.PI / 180;
var pieLayoutStageHandler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSimpleOverallStageHandler"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$pie$2f$PieSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_PIE"], pieLayout);
function pieLayout(ecModel, api) {
    ecModel.eachSeriesByType(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$pie$2f$PieSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_PIE"], function(seriesModel) {
        var data = seriesModel.getData();
        var valueDim = data.mapDimension('value');
        var _a = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCircleLayout"])(seriesModel, api), cx = _a.cx, cy = _a.cy, r = _a.r, r0 = _a.r0, viewRect = _a.viewRect;
        var startAngle = -seriesModel.get('startAngle') * RADIAN;
        var endAngle = seriesModel.get('endAngle');
        var padAngle = seriesModel.get('padAngle') * RADIAN;
        endAngle = endAngle === 'auto' ? startAngle - PI2 : -endAngle * RADIAN;
        var minAngle = seriesModel.get('minAngle') * RADIAN;
        var minAndPadAngle = minAngle + padAngle;
        var validDataCount = 0;
        data.each(valueDim, function(value) {
            !isNaN(value) && validDataCount++;
        });
        var sum = data.getSum(valueDim);
        // Sum may be 0
        var unitRadian = Math.PI / (sum || validDataCount) * 2;
        var clockwise = seriesModel.get('clockwise');
        var roseType = seriesModel.get('roseType');
        var stillShowZeroSum = seriesModel.get('stillShowZeroSum');
        // [0...max]
        var extent = data.getDataExtent(valueDim);
        extent[0] = 0;
        var dir = clockwise ? 1 : -1;
        var angles = [
            startAngle,
            endAngle
        ];
        var halfPadAngle = dir * padAngle / 2;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$PathProxy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeArcAngles"])(angles, !clockwise);
        startAngle = angles[0], endAngle = angles[1];
        var layoutData = getSeriesLayoutData(seriesModel);
        layoutData.startAngle = startAngle;
        layoutData.endAngle = endAngle;
        layoutData.clockwise = clockwise;
        layoutData.cx = cx;
        layoutData.cy = cy;
        layoutData.r = r;
        layoutData.r0 = r0;
        var angleRange = Math.abs(endAngle - startAngle);
        // In the case some sector angle is smaller than minAngle
        var restAngle = angleRange;
        var valueSumLargerThanMinAngle = 0;
        var currentAngle = startAngle;
        // Requird by `pieLabelLayout`.
        data.setLayout({
            viewRect: viewRect,
            r: r
        });
        data.each(valueDim, function(value, idx) {
            var angle;
            if (isNaN(value)) {
                data.setItemLayout(idx, {
                    angle: NaN,
                    startAngle: NaN,
                    endAngle: NaN,
                    clockwise: clockwise,
                    cx: cx,
                    cy: cy,
                    r0: r0,
                    r: roseType ? NaN : r
                });
                return;
            }
            // FIXME 兼容 2.0 但是 roseType 是 area 的时候才是这样？
            if (roseType !== 'area') {
                angle = sum === 0 && stillShowZeroSum ? unitRadian : value * unitRadian;
            } else {
                angle = angleRange / validDataCount;
            }
            if (angle < minAndPadAngle) {
                angle = minAndPadAngle;
                restAngle -= minAndPadAngle;
            } else {
                valueSumLargerThanMinAngle += value;
            }
            var endAngle = currentAngle + dir * angle;
            // calculate display angle
            var actualStartAngle = 0;
            var actualEndAngle = 0;
            if (padAngle > angle) {
                actualStartAngle = currentAngle + dir * angle / 2;
                actualEndAngle = actualStartAngle;
            } else {
                actualStartAngle = currentAngle + halfPadAngle;
                actualEndAngle = endAngle - halfPadAngle;
            }
            data.setItemLayout(idx, {
                angle: angle,
                startAngle: actualStartAngle,
                endAngle: actualEndAngle,
                clockwise: clockwise,
                cx: cx,
                cy: cy,
                r0: r0,
                r: roseType ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["linearMap"])(value, extent, [
                    r0,
                    r
                ]) : r
            });
            currentAngle = endAngle;
        });
        // Some sector is constrained by minAngle and padAngle
        // Rest sectors needs recalculate angle
        if (restAngle < PI2 && validDataCount) {
            // Average the angle if rest angle is not enough after all angles is
            // Constrained by minAngle and padAngle
            if (restAngle <= 1e-3) {
                var angle_1 = angleRange / validDataCount;
                data.each(valueDim, function(value, idx) {
                    if (!isNaN(value)) {
                        var layout = data.getItemLayout(idx);
                        layout.angle = angle_1;
                        var actualStartAngle = 0;
                        var actualEndAngle = 0;
                        if (angle_1 < padAngle) {
                            actualStartAngle = startAngle + dir * (idx + 1 / 2) * angle_1;
                            actualEndAngle = actualStartAngle;
                        } else {
                            actualStartAngle = startAngle + dir * idx * angle_1 + halfPadAngle;
                            actualEndAngle = startAngle + dir * (idx + 1) * angle_1 - halfPadAngle;
                        }
                        layout.startAngle = actualStartAngle;
                        layout.endAngle = actualEndAngle;
                    }
                });
            } else {
                unitRadian = restAngle / valueSumLargerThanMinAngle;
                currentAngle = startAngle;
                data.each(valueDim, function(value, idx) {
                    if (!isNaN(value)) {
                        var layout = data.getItemLayout(idx);
                        var angle = layout.angle === minAndPadAngle ? minAndPadAngle : value * unitRadian;
                        var actualStartAngle = 0;
                        var actualEndAngle = 0;
                        if (angle < padAngle) {
                            actualStartAngle = currentAngle + dir * angle / 2;
                            actualEndAngle = actualStartAngle;
                        } else {
                            actualStartAngle = currentAngle + halfPadAngle;
                            actualEndAngle = currentAngle + dir * angle - halfPadAngle;
                        }
                        layout.startAngle = actualStartAngle;
                        layout.endAngle = actualEndAngle;
                        currentAngle += dir * angle;
                    }
                });
            }
        }
    });
}
var getSeriesLayoutData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeInner"])();
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/radar/RadarSeries.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.3.0/node_modules/tslib/tslib.es6.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Series.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createSeriesDataSimply$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createSeriesDataSimply.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$LegendVisualProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/LegendVisualProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$tooltip$2f$tooltipMarkup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/tooltip/tooltipMarkup.js [app-client] (ecmascript)");
;
;
;
;
;
;
var SERIES_TYPE_RADAR = 'radar';
var RadarSeriesModel = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(RadarSeriesModel, _super);
    function RadarSeriesModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = RadarSeriesModel.type;
        _this.hasSymbolVisual = true;
        return _this;
    }
    // Overwrite
    RadarSeriesModel.prototype.init = function(option) {
        _super.prototype.init.apply(this, arguments);
        // Enable legend selection for each data item
        // Use a function instead of direct access because data reference may changed
        this.legendVisualProvider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$LegendVisualProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bind"](this.getData, this), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bind"](this.getRawData, this));
    };
    RadarSeriesModel.prototype.getInitialData = function(option, ecModel) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createSeriesDataSimply$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(this, {
            generateCoord: 'indicator_',
            generateCoordCount: Infinity
        });
    };
    RadarSeriesModel.prototype.formatTooltip = function(dataIndex, multipleSeries, dataType) {
        var data = this.getData();
        var coordSys = this.coordinateSystem;
        var indicatorAxes = coordSys.getIndicatorAxes();
        var name = this.getData().getName(dataIndex);
        var nameToDisplay = name === '' ? this.name : name;
        var markerColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$tooltip$2f$tooltipMarkup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["retrieveVisualColorForTooltipMarker"])(this, dataIndex);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$tooltip$2f$tooltipMarkup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createTooltipMarkup"])('section', {
            header: nameToDisplay,
            sortBlocks: true,
            blocks: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"](indicatorAxes, function(axis) {
                var val = data.get(data.mapDimension(axis.dim), dataIndex);
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$tooltip$2f$tooltipMarkup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createTooltipMarkup"])('nameValue', {
                    markerType: 'subItem',
                    markerColor: markerColor,
                    name: axis.name,
                    value: val,
                    sortParam: val
                });
            })
        });
    };
    RadarSeriesModel.prototype.getTooltipPosition = function(dataIndex) {
        if (dataIndex != null) {
            var data_1 = this.getData();
            var coordSys = this.coordinateSystem;
            var values = data_1.getValues(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"](coordSys.dimensions, function(dim) {
                return data_1.mapDimension(dim);
            }), dataIndex);
            for(var i = 0, len = values.length; i < len; i++){
                if (!isNaN(values[i])) {
                    var indicatorAxes = coordSys.getIndicatorAxes();
                    return coordSys.coordToPoint(indicatorAxes[i].dataToCoord(values[i]), i);
                }
            }
        }
    };
    RadarSeriesModel.type = 'series.' + SERIES_TYPE_RADAR;
    RadarSeriesModel.dependencies = [
        'radar'
    ];
    RadarSeriesModel.defaultOption = {
        // zlevel: 0,
        z: 2,
        colorBy: 'data',
        coordinateSystem: 'radar',
        legendHoverLink: true,
        radarIndex: 0,
        lineStyle: {
            width: 2,
            type: 'solid',
            join: 'round'
        },
        label: {
            position: 'top'
        },
        // areaStyle: {
        // },
        // itemStyle: {}
        symbolSize: 8
    };
    return RadarSeriesModel;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = RadarSeriesModel;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/radar/RadarView.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/graphic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/states.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/symbol.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/view/Chart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$radar$2f$RadarSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/radar/RadarSeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/label/labelStyle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/animation/basicTransition.js [app-client] (ecmascript)");
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
var RadarView = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(RadarView, _super);
    function RadarView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$radar$2f$RadarSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_RADAR"];
        return _this;
    }
    RadarView.prototype.render = function(seriesModel, ecModel, api) {
        var polar = seriesModel.coordinateSystem;
        var group = this.group;
        var data = seriesModel.getData();
        var oldData = this._data;
        function createSymbol(data, idx) {
            var symbolType = data.getItemVisual(idx, 'symbol') || 'circle';
            if (symbolType === 'none') {
                return;
            }
            var symbolSize = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeSymbolSize"](data.getItemVisual(idx, 'symbolSize'));
            var symbolPath = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSymbol"](symbolType, -1, -1, 2, 2);
            var symbolRotate = data.getItemVisual(idx, 'symbolRotate') || 0;
            symbolPath.attr({
                style: {
                    strokeNoScale: true
                },
                z2: 100,
                scaleX: symbolSize[0] / 2,
                scaleY: symbolSize[1] / 2,
                rotation: symbolRotate * Math.PI / 180 || 0
            });
            return symbolPath;
        }
        function updateSymbols(oldPoints, newPoints, symbolGroup, data, idx, isInit) {
            // Simply rerender all
            symbolGroup.removeAll();
            for(var i = 0; i < newPoints.length - 1; i++){
                var symbolPath = createSymbol(data, idx);
                if (symbolPath) {
                    symbolPath.__dimIdx = i;
                    if (oldPoints[i]) {
                        symbolPath.setPosition(oldPoints[i]);
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[isInit ? 'initProps' : 'updateProps'](symbolPath, {
                            x: newPoints[i][0],
                            y: newPoints[i][1]
                        }, seriesModel, idx);
                    } else {
                        symbolPath.setPosition(newPoints[i]);
                    }
                    symbolGroup.add(symbolPath);
                }
            }
        }
        function getInitialPoints(points) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"](points, function(pt) {
                return [
                    polar.cx,
                    polar.cy
                ];
            });
        }
        data.diff(oldData).add(function(idx) {
            var points = data.getItemLayout(idx);
            if (!points) {
                return;
            }
            var polygon = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Polygon();
            var polyline = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Polyline();
            var target = {
                shape: {
                    points: points
                }
            };
            polygon.shape.points = getInitialPoints(points);
            polyline.shape.points = getInitialPoints(points);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.initProps(polygon, target, seriesModel, idx);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.initProps(polyline, target, seriesModel, idx);
            var itemGroup = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Group();
            var symbolGroup = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.Group();
            itemGroup.add(polyline);
            itemGroup.add(polygon);
            itemGroup.add(symbolGroup);
            updateSymbols(polyline.shape.points, points, symbolGroup, data, idx, true);
            data.setItemGraphicEl(idx, itemGroup);
        }).update(function(newIdx, oldIdx) {
            var itemGroup = oldData.getItemGraphicEl(oldIdx);
            var polyline = itemGroup.childAt(0);
            var polygon = itemGroup.childAt(1);
            var symbolGroup = itemGroup.childAt(2);
            var target = {
                shape: {
                    points: data.getItemLayout(newIdx)
                }
            };
            if (!target.shape.points) {
                return;
            }
            updateSymbols(polyline.shape.points, target.shape.points, symbolGroup, data, newIdx, false);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveOldStyle"])(polygon);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveOldStyle"])(polyline);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.updateProps(polyline, target, seriesModel);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.updateProps(polygon, target, seriesModel);
            data.setItemGraphicEl(newIdx, itemGroup);
        }).remove(function(idx) {
            group.remove(oldData.getItemGraphicEl(idx));
        }).execute();
        data.eachItemGraphicEl(function(itemGroup, idx) {
            var itemModel = data.getItemModel(idx);
            var polyline = itemGroup.childAt(0);
            var polygon = itemGroup.childAt(1);
            var symbolGroup = itemGroup.childAt(2);
            // Radar uses the visual encoded from itemStyle.
            var itemStyle = data.getItemVisual(idx, 'style');
            var color = itemStyle.fill;
            group.add(itemGroup);
            polyline.useStyle(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaults"](itemModel.getModel('lineStyle').getLineStyle(), {
                fill: 'none',
                stroke: color
            }));
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setStatesStylesFromModel"])(polyline, itemModel, 'lineStyle');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setStatesStylesFromModel"])(polygon, itemModel, 'areaStyle');
            var areaStyleModel = itemModel.getModel('areaStyle');
            var polygonIgnore = areaStyleModel.isEmpty() && areaStyleModel.parentModel.isEmpty();
            polygon.ignore = polygonIgnore;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"]([
                'emphasis',
                'select',
                'blur'
            ], function(stateName) {
                var stateModel = itemModel.getModel([
                    stateName,
                    'areaStyle'
                ]);
                var stateIgnore = stateModel.isEmpty() && stateModel.parentModel.isEmpty();
                // Won't be ignore if normal state is not ignore.
                polygon.ensureState(stateName).ignore = stateIgnore && polygonIgnore;
                var lineStyle = itemModel.getModel([
                    stateName,
                    'lineStyle'
                ]).getLineStyle();
                polyline.ensureState(stateName).style = lineStyle;
                var areaStyle = stateModel.getAreaStyle();
                polygon.ensureState(stateName).style = areaStyle;
                var itemStateStyle = itemModel.getModel([
                    stateName,
                    'itemStyle'
                ]).getItemStyle();
                symbolGroup.eachChild(function(symbolPath) {
                    symbolPath.ensureState(stateName).style = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clone"](itemStateStyle);
                });
            });
            polygon.useStyle(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaults"](itemModel.getModel('areaStyle').getAreaStyle(), {
                fill: color,
                opacity: 0.7,
                decal: itemStyle.decal
            }));
            var emphasisModel = itemModel.getModel('emphasis');
            symbolGroup.eachChild(function(symbolPath) {
                if (symbolPath instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]) {
                    var pathStyle = symbolPath.style;
                    symbolPath.useStyle(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"]({
                        // TODO other properties like x, y ?
                        image: pathStyle.image,
                        x: pathStyle.x,
                        y: pathStyle.y,
                        width: pathStyle.width,
                        height: pathStyle.height
                    }, itemStyle));
                } else {
                    symbolPath.useStyle(itemStyle);
                    symbolPath.setColor(color);
                    symbolPath.style.strokeNoScale = true;
                }
                var defaultText = data.getStore().get(data.getDimensionIndex(symbolPath.__dimIdx), idx);
                (defaultText == null || isNaN(defaultText)) && (defaultText = '');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLabelStyle"])(symbolPath, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLabelStatesModels"])(itemModel), {
                    labelFetcher: data.hostModel,
                    labelDataIndex: idx,
                    labelDimIndex: symbolPath.__dimIdx,
                    defaultText: defaultText,
                    inheritColor: color,
                    defaultOpacity: itemStyle.opacity
                });
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toggleHoverEmphasis"])(itemGroup, emphasisModel.get('focus'), emphasisModel.get('blurScope'), emphasisModel.get('disabled'));
        });
        this._data = data;
    };
    RadarView.prototype.remove = function() {
        this.group.removeAll();
        this._data = null;
    };
    RadarView.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$radar$2f$RadarSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_RADAR"];
    return RadarView;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = RadarView;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/radar/backwardCompat.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>radarBackwardCompat
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
*/ // @ts-nocheck
// Backward compat for radar chart in 2
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
;
function radarBackwardCompat(option) {
    var polarOptArr = option.polar;
    if (polarOptArr) {
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"](polarOptArr)) {
            polarOptArr = [
                polarOptArr
            ];
        }
        var polarNotRadar_1 = [];
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](polarOptArr, function(polarOpt, idx) {
            if (polarOpt.indicator) {
                if (polarOpt.type && !polarOpt.shape) {
                    polarOpt.shape = polarOpt.type;
                }
                option.radar = option.radar || [];
                if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"](option.radar)) {
                    option.radar = [
                        option.radar
                    ];
                }
                option.radar.push(polarOpt);
            } else {
                polarNotRadar_1.push(polarOpt);
            }
        });
        option.polar = polarNotRadar_1;
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](option.series, function(seriesOpt) {
        if (seriesOpt && seriesOpt.type === 'radar' && seriesOpt.polarIndex) {
            seriesOpt.radarIndex = seriesOpt.polarIndex;
        }
    });
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/radar/install.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "install",
    ()=>install
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$extension$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/extension.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$processor$2f$dataFilter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/processor/dataFilter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$radar$2f$backwardCompat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/radar/backwardCompat.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$radar$2f$RadarView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/radar/RadarView.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$radar$2f$RadarSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/radar/RadarSeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$radar$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/radar/install.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$radar$2f$radarLayout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/radar/radarLayout.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
function install(registers) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$extension$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$radar$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["install"]);
    registers.registerChartView(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$radar$2f$RadarView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
    registers.registerSeriesModel(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$radar$2f$RadarSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
    registers.registerLayout(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$radar$2f$radarLayout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["radarLayoutStageHandler"]);
    registers.registerProcessor((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$processor$2f$dataFilter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('radar'));
    registers.registerPreprocessor(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$radar$2f$backwardCompat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/radar/install.js [app-client] (ecmascript) <export install as RadarChart>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RadarChart",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$radar$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["install"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$radar$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/radar/install.js [app-client] (ecmascript)");
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/radar/radarLayout.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "radarLayoutStageHandler",
    ()=>radarLayoutStageHandler
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$radar$2f$RadarSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/radar/RadarSeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
;
;
;
var radarLayoutStageHandler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSimpleOverallStageHandler"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$radar$2f$RadarSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_RADAR"], radarLayout);
function radarLayout(ecModel) {
    ecModel.eachSeriesByType(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$radar$2f$RadarSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_RADAR"], function(seriesModel) {
        var data = seriesModel.getData();
        var points = [];
        var coordSys = seriesModel.coordinateSystem;
        if (!coordSys) {
            return;
        }
        var axes = coordSys.getIndicatorAxes();
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](axes, function(axis, axisIndex) {
            data.each(data.mapDimension(axes[axisIndex].dim), function(val, dataIndex) {
                points[dataIndex] = points[dataIndex] || [];
                var point = coordSys.dataToPoint(val, axisIndex);
                points[dataIndex][axisIndex] = isValidPoint(point) ? point : getValueMissingPoint(coordSys);
            });
        });
        // Close polygon
        data.each(function(idx) {
            // TODO
            // Is it appropriate to connect to the next data when some data is missing?
            // Or, should trade it like `connectNull` in line chart?
            var firstPoint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["find"](points[idx], function(point) {
                return isValidPoint(point);
            }) || getValueMissingPoint(coordSys);
            // Copy the first actual point to the end of the array
            points[idx].push(firstPoint.slice());
            data.setItemLayout(idx, points[idx]);
        });
    });
}
function isValidPoint(point) {
    return !isNaN(point[0]) && !isNaN(point[1]);
}
function getValueMissingPoint(coordSys) {
    // It is error-prone to input [NaN, NaN] into polygon, polygon.
    // (probably cause problem when refreshing or animating)
    return [
        coordSys.cx,
        coordSys.cy
    ];
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/sankey/SankeySeries.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SERIES_TYPE_SANKEY",
    ()=>SERIES_TYPE_SANKEY,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Series.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createGraphFromNodeEdge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createGraphFromNodeEdge.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$tooltip$2f$tooltipMarkup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/tooltip/tooltipMarkup.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/tokens.js [app-client] (ecmascript)");
;
;
;
;
;
;
var SERIES_TYPE_SANKEY = 'sankey';
var SankeySeriesModel = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(SankeySeriesModel, _super);
    function SankeySeriesModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = SankeySeriesModel.type;
        return _this;
    }
    /**
   * Init a graph data structure from data in option series
   */ SankeySeriesModel.prototype.getInitialData = function(option, ecModel) {
        var links = option.edges || option.links || [];
        var nodes = option.data || option.nodes || [];
        var levels = option.levels || [];
        this.levelModels = [];
        var levelModels = this.levelModels;
        for(var i = 0; i < levels.length; i++){
            if (levels[i].depth != null && levels[i].depth >= 0) {
                levelModels[levels[i].depth] = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](levels[i], this, ecModel);
            } else {
                if ("TURBOPACK compile-time truthy", 1) {
                    throw new Error('levels[i].depth is mandatory and should be natural number');
                }
            }
        }
        var graph = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createGraphFromNodeEdge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(nodes, links, this, true, beforeLink);
        return graph.data;
        //TURBOPACK unreachable
        ;
        function beforeLink(nodeData, edgeData) {
            nodeData.wrapMethod('getItemModel', function(model, idx) {
                var seriesModel = model.parentModel;
                var layout = seriesModel.getData().getItemLayout(idx);
                if (layout) {
                    var nodeDepth = layout.depth;
                    var levelModel = seriesModel.levelModels[nodeDepth];
                    if (levelModel) {
                        model.parentModel = levelModel;
                    }
                }
                return model;
            });
            edgeData.wrapMethod('getItemModel', function(model, idx) {
                var seriesModel = model.parentModel;
                var edge = seriesModel.getGraph().getEdgeByIndex(idx);
                var layout = edge.node1.getLayout();
                if (layout) {
                    var depth = layout.depth;
                    var levelModel = seriesModel.levelModels[depth];
                    if (levelModel) {
                        model.parentModel = levelModel;
                    }
                }
                return model;
            });
        }
    };
    SankeySeriesModel.prototype.setNodePosition = function(dataIndex, localPosition) {
        var nodes = this.option.data || this.option.nodes;
        var dataItem = nodes[dataIndex];
        dataItem.localX = localPosition[0];
        dataItem.localY = localPosition[1];
    };
    /**
   * Return the graphic data structure
   *
   * @return graphic data structure
   */ SankeySeriesModel.prototype.getGraph = function() {
        return this.getData().graph;
    };
    /**
   * Get edge data of graphic data structure
   *
   * @return data structure of list
   */ SankeySeriesModel.prototype.getEdgeData = function() {
        return this.getGraph().edgeData;
    };
    SankeySeriesModel.prototype.formatTooltip = function(dataIndex, multipleSeries, dataType) {
        function noValue(val) {
            return isNaN(val) || val == null;
        }
        // dataType === 'node' or empty do not show tooltip by default
        if (dataType === 'edge') {
            var params = this.getDataParams(dataIndex, dataType);
            var rawDataOpt = params.data;
            var edgeValue = params.value;
            var edgeName = rawDataOpt.source + ' -- ' + rawDataOpt.target;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$tooltip$2f$tooltipMarkup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createTooltipMarkup"])('nameValue', {
                name: edgeName,
                value: edgeValue,
                noValue: noValue(edgeValue)
            });
        } else {
            var node = this.getGraph().getNodeByIndex(dataIndex);
            var value = node.getLayout().value;
            var name_1 = this.getDataParams(dataIndex, dataType).data.name;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$tooltip$2f$tooltipMarkup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createTooltipMarkup"])('nameValue', {
                name: name_1 != null ? name_1 + '' : null,
                value: value,
                noValue: noValue(value)
            });
        }
    };
    SankeySeriesModel.prototype.optionUpdated = function() {};
    // Override Series.getDataParams()
    SankeySeriesModel.prototype.getDataParams = function(dataIndex, dataType) {
        var params = _super.prototype.getDataParams.call(this, dataIndex, dataType);
        if (params.value == null && dataType === 'node') {
            var node = this.getGraph().getNodeByIndex(dataIndex);
            var nodeValue = node.getLayout().value;
            params.value = nodeValue;
        }
        return params;
    };
    SankeySeriesModel.prototype.__ownRoamView = function() {
        return this.coordinateSystem;
    };
    SankeySeriesModel.type = 'series.' + SERIES_TYPE_SANKEY;
    SankeySeriesModel.layoutMode = 'box';
    SankeySeriesModel.defaultOption = {
        // zlevel: 0,
        z: 2,
        // `coordinateSystem` can be declared as 'matrix', 'calendar',
        //  which provides box layout container.
        coordinateSystemUsage: 'box',
        left: '5%',
        top: '5%',
        right: '20%',
        bottom: '5%',
        orient: 'horizontal',
        nodeWidth: 20,
        nodeGap: 8,
        draggable: true,
        layoutIterations: 32,
        // true | false | 'move' | 'scale', see module:component/helper/RoamController.
        roam: false,
        roamTrigger: 'global',
        center: null,
        zoom: 1,
        label: {
            show: true,
            position: 'right',
            fontSize: 12
        },
        edgeLabel: {
            show: false,
            fontSize: 12
        },
        levels: [],
        nodeAlign: 'justify',
        lineStyle: {
            color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.neutral50,
            opacity: 0.2,
            curveness: 0.5
        },
        emphasis: {
            label: {
                show: true
            },
            lineStyle: {
                opacity: 0.5
            }
        },
        select: {
            itemStyle: {
                borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.primary
            }
        },
        animationEasing: 'linear',
        animationDuration: 1000
    };
    return SankeySeriesModel;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = SankeySeriesModel;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/sankey/SankeyView.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Path$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Path.js [app-client] (ecmascript) <export default as Path>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rect$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Rect.js [app-client] (ecmascript) <export default as Rect>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Group$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Group.js [app-client] (ecmascript) <export default as Group>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$LinearGradient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LinearGradient$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/LinearGradient.js [app-client] (ecmascript) <export default as LinearGradient>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/animation/basicTransition.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/states.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$sankey$2f$SankeySeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/sankey/SankeySeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/view/Chart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/label/labelStyle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/innerStore.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$helper$2f$RoamController$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/helper/RoamController.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$View$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/View.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$helper$2f$roamHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/helper/roamHelper.js [app-client] (ecmascript)");
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
var SankeyPathShape = /** @class */ function() {
    function SankeyPathShape() {
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;
        this.cpx1 = 0;
        this.cpy1 = 0;
        this.cpx2 = 0;
        this.cpy2 = 0;
        this.extent = 0;
    }
    return SankeyPathShape;
}();
var SankeyPath = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(SankeyPath, _super);
    function SankeyPath(opts) {
        return _super.call(this, opts) || this;
    }
    SankeyPath.prototype.getDefaultShape = function() {
        return new SankeyPathShape();
    };
    SankeyPath.prototype.buildPath = function(ctx, shape) {
        var extent = shape.extent;
        ctx.moveTo(shape.x1, shape.y1);
        ctx.bezierCurveTo(shape.cpx1, shape.cpy1, shape.cpx2, shape.cpy2, shape.x2, shape.y2);
        if (shape.orient === 'vertical') {
            ctx.lineTo(shape.x2 + extent, shape.y2);
            ctx.bezierCurveTo(shape.cpx2 + extent, shape.cpy2, shape.cpx1 + extent, shape.cpy1, shape.x1 + extent, shape.y1);
        } else {
            ctx.lineTo(shape.x2, shape.y2 + extent);
            ctx.bezierCurveTo(shape.cpx2, shape.cpy2 + extent, shape.cpx1, shape.cpy1 + extent, shape.x1, shape.y1 + extent);
        }
        ctx.closePath();
    };
    SankeyPath.prototype.highlight = function() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enterEmphasis"])(this);
    };
    SankeyPath.prototype.downplay = function() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["leaveEmphasis"])(this);
    };
    return SankeyPath;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Path$3e$__["Path"]);
var SankeyView = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(SankeyView, _super);
    function SankeyView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$sankey$2f$SankeySeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_SANKEY"];
        _this._mainGroup = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Group$3e$__["Group"]();
        return _this;
    }
    SankeyView.prototype.init = function(ecModel, api) {
        this._controller = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$helper$2f$RoamController$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](api.getZr());
        this.group.add(this._mainGroup);
        this._firstRender = true;
    };
    SankeyView.prototype.render = function(seriesModel, ecModel, api) {
        var graph = seriesModel.getGraph();
        var mainGroup = this._mainGroup;
        var layoutInfo = seriesModel.layoutInfo;
        // view width
        var width = layoutInfo.width;
        // view height
        var height = layoutInfo.height;
        var nodeData = seriesModel.getData();
        var edgeData = seriesModel.getData('edge');
        var orient = seriesModel.get('orient');
        mainGroup.removeAll();
        mainGroup.x = layoutInfo.x;
        mainGroup.y = layoutInfo.y;
        this._updateViewCoordSys(seriesModel, api);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$helper$2f$roamHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateRoamControllerSimply"])(seriesModel, api, this._controller, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$helper$2f$roamHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createIsInSelfByPointerCheckerEl"])(mainGroup), null);
        // generate a bezire Curve for each edge
        graph.eachEdge(function(edge) {
            var curve = new SankeyPath();
            var ecData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getECData"])(curve);
            ecData.dataIndex = edge.dataIndex;
            ecData.seriesIndex = seriesModel.seriesIndex;
            ecData.dataType = 'edge';
            var edgeModel = edge.getModel();
            var lineStyleModel = edgeModel.getModel('lineStyle');
            var curvature = lineStyleModel.get('curveness');
            var n1Layout = edge.node1.getLayout();
            var node1Model = edge.node1.getModel();
            var dragX1 = node1Model.get('localX');
            var dragY1 = node1Model.get('localY');
            var n2Layout = edge.node2.getLayout();
            var node2Model = edge.node2.getModel();
            var dragX2 = node2Model.get('localX');
            var dragY2 = node2Model.get('localY');
            var edgeLayout = edge.getLayout();
            var x1;
            var y1;
            var x2;
            var y2;
            var cpx1;
            var cpy1;
            var cpx2;
            var cpy2;
            curve.shape.extent = Math.max(1, edgeLayout.dy);
            curve.shape.orient = orient;
            if (orient === 'vertical') {
                x1 = (dragX1 != null ? dragX1 * width : n1Layout.x) + edgeLayout.sy;
                y1 = (dragY1 != null ? dragY1 * height : n1Layout.y) + n1Layout.dy;
                x2 = (dragX2 != null ? dragX2 * width : n2Layout.x) + edgeLayout.ty;
                y2 = dragY2 != null ? dragY2 * height : n2Layout.y;
                cpx1 = x1;
                cpy1 = y1 * (1 - curvature) + y2 * curvature;
                cpx2 = x2;
                cpy2 = y1 * curvature + y2 * (1 - curvature);
            } else {
                x1 = (dragX1 != null ? dragX1 * width : n1Layout.x) + n1Layout.dx;
                y1 = (dragY1 != null ? dragY1 * height : n1Layout.y) + edgeLayout.sy;
                x2 = dragX2 != null ? dragX2 * width : n2Layout.x;
                y2 = (dragY2 != null ? dragY2 * height : n2Layout.y) + edgeLayout.ty;
                cpx1 = x1 * (1 - curvature) + x2 * curvature;
                cpy1 = y1;
                cpx2 = x1 * curvature + x2 * (1 - curvature);
                cpy2 = y2;
            }
            curve.setShape({
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
                cpx1: cpx1,
                cpy1: cpy1,
                cpx2: cpx2,
                cpy2: cpy2
            });
            curve.useStyle(lineStyleModel.getItemStyle());
            // Special color, use source node color or target node color
            applyCurveStyle(curve.style, orient, edge);
            var defaultEdgeLabelText = "" + edgeModel.get('value');
            var edgeLabelStateModels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLabelStatesModels"])(edgeModel, 'edgeLabel');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLabelStyle"])(curve, edgeLabelStateModels, {
                labelFetcher: {
                    getFormattedLabel: function(dataIndex, stateName, dataType, labelDimIndex, formatter, extendParams) {
                        return seriesModel.getFormattedLabel(dataIndex, stateName, 'edge', labelDimIndex, // ensure edgeLabel formatter is provided
                        // to prevent the inheritance from `label.formatter` of the series
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["retrieve3"])(formatter, edgeLabelStateModels.normal && edgeLabelStateModels.normal.get('formatter'), defaultEdgeLabelText), extendParams);
                    }
                },
                labelDataIndex: edge.dataIndex,
                defaultText: defaultEdgeLabelText
            });
            curve.setTextConfig({
                position: 'inside'
            });
            var emphasisModel = edgeModel.getModel('emphasis');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setStatesStylesFromModel"])(curve, edgeModel, 'lineStyle', function(model) {
                var style = model.getItemStyle();
                applyCurveStyle(style, orient, edge);
                return style;
            });
            mainGroup.add(curve);
            edgeData.setItemGraphicEl(edge.dataIndex, curve);
            var focus = emphasisModel.get('focus');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toggleHoverEmphasis"])(curve, focus === 'adjacency' ? edge.getAdjacentDataIndices() : focus === 'trajectory' ? edge.getTrajectoryDataIndices() : focus, emphasisModel.get('blurScope'), emphasisModel.get('disabled'));
        });
        // Generate a rect for each node
        graph.eachNode(function(node) {
            var layout = node.getLayout();
            var itemModel = node.getModel();
            var dragX = itemModel.get('localX');
            var dragY = itemModel.get('localY');
            var emphasisModel = itemModel.getModel('emphasis');
            var borderRadius = itemModel.get([
                'itemStyle',
                'borderRadius'
            ]) || 0;
            var rect = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rect$3e$__["Rect"]({
                shape: {
                    x: dragX != null ? dragX * width : layout.x,
                    y: dragY != null ? dragY * height : layout.y,
                    width: layout.dx,
                    height: layout.dy,
                    r: borderRadius
                },
                style: itemModel.getModel('itemStyle').getItemStyle(),
                z2: 10
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLabelStyle"])(rect, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLabelStatesModels"])(itemModel), {
                labelFetcher: {
                    getFormattedLabel: function(dataIndex, stateName) {
                        return seriesModel.getFormattedLabel(dataIndex, stateName, 'node');
                    }
                },
                labelDataIndex: node.dataIndex,
                defaultText: node.id
            });
            rect.disableLabelAnimation = true;
            rect.setStyle('fill', node.getVisual('color'));
            rect.setStyle('decal', node.getVisual('style').decal);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setStatesStylesFromModel"])(rect, itemModel);
            mainGroup.add(rect);
            nodeData.setItemGraphicEl(node.dataIndex, rect);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getECData"])(rect).dataType = 'node';
            var focus = emphasisModel.get('focus');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toggleHoverEmphasis"])(rect, focus === 'adjacency' ? node.getAdjacentDataIndices() : focus === 'trajectory' ? node.getTrajectoryDataIndices() : focus, emphasisModel.get('blurScope'), emphasisModel.get('disabled'));
        });
        nodeData.eachItemGraphicEl(function(el, dataIndex) {
            var itemModel = nodeData.getItemModel(dataIndex);
            if (itemModel.get('draggable')) {
                el.drift = function(dx, dy) {
                    // sankeyView._focusAdjacencyDisabled = true;
                    this.shape.x += dx;
                    this.shape.y += dy;
                    this.dirty();
                    api.dispatchAction({
                        type: 'dragNode',
                        seriesId: seriesModel.id,
                        dataIndex: nodeData.getRawIndex(dataIndex),
                        localX: this.shape.x / width,
                        localY: this.shape.y / height
                    });
                };
                // el.ondragend = function () {
                //     sankeyView._focusAdjacencyDisabled = false;
                // };
                el.draggable = true;
                el.cursor = 'move';
            }
        });
        if (!this._data && seriesModel.isAnimationEnabled()) {
            mainGroup.setClipPath(createGridClipShape(mainGroup.getBoundingRect(), seriesModel, function() {
                mainGroup.removeClipPath();
            }));
        }
        this._data = seriesModel.getData();
        this._firstRender = false;
    };
    SankeyView.prototype.__updateOnOwnRoam = function(payload, seriesModel, api) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$View$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyViewCoordSysTransToElement"])(this.group, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$View$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VIEW_COORD_SYS_TRANS_OVERALL"], seriesModel.coordinateSystem, null);
    };
    SankeyView.prototype.dispose = function() {
        this._controller && this._controller.dispose();
    };
    SankeyView.prototype._updateViewCoordSys = function(seriesModel, api) {
        var layoutInfo = seriesModel.layoutInfo;
        var ownCoordSys = seriesModel.coordinateSystem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$helper$2f$roamHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createViewCoordSysSimply"])(seriesModel, api, layoutInfo.x, layoutInfo.y, layoutInfo.width, layoutInfo.height);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$View$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyViewCoordSysTransToElement"])(this.group, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$View$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VIEW_COORD_SYS_TRANS_OVERALL"], ownCoordSys, this._firstRender ? null : seriesModel);
    };
    SankeyView.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$sankey$2f$SankeySeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_SANKEY"];
    return SankeyView;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
/**
 * Special color, use source node color or target node color
 * @param curveProps curve's style to parse
 * @param orient direction
 * @param edge current curve data
 */ function applyCurveStyle(curveProps, orient, edge) {
    switch(curveProps.fill){
        case 'source':
            curveProps.fill = edge.node1.getVisual('color');
            curveProps.decal = edge.node1.getVisual('style').decal;
            break;
        case 'target':
            curveProps.fill = edge.node2.getVisual('color');
            curveProps.decal = edge.node2.getVisual('style').decal;
            break;
        case 'gradient':
            var sourceColor = edge.node1.getVisual('color');
            var targetColor = edge.node2.getVisual('color');
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"])(sourceColor) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"])(targetColor)) {
                curveProps.fill = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$LinearGradient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LinearGradient$3e$__["LinearGradient"](0, 0, +(orient === 'horizontal'), +(orient === 'vertical'), [
                    {
                        color: sourceColor,
                        offset: 0
                    },
                    {
                        color: targetColor,
                        offset: 1
                    }
                ]);
            }
    }
}
// Add animation to the view
function createGridClipShape(rect, seriesModel, cb) {
    var rectEl = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rect$3e$__["Rect"]({
        shape: {
            x: rect.x - 10,
            y: rect.y - 10,
            width: 0,
            height: rect.height + 20
        }
    });
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initProps"](rectEl, {
        shape: {
            width: rect.width + 20
        }
    }, seriesModel, cb);
    return rectEl;
}
const __TURBOPACK__default__export__ = SankeyView;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/sankey/install.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "install",
    ()=>install
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$sankey$2f$SankeyView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/sankey/SankeyView.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$sankey$2f$SankeySeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/sankey/SankeySeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/types.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$helper$2f$roamHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/helper/roamHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$sankey$2f$sankeyLayout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/sankey/sankeyLayout.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$sankey$2f$sankeyVisual$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/sankey/sankeyVisual.js [app-client] (ecmascript)");
;
;
;
;
;
;
function install(registers) {
    registers.registerChartView(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$sankey$2f$SankeyView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
    registers.registerSeriesModel(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$sankey$2f$SankeySeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
    registers.registerLayout(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$sankey$2f$sankeyLayout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sankeyLayoutStageHandler"]);
    registers.registerVisual(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$sankey$2f$sankeyVisual$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sankeyVisualStageHandler"]);
    registers.registerAction({
        type: 'dragNode',
        event: 'dragnode',
        // here can only use 'update' now, other value is not support in echarts.
        update: 'update'
    }, function(payload, ecModel) {
        ecModel.eachComponent({
            mainType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COMPONENT_MAIN_TYPE_SERIES"],
            subType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$sankey$2f$SankeySeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_SANKEY"],
            query: payload
        }, function(seriesModel) {
            seriesModel.setNodePosition(payload.dataIndex, [
                payload.localX,
                payload.localY
            ]);
        });
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$helper$2f$roamHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerRoamActionSimply"])(registers, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COMPONENT_MAIN_TYPE_SERIES"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$sankey$2f$SankeySeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_SANKEY"]);
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/sankey/install.js [app-client] (ecmascript) <export install as SankeyChart>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SankeyChart",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$sankey$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["install"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$sankey$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/sankey/install.js [app-client] (ecmascript)");
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/sankey/sankeyLayout.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sankeyLayoutStageHandler",
    ()=>sankeyLayoutStageHandler
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$sankey$2f$SankeySeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/sankey/SankeySeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/layout.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-client] (ecmascript)");
;
;
;
;
;
var sankeyLayoutStageHandler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSimpleOverallStageHandler"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$sankey$2f$SankeySeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_SANKEY"], sankeyLayout);
function sankeyLayout(ecModel, api) {
    ecModel.eachSeriesByType(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$sankey$2f$SankeySeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_SANKEY"], function(seriesModel) {
        var nodeWidth = seriesModel.get('nodeWidth');
        var nodeGap = seriesModel.get('nodeGap');
        var refContainer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBoxLayoutReference"])(seriesModel, api).refContainer;
        var layoutInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLayoutRect"])(seriesModel.getBoxLayoutParams(), refContainer);
        seriesModel.layoutInfo = layoutInfo;
        var width = layoutInfo.width;
        var height = layoutInfo.height;
        var graph = seriesModel.getGraph();
        var nodes = graph.nodes;
        var edges = graph.edges;
        computeNodeValues(nodes);
        var filteredNodes = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"](nodes, function(node) {
            return node.getLayout().value === 0;
        });
        var iterations = filteredNodes.length !== 0 ? 0 : seriesModel.get('layoutIterations');
        var orient = seriesModel.get('orient');
        var nodeAlign = seriesModel.get('nodeAlign');
        layoutSankey(nodes, edges, nodeWidth, nodeGap, width, height, iterations, orient, nodeAlign);
    });
}
function layoutSankey(nodes, edges, nodeWidth, nodeGap, width, height, iterations, orient, nodeAlign) {
    computeNodeBreadths(nodes, edges, nodeWidth, width, height, orient, nodeAlign);
    computeNodeDepths(nodes, edges, height, width, nodeGap, iterations, orient);
    computeEdgeDepths(nodes, orient);
}
/**
 * Compute the value of each node by summing the associated edge's value
 */ function computeNodeValues(nodes) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](nodes, function(node) {
        var value1 = sum(node.outEdges, getEdgeValue);
        var value2 = sum(node.inEdges, getEdgeValue);
        var nodeRawValue = node.getValue() || 0;
        var value = Math.max(value1, value2, nodeRawValue);
        node.setLayout({
            value: value
        }, true);
    });
}
/**
 * Compute the x-position for each node.
 *
 * Here we use Kahn algorithm to detect cycle when we traverse
 * the node to computer the initial x position.
 */ function computeNodeBreadths(nodes, edges, nodeWidth, width, height, orient, nodeAlign) {
    // Used to mark whether the edge is deleted. if it is deleted,
    // the value is 0, otherwise it is 1.
    var remainEdges = [];
    // Storage each node's indegree.
    var indegreeArr = [];
    // Used to storage the node with indegree is equal to 0.
    var zeroIndegrees = [];
    var nextTargetNode = [];
    var x = 0;
    // let kx = 0;
    for(var i = 0; i < edges.length; i++){
        remainEdges[i] = 1;
    }
    for(var i = 0; i < nodes.length; i++){
        indegreeArr[i] = nodes[i].inEdges.length;
        if (indegreeArr[i] === 0) {
            zeroIndegrees.push(nodes[i]);
        }
    }
    var maxNodeDepth = -1;
    // Traversing nodes using topological sorting to calculate the
    // horizontal(if orient === 'horizontal') or vertical(if orient === 'vertical')
    // position of the nodes.
    while(zeroIndegrees.length){
        for(var idx = 0; idx < zeroIndegrees.length; idx++){
            var node = zeroIndegrees[idx];
            var item = node.hostGraph.data.getRawDataItem(node.dataIndex);
            var isItemDepth = item.depth != null && item.depth >= 0;
            if (isItemDepth && item.depth > maxNodeDepth) {
                maxNodeDepth = item.depth;
            }
            node.setLayout({
                depth: isItemDepth ? item.depth : x
            }, true);
            orient === 'vertical' ? node.setLayout({
                dy: nodeWidth
            }, true) : node.setLayout({
                dx: nodeWidth
            }, true);
            for(var edgeIdx = 0; edgeIdx < node.outEdges.length; edgeIdx++){
                var edge = node.outEdges[edgeIdx];
                var indexEdge = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indexOf"](edges, edge);
                remainEdges[indexEdge] = 0;
                var targetNode = edge.node2;
                var nodeIndex = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indexOf"](nodes, targetNode);
                if (--indegreeArr[nodeIndex] === 0 && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indexOf"](nextTargetNode, targetNode) < 0) {
                    nextTargetNode.push(targetNode);
                }
            }
        }
        ++x;
        zeroIndegrees = nextTargetNode;
        nextTargetNode = [];
    }
    for(var i = 0; i < remainEdges.length; i++){
        if (remainEdges[i] === 1) {
            throw new Error('Sankey is a DAG, the original data has cycle!');
        }
    }
    var maxDepth = maxNodeDepth > x - 1 ? maxNodeDepth : x - 1;
    if (nodeAlign && nodeAlign !== 'left') {
        adjustNodeWithNodeAlign(nodes, nodeAlign, orient, maxDepth);
    }
    var kx = orient === 'vertical' ? (height - nodeWidth) / maxDepth : (width - nodeWidth) / maxDepth;
    scaleNodeBreadths(nodes, kx, orient);
}
function isNodeDepth(node) {
    var item = node.hostGraph.data.getRawDataItem(node.dataIndex);
    return item.depth != null && item.depth >= 0;
}
function adjustNodeWithNodeAlign(nodes, nodeAlign, orient, maxDepth) {
    if (nodeAlign === 'right') {
        var nextSourceNode = [];
        var remainNodes = nodes;
        var nodeHeight = 0;
        while(remainNodes.length){
            for(var i = 0; i < remainNodes.length; i++){
                var node = remainNodes[i];
                node.setLayout({
                    skNodeHeight: nodeHeight
                }, true);
                for(var j = 0; j < node.inEdges.length; j++){
                    var edge = node.inEdges[j];
                    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indexOf"](nextSourceNode, edge.node1) < 0) {
                        nextSourceNode.push(edge.node1);
                    }
                }
            }
            remainNodes = nextSourceNode;
            nextSourceNode = [];
            ++nodeHeight;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](nodes, function(node) {
            if (!isNodeDepth(node)) {
                node.setLayout({
                    depth: Math.max(0, maxDepth - node.getLayout().skNodeHeight)
                }, true);
            }
        });
    } else if (nodeAlign === 'justify') {
        moveSinksRight(nodes, maxDepth);
    }
}
/**
 * All the node without outEgdes are assigned maximum x-position and
 *     be aligned in the last column.
 *
 * @param nodes.  node of sankey view.
 * @param maxDepth.  use to assign to node without outEdges as x-position.
 */ function moveSinksRight(nodes, maxDepth) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](nodes, function(node) {
        if (!isNodeDepth(node) && !node.outEdges.length) {
            node.setLayout({
                depth: maxDepth
            }, true);
        }
    });
}
/**
 * Scale node x-position to the width
 *
 * @param nodes  node of sankey view
 * @param kx   multiple used to scale nodes
 */ function scaleNodeBreadths(nodes, kx, orient) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](nodes, function(node) {
        var nodeDepth = node.getLayout().depth * kx;
        orient === 'vertical' ? node.setLayout({
            y: nodeDepth
        }, true) : node.setLayout({
            x: nodeDepth
        }, true);
    });
}
/**
 * Using Gauss-Seidel iterations method to compute the node depth(y-position)
 *
 * @param nodes  node of sankey view
 * @param edges  edge of sankey view
 * @param height  the whole height of the area to draw the view
 * @param nodeGap  the vertical distance between two nodes
 *     in the same column.
 * @param iterations  the number of iterations for the algorithm
 */ function computeNodeDepths(nodes, edges, height, width, nodeGap, iterations, orient) {
    var nodesByBreadth = prepareNodesByBreadth(nodes, orient);
    initializeNodeDepth(nodesByBreadth, edges, height, width, nodeGap, orient);
    resolveCollisions(nodesByBreadth, nodeGap, height, width, orient);
    for(var alpha = 1; iterations > 0; iterations--){
        // 0.99 is a experience parameter, ensure that each iterations of
        // changes as small as possible.
        alpha *= 0.99;
        relaxRightToLeft(nodesByBreadth, alpha, orient);
        resolveCollisions(nodesByBreadth, nodeGap, height, width, orient);
        relaxLeftToRight(nodesByBreadth, alpha, orient);
        resolveCollisions(nodesByBreadth, nodeGap, height, width, orient);
    }
}
function prepareNodesByBreadth(nodes, orient) {
    var nodesByBreadth = [];
    var keyAttr = orient === 'vertical' ? 'y' : 'x';
    var groupResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["groupData"])(nodes, function(node) {
        return node.getLayout()[keyAttr];
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asc"])(groupResult.keys);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](groupResult.keys, function(key) {
        nodesByBreadth.push(groupResult.buckets.get(key));
    });
    return nodesByBreadth;
}
/**
 * Compute the original y-position for each node
 */ function initializeNodeDepth(nodesByBreadth, edges, height, width, nodeGap, orient) {
    var minKy = Infinity;
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](nodesByBreadth, function(nodes) {
        var n = nodes.length;
        var sum = 0;
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](nodes, function(node) {
            sum += node.getLayout().value;
        });
        var ky = orient === 'vertical' ? (width - (n - 1) * nodeGap) / sum : (height - (n - 1) * nodeGap) / sum;
        if (ky < minKy) {
            minKy = ky;
        }
    });
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](nodesByBreadth, function(nodes) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](nodes, function(node, i) {
            var nodeDy = node.getLayout().value * minKy;
            if (orient === 'vertical') {
                node.setLayout({
                    x: i
                }, true);
                node.setLayout({
                    dx: nodeDy
                }, true);
            } else {
                node.setLayout({
                    y: i
                }, true);
                node.setLayout({
                    dy: nodeDy
                }, true);
            }
        });
    });
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](edges, function(edge) {
        var edgeDy = +edge.getValue() * minKy;
        edge.setLayout({
            dy: edgeDy
        }, true);
    });
}
/**
 * Resolve the collision of initialized depth (y-position)
 */ function resolveCollisions(nodesByBreadth, nodeGap, height, width, orient) {
    var keyAttr = orient === 'vertical' ? 'x' : 'y';
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](nodesByBreadth, function(nodes) {
        nodes.sort(function(a, b) {
            return a.getLayout()[keyAttr] - b.getLayout()[keyAttr];
        });
        var nodeX;
        var node;
        var dy;
        var y0 = 0;
        var n = nodes.length;
        var nodeDyAttr = orient === 'vertical' ? 'dx' : 'dy';
        for(var i = 0; i < n; i++){
            node = nodes[i];
            dy = y0 - node.getLayout()[keyAttr];
            if (dy > 0) {
                nodeX = node.getLayout()[keyAttr] + dy;
                orient === 'vertical' ? node.setLayout({
                    x: nodeX
                }, true) : node.setLayout({
                    y: nodeX
                }, true);
            }
            y0 = node.getLayout()[keyAttr] + node.getLayout()[nodeDyAttr] + nodeGap;
        }
        var viewWidth = orient === 'vertical' ? width : height;
        // If the bottommost node goes outside the bounds, push it back up
        dy = y0 - nodeGap - viewWidth;
        if (dy > 0) {
            nodeX = node.getLayout()[keyAttr] - dy;
            orient === 'vertical' ? node.setLayout({
                x: nodeX
            }, true) : node.setLayout({
                y: nodeX
            }, true);
            y0 = nodeX;
            for(var i = n - 2; i >= 0; --i){
                node = nodes[i];
                dy = node.getLayout()[keyAttr] + node.getLayout()[nodeDyAttr] + nodeGap - y0;
                if (dy > 0) {
                    nodeX = node.getLayout()[keyAttr] - dy;
                    orient === 'vertical' ? node.setLayout({
                        x: nodeX
                    }, true) : node.setLayout({
                        y: nodeX
                    }, true);
                }
                y0 = node.getLayout()[keyAttr];
            }
        }
    });
}
/**
 * Change the y-position of the nodes, except most the right side nodes
 * @param nodesByBreadth
 * @param alpha  parameter used to adjust the nodes y-position
 */ function relaxRightToLeft(nodesByBreadth, alpha, orient) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](nodesByBreadth.slice().reverse(), function(nodes) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](nodes, function(node) {
            if (node.outEdges.length) {
                var y = sum(node.outEdges, weightedTarget, orient) / sum(node.outEdges, getEdgeValue);
                if (isNaN(y)) {
                    var len = node.outEdges.length;
                    y = len ? sum(node.outEdges, centerTarget, orient) / len : 0;
                }
                if (orient === 'vertical') {
                    var nodeX = node.getLayout().x + (y - center(node, orient)) * alpha;
                    node.setLayout({
                        x: nodeX
                    }, true);
                } else {
                    var nodeY = node.getLayout().y + (y - center(node, orient)) * alpha;
                    node.setLayout({
                        y: nodeY
                    }, true);
                }
            }
        });
    });
}
function weightedTarget(edge, orient) {
    return center(edge.node2, orient) * edge.getValue();
}
function centerTarget(edge, orient) {
    return center(edge.node2, orient);
}
function weightedSource(edge, orient) {
    return center(edge.node1, orient) * edge.getValue();
}
function centerSource(edge, orient) {
    return center(edge.node1, orient);
}
function center(node, orient) {
    return orient === 'vertical' ? node.getLayout().x + node.getLayout().dx / 2 : node.getLayout().y + node.getLayout().dy / 2;
}
function getEdgeValue(edge) {
    return edge.getValue();
}
function sum(array, cb, orient) {
    var sum = 0;
    var len = array.length;
    var i = -1;
    while(++i < len){
        var value = +cb(array[i], orient);
        if (!isNaN(value)) {
            sum += value;
        }
    }
    return sum;
}
/**
 * Change the y-position of the nodes, except most the left side nodes
 */ function relaxLeftToRight(nodesByBreadth, alpha, orient) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](nodesByBreadth, function(nodes) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](nodes, function(node) {
            if (node.inEdges.length) {
                var y = sum(node.inEdges, weightedSource, orient) / sum(node.inEdges, getEdgeValue);
                if (isNaN(y)) {
                    var len = node.inEdges.length;
                    y = len ? sum(node.inEdges, centerSource, orient) / len : 0;
                }
                if (orient === 'vertical') {
                    var nodeX = node.getLayout().x + (y - center(node, orient)) * alpha;
                    node.setLayout({
                        x: nodeX
                    }, true);
                } else {
                    var nodeY = node.getLayout().y + (y - center(node, orient)) * alpha;
                    node.setLayout({
                        y: nodeY
                    }, true);
                }
            }
        });
    });
}
/**
 * Compute the depth(y-position) of each edge
 */ function computeEdgeDepths(nodes, orient) {
    var keyAttr = orient === 'vertical' ? 'x' : 'y';
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](nodes, function(node) {
        node.outEdges.sort(function(a, b) {
            return a.node2.getLayout()[keyAttr] - b.node2.getLayout()[keyAttr];
        });
        node.inEdges.sort(function(a, b) {
            return a.node1.getLayout()[keyAttr] - b.node1.getLayout()[keyAttr];
        });
    });
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](nodes, function(node) {
        var sy = 0;
        var ty = 0;
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](node.outEdges, function(edge) {
            edge.setLayout({
                sy: sy
            }, true);
            sy += edge.getLayout().dy;
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](node.inEdges, function(edge) {
            edge.setLayout({
                ty: ty
            }, true);
            ty += edge.getLayout().dy;
        });
    });
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/sankey/sankeyVisual.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sankeyVisualStageHandler",
    ()=>sankeyVisualStageHandler
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$VisualMapping$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/VisualMapping.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$sankey$2f$SankeySeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/sankey/SankeySeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
;
;
;
;
var sankeyVisualStageHandler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSimpleOverallStageHandler"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$sankey$2f$SankeySeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_SANKEY"], sankeyVisual);
function sankeyVisual(ecModel) {
    ecModel.eachSeriesByType(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$sankey$2f$SankeySeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_SANKEY"], function(seriesModel) {
        var graph = seriesModel.getGraph();
        var nodes = graph.nodes;
        var edges = graph.edges;
        if (nodes.length) {
            var minValue_1 = Infinity;
            var maxValue_1 = -Infinity;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](nodes, function(node) {
                var nodeValue = node.getLayout().value;
                if (nodeValue < minValue_1) {
                    minValue_1 = nodeValue;
                }
                if (nodeValue > maxValue_1) {
                    maxValue_1 = nodeValue;
                }
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](nodes, function(node) {
                var mapping = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$VisualMapping$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]({
                    type: 'color',
                    mappingMethod: 'linear',
                    dataExtent: [
                        minValue_1,
                        maxValue_1
                    ],
                    visual: seriesModel.get('color')
                });
                var mapValueToColor = mapping.mapValueToVisual(node.getLayout().value);
                var customColor = node.getModel().get([
                    'itemStyle',
                    'color'
                ]);
                if (customColor != null) {
                    node.setVisual('color', customColor);
                    node.setVisual('style', {
                        fill: customColor
                    });
                } else {
                    node.setVisual('color', mapValueToColor);
                    node.setVisual('style', {
                        fill: mapValueToColor
                    });
                }
            });
        }
        if (edges.length) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](edges, function(edge) {
                var edgeStyle = edge.getModel().get('lineStyle');
                edge.setVisual('style', edgeStyle);
            });
        }
    });
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/scatter/ScatterSeries.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createSeriesData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createSeriesData.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Series.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/tokens.js [app-client] (ecmascript)");
;
;
;
;
var ScatterSeriesModel = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(ScatterSeriesModel, _super);
    function ScatterSeriesModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = ScatterSeriesModel.type;
        _this.hasSymbolVisual = true;
        return _this;
    }
    ScatterSeriesModel.prototype.getInitialData = function(option, ecModel) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createSeriesData$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(null, this, {
            useEncodeDefaulter: true
        });
    };
    ScatterSeriesModel.prototype.getProgressive = function() {
        var progressive = this.option.progressive;
        if (progressive == null) {
            // PENDING
            return this.option.large ? 5e3 : this.get('progressive');
        }
        return progressive;
    };
    ScatterSeriesModel.prototype.getProgressiveThreshold = function() {
        var progressiveThreshold = this.option.progressiveThreshold;
        if (progressiveThreshold == null) {
            // PENDING
            return this.option.large ? 1e4 : this.get('progressiveThreshold');
        }
        return progressiveThreshold;
    };
    ScatterSeriesModel.prototype.brushSelector = function(dataIndex, data, selectors) {
        return selectors.point(data.getItemLayout(dataIndex));
    };
    ScatterSeriesModel.prototype.getZLevelKey = function() {
        // PENDING: See `GET_ZLEVEL_KEY_FOR_PROGRESSIVE`
        return this.getData().count() > this.getProgressiveThreshold() ? this.id : '';
    };
    ScatterSeriesModel.type = 'series.scatter';
    ScatterSeriesModel.dependencies = [
        'grid',
        'polar',
        'geo',
        'singleAxis',
        'calendar',
        'matrix'
    ];
    ScatterSeriesModel.defaultOption = {
        coordinateSystem: 'cartesian2d',
        // zlevel: 0,
        z: 2,
        legendHoverLink: true,
        symbolSize: 10,
        // symbolRotate: null,
        large: false,
        // Available when large is true
        largeThreshold: 2000,
        // cursor: null,
        itemStyle: {
            opacity: 0.8
        },
        emphasis: {
            scale: true
        },
        clip: true,
        select: {
            itemStyle: {
                borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.primary
            }
        },
        universalTransition: {
            divideShape: 'clone'
        }
    };
    return ScatterSeriesModel;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = ScatterSeriesModel;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/scatter/ScatterView.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$SymbolDraw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/SymbolDraw.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$LargeSymbolDraw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/LargeSymbolDraw.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$layout$2f$points$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/layout/points.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/view/Chart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createClipPathFromCoordSys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createClipPathFromCoordSys.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
var ScatterView = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(ScatterView, _super);
    function ScatterView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = ScatterView.type;
        return _this;
    }
    ScatterView.prototype.render = function(seriesModel, ecModel, api) {
        var data = seriesModel.getData();
        var symbolDraw = this._updateSymbolDraw(data, seriesModel);
        symbolDraw.updateData(data, createSymbolDrawOpt(seriesModel));
        this._finished = true;
    };
    ScatterView.prototype.incrementalPrepareRender = function(seriesModel, ecModel, api) {
        var data = seriesModel.getData();
        var symbolDraw = this._updateSymbolDraw(data, seriesModel);
        symbolDraw.incrementalPrepareUpdate(data);
        this._finished = false;
    };
    ScatterView.prototype.incrementalRender = function(taskParams, seriesModel, ecModel) {
        this._symbolDraw.incrementalUpdate(taskParams, seriesModel.getData(), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getIncrementalId"])(seriesModel), createSymbolDrawOpt(seriesModel));
        this._finished = taskParams.end === seriesModel.getData().count();
    };
    /**
   * See also VIEW_COORD_SYS_ANIMATION
   */ ScatterView.prototype.updateTransform = function(seriesModel, ecModel, api) {
        var data = seriesModel.getData();
        // Must mark group dirty and make sure the incremental layer will be cleared
        // PENDING
        this.group.dirty();
        if (!this._finished) {
            // FIXME: _finished checking is unnecessary?
            return {
                update: true
            };
        } else {
            var res = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$layout$2f$points$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('').reset(seriesModel, ecModel, api);
            if (res.progress) {
                res.progress({
                    start: 0,
                    end: data.count(),
                    count: data.count()
                }, data);
            }
            this._symbolDraw.updateLayout(createSymbolDrawOpt(seriesModel));
        }
    };
    ScatterView.prototype.eachRendered = function(cb) {
        this._symbolDraw && this._symbolDraw.eachRendered(cb);
    };
    ScatterView.prototype._updateSymbolDraw = function(data, seriesModel) {
        var symbolDraw = this._symbolDraw;
        var pipelineContext = seriesModel.pipelineContext;
        var isLargeDraw = pipelineContext.large;
        if (!symbolDraw || isLargeDraw !== this._isLargeDraw) {
            symbolDraw && symbolDraw.remove();
            symbolDraw = this._symbolDraw = isLargeDraw ? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$LargeSymbolDraw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]() : new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$SymbolDraw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]();
            this._isLargeDraw = isLargeDraw;
            this.group.removeAll();
        }
        this.group.add(symbolDraw.group);
        return symbolDraw;
    };
    ScatterView.prototype.remove = function(ecModel, api) {
        this._symbolDraw && this._symbolDraw.remove(true);
        this._symbolDraw = null;
    };
    ScatterView.prototype.dispose = function() {};
    ScatterView.type = 'scatter';
    return ScatterView;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
function createSymbolDrawOpt(seriesModel) {
    return {
        // TODO
        // If this parameter should be a shape or a bounding volume
        // shape will be more general.
        // But bounding volume like bounding rect will be much faster in the contain calculation
        clipShape: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createClipPathFromCoordSys$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCoordSysClipAreaSimply"])(seriesModel)
    };
}
const __TURBOPACK__default__export__ = ScatterView;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/scatter/install.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "install",
    ()=>install,
    "installScatterJitter",
    ()=>installScatterJitter
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$extension$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/extension.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$scatter$2f$ScatterSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/scatter/ScatterSeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$scatter$2f$ScatterView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/scatter/ScatterView.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$grid$2f$installSimple$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/grid/installSimple.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$layout$2f$points$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/layout/points.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$scatter$2f$jitterLayout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/scatter/jitterLayout.js [app-client] (ecmascript)");
;
;
;
;
;
;
function install(registers) {
    // In case developer forget to include grid component
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$extension$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$grid$2f$installSimple$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["install"]);
    registers.registerSeriesModel(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$scatter$2f$ScatterSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
    registers.registerChartView(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$scatter$2f$ScatterView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
    registers.registerLayout((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$layout$2f$points$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('scatter'));
}
function installScatterJitter(registers) {
    registers.registerLayout(registers.PRIORITY.VISUAL.POST_CHART_LAYOUT, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$scatter$2f$jitterLayout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])());
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/scatter/install.js [app-client] (ecmascript) <export install as ScatterChart>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScatterChart",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$scatter$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["install"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$scatter$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/scatter/install.js [app-client] (ecmascript)");
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/scatter/jitterLayout.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>jitterLayout
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$jitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/jitter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createRenderPlanner$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createRenderPlanner.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$GridModel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/cartesian/GridModel.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$single$2f$AxisModel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/single/AxisModel.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
;
;
;
;
;
function jitterLayout() {
    return {
        seriesType: 'scatter',
        plan: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createRenderPlanner$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(),
        reset: function(seriesModel) {
            var coordSys = seriesModel.coordinateSystem;
            if (!coordSys || coordSys.type !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$GridModel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COORD_SYS_TYPE_CARTESIAN_2D"] && coordSys.type !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$single$2f$AxisModel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COORD_SYS_TYPE_SINGLE"]) {
                return;
            }
            var baseAxis = coordSys.getBaseAxis && coordSys.getBaseAxis();
            var hasJitter = baseAxis && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$jitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["needFixJitter"])(seriesModel, baseAxis);
            if (!hasJitter) {
                return;
            }
            var dim = baseAxis.dim;
            var orient = baseAxis.orient;
            var isSingleY = orient === 'horizontal' && baseAxis.type !== 'category' || orient === 'vertical' && baseAxis.type === 'category';
            var jitterOnY = dim === 'y' || dim === 'single' && isSingleY;
            var jitterOnX = dim === 'x' || dim === 'single' && !isSingleY;
            if (!jitterOnY && !jitterOnX) {
                return;
            }
            return {
                progress: function(params, data) {
                    var points = data.getLayout('points');
                    var hasPoints = !!points;
                    if ("TURBOPACK compile-time truthy", 1) {
                        hasPoints && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateUpstreamOutputRange"])(data.getLayout('pointsRange'), params);
                    }
                    for(var i = params.start; i < params.end; i++){
                        var offset = hasPoints ? (i - params.start) * 2 : -1;
                        var layout = hasPoints ? [
                            points[offset],
                            points[offset + 1]
                        ] : data.getItemLayout(i);
                        if (!layout) {
                            continue;
                        }
                        var rawSize = data.getItemVisual(i, 'symbolSize');
                        var size = rawSize instanceof Array ? (rawSize[1] + rawSize[0]) / 2 : rawSize;
                        if (jitterOnY) {
                            // x is fixed, and y is floating
                            var jittered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$jitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fixJitter"])(baseAxis, layout[0], layout[1], size / 2);
                            if (hasPoints) {
                                points[offset + 1] = jittered;
                            } else {
                                layout[1] = jittered;
                            }
                        } else if (jitterOnX) {
                            // y is fixed, and x is floating
                            var jittered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$jitter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fixJitter"])(baseAxis, layout[1], layout[0], size / 2);
                            if (hasPoints) {
                                points[offset] = jittered;
                            } else {
                                layout[0] = jittered;
                            }
                        }
                    }
                }
            };
        }
    };
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/tree/TreeSeries.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SERIES_TYPE_TREE",
    ()=>SERIES_TYPE_TREE,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Series.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Tree$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/Tree.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$tooltip$2f$tooltipMarkup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/tooltip/tooltipMarkup.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$treeHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/treeHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/tokens.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
var SERIES_TYPE_TREE = 'tree';
var TreeSeriesModel = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(TreeSeriesModel, _super);
    function TreeSeriesModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = TreeSeriesModel.type;
        _this.hasSymbolVisual = true;
        // Do it self.
        _this.ignoreStyleOnData = true;
        return _this;
    }
    /**
   * Init a tree data structure from data in option series
   */ TreeSeriesModel.prototype.getInitialData = function(option) {
        // create a virtual root
        var root = {
            name: option.name,
            children: option.data
        };
        var leaves = option.leaves || {};
        var leavesModel = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](leaves, this, this.ecModel);
        var tree = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Tree$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createTree(root, this, beforeLink);
        function beforeLink(nodeData) {
            nodeData.wrapMethod('getItemModel', function(model, idx) {
                var node = tree.getNodeByDataIndex(idx);
                if (!(node && node.children.length && node.isExpand)) {
                    model.parentModel = leavesModel;
                }
                return model;
            });
        }
        var treeDepth = 0;
        tree.eachNode('preorder', function(node) {
            if (node.depth > treeDepth) {
                treeDepth = node.depth;
            }
        });
        var expandAndCollapse = option.expandAndCollapse;
        var expandTreeDepth = expandAndCollapse && option.initialTreeDepth >= 0 ? option.initialTreeDepth : treeDepth;
        tree.root.eachNode('preorder', function(node) {
            var item = node.hostTree.data.getRawDataItem(node.dataIndex);
            // Add item.collapsed != null, because users can collapse node original in the series.data.
            node.isExpand = item && item.collapsed != null ? !item.collapsed : node.depth <= expandTreeDepth;
        });
        return tree.data;
    };
    /**
   * Make the configuration 'orient' backward compatibly, with 'horizontal = LR', 'vertical = TB'.
   * @returns {string} orient
   */ TreeSeriesModel.prototype.getOrient = function() {
        var orient = this.get('orient');
        if (orient === 'horizontal') {
            orient = 'LR';
        } else if (orient === 'vertical') {
            orient = 'TB';
        }
        return orient;
    };
    TreeSeriesModel.prototype.formatTooltip = function(dataIndex, multipleSeries, dataType) {
        var tree = this.getData().tree;
        var realRoot = tree.root.children[0];
        var node = tree.getNodeByDataIndex(dataIndex);
        var value = node.getValue();
        var name = node.name;
        while(node && node !== realRoot){
            name = node.parentNode.name + '.' + name;
            node = node.parentNode;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$tooltip$2f$tooltipMarkup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createTooltipMarkup"])('nameValue', {
            name: name,
            value: value,
            noValue: isNaN(value) || value == null
        });
    };
    // Add tree path to tooltip param
    TreeSeriesModel.prototype.getDataParams = function(dataIndex) {
        var params = _super.prototype.getDataParams.apply(this, arguments);
        var node = this.getData().tree.getNodeByDataIndex(dataIndex);
        params.treeAncestors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$treeHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wrapTreePathInfo"])(node, this);
        params.collapsed = !node.isExpand;
        return params;
    };
    TreeSeriesModel.prototype.__ownRoamView = function() {
        return this.coordinateSystem;
    };
    TreeSeriesModel.type = 'series.' + SERIES_TYPE_TREE;
    // can support the position parameters 'left', 'top','right','bottom', 'width',
    // 'height' in the setOption() with 'merge' mode normal.
    TreeSeriesModel.layoutMode = 'box';
    TreeSeriesModel.defaultOption = {
        // zlevel: 0,
        z: 2,
        // `coordinateSystem` can be declared as 'matrix', 'calendar',
        //  which provides box layout container.
        coordinateSystemUsage: 'box',
        // the position of the whole view
        left: '12%',
        top: '12%',
        right: '12%',
        bottom: '12%',
        // the layout of the tree, two value can be selected, 'orthogonal' or 'radial'
        layout: 'orthogonal',
        // value can be 'polyline'
        edgeShape: 'curve',
        edgeForkPosition: '50%',
        // true | false | 'move' | 'scale', see module:component/helper/RoamController.
        roam: false,
        roamTrigger: 'global',
        // Symbol size scale ratio in roam
        nodeScaleRatio: 0.4,
        // Default on center of graph
        center: null,
        zoom: 1,
        orient: 'LR',
        symbol: 'emptyCircle',
        symbolSize: 7,
        expandAndCollapse: true,
        initialTreeDepth: 2,
        lineStyle: {
            color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.borderTint,
            width: 1.5,
            curveness: 0.5
        },
        itemStyle: {
            color: 'lightsteelblue',
            // borderColor: '#c23531',
            borderWidth: 1.5
        },
        label: {
            show: true
        },
        animationEasing: 'linear',
        animationDuration: 700,
        animationDurationUpdate: 500
    };
    return TreeSeriesModel;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = TreeSeriesModel;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/tree/TreeView.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Group$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Group.js [app-client] (ecmascript) <export default as Group>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/animation/basicTransition.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$BezierCurve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BezierCurve$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/BezierCurve.js [app-client] (ecmascript) <export default as BezierCurve>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/innerStore.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$Symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/Symbol.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$layoutHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/tree/layoutHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$bbox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/bbox.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$View$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/View.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$helper$2f$RoamController$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/helper/RoamController.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/view/Chart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$TreeSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/tree/TreeSeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Path.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/states.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/tokens.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$helper$2f$roamHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/helper/roamHelper.js [app-client] (ecmascript)");
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
var TreeEdgeShape = /** @class */ function() {
    function TreeEdgeShape() {
        this.parentPoint = [];
        this.childPoints = [];
    }
    return TreeEdgeShape;
}();
var TreePath = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(TreePath, _super);
    function TreePath(opts) {
        return _super.call(this, opts) || this;
    }
    TreePath.prototype.getDefaultStyle = function() {
        return {
            stroke: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.neutral99,
            fill: null
        };
    };
    TreePath.prototype.getDefaultShape = function() {
        return new TreeEdgeShape();
    };
    TreePath.prototype.buildPath = function(ctx, shape) {
        var childPoints = shape.childPoints;
        var childLen = childPoints.length;
        var parentPoint = shape.parentPoint;
        var firstChildPos = childPoints[0];
        var lastChildPos = childPoints[childLen - 1];
        if (childLen === 1) {
            ctx.moveTo(parentPoint[0], parentPoint[1]);
            ctx.lineTo(firstChildPos[0], firstChildPos[1]);
            return;
        }
        var orient = shape.orient;
        var forkDim = orient === 'TB' || orient === 'BT' ? 0 : 1;
        var otherDim = 1 - forkDim;
        var forkPosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(shape.forkPosition, 1);
        var tmpPoint = [];
        tmpPoint[forkDim] = parentPoint[forkDim];
        tmpPoint[otherDim] = parentPoint[otherDim] + (lastChildPos[otherDim] - parentPoint[otherDim]) * forkPosition;
        ctx.moveTo(parentPoint[0], parentPoint[1]);
        ctx.lineTo(tmpPoint[0], tmpPoint[1]);
        ctx.moveTo(firstChildPos[0], firstChildPos[1]);
        tmpPoint[forkDim] = firstChildPos[forkDim];
        ctx.lineTo(tmpPoint[0], tmpPoint[1]);
        tmpPoint[forkDim] = lastChildPos[forkDim];
        ctx.lineTo(tmpPoint[0], tmpPoint[1]);
        ctx.lineTo(lastChildPos[0], lastChildPos[1]);
        for(var i = 1; i < childLen - 1; i++){
            var point = childPoints[i];
            ctx.moveTo(point[0], point[1]);
            tmpPoint[forkDim] = point[forkDim];
            ctx.lineTo(tmpPoint[0], tmpPoint[1]);
        }
    };
    return TreePath;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
var TreeView = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(TreeView, _super);
    function TreeView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$TreeSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_TREE"];
        _this._mainGroup = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Group$3e$__["Group"]();
        return _this;
    }
    TreeView.prototype.init = function(ecModel, api) {
        this._controller = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$helper$2f$RoamController$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](api.getZr());
        this.group.add(this._mainGroup);
        this._firstRender = true;
    };
    TreeView.prototype.render = function(seriesModel, ecModel, api) {
        var data = seriesModel.getData();
        var layoutInfo = seriesModel.layoutInfo;
        var group = this._mainGroup;
        var layout = seriesModel.get('layout');
        if (layout === 'radial') {
            group.x = layoutInfo.x + layoutInfo.width / 2;
            group.y = layoutInfo.y + layoutInfo.height / 2;
        } else {
            group.x = layoutInfo.x;
            group.y = layoutInfo.y;
        }
        this._updateViewCoordSys(seriesModel, api);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$helper$2f$roamHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateRoamControllerSimply"])(seriesModel, api, this._controller, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$helper$2f$roamHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createIsInSelfByPointerCheckerEl"])(this.group), null);
        var oldData = this._data;
        data.diff(oldData).add(function(newIdx) {
            if (symbolNeedsDraw(data, newIdx)) {
                // Create node and edge
                updateNode(data, newIdx, null, group, seriesModel);
            }
        }).update(function(newIdx, oldIdx) {
            var symbolEl = oldData.getItemGraphicEl(oldIdx);
            if (!symbolNeedsDraw(data, newIdx)) {
                symbolEl && removeNode(oldData, oldIdx, symbolEl, group, seriesModel);
                return;
            }
            // Update node and edge
            updateNode(data, newIdx, symbolEl, group, seriesModel);
        }).remove(function(oldIdx) {
            var symbolEl = oldData.getItemGraphicEl(oldIdx);
            // When remove a collapsed node of subtree, since the collapsed
            // node haven't been initialized with a symbol element,
            // you can't found it's symbol element through index.
            // so if we want to remove the symbol element we should insure
            // that the symbol element is not null.
            if (symbolEl) {
                removeNode(oldData, oldIdx, symbolEl, group, seriesModel);
            }
        }).execute();
        this._updateNodeAndLinkScale(seriesModel);
        if (seriesModel.get('expandAndCollapse') === true) {
            data.eachItemGraphicEl(function(el, dataIndex) {
                el.off('click').on('click', function() {
                    api.dispatchAction({
                        type: 'treeExpandAndCollapse',
                        seriesId: seriesModel.id,
                        dataIndex: dataIndex
                    });
                });
            });
        }
        this._data = data;
        this._firstRender = false;
    };
    TreeView.prototype.__updateOnOwnRoam = function(payload, seriesModel, api) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$View$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyViewCoordSysTransToElement"])(this.group, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$View$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VIEW_COORD_SYS_TRANS_OVERALL"], seriesModel.coordinateSystem, null);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$helper$2f$roamHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRoamPayloadHasZoom"])(payload)) {
            this._updateNodeAndLinkScale(seriesModel);
        }
    };
    TreeView.prototype._updateViewCoordSys = function(seriesModel, api) {
        var data = seriesModel.getData();
        var points = [];
        data.each(function(idx) {
            var layout = data.getItemLayout(idx);
            if (layout && !isNaN(layout.x) && !isNaN(layout.y)) {
                points.push([
                    +layout.x,
                    +layout.y
                ]);
            }
        });
        var min = [];
        var max = [];
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$bbox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromPoints"](points, min, max);
        // If don't Store min max when collapse the root node after roam,
        // the root node will disappear.
        var oldMin = this._min;
        var oldMax = this._max;
        // If width or height is 0
        if (max[0] - min[0] === 0) {
            min[0] = oldMin ? oldMin[0] : min[0] - 1;
            max[0] = oldMax ? oldMax[0] : max[0] + 1;
        }
        if (max[1] - min[1] === 0) {
            min[1] = oldMin ? oldMin[1] : min[1] - 1;
            max[1] = oldMax ? oldMax[1] : max[1] + 1;
        }
        // Here we use viewCoordSys just for computing the 'position' and 'scale' of the group,
        // and 'treeRoam' action.
        var ownCoordSys = seriesModel.coordinateSystem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$helper$2f$roamHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createViewCoordSysSimply"])(seriesModel, api, min[0], min[1], max[0] - min[0], max[1] - min[1]);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$View$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyViewCoordSysTransToElement"])(this.group, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$View$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VIEW_COORD_SYS_TRANS_OVERALL"], ownCoordSys, this._firstRender ? null : seriesModel);
        this._min = min;
        this._max = max;
    };
    TreeView.prototype._updateNodeAndLinkScale = function(seriesModel) {
        var data = seriesModel.getData();
        var nodeScale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$View$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calcCompensationScaleToPreserveNodeSize"])(seriesModel.coordinateSystem, seriesModel);
        data.eachItemGraphicEl(function(el, idx) {
            el.setSymbolScale(nodeScale);
        });
    };
    TreeView.prototype.dispose = function() {
        this._controller && this._controller.dispose();
    };
    TreeView.prototype.remove = function() {
        this._mainGroup.removeAll();
        this._data = null;
    };
    TreeView.type = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$TreeSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_TREE"];
    return TreeView;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
function symbolNeedsDraw(data, dataIndex) {
    var layout = data.getItemLayout(dataIndex);
    return layout && !isNaN(layout.x) && !isNaN(layout.y);
}
function updateNode(data, dataIndex, symbolEl, group, seriesModel) {
    var isInit = !symbolEl;
    var node = data.tree.getNodeByDataIndex(dataIndex);
    var itemModel = node.getModel();
    var visualColor = node.getVisual('style').fill;
    var symbolInnerColor = node.isExpand === false && node.children.length !== 0 ? visualColor : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.neutral00;
    var virtualRoot = data.tree.root;
    var source = node.parentNode === virtualRoot ? node : node.parentNode || node;
    var sourceSymbolEl = data.getItemGraphicEl(source.dataIndex);
    var sourceLayout = source.getLayout();
    var sourceOldLayout = sourceSymbolEl ? {
        x: sourceSymbolEl.__oldX,
        y: sourceSymbolEl.__oldY,
        rawX: sourceSymbolEl.__radialOldRawX,
        rawY: sourceSymbolEl.__radialOldRawY
    } : sourceLayout;
    var targetLayout = node.getLayout();
    if (isInit) {
        symbolEl = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$Symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](data, dataIndex, null, {
            symbolInnerColor: symbolInnerColor,
            useNameLabel: true
        });
        symbolEl.x = sourceOldLayout.x;
        symbolEl.y = sourceOldLayout.y;
    } else {
        symbolEl.updateData(data, dataIndex, null, {
            symbolInnerColor: symbolInnerColor,
            useNameLabel: true
        });
    }
    symbolEl.__radialOldRawX = symbolEl.__radialRawX;
    symbolEl.__radialOldRawY = symbolEl.__radialRawY;
    symbolEl.__radialRawX = targetLayout.rawX;
    symbolEl.__radialRawY = targetLayout.rawY;
    group.add(symbolEl);
    data.setItemGraphicEl(dataIndex, symbolEl);
    symbolEl.__oldX = symbolEl.x;
    symbolEl.__oldY = symbolEl.y;
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProps"](symbolEl, {
        x: targetLayout.x,
        y: targetLayout.y
    }, seriesModel);
    var symbolPath = symbolEl.getSymbolPath();
    if (seriesModel.get('layout') === 'radial') {
        var realRoot = virtualRoot.children[0];
        var rootLayout = realRoot.getLayout();
        var length_1 = realRoot.children.length;
        var rad = void 0;
        var isLeft = void 0;
        if (targetLayout.x === rootLayout.x && node.isExpand === true && realRoot.children.length) {
            var center = {
                x: (realRoot.children[0].getLayout().x + realRoot.children[length_1 - 1].getLayout().x) / 2,
                y: (realRoot.children[0].getLayout().y + realRoot.children[length_1 - 1].getLayout().y) / 2
            };
            rad = Math.atan2(center.y - rootLayout.y, center.x - rootLayout.x);
            if (rad < 0) {
                rad = Math.PI * 2 + rad;
            }
            isLeft = center.x < rootLayout.x;
            if (isLeft) {
                rad = rad - Math.PI;
            }
        } else {
            rad = Math.atan2(targetLayout.y - rootLayout.y, targetLayout.x - rootLayout.x);
            if (rad < 0) {
                rad = Math.PI * 2 + rad;
            }
            if (node.children.length === 0 || node.children.length !== 0 && node.isExpand === false) {
                isLeft = targetLayout.x < rootLayout.x;
                if (isLeft) {
                    rad = rad - Math.PI;
                }
            } else {
                isLeft = targetLayout.x > rootLayout.x;
                if (!isLeft) {
                    rad = rad - Math.PI;
                }
            }
        }
        var textPosition = isLeft ? 'left' : 'right';
        var normalLabelModel = itemModel.getModel('label');
        var rotate = normalLabelModel.get('rotate');
        var labelRotateRadian = rotate * (Math.PI / 180);
        var textContent = symbolPath.getTextContent();
        if (textContent) {
            symbolPath.setTextConfig({
                position: normalLabelModel.get('position') || textPosition,
                rotation: rotate == null ? -rad : labelRotateRadian,
                origin: 'center'
            });
            textContent.setStyle('verticalAlign', 'middle');
        }
    }
    // Handle status
    var focus = itemModel.get([
        'emphasis',
        'focus'
    ]);
    var focusDataIndices = focus === 'relative' ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concatArray"](node.getAncestorsIndices(), node.getDescendantIndices()) : focus === 'ancestor' ? node.getAncestorsIndices() : focus === 'descendant' ? node.getDescendantIndices() : null;
    if (focusDataIndices) {
        // Modify the focus to data indices.
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getECData"])(symbolEl).focus = focusDataIndices;
    }
    drawEdge(seriesModel, node, virtualRoot, symbolEl, sourceOldLayout, sourceLayout, targetLayout, group);
    if (symbolEl.__edge) {
        symbolEl.onHoverStateChange = function(toState) {
            if (toState !== 'blur') {
                // NOTE: Ensure the parent elements will been blurred firstly.
                // According to the return of getAncestorsIndices and getDescendantIndices
                // TODO: A bit tricky.
                var parentEl = node.parentNode && data.getItemGraphicEl(node.parentNode.dataIndex);
                if (!(parentEl && parentEl.hoverState === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HOVER_STATE_BLUR"])) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setStatesFlag"])(symbolEl.__edge, toState);
                }
            }
        };
    }
}
function drawEdge(seriesModel, node, virtualRoot, symbolEl, sourceOldLayout, sourceLayout, targetLayout, group) {
    var itemModel = node.getModel();
    var edgeShape = seriesModel.get('edgeShape');
    var layout = seriesModel.get('layout');
    var orient = seriesModel.getOrient();
    var curvature = seriesModel.get([
        'lineStyle',
        'curveness'
    ]);
    var edgeForkPosition = seriesModel.get('edgeForkPosition');
    var lineStyle = itemModel.getModel('lineStyle').getLineStyle();
    var edge = symbolEl.__edge;
    // curve edge from node -> parent
    // polyline edge from node -> children
    if (edgeShape === 'curve') {
        if (node.parentNode && node.parentNode !== virtualRoot) {
            if (!edge) {
                edge = symbolEl.__edge = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$BezierCurve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BezierCurve$3e$__["BezierCurve"]({
                    shape: getEdgeShape(layout, orient, curvature, sourceOldLayout, sourceOldLayout)
                });
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProps"](edge, {
                shape: getEdgeShape(layout, orient, curvature, sourceLayout, targetLayout)
            }, seriesModel);
        }
    } else if (edgeShape === 'polyline') {
        if (layout === 'orthogonal') {
            if (node !== virtualRoot && node.children && node.children.length !== 0 && node.isExpand === true) {
                var children = node.children;
                var childPoints = [];
                for(var i = 0; i < children.length; i++){
                    var childLayout = children[i].getLayout();
                    childPoints.push([
                        childLayout.x,
                        childLayout.y
                    ]);
                }
                if (!edge) {
                    edge = symbolEl.__edge = new TreePath({
                        shape: {
                            parentPoint: [
                                targetLayout.x,
                                targetLayout.y
                            ],
                            childPoints: [
                                [
                                    targetLayout.x,
                                    targetLayout.y
                                ]
                            ],
                            orient: orient,
                            forkPosition: edgeForkPosition
                        }
                    });
                }
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProps"](edge, {
                    shape: {
                        parentPoint: [
                            targetLayout.x,
                            targetLayout.y
                        ],
                        childPoints: childPoints
                    }
                }, seriesModel);
            }
        } else {
            if ("TURBOPACK compile-time truthy", 1) {
                throw new Error('The polyline edgeShape can only be used in orthogonal layout');
            }
        }
    }
    // show all edge when edgeShape is 'curve', filter node `isExpand` is false when edgeShape is 'polyline'
    if (edge && !(edgeShape === 'polyline' && !node.isExpand)) {
        edge.useStyle(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaults"]({
            strokeNoScale: true,
            fill: null
        }, lineStyle));
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setStatesStylesFromModel"])(edge, itemModel, 'lineStyle');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDefaultStateProxy"])(edge);
        group.add(edge);
    }
}
function removeNodeEdge(node, data, group, seriesModel, removeAnimationOpt) {
    var virtualRoot = data.tree.root;
    var _a = getSourceNode(virtualRoot, node), source = _a.source, sourceLayout = _a.sourceLayout;
    var symbolEl = data.getItemGraphicEl(node.dataIndex);
    if (!symbolEl) {
        return;
    }
    var sourceSymbolEl = data.getItemGraphicEl(source.dataIndex);
    var sourceEdge = sourceSymbolEl.__edge;
    // 1. when expand the sub tree, delete the children node should delete the edge of
    // the source at the same time. because the polyline edge shape is only owned by the source.
    // 2.when the node is the only children of the source, delete the node should delete the edge of
    // the source at the same time. the same reason as above.
    var edge = symbolEl.__edge || (source.isExpand === false || source.children.length === 1 ? sourceEdge : undefined);
    var edgeShape = seriesModel.get('edgeShape');
    var layoutOpt = seriesModel.get('layout');
    var orient = seriesModel.get('orient');
    var curvature = seriesModel.get([
        'lineStyle',
        'curveness'
    ]);
    if (edge) {
        if (edgeShape === 'curve') {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeElement"](edge, {
                shape: getEdgeShape(layoutOpt, orient, curvature, sourceLayout, sourceLayout),
                style: {
                    opacity: 0
                }
            }, seriesModel, {
                cb: function() {
                    group.remove(edge);
                },
                removeOpt: removeAnimationOpt
            });
        } else if (edgeShape === 'polyline' && seriesModel.get('layout') === 'orthogonal') {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeElement"](edge, {
                shape: {
                    parentPoint: [
                        sourceLayout.x,
                        sourceLayout.y
                    ],
                    childPoints: [
                        [
                            sourceLayout.x,
                            sourceLayout.y
                        ]
                    ]
                },
                style: {
                    opacity: 0
                }
            }, seriesModel, {
                cb: function() {
                    group.remove(edge);
                },
                removeOpt: removeAnimationOpt
            });
        }
    }
}
function getSourceNode(virtualRoot, node) {
    var source = node.parentNode === virtualRoot ? node : node.parentNode || node;
    var sourceLayout;
    while(sourceLayout = source.getLayout(), sourceLayout == null){
        source = source.parentNode === virtualRoot ? source : source.parentNode || source;
    }
    return {
        source: source,
        sourceLayout: sourceLayout
    };
}
function removeNode(data, dataIndex, symbolEl, group, seriesModel) {
    var node = data.tree.getNodeByDataIndex(dataIndex);
    var virtualRoot = data.tree.root;
    var sourceLayout = getSourceNode(virtualRoot, node).sourceLayout;
    // Use same duration and easing with update to have more consistent animation.
    var removeAnimationOpt = {
        duration: seriesModel.get('animationDurationUpdate'),
        easing: seriesModel.get('animationEasingUpdate')
    };
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeElement"](symbolEl, {
        x: sourceLayout.x + 1,
        y: sourceLayout.y + 1
    }, seriesModel, {
        cb: function() {
            group.remove(symbolEl);
            data.setItemGraphicEl(dataIndex, null);
        },
        removeOpt: removeAnimationOpt
    });
    symbolEl.fadeOut(null, data.hostModel, {
        fadeLabel: true,
        animation: removeAnimationOpt
    });
    // remove edge as parent node
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](node.children, function(childNode) {
        removeNodeEdge(childNode, data, group, seriesModel, removeAnimationOpt);
    });
    // remove edge as child node
    removeNodeEdge(node, data, group, seriesModel, removeAnimationOpt);
}
function getEdgeShape(layoutOpt, orient, curvature, sourceLayout, targetLayout) {
    var cpx1;
    var cpy1;
    var cpx2;
    var cpy2;
    var x1;
    var x2;
    var y1;
    var y2;
    if (layoutOpt === 'radial') {
        x1 = sourceLayout.rawX;
        y1 = sourceLayout.rawY;
        x2 = targetLayout.rawX;
        y2 = targetLayout.rawY;
        var radialCoor1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$layoutHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["radialCoordinate"])(x1, y1);
        var radialCoor2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$layoutHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["radialCoordinate"])(x1, y1 + (y2 - y1) * curvature);
        var radialCoor3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$layoutHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["radialCoordinate"])(x2, y2 + (y1 - y2) * curvature);
        var radialCoor4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$layoutHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["radialCoordinate"])(x2, y2);
        return {
            x1: radialCoor1.x || 0,
            y1: radialCoor1.y || 0,
            x2: radialCoor4.x || 0,
            y2: radialCoor4.y || 0,
            cpx1: radialCoor2.x || 0,
            cpy1: radialCoor2.y || 0,
            cpx2: radialCoor3.x || 0,
            cpy2: radialCoor3.y || 0
        };
    } else {
        x1 = sourceLayout.x;
        y1 = sourceLayout.y;
        x2 = targetLayout.x;
        y2 = targetLayout.y;
        if (orient === 'LR' || orient === 'RL') {
            cpx1 = x1 + (x2 - x1) * curvature;
            cpy1 = y1;
            cpx2 = x2 + (x1 - x2) * curvature;
            cpy2 = y2;
        }
        if (orient === 'TB' || orient === 'BT') {
            cpx1 = x1;
            cpy1 = y1 + (y2 - y1) * curvature;
            cpx2 = x2;
            cpy2 = y2 + (y1 - y2) * curvature;
        }
    }
    return {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        cpx1: cpx1,
        cpy1: cpy1,
        cpx2: cpx2,
        cpy2: cpy2
    };
}
const __TURBOPACK__default__export__ = TreeView;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/tree/install.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "install",
    ()=>install
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$TreeView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/tree/TreeView.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$TreeSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/tree/TreeSeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$treeLayout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/tree/treeLayout.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$treeAction$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/tree/treeAction.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$treeVisual$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/tree/treeVisual.js [app-client] (ecmascript)");
;
;
;
;
;
function install(registers) {
    registers.registerChartView(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$TreeView$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
    registers.registerSeriesModel(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$TreeSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
    registers.registerLayout(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$treeLayout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
    registers.registerVisual(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$treeVisual$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["treeVisualStageHandler"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$treeAction$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["installTreeAction"])(registers);
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/tree/install.js [app-client] (ecmascript) <export install as TreeChart>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TreeChart",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["install"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$install$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/tree/install.js [app-client] (ecmascript)");
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/tree/layoutHelper.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
*/ /**
 * Initialize all computational message for following algorithm.
 */ __turbopack_context__.s([
    "firstWalk",
    ()=>firstWalk,
    "init",
    ()=>init,
    "radialCoordinate",
    ()=>radialCoordinate,
    "secondWalk",
    ()=>secondWalk,
    "separation",
    ()=>separation
]);
function init(inRoot) {
    var root = inRoot;
    root.hierNode = {
        defaultAncestor: null,
        ancestor: root,
        prelim: 0,
        modifier: 0,
        change: 0,
        shift: 0,
        i: 0,
        thread: null
    };
    var nodes = [
        root
    ];
    var node;
    var children;
    while(node = nodes.pop()){
        // jshint ignore:line
        children = node.children;
        if (node.isExpand && children.length) {
            var n = children.length;
            for(var i = n - 1; i >= 0; i--){
                var child = children[i];
                child.hierNode = {
                    defaultAncestor: null,
                    ancestor: child,
                    prelim: 0,
                    modifier: 0,
                    change: 0,
                    shift: 0,
                    i: i,
                    thread: null
                };
                nodes.push(child);
            }
        }
    }
}
function firstWalk(node, separation) {
    var children = node.isExpand ? node.children : [];
    var siblings = node.parentNode.children;
    var subtreeW = node.hierNode.i ? siblings[node.hierNode.i - 1] : null;
    if (children.length) {
        executeShifts(node);
        var midPoint = (children[0].hierNode.prelim + children[children.length - 1].hierNode.prelim) / 2;
        if (subtreeW) {
            node.hierNode.prelim = subtreeW.hierNode.prelim + separation(node, subtreeW);
            node.hierNode.modifier = node.hierNode.prelim - midPoint;
        } else {
            node.hierNode.prelim = midPoint;
        }
    } else if (subtreeW) {
        node.hierNode.prelim = subtreeW.hierNode.prelim + separation(node, subtreeW);
    }
    node.parentNode.hierNode.defaultAncestor = apportion(node, subtreeW, node.parentNode.hierNode.defaultAncestor || siblings[0], separation);
}
function secondWalk(node) {
    var nodeX = node.hierNode.prelim + node.parentNode.hierNode.modifier;
    node.setLayout({
        x: nodeX
    }, true);
    node.hierNode.modifier += node.parentNode.hierNode.modifier;
}
function separation(cb) {
    return arguments.length ? cb : defaultSeparation;
}
function radialCoordinate(rad, r) {
    rad -= Math.PI / 2;
    return {
        x: r * Math.cos(rad),
        y: r * Math.sin(rad)
    };
}
/**
 * All other shifts, applied to the smaller subtrees between w- and w+, are
 * performed by this function.
 *
 * The implementation of this function was originally copied from "d3.js"
 * <https://github.com/d3/d3-hierarchy/blob/4c1f038f2725d6eae2e49b61d01456400694bac4/src/tree.js>
 * with some modifications made for this program.
 * See the license statement at the head of this file.
 */ function executeShifts(node) {
    var children = node.children;
    var n = children.length;
    var shift = 0;
    var change = 0;
    while(--n >= 0){
        var child = children[n];
        child.hierNode.prelim += shift;
        child.hierNode.modifier += shift;
        change += child.hierNode.change;
        shift += child.hierNode.shift + change;
    }
}
/**
 * The implementation of this function was originally copied from "d3.js"
 * <https://github.com/d3/d3-hierarchy/blob/4c1f038f2725d6eae2e49b61d01456400694bac4/src/tree.js>
 * with some modifications made for this program.
 * See the license statement at the head of this file.
 *
 * The core of the algorithm. Here, a new subtree is combined with the
 * previous subtrees. Threads are used to traverse the inside and outside
 * contours of the left and right subtree up to the highest common level.
 * Whenever two nodes of the inside contours conflict, we compute the left
 * one of the greatest uncommon ancestors using the function nextAncestor()
 * and call moveSubtree() to shift the subtree and prepare the shifts of
 * smaller subtrees. Finally, we add a new thread (if necessary).
 */ function apportion(subtreeV, subtreeW, ancestor, separation) {
    if (subtreeW) {
        var nodeOutRight = subtreeV;
        var nodeInRight = subtreeV;
        var nodeOutLeft = nodeInRight.parentNode.children[0];
        var nodeInLeft = subtreeW;
        var sumOutRight = nodeOutRight.hierNode.modifier;
        var sumInRight = nodeInRight.hierNode.modifier;
        var sumOutLeft = nodeOutLeft.hierNode.modifier;
        var sumInLeft = nodeInLeft.hierNode.modifier;
        while(nodeInLeft = nextRight(nodeInLeft), nodeInRight = nextLeft(nodeInRight), nodeInLeft && nodeInRight){
            nodeOutRight = nextRight(nodeOutRight);
            nodeOutLeft = nextLeft(nodeOutLeft);
            nodeOutRight.hierNode.ancestor = subtreeV;
            var shift = nodeInLeft.hierNode.prelim + sumInLeft - nodeInRight.hierNode.prelim - sumInRight + separation(nodeInLeft, nodeInRight);
            if (shift > 0) {
                moveSubtree(nextAncestor(nodeInLeft, subtreeV, ancestor), subtreeV, shift);
                sumInRight += shift;
                sumOutRight += shift;
            }
            sumInLeft += nodeInLeft.hierNode.modifier;
            sumInRight += nodeInRight.hierNode.modifier;
            sumOutRight += nodeOutRight.hierNode.modifier;
            sumOutLeft += nodeOutLeft.hierNode.modifier;
        }
        if (nodeInLeft && !nextRight(nodeOutRight)) {
            nodeOutRight.hierNode.thread = nodeInLeft;
            nodeOutRight.hierNode.modifier += sumInLeft - sumOutRight;
        }
        if (nodeInRight && !nextLeft(nodeOutLeft)) {
            nodeOutLeft.hierNode.thread = nodeInRight;
            nodeOutLeft.hierNode.modifier += sumInRight - sumOutLeft;
            ancestor = subtreeV;
        }
    }
    return ancestor;
}
/**
 * This function is used to traverse the right contour of a subtree.
 * It returns the rightmost child of node or the thread of node. The function
 * returns null if and only if node is on the highest depth of its subtree.
 */ function nextRight(node) {
    var children = node.children;
    return children.length && node.isExpand ? children[children.length - 1] : node.hierNode.thread;
}
/**
 * This function is used to traverse the left contour of a subtree (or a subforest).
 * It returns the leftmost child of node or the thread of node. The function
 * returns null if and only if node is on the highest depth of its subtree.
 */ function nextLeft(node) {
    var children = node.children;
    return children.length && node.isExpand ? children[0] : node.hierNode.thread;
}
/**
 * If nodeInLeft’s ancestor is a sibling of node, returns nodeInLeft’s ancestor.
 * Otherwise, returns the specified ancestor.
 */ function nextAncestor(nodeInLeft, node, ancestor) {
    return nodeInLeft.hierNode.ancestor.parentNode === node.parentNode ? nodeInLeft.hierNode.ancestor : ancestor;
}
/**
 * The implementation of this function was originally copied from "d3.js"
 * <https://github.com/d3/d3-hierarchy/blob/4c1f038f2725d6eae2e49b61d01456400694bac4/src/tree.js>
 * with some modifications made for this program.
 * See the license statement at the head of this file.
 *
 * Shifts the current subtree rooted at wr.
 * This is done by increasing prelim(w+) and modifier(w+) by shift.
 */ function moveSubtree(wl, wr, shift) {
    var change = shift / (wr.hierNode.i - wl.hierNode.i);
    wr.hierNode.change -= change;
    wr.hierNode.shift += shift;
    wr.hierNode.modifier += shift;
    wr.hierNode.prelim += shift;
    wl.hierNode.change += change;
}
/**
 * The implementation of this function was originally copied from "d3.js"
 * <https://github.com/d3/d3-hierarchy/blob/4c1f038f2725d6eae2e49b61d01456400694bac4/src/tree.js>
 * with some modifications made for this program.
 * See the license statement at the head of this file.
 */ function defaultSeparation(node1, node2) {
    return node1.parentNode === node2.parentNode ? 1 : 2;
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/tree/traversalHelper.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "eachAfter",
    ()=>eachAfter,
    "eachBefore",
    ()=>eachBefore
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
 * Traverse the tree from bottom to top and do something
 */ function eachAfter(root, callback, separation) {
    var nodes = [
        root
    ];
    var next = [];
    var node;
    while(node = nodes.pop()){
        // jshint ignore:line
        next.push(node);
        if (node.isExpand) {
            var children = node.children;
            if (children.length) {
                for(var i = 0; i < children.length; i++){
                    nodes.push(children[i]);
                }
            }
        }
    }
    while(node = next.pop()){
        // jshint ignore:line
        callback(node, separation);
    }
}
/**
 * Traverse the tree from top to bottom and do something
 */ function eachBefore(root, callback) {
    var nodes = [
        root
    ];
    var node;
    while(node = nodes.pop()){
        // jshint ignore:line
        callback(node);
        if (node.isExpand) {
            var children = node.children;
            if (children.length) {
                for(var i = children.length - 1; i >= 0; i--){
                    nodes.push(children[i]);
                }
            }
        }
    }
}
;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/tree/treeAction.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "installTreeAction",
    ()=>installTreeAction
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$helper$2f$roamHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/helper/roamHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/types.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$TreeSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/tree/TreeSeries.js [app-client] (ecmascript)");
;
;
;
function installTreeAction(registers) {
    registers.registerAction({
        type: 'treeExpandAndCollapse',
        event: 'treeExpandAndCollapse',
        update: 'update'
    }, function(payload, ecModel) {
        ecModel.eachComponent({
            mainType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COMPONENT_MAIN_TYPE_SERIES"],
            subType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$TreeSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_TREE"],
            query: payload
        }, function(seriesModel) {
            var dataIndex = payload.dataIndex;
            var tree = seriesModel.getData().tree;
            var node = tree.getNodeByDataIndex(dataIndex);
            node.isExpand = !node.isExpand;
        });
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$helper$2f$roamHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerRoamActionSimply"])(registers, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COMPONENT_MAIN_TYPE_SERIES"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$TreeSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_TREE"]);
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/tree/treeLayout.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>treeLayout
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$traversalHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/tree/traversalHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$layoutHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/tree/layoutHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/layout.js [app-client] (ecmascript)");
;
;
;
function treeLayout(ecModel, api) {
    ecModel.eachSeriesByType('tree', function(seriesModel) {
        commonLayout(seriesModel, api);
    });
}
function commonLayout(seriesModel, api) {
    var refContainer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBoxLayoutReference"])(seriesModel, api).refContainer;
    var layoutInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLayoutRect"])(seriesModel.getBoxLayoutParams(), refContainer);
    seriesModel.layoutInfo = layoutInfo;
    var layout = seriesModel.get('layout');
    var width = 0;
    var height = 0;
    var separation = null;
    if (layout === 'radial') {
        width = 2 * Math.PI;
        height = Math.min(layoutInfo.height, layoutInfo.width) / 2;
        separation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$layoutHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["separation"])(function(node1, node2) {
            return (node1.parentNode === node2.parentNode ? 1 : 2) / node1.depth;
        });
    } else {
        width = layoutInfo.width;
        height = layoutInfo.height;
        separation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$layoutHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["separation"])();
    }
    var virtualRoot = seriesModel.getData().tree.root;
    var realRoot = virtualRoot.children[0];
    if (realRoot) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$layoutHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["init"])(virtualRoot);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$traversalHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eachAfter"])(realRoot, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$layoutHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firstWalk"], separation);
        virtualRoot.hierNode.modifier = -realRoot.hierNode.prelim;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$traversalHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eachBefore"])(realRoot, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$layoutHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["secondWalk"]);
        var left_1 = realRoot;
        var right_1 = realRoot;
        var bottom_1 = realRoot;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$traversalHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eachBefore"])(realRoot, function(node) {
            var x = node.getLayout().x;
            if (x < left_1.getLayout().x) {
                left_1 = node;
            }
            if (x > right_1.getLayout().x) {
                right_1 = node;
            }
            if (node.depth > bottom_1.depth) {
                bottom_1 = node;
            }
        });
        var delta = left_1 === right_1 ? 1 : separation(left_1, right_1) / 2;
        var tx_1 = delta - left_1.getLayout().x;
        var kx_1 = 0;
        var ky_1 = 0;
        var coorX_1 = 0;
        var coorY_1 = 0;
        if (layout === 'radial') {
            kx_1 = width / (right_1.getLayout().x + delta + tx_1);
            // here we use (node.depth - 1), bucause the real root's depth is 1
            ky_1 = height / (bottom_1.depth - 1 || 1);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$traversalHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eachBefore"])(realRoot, function(node) {
                coorX_1 = (node.getLayout().x + tx_1) * kx_1;
                coorY_1 = (node.depth - 1) * ky_1;
                var finalCoor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$layoutHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["radialCoordinate"])(coorX_1, coorY_1);
                node.setLayout({
                    x: finalCoor.x,
                    y: finalCoor.y,
                    rawX: coorX_1,
                    rawY: coorY_1
                }, true);
            });
        } else {
            var orient_1 = seriesModel.getOrient();
            if (orient_1 === 'RL' || orient_1 === 'LR') {
                ky_1 = height / (right_1.getLayout().x + delta + tx_1);
                kx_1 = width / (bottom_1.depth - 1 || 1);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$traversalHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eachBefore"])(realRoot, function(node) {
                    coorY_1 = (node.getLayout().x + tx_1) * ky_1;
                    coorX_1 = orient_1 === 'LR' ? (node.depth - 1) * kx_1 : width - (node.depth - 1) * kx_1;
                    node.setLayout({
                        x: coorX_1,
                        y: coorY_1
                    }, true);
                });
            } else if (orient_1 === 'TB' || orient_1 === 'BT') {
                kx_1 = width / (right_1.getLayout().x + delta + tx_1);
                ky_1 = height / (bottom_1.depth - 1 || 1);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$traversalHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eachBefore"])(realRoot, function(node) {
                    coorX_1 = (node.getLayout().x + tx_1) * kx_1;
                    coorY_1 = orient_1 === 'TB' ? (node.depth - 1) * ky_1 : height - (node.depth - 1) * ky_1;
                    node.setLayout({
                        x: coorX_1,
                        y: coorY_1
                    }, true);
                });
            }
        }
    }
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/tree/treeVisual.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "treeVisualStageHandler",
    ()=>treeVisualStageHandler
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$TreeSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/tree/TreeSeries.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
;
;
;
var treeVisualStageHandler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSimpleOverallStageHandler"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$TreeSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_TREE"], treeVisual);
function treeVisual(ecModel) {
    ecModel.eachSeriesByType(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$tree$2f$TreeSeries$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SERIES_TYPE_TREE"], function(seriesModel) {
        var data = seriesModel.getData();
        var tree = data.tree;
        tree.eachNode(function(node) {
            var model = node.getModel();
            // TODO Optimize
            var style = model.getModel('itemStyle').getItemStyle();
            var existsStyle = data.ensureUniqueItemVisual(node.dataIndex, 'style');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])(existsStyle, style);
        });
    });
}
}),
]);

//# sourceMappingURL=10pt_echarts_lib_chart_1usbqw9._.js.map