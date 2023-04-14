const { ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');

const saveBtn = document.getElementById('save-btn');
const savedFileElement = document.getElementById('saved-file');

saveBtn.addEventListener('click', async () => {
  const filePath = await ipcRenderer.invoke('save-dialog');
  if (filePath) {
    const savedFileName = path.basename(filePath);
    savedFileElement.textContent = `Enregistré dans ${path.basename(filePath)}`;
    ipcRenderer.send('set-saved-file-name', savedFileName);
    fs.writeFile(filePath, 'coucou', (err) => {
      if (err) throw err;
      console.log('Le fichier a été sauvegardé.');
    });
  }
});