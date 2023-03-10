const { app, ipcMain, session, BrowserWindow, shell } = require("electron");
const fs = require("fs-extra");
const {
  downloadFile,
  downloadStatus,
  downloadClose,
} = require("./downloadFile");
const generateUUID = require("./generateUUID");
const execa = import("execa");

const ipcMethods = () => {
  ipcMain.handle("availSpellLangs", async () => {
    return session.defaultSession.availableSpellCheckerLanguages;
  });

  ipcMain.handle("getSpellLangs", async () => {
    return session.defaultSession.getSpellCheckerLanguages();
  });

  ipcMain.handle("setSpellLangs", async (event, langs) => {
    session.defaultSession.setSpellCheckerLanguages(langs);
  });

  ipcMain.handle("customList", async () => {
    return session.defaultSession.listWordsInSpellCheckerDictionary();
  });

  ipcMain.handle("customRemove", async (event, word) => {
    session.defaultSession.removeWordFromSpellCheckerDictionary(word);
  });

  ipcMain.handle("customAdd", async (event, word) => {
    session.defaultSession.addWordToSpellCheckerDictionary(word);
  });

  ipcMain.handle("isWindows", async () => {
    return process.platform === "win32";
  });

  ipcMain.handle("isProcessRunning", async (event, name) => {
    const platformMap = new Map([
      ["win32", "tasklist"],
      ["darwin", `ps -ax | grep ${name}`],
      ["linux", `ps -A`],
    ]);
    const cmd = platformMap.get(process.platform);
    return new Promise((resolve, reject) => {
      require("child_process").exec(cmd, (err, stdout, stderr) => {
        if (err) reject(err);

        resolve(stdout.toLowerCase().indexOf(name.toLowerCase()) > -1);
      });
    });
  });

  ipcMain.handle("temp", async () => {
    return app.getPath("temp").replace(/\\/g, "/");
  });

  ipcMain.handle("execPath", async () => {
    return process.helperExecPath.replace(/\\/g, "/");
  });

  ipcMain.handle("getPath", async (event, name) => {
    return app.getPath(name).replace(/\\/g, "/");
  });

  ipcMain.handle("exitApp", async () => {
    app.exit();
  });

  ipcMain.handle("relaunchApp", async () => {
    app.relaunch();
  });

  ipcMain.handle("closeApp", async () => {
    for (let w of BrowserWindow.getAllWindows()) {
      w.close();
    }
  });

  ipcMain.handle("appData", async () => {
    return process.env.AppData;
  });

  ipcMain.handle("createFolder", async (event, folder) => {
    try {
      fs.statSync(folder);
    } catch (err) {
      if (err.code === "ENOENT") fs.mkdirSync(folder, { recursive: true });
    }
  });

  ipcMain.handle("exists", async (event, name) => {
    return fs.existsSync(name);
  });

  ipcMain.handle("stat", async (event, filePath) => {
    try {
      const stats = fs.statSync(filePath);
      return JSON.stringify(stats);
    } catch (err) {
      return JSON.stringify(err);
    }
  });

  ipcMain.handle("read", async (event, filePath, options) => {
    return fs.readFileSync(filePath, options);
  });

  ipcMain.handle("write", async (event, filePath, data, options) => {
    return fs.writeFileSync(filePath, data, { encoding: "utf-8", ...options });
  });

  ipcMain.handle("append", async (event, filePath, data) => {
    return fs.open(filePath, "a", (err, fd) => {
      if (err) throw err;
      fs.writeFile(fd, data, err => {
        fs.close(fd, err => {
          if (err) throw err;
        });
        if (err) throw err;
      });
    });
  });

  ipcMain.handle("delete", async (event, filePath) => {
    return await fs.unlink(filePath);
  });

  ipcMain.handle("copyFile", async (event, from, to) => {
    return await fs.copyFile(from, to);
  });

  ipcMain.handle("times", async (event, filePath, create, update) => {
    return await fs.utimes(filePath, create, update);
  });

  ipcMain.handle("readDir", async (event, folder) => {
    try {
      return fs.readdirSync(folder);
    } catch (err) {
      return JSON.stringify(err);
    }
  });

  const convert = require("xml-js");

  ipcMain.handle("fileJson", async (event, settings) => {
    if (fs.existsSync(settings)) {
      const data = fs.readFileSync(settings, "utf-8");
      return convert.xml2json(data, { compact: true, spaces: 2 });
      // return JSON.parse(jsonStr);
    }
    return null;
  });

  ipcMain.handle("openExternal", async (event, cmd) => {
    return await shell.openExternal(cmd);
  });

  ipcMain.handle("openPath", async (event, cmd) => {
    return await shell.openPath(cmd);
  });

  ipcMain.handle("exec", async (event, cmd, args, opts) => {
    return JSON.stringify(await execa(cmd, args, opts));
  });

  ipcMain.handle("exeCmd", async (event, cmd, opts) => {
    return JSON.stringify(await execa.command(cmd, opts));
  });

  ipcMain.handle("downloadFile", async (event, url, localFile) => {
    if (process.platform === "win32")
      localFile = localFile.replace(/\//g, "\\");
    try {
      await downloadFile(url, localFile);
      return;
    } catch (err) {
      return JSON.stringify(err);
    }
  });

  ipcMain.handle("downloadLaunch", async (event, url, localFile) => {
    if (process.platform === "win32")
      localFile = localFile.replace(/\//g, "\\");
    const token = generateUUID();
    downloadFile(url, localFile, token);
    return token;
  });

  ipcMain.handle("downloadStat", async (event, token) => {
    return downloadStatus(token);
  });

  ipcMain.handle("downloadClose", async (event, token) => {
    downloadClose(token);
    return;
  });
};

module.exports = ipcMethods;
