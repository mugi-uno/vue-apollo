"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var composition_api_1 = require("@vue/composition-api");
exports.DefaultApolloClient = Symbol('default-apollo-client');
exports.ApolloClients = Symbol('apollo-clients');
function useApolloClient(clientId) {
    var providedApolloClients = composition_api_1.inject(exports.ApolloClients, null);
    var providedApolloClient = composition_api_1.inject(exports.DefaultApolloClient, null);
    function resolveClient(clientId) {
        if (clientId === void 0) { clientId = null; }
        var resolvedClient;
        if (clientId) {
            if (!providedApolloClients) {
                throw new Error("No apolloClients injection found, tried to resolve '" + clientId + "' clientId");
            }
            resolvedClient = providedApolloClients[clientId];
        }
        else {
            clientId = 'default';
            if (providedApolloClients) {
                resolvedClient = providedApolloClients.default;
            }
            else {
                resolvedClient = providedApolloClient;
            }
        }
        if (!resolvedClient) {
            throw new Error("Apollo Client with id " + clientId + " not found");
        }
        return resolvedClient;
    }
    return {
        resolveClient: resolveClient,
        get client() {
            return resolveClient(clientId);
        }
    };
}
exports.useApolloClient = useApolloClient;
//# sourceMappingURL=useApolloClient.js.map