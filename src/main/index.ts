import path from 'node:path';
import { app, BrowserWindow, nativeTheme, ipcMain, dialog } from 'electron';
import { getInstalledCertificates } from './handlers/certificateHandler';
import { importNFEXMLs, importNFEXMLsFromFiles } from './handlers/xmlImportHandler';

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  // Configurações específicas por plataforma
  const isMac = process.platform === 'darwin';
  
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    resizable: true,
    maximizable: true,
    minimizable: true,
    fullscreenable: true,
    show: false, // Não mostrar até estar pronto
    // Configurações específicas do macOS
    ...(isMac && {
      titleBarStyle: 'hiddenInset',
      trafficLightPosition: { x: 12, y: 12 },
      vibrancy: 'under-window',
      visualEffectState: 'active'
    }),
    // Configurações específicas do Windows
    ...(!isMac && {
      frame: true,
      autoHideMenuBar: true
    }),
    backgroundColor: isMac ? '#00000000' : '#ECECEC',
    transparent: isMac,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Mostrar janela apenas quando estiver pronta para evitar tela preta
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
};

app.whenReady().then(() => {
  // Handler para buscar certificados digitais instalados
  ipcMain.handle('get-installed-certificates', async () => {
    return await getInstalledCertificates();
  });

  // Handler para importar XMLs de notas fiscais de uma pasta
  ipcMain.handle('import-nfe-xmls', async (event, folderPath) => {
    try {
      const xmlData = await importNFEXMLs(folderPath);
      return xmlData;
    } catch (error) {
      console.error('Erro ao importar XMLs:', error);
      throw error;
    }
  });

  // Handler para importar XMLs de notas fiscais de arquivos selecionados
  ipcMain.handle('import-nfe-xmls-from-files', async (event, filePaths) => {
    try {
      const xmlData = await importNFEXMLsFromFiles(filePaths);
      return xmlData;
    } catch (error) {
      console.error('Erro ao importar XMLs de arquivos:', error);
      throw error;
    }
  });

  // Handler para abrir dialog de seleção de arquivos/pastas
  ipcMain.handle('show-open-dialog', async (event, options) => {
    try {
      const result = await dialog.showOpenDialog(mainWindow!, options);
      return result.filePaths;
    } catch (error) {
      console.error('Erro ao abrir dialog:', error);
      throw error;
    }
  });

  console.log('IPC handlers registrados');
  
  nativeTheme.themeSource = 'light';
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


