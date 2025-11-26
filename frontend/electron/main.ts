import { app, BrowserWindow, ipcMain, shell, dialog } from "electron";
import * as path from "path";
import * as os from "os";
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import { ChildProcessWithoutNullStreams, spawn, exec } from "child_process";
import { existsSync, mkdirSync } from "fs";

let win: BrowserWindow | null = null;
let child: ChildProcessWithoutNullStreams | null = null;

// Safe backend kill
function safeKill(processRef: ChildProcessWithoutNullStreams | null) {
  if (!processRef || typeof processRef.pid !== "number") {
    console.warn("safeKill: backend not running or invalid pid");
    return;
  }

  try {
    const kill = require("tree-kill");
    kill(processRef.pid);
  } catch (err) {
    console.error("Failed to kill backend:", err);
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "..", "..", "electron", "preload.js"),
    },
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    // DEV
    win.loadURL("http://localhost:3000");

    const backendPath = path.join(__dirname, "../..", "backend", "backend.jar");
    child = spawn("java", ["-jar", backendPath]);

  } else {
    // BUILD
    win.loadURL(`file://${__dirname}/../index.html`);

    const binaryName = process.platform === "win32" ? "backend.exe" : "backend";

    // KLUCZOWA POPRAWKA: Electron pakuje EXE do asar.unpacked
    const backendPath = path.join(
      process.resourcesPath,
      "app.asar.unpacked",
      "backend",
      binaryName
    );

    console.log("Launching backend from:", backendPath);

    child = spawn(backendPath);

    child.on("error", (err) => {
      console.error("Failed to launch backend:", err);
    });
  }

  win.on("closed", () => {
    win = null;
  });

  if (child) {
    child.stdout.on("data", (data) => console.log("[BACKEND STDOUT]: " + data));
    child.stderr.on("data", (data) => console.error("[BACKEND STDERR]: " + data));
    child.on("exit", (code) => console.log("Backend exited:", code));
  }

  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension: ${name}`))
    .catch((err) => console.log("DevTools error:", err));
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
