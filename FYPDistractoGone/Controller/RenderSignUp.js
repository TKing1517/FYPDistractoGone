const { ipcRenderer } = require('electron')
const SignUpInput = document.getElementById('SignUpInput')
SignUpInput.addEventListener('submit', (event) => {
    event.preventDefault()
    const Email = document.getElementById('InputEmail').value
    const UserName = document.getElementById('InputUserName').value
    const Password = document.getElementById('InputPassword').value
    ipcRenderer.send('CreateUser',Email,UserName,Password)
})