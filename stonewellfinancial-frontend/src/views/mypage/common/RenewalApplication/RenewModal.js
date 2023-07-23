import React from 'react';

//core components
import { Grid } from '@material-ui/core'
import { MdClose } from 'react-icons/md'
import { IconButton, Dialog, DialogContent, Typography } from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle'
// common components
import { QuoteBanner2 } from '../../../../components/common/QuoteBanner2';
import { Text } from '../../../../components/common/LanguageProvider'

// 
import { Application } from './Application'

//styles
import { makeStyles } from '@material-ui/core'
import formStyle from '../../../../assets/jss/styles/formStyle'
//setup form style
const useStyles = makeStyles(formStyle)


const companyName = [
    {name:'allianz', value:'Allianz'},
    {name:'tugo', value:'Tugo'},
    {name:'gms', value:'GMS'},
    {name:'bluecross', value:'BlueCross'},
]


export default function RepurchaseApplicationModal({ renewData, originData, insuraceCompany, insuraceType, applyType, userRole, open, handleClose }) {

  const classes = useStyles();

  insuraceCompany = companyName.filter(f=>f.name === insuraceCompany).map(i=>i.value)[0]
  insuraceType = insuraceType.toUpperCase()

//   console.log('originData',originData)

  return (
    <Dialog 
        fullScreen
        // fullWidth={true}
        // maxWidth="xl"
        open={open} 
        onClose={() => handleClose(false)}
    >
        <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#003781'}}>
            <Typography className={classes.formTitle} style={{color:'#fff', fontSize:'20px'}}>
                {/* <Text tid={'Vendor.RepurchaseTitle'} />  */}
                <Text tid={`Vendor.${renewData.application.applicationType.charAt(0).toUpperCase() + renewData.application.applicationType.slice(1).toLowerCase()}.application`}/>
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
                <Grid item container style={{ marginTop:'-37px' }}>
                    <QuoteBanner2 title={`Vendor.${renewData.application.applicationType.charAt(0).toUpperCase() + renewData.application.applicationType.slice(1).toLowerCase()}.application`} subTitle={'Vendor.Repurchase.Subtitle'} links={[]} />
                </Grid>
                <Grid item container style={{ padding:'0 10vh' }}>
                    <Application  
                        insuraceType = {insuraceType}
                        data = {renewData}
                        originData = {originData}
                        userRole = {userRole}
                        handleClose={handleClose}
                    />
                </Grid>
            </Grid>
        </DialogContent>

    </Dialog>
  )

}