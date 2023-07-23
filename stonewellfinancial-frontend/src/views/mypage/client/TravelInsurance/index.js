import React, { useEffect, useCallback, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import {useParams} from 'react-router-dom';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { getTravelApplicationsByClient } from '../../../../redux/actions/travelApplicationAction';
//core component
import { Typography, Grid, IconButton } from '@material-ui/core'
//component
import Button from '../../../../components/common/CustomButtons/Button'
import { Text, LanguageContext } from '../../../../components/common/LanguageProvider';
import HowToClaimModal from './HowToClaimModal';
import PDFViewer from "../../../../components/common/PDFViewer/AllPageViewer";
// import RenewApplicationModal from '../../common/RenewalApplication/RenewModal';
// import RepurchaseApplication from './RepurchaseApplication'
import RepurchaseModal from './RepurchaseModal'
import RefundApplicationModal from '../../common/RefundApplication/RefundModal';
import WindowDimension from '../../../../components/common/WindowDimension'
//
import { amountFormat } from '../../../../controllers/dataFormat';
import { renewalApplication } from '../../../../functionalities/DuplicateApplication'; 
//icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import EditIcon from '@mui/icons-material/Edit';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// import Criteria from '../../common/Criteria'
// import queryString from 'query-string';

//style
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';
// import TravelApplication from '../../../pages/TravelApplication';

const useStyles = makeStyles(dashboardStyles)

// sorting based on relationship
const relationship_sort = [
  { code: 'Primary', sort: 1 },
  { code: 'Spouse', sort: 2 },
  { code: 'Child', sort: 3 },
  { code: 'Parent', sort: 4 },
  { code: 'Siblings', sort: 5 },
  { code: 'Guardian', sort: 6 },
  { code: 'Companion', sort: 7 }
  ]

    // sorting based on relationship
const sortNumber = (relationship) => {
  const order = relationship_sort.filter(f=>f.code ===relationship)
  return order.length > 0 ? order[0].sort : 9
}  

export default function ClientTravelInsurance({user}) { 
  const classes = useStyles();

  const dispatch = useDispatch();
  const applications = useSelector(state => state.travelApplicationReducer.applications)

  const getSearchResult = useCallback(() => {
    dispatch(getTravelApplicationsByClient(user))
    }, [dispatch, user]);

  useEffect(() => {
    getSearchResult()
    }, [getSearchResult]);


  // criteria
  // const [criteriaData, setCriteriaData] = useState({
  //   fromDate: '2022-01-01',
  //   toDate: new Date().toISOString().replace('T', ' ').substr(0, 10),
  // })

  // Mobile Design
  const { width } = WindowDimension();
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
      url = ''
    }
    setPdfOption({
            brochures_url : url,
            title : kind === 'plan'? `${insuredPerson.compnayName}` : 'Carewell Services'
        })
    setOpenPDFViewer(true)
  }


  // Repurchase application modal
  const [data, setData] = useState([]);
  const [openRepurchaseApplication, setOpenRepurchaseApplication] = useState(false);
  
  // Renew (Repurchase) application modal 
  const handleOpenRepurchaseApplication = (application) => {
    setData(renewalApplication(application, user, true))
    setOpenRepurchaseApplication(true)
  }

  // Refund application modal
  const [openRefundApplication, setOpenRefundApplication] = useState(false);

  // Refund
  const handleOpenRefundApplication = (application) => {
    if (application){
        // build requested refund info data
        const refundInfo = {
          email: application.email,
          insuranceType: application.insured_type,
          reason: '',
          refundFormFiles: [],
          proofFiles: [],
          insuredNumber: application.insuredpersons.length,
          insuredPersons: application.insuredpersons.filter(f=>f.refundRequestDate === null).map(p=> { 
            return{
              firstName : p.firstName,
              lastName : p.lastName,
              gender: p.gender,
              birthDate: p.birthdate,
              insuranceType: p.travelType,
              insuranceCompany: p.compnayName,
              planName: p.planName,
              policyNum: p.policyNo,
              tripStartDate: p.tripStartDate,
              tripEndDate: p.tripEndDate,
              refundRequested: true,
              reason: '',
              requiredFiles: []
            }
          }),
          sourceFrom: 'V',
          userID: user
          }
        // setData(refundApplication(application, user, true))
        setData(refundInfo)
        // console.log(refundInfo)
        setOpenRefundApplication(true)
    }
  }

  // re get application list after request refund
  function handleConfirm(resultMessage){
    if (resultMessage === 'success'){
      getSearchResult()
    }
  };


  // Claim modal
  const [insuranceClaim, setInsuranceClaim] = useState([]);
  const [openHowToClaim, setOpenHowToClaim] = useState(false);

  const handleOpenHowToClaim = (application) => {
  // group by insuranceCompany, plan
  var obj = Object.create(null)
  const groupInsuranceClaim = []
  application.insuredpersons.forEach(function (o) {
      var key = ['compnayName', 'planNam'].map(function (k) { return o[k]; }).join('|');
      if (!obj[key]) {
          obj[key] = { company: o.compnayName, plan: o.planName };
          groupInsuranceClaim.push(obj[key]);
      }
  });

    setInsuranceClaim(groupInsuranceClaim)
    setOpenHowToClaim (true)
  }

  // sort based on relationship
  applications && applications.map(row=>
    row.insuredpersons.length>0 && row.insuredpersons.sort((a,b)=> sortNumber(a.relationship) - sortNumber(b.relationship))
  );
  

  return (

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
        {applications && applications.length>0
          ? applications.map((application,index) => (
              <Grid item container key={index} className={classes.productBox}>
                <Grid item container >
                  <Grid item xs={12} md={4} lg={4}>
                    <Typography className={classes.inputValue}>
                        Application Date: {application.app_date}
                    </Typography>
                    <Typography className={classes.inputValue}>
                        Application ID: {application.application_id} {application.insured_group_type==='Family'?`(${application.insured_group_type})`:null} - {application.app_status}  
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8} lg={8} style={{ textAlign: isMobile ? 'left': 'right'}}>
                    <IconButton aria-label="view" color="primary" 
                      style={{ borderRadius:'0'}}
                      onClick={() => {
                        handleOpenRepurchaseApplication(application)
                      }}
                    >
                      <ShoppingCartIcon />
                      <Typography variant="body2" className={classes.iconButtonText}>
                        {/* <Text tid={'Quote.'}/> */}
                        Repurchase
                      </Typography>
                    </IconButton>

                    {/* How to Claim Modal open */}
                    <IconButton aria-label="view" color="primary" 
                        style={{ borderRadius:'0'}}
                        onClick={() => {handleOpenHowToClaim(application)}}
                    >
                      <EditIcon />
                      <Typography variant="body2" className={classes.iconButtonText}>
                        <Text tid={'Quote.SeeHowToClaim'}/>
                      </Typography>
                    </IconButton>

                    {/* Refund Modal open */}
                    <IconButton aria-label="view" color="primary" 
                        style={{ borderRadius:'0'}}
                        onClick={() => {
                          handleOpenRefundApplication(application
                            // applications.filter(d => (d.app_status === 'Approved' || tableMeta.rowData[17] < 100) 
                            //                           && d.policy === tableMeta.rowData[14] 
                            //                           && d.app_date === tableMeta.rowData[16] 
                            //                           && d.insuredpersons.filter(f => new Date(f.tripEndDate) > current))[0]
                          )
                          }}
                    >
                      <CreditScoreIcon />
                      <Typography variant="body2" className={classes.iconButtonText}>
                        <Text tid={'Quote.SubmitRefund'}/>
                      </Typography>
                    </IconButton>
                  </Grid>

                </Grid>
                {application.insuredpersons && application.insuredpersons.length > 0
                  ? application.insuredpersons.map((insuredPerson, i) => (
                    <Grid item container key={i}>
                      {/* Insurance summary row */}
                      <Grid item container style={{ padding: isMobile ? '1vh' : '0' }}>

                        <Grid item xs={12} sm={4} md={2} lg={2}>
                          <label className={classes.productLable}>Insured Name</label>
                          <span className={classes.inputValue}>{insuredPerson.firstName} {insuredPerson.lastName}</span>
                        </Grid>
                        <Grid item xs={12} sm={8} md={4} lg={4}>
                          <label className={classes.productLable}>Product</label>
                          <span className={classes.inputValue}>{insuredPerson.compnayName} {insuredPerson.planName}</span>                    
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <Grid item container>
                            <Grid item xs={3} >
                              <label className={classes.productLable}>Policy Number</label>
                              <span className={classes.inputValue}>{insuredPerson.policyNo}</span>
                              {/* Benefit PDF open */}
                            </Grid>
                            <Grid item xs={9} >
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
                            {/* Policy Wording PDF open */}
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

                          </Grid>
                        </Grid>

                        {/* detail  */}
                        <Grid item container className={classes.productDetailBox} style={{marginLeft:'1vh'}}>
                          <Grid item xs={6} sm={4} md={2} lg={2} className={classes.productDetailValue}>
                            <label className={classes.productLable}>Sum Insured</label>
                            <span className={classes.inputValue}>{amountFormat(insuredPerson.coverage, 0)}</span>
                          </Grid>
                          <Grid item xs={6} sm={4} md={2} lg={2} className={classes.productDetailValue}>
                            <label className={classes.productLable}>Deductible</label>
                            <span className={classes.inputValue}>{amountFormat(insuredPerson.deductible, 0)}</span>
                          </Grid>
                          <Grid item xs={6} sm={4} md={2} lg={2} className={classes.productDetailValue}>
                            <label className={classes.productLable}>Effetive date</label>
                            <span className={classes.inputValue}>{insuredPerson.tripStartDate}</span>
                          </Grid> 
                          <Grid item xs={6} sm={4} md={2} lg={2} className={classes.productDetailValue}>
                            <label className={classes.productLable}>Expiry date</label>
                            <span className={classes.inputValue}>{insuredPerson.tripEndDate}</span>
                          </Grid> 
                          <Grid item xs={6} sm={4} md={2} lg={2} className={classes.productDetailValue}>
                            <label className={classes.productLable}>Trip period</label>
                            <span className={classes.inputValue}>{insuredPerson.tripPeriod} days</span>
                          </Grid>  
                          <Grid item xs={6} sm={4} md={2} lg={2} className={classes.productDetailValue} style={{ textAlign:isMobile ? 'left': 'right' }}>
                            <label className={classes.productLable}>Premium</label>
                            <span className={classes.inputValue}>{amountFormat(insuredPerson.plan_price, 2)}</span>
                          </Grid>
                        </Grid>

                      </Grid>


                    </Grid>
                )):null}

                

              </Grid>
            ))
          :
            <Grid item container className={classes.productBox}>
              No data found
            </Grid>
        }

      {/* Repurchase Modal */}
      {openRepurchaseApplication === true &&
          // <RenewApplicationModal
          //   renewData={data}
          //   insuraceCompany={data.applicationCompany}
          //   insuraceType={data.insuredPersons[0].eligilbeIns}
          //   applyType={data.application.applicationType}
          //   open={openRepurchaseApplication}
          //   handleClose={setOpenRepurchaseApplication}
          // />
          // <RepurchaseApplication
          //   renewData={data}
          //   insuraceCompany={data.applicationCompany}
          //   insuraceType={data.insuredPersons[0].eligilbeIns}
          //   applyType={data.application.applicationType}
          //   width={width}
          //   isMobile={isMobile}
          //   open={openRepurchaseApplication}
          //   handleClose={setOpenRepurchaseApplication}
          // />
          <RepurchaseModal
            renewData={data}
            open={openRepurchaseApplication}
            handleClose={setOpenRepurchaseApplication}
          />
      }

      {/* Refund Modal */}
      {openRefundApplication === true &&
          <RefundApplicationModal
            refundData={data}
            open={openRefundApplication}
            handleClose={setOpenRefundApplication}
            onConfirm={handleConfirm}
          />
      }


      {/* Active Insurance List */}
      {applications && applications.map((application,index) => (
        <Grid item container key={index}>
          {application.insuredpersons && application.insuredpersons.length > 0
            ? application.insuredpersons.map((insuredPerson, i) => (
          
              <Grid item container key={i} className={classes.productBox}>

                {/* Insurance summary row */}
                <Grid item container style={{ paddingBottom: !isShown ? '1vh' : '0'  }}>
                  <Grid item xs={12} lg={6}>
                    <Typography className={classes.productTitle}>
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
                          onClick={() => { }}
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
                        onClick={() => {
                          // handleOpenHowToClaim(insuredPerson.compnayName, insuredPerson.planName)
                        }}
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
                          // handleRefundRequest(applications, insuredPerson)
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
                  insuranceClaim = {insuranceClaim}
                    open={openHowToClaim}
                    handleClose={setOpenHowToClaim}
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
