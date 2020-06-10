import ApolloClient from 'apollo-client';
export declare const DefaultApolloClient: unique symbol;
export declare const ApolloClients: unique symbol;
export interface UseApolloClientReturn<TCacheShape> {
    resolveClient: (clientId?: string) => ApolloClient<TCacheShape>;
    readonly client: ApolloClient<TCacheShape>;
}
export declare function useApolloClient<TCacheShape = any>(clientId?: string): UseApolloClientReturn<TCacheShape>;
