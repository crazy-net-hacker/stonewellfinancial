import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import NumberFormat from 'react-number-format';
import { Grid, FormControl} from '@material-ui/core';
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import MetaTags from '../../../components/common/MetaTags';
import Button from '../../../components/common/CustomButtons/Button'
//components
import { RegularTextField, SelectTextField } from '../../../components/common/CustomTextFields/TextField'
import { Text } from '../../../components/common/LanguageProvider';
import * as Validation from '../../Validation';
//
import { QuoteBanner2 } from '../../../components/common/QuoteBanner2';
import StepHeader from './StepHeader';
import {pathDirection} from './Progress';
//style
import formStyle from '../../../assets/jss/styles/formStyle';

//Style
const useStyles = makeStyles(formStyle)

// 
const typeProduct = [
    {code: 'Term', desc: 'Term Insurance'},
    {code: 'Whole', desc: 'Whole Life'},
    {code: 'Universal', desc: 'Universal Life'}
  ]

const kindTerm = [
    {code: 'Term10', desc: 'Term 10'},
    {code: 'Term15', desc: 'Term 15'},
    {code: 'Term20', desc: 'Term 20'},
    {code: 'Term25', desc: 'Term 25'},
    {code: 'Term30', desc: 'Term 30'},
    {code: 'Term100', desc: 'Term 100'},
    {code: 'Other', desc: 'Other'}
  ]  

const kindWhole = [
  {code: 'Life', desc: 'Life time payment'},
  {code: '10Years', desc: '10 year payment'},
  {code: '20Years', desc: '20 year payment'}
]  

const kindUniversal = [
  {code: 'Life', desc: 'Life time payment'},
  {code: '15Years', desc: '15 year payment'},
  {code: '20Years', desc: '20 year payment'}
]  

const amtBenefitTerm = [
  {name: '$100,000', value: 100000},
  {name: '$250,000', value: 250000},
  {name: '$350,000', value: 350000},
  {name: '$500,000', value: 500000},
  {name: '$750,000', value: 750000},
  {name: '$1,000,000', value: 1000000},
  {name: 'Other', value: 0}
  ] 

const amtBenefitWhole = [
  {name: '$25,000', value: 25000},
  {name: '$50,000', value: 50000},
  {name: '$100,000', value: 100000},
  {name: '$200,000', value: 200000},
  {name: '$500,000', value: 500000},
  {name: 'Other', value: 0}
  ] 
  
const amtBenefitUniversal = [
  {name: '$50,000', value: 50000},
  {name: '$100,000', value: 100000},
  {name: '$200,000', value: 200000},
  {name: '$300,000', value: 300000},
  {name: '$500,000', value: 500000},
  {name: '$750,000', value: 750000},
  {name: '$1,000,000', value: 1000000},
  {name: 'Other', value: 0}
  ]   

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const ProductForm = (props) => {
  const { match, lifeFormData } = props;    

  const metaData = {
    title: 'Meta.LifeInsurace.Quote.Title',
    description: 'Meta.LifeInsurace.Quote.Description',
    canonical: match.url
  }

  const classes = useStyles();
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [minBenefitAmont, SetMinBenefitAmount] = useState(0);


  // validation
  const validationSchema = Yup.object({
    productType: Validation.validRequiredField(),
    productKind: Validation.validRequiredField(),
    selectedBenefitAmount: Validation.validRequiredField(),
    benefitAmount: Yup.number()
                  .required('Enter the benefit amount you want.')
                  .min([minBenefitAmont], `Enter over amount ${[minBenefitAmont]}`)
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

    values.productTypeDesc = typeProduct.filter(p => p.code === values.productType)[0].desc

    if (values.productType === 'Term'){
        values.productKindDesc = kindTerm.filter(p => p.code === values.productKind)[0].desc
    } else if (values.productType === 'Whole'){
        values.productKindDesc = kindWhole.filter(p => p.code === values.productKind)[0].desc
    } else if (values.productType === 'Universal'){
        values.productKindDesc = kindUniversal.filter(p => p.code === values.productKind)[0].desc
    }

    props.updateLifeFormData(values);
    props.history.push(pathDirection(props.location.pathname, values).nextStep);
}

let height = '0px'

  return (
    <>
      <MetaTags data={metaData} />
      <QuoteBanner2 title={'Quote.LifeIns.Title'} subTitle={'Quote.LifeIns.SubTitle'} links={[]} />
      <StepHeader height={height} activeStep={1}/>

      <Typography variant="h5" gutterBottom className={classes.title_question}>
        <Text tid={'Quote.WhichInsuranceGetAQuote'}/>
      </Typography>
      {/* <Grid item xs={12} className={classes.inputPaddingSubtitle}>
        <Text tid={'Quote.WhichInsurance'}/>
      </Grid> */}

      <Formik
        initialValues={lifeFormData}
        validationSchema={validationSchema}
        onSubmit={values => {
          handleSubmit(values)
            // values.productTypeDesc = typeProduct.filter(p => p.code === values.productType)[0].desc
            // setFormData(values);
            // nextStep();
        }}
      >
        {({ values, handleChange, handleBlur, setFieldValue }) => (
          <Form className={classes.formWrapper}>
            <Grid container justify="center">

{/* Insurance Selection */}
              <Grid item container xs={12} sm={10} md={8}>
                <Grid  item xs={12} lg={4} className={classes.inputPadding}>
                  <FormControl variant="outlined" className={classes.formControl}>                  
                    <SelectTextField
                      name= "productType"
                      label= {'Quote.ProductType'}
                      value = {values.productType}
                      onBlur = {handleBlur}
                      onChange={handleChange}
                    >
                      <option value="" hidden></option>
                      {typeProduct.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.desc}
                        </option>
                      ))}
                    </SelectTextField>
                  </FormControl>
                  {validMessage('productType')}
                </Grid> 

{/* Product Selection */}
                  <Grid  item xs={12} lg={4} className={classes.inputPadding}>
                    <FormControl variant="outlined" className={classes.formControl}>                  
                      <SelectTextField
                        label= {'Quote.ProductKind'}
                        name="productKind"
                        value = {values.productKind}
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
                          {values.productType === 'Whole' &&
                            kindWhole.map((item) => (
                            <option key={item.code} value={item.code}>
                              {item.desc}
                            </option>
                          ))}
                          {values.productType === 'Universal' &&
                            kindUniversal.map((item) => (
                            <option key={item.code} value={item.code}>
                              {item.desc}
                            </option>
                          ))}
                      </SelectTextField>
                    </FormControl>
                    {validMessage('productKind')}
                  </Grid> 

{/* Benefit Amount Selection */}
                  <Grid  item xs={12} lg={4} className={classes.inputPadding}>
                    <FormControl variant="outlined" className={classes.formControl}>                  
                      <SelectTextField
                        label={'Quote.ProductBenefit'}
                        name="selectedBenefitAmount"
                        value = {values.selectedBenefitAmount}
                        onChange={(e) => {
                          setFieldValue('selectedBenefitAmount', e.currentTarget.value)
                          setFieldValue('benefitAmount', e.currentTarget.value)
                          switch(values.productType) {
                            case 'Term':
                              SetMinBenefitAmount(Math.min.apply(null, (amtBenefitTerm.map(function(item) {
                                                        return item.value;})).filter(Boolean)))
                              break;
                            case 'Whole':
                              SetMinBenefitAmount(Math.min.apply(null, (amtBenefitWhole.map(function(item) {
                                                        return item.value;})).filter(Boolean)))
                              break;
                            case 'Universal':
                              SetMinBenefitAmount(Math.min.apply(null, (amtBenefitUniversal.map(function(item) {
                                                        return item.value;})).filter(Boolean)))
                              break;
                            default:
                              break;
                          }
                          
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
                        {values.productType === 'Term' &&
                          amtBenefitTerm.map((item) => (
                          <option key={item.name} value={item.value}>
                            {item.name}
                          </option>
                        ))}
                        {values.productType === 'Whole' &&
                          amtBenefitWhole.map((item) => (
                            <option key={item.name} value={item.value}>
                              {item.name}
                            </option>
                        ))}
                        {values.productType === 'Universal' &&
                          amtBenefitUniversal.map((item) => (
                            <option key={item.name} value={item.value}>
                              {item.name}
                            </option>
                        ))}
                      </SelectTextField>
                      {validMessage('selectedBenefitAmount')}
                    </FormControl>
                    {values.selectedBenefitAmount==='0'&&
                        <RegularTextField
                          name="benefitAmount"
                          value={values.benefitAmount}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          InputProps={{
                            inputComponent: NumberFormatCustom,
                            readOnly: isReadOnly
                          }}
                        />
                        // {validMessage('benefitAmount')}
                      }
                      {values.selectedBenefitAmount==='0'&&validMessage('benefitAmount')}
                  </Grid> 
                </Grid>
            </Grid>

            <Grid item container style={{ margin: '10vh 0 10vh 0' }} justify="center" spacing={1}>
              <Grid item xs={6} lg={3}>
              {/* <div className={classes.textEnd}> */}
                <Button
                  type='submit'
                  color="dark" 
                  className={classes.next_button}
                >
                  <Text tid={'Button.Next'}/>
                </Button>
              {/* </div> */}
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
  lifeFormData: PropTypes.object.isRequired,
};

export default ProductForm;