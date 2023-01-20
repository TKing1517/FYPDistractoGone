const { ipcRenderer } = require('electron')
const BeginRestriction = document.getElementById('BeginRestriction')
BeginRestriction.addEventListener('submit', (event) => {
    event.preventDefault()

    ipcRenderer.send('BeginRestriction')
})

ipcRenderer.on('Points', (event, UserPoints) => {
    document.getElementById('NPoints').innerText = ('Points: ' + UserPoints)
});

function RefreshVariables() {
    ipcRenderer.send('RefreshVariables')
}