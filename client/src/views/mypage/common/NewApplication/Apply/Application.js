import React, { useState, useEffect } from 'react'
// Redux
import { useSelector, useDispatch } from 'react-redux';
import { getCountry } from '../../../../../redux/actions/countries'
import { getProvince } from '../../../../../redux/actions/countries';
import { getInsuranceByType } from '../../../../../redux/actions/insurancePlans'
import { getVendorAccount } from '../../../../../redux/actions/vendorAccountAction';
import { getMedicalQuestion } from '../../../../../redux/actions/medicalQuestions'


//components
// import { Text } from '../../../../../components/common/LanguageProvider'
import { StepHeader } from '../../../common/Application/StepHeader'
import TravelInformation from '../../../common/Application/TravelInformation'
import ProductSelection from '../../../common/Application/ProductSelection'
import CarewellSelection from '../../../common/Application/CarewellSelection'
import ApplicationSummary from  '../../../common/Application/ApplicationSummary'
import SubmitResult from  '../../../common/Application/SubmitResult'

// Initial Data
import { travelQuoteInit } from '../../../../layouts/InitFormData'

export const Application = (props) => {

  const { insuraceType, userID, userRole, vendorID, vendorAddress, savedData } = props;

  // run useEffect only once when first render
  const [isLoaded, setIsLoaded] = useState(false)

  const [step, setStep] = useState(1)
  // initail data
  const [formData, setFormData] = useState(savedData.application?savedData:travelQuoteInit());
  // submit
  const [submitted, setSubmitted] = useState(false);

  if (!savedData.application){
    formData.insuredType = insuraceType.toUpperCase()
    formData.insuredNumber = 1
    formData.insuredPersons.map(i=>i.eligilbeIns = formData.insuredType)
    formData.sameMailAddress = false
    if (formData.insuredType === 'CANADIAN')
    {
        formData.originCountry = 'CA' ;
        formData.originCountryName = 'Canada'  
        formData.tripDirection = 'OutBound'   
    }else{
        formData.destCountry = 'CA'
        formData.destCountryName = 'Canada'
        formData.tripDirection = 'InBound'
    }

    formData.vendorAddress = {
      street: vendorAddress && vendorAddress.length > 0 ? vendorAddress[0].street:'',
      suiteNo: vendorAddress && vendorAddress.length > 0 ? vendorAddress[0].suite_no:'',
      city: vendorAddress && vendorAddress.length > 0 ? vendorAddress[0].city:'',
      province:vendorAddress && vendorAddress.length > 0 ? vendorAddress[0].province:'',
      postalCode: vendorAddress && vendorAddress.length > 0 ? vendorAddress[0].postalcode:'',
    }  
    
    // formData.insuredPersons[0].physicalCard = true
    formData.sourceFrom = 'V'
  }

  formData.userID = userID
  formData.userRole =  userRole
  if (userRole === 'VEN'){
    formData.vendorID = vendorID
  }

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  const dispatch = useDispatch();
  const countries = useSelector(state => state.countryReducer.countries)
  const provinces = useSelector(state => state.countryReducer.provinces)
  const vendors = useSelector(state => state.vendorAccountReducer.vendors)
  const insurances = useSelector(state => state.insurancePlanReducer.insurances)
  const insurancesLoading = useSelector(state => state.insurancePlanReducer.loading)
   // Medical Question & Answer
  const questions = useSelector(state => state.medicalQuestionReducer.questions)
  
   // useEffect
  useEffect(()=>{
    if(isLoaded === false){
      setIsLoaded(true)
      dispatch(getCountry())
      dispatch(getProvince())
      dispatch(getInsuranceByType(formData.insuredType))
      dispatch(getMedicalQuestion())
      if (formData.userRole==='ADM'){
        dispatch(getVendorAccount())
      }
    }
  }, [dispatch, isLoaded, formData.insuredType,formData.userRole]);


const vendorList = vendors && vendors.length> 0
                    ? vendors.filter(f=>f.is_active)
                              // .sort((a,b)=> a.vendor_name - b.vendor_name)
                              .map(v=>{return {vendor_id: v.vendor_id, vendor_name: v.vendor_name}})
                    : [];

// console.log('vendorList',vendorList.sort((a,b)=> a.vendor_name - b.vendor_name))

if (submitted === false) {
    switch (step) {
      case 1:
        return (
          <>
          <StepHeader activeStep={0} />
          {countries.length > 0 &&
            <TravelInformation
              formData={formData}
              setFormData={setFormData}
              nextStep={nextStep}
              prevStep={prevStep}
              countries={countries}
              provinces={provinces}
              insurances={insurances}
              insurancesLoading={insurancesLoading}
              vendors={vendorList}
            />
          }
          </>
        )
      case 2:
        return (
          <>
          <StepHeader activeStep={1} />
          <ProductSelection
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
            questions={questions}
          />
          </>
        )
      case 3:
        return (
          <>
          <StepHeader activeStep={2} />
          <CarewellSelection
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
          </>
        )
      case 4:
        return (
          <>
          <StepHeader activeStep={3} />
          <ApplicationSummary
            formData={formData}
            setFormData={setFormData}
            prevStep={prevStep}
            // countries={countries}
            setSubmitted={setSubmitted}
          />
          </>
        )
      default:
        return null
    }

  } else {
    return( 
      <SubmitResult
          formData={formData}
      /> 
      )

  }
}
