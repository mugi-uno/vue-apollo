import { DocumentNode } from 'graphql';
import { MutationOptions, OperationVariables } from 'apollo-client';
import { Ref } from '@vue/composition-api';
import { FetchResult } from 'apollo-link';
import { ReactiveFunction } from './util/ReactiveFunction';
/**
 * `useMutation` options for mutations that don't require `variables`.
 */
export interface UseMutationOptions<TResult = any, TVariables = OperationVariables> extends Omit<MutationOptions<TResult, TVariables>, 'mutation'> {
    clientId?: string;
}
/**
 * `useMutation` options for mutations that don't use variables.
 */
export declare type UseMutationOptionsNoVariables<TResult = any, TVariables = OperationVariables> = Omit<UseMutationOptions<TResult, TVariables>, 'variables'>;
/**
 * `useMutation` options for mutations require variables.
 */
export interface UseMutationOptionsWithVariables<TResult = any, TVariables = OperationVariables> extends UseMutationOptions<TResult, TVariables> {
    variables: TVariables;
}
declare type MutateOverrideOptions = Pick<UseMutationOptions<any, OperationVariables>, 'update' | 'optimisticResponse' | 'context' | 'updateQueries' | 'refetchQueries' | 'awaitRefetchQueries' | 'errorPolicy' | 'fetchPolicy' | 'clientId'>;
declare type MutateResult<TResult> = Promise<FetchResult<TResult, Record<string, any>, Record<string, any>>>;
export declare type MutateWithOptionalVariables<TResult, TVariables> = (variables?: TVariables, overrideOptions?: MutateOverrideOptions) => MutateResult<TResult>;
export declare type MutateWithRequiredVariables<TResult, TVariables> = (variables: TVariables, overrideOptions?: MutateOverrideOptions) => MutateResult<TResult>;
export interface UseMutationReturn<TResult, TVariables, Mutate extends MutateWithOptionalVariables<TResult, TVariables> = MutateWithOptionalVariables<TResult, TVariables>> {
    mutate: Mutate;
    loading: Ref<boolean>;
    error: Ref<Error>;
    called: Ref<boolean>;
    onDone: (fn: (param?: FetchResult<TResult, Record<string, any>, Record<string, any>>) => void) => {
        off: () => void;
    };
    onError: (fn: (param?: Error) => void) => {
        off: () => void;
    };
}
/**
 * Use a mutation with variables.
 */
export declare function useMutation<TResult = any, TVariables extends OperationVariables = OperationVariables>(document: DocumentNode | ReactiveFunction<DocumentNode>, options?: UseMutationOptionsWithVariables<TResult, TVariables> | ReactiveFunction<UseMutationOptionsWithVariables<TResult, TVariables>>): UseMutationReturn<TResult, TVariables>;
/**
 * Use a mutation with variables, but without a default.
 */
export declare function useMutation<TResult = any, TVariables extends OperationVariables = OperationVariables>(document: DocumentNode | ReactiveFunction<DocumentNode>, options?: UseMutationOptionsNoVariables<TResult, undefined> | ReactiveFunction<UseMutationOptionsNoVariables<TResult, undefined>>): UseMutationReturn<TResult, TVariables, MutateWithRequiredVariables<TResult, TVariables>>;
export {};
