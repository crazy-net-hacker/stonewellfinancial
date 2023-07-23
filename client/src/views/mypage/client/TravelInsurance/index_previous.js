import React, { useEffect, useState, useContext } from 'react';
// import {useParams} from 'react-router-dom';

//core component
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, IconButton } from '@material-ui/core'
//component
import { amountFormat } from '../../../../controllers/dataFormat';
import Button from '../../../../components/common/CustomButtons/Button'
import { LanguageContext } from '../../../../components/common/LanguageProvider';
import { Text } from '../../../../components/common/LanguageProvider';
import HowToClaimModal from './HowToClaimModal';
import RefundRequestModal from './RefundRequestModal';
import PDFViewer from "../../../../components/common/PDFViewer/AllPageViewer";
import RepurchaseApplication from './RepurchaseApplication';
import { travelQuoteInit } from '../../../layouts/InitFormData'
// import axios from "axios";
// redux
import { useSelector, useDispatch } from 'react-redux';
import { getTravelApplicationsByClient } from '../../../../redux/actions/travelApplicationAction';
//icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import EditIcon from '@mui/icons-material/Edit';

// import Criteria from '../../common/Criteria'
// import queryString from 'query-string';

//style
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';
// import TravelApplication from '../../../pages/TravelApplication';

const useStyles = makeStyles(dashboardStyles)


export default function ClientTravelInsurance({user}) { 

  const classes = useStyles();

  const dispatch = useDispatch();
  const applications = useSelector(state => state.travelApplicationReducer.applications)
  // const { user_id } = useParams();
  //Redux
  useEffect(() => {
    dispatch(getTravelApplicationsByClient(user))
    }, [dispatch, user]);

    

  // criteria
  // const [criteriaData, setCriteriaData] = useState({
  //   fromDate: '2022-01-01',
  //   toDate: new Date().toISOString().replace('T', ' ').substr(0, 10),
  // })

  // Mobile Design
  const [width, setWidth] = useState(window.innerWidth);
    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      }
    }, []);
    
    let isMobile = (width < 768);

  const [isShown, setIsShown] = useState()

 
 
  // User Language
  let currentLanguage = useContext(LanguageContext).userLanguage

  // PDF Viewer
  const [openPDFViewer, setOpenPDFViewer] = useState(false);
  const [pdfOption, setPdfOption] = useState([]);
  const handleOpenPDFViewer = (kind, insuredPerson) => {
    let url = ''
    if (kind === 'plan'){
      if (insuredPerson.documents.filter(f => (f.document_type === 'Brochure' && f.language === currentLanguage.toUpperCase())).length > 0){
            url = process.env.REACT_APP_S3_URL + insuredPerson.documents.filter(f => (f.document_type === 'Brochure' && f.language === currentLanguage.toUpperCase()))[0].document_url
      }
    } else
    {
      // set carewell brochure url
      url = ''
    }
    setPdfOption({
            brochures_url : url,
            title : kind === 'plan'? `${insuredPerson.compnayName}` : 'Carewell Services'
        })
    setOpenPDFViewer(true)
  }



  // Refund modal
  const [refundData, setRefundData] = useState([]);
  const [openRefundRequest, setOpenRefundRequest] = useState(false);
  
  const handleRefundRequest = (applications, person) => {
    applications.filter(f => (f.insuredpersons.insuredPersonID === person.insuredPersonID))
    setRefundData(person,applications)
    console.log(refundData)
    setOpenRefundRequest(true)
  }

  // Repurchase application modal
  const [data, setData] = useState([]);
  const [openRepurchaseApplication, setOpenRepurchaseApplication] = useState(false);
  
  // const handleOpenRepurchaseApplication = (applications, person) => {
  //   applications.filter(f => (f.insuredpersons.insuredPersonID === person.insuredPersonID))
  //   setData(person,applications)
  //   setOpenRepurchaseApplication(true)
  //   console.log(applications)
  // }

  // const handleOpenRepurchaseApplication = (applications, insuredPerson) => {
    
  //   // insuredpersons = applications.insuredpersons
  //   applications.person = []
  //   applications.person = applications.filter(f => (f.insuredpersons.insuredPersonID === insuredPerson.insuredPersonID))

  //   // applications.insuredpersons = applications.insuredpersons.filter(f=>(f.insuredPersonID = insuredPerson.insuredPersonID))

  //   setData(applications, insuredPerson)
  //   setOpenRepurchaseApplication(true)
  //   console.log(applications.person)
  // }

  // by samantha
  // const handleOpenRepurchaseApplication = (application, insuredPersonID) => {
  //   const applications = application
  //   applications.applicationType = application.insured_type
  //   // console.log(application.insuredpersons.filter(f=>(f.insuredPersonID === insuredPersonID)))

  //   // applications.insuredpersons = []

  //   applications.insuredpersons = application.insuredpersons.filter(f=>(f.insuredPersonID === insuredPersonID))
    
  //   setData(applications)
  //   setOpenRepurchaseApplication(true)
  //   console.log(applications.applicationType)
  //   console.log(applications)
  // }

  // by emma
  const handleOpenRepurchaseApplication = (application, insuredPersonID) => {

    const renewApplicantInfo = application.insuredpersons.filter(f=>(f.insuredPersonID === insuredPersonID))[0]
    const mailingAddress = application.address.find(f=>f.useType === 'Mailling')
    // console.log('renewApplicantInfo', renewApplicantInfo)

    // set formInitial
    const renewApplication = travelQuoteInit()

    // set data form previous application
    renewApplication.application = {
            applicationCompany: renewApplicantInfo.compnayName,
            applicationType: application.insured_type
            }
    renewApplication.tripDirection = application.travel_direction_type
    // renewApplication.originCountry = renewApplicantInfo.originCountryCode
    renewApplication.destCountry = renewApplicantInfo.destCountryCode
    renewApplication.destCountryName = renewApplicantInfo.destCountry
    renewApplication.insuredPersons[0].firstName = renewApplicantInfo.firstName
    renewApplication.insuredPersons[0].lastName = renewApplicantInfo.lastName
    renewApplication.insuredPersons[0].birthDate = new Date(renewApplicantInfo.birthdate+'T00:00:00')
    renewApplication.insuredPersons[0].gender = renewApplicantInfo.gender
    renewApplication.insuredPersons[0].beneficiaryName = renewApplicantInfo.beneficiaryName
    renewApplication.insuredPersons[0].beneficiaryRelationship = renewApplicantInfo.beneficiaryRelationship
    renewApplication.contactEmail = application.email
    renewApplication.contactPhone = application.phone

    if( mailingAddress){
      renewApplication.mailCity =  mailingAddress.city
      renewApplication.mailProvince = mailingAddress.province
      renewApplication.mailStreetName = mailingAddress.street
      renewApplication.mailUnitApartmentNo = mailingAddress.suiteNo
      renewApplication.mailPostalCode = mailingAddress.postalcode
      renewApplication.isMailing = mailingAddress.isMailing
    } 
    //
      // console.log('renew',renewApplication)

      setData(renewApplication)
      setOpenRepurchaseApplication(true)

    }

  // Claim modal
  const [insurance, setInsurance] = useState([]);
  const [openHowToClaim, setOpenHowToClaim] = useState(false);

  const handleOpenHowToClaim = (company, plan) => {
    setInsurance({
      company : company,
      plan :plan 
        })
    setOpenHowToClaim (true)
  }


  return (

    // <div>
    //   My Insurance - TI 
    //   <p>{applications[0].application_id}</p>
    //   <p>hi</p>
    // </div>
    <Grid container>
       {/* { applications.applicationType && */}
  
        <Grid item container style={{ margin:'5vh 5vh 4vh' }}>
          <Typography className={classes.dashboardPageTitle}>
            {/* <Text tid={'Vendor.StartApplication'} /> */}
            My Travel Insurance
          </Typography>
        </Grid>
        <Grid item container style={{ margin:'0 5vh 2vh' }}>
          <Typography className={classes.dashboardPageSubTitle}>
            {/* <Text tid={'Vendor.StartApplication'} /> */}
            Active
          </Typography>
        </Grid>
      
      {/* Active Insurance List */}
      
      {applications.map((application,index) => (
        <Grid item container key={index}>
          {application.insuredpersons && application.insuredpersons.length > 0
            ? application.insuredpersons.map((insuredPerson, i) => (
          
              <Grid item container key={i} className={classes.productBox}>

                {/* Insurance summary row */}
                <Grid item container style={{ paddingBottom: !isShown ? '1vh' : '0'  }}>
                  <Grid item xs={12} lg={6} >
                    <Typography >
                      {insuredPerson.compnayName} {insuredPerson.planName}
                    </Typography>
                    
                    {!isMobile ?
                      <>
                        {/* See more detail button */}
                        <IconButton aria-label="view" color="primary" 
                            className={classes.iconButtonBox}
                            onClick={() => setIsShown(!isShown)}
                        >
                          {!isShown ?     
                              <ExpandMoreIcon />
                              :<ExpandLessIcon/>
                          }
                          <Typography variant="body2"  style={{ fontSize:'12px', fontWeight: '500' }}>
                              {/* <Text tid={'TravelApplication.Product.SummaryDetail'}/> */}
                              See more detail
                          </Typography>
                        </IconButton>
                      </>
                    :null}
                  </Grid>

                  <Grid item xs={6} lg={2} style={{ padding: isMobile ? '1vh' : '0' }}>
                    <label className={classes.productLable}>Insured Name</label>
                    <span className={classes.inputValue}>{insuredPerson.firstName} {insuredPerson.lastName}</span>
                  </Grid>
                  <Grid item xs={6} lg={2} style={{ padding: isMobile ? '1vh' : '0' }}>
                    <label className={classes.productLable}>Policy Number</label>
                    <span className={classes.inputValue}>SCG1582549</span>
                  </Grid>
              
                  <Grid item xs={12} lg={2} style={{ textAlign: isMobile ? 'left': 'right', alignSelf:'center', padding: isMobile ? '2vh 0 0 0' : '0' }}>
                  {/* <Link to={`/travel-insurance/application/${type}/${company}/${applyType}`} target='_blank'>Repurchase</Link> */}
                  {/* <Link to={`/travel-insurance/application/${type}/${company}/${applyType}`} target='_blank'>Repurchase</Link> */}
                      <Button
                          color={'primary'}
                          style={{ width: isMobile ? '100%': 'auto' }}
                          onClick={() => { 
                            // console.log('clicked')
                            // setApplicaionStatus()
                            // goToRepurchasePage('Student', insuredPerson.compnayName, 'indivisual', insuredPerson.userId)
                            // console.log('match.url',match.url)
                            // window.open(`${match.url}/med-questionnire?app_id=${clickedData.application_id}&insured_id=${row.insuredPersonID}&insurance=${row.compnayName}&type=${row.eligilbeIns}`, '_blank')
                            // window.open(`/travel-insurance/application/student/tugo/individual`, '_blank')
                            handleOpenRepurchaseApplication(application, insuredPerson.insuredPersonID)
                          }}
                      >
                          Repurchase
                      </Button>
                  </Grid>

                  {isMobile ?
                    <Grid item xs={12}>                    
                          {/* See more detail button */}
                          <IconButton aria-label="view" color="primary" 
                              className={classes.iconButtonBox}
                              style={{  width:'100%' }}
                              onClick={() => setIsShown(!isShown)}
                          >
                            {!isShown ?     
                                <ExpandMoreIcon />
                                :<ExpandLessIcon/>
                            }
                            <Typography variant="body2"  style={{ fontSize:'12px', fontWeight: '500' }}>
                                {/* <Text tid={'TravelApplication.Product.SummaryDetail'}/> */}
                                See more detail
                            </Typography>
                          </IconButton>
                    </Grid>
                  :null}

                </Grid>

                {/* Insurance Detail info row */}
                {isShown ? 
                  <Grid item container className={classes.productDetailBox}>
                    <Grid item xs={6} lg={2} className={classes.productDetailValue}>
                      <label className={classes.productLable}>Sum Insured</label>
                      <span className={classes.inputValue}>{amountFormat(insuredPerson.coverage, 0)}</span>
                    </Grid>
                    <Grid item xs={6} lg={2} className={classes.productDetailValue}>
                      <label className={classes.productLable}>Deductible</label>
                      <span className={classes.inputValue}>{amountFormat(insuredPerson.deductible, 0)}</span>
                    </Grid>
                    <Grid item xs={6} lg={2} className={classes.productDetailValue}>
                      <label className={classes.productLable}>Effetive date</label>
                      <span className={classes.inputValue}>{insuredPerson.tripStartDate}</span>
                    </Grid> 
                    <Grid item xs={6} lg={2} className={classes.productDetailValue}>
                      <label className={classes.productLable}>Expiry date</label>
                      <span className={classes.inputValue}>{insuredPerson.tripEndDate}</span>
                    </Grid> 
                    <Grid item xs={6} lg={2} className={classes.productDetailValue}>
                      <label className={classes.productLable}>Trip period</label>
                      <span className={classes.inputValue}>{insuredPerson.tripPeriod} days</span>
                    </Grid>  
                    <Grid item xs={6} lg={2} className={classes.productDetailValue} style={{ textAlign:isMobile ? 'left': 'right' }}>
                      <label className={classes.productLable}>Premium</label>
                      <span className={classes.inputValue}>{amountFormat(insuredPerson.plan_price, 2)}</span>
                    </Grid>
                    {/* <Grid item lg={2}>
                      <label className={classes.productLable}>Application ID</label>
                      <span className={classes.inputValue}> {applications[0].application_id}</span>
                    </Grid> */}
                    
                </Grid>
              :null}

                <Grid item container>
                  {/* Benefit PDF open */}
                  <Grid item lg={3}>
                    <IconButton aria-label="view" color="primary"
                        style={{ borderRadius:'0'}} 
                        onClick={() => {
                          handleOpenPDFViewer('plan', insuredPerson)
                        }}
                    >
                      <DescriptionIcon />
                      <Typography variant="body2" className={classes.iconButtonText}>
                        <Text tid={'Quote.SeeMoreBenefit'}/>
                      </Typography>
                    </IconButton>
                  </Grid>
                  {/* Policy Wording PDF open */}
                  <Grid item lg={3}>
                    <IconButton aria-label="view" color="primary" 
                        style={{ borderRadius:'0'}}
                        // onClick={() => 
                        //   handleOpenPDFViewer('plan',insurance)
                        // }
                    >
                      <DescriptionIcon />
                      <Typography variant="body2" className={classes.iconButtonText}>
                        <Text tid={'Quote.SeePolicyWording'}/>
                      </Typography>
                    </IconButton>
                  </Grid>
                  {/* How to Claim Modal open */}
                  <Grid item lg={3}>
                    <IconButton aria-label="view" color="primary" 
                        style={{ borderRadius:'0'}}
                        onClick={() => 
                          handleOpenHowToClaim(insuredPerson.compnayName, insuredPerson.planName)
                        }
                    >
                      <EditIcon />
                      <Typography variant="body2" className={classes.iconButtonText}>
                        <Text tid={'Quote.SeeHowToClaim'}/>
                      </Typography>
                    </IconButton>
                  </Grid>
                  {/* Refund Modal open */}
                  <Grid item lg={3} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                    <IconButton aria-label="view" color="primary" 
                        style={{ borderRadius:'0'}}
                        onClick={() => {
                          handleRefundRequest(applications, insuredPerson)
                          // console.log(applications)
                          }}
                    >
                      <CreditScoreIcon />
                      <Typography variant="body2" className={classes.iconButtonText}>
                        <Text tid={'Quote.SubmitRefund'}/>
                      </Typography>
                    </IconButton>
                  </Grid>

                </Grid>

                {openHowToClaim === true &&
                  <HowToClaimModal
                    company={insurance.company}
                    plan={insurance.plan}
                    // countries={countries}
                    open={openHowToClaim}
                    handleClose={setOpenHowToClaim}
                  />
                }

                {openRefundRequest === true &&
                  <RefundRequestModal
                    refundData={refundData}
                    // company={insurance.company}
                    // plan={insurance.plan}
                    // type={insurance.type}
                    open={openRefundRequest}
                    handleClose={setOpenRefundRequest}
                  />
                }

                {openRepurchaseApplication === true &&
                  <RepurchaseApplication
                    data={data}
                    insuraceCompany={insuredPerson.compnayName}
                    insuraceType={insuredPerson.eligilbeIns}
                    applyType={application.insured_group_type}
                    open={openRepurchaseApplication}
                    handleClose={setOpenRepurchaseApplication}
                  />
                }

                {/* PDF Viewer Modal  */}
                {
                  openPDFViewer === true &&
                  <PDFViewer
                    title={pdfOption.title}
                    pdf={pdfOption.brochures_url} 
                    openPDFViewer={openPDFViewer}
                    setOpenPDFViewer={setOpenPDFViewer}
                  />
                }

              </Grid>
          )):null}

          

      </Grid>
      ))}


    </Grid>

  )
}
