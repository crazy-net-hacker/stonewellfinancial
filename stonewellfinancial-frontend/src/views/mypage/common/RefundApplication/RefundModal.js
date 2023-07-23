import React, { useState } from 'react'
//core components
import { Grid } from '@material-ui/core'
import { MdClose } from 'react-icons/md'
import { IconButton, Dialog, DialogContent, Typography } from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle'
//
import { Text } from '../../../../components/common/LanguageProvider'
import RefundApplicants from './RefundApplicants';
import RefundRequest from './RefundRequest';
//styles
import { makeStyles } from '@material-ui/core'
import formStyle from '../../../../assets/jss/styles/formStyle'

//setup form style
const useStyles = makeStyles(formStyle)


export default function RefundApplicationModal({ refundData, open, handleClose, onConfirm }) {
//   console.log(refundData);
  const classes = useStyles();

  const [step, setStep] = useState(1)
  const [refundFormData, setRefundFormData] = useState(refundData);
  const [formData, setFormData] = useState([]);

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)


  const contents = () => {
    switch (step) {
        case 1:
          return (
            <RefundApplicants
                refundFormData={refundFormData}
                setRefundFormData={setRefundFormData}
                setFormData={setFormData}
                nextStep={nextStep}
                // prevStep={prevStep}
              />
          )
        case 2:
          return (
            <>
              <RefundRequest
                formData={formData}
                setFormData={setFormData}
                prevStep={prevStep}
                onConfirm={onConfirm}
                handleClose={handleClose}
              />
            </>
          )
        default:
          return null
      }
  }


  return (
    <Dialog 
        fullWidth={true}
        // maxWidth="md"
        open={open} 
        onClose={() => handleClose(false)}
    >
        <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#003781'}}>
            <Typography className={classes.formTitle} style={{color:'#fff', fontSize:'20px'}}>
              {/* {values.paymentMethod === 'Creditcard'? 'Credit Card': 'E-transfer'}  */}
                {/* <Text tid={'Vendor.RepurchaseTitle'} /> */}
                <Text tid={`Refund`} />
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
  )

}