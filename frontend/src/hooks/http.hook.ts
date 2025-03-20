import { useCallback, useState } from "react";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type WithMethod<TRequestOpts, TMethod extends Method> = TRequestOpts & { method: TMethod };

interface GeneralOpts<TBody = unknown> {
    headers?: Record<string, string>,
    body?: TBody,
}

type Headers = Record<string, string>;

type RequestOpts<TBody = null> = 
    WithMethod<{ headers?: Headers }, "GET">
    | WithMethod<GeneralOpts<TBody>, Exclude<Method, "GET">>;

interface GeneralError<TError> {
    status: number | null,
    error: TError
}

interface RequestError<TError> extends GeneralError<TError> {
    status: number,
}

interface UnknownError extends GeneralError<unknown> {
    status: null,
}

type HttpError<TError> = UnknownError | RequestError<TError>; 

export function useHttp<TData, TError = unknown>(
    url: string,
) {
    const [error, setError] = useState<HttpError<TError | Error>| null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const request = useCallback(async <TBody = undefined>(opts: RequestOpts<TBody>): Promise<TData | null> => {
        setLoading(true);
        setError(null);

        try {
            const headers: Record<string, string> = { ...opts.headers };
            if (opts.method != "GET") {
                headers["Content-Type"] = "application/json";
            }
            const res = await fetch(url, {
                method: opts.method,
                headers,
                body: opts.method != "GET" && opts.body ? JSON.stringify(opts.body) : undefined,
            });

            if (!res.ok) {
                setError({ status: res.status, error: await res.json() });
                setLoading(false);
                return null;
            }
            
            const body = await res.json();

            setLoading(false);
            return body as TData;
        } catch (e) {
            setError({ status: null, error: e });
            setLoading(false);
            return null;
        }
    }, [url]);

    const get = useCallback(async (headers: Headers = {}) => {
        return request({ method: "GET", headers });
    }, [request]);

    const post = useCallback(async <TBody>(opts: GeneralOpts<TBody> = {}) => {
        return request({ method: "POST", body: opts.body, headers: opts.headers });
    }, [request]);

    const put = useCallback(async <TBody>(opts: GeneralOpts<TBody> = {}) => {
        return request({ method: "PUT", body: opts.body, headers: opts.headers });
    }, [request]);

    const del = useCallback(async <TBody>(opts: GeneralOpts<TBody> = {}) => {
        return request({ method: "DELETE", body: opts.body, headers: opts.headers });
    }, [request]);

    const patch = useCallback(async <TBody>(opts: GeneralOpts<TBody> = {}) => {
        return request({ method: "PATCH", body: opts.body, headers: opts.headers });
    }, [request]);

    return { loading, error, get, post, put, del, patch }; 
}
