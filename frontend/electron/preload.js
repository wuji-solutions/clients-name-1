const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openRaportsFolder: () => ipcRenderer.send('open-raports-folder'),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  openHotspot: () => ipcRenderer.send('open-hotspot-menu'),
});
