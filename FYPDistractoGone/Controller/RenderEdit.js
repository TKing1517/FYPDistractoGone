const { ipcRenderer } = require('electron')
const SubmitWebsiteInput = document.getElementById('SubmitWebsiteInput')
SubmitWebsiteInput.addEventListener('submit', (event) => {
    event.preventDefault()
    const input = document.getElementById('InputWebsite').value
    document.getElementById('InputWebsite').value = ''
    ipcRenderer.send('submit-website', input)
})

const DeleteWebsiteInput = document.getElementById('DeleteWebsiteInput')
DeleteWebsiteInput.addEventListener('submit', (event) => {
    event.preventDefault()
    const input = document.getElementById('InputWebsiteU').value
    document.getElementById('InputWebsiteU').value = ''
    ipcRenderer.send('submit-websiteU', input)
})

const SubmitAppInput = document.getElementById('SubmitAppInput')
SubmitAppInput.addEventListener('submit', (event) => {
    event.preventDefault()
    const input = document.getElementById('InputAppName').value
    document.getElementById('InputAppName').value = ''
    ipcRenderer.send('submit-app', input)
})

const DeleteAppInput = document.getElementById('DeleteAppInput')
DeleteAppInput.addEventListener('submit', (event) => {
    event.preventDefault()
    const input = document.getElementById('InputAppNameU').value
    document.getElementById('InputAppNameU').value = ''
    ipcRenderer.send('submit-appU', input)
})

ipcRenderer.on('websitesURLs', (event, websitesURLs) => {
    const ul = document.getElementById('ListOfURLs')
    ul.innerHTML = "";
    websitesURLs.forEach((website) => {
      const li = document.createElement('li');
      li.textContent = website;
      ul.appendChild(li);
    });
});

ipcRenderer.on('appsToBlock', (event, appsToBlock) => {
    const ul = document.getElementById('ListOfApps')
    ul.innerHTML = "";
    appsToBlock.forEach((app) => {
      const li = document.createElement('li');
      li.textContent = app;
      ul.appendChild(li);
    });
});

function RefreshList() {
    ipcRenderer.send('RefreshList')
}