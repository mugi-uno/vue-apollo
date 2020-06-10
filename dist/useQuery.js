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
var composition_api_1 = require("@vue/composition-api");
var vue_1 = require("vue");
var throttle_debounce_1 = require("throttle-debounce");
var useApolloClient_1 = require("./useApolloClient");
var paramToRef_1 = require("./util/paramToRef");
var paramToReactive_1 = require("./util/paramToReactive");
var useEventHook_1 = require("./util/useEventHook");
var loadingTracking_1 = require("./util/loadingTracking");
function useQuery(document, variables, options) {
    // Is on server?
    var vm = composition_api_1.getCurrentInstance();
    var isServer = vm.$isServer;
    if (variables == null)
        variables = composition_api_1.ref();
    if (options == null)
        options = {};
    var documentRef = paramToRef_1.paramToRef(document);
    var variablesRef = paramToRef_1.paramToRef(variables);
    var optionsRef = paramToReactive_1.paramToReactive(options);
    // Result
    /**
     * Result from the query
     */
    var result = composition_api_1.ref();
    var resultEvent = useEventHook_1.useEventHook();
    var error = composition_api_1.ref(null);
    var errorEvent = useEventHook_1.useEventHook();
    // Loading
    /**
     * Indicates if a network request is pending
     */
    var loading = composition_api_1.ref(false);
    loadingTracking_1.trackQuery(loading);
    var networkStatus = composition_api_1.ref();
    // SSR
    var firstResolve;
    var firstReject;
    composition_api_1.onServerPrefetch(function () { return new Promise(function (resolve, reject) {
        firstResolve = resolve;
        firstReject = reject;
    }).then(stop).catch(stop); });
    // Apollo Client
    var resolveClient = useApolloClient_1.useApolloClient().resolveClient;
    // Query
    var query = composition_api_1.ref();
    var observer;
    var started = false;
    /**
     * Starts watching the query
     */
    function start() {
        if (started || !isEnabled.value)
            return;
        if (isServer && currentOptions.value.prefetch === false)
            return;
        started = true;
        loading.value = true;
        var client = resolveClient(currentOptions.value.clientId);
        query.value = client.watchQuery(__assign(__assign({ query: currentDocument, variables: currentVariables }, currentOptions.value), isServer ? {
            fetchPolicy: 'network-only'
        } : {}));
        startQuerySubscription();
        if (!isServer && (currentOptions.value.fetchPolicy !== 'no-cache' || currentOptions.value.notifyOnNetworkStatusChange)) {
            var currentResult = query.value.getCurrentResult();
            if (!currentResult.loading || currentOptions.value.notifyOnNetworkStatusChange) {
                onNextResult(currentResult);
            }
        }
        if (!isServer) {
            for (var _i = 0, subscribeToMoreItems_1 = subscribeToMoreItems; _i < subscribeToMoreItems_1.length; _i++) {
                var item = subscribeToMoreItems_1[_i];
                addSubscribeToMore(item);
            }
        }
    }
    function startQuerySubscription() {
        if (observer && !observer.closed)
            return;
        if (!query.value)
            return;
        // Create subscription
        observer = query.value.subscribe({
            next: onNextResult,
            error: onError,
        });
    }
    function onNextResult(queryResult) {
        processNextResult(queryResult);
        // Result errors
        // This is set when `errorPolicy` is `all`
        if (queryResult.errors && queryResult.errors.length) {
            var e = new Error("GraphQL error: " + queryResult.errors.map(function (e) { return e.message; }).join(' | '));
            Object.assign(e, {
                graphQLErrors: queryResult.errors,
                networkError: null,
            });
            processError(e);
        }
        else {
            if (firstResolve) {
                firstResolve();
                firstResolve = null;
                stop();
            }
        }
    }
    function processNextResult(queryResult) {
        result.value = queryResult.data && Object.keys(queryResult.data).length === 0 ? null : queryResult.data;
        loading.value = queryResult.loading;
        networkStatus.value = queryResult.networkStatus;
        resultEvent.trigger(queryResult);
    }
    function onError(queryError) {
        processNextResult(query.value.getCurrentResult());
        processError(queryError);
        if (firstReject) {
            firstReject(queryError);
            firstReject = null;
            stop();
        }
        // The observable closes the sub if an error occurs
        resubscribeToQuery();
    }
    function processError(queryError) {
        error.value = queryError;
        loading.value = false;
        networkStatus.value = 8;
        errorEvent.trigger(queryError);
    }
    function resubscribeToQuery() {
        if (!query.value)
            return;
        var lastError = query.value.getLastError();
        var lastResult = query.value.getLastResult();
        query.value.resetLastResults();
        startQuerySubscription();
        Object.assign(query.value, { lastError: lastError, lastResult: lastResult });
    }
    var onStopHandlers = [];
    /**
     * Stop watching the query
     */
    function stop() {
        if (!started)
            return;
        started = false;
        loading.value = false;
        onStopHandlers.forEach(function (handler) { return handler(); });
        onStopHandlers = [];
        if (query.value) {
            query.value.stopPolling();
            query.value = null;
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
    var isRestartDebounceSetup = false;
    function updateRestartFn() {
        // On server, will be called before currentOptions is initialized
        // @TODO investigate
        if (!currentOptions) {
            debouncedRestart = baseRestart;
        }
        else {
            if (currentOptions.value.throttle) {
                debouncedRestart = throttle_debounce_1.throttle(currentOptions.value.throttle, baseRestart);
            }
            else if (currentOptions.value.debounce) {
                debouncedRestart = throttle_debounce_1.debounce(currentOptions.value.debounce, baseRestart);
            }
            else {
                debouncedRestart = baseRestart;
            }
            isRestartDebounceSetup = true;
        }
    }
    function restart() {
        if (!isRestartDebounceSetup)
            updateRestartFn();
        debouncedRestart();
    }
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
    // Fefetch
    function refetch(variables) {
        if (variables === void 0) { variables = null; }
        if (query.value) {
            if (variables) {
                currentVariables = variables;
            }
            return query.value.refetch(variables);
        }
    }
    // Fetch more
    function fetchMore(options) {
        if (query.value) {
            return query.value.fetchMore(options);
        }
    }
    // Subscribe to more
    var subscribeToMoreItems = [];
    function subscribeToMore(options) {
        if (isServer)
            return;
        var optionsRef = paramToRef_1.paramToRef(options);
        composition_api_1.watch(optionsRef, function (value, oldValue, onCleanup) {
            var index = subscribeToMoreItems.findIndex(function (item) { return item.options === oldValue; });
            if (index !== -1) {
                subscribeToMoreItems.splice(index, 1);
            }
            var item = {
                options: value,
                unsubscribeFns: [],
            };
            subscribeToMoreItems.push(item);
            addSubscribeToMore(item);
            onCleanup(function () {
                item.unsubscribeFns.forEach(function (fn) { return fn(); });
                item.unsubscribeFns = [];
            });
        }, {
            immediate: true
        });
    }
    function addSubscribeToMore(item) {
        if (!started)
            return;
        var unsubscribe = query.value.subscribeToMore(item.options);
        onStopHandlers.push(unsubscribe);
        item.unsubscribeFns.push(unsubscribe);
    }
    // Internal enabled returned to user
    // @TODO Doesn't fully work yet, need to initialize with option
    // const enabled = ref<boolean>()
    var enabledOption = composition_api_1.computed(function () { return !currentOptions.value || currentOptions.value.enabled == null || currentOptions.value.enabled; });
    // const isEnabled = computed(() => !!((typeof enabled.value !== 'boolean' || enabled.value) && enabledOption.value))
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
    composition_api_1.onBeforeUnmount(function () {
        stop();
        subscribeToMoreItems.length = 0;
    });
    return {
        result: result,
        loading: loading,
        networkStatus: networkStatus,
        error: error,
        // @TODO doesn't fully work yet
        // enabled,
        start: start,
        stop: stop,
        restart: restart,
        document: documentRef,
        variables: variablesRef,
        options: optionsRef,
        query: query,
        refetch: refetch,
        fetchMore: fetchMore,
        subscribeToMore: subscribeToMore,
        onResult: resultEvent.on,
        onError: errorEvent.on,
    };
}
exports.useQuery = useQuery;
//# sourceMappingURL=useQuery.js.map