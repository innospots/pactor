(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/ECEventProcessor.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ECEventProcessor",
    ()=>ECEventProcessor
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/clazz.js [app-client] (ecmascript)");
;
;
/**
 * Usage of query:
 * `chart.on('click', query, handler);`
 * The `query` can be:
 * + The component type query string, only `mainType` or `mainType.subType`,
 *   like: 'xAxis', 'series', 'xAxis.category' or 'series.line'.
 * + The component query object, like:
 *   `{seriesIndex: 2}`, `{seriesName: 'xx'}`, `{seriesId: 'some'}`,
 *   `{xAxisIndex: 2}`, `{xAxisName: 'xx'}`, `{xAxisId: 'some'}`.
 * + The data query object, like:
 *   `{dataIndex: 123}`, `{dataType: 'link'}`, `{name: 'some'}`.
 * + The other query object (cmponent customized query), like:
 *   `{element: 'some'}` (only available in custom series).
 *
 * Caveat: If a prop in the `query` object is `null/undefined`, it is the
 * same as there is no such prop in the `query` object.
 */ var ECEventProcessor = /** @class */ function() {
    function ECEventProcessor() {}
    ECEventProcessor.prototype.normalizeQuery = function(query) {
        var cptQuery = {};
        var dataQuery = {};
        var otherQuery = {};
        // `query` is `mainType` or `mainType.subType` of component.
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"](query)) {
            var condCptType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseClassType"])(query);
            // `.main` and `.sub` may be ''.
            cptQuery.mainType = condCptType.main || null;
            cptQuery.subType = condCptType.sub || null;
        } else {
            // `xxxIndex`, `xxxName`, `xxxId`, `name`, `dataIndex`, `dataType` is reserved,
            // can not be used in `compomentModel.filterForExposedEvent`.
            var suffixes_1 = [
                'Index',
                'Name',
                'Id'
            ];
            var dataKeys_1 = {
                name: 1,
                dataIndex: 1,
                dataType: 1
            };
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](query, function(val, key) {
                var reserved = false;
                for(var i = 0; i < suffixes_1.length; i++){
                    var propSuffix = suffixes_1[i];
                    var suffixPos = key.lastIndexOf(propSuffix);
                    if (suffixPos > 0 && suffixPos === key.length - propSuffix.length) {
                        var mainType = key.slice(0, suffixPos);
                        // Consider `dataIndex`.
                        if (mainType !== 'data') {
                            cptQuery.mainType = mainType;
                            cptQuery[propSuffix.toLowerCase()] = val;
                            reserved = true;
                        }
                    }
                }
                if (dataKeys_1.hasOwnProperty(key)) {
                    dataQuery[key] = val;
                    reserved = true;
                }
                if (!reserved) {
                    otherQuery[key] = val;
                }
            });
        }
        return {
            cptQuery: cptQuery,
            dataQuery: dataQuery,
            otherQuery: otherQuery
        };
    };
    ECEventProcessor.prototype.filter = function(eventType, query) {
        // They should be assigned before each trigger call.
        var eventInfo = this.eventInfo;
        if (!eventInfo) {
            return true;
        }
        var targetEl = eventInfo.targetEl;
        var packedEvent = eventInfo.packedEvent;
        var model = eventInfo.model;
        var view = eventInfo.view;
        // For event like 'globalout'.
        if (!model || !view) {
            return true;
        }
        var cptQuery = query.cptQuery;
        var dataQuery = query.dataQuery;
        return check(cptQuery, model, 'mainType') && check(cptQuery, model, 'subType') && check(cptQuery, model, 'index', 'componentIndex') && check(cptQuery, model, 'name') && check(cptQuery, model, 'id') && check(dataQuery, packedEvent, 'name') && check(dataQuery, packedEvent, 'dataIndex') && check(dataQuery, packedEvent, 'dataType') && (!view.filterForExposedEvent || view.filterForExposedEvent(eventType, query.otherQuery, targetEl, packedEvent));
        //TURBOPACK unreachable
        ;
        function check(query, host, prop, propOnHost) {
            return query[prop] == null || host[propOnHost || prop] === query[prop];
        }
    };
    ECEventProcessor.prototype.afterTrigger = function() {
        // Make sure the eventInfo won't be used in next trigger.
        this.eventInfo = null;
    };
    return ECEventProcessor;
}();
;
;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/clazz.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "enableClassCheck",
    ()=>enableClassCheck,
    "enableClassExtend",
    ()=>enableClassExtend,
    "enableClassManagement",
    ()=>enableClassManagement,
    "isExtendedClass",
    ()=>isExtendedClass,
    "mountExtend",
    ()=>mountExtend,
    "parseClassType",
    ()=>parseClassType
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
;
;
var TYPE_DELIMITER = '.';
var IS_CONTAINER = '___EC__COMPONENT__CONTAINER___';
var IS_EXTENDED_CLASS = '___EC__EXTENDED_CLASS___';
function parseClassType(componentType) {
    var ret = {
        main: '',
        sub: ''
    };
    if (componentType) {
        var typeArr = componentType.split(TYPE_DELIMITER);
        ret.main = typeArr[0] || '';
        ret.sub = typeArr[1] || '';
    }
    return ret;
}
/**
 * @public
 */ function checkClassType(componentType) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"](/^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)?$/.test(componentType), 'componentType "' + componentType + '" illegal');
}
function isExtendedClass(clz) {
    return !!(clz && clz[IS_EXTENDED_CLASS]);
}
function enableClassExtend(rootClz, mandatoryMethods) {
    rootClz.$constructor = rootClz; // FIXME: not necessary?
    rootClz.extend = function(proto) {
        if ("TURBOPACK compile-time truthy", 1) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](mandatoryMethods, function(method) {
                if (!proto[method]) {
                    console.warn('Method `' + method + '` should be implemented' + (proto.type ? ' in ' + proto.type : '') + '.');
                }
            });
        }
        var superClass = this;
        var ExtendedClass;
        if (isESClass(superClass)) {
            ExtendedClass = /** @class */ function(_super) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(class_1, _super);
                function class_1() {
                    return _super.apply(this, arguments) || this;
                }
                return class_1;
            }(superClass);
        } else {
            // For backward compat, we both support ts class inheritance and this
            // "extend" approach.
            // The constructor should keep the same behavior as ts class inheritance:
            // If this constructor/$constructor is not declared, auto invoke the super
            // constructor.
            // If this constructor/$constructor is declared, it is responsible for
            // calling the super constructor.
            ExtendedClass = function() {
                (proto.$constructor || superClass).apply(this, arguments);
            };
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inherits"](ExtendedClass, this);
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"](ExtendedClass.prototype, proto);
        ExtendedClass[IS_EXTENDED_CLASS] = true;
        ExtendedClass.extend = this.extend;
        ExtendedClass.superCall = superCall;
        ExtendedClass.superApply = superApply;
        ExtendedClass.superClass = superClass;
        return ExtendedClass;
    };
}
function isESClass(fn) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFunction"](fn) && /^class\s/.test(Function.prototype.toString.call(fn));
}
function mountExtend(SubClz, SupperClz) {
    SubClz.extend = SupperClz.extend;
}
// A random offset.
var classBase = Math.round(Math.random() * 10);
function enableClassCheck(target) {
    var classAttr = [
        '__\0is_clz',
        classBase++
    ].join('_');
    target.prototype[classAttr] = true;
    if ("TURBOPACK compile-time truthy", 1) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"](!target.isInstance, 'The method "is" can not be defined.');
    }
    target.isInstance = function(obj) {
        return !!(obj && obj[classAttr]);
    };
}
// superCall should have class info, which can not be fetched from 'this'.
// Consider this case:
// class A has method f,
// class B inherits class A, overrides method f, f call superApply('f'),
// class C inherits class B, does not override method f,
// then when method of class C is called, dead loop occurred.
function superCall(context, methodName) {
    var args = [];
    for(var _i = 2; _i < arguments.length; _i++){
        args[_i - 2] = arguments[_i];
    }
    return this.superClass.prototype[methodName].apply(context, args);
}
function superApply(context, methodName, args) {
    return this.superClass.prototype[methodName].apply(context, args);
}
function enableClassManagement(target) {
    /**
   * Component model classes
   * key: componentType,
   * value:
   *     componentClass, when componentType is 'a'
   *     or Object.<subKey, componentClass>, when componentType is 'a.b'
   */ var storage = {};
    target.registerClass = function(clz) {
        // `type` should not be a "instance member".
        // If using TS class, should better declared as `static type = 'series.pie'`.
        // otherwise users have to mount `type` on prototype manually.
        // For backward compat and enable instance visit type via `this.type`,
        // we still support fetch `type` from prototype.
        var componentFullType = clz.type || clz.prototype.type;
        if (componentFullType) {
            checkClassType(componentFullType);
            // If only static type declared, we assign it to prototype mandatorily.
            clz.prototype.type = componentFullType;
            var componentTypeInfo = parseClassType(componentFullType);
            if (!componentTypeInfo.sub) {
                if ("TURBOPACK compile-time truthy", 1) {
                    if (storage[componentTypeInfo.main]) {
                        console.warn(componentTypeInfo.main + ' exists.');
                    }
                }
                storage[componentTypeInfo.main] = clz;
            } else if (componentTypeInfo.sub !== IS_CONTAINER) {
                var container = makeContainer(componentTypeInfo);
                container[componentTypeInfo.sub] = clz;
            }
        }
        return clz;
    };
    target.getClass = function(mainType, subType, throwWhenNotFound) {
        var clz = storage[mainType];
        if (clz && clz[IS_CONTAINER]) {
            clz = subType ? clz[subType] : null;
        }
        if (throwWhenNotFound && !clz) {
            throw new Error(!subType ? mainType + '.' + 'type should be specified.' : 'Component ' + mainType + '.' + (subType || '') + ' is used but not imported.');
        }
        return clz;
    };
    target.getClassesByMainType = function(componentType) {
        var componentTypeInfo = parseClassType(componentType);
        var result = [];
        var obj = storage[componentTypeInfo.main];
        if (obj && obj[IS_CONTAINER]) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](obj, function(o, type) {
                type !== IS_CONTAINER && result.push(o);
            });
        } else {
            result.push(obj);
        }
        return result;
    };
    target.hasClass = function(componentType) {
        // Just consider componentType.main.
        var componentTypeInfo = parseClassType(componentType);
        return !!storage[componentTypeInfo.main];
    };
    /**
   * @return Like ['aa', 'bb'], but can not be ['aa.xx']
   */ target.getAllClassMainTypes = function() {
        var types = [];
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](storage, function(obj, type) {
            types.push(type);
        });
        return types;
    };
    /**
   * If a main type is container and has sub types
   */ target.hasSubTypes = function(componentType) {
        var componentTypeInfo = parseClassType(componentType);
        var obj = storage[componentTypeInfo.main];
        return obj && obj[IS_CONTAINER];
    };
    function makeContainer(componentTypeInfo) {
        var container = storage[componentTypeInfo.main];
        if (!container || !container[IS_CONTAINER]) {
            container = storage[componentTypeInfo.main] = {};
            container[IS_CONTAINER] = true;
        }
        return container;
    }
} // /**
 //  * @param {string|Array.<string>} properties
 //  */
 // export function setReadOnly(obj, properties) {
 // FIXME It seems broken in IE8 simulation of IE11
 // if (!zrUtil.isArray(properties)) {
 //     properties = properties != null ? [properties] : [];
 // }
 // zrUtil.each(properties, function (prop) {
 //     let value = obj[prop];
 //     Object.defineProperty
 //         && Object.defineProperty(obj, prop, {
 //             value: value, writable: false
 //         });
 //     zrUtil.isArray(obj[prop])
 //         && Object.freeze
 //         && Object.freeze(obj[prop]);
 // });
 // }
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/component.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "enableSubTypeDefaulter",
    ()=>enableSubTypeDefaulter,
    "enableTopologicalTravel",
    ()=>enableTopologicalTravel,
    "getUID",
    ()=>getUID,
    "inheritDefaultOption",
    ()=>inheritDefaultOption
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/clazz.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-client] (ecmascript)");
;
;
;
// A random offset
var base = Math.round(Math.random() * 10);
function getUID(type) {
    // Considering the case of crossing js context,
    // use Math.random to make id as unique as possible.
    return [
        type || '',
        base++
    ].join('_');
}
function enableSubTypeDefaulter(target) {
    var subTypeDefaulters = {};
    target.registerSubTypeDefaulter = function(componentType, defaulter) {
        var componentTypeInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseClassType"])(componentType);
        subTypeDefaulters[componentTypeInfo.main] = defaulter;
    };
    target.determineSubType = function(componentType, option) {
        var type = option.type;
        if (!type) {
            var componentTypeMain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseClassType"])(componentType).main;
            if (target.hasSubTypes(componentType) && subTypeDefaulters[componentTypeMain]) {
                type = subTypeDefaulters[componentTypeMain](option);
            }
        }
        return type;
    };
}
function enableTopologicalTravel(entity, dependencyGetter) {
    /**
   * @param targetNameList Target Component type list.
   *                       Can be ['aa', 'bb', 'aa.xx']
   * @param fullNameList By which we can build dependency graph.
   * @param callback Params: componentType, dependencies.
   * @param context Scope of callback.
   */ entity.topologicalTravel = function(targetNameList, fullNameList, callback, context) {
        if (!targetNameList.length) {
            return;
        }
        var result = makeDepndencyGraph(fullNameList);
        var graph = result.graph;
        var noEntryList = result.noEntryList;
        var targetNameSet = {};
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](targetNameList, function(name) {
            targetNameSet[name] = true;
        });
        while(noEntryList.length){
            var currComponentType = noEntryList.pop();
            var currVertex = graph[currComponentType];
            var isInTargetNameSet = !!targetNameSet[currComponentType];
            if (isInTargetNameSet) {
                callback.call(context, currComponentType, currVertex.originalDeps.slice());
                delete targetNameSet[currComponentType];
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](currVertex.successor, isInTargetNameSet ? removeEdgeAndAdd : removeEdge);
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](targetNameSet, function() {
            var errMsg = '';
            if ("TURBOPACK compile-time truthy", 1) {
                errMsg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makePrintable"])('Circular dependency may exists: ', targetNameSet, targetNameList, fullNameList);
            }
            throw new Error(errMsg);
        });
        function removeEdge(succComponentType) {
            graph[succComponentType].entryCount--;
            if (graph[succComponentType].entryCount === 0) {
                noEntryList.push(succComponentType);
            }
        }
        // Consider this case: legend depends on series, and we call
        // chart.setOption({series: [...]}), where only series is in option.
        // If we do not have 'removeEdgeAndAdd', legendModel.mergeOption will
        // not be called, but only sereis.mergeOption is called. Thus legend
        // have no chance to update its local record about series (like which
        // name of series is available in legend).
        function removeEdgeAndAdd(succComponentType) {
            targetNameSet[succComponentType] = true;
            removeEdge(succComponentType);
        }
    };
    function makeDepndencyGraph(fullNameList) {
        var graph = {};
        var noEntryList = [];
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](fullNameList, function(name) {
            var thisItem = createDependencyGraphItem(graph, name);
            var originalDeps = thisItem.originalDeps = dependencyGetter(name);
            var availableDeps = getAvailableDependencies(originalDeps, fullNameList);
            thisItem.entryCount = availableDeps.length;
            if (thisItem.entryCount === 0) {
                noEntryList.push(name);
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](availableDeps, function(dependentName) {
                if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indexOf"](thisItem.predecessor, dependentName) < 0) {
                    thisItem.predecessor.push(dependentName);
                }
                var thatItem = createDependencyGraphItem(graph, dependentName);
                if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indexOf"](thatItem.successor, dependentName) < 0) {
                    thatItem.successor.push(name);
                }
            });
        });
        return {
            graph: graph,
            noEntryList: noEntryList
        };
    }
    function createDependencyGraphItem(graph, name) {
        if (!graph[name]) {
            graph[name] = {
                predecessor: [],
                successor: []
            };
        }
        return graph[name];
    }
    function getAvailableDependencies(originalDeps, fullNameList) {
        var availableDeps = [];
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](originalDeps, function(dep) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indexOf"](fullNameList, dep) >= 0 && availableDeps.push(dep);
        });
        return availableDeps;
    }
}
function inheritDefaultOption(superOption, subOption) {
    // See also `model/Component.ts#getDefaultOption`
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["merge"]({}, superOption, true), subOption, true);
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/cycleCache.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCachePerECFullUpdate",
    ()=>getCachePerECFullUpdate,
    "getCachePerECPrepare",
    ()=>getCachePerECPrepare,
    "resetCachePerECFullUpdate",
    ()=>resetCachePerECFullUpdate,
    "resetCachePerECPrepare",
    ()=>resetCachePerECPrepare
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
var ecModelCacheInner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeInner"])();
function resetCachePerECPrepare(ecModel) {
    ecModelCacheInner(ecModel).prepare = {};
}
function resetCachePerECFullUpdate(ecModel) {
    ecModelCacheInner(ecModel).fullUpdate = {};
}
function getCachePerECPrepare(ecModel) {
    return ecModelCacheInner(ecModel).prepare;
}
function getCachePerECFullUpdate(ecModel) {
    return ecModelCacheInner(ecModel).fullUpdate;
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/decal.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createOrUpdatePatternFromDecal",
    ()=>createOrUpdatePatternFromDecal
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$WeakMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/WeakMap.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$LRU$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/LRU.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/symbol.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$canvas$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/canvas/graphic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$platform$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/platform.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
var decalMap = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$WeakMap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]();
var decalCache = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$LRU$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](100);
var decalKeys = [
    'symbol',
    'symbolSize',
    'symbolKeepAspect',
    'color',
    'backgroundColor',
    'dashArrayX',
    'dashArrayY',
    'maxTileWidth',
    'maxTileHeight'
];
function createOrUpdatePatternFromDecal(decalObject, api) {
    if (decalObject === 'none') {
        return null;
    }
    var dpr = api.getDevicePixelRatio();
    var zr = api.getZr();
    var isSVG = zr.painter.type === 'svg';
    if (decalObject.dirty) {
        decalMap["delete"](decalObject);
    }
    var oldPattern = decalMap.get(decalObject);
    if (oldPattern) {
        return oldPattern;
    }
    var decalOpt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaults"])(decalObject, {
        symbol: 'rect',
        symbolSize: 1,
        symbolKeepAspect: true,
        color: 'rgba(0, 0, 0, 0.2)',
        backgroundColor: null,
        dashArrayX: 5,
        dashArrayY: 5,
        rotation: 0,
        maxTileWidth: 512,
        maxTileHeight: 512
    });
    if (decalOpt.backgroundColor === 'none') {
        decalOpt.backgroundColor = null;
    }
    var pattern = {
        repeat: 'repeat'
    };
    setPatternnSource(pattern);
    pattern.rotation = decalOpt.rotation;
    pattern.scaleX = pattern.scaleY = isSVG ? 1 : 1 / dpr;
    decalMap.set(decalObject, pattern);
    decalObject.dirty = false;
    return pattern;
    //TURBOPACK unreachable
    ;
    function setPatternnSource(pattern) {
        var keys = [
            dpr
        ];
        var isValidKey = true;
        for(var i = 0; i < decalKeys.length; ++i){
            var value = decalOpt[decalKeys[i]];
            if (value != null && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(value) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"])(value) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(value) && typeof value !== 'boolean') {
                isValidKey = false;
                break;
            }
            keys.push(value);
        }
        var cacheKey;
        if (isValidKey) {
            cacheKey = keys.join(',') + (isSVG ? '-svg' : '');
            var cache = decalCache.get(cacheKey);
            if (cache) {
                isSVG ? pattern.svgElement = cache : pattern.image = cache;
            }
        }
        var dashArrayX = normalizeDashArrayX(decalOpt.dashArrayX);
        var dashArrayY = normalizeDashArrayY(decalOpt.dashArrayY);
        var symbolArray = normalizeSymbolArray(decalOpt.symbol);
        var lineBlockLengthsX = getLineBlockLengthX(dashArrayX);
        var lineBlockLengthY = getLineBlockLengthY(dashArrayY);
        var canvas = !isSVG && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$platform$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["platformApi"].createCanvas();
        var svgRoot = isSVG && {
            tag: 'g',
            attrs: {},
            key: 'dcl',
            children: []
        };
        var pSize = getPatternSize();
        var ctx;
        if (canvas) {
            canvas.width = pSize.width * dpr;
            canvas.height = pSize.height * dpr;
            ctx = canvas.getContext('2d');
        }
        brushDecal();
        if (isValidKey) {
            decalCache.put(cacheKey, canvas || svgRoot);
        }
        pattern.image = canvas;
        pattern.svgElement = svgRoot;
        pattern.svgWidth = pSize.width;
        pattern.svgHeight = pSize.height;
        /**
     * Get minimum length that can make a repeatable pattern.
     *
     * @return {Object} pattern width and height
     */ function getPatternSize() {
            /**
       * For example, if dash is [[3, 2], [2, 1]] for X, it looks like
       * |---  ---  ---  ---  --- ...
       * |-- -- -- -- -- -- -- -- ...
       * |---  ---  ---  ---  --- ...
       * |-- -- -- -- -- -- -- -- ...
       * So the minimum length of X is 15,
       * which is the least common multiple of `3 + 2` and `2 + 1`
       * |---  ---  ---  |---  --- ...
       * |-- -- -- -- -- |-- -- -- ...
       */ var width = 1;
            for(var i = 0, xlen = lineBlockLengthsX.length; i < xlen; ++i){
                width = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLeastCommonMultiple"])(width, lineBlockLengthsX[i]);
            }
            var symbolRepeats = 1;
            for(var i = 0, xlen = symbolArray.length; i < xlen; ++i){
                symbolRepeats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLeastCommonMultiple"])(symbolRepeats, symbolArray[i].length);
            }
            width *= symbolRepeats;
            var height = lineBlockLengthY * lineBlockLengthsX.length * symbolArray.length;
            if ("TURBOPACK compile-time truthy", 1) {
                var warn = function(attrName) {
                    /* eslint-disable-next-line */ console.warn("Calculated decal size is greater than " + attrName + " due to decal option settings so " + attrName + " is used for the decal size. Please consider changing the decal option to make a smaller decal or set " + attrName + " to be larger to avoid incontinuity.");
                };
                if (width > decalOpt.maxTileWidth) {
                    warn('maxTileWidth');
                }
                if (height > decalOpt.maxTileHeight) {
                    warn('maxTileHeight');
                }
            }
            return {
                width: Math.max(1, Math.min(width, decalOpt.maxTileWidth)),
                height: Math.max(1, Math.min(height, decalOpt.maxTileHeight))
            };
        }
        function brushDecal() {
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (decalOpt.backgroundColor) {
                    ctx.fillStyle = decalOpt.backgroundColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
            }
            var ySum = 0;
            for(var i = 0; i < dashArrayY.length; ++i){
                ySum += dashArrayY[i];
            }
            if (ySum <= 0) {
                // dashArrayY is 0, draw nothing
                return;
            }
            var y = -lineBlockLengthY;
            var yId = 0;
            var yIdTotal = 0;
            var xId0 = 0;
            while(y < pSize.height){
                if (yId % 2 === 0) {
                    var symbolYId = yIdTotal / 2 % symbolArray.length;
                    var x = 0;
                    var xId1 = 0;
                    var xId1Total = 0;
                    while(x < pSize.width * 2){
                        var xSum = 0;
                        for(var i = 0; i < dashArrayX[xId0].length; ++i){
                            xSum += dashArrayX[xId0][i];
                        }
                        if (xSum <= 0) {
                            break;
                        }
                        // E.g., [15, 5, 20, 5] draws only for 15 and 20
                        if (xId1 % 2 === 0) {
                            var size = (1 - decalOpt.symbolSize) * 0.5;
                            var left = x + dashArrayX[xId0][xId1] * size;
                            var top_1 = y + dashArrayY[yId] * size;
                            var width = dashArrayX[xId0][xId1] * decalOpt.symbolSize;
                            var height = dashArrayY[yId] * decalOpt.symbolSize;
                            var symbolXId = xId1Total / 2 % symbolArray[symbolYId].length;
                            brushSymbol(left, top_1, width, height, symbolArray[symbolYId][symbolXId]);
                        }
                        x += dashArrayX[xId0][xId1];
                        ++xId1Total;
                        ++xId1;
                        if (xId1 === dashArrayX[xId0].length) {
                            xId1 = 0;
                        }
                    }
                    ++xId0;
                    if (xId0 === dashArrayX.length) {
                        xId0 = 0;
                    }
                }
                y += dashArrayY[yId];
                ++yIdTotal;
                ++yId;
                if (yId === dashArrayY.length) {
                    yId = 0;
                }
            }
            function brushSymbol(x, y, width, height, symbolType) {
                var scale = isSVG ? 1 : dpr;
                var symbol = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$symbol$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSymbol"])(symbolType, x * scale, y * scale, width * scale, height * scale, decalOpt.color, decalOpt.symbolKeepAspect);
                if (isSVG) {
                    var symbolVNode = zr.painter.renderOneToVNode(symbol);
                    if (symbolVNode) {
                        svgRoot.children.push(symbolVNode);
                    }
                } else {
                    // Paint to canvas for all other renderers.
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$canvas$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["brushSingle"])(ctx, symbol);
                }
            }
        }
    }
}
/**
 * Convert symbol array into normalized array
 *
 * @param {string | (string | string[])[]} symbol symbol input
 * @return {string[][]} normolized symbol array
 */ function normalizeSymbolArray(symbol) {
    if (!symbol || symbol.length === 0) {
        return [
            [
                'rect'
            ]
        ];
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"])(symbol)) {
        return [
            [
                symbol
            ]
        ];
    }
    var isAllString = true;
    for(var i = 0; i < symbol.length; ++i){
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"])(symbol[i])) {
            isAllString = false;
            break;
        }
    }
    if (isAllString) {
        return normalizeSymbolArray([
            symbol
        ]);
    }
    var result = [];
    for(var i = 0; i < symbol.length; ++i){
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"])(symbol[i])) {
            result.push([
                symbol[i]
            ]);
        } else {
            result.push(symbol[i]);
        }
    }
    return result;
}
/**
 * Convert dash input into dashArray
 *
 * @param {DecalDashArrayX} dash dash input
 * @return {number[][]} normolized dash array
 */ function normalizeDashArrayX(dash) {
    if (!dash || dash.length === 0) {
        return [
            [
                0,
                0
            ]
        ];
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(dash)) {
        var dashValue = Math.ceil(dash);
        return [
            [
                dashValue,
                dashValue
            ]
        ];
    }
    /**
   * [20, 5] should be normalized into [[20, 5]],
   * while [20, [5, 10]] should be normalized into [[20, 20], [5, 10]]
   */ var isAllNumber = true;
    for(var i = 0; i < dash.length; ++i){
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(dash[i])) {
            isAllNumber = false;
            break;
        }
    }
    if (isAllNumber) {
        return normalizeDashArrayX([
            dash
        ]);
    }
    var result = [];
    for(var i = 0; i < dash.length; ++i){
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(dash[i])) {
            var dashValue = Math.ceil(dash[i]);
            result.push([
                dashValue,
                dashValue
            ]);
        } else {
            var dashValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(dash[i], function(n) {
                return Math.ceil(n);
            });
            if (dashValue.length % 2 === 1) {
                // [4, 2, 1] means |----  -    -- |----  -    -- |
                // so normalize it to be [4, 2, 1, 4, 2, 1]
                result.push(dashValue.concat(dashValue));
            } else {
                result.push(dashValue);
            }
        }
    }
    return result;
}
/**
 * Convert dash input into dashArray
 *
 * @param {DecalDashArrayY} dash dash input
 * @return {number[]} normolized dash array
 */ function normalizeDashArrayY(dash) {
    if (!dash || typeof dash === 'object' && dash.length === 0) {
        return [
            0,
            0
        ];
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(dash)) {
        var dashValue_1 = Math.ceil(dash);
        return [
            dashValue_1,
            dashValue_1
        ];
    }
    var dashValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(dash, function(n) {
        return Math.ceil(n);
    });
    return dash.length % 2 ? dashValue.concat(dashValue) : dashValue;
}
/**
 * Get block length of each line. A block is the length of dash line and space.
 * For example, a line with [4, 1] has a dash line of 4 and a space of 1 after
 * that, so the block length of this line is 5.
 *
 * @param {number[][]} dash dash array of X or Y
 * @return {number[]} block length of each line
 */ function getLineBlockLengthX(dash) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(dash, function(line) {
        return getLineBlockLengthY(line);
    });
}
function getLineBlockLengthY(dash) {
    var blockLength = 0;
    for(var i = 0; i < dash.length; ++i){
        blockLength += dash[i];
    }
    if (dash.length % 2 === 1) {
        // [4, 2, 1] means |----  -    -- |----  -    -- |
        // So total length is (4 + 2 + 1) * 2
        return blockLength * 2;
    }
    return blockLength;
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/event.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    "findEventDispatcher",
    ()=>findEventDispatcher
]);
function findEventDispatcher(target, det, returnFirstMatch) {
    var found;
    while(target){
        if (det(target)) {
            found = target;
            if (returnFirstMatch) {
                break;
            }
        }
        target = target.__hostTarget || target.parent;
    }
    return found;
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/format.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addCommas",
    ()=>addCommas,
    "capitalFirst",
    ()=>capitalFirst,
    "convertToColorString",
    ()=>convertToColorString,
    "formatTime",
    ()=>formatTime,
    "formatTpl",
    ()=>formatTpl,
    "formatTplSimple",
    ()=>formatTplSimple,
    "getTooltipMarker",
    ()=>getTooltipMarker,
    "makeValueReadable",
    ()=>makeValueReadable,
    "normalizeCssArray",
    ()=>normalizeCssArray,
    "toCamelCase",
    ()=>toCamelCase,
    "windowOpen",
    ()=>windowOpen
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$dom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/dom.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/time.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-client] (ecmascript)");
;
;
;
;
;
function addCommas(x) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumeric"])(x)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"](x) ? x : '-';
    }
    var parts = (x + '').split('.');
    return parts[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') + (parts.length > 1 ? '.' + parts[1] : '');
}
function toCamelCase(str, upperCaseFirst) {
    str = (str || '').toLowerCase().replace(/-(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
    if (upperCaseFirst && str) {
        str = str.charAt(0).toUpperCase() + str.slice(1);
    }
    return str;
}
var normalizeCssArray = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeCssArray"];
;
function makeValueReadable(value, valueType, useUTC) {
    var USER_READABLE_DEFUALT_TIME_PATTERN = '{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}';
    function stringToUserReadable(str) {
        return str && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trim"](str) ? str : '-';
    }
    function isNumberUserReadable(num) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNullableNumberFinite"])(num);
    }
    var isTypeTime = valueType === 'time';
    var isValueDate = value instanceof Date;
    if (isTypeTime || isValueDate) {
        var date = isTypeTime ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseDate"])(value) : value;
        if (!isNaN(+date)) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["format"])(date, USER_READABLE_DEFUALT_TIME_PATTERN, useUTC);
        } else if (isValueDate) {
            return '-';
        }
    // In other cases, continue to try to display the value in the following code.
    }
    if (valueType === 'ordinal') {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStringSafe"](value) ? stringToUserReadable(value) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"](value) ? isNumberUserReadable(value) ? value + '' : '-' : '-';
    }
    // By default.
    var numericResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numericToNumber"])(value);
    return isNumberUserReadable(numericResult) ? addCommas(numericResult) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStringSafe"](value) ? stringToUserReadable(value) : typeof value === 'boolean' ? value + '' : '-';
}
var TPL_VAR_ALIAS = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g'
];
var wrapVar = function(varName, seriesIdx) {
    return '{' + varName + (seriesIdx == null ? '' : seriesIdx) + '}';
};
function formatTpl(tpl, paramsList, encode) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"](paramsList)) {
        paramsList = [
            paramsList
        ];
    }
    var seriesLen = paramsList.length;
    if (!seriesLen) {
        return '';
    }
    var $vars = paramsList[0].$vars || [];
    for(var i = 0; i < $vars.length; i++){
        var alias = TPL_VAR_ALIAS[i];
        tpl = tpl.replace(wrapVar(alias), wrapVar(alias, 0));
    }
    for(var seriesIdx = 0; seriesIdx < seriesLen; seriesIdx++){
        for(var k = 0; k < $vars.length; k++){
            var val = paramsList[seriesIdx][$vars[k]];
            tpl = tpl.replace(wrapVar(TPL_VAR_ALIAS[k], seriesIdx), encode ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$dom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeHTML"])(val) : val);
        }
    }
    return tpl;
}
function formatTplSimple(tpl, param, encode) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](param, function(value, key) {
        tpl = tpl.replace('{' + key + '}', encode ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$dom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeHTML"])(value) : value);
    });
    return tpl;
}
function getTooltipMarker(inOpt, extraCssText) {
    var opt = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"](inOpt) ? {
        color: inOpt,
        extraCssText: extraCssText
    } : inOpt || {};
    var color = opt.color;
    var type = opt.type;
    extraCssText = opt.extraCssText;
    var renderMode = opt.renderMode || 'html';
    if (!color) {
        return '';
    }
    if (renderMode === 'html') {
        return type === 'subItem' ? '<span style="display:inline-block;vertical-align:middle;margin-right:8px;margin-left:3px;' + 'border-radius:4px;width:4px;height:4px;background-color:' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$dom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeHTML"])(color) + ';' + (extraCssText || '') + '"></span>' : '<span style="display:inline-block;margin-right:4px;' + 'border-radius:10px;width:10px;height:10px;background-color:' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$dom$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeHTML"])(color) + ';' + (extraCssText || '') + '"></span>';
    } else {
        // Should better not to auto generate style name by auto-increment number here.
        // Because this util is usually called in tooltip formatter, which is probably
        // called repeatedly when mouse move and the auto-increment number increases fast.
        // Users can make their own style name by theirselves, make it unique and readable.
        var markerId = opt.markerId || 'markerX';
        return {
            renderMode: renderMode,
            content: '{' + markerId + '|}  ',
            style: type === 'subItem' ? {
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: color
            } : {
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: color
            }
        };
    }
}
function formatTime(tpl, value, isUTC) {
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deprecateReplaceLog"])('echarts.format.formatTime', 'echarts.time.format');
    }
    if (tpl === 'week' || tpl === 'month' || tpl === 'quarter' || tpl === 'half-year' || tpl === 'year') {
        tpl = 'MM-dd\nyyyy';
    }
    var date = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseDate"])(value);
    var getUTC = isUTC ? 'getUTC' : 'get';
    var y = date[getUTC + 'FullYear']();
    var M = date[getUTC + 'Month']() + 1;
    var d = date[getUTC + 'Date']();
    var h = date[getUTC + 'Hours']();
    var m = date[getUTC + 'Minutes']();
    var s = date[getUTC + 'Seconds']();
    var S = date[getUTC + 'Milliseconds']();
    tpl = tpl.replace('MM', (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pad"])(M, 2)).replace('M', M).replace('yyyy', y).replace('yy', (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pad"])(y % 100 + '', 2)).replace('dd', (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pad"])(d, 2)).replace('d', d).replace('hh', (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pad"])(h, 2)).replace('h', h).replace('mm', (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pad"])(m, 2)).replace('m', m).replace('ss', (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pad"])(s, 2)).replace('s', s).replace('SSS', (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$time$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pad"])(S, 3));
    return tpl;
}
function capitalFirst(str) {
    return str ? str.charAt(0).toUpperCase() + str.substr(1) : str;
}
function convertToColorString(color, defaultColor) {
    defaultColor = defaultColor || 'transparent';
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"](color) ? color : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObject"](color) ? color.colorStops && (color.colorStops[0] || {}).color || defaultColor : defaultColor;
}
;
function windowOpen(link, target) {
    /* global window */ if (target === '_blank' || target === 'blank') {
        var blank = window.open();
        blank.opener = null;
        blank.location.href = link;
    } else {
        window.open(link, target);
    }
}
;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/graphic.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Arc",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Arc$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "BezierCurve",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$BezierCurve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "BoundingRect",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "Circle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "CompoundPath",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$CompoundPath$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "Ellipse",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Ellipse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "Group",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "HOVER_LAYER_FOR_INCREMENTAL",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["HOVER_LAYER_FOR_INCREMENTAL"],
    "HOVER_LAYER_FROM_THRESHOLD",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["HOVER_LAYER_FROM_THRESHOLD"],
    "HOVER_LAYER_NO",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["HOVER_LAYER_NO"],
    "Image",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "IncrementalDisplayable",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$IncrementalDisplayable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "Line",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "LinearGradient",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$LinearGradient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "OrientedBoundingRect",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$OrientedBoundingRect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "Path",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "Point",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "Polygon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Polygon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "Polyline",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Polyline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "RadialGradient",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$RadialGradient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "Rect",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "Ring",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Ring$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "Sector",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Sector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "Text",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    "WH",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WH"],
    "XY",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["XY"],
    "applyTransform",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["applyTransform"],
    "calcZ2Range",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["calcZ2Range"],
    "clipPointsByRect",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["clipPointsByRect"],
    "clipRectByRect",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["clipRectByRect"],
    "createIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createIcon"],
    "decomposeTransform",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["decomposeTransform"],
    "ensureCopyRect",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ensureCopyRect"],
    "ensureCopyTransform",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ensureCopyTransform"],
    "expandOrShrinkRect",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["expandOrShrinkRect"],
    "extendPath",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["extendPath"],
    "extendShape",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["extendShape"],
    "getCurrentCanvasPainter",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getCurrentCanvasPainter"],
    "getShapeClass",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getShapeClass"],
    "getTransform",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getTransform"],
    "groupTransition",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["groupTransition"],
    "initProps",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initProps"],
    "isBoundingRectAxisAligned",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["isBoundingRectAxisAligned"],
    "isElementRemoved",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isElementRemoved"],
    "lineLineIntersect",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["lineLineIntersect"],
    "linePolygonIntersect",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["linePolygonIntersect"],
    "makeImage",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["makeImage"],
    "makePath",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["makePath"],
    "mergePath",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["mergePath"],
    "payloadDisableAnimation",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["payloadDisableAnimation"],
    "registerShape",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["registerShape"],
    "removeElement",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeElement"],
    "removeElementWithFadeOut",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeElementWithFadeOut"],
    "resizePath",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["resizePath"],
    "retrieveZInfo",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["retrieveZInfo"],
    "setTooltipConfig",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["setTooltipConfig"],
    "subPixelOptimize",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["subPixelOptimize"],
    "subPixelOptimizeLine",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["subPixelOptimizeLine"],
    "subPixelOptimizeRect",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["subPixelOptimizeRect"],
    "transformDirection",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["transformDirection"],
    "traverseElements",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["traverseElements"],
    "traverseUpdateZ",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["traverseUpdateZ"],
    "updateProps",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProps"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/graphic.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Path.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Group.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Text.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Circle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Ellipse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Ellipse.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Sector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Sector.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Ring$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Ring.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Polygon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Polygon.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Polyline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Polyline.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Rect.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Line.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$BezierCurve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/BezierCurve.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Arc$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Arc.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$CompoundPath$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/CompoundPath.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$LinearGradient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/LinearGradient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$RadialGradient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/RadialGradient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/BoundingRect.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$OrientedBoundingRect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/OrientedBoundingRect.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/Point.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$IncrementalDisplayable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/IncrementalDisplayable.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/animation/basicTransition.js [app-client] (ecmascript)");
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/graphic.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HOVER_LAYER_FOR_INCREMENTAL",
    ()=>HOVER_LAYER_FOR_INCREMENTAL,
    "HOVER_LAYER_FROM_THRESHOLD",
    ()=>HOVER_LAYER_FROM_THRESHOLD,
    "HOVER_LAYER_NO",
    ()=>HOVER_LAYER_NO,
    "WH",
    ()=>WH,
    "XY",
    ()=>XY,
    "applyTransform",
    ()=>applyTransform,
    "calcZ2Range",
    ()=>calcZ2Range,
    "clipPointsByRect",
    ()=>clipPointsByRect,
    "clipRectByRect",
    ()=>clipRectByRect,
    "createIcon",
    ()=>createIcon,
    "decomposeTransform",
    ()=>decomposeTransform,
    "ensureCopyRect",
    ()=>ensureCopyRect,
    "ensureCopyTransform",
    ()=>ensureCopyTransform,
    "expandOrShrinkRect",
    ()=>expandOrShrinkRect,
    "extendPath",
    ()=>extendPath,
    "extendShape",
    ()=>extendShape,
    "getCurrentCanvasPainter",
    ()=>getCurrentCanvasPainter,
    "getShapeClass",
    ()=>getShapeClass,
    "getTransform",
    ()=>getTransform,
    "groupTransition",
    ()=>groupTransition,
    "isBoundingRectAxisAligned",
    ()=>isBoundingRectAxisAligned,
    "lineLineIntersect",
    ()=>lineLineIntersect,
    "linePolygonIntersect",
    ()=>linePolygonIntersect,
    "makeImage",
    ()=>makeImage,
    "makePath",
    ()=>makePath,
    "mergePath",
    ()=>mergePath,
    "payloadDisableAnimation",
    ()=>payloadDisableAnimation,
    "registerShape",
    ()=>registerShape,
    "resizePath",
    ()=>resizePath,
    "retrieveZInfo",
    ()=>retrieveZInfo,
    "setTooltipConfig",
    ()=>setTooltipConfig,
    "subPixelOptimize",
    ()=>subPixelOptimize,
    "subPixelOptimizeLine",
    ()=>subPixelOptimizeLine,
    "subPixelOptimizeRect",
    ()=>subPixelOptimizeRect,
    "transformDirection",
    ()=>transformDirection,
    "traverseElements",
    ()=>traverseElements,
    "traverseUpdateZ",
    ()=>traverseUpdateZ
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/tool/path.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/matrix.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/vector.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Path.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/Transformable.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Group.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Text.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Circle.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Ellipse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Ellipse.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Sector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Sector.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Ring$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Ring.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Polygon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Polygon.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Polyline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Polyline.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Rect.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Line.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$BezierCurve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/BezierCurve.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Arc$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Arc.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$CompoundPath$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/CompoundPath.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$LinearGradient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/LinearGradient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$RadialGradient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/RadialGradient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/BoundingRect.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$OrientedBoundingRect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/OrientedBoundingRect.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/Point.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$IncrementalDisplayable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/IncrementalDisplayable.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$helper$2f$subPixelOptimize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/helper/subPixelOptimize.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/innerStore.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/animation/basicTransition.js [app-client] (ecmascript)");
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
var _customShapeMap = {};
var XY = [
    'x',
    'y'
];
var WH = [
    'width',
    'height'
];
var HOVER_LAYER_NO = 0;
var HOVER_LAYER_FROM_THRESHOLD = 1;
var HOVER_LAYER_FOR_INCREMENTAL = 2;
function extendShape(opts) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].extend(opts);
}
var extendPathFromString = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extendFromString"];
function extendPath(pathData, opts) {
    return extendPathFromString(pathData, opts);
}
function registerShape(name, ShapeClass) {
    _customShapeMap[name] = ShapeClass;
}
function getShapeClass(name) {
    if (_customShapeMap.hasOwnProperty(name)) {
        return _customShapeMap[name];
    }
}
function makePath(pathData, opts, rect, layout) {
    var path = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFromString"](pathData, opts);
    if (rect) {
        if (layout === 'center') {
            rect = centerGraphic(rect, path.getBoundingRect());
        }
        resizePath(path, rect);
    }
    return path;
}
function makeImage(imageUrl, rect, layout) {
    var zrImg = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]({
        style: {
            image: imageUrl,
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height
        },
        onload: function(img) {
            if (layout === 'center') {
                var boundingRect = {
                    width: img.width,
                    height: img.height
                };
                zrImg.setStyle(centerGraphic(rect, boundingRect));
            }
        }
    });
    return zrImg;
}
/**
 * Get position of centered element in bounding box.
 *
 * @param  rect         element local bounding box
 * @param  boundingRect constraint bounding box
 * @return element position containing x, y, width, and height
 */ function centerGraphic(rect, boundingRect) {
    // Set rect to center, keep width / height ratio.
    var aspect = boundingRect.width / boundingRect.height;
    var width = rect.height * aspect;
    var height;
    if (width <= rect.width) {
        height = rect.height;
    } else {
        width = rect.width;
        height = width / aspect;
    }
    var cx = rect.x + rect.width / 2;
    var cy = rect.y + rect.height / 2;
    return {
        x: cx - width / 2,
        y: cy - height / 2,
        width: width,
        height: height
    };
}
var mergePath = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergePath"];
function resizePath(path, rect) {
    if (!path.applyTransform) {
        return;
    }
    var pathRect = path.getBoundingRect();
    var m = pathRect.calculateTransform(rect);
    path.applyTransform(m);
}
function subPixelOptimizeLine(shape, lineWidth) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$helper$2f$subPixelOptimize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subPixelOptimizeLine"](shape, shape, {
        lineWidth: lineWidth
    });
    return shape;
}
function subPixelOptimizeRect(shape, style) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$helper$2f$subPixelOptimize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subPixelOptimizeRect"](shape, shape, style);
    return shape;
}
var subPixelOptimize = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$helper$2f$subPixelOptimize$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subPixelOptimize"];
function getTransform(target, ancestor) {
    var mat = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["identity"]([]);
    while(target && target !== ancestor){
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mul"](mat, target.getLocalTransform(), mat);
        target = target.parent;
    }
    return mat;
}
function applyTransform(target, transform, invert) {
    if (transform && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArrayLike"])(transform)) {
        transform = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getLocalTransform(transform);
    }
    if (invert) {
        transform = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["invert"]([], transform);
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyTransform"]([], target, transform);
}
function transformDirection(direction, transform, invert) {
    // Pick a base, ensure that transform result will not be (0, 0).
    var hBase = transform[4] === 0 || transform[5] === 0 || transform[0] === 0 ? 1 : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathAbs"])(2 * transform[4] / transform[0]);
    var vBase = transform[4] === 0 || transform[5] === 0 || transform[2] === 0 ? 1 : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathAbs"])(2 * transform[4] / transform[2]);
    var vertex = [
        direction === 'left' ? -hBase : direction === 'right' ? hBase : 0,
        direction === 'top' ? -vBase : direction === 'bottom' ? vBase : 0
    ];
    vertex = applyTransform(vertex, transform, invert);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathAbs"])(vertex[0]) > (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathAbs"])(vertex[1]) ? vertex[0] > 0 ? 'right' : 'left' : vertex[1] > 0 ? 'bottom' : 'top';
}
function isNotGroup(el) {
    return !el.isGroup;
}
function isPath(el) {
    return el.shape != null;
}
function groupTransition(g1, g2, animatableModel) {
    if (!g1 || !g2) {
        return;
    }
    function getElMap(g) {
        var elMap = {};
        g.traverse(function(el) {
            if (isNotGroup(el) && el.anid) {
                elMap[el.anid] = el;
            }
        });
        return elMap;
    }
    function getAnimatableProps(el) {
        var obj = {
            x: el.x,
            y: el.y,
            rotation: el.rotation
        };
        if (isPath(el)) {
            obj.shape = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clone"])(el.shape);
        }
        return obj;
    }
    var elMap1 = getElMap(g1);
    g2.traverse(function(el) {
        if (isNotGroup(el) && el.anid) {
            var oldEl = elMap1[el.anid];
            if (oldEl) {
                var newProp = getAnimatableProps(el);
                el.attr(getAnimatableProps(oldEl));
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProps"])(el, newProp, animatableModel, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getECData"])(el).dataIndex);
            }
        }
    });
}
function clipPointsByRect(points, rect) {
    // FIXME: This way might be incorrect when graphic clipped by a corner
    // and when element has a border.
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(points, function(point) {
        var x = point[0];
        x = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathMax"])(x, rect.x);
        x = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathMin"])(x, rect.x + rect.width);
        var y = point[1];
        y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathMax"])(y, rect.y);
        y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathMin"])(y, rect.y + rect.height);
        return [
            x,
            y
        ];
    });
}
function clipRectByRect(targetRect, rect) {
    var x = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathMax"])(targetRect.x, rect.x);
    var x2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathMin"])(targetRect.x + targetRect.width, rect.x + rect.width);
    var y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathMax"])(targetRect.y, rect.y);
    var y2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathMin"])(targetRect.y + targetRect.height, rect.y + rect.height);
    // If the total rect is cliped, nothing, including the border,
    // should be painted. So return undefined.
    if (x2 >= x && y2 >= y) {
        return {
            x: x,
            y: y,
            width: x2 - x,
            height: y2 - y
        };
    }
}
function createIcon(iconStr, // Support 'image://' or 'path://' or direct svg path.
opt, rect) {
    var innerOpts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])({
        rectHover: true
    }, opt);
    var style = innerOpts.style = {
        strokeNoScale: true
    };
    rect = rect || {
        x: -1,
        y: -1,
        width: 2,
        height: 2
    };
    if (iconStr) {
        return iconStr.indexOf('image://') === 0 ? (style.image = iconStr.slice(8), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaults"])(style, rect), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](innerOpts)) : makePath(iconStr.replace('path://', ''), innerOpts, rect, 'center');
    }
}
function linePolygonIntersect(a1x, a1y, a2x, a2y, points) {
    for(var i = 0, p2 = points[points.length - 1]; i < points.length; i++){
        var p = points[i];
        if (lineLineIntersect(a1x, a1y, a2x, a2y, p[0], p[1], p2[0], p2[1])) {
            return true;
        }
        p2 = p;
    }
}
function lineLineIntersect(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y) {
    // let `vec_m` to be `vec_a2 - vec_a1` and `vec_n` to be `vec_b2 - vec_b1`.
    var mx = a2x - a1x;
    var my = a2y - a1y;
    var nx = b2x - b1x;
    var ny = b2y - b1y;
    // `vec_m` and `vec_n` are parallel iff
    //     existing `k` such that `vec_m = k · vec_n`, equivalent to `vec_m X vec_n = 0`.
    var nmCrossProduct = crossProduct2d(nx, ny, mx, my);
    if (nearZero(nmCrossProduct)) {
        return false;
    }
    // `vec_m` and `vec_n` are intersect iff
    //     existing `p` and `q` in [0, 1] such that `vec_a1 + p * vec_m = vec_b1 + q * vec_n`,
    //     such that `q = ((vec_a1 - vec_b1) X vec_m) / (vec_n X vec_m)`
    //           and `p = ((vec_a1 - vec_b1) X vec_n) / (vec_n X vec_m)`.
    var b1a1x = a1x - b1x;
    var b1a1y = a1y - b1y;
    var q = crossProduct2d(b1a1x, b1a1y, mx, my) / nmCrossProduct;
    if (q < 0 || q > 1) {
        return false;
    }
    var p = crossProduct2d(b1a1x, b1a1y, nx, ny) / nmCrossProduct;
    if (p < 0 || p > 1) {
        return false;
    }
    return true;
}
/**
 * Cross product of 2-dimension vector.
 */ function crossProduct2d(x1, y1, x2, y2) {
    return x1 * y2 - x2 * y1;
}
function nearZero(val) {
    return val <= 1e-6 && val >= -1e-6;
}
function expandOrShrinkRect(rect, delta, shrinkOrExpand, noNegative, minSize // by default [0, 0].
) {
    if (delta == null) {
        return rect;
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(delta)) {
        _tmpExpandRectDelta[0] = _tmpExpandRectDelta[1] = _tmpExpandRectDelta[2] = _tmpExpandRectDelta[3] = delta;
    } else {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])(delta.length === 4);
        }
        _tmpExpandRectDelta[0] = delta[0];
        _tmpExpandRectDelta[1] = delta[1];
        _tmpExpandRectDelta[2] = delta[2];
        _tmpExpandRectDelta[3] = delta[3];
    }
    if (noNegative) {
        _tmpExpandRectDelta[0] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathMax"])(0, _tmpExpandRectDelta[0]);
        _tmpExpandRectDelta[1] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathMax"])(0, _tmpExpandRectDelta[1]);
        _tmpExpandRectDelta[2] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathMax"])(0, _tmpExpandRectDelta[2]);
        _tmpExpandRectDelta[3] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathMax"])(0, _tmpExpandRectDelta[3]);
    }
    if (shrinkOrExpand) {
        _tmpExpandRectDelta[0] = -_tmpExpandRectDelta[0];
        _tmpExpandRectDelta[1] = -_tmpExpandRectDelta[1];
        _tmpExpandRectDelta[2] = -_tmpExpandRectDelta[2];
        _tmpExpandRectDelta[3] = -_tmpExpandRectDelta[3];
    }
    expandRectOnOneDimension(rect, _tmpExpandRectDelta, 'x', 'width', 3, 1, minSize && minSize[0] || 0);
    expandRectOnOneDimension(rect, _tmpExpandRectDelta, 'y', 'height', 0, 2, minSize && minSize[1] || 0);
    return rect;
}
var _tmpExpandRectDelta = [
    0,
    0,
    0,
    0
];
function expandRectOnOneDimension(rect, delta, xy, wh, ltIdx, rbIdx, minSize) {
    var deltaSum = delta[rbIdx] + delta[ltIdx];
    var oldSize = rect[wh];
    rect[wh] += deltaSum;
    minSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathMax"])(0, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathMin"])(minSize, oldSize));
    if (rect[wh] < minSize) {
        rect[wh] = minSize;
        // Try to make the position of the zero rect reasonable in most visual cases.
        rect[xy] += delta[ltIdx] >= 0 ? -delta[ltIdx] : delta[rbIdx] >= 0 ? oldSize + delta[rbIdx] : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathAbs"])(deltaSum) > 1e-8 ? (oldSize - minSize) * delta[ltIdx] / deltaSum : 0;
    } else {
        rect[xy] -= delta[ltIdx];
    }
}
function setTooltipConfig(opt) {
    var itemTooltipOption = opt.itemTooltipOption;
    var componentModel = opt.componentModel;
    var itemName = opt.itemName;
    var itemTooltipOptionObj = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"])(itemTooltipOption) ? {
        formatter: itemTooltipOption
    } : itemTooltipOption;
    var mainType = componentModel.mainType;
    var componentIndex = componentModel.componentIndex;
    var formatterParams = {
        componentType: mainType,
        name: itemName,
        $vars: [
            'name'
        ]
    };
    formatterParams[mainType + 'Index'] = componentIndex;
    var formatterParamsExtra = opt.formatterParamsExtra;
    if (formatterParamsExtra) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keys"])(formatterParamsExtra), function(key) {
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(formatterParams, key)) {
                formatterParams[key] = formatterParamsExtra[key];
                formatterParams.$vars.push(key);
            }
        });
    }
    var ecData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getECData"])(opt.el);
    ecData.componentMainType = mainType;
    ecData.componentIndex = componentIndex;
    ecData.tooltipConfig = {
        name: itemName,
        option: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaults"])({
            content: itemName,
            encodeHTMLContent: true,
            formatterParams: formatterParams
        }, itemTooltipOptionObj)
    };
}
function traverseElement(el, cb) {
    var stopped;
    // TODO
    // Polyfill for fixing zrender group traverse don't visit it's root issue.
    if (el.isGroup) {
        stopped = cb(el);
    }
    if (!stopped) {
        el.traverse(cb);
    }
}
function traverseElements(els, cb) {
    if (els) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(els)) {
            for(var i = 0; i < els.length; i++){
                traverseElement(els[i], cb);
            }
        } else {
            traverseElement(els, cb);
        }
    }
}
function isBoundingRectAxisAligned(transform) {
    return !transform || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathAbs"])(transform[1]) < AXIS_ALIGN_EPSILON && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathAbs"])(transform[2]) < AXIS_ALIGN_EPSILON || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathAbs"])(transform[0]) < AXIS_ALIGN_EPSILON && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathAbs"])(transform[3]) < AXIS_ALIGN_EPSILON;
}
var AXIS_ALIGN_EPSILON = 1e-5;
function ensureCopyRect(target, source) {
    return target ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].copy(target, source) : source.clone();
}
function ensureCopyTransform(target, source) {
    return source ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["copy"](target || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"](), source) : undefined;
}
function retrieveZInfo(model) {
    return {
        z: model.get('z') || 0,
        zlevel: model.get('zlevel') || 0
    };
}
function calcZ2Range(el) {
    var max = -Infinity;
    var min = Infinity;
    traverseElement(el, function(el) {
        visitEl(el);
        visitEl(el.getTextContent());
        visitEl(el.getTextGuideLine());
    });
    function visitEl(el) {
        if (!el || el.isGroup) {
            return;
        }
        var currentStates = el.currentStates;
        if (currentStates.length) {
            for(var idx = 0; idx < currentStates.length; idx++){
                calcZ2(el.states[currentStates[idx]]);
            }
        }
        calcZ2(el);
    }
    function calcZ2(entity) {
        if (entity) {
            var z2 = entity.z2;
            // Consider z2 may be NullUndefined
            if (z2 > max) {
                max = z2;
            }
            if (z2 < min) {
                min = z2;
            }
        }
    }
    if (min > max) {
        min = max = 0;
    }
    return {
        min: min,
        max: max
    };
}
function traverseUpdateZ(el, z, zlevel) {
    doUpdateZ(el, z, zlevel, -Infinity);
}
function doUpdateZ(el, z, zlevel, // FIXME: Ideally all the labels should be above all the glyphs by default,
//  e.g. in graph, edge labels should be above node elements.
//  Currently impl does not guarantee that.
maxZ2) {
    // `ignoreModelZ` is used to intentionally lift elements to cover other elements,
    // where maxZ2 (for label.z2) should also not be counted for its parents.
    if (el.ignoreModelZ) {
        return maxZ2;
    }
    // Group may also have textContent
    var label = el.getTextContent();
    var labelLine = el.getTextGuideLine();
    var isGroup = el.isGroup;
    if (isGroup) {
        // set z & zlevel of children elements of Group
        var children = el.childrenRef();
        for(var i = 0; i < children.length; i++){
            maxZ2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathMax"])(doUpdateZ(children[i], z, zlevel, maxZ2), maxZ2);
        }
    } else {
        // not Group
        el.z = z;
        el.zlevel = zlevel;
        maxZ2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathMax"])(el.z2 || 0, maxZ2);
    }
    // NOTICE: Do not call any method that can set REDRAW_BIT,
    // otherwise progressive rendering is broken.
    // always set z and zlevel if label/labelLine exists
    if (label) {
        label.z = z;
        label.zlevel = zlevel;
        // lift z2 of text content
        // TODO if el.emphasis.z2 is spcefied, what about textContent.
        isFinite(maxZ2) && (label.z2 = maxZ2 + 2);
    }
    if (labelLine) {
        var textGuideLineConfig = el.textGuideLineConfig;
        labelLine.z = z;
        labelLine.zlevel = zlevel;
        isFinite(maxZ2) && (labelLine.z2 = maxZ2 + (textGuideLineConfig && textGuideLineConfig.showAbove ? 1 : -1));
    }
    return maxZ2;
}
function payloadDisableAnimation(payload) {
    // Disable animation in `updateProps` of `graphic.ts`.
    payload.animation = {
        duration: 0
    };
    return payload;
}
function decomposeTransform(out, mt) {
    mt ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["copy"](tmpDTR.transform, mt) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["identity"](tmpDTR.transform);
    // Use a tmp transformable to avoid effects from parent.
    tmpDTR.decomposeTransform();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["copyTransform"])(out, tmpDTR);
    return out;
}
var tmpDTR = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Transformable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]();
tmpDTR.transform = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"]();
function getCurrentCanvasPainter(api) {
    var painter = api.getZr().painter;
    return painter.getType() === 'canvas' ? painter : null;
}
// Register built-in shapes. These shapes might be overwritten
// by users, although we do not recommend that.
registerShape('circle', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
registerShape('ellipse', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Ellipse$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
registerShape('sector', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Sector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
registerShape('ring', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Ring$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
registerShape('polygon', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Polygon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
registerShape('polyline', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Polyline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
registerShape('rect', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
registerShape('line', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
registerShape('bezierCurve', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$BezierCurve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
registerShape('arc', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Arc$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/innerStore.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getECData",
    ()=>getECData,
    "setCommonECData",
    ()=>setCommonECData
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
var getECData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeInner"])();
var setCommonECData = function(seriesIndex, dataType, dataIdx, el) {
    if (el) {
        var ecData = getECData(el);
        // Add data index and series index for indexing the data by element
        // Useful in tooltip
        ecData.dataIndex = dataIdx;
        ecData.dataType = dataType;
        ecData.seriesIndex = seriesIndex;
        ecData.ssrType = 'chart';
        // TODO: not store dataIndex on children.
        if (el.type === 'group') {
            el.traverse(function(child) {
                var childECData = getECData(child);
                childECData.seriesIndex = seriesIndex;
                childECData.dataIndex = dataIdx;
                childECData.dataType = dataType;
                childECData.ssrType = 'chart';
            });
        }
    }
};
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/jitter.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fixJitter",
    ()=>fixJitter,
    "needFixJitter",
    ()=>needFixJitter
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$Axis2D$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/cartesian/Axis2D.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$GridModel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/cartesian/GridModel.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$single$2f$AxisModel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/single/AxisModel.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/helper.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
;
;
;
;
;
;
function needFixJitter(seriesModel, axis) {
    var coordinateSystem = seriesModel.coordinateSystem;
    var coordType = coordinateSystem && coordinateSystem.type;
    var baseAxis = coordinateSystem && coordinateSystem.getBaseAxis && coordinateSystem.getBaseAxis();
    var scaleType = baseAxis && baseAxis.scale && baseAxis.scale.type;
    var seriesValid = coordType === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$GridModel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COORD_SYS_TYPE_CARTESIAN_2D"] && scaleType === 'ordinal' || coordType === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$single$2f$AxisModel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COORD_SYS_TYPE_SINGLE"];
    var axisValid = axis.model.get('jitter') > 0;
    return seriesValid && axisValid;
}
var inner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeInner"])();
function fixJitter(fixedAxis, fixedCoord, floatCoord, radius) {
    if (fixedAxis instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$Axis2D$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]) {
        var scaleType = fixedAxis.scale.type;
        if (scaleType !== 'ordinal') {
            return floatCoord;
        }
    }
    var axisModel = fixedAxis.model;
    var jitter = axisModel.get('jitter');
    if (!(jitter > 0)) {
        return floatCoord;
    }
    var jitterOverlap = axisModel.get('jitterOverlap');
    var jitterMargin = axisModel.get('jitterMargin') || 0;
    // Get band width to limit jitter range
    var bandWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isOrdinalScale"])(fixedAxis.scale) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisBand$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calcBandWidth"])(fixedAxis).w : null;
    if (jitterOverlap) {
        return fixJitterIgnoreOverlaps(floatCoord, jitter, bandWidth, radius);
    }
    return fixJitterAvoidOverlaps(fixedAxis, fixedCoord, floatCoord, radius, jitter, jitterMargin);
}
function fixJitterIgnoreOverlaps(floatCoord, jitter, bandWidth, radius) {
    // Don't clamp single axis
    if (bandWidth === null) {
        return floatCoord + (Math.random() - 0.5) * jitter;
    }
    var maxJitter = bandWidth - radius * 2;
    var actualJitter = Math.min(Math.max(0, jitter), maxJitter);
    return floatCoord + (Math.random() - 0.5) * actualJitter;
}
function fixJitterAvoidOverlaps(fixedAxis, fixedCoord, floatCoord, radius, jitter, margin) {
    var store = inner(fixedAxis);
    if (!store.items) {
        store.items = [];
    }
    var items = store.items;
    // Try both positive and negative directions, choose the one with smaller movement
    var overlapA = placeJitterOnDirection(items, fixedCoord, floatCoord, radius, jitter, margin, 1);
    var overlapB = placeJitterOnDirection(items, fixedCoord, floatCoord, radius, jitter, margin, -1);
    var minFloat = Math.abs(overlapA - floatCoord) < Math.abs(overlapB - floatCoord) ? overlapA : overlapB;
    // Clamp only category axis
    var bandWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isOrdinalScale"])(fixedAxis.scale) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisBand$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calcBandWidth"])(fixedAxis).w : null;
    var distance = Math.abs(minFloat - floatCoord);
    if (distance > jitter / 2 || bandWidth && distance > bandWidth / 2 - radius) {
        // If the new item is moved too far, then give up.
        // Fall back to random jitter.
        return fixJitterIgnoreOverlaps(floatCoord, jitter, bandWidth, radius);
    }
    // Add new point to array
    items.push({
        fixedCoord: fixedCoord,
        floatCoord: minFloat,
        r: radius
    });
    return minFloat;
}
function placeJitterOnDirection(items, fixedCoord, floatCoord, radius, jitter, margin, direction) {
    var y = floatCoord;
    // Check all existing items for overlap and find the maximum adjustment needed
    for(var i = 0; i < items.length; i++){
        var item = items[i];
        var dx = fixedCoord - item.fixedCoord;
        var dy = y - item.floatCoord;
        var d2 = dx * dx + dy * dy;
        var r = radius + item.r + margin;
        if (d2 < r * r) {
            // Has overlap, calculate required adjustment
            var requiredY = item.floatCoord + Math.sqrt(r * r - dx * dx) * direction;
            // Check if this adjustment would move too far
            if (Math.abs(requiredY - floatCoord) > jitter / 2) {
                return Number.MAX_VALUE; // Give up
            }
            // Update y only when it's larger to the center
            if (direction === 1 && requiredY > y || direction === -1 && requiredY < y) {
                y = requiredY;
                // Loop from the start again
                i = -1; // Reset index to recheck all items
                continue; // Recalculate with the new y position
            }
        }
    }
    return y;
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/layout.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BoxLayoutReferenceType",
    ()=>BoxLayoutReferenceType,
    "HV_NAMES",
    ()=>HV_NAMES,
    "LOCATION_PARAMS",
    ()=>LOCATION_PARAMS,
    "applyPreserveAspect",
    ()=>applyPreserveAspect,
    "box",
    ()=>box,
    "copyLayoutParams",
    ()=>copyLayoutParams,
    "createBoxLayoutReference",
    ()=>createBoxLayoutReference,
    "fetchLayoutMode",
    ()=>fetchLayoutMode,
    "getBoxLayoutParams",
    ()=>getBoxLayoutParams,
    "getCircleLayout",
    ()=>getCircleLayout,
    "getLayoutParams",
    ()=>getLayoutParams,
    "getLayoutRect",
    ()=>getLayoutRect,
    "hbox",
    ()=>hbox,
    "mergeLayoutParam",
    ()=>mergeLayoutParam,
    "positionElement",
    ()=>positionElement,
    "sizeCalculable",
    ()=>sizeCalculable,
    "vbox",
    ()=>vbox
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
*/ // Layout helpers for each component positioning
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/BoundingRect.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/format.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/CoordinateSystem.js [app-client] (ecmascript)");
;
;
;
;
;
;
var each = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"];
var LOCATION_PARAMS = [
    'left',
    'right',
    'top',
    'bottom',
    'width',
    'height'
];
var HV_NAMES = [
    [
        'width',
        'left',
        'right'
    ],
    [
        'height',
        'top',
        'bottom'
    ]
];
function boxLayout(orient, group, gap, maxWidth, maxHeight) {
    var x = 0;
    var y = 0;
    if (maxWidth == null) {
        maxWidth = Infinity;
    }
    if (maxHeight == null) {
        maxHeight = Infinity;
    }
    var currentLineMaxSize = 0;
    group.eachChild(function(child, idx) {
        var rect = child.getBoundingRect();
        var nextChild = group.childAt(idx + 1);
        var nextChildRect = nextChild && nextChild.getBoundingRect();
        var nextX;
        var nextY;
        if (orient === 'horizontal') {
            var moveX = rect.width + (nextChildRect ? -nextChildRect.x + rect.x : 0);
            nextX = x + moveX;
            // Wrap when width exceeds maxWidth or meet a `newline` group
            // FIXME compare before adding gap?
            if (nextX > maxWidth || child.newline) {
                x = 0;
                nextX = moveX;
                y += currentLineMaxSize + gap;
                currentLineMaxSize = rect.height;
            } else {
                // FIXME: consider rect.y is not `0`?
                currentLineMaxSize = Math.max(currentLineMaxSize, rect.height);
            }
        } else {
            var moveY = rect.height + (nextChildRect ? -nextChildRect.y + rect.y : 0);
            nextY = y + moveY;
            // Wrap when width exceeds maxHeight or meet a `newline` group
            if (nextY > maxHeight || child.newline) {
                x += currentLineMaxSize + gap;
                y = 0;
                nextY = moveY;
                currentLineMaxSize = rect.width;
            } else {
                currentLineMaxSize = Math.max(currentLineMaxSize, rect.width);
            }
        }
        if (child.newline) {
            return;
        }
        child.x = x;
        child.y = y;
        child.markRedraw();
        orient === 'horizontal' ? x = nextX + gap : y = nextY + gap;
    });
}
var box = boxLayout;
var vbox = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["curry"](boxLayout, 'vertical');
var hbox = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["curry"](boxLayout, 'horizontal');
function getBoxLayoutParams(boxLayoutModel, ignoreParent) {
    return {
        left: boxLayoutModel.getShallow('left', ignoreParent),
        top: boxLayoutModel.getShallow('top', ignoreParent),
        right: boxLayoutModel.getShallow('right', ignoreParent),
        bottom: boxLayoutModel.getShallow('bottom', ignoreParent),
        width: boxLayoutModel.getShallow('width', ignoreParent),
        height: boxLayoutModel.getShallow('height', ignoreParent)
    };
}
function getViewRectAndCenterForCircleLayout(seriesModel, api) {
    var layoutRef = createBoxLayoutReference(seriesModel, api, {
        enableLayoutOnlyByCenter: true
    });
    var boxLayoutParams = seriesModel.getBoxLayoutParams();
    var viewRect;
    var center;
    if (layoutRef.type === BoxLayoutReferenceType.point) {
        center = layoutRef.refPoint;
        // `viewRect` is required in `pie/labelLayout.ts`.
        viewRect = getLayoutRect(boxLayoutParams, {
            width: api.getWidth(),
            height: api.getHeight()
        });
    } else {
        // layoutRef.type === layout.BoxLayoutReferenceType.rect
        var centerOption = seriesModel.get('center');
        var centerOptionArr = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"](centerOption) ? centerOption : [
            centerOption,
            centerOption
        ];
        viewRect = getLayoutRect(boxLayoutParams, layoutRef.refContainer);
        center = layoutRef.boxCoordFrom === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BOX_COORD_SYS_COORD_FROM_PROP_COORD2"] ? layoutRef.refPoint // option `series.center` has been used as coord.
         : [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(centerOptionArr[0], viewRect.width) + viewRect.x,
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(centerOptionArr[1], viewRect.height) + viewRect.y
        ];
    }
    return {
        viewRect: viewRect,
        center: center
    };
}
function getCircleLayout(seriesModel, api) {
    // center can be string or number when coordinateSystem is specified
    var _a = getViewRectAndCenterForCircleLayout(seriesModel, api), viewRect = _a.viewRect, center = _a.center;
    var radius = seriesModel.get('radius');
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"](radius)) {
        radius = [
            0,
            radius
        ];
    }
    var width = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(viewRect.width, api.getWidth());
    var height = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(viewRect.height, api.getHeight());
    var size = Math.min(width, height);
    var r0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(radius[0], size / 2);
    var r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(radius[1], size / 2);
    return {
        cx: center[0],
        cy: center[1],
        r0: r0,
        r: r,
        viewRect: viewRect
    };
}
function getLayoutRect(positionInfo, containerRect, // This is the space from the `containerRect` to the returned bounding rect.
// Commonly used in option `legend.padding`, `timeline.padding`, `title.padding`,
//  `visualMap.padding`, ...
// [NOTICE]:
//  It's named `margin`, because it's the space that outside the bounding rect. But from
//  the perspective of the the caller, it's commonly used as the `padding` of a component,
//  because conventionally background color covers this space.
// [BEHAVIOR]:
//  - If width/height is specified, `margin` does not effect them.
//  - Otherwise, they are calculated based on the rect that `containerRect` shrinked by `margin`.
//  - left/right/top/bottom are based on the rect that `containerRect` shrinked by `margin`.
margin) {
    margin = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["normalizeCssArray"](margin || 0);
    var containerWidth = containerRect.width;
    var containerHeight = containerRect.height;
    var left = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(positionInfo.left, containerWidth);
    var top = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(positionInfo.top, containerHeight);
    var right = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(positionInfo.right, containerWidth);
    var bottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(positionInfo.bottom, containerHeight);
    var width = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(positionInfo.width, containerWidth);
    var height = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(positionInfo.height, containerHeight);
    var verticalMargin = margin[2] + margin[0];
    var horizontalMargin = margin[1] + margin[3];
    var aspect = positionInfo.aspect;
    // If width is not specified, calculate width from left and right
    if (isNaN(width)) {
        width = containerWidth - right - horizontalMargin - left;
    }
    if (isNaN(height)) {
        height = containerHeight - bottom - verticalMargin - top;
    }
    if (aspect != null) {
        // If width and height are not given
        // 1. Graph should not exceeds the container
        // 2. Aspect must be keeped
        // 3. Graph should take the space as more as possible
        // FIXME
        // Margin is not considered, because there is no case that both
        // using margin and aspect so far.
        if (isNaN(width) && isNaN(height)) {
            // PENDING: if only `left` or `right` is defined, perhaps it's more preferable to
            // calculate size based on `containerWidth - left` or `containerWidth - left` here,
            // but for backward compatibility we do not change it.
            if (aspect > containerWidth / containerHeight) {
                width = containerWidth * 0.8;
            } else {
                height = containerHeight * 0.8;
            }
        }
        // Calculate width or height with given aspect
        if (isNaN(width)) {
            width = aspect * height;
        }
        if (isNaN(height)) {
            height = width / aspect;
        }
    }
    // If left is not specified, calculate left from right and width
    if (isNaN(left)) {
        left = containerWidth - right - width - horizontalMargin;
    }
    if (isNaN(top)) {
        top = containerHeight - bottom - height - verticalMargin;
    }
    // Align left and top
    switch(positionInfo.left || positionInfo.right){
        case 'center':
            left = containerWidth / 2 - width / 2 - margin[3];
            break;
        case 'right':
            left = containerWidth - width - horizontalMargin;
            break;
    }
    switch(positionInfo.top || positionInfo.bottom){
        case 'middle':
        case 'center':
            top = containerHeight / 2 - height / 2 - margin[0];
            break;
        case 'bottom':
            top = containerHeight - height - verticalMargin;
            break;
    }
    // If something is wrong and left, top, width, height are calculated as NaN
    left = left || 0;
    top = top || 0;
    if (isNaN(width)) {
        // Width may be NaN if only one value is given except width
        width = containerWidth - horizontalMargin - left - (right || 0);
    }
    if (isNaN(height)) {
        // Height may be NaN if only one value is given except height
        height = containerHeight - verticalMargin - top - (bottom || 0);
    }
    var rect = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]((containerRect.x || 0) + left + margin[3], (containerRect.y || 0) + top + margin[0], width, height);
    rect.margin = margin;
    return rect;
}
function applyPreserveAspect(component, layoutRect, // That is, `width / height`.
// Assume `aspect` is positive.
aspect) {
    var preserveAspect = component.getShallow('preserveAspect', true);
    if (!preserveAspect) {
        return layoutRect;
    }
    var actualAspect = layoutRect.width / layoutRect.height;
    if (Math.abs(Math.atan(aspect) - Math.atan(actualAspect)) < 1e-9) {
        return layoutRect;
    }
    var preserveAspectAlign = component.getShallow('preserveAspectAlign', true);
    var preserveAspectVerticalAlign = component.getShallow('preserveAspectVerticalAlign', true);
    var layoutOptInner = {
        width: layoutRect.width,
        height: layoutRect.height
    };
    var isCover = preserveAspect === 'cover';
    if (actualAspect > aspect && !isCover || actualAspect < aspect && isCover) {
        layoutOptInner.width = layoutRect.height * aspect;
        preserveAspectAlign === 'left' ? layoutOptInner.left = 0 : preserveAspectAlign === 'right' ? layoutOptInner.right = 0 : layoutOptInner.left = 'center';
    } else {
        layoutOptInner.height = layoutRect.width / aspect;
        preserveAspectVerticalAlign === 'top' ? layoutOptInner.top = 0 : preserveAspectVerticalAlign === 'bottom' ? layoutOptInner.bottom = 0 : layoutOptInner.top = 'middle';
    }
    return getLayoutRect(layoutOptInner, layoutRect);
}
var BoxLayoutReferenceType = {
    rect: 1,
    point: 2
};
function createBoxLayoutReference(model, api, opt) {
    var refContainer;
    var refPoint;
    var layoutRefType;
    var boxCoordSys = model.boxCoordinateSystem;
    var boxCoordFrom;
    if (boxCoordSys) {
        var _a = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$CoordinateSystem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCoordForCoordSysUsageKindBox"])(model), coord = _a.coord, from = _a.from;
        // Do not use `clamp` in `dataToLayout` and `dataToPoint`, because:
        //  1. Should support overflow (such as, by dataZoom), where NaN should be in the result.
        //  2. Be consistent with the way used in `series.data`
        if (boxCoordSys.dataToLayout) {
            layoutRefType = BoxLayoutReferenceType.rect;
            boxCoordFrom = from;
            var result = boxCoordSys.dataToLayout(coord);
            refContainer = result.contentRect || result.rect;
        } else if (opt && opt.enableLayoutOnlyByCenter && boxCoordSys.dataToPoint) {
            layoutRefType = BoxLayoutReferenceType.point;
            boxCoordFrom = from;
            refPoint = boxCoordSys.dataToPoint(coord);
        } else {
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["error"])(model.type + "[" + model.componentIndex + "]" + (" layout based on " + boxCoordSys.type + " is not supported."));
            }
        }
    }
    if (layoutRefType == null) {
        layoutRefType = BoxLayoutReferenceType.rect;
    }
    if (layoutRefType === BoxLayoutReferenceType.rect) {
        if (!refContainer) {
            refContainer = {
                x: 0,
                y: 0,
                width: api.getWidth(),
                height: api.getHeight()
            };
        }
        refPoint = [
            refContainer.x + refContainer.width / 2,
            refContainer.y + refContainer.height / 2
        ];
    }
    return {
        type: layoutRefType,
        refContainer: refContainer,
        refPoint: refPoint,
        boxCoordFrom: boxCoordFrom
    };
}
function positionElement(el, positionInfo, containerRect, margin, opt, out) {
    var h = !opt || !opt.hv || opt.hv[0];
    var v = !opt || !opt.hv || opt.hv[1];
    var boundingMode = opt && opt.boundingMode || 'all';
    out = out || el;
    out.x = el.x;
    out.y = el.y;
    if (!h && !v) {
        return false;
    }
    var rect;
    if (boundingMode === 'raw') {
        rect = el.type === 'group' ? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](0, 0, +positionInfo.width || 0, +positionInfo.height || 0) : el.getBoundingRect();
    } else {
        rect = el.getBoundingRect();
        if (el.needLocalTransform()) {
            var transform = el.getLocalTransform();
            // Notice: raw rect may be inner object of el,
            // which should not be modified.
            rect = rect.clone();
            rect.applyTransform(transform);
        }
    }
    // The real width and height can not be specified but calculated by the given el.
    var layoutRect = getLayoutRect(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaults"]({
        width: rect.width,
        height: rect.height
    }, positionInfo), containerRect, margin);
    // Because 'tranlate' is the last step in transform
    // (see zrender/core/Transformable#getLocalTransform),
    // we can just only modify el.position to get final result.
    var dx = h ? layoutRect.x - rect.x : 0;
    var dy = v ? layoutRect.y - rect.y : 0;
    if (boundingMode === 'raw') {
        out.x = dx;
        out.y = dy;
    } else {
        out.x += dx;
        out.y += dy;
    }
    if (out === el) {
        el.markRedraw();
    }
    return true;
}
function sizeCalculable(option, hvIdx) {
    return option[HV_NAMES[hvIdx][0]] != null || option[HV_NAMES[hvIdx][1]] != null && option[HV_NAMES[hvIdx][2]] != null;
}
function fetchLayoutMode(ins) {
    var layoutMode = ins.layoutMode || ins.constructor.layoutMode;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObject"](layoutMode) ? layoutMode : layoutMode ? {
        type: layoutMode
    } : null;
}
function mergeLayoutParam(targetOption, newOption, opt) {
    var ignoreSize = opt && opt.ignoreSize;
    !__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"](ignoreSize) && (ignoreSize = [
        ignoreSize,
        ignoreSize
    ]);
    var hResult = merge(HV_NAMES[0], 0);
    var vResult = merge(HV_NAMES[1], 1);
    copy(HV_NAMES[0], targetOption, hResult);
    copy(HV_NAMES[1], targetOption, vResult);
    function merge(names, hvIdx) {
        var newParams = {};
        var newValueCount = 0;
        var merged = {};
        var mergedValueCount = 0;
        var enoughParamNumber = 2;
        each(names, function(name) {
            merged[name] = targetOption[name];
        });
        each(names, function(name) {
            // Consider case: newOption.width is null, which is
            // set by user for removing width setting.
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"](newOption, name) && (newParams[name] = merged[name] = newOption[name]);
            hasValue(newParams, name) && newValueCount++;
            hasValue(merged, name) && mergedValueCount++;
        });
        if (ignoreSize[hvIdx]) {
            // Only one of left/right is premitted to exist.
            if (hasValue(newOption, names[1])) {
                merged[names[2]] = null;
            } else if (hasValue(newOption, names[2])) {
                merged[names[1]] = null;
            }
            return merged;
        }
        // Case: newOption: {width: ..., right: ...},
        // or targetOption: {right: ...} and newOption: {width: ...},
        // There is no conflict when merged only has params count
        // little than enoughParamNumber.
        if (mergedValueCount === enoughParamNumber || !newValueCount) {
            return merged;
        } else if (newValueCount >= enoughParamNumber) {
            return newParams;
        } else {
            // Chose another param from targetOption by priority.
            for(var i = 0; i < names.length; i++){
                var name_1 = names[i];
                if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"](newParams, name_1) && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"](targetOption, name_1)) {
                    newParams[name_1] = targetOption[name_1];
                    break;
                }
            }
            return newParams;
        }
    }
    function hasValue(obj, name) {
        return obj[name] != null && obj[name] !== 'auto';
    }
    function copy(names, target, source) {
        each(names, function(name) {
            target[name] = source[name];
        });
    }
}
function getLayoutParams(source) {
    return copyLayoutParams({}, source);
}
function copyLayoutParams(target, source) {
    source && target && each(LOCATION_PARAMS, function(name) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"](source, name) && (target[name] = source[name]);
    });
    return target;
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deprecateLog",
    ()=>deprecateLog,
    "deprecateReplaceLog",
    ()=>deprecateReplaceLog,
    "error",
    ()=>error,
    "log",
    ()=>log,
    "makePrintable",
    ()=>makePrintable,
    "throwError",
    ()=>throwError,
    "warn",
    ()=>warn
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
;
var ECHARTS_PREFIX = '[ECharts] ';
var storedLogs = {};
var hasConsole = typeof console !== 'undefined' && console.warn && console.log;
function outputLog(type, str, onlyOnce) {
    if (hasConsole) {
        if (onlyOnce) {
            if (storedLogs[str]) {
                return;
            }
            storedLogs[str] = true;
        }
        // eslint-disable-next-line
        console[type](ECHARTS_PREFIX + str);
    }
}
function log(str, onlyOnce) {
    outputLog('log', str, onlyOnce);
}
function warn(str, onlyOnce) {
    outputLog('warn', str, onlyOnce);
}
function error(str, onlyOnce) {
    outputLog('error', str, onlyOnce);
}
function deprecateLog(str) {
    if ("TURBOPACK compile-time truthy", 1) {
        // Not display duplicate message.
        outputLog('warn', 'DEPRECATED: ' + str, true);
    }
}
function deprecateReplaceLog(oldOpt, newOpt, scope) {
    if ("TURBOPACK compile-time truthy", 1) {
        deprecateLog((scope ? "[" + scope + "]" : '') + (oldOpt + " is deprecated; use " + newOpt + " instead."));
    }
}
function makePrintable() {
    var hintInfo = [];
    for(var _i = 0; _i < arguments.length; _i++){
        hintInfo[_i] = arguments[_i];
    }
    var msg = '';
    if ("TURBOPACK compile-time truthy", 1) {
        // Fuzzy stringify for print.
        // This code only exist in dev environment.
        var makePrintableStringIfPossible_1 = function(val) {
            return val === void 0 ? 'undefined' : val === Infinity ? 'Infinity' : val === -Infinity ? '-Infinity' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eqNaN"])(val) ? 'NaN' : val instanceof Date ? 'Date(' + val.toISOString() + ')' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFunction"])(val) ? 'function () { ... }' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRegExp"])(val) ? val + '' : null;
        };
        msg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(hintInfo, function(arg) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"])(arg)) {
                // Print without quotation mark for some statement.
                return arg;
            } else {
                var printableStr = makePrintableStringIfPossible_1(arg);
                if (printableStr != null) {
                    return printableStr;
                } else if (typeof JSON !== 'undefined' && JSON.stringify) {
                    try {
                        return JSON.stringify(arg, function(n, val) {
                            var printableStr = makePrintableStringIfPossible_1(val);
                            return printableStr == null ? val : printableStr;
                        });
                    // In most cases the info object is small, so do not line break.
                    } catch (err) {
                        return '?';
                    }
                } else {
                    return '?';
                }
            }
        }).join(' ');
    }
    return msg;
}
function throwError(msg) {
    throw new Error(msg);
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ListIterator",
    ()=>ListIterator,
    "MULTIPLE_REFERRING",
    ()=>MULTIPLE_REFERRING,
    "SINGLE_REFERRING",
    ()=>SINGLE_REFERRING,
    "TEXT_STYLE_OPTIONS",
    ()=>TEXT_STYLE_OPTIONS,
    "clearTmpModel",
    ()=>clearTmpModel,
    "compressBatches",
    ()=>compressBatches,
    "convertOptionIdName",
    ()=>convertOptionIdName,
    "createSimpleOverallStageHandler",
    ()=>createSimpleOverallStageHandler,
    "createSimpleOverallStageHandler2",
    ()=>createSimpleOverallStageHandler2,
    "defaultEmphasis",
    ()=>defaultEmphasis,
    "ensureExtentAscSimply",
    ()=>ensureExtentAscSimply,
    "extentHasValue",
    ()=>extentHasValue,
    "getAttribute",
    ()=>getAttribute,
    "getDataItemValue",
    ()=>getDataItemValue,
    "getIncrementalId",
    ()=>getIncrementalId,
    "getTooltipRenderMode",
    ()=>getTooltipRenderMode,
    "groupData",
    ()=>groupData,
    "initExtentForUnion",
    ()=>initExtentForUnion,
    "interpolateRawValues",
    ()=>interpolateRawValues,
    "isComponentIdInternal",
    ()=>isComponentIdInternal,
    "isDataItemOption",
    ()=>isDataItemOption,
    "isNameSpecified",
    ()=>isNameSpecified,
    "isValidBoundsForExtent",
    ()=>isValidBoundsForExtent,
    "isValidNumberForExtent",
    ()=>isValidNumberForExtent,
    "makeCallOnlyOnce",
    ()=>makeCallOnlyOnce,
    "makeInner",
    ()=>makeInner,
    "makeInternalComponentId",
    ()=>makeInternalComponentId,
    "makeQueryConditionKindA",
    ()=>makeQueryConditionKindA,
    "mappingToExists",
    ()=>mappingToExists,
    "normalizeToArray",
    ()=>normalizeToArray,
    "parseFinder",
    ()=>parseFinder,
    "preParseFinder",
    ()=>preParseFinder,
    "preparePipelineContext",
    ()=>preparePipelineContext,
    "queryDataIndex",
    ()=>queryDataIndex,
    "queryReferringComponents",
    ()=>queryReferringComponents,
    "removeDuplicates",
    ()=>removeDuplicates,
    "removeDuplicatesGetKeyFromItemItself",
    ()=>removeDuplicatesGetKeyFromItemItself,
    "removeDuplicatesGetKeyFromValueProp",
    ()=>removeDuplicatesGetKeyFromValueProp,
    "setAttribute",
    ()=>setAttribute,
    "setComponentTypeToKeyInfo",
    ()=>setComponentTypeToKeyInfo,
    "unionExtentEndFromNumber",
    ()=>unionExtentEndFromNumber,
    "unionExtentFromExtent",
    ()=>unionExtentFromExtent,
    "unionExtentFromNumber",
    ()=>unionExtentFromNumber,
    "unionExtentStartFromNumber",
    ()=>unionExtentStartFromNumber,
    "validateUpstreamOutputRange",
    ()=>validateUpstreamOutputRange
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$env$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/env.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-client] (ecmascript)");
;
;
;
;
function interpolateNumber(p0, p1, percent) {
    return (p1 - p0) * percent + p0;
}
/**
 * Make the name displayable. But we should
 * make sure it is not duplicated with user
 * specified name, so use '\0';
 */ var DUMMY_COMPONENT_NAME_PREFIX = 'series\0';
var INTERNAL_COMPONENT_ID_PREFIX = '\0_ec_\0';
function normalizeToArray(value) {
    return value instanceof Array ? value : value == null ? [] : [
        value
    ];
}
function defaultEmphasis(opt, key, subOpts) {
    // Caution: performance sensitive.
    if (opt) {
        opt[key] = opt[key] || {};
        opt.emphasis = opt.emphasis || {};
        opt.emphasis[key] = opt.emphasis[key] || {};
        // Default emphasis option from normal
        for(var i = 0, len = subOpts.length; i < len; i++){
            var subOptName = subOpts[i];
            if (!opt.emphasis[key].hasOwnProperty(subOptName) && opt[key].hasOwnProperty(subOptName)) {
                opt.emphasis[key][subOptName] = opt[key][subOptName];
            }
        }
    }
}
var TEXT_STYLE_OPTIONS = [
    'fontStyle',
    'fontWeight',
    'fontSize',
    'fontFamily',
    'rich',
    'tag',
    'color',
    'textBorderColor',
    'textBorderWidth',
    'width',
    'height',
    'lineHeight',
    'align',
    'verticalAlign',
    'baseline',
    'shadowColor',
    'shadowBlur',
    'shadowOffsetX',
    'shadowOffsetY',
    'textShadowColor',
    'textShadowBlur',
    'textShadowOffsetX',
    'textShadowOffsetY',
    'backgroundColor',
    'borderColor',
    'borderWidth',
    'borderRadius',
    'padding'
];
function getDataItemValue(dataItem) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObject"])(dataItem) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(dataItem) && !(dataItem instanceof Date) ? dataItem.value : dataItem;
}
function isDataItemOption(dataItem) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObject"])(dataItem) && !(dataItem instanceof Array);
// // markLine data can be array
// && !(dataItem[0] && isObject(dataItem[0]) && !(dataItem[0] instanceof Array));
}
;
function mappingToExists(existings, newCmptOptions, mode) {
    var isNormalMergeMode = mode === 'normalMerge';
    var isReplaceMergeMode = mode === 'replaceMerge';
    var isReplaceAllMode = mode === 'replaceAll';
    existings = existings || [];
    newCmptOptions = (newCmptOptions || []).slice();
    var existingIdIdxMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHashMap"])();
    // Validate id and name on user input option.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(newCmptOptions, function(cmptOption, index) {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObject"])(cmptOption)) {
            newCmptOptions[index] = null;
            return;
        }
        if ("TURBOPACK compile-time truthy", 1) {
            // There is some legacy case that name is set as `false`.
            // But should work normally rather than throw error.
            if (cmptOption.id != null && !isValidIdOrName(cmptOption.id)) {
                warnInvalidateIdOrName(cmptOption.id);
            }
            if (cmptOption.name != null && !isValidIdOrName(cmptOption.name)) {
                warnInvalidateIdOrName(cmptOption.name);
            }
        }
    });
    var result = prepareResult(existings, existingIdIdxMap, mode);
    if (isNormalMergeMode || isReplaceMergeMode) {
        mappingById(result, existings, existingIdIdxMap, newCmptOptions);
    }
    if (isNormalMergeMode) {
        mappingByName(result, newCmptOptions);
    }
    if (isNormalMergeMode || isReplaceMergeMode) {
        mappingByIndex(result, newCmptOptions, isReplaceMergeMode);
    } else if (isReplaceAllMode) {
        mappingInReplaceAllMode(result, newCmptOptions);
    }
    makeIdAndName(result);
    // The array `result` MUST NOT contain elided items, otherwise the
    // forEach will omit those items and result in incorrect result.
    return result;
}
function prepareResult(existings, existingIdIdxMap, mode) {
    var result = [];
    if (mode === 'replaceAll') {
        return result;
    }
    // Do not use native `map` to in case that the array `existings`
    // contains elided items, which will be omitted.
    for(var index = 0; index < existings.length; index++){
        var existing = existings[index];
        // Because of replaceMerge, `existing` may be null/undefined.
        if (existing && existing.id != null) {
            existingIdIdxMap.set(existing.id, index);
        }
        // For non-internal-componnets:
        //     Mode "normalMerge": all existings kept.
        //     Mode "replaceMerge": all existing removed unless mapped by id.
        // For internal-components:
        //     go with "replaceMerge" approach in both mode.
        result.push({
            existing: mode === 'replaceMerge' || isComponentIdInternal(existing) ? null : existing,
            newOption: null,
            keyInfo: null,
            brandNew: null
        });
    }
    return result;
}
function mappingById(result, existings, existingIdIdxMap, newCmptOptions) {
    // Mapping by id if specified.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(newCmptOptions, function(cmptOption, index) {
        if (!cmptOption || cmptOption.id == null) {
            return;
        }
        var optionId = makeComparableKey(cmptOption.id);
        var existingIdx = existingIdIdxMap.get(optionId);
        if (existingIdx != null) {
            var resultItem = result[existingIdx];
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])(!resultItem.newOption, 'Duplicated option on id "' + optionId + '".');
            resultItem.newOption = cmptOption;
            // In both mode, if id matched, new option will be merged to
            // the existings rather than creating new component model.
            resultItem.existing = existings[existingIdx];
            newCmptOptions[index] = null;
        }
    });
}
function mappingByName(result, newCmptOptions) {
    // Mapping by name if specified.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(newCmptOptions, function(cmptOption, index) {
        if (!cmptOption || cmptOption.name == null) {
            return;
        }
        for(var i = 0; i < result.length; i++){
            var existing = result[i].existing;
            if (!result[i].newOption // Consider name: two map to one.
             && existing && (existing.id == null || cmptOption.id == null) && !isComponentIdInternal(cmptOption) && !isComponentIdInternal(existing) && keyExistAndEqual('name', existing, cmptOption)) {
                result[i].newOption = cmptOption;
                newCmptOptions[index] = null;
                return;
            }
        }
    });
}
function mappingByIndex(result, newCmptOptions, brandNew) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(newCmptOptions, function(cmptOption) {
        if (!cmptOption) {
            return;
        }
        // Find the first place that not mapped by id and not internal component (consider the "hole").
        var resultItem;
        var nextIdx = 0;
        while(// Be `!resultItem` only when `nextIdx >= result.length`.
        (resultItem = result[nextIdx]) && (resultItem.newOption || isComponentIdInternal(resultItem.existing) || // In mode "replaceMerge", here no not-mapped-non-internal-existing.
        resultItem.existing && cmptOption.id != null && !keyExistAndEqual('id', cmptOption, resultItem.existing))){
            nextIdx++;
        }
        if (resultItem) {
            resultItem.newOption = cmptOption;
            resultItem.brandNew = brandNew;
        } else {
            result.push({
                newOption: cmptOption,
                brandNew: brandNew,
                existing: null,
                keyInfo: null
            });
        }
        nextIdx++;
    });
}
function mappingInReplaceAllMode(result, newCmptOptions) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(newCmptOptions, function(cmptOption) {
        // The feature "reproduce" requires "hole" will also reproduced
        // in case that component index referring are broken.
        result.push({
            newOption: cmptOption,
            brandNew: true,
            existing: null,
            keyInfo: null
        });
    });
}
/**
 * Make id and name for mapping result (result of mappingToExists)
 * into `keyInfo` field.
 */ function makeIdAndName(mapResult) {
    // We use this id to hash component models and view instances
    // in echarts. id can be specified by user, or auto generated.
    // The id generation rule ensures new view instance are able
    // to mapped to old instance when setOption are called in
    // no-merge mode. So we generate model id by name and plus
    // type in view id.
    // name can be duplicated among components, which is convenient
    // to specify multi components (like series) by one name.
    // Ensure that each id is distinct.
    var idMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHashMap"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(mapResult, function(item) {
        var existing = item.existing;
        existing && idMap.set(existing.id, item);
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(mapResult, function(item) {
        var opt = item.newOption;
        // Force ensure id not duplicated.
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])(!opt || opt.id == null || !idMap.get(opt.id) || idMap.get(opt.id) === item, 'id duplicates: ' + (opt && opt.id));
        opt && opt.id != null && idMap.set(opt.id, item);
        !item.keyInfo && (item.keyInfo = {});
    });
    // Make name and id.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(mapResult, function(item, index) {
        var existing = item.existing;
        var opt = item.newOption;
        var keyInfo = item.keyInfo;
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObject"])(opt)) {
            return;
        }
        // Name can be overwritten. Consider case: axis.name = '20km'.
        // But id generated by name will not be changed, which affect
        // only in that case: setOption with 'not merge mode' and view
        // instance will be recreated, which can be accepted.
        keyInfo.name = opt.name != null ? makeComparableKey(opt.name) : existing ? existing.name : DUMMY_COMPONENT_NAME_PREFIX + index;
        if (existing) {
            keyInfo.id = makeComparableKey(existing.id);
        } else if (opt.id != null) {
            keyInfo.id = makeComparableKey(opt.id);
        } else {
            // Consider this situatoin:
            //  optionA: [{name: 'a'}, {name: 'a'}, {..}]
            //  optionB [{..}, {name: 'a'}, {name: 'a'}]
            // Series with the same name between optionA and optionB
            // should be mapped.
            var idNum = 0;
            do {
                keyInfo.id = '\0' + keyInfo.name + '\0' + idNum++;
            }while (idMap.get(keyInfo.id))
        }
        idMap.set(keyInfo.id, item);
    });
}
function keyExistAndEqual(attr, obj1, obj2) {
    var key1 = convertOptionIdName(obj1[attr], null);
    var key2 = convertOptionIdName(obj2[attr], null);
    // See `MappingExistingItem`. `id` and `name` trade string equals to number.
    return key1 != null && key2 != null && key1 === key2;
}
/**
 * @return return null if not exist.
 */ function makeComparableKey(val) {
    if ("TURBOPACK compile-time truthy", 1) {
        if (val == null) {
            throw new Error();
        }
    }
    return convertOptionIdName(val, '');
}
function convertOptionIdName(idOrName, defaultValue) {
    if (idOrName == null) {
        return defaultValue;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"])(idOrName) ? idOrName : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(idOrName) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStringSafe"])(idOrName) ? idOrName + '' : defaultValue;
}
function warnInvalidateIdOrName(idOrName) {
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warn"])('`' + idOrName + '` is invalid id or name. Must be a string or number.');
    }
}
function isValidIdOrName(idOrName) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStringSafe"])(idOrName) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumeric"])(idOrName);
}
function isNameSpecified(componentModel) {
    var name = componentModel.name;
    // Is specified when `indexOf` get -1 or > 0.
    return !!(name && name.indexOf(DUMMY_COMPONENT_NAME_PREFIX));
}
function isComponentIdInternal(cmptOption) {
    return cmptOption && cmptOption.id != null && makeComparableKey(cmptOption.id).indexOf(INTERNAL_COMPONENT_ID_PREFIX) === 0;
}
function makeInternalComponentId(idSuffix) {
    return INTERNAL_COMPONENT_ID_PREFIX + idSuffix;
}
function setComponentTypeToKeyInfo(mappingResult, mainType, componentModelCtor) {
    // Set mainType and complete subType.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(mappingResult, function(item) {
        var newOption = item.newOption;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObject"])(newOption)) {
            item.keyInfo.mainType = mainType;
            item.keyInfo.subType = determineSubType(mainType, newOption, item.existing, componentModelCtor);
        }
    });
}
function determineSubType(mainType, newCmptOption, existComponent, componentModelCtor) {
    var subType = newCmptOption.type ? newCmptOption.type : existComponent ? existComponent.subType : componentModelCtor.determineSubType(mainType, newCmptOption);
    // tooltip, markline, markpoint may always has no subType
    return subType;
}
function compressBatches(batchA, batchB) {
    var mapA = {};
    var mapB = {};
    makeMap(batchA || [], mapA);
    makeMap(batchB || [], mapB, mapA);
    return [
        mapToArray(mapA),
        mapToArray(mapB)
    ];
    //TURBOPACK unreachable
    ;
    function makeMap(sourceBatch, map, otherMap) {
        for(var i = 0, len = sourceBatch.length; i < len; i++){
            var seriesId = convertOptionIdName(sourceBatch[i].seriesId, null);
            if (seriesId == null) {
                return;
            }
            var dataIndices = normalizeToArray(sourceBatch[i].dataIndex);
            var otherDataIndices = otherMap && otherMap[seriesId];
            for(var j = 0, lenj = dataIndices.length; j < lenj; j++){
                var dataIndex = dataIndices[j];
                if (otherDataIndices && otherDataIndices[dataIndex]) {
                    otherDataIndices[dataIndex] = null;
                } else {
                    (map[seriesId] || (map[seriesId] = {}))[dataIndex] = 1;
                }
            }
        }
    }
    function mapToArray(map, isData) {
        var result = [];
        for(var i in map){
            if (map.hasOwnProperty(i) && map[i] != null) {
                if (isData) {
                    result.push(+i);
                } else {
                    var dataIndices = mapToArray(map[i], true);
                    dataIndices.length && result.push({
                        seriesId: i,
                        dataIndex: dataIndices
                    });
                }
            }
        }
        return result;
    }
}
function queryDataIndex(data, payload) {
    if (payload.dataIndexInside != null) {
        return payload.dataIndexInside;
    } else if (payload.dataIndex != null) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(payload.dataIndex) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(payload.dataIndex, function(value) {
            return data.indexOfRawIndex(value);
        }) : data.indexOfRawIndex(payload.dataIndex);
    } else if (payload.name != null) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(payload.name) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"])(payload.name, function(value) {
            return data.indexOfName(value);
        }) : data.indexOfName(payload.name);
    }
}
function makeInner() {
    var key = '__ec_inner_' + innerUniqueIndex++;
    return function(hostObj) {
        return hostObj[key] || (hostObj[key] = {});
    };
}
var innerUniqueIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRandomIdBase"])();
function parseFinder(ecModel, finderInput, opt) {
    var _a = preParseFinder(finderInput, opt), mainTypeSpecified = _a.mainTypeSpecified, queryOptionMap = _a.queryOptionMap, others = _a.others;
    var result = others;
    var defaultMainType = opt ? opt.defaultMainType : null;
    if (!mainTypeSpecified && defaultMainType) {
        queryOptionMap.set(defaultMainType, {});
    }
    queryOptionMap.each(function(queryOption, mainType) {
        var queryResult = queryReferringComponents(ecModel, mainType, queryOption, {
            useDefault: defaultMainType === mainType,
            enableAll: opt && opt.enableAll != null ? opt.enableAll : true,
            enableNone: opt && opt.enableNone != null ? opt.enableNone : true
        });
        result[mainType + 'Models'] = queryResult.models;
        result[mainType + 'Model'] = queryResult.models[0];
    });
    return result;
}
function preParseFinder(finderInput, opt) {
    var finder;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"])(finderInput)) {
        var obj = {};
        obj[finderInput + 'Index'] = 0;
        finder = obj;
    } else {
        finder = finderInput;
    }
    var queryOptionMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHashMap"])();
    var others = {};
    var mainTypeSpecified = false;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(finder, function(value, key) {
        // Exclude 'dataIndex' and other illegal keys.
        if (key === 'dataIndex' || key === 'dataIndexInside') {
            others[key] = value;
            return;
        }
        var parsedKey = key.match(/^(\w+)(Index|Id|Name)$/) || [];
        var mainType = parsedKey[1];
        var queryType = (parsedKey[2] || '').toLowerCase();
        if (!mainType || !queryType || opt && opt.includeMainTypes && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indexOf"])(opt.includeMainTypes, mainType) < 0) {
            return;
        }
        mainTypeSpecified = mainTypeSpecified || !!mainType;
        var queryOption = queryOptionMap.get(mainType) || queryOptionMap.set(mainType, {});
        queryOption[queryType] = value;
    });
    return {
        mainTypeSpecified: mainTypeSpecified,
        queryOptionMap: queryOptionMap,
        others: others
    };
}
var SINGLE_REFERRING = {
    useDefault: true,
    enableAll: false,
    enableNone: false
};
var MULTIPLE_REFERRING = {
    useDefault: false,
    enableAll: true,
    enableNone: true
};
function queryReferringComponents(ecModel, mainType, userOption, opt) {
    opt = opt || SINGLE_REFERRING;
    var indexOption = userOption.index;
    var idOption = userOption.id;
    var nameOption = userOption.name;
    var result = {
        models: null,
        specified: indexOption != null || idOption != null || nameOption != null
    };
    if (!result.specified) {
        // Use the first as default if `useDefault`.
        var firstCmpt = void 0;
        result.models = opt.useDefault && (firstCmpt = ecModel.getComponent(mainType)) ? [
            firstCmpt
        ] : [];
        return result;
    }
    if (indexOption === 'none' || indexOption === false) {
        if (opt.enableNone) {
            result.models = [];
            return result;
        } else {
            // Do not throw; consider if some component previously does not use this method,
            // and start to use it, need to be fault-tolerant for backward compatibility.
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["error"])('`"none"` or `false` is not a valid value on index option.');
            }
            indexOption = -1; // Can not query by index but may still query by id/name if specified.
        }
    }
    // `queryComponents` will return all components if
    // both all of index/id/name are null/undefined.
    if (indexOption === 'all') {
        if (opt.enableAll) {
            indexOption = idOption = nameOption = null;
        } else {
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["error"])('`"all"` is not a valid value on index option.');
            }
            indexOption = -1;
        }
    }
    result.models = ecModel.queryComponents({
        mainType: mainType,
        index: indexOption,
        id: idOption,
        name: nameOption
    });
    return result;
}
function makeQueryConditionKindA(payload, // `mainType` is mandatory to restrict the range of query,
// since `payload` in an user input.
mainType, // subType may be '' by `parseClassType`
subType) {
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])(mainType);
    }
    var query = {};
    query[mainType + 'Id'] = payload[mainType + 'Id'];
    query[mainType + 'Index'] = payload[mainType + 'Index'];
    query[mainType + 'Name'] = payload[mainType + 'Name'];
    var condition = {
        mainType: mainType,
        query: query
    };
    subType && (condition.subType = subType); // subType is determined by `hasOwnProperty`.
    return condition;
}
function setAttribute(dom, key, value) {
    dom.setAttribute ? dom.setAttribute(key, value) : dom[key] = value;
}
function getAttribute(dom, key) {
    return dom.getAttribute ? dom.getAttribute(key) : dom[key];
}
function getTooltipRenderMode(renderModeOption) {
    if (renderModeOption === 'auto') {
        // Using html when `document` exists, use richText otherwise
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$env$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].domSupported ? 'html' : 'richText';
    } else {
        return renderModeOption || 'html';
    }
}
function groupData(array, getKey // return key
) {
    var buckets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHashMap"])();
    var keys = [];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(array, function(item) {
        var key = getKey(item);
        (buckets.get(key) || (keys.push(key), buckets.set(key, []))).push(item);
    });
    return {
        keys: keys,
        buckets: buckets
    };
}
function interpolateRawValues(data, precision, sourceValue, targetValue, percent) {
    var isAutoPrecision = precision == null || precision === 'auto';
    if (targetValue == null) {
        return targetValue;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(targetValue)) {
        var value = interpolateNumber(sourceValue || 0, targetValue, percent);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(value, isAutoPrecision ? Math.max((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrecision"])(sourceValue || 0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrecision"])(targetValue)) : precision);
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"])(targetValue)) {
        return percent < 1 ? sourceValue : targetValue;
    } else {
        var interpolated = [];
        var leftArr = sourceValue;
        var rightArr = targetValue;
        var length_1 = Math.max(leftArr ? leftArr.length : 0, rightArr.length);
        for(var i = 0; i < length_1; ++i){
            var info = data.getDimensionInfo(i);
            // Don't interpolate ordinal dims
            if (info && info.type === 'ordinal') {
                // In init, there is no `sourceValue`, but should better not to get undefined result.
                interpolated[i] = (percent < 1 && leftArr ? leftArr : rightArr)[i];
            } else {
                var leftVal = leftArr && leftArr[i] ? leftArr[i] : 0;
                var rightVal = rightArr[i];
                var value = interpolateNumber(leftVal, rightVal, percent);
                interpolated[i] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(value, isAutoPrecision ? Math.max((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrecision"])(leftVal), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrecision"])(rightVal)) : precision);
            }
        }
        return interpolated;
    }
}
/**
 * Use an iterator to avoid exposing the internal list or duplicating it
 * for the outside traveller, and no extra heap allocation.
 * @usage
 *  for (const it = resetIterator(); it.next();) {
 *      const item = it.item;
 *      const key = it.key;
 *      const itIdx = it.itIdx;
 *      // ...
 *  }
 * @usage
 *  const it = resetIterator();
 *  while (it.next()) { ... }
 * @usage
 *  for (resetIterator(it); it.next();) { ... }
 */ var ListIterator = /** @class */ function() {
    function ListIterator() {}
    /**
   * The loop condition is `idx < end` if `step > 0`;
   * The loop condition is `idx >= end` if `step < 0`.
   *
   * @param end By default `list.length` if `step > 0`; `0` if `step < 0`.
   * @param step By default `1`.
   */ ListIterator.prototype.reset = function(list, start, end, step) {
        this._list = list;
        this._step = step = step || 1;
        this._idx = start;
        this._end = end != null ? end : step > 0 ? list.length : 0;
        this.item = null;
        this.key = NaN;
        return this;
    };
    ListIterator.prototype.next = function() {
        if (this._step > 0 ? this._idx < this._end : this._idx >= this._end) {
            this.item = this._list[this._idx];
            this.key = this._idx = this._idx + this._step;
            return true;
        }
        return false;
    };
    return ListIterator;
}();
;
function clearTmpModel(model) {
    // Clear to avoid memory leak.
    model.option = model.parentModel = model.ecModel = null;
}
function initExtentForUnion() {
    return [
        Infinity,
        -Infinity
    ];
}
function unionExtentFromNumber(extent, val) {
    if (isValidNumberForExtent(val)) {
        val < extent[0] && (extent[0] = val);
        val > extent[1] && (extent[1] = val);
    }
}
function unionExtentStartFromNumber(extent, val) {
    if (isValidNumberForExtent(val) && val < extent[0]) {
        extent[0] = val;
    }
}
function unionExtentEndFromNumber(extent, val) {
    if (isValidNumberForExtent(val) && val > extent[1]) {
        extent[1] = val;
    }
}
function unionExtentFromExtent(tarExtent, srcExtent) {
    // Accept both or neither.
    if (isValidBoundsForExtent(srcExtent[0], srcExtent[1])) {
        srcExtent[0] < tarExtent[0] && (tarExtent[0] = srcExtent[0]);
        srcExtent[1] > tarExtent[1] && (tarExtent[1] = srcExtent[1]);
    }
}
function isValidNumberForExtent(val) {
    // Considered that number could be `NaN` and `Infinity` and should not write into the extent.
    // Note that `Infinity` is the initialized value from `initExtentForUnion` and may be inputted.
    return val != null && isFinite(val);
}
function isValidBoundsForExtent(start, end) {
    return isValidNumberForExtent(start) && isValidNumberForExtent(end) && start <= end;
}
function extentHasValue(extent) {
    // Also considered extent may have `NaN` and `Infinity`.
    var span = extent[1] - extent[0];
    return isFinite(span) && span >= 0;
}
function ensureExtentAscSimply(extent) {
    if (isValidBoundsForExtent(extent[0], extent[1]) && extent[0] > extent[1]) {
        extent[0] = extent[1];
    }
}
function makeCallOnlyOnce() {
    var hiddenKey = '__ec_once_' + onceUniqueIndex++;
    return function(hostObj, cb) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])(hostObj);
        }
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(hostObj, hiddenKey)) {
            hostObj[hiddenKey] = 1;
            cb();
        }
    };
}
var onceUniqueIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRandomIdBase"])();
function removeDuplicates(arr, getKey, // `existingCount`: the count before this item is added.
resolve) {
    var dupMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHashMap"])();
    var writeIdx = 0;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(arr, function(item) {
        var key = getKey(item);
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"])(key));
        }
        var count = dupMap.get(key) || 0;
        if (resolve) {
            resolve(item, count);
        }
        if (!count && !resolve) {
            arr[writeIdx++] = item;
        }
        dupMap.set(key, count + 1);
    });
    if (!resolve) {
        arr.length = writeIdx;
    }
}
function removeDuplicatesGetKeyFromValueProp(item) {
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])(item.value != null);
    }
    return item.value + '';
}
function removeDuplicatesGetKeyFromItemItself(item) {
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])(item != null);
    }
    return item + '';
}
function getIncrementalId(seriesModel, useIncremental) {
    // 0 means disable incremental.
    // 1 is preserved for backward compatibility.
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["retrieve2"])(useIncremental, true) ? seriesModel.seriesIndex + 2 : 0;
}
function preparePipelineContext(seriesModel, view, pipeline) {
    var dataLen = seriesModel.getData().count();
    return {
        progressiveRender: pipeline.progressiveEnabled && view.incrementalPrepareRender && dataLen >= pipeline.threshold,
        large: seriesModel.get('large') && dataLen >= seriesModel.get('largeThreshold'),
        // TODO: modDataCount should not updated if `appendData`, otherwise cause whole repaint.
        // see `test/candlestick-large3.html`
        modDataCount: seriesModel.get('progressiveChunkMode') === 'mod' ? seriesModel.getData().count() : null
    };
}
function validateUpstreamOutputRange(// null/undefined is not allowed, otherwise bug-prone.
upstreamOutputRange, thisTaskPlannedRange) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])(upstreamOutputRange.start === thisTaskPlannedRange.start && upstreamOutputRange.end === thisTaskPlannedRange.end);
}
function createSimpleOverallStageHandler(seriesType, overallReset) {
    return {
        seriesType: seriesType,
        overallReset: overallReset
    };
}
function createSimpleOverallStageHandler2(overallReset) {
    return {
        overallReset: overallReset
    };
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_PRECISION_FOR_ROUNDING_ERROR",
    ()=>DEFAULT_PRECISION_FOR_ROUNDING_ERROR,
    "MAX_SAFE_INTEGER",
    ()=>MAX_SAFE_INTEGER,
    "NICE_MODE_MIN",
    ()=>NICE_MODE_MIN,
    "NICE_MODE_ROUND",
    ()=>NICE_MODE_ROUND,
    "addSafe",
    ()=>addSafe,
    "asc",
    ()=>asc,
    "getAcceptableTickPrecision",
    ()=>getAcceptableTickPrecision,
    "getGreatestCommonDividor",
    ()=>getGreatestCommonDividor,
    "getLeastCommonMultiple",
    ()=>getLeastCommonMultiple,
    "getPercentSeats",
    ()=>getPercentSeats,
    "getPercentWithPrecision",
    ()=>getPercentWithPrecision,
    "getPixelPrecision",
    ()=>getPixelPrecision,
    "getPrecision",
    ()=>getPrecision,
    "getPrecisionSafe",
    ()=>getPrecisionSafe,
    "getRandomIdBase",
    ()=>getRandomIdBase,
    "isNullableNumberFinite",
    ()=>isNullableNumberFinite,
    "isNumeric",
    ()=>isNumeric,
    "isPositionSizeOptionPercent",
    ()=>isPositionSizeOptionPercent,
    "isRadianAroundZero",
    ()=>isRadianAroundZero,
    "linearMap",
    ()=>linearMap,
    "mathAbs",
    ()=>mathAbs,
    "mathCeil",
    ()=>mathCeil,
    "mathFloor",
    ()=>mathFloor,
    "mathLN10",
    ()=>mathLN10,
    "mathLog",
    ()=>mathLog,
    "mathMax",
    ()=>mathMax,
    "mathMin",
    ()=>mathMin,
    "mathPI",
    ()=>mathPI,
    "mathPow",
    ()=>mathPow,
    "mathRandom",
    ()=>mathRandom,
    "mathRound",
    ()=>mathRound,
    "nice",
    ()=>nice,
    "numericToNumber",
    ()=>numericToNumber,
    "parseDate",
    ()=>parseDate,
    "parsePercent",
    ()=>parsePercent,
    "parsePositionOption",
    ()=>parsePositionOption,
    "parsePositionSizeOption",
    ()=>parsePositionSizeOption,
    "quantile",
    ()=>quantile,
    "quantity",
    ()=>quantity,
    "quantityExponent",
    ()=>quantityExponent,
    "reformIntervals",
    ()=>reformIntervals,
    "remRadian",
    ()=>remRadian,
    "round",
    ()=>round,
    "roundLegacy",
    ()=>roundLegacy
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
*/ /*
* A third-party license is embedded for some of the code in this file:
* The method "quantile" was copied from "d3.js".
* (See more details in the comment of the method below.)
* The use of the source code of this file is also subject to the terms
* and consitions of the license of "d3.js" (BSD-3Clause, see
* </licenses/LICENSE-d3>).
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
;
var RADIAN_EPSILON = 1e-4;
// A `RangeError` may be thrown if `n` is out of this range when calling `toFixed(n)`.
// Although Chrome and ES2017+ have enlarged this number to 100, but we sill follow
// the ES3~ES6 spec (0 <= n <= 20) for backward and cross-platform compatibility.
var TO_FIXED_SUPPORTED_PRECISION_MAX = 20;
var DEFAULT_PRECISION_FOR_ROUNDING_ERROR = 14;
function _trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}
var mathMin = Math.min;
var mathMax = Math.max;
var mathAbs = Math.abs;
var mathRound = Math.round;
var mathFloor = Math.floor;
var mathCeil = Math.ceil;
var mathPow = Math.pow;
var mathLog = Math.log;
var mathLN10 = Math.LN10;
var mathPI = Math.PI;
var mathRandom = Math.random;
function linearMap(val, domain, range, clamp) {
    var d0 = domain[0];
    var d1 = domain[1];
    var r0 = range[0];
    var r1 = range[1];
    var subDomain = d1 - d0;
    var subRange = r1 - r0;
    if (subDomain === 0) {
        return subRange === 0 ? r0 : (r0 + r1) / 2;
    }
    // Avoid accuracy problem in edge, such as
    // 146.39 - 62.83 === 83.55999999999999.
    // See echarts/test/ut/spec/util/number.js#linearMap#accuracyError
    // It is a little verbose for efficiency considering this method
    // is a hotspot.
    if (clamp) {
        if (subDomain > 0) {
            if (val <= d0) {
                return r0;
            } else if (val >= d1) {
                return r1;
            }
        } else {
            if (val >= d0) {
                return r0;
            } else if (val <= d1) {
                return r1;
            }
        }
    } else {
        if (val === d0) {
            return r0;
        }
        if (val === d1) {
            return r1;
        }
    }
    return (val - d0) / subDomain * subRange + r0;
}
var parsePercent = parsePositionOption;
function parsePositionOption(option, percentBase, percentOffset) {
    switch(option){
        case 'center':
        case 'middle':
            option = '50%';
            break;
        case 'left':
        case 'top':
            option = '0%';
            break;
        case 'right':
        case 'bottom':
            option = '100%';
            break;
    }
    return parsePositionSizeOption(option, percentBase, percentOffset);
}
function parsePositionSizeOption(option, percentBase, // Typical usage of `percentOffset`: percent value is based on an specific rect rather than canvas viewport:
//  `parsePercent(percentOrAbsoluteLeft, rect.width, rect.x)`
percentOffset) {
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"](option)) {
        if (isOptionStringPercent(option)) {
            return parseFloat(option) / 100 * percentBase + (percentOffset || 0);
        }
        return parseFloat(option);
    }
    // Allow flexible input due to backward compatibility.
    return option == null ? NaN : +option;
}
function isPositionSizeOptionPercent(option) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"](option) && isOptionStringPercent(option);
}
function isOptionStringPercent(option) {
    return !!_trim(option).match(/%$/);
}
function round(x, precision, returnStr) {
    if ("TURBOPACK compile-time truthy", 1) {
        // NOTICE: We should not provided a default precision, since there is no universally adaptable
        // precision. The caller need to input a precision according to the scenarios.
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"](precision != null);
    }
    if (isNaN(precision)) {
        // precision utils (such as getAcceptableTickPrecision) may return NaN.
        return returnStr ? '' + x : +x;
    }
    // Avoid range error
    precision = mathMin(mathMax(0, precision), TO_FIXED_SUPPORTED_PRECISION_MAX);
    // PENDING: 1.005.toFixed(2) is '1.00' rather than '1.01'
    x = (+x).toFixed(precision);
    return returnStr ? x : +x;
}
function roundLegacy(x, precision, returnStr) {
    if (precision == null) {
        precision = 10;
    }
    return round(x, precision, returnStr);
}
function asc(arr) {
    arr.sort(function(a, b) {
        return a - b;
    });
    return arr;
}
function getPrecision(val) {
    val = +val;
    if (isNaN(val)) {
        return 0;
    }
    // It is much faster than methods converting number to string as follows
    //      let tmp = val.toString();
    //      return tmp.length - 1 - tmp.indexOf('.');
    // especially when precision is low
    // Notice:
    // (1) If the loop count is over about 20, it is slower than `getPrecisionSafe`.
    //     (see https://jsbench.me/2vkpcekkvw/1)
    // (2) If the val is less than for example 1e-15, the result may be incorrect.
    //     (see test/ut/spec/util/number.test.ts `getPrecision_equal_random`)
    if (val > 1e-14) {
        var e = 1;
        for(var i = 0; i < 15; i++, e *= 10){
            if (mathRound(val * e) / e === val) {
                return i;
            }
        }
    }
    return getPrecisionSafe(val);
}
function getPrecisionSafe(val) {
    // toLowerCase for: '3.4E-12'
    var str = val.toString().toLowerCase();
    // Consider scientific notation: '3.4e-12' '3.4e+12'
    var eIndex = str.indexOf('e');
    var exp = eIndex > 0 ? +str.slice(eIndex + 1) : 0;
    var significandPartLen = eIndex > 0 ? eIndex : str.length;
    var dotIndex = str.indexOf('.');
    var decimalPartLen = dotIndex < 0 ? 0 : significandPartLen - 1 - dotIndex;
    return mathMax(0, decimalPartLen - exp);
}
function getPixelPrecision(dataExtent, pixelExtent) {
    var dataQuantity = mathFloor(mathLog(dataExtent[1] - dataExtent[0]) / mathLN10);
    var sizeQuantity = mathRound(mathLog(mathAbs(pixelExtent[1] - pixelExtent[0])) / mathLN10);
    // toFixed() digits argument must be between 0 and 20.
    var precision = mathMin(mathMax(-dataQuantity + sizeQuantity, 0), TO_FIXED_SUPPORTED_PRECISION_MAX);
    return !isFinite(precision) ? TO_FIXED_SUPPORTED_PRECISION_MAX : precision;
}
function getAcceptableTickPrecision(dataExtent, // Typically, `Math.abs(pixelExtent[1] - pixelExtent[0])`.
pxSpan, // By default, `1`.
pxDiffAcceptable) {
    var dataSpan = mathAbs(dataExtent[1] - dataExtent[0]);
    if (!isFinite(dataSpan) || dataSpan === 0) {
        return NaN;
    }
    // Formula for choosing an acceptable precision:
    //  Let `pxDiff = abs(dataSpan - round(dataSpan, precision))`.
    //  We require `pxDiff <= dataSpan * pxDiffAcceptable / pxSpan`.
    //  Consider the nature of "round", the max `pxDiff` is: `pow(10, -precision) / 2`,
    //  Hence: `pow(10, -precision) / 2 <= dataSpan * pxDiffAcceptable / pxSpan`
    //  Hence: `precision >= -log10(2 * dataSpan * pxDiffAcceptable / pxSpan)`
    var dataExp2 = mathLog(2 * mathAbs(pxDiffAcceptable || 1) * mathAbs(dataSpan)) / mathLN10;
    var pxExp = mathLog(mathAbs(pxSpan)) / mathLN10;
    // PENDING: Rounding error generally does not matter; do not fix it before `Math.ceil`
    // until bad case occur.
    var precision = mathMax(0, mathCeil(-dataExp2 + pxExp));
    if (!isFinite(precision)) {
        // If dataSpan is near `0`, the result should not be too big or even `Infinity`.
        precision = NaN;
    }
    return precision;
}
function getPercentWithPrecision(valueList, idx, precision) {
    if (!valueList[idx]) {
        return 0;
    }
    var seats = getPercentSeats(valueList, precision);
    return seats[idx] || 0;
}
function getPercentSeats(valueList, precision) {
    var sum = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reduce"](valueList, function(acc, val) {
        return acc + (isNaN(val) ? 0 : val);
    }, 0);
    if (sum === 0) {
        return [];
    }
    var digits = mathPow(10, precision);
    var votesPerQuota = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"](valueList, function(val) {
        return (isNaN(val) ? 0 : val) / sum * digits * 100;
    });
    var targetSeats = digits * 100;
    var seats = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"](votesPerQuota, function(votes) {
        // Assign automatic seats.
        return mathFloor(votes);
    });
    var currentSum = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reduce"](seats, function(acc, val) {
        return acc + val;
    }, 0);
    var remainder = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"](votesPerQuota, function(votes, idx) {
        return votes - seats[idx];
    });
    // Has remainding votes.
    while(currentSum < targetSeats){
        // Find next largest remainder.
        var max = Number.NEGATIVE_INFINITY;
        var maxId = null;
        for(var i = 0, len = remainder.length; i < len; ++i){
            if (remainder[i] > max) {
                max = remainder[i];
                maxId = i;
            }
        }
        // Add a vote to max remainder.
        ++seats[maxId];
        remainder[maxId] = 0;
        ++currentSum;
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["map"](seats, function(seat) {
        return seat / digits;
    });
}
function addSafe(val0, val1) {
    var maxPrecision = mathMax(getPrecision(val0), getPrecision(val1));
    // const multiplier = Math.pow(10, maxPrecision);
    // return (mathRound(val0 * multiplier) + mathRound(val1 * multiplier)) / multiplier;
    var sum = val0 + val1;
    // // PENDING: support more?
    return maxPrecision > TO_FIXED_SUPPORTED_PRECISION_MAX ? sum : round(sum, maxPrecision);
}
var MAX_SAFE_INTEGER = mathPow(2, 53) - 1;
function remRadian(radian) {
    var pi2 = mathPI * 2;
    return (radian % pi2 + pi2) % pi2;
}
function isRadianAroundZero(val) {
    return val > -RADIAN_EPSILON && val < RADIAN_EPSILON;
}
// eslint-disable-next-line
var TIME_REG = /^(?:(\d{4})(?:[-\/](\d{1,2})(?:[-\/](\d{1,2})(?:[T ](\d{1,2})(?::(\d{1,2})(?::(\d{1,2})(?:[.,](\d+))?)?)?(Z|[\+\-]\d\d:?\d\d)?)?)?)?)?$/; // jshint ignore:line
function parseDate(value) {
    if (value instanceof Date) {
        return value;
    } else if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"](value)) {
        // Different browsers parse date in different way, so we parse it manually.
        // Some other issues:
        // new Date('1970-01-01') is UTC,
        // new Date('1970/01/01') and new Date('1970-1-01') is local.
        // See issue #3623
        var match = TIME_REG.exec(value);
        if (!match) {
            // return Invalid Date.
            return new Date(NaN);
        }
        // Use local time when no timezone offset is specified.
        if (!match[8]) {
            // match[n] can only be string or undefined.
            // But take care of '12' + 1 => '121'.
            return new Date(+match[1], +(match[2] || 1) - 1, +match[3] || 1, +match[4] || 0, +(match[5] || 0), +match[6] || 0, match[7] ? +match[7].substring(0, 3) : 0);
        } else {
            var hour = +match[4] || 0;
            if (match[8].toUpperCase() !== 'Z') {
                hour -= +match[8].slice(0, 3);
            }
            return new Date(Date.UTC(+match[1], +(match[2] || 1) - 1, +match[3] || 1, hour, +(match[5] || 0), +match[6] || 0, match[7] ? +match[7].substring(0, 3) : 0));
        }
    } else if (value == null) {
        return new Date(NaN);
    }
    return new Date(mathRound(value));
}
function quantity(val) {
    return mathPow(10, quantityExponent(val));
}
function quantityExponent(val) {
    if (val === 0) {
        // PENDING: like IEEE754 use exponent `0` in this case.
        // but methematically, exponent of zero is `-Infinity`.
        return 0;
    }
    var exp = mathFloor(mathLog(val) / mathLN10);
    /**
   * exp is expected to be the rounded-down result of the base-10 log of val.
   * But due to the precision loss with Math.log(val), we need to restore it
   * using 10^exp to make sure we can get val back from exp. #11249
   */ if (val / mathPow(10, exp) >= 10) {
        exp++;
    }
    return exp;
}
var NICE_MODE_ROUND = 1;
var NICE_MODE_MIN = 2;
function nice(val, // All non-`NICE_MODE_MIN`-truthy values means `NICE_MODE_ROUND`, for backward compatibility.
mode) {
    // Consider the scientific notation of `val`:
    //  - `exponent` is its exponent.
    //  - `f` is its coefficient. `1 <= f < 10`.
    //  e.g., if `val` is `0.0054321`, `exponent` is `-3`, `f` is `5.4321`,
    //      The result is `0.005` on NICE_MODE_ROUND.
    //  e.g., if `val` is `987.12345`, `exponent` is `2`, `f` is `9.8712345`,
    //      The result is `1000` on NICE_MODE_ROUND.
    //  e.g., if `val` is `0`,
    //      The result is `1`.
    var exponent = quantityExponent(val);
    // No rounding error in Math.pow(10, integer).
    var exp10 = mathPow(10, exponent);
    var f = val / exp10;
    var nf;
    if (mode === NICE_MODE_MIN) {
        nf = 1;
    } else if (mode) {
        if (f < 1.5) {
            nf = 1;
        } else if (f < 2.5) {
            nf = 2;
        } else if (f < 4) {
            nf = 3;
        } else if (f < 7) {
            nf = 5;
        } else {
            nf = 10;
        }
    } else {
        if (f < 1) {
            nf = 1;
        } else if (f < 2) {
            nf = 2;
        } else if (f < 3) {
            nf = 3;
        } else if (f < 5) {
            nf = 5;
        } else {
            nf = 10;
        }
    }
    val = nf * exp10;
    // Fix IEEE 754 float rounding error
    return round(val, -exponent);
}
function quantile(ascArr, p) {
    var H = (ascArr.length - 1) * p + 1;
    var h = mathFloor(H);
    var v = +ascArr[h - 1];
    var e = H - h;
    return e ? v + e * (ascArr[h] - v) : v;
}
function reformIntervals(list) {
    list.sort(function(a, b) {
        return littleThan(a, b, 0) ? -1 : 1;
    });
    var curr = -Infinity;
    var currClose = 1;
    for(var i = 0; i < list.length;){
        var interval = list[i].interval;
        var close_1 = list[i].close;
        for(var lg = 0; lg < 2; lg++){
            if (interval[lg] <= curr) {
                interval[lg] = curr;
                close_1[lg] = !lg ? 1 - currClose : 1;
            }
            curr = interval[lg];
            currClose = close_1[lg];
        }
        if (interval[0] === interval[1] && close_1[0] * close_1[1] !== 1) {
            list.splice(i, 1);
        } else {
            i++;
        }
    }
    return list;
    //TURBOPACK unreachable
    ;
    function littleThan(a, b, lg) {
        return a.interval[lg] < b.interval[lg] || a.interval[lg] === b.interval[lg] && (a.close[lg] - b.close[lg] === (!lg ? 1 : -1) || !lg && littleThan(a, b, 1));
    }
}
function numericToNumber(val) {
    var valFloat = parseFloat(val);
    return valFloat == val // eslint-disable-line eqeqeq
     && (valFloat !== 0 || !__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"](val) || val.indexOf('x') <= 0) // For case ' 0x0 '.
     ? valFloat : NaN;
}
function isNumeric(val) {
    return !isNaN(numericToNumber(val));
}
function getRandomIdBase() {
    return mathRound(mathRandom() * 9);
}
function getGreatestCommonDividor(a, b) {
    if (b === 0) {
        return a;
    }
    return getGreatestCommonDividor(b, a % b);
}
function getLeastCommonMultiple(a, b) {
    if (a == null) {
        return b;
    }
    if (b == null) {
        return a;
    }
    return a * b / getGreatestCommonDividor(a, b);
}
function isNullableNumberFinite(val) {
    return val != null && isFinite(val);
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/shape/sausage.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
;
;
/**
 * Sausage: similar to sector, but have half circle on both sides
 */ var SausageShape = /** @class */ function() {
    function SausageShape() {
        this.cx = 0;
        this.cy = 0;
        this.r0 = 0;
        this.r = 0;
        this.startAngle = 0;
        this.endAngle = Math.PI * 2;
        this.clockwise = true;
    }
    return SausageShape;
}();
var SausagePath = /** @class */ function(_super) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$3$2e$0$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__extends"])(SausagePath, _super);
    function SausagePath(opts) {
        var _this = _super.call(this, opts) || this;
        _this.type = 'sausage';
        return _this;
    }
    SausagePath.prototype.getDefaultShape = function() {
        return new SausageShape();
    };
    SausagePath.prototype.buildPath = function(ctx, shape) {
        var cx = shape.cx;
        var cy = shape.cy;
        var r0 = Math.max(shape.r0 || 0, 0);
        var r = Math.max(shape.r, 0);
        var dr = (r - r0) * 0.5;
        var rCenter = r0 + dr;
        var startAngle = shape.startAngle;
        var endAngle = shape.endAngle;
        var clockwise = shape.clockwise;
        var PI2 = Math.PI * 2;
        var lessThanCircle = clockwise ? endAngle - startAngle < PI2 : startAngle - endAngle < PI2;
        if (!lessThanCircle) {
            // Normalize angles
            startAngle = endAngle - (clockwise ? PI2 : -PI2);
        }
        var unitStartX = Math.cos(startAngle);
        var unitStartY = Math.sin(startAngle);
        var unitEndX = Math.cos(endAngle);
        var unitEndY = Math.sin(endAngle);
        if (lessThanCircle) {
            ctx.moveTo(unitStartX * r0 + cx, unitStartY * r0 + cy);
            ctx.arc(unitStartX * rCenter + cx, unitStartY * rCenter + cy, dr, -Math.PI + startAngle, startAngle, !clockwise);
        } else {
            ctx.moveTo(unitStartX * r + cx, unitStartY * r + cy);
        }
        ctx.arc(cx, cy, r, startAngle, endAngle, !clockwise);
        ctx.arc(unitEndX * rCenter + cx, unitEndY * rCenter + cy, dr, endAngle - Math.PI * 2, endAngle - Math.PI, !clockwise);
        if (r0 !== 0) {
            ctx.arc(cx, cy, r0, endAngle, startAngle, clockwise);
        }
    // ctx.closePath();
    };
    return SausagePath;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Path$3e$__["Path"]);
const __TURBOPACK__default__export__ = SausagePath;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/states.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DISPLAY_STATES",
    ()=>DISPLAY_STATES,
    "DOWNPLAY_ACTION_TYPE",
    ()=>DOWNPLAY_ACTION_TYPE,
    "HIGHLIGHT_ACTION_TYPE",
    ()=>HIGHLIGHT_ACTION_TYPE,
    "HOVER_STATE_BLUR",
    ()=>HOVER_STATE_BLUR,
    "HOVER_STATE_EMPHASIS",
    ()=>HOVER_STATE_EMPHASIS,
    "HOVER_STATE_NORMAL",
    ()=>HOVER_STATE_NORMAL,
    "SELECT_ACTION_TYPE",
    ()=>SELECT_ACTION_TYPE,
    "SELECT_CHANGED_EVENT_TYPE",
    ()=>SELECT_CHANGED_EVENT_TYPE,
    "SPECIAL_STATES",
    ()=>SPECIAL_STATES,
    "TOGGLE_SELECT_ACTION_TYPE",
    ()=>TOGGLE_SELECT_ACTION_TYPE,
    "UNSELECT_ACTION_TYPE",
    ()=>UNSELECT_ACTION_TYPE,
    "Z2_EMPHASIS_LIFT",
    ()=>Z2_EMPHASIS_LIFT,
    "Z2_SELECT_LIFT",
    ()=>Z2_SELECT_LIFT,
    "allLeaveBlur",
    ()=>allLeaveBlur,
    "blurComponent",
    ()=>blurComponent,
    "blurSeries",
    ()=>blurSeries,
    "blurSeriesFromHighlightPayload",
    ()=>blurSeriesFromHighlightPayload,
    "clearStates",
    ()=>clearStates,
    "disableHoverEmphasis",
    ()=>disableHoverEmphasis,
    "enableComponentHighDownFeatures",
    ()=>enableComponentHighDownFeatures,
    "enableHoverEmphasis",
    ()=>enableHoverEmphasis,
    "enableHoverFocus",
    ()=>enableHoverFocus,
    "enterBlur",
    ()=>enterBlur,
    "enterEmphasis",
    ()=>enterEmphasis,
    "enterEmphasisWhenMouseOver",
    ()=>enterEmphasisWhenMouseOver,
    "enterSelect",
    ()=>enterSelect,
    "findComponentHighDownDispatchers",
    ()=>findComponentHighDownDispatchers,
    "getAllSelectedIndices",
    ()=>getAllSelectedIndices,
    "getHighlightDigit",
    ()=>getHighlightDigit,
    "handleGlobalMouseOutForHighDown",
    ()=>handleGlobalMouseOutForHighDown,
    "handleGlobalMouseOverForHighDown",
    ()=>handleGlobalMouseOverForHighDown,
    "isHighDownDispatcher",
    ()=>isHighDownDispatcher,
    "isHighDownPayload",
    ()=>isHighDownPayload,
    "isSelectChangePayload",
    ()=>isSelectChangePayload,
    "leaveBlur",
    ()=>leaveBlur,
    "leaveEmphasis",
    ()=>leaveEmphasis,
    "leaveEmphasisWhenMouseOut",
    ()=>leaveEmphasisWhenMouseOut,
    "leaveSelect",
    ()=>leaveSelect,
    "savePathStates",
    ()=>savePathStates,
    "setAsHighDownDispatcher",
    ()=>setAsHighDownDispatcher,
    "setDefaultStateProxy",
    ()=>setDefaultStateProxy,
    "setStatesFlag",
    ()=>setStatesFlag,
    "setStatesStylesFromModel",
    ()=>setStatesStylesFromModel,
    "toggleHoverEmphasis",
    ()=>toggleHoverEmphasis,
    "toggleSelectionFromPayload",
    ()=>toggleSelectionFromPayload,
    "updateSeriesElementSelection",
    ()=>updateSeriesElementSelection
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/innerStore.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/tool/color.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Path.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$ExtensionAPI$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/ExtensionAPI.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
// Reserve 0 as default.
var _highlightNextDigit = 1;
var _highlightKeyMap = {};
var getSavedStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeInner"])();
var getComponentStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeInner"])();
var HOVER_STATE_NORMAL = 0;
var HOVER_STATE_BLUR = 1;
var HOVER_STATE_EMPHASIS = 2;
var SPECIAL_STATES = [
    'emphasis',
    'blur',
    'select'
];
var DISPLAY_STATES = [
    'normal',
    'emphasis',
    'blur',
    'select'
];
var Z2_EMPHASIS_LIFT = 10;
var Z2_SELECT_LIFT = 9;
var HIGHLIGHT_ACTION_TYPE = 'highlight';
var DOWNPLAY_ACTION_TYPE = 'downplay';
var SELECT_ACTION_TYPE = 'select';
var UNSELECT_ACTION_TYPE = 'unselect';
var TOGGLE_SELECT_ACTION_TYPE = 'toggleSelect';
var SELECT_CHANGED_EVENT_TYPE = 'selectchanged';
function hasFillOrStroke(fillOrStroke) {
    return fillOrStroke != null && fillOrStroke !== 'none';
}
function doChangeHoverState(el, stateName, hoverStateEnum) {
    if (el.onHoverStateChange && (el.hoverState || 0) !== hoverStateEnum) {
        el.onHoverStateChange(stateName);
    }
    el.hoverState = hoverStateEnum;
}
function singleEnterEmphasis(el) {
    // Only mark the flag.
    // States will be applied in the echarts.ts in next frame.
    doChangeHoverState(el, 'emphasis', HOVER_STATE_EMPHASIS);
}
function singleLeaveEmphasis(el) {
    // Only mark the flag.
    // States will be applied in the echarts.ts in next frame.
    if (el.hoverState === HOVER_STATE_EMPHASIS) {
        doChangeHoverState(el, 'normal', HOVER_STATE_NORMAL);
    }
}
function singleEnterBlur(el) {
    doChangeHoverState(el, 'blur', HOVER_STATE_BLUR);
}
function singleLeaveBlur(el) {
    if (el.hoverState === HOVER_STATE_BLUR) {
        doChangeHoverState(el, 'normal', HOVER_STATE_NORMAL);
    }
}
function singleEnterSelect(el) {
    el.selected = true;
}
function singleLeaveSelect(el) {
    el.selected = false;
}
function updateElementState(el, updater, commonParam) {
    updater(el, commonParam);
}
function traverseUpdateState(el, updater, commonParam) {
    updateElementState(el, updater, commonParam);
    el.isGroup && el.traverse(function(child) {
        updateElementState(child, updater, commonParam);
    });
}
function setStatesFlag(el, stateName) {
    switch(stateName){
        case 'emphasis':
            el.hoverState = HOVER_STATE_EMPHASIS;
            break;
        case 'normal':
            el.hoverState = HOVER_STATE_NORMAL;
            break;
        case 'blur':
            el.hoverState = HOVER_STATE_BLUR;
            break;
        case 'select':
            el.selected = true;
    }
}
function clearStates(el) {
    if (el.isGroup) {
        el.traverse(function(child) {
            child.clearStates();
        });
    } else {
        el.clearStates();
    }
}
function getFromStateStyle(el, props, toStateName, defaultValue) {
    var style = el.style;
    var fromState = {};
    for(var i = 0; i < props.length; i++){
        var propName = props[i];
        var val = style[propName];
        fromState[propName] = val == null ? defaultValue && defaultValue[propName] : val;
    }
    for(var i = 0; i < el.animators.length; i++){
        var animator = el.animators[i];
        if (animator.__fromStateTransition && animator.__fromStateTransition.indexOf(toStateName) < 0 && animator.targetName === 'style') {
            animator.saveTo(fromState, props);
        }
    }
    return fromState;
}
function createEmphasisDefaultState(el, stateName, targetStates, state) {
    var hasSelect = targetStates && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indexOf"])(targetStates, 'select') >= 0;
    var cloned = false;
    if (el instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]) {
        var store = getSavedStates(el);
        var fromFill = hasSelect ? store.selectFill || store.normalFill : store.normalFill;
        var fromStroke = hasSelect ? store.selectStroke || store.normalStroke : store.normalStroke;
        if (hasFillOrStroke(fromFill) || hasFillOrStroke(fromStroke)) {
            state = state || {};
            var emphasisStyle = state.style || {};
            // inherit case
            if (emphasisStyle.fill === 'inherit') {
                cloned = true;
                state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])({}, state);
                emphasisStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])({}, emphasisStyle);
                emphasisStyle.fill = fromFill;
            } else if (!hasFillOrStroke(emphasisStyle.fill) && hasFillOrStroke(fromFill)) {
                cloned = true;
                // Not modify the original value.
                state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])({}, state);
                emphasisStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])({}, emphasisStyle);
                // Already being applied 'emphasis'. DON'T lift color multiple times.
                emphasisStyle.fill = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liftColor"])(fromFill);
            } else if (!hasFillOrStroke(emphasisStyle.stroke) && hasFillOrStroke(fromStroke)) {
                if (!cloned) {
                    state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])({}, state);
                    emphasisStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])({}, emphasisStyle);
                }
                emphasisStyle.stroke = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$color$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liftColor"])(fromStroke);
            }
            state.style = emphasisStyle;
        }
    }
    if (state) {
        // TODO Share with textContent?
        if (state.z2 == null) {
            if (!cloned) {
                state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])({}, state);
            }
            var z2EmphasisLift = el.z2EmphasisLift;
            state.z2 = el.z2 + (z2EmphasisLift != null ? z2EmphasisLift : Z2_EMPHASIS_LIFT);
        }
    }
    return state;
}
function createSelectDefaultState(el, stateName, state) {
    // const hasSelect = indexOf(el.currentStates, stateName) >= 0;
    if (state) {
        // TODO Share with textContent?
        if (state.z2 == null) {
            state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])({}, state);
            var z2SelectLift = el.z2SelectLift;
            state.z2 = el.z2 + (z2SelectLift != null ? z2SelectLift : Z2_SELECT_LIFT);
        }
    }
    return state;
}
function createBlurDefaultState(el, stateName, state) {
    var hasBlur = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["indexOf"])(el.currentStates, stateName) >= 0;
    var currentOpacity = el.style.opacity;
    var fromState = !hasBlur ? getFromStateStyle(el, [
        'opacity'
    ], stateName, {
        opacity: 1
    }) : null;
    state = state || {};
    var blurStyle = state.style || {};
    if (blurStyle.opacity == null) {
        // clone state
        state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])({}, state);
        blurStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extend"])({
            // Already being applied 'emphasis'. DON'T mul opacity multiple times.
            opacity: hasBlur ? currentOpacity : fromState.opacity * 0.1
        }, blurStyle);
        state.style = blurStyle;
    }
    return state;
}
function elementStateProxy(stateName, targetStates) {
    var state = this.states[stateName];
    if (this.style) {
        if (stateName === 'emphasis') {
            return createEmphasisDefaultState(this, stateName, targetStates, state);
        } else if (stateName === 'blur') {
            return createBlurDefaultState(this, stateName, state);
        } else if (stateName === 'select') {
            return createSelectDefaultState(this, stateName, state);
        }
    }
    return state;
}
function setDefaultStateProxy(el) {
    el.stateProxy = elementStateProxy;
    var textContent = el.getTextContent();
    var textGuide = el.getTextGuideLine();
    if (textContent) {
        textContent.stateProxy = elementStateProxy;
    }
    if (textGuide) {
        textGuide.stateProxy = elementStateProxy;
    }
}
function enterEmphasisWhenMouseOver(el, e) {
    !shouldSilent(el, e) && !el.__highByOuter && traverseUpdateState(el, singleEnterEmphasis);
}
function leaveEmphasisWhenMouseOut(el, e) {
    !shouldSilent(el, e) && !el.__highByOuter && traverseUpdateState(el, singleLeaveEmphasis);
}
function enterEmphasis(el, highlightDigit) {
    el.__highByOuter |= 1 << (highlightDigit || 0);
    traverseUpdateState(el, singleEnterEmphasis);
}
function leaveEmphasis(el, highlightDigit) {
    !(el.__highByOuter &= ~(1 << (highlightDigit || 0))) && traverseUpdateState(el, singleLeaveEmphasis);
}
function enterBlur(el) {
    traverseUpdateState(el, singleEnterBlur);
}
function leaveBlur(el) {
    traverseUpdateState(el, singleLeaveBlur);
}
function enterSelect(el) {
    traverseUpdateState(el, singleEnterSelect);
}
function leaveSelect(el) {
    traverseUpdateState(el, singleLeaveSelect);
}
function shouldSilent(el, e) {
    return el.__highDownSilentOnTouch && e.zrByTouch;
}
function allLeaveBlur(api) {
    var model = api.getModel();
    var leaveBlurredSeries = [];
    var allComponentViews = [];
    model.eachComponent(function(componentType, componentModel) {
        var componentStates = getComponentStates(componentModel);
        var view = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$ExtensionAPI$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getViewOfComponentOrSeries"])(api, componentModel);
        var isSeries = componentType === 'series';
        !isSeries && allComponentViews.push(view);
        if (componentStates.isBlured) {
            // Leave blur anyway
            view.group.traverse(function(child) {
                singleLeaveBlur(child);
            });
            isSeries && leaveBlurredSeries.push(componentModel);
        }
        componentStates.isBlured = false;
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(allComponentViews, function(view) {
        if (view && view.toggleBlurSeries) {
            view.toggleBlurSeries(leaveBlurredSeries, false, model);
        }
    });
}
function blurSeries(targetSeriesIndex, focus, blurScope, api) {
    var ecModel = api.getModel();
    blurScope = blurScope || 'coordinateSystem';
    function leaveBlurOfIndices(data, dataIndices) {
        for(var i = 0; i < dataIndices.length; i++){
            var itemEl = data.getItemGraphicEl(dataIndices[i]);
            itemEl && leaveBlur(itemEl);
        }
    }
    if (targetSeriesIndex == null) {
        return;
    }
    if (!focus || focus === 'none') {
        return;
    }
    var targetSeriesModel = ecModel.getSeriesByIndex(targetSeriesIndex);
    var targetCoordSys = targetSeriesModel.coordinateSystem;
    if (targetCoordSys && targetCoordSys.master) {
        targetCoordSys = targetCoordSys.master;
    }
    var blurredSeries = [];
    ecModel.eachSeries(function(seriesModel) {
        var sameSeries = targetSeriesModel === seriesModel;
        var coordSys = seriesModel.coordinateSystem;
        if (coordSys && coordSys.master) {
            coordSys = coordSys.master;
        }
        var sameCoordSys = coordSys && targetCoordSys ? coordSys === targetCoordSys : sameSeries; // If there is no coordinate system. use sameSeries instead.
        if (!(// Not blur other series if blurScope series
        blurScope === 'series' && !sameSeries || blurScope === 'coordinateSystem' && !sameCoordSys || focus === 'series' && sameSeries)) {
            var view = api.getViewOfSeriesModel(seriesModel);
            view.group.traverse(function(child) {
                // For the elements that have been triggered by other components,
                // and are still required to be highlighted,
                // because the current is directly forced to blur the element,
                // it will cause the focus self to be unable to highlight, so skip the blur of this element.
                if (child.__highByOuter && sameSeries && focus === 'self') {
                    return;
                }
                singleEnterBlur(child);
            });
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArrayLike"])(focus)) {
                leaveBlurOfIndices(seriesModel.getData(), focus);
            } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObject"])(focus)) {
                var dataTypes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keys"])(focus);
                for(var d = 0; d < dataTypes.length; d++){
                    leaveBlurOfIndices(seriesModel.getData(dataTypes[d]), focus[dataTypes[d]]);
                }
            }
            blurredSeries.push(seriesModel);
            getComponentStates(seriesModel).isBlured = true;
        }
    });
    ecModel.eachComponent(function(componentType, componentModel) {
        if (componentType === 'series') {
            return;
        }
        var view = api.getViewOfComponentModel(componentModel);
        if (view && view.toggleBlurSeries) {
            view.toggleBlurSeries(blurredSeries, true, ecModel);
        }
    });
}
function blurComponent(componentMainType, componentIndex, api) {
    if (componentMainType == null || componentIndex == null) {
        return;
    }
    var componentModel = api.getModel().getComponent(componentMainType, componentIndex);
    if (!componentModel) {
        return;
    }
    getComponentStates(componentModel).isBlured = true;
    var view = api.getViewOfComponentModel(componentModel);
    if (!view || !view.focusBlurEnabled) {
        return;
    }
    view.group.traverse(function(child) {
        singleEnterBlur(child);
    });
}
function blurSeriesFromHighlightPayload(seriesModel, payload, api) {
    var seriesIndex = seriesModel.seriesIndex;
    var data = seriesModel.getData(payload.dataType);
    if (!data) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["error"])("Unknown dataType " + payload.dataType);
        }
        return;
    }
    var dataIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryDataIndex"])(data, payload);
    // Pick the first one if there is multiple/none exists.
    dataIndex = ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(dataIndex) ? dataIndex[0] : dataIndex) || 0;
    var el = data.getItemGraphicEl(dataIndex);
    if (!el) {
        var count = data.count();
        var current = 0;
        // If data on dataIndex is NaN.
        while(!el && current < count){
            el = data.getItemGraphicEl(current++);
        }
    }
    if (el) {
        var ecData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getECData"])(el);
        blurSeries(seriesIndex, ecData.focus, ecData.blurScope, api);
    } else {
        // If there is no element put on the data. Try getting it from raw option
        // TODO Should put it on seriesModel?
        var focus_1 = seriesModel.get([
            'emphasis',
            'focus'
        ]);
        var blurScope = seriesModel.get([
            'emphasis',
            'blurScope'
        ]);
        if (focus_1 != null) {
            blurSeries(seriesIndex, focus_1, blurScope, api);
        }
    }
}
function findComponentHighDownDispatchers(componentMainType, componentIndex, name, api) {
    var ret = {
        focusSelf: false,
        dispatchers: null
    };
    if (componentMainType == null || componentMainType === 'series' || componentIndex == null || name == null) {
        return ret;
    }
    var componentModel = api.getModel().getComponent(componentMainType, componentIndex);
    if (!componentModel) {
        return ret;
    }
    var view = api.getViewOfComponentModel(componentModel);
    if (!view || !view.findHighDownDispatchers) {
        return ret;
    }
    var dispatchers = view.findHighDownDispatchers(name);
    // At presnet, the component (like Geo) only blur inside itself.
    // So we do not use `blurScope` in component.
    var focusSelf;
    for(var i = 0; i < dispatchers.length; i++){
        if (("TURBOPACK compile-time value", "development") !== 'production' && !isHighDownDispatcher(dispatchers[i])) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["error"])('param should be highDownDispatcher');
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getECData"])(dispatchers[i]).focus === 'self') {
            focusSelf = true;
            break;
        }
    }
    return {
        focusSelf: focusSelf,
        dispatchers: dispatchers
    };
}
function handleGlobalMouseOverForHighDown(dispatcher, e, api) {
    if (("TURBOPACK compile-time value", "development") !== 'production' && !isHighDownDispatcher(dispatcher)) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["error"])('param should be highDownDispatcher');
    }
    var ecData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getECData"])(dispatcher);
    var _a = findComponentHighDownDispatchers(ecData.componentMainType, ecData.componentIndex, ecData.componentHighDownName, api), dispatchers = _a.dispatchers, focusSelf = _a.focusSelf;
    // If `findHighDownDispatchers` is supported on the component,
    // highlight/downplay elements with the same name.
    if (dispatchers) {
        if (focusSelf) {
            blurComponent(ecData.componentMainType, ecData.componentIndex, api);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(dispatchers, function(dispatcher) {
            return enterEmphasisWhenMouseOver(dispatcher, e);
        });
    } else {
        // Try blur all in the related series. Then emphasis the hoverred.
        // TODO. progressive mode.
        blurSeries(ecData.seriesIndex, ecData.focus, ecData.blurScope, api);
        if (ecData.focus === 'self') {
            blurComponent(ecData.componentMainType, ecData.componentIndex, api);
        }
        // Other than series, component that not support `findHighDownDispatcher` will
        // also use it. But in this case, highlight/downplay are only supported in
        // mouse hover but not in dispatchAction.
        enterEmphasisWhenMouseOver(dispatcher, e);
    }
}
function handleGlobalMouseOutForHighDown(dispatcher, e, api) {
    if (("TURBOPACK compile-time value", "development") !== 'production' && !isHighDownDispatcher(dispatcher)) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["error"])('param should be highDownDispatcher');
    }
    allLeaveBlur(api);
    var ecData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getECData"])(dispatcher);
    var dispatchers = findComponentHighDownDispatchers(ecData.componentMainType, ecData.componentIndex, ecData.componentHighDownName, api).dispatchers;
    if (dispatchers) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(dispatchers, function(dispatcher) {
            return leaveEmphasisWhenMouseOut(dispatcher, e);
        });
    } else {
        leaveEmphasisWhenMouseOut(dispatcher, e);
    }
}
function toggleSelectionFromPayload(seriesModel, payload, api) {
    if (!isSelectChangePayload(payload)) {
        return;
    }
    var dataType = payload.dataType;
    var data = seriesModel.getData(dataType);
    var dataIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryDataIndex"])(data, payload);
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(dataIndex)) {
        dataIndex = [
            dataIndex
        ];
    }
    seriesModel[payload.type === TOGGLE_SELECT_ACTION_TYPE ? 'toggleSelect' : payload.type === SELECT_ACTION_TYPE ? 'select' : 'unselect'](dataIndex, dataType);
}
function updateSeriesElementSelection(seriesModel) {
    var allData = seriesModel.getAllData();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(allData, function(_a) {
        var data = _a.data, type = _a.type;
        data.eachItemGraphicEl(function(el, idx) {
            seriesModel.isSelected(idx, type) ? enterSelect(el) : leaveSelect(el);
        });
    });
}
function getAllSelectedIndices(ecModel) {
    var ret = [];
    ecModel.eachSeries(function(seriesModel) {
        var allData = seriesModel.getAllData();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(allData, function(_a) {
            var data = _a.data, type = _a.type;
            var dataIndices = seriesModel.getSelectedDataIndices();
            if (dataIndices.length > 0) {
                var item = {
                    dataIndex: dataIndices,
                    seriesIndex: seriesModel.seriesIndex
                };
                if (type != null) {
                    item.dataType = type;
                }
                ret.push(item);
            }
        });
    });
    return ret;
}
function enableHoverEmphasis(el, focus, blurScope) {
    setAsHighDownDispatcher(el, true);
    traverseUpdateState(el, setDefaultStateProxy);
    enableHoverFocus(el, focus, blurScope);
}
function disableHoverEmphasis(el) {
    setAsHighDownDispatcher(el, false);
}
function toggleHoverEmphasis(el, focus, blurScope, isDisabled) {
    isDisabled ? disableHoverEmphasis(el) : enableHoverEmphasis(el, focus, blurScope);
}
function enableHoverFocus(el, focus, blurScope) {
    var ecData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getECData"])(el);
    if (focus != null) {
        // TODO dataIndex may be set after this function. This check is not useful.
        // if (ecData.dataIndex == null) {
        //     if (__DEV__) {
        //         console.warn('focus can only been set on element with dataIndex');
        //     }
        // }
        // else {
        ecData.focus = focus;
        ecData.blurScope = blurScope;
    // }
    } else if (ecData.focus) {
        ecData.focus = null;
    }
}
var OTHER_STATES = [
    'emphasis',
    'blur',
    'select'
];
var defaultStyleGetterMap = {
    itemStyle: 'getItemStyle',
    lineStyle: 'getLineStyle',
    areaStyle: 'getAreaStyle'
};
function setStatesStylesFromModel(el, itemModel, styleType, // default itemStyle
getter) {
    styleType = styleType || 'itemStyle';
    for(var i = 0; i < OTHER_STATES.length; i++){
        var stateName = OTHER_STATES[i];
        var model = itemModel.getModel([
            stateName,
            styleType
        ]);
        var state = el.ensureState(stateName);
        // Let it throw error if getterType is not found.
        state.style = getter ? getter(model) : model[defaultStyleGetterMap[styleType]]();
    }
}
function setAsHighDownDispatcher(el, asDispatcher) {
    var disable = asDispatcher === false;
    var extendedEl = el;
    // Make `highDownSilentOnTouch` and `onStateChange` only work after
    // `setAsHighDownDispatcher` called. Avoid it is modified by user unexpectedly.
    if (el.highDownSilentOnTouch) {
        extendedEl.__highDownSilentOnTouch = el.highDownSilentOnTouch;
    }
    // Simple optimize, since this method might be
    // called for each elements of a group in some cases.
    if (!disable || extendedEl.__highDownDispatcher) {
        // Emphasis, normal can be triggered manually by API or other components like hover link.
        // el[method]('emphasis', onElementEmphasisEvent)[method]('normal', onElementNormalEvent);
        // Also keep previous record.
        extendedEl.__highByOuter = extendedEl.__highByOuter || 0;
        extendedEl.__highDownDispatcher = !disable;
    }
}
function isHighDownDispatcher(el) {
    return !!(el && el.__highDownDispatcher);
}
function enableComponentHighDownFeatures(el, componentModel, componentHighDownName) {
    var ecData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getECData"])(el);
    ecData.componentMainType = componentModel.mainType;
    ecData.componentIndex = componentModel.componentIndex;
    ecData.componentHighDownName = componentHighDownName;
}
function getHighlightDigit(highlightKey) {
    var highlightDigit = _highlightKeyMap[highlightKey];
    if (highlightDigit == null && _highlightNextDigit <= 32) {
        highlightDigit = _highlightKeyMap[highlightKey] = _highlightNextDigit++;
    }
    return highlightDigit;
}
function isSelectChangePayload(payload) {
    var payloadType = payload.type;
    return payloadType === SELECT_ACTION_TYPE || payloadType === UNSELECT_ACTION_TYPE || payloadType === TOGGLE_SELECT_ACTION_TYPE;
}
function isHighDownPayload(payload) {
    var payloadType = payload.type;
    return payloadType === HIGHLIGHT_ACTION_TYPE || payloadType === DOWNPLAY_ACTION_TYPE;
}
function savePathStates(el) {
    var store = getSavedStates(el);
    store.normalFill = el.style.fill;
    store.normalStroke = el.style.stroke;
    var selectState = el.states.select || {};
    store.selectFill = selectState.style && selectState.style.fill || null;
    store.selectStroke = selectState.style && selectState.style.stroke || null;
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/styleCompat.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "convertFromEC4CompatibleStyle",
    ()=>convertFromEC4CompatibleStyle,
    "convertToEC4StyleForCustomSerise",
    ()=>convertToEC4StyleForCustomSerise,
    "isEC4CompatibleStyle",
    ()=>isEC4CompatibleStyle,
    "warnDeprecated",
    ()=>warnDeprecated
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/tokens.js [app-client] (ecmascript)");
;
;
var deprecatedLogs = {};
function isEC4CompatibleStyle(style, elType, hasOwnTextContentOption, hasOwnTextConfig) {
    // Since echarts5, `RectText` is separated from its host element and style.text
    // does not exist any more. The compat work brings some extra burden on performance.
    // So we provide:
    // `legacy: true` force make compat.
    // `legacy: false`, force do not compat.
    // `legacy` not set: auto detect whether legacy.
    //     But in this case we do not compat (difficult to detect and rare case):
    //     Because custom series and graphic component support "merge", users may firstly
    //     only set `textStrokeWidth` style or secondly only set `text`.
    return style && (style.legacy || style.legacy !== false && !hasOwnTextContentOption && !hasOwnTextConfig && elType !== 'tspan' && (elType === 'text' || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(style, 'text')));
}
function convertFromEC4CompatibleStyle(hostStyle, elType, isNormal) {
    var srcStyle = hostStyle;
    var textConfig;
    var textContent;
    var textContentStyle;
    if (elType === 'text') {
        textContentStyle = srcStyle;
    } else {
        textContentStyle = {};
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(srcStyle, 'text') && (textContentStyle.text = srcStyle.text);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(srcStyle, 'rich') && (textContentStyle.rich = srcStyle.rich);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(srcStyle, 'textFill') && (textContentStyle.fill = srcStyle.textFill);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(srcStyle, 'textStroke') && (textContentStyle.stroke = srcStyle.textStroke);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(srcStyle, 'fontFamily') && (textContentStyle.fontFamily = srcStyle.fontFamily);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(srcStyle, 'fontSize') && (textContentStyle.fontSize = srcStyle.fontSize);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(srcStyle, 'fontStyle') && (textContentStyle.fontStyle = srcStyle.fontStyle);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(srcStyle, 'fontWeight') && (textContentStyle.fontWeight = srcStyle.fontWeight);
        textContent = {
            type: 'text',
            style: textContentStyle,
            // ec4 does not support rectText trigger.
            // And when text position is different in normal and emphasis
            // => hover text trigger emphasis;
            // => text position changed, leave mouse pointer immediately;
            // That might cause incorrect state.
            silent: true
        };
        textConfig = {};
        var hasOwnPos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(srcStyle, 'textPosition');
        if (isNormal) {
            textConfig.position = hasOwnPos ? srcStyle.textPosition : 'inside';
        } else {
            hasOwnPos && (textConfig.position = srcStyle.textPosition);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(srcStyle, 'textPosition') && (textConfig.position = srcStyle.textPosition);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(srcStyle, 'textOffset') && (textConfig.offset = srcStyle.textOffset);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(srcStyle, 'textRotation') && (textConfig.rotation = srcStyle.textRotation);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(srcStyle, 'textDistance') && (textConfig.distance = srcStyle.textDistance);
    }
    convertEC4CompatibleRichItem(textContentStyle, hostStyle);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(textContentStyle.rich, function(richItem) {
        convertEC4CompatibleRichItem(richItem, richItem);
    });
    return {
        textConfig: textConfig,
        textContent: textContent
    };
}
/**
 * The result will be set to `out`.
 */ function convertEC4CompatibleRichItem(out, richItem) {
    if (!richItem) {
        return;
    }
    // (1) For simplicity, make textXXX properties (deprecated since ec5) has
    // higher priority. For example, consider in ec4 `borderColor: 5, textBorderColor: 10`
    // on a rect means `borderColor: 4` on the rect and `borderColor: 10` on an attached
    // richText in ec5.
    // (2) `out === richItem` if and only if `out` is text el or rich item.
    // So we can overwrite existing props in `out` since textXXX has higher priority.
    richItem.font = richItem.textFont || richItem.font;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'textStrokeWidth') && (out.lineWidth = richItem.textStrokeWidth);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'textAlign') && (out.align = richItem.textAlign);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'textVerticalAlign') && (out.verticalAlign = richItem.textVerticalAlign);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'textLineHeight') && (out.lineHeight = richItem.textLineHeight);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'textWidth') && (out.width = richItem.textWidth);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'textHeight') && (out.height = richItem.textHeight);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'textBackgroundColor') && (out.backgroundColor = richItem.textBackgroundColor);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'textPadding') && (out.padding = richItem.textPadding);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'textBorderColor') && (out.borderColor = richItem.textBorderColor);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'textBorderWidth') && (out.borderWidth = richItem.textBorderWidth);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'textBorderRadius') && (out.borderRadius = richItem.textBorderRadius);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'textBoxShadowColor') && (out.shadowColor = richItem.textBoxShadowColor);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'textBoxShadowBlur') && (out.shadowBlur = richItem.textBoxShadowBlur);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'textBoxShadowOffsetX') && (out.shadowOffsetX = richItem.textBoxShadowOffsetX);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'textBoxShadowOffsetY') && (out.shadowOffsetY = richItem.textBoxShadowOffsetY);
}
function convertToEC4StyleForCustomSerise(itemStl, txStl, txCfg) {
    var out = itemStl;
    // See `custom.ts`, a trick to set extra `textPosition` firstly.
    out.textPosition = out.textPosition || txCfg.position || 'inside';
    txCfg.offset != null && (out.textOffset = txCfg.offset);
    txCfg.rotation != null && (out.textRotation = txCfg.rotation);
    txCfg.distance != null && (out.textDistance = txCfg.distance);
    var isInside = out.textPosition.indexOf('inside') >= 0;
    var hostFill = itemStl.fill || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.neutral99;
    convertToEC4RichItem(out, txStl);
    var textFillNotSet = out.textFill == null;
    if (isInside) {
        if (textFillNotSet) {
            out.textFill = txCfg.insideFill || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.neutral00;
            !out.textStroke && txCfg.insideStroke && (out.textStroke = txCfg.insideStroke);
            !out.textStroke && (out.textStroke = hostFill);
            out.textStrokeWidth == null && (out.textStrokeWidth = 2);
        }
    } else {
        if (textFillNotSet) {
            out.textFill = itemStl.fill || txCfg.outsideFill || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.neutral00;
        }
        !out.textStroke && txCfg.outsideStroke && (out.textStroke = txCfg.outsideStroke);
    }
    out.text = txStl.text;
    out.rich = txStl.rich;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(txStl.rich, function(richItem) {
        convertToEC4RichItem(richItem, richItem);
    });
    return out;
}
function convertToEC4RichItem(out, richItem) {
    if (!richItem) {
        return;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'fill') && (out.textFill = richItem.fill);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'stroke') && (out.textStroke = richItem.fill);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'lineWidth') && (out.textStrokeWidth = richItem.lineWidth);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'font') && (out.font = richItem.font);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'fontStyle') && (out.fontStyle = richItem.fontStyle);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'fontWeight') && (out.fontWeight = richItem.fontWeight);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'fontSize') && (out.fontSize = richItem.fontSize);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'fontFamily') && (out.fontFamily = richItem.fontFamily);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'align') && (out.textAlign = richItem.align);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'verticalAlign') && (out.textVerticalAlign = richItem.verticalAlign);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'lineHeight') && (out.textLineHeight = richItem.lineHeight);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'width') && (out.textWidth = richItem.width);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'height') && (out.textHeight = richItem.height);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'backgroundColor') && (out.textBackgroundColor = richItem.backgroundColor);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'padding') && (out.textPadding = richItem.padding);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'borderColor') && (out.textBorderColor = richItem.borderColor);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'borderWidth') && (out.textBorderWidth = richItem.borderWidth);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'borderRadius') && (out.textBorderRadius = richItem.borderRadius);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'shadowColor') && (out.textBoxShadowColor = richItem.shadowColor);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'shadowBlur') && (out.textBoxShadowBlur = richItem.shadowBlur);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'shadowOffsetX') && (out.textBoxShadowOffsetX = richItem.shadowOffsetX);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'shadowOffsetY') && (out.textBoxShadowOffsetY = richItem.shadowOffsetY);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'textShadowColor') && (out.textShadowColor = richItem.textShadowColor);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'textShadowBlur') && (out.textShadowBlur = richItem.textShadowBlur);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'textShadowOffsetX') && (out.textShadowOffsetX = richItem.textShadowOffsetX);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasOwn"])(richItem, 'textShadowOffsetY') && (out.textShadowOffsetY = richItem.textShadowOffsetY);
}
function warnDeprecated(deprecated, insteadApproach) {
    if ("TURBOPACK compile-time truthy", 1) {
        var key = deprecated + '^_^' + insteadApproach;
        if (!deprecatedLogs[key]) {
            console.warn("[ECharts] DEPRECATED: \"" + deprecated + "\" has been deprecated. " + insteadApproach);
            deprecatedLogs[key] = true;
        }
    }
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/symbol.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSymbol",
    ()=>createSymbol,
    "normalizeSymbolOffset",
    ()=>normalizeSymbolOffset,
    "normalizeSymbolSize",
    ()=>normalizeSymbolSize,
    "symbolBuildProxies",
    ()=>symbolBuildProxies
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
*/ // Symbol factory
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Path$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Path.js [app-client] (ecmascript) <export default as Path>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Line$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Line.js [app-client] (ecmascript) <export default as Line>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rect$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Rect.js [app-client] (ecmascript) <export default as Rect>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Circle.js [app-client] (ecmascript) <export default as Circle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/graphic.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/BoundingRect.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$contain$2f$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/contain/text.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/tokens.js [app-client] (ecmascript)");
;
;
;
;
;
;
/**
 * Triangle shape
 * @inner
 */ var Triangle = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Path$3e$__["Path"].extend({
    type: 'triangle',
    shape: {
        cx: 0,
        cy: 0,
        width: 0,
        height: 0
    },
    buildPath: function(path, shape) {
        var cx = shape.cx;
        var cy = shape.cy;
        var width = shape.width / 2;
        var height = shape.height / 2;
        path.moveTo(cx, cy - height);
        path.lineTo(cx + width, cy + height);
        path.lineTo(cx - width, cy + height);
        path.closePath();
    }
});
/**
 * Diamond shape
 * @inner
 */ var Diamond = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Path$3e$__["Path"].extend({
    type: 'diamond',
    shape: {
        cx: 0,
        cy: 0,
        width: 0,
        height: 0
    },
    buildPath: function(path, shape) {
        var cx = shape.cx;
        var cy = shape.cy;
        var width = shape.width / 2;
        var height = shape.height / 2;
        path.moveTo(cx, cy - height);
        path.lineTo(cx + width, cy);
        path.lineTo(cx, cy + height);
        path.lineTo(cx - width, cy);
        path.closePath();
    }
});
/**
 * Pin shape
 * @inner
 */ var Pin = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Path$3e$__["Path"].extend({
    type: 'pin',
    shape: {
        // x, y on the cusp
        x: 0,
        y: 0,
        width: 0,
        height: 0
    },
    buildPath: function(path, shape) {
        var x = shape.x;
        var y = shape.y;
        var w = shape.width / 5 * 3;
        // Height must be larger than width
        var h = Math.max(w, shape.height);
        var r = w / 2;
        // Dist on y with tangent point and circle center
        var dy = r * r / (h - r);
        var cy = y - h + r + dy;
        var angle = Math.asin(dy / r);
        // Dist on x with tangent point and circle center
        var dx = Math.cos(angle) * r;
        var tanX = Math.sin(angle);
        var tanY = Math.cos(angle);
        var cpLen = r * 0.6;
        var cpLen2 = r * 0.7;
        path.moveTo(x - dx, cy + dy);
        path.arc(x, cy, r, Math.PI - angle, Math.PI * 2 + angle);
        path.bezierCurveTo(x + dx - tanX * cpLen, cy + dy + tanY * cpLen, x, y - cpLen2, x, y);
        path.bezierCurveTo(x, y - cpLen2, x - dx + tanX * cpLen, cy + dy + tanY * cpLen, x - dx, cy + dy);
        path.closePath();
    }
});
/**
 * Arrow shape
 * @inner
 */ var Arrow = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Path$3e$__["Path"].extend({
    type: 'arrow',
    shape: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    },
    buildPath: function(ctx, shape) {
        var height = shape.height;
        var width = shape.width;
        var x = shape.x;
        var y = shape.y;
        var dx = width / 3 * 2;
        ctx.moveTo(x, y);
        ctx.lineTo(x + dx, y + height);
        ctx.lineTo(x, y + height / 4 * 3);
        ctx.lineTo(x - dx, y + height);
        ctx.lineTo(x, y);
        ctx.closePath();
    }
});
/**
 * Map of path constructors
 */ // TODO Use function to build symbol path.
var symbolCtors = {
    line: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Line$3e$__["Line"],
    rect: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rect$3e$__["Rect"],
    roundRect: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rect$3e$__["Rect"],
    square: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rect$3e$__["Rect"],
    circle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__["Circle"],
    diamond: Diamond,
    pin: Pin,
    arrow: Arrow,
    triangle: Triangle
};
var symbolShapeMakers = {
    line: function(x, y, w, h, shape) {
        shape.x1 = x;
        shape.y1 = y + h / 2;
        shape.x2 = x + w;
        shape.y2 = y + h / 2;
    },
    rect: function(x, y, w, h, shape) {
        shape.x = x;
        shape.y = y;
        shape.width = w;
        shape.height = h;
    },
    roundRect: function(x, y, w, h, shape) {
        shape.x = x;
        shape.y = y;
        shape.width = w;
        shape.height = h;
        shape.r = Math.min(w, h) / 4;
    },
    square: function(x, y, w, h, shape) {
        var size = Math.min(w, h);
        shape.x = x;
        shape.y = y;
        shape.width = size;
        shape.height = size;
    },
    circle: function(x, y, w, h, shape) {
        // Put circle in the center of square
        shape.cx = x + w / 2;
        shape.cy = y + h / 2;
        shape.r = Math.min(w, h) / 2;
    },
    diamond: function(x, y, w, h, shape) {
        shape.cx = x + w / 2;
        shape.cy = y + h / 2;
        shape.width = w;
        shape.height = h;
    },
    pin: function(x, y, w, h, shape) {
        shape.x = x + w / 2;
        shape.y = y + h / 2;
        shape.width = w;
        shape.height = h;
    },
    arrow: function(x, y, w, h, shape) {
        shape.x = x + w / 2;
        shape.y = y + h / 2;
        shape.width = w;
        shape.height = h;
    },
    triangle: function(x, y, w, h, shape) {
        shape.cx = x + w / 2;
        shape.cy = y + h / 2;
        shape.width = w;
        shape.height = h;
    }
};
var symbolBuildProxies = {};
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"])(symbolCtors, function(Ctor, name) {
    symbolBuildProxies[name] = new Ctor();
});
var SymbolClz = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Path$3e$__["Path"].extend({
    type: 'symbol',
    shape: {
        symbolType: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0
    },
    calculateTextPosition: function(out, config, rect) {
        var res = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$contain$2f$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateTextPosition"])(out, config, rect);
        var shape = this.shape;
        if (shape && shape.symbolType === 'pin' && config.position === 'inside') {
            res.y = rect.y + rect.height * 0.4;
        }
        return res;
    },
    buildPath: function(ctx, shape, inBundle) {
        var symbolType = shape.symbolType;
        if (symbolType !== 'none') {
            var proxySymbol = symbolBuildProxies[symbolType];
            if (!proxySymbol) {
                // Default rect
                symbolType = 'rect';
                proxySymbol = symbolBuildProxies[symbolType];
            }
            symbolShapeMakers[symbolType](shape.x, shape.y, shape.width, shape.height, proxySymbol.shape);
            proxySymbol.buildPath(ctx, proxySymbol.shape, inBundle);
        }
    }
});
// Provide setColor helper method to avoid determine if set the fill or stroke outside
function symbolPathSetColor(color, innerColor) {
    if (this.type !== 'image') {
        var symbolStyle = this.style;
        if (this.__isEmptyBrush) {
            symbolStyle.stroke = color;
            symbolStyle.fill = innerColor || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].color.neutral00;
            // TODO Same width with lineStyle in LineView
            symbolStyle.lineWidth = 2;
        } else if (this.shape.symbolType === 'line') {
            symbolStyle.stroke = color;
        } else {
            symbolStyle.fill = color;
        }
        this.markRedraw();
    }
}
function createSymbol(symbolType, x, y, w, h, color, // whether to keep the ratio of w/h,
keepAspect) {
    // TODO Support image object, DynamicImage.
    var isEmpty = symbolType.indexOf('empty') === 0;
    if (isEmpty) {
        symbolType = symbolType.substr(5, 1).toLowerCase() + symbolType.substr(6);
    }
    var symbolPath;
    if (symbolType.indexOf('image://') === 0) {
        symbolPath = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["makeImage"](symbolType.slice(8), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](x, y, w, h), keepAspect ? 'center' : 'cover');
    } else if (symbolType.indexOf('path://') === 0) {
        symbolPath = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["makePath"](symbolType.slice(7), {}, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$BoundingRect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](x, y, w, h), keepAspect ? 'center' : 'cover');
    } else {
        symbolPath = new SymbolClz({
            shape: {
                symbolType: symbolType,
                x: x,
                y: y,
                width: w,
                height: h
            }
        });
    }
    symbolPath.__isEmptyBrush = isEmpty;
    // TODO Should deprecate setColor
    symbolPath.setColor = symbolPathSetColor;
    if (color) {
        symbolPath.setColor(color);
    }
    return symbolPath;
}
function normalizeSymbolSize(symbolSize) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(symbolSize)) {
        symbolSize = [
            +symbolSize,
            +symbolSize
        ];
    }
    return [
        symbolSize[0] || 0,
        symbolSize[1] || 0
    ];
}
function normalizeSymbolOffset(symbolOffset, symbolSize) {
    if (symbolOffset == null) {
        return;
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(symbolOffset)) {
        symbolOffset = [
            symbolOffset,
            symbolOffset
        ];
    }
    return [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])(symbolOffset[0], symbolSize[0]) || 0,
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePercent"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["retrieve2"])(symbolOffset[1], symbolOffset[0]), symbolSize[1]) || 0
    ];
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/throttle.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clear",
    ()=>clear,
    "createOrUpdate",
    ()=>createOrUpdate,
    "throttle",
    ()=>throttle
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
*/ var ORIGIN_METHOD = '\0__throttleOriginMethod';
var RATE = '\0__throttleRate';
var THROTTLE_TYPE = '\0__throttleType';
;
function throttle(fn, delay, debounce) {
    var currCall;
    var lastCall = 0;
    var lastExec = 0;
    var timer = null;
    var diff;
    var scope;
    var args;
    var debounceNextCall;
    delay = delay || 0;
    function exec() {
        lastExec = new Date().getTime();
        timer = null;
        fn.apply(scope, args || []);
    }
    var cb = function() {
        var cbArgs = [];
        for(var _i = 0; _i < arguments.length; _i++){
            cbArgs[_i] = arguments[_i];
        }
        currCall = new Date().getTime();
        scope = this;
        args = cbArgs;
        var thisDelay = debounceNextCall || delay;
        var thisDebounce = debounceNextCall || debounce;
        debounceNextCall = null;
        diff = currCall - (thisDebounce ? lastCall : lastExec) - thisDelay;
        clearTimeout(timer);
        // Here we should make sure that: the `exec` SHOULD NOT be called later
        // than a new call of `cb`, that is, preserving the command order. Consider
        // calculating "scale rate" when roaming as an example. When a call of `cb`
        // happens, either the `exec` is called dierectly, or the call is delayed.
        // But the delayed call should never be later than next call of `cb`. Under
        // this assurance, we can simply update view state each time `dispatchAction`
        // triggered by user roaming, but not need to add extra code to avoid the
        // state being "rolled-back".
        if (thisDebounce) {
            timer = setTimeout(exec, thisDelay);
        } else {
            if (diff >= 0) {
                exec();
            } else {
                timer = setTimeout(exec, -diff);
            }
        }
        lastCall = currCall;
    };
    /**
   * Clear throttle.
   * @public
   */ cb.clear = function() {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };
    /**
   * Enable debounce once.
   */ cb.debounceNextCall = function(debounceDelay) {
        debounceNextCall = debounceDelay;
    };
    return cb;
}
function createOrUpdate(obj, fnAttr, rate, throttleType) {
    var fn = obj[fnAttr];
    if (!fn) {
        return;
    }
    var originFn = fn[ORIGIN_METHOD] || fn;
    var lastThrottleType = fn[THROTTLE_TYPE];
    var lastRate = fn[RATE];
    if (lastRate !== rate || lastThrottleType !== throttleType) {
        if (rate == null || !throttleType) {
            return obj[fnAttr] = originFn;
        }
        fn = obj[fnAttr] = throttle(originFn, rate, throttleType === 'debounce');
        fn[ORIGIN_METHOD] = originFn;
        fn[THROTTLE_TYPE] = throttleType;
        fn[RATE] = rate;
    }
    return fn;
}
function clear(obj, fnAttr) {
    var fn = obj[fnAttr];
    if (fn && fn[ORIGIN_METHOD]) {
        // Clear throttle
        fn.clear && fn.clear();
        obj[fnAttr] = fn[ORIGIN_METHOD];
    }
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/time.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ONE_DAY",
    ()=>ONE_DAY,
    "ONE_HOUR",
    ()=>ONE_HOUR,
    "ONE_MINUTE",
    ()=>ONE_MINUTE,
    "ONE_SECOND",
    ()=>ONE_SECOND,
    "ONE_YEAR",
    ()=>ONE_YEAR,
    "dateGetterName",
    ()=>dateGetterName,
    "dateSetterName",
    ()=>dateSetterName,
    "format",
    ()=>format,
    "fullLeveledFormatter",
    ()=>fullLeveledFormatter,
    "fullYearGetterName",
    ()=>fullYearGetterName,
    "fullYearSetterName",
    ()=>fullYearSetterName,
    "getDefaultFormatPrecisionOfInterval",
    ()=>getDefaultFormatPrecisionOfInterval,
    "getPrimaryTimeUnit",
    ()=>getPrimaryTimeUnit,
    "getUnitFromValue",
    ()=>getUnitFromValue,
    "hoursGetterName",
    ()=>hoursGetterName,
    "hoursSetterName",
    ()=>hoursSetterName,
    "isPrimaryTimeUnit",
    ()=>isPrimaryTimeUnit,
    "leveledFormat",
    ()=>leveledFormat,
    "millisecondsGetterName",
    ()=>millisecondsGetterName,
    "millisecondsSetterName",
    ()=>millisecondsSetterName,
    "minutesGetterName",
    ()=>minutesGetterName,
    "minutesSetterName",
    ()=>minutesSetterName,
    "monthGetterName",
    ()=>monthGetterName,
    "monthSetterName",
    ()=>monthSetterName,
    "pad",
    ()=>pad,
    "parseTimeAxisLabelFormatter",
    ()=>parseTimeAxisLabelFormatter,
    "primaryTimeUnits",
    ()=>primaryTimeUnits,
    "roundTime",
    ()=>roundTime,
    "secondsGetterName",
    ()=>secondsGetterName,
    "secondsSetterName",
    ()=>secondsSetterName,
    "timeUnits",
    ()=>timeUnits
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$locale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/locale.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Model.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/break.js [app-client] (ecmascript)");
;
;
;
;
;
var ONE_SECOND = 1000;
var ONE_MINUTE = ONE_SECOND * 60;
var ONE_HOUR = ONE_MINUTE * 60;
var ONE_DAY = ONE_HOUR * 24;
var ONE_YEAR = ONE_DAY * 365;
var primaryTimeUnitFormatterMatchers = {
    year: /({yyyy}|{yy})/,
    month: /({MMMM}|{MMM}|{MM}|{M})/,
    day: /({dd}|{d})/,
    hour: /({HH}|{H}|{hh}|{h})/,
    minute: /({mm}|{m})/,
    second: /({ss}|{s})/,
    millisecond: /({SSS}|{S})/
};
var defaultFormatterSeed = {
    year: '{yyyy}',
    month: '{MMM}',
    day: '{d}',
    hour: '{HH}:{mm}',
    minute: '{HH}:{mm}',
    second: '{HH}:{mm}:{ss}',
    millisecond: '{HH}:{mm}:{ss} {SSS}'
};
var defaultFullFormatter = '{yyyy}-{MM}-{dd} {HH}:{mm}:{ss} {SSS}';
var fullDayFormatter = '{yyyy}-{MM}-{dd}';
var fullLeveledFormatter = {
    year: '{yyyy}',
    month: '{yyyy}-{MM}',
    day: fullDayFormatter,
    hour: fullDayFormatter + ' ' + defaultFormatterSeed.hour,
    minute: fullDayFormatter + ' ' + defaultFormatterSeed.minute,
    second: fullDayFormatter + ' ' + defaultFormatterSeed.second,
    millisecond: defaultFullFormatter
};
var primaryTimeUnits = [
    'year',
    'month',
    'day',
    'hour',
    'minute',
    'second',
    'millisecond'
];
var timeUnits = [
    'year',
    'half-year',
    'quarter',
    'month',
    'week',
    'half-week',
    'day',
    'half-day',
    'quarter-day',
    'hour',
    'minute',
    'second',
    'millisecond'
];
function parseTimeAxisLabelFormatter(formatter) {
    // Keep the logic the same with function `leveledFormat`.
    return !__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"](formatter) && !__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFunction"](formatter) ? parseTimeAxisLabelFormatterDictionary(formatter) : formatter;
}
/**
 * The final generated dictionary is like:
 *  generated_dict = {
 *      year: {
 *          year: ['{yyyy}', ...<higher_levels_if_any>]
 *      },
 *      month: {
 *          year: ['{yyyy} {MMM}', ...<higher_levels_if_any>],
 *          month: ['{MMM}', ...<higher_levels_if_any>]
 *      },
 *      day: {
 *          year: ['{yyyy} {MMM} {d}', ...<higher_levels_if_any>],
 *          month: ['{MMM} {d}', ...<higher_levels_if_any>],
 *          day: ['{d}', ...<higher_levels_if_any>]
 *      },
 *      ...
 *  }
 *
 * In echarts option, users can specify the entire dictionary or typically just:
 *  {formatter: {
 *      year: '{yyyy}', // Or an array of leveled templates: `['{yyyy}', '{bold1|{yyyy}}', ...]`,
 *                      // corresponding to `[level0, level1, level2, ...]`.
 *      month: '{MMM}',
 *      day: '{d}',
 *      hour: '{HH}:{mm}',
 *      second: '{HH}:{mm}',
 *      ...
 *  }}
 *  If any time unit is not specified in echarts option, the default template is used,
 *  such as `['{yyyy}', {primary|{yyyy}']`.
 *
 * The `tick.level` is only used to read string from each array, meaning the style type.
 *
 * Let `lowerUnit = getUnitFromValue(tick.value)`.
 * The non-break axis ticks only use `generated_dict[lowerUnit][lowerUnit][level]`.
 * The break axis ticks may use `generated_dict[lowerUnit][upperUnit][level]`, because:
 *  Consider the case: the non-break ticks are `16th, 23th, Feb, 7th, ...`, where `Feb` is in the break
 *  range and pruned by breaks, and the break ends might be in lower time unit than day. e.g., break start
 *  is `Jan 25th 18:00`(in unit `hour`) and break end is `Feb 6th 18:30` (in unit `minute`). Thus the break
 *  label prefers `Jan 25th 18:00` and `Feb 6th 18:30` rather than only `18:00` and `18:30`, otherwise it
 *  causes misleading.
 *  In this case, the tick of the break start and end will both be:
 *      `{level: 1, lowerTimeUnit: 'minute', upperTimeUnit: 'month'}`
 *  And get the final template by `generated_dict[lowerTimeUnit][upperTimeUnit][level]`.
 *  Note that the time unit can not be calculated directly by a single tick value, since the two breaks have
 *  to be at the same time unit to avoid awkward appearance. i.e., `Jan 25th 18:00` is in the time unit "hour"
 *  but we need it to be "minute", following `Feb 6th 18:30`.
 */ function parseTimeAxisLabelFormatterDictionary(dictOption) {
    dictOption = dictOption || {};
    var dict = {};
    // Currently if any template is specified by user, it may contain rich text tag,
    // such as `'{my_bold|{YYYY}}'`, thus we do add highlight style to it.
    // (Note that nested tag (`'{some|{some2|xxx}}'`) in rich text is not supported yet.)
    var canAddHighlight = true;
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](primaryTimeUnits, function(lowestUnit) {
        canAddHighlight && (canAddHighlight = dictOption[lowestUnit] == null);
    });
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["each"](primaryTimeUnits, function(lowestUnit, lowestUnitIdx) {
        var upperDictOption = dictOption[lowestUnit];
        dict[lowestUnit] = {};
        var lowerTpl = null;
        for(var upperUnitIdx = lowestUnitIdx; upperUnitIdx >= 0; upperUnitIdx--){
            var upperUnit = primaryTimeUnits[upperUnitIdx];
            var upperDictItemOption = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObject"](upperDictOption) && !__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"](upperDictOption) ? upperDictOption[upperUnit] : upperDictOption;
            var tplArr = void 0;
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"](upperDictItemOption)) {
                tplArr = upperDictItemOption.slice();
                lowerTpl = tplArr[0] || '';
            } else if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"](upperDictItemOption)) {
                lowerTpl = upperDictItemOption;
                tplArr = [
                    lowerTpl
                ];
            } else {
                if (lowerTpl == null) {
                    lowerTpl = defaultFormatterSeed[lowestUnit];
                } else if (!primaryTimeUnitFormatterMatchers[upperUnit].test(lowerTpl)) {
                    lowerTpl = dict[upperUnit][upperUnit][0] + " " + lowerTpl;
                }
                tplArr = [
                    lowerTpl
                ];
                if (canAddHighlight) {
                    tplArr[1] = "{primary|" + lowerTpl + "}";
                }
            }
            dict[lowestUnit][upperUnit] = tplArr;
        }
    });
    return dict;
}
function pad(str, len) {
    str += '';
    return '0000'.substr(0, len - str.length) + str;
}
function getPrimaryTimeUnit(timeUnit) {
    switch(timeUnit){
        case 'half-year':
        case 'quarter':
            return 'month';
        case 'week':
        case 'half-week':
            return 'day';
        case 'half-day':
        case 'quarter-day':
            return 'hour';
        default:
            // year, minutes, second, milliseconds
            return timeUnit;
    }
}
function isPrimaryTimeUnit(timeUnit) {
    return timeUnit === getPrimaryTimeUnit(timeUnit);
}
function getDefaultFormatPrecisionOfInterval(timeUnit) {
    switch(timeUnit){
        case 'year':
        case 'month':
            return 'day';
        case 'millisecond':
            return 'millisecond';
        default:
            // Also for day, hour, minute, second
            return 'second';
    }
}
function format(// Note: The result based on `isUTC` are totally different, which can not be just simply
// substituted by the result without `isUTC`. So we make the param `isUTC` mandatory.
time, template, isUTC, lang) {
    var date = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseDate"](time);
    var y = date[fullYearGetterName(isUTC)]();
    var M = date[monthGetterName(isUTC)]() + 1;
    var q = Math.floor((M - 1) / 3) + 1;
    var d = date[dateGetterName(isUTC)]();
    var e = date['get' + (isUTC ? 'UTC' : '') + 'Day']();
    var H = date[hoursGetterName(isUTC)]();
    var h = (H - 1) % 12 + 1;
    var m = date[minutesGetterName(isUTC)]();
    var s = date[secondsGetterName(isUTC)]();
    var S = date[millisecondsGetterName(isUTC)]();
    var a = H >= 12 ? 'pm' : 'am';
    var A = a.toUpperCase();
    var localeModel = lang instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] ? lang : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$locale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLocaleModel"])(lang || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$locale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SYSTEM_LANG"]) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$locale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDefaultLocaleModel"])();
    var timeModel = localeModel.getModel('time');
    var month = timeModel.get('month');
    var monthAbbr = timeModel.get('monthAbbr');
    var dayOfWeek = timeModel.get('dayOfWeek');
    var dayOfWeekAbbr = timeModel.get('dayOfWeekAbbr');
    return (template || '').replace(/{a}/g, a + '').replace(/{A}/g, A + '').replace(/{yyyy}/g, y + '').replace(/{yy}/g, pad(y % 100 + '', 2)).replace(/{Q}/g, q + '').replace(/{MMMM}/g, month[M - 1]).replace(/{MMM}/g, monthAbbr[M - 1]).replace(/{MM}/g, pad(M, 2)).replace(/{M}/g, M + '').replace(/{dd}/g, pad(d, 2)).replace(/{d}/g, d + '').replace(/{eeee}/g, dayOfWeek[e]).replace(/{ee}/g, dayOfWeekAbbr[e]).replace(/{e}/g, e + '').replace(/{HH}/g, pad(H, 2)).replace(/{H}/g, H + '').replace(/{hh}/g, pad(h + '', 2)).replace(/{h}/g, h + '').replace(/{mm}/g, pad(m, 2)).replace(/{m}/g, m + '').replace(/{ss}/g, pad(s, 2)).replace(/{s}/g, s + '').replace(/{SSS}/g, pad(S, 3)).replace(/{S}/g, S + '');
}
function leveledFormat(tick, idx, formatter, lang, isUTC) {
    var template = null;
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isString"](formatter)) {
        // Single formatter for all units at all levels
        template = formatter;
    } else if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFunction"](formatter)) {
        var extra = {
            time: tick.time,
            level: tick.time ? tick.time.level : 0
        };
        var scaleBreakHelper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$break$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScaleBreakHelper"])();
        if (scaleBreakHelper) {
            scaleBreakHelper.makeAxisLabelFormatterParamBreak(extra, tick["break"]);
        }
        template = formatter(tick.value, idx, extra);
    } else {
        var tickTime = tick.time;
        if (tickTime) {
            var leveledTplArr = formatter[tickTime.lowerTimeUnit][tickTime.upperTimeUnit];
            template = leveledTplArr[Math.min(tickTime.level, leveledTplArr.length - 1)] || '';
        } else {
            // tick may be from customTicks or timeline therefore no tick.time.
            var unit = getUnitFromValue(tick.value, isUTC);
            template = formatter[unit][unit][0];
        }
    }
    return format(new Date(tick.value), template, isUTC, lang);
}
function getUnitFromValue(value, isUTC) {
    var date = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseDate"](value);
    var M = date[monthGetterName(isUTC)]() + 1;
    var d = date[dateGetterName(isUTC)]();
    var h = date[hoursGetterName(isUTC)]();
    var m = date[minutesGetterName(isUTC)]();
    var s = date[secondsGetterName(isUTC)]();
    var S = date[millisecondsGetterName(isUTC)]();
    var isSecond = S === 0;
    var isMinute = isSecond && s === 0;
    var isHour = isMinute && m === 0;
    var isDay = isHour && h === 0;
    var isMonth = isDay && d === 1;
    var isYear = isMonth && M === 1;
    if (isYear) {
        return 'year';
    } else if (isMonth) {
        return 'month';
    } else if (isDay) {
        return 'day';
    } else if (isHour) {
        return 'hour';
    } else if (isMinute) {
        return 'minute';
    } else if (isSecond) {
        return 'second';
    } else {
        return 'millisecond';
    }
}
function roundTime(date, timeUnit, isUTC) {
    switch(timeUnit){
        case 'year':
            date[monthSetterName(isUTC)](0);
        case 'month':
            date[dateSetterName(isUTC)](1);
        case 'day':
            date[hoursSetterName(isUTC)](0);
        case 'hour':
            date[minutesSetterName(isUTC)](0);
        case 'minute':
            date[secondsSetterName(isUTC)](0);
        case 'second':
            date[millisecondsSetterName(isUTC)](0);
    }
    return date;
}
function fullYearGetterName(isUTC) {
    return isUTC ? 'getUTCFullYear' : 'getFullYear';
}
function monthGetterName(isUTC) {
    return isUTC ? 'getUTCMonth' : 'getMonth';
}
function dateGetterName(isUTC) {
    return isUTC ? 'getUTCDate' : 'getDate';
}
function hoursGetterName(isUTC) {
    return isUTC ? 'getUTCHours' : 'getHours';
}
function minutesGetterName(isUTC) {
    return isUTC ? 'getUTCMinutes' : 'getMinutes';
}
function secondsGetterName(isUTC) {
    return isUTC ? 'getUTCSeconds' : 'getSeconds';
}
function millisecondsGetterName(isUTC) {
    return isUTC ? 'getUTCMilliseconds' : 'getMilliseconds';
}
function fullYearSetterName(isUTC) {
    return isUTC ? 'setUTCFullYear' : 'setFullYear';
}
function monthSetterName(isUTC) {
    return isUTC ? 'setUTCMonth' : 'setMonth';
}
function dateSetterName(isUTC) {
    return isUTC ? 'setUTCDate' : 'setDate';
}
function hoursSetterName(isUTC) {
    return isUTC ? 'setUTCHours' : 'setHours';
}
function minutesSetterName(isUTC) {
    return isUTC ? 'setUTCMinutes' : 'setMinutes';
}
function secondsSetterName(isUTC) {
    return isUTC ? 'setUTCSeconds' : 'setSeconds';
}
function millisecondsSetterName(isUTC) {
    return isUTC ? 'setUTCMilliseconds' : 'setMilliseconds';
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/types.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COMPONENT_MAIN_TYPE_SERIES",
    ()=>COMPONENT_MAIN_TYPE_SERIES,
    "ROAM_ACTION_TYPE_SUFFIX",
    ()=>ROAM_ACTION_TYPE_SUFFIX,
    "SERIES_LAYOUT_BY_COLUMN",
    ()=>SERIES_LAYOUT_BY_COLUMN,
    "SERIES_LAYOUT_BY_ROW",
    ()=>SERIES_LAYOUT_BY_ROW,
    "SOURCE_FORMAT_ARRAY_ROWS",
    ()=>SOURCE_FORMAT_ARRAY_ROWS,
    "SOURCE_FORMAT_KEYED_COLUMNS",
    ()=>SOURCE_FORMAT_KEYED_COLUMNS,
    "SOURCE_FORMAT_OBJECT_ROWS",
    ()=>SOURCE_FORMAT_OBJECT_ROWS,
    "SOURCE_FORMAT_ORIGINAL",
    ()=>SOURCE_FORMAT_ORIGINAL,
    "SOURCE_FORMAT_TYPED_ARRAY",
    ()=>SOURCE_FORMAT_TYPED_ARRAY,
    "SOURCE_FORMAT_UNKNOWN",
    ()=>SOURCE_FORMAT_UNKNOWN,
    "UNDEFINED_STR",
    ()=>UNDEFINED_STR,
    "VISUAL_DIMENSIONS",
    ()=>VISUAL_DIMENSIONS
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
var UNDEFINED_STR = 'undefined';
var COMPONENT_MAIN_TYPE_SERIES = 'series';
;
;
var VISUAL_DIMENSIONS = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHashMap"])([
    'tooltip',
    'label',
    'itemName',
    'itemId',
    'itemGroupId',
    'itemChildGroupId',
    'seriesName'
]);
var SOURCE_FORMAT_ORIGINAL = 'original';
var SOURCE_FORMAT_ARRAY_ROWS = 'arrayRows';
var SOURCE_FORMAT_OBJECT_ROWS = 'objectRows';
var SOURCE_FORMAT_KEYED_COLUMNS = 'keyedColumns';
var SOURCE_FORMAT_TYPED_ARRAY = 'typedArray';
var SOURCE_FORMAT_UNKNOWN = 'unknown';
var SERIES_LAYOUT_BY_COLUMN = 'column';
var SERIES_LAYOUT_BY_ROW = 'row';
;
;
;
;
var ROAM_ACTION_TYPE_SUFFIX = 'Roam';
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/vendor.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Float32ArrayCtor",
    ()=>Float32ArrayCtor,
    "Float64ArrayCtor",
    ()=>Float64ArrayCtor,
    "Int16ArrayCtor",
    ()=>Int16ArrayCtor,
    "Int32ArrayCtor",
    ()=>Int32ArrayCtor,
    "Int8ArrayCtor",
    ()=>Int8ArrayCtor,
    "Uint16ArrayCtor",
    ()=>Uint16ArrayCtor,
    "Uint32ArrayCtor",
    ()=>Uint32ArrayCtor,
    "Uint8ArrayCtor",
    ()=>Uint8ArrayCtor,
    "Uint8ClampedArrayCtor",
    ()=>Uint8ClampedArrayCtor,
    "createFloat32Array",
    ()=>createFloat32Array,
    "tryEnsureTypedArray",
    ()=>tryEnsureTypedArray
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/types.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-client] (ecmascript)");
;
;
;
;
var Int8ArrayCtor = typeof Int8Array !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNDEFINED_STR"] ? Int8Array : undefined;
var Int16ArrayCtor = typeof Int16Array !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNDEFINED_STR"] ? Int16Array : undefined;
var Int32ArrayCtor = typeof Int32Array !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNDEFINED_STR"] ? Int32Array : undefined;
var Uint8ArrayCtor = typeof Uint8Array !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNDEFINED_STR"] ? Uint8Array : undefined;
var Uint16ArrayCtor = typeof Uint16Array !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNDEFINED_STR"] ? Uint16Array : undefined;
var Uint32ArrayCtor = typeof Uint32Array !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNDEFINED_STR"] ? Uint32Array : undefined;
var Uint8ClampedArrayCtor = typeof Uint8ClampedArray !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNDEFINED_STR"] ? Uint8ClampedArray : undefined;
var Float32ArrayCtor = typeof Float32Array !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNDEFINED_STR"] ? Float32Array : undefined;
var Float64ArrayCtor = typeof Float64Array !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNDEFINED_STR"] ? Float64Array : undefined;
function createFloat32Array(capacity) {
    return tryEnsureTypedArray({
        ctor: Float32ArrayCtor
    }, capacity).arr;
}
function tryEnsureTypedArray(tyArr, // Can add more types if needed.
// NOTICE: Callers need to manage data length themselves.
// Do not consider `capacity` as the data length.
capacity) {
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assert"])(capacity != null && isFinite(capacity) && capacity >= 0 && tyArr.hasOwnProperty('ctor'));
    }
    var existingArr = tyArr.arr;
    var ctor = tyArr.ctor;
    if (capacity > __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAX_SAFE_INTEGER"]) {
        capacity = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAX_SAFE_INTEGER"];
    }
    if (!existingArr || tyArr.typed && existingArr.length < capacity) {
        var nextArr = void 0;
        if (ctor) {
            try {
                // A large contiguous memory allocation may cause OOM.
                nextArr = new ctor(capacity);
                tyArr.typed = true;
                existingArr && nextArr.set(existingArr);
            } catch (e) {
                if ("TURBOPACK compile-time truthy", 1) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["error"])(e);
                }
            }
        }
        if (!nextArr) {
            nextArr = [];
            tyArr.typed = false;
            if (existingArr) {
                for(var i = 0, len = existingArr.length; i < len; i++){
                    nextArr[i] = existingArr[i];
                }
            }
        }
        tyArr.arr = nextArr;
    }
    return tyArr;
}
}),
]);

//# sourceMappingURL=10pt_echarts_lib_util_0g7jxfx._.js.map