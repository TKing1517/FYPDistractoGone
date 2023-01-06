const { app, BrowserWindow, ipcMain } = require('electron')
const { exec } = require('child_process')
const fs = require('fs')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('Screens/index.html')
  
  //blockWebsite('floatingqrcode.com')
  //unblockWebsite('onesquareminesweeper.com')

  win.setMenu(null)
}

app.whenReady().then(() => {
  createWindow()
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
  // Read the contents of the hosts file
  fs.readFile('C:\\Windows\\System32\\drivers\\etc\\hosts', 'utf8', (error, data) => {
    if (error) {
      console.error(`Error: ${error}`)
      return
    }

    // Split the contents of the file into an array of lines
    const lines = data.split('\n')

    // Filter out the lines that contain the website
    const filteredLines = lines.filter((line) => !line.includes(website))

    // Join the filtered lines into a string
    const modifiedData = filteredLines.join('\n')

    // Write the modified data back to the file
    fs.writeFile('C:\\Windows\\System32\\drivers\\etc\\hosts', modifiedData, (error) => {
      if (error) {
        console.error(`${error}`)
        return
      }
      console.log('Success: website unblocked')
    })
  })
}