import React from "react";
import { Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

const AgreementMessage = (props) => {
  const { title, content, open, setOpen, eligibilityData, setEligibilityData } = props;

  // const handleChange = (event) => {
  //   const name = event.target.name;
  //   setEligibilityData({
  //     ...eligibilityData,
  //     [name]: event.target.value,
  //   });
    // const [eligibilityData, setEligibilityData] = React.useState(true)
   // validate()
  

  // const handleClickOpen = () => {
  //   setOpen(true)
  // }
  // const [state, setState] = React.useState({
  //   eligibility: false
  // });
  // const { eligibility } = state;

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
        <Button autoFocus 
           value={'false'}
           onClick={(e) => {
            setOpen(false);
            setEligibilityData(false)
            
            // onClick() 
            // console.log(eligibilityData)
            }}
            color="primary">
          No
        </Button>
        <Button
          value={'true'}
          onClick={(e) => {
          setOpen(false);
          setEligibilityData(true)
          
          // onClick() 
          // console.log(eligibilityData)
          }}
          color="primary"
        >
          Yes to all
        </Button>
      </DialogActions>
    </Dialog>
    // </div>
  );
};

export default AgreementMessage;