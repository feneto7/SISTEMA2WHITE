// Tipos para as APIs do Electron expostas no renderer process

interface ElectronAPI {
  getInstalledCertificates: () => Promise<any[]>;
  importNFEXMLs: (folderPath: string) => Promise<any[]>;
}

interface ElectronBridge {
  showOpenDialog: (options: {
    properties?: ('openFile' | 'openDirectory' | 'multiSelections')[];
    title?: string;
    defaultPath?: string;
    buttonLabel?: string;
    filters?: { name: string; extensions: string[] }[];
  }) => Promise<string[]>;
  invoke: (channel: string, ...args: any[]) => Promise<any>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    electron: ElectronBridge;
  }
}

export {};

