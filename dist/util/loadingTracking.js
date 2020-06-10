"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var composition_api_1 = require("@vue/composition-api");
function getAppTracking() {
    var root = composition_api_1.getCurrentInstance().$root;
    var appTracking;
    if (!root._apolloAppTracking) {
        // Add per Vue tracking
        appTracking = root._apolloAppTracking = {
            queries: composition_api_1.ref(0),
            mutations: composition_api_1.ref(0),
            subscriptions: composition_api_1.ref(0),
            components: new Map(),
        };
    }
    else {
        appTracking = root._apolloAppTracking;
    }
    return {
        appTracking: appTracking
    };
}
exports.getAppTracking = getAppTracking;
function getCurrentTracking() {
    var appTracking = getAppTracking().appTracking;
    var currentInstance = composition_api_1.getCurrentInstance();
    var tracking;
    if (!appTracking.components.has(currentInstance)) {
        // Add per-component tracking
        appTracking.components.set(currentInstance, tracking = {
            queries: composition_api_1.ref(0),
            mutations: composition_api_1.ref(0),
            subscriptions: composition_api_1.ref(0),
        });
        // Cleanup
        composition_api_1.onUnmounted(function () {
            appTracking.components.delete(currentInstance);
        });
    }
    else {
        tracking = appTracking.components.get(currentInstance);
    }
    return {
        appTracking: appTracking,
        tracking: tracking
    };
}
exports.getCurrentTracking = getCurrentTracking;
function track(loading, type) {
    var _a = getCurrentTracking(), appTracking = _a.appTracking, tracking = _a.tracking;
    composition_api_1.watch(loading, function (value, oldValue) {
        if (oldValue != null && value !== oldValue) {
            var mod = value ? 1 : -1;
            tracking[type].value += mod;
            appTracking[type].value += mod;
        }
    }, {
        immediate: true
    });
    composition_api_1.onBeforeUnmount(function () {
        if (loading.value) {
            tracking[type].value--;
            appTracking[type].value--;
        }
    });
}
function trackQuery(loading) {
    track(loading, 'queries');
}
exports.trackQuery = trackQuery;
function trackMutation(loading) {
    track(loading, 'mutations');
}
exports.trackMutation = trackMutation;
function trackSubscription(loading) {
    track(loading, 'subscriptions');
}
exports.trackSubscription = trackSubscription;
//# sourceMappingURL=loadingTracking.js.map