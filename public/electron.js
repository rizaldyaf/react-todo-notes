const path = require('path');
const fs = require("fs");
const { PARAMS, VALUE,  MicaBrowserWindow, IS_WINDOWS_11, WIN10 } = require('mica-electron')
const { app, BrowserWindow, session, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const isDev = require('electron-is-dev');
const crypto = require("crypto")

function createWindow(){
    mainWindow = new MicaBrowserWindow({
        width: 1200,
        height: 800,
        minWidth:300,
        minHeight:400,
        show:false,
        autoHideMenuBar:true,
        frame:true,
        titleBarStyle:"hidden",
        icon:path.join(__dirname, "app_icon.png"),
        webPreferences: {
          webSecurity: false,
          nodeIntegration: true,
          contextIsolation:true,
          // enableBlinkFeatures: 'webShare',
          preload:path.join(__dirname, "preload.js")
        },
    });

    console.log(path.join(__dirname, "app_icon.png"))

    mainWindow.loadURL(
        isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../build/index.html')}`
    );
    // Open the DevTools.

    mainWindow.setDarkTheme();
    mainWindow.setMicaEffect();

    // mainWindow.webContents.openDevTools({ mode: 'docked' });

    mainWindow.webContents.once('dom-ready', () => {
        mainWindow.show();
    });

    // window event handler
    mainWindow.on("unmaximize", ()=>{
      mainWindow.webContents.send("getWindowState", { isMaximized: false });
    })
    mainWindow.on("maximize", ()=>{
      mainWindow.webContents.send("getWindowState", { isMaximized: true });
    })
}

//IPC Bridge handlers
ipcMain.on("quitApp", ()=>{
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

ipcMain.on("minimizeApp", ()=>{
  mainWindow.focus()
  mainWindow.minimize()
})

ipcMain.on("maximizeApp", ()=>{
  mainWindow.focus()

  if (mainWindow.isMinimized()) {
    mainWindow.show()
  }

  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow.maximize()
  }
})

ipcMain.handle("getWindowState", (event)=>{
  console.log("getting window state")
  return mainWindow.isMaximized()
})

ipcMain.on("testNativeNotif", ()=> {
  let iconPath = app.getAppPath().split("\\resources\\")[0]+"\\public\\asteris_icon.png"
  let notif = new Notification({
    title:"This is test",
    body:"Lorem ipsum dolor sit amet",
    icon:iconPath
  })
  notif.show()
})

ipcMain.handle("isDev", (event)=>{
  return isDev
})

ipcMain.handle("encryptData", (e, password, plainText)=>{
  let encData         = []
  const salt          = crypto.randomBytes(16)
  const iv            = crypto.randomBytes(16)
  const aesKey        = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256")
  const aesKeyBuffer  = Buffer.from(aesKey)
  const cipher        = crypto.createCipheriv("aes-256-cbc", aesKeyBuffer, iv)
  let encryptedContent  = cipher.update(plainText, "utf8", "hex")
  encryptedContent      += cipher.final("hex")
  encData.push(Buffer.from(iv).toString("base64"))
  encData.push(Buffer.from(salt).toString("base64"))
  encData.push(encryptedContent)
  return encData.join("-")
})

ipcMain.handle("decryptData", (e, password, cipherText)=>{
  let encData     = cipherText.split("-")
  try {
    const iv        = Buffer.from(encData[0], "base64")
    const salt      = Buffer.from(encData[1], "base64")
    const content   = encData[2]
    const aesKey    = crypto.pbkdf2Sync(password, Buffer.from(salt, "hex"), 100000, 32, "sha256");
    const decipher  = crypto.createDecipheriv("aes-256-cbc", aesKey, Buffer.from(iv, "hex"));
  
    let decrypted   = decipher.update(content, "hex", "utf8");
    decrypted       += decipher.final("utf8");
    return {
      status:"success",
      plainText:decrypted
    };
  } catch (err) {
    console.error(err)
    return {
      status:"error",
      plainText:null
    }
  }
  
})

ipcMain.on("saveData", (event, data)=>{
  let userConfigPath = path.join(app.getPath('userData'), 'data.json');

  fs.writeFile(userConfigPath, JSON.stringify(data), (err)=>{
    if (err) {
      console.log("writefile error")
      dialog.showMessageBox({
        type: 'error',
        buttons: ['OK'],
        defaultId: 0,
        title: 'Data Saving Failed',
        message: 'There\'s an error while saving data, please check the app permissions settings on your PC',
        showInputBox: false,
      }).then((result) => {})
    } else {
      console.log("writefile success")
    }
  })
})

ipcMain.handle("getData", (event)=>{
  let userConfigPath = path.join(app.getPath('userData'), 'data.json');
  return userConfigPath
})




//main Process
// Object.defineProperty(app, 'isPackaged', { get(){ return true }})

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});