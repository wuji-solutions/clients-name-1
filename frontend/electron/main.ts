import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import * as path from 'path';
import * as os from 'os';
import * as isDev from 'electron-is-dev';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { ChildProcessWithoutNullStreams, exec } from 'child_process';
import { existsSync, mkdirSync } from 'fs';

let win: BrowserWindow | null = null;
let child: ChildProcessWithoutNullStreams;

function createWindow() {
  win = new BrowserWindow({
    width: isDev ? 1200 : 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, '..', '..', 'electron', 'preload.js'),
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:3000');

    const jarName = 'backend.jar';
    const backendPath = path.join(__dirname, '../..', 'backend', jarName);

    child = require('child_process').spawn('java', ['-jar', backendPath]); // NOSONAR
  } else {
    win.loadURL(`file://${__dirname}/../index.html`); // potentially doesnt work xpp

    const binaryName = process.platform === 'win32' ? 'backend.exe' : 'backend';
    const backendPath = path.join(process.resourcesPath, 'backend', binaryName);

    child = require('child_process').spawn(backendPath);
  }

  win.on('closed', () => (win = null));

  child.stdout.on('data', (data: any) => {
    console.log(`[BACKEND STDOUT]: ${data}`);
  });
  child.stderr.on('data', (data: any) => {
    console.error(`[BACKEND STDERR]: ${data}`);
  });
  child.on('error', (err: any) => {
    console.error('Failed to start backend subprocess:', err);
  });
  child.on('exit', (code: any) => {
    console.log(`Backend exited with code ${code}`);
  });

  // Hot Reloading
  if (isDev) {
    // 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      forceHardReset: true,
      hardResetMethod: 'exit',
    });
  }

  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name: any) => console.log(`Added Extension:  ${name}`))
    .catch((err: any) => console.log('An error occurred: ', err));

  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.on('ready', createWindow);

app.on('will-quit', () => {
  if (child) child.kill();
});

ipcMain.on('app/quit', () => {
  if (child) {
    const kill = require('tree-kill');
    kill(child.pid);
  }
  process.exit();
});

ipcMain.on('open-raports-folder', () => {
  const userHome = os.homedir();
  const raportsPath = path.join(userHome, 'Documents', 'Raporty');

  if (!existsSync(raportsPath)) {
    mkdirSync(raportsPath, { recursive: true });
  }

  shell.openPath(raportsPath);
});

process.on('exit', () => {
  if (child) {
    const kill = require('tree-kill');
    kill(child.pid);
  }
});

process.on('SIGINT', () => {
  if (child) {
    const kill = require('tree-kill');
    kill(child.pid);
  }
  process.exit();
});

app.on('window-all-closed', () => {
  if (child) {
    const kill = require('tree-kill');
    kill(child.pid);
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
  });
  if (canceled) {
    return null;
  } else {
    return filePaths[0];
  }
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
        if (err) {
          console.error('Failed to open network settings:', err);
        }
      });
    } else {
      console.warn('Platform not supported for opening hotspot settings');
    }
})
