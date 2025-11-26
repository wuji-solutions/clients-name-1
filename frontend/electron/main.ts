import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import path from 'path';
import os from 'os';
import isDev from 'electron-is-dev';
import { ChildProcessWithoutNullStreams, spawn, exec } from 'child_process';
import { existsSync, mkdirSync } from 'fs';

let win: BrowserWindow | null = null;
let child: ChildProcessWithoutNullStreams;

function createWindow() {
  win = new BrowserWindow({
    width: isDev ? 1200 : 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:3000');

    const jarName = 'backend.jar';
    const backendPath = path.join(__dirname, '../../backend', jarName);

    child = spawn('java', ['-jar', backendPath]);
  } else {
    win.loadFile(path.join(process.resourcesPath, 'index.html'));

    const binaryName = process.platform === 'win32' ? 'backend.exe' : 'backend';
    const backendPath = path.join(process.resourcesPath, 'backend', binaryName);

    child = spawn(backendPath);
  }

  child.stdout.on('data', (data: any) => console.log(`[BACKEND STDOUT]: ${data}`));
  child.stderr.on('data', (data: any) => console.error(`[BACKEND STDERR]: ${data}`));
  child.on('error', (err: any) => console.error('Failed to start backend subprocess:', err));
  child.on('exit', (code: any) => console.log(`Backend exited with code ${code}`));

  win.on('closed', () => (win = null));

  if (isDev) {
    (async () => {
      try {
        const { default: installExtension, REACT_DEVELOPER_TOOLS } = await import('electron-devtools-installer');
        await installExtension(REACT_DEVELOPER_TOOLS);
        console.log('React DevTools installed');
      } catch (err) {
        console.error('Failed to install React DevTools:', err);
      }
    })();

    try {
      require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../../node_modules/.bin/electron'),
        forceHardReset: true,
        hardResetMethod: 'exit',
      });
    } catch {}
    
    win.webContents.openDevTools();
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  killChild();
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (!win) createWindow();
});

app.on('will-quit', killChild);
process.on('exit', killChild);
process.on('SIGINT', () => {
  killChild();
  process.exit();
});

function killChild() {
  if (child) {
    try {
      const kill = require('tree-kill');
      kill(child.pid);
    } catch {}
  }
}

ipcMain.on('app/quit', () => {
  killChild();
  process.exit();
});

ipcMain.on('open-raports-folder', () => {
  const raportsPath = path.join(os.homedir(), 'Documents', 'Raporty');
  if (!existsSync(raportsPath)) mkdirSync(raportsPath, { recursive: true });
  shell.openPath(raportsPath);
});

ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openFile'] });
  return canceled ? null : filePaths[0];
});

ipcMain.on('open-hotspot-menu', () => {
  const platform = os.platform();
  if (platform === 'win32') {
    shell.openExternal('ms-settings:network-mobilehotspot');
  } else if (platform === 'darwin') {
    exec('open "x-apple.systempreferences:com.apple.preference.sharing"', (err) => {
      if (err) console.error('Failed to open settings:', err);
    });
  } else if (platform === 'linux') {
    exec('gnome-control-center wifi', (err) => {
      if (err) console.error('Failed to open network settings:', err);
    });
  } else {
    console.warn('Platform not supported for opening hotspot settings');
  }
});
