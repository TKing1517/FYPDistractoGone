const { app, BrowserWindow, ipcMain } = require('electron')
const { exec } = require('child_process')




const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('Screens/index.html')
  blockWebsite('https://onesquareminesweeper.com/')
  blockWebsite('onesquareminesweeper.com')
  blockWebsite('www.onesquareminesweeper.com')
  win.setMenu(null)
}

app.whenReady().then(() => {
  createWindow()
})


const blockWebsite = (website) => {
  const command = `echo 127.0.0.1 ${website} >> C:\\Windows\\System32\\drivers\\etc\\hosts`
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`)
      return
    }
    console.log(`Success: ${stdout}`)
  })
}