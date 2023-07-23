import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
// import {IconButton } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
// import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from '../common/CustomButtons/Button';
import MuiDialogTitle from '@material-ui/core/DialogTitle'
// import { MdClose } from 'react-icons/md'

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 999999,
  },
  formTitle: { 
    fontSize: '20px', 
    fontWeight:'300',
    marginBottom:'0',
    color:'#fff' 
  },
  button: {
    margin: 10,
    '&:hover': {
      color: '#fff',
    },
  },
  back_button: {
    width: '100%'
  },
  next_button: {
    width: '100%'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: '#fff',
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

const EligilbeAgrement = (props) => {
  const { title, content, open, setOpen, cancelButton, okButton, setResponse } = props;

  const classes = useStyles()

  return (
    <Dialog
      fullWidth maxWidth="sm" 
      open={open}
      onClose={() => setOpen(false)}
      // aria-labelledby="dialog-title"
    >
      <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#003781'}}>
        <Typography variant="h2" className={classes.formTitle}>
          {title}
        </Typography>
        {/* <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={() => {setOpen(false)}}
        >
          <MdClose />
        </IconButton> */}
      </MuiDialogTitle>

      <DialogContent style={{ marginTop:'2vh' }}>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false)
            setResponse(false)
            }
          } 
          color="secondary">
          {cancelButton}
        </Button>
        <Button autoFocus
          onClick={() => {
            setOpen(false)
            setResponse(true)
            // onClick();
          }}
          color="dark"
        >
          {okButton}
        </Button>
      </DialogActions>
    </Dialog>
    // </div>
  );
};

export default EligilbeAgrement;