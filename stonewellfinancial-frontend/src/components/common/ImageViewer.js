import React from "react";
import { makeStyles } from '@material-ui/core/styles'
import {
  Dialog, DialogContent, DialogActions,
  // DialogContentText,  
  Button, Typography, IconButton
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { MdClose } from 'react-icons/md'

const useStyles = makeStyles((theme) => ({
  formTitle: { 
    fontSize: '20px', 
    fontWeight:'300',
    marginBottom:'0',
    color:'#fff' 
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
viewer: {
  backgroundColor: '#fff',
  /* Take full size */
  height: '100%',
  width: '100%',
  /* Displayed on top of other elements */
  // zIndex: 9999,
},
}))

const ImageViewer = (props) => {
  const { title, file, openViewer, setOpenViewer } = props;

  const classes = useStyles()

  return (
    <div className={classes.reviews}>
      <Dialog 
        style={{zIndex: 9999}}
        className={classes.viewer}
        // fullWidth={true}
        // maxWidth="md"
        maxWidth="lg"
        open={openViewer} 
        onClose={() =>setOpenViewer(false)}
        >
        <MuiDialogTitle disableTypography 
          style={{  boxShadow: '2px 2px 10px #efefef', 
                    background : '#2a2f71'
                }}
        >
          <Typography variant="h2" align="center" className={classes.formTitle}>
            {title}
          </Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => {setOpenViewer(false)}}
          >
            <MdClose />
          </IconButton>
        </MuiDialogTitle>
        <DialogContent>
          <img 
            style={{ width: '700px', height: '700px'}}
            src={`data:${file.ContentType};base64,${ Buffer.from(file.Body.data).toString('base64')}`} 
            alt ='refund'/>
        </DialogContent>

        <DialogActions>
          <Button autoFocus
            onClick={() => {
              setOpenViewer(false)
            }}
            color="primary"
          >
            Close
          </Button>
      </DialogActions>

      </Dialog>
    </div>
  );
}

export default ImageViewer;