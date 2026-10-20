const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require("electron");
const path = require("path");
const fs = require("fs");

// Single-instance lock (guarantee only one instance of BizInsight runs)
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  let mainWindow = null;

  function createWindow() {
    // Window state file path
    const userDataPath = app.getPath("userData");
    const windowStatePath = path.join(userDataPath, "window-state.json");

    let windowBounds = { width: 1400, height: 900, x: undefined, y: undefined };
    try {
      if (fs.existsSync(windowStatePath)) {
        windowBounds = JSON.parse(fs.readFileSync(windowStatePath, "utf-8"));
      }
    } catch (e) {
      // Use defaults if corrupt
    }

    mainWindow = new BrowserWindow({
      title: "BizInsight – Decision Support System",
      width: windowBounds.width || 1400,
      height: windowBounds.height || 900,
      x: windowBounds.x,
      y: windowBounds.y,
      minWidth: 1024,
      minHeight: 700,
      backgroundColor: "#F8FAFC",
      show: false, // Show gracefully once ready
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
      },
    });

    // Save window state on move/resize
    const saveState = () => {
      try {
        if (!mainWindow.isMaximized() && !mainWindow.isMinimized()) {
          fs.writeFileSync(windowStatePath, JSON.stringify(mainWindow.getBounds()));
        }
      } catch (err) {
        // ignore
      }
    };

    mainWindow.on("resize", saveState);
    mainWindow.on("move", saveState);

    // Load Next.js production server or development server
    const startUrl = process.env.ELECTRON_START_URL || "http://localhost:3000";
    mainWindow.loadURL(startUrl);

    mainWindow.once("ready-to-show", () => {
      mainWindow.show();
    });

    mainWindow.on("closed", () => {
      mainWindow = null;
    });

    // Native Application Menu configuration
    const template = [
      {
        label: "File",
        submenu: [
          {
            label: "Export Current Statement...",
            accelerator: "CmdOrCtrl+E",
            click: () => mainWindow.webContents.send("trigger-export"),
          },
          {
            label: "Print View...",
            accelerator: "CmdOrCtrl+P",
            click: () => mainWindow.webContents.print(),
          },
          { type: "separator" },
          { role: "quit" },
        ],
      },
      {
        label: "View",
        submenu: [
          {
            label: "Dashboard",
            accelerator: "CmdOrCtrl+1",
            click: () => mainWindow.webContents.send("navigate-to", "/"),
          },
          {
            label: "Sales Analytics",
            accelerator: "CmdOrCtrl+2",
            click: () => mainWindow.webContents.send("navigate-to", "/sales"),
          },
          {
            label: "Customers & RFM",
            accelerator: "CmdOrCtrl+3",
            click: () => mainWindow.webContents.send("navigate-to", "/customers"),
          },
          {
            label: "Inventory & Catalog",
            accelerator: "CmdOrCtrl+4",
            click: () => mainWindow.webContents.send("navigate-to", "/inventory"),
          },
          {
            label: "Decision Insights",
            accelerator: "CmdOrCtrl+5",
            click: () => mainWindow.webContents.send("navigate-to", "/insights"),
          },
          {
            label: "Reports & Data",
            accelerator: "CmdOrCtrl+6",
            click: () => mainWindow.webContents.send("navigate-to", "/reports"),
          },
          { type: "separator" },
          { role: "reload" },
          { role: "forceReload" },
          { role: "toggleDevTools" },
          { type: "separator" },
          { role: "togglefullscreen" },
        ],
      },
      {
        label: "Tools",
        submenu: [
          {
            label: "Settings...",
            accelerator: "CmdOrCtrl+,",
            click: () => mainWindow.webContents.send("navigate-to", "/settings"),
          },
        ],
      },
      {
        label: "Help",
        submenu: [
          {
            label: "Documentation & KPI Dictionary",
            click: () => shell.openExternal("https://github.com/BizInsight/docs"),
          },
          {
            label: "About BizInsight",
            click: () => {
              dialog.showMessageBox(mainWindow, {
                type: "info",
                title: "About BizInsight",
                message: "BizInsight Desktop v1.0.0",
                detail: "Business Analytics & Decision Support System\nEngineered with Next.js, FastAPI, and MySQL 8.",
              });
            },
          },
        ],
      },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  app.on("second-instance", () => {
    // Focus existing window if a second launch is attempted
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(createWindow);

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Native File Dialog IPC Handlers
  ipcMain.handle("dialog:openFile", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: "Select CSV File for Batch Ingestion",
      properties: ["openFile"],
      filters: [{ name: "CSV Files", extensions: ["csv"] }],
    });
    if (canceled) return null;
    return filePaths[0];
  });

  ipcMain.handle("dialog:saveFile", async (event, defaultName) => {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: "Export Reconciled Statement",
      defaultPath: defaultName || "BizInsight_Export.csv",
      filters: [
        { name: "CSV Document", extensions: ["csv"] },
        { name: "Excel Spreadsheet", extensions: ["xlsx"] },
      ],
    });
    if (canceled) return null;
    return filePath;
  });
}
