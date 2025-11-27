const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const electronAPI = {
  getInstalledCertificates: () => ipcRenderer.invoke('get-installed-certificates'),
  importNFEXMLs: (folderPath: string) => ipcRenderer.invoke('import-nfe-xmls', folderPath),
  // Handler para fazer requisições HTTP sem problemas de CORS (do lado do Node.js)
  fetch: (url: string, options?: RequestInit) => ipcRenderer.invoke('http-fetch', url, options)
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Expose electron APIs for file/folder selection and general IPC
contextBridge.exposeInMainWorld('electron', {
  showOpenDialog: (options: any) => ipcRenderer.invoke('show-open-dialog', options),
  showNotification: (options: { title: string; body: string; icon?: string }) => ipcRenderer.invoke('show-notification', options),
  invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args)
});


