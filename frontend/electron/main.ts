import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { ChildProcessWithoutNullStreams } from 'child_process';

let win: BrowserWindow | null = null;
let child: ChildProcessWithoutNullStreams;

function createWindow() {
    win = new BrowserWindow({
        width: isDev ? 1200 : 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
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

    child.stdout.on('data', (data) => {
        console.log(`[BACKEND STDOUT]: ${data}`);
    });
    child.stderr.on('data', (data) => {
        console.error(`[BACKEND STDERR]: ${data}`);
    });
    child.on('error', (err) => {
        console.error('Failed to start backend subprocess:', err);
    });
    child.on('exit', (code) => {
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
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));

    if (isDev) {
        win.webContents.openDevTools();
    }
}

app.on('ready', createWindow);

ipcMain.on('app/quit', () => {
    if (child) {
        const kill = require('tree-kill');
        kill(child.pid);
    }
    process.exit();
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
