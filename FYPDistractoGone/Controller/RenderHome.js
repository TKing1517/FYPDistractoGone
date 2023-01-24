const { ipcRenderer } = require('electron')
const BeginRestriction = document.getElementById('BeginRestriction')
BeginRestriction.addEventListener('submit', (event) => {
    event.preventDefault()

    ipcRenderer.send('BeginRestriction')
})

ipcRenderer.on('Points', (event, UserPoints) => {
    document.getElementById('NPoints').innerText = ('Points: ' + UserPoints)
});

ipcRenderer.on('CurrentUser', (event, CurrentUser) => {
    document.getElementById('CurrentUser').innerText = ('Signed in as: ' + CurrentUser)
});

function RefreshVariables() {
    ipcRenderer.send('RefreshVariables')
}