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


ipcRenderer.on('websitesURLs', (event, websitesURLs) => {
    const ul = document.getElementById('ListOfURLs')
    ul.innerHTML = "";
    websitesURLs.forEach((website) => {
      const li = document.createElement('li');
      li.textContent = website;
      ul.appendChild(li);
    });
});

function RefreshList() {
    ipcRenderer.send('RefreshList')
}