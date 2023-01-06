const { ipcRenderer } = require('electron')
const form = document.getElementById('SubmitWebsiteInput')
form.addEventListener('submit', (event) => {
    event.preventDefault()
    const input = document.getElementById('InputWebsite').value
    ipcRenderer.send('submit-website', input)
})