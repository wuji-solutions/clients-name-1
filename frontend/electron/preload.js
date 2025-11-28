const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openRaportsFolder: () => ipcRenderer.send('open-raports-folder'),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  openHotspot: () => ipcRenderer.send('open-hotspot-menu'),
  setWifiMaxPeers: (n) => ipcRenderer.invoke('set-wifimaxpeers', n),
  getLimit: () => ipcRenderer.invoke("get-wifimaxpeers"),
  isHotspotOn: () => ipcRenderer.invoke('isHotspotOn'),
  enableHotspot: (ssid, password, adapter) => ipcRenderer.invoke('enableHotspot', '', { ssid, password, adapter }),
  getHotspotAdapter: () => ipcRenderer.invoke('getHotspotAdapter'),
  configureHotspot: (ssid, password) => ipcRenderer.invoke('configureHotspot', { ssid, password }),
  getHotspotConfig: () => ipcRenderer.invoke('getHotspotConfig'),
});
