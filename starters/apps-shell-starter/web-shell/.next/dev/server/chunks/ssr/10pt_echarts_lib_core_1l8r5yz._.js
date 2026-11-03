module.exports = [
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/CoordinateSystem.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BOX_COORD_SYS_COORD_FROM_PROP_COORD",
    ()=>BOX_COORD_SYS_COORD_FROM_PROP_COORD,
    "BOX_COORD_SYS_COORD_FROM_PROP_COORD2",
    ()=>BOX_COORD_SYS_COORD_FROM_PROP_COORD2,
    "COORD_SYS_USAGE_KIND_BOX",
    ()=>COORD_SYS_USAGE_KIND_BOX,
    "COORD_SYS_USAGE_KIND_DATA",
    ()=>COORD_SYS_USAGE_KIND_DATA,
    "COORD_SYS_USAGE_KIND_NONE",
    ()=>COORD_SYS_USAGE_KIND_NONE,
    "decideCoordSysUsageKind",
    ()=>decideCoordSysUsageKind,
    "default",
    ()=>__TURBOPACK__default__export__,
    "getCoordForCoordSysUsageKindBox",
    ()=>getCoordForCoordSysUsageKindBox,
    "injectCoordSysByOption",
    ()=>injectCoordSysByOption,
    "registerLayOutOnCoordSysUsage",
    ()=>registerLayOutOnCoordSysUsage,
    "simpleCoordSysInjectionProvider",
    ()=>simpleCoordSysInjectionProvider
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-ssr] (ecmascript)");
;
;
;
/**
 * FIXME:
 * `nonSeriesBoxCoordSysCreators` and `_nonSeriesBoxMasterList` are hardcoded implementations.
 * Regarding "coord sys layout based on another coord sys", currently we only experimentally support one level
 * dependency, such as, "grid(cartesian)s can be laid out based on matrix/calendar coord sys."
 * But a comprehensive implementation may need to support:
 *  - Recursive dependencies. e.g., a matrix coord sys lays out based on another matrix coord sys.
 *    That requires in the implementation `create` and `update` of coord sys are called by a dependency graph.
 *    (@see enableTopologicalTravel in `util/component.ts`)
 */ var nonSeriesBoxCoordSysCreators = {};
var normalCoordSysCreators = {};
var CoordinateSystemManager = /** @class */ function() {
    function CoordinateSystemManager() {
        this._normalMasterList = [];
        this._nonSeriesBoxMasterList = [];
    }
    /**
   * Typically,
   *  - in `create`, a coord sys lays out based on a given rect;
   *  - in `update`, update the pixel and data extent of there axes (if any) based on processed `series.data`.
   * After that, a coord sys can serve (typically by `dataToPoint`/`dataToLayout`/`pointToData`).
   * If the coordinate system do not lay out based on `series.data`, `update` is not needed.
   */ CoordinateSystemManager.prototype.create = function(ecModel, api) {
        this._nonSeriesBoxMasterList = dealCreate(nonSeriesBoxCoordSysCreators, true);
        this._normalMasterList = dealCreate(normalCoordSysCreators, false);
        function dealCreate(creatorMap, canBeNonSeriesBox) {
            var coordinateSystems = [];
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](creatorMap, function(creator, type) {
                var list = creator.create(ecModel, api);
                coordinateSystems = coordinateSystems.concat(list || []);
                if ("TURBOPACK compile-time truthy", 1) {
                    if (canBeNonSeriesBox) {
                        // Disallow `update` is a brutal way to ensure `_nonSeriesBoxMasterList`s are ready to
                        // serve after `create`. But if `update` has to be involved in `_nonSeriesBoxMasterList`
                        // for some future case, more complicated mechanisms need to be introduced.
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](list, function(master) {
                            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"](!master.update);
                        });
                    }
                }
            });
            return coordinateSystems;
        }
    };
    /**
   * @see CoordinateSystem['create']
   */ CoordinateSystemManager.prototype.update = function(ecModel, api) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](this._normalMasterList, function(coordSys) {
            coordSys.update && coordSys.update(ecModel, api);
        });
    };
    CoordinateSystemManager.prototype.getCoordinateSystems = function() {
        return this._normalMasterList.concat(this._nonSeriesBoxMasterList);
    };
    CoordinateSystemManager.register = function(type, creator) {
        if (type === 'matrix' || type === 'calendar') {
            // FIXME: hardcode, @see nonSeriesBoxCoordSysCreators
            nonSeriesBoxCoordSysCreators[type] = creator;
            return;
        }
        normalCoordSysCreators[type] = creator;
    };
    CoordinateSystemManager.get = function(type) {
        return normalCoordSysCreators[type] || nonSeriesBoxCoordSysCreators[type];
    };
    return CoordinateSystemManager;
}();
function canBeNonSeriesBoxCoordSys(coordSysType) {
    return !!nonSeriesBoxCoordSysCreators[coordSysType];
}
var BOX_COORD_SYS_COORD_FROM_PROP_COORD = 1;
var BOX_COORD_SYS_COORD_FROM_PROP_COORD2 = 2;
function registerLayOutOnCoordSysUsage(opt) {
    if ("TURBOPACK compile-time truthy", 1) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"](!coordSysUseMap.get(opt.fullType));
    }
    coordSysUseMap.set(opt.fullType, {
        getCoord2: undefined
    }).getCoord2 = opt.getCoord2;
}
var coordSysUseMap = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"]();
function getCoordForCoordSysUsageKindBox(model) {
    var coord = model.getShallow('coord', true);
    var from = BOX_COORD_SYS_COORD_FROM_PROP_COORD;
    if (coord == null) {
        var store = coordSysUseMap.get(model.type);
        if (store && store.getCoord2) {
            from = BOX_COORD_SYS_COORD_FROM_PROP_COORD2;
            coord = store.getCoord2(model);
        }
    }
    return {
        coord: coord,
        from: from
    };
}
var COORD_SYS_USAGE_KIND_NONE = 0;
var COORD_SYS_USAGE_KIND_DATA = 1;
var COORD_SYS_USAGE_KIND_BOX = 2;
function decideCoordSysUsageKind(// Component or series
model, printError) {
    // For backward compat, still not use `true` in model.get.
    var coordSysType = model.getShallow('coordinateSystem');
    var coordSysUsageOption = model.getShallow('coordinateSystemUsage', true);
    var isDeclaredExplicitly = coordSysUsageOption != null;
    var kind = COORD_SYS_USAGE_KIND_NONE;
    if (coordSysType) {
        var isSeries = model.mainType === 'series';
        if (coordSysUsageOption == null) {
            coordSysUsageOption = isSeries ? 'data' : 'box';
        }
        if (coordSysUsageOption === 'data') {
            kind = COORD_SYS_USAGE_KIND_DATA;
            if (!isSeries) {
                if ("TURBOPACK compile-time truthy", 1) {
                    if (isDeclaredExplicitly && printError) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["error"])('coordinateSystemUsage "data" is not supported in non-series components.');
                    }
                }
                kind = COORD_SYS_USAGE_KIND_NONE;
            }
        } else if (coordSysUsageOption === 'box') {
            kind = COORD_SYS_USAGE_KIND_BOX;
            if (!isSeries && !canBeNonSeriesBoxCoordSys(coordSysType)) {
                if ("TURBOPACK compile-time truthy", 1) {
                    if (isDeclaredExplicitly && printError) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["error"])("coordinateSystem \"" + coordSysType + "\" cannot be used" + (" as coordinateSystemUsage \"box\" for \"" + model.type + "\" yet."));
                    }
                }
                kind = COORD_SYS_USAGE_KIND_NONE;
            }
        }
    }
    return {
        coordSysType: coordSysType,
        kind: kind
    };
}
function injectCoordSysByOption(opt) {
    var targetModel = opt.targetModel, coordSysType = opt.coordSysType, coordSysProvider = opt.coordSysProvider, isDefaultDataCoordSys = opt.isDefaultDataCoordSys, allowNotFound = opt.allowNotFound;
    if ("TURBOPACK compile-time truthy", 1) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"](!!coordSysType);
    }
    var _a = decideCoordSysUsageKind(targetModel, true), kind = _a.kind, declaredType = _a.coordSysType;
    if (isDefaultDataCoordSys && kind !== COORD_SYS_USAGE_KIND_DATA) {
        // If both `COORD_SYS_USAGE_KIND_DATA` and `COORD_SYS_USAGE_KIND_BOX` declared in one model.
        // There is the only case in series-graph, and no other cases yet.
        kind = COORD_SYS_USAGE_KIND_DATA;
        declaredType = coordSysType;
    }
    if (kind === COORD_SYS_USAGE_KIND_NONE || declaredType !== coordSysType) {
        return COORD_SYS_USAGE_KIND_NONE;
    }
    var coordSys = coordSysProvider(coordSysType, targetModel);
    if (!coordSys) {
        if ("TURBOPACK compile-time truthy", 1) {
            if (!allowNotFound) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["error"])(coordSysType + " cannot be found for" + (" " + targetModel.type + " (index: " + targetModel.componentIndex + ")."));
            }
        }
        return COORD_SYS_USAGE_KIND_NONE;
    }
    if (kind === COORD_SYS_USAGE_KIND_DATA) {
        if ("TURBOPACK compile-time truthy", 1) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"](targetModel.mainType === 'series');
        }
        targetModel.coordinateSystem = coordSys;
    } else {
        // kind === COORD_SYS_USAGE_KIND_BOX
        targetModel.boxCoordinateSystem = coordSys;
    }
    return kind;
}
var simpleCoordSysInjectionProvider = function(coordSysType, injectTargetModel) {
    var coordSysModel = injectTargetModel.getReferringComponents(coordSysType, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SINGLE_REFERRING"]).models[0];
    return coordSysModel && coordSysModel.coordinateSystem;
};
const __TURBOPACK__default__export__ = CoordinateSystemManager;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/ExtensionAPI.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "getViewOfComponentOrSeries",
    ()=>getViewOfComponentOrSeries
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/types.js [app-ssr] (ecmascript)");
;
;
var availableMethods = [
    'getDom',
    'getZr',
    'getWidth',
    'getHeight',
    'getDevicePixelRatio',
    'dispatchAction',
    'isSSR',
    'isDisposed',
    'on',
    'off',
    'getDataURL',
    'getConnectedDataURL',
    // 'getModel',
    'getOption',
    // 'getViewOfComponentModel',
    // 'getViewOfSeriesModel',
    'getId',
    'updateLabelLayout'
];
var ExtensionAPI = /** @class */ function() {
    function ExtensionAPI(ecInstance) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](availableMethods, function(methodName) {
            this[methodName] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bind"](ecInstance[methodName], ecInstance);
        }, this);
    }
    return ExtensionAPI;
}();
function getViewOfComponentOrSeries(api, componentOrSeries) {
    return componentOrSeries.mainType === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMPONENT_MAIN_TYPE_SERIES"] ? api.getViewOfSeriesModel(componentOrSeries) : api.getViewOfComponentModel(componentOrSeries);
}
const __TURBOPACK__default__export__ = ExtensionAPI;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/Scheduler.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$task$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/task.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/component.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Global$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Global.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$ExtensionAPI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/ExtensionAPI.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
var Scheduler = /** @class */ function() {
    function Scheduler(ecInstance, api, dataProcessorHandlers, visualHandlers) {
        // key: handlerUID
        this._stageTaskMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
        this.ecInstance = ecInstance;
        this.api = api;
        // Fix current processors in case that in some rear cases that
        // processors might be registered after echarts instance created.
        // Register processors incrementally for a echarts instance is
        // not supported by this stream architecture.
        dataProcessorHandlers = this._dataProcessorHandlers = dataProcessorHandlers.slice();
        visualHandlers = this._visualHandlers = visualHandlers.slice();
        this._allHandlers = dataProcessorHandlers.concat(visualHandlers);
    }
    Scheduler.prototype.restoreData = function(ecModel, payload) {
        // TODO: Only restore needed series and components, but not all components.
        // Currently `restoreData` of all of the series and component will be called.
        // But some independent components like `title`, `legend`, `graphic`, `toolbox`,
        // `tooltip`, `axisPointer`, etc, do not need series refresh when `setOption`,
        // and some components like coordinate system, axes, dataZoom, visualMap only
        // need their target series refresh.
        // (1) If we are implementing this feature some day, we should consider these cases:
        // if a data processor depends on a component (e.g., dataZoomProcessor depends
        // on the settings of `dataZoom`), it should be re-performed if the component
        // is modified by `setOption`.
        // (2) If a processor depends on several series, specified by its `getTargetSeries`,
        // it should be re-performed when the result array of `getTargetSeries` changed.
        // We use `dependencies` to cover these issues.
        // (3) How to update target series when coordinate system related components modified.
        // TODO: simply the dirty mechanism? Check whether only the case here can set tasks dirty,
        // and this case all of the tasks will be set as dirty.
        ecModel.restoreData(payload);
        // Theoretically an overall task not only depends on each of its target series, but also
        // depends on all of the series.
        // The overall task is not in pipeline, and `ecModel.restoreData` only set pipeline tasks
        // dirty. If `getTargetSeries` of an overall task returns nothing, we should also ensure
        // that the overall task is set as dirty and to be performed, otherwise it probably cause
        // state chaos. So we have to set dirty of all of the overall tasks manually, otherwise it
        // probably cause state chaos (consider `dataZoomProcessor`).
        this._stageTaskMap.each(function(taskRecord) {
            var overallTask = taskRecord.overallTask;
            overallTask && overallTask.dirty();
        });
    };
    // If seriesModel provided, incremental threshold is check by series data.
    Scheduler.prototype.getPerformArgs = function(task, isBlock) {
        // For overall task
        if (!task.__pipeline) {
            return;
        }
        var pipeline = this._pipelineMap.get(task.__pipeline.id);
        var pCtx = pipeline.context;
        var incremental = !isBlock && pipeline.progressiveEnabled && (!pCtx || pCtx.progressiveRender) && task.__idxInPipeline > pipeline.blockIndex;
        var step = incremental ? pipeline.step : null;
        var modDataCount = pCtx && pCtx.modDataCount;
        var modBy = modDataCount != null ? Math.ceil(modDataCount / step) : null;
        return {
            step: step,
            modBy: modBy,
            modDataCount: modDataCount
        };
    };
    Scheduler.prototype.getPipeline = function(pipelineId) {
        return this._pipelineMap.get(pipelineId);
    };
    /**
   * Current, progressive rendering starts from visual and layout.
   * Always detect render mode in the same stage, avoiding that incorrect
   * detection caused by data filtering.
   * Caution:
   * `updateStreamModes` use `seriesModel.getData()`.
   */ Scheduler.prototype.updateStreamModes = function(seriesModel, view) {
        var pipeline = this._pipelineMap.get(seriesModel.uid);
        // `progressiveRender` means that can render progressively in each
        // animation frame. Note that some types of series do not provide
        // `view.incrementalPrepareRender` but support `chart.appendData`. We
        // use the term `incremental` but not `progressive` to describe the
        // case `chart.appendData`.
        // Regarding zrender, both echarts "progressive" and "incremental" use `el.incremental: true`.
        var context = seriesModel.__preparePipelineContext ? seriesModel.__preparePipelineContext(view, pipeline) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["preparePipelineContext"])(seriesModel, view, pipeline);
        seriesModel.pipelineContext = pipeline.context = context;
    };
    Scheduler.prototype.restorePipelines = function(zr, ecModel) {
        var scheduler = this;
        var pipelineMap = scheduler._pipelineMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
        ecModel.eachSeries(function(seriesModel) {
            var progressive = zr.painter.type === 'canvas' && seriesModel.getProgressive();
            var pipelineId = seriesModel.uid;
            pipelineMap.set(pipelineId, {
                id: pipelineId,
                head: null,
                tail: null,
                threshold: seriesModel.getProgressiveThreshold(),
                progressiveEnabled: progressive && !(seriesModel.preventIncremental && seriesModel.preventIncremental()),
                blockIndex: -1,
                step: Math.round(progressive || 700),
                count: 0
            });
            scheduler._pipe(seriesModel, seriesModel.dataTask);
        });
    };
    Scheduler.prototype.prepareStageTasks = function() {
        var stageTaskMap = this._stageTaskMap;
        var ecModel = this.api.getModel();
        var api = this.api;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(this._allHandlers, function(handler) {
            var record = stageTaskMap.get(handler.uid) || stageTaskMap.set(handler.uid, {});
            var errMsg = '';
            if (("TURBOPACK compile-time value", "development") !== 'production') {
                // Currently do not need to support to specify them both.
                errMsg = '"reset" and "overallReset" must not be both specified.';
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(!(handler.reset && handler.overallReset), errMsg);
            handler.reset && this._createSeriesStageTask(handler, record, ecModel, api);
            handler.overallReset && this._createOverallStageTask(handler, record, ecModel, api);
        }, this);
    };
    Scheduler.prototype.prepareView = function(view, model, ecModel, api) {
        var renderTask = view.renderTask;
        var context = renderTask.context;
        context.model = model;
        context.ecModel = ecModel;
        context.api = api;
        renderTask.__block = !view.incrementalPrepareRender;
        this._pipe(model, renderTask);
    };
    Scheduler.prototype.performDataProcessorTasks = function(ecModel, payload) {
        // If we do not use `block` here, it should be considered when to update modes.
        this._performStageTasks(this._dataProcessorHandlers, ecModel, payload, {
            block: true
        });
    };
    Scheduler.prototype.performVisualTasks = function(ecModel, payload, opt) {
        this._performStageTasks(this._visualHandlers, ecModel, payload, opt);
    };
    Scheduler.prototype._performStageTasks = function(stageHandlers, ecModel, payload, opt) {
        opt = opt || {};
        var unfinished = false;
        var scheduler = this;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(stageHandlers, function(stageHandler, idx) {
            if (opt.visualType && opt.visualType !== stageHandler.visualType) {
                return;
            }
            var stageHandlerRecord = scheduler._stageTaskMap.get(stageHandler.uid);
            var seriesTaskMap = stageHandlerRecord.seriesTaskMap;
            var overallTask = stageHandlerRecord.overallTask;
            if (overallTask) {
                var overallNeedDirty_1;
                var agentStubMap = overallTask.agentStubMap;
                agentStubMap.each(function(stub) {
                    if (needSetDirty(opt, stub)) {
                        stub.dirty();
                        overallNeedDirty_1 = true;
                    }
                });
                overallNeedDirty_1 && overallTask.dirty();
                scheduler.updatePayload(overallTask, payload);
                var performArgs_1 = scheduler.getPerformArgs(overallTask, opt.block);
                // Execute stubs firstly, which may set the overall task dirty,
                // then execute the overall task. And stub will call seriesModel.setData,
                // which ensures that in the overallTask seriesModel.getData() will not
                // return incorrect data.
                agentStubMap.each(function(stub) {
                    stub.perform(performArgs_1);
                });
                if (overallTask.perform(performArgs_1)) {
                    unfinished = true;
                }
            } else if (seriesTaskMap) {
                seriesTaskMap.each(function(task, pipelineId) {
                    if (needSetDirty(opt, task)) {
                        task.dirty();
                    }
                    var performArgs = scheduler.getPerformArgs(task, opt.block);
                    // FIXME
                    // if intending to declare `performRawSeries` in handlers, only
                    // stream-independent (specifically, data item independent) operations can be
                    // performed. Because if a series is filtered, most of the tasks will not
                    // be performed. A stream-dependent operation probably cause wrong biz logic.
                    // Perhaps we should not provide a separate callback for this case instead
                    // of providing the config `performRawSeries`. The stream-dependent operations
                    // and stream-independent operations should better not be mixed.
                    performArgs.skip = !stageHandler.performRawSeries && ecModel.isSeriesFiltered(task.context.model);
                    scheduler.updatePayload(task, payload);
                    if (task.perform(performArgs)) {
                        unfinished = true;
                    }
                });
            }
        });
        function needSetDirty(opt, task) {
            return opt.setDirty && (!opt.dirtyMap || opt.dirtyMap.get(task.__pipeline.id));
        }
        this.unfinished = unfinished || this.unfinished;
    };
    Scheduler.prototype.performSeriesTasks = function(ecModel) {
        var unfinished;
        ecModel.eachSeries(function(seriesModel) {
            // Progress to the end for dataInit and dataRestore.
            unfinished = seriesModel.dataTask.perform() || unfinished;
        });
        this.unfinished = unfinished || this.unfinished;
    };
    Scheduler.prototype.plan = function() {
        // Travel pipelines, check block.
        this._pipelineMap.each(function(pipeline) {
            var task = pipeline.tail;
            do {
                if (task.__block) {
                    pipeline.blockIndex = task.__idxInPipeline;
                    break;
                }
                task = task.getUpstream();
            }while (task)
        });
    };
    Scheduler.prototype.updatePayload = function(task, payload) {
        payload !== 'remain' && (task.context.payload = payload);
    };
    Scheduler.prototype._createSeriesStageTask = function(stageHandler, stageHandlerRecord, ecModel, api) {
        var scheduler = this;
        var oldSeriesTaskMap = stageHandlerRecord.seriesTaskMap;
        // The count of stages are totally about only several dozen, so
        // do not need to reuse the map.
        var newSeriesTaskMap = stageHandlerRecord.seriesTaskMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
        var seriesType = stageHandler.seriesType;
        var getTargetSeries = stageHandler.getTargetSeries;
        // If a stageHandler should cover all series, `createOnAllSeries` should be declared mandatorily,
        // to avoid some typo or abuse. Otherwise if an extension do not specify a `seriesType`,
        // it works but it may cause other irrelevant charts blocked.
        if (stageHandler.createOnAllSeries) {
            ecModel.eachRawSeries(create);
        } else if (seriesType) {
            ecModel.eachRawSeriesByType(seriesType, create);
        } else if (getTargetSeries) {
            getTargetSeries(ecModel, api).each(create);
        }
        function create(seriesModel) {
            var pipelineId = seriesModel.uid;
            // Init tasks for each seriesModel only once.
            // Reuse original task instance.
            var task = newSeriesTaskMap.set(pipelineId, oldSeriesTaskMap && oldSeriesTaskMap.get(pipelineId) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$task$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createTask"])({
                plan: seriesTaskPlan,
                reset: seriesTaskReset,
                count: seriesTaskCount
            }));
            task.context = {
                model: seriesModel,
                ecModel: ecModel,
                api: api,
                // PENDING: `useClearVisual` not used?
                useClearVisual: stageHandler.isVisual && !stageHandler.isLayout,
                plan: stageHandler.plan,
                reset: stageHandler.reset,
                scheduler: scheduler
            };
            scheduler._pipe(seriesModel, task);
        }
    };
    Scheduler.prototype._createOverallStageTask = function(stageHandler, stageHandlerRecord, ecModel, api) {
        var scheduler = this;
        var overallTask = stageHandlerRecord.overallTask = stageHandlerRecord.overallTask || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$task$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createTask"])({
            reset: overallTaskReset
        });
        overallTask.context = {
            ecModel: ecModel,
            api: api,
            overallReset: stageHandler.overallReset,
            scheduler: scheduler
        };
        var oldAgentStubMap = overallTask.agentStubMap;
        // The count of stages are totally about only several dozen, so
        // do not need to reuse the map.
        var newAgentStubMap = overallTask.agentStubMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
        var seriesType = stageHandler.seriesType;
        var getTargetSeries = stageHandler.getTargetSeries;
        var dirtyOnOverallProgress = stageHandler.dirtyOnOverallProgress;
        var shouldOverallTaskDirty = false;
        // FIXME:TS never used, so comment it
        // let modifyOutputEnd = stageHandler.modifyOutputEnd;
        // An overall task with seriesType detected or has `getTargetSeries`, we add
        // stub in each pipelines to receive dirty info from upstream.
        var errMsg = '';
        if (("TURBOPACK compile-time value", "development") !== 'production') {
            errMsg = '"createOnAllSeries" is not supported for "overallReset", ' + 'because it will block all streams.';
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(!stageHandler.createOnAllSeries, errMsg);
        if (seriesType) {
            ecModel.eachRawSeriesByType(seriesType, createStub);
        } else if (getTargetSeries) {
            getTargetSeries(ecModel, api).each(createStub);
        } else {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(ecModel.getSeries(), createStub);
        }
        function createStub(seriesModel) {
            var pipelineId = seriesModel.uid;
            var stub = newAgentStubMap.set(pipelineId, oldAgentStubMap && oldAgentStubMap.get(pipelineId) || (// When the result of `getTargetSeries` changed, the overallTask
            // should be set as dirty and re-performed.
            shouldOverallTaskDirty = true, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$task$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createTask"])({
                reset: stubReset,
                onDirty: stubOnDirty
            })));
            stub.context = {
                model: seriesModel,
                dirtyOnOverallProgress: dirtyOnOverallProgress
            };
            stub.agent = overallTask;
            stub.__block = dirtyOnOverallProgress;
            scheduler._pipe(seriesModel, stub);
        }
        if (shouldOverallTaskDirty) {
            overallTask.dirty();
        }
    };
    Scheduler.prototype._pipe = function(seriesModel, task) {
        var pipelineId = seriesModel.uid;
        var pipeline = this._pipelineMap.get(pipelineId);
        !pipeline.head && (pipeline.head = task);
        pipeline.tail && pipeline.tail.pipe(task);
        pipeline.tail = task;
        task.__idxInPipeline = pipeline.count++;
        task.__pipeline = pipeline;
    };
    Scheduler.wrapStageHandler = function(stageHandler, visualType) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"])(stageHandler)) {
            stageHandler = {
                overallReset: stageHandler,
                seriesType: detectSeriseType(stageHandler)
            };
        }
        stageHandler.uid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUID"])('stageHandler');
        visualType && (stageHandler.visualType = visualType);
        return stageHandler;
    };
    ;
    return Scheduler;
}();
function overallTaskReset(context) {
    context.overallReset(context.ecModel, context.api, context.payload);
}
function stubReset(context) {
    return context.dirtyOnOverallProgress && stubProgress;
}
function stubProgress() {
    this.agent.dirty();
    this.getDownstream().dirty();
}
function stubOnDirty() {
    this.agent && this.agent.dirty();
}
function seriesTaskPlan(context) {
    return context.plan ? context.plan(context.model, context.ecModel, context.api, context.payload) : null;
}
function seriesTaskReset(context) {
    if (context.useClearVisual) {
        context.data.clearAllVisual();
    }
    var resetDefines = context.resetDefines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeToArray"])(context.reset(context.model, context.ecModel, context.api, context.payload));
    return resetDefines.length > 1 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(resetDefines, function(v, idx) {
        return makeSeriesTaskProgress(idx);
    }) : singleSeriesTaskProgress;
}
var singleSeriesTaskProgress = makeSeriesTaskProgress(0);
function makeSeriesTaskProgress(resetDefineIdx) {
    return function(params, context) {
        var data = context.data;
        var resetDefine = context.resetDefines[resetDefineIdx];
        if (resetDefine && resetDefine.dataEach) {
            for(var i = params.start; i < params.end; i++){
                resetDefine.dataEach(data, i);
            }
        } else if (resetDefine && resetDefine.progress) {
            resetDefine.progress(params, data);
        }
    };
}
function seriesTaskCount(context) {
    return context.data.count();
}
/**
 * Only some legacy stage handlers (usually in echarts extensions) are pure function.
 * To ensure that they can work normally, they should work in block mode, that is,
 * they should not be started util the previous tasks finished. So they cause the
 * progressive rendering disabled. We try to detect the series type, to narrow down
 * the block range to only the series type they concern, but not all series.
 */ function detectSeriseType(legacyFunc) {
    seriesType = null;
    try {
        // Assume there is no async when calling `eachSeriesByType`.
        legacyFunc(ecModelMock, apiMock);
    } catch (e) {}
    return seriesType;
}
var ecModelMock = {};
var apiMock = {};
var seriesType;
mockMethods(ecModelMock, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Global$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
mockMethods(apiMock, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$ExtensionAPI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
ecModelMock.eachSeriesByType = ecModelMock.eachRawSeriesByType = function(type) {
    seriesType = type;
};
ecModelMock.eachComponent = function(cond) {
    if (cond.mainType === 'series' && cond.subType) {
        seriesType = cond.subType;
    }
};
function mockMethods(target, Clz) {
    /* eslint-disable */ for(var name_1 in Clz.prototype){
        // Do not use hasOwnProperty
        target[name_1] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"];
    }
/* eslint-enable */ }
const __TURBOPACK__default__export__ = Scheduler;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/echarts.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PRIORITY",
    ()=>PRIORITY,
    "connect",
    ()=>connect,
    "dataTool",
    ()=>dataTool,
    "dependencies",
    ()=>dependencies,
    "disConnect",
    ()=>disConnect,
    "disconnect",
    ()=>disconnect,
    "dispose",
    ()=>dispose,
    "getCoordinateSystemDimensions",
    ()=>getCoordinateSystemDimensions,
    "getInstanceByDom",
    ()=>getInstanceByDom,
    "getInstanceById",
    ()=>getInstanceById,
    "getMap",
    ()=>getMap,
    "init",
    ()=>init,
    "registerAction",
    ()=>registerAction,
    "registerCoordinateSystem",
    ()=>registerCoordinateSystem,
    "registerCustomSeries",
    ()=>registerCustomSeries,
    "registerLayout",
    ()=>registerLayout,
    "registerLoading",
    ()=>registerLoading,
    "registerMap",
    ()=>registerMap,
    "registerPostInit",
    ()=>registerPostInit,
    "registerPostUpdate",
    ()=>registerPostUpdate,
    "registerPreprocessor",
    ()=>registerPreprocessor,
    "registerProcessor",
    ()=>registerProcessor,
    "registerTheme",
    ()=>registerTheme,
    "registerTransform",
    ()=>registerTransform,
    "registerUpdateLifecycle",
    ()=>registerUpdateLifecycle,
    "registerVisual",
    ()=>registerVisual,
    "setCanvasCreator",
    ()=>setCanvasCreator,
    "version",
    ()=>version
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.3.0/node_modules/tslib/tslib.es6.js [app-ssr] (ecmascript)");
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$zrender$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/zrender.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$env$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/env.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$timsort$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/timsort.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Eventful$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/Eventful.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Global$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Global.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$ExtensionAPI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/ExtensionAPI.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/CoordinateSystem.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$OptionManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/OptionManager.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$preprocessor$2f$backwardCompat$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/preprocessor/backwardCompat.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$processor$2f$dataStack$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/processor/dataStack.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Series.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/view/Component.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/view/Chart.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Rect$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Rect.js [app-ssr] (ecmascript) <export default as Rect>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Image.js [app-ssr] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/animation/basicTransition.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/graphic.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Path$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Path.js [app-ssr] (ecmascript) <export default as Path>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/innerStore.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/states.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$throttle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/throttle.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$loading$2f$default$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/loading/default.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$Scheduler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/Scheduler.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$theme$2f$dark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/theme/dark.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/clazz.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$ECEventProcessor$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/ECEventProcessor.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/types.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$symbol$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/symbol.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/helper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$legacy$2f$dataSelectAction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/legacy/dataSelectAction.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$transform$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/transform.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$locale$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/locale.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/event.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$lifecycle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/lifecycle.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$platform$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/platform.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$impl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/impl.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$custom$2f$customSeriesRegister$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/custom/customSeriesRegister.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$cycleCache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/cycleCache.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$globalDefault$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/globalDefault.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$decal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/decal.js [app-ssr] (ecmascript)");
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
var version = '6.1.0';
var dependencies = {
    zrender: '6.1.0'
};
var TEST_FRAME_REMAIN_TIME = 1;
var PRIORITY_PROCESSOR_SERIES_FILTER = 800;
// In the current impl, "data stack" will modifies the original "series data extent". Some data
// processors rely on the stack result dimension to calculate extents. So data stack
// should be in front of other data processors.
var PRIORITY_PROCESSOR_DATASTACK = 900;
// AXIS_STATISTICS should be after SERIES_FILTER, as it may change the statistics result (like min gap).
// AXIS_STATISTICS should be before filter (dataZoom), as dataZoom require the result in "containShape" calculation.
var PRIORITY_PROCESSOR_AXIS_STATISTICS = 920;
// `PRIORITY_PROCESSOR_FILTER` is typically used by `dataZoom` (see `AxisProxy`), which relies
// on the initialized "axis extent".
var PRIORITY_PROCESSOR_FILTER = 1000;
var PRIORITY_PROCESSOR_DEFAULT = 2000;
var PRIORITY_PROCESSOR_STATISTICS = 5000;
// NOTICE: Data processors above block the stream (especially time-consuming processors like data filters).
var PRIORITY_VISUAL_LAYOUT = 1000;
var PRIORITY_VISUAL_PROGRESSIVE_LAYOUT = 1100;
var PRIORITY_VISUAL_GLOBAL = 2000;
var PRIORITY_VISUAL_CHART = 3000;
var PRIORITY_VISUAL_COMPONENT = 4000;
// Visual property in data. Greater than `PRIORITY_VISUAL_COMPONENT` to enable to
// overwrite the visual result of component (like `visualMap`)
// using data item specific setting (like itemStyle.xxx on data item)
var PRIORITY_VISUAL_CHART_DATA_CUSTOM = 4500;
// Greater than `PRIORITY_VISUAL_CHART_DATA_CUSTOM` to enable to layout based on
// visual result like `symbolSize`.
var PRIORITY_VISUAL_POST_CHART_LAYOUT = 4600;
var PRIORITY_VISUAL_BRUSH = 5000;
var PRIORITY_VISUAL_ARIA = 6000;
var PRIORITY_VISUAL_DECAL = 7000;
var PRIORITY = {
    PROCESSOR: {
        SERIES_FILTER: PRIORITY_PROCESSOR_SERIES_FILTER,
        AXIS_STATISTICS: PRIORITY_PROCESSOR_AXIS_STATISTICS,
        FILTER: PRIORITY_PROCESSOR_FILTER,
        STATISTIC: PRIORITY_PROCESSOR_STATISTICS,
        STATISTICS: PRIORITY_PROCESSOR_STATISTICS
    },
    VISUAL: {
        LAYOUT: PRIORITY_VISUAL_LAYOUT,
        PROGRESSIVE_LAYOUT: PRIORITY_VISUAL_PROGRESSIVE_LAYOUT,
        GLOBAL: PRIORITY_VISUAL_GLOBAL,
        CHART: PRIORITY_VISUAL_CHART,
        POST_CHART_LAYOUT: PRIORITY_VISUAL_POST_CHART_LAYOUT,
        COMPONENT: PRIORITY_VISUAL_COMPONENT,
        BRUSH: PRIORITY_VISUAL_BRUSH,
        CHART_ITEM: PRIORITY_VISUAL_CHART_DATA_CUSTOM,
        ARIA: PRIORITY_VISUAL_ARIA,
        DECAL: PRIORITY_VISUAL_DECAL
    }
};
/**
 * @tutorial [EC_CYCLE] (ec updating/rendering cycles):
 *
 *  - Common Rules:
 *    - Nested entry is not allowed. If triggering a new run of EC_CYCLE during a
 *      unfinished run, the new run will be delayed until the current run finishes
 *      (if triggered by `dispatchAction`), or throw error (if triggered by other API calls).
 *    - All user-visible ec events are triggered outside EC_CYCLE.
 *      (i.e. be triggered after `this[IN_EC_CYCLE_KEY]` becoming `false`).
 *
 *  - [EC_FULL_UPDATE_CYCLE]:
 *    - It designates a run of a series of processing/updating/rendering.
 *    - It is triggered by:
 *      - `setOption`
 *      - `dispatchAction`
 *        (It is typically internally triggered by user inputs; but can also an explicit API call.)
 *      - `resize`
 *      - The next "animation frame" if in `lazyMode: true`.
 *    - A run of EC_FULL_UPDATE_CYCLE comprises:
 *      - EC_PREPARE (may be absent)
 *      - EC_FULL_UPDATE:
 *        - CoordinateSystem['create']
 *        - Data processing (may be absent) (see `registerProcessor`)
 *        - CoordinateSystem['update'] (may be absent)
 *        - Visual encoding (may be absent) (see `registerVisual`)
 *        - Layout (may be absent) (see `registerLayout`)
 *        - Rendering (`ComponentView` or `SeriesView`)
 *
 *  - [EC_PARTIAL_UPDATE_CYCLE]s:
 *      - They are shortcuts for performance.
 *      - They are triggered by:
 *        - `dispatchAction`
 *      - These steps are typically omitted:
 *        - No EC_PREPARE
 *        - No CoordinateSystem['create'] and CoordinateSystem['update']
 *      - They require careful implementation, otherwise inconsistency may be introduced.
 *
 *  - [EC_PROGRESSIVE_CYCLE]:
 *    - It also carries out a series of processing/updating/rendering.
 *    - It is performed in each subsequent "animation frame" until finished.
 *    - It can be triggered by EC_FULL_UPDATE_CYCLE, EC_PARTIAL_UPDATE_CYCLE or EC_APPEND_DATA_CYCLE.
 *    - A run of EC_PROGRESSIVE_CYCLE comprises:
 *      - Data processing (may be absent) (see `registerProcessor`)
 *      - Visual encoding (may be absent) (see `registerVisual`)
 *      - Layout (may be absent) (see `registerLayout`)
 *      - Rendering (`ComponentView` or `SeriesView`)
 *    - PENDING: currently all data processing tasks (via `registerProcessor`) run in "block" mode.
 *      (see `performDataProcessorTasks`).
 *
 *  - [EC_APPEND_DATA_CYCLE]:
 *    - See `appendData`. It is only supported for some special cases.
 *
 *  - [SERIES_SPECIFIC_CYCLE]s:
 *    - Series may have specific update/render cycles. For example, graph force layout performs
 *      layout and rendering in each "animation frame".
 *
 *  - Model updating:
 *    - Model can only be modified at the beginning of ec cycles, including only:
 *      - EC_PREPARE (see method `prepare()`) in `setOption` call.
 *      - EC action handlers in `dispatchAction` call.
 *      - `appendData` (a special case, where only data can be modified).
 *
 *  - The lifetime of CoordinateSystem/Axis/Scale instances:
 *    - They are only re-created per run of EC_FULL_UPDATE_CYCLE.
 *
 *  - Global caches: see `cycleCache.ts`
 */ // See comments in EC_CYCLE.
var IN_EC_CYCLE_KEY = '__flagInMainProcess';
// Useful for detecting outdated rendering results for the following scenarios:
//  - In EC_PARTIAL_UPDATE_CYCLE, some rendering may be skipped.
//  - Asynchronously update rendered view (e.g., graph force layout).
//  - Multiple ChartView/ComponentView render to one group cooperatively.
var EC_UPDATE_CYCLE_VERSION_KEY = '__mainProcessVersion';
var PENDING_UPDATE = '__pendingUpdate';
var STATUS_NEEDS_UPDATE_KEY = '__needsUpdateStatus';
var ACTION_REG = /^[a-zA-Z0-9_]+$/;
var CONNECT_STATUS_KEY = '__connectUpdateStatus';
var CONNECT_STATUS_PENDING = 0;
var CONNECT_STATUS_UPDATING = 1;
var CONNECT_STATUS_UPDATED = 2;
;
;
function createRegisterEventWithLowercaseECharts(method) {
    return function() {
        var args = [];
        for(var _i = 0; _i < arguments.length; _i++){
            args[_i] = arguments[_i];
        }
        if (this.isDisposed()) {
            disposedWarning(this.id);
            return;
        }
        return toLowercaseNameAndCallEventful(this, method, args);
    };
}
function createRegisterEventWithLowercaseMessageCenter(method) {
    return function() {
        var args = [];
        for(var _i = 0; _i < arguments.length; _i++){
            args[_i] = arguments[_i];
        }
        return toLowercaseNameAndCallEventful(this, method, args);
    };
}
function toLowercaseNameAndCallEventful(host, method, args) {
    // `args[0]` is event name. Event name is all lowercase.
    args[0] = args[0] && args[0].toLowerCase();
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Eventful$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].prototype[method].apply(host, args);
}
var MessageCenter = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__extends"])(MessageCenter, _super);
    function MessageCenter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MessageCenter;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Eventful$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
var messageCenterProto = MessageCenter.prototype;
messageCenterProto.on = createRegisterEventWithLowercaseMessageCenter('on');
messageCenterProto.off = createRegisterEventWithLowercaseMessageCenter('off');
// ---------------------------------------
// Internal method names for class ECharts
// ---------------------------------------
// This is [EC_PREPARE].
var prepare;
var prepareView;
var updateDirectly;
var updateMethods;
var doConvertPixel;
var updateStreamModes;
var doDispatchAction;
var flushPendingActions;
var triggerUpdatedEvent;
var bindRenderedEvent;
var bindMouseEvent;
var render;
var renderComponents;
var renderSeries;
var createExtensionAPI;
var enableConnect;
var markStatusToUpdate;
var applyChangedStates;
var updateECUpdateCycleVersion;
var ECharts = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__extends"])(ECharts, _super);
    function ECharts(dom, // Theme name or themeOption.
    theme, opts) {
        var _this = _super.call(this, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$ECEventProcessor$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ECEventProcessor"]()) || this;
        _this._chartsViews = [];
        _this._chartsMap = {};
        _this._componentsViews = [];
        _this._componentsMap = {};
        // Can't dispatch action during rendering procedure
        _this._pendingActions = [];
        opts = opts || {};
        // mark the echarts instance as raw in Vue 3 to prevent the object being converted to be a proxy.
        _this.__v_skip = true;
        _this._dom = dom;
        var defaultRenderer = 'canvas';
        var defaultCoarsePointer = 'auto';
        var defaultUseDirtyRect = false;
        _this[EC_UPDATE_CYCLE_VERSION_KEY] = 1;
        if ("TURBOPACK compile-time truthy", 1) {
            var root = /* eslint-disable-next-line */ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$env$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].hasGlobalWindow ? window : /*TURBOPACK member replacement*/ __turbopack_context__.g;
            if (root) {
                defaultRenderer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(root.__ECHARTS__DEFAULT__RENDERER__, defaultRenderer);
                defaultCoarsePointer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(root.__ECHARTS__DEFAULT__COARSE_POINTER, defaultCoarsePointer);
                defaultUseDirtyRect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(root.__ECHARTS__DEFAULT__USE_DIRTY_RECT__, defaultUseDirtyRect);
            }
        }
        if (opts.ssr) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$zrender$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerSSRDataGetter"](function(el) {
                var ecData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getECData"])(el);
                var dataIndex = ecData.dataIndex;
                if (dataIndex == null) {
                    return;
                }
                var hashMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
                hashMap.set('series_index', ecData.seriesIndex);
                hashMap.set('data_index', dataIndex);
                ecData.ssrType && hashMap.set('ssr_type', ecData.ssrType);
                return hashMap;
            });
        }
        var zr = _this._zr = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$zrender$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["init"](dom, {
            renderer: opts.renderer || defaultRenderer,
            devicePixelRatio: opts.devicePixelRatio,
            width: opts.width,
            height: opts.height,
            ssr: opts.ssr,
            useDirtyRect: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(opts.useDirtyRect, defaultUseDirtyRect),
            useCoarsePointer: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(opts.useCoarsePointer, defaultCoarsePointer),
            pointerSize: opts.pointerSize
        });
        _this._ssr = opts.ssr;
        // Expect 60 fps.
        _this._throttledZrFlush = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$throttle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throttle"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bind"])(zr.flush, zr), 17);
        _this._updateTheme(theme);
        _this._locale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$locale$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createLocaleObject"])(opts.locale || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$locale$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SYSTEM_LANG"]);
        _this._coordSysMgr = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]();
        var api = _this._api = createExtensionAPI(_this);
        // Sort on demand
        function prioritySortFunc(a, b) {
            return a.__prio - b.__prio;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$timsort$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(visualFuncs, prioritySortFunc);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$timsort$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(dataProcessorFuncs, prioritySortFunc);
        _this._scheduler = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$Scheduler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](_this, api, dataProcessorFuncs, visualFuncs);
        _this._messageCenter = new MessageCenter();
        // Init mouse events
        _this._initEvents();
        // In case some people write `window.onresize = chart.resize`
        _this.resize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bind"])(_this.resize, _this);
        zr.animation.on('frame', _this._onframe, _this);
        bindRenderedEvent(zr, _this);
        bindMouseEvent(zr, _this);
        // ECharts instance can be used as value.
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAsPrimitive"])(_this);
        return _this;
    }
    ECharts.prototype._onframe = function() {
        if (this._disposed) {
            return;
        }
        var scheduler = this._scheduler;
        var ecModel = this._model;
        var api = this._api;
        applyChangedStates(this);
        // Lazy update
        if (this[PENDING_UPDATE]) {
            var silent = this[PENDING_UPDATE].silent;
            this[IN_EC_CYCLE_KEY] = true;
            updateECUpdateCycleVersion(this);
            try {
                prepare(this);
                updateMethods.update.call(this, null, this[PENDING_UPDATE].updateParams);
            } catch (e) {
                this[IN_EC_CYCLE_KEY] = false;
                this[PENDING_UPDATE] = null;
                throw e;
            }
            // At present, in each frame, zrender performs:
            //   (1) animation step forward.
            //   (2) trigger('frame') (where this `_onframe` is called)
            //   (3) zrender flush (render).
            // If we do nothing here, since we use `setToFinal: true`, the step (3) above
            // will render the final state of the elements before the real animation started.
            this._zr.flush();
            this[IN_EC_CYCLE_KEY] = false;
            this[PENDING_UPDATE] = null;
            flushPendingActions.call(this, silent);
            triggerUpdatedEvent.call(this, silent);
        } else if (scheduler.unfinished) {
            // Stream progress.
            var remainTime = TEST_FRAME_REMAIN_TIME;
            // PENDING: guard the following by `this[IN_EC_CYCLE_KEY] = true`?
            do {
                // Reset to false per iteration. Otherwise the last zr.flush
                // can not be triggered and 'finish' event can not be triggered.
                scheduler.unfinished = false;
                var startTime = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$platform$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["platformApi"].getTime();
                scheduler.performSeriesTasks(ecModel);
                // Currently dataProcessorFuncs do not check threshold.
                scheduler.performDataProcessorTasks(ecModel);
                updateStreamModes(this, ecModel);
                // Do not update coordinate system here. Because that coord system update in
                // each frame is not a good user experience. So we follow the rule that
                // the extent of the coordinate system is determined in the first frame (the
                // frame is executed immediately after task reset.
                // this._coordSysMgr.update(ecModel, api);
                // console.log('--- ec frame visual ---', remainTime);
                scheduler.performVisualTasks(ecModel);
                renderSeries(this, this._model, api, 'remain', {});
                remainTime -= __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$platform$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["platformApi"].getTime() - startTime;
            }while (remainTime > 0 && scheduler.unfinished)
            // Call flush explicitly for trigger finished event.
            if (!scheduler.unfinished) {
                this._zr.flush();
            }
        // Else, zr flushing be ensue within the same frame,
        // because zr flushing is after onframe event.
        }
    };
    ECharts.prototype.getDom = function() {
        return this._dom;
    };
    ECharts.prototype.getId = function() {
        return this.id;
    };
    ECharts.prototype.getZr = function() {
        return this._zr;
    };
    ECharts.prototype.isSSR = function() {
        return this._ssr;
    };
    /* eslint-disable-next-line */ ECharts.prototype.setOption = function(option, notMerge, lazyUpdate) {
        if (this[IN_EC_CYCLE_KEY]) {
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["error"])('`setOption` should not be called during main process.');
            }
            return;
        }
        if (this._disposed) {
            disposedWarning(this.id);
            return;
        }
        var silent;
        var replaceMerge;
        var transitionOpt;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(notMerge)) {
            lazyUpdate = notMerge.lazyUpdate;
            silent = notMerge.silent;
            replaceMerge = notMerge.replaceMerge;
            transitionOpt = notMerge.transition;
            notMerge = notMerge.notMerge;
        }
        this[IN_EC_CYCLE_KEY] = true;
        updateECUpdateCycleVersion(this);
        if (!this._model || notMerge) {
            var optionManager = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$OptionManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](this._api);
            var theme = this._theme;
            var ecModel = this._model = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Global$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]();
            ecModel.scheduler = this._scheduler;
            ecModel.ssr = this._ssr;
            ecModel.init(null, null, null, theme, this._locale, optionManager);
        }
        this._model.setOption(option, {
            replaceMerge: replaceMerge
        }, optionPreprocessorFuncs);
        var updateParams = {
            seriesTransition: transitionOpt,
            optionChanged: true
        };
        if (lazyUpdate) {
            this[PENDING_UPDATE] = {
                silent: silent,
                updateParams: updateParams
            };
            this[IN_EC_CYCLE_KEY] = false;
            // `setOption(option, {lazyMode: true})` may be called when zrender has been slept.
            // It should wake it up to make sure zrender start to render at the next frame.
            this.getZr().wakeUp();
        } else {
            try {
                prepare(this);
                updateMethods.update.call(this, null, updateParams);
            } catch (e) {
                this[PENDING_UPDATE] = null;
                this[IN_EC_CYCLE_KEY] = false;
                throw e;
            }
            // Ensure zr refresh sychronously, and then pixel in canvas can be
            // fetched after `setOption`.
            if (!this._ssr) {
                // not use flush when using ssr mode.
                this._zr.flush();
            }
            this[PENDING_UPDATE] = null;
            this[IN_EC_CYCLE_KEY] = false;
            flushPendingActions.call(this, silent);
            triggerUpdatedEvent.call(this, silent);
        }
    };
    /**
   * Update theme with name or theme option and repaint the chart.
   * @param theme Theme name or theme option.
   * @param opts Optional settings
   */ ECharts.prototype.setTheme = function(theme, opts) {
        if (this[IN_EC_CYCLE_KEY]) {
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["error"])('`setTheme` should not be called during main process.');
            }
            return;
        }
        if (this._disposed) {
            disposedWarning(this.id);
            return;
        }
        var ecModel = this._model;
        if (!ecModel) {
            return;
        }
        var silent = opts && opts.silent;
        var updateParams = null;
        if (this[PENDING_UPDATE]) {
            if (silent == null) {
                silent = this[PENDING_UPDATE].silent;
            }
            updateParams = this[PENDING_UPDATE].updateParams;
            this[PENDING_UPDATE] = null;
        }
        this[IN_EC_CYCLE_KEY] = true;
        updateECUpdateCycleVersion(this);
        try {
            this._updateTheme(theme);
            ecModel.setTheme(this._theme);
            prepare(this);
            updateMethods.update.call(this, {
                type: 'setTheme'
            }, updateParams);
        } catch (e) {
            this[IN_EC_CYCLE_KEY] = false;
            throw e;
        }
        this[IN_EC_CYCLE_KEY] = false;
        flushPendingActions.call(this, silent);
        triggerUpdatedEvent.call(this, silent);
    };
    ECharts.prototype._updateTheme = function(theme) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(theme)) {
            theme = themeStorage[theme];
        }
        if (theme) {
            theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clone"])(theme);
            theme && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$preprocessor$2f$backwardCompat$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(theme, true);
            this._theme = theme;
        }
    };
    // We don't want developers to use getModel directly.
    ECharts.prototype.getModel = function() {
        return this._model;
    };
    ECharts.prototype.getOption = function() {
        return this._model && this._model.getOption();
    };
    ECharts.prototype.getWidth = function() {
        return this._zr.getWidth();
    };
    ECharts.prototype.getHeight = function() {
        return this._zr.getHeight();
    };
    ECharts.prototype.getDevicePixelRatio = function() {
        return this._zr.painter.dpr || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$env$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].hasGlobalWindow && window.devicePixelRatio || 1;
    };
    /**
   * Get canvas which has all thing rendered
   * @deprecated Use renderToCanvas instead.
   */ ECharts.prototype.getRenderedCanvas = function(opts) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateReplaceLog"])('getRenderedCanvas', 'renderToCanvas');
        }
        return this.renderToCanvas(opts);
    };
    ECharts.prototype.renderToCanvas = function(opts) {
        opts = opts || {};
        var painter = this._zr.painter;
        if ("TURBOPACK compile-time truthy", 1) {
            if (painter.type !== 'canvas') {
                throw new Error('renderToCanvas can only be used in the canvas renderer.');
            }
        }
        return painter.getRenderedCanvas({
            backgroundColor: opts.backgroundColor || this._model.get('backgroundColor'),
            pixelRatio: opts.pixelRatio || this.getDevicePixelRatio()
        });
    };
    ECharts.prototype.renderToSVGString = function(opts) {
        opts = opts || {};
        var painter = this._zr.painter;
        if ("TURBOPACK compile-time truthy", 1) {
            if (painter.type !== 'svg') {
                throw new Error('renderToSVGString can only be used in the svg renderer.');
            }
        }
        return painter.renderToString({
            useViewBox: opts.useViewBox
        });
    };
    /**
   * Get svg data url
   */ ECharts.prototype.getSvgDataURL = function() {
        var zr = this._zr;
        var list = zr.storage.getDisplayList();
        // Stop animations
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(list, function(el) {
            el.stopAnimation(null, true);
        });
        return zr.painter.toDataURL();
    };
    ECharts.prototype.getDataURL = function(opts) {
        if (this._disposed) {
            disposedWarning(this.id);
            return;
        }
        opts = opts || {};
        var excludeComponents = opts.excludeComponents;
        var ecModel = this._model;
        var excludesComponentViews = [];
        var self = this;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(excludeComponents, function(componentType) {
            ecModel.eachComponent({
                mainType: componentType
            }, function(component) {
                var view = self._componentsMap[component.__viewId];
                if (!view.group.ignore) {
                    excludesComponentViews.push(view);
                    view.group.ignore = true;
                }
            });
        });
        var url = this._zr.painter.getType() === 'svg' ? this.getSvgDataURL() : this.renderToCanvas(opts).toDataURL('image/' + (opts && opts.type || 'png'));
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(excludesComponentViews, function(view) {
            view.group.ignore = false;
        });
        return url;
    };
    ECharts.prototype.getConnectedDataURL = function(opts) {
        if (this._disposed) {
            disposedWarning(this.id);
            return;
        }
        var isSvg = opts.type === 'svg';
        var groupId = this.group;
        var mathMin = Math.min;
        var mathMax = Math.max;
        var MAX_NUMBER = Infinity;
        if (connectedGroups[groupId]) {
            var left_1 = MAX_NUMBER;
            var top_1 = MAX_NUMBER;
            var right_1 = -MAX_NUMBER;
            var bottom_1 = -MAX_NUMBER;
            var canvasList_1 = [];
            var dpr_1 = opts && opts.pixelRatio || this.getDevicePixelRatio();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(instances, function(chart, id) {
                if (chart.group === groupId) {
                    var canvas = isSvg ? chart.getZr().painter.getSvgDom().innerHTML : chart.renderToCanvas((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clone"])(opts));
                    var boundingRect = chart.getDom().getBoundingClientRect();
                    left_1 = mathMin(boundingRect.left, left_1);
                    top_1 = mathMin(boundingRect.top, top_1);
                    right_1 = mathMax(boundingRect.right, right_1);
                    bottom_1 = mathMax(boundingRect.bottom, bottom_1);
                    canvasList_1.push({
                        dom: canvas,
                        left: boundingRect.left,
                        top: boundingRect.top
                    });
                }
            });
            left_1 *= dpr_1;
            top_1 *= dpr_1;
            right_1 *= dpr_1;
            bottom_1 *= dpr_1;
            var width = right_1 - left_1;
            var height = bottom_1 - top_1;
            var targetCanvas = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$platform$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["platformApi"].createCanvas();
            var zr_1 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$zrender$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["init"](targetCanvas, {
                renderer: isSvg ? 'svg' : 'canvas'
            });
            zr_1.resize({
                width: width,
                height: height
            });
            if (isSvg) {
                var content_1 = '';
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(canvasList_1, function(item) {
                    var x = item.left - left_1;
                    var y = item.top - top_1;
                    content_1 += '<g transform="translate(' + x + ',' + y + ')">' + item.dom + '</g>';
                });
                zr_1.painter.getSvgRoot().innerHTML = content_1;
                if (opts.connectedBackgroundColor) {
                    zr_1.painter.setBackgroundColor(opts.connectedBackgroundColor);
                }
                zr_1.refreshImmediately();
                return zr_1.painter.toDataURL();
            } else {
                // Background between the charts
                if (opts.connectedBackgroundColor) {
                    zr_1.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Rect$3e$__["Rect"]({
                        shape: {
                            x: 0,
                            y: 0,
                            width: width,
                            height: height
                        },
                        style: {
                            fill: opts.connectedBackgroundColor
                        }
                    }));
                }
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(canvasList_1, function(item) {
                    var img = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"]({
                        style: {
                            x: item.left * dpr_1 - left_1,
                            y: item.top * dpr_1 - top_1,
                            image: item.dom
                        }
                    });
                    zr_1.add(img);
                });
                zr_1.refreshImmediately();
                return targetCanvas.toDataURL('image/' + (opts && opts.type || 'png'));
            }
        } else {
            return this.getDataURL(opts);
        }
    };
    ECharts.prototype.convertToPixel = function(finder, value, opt) {
        return doConvertPixel(this, 'convertToPixel', finder, value, opt);
    };
    /**
   * Convert from logical coordinate system to pixel coordinate system.
   * See CoordinateSystem#convertToPixel.
   *
   * @see CoordinateSystem['dataToLayout'] for parameters and return.
   * @see CoordinateSystemDataCoord
   */ ECharts.prototype.convertToLayout = function(finder, value, opt) {
        return doConvertPixel(this, 'convertToLayout', finder, value, opt);
    };
    // The above are signatures from before v6, thus they should be preserved for backward compat.
    ECharts.prototype.convertFromPixel = function(finder, value, opt) {
        return doConvertPixel(this, 'convertFromPixel', finder, value, opt);
    };
    /**
   * Is the specified coordinate systems or components contain the given pixel point.
   * @param {Array|number} value
   * @return {boolean} result
   */ ECharts.prototype.containPixel = function(finder, value) {
        if (this._disposed) {
            disposedWarning(this.id);
            return;
        }
        var ecModel = this._model;
        var result;
        var findResult = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseFinder"](ecModel, finder);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(findResult, function(models, key) {
            key.indexOf('Models') >= 0 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(models, function(model) {
                var coordSys = model.coordinateSystem;
                if (coordSys && coordSys.containPoint) {
                    result = result || !!coordSys.containPoint(value);
                } else if (key === 'seriesModels') {
                    var view = this._chartsMap[model.__viewId];
                    if (view && view.containPoint) {
                        result = result || view.containPoint(value, model);
                    } else {
                        if ("TURBOPACK compile-time truthy", 1) {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warn"])(key + ': ' + (view ? 'The found component do not support containPoint.' : 'No view mapping to the found component.'));
                        }
                    }
                } else {
                    if ("TURBOPACK compile-time truthy", 1) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warn"])(key + ': containPoint is not supported');
                    }
                }
            }, this);
        }, this);
        return !!result;
    };
    /**
   * Get visual from series or data.
   * @param finder
   *        If string, e.g., 'series', means {seriesIndex: 0}.
   *        If Object, could contain some of these properties below:
   *        {
   *            seriesIndex / seriesId / seriesName,
   *            dataIndex / dataIndexInside
   *        }
   *        If dataIndex is not specified, series visual will be fetched,
   *        but not data item visual.
   *        If all of seriesIndex, seriesId, seriesName are not specified,
   *        visual will be fetched from first series.
   * @param visualType 'color', 'symbol', 'symbolSize'
   */ ECharts.prototype.getVisual = function(finder, visualType) {
        var ecModel = this._model;
        var parsedFinder = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseFinder"](ecModel, finder, {
            defaultMainType: 'series'
        });
        var seriesModel = parsedFinder.seriesModel;
        if ("TURBOPACK compile-time truthy", 1) {
            if (!seriesModel) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warn"])('There is no specified series model');
            }
        }
        var data = seriesModel.getData();
        var dataIndexInside = parsedFinder.hasOwnProperty('dataIndexInside') ? parsedFinder.dataIndexInside : parsedFinder.hasOwnProperty('dataIndex') ? data.indexOfRawIndex(parsedFinder.dataIndex) : null;
        return dataIndexInside != null ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getItemVisualFromData"])(data, dataIndexInside, visualType) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getVisualFromData"])(data, visualType);
    };
    /**
   * Get view of corresponding component model
   */ ECharts.prototype.getViewOfComponentModel = function(componentModel) {
        return this._componentsMap[componentModel.__viewId];
    };
    /**
   * Get view of corresponding series model
   */ ECharts.prototype.getViewOfSeriesModel = function(seriesModel) {
        return this._chartsMap[seriesModel.__viewId];
    };
    ECharts.prototype._initEvents = function() {
        var _this = this;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(MOUSE_EVENT_NAMES, function(eveName) {
            var handler = function(e) {
                var ecModel = _this.getModel();
                var el = e.target;
                var params;
                var isGlobalOut = eveName === 'globalout';
                // no e.target when 'globalout'.
                if (isGlobalOut) {
                    params = {};
                } else {
                    el && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findEventDispatcher"])(el, function(parent) {
                        var ecData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getECData"])(parent);
                        if (ecData && ecData.dataIndex != null) {
                            var dataModel = ecData.dataModel || ecModel.getSeriesByIndex(ecData.seriesIndex);
                            params = dataModel && dataModel.getDataParams(ecData.dataIndex, ecData.dataType, el) || {};
                            return true;
                        } else if (ecData.eventData) {
                            params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"])({}, ecData.eventData);
                            return true;
                        }
                    }, true);
                }
                // Contract: if params prepared in mouse event,
                // these properties must be specified:
                // {
                //    componentType: string (component main type)
                //    componentIndex: number
                // }
                // Otherwise event query can not work.
                if (params) {
                    var componentType = params.componentType;
                    var componentIndex = params.componentIndex;
                    // Special handling for historic reason: when trigger by
                    // markLine/markPoint/markArea, the componentType is
                    // 'markLine'/'markPoint'/'markArea', but we should better
                    // enable them to be queried by seriesIndex, since their
                    // option is set in each series.
                    if (componentType === 'markLine' || componentType === 'markPoint' || componentType === 'markArea') {
                        componentType = 'series';
                        componentIndex = params.seriesIndex;
                    }
                    var model = componentType && componentIndex != null && ecModel.getComponent(componentType, componentIndex);
                    var view = model && _this[model.mainType === 'series' ? '_chartsMap' : '_componentsMap'][model.__viewId];
                    if ("TURBOPACK compile-time truthy", 1) {
                        // `event.componentType` and `event[componentTpype + 'Index']` must not
                        // be missed, otherwise there is no way to distinguish source component.
                        // See `dataFormat.getDataParams`.
                        if (!isGlobalOut && !(model && view)) {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warn"])('model or view can not be found by params');
                        }
                    }
                    params.event = e;
                    params.type = eveName;
                    _this._$eventProcessor.eventInfo = {
                        targetEl: el,
                        packedEvent: params,
                        model: model,
                        view: view
                    };
                    _this.trigger(eveName, params);
                }
            };
            // Consider that some component (like tooltip, brush, ...)
            // register zr event handler, but user event handler might
            // do anything, such as call `setOption` or `dispatchAction`,
            // which probably update any of the content and probably
            // cause problem if it is called previous other inner handlers.
            handler.zrEventfulCallAtLast = true;
            _this._zr.on(eveName, handler, _this);
        });
        var messageCenter = this._messageCenter;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(publicEventTypeMap, function(_, eventType) {
            messageCenter.on(eventType, function(event) {
                _this.trigger(eventType, event);
            });
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$legacy$2f$dataSelectAction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleLegacySelectEvents"])(messageCenter, this, this._api);
    };
    ECharts.prototype.isDisposed = function() {
        return this._disposed;
    };
    ECharts.prototype.clear = function() {
        if (this._disposed) {
            disposedWarning(this.id);
            return;
        }
        this.setOption({
            series: []
        }, true);
    };
    ECharts.prototype.dispose = function() {
        if (this._disposed) {
            disposedWarning(this.id);
            return;
        }
        this._disposed = true;
        var dom = this.getDom();
        if (dom) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAttribute"](this.getDom(), DOM_ATTRIBUTE_KEY, '');
        }
        var chart = this;
        var api = chart._api;
        var ecModel = chart._model;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(chart._componentsViews, function(component) {
            component.dispose(ecModel, api);
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(chart._chartsViews, function(chart) {
            chart.dispose(ecModel, api);
        });
        // Dispose after all views disposed
        chart._zr.dispose();
        // Set properties to null.
        // To reduce the memory cost in case the top code still holds this instance unexpectedly.
        chart._dom = chart._model = chart._chartsMap = chart._componentsMap = chart._chartsViews = chart._componentsViews = chart._scheduler = chart._api = chart._zr = chart._throttledZrFlush = chart._theme = chart._coordSysMgr = chart._messageCenter = null;
        delete instances[chart.id];
    };
    /**
   * Resize the chart
   */ ECharts.prototype.resize = function(opts) {
        if (this[IN_EC_CYCLE_KEY]) {
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["error"])('`resize` should not be called during main process.');
            }
            return;
        }
        if (this._disposed) {
            disposedWarning(this.id);
            return;
        }
        this._zr.resize(opts);
        var ecModel = this._model;
        // Resize loading effect
        this._loadingFX && this._loadingFX.resize();
        if (!ecModel) {
            return;
        }
        var needPrepare = ecModel.resetOption('media');
        var silent = opts && opts.silent;
        // There is some real cases that:
        // chart.setOption(option, { lazyUpdate: true });
        // chart.resize();
        if (this[PENDING_UPDATE]) {
            if (silent == null) {
                silent = this[PENDING_UPDATE].silent;
            }
            needPrepare = true;
            this[PENDING_UPDATE] = null;
        }
        this[IN_EC_CYCLE_KEY] = true;
        updateECUpdateCycleVersion(this);
        try {
            needPrepare && prepare(this);
            updateMethods.update.call(this, {
                type: 'resize',
                animation: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"])({
                    // Disable animation
                    duration: 0
                }, opts && opts.animation)
            });
        } catch (e) {
            this[IN_EC_CYCLE_KEY] = false;
            throw e;
        }
        this[IN_EC_CYCLE_KEY] = false;
        flushPendingActions.call(this, silent);
        triggerUpdatedEvent.call(this, silent);
    };
    ECharts.prototype.showLoading = function(name, cfg) {
        if (this._disposed) {
            disposedWarning(this.id);
            return;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(name)) {
            cfg = name;
            name = '';
        }
        name = name || 'default';
        this.hideLoading();
        if (!loadingEffects[name]) {
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warn"])('Loading effects ' + name + ' not exists.');
            }
            return;
        }
        var el = loadingEffects[name](this._api, cfg);
        var zr = this._zr;
        this._loadingFX = el;
        zr.add(el);
    };
    /**
   * Hide loading effect
   */ ECharts.prototype.hideLoading = function() {
        if (this._disposed) {
            disposedWarning(this.id);
            return;
        }
        this._loadingFX && this._zr.remove(this._loadingFX);
        this._loadingFX = null;
    };
    ECharts.prototype.makeActionFromEvent = function(eventObj) {
        var payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"])({}, eventObj);
        payload.type = connectionEventRevertMap[eventObj.type];
        return payload;
    };
    /**
   * @param opt If pass boolean, means opt.silent
   * @param opt.silent Default `false`. Whether trigger events.
   * @param opt.flush Default `undefined`.
   *        true: Flush immediately, and then pixel in canvas can be fetched
   *            immediately. Caution: it might affect performance.
   *        false: Not flush.
   *        undefined: Auto decide whether perform flush.
   */ ECharts.prototype.dispatchAction = function(payload, opt) {
        if (this._disposed) {
            disposedWarning(this.id);
            return;
        }
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(opt)) {
            opt = {
                silent: !!opt
            };
        }
        if (!actions[payload.type]) {
            return;
        }
        // Avoid dispatch action before setOption. Especially in `connect`.
        if (!this._model) {
            return;
        }
        // May dispatchAction in rendering procedure
        if (this[IN_EC_CYCLE_KEY]) {
            this._pendingActions.push(payload);
            return;
        }
        var silent = opt.silent;
        doDispatchAction.call(this, payload, silent);
        var flush = opt.flush;
        if (flush) {
            this._zr.flush();
        } else if (flush !== false && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$env$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].browser.weChat) {
            // In WeChat embedded browser, `requestAnimationFrame` and `setInterval`
            // hang when sliding page (on touch event), which cause that zr does not
            // refresh until user interaction finished, which is not expected.
            // But `dispatchAction` may be called too frequently when pan on touch
            // screen, which impacts performance if do not throttle them.
            this._throttledZrFlush();
        }
        flushPendingActions.call(this, silent);
        triggerUpdatedEvent.call(this, silent);
    };
    ECharts.prototype.updateLabelLayout = function() {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$lifecycle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].trigger('series:layoutlabels', this._model, this._api, {
            // Not adding series labels.
            // TODO
            updatedSeries: []
        });
    };
    ECharts.prototype.appendData = function(params) {
        if (this._disposed) {
            disposedWarning(this.id);
            return;
        }
        var seriesIndex = params.seriesIndex;
        var ecModel = this.getModel();
        var seriesModel = ecModel.getSeriesByIndex(seriesIndex);
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(params.data && seriesModel);
        }
        seriesModel.appendData(params);
        // NOTICE:
        // `appendData` does not support to update axis scale extent of coordinate
        // systems. In the expected usage of `appendData`, the initial extent of
        // coordinate system should be explicitly specified (by `xxxAxis.data` for
        // 'category' axis or by `xxxAxis.min/max` for other axes). Otherwise, if
        // the extent keep changing while `appendData`, the location of the painted
        // graphic elements have to be changed frequently.
        this._scheduler.unfinished = true;
        this.getZr().wakeUp();
    };
    // A work around for no `internal` modifier in ts yet but
    // need to strictly hide private methods to JS users.
    ECharts.internalField = function() {
        prepare = function(ecIns) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$cycleCache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resetCachePerECPrepare"])(ecIns._model);
            var scheduler = ecIns._scheduler;
            scheduler.restorePipelines(ecIns._zr, ecIns._model);
            scheduler.prepareStageTasks();
            prepareView(ecIns, true);
            prepareView(ecIns, false);
            scheduler.plan();
        };
        /**
     * Prepare view instances of charts and components
     */ prepareView = function(ecIns, isComponent) {
            var ecModel = ecIns._model;
            var scheduler = ecIns._scheduler;
            var viewList = isComponent ? ecIns._componentsViews : ecIns._chartsViews;
            var viewMap = isComponent ? ecIns._componentsMap : ecIns._chartsMap;
            var zr = ecIns._zr;
            var api = ecIns._api;
            for(var i = 0; i < viewList.length; i++){
                viewList[i].__alive = false;
            }
            isComponent ? ecModel.eachComponent(function(componentType, model) {
                componentType !== 'series' && doPrepare(model);
            }) : ecModel.eachSeries(doPrepare);
            function doPrepare(model) {
                // By default view will be reused if possible for the case that `setOption` with "notMerge"
                // mode and need to enable transition animation. (Usually, when they have the same id, or
                // especially no id but have the same type & name & index. See the `model.id` generation
                // rule in `makeIdAndName` and `viewId` generation rule here).
                // But in `replaceMerge` mode, this feature should be able to disabled when it is clear that
                // the new model has nothing to do with the old model.
                var requireNewView = model.__requireNewView;
                // This command should not work twice.
                model.__requireNewView = false;
                // Consider: id same and type changed.
                var viewId = '_ec_' + model.id + '_' + model.type;
                var view = !requireNewView && viewMap[viewId];
                if (!view) {
                    var classType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseClassType"])(model.type);
                    var Clazz = isComponent ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getClass(classType.main, classType.sub) : // FIXME:TS
                    // (ChartView as ChartViewConstructor).getClass('series', classType.sub)
                    // For backward compat, still support a chart type declared as only subType
                    // like "liquidfill", but recommend "series.liquidfill"
                    // But need a base class to make a type series.
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getClass(classType.sub);
                    if ("TURBOPACK compile-time truthy", 1) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(Clazz, classType.sub + ' does not exist.');
                    }
                    view = new Clazz();
                    view.init(ecModel, api);
                    viewMap[viewId] = view;
                    viewList.push(view);
                    zr.add(view.group);
                }
                model.__viewId = view.__id = viewId;
                view.__alive = true;
                view.__model = model;
                view.group.__ecComponentInfo = {
                    mainType: model.mainType,
                    index: model.componentIndex
                };
                !isComponent && scheduler.prepareView(view, model, ecModel, api);
            }
            for(var i = 0; i < viewList.length;){
                var view = viewList[i];
                if (!view.__alive) {
                    !isComponent && view.renderTask.dispose();
                    zr.remove(view.group);
                    view.dispose(ecModel, api);
                    viewList.splice(i, 1);
                    if (viewMap[view.__id] === view) {
                        delete viewMap[view.__id];
                    }
                    view.__id = view.group.__ecComponentInfo = null;
                } else {
                    i++;
                }
            }
        };
        updateDirectly = function(ecIns, method, payload, mainType, subType) {
            var ecModel = ecIns._model;
            ecModel.setUpdatePayload(payload);
            // broadcast (e.g., for ':updateAxisPointer')
            if (!mainType) {
                // FIXME
                // Chart will not be update directly here, except set dirty.
                // But there is no such scenario now.
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])([].concat(ecIns._componentsViews).concat(ecIns._chartsViews), callView);
                return;
            }
            var condition = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeQueryConditionKindA"](payload, mainType, subType);
            var excludeSeriesId = payload.excludeSeriesId;
            var excludeSeriesIdMap;
            if (excludeSeriesId != null) {
                excludeSeriesIdMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeToArray"](excludeSeriesId), function(id) {
                    var modelId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["convertOptionIdName"](id, null);
                    if (modelId != null) {
                        excludeSeriesIdMap.set(modelId, true);
                    }
                });
            }
            // If dispatchAction before setOption, do nothing.
            ecModel && ecModel.eachComponent(condition, function(model) {
                var isExcluded = excludeSeriesIdMap && excludeSeriesIdMap.get(model.id) != null;
                if (isExcluded) {
                    return;
                }
                ;
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isHighDownPayload"])(payload)) {
                    if (model instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]) {
                        if (payload.type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HIGHLIGHT_ACTION_TYPE"] && !payload.notBlur && !model.get([
                            'emphasis',
                            'disabled'
                        ])) {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["blurSeriesFromHighlightPayload"])(model, payload, ecIns._api);
                        }
                    } else {
                        var _a = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findComponentHighDownDispatchers"])(model.mainType, model.componentIndex, payload.name, ecIns._api), focusSelf = _a.focusSelf, dispatchers = _a.dispatchers;
                        if (payload.type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HIGHLIGHT_ACTION_TYPE"] && focusSelf && !payload.notBlur) {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["blurComponent"])(model.mainType, model.componentIndex, ecIns._api);
                        }
                        // PENDING:
                        // Whether to put this "enter emphasis" code in `ComponentView`,
                        // which will be the same as `ChartView` but might be not necessary
                        // and will be far from this logic.
                        if (dispatchers) {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(dispatchers, function(dispatcher) {
                                payload.type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HIGHLIGHT_ACTION_TYPE"] ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["enterEmphasis"])(dispatcher) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["leaveEmphasis"])(dispatcher);
                            });
                        }
                    }
                } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isSelectChangePayload"])(payload)) {
                    // TODO geo
                    if (model instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toggleSelectionFromPayload"])(model, payload, ecIns._api);
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateSeriesElementSelection"])(model);
                        markStatusToUpdate(ecIns);
                    }
                }
            }, ecIns);
            ecModel && ecModel.eachComponent(condition, function(model) {
                var isExcluded = excludeSeriesIdMap && excludeSeriesIdMap.get(model.id) != null;
                if (isExcluded) {
                    return;
                }
                ;
                callView(ecIns[mainType === 'series' ? '_chartsMap' : '_componentsMap'][model.__viewId]);
            }, ecIns);
            function callView(view) {
                view && view.__alive && view[method] && view[method](view.__model, ecModel, ecIns._api, payload);
            }
        };
        updateMethods = {
            prepareAndUpdate: function(payload) {
                prepare(this);
                updateMethods.update.call(this, payload, payload && {
                    // Needs to mark option changed if newOption is given.
                    // It's from MagicType.
                    // TODO If use a separate flag optionChanged in payload?
                    optionChanged: payload.newOption != null
                });
            },
            update: function(payload, updateParams) {
                var ecModel = this._model;
                var api = this._api;
                var zr = this._zr;
                var coordSysMgr = this._coordSysMgr;
                var scheduler = this._scheduler;
                // update before setOption
                if (!ecModel) {
                    return;
                }
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$cycleCache$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resetCachePerECFullUpdate"])(ecModel);
                ecModel.setUpdatePayload(payload);
                scheduler.restoreData(ecModel, payload);
                scheduler.performSeriesTasks(ecModel);
                // TODO
                // Save total ecModel here for undo/redo (after restoring data and before processing data).
                // Undo (restoration of total ecModel) can be carried out in 'action' or outside API call.
                // Create new coordinate system each update
                // In LineView may save the old coordinate system and use it to get the original point.
                coordSysMgr.create(ecModel, api);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$lifecycle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].trigger('coordsys:aftercreate', ecModel, api);
                scheduler.performDataProcessorTasks(ecModel, payload);
                // Current stream render is not supported in data process. So we can update
                // stream modes after data processing, where the filtered data is used to
                // determine whether to use progressive rendering.
                updateStreamModes(this, ecModel);
                // We update stream modes before coordinate system updated, then the modes info
                // can be fetched when coord sys updating (consider the barGrid extent fix). But
                // the drawback is the full coord info can not be fetched. Fortunately this full
                // coord is not required in stream mode updater currently.
                coordSysMgr.update(ecModel, api);
                clearColorPalette(ecModel);
                scheduler.performVisualTasks(ecModel, payload);
                // Set background and dark mode before rendering, because they affect auto-color-determination
                // in zrender Text, and consequently affect the bounding rect if stroke is added.
                var backgroundColor = ecModel.get('backgroundColor') || 'transparent';
                zr.setBackgroundColor(backgroundColor);
                // Force set dark mode.
                var darkMode = ecModel.get('darkMode');
                if (darkMode != null && darkMode !== 'auto') {
                    zr.setDarkMode(darkMode);
                }
                render(this, ecModel, api, payload, updateParams);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$lifecycle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].trigger('afterupdate', ecModel, api);
            },
            /**
       * PENDING: See INCONSISTENCY_OF_BRUSH_SELECTED_EVENT_IN_UPDATE_TRANSFORM
       */ updateTransform: function(payload) {
                var ecIns = this;
                var ecModel = ecIns._model;
                var api = ecIns._api;
                // update before setOption
                if (!ecModel) {
                    return;
                }
                ecModel.setUpdatePayload(payload);
                // ChartView.markUpdateMethod(payload, 'updateTransform');
                var componentDirtyList = [];
                ecModel.eachComponent(function(mainType, componentModel) {
                    if (mainType === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMPONENT_MAIN_TYPE_SERIES"]) {
                        return;
                    }
                    var componentView = ecIns.getViewOfComponentModel(componentModel);
                    if (componentView && componentView.__alive) {
                        if (componentView.updateTransform) {
                            var result = componentView.updateTransform(componentModel, ecModel, api, payload);
                            result && result.update && componentDirtyList.push(componentView);
                        } else {
                            componentDirtyList.push(componentView);
                        }
                    }
                });
                var seriesDirtyMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
                ecModel.eachSeries(function(seriesModel) {
                    var chartView = ecIns._chartsMap[seriesModel.__viewId];
                    var pipelineContext = seriesModel.pipelineContext;
                    if (chartView.updateTransform && !pipelineContext.progressiveRender) {
                        var result = chartView.updateTransform(seriesModel, ecModel, api, payload);
                        result && result.update && seriesDirtyMap.set(seriesModel.uid, 1);
                    } else {
                        seriesDirtyMap.set(seriesModel.uid, 1);
                    }
                });
                // Palette should not be cleared, otherwise the variation of dirty series
                // can cause color change unexpectedly.
                // clearColorPalette(ecModel);
                // NOTICE: series data tasks must NOT be dirty, otherwise series data will be recreated.
                // Keep pipe to the exist pipeline because it depends on the render task of the full pipeline.
                // this._scheduler.performVisualTasks(ecModel, payload, 'layout', true);
                ecIns._scheduler.performVisualTasks(ecModel, payload, {
                    setDirty: true,
                    dirtyMap: seriesDirtyMap
                });
                // Currently, not call render of components. Geo render cost a lot.
                // renderComponents(ecIns, ecModel, api, payload, componentDirtyList);
                renderSeries(ecIns, ecModel, api, payload, {}, seriesDirtyMap);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$lifecycle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].trigger('afterupdate', ecModel, api);
            },
            updateView: function(payload) {
                var ecModel = this._model;
                // update before setOption
                if (!ecModel) {
                    return;
                }
                ecModel.setUpdatePayload(payload);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].markUpdateMethod(payload, 'updateView');
                clearColorPalette(ecModel);
                // Keep pipe to the exist pipeline because it depends on the render task of the full pipeline.
                this._scheduler.performVisualTasks(ecModel, payload, {
                    setDirty: true
                });
                render(this, ecModel, this._api, payload, {});
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$lifecycle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].trigger('afterupdate', ecModel, this._api);
            },
            updateVisual: function(payload) {
                var _this = this;
                var ecModel = this._model;
                // update before setOption
                if (!ecModel) {
                    return;
                }
                ecModel.setUpdatePayload(payload);
                // clear all visual
                ecModel.eachSeries(function(seriesModel) {
                    seriesModel.getData().clearAllVisual();
                });
                // Perform visual
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].markUpdateMethod(payload, 'updateVisual');
                clearColorPalette(ecModel);
                // Keep pipe to the exist pipeline because it depends on the render task of the full pipeline.
                this._scheduler.performVisualTasks(ecModel, payload, {
                    visualType: 'visual',
                    setDirty: true
                });
                // FIXME: `visualType` may be removed, since it conflicts with `priority` of task. `updateVisual`
                // can be altered to start the pipeline with a certain priority, rather than only execute tasks
                // with `visualType: 'visual'`, otherwise, PRIORITY_VISUAL_POST_CHART_LAYOUT is omitted in this
                // case. Currently, only "brush" uses `updateVisual`, and it works by coincidence.
                ecModel.eachComponent(function(componentType, componentModel) {
                    if (componentType !== 'series') {
                        var componentView = _this.getViewOfComponentModel(componentModel);
                        componentView && componentView.__alive && componentView.updateVisual(componentModel, ecModel, _this._api, payload);
                    }
                });
                ecModel.eachSeries(function(seriesModel) {
                    var chartView = _this._chartsMap[seriesModel.__viewId];
                    chartView.updateVisual(seriesModel, ecModel, _this._api, payload);
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$lifecycle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].trigger('afterupdate', ecModel, this._api);
            },
            /**
       * @deprecated
       */ updateLayout: function(payload) {
                updateMethods.update.call(this, payload);
            }
        };
        function doConvertPixelImpl(ecIns, methodName, finder, value, opt) {
            if (ecIns._disposed) {
                disposedWarning(ecIns.id);
                return;
            }
            var ecModel = ecIns._model;
            var coordSysList = ecIns._coordSysMgr.getCoordinateSystems();
            var result;
            var parsedFinder = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseFinder"](ecModel, finder);
            for(var i = 0; i < coordSysList.length; i++){
                var coordSys = coordSysList[i];
                if (coordSys[methodName] && (result = coordSys[methodName](ecModel, parsedFinder, value, opt)) != null) {
                    return result;
                }
            }
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warn"])('No coordinate system that supports ' + methodName + ' found by the given finder.');
            }
        }
        ;
        doConvertPixel = doConvertPixelImpl;
        updateStreamModes = function(ecIns, ecModel) {
            var chartsMap = ecIns._chartsMap;
            var scheduler = ecIns._scheduler;
            ecModel.eachSeries(function(seriesModel) {
                scheduler.updateStreamModes(seriesModel, chartsMap[seriesModel.__viewId]);
            });
        };
        doDispatchAction = function(payload, silent) {
            var _this = this;
            var ecModel = this.getModel();
            var payloadType = payload.type;
            var escapeConnect = payload.escapeConnect;
            var actionInfo = actions[payloadType];
            var cptTypeTmp = (actionInfo.update || 'update').split(':');
            var updateMethod = cptTypeTmp.pop();
            var cptType = cptTypeTmp[0] != null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseClassType"])(cptTypeTmp[0]);
            this[IN_EC_CYCLE_KEY] = true;
            updateECUpdateCycleVersion(this);
            var payloads = [
                payload
            ];
            var batched = false;
            // Batch action
            if (payload.batch) {
                batched = true;
                payloads = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(payload.batch, function(item) {
                    item = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaults"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"])({}, item), payload);
                    item.batch = null;
                    return item;
                });
            }
            var eventObjBatch = [];
            var eventObj;
            var actionResultBatch = [];
            var nonRefinedEventType = actionInfo.nonRefinedEventType;
            var isSelectChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isSelectChangePayload"])(payload);
            var isHighDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isHighDownPayload"])(payload);
            // Only leave blur once if there are multiple batches.
            if (isHighDown) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["allLeaveBlur"])(this._api);
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(payloads, function(batchItem) {
                // Action can specify the event by return it.
                var actionResult = actionInfo.action(batchItem, ecModel, _this._api);
                if (actionInfo.refineEvent) {
                    actionResultBatch.push(actionResult);
                } else {
                    eventObj = actionResult;
                }
                eventObj = eventObj || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"])({}, batchItem);
                eventObj.type = nonRefinedEventType;
                eventObjBatch.push(eventObj);
                // light update does not perform data process, layout and visual.
                if (isHighDown) {
                    var _a = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["preParseFinder"](payload), queryOptionMap = _a.queryOptionMap, mainTypeSpecified = _a.mainTypeSpecified;
                    var componentMainType = mainTypeSpecified ? queryOptionMap.keys()[0] : 'series';
                    updateDirectly(_this, updateMethod, batchItem, componentMainType);
                    markStatusToUpdate(_this);
                } else if (isSelectChange) {
                    // At present `dispatchAction({ type: 'select', ... })` is not supported on components.
                    // geo still use 'geoselect'.
                    updateDirectly(_this, updateMethod, batchItem, 'series');
                    markStatusToUpdate(_this);
                } else if (cptType) {
                    updateDirectly(_this, updateMethod, batchItem, cptType.main, cptType.sub);
                }
            });
            if (updateMethod !== 'none' && !isHighDown && !isSelectChange && !cptType) {
                try {
                    // Still dirty
                    if (this[PENDING_UPDATE]) {
                        prepare(this);
                        updateMethods.update.call(this, payload);
                        this[PENDING_UPDATE] = null;
                    } else {
                        updateMethods[updateMethod].call(this, payload);
                    }
                } catch (e) {
                    this[IN_EC_CYCLE_KEY] = false;
                    throw e;
                }
            }
            // Follow the rule of action batch
            if (batched) {
                eventObj = {
                    type: nonRefinedEventType,
                    escapeConnect: escapeConnect,
                    batch: eventObjBatch
                };
            } else {
                eventObj = eventObjBatch[0];
            }
            this[IN_EC_CYCLE_KEY] = false;
            if (!silent) {
                var refinedEvent = void 0;
                if (actionInfo.refineEvent) {
                    var eventContent = actionInfo.refineEvent(actionResultBatch, payload, ecModel, this._api).eventContent;
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(eventContent));
                    refinedEvent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaults"])({
                        type: actionInfo.refinedEventType
                    }, eventContent);
                    refinedEvent.fromAction = payload.type;
                    refinedEvent.fromActionPayload = payload;
                    refinedEvent.escapeConnect = true;
                }
                var messageCenter = this._messageCenter;
                // - If `refineEvent` created a `refinedEvent`, `eventObj` (replicated from the original payload)
                //  is still needed to be triggered for the feature `connect`. But it will not be triggered to
                //  users in this case.
                // - If no `refineEvent` used, `eventObj` will be triggered for both `connect` and users.
                messageCenter.trigger(eventObj.type, eventObj);
                if (refinedEvent) {
                    messageCenter.trigger(refinedEvent.type, refinedEvent);
                }
            }
        };
        flushPendingActions = function(silent) {
            var pendingActions = this._pendingActions;
            while(pendingActions.length){
                var payload = pendingActions.shift();
                doDispatchAction.call(this, payload, silent);
            }
        };
        triggerUpdatedEvent = function(silent) {
            !silent && this.trigger('updated');
        };
        /**
     * Event `rendered` is triggered when zr
     * rendered. It is useful for realtime
     * snapshot (reflect animation).
     *
     * Event `finished` is triggered when:
     * (1) zrender rendering finished.
     * (2) initial animation finished.
     * (3) progressive rendering finished.
     * (4) no pending action.
     * (5) no delayed setOption needs to be processed.
     */ bindRenderedEvent = function(zr, ecIns) {
            zr.on('rendered', function(params) {
                ecIns.trigger('rendered', params);
                // The `finished` event should not be triggered repeatedly,
                // so it should only be triggered when rendering indeed happens
                // in zrender. (Consider the case that dispatchAction is keep
                // triggering when mouse move).
                if (// Although zr is dirty if initial animation is not finished
                // and this checking is called on frame, we also check
                // animation finished for robustness.
                zr.animation.isFinished() && !ecIns[PENDING_UPDATE] && !ecIns._scheduler.unfinished && !ecIns._pendingActions.length) {
                    ecIns.trigger('finished');
                } else {
                    // Make sure this method can be entered again in next frames.
                    zr.refresh();
                }
            });
        };
        bindMouseEvent = function(zr, ecIns) {
            zr.on('mouseover', function(e) {
                var el = e.target;
                var dispatcher = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findEventDispatcher"])(el, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isHighDownDispatcher"]);
                if (dispatcher) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleGlobalMouseOverForHighDown"])(dispatcher, e, ecIns._api);
                    markStatusToUpdate(ecIns);
                }
            }).on('mouseout', function(e) {
                var el = e.target;
                var dispatcher = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findEventDispatcher"])(el, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isHighDownDispatcher"]);
                if (dispatcher) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleGlobalMouseOutForHighDown"])(dispatcher, e, ecIns._api);
                    markStatusToUpdate(ecIns);
                }
            }).on('click', function(e) {
                var el = e.target;
                var dispatcher = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findEventDispatcher"])(el, function(target) {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getECData"])(target).dataIndex != null;
                }, true);
                if (dispatcher) {
                    var actionType = dispatcher.selected ? 'unselect' : 'select';
                    var ecData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getECData"])(dispatcher);
                    ecIns._api.dispatchAction({
                        type: actionType,
                        dataType: ecData.dataType,
                        dataIndexInside: ecData.dataIndex,
                        seriesIndex: ecData.seriesIndex,
                        isFromClick: true
                    });
                }
            });
        };
        function clearColorPalette(ecModel) {
            ecModel.clearColorPalette();
            ecModel.eachSeries(function(seriesModel) {
                seriesModel.clearColorPalette();
            });
        }
        ;
        // Allocate zlevels for series and components
        function allocateZlevels(ecModel) {
            ;
            var componentZLevels = [];
            var seriesZLevels = [];
            var hasSeparateZLevel = false;
            ecModel.eachComponent(function(componentType, componentModel) {
                var zlevel = componentModel.get('zlevel') || 0;
                var z = componentModel.get('z') || 0;
                var zlevelKey = componentModel.getZLevelKey();
                hasSeparateZLevel = hasSeparateZLevel || !!zlevelKey;
                (componentType === 'series' ? seriesZLevels : componentZLevels).push({
                    zlevel: zlevel,
                    z: z,
                    idx: componentModel.componentIndex,
                    type: componentType,
                    key: zlevelKey
                });
            });
            if (hasSeparateZLevel) {
                // Series after component
                var zLevels = componentZLevels.concat(seriesZLevels);
                var lastSeriesZLevel_1;
                var lastSeriesKey_1;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$timsort$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(zLevels, function(a, b) {
                    if (a.zlevel === b.zlevel) {
                        return a.z - b.z;
                    }
                    return a.zlevel - b.zlevel;
                });
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(zLevels, function(item) {
                    var componentModel = ecModel.getComponent(item.type, item.idx);
                    var zlevel = item.zlevel;
                    var key = item.key;
                    if (lastSeriesZLevel_1 != null) {
                        zlevel = Math.max(lastSeriesZLevel_1, zlevel);
                    }
                    if (key) {
                        if (zlevel === lastSeriesZLevel_1 && key !== lastSeriesKey_1) {
                            zlevel++;
                        }
                        lastSeriesKey_1 = key;
                    } else if (lastSeriesKey_1) {
                        if (zlevel === lastSeriesZLevel_1) {
                            zlevel++;
                        }
                        lastSeriesKey_1 = '';
                    }
                    lastSeriesZLevel_1 = zlevel;
                    componentModel.setZLevel(zlevel);
                });
            }
        }
        render = function(ecIns, ecModel, api, payload, updateParams) {
            allocateZlevels(ecModel);
            renderComponents(ecIns, ecModel, api, payload, updateParams);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(ecIns._chartsViews, function(chart) {
                chart.__alive = false;
            });
            renderSeries(ecIns, ecModel, api, payload, updateParams);
            // Remove groups of unrendered charts
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(ecIns._chartsViews, function(chart) {
                if (!chart.__alive) {
                    chart.remove(ecModel, api);
                }
            });
        };
        renderComponents = function(ecIns, ecModel, api, payload, updateParams, dirtyList) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(dirtyList || ecIns._componentsViews, function(componentView) {
                var componentModel = componentView.__model;
                clearStates(componentModel, componentView);
                componentView.render(componentModel, ecModel, api, payload);
                updateZ(componentModel, componentView);
                updateStates(componentModel, componentView);
            });
        };
        /**
     * Render each chart and component
     */ renderSeries = function(ecIns, ecModel, api, payload, updateParams, dirtyMap) {
            // Render all charts
            var scheduler = ecIns._scheduler;
            updateParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"])(updateParams || {}, {
                updatedSeries: ecModel.getSeries()
            });
            // TODO progressive?
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$lifecycle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].trigger('series:beforeupdate', ecModel, api, updateParams);
            var unfinished = false;
            ecModel.eachSeries(function(seriesModel) {
                var chartView = ecIns._chartsMap[seriesModel.__viewId];
                chartView.__alive = true;
                var renderTask = chartView.renderTask;
                scheduler.updatePayload(renderTask, payload);
                // TODO states on marker.
                clearStates(seriesModel, chartView);
                if (dirtyMap && dirtyMap.get(seriesModel.uid)) {
                    renderTask.dirty();
                }
                if (renderTask.perform(scheduler.getPerformArgs(renderTask))) {
                    unfinished = true;
                }
                chartView.group.silent = !!seriesModel.get('silent');
                // Should not call markRedraw on group, because it will disable zrender
                // incremental render (always render from the __startIndex each frame)
                // chartView.group.markRedraw();
                updateBlend(seriesModel, chartView);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateSeriesElementSelection"])(seriesModel);
            });
            scheduler.unfinished = unfinished || scheduler.unfinished;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$lifecycle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].trigger('series:layoutlabels', ecModel, api, updateParams);
            // transition after label is layouted.
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$lifecycle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].trigger('series:transition', ecModel, api, updateParams);
            ecModel.eachSeries(function(seriesModel) {
                var chartView = ecIns._chartsMap[seriesModel.__viewId];
                // Update Z after labels updated. Before applying states.
                updateZ(seriesModel, chartView);
                // NOTE: Update states after label is updated.
                // label should be in normal status when layouting.
                updateStates(seriesModel, chartView);
            });
            // If use hover layer
            updateHoverLayerStatus(ecIns, ecModel);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$lifecycle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].trigger('series:afterupdate', ecModel, api, updateParams);
        };
        markStatusToUpdate = function(ecIns) {
            ecIns[STATUS_NEEDS_UPDATE_KEY] = true;
            // Wake up zrender if it's sleep. Let it update states in the next frame.
            ecIns.getZr().wakeUp();
        };
        updateECUpdateCycleVersion = function(ecIns) {
            ecIns[EC_UPDATE_CYCLE_VERSION_KEY] = (ecIns[EC_UPDATE_CYCLE_VERSION_KEY] + 1) % 1e6;
        };
        applyChangedStates = function(ecIns) {
            if (!ecIns[STATUS_NEEDS_UPDATE_KEY]) {
                return;
            }
            ecIns.getZr().storage.traverse(function(el) {
                // Not applied on removed elements, it may still in fading.
                if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isElementRemoved"](el)) {
                    return;
                }
                applyElementStates(el);
            });
            ecIns[STATUS_NEEDS_UPDATE_KEY] = false;
        };
        function applyElementStates(el) {
            var newStates = [];
            var oldStates = el.currentStates;
            // Keep other states.
            for(var i = 0; i < oldStates.length; i++){
                var stateName = oldStates[i];
                if (!(stateName === 'emphasis' || stateName === 'blur' || stateName === 'select')) {
                    newStates.push(stateName);
                }
            }
            // Only use states when it's exists.
            if (el.selected && el.states.select) {
                newStates.push('select');
            }
            if (el.hoverState === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HOVER_STATE_EMPHASIS"] && el.states.emphasis) {
                newStates.push('emphasis');
            } else if (el.hoverState === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HOVER_STATE_BLUR"] && el.states.blur) {
                newStates.push('blur');
            }
            el.useStates(newStates);
        }
        function updateHoverLayerStatus(ecIns, ecModel) {
            var zr = ecIns._zr;
            if (zr.painter.type !== 'canvas') {
                return;
            }
            var storage = zr.storage;
            var elCount = 0;
            storage.traverse(function(el) {
                if (!el.isGroup) {
                    elCount++;
                }
            });
            var shouldUseHoverLayer = elCount > (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(ecModel.get('hoverLayerThreshold'), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$globalDefault$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].hoverLayerThreshold) && !__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$env$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].node && !__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$env$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].worker;
            if (ecIns._usingTHL || shouldUseHoverLayer) {
                ecModel.eachSeries(function(seriesModel) {
                    if (seriesModel.preventUsingHoverLayer) {
                        return;
                    }
                    var chartView = ecIns._chartsMap[seriesModel.__viewId];
                    if (chartView.__alive) {
                        chartView.eachRendered(function(el) {
                            // NOTICE: Do not call any method that can set REDRAW_BIT,
                            // otherwise progressive rendering is broken.
                            var emphasis = el.states.emphasis;
                            if (emphasis && emphasis.hoverLayer !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["HOVER_LAYER_FOR_INCREMENTAL"]) {
                                emphasis.hoverLayer = shouldUseHoverLayer ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["HOVER_LAYER_FROM_THRESHOLD"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["HOVER_LAYER_NO"];
                            }
                        });
                    }
                });
                ecIns._usingTHL = shouldUseHoverLayer;
            }
        }
        ;
        /**
     * Update chart and blend.
     */ function updateBlend(seriesModel, chartView) {
            var blendMode = seriesModel.get('blendMode') || null;
            chartView.eachRendered(function(el) {
                // NOTICE: Do not call any method that can set REDRAW_BIT,
                // otherwise progressive rendering is broken.
                // FIXME marker and other components
                if (!el.isGroup) {
                    // DON'T mark the element dirty. In case element is incremental and don't want to rerender.
                    el.style.blend = blendMode;
                }
            });
        }
        ;
        function updateZ(model, view) {
            if (model.preventAutoZ) {
                return;
            }
            var zInfo = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["retrieveZInfo"](model);
            // Set z and zlevel
            view.eachRendered(function(el) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["traverseUpdateZ"](el, zInfo.z, zInfo.zlevel);
                // Don't traverse the children because it has been traversed in _updateZ.
                return true;
            });
        }
        ;
        // Clear states without animation.
        // TODO States on component.
        function clearStates(model, view) {
            view.eachRendered(function(el) {
                // Not applied on removed elements, it may still in fading.
                if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isElementRemoved"](el)) {
                    return;
                }
                var textContent = el.getTextContent();
                var textGuide = el.getTextGuideLine();
                if (el.stateTransition) {
                    el.stateTransition = null;
                }
                if (textContent && textContent.stateTransition) {
                    textContent.stateTransition = null;
                }
                if (textGuide && textGuide.stateTransition) {
                    textGuide.stateTransition = null;
                }
                // TODO If el is incremental.
                if (el.hasState()) {
                    el.prevStates = el.currentStates;
                    el.clearStates();
                } else if (el.prevStates) {
                    el.prevStates = null;
                }
            });
        }
        function updateStates(model, view) {
            var stateAnimationModel = model.getModel('stateAnimation');
            var enableAnimation = model.isAnimationEnabled();
            var duration = stateAnimationModel.get('duration');
            var stateTransition = duration > 0 ? {
                duration: duration,
                delay: stateAnimationModel.get('delay'),
                easing: stateAnimationModel.get('easing')
            } : null;
            view.eachRendered(function(el) {
                if (el.states && el.states.emphasis) {
                    // Not applied on removed elements, it may still in fading.
                    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isElementRemoved"](el)) {
                        return;
                    }
                    if (el instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Path$3e$__["Path"]) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["savePathStates"])(el);
                    }
                    // Only updated on changed element. In case element is incremental and don't want to rerender.
                    // TODO, a more proper way?
                    if (el.__dirty) {
                        var prevStates = el.prevStates;
                        // Restore states without animation
                        if (prevStates) {
                            el.useStates(prevStates);
                        }
                    }
                    // Update state transition and enable animation again.
                    if (enableAnimation) {
                        el.stateTransition = stateTransition;
                        var textContent = el.getTextContent();
                        var textGuide = el.getTextGuideLine();
                        // TODO Is it necessary to animate label?
                        if (textContent) {
                            textContent.stateTransition = stateTransition;
                        }
                        if (textGuide) {
                            textGuide.stateTransition = stateTransition;
                        }
                    }
                    // Use highlighted and selected flag to toggle states.
                    if (el.__dirty) {
                        applyElementStates(el);
                    }
                }
            });
        }
        ;
        createExtensionAPI = function(ecIns) {
            return new (/** @class */ function(_super) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__extends"])(class_1, _super);
                function class_1() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_1.prototype.getCoordinateSystems = function() {
                    return ecIns._coordSysMgr.getCoordinateSystems();
                };
                class_1.prototype.getComponentByElement = function(el) {
                    while(el){
                        var modelInfo = el.__ecComponentInfo;
                        if (modelInfo != null) {
                            return ecIns._model.getComponent(modelInfo.mainType, modelInfo.index);
                        }
                        el = el.parent;
                    }
                };
                class_1.prototype.enterEmphasis = function(el, highlightDigit) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["enterEmphasis"])(el, highlightDigit);
                    markStatusToUpdate(ecIns);
                };
                class_1.prototype.leaveEmphasis = function(el, highlightDigit) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["leaveEmphasis"])(el, highlightDigit);
                    markStatusToUpdate(ecIns);
                };
                class_1.prototype.enterBlur = function(el) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["enterBlur"])(el);
                    markStatusToUpdate(ecIns);
                };
                class_1.prototype.leaveBlur = function(el) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["leaveBlur"])(el);
                    markStatusToUpdate(ecIns);
                };
                class_1.prototype.enterSelect = function(el) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["enterSelect"])(el);
                    markStatusToUpdate(ecIns);
                };
                class_1.prototype.leaveSelect = function(el) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["leaveSelect"])(el);
                    markStatusToUpdate(ecIns);
                };
                class_1.prototype.getModel = function() {
                    return ecIns.getModel();
                };
                class_1.prototype.getViewOfComponentModel = function(componentModel) {
                    return ecIns.getViewOfComponentModel(componentModel);
                };
                class_1.prototype.getViewOfSeriesModel = function(seriesModel) {
                    return ecIns.getViewOfSeriesModel(seriesModel);
                };
                class_1.prototype.getECUpdateCycleVersion = function() {
                    return ecIns[EC_UPDATE_CYCLE_VERSION_KEY];
                };
                class_1.prototype.usingTHL = function() {
                    return ecIns._usingTHL;
                };
                return class_1;
            }(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$ExtensionAPI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]))(ecIns);
        };
        enableConnect = function(chart) {
            function updateConnectedChartsStatus(charts, status) {
                for(var i = 0; i < charts.length; i++){
                    var otherChart = charts[i];
                    otherChart[CONNECT_STATUS_KEY] = status;
                }
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(connectionEventRevertMap, function(_, eventType) {
                chart._messageCenter.on(eventType, function(event) {
                    if (connectedGroups[chart.group] && chart[CONNECT_STATUS_KEY] !== CONNECT_STATUS_PENDING) {
                        if (event && event.escapeConnect) {
                            return;
                        }
                        var action_1 = chart.makeActionFromEvent(event);
                        var otherCharts_1 = [];
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(instances, function(otherChart) {
                            if (otherChart !== chart && otherChart.group === chart.group) {
                                otherCharts_1.push(otherChart);
                            }
                        });
                        updateConnectedChartsStatus(otherCharts_1, CONNECT_STATUS_PENDING);
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(otherCharts_1, function(otherChart) {
                            if (otherChart[CONNECT_STATUS_KEY] !== CONNECT_STATUS_UPDATING) {
                                otherChart.dispatchAction(action_1);
                            }
                        });
                        updateConnectedChartsStatus(otherCharts_1, CONNECT_STATUS_UPDATED);
                    }
                });
            });
        };
    }();
    return ECharts;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Eventful$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
var echartsProto = ECharts.prototype;
echartsProto.on = createRegisterEventWithLowercaseECharts('on');
echartsProto.off = createRegisterEventWithLowercaseECharts('off');
/**
 * @deprecated
 */ // @ts-ignore
echartsProto.one = function(eventName, cb, ctx) {
    var self = this;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateLog"])('ECharts#one is deprecated.');
    function wrapped() {
        var args2 = [];
        for(var _i = 0; _i < arguments.length; _i++){
            args2[_i] = arguments[_i];
        }
        cb && cb.apply && cb.apply(this, args2);
        // @ts-ignore
        self.off(eventName, wrapped);
    }
    ;
    // @ts-ignore
    this.on.call(this, eventName, wrapped, ctx);
};
var MOUSE_EVENT_NAMES = [
    'click',
    'dblclick',
    'mouseover',
    'mouseout',
    'mousemove',
    'mousedown',
    'mouseup',
    'globalout',
    'contextmenu'
];
function disposedWarning(id) {
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warn"])('Instance ' + id + ' has been disposed');
    }
}
var actions = {};
/**
 * Map event type to action type for reproducing action from event for `connect`.
 */ var connectionEventRevertMap = {};
/**
 * To remove duplication.
 */ var publicEventTypeMap = {};
var dataProcessorFuncs = [];
var optionPreprocessorFuncs = [];
var visualFuncs = [];
var themeStorage = {};
var loadingEffects = {};
var instances = {};
var connectedGroups = {};
var idBase = +new Date() - 0;
var groupIdBase = +new Date() - 0;
var DOM_ATTRIBUTE_KEY = '_echarts_instance_';
function init(dom, theme, opts) {
    var isClient = !(opts && opts.ssr);
    if (isClient) {
        if ("TURBOPACK compile-time truthy", 1) {
            if (!dom) {
                throw new Error('Initialize failed: invalid dom.');
            }
        }
        var existInstance = getInstanceByDom(dom);
        if (existInstance) {
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warn"])('There is a chart instance already initialized on the dom.');
            }
            return existInstance;
        }
        if ("TURBOPACK compile-time truthy", 1) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDom"])(dom) && dom.nodeName.toUpperCase() !== 'CANVAS' && (!dom.clientWidth && (!opts || opts.width == null) || !dom.clientHeight && (!opts || opts.height == null))) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warn"])('Can\'t get DOM width or height. Please check ' + 'dom.clientWidth and dom.clientHeight. They should not be 0.' + 'For example, you may need to call this in the callback ' + 'of window.onload.');
            }
        }
    }
    var chart = new ECharts(dom, theme, opts);
    chart.id = 'ec_' + idBase++;
    instances[chart.id] = chart;
    isClient && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAttribute"](dom, DOM_ATTRIBUTE_KEY, chart.id);
    enableConnect(chart);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$lifecycle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].trigger('afterinit', chart);
    return chart;
}
function connect(groupId) {
    // Is array of charts
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"])(groupId)) {
        var charts = groupId;
        groupId = null;
        // If any chart has group
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(charts, function(chart) {
            if (chart.group != null) {
                groupId = chart.group;
            }
        });
        groupId = groupId || 'g_' + groupIdBase++;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(charts, function(chart) {
            chart.group = groupId;
        });
    }
    connectedGroups[groupId] = true;
    return groupId;
}
function disconnect(groupId) {
    connectedGroups[groupId] = false;
}
var disConnect = disconnect;
function dispose(chart) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(chart)) {
        chart = instances[chart];
    } else if (!(chart instanceof ECharts)) {
        // Try to treat as dom
        chart = getInstanceByDom(chart);
    }
    if (chart instanceof ECharts && !chart.isDisposed()) {
        chart.dispose();
    }
}
function getInstanceByDom(dom) {
    return instances[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAttribute"](dom, DOM_ATTRIBUTE_KEY)];
}
function getInstanceById(key) {
    return instances[key];
}
function registerTheme(name, theme) {
    themeStorage[name] = theme;
}
function registerPreprocessor(preprocessorFunc) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["indexOf"])(optionPreprocessorFuncs, preprocessorFunc) < 0) {
        optionPreprocessorFuncs.push(preprocessorFunc);
    }
}
function registerProcessor(priority, processor) {
    normalizeRegister(dataProcessorFuncs, priority, processor, PRIORITY_PROCESSOR_DEFAULT);
}
function registerPostInit(postInitFunc) {
    registerUpdateLifecycle('afterinit', postInitFunc);
}
function registerPostUpdate(postUpdateFunc) {
    registerUpdateLifecycle('afterupdate', postUpdateFunc);
}
function registerUpdateLifecycle(name, cb) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$lifecycle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].on(name, cb);
}
function registerAction(arg0, arg1, action) {
    var actionType;
    var publicEventType;
    var refineEvent;
    var update;
    var publishNonRefinedEvent;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"])(arg1)) {
        action = arg1;
        arg1 = '';
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(arg0)) {
        actionType = arg0.type;
        publicEventType = arg0.event;
        update = arg0.update;
        publishNonRefinedEvent = arg0.publishNonRefinedEvent;
        if (!action) {
            action = arg0.action;
        }
        refineEvent = arg0.refineEvent;
    } else {
        actionType = arg0;
        publicEventType = arg1;
    }
    function createEventType(actionOrEventType) {
        // Event type should be all lowercase
        return actionOrEventType.toLowerCase();
    }
    publicEventType = createEventType(publicEventType || actionType);
    // See comments on {ActionInfo} for the reason.
    var nonRefinedEventType = refineEvent ? createEventType(actionType) : publicEventType;
    // Support calling `registerAction` multiple times with the same action
    // type; subsequent calls have no effect.
    if (actions[actionType]) {
        return;
    }
    // Validate action type and event name.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(ACTION_REG.test(actionType) && ACTION_REG.test(publicEventType));
    if (refineEvent) {
        // An event replicated from the action will be triggered internally for `connect` in this case.
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(publicEventType !== actionType);
    }
    actions[actionType] = {
        actionType: actionType,
        refinedEventType: publicEventType,
        nonRefinedEventType: nonRefinedEventType,
        update: update,
        action: action,
        refineEvent: refineEvent
    };
    publicEventTypeMap[publicEventType] = 1;
    if (refineEvent && publishNonRefinedEvent) {
        publicEventTypeMap[nonRefinedEventType] = 1;
    }
    if (("TURBOPACK compile-time value", "development") !== 'production' && connectionEventRevertMap[nonRefinedEventType]) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["error"])(nonRefinedEventType + " must not be shared; use \"refineEvent\" if you intend to share an event name.");
    }
    connectionEventRevertMap[nonRefinedEventType] = actionType;
}
function registerCoordinateSystem(type, coordSysCreator) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].register(type, coordSysCreator);
}
function getCoordinateSystemDimensions(type) {
    var coordSysCreator = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(type);
    if (coordSysCreator) {
        return coordSysCreator.getDimensionsInfo ? coordSysCreator.getDimensionsInfo() : coordSysCreator.dimensions.slice();
    }
}
function registerCustomSeries(seriesType, renderItem) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$custom$2f$customSeriesRegister$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerCustomSeries"])(seriesType, renderItem);
}
;
function registerLayout(priority, layoutTask) {
    normalizeRegister(visualFuncs, priority, layoutTask, PRIORITY_VISUAL_LAYOUT, 'layout', true);
}
function registerVisual(priority, visualTask) {
    normalizeRegister(visualFuncs, priority, visualTask, PRIORITY_VISUAL_CHART, 'visual', true);
}
;
var registeredTasks = [];
function normalizeRegister(targetList, priority, fn, defaultPriority, visualType, checkBlock) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"])(priority) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(priority)) {
        fn = priority;
        priority = defaultPriority;
    }
    if ("TURBOPACK compile-time truthy", 1) {
        if (isNaN(priority) || priority == null) {
            throw new Error('Illegal priority');
        }
        // Check duplicate
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(targetList, function(wrap) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(wrap.__raw !== fn);
        });
    }
    // Already registered
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["indexOf"])(registeredTasks, fn) >= 0) {
        return;
    }
    registeredTasks.push(fn);
    var stageHandler = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$Scheduler$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].wrapStageHandler(fn, visualType);
    stageHandler.__prio = priority;
    stageHandler.__raw = fn;
    targetList.push(stageHandler);
    if ("TURBOPACK compile-time truthy", 1) {
        if (checkBlock) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(!stageHandler.dirtyOnOverallProgress, "dirtyOnOverallProgress is not allowed in " + visualType + " stage;" + ' otherwise progressive rendering is disabled on all series.');
        }
    }
}
function registerLoading(name, loadingFx) {
    loadingEffects[name] = loadingFx;
}
function setCanvasCreator(creator) {
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateLog"])('setCanvasCreator is deprecated. Use setPlatformAPI({ createCanvas }) instead.');
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$platform$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setPlatformAPI"])({
        createCanvas: creator
    });
}
function registerMap(mapName, geoJson, specialAreas) {
    var registerMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$impl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getImpl"])('registerMap');
    registerMap && registerMap(mapName, geoJson, specialAreas);
}
function getMap(mapName) {
    var getMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$impl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getImpl"])('getMap');
    return getMap && getMap(mapName);
}
var registerTransform = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$transform$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerExternalTransform"];
/**
 * Global dispatchAction to a specified chart instance.
 */ // export function dispatchAction(payload: { chartId: string } & Payload, opt?: Parameters<ECharts['dispatchAction']>[1]) {
//     if (!payload || !payload.chartId) {
//         // Must have chartId to find chart
//         return;
//     }
//     const chart = instances[payload.chartId];
//     if (chart) {
//         chart.dispatchAction(payload, opt);
//     }
// }
// Builtin global visual
registerVisual(PRIORITY_VISUAL_GLOBAL, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["seriesStyleTask"]);
registerVisual(PRIORITY_VISUAL_CHART_DATA_CUSTOM, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dataStyleTask"]);
registerVisual(PRIORITY_VISUAL_CHART_DATA_CUSTOM, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dataColorPaletteTask"]);
registerVisual(PRIORITY_VISUAL_GLOBAL, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$symbol$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["seriesSymbolTask"]);
registerVisual(PRIORITY_VISUAL_CHART_DATA_CUSTOM, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$symbol$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dataSymbolTask"]);
registerVisual(PRIORITY_VISUAL_DECAL, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$decal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decalVisualStageHandler"]);
registerPreprocessor(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$preprocessor$2f$backwardCompat$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
registerProcessor(PRIORITY_PROCESSOR_DATASTACK, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$processor$2f$dataStack$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dataStackStageHandler"]);
registerLoading('default', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$loading$2f$default$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
// Default actions
registerAction({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HIGHLIGHT_ACTION_TYPE"],
    event: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HIGHLIGHT_ACTION_TYPE"],
    update: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HIGHLIGHT_ACTION_TYPE"]
}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"]);
registerAction({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DOWNPLAY_ACTION_TYPE"],
    event: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DOWNPLAY_ACTION_TYPE"],
    update: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DOWNPLAY_ACTION_TYPE"]
}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"]);
registerAction({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SELECT_ACTION_TYPE"],
    event: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SELECT_CHANGED_EVENT_TYPE"],
    update: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SELECT_ACTION_TYPE"],
    action: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"],
    refineEvent: makeSelectChangedEvent,
    publishNonRefinedEvent: true
});
registerAction({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UNSELECT_ACTION_TYPE"],
    event: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SELECT_CHANGED_EVENT_TYPE"],
    update: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UNSELECT_ACTION_TYPE"],
    action: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"],
    refineEvent: makeSelectChangedEvent,
    publishNonRefinedEvent: true
});
registerAction({
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TOGGLE_SELECT_ACTION_TYPE"],
    event: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SELECT_CHANGED_EVENT_TYPE"],
    update: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TOGGLE_SELECT_ACTION_TYPE"],
    action: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"],
    refineEvent: makeSelectChangedEvent,
    publishNonRefinedEvent: true
});
function makeSelectChangedEvent(actionResultBatch, payload, ecModel, api) {
    return {
        eventContent: {
            selected: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAllSelectedIndices"])(ecModel),
            isFromClick: payload.isFromClick || false
        }
    };
}
// Default theme, so that we can use `chart.setTheme('default')` to revert to
// the default theme after changing to other themes.
registerTheme('default', {});
registerTheme('dark', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$theme$2f$dark$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
var dataTool = {};
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/impl.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getImpl",
    ()=>getImpl,
    "registerImpl",
    ()=>registerImpl
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-ssr] (ecmascript)");
;
// Implementation of exported APIs. For example registerMap, getMap.
// The implementations will be registered when installing the component.
// Avoid these code being bundled to the core module.
var implsStore = {};
function registerImpl(name, impl) {
    if ("TURBOPACK compile-time truthy", 1) {
        if (implsStore[name]) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["error"])("Already has an implementation of " + name + ".");
        }
    }
    implsStore[name] = impl;
}
function getImpl(name) {
    if ("TURBOPACK compile-time truthy", 1) {
        if (!implsStore[name]) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["error"])("Implementation of " + name + " doesn't exists.");
        }
    }
    return implsStore[name];
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/lifecycle.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Eventful$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/Eventful.js [app-ssr] (ecmascript)");
;
;
var lifecycle = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Eventful$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]();
const __TURBOPACK__default__export__ = lifecycle;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/locale.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SYSTEM_LANG",
    ()=>SYSTEM_LANG,
    "createLocaleObject",
    ()=>createLocaleObject,
    "getDefaultLocaleModel",
    ()=>getDefaultLocaleModel,
    "getLocaleModel",
    ()=>getLocaleModel,
    "registerLocale",
    ()=>registerLocale
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$env$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/env.js [app-ssr] (ecmascript)");
// default import ZH and EN lang
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$i18n$2f$langEN$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/i18n/langEN.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$i18n$2f$langZH$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/i18n/langZH.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
;
;
;
;
;
var LOCALE_ZH = 'ZH';
var LOCALE_EN = 'EN';
var DEFAULT_LOCALE = LOCALE_EN;
var localeStorage = {};
var localeModels = {};
var SYSTEM_LANG = !__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$env$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].domSupported ? DEFAULT_LOCALE : function() {
    var langStr = (document.documentElement.lang || navigator.language || navigator.browserLanguage || DEFAULT_LOCALE).toUpperCase();
    return langStr.indexOf(LOCALE_ZH) > -1 ? LOCALE_ZH : DEFAULT_LOCALE;
}();
function registerLocale(locale, localeObj) {
    locale = locale.toUpperCase();
    localeModels[locale] = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](localeObj);
    localeStorage[locale] = localeObj;
}
function createLocaleObject(locale) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(locale)) {
        var localeObj = localeStorage[locale.toUpperCase()] || {};
        if (locale === LOCALE_ZH || locale === LOCALE_EN) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clone"])(localeObj);
        } else {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["merge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clone"])(localeObj), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clone"])(localeStorage[DEFAULT_LOCALE]), false);
        }
    } else {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["merge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clone"])(locale), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clone"])(localeStorage[DEFAULT_LOCALE]), false);
    }
}
function getLocaleModel(lang) {
    return localeModels[lang];
}
function getDefaultLocaleModel() {
    return localeModels[DEFAULT_LOCALE];
}
// Default locale
registerLocale(LOCALE_EN, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$i18n$2f$langEN$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
registerLocale(LOCALE_ZH, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$i18n$2f$langZH$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/task.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Task",
    ()=>Task,
    "createTask",
    ()=>createTask
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
;
function createTask(define) {
    return new Task(define);
}
var Task = /** @class */ function() {
    function Task(define) {
        define = define || {};
        this._reset = define.reset;
        this._plan = define.plan;
        this._count = define.count;
        this._onDirty = define.onDirty;
        this._dirty = true;
    }
    /**
   * @param step Specified step.
   * @param skip Skip customer perform call.
   * @param modBy Sampling window size.
   * @param modDataCount Sampling count.
   * @return whether unfinished.
   */ Task.prototype.perform = function(performArgs) {
        var upTask = this._upstream;
        var skip = performArgs && performArgs.skip;
        // TODO some refactor.
        // Pull data. Must pull data each time, because context.data
        // may be updated by Series.setData.
        if (this._dirty && upTask) {
            var context = this.context;
            context.data = context.outputData = upTask.context.outputData;
        }
        if (this.__pipeline) {
            this.__pipeline.currentTask = this;
        }
        var planResult;
        if (this._plan && !skip) {
            planResult = this._plan(this.context);
        }
        // Support sharding by mod, which changes the render sequence and makes the rendered graphic
        // elements uniformed distributed when progress, especially when moving or zooming.
        var lastModBy = normalizeModBy(this._modBy);
        var lastModDataCount = this._modDataCount || 0;
        var modBy = normalizeModBy(performArgs && performArgs.modBy);
        var modDataCount = performArgs && performArgs.modDataCount || 0;
        if (lastModBy !== modBy || lastModDataCount !== modDataCount) {
            planResult = 'reset';
        }
        function normalizeModBy(val) {
            !(val >= 1) && (val = 1); // jshint ignore:line
            return val;
        }
        var forceFirstProgress;
        if (this._dirty || planResult === 'reset') {
            this._dirty = false;
            forceFirstProgress = this._doReset(skip);
        }
        this._modBy = modBy;
        this._modDataCount = modDataCount;
        var step = performArgs && performArgs.step;
        if (upTask) {
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(upTask._outputDueEnd != null);
            }
            this._dueEnd = upTask._outputDueEnd;
        } else {
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(!this._progress || this._count);
            }
            this._dueEnd = this._count ? this._count(this.context) : Infinity;
        }
        // Note: Stubs, that its host overall task let it has progress, has progress.
        // If no progress, pass index from upstream to downstream each time plan called.
        if (this._progress) {
            var start = this._dueIndex;
            var end = Math.min(step != null ? this._dueIndex + step : Infinity, this._dueEnd);
            if (!skip && (forceFirstProgress || start < end)) {
                var progress = this._progress;
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"])(progress)) {
                    for(var i = 0; i < progress.length; i++){
                        this._doProgress(progress[i], start, end, modBy, modDataCount);
                    }
                } else {
                    this._doProgress(progress, start, end, modBy, modDataCount);
                }
            }
            this._dueIndex = end;
            // If no `outputDueEnd`, assume that output data and
            // input data is the same, so use `dueIndex` as `outputDueEnd`.
            var outputDueEnd = this._settedOutputEnd != null ? this._settedOutputEnd : end;
            if ("TURBOPACK compile-time truthy", 1) {
                // ??? Can not rollback.
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(outputDueEnd >= this._outputDueEnd);
            }
            this._outputDueEnd = outputDueEnd;
        } else {
            // (1) Some overall task has no progress.
            // (2) Stubs, that its host overall task do not let it has progress, has no progress.
            // This should always be performed so it can be passed to downstream.
            this._dueIndex = this._outputDueEnd = this._settedOutputEnd != null ? this._settedOutputEnd : this._dueEnd;
        }
        return this.unfinished();
    };
    /**
   * @tutorial [EC_TASK_DIRTY]
   *  Task `dirty()` calls typically originate from a trigger of EC_FULL_UPDATE_CYCLE and
   *  EC_PARTIAL_UPDATE_CYCLE) (See comments in EC_CYCLE. Generally, task dirty propagates
   *  to downstream tasks.
   *  Task dirty leads to the `StageHandler['reset']` or `StageHandler['overallReset']` call,
   *  which discards the previous result and starts over the processing.
   */ Task.prototype.dirty = function() {
        this._dirty = true;
        this._onDirty && this._onDirty(this.context);
    };
    Task.prototype._doProgress = function(progress, start, end, modBy, modDataCount) {
        iterator.reset(start, end, modBy, modDataCount);
        this._callingProgress = progress;
        this._callingProgress({
            start: start,
            end: end,
            count: end - start,
            next: iterator.next
        }, this.context);
    };
    Task.prototype._doReset = function(skip) {
        this._dueIndex = this._outputDueEnd = this._dueEnd = 0;
        this._settedOutputEnd = null;
        var progress;
        var forceFirstProgress;
        if (!skip && this._reset) {
            progress = this._reset(this.context);
            if (progress && progress.progress) {
                forceFirstProgress = progress.forceFirstProgress;
                progress = progress.progress;
            }
            // To simplify no progress checking, array must has item.
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"])(progress) && !progress.length) {
                progress = null;
            }
        }
        this._progress = progress;
        this._modBy = this._modDataCount = null;
        var downstream = this._downstream;
        downstream && downstream.dirty();
        return forceFirstProgress;
    };
    Task.prototype.unfinished = function() {
        return this._progress && this._dueIndex < this._dueEnd;
    };
    /**
   * @param downTask The downstream task.
   * @return The downstream task.
   */ Task.prototype.pipe = function(downTask) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(downTask && !downTask._disposed && downTask !== this);
        }
        // If already downstream, do not dirty downTask.
        if (this._downstream !== downTask || this._dirty) {
            this._downstream = downTask;
            downTask._upstream = this;
            downTask.dirty();
        }
    };
    Task.prototype.dispose = function() {
        if (this._disposed) {
            return;
        }
        this._upstream && (this._upstream._downstream = null);
        this._downstream && (this._downstream._upstream = null);
        this._dirty = false;
        this._disposed = true;
    };
    Task.prototype.getUpstream = function() {
        return this._upstream;
    };
    Task.prototype.getDownstream = function() {
        return this._downstream;
    };
    Task.prototype.setOutputEnd = function(end) {
        // This only happens in dataTask, dataZoom, map, currently.
        // where dataZoom do not set end each time, but only set
        // when reset. So we should record the set end, in case
        // that the stub of dataZoom perform again and earse the
        // set end by upstream.
        this._outputDueEnd = this._settedOutputEnd = end;
    };
    return Task;
}();
;
var iterator = function() {
    var end;
    var current;
    var modBy;
    var modDataCount;
    var winCount;
    var it = {
        reset: function(s, e, sStep, sCount) {
            current = s;
            end = e;
            modBy = sStep;
            modDataCount = sCount;
            winCount = Math.ceil(modDataCount / modBy);
            it.next = modBy > 1 && modDataCount > 0 ? modNext : sequentialNext;
        }
    };
    return it;
    //TURBOPACK unreachable
    ;
    function sequentialNext() {
        return current < end ? current++ : null;
    }
    function modNext() {
        var dataIndex = current % winCount * modBy + Math.ceil(current / winCount);
        var result = current >= end ? null : dataIndex < modDataCount ? dataIndex : current;
        current++;
        return result;
    }
}(); // -----------------------------------------------------------------------------
 // For stream debug (Should be commented out after used!)
 // @usage: printTask(this, 'begin');
 // @usage: printTask(this, null, {someExtraProp});
 // @usage: Use `__idxInPipeline` as conditional breakpiont.
 //
 // window.printTask = function (task: any, prefix: string, extra: { [key: string]: unknown }): void {
 //     window.ecTaskUID == null && (window.ecTaskUID = 0);
 //     task.uidDebug == null && (task.uidDebug = `task_${window.ecTaskUID++}`);
 //     task.agent && task.agent.uidDebug == null && (task.agent.uidDebug = `task_${window.ecTaskUID++}`);
 //     let props = [];
 //     if (task.__pipeline) {
 //         let val = `${task.__idxInPipeline}/${task.__pipeline.tail.__idxInPipeline} ${task.agent ? '(stub)' : ''}`;
 //         props.push({text: '__idxInPipeline/total', value: val});
 //     } else {
 //         let stubCount = 0;
 //         task.agentStubMap.each(() => stubCount++);
 //         props.push({text: 'idx', value: `overall (stubs: ${stubCount})`});
 //     }
 //     props.push({text: 'uid', value: task.uidDebug});
 //     if (task.__pipeline) {
 //         props.push({text: 'pipelineId', value: task.__pipeline.id});
 //         task.agent && props.push(
 //             {text: 'stubFor', value: task.agent.uidDebug}
 //         );
 //     }
 //     props.push(
 //         {text: 'dirty', value: task._dirty},
 //         {text: 'dueIndex', value: task._dueIndex},
 //         {text: 'dueEnd', value: task._dueEnd},
 //         {text: 'outputDueEnd', value: task._outputDueEnd}
 //     );
 //     if (extra) {
 //         Object.keys(extra).forEach(key => {
 //             props.push({text: key, value: extra[key]});
 //         });
 //     }
 //     let args = ['color: blue'];
 //     let msg = `%c[${prefix || 'T'}] %c` + props.map(item => (
 //         args.push('color: green', 'color: red'),
 //         `${item.text}: %c${item.value}`
 //     )).join('%c, ');
 //     console.log.apply(console, [msg].concat(args));
 //     // console.log(this);
 // };
 // window.printPipeline = function (task: any, prefix: string) {
 //     const pipeline = task.__pipeline;
 //     let currTask = pipeline.head;
 //     while (currTask) {
 //         window.printTask(currTask, prefix);
 //         currTask = currTask._downstream;
 //     }
 // };
 // window.showChain = function (chainHeadTask) {
 //     var chain = [];
 //     var task = chainHeadTask;
 //     while (task) {
 //         chain.push({
 //             task: task,
 //             up: task._upstream,
 //             down: task._downstream,
 //             idxInPipeline: task.__idxInPipeline
 //         });
 //         task = task._downstream;
 //     }
 //     return chain;
 // };
 // window.findTaskInChain = function (task, chainHeadTask) {
 //     let chain = window.showChain(chainHeadTask);
 //     let result = [];
 //     for (let i = 0; i < chain.length; i++) {
 //         let chainItem = chain[i];
 //         if (chainItem.task === task) {
 //             result.push(i);
 //         }
 //     }
 //     return result;
 // };
 // window.printChainAEachInChainB = function (chainHeadTaskA, chainHeadTaskB) {
 //     let chainA = window.showChain(chainHeadTaskA);
 //     for (let i = 0; i < chainA.length; i++) {
 //         console.log('chainAIdx:', i, 'inChainB:', window.findTaskInChain(chainA[i].task, chainHeadTaskB));
 //     }
 // };
}),
];

//# sourceMappingURL=10pt_echarts_lib_core_1l8r5yz._.js.map