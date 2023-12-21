import { fetchSecure } from '../helper/fetchHelper';
import {
  QueryKey,
  UseBaseQueryOptions,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from 'react-query';
import { get } from '../utils/funcs';

const DEFAULT_CACHE_TIME = 1000 * 60 * 5;
const DEFAULT_STALE_TIME = 1000 * 60 * 5;

type Many<T> = T | ReadonlyArray<T>;
type PropertyName = string | number | symbol;
export type PropertyPath = Many<PropertyName>;

export type QueryOptionsType = {
  url: string;
  queryFn?: () => unknown;
  cacheTime?: number;
  staleTime?: number;
  refetchInterval?: number | false;
  refetchOnWindowFocus?: boolean;
  method?: 'GET' | 'POST';
  throwOnError?: boolean;
  enabled?: boolean;
  body?: BodyInit | null | undefined;
  path?: PropertyPath;
  retry?: boolean;
  secure?: boolean;
} & UseBaseQueryOptions<any>;

export type SecureQueryMutationResult<T> = UseMutationResult<
  {
    ok: boolean;
    status: number;
    statusText: string;
    data: any;
  },
  unknown,
  T,
  unknown
>;

const defaultQueryOptions: Partial<QueryOptionsType> = {
  queryFn: undefined,
  cacheTime: DEFAULT_CACHE_TIME, // The time in milliseconds that unused/inactive cache data remains in memory.
  staleTime: DEFAULT_STALE_TIME, // The time in milliseconds after data is considered stale. This value only applies to the hook it is defined on.
  refetchInterval: false, // If set to a number, all queries will continuously refetch at this frequency in milliseconds
  refetchOnWindowFocus: false,
  method: 'GET',
  throwOnError: true,
  enabled: true, // Set this to false to disable this query from automatically running
  body: null,
  path: '', // ex: 'data.response'
  secure: false,
};

/**
 *
 * @param {string} cacheKey - The query will automatically update when this key changes
 * @param {object} options - react query options
 */
export const useSecureQuery = <T>(
  //TODO enum des reactQueryKeys
  cacheKey: QueryKey,
  options: QueryOptionsType
): UseQueryResult<T> => {
  const queryOptions = {
    ...defaultQueryOptions,
    ...options,
  };

  return useQuery(
    cacheKey,
    (): Promise<T> => {
      return !queryOptions.queryFn
        ? fetchSecure<T>(queryOptions.url, {
            throwOnError: queryOptions.throwOnError,
            method: queryOptions.method,
            body: queryOptions.body || null,
            secure: queryOptions.secure || false,
          }).then(
            (res) =>
              (queryOptions.path && (get(res, queryOptions.path) as T)) ||
              (res?.data && (res.data as any).payload)
          )
        : queryOptions.queryFn && (queryOptions.queryFn() as Promise<T>);
    },
    queryOptions
  );
};

/**
 *
 * @param {QueryKey} queries  React query invalidate queries param
 * @returns {Promise<void>}
 */
export const useInvalidateQueries = (queries?: QueryKey): (() => Promise<void>) => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries(queries);
};
/**
 *
 * @param {QueryKey[]} queries  React query invalidate queries param
 * @returns {Promise<void[]>}
 */
export const useInvalidateIndividualQueries = (queries: QueryKey[]): (() => Promise<void[]>) => {
  const queryClient = useQueryClient();
  return () => Promise.all(queries.map((query) => queryClient.invalidateQueries(query)));
};
