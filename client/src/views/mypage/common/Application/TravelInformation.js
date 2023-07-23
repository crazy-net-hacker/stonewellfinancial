import React, { useEffect, useState, useCallback } from 'react'
import { PropTypes } from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { getInsuredPersonByVendor } from '../../../../redux/actions/insuredPersonAction'
// form and validation
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import * as Validation from '../../../Validation'
// core components
import { Grid, makeStyles } from '@material-ui/core'
// Common components
import Button from '../../../../components/common/CustomButtons/Button'
import { Text } from '../../../../components/common/LanguageProvider'
// import { RegularTextFieldSmall, SelectMenuTextFieldSmall } from '../../../../components/common/CustomTextFields/TextFieldSmall'
import { RegularTextFieldSmall } from '../../../../components/common/CustomTextFields/TextFieldSmall'
import { Autocomplete } from '@material-ui/lab'
//Reusable components
import ApplicantInformation from './ApplicantInformation'
import ContactInformation from './ContactInformation'
import Agreement from './Agreement'
// controllers 
import OptimizedPlan from '../../../../controllers/TravelQuote/Optimizedplan'
import AddOnPlan from '../../../../controllers/TravelQuote/AddOnPlan'
// style
import vendorFormStyle from '../../../../assets/jss/styles/vendorFormStyle'
import SpecialNote from './SpecialNote'

const current = new Date()

// valication Schema
const validationSchema = Yup.object(
  {
      vendorID: Validation.validRequiredField().nullable(),
      // tripStartDate: Validation.validRequiredDateField().nullable()
      //     .min(new Date(current.setDate(current.getDate() - 1)), 'StartDateShouldBeGreaterThanToday'),
      tripStartDate: Yup.date().nullable().when("currentStatus",
      { is: (value) => value !== 'Modifying',
              then: Validation.validRequiredDateField().nullable()
                              .min(new Date(current.setDate(current.getDate() - 1)), 'StartDateShouldBeGreaterThanToday'),
              otherwise: Validation.validRequiredDateField().nullable()
      }),
      tripEndDate: Validation.validRequiredDateField().nullable()
                              .min(Yup.ref("tripStartDate"), "EndDateShouldBeGreaterThanStartDate"),
      tripPeriod: Validation.validRequiredNumberMin1Field().max(365, 'MaximunDaysShouldBe365'),
      tripArrivalDate: Yup.date().when("insuredType", 
      { is: (value) => 
              value !== 'STUDENT',
              then: Validation.validRequiredDateField(),
              otherwise: Yup.date().nullable()
      }),
      multiTripDays: Yup.number().when("tripType", 
      { is: (value) => 
              value === 'MULTI',
              then: Validation.validRequiredNumberMin1Field().nullable()
                  .max(125, "Multi Trip days must be less than 125")
      }),
      originCountry: Validation.validRequiredField(),
      originProvince: Yup.string().when("insuredType", 
      { is: (value) => 
              value === 'CANADIAN',
              then: Validation.validRequiredField()
      }),
      // destCountry: Validation.validRequiredField(),
      destCountry: Yup.string().when("insuredType",
      { is: (value) => 
              value === 'CANADIAN',
              then: Validation.validRequiredField()
      }),
      destProvince: Yup.string().when("insuredType",
      { is: (value) => 
              value !== 'CANADIAN',
              then: Validation.validRequiredField()
      }),
      // destProvince: Yup.string().when("insuredType", 
      // { is: (value) => 
      //         value === 'CANADIAN',
      //         then: Yup.string().when("destCountry", 
      //                 { is: (value) => 
      //                         value === 'US',
      //                         then: Validation.validRequiredField()
      //                 }),
      // }),
      eligilbeAgrement : Validation.validRequiredField().nullable(),
      contactPhone: Validation.validPhoneNumber(),
      contactEmail: Validation.validEmail(),
      maillingInCanada: Validation.validRequiredField(),
      mailStreetName:  Validation.validRequiredField(),
      mailCity:  Validation.validRequiredField(),
      mailPostalCode:  Validation.validPostalCode(),
      mailProvince:  Validation.validRequiredField().nullable(),
      mailCountry:  Validation.validRequiredField(),
      insuredPersons: Yup.array().of(
          Yup.object().shape({
              lastName: Validation.validRequiredField(),
              firstName: Validation.validRequiredField(),
              gender: Validation.validRequiredField().nullable(),
              birthDate: Validation.validRequiredBrithDateField(),
              relationship: Validation.validRequiredField(),
              beneficiaryName: Validation.validRequiredField(),
              beneficiaryRelationship: Validation.validRequiredField(),
              // tripStartDate: Validation.validRequiredDateField().nullable()
              //                           .min(new Date(current.setDate(current.getDate() - 1)), 'StartDateShouldBeGreaterThanToday'),
              tripStartDate: Yup.date().nullable().when("currentStatus",
              { is: (value) => value !== 'Modifying',
                      then: Validation.validRequiredDateField().nullable()
                                        .min(new Date(current.setDate(current.getDate() - 1)), 'StartDateShouldBeGreaterThanToday'),
                      otherwise: Validation.validRequiredDateField().nullable()
              }),                  
              tripEndDate: Yup.date().nullable().when("travelType",
                { is: (value) => 
                        value === 'PW',
                        then: Validation.validRequiredDateField().nullable()
                              .min(Yup.ref("tripStartDate"), "EndDateShouldBeGreaterThanStartDate")
                              .max(Yup.ref("yearDateAfterGraduated"), "EndDateShouldBeWinthin1yearOfGraduation"),
                        otherwise: Validation.validRequiredDateField().nullable()
                              .min(Yup.ref("tripStartDate"), "EndDateShouldBeGreaterThanStartDate"),
                }),
              tripPeriod: Yup.number().nullable().when("travelType", 
                { is: (value) => 
                        value !== 'SV',
                        then: Validation.validRequiredNumberMin1Field().max(365, 'MaximunDaysShouldBe365'),
                        otherwise: Validation.validRequiredNumberField().min(365, 'SVTripDayShouldBe365'),
                }),
              // areEligible: Validation.validRequiredField(),
              travelType:  Validation.validRequiredField(),
              graduatedDate: Yup.date().nullable().when("travelType",
                { is: (value) => 
                        value === 'PW',
                        then: Validation.validRequiredDateField().nullable()
                                .max(new Date(new Date().setDate(new Date().getDate() +1)), 'Graduated date must be less than today')
                                .min(new Date(new Date().setDate(new Date().getDate() - (365 + 1))), 'Graduatedart date must be grater than before 1 year'),
                }),
              physicalCard: Validation.validRequiredField().nullable(),
              deliverDateInsuranceCard: Yup.date().when("physicalCard", 
              { is: (value) => 
                      value === 'true',
                      then: Validation.validRequiredDateField().min(Yup.ref("tripStartDate"), "DeliveryDateShouldBeGreaterThanStartDate"),
                      otherwise: Yup.date().nullable()
              }),
          })
      ),
      
  }
)

// ValidMessage
function validMessage(fieldName) {
  return (
    <ErrorMessage
      name={fieldName}
      render={(msg) => (
        <div style={{ color: 'red', marginLeft: '1vh', fontSize: 12 }}> 
          <Text tid={`Validation.${msg}`}></Text>
        </div>
      )}
    />
  )
}

const useStyles = makeStyles(vendorFormStyle)
const TravelInformation = (
  { formData, setFormData, prevStep, nextStep, countries, provinces, insurances, 
    insurancesLoading,
    vendors}
  ) => {
  const classes = useStyles()

  const dispatch = useDispatch()
  const insured = useSelector(state => state.insuredPersonReducer.insured)
  const insuredLoading = useSelector(state => state.insuredPersonReducer.loading)

  // run useEffect only once when first render
  const [isLoaded, setIsLoaded] = useState(false)

  const [direction, setDirection] = useState('back')
  const [selectedVendor, setSelectedVendor] = useState(formData.vendorID)
  const [errorSection, setErrorSection] = useState('')
  const [errorIndex, setErrorIndex] = useState()
  const [alertOpen, setAlertOpen] = useState(false)

  // get Insured Person list
  const getInsuredPersons = useCallback(() => {
    if (selectedVendor){
      dispatch(getInsuredPersonByVendor(selectedVendor))
    }
  }, [dispatch, selectedVendor]);
  
  // useEffect
  useEffect(()=>{
    return () => {
      if(isLoaded === false){
        getInsuredPersons()
        setIsLoaded(true)
      }
    }
  }, [getInsuredPersons, isLoaded]);


  // handleSubmit
  const handleSubmit = async (values) => {
    
    if (values.eligilbeAgrement === true){

      window.scrollTo(0, 0)
  
      OptimizedPlan({ data: values, insurances: insurances.filter(ins => ins.coverage_type === 'MED'),})
      AddOnPlan({ data: values, insurances: insurances.filter(ins => ins.coverage_type !== 'MED' ) })
      
      setFormData(values)
      nextStep()
    } 

  }


  return (
    <>
      <Formik
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          direction === 'back' ? prevStep() : handleSubmit(values)
        }}
      >
        {({ values, handleChange, handleBlur, setFieldValue, errors }) => ( 
          <Form>
            {/* {console.log('errors', errors)} */}
            <Grid container>
                <Grid item xs={6} >
                  {values.userRole === 'ADM'&& vendors && vendors.length>0 && !values.insuredPersons[0].selectedWhenSave &&
                    <Autocomplete
                        name={`vendorID`}
                        options={vendors}
                        value={values.vendorID ? vendors.find(c => c.vendor_id === values.vendorID) : null}
                        getOptionLabel={(option) => option.vendor_name}
                        size="small"
                        renderInput={(params) =>
                            <RegularTextFieldSmall {...params}
                              label={"TravelApplication.Vendor"} />
                        }
                        onChange={(e, selectedVal) => {
                            setFieldValue('vendorID', selectedVal ? selectedVal.vendor_id : '')  
                        }}
                        onBlur={()=>{setSelectedVendor(values.vendorID)}}
                    />
                  }
                  {validMessage('vendorID') }
                </Grid>
            </Grid>

            <ApplicantInformation
              values={values}
              handleChange={handleChange}
              handleBlur ={handleBlur}
              setFieldValue={setFieldValue}
              validMessage={validMessage}     
              countries={countries}
              provinces={provinces}
              insured={insuredLoading?[]:insured}
              errorSection={errorSection}
              errorIndex={errorIndex}
              alertOpen={alertOpen}
            />

            <ContactInformation
              values={values}
              handleChange={handleChange}
              handleBlur ={handleBlur}
              setFieldValue={setFieldValue}
              validMessage={validMessage}
              provinces={provinces}
              errorSection={errorSection}
              alertOpen={alertOpen}
            />

            <SpecialNote
              values={values}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
              validMessage={validMessage}
            />
            
            <Agreement
              values={values}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
              validMessage={validMessage}
            />

            {/* Continue  Button */}
            <Grid container style={{ margin: '5vh 0 5vh 0' }} spacing={1} className={classes.textEnd} >
                {insurancesLoading&&
                  <Grid container item xs={12} style={{justifyContent:'flex-end'}}>
                    Optimizing insurances. Wait for a few seconds.
                  </Grid>
                }
                {values.renewal === true &&
                  <Grid item xs={6} sm={6} md={3} lg={3}>
                    <Button 
                        // type="submit" 
                        color="secondary" 
                        className={classes.back_button} 
                        onClick={() => { 
                          setFormData(values)
                          setDirection('back')
                          prevStep()
                        }}
                    >
                        <Text tid={'Button.Previous'}/>
                    </Button>
                  </Grid>
                }

              <Grid item xs={6} sm={6} md={3} lg={3}>
                <Button 
                    type='submit' 
                    disabled = {values.eligilbeAgrement===true&&!insurancesLoading?false:true}
                    // disabled = {values.eligilbeAgrement===true?false:true}
                    color="dark" 
                    className={classes.next_button} 
                    onClick={() => {
                      setErrorIndex()
                      setErrorSection('')
                      setAlertOpen(false)
                      
                      errors&&!!errors.insuredPersons&&
                          errors.insuredPersons.every((err, i) => {
                              if (err){
                                    setErrorIndex(i); 
                                    setErrorSection('P')
                                    setAlertOpen(true)
                                    setTimeout(() => {
                                      setErrorIndex()
                                      setErrorSection()
                                      setAlertOpen(false)
                                    }, 5000);
                                          return false}       
                              return true;
                          })

                      if (!errorSection && errors && !errors.insuredPersons){  
                          setErrorSection('C')
                          setAlertOpen(true)
                          setTimeout(() => {
                            setErrorSection()
                            setAlertOpen(false)
                          }, 5000);
                      }
                      
                      setDirection('forward')
                    }}
                >
                    <Text tid={'Button.Next'} />
                </Button>
              </Grid>
              
            </Grid>

          </Form>
            
        )}
      </Formik>
    </>
    
  )
}

// ProtoTypes
TravelInformation.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
}
export default TravelInformation
