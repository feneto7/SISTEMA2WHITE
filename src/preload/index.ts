const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getInstalledCertificates: () => ipcRenderer.invoke('get-installed-certificates'),
  importNFEXMLs: (folderPath: string) => ipcRenderer.invoke('import-nfe-xmls', folderPath)
});

// Expose electron APIs for file/folder selection and general IPC
contextBridge.exposeInMainWorld('electron', {
  showOpenDialog: (options: any) => ipcRenderer.invoke('show-open-dialog', options),
  invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args)
});


