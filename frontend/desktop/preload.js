const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("desktopAPI", {
  isDesktop: true,
  platform: process.platform,
  openFileDialog: () => ipcRenderer.invoke("dialog:openFile"),
  saveFileDialog: (defaultName) => ipcRenderer.invoke("dialog:saveFile", defaultName),
  onNavigate: (callback) => {
    const subscription = (event, path) => callback(path);
    ipcRenderer.on("navigate-to", subscription);
    return () => ipcRenderer.removeListener("navigate-to", subscription);
  },
  onExport: (callback) => {
    const subscription = () => callback();
    ipcRenderer.on("trigger-export", subscription);
    return () => ipcRenderer.removeListener("trigger-export", subscription);
  },
});
