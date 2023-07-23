import React from 'react';

//core components
import { Grid } from '@material-ui/core'
import { MdClose } from 'react-icons/md'
import { IconButton, Dialog, Container, Typography } from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle'
// common components
// import { Text } from '../../../../components/common/LanguageProvider'
import Button from '../../../../components/common/CustomButtons/Button'

// 
import VendorAccount from './VendorAccount'

//styles
import { makeStyles } from '@material-ui/core'
import formStyle from '../../../../assets/jss/styles/formStyle'
//setup form style
const useStyles = makeStyles(formStyle)


export default function VendorModal({ accessRole, detailData, open, handleClose, onConfirm }) {

  const classes = useStyles();

  return (
    <Dialog 
        // fullWidth={true}
        // maxWidth="xl"
        fullScreen
        open={open} 
        onClose={() => {
            handleClose(false)
        }}
    >
        <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#003781'}}>
            <Typography className={classes.formTitle} style={{color:'#fff', fontSize:'20px'}}>
                {/* <Text tid={''} /> */}
                Vendor account
            </Typography>
            <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={() => {
                    handleClose(false)
                    onConfirm()
                }}
            >
                <MdClose />
            </IconButton>
        </MuiDialogTitle>

        <Container component="main">
            <Grid container style={{ padding:'0 5vh' }}>
                <VendorAccount 
                    accessRole = {accessRole}
                    accessCode = {detailData.access_code}
                    vendorID = {detailData.vendor_id}
                />
            </Grid>

            <Grid container style={{ margin: '2vh 0 2vh 0' }} justify="center" spacing={1}>
                <Grid item xs={2}>
                    <Button
                        color="secondary"
                        className={classes.next_button}
                        onClick={() => {
                            handleClose(false)
                            onConfirm()
                        }}
                        >
                        Close
                        {/* <Text tid={'Button.Close'}/> */}
                    </Button>
                </Grid>
        </Grid>
        </Container>
    </Dialog>
  )

}