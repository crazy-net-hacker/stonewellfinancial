import React from 'react';
// import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
// //redux
// import { 
//   // useSelector, 
//   useDispatch } from 'react-redux';
// import { postHealthQuote } from '../../../redux/actions/healthQuoteAction';
// core components
import { Grid, Typography,
      Table, TableBody, TableCell, TableHead, TableRow 
} from '@material-ui/core/';
// common components
import { Text } from '../../../components/common/LanguageProvider';
import Button from '../../../components/common/CustomButtons/Button'
//
import { QuoteBanner2 } from '../../../components/common/QuoteBanner2';
import StepHeader from './StepHeader';
import {pathDirection} from './Progress';
//Style
import formStyle from '../../../assets/jss/styles/formStyle';

// import axios from 'axios'

//common styles
const useStyles = makeStyles(formStyle)

const Review = (props) => {
  const { healthFormData } = props; 

  const classes = useStyles();
  // 
  const productSelection = [
    {name: 'ProductType', value: healthFormData.productTypeDesc},
    {name: 'ProductKind', value: healthFormData.productKindDesc},
    {name: 'ProductBenefit', value:  healthFormData.benefitAmount?`$${healthFormData.benefitAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`:null},
  ]
  //
  const requesterInfo = [
    {name: 'FirstName', transl: '', value: healthFormData.insuredPersons[0].firstName},
    {name: 'LastName', transl: '', value: healthFormData.insuredPersons[0].lastName},
    {name: 'BirthDate', transl: '', value: healthFormData.insuredPersons[0].birthDate?`${healthFormData.insuredPersons[0].birthDate.toString().slice(4,15)}`:null},
    {name: 'Gender', transl: 'Quote.', value: healthFormData.insuredPersons[0].gender},
    {name: 'SmokeStatus', transl: 'Button.', value: healthFormData.insuredPersons[0].smokeStatus},
    {name: 'HealthStatus', transl: '', value: healthFormData.insuredPersons[0].healthStatus},
    {name: 'Province', transl: '', value: healthFormData.province},
    {name: 'Phone', transl: '', value: healthFormData.phone},
    {name: 'Email', transl: '', value: healthFormData.email},
    {name: 'PreferContactMethod', transl: 'Quote.', value: healthFormData.contactMethod},
  ]


  //
  const familyIllnessHistory = [
    {name: 'WhatAge', value: healthFormData.ageIllness},
    {name: 'WhatName', value: healthFormData.nameIllness},
]

  //
  const employmentInfo = [
    {name: 'AnnualIncome', value: healthFormData.annualIncome?`$${healthFormData.annualIncome.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`:null},
    {name: 'Occupation', value: healthFormData.occupation},
    {name: 'RoleAtWork', value: healthFormData.roleAtWork},
  ]



  // handleSubmit
  const handleSubmit = async () => {
    if (healthFormData.benefitAmount === '') {healthFormData.benefitAmount = 0}
    if (healthFormData.annualIncome === '') {healthFormData.annualIncome = null}
    
    props.history.push(pathDirection(props.location.pathname, healthFormData).nextStep)
  }

  let height = '0px'

  return (
    <>
      <QuoteBanner2 title={'Quote.HealthIns.Title'} subTitle={'Quote.HealthIns.SubTitle'} links={[]} />
      <StepHeader height={height} activeStep={3} />
      
      <div className={classes.formWrapper}>

      {/* Title */}
      <Typography variant="h5" gutterBottom className={classes.title_question}>
        <Text tid={'Quote.ReviewYourApplication'}/>
        <span className={classes.title_question_sub2}><Text tid={'Quote.ReviewYourApplication.Notice'}/></span>
      </Typography>
       

      <Grid container justify="center" > 
          {/* Product Selection*/}
          <Grid item container xs={12} sm={10} md={10} lg={8} className={classes.applicant}>  
            {/* title */}
            <Grid item xs={12} className={classes.subtitle}>
                <div>
                    <span className={classes.grayLine}></span>
                </div>
                <Text tid={'Quote.SelectedProduct'}/>
            </Grid>
          </Grid>

          {/* Contents */}
          <Grid  item container xs={12} sm={10} md={10} lg={8} className={classes.subInfoWrapperBox}> 
              <Grid  item xs={12} md={3} className={classes.subInfoWrapper}>
                <span className={classes.subTitle}>Insurance</span> 
                <p color="textSecondary"> 
                  {healthFormData.insuranceKindDesc}
                </p>
              </Grid>

            { healthFormData.insuranceKind === 'Critical' &&
            <>
              {productSelection.map((productSel) => (
                <React.Fragment key={productSel.name}>
                  <Grid  item xs={12} md={3} className={classes.subInfoWrapper}>
                    <span className={classes.subTitle}>
                      <Text tid={`Quote.${productSel.name}`}/>
                    </span> 
                    <p color="textSecondary"> 
                      {productSel.value}
                    </p>  
                  </Grid>
                </React.Fragment>
              ))}
            </> 
            }
          </Grid>
          
      </Grid>

      <Grid item container justify="center"> 
          {/* Personal Info */}
          <Grid item container xs={12} sm={10} md={10} lg={8} className={classes.applicant}>  
            {/* title */}
              <Grid item xs={12} className={classes.subtitle}>
                  <div>
                      <span className={classes.grayLine}></span>
                  </div>
                  <Text tid={'Quote.PersonalInfomation'}/>
              </Grid>
          </Grid>

          {/* Contents */}
          <Grid  item container xs={12} sm={10} md={10} lg={8} className={classes.subInfoWrapperBox}> 
            {requesterInfo.map((requesterInfo) => (
              <React.Fragment key={requesterInfo.name}>
                <Grid  item xs={12} md={3} className={classes.subInfoWrapper}>
                    <span className={classes.subTitle}>
                      <Text tid={`Quote.${requesterInfo.name}`}/>
                    </span> 
                    <p color="textSecondary"> 
                    <Text tid={`${requesterInfo.transl}${requesterInfo.value}`}/>
                    </p>  
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
      </Grid>
          

        
      {/* Family History */}
      { healthFormData.insuranceKind !== 'Personal' &&
        <>
            <Grid item container justify="center"> 
              <>
              {/* title */}
              <Grid item container justify="center" xs={12} sm={10} md={10} lg={8} spacing={1} className={classes.applicant}>  
                <Grid item xs={12} className={classes.subtitle}>
                    <div>
                        <span className={classes.grayLine}></span>
                    </div>
                    <Text tid={'Quote.Health.FamilyIllnessHistory'}/>
                </Grid>
              </Grid>    
              </>

              {/* Contents */}
              <Grid  item container  xs={12} sm={10} md={10} lg={8} className={classes.subInfoWrapperBox}>
                  <Grid  item xs={12} className={classes.subInfoWrapper}>
                      <span className={classes.subTitle}>
                        <Text tid={'Quote.Health.FamilyIllnessHistory.Have'}/>
                      </span> 
                      <p color="textSecondary"> 
                        <Text tid={`Button.${healthFormData.familyIllnessHistory}`}/>
                      </p>  
                  </Grid>
              
                  {healthFormData.familyIllnessHistory === 'Yes' &&
                    <>
                      {familyIllnessHistory.map((illnessHistory) => (
                        <React.Fragment key={illnessHistory.name}>
                          <Grid  item xs={12} md={3} className={classes.subInfoWrapper}>
                            <span className={classes.subTitle}>
                              <Text tid={`Quote.Health.FamilyIllnessHistory.${illnessHistory.name}`}/>
                            </span> 
                            <p color="textSecondary"> 
                              {illnessHistory.value}
                            </p>  
                          </Grid>
                        </React.Fragment>
                      ))}
                    </> 
                  }
              </Grid>
            </Grid>
        </>
        }

        {/* Employment */}
        { healthFormData.insuranceKind === 'Disability' &&
          <>
            {/* title */}
            <Grid item container justify="center" > 
              <Grid item container xs={12} md={10} lg={8} spacing={1} className={classes.applicant}>  
                <Grid item xs={12} className={classes.subtitle}>
                    <div>
                        <span className={classes.grayLine}></span>
                    </div>
                    <Text tid={'Quote.Health.Employment'}/>
                    {/* Employment Information */}
                </Grid>
              </Grid> 
              {/* Contents */}
              <Grid  item container xs={12} md={10} lg={8} className={classes.subInfoWrapperBox}>    
                  {employmentInfo.map((employInfo) => (
                    <React.Fragment key={employInfo.name}>
                      <Grid  item xs={6} md={3} className={classes.subInfoWrapper}>
                        <span className={classes.subTitle}>
                          <Text tid={`Quote.Health.${employInfo.name}`}/>
                        </span> 
                        <p color="textSecondary"> 
                          {employInfo.value}
                        </p>  
                      </Grid>
                    </React.Fragment>
                  ))}
              </Grid>
            </Grid>
          </>
        }
  

        {/* Famliy */}
        { healthFormData.insuranceKind === 'Personal' && healthFormData.insuredPersons.length > 1 &&
          <>
            <Grid container justify="center" spacing={2} className={classes.gridMargin}> 
                {/* title */}
                <Grid item container xs={12} md={10} lg={8} className={classes.applicant}>  
                  <Grid item xs={12} className={classes.subtitle}>
                      <div>
                          <span className={classes.grayLine}></span>
                      </div>
                      <Text tid={'Quote.Health.FamilyInformation'}/>
                  </Grid>
                </Grid> 
                {/* Contents */}
                <Grid item container xs={12} md={10} lg={8}>  
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left"><Text tid={`Quote.${'Relationship'}`}/></TableCell>
                        <TableCell align="left"><Text tid={`Quote.${'FirstName'}`}/></TableCell>
                        <TableCell align="left"><Text tid={`Quote.${'LastName'}`}/></TableCell>
                        <TableCell align="left"><Text tid={`Quote.${'BirthDate'}`}/></TableCell>
                        <TableCell align="left"><Text tid={`Quote.${'Gender'}`}/></TableCell>
                        <TableCell align="left"><Text tid={`Quote.${'SmokeStatus'}`}/></TableCell>
                        <TableCell align="left"><Text tid={`Quote.${'HealthStatus'}`}/></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {healthFormData.insuredPersons.map((insuredPerson, index) => (
                        index === 0
                        ? null
                        : 
                        <TableRow key={insuredPerson.firstName}>
                          <TableCell component="th" scope="row">
                            {insuredPerson.relationship}
                          </TableCell>
                          <TableCell>{insuredPerson.firstName}</TableCell>
                          <TableCell>{insuredPerson.lastName}</TableCell>
                          <TableCell>{insuredPerson.birthDate.toString().slice(4,15)}</TableCell>
                          <TableCell><Text tid={`Quote.${insuredPerson.gender}`}/></TableCell>
                          <TableCell><Text tid={`Button.${insuredPerson.smokeStatus}`}/></TableCell>
                          <TableCell><Text tid={`Quote.${insuredPerson.healthStatus}`}/></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
            </Grid>
          </>
        }
    
          <Grid item container style={{ margin: '10vh 0 10vh 0' }} justify="center" spacing={1}>
            <Grid item xs={12} sm={6} lg={3}>
              <Button
                // type='submit'
                // variant='contained'
                color="secondary" 
                className={classes.back_button}
                onClick={() => 
                  props.history.push(pathDirection(props.location.pathname, healthFormData).prevStep)
                }
              >
                <Text tid={'Button.Previous'}/>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Button
                // type='submit'
                // variant='contained'
                color="dark" 
                className={classes.next_button}
                // onClick={() => nextStep()}
                onClick={() => handleSubmit()}
              >
                <Text tid={'Button.RequestQuote'}/>
              </Button>
            </Grid>
          </Grid>

        {/* <Message
          title="Message"
          content="System error has occurred, please contact us!"
          open={messageOpen}
          setOpen={setMessageOpen}
        />  */}

      </div>
    </>
  );
};

Review.propTypes = {
  healthFormData: PropTypes.object.isRequired,
};

export default Review;
