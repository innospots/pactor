module.exports = [
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/animation/basicTransition.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAnimationConfig",
    ()=>getAnimationConfig,
    "getOldStyle",
    ()=>getOldStyle,
    "initProps",
    ()=>initProps,
    "isElementRemoved",
    ()=>isElementRemoved,
    "removeElement",
    ()=>removeElement,
    "removeElementWithFadeOut",
    ()=>removeElementWithFadeOut,
    "saveOldStyle",
    ()=>saveOldStyle,
    "transitionStore",
    ()=>transitionStore,
    "updateProps",
    ()=>updateProps
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
;
;
var transitionStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeInner"])();
function getAnimationConfig(animationType, animatableModel, dataIndex, // Extra opts can override the option in animatable model.
extraOpts, // TODO It's only for pictorial bar now.
extraDelayParams) {
    var animationPayload;
    // Check if there is global animation configuration from dataZoom/resize can override the config in option.
    // If animation is enabled. Will use this animation config in payload.
    // If animation is disabled. Just ignore it.
    if (animatableModel && animatableModel.ecModel) {
        var updatePayload = animatableModel.ecModel.getUpdatePayload();
        animationPayload = updatePayload && updatePayload.animation;
    }
    var animationEnabled = animatableModel && animatableModel.isAnimationEnabled();
    var isUpdate = animationType === 'update';
    if (animationEnabled) {
        var duration = void 0;
        var easing = void 0;
        var delay = void 0;
        if (extraOpts) {
            duration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(extraOpts.duration, 200);
            easing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(extraOpts.easing, 'cubicOut');
            delay = 0;
        } else {
            duration = animatableModel.getShallow(isUpdate ? 'animationDurationUpdate' : 'animationDuration');
            easing = animatableModel.getShallow(isUpdate ? 'animationEasingUpdate' : 'animationEasing');
            delay = animatableModel.getShallow(isUpdate ? 'animationDelayUpdate' : 'animationDelay');
        }
        // animation from payload has highest priority.
        if (animationPayload) {
            animationPayload.duration != null && (duration = animationPayload.duration);
            animationPayload.easing != null && (easing = animationPayload.easing);
            animationPayload.delay != null && (delay = animationPayload.delay);
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"])(delay)) {
            delay = delay(dataIndex, extraDelayParams);
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"])(duration)) {
            duration = duration(dataIndex);
        }
        var config = {
            duration: duration || 0,
            delay: delay,
            easing: easing
        };
        return config;
    } else {
        return null;
    }
}
function animateOrSetProps(animationType, el, props, animatableModel, dataIndex, cb, during) {
    var isFrom = false;
    var removeOpt;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"])(dataIndex)) {
        during = cb;
        cb = dataIndex;
        dataIndex = null;
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(dataIndex)) {
        cb = dataIndex.cb;
        during = dataIndex.during;
        isFrom = dataIndex.isFrom;
        removeOpt = dataIndex.removeOpt;
        dataIndex = dataIndex.dataIndex;
    }
    var isRemove = animationType === 'leave';
    if (!isRemove) {
        // Must stop the remove animation.
        el.stopAnimation('leave');
    }
    var animationConfig = getAnimationConfig(animationType, animatableModel, dataIndex, isRemove ? removeOpt || {} : null, animatableModel && animatableModel.getAnimationDelayParams ? animatableModel.getAnimationDelayParams(el, dataIndex) : null);
    if (animationConfig && animationConfig.duration > 0) {
        var duration = animationConfig.duration;
        var animationDelay = animationConfig.delay;
        var animationEasing = animationConfig.easing;
        var animateConfig = {
            duration: duration,
            delay: animationDelay || 0,
            easing: animationEasing,
            done: cb,
            force: !!cb || !!during,
            // Set to final state in update/init animation.
            // So the post processing based on the path shape can be done correctly.
            setToFinal: !isRemove,
            scope: animationType,
            during: during
        };
        isFrom ? el.animateFrom(props, animateConfig) : el.animateTo(props, animateConfig);
    } else {
        el.stopAnimation();
        // If `isFrom`, the props is the "from" props.
        !isFrom && el.attr(props);
        // Call during at least once.
        during && during(1);
        cb && cb();
    }
}
/**
 * Update graphic element properties with or without animation according to the
 * configuration in series.
 *
 * Caution: this method will stop previous animation.
 * So do not use this method to one element twice before
 * animation starts, unless you know what you are doing.
 * @example
 *     graphic.updateProps(el, {
 *         position: [100, 100]
 *     }, seriesModel, dataIndex, function () { console.log('Animation done!'); });
 *     // Or
 *     graphic.updateProps(el, {
 *         position: [100, 100]
 *     }, seriesModel, function () { console.log('Animation done!'); });
 */ function updateProps(el, props, // TODO: TYPE AnimatableModel
animatableModel, dataIndex, cb, during) {
    animateOrSetProps('update', el, props, animatableModel, dataIndex, cb, during);
}
;
function initProps(el, props, animatableModel, dataIndex, cb, during) {
    animateOrSetProps('enter', el, props, animatableModel, dataIndex, cb, during);
}
function isElementRemoved(el) {
    if (!el.__zr) {
        return true;
    }
    for(var i = 0; i < el.animators.length; i++){
        var animator = el.animators[i];
        if (animator.scope === 'leave') {
            return true;
        }
    }
    return false;
}
function removeElement(el, props, animatableModel, dataIndex, cb, during) {
    // Don't do remove animation twice.
    if (isElementRemoved(el)) {
        return;
    }
    animateOrSetProps('leave', el, props, animatableModel, dataIndex, cb, during);
}
function fadeOutDisplayable(el, animatableModel, dataIndex, done) {
    el.removeTextContent();
    el.removeTextGuideLine();
    removeElement(el, {
        style: {
            opacity: 0
        }
    }, animatableModel, dataIndex, done);
}
function removeElementWithFadeOut(el, animatableModel, dataIndex) {
    function doRemove() {
        el.parent && el.parent.remove(el);
    }
    // Hide label and labelLine first
    // TODO Also use fade out animation?
    if (!el.isGroup) {
        fadeOutDisplayable(el, animatableModel, dataIndex, doRemove);
    } else {
        el.traverse(function(disp) {
            if (!disp.isGroup) {
                // Can invoke doRemove multiple times.
                fadeOutDisplayable(disp, animatableModel, dataIndex, doRemove);
            }
        });
    }
}
function saveOldStyle(el) {
    transitionStore(el).oldStyle = el.style;
}
function getOldStyle(el) {
    return transitionStore(el).oldStyle;
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/extension.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "use",
    ()=>use
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$echarts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/echarts.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/view/Component.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/view/Chart.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Component.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Series.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$impl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/impl.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$zrender$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/zrender.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$custom$2f$customSeriesRegister$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/custom/customSeriesRegister.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
var extensions = [];
var extensionRegisters = {
    registerPreprocessor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$echarts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["registerPreprocessor"],
    registerProcessor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$echarts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["registerProcessor"],
    registerPostInit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$echarts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["registerPostInit"],
    registerPostUpdate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$echarts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["registerPostUpdate"],
    registerUpdateLifecycle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$echarts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["registerUpdateLifecycle"],
    registerAction: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$echarts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["registerAction"],
    registerCoordinateSystem: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$echarts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["registerCoordinateSystem"],
    registerLayout: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$echarts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["registerLayout"],
    registerVisual: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$echarts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["registerVisual"],
    registerTransform: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$echarts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["registerTransform"],
    registerLoading: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$echarts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["registerLoading"],
    registerMap: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$echarts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["registerMap"],
    registerImpl: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$impl$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerImpl"],
    PRIORITY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$echarts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["PRIORITY"],
    ComponentModel: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    ComponentView: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    SeriesModel: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    ChartView: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
    // TODO Use ComponentModel and SeriesModel instead of Constructor
    registerComponentModel: function(ComponentModelClass) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].registerClass(ComponentModelClass);
    },
    registerComponentView: function(ComponentViewClass) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].registerClass(ComponentViewClass);
    },
    registerSeriesModel: function(SeriesModelClass) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Series$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].registerClass(SeriesModelClass);
    },
    registerChartView: function(ChartViewClass) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$view$2f$Chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].registerClass(ChartViewClass);
    },
    registerCustomSeries: function(seriesType, renderItem) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$custom$2f$customSeriesRegister$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerCustomSeries"])(seriesType, renderItem);
    },
    registerSubTypeDefaulter: function(componentType, defaulter) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].registerSubTypeDefaulter(componentType, defaulter);
    },
    registerPainter: function(painterType, PainterCtor) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$zrender$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerPainter"])(painterType, PainterCtor);
    }
};
function use(ext) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"])(ext)) {
        // use([ChartLine, ChartBar]);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(ext, function(singleExt) {
            use(singleExt);
        });
        return;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["indexOf"])(extensions, ext) >= 0) {
        return;
    }
    extensions.push(ext);
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"])(ext)) {
        ext = {
            install: ext
        };
    }
    ext.install(extensionRegisters);
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/i18n/langEN.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 * Language: English.
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = {
    time: {
        month: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ],
        monthAbbr: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ],
        dayOfWeek: [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ],
        dayOfWeekAbbr: [
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat'
        ]
    },
    legend: {
        selector: {
            all: 'All',
            inverse: 'Inv'
        }
    },
    toolbox: {
        brush: {
            title: {
                rect: 'Box Select',
                polygon: 'Lasso Select',
                lineX: 'Horizontally Select',
                lineY: 'Vertically Select',
                keep: 'Keep Selections',
                clear: 'Clear Selections'
            }
        },
        dataView: {
            title: 'Data View',
            lang: [
                'Data View',
                'Close',
                'Refresh'
            ]
        },
        dataZoom: {
            title: {
                zoom: 'Zoom',
                back: 'Zoom Reset'
            }
        },
        magicType: {
            title: {
                line: 'Switch to Line Chart',
                bar: 'Switch to Bar Chart',
                stack: 'Stack',
                tiled: 'Tile'
            }
        },
        restore: {
            title: 'Restore'
        },
        saveAsImage: {
            title: 'Save as Image',
            lang: [
                'Right Click to Save Image'
            ]
        }
    },
    series: {
        typeNames: {
            pie: 'Pie chart',
            bar: 'Bar chart',
            line: 'Line chart',
            scatter: 'Scatter plot',
            effectScatter: 'Ripple scatter plot',
            radar: 'Radar chart',
            tree: 'Tree',
            treemap: 'Treemap',
            boxplot: 'Boxplot',
            candlestick: 'Candlestick',
            k: 'K line chart',
            heatmap: 'Heat map',
            map: 'Map',
            parallel: 'Parallel coordinate map',
            lines: 'Line graph',
            graph: 'Relationship graph',
            sankey: 'Sankey diagram',
            funnel: 'Funnel chart',
            gauge: 'Gauge',
            pictorialBar: 'Pictorial bar',
            themeRiver: 'Theme River Map',
            sunburst: 'Sunburst',
            custom: 'Custom chart',
            chart: 'Chart'
        }
    },
    aria: {
        general: {
            withTitle: 'This is a chart about "{title}"',
            withoutTitle: 'This is a chart'
        },
        series: {
            single: {
                prefix: '',
                withName: ' with type {seriesType} named {seriesName}.',
                withoutName: ' with type {seriesType}.'
            },
            multiple: {
                prefix: '. It consists of {seriesCount} series count.',
                withName: ' The {seriesId} series is a {seriesType} representing {seriesName}.',
                withoutName: ' The {seriesId} series is a {seriesType}.',
                separator: {
                    middle: '',
                    end: ''
                }
            }
        },
        data: {
            allData: 'The data is as follows: ',
            partialData: 'The first {displayCnt} items are: ',
            withName: 'the data for {name} is {value}',
            withoutName: '{value}',
            separator: {
                middle: ', ',
                end: '. '
            }
        }
    }
};
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/i18n/langZH.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = {
    time: {
        month: [
            '一月',
            '二月',
            '三月',
            '四月',
            '五月',
            '六月',
            '七月',
            '八月',
            '九月',
            '十月',
            '十一月',
            '十二月'
        ],
        monthAbbr: [
            '1月',
            '2月',
            '3月',
            '4月',
            '5月',
            '6月',
            '7月',
            '8月',
            '9月',
            '10月',
            '11月',
            '12月'
        ],
        dayOfWeek: [
            '星期日',
            '星期一',
            '星期二',
            '星期三',
            '星期四',
            '星期五',
            '星期六'
        ],
        dayOfWeekAbbr: [
            '日',
            '一',
            '二',
            '三',
            '四',
            '五',
            '六'
        ]
    },
    legend: {
        selector: {
            all: '全选',
            inverse: '反选'
        }
    },
    toolbox: {
        brush: {
            title: {
                rect: '矩形选择',
                polygon: '圈选',
                lineX: '横向选择',
                lineY: '纵向选择',
                keep: '保持选择',
                clear: '清除选择'
            }
        },
        dataView: {
            title: '数据视图',
            lang: [
                '数据视图',
                '关闭',
                '刷新'
            ]
        },
        dataZoom: {
            title: {
                zoom: '区域缩放',
                back: '区域缩放还原'
            }
        },
        magicType: {
            title: {
                line: '切换为折线图',
                bar: '切换为柱状图',
                stack: '切换为堆叠',
                tiled: '切换为平铺'
            }
        },
        restore: {
            title: '还原'
        },
        saveAsImage: {
            title: '保存为图片',
            lang: [
                '右键另存为图片'
            ]
        }
    },
    series: {
        typeNames: {
            pie: '饼图',
            bar: '柱状图',
            line: '折线图',
            scatter: '散点图',
            effectScatter: '涟漪散点图',
            radar: '雷达图',
            tree: '树图',
            treemap: '矩形树图',
            boxplot: '箱型图',
            candlestick: 'K线图',
            k: 'K线图',
            heatmap: '热力图',
            map: '地图',
            parallel: '平行坐标图',
            lines: '线图',
            graph: '关系图',
            sankey: '桑基图',
            funnel: '漏斗图',
            gauge: '仪表盘图',
            pictorialBar: '象形柱图',
            themeRiver: '主题河流图',
            sunburst: '旭日图',
            custom: '自定义图表',
            chart: '图表'
        }
    },
    aria: {
        general: {
            withTitle: '这是一个关于“{title}”的图表。',
            withoutTitle: '这是一个图表，'
        },
        series: {
            single: {
                prefix: '',
                withName: '图表类型是{seriesType}，表示{seriesName}。',
                withoutName: '图表类型是{seriesType}。'
            },
            multiple: {
                prefix: '它由{seriesCount}个图表系列组成。',
                withName: '第{seriesId}个系列是一个表示{seriesName}的{seriesType}，',
                withoutName: '第{seriesId}个系列是一个{seriesType}，',
                separator: {
                    middle: '；',
                    end: '。'
                }
            }
        },
        data: {
            allData: '其数据是——',
            partialData: '其中，前{displayCnt}项是——',
            withName: '{name}的数据是{value}',
            withoutName: '{value}',
            separator: {
                middle: '，',
                end: ''
            }
        }
    }
};
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/label/labelGuideHelper.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getLabelLineStatesModels",
    ()=>getLabelLineStatesModels,
    "limitSurfaceAngle",
    ()=>limitSurfaceAngle,
    "limitTurnAngle",
    ()=>limitTurnAngle,
    "setLabelLineStyle",
    ()=>setLabelLineStyle,
    "updateLabelLinePoints",
    ()=>updateLabelLinePoints
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Point$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/Point.js [app-ssr] (ecmascript) <export default as Point>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Path$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Path.js [app-ssr] (ecmascript) <export default as Path>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Polyline$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Polyline$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Polyline.js [app-ssr] (ecmascript) <export default as Polyline>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$PathProxy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/PathProxy.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$contain$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/contain/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$curve$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/curve.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/matrix.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/vector.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/states.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
var PI2 = Math.PI * 2;
var CMD = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$PathProxy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].CMD;
var DEFAULT_SEARCH_SPACE = [
    'top',
    'right',
    'bottom',
    'left'
];
function getCandidateAnchor(pos, distance, rect, outPt, outDir) {
    var width = rect.width;
    var height = rect.height;
    switch(pos){
        case 'top':
            outPt.set(rect.x + width / 2, rect.y - distance);
            outDir.set(0, -1);
            break;
        case 'bottom':
            outPt.set(rect.x + width / 2, rect.y + height + distance);
            outDir.set(0, 1);
            break;
        case 'left':
            outPt.set(rect.x - distance, rect.y + height / 2);
            outDir.set(-1, 0);
            break;
        case 'right':
            outPt.set(rect.x + width + distance, rect.y + height / 2);
            outDir.set(1, 0);
            break;
    }
}
function projectPointToArc(cx, cy, r, startAngle, endAngle, anticlockwise, x, y, out) {
    x -= cx;
    y -= cy;
    var d = Math.sqrt(x * x + y * y);
    x /= d;
    y /= d;
    // Intersect point.
    var ox = x * r + cx;
    var oy = y * r + cy;
    if (Math.abs(startAngle - endAngle) % PI2 < 1e-4) {
        // Is a circle
        out[0] = ox;
        out[1] = oy;
        return d - r;
    }
    if (anticlockwise) {
        var tmp = startAngle;
        startAngle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$contain$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeRadian"])(endAngle);
        endAngle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$contain$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeRadian"])(tmp);
    } else {
        startAngle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$contain$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeRadian"])(startAngle);
        endAngle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$contain$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeRadian"])(endAngle);
    }
    if (startAngle > endAngle) {
        endAngle += PI2;
    }
    var angle = Math.atan2(y, x);
    if (angle < 0) {
        angle += PI2;
    }
    if (angle >= startAngle && angle <= endAngle || angle + PI2 >= startAngle && angle + PI2 <= endAngle) {
        // Project point is on the arc.
        out[0] = ox;
        out[1] = oy;
        return d - r;
    }
    var x1 = r * Math.cos(startAngle) + cx;
    var y1 = r * Math.sin(startAngle) + cy;
    var x2 = r * Math.cos(endAngle) + cx;
    var y2 = r * Math.sin(endAngle) + cy;
    var d1 = (x1 - x) * (x1 - x) + (y1 - y) * (y1 - y);
    var d2 = (x2 - x) * (x2 - x) + (y2 - y) * (y2 - y);
    if (d1 < d2) {
        out[0] = x1;
        out[1] = y1;
        return Math.sqrt(d1);
    } else {
        out[0] = x2;
        out[1] = y2;
        return Math.sqrt(d2);
    }
}
function projectPointToLine(x1, y1, x2, y2, x, y, out, limitToEnds) {
    var dx = x - x1;
    var dy = y - y1;
    var dx1 = x2 - x1;
    var dy1 = y2 - y1;
    var lineLen = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    dx1 /= lineLen;
    dy1 /= lineLen;
    // dot product
    var projectedLen = dx * dx1 + dy * dy1;
    var t = projectedLen / lineLen;
    if (limitToEnds) {
        t = Math.min(Math.max(t, 0), 1);
    }
    t *= lineLen;
    var ox = out[0] = x1 + t * dx1;
    var oy = out[1] = y1 + t * dy1;
    return Math.sqrt((ox - x) * (ox - x) + (oy - y) * (oy - y));
}
function projectPointToRect(x1, y1, width, height, x, y, out) {
    if (width < 0) {
        x1 = x1 + width;
        width = -width;
    }
    if (height < 0) {
        y1 = y1 + height;
        height = -height;
    }
    var x2 = x1 + width;
    var y2 = y1 + height;
    var ox = out[0] = Math.min(Math.max(x, x1), x2);
    var oy = out[1] = Math.min(Math.max(y, y1), y2);
    return Math.sqrt((ox - x) * (ox - x) + (oy - y) * (oy - y));
}
var tmpPt = [];
function nearestPointOnRect(pt, rect, out) {
    var dist = projectPointToRect(rect.x, rect.y, rect.width, rect.height, pt.x, pt.y, tmpPt);
    out.set(tmpPt[0], tmpPt[1]);
    return dist;
}
/**
 * Calculate min distance corresponding point.
 * This method won't evaluate if point is in the path.
 */ function nearestPointOnPath(pt, path, out) {
    var xi = 0;
    var yi = 0;
    var x0 = 0;
    var y0 = 0;
    var x1;
    var y1;
    var minDist = Infinity;
    var data = path.data;
    var x = pt.x;
    var y = pt.y;
    for(var i = 0; i < data.length;){
        var cmd = data[i++];
        if (i === 1) {
            xi = data[i];
            yi = data[i + 1];
            x0 = xi;
            y0 = yi;
        }
        var d = minDist;
        switch(cmd){
            case CMD.M:
                // moveTo 命令重新创建一个新的 subpath, 并且更新新的起点
                // 在 closePath 的时候使用
                x0 = data[i++];
                y0 = data[i++];
                xi = x0;
                yi = y0;
                break;
            case CMD.L:
                d = projectPointToLine(xi, yi, data[i], data[i + 1], x, y, tmpPt, true);
                xi = data[i++];
                yi = data[i++];
                break;
            case CMD.C:
                d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$curve$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cubicProjectPoint"])(xi, yi, data[i++], data[i++], data[i++], data[i++], data[i], data[i + 1], x, y, tmpPt);
                xi = data[i++];
                yi = data[i++];
                break;
            case CMD.Q:
                d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$curve$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["quadraticProjectPoint"])(xi, yi, data[i++], data[i++], data[i], data[i + 1], x, y, tmpPt);
                xi = data[i++];
                yi = data[i++];
                break;
            case CMD.A:
                // TODO Arc 判断的开销比较大
                var cx = data[i++];
                var cy = data[i++];
                var rx = data[i++];
                var ry = data[i++];
                var theta = data[i++];
                var dTheta = data[i++];
                // TODO Arc 旋转
                i += 1;
                var anticlockwise = !!(1 - data[i++]);
                x1 = Math.cos(theta) * rx + cx;
                y1 = Math.sin(theta) * ry + cy;
                // 不是直接使用 arc 命令
                if (i <= 1) {
                    // 第一个命令起点还未定义
                    x0 = x1;
                    y0 = y1;
                }
                // zr 使用scale来模拟椭圆, 这里也对x做一定的缩放
                var _x = (x - cx) * ry / rx + cx;
                d = projectPointToArc(cx, cy, ry, theta, theta + dTheta, anticlockwise, _x, y, tmpPt);
                xi = Math.cos(theta + dTheta) * rx + cx;
                yi = Math.sin(theta + dTheta) * ry + cy;
                break;
            case CMD.R:
                x0 = xi = data[i++];
                y0 = yi = data[i++];
                var width = data[i++];
                var height = data[i++];
                d = projectPointToRect(x0, y0, width, height, x, y, tmpPt);
                break;
            case CMD.Z:
                d = projectPointToLine(xi, yi, x0, y0, x, y, tmpPt, true);
                xi = x0;
                yi = y0;
                break;
        }
        if (d < minDist) {
            minDist = d;
            out.set(tmpPt[0], tmpPt[1]);
        }
    }
    return minDist;
}
// Temporal variable for intermediate usage.
var pt0 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Point$3e$__["Point"]();
var pt1 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Point$3e$__["Point"]();
var pt2 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Point$3e$__["Point"]();
var dir = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Point$3e$__["Point"]();
var dir2 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Point$3e$__["Point"]();
function updateLabelLinePoints(target, labelLineModel) {
    if (!target) {
        return;
    }
    var labelLine = target.getTextGuideLine();
    var label = target.getTextContent();
    // Needs to create text guide in each charts.
    if (!(label && labelLine)) {
        return;
    }
    var labelGuideConfig = target.textGuideLineConfig || {};
    var points = [
        [
            0,
            0
        ],
        [
            0,
            0
        ],
        [
            0,
            0
        ]
    ];
    var searchSpace = labelGuideConfig.candidates || DEFAULT_SEARCH_SPACE;
    var labelRect = label.getBoundingRect().clone();
    labelRect.applyTransform(label.getComputedTransform());
    var minDist = Infinity;
    var anchorPoint = labelGuideConfig.anchor;
    var targetTransform = target.getComputedTransform();
    var targetInversedTransform = targetTransform && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$matrix$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invert"])([], targetTransform);
    var len = labelLineModel.get('length2') || 0;
    if (anchorPoint) {
        pt2.copy(anchorPoint);
    }
    for(var i = 0; i < searchSpace.length; i++){
        var candidate = searchSpace[i];
        getCandidateAnchor(candidate, 0, labelRect, pt0, dir);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Point$3e$__["Point"].scaleAndAdd(pt1, pt0, dir, len);
        // Transform to target coord space.
        pt1.transform(targetInversedTransform);
        // Note: getBoundingRect will ensure the `path` being created.
        var boundingRect = target.getBoundingRect();
        var dist = anchorPoint ? anchorPoint.distance(pt1) : target instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Path$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Path$3e$__["Path"] ? nearestPointOnPath(pt1, target.path, pt2) : nearestPointOnRect(pt1, boundingRect, pt2);
        // TODO pt2 is in the path
        if (dist < minDist) {
            minDist = dist;
            // Transform back to global space.
            pt1.transform(targetTransform);
            pt2.transform(targetTransform);
            pt2.toArray(points[0]);
            pt1.toArray(points[1]);
            pt0.toArray(points[2]);
        }
    }
    limitTurnAngle(points, labelLineModel.get('minTurnAngle'));
    labelLine.setShape({
        points: points
    });
}
// Temporal variable for the limitTurnAngle function
var tmpArr = [];
var tmpProjPoint = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Point$3e$__["Point"]();
function limitTurnAngle(linePoints, minTurnAngle) {
    if (!(minTurnAngle <= 180 && minTurnAngle > 0)) {
        return;
    }
    minTurnAngle = minTurnAngle / 180 * Math.PI;
    // The line points can be
    //      /pt1----pt2 (label)
    //     /
    // pt0/
    pt0.fromArray(linePoints[0]);
    pt1.fromArray(linePoints[1]);
    pt2.fromArray(linePoints[2]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Point$3e$__["Point"].sub(dir, pt0, pt1);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Point$3e$__["Point"].sub(dir2, pt2, pt1);
    var len1 = dir.len();
    var len2 = dir2.len();
    if (len1 < 1e-3 || len2 < 1e-3) {
        return;
    }
    dir.scale(1 / len1);
    dir2.scale(1 / len2);
    var angleCos = dir.dot(dir2);
    var minTurnAngleCos = Math.cos(minTurnAngle);
    if (minTurnAngleCos < angleCos) {
        // Smaller than minTurnAngle
        // Calculate project point of pt0 on pt1-pt2
        var d = projectPointToLine(pt1.x, pt1.y, pt2.x, pt2.y, pt0.x, pt0.y, tmpArr, false);
        tmpProjPoint.fromArray(tmpArr);
        // Calculate new projected length with limited minTurnAngle and get the new connect point
        tmpProjPoint.scaleAndAdd(dir2, d / Math.tan(Math.PI - minTurnAngle));
        // Limit the new calculated connect point between pt1 and pt2.
        var t = pt2.x !== pt1.x ? (tmpProjPoint.x - pt1.x) / (pt2.x - pt1.x) : (tmpProjPoint.y - pt1.y) / (pt2.y - pt1.y);
        if (isNaN(t)) {
            return;
        }
        if (t < 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Point$3e$__["Point"].copy(tmpProjPoint, pt1);
        } else if (t > 1) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Point$3e$__["Point"].copy(tmpProjPoint, pt2);
        }
        tmpProjPoint.toArray(linePoints[1]);
    }
}
function limitSurfaceAngle(linePoints, surfaceNormal, maxSurfaceAngle) {
    if (!(maxSurfaceAngle <= 180 && maxSurfaceAngle > 0)) {
        return;
    }
    maxSurfaceAngle = maxSurfaceAngle / 180 * Math.PI;
    pt0.fromArray(linePoints[0]);
    pt1.fromArray(linePoints[1]);
    pt2.fromArray(linePoints[2]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Point$3e$__["Point"].sub(dir, pt1, pt0);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Point$3e$__["Point"].sub(dir2, pt2, pt1);
    var len1 = dir.len();
    var len2 = dir2.len();
    if (len1 < 1e-3 || len2 < 1e-3) {
        return;
    }
    dir.scale(1 / len1);
    dir2.scale(1 / len2);
    var angleCos = dir.dot(surfaceNormal);
    var maxSurfaceAngleCos = Math.cos(maxSurfaceAngle);
    if (angleCos < maxSurfaceAngleCos) {
        // Calculate project point of pt0 on pt1-pt2
        var d = projectPointToLine(pt1.x, pt1.y, pt2.x, pt2.y, pt0.x, pt0.y, tmpArr, false);
        tmpProjPoint.fromArray(tmpArr);
        var HALF_PI = Math.PI / 2;
        var angle2 = Math.acos(dir2.dot(surfaceNormal));
        var newAngle = HALF_PI + angle2 - maxSurfaceAngle;
        if (newAngle >= HALF_PI) {
            // parallel
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Point$3e$__["Point"].copy(tmpProjPoint, pt2);
        } else {
            // Calculate new projected length with limited minTurnAngle and get the new connect point
            tmpProjPoint.scaleAndAdd(dir2, d / Math.tan(Math.PI / 2 - newAngle));
            // Limit the new calculated connect point between pt1 and pt2.
            var t = pt2.x !== pt1.x ? (tmpProjPoint.x - pt1.x) / (pt2.x - pt1.x) : (tmpProjPoint.y - pt1.y) / (pt2.y - pt1.y);
            if (isNaN(t)) {
                return;
            }
            if (t < 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Point$3e$__["Point"].copy(tmpProjPoint, pt1);
            } else if (t > 1) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$Point$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Point$3e$__["Point"].copy(tmpProjPoint, pt2);
            }
        }
        tmpProjPoint.toArray(linePoints[1]);
    }
}
function setLabelLineState(labelLine, ignore, stateName, stateModel) {
    var isNormal = stateName === 'normal';
    var stateObj = isNormal ? labelLine : labelLine.ensureState(stateName);
    // Make sure display.
    stateObj.ignore = ignore;
    // Set smooth
    var smooth = stateModel.get('smooth');
    smooth = smooth === true ? 0.3 : Math.max(+smooth, 0) || 0;
    stateObj.shape = stateObj.shape || {};
    // always set the `smooth` property
    stateObj.shape.smooth = smooth;
    var styleObj = stateModel.getModel('lineStyle').getLineStyle();
    isNormal ? labelLine.useStyle(styleObj) : stateObj.style = styleObj;
}
function buildLabelLinePath(path, shape) {
    var smooth = shape.smooth;
    var points = shape.points;
    if (!points) {
        return;
    }
    path.moveTo(points[0][0], points[0][1]);
    if (smooth > 0 && points.length >= 3) {
        var len1 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dist"](points[0], points[1]);
        var len2 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dist"](points[1], points[2]);
        if (!len1 || !len2) {
            path.lineTo(points[1][0], points[1][1]);
            path.lineTo(points[2][0], points[2][1]);
            return;
        }
        var moveLen = Math.min(len1, len2) * smooth;
        var midPoint0 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lerp"]([], points[1], points[0], moveLen / len1);
        var midPoint2 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lerp"]([], points[1], points[2], moveLen / len2);
        var midPoint1 = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$vector$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lerp"]([], midPoint0, midPoint2, 0.5);
        path.bezierCurveTo(midPoint0[0], midPoint0[1], midPoint0[0], midPoint0[1], midPoint1[0], midPoint1[1]);
        path.bezierCurveTo(midPoint2[0], midPoint2[1], midPoint2[0], midPoint2[1], points[2][0], points[2][1]);
    } else {
        for(var i = 1; i < points.length; i++){
            path.lineTo(points[i][0], points[i][1]);
        }
    }
}
function setLabelLineStyle(targetEl, statesModels, defaultStyle) {
    var labelLine = targetEl.getTextGuideLine();
    var label = targetEl.getTextContent();
    if (!label) {
        // Not show label line if there is no label.
        if (labelLine) {
            targetEl.removeTextGuideLine();
        }
        return;
    }
    var normalModel = statesModels.normal;
    var showNormal = normalModel.get('show');
    var labelIgnoreNormal = label.ignore;
    for(var i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DISPLAY_STATES"].length; i++){
        var stateName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DISPLAY_STATES"][i];
        var stateModel = statesModels[stateName];
        var isNormal = stateName === 'normal';
        if (stateModel) {
            var stateShow = stateModel.get('show');
            var isLabelIgnored = isNormal ? labelIgnoreNormal : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(label.states[stateName] && label.states[stateName].ignore, labelIgnoreNormal);
            if (isLabelIgnored // Not show when label is not shown in this state.
             || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(stateShow, showNormal) // Use normal state by default if not set.
            ) {
                var stateObj = isNormal ? labelLine : labelLine && labelLine.states[stateName];
                if (stateObj) {
                    stateObj.ignore = true;
                }
                if (!!labelLine) {
                    setLabelLineState(labelLine, true, stateName, stateModel);
                }
                continue;
            }
            // Create labelLine if not exists
            if (!labelLine) {
                labelLine = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Polyline$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Polyline$3e$__["Polyline"]();
                targetEl.setTextGuideLine(labelLine);
                // Reset state of normal because it's new created.
                // NOTE: NORMAL should always been the first!
                if (!isNormal && (labelIgnoreNormal || !showNormal)) {
                    setLabelLineState(labelLine, true, 'normal', statesModels.normal);
                }
                // Use same state proxy.
                if (targetEl.stateProxy) {
                    labelLine.stateProxy = targetEl.stateProxy;
                }
            }
            setLabelLineState(labelLine, false, stateName, stateModel);
        }
    }
    if (labelLine) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaults"])(labelLine.style, defaultStyle);
        // Not fill.
        labelLine.style.fill = null;
        var showAbove = normalModel.get('showAbove');
        var labelLineConfig = targetEl.textGuideLineConfig = targetEl.textGuideLineConfig || {};
        labelLineConfig.showAbove = showAbove || false;
        // Custom the buildPath.
        labelLine.buildPath = buildLabelLinePath;
    }
}
function getLabelLineStatesModels(itemModel, labelLineName) {
    labelLineName = labelLineName || 'labelLine';
    var statesModels = {
        normal: itemModel.getModel(labelLineName)
    };
    for(var i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPECIAL_STATES"].length; i++){
        var stateName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPECIAL_STATES"][i];
        statesModels[stateName] = itemModel.getModel([
            stateName,
            labelLineName
        ]);
    }
    return statesModels;
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/label/labelLayoutHelper.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computeLabelGeometry",
    ()=>computeLabelGeometry,
    "computeLabelGeometry2",
    ()=>computeLabelGeometry2,
    "ensureLabelLayoutWithGeometry",
    ()=>ensureLabelLayoutWithGeometry,
    "hideOverlap",
    ()=>hideOverlap,
    "labelIntersect",
    ()=>labelIntersect,
    "labelLayoutApplyTranslation",
    ()=>labelLayoutApplyTranslation,
    "newLabelLayoutWithGeometry",
    ()=>newLabelLayoutWithGeometry,
    "restoreIgnore",
    ()=>restoreIgnore,
    "setLabelLayoutDirty",
    ()=>setLabelLayoutDirty,
    "shiftLayoutOnXY",
    ()=>shiftLayoutOnXY
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$OrientedBoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__OrientedBoundingRect$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/OrientedBoundingRect.js [app-ssr] (ecmascript) <export default as OrientedBoundingRect>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/graphic.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/label/labelStyle.js [app-ssr] (ecmascript)");
;
;
var LABEL_LAYOUT_BASE_PROPS = [
    'label',
    'labelLine',
    'layoutOption',
    'priority',
    'defaultAttr',
    'marginForce',
    'minMarginForce',
    'marginDefault',
    'suggestIgnore'
];
var LABEL_LAYOUT_DIRTY_BIT_OTHERS = 1;
var LABEL_LAYOUT_DIRTY_BIT_OBB = 2;
var LABEL_LAYOUT_DIRTY_ALL = LABEL_LAYOUT_DIRTY_BIT_OTHERS | LABEL_LAYOUT_DIRTY_BIT_OBB;
function setLabelLayoutDirty(labelGeometry, dirtyOrClear, dirtyBits) {
    dirtyBits = dirtyBits || LABEL_LAYOUT_DIRTY_ALL;
    dirtyOrClear ? labelGeometry.dirty |= dirtyBits : labelGeometry.dirty &= ~dirtyBits;
}
function isLabelLayoutDirty(labelGeometry, dirtyBits) {
    dirtyBits = dirtyBits || LABEL_LAYOUT_DIRTY_ALL;
    return labelGeometry.dirty == null || !!(labelGeometry.dirty & dirtyBits);
}
function ensureLabelLayoutWithGeometry(labelLayout) {
    if (!labelLayout) {
        return;
    }
    if (isLabelLayoutDirty(labelLayout)) {
        computeLabelGeometry(labelLayout, labelLayout.label, labelLayout);
    }
    return labelLayout;
}
function computeLabelGeometry(out, label, opt) {
    // [CAUTION] These props may be modified directly for performance consideration,
    //  therefore, do not output the internal data structure of zrender Element.
    var rawTransform = label.getComputedTransform();
    out.transform = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ensureCopyTransform"])(out.transform, rawTransform);
    // NOTE: should call `getBoundingRect` after `getComputedTransform`, or may get an inaccurate bounding rect.
    //  The reason is that `getComputedTransform` calls `__host.updateInnerText()` internally, which updates the label
    //  by `textConfig` mounted on the host.
    // PENDING: add a dirty bit for that in zrender?
    var outLocalRect = out.localRect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ensureCopyRect"])(out.localRect, label.getBoundingRect());
    var labelStyleExt = label.style;
    var margin = labelStyleExt.margin;
    var marginForce = opt && opt.marginForce;
    var minMarginForce = opt && opt.minMarginForce;
    var marginDefault = opt && opt.marginDefault;
    var marginType = labelStyleExt.__marginType;
    if (marginType == null && marginDefault) {
        margin = marginDefault;
        marginType = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LabelMarginType"].textMargin;
    }
    // `textMargin` and `minMargin` can not exist both.
    for(var i = 0; i < 4; i++){
        _tmpLabelMargin[i] = marginType === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LabelMarginType"].minMargin && minMarginForce && minMarginForce[i] != null ? minMarginForce[i] : marginForce && marginForce[i] != null ? marginForce[i] : margin ? margin[i] : 0;
    }
    if (marginType === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LabelMarginType"].textMargin) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["expandOrShrinkRect"])(outLocalRect, _tmpLabelMargin, false, false);
    }
    var outGlobalRect = out.rect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ensureCopyRect"])(out.rect, outLocalRect);
    if (rawTransform) {
        outGlobalRect.applyTransform(rawTransform);
    }
    // Notice: label.style.margin is actually `minMargin / 2`, handled by `setTextStyleCommon`.
    if (marginType === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$label$2f$labelStyle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LabelMarginType"].minMargin) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["expandOrShrinkRect"])(outGlobalRect, _tmpLabelMargin, false, false);
    }
    out.axisAligned = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["isBoundingRectAxisAligned"])(rawTransform);
    (out.label = out.label || {}).ignore = label.ignore;
    setLabelLayoutDirty(out, false);
    setLabelLayoutDirty(out, true, LABEL_LAYOUT_DIRTY_BIT_OBB);
    // Do not remove `obb` (if existing) for reuse, just reset the dirty bit.
    return out;
}
var _tmpLabelMargin = [
    0,
    0,
    0,
    0
];
function computeLabelGeometry2(out, rawLocalRect, rawTransform) {
    out.transform = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ensureCopyTransform"])(out.transform, rawTransform);
    out.localRect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ensureCopyRect"])(out.localRect, rawLocalRect);
    out.rect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ensureCopyRect"])(out.rect, rawLocalRect);
    if (rawTransform) {
        out.rect.applyTransform(rawTransform);
    }
    out.axisAligned = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["isBoundingRectAxisAligned"])(rawTransform);
    out.obb = undefined; // Reset to undefined, will be created by `ensureOBB` when using.
    (out.label = out.label || {}).ignore = false;
    return out;
}
function labelLayoutApplyTranslation(labelLayout, offset) {
    if (!labelLayout) {
        return;
    }
    labelLayout.label.x += offset.x;
    labelLayout.label.y += offset.y;
    labelLayout.label.markRedraw();
    var transform = labelLayout.transform;
    if (transform) {
        transform[4] += offset.x;
        transform[5] += offset.y;
    }
    var globalRect = labelLayout.rect;
    if (globalRect) {
        globalRect.x += offset.x;
        globalRect.y += offset.y;
    }
    var obb = labelLayout.obb;
    if (obb) {
        obb.fromBoundingRect(labelLayout.localRect, transform);
    }
}
function newLabelLayoutWithGeometry(newBaseWithDefaults, source) {
    for(var i = 0; i < LABEL_LAYOUT_BASE_PROPS.length; i++){
        var prop = LABEL_LAYOUT_BASE_PROPS[i];
        if (newBaseWithDefaults[prop] == null) {
            newBaseWithDefaults[prop] = source[prop];
        }
    }
    return ensureLabelLayoutWithGeometry(newBaseWithDefaults);
}
/**
 * Create obb if no one, can cache it.
 */ function ensureOBB(labelGeometry) {
    var obb = labelGeometry.obb;
    if (!obb || isLabelLayoutDirty(labelGeometry, LABEL_LAYOUT_DIRTY_BIT_OBB)) {
        labelGeometry.obb = obb = obb || new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$OrientedBoundingRect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__OrientedBoundingRect$3e$__["OrientedBoundingRect"]();
        obb.fromBoundingRect(labelGeometry.localRect, labelGeometry.transform);
        setLabelLayoutDirty(labelGeometry, false, LABEL_LAYOUT_DIRTY_BIT_OBB);
    }
    return obb;
}
function shiftLayoutOnXY(list, xyDimIdx, // 0 for x, 1 for y
minBound, // for x, leftBound; for y, topBound
maxBound, // for x, rightBound; for y, bottomBound
// If average the shifts on all labels and add them to 0
// TODO: Not sure if should enable it.
// Pros: The angle of lines will distribute more equally
// Cons: In some layout. It may not what user wanted. like in pie. the label of last sector is usually changed unexpectedly.
balanceShift) {
    var len = list.length;
    var xyDim = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["XY"][xyDimIdx];
    var sizeDim = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WH"][xyDimIdx];
    if (len < 2) {
        return false;
    }
    list.sort(function(a, b) {
        return a.rect[xyDim] - b.rect[xyDim];
    });
    var lastPos = 0;
    var delta;
    var adjusted = false;
    // const shifts = [];
    var totalShifts = 0;
    for(var i = 0; i < len; i++){
        var item = list[i];
        var rect = item.rect;
        delta = rect[xyDim] - lastPos;
        if (delta < 0) {
            // shiftForward(i, len, -delta);
            rect[xyDim] -= delta;
            item.label[xyDim] -= delta;
            adjusted = true;
        }
        var shift = Math.max(-delta, 0);
        // shifts.push(shift);
        totalShifts += shift;
        lastPos = rect[xyDim] + rect[sizeDim];
    }
    if (totalShifts > 0 && balanceShift) {
        // Shift back to make the distribution more equally.
        shiftList(-totalShifts / len, 0, len);
    }
    // TODO bleedMargin?
    var first = list[0];
    var last = list[len - 1];
    var minGap;
    var maxGap;
    updateMinMaxGap();
    // If ends exceed two bounds, squeeze at most 80%, then take the gap of two bounds.
    minGap < 0 && squeezeGaps(-minGap, 0.8);
    maxGap < 0 && squeezeGaps(maxGap, 0.8);
    updateMinMaxGap();
    takeBoundsGap(minGap, maxGap, 1);
    takeBoundsGap(maxGap, minGap, -1);
    // Handle bailout when there is not enough space.
    updateMinMaxGap();
    if (minGap < 0) {
        squeezeWhenBailout(-minGap);
    }
    if (maxGap < 0) {
        squeezeWhenBailout(maxGap);
    }
    function updateMinMaxGap() {
        minGap = first.rect[xyDim] - minBound;
        maxGap = maxBound - last.rect[xyDim] - last.rect[sizeDim];
    }
    function takeBoundsGap(gapThisBound, gapOtherBound, moveDir) {
        if (gapThisBound < 0) {
            // Move from other gap if can.
            var moveFromMaxGap = Math.min(gapOtherBound, -gapThisBound);
            if (moveFromMaxGap > 0) {
                shiftList(moveFromMaxGap * moveDir, 0, len);
                var remained = moveFromMaxGap + gapThisBound;
                if (remained < 0) {
                    squeezeGaps(-remained * moveDir, 1);
                }
            } else {
                squeezeGaps(-gapThisBound * moveDir, 1);
            }
        }
    }
    function shiftList(delta, start, end) {
        if (delta !== 0) {
            adjusted = true;
        }
        for(var i = start; i < end; i++){
            var item = list[i];
            var rect = item.rect;
            rect[xyDim] += delta;
            item.label[xyDim] += delta;
        }
    }
    // Squeeze gaps if the labels exceed margin.
    function squeezeGaps(delta, maxSqeezePercent) {
        var gaps = [];
        var totalGaps = 0;
        for(var i = 1; i < len; i++){
            var prevItemRect = list[i - 1].rect;
            var gap = Math.max(list[i].rect[xyDim] - prevItemRect[xyDim] - prevItemRect[sizeDim], 0);
            gaps.push(gap);
            totalGaps += gap;
        }
        if (!totalGaps) {
            return;
        }
        var squeezePercent = Math.min(Math.abs(delta) / totalGaps, maxSqeezePercent);
        if (delta > 0) {
            for(var i = 0; i < len - 1; i++){
                // Distribute the shift delta to all gaps.
                var movement = gaps[i] * squeezePercent;
                // Forward
                shiftList(movement, 0, i + 1);
            }
        } else {
            // Backward
            for(var i = len - 1; i > 0; i--){
                // Distribute the shift delta to all gaps.
                var movement = gaps[i - 1] * squeezePercent;
                shiftList(-movement, i, len);
            }
        }
    }
    /**
   * Squeeze to allow overlap if there is no more space available.
   * Let other overlapping strategy like hideOverlap do the job instead of keep exceeding the bounds.
   */ function squeezeWhenBailout(delta) {
        var dir = delta < 0 ? -1 : 1;
        delta = Math.abs(delta);
        var moveForEachLabel = Math.ceil(delta / (len - 1));
        for(var i = 0; i < len - 1; i++){
            if (dir > 0) {
                // Forward
                shiftList(moveForEachLabel, 0, i + 1);
            } else {
                // Backward
                shiftList(-moveForEachLabel, len - i - 1, len);
            }
            delta -= moveForEachLabel;
            if (delta <= 0) {
                return;
            }
        }
    }
    return adjusted;
}
function restoreIgnore(labelList) {
    for(var i = 0; i < labelList.length; i++){
        var labelItem = labelList[i];
        var defaultAttr = labelItem.defaultAttr;
        var labelLine = labelItem.labelLine;
        labelItem.label.attr('ignore', defaultAttr.ignore);
        labelLine && labelLine.attr('ignore', defaultAttr.labelGuideIgnore);
    }
}
function hideOverlap(labelList) {
    var displayedLabels = [];
    // TODO, render overflow visible first, put in the displayedLabels.
    labelList.sort(function(a, b) {
        return (b.suggestIgnore ? 1 : 0) - (a.suggestIgnore ? 1 : 0) || b.priority - a.priority;
    });
    function hideEl(el) {
        if (!el.ignore) {
            // Show on emphasis.
            var emphasisState = el.ensureState('emphasis');
            if (emphasisState.ignore == null) {
                emphasisState.ignore = false;
            }
        }
        el.ignore = true;
    }
    for(var i = 0; i < labelList.length; i++){
        var labelItem = ensureLabelLayoutWithGeometry(labelList[i]);
        // The current `el.ignore` is involved, since some previous overlap
        // resolving strategies may have set `el.ignore` to true.
        if (labelItem.label.ignore) {
            continue;
        }
        var label = labelItem.label;
        var labelLine = labelItem.labelLine;
        // NOTICE: even when the with/height of globalRect of a label is 0, the label line should
        // still be displayed, since we should follow the concept of "truncation", meaning that
        // something exists even if it cannot be fully displayed. A visible label line is necessary
        // to allow users to get a tooltip with label info on hover.
        var overlapped = false;
        for(var j = 0; j < displayedLabels.length; j++){
            if (labelIntersect(labelItem, displayedLabels[j], null, {
                touchThreshold: 0.05
            })) {
                overlapped = true;
                break;
            }
        }
        // TODO Callback to determine if this overlap should be handled?
        if (overlapped) {
            hideEl(label);
            labelLine && hideEl(labelLine);
        } else {
            displayedLabels.push(labelItem);
        }
    }
}
function labelIntersect(baseLayoutInfo, targetLayoutInfo, mtv, intersectOpt) {
    if (!baseLayoutInfo || !targetLayoutInfo) {
        return false;
    }
    if (baseLayoutInfo.label && baseLayoutInfo.label.ignore || targetLayoutInfo.label && targetLayoutInfo.label.ignore) {
        return false;
    }
    // Fast rejection.
    if (!baseLayoutInfo.rect.intersect(targetLayoutInfo.rect, mtv, intersectOpt)) {
        return false;
    }
    if (baseLayoutInfo.axisAligned && targetLayoutInfo.axisAligned) {
        return true; // obb is the same as the normal bounding rect.
    }
    return ensureOBB(baseLayoutInfo).intersect(ensureOBB(targetLayoutInfo), mtv, intersectOpt);
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/label/labelStyle.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LabelMarginType",
    ()=>LabelMarginType,
    "animateLabelValue",
    ()=>animateLabelValue,
    "createTextConfig",
    ()=>createTextConfig,
    "createTextStyle",
    ()=>createTextStyle,
    "getFont",
    ()=>getFont,
    "getLabelStatesModels",
    ()=>getLabelStatesModels,
    "labelInner",
    ()=>labelInner,
    "setLabelStyle",
    ()=>setLabelStyle,
    "setLabelText",
    ()=>setLabelText,
    "setLabelValueAnimation",
    ()=>setLabelValueAnimation
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Text.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/states.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/animation/basicTransition.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
var EMPTY_OBJ = {};
function setLabelText(label, labelTexts) {
    for(var i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPECIAL_STATES"].length; i++){
        var stateName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPECIAL_STATES"][i];
        var text = labelTexts[stateName];
        var state = label.ensureState(stateName);
        state.style = state.style || {};
        state.style.text = text;
    }
    var oldStates = label.currentStates.slice();
    label.clearStates(true);
    label.setStyle({
        text: labelTexts.normal
    });
    label.useStates(oldStates, true);
}
function getLabelText(opt, stateModels, interpolatedValue) {
    var labelFetcher = opt.labelFetcher;
    var labelDataIndex = opt.labelDataIndex;
    var labelDimIndex = opt.labelDimIndex;
    var normalModel = stateModels.normal;
    var baseText;
    if (labelFetcher) {
        baseText = labelFetcher.getFormattedLabel(labelDataIndex, 'normal', null, labelDimIndex, normalModel && normalModel.get('formatter'), interpolatedValue != null ? {
            interpolatedValue: interpolatedValue
        } : null);
    }
    if (baseText == null) {
        baseText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"])(opt.defaultText) ? opt.defaultText(labelDataIndex, opt, interpolatedValue) : opt.defaultText;
    }
    var statesText = {
        normal: baseText
    };
    for(var i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPECIAL_STATES"].length; i++){
        var stateName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPECIAL_STATES"][i];
        var stateModel = stateModels[stateName];
        statesText[stateName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(labelFetcher ? labelFetcher.getFormattedLabel(labelDataIndex, stateName, null, labelDimIndex, stateModel && stateModel.get('formatter')) : null, baseText);
    }
    return statesText;
}
function setLabelStyle(targetEl, labelStatesModels, opt, stateSpecified) {
    opt = opt || EMPTY_OBJ;
    var isSetOnText = targetEl instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"];
    var needsCreateText = false;
    for(var i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DISPLAY_STATES"].length; i++){
        var stateModel = labelStatesModels[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DISPLAY_STATES"][i]];
        if (stateModel && stateModel.getShallow('show')) {
            needsCreateText = true;
            break;
        }
    }
    var textContent = isSetOnText ? targetEl : targetEl.getTextContent();
    if (needsCreateText) {
        if (!isSetOnText) {
            // Reuse the previous
            if (!textContent) {
                textContent = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]();
                targetEl.setTextContent(textContent);
            }
            // Use same state proxy
            if (targetEl.stateProxy) {
                textContent.stateProxy = targetEl.stateProxy;
            }
        }
        var labelStatesTexts = getLabelText(opt, labelStatesModels);
        var normalModel = labelStatesModels.normal;
        var showNormal = !!normalModel.getShallow('show');
        var normalStyle = createTextStyle(normalModel, stateSpecified && stateSpecified.normal, opt, false, !isSetOnText);
        normalStyle.text = labelStatesTexts.normal;
        if (!isSetOnText) {
            // Always create new
            targetEl.setTextConfig(createTextConfig(normalModel, opt, false));
        }
        for(var i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPECIAL_STATES"].length; i++){
            var stateName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPECIAL_STATES"][i];
            var stateModel = labelStatesModels[stateName];
            if (stateModel) {
                var stateObj = textContent.ensureState(stateName);
                var stateShow = !!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(stateModel.getShallow('show'), showNormal);
                if (stateShow !== showNormal) {
                    stateObj.ignore = !stateShow;
                }
                stateObj.style = createTextStyle(stateModel, stateSpecified && stateSpecified[stateName], opt, true, !isSetOnText);
                stateObj.style.text = labelStatesTexts[stateName];
                if (!isSetOnText) {
                    var targetElEmphasisState = targetEl.ensureState(stateName);
                    targetElEmphasisState.textConfig = createTextConfig(stateModel, opt, true);
                }
            }
        }
        // PENDING: if there is many requirements that emphasis position
        // need to be different from normal position, we might consider
        // auto silent is those cases.
        textContent.silent = !!normalModel.getShallow('silent');
        // Keep x and y
        if (textContent.style.x != null) {
            normalStyle.x = textContent.style.x;
        }
        if (textContent.style.y != null) {
            normalStyle.y = textContent.style.y;
        }
        textContent.ignore = !showNormal;
        // Always create new style.
        textContent.useStyle(normalStyle);
        textContent.dirty();
        if (opt.enableTextSetter) {
            labelInner(textContent).setLabelText = function(interpolatedValue) {
                var labelStatesTexts = getLabelText(opt, labelStatesModels, interpolatedValue);
                setLabelText(textContent, labelStatesTexts);
            };
        }
    } else if (textContent) {
        // Not display rich text.
        textContent.ignore = true;
    }
    targetEl.dirty();
}
;
function getLabelStatesModels(itemModel, labelName) {
    labelName = labelName || 'label';
    var statesModels = {
        normal: itemModel.getModel(labelName)
    };
    for(var i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPECIAL_STATES"].length; i++){
        var stateName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPECIAL_STATES"][i];
        statesModels[stateName] = itemModel.getModel([
            stateName,
            labelName
        ]);
    }
    return statesModels;
}
function createTextStyle(textStyleModel, specifiedTextStyle, // Fixed style in the code. Can't be set by model.
opt, isNotNormal, isAttached // If text is attached on an element. If so, auto color will handling in zrender.
) {
    var textStyle = {};
    setTextStyleCommon(textStyle, textStyleModel, opt, isNotNormal, isAttached);
    specifiedTextStyle && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"])(textStyle, specifiedTextStyle);
    // textStyle.host && textStyle.host.dirty && textStyle.host.dirty(false);
    return textStyle;
}
function createTextConfig(textStyleModel, opt, isNotNormal) {
    opt = opt || {};
    var textConfig = {};
    var labelPosition;
    var labelRotate = textStyleModel.getShallow('rotate');
    var labelDistance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(textStyleModel.getShallow('distance'), isNotNormal ? null : 5);
    var labelOffset = textStyleModel.getShallow('offset');
    labelPosition = textStyleModel.getShallow('position') || (isNotNormal ? null : 'inside');
    // 'outside' is not a valid zr textPostion value, but used
    // in bar series, and magic type should be considered.
    labelPosition === 'outside' && (labelPosition = opt.defaultOutsidePosition || 'top');
    if (labelPosition != null) {
        textConfig.position = labelPosition;
    }
    if (labelOffset != null) {
        textConfig.offset = labelOffset;
    }
    if (labelRotate != null) {
        labelRotate *= Math.PI / 180;
        textConfig.rotation = labelRotate;
    }
    if (labelDistance != null) {
        textConfig.distance = labelDistance;
    }
    // fill and auto is determined by the color of path fill if it's not specified by developers.
    textConfig.outsideFill = textStyleModel.get('color') === 'inherit' ? opt.inheritColor || null : 'auto';
    if (opt.autoOverflowArea != null) {
        textConfig.autoOverflowArea = opt.autoOverflowArea;
    }
    if (opt.layoutRect != null) {
        textConfig.layoutRect = opt.layoutRect;
    }
    return textConfig;
}
/**
 * The uniform entry of set text style, that is, retrieve style definitions
 * from `model` and set to `textStyle` object.
 *
 * Never in merge mode, but in overwrite mode, that is, all of the text style
 * properties will be set. (Consider the states of normal and emphasis and
 * default value can be adopted, merge would make the logic too complicated
 * to manage.)
 */ function setTextStyleCommon(textStyle, textStyleModel, opt, isNotNormal, isAttached) {
    // Consider there will be abnormal when merge hover style to normal style if given default value.
    opt = opt || EMPTY_OBJ;
    var ecModel = textStyleModel.ecModel;
    var globalTextStyle = ecModel && ecModel.option.textStyle;
    // Consider case:
    // {
    //     data: [{
    //         value: 12,
    //         label: {
    //             rich: {
    //                 // no 'a' here but using parent 'a'.
    //             }
    //         }
    //     }],
    //     rich: {
    //         a: { ... }
    //     }
    // }
    var richItemNames = getRichItemNames(textStyleModel);
    var richResult;
    if (richItemNames) {
        richResult = {};
        var richInheritPlainLabelOptionName = 'richInheritPlainLabel';
        var richInheritPlainLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(textStyleModel.get(richInheritPlainLabelOptionName), ecModel ? ecModel.get(richInheritPlainLabelOptionName) : undefined);
        for(var name_1 in richItemNames){
            if (richItemNames.hasOwnProperty(name_1)) {
                // Cascade is supported in rich.
                var richTextStyle = textStyleModel.getModel([
                    'rich',
                    name_1
                ]);
                // In rich, never `disableBox`.
                // consider `label: {formatter: '{a|xx}', color: 'blue', rich: {a: {}}}`,
                // the default color `'blue'` will not be adopted if no color declared in `rich`.
                // That might confuses users. So probably we should put `textStyleModel` as the
                // root ancestor of the `richTextStyle`. But that would be a break change.
                // Since v6, the rich style inherits plain label by default
                // but this behavior can be disabled by setting `richInheritPlainLabel` to `false`.
                setTokenTextStyle(richResult[name_1] = {}, richTextStyle, globalTextStyle, textStyleModel, richInheritPlainLabel, opt, isNotNormal, isAttached, false, true);
            }
        }
    }
    if (richResult) {
        textStyle.rich = richResult;
    }
    var overflow = textStyleModel.get('overflow');
    if (overflow) {
        textStyle.overflow = overflow;
    }
    var lineOverflow = textStyleModel.get('lineOverflow');
    if (lineOverflow) {
        textStyle.lineOverflow = lineOverflow;
    }
    var labelTextStyle = textStyle;
    // `minMargin` has a higher precedence than `textMargin`, because `textMargin` is allowed
    // to be set in `defaultOption`.
    var minMargin = textStyleModel.get('minMargin');
    if (minMargin != null) {
        // `minMargin` only support number value.
        minMargin = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNumber"])(minMargin) ? 0 : minMargin / 2;
        labelTextStyle.margin = [
            minMargin,
            minMargin,
            minMargin,
            minMargin
        ];
        labelTextStyle.__marginType = LabelMarginType.minMargin;
    } else {
        var textMargin = textStyleModel.get('textMargin');
        if (textMargin != null) {
            labelTextStyle.margin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeCssArray"])(textMargin);
            labelTextStyle.__marginType = LabelMarginType.textMargin;
        }
    }
    setTokenTextStyle(textStyle, textStyleModel, globalTextStyle, null, null, opt, isNotNormal, isAttached, true, false);
}
// Consider case:
// {
//     data: [{
//         value: 12,
//         label: {
//             rich: {
//                 // no 'a' here but using parent 'a'.
//             }
//         }
//     }],
//     rich: {
//         a: { ... }
//     }
// }
// TODO TextStyleModel
function getRichItemNames(textStyleModel) {
    // Use object to remove duplicated names.
    var richItemNameMap;
    while(textStyleModel && textStyleModel !== textStyleModel.ecModel){
        var rich = (textStyleModel.option || EMPTY_OBJ).rich;
        if (rich) {
            richItemNameMap = richItemNameMap || {};
            var richKeys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keys"])(rich);
            for(var i = 0; i < richKeys.length; i++){
                var richKey = richKeys[i];
                richItemNameMap[richKey] = 1;
            }
        }
        textStyleModel = textStyleModel.parentModel;
    }
    return richItemNameMap;
}
var TEXT_PROPS_WITH_GLOBAL = [
    'fontStyle',
    'fontWeight',
    'fontSize',
    'fontFamily',
    'textShadowColor',
    'textShadowBlur',
    'textShadowOffsetX',
    'textShadowOffsetY'
];
var TEXT_PROPS_SELF = [
    'align',
    'lineHeight',
    'width',
    'height',
    'tag',
    'verticalAlign',
    'ellipsis'
];
var TEXT_PROPS_BOX = [
    'padding',
    'borderWidth',
    'borderRadius',
    'borderDashOffset',
    'backgroundColor',
    'borderColor',
    'shadowColor',
    'shadowBlur',
    'shadowOffsetX',
    'shadowOffsetY'
];
function setTokenTextStyle(textStyle, // FIXME: check/refactor for ellipsis handling of rich text.
textStyleModel, globalTextStyle, plainTextModel, richInheritPlainLabel, opt, isNotNormal, isAttached, isBlock, inRich) {
    // In merge mode, default value should not be given.
    globalTextStyle = !isNotNormal && globalTextStyle || EMPTY_OBJ;
    var inheritColor = opt && opt.inheritColor;
    var fillColor = textStyleModel.getShallow('color');
    var strokeColor = textStyleModel.getShallow('textBorderColor');
    var opacity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(textStyleModel.getShallow('opacity'), globalTextStyle.opacity);
    if (fillColor === 'inherit' || fillColor === 'auto') {
        if ("TURBOPACK compile-time truthy", 1) {
            if (fillColor === 'auto') {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateReplaceLog"])('color: \'auto\'', 'color: \'inherit\'');
            }
        }
        if (inheritColor) {
            fillColor = inheritColor;
        } else {
            fillColor = null;
        }
    }
    if (strokeColor === 'inherit' || strokeColor === 'auto') {
        if ("TURBOPACK compile-time truthy", 1) {
            if (strokeColor === 'auto') {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateReplaceLog"])('color: \'auto\'', 'color: \'inherit\'');
            }
        }
        if (inheritColor) {
            strokeColor = inheritColor;
        } else {
            strokeColor = null;
        }
    }
    if (!isAttached) {
        // Only use default global textStyle.color if text is individual.
        // Otherwise it will use the strategy of attached text color because text may be on a path.
        fillColor = fillColor || globalTextStyle.color;
        strokeColor = strokeColor || globalTextStyle.textBorderColor;
    }
    if (fillColor != null) {
        // Might not be a string, e.g, it's a function in axisLabel case; but assume that it will
        // be erased by a correct value outside.
        textStyle.fill = fillColor;
    }
    if (strokeColor != null) {
        textStyle.stroke = strokeColor;
    }
    var textBorderWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(textStyleModel.getShallow('textBorderWidth'), globalTextStyle.textBorderWidth);
    if (textBorderWidth != null) {
        textStyle.lineWidth = textBorderWidth;
    }
    var textBorderType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(textStyleModel.getShallow('textBorderType'), globalTextStyle.textBorderType);
    if (textBorderType != null) {
        textStyle.lineDash = textBorderType;
    }
    var textBorderDashOffset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(textStyleModel.getShallow('textBorderDashOffset'), globalTextStyle.textBorderDashOffset);
    if (textBorderDashOffset != null) {
        textStyle.lineDashOffset = textBorderDashOffset;
    }
    if (!isNotNormal && opacity == null && !inRich) {
        opacity = opt && opt.defaultOpacity;
    }
    if (opacity != null) {
        textStyle.opacity = opacity;
    }
    // TODO
    if (!isNotNormal && !isAttached) {
        // Set default finally.
        if (textStyle.fill == null && opt.inheritColor) {
            textStyle.fill = opt.inheritColor;
        }
    }
    // Do not use `getFont` here, because merge should be supported, where
    // part of these properties may be changed in emphasis style, and the
    // others should remain their original value got from normal style.
    for(var i = 0; i < TEXT_PROPS_WITH_GLOBAL.length; i++){
        var key = TEXT_PROPS_WITH_GLOBAL[i];
        // props width, height, padding, margin, tag, backgroundColor, borderColor,
        // borderWidth, borderRadius, shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY
        // may inappropriate to inherit from plainTextStyle.
        // And if some props is specified in default options, users may have to reset them one by one.
        // Therefore, we only allow these props to inherit from plainTextStyle.
        // `richInheritPlainLabel` is switch for backward compatibility
        var val = richInheritPlainLabel !== false && plainTextModel ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve3"])(textStyleModel.getShallow(key), plainTextModel.getShallow(key), globalTextStyle[key]) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(textStyleModel.getShallow(key), globalTextStyle[key]);
        if (val != null) {
            textStyle[key] = val;
        }
    }
    for(var i = 0; i < TEXT_PROPS_SELF.length; i++){
        var key = TEXT_PROPS_SELF[i];
        var val = textStyleModel.getShallow(key);
        if (val != null) {
            textStyle[key] = val;
        }
    }
    if (textStyle.verticalAlign == null) {
        var baseline = textStyleModel.getShallow('baseline');
        if (baseline != null) {
            textStyle.verticalAlign = baseline;
        }
    }
    if (!isBlock || !opt.disableBox) {
        for(var i = 0; i < TEXT_PROPS_BOX.length; i++){
            var key = TEXT_PROPS_BOX[i];
            var val = textStyleModel.getShallow(key);
            if (val != null) {
                textStyle[key] = val;
            }
        }
        var borderType = textStyleModel.getShallow('borderType');
        if (borderType != null) {
            textStyle.borderDash = borderType;
        }
        if ((textStyle.backgroundColor === 'auto' || textStyle.backgroundColor === 'inherit') && inheritColor) {
            if ("TURBOPACK compile-time truthy", 1) {
                if (textStyle.backgroundColor === 'auto') {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateReplaceLog"])('backgroundColor: \'auto\'', 'backgroundColor: \'inherit\'');
                }
            }
            textStyle.backgroundColor = inheritColor;
        }
        if ((textStyle.borderColor === 'auto' || textStyle.borderColor === 'inherit') && inheritColor) {
            if ("TURBOPACK compile-time truthy", 1) {
                if (textStyle.borderColor === 'auto') {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateReplaceLog"])('borderColor: \'auto\'', 'borderColor: \'inherit\'');
                }
            }
            textStyle.borderColor = inheritColor;
        }
    }
}
function getFont(opt, ecModel) {
    var gTextStyleModel = ecModel && ecModel.getModel('textStyle');
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trim"])([
        // FIXME in node-canvas fontWeight is before fontStyle
        opt.fontStyle || gTextStyleModel && gTextStyleModel.getShallow('fontStyle') || '',
        opt.fontWeight || gTextStyleModel && gTextStyleModel.getShallow('fontWeight') || '',
        (opt.fontSize || gTextStyleModel && gTextStyleModel.getShallow('fontSize') || 12) + 'px',
        opt.fontFamily || gTextStyleModel && gTextStyleModel.getShallow('fontFamily') || 'sans-serif'
    ].join(' '));
}
var labelInner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeInner"])();
function setLabelValueAnimation(label, labelStatesModels, value, getDefaultText) {
    if (!label) {
        return;
    }
    var obj = labelInner(label);
    obj.prevValue = obj.value;
    obj.value = value;
    var normalLabelModel = labelStatesModels.normal;
    obj.valueAnimation = normalLabelModel.get('valueAnimation');
    if (obj.valueAnimation) {
        obj.precision = normalLabelModel.get('precision');
        obj.defaultInterpolatedText = getDefaultText;
        obj.statesModels = labelStatesModels;
    }
}
function animateLabelValue(textEl, dataIndex, data, animatableModel, labelFetcher) {
    var labelInnerStore = labelInner(textEl);
    if (!labelInnerStore.valueAnimation || labelInnerStore.prevValue === labelInnerStore.value) {
        // Value not changed, no new label animation
        return;
    }
    var defaultInterpolatedText = labelInnerStore.defaultInterpolatedText;
    // Consider the case that being animating, do not use the `obj.value`,
    // Otherwise it will jump to the `obj.value` when this new animation started.
    var currValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retrieve2"])(labelInnerStore.interpolatedValue, labelInnerStore.prevValue);
    var targetValue = labelInnerStore.value;
    function during(percent) {
        var interpolated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["interpolateRawValues"])(data, labelInnerStore.precision, currValue, targetValue, percent);
        labelInnerStore.interpolatedValue = percent === 1 ? null : interpolated;
        var labelText = getLabelText({
            labelDataIndex: dataIndex,
            labelFetcher: labelFetcher,
            defaultText: defaultInterpolatedText ? defaultInterpolatedText(interpolated) : interpolated + ''
        }, labelInnerStore.statesModels, interpolated);
        setLabelText(textEl, labelText);
    }
    textEl.percent = 0;
    (labelInnerStore.prevValue == null ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initProps"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$animation$2f$basicTransition$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateProps"])(textEl, {
        // percent is used to prevent animation from being aborted #15916
        percent: 1
    }, animatableModel, dataIndex, null, during);
}
var LabelMarginType = {
    minMargin: 1,
    textMargin: 2
};
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/label/sectorLabel.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSectorCalculateTextPosition",
    ()=>createSectorCalculateTextPosition,
    "setSectorTextRotation",
    ()=>setSectorTextRotation
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$contain$2f$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/contain/text.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
;
;
function createSectorCalculateTextPosition(positionMapping, opts) {
    opts = opts || {};
    var isRoundCap = opts.isRoundCap;
    return function(out, opts, boundingRect) {
        var textPosition = opts.position;
        if (!textPosition || textPosition instanceof Array) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$contain$2f$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateTextPosition"])(out, opts, boundingRect);
        }
        var mappedSectorPosition = positionMapping(textPosition);
        var distance = opts.distance != null ? opts.distance : 5;
        var sector = this.shape;
        var cx = sector.cx;
        var cy = sector.cy;
        var r = sector.r;
        var r0 = sector.r0;
        var middleR = (r + r0) / 2;
        var startAngle = sector.startAngle;
        var endAngle = sector.endAngle;
        var middleAngle = (startAngle + endAngle) / 2;
        var extraDist = isRoundCap ? Math.abs(r - r0) / 2 : 0;
        var mathCos = Math.cos;
        var mathSin = Math.sin;
        // base position: top-left
        var x = cx + r * mathCos(startAngle);
        var y = cy + r * mathSin(startAngle);
        var textAlign = 'left';
        var textVerticalAlign = 'top';
        switch(mappedSectorPosition){
            case 'startArc':
                x = cx + (r0 - distance) * mathCos(middleAngle);
                y = cy + (r0 - distance) * mathSin(middleAngle);
                textAlign = 'center';
                textVerticalAlign = 'top';
                break;
            case 'insideStartArc':
                x = cx + (r0 + distance) * mathCos(middleAngle);
                y = cy + (r0 + distance) * mathSin(middleAngle);
                textAlign = 'center';
                textVerticalAlign = 'bottom';
                break;
            case 'startAngle':
                x = cx + middleR * mathCos(startAngle) + adjustAngleDistanceX(startAngle, distance + extraDist, false);
                y = cy + middleR * mathSin(startAngle) + adjustAngleDistanceY(startAngle, distance + extraDist, false);
                textAlign = 'right';
                textVerticalAlign = 'middle';
                break;
            case 'insideStartAngle':
                x = cx + middleR * mathCos(startAngle) + adjustAngleDistanceX(startAngle, -distance + extraDist, false);
                y = cy + middleR * mathSin(startAngle) + adjustAngleDistanceY(startAngle, -distance + extraDist, false);
                textAlign = 'left';
                textVerticalAlign = 'middle';
                break;
            case 'middle':
                x = cx + middleR * mathCos(middleAngle);
                y = cy + middleR * mathSin(middleAngle);
                textAlign = 'center';
                textVerticalAlign = 'middle';
                break;
            case 'endArc':
                x = cx + (r + distance) * mathCos(middleAngle);
                y = cy + (r + distance) * mathSin(middleAngle);
                textAlign = 'center';
                textVerticalAlign = 'bottom';
                break;
            case 'insideEndArc':
                x = cx + (r - distance) * mathCos(middleAngle);
                y = cy + (r - distance) * mathSin(middleAngle);
                textAlign = 'center';
                textVerticalAlign = 'top';
                break;
            case 'endAngle':
                x = cx + middleR * mathCos(endAngle) + adjustAngleDistanceX(endAngle, distance + extraDist, true);
                y = cy + middleR * mathSin(endAngle) + adjustAngleDistanceY(endAngle, distance + extraDist, true);
                textAlign = 'left';
                textVerticalAlign = 'middle';
                break;
            case 'insideEndAngle':
                x = cx + middleR * mathCos(endAngle) + adjustAngleDistanceX(endAngle, -distance + extraDist, true);
                y = cy + middleR * mathSin(endAngle) + adjustAngleDistanceY(endAngle, -distance + extraDist, true);
                textAlign = 'right';
                textVerticalAlign = 'middle';
                break;
            default:
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$contain$2f$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateTextPosition"])(out, opts, boundingRect);
        }
        out = out || {};
        out.x = x;
        out.y = y;
        out.align = textAlign;
        out.verticalAlign = textVerticalAlign;
        return out;
    };
}
function setSectorTextRotation(sector, textPosition, positionMapping, rotateType) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNumber"])(rotateType)) {
        // user-set rotation
        sector.setTextConfig({
            rotation: rotateType
        });
        return;
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"])(textPosition)) {
        // user-set position, use 0 as auto rotation
        sector.setTextConfig({
            rotation: 0
        });
        return;
    }
    var shape = sector.shape;
    var startAngle = shape.clockwise ? shape.startAngle : shape.endAngle;
    var endAngle = shape.clockwise ? shape.endAngle : shape.startAngle;
    var middleAngle = (startAngle + endAngle) / 2;
    var anchorAngle;
    var mappedSectorPosition = positionMapping(textPosition);
    switch(mappedSectorPosition){
        case 'startArc':
        case 'insideStartArc':
        case 'middle':
        case 'insideEndArc':
        case 'endArc':
            anchorAngle = middleAngle;
            break;
        case 'startAngle':
        case 'insideStartAngle':
            anchorAngle = startAngle;
            break;
        case 'endAngle':
        case 'insideEndAngle':
            anchorAngle = endAngle;
            break;
        default:
            sector.setTextConfig({
                rotation: 0
            });
            return;
    }
    var rotate = Math.PI * 1.5 - anchorAngle;
    /**
   * TODO: labels with rotate > Math.PI / 2 should be rotate another
   * half round flipped to increase readability. However, only middle
   * position supports this for now, because in other positions, the
   * anchor point is not at the center of the text, so the positions
   * after rotating is not as expected.
   */ if (mappedSectorPosition === 'middle' && rotate > Math.PI / 2 && rotate < Math.PI * 1.5) {
        rotate -= Math.PI;
    }
    sector.setTextConfig({
        rotation: rotate
    });
}
function adjustAngleDistanceX(angle, distance, isEnd) {
    return distance * Math.sin(angle) * (isEnd ? -1 : 1);
}
function adjustAngleDistanceY(angle, distance, isEnd) {
    return distance * Math.cos(angle) * (isEnd ? 1 : -1);
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/layout/barCommon.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SERIES_TYPE_BAR",
    ()=>SERIES_TYPE_BAR,
    "SERIES_TYPE_PICTORIAL_BAR",
    ()=>SERIES_TYPE_PICTORIAL_BAR,
    "getStartValue",
    ()=>getStartValue,
    "requireAxisStatisticsForBaseBar",
    ()=>requireAxisStatisticsForBaseBar
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$axisSnippets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/axisSnippets.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisStatistics.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-ssr] (ecmascript)");
;
;
;
;
var SERIES_TYPE_BAR = 'bar';
var SERIES_TYPE_PICTORIAL_BAR = 'pictorialBar';
function requireAxisStatisticsForBaseBar(registers, axisStatKey, seriesType, coordSysType) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["requireAxisStatistics"])(registers, {
        key: axisStatKey,
        seriesType: seriesType,
        coordSysType: coordSysType,
        getMetrics: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$axisSnippets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMetricsNonOrdinalLinearPositiveMinGap"]
    });
}
function getStartValue(baseAxis) {
    var val = baseAxis.scale.rawExtentInfo.makeRenderInfo().startValue;
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNullableNumberFinite"])(val));
    }
    return val;
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/layout/barGrid.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computeBarLayoutForCustomSeries",
    ()=>computeBarLayoutForCustomSeries,
    "createCrossSeriesLayoutHandler",
    ()=>createCrossSeriesLayoutHandler,
    "createProgressiveLayout",
    ()=>createProgressiveLayout,
    "registerBarGridAxisHandlers",
    ()=>registerBarGridAxisHandlers
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataStackHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/dataStackHelper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createRenderPlanner$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createRenderPlanner.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$Axis2D$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/cartesian/Axis2D.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$vendor$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/vendor.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/scale/helper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$cartesianAxisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/cartesian/cartesianAxisHelper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$scaleRawExtentInfo$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/scaleRawExtentInfo.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisStatistics.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisBand$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/axisBand.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$layout$2f$barCommon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/layout/barCommon.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$GridModel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/coord/cartesian/GridModel.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$axisSnippets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/axisSnippets.js [app-ssr] (ecmascript)");
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
var callOnlyOnce = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeCallOnlyOnce"])();
var STACK_PREFIX = '__ec_stack_';
function getSeriesStackId(seriesModel) {
    return seriesModel.get('stack') || STACK_PREFIX + seriesModel.seriesIndex;
}
function computeBarLayoutForCustomSeries(opt) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$scale$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOrdinalScale"])(opt.axis.scale)) {
        return;
    }
    var bandWidthResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisBand$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calcBandWidth"])(opt.axis);
    var params = [];
    for(var i = 0; i < opt.count || 0; i++){
        params.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaults"])({
            stackId: STACK_PREFIX + i
        }, opt));
    }
    var widthAndOffsets = calcBarWidthAndOffset({
        bandWidthResult: bandWidthResult,
        seriesInfo: params
    });
    var result = [];
    for(var i = 0; i < opt.count; i++){
        var item = widthAndOffsets[STACK_PREFIX + i];
        item.offsetCenter = item.offset + item.width / 2;
        result.push(item);
    }
    return result;
}
/**
 * NOTICE: This layout is based on axis pixel extent and scale extent.
 *  It may be used on estimation, where axis pixel extent and scale extent
 *  are approximately set. But the result should not be cached since the
 *  axis pixel extent and scale extent may be changed finally.
 */ function makeColumnLayoutOnAxisReal(baseAxis, seriesType) {
    var seriesInfoListOnAxis = createLayoutInfoListOnAxis(baseAxis, seriesType);
    seriesInfoListOnAxis.columnMap = calcBarWidthAndOffset(seriesInfoListOnAxis);
    return seriesInfoListOnAxis;
}
function createLayoutInfoListOnAxis(baseAxis, seriesType) {
    var axisStatKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$axisSnippets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeAxisStatKey2"])(seriesType, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$GridModel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COORD_SYS_TYPE_CARTESIAN_2D"]);
    var seriesInfoOnAxis = [];
    var bandWidthResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisBand$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calcBandWidth"])(baseAxis, {
        fromStat: {
            key: axisStatKey
        },
        min: 1
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["eachSeriesOnAxisOnKey"])(baseAxis, axisStatKey, function(seriesModel) {
        seriesInfoOnAxis.push({
            barWidth: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePercent"])(seriesModel.get('barWidth'), bandWidthResult.w),
            barMaxWidth: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePercent"])(seriesModel.get('barMaxWidth'), bandWidthResult.w),
            barMinWidth: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePercent"])(// barMinWidth by default is 0.5 / 1 in cartesian. Because in value axis,
            // the auto-calculated bar width might be less than 0.5 / 1.
            seriesModel.get('barMinWidth') || (isInLargeMode(seriesModel) ? 0.5 : 1), bandWidthResult.w),
            barGap: seriesModel.get('barGap'),
            barCategoryGap: seriesModel.get('barCategoryGap'),
            defaultBarGap: seriesModel.get('defaultBarGap'),
            stackId: getSeriesStackId(seriesModel)
        });
    });
    return {
        bandWidthResult: bandWidthResult,
        seriesInfo: seriesInfoOnAxis
    };
}
/**
 * CAUTION: When multiple series are laid out on one axis, relevant ec options effect all series.
 * But for historical reason, these options are configured on each series option, which may
 * introduce confliction. The legacy implementation uses some options (e.g., `defaultBarGap`)
 * from the first declared series, and other options (e.g., `barGap`, `barCategoryGap`) from the last declared
 * series. Nevertheless, We remain this design to avoid breaking change.
 */ function calcBarWidthAndOffset(seriesInfoOnAxis) {
    var bandWidth = seriesInfoOnAxis.bandWidthResult.w;
    var remainedWidth = bandWidth;
    var autoWidthCount = 0;
    var barCategoryGapOption;
    var barGapOption;
    var stackIdList = [];
    var stackMap = {};
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(seriesInfoOnAxis.seriesInfo, function(seriesInfo, idx) {
        if (!idx) {
            barGapOption = seriesInfo.defaultBarGap || 0;
        }
        var stackId = seriesInfo.stackId;
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hasOwn"])(stackMap, stackId)) {
            autoWidthCount++;
        }
        var stackItem = stackMap[stackId];
        if (!stackItem) {
            stackItem = stackMap[stackId] = {
                width: 0,
                maxWidth: 0
            };
            stackIdList.push(stackId);
        }
        var barWidth = seriesInfo.barWidth;
        if (barWidth && !stackItem.width) {
            // See #6312, do not restrict width.
            stackItem.width = barWidth;
            barWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathMin"])(remainedWidth, barWidth);
            remainedWidth -= barWidth;
        }
        var barMaxWidth = seriesInfo.barMaxWidth;
        barMaxWidth && (stackItem.maxWidth = barMaxWidth);
        var barMinWidth = seriesInfo.barMinWidth;
        barMinWidth && (stackItem.minWidth = barMinWidth);
        var barGap = seriesInfo.barGap;
        barGap != null && (barGapOption = barGap);
        var barCategoryGap = seriesInfo.barCategoryGap;
        barCategoryGap != null && (barCategoryGapOption = barCategoryGap);
    });
    if (barCategoryGapOption == null) {
        // More columns in one group
        // the spaces between group is smaller. Or the column will be too thin.
        barCategoryGapOption = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathMax"])(35 - stackIdList.length * 4, 15) + '%';
    }
    var barCategoryGapNum = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePercent"])(barCategoryGapOption, bandWidth);
    var barGapPercent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePercent"])(barGapOption, 1);
    var autoWidth = (remainedWidth - barCategoryGapNum) / (autoWidthCount + (autoWidthCount - 1) * barGapPercent);
    autoWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathMax"])(autoWidth, 0);
    // Find if any auto calculated bar exceeded maxBarWidth
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(stackIdList, function(stackId) {
        var column = stackMap[stackId];
        var maxWidth = column.maxWidth;
        var minWidth = column.minWidth;
        if (!column.width) {
            var finalWidth = autoWidth;
            if (maxWidth && maxWidth < finalWidth) {
                finalWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathMin"])(maxWidth, remainedWidth);
            }
            // `minWidth` has higher priority. `minWidth` decide that whether the
            // bar is able to be visible. So `minWidth` should not be restricted
            // by `maxWidth` or `remainedWidth` (which is from `bandWidth`). In
            // the extreme cases for `value` axis, bars are allowed to overlap
            // with each other if `minWidth` specified.
            if (minWidth && minWidth > finalWidth) {
                finalWidth = minWidth;
            }
            if (finalWidth !== autoWidth) {
                column.width = finalWidth;
                remainedWidth -= finalWidth + barGapPercent * finalWidth;
                autoWidthCount--;
            }
        } else {
            // `barMinWidth/barMaxWidth` has higher priority than `barWidth`, as
            // CSS does. Because barWidth can be a percent value, where
            // `barMaxWidth` can be used to restrict the final width.
            var finalWidth = column.width;
            if (maxWidth) {
                finalWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathMin"])(finalWidth, maxWidth);
            }
            // `minWidth` has higher priority, as described above
            if (minWidth) {
                finalWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathMax"])(finalWidth, minWidth);
            }
            column.width = finalWidth;
            remainedWidth -= finalWidth + barGapPercent * finalWidth;
            autoWidthCount--;
        }
    });
    // Recalculate width again
    autoWidth = (remainedWidth - barCategoryGapNum) / (autoWidthCount + (autoWidthCount - 1) * barGapPercent);
    autoWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathMax"])(autoWidth, 0);
    var widthSum = 0;
    var lastColumn;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(stackIdList, function(stackId) {
        var column = stackMap[stackId];
        if (!column.width) {
            column.width = autoWidth;
        }
        lastColumn = column;
        widthSum += column.width * (1 + barGapPercent);
    });
    if (lastColumn) {
        widthSum -= lastColumn.width * barGapPercent;
    }
    var result = {};
    var offset = -widthSum / 2;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(stackIdList, function(stackId) {
        var column = stackMap[stackId];
        result[stackId] = result[stackId] || {
            bandWidth: bandWidth,
            offset: offset,
            width: column.width
        };
        offset += column.width * (1 + barGapPercent);
    });
    return result;
}
function createCrossSeriesLayoutHandler(seriesType) {
    return {
        seriesType: seriesType,
        overallReset: function(ecModel) {
            var axisStatKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$axisSnippets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeAxisStatKey2"])(seriesType, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$GridModel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COORD_SYS_TYPE_CARTESIAN_2D"]);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["eachAxisOnKey"])(ecModel, axisStatKey, function(axis) {
                if ("TURBOPACK compile-time truthy", 1) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"])(axis instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$Axis2D$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
                }
                var columnLayout = makeColumnLayoutOnAxisReal(axis, seriesType);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$axisStatistics$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["eachSeriesOnAxisOnKey"])(axis, axisStatKey, function(seriesModel) {
                    var columnLayoutInfo = columnLayout.columnMap[getSeriesStackId(seriesModel)];
                    seriesModel.getData().setLayout({
                        bandWidth: columnLayoutInfo.bandWidth,
                        offset: columnLayoutInfo.offset,
                        size: columnLayoutInfo.width
                    });
                });
            });
        }
    };
}
;
function createProgressiveLayout(seriesType) {
    return {
        seriesType: seriesType,
        plan: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createRenderPlanner$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(),
        reset: function(seriesModel) {
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$cartesianAxisHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isCartesian2DInjectedAsDataCoordSys"])(seriesModel)) {
                return;
            }
            var data = seriesModel.getData();
            var cartesian = seriesModel.coordinateSystem;
            var baseAxis = cartesian.getBaseAxis();
            var valueAxis = cartesian.getOtherAxis(baseAxis);
            var valueDimIdx = data.getDimensionIndex(data.mapDimension(valueAxis.dim));
            var baseDimIdx = data.getDimensionIndex(data.mapDimension(baseAxis.dim));
            var drawBackground = seriesModel.get('showBackground', true);
            var valueDim = data.mapDimension(valueAxis.dim);
            var stackResultDim = data.getCalculationInfo('stackResultDimension');
            var stacked = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataStackHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDimensionStacked"])(data, valueDim) && !!data.getCalculationInfo('stackedOnSeries');
            var isValueAxisH = valueAxis.isHorizontal();
            var valueAxisStart = valueAxis.toGlobalCoord(valueAxis.dataToCoord((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$layout$2f$barCommon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStartValue"])(valueAxis)));
            var isLarge = isInLargeMode(seriesModel);
            var barMinHeight = seriesModel.get('barMinHeight') || 0;
            var stackedDimIdx = stackResultDim && data.getDimensionIndex(stackResultDim);
            // Layout info.
            var columnWidth = data.getLayout('size');
            var columnOffset = data.getLayout('offset');
            return {
                progress: function(params, data) {
                    var count = params.count;
                    var largePoints = isLarge && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$vendor$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createFloat32Array"])(count * 3);
                    var largeBackgroundPoints = isLarge && drawBackground && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$vendor$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createFloat32Array"])(count * 3);
                    var largeDataIndices = isLarge && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$vendor$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createFloat32Array"])(count);
                    var coordLayout = cartesian.master.getRect();
                    var bgSize = isValueAxisH ? coordLayout.width : coordLayout.height;
                    var dataIndex;
                    var store = data.getStore();
                    var idxOffset = 0;
                    while((dataIndex = params.next()) != null){
                        var value = store.get(stacked ? stackedDimIdx : valueDimIdx, dataIndex);
                        var baseValue = store.get(baseDimIdx, dataIndex);
                        var baseCoord = valueAxisStart;
                        var stackStartValue = void 0;
                        // Because of the barMinHeight, we can not use the value in
                        // stackResultDimension directly.
                        if (stacked) {
                            stackStartValue = +value - store.get(valueDimIdx, dataIndex);
                        }
                        var x = void 0;
                        var y = void 0;
                        var width = void 0;
                        var height = void 0;
                        if (isValueAxisH) {
                            var coord = cartesian.dataToPoint([
                                value,
                                baseValue
                            ]);
                            if (stacked) {
                                baseCoord = cartesian.dataToPoint([
                                    stackStartValue,
                                    baseValue
                                ])[0];
                            }
                            x = baseCoord;
                            y = coord[1] + columnOffset;
                            width = coord[0] - baseCoord;
                            height = columnWidth;
                            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathAbs"])(width) < barMinHeight) {
                                width = (width < 0 ? -1 : 1) * barMinHeight;
                            }
                        } else {
                            var coord = cartesian.dataToPoint([
                                baseValue,
                                value
                            ]);
                            if (stacked) {
                                baseCoord = cartesian.dataToPoint([
                                    baseValue,
                                    stackStartValue
                                ])[1];
                            }
                            x = coord[0] + columnOffset;
                            y = baseCoord;
                            width = columnWidth;
                            height = coord[1] - baseCoord;
                            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mathAbs"])(height) < barMinHeight) {
                                // Include zero to has a positive bar
                                height = (height <= 0 ? -1 : 1) * barMinHeight;
                            }
                        }
                        if (!isLarge) {
                            data.setItemLayout(dataIndex, {
                                x: x,
                                y: y,
                                width: width,
                                height: height
                            });
                        } else {
                            largePoints[idxOffset] = x;
                            largePoints[idxOffset + 1] = y;
                            largePoints[idxOffset + 2] = isValueAxisH ? width : height;
                            if (largeBackgroundPoints) {
                                largeBackgroundPoints[idxOffset] = isValueAxisH ? coordLayout.x : x;
                                largeBackgroundPoints[idxOffset + 1] = isValueAxisH ? y : coordLayout.y;
                                largeBackgroundPoints[idxOffset + 2] = bgSize;
                            }
                            largeDataIndices[dataIndex] = dataIndex;
                        }
                        idxOffset += 3;
                    }
                    if (isLarge) {
                        data.setLayout({
                            largePoints: largePoints,
                            largeDataIndices: largeDataIndices,
                            largeBackgroundPoints: largeBackgroundPoints,
                            valueAxisHorizontal: isValueAxisH
                        });
                    }
                }
            };
        }
    };
}
function isInLargeMode(seriesModel) {
    return seriesModel.pipelineContext && seriesModel.pipelineContext.large;
}
function barGridCreateAxisContainShapeHandler(seriesType) {
    // See also #6728, #4862, `test/bar-overflow-time-plot.html` `test/bar-overflow-plot2.html`
    // NOTE:
    //  Series shapes may overflow `bandWidth` when ec option is set like:
    //    - `barWidth` > 100%.
    //    - `barWidth` is set as absolute pixel values and `dataZoom` is used, since `bandWidth` is
    //      calculated on data space rather than pixel space.
    //  We originally used `calcShapeOverflowSupplement` to cover this case, but it still can not
    //  resolve pixel `barWidth` case perfectly. A thorough solution may introduce considerable complex,
    //  but may not necessary, since users can avoid it by proper ec option settings.
    //  Therefore, we use simply `createBandWidthBasedAxisContainShapeHandler` to calculate "containShape"
    //  only based on `bandWidth`.
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$axisSnippets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBandWidthBasedAxisContainShapeHandler"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$axisSnippets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeAxisStatKey2"])(seriesType, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$GridModel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COORD_SYS_TYPE_CARTESIAN_2D"]));
// return function (axis, scale, ecModel) {
//     if (!countSeriesOnAxisOnKey(axis, makeAxisStatKey2(seriesType, COORD_SYS_TYPE_CARTESIAN_2D))) {
//         return; // Quick path - in most cases there is no bar on non-ordinal axis.
//     }
//     const columnLayout = makeColumnLayoutOnAxisReal(axis, seriesType);
//     return calcShapeOverflowSupplement(columnLayout);
// };
}
function registerBarGridAxisHandlers(registers) {
    callOnlyOnce(registers, function() {
        function register(seriesType) {
            var axisStatKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$axisSnippets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeAxisStatKey2"])(seriesType, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$GridModel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COORD_SYS_TYPE_CARTESIAN_2D"]);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$layout$2f$barCommon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["requireAxisStatisticsForBaseBar"])(registers, axisStatKey, seriesType, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$cartesian$2f$GridModel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COORD_SYS_TYPE_CARTESIAN_2D"]);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$coord$2f$scaleRawExtentInfo$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerAxisContainShapeHandler"])(axisStatKey, barGridCreateAxisContainShapeHandler(seriesType));
        }
        register('bar');
        register('pictorialBar');
    });
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/layout/points.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>pointsLayout
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createRenderPlanner$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createRenderPlanner.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataStackHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/data/helper/dataStackHelper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$vendor$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/vendor.js [app-ssr] (ecmascript)");
;
;
;
;
function pointsLayout(seriesType, forceStoreInTypedArray) {
    return {
        seriesType: seriesType,
        plan: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createRenderPlanner$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(),
        reset: function(seriesModel) {
            var data = seriesModel.getData();
            var coordSys = seriesModel.coordinateSystem;
            var pipelineContext = seriesModel.pipelineContext;
            var useTypedArray = forceStoreInTypedArray || pipelineContext.large;
            if (!coordSys) {
                return;
            }
            var dims = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"])(coordSys.dimensions, function(dim) {
                return data.mapDimension(dim);
            }).slice(0, 2);
            var dimLen = dims.length;
            var stackResultDim = data.getCalculationInfo('stackResultDimension');
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataStackHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDimensionStacked"])(data, dims[0])) {
                dims[0] = stackResultDim;
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$data$2f$helper$2f$dataStackHelper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDimensionStacked"])(data, dims[1])) {
                dims[1] = stackResultDim;
            }
            var store = data.getStore();
            var dimIdx0 = data.getDimensionIndex(dims[0]);
            var dimIdx1 = data.getDimensionIndex(dims[1]);
            return dimLen && {
                progress: function(params, data) {
                    var segCount = params.end - params.start;
                    var points = useTypedArray && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$vendor$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createFloat32Array"])(segCount * dimLen);
                    var tmpIn = [];
                    var tmpOut = [];
                    for(var i = params.start, offset = 0; i < params.end; i++){
                        var point = void 0;
                        if (dimLen === 1) {
                            var x = store.get(dimIdx0, i);
                            // NOTE: Make sure the second parameter is null to use default strategy.
                            point = coordSys.dataToPoint(x, null, tmpOut);
                        } else {
                            tmpIn[0] = store.get(dimIdx0, i);
                            tmpIn[1] = store.get(dimIdx1, i);
                            // Let coordinate system to handle the NaN data.
                            point = coordSys.dataToPoint(tmpIn, null, tmpOut);
                        }
                        if (useTypedArray) {
                            points[offset++] = point[0];
                            points[offset++] = point[1];
                        } else {
                            data.setItemLayout(i, point.slice());
                        }
                    }
                    if (useTypedArray) {
                        data.setLayout('points', points);
                        data.setLayout('pointsRange', {
                            start: params.start,
                            end: params.end
                        });
                    }
                }
            };
        }
    };
}
;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/legacy/dataSelectAction.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createLegacyDataSelectAction",
    ()=>createLegacyDataSelectAction,
    "handleLegacySelectEvents",
    ()=>handleLegacySelectEvents
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
;
;
;
function createLegacyDataSelectAction(seriesType, ecRegisterAction) {
    function getSeriesIndices(ecModel, payload) {
        var seriesIndices = [];
        ecModel.eachComponent({
            mainType: 'series',
            subType: seriesType,
            query: payload
        }, function(seriesModel) {
            seriesIndices.push(seriesModel.seriesIndex);
        });
        return seriesIndices;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])([
        [
            seriesType + 'ToggleSelect',
            'toggleSelect'
        ],
        [
            seriesType + 'Select',
            'select'
        ],
        [
            seriesType + 'UnSelect',
            'unselect'
        ]
    ], function(eventsMap) {
        ecRegisterAction(eventsMap[0], function(payload, ecModel, api) {
            payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"])({}, payload);
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateReplaceLog"])(payload.type, eventsMap[1]);
            }
            api.dispatchAction((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"])(payload, {
                type: eventsMap[1],
                seriesIndex: getSeriesIndices(ecModel, payload)
            }));
        });
    });
}
function handleSeriesLegacySelectEvents(type, eventPostfix, ecIns, ecModel, payload) {
    var legacyEventName = type + eventPostfix;
    if (!ecIns.isSilent(legacyEventName)) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateLog"])("event " + legacyEventName + " is deprecated.");
        }
        ecModel.eachComponent({
            mainType: 'series',
            subType: 'pie'
        }, function(seriesModel) {
            var seriesIndex = seriesModel.seriesIndex;
            var selectedMap = seriesModel.option.selectedMap;
            var selected = payload.selected;
            for(var i = 0; i < selected.length; i++){
                if (selected[i].seriesIndex === seriesIndex) {
                    var data = seriesModel.getData();
                    var dataIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["queryDataIndex"])(data, payload.fromActionPayload);
                    ecIns.trigger(legacyEventName, {
                        type: legacyEventName,
                        seriesId: seriesModel.id,
                        name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"])(dataIndex) ? data.getName(dataIndex[0]) : data.getName(dataIndex),
                        selected: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(selectedMap) ? selectedMap : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"])({}, selectedMap)
                    });
                }
            }
        });
    }
}
function handleLegacySelectEvents(messageCenter, ecIns, api) {
    messageCenter.on('selectchanged', function(params) {
        var ecModel = api.getModel();
        if (params.isFromClick) {
            handleSeriesLegacySelectEvents('map', 'selectchanged', ecIns, ecModel, params);
            handleSeriesLegacySelectEvents('pie', 'selectchanged', ecIns, ecModel, params);
        } else if (params.fromAction === 'select') {
            handleSeriesLegacySelectEvents('map', 'selected', ecIns, ecModel, params);
            handleSeriesLegacySelectEvents('pie', 'selected', ecIns, ecModel, params);
        } else if (params.fromAction === 'unselect') {
            handleSeriesLegacySelectEvents('map', 'unselected', ecIns, ecModel, params);
            handleSeriesLegacySelectEvents('pie', 'unselected', ecIns, ecModel, params);
        }
    });
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/loading/default.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>defaultLoading
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Group$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Group.js [app-ssr] (ecmascript) <export default as Group>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Rect$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Rect.js [app-ssr] (ecmascript) <export default as Rect>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Text$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Text.js [app-ssr] (ecmascript) <export default as Text>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Arc$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Arc$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/shape/Arc.js [app-ssr] (ecmascript) <export default as Arc>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/tokens.js [app-ssr] (ecmascript)");
;
;
;
var PI = Math.PI;
function defaultLoading(api, opts) {
    opts = opts || {};
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaults"](opts, {
        text: 'loading',
        textColor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].color.primary,
        fontSize: 12,
        fontWeight: 'normal',
        fontStyle: 'normal',
        fontFamily: 'sans-serif',
        maskColor: 'rgba(255,255,255,0.8)',
        showSpinner: true,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].color.theme[0],
        spinnerRadius: 10,
        lineWidth: 5,
        zlevel: 0
    });
    var group = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Group$3e$__["Group"]();
    var mask = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Rect$3e$__["Rect"]({
        style: {
            fill: opts.maskColor
        },
        zlevel: opts.zlevel,
        z: 10000
    });
    group.add(mask);
    var textContent = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Text$3e$__["Text"]({
        style: {
            text: opts.text,
            fill: opts.textColor,
            fontSize: opts.fontSize,
            fontWeight: opts.fontWeight,
            fontStyle: opts.fontStyle,
            fontFamily: opts.fontFamily
        },
        zlevel: opts.zlevel,
        z: 10001
    });
    var labelRect = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Rect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Rect$3e$__["Rect"]({
        style: {
            fill: 'none'
        },
        textContent: textContent,
        textConfig: {
            position: 'right',
            distance: 10
        },
        zlevel: opts.zlevel,
        z: 10001
    });
    group.add(labelRect);
    var arc;
    if (opts.showSpinner) {
        arc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$shape$2f$Arc$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Arc$3e$__["Arc"]({
            shape: {
                startAngle: -PI / 2,
                endAngle: -PI / 2 + 0.1,
                r: opts.spinnerRadius
            },
            style: {
                stroke: opts.color,
                lineCap: 'round',
                lineWidth: opts.lineWidth
            },
            zlevel: opts.zlevel,
            z: 10001
        });
        arc.animateShape(true).when(1000, {
            endAngle: PI * 3 / 2
        }).start('circularInOut');
        arc.animateShape(true).when(1000, {
            startAngle: PI * 3 / 2
        }).delay(300).start('circularInOut');
        group.add(arc);
    }
    // Inject resize
    group.resize = function() {
        var textWidth = textContent.getBoundingRect().width;
        var r = opts.showSpinner ? opts.spinnerRadius : 0;
        // cx = (containerWidth - arcDiameter - textDistance - textWidth) / 2
        // textDistance needs to be calculated when both animation and text exist
        var cx = (api.getWidth() - r * 2 - (opts.showSpinner && textWidth ? 10 : 0) - textWidth) / 2 - (opts.showSpinner && textWidth ? 0 : 5 + textWidth / 2) + (opts.showSpinner ? 0 : textWidth / 2) + (textWidth ? 0 : r);
        var cy = api.getHeight() / 2;
        opts.showSpinner && arc.setShape({
            cx: cx,
            cy: cy
        });
        labelRect.setShape({
            x: cx - r,
            y: cy - r,
            width: r * 2,
            height: r * 2
        });
        mask.setShape({
            x: 0,
            y: 0,
            width: api.getWidth(),
            height: api.getHeight()
        });
    };
    group.resize();
    return group;
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/preprocessor/backwardCompat.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>globalBackwardCompat
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$preprocessor$2f$helper$2f$compatStyle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/preprocessor/helper/compatStyle.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-ssr] (ecmascript)");
;
;
;
;
function get(opt, path) {
    var pathArr = path.split(',');
    var obj = opt;
    for(var i = 0; i < pathArr.length; i++){
        obj = obj && obj[pathArr[i]];
        if (obj == null) {
            break;
        }
    }
    return obj;
}
function set(opt, path, val, overwrite) {
    var pathArr = path.split(',');
    var obj = opt;
    var key;
    var i = 0;
    for(; i < pathArr.length - 1; i++){
        key = pathArr[i];
        if (obj[key] == null) {
            obj[key] = {};
        }
        obj = obj[key];
    }
    if (overwrite || obj[pathArr[i]] == null) {
        obj[pathArr[i]] = val;
    }
}
function compatLayoutProperties(option) {
    option && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(LAYOUT_PROPERTIES, function(prop) {
        if (prop[0] in option && !(prop[1] in option)) {
            option[prop[1]] = option[prop[0]];
        }
    });
}
var LAYOUT_PROPERTIES = [
    [
        'x',
        'left'
    ],
    [
        'y',
        'top'
    ],
    [
        'x2',
        'right'
    ],
    [
        'y2',
        'bottom'
    ]
];
var COMPATITABLE_COMPONENTS = [
    'grid',
    'geo',
    'parallel',
    'legend',
    'toolbox',
    'title',
    'visualMap',
    'dataZoom',
    'timeline'
];
var BAR_ITEM_STYLE_MAP = [
    [
        'borderRadius',
        'barBorderRadius'
    ],
    [
        'borderColor',
        'barBorderColor'
    ],
    [
        'borderWidth',
        'barBorderWidth'
    ]
];
function compatBarItemStyle(option) {
    var itemStyle = option && option.itemStyle;
    if (itemStyle) {
        for(var i = 0; i < BAR_ITEM_STYLE_MAP.length; i++){
            var oldName = BAR_ITEM_STYLE_MAP[i][1];
            var newName = BAR_ITEM_STYLE_MAP[i][0];
            if (itemStyle[oldName] != null) {
                itemStyle[newName] = itemStyle[oldName];
                if ("TURBOPACK compile-time truthy", 1) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateReplaceLog"])(oldName, newName);
                }
            }
        }
    }
}
function compatPieLabel(option) {
    if (!option) {
        return;
    }
    if (option.alignTo === 'edge' && option.margin != null && option.edgeDistance == null) {
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateReplaceLog"])('label.margin', 'label.edgeDistance', 'pie');
        }
        option.edgeDistance = option.margin;
    }
}
function compatSunburstState(option) {
    if (!option) {
        return;
    }
    if (option.downplay && !option.blur) {
        option.blur = option.downplay;
        if ("TURBOPACK compile-time truthy", 1) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateReplaceLog"])('downplay', 'blur', 'sunburst');
        }
    }
}
function compatGraphFocus(option) {
    if (!option) {
        return;
    }
    if (option.focusNodeAdjacency != null) {
        option.emphasis = option.emphasis || {};
        if (option.emphasis.focus == null) {
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateReplaceLog"])('focusNodeAdjacency', 'emphasis: { focus: \'adjacency\'}', 'graph/sankey');
            }
            option.emphasis.focus = 'adjacency';
        }
    }
}
function traverseTree(data, cb) {
    if (data) {
        for(var i = 0; i < data.length; i++){
            cb(data[i]);
            data[i] && traverseTree(data[i].children, cb);
        }
    }
}
function globalBackwardCompat(option, isTheme) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$preprocessor$2f$helper$2f$compatStyle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(option, isTheme);
    // Make sure series array for model initialization.
    option.series = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeToArray"])(option.series);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(option.series, function(seriesOpt) {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"])(seriesOpt)) {
            return;
        }
        var seriesType = seriesOpt.type;
        if (seriesType === 'line') {
            if (seriesOpt.clipOverflow != null) {
                seriesOpt.clip = seriesOpt.clipOverflow;
                if ("TURBOPACK compile-time truthy", 1) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateReplaceLog"])('clipOverflow', 'clip', 'line');
                }
            }
        } else if (seriesType === 'pie' || seriesType === 'gauge') {
            if (seriesOpt.clockWise != null) {
                seriesOpt.clockwise = seriesOpt.clockWise;
                if ("TURBOPACK compile-time truthy", 1) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateReplaceLog"])('clockWise', 'clockwise');
                }
            }
            compatPieLabel(seriesOpt.label);
            var data = seriesOpt.data;
            if (data && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTypedArray"])(data)) {
                for(var i = 0; i < data.length; i++){
                    compatPieLabel(data[i]);
                }
            }
            if (seriesOpt.hoverOffset != null) {
                seriesOpt.emphasis = seriesOpt.emphasis || {};
                if (seriesOpt.emphasis.scaleSize = null) {
                    if ("TURBOPACK compile-time truthy", 1) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateReplaceLog"])('hoverOffset', 'emphasis.scaleSize');
                    }
                    seriesOpt.emphasis.scaleSize = seriesOpt.hoverOffset;
                }
            }
        } else if (seriesType === 'gauge') {
            var pointerColor = get(seriesOpt, 'pointer.color');
            pointerColor != null && set(seriesOpt, 'itemStyle.color', pointerColor);
        } else if (seriesType === 'bar') {
            compatBarItemStyle(seriesOpt);
            compatBarItemStyle(seriesOpt.backgroundStyle);
            compatBarItemStyle(seriesOpt.emphasis);
            var data = seriesOpt.data;
            if (data && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTypedArray"])(data)) {
                for(var i = 0; i < data.length; i++){
                    if (typeof data[i] === 'object') {
                        compatBarItemStyle(data[i]);
                        compatBarItemStyle(data[i] && data[i].emphasis);
                    }
                }
            }
        } else if (seriesType === 'sunburst') {
            var highlightPolicy = seriesOpt.highlightPolicy;
            if (highlightPolicy) {
                seriesOpt.emphasis = seriesOpt.emphasis || {};
                if (!seriesOpt.emphasis.focus) {
                    seriesOpt.emphasis.focus = highlightPolicy;
                    if ("TURBOPACK compile-time truthy", 1) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateReplaceLog"])('highlightPolicy', 'emphasis.focus', 'sunburst');
                    }
                }
            }
            compatSunburstState(seriesOpt);
            traverseTree(seriesOpt.data, compatSunburstState);
        } else if (seriesType === 'graph' || seriesType === 'sankey') {
            compatGraphFocus(seriesOpt);
        // TODO nodes, edges?
        } else if (seriesType === 'map') {
            if (seriesOpt.mapType && !seriesOpt.map) {
                if ("TURBOPACK compile-time truthy", 1) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateReplaceLog"])('mapType', 'map', 'map');
                }
                seriesOpt.map = seriesOpt.mapType;
            }
            if (seriesOpt.mapLocation) {
                if ("TURBOPACK compile-time truthy", 1) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateLog"])('`mapLocation` is not used anymore.');
                }
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaults"])(seriesOpt, seriesOpt.mapLocation);
            }
        }
        if (seriesOpt.hoverAnimation != null) {
            seriesOpt.emphasis = seriesOpt.emphasis || {};
            if (seriesOpt.emphasis && seriesOpt.emphasis.scale == null) {
                if ("TURBOPACK compile-time truthy", 1) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateReplaceLog"])('hoverAnimation', 'emphasis.scale');
                }
                seriesOpt.emphasis.scale = seriesOpt.hoverAnimation;
            }
        }
        compatLayoutProperties(seriesOpt);
    });
    // dataRange has changed to visualMap
    if (option.dataRange) {
        option.visualMap = option.dataRange;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(COMPATITABLE_COMPONENTS, function(componentName) {
        var options = option[componentName];
        if (options) {
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"])(options)) {
                options = [
                    options
                ];
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(options, function(option) {
                compatLayoutProperties(option);
            });
        }
    });
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/preprocessor/helper/compatStyle.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>globalCompatStyle
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
var each = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"];
var isObject = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"];
var POSSIBLE_STYLES = [
    'areaStyle',
    'lineStyle',
    'nodeStyle',
    'linkStyle',
    'chordStyle',
    'label',
    'labelLine'
];
function compatEC2ItemStyle(opt) {
    var itemStyleOpt = opt && opt.itemStyle;
    if (!itemStyleOpt) {
        return;
    }
    for(var i = 0, len = POSSIBLE_STYLES.length; i < len; i++){
        var styleName = POSSIBLE_STYLES[i];
        var normalItemStyleOpt = itemStyleOpt.normal;
        var emphasisItemStyleOpt = itemStyleOpt.emphasis;
        if (normalItemStyleOpt && normalItemStyleOpt[styleName]) {
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateReplaceLog"])("itemStyle.normal." + styleName, styleName);
            }
            opt[styleName] = opt[styleName] || {};
            if (!opt[styleName].normal) {
                opt[styleName].normal = normalItemStyleOpt[styleName];
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["merge"](opt[styleName].normal, normalItemStyleOpt[styleName]);
            }
            normalItemStyleOpt[styleName] = null;
        }
        if (emphasisItemStyleOpt && emphasisItemStyleOpt[styleName]) {
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateReplaceLog"])("itemStyle.emphasis." + styleName, "emphasis." + styleName);
            }
            opt[styleName] = opt[styleName] || {};
            if (!opt[styleName].emphasis) {
                opt[styleName].emphasis = emphasisItemStyleOpt[styleName];
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["merge"](opt[styleName].emphasis, emphasisItemStyleOpt[styleName]);
            }
            emphasisItemStyleOpt[styleName] = null;
        }
    }
}
function convertNormalEmphasis(opt, optType, useExtend) {
    if (opt && opt[optType] && (opt[optType].normal || opt[optType].emphasis)) {
        var normalOpt = opt[optType].normal;
        var emphasisOpt = opt[optType].emphasis;
        if (normalOpt) {
            if ("TURBOPACK compile-time truthy", 1) {
                // eslint-disable-next-line max-len
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateLog"])("'normal' hierarchy in " + optType + " has been removed since 4.0. All style properties are configured in " + optType + " directly now.");
            }
            // Timeline controlStyle has other properties besides normal and emphasis
            if (useExtend) {
                opt[optType].normal = opt[optType].emphasis = null;
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaults"](opt[optType], normalOpt);
            } else {
                opt[optType] = normalOpt;
            }
        }
        if (emphasisOpt) {
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateLog"])(optType + ".emphasis has been changed to emphasis." + optType + " since 4.0");
            }
            opt.emphasis = opt.emphasis || {};
            opt.emphasis[optType] = emphasisOpt;
            // Also compat the case user mix the style and focus together in ec3 style
            // for example: { itemStyle: { normal: {}, emphasis: {focus, shadowBlur} } }
            if (emphasisOpt.focus) {
                opt.emphasis.focus = emphasisOpt.focus;
            }
            if (emphasisOpt.blurScope) {
                opt.emphasis.blurScope = emphasisOpt.blurScope;
            }
        }
    }
}
function removeEC3NormalStatus(opt) {
    convertNormalEmphasis(opt, 'itemStyle');
    convertNormalEmphasis(opt, 'lineStyle');
    convertNormalEmphasis(opt, 'areaStyle');
    convertNormalEmphasis(opt, 'label');
    convertNormalEmphasis(opt, 'labelLine');
    // treemap
    convertNormalEmphasis(opt, 'upperLabel');
    // graph
    convertNormalEmphasis(opt, 'edgeLabel');
}
function compatTextStyle(opt, propName) {
    // Check whether is not object (string\null\undefined ...)
    var labelOptSingle = isObject(opt) && opt[propName];
    var textStyle = isObject(labelOptSingle) && labelOptSingle.textStyle;
    if (textStyle) {
        if ("TURBOPACK compile-time truthy", 1) {
            // eslint-disable-next-line max-len
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateLog"])("textStyle hierarchy in " + propName + " has been removed since 4.0. All textStyle properties are configured in " + propName + " directly now.");
        }
        for(var i = 0, len = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TEXT_STYLE_OPTIONS"].length; i < len; i++){
            var textPropName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TEXT_STYLE_OPTIONS"][i];
            if (textStyle.hasOwnProperty(textPropName)) {
                labelOptSingle[textPropName] = textStyle[textPropName];
            }
        }
    }
}
function compatEC3CommonStyles(opt) {
    if (opt) {
        removeEC3NormalStatus(opt);
        compatTextStyle(opt, 'label');
        opt.emphasis && compatTextStyle(opt.emphasis, 'label');
    }
}
function processSeries(seriesOpt) {
    if (!isObject(seriesOpt)) {
        return;
    }
    compatEC2ItemStyle(seriesOpt);
    removeEC3NormalStatus(seriesOpt);
    compatTextStyle(seriesOpt, 'label');
    // treemap
    compatTextStyle(seriesOpt, 'upperLabel');
    // graph
    compatTextStyle(seriesOpt, 'edgeLabel');
    if (seriesOpt.emphasis) {
        compatTextStyle(seriesOpt.emphasis, 'label');
        // treemap
        compatTextStyle(seriesOpt.emphasis, 'upperLabel');
        // graph
        compatTextStyle(seriesOpt.emphasis, 'edgeLabel');
    }
    var markPoint = seriesOpt.markPoint;
    if (markPoint) {
        compatEC2ItemStyle(markPoint);
        compatEC3CommonStyles(markPoint);
    }
    var markLine = seriesOpt.markLine;
    if (markLine) {
        compatEC2ItemStyle(markLine);
        compatEC3CommonStyles(markLine);
    }
    var markArea = seriesOpt.markArea;
    if (markArea) {
        compatEC3CommonStyles(markArea);
    }
    var data = seriesOpt.data;
    // Break with ec3: if `setOption` again, there may be no `type` in option,
    // then the backward compat based on option type will not be performed.
    if (seriesOpt.type === 'graph') {
        data = data || seriesOpt.nodes;
        var edgeData = seriesOpt.links || seriesOpt.edges;
        if (edgeData && !__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTypedArray"](edgeData)) {
            for(var i = 0; i < edgeData.length; i++){
                compatEC3CommonStyles(edgeData[i]);
            }
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](seriesOpt.categories, function(opt) {
            removeEC3NormalStatus(opt);
        });
    }
    if (data && !__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTypedArray"](data)) {
        for(var i = 0; i < data.length; i++){
            compatEC3CommonStyles(data[i]);
        }
    }
    // mark point data
    markPoint = seriesOpt.markPoint;
    if (markPoint && markPoint.data) {
        var mpData = markPoint.data;
        for(var i = 0; i < mpData.length; i++){
            compatEC3CommonStyles(mpData[i]);
        }
    }
    // mark line data
    markLine = seriesOpt.markLine;
    if (markLine && markLine.data) {
        var mlData = markLine.data;
        for(var i = 0; i < mlData.length; i++){
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"](mlData[i])) {
                compatEC3CommonStyles(mlData[i][0]);
                compatEC3CommonStyles(mlData[i][1]);
            } else {
                compatEC3CommonStyles(mlData[i]);
            }
        }
    }
    // Series
    if (seriesOpt.type === 'gauge') {
        compatTextStyle(seriesOpt, 'axisLabel');
        compatTextStyle(seriesOpt, 'title');
        compatTextStyle(seriesOpt, 'detail');
    } else if (seriesOpt.type === 'treemap') {
        convertNormalEmphasis(seriesOpt.breadcrumb, 'itemStyle');
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](seriesOpt.levels, function(opt) {
            removeEC3NormalStatus(opt);
        });
    } else if (seriesOpt.type === 'tree') {
        removeEC3NormalStatus(seriesOpt.leaves);
    }
// sunburst starts from ec4, so it does not need to compat levels.
}
function toArr(o) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"](o) ? o : o ? [
        o
    ] : [];
}
function toObj(o) {
    return (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"](o) ? o[0] : o) || {};
}
function globalCompatStyle(option, isTheme) {
    each(toArr(option.series), function(seriesOpt) {
        isObject(seriesOpt) && processSeries(seriesOpt);
    });
    var axes = [
        'xAxis',
        'yAxis',
        'radiusAxis',
        'angleAxis',
        'singleAxis',
        'parallelAxis',
        'radar'
    ];
    isTheme && axes.push('valueAxis', 'categoryAxis', 'logAxis', 'timeAxis');
    each(axes, function(axisName) {
        each(toArr(option[axisName]), function(axisOpt) {
            if (axisOpt) {
                compatTextStyle(axisOpt, 'axisLabel');
                compatTextStyle(axisOpt.axisPointer, 'label');
            }
        });
    });
    each(toArr(option.parallel), function(parallelOpt) {
        var parallelAxisDefault = parallelOpt && parallelOpt.parallelAxisDefault;
        compatTextStyle(parallelAxisDefault, 'axisLabel');
        compatTextStyle(parallelAxisDefault && parallelAxisDefault.axisPointer, 'label');
    });
    each(toArr(option.calendar), function(calendarOpt) {
        convertNormalEmphasis(calendarOpt, 'itemStyle');
        compatTextStyle(calendarOpt, 'dayLabel');
        compatTextStyle(calendarOpt, 'monthLabel');
        compatTextStyle(calendarOpt, 'yearLabel');
    });
    // radar.name.textStyle
    each(toArr(option.radar), function(radarOpt) {
        compatTextStyle(radarOpt, 'name');
        // Use axisName instead of name because component has name property
        if (radarOpt.name && radarOpt.axisName == null) {
            radarOpt.axisName = radarOpt.name;
            delete radarOpt.name;
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateLog"])('name property in radar component has been changed to axisName');
            }
        }
        if (radarOpt.nameGap != null && radarOpt.axisNameGap == null) {
            radarOpt.axisNameGap = radarOpt.nameGap;
            delete radarOpt.nameGap;
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateLog"])('nameGap property in radar component has been changed to axisNameGap');
            }
        }
        if ("TURBOPACK compile-time truthy", 1) {
            each(radarOpt.indicator, function(indicatorOpt) {
                if (indicatorOpt.text) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deprecateReplaceLog"])('text', 'name', 'radar.indicator');
                }
            });
        }
    });
    each(toArr(option.geo), function(geoOpt) {
        if (isObject(geoOpt)) {
            compatEC3CommonStyles(geoOpt);
            each(toArr(geoOpt.regions), function(regionObj) {
                compatEC3CommonStyles(regionObj);
            });
        }
    });
    each(toArr(option.timeline), function(timelineOpt) {
        compatEC3CommonStyles(timelineOpt);
        convertNormalEmphasis(timelineOpt, 'label');
        convertNormalEmphasis(timelineOpt, 'itemStyle');
        convertNormalEmphasis(timelineOpt, 'controlStyle', true);
        var data = timelineOpt.data;
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"](data) && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](data, function(item) {
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"](item)) {
                convertNormalEmphasis(item, 'label');
                convertNormalEmphasis(item, 'itemStyle');
            }
        });
    });
    each(toArr(option.toolbox), function(toolboxOpt) {
        convertNormalEmphasis(toolboxOpt, 'iconStyle');
        each(toolboxOpt.feature, function(featureOpt) {
            convertNormalEmphasis(featureOpt, 'iconStyle');
        });
    });
    compatTextStyle(toObj(option.axisPointer), 'label');
    compatTextStyle(toObj(option.tooltip).axisPointer, 'label');
// Clean logs
// storedLogs = {};
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/processor/dataFilter.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
    "default",
    ()=>dataFilter
]);
function dataFilter(seriesType) {
    return {
        seriesType: seriesType,
        reset: function(seriesModel, ecModel) {
            var legendModels = ecModel.findComponents({
                mainType: 'legend'
            });
            if (!legendModels || !legendModels.length) {
                return;
            }
            var data = seriesModel.getData();
            data.filterSelf(function(idx) {
                var name = data.getName(idx);
                // If in any legend component the status is not selected.
                for(var i = 0; i < legendModels.length; i++){
                    // @ts-ignore FIXME: LegendModel
                    if (!legendModels[i].isSelected(name)) {
                        return false;
                    }
                }
                return true;
            });
        }
    };
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/processor/dataSample.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>dataSample
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
var samplers = {
    average: function(frame) {
        var sum = 0;
        var count = 0;
        for(var i = 0; i < frame.length; i++){
            if (!isNaN(frame[i])) {
                sum += frame[i];
                count++;
            }
        }
        // Return NaN if count is 0
        return count === 0 ? NaN : sum / count;
    },
    sum: function(frame) {
        var sum = 0;
        for(var i = 0; i < frame.length; i++){
            // Ignore NaN
            sum += frame[i] || 0;
        }
        return sum;
    },
    max: function(frame) {
        var max = -Infinity;
        for(var i = 0; i < frame.length; i++){
            frame[i] > max && (max = frame[i]);
        }
        // NaN will cause illegal axis extent.
        return isFinite(max) ? max : NaN;
    },
    min: function(frame) {
        var min = Infinity;
        for(var i = 0; i < frame.length; i++){
            frame[i] < min && (min = frame[i]);
        }
        // NaN will cause illegal axis extent.
        return isFinite(min) ? min : NaN;
    },
    // TODO
    // Median
    nearest: function(frame) {
        return frame[0];
    }
};
var indexSampler = function(frame) {
    return Math.round(frame.length / 2);
};
function dataSample(seriesType) {
    return {
        seriesType: seriesType,
        // FIXME:TS never used, so comment it
        // modifyOutputEnd: true,
        reset: function(seriesModel, ecModel, api) {
            var data = seriesModel.getData();
            var sampling = seriesModel.get('sampling');
            var coordSys = seriesModel.coordinateSystem;
            var count = data.count();
            // Only cartesian2d support down sampling. Disable it when there is few data.
            if (count > 10 && coordSys.type === 'cartesian2d' && sampling) {
                var baseAxis = coordSys.getBaseAxis();
                var valueAxis = coordSys.getOtherAxis(baseAxis);
                var extent = baseAxis.getExtent();
                var dpr = api.getDevicePixelRatio();
                // Coordinste system has been resized
                var size = Math.abs(extent[1] - extent[0]) * (dpr || 1);
                var rate = Math.round(count / size);
                if (isFinite(rate) && rate > 1) {
                    if (sampling === 'lttb') {
                        seriesModel.setData(data.lttbDownSample(data.mapDimension(valueAxis.dim), 1 / rate));
                    } else if (sampling === 'minmax') {
                        seriesModel.setData(data.minmaxDownSample(data.mapDimension(valueAxis.dim), 1 / rate));
                    }
                    var sampler = void 0;
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"])(sampling)) {
                        sampler = samplers[sampling];
                    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"])(sampling)) {
                        sampler = sampling;
                    }
                    if (sampler) {
                        // Only support sample the first dim mapped from value axis.
                        seriesModel.setData(data.downSample(data.mapDimension(valueAxis.dim), 1 / rate, sampler, indexSampler));
                    }
                }
            }
        }
    };
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/processor/dataStack.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dataStackStageHandler",
    ()=>dataStackStageHandler
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
;
;
;
var dataStackStageHandler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSimpleOverallStageHandler2"])(dataStack);
// (1) [Caution]: the logic is correct based on the premises:
//     data processing stage is blocked in stream.
//     See <module:echarts/stream/Scheduler#performDataProcessorTasks>
// (2) Only register once when import repeatedly.
//     Should be executed after series is filtered and before stack calculation.
function dataStack(ecModel) {
    var stackInfoMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
    ecModel.eachSeries(function(seriesModel) {
        var stack = seriesModel.get('stack');
        // Compatible: when `stack` is set as '', do not stack.
        if (stack) {
            var stackInfoList = stackInfoMap.get(stack) || stackInfoMap.set(stack, []);
            var data = seriesModel.getData();
            var stackInfo = {
                // Used for calculate axis extent automatically.
                // TODO: Type getCalculationInfo return more specific type?
                stackResultDimension: data.getCalculationInfo('stackResultDimension'),
                stackedOverDimension: data.getCalculationInfo('stackedOverDimension'),
                stackedDimension: data.getCalculationInfo('stackedDimension'),
                stackedByDimension: data.getCalculationInfo('stackedByDimension'),
                isStackedByIndex: data.getCalculationInfo('isStackedByIndex'),
                data: data,
                seriesModel: seriesModel
            };
            // If stacked on axis that do not support data stack.
            if (!stackInfo.stackedDimension || !(stackInfo.isStackedByIndex || stackInfo.stackedByDimension)) {
                return;
            }
            stackInfoList.push(stackInfo);
        }
    });
    // Process each stack group
    stackInfoMap.each(function(stackInfoList) {
        if (stackInfoList.length === 0) {
            return;
        }
        // Check if stack order needs to be reversed
        var firstSeries = stackInfoList[0].seriesModel;
        var stackOrder = firstSeries.get('stackOrder') || 'seriesAsc';
        if (stackOrder === 'seriesDesc') {
            stackInfoList.reverse();
        }
        // Set stackedOnSeries for each series in the final order
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(stackInfoList, function(stackInfo, index) {
            stackInfo.data.setCalculationInfo('stackedOnSeries', index > 0 ? stackInfoList[index - 1].seriesModel : null);
        });
        // Calculate stack values
        calculateStack(stackInfoList);
    });
}
function calculateStack(stackInfoList) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(stackInfoList, function(targetStackInfo, idxInStack) {
        var resultVal = [];
        var resultNaN = [
            NaN,
            NaN
        ];
        var dims = [
            targetStackInfo.stackResultDimension,
            targetStackInfo.stackedOverDimension
        ];
        var targetData = targetStackInfo.data;
        var isStackedByIndex = targetStackInfo.isStackedByIndex;
        var stackStrategy = targetStackInfo.seriesModel.get('stackStrategy') || 'samesign';
        // Should not write on raw data, because stack series model list changes
        // depending on legend selection.
        targetData.modify(dims, function(v0, v1, dataIndex) {
            var sum = targetData.get(targetStackInfo.stackedDimension, dataIndex);
            // Consider `connectNulls` of line area, if value is NaN, stackedOver
            // should also be NaN, to draw a appropriate belt area.
            if (isNaN(sum)) {
                return resultNaN;
            }
            var byValue;
            var stackedDataRawIndex;
            if (isStackedByIndex) {
                stackedDataRawIndex = targetData.getRawIndex(dataIndex);
            } else {
                byValue = targetData.get(targetStackInfo.stackedByDimension, dataIndex);
            }
            // If stackOver is NaN, chart view will render point on value start.
            var stackedOver = NaN;
            for(var j = idxInStack - 1; j >= 0; j--){
                var stackInfo = stackInfoList[j];
                // Has been optimized by inverted indices on `stackedByDimension`.
                if (!isStackedByIndex) {
                    stackedDataRawIndex = stackInfo.data.rawIndexOf(stackInfo.stackedByDimension, byValue);
                }
                if (stackedDataRawIndex >= 0) {
                    var val = stackInfo.data.getByRawIndex(stackInfo.stackResultDimension, stackedDataRawIndex);
                    // Considering positive stack, negative stack and empty data
                    if (stackStrategy === 'all' // single stack group
                     || stackStrategy === 'positive' && val > 0 || stackStrategy === 'negative' && val < 0 || stackStrategy === 'samesign' && sum >= 0 && val > 0 // All positive stack
                     || stackStrategy === 'samesign' && sum <= 0 && val < 0 // All negative stack
                    ) {
                        // The sum has to be very small to be affected by the
                        // floating arithmetic problem. An incorrect result will probably
                        // cause axis min/max to be filtered incorrectly.
                        sum = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addSafe"])(sum, val);
                        stackedOver = val;
                        break;
                    }
                }
            }
            resultVal[0] = sum;
            resultVal[1] = stackedOver;
            return resultVal;
        });
    });
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/processor/negativeDataFilter.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>negativeDataFilter
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
function negativeDataFilter(seriesType) {
    return {
        seriesType: seriesType,
        reset: function(seriesModel, ecModel) {
            var data = seriesModel.getData();
            data.filterSelf(function(idx) {
                // handle negative value condition
                var valueDim = data.mapDimension('value');
                var curValue = data.get(valueDim, idx);
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isNumber"])(curValue) && !isNaN(curValue) && curValue < 0) {
                    return false;
                }
                return true;
            });
        }
    };
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/renderer/installCanvasRenderer.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$canvas$2f$Painter$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/canvas/Painter.js [app-ssr] (ecmascript)");
;
function install(registers) {
    registers.registerPainter('canvas', __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$canvas$2f$Painter$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/renderer/installCanvasRenderer.js [app-ssr] (ecmascript) <export install as CanvasRenderer>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CanvasRenderer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$renderer$2f$installCanvasRenderer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["install"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$renderer$2f$installCanvasRenderer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/renderer/installCanvasRenderer.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/theme/dark.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/tokens.js [app-ssr] (ecmascript)");
;
var color = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].darkColor;
var backgroundColor = color.background;
var axisCommon = function() {
    return {
        axisLine: {
            lineStyle: {
                color: color.axisLine
            }
        },
        splitLine: {
            lineStyle: {
                color: color.axisSplitLine
            }
        },
        splitArea: {
            areaStyle: {
                color: [
                    color.backgroundTint,
                    color.backgroundTransparent
                ]
            }
        },
        minorSplitLine: {
            lineStyle: {
                color: color.axisMinorSplitLine
            }
        },
        axisLabel: {
            color: color.axisLabel
        },
        axisName: {}
    };
};
var matrixAxis = {
    label: {
        color: color.secondary
    },
    itemStyle: {
        borderColor: color.borderTint
    },
    dividerLineStyle: {
        color: color.border
    }
};
var theme = {
    darkMode: true,
    color: color.theme,
    backgroundColor: backgroundColor,
    axisPointer: {
        lineStyle: {
            color: color.border
        },
        crossStyle: {
            color: color.borderShade
        },
        label: {
            color: color.tertiary
        }
    },
    legend: {
        textStyle: {
            color: color.secondary
        },
        pageTextStyle: {
            color: color.tertiary
        }
    },
    textStyle: {
        color: color.secondary
    },
    title: {
        textStyle: {
            color: color.primary
        },
        subtextStyle: {
            color: color.quaternary
        }
    },
    toolbox: {
        iconStyle: {
            borderColor: color.accent50
        },
        feature: {
            dataView: {
                backgroundColor: backgroundColor,
                textColor: color.primary,
                textareaColor: color.background,
                textareaBorderColor: color.border,
                buttonColor: color.accent50,
                buttonTextColor: color.neutral00
            }
        }
    },
    tooltip: {
        backgroundColor: color.neutral20,
        defaultBorderColor: color.border,
        textStyle: {
            color: color.tertiary
        }
    },
    dataZoom: {
        borderColor: color.accent10,
        textStyle: {
            color: color.tertiary
        },
        brushStyle: {
            color: color.backgroundTint
        },
        handleStyle: {
            color: color.neutral00,
            borderColor: color.accent20
        },
        moveHandleStyle: {
            color: color.accent40
        },
        emphasis: {
            handleStyle: {
                borderColor: color.accent50
            }
        },
        dataBackground: {
            lineStyle: {
                color: color.accent30
            },
            areaStyle: {
                color: color.accent20
            }
        },
        selectedDataBackground: {
            lineStyle: {
                color: color.accent50
            },
            areaStyle: {
                color: color.accent30
            }
        }
    },
    visualMap: {
        textStyle: {
            color: color.secondary
        },
        handleStyle: {
            borderColor: color.neutral30
        }
    },
    timeline: {
        lineStyle: {
            color: color.accent10
        },
        label: {
            color: color.tertiary
        },
        controlStyle: {
            color: color.accent30,
            borderColor: color.accent30
        }
    },
    calendar: {
        itemStyle: {
            color: color.neutral00,
            borderColor: color.neutral20
        },
        dayLabel: {
            color: color.tertiary
        },
        monthLabel: {
            color: color.secondary
        },
        yearLabel: {
            color: color.secondary
        }
    },
    matrix: {
        x: matrixAxis,
        y: matrixAxis,
        backgroundColor: {
            borderColor: color.axisLine
        },
        body: {
            itemStyle: {
                borderColor: color.borderTint
            }
        }
    },
    timeAxis: axisCommon(),
    logAxis: axisCommon(),
    valueAxis: axisCommon(),
    categoryAxis: axisCommon(),
    line: {
        symbol: 'circle'
    },
    graph: {
        color: color.theme
    },
    gauge: {
        title: {
            color: color.secondary
        },
        axisLine: {
            lineStyle: {
                color: [
                    [
                        1,
                        color.neutral05
                    ]
                ]
            }
        },
        axisLabel: {
            color: color.axisLabel
        },
        detail: {
            color: color.primary
        }
    },
    candlestick: {
        itemStyle: {
            color: '#f64e56',
            color0: '#54ea92',
            borderColor: '#f64e56',
            borderColor0: '#54ea92'
        }
    },
    funnel: {
        itemStyle: {
            borderColor: color.background
        }
    },
    radar: function() {
        var radar = axisCommon();
        radar.axisName = {
            color: color.axisLabel
        };
        radar.axisLine.lineStyle.color = color.neutral20;
        return radar;
    }(),
    treemap: {
        breadcrumb: {
            itemStyle: {
                color: color.neutral20,
                textStyle: {
                    color: color.secondary
                }
            },
            emphasis: {
                itemStyle: {
                    color: color.neutral30
                }
            }
        }
    },
    sunburst: {
        itemStyle: {
            borderColor: color.background
        }
    },
    map: {
        itemStyle: {
            borderColor: color.border,
            areaColor: color.neutral10
        },
        label: {
            color: color.tertiary
        },
        emphasis: {
            label: {
                color: color.primary
            },
            itemStyle: {
                areaColor: color.highlight
            }
        },
        select: {
            label: {
                color: color.primary
            },
            itemStyle: {
                areaColor: color.highlight
            }
        }
    },
    geo: {
        itemStyle: {
            borderColor: color.border,
            areaColor: color.neutral10
        },
        emphasis: {
            label: {
                color: color.primary
            },
            itemStyle: {
                areaColor: color.highlight
            }
        },
        select: {
            label: {
                color: color.primary
            },
            itemStyle: {
                color: color.highlight
            }
        }
    }
};
theme.categoryAxis.splitLine.show = false;
const __TURBOPACK__default__export__ = theme;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/view/Chart.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Group.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/component.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/clazz.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/states.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$task$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/task.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createRenderPlanner$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/chart/helper/createRenderPlanner.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/graphic.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-ssr] (ecmascript)");
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
var inner = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeInner"]();
var renderPlanner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$chart$2f$helper$2f$createRenderPlanner$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])();
var ChartView = /** @class */ function() {
    function ChartView() {
        this.group = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]();
        this.uid = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUID"]('viewChart');
        this.renderTask = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$core$2f$task$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createTask"])({
            plan: renderTaskPlan,
            reset: renderTaskReset
        });
        this.renderTask.context = {
            view: this
        };
    }
    ChartView.prototype.init = function(ecModel, api) {};
    ChartView.prototype.render = function(seriesModel, ecModel, api, payload) {
        if ("TURBOPACK compile-time truthy", 1) {
            throw new Error('render method must been implemented');
        }
    };
    /**
   * Highlight series or specified data item.
   */ ChartView.prototype.highlight = function(seriesModel, ecModel, api, payload) {
        var data = seriesModel.getData(payload && payload.dataType);
        if (!data) {
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["error"])("Unknown dataType " + payload.dataType);
            }
            return;
        }
        toggleHighlight(data, payload, 'emphasis');
    };
    /**
   * Downplay series or specified data item.
   */ ChartView.prototype.downplay = function(seriesModel, ecModel, api, payload) {
        var data = seriesModel.getData(payload && payload.dataType);
        if (!data) {
            if ("TURBOPACK compile-time truthy", 1) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["error"])("Unknown dataType " + payload.dataType);
            }
            return;
        }
        toggleHighlight(data, payload, 'normal');
    };
    /**
   * `remove` only occurs when series is filtered out, typically by legend.
   * And theirafter the view can only be rendered again via
   * `ChartView['render']` or `ChartView['incrementalPrepareRender']`.
   */ ChartView.prototype.remove = function(ecModel, api) {
        this.group.removeAll();
    };
    /**
   * Dispose self.
   */ ChartView.prototype.dispose = function(ecModel, api) {};
    ChartView.prototype.updateView = function(seriesModel, ecModel, api, payload) {
        this.render(seriesModel, ecModel, api, payload);
    };
    // FIXME never used?
    // updateLayout(seriesModel: SeriesModel, ecModel: GlobalModel, api: ExtensionAPI, payload: Payload): void {
    //     this.render(seriesModel, ecModel, api, payload);
    // }
    // FIXME never used?
    ChartView.prototype.updateVisual = function(seriesModel, ecModel, api, payload) {
        this.render(seriesModel, ecModel, api, payload);
    };
    /**
   * Traverse the new rendered elements.
   *
   * It will traverse the new added element in progressive rendering.
   * And traverse all in normal rendering.
   */ ChartView.prototype.eachRendered = function(cb) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$graphic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["traverseElements"])(this.group, cb);
    };
    ChartView.markUpdateMethod = function(payload, methodName) {
        inner(payload).updateMethod = methodName;
    };
    ChartView.protoInitialize = function() {
        var proto = ChartView.prototype;
        proto.type = 'chart';
    }();
    return ChartView;
}();
;
/**
 * Set state of single element
 */ function elSetState(el, state, highlightDigit) {
    if (el && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isHighDownDispatcher"])(el)) {
        (state === 'emphasis' ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["enterEmphasis"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["leaveEmphasis"])(el, highlightDigit);
    }
}
function toggleHighlight(data, payload, state) {
    var dataIndex = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["queryDataIndex"](data, payload);
    var highlightDigit = payload && payload.highlightKey != null ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$states$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getHighlightDigit"])(payload.highlightKey) : null;
    if (dataIndex != null) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeToArray"](dataIndex), function(dataIdx) {
            elSetState(data.getItemGraphicEl(dataIdx), state, highlightDigit);
        });
    } else {
        // In progressive mode, `data._graphicEls` has typically no items,
        // thereby skipping this hover style changing.
        // PENDING: more robust approaches?
        data.eachItemGraphicEl(function(el) {
            elSetState(el, state, highlightDigit);
        });
    }
}
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["enableClassExtend"](ChartView, [
    'dispose'
]);
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["enableClassManagement"](ChartView);
function renderTaskPlan(context) {
    return renderPlanner(context.model);
}
function renderTaskReset(context) {
    var seriesModel = context.model;
    var ecModel = context.ecModel;
    var api = context.api;
    var payload = context.payload;
    // FIXME: remove updateView updateVisual
    var progressiveRender = seriesModel.pipelineContext.progressiveRender;
    var view = context.view;
    var updateMethod = payload && inner(payload).updateMethod;
    var methodName = progressiveRender ? 'incrementalPrepareRender' : updateMethod && view[updateMethod] ? updateMethod : 'render';
    if (methodName !== 'render') {
        view[methodName](seriesModel, ecModel, api, payload);
    }
    return progressMethodMap[methodName];
}
var progressMethodMap = {
    incrementalPrepareRender: {
        progress: function(params, context) {
            context.view.incrementalRender(params, context.model, context.ecModel, context.api, context.payload);
        }
    },
    render: {
        // Put view.render in `progress` to support appendData. But in this case
        // view.render should not be called in reset, otherwise it will be called
        // twise. Use `forceFirstProgress` to make sure that view.render is called
        // in any cases.
        forceFirstProgress: true,
        progress: function(params, context) {
            context.view.render(context.model, context.ecModel, context.api, context.payload);
        }
    }
};
const __TURBOPACK__default__export__ = ChartView;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/view/Component.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/graphic/Group.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/component.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/clazz.js [app-ssr] (ecmascript)");
;
;
;
var ComponentView = /** @class */ function() {
    function ComponentView() {
        this.group = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$graphic$2f$Group$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]();
        this.uid = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUID"]('viewComponent');
    }
    ComponentView.prototype.init = function(ecModel, api) {};
    ComponentView.prototype.render = function(model, ecModel, api, payload) {};
    ComponentView.prototype.dispose = function(ecModel, api) {};
    ComponentView.prototype.updateView = function(model, ecModel, api, payload) {
    // Do nothing;
    };
    ComponentView.prototype.updateLayout = function(model, ecModel, api, payload) {
    // Do nothing;
    };
    ComponentView.prototype.updateVisual = function(model, ecModel, api, payload) {
    // Do nothing;
    };
    /**
   * Hook for toggle blur target series.
   * Can be used in marker for blur or leave blur the markers
   */ ComponentView.prototype.toggleBlurSeries = function(seriesModels, isBlur, ecModel) {
    // Do nothing;
    };
    /**
   * Traverse the new rendered elements.
   *
   * It will traverse the new added element in progressive rendering.
   * And traverse all in normal rendering.
   */ ComponentView.prototype.eachRendered = function(cb) {
        var group = this.group;
        if (group) {
            group.traverse(cb);
        }
    };
    return ComponentView;
}();
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["enableClassExtend"](ComponentView);
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$clazz$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["enableClassManagement"](ComponentView);
const __TURBOPACK__default__export__ = ComponentView;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/LegendVisualProvider.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 * LegendVisualProvider is an bridge that pick encoded color from data and
 * provide to the legend component.
 */ var LegendVisualProvider = /** @class */ function() {
    function LegendVisualProvider(// Function to get data after filtered. It stores all the encoding info
    getDataWithEncodedVisual, // Function to get raw data before filtered.
    getRawData) {
        this._getDataWithEncodedVisual = getDataWithEncodedVisual;
        this._getRawData = getRawData;
    }
    LegendVisualProvider.prototype.getAllNames = function() {
        var rawData = this._getRawData();
        // We find the name from the raw data. In case it's filtered by the legend component.
        // Normally, the name can be found in rawData, but can't be found in filtered data will display as gray.
        return rawData.mapArray(rawData.getName);
    };
    LegendVisualProvider.prototype.containName = function(name) {
        var rawData = this._getRawData();
        return rawData.indexOfName(name) >= 0;
    };
    LegendVisualProvider.prototype.indexOfName = function(name) {
        // Only get data when necessary.
        // Because LegendVisualProvider constructor may be new in the stage that data is not prepared yet.
        // Invoking Series#getData immediately will throw an error.
        var dataWithEncodedVisual = this._getDataWithEncodedVisual();
        return dataWithEncodedVisual.indexOfName(name);
    };
    LegendVisualProvider.prototype.getItemVisual = function(dataIndex, key) {
        // Get encoded visual properties from final filtered data.
        var dataWithEncodedVisual = this._getDataWithEncodedVisual();
        return dataWithEncodedVisual.getItemVisual(dataIndex, key);
    };
    return LegendVisualProvider;
}();
const __TURBOPACK__default__export__ = LegendVisualProvider;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/VisualMapping.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$color$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/tool/color.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/number.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/log.js [app-ssr] (ecmascript)");
;
;
;
;
var each = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"];
var isObject = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"];
var CATEGORY_DEFAULT_VISUAL_INDEX = -1;
var VisualMapping = /** @class */ function() {
    function VisualMapping(option) {
        var mappingMethod = option.mappingMethod;
        var visualType = option.type;
        var thisOption = this.option = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clone"](option);
        this.type = visualType;
        this.mappingMethod = mappingMethod;
        this._normalizeData = normalizers[mappingMethod];
        var visualHandler = VisualMapping.visualHandlers[visualType];
        this.applyVisual = visualHandler.applyVisual;
        this.getColorMapper = visualHandler.getColorMapper;
        this._normalizedToVisual = visualHandler._normalizedToVisual[mappingMethod];
        if (mappingMethod === 'piecewise') {
            normalizeVisualRange(thisOption);
            preprocessForPiecewise(thisOption);
        } else if (mappingMethod === 'category') {
            thisOption.categories ? preprocessForSpecifiedCategory(thisOption) : normalizeVisualRange(thisOption, true);
        } else {
            // mappingMethod === 'linear' or 'fixed'
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assert"](mappingMethod !== 'linear' || thisOption.dataExtent);
            normalizeVisualRange(thisOption);
        }
    }
    VisualMapping.prototype.mapValueToVisual = function(value) {
        var normalized = this._normalizeData(value);
        return this._normalizedToVisual(normalized, value);
    };
    VisualMapping.prototype.getNormalizer = function() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bind"](this._normalizeData, this);
    };
    /**
   * List available visual types.
   *
   * @public
   * @return {Array.<string>}
   */ VisualMapping.listVisualTypes = function() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keys"](VisualMapping.visualHandlers);
    };
    // /**
    //  * @public
    //  */
    // static addVisualHandler(name, handler) {
    //     visualHandlers[name] = handler;
    // }
    /**
   * @public
   */ VisualMapping.isValidType = function(visualType) {
        return VisualMapping.visualHandlers.hasOwnProperty(visualType);
    };
    /**
   * Convenient method.
   * Visual can be Object or Array or primary type.
   */ VisualMapping.eachVisual = function(visual, callback, context) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"](visual)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](visual, callback, context);
        } else {
            callback.call(context, visual);
        }
    };
    VisualMapping.mapVisual = function(visual, callback, context) {
        var isPrimary;
        var newVisual = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"](visual) ? [] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"](visual) ? {} : (isPrimary = true, null);
        VisualMapping.eachVisual(visual, function(v, key) {
            var newVal = callback.call(context, v, key);
            isPrimary ? newVisual = newVal : newVisual[key] = newVal;
        });
        return newVisual;
    };
    /**
   * Retrieve visual properties from given object.
   */ VisualMapping.retrieveVisuals = function(obj) {
        var ret = {};
        var hasVisual;
        obj && each(VisualMapping.visualHandlers, function(h, visualType) {
            if (obj.hasOwnProperty(visualType)) {
                ret[visualType] = obj[visualType];
                hasVisual = true;
            }
        });
        return hasVisual ? ret : null;
    };
    /**
   * Give order to visual types, considering colorSaturation, colorAlpha depends on color.
   *
   * @public
   * @param {(Object|Array)} visualTypes If Object, like: {color: ..., colorSaturation: ...}
   *                                     IF Array, like: ['color', 'symbol', 'colorSaturation']
   * @return {Array.<string>} Sorted visual types.
   */ VisualMapping.prepareVisualTypes = function(visualTypes) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"](visualTypes)) {
            visualTypes = visualTypes.slice();
        } else if (isObject(visualTypes)) {
            var types_1 = [];
            each(visualTypes, function(item, type) {
                types_1.push(type);
            });
            visualTypes = types_1;
        } else {
            return [];
        }
        visualTypes.sort(function(type1, type2) {
            // color should be front of colorSaturation, colorAlpha, ...
            // symbol and symbolSize do not matter.
            return type2 === 'color' && type1 !== 'color' && type1.indexOf('color') === 0 ? 1 : -1;
        });
        return visualTypes;
    };
    /**
   * 'color', 'colorSaturation', 'colorAlpha', ... are depends on 'color'.
   * Other visuals are only depends on themself.
   */ VisualMapping.dependsOn = function(visualType1, visualType2) {
        return visualType2 === 'color' ? !!(visualType1 && visualType1.indexOf(visualType2) === 0) : visualType1 === visualType2;
    };
    /**
   * @param value
   * @param pieceList [{value: ..., interval: [min, max]}, ...]
   *                         Always from small to big.
   * @param findClosestWhenOutside Default to be false
   * @return index
   */ VisualMapping.findPieceIndex = function(value, pieceList, findClosestWhenOutside) {
        var possibleI;
        var abs = Infinity;
        // value has the higher priority.
        for(var i = 0, len = pieceList.length; i < len; i++){
            var pieceValue = pieceList[i].value;
            if (pieceValue != null) {
                if (pieceValue === value || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isString"](pieceValue) && pieceValue === value + '') {
                    return i;
                }
                findClosestWhenOutside && updatePossible(pieceValue, i);
            }
        }
        for(var i = 0, len = pieceList.length; i < len; i++){
            var piece = pieceList[i];
            var interval = piece.interval;
            var close_1 = piece.close;
            if (interval) {
                if (interval[0] === -Infinity) {
                    if (littleThan(close_1[1], value, interval[1])) {
                        return i;
                    }
                } else if (interval[1] === Infinity) {
                    if (littleThan(close_1[0], interval[0], value)) {
                        return i;
                    }
                } else if (littleThan(close_1[0], interval[0], value) && littleThan(close_1[1], value, interval[1])) {
                    return i;
                }
                findClosestWhenOutside && updatePossible(interval[0], i);
                findClosestWhenOutside && updatePossible(interval[1], i);
            }
        }
        if (findClosestWhenOutside) {
            return value === Infinity ? pieceList.length - 1 : value === -Infinity ? 0 : possibleI;
        }
        function updatePossible(val, index) {
            var newAbs = Math.abs(val - value);
            if (newAbs < abs) {
                abs = newAbs;
                possibleI = index;
            }
        }
    };
    VisualMapping.visualHandlers = {
        color: {
            applyVisual: makeApplyVisual('color'),
            getColorMapper: function() {
                var thisOption = this.option;
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bind"](thisOption.mappingMethod === 'category' ? function(value, isNormalized) {
                    !isNormalized && (value = this._normalizeData(value));
                    return doMapCategory.call(this, value);
                } : function(value, isNormalized, out) {
                    // If output rgb array
                    // which will be much faster and useful in pixel manipulation
                    var returnRGBArray = !!out;
                    !isNormalized && (value = this._normalizeData(value));
                    out = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$color$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fastLerp"](value, thisOption.parsedVisual, out);
                    return returnRGBArray ? out : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$color$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stringify"](out, 'rgba');
                }, this);
            },
            _normalizedToVisual: {
                linear: function(normalized) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$color$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stringify"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$color$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fastLerp"](normalized, this.option.parsedVisual), 'rgba');
                },
                category: doMapCategory,
                piecewise: function(normalized, value) {
                    var result = getSpecifiedVisual.call(this, value);
                    if (result == null) {
                        result = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$color$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stringify"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$color$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fastLerp"](normalized, this.option.parsedVisual), 'rgba');
                    }
                    return result;
                },
                fixed: doMapFixed
            }
        },
        colorHue: makePartialColorVisualHandler(function(color, value) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$color$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["modifyHSL"](color, value);
        }),
        colorSaturation: makePartialColorVisualHandler(function(color, value) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$color$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["modifyHSL"](color, null, value);
        }),
        colorLightness: makePartialColorVisualHandler(function(color, value) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$color$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["modifyHSL"](color, null, null, value);
        }),
        colorAlpha: makePartialColorVisualHandler(function(color, value) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$color$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["modifyAlpha"](color, value);
        }),
        decal: {
            applyVisual: makeApplyVisual('decal'),
            _normalizedToVisual: {
                linear: null,
                category: doMapCategory,
                piecewise: null,
                fixed: null
            }
        },
        opacity: {
            applyVisual: makeApplyVisual('opacity'),
            _normalizedToVisual: createNormalizedToNumericVisual([
                0,
                1
            ])
        },
        liftZ: {
            applyVisual: makeApplyVisual('liftZ'),
            _normalizedToVisual: {
                linear: doMapFixed,
                category: doMapFixed,
                piecewise: doMapFixed,
                fixed: doMapFixed
            }
        },
        symbol: {
            applyVisual: function(value, getter, setter) {
                var symbolCfg = this.mapValueToVisual(value);
                setter('symbol', symbolCfg);
            },
            _normalizedToVisual: {
                linear: doMapToArray,
                category: doMapCategory,
                piecewise: function(normalized, value) {
                    var result = getSpecifiedVisual.call(this, value);
                    if (result == null) {
                        result = doMapToArray.call(this, normalized);
                    }
                    return result;
                },
                fixed: doMapFixed
            }
        },
        symbolSize: {
            applyVisual: makeApplyVisual('symbolSize'),
            _normalizedToVisual: createNormalizedToNumericVisual([
                0,
                1
            ])
        }
    };
    return VisualMapping;
}();
function preprocessForPiecewise(thisOption) {
    var pieceList = thisOption.pieceList;
    thisOption.hasSpecialVisual = false;
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](pieceList, function(piece, index) {
        piece.originIndex = index;
        // piece.visual is "result visual value" but not
        // a visual range, so it does not need to be normalized.
        if (piece.visual != null) {
            thisOption.hasSpecialVisual = true;
        }
    });
}
function preprocessForSpecifiedCategory(thisOption) {
    // Hash categories.
    var categories = thisOption.categories;
    var categoryMap = thisOption.categoryMap = {};
    var visual = thisOption.visual;
    each(categories, function(cate, index) {
        categoryMap[cate] = index;
    });
    // Process visual map input.
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"](visual)) {
        var visualArr_1 = [];
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"](visual)) {
            each(visual, function(v, cate) {
                var index = categoryMap[cate];
                visualArr_1[index != null ? index : CATEGORY_DEFAULT_VISUAL_INDEX] = v;
            });
        } else {
            // Is primary type, represents default visual.
            visualArr_1[CATEGORY_DEFAULT_VISUAL_INDEX] = visual;
        }
        visual = setVisualToOption(thisOption, visualArr_1);
    }
    // Remove categories that has no visual,
    // then we can mapping them to CATEGORY_DEFAULT_VISUAL_INDEX.
    for(var i = categories.length - 1; i >= 0; i--){
        if (visual[i] == null) {
            delete categoryMap[categories[i]];
            categories.pop();
        }
    }
}
function normalizeVisualRange(thisOption, isCategory) {
    var visual = thisOption.visual;
    var visualArr = [];
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isObject"](visual)) {
        each(visual, function(v) {
            visualArr.push(v);
        });
    } else if (visual != null) {
        visualArr.push(visual);
    }
    var doNotNeedPair = {
        color: 1,
        symbol: 1
    };
    if (!isCategory && visualArr.length === 1 && !doNotNeedPair.hasOwnProperty(thisOption.type)) {
        // Do not care visualArr.length === 0, which is illegal.
        visualArr[1] = visualArr[0];
    }
    setVisualToOption(thisOption, visualArr);
}
function makePartialColorVisualHandler(applyValue) {
    return {
        applyVisual: function(value, getter, setter) {
            // Only used in HSL
            var colorChannel = this.mapValueToVisual(value);
            // Must not be array value
            setter('color', applyValue(getter('color'), colorChannel));
        },
        _normalizedToVisual: createNormalizedToNumericVisual([
            0,
            1
        ])
    };
}
function doMapToArray(normalized) {
    var visual = this.option.visual;
    return visual[Math.round((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["linearMap"])(normalized, [
        0,
        1
    ], [
        0,
        visual.length - 1
    ], true))] || {}; // TODO {}?
}
function makeApplyVisual(visualType) {
    return function(value, getter, setter) {
        setter(visualType, this.mapValueToVisual(value));
    };
}
function doMapCategory(normalized) {
    var visual = this.option.visual;
    return visual[this.option.loop && normalized !== CATEGORY_DEFAULT_VISUAL_INDEX ? normalized % visual.length : normalized];
}
function doMapFixed() {
    // visual will be convert to array.
    return this.option.visual[0];
}
/**
 * Create mapped to numeric visual
 */ function createNormalizedToNumericVisual(sourceExtent) {
    return {
        linear: function(normalized) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["linearMap"])(normalized, sourceExtent, this.option.visual, true);
        },
        category: doMapCategory,
        piecewise: function(normalized, value) {
            var result = getSpecifiedVisual.call(this, value);
            if (result == null) {
                result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["linearMap"])(normalized, sourceExtent, this.option.visual, true);
            }
            return result;
        },
        fixed: doMapFixed
    };
}
function getSpecifiedVisual(value) {
    var thisOption = this.option;
    var pieceList = thisOption.pieceList;
    if (thisOption.hasSpecialVisual) {
        var pieceIndex = VisualMapping.findPieceIndex(value, pieceList);
        var piece = pieceList[pieceIndex];
        if (piece && piece.visual) {
            return piece.visual[this.type];
        }
    }
}
function setVisualToOption(thisOption, visualArr) {
    thisOption.visual = visualArr;
    if (thisOption.type === 'color') {
        thisOption.parsedVisual = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["map"](visualArr, function(item) {
            var color = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$color$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parse"](item);
            if (!color && ("TURBOPACK compile-time value", "development") !== 'production') {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$log$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warn"])("'" + item + "' is an illegal color, fallback to '#000000'", true);
            }
            return color || [
                0,
                0,
                0,
                1
            ];
        });
    }
    return visualArr;
}
/**
 * Normalizers by mapping methods.
 */ var normalizers = {
    linear: function(value) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["linearMap"])(value, this.option.dataExtent, [
            0,
            1
        ], true);
    },
    piecewise: function(value) {
        var pieceList = this.option.pieceList;
        var pieceIndex = VisualMapping.findPieceIndex(value, pieceList, true);
        if (pieceIndex != null) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$number$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["linearMap"])(pieceIndex, [
                0,
                pieceList.length - 1
            ], [
                0,
                1
            ], true);
        }
    },
    category: function(value) {
        var index = this.option.categories ? this.option.categoryMap[value] : value; // ordinal value
        return index == null ? CATEGORY_DEFAULT_VISUAL_INDEX : index;
    },
    fixed: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"]
};
function littleThan(close, a, b) {
    return close ? a <= b : a < b;
}
const __TURBOPACK__default__export__ = VisualMapping;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/decal.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decalVisualStageHandler",
    ()=>decalVisualStageHandler
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
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$decal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/decal.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
;
;
var decalVisualStageHandler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSimpleOverallStageHandler2"])(decalVisual);
function decalVisual(ecModel, api) {
    ecModel.eachRawSeries(function(seriesModel) {
        if (ecModel.isSeriesFiltered(seriesModel)) {
            return;
        }
        var data = seriesModel.getData();
        if (data.hasItemVisual()) {
            data.each(function(idx) {
                var decal = data.getItemVisual(idx, 'decal');
                if (decal) {
                    var itemStyle = data.ensureUniqueItemVisual(idx, 'style');
                    itemStyle.decal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$decal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createOrUpdatePatternFromDecal"])(decal, api);
                }
            });
        }
        var decal = data.getVisual('decal');
        if (decal) {
            var style = data.getVisual('style');
            style.decal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$decal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createOrUpdatePatternFromDecal"])(decal, api);
        }
    });
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/helper.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
    "getItemVisualFromData",
    ()=>getItemVisualFromData,
    "getVisualFromData",
    ()=>getVisualFromData,
    "setItemVisualFromData",
    ()=>setItemVisualFromData
]);
function getItemVisualFromData(data, dataIndex, key) {
    switch(key){
        case 'color':
            var style = data.getItemVisual(dataIndex, 'style');
            return style[data.getVisual('drawType')];
        case 'opacity':
            return data.getItemVisual(dataIndex, 'style').opacity;
        case 'symbol':
        case 'symbolSize':
        case 'liftZ':
            return data.getItemVisual(dataIndex, key);
        default:
            if ("TURBOPACK compile-time truthy", 1) {
                console.warn("Unknown visual type " + key);
            }
    }
}
function getVisualFromData(data, key) {
    switch(key){
        case 'color':
            var style = data.getVisual('style');
            return style[data.getVisual('drawType')];
        case 'opacity':
            return data.getVisual('style').opacity;
        case 'symbol':
        case 'symbolSize':
        case 'liftZ':
            return data.getVisual(key);
        default:
            if ("TURBOPACK compile-time truthy", 1) {
                console.warn("Unknown visual type " + key);
            }
    }
}
function setItemVisualFromData(data, dataIndex, key, value) {
    switch(key){
        case 'color':
            // Make sure not sharing style object.
            var style = data.ensureUniqueItemVisual(dataIndex, 'style');
            style[data.getVisual('drawType')] = value;
            // Mark the color has been changed, not from palette anymore
            data.setItemVisual(dataIndex, 'colorFromPalette', false);
            break;
        case 'opacity':
            data.ensureUniqueItemVisual(dataIndex, 'style').opacity = value;
            break;
        case 'symbol':
        case 'symbolSize':
        case 'liftZ':
            data.setItemVisual(dataIndex, key, value);
            break;
        default:
            if ("TURBOPACK compile-time truthy", 1) {
                console.warn("Unknown visual type " + key);
            }
    }
}
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/style.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dataColorPaletteTask",
    ()=>dataColorPaletteTask,
    "dataStyleTask",
    ()=>dataStyleTask,
    "seriesStyleTask",
    ()=>seriesStyleTask
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$makeStyleMapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/mixin/makeStyleMapper.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$itemStyle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/mixin/itemStyle.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$lineStyle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/mixin/lineStyle.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/model/Model.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/util/model.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
var inner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$util$2f$model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeInner"])();
var defaultStyleMappers = {
    itemStyle: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$makeStyleMapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$itemStyle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ITEM_STYLE_KEY_MAP"], true),
    lineStyle: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$makeStyleMapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$mixin$2f$lineStyle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LINE_STYLE_KEY_MAP"], true)
};
var defaultColorKey = {
    lineStyle: 'stroke',
    itemStyle: 'fill'
};
function getStyleMapper(seriesModel, stylePath) {
    var styleMapper = seriesModel.visualStyleMapper || defaultStyleMappers[stylePath];
    if (!styleMapper) {
        console.warn("Unknown style type '" + stylePath + "'.");
        return defaultStyleMappers.itemStyle;
    }
    return styleMapper;
}
function getDefaultColorKey(seriesModel, stylePath) {
    // return defaultColorKey[stylePath] ||
    var colorKey = seriesModel.visualDrawType || defaultColorKey[stylePath];
    if (!colorKey) {
        console.warn("Unknown style type '" + stylePath + "'.");
        return 'fill';
    }
    return colorKey;
}
var seriesStyleTask = {
    createOnAllSeries: true,
    performRawSeries: true,
    reset: function(seriesModel, ecModel) {
        var data = seriesModel.getData();
        var stylePath = seriesModel.visualStyleAccessPath || 'itemStyle';
        // Set in itemStyle
        var styleModel = seriesModel.getModel(stylePath);
        var getStyle = getStyleMapper(seriesModel, stylePath);
        var globalStyle = getStyle(styleModel);
        var decalOption = styleModel.getShallow('decal');
        if (decalOption) {
            data.setVisual('decal', decalOption);
            decalOption.dirty = true;
        }
        // TODO
        var colorKey = getDefaultColorKey(seriesModel, stylePath);
        var color = globalStyle[colorKey];
        // TODO style callback
        var colorCallback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"])(color) ? color : null;
        var hasAutoColor = globalStyle.fill === 'auto' || globalStyle.stroke === 'auto';
        // Get from color palette by default.
        if (!globalStyle[colorKey] || colorCallback || hasAutoColor) {
            // Note: If some series has color specified (e.g., by itemStyle.color), we DO NOT
            // make it effect palette. Because some scenarios users need to make some series
            // transparent or as background, which should better not effect the palette.
            var colorPalette = seriesModel.getColorFromPalette(// TODO series count changed.
            seriesModel.name, null, ecModel.getSeriesCount());
            if (!globalStyle[colorKey]) {
                globalStyle[colorKey] = colorPalette;
                data.setVisual('colorFromPalette', true);
            }
            globalStyle.fill = globalStyle.fill === 'auto' || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"])(globalStyle.fill) ? colorPalette : globalStyle.fill;
            globalStyle.stroke = globalStyle.stroke === 'auto' || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"])(globalStyle.stroke) ? colorPalette : globalStyle.stroke;
        }
        data.setVisual('style', globalStyle);
        data.setVisual('drawType', colorKey);
        // Only visible series has each data be visual encoded
        if (!ecModel.isSeriesFiltered(seriesModel) && colorCallback) {
            data.setVisual('colorFromPalette', false);
            return {
                dataEach: function(data, idx) {
                    var dataParams = seriesModel.getDataParams(idx);
                    var itemStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"])({}, globalStyle);
                    itemStyle[colorKey] = colorCallback(dataParams);
                    data.setItemVisual(idx, 'style', itemStyle);
                }
            };
        }
    }
};
var sharedModel = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$model$2f$Model$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]();
var dataStyleTask = {
    createOnAllSeries: true,
    reset: function(seriesModel, ecModel) {
        if (seriesModel.ignoreStyleOnData) {
            return;
        }
        var data = seriesModel.getData();
        var stylePath = seriesModel.visualStyleAccessPath || 'itemStyle';
        // Set in itemStyle
        var getStyle = getStyleMapper(seriesModel, stylePath);
        var colorKey = data.getVisual('drawType');
        return {
            dataEach: data.hasItemOption ? function(data, idx) {
                // Not use getItemModel for performance considuration
                var rawItem = data.getRawDataItem(idx);
                if (rawItem && rawItem[stylePath]) {
                    sharedModel.option = rawItem[stylePath];
                    var style = getStyle(sharedModel);
                    var existsStyle = data.ensureUniqueItemVisual(idx, 'style');
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"])(existsStyle, style);
                    if (sharedModel.option.decal) {
                        data.setItemVisual(idx, 'decal', sharedModel.option.decal);
                        sharedModel.option.decal.dirty = true;
                    }
                    if (colorKey in style) {
                        data.setItemVisual(idx, 'colorFromPalette', false);
                    }
                }
            } : null
        };
    }
};
// Pick color from palette for the data which has not been set with color yet.
// Note: do not support stream rendering. No such cases yet.
var dataColorPaletteTask = {
    performRawSeries: true,
    overallReset: function(ecModel) {
        // Each type of series uses one scope.
        // Pie and funnel are using different scopes.
        var paletteScopeGroupByType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHashMap"])();
        ecModel.eachSeries(function(seriesModel) {
            if (!seriesModel.isColorBySeries()) {
                var key = seriesModel.type + '-' + seriesModel.getColorBy();
                inner(seriesModel).scope = paletteScopeGroupByType.get(key) || paletteScopeGroupByType.set(key, {});
            }
        });
        ecModel.eachSeries(function(seriesModel) {
            if (seriesModel.isColorBySeries()) {
                return;
            }
            var dataAll = seriesModel.getRawData();
            var idxMap = {};
            var data = seriesModel.getData();
            var colorScope = inner(seriesModel).scope;
            var stylePath = seriesModel.visualStyleAccessPath || 'itemStyle';
            var colorKey = getDefaultColorKey(seriesModel, stylePath);
            data.each(function(idx) {
                var rawIdx = data.getRawIndex(idx);
                idxMap[rawIdx] = idx;
            });
            // Iterate on data before filtered. To make sure color from palette can be
            // Consistent when toggling legend.
            dataAll.each(function(rawIdx) {
                var idx = idxMap[rawIdx];
                var fromPalette = data.getItemVisual(idx, 'colorFromPalette');
                // Get color from palette for each data only when the color is inherited from series color, which is
                // also picked from color palette. So following situation is not in the case:
                // 1. series.itemStyle.color is set
                // 2. color is encoded by visualMap
                if (fromPalette) {
                    var itemStyle = data.ensureUniqueItemVisual(idx, 'style');
                    var name_1 = dataAll.getName(rawIdx) || rawIdx + '';
                    var dataCount = dataAll.count();
                    itemStyle[colorKey] = seriesModel.getColorFromPalette(name_1, colorScope, dataCount);
                }
            });
        });
    }
};
;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/symbol.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dataSymbolTask",
    ()=>dataSymbolTask,
    "seriesSymbolTask",
    ()=>seriesSymbolTask
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
var SYMBOL_PROPS_WITH_CB = [
    'symbol',
    'symbolSize',
    'symbolRotate',
    'symbolOffset'
];
var SYMBOL_PROPS = SYMBOL_PROPS_WITH_CB.concat([
    'symbolKeepAspect'
]);
// Encoding visual for all series include which is filtered for legend drawing
var seriesSymbolTask = {
    createOnAllSeries: true,
    // For legend.
    performRawSeries: true,
    reset: function(seriesModel, ecModel) {
        var data = seriesModel.getData();
        if (seriesModel.legendIcon) {
            data.setVisual('legendIcon', seriesModel.legendIcon);
        }
        if (!seriesModel.hasSymbolVisual) {
            return;
        }
        var symbolOptions = {};
        var symbolOptionsCb = {};
        var hasCallback = false;
        for(var i = 0; i < SYMBOL_PROPS_WITH_CB.length; i++){
            var symbolPropName = SYMBOL_PROPS_WITH_CB[i];
            var val = seriesModel.get(symbolPropName);
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isFunction"])(val)) {
                hasCallback = true;
                symbolOptionsCb[symbolPropName] = val;
            } else {
                symbolOptions[symbolPropName] = val;
            }
        }
        symbolOptions.symbol = symbolOptions.symbol || seriesModel.defaultSymbol;
        data.setVisual((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"])({
            legendIcon: seriesModel.legendIcon || symbolOptions.symbol,
            symbolKeepAspect: seriesModel.get('symbolKeepAspect')
        }, symbolOptions));
        // Only visible series has each data be visual encoded
        if (ecModel.isSeriesFiltered(seriesModel)) {
            return;
        }
        var symbolPropsCb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keys"])(symbolOptionsCb);
        function dataEach(data, idx) {
            var rawValue = seriesModel.getRawValue(idx);
            var params = seriesModel.getDataParams(idx);
            for(var i = 0; i < symbolPropsCb.length; i++){
                var symbolPropName = symbolPropsCb[i];
                data.setItemVisual(idx, symbolPropName, symbolOptionsCb[symbolPropName](rawValue, params));
            }
        }
        return {
            dataEach: hasCallback ? dataEach : null
        };
    }
};
var dataSymbolTask = {
    createOnAllSeries: true,
    // For legend.
    performRawSeries: true,
    reset: function(seriesModel, ecModel) {
        if (!seriesModel.hasSymbolVisual) {
            return;
        }
        // Only visible series has each data be visual encoded
        if (ecModel.isSeriesFiltered(seriesModel)) {
            return;
        }
        var data = seriesModel.getData();
        function dataEach(data, idx) {
            var itemModel = data.getItemModel(idx);
            for(var i = 0; i < SYMBOL_PROPS.length; i++){
                var symbolPropName = SYMBOL_PROPS[i];
                var val = itemModel.getShallow(symbolPropName, true);
                if (val != null) {
                    data.setItemVisual(idx, symbolPropName, val);
                }
            }
        }
        return {
            dataEach: data.hasItemOption ? dataEach : null
        };
    }
};
;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/tokens.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$color$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/tool/color.js [app-ssr] (ecmascript)");
;
;
var tokens = {
    color: {},
    darkColor: {},
    size: {}
};
var color = tokens.color = {
    theme: [
        '#5070dd',
        '#b6d634',
        '#505372',
        '#ff994d',
        '#0ca8df',
        '#ffd10a',
        '#fb628b',
        '#785db0',
        '#3fbe95'
    ],
    neutral00: '#fff',
    neutral05: '#f4f7fd',
    neutral10: '#e8ebf0',
    neutral15: '#dbdee4',
    neutral20: '#cfd2d7',
    neutral25: '#c3c5cb',
    neutral30: '#b7b9be',
    neutral35: '#aaacb2',
    neutral40: '#9ea0a5',
    neutral45: '#929399',
    neutral50: '#86878c',
    neutral55: '#797b7f',
    neutral60: '#6d6e73',
    neutral65: '#616266',
    neutral70: '#54555a',
    neutral75: '#48494d',
    neutral80: '#3c3c41',
    neutral85: '#303034',
    neutral90: '#232328',
    neutral95: '#17171b',
    neutral99: '#000',
    accent05: '#eff1f9',
    accent10: '#e0e4f2',
    accent15: '#d0d6ec',
    accent20: '#c0c9e6',
    accent25: '#b1bbdf',
    accent30: '#a1aed9',
    accent35: '#91a0d3',
    accent40: '#8292cc',
    accent45: '#7285c6',
    accent50: '#6578ba',
    accent55: '#5c6da9',
    accent60: '#536298',
    accent65: '#4a5787',
    accent70: '#404c76',
    accent75: '#374165',
    accent80: '#2e3654',
    accent85: '#252b43',
    accent90: '#1b2032',
    accent95: '#121521',
    transparent: 'rgba(0,0,0,0)',
    highlight: 'rgba(255,231,130,0.8)'
};
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extend"])(color, {
    primary: color.neutral80,
    secondary: color.neutral70,
    tertiary: color.neutral60,
    quaternary: color.neutral50,
    disabled: color.neutral20,
    border: color.neutral30,
    borderTint: color.neutral20,
    borderShade: color.neutral40,
    background: color.neutral05,
    backgroundTint: 'rgba(234,237,245,0.5)',
    backgroundTransparent: 'rgba(255,255,255,0)',
    backgroundShade: color.neutral10,
    shadow: 'rgba(0,0,0,0.2)',
    shadowTint: 'rgba(129,130,136,0.2)',
    axisLine: color.neutral70,
    axisLineTint: color.neutral40,
    axisTick: color.neutral70,
    axisTickMinor: color.neutral60,
    axisLabel: color.neutral70,
    axisSplitLine: color.neutral15,
    axisMinorSplitLine: color.neutral05
});
for(var key in color){
    if (color.hasOwnProperty(key)) {
        var hex = color[key];
        if (key === 'theme') {
            // Don't modify theme colors.
            tokens.darkColor.theme = color.theme.slice();
        } else if (key === 'highlight') {
            tokens.darkColor.highlight = 'rgba(255,231,130,0.4)';
        } else if (key.indexOf('accent') === 0) {
            // Desaturate and lighten accent colors.
            tokens.darkColor[key] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$color$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["modifyHSL"])(hex, null, function(s) {
                return s * 0.5;
            }, function(l) {
                return Math.min(1, 1.3 - l);
            });
        } else {
            tokens.darkColor[key] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$tool$2f$color$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["modifyHSL"])(hex, null, function(s) {
                return s * 0.9;
            }, function(l) {
                return 1 - Math.pow(l, 1.5);
            });
        }
    }
}
tokens.size = {
    xxs: 2,
    xs: 5,
    s: 10,
    m: 15,
    l: 20,
    xl: 30,
    xxl: 40,
    xxxl: 50
};
const __TURBOPACK__default__export__ = tokens;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/visualDefault.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 * @file Visual mapping.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/tokens.js [app-ssr] (ecmascript)");
;
;
var visualDefault = {
    /**
   * @public
   */ get: function(visualType, key, isCategory) {
        var value = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clone"]((defaultOption[visualType] || {})[key]);
        return isCategory ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isArray"](value) ? value[value.length - 1] : value : value;
    }
};
var defaultOption = {
    color: {
        active: [
            '#006edd',
            '#e0ffff'
        ],
        inactive: [
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$tokens$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].color.transparent
        ]
    },
    colorHue: {
        active: [
            0,
            360
        ],
        inactive: [
            0,
            0
        ]
    },
    colorSaturation: {
        active: [
            0.3,
            1
        ],
        inactive: [
            0,
            0
        ]
    },
    colorLightness: {
        active: [
            0.9,
            0.5
        ],
        inactive: [
            0,
            0
        ]
    },
    colorAlpha: {
        active: [
            0.3,
            1
        ],
        inactive: [
            0,
            0
        ]
    },
    opacity: {
        active: [
            0.3,
            1
        ],
        inactive: [
            0,
            0
        ]
    },
    symbol: {
        active: [
            'circle',
            'roundRect',
            'diamond'
        ],
        inactive: [
            'none'
        ]
    },
    symbolSize: {
        active: [
            10,
            50
        ],
        inactive: [
            0,
            0
        ]
    }
};
const __TURBOPACK__default__export__ = visualDefault;
}),
"[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/visualSolution.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "applyVisual",
    ()=>applyVisual,
    "createVisualMappings",
    ()=>createVisualMappings,
    "incrementalApplyVisual",
    ()=>incrementalApplyVisual,
    "replaceVisualOption",
    ()=>replaceVisualOption
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
 * @file Visual solution, for consistent option specification.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zrender@6.1.0/node_modules/zrender/lib/core/util.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$VisualMapping$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/VisualMapping.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/visual/helper.js [app-ssr] (ecmascript)");
;
;
;
var each = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"];
function hasKeys(obj) {
    if (obj) {
        for(var name_1 in obj){
            if (obj.hasOwnProperty(name_1)) {
                return true;
            }
        }
    }
}
function createVisualMappings(option, stateList, supplementVisualOption) {
    var visualMappings = {};
    each(stateList, function(state) {
        var mappings = visualMappings[state] = createMappings();
        each(option[state], function(visualData, visualType) {
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$VisualMapping$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].isValidType(visualType)) {
                return;
            }
            var mappingOption = {
                type: visualType,
                visual: visualData
            };
            supplementVisualOption && supplementVisualOption(mappingOption, state);
            mappings[visualType] = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$VisualMapping$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](mappingOption);
            // Prepare a alpha for opacity, for some case that opacity
            // is not supported, such as rendering using gradient color.
            if (visualType === 'opacity') {
                mappingOption = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clone"](mappingOption);
                mappingOption.type = 'colorAlpha';
                mappings.__hidden.__alphaForOpacity = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$VisualMapping$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](mappingOption);
            }
        });
    });
    return visualMappings;
    //TURBOPACK unreachable
    ;
    function createMappings() {
        var Creater = function() {};
        // Make sure hidden fields will not be visited by
        // object iteration (with hasOwnProperty checking).
        Creater.prototype.__hidden = Creater.prototype;
        var obj = new Creater();
        return obj;
    }
}
function replaceVisualOption(thisOption, newOption, keys) {
    // Visual attributes merge is not supported, otherwise it
    // brings overcomplicated merge logic. See #2853. So if
    // newOption has anyone of these keys, all of these keys
    // will be reset. Otherwise, all keys remain.
    var has;
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](keys, function(key) {
        if (newOption.hasOwnProperty(key) && hasKeys(newOption[key])) {
            has = true;
        }
    });
    has && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](keys, function(key) {
        if (newOption.hasOwnProperty(key) && hasKeys(newOption[key])) {
            thisOption[key] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clone"](newOption[key]);
        } else {
            delete thisOption[key];
        }
    });
}
function applyVisual(stateList, visualMappings, data, getValueState, scope, dimension) {
    var visualTypesMap = {};
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](stateList, function(state) {
        var visualTypes = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$VisualMapping$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].prepareVisualTypes(visualMappings[state]);
        visualTypesMap[state] = visualTypes;
    });
    var dataIndex;
    function getVisual(key) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getItemVisualFromData"])(data, dataIndex, key);
    }
    function setVisual(key, value) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setItemVisualFromData"])(data, dataIndex, key, value);
    }
    if (dimension == null) {
        data.each(eachItem);
    } else {
        data.each([
            dimension
        ], eachItem);
    }
    function eachItem(valueOrIndex, index) {
        dataIndex = dimension == null ? valueOrIndex // First argument is index
         : index;
        var rawDataItem = data.getRawDataItem(dataIndex);
        // Consider performance
        // @ts-ignore
        if (rawDataItem && rawDataItem.visualMap === false) {
            return;
        }
        var valueState = getValueState.call(scope, valueOrIndex);
        var mappings = visualMappings[valueState];
        var visualTypes = visualTypesMap[valueState];
        for(var i = 0, len = visualTypes.length; i < len; i++){
            var type = visualTypes[i];
            mappings[type] && mappings[type].applyVisual(valueOrIndex, getVisual, setVisual);
        }
    }
}
function incrementalApplyVisual(stateList, visualMappings, getValueState, dim) {
    var visualTypesMap = {};
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zrender$40$6$2e$1$2e$0$2f$node_modules$2f$zrender$2f$lib$2f$core$2f$util$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["each"](stateList, function(state) {
        var visualTypes = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$VisualMapping$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].prepareVisualTypes(visualMappings[state]);
        visualTypesMap[state] = visualTypes;
    });
    return {
        progress: function progress(params, data) {
            var dimIndex;
            if (dim != null) {
                dimIndex = data.getDimensionIndex(dim);
            }
            function getVisual(key) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getItemVisualFromData"])(data, dataIndex, key);
            }
            function setVisual(key, value) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$echarts$40$6$2e$1$2e$0$2f$node_modules$2f$echarts$2f$lib$2f$visual$2f$helper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setItemVisualFromData"])(data, dataIndex, key, value);
            }
            var dataIndex;
            var store = data.getStore();
            while((dataIndex = params.next()) != null){
                var rawDataItem = data.getRawDataItem(dataIndex);
                // Consider performance
                // @ts-ignore
                if (rawDataItem && rawDataItem.visualMap === false) {
                    continue;
                }
                var value = dim != null ? store.get(dimIndex, dataIndex) : dataIndex;
                var valueState = getValueState(value);
                var mappings = visualMappings[valueState];
                var visualTypes = visualTypesMap[valueState];
                for(var i = 0, len = visualTypes.length; i < len; i++){
                    var type = visualTypes[i];
                    mappings[type] && mappings[type].applyVisual(value, getVisual, setVisual);
                }
            }
        }
    };
}
}),
];

//# sourceMappingURL=10pt_echarts_lib_0bwa8ld._.js.map