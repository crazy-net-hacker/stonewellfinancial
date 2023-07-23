import React, {useState, useEffect} from 'react'
import { Switch, Route, Redirect, useLocation } from 'react-router-dom'

// get data
// redux
import { useSelector, useDispatch } from 'react-redux';
import { getCountry } from '../../../redux/actions/countries';
import { getProvince } from '../../../redux/actions/countries';
import { getInsurance } from '../../../redux/actions/travelQuotes';

// routes
import Home from '../../pages/Home'

// Quote Form initial data
import { travelQuoteInit, 
  lifeQuoteInit, 
  healthQuoteInit,
  groupQuoteInit
} from '../InitFormData';

import TravelInsurance from '../../pages/TravelInsurance'
import TravelInbound from '../../pages/TravelInbound'
import TravelOutbound from '../../pages/TravelOutbound'
// import TravelQuote from '../../pages/TravelQuote'
// import TravelQuote_v3 from '../../pages/TravelQuote_v3'
// import TravelQuote_v2 from '../../pages/TravelQuote_v2'
// import TravelQuote_v1 from '../../pages/TravelQuote_v1'
// import TravelQuote_v0 from '../../pages/TravelQuote_v0'

// travel quote
// import { travelQuoteInit } from '../InitFormData';
import TripInformationForm from '../../pages/TravelQuote/TripInformationForm'
import PersonalInfoForm from '../../pages/TravelQuote/PersonalInfoForm'
import TripPurposeForm from '../../pages/TravelQuote/TripPurposeForm.js'
import TripPeriodForm from '../../pages/TravelQuote/TripPeriodForm'
import Companion from '../../pages/TravelQuote/Companion'
import PreExistMedCondition from '../../pages/TravelQuote/PreExistMedCondition'
import MaternityCoverQuestion from '../../pages/TravelQuote/MaternityCoverQuestion'
import MentalMedCondition from '../../pages/TravelQuote/MentalMedCondition'
import ProductForm from '../../pages/TravelQuote/ProductForm'
import DetailSummary from '../../pages/TravelQuote/DetailSummary'
import ContactInformation from '../../pages/TravelQuote/ContactInformation'
import PaymentForm from '../../pages/TravelQuote/PaymentForm'
import ReviewApplication from '../../pages/TravelQuote/ReviewApplication'
import SubmitResult from '../../pages/TravelQuote/SubmitResult'

import TravelStudent from '../../pages/TravelStudent'
import TravelVisitor from '../../pages/TravelVisitor'
import TravelCanadian from '../../pages/TravelCanadian'
import TravelApplicationForms from '../../pages/TravelApplicationForms'
import TravelApplication from '../../pages/TravelApplication'

import Payment from '../../pages/Payment'
import CreditCardForm from '../../pages/CreditCardForm'


import LifeInsurance from '../../pages/LifeInsurance'
// import LifeQuote from '../../pages/LifeQuote'
// Life quote
// import { lifeQuoteInit } from '../InitFormData';
import LifeProductForm from '../../pages/LifeQuote/ProductForm';
import LifeInformationForm from '../../pages/LifeQuote/InformationForm';
import LifeReview from '../../pages/LifeQuote/Review';
import LifeSubmitResult from '../../pages/LifeQuote/SubmitResult';

import HealthInsurance from '../../pages/HealthInsurance'
// import HealthQuote from '../../pages/HealthQuote'
import HealthProductForm from '../../pages/HealthQuote/ProductForm';
import HealthInformationForm from '../../pages/HealthQuote/InformationForm';
import HealthReview from '../../pages/HealthQuote/Review';
import HealthSubmitResult from '../../pages/HealthQuote/SubmitResult';

import GroupBenefits from '../../pages/GroupBenefits'
// import GroupQuote from '../../pages/GroupQuote'
import GroupProductForm from '../../pages/GroupQuote/ProductForm';
import GroupInformationForm from '../../pages/GroupQuote/InformationForm';
import GroupReview from '../../pages/GroupQuote/Review';
import GroupSubmitResult from '../../pages/GroupQuote/SubmitResult';

import HSA from '../../pages/HSA'
import ProcessApplication from '../../pages/ProcessApplication'
import ProcessClaim from '../../pages/ProcessClaim'
// import ClaimCase from '../../pages/ClaimCase'
import ProcessRefund from '../../pages/ProcessRefund'
import RefundRequest from '../../pages/RefundRequest'
import Download from '../../pages/Download'
import FAQ from '../../pages/FAQ'
import ClinicFinder from '../../pages/ClinicFinder'
import AboutUs from '../../pages/AboutUs'
import ContactUs from '../../pages/ContactUs'
import Partner from '../../pages/Partner'
import PartnerApplication from '../../pages/RegisterPartner';
import PrivacyPolicy from '../../pages/PrivacyPolicy'
// import Blog from '../../pages/Blog'
import Error from '../../../components/common/NotFoundPage'

// Ads Page
// import AdsTravelStudent from '../../ads/TravelInsurance/StudentPlan';

// import SignUp from '../../pages/SignUp/Loadable'
// import SignIn from '../../pages/SignIn/Loadable'
import SignIn from '../../pages/SignIn/index'
import ResetPassword from '../../pages/ResetPassword';


// Layout Components
import TopNavbar from '../../layouts/main/TopNavbar'
import Navmenu from '../../layouts/main/Navmenu'
import Footer from '../../layouts/main/Footer'
// ScrollToTop
import ScrollToTop from '../../layouts/ScrollToTop'
import ScrollArrow from '../../layouts/ScrollArrow'

export const PublicLayout = props => {
  const location = useLocation()
  const background = location.state && location.state.background

  const dispatch = useDispatch();
  const countries = useSelector(state => state.countryReducer.countries)
  const provinces = useSelector(state => state.countryReducer.provinces)
  const insurances = useSelector(state => state.travelQuoteReducer.insurances)

  // useEffect
  useEffect(()=>{
    dispatch(getCountry())
    dispatch(getProvince())
    dispatch(getInsurance())
}, [dispatch]);


  // travel quote initial data --  travelQuoteInit()
  const [formData, setFormData] = useState(travelQuoteInit());
  // update form data
  const updateFormData = (data) => {
    setFormData((prevFormData) => ({ ...prevFormData, ...data }));
  };


  // life quote initial data --  lifeQuoteInit()
  const [lifeFormData, setLifeFormData] = useState(lifeQuoteInit());
  // update life form data
  const updateLifeFormData = (data) => {
    setLifeFormData((prevFormData) => ({ ...prevFormData, ...data }));
  };

  // health quote initial data --  healthQuoteInit()
  const [healthFormData, setHealthFormData] = useState(healthQuoteInit());
  // update health form data
  const updateHealthFormData = (data) => {
    setHealthFormData((prevFormData) => ({ ...prevFormData, ...data }));
  };

  // group benefits quote initial data --  groupQuoteInit()
  const [groupFormData, setGroupFormData] = useState(groupQuoteInit());
  // update group form data
  const updateGroupFormData = (data) => {
    setGroupFormData((prevFormData) => ({ ...prevFormData, ...data }));
  };


  return (
    <>
      <ScrollToTop>
        <TopNavbar />
        <Navmenu />
        <Switch location={background || location}>
          
          <Route path="/" exact component={Home} />
          <Route path="/travel-insurance" exact component={TravelInsurance} />
          {/* <Route path="/travel-insurance/quote" exact component={TravelQuote} /> */}

          {/* Travel */}
          <Route 
            path="/travel-insurance/quote/trip-info" 
            exact 
            render={(props) => (
              <TripInformationForm {...props} formData={formData} updateFormData={updateFormData} countries={countries} provinces={provinces} />
            )}
          />
          <Route 
            path="/travel-insurance/quote/personal-info" 
            exact 
            render={(props) => (
              !!formData.tripDirection
                ? <PersonalInfoForm {...props} formData={formData} updateFormData={updateFormData} />
                : <Redirect to="/travel-insurance/quote/trip-info" />
            )}
          />
          <Route 
            path="/travel-insurance/quote/trip-purpose" 
            exact 
            render={(props) => (
              !!formData.tripDirection
                ? <TripPurposeForm {...props} formData={formData} updateFormData={updateFormData} insurances={insurances} />
                : <Redirect to="/travel-insurance/quote/trip-info" />
            )}
          />
          <Route 
            path="/travel-insurance/quote/trip-period" 
            exact 
            render={(props) => (
              !!formData.tripDirection
                ? <TripPeriodForm {...props} formData={formData} updateFormData={updateFormData} />
                : <Redirect to="/travel-insurance/quote/trip-info" />
            )}
          />
          <Route 
            path="/travel-insurance/quote/family-info" 
            exact 
            render={(props) => (
              !!formData.tripDirection
                ? <Companion {...props} formData={formData} updateFormData={updateFormData} insurances={insurances} />
                : <Redirect to="/travel-insurance/quote/trip-info" />
            )}
          />
          <Route 
            path="/travel-insurance/quote/pre-existing-condition" 
            exact 
            render={(props) => (
              !!formData.tripDirection
                ? <PreExistMedCondition {...props} formData={formData} updateFormData={updateFormData} />
                : <Redirect to="/travel-insurance/quote/trip-info" />
            )}
          />
          <Route 
            path="/travel-insurance/quote/maternity-coverage" 
            exact 
            render={(props) => (
              !!formData.tripDirection
                ? <MaternityCoverQuestion {...props} formData={formData} updateFormData={updateFormData} />
                : <Redirect to="/travel-insurance/quote/trip-info" />
            )}
          />
          <Route 
            path="/travel-insurance/quote/mentality-coverage" 
            exact 
            render={(props) => (
              !!formData.tripDirection
                ? <MentalMedCondition {...props} formData={formData} updateFormData={updateFormData} />
                : <Redirect to="/travel-insurance/quote/trip-info" />
            )}
          />          
          <Route 
            path="/travel-insurance/quote/product-selection" 
            exact 
            render={(props) => (
              !!formData.tripDirection
                ? <ProductForm {...props} formData={formData} updateFormData={updateFormData} />
                : <Redirect to="/travel-insurance/quote/trip-info" />
            )}
          />
          <Route 
            path="/travel-insurance/quote/summary" 
            exact 
            render={(props) => (
              !!formData.tripDirection
                ? <DetailSummary {...props} formData={formData} updateFormData={updateFormData} />
                : <Redirect to="/travel-insurance/quote/trip-info" />
            )}
          />
        <Route 
            path="/travel-insurance/quote/application" 
            exact 
            render={(props) => (
              !!formData.tripDirection
                ? <ContactInformation {...props} formData={formData} updateFormData={updateFormData} provinces={provinces} />
                : <Redirect to="/travel-insurance/quote/trip-info" />
            )}
          />
        <Route 
            path="/travel-insurance/quote/payment" 
            exact 
            render={(props) => (
              !!formData.tripDirection
                ? <PaymentForm {...props} formData={formData} updateFormData={updateFormData} countries={countries}/>
                : <Redirect to="/travel-insurance/quote/trip-info" />
            )}
          />
        <Route 
            path="/travel-insurance/quote/review" 
            exact 
            render={(props) => (
              !!formData.tripDirection
                ? <ReviewApplication {...props} formData={formData} updateFormData={updateFormData} insurances={insurances}/>
                : <Redirect to="/travel-insurance/quote/trip-info" />
            )}
          />
          <Route 
            path="/travel-insurance/quote/submission" 
            exact 
            render={(props) => (
              !!formData.tripDirection
                ? <SubmitResult {...props} formData={formData} updateFormData={updateFormData} />
                : <Redirect to="/travel-insurance/quote/trip-info" />
            )}
          />

          <Route path="/travel-insurance/student" exact component={TravelStudent} />
          <Route path="/travel-insurance/visitor-to-canada" exact component={TravelVisitor} />
          <Route path="/travel-insurance/canadian-traveller" exact component={TravelCanadian} />
          <Route path="/travel-insurance/inbound" exact component={TravelInbound} />
          <Route path="/travel-insurance/outbound" exact component={TravelOutbound} />
          {/* <Route path="/travel-insurance/student" exact component={TravelStudent} /> */}
          <Route path="/travel-insurance/visitor" exact component={TravelVisitor} />
          <Route path="/travel-insurance/canadian-traveler" exact component={TravelCanadian} />
          <Route path="/travel-insurance/claim" exact component={ProcessClaim} />
          {/* <Route path="/travel-insurance/claim-case" exact component={ClaimCase} /> */}

          {/* Ads Pages */}
          {/* <Route path="/ads/travel-insurance/international-student-canada-medical-plan" exact component={AdsTravelStudent} />
          <Route 
            path="/ads/:language/travel-insurance/international-student-canada-medical-plan" 
            exact 
            render={(props) => (
              ['ko','en','ar','ch_s','ch_t','de','es','fa','fr','ja','pt_br','yue','vi'].includes(props.match.params.language)
                ? <AdsTravelStudent {...props} />
                : <Error/> 
            )}
          /> */}

          <Route exact path="/travel-insurance/:vendorAccessCode/application" component={TravelApplicationForms} />
          {/* <Route exact path="/travel-insurance/:vendorAccessCode/application/:type/:company/:applyType" component={TravelApplication} />  */}
          <Route 
            exact 
            path="/travel-insurance/:vendorAccessCode/application/:type/:company/:applyType" 
            render={(props) => (
              <TravelApplication {...props} />
              )}
            /> 
          {/* <Route exact path="/travel-insurance/application" component={TravelApplicationForms} />
          <Route exact path="/travel-insurance/application/:type/:company/:applyType" component={TravelApplication} />  */}
          

          {/* <Route exact path="/travel-insurance/direct-payment" component={Payment} /> */}
          <Route 
            path="/travel-insurance/direct-payment" 
            exact 
            render={(props) => (
              <Payment {...props} />
              )}
            />

          {/* Credit Card Form */}
          <Route 
            path="/credit-card-payment" 
            exact 
            render={(props) => (
              <CreditCardForm {...props} />
              )}
          />


          {/* Life  */}
          <Route path="/life-insurance" exact component={LifeInsurance} />
          {/* <Route path="/life-insurance/quote" exact component={LifeQuote} /> */}
          <Route 
            path="/life-insurance/quote/product-selection" 
            exact 
            render={(props) => (
              <LifeProductForm {...props} lifeFormData={lifeFormData} updateLifeFormData={updateLifeFormData} />
            )}
          />
          <Route 
            path="/life-insurance/quote/personal-info" 
            exact 
            render={(props) => (
              !!lifeFormData.productType
                ? <LifeInformationForm {...props} lifeFormData={lifeFormData} updateLifeFormData={updateLifeFormData} />
                : <Redirect to="/life-insurance/quote/product-selection" />
            )}
          />
          <Route 
            path="/life-insurance/quote/review" 
            exact 
            render={(props) => (
              !!lifeFormData.productType
                ? <LifeReview {...props} lifeFormData={lifeFormData} />
                : <Redirect to="/life-insurance/quote/product-selection" />
            )}
          />
          <Route 
            path="/life-insurance/quote/submission" 
            exact 
            render={(props) => (
              !!lifeFormData.productType
                ? <LifeSubmitResult {...props} lifeFormData={lifeFormData} updateLifeFormData={updateLifeFormData} />
                : <Redirect to="/life-insurance/quote/product-selection" />
            )}
          />
        

          {/* Health  */}
          <Route path="/health-insurance" exact component={HealthInsurance} />
          {/* <Route path="/health-insurance/quote" exact component={HealthQuote} /> */}
          <Route 
            path="/health-insurance/quote/product-selection" 
            exact 
            render={(props) => (
              <HealthProductForm {...props} healthFormData={healthFormData} updateHealthFormData={updateHealthFormData} />
            )}
          />
          <Route 
            path="/health-insurance/quote/personal-info" 
            exact 
            render={(props) => (
              !!healthFormData.insuranceKind
                ? <HealthInformationForm {...props} healthFormData={healthFormData} updateHealthFormData={updateHealthFormData} provinces={provinces} />
                : <Redirect to="/health-insurance/quote/product-selection" />
            )}
          />
          <Route 
            path="/health-insurance/quote/review" 
            exact 
            render={(props) => (
              !!healthFormData.insuranceKind
                ? <HealthReview {...props} healthFormData={healthFormData} />
                : <Redirect to="/health-insurance/quote/product-selection" />
            )}
          />
          <Route 
            path="/health-insurance/quote/submission" 
            exact 
            render={(props) => (
              !!healthFormData.insuranceKind
                ? <HealthSubmitResult {...props} healthFormData={healthFormData} updateHealthFormData={updateHealthFormData} />
                : <Redirect to="/health-insurance/quote/product-selection" />
            )}
          />


          {/* Group Benefits  */}
          <Route path="/group-benefits" exact component={GroupBenefits} />
          {/* <Route path="/group-benefits/quote" exact component={GroupQuote} /> */}
          <Route 
            path="/group-benefits/quote/product-selection" 
            exact 
            render={(props) => (
              <GroupProductForm {...props} groupFormData={groupFormData} updateGroupFormData={updateGroupFormData} />
            )}
          />
          <Route 
            path="/group-benefits/quote/personal-info" 
            exact 
            render={(props) => (
              !!groupFormData.healthPlan
                ? <GroupInformationForm {...props} groupFormData={groupFormData} updateGroupFormData={updateGroupFormData} />
                : <Redirect to="/group-benefits/quote/product-selection" />
            )}
          />
          <Route 
            path="/group-benefits/quote/review" 
            exact 
            render={(props) => (
              !!groupFormData.healthPlan
                ? <GroupReview {...props} groupFormData={groupFormData} />
                : <Redirect to="/group-benefits/quote/product-selection" />
            )}
          />
          <Route 
            path="/group-benefits/quote/submission" 
            exact 
            render={(props) => (
              !!groupFormData.healthPlan
                ? <GroupSubmitResult {...props} groupFormData={groupFormData} updateGroupFormData={updateGroupFormData} />
                : <Redirect to="/group-benefits/quote/product-selection" />
            )}
          />

          <Route path="/hsa" exact component={HSA} />
          <Route
            path="/insurance/application"
            exact
            component={ProcessApplication}
          />
          {/* <Route path="/insurance/claim" exact component={ProcessClaim} /> */}
          <Route path="/insurance/refund" exact component={ProcessRefund} />
          <Route path="/insurance/refund/request" exact component={RefundRequest} />
          <Route path="/insurance/download" exact component={Download} />
          <Route path="/insurance/faq" exact component={FAQ} />
          <Route
            path="/insurance/clinic-finder"
            exact
            component={ClinicFinder}
          />
          <Route path="/about-us" exact component={AboutUs} />
          <Route path="/contact-us" exact component={ContactUs} />
          <Route path="/partner" exact component={Partner} />
          <Route path="/register-partner" exact 
            // component={PartnerApplication} 
            render={(props) => (
              <PartnerApplication {...props} countries={countries} provinces={provinces} />
            )}
            />
          <Route path="/privacy-policy" exact component={PrivacyPolicy} />
          {/* <Route path="/blog/buy-international-student-medical-insurance-canada" exact component={Blog} /> */}
          {/* <Route exact path="/signup" component={SignUp} /> */}
          <Route exact path="/signin" component={SignIn} />
          <Route 
            exact path="/signin/:confirmationCode" component={SignIn} />

          <Route exact path="/reset-password" component={ResetPassword} />

          <Route exact path="/privacy-policy" component={PrivacyPolicy} />


          {/* / for multilingual SEO  */}
          <Route 
            path="/:language" 
            exact 
            render={(props) => (
              ['ko','en','ar','ch_s','ch_t','de','es','fa','fr','ja','pt_br','yue','vi'].includes(props.match.params.language)
                ? <Home {...props} />
                : <Error/> 
            )}
          />
          
          {/* /travel-insurance for multilingual SEO  */}          
          <Route 
            path="/travel-insurance/:language" 
            exact 
            render={(props) => (
              ['ko','en','ar','ch_s','ch_t','de','es','fa','fr','ja','pt_br','yue','vi'].includes(props.match.params.language)
                ? <TravelInsurance {...props} />
                : <Error/> 
            )}
          />

          {/* /travel-insurance/student for multilingual SEO  */}          
          <Route 
            path="/travel-insurance/student/:language" 
            exact 
            render={(props) => (
              ['ko','en','ar','ch_s','ch_t','de','es','fa','fr','ja','pt_br','yue','vi'].includes(props.match.params.language)
                ? <TravelStudent {...props} />
                : <Error/> 
            )}
          />

          {/* /travel-insurance/visitor for multilingual SEO  */}          
          <Route 
            path="/travel-insurance/visitor/:language" 
            exact 
            render={(props) => (
              ['ko','en','ar','ch_s','ch_t','de','es','fa','fr','ja','pt_br','yue','vi'].includes(props.match.params.language)
                ? <TravelVisitor {...props} />
                : <Error/> 
            )}
          />

          <Route path="*" component={Error} />
        </Switch>
        <Footer {...props}/>
        {/* {background && (
            <Route
              path="/signin"
              children={({ match }) => {
                return (
                  <Dialog onClose={history.goBack} open={Boolean(match)}>
                    <SignIn
                      isAuthorized={isAuthorized}
                      setIsAuthorized={setIsAuthorized}
                    />
                  </Dialog>
                )
              }}
            />
          )} */}
        <ScrollArrow />
      </ScrollToTop>
    </>
  )
}
