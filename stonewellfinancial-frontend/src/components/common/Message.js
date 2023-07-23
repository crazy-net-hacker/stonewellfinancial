import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

import { Link } from 'react-router-dom'

const Message = (props) => {
  const { title, content, button1, button2, url1, url2, open, setOpen } = props;

  return (
    <div>
      <Dialog 
        fullWidth maxWidth="sm" 
        open={open} 
        onClose={() => setOpen(false)}
        >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>

         <Link to={url1}>
            <Button
                onClick={() => {
                  setOpen(false);
                }}
                color="primary"
                autoFocus
              >
              {button1}
            </Button>
          </Link>

          <Link to={url2}>
            <Button
              onClick={() => {
                setOpen(false);
              }}
              color="primary"
              autoFocus
            >
            {button2}
            </Button>
          </Link>
          
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Message;