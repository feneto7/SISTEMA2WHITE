import path from 'node:path';
import { app, BrowserWindow, nativeTheme, ipcMain, dialog, Notification } from 'electron';
import { importNFEXMLs, importNFEXMLsFromFiles } from './handlers/xmlImportHandler';
import { readCertificateInfo } from './handlers/certificateReader';
import https from 'node:https';
import http from 'node:http';
import fs from 'node:fs';

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
      nodeIntegration: false,
      webSecurity: false // Permite requisições cross-origin no Electron (apenas desenvolvimento)
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
  // Handler para ler arquivo e converter para Base64
  ipcMain.handle('read-file-base64', async (event, filePath) => {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const base64 = fileBuffer.toString('base64');
      return base64;
    } catch (error) {
      console.error('Erro ao ler arquivo:', error);
      throw error;
    }
  });

  // Handler para ler informações do certificado
  ipcMain.handle('read-certificate-info', async (event, filePath, password) => {
    try {
      const certInfo = await readCertificateInfo(filePath, password);
      return certInfo;
    } catch (error) {
      console.error('Erro ao ler informações do certificado:', error);
      throw error;
    }
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

  // Handler para fazer requisições HTTP do lado do Node.js (sem problemas de CORS)
  ipcMain.handle('http-fetch', async (event, url: string, options?: any) => {
    return new Promise((resolve, reject) => {
      try {
        const urlObj = new URL(url);
        const isHttps = urlObj.protocol === 'https:';
        const httpModule = isHttps ? https : http;
        
        // Garante que headers é um objeto simples
        const headers = options?.headers || {};
        const cleanHeaders: Record<string, string> = {};
        for (const [key, value] of Object.entries(headers)) {
          cleanHeaders[key] = String(value);
        }
        
        const requestOptions = {
          hostname: urlObj.hostname,
          port: urlObj.port || (isHttps ? 443 : 80),
          path: urlObj.pathname + urlObj.search,
          method: options?.method || 'GET',
          headers: cleanHeaders
        };

        const req = httpModule.request(requestOptions, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const jsonData = data ? JSON.parse(data) : null;
            // Retorna apenas dados primitivos que podem ser clonados pelo IPC
            const responseData = {
              ok: res.statusCode ? res.statusCode >= 200 && res.statusCode < 300 : false,
              status: res.statusCode || 200,
              statusText: res.statusMessage || 'OK',
              data: jsonData, // Dados JSON parseados diretamente
              text: data, // Texto da resposta
              headers: {} as Record<string, string>
            };
            
            // Converte headers para objeto simples de strings
            if (res.headers) {
              for (const [key, value] of Object.entries(res.headers)) {
                if (Array.isArray(value)) {
                  responseData.headers[key] = value.join(', ');
                } else if (value) {
                  responseData.headers[key] = String(value);
                }
              }
            }
            
            resolve(responseData);
          } catch (e) {
            resolve({
              ok: res.statusCode ? res.statusCode >= 200 && res.statusCode < 300 : false,
              status: res.statusCode || 200,
              statusText: res.statusMessage || 'OK',
              data: null,
              text: data,
              headers: {} as Record<string, string>
            });
          }
        });
      });

        req.on('error', (error) => {
          reject(error);
        });

        if (options?.body) {
          req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
        }

        req.end();
      } catch (error) {
        console.error('[Main] Erro ao criar requisição:', error);
        reject(error);
      }
    });
  });

  // Handler para exibir notificação do sistema
  ipcMain.handle('show-notification', async (event, options: { title: string; body: string; icon?: string }) => {
    try {
      // Verificar se as notificações são suportadas
      if (!Notification.isSupported()) {
        console.warn('Notificações do sistema não são suportadas nesta plataforma');
        return;
      }

      const notification = new Notification({
        title: options.title,
        body: options.body,
        icon: options.icon,
        silent: true // Sem som da notificação do sistema (o som do sino já é reproduzido pelo useOrderBellSound)
      });

      notification.show();
      
      return true;
    } catch (error) {
      console.error('Erro ao exibir notificação:', error);
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


