import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import { getDMMF } from '@prisma/sdk'
import { DMMF } from './types';
import fs from 'fs';
import { Data } from 'naph';
const isProd: boolean = process.env.NODE_ENV === 'production';
if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}
let dmmf: DMMF.Document;
function getNodesAndConnections(dmmf: DMMF.Document): Data {
  let data: Data = {
    nodes: [],
    connections:[]
  };
  console.log(dmmf);
  fs.writeFileSync('./test.json', JSON.stringify(dmmf), {encoding: 'utf8'})
  dmmf.datamodel.models.forEach((model, i) => {
    // console.log(model);
    data.nodes.push({
      nid: i,
      type: model.name,
      x: 100 * i,
      y: 0,
      fields: {
        in: [],
        out: []
      }
    })
    model.fields.forEach(field => {
      if(field.relationName && field.relationToFields){
        data.connections.push({
          from: field.relationToFields[0],
          from_node: dmmf.datamodel.models.findIndex(m => m.name === field.type),
          to: field.name,
          to_node: i
        })
      }
      data.nodes[i].fields.in.push({
        name: field.name,
      })
      data.nodes[i].fields.out.push({
        name: field.type,
      })
    })
    // console.log(model.relationToFields);
  })
  // data.nodes.forEach(node => {
  //   const model = dmmf.datamodel.models[node.nid]

  // })
  return data;
}
(async () => {
  try {
    dmmf = await getDMMF({datamodelPath: './main/schema.prisma'})
  } catch (error) {
    console.log(error);
  }

  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});


ipcMain.on('getNodesAndConnections', (event) => {
  event.returnValue = getNodesAndConnections(dmmf)
})