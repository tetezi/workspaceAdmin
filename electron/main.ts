import { app, BrowserWindow, Menu } from "electron";
import path from "node:path";
import { fileURLToPath } from "url";
let win: BrowserWindow | null = null;

function handleSquirrelEvent() {
  // 没有 Squirrel 特殊参数时，直接跳过
  if (process.argv.length === 1) return false;

  const exeName = path.basename(process.execPath);
  // 找到 Squirrel 的 Update.exe 路径（和你的应用同目录的上级）
  const updateExe = path.resolve(
    path.dirname(process.execPath),
    "..",
    "Update.exe",
  );

  // 调用 Update.exe 来创建/删除快捷方式
  const spawnUpdate = (args) => {
    try {
      require("child_process")
        .spawn(updateExe, args, { detached: true })
        .unref();
    } catch (err) {
      console.error("Squirrel 调用失败:", err);
    }
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case "--squirrel-install":
    case "--squirrel-updated":
      // 安装/更新完成：创建快捷方式 → 1秒后退出应用
      spawnUpdate(["--createShortcut", exeName]);
      setTimeout(() => app.quit(), 1000);
      return true;

    case "--squirrel-uninstall":
      // 卸载时：删除快捷方式 → 退出
      spawnUpdate(["--removeShortcut", exeName]);
      setTimeout(() => app.quit(), 1000);
      return true;

    case "--squirrel-obsolete":
      // 应用被新版覆盖时：直接退出
      app.quit();
      return true;
  }
  return false;
}

// 先处理 Squirrel 事件，如果是安装/更新场景，就不会走到下面的窗口创建逻辑

const isFirstInstance = app.requestSingleInstanceLock();
if (handleSquirrelEvent()) {
  app.quit();
  process.exit(0);
} else if (!isFirstInstance) {
  app.quit();
  process.exit(0);
} else {
  init();
}
function createWindow() {
  Menu.setApplicationMenu(null);
  win = new BrowserWindow({
    width: 1200,
    height: 800,

    webPreferences: {
      preload: path.join(
        path.join(fileURLToPath(import.meta.url)),
        "../preload/index.js",
      ),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(
      path.join(fileURLToPath(import.meta.url), "../../dist/index.html"),
    );
  }

  win.on("closed", () => {
    win = null;
  });
}

function init() {
  app.whenReady().then(createWindow);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
  app.on("second-instance", () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });
}
