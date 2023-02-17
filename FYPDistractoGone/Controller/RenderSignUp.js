const { ipcRenderer } = require('electron')
const SignUpInput = document.getElementById('SignUpInput')
SignUpInput.addEventListener('submit', (event) => {
    event.preventDefault()
    const Email = document.getElementById('InputEmail').value
    const UserName = document.getElementById('InputUserName').value
    const Password = document.getElementById('InputPassword').value
    ipcRenderer.send('CreateUser',Email,UserName,Password)
})

const ExitBtn = document.getElementById('ExitBtn')
ExitBtn.addEventListener('click', (event) => {
    event.preventDefault()
    ipcRenderer.send('ExitClicked')
})