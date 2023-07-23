import React, { useEffect } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
// redux
import { useSelector, useDispatch } from 'react-redux';
import { getAccountByEmail } from '../../../redux/actions/accounts'

import PrivateRoute from '../PrivateRoute'
// ScrollToTop
import ScrollToTop from '../ScrollToTop'
import ScrollArrow from '../ScrollArrow'
// Dashboard
import DashboardNavigator from '../dashboard'
import { IsLoggedIn, GetFromLocalStore } from '../utils'
import { UserId, Email  } from '../constants'

// Admin pages
import AdminDashboard from '../../mypage/admin/Dashboard/index'
import VendorRegistered from '../../mypage/admin/VendorRegistered/index'
import UserAccount from '../../mypage/admin/UserAccount/index'
import TravelApplication from '../../mypage/admin/TravelApplication/index'
import MedicalAnswer from '../../mypage/admin/TravelApplication/MedicalAnswer'
import AdminReport from '../../mypage/admin/Report/index'
import Refund from '../../mypage/admin/Refund/index'
import CreditCard from '../../mypage/admin/CreditCard/index';
import LifeQuote from '../../mypage/admin/LifeQuote/index'
import HealthQuote from '../../mypage/admin/HealthQuote/index'
import GroupQuote from '../../mypage/admin/GroupQuote/index'
import MedicalQuestionnaire from '../../mypage/admin/MedicalQuestionnaire/index'
import InsurancePlanRate from '../../mypage/admin/InsurancePlanRate/index' 
import ChatBot from '../../mypage/admin/ChatBot/index';


// Vendor pages
import VendorDashboard from '../../mypage/vendor/Dashboard/index'
import VendorAccount from '../../mypage/vendor/VendorAccount/index'
import VendorMyAccount from '../../mypage/vendor/MyAccount/index'
import VendorSearchApplication from '../../mypage/vendor/SearchApplication/index'
import VendorSearchRequestedRefund from '../../mypage/vendor/SearchRequestedRefund/index'
import VendorDownload from '../../mypage/vendor/Download/index'

// common
import VendorNewApplication from '../../mypage/common/NewApplication/index'
import NewApplicationApply from '../../mypage/common/NewApplication/Apply/index'

// Client pages
import ClientDashboard from '../../mypage/client/Dashboard/index'
import ClientTravelQuote from '../../mypage/client/NewTravelApplication/index'
import ClientMyAccount from '../../mypage/client/MyAccount/index'
// import ClientNewQA from '../../mypage/client/NewQA/index'
// import ClientLifeQuote from '../../mypage/client/Quotation/LifeQuote/index'
// import ClientHealthQuote from '../../mypage/client/Quotation/HealthQuote/index'
// import ClientTravelQuote from '../../mypage/client/Quotation/TravelQuote/index'
// import ClientGroupQuote from '../../mypage/client/Quotation/GroupQuote/index'

import ClientTravelInsurance from '../../mypage/client/TravelInsurance/index'
import ClientLifeInsurance from '../../mypage/client/LifeInsurance'
import ClientHealthInsurance from '../../mypage/client/HealthInsurance'
import ClienGroupBenefit from '../../mypage/client/GroupBenefits'

import NotFound from '../../../components/common/NotFoundPage'
import VendorReports from '../../mypage/vendor/Reports'


export const PrivateLayout = (props) => {
  const dispatch = useDispatch();

  const account = useSelector(state => state.accountReducer.account[0])
  const loading = useSelector(state => state.accountReducer.loading)
  const error = useSelector(state => state.accountReducer.error)
    
  useEffect(() => {
    dispatch(getAccountByEmail(GetFromLocalStore(Email)))
      }, [dispatch]);


  return (
    <>
      {!IsLoggedIn()
        ? <Redirect to="/signin" />
        :
          <ScrollToTop>
            {!loading && !error && account &&
              <DashboardNavigator {...props} vendorName={account.vendor.length>0?account.vendor[0].vendorName:''} vendorRole={account.vendor_role}>
                <Switch>
                  {/* {console.log(account)} */}
                  {/* {console.log(account.vendor_name)} */}
                  {IsLoggedIn() && account.role_id === 'VEN' && account.vendor.length > 0 && (
                    <>
                      <PrivateRoute
                        exact
                        path={`/myportal/dashboard`}
                        isAuthenticated={IsLoggedIn()}
                        component={props => <VendorDashboard {...props} user={account.user_id} vendorID={account.vendor_id} vendorEmail={account.vendor.length>0?account.vendor[0].vendorEmail:''} rate={account.vendor[0].rate?account.vendor[0].rate:0} />}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/my-account"
                        isAuthenticated={IsLoggedIn()}
                        component={VendorMyAccount}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/vendor/account"
                        isAuthenticated={IsLoggedIn()}
                        component={props => <VendorAccount {...props} user={account.user_id} accessCode={account.vendor.length>0?account.vendor[0].accessCode:''} vendorID={account.vendor_id}/>}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/vendor/new-application"
                        isAuthenticated={IsLoggedIn()}
                        component={props => <VendorNewApplication {...props} user={account.user_id} vendorID={account.vendor_id} vendorAddress={account.vendor_address}/>}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/vendor/new-application/:type"
                        isAuthenticated={IsLoggedIn()}
                        component={props => <NewApplicationApply {...props} user={account.user_id} userRole={account.role_id} vendorID={account.vendor_id} vendorAddress={account.vendor_address}/>}
                      />
                      <PrivateRoute
                        exact
                        path= "/myportal/vendor/search-application"
                        isAuthenticated={IsLoggedIn()}
                        // component={VendorSearchApplication}
                        component={props => <VendorSearchApplication {...props} user={account.user_id} vendorID={account.vendor_id} vendorEmail={account.vendor.length>0?account.vendor[0].vendorEmail:''} vendorAddress={account.vendor_address} />}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/vendor/search-application/med-questionnire"
                        isAuthenticated={IsLoggedIn()}
                        component={MedicalAnswer}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/vendor/search-requested-refund/"
                        isAuthenticated={IsLoggedIn()}
                        // component={VendorReports}
                        component={props => <VendorSearchRequestedRefund {...props} vendorID={account.vendor_id} />}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/vendor/reports"
                        isAuthenticated={IsLoggedIn()}
                        // component={VendorReports}
                        component={props => <VendorReports {...props} vendorID={account.vendor_id} />}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/vendor/download"
                        isAuthenticated={IsLoggedIn()}
                        component={VendorDownload}
                      />
                    </>
                  )}
                  {IsLoggedIn() && account.role_id === 'ADM' && (
                    <>
                      <PrivateRoute
                        exact
                        path="/myportal/dashboard"
                        isAuthenticated={IsLoggedIn()}
                        component={AdminDashboard}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/admin/vendor-register"
                        isAuthenticated={IsLoggedIn()}
                        component={VendorRegistered}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/admin/user-account"
                        isAuthenticated={IsLoggedIn()}
                        component={UserAccount}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/admin/travel-application"
                        isAuthenticated={IsLoggedIn()}
                        // component={TravelApplication}
                        component={props => <TravelApplication {...props} user={account.user_id} userRole={account.role_id} />}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/admin/travel-application/med-questionnire"
                        isAuthenticated={IsLoggedIn()}
                        component={MedicalAnswer}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/admin/sales-report"
                        isAuthenticated={IsLoggedIn()}
                        component={AdminReport}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/admin/new-application"
                        isAuthenticated={IsLoggedIn()}
                        component={props => <VendorNewApplication {...props} user={account.user_id} vendorID={account.vendor_id} vendorAddress={account.vendor_address}/>}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/admin/new-application/:type"
                        isAuthenticated={IsLoggedIn()}
                        component={props => <NewApplicationApply {...props} user={account.user_id} userRole={account.role_id} vendorID={account.vendor_id} vendorAddress={account.vendor_address}/>}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/admin/application/:type/modify"
                        isAuthenticated={IsLoggedIn()}
                        component={props => <NewApplicationApply {...props} user={account.user_id} userRole={account.role_id} vendorID={account.vendor_id} vendorAddress={account.vendor_address}/>}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/admin/refund"
                        isAuthenticated={IsLoggedIn()}
                        component={props => <Refund {...props} user={account.user_id} />}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/admin/credit-card"
                        isAuthenticated={IsLoggedIn()}
                        component={props => <CreditCard {...props} user={account.user_id} />}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/admin/health-quote"
                        isAuthenticated={IsLoggedIn()}
                        component={HealthQuote}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/admin/life-quote"
                        isAuthenticated={IsLoggedIn()}
                        component={LifeQuote}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/admin/group-quote"
                        isAuthenticated={IsLoggedIn()}
                        component={GroupQuote}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/admin/medical-questionnaire"
                        isAuthenticated={IsLoggedIn()}
                        component={MedicalQuestionnaire}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/admin/insurance-plan-rate"
                        isAuthenticated={IsLoggedIn()}
                        component={InsurancePlanRate}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/admin/chatbot"
                        isAuthenticated={IsLoggedIn()}
                        component={ChatBot}
                      />

                    </>
                  )}
                  {IsLoggedIn() && account.role_id === 'CLT' && (
                    <>
                      <PrivateRoute
                        exact
                        path="/myportal/dashboard"
                        isAuthenticated={IsLoggedIn()}
                        component={ClientDashboard}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/travel/quote/trip-info"
                        isAuthenticated={IsLoggedIn()}
                        component={props => <ClientTravelQuote {...props} user={GetFromLocalStore(UserId)}/>}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/insurance/travel"
                        isAuthenticated={IsLoggedIn()}
                        component={props => <ClientTravelInsurance {...props} user={GetFromLocalStore(UserId)}/>}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/insurance/life"
                        isAuthenticated={IsLoggedIn()}
                        component={props => <ClientLifeInsurance {...props} user={GetFromLocalStore(UserId)}/>}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/insurance/health"
                        isAuthenticated={IsLoggedIn()}
                        component={props => <ClientHealthInsurance {...props} user={GetFromLocalStore(UserId)}/>}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/insurance/group-benefit"
                        isAuthenticated={IsLoggedIn()}
                        component={props => <ClienGroupBenefit {...props} user={GetFromLocalStore(UserId)}/>}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/account"
                        isAuthenticated={IsLoggedIn()}
                        component={props => <ClientMyAccount {...props} user={GetFromLocalStore(UserId)} />}
                      />
                      {/* <PrivateRoute
                        exact
                        path="/myportal/client/new-quote"
                        isAuthenticated={IsLoggedIn()}
                        component={props => <ClientNewQA {...props} user={GetFromLocalStore(UserId)} />}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/client/new-quote/life"
                        isAuthenticated={IsLoggedIn()}
                        component={props => <ClientLifeQuote {...props} user={GetFromLocalStore(UserId)} />}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/client/new-quote/health"
                        isAuthenticated={IsLoggedIn()}
                        component={props => <ClientHealthQuote {...props} user={GetFromLocalStore(UserId)} />}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/client/new-quote/travel"
                        isAuthenticated={IsLoggedIn()}
                        component={props => <ClientTravelQuote {...props} user={GetFromLocalStore(UserId)} />}
                      />
                      <PrivateRoute
                        exact
                        path="/myportal/client/new-quote/group"
                        isAuthenticated={IsLoggedIn()}
                        component={props => <ClientGroupQuote {...props} user={GetFromLocalStore(UserId)} />}
                      /> */}
                      
                    </>
                  )}
                  <Route component={NotFound} />
                </Switch>
              </DashboardNavigator>
            }
            <ScrollArrow />
          </ScrollToTop>
        }
    </>
  )
}
