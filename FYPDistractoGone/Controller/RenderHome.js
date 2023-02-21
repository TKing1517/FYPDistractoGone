const { ipcRenderer } = require('electron')

const BeginRestriction = document.getElementById('BeginRestriction')
BeginRestriction.addEventListener('submit', (event) => {
    event.preventDefault()
    const inputTimeForRestriction = document.getElementById('inputTimeForRestriction');
    const TimerValue = inputTimeForRestriction.value;
    ipcRenderer.send('BeginRestriction', TimerValue);

})

ipcRenderer.on('Points', (event, UserPoints) => {
    document.getElementById('NPoints').innerText = ('Current Points: ' + UserPoints)
});

ipcRenderer.on('CurrentUser', (event, CurrentUser) => {
    document.getElementById('CurrentUser').innerText = ('Signed in as: ' + CurrentUser)
});

function RefreshVariables() {
    ipcRenderer.send('RefreshVariables')
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

const EditBlockListNav = document.getElementById('EditBlockListNav')
EditBlockListNav.addEventListener('click', (event) => {
    event.preventDefault()
    ipcRenderer.send('EditBlockListNav')
})

const ShopNav = document.getElementById('ShopNav')
ShopNav.addEventListener('click', (event) => {
    event.preventDefault()
    ipcRenderer.send('ShopNav')
})