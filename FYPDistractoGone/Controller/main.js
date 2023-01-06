const { app, BrowserWindow, ipcMain } = require('electron')
const { exec } = require('child_process')
const fs = require('fs')

const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  win.loadFile('View/HomePage.html')
  
  win.webContents.openDevTools();
  win.setMenu(null)
}

app.whenReady().then(() => {
  createWindow()
})

ipcMain.on('submit-website', (event, website) => {
  console.log(website)
  blockWebsite(website)
})


const blockWebsite = (website) => {
  const command = `echo 127.0.0.1 ${website} >> C:\\Windows\\System32\\drivers\\etc\\hosts`
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`${error}`)
      return
    }
    console.log(`Success: ${stdout}`)
  })
}

const unblockWebsite = (website) => {
  // Read content
  fs.readFile('C:\\Windows\\System32\\drivers\\etc\\hosts', 'utf8', (error, data) => {
    if (error) {
      console.error(`Error: ${error}`)
      return
    }

    // Split contents on new line
    const lines = data.split('\n')

    // Find lines that contain website
    const filteredLines = lines.filter((line) => !line.includes(website))

    // Join split lines into string
    const modifiedData = filteredLines.join('\n')

    // Write back to hosts file
    fs.writeFile('C:\\Windows\\System32\\drivers\\etc\\hosts', modifiedData, (error) => {
      if (error) {
        console.error(`${error}`)
        return
      }
      console.log('Success: website unblocked')
    })
  })
}