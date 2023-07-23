import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
// core components
// import { MdClose } from 'react-icons/md'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { Dialog, DialogContent,
          Grid, Typography, 
          // TextField, IconButton,
} from '@material-ui/core'
import {blue} from '@material-ui/core/colors'
// common customized components
import Button from '../../../../components/common/CustomButtons/Button'
import { Text } from '../../../../components/common/LanguageProvider' 
import CarewellSellSubmitResult from './CarewellSellSubmitResult'
// functionalities
import { amountFormat } from '../../../../controllers/dataFormat';


const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    padding: theme.spacing(1)
  },
  label: { 
    marginTop: theme.spacing(2),
    fontWeight:"700"
  },
  searchFileIcon: {
    color: blue[900],
    marginTop: theme.spacing(2),
    fontWeight:"1000"
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  totalPremiumArea: {
    display: 'flex',
    justifyContent: 'flex-end',
    // margin: theme.spacing(3, 0, 0),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  submitArea: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: theme.spacing(3, 0, 2),
  },
}))


const CarewellSellModal = (props) => {
  const { sellCarewellData, user, open, setOpen, onConfirm } = props
  // declaration
  const classes = useStyles()
  // console.log(sellCarewellData)
  const [submitted, setSubmitted] = useState(false)
  const [applicationId, setApplicationId] = useState('')
  const [sellFormData, setSellFormData] = useState([])

  // 
  const handleClose = () => {
    setOpen(false)
  }

  // 
  function handleSellCarewellResult(result){
    setSubmitted(false)
    setApplicationId()
    setSellFormData([])
    onConfirm(result)
    setOpen(false)
  }
  
  // handleSubmit
  const handleSubmit = async () => {
        // request update data to backend
        sellCarewellData.userID = user;
        setSubmitted(true)
        setSellFormData(sellCarewellData)
        setApplicationId(sellCarewellData.application_id)
  }


  return (
    <>
      <Dialog
        fullScreen
        open={open}
        fullWidth={true}
        aria-labelledby="max-width-dialog-title"
      >
        {/* <MuiDialogTitle disableTypography className={classes.root}> */}
        <MuiDialogTitle disableTypography style={{ boxShadow:'2px 2px 10px #efefef', background:'#ffbb00'}}>
          <Typography style={{color:'#fff', fontSize:'18px'}}>
            Sell Carewell - {sellCarewellData.application_id}
          </Typography>
          <Typography style={{color:'#fff', fontSize:'18px'}}>
            {`( ${sellCarewellData.vendor_name} )`}
          </Typography>
          {/* <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <MdClose />
          </IconButton> */}
        </MuiDialogTitle>

        <DialogContent style={{ padding:'1' }}>
          <Grid container>
            <div className={classes.paper}>
            <Grid item container spacing={2} style={{ padding:'0 5vh' }}>
              <Grid item sm={7}>
                {sellCarewellData.application_id && (
                  <>
                  
                  {sellCarewellData.insuredpersons.map(row => (
                    <React.Fragment key={row.insuredPersonID}>                      
                      <Grid item container style={{ border:'1px solid #ddd', height:'fit-content', marginTop:'1vh', marginBottom:'1vh', padding:'1vh', fontSize:'12px', fontWeight:'500' }}>
                        <Grid item container xs={12} sm={12} md={4} lg={4}>
                            {row.originCountryCode === 'CA' 
                                ?
                                  <>
                                    <Grid item xs={6}>
                                      <span style={{ color:'#666' }}><Text tid={'TravelApplication.OriginProvince'} /></span>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <span style={{ fontWeight:'700' }}>{row.originProvince}</span>
                                    </Grid>
                                  </>
                                :null
                              }
                              <Grid item xs={6}>
                                <span style={{ color:'#666' }}><Text tid={'TravelApplication.Destination'} /></span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ fontWeight:'700' }}>{row.destCountry}</span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ color:'#666' }}><Text tid={'TravelApplication.DestinationState'} /></span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ fontWeight:'700' }}>{row.destProvince}</span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ color:'#666' }}><Text tid={'Quote.TripArrivalDate'} /></span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ fontWeight:'700' }}>{row.arrivalDate}</span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ color:'#666' }}><Text tid={'Quote.TripStartDate'} /></span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ fontWeight:'700' }}>{row.tripStartDate}</span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ color:'#666' }}><Text tid={'Quote.TripEndDate'} /></span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ fontWeight:'700' }}>{row.tripEndDate}</span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ color:'#666' }}><Text tid={'Quote.CoverageDays'} /></span>
                              </Grid>
                              <Grid item xs={6}>
                                <span style={{ fontWeight:'700' }}>{row.tripPeriod} <Text tid={'Quote.Days'}/></span>
                              </Grid>
                        </Grid>

                        <Grid item container xs={12} sm={12} md={4} lg={4}>
                          <Grid item xs={6}>
                            <span style={{ color:'#666' }}><Text tid={'Quote.FullName'} /></span>
                          </Grid>
                          <Grid item xs={6}>
                            <span style={{ fontWeight:'700' }}>{row.lastName}, {row.firstName}</span>
                          </Grid>
                          <Grid item xs={6}>
                            <span style={{ color:'#666' }}><Text tid={'Quote.Gender'} /></span>
                          </Grid>
                          <Grid item xs={6}>
                            <span style={{ fontWeight:'700' }}>{row.gender}</span>
                          </Grid>
                          <Grid item xs={6}>
                            <span style={{ color:'#666' }}><Text tid={'Quote.BirthDate'} /></span>
                          </Grid>
                          <Grid item xs={6}>
                            <span style={{ fontWeight:'700' }}>{row.birthdate}</span>
                          </Grid>
                          <Grid item xs={6}>
                            <span style={{ color:'#666' }}><Text tid={'Quote.Age'} /></span>
                          </Grid>
                          <Grid item xs={6}>
                            <span style={{ fontWeight:'700' }}>{row.age}</span>
                          </Grid>
                        </Grid>

                        <Grid item container xs={12} sm={12} md={4} lg={4}>
                          <Grid item xs={12}>
                            <span style={{ fontWeight:'700' }}>{`${row.compnayName} ${row.planName}`}</span>
                          </Grid>
                          <Grid item xs={6}>
                            <span style={{ color:'#666' }}><Text tid={'TravelApplication.Coverage'} /></span>
                          </Grid>
                          <Grid item xs={6}>
                            <span style={{ fontWeight:'700' }}>{amountFormat(row.coverage, 0)}</span>
                          </Grid>
                          <Grid item xs={6}>
                            <span style={{ color:'#666' }}><Text tid={'Quote.Deductible'} /></span>
                          </Grid>
                          <Grid item xs={6}>
                            <span style={{ fontWeight:'700' }}>{amountFormat((parseFloat(row.deductible)),2)}</span>
                          </Grid>
                          {row.tripType === "MULTI" ?
                          <>
                            <Grid item xs={6}>
                              <span style={{ color:'#666' }}><Text tid={'TravelApplication.MultiDays'} /></span>
                            </Grid>
                            <Grid item xs={6}>
                              <span style={{ fontWeight:'700' }}>{row.multiTripDays}</span>
                            </Grid>
                            </>
                          :null}
                          <Grid item xs={6}>
                            <span style={{ color:'#666' }}><Text tid={'Vendor.Step3.TotalPremium'} /></span>
                          </Grid>
                          <Grid item xs={6}>
                            <span style={{ fontWeight:'700' }}>{amountFormat(row.insuranceAmount, 2)}</span>
                          </Grid>

                          {row.optionPlan.map((op, index)=>(
                            <Grid item container key={index} style={{ marginBottom:'1vh' }}>

                                <Grid item xs={6}>
                                  <span style={{ color:'#666' }}>{op.optionPlanName}</span>
                                </Grid>
                                <Grid item xs={6}>
                                <span style={{ fontWeight:'700' }}>{amountFormat(op.optionPlanCoverage, 0)}</span>
                                </Grid>
                                <Grid item xs={6}>
                                  <span style={{ color:'#666' }}><Text tid={'Vendor.Step3.TotalPremium'} /></span>
                                </Grid>
                                <Grid item xs={6}>
                                <span style={{ fontWeight:'700' }}>{amountFormat((parseFloat(op.optionPlanPrice)),2)}</span>
                                </Grid>
                            </Grid>
                          ))}
                          {row.carewellService ?
                          <>
                            <Grid item xs={6}>
                              <span style={{ color:'#ffbb00' }}><Text tid={'Vendor.Step4.CarewellSelection'} /></span>
                            </Grid>
                            <Grid item xs={6}>
                              <span style={{ fontWeight:'700', color:'#ffbb00' }}>{row.carewellService}</span>
                            </Grid>
                            <Grid item xs={6}>
                              <span style={{ color:'#ffbb00' }}><Text tid={'Vendor.Step3.TotalCarewellAmount'} /></span>
                            </Grid>
                            <Grid item xs={6}>
                              <span style={{ fontWeight:'700', color:'#ffbb00' }}>{amountFormat((parseFloat(row.carewellServiceAmount)),2)}</span>
                            </Grid>
                            </>
                          :null}
                        </Grid>
                      </Grid>
                    </React.Fragment>
                  ))}
                  {/* <Grid item container className={classes.totalPremiumArea}> */}
                  {/* <Grid item container style={{display: 'flex',justifyContent: 'flex-end', padding:'1vh', fontSize:'12px', fontWeight:'500' }}>
                    Total Premiums : {amountFormat((sellCarewellData.insuredpersons.reduce((a, v) => a = a + parseFloat(v.insuranceAmount + v.optionPlanPrice), 0) - (sellCarewellData.familyGroup?sellCarewellData.familyGroup.discountPremium:0) ),2)}
                  </Grid> */}
                  <Grid item container style={{display: 'flex',justifyContent: 'flex-end', padding:'1vh', fontSize:'12px', fontWeight:'500', color:'#ffbb00' }}>
                    Total Service Fee : {amountFormat((sellCarewellData.total_amount - sellCarewellData.insuredpersons.reduce((a, v) => a = a + parseFloat(v.insuranceAmount + v.optionPlanPrice), 0) - (sellCarewellData.familyGroup?sellCarewellData.familyGroup.discountPremium:0) ),2)}
                  </Grid>
                  <Grid item container style={{ border:'1px solid #ddd', height:'fit-content', padding:'1vh', fontSize:'12px', fontWeight:'500' }}>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                      <Grid item container>
                        <Grid item xs={6}>
                        <span style={{ color:'#666' }}><Text tid={'Quote.PaymentMethod'} /></span>
                        </Grid>
                        <Grid item xs={6}>
                        <span style={{ fontWeight:'700' }}>{sellCarewellData.payment[0].paymentMethod}</span>
                        </Grid>
                      </Grid>
                      
                    </Grid>
                    <Grid item xs={12} sm={12} md={8} lg={8}>
                      <Grid item container>
                      {sellCarewellData.payment[0].paymentMethod === 'Creditcard' && sellCarewellData.payment[0].creditCardNumber && (
                      <>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <Grid item container>
                            <Grid item xs={6}>
                              <span style={{ color:'#666' }}><Text tid={'Quote.CardHolderName'} /></span>
                            </Grid>
                            <Grid item xs={6}>
                              <span style={{ fontWeight:'700' }}>{sellCarewellData.payment[0].cardHolderName}</span>
                            </Grid>
                            <Grid item xs={6}>
                              <span style={{ color:'#666' }}><Text tid={'Quote.CardExpiration'} /></span>
                            </Grid>
                            <Grid item xs={6}>
                              <span style={{ fontWeight:'700' }}>{sellCarewellData.payment[0].cardExpired}</span>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                        <Grid item container>
                            <Grid item xs={6}>
                              <span style={{ color:'#666' }}><Text tid={'Quote.CreditCardNumber'} /></span>
                            </Grid>
                            <Grid item xs={6}>
                              <span style={{ fontWeight:'700' }}> {sellCarewellData.payment[0].creditCardNumber} </span>
                            </Grid>
                            <Grid item xs={6}>
                              <span style={{ color:'#666' }}><Text tid={'Quote.CardCVV'} /></span>
                            </Grid>
                            <Grid item xs={6}>
                              <span style={{ fontWeight:'700' }}> {sellCarewellData.payment[0].cardcvv} </span>
                            </Grid>
                          </Grid>
                        </Grid>

                      </>
                    )}
                      </Grid>
                        
                    </Grid>

                  </Grid>
                  </>
                )} 

              </Grid>
              <Grid item sm={5}>
                {submitted === true && applicationId &&
                  <CarewellSellSubmitResult
                    id={applicationId}
                    formData={sellFormData}
                    result = {handleSellCarewellResult}
                  />
                }
              </Grid>
            </Grid>   

              
              {submitted === false &&
                <div className={classes.submitArea}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ marginRight: '2vh' }}
                    className={classes.submit}
                    disabled = {(sellCarewellData.app_status === 'Pending' || sellCarewellData.app_status === 'Accepted')? false : true}
                    onClick={() => {handleSubmit()}}
                  >
                    Sell
                  </Button>
                  <Button
                    color="secondary"
                    className={classes.submit}
                    onClick={() => {handleClose(false)}}
                  >
                    Close
                  </Button>
                </div>
              }

            </div>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CarewellSellModal