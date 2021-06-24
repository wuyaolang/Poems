"use strict";
Vue.component("cc-pageview", {
    template: `
    <ui-prop
    v-prop="target.content"
    :multi-values="multi"
    ></ui-prop>
    
    <ui-prop
    v-prop="target.sizeMode"
    :multi-values="multi"
    ></ui-prop>
    
    <ui-prop
    v-prop="target.direction"
    :multi-values="multi"
    ></ui-prop>
    
    <ui-prop
    v-prop="target.scrollThreshold"
    :multi-values="multi"
    ></ui-prop>
    
    <ui-prop
    v-prop="target.autoPageTurningThreshold"
    :multi-values="multi"
    ></ui-prop>
    
    <ui-prop
    v-prop="target.inertia"
    :multi-values="multi"
    ></ui-prop>
    
    <ui-prop
    v-prop="target.brake"
    :multi-values="multi"
    ></ui-prop>
    
    <ui-prop
    v-prop="target.elastic"
    :multi-values="multi"
    ></ui-prop>
    
    <ui-prop
    v-prop="target.bounceDuration"
    :multi-values="multi"
    ></ui-prop>
    
    <ui-prop
    v-prop="target.indicator"
    :multi-values="multi"
    ></ui-prop>
    
    <ui-prop
    v-prop="target.pageTurningSpeed"
    :multi-values="multi"
    ></ui-prop>
    
    <ui-prop
    v-prop="target.pageTurningEventTiming"
    :multi-values="multi"
    ></ui-prop>
    
    <cc-array-prop :target.sync="target.pageEvents"></cc-array-prop>
    
    <ui-prop
    v-prop="target.cancelInnerEvents"
    :multi-values="multi"
    ></ui-prop>
    `,
    props: {
        target: {
            twoWay: !0,
            type: Object
        },
        multi: {
            type: Boolean
        }
    }
});