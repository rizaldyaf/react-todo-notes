const {contextBridge,ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electron', {
    //app manager
    quitApp:()=>{ipcRenderer.send("quitApp")},
    minimizeApp:()=>{ipcRenderer.send("minimizeApp")},
    maximizeApp:()=>{ipcRenderer.send("maximizeApp")},
    getWindowState:(callback) => ipcRenderer.on("getWindowState", callback),
    isDev:()=>ipcRenderer.invoke("isDev"),

    //data management
    saveData:(data)=>{ipcRenderer.send("saveData", data)},
    getData:()=>ipcRenderer.invoke("getData"),

    //codec
    encryptData:(password, plainText)=>ipcRenderer.invoke("encryptData", password, plainText),
    decryptData:(password, cipherText)=>ipcRenderer.invoke("decryptData", password, cipherText),

    //notification
    testNotification:()=>{ipcRenderer.send("testNativeNotif")},
});