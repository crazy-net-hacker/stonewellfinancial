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
  formTitle: { fontSize: '1.4rem' },
  button: {
    margin: 10,
    '&:hover': {
      color: '#fff',
    },
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  divider: {
    margin: '16px 0',
  },
  btnWrapper: {
    textAlign: 'center',
  },
  nested: {
    paddingLeft: theme.spacing(4)
}
}))



const ModalTemplate = (props) => {
  const { title, open, setOpen } = props;

  const classes = useStyles()


  return (
    <div>
      <Dialog 
        fullWidth={true}
        maxWidth="md"
        open={open} 
        onClose={() =>setOpen(false)}
        >
        <MuiDialogTitle disableTypography>
          <Typography variant="h2" align="center" className={classes.formTitle}>
            {title}
          </Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => {setOpen(false)}}
          >
            <MdClose />
          </IconButton>
        </MuiDialogTitle>
        <DialogContent>
    
         
        </DialogContent>

        <DialogActions>
          {/* <Button
            onClick={() => {
              setOpen(false)
              }
            } 
            color="primary">
            {cancelButton}
          </Button> */}
          <Button autoFocus
            onClick={() => {
              setOpen(false)
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

export default ModalTemplate;