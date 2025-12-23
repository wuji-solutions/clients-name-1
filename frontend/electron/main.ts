import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import * as path from 'path';
import * as os from 'os';
import { ChildProcessWithoutNullStreams, exec, spawn } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, unlinkSync, readFileSync } from 'fs';
import * as http from 'http';
import * as fs from 'fs';
import { calculateZoom } from "./calculateZoom";

let win: BrowserWindow | null = null;
let child: ChildProcessWithoutNullStreams;

function killBackend() {
  if (child && !child.killed) {
    const kill = require('tree-kill');
    kill(child.pid);
  }
}

function startStaticServer() {
  const buildPath = path.join(__dirname, '..'); // contains index.html

  const server = http.createServer((req, res) => {
    const requestUrl = req.url ?? '/';

    let filePath = path.join(buildPath, requestUrl === '/' ? 'index.html' : requestUrl);
    if (!fs.existsSync(filePath)) {
      // serve index  .html for all routes so BrowserRouter works
      filePath = path.join(buildPath, 'index.html');
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end('Error');
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(3000, '0.0.0.0', () => {
    console.log('Static server running on port 3000');
  });
}

function createWindow() {
  win = new BrowserWindow({
    width: !app.isPackaged ? 1200 : 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, '..', '..', 'electron', 'preload.js'),
    },
    icon: path.join(__dirname, '..', '..', 'assets/favicon.ico'),
  });

  win.on('close', (e) => {
    if (child && !child.killed) {
      e.preventDefault();
      killBackend();

      setTimeout(() => {
        win?.destroy();
      }, 300);
    }
  });

  win.on("resize", () => {
    if (win === null) return
    const [_, height] = win.getContentSize();
    const zoom = calculateZoom(height);
    win.webContents.setZoomFactor(zoom);
});

  if (!app.isPackaged) {
    win.loadURL('http://localhost:3000');

    const jarName = 'backend.jar';
    const backendPath = path.join(__dirname, '../..', 'backend', jarName);

    child = require('child_process').spawn('java', ['-jar', backendPath]); // NOSONAR
  } else {
    startStaticServer();
    win.loadURL('http://localhost:3000');

    const javaPath = path.join(
      process.resourcesPath,
      'backend',
      'jdk-21.0.9+10-jre',
      'bin',
      'java.exe'
    );
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

    import('electron-devtools-installer')
      .then((module) => {
        const installExtension = module.default;
        const { REACT_DEVELOPER_TOOLS } = module;

        installExtension(REACT_DEVELOPER_TOOLS)
          .then((name: any) => console.log(`Added Extension: ${name}`))
          .catch((err: any) => console.log('An error occurred: ', err));
      })
      .catch((err) => {
        console.log('DevTools installer not available:', err);
      });
  }

  if (!app.isPackaged) {
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
});

ipcMain.handle('set-wifimaxpeers', async (event, maxPeers) => {
  try {
    if (os.platform() !== 'win32') {
      return { success: false, error: 'Ta opcja jest dostępna tylko na systemach Windows.' };
    }

    const n = Number(maxPeers);
    if (!Number.isInteger(n) || n < 1 || n > 255) {
      return { success: false, error: 'Wartość musi zawierać się pomiędzy 1 a 120.' };
    }

    const psCommands = [];
    psCommands.push(`# Set WifiMaxPeers and restart icssvc`);
    psCommands.push(`$ErrorActionPreference = 'Stop'`);
    psCommands.push(`$max = ${n}`);
    psCommands.push(`$regPath = 'HKLM:\\SYSTEM\\CurrentControlSet\\Services\\icssvc\\Settings'`);
    psCommands.push(`If (-not (Test-Path $regPath)) { New-Item -Path $regPath -Force | Out-Null }`);
    psCommands.push(
      `Set-ItemProperty -Path $regPath -Name WifiMaxPeers -Value $max -Type DWord -Force`
    );
    psCommands.push(`Write-Output "Wrote WifiMaxPeers = $max to $regPath"`);
    psCommands.push(
      `Try { Stop-Service -Name icssvc -Force -ErrorAction Stop; Start-Sleep -Seconds 1 } Catch { Write-Output 'Stop-Service failed or service not running.' }`
    );
    psCommands.push(`Start-Service -Name icssvc -ErrorAction Stop`);
    psCommands.push(`Write-Output 'icssvc restarted (if possible).';`);

    const psContent = psCommands.join('\r\n');

    const psPath = path.join(os.tmpdir(), `set-wifimaxpeers-${Date.now()}.ps1`);
    writeFileSync(psPath, psContent, { encoding: 'utf8' });

    const launcherArgs = [
      '-NoProfile',
      '-ExecutionPolicy',
      'Bypass',
      '-Command',
      `Start-Process -FilePath 'powershell.exe' -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File "${psPath}"' -Verb RunAs -Wait`,
    ];

    const child = spawn('powershell.exe', launcherArgs, { windowsHide: true });

    let stdout = '';
    let stderr = '';

    child.stdout &&
      child.stdout.on('data', (d) => {
        stdout += d.toString();
      });
    child.stderr &&
      child.stderr.on('data', (d) => {
        stderr += d.toString();
      });

    const exitCode = await new Promise((resolve) => {
      child.on('error', (err) => {
        resolve({ error: true, message: String(err) });
      });
      child.on('close', (code) => resolve(code));
    });

    try {
      unlinkSync(psPath);
    } catch (e) {}

    if (exitCode !== 0) {
      return { success: false, error: `Błąd: ${exitCode}. Stderr: ${stderr}` };
    }

    return { success: true, stdout, stderr };
  } catch (err) {
    console.error(err);
    return { success: false, error: String(err) };
  }
});

ipcMain.handle('get-wifimaxpeers', async () => {
  try {
    const value = await new Promise((resolve, reject) => {
      exec(
        `powershell -NoProfile -Command "(Get-ItemProperty 'HKLM:\\SYSTEM\\CurrentControlSet\\Services\\icssvc\\Settings').WifiMaxPeers"`,
        (err, stdout) => {
          if (err) return reject(err);

          const value = stdout.trim();

          if (!value) {
            return resolve(8);
          }
          const parsed = parseInt(value, 10);
          resolve(Number.isNaN(parsed) ? 8 : parsed);
        }
      );
    });
    return { success: true, value };
  } catch (err) {
    return { success: false, error: String(err) };
  }
});

ipcMain.handle('isHotspotOn', async () => {
  return await new Promise((resolve) => {
    exec(
      'powershell "(Get-NetAdapter | Where-Object {$_.InterfaceDescription -like \\"*Microsoft Wi-Fi Direct*\\\"}).Status"',
      (err, stdout) => {
        if (err) return resolve(false);

        const status = stdout.trim().toLowerCase();
        resolve(status === 'up');
      }
    );
  });
});

ipcMain.handle('enableHotspot', async (_, { ssid, password, adapter }) => {
  return new Promise((resolve, reject) => {
    const command = `
    netsh wlan set hostednetwork mode=allow ssid="${ssid}" key="${password}"
    netsh wlan start hostednetwork
    Start-Service icssvc
    Set-NetConnectionSharing -ConnectionName "${adapter}" -SharingMode Enable -ShareConnectToInternet $true
    `;

    exec(`powershell -Command "${command}"`, (err, stdout, stderr) => {
      if (err) return reject(stderr);
      resolve(stdout);
    });
  });
});

ipcMain.handle('getHotspotAdapter', async () => {
  return await new Promise((resolve) => {
    const command = `
      Get-NetAdapter |
      Where-Object { $_.Status -eq "Up" } |
      Select-Object -ExpandProperty Name
    `;

    exec(`powershell -Command "${command}"`, (err, stdout) => {
      if (err || !stdout) return resolve(null);

      const adapters = stdout
        .trim()
        .split('\n')
        .map((a) => a.trim());

      const preferredOrder = ['Wi-Fi', 'Ethernet', 'Ethernet 2', 'Cellular'];

      for (const pref of preferredOrder) {
        const match = adapters.find((a) => a === pref);
        if (match) return resolve(match);
      }

      resolve(adapters[0] || null);
    });
  });
});

function getConfigPath() {
  return path.join(app.getPath("userData"), "hotspot-config.json");
}

export function saveHotspotConfig(ssid: string, password: string) {
  try {
    const userDataPath = app.getPath("userData");
    const configPath = getConfigPath();
    
    mkdirSync(userDataPath, { recursive: true });
    
    writeFileSync(
      configPath,
      JSON.stringify({ ssid, password }, null, 2),
      "utf8"
    );
    
    console.log(`Config saved to: ${configPath}`);
  } catch (error) {
    console.error("Failed to save config:", error);
    throw error;
  }
}

export function loadHotspotConfig() {
  try {
    const configPath = getConfigPath();
    
    if (!existsSync(configPath)) {
      return { ssid: "", password: "" };
    }

    return JSON.parse(readFileSync(configPath, "utf8"));
  } catch (error) {
    console.error("Failed to load config:", error);
    return { ssid: "", password: "" };
  }
}

ipcMain.handle("configureHotspot", (_, { ssid, password }) => {
  saveHotspotConfig(ssid, password);
});

ipcMain.handle("getHotspotConfig", () => {
  return loadHotspotConfig();
});

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

ipcMain.handle("getDeviceIP", () => {
  return getLocalIp();
})