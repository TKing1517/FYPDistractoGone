const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path');
const { exec } = require('child_process')
const fs = require('fs')
const {connection,selectFromTable,insertIntoStudent} = require('../Model/db.js');

// selectFromTable("Student", "*");
// selectFromTable("Student", "*","WHERE StudentID = 1");

// insertIntoTable("Student","TestUserName","TestPassword","TestEmail@Email.com",666,1000000);

let websitesURLs = [];
let canQuit = true;
let appsToBlock = [];
let UserPoints =0;
let GivePoints;
let isIntervalActive = false;



const currentOS = process.platform;

if (currentOS === 'darwin') {
  console.log('Running on macOS');
} else if (currentOS === 'win32') {
  console.log('Running on Windows');
} else {
  console.log('Running on', currentOS);
}

let win;
const createWindow = () => {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  win.loadFile('View/SignUp.html')
  win.on('close', (event) => {
    if (!canQuit) {
      event.preventDefault();
    }
  });
  win.setMenu(null)
}

app.whenReady().then(() => {
  createWindow()
})

ipcMain.on('CreateUser', (event,Email,UserName,Password) => {
  //Check if username already exists.
  selectFromTable(`Student`, "*",`Username = "${UserName}"`,(results) => {
    if(results.length === 0) {
      //does not exist.
      insertIntoStudent("Student",UserName,Password,Email,0,0);
      win.loadFile('View/HomePage.html')
    } else {
      //exists.
      dialog.showMessageBox({
        type: 'info',
        message: 'The username already exists.',
        buttons: ['OK']
      })
    }
  });
});

ipcMain.on('submit-website', (event, website) => {
  if (canQuit === false){
    dialog.showMessageBox({
      type: 'info',
      message: 'Restriction is currently running',
      buttons: ['OK']
    })
  } else {
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
  }
})

ipcMain.on('submit-websiteU', (event, website) => {
  if (canQuit === false){
    dialog.showMessageBox({
      type: 'info',
      message: 'Restriction is currently running',
      buttons: ['OK']
    })
  } else {
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
  }
})

ipcMain.on('RefreshList', (event) => {
  event.reply('websitesURLs', websitesURLs);
  event.reply('appsToBlock', appsToBlock);
})

ipcMain.on('RefreshVariables', (event) => {
  event.reply('Points', UserPoints);
})

ipcMain.on('FileSelector', (event) => {
  if (canQuit === false){
    dialog.showMessageBox({
      type: 'info',
      message: 'Restriction is currently running',
      buttons: ['OK']
    })
  } else {
    //open file explorer with only folders and .exe files
    const options = {
      title: 'Select a file',
      buttonLabel: 'Open',
      defaultPath: 'C:\\',
      filters: [
        { name: 'Executables', extensions: ['exe'] }
      ],
      properties: ['openFile']
    };

    dialog.showOpenDialog(options).then(result => {
      if(!result.canceled) {
        //Convert selected file path to .exe file only
        result.filePaths.forEach(filePath => {
          let NameofApp = path.basename(filePath);
          //If app is already in appsToBlock, remove it
          if (appsToBlock.includes(NameofApp)) {
            appsToBlock = appsToBlock.filter((item) => item !== NameofApp);
            dialog.showMessageBox({
              type: 'info',
              message: 'Removed app: ' + NameofApp,
              buttons: ['OK']
            })
          } else {
            //else
            //Add selected .exe file to appsToBlock array
            appsToBlock.push(NameofApp);
          }
        });
        console.log(appsToBlock);
        //event trigger to update some other things
        event.reply('appsToBlock', appsToBlock);
      }
    });
  }
  
})

ipcMain.on('BeginRestriction', (event) => {
  //Restriction cannot begin if its already running
  if (canQuit === false){
    dialog.showMessageBox({
      type: 'info',
      message: 'Restriction is already running',
      buttons: ['OK']
    })
  } else {
    if (websitesURLs === undefined || websitesURLs.length == 0){
      if (appsToBlock === undefined || appsToBlock.length == 0){
        dialog.showMessageBox({
          type: 'info',
          message: 'Please input at least 1 URL/App before beginning restriction',
          buttons: ['OK']
        })
      } else {
        dialog.showMessageBox({
          type: 'info',
          message: 'Restriction begun',
          buttons: ['OK']
        })
        canQuit = false;
        //The restriction will begin and last for 30 seconds, 
        //after which the restriction will end and the user will be able to quit out of the app again.
        const timeoutId = setTimeout(function() {
          canQuit = true;
        }, 30000);
      }      
    } else {
      dialog.showMessageBox({
        type: 'info',
        message: 'Restriction begun',
        buttons: ['OK']
      })
      console.log(websitesURLs)
      blockWebsite(websitesURLs)
      canQuit = false;
      //The restriction will begin and last for 30 seconds, 
      //after which the restriction will end and the user will be able to quit out of the app again.
      const timeoutId = setTimeout(function() {
        canQuit = true;
        unblockWebsite(websitesURLs)
      }, 30000);
    }
  } 
})

const killtask = setInterval(() => {
  if (canQuit=== false){
    appsToBlock.forEach(app => {
      // check if the process is running
      exec(`tasklist /FI "IMAGENAME eq ${app}"`, (err, stdout) => {
          if (err) {
              console.error(err);
              return;
          }
          if (stdout.includes(app)) {
              // process is running, kill it
              exec(`taskkill /IM ${app} /F`, (err, stdout, stderr) => {
                  if (err) {
                      console.error(err);
                      return;
                  }
                  console.log(`${app} process closed`);
              });
          }
      });
  });
  }
}, 1500);  

const startPoints = () => {
  if (!isIntervalActive && canQuit === false) {
    GivePoints = setInterval(() => {
      //Assign points every 20 secs(currently arbitrary values)
      UserPoints += 1000;
      win.webContents.reload();
      console.log(UserPoints);
    }, 20000);
    isIntervalActive = true;
  }
}
const stopPoints = () => {
  if (isIntervalActive && canQuit === true) {
    //stop giving points if restriction is no longer running
    clearInterval(GivePoints);
    isIntervalActive = false;
  }
}
setInterval(() => {
  //canQuit can be used to determine if restriction is running.
  if (canQuit) {
    // not running
    stopPoints();
  } else {
    // is running
    startPoints();
  }
}, 10);

const blockWebsite = (website) => {
  
  // Close all Chrome windows
  exec('taskkill /im chrome.exe /f', (error, stdout, stderr) => {
    if (error) {
      console.error(`${error}`);
      return;
    }
    console.log(`Success: ${stdout}`);
  });

  // Close all Firefox windows
  exec('taskkill /im firefox.exe /f', (error, stdout, stderr) => {
    if (error) {
      console.error(`${error}`);
      return;
    }
    console.log(`Success: ${stdout}`);
  });

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