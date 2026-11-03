(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Component.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/clazz.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/layout.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
var inner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeInner"])();
var ComponentModel = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(ComponentModel, _super);
    function ComponentModel(option, parentModel, ecModel) {
        var _this = _super.call(this, option, parentModel, ecModel) || this;
        _this.uid = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUID"]('ec_cpt_model');
        return _this;
    }
    ComponentModel.prototype.init = function(option, parentModel, ecModel) {
        this.mergeDefaultAndTheme(option, ecModel);
    };
    ComponentModel.prototype.mergeDefaultAndTheme = function(option, ecModel) {
        var layoutMode = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchLayoutMode"](this);
        var inputPositionParams = layoutMode ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLayoutParams"](option) : {};
        var themeModel = ecModel.getTheme();
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"](option, themeModel.get(this.mainType));
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"](option, this.getDefaultOption());
        if (layoutMode) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeLayoutParam"](option, inputPositionParams, layoutMode);
        }
    };
    ComponentModel.prototype.mergeOption = function(option, ecModel) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"](this.option, option, true);
        var layoutMode = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchLayoutMode"](this);
        if (layoutMode) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeLayoutParam"](this.option, option, layoutMode);
        }
    };
    /**
   * Called immediately after `init` or `mergeOption` of this instance called.
   */ ComponentModel.prototype.optionUpdated = function(newCptOption, isInit) {
    // MUST NOT do anything here.
    };
    /**
   * [How to declare defaultOption]:
   *
   * (A) If using class declaration in typescript (since echarts 5):
   * ```ts
   * import {ComponentOption} from '../model/option.js';
   * export interface XxxOption extends ComponentOption {
   *     aaa: number
   * }
   * export class XxxModel extends Component {
   *     static type = 'xxx';
   *     static defaultOption: XxxOption = {
   *         aaa: 123
   *     }
   * }
   * Component.registerClass(XxxModel);
   * ```
   * ```ts
   * import {inheritDefaultOption} from '../util/component.js';
   * import {XxxModel, XxxOption} from './XxxModel.js';
   * export interface XxxSubOption extends XxxOption {
   *     bbb: number
   * }
   * class XxxSubModel extends XxxModel {
   *     static defaultOption: XxxSubOption = inheritDefaultOption(XxxModel.defaultOption, {
   *         bbb: 456
   *     })
   *     fn() {
   *         let opt = this.getDefaultOption();
   *         // opt is {aaa: 123, bbb: 456}
   *     }
   * }
   * ```
   *
   * (B) If using class extend (previous approach in echarts 3 & 4):
   * ```js
   * let XxxComponent = Component.extend({
   *     defaultOption: {
   *         xx: 123
   *     }
   * })
   * ```
   * ```js
   * let XxxSubComponent = XxxComponent.extend({
   *     defaultOption: {
   *         yy: 456
   *     },
   *     fn: function () {
   *         let opt = this.getDefaultOption();
   *         // opt is {xx: 123, yy: 456}
   *     }
   * })
   * ```
   */ ComponentModel.prototype.getDefaultOption = function() {
        var ctor = this.constructor;
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isExtendedClass"])(ctor)) {
            // When using ES class declaration, defaultOption must be declared as static.
            // And manually inherit the defaultOption from its parent class if needed, such as,
            //  ```ts
            //  static defaultOption = inheritDefaultOption(ParentModel.defaultOption, {...});
            //  ```
            return ctor.defaultOption;
        }
        // FIXME: remove this approach?
        // Legacy: auto merge defaultOption from ancestor classes if using ParentClass.extend(subProto)
        var fields = inner(this);
        if (!fields.defaultOption) {
            var optList = [];
            var clz = ctor;
            while(clz){
                var opt = clz.prototype.defaultOption;
                opt && optList.push(opt);
                clz = clz.superClass;
            }
            var defaultOption = {};
            for(var i = optList.length - 1; i >= 0; i--){
                defaultOption = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"](defaultOption, optList[i], true);
            }
            fields.defaultOption = defaultOption;
        }
        return fields.defaultOption;
    };
    /**
   * Notice: always force to input param `useDefault` in case that forget to consider it.
   * The same behavior as `modelUtil.parseFinder`.
   *
   * @param useDefault In many cases like series refer axis and axis refer grid,
   *        If axis index / axis id not specified, use the first target as default.
   *        In other cases like dataZoom refer axis, if not specified, measn no refer.
   */ ComponentModel.prototype.getReferringComponents = function(mainType, opt) {
        var indexKey = mainType + 'Index';
        var idKey = mainType + 'Id';
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryReferringComponents"])(this.ecModel, mainType, {
            index: this.get(indexKey, true),
            id: this.get(idKey, true)
        }, opt);
    };
    ComponentModel.prototype.getBoxLayoutParams = function() {
        // Consider itself having box layout configs.
        // For backward compatibility, by default do not `ignoreParent`.
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBoxLayoutParams"](this, false);
    };
    /**
   * If developers don't configure zlevel. We will assign zlevel to series based on the key, if provided.
   * For example, lines with trail effect is expected to be in an individual zlevel.
   *
   * @tutorial [GET_ZLEVEL_KEY_FOR_PROGRESSIVE]
   * Regarding "progressive rendering", zrender can automatically assign a dedicated "incremental layer"
   * for `el.incremental` per zlevel. But there is a trade-off:
   *  - If we do not provide different zlevelKey for different series here, all incremental elements from
   *    different series will be assigned to one incremental layer, which causes them to cover each other
   *    in an order depending on progressive steps.
   *      i.e., seriesA_el1 -covered_by-> seriesB_el1 -covered_by-> seriesC_el1 -> seriesA_el2 -> seriesB_el2 ...
   *    This order may causes an unexpected visual result: series with small data are likely to be completely
   *    covered by series with large data. (like in test/scatter-weibo.html)
   *  - If we assign a different zlevelKey to each series, the "covering issue" above can be resolved,
   *    but having one HTML Canvas per series may be excessively memory-consuming.
   *  Therefore, we only automatically assign zlevelKey on `ScatterSeries` and `LinesSeries` for backward
   *  compatibility, and not to other series. Users can explicitly assign zlevel if they encouter above
   *  "covering issue".
   */ ComponentModel.prototype.getZLevelKey = function() {
        return '';
    };
    ComponentModel.prototype.setZLevel = function(zlevel) {
        this.option.zlevel = zlevel;
    };
    ComponentModel.protoInitialize = function() {
        var proto = ComponentModel.prototype;
        proto.type = 'component';
        proto.id = '';
        proto.name = '';
        proto.mainType = '';
        proto.subType = '';
        proto.componentIndex = 0;
    }();
    return ComponentModel;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mountExtend"])(ComponentModel, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enableClassManagement"])(ComponentModel);
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enableSubTypeDefaulter"](ComponentModel);
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enableTopologicalTravel"](ComponentModel, getDependencies);
function getDependencies(componentType) {
    var deps = [];
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](ComponentModel.getClassesByMainType(componentType), function(clz) {
        deps = deps.concat(clz.dependencies || clz.prototype.dependencies || []);
    });
    // Ensure main type.
    deps = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"](deps, function(type) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseClassType"])(type).main;
    });
    // Hack dataset for convenience.
    if (componentType !== 'dataset' && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indexOf"](deps, 'dataset') <= 0) {
        deps.unshift('dataset');
    }
    return deps;
}
const __TURBOPACK__default__export__ = ComponentModel;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Global.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
/**
 * Caution: If the mechanism should be changed some day, these cases
 * should be considered:
 *
 * (1) In `merge option` mode, if using the same option to call `setOption`
 * many times, the result should be the same (try our best to ensure that).
 * (2) In `merge option` mode, if a component has no id/name specified, it
 * will be merged by index, and the result sequence of the components is
 * consistent to the original sequence.
 * (3) In `replaceMerge` mode, keep the result sequence of the components is
 * consistent to the original sequence, even though there might result in "hole".
 * (4) `reset` feature (in toolbox). Find detailed info in comments about
 * `mergeOption` in module:echarts/model/OptionManager.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$globalDefault$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/globalDefault.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$sourceHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/sourceHelper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$internalComponentCreator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/internalComponentCreator.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/mixin/palette.js [app-client] (ecmascript)");
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
// -----------------------
// Internal method names:
// -----------------------
var reCreateSeriesIndices;
var assertSeriesInitialized;
var initBase;
var OPTION_INNER_KEY = '\0_ec_inner';
var OPTION_INNER_VALUE = 1;
var BUITIN_COMPONENTS_MAP = {
    grid: 'GridComponent',
    polar: 'PolarComponent',
    geo: 'GeoComponent',
    singleAxis: 'SingleAxisComponent',
    parallel: 'ParallelComponent',
    calendar: 'CalendarComponent',
    matrix: 'MatrixComponent',
    graphic: 'GraphicComponent',
    toolbox: 'ToolboxComponent',
    tooltip: 'TooltipComponent',
    axisPointer: 'AxisPointerComponent',
    brush: 'BrushComponent',
    title: 'TitleComponent',
    timeline: 'TimelineComponent',
    markPoint: 'MarkPointComponent',
    markLine: 'MarkLineComponent',
    markArea: 'MarkAreaComponent',
    legend: 'LegendComponent',
    dataZoom: 'DataZoomComponent',
    visualMap: 'VisualMapComponent',
    // aria: 'AriaComponent',
    // dataset: 'DatasetComponent',
    // Dependencies
    xAxis: 'GridComponent',
    yAxis: 'GridComponent',
    angleAxis: 'PolarComponent',
    radiusAxis: 'PolarComponent'
};
var BUILTIN_CHARTS_MAP = {
    line: 'LineChart',
    bar: 'BarChart',
    pie: 'PieChart',
    scatter: 'ScatterChart',
    radar: 'RadarChart',
    map: 'MapChart',
    tree: 'TreeChart',
    treemap: 'TreemapChart',
    graph: 'GraphChart',
    chord: 'ChordChart',
    gauge: 'GaugeChart',
    funnel: 'FunnelChart',
    parallel: 'ParallelChart',
    sankey: 'SankeyChart',
    boxplot: 'BoxplotChart',
    candlestick: 'CandlestickChart',
    effectScatter: 'EffectScatterChart',
    lines: 'LinesChart',
    heatmap: 'HeatmapChart',
    pictorialBar: 'PictorialBarChart',
    themeRiver: 'ThemeRiverChart',
    sunburst: 'SunburstChart',
    custom: 'CustomChart'
};
var componetsMissingLogPrinted = {};
function checkMissingComponents(option) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(option, function(componentOption, mainType) {
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].hasClass(mainType)) {
            var componentImportName = BUITIN_COMPONENTS_MAP[mainType];
            if (componentImportName && !componetsMissingLogPrinted[componentImportName]) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["error"])("Component " + mainType + " is used but not imported.\nimport { " + componentImportName + " } from 'echarts/components';\necharts.use([" + componentImportName + "]);");
                componetsMissingLogPrinted[componentImportName] = true;
            }
        }
    });
}
var GlobalModel = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(GlobalModel, _super);
    function GlobalModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GlobalModel.prototype.init = function(option, parentModel, ecModel, theme, locale, optionManager) {
        theme = theme || {};
        this.option = null; // Mark as not initialized.
        this._theme = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](theme);
        this._locale = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](locale);
        this._optionManager = optionManager;
    };
    GlobalModel.prototype.setOption = function(option, opts, optionPreprocessorFuncs) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])(option != null, 'option is null/undefined');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])(option[OPTION_INNER_KEY] !== OPTION_INNER_VALUE, 'please use chart.getOption()');
        }
        var innerOpt = normalizeSetOptionInput(opts);
        this._optionManager.setOption(option, optionPreprocessorFuncs, innerOpt);
        this._resetOption(null, innerOpt);
    };
    /**
   * @param type null/undefined: reset all.
   *        'recreate': force recreate all.
   *        'timeline': only reset timeline option
   *        'media': only reset media query option
   * @return Whether option changed.
   */ GlobalModel.prototype.resetOption = function(type, opt) {
        return this._resetOption(type, normalizeSetOptionInput(opt));
    };
    GlobalModel.prototype._resetOption = function(type, opt) {
        var optionChanged = false;
        var optionManager = this._optionManager;
        if (!type || type === 'recreate') {
            var baseOption = optionManager.mountOption(type === 'recreate');
            if ("TURBOPACK compile-time truthy", 1) {
                checkMissingComponents(baseOption);
            }
            if (!this.option || type === 'recreate') {
                initBase(this, baseOption);
            } else {
                this.restoreData();
                this._mergeOption(baseOption, opt);
            }
            optionChanged = true;
        }
        if (type === 'timeline' || type === 'media') {
            this.restoreData();
        }
        // By design, if `setOption(option2)` at the second time, and `option2` is a `ECUnitOption`,
        // it should better not have the same props with `MediaUnit['option']`.
        // Because either `option2` or `MediaUnit['option']` will be always merged to "current option"
        // rather than original "baseOption". If they both override a prop, the result might be
        // unexpected when media state changed after `setOption` called.
        // If we really need to modify a props in each `MediaUnit['option']`, use the full version
        // (`{baseOption, media}`) in `setOption`.
        // For `timeline`, the case is the same.
        if (!type || type === 'recreate' || type === 'timeline') {
            var timelineOption = optionManager.getTimelineOption(this);
            if (timelineOption) {
                optionChanged = true;
                this._mergeOption(timelineOption, opt);
            }
        }
        if (!type || type === 'recreate' || type === 'media') {
            var mediaOptions = optionManager.getMediaOption(this);
            if (mediaOptions.length) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(mediaOptions, function(mediaOption) {
                    optionChanged = true;
                    this._mergeOption(mediaOption, opt);
                }, this);
            }
        }
        return optionChanged;
    };
    GlobalModel.prototype.mergeOption = function(option) {
        this._mergeOption(option, null);
    };
    GlobalModel.prototype._mergeOption = function(newOption, opt) {
        var option = this.option;
        var componentsMap = this._componentsMap;
        var componentsCount = this._componentsCount;
        var newCmptTypes = [];
        var newCmptTypeMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHashMap"])();
        var replaceMergeMainTypeMap = opt && opt.replaceMergeMainTypeMap;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$sourceHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resetSourceDefaulter"])(this);
        // If no component class, merge directly.
        // For example: color, animaiton options, etc.
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(newOption, function(componentOption, mainType) {
            if (componentOption == null) {
                return;
            }
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].hasClass(mainType)) {
                // globalSettingTask.dirty();
                option[mainType] = option[mainType] == null ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clone"])(componentOption) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"])(option[mainType], componentOption, true);
            } else if (mainType) {
                newCmptTypes.push(mainType);
                newCmptTypeMap.set(mainType, true);
            }
        });
        if (replaceMergeMainTypeMap) {
            // If there is a mainType `xxx` in `replaceMerge` but not declared in option,
            // we trade it as it is declared in option as `{xxx: []}`. Because:
            // (1) for normal merge, `{xxx: null/undefined}` are the same meaning as `{xxx: []}`.
            // (2) some preprocessor may convert some of `{xxx: null/undefined}` to `{xxx: []}`.
            replaceMergeMainTypeMap.each(function(val, mainTypeInReplaceMerge) {
                if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].hasClass(mainTypeInReplaceMerge) && !newCmptTypeMap.get(mainTypeInReplaceMerge)) {
                    newCmptTypes.push(mainTypeInReplaceMerge);
                    newCmptTypeMap.set(mainTypeInReplaceMerge, true);
                }
            });
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].topologicalTravel(newCmptTypes, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getAllClassMainTypes(), visitComponent, this);
        function visitComponent(mainType) {
            var newCmptOptionList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$internalComponentCreator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concatInternalOptions"])(this, mainType, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeToArray"](newOption[mainType]));
            var oldCmptList = componentsMap.get(mainType);
            var mergeMode = // `!oldCmptList` means init. See the comment in `mappingToExists`
            !oldCmptList ? 'replaceAll' : replaceMergeMainTypeMap && replaceMergeMainTypeMap.get(mainType) ? 'replaceMerge' : 'normalMerge';
            var mappingResult = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mappingToExists"](oldCmptList, newCmptOptionList, mergeMode);
            // Set mainType and complete subType.
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setComponentTypeToKeyInfo"](mappingResult, mainType, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
            // Empty it before the travel, in order to prevent `this._componentsMap`
            // from being used in the `init`/`mergeOption`/`optionUpdated` of some
            // components, which is probably incorrect logic.
            option[mainType] = null;
            componentsMap.set(mainType, null);
            componentsCount.set(mainType, 0);
            var optionsByMainType = [];
            var cmptsByMainType = [];
            var cmptsCountByMainType = 0;
            var tooltipExists;
            var tooltipWarningLogged;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(mappingResult, function(resultItem, index) {
                var componentModel = resultItem.existing;
                var newCmptOption = resultItem.newOption;
                if (!newCmptOption) {
                    if (componentModel) {
                        // Consider where is no new option and should be merged using {},
                        // see removeEdgeAndAdd in topologicalTravel and
                        // ComponentModel.getAllClassMainTypes.
                        componentModel.mergeOption({}, this);
                        componentModel.optionUpdated({}, false);
                    }
                // If no both `resultItem.exist` and `resultItem.option`,
                // either it is in `replaceMerge` and not matched by any id,
                // or it has been removed in previous `replaceMerge` and left a "hole" in this component index.
                } else {
                    var isSeriesType = mainType === 'series';
                    var ComponentModelClass = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getClass(mainType, resultItem.keyInfo.subType, !isSeriesType // Give a more detailed warn later if series don't exists
                    );
                    if (!ComponentModelClass) {
                        if ("TURBOPACK compile-time truthy", 1) {
                            var subType = resultItem.keyInfo.subType;
                            var seriesImportName = BUILTIN_CHARTS_MAP[subType];
                            if (!componetsMissingLogPrinted[subType]) {
                                componetsMissingLogPrinted[subType] = true;
                                if (seriesImportName) {
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["error"])("Series " + subType + " is used but not imported.\nimport { " + seriesImportName + " } from 'echarts/charts';\necharts.use([" + seriesImportName + "]);");
                                } else {
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["error"])("Unknown series " + subType);
                                }
                            }
                        }
                        return;
                    }
                    // TODO Before multiple tooltips get supported, we do this check to avoid unexpected exception.
                    if (mainType === 'tooltip') {
                        if (tooltipExists) {
                            if ("TURBOPACK compile-time truthy", 1) {
                                if (!tooltipWarningLogged) {
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warn"])('Currently only one tooltip component is allowed.');
                                    tooltipWarningLogged = true;
                                }
                            }
                            return;
                        }
                        tooltipExists = true;
                    }
                    if (componentModel && componentModel.constructor === ComponentModelClass) {
                        componentModel.name = resultItem.keyInfo.name;
                        // componentModel.settingTask && componentModel.settingTask.dirty();
                        componentModel.mergeOption(newCmptOption, this);
                        componentModel.optionUpdated(newCmptOption, false);
                    } else {
                        // PENDING Global as parent ?
                        var extraOpt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])({
                            componentIndex: index
                        }, resultItem.keyInfo);
                        componentModel = new ComponentModelClass(newCmptOption, this, this, extraOpt);
                        // Assign `keyInfo`
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])(componentModel, extraOpt);
                        if (resultItem.brandNew) {
                            componentModel.__requireNewView = true;
                        }
                        componentModel.init(newCmptOption, this, this);
                        // Call optionUpdated after init.
                        // newCmptOption has been used as componentModel.option
                        // and may be merged with theme and default, so pass null
                        // to avoid confusion.
                        componentModel.optionUpdated(null, true);
                    }
                }
                if (componentModel) {
                    optionsByMainType.push(componentModel.option);
                    cmptsByMainType.push(componentModel);
                    cmptsCountByMainType++;
                } else {
                    // Always do assign to avoid elided item in array.
                    optionsByMainType.push(void 0);
                    cmptsByMainType.push(void 0);
                }
            }, this);
            option[mainType] = optionsByMainType;
            componentsMap.set(mainType, cmptsByMainType);
            componentsCount.set(mainType, cmptsCountByMainType);
            // Backup series for filtering.
            if (mainType === 'series') {
                reCreateSeriesIndices(this);
            }
        }
        // If no series declared, ensure `_seriesIndices` initialized.
        if (!this._seriesIndices) {
            reCreateSeriesIndices(this);
        }
    };
    /**
   * Get option for output (cloned option and inner info removed)
   */ GlobalModel.prototype.getOption = function() {
        var option = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clone"])(this.option);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(option, function(optInMainType, mainType) {
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].hasClass(mainType)) {
                var opts = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeToArray"](optInMainType);
                // Inner cmpts need to be removed.
                // Inner cmpts might not be at last since ec5.0, but still
                // compatible for users: if inner cmpt at last, splice the returned array.
                var realLen = opts.length;
                var metNonInner = false;
                for(var i = realLen - 1; i >= 0; i--){
                    // Remove options with inner id.
                    if (opts[i] && !__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isComponentIdInternal"](opts[i])) {
                        metNonInner = true;
                    } else {
                        opts[i] = null;
                        !metNonInner && realLen--;
                    }
                }
                opts.length = realLen;
                option[mainType] = opts;
            }
        });
        delete option[OPTION_INNER_KEY];
        return option;
    };
    GlobalModel.prototype.setTheme = function(theme) {
        this._theme = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](theme);
        this._resetOption('recreate', null);
    };
    GlobalModel.prototype.getTheme = function() {
        return this._theme;
    };
    GlobalModel.prototype.getLocaleModel = function() {
        return this._locale;
    };
    GlobalModel.prototype.setUpdatePayload = function(payload) {
        this._payload = payload;
    };
    GlobalModel.prototype.getUpdatePayload = function() {
        return this._payload;
    };
    /**
   * @param idx If not specified, return the first one.
   */ GlobalModel.prototype.getComponent = function(mainType, idx) {
        var list = this._componentsMap.get(mainType);
        if (list) {
            var cmpt = list[idx || 0];
            if (cmpt) {
                return cmpt;
            } else if (idx == null) {
                for(var i = 0; i < list.length; i++){
                    if (list[i]) {
                        return list[i];
                    }
                }
            }
        }
    };
    /**
   * @return Never be null/undefined.
   */ GlobalModel.prototype.queryComponents = function(condition) {
        var mainType = condition.mainType;
        if (!mainType) {
            return [];
        }
        var index = condition.index;
        var id = condition.id;
        var name = condition.name;
        var cmpts = this._componentsMap.get(mainType);
        if (!cmpts || !cmpts.length) {
            return [];
        }
        var result;
        if (index != null) {
            result = [];
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeToArray"](index), function(idx) {
                cmpts[idx] && result.push(cmpts[idx]);
            });
        } else if (id != null) {
            result = queryByIdOrName('id', id, cmpts);
        } else if (name != null) {
            result = queryByIdOrName('name', name, cmpts);
        } else {
            // Return all non-empty components in that mainType
            result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])(cmpts, function(cmpt) {
                return !!cmpt;
            });
        }
        return filterBySubType(result, condition);
    };
    /**
   * The interface is different from queryComponents,
   * which is convenient for inner usage.
   *
   * @usage
   * let result = findComponents(
   *     {mainType: 'dataZoom', query: {dataZoomId: 'abc'}}
   * );
   * let result = findComponents(
   *     {mainType: 'series', subType: 'pie', query: {seriesName: 'uio'}}
   * );
   * let result = findComponents(
   *     {mainType: 'series',
   *     filter: function (model, index) {...}}
   * );
   * // result like [component0, component1, ...]
   */ GlobalModel.prototype.findComponents = function(condition) {
        var query = condition.query;
        var mainType = condition.mainType;
        var queryCond = getQueryCond(query);
        var result = queryCond ? this.queryComponents(queryCond) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])(this._componentsMap.get(mainType), function(cmpt) {
            return !!cmpt;
        });
        return doFilter(filterBySubType(result, condition));
        //TURBOPACK unreachable
        ;
        function getQueryCond(q) {
            var indexAttr = mainType + 'Index';
            var idAttr = mainType + 'Id';
            var nameAttr = mainType + 'Name';
            return q && (q[indexAttr] != null || q[idAttr] != null || q[nameAttr] != null) ? {
                mainType: mainType,
                // subType will be filtered finally.
                index: q[indexAttr],
                id: q[idAttr],
                name: q[nameAttr]
            } : null;
        }
        function doFilter(res) {
            return condition.filter ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])(res, condition.filter) : res;
        }
    };
    GlobalModel.prototype.eachComponent = function(mainType, cb, context) {
        var componentsMap = this._componentsMap;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFunction"])(mainType)) {
            var ctxForAll_1 = cb;
            var cbForAll_1 = mainType;
            componentsMap.each(function(cmpts, componentType) {
                for(var i = 0; cmpts && i < cmpts.length; i++){
                    var cmpt = cmpts[i];
                    cmpt && cbForAll_1.call(ctxForAll_1, componentType, cmpt, cmpt.componentIndex);
                }
            });
        } else {
            var cmpts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"])(mainType) ? componentsMap.get(mainType) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObject"])(mainType) ? this.findComponents(mainType) : null;
            for(var i = 0; cmpts && i < cmpts.length; i++){
                var cmpt = cmpts[i];
                cmpt && cb.call(context, cmpt, cmpt.componentIndex);
            }
        }
    };
    /**
   * Get series list before filtered by name.
   */ GlobalModel.prototype.getSeriesByName = function(name) {
        var nameStr = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertOptionIdName"](name, null);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])(this._componentsMap.get('series'), function(oneSeries) {
            return !!oneSeries && nameStr != null && oneSeries.name === nameStr;
        });
    };
    /**
   * Get series list before filtered by index.
   */ GlobalModel.prototype.getSeriesByIndex = function(seriesIndex) {
        return this._componentsMap.get('series')[seriesIndex];
    };
    /**
   * Get series list before filtered by type.
   * FIXME: rename to getRawSeriesByType?
   */ GlobalModel.prototype.getSeriesByType = function(subType) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])(this._componentsMap.get('series'), function(oneSeries) {
            return !!oneSeries && oneSeries.subType === subType;
        });
    };
    /**
   * Get all series before filtered.
   */ GlobalModel.prototype.getSeries = function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])(this._componentsMap.get('series'), function(oneSeries) {
            return !!oneSeries;
        });
    };
    /**
   * Count series before filtered.
   */ GlobalModel.prototype.getSeriesCount = function() {
        return this._componentsCount.get('series');
    };
    /**
   * After filtering, series may be different
   * from raw series.
   */ GlobalModel.prototype.eachSeries = function(cb, context) {
        assertSeriesInitialized(this);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(this._seriesIndices, function(rawSeriesIndex) {
            var series = this._componentsMap.get('series')[rawSeriesIndex];
            cb.call(context, series, rawSeriesIndex);
        }, this);
    };
    /**
   * Iterate raw series before filtered.
   */ GlobalModel.prototype.eachRawSeries = function(cb, context) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(this._componentsMap.get('series'), function(series) {
            series && cb.call(context, series, series.componentIndex);
        });
    };
    /**
   * After filtering, series may be different.
   * from raw series.
   */ GlobalModel.prototype.eachSeriesByType = function(subType, cb, context) {
        assertSeriesInitialized(this);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(this._seriesIndices, function(rawSeriesIndex) {
            var series = this._componentsMap.get('series')[rawSeriesIndex];
            if (series.subType === subType) {
                cb.call(context, series, rawSeriesIndex);
            }
        }, this);
    };
    /**
   * Iterate raw series before filtered of given type.
   */ GlobalModel.prototype.eachRawSeriesByType = function(subType, cb, context) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(this.getSeriesByType(subType), cb, context);
    };
    /**
   * It means "filtered out".
   */ GlobalModel.prototype.isSeriesFiltered = function(seriesModel) {
        assertSeriesInitialized(this);
        return this._seriesIndicesMap.get(seriesModel.componentIndex) == null;
    };
    GlobalModel.prototype.getCurrentSeriesIndices = function() {
        return (this._seriesIndices || []).slice();
    };
    GlobalModel.prototype.filterSeries = function(cb, context) {
        assertSeriesInitialized(this);
        var newSeriesIndices = [];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(this._seriesIndices, function(seriesRawIdx) {
            var series = this._componentsMap.get('series')[seriesRawIdx];
            cb.call(context, series, seriesRawIdx) && newSeriesIndices.push(seriesRawIdx);
        }, this);
        this._seriesIndices = newSeriesIndices;
        this._seriesIndicesMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHashMap"])(newSeriesIndices);
    };
    GlobalModel.prototype.restoreData = function(payload) {
        reCreateSeriesIndices(this);
        var componentsMap = this._componentsMap;
        var componentTypes = [];
        componentsMap.each(function(components, componentType) {
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].hasClass(componentType)) {
                componentTypes.push(componentType);
            }
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].topologicalTravel(componentTypes, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getAllClassMainTypes(), function(componentType) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(componentsMap.get(componentType), function(component) {
                if (component && (componentType !== 'series' || !isNotTargetSeries(component, payload))) {
                    component.restoreData();
                }
            });
        });
    };
    GlobalModel.internalField = function() {
        reCreateSeriesIndices = function(ecModel) {
            var seriesIndices = ecModel._seriesIndices = [];
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(ecModel._componentsMap.get('series'), function(series) {
                // series may have been removed by `replaceMerge`.
                series && seriesIndices.push(series.componentIndex);
            });
            ecModel._seriesIndicesMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHashMap"])(seriesIndices);
        };
        assertSeriesInitialized = function(ecModel) {
            // Components that use _seriesIndices should depends on series component,
            // which make sure that their initialization is after series.
            if ("TURBOPACK compile-time truthy", 1) {
                if (!ecModel._seriesIndices) {
                    throw new Error('Option should contains series.');
                }
            }
        };
        initBase = function(ecModel, baseOption) {
            // Using OPTION_INNER_KEY to mark that this option cannot be used outside,
            // i.e. `chart.setOption(chart.getModel().option);` is forbidden.
            ecModel.option = {};
            ecModel.option[OPTION_INNER_KEY] = OPTION_INNER_VALUE;
            // Init with series: [], in case of calling findSeries method
            // before series initialized.
            ecModel._componentsMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHashMap"])({
                series: []
            });
            ecModel._componentsCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHashMap"])();
            // If user spefied `option.aria`, aria will be enable. This detection should be
            // performed before theme and globalDefault merge.
            var airaOption = baseOption.aria;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObject"])(airaOption) && airaOption.enabled == null) {
                airaOption.enabled = true;
            }
            mergeTheme(baseOption, ecModel._theme.option);
            // TODO Needs clone when merging to the unexisted property
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"])(baseOption, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$globalDefault$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], false);
            ecModel._mergeOption(baseOption, null);
        };
    }();
    return GlobalModel;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
function isNotTargetSeries(seriesModel, payload) {
    if (payload) {
        var index = payload.seriesIndex;
        var id = payload.seriesId;
        var name_1 = payload.seriesName;
        return index != null && seriesModel.componentIndex !== index || id != null && seriesModel.id !== id || name_1 != null && seriesModel.name !== name_1;
    }
}
function mergeTheme(option, theme) {
    // PENDING
    // NOT use `colorLayer` in theme if option has `color`
    var notMergeColorLayer = option.color && !option.colorLayer;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(theme, function(themeItem, name) {
        if (name === 'colorLayer' && notMergeColorLayer || name === 'color' && option.color) {
            return;
        }
        // If it is component model mainType, the model handles that merge later.
        // otherwise, merge them here.
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].hasClass(name)) {
            if (typeof themeItem === 'object') {
                option[name] = !option[name] ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clone"])(themeItem) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"])(option[name], themeItem, false);
            } else {
                if (option[name] == null) {
                    option[name] = themeItem;
                }
            }
        }
    });
}
function queryByIdOrName(attr, idOrName, cmpts) {
    // Here is a break from echarts4: string and number are
    // treated as equal.
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(idOrName)) {
        var keyMap_1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHashMap"])();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(idOrName, function(idOrNameItem) {
            if (idOrNameItem != null) {
                var idName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertOptionIdName"](idOrNameItem, null);
                idName != null && keyMap_1.set(idOrNameItem, true);
            }
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])(cmpts, function(cmpt) {
            return cmpt && keyMap_1.get(cmpt[attr]);
        });
    } else {
        var idName_1 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertOptionIdName"](idOrName, null);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])(cmpts, function(cmpt) {
            return cmpt && idName_1 != null && cmpt[attr] === idName_1;
        });
    }
}
function filterBySubType(components, condition) {
    // Using hasOwnProperty for restrict. Consider
    // subType is undefined in user payload.
    return condition.hasOwnProperty('subType') ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filter"])(components, function(cmpt) {
        return cmpt && cmpt.subType === condition.subType;
    }) : components;
}
function normalizeSetOptionInput(opts) {
    var replaceMergeMainTypeMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHashMap"])();
    opts && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeToArray"](opts.replaceMerge), function(mainType) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].hasClass(mainType), '"' + mainType + '" is not valid component main type in "replaceMerge"');
        }
        replaceMergeMainTypeMap.set(mainType, true);
    });
    return {
        replaceMergeMainTypeMap: replaceMergeMainTypeMap
    };
}
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mixin"])(GlobalModel, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PaletteMixin"]);
const __TURBOPACK__default__export__ = GlobalModel;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Model.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$env$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/env.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/clazz.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$areaStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/mixin/areaStyle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$textStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/mixin/textStyle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$lineStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/mixin/lineStyle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$itemStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/mixin/itemStyle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
var Model = /** @class */ function() {
    function Model(option, parentModel, ecModel) {
        this.parentModel = parentModel;
        this.ecModel = ecModel;
        this.option = option;
    // Simple optimization
    // if (this.init) {
    //     if (arguments.length <= 4) {
    //         this.init(option, parentModel, ecModel, extraOpt);
    //     }
    //     else {
    //         this.init.apply(this, arguments);
    //     }
    // }
    }
    Model.prototype.init = function(option, parentModel, ecModel) {
        var rest = [];
        for(var _i = 3; _i < arguments.length; _i++){
            rest[_i - 3] = arguments[_i];
        }
    };
    /**
   * Merge the input option to me.
   */ Model.prototype.mergeOption = function(option, ecModel) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"])(this.option, option, true);
    };
    // `path` can be 'a.b.c', so the return value type have to be `ModelOption`
    // TODO: TYPE strict key check?
    // get(path: string | string[], ignoreParent?: boolean): ModelOption;
    Model.prototype.get = function(path, ignoreParent) {
        if (path == null) {
            return this.option;
        }
        return this._doGet(this.parsePath(path), !ignoreParent && this.parentModel);
    };
    Model.prototype.getShallow = function(key, ignoreParent) {
        var option = this.option;
        var val = option == null ? option : option[key];
        if (val == null && !ignoreParent) {
            var parentModel = this.parentModel;
            if (parentModel) {
                // FIXME:TS do not know how to make it works
                val = parentModel.getShallow(key);
            }
        }
        return val;
    };
    // `path` can be 'a.b.c', so the return value type have to be `Model<ModelOption>`
    // getModel(path: string | string[], parentModel?: Model): Model;
    // TODO 'a.b.c' is deprecated
    Model.prototype.getModel = function(path, parentModel) {
        var hasPath = path != null;
        var pathFinal = hasPath ? this.parsePath(path) : null;
        var obj = hasPath ? this._doGet(pathFinal) : this.option;
        parentModel = parentModel || this.parentModel && this.parentModel.getModel(this.resolveParentPath(pathFinal));
        return new Model(obj, parentModel, this.ecModel);
    };
    /**
   * If model has option
   */ Model.prototype.isEmpty = function() {
        return this.option == null;
    };
    Model.prototype.restoreData = function() {};
    // Pending
    Model.prototype.clone = function() {
        var Ctor = this.constructor;
        return new Ctor((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clone"])(this.option));
    };
    // setReadOnly(properties): void {
    // clazzUtil.setReadOnly(this, properties);
    // }
    // If path is null/undefined, return null/undefined.
    Model.prototype.parsePath = function(path) {
        if (typeof path === 'string') {
            return path.split('.');
        }
        return path;
    };
    // Resolve path for parent. Perhaps useful when parent use a different property.
    // Default to be a identity resolver.
    // Can be modified to a different resolver.
    Model.prototype.resolveParentPath = function(path) {
        return path;
    };
    // FIXME:TS check whether put this method here
    Model.prototype.isAnimationEnabled = function() {
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$env$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].node && this.option) {
            if (this.option.animation != null) {
                return !!this.option.animation;
            } else if (this.parentModel) {
                return this.parentModel.isAnimationEnabled();
            }
        }
    };
    Model.prototype._doGet = function(pathArr, parentModel) {
        var obj = this.option;
        if (!pathArr) {
            return obj;
        }
        for(var i = 0; i < pathArr.length; i++){
            // Ignore empty
            if (!pathArr[i]) {
                continue;
            }
            // obj could be number/string/... (like 0)
            obj = obj && typeof obj === 'object' ? obj[pathArr[i]] : null;
            if (obj == null) {
                break;
            }
        }
        if (obj == null && parentModel) {
            obj = parentModel._doGet(this.resolveParentPath(pathArr), parentModel.parentModel);
        }
        return obj;
    };
    return Model;
}();
;
// Enable Model.extend.
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enableClassExtend"])(Model);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enableClassCheck"])(Model);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mixin"])(Model, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$lineStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LineStyleMixin"]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mixin"])(Model, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$itemStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemStyleMixin"]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mixin"])(Model, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$areaStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AreaStyleMixin"]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mixin"])(Model, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$textStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = Model;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/OptionManager.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-client] (ecmascript)");
;
;
;
var QUERY_REG = /^(min|max)?(.+)$/;
// Key: mainType
// type FakeComponentsMap = HashMap<(MappingExistingItem & { subType: string })[]>;
/**
 * TERM EXPLANATIONS:
 * See `ECOption` and `ECUnitOption` in `src/util/types.ts`.
 */ var OptionManager = /** @class */ function() {
    // timeline.notMerge is not supported in ec3. Firstly there is rearly
    // case that notMerge is needed. Secondly supporting 'notMerge' requires
    // rawOption cloned and backuped when timeline changed, which does no
    // good to performance. What's more, that both timeline and setOption
    // method supply 'notMerge' brings complex and some problems.
    // Consider this case:
    // (step1) chart.setOption({timeline: {notMerge: false}, ...}, false);
    // (step2) chart.setOption({timeline: {notMerge: true}, ...}, false);
    function OptionManager(api) {
        this._timelineOptions = [];
        this._mediaList = [];
        /**
     * -1, means default.
     * empty means no media.
     */ this._currentMediaIndices = [];
        this._api = api;
    }
    OptionManager.prototype.setOption = function(rawOption, optionPreprocessorFuncs, opt) {
        if (rawOption) {
            // That set dat primitive is dangerous if user reuse the data when setOption again.
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeToArray"])(rawOption.series), function(series) {
                series && series.data && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTypedArray"])(series.data) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAsPrimitive"])(series.data);
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeToArray"])(rawOption.dataset), function(dataset) {
                dataset && dataset.source && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTypedArray"])(dataset.source) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAsPrimitive"])(dataset.source);
            });
        }
        // Caution: some series modify option data, if do not clone,
        // it should ensure that the repeat modify correctly
        // (create a new object when modify itself).
        rawOption = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clone"])(rawOption);
        // FIXME
        // If some property is set in timeline options or media option but
        // not set in baseOption, a warning should be given.
        var optionBackup = this._optionBackup;
        var newParsedOption = parseRawOption(rawOption, optionPreprocessorFuncs, !optionBackup);
        this._newBaseOption = newParsedOption.baseOption;
        // For setOption at second time (using merge mode);
        if (optionBackup) {
            // FIXME
            // the restore merge solution is essentially incorrect.
            // the mapping can not be 100% consistent with ecModel, which probably brings
            // potential bug!
            // The first merge is delayed, because in most cases, users do not call `setOption` twice.
            // let fakeCmptsMap = this._fakeCmptsMap;
            // if (!fakeCmptsMap) {
            //     fakeCmptsMap = this._fakeCmptsMap = createHashMap();
            //     mergeToBackupOption(fakeCmptsMap, null, optionBackup.baseOption, null);
            // }
            // mergeToBackupOption(
            //     fakeCmptsMap, optionBackup.baseOption, newParsedOption.baseOption, opt
            // );
            // For simplicity, timeline options and media options do not support merge,
            // that is, if you `setOption` twice and both has timeline options, the latter
            // timeline options will not be merged to the former, but just substitute them.
            if (newParsedOption.timelineOptions.length) {
                optionBackup.timelineOptions = newParsedOption.timelineOptions;
            }
            if (newParsedOption.mediaList.length) {
                optionBackup.mediaList = newParsedOption.mediaList;
            }
            if (newParsedOption.mediaDefault) {
                optionBackup.mediaDefault = newParsedOption.mediaDefault;
            }
        } else {
            this._optionBackup = newParsedOption;
        }
    };
    OptionManager.prototype.mountOption = function(isRecreate) {
        var optionBackup = this._optionBackup;
        this._timelineOptions = optionBackup.timelineOptions;
        this._mediaList = optionBackup.mediaList;
        this._mediaDefault = optionBackup.mediaDefault;
        this._currentMediaIndices = [];
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clone"])(isRecreate ? optionBackup.baseOption : this._newBaseOption);
    };
    OptionManager.prototype.getTimelineOption = function(ecModel) {
        var option;
        var timelineOptions = this._timelineOptions;
        if (timelineOptions.length) {
            // getTimelineOption can only be called after ecModel inited,
            // so we can get currentIndex from timelineModel.
            var timelineModel = ecModel.getComponent('timeline');
            if (timelineModel) {
                option = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clone"])(// FIXME:TS as TimelineModel or quivlant interface
                timelineOptions[timelineModel.getCurrentIndex()]);
            }
        }
        return option;
    };
    OptionManager.prototype.getMediaOption = function(ecModel) {
        var ecWidth = this._api.getWidth();
        var ecHeight = this._api.getHeight();
        var mediaList = this._mediaList;
        var mediaDefault = this._mediaDefault;
        var indices = [];
        var result = [];
        // No media defined.
        if (!mediaList.length && !mediaDefault) {
            return result;
        }
        // Multi media may be applied, the latter defined media has higher priority.
        for(var i = 0, len = mediaList.length; i < len; i++){
            if (applyMediaQuery(mediaList[i].query, ecWidth, ecHeight)) {
                indices.push(i);
            }
        }
        // FIXME
        // Whether mediaDefault should force users to provide? Otherwise
        // the change by media query can not be recorvered.
        if (!indices.length && mediaDefault) {
            indices = [
                -1
            ];
        }
        if (indices.length && !indicesEquals(indices, this._currentMediaIndices)) {
            result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(indices, function(index) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clone"])(index === -1 ? mediaDefault.option : mediaList[index].option);
            });
        }
        // Otherwise return nothing.
        this._currentMediaIndices = indices;
        return result;
    };
    return OptionManager;
}();
/**
 * [RAW_OPTION_PATTERNS]
 * (Note: "series: []" represents all other props in `ECUnitOption`)
 *
 * (1) No prop "baseOption" declared:
 * Root option is used as "baseOption" (except prop "options" and "media").
 * ```js
 * option = {
 *     series: [],
 *     timeline: {},
 *     options: [],
 * };
 * option = {
 *     series: [],
 *     media: {},
 * };
 * option = {
 *     series: [],
 *     timeline: {},
 *     options: [],
 *     media: {},
 * }
 * ```
 *
 * (2) Prop "baseOption" declared:
 * If "baseOption" declared, `ECUnitOption` props can only be declared
 * inside "baseOption" except prop "timeline" (compat ec2).
 * ```js
 * option = {
 *     baseOption: {
 *         timeline: {},
 *         series: [],
 *     },
 *     options: []
 * };
 * option = {
 *     baseOption: {
 *         series: [],
 *     },
 *     media: []
 * };
 * option = {
 *     baseOption: {
 *         timeline: {},
 *         series: [],
 *     },
 *     options: []
 *     media: []
 * };
 * option = {
 *     // ec3 compat ec2: allow (only) `timeline` declared
 *     // outside baseOption. Keep this setting for compat.
 *     timeline: {},
 *     baseOption: {
 *         series: [],
 *     },
 *     options: [],
 *     media: []
 * };
 * ```
 */ function parseRawOption(// `rawOption` May be modified
rawOption, optionPreprocessorFuncs, isNew) {
    var mediaList = [];
    var mediaDefault;
    var baseOption;
    var declaredBaseOption = rawOption.baseOption;
    // Compatible with ec2, [RAW_OPTION_PATTERNS] above.
    var timelineOnRoot = rawOption.timeline;
    var timelineOptionsOnRoot = rawOption.options;
    var mediaOnRoot = rawOption.media;
    var hasMedia = !!rawOption.media;
    var hasTimeline = !!(timelineOptionsOnRoot || timelineOnRoot || declaredBaseOption && declaredBaseOption.timeline);
    if (declaredBaseOption) {
        baseOption = declaredBaseOption;
        // For merge option.
        if (!baseOption.timeline) {
            baseOption.timeline = timelineOnRoot;
        }
    } else {
        if (hasTimeline || hasMedia) {
            rawOption.options = rawOption.media = null;
        }
        baseOption = rawOption;
    }
    if (hasMedia) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(mediaOnRoot)) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(mediaOnRoot, function(singleMedia) {
                if ("TURBOPACK compile-time truthy", 1) {
                    // Real case of wrong config.
                    if (singleMedia && !singleMedia.option && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObject"])(singleMedia.query) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObject"])(singleMedia.query.option)) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["error"])('Illegal media option. Must be like { media: [ { query: {}, option: {} } ] }');
                    }
                }
                if (singleMedia && singleMedia.option) {
                    if (singleMedia.query) {
                        mediaList.push(singleMedia);
                    } else if (!mediaDefault) {
                        // Use the first media default.
                        mediaDefault = singleMedia;
                    }
                }
            });
        } else {
            if ("TURBOPACK compile-time truthy", 1) {
                // Real case of wrong config.
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["error"])('Illegal media option. Must be an array. Like { media: [ {...}, {...} ] }');
            }
        }
    }
    doPreprocess(baseOption);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(timelineOptionsOnRoot, function(option) {
        return doPreprocess(option);
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(mediaList, function(media) {
        return doPreprocess(media.option);
    });
    function doPreprocess(option) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(optionPreprocessorFuncs, function(preProcess) {
            preProcess(option, isNew);
        });
    }
    return {
        baseOption: baseOption,
        timelineOptions: timelineOptionsOnRoot || [],
        mediaDefault: mediaDefault,
        mediaList: mediaList
    };
}
/**
 * @see <http://www.w3.org/TR/css3-mediaqueries/#media1>
 * Support: width, height, aspectRatio
 * Can use max or min as prefix.
 */ function applyMediaQuery(query, ecWidth, ecHeight) {
    var realMap = {
        width: ecWidth,
        height: ecHeight,
        aspectratio: ecWidth / ecHeight // lower case for convenience.
    };
    var applicable = true;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(query, function(value, attr) {
        var matched = attr.match(QUERY_REG);
        if (!matched || !matched[1] || !matched[2]) {
            return;
        }
        var operator = matched[1];
        var realAttr = matched[2].toLowerCase();
        if (!compare(realMap[realAttr], value, operator)) {
            applicable = false;
        }
    });
    return applicable;
}
function compare(real, expect, operator) {
    if (operator === 'min') {
        return real >= expect;
    } else if (operator === 'max') {
        return real <= expect;
    } else {
        // Equals
        return real === expect;
    }
}
function indicesEquals(indices1, indices2) {
    // indices is always order by asc and has only finite number.
    return indices1.join(',') === indices2.join(',');
}
const __TURBOPACK__default__export__ = OptionManager;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Series.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SERIES_UNIVERSAL_TRANSITION_PROP",
    ()=>SERIES_UNIVERSAL_TRANSITION_PROP,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$env$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/env.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Component.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/mixin/palette.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$dataFormat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/mixin/dataFormat.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/layout.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$task$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/task.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/clazz.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$sourceManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/sourceManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$tooltip$2f$seriesFormatTooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/component/tooltip/seriesFormatTooltip.js [app-client] (ecmascript)");
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
var inner = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeInner"]();
function getSelectionKey(data, dataIndex) {
    return data.getName(dataIndex) || data.getId(dataIndex);
}
var SERIES_UNIVERSAL_TRANSITION_PROP = '__universalTransitionEnabled';
var SeriesModel = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(SeriesModel, _super);
    function SeriesModel() {
        // [Caution]: Because this class or desecendants can be used as `XXX.extend(subProto)`,
        // the class members must not be initialized in constructor or declaration place.
        // Otherwise there is bad case:
        //   class A {xxx = 1;}
        //   enableClassExtend(A);
        //   class B extends A {}
        //   var C = B.extend({xxx: 5});
        //   var c = new C();
        //   console.log(c.xxx); // expect 5 but always 1.
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // ---------------------------------------
        // Props about data selection
        // ---------------------------------------
        _this._selectedDataIndicesMap = {};
        return _this;
    }
    SeriesModel.prototype.init = function(option, parentModel, ecModel) {
        this.seriesIndex = this.componentIndex;
        this.dataTask = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$task$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createTask"])({
            count: dataTaskCount,
            reset: dataTaskReset
        });
        this.dataTask.context = {
            model: this
        };
        this.mergeDefaultAndTheme(option, ecModel);
        var sourceManager = inner(this).sourceManager = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$sourceManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SourceManager"](this);
        sourceManager.prepareSource();
        var data = this.getInitialData(option, ecModel);
        wrapData(data, this);
        this.dataTask.context.data = data;
        if ("TURBOPACK compile-time truthy", 1) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"](data, 'getInitialData returned invalid data.');
        }
        inner(this).dataBeforeProcessed = data;
        // If we reverse the order (make data firstly, and then make
        // dataBeforeProcessed by cloneShallow), cloneShallow will
        // cause data.graph.data !== data when using
        // module:echarts/data/Graph or module:echarts/data/Tree.
        // See module:echarts/data/helper/linkSeriesData
        // Theoretically, it is unreasonable to call `seriesModel.getData()` in the model
        // init or merge stage, because the data can be restored. So we do not `restoreData`
        // and `setData` here, which forbids calling `seriesModel.getData()` in this stage.
        // Call `seriesModel.getRawData()` instead.
        // this.restoreData();
        autoSeriesName(this);
        this._initSelectedMapFromData(data);
    };
    /**
   * Util for merge default and theme to option
   */ SeriesModel.prototype.mergeDefaultAndTheme = function(option, ecModel) {
        var layoutMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchLayoutMode"])(this);
        var inputPositionParams = layoutMode ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLayoutParams"])(option) : {};
        // Backward compat: using subType on theme.
        // But if name duplicate between series subType
        // (for example: parallel) add component mainType,
        // add suffix 'Series'.
        var themeSubType = this.subType;
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].hasClass(themeSubType)) {
            themeSubType += 'Series';
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"](option, ecModel.getTheme().get(this.subType));
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"](option, this.getDefaultOption());
        // Default label emphasis `show`
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultEmphasis"](option, 'label', [
            'show'
        ]);
        this.fillDataTextStyle(option.data);
        if (layoutMode) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeLayoutParam"])(option, inputPositionParams, layoutMode);
        }
    };
    SeriesModel.prototype.mergeOption = function(newSeriesOption, ecModel) {
        // this.settingTask.dirty();
        newSeriesOption = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"](this.option, newSeriesOption, true);
        this.fillDataTextStyle(newSeriesOption.data);
        var layoutMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchLayoutMode"])(this);
        if (layoutMode) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$layout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeLayoutParam"])(this.option, newSeriesOption, layoutMode);
        }
        var sourceManager = inner(this).sourceManager;
        sourceManager.dirty();
        sourceManager.prepareSource();
        var data = this.getInitialData(newSeriesOption, ecModel);
        wrapData(data, this);
        this.dataTask.dirty();
        this.dataTask.context.data = data;
        inner(this).dataBeforeProcessed = data;
        autoSeriesName(this);
        this._initSelectedMapFromData(data);
    };
    SeriesModel.prototype.fillDataTextStyle = function(data) {
        // Default data label emphasis `show`
        // FIXME Tree structure data ?
        // FIXME Performance ?
        if (data && !__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTypedArray"](data)) {
            var props = [
                'show'
            ];
            for(var i = 0; i < data.length; i++){
                if (data[i] && data[i].label) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultEmphasis"](data[i], 'label', props);
                }
            }
        }
    };
    /**
   * Init a data structure from data related option in series
   * Must be overridden.
   */ SeriesModel.prototype.getInitialData = function(option, ecModel) {
        return;
    };
    /**
   * Append data to list
   */ SeriesModel.prototype.appendData = function(params) {
        // FIXME ???
        // (1) If data from dataset, forbidden append.
        // (2) support append data of dataset.
        var data = this.getRawData();
        data.appendData(params.data);
    };
    /**
   * Consider some method like `filter`, `map` need make new data,
   * We should make sure that `seriesModel.getData()` get correct
   * data in the stream procedure. So we fetch data from upstream
   * each time `task.perform` called.
   */ SeriesModel.prototype.getData = function(dataType) {
        var task = getCurrentTask(this);
        if (task) {
            var data = task.context.data;
            return dataType == null || !data.getLinkedData ? data : data.getLinkedData(dataType);
        } else {
            // When series is not alive (that may happen when click toolbox
            // restore or setOption with not merge mode), series data may
            // be still need to judge animation or something when graphic
            // elements want to know whether fade out.
            return inner(this).data;
        }
    };
    SeriesModel.prototype.getAllData = function() {
        var mainData = this.getData();
        return mainData && mainData.getLinkedDataAll ? mainData.getLinkedDataAll() : [
            {
                data: mainData
            }
        ];
    };
    SeriesModel.prototype.setData = function(data) {
        var task = getCurrentTask(this);
        if (task) {
            var context = task.context;
            // Consider case: filter, data sample.
            // FIXME:TS never used, so comment it
            // if (context.data !== data && task.modifyOutputEnd) {
            //     task.setOutputEnd(data.count());
            // }
            context.outputData = data;
            // Caution: setData should update context.data,
            // Because getData may be called multiply in a
            // single stage and expect to get the data just
            // set. (For example, AxisProxy, x y both call
            // getData and setDate sequentially).
            // So the context.data should be fetched from
            // upstream each time when a stage starts to be
            // performed.
            if (task !== this.dataTask) {
                context.data = data;
            }
        }
        inner(this).data = data;
    };
    SeriesModel.prototype.getEncode = function() {
        var encode = this.get('encode', true);
        if (encode) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHashMap"](encode);
        }
    };
    SeriesModel.prototype.getSourceManager = function() {
        return inner(this).sourceManager;
    };
    SeriesModel.prototype.getSource = function() {
        return this.getSourceManager().getSource();
    };
    /**
   * Get data before processed
   */ SeriesModel.prototype.getRawData = function() {
        return inner(this).dataBeforeProcessed;
    };
    SeriesModel.prototype.getColorBy = function() {
        var colorBy = this.get('colorBy');
        return colorBy || 'series';
    };
    SeriesModel.prototype.isColorBySeries = function() {
        return this.getColorBy() === 'series';
    };
    /**
   * Get base axis if has coordinate system and has axis.
   * By default use coordSys.getBaseAxis();
   * Can be overridden for some chart.
   * @return {type} description
   */ SeriesModel.prototype.getBaseAxis = function() {
        var coordSys = this.coordinateSystem;
        return coordSys && coordSys.getBaseAxis && coordSys.getBaseAxis();
    };
    /**
   * Retrieve the index of nearest value in the view coordinate.
   * Data position is compared with each axis's dataToCoord.
   *
   * @param axisDim axis dimension
   * @param dim data dimension
   * @param value
   * @param [maxDistance=Infinity] The maximum distance in view coordinate space
   * @return If and only if multiple indices has
   *         the same value, they are put to the result.
   */ SeriesModel.prototype.indicesOfNearest = function(axisDim, dim, value, maxDistance) {
        var data = this.getData();
        var coordSys = this.coordinateSystem;
        var axis = coordSys && coordSys.getAxis(axisDim);
        if (!coordSys || !axis) {
            return [];
        }
        var targetCoord = axis.dataToCoord(value);
        if (maxDistance == null) {
            maxDistance = Infinity;
        }
        var nearestIndices = [];
        var minDist = Infinity;
        var minDiff = -1;
        var nearestIndicesLen = 0;
        // Performance-sensitive on large data (triggered by `tooltip`/`axisPointer` frequently).
        var dimIdx = data.getDimensionIndex(dim);
        var store = data.getStore();
        for(var idx = 0, len = store.count(); idx < len; idx++){
            var dimValue = store.get(dimIdx, idx);
            var dataCoord = axis.dataToCoord(dimValue);
            var diff = targetCoord - dataCoord;
            var dist = Math.abs(diff);
            if (dist <= maxDistance) {
                // When the `value` is at the middle of `this.get(dim, i)` and `this.get(dim, i+1)`,
                // we'd better not push both of them to `nearestIndices`, otherwise it is easy to
                // get more than one item in `nearestIndices` (more specifically, in `tooltip`).
                // So we choose the one that `diff >= 0` in this case.
                // But if `this.get(dim, i)` and `this.get(dim, j)` get the same value, both of them
                // should be push to `nearestIndices`.
                if (dist < minDist || dist === minDist && diff >= 0 && minDiff < 0) {
                    minDist = dist;
                    minDiff = diff;
                    nearestIndicesLen = 0;
                }
                if (diff === minDiff) {
                    nearestIndices[nearestIndicesLen++] = idx;
                }
            }
        }
        nearestIndices.length = nearestIndicesLen;
        return nearestIndices;
    };
    /**
   * Default tooltip formatter
   *
   * @param dataIndex
   * @param multipleSeries
   * @param dataType
   * @param renderMode valid values: 'html'(by default) and 'richText'.
   *        'html' is used for rendering tooltip in extra DOM form, and the result
   *        string is used as DOM HTML content.
   *        'richText' is used for rendering tooltip in rich text form, for those where
   *        DOM operation is not supported.
   * @return formatted tooltip with `html` and `markers`
   *        Notice: The override method can also return string
   */ SeriesModel.prototype.formatTooltip = function(dataIndex, multipleSeries, dataType) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$component$2f$tooltip$2f$seriesFormatTooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultSeriesFormatTooltip"])({
            series: this,
            dataIndex: dataIndex,
            multipleSeries: multipleSeries
        });
    };
    SeriesModel.prototype.isAnimationEnabled = function() {
        var ecModel = this.ecModel;
        // Disable animation if using echarts in node but not give ssr flag.
        // In ssr mode, renderToString will generate svg with css animation.
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$env$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].node && !(ecModel && ecModel.ssr)) {
            return false;
        }
        var animationEnabled = this.getShallow('animation');
        if (animationEnabled) {
            if (this.getData().count() > this.getShallow('animationThreshold')) {
                animationEnabled = false;
            }
        }
        return !!animationEnabled;
    };
    SeriesModel.prototype.restoreData = function() {
        // See `dataTaskReset`.
        this.dataTask.dirty();
    };
    SeriesModel.prototype.getColorFromPalette = function(name, scope, requestColorNum) {
        var ecModel = this.ecModel;
        // PENDING
        var color = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PaletteMixin"].prototype.getColorFromPalette.call(this, name, scope, requestColorNum);
        if (!color) {
            color = ecModel.getColorFromPalette(name, scope, requestColorNum);
        }
        return color;
    };
    /**
   * Use `data.mapDimensionsAll(coordDim)` instead.
   * @deprecated
   */ SeriesModel.prototype.coordDimToDataDim = function(coordDim) {
        return this.getRawData().mapDimensionsAll(coordDim);
    };
    /**
   * Get progressive rendering count each step
   */ SeriesModel.prototype.getProgressive = function() {
        return this.get('progressive');
    };
    /**
   * Get progressive rendering count each step
   */ SeriesModel.prototype.getProgressiveThreshold = function() {
        return this.get('progressiveThreshold');
    };
    // PENGING If selectedMode is null ?
    SeriesModel.prototype.select = function(innerDataIndices, dataType) {
        this._innerSelect(this.getData(dataType), innerDataIndices);
    };
    SeriesModel.prototype.unselect = function(innerDataIndices, dataType) {
        var selectedMap = this.option.selectedMap;
        if (!selectedMap) {
            return;
        }
        var selectedMode = this.option.selectedMode;
        var data = this.getData(dataType);
        if (selectedMode === 'series' || selectedMap === 'all') {
            this.option.selectedMap = {};
            this._selectedDataIndicesMap = {};
            return;
        }
        for(var i = 0; i < innerDataIndices.length; i++){
            var dataIndex = innerDataIndices[i];
            var nameOrId = getSelectionKey(data, dataIndex);
            selectedMap[nameOrId] = false;
            this._selectedDataIndicesMap[nameOrId] = -1;
        }
    };
    SeriesModel.prototype.toggleSelect = function(innerDataIndices, dataType) {
        var tmpArr = [];
        for(var i = 0; i < innerDataIndices.length; i++){
            tmpArr[0] = innerDataIndices[i];
            this.isSelected(innerDataIndices[i], dataType) ? this.unselect(tmpArr, dataType) : this.select(tmpArr, dataType);
        }
    };
    SeriesModel.prototype.getSelectedDataIndices = function() {
        if (this.option.selectedMap === 'all') {
            return [].slice.call(this.getData().getIndices());
        }
        var selectedDataIndicesMap = this._selectedDataIndicesMap;
        var nameOrIds = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keys"](selectedDataIndicesMap);
        var dataIndices = [];
        for(var i = 0; i < nameOrIds.length; i++){
            var dataIndex = selectedDataIndicesMap[nameOrIds[i]];
            if (dataIndex >= 0) {
                dataIndices.push(dataIndex);
            }
        }
        return dataIndices;
    };
    SeriesModel.prototype.isSelected = function(dataIndex, dataType) {
        var selectedMap = this.option.selectedMap;
        if (!selectedMap) {
            return false;
        }
        var data = this.getData(dataType);
        return (selectedMap === 'all' || selectedMap[getSelectionKey(data, dataIndex)]) && !data.getItemModel(dataIndex).get([
            'select',
            'disabled'
        ]);
    };
    SeriesModel.prototype.isUniversalTransitionEnabled = function() {
        if (this[SERIES_UNIVERSAL_TRANSITION_PROP]) {
            return true;
        }
        var universalTransitionOpt = this.option.universalTransition;
        // Quick reject
        if (!universalTransitionOpt) {
            return false;
        }
        if (universalTransitionOpt === true) {
            return true;
        }
        // Can be simply 'universalTransition: true'
        return universalTransitionOpt && universalTransitionOpt.enabled;
    };
    SeriesModel.prototype._innerSelect = function(data, innerDataIndices) {
        var _a, _b;
        var option = this.option;
        var selectedMode = option.selectedMode;
        var len = innerDataIndices.length;
        if (!selectedMode || !len) {
            return;
        }
        if (selectedMode === 'series') {
            option.selectedMap = 'all';
        } else if (selectedMode === 'multiple') {
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObject"](option.selectedMap)) {
                option.selectedMap = {};
            }
            var selectedMap = option.selectedMap;
            for(var i = 0; i < len; i++){
                var dataIndex = innerDataIndices[i];
                // TODO different types of data share same object.
                var nameOrId = getSelectionKey(data, dataIndex);
                selectedMap[nameOrId] = true;
                this._selectedDataIndicesMap[nameOrId] = data.getRawIndex(dataIndex);
            }
        } else if (selectedMode === 'single' || selectedMode === true) {
            var lastDataIndex = innerDataIndices[len - 1];
            var nameOrId = getSelectionKey(data, lastDataIndex);
            option.selectedMap = (_a = {}, _a[nameOrId] = true, _a);
            this._selectedDataIndicesMap = (_b = {}, _b[nameOrId] = data.getRawIndex(lastDataIndex), _b);
        }
    };
    SeriesModel.prototype._initSelectedMapFromData = function(data) {
        // Ignore select info in data if selectedMap exists.
        // NOTE It's only for legacy usage. edge data is not supported.
        if (this.option.selectedMap) {
            return;
        }
        var dataIndices = [];
        if (data.hasItemOption) {
            data.each(function(idx) {
                var rawItem = data.getRawDataItem(idx);
                if (rawItem && rawItem.selected) {
                    dataIndices.push(idx);
                }
            });
        }
        if (dataIndices.length > 0) {
            this._innerSelect(data, dataIndices);
        }
    };
    // /**
    //  * @see {module:echarts/stream/Scheduler}
    //  */
    // abstract pipeTask: null
    SeriesModel.registerClass = function(clz) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].registerClass(clz);
    };
    SeriesModel.protoInitialize = function() {
        var proto = SeriesModel.prototype;
        proto.type = 'series.__base__';
        proto.seriesIndex = 0;
        proto.ignoreStyleOnData = false;
        proto.hasSymbolVisual = false;
        proto.defaultSymbol = 'circle';
        // Make sure the values can be accessed!
        proto.visualStyleAccessPath = 'itemStyle';
        proto.visualDrawType = 'fill';
    }();
    return SeriesModel;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mixin"](SeriesModel, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$dataFormat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataFormatMixin"]);
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mixin"](SeriesModel, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PaletteMixin"]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mountExtend"])(SeriesModel, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
/**
 * MUST be called after `prepareSource` called
 * Here we need to make auto series, especially for auto legend. But we
 * do not modify series.name in option to avoid side effects.
 */ function autoSeriesName(seriesModel) {
    // User specified name has higher priority, otherwise it may cause
    // series can not be queried unexpectedly.
    var name = seriesModel.name;
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNameSpecified"](seriesModel)) {
        seriesModel.name = getSeriesAutoName(seriesModel) || name;
    }
}
function getSeriesAutoName(seriesModel) {
    var data = seriesModel.getRawData();
    var dataDims = data.mapDimensionsAll('seriesName');
    var nameArr = [];
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](dataDims, function(dataDim) {
        var dimInfo = data.getDimensionInfo(dataDim);
        dimInfo.displayName && nameArr.push(dimInfo.displayName);
    });
    return nameArr.join(' ');
}
function dataTaskCount(context) {
    return context.model.getRawData().count();
}
function dataTaskReset(context) {
    var seriesModel = context.model;
    seriesModel.setData(seriesModel.getRawData().cloneShallow());
    return dataTaskProgress;
}
function dataTaskProgress(param, context) {
    // Avoid repeat cloneShallow when data just created in reset.
    if (context.outputData && param.end > context.outputData.count()) {
        context.model.getRawData().cloneShallow(context.outputData);
    }
}
// TODO refactor
function wrapData(data, seriesModel) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["concatArray"](data.CHANGABLE_METHODS, data.DOWNSAMPLE_METHODS), function(methodName) {
        data.wrapMethod(methodName, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["curry"](onDataChange, seriesModel));
    });
}
function onDataChange(seriesModel, newList) {
    var task = getCurrentTask(seriesModel);
    if (task) {
        // Consider case: filter, selectRange
        task.setOutputEnd((newList || this).count());
    }
    return newList;
}
function getCurrentTask(seriesModel) {
    var scheduler = (seriesModel.ecModel || {}).scheduler;
    var pipeline = scheduler && scheduler.getPipeline(seriesModel.uid);
    if (pipeline) {
        // When pipline finished, the currrentTask keep the last
        // task (renderTask).
        var task = pipeline.currentTask;
        if (task) {
            var agentStubMap = task.agentStubMap;
            if (agentStubMap) {
                task = agentStubMap.get(seriesModel.uid);
            }
        }
        return task;
    }
}
const __TURBOPACK__default__export__ = SeriesModel;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/globalDefault.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/tool/color.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/tokens.js [app-client] (ecmascript)");
;
;
var platform = '';
// Navigator not exists in node
if (typeof navigator !== 'undefined') {
    platform = navigator.platform || '';
}
var decalColor = 'rgba(0, 0, 0, 0.2)';
var themeColor = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.theme[0];
var lightThemeColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["modifyHSL"])(themeColor, null, null, 0.9);
const __TURBOPACK__default__export__ = {
    darkMode: 'auto',
    // backgroundColor: 'rgba(0,0,0,0)',
    colorBy: 'series',
    color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.theme,
    gradientColor: [
        lightThemeColor,
        themeColor
    ],
    aria: {
        decal: {
            decals: [
                {
                    color: decalColor,
                    dashArrayX: [
                        1,
                        0
                    ],
                    dashArrayY: [
                        2,
                        5
                    ],
                    symbolSize: 1,
                    rotation: Math.PI / 6
                },
                {
                    color: decalColor,
                    symbol: 'circle',
                    dashArrayX: [
                        [
                            8,
                            8
                        ],
                        [
                            0,
                            8,
                            8,
                            0
                        ]
                    ],
                    dashArrayY: [
                        6,
                        0
                    ],
                    symbolSize: 0.8
                },
                {
                    color: decalColor,
                    dashArrayX: [
                        1,
                        0
                    ],
                    dashArrayY: [
                        4,
                        3
                    ],
                    rotation: -Math.PI / 4
                },
                {
                    color: decalColor,
                    dashArrayX: [
                        [
                            6,
                            6
                        ],
                        [
                            0,
                            6,
                            6,
                            0
                        ]
                    ],
                    dashArrayY: [
                        6,
                        0
                    ]
                },
                {
                    color: decalColor,
                    dashArrayX: [
                        [
                            1,
                            0
                        ],
                        [
                            1,
                            6
                        ]
                    ],
                    dashArrayY: [
                        1,
                        0,
                        6,
                        0
                    ],
                    rotation: Math.PI / 4
                },
                {
                    color: decalColor,
                    symbol: 'triangle',
                    dashArrayX: [
                        [
                            9,
                            9
                        ],
                        [
                            0,
                            9,
                            9,
                            0
                        ]
                    ],
                    dashArrayY: [
                        7,
                        2
                    ],
                    symbolSize: 0.75
                }
            ]
        }
    },
    // If xAxis and yAxis declared, grid is created by default.
    // grid: {},
    textStyle: {
        // color: '#000',
        // decoration: 'none',
        // PENDING
        fontFamily: platform.match(/^Win/) ? 'Microsoft YaHei' : 'sans-serif',
        // fontFamily: 'Arial, Verdana, sans-serif',
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: 'normal'
    },
    // http://blogs.adobe.com/webplatform/2014/02/24/using-blend-modes-in-html-canvas/
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
    // Default is source-over
    blendMode: null,
    stateAnimation: {
        duration: 300,
        easing: 'cubicOut'
    },
    animation: 'auto',
    animationDuration: 1000,
    animationDurationUpdate: 500,
    animationEasing: 'cubicInOut',
    animationEasingUpdate: 'cubicInOut',
    animationThreshold: 2000,
    // Configuration for progressive/incremental rendering
    progressiveThreshold: 3000,
    progressive: 400,
    // Threshold of if use single hover layer to optimize.
    // It is recommended that `hoverLayerThreshold` is equivalent to or less than
    // `progressiveThreshold`, otherwise hover will cause restart of progressive,
    // which is unexpected.
    // see example <echarts/test/heatmap-large.html>.
    hoverLayerThreshold: 3000,
    // See: module:echarts/scale/Time
    useUTC: false
};
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/internalComponentCreator.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "concatInternalOptions",
    ()=>concatInternalOptions,
    "registerInternalOptionCreator",
    ()=>registerInternalOptionCreator
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
;
;
var internalOptionCreatorMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHashMap"])();
function registerInternalOptionCreator(mainType, creator) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])(internalOptionCreatorMap.get(mainType) == null && creator);
    internalOptionCreatorMap.set(mainType, creator);
}
function concatInternalOptions(ecModel, mainType, newCmptOptionList) {
    var internalOptionCreator = internalOptionCreatorMap.get(mainType);
    if (!internalOptionCreator) {
        return newCmptOptionList;
    }
    var internalOptions = internalOptionCreator(ecModel);
    if (!internalOptions) {
        return newCmptOptionList;
    }
    if ("TURBOPACK compile-time truthy", 1) {
        for(var i = 0; i < internalOptions.length; i++){
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isComponentIdInternal"])(internalOptions[i]));
        }
    }
    return newCmptOptionList.concat(internalOptions);
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/mixin/areaStyle.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AREA_STYLE_KEY_MAP",
    ()=>AREA_STYLE_KEY_MAP,
    "AreaStyleMixin",
    ()=>AreaStyleMixin
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$makeStyleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/mixin/makeStyleMapper.js [app-client] (ecmascript)");
;
var AREA_STYLE_KEY_MAP = [
    [
        'fill',
        'color'
    ],
    [
        'shadowBlur'
    ],
    [
        'shadowOffsetX'
    ],
    [
        'shadowOffsetY'
    ],
    [
        'opacity'
    ],
    [
        'shadowColor'
    ]
];
var getAreaStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$makeStyleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(AREA_STYLE_KEY_MAP);
var AreaStyleMixin = /** @class */ function() {
    function AreaStyleMixin() {}
    AreaStyleMixin.prototype.getAreaStyle = function(excludes, includes) {
        return getAreaStyle(this, excludes, includes);
    };
    return AreaStyleMixin;
}();
;
;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/mixin/dataFormat.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataFormatMixin",
    ()=>DataFormatMixin,
    "normalizeTooltipFormatResult",
    ()=>normalizeTooltipFormatResult
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/dataProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/format.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-client] (ecmascript)");
;
;
;
;
var DIMENSION_LABEL_REG = /\{@(.+?)\}/g;
var DataFormatMixin = /** @class */ function() {
    function DataFormatMixin() {}
    /**
   * Get params for formatter
   */ DataFormatMixin.prototype.getDataParams = function(dataIndex, dataType) {
        var data = this.getData(dataType);
        var rawValue = this.getRawValue(dataIndex, dataType);
        var rawDataIndex = data.getRawIndex(dataIndex);
        var name = data.getName(dataIndex);
        var itemOpt = data.getRawDataItem(dataIndex);
        var style = data.getItemVisual(dataIndex, 'style');
        var color = style && style[data.getItemVisual(dataIndex, 'drawType') || 'fill'];
        var borderColor = style && style.stroke;
        var mainType = this.mainType;
        var isSeries = mainType === 'series';
        var userOutput = data.userOutput && data.userOutput.get();
        return {
            componentType: mainType,
            componentSubType: this.subType,
            componentIndex: this.componentIndex,
            seriesType: isSeries ? this.subType : null,
            seriesIndex: this.seriesIndex,
            seriesId: isSeries ? this.id : null,
            seriesName: isSeries ? this.name : null,
            name: name,
            dataIndex: rawDataIndex,
            data: itemOpt,
            dataType: dataType,
            value: rawValue,
            color: color,
            borderColor: borderColor,
            dimensionNames: userOutput ? userOutput.fullDimensions : null,
            encode: userOutput ? userOutput.encode : null,
            // Param name list for mapping `a`, `b`, `c`, `d`, `e`
            $vars: [
                'seriesName',
                'name',
                'value'
            ]
        };
    };
    /**
   * Format label
   * @param dataIndex
   * @param status 'normal' by default
   * @param dataType
   * @param labelDimIndex Only used in some chart that
   *        use formatter in different dimensions, like radar.
   * @param formatter Formatter given outside.
   * @return return null/undefined if no formatter
   */ DataFormatMixin.prototype.getFormattedLabel = function(dataIndex, status, dataType, labelDimIndex, formatter, extendParams) {
        status = status || 'normal';
        var data = this.getData(dataType);
        var params = this.getDataParams(dataIndex, dataType);
        if (extendParams) {
            params.value = extendParams.interpolatedValue;
        }
        if (labelDimIndex != null && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"](params.value)) {
            params.value = params.value[labelDimIndex];
        }
        if (!formatter) {
            var itemModel = data.getItemModel(dataIndex);
            // @ts-ignore
            formatter = itemModel.get(status === 'normal' ? [
                'label',
                'formatter'
            ] : [
                status,
                'label',
                'formatter'
            ]);
        }
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFunction"](formatter)) {
            params.status = status;
            params.dimensionIndex = labelDimIndex;
            return formatter(params);
        } else if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"](formatter)) {
            var str = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["formatTpl"])(formatter, params);
            // Support 'aaa{@[3]}bbb{@product}ccc'.
            // Do not support '}' in dim name util have to.
            return str.replace(DIMENSION_LABEL_REG, function(origin, dimStr) {
                var len = dimStr.length;
                var dimLoose = dimStr;
                if (dimLoose.charAt(0) === '[' && dimLoose.charAt(len - 1) === ']') {
                    dimLoose = +dimLoose.slice(1, len - 1); // Also support: '[]' => 0
                    if ("TURBOPACK compile-time truthy", 1) {
                        if (isNaN(dimLoose)) {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["error"])("Invalide label formatter: @" + dimStr + ", only support @[0], @[1], @[2], ...");
                        }
                    }
                }
                var val = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["retrieveRawValue"])(data, dataIndex, dimLoose);
                if (extendParams && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"](extendParams.interpolatedValue)) {
                    var dimIndex = data.getDimensionIndex(dimLoose);
                    if (dimIndex >= 0) {
                        val = extendParams.interpolatedValue[dimIndex];
                    }
                }
                return val != null ? val + '' : '';
            });
        }
    };
    /**
   * Get raw value in option
   */ DataFormatMixin.prototype.getRawValue = function(idx, dataType) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["retrieveRawValue"])(this.getData(dataType), idx);
    };
    /**
   * Should be implemented.
   * @param {number} dataIndex
   * @param {boolean} [multipleSeries=false]
   * @param {string} [dataType]
   */ DataFormatMixin.prototype.formatTooltip = function(dataIndex, multipleSeries, dataType) {
        // Empty function
        return;
    };
    return DataFormatMixin;
}();
;
;
function normalizeTooltipFormatResult(result) {
    var markupText;
    // let markers: Dictionary<ColorString>;
    var markupFragment;
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObject"](result)) {
        if (result.type) {
            markupFragment = result;
        } else {
            if ("TURBOPACK compile-time truthy", 1) {
                console.warn('The return type of `formatTooltip` is not supported: ' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makePrintable"])(result));
            }
        }
    // else {
    //     markupText = (result as TooltipFormatResultLegacyObject).html;
    //     markers = (result as TooltipFormatResultLegacyObject).markers;
    //     if (markersExisting) {
    //         markers = zrUtil.merge(markersExisting, markers);
    //     }
    // }
    } else {
        markupText = result;
    }
    return {
        text: markupText,
        // markers: markers || markersExisting,
        frag: markupFragment
    };
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/mixin/itemStyle.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ITEM_STYLE_KEY_MAP",
    ()=>ITEM_STYLE_KEY_MAP,
    "ItemStyleMixin",
    ()=>ItemStyleMixin
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$makeStyleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/mixin/makeStyleMapper.js [app-client] (ecmascript)");
;
var ITEM_STYLE_KEY_MAP = [
    [
        'fill',
        'color'
    ],
    [
        'stroke',
        'borderColor'
    ],
    [
        'lineWidth',
        'borderWidth'
    ],
    [
        'opacity'
    ],
    [
        'shadowBlur'
    ],
    [
        'shadowOffsetX'
    ],
    [
        'shadowOffsetY'
    ],
    [
        'shadowColor'
    ],
    [
        'lineDash',
        'borderType'
    ],
    [
        'lineDashOffset',
        'borderDashOffset'
    ],
    [
        'lineCap',
        'borderCap'
    ],
    [
        'lineJoin',
        'borderJoin'
    ],
    [
        'miterLimit',
        'borderMiterLimit'
    ]
];
var getItemStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$makeStyleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(ITEM_STYLE_KEY_MAP);
var ItemStyleMixin = /** @class */ function() {
    function ItemStyleMixin() {}
    ItemStyleMixin.prototype.getItemStyle = function(excludes, includes) {
        return getItemStyle(this, excludes, includes);
    };
    return ItemStyleMixin;
}();
;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/mixin/lineStyle.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LINE_STYLE_KEY_MAP",
    ()=>LINE_STYLE_KEY_MAP,
    "LineStyleMixin",
    ()=>LineStyleMixin
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$makeStyleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/mixin/makeStyleMapper.js [app-client] (ecmascript)");
;
var LINE_STYLE_KEY_MAP = [
    [
        'lineWidth',
        'width'
    ],
    [
        'stroke',
        'color'
    ],
    [
        'opacity'
    ],
    [
        'shadowBlur'
    ],
    [
        'shadowOffsetX'
    ],
    [
        'shadowOffsetY'
    ],
    [
        'shadowColor'
    ],
    [
        'lineDash',
        'type'
    ],
    [
        'lineDashOffset',
        'dashOffset'
    ],
    [
        'lineCap',
        'cap'
    ],
    [
        'lineJoin',
        'join'
    ],
    [
        'miterLimit'
    ]
];
var getLineStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$makeStyleMapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(LINE_STYLE_KEY_MAP);
var LineStyleMixin = /** @class */ function() {
    function LineStyleMixin() {}
    LineStyleMixin.prototype.getLineStyle = function(excludes) {
        return getLineStyle(this, excludes);
    };
    return LineStyleMixin;
}();
;
;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/mixin/makeStyleMapper.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>makeStyleMapper
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
*/ // TODO Parse shadow style
// TODO Only shallow path support
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
;
function makeStyleMapper(properties, ignoreParent) {
    // Normalize
    for(var i = 0; i < properties.length; i++){
        if (!properties[i][1]) {
            properties[i][1] = properties[i][0];
        }
    }
    ignoreParent = ignoreParent || false;
    return function(model, excludes, includes) {
        var style = {};
        for(var i = 0; i < properties.length; i++){
            var propName = properties[i][1];
            if (excludes && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indexOf"](excludes, propName) >= 0 || includes && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indexOf"](includes, propName) < 0) {
                continue;
            }
            var val = model.getShallow(propName, ignoreParent);
            if (val != null) {
                style[properties[i][0]] = val;
            }
        }
        // TODO Text or image?
        return style;
    };
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/mixin/palette.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PaletteMixin",
    ()=>PaletteMixin,
    "getDecalFromPalette",
    ()=>getDecalFromPalette
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
var innerColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeInner"])();
var innerDecal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeInner"])();
var PaletteMixin = /** @class */ function() {
    function PaletteMixin() {}
    PaletteMixin.prototype.getColorFromPalette = function(name, scope, requestNum) {
        var defaultPalette = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeToArray"])(this.get('color', true));
        var layeredPalette = this.get('colorLayer', true);
        return getFromPalette(this, innerColor, defaultPalette, layeredPalette, name, scope, requestNum);
    };
    PaletteMixin.prototype.clearColorPalette = function() {
        clearPalette(this, innerColor);
    };
    return PaletteMixin;
}();
function getDecalFromPalette(ecModel, name, scope, requestNum) {
    var defaultDecals = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeToArray"])(ecModel.get([
        'aria',
        'decal',
        'decals'
    ]));
    return getFromPalette(ecModel, innerDecal, defaultDecals, null, name, scope, requestNum);
}
function getNearestPalette(palettes, requestColorNum) {
    var paletteNum = palettes.length;
    // TODO palettes must be in order
    for(var i = 0; i < paletteNum; i++){
        if (palettes[i].length > requestColorNum) {
            return palettes[i];
        }
    }
    return palettes[paletteNum - 1];
}
/**
 * @param name MUST NOT be null/undefined. Otherwise call this function
 *             twise with the same parameters will get different result.
 * @param scope default this.
 * @return Can be null/undefined
 */ function getFromPalette(that, inner, defaultPalette, layeredPalette, name, scope, requestNum) {
    scope = scope || that;
    var scopeFields = inner(scope);
    var paletteIdx = scopeFields.paletteIdx || 0;
    var paletteNameMap = scopeFields.paletteNameMap = scopeFields.paletteNameMap || {};
    // Use `hasOwnProperty` to avoid conflict with Object.prototype.
    if (paletteNameMap.hasOwnProperty(name)) {
        return paletteNameMap[name];
    }
    var palette = requestNum == null || !layeredPalette ? defaultPalette : getNearestPalette(layeredPalette, requestNum);
    // In case can't find in layered color palette.
    palette = palette || defaultPalette;
    if (!palette || !palette.length) {
        return;
    }
    var pickedPaletteItem = palette[paletteIdx];
    if (name) {
        paletteNameMap[name] = pickedPaletteItem;
    }
    scopeFields.paletteIdx = (paletteIdx + 1) % palette.length;
    return pickedPaletteItem;
}
function clearPalette(that, inner) {
    inner(that).paletteIdx = 0;
    inner(that).paletteNameMap = {};
}
;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/mixin/textStyle.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/label/labelStyle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Text.js [app-client] (ecmascript)");
;
;
var PATH_COLOR = [
    'textStyle',
    'color'
];
var textStyleParams = [
    'fontStyle',
    'fontWeight',
    'fontSize',
    'fontFamily',
    'padding',
    'lineHeight',
    'rich',
    'width',
    'height',
    'overflow'
];
// TODO Performance improvement?
var tmpText = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]();
var TextStyleMixin = /** @class */ function() {
    function TextStyleMixin() {}
    /**
   * Get color property or get color from option.textStyle.color
   */ // TODO Callback
    TextStyleMixin.prototype.getTextColor = function(isEmphasis) {
        var ecModel = this.ecModel;
        return this.getShallow('color') || (!isEmphasis && ecModel ? ecModel.get(PATH_COLOR) : null);
    };
    /**
   * Create font string from fontStyle, fontWeight, fontSize, fontFamily
   * @return {string}
   */ TextStyleMixin.prototype.getFont = function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFont"])({
            fontStyle: this.getShallow('fontStyle'),
            fontWeight: this.getShallow('fontWeight'),
            fontSize: this.getShallow('fontSize'),
            fontFamily: this.getShallow('fontFamily')
        }, this.ecModel);
    };
    TextStyleMixin.prototype.getTextRect = function(text) {
        var style = {
            text: text,
            verticalAlign: this.getShallow('verticalAlign') || this.getShallow('baseline')
        };
        for(var i = 0; i < textStyleParams.length; i++){
            style[textStyleParams[i]] = this.getShallow(textStyleParams[i]);
        }
        tmpText.useStyle(style);
        tmpText.update();
        return tmpText.getBoundingRect();
    };
    return TextStyleMixin;
}();
;
const __TURBOPACK__default__export__ = TextStyleMixin;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/referHelper.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SeriesModelCoordSysInfo",
    ()=>SeriesModelCoordSysInfo,
    "getCoordSysInfoBySeries",
    ()=>getCoordSysInfoBySeries
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
*/ /**
 * Helper for model references.
 * There are many manners to refer axis/coordSys.
 */ // TODO
// merge relevant logic to this file?
// check: "modelHelper" of tooltip and "BrushTargetManager".
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
;
;
/**
 * @class
 * For example:
 * {
 *     coordSysName: 'cartesian2d',
 *     coordSysDims: ['x', 'y', ...],
 *     axisMap: HashMap({
 *         x: xAxisModel,
 *         y: yAxisModel
 *     }),
 *     categoryAxisMap: HashMap({
 *         x: xAxisModel,
 *         y: undefined
 *     }),
 *     // The index of the first category axis in `coordSysDims`.
 *     // `null/undefined` means no category axis exists.
 *     firstCategoryDimIndex: 1,
 *     // To replace user specified encode.
 * }
 */ var SeriesModelCoordSysInfo = /** @class */ function() {
    function SeriesModelCoordSysInfo(coordSysName) {
        this.coordSysDims = [];
        this.axisMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHashMap"])();
        this.categoryAxisMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHashMap"])();
        this.coordSysName = coordSysName;
    }
    return SeriesModelCoordSysInfo;
}();
;
function getCoordSysInfoBySeries(seriesModel) {
    var coordSysName = seriesModel.get('coordinateSystem');
    var result = new SeriesModelCoordSysInfo(coordSysName);
    var fetch = fetchers[coordSysName];
    if (fetch) {
        fetch(seriesModel, result, result.axisMap, result.categoryAxisMap);
        return result;
    }
}
// TODO: refactor them to static member of each coord sys, rather than hard code here.
var fetchers = {
    cartesian2d: function(seriesModel, result, axisMap, categoryAxisMap) {
        var xAxisModel = seriesModel.getReferringComponents('xAxis', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SINGLE_REFERRING"]).models[0];
        var yAxisModel = seriesModel.getReferringComponents('yAxis', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SINGLE_REFERRING"]).models[0];
        if ("TURBOPACK compile-time truthy", 1) {
            if (!xAxisModel) {
                throw new Error('xAxis "' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["retrieve"])(seriesModel.get('xAxisIndex'), seriesModel.get('xAxisId'), 0) + '" not found');
            }
            if (!yAxisModel) {
                throw new Error('yAxis "' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["retrieve"])(seriesModel.get('xAxisIndex'), seriesModel.get('yAxisId'), 0) + '" not found');
            }
        }
        result.coordSysDims = [
            'x',
            'y'
        ];
        axisMap.set('x', xAxisModel);
        axisMap.set('y', yAxisModel);
        if (isCategory(xAxisModel)) {
            categoryAxisMap.set('x', xAxisModel);
            result.firstCategoryDimIndex = 0;
        }
        if (isCategory(yAxisModel)) {
            categoryAxisMap.set('y', yAxisModel);
            result.firstCategoryDimIndex == null && (result.firstCategoryDimIndex = 1);
        }
    },
    singleAxis: function(seriesModel, result, axisMap, categoryAxisMap) {
        var singleAxisModel = seriesModel.getReferringComponents('singleAxis', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SINGLE_REFERRING"]).models[0];
        if ("TURBOPACK compile-time truthy", 1) {
            if (!singleAxisModel) {
                throw new Error('singleAxis should be specified.');
            }
        }
        result.coordSysDims = [
            'single'
        ];
        axisMap.set('single', singleAxisModel);
        if (isCategory(singleAxisModel)) {
            categoryAxisMap.set('single', singleAxisModel);
            result.firstCategoryDimIndex = 0;
        }
    },
    polar: function(seriesModel, result, axisMap, categoryAxisMap) {
        var polarModel = seriesModel.getReferringComponents('polar', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SINGLE_REFERRING"]).models[0];
        var radiusAxisModel = polarModel.findAxisModel('radiusAxis');
        var angleAxisModel = polarModel.findAxisModel('angleAxis');
        if ("TURBOPACK compile-time truthy", 1) {
            if (!angleAxisModel) {
                throw new Error('angleAxis option not found');
            }
            if (!radiusAxisModel) {
                throw new Error('radiusAxis option not found');
            }
        }
        result.coordSysDims = [
            'radius',
            'angle'
        ];
        axisMap.set('radius', radiusAxisModel);
        axisMap.set('angle', angleAxisModel);
        if (isCategory(radiusAxisModel)) {
            categoryAxisMap.set('radius', radiusAxisModel);
            result.firstCategoryDimIndex = 0;
        }
        if (isCategory(angleAxisModel)) {
            categoryAxisMap.set('angle', angleAxisModel);
            result.firstCategoryDimIndex == null && (result.firstCategoryDimIndex = 1);
        }
    },
    geo: function(seriesModel, result, axisMap, categoryAxisMap) {
        result.coordSysDims = [
            'lng',
            'lat'
        ];
    },
    parallel: function(seriesModel, result, axisMap, categoryAxisMap) {
        var ecModel = seriesModel.ecModel;
        var parallelModel = ecModel.getComponent('parallel', seriesModel.get('parallelIndex'));
        var coordSysDims = result.coordSysDims = parallelModel.dimensions.slice();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(parallelModel.parallelAxisIndex, function(axisIndex, index) {
            var axisModel = ecModel.getComponent('parallelAxis', axisIndex);
            var axisDim = coordSysDims[index];
            axisMap.set(axisDim, axisModel);
            if (isCategory(axisModel)) {
                categoryAxisMap.set(axisDim, axisModel);
                if (result.firstCategoryDimIndex == null) {
                    result.firstCategoryDimIndex = index;
                }
            }
        });
    },
    matrix: function(seriesModel, result, axisMap, categoryAxisMap) {
        var matrixModel = seriesModel.getReferringComponents('matrix', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SINGLE_REFERRING"]).models[0];
        if ("TURBOPACK compile-time truthy", 1) {
            if (!matrixModel) {
                throw new Error('matrix coordinate system should be specified.');
            }
        }
        result.coordSysDims = [
            'x',
            'y'
        ];
        var xModel = matrixModel.getDimensionModel('x');
        var yModel = matrixModel.getDimensionModel('y');
        axisMap.set('x', xModel);
        axisMap.set('y', yModel);
        categoryAxisMap.set('x', xModel);
        categoryAxisMap.set('y', yModel);
    }
};
function isCategory(axisModel) {
    return axisModel.get('type') === 'category';
}
}),
]);

//# sourceMappingURL=10pt_echarts_lib_model_190gybs._.js.map