const { ipcRenderer } = require('electron')
const BeginRestriction = document.getElementById('BeginRestriction')
BeginRestriction.addEventListener('submit', (event) => {
    event.preventDefault()

    ipcRenderer.send('BeginRestriction')
})
