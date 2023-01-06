const { app, BrowserWindow, ipcMain } = require('electron')
const { exec } = require('child_process')
const fs = require('fs')


let websitesURLs = [];

const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  

  win.loadFile('View/HomePage.html')
  // unblockWebsite('om')
  win.webContents.openDevTools();
  win.setMenu(null)
}

app.whenReady().then(() => {
  createWindow()
})

ipcMain.on('submit-website', (event, website) => {
  const hostname = new URL(website).hostname;
  websitesURLs.push(hostname);
  console.log(websitesURLs)

})

ipcMain.on('submit-websiteU', (event, website) => {
  const hostname = new URL(website).hostname;
  websitesURLs = websitesURLs.filter((item) => item !== hostname);
  console.log(websitesURLs)

})

ipcMain.on('BeginRestriction', (event, input) => {
  console.log(input)
  console.log(websitesURLs)
  blockWebsite(websitesURLs)
  const timeoutId = setTimeout(function() {
    unblockWebsite(websitesURLs)
  }, 30000);
})


const blockWebsite = (website) => {

//   // Close all Chrome windows
// exec('taskkill /im chrome.exe /f', (error, stdout, stderr) => {
//   if (error) {
//     console.error(`${error}`);
//     return;
//   }
//   console.log(`Success: ${stdout}`);
// });

// const { exec } = require('child_process');

// // Close all Firefox windows
// exec('taskkill /im firefox.exe /f', (error, stdout, stderr) => {
//   if (error) {
//     console.error(`${error}`);
//     return;
//   }
//   console.log(`Success: ${stdout}`);
// });

  const command = `echo 127.0.0.1 `
  for (let i = 0; i < website.length; i++) {
  exec(command + website[i] + ` >> C:\\Windows\\System32\\drivers\\etc\\hosts`, (error, stdout, stderr) => {
    if (error) {
      console.error(`${error}`)
      return
    }
    console.log(`Success: ${stdout}`)
  })
  }
}

const unblockWebsite = (websites) => {
  // Check if websites is an array
  if (!Array.isArray(websites)) {
    console.error('Error: websites must be an array');
    return;
  }

  // Read content
  fs.readFile('C:\\Windows\\System32\\drivers\\etc\\hosts', 'utf8', (error, data) => {
    if (error) {
      console.error(`Error: ${error}`);
      return;
    }

    // Split contents on new line
    const lines = data.split('\n');

    // Find lines that contain any of the websites
    const filteredLines = lines.filter((line) => !websites.some((website) => line.includes(website)));

    // Join split lines into string
    const modifiedData = filteredLines.join('\n');

    // Write back to hosts file
    fs.writeFile('C:\\Windows\\System32\\drivers\\etc\\hosts', modifiedData, (error) => {
      if (error) {
        console.error(`${error}`);
        return;
      }
      console.log('Success: websites unblocked');
    });
  });
};