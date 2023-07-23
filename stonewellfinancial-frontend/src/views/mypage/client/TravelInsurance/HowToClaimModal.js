// import React, { useState, useEffect } from "react";
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
import { Text } from "../../../../components/common/LanguageProvider";

//style
import formStyle from "../../../../assets/jss/styles/formStyle";

const useStyles = makeStyles(formStyle)

const HowToClaimModal = (props) => {
  const { insuranceClaim, open, handleClose } = props;

  const classes = useStyles()


  return (
    <>
      <Dialog 
        fullWidth={true}
        // maxWidth="md"
        open={open} 
        onClose={() => handleClose(false)}
        >
        <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#003781'}}>
          <Typography className={classes.formTitle} style={{color:'#fff', fontSize:'20px'}}>
            {/* {values.paymentMethod === 'Creditcard'? 'Credit Card': 'E-transfer'}  */}
            <Text tid={'Dashboard.HowToClaim'}/>
          </Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => {handleClose(false)}}
          >
            <MdClose />
          </IconButton>
        </MuiDialogTitle>
        <DialogContent>
          {insuranceClaim.map((i, index)=>(
            <Grid container key={index}>
              <Grid item container style={{ margin:'2vh 0' }}>
                <Typography variant="subtitle1" color="textPrimary" style={{ marginRight:'2vh' }}>
                  <Text tid={'Dashboard.MyInsurancePlan'}/>
                </Typography>
                <Typography variant="subtitle1" color="textPrimary" >{i.company} {i.plan}</Typography>
              </Grid>        
              <Grid item container>
                <Typography variant="subtitle1" color="textPrimary" style={{ marginRight:'2vh' }}>
                  <Text tid={'Dashboard.ClaimOnline'}/>
                </Typography>
                
                {i.company === 'Allianz' ? 
                  <Typography variant="subtitle1" color="textPrimary">
                      <a href="https://www.allianzassistanceclaims.ca/login">https://www.allianzassistanceclaims.ca/login</a>  
                  </Typography>: 
                <Typography variant="subtitle1" color="textPrimary">
                      <a href="https://my.tugo.com/login/auth">https://my.tugo.com/login/auth</a>  
                </Typography>
                }
              </Grid>

            </Grid>
          ))}
        </DialogContent>

      </Dialog>

    </>
  );
  
}

export default HowToClaimModal;