import React, {useState} from 'react';
import { 
  Card, Grid, CardContent, makeStyles,
  FormControlLabel, FormGroup, Checkbox
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
//custom component
import Button from '../../../../components/common/CustomButtons/ButtonDB'
import { Text } from '../../../../components/common/LanguageProvider'
import EligilbeAgrement from '../../../../components/common/EligilbeAgrement';
// style
import vendorFormStyle from '../../../../assets/jss/styles/vendorFormStyle'

const useStyles = makeStyles(vendorFormStyle)


const Agreement = ({
  values,
  setFieldValue,
  validMessage,
}) => {

  const classes = useStyles()

  const [open, setOpen] = React.useState(false)
  const [errormsg, setErrormsg] = useState('')

  const handleClickOpen = () => {
    setOpen(true)
  }

  function handleResponse(response){
    setFieldValue('eligilbeAgrement',response)
    if (response === false){
      setErrormsg('NotEligibleToPurchase')
    }else{
      setErrormsg(null)
    }
  }

  return (
    <>
      <Grid container className={classes.CardBox}>
        <Grid item xs={12} className={classes.applicant}>
          <Text tid={`Vendor.Step1.CoverageAgreementTitle`}/>
        </Grid>
        
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Grid container style={{ flexGrow: 1 }}>

                  <Grid item xs={12} className={classes.CardBox}>
                    <Text tid={`Vendor.Step1.CoverageAgreementSubtitle`}/>
                  </Grid>          

                  <Grid item xs={12} >
                    <Button variant="outlined" onClick={handleClickOpen}><Text tid={`Vendor.Step1.CoverageAgreement.Button`}/></Button>
                    <EligilbeAgrement
                      title={<Text tid={`Vendor.Step1.CoverageAgreementTitle`}/>}
                      content= {`The traveller confirms that they are in good health and that they know of no reason for which they may seek medical attention.
                      The traveller confirms that there is no circumstance known for which they may claim. If the traveller has already arrived in Canada, they confirm that they
                      have not seen a physician or other registered medical practitioner since their arrival.` }
                      open={open}
                      setOpen={setOpen}
                      cancelButton={<Text tid={`Button.NotConfirm`}/>}
                      okButton={<Text tid={`Button.Confirm`}/>}
                      setResponse={handleResponse}
                    />
                    {validMessage(`eligilbeAgrement`)}
                  </Grid>
                  
                    <FormGroup className={classes.Checkbox}>
                      <FormControlLabel
                          style={{ justifyContent:"flex-start" }}
                          control={<Checkbox
                                      // disabled 
                                      checked={values.eligilbeAgrement===true?values.eligilbeAgrement:false}
                                      size="small"
                                      name={`eligilbeAgrement`}
                                      color="primary"
                                      onClick={handleClickOpen}
                                    />
                          } 
                          label={<Text tid={`Vendor.Step1.CoverageAgreement.Yes`}/>}
                      />

                      <FormControlLabel
                        style={{ justifyContent:"flex-start" }}
                        control={<Checkbox
                                    // disabled 
                                    checked={values.eligilbeAgrement===false?true:false}
                                    size="small"
                                    name={`eligilbeAgrement`}
                                    color="primary"
                                    onClick={handleClickOpen}
                                  />
                        } 
                        label={<Text tid={`Vendor.Step1.CoverageAgreement.No`}/>}
                      />

                    </FormGroup>

              </Grid>
              {errormsg && (
                <Grid item xs={12} style={{ margin: '1vh' }}>
                  <Alert
                      severity='error'
                      // onClose={() => setAlterOpen(false)}
                  >
                      <Text tid={`Quote.Error.${errormsg}`}/>
                  </Alert>
                </Grid>
              )}

            </CardContent>
          </Card>
          
        </Grid> 

      </Grid>
    </>
  )
}

export default Agreement