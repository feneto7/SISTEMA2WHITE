//--------------------------------------------------------------------
// API SERVICE
// Serviço reutilizável para fazer requisições HTTP à API
// Utiliza o tenant ID do localStorage e inclui automaticamente nos headers
// Funciona tanto no Electron (via IPC) quanto no navegador (via fetch)
//--------------------------------------------------------------------

import { getTenantId } from './tenantService';

// URL base da API
// Pode ser configurada via variável de ambiente VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Verifica se está rodando no Electron (tem acesso ao electronAPI)
const checkIsElectron = () => {
  const hasWindow = typeof window !== 'undefined';
  const hasElectronAPI = hasWindow && (window as any).electronAPI;
  const hasFetch = hasElectronAPI && typeof (window as any).electronAPI.fetch === 'function';
  
  return hasFetch;
};

// Interface para resposta da API
interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  statusText: string;
  data: T;
  text: string;
  headers: Record<string, string>;
}

// Interface para opções de requisição
interface ApiRequestOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
  requireAuth?: boolean; // Se true, requer token de autenticação
}

/**
 * Obtém o token de autenticação do localStorage
 * @returns Token ou null se não existir
 */
function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

/**
 * Faz uma requisição HTTP à API
 * Inclui automaticamente o header X-Tenant-ID do localStorage
 * @param endpoint - Endpoint da API (ex: '/api/vehicles')
 * @param options - Opções da requisição (method, body, headers, etc.)
 * @returns Promise com resposta da API
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  try {
    // Remove barra inicial se existir e adiciona /api se não tiver
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${cleanEndpoint}`;

    // Obtém o tenant ID do localStorage
    const tenantId = getTenantId();
    
    if (!tenantId) {
      throw new Error('Tenant ID não encontrado. Por favor, selecione um tenant primeiro.');
    }

    // Prepara headers
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Tenant-ID': tenantId,
      ...(options.headers || {})
    };

    // Adiciona token de autenticação se necessário
    if (options.requireAuth !== false) {
      const token = getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // Prepara opções da requisição
    const fetchOptions: Record<string, any> = {
      method: options.method || 'GET',
      headers
    };

    // Adiciona body se existir
    if (options.body) {
      if (typeof options.body === 'string') {
        fetchOptions.body = options.body;
      } else {
        fetchOptions.body = JSON.stringify(options.body);
      }
    }

    // Verifica se está no Electron
    const isElectron = checkIsElectron();

    let response: ApiResponse<T>;

    if (isElectron) {
      // No Electron, usa handler IPC para evitar CORS
      // Serializa os dados para evitar erro de clonagem no IPC
      const serializedOptions: Record<string, any> = {
        method: String(fetchOptions.method || 'GET')
      };

      // Cria headers como objeto simples de strings
      const cleanHeaders: Record<string, string> = {};
      for (const [key, value] of Object.entries(headers)) {
        cleanHeaders[key] = String(value);
      }
      serializedOptions.headers = cleanHeaders;

      // Adiciona body se existir
      if (fetchOptions.body) {
        serializedOptions.body = typeof fetchOptions.body === 'string' 
          ? fetchOptions.body 
          : JSON.stringify(fetchOptions.body);
      }

      const ipcResponse = await (window as any).electronAPI.fetch(url, serializedOptions);
      
      // Converte resposta do IPC para formato padrão
      response = {
        ok: ipcResponse.ok || (ipcResponse.status >= 200 && ipcResponse.status < 300),
        status: ipcResponse.status || 200,
        statusText: ipcResponse.statusText || 'OK',
        data: ipcResponse.data || null,
        text: ipcResponse.text || '',
        headers: ipcResponse.headers || {}
      };
    } else {
      // No navegador, usa fetch normal (requer CORS configurado na API)
      const fetchResponse = await fetch(url, fetchOptions);
      const text = await fetchResponse.text();
      let data: any = null;
      
      try {
        data = text ? JSON.parse(text) : null;
      } catch (e) {
        // Se não conseguir parsear, mantém como null
      }

      response = {
        ok: fetchResponse.ok,
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        data,
        text,
        headers: {}
      };
    }

    return response;
  } catch (error) {
    console.error('[ApiService] Erro na requisição:', error);
    throw error;
  }
}

/**
 * Faz uma requisição GET
 * @param endpoint - Endpoint da API
 * @param options - Opções adicionais
 * @returns Promise com resposta da API
 */
export async function apiGet<T = any>(
  endpoint: string,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { ...options, method: 'GET' });
}

/**
 * Faz uma requisição POST
 * @param endpoint - Endpoint da API
 * @param body - Corpo da requisição
 * @param options - Opções adicionais
 * @returns Promise com resposta da API
 */
export async function apiPost<T = any>(
  endpoint: string,
  body?: any,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { ...options, method: 'POST', body });
}

/**
 * Faz uma requisição PUT
 * @param endpoint - Endpoint da API
 * @param body - Corpo da requisição
 * @param options - Opções adicionais
 * @returns Promise com resposta da API
 */
export async function apiPut<T = any>(
  endpoint: string,
  body?: any,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { ...options, method: 'PUT', body });
}

/**
 * Faz uma requisição DELETE
 * @param endpoint - Endpoint da API
 * @param options - Opções adicionais
 * @returns Promise com resposta da API
 */
export async function apiDelete<T = any>(
  endpoint: string,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { ...options, method: 'DELETE' });
}

