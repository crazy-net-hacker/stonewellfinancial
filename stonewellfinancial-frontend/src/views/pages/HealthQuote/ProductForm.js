import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
// form & Validation
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import * as Validation from '../../Validation';
// core components
import {Typography, Grid} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
// common components
import MetaTags from '../../../components/common/MetaTags';
import CustomNumberFormat from '../../../components/common/CustomNumberFormat'
import Button from '../../../components/common/CustomButtons/Button'
import { RegularTextField, SelectTextField } from '../../../components/common/CustomTextFields/TextField'
import { Text } from '../../../components/common/LanguageProvider';
//
import { QuoteBanner2 } from '../../../components/common/QuoteBanner2';
import StepHeader from './StepHeader';
import {pathDirection} from './Progress';

//Style
import formStyle from '../../../assets/jss/styles/formStyle';

//common styles
const useStyles = makeStyles(formStyle)
// 
const kindInsurance = [
  {code: 'Critical', desc: 'Critical Illness Insurance'},
  {code: 'Disability', desc: 'Disability Insurance'},
  {code: 'Personal', desc: 'Personal Insurance'}
]

const typeProduct = [
    {code: 'Term', desc: 'Term Insurance'},
    {code: 'Permanent', desc: 'Permanent Insurance'},
  ]

const kindTerm = [
    {code: 'Term10', desc: 'Term 10'},
    {code: 'Term20', desc: 'Term 20'},
  ]  
 
const kindPermanent = [
    {code: 'Life', desc: 'Life Time Payment'},
    {code: 'Life_ReturnLater15', desc: 'Life Time Payment + Return of Premium 15 years later'},
    {code: 'Life_ReturnAt60', desc: 'Life Time Payment + Return of Premium at 65 years old'},
  ]  
   

const amtBenefit = [
  {name: '$50,000', value: 50000},
  {name: '$100,000  (popular)', value: 100000},
  {name: '$150,000', value: 150000},
  {name: '$200,000', value: 200000},
  {name: '$250,000', value: 250000},
  {name: '$500,000', value: 500000},
  {name: 'Other', value: 0}
  ]   


const ProductForm = (props) => {
  const { match, healthFormData } = props;   

  const metaData = {
    title: 'Meta.HealthInsurace.Quote.Title',
    description: 'Meta.HealthInsurace.Quote.Description',
    canonical: match.url
  }

  const classes = useStyles();
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [minBenefitAmont, SetMinBenefitAmount] = useState(0);


  // validation
  const validationSchema = Yup.object({
    insuranceKind: Validation.validRequiredField(),
    productType: Yup.string().when("insuranceKind", 
                  {is: "Critical", 
                  then: Validation.validRequiredField()}),
    productKind: Yup.string().when("insuranceKind", 
                  {is: "Critical", 
                  then: Validation.validRequiredField()}),
    selectedBenefitAmount: Yup.string().when("insuranceKind", 
                  {is: "Critical", 
                  then: Validation.validRequiredField()}),
    benefitAmount: Yup.number().when("insuranceKind", 
                  {is: "Critical", 
                  then: Yup.number().required('Enter the benefit amount you want.')
                            .min([minBenefitAmont], `Enter over amount ${[minBenefitAmont]}`)
                }),
  })

  // ValidMessage
  function validMessage(fieldName) {
    return (
        <ErrorMessage
            name={fieldName}
            render={(msg) => 
                <div style={{ color: 'red', marginLeft: '1vh', fontSize: 12 }}>
                    <Text tid={`Validation.${msg}`}></Text>
                </div>
            }
        />
    );
  }


  // handleSubmit
  function handleSubmit(values){
    // 
    values.insuranceKindDesc = kindInsurance.filter(i => i.code === values.insuranceKind)[0].desc

    if (values.insuranceKind === 'Critical') {

        values.productTypeDesc = typeProduct.filter(p => p.code === values.productType)[0].desc
      
        if (values.productType === 'Term'){
            values.productKindDesc = kindTerm.filter(p => p.code === values.productKind)[0].desc
        } else if (values.productType === 'Permanent'){
            values.productKindDesc = kindPermanent.filter(p => p.code === values.productKind)[0].desc
        }
    } else {
      values.productTypeDesc = ''
      values.productKindDesc = ''
    }
    props.updateHealthFormData(values);
    props.history.push(pathDirection(props.location.pathname, values).nextStep);
}

  let height = '0px'

  return (
    <>
      <MetaTags data={metaData} />
      <QuoteBanner2 title={'Quote.HealthIns.Title'} subTitle={'Quote.HealthIns.SubTitle'} links={[]} />
      <StepHeader height={height} activeStep={1}/>

      <Typography variant="h5" gutterBottom className={classes.title_question}>
        <Text tid={'Quote.WhichInsuranceGetAQuote'}/>
      </Typography>
      
      <Formik
        initialValues={healthFormData}
        validationSchema={validationSchema}
        onSubmit={values => {
          // console.log(values)
          handleSubmit(values)
        }}
      >
        {({ values, handleChange, handleBlur, setFieldValue }) => (
          <Form className={classes.formWrapper}>
            <Grid container justify="center">
              <Grid item container justify="center" spacing={2} xs={12} sm={10}>
              {/* Insurance Selection */}
              <Grid  item xs={12} lg={4}>
                <SelectTextField
                  name="insuranceKind"
                  // label="Insurance"
                  value = {values.insuranceKind}
                  onBlur={handleBlur}
                  onChange={(e)=>{
                    handleChange(e)
                    //reset value
                    if (e.currentTarget.value !== 'Critical')
                    {
                      setFieldValue('productType', '')
                      setFieldValue('productKind', '')
                      setFieldValue('selectedBenefitAmount', '')
                      setFieldValue('benefitAmount', '')
                    }
                    if (e.currentTarget.value !== 'Disability')
                    {
                      setFieldValue('annualIncome', '')
                      setFieldValue('occupation', '')
                      setFieldValue('roleAtWork', '')
                    }
                    if (e.currentTarget.value !== 'Personal')
                    {
                      const insured = 1 - values.insuredPersons.length
                      if (insured <= 0)
                      { 
                        // remove insured information
                        for (var ii = 0; ii < (insured*-1); ii++) {
                          values.insuredPersons.pop()
                        }
                        setFieldValue('insuredNumber', '')
                      }
                    }else{
                      setFieldValue('familyIllnessHistory', '')
                      setFieldValue('ageIllness', '')
                      setFieldValue('nameIllness', '')
                    }
                  }}
                >
                  <option value="" hidden></option>
                  {kindInsurance.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.desc}
                    </option>
                  ))}
                </SelectTextField>
                {validMessage('insuranceKind') }
              </Grid> 

            {/* Product Selection */}
            {values.insuranceKind === 'Critical' && 
              <>
              {/* <Grid item xs={12} className={classes.subtitle} align="center">
                  <div>
                      <span className={classes.grayLine}></span>
                  </div>
                  Customize your insurance
              </Grid> */}
                {/* <Grid item xs={12}>
                <Text tid={'Quote.WhichProduct'}/>
                </Grid> */}
                <Grid item container justify="center">
                  <Grid item xs={12} lg={3}>
                    <SelectTextField
                      name="productType"
                      label={'Quote.ProductType'}
                      defaultValue = {values.productType}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    >
                      <option value="" hidden></option>
                      {typeProduct.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.desc}
                        </option>
                      ))}
                    </SelectTextField>
                    {validMessage('productType') }
                  </Grid>

                  {/* Payment Period Selection*/}
                  {/* <Grid item xs={12}>
                    <Text tid={'Quote.WhatKindProduct'}/>
                  </Grid> */}
                  <Grid item xs={12} lg={3}>
                    <SelectTextField
                      name="productKind"
                      label={'Quote.ProductKind'}
                      defaultValue = {values.productKind}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="" hidden></option>
                      {values.productType === 'Term' &&
                      kindTerm.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.desc}
                      </option>
                        ))}
                      {values.productType === 'Permanent' &&
                      kindPermanent.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.desc}
                      </option>
                      ))}
                    </SelectTextField>
                    {validMessage('productKind') }

                  </Grid>

                  {/* Benefit Amount Selection */}
                  {/* <Grid item xs={12}>
                    <Text tid={'Quote.ChooseBenefit'}/>
                  </Grid> */}
                  <Grid item xs={12} lg={3}>
                    <SelectTextField
                      name="selectedBenefitAmount"
                      label={'Quote.ProductBenefit'}
                      value = {values.selectedBenefitAmount}
                      // onChange={handleChange}
                      onChange={(e) => {
                        setFieldValue('selectedBenefitAmount', e.currentTarget.value)
                        setFieldValue('benefitAmount', e.currentTarget.value)
                        SetMinBenefitAmount(Math.min.apply(null, (amtBenefit.map(function(item) {
                              return item.value;})).filter(Boolean)))
                        
                        if (e.currentTarget.value==='0'){
                          setIsReadOnly(false)
                          setFieldValue('benefitAmount', '')
                        }else{
                          setIsReadOnly(true)
                        }

                        }
                      }
                      onBlur={handleBlur}
                    >
                    <option value="" hidden></option>
                    {amtBenefit.map((item) => (
                      <option key={item.name} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                    </SelectTextField>
                    {validMessage('selectedBenefitAmount') }

                    {values.selectedBenefitAmount==='0'&&
                      <RegularTextField
                        name="benefitAmount"
                        value={values.benefitAmount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        InputProps={{
                          inputComponent: CustomNumberFormat,
                          readOnly: isReadOnly
                        }}
                      />
                    }
                    {values.selectedBenefitAmount==='0'&&validMessage('benefitAmount')}
                    
                  </Grid>
                </Grid>
              </>
          
            }

              {values.insuranceKind === 'Personal' && 
              <>
                <Grid item container justify="center" style={{ marginBottom:'5vh' }}>
                  <Grid item container xs={12} sm={10} md={10} lg={8} spacing={2} justify="center">
                    <Typography variant="h5" gutterBottom className={classes.title_question}>
                            <Text tid={'Quote.Health.GHIP'}/>
                    </Typography>
                    <Alert severity="info">
                        <AlertTitle><Text tid={'Quote.Health.GHIP.AlertTitle'}/></AlertTitle>
                        <Text tid={'Quote.Health.GHIP.AlertDescription'}/>
                    </Alert>

                    <Grid item xs={12} sm={12} md={8} lg={6} xl={5} style={{ marginBottom:'5vh' }}>
                      <ToggleButtonGroup
                          value={values.ghip}
                          name="ghip"
                          exclusive
                          onChange={(e) => {
                              const val = e.currentTarget.value === 'true' ? true : false
                              values.ghip = val
                              setFieldValue('ghip', val)
                          }}
                          style={{ width:'100%', marginTop:'30px' }}
                      >
                          <ToggleButton value={true} className={classes.toggleButton}>
                              <Text tid={'Button.Yes'}/>
                          </ToggleButton>
                          <ToggleButton value={false} className={classes.toggleButton}>
                              <Text tid={'Button.No'}/>
                          </ToggleButton>
                      </ToggleButtonGroup>
                      {/* {validMessage(`insuredPersons.${index}.mentalIllness`)} */}
                    </Grid>

                    {values.ghip === false 
                      ?
                        <Alert severity="warning">
                            <AlertTitle><Text tid={'Quote.Health.GHIP.AlertTitle2'}/></AlertTitle>
                            <Text tid={'Quote.Health.GHIP.AlertDescription2'}/>
                            <Grid container justify="center">
                              <Button
                                style={{ marginTop:'2vh', width:'fit-content'}}
                                color="dark" 
                                className={classes.next_button}
                                onClick={() => {
                                  window.open(`/travel-insurance/quote/trip-info`, "_blank");
                                }}
                              >
                                <Text tid={'Button.GoToTravelInsurance'}/>
                              </Button>
                            </Grid>
                        </Alert>
                      :null
                    }
                  </Grid>
                  
                </Grid>
              </>
          
            }

            </Grid>

            <Grid item container style={{ margin: '10vh 0 10vh 0' }} justify="center" spacing={1}>
              <Grid item xs={12} sm={6} lg={3}>
                {/* <div className={classes.textEnd}> */}
                  <Button
                    type='submit'
                    // variant='contained'
                    color="dark" 
                    disabled = {values.ghip === false ? true : false}
                    className={classes.next_button}
                  >
                    <Text tid={'Button.Next'}/>
                  </Button>
                {/* </div> */}
              </Grid>

            </Grid>
          </Grid>
            
          </Form>
        )}
      </Formik>

    </>
  );
};


// ProtoTypes
ProductForm.propTypes = {
  healthFormData: PropTypes.object.isRequired,
};

export default ProductForm;
