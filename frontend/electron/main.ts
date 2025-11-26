import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import * as path from 'path';
import * as os from 'os';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { ChildProcessWithoutNullStreams, exec } from 'child_process';
import { existsSync, mkdirSync } from 'fs';

let win: BrowserWindow | null = null;
let child: ChildProcessWithoutNullStreams | null = null;

function safeKill(child: ChildProcessWithoutNullStreams | null) {
  if (!child || typeof child.pid !== 'number') {
    console.warn("Cannot kill backend: no PID");
    return;
  }
  try {
    const kill = require('tree-kill');
    kill(child.pid);
  } catch (e) {
    console.error("Failed to kill backend:", e);
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, '..', '..', 'electron', 'preload.js'),
    },
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    win.loadURL('http://localhost:3000');

    const backendPath = path.join(__dirname, '../..', 'backend', 'backend.jar');
    child = require('child_process').spawn('java', ['-jar', backendPath]);

  } else {
    win.loadURL(`file://${__dirname}/../index.html`);

    // 🟦 KLUCZOWA POPRAWKA — backend MUSI BYĆ IN UNPACKED
    const binaryName = process.platform === 'win32' ? 'backend.exe' : 'backend';
    const backendPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'backend', binaryName);

    console.log("Backend path:", backendPath);

    child = require('child_process').spawn(backendPath);

    child.on('error', err => {
      console.error("Failed to launch backend:", err);
    });
  }

  win.on('closed', () => (win = null));

  if (child) {
    child.stdout.on('data', data => console.log("[BACKEND STDOUT]: " + data));
    child.stderr.on('data', data => console.error("[BACKEND STDERR]: " + data));
    child.on('exit', code => console.log("Backend exited:", code));
  }

  installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => console.log(`Added Extension:  ${name}`))
    .catch(err => console.log('An error occurred: ', err));
}

app.on('ready', createWindow);

app.on('will-quit', () => safeKill(child));

ipcMain.on('app/quit', () => {
  safeKill(child);
  process.exit();
});

process.on('exit', () => safeKill(child));
process.on('SIGINT', () => {
  safeKill(child);
  process.exit();
});

app.on('window-all-closed', () => {
  safeKill(child);
  if (process.platfor
