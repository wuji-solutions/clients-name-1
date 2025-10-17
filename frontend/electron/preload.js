console.log('✅ Preload script loaded!');

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openRaportsFolder: () => ipcRenderer.send('open-raports-folder'),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
});
