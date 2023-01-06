const { ipcRenderer } = require('electron')
const SubmitWebsiteInput = document.getElementById('SubmitWebsiteInput')
SubmitWebsiteInput.addEventListener('submit', (event) => {
    event.preventDefault()
    const input = document.getElementById('InputWebsite').value
    ipcRenderer.send('submit-website', input)
})

const DeleteWebsiteInput = document.getElementById('DeleteWebsiteInput')
DeleteWebsiteInput.addEventListener('submit', (event) => {
    event.preventDefault()
    const input = document.getElementById('InputWebsiteU').value
    ipcRenderer.send('submit-websiteU', input)
})

const BeginRestriction = document.getElementById('BeginRestriction')
BeginRestriction.addEventListener('submit', (event) => {
    event.preventDefault()
    const input = "document.getElementById('InputWebsiteU').value"
    ipcRenderer.send('BeginRestriction', input)
})

