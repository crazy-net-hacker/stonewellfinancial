import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles'
// core components
import {
  Dialog, DialogContent, 
  Typography, Grid
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'

import { MdClose } from 'react-icons/md'
import { IconButton } from "@material-ui/core";
// components
// import { Text } from "../../../../components/common/LanguageProvider";
import RepurchaseApplicants from '../../common/RenewalApplication/RenewApplicants'
//style
import formStyle from "../../../../assets/jss/styles/formStyle";

const useStyles = makeStyles(formStyle)

const RepurchaseModal = (props) => {
  const { renewData, open, handleClose } = props;

  const classes = useStyles()
  const [step, setStep] = useState(1)
  // initail data
  const [renewFormData, setRenewFormData] = useState(renewData);
  const [formData, setFormData] = useState([]);

  const nextStep = () => setStep((prev) => prev + 1)
  // const prevStep = () => setStep((prev) => prev - 1)


  const contents = () => {
    switch (step) {
        case 1:
          return (
            <RepurchaseApplicants
              renewFormData={renewFormData}
              setRenewFormData={setRenewFormData}
              setFormData={setFormData}
              nextStep={nextStep}
            />
          )
        case 2:
          return (
            `${formData.insuredNumber} insured`
          )
        default:
          return null
      }
  }

  return (
      <Dialog 
        fullScreen
        open={open} 
        onClose={() => handleClose(false)}
        >
        <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#003781'}}>
          <Typography className={classes.formTitle} style={{color:'#fff', fontSize:'20px'}}>
            {/* {values.paymentMethod === 'Creditcard'? 'Credit Card': 'E-transfer'}  */}
            Repurchase
          </Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => {handleClose(false)}}
          >
            <MdClose />
          </IconButton>
        </MuiDialogTitle>
        <DialogContent style={{ padding:'0' }}>
            <Grid container>
                <Grid item container style={{ padding:'5vh' }}>
                  {contents()}
                </Grid>
            </Grid>
        </DialogContent>

      </Dialog>
  );
  
}

export default RepurchaseModal;