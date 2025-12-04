// Tipos para as APIs do Electron expostas no renderer process

interface CertificateInfo {
  validFrom: string;
  validTo: string;
  cnpj: string | null;
  companyName: string | null;
  subject: string;
  issuer: string;
}

interface ElectronAPI {
  importNFEXMLs: (folderPath: string) => Promise<any[]>;
  readFileAsBase64: (filePath: string) => Promise<string>;
  readCertificateInfo: (filePath: string, password: string) => Promise<CertificateInfo>;
}

interface ElectronBridge {
  showOpenDialog: (options: {
    properties?: ('openFile' | 'openDirectory' | 'multiSelections')[];
    title?: string;
    defaultPath?: string;
    buttonLabel?: string;
    filters?: { name: string; extensions: string[] }[];
  }) => Promise<string[]>;
  showNotification: (options: { title: string; body: string; icon?: string }) => Promise<boolean>;
  invoke: (channel: string, ...args: any[]) => Promise<any>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    electron: ElectronBridge;
  }
}

export {};

