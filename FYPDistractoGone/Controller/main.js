const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const { exec } = require('child_process')
const fs = require('fs')


let websitesURLs = [];
let canQuit = true;

const currentOS = process.platform;

if (currentOS === 'darwin') {
  console.log('Running on macOS');
} else if (currentOS === 'win32') {
  console.log('Running on Windows');
} else {
  console.log('Running on', currentOS);
}

const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  win.loadFile('View/HomePage.html')
  win.on('close', (event) => {
    if (!canQuit) {
      event.preventDefault();
    }
  });
  unblockApp('C:\\Program Files (x86)\\Steam\\Steam.exe')
  //blockApp('C:\\Program Files (x86)\\Steam\\Steam.exe')
  // unblockWebsite('om')
  //win.webContents.openDevTools();
  win.setMenu(null)
}


app.whenReady().then(() => {
  createWindow()
})

// app.on('before-quit', (event) => {
//   if (!canQuit) {
//     event.preventDefault();
//   }
// });



ipcMain.on('submit-website', (event, website) => {
  const hostname = new URL(website).hostname;
  if (websitesURLs.includes(hostname)) {
    dialog.showMessageBox({
      type: 'info',
      message: 'This URL is already noted',
      buttons: ['OK']
    })
  } else {
    websitesURLs.push(hostname);
    console.log(websitesURLs)
    event.reply('websitesURLs', websitesURLs);
  }
  
})

ipcMain.on('submit-websiteU', (event, website) => {
  const hostname = new URL(website).hostname;
  if (websitesURLs.includes(hostname)) {
    websitesURLs = websitesURLs.filter((item) => item !== hostname);
    console.log(websitesURLs)
    event.reply('websitesURLs', websitesURLs);
  } else {
    dialog.showMessageBox({
      type: 'info',
      message: 'This URL is not noted',
      buttons: ['OK']
    })
  }
  
})

ipcMain.on('BeginRestriction', (event) => {

  if (websitesURLs === undefined || websitesURLs.length == 0){
    dialog.showMessageBox({
      type: 'info',
      message: 'Please input at least 1 URL before beginning restriction',
      buttons: ['OK']
    })
    
  } else {
    dialog.showMessageBox({
      type: 'info',
      message: 'Restriction begun',
      buttons: ['OK']
    })
    console.log(websitesURLs)
    blockWebsite(websitesURLs)
    canQuit = false;
    const timeoutId = setTimeout(function() {
    canQuit = true;
    unblockWebsite(websitesURLs)
    }, 30000);
  }
  
})

const unblockApp = (appPath) => {

  // Execute a command to unblock the application
  if (process.platform === 'win32') {
    // On Windows, use the 'netsh' utility to remove the firewall rule
    exec(`netsh advfirewall firewall delete rule name="Block ${appPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(error)
      } else {
        console.log(`Unblocked ${appPath}`)
      }
    })
  } else if (process.platform === 'darwin') {
    // On macOS, use the 'pfctl' utility to remove the packet filter rule
    exec(`echo "block drop out log quick on en0 from any to any" | sudo pfctl -df -`, (error, stdout, stderr) => {
      if (error) {
        console.error(error)
      } else {
        console.log(`Unblocked ${appPath}`)
      }
    })
  } else {
    console.log('Unsupported platform')
  }
}



const blockApp = (appPath) => {
  
  // Execute a command to block the application
  if (process.platform === 'win32') {
    // On Windows, use the 'netsh' utility to add a firewall rule
    exec(`netsh advfirewall firewall add rule name="Block ${appPath}" dir=out action=block program="${appPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(error)
      } else {
        console.log(`Blocked ${appPath}`)
      }
    })
  } else if (process.platform === 'darwin') {
    // On macOS, use the 'pfctl' utility to add a packet filter rule
    exec(`echo "block drop out log quick on en0 from any to any" | sudo pfctl -ef -`, (error, stdout, stderr) => {
      if (error) {
        console.error(error)
      } else {
        console.log(`Blocked ${appPath}`)
      }
    })
  } else {
    console.log('Unsupported platform')
  }
}


const blockWebsite = (website) => {
  
  // // Close all Chrome windows
  // exec('taskkill /im chrome.exe /f', (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`${error}`);
  //     return;
  //   }
  //   console.log(`Success: ${stdout}`);
  // });

  // // Close all Firefox windows
  // exec('taskkill /im firefox.exe /f', (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`${error}`);
  //     return;
  //   }
  //   console.log(`Success: ${stdout}`);
  // });

  const command = `echo 127.0.0.1 `
  if (currentOS === 'win32') {
    for (let i = 0; i < website.length; i++) {
      exec(command + website[i] + ` >> C:\\Windows\\System32\\drivers\\etc\\hosts`, (error, stdout, stderr) => {
        if (error) {
          console.error(`${error}`)
          return
        }
        console.log(`Success: ${stdout}`)
      })
    }
  } else {
    for (let i = 0; i < website.length; i++) {
      exec(command + website[i] + ` >> /etc/hosts`, (error, stdout, stderr) => {
        if (error) {
          console.error(`${error}`)
          return
        }
        console.log(`Success: ${stdout}`)
      })
    }
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