import axios, { type AxiosInstance } from "axios";

// --- Types ---
interface ApiResponse<T> {
  data: T;
}

type Payload = Record<string, unknown>;
type HttpMethod = "post" | "put" | "patch";
type ApiClient = "base" | "pharpay";

// --- Safe localStorage parse utility ---
function safeParse<T>(value: string | null): T | null {
  try {
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

// --- Environment Variables ---
const BASE_URL = import.meta.env.VITE_BASE_URL;
const PHARPAY_URL = import.meta.env.VITE_PHARPAY_URL;
const SUBSCRIPTION_KEY = import.meta.env.VITE_DOSESPOT_SUBSCRIPTION_KEY;

// --- Auth Data ---
const user = safeParse<{ token?: string }>(localStorage.getItem("userInfo"));

// Read the freshest token available at call time.
const currentToken = (): string =>
  localStorage.getItem("token") ?? user?.token ?? "";

// --- Headers Generator ---
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${currentToken()}`,
  "X-Subscription-Key": SUBSCRIPTION_KEY,
});

// --- Axios Instances ---
const baseApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: getHeaders(),
});

const pharPayApi: AxiosInstance = axios.create({
  baseURL: PHARPAY_URL,
  headers: getHeaders(),
});

// Inject the live token on every request so a login mid-session (or another
// tab) is always reflected without relying on setAuthToken having been called.
const attachLiveToken = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => {
    const t = currentToken();
    if (t) config.headers.Authorization = `Bearer ${t}`;
    return config;
  });
};
attachLiveToken(baseApi);
attachLiveToken(pharPayApi);

// --- API Client Selector ---
const getClient = (client: ApiClient): AxiosInstance =>
  client === "pharpay" ? pharPayApi : baseApi;

// --- Generic GET ---
export const GetData = async <T>(
  endpoint: string,
  client: ApiClient = "base"
): Promise<T> => {
  const response = await getClient(client).get<ApiResponse<T>>(endpoint);
  return response.data.data;
};
export const GetSingleData = async <T>(
  endpoint: string,
  client: ApiClient = "base"
): Promise<ApiResponse<T>> => {
  const response = await getClient(client).get<ApiResponse<T>>(endpoint);
  return response.data;
};

// --- Generic POST/PUT/PATCH ---
export const PostData = async <T>(
  endpoint: string,
  payload?: Payload,
  method: HttpMethod = "post",
  client: ApiClient = "base"
): Promise<T> => {
  const instance = getClient(client);

  const response =
    method === "put"
      ? await instance.put<T>(endpoint, payload)
      : method === "patch"
      ? await instance.patch<T>(endpoint, payload)
      : await instance.post<T>(endpoint, payload);

  return response.data;
};

// --- Generic DELETE ---
export const DeleteData = async <T>(
  endpoint: string,
  payload?: Payload,
  client: ApiClient = "base"
): Promise<T> => {
  const response = await getClient(client).delete<T>(endpoint, {
    data: payload,
  });
  return response.data;
};

// --- Token Updater (if login state changes later) ---
export const setAuthToken = (newToken: string | null) => {
  const value = newToken ? `Bearer ${newToken}` : "";
  baseApi.defaults.headers["Authorization"] = value;
  pharPayApi.defaults.headers["Authorization"] = value;
};

export const PostFormUrlEncoded = async <T>(
  fullUrl: string,
  payload: Record<string, string>
): Promise<T> => {
  const params = new URLSearchParams(payload).toString();

  const response = await axios.post<T>(fullUrl, params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
};

// --- Generic POST (multipart/form-data) ---
export const PostMultipartData = async <T>(
  endpoint: string,
  payload: FormData,
  method: HttpMethod = "post",
  client: ApiClient = "base"
): Promise<T> => {
  const instance = getClient(client);

  const response =
    method === "put"
      ? await instance.put<T>(endpoint, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      : method === "patch"
      ? await instance.patch<T>(endpoint, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      : await instance.post<T>(endpoint, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });

  return response.data;
};
