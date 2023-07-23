import React from "react";
import { Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

const MesReqConfirm = (props) => {
  const { title, content, open, setOpen, onConfirm } = props;

  return (
    <Dialog
      fullWidth maxWidth="sm" 
      open={open}
      onClose={() => setOpen(false)}
      // aria-labelledby="dialog-title"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => setOpen(false)} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            setOpen(false);
            onConfirm();
          }}
          color="primary"
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
    // </div>
  );
};

export default MesReqConfirm;