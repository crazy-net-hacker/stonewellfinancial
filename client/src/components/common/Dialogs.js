import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

export default function AlertDialog(props) {
  const [open, setOpen] = React.useState(false);
  const { buttonTitle, contentTitle, content, button1, button2 } = props;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        {buttonTitle}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
            {contentTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => { 
            setFieldValue('insuredPersons', newInsuredPerson(values.insuredPersons)); 
            setFieldValue('insuredNumber',values.insuredPersons.length )
            }}
          >
            {button1}
          </Button>
          <Button onClick={handleClose} autoFocus>
            {button2}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
