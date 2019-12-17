import React, { useState } from 'react';
import Head from 'next/head';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import { Link } from '../components';
import NaphGraph, { NaphProvider } from 'naph';
import electron from 'electron';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
  })
);
const ipcRenderer = electron.ipcRenderer || false;

const example = {
  "nodes":[
    {"nid":0,"type":"Timer","x":89,"y":82,"fields":{"in":[{"name":"reset"},{"name":"pause"},{"name":"max"}],"out":[{"name":"out"}]}},
    {"nid":1,"type":"MathMult","x":284,"y":82,"fields":{"in":[{"name":"in"},{"name":"factor"}],"out":[{"name":"out"}]}},
    {"nid":2,"type":"Vector3","x":486,"y":188,"fields":{"in":[{"name":"xyz"},{"name":"x"},{"name":"y"},{"name":"z"}],"out":[{"name":"xyz"},{"name":"x"},{"name":"y"},{"name":"z"}]}}
  ],
  "connections":[
    {"from_node":0,"from":"field_name","to_node":2,"to":"field_name"},
  ]
};
const Home = () => {
  const classes = useStyles({});
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleClick = () => setOpen(true);
  const [graphData, setGraphData] = useState();
  React.useEffect(() => {
    if (ipcRenderer) {
      const data = ipcRenderer.sendSync('getNodesAndConnections')
      console.log(data);
      setGraphData(data)
    }
  }, [ipcRenderer])
  return (
    <React.Fragment>
      <Head>
        <title>Schema Editor</title>
      </Head>

      <div className={classes.root}>
        <NaphProvider data={graphData || example}>
          <NaphGraph 
            onNodeMove={(nid, pos)=> null}
            onNodeStartMove={(nid)=> null}
            onNewConnector={(n1,o,n2,i)=>null}
            onRemoveConnector={(connector)=>null}
            onNodeSelect={(nid) => null}
            onNodeDeselect={(nid) => null}
          />
        </NaphProvider>
      </div>
    </React.Fragment>
  );
};

export default Home;
