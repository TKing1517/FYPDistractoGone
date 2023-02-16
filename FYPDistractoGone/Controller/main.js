const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path');
const { exec } = require('child_process')
const fs = require('fs')
const {connection,selectFromTable,insertIntoStudent,updateStudent,insertURLintoBlocked,DeleteURLFromBlocked,insertAppIntoBlocked,DeleteAppFromBlocked,getBlockedAppsFromDB,getBlockedURLsFromDB} = require('../Model/db.js');
const Student = require('../Model/Student');

// selectFromTable("Student", "*");
// selectFromTable("Student", "*","WHERE StudentID = 1");

// insertIntoTable("Student","TestUserName","TestPassword","TestEmail@Email.com",666,1000000);

let websitesURLs = [];
let canQuit = true;
let appsToBlock = [];
let GivePoints;
let isIntervalActive = false;
let student;
let CountForSignIn = 0;



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

  win.loadFile('View/SignIn.html')
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
      //fill in a student object.
      selectFromTable(`Student`, "*",`Username = "${UserName}"`,(results) => {
        let studentData = results[0];
        student = new Student(studentData.StudentID, studentData.Username, studentData.Password, studentData.Email, studentData.Points, studentData.TimeSpentRestricted);
        //console.log(student);
      })
      //need to use student somewhere.
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

ipcMain.on('SignIn', (event,UserName,Password) => {
  //check against inputted password and username.
  selectFromTable(`Student`, "*",`Username = "${UserName}" AND Password = "${Password}"`,(results) => {
    if(results.length === 0) {
      //does not exist.
      dialog.showMessageBox({
        type: 'info',
        message: 'User does not exist/details incorrect.',
        buttons: ['OK']
      })
    } else {
      //fill in a student object.
      let studentData = results[0];
      student = new Student(studentData.StudentID, studentData.Username, studentData.Password, studentData.Email, studentData.Points, studentData.TimeSpentRestricted);
      //console.log(student);
      appsToBlock = getBlockedAppsFromDB(student.StudentID);
      websitesURLs = getBlockedURLsFromDB(student.StudentID);
      win.loadFile('View/HomePage.html')
    }
  });
})

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
      insertURLintoBlocked(student.StudentID,hostname);
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
      DeleteURLFromBlocked(student.StudentID,hostname);
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
  if (CountForSignIn > 0){
    event.reply('Points', student.Points);
    event.reply('CurrentUser', student.Username);
  } else {
    const timeoutId = setTimeout(function() {
      console.log(student);
      event.reply('Points', student.Points);
      event.reply('CurrentUser', student.Username);
      CountForSignIn += 1
    }, 50);
  }
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
            DeleteAppFromBlocked(student.StudentID,NameofApp)
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
            insertAppIntoBlocked(student.StudentID,NameofApp)
          }
        });
        console.log(appsToBlock);
        //event trigger to update some other things
        event.reply('appsToBlock', appsToBlock);
      }
    });
  }
  
})

ipcMain.on('SignOut', (event) => {
  dialog.showMessageBox({
    type: 'info',
    message: 'Signing out...',
    buttons: ['OK']
  })
  // Clear block list.
  appsToBlock.length = 0;
  websitesURLs.length = 0;
  win.loadFile('View/SignIn.html')
  // Reset the properties of the student instance to their default values
  student = Object.assign(student, {
    StudentID: null,
    Username: "",
    Password: "",
    Email: "",
    Points: 0,
    TimeSpentRestricted: 0
  });
 
})

ipcMain.on('BeginRestriction', (event,TimerValue) => {
  //Restriction cannot begin if its already running
  if (canQuit === false){
    dialog.showMessageBox({
      type: 'info',
      message: 'Restriction is already running',
      buttons: ['OK']
    })
  } else {
    //convert timer value into something app can understand..
    //Although the app should be restricting in minutes, for the sake of this project, will only be doing in seconds.
    TimerValue = TimerValue*1000
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
        //The restriction will begin and last for TimerValue seconds, 
        //after which the restriction will end and the user will be able to quit out of the app again.
        const timeoutId = setTimeout(function() {
          //time stored as 1000 per second. Will be converted to user-understandable wherever needed.
          let UpdatedTime = student.TimeSpentRestricted + TimerValue;
          //updating points.
          updateStudent({Points: student.Points,TimeSpentRestricted: UpdatedTime}, student.StudentID);
          canQuit = true;
        }, TimerValue);
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
      //The restriction will begin and last for TimerValue seconds, 
      //after which the restriction will end and the user will be able to quit out of the app again.
      const timeoutId = setTimeout(function() {
        //time stored as 1000 per second. Will be converted to user-understandable wherever needed.
        let UpdatedTime = student.TimeSpentRestricted + TimerValue;
        //updating points.
        updateStudent({Points: student.Points,TimeSpentRestricted: UpdatedTime}, student.StudentID);
        canQuit = true;
        unblockWebsite(websitesURLs)
      }, TimerValue);
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
      student.Points += 1000;
      win.webContents.reload();
      console.log(student.Points);
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
      //add websites to hosts file
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