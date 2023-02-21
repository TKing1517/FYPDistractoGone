const { ipcRenderer } = require('electron')

function RefreshShop() {
    ipcRenderer.send('RefreshShop')
}

const EditBlockListNav = document.getElementById('EditBlockListNav')
EditBlockListNav.addEventListener('click', (event) => {
    event.preventDefault()
    ipcRenderer.send('EditBlockListNav')
})

const HomePageNav = document.getElementById('HomePageNav')
HomePageNav.addEventListener('click', (event) => {
    event.preventDefault()
    ipcRenderer.send('HomePageNav')
})

const ExitBtn = document.getElementById('ExitBtn')
ExitBtn.addEventListener('click', (event) => {
    event.preventDefault()
    ipcRenderer.send('ExitClicked')
})

const SignOutbtn = document.getElementById('SignOutbtn')
SignOutbtn.addEventListener('click', (event) => {
    event.preventDefault()
    ipcRenderer.send('SignOut')
})

ipcRenderer.on('Points', (event, UserPoints) => {
    document.getElementById('NPoints').innerText = ('Current Points: ' + UserPoints)
});

ipcRenderer.on('CurrentUser', (event, CurrentUser) => {
    document.getElementById('CurrentUser').innerText = ('Signed in as: ' + CurrentUser)
});
