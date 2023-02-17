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

const FileSelector = document.getElementById('FileSelector')
FileSelector.addEventListener('click', (event) => {
    event.preventDefault()
    ipcRenderer.send('FileSelector')
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

const SignOutbtn = document.getElementById('SignOutbtn')
SignOutbtn.addEventListener('click', (event) => {
    event.preventDefault()
    ipcRenderer.send('SignOut')
})

const ExitBtn = document.getElementById('ExitBtn')
ExitBtn.addEventListener('click', (event) => {
    event.preventDefault()
    ipcRenderer.send('ExitClicked')
})