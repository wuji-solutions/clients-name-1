const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openRaportsFolder: () => ipcRenderer.send('open-raports-folder'),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  openHotspot: () => ipcRenderer.send('open-hotspot-menu'),
  setWifiMaxPeers: (n) => ipcRenderer.invoke('set-wifimaxpeers', n),
  getLimit: () => ipcRenderer.invoke("get-wifimaxpeers"),
});
