const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile(path.join(__dirname, 'main.html'));

    ipcMain.handle('save-dialog', async () => {
        const { filePath } = await dialog.showSaveDialog({
            defaultPath: path.join(app.getPath('desktop'), 'coucou.txt'),
        });
        return filePath;
    });

    ipcMain.handle('set-saved-file-name', (event, savedFileName) => {
        global.sharedObject.savedFileName = savedFileName;
    });
}

const menuTemplate = [
    {
        label: 'Fichier',
        submenu: [
            {
                label: 'Sauvegarder',
                accelerator: 'CmdOrCtrl+S',
                click: async () => {
                    const { filePath } = await dialog.showSaveDialog({
                        defaultPath: path.join(app.getPath('desktop'), 'coucou.txt'),
                    });
                    if (filePath) {
                        const savedFileName = path.basename(filePath);
                        global.sharedObject.savedFileName = savedFileName;
                        fs.writeFile(filePath, 'coucou', (err) => {
                            if (err) throw err;
                            console.log('Le fichier a été sauvegardé.');
                        });
                    }
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'Quitter',
                role: 'quit',
            },
        ],
    },
    {
        label: 'Vue',
        submenu: [
            {
                label: 'Zoomer',
                accelerator: 'CmdOrCtrl+Plus',
                role: 'zoomIn',
            },
            {
                label: 'Dézoomer',
                accelerator: 'CmdOrCtrl+-',
                role: 'zoomOut',
            },
            {
                label: 'Réinitialiser le zoom',
                accelerator: 'CmdOrCtrl+0',
                role: 'resetZoom',
            },
            {
                type: 'separator',
            },
            {
                label: 'Recharger',
                accelerator: 'CmdOrCtrl+R',
                role: 'reload',
            },
        ],
    },
    {
        label: 'Aide',
        submenu: [
            {
                label: 'OK Google',
                click: async () => {
                    const { shell } = require('electron');
                    await shell.openExternal('https://www.google.fr/');
                },
            },
            {
                label: 'Documentation',
                click: async () => {
                    const { shell } = require('electron');
                    await shell.openExternal('https://www.electronjs.org/docs');
                },
            },
            {
                type: 'separator',
            },
            {
                label: 'À propos',
                click: async () => {
                    const { dialog } = require('electron');
                    await dialog.showMessageBox({
                        type: 'info',
                        title: 'À propos de cette application',
                        message: 'Cette application a été développée avec Electron.',
                        buttons: ['OK'],
                    });
                },
            },
        ],
    },
];

function createMenu() {
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
    global.sharedObject = {
        savedFileName: null,
    };
    createWindow();
    createMenu();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
});


