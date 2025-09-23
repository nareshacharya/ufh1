
interface DXError {
  code: string;
  message: string;
  correlationId?: string;
}

interface DXFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

interface DXResponse<T> {
  data: T;
  success: boolean;
  error?: DXError;
}

class DXApiError extends Error {
  code: string;
  correlationId?: string;

  constructor(error: DXError) {
    super(error.message);
    this.name = 'DXApiError';
    this.code = error.code;
    this.correlationId = error.correlationId;
  }
}

const DX_BASE_URL = process.env.NEXT_PUBLIC_DX_BASE_URL || 'https://api.pegacloud.io/prweb/api/v1';
const DEFAULT_TIMEOUT = 30000;
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DX === 'true';

function generateCorrelationId(): string {
  return `dx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function normalizeError(error: any, correlationId: string): DXError {
  if (error.name === 'AbortError') {
    return {
      code: 'TIMEOUT',
      message: 'Request timed out',
      correlationId
    };
  }

  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Network connection failed',
      correlationId
    };
  }

  if (error.status) {
    const statusMessages: Record<number, string> = {
      400: 'Bad Request - Invalid parameters',
      401: 'Unauthorized - Authentication required',
      403: 'Forbidden - Insufficient permissions',
      404: 'Not Found - Resource does not exist',
      409: 'Conflict - Resource already exists or is locked',
      422: 'Unprocessable Entity - Validation failed',
      429: 'Too Many Requests - Rate limit exceeded',
      500: 'Internal Server Error - Please try again later',
      502: 'Bad Gateway - Service temporarily unavailable',
      503: 'Service Unavailable - Please try again later',
      504: 'Gateway Timeout - Request took too long'
    };

    return {
      code: `HTTP_${error.status}`,
      message: statusMessages[error.status] || `HTTP Error ${error.status}`,
      correlationId
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: error.message || 'An unexpected error occurred',
    correlationId
  };
}

async function dxFetch<T>(
  path: string, 
  options: DXFetchOptions = {}
): Promise<T> {
  const correlationId = generateCorrelationId();
  const controller = new AbortController();
  const timeout = options.timeout || DEFAULT_TIMEOUT;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const url = `${DX_BASE_URL}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-Correlation-ID': correlationId,
      ...options.headers
    };

    let body: string | undefined;
    if (options.body) {
      body = typeof options.body === 'string' 
        ? options.body 
        : JSON.stringify(options.body);
    }

    if (USE_MOCK_DATA) {
      clearTimeout(timeoutId);
      return await getMockResponse<T>(path, options.method || 'GET', options.body);
    }

    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new DXApiError(normalizeError({
        status: response.status,
        message: errorData.message || response.statusText
      }, correlationId));
    }

    const data = await response.json();
    return data;

  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof DXApiError) {
      throw error;
    }

    throw new DXApiError(normalizeError(error, correlationId));
  }
}

async function getMockResponse<T>(path: string, method: string, body?: any): Promise<T> {
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));

  const mockResponses: Record<string, any> = {
    'GET:/cases': {
      cases: [
        {
          id: 'CASE-001',
          type: 'Formula Development',
          status: 'In Progress',
          title: 'Summer Breeze Eau de Parfum',
          assignee: 'john.perfumer@company.com',
          created: '2024-01-15T10:30:00Z',
          updated: '2024-01-20T14:22:00Z'
        },
        {
          id: 'CASE-002',
          type: 'Compliance Review',
          status: 'Pending Review',
          title: 'Vanilla Orchid Safety Assessment',
          assignee: 'sarah.compliance@company.com',
          created: '2024-01-18T09:15:00Z',
          updated: '2024-01-19T16:45:00Z'
        }
      ],
      totalCount: 2,
      pageSize: 20,
      pageIndex: 0
    },
    'POST:/cases': {
      id: 'CASE-003',
      type: 'Formula Development',
      status: 'New',
      title: 'New Formula Case',
      created: new Date().toISOString(),
      data: body?.data || {}
    },
    'GET:/cases/CASE-001': {
      id: 'CASE-001',
      type: 'Formula Development',
      status: 'In Progress',
      title: 'Summer Breeze Eau de Parfum',
      description: 'Developing a fresh, summery fragrance with citrus top notes',
      assignee: 'john.perfumer@company.com',
      priority: 'High',
      created: '2024-01-15T10:30:00Z',
      updated: '2024-01-20T14:22:00Z',
      data: {
        name: 'Summer Breeze Eau de Parfum',
        description: 'Fresh summer fragrance',
        category: 'Eau de Parfum',
        concentration: 15,
        ingredients: []
      },
      stages: [
        { name: 'Research', status: 'Completed' },
        { name: 'Initial Formula', status: 'In Progress' },
        { name: 'Testing', status: 'Pending' },
        { name: 'Approval', status: 'Pending' }
      ]
    },
    'POST:/cases/CASE-001/actions/save_draft': {
      success: true,
      message: 'Draft saved successfully',
      data: body || {},
      updated: new Date().toISOString()
    },
    'POST:/cases/CASE-001/actions/submit_for_review': {
      success: true,
      message: 'Case submitted for review',
      data: { ...body, status: 'Under Review' },
      updated: new Date().toISOString()
    },
    'POST:/cases/CASE-001/actions/approve': {
      success: true,
      message: 'Case approved successfully',
      data: { ...body, status: 'Approved' },
      updated: new Date().toISOString()
    },
    'PUT:/cases/CASE-001': {
      id: 'CASE-001',
      success: true,
      message: 'Case updated successfully',
      data: body || {},
      updated: new Date().toISOString()
    },
    'GET:/data/ingredients': {
      ingredients: [
        {
          id: 'ING-001',
          name: 'Bergamot Essential Oil',
          category: 'Citrus',
          origin: 'Italy',
          supplier: 'Premium Aromatics Ltd',
          concentration: '100%',
          ifraClass: 'Class 1',
          allergens: ['Limonene', 'Linalool'],
          price: 125.50,
          currency: 'USD',
          unit: 'kg'
        },
        {
          id: 'ING-002',
          name: 'White Musk Synthetic',
          category: 'Musk',
          origin: 'Switzerland',
          supplier: 'Alpine Synthetics',
          concentration: '99.8%',
          ifraClass: 'Class 2',
          allergens: [],
          price: 2200.00,
          currency: 'USD',
          unit: 'kg'
        }
      ],
      totalCount: 2,
      filters: {
        categories: ['Citrus', 'Floral', 'Wood', 'Musk', 'Spice'],
        origins: ['France', 'Italy', 'India', 'Bulgaria', 'Switzerland'],
        ifraClasses: ['Class 1', 'Class 2', 'Class 3', 'Class 4']
      }
    },
    'GET:/views/formula-workspace': {
      view: {
        id: 'formula-workspace-v1',
        name: 'Formula Development Workspace',
        components: [
          {
            type: 'FormEditor',
            config: {
              fields: ['name', 'description', 'category', 'targetPrice'],
              validation: { required: ['name'], maxLength: { description: 500 } }
            }
          },
          {
            type: 'IngredientPalette',
            config: {
              categories: ['top', 'heart', 'base'],
              maxIngredients: 50,
              showAllergenWarnings: true
            }
          },
          {
            type: 'ConcentrationCalculator',
            config: {
              units: ['ml', 'g', '%'],
              precision: 3,
              autoCalculate: true
            }
          }
        ],
        permissions: ['formula.read', 'formula.write', 'ingredients.read'],
        theme: 'professional'
      }
    }
  };

  const key = `${method}:${path}`;
  const response = mockResponses[key];
  
  if (!response) {
    // Check for parameterized paths (case action submissions)
    for (const [mockKey, mockResponse] of Object.entries(mockResponses)) {
      if (mockKey.includes('/actions/') && path.includes('/actions/')) {
        const actionMatch = path.match(/\/actions\/(.+)$/);
        const mockActionMatch = mockKey.match(/\/actions\/(.+)$/);
        if (actionMatch && mockActionMatch && method === mockKey.split(':')[0]) {
          return { ...mockResponse, actionId: actionMatch[1] } as T;
        }
      }
    }
    
    throw new Error(`Mock response not found for ${key}`);
  }

  return response as T;
}

export const dx = {
  cases: {
    async create<T = any>(data: any): Promise<T> {
      return dxFetch<T>('/cases', {
        method: 'POST',
        body: data
      });
    },

    async get<T = any>(caseId: string): Promise<T> {
      return dxFetch<T>(`/cases/${caseId}`);
    },

    async list<T = any>(filters?: any): Promise<T> {
      const query = filters ? `?${new URLSearchParams(filters).toString()}` : '';
      return dxFetch<T>(`/cases${query}`);
    },

    async update<T = any>(caseId: string, data: any): Promise<T> {
      return dxFetch<T>(`/cases/${caseId}`, {
        method: 'PUT',
        body: data
      });
    },

    async submitAction<T = any>(caseId: string, actionId: string, payload: any): Promise<T> {
      return dxFetch<T>(`/cases/${caseId}/actions/${actionId}`, {
        method: 'POST',
        body: payload
      });
    }
  },

  data: {
    async list<T = any>(dataType: string, filters?: any): Promise<T> {
      const query = filters ? `?${new URLSearchParams(filters).toString()}` : '';
      return dxFetch<T>(`/data/${dataType}${query}`);
    },

    async get<T = any>(dataType: string, id: string): Promise<T> {
      return dxFetch<T>(`/data/${dataType}/${id}`);
    },

    async create<T = any>(dataType: string, data: any): Promise<T> {
      return dxFetch<T>(`/data/${dataType}`, {
        method: 'POST',
        body: data
      });
    }
  },

  views: {
    async get<T = any>(viewId: string, context?: any): Promise<T> {
      const query = context ? `?${new URLSearchParams(context).toString()}` : '';
      return dxFetch<T>(`/views/${viewId}${query}`);
    }
  }
};

export { DXApiError, type DXError, type DXFetchOptions };
