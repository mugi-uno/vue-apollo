import { Ref } from '@vue/composition-api';
import { DocumentNode } from 'graphql';
import { OperationVariables, WatchQueryOptions, ObservableQuery, ApolloQueryResult, SubscribeToMoreOptions, FetchMoreQueryOptions, FetchMoreOptions } from 'apollo-client';
import { ReactiveFunction } from './util/ReactiveFunction';
export interface UseQueryOptions<TResult = any, TVariables = OperationVariables> extends Omit<WatchQueryOptions<TVariables>, 'query' | 'variables'> {
    clientId?: string;
    enabled?: boolean;
    throttle?: number;
    debounce?: number;
    prefetch?: boolean;
}
export interface UseQueryReturn<TResult, TVariables> {
    result: Ref<TResult>;
    loading: Ref<boolean>;
    networkStatus: Ref<number>;
    error: Ref<Error>;
    start: () => void;
    stop: () => void;
    restart: () => void;
    document: Ref<DocumentNode>;
    variables: Ref<TVariables>;
    options: UseQueryOptions<TResult, TVariables> | Ref<UseQueryOptions<TResult, TVariables>>;
    query: Ref<ObservableQuery<TResult, TVariables>>;
    refetch: (variables?: TVariables) => Promise<ApolloQueryResult<TResult>>;
    fetchMore: <K extends keyof TVariables>(options: FetchMoreQueryOptions<TVariables, K> & FetchMoreOptions<TResult, TVariables>) => Promise<ApolloQueryResult<TResult>>;
    subscribeToMore: <TSubscriptionVariables = OperationVariables, TSubscriptionData = TResult>(options: SubscribeToMoreOptions<TResult, TSubscriptionVariables, TSubscriptionData> | Ref<SubscribeToMoreOptions<TResult, TSubscriptionVariables, TSubscriptionData>> | ReactiveFunction<SubscribeToMoreOptions<TResult, TSubscriptionVariables, TSubscriptionData>>) => void;
    onResult: (fn: (param?: ApolloQueryResult<TResult>) => void) => {
        off: () => void;
    };
    onError: (fn: (param?: Error) => void) => {
        off: () => void;
    };
}
/**
 * Use a query that does not require variables or options.
 * */
export declare function useQuery<TResult = any>(document: DocumentNode | Ref<DocumentNode> | ReactiveFunction<DocumentNode>): UseQueryReturn<TResult, undefined>;
/**
 * Use a query that requires options but not variables.
 */
export declare function useQuery<TResult = any, TVariables extends undefined = undefined>(document: DocumentNode | Ref<DocumentNode> | ReactiveFunction<DocumentNode>, variables: TVariables, options: UseQueryOptions<TResult, TVariables> | Ref<UseQueryOptions<TResult, TVariables>> | ReactiveFunction<UseQueryOptions<TResult, TVariables>>): UseQueryReturn<TResult, TVariables>;
/**
 * Use a query that requires variables.
 */
export declare function useQuery<TResult = any, TVariables extends OperationVariables = OperationVariables>(document: DocumentNode | Ref<DocumentNode> | ReactiveFunction<DocumentNode>, variables: TVariables | Ref<TVariables> | ReactiveFunction<TVariables>): UseQueryReturn<TResult, TVariables>;
/**
 * Use a query that requires variables and options.
 */
export declare function useQuery<TResult = any, TVariables extends OperationVariables = OperationVariables>(document: DocumentNode | Ref<DocumentNode> | ReactiveFunction<DocumentNode>, variables: TVariables | Ref<TVariables> | ReactiveFunction<TVariables>, options: UseQueryOptions<TResult, TVariables> | Ref<UseQueryOptions<TResult, TVariables>> | ReactiveFunction<UseQueryOptions<TResult, TVariables>>): UseQueryReturn<TResult, TVariables>;
