/**
 * API client for BizInsight FastAPI backend.
 * All requests are scoped by workspace and handle error envelopes uniformly.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface ApiError {
  code: string;
  message: string;
  details?: Array<{ loc: string[]; msg: string }>;
}

export class ApiException extends Error {
  code: string;
  details: Array<{ loc: string[]; msg: string }>;
  status: number;

  constructor(status: number, error: ApiError) {
    super(error.message);
    this.name = "ApiException";
    this.status = status;
    this.code = error.code;
    this.details = error.details || [];
  }
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData: ApiError = {
      code: `http_${response.status}`,
      message: response.statusText || "Request failed",
    };
    try {
      const data = await response.json();
      if (data.error) {
        errorData = data.error;
      }
    } catch {
      // Ignore JSON parse error on non-JSON response
    }
    throw new ApiException(response.status, errorData);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
