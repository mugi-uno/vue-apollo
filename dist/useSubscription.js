"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var composition_api_1 = require("@vue/composition-api");
var throttle_debounce_1 = require("throttle-debounce");
var paramToRef_1 = require("./util/paramToRef");
var paramToReactive_1 = require("./util/paramToReactive");
var useApolloClient_1 = require("./useApolloClient");
var useEventHook_1 = require("./util/useEventHook");
var loadingTracking_1 = require("./util/loadingTracking");
function useSubscription(document, variables, options) {
    if (variables === void 0) { variables = null; }
    if (options === void 0) { options = null; }
    // Is on server?
    var vm = composition_api_1.getCurrentInstance();
    var isServer = vm.$isServer;
    if (variables == null)
        variables = composition_api_1.ref();
    if (!options)
        options = {};
    var documentRef = paramToRef_1.paramToRef(document);
    var variablesRef = paramToRef_1.paramToRef(variables);
    var optionsRef = paramToReactive_1.paramToReactive(options);
    var result = composition_api_1.ref();
    var resultEvent = useEventHook_1.useEventHook();
    var error = composition_api_1.ref(null);
    var errorEvent = useEventHook_1.useEventHook();
    var loading = composition_api_1.ref(false);
    loadingTracking_1.trackSubscription(loading);
    // Apollo Client
    var resolveClient = useApolloClient_1.useApolloClient().resolveClient;
    var subscription = composition_api_1.ref();
    var observer;
    var started = false;
    function start() {
        if (started || !isEnabled.value || isServer)
            return;
        started = true;
        loading.value = true;
        var client = resolveClient(currentOptions.value.clientId);
        subscription.value = client.subscribe(__assign({ query: currentDocument, variables: currentVariables }, currentOptions.value));
        observer = subscription.value.subscribe({
            next: onNextResult,
            error: onError,
        });
    }
    function onNextResult(fetchResult) {
        result.value = fetchResult.data;
        loading.value = false;
        resultEvent.trigger(fetchResult);
    }
    function onError(fetchError) {
        error.value = fetchError;
        loading.value = false;
        errorEvent.trigger(fetchError);
    }
    function stop() {
        if (!started)
            return;
        started = false;
        loading.value = false;
        if (subscription.value) {
            subscription.value = null;
        }
        if (observer) {
            observer.unsubscribe();
            observer = null;
        }
    }
    // Restart
    var restarting = false;
    /**
     * Queue a restart of the query (on next tick) if it is already active
     */
    function baseRestart() {
        if (!started || restarting)
            return;
        restarting = true;
        vue_1.default.nextTick(function () {
            if (started) {
                stop();
                start();
            }
            restarting = false;
        });
    }
    var debouncedRestart;
    function updateRestartFn() {
        if (currentOptions.value.throttle) {
            debouncedRestart = throttle_debounce_1.throttle(currentOptions.value.throttle, baseRestart);
        }
        else if (currentOptions.value.debounce) {
            debouncedRestart = throttle_debounce_1.debounce(currentOptions.value.debounce, baseRestart);
        }
        else {
            debouncedRestart = baseRestart;
        }
    }
    function restart() {
        if (!debouncedRestart)
            updateRestartFn();
        debouncedRestart();
    }
    // Applying options
    var currentOptions = composition_api_1.ref();
    composition_api_1.watch(function () { return composition_api_1.isRef(optionsRef) ? optionsRef.value : optionsRef; }, function (value) {
        if (currentOptions.value && (currentOptions.value.throttle !== value.throttle ||
            currentOptions.value.debounce !== value.debounce)) {
            updateRestartFn();
        }
        currentOptions.value = value;
        restart();
    }, {
        deep: true,
        immediate: true
    });
    // Applying document
    var currentDocument;
    composition_api_1.watch(documentRef, function (value) {
        currentDocument = value;
        restart();
    }, {
        immediate: true
    });
    // Applying variables
    var currentVariables;
    var currentVariablesSerialized;
    composition_api_1.watch(variablesRef, function (value, oldValue) {
        var serialized = JSON.stringify(value);
        if (serialized !== currentVariablesSerialized) {
            currentVariables = value;
            restart();
        }
        currentVariablesSerialized = serialized;
    }, {
        deep: true,
        immediate: true
    });
    // Internal enabled returned to user
    // @TODO Doesn't fully work yet, need to initialize with option
    // const enabled = ref<boolean>()
    var enabledOption = composition_api_1.computed(function () { return !currentOptions.value || currentOptions.value.enabled == null || currentOptions.value.enabled; });
    // const isEnabled = computed(() => !!((typeof enabled.value === 'boolean' && enabled.value) && enabledOption.value))
    var isEnabled = enabledOption;
    // watch(enabled, value => {
    //   if (value == null) {
    //     enabled.value = enabledOption.value
    //   }
    // })
    // Auto start & stop
    composition_api_1.watch(isEnabled, function (value) {
        if (value) {
            start();
        }
        else {
            stop();
        }
    }, {
        immediate: true
    });
    // Teardown
    composition_api_1.onBeforeUnmount(stop);
    return {
        result: result,
        loading: loading,
        error: error,
        // @TODO doesn't fully work yet
        // enabled,
        start: start,
        stop: stop,
        restart: restart,
        document: documentRef,
        variables: variablesRef,
        options: optionsRef,
        subscription: subscription,
        onResult: resultEvent.on,
        onError: errorEvent.on,
    };
}
exports.useSubscription = useSubscription;
//# sourceMappingURL=useSubscription.js.map