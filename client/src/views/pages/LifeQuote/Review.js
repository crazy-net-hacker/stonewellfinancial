import React from 'react';
// import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
// core components
import { Grid, Typography, } from '@material-ui/core/';
// common components
import Button from '../../../components/common/CustomButtons/Button'
import { Text } from '../../../components/common/LanguageProvider';
//
import { QuoteBanner2 } from '../../../components/common/QuoteBanner2';
import StepHeader from './StepHeader';
import {pathDirection} from './Progress';
//style
import formStyle from '../../../assets/jss/styles/formStyle';

//Style
const useStyles = makeStyles(formStyle)

const Review = (props) => {
  const { lifeFormData } = props; 
  
  const classes = useStyles();
  // 
  const productSelection = [
    {name: 'ProductType', value: lifeFormData.productTypeDesc},
    {name: 'ProductKind', value: lifeFormData.productKindDesc},
    {name: 'ProductBenefit', value:  `$${lifeFormData.benefitAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`},
  ]
  //
  const requesterInfo = [
    {name: 'FirstName', transl: '', value: lifeFormData.firstName},
    {name: 'LastName', transl: '', value: lifeFormData.lastName},
    {name: 'BirthDate', transl: '', value: `${lifeFormData.birthDate.toString().slice(4,15)}`},
    {name: 'Gender', transl: 'Quote.', value: lifeFormData.gender},
    {name: 'SmokeStatus', transl: 'Button.', value: lifeFormData.smokeStatus},
    {name: 'HealthStatus', transl: 'Quote.', value: lifeFormData.healthStatus},
    {name: 'Phone', transl: '', value: lifeFormData.phone},
    {name: 'Email', transl: '', value: lifeFormData.email},
    {name: 'PreferContactMethod', transl: 'Quote.',value: lifeFormData.contactMethod},
  ]


  let height = '0px'

  return (
    <>
      <QuoteBanner2 title={'Quote.LifeIns.Title'} subTitle={'Quote.LifeIns.SubTitle'} links={[]} />
      <StepHeader height={height} activeStep={3} />

      <div>

        {/* <Typography variant='h5' className={classes.title} >
          <Text tid={'Quote.Step.ProdSelection'}/>
        </Typography> */}
        {/* Title */}
        <Typography variant="h5" gutterBottom className={classes.pageTitle}>
          <Text tid={'Quote.ReviewYourApplication'}/>
        </Typography>
        <Typography gutterBottom className={classes.description}>
          <Text tid={'Quote.ReviewYourApplication.Notice'}/>
        </Typography>

        <Grid container justify="center" spacing={2} className={classes.gridMargin}> 
        {/* Product Selection*/}
          <Grid item container xs={12} md={10} spacing={1} className={classes.applicant}>  
          {/* title */}
            <Grid item xs={12} className={classes.subtitle}>
                <div>
                    <span className={classes.grayLine}></span>
                </div>
                <Text tid={'Quote.SelectedProduct'}/>
            </Grid>
          </Grid>
            {/* contents */}
            {productSelection.map((productSel) => (
              <React.Fragment key={productSel.name}>
                {/* <Grid item xs={5}>
                  <Typography><Text tid={`Quote.${productSel.name}`}/></Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography variant="subtitle1" className={classes.userInputValue}>{productSel.value}</Typography>
                </Grid> */}
                <Grid  item xs={6} md={3} className={classes.subInfoWrapper}>
                    <span className={classes.subTitle}>
                      <Text tid={`Quote.${productSel.name}`}/>
                    </span> 
                    <p color="textSecondary"> 
                      {productSel.value}
                    </p>  
                </Grid>
              </React.Fragment>
            ))}

        </Grid>

      <Grid container justify="center" spacing={2} className={classes.gridMargin}> 
        {/* Personal Info */}
       <Grid item container xs={12} md={10} spacing={1} className={classes.applicant}>  

            {/* title */}
            <Grid item xs={12} className={classes.subtitle}>
                <div>
                    <span className={classes.grayLine}></span>
                </div>
                <Text tid={'Quote.PersonalInfomation'}/>
            </Grid>
            </Grid>
      
          {/* Contents */}
          <Grid  item container xs={12} md={10} spacing={1} className={classes.subInfoWrapperBox}> 
              {requesterInfo.map((requesterInfo) => (
                <React.Fragment key={requesterInfo.name}>
                  <Grid  item xs={6} md={3} className={classes.subInfoWrapper}>
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
    
      <Grid container style={{ margin: '10vh 0 10vh 0' }} justify="center" spacing={1}>
        
        <Grid item xs={6} lg={3}>
          <Button
            color='secondary'
            variant='contained'
            className={classes.back_button}
            // className={classes.button}
            onClick={() => {
              props.history.push(pathDirection(props.location.pathname, lifeFormData).prevStep)
            }}
          >
            <Text tid={'Button.Previous'}/>
          </Button>
        </Grid>
        
        <Grid item xs={6} lg={3}>
          <Button
            color='primary'
            variant='contained'
            className={classes.next_button}
            onClick={() => 
              props.history.push(pathDirection(props.location.pathname, lifeFormData).nextStep)
            }
          >
            <Text tid={'Button.RequestQuote'}/>
          </Button>
        </Grid>

      </Grid>

      </div>
    </>
  );
};

Review.propTypes = {
  lifeFormData: PropTypes.object.isRequired,
};

export default Review;