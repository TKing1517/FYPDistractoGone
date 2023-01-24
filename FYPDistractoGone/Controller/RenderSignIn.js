const { ipcRenderer } = require('electron')
const SignInInput = document.getElementById('SignInInput')
SignInInput.addEventListener('submit', (event) => {
    event.preventDefault()
    const UserName = document.getElementById('InputUserNameS').value
    const Password = document.getElementById('InputPasswordS').value
    ipcRenderer.send('SignIn',UserName,Password)
})