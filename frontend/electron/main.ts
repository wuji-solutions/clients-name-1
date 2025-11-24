import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import * as path from 'path';
import * as os from 'os';
import isDev from 'electron-is-dev';

let win: BrowserWindow | null = null;

function createWindow() {
  win = new BrowserWindow({
    width: isDev ? 1200 : 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, '..', '..', 'electron', 'preload.js'),
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    win.loadURL(`file://${path.join(__dirname, '../index.html')}`);
  }

  win.on('closed', () => (win = null));

  if (isDev) {
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      forceHardReset: true,
      hardResetMethod: 'exit',
    });
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) createWindow();
});

// IPC
ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
  });
  return canceled ? null : filePaths[0];
});

ipcMain.on('open-raports-folder', () => {
  const userHome = os.homedir();
  const raportsPath = path.join(userHome, 'Documents', 'Raporty');
  shell.openPath(raportsPath);
});

ipcMain.on('open-hotspot-menu', () => {
  const platform = os.platform();
  if (platform === 'win32') {
    shell.openExternal('ms-settings:network-mobilehotspot');
  }
});
