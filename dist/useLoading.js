"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var loadingTracking_1 = require("./util/loadingTracking");
var composition_api_1 = require("@vue/composition-api");
function useQueryLoading() {
    var tracking = loadingTracking_1.getCurrentTracking().tracking;
    return composition_api_1.computed(function () { return tracking.queries.value > 0; });
}
exports.useQueryLoading = useQueryLoading;
function useMutationLoading() {
    var tracking = loadingTracking_1.getCurrentTracking().tracking;
    return composition_api_1.computed(function () { return tracking.mutations.value > 0; });
}
exports.useMutationLoading = useMutationLoading;
function useSubscriptionLoading() {
    var tracking = loadingTracking_1.getCurrentTracking().tracking;
    return composition_api_1.computed(function () { return tracking.subscriptions.value > 0; });
}
exports.useSubscriptionLoading = useSubscriptionLoading;
function useGlobalQueryLoading() {
    var appTracking = loadingTracking_1.getAppTracking().appTracking;
    return composition_api_1.computed(function () { return appTracking.queries.value > 0; });
}
exports.useGlobalQueryLoading = useGlobalQueryLoading;
function useGlobalMutationLoading() {
    var appTracking = loadingTracking_1.getAppTracking().appTracking;
    return composition_api_1.computed(function () { return appTracking.mutations.value > 0; });
}
exports.useGlobalMutationLoading = useGlobalMutationLoading;
function useGlobalSubscriptionLoading() {
    var appTracking = loadingTracking_1.getAppTracking().appTracking;
    return composition_api_1.computed(function () { return appTracking.subscriptions.value > 0; });
}
exports.useGlobalSubscriptionLoading = useGlobalSubscriptionLoading;
//# sourceMappingURL=useLoading.js.map