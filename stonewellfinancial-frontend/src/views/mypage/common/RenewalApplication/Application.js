import React, { useState, useEffect } from 'react'
// Redux
import { useSelector, useDispatch } from 'react-redux';
import { getCountry } from '../../../../redux/actions/countries'
import { getProvince } from '../../../../redux/actions/countries';
import { getVendorAccount } from '../../../../redux/actions/vendorAccountAction';
import { getInsuranceByType } from '../../../../redux/actions/insurancePlans'
import { getMedicalQuestion } from '../../../../redux/actions/medicalQuestions'
//components
import { StepHeader } from '../Application/StepHeader'
import RepurchaseApplicants from './RenewApplicants';
import TravelInformation from '../Application/TravelInformation'
import ProductSelection from '../Application/ProductSelection'
import CarewellSelection from '../Application/CarewellSelection'
import ApplicationSummary from  '../Application/ApplicationSummary'
import SubmitResult from  '../Application/SubmitResult'
// Initial Data

export const Application = (props) => {

  const { insuraceType, data, originData, userRole, handleClose } = props;
  
  // run useEffect only once when first render
  const [isLoaded, setIsLoaded] = useState(false)

  const [step, setStep] = useState(1)
  // initail data
  const [renewFormData, setRenewFormData] = useState(data);
  const [formData, setFormData] = useState([]);
  
  // submit
  const [submitted, setSubmitted] = useState(false);

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  const dispatch = useDispatch();
  const countries = useSelector(state => state.countryReducer.countries)
  const provinces = useSelector(state => state.countryReducer.provinces)
  const vendors = useSelector(state => state.vendorAccountReducer.vendors)
  const vendorLoading = useSelector(state => state.vendorAccountReducer.loading)
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
      if (data.userRole==='ADM'){
        dispatch(getVendorAccount())
      }
      // dispatch(getInsuranceByType(formData.insuredType))
      dispatch(getInsuranceByType(insuraceType))
      dispatch(getMedicalQuestion())
    }
  }, [dispatch, isLoaded, insuraceType, data.userRole]);


  const vendorList = vendors && vendors.length> 0
                      ? vendors.filter(f=>f.is_active)
                                // .sort((a,b)=> a.vendor_name - b.vendor_name)
                                .map(v=>{return {vendor_id: v.vendor_id, vendor_name: v.vendor_name}})
                      : [];

  if (submitted === false) {
      switch (step) {
        case 1:
          return (
            <RepurchaseApplicants
                renewFormData={renewFormData}
                setRenewFormData={setRenewFormData}
                setFormData={setFormData}
                originData={originData}
                userRole={userRole}
                nextStep={nextStep}
                handleClose={handleClose}
                // prevStep={prevStep}
              />
          )
        case 2:
          return (
            <>
            <StepHeader activeStep={0} />
            {countries.length > 0 && !vendorLoading && 
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
        case 3:
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
        case 4:
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
        case 5:
          return (
            <>
            <StepHeader activeStep={3} />
            <ApplicationSummary
              formData={formData}
              setFormData={setFormData}
              prevStep={prevStep}
              countries={countries}
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
