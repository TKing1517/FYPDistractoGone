const { ipcRenderer } = require('electron')

function RefreshShop() {
    ipcRenderer.send('RefreshShop')
}

const EditBlockListNav = document.getElementById('EditBlockListNav')
EditBlockListNav.addEventListener('click', (event) => {
    event.preventDefault()
    ipcRenderer.send('EditBlockListNav')
})

const HomePageNav = document.getElementById('HomePageNav')
HomePageNav.addEventListener('click', (event) => {
    event.preventDefault()
    ipcRenderer.send('HomePageNav')
})

const ExitBtn = document.getElementById('ExitBtn')
ExitBtn.addEventListener('click', (event) => {
    event.preventDefault()
    ipcRenderer.send('ExitClicked')
})

const SignOutbtn = document.getElementById('SignOutbtn')
SignOutbtn.addEventListener('click', (event) => {
    event.preventDefault()
    ipcRenderer.send('SignOut')
})

ipcRenderer.on('Points', (event, UserPoints) => {
    document.getElementById('NPoints').innerText = ('Current Points: ' + UserPoints)
});

ipcRenderer.on('CurrentUser', (event, CurrentUser) => {
    document.getElementById('CurrentUser').innerText = ('Signed in as: ' + CurrentUser)
});

ipcRenderer.on('ShopItems', (event, ShopItems) => {
    const tableBody = document.getElementById('shop-items-table-body');
    tableBody.innerHTML = '';
    //add each shop item to the displayed table.
    ShopItems.forEach((item) => {
        const row = tableBody.insertRow();
        const itemIdCell = row.insertCell(0);
        itemIdCell.innerText = item.ItemID;
        const itemNameCell = row.insertCell(1);
        itemNameCell.innerText = item.ItemName;
        const itemDescriptionCell = row.insertCell(2);
        itemDescriptionCell.innerText = item.ItemDescription;
        const pointCostCell = row.insertCell(3);
        pointCostCell.innerText = item.PointCost;
        const buttonCell = row.insertCell(4);
        const button = document.createElement('button');
        button.innerText = 'Buy';
        button.addEventListener('click', () => {
            ipcRenderer.send('ShopItemPurchase', item.ItemID);
        });
        buttonCell.appendChild(button);
    });
});
