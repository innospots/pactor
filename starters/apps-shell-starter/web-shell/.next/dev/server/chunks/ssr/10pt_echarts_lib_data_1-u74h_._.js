module.exports = [
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/DataDiffer.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
*/ function dataIndexMapValueLength(valNumOrArrLengthMoreThan2) {
    return valNumOrArrLengthMoreThan2 == null ? 0 : valNumOrArrLengthMoreThan2.length || 1;
}
function defaultKeyGetter(item) {
    return item;
}
var DataDiffer = /** @class */ function() {
    /**
   * @param context Can be visited by this.context in callback.
   */ function DataDiffer(oldArr, newArr, oldKeyGetter, newKeyGetter, context, // By default: 'oneToOne'.
    diffMode) {
        this._old = oldArr;
        this._new = newArr;
        this._oldKeyGetter = oldKeyGetter || defaultKeyGetter;
        this._newKeyGetter = newKeyGetter || defaultKeyGetter;
        // Visible in callback via `this.context`;
        this.context = context;
        this._diffModeMultiple = diffMode === 'multiple';
    }
    /**
   * Callback function when add a data
   */ DataDiffer.prototype.add = function(func) {
        this._add = func;
        return this;
    };
    /**
   * Callback function when update a data
   */ DataDiffer.prototype.update = function(func) {
        this._update = func;
        return this;
    };
    /**
   * Callback function when update a data and only work in `cbMode: 'byKey'`.
   */ DataDiffer.prototype.updateManyToOne = function(func) {
        this._updateManyToOne = func;
        return this;
    };
    /**
   * Callback function when update a data and only work in `cbMode: 'byKey'`.
   */ DataDiffer.prototype.updateOneToMany = function(func) {
        this._updateOneToMany = func;
        return this;
    };
    /**
   * Callback function when update a data and only work in `cbMode: 'byKey'`.
   */ DataDiffer.prototype.updateManyToMany = function(func) {
        this._updateManyToMany = func;
        return this;
    };
    /**
   * Callback function when remove a data
   */ DataDiffer.prototype.remove = function(func) {
        this._remove = func;
        return this;
    };
    DataDiffer.prototype.execute = function() {
        this[this._diffModeMultiple ? '_executeMultiple' : '_executeOneToOne']();
    };
    DataDiffer.prototype._executeOneToOne = function() {
        var oldArr = this._old;
        var newArr = this._new;
        var newDataIndexMap = {};
        var oldDataKeyArr = new Array(oldArr.length);
        var newDataKeyArr = new Array(newArr.length);
        this._initIndexMap(oldArr, null, oldDataKeyArr, '_oldKeyGetter');
        this._initIndexMap(newArr, newDataIndexMap, newDataKeyArr, '_newKeyGetter');
        for(var i = 0; i < oldArr.length; i++){
            var oldKey = oldDataKeyArr[i];
            var newIdxMapVal = newDataIndexMap[oldKey];
            var newIdxMapValLen = dataIndexMapValueLength(newIdxMapVal);
            // idx can never be empty array here. see 'set null' logic below.
            if (newIdxMapValLen > 1) {
                // Consider there is duplicate key (for example, use dataItem.name as key).
                // We should make sure every item in newArr and oldArr can be visited.
                var newIdx = newIdxMapVal.shift();
                if (newIdxMapVal.length === 1) {
                    newDataIndexMap[oldKey] = newIdxMapVal[0];
                }
                this._update && this._update(newIdx, i);
            } else if (newIdxMapValLen === 1) {
                newDataIndexMap[oldKey] = null;
                this._update && this._update(newIdxMapVal, i);
            } else {
                this._remove && this._remove(i);
            }
        }
        this._performRestAdd(newDataKeyArr, newDataIndexMap);
    };
    /**
   * For example, consider the case:
   * oldData: [o0, o1, o2, o3, o4, o5, o6, o7],
   * newData: [n0, n1, n2, n3, n4, n5, n6, n7, n8],
   * Where:
   *     o0, o1, n0 has key 'a' (many to one)
   *     o5, n4, n5, n6 has key 'b' (one to many)
   *     o2, n1 has key 'c' (one to one)
   *     n2, n3 has key 'd' (add)
   *     o3, o4 has key 'e' (remove)
   *     o6, o7, n7, n8 has key 'f' (many to many, treated as add and remove)
   * Then:
   *     (The order of the following directives are not ensured.)
   *     this._updateManyToOne(n0, [o0, o1]);
   *     this._updateOneToMany([n4, n5, n6], o5);
   *     this._update(n1, o2);
   *     this._remove(o3);
   *     this._remove(o4);
   *     this._remove(o6);
   *     this._remove(o7);
   *     this._add(n2);
   *     this._add(n3);
   *     this._add(n7);
   *     this._add(n8);
   */ DataDiffer.prototype._executeMultiple = function() {
        var oldArr = this._old;
        var newArr = this._new;
        var oldDataIndexMap = {};
        var newDataIndexMap = {};
        var oldDataKeyArr = [];
        var newDataKeyArr = [];
        this._initIndexMap(oldArr, oldDataIndexMap, oldDataKeyArr, '_oldKeyGetter');
        this._initIndexMap(newArr, newDataIndexMap, newDataKeyArr, '_newKeyGetter');
        for(var i = 0; i < oldDataKeyArr.length; i++){
            var oldKey = oldDataKeyArr[i];
            var oldIdxMapVal = oldDataIndexMap[oldKey];
            var newIdxMapVal = newDataIndexMap[oldKey];
            var oldIdxMapValLen = dataIndexMapValueLength(oldIdxMapVal);
            var newIdxMapValLen = dataIndexMapValueLength(newIdxMapVal);
            if (oldIdxMapValLen > 1 && newIdxMapValLen === 1) {
                this._updateManyToOne && this._updateManyToOne(newIdxMapVal, oldIdxMapVal);
                newDataIndexMap[oldKey] = null;
            } else if (oldIdxMapValLen === 1 && newIdxMapValLen > 1) {
                this._updateOneToMany && this._updateOneToMany(newIdxMapVal, oldIdxMapVal);
                newDataIndexMap[oldKey] = null;
            } else if (oldIdxMapValLen === 1 && newIdxMapValLen === 1) {
                this._update && this._update(newIdxMapVal, oldIdxMapVal);
                newDataIndexMap[oldKey] = null;
            } else if (oldIdxMapValLen > 1 && newIdxMapValLen > 1) {
                this._updateManyToMany && this._updateManyToMany(newIdxMapVal, oldIdxMapVal);
                newDataIndexMap[oldKey] = null;
            } else if (oldIdxMapValLen > 1) {
                for(var i_1 = 0; i_1 < oldIdxMapValLen; i_1++){
                    this._remove && this._remove(oldIdxMapVal[i_1]);
                }
            } else {
                this._remove && this._remove(oldIdxMapVal);
            }
        }
        this._performRestAdd(newDataKeyArr, newDataIndexMap);
    };
    DataDiffer.prototype._performRestAdd = function(newDataKeyArr, newDataIndexMap) {
        for(var i = 0; i < newDataKeyArr.length; i++){
            var newKey = newDataKeyArr[i];
            var newIdxMapVal = newDataIndexMap[newKey];
            var idxMapValLen = dataIndexMapValueLength(newIdxMapVal);
            if (idxMapValLen > 1) {
                for(var j = 0; j < idxMapValLen; j++){
                    this._add && this._add(newIdxMapVal[j]);
                }
            } else if (idxMapValLen === 1) {
                this._add && this._add(newIdxMapVal);
            }
            // Support both `newDataKeyArr` are duplication removed or not removed.
            newDataIndexMap[newKey] = null;
        }
    };
    DataDiffer.prototype._initIndexMap = function(arr, // Can be null.
    map, // In 'byKey', the output `keyArr` is duplication removed.
    // In 'byIndex', the output `keyArr` is not duplication removed and
    //     its indices are accurately corresponding to `arr`.
    keyArr, keyGetterName) {
        var cbModeMultiple = this._diffModeMultiple;
        for(var i = 0; i < arr.length; i++){
            // Add prefix to avoid conflict with Object.prototype.
            var key = '_ec_' + this[keyGetterName](arr[i], i);
            if (!cbModeMultiple) {
                keyArr[i] = key;
            }
            if (!map) {
                continue;
            }
            var idxMapVal = map[key];
            var idxMapValLen = dataIndexMapValueLength(idxMapVal);
            if (idxMapValLen === 0) {
                // Simple optimize: in most cases, one index has one key,
                // do not need array.
                map[key] = i;
                if (cbModeMultiple) {
                    keyArr.push(key);
                }
            } else if (idxMapValLen === 1) {
                map[key] = [
                    idxMapVal,
                    i
                ];
            } else {
                idxMapVal.push(i);
            }
        }
    };
    return DataDiffer;
}();
const __TURBOPACK__default__export__ = DataDiffer;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/DataStore.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CtorFloat64Array",
    ()=>CtorFloat64Array,
    "CtorInt32Array",
    ()=>CtorInt32Array,
    "CtorUint16Array",
    ()=>CtorUint16Array,
    "CtorUint32Array",
    ()=>CtorUint32Array,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/types.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataValueHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/dataValueHelper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Source$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/Source.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
var CtorUint32Array = typeof Uint32Array === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UNDEFINED_STR"] ? Array : Uint32Array;
var CtorUint16Array = typeof Uint16Array === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UNDEFINED_STR"] ? Array : Uint16Array;
var CtorInt32Array = typeof Int32Array === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UNDEFINED_STR"] ? Array : Int32Array;
var CtorFloat64Array = typeof Float64Array === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UNDEFINED_STR"] ? Array : Float64Array;
/**
 * Multi dimensional data store
 */ var dataCtors = {
    'float': CtorFloat64Array,
    'int': CtorInt32Array,
    // Ordinal data type can be string or int
    'ordinal': Array,
    'number': Array,
    'time': CtorFloat64Array
};
var defaultDimValueGetters;
function getIndicesCtor(rawCount) {
    // The possible max value in this._indicies is always this._rawCount despite of filtering.
    return rawCount > 65535 ? CtorUint32Array : CtorUint16Array;
}
;
function cloneChunk(originalChunk) {
    var Ctor = originalChunk.constructor;
    // Only shallow clone is enough when Array.
    return Ctor === Array ? originalChunk.slice() : new Ctor(originalChunk);
}
function prepareStore(store, dimIdx, dimType, end, append) {
    var DataCtor = dataCtors[dimType || 'float'];
    if (append) {
        var oldStore = store[dimIdx];
        var oldLen = oldStore && oldStore.length;
        if (!(oldLen === end)) {
            var newStore = new DataCtor(end);
            // The cost of the copy is probably inconsiderable
            // within the initial chunkSize.
            for(var j = 0; j < oldLen; j++){
                newStore[j] = oldStore[j];
            }
            store[dimIdx] = newStore;
        }
    } else {
        store[dimIdx] = new DataCtor(end);
    }
}
;
/**
 * Basically, DataStore API keep immutable.
 */ var DataStore = /** @class */ function() {
    function DataStore() {
        this._chunks = [];
        // It will not be calculated until needed.
        this._rawExtent = [];
        // structure:
        //  `const extentOnFilterOnDimension = this._extent[dim][extentFilterKey]`
        this._extent = [];
        // Count after filtered.
        this._count = 0;
        this._rawCount = 0;
        this._calcDimNameToIdx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
    }
    /**
   * Initialize from data
   */ DataStore.prototype.initData = function(provider, inputDimensions, dimValueGetter) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"])(provider.getItem) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"])(provider.count), 'Invalid data provider.');
        }
        this._provider = provider;
        // Clear
        this._chunks = [];
        this._indices = null;
        this.getRawIndex = this._getRawIdxIdentity;
        var source = provider.getSource();
        var defaultGetter = this.defaultDimValueGetter = defaultDimValueGetters[source.sourceFormat];
        // Default dim value getter
        this._dimValueGetter = dimValueGetter || defaultGetter;
        // Reset raw extent.
        this._rawExtent = [];
        var willRetrieveDataByName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Source$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shouldRetrieveDataByName"])(source);
        this._dimensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(inputDimensions, function(dim) {
            if ("TURBOPACK compile-time truthy", 1) {
                if (willRetrieveDataByName) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(dim.property != null);
                }
            }
            return {
                // Only pick these two props. Not leak other properties like orderMeta.
                type: dim.type,
                property: dim.property
            };
        });
        this._initDataFromProvider(0, provider.count());
    };
    DataStore.prototype.getProvider = function() {
        return this._provider;
    };
    /**
   * Caution: even when a `source` instance owned by a series, the created data store
   * may still be shared by different sereis (the source hash does not use all `source`
   * props, see `sourceManager`). In this case, the `source` props that are not used in
   * hash (like `source.dimensionDefine`) probably only belongs to a certain series and
   * thus should not be fetch here.
   */ DataStore.prototype.getSource = function() {
        return this._provider.getSource();
    };
    /**
   * @caution Only used in dataStack.
   */ DataStore.prototype.ensureCalculationDimension = function(dimName, type) {
        var calcDimNameToIdx = this._calcDimNameToIdx;
        var dimensions = this._dimensions;
        var calcDimIdx = calcDimNameToIdx.get(dimName);
        if (calcDimIdx != null) {
            if (dimensions[calcDimIdx].type === type) {
                return calcDimIdx;
            }
        } else {
            calcDimIdx = dimensions.length;
        }
        dimensions[calcDimIdx] = {
            type: type
        };
        calcDimNameToIdx.set(dimName, calcDimIdx);
        this._chunks[calcDimIdx] = new dataCtors[type || 'float'](this._rawCount);
        this._rawExtent[calcDimIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initExtentForUnion"])();
        return calcDimIdx;
    };
    DataStore.prototype.collectOrdinalMeta = function(dimIdx, ordinalMeta) {
        var chunk = this._chunks[dimIdx];
        var dim = this._dimensions[dimIdx];
        var rawExtents = this._rawExtent;
        var offset = dim.ordinalOffset || 0;
        var len = chunk.length;
        if (offset === 0) {
            // We need to reset the rawExtent if collect is from start.
            // Because this dimension may be guessed as number and calcuating a wrong extent.
            rawExtents[dimIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initExtentForUnion"])();
        }
        var dimRawExtent = rawExtents[dimIdx];
        // Parse from previous data offset. len may be changed after appendData
        for(var i = offset; i < len; i++){
            // See also CATEGORY_AXIS_MODEL_DATA_IS_EMPTY_ARRAY.
            var val = chunk[i] = ordinalMeta.parseAndCollect(chunk[i]);
            if (!isNaN(val)) {
                dimRawExtent[0] = Math.min(val, dimRawExtent[0]);
                dimRawExtent[1] = Math.max(val, dimRawExtent[1]);
            }
        }
        dim.ordinalMeta = ordinalMeta;
        dim.ordinalOffset = len;
        dim.type = 'ordinal'; // Force to be ordinal
    };
    DataStore.prototype.getOrdinalMeta = function(dimIdx) {
        var dimInfo = this._dimensions[dimIdx];
        var ordinalMeta = dimInfo.ordinalMeta;
        return ordinalMeta;
    };
    DataStore.prototype.getDimensionProperty = function(dimIndex) {
        var item = this._dimensions[dimIndex];
        return item && item.property;
    };
    /**
   * Caution: Can be only called on raw data (before `this._indices` created).
   */ DataStore.prototype.appendData = function(data) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(!this._indices, 'appendData can only be called on raw data.');
        }
        var provider = this._provider;
        var start = this.count();
        provider.appendData(data);
        var end = provider.count();
        if (!provider.persistent) {
            end += start;
        }
        if (start < end) {
            this._initDataFromProvider(start, end, true);
        }
        return [
            start,
            end
        ];
    };
    DataStore.prototype.appendValues = function(values, minFillLen) {
        var chunks = this._chunks;
        var dimensions = this._dimensions;
        var dimLen = dimensions.length;
        var rawExtent = this._rawExtent;
        var start = this.count();
        var end = start + Math.max(values.length, minFillLen || 0);
        for(var i = 0; i < dimLen; i++){
            var dim = dimensions[i];
            prepareStore(chunks, i, dim.type, end, true);
        }
        var emptyDataItem = [];
        for(var idx = start; idx < end; idx++){
            var sourceIdx = idx - start;
            // Store the data by dimensions
            for(var dimIdx = 0; dimIdx < dimLen; dimIdx++){
                var dim = dimensions[dimIdx];
                var val = defaultDimValueGetters.arrayRows.call(this, values[sourceIdx] || emptyDataItem, dim.property, sourceIdx, dimIdx);
                chunks[dimIdx][idx] = val;
                var dimRawExtent = rawExtent[dimIdx];
                val < dimRawExtent[0] && (dimRawExtent[0] = val);
                val > dimRawExtent[1] && (dimRawExtent[1] = val);
            }
        }
        this._rawCount = this._count = end;
        return {
            start: start,
            end: end
        };
    };
    DataStore.prototype._initDataFromProvider = function(start, end, append) {
        var provider = this._provider;
        var chunks = this._chunks;
        var dimensions = this._dimensions;
        var dimLen = dimensions.length;
        var rawExtent = this._rawExtent;
        var dimNames = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(dimensions, function(dim) {
            return dim.property;
        });
        for(var i = 0; i < dimLen; i++){
            var dim = dimensions[i];
            if (!rawExtent[i]) {
                rawExtent[i] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initExtentForUnion"])();
            }
            prepareStore(chunks, i, dim.type, end, append);
        }
        if (provider.fillStorage) {
            provider.fillStorage(start, end, chunks, rawExtent);
        } else {
            var dataItem = [];
            for(var idx = start; idx < end; idx++){
                // NOTICE: Try not to write things into dataItem
                dataItem = provider.getItem(idx, dataItem);
                // Each data item is value
                // [1, 2]
                // 2
                // Bar chart, line chart which uses category axis
                // only gives the 'y' value. 'x' value is the indices of category
                // Use a tempValue to normalize the value to be a (x, y) value
                // Store the data by dimensions
                for(var dimIdx = 0; dimIdx < dimLen; dimIdx++){
                    var dimStorage = chunks[dimIdx];
                    // PENDING NULL is empty or zero
                    var val = this._dimValueGetter(dataItem, dimNames[dimIdx], idx, dimIdx);
                    dimStorage[idx] = val;
                    var dimRawExtent = rawExtent[dimIdx];
                    val < dimRawExtent[0] && (dimRawExtent[0] = val);
                    val > dimRawExtent[1] && (dimRawExtent[1] = val);
                }
            }
        }
        if (!provider.persistent && provider.clean) {
            // Clean unused data if data source is typed array.
            provider.clean();
        }
        this._rawCount = this._count = end;
        // Reset data extent
        this._extent = [];
    };
    DataStore.prototype.count = function() {
        return this._count;
    };
    /**
   * Get value. Return NaN if idx is out of range.
   */ DataStore.prototype.get = function(dim, idx) {
        if (!(idx >= 0 && idx < this._count)) {
            return NaN;
        }
        var dimStore = this._chunks[dim];
        return dimStore ? dimStore[this.getRawIndex(idx)] : NaN;
    };
    DataStore.prototype.getValues = function(dimensions, idx) {
        var values = [];
        var dimArr = [];
        if (idx == null) {
            idx = dimensions;
            // TODO get all from store?
            dimensions = [];
            // All dimensions
            for(var i = 0; i < this._dimensions.length; i++){
                dimArr.push(i);
            }
        } else {
            dimArr = dimensions;
        }
        for(var i = 0, len = dimArr.length; i < len; i++){
            values.push(this.get(dimArr[i], idx));
        }
        return values;
    };
    /**
   * @param dim concrete dim
   */ DataStore.prototype.getByRawIndex = function(dim, rawIdx) {
        if (!(rawIdx >= 0 && rawIdx < this._rawCount)) {
            return NaN;
        }
        var dimStore = this._chunks[dim];
        return dimStore ? dimStore[rawIdx] : NaN;
    };
    /**
   * Get sum of data in one dimension
   */ DataStore.prototype.getSum = function(dim) {
        var dimData = this._chunks[dim];
        var sum = 0;
        if (dimData) {
            for(var i = 0, len = this.count(); i < len; i++){
                var value = this.get(dim, i);
                if (!isNaN(value)) {
                    sum += value;
                }
            }
        }
        return sum;
    };
    /**
   * Get median of data in one dimension
   */ DataStore.prototype.getMedian = function(dim) {
        var dimDataArray = [];
        // map all data of one dimension
        this.each([
            dim
        ], function(val) {
            if (!isNaN(val)) {
                dimDataArray.push(val);
            }
        });
        // TODO
        // Use quick select?
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asc"])(dimDataArray);
        var len = this.count();
        // calculate median
        return len === 0 ? 0 : len % 2 === 1 ? dimDataArray[(len - 1) / 2] : (dimDataArray[len / 2] + dimDataArray[len / 2 - 1]) / 2;
    };
    /**
   * Retrieve the index with given raw data index.
   */ DataStore.prototype.indexOfRawIndex = function(rawIndex) {
        if (rawIndex >= this._rawCount || rawIndex < 0) {
            return -1;
        }
        if (!this._indices) {
            return rawIndex;
        }
        // Indices are ascending
        var indices = this._indices;
        // If rawIndex === dataIndex
        var rawDataIndex = indices[rawIndex];
        if (rawDataIndex != null && rawDataIndex < this._count && rawDataIndex === rawIndex) {
            return rawIndex;
        }
        var left = 0;
        var right = this._count - 1;
        while(left <= right){
            var mid = (left + right) / 2 | 0;
            if (indices[mid] < rawIndex) {
                left = mid + 1;
            } else if (indices[mid] > rawIndex) {
                right = mid - 1;
            } else {
                return mid;
            }
        }
        return -1;
    };
    DataStore.prototype.getIndices = function() {
        var newIndices;
        var indices = this._indices;
        if (indices) {
            var Ctor = indices.constructor;
            var thisCount = this._count;
            // `new Array(a, b, c)` is different from `new Uint32Array(a, b, c)`.
            if (Ctor === Array) {
                newIndices = new Ctor(thisCount);
                for(var i = 0; i < thisCount; i++){
                    newIndices[i] = indices[i];
                }
            } else {
                newIndices = new Ctor(indices.buffer, 0, thisCount);
            }
        } else {
            var Ctor = getIndicesCtor(this._rawCount);
            newIndices = new Ctor(this.count());
            for(var i = 0; i < newIndices.length; i++){
                newIndices[i] = i;
            }
        }
        return newIndices;
    };
    /**
   * [NOTICE]: Performance-sensitive for large data.
   */ DataStore.prototype.filter = function(dims, cb) {
        if (!this._count) {
            return this;
        }
        var newStore = this.clone();
        var count = newStore.count();
        var Ctor = getIndicesCtor(newStore._rawCount);
        var newIndices = new Ctor(count);
        var value = [];
        var dimSize = dims.length;
        var offset = 0;
        var dim0 = dims[0];
        var chunks = newStore._chunks;
        for(var i = 0; i < count; i++){
            var keep = void 0;
            var rawIdx = newStore.getRawIndex(i);
            // Simple optimization
            if (dimSize === 0) {
                keep = cb(i);
            } else if (dimSize === 1) {
                var val = chunks[dim0][rawIdx];
                keep = cb(val, i);
            } else {
                var k = 0;
                for(; k < dimSize; k++){
                    value[k] = chunks[dims[k]][rawIdx];
                }
                value[k] = i;
                keep = cb.apply(null, value);
            }
            if (keep) {
                newIndices[offset++] = rawIdx;
            }
        }
        // Set indices after filtered.
        if (offset < count) {
            newStore._indices = newIndices;
        }
        newStore._count = offset;
        // Reset data extent
        newStore._extent = [];
        newStore._updateGetRawIdx();
        return newStore;
    };
    /**
   * Select data in range. (For optimization of filter)
   * (Manually inline code, support 5 million data filtering in data zoom.)
   */ DataStore.prototype.selectRange = function(range) {
        var newStore = this.clone();
        var len = newStore._count;
        if (!len) {
            return this;
        }
        var dims = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keys"])(range);
        var dimSize = dims.length;
        if (!dimSize) {
            return this;
        }
        var originalCount = newStore.count();
        var Ctor = getIndicesCtor(newStore._rawCount);
        var newIndices = new Ctor(originalCount);
        var offset = 0;
        var dim0 = dims[0];
        var min = range[dim0][0];
        var max = range[dim0][1];
        var storeArr = newStore._chunks;
        var quickFinished = false;
        if (!newStore._indices) {
            // Extreme optimization for common case. About 2x faster in chrome.
            var idx = 0;
            if (dimSize === 1) {
                var dimStorage = storeArr[dims[0]];
                for(var i = 0; i < len; i++){
                    var val = dimStorage[i];
                    // NaN will not be filtered. Consider the case, in line chart, empty
                    // value indicates the line should be broken. But for the case like
                    // scatter plot, a data item with empty value will not be rendered,
                    // but the axis extent may be effected if some other dim of the data
                    // item has value. Fortunately it is not a significant negative effect.
                    if (val >= min && val <= max || isNaN(val)) {
                        newIndices[offset++] = idx;
                    }
                    idx++;
                }
                quickFinished = true;
            } else if (dimSize === 2) {
                var dimStorage = storeArr[dims[0]];
                var dimStorage2 = storeArr[dims[1]];
                var min2 = range[dims[1]][0];
                var max2 = range[dims[1]][1];
                for(var i = 0; i < len; i++){
                    var val = dimStorage[i];
                    var val2 = dimStorage2[i];
                    // Do not filter NaN, see comment above.
                    if ((val >= min && val <= max || isNaN(val)) && (val2 >= min2 && val2 <= max2 || isNaN(val2))) {
                        newIndices[offset++] = idx;
                    }
                    idx++;
                }
                quickFinished = true;
            }
        }
        if (!quickFinished) {
            if (dimSize === 1) {
                for(var i = 0; i < originalCount; i++){
                    var rawIndex = newStore.getRawIndex(i);
                    var val = storeArr[dims[0]][rawIndex];
                    // Do not filter NaN, see comment above.
                    if (val >= min && val <= max || isNaN(val)) {
                        newIndices[offset++] = rawIndex;
                    }
                }
            } else {
                for(var i = 0; i < originalCount; i++){
                    var keep = true;
                    var rawIndex = newStore.getRawIndex(i);
                    for(var k = 0; k < dimSize; k++){
                        var dimk = dims[k];
                        var val = storeArr[dimk][rawIndex];
                        // Do not filter NaN, see comment above.
                        if (val < range[dimk][0] || val > range[dimk][1]) {
                            keep = false;
                        }
                    }
                    if (keep) {
                        newIndices[offset++] = newStore.getRawIndex(i);
                    }
                }
            }
        }
        // Set indices after filtered.
        if (offset < originalCount) {
            newStore._indices = newIndices;
        }
        newStore._count = offset;
        // Reset data extent
        newStore._extent = [];
        newStore._updateGetRawIdx();
        return newStore;
    };
    // /**
    //  * Data mapping to a plain array
    //  */
    // mapArray(dims: DimensionIndex[], cb: MapArrayCb): any[] {
    //     const result: any[] = [];
    //     this.each(dims, function () {
    //         result.push(cb && (cb as MapArrayCb).apply(null, arguments));
    //     });
    //     return result;
    // }
    /**
   * Data mapping to a new List with given dimensions
   */ DataStore.prototype.map = function(dims, cb) {
        // TODO only clone picked chunks.
        var target = this.clone(dims);
        this._updateDims(target, dims, cb);
        return target;
    };
    /**
   * @caution Danger!! Only used in dataStack.
   */ DataStore.prototype.modify = function(dims, cb) {
        this._updateDims(this, dims, cb);
    };
    DataStore.prototype._updateDims = function(target, dims, cb) {
        var targetChunks = target._chunks;
        var tmpRetValue = [];
        var dimSize = dims.length;
        var dataCount = target.count();
        var values = [];
        var rawExtent = target._rawExtent;
        for(var i = 0; i < dims.length; i++){
            rawExtent[dims[i]] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initExtentForUnion"])();
        }
        for(var dataIndex = 0; dataIndex < dataCount; dataIndex++){
            var rawIndex = target.getRawIndex(dataIndex);
            for(var k = 0; k < dimSize; k++){
                values[k] = targetChunks[dims[k]][rawIndex];
            }
            values[dimSize] = dataIndex;
            var retValue = cb && cb.apply(null, values);
            if (retValue != null) {
                // a number or string (in ordinal dimension)?
                if (typeof retValue !== 'object') {
                    tmpRetValue[0] = retValue;
                    retValue = tmpRetValue;
                }
                for(var i = 0; i < retValue.length; i++){
                    var dim = dims[i];
                    var val = retValue[i];
                    var rawExtentOnDim = rawExtent[dim];
                    var dimStore = targetChunks[dim];
                    if (dimStore) {
                        dimStore[rawIndex] = val;
                    }
                    if (val < rawExtentOnDim[0]) {
                        rawExtentOnDim[0] = val;
                    }
                    if (val > rawExtentOnDim[1]) {
                        rawExtentOnDim[1] = val;
                    }
                }
            }
        }
    };
    /**
   * Large data down sampling using largest-triangle-three-buckets
   * @param {string} valueDimension
   * @param {number} targetCount
   */ DataStore.prototype.lttbDownSample = function(valueDimension, rate) {
        var target = this.clone([
            valueDimension
        ], true);
        var targetStorage = target._chunks;
        var dimStore = targetStorage[valueDimension];
        var len = this.count();
        var sampledIndex = 0;
        var frameSize = Math.floor(1 / rate);
        var currentRawIndex = this.getRawIndex(0);
        var maxArea;
        var area;
        var nextRawIndex;
        var newIndices = new (getIndicesCtor(this._rawCount))(Math.min((Math.ceil(len / frameSize) + 2) * 2, len));
        // First frame use the first data.
        newIndices[sampledIndex++] = currentRawIndex;
        for(var i = 1; i < len - 1; i += frameSize){
            var nextFrameStart = Math.min(i + frameSize, len - 1);
            var nextFrameEnd = Math.min(i + frameSize * 2, len);
            var avgX = (nextFrameEnd + nextFrameStart) / 2;
            var avgY = 0;
            for(var idx = nextFrameStart; idx < nextFrameEnd; idx++){
                var rawIndex = this.getRawIndex(idx);
                var y = dimStore[rawIndex];
                if (isNaN(y)) {
                    continue;
                }
                avgY += y;
            }
            avgY /= nextFrameEnd - nextFrameStart;
            var frameStart = i;
            var frameEnd = Math.min(i + frameSize, len);
            var pointAX = i - 1;
            var pointAY = dimStore[currentRawIndex];
            maxArea = -1;
            nextRawIndex = frameStart;
            var firstNaNIndex = -1;
            var countNaN = 0;
            // Find a point from current frame that construct a triangle with largest area with previous selected point
            // And the average of next frame.
            for(var idx = frameStart; idx < frameEnd; idx++){
                var rawIndex = this.getRawIndex(idx);
                var y = dimStore[rawIndex];
                if (isNaN(y)) {
                    countNaN++;
                    if (firstNaNIndex < 0) {
                        firstNaNIndex = rawIndex;
                    }
                    continue;
                }
                // Calculate triangle area over three buckets
                area = Math.abs((pointAX - avgX) * (y - pointAY) - (pointAX - idx) * (avgY - pointAY));
                if (area > maxArea) {
                    maxArea = area;
                    nextRawIndex = rawIndex; // Next a is this b
                }
            }
            if (countNaN > 0 && countNaN < frameEnd - frameStart) {
                // Append first NaN point in every bucket.
                // It is necessary to ensure the correct order of indices.
                newIndices[sampledIndex++] = Math.min(firstNaNIndex, nextRawIndex);
                nextRawIndex = Math.max(firstNaNIndex, nextRawIndex);
            }
            newIndices[sampledIndex++] = nextRawIndex;
            currentRawIndex = nextRawIndex; // This a is the next a (chosen b)
        }
        // First frame use the last data.
        newIndices[sampledIndex++] = this.getRawIndex(len - 1);
        target._count = sampledIndex;
        target._indices = newIndices;
        target.getRawIndex = this._getRawIdx;
        return target;
    };
    /**
   * Large data down sampling using min-max
   * @param {string} valueDimension
   * @param {number} rate
   */ DataStore.prototype.minmaxDownSample = function(valueDimension, rate) {
        var target = this.clone([
            valueDimension
        ], true);
        var targetStorage = target._chunks;
        var frameSize = Math.floor(1 / rate);
        var dimStore = targetStorage[valueDimension];
        var len = this.count();
        // Each frame results in 2 data points, one for min and one for max
        var newIndices = new (getIndicesCtor(this._rawCount))(Math.ceil(len / frameSize) * 2);
        var offset = 0;
        for(var i = 0; i < len; i += frameSize){
            var minIndex = i;
            var minValue = dimStore[this.getRawIndex(minIndex)];
            var maxIndex = i;
            var maxValue = dimStore[this.getRawIndex(maxIndex)];
            var thisFrameSize = frameSize;
            // Handle final smaller frame
            if (i + frameSize > len) {
                thisFrameSize = len - i;
            }
            // Determine min and max within the current frame
            for(var k = 0; k < thisFrameSize; k++){
                var rawIndex = this.getRawIndex(i + k);
                var value = dimStore[rawIndex];
                if (value < minValue) {
                    minValue = value;
                    minIndex = i + k;
                }
                if (value > maxValue) {
                    maxValue = value;
                    maxIndex = i + k;
                }
            }
            var rawMinIndex = this.getRawIndex(minIndex);
            var rawMaxIndex = this.getRawIndex(maxIndex);
            // Set the order of the min and max values, based on their ordering in the frame
            if (minIndex < maxIndex) {
                newIndices[offset++] = rawMinIndex;
                newIndices[offset++] = rawMaxIndex;
            } else {
                newIndices[offset++] = rawMaxIndex;
                newIndices[offset++] = rawMinIndex;
            }
        }
        target._count = offset;
        target._indices = newIndices;
        target._updateGetRawIdx();
        return target;
    };
    /**
   * Large data down sampling on given dimension
   * @param sampleIndex Sample index for name and id
   */ DataStore.prototype.downSample = function(dimension, rate, sampleValue, sampleIndex) {
        var target = this.clone([
            dimension
        ], true);
        var targetStorage = target._chunks;
        var frameValues = [];
        var frameSize = Math.floor(1 / rate);
        var dimStore = targetStorage[dimension];
        var len = this.count();
        var rawExtentOnDim = target._rawExtent[dimension] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initExtentForUnion"])();
        var newIndices = new (getIndicesCtor(this._rawCount))(Math.ceil(len / frameSize));
        var offset = 0;
        for(var i = 0; i < len; i += frameSize){
            // Last frame
            if (frameSize > len - i) {
                frameSize = len - i;
                frameValues.length = frameSize;
            }
            for(var k = 0; k < frameSize; k++){
                var dataIdx = this.getRawIndex(i + k);
                frameValues[k] = dimStore[dataIdx];
            }
            var value = sampleValue(frameValues);
            var sampleFrameIdx = this.getRawIndex(Math.min(i + sampleIndex(frameValues, value) || 0, len - 1));
            // Only write value on the filtered data
            dimStore[sampleFrameIdx] = value;
            if (value < rawExtentOnDim[0]) {
                rawExtentOnDim[0] = value;
            }
            if (value > rawExtentOnDim[1]) {
                rawExtentOnDim[1] = value;
            }
            newIndices[offset++] = sampleFrameIdx;
        }
        target._count = offset;
        target._indices = newIndices;
        target._updateGetRawIdx();
        return target;
    };
    /**
   * Data iteration
   * @param ctx default this
   * @example
   *  list.each(0, function (x, idx) {});
   *  list.each([0, 1], function (x, y, idx) {});
   *  list.each(function (idx) {})
   */ DataStore.prototype.each = function(dims, cb) {
        if (!this._count) {
            return;
        }
        var dimSize = dims.length;
        var chunks = this._chunks;
        for(var i = 0, len = this.count(); i < len; i++){
            var rawIdx = this.getRawIndex(i);
            // Simple optimization
            switch(dimSize){
                case 0:
                    cb(i);
                    break;
                case 1:
                    cb(chunks[dims[0]][rawIdx], i);
                    break;
                case 2:
                    cb(chunks[dims[0]][rawIdx], chunks[dims[1]][rawIdx], i);
                    break;
                default:
                    var k = 0;
                    var value = [];
                    for(; k < dimSize; k++){
                        value[k] = chunks[dims[k]][rawIdx];
                    }
                    // Index
                    value[k] = i;
                    cb.apply(null, value);
            }
        }
    };
    DataStore.prototype.getDataExtent = function(dim, filter) {
        // Make sure use concrete dim as cache name.
        var dimData = this._chunks[dim];
        var initialExtent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initExtentForUnion"])();
        if (!dimData) {
            return initialExtent;
        }
        // Make more strict checkings to ensure hitting cache.
        var currEnd = this.count();
        // Consider the most cases when using data zoom, `getDataExtent`
        // happened before filtering. We cache raw extent, which is not
        // necessary to be cleared and recalculated when restore data.
        var useRaw = !this._indices && !filter;
        if (useRaw) {
            return this._rawExtent[dim].slice();
        }
        // NOTE:
        //  - In logarithm axis, zero should be excluded, therefore the `extent[0]` should be less or equal
        //    than the min positive data item, which requires the special handling here.
        //  - "Filter non-positive values for logarithm axis" can also be implemented in a data processor
        //    but that requires more complicated code to not break all streams under the current architecture,
        //    therefore we simply implement it here.
        //  - Performance is sensitive for large data, therefore inline filters rather than cb is used here.
        var thisExtent = this._extent;
        var dimExtentRecord = thisExtent[dim] || (thisExtent[dim] = {});
        var filterParsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataValueHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseSanitizationFilter"])(filter);
        var filterKey = filterParsed.key;
        var dimExtent = dimExtentRecord[filterKey];
        if (dimExtent) {
            return dimExtent.slice();
        }
        var min = initialExtent[0];
        var max = initialExtent[1];
        for(var i = 0; i < currEnd; i++){
            // NOTICE: Manually inline some code for performance of large data.
            var rawIdx = this.getRawIndex(i);
            var value = dimData[rawIdx];
            // NOTE: in most cases, filter does not exist.
            if (!filter || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataValueHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["passesSanitizationFilter"])(filterParsed, value)) {
                if (value < min) {
                    min = value;
                }
                if (value > max) {
                    max = value;
                }
            }
        }
        return dimExtentRecord[filterKey] = [
            min,
            max
        ];
    };
    /**
   * Get raw data item
   */ DataStore.prototype.getRawDataItem = function(idx) {
        var rawIdx = this.getRawIndex(idx);
        if (!this._provider.persistent) {
            var val = [];
            var chunks = this._chunks;
            for(var i = 0; i < chunks.length; i++){
                val.push(chunks[i][rawIdx]);
            }
            return val;
        } else {
            return this._provider.getItem(rawIdx);
        }
    };
    /**
   * Clone shallow.
   *
   * @param clonedDims Determine which dims to clone. Will share the data if not specified.
   */ DataStore.prototype.clone = function(clonedDims, ignoreIndices) {
        var target = new DataStore();
        var chunks = this._chunks;
        var clonedDimsMap = clonedDims && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["reduce"])(clonedDims, function(obj, dimIdx) {
            obj[dimIdx] = true;
            return obj;
        }, {});
        if (clonedDimsMap) {
            for(var i = 0; i < chunks.length; i++){
                // Not clone if dim is not picked.
                target._chunks[i] = !clonedDimsMap[i] ? chunks[i] : cloneChunk(chunks[i]);
            }
        } else {
            target._chunks = chunks;
        }
        this._copyCommonProps(target);
        if (!ignoreIndices) {
            target._indices = this._cloneIndices();
        }
        target._updateGetRawIdx();
        return target;
    };
    DataStore.prototype._copyCommonProps = function(target) {
        target._count = this._count;
        target._rawCount = this._rawCount;
        target._provider = this._provider;
        target._dimensions = this._dimensions;
        target._extent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clone"])(this._extent);
        target._rawExtent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clone"])(this._rawExtent);
    };
    DataStore.prototype._cloneIndices = function() {
        if (this._indices) {
            var Ctor = this._indices.constructor;
            var indices = void 0;
            if (Ctor === Array) {
                var thisCount = this._indices.length;
                indices = new Ctor(thisCount);
                for(var i = 0; i < thisCount; i++){
                    indices[i] = this._indices[i];
                }
            } else {
                indices = new Ctor(this._indices);
            }
            return indices;
        }
        return null;
    };
    DataStore.prototype._getRawIdxIdentity = function(idx) {
        return idx;
    };
    DataStore.prototype._getRawIdx = function(idx) {
        if (idx < this._count && idx >= 0) {
            return this._indices[idx];
        }
        return -1;
    };
    DataStore.prototype._updateGetRawIdx = function() {
        this.getRawIndex = this._indices ? this._getRawIdx : this._getRawIdxIdentity;
    };
    DataStore.internalField = function() {
        function getDimValueSimply(dataItem, property, dataIndex, dimIndex) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataValueHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseDataValue"])(dataItem[dimIndex], this._dimensions[dimIndex]);
        }
        defaultDimValueGetters = {
            arrayRows: getDimValueSimply,
            objectRows: function(dataItem, property, dataIndex, dimIndex) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataValueHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseDataValue"])(dataItem[property], this._dimensions[dimIndex]);
            },
            keyedColumns: getDimValueSimply,
            original: function(dataItem, property, dataIndex, dimIndex) {
                // Performance sensitive, do not use modelUtil.getDataItemValue.
                // If dataItem is an plain object with no value field, the let `value`
                // will be assigned with the object, but it will be tread correctly
                // in the `convertValue`.
                var value = dataItem && (dataItem.value == null ? dataItem : dataItem.value);
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataValueHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseDataValue"])(value instanceof Array ? value[dimIndex] : value, this._dimensions[dimIndex]);
            },
            typedArray: function(dataItem, property, dataIndex, dimIndex) {
                return dataItem[dimIndex];
            }
        };
    }();
    return DataStore;
}();
const __TURBOPACK__default__export__ = DataStore;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/Graph.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GraphEdge",
    ()=>GraphEdge,
    "GraphNode",
    ()=>GraphNode,
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
// id may be function name of Object, add a prefix to avoid this problem.
function generateNodeKey(id) {
    return '_EC_' + id;
}
var Graph = /** @class */ function() {
    function Graph(directed) {
        this.type = 'graph';
        this.nodes = [];
        this.edges = [];
        this._nodesMap = {};
        /**
     * @type {Object.<string, module:echarts/data/Graph.Edge>}
     * @private
     */ this._edgesMap = {};
        this._directed = directed || false;
    }
    /**
   * If is directed graph
   */ Graph.prototype.isDirected = function() {
        return this._directed;
    };
    ;
    /**
   * Add a new node
   */ Graph.prototype.addNode = function(id, dataIndex) {
        id = id == null ? '' + dataIndex : '' + id;
        var nodesMap = this._nodesMap;
        if (nodesMap[generateNodeKey(id)]) {
            if ("TURBOPACK compile-time truthy", 1) {
                console.error('Graph nodes have duplicate name or id');
            }
            return;
        }
        var node = new GraphNode(id, dataIndex);
        node.hostGraph = this;
        this.nodes.push(node);
        nodesMap[generateNodeKey(id)] = node;
        return node;
    };
    ;
    /**
   * Get node by data index
   */ Graph.prototype.getNodeByIndex = function(dataIndex) {
        var rawIdx = this.data.getRawIndex(dataIndex);
        return this.nodes[rawIdx];
    };
    ;
    /**
   * Get node by id
   */ Graph.prototype.getNodeById = function(id) {
        return this._nodesMap[generateNodeKey(id)];
    };
    ;
    /**
   * Add a new edge
   */ Graph.prototype.addEdge = function(n1, n2, dataIndex) {
        var nodesMap = this._nodesMap;
        var edgesMap = this._edgesMap;
        // PENDING
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNumber"](n1)) {
            n1 = this.nodes[n1];
        }
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNumber"](n2)) {
            n2 = this.nodes[n2];
        }
        if (!(n1 instanceof GraphNode)) {
            n1 = nodesMap[generateNodeKey(n1)];
        }
        if (!(n2 instanceof GraphNode)) {
            n2 = nodesMap[generateNodeKey(n2)];
        }
        if (!n1 || !n2) {
            return;
        }
        var key = n1.id + '-' + n2.id;
        var edge = new GraphEdge(n1, n2, dataIndex);
        edge.hostGraph = this;
        if (this._directed) {
            n1.outEdges.push(edge);
            n2.inEdges.push(edge);
        }
        n1.edges.push(edge);
        if (n1 !== n2) {
            n2.edges.push(edge);
        }
        this.edges.push(edge);
        edgesMap[key] = edge;
        return edge;
    };
    ;
    /**
   * Get edge by data index
   */ Graph.prototype.getEdgeByIndex = function(dataIndex) {
        var rawIdx = this.edgeData.getRawIndex(dataIndex);
        return this.edges[rawIdx];
    };
    ;
    /**
   * Get edge by two linked nodes
   */ Graph.prototype.getEdge = function(n1, n2) {
        if (n1 instanceof GraphNode) {
            n1 = n1.id;
        }
        if (n2 instanceof GraphNode) {
            n2 = n2.id;
        }
        var edgesMap = this._edgesMap;
        if (this._directed) {
            return edgesMap[n1 + '-' + n2];
        } else {
            return edgesMap[n1 + '-' + n2] || edgesMap[n2 + '-' + n1];
        }
    };
    ;
    /**
   * Iterate all nodes
   */ Graph.prototype.eachNode = function(cb, context) {
        var nodes = this.nodes;
        var len = nodes.length;
        for(var i = 0; i < len; i++){
            if (nodes[i].dataIndex >= 0) {
                cb.call(context, nodes[i], i);
            }
        }
    };
    ;
    /**
   * Iterate all edges
   */ Graph.prototype.eachEdge = function(cb, context) {
        var edges = this.edges;
        var len = edges.length;
        for(var i = 0; i < len; i++){
            if (edges[i].dataIndex >= 0 && edges[i].node1.dataIndex >= 0 && edges[i].node2.dataIndex >= 0) {
                cb.call(context, edges[i], i);
            }
        }
    };
    ;
    /**
   * Breadth first traverse
   * Return true to stop traversing
   */ Graph.prototype.breadthFirstTraverse = function(cb, startNode, direction, context) {
        if (!(startNode instanceof GraphNode)) {
            startNode = this._nodesMap[generateNodeKey(startNode)];
        }
        if (!startNode) {
            return;
        }
        var edgeType = direction === 'out' ? 'outEdges' : direction === 'in' ? 'inEdges' : 'edges';
        for(var i = 0; i < this.nodes.length; i++){
            this.nodes[i].__visited = false;
        }
        if (cb.call(context, startNode, null)) {
            return;
        }
        var queue = [
            startNode
        ];
        while(queue.length){
            var currentNode = queue.shift();
            var edges = currentNode[edgeType];
            for(var i = 0; i < edges.length; i++){
                var e = edges[i];
                var otherNode = e.node1 === currentNode ? e.node2 : e.node1;
                if (!otherNode.__visited) {
                    if (cb.call(context, otherNode, currentNode)) {
                        // Stop traversing
                        return;
                    }
                    queue.push(otherNode);
                    otherNode.__visited = true;
                }
            }
        }
    };
    ;
    // TODO
    // depthFirstTraverse(
    //     cb, startNode, direction, context
    // ) {
    // };
    // Filter update
    Graph.prototype.update = function() {
        var data = this.data;
        var edgeData = this.edgeData;
        var nodes = this.nodes;
        var edges = this.edges;
        for(var i = 0, len = nodes.length; i < len; i++){
            nodes[i].dataIndex = -1;
        }
        for(var i = 0, len = data.count(); i < len; i++){
            nodes[data.getRawIndex(i)].dataIndex = i;
        }
        edgeData.filterSelf(function(idx) {
            var edge = edges[edgeData.getRawIndex(idx)];
            return edge.node1.dataIndex >= 0 && edge.node2.dataIndex >= 0;
        });
        // Update edge
        for(var i = 0, len = edges.length; i < len; i++){
            edges[i].dataIndex = -1;
        }
        for(var i = 0, len = edgeData.count(); i < len; i++){
            edges[edgeData.getRawIndex(i)].dataIndex = i;
        }
    };
    ;
    /**
   * @return {module:echarts/data/Graph}
   */ Graph.prototype.clone = function() {
        var graph = new Graph(this._directed);
        var nodes = this.nodes;
        var edges = this.edges;
        for(var i = 0; i < nodes.length; i++){
            graph.addNode(nodes[i].id, nodes[i].dataIndex);
        }
        for(var i = 0; i < edges.length; i++){
            var e = edges[i];
            graph.addEdge(e.node1.id, e.node2.id, e.dataIndex);
        }
        return graph;
    };
    ;
    return Graph;
}();
var GraphNode = /** @class */ function() {
    function GraphNode(id, dataIndex) {
        this.inEdges = [];
        this.outEdges = [];
        this.edges = [];
        this.dataIndex = -1;
        this.id = id == null ? '' : id;
        this.dataIndex = dataIndex == null ? -1 : dataIndex;
    }
    /**
   * @return {number}
   */ GraphNode.prototype.degree = function() {
        return this.edges.length;
    };
    /**
   * @return {number}
   */ GraphNode.prototype.inDegree = function() {
        return this.inEdges.length;
    };
    /**
  * @return {number}
  */ GraphNode.prototype.outDegree = function() {
        return this.outEdges.length;
    };
    GraphNode.prototype.getModel = function(path) {
        if (this.dataIndex < 0) {
            return;
        }
        var graph = this.hostGraph;
        var itemModel = graph.data.getItemModel(this.dataIndex);
        return itemModel.getModel(path);
    };
    GraphNode.prototype.getAdjacentDataIndices = function() {
        var dataIndices = {
            edge: [],
            node: []
        };
        for(var i = 0; i < this.edges.length; i++){
            var adjacentEdge = this.edges[i];
            if (adjacentEdge.dataIndex < 0) {
                continue;
            }
            dataIndices.edge.push(adjacentEdge.dataIndex);
            dataIndices.node.push(adjacentEdge.node1.dataIndex, adjacentEdge.node2.dataIndex);
        }
        return dataIndices;
    };
    GraphNode.prototype.getTrajectoryDataIndices = function() {
        var connectedEdgesMap = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"]();
        var connectedNodesMap = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"]();
        for(var i = 0, len = this.edges.length; i < len; i++){
            var adjacentEdge = this.edges[i];
            if (adjacentEdge.dataIndex < 0) {
                continue;
            }
            connectedEdgesMap.set(adjacentEdge.dataIndex, true);
            var sourceNodesQueue = [
                adjacentEdge.node1
            ];
            var targetNodesQueue = [
                adjacentEdge.node2
            ];
            var nodeIteratorIndex = 0;
            while(nodeIteratorIndex < sourceNodesQueue.length){
                var sourceNode = sourceNodesQueue[nodeIteratorIndex];
                nodeIteratorIndex++;
                connectedNodesMap.set(sourceNode.dataIndex, true);
                var sourceNodeInEdges = sourceNode.inEdges;
                for(var j = 0, len_1 = sourceNodeInEdges.length, inEdge = void 0, inEdgeDataIndex = void 0; j < len_1; j++){
                    inEdge = sourceNodeInEdges[j];
                    inEdgeDataIndex = inEdge.dataIndex;
                    if (inEdgeDataIndex >= 0 && !connectedEdgesMap.hasKey(inEdgeDataIndex)) {
                        connectedEdgesMap.set(inEdgeDataIndex, true);
                        sourceNodesQueue.push(inEdge.node1);
                    }
                }
            }
            nodeIteratorIndex = 0;
            while(nodeIteratorIndex < targetNodesQueue.length){
                var targetNode = targetNodesQueue[nodeIteratorIndex];
                nodeIteratorIndex++;
                connectedNodesMap.set(targetNode.dataIndex, true);
                var targetNodeOutEdges = targetNode.outEdges;
                for(var j = 0, len_2 = targetNodeOutEdges.length, outEdge = void 0, outEdgeDataIndex = void 0; j < len_2; j++){
                    outEdge = targetNodeOutEdges[j];
                    outEdgeDataIndex = outEdge.dataIndex;
                    if (outEdgeDataIndex >= 0 && !connectedEdgesMap.hasKey(outEdgeDataIndex)) {
                        connectedEdgesMap.set(outEdgeDataIndex, true);
                        targetNodesQueue.push(outEdge.node2);
                    }
                }
            }
        }
        return {
            edge: connectedEdgesMap.keys(),
            node: connectedNodesMap.keys()
        };
    };
    return GraphNode;
}();
var GraphEdge = /** @class */ function() {
    function GraphEdge(n1, n2, dataIndex) {
        this.dataIndex = -1;
        this.node1 = n1;
        this.node2 = n2;
        this.dataIndex = dataIndex == null ? -1 : dataIndex;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    GraphEdge.prototype.getModel = function(path) {
        if (this.dataIndex < 0) {
            return;
        }
        var graph = this.hostGraph;
        var itemModel = graph.edgeData.getItemModel(this.dataIndex);
        return itemModel.getModel(path);
    };
    GraphEdge.prototype.getAdjacentDataIndices = function() {
        return {
            edge: [
                this.dataIndex
            ],
            node: [
                this.node1.dataIndex,
                this.node2.dataIndex
            ]
        };
    };
    GraphEdge.prototype.getTrajectoryDataIndices = function() {
        var connectedEdgesMap = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"]();
        var connectedNodesMap = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"]();
        connectedEdgesMap.set(this.dataIndex, true);
        var sourceNodes = [
            this.node1
        ];
        var targetNodes = [
            this.node2
        ];
        var nodeIteratorIndex = 0;
        while(nodeIteratorIndex < sourceNodes.length){
            var sourceNode = sourceNodes[nodeIteratorIndex];
            nodeIteratorIndex++;
            connectedNodesMap.set(sourceNode.dataIndex, true);
            var sourceNodeInEdges = sourceNode.inEdges;
            for(var j = 0, len = sourceNodeInEdges.length, inEdge = void 0, inEdgeDataIndex = void 0; j < len; j++){
                inEdge = sourceNode.inEdges[j];
                inEdgeDataIndex = inEdge.dataIndex;
                if (inEdgeDataIndex >= 0 && !connectedEdgesMap.hasKey(inEdgeDataIndex)) {
                    connectedEdgesMap.set(inEdgeDataIndex, true);
                    sourceNodes.push(inEdge.node1);
                }
            }
        }
        nodeIteratorIndex = 0;
        while(nodeIteratorIndex < targetNodes.length){
            var targetNode = targetNodes[nodeIteratorIndex];
            nodeIteratorIndex++;
            connectedNodesMap.set(targetNode.dataIndex, true);
            var targetNodeOutEdges = targetNode.outEdges;
            for(var j = 0, len = targetNodeOutEdges.length, outEdge = void 0, outEdgeDataIndex = void 0; j < len; j++){
                outEdge = targetNode.outEdges[j];
                outEdgeDataIndex = outEdge.dataIndex;
                if (outEdgeDataIndex >= 0 && !connectedEdgesMap.hasKey(outEdgeDataIndex)) {
                    connectedEdgesMap.set(outEdgeDataIndex, true);
                    targetNodes.push(outEdge.node2);
                }
            }
        }
        return {
            edge: connectedEdgesMap.keys(),
            node: connectedNodesMap.keys()
        };
    };
    return GraphEdge;
}();
function createGraphDataProxyMixin(hostName, dataName) {
    return {
        /**
     * @param Default 'value'. can be 'a', 'b', 'c', 'd', 'e'.
     */ getValue: function(dimension) {
            var data = this[hostName][dataName];
            return data.getStore().get(data.getDimensionIndex(dimension || 'value'), this.dataIndex);
        },
        // TODO: TYPE stricter type.
        setVisual: function(key, value) {
            this.dataIndex >= 0 && this[hostName][dataName].setItemVisual(this.dataIndex, key, value);
        },
        getVisual: function(key) {
            return this[hostName][dataName].getItemVisual(this.dataIndex, key);
        },
        setLayout: function(layout, merge) {
            this.dataIndex >= 0 && this[hostName][dataName].setItemLayout(this.dataIndex, layout, merge);
        },
        getLayout: function() {
            return this[hostName][dataName].getItemLayout(this.dataIndex);
        },
        getGraphicEl: function() {
            return this[hostName][dataName].getItemGraphicEl(this.dataIndex);
        },
        getRawIndex: function() {
            return this[hostName][dataName].getRawIndex(this.dataIndex);
        }
    };
}
;
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mixin"](GraphNode, createGraphDataProxyMixin('hostGraph', 'data'));
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mixin"](GraphEdge, createGraphDataProxyMixin('hostGraph', 'edgeData'));
const __TURBOPACK__default__export__ = Graph;
;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/OrdinalMeta.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var uidBase = 0;
var OrdinalMeta = /** @class */ function() {
    /**
   * PENDING - Regarding forcibly converting to string:
   *  In the early days, the underlying hash map impl used JS plain object and converted the key to
   *  string; later in https://github.com/ecomfe/zrender/pull/966 it was changed to a JS Map (in supported
   *  platforms), which does not require string keys. But consider any input that `scale/Ordinal['parse']`
   *  is involved, a number input represents an `OrdinalNumber` (i.e., an index), and affect the query
   *  behavior:
   *    - If forcbily converting to string:
   *      pros: users can use numeric string (such as, '123') to query the raw data (123), tho it's probably
   *      still confusing.
   *      cons: NaN/null/undefined in data will be equals to 'NaN'/'null'/'undefined', if simply using
   *      `val + ''` to convert them, like currently `getName` does.
   *    - Otherwise:
   *      pros: see NaN/null/undefined case above.
   *      cons: users cannot query the raw data (123) any more.
   *  There are two inconsistent behaviors in the current impl:
   *    - Force conversion is applied on the case `xAxis{data: ['aaa', 'bbb', ...]}`,
   *      but no conversion applied to the case `xAxis{data: [{value: 'aaa'}, ...]}` and
   *      the case `dataset: {source: [['aaa', 123], ['bbb', 234], ...]}`.
   *    - behaves differently according to whether JS Map is supported (the polyfill is simply using JS
   *      plain object) (tho it seems rare platform that do not support it).
   *  Since there's no sufficient good solution to offset cost of the breaking change, we preserve the
   *  current behavior, until real issues is reported.
   */ function OrdinalMeta(opt) {
        this.categories = opt.categories || [];
        this._needCollect = opt.needCollect;
        this._deduplication = opt.deduplication;
        this.uid = ++uidBase;
        this._onCollect = opt.onCollect;
    }
    OrdinalMeta.createByAxisModel = function(axisModel) {
        var option = axisModel.option;
        var data = option.data;
        var categories = data && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(data, getName);
        return new OrdinalMeta({
            categories: categories,
            needCollect: !categories,
            // deduplication is default in axis.
            deduplication: option.dedplication !== false
        });
    };
    ;
    OrdinalMeta.prototype.getOrdinal = function(category) {
        return this._getOrCreateMap().get(category);
    };
    /**
   * @return The ordinal. If not found, return NaN.
   */ OrdinalMeta.prototype.parseAndCollect = function(category) {
        var index;
        var needCollect = this._needCollect;
        // The value of category dim can be the index of the given category set.
        // This feature is only supported when !needCollect, because we should
        // consider a common case: a value is 2017, which is a number but is
        // expected to be tread as a category. This case usually happen in dataset,
        // where it happent to be no need of the index feature.
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(category) && !needCollect) {
            return category;
        }
        // Optimize for the scenario:
        // category is ['2012-01-01', '2012-01-02', ...], where the input
        // data has been ensured not duplicate and is large data.
        // Notice, if a dataset dimension provide categroies, usually echarts
        // should remove duplication except user tell echarts dont do that
        // (set axis.deduplication = false), because echarts do not know whether
        // the values in the category dimension has duplication (consider the
        // parallel-aqi example)
        if (needCollect && !this._deduplication) {
            index = this.categories.length;
            this.categories[index] = category;
            this._onCollect && this._onCollect(category, index);
            return index;
        }
        var map = this._getOrCreateMap();
        index = map.get(category);
        if (index == null) {
            if (needCollect) {
                index = this.categories.length;
                this.categories[index] = category;
                map.set(category, index);
                this._onCollect && this._onCollect(category, index);
            } else {
                index = NaN;
            }
        }
        return index;
    };
    // Consider big data, do not create map until needed.
    OrdinalMeta.prototype._getOrCreateMap = function() {
        return this._map || (this._map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])(this.categories));
    };
    return OrdinalMeta;
}();
function getName(obj) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(obj) && obj.value != null) {
        return obj.value;
    } else {
        return obj + '';
    }
}
const __TURBOPACK__default__export__ = OrdinalMeta;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/SeriesData.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
*/ /* global Int32Array */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$DataDiffer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/DataDiffer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/dataProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dimensionHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/dimensionHelper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$SeriesDimensionDefine$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/SeriesDimensionDefine.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/types.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/innerStore.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Source$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/Source.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$DataStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/DataStore.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$SeriesDataSchema$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/SeriesDataSchema.js [app-ssr] (ecmascript)");
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
var isObject = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"];
var map = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"];
var CtorInt32Array = typeof Int32Array === 'undefined' ? Array : Int32Array;
// Use prefix to avoid index to be the same as otherIdList[idx],
// which will cause weird update animation.
var ID_PREFIX = 'e\0\0';
var INDEX_NOT_FOUND = -1;
// type SeriesDimensionIndex = DimensionIndex;
var TRANSFERABLE_PROPERTIES = [
    'hasItemOption',
    '_nameList',
    '_idList',
    '_invertedIndicesMap',
    '_dimSummary',
    'userOutput',
    '_rawData',
    '_dimValueGetter',
    '_nameDimIdx',
    '_idDimIdx',
    '_nameRepeatCount'
];
var CLONE_PROPERTIES = [
    '_approximateExtent'
];
// -----------------------------
// Internal method declarations:
// -----------------------------
var prepareInvertedIndex;
var getId;
var getIdNameFromStore;
var normalizeDimensions;
var transferProperties;
var cloneListForMapAndSample;
var makeIdFromName;
var SeriesData = /** @class */ function() {
    /**
   * @param dimensionsInput.dimensions
   *        For example, ['someDimName', {name: 'someDimName', type: 'someDimType'}, ...].
   *        Dimensions should be concrete names like x, y, z, lng, lat, angle, radius
   */ function SeriesData(dimensionsInput, hostModel) {
        this.type = 'list';
        this._dimOmitted = false;
        this._nameList = [];
        this._idList = [];
        // Models of data option is stored sparse for optimizing memory cost
        // Never used yet (not used yet).
        // private _optionModels: Model[] = [];
        // Global visual properties after visual coding
        this._visual = {};
        // Global layout properties.
        this._layout = {};
        // Item visual properties after visual coding
        this._itemVisuals = [];
        // Item layout properties after layout
        this._itemLayouts = [];
        // Graphic elements
        this._graphicEls = [];
        // key: dim, value: extent
        this._approximateExtent = {};
        this._calculationInfo = {};
        // Having detected that there is data item is non primitive type
        // (in type `OptionDataItemObject`).
        // Like `data: [ { value: xx, itemStyle: {...} }, ...]`
        // At present it only happen in `SOURCE_FORMAT_ORIGINAL`.
        this.hasItemOption = false;
        // Methods that create a new list based on this list should be listed here.
        // Notice that those method should `RETURN` the new list.
        this.TRANSFERABLE_METHODS = [
            'cloneShallow',
            'downSample',
            'minmaxDownSample',
            'lttbDownSample',
            'map'
        ];
        // Methods that change indices of this list should be listed here.
        this.CHANGABLE_METHODS = [
            'filterSelf',
            'selectRange'
        ];
        this.DOWNSAMPLE_METHODS = [
            'downSample',
            'minmaxDownSample',
            'lttbDownSample'
        ];
        var dimensions;
        var assignStoreDimIdx = false;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$SeriesDataSchema$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isSeriesDataSchema"])(dimensionsInput)) {
            dimensions = dimensionsInput.dimensions;
            this._dimOmitted = dimensionsInput.isDimensionOmitted();
            this._schema = dimensionsInput;
        } else {
            assignStoreDimIdx = true;
            dimensions = dimensionsInput;
        }
        dimensions = dimensions || [
            'x',
            'y'
        ];
        var dimensionInfos = {};
        var dimensionNames = [];
        var invertedIndicesMap = {};
        var needsHasOwn = false;
        var emptyObj = {};
        for(var i = 0; i < dimensions.length; i++){
            // Use the original dimensions[i], where other flag props may exists.
            var dimInfoInput = dimensions[i];
            var dimensionInfo = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"](dimInfoInput) ? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$SeriesDimensionDefine$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]({
                name: dimInfoInput
            }) : !(dimInfoInput instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$SeriesDimensionDefine$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]) ? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$SeriesDimensionDefine$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](dimInfoInput) : dimInfoInput;
            var dimensionName = dimensionInfo.name;
            dimensionInfo.type = dimensionInfo.type || 'float';
            if (!dimensionInfo.coordDim) {
                dimensionInfo.coordDim = dimensionName;
                dimensionInfo.coordDimIndex = 0;
            }
            var otherDims = dimensionInfo.otherDims = dimensionInfo.otherDims || {};
            dimensionNames.push(dimensionName);
            dimensionInfos[dimensionName] = dimensionInfo;
            if (emptyObj[dimensionName] != null) {
                needsHasOwn = true;
            }
            if (dimensionInfo.createInvertedIndices) {
                invertedIndicesMap[dimensionName] = [];
            }
            if ("TURBOPACK compile-time truthy", 1) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"](assignStoreDimIdx || dimensionInfo.storeDimIndex >= 0);
            }
            if (assignStoreDimIdx) {
                dimensionInfo.storeDimIndex = i;
            }
            if (otherDims.itemName === 0) {
                this._nameDimIdx = dimensionInfo.storeDimIndex;
            }
            if (otherDims.itemId === 0) {
                this._idDimIdx = dimensionInfo.storeDimIndex;
            }
        }
        this.dimensions = dimensionNames;
        this._dimInfos = dimensionInfos;
        this._initGetDimensionInfo(needsHasOwn);
        this.hostModel = hostModel;
        this._invertedIndicesMap = invertedIndicesMap;
        if (this._dimOmitted) {
            var dimIdxToName_1 = this._dimIdxToName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"]();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](dimensionNames, function(dimName) {
                dimIdxToName_1.set(dimensionInfos[dimName].storeDimIndex, dimName);
            });
        }
    }
    /**
   *
   * Get concrete dimension name by dimension name or dimension index.
   * If input a dimension name, do not validate whether the dimension name exits.
   *
   * @caution
   * @param dim Must make sure the dimension is `SeriesDimensionLoose`.
   * Because only those dimensions will have auto-generated dimension names if not
   * have a user-specified name, and other dimensions will get a return of null/undefined.
   *
   * @notice Because of this reason, should better use `getDimensionIndex` instead, for examples:
   * ```js
   * const val = data.getStore().get(data.getDimensionIndex(dim), dataIdx);
   * ```
   *
   * @return Concrete dim name.
   */ SeriesData.prototype.getDimension = function(dim) {
        var dimIdx = this._recognizeDimIndex(dim);
        if (dimIdx == null) {
            return dim;
        }
        dimIdx = dim;
        if (!this._dimOmitted) {
            return this.dimensions[dimIdx];
        }
        // Retrieve from series dimension definition because it probably contains
        // generated dimension name (like 'x', 'y').
        var dimName = this._dimIdxToName.get(dimIdx);
        if (dimName != null) {
            return dimName;
        }
        var sourceDimDef = this._schema.getSourceDimension(dimIdx);
        if (sourceDimDef) {
            return sourceDimDef.name;
        }
    };
    /**
   * Get dimension index in data store. Return -1 if not found.
   * Can be used to index value from getRawValue.
   */ SeriesData.prototype.getDimensionIndex = function(dim) {
        var dimIdx = this._recognizeDimIndex(dim);
        if (dimIdx != null) {
            return dimIdx;
        }
        if (dim == null) {
            return -1;
        }
        var dimInfo = this._getDimInfo(dim);
        return dimInfo ? dimInfo.storeDimIndex : this._dimOmitted ? this._schema.getSourceDimensionIndex(dim) : -1;
    };
    /**
   * The meanings of the input parameter `dim`:
   *
   * + If dim is a number (e.g., `1`), it means the index of the dimension.
   *   For example, `getDimension(0)` will return 'x' or 'lng' or 'radius'.
   * + If dim is a number-like string (e.g., `"1"`):
   *     + If there is the same concrete dim name defined in `series.dimensions` or `dataset.dimensions`,
   *        it means that concrete name.
   *     + If not, it will be converted to a number, which means the index of the dimension.
   *        (why? because of the backward compatibility. We have been tolerating number-like string in
   *        dimension setting, although now it seems that it is not a good idea.)
   *     For example, `visualMap[i].dimension: "1"` is the same meaning as `visualMap[i].dimension: 1`,
   *     if no dimension name is defined as `"1"`.
   * + If dim is a not-number-like string, it means the concrete dim name.
   *   For example, it can be be default name `"x"`, `"y"`, `"z"`, `"lng"`, `"lat"`, `"angle"`, `"radius"`,
   *   or customized in `dimensions` property of option like `"age"`.
   *
   * @return recognized `DimensionIndex`. Otherwise return null/undefined (means that dim is `DimensionName`).
   */ SeriesData.prototype._recognizeDimIndex = function(dim) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNumber"](dim) || dim != null && !isNaN(dim) && !this._getDimInfo(dim) && (!this._dimOmitted || this._schema.getSourceDimensionIndex(dim) < 0)) {
            return +dim;
        }
    };
    SeriesData.prototype._getStoreDimIndex = function(dim) {
        var dimIdx = this.getDimensionIndex(dim);
        if ("TURBOPACK compile-time truthy", 1) {
            if (dimIdx == null) {
                throw new Error('Unknown dimension ' + dim);
            }
        }
        return dimIdx;
    };
    /**
   * Get type and calculation info of particular dimension
   * @param dim
   *        Dimension can be concrete names like x, y, z, lng, lat, angle, radius
   *        Or a ordinal number. For example getDimensionInfo(0) will return 'x' or 'lng' or 'radius'
   */ SeriesData.prototype.getDimensionInfo = function(dim) {
        // Do not clone, because there may be categories in dimInfo.
        return this._getDimInfo(this.getDimension(dim));
    };
    SeriesData.prototype._initGetDimensionInfo = function(needsHasOwn) {
        var dimensionInfos = this._dimInfos;
        this._getDimInfo = needsHasOwn ? function(dimName) {
            return dimensionInfos.hasOwnProperty(dimName) ? dimensionInfos[dimName] : undefined;
        } : function(dimName) {
            return dimensionInfos[dimName];
        };
    };
    /**
   * concrete dimension name list on coord.
   */ SeriesData.prototype.getDimensionsOnCoord = function() {
        return this._dimSummary.dataDimsOnCoord.slice();
    };
    SeriesData.prototype.mapDimension = function(coordDim, idx) {
        var dimensionsSummary = this._dimSummary;
        if (idx == null) {
            return dimensionsSummary.encodeFirstDimNotExtra[coordDim];
        }
        var dims = dimensionsSummary.encode[coordDim];
        return dims ? dims[idx] : null;
    };
    SeriesData.prototype.mapDimensionsAll = function(coordDim) {
        var dimensionsSummary = this._dimSummary;
        var dims = dimensionsSummary.encode[coordDim];
        return (dims || []).slice();
    };
    SeriesData.prototype.getStore = function() {
        return this._store;
    };
    /**
   * Initialize from data
   * @param data source or data or data store.
   * @param nameList The name of a datum is used on data diff and
   *        default label/tooltip.
   *        A name can be specified in encode.itemName,
   *        or dataItem.name (only for series option data),
   *        or provided in nameList from outside.
   */ SeriesData.prototype.initData = function(data, nameList, dimValueGetter) {
        var _this = this;
        var store;
        if (data instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$DataStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]) {
            store = data;
        }
        if (!store) {
            var dimensions = this.dimensions;
            var provider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Source$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isSourceInstance"])(data) || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArrayLike"](data) ? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DefaultDataProvider"](data, dimensions.length) : data;
            store = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$DataStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]();
            var dimensionInfos = map(dimensions, function(dimName) {
                return {
                    type: _this._dimInfos[dimName].type,
                    property: dimName
                };
            });
            store.initData(provider, dimensionInfos, dimValueGetter);
        }
        this._store = store;
        // Reset
        this._nameList = (nameList || []).slice();
        this._idList = [];
        this._nameRepeatCount = {};
        this._doInit(0, store.count());
        // Cache summary info for fast visit. See "dimensionHelper".
        // Needs to be initialized after store is prepared.
        this._dimSummary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dimensionHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["summarizeDimensions"])(this, this._schema);
        this.userOutput = this._dimSummary.userOutput;
    };
    /**
   * Caution: Can be only called on raw data (before `this._indices` created).
   */ SeriesData.prototype.appendData = function(data) {
        var range = this._store.appendData(data);
        this._doInit(range[0], range[1]);
    };
    /**
   * Caution: Can be only called on raw data (before `this._indices` created).
   * This method does not modify `rawData` (`dataProvider`), but only
   * add values to store.
   *
   * The final count will be increased by `Math.max(values.length, names.length)`.
   *
   * @param values That is the SourceType: 'arrayRows', like
   *        [
   *            [12, 33, 44],
   *            [NaN, 43, 1],
   *            ['-', 'asdf', 0]
   *        ]
   *        Each item is exactly corresponding to a dimension.
   */ SeriesData.prototype.appendValues = function(values, names) {
        var _a = this._store.appendValues(values, names && names.length), start = _a.start, end = _a.end;
        var shouldMakeIdFromName = this._shouldMakeIdFromName();
        this._updateOrdinalMeta();
        if (names) {
            for(var idx = start; idx < end; idx++){
                var sourceIdx = idx - start;
                this._nameList[idx] = names[sourceIdx];
                if (shouldMakeIdFromName) {
                    makeIdFromName(this, idx);
                }
            }
        }
    };
    SeriesData.prototype._updateOrdinalMeta = function() {
        var store = this._store;
        var dimensions = this.dimensions;
        for(var i = 0; i < dimensions.length; i++){
            var dimInfo = this._dimInfos[dimensions[i]];
            if (dimInfo.ordinalMeta) {
                store.collectOrdinalMeta(dimInfo.storeDimIndex, dimInfo.ordinalMeta);
            }
        }
    };
    SeriesData.prototype._shouldMakeIdFromName = function() {
        var provider = this._store.getProvider();
        return this._idDimIdx == null && provider.getSource().sourceFormat !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_TYPED_ARRAY"] && !provider.fillStorage;
    };
    SeriesData.prototype._doInit = function(start, end) {
        if (start >= end) {
            return;
        }
        var store = this._store;
        var provider = store.getProvider();
        this._updateOrdinalMeta();
        var nameList = this._nameList;
        var idList = this._idList;
        var sourceFormat = provider.getSource().sourceFormat;
        var isFormatOriginal = sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ORIGINAL"];
        // Each data item is value
        // [1, 2]
        // 2
        // Bar chart, line chart which uses category axis
        // only gives the 'y' value. 'x' value is the indices of category
        // Use a tempValue to normalize the value to be a (x, y) value
        // If dataItem is {name: ...} or {id: ...}, it has highest priority.
        // This kind of ids and names are always stored `_nameList` and `_idList`.
        if (isFormatOriginal && !provider.pure) {
            var sharedDataItem = [];
            for(var idx = start; idx < end; idx++){
                // NOTICE: Try not to write things into dataItem
                var dataItem = provider.getItem(idx, sharedDataItem);
                if (!this.hasItemOption && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDataItemOption"])(dataItem)) {
                    this.hasItemOption = true;
                }
                if (dataItem) {
                    var itemName = dataItem.name;
                    if (nameList[idx] == null && itemName != null) {
                        nameList[idx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["convertOptionIdName"])(itemName, null);
                    }
                    var itemId = dataItem.id;
                    if (idList[idx] == null && itemId != null) {
                        idList[idx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["convertOptionIdName"])(itemId, null);
                    }
                }
            }
        }
        if (this._shouldMakeIdFromName()) {
            for(var idx = start; idx < end; idx++){
                makeIdFromName(this, idx);
            }
        }
        prepareInvertedIndex(this);
    };
    /**
   * Optimize for the scenario that data is filtered by a given extent.
   * Consider that if data amount is more than hundreds of thousand,
   * extent calculation will cost more than 10ms and the cache will
   * be erased because of the filtering.
   */ SeriesData.prototype.getApproximateExtent = function(dim, filter) {
        return this._approximateExtent[dim] || this._store.getDataExtent(this._getStoreDimIndex(dim), filter);
    };
    /**
   * NOTICE: `_approximateExtent` does not support filter. Callers must ensure the input extent
   * to be handled by `scale.sanitizeExtent`.
   *
   * Calculate extent on a filtered data might be time consuming.
   * Approximate extent is only used for: calculate extent of filtered data outside.
   */ SeriesData.prototype.setApproximateExtent = function(extent, dim) {
        dim = this.getDimension(dim);
        this._approximateExtent[dim] = extent.slice();
    };
    SeriesData.prototype.getCalculationInfo = function(key) {
        return this._calculationInfo[key];
    };
    SeriesData.prototype.setCalculationInfo = function(key, value) {
        isObject(key) ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"](this._calculationInfo, key) : this._calculationInfo[key] = value;
    };
    /**
   * @return Never be null/undefined. `number` will be converted to string. Because:
   * In most cases, name is used in display, where returning a string is more convenient.
   * In other cases, name is used in query (see `indexOfName`), where we can keep the
   * rule that name `2` equals to name `'2'`.
   */ SeriesData.prototype.getName = function(idx) {
        var rawIndex = this.getRawIndex(idx);
        var name = this._nameList[rawIndex];
        if (name == null && this._nameDimIdx != null) {
            name = getIdNameFromStore(this, this._nameDimIdx, rawIndex);
        }
        if (name == null) {
            name = '';
        }
        return name;
    };
    SeriesData.prototype._getCategory = function(dimIdx, idx) {
        var ordinal = this._store.get(dimIdx, idx);
        var ordinalMeta = this._store.getOrdinalMeta(dimIdx);
        if (ordinalMeta) {
            return ordinalMeta.categories[ordinal];
        }
        return ordinal;
    };
    /**
   * @return Never null/undefined. `number` will be converted to string. Because:
   * In all cases having encountered at present, id is used in making diff comparison, which
   * are usually based on hash map. We can keep the rule that the internal id are always string
   * (treat `2` is the same as `'2'`) to make the related logic simple.
   */ SeriesData.prototype.getId = function(idx) {
        return getId(this, this.getRawIndex(idx));
    };
    SeriesData.prototype.count = function() {
        return this._store.count();
    };
    /**
   * Get value. Return NaN if idx is out of range.
   *
   * @notice Should better to use `data.getStore().get(dimIndex, dataIdx)` instead.
   */ SeriesData.prototype.get = function(dim, idx) {
        var store = this._store;
        var dimInfo = this._dimInfos[dim];
        if (dimInfo) {
            return store.get(dimInfo.storeDimIndex, idx);
        }
    };
    /**
   * @notice Should better to use `data.getStore().getByRawIndex(dimIndex, dataIdx)` instead.
   */ SeriesData.prototype.getByRawIndex = function(dim, rawIdx) {
        var store = this._store;
        var dimInfo = this._dimInfos[dim];
        if (dimInfo) {
            return store.getByRawIndex(dimInfo.storeDimIndex, rawIdx);
        }
    };
    SeriesData.prototype.getIndices = function() {
        return this._store.getIndices();
    };
    SeriesData.prototype.getDataExtent = function(dim) {
        return this._store.getDataExtent(this._getStoreDimIndex(dim), null);
    };
    SeriesData.prototype.getSum = function(dim) {
        return this._store.getSum(this._getStoreDimIndex(dim));
    };
    SeriesData.prototype.getMedian = function(dim) {
        return this._store.getMedian(this._getStoreDimIndex(dim));
    };
    SeriesData.prototype.getValues = function(dimensions, idx) {
        var _this = this;
        var store = this._store;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"](dimensions) ? store.getValues(map(dimensions, function(dim) {
            return _this._getStoreDimIndex(dim);
        }), idx) : store.getValues(dimensions);
    };
    /**
   * If value is NaN. Including '-'
   * Only check the coord dimensions.
   */ SeriesData.prototype.hasValue = function(idx) {
        var dataDimIndicesOnCoord = this._dimSummary.dataDimIndicesOnCoord;
        for(var i = 0, len = dataDimIndicesOnCoord.length; i < len; i++){
            // Ordinal type originally can be string or number.
            // But when an ordinal type is used on coord, it can
            // not be string but only number. So we can also use isNaN.
            if (isNaN(this._store.get(dataDimIndicesOnCoord[i], idx))) {
                return false;
            }
        }
        return true;
    };
    /**
   * Retrieve the index with given name
   */ SeriesData.prototype.indexOfName = function(name) {
        for(var i = 0, len = this._store.count(); i < len; i++){
            if (this.getName(i) === name) {
                return i;
            }
        }
        return -1;
    };
    SeriesData.prototype.getRawIndex = function(idx) {
        return this._store.getRawIndex(idx);
    };
    SeriesData.prototype.indexOfRawIndex = function(rawIndex) {
        return this._store.indexOfRawIndex(rawIndex);
    };
    /**
   * Only support the dimension which inverted index created.
   * Do not support other cases until required.
   * @param dim concrete dim
   * @param value ordinal index
   * @return rawIndex
   */ SeriesData.prototype.rawIndexOf = function(dim, value) {
        var invertedIndices = dim && this._invertedIndicesMap[dim];
        if ("TURBOPACK compile-time truthy", 1) {
            if (!invertedIndices) {
                throw new Error('Do not supported yet');
            }
        }
        var rawIndex = invertedIndices && invertedIndices[value];
        if (rawIndex == null || isNaN(rawIndex)) {
            return INDEX_NOT_FOUND;
        }
        return rawIndex;
    };
    SeriesData.prototype.each = function(dims, cb, ctx) {
        'use strict';
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"](dims)) {
            ctx = cb;
            cb = dims;
            dims = [];
        }
        // ctxCompat just for compat echarts3
        var fCtx = ctx || this;
        var dimIndices = map(normalizeDimensions(dims), this._getStoreDimIndex, this);
        this._store.each(dimIndices, fCtx ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bind"](cb, fCtx) : cb);
    };
    SeriesData.prototype.filterSelf = function(dims, cb, ctx) {
        'use strict';
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"](dims)) {
            ctx = cb;
            cb = dims;
            dims = [];
        }
        // ctxCompat just for compat echarts3
        var fCtx = ctx || this;
        var dimIndices = map(normalizeDimensions(dims), this._getStoreDimIndex, this);
        this._store = this._store.filter(dimIndices, fCtx ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bind"](cb, fCtx) : cb);
        return this;
    };
    /**
   * Select data in range. (For optimization of filter)
   * (Manually inline code, support 5 million data filtering in data zoom.)
   */ SeriesData.prototype.selectRange = function(range) {
        'use strict';
        var _this = this;
        var innerRange = {};
        var dims = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keys"](range);
        var dimIndices = [];
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](dims, function(dim) {
            var dimIdx = _this._getStoreDimIndex(dim);
            innerRange[dimIdx] = range[dim];
            dimIndices.push(dimIdx);
        });
        this._store = this._store.selectRange(innerRange);
        return this;
    };
    /* eslint-enable max-len */ SeriesData.prototype.mapArray = function(dims, cb, ctx) {
        'use strict';
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"](dims)) {
            ctx = cb;
            cb = dims;
            dims = [];
        }
        // ctxCompat just for compat echarts3
        ctx = ctx || this;
        var result = [];
        this.each(dims, function() {
            result.push(cb && cb.apply(this, arguments));
        }, ctx);
        return result;
    };
    SeriesData.prototype.map = function(dims, cb, ctx, ctxCompat) {
        'use strict';
        // ctxCompat just for compat echarts3
        var fCtx = ctx || ctxCompat || this;
        var dimIndices = map(normalizeDimensions(dims), this._getStoreDimIndex, this);
        var list = cloneListForMapAndSample(this);
        list._store = this._store.map(dimIndices, fCtx ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bind"](cb, fCtx) : cb);
        return list;
    };
    SeriesData.prototype.modify = function(dims, cb, ctx, ctxCompat) {
        var _this = this;
        // ctxCompat just for compat echarts3
        var fCtx = ctx || ctxCompat || this;
        if ("TURBOPACK compile-time truthy", 1) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](normalizeDimensions(dims), function(dim) {
                var dimInfo = _this.getDimensionInfo(dim);
                if (!dimInfo.isCalculationCoord) {
                    console.error('Danger: only stack dimension can be modified');
                }
            });
        }
        var dimIndices = map(normalizeDimensions(dims), this._getStoreDimIndex, this);
        // If do shallow clone here, if there are too many stacked series,
        // it still cost lots of memory, because `_store.dimensions` are not shared.
        // We should consider there probably be shallow clone happen in each series
        // in consequent filter/map.
        this._store.modify(dimIndices, fCtx ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bind"](cb, fCtx) : cb);
    };
    /**
   * Large data down sampling on given dimension
   * @param sampleIndex Sample index for name and id
   */ SeriesData.prototype.downSample = function(dimension, rate, sampleValue, sampleIndex) {
        var list = cloneListForMapAndSample(this);
        list._store = this._store.downSample(this._getStoreDimIndex(dimension), rate, sampleValue, sampleIndex);
        return list;
    };
    /**
   * Large data down sampling using min-max
   * @param {string} valueDimension
   * @param {number} rate
   */ SeriesData.prototype.minmaxDownSample = function(valueDimension, rate) {
        var list = cloneListForMapAndSample(this);
        list._store = this._store.minmaxDownSample(this._getStoreDimIndex(valueDimension), rate);
        return list;
    };
    /**
   * Large data down sampling using largest-triangle-three-buckets
   * @param {string} valueDimension
   * @param {number} targetCount
   */ SeriesData.prototype.lttbDownSample = function(valueDimension, rate) {
        var list = cloneListForMapAndSample(this);
        list._store = this._store.lttbDownSample(this._getStoreDimIndex(valueDimension), rate);
        return list;
    };
    SeriesData.prototype.getRawDataItem = function(idx) {
        return this._store.getRawDataItem(idx);
    };
    /**
   * Get model of one data item.
   */ // TODO: Type of data item
    SeriesData.prototype.getItemModel = function(idx) {
        var hostModel = this.hostModel;
        var dataItem = this.getRawDataItem(idx);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](dataItem, hostModel, hostModel && hostModel.ecModel);
    };
    /**
   * Create a data differ
   */ SeriesData.prototype.diff = function(otherList) {
        var thisList = this;
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$DataDiffer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](otherList ? otherList.getStore().getIndices() : [], this.getStore().getIndices(), function(idx) {
            return getId(otherList, idx);
        }, function(idx) {
            return getId(thisList, idx);
        });
    };
    /**
   * Get visual property.
   */ SeriesData.prototype.getVisual = function(key) {
        var visual = this._visual;
        return visual && visual[key];
    };
    SeriesData.prototype.setVisual = function(kvObj, val) {
        this._visual = this._visual || {};
        if (isObject(kvObj)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"](this._visual, kvObj);
        } else {
            this._visual[kvObj] = val;
        }
    };
    /**
   * Get visual property of single data item
   */ // eslint-disable-next-line
    SeriesData.prototype.getItemVisual = function(idx, key) {
        var itemVisual = this._itemVisuals[idx];
        var val = itemVisual && itemVisual[key];
        if (val == null) {
            // Use global visual property
            return this.getVisual(key);
        }
        return val;
    };
    /**
   * If exists visual property of single data item
   */ SeriesData.prototype.hasItemVisual = function() {
        return this._itemVisuals.length > 0;
    };
    /**
   * Make sure itemVisual property is unique
   */ // TODO: use key to save visual to reduce memory.
    SeriesData.prototype.ensureUniqueItemVisual = function(idx, key) {
        var itemVisuals = this._itemVisuals;
        var itemVisual = itemVisuals[idx];
        if (!itemVisual) {
            itemVisual = itemVisuals[idx] = {};
        }
        var val = itemVisual[key];
        if (val == null) {
            val = this.getVisual(key);
            // TODO Performance?
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"](val)) {
                val = val.slice();
            } else if (isObject(val)) {
                val = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"]({}, val);
            }
            itemVisual[key] = val;
        }
        return val;
    };
    // eslint-disable-next-line
    SeriesData.prototype.setItemVisual = function(idx, key, value) {
        var itemVisual = this._itemVisuals[idx] || {};
        this._itemVisuals[idx] = itemVisual;
        if (isObject(key)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"](itemVisual, key);
        } else {
            itemVisual[key] = value;
        }
    };
    /**
   * Clear itemVisuals and list visual.
   */ SeriesData.prototype.clearAllVisual = function() {
        this._visual = {};
        this._itemVisuals = [];
    };
    SeriesData.prototype.setLayout = function(key, val) {
        isObject(key) ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"](this._layout, key) : this._layout[key] = val;
    };
    /**
   * Get layout property.
   */ SeriesData.prototype.getLayout = function(key) {
        return this._layout[key];
    };
    /**
   * Get layout of single data item
   */ SeriesData.prototype.getItemLayout = function(idx) {
        return this._itemLayouts[idx];
    };
    /**
   * Set layout of single data item
   */ SeriesData.prototype.setItemLayout = function(idx, layout, merge) {
        this._itemLayouts[idx] = merge ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"](this._itemLayouts[idx] || {}, layout) : layout;
    };
    /**
   * Clear all layout of single data item
   */ SeriesData.prototype.clearItemLayouts = function() {
        this._itemLayouts.length = 0;
    };
    /**
   * Set graphic element relative to data. It can be set as null
   */ SeriesData.prototype.setItemGraphicEl = function(idx, el) {
        var seriesIndex = this.hostModel && this.hostModel.seriesIndex;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$innerStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setCommonECData"])(seriesIndex, this.dataType, idx, el);
        this._graphicEls[idx] = el;
    };
    SeriesData.prototype.getItemGraphicEl = function(idx) {
        return this._graphicEls[idx];
    };
    SeriesData.prototype.eachItemGraphicEl = function(cb, context) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](this._graphicEls, function(el, idx) {
            if (el) {
                cb && cb.call(context, el, idx);
            }
        });
    };
    /**
   * Shallow clone a new list except visual and layout properties, and graph elements.
   * New list only change the indices.
   */ SeriesData.prototype.cloneShallow = function(list) {
        if (!list) {
            list = new SeriesData(this._schema ? this._schema : map(this.dimensions, this._getDimInfo, this), this.hostModel);
        }
        transferProperties(list, this);
        list._store = this._store;
        return list;
    };
    /**
   * Wrap some method to add more feature
   */ SeriesData.prototype.wrapMethod = function(methodName, injectFunction) {
        var originalMethod = this[methodName];
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"](originalMethod)) {
            return;
        }
        this.__wrappedMethods = this.__wrappedMethods || [];
        this.__wrappedMethods.push(methodName);
        this[methodName] = function() {
            var res = originalMethod.apply(this, arguments);
            return injectFunction.apply(this, [
                res
            ].concat(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["slice"](arguments)));
        };
    };
    // ----------------------------------------------------------
    // A work around for internal method visiting private member.
    // ----------------------------------------------------------
    SeriesData.internalField = function() {
        prepareInvertedIndex = function(data) {
            var invertedIndicesMap = data._invertedIndicesMap;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](invertedIndicesMap, function(invertedIndices, dim) {
                var dimInfo = data._dimInfos[dim];
                // Currently, only dimensions that has ordinalMeta can create inverted indices.
                var ordinalMeta = dimInfo.ordinalMeta;
                var store = data._store;
                if (ordinalMeta) {
                    invertedIndices = invertedIndicesMap[dim] = new CtorInt32Array(ordinalMeta.categories.length);
                    // The default value of TypedArray is 0. To avoid miss
                    // mapping to 0, we should set it as INDEX_NOT_FOUND.
                    for(var i = 0; i < invertedIndices.length; i++){
                        invertedIndices[i] = INDEX_NOT_FOUND;
                    }
                    for(var i = 0; i < store.count(); i++){
                        // Only support the case that all values are distinct.
                        invertedIndices[store.get(dimInfo.storeDimIndex, i)] = i;
                    }
                }
            });
        };
        getIdNameFromStore = function(data, dimIdx, idx) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["convertOptionIdName"])(data._getCategory(dimIdx, idx), null);
        };
        /**
     * @see the comment of `List['getId']`.
     */ getId = function(data, rawIndex) {
            var id = data._idList[rawIndex];
            if (id == null && data._idDimIdx != null) {
                id = getIdNameFromStore(data, data._idDimIdx, rawIndex);
            }
            if (id == null) {
                id = ID_PREFIX + rawIndex;
            }
            return id;
        };
        normalizeDimensions = function(dimensions) {
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"](dimensions)) {
                dimensions = dimensions != null ? [
                    dimensions
                ] : [];
            }
            return dimensions;
        };
        /**
     * Data in excludeDimensions is copied, otherwise transferred.
     */ cloneListForMapAndSample = function(original) {
            var list = new SeriesData(original._schema ? original._schema : map(original.dimensions, original._getDimInfo, original), original.hostModel);
            // FIXME If needs stackedOn, value may already been stacked
            transferProperties(list, original);
            return list;
        };
        transferProperties = function(target, source) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](TRANSFERABLE_PROPERTIES.concat(source.__wrappedMethods || []), function(propName) {
                if (source.hasOwnProperty(propName)) {
                    target[propName] = source[propName];
                }
            });
            target.__wrappedMethods = source.__wrappedMethods;
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](CLONE_PROPERTIES, function(propName) {
                target[propName] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clone"](source[propName]);
            });
            target._calculationInfo = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"]({}, source._calculationInfo);
        };
        makeIdFromName = function(data, idx) {
            var nameList = data._nameList;
            var idList = data._idList;
            var nameDimIdx = data._nameDimIdx;
            var idDimIdx = data._idDimIdx;
            var name = nameList[idx];
            var id = idList[idx];
            if (name == null && nameDimIdx != null) {
                nameList[idx] = name = getIdNameFromStore(data, nameDimIdx, idx);
            }
            if (id == null && idDimIdx != null) {
                idList[idx] = id = getIdNameFromStore(data, idDimIdx, idx);
            }
            if (id == null && name != null) {
                var nameRepeatCount = data._nameRepeatCount;
                var nmCnt = nameRepeatCount[name] = (nameRepeatCount[name] || 0) + 1;
                id = name;
                if (nmCnt > 1) {
                    id += '__ec__' + nmCnt;
                }
                idList[idx] = id;
            }
        };
    }();
    return SeriesData;
}();
const __TURBOPACK__default__export__ = SeriesData;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/SeriesDimensionDefine.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var SeriesDimensionDefine = /** @class */ function() {
    /**
   * @param opt All of the fields will be shallow copied.
   */ function SeriesDimensionDefine(opt) {
        /**
     * The term "other" means "other than coord".
     * The format of `otherDims` is:
     * ```js
     * {
     *     tooltip?: number
     *     label?: number
     *     itemName?: number
     *     seriesName?: number
     * }
     * ```
     *
     * A `series.encode` can specified these fields:
     * ```js
     * encode: {
     *     // "3, 1, 5" is the index of data dimension.
     *     tooltip: [3, 1, 5],
     *     label: [0, 3],
     *     ...
     * }
     * ```
     * `otherDims` is the parse result of the `series.encode` above, like:
     * ```js
     * // Suppose the index of this data dimension is `3`.
     * this.otherDims = {
     *     // `3` is at the index `0` of the `encode.tooltip`
     *     tooltip: 0,
     *     // `3` is at the index `1` of the `encode.label`
     *     label: 1
     * };
     * ```
     *
     * This prop should never be `null`/`undefined` after initialized.
     */ this.otherDims = {};
        if (opt != null) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"](this, opt);
        }
    }
    return SeriesDimensionDefine;
}();
;
const __TURBOPACK__default__export__ = SeriesDimensionDefine;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/Source.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cloneSourceShallow",
    ()=>cloneSourceShallow,
    "createSource",
    ()=>createSource,
    "createSourceFromSeriesDataOption",
    ()=>createSourceFromSeriesDataOption,
    "detectSourceFormat",
    ()=>detectSourceFormat,
    "isSourceInstance",
    ()=>isSourceInstance,
    "shouldRetrieveDataByName",
    ()=>shouldRetrieveDataByName
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$sourceHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/sourceHelper.js [app-ssr] (ecmascript)");
;
;
;
;
;
// @inner
var SourceImpl = /** @class */ function() {
    function SourceImpl(fields) {
        this.data = fields.data || (fields.sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_KEYED_COLUMNS"] ? {} : []);
        this.sourceFormat = fields.sourceFormat || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_UNKNOWN"];
        // Visit config
        this.seriesLayoutBy = fields.seriesLayoutBy || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIES_LAYOUT_BY_COLUMN"];
        this.startIndex = fields.startIndex || 0;
        this.dimensionsDetectedCount = fields.dimensionsDetectedCount;
        this.metaRawOption = fields.metaRawOption;
        var dimensionsDefine = this.dimensionsDefine = fields.dimensionsDefine;
        if (dimensionsDefine) {
            for(var i = 0; i < dimensionsDefine.length; i++){
                var dim = dimensionsDefine[i];
                if (dim.type == null) {
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$sourceHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["guessOrdinal"])(this, i) === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$sourceHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BE_ORDINAL"].Must) {
                        dim.type = 'ordinal';
                    }
                }
            }
        }
    }
    return SourceImpl;
}();
function isSourceInstance(val) {
    return val instanceof SourceImpl;
}
function createSource(sourceData, thisMetaRawOption, // can be null. If not provided, auto detect it from `sourceData`.
sourceFormat) {
    sourceFormat = sourceFormat || detectSourceFormat(sourceData);
    var seriesLayoutBy = thisMetaRawOption.seriesLayoutBy;
    var determined = determineSourceDimensions(sourceData, sourceFormat, seriesLayoutBy, thisMetaRawOption.sourceHeader, thisMetaRawOption.dimensions);
    var source = new SourceImpl({
        data: sourceData,
        sourceFormat: sourceFormat,
        seriesLayoutBy: seriesLayoutBy,
        dimensionsDefine: determined.dimensionsDefine,
        startIndex: determined.startIndex,
        dimensionsDetectedCount: determined.dimensionsDetectedCount,
        metaRawOption: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clone"])(thisMetaRawOption)
    });
    return source;
}
function createSourceFromSeriesDataOption(data) {
    return new SourceImpl({
        data: data,
        sourceFormat: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTypedArray"])(data) ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_TYPED_ARRAY"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ORIGINAL"]
    });
}
function cloneSourceShallow(source) {
    return new SourceImpl({
        data: source.data,
        sourceFormat: source.sourceFormat,
        seriesLayoutBy: source.seriesLayoutBy,
        dimensionsDefine: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clone"])(source.dimensionsDefine),
        startIndex: source.startIndex,
        dimensionsDetectedCount: source.dimensionsDetectedCount
    });
}
function detectSourceFormat(data) {
    var sourceFormat = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_UNKNOWN"];
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTypedArray"])(data)) {
        sourceFormat = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_TYPED_ARRAY"];
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"])(data)) {
        // FIXME Whether tolerate null in top level array?
        if (data.length === 0) {
            sourceFormat = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ARRAY_ROWS"];
        }
        for(var i = 0, len = data.length; i < len; i++){
            var item = data[i];
            if (item == null) {
                continue;
            } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"])(item) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTypedArray"])(item)) {
                sourceFormat = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ARRAY_ROWS"];
                break;
            } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(item)) {
                sourceFormat = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_OBJECT_ROWS"];
                break;
            }
        }
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(data)) {
        for(var key in data){
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasOwn"])(data, key) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArrayLike"])(data[key])) {
                sourceFormat = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_KEYED_COLUMNS"];
                break;
            }
        }
    }
    return sourceFormat;
}
/**
 * Determine the source definitions from data standalone dimensions definitions
 * are not specified.
 */ function determineSourceDimensions(data, sourceFormat, seriesLayoutBy, sourceHeader, // standalone raw dimensions definition, like:
// {
//     dimensions: ['aa', 'bb', { name: 'cc', type: 'time' }]
// }
// in `dataset` or `series`
dimensionsDefine) {
    var dimensionsDetectedCount;
    var startIndex;
    // PENDING: Could data be null/undefined here?
    // currently, if `dataset.source` not specified, error thrown.
    // if `series.data` not specified, nothing rendered without error thrown.
    // Should test these cases.
    if (!data) {
        return {
            dimensionsDefine: normalizeDimensionsOption(dimensionsDefine),
            startIndex: startIndex,
            dimensionsDetectedCount: dimensionsDetectedCount
        };
    }
    if (sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ARRAY_ROWS"]) {
        var dataArrayRows = data;
        // Rule: Most of the first line are string: it is header.
        // Caution: consider a line with 5 string and 1 number,
        // it still can not be sure it is a head, because the
        // 5 string may be 5 values of category columns.
        if (sourceHeader === 'auto' || sourceHeader == null) {
            arrayRowsTravelFirst(function(val) {
                // '-' is regarded as null/undefined.
                if (val != null && val !== '-') {
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(val)) {
                        startIndex == null && (startIndex = 1);
                    } else {
                        startIndex = 0;
                    }
                }
            // 10 is an experience number, avoid long loop.
            }, seriesLayoutBy, dataArrayRows, 10);
        } else {
            startIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNumber"])(sourceHeader) ? sourceHeader : sourceHeader ? 1 : 0;
        }
        if (!dimensionsDefine && startIndex === 1) {
            dimensionsDefine = [];
            arrayRowsTravelFirst(function(val, index) {
                dimensionsDefine[index] = val != null ? val + '' : '';
            }, seriesLayoutBy, dataArrayRows, Infinity);
        }
        dimensionsDetectedCount = dimensionsDefine ? dimensionsDefine.length : seriesLayoutBy === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIES_LAYOUT_BY_ROW"] ? dataArrayRows.length : dataArrayRows[0] ? dataArrayRows[0].length : null;
    } else if (sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_OBJECT_ROWS"]) {
        if (!dimensionsDefine) {
            dimensionsDefine = objectRowsCollectDimensions(data);
        }
    } else if (sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_KEYED_COLUMNS"]) {
        if (!dimensionsDefine) {
            dimensionsDefine = [];
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(data, function(colArr, key) {
                dimensionsDefine.push(key);
            });
        }
    } else if (sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ORIGINAL"]) {
        var value0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDataItemValue"])(data[0]);
        dimensionsDetectedCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"])(value0) && value0.length || 1;
    } else if (sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_TYPED_ARRAY"]) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(!!dimensionsDefine, 'dimensions must be given if data is TypedArray.');
        }
    }
    return {
        startIndex: startIndex,
        dimensionsDefine: normalizeDimensionsOption(dimensionsDefine),
        dimensionsDetectedCount: dimensionsDetectedCount
    };
}
function objectRowsCollectDimensions(data) {
    var firstIndex = 0;
    var obj;
    while(firstIndex < data.length && !(obj = data[firstIndex++])){} // jshint ignore: line
    if (obj) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keys"])(obj);
    }
}
// Consider dimensions defined like ['A', 'price', 'B', 'price', 'C', 'price'],
// which is reasonable. But dimension name is duplicated.
// Returns undefined or an array contains only object without null/undefined or string.
function normalizeDimensionsOption(dimensionsDefine) {
    if (!dimensionsDefine) {
        // The meaning of null/undefined is different from empty array.
        return;
    }
    var nameMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(dimensionsDefine, function(rawItem, index) {
        rawItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(rawItem) ? rawItem : {
            name: rawItem
        };
        // Other fields will be discarded.
        var item = {
            name: rawItem.name,
            displayName: rawItem.displayName,
            type: rawItem.type
        };
        // User can set null in dimensions.
        // We don't auto specify name, otherwise a given name may
        // cause it to be referred unexpectedly.
        if (item.name == null) {
            return item;
        }
        // Also consider number form like 2012.
        item.name += '';
        // User may also specify displayName.
        // displayName will always exists except user not
        // specified or dim name is not specified or detected.
        // (A auto generated dim name will not be used as
        // displayName).
        if (item.displayName == null) {
            item.displayName = item.name;
        }
        var exist = nameMap.get(item.name);
        if (!exist) {
            nameMap.set(item.name, {
                count: 1
            });
        } else {
            item.name += '-' + exist.count++;
        }
        return item;
    });
}
function arrayRowsTravelFirst(cb, seriesLayoutBy, data, maxLoop) {
    if (seriesLayoutBy === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIES_LAYOUT_BY_ROW"]) {
        for(var i = 0; i < data.length && i < maxLoop; i++){
            cb(data[i] ? data[i][0] : null, i);
        }
    } else {
        var value0 = data[0] || [];
        for(var i = 0; i < value0.length && i < maxLoop; i++){
            cb(value0[i], i);
        }
    }
}
function shouldRetrieveDataByName(source) {
    var sourceFormat = source.sourceFormat;
    return sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_OBJECT_ROWS"] || sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_KEYED_COLUMNS"];
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/Tree.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TreeNode",
    ()=>TreeNode,
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
*/ /**
 * Tree data structure
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$linkSeriesData$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/linkSeriesData.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$SeriesData$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/SeriesData.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$createDimensions$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/createDimensions.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
;
;
;
;
;
var TreeNode = /** @class */ function() {
    function TreeNode(name, hostTree) {
        this.depth = 0;
        this.height = 0;
        /**
     * Reference to list item.
     * Do not persistent dataIndex outside,
     * besause it may be changed by list.
     * If dataIndex -1,
     * this node is logical deleted (filtered) in list.
     */ this.dataIndex = -1;
        this.children = [];
        this.viewChildren = [];
        this.isExpand = false;
        this.name = name || '';
        this.hostTree = hostTree;
    }
    /**
   * The node is removed.
   */ TreeNode.prototype.isRemoved = function() {
        return this.dataIndex < 0;
    };
    TreeNode.prototype.eachNode = function(options, cb, context) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"](options)) {
            context = cb;
            cb = options;
            options = null;
        }
        options = options || {};
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"](options)) {
            options = {
                order: options
            };
        }
        var order = options.order || 'preorder';
        var children = this[options.attr || 'children'];
        var suppressVisitSub;
        order === 'preorder' && (suppressVisitSub = cb.call(context, this));
        for(var i = 0; !suppressVisitSub && i < children.length; i++){
            children[i].eachNode(options, cb, context);
        }
        order === 'postorder' && cb.call(context, this);
    };
    /**
   * Update depth and height of this subtree.
   */ TreeNode.prototype.updateDepthAndHeight = function(depth) {
        var height = 0;
        this.depth = depth;
        for(var i = 0; i < this.children.length; i++){
            var child = this.children[i];
            child.updateDepthAndHeight(depth + 1);
            if (child.height > height) {
                height = child.height;
            }
        }
        this.height = height + 1;
    };
    TreeNode.prototype.getNodeById = function(id) {
        if (this.getId() === id) {
            return this;
        }
        for(var i = 0, children = this.children, len = children.length; i < len; i++){
            var res = children[i].getNodeById(id);
            if (res) {
                return res;
            }
        }
    };
    TreeNode.prototype.contains = function(node) {
        if (node === this) {
            return true;
        }
        for(var i = 0, children = this.children, len = children.length; i < len; i++){
            var res = children[i].contains(node);
            if (res) {
                return res;
            }
        }
    };
    /**
   * @param includeSelf Default false.
   * @return order: [root, child, grandchild, ...]
   */ TreeNode.prototype.getAncestors = function(includeSelf) {
        var ancestors = [];
        var node = includeSelf ? this : this.parentNode;
        while(node){
            ancestors.push(node);
            node = node.parentNode;
        }
        ancestors.reverse();
        return ancestors;
    };
    TreeNode.prototype.getAncestorsIndices = function() {
        var indices = [];
        var currNode = this;
        while(currNode){
            indices.push(currNode.dataIndex);
            currNode = currNode.parentNode;
        }
        indices.reverse();
        return indices;
    };
    TreeNode.prototype.getDescendantIndices = function() {
        var indices = [];
        this.eachNode(function(childNode) {
            indices.push(childNode.dataIndex);
        });
        return indices;
    };
    TreeNode.prototype.getValue = function(dimension) {
        var data = this.hostTree.data;
        return data.getStore().get(data.getDimensionIndex(dimension || 'value'), this.dataIndex);
    };
    TreeNode.prototype.setLayout = function(layout, merge) {
        this.dataIndex >= 0 && this.hostTree.data.setItemLayout(this.dataIndex, layout, merge);
    };
    /**
   * @return {Object} layout
   */ TreeNode.prototype.getLayout = function() {
        return this.hostTree.data.getItemLayout(this.dataIndex);
    };
    // @depcrecated
    // getModel<T = unknown, S extends keyof T = keyof T>(path: S): Model<T[S]>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    TreeNode.prototype.getModel = function(path) {
        if (this.dataIndex < 0) {
            return;
        }
        var hostTree = this.hostTree;
        var itemModel = hostTree.data.getItemModel(this.dataIndex);
        return itemModel.getModel(path);
    };
    // TODO: TYPE More specific model
    TreeNode.prototype.getLevelModel = function() {
        return (this.hostTree.levelModels || [])[this.depth];
    };
    TreeNode.prototype.setVisual = function(key, value) {
        this.dataIndex >= 0 && this.hostTree.data.setItemVisual(this.dataIndex, key, value);
    };
    /**
   * Get item visual
   * FIXME: make return type better
   */ TreeNode.prototype.getVisual = function(key) {
        return this.hostTree.data.getItemVisual(this.dataIndex, key);
    };
    TreeNode.prototype.getRawIndex = function() {
        return this.hostTree.data.getRawIndex(this.dataIndex);
    };
    TreeNode.prototype.getId = function() {
        return this.hostTree.data.getId(this.dataIndex);
    };
    /**
   * index in parent's children
   */ TreeNode.prototype.getChildIndex = function() {
        if (this.parentNode) {
            var children = this.parentNode.children;
            for(var i = 0; i < children.length; ++i){
                if (children[i] === this) {
                    return i;
                }
            }
            return -1;
        }
        return -1;
    };
    /**
   * if this is an ancestor of another node
   *
   * @param node another node
   * @return if is ancestor
   */ TreeNode.prototype.isAncestorOf = function(node) {
        var parent = node.parentNode;
        while(parent){
            if (parent === this) {
                return true;
            }
            parent = parent.parentNode;
        }
        return false;
    };
    /**
   * if this is an descendant of another node
   *
   * @param node another node
   * @return if is descendant
   */ TreeNode.prototype.isDescendantOf = function(node) {
        return node !== this && node.isAncestorOf(this);
    };
    return TreeNode;
}();
;
;
var Tree = /** @class */ function() {
    function Tree(hostModel) {
        this.type = 'tree';
        this._nodes = [];
        this.hostModel = hostModel;
    }
    Tree.prototype.eachNode = function(options, cb, context) {
        this.root.eachNode(options, cb, context);
    };
    Tree.prototype.getNodeByDataIndex = function(dataIndex) {
        var rawIndex = this.data.getRawIndex(dataIndex);
        return this._nodes[rawIndex];
    };
    Tree.prototype.getNodeById = function(name) {
        return this.root.getNodeById(name);
    };
    /**
   * Update item available by list,
   * when list has been performed options like 'filterSelf' or 'map'.
   */ Tree.prototype.update = function() {
        var data = this.data;
        var nodes = this._nodes;
        for(var i = 0, len = nodes.length; i < len; i++){
            nodes[i].dataIndex = -1;
        }
        for(var i = 0, len = data.count(); i < len; i++){
            nodes[data.getRawIndex(i)].dataIndex = i;
        }
    };
    /**
   * Clear all layouts
   */ Tree.prototype.clearLayouts = function() {
        this.data.clearItemLayouts();
    };
    /**
   * data node format:
   * {
   *     name: ...
   *     value: ...
   *     children: [
   *         {
   *             name: ...
   *             value: ...
   *             children: ...
   *         },
   *         ...
   *     ]
   * }
   */ Tree.createTree = function(dataRoot, hostModel, beforeLink) {
        var tree = new Tree(hostModel);
        var listData = [];
        var dimMax = 1;
        buildHierarchy(dataRoot);
        function buildHierarchy(dataNode, parentNode) {
            var value = dataNode.value;
            dimMax = Math.max(dimMax, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"](value) ? value.length : 1);
            listData.push(dataNode);
            var node = new TreeNode((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["convertOptionIdName"])(dataNode.name, ''), tree);
            parentNode ? addChild(node, parentNode) : tree.root = node;
            tree._nodes.push(node);
            var children = dataNode.children;
            if (children) {
                for(var i = 0; i < children.length; i++){
                    buildHierarchy(children[i], node);
                }
            }
        }
        tree.root.updateDepthAndHeight(0);
        var dimensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$createDimensions$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(listData, {
            coordDimensions: [
                'value'
            ],
            dimensionsCount: dimMax
        }).dimensions;
        var list = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$SeriesData$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](dimensions, hostModel);
        list.initData(listData);
        beforeLink && beforeLink(list);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$linkSeriesData$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
            mainData: list,
            struct: tree,
            structAttr: 'tree'
        });
        tree.update();
        return tree;
    };
    return Tree;
}();
/**
 * It is needed to consider the mess of 'list', 'hostModel' when creating a TreeNote,
 * so this function is not ready and not necessary to be public.
 */ function addChild(child, node) {
    var children = node.children;
    if (child.parentNode === node) {
        return;
    }
    children.push(child);
    child.parentNode = node;
}
const __TURBOPACK__default__export__ = Tree;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/SeriesDataSchema.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SeriesDataSchema",
    ()=>SeriesDataSchema,
    "createDimNameMap",
    ()=>createDimNameMap,
    "ensureSourceDimNameMap",
    ()=>ensureSourceDimNameMap,
    "isSeriesDataSchema",
    ()=>isSeriesDataSchema,
    "shouldOmitUnusedDimensions",
    ()=>shouldOmitUnusedDimensions
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Source$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/Source.js [app-ssr] (ecmascript)");
;
;
;
var inner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeInner"])();
var dimTypeShort = {
    float: 'f',
    int: 'i',
    ordinal: 'o',
    number: 'n',
    time: 't'
};
/**
 * Represents the dimension requirement of a series.
 *
 * NOTICE:
 * When there are too many dimensions in dataset and many series, only the used dimensions
 * (i.e., used by coord sys and declared in `series.encode`) are add to `dimensionDefineList`.
 * But users may query data by other unused dimension names.
 * In this case, users can only query data if and only if they have defined dimension names
 * via ec option, so we provide `getDimensionIndexFromSource`, which only query them from
 * `source` dimensions.
 */ var SeriesDataSchema = /** @class */ function() {
    function SeriesDataSchema(opt) {
        this.dimensions = opt.dimensions;
        this._dimOmitted = opt.dimensionOmitted;
        this.source = opt.source;
        this._fullDimCount = opt.fullDimensionCount;
        this._updateDimOmitted(opt.dimensionOmitted);
    }
    SeriesDataSchema.prototype.isDimensionOmitted = function() {
        return this._dimOmitted;
    };
    SeriesDataSchema.prototype._updateDimOmitted = function(dimensionOmitted) {
        this._dimOmitted = dimensionOmitted;
        if (!dimensionOmitted) {
            return;
        }
        if (!this._dimNameMap) {
            this._dimNameMap = ensureSourceDimNameMap(this.source);
        }
    };
    /**
   * @caution Can only be used when `dimensionOmitted: true`.
   *
   * Get index by user defined dimension name (i.e., not internal generate name).
   * That is, get index from `dimensionsDefine`.
   * If no `dimensionsDefine`, or no name get, return -1.
   */ SeriesDataSchema.prototype.getSourceDimensionIndex = function(dimName) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(this._dimNameMap.get(dimName), -1);
    };
    /**
   * @caution Can only be used when `dimensionOmitted: true`.
   *
   * Notice: may return `null`/`undefined` if user not specify dimension names.
   */ SeriesDataSchema.prototype.getSourceDimension = function(dimIndex) {
        var dimensionsDefine = this.source.dimensionsDefine;
        if (dimensionsDefine) {
            return dimensionsDefine[dimIndex];
        }
    };
    SeriesDataSchema.prototype.makeStoreSchema = function() {
        var dimCount = this._fullDimCount;
        var willRetrieveDataByName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Source$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shouldRetrieveDataByName"])(this.source);
        var makeHashStrict = !shouldOmitUnusedDimensions(dimCount);
        // If source don't have dimensions or series don't omit unsed dimensions.
        // Generate from seriesDimList directly
        var dimHash = '';
        var dims = [];
        for(var fullDimIdx = 0, seriesDimIdx = 0; fullDimIdx < dimCount; fullDimIdx++){
            var property = void 0;
            var type = void 0;
            var ordinalMeta = void 0;
            var seriesDimDef = this.dimensions[seriesDimIdx];
            // The list has been sorted by `storeDimIndex` asc.
            if (seriesDimDef && seriesDimDef.storeDimIndex === fullDimIdx) {
                property = willRetrieveDataByName ? seriesDimDef.name : null;
                type = seriesDimDef.type;
                ordinalMeta = seriesDimDef.ordinalMeta;
                seriesDimIdx++;
            } else {
                var sourceDimDef = this.getSourceDimension(fullDimIdx);
                if (sourceDimDef) {
                    property = willRetrieveDataByName ? sourceDimDef.name : null;
                    type = sourceDimDef.type;
                }
            }
            dims.push({
                property: property,
                type: type,
                ordinalMeta: ordinalMeta
            });
            // If retrieving data by index,
            //   use <index, type, ordinalMeta> to determine whether data can be shared.
            //   (Because in this case there might be no dimension name defined in dataset, but indices always exists).
            //   (Indices are always 0, 1, 2, ..., so we can ignore them to shorten the hash).
            // Otherwise if retrieving data by property name (like `data: [{aa: 123, bb: 765}, ...]`),
            //   use <property, type, ordinalMeta> in hash.
            if (willRetrieveDataByName && property != null && (!seriesDimDef || !seriesDimDef.isCalculationCoord)) {
                dimHash += makeHashStrict ? property.replace(/\`/g, '`1').replace(/\$/g, '`2') : property;
            }
            dimHash += '$';
            dimHash += dimTypeShort[type] || 'f';
            if (ordinalMeta) {
                dimHash += ordinalMeta.uid;
            }
            dimHash += '$';
        }
        // Source from endpoint(usually series) will be read differently
        // when seriesLayoutBy or startIndex(which is affected by sourceHeader) are different.
        // So we use this three props as key.
        var source = this.source;
        var hash = [
            source.seriesLayoutBy,
            source.startIndex,
            dimHash
        ].join('$$');
        return {
            dimensions: dims,
            hash: hash
        };
    };
    SeriesDataSchema.prototype.makeOutputDimensionNames = function() {
        var result = [];
        for(var fullDimIdx = 0, seriesDimIdx = 0; fullDimIdx < this._fullDimCount; fullDimIdx++){
            var name_1 = void 0;
            var seriesDimDef = this.dimensions[seriesDimIdx];
            // The list has been sorted by `storeDimIndex` asc.
            if (seriesDimDef && seriesDimDef.storeDimIndex === fullDimIdx) {
                if (!seriesDimDef.isCalculationCoord) {
                    name_1 = seriesDimDef.name;
                }
                seriesDimIdx++;
            } else {
                var sourceDimDef = this.getSourceDimension(fullDimIdx);
                if (sourceDimDef) {
                    name_1 = sourceDimDef.name;
                }
            }
            result.push(name_1);
        }
        return result;
    };
    SeriesDataSchema.prototype.appendCalculationDimension = function(dimDef) {
        this.dimensions.push(dimDef);
        dimDef.isCalculationCoord = true;
        this._fullDimCount++;
        // If append dimension on a data store, consider the store
        // might be shared by different series, series dimensions not
        // really map to store dimensions.
        this._updateDimOmitted(true);
    };
    return SeriesDataSchema;
}();
;
function isSeriesDataSchema(schema) {
    return schema instanceof SeriesDataSchema;
}
function createDimNameMap(dimsDef) {
    var dataDimNameMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
    for(var i = 0; i < (dimsDef || []).length; i++){
        var dimDefItemRaw = dimsDef[i];
        var userDimName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(dimDefItemRaw) ? dimDefItemRaw.name : dimDefItemRaw;
        if (userDimName != null && dataDimNameMap.get(userDimName) == null) {
            dataDimNameMap.set(userDimName, i);
        }
    }
    return dataDimNameMap;
}
function ensureSourceDimNameMap(source) {
    var innerSource = inner(source);
    return innerSource.dimNameMap || (innerSource.dimNameMap = createDimNameMap(source.dimensionsDefine));
}
function shouldOmitUnusedDimensions(dimCount) {
    return dimCount > 30;
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/createDimensions.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createDimensions",
    ()=>createDimensions,
    "default",
    ()=>prepareSeriesDataSchema
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/types.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$SeriesDimensionDefine$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/SeriesDimensionDefine.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Source$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/Source.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$DataStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/DataStore.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$sourceHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/sourceHelper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$SeriesDataSchema$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/SeriesDataSchema.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
function createDimensions(source, opt) {
    return prepareSeriesDataSchema(source, opt).dimensions;
}
function prepareSeriesDataSchema(// TODO: TYPE completeDimensions type
source, opt) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Source$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isSourceInstance"])(source)) {
        source = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Source$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSourceFromSeriesDataOption"])(source);
    }
    opt = opt || {};
    var sysDims = opt.coordDimensions || [];
    var dimsDef = opt.dimensionsDefine || source.dimensionsDefine || [];
    var coordDimNameMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
    var resultList = [];
    var dimCount = getDimCount(source, sysDims, dimsDef, opt.dimensionsCount);
    // Try to ignore unused dimensions if sharing a high dimension datastore
    // 30 is an experience value.
    var omitUnusedDimensions = opt.canOmitUnusedDimensions && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$SeriesDataSchema$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shouldOmitUnusedDimensions"])(dimCount);
    var isUsingSourceDimensionsDef = dimsDef === source.dimensionsDefine;
    var dataDimNameMap = isUsingSourceDimensionsDef ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$SeriesDataSchema$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ensureSourceDimNameMap"])(source) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$SeriesDataSchema$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createDimNameMap"])(dimsDef);
    var encodeDef = opt.encodeDefine;
    if (!encodeDef && opt.encodeDefaulter) {
        encodeDef = opt.encodeDefaulter(source, dimCount);
    }
    var encodeDefMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])(encodeDef);
    var indicesMap = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$DataStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CtorInt32Array"](dimCount);
    for(var i = 0; i < indicesMap.length; i++){
        indicesMap[i] = -1;
    }
    function getResultItem(dimIdx) {
        var idx = indicesMap[dimIdx];
        if (idx < 0) {
            var dimDefItemRaw = dimsDef[dimIdx];
            var dimDefItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(dimDefItemRaw) ? dimDefItemRaw : {
                name: dimDefItemRaw
            };
            var resultItem = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$SeriesDimensionDefine$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]();
            var userDimName = dimDefItem.name;
            if (userDimName != null && dataDimNameMap.get(userDimName) != null) {
                // Only if `series.dimensions` is defined in option
                // displayName, will be set, and dimension will be displayed vertically in
                // tooltip by default.
                resultItem.name = resultItem.displayName = userDimName;
            }
            dimDefItem.type != null && (resultItem.type = dimDefItem.type);
            dimDefItem.displayName != null && (resultItem.displayName = dimDefItem.displayName);
            var newIdx = resultList.length;
            indicesMap[dimIdx] = newIdx;
            resultItem.storeDimIndex = dimIdx;
            resultList.push(resultItem);
            return resultItem;
        }
        return resultList[idx];
    }
    if (!omitUnusedDimensions) {
        for(var i = 0; i < dimCount; i++){
            getResultItem(i);
        }
    }
    // Set `coordDim` and `coordDimIndex` by `encodeDefMap` and normalize `encodeDefMap`.
    encodeDefMap.each(function(dataDimsRaw, coordDim) {
        var dataDims = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeToArray"])(dataDimsRaw).slice();
        // Note: It is allowed that `dataDims.length` is `0`, e.g., options is
        // `{encode: {x: -1, y: 1}}`. Should not filter anything in
        // this case.
        if (dataDims.length === 1 && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(dataDims[0]) && dataDims[0] < 0) {
            encodeDefMap.set(coordDim, false);
            return;
        }
        var validDataDims = encodeDefMap.set(coordDim, []);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(dataDims, function(resultDimIdxOrName, idx) {
            // The input resultDimIdx can be dim name or index.
            var resultDimIdx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(resultDimIdxOrName) ? dataDimNameMap.get(resultDimIdxOrName) : resultDimIdxOrName;
            if (resultDimIdx != null && resultDimIdx < dimCount) {
                validDataDims[idx] = resultDimIdx;
                applyDim(getResultItem(resultDimIdx), coordDim, idx);
            }
        });
    });
    // Apply templates and default order from `sysDims`.
    var availDimIdx = 0;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(sysDims, function(sysDimItemRaw) {
        var coordDim;
        var sysDimItemDimsDef;
        var sysDimItemOtherDims;
        var sysDimItem;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(sysDimItemRaw)) {
            coordDim = sysDimItemRaw;
            sysDimItem = {};
        } else {
            sysDimItem = sysDimItemRaw;
            coordDim = sysDimItem.name;
            var ordinalMeta = sysDimItem.ordinalMeta;
            sysDimItem.ordinalMeta = null;
            sysDimItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"])({}, sysDimItem);
            sysDimItem.ordinalMeta = ordinalMeta;
            // `coordDimIndex` should not be set directly.
            sysDimItemDimsDef = sysDimItem.dimsDef;
            sysDimItemOtherDims = sysDimItem.otherDims;
            sysDimItem.name = sysDimItem.coordDim = sysDimItem.coordDimIndex = sysDimItem.dimsDef = sysDimItem.otherDims = null;
        }
        var dataDims = encodeDefMap.get(coordDim);
        // negative resultDimIdx means no need to mapping.
        if (dataDims === false) {
            return;
        }
        dataDims = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeToArray"])(dataDims);
        // dimensions provides default dim sequences.
        if (!dataDims.length) {
            for(var i = 0; i < (sysDimItemDimsDef && sysDimItemDimsDef.length || 1); i++){
                while(availDimIdx < dimCount && getResultItem(availDimIdx).coordDim != null){
                    availDimIdx++;
                }
                availDimIdx < dimCount && dataDims.push(availDimIdx++);
            }
        }
        // Apply templates.
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(dataDims, function(resultDimIdx, coordDimIndex) {
            var resultItem = getResultItem(resultDimIdx);
            // Coordinate system has a higher priority on dim type than source.
            if (isUsingSourceDimensionsDef && sysDimItem.type != null) {
                resultItem.type = sysDimItem.type;
            }
            applyDim((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaults"])(resultItem, sysDimItem), coordDim, coordDimIndex);
            if (resultItem.name == null && sysDimItemDimsDef) {
                var sysDimItemDimsDefItem = sysDimItemDimsDef[coordDimIndex];
                !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(sysDimItemDimsDefItem) && (sysDimItemDimsDefItem = {
                    name: sysDimItemDimsDefItem
                });
                resultItem.name = resultItem.displayName = sysDimItemDimsDefItem.name;
                resultItem.defaultTooltip = sysDimItemDimsDefItem.defaultTooltip;
            }
            // FIXME refactor, currently only used in case: {otherDims: {tooltip: false}}
            sysDimItemOtherDims && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaults"])(resultItem.otherDims, sysDimItemOtherDims);
        });
    });
    function applyDim(resultItem, coordDim, coordDimIndex) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VISUAL_DIMENSIONS"].get(coordDim) != null) {
            resultItem.otherDims[coordDim] = coordDimIndex;
        } else {
            resultItem.coordDim = coordDim;
            resultItem.coordDimIndex = coordDimIndex;
            coordDimNameMap.set(coordDim, true);
        }
    }
    // Make sure the first extra dim is 'value'.
    var generateCoord = opt.generateCoord;
    var generateCoordCount = opt.generateCoordCount;
    var fromZero = generateCoordCount != null;
    generateCoordCount = generateCoord ? generateCoordCount || 1 : 0;
    var extra = generateCoord || 'value';
    function ifNoNameFillWithCoordName(resultItem) {
        if (resultItem.name == null) {
            // Duplication will be removed in the next step.
            resultItem.name = resultItem.coordDim;
        }
    }
    // Set dim `name` and other `coordDim` and other props.
    if (!omitUnusedDimensions) {
        for(var resultDimIdx = 0; resultDimIdx < dimCount; resultDimIdx++){
            var resultItem = getResultItem(resultDimIdx);
            var coordDim = resultItem.coordDim;
            if (coordDim == null) {
                // TODO no need to generate coordDim for isExtraCoord?
                resultItem.coordDim = genCoordDimName(extra, coordDimNameMap, fromZero);
                resultItem.coordDimIndex = 0;
                // Series specified generateCoord is using out.
                if (!generateCoord || generateCoordCount <= 0) {
                    resultItem.isExtraCoord = true;
                }
                generateCoordCount--;
            }
            ifNoNameFillWithCoordName(resultItem);
            if (resultItem.type == null && ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$sourceHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["guessOrdinal"])(source, resultDimIdx) === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$sourceHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BE_ORDINAL"].Must || resultItem.isExtraCoord && (resultItem.otherDims.itemName != null || resultItem.otherDims.seriesName != null))) {
                resultItem.type = 'ordinal';
            }
        }
    } else {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(resultList, function(resultItem) {
            // PENDING: guessOrdinal or let user specify type: 'ordinal' manually?
            ifNoNameFillWithCoordName(resultItem);
        });
        // Sort dimensions: there are some rule that use the last dim as label,
        // and for some latter travel process easier.
        resultList.sort(function(item0, item1) {
            return item0.storeDimIndex - item1.storeDimIndex;
        });
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removeDuplicates"])(resultList, function(item) {
        return item.name;
    }, function(item, existingCount) {
        if (existingCount > 0) {
            // Starts from 0.
            item.name = item.name + (existingCount - 1);
        }
    });
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$SeriesDataSchema$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SeriesDataSchema"]({
        source: source,
        dimensions: resultList,
        fullDimensionCount: dimCount,
        dimensionOmitted: omitUnusedDimensions
    });
}
// ??? TODO
// Originally detect dimCount by data[0]. Should we
// optimize it to only by sysDims and dimensions and encode.
// So only necessary dims will be initialized.
// But
// (1) custom series should be considered. where other dims
// may be visited.
// (2) sometimes user need to calculate bubble size or use visualMap
// on other dimensions besides coordSys needed.
// So, dims that is not used by system, should be shared in data store?
function getDimCount(source, sysDims, dimsDef, optDimCount) {
    // Note that the result dimCount should not small than columns count
    // of data, otherwise `dataDimNameMap` checking will be incorrect.
    var dimCount = Math.max(source.dimensionsDetectedCount || 1, sysDims.length, dimsDef.length, optDimCount || 0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(sysDims, function(sysDimItem) {
        var sysDimItemDimsDef;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(sysDimItem) && (sysDimItemDimsDef = sysDimItem.dimsDef)) {
            dimCount = Math.max(dimCount, sysDimItemDimsDef.length);
        }
    });
    return dimCount;
}
function genCoordDimName(name, map, fromZero) {
    if (fromZero || map.hasKey(name)) {
        var i = 0;
        while(map.hasKey(name + i)){
            i++;
        }
        name += i;
    }
    map.set(name, true);
    return name;
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/dataProvider.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DefaultDataProvider",
    ()=>DefaultDataProvider,
    "getRawSourceDataCounter",
    ()=>getRawSourceDataCounter,
    "getRawSourceItemGetter",
    ()=>getRawSourceItemGetter,
    "getRawSourceValueGetter",
    ()=>getRawSourceValueGetter,
    "retrieveRawAttr",
    ()=>retrieveRawAttr,
    "retrieveRawValue",
    ()=>retrieveRawValue
]);
// TODO
// ??? refactor? check the outer usage of data provider.
// merge with defaultDimValueGetter?
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Source$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/Source.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/types.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-ssr] (ecmascript)");
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
*/ var _a, _b, _c, _d;
;
;
;
;
;
var providerMethods;
var mountMethods;
/**
 * If normal array used, mutable chunk size is supported.
 * If typed array used, chunk size must be fixed.
 */ var DefaultDataProvider = /** @class */ function() {
    function DefaultDataProvider(sourceParam, dimSize) {
        // let source: Source;
        var source = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Source$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isSourceInstance"])(sourceParam) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Source$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSourceFromSeriesDataOption"])(sourceParam) : sourceParam;
        // declare source is Source;
        this._source = source;
        var data = this._data = source.data;
        var sourceFormat = source.sourceFormat;
        var seriesLayoutBy = source.seriesLayoutBy;
        // Typed array. TODO IE10+?
        if (sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_TYPED_ARRAY"]) {
            if ("TURBOPACK compile-time truthy", 1) {
                if (dimSize == null) {
                    throw new Error('Typed array data must specify dimension size');
                }
            }
            this._offset = 0;
            this._dimSize = dimSize;
            this._data = data;
        }
        if ("TURBOPACK compile-time truthy", 1) {
            var validator = rawSourceDataValidatorMap[getMethodMapKey(sourceFormat, seriesLayoutBy)];
            validator && validator(data, source.dimensionsDefine);
        }
        mountMethods(this, data, source);
    }
    DefaultDataProvider.prototype.getSource = function() {
        return this._source;
    };
    DefaultDataProvider.prototype.count = function() {
        return 0;
    };
    DefaultDataProvider.prototype.getItem = function(idx, out) {
        return;
    };
    DefaultDataProvider.prototype.appendData = function(newData) {};
    DefaultDataProvider.prototype.clean = function() {};
    DefaultDataProvider.protoInitialize = function() {
        // PENDING: To avoid potential incompat (e.g., prototype
        // is visited somewhere), still init them on prototype.
        var proto = DefaultDataProvider.prototype;
        proto.pure = false;
        proto.persistent = true;
    }();
    DefaultDataProvider.internalField = function() {
        var _a;
        mountMethods = function(provider, data, source) {
            var sourceFormat = source.sourceFormat;
            var seriesLayoutBy = source.seriesLayoutBy;
            var startIndex = source.startIndex;
            var dimsDef = source.dimensionsDefine;
            var methods = providerMethods[getMethodMapKey(sourceFormat, seriesLayoutBy)];
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(methods, 'Invalide sourceFormat: ' + sourceFormat);
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"])(provider, methods);
            if (sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_TYPED_ARRAY"]) {
                provider.getItem = getItemForTypedArray;
                provider.count = countForTypedArray;
                provider.fillStorage = fillStorageForTypedArray;
            } else {
                var rawItemGetter = getRawSourceItemGetter(sourceFormat, seriesLayoutBy);
                provider.getItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bind"])(rawItemGetter, null, data, startIndex, dimsDef);
                var rawCounter = getRawSourceDataCounter(sourceFormat, seriesLayoutBy);
                provider.count = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bind"])(rawCounter, null, data, startIndex, dimsDef);
            }
        };
        var getItemForTypedArray = function(idx, out) {
            idx = idx - this._offset;
            out = out || [];
            var data = this._data;
            var dimSize = this._dimSize;
            var offset = dimSize * idx;
            for(var i = 0; i < dimSize; i++){
                out[i] = data[offset + i];
            }
            return out;
        };
        var fillStorageForTypedArray = function(start, end, storage, extent) {
            var data = this._data;
            var dimSize = this._dimSize;
            for(var dim = 0; dim < dimSize; dim++){
                var dimExtent = extent[dim];
                var min = dimExtent[0] == null ? Infinity : dimExtent[0];
                var max = dimExtent[1] == null ? -Infinity : dimExtent[1];
                var count = end - start;
                var arr = storage[dim];
                for(var i = 0; i < count; i++){
                    // appendData with TypedArray will always do replace in provider.
                    var val = data[i * dimSize + dim];
                    arr[start + i] = val;
                    val < min && (min = val);
                    val > max && (max = val);
                }
                dimExtent[0] = min;
                dimExtent[1] = max;
            }
        };
        var countForTypedArray = function() {
            return this._data ? this._data.length / this._dimSize : 0;
        };
        providerMethods = (_a = {}, _a[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ARRAY_ROWS"] + '_' + __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIES_LAYOUT_BY_COLUMN"]] = {
            pure: true,
            appendData: appendDataSimply
        }, _a[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ARRAY_ROWS"] + '_' + __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIES_LAYOUT_BY_ROW"]] = {
            pure: true,
            appendData: function() {
                throw new Error('Do not support appendData when set seriesLayoutBy: "row".');
            }
        }, _a[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_OBJECT_ROWS"]] = {
            pure: true,
            appendData: appendDataSimply
        }, _a[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_KEYED_COLUMNS"]] = {
            pure: true,
            appendData: function(newData) {
                var data = this._data;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(newData, function(newCol, key) {
                    var oldCol = data[key] || (data[key] = []);
                    for(var i = 0; i < (newCol || []).length; i++){
                        oldCol.push(newCol[i]);
                    }
                });
            }
        }, _a[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ORIGINAL"]] = {
            appendData: appendDataSimply
        }, _a[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_TYPED_ARRAY"]] = {
            persistent: false,
            pure: true,
            appendData: function(newData) {
                if ("TURBOPACK compile-time truthy", 1) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTypedArray"])(newData), 'Added data must be TypedArray if data in initialization is TypedArray');
                }
                this._data = newData;
            },
            // Clean self if data is already used.
            clean: function() {
                // PENDING
                this._offset += this.count();
                this._data = null;
            }
        }, _a);
        function appendDataSimply(newData) {
            for(var i = 0; i < newData.length; i++){
                this._data.push(newData[i]);
            }
        }
    }();
    return DefaultDataProvider;
}();
;
var validateSimply = function(rawData) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"])(rawData)) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["error"])('series.data or dataset.source must be an array.');
    }
};
/**
 * Only run in dev mode - hint users for debug.
 */ var rawSourceDataValidatorMap = (_a = {}, _a[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ARRAY_ROWS"] + '_' + __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIES_LAYOUT_BY_COLUMN"]] = validateSimply, _a[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ARRAY_ROWS"] + '_' + __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIES_LAYOUT_BY_ROW"]] = validateSimply, _a[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_OBJECT_ROWS"]] = validateSimply, _a[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_KEYED_COLUMNS"]] = function(rawData, dimsDef) {
    for(var i = 0; i < dimsDef.length; i++){
        var dimName = dimsDef[i].name;
        if (dimName == null) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["error"])('dimension name must not be null/undefined.');
        }
    }
}, _a[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ORIGINAL"]] = validateSimply, _a);
var getItemSimply = function(rawData, startIndex, dimsDef, idx) {
    return rawData[idx];
};
var rawSourceItemGetterMap = (_b = {}, _b[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ARRAY_ROWS"] + '_' + __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIES_LAYOUT_BY_COLUMN"]] = function(rawData, startIndex, dimsDef, idx) {
    return rawData[idx + startIndex];
}, _b[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ARRAY_ROWS"] + '_' + __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIES_LAYOUT_BY_ROW"]] = function(rawData, startIndex, dimsDef, idx, out) {
    idx += startIndex;
    var item = out || [];
    var data = rawData;
    for(var i = 0; i < data.length; i++){
        var row = data[i];
        item[i] = row ? row[idx] : null;
    }
    return item;
}, _b[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_OBJECT_ROWS"]] = getItemSimply, _b[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_KEYED_COLUMNS"]] = function(rawData, startIndex, dimsDef, idx, out) {
    var item = out || [];
    for(var i = 0; i < dimsDef.length; i++){
        var dimName = dimsDef[i].name;
        var col = dimName != null ? rawData[dimName] : null;
        item[i] = col ? col[idx] : null;
    }
    return item;
}, _b[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ORIGINAL"]] = getItemSimply, _b);
function getRawSourceItemGetter(sourceFormat, seriesLayoutBy) {
    var method = rawSourceItemGetterMap[getMethodMapKey(sourceFormat, seriesLayoutBy)];
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(method, 'Do not support get item on "' + sourceFormat + '", "' + seriesLayoutBy + '".');
    }
    return method;
}
var countSimply = function(rawData, startIndex, dimsDef) {
    return rawData.length;
};
var rawSourceDataCounterMap = (_c = {}, _c[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ARRAY_ROWS"] + '_' + __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIES_LAYOUT_BY_COLUMN"]] = function(rawData, startIndex, dimsDef) {
    return Math.max(0, rawData.length - startIndex);
}, _c[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ARRAY_ROWS"] + '_' + __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIES_LAYOUT_BY_ROW"]] = function(rawData, startIndex, dimsDef) {
    var row = rawData[0];
    return row ? Math.max(0, row.length - startIndex) : 0;
}, _c[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_OBJECT_ROWS"]] = countSimply, _c[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_KEYED_COLUMNS"]] = function(rawData, startIndex, dimsDef) {
    var dimName = dimsDef[0].name;
    var col = dimName != null ? rawData[dimName] : null;
    return col ? col.length : 0;
}, _c[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ORIGINAL"]] = countSimply, _c);
function getRawSourceDataCounter(sourceFormat, seriesLayoutBy) {
    var method = rawSourceDataCounterMap[getMethodMapKey(sourceFormat, seriesLayoutBy)];
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(method, 'Do not support count on "' + sourceFormat + '", "' + seriesLayoutBy + '".');
    }
    return method;
}
var getRawValueSimply = function(dataItem, dimIndex, property) {
    return dataItem[dimIndex];
};
var rawSourceValueGetterMap = (_d = {}, _d[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ARRAY_ROWS"]] = getRawValueSimply, _d[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_OBJECT_ROWS"]] = function(dataItem, dimIndex, property) {
    return dataItem[property];
}, _d[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_KEYED_COLUMNS"]] = getRawValueSimply, _d[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ORIGINAL"]] = function(dataItem, dimIndex, property) {
    // FIXME: In some case (markpoint in geo (geo-map.html)),
    // dataItem is {coord: [...]}
    var value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDataItemValue"])(dataItem);
    return !(value instanceof Array) ? value : value[dimIndex];
}, _d[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_TYPED_ARRAY"]] = getRawValueSimply, _d);
function getRawSourceValueGetter(sourceFormat) {
    var method = rawSourceValueGetterMap[sourceFormat];
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(method, 'Do not support get value on "' + sourceFormat + '".');
    }
    return method;
}
function getMethodMapKey(sourceFormat, seriesLayoutBy) {
    return sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ARRAY_ROWS"] ? sourceFormat + '_' + seriesLayoutBy : sourceFormat;
}
function retrieveRawValue(data, dataIndex, // If dimIndex is null/undefined, return OptionDataItem.
// Otherwise, return OptionDataValue.
dim) {
    if (!data) {
        return;
    }
    // Consider data may be not persistent.
    var dataItem = data.getRawDataItem(dataIndex);
    if (dataItem == null) {
        return;
    }
    var store = data.getStore();
    var sourceFormat = store.getSource().sourceFormat;
    if (dim != null) {
        var dimIndex = data.getDimensionIndex(dim);
        var property = store.getDimensionProperty(dimIndex);
        return getRawSourceValueGetter(sourceFormat)(dataItem, dimIndex, property);
    } else {
        var result = dataItem;
        if (sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ORIGINAL"]) {
            result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDataItemValue"])(dataItem);
        }
        return result;
    }
}
function retrieveRawAttr(data, dataIndex, attr) {
    if (!data) {
        return;
    }
    var sourceFormat = data.getStore().getSource().sourceFormat;
    if (sourceFormat !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ORIGINAL"] && sourceFormat !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_OBJECT_ROWS"]) {
        return;
    }
    var dataItem = data.getRawDataItem(dataIndex);
    if (sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ORIGINAL"] && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(dataItem)) {
        dataItem = null;
    }
    if (dataItem) {
        return dataItem[attr];
    }
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/dataStackHelper.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "enableDataStack",
    ()=>enableDataStack,
    "getStackedDimension",
    ()=>getStackedDimension,
    "isDimensionStacked",
    ()=>isDimensionStacked
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$SeriesDataSchema$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/SeriesDataSchema.js [app-ssr] (ecmascript)");
;
;
function enableDataStack(seriesModel, dimensionsInput, opt) {
    opt = opt || {};
    var byIndex = opt.byIndex;
    var stackedCoordDimension = opt.stackedCoordDimension;
    var dimensionDefineList;
    var schema;
    var store;
    if (isLegacyDimensionsInput(dimensionsInput)) {
        dimensionDefineList = dimensionsInput;
    } else {
        schema = dimensionsInput.schema;
        dimensionDefineList = schema.dimensions;
        store = dimensionsInput.store;
    }
    // compatible: when `stack` is set as '', do not stack.
    var mayStack = !!(seriesModel && seriesModel.get('stack'));
    var stackedByDimInfo;
    var stackedDimInfo;
    var stackResultDimension;
    var stackedOverDimension;
    var allDimTypesAreNotOrdinalAndTime = true;
    function dimTypeIsNotOrdinalAndTime(dimensionInfo) {
        return dimensionInfo.type !== 'ordinal' && dimensionInfo.type !== 'time';
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(dimensionDefineList, function(dimensionInfo, index) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(dimensionInfo)) {
            dimensionDefineList[index] = dimensionInfo = {
                name: dimensionInfo
            };
        }
        if (!dimTypeIsNotOrdinalAndTime(dimensionInfo)) {
            allDimTypesAreNotOrdinalAndTime = false;
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(dimensionDefineList, function(dimensionInfo, index) {
        if (mayStack && !dimensionInfo.isExtraCoord) {
            // Find the first ordinal dimension as the stackedByDimInfo.
            if (!byIndex && !stackedByDimInfo && dimensionInfo.ordinalMeta) {
                stackedByDimInfo = dimensionInfo;
            }
            // Find the first stackable dimension as the stackedDimInfo.
            if (!stackedDimInfo && dimTypeIsNotOrdinalAndTime(dimensionInfo) && (!allDimTypesAreNotOrdinalAndTime || dimensionInfo.coordDim !== 'x' && dimensionInfo.coordDim !== 'angle') && (!stackedCoordDimension || stackedCoordDimension === dimensionInfo.coordDim)) {
                stackedDimInfo = dimensionInfo;
            }
        }
    });
    if (stackedDimInfo && !byIndex && !stackedByDimInfo) {
        // "Stack by data index" makes sense only if users provide carefully constructed data - any
        // mismatch or absence of data items can cause incorrect results. By "Stack by data index"
        // is more performant - no hashmap is required.
        // PENDING:
        //  Compatible with previous design, non-category axis ("value"/"log"/"time" axis) can only
        //  stack by index. "Stack by value" will not be supported until concrete requirements arise.
        byIndex = true;
    }
    if (stackedDimInfo) {
        // Use a weird name that not duplicated with other names.
        // Also need to use seriesModel.id as postfix because different
        // series may share same data store. The stack dimension needs to be distinguished.
        stackResultDimension = '__\0ecstackresult_' + seriesModel.id;
        stackedOverDimension = '__\0ecstackedover_' + seriesModel.id;
        // Create inverted index to fast query index by value.
        if (stackedByDimInfo) {
            stackedByDimInfo.createInvertedIndices = true;
        }
        var stackedDimCoordDim_1 = stackedDimInfo.coordDim;
        var stackedDimType = stackedDimInfo.type;
        var stackedDimCoordIndex_1 = 0;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(dimensionDefineList, function(dimensionInfo) {
            if (dimensionInfo.coordDim === stackedDimCoordDim_1) {
                stackedDimCoordIndex_1++;
            }
        });
        var stackedOverDimensionDefine = {
            name: stackResultDimension,
            coordDim: stackedDimCoordDim_1,
            coordDimIndex: stackedDimCoordIndex_1,
            type: stackedDimType,
            isExtraCoord: true,
            isCalculationCoord: true,
            storeDimIndex: dimensionDefineList.length
        };
        var stackResultDimensionDefine = {
            name: stackedOverDimension,
            // This dimension contains stack base (generally, 0), so do not set it as
            // `stackedDimCoordDim` to avoid extent calculation, consider log scale.
            coordDim: stackedOverDimension,
            coordDimIndex: stackedDimCoordIndex_1 + 1,
            type: stackedDimType,
            isExtraCoord: true,
            isCalculationCoord: true,
            storeDimIndex: dimensionDefineList.length + 1
        };
        if (schema) {
            if (store) {
                stackedOverDimensionDefine.storeDimIndex = store.ensureCalculationDimension(stackedOverDimension, stackedDimType);
                stackResultDimensionDefine.storeDimIndex = store.ensureCalculationDimension(stackResultDimension, stackedDimType);
            }
            schema.appendCalculationDimension(stackedOverDimensionDefine);
            schema.appendCalculationDimension(stackResultDimensionDefine);
        } else {
            dimensionDefineList.push(stackedOverDimensionDefine);
            dimensionDefineList.push(stackResultDimensionDefine);
        }
    }
    return {
        stackedDimension: stackedDimInfo && stackedDimInfo.name,
        stackedByDimension: stackedByDimInfo && stackedByDimInfo.name,
        isStackedByIndex: byIndex,
        stackedOverDimension: stackedOverDimension,
        stackResultDimension: stackResultDimension
    };
}
function isLegacyDimensionsInput(dimensionsInput) {
    return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$SeriesDataSchema$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isSeriesDataSchema"])(dimensionsInput.schema);
}
function isDimensionStacked(data, stackedDim) {
    // Each single series only maps to one pair of axis. So we do not need to
    // check stackByDim, whatever stacked by a dimension or stacked by index.
    return !!stackedDim && stackedDim === data.getCalculationInfo('stackedDimension');
}
function getStackedDimension(data, targetDim) {
    return isDimensionStacked(data, targetDim) ? data.getCalculationInfo('stackResultDimension') : targetDim;
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/dataValueHelper.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SortOrderComparator",
    ()=>SortOrderComparator,
    "createFilterComparator",
    ()=>createFilterComparator,
    "getRawValueParser",
    ()=>getRawValueParser,
    "parseDataValue",
    ()=>parseDataValue,
    "parseSanitizationFilter",
    ()=>parseSanitizationFilter,
    "passesSanitizationFilter",
    ()=>passesSanitizationFilter
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-ssr] (ecmascript)");
;
;
;
function parseDataValue(value, // For high performance, do not omit the second param.
opt) {
    // Performance sensitive.
    var dimType = opt && opt.type;
    if (dimType === 'ordinal') {
        // If given value is a category string
        return value;
    }
    if (dimType === 'time' && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNumber"])(value) && value != null && value !== '-') {
        value = +(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseDate"])(value);
    }
    // dimType defaults 'number'.
    // If dimType is not ordinal and value is null or undefined or NaN or '-',
    // parse to NaN.
    // number-like string (like ' 123 ') can be converted to a number.
    // where null/undefined or other string will be converted to NaN.
    return value == null || value === '' ? NaN : Number(value);
}
;
var valueParserMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])({
    'number': function(val) {
        // Do not use `numericToNumber` here. We have `numericToNumber` by default.
        // Here the number parser can have loose rule:
        // enable to cut suffix: "120px" => 120, "14%" => 14.
        return parseFloat(val);
    },
    'time': function(val) {
        // return timestamp.
        return +(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseDate"])(val);
    },
    'trim': function(val) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(val) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trim"])(val) : val;
    }
});
function getRawValueParser(type) {
    return valueParserMap.get(type);
}
var ORDER_COMPARISON_OP_MAP = {
    lt: function(lval, rval) {
        return lval < rval;
    },
    lte: function(lval, rval) {
        return lval <= rval;
    },
    gt: function(lval, rval) {
        return lval > rval;
    },
    gte: function(lval, rval) {
        return lval >= rval;
    }
};
var FilterOrderComparator = /** @class */ function() {
    function FilterOrderComparator(op, rval) {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNumber"])(rval)) {
            var errMsg = '';
            if (("TURBOPACK compile-time value", "development") !== 'production') {
                errMsg = 'rvalue of "<", ">", "<=", ">=" can only be number in filter.';
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwError"])(errMsg);
        }
        this._opFn = ORDER_COMPARISON_OP_MAP[op];
        this._rvalFloat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numericToNumber"])(rval);
    }
    // Performance sensitive.
    FilterOrderComparator.prototype.evaluate = function(lval) {
        // Most cases is 'number', and typeof maybe 10 times faseter than parseFloat.
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNumber"])(lval) ? this._opFn(lval, this._rvalFloat) : this._opFn((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numericToNumber"])(lval), this._rvalFloat);
    };
    return FilterOrderComparator;
}();
var SortOrderComparator = /** @class */ function() {
    /**
   * @param order by default: 'asc'
   * @param incomparable by default: Always on the tail.
   *        That is, if 'asc' => 'max', if 'desc' => 'min'
   *        See the definition of "incomparable" in [SORT_COMPARISON_RULE].
   */ function SortOrderComparator(order, incomparable) {
        var isDesc = order === 'desc';
        this._resultLT = isDesc ? 1 : -1;
        if (incomparable == null) {
            incomparable = isDesc ? 'min' : 'max';
        }
        this._incomparable = incomparable === 'min' ? -Infinity : Infinity;
    }
    // See [SORT_COMPARISON_RULE].
    // Performance sensitive.
    SortOrderComparator.prototype.evaluate = function(lval, rval) {
        // Most cases is 'number', and typeof maybe 10 times faseter than parseFloat.
        var lvalFloat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNumber"])(lval) ? lval : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numericToNumber"])(lval);
        var rvalFloat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNumber"])(rval) ? rval : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numericToNumber"])(rval);
        var lvalNotNumeric = isNaN(lvalFloat);
        var rvalNotNumeric = isNaN(rvalFloat);
        if (lvalNotNumeric) {
            lvalFloat = this._incomparable;
        }
        if (rvalNotNumeric) {
            rvalFloat = this._incomparable;
        }
        if (lvalNotNumeric && rvalNotNumeric) {
            var lvalIsStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(lval);
            var rvalIsStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(rval);
            if (lvalIsStr) {
                lvalFloat = rvalIsStr ? lval : 0;
            }
            if (rvalIsStr) {
                rvalFloat = lvalIsStr ? rval : 0;
            }
        }
        return lvalFloat < rvalFloat ? this._resultLT : lvalFloat > rvalFloat ? -this._resultLT : 0;
    };
    return SortOrderComparator;
}();
;
var FilterEqualityComparator = /** @class */ function() {
    function FilterEqualityComparator(isEq, rval) {
        this._rval = rval;
        this._isEQ = isEq;
        this._rvalTypeof = typeof rval;
        this._rvalFloat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numericToNumber"])(rval);
    }
    // Performance sensitive.
    FilterEqualityComparator.prototype.evaluate = function(lval) {
        var eqResult = lval === this._rval;
        if (!eqResult) {
            var lvalTypeof = typeof lval;
            if (lvalTypeof !== this._rvalTypeof && (lvalTypeof === 'number' || this._rvalTypeof === 'number')) {
                eqResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numericToNumber"])(lval) === this._rvalFloat;
            }
        }
        return this._isEQ ? eqResult : !eqResult;
    };
    return FilterEqualityComparator;
}();
function createFilterComparator(op, rval) {
    return op === 'eq' || op === 'ne' ? new FilterEqualityComparator(op === 'eq', rval) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasOwn"])(ORDER_COMPARISON_OP_MAP, op) ? new FilterOrderComparator(op, rval) : null;
}
function parseSanitizationFilter(filter) {
    var filterKey = '';
    var filterG = -Infinity;
    var filterGE = -Infinity;
    var filterL = Infinity;
    var filterLE = Infinity;
    if (filter) {
        if (filter.g != null) {
            filterKey += 'G' + filter.g;
            filterG = filter.g;
        }
        if (filter.ge != null) {
            filterKey += 'GE' + filter.ge;
            filterGE = filter.ge;
        }
        if (filter.l != null) {
            filterKey += 'L' + filter.l;
            filterL = filter.l;
        }
        if (filter.le != null) {
            filterKey += 'LE' + filter.le;
            filterLE = filter.le;
        }
    }
    return {
        key: filterKey,
        g: filterG,
        ge: filterGE,
        l: filterL,
        le: filterLE
    };
}
function passesSanitizationFilter(filterParsed, value) {
    return value > filterParsed.g && value >= filterParsed.ge && value < filterParsed.l && value <= filterParsed.le;
} // --------- END: Data store sanitization filters ---------
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/dimensionHelper.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDimensionTypeByAxis",
    ()=>getDimensionTypeByAxis,
    "summarizeDimensions",
    ()=>summarizeDimensions
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
var DimensionUserOuput = /** @class */ function() {
    function DimensionUserOuput(encode, dimRequest) {
        this._encode = encode;
        this._schema = dimRequest;
    }
    DimensionUserOuput.prototype.get = function() {
        return {
            // Do not generate full dimension name until fist used.
            fullDimensions: this._getFullDimensionNames(),
            encode: this._encode
        };
    };
    /**
   * Get all data store dimension names.
   * Theoretically a series data store is defined both by series and used dataset (if any).
   * If some dimensions are omitted for performance reason in `this.dimensions`,
   * the dimension name may not be auto-generated if user does not specify a dimension name.
   * In this case, the dimension name is `null`/`undefined`.
   */ DimensionUserOuput.prototype._getFullDimensionNames = function() {
        if (!this._cachedDimNames) {
            this._cachedDimNames = this._schema ? this._schema.makeOutputDimensionNames() : [];
        }
        return this._cachedDimNames;
    };
    return DimensionUserOuput;
}();
;
function summarizeDimensions(data, schema) {
    var summary = {};
    var encode = summary.encode = {};
    var notExtraCoordDimMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
    var defaultedLabel = [];
    var defaultedTooltip = [];
    var userOutputEncode = {};
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(data.dimensions, function(dimName) {
        var dimItem = data.getDimensionInfo(dimName);
        var coordDim = dimItem.coordDim;
        if (coordDim) {
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VISUAL_DIMENSIONS"].get(coordDim) == null);
            }
            var coordDimIndex = dimItem.coordDimIndex;
            getOrCreateEncodeArr(encode, coordDim)[coordDimIndex] = dimName;
            if (!dimItem.isExtraCoord) {
                notExtraCoordDimMap.set(coordDim, 1);
                // Use the last coord dim (and label friendly) as default label,
                // because when dataset is used, it is hard to guess which dimension
                // can be value dimension. If both show x, y on label is not look good,
                // and conventionally y axis is focused more.
                if (mayLabelDimType(dimItem.type)) {
                    defaultedLabel[0] = dimName;
                }
                // User output encode do not contain generated coords.
                // And it only has index. User can use index to retrieve value from the raw item array.
                getOrCreateEncodeArr(userOutputEncode, coordDim)[coordDimIndex] = data.getDimensionIndex(dimItem.name);
            }
            if (dimItem.defaultTooltip) {
                defaultedTooltip.push(dimName);
            }
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VISUAL_DIMENSIONS"].each(function(v, otherDim) {
            var encodeArr = getOrCreateEncodeArr(encode, otherDim);
            var dimIndex = dimItem.otherDims[otherDim];
            if (dimIndex != null && dimIndex !== false) {
                encodeArr[dimIndex] = dimItem.name;
            }
        });
    });
    var dataDimsOnCoord = [];
    var encodeFirstDimNotExtra = {};
    notExtraCoordDimMap.each(function(v, coordDim) {
        var dimArr = encode[coordDim];
        encodeFirstDimNotExtra[coordDim] = dimArr[0];
        // Not necessary to remove duplicate, because a data
        // dim canot on more than one coordDim.
        dataDimsOnCoord = dataDimsOnCoord.concat(dimArr);
    });
    summary.dataDimsOnCoord = dataDimsOnCoord;
    summary.dataDimIndicesOnCoord = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(dataDimsOnCoord, function(dimName) {
        return data.getDimensionInfo(dimName).storeDimIndex;
    });
    summary.encodeFirstDimNotExtra = encodeFirstDimNotExtra;
    var encodeLabel = encode.label;
    // FIXME `encode.label` is not recommended, because formatter cannot be set
    // in this way. Use label.formatter instead. Maybe remove this approach someday.
    if (encodeLabel && encodeLabel.length) {
        defaultedLabel = encodeLabel.slice();
    }
    var encodeTooltip = encode.tooltip;
    if (encodeTooltip && encodeTooltip.length) {
        defaultedTooltip = encodeTooltip.slice();
    } else if (!defaultedTooltip.length) {
        defaultedTooltip = defaultedLabel.slice();
    }
    encode.defaultedLabel = defaultedLabel;
    encode.defaultedTooltip = defaultedTooltip;
    summary.userOutput = new DimensionUserOuput(userOutputEncode, schema);
    return summary;
}
function getOrCreateEncodeArr(encode, dim) {
    if (!encode.hasOwnProperty(dim)) {
        encode[dim] = [];
    }
    return encode[dim];
}
function getDimensionTypeByAxis(axisType) {
    return axisType === 'category' ? 'ordinal' : axisType === 'time' ? 'time' : 'float';
}
function mayLabelDimType(dimType) {
    // In most cases, ordinal and time do not suitable for label.
    // Ordinal info can be displayed on axis. Time is too long.
    return !(dimType === 'ordinal' || dimType === 'time');
} // function findTheLastDimMayLabel(data) {
 //     // Get last value dim
 //     let dimensions = data.dimensions.slice();
 //     let valueType;
 //     let valueDim;
 //     while (dimensions.length && (
 //         valueDim = dimensions.pop(),
 //         valueType = data.getDimensionInfo(valueDim).type,
 //         valueType === 'ordinal' || valueType === 'time'
 //     )) {} // jshint ignore:line
 //     return valueDim;
 // }
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/linkSeriesData.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
*/ /**
 * Link lists and struct (graph or tree)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
;
;
var inner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeInner"])();
function linkSeriesData(opt) {
    var mainData = opt.mainData;
    var datas = opt.datas;
    if (!datas) {
        datas = {
            main: mainData
        };
        opt.datasAttr = {
            main: 'data'
        };
    }
    opt.datas = opt.mainData = null;
    linkAll(mainData, datas, opt);
    // Porxy data original methods.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(datas, function(data) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(mainData.TRANSFERABLE_METHODS, function(methodName) {
            data.wrapMethod(methodName, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["curry"])(transferInjection, opt));
        });
    });
    // Beyond transfer, additional features should be added to `cloneShallow`.
    mainData.wrapMethod('cloneShallow', (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["curry"])(cloneShallowInjection, opt));
    // Only mainData trigger change, because struct.update may trigger
    // another changable methods, which may bring about dead lock.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(mainData.CHANGABLE_METHODS, function(methodName) {
        mainData.wrapMethod(methodName, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["curry"])(changeInjection, opt));
    });
    // Make sure datas contains mainData.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(datas[mainData.dataType] === mainData);
}
function transferInjection(opt, res) {
    if (isMainData(this)) {
        // Transfer datas to new main data.
        var datas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"])({}, inner(this).datas);
        datas[this.dataType] = res;
        linkAll(res, datas, opt);
    } else {
        // Modify the reference in main data to point newData.
        linkSingle(res, this.dataType, inner(this).mainData, opt);
    }
    return res;
}
function changeInjection(opt, res) {
    opt.struct && opt.struct.update();
    return res;
}
function cloneShallowInjection(opt, res) {
    // cloneShallow, which brings about some fragilities, may be inappropriate
    // to be exposed as an API. So for implementation simplicity we can make
    // the restriction that cloneShallow of not-mainData should not be invoked
    // outside, but only be invoked here.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(inner(res).datas, function(data, dataType) {
        data !== res && linkSingle(data.cloneShallow(), dataType, res, opt);
    });
    return res;
}
/**
 * Supplement method to List.
 *
 * @public
 * @param [dataType] If not specified, return mainData.
 */ function getLinkedData(dataType) {
    var mainData = inner(this).mainData;
    return dataType == null || mainData == null ? mainData : inner(mainData).datas[dataType];
}
/**
 * Get list of all linked data
 */ function getLinkedDataAll() {
    var mainData = inner(this).mainData;
    return mainData == null ? [
        {
            data: mainData
        }
    ] : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keys"])(inner(mainData).datas), function(type) {
        return {
            type: type,
            data: inner(mainData).datas[type]
        };
    });
}
function isMainData(data) {
    return inner(data).mainData === data;
}
function linkAll(mainData, datas, opt) {
    inner(mainData).datas = {};
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(datas, function(data, dataType) {
        linkSingle(data, dataType, mainData, opt);
    });
}
function linkSingle(data, dataType, mainData, opt) {
    inner(mainData).datas[dataType] = data;
    inner(data).mainData = mainData;
    data.dataType = dataType;
    if (opt.struct) {
        data[opt.structAttr] = opt.struct;
        opt.struct[opt.datasAttr[dataType]] = data;
    }
    // Supplement method.
    data.getLinkedData = getLinkedData;
    data.getLinkedDataAll = getLinkedDataAll;
}
const __TURBOPACK__default__export__ = linkSeriesData;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/sourceHelper.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BE_ORDINAL",
    ()=>BE_ORDINAL,
    "guessOrdinal",
    ()=>guessOrdinal,
    "makeSeriesEncodeForAxisCoordSys",
    ()=>makeSeriesEncodeForAxisCoordSys,
    "makeSeriesEncodeForNameBased",
    ()=>makeSeriesEncodeForNameBased,
    "queryDatasetUpstreamDatasetModels",
    ()=>queryDatasetUpstreamDatasetModels,
    "querySeriesUpstreamDatasetModel",
    ()=>querySeriesUpstreamDatasetModel,
    "resetSourceDefaulter",
    ()=>resetSourceDefaulter
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/types.js [app-ssr] (ecmascript)");
;
;
;
var BE_ORDINAL = {
    Must: 1,
    Might: 2,
    Not: 3 // Other cases
};
var innerGlobalModel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeInner"])();
function resetSourceDefaulter(ecModel) {
    // `datasetMap` is used to make default encode.
    innerGlobalModel(ecModel).datasetMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
}
function makeSeriesEncodeForAxisCoordSys(coordDimensions, seriesModel, source) {
    var encode = {};
    var datasetModel = querySeriesUpstreamDatasetModel(seriesModel);
    // Currently only make default when using dataset, util more reqirements occur.
    if (!datasetModel || !coordDimensions) {
        return encode;
    }
    var encodeItemName = [];
    var encodeSeriesName = [];
    var ecModel = seriesModel.ecModel;
    var datasetMap = innerGlobalModel(ecModel).datasetMap;
    var key = datasetModel.uid + '_' + source.seriesLayoutBy;
    var baseCategoryDimIndex;
    var categoryWayValueDimStart;
    coordDimensions = coordDimensions.slice();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(coordDimensions, function(coordDimInfoLoose, coordDimIdx) {
        var coordDimInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(coordDimInfoLoose) ? coordDimInfoLoose : coordDimensions[coordDimIdx] = {
            name: coordDimInfoLoose
        };
        if (coordDimInfo.type === 'ordinal' && baseCategoryDimIndex == null) {
            baseCategoryDimIndex = coordDimIdx;
            categoryWayValueDimStart = getDataDimCountOnCoordDim(coordDimInfo);
        }
        encode[coordDimInfo.name] = [];
    });
    var datasetRecord = datasetMap.get(key) || datasetMap.set(key, {
        categoryWayDim: categoryWayValueDimStart,
        valueWayDim: 0
    });
    // TODO
    // Auto detect first time axis and do arrangement.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(coordDimensions, function(coordDimInfo, coordDimIdx) {
        var coordDimName = coordDimInfo.name;
        var count = getDataDimCountOnCoordDim(coordDimInfo);
        // In value way.
        if (baseCategoryDimIndex == null) {
            var start = datasetRecord.valueWayDim;
            pushDim(encode[coordDimName], start, count);
            pushDim(encodeSeriesName, start, count);
            datasetRecord.valueWayDim += count;
        // ??? TODO give a better default series name rule?
        // especially when encode x y specified.
        // consider: when multiple series share one dimension
        // category axis, series name should better use
        // the other dimension name. On the other hand, use
        // both dimensions name.
        } else if (baseCategoryDimIndex === coordDimIdx) {
            pushDim(encode[coordDimName], 0, count);
            pushDim(encodeItemName, 0, count);
        } else {
            var start = datasetRecord.categoryWayDim;
            pushDim(encode[coordDimName], start, count);
            pushDim(encodeSeriesName, start, count);
            datasetRecord.categoryWayDim += count;
        }
    });
    function pushDim(dimIdxArr, idxFrom, idxCount) {
        for(var i = 0; i < idxCount; i++){
            dimIdxArr.push(idxFrom + i);
        }
    }
    function getDataDimCountOnCoordDim(coordDimInfo) {
        var dimsDef = coordDimInfo.dimsDef;
        return dimsDef ? dimsDef.length : 1;
    }
    encodeItemName.length && (encode.itemName = encodeItemName);
    encodeSeriesName.length && (encode.seriesName = encodeSeriesName);
    return encode;
}
function makeSeriesEncodeForNameBased(seriesModel, source, dimCount) {
    var encode = {};
    var datasetModel = querySeriesUpstreamDatasetModel(seriesModel);
    // Currently only make default when using dataset, util more reqirements occur.
    if (!datasetModel) {
        return encode;
    }
    var sourceFormat = source.sourceFormat;
    var dimensionsDefine = source.dimensionsDefine;
    var potentialNameDimIndex;
    if (sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_OBJECT_ROWS"] || sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_KEYED_COLUMNS"]) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(dimensionsDefine, function(dim, idx) {
            if (((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(dim) ? dim.name : dim) === 'name') {
                potentialNameDimIndex = idx;
            }
        });
    }
    var idxResult = function() {
        var idxRes0 = {};
        var idxRes1 = {};
        var guessRecords = [];
        // 5 is an experience value.
        for(var i = 0, len = Math.min(5, dimCount); i < len; i++){
            var guessResult = doGuessOrdinal(source.data, sourceFormat, source.seriesLayoutBy, dimensionsDefine, source.startIndex, i);
            guessRecords.push(guessResult);
            var isPureNumber = guessResult === BE_ORDINAL.Not;
            // [Strategy of idxRes0]: find the first BE_ORDINAL.Not as the value dim,
            // and then find a name dim with the priority:
            // "BE_ORDINAL.Might|BE_ORDINAL.Must" > "other dim" > "the value dim itself".
            if (isPureNumber && idxRes0.v == null && i !== potentialNameDimIndex) {
                idxRes0.v = i;
            }
            if (idxRes0.n == null || idxRes0.n === idxRes0.v || !isPureNumber && guessRecords[idxRes0.n] === BE_ORDINAL.Not) {
                idxRes0.n = i;
            }
            if (fulfilled(idxRes0) && guessRecords[idxRes0.n] !== BE_ORDINAL.Not) {
                return idxRes0;
            }
            // [Strategy of idxRes1]: if idxRes0 not satisfied (that is, no BE_ORDINAL.Not),
            // find the first BE_ORDINAL.Might as the value dim,
            // and then find a name dim with the priority:
            // "other dim" > "the value dim itself".
            // That is for backward compat: number-like (e.g., `'3'`, `'55'`) can be
            // treated as number.
            if (!isPureNumber) {
                if (guessResult === BE_ORDINAL.Might && idxRes1.v == null && i !== potentialNameDimIndex) {
                    idxRes1.v = i;
                }
                if (idxRes1.n == null || idxRes1.n === idxRes1.v) {
                    idxRes1.n = i;
                }
            }
        }
        function fulfilled(idxResult) {
            return idxResult.v != null && idxResult.n != null;
        }
        return fulfilled(idxRes0) ? idxRes0 : fulfilled(idxRes1) ? idxRes1 : null;
    }();
    if (idxResult) {
        encode.value = [
            idxResult.v
        ];
        // `potentialNameDimIndex` has highest priority.
        var nameDimIndex = potentialNameDimIndex != null ? potentialNameDimIndex : idxResult.n;
        // By default, label uses itemName in charts.
        // So we don't set encodeLabel here.
        encode.itemName = [
            nameDimIndex
        ];
        encode.seriesName = [
            nameDimIndex
        ];
    }
    return encode;
}
function querySeriesUpstreamDatasetModel(seriesModel) {
    // Caution: consider the scenario:
    // A dataset is declared and a series is not expected to use the dataset,
    // and at the beginning `setOption({series: { noData })` (just prepare other
    // option but no data), then `setOption({series: {data: [...]}); In this case,
    // the user should set an empty array to avoid that dataset is used by default.
    var thisData = seriesModel.get('data', true);
    if (!thisData) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["queryReferringComponents"])(seriesModel.ecModel, 'dataset', {
            index: seriesModel.get('datasetIndex', true),
            id: seriesModel.get('datasetId', true)
        }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SINGLE_REFERRING"]).models[0];
    }
}
function queryDatasetUpstreamDatasetModels(datasetModel) {
    // Only these attributes declared, we by default reference to `datasetIndex: 0`.
    // Otherwise, no reference.
    if (!datasetModel.get('transform', true) && !datasetModel.get('fromTransformResult', true)) {
        return [];
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["queryReferringComponents"])(datasetModel.ecModel, 'dataset', {
        index: datasetModel.get('fromDatasetIndex', true),
        id: datasetModel.get('fromDatasetId', true)
    }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SINGLE_REFERRING"]).models;
}
function guessOrdinal(source, dimIndex) {
    return doGuessOrdinal(source.data, source.sourceFormat, source.seriesLayoutBy, source.dimensionsDefine, source.startIndex, dimIndex);
}
// dimIndex may be overflow source data.
// return {BE_ORDINAL}
function doGuessOrdinal(data, sourceFormat, seriesLayoutBy, dimensionsDefine, startIndex, dimIndex) {
    var result;
    // Experience value.
    var maxLoop = 5;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTypedArray"])(data)) {
        return BE_ORDINAL.Not;
    }
    // When sourceType is 'objectRows' or 'keyedColumns', dimensionsDefine
    // always exists in source.
    var dimName;
    var dimType;
    if (dimensionsDefine) {
        var dimDefItem = dimensionsDefine[dimIndex];
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(dimDefItem)) {
            dimName = dimDefItem.name;
            dimType = dimDefItem.type;
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(dimDefItem)) {
            dimName = dimDefItem;
        }
    }
    if (dimType != null) {
        return dimType === 'ordinal' ? BE_ORDINAL.Must : BE_ORDINAL.Not;
    }
    if (sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ARRAY_ROWS"]) {
        var dataArrayRows = data;
        if (seriesLayoutBy === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIES_LAYOUT_BY_ROW"]) {
            var sample = dataArrayRows[dimIndex];
            for(var i = 0; i < (sample || []).length && i < maxLoop; i++){
                if ((result = detectValue(sample[startIndex + i])) != null) {
                    return result;
                }
            }
        } else {
            for(var i = 0; i < dataArrayRows.length && i < maxLoop; i++){
                var row = dataArrayRows[startIndex + i];
                if (row && (result = detectValue(row[dimIndex])) != null) {
                    return result;
                }
            }
        }
    } else if (sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_OBJECT_ROWS"]) {
        var dataObjectRows = data;
        if (!dimName) {
            return BE_ORDINAL.Not;
        }
        for(var i = 0; i < dataObjectRows.length && i < maxLoop; i++){
            var item = dataObjectRows[i];
            if (item && (result = detectValue(item[dimName])) != null) {
                return result;
            }
        }
    } else if (sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_KEYED_COLUMNS"]) {
        var dataKeyedColumns = data;
        if (!dimName) {
            return BE_ORDINAL.Not;
        }
        var sample = dataKeyedColumns[dimName];
        if (!sample || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTypedArray"])(sample)) {
            return BE_ORDINAL.Not;
        }
        for(var i = 0; i < sample.length && i < maxLoop; i++){
            if ((result = detectValue(sample[i])) != null) {
                return result;
            }
        }
    } else if (sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ORIGINAL"]) {
        var dataOriginal = data;
        for(var i = 0; i < dataOriginal.length && i < maxLoop; i++){
            var item = dataOriginal[i];
            var val = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDataItemValue"])(item);
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"])(val)) {
                return BE_ORDINAL.Not;
            }
            if ((result = detectValue(val[dimIndex])) != null) {
                return result;
            }
        }
    }
    function detectValue(val) {
        var beStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(val);
        // Consider usage convenience, '1', '2' will be treated as "number".
        // `Number('')` (or any whitespace) is `0`.
        // `Number(val)` prevents error for BigInt.
        if (val != null && isFinite(Number(val)) && val !== '') {
            return beStr ? BE_ORDINAL.Might : BE_ORDINAL.Not;
        } else if (beStr && val !== '-') {
            return BE_ORDINAL.Must;
        }
    }
    return BE_ORDINAL.Not;
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/sourceManager.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SourceManager",
    ()=>SourceManager,
    "disableTransformOptionMerge",
    ()=>disableTransformOptionMerge
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Source$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/Source.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/types.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$sourceHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/sourceHelper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$transform$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/transform.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$DataStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/DataStore.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/dataProvider.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
/**
 * [REQUIREMENT_MEMO]:
 * (0) `metaRawOption` means `dimensions`/`sourceHeader`/`seriesLayoutBy` in raw option.
 * (1) Keep support the feature: `metaRawOption` can be specified both on `series` and
 * `root-dataset`. Them on `series` has higher priority.
 * (2) Do not support to set `metaRawOption` on a `non-root-dataset`, because it might
 * confuse users: whether those props indicate how to visit the upstream source or visit
 * the transform result source, and some transforms has nothing to do with these props,
 * and some transforms might have multiple upstream.
 * (3) Transforms should specify `metaRawOption` in each output, just like they can be
 * declared in `root-dataset`.
 * (4) At present only support visit source in `SERIES_LAYOUT_BY_COLUMN` in transforms.
 * That is for reducing complexity in transforms.
 * PENDING: Whether to provide transposition transform?
 *
 * [IMPLEMENTAION_MEMO]:
 * "sourceVisitConfig" are calculated from `metaRawOption` and `data`.
 * They will not be calculated until `source` is about to be visited (to prevent from
 * duplicate calcuation). `source` is visited only in series and input to transforms.
 *
 * [DIMENSION_INHERIT_RULE]:
 * By default the dimensions are inherited from ancestors, unless a transform return
 * a new dimensions definition.
 * Consider the case:
 * ```js
 * dataset: [{
 *     source: [ ['Product', 'Sales', 'Prise'], ['Cookies', 321, 44.21], ...]
 * }, {
 *     transform: { type: 'filter', ... }
 * }]
 * dataset: [{
 *     dimension: ['Product', 'Sales', 'Prise'],
 *     source: [ ['Cookies', 321, 44.21], ...]
 * }, {
 *     transform: { type: 'filter', ... }
 * }]
 * ```
 * The two types of option should have the same behavior after transform.
 *
 *
 * [SCENARIO]:
 * (1) Provide source data directly:
 * ```js
 * series: {
 *     encode: {...},
 *     dimensions: [...]
 *     seriesLayoutBy: 'row',
 *     data: [[...]]
 * }
 * ```
 * (2) Series refer to dataset.
 * ```js
 * series: [{
 *     encode: {...}
 *     // Ignore datasetIndex means `datasetIndex: 0`
 *     // and the dimensions defination in dataset is used
 * }, {
 *     encode: {...},
 *     seriesLayoutBy: 'column',
 *     datasetIndex: 1
 * }]
 * ```
 * (3) dataset transform
 * ```js
 * dataset: [{
 *     source: [...]
 * }, {
 *     source: [...]
 * }, {
 *     // By default from 0.
 *     transform: { type: 'filter', config: {...} }
 * }, {
 *     // Piped.
 *     transform: [
 *         { type: 'filter', config: {...} },
 *         { type: 'sort', config: {...} }
 *     ]
 * }, {
 *     id: 'regressionData',
 *     fromDatasetIndex: 1,
 *     // Third-party transform
 *     transform: { type: 'ecStat:regression', config: {...} }
 * }, {
 *     // retrieve the extra result.
 *     id: 'regressionFormula',
 *     fromDatasetId: 'regressionData',
 *     fromTransformResult: 1
 * }]
 * ```
 */ var SourceManager = /** @class */ function() {
    function SourceManager(sourceHost) {
        // Cached source. Do not repeat calculating if not dirty.
        this._sourceList = [];
        this._storeList = [];
        // version sign of each upstream source manager.
        this._upstreamSignList = [];
        this._versionSignBase = 0;
        this._dirty = true;
        this._sourceHost = sourceHost;
    }
    /**
   * Mark dirty.
   */ SourceManager.prototype.dirty = function() {
        this._setLocalSource([], []);
        this._storeList = [];
        this._dirty = true;
    };
    SourceManager.prototype._setLocalSource = function(sourceList, upstreamSignList) {
        this._sourceList = sourceList;
        this._upstreamSignList = upstreamSignList;
        this._versionSignBase++;
        if (this._versionSignBase > 9e10) {
            this._versionSignBase = 0;
        }
    };
    /**
   * For detecting whether the upstream source is dirty, so that
   * the local cached source (in `_sourceList`) should be discarded.
   */ SourceManager.prototype._getVersionSign = function() {
        return this._sourceHost.uid + '_' + this._versionSignBase;
    };
    /**
   * Always return a source instance. Otherwise throw error.
   */ SourceManager.prototype.prepareSource = function() {
        // For the case that call `setOption` multiple time but no data changed,
        // cache the result source to prevent from repeating transform.
        if (this._isDirty()) {
            this._createSource();
            this._dirty = false;
        }
    };
    SourceManager.prototype._createSource = function() {
        this._setLocalSource([], []);
        var sourceHost = this._sourceHost;
        var upSourceMgrList = this._getUpstreamSourceManagers();
        var hasUpstream = !!upSourceMgrList.length;
        var resultSourceList;
        var upstreamSignList;
        if (isSeries(sourceHost)) {
            var seriesModel = sourceHost;
            var data = void 0;
            var sourceFormat = void 0;
            var upSource = void 0;
            // Has upstream dataset
            if (hasUpstream) {
                var upSourceMgr = upSourceMgrList[0];
                upSourceMgr.prepareSource();
                upSource = upSourceMgr.getSource();
                data = upSource.data;
                sourceFormat = upSource.sourceFormat;
                upstreamSignList = [
                    upSourceMgr._getVersionSign()
                ];
            } else {
                data = seriesModel.get('data', true);
                sourceFormat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTypedArray"])(data) ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_TYPED_ARRAY"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ORIGINAL"];
                upstreamSignList = [];
            }
            // See [REQUIREMENT_MEMO], merge settings on series and parent dataset if it is root.
            var newMetaRawOption = this._getSourceMetaRawOption() || {};
            var upMetaRawOption = upSource && upSource.metaRawOption || {};
            var seriesLayoutBy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(newMetaRawOption.seriesLayoutBy, upMetaRawOption.seriesLayoutBy) || null;
            var sourceHeader = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(newMetaRawOption.sourceHeader, upMetaRawOption.sourceHeader);
            // Note here we should not use `upSource.dimensionsDefine`. Consider the case:
            // `upSource.dimensionsDefine` is detected by `seriesLayoutBy: 'column'`,
            // but series need `seriesLayoutBy: 'row'`.
            var dimensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(newMetaRawOption.dimensions, upMetaRawOption.dimensions);
            // We share source with dataset as much as possible
            // to avoid extra memory cost of high dimensional data.
            var needsCreateSource = seriesLayoutBy !== upMetaRawOption.seriesLayoutBy || !!sourceHeader !== !!upMetaRawOption.sourceHeader || dimensions;
            resultSourceList = needsCreateSource ? [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Source$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSource"])(data, {
                    seriesLayoutBy: seriesLayoutBy,
                    sourceHeader: sourceHeader,
                    dimensions: dimensions
                }, sourceFormat)
            ] : [];
        } else {
            var datasetModel = sourceHost;
            // Has upstream dataset.
            if (hasUpstream) {
                var result = this._applyTransform(upSourceMgrList);
                resultSourceList = result.sourceList;
                upstreamSignList = result.upstreamSignList;
            } else {
                var sourceData = datasetModel.get('source', true);
                resultSourceList = [
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Source$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSource"])(sourceData, this._getSourceMetaRawOption(), null)
                ];
                upstreamSignList = [];
            }
        }
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(resultSourceList && upstreamSignList);
        }
        this._setLocalSource(resultSourceList, upstreamSignList);
    };
    SourceManager.prototype._applyTransform = function(upMgrList) {
        var datasetModel = this._sourceHost;
        var transformOption = datasetModel.get('transform', true);
        var fromTransformResult = datasetModel.get('fromTransformResult', true);
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(fromTransformResult != null || transformOption != null);
        }
        if (fromTransformResult != null) {
            var errMsg = '';
            if (upMgrList.length !== 1) {
                if (("TURBOPACK compile-time value", "development") !== 'production') {
                    errMsg = 'When using `fromTransformResult`, there should be only one upstream dataset';
                }
                doThrow(errMsg);
            }
        }
        var sourceList;
        var upSourceList = [];
        var upstreamSignList = [];
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(upMgrList, function(upMgr) {
            upMgr.prepareSource();
            var upSource = upMgr.getSource(fromTransformResult || 0);
            var errMsg = '';
            if (fromTransformResult != null && !upSource) {
                if (("TURBOPACK compile-time value", "development") !== 'production') {
                    errMsg = 'Can not retrieve result by `fromTransformResult`: ' + fromTransformResult;
                }
                doThrow(errMsg);
            }
            upSourceList.push(upSource);
            upstreamSignList.push(upMgr._getVersionSign());
        });
        if (transformOption) {
            sourceList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$transform$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["applyDataTransform"])(transformOption, upSourceList, {
                datasetIndex: datasetModel.componentIndex
            });
        } else if (fromTransformResult != null) {
            sourceList = [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Source$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cloneSourceShallow"])(upSourceList[0])
            ];
        }
        return {
            sourceList: sourceList,
            upstreamSignList: upstreamSignList
        };
    };
    SourceManager.prototype._isDirty = function() {
        if (this._dirty) {
            return true;
        }
        // All sourceList is from the some upstream.
        var upSourceMgrList = this._getUpstreamSourceManagers();
        for(var i = 0; i < upSourceMgrList.length; i++){
            var upSrcMgr = upSourceMgrList[i];
            if (// Consider the case that there is ancestor diry, call it recursively.
            // The performance is probably not an issue because usually the chain is not long.
            upSrcMgr._isDirty() || this._upstreamSignList[i] !== upSrcMgr._getVersionSign()) {
                return true;
            }
        }
    };
    /**
   * @param sourceIndex By default 0, means "main source".
   *                    In most cases there is only one source.
   */ SourceManager.prototype.getSource = function(sourceIndex) {
        sourceIndex = sourceIndex || 0;
        var source = this._sourceList[sourceIndex];
        if (!source) {
            // Series may share source instance with dataset.
            var upSourceMgrList = this._getUpstreamSourceManagers();
            return upSourceMgrList[0] && upSourceMgrList[0].getSource(sourceIndex);
        }
        return source;
    };
    /**
   *
   * Get a data store which can be shared across series.
   * Only available for series.
   *
   * @param seriesDimRequest Dimensions that are generated in series.
   *        Should have been sorted by `storeDimIndex` asc.
   */ SourceManager.prototype.getSharedDataStore = function(seriesDimRequest) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(isSeries(this._sourceHost), 'Can only call getDataStore on series source manager.');
        }
        var schema = seriesDimRequest.makeStoreSchema();
        return this._innerGetDataStore(schema.dimensions, seriesDimRequest.source, schema.hash);
    };
    SourceManager.prototype._innerGetDataStore = function(storeDims, seriesSource, sourceReadKey) {
        // TODO Can use other sourceIndex?
        var sourceIndex = 0;
        var storeList = this._storeList;
        var cachedStoreMap = storeList[sourceIndex];
        if (!cachedStoreMap) {
            cachedStoreMap = storeList[sourceIndex] = {};
        }
        var cachedStore = cachedStoreMap[sourceReadKey];
        if (!cachedStore) {
            var upSourceMgr = this._getUpstreamSourceManagers()[0];
            if (isSeries(this._sourceHost) && upSourceMgr) {
                cachedStore = upSourceMgr._innerGetDataStore(storeDims, seriesSource, sourceReadKey);
            } else {
                cachedStore = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$DataStore$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]();
                // Always create store from source of series.
                cachedStore.initData(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DefaultDataProvider"](seriesSource, storeDims.length), storeDims);
            }
            cachedStoreMap[sourceReadKey] = cachedStore;
        }
        return cachedStore;
    };
    /**
   * PENDING: Is it fast enough?
   * If no upstream, return empty array.
   */ SourceManager.prototype._getUpstreamSourceManagers = function() {
        // Always get the relationship from the raw option.
        // Do not cache the link of the dependency graph, so that
        // there is no need to update them when change happens.
        var sourceHost = this._sourceHost;
        if (isSeries(sourceHost)) {
            var datasetModel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$sourceHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["querySeriesUpstreamDatasetModel"])(sourceHost);
            return !datasetModel ? [] : [
                datasetModel.getSourceManager()
            ];
        } else {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$sourceHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["queryDatasetUpstreamDatasetModels"])(sourceHost), function(datasetModel) {
                return datasetModel.getSourceManager();
            });
        }
    };
    SourceManager.prototype._getSourceMetaRawOption = function() {
        var sourceHost = this._sourceHost;
        var seriesLayoutBy;
        var sourceHeader;
        var dimensions;
        if (isSeries(sourceHost)) {
            seriesLayoutBy = sourceHost.get('seriesLayoutBy', true);
            sourceHeader = sourceHost.get('sourceHeader', true);
            dimensions = sourceHost.get('dimensions', true);
        } else if (!this._getUpstreamSourceManagers().length) {
            var model = sourceHost;
            seriesLayoutBy = model.get('seriesLayoutBy', true);
            sourceHeader = model.get('sourceHeader', true);
            dimensions = model.get('dimensions', true);
        }
        return {
            seriesLayoutBy: seriesLayoutBy,
            sourceHeader: sourceHeader,
            dimensions: dimensions
        };
    };
    return SourceManager;
}();
;
function disableTransformOptionMerge(datasetModel) {
    var transformOption = datasetModel.option.transform;
    transformOption && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAsPrimitive"])(datasetModel.option.transform);
}
function isSeries(sourceHost) {
    // Avoid circular dependency with Series.ts
    return sourceHost.mainType === 'series';
}
function doThrow(errMsg) {
    throw new Error(errMsg);
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/transform.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExternalSource",
    ()=>ExternalSource,
    "applyDataTransform",
    ()=>applyDataTransform,
    "registerExternalTransform",
    ()=>registerExternalTransform
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/types.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/dataProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataValueHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/dataValueHelper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Source$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/Source.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
/**
 * TODO: disable writable.
 * This structure will be exposed to users.
 */ var ExternalSource = /** @class */ function() {
    function ExternalSource() {}
    ExternalSource.prototype.getRawData = function() {
        // Only built-in transform available.
        throw new Error('not supported');
    };
    ExternalSource.prototype.getRawDataItem = function(dataIndex) {
        // Only built-in transform available.
        throw new Error('not supported');
    };
    ExternalSource.prototype.cloneRawData = function() {
        return;
    };
    /**
   * @return If dimension not found, return null/undefined.
   */ ExternalSource.prototype.getDimensionInfo = function(dim) {
        return;
    };
    /**
   * dimensions defined if and only if either:
   * (a) dataset.dimensions are declared.
   * (b) dataset data include dimensions definitions in data (detected or via specified `sourceHeader`).
   * If dimensions are defined, `dimensionInfoAll` is corresponding to
   * the defined dimensions.
   * Otherwise, `dimensionInfoAll` is determined by data columns.
   * @return Always return an array (even empty array).
   */ ExternalSource.prototype.cloneAllDimensionInfo = function() {
        return;
    };
    ExternalSource.prototype.count = function() {
        return;
    };
    /**
   * Only support by dimension index.
   * No need to support by dimension name in transform function,
   * because transform function is not case-specific, no need to use name literally.
   */ ExternalSource.prototype.retrieveValue = function(dataIndex, dimIndex) {
        return;
    };
    ExternalSource.prototype.retrieveValueFromItem = function(dataItem, dimIndex) {
        return;
    };
    ExternalSource.prototype.convertValue = function(rawVal, dimInfo) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataValueHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseDataValue"])(rawVal, dimInfo);
    };
    return ExternalSource;
}();
;
function createExternalSource(internalSource, externalTransform) {
    var extSource = new ExternalSource();
    var data = internalSource.data;
    var sourceFormat = extSource.sourceFormat = internalSource.sourceFormat;
    var sourceHeaderCount = internalSource.startIndex;
    var errMsg = '';
    if (internalSource.seriesLayoutBy !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIES_LAYOUT_BY_COLUMN"]) {
        // For the logic simplicity in transformer, only 'culumn' is
        // supported in data transform. Otherwise, the `dimensionsDefine`
        // might be detected by 'row', which probably confuses users.
        if (("TURBOPACK compile-time value", "development") !== 'production') {
            errMsg = '`seriesLayoutBy` of upstream dataset can only be "column" in data transform.';
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwError"])(errMsg);
    }
    // [MEMO]
    // Create a new dimensions structure for exposing.
    // Do not expose all dimension info to users directly.
    // Because the dimension is probably auto detected from data and not might reliable.
    // Should not lead the transformers to think that is reliable and return it.
    // See [DIMENSION_INHERIT_RULE] in `sourceManager.ts`.
    var dimensions = [];
    var dimsByName = {};
    var dimsDef = internalSource.dimensionsDefine;
    if (dimsDef) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(dimsDef, function(dimDef, idx) {
            var name = dimDef.name;
            var dimDefExt = {
                index: idx,
                name: name,
                displayName: dimDef.displayName
            };
            dimensions.push(dimDefExt);
            // Users probably do not specify dimension name. For simplicity, data transform
            // does not generate dimension name.
            if (name != null) {
                // Dimension name should not be duplicated.
                // For simplicity, data transform forbids name duplication, do not generate
                // new name like module `completeDimensions.ts` did, but just tell users.
                var errMsg_1 = '';
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasOwn"])(dimsByName, name)) {
                    if (("TURBOPACK compile-time value", "development") !== 'production') {
                        errMsg_1 = 'dimension name "' + name + '" duplicated.';
                    }
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwError"])(errMsg_1);
                }
                dimsByName[name] = dimDefExt;
            }
        });
    } else {
        for(var i = 0; i < internalSource.dimensionsDetectedCount || 0; i++){
            // Do not generete name or anything others. The consequence process in
            // `transform` or `series` probably have there own name generation strategry.
            dimensions.push({
                index: i
            });
        }
    }
    // Implement public methods:
    var rawItemGetter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRawSourceItemGetter"])(sourceFormat, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIES_LAYOUT_BY_COLUMN"]);
    if (externalTransform.__isBuiltIn) {
        extSource.getRawDataItem = function(dataIndex) {
            return rawItemGetter(data, sourceHeaderCount, dimensions, dataIndex);
        };
        extSource.getRawData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bind"])(getRawData, null, internalSource);
    }
    extSource.cloneRawData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bind"])(cloneRawData, null, internalSource);
    var rawCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRawSourceDataCounter"])(sourceFormat, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIES_LAYOUT_BY_COLUMN"]);
    extSource.count = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bind"])(rawCounter, null, data, sourceHeaderCount, dimensions);
    var rawValueGetter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRawSourceValueGetter"])(sourceFormat);
    extSource.retrieveValue = function(dataIndex, dimIndex) {
        var rawItem = rawItemGetter(data, sourceHeaderCount, dimensions, dataIndex);
        return retrieveValueFromItem(rawItem, dimIndex);
    };
    var retrieveValueFromItem = extSource.retrieveValueFromItem = function(dataItem, dimIndex) {
        if (dataItem == null) {
            return;
        }
        var dimDef = dimensions[dimIndex];
        // When `dimIndex` is `null`, `rawValueGetter` return the whole item.
        if (dimDef) {
            return rawValueGetter(dataItem, dimIndex, dimDef.name);
        }
    };
    extSource.getDimensionInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bind"])(getDimensionInfo, null, dimensions, dimsByName);
    extSource.cloneAllDimensionInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bind"])(cloneAllDimensionInfo, null, dimensions);
    return extSource;
}
function getRawData(upstream) {
    var sourceFormat = upstream.sourceFormat;
    if (!isSupportedSourceFormat(sourceFormat)) {
        var errMsg = '';
        if (("TURBOPACK compile-time value", "development") !== 'production') {
            errMsg = '`getRawData` is not supported in source format ' + sourceFormat;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwError"])(errMsg);
    }
    return upstream.data;
}
function cloneRawData(upstream) {
    var sourceFormat = upstream.sourceFormat;
    var data = upstream.data;
    if (!isSupportedSourceFormat(sourceFormat)) {
        var errMsg = '';
        if (("TURBOPACK compile-time value", "development") !== 'production') {
            errMsg = '`cloneRawData` is not supported in source format ' + sourceFormat;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwError"])(errMsg);
    }
    if (sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ARRAY_ROWS"]) {
        var result = [];
        for(var i = 0, len = data.length; i < len; i++){
            // Not strictly clone for performance
            result.push(data[i].slice());
        }
        return result;
    } else if (sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_OBJECT_ROWS"]) {
        var result = [];
        for(var i = 0, len = data.length; i < len; i++){
            // Not strictly clone for performance
            result.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"])({}, data[i]));
        }
        return result;
    }
}
function getDimensionInfo(dimensions, dimsByName, dim) {
    if (dim == null) {
        return;
    }
    // Keep the same logic as `List::getDimension` did.
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNumber"])(dim) || !isNaN(dim) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasOwn"])(dimsByName, dim)) {
        return dimensions[dim];
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasOwn"])(dimsByName, dim)) {
        return dimsByName[dim];
    }
}
function cloneAllDimensionInfo(dimensions) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clone"])(dimensions);
}
var externalTransformMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
function registerExternalTransform(externalTransform) {
    externalTransform = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clone"])(externalTransform);
    var type = externalTransform.type;
    var errMsg = '';
    if (!type) {
        if (("TURBOPACK compile-time value", "development") !== 'production') {
            errMsg = 'Must have a `type` when `registerTransform`.';
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwError"])(errMsg);
    }
    var typeParsed = type.split(':');
    if (typeParsed.length !== 2) {
        if (("TURBOPACK compile-time value", "development") !== 'production') {
            errMsg = 'Name must include namespace like "ns:regression".';
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwError"])(errMsg);
    }
    // Namespace 'echarts:xxx' is official namespace, where the transforms should
    // be called directly via 'xxx' rather than 'echarts:xxx'.
    var isBuiltIn = false;
    if (typeParsed[0] === 'echarts') {
        type = typeParsed[1];
        isBuiltIn = true;
    }
    externalTransform.__isBuiltIn = isBuiltIn;
    externalTransformMap.set(type, externalTransform);
}
function applyDataTransform(rawTransOption, sourceList, infoForPrint) {
    var pipedTransOption = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeToArray"])(rawTransOption);
    var pipeLen = pipedTransOption.length;
    var errMsg = '';
    if (!pipeLen) {
        if (("TURBOPACK compile-time value", "development") !== 'production') {
            errMsg = 'If `transform` declared, it should at least contain one transform.';
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwError"])(errMsg);
    }
    for(var i = 0, len = pipeLen; i < len; i++){
        var transOption = pipedTransOption[i];
        sourceList = applySingleDataTransform(transOption, sourceList, infoForPrint, pipeLen === 1 ? null : i);
        // piped transform only support single input, except the fist one.
        // piped transform only support single output, except the last one.
        if (i !== len - 1) {
            sourceList.length = Math.max(sourceList.length, 1);
        }
    }
    return sourceList;
}
function applySingleDataTransform(transOption, upSourceList, infoForPrint, // If `pipeIndex` is null/undefined, no piped transform.
pipeIndex) {
    var errMsg = '';
    if (!upSourceList.length) {
        if (("TURBOPACK compile-time value", "development") !== 'production') {
            errMsg = 'Must have at least one upstream dataset.';
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwError"])(errMsg);
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(transOption)) {
        if ("TURBOPACK compile-time truthy", 1) {
            errMsg = 'transform declaration must be an object rather than ' + typeof transOption + '.';
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwError"])(errMsg);
    }
    var transType = transOption.type;
    var externalTransform = externalTransformMap.get(transType);
    if (!externalTransform) {
        if (("TURBOPACK compile-time value", "development") !== 'production') {
            errMsg = 'Can not find transform on type "' + transType + '".';
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwError"])(errMsg);
    }
    // Prepare source
    var extUpSourceList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(upSourceList, function(upSource) {
        return createExternalSource(upSource, externalTransform);
    });
    var resultList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeToArray"])(externalTransform.transform({
        upstream: extUpSourceList[0],
        upstreamList: extUpSourceList,
        config: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clone"])(transOption.config)
    }));
    if ("TURBOPACK compile-time truthy", 1) {
        if (transOption.print) {
            var printStrArr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(resultList, function(extSource) {
                var pipeIndexStr = pipeIndex != null ? ' === pipe index: ' + pipeIndex : '';
                return [
                    '=== dataset index: ' + infoForPrint.datasetIndex + pipeIndexStr + ' ===',
                    '- transform result data:',
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makePrintable"])(extSource.data),
                    '- transform result dimensions:',
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makePrintable"])(extSource.dimensions)
                ].join('\n');
            }).join('\n');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["log"])(printStrArr);
        }
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(resultList, function(result, resultIndex) {
        var errMsg = '';
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(result)) {
            if (("TURBOPACK compile-time value", "development") !== 'production') {
                errMsg = 'A transform should not return some empty results.';
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwError"])(errMsg);
        }
        if (!result.data) {
            if (("TURBOPACK compile-time value", "development") !== 'production') {
                errMsg = 'Transform result data should be not be null or undefined';
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwError"])(errMsg);
        }
        var sourceFormat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Source$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["detectSourceFormat"])(result.data);
        if (!isSupportedSourceFormat(sourceFormat)) {
            if (("TURBOPACK compile-time value", "development") !== 'production') {
                errMsg = 'Transform result data should be array rows or object rows.';
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwError"])(errMsg);
        }
        var resultMetaRawOption;
        var firstUpSource = upSourceList[0];
        /**
     * Intuitively, the end users known the content of the original `dataset.source`,
     * calucating the transform result in mind.
     * Suppose the original `dataset.source` is:
     * ```js
     * [
     *     ['product', '2012', '2013', '2014', '2015'],
     *     ['AAA', 41.1, 30.4, 65.1, 53.3],
     *     ['BBB', 86.5, 92.1, 85.7, 83.1],
     *     ['CCC', 24.1, 67.2, 79.5, 86.4]
     * ]
     * ```
     * The dimension info have to be detected from the source data.
     * Some of the transformers (like filter, sort) will follow the dimension info
     * of upstream, while others use new dimensions (like aggregate).
     * Transformer can output a field `dimensions` to define the its own output dimensions.
     * We also allow transformers to ignore the output `dimensions` field, and
     * inherit the upstream dimensions definition. It can reduce the burden of handling
     * dimensions in transformers.
     *
     * See also [DIMENSION_INHERIT_RULE] in `sourceManager.ts`.
     */ if (firstUpSource && resultIndex === 0 && !result.dimensions) {
            var startIndex = firstUpSource.startIndex;
            // We copy the header of upstream to the result, because:
            // (1) The returned data always does not contain header line and can not be used
            // as dimension-detection. In this case we can not use "detected dimensions" of
            // upstream directly, because it might be detected based on different `seriesLayoutBy`.
            // (2) We should support that the series read the upstream source in `seriesLayoutBy: 'row'`.
            // So the original detected header should be add to the result, otherwise they can not be read.
            if (startIndex) {
                result.data = firstUpSource.data.slice(0, startIndex).concat(result.data);
            }
            resultMetaRawOption = {
                seriesLayoutBy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIES_LAYOUT_BY_COLUMN"],
                sourceHeader: startIndex,
                dimensions: firstUpSource.metaRawOption.dimensions
            };
        } else {
            resultMetaRawOption = {
                seriesLayoutBy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIES_LAYOUT_BY_COLUMN"],
                sourceHeader: 0,
                dimensions: result.dimensions
            };
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$Source$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSource"])(result.data, resultMetaRawOption, null);
    });
}
function isSupportedSourceFormat(sourceFormat) {
    return sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_ARRAY_ROWS"] || sourceFormat === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOURCE_FORMAT_OBJECT_ROWS"];
}
}),
];

//# sourceMappingURL=10pt_echarts_lib_data_1-u74h_._.js.map