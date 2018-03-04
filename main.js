const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

// electron live reload
require('electron-reload')(__dirname);

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // load the dist folder from Angular
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools optionally:
  // win.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
