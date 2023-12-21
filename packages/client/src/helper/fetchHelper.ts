import { storage } from '../constants';

type FetchSecureOptions = {
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT';
  headers?: Record<string, string>;
  body?: BodyInit | null | undefined;
  throwOnError?: boolean;
  secure?: boolean;
  specifyTypeContent?: boolean;
};

const defaultOptions: FetchSecureOptions = {
  method: 'GET',
  headers: {},
  body: null,
  secure: false,
  specifyTypeContent: true,
};

const handleResponseData = async (res: Response) => {
  if (!res.headers.get('Content-Type')) return null;
  return await res.json();
};

export type FetchSecureReturn<T> = Promise<{
  ok: boolean;
  status: number;
  statusText: string;
  data: T | null;
}>;

export const fetchSecureForUseQuery = async <T>(
  url: string,
  options: FetchSecureOptions = {}
): FetchSecureReturn<T> => {
  return fetchSecure(url, {
    ...options,
    throwOnError: true,
  });
};

export const fetchSecure = async <T>(
  url: string,
  options: FetchSecureOptions = {}
): FetchSecureReturn<T> => {
  const finalOptions: FetchSecureOptions = {
    ...defaultOptions,
    ...options,
  };
  const { method, headers, body } = finalOptions;

  if (options.secure && headers) {
    const token = localStorage.getItem(storage.USER_TOKEN);
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      method,
      headers: finalOptions.specifyTypeContent
        ? {
            'Content-Type': 'application/json',
            ...headers,
          }
        : {
            ...headers,
          },
      body,
    });

    if (finalOptions.throwOnError && !res.ok) {
      const errMessage = await res.json();
      throw (errMessage.error || errMessage) ?? new Error(`Network error: ${res.statusText}`);
    }

    return {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      data: await handleResponseData(res),
    };
  } catch (error) {
    console.error(error);
    if (finalOptions.throwOnError) {
      throw error;
    }
    return {
      ok: false,
      status: 400,
      statusText: (error as Error)?.message || (error as string) || 'NOK',
      data: null,
    };
  }
};
