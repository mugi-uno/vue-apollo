import { DocumentNode } from 'graphql';
import { Ref } from '@vue/composition-api';
import { OperationVariables, SubscriptionOptions } from 'apollo-client';
import { Observable } from 'apollo-client/util/Observable';
import { FetchResult } from 'apollo-link';
import { ReactiveFunction } from './util/ReactiveFunction';
export interface UseSubscriptionOptions<TResult = any, TVariables = OperationVariables> extends Omit<SubscriptionOptions<TVariables>, 'query' | 'variables'> {
    clientId?: string;
    enabled?: boolean;
    throttle?: number;
    debounce?: number;
}
export interface UseSubscriptionReturn<TResult, TVariables> {
    result: Ref<TResult>;
    loading: Ref<boolean>;
    error: Ref<Error>;
    start: () => void;
    stop: () => void;
    restart: () => void;
    document: Ref<DocumentNode>;
    variables: Ref<TVariables>;
    options: UseSubscriptionOptions<TResult, TVariables> | Ref<UseSubscriptionOptions<TResult, TVariables>>;
    subscription: Ref<Observable<FetchResult<TResult, Record<string, any>, Record<string, any>>>>;
    onResult: (fn: (param?: FetchResult<TResult, Record<string, any>, Record<string, any>>) => void) => {
        off: () => void;
    };
    onError: (fn: (param?: Error) => void) => {
        off: () => void;
    };
}
/**
 * Use a subscription that does not require variables or options.
 * */
export declare function useSubscription<TResult = any>(document: DocumentNode | Ref<DocumentNode> | ReactiveFunction<DocumentNode>): UseSubscriptionReturn<TResult, undefined>;
/**
 * Use a subscription that requires options but not variables.
 */
export declare function useSubscription<TResult = any, TVariables extends undefined = undefined>(document: DocumentNode | Ref<DocumentNode> | ReactiveFunction<DocumentNode>, variables: TVariables, options: UseSubscriptionOptions<TResult, TVariables> | Ref<UseSubscriptionOptions<TResult, TVariables>> | ReactiveFunction<UseSubscriptionOptions<TResult, TVariables>>): UseSubscriptionReturn<TResult, TVariables>;
/**
 * Use a subscription that requires variables.
 */
export declare function useSubscription<TResult = any, TVariables extends OperationVariables = OperationVariables>(document: DocumentNode | Ref<DocumentNode> | ReactiveFunction<DocumentNode>, variables: TVariables | Ref<TVariables> | ReactiveFunction<TVariables>): UseSubscriptionReturn<TResult, TVariables>;
/**
 * Use a subscription that requires variables and options.
 */
export declare function useSubscription<TResult = any, TVariables extends OperationVariables = OperationVariables>(document: DocumentNode | Ref<DocumentNode> | ReactiveFunction<DocumentNode>, variables: TVariables | Ref<TVariables> | ReactiveFunction<TVariables>, options: UseSubscriptionOptions<TResult, TVariables> | Ref<UseSubscriptionOptions<TResult, TVariables>> | ReactiveFunction<UseSubscriptionOptions<TResult, TVariables>>): UseSubscriptionReturn<TResult, TVariables>;
