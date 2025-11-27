//--------------------------------------------------------------------
// TENANT SERVICE
// Serviço para validação e gerenciamento de tenants
// Utilizado na tela de seleção de tenant antes do login
//--------------------------------------------------------------------

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

interface TenantValidationResponse {
  exists: boolean;
  tenant?: {
    id: string;
    domains?: Array<{ domain: string }>;
  };
}

/**
 * Valida se um tenant existe na API
 * @param tenantId - ID do tenant a ser validado
 * @returns Promise com resultado da validação
 */
export async function validateTenant(tenantId: string): Promise<{ valid: boolean; error?: string }> {
  try {
    // Remove espaços e converte para minúsculas
    const cleanTenantId = tenantId.trim().toLowerCase();
    
    if (!cleanTenantId) {
      return { valid: false, error: 'ID do tenant não pode estar vazio' };
    }

    // Verifica se está no Electron
    const isElectron = checkIsElectron();
    
    // Faz requisição para validar o tenant
    // Usa o endpoint raiz da API que retorna {"message": "ok"} quando o tenant é válido
    // No Electron, usa handler IPC para evitar CORS
    // No navegador, usa fetch normal (requer CORS configurado na API)
    const url = `${API_BASE_URL}/api/`;
    const fetchOptions = {
      method: 'GET',
      headers: {
        'X-Tenant-ID': cleanTenantId,
        'Accept': 'application/json',
      },
    };

    let response: any;
    
    if (isElectron) {
      // Serializa os dados para evitar erro de clonagem no IPC
      // Cria um objeto completamente novo com apenas valores primitivos (strings)
      const serializedOptions: Record<string, any> = {
        method: String(fetchOptions.method || 'GET')
      };
      
      // Cria headers como objeto simples de strings
      const cleanHeaders: Record<string, string> = {};
      cleanHeaders['X-Tenant-ID'] = String(cleanTenantId);
      cleanHeaders['Accept'] = String(fetchOptions.headers['Accept'] || 'application/json');
      serializedOptions.headers = cleanHeaders;
      
      response = await (window as any).electronAPI.fetch(url, serializedOptions);
    } else {
      response = await fetch(url, fetchOptions);
    }
    
    // Se retornar 200, o tenant existe e foi inicializado corretamente
    if (response.status === 200) {
      try {
        // No Electron, os dados já vêm parseados em response.data
        const data = response.data || (response.text ? JSON.parse(response.text) : null);
        // Verifica se a resposta é válida (endpoint raiz retorna {"message": "ok"})
        if (data && typeof data === 'object') {
          return { valid: true };
        }
      } catch (e) {
        // Se não conseguir parsear JSON mas retornou 200, assume válido
        return { valid: true };
      }
    }

    // Se retornar 404, o tenant não foi encontrado
    if (response.status === 404) {
      return { valid: false, error: 'Tenant não encontrado' };
    }

    // Outros erros HTTP
    return { valid: false, error: 'Erro ao validar tenant' };
  } catch (error) {
    // Verifica se é erro de conexão
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { 
        valid: false, 
        error: 'Erro ao conectar com a API. Verifique se o servidor está rodando.' 
      };
    }
    
    return { 
      valid: false, 
      error: 'Erro ao validar tenant. Tente novamente.' 
    };
  }
}

/**
 * Salva o tenant ID no localStorage
 * @param tenantId - ID do tenant a ser salvo
 */
export function saveTenantId(tenantId: string): void {
  const cleanTenantId = tenantId.trim().toLowerCase();
  localStorage.setItem('tenantId', cleanTenantId);
}

/**
 * Obtém o tenant ID salvo no localStorage
 * @returns ID do tenant ou null se não existir
 */
export function getTenantId(): string | null {
  return localStorage.getItem('tenantId');
}

/**
 * Remove o tenant ID do localStorage
 */
export function clearTenantId(): void {
  localStorage.removeItem('tenantId');
}

