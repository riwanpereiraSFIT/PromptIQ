import {
  HealthResponse,
  PredictResponse,
  CompareResponse,
  ModelInfoResponse,
  MetricsResponse,
} from '../types/api';

const API_BASE = '/api';

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      let errorMessage = `Request failed with status ${res.status}`;
      try {
        const errorData = await res.json();
        if (errorData.detail) {
          if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail;
          } else if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((err: any) => err.msg || JSON.stringify(err)).join(', ');
          }
        }
      } catch {
        // Fallback to text or status text
        const text = await res.text().catch(() => null);
        if (text) errorMessage = text;
      }
      throw new ApiError(errorMessage, res.status);
    }

    return await res.json();
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network or server unreachable error
    throw new ApiError(
      'Unable to connect to the PromptIQ backend server. Please verify the backend is running at http://127.0.0.1:8000.',
      0
    );
  }
}

export const apiService = {
  getHealth: () => request<HealthResponse>('/health'),

  predict: (prompt: string) =>
    request<PredictResponse>('/predict', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    }),

  compare: (original_prompt: string, revised_prompt: string) =>
    request<CompareResponse>('/compare', {
      method: 'POST',
      body: JSON.stringify({ original_prompt, revised_prompt }),
    }),

  getModelInfo: () => request<ModelInfoResponse>('/model-info'),

  getMetrics: () => request<MetricsResponse>('/metrics'),
};
