import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
//
import {Grid, Typography } from '@material-ui/core';
// common components
import { Text, LanguageContext } from '../../../components/common/LanguageProvider';
import Button from '../../../components/common/CustomButtons/Button';
// functionalities
import { amountFormat } from '../../../controllers/dataFormat'
import { textLineBreak } from '../../../functionalities/TextFormat'
//  
import StepHeader from './StepHeader';
import {pathDirection} from './Progress';
//style
import formStyle from '../../../assets/jss/styles/formStyle';

//Style
const useStyles = makeStyles(formStyle)

const ReviewApplication = (props) => {
    const { formData } = props;
    
    //current language
    let currentLanguage = useContext(LanguageContext).userLanguage
  
    const classes = useStyles();
    // const [direction, setDirection] = useState('back');

    var total = 0
    let height = '0px'
    
    return (
      <>
      <StepHeader height={height} activeStep={2} data={formData} />

        <Typography variant="h5" gutterBottom className={classes.title_question}>
                  <Text tid={'Quote.ReviewApplication'}/>
                <span className={classes.title_question_sub2}>
                  <Text tid={'Quote.ReviewConfirm'}/>
                </span>
        </Typography>    

        <Formik
          initialValues={formData}
          onSubmit={values => {
            values.insuredType = values.insuredPersons[0].eligilbeIns
            values.contactName = values.insuredPersons[0].firstName + ' ' + values.insuredPersons[0].lastName
            values.preferLanguage = currentLanguage
            props.updateFormData(values);
            props.history.push(pathDirection(props.location.pathname, values).nextStep);
          }}
        >
          {({ values, handleChange, setFieldValue }) => (
  
          <Form  style={{margin:'2vh'}}>
            <Grid container justify="center">
              <Grid item container xs={12} sm={12} md={12} lg={8} xl={7} spacing={1}>

                <Grid  item container xs={12} sm={12} style={{padding:'20px', background:"#f0f8ff", marginBottom:'2vh'}} >  
                  <Grid  item container xs={12} sm={12} spacing={1}>  
                    <Grid item xs={12} className={classes.app_box}>
                      <div style={{ display: 'none' }}>
                        {total = 0}
                        {total = values.insuredPersons.reduce((a, v) => a = a + parseFloat(v.selectedPlan.calculatedInsuranceAmount), 0) - values.familyGroup.discountPremium}
                      </div>
                      <span className={classes.app_name_box}><Text tid={'Quote.TotalPremium'}/></span>
                    </Grid>
                    <Grid item xs={12} className={classes.app_box}>
                      <span className={classes.app_amount_box}>{amountFormat(total,2)} </span>
                    </Grid>
                    <Grid item xs={12} className={classes.app_box}>
                      <span className={classes.app_days_box}> Covered </span> 
                      <span className={classes.app_days_sub_box}>{values.insuredPersons.length} applicants</span>
                      {/* 가입자 3명 포함  */}
                    </Grid>
                  </Grid>
                </Grid>

                {/* Contact Information */}
                <Grid  item container xs={12} sm={12} spacing={1} style={{fontWeight:'400', padding:'10px', fontSize:'18px', background:'#efefef', margin:'2vh 0'}}>
                  <span><Text tid={'Quote.ContactInformation'}/></span>
                </Grid>

                <Grid  item container xs={12} sm={12} spacing={1}  style={{paddingLeft:'20px', paddingBottom:'2vh'}}>  
                  <Grid  item container xs={12} sm={12} spacing={1}>  
                  {values.maillingInCanada === true && (
                    <Grid  item container xs={12} sm={12} spacing={1}>  
                        <Grid item xs={5} md={6} style={{fontSize:'16px', fontWeight:'400'}}>
                          <span><Text tid={'Quote.Address'}/></span>
                        </Grid>
                        <Grid item xs={7} md={6} style={{textAlign:'right', fontWeight:'600'}}>
                          <span>{values.mailStreetName} {values.mailUnitApartmentNo}, {values.mailCity} </span><br/>
                          <span>{values.mailProvince}, {values.mailPostalCode}</span><br/>
                          {/* <span>{values.mailCountry?countries.filter(f => f.country_code === values.mailCountry)[0].name:''}</span> */}
                          <span>{values.mailCountry?values.mailCountry:''}</span>
                        </Grid>
                    </Grid>
                  )}
                    <Grid  item container xs={12} sm={12} spacing={1}>  
                        <Grid item xs={5} md={6} style={{fontSize:'16px', fontWeight:'400'}}>
                          <span><Text tid={'Quote.Email'}/></span>
                        </Grid>
                        <Grid item xs={7} md={6} style={{textAlign:'right', fontWeight:'600'}}>
                          <span>{values.contactEmail}</span>
                        </Grid>
                    </Grid>
                    <Grid  item container xs={12} sm={12} spacing={1}>  
                        <Grid item xs={5} md={6} style={{fontSize:'16px', fontWeight:'400'}}>
                          <span><Text tid={'Quote.Phone'}/></span>
                        </Grid>
                        <Grid item xs={7} md={6} style={{textAlign:'right', fontWeight:'600'}}>
                          <span>{values.contactPhone}</span>
                        </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Payment Information */}
                <Grid  item container xs={12} sm={12} spacing={1} style={{fontWeight:'400', padding:'10px', fontSize:'18px', background:'#efefef', margin:'2vh 0'}}>
                  <span><Text tid={'Quote.PaymentInformation'}/></span>
                </Grid>

                <Grid  item container xs={12} sm={12} spacing={1}  style={{paddingLeft:'20px', borderBottom:'1px solid #efefef', paddingBottom:'2vh'}}>  
                  <Grid  item container xs={12} sm={12} spacing={1}>  
                      <Grid item xs={5} md={6} style={{fontSize:'16px', fontWeight:'400'}}>
                        <span><Text tid={'Quote.PaymentMethod'}/></span>
                      </Grid>
                      <Grid item xs={7} md={6} style={{textAlign:'right', fontWeight:'600'}}>
                        <span >{values.paymentMethod}</span>
                      </Grid>
                  </Grid>
                  {values.paymentMethod === 'Creditcard' 
                    ? (<>
                        <Grid  item container xs={12} sm={12} spacing={1}>  
                            <Grid item xs={5} md={6} style={{fontSize:'12px'}}>
                              <span><Text tid={'Quote.CardHolderName'}/></span>
                            </Grid>
                            <Grid item xs={7} md={6} style={{textAlign:'right'}}>
                              <span>{values.cardHolderName}</span>
                            </Grid>
                        </Grid>
                        <Grid  item container xs={12} sm={12} spacing={1}>  
                            <Grid item xs={5} md={6} style={{fontSize:'12px'}}>
                              <span><Text tid={'Quote.CreditCardNumber'}/></span>
                            </Grid>
                            <Grid item xs={7} md={6} style={{textAlign:'right'}}>
                              <span>{values.creditCardNumber}</span>
                            </Grid>
                        </Grid>
                        <Grid  item container xs={12} sm={12} spacing={1}>  
                            <Grid item xs={5} md={6} style={{fontSize:'12px'}}>
                              <span><Text tid={'Quote.CardExpiration'}/></span>
                            </Grid>
                            <Grid item xs={7} md={6} style={{textAlign:'right'}}>
                              <span>{values.cardExpired}</span>
                            </Grid>
                        </Grid>
                      </>)
                    :   
                      <Grid  item container xs={12} sm={12} spacing={1}>  
                        <Grid item xs={5} md={6} style={{fontSize:'12px'}}>
                          <span><Text tid={'Quote.SenderName'}/></span>
                        </Grid>
                        <Grid item xs={7} md={6} style={{textAlign:'right'}}>
                          <span>{values.senderName}</span>
                        </Grid>
                      </Grid>
                  }
                      
                </Grid>

                {/* Note */}
                {values.note &&(
                  <>
                    <Grid  item container xs={12} sm={12} spacing={1} style={{fontWeight:'400', padding:'10px', fontSize:'18px', background:'#efefef', margin:'2vh 0'}}>
                      <span><Text tid={'TravelApplication.NoteTitle'}/></span>
                    </Grid>
                    <Grid  item container xs={12} sm={12} spacing={1}  style={{paddingLeft:'20px', borderBottom:'1px solid #efefef', paddingBottom:'2vh'}}>  
                        {textLineBreak(values.note)}
                    </Grid>
                  </>
                )}


              </Grid>

            </Grid>

            <Grid container style={{ margin: '10vh 0 10vh 0' }} justify="center"  spacing={1}>
                
                <Grid item xs={6} sm={6} md={3} lg={3}>
                  <Button color="secondary" className={classes.back_button} 
                    onClick={() => {
                      props.updateFormData(values); 
                      props.history.push(pathDirection(props.location.pathname, values).prevStep)
                    }}
                    >
                    <Text tid={'Button.Previous'}/>
                  </Button>
                </Grid>
            
              <Grid item xs={6} sm={6} md={3} lg={3}>
                <Button type='submit' color="dark" className={classes.next_button} 
                  // onClick={() => setDirection('forward')}
                  >
                  <Text tid={'Button.ProceedApplication'}/>
                </Button>
              </Grid>
            </Grid>

     
          </Form>
    
          )}
          
        </Formik>

                

          
  
      </>
      
    );
  
  };

// ProtoTypes
ReviewApplication.propTypes = {
  formData: PropTypes.object.isRequired,
  // setFormData: PropTypes.func.isRequired,
  // nextStep: PropTypes.func.isRequired,
  // prevStep: PropTypes.func.isRequired
};


export default ReviewApplication;