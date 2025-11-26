import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import * as path from 'path';
import * as os from 'os';
import * as http from "http";
import * as fs from "fs";
import { ChildProcessWithoutNullStreams, exec } from 'child_process';
import { existsSync, mkdirSync } from 'fs';

let win: BrowserWindow | null = null;
let child: ChildProcessWithoutNullStreams;

function startStaticServer() {
  const buildPath = path.join(__dirname, ".."); // contains index.html

  const server = http.createServer((req, res) => {
    const requestUrl = req.url ?? "/";

    let filePath = path.join(
      buildPath,
      requestUrl === "/" ? "index.html" : requestUrl
    );
    if (!fs.existsSync(filePath)) {
      // serve index  .html for all routes so BrowserRouter works
      filePath = path.join(buildPath, "index.html");
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end("Error");
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(3000, () => {
    console.log("Static server running on http://localhost:3000");
  });
}

function createWindow() {
  win = new BrowserWindow({
    width: !app.isPackaged ? 1200 : 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "..", "..", "electron", "preload.js"),
    },
  });

  const isDev = !app.isPackaged;

  if (!app.isPackaged) {
    win.loadURL('http://localhost:3000');

    const backendPath = path.join(__dirname, "../..", "backend", "backend.jar");
    child = spawn("java", ["-jar", backendPath]);

  } else {
    startStaticServer();
    win.loadURL("http://localhost:3000");

    const javaPath = path.join(process.resourcesPath, 'backend', 'jdk-21.0.9+10-jre','bin', 'java.exe');
    const binaryName = 'backend.jar';
    const backendPath = path.join(process.resourcesPath, 'backend', binaryName);

    child = require('child_process').spawn(javaPath, ['-jar', backendPath]);
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
  if (!app.isPackaged) {
    // 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      forceHardReset: true,
      hardResetMethod: 'exit',
    });

    import('electron-devtools-installer').then((module) => {
          const installExtension = module.default;
          const { REACT_DEVELOPER_TOOLS } = module;
          
          installExtension(REACT_DEVELOPER_TOOLS)
            .then((name: any) => console.log(`Added Extension: ${name}`))
            .catch((err: any) => console.log('An error occurred: ', err));
        }).catch(err => {
          console.log('DevTools installer not available:', err);
        });

  }

  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }
}

app.on("ready", createWindow);

app.on("will-quit", () => safeKill(child));

ipcMain.on("app/quit", () => {
  safeKill(child);
  process.exit();
});

process.on("exit", () => safeKill(child));
process.on("SIGINT", () => {
  safeKill(child);
  process.exit();
});

app.on("window-all-closed", () => {
  safeKill(child);
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (win === null) createWindow();
});

// dialogs
ipcMain.handle("dialog:openFile", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
  });
  return canceled ? null : filePaths[0];
});

// raporty
ipcMain.on("open-raports-folder", () => {
  const userHome = os.homedir();
  const raportsPath = path.join(userHome, "Documents", "Raporty");

  if (!existsSync(raportsPath)) {
    mkdirSync(raportsPath, { recursive: true });
  }

  shell.openPath(raportsPath);
});

// hotspot
ipcMain.on("open-hotspot-menu", () => {
  const platform = os.platform();

  if (platform === "win32") {
    shell.openExternal("ms-settings:network-mobilehotspot");

  } else if (platform === "darwin") {
    exec('open "x-apple.systempreferences:com.apple.preference.sharing"', (err) => {
      if (err) console.error("Failed to open macOS settings:", err);
    });

  } else if (platform === "linux") {
    exec("gnome-control-center wifi", (err) => {
      if (err) console.error("Failed to open Linux settings:", err);
    });

  } else {
    console.warn("Platform not supported for hotspot menu");
  }
});
