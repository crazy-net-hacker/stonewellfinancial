import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { getTravelApplications, mergeZCRMSalesApplication } from '../../../../redux/actions/travelApplicationAction';
import { getFileFromS3, getMultiFilesFromS3 } from '../../../../redux/actions/s3Action';
import { updateTravelApplication } from '../../../../redux/actions/travelApplicationAction';
import { sendEmailToClient } from '../../../../redux/actions/emailAction';
//
import { Typography, Grid, TableCell } from '@material-ui/core'
import MUIDataTable from "mui-datatables";
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
// common customized components
import Criteria from '../../common/Criteria'
import Button from '../../../../components/common/CustomButtons/Button'
import RenewApplicationModal from '../../common/RenewalApplication/RenewModal';
// PDF Viewer
import PDFViewer from "../../../../components/common/PDFViewer/AllPageViewer";
import { download } from '../../../../functionalities/downloadFile';
//
import { dateFormat } from '../../../../controllers/dataFormat';
import { renewalApplication, draftApplication } from '../../../../functionalities/DuplicateApplication';  
//
import { QuoteBanner2 } from '../../../../components/common/QuoteBanner2';
import ProcessUpdateModal from './ProcessUpdateModal'
import TugoPolicySellModal from './TugoPolicySellModal'
import CarewellSellModal from './CarewellSellModal';
import { ViewDetail } from '../../common/SearchApplication/ViewDetail';
import SendEmailForm from '../../common/SearchApplication/SendEmailForm';
// icons
import UpdateIcon from '@material-ui/icons/Update';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import Tooltip from '@mui/material/Tooltip';
import { RiRefund2Fill } from "react-icons/ri";
import { SiSellfy } from "react-icons/si";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// logos
import allianzLogo from '../../../../assets/imgs/logo/allianz-logo.png'
import tugoLogo from '../../../../assets/imgs/logo/tugo-logo.png'
import gmsLogo from '../../../../assets/imgs/logo/gms-logo.png'
import blueCrossLogo from '../../../../assets/imgs/logo/blueCross-logo.png'

//style
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';

const useStyles = makeStyles(dashboardStyles)

//
const formType = [
  { from: 'M', name: 'M.Application'},
  { from: 'O', name: 'P.Quote'},
  { from: 'V', name: 'Vendor'},
  { from: 'C', name: 'Client'},
  { from: 'Z', name :'ZCRM'}
]

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

// status
const codes = [
  { code_name: 'Draft', code_desc: "Draft" },
  { code_name: 'Pending', code_desc: "Pending" },
  // { code_name: 'Accepted', code_desc: "Accepted" },
  { code_name: 'Modifying', code_desc: "Modifying without sending email" },
  { code_name: 'Approved', code_desc: "Approved" },
  // { code_name: 'Renewed', code_desc: "Renewed" }, // will be managed at new field
  { code_name: 'Cancelled', code_desc: "Cancelled" },
  { code_name: 'Void', code_desc: "Void" }
]


// admin
export default function TravelApplication(props) {
  const { match, user, userRole } = props;    
  
  const classes = useStyles();
  const current = new Date()

  const dispatch = useDispatch();

  const applications = useSelector(state => state.travelApplicationReducer.applications)
  const loadingApplication = useSelector(state => state.travelApplicationReducer.loading)

  const mergedResult = useSelector(state => state.travelApplicationReducer.mergedResult)
  const mergedError = useSelector(state => state.travelApplicationReducer.error)
  const mergedLoading = useSelector(state => state.travelApplicationReducer.mergedLoading)

  // policy declaration
  const file = useSelector(state => state.s3Reducer.file)
  const loading = useSelector(state => state.s3Reducer.loading)
  const error = useSelector(state => state.s3Reducer.error)

  // policy declaration
  const multiFiles = useSelector(state => state.s3Reducer.multiFiles)
  const multiFilesLoading = useSelector(state => state.s3Reducer.multiFilesLoading)
  const multiFilesError = useSelector(state => state.s3Reducer.multiFilesError)

  // sending email policy to client (insured)
  const sendEmailResult = useSelector(state => state.emailReducer.result)
  const sendEmailLoading = useSelector(state => state.emailReducer.loading)
  const sendEmailError = useSelector(state => state.emailReducer.error)
 
  // update
  const updateResult = useSelector(state => state.travelApplicationReducer.updatedApplication)
  const updateError = useSelector(state => state.travelApplicationReducer.error)
  const updateLoading = useSelector(state => state.travelApplicationReducer.UpdatedLoading)

  // run useEffect only once when first render
  const [isLoaded, setIsLoaded] = useState(false)

  // criteria
  const [criteriaData, setCriteriaData] = useState({
    // fromDate: new Date().toISOString().substring(0,8)+'01',
    fromDate: new Date().toISOString().substring(0,10),
    toDate: new Date().toISOString().substring(0,10)
  })

  // update status modal
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateData, setUpdateData] = useState([]);

  // sell Tugo Policies modal
  const [sellTugoPolicyOpen, setSellTugoPolicyOpen] = useState(false);
  const [sellTugoPolicyData, setSellTugoPolicyData] = useState([]);

  // sell Carewell modal
  const [sellCarewellOpen, setSellCarewellOpen] = useState(false);
  const [sellCarewellData, setSellCarewellData] = useState([]);

  const [selectedRows, setSelectedRows] = useState()
  const [currntPage, setCurrntPage] = useState(0)
  
  const [alertOpen, setAlertOpen] = useState(false)
  const [alert, setAlert] = useState('')

  // PDF Viewer
  const [openPDFViewer, setOpenPDFViewer] = useState(false);
  const [filePDF, setFilePDF] = useState([])
  const [viewType, setViewType] = useState('')

  // Send Email Policy
  const [openSendEmail, setOpenSendEmail] = useState(false)
  const [sendEmailData, setSendEmailData] = useState({})

  // Origin data before create renew data
  const [originData, setOriginData] = useState([]);

  // Renew (Repurchase) application modal
  const [data, setData] = useState([]);
  const [openRepurchaseApplication, setOpenRepurchaseApplication] = useState(false);


  // get application list
  const getSearchResult = useCallback(() => {
    dispatch(getTravelApplications({fr:criteriaData.fromDate,to:criteriaData.toDate, vendor_id:'*'}))
  }, [dispatch, criteriaData]);
    
  // run useEffect only once when first render
  useEffect(() => {
    if(isLoaded === false){
      getSearchResult()
      setIsLoaded(true)
    }
  }, [getSearchResult, isLoaded]);


  // merge ZCRM Sales to ZApplications
  function mergeZSales() {
    setAlertOpen(true)
    dispatch(mergeZCRMSalesApplication())
  }

  // update status & policy number
  function updateApplication(applicationID){
    setUpdateData(applications.filter(d => d.application_id === applicationID ))
    setUpdateOpen(true)
  };

  // sell Tugo policy
  function sellTugoPolicy(applicationID){
    const targetApplication= applications.filter(d => d.application_id === applicationID)[0]
    const tugoInsuredData =  Object.assign({}, targetApplication);
    
    if (tugoInsuredData.insuredpersons.filter(p => p.compnayName === 'Tugo').length>0){
      tugoInsuredData.insuredpersons = tugoInsuredData.insuredpersons.filter(p => p.compnayName === 'Tugo');
    }else{
      tugoInsuredData.insuredpersons = [];
    };


  // console.log('tugoInsuredData',tugoInsuredData)
    setSellTugoPolicyData(tugoInsuredData)
    setSellTugoPolicyOpen(true)

  };

  // sell Carewell
  function sellCarewell(applicationID){
    const targetApplication= applications.filter(d => d.application_id === applicationID)[0]
    const carewellData =  Object.assign({}, targetApplication);
    
    if (carewellData.insuredpersons.filter(p => p.carewellService).length > 0){
      carewellData.insuredpersons = carewellData.insuredpersons.filter(p => p.carewellService);
    }else{
      carewellData.insuredpersons = [];
    };


    // console.log('carewellData',carewellData)
    setSellCarewellData(carewellData)
    setSellCarewellOpen(true)

  };

  // re get application list after updating
  function handleConfirm(resultMessage){
    // console.log("pop up update message ")
    if (resultMessage === 'success'){
      getSearchResult()
    }

  };

  // get Policy declaration
  function getDocumentFromS3(viewType,file_name, selectedRow){
    setSelectedRows(selectedRow)
    setFilePDF(file_name.split('/'))
    setViewType(viewType)
    setOpenPDFViewer(true)
    dispatch(getFileFromS3({type:file_name.split('/')[0], fileName:file_name.split('/')[1]})) 
  }

  // get Policy declaration file
  function getFiles(type, policyFiles, email, applicationId, selectedRow, vendorEmail){
    setSelectedRows(selectedRow)
    dispatch(getMultiFilesFromS3({type:type, fileName:policyFiles})) 
    setOpenSendEmail(true)
    setSendEmailData({ from: 'info@stonewellfinancial.com',
                        to: email,
                        bcc: vendorEmail,
                        type:'Application',
                        applicationId : applicationId,
                        user:user
    })
  }

  // send ApprovedConfirmation email to insured (without view sendEmailForm) 
  function sendApprovedConfirmationEmail(applicationId, selectedRow){
    setSelectedRows(selectedRow)
    const data = { sourceType: 'Travel',
                    contentType:'ApprovedConfirmation',
                    applicationId : applicationId,
                    user:user
                    }
    dispatch(sendEmailToClient(data))
    setAlert('SendEmail')
    setAlertOpen(true)
  }


  // send policy / confirmation email to insured 
  function handleSendingEmail(data){
    dispatch(sendEmailToClient(data))
    setAlert('SendEmail')
    setOpenSendEmail(false)
    // showResultMessage()
    setAlertOpen(true)
  }

  // update contact & address 
  function UpdateContactInfo(target, data, selectedRow){
    setSelectedRows(selectedRow)
    dispatch(updateTravelApplication({update_target: target, application_id:data.application_id, data: data}))
    setAlert('Update')
    showResultMessage()
    getSearchResult()
  }

  // show Updating (conatct, address info) Result Message
  function showResultMessage() {
    setAlertOpen(true)
    setTimeout(() => {
        setAlertOpen(false)
    }, 7000);
  }

  // Renew (Repurchase) application modal 
  const handleOpenRepurchaseApplication = (application) => {
    setData(renewalApplication(application, user, true, 'ADM'))
    setOpenRepurchaseApplication(true)
  }
  

  // sort based on relationship,  ZCRM applications - based on birth date
  applications && applications.map(row=>
    row.insuredpersons.length>0 && row.insuredpersons.sort((a,b)=> (row.source_from==='Z'?(new Date(a.birthdate)):sortNumber(a.relationship)) - (row.source_from==='Z'?(new Date(b.birthdate)):sortNumber(b.relationship)))
  )

  //
  const group = (type, insuredpersons) => {
    const docObj = Object.create(null);
    const docGroup = [];
    if(type === 'tripDate'){
    insuredpersons.forEach(function (o) {
      var key = ['tripStartDate', 'tripEndDate'].map(function (k) { return o[k]; }).join('|');
      if (!docObj[key]) {
        docObj[key] = {tripStartDate: o.tripStartDate, 
                        tripEndDate: o.tripEndDate};
        docGroup.push(docObj[key]);
      }
    });
    } else if(type === 'insurancePlan'){
      insuredpersons.forEach(function (o) {
        var key = ['compnayName', 'eligilbeIns'].map(function (k) { return o[k]; }).join('|');
        if (!docObj[key]) {
          docObj[key] = {companyName: o.compnayName, 
                        eligilbeIns: o.eligilbeIns};
          docGroup.push(docObj[key]);
        }
      });  
    }
  
    return (docGroup.length===1?true:false)
  }  
  

  //
  const columns = getColumns()

  const applicationData = applications 
    ? applications.map(row => {
        const updatedRow = {
          ...row,
          applicationID: row.application_id,
          applicationDate: dateFormat(new Date(row.app_date+'T00:00:00')),
          vendor: row.vendor_name ? row.vendor_name : '',
          sourceFrom: formType.filter(f=>f.from===row.source_from).map(form=>form.name)[0],
          insuredGroupType: row.insured_group_type,
          // insureds: row.insuredpersons[0] ?  row.insuredpersons.map(i=>{return(`${i.firstName} ${i.lastName} ${dateFormat(new Date(row.insuredpersons[0].birthdate+'T00:00:00'))} ${i.compnayName} ${i.eligilbeIns}` )}): null,
          insureds: row.insuredpersons[0] ?  row.insuredpersons.map(i=>{return(`${i.firstName} ${i.lastName}` )}): [],
          insuredName: row.insuredpersons[0] ?  row.insuredpersons.map(i=>{return{firstName:i.firstName, lastName: i.lastName, refundRequestDate: i.refundRequestDate}}): [],
          birthdate: row.insuredpersons[0] ? row.insuredpersons.map((i)=>dateFormat(new Date(i.birthdate+'T00:00:00'))): [],
          companyName:row.insuredpersons[0]? row.insuredpersons.map(i=>i.compnayName) : [],
          insuredType: row.insuredpersons[0]? row.insuredpersons.map(i=>i.eligilbeIns.charAt(0).toUpperCase() + i.eligilbeIns.substr(1).toLowerCase()) : [],
          isInsuredTypeSame: row.insuredpersons[0] ? group('insurancePlan',row.insuredpersons):null,
          tripStartDate: row.insuredpersons[0] ? row.insuredpersons.map((i)=>dateFormat(new Date(i.tripStartDate+'T00:00:00')) ): [],
          tripEndDate: row.insuredpersons[0] ? row.insuredpersons.map((i)=>dateFormat(new Date(i.tripEndDate+'T00:00:00')) ): [],
          isTripDateSame: row.insuredpersons[0] ? group('tripDate',row.insuredpersons):null,
          renewal : row.renewal,      
          status :row.app_status,
        };
        return updatedRow;
      })
    : [];

  
  // Column definitions
  function getColumns(){
    const columns=[
        {name: "applicationID", label: "App #", 
          options: {filter: false},
        },
        {name: "applicationDate", label: 'App Date',
          options: {filter: false}
        },
        {name: "vendor", label: 'Agency',
        },
        {name: "sourceFrom", label: 'Source',
        },      
        {name: "insuredName", label: 'Name',
          options: {filter: false,
            customBodyRender: (value, tableMeta) => {
              return (
                <>
                {value.map((i, index)=> <div key={index}>{`${i.firstName} ${i.lastName}`} {i.refundRequestDate?<RiRefund2Fill style={{color: "#FF3333"}}/>:null}</div>)}
                </>
              );
            }
          }
        },
        {name: "birthdate", label: 'DOB',
          options: {filter: false,
            customBodyRender: (value, tableMeta) => {
              return (
                <>
                  { value.map((i, index)=> <div key={index}>{i} </div>)}
                </>
              );
            }
          }
        },
        {name: "companyName", label: 'company',
          options: { display: false}
        },
        {name: "insuredType", label: 'Product',
          options: { filter: true,
            customBodyRender: (value, tableMeta) => {
              var companyName = tableMeta.rowData[6];
              return (
                <>
                {value.map((insType, index)=> 
                  // <React.Fragment key={index}>
                  <div key={index}>
                    {index>0 && tableMeta.rowData[16]===true
                      ? null
                      :
                        <>
                        {(companyName[index]==='Tugo' || companyName[index]==='Allianz'
                          || companyName[index]==='GMS'|| companyName[index]==='BlueCross') 
                          ?
                            <img
                              src={companyName[index] === 'Tugo'
                                    ? tugoLogo : companyName[index] === 'Allianz'
                                      ? allianzLogo : companyName[index] === 'GMS'
                                        ? gmsLogo: blueCrossLogo}
                              // src={logo}
                              style={{ width: 20 }}
                              alt='logo'
                            />
                          : companyName[index]
                        } 
                        {insType}
                        {tableMeta.rowData[14]==='Family'?' (F)':''}
                        </>
                    }
                  </div>)}
                  {/* </React.Fragment>)} */}
                  
              </>
              );
            }
          }          
        },
        {name: "tripStartDate", label: 'Effective Date',
          options: {filter: false,
            customBodyRender: (value, tableMeta) => {
              return (
                <>
                {tableMeta.rowData[17]===true
                  ? value[0]
                  : value.map((i, index)=> <div key={index}>{i} </div>)
                }
                </>
              );
            }
          }
        },
        {name: "tripEndDate", label: 'Expiry Date',
          options: {filter: false,
            customBodyRender: (value, tableMeta) => {
              return (
                <>
                {tableMeta.rowData[17]===true
                  ? value[0]
                  : value.map((i, index)=> <div key={index}>{i} </div>)
                }
                </>
              );
            }
          }
        },  
        {name: "renewal", label: "Repurchased", 
          options: { display: false,
            customBodyRender: (value, tableMeta, updateValue) => {
              return (
                value=== true? <CheckIcon/>:null
              );
            }
          }
        },
        {name: "status", label: 'Status',
          options: { 
            customBodyRender: (value, tableMeta, updateValue) => {
              return (
                <React.Fragment>
                  <div style={{color: (value.slice(0,6)==='Refund' || value.slice(0,6)==='Reject')?'#FF3333':null}}>
                    {value}
                  </div>
                  {(value === 'Draft'||value === 'Modifying') &&
                      <Tooltip title="continue edit" enterTouchDelay={0}>
                        <IconButton aria-label="edit" variant="outlined" color="primary"
                          onClick={()=>{
                            props.history.push({
                              pathname: (value==='Draft'
                                          ?`/myportal/admin/new-application/${tableMeta.rowData[7]?tableMeta.rowData[7][0].toLowerCase():''}`
                                          :`/myportal/admin/application/${tableMeta.rowData[7]?tableMeta.rowData[7][0].toLowerCase():''}/modify`
                              ),
                              state: {
                                savedData: draftApplication(applications.filter(d => d.application_id === tableMeta.rowData[0])) 
                              }
                            })
                          }}
                        >
                          <EditIcon/>
                        </IconButton>
                      </Tooltip>
                  }
                </React.Fragment>                  
              );
            },
          }
        },
        {name: "update", label: 'Update Process',
          options: { filter: false, sort: false, empty: true, download: false, print: false,
            customHeadRender: (columnMeta) => {
              return(
                <TableCell key={columnMeta.label} style={{ fontSize:'12px', fontWeight:'600'}}>
                  {columnMeta.label}
                </TableCell>
              );
            },
            customBodyRender: (value, tableMeta, updateValue) => {
              return (
                  <IconButton aria-label="edit" variant="outlined" color="primary" 
                      // disabled = {( === 'Accepted')? false : true}
                      disabled = {tableMeta.rowData[3] === 'ZCRM' 
                                    ? true
                                    :(tableMeta.rowData[11] === 'Draft'|| tableMeta.rowData[11] === 'Modifying'|| tableMeta.rowData[11].slice(0,1) === 'R'
                                      || tableMeta.rowData[9].filter(f=>new Date(f)> current).length===0)
                                      ? true : false}
                      onClick={() =>{ 
                            setSelectedRows(tableMeta.rowIndex)  
                            updateApplication(tableMeta.rowData[0])
                      }}>
                    <UpdateIcon/>
                    {/* {tableMeta.rowData[9].filter(f=>f>new Date())} */}
                  </IconButton>
              );
            }
          }
        }, 
        {name: "policy", label: 'policy',
          options: {filter: false, display: false, download: false, print: false,}
        },
        {name: "insuredGroupType", label: 'insuredGroupType',
          options: {filter: true, display: false, download: false, print: false,}
        },
        // hidden column for only search
        {name: "insureds", label: 'insureds', 
          options: {filter: false, display: false,  download: false, print: false}
        },
        {name: "isInsuredTypeSame", label: 'isInsuredTypeSame', 
          options: {filter: false, display: false,  download: false, print: false}
        },
        {name: "isTripDateSame", label: 'isTripDateSame', 
          options: {filter: false, display: false,  download: false, print: false}
        },
        {name: "app_date", label: 'appDate',
          options: {filter: false, display: false, download: false, print: false}
        },
        {name: "sell_tugo_policy", label: 'Sell Tugo Policy', 
          options: { filter: false, sort: false, empty: true, download: false, print: false, 
            customHeadRender: (columnMeta) => {
              return(
                <TableCell key={columnMeta.label} style={{ fontSize:'12px', fontWeight:'600'}}>
                  {columnMeta.label}
                </TableCell>
              );
            },
            customBodyRender: (value, tableMeta, updateValue) => {
              return (
                  <IconButton aria-label="repurchase" variant="outlined" color="primary" 
                      disabled = {(tableMeta.rowData[11] === 'Pending' 
                                    && tableMeta.rowData[6].filter(f=>f==='Tugo').length>0) 
                                    && tableMeta.rowData[9].filter(f=>new Date(f)> current).length>0
                                    && applications.filter(d => d.application_id === tableMeta.rowData[0])[0].insuredpersons.filter(p => p.compnayName === 'Tugo' && !p.policyNo).length>0
                                      ?false:true}
                      onClick={() => {
                        setSelectedRows(tableMeta.rowIndex)
                        sellTugoPolicy(tableMeta.rowData[0])
                      }}
                  >
                    <SiSellfy />
                  </IconButton>
              );
          }
          }
        },
        {name: "sell_carewell", label: 'Sell Carewell', 
          options: { filter: false, sort: false, empty: true, download: false, print: false, 
            customHeadRender: (columnMeta) => {
              return(
                <TableCell key={columnMeta.label} style={{ fontSize:'12px', fontWeight:'600'}}>
                  {columnMeta.label}
                </TableCell>
              );
            },
            customBodyRender: (value, tableMeta, updateValue) => {
              return (
                  <IconButton aria-label="repurchase" variant="outlined" color="primary" 
                      disabled = {(tableMeta.rowData[11] === 'Pending' 
                                    // && tableMeta.rowData[6].filter(f=>f==='Tugo').length>0) 
                                    && tableMeta.rowData[9].filter(f=>new Date(f)> current).length>0
                                    && applications.filter(d => d.application_id === tableMeta.rowData[0])[0].insuredpersons.filter(p => p.carewellService && !p.carewellPolicyNo).length > 0 )
                                      ?false:true}
                      onClick={() => {
                        setSelectedRows(tableMeta.rowIndex)
                        sellCarewell(tableMeta.rowData[0])
                      }}
                  >
                    <SiSellfy/>
                  </IconButton>
              );
          }
          }
        },
        {name: "repurchase", label: 'Repurchase', 
          options: { filter: false, sort: false, empty: true, download: false, print: false, 
            customHeadRender: (columnMeta) => {
              return(
                <TableCell key={columnMeta.label} style={{ fontSize:'12px', fontWeight:'600'}}>
                  {columnMeta.label}
                </TableCell>
              );
            },
            customBodyRender: (value, tableMeta, updateValue) => {
              return (
                  <IconButton aria-label="repurchase" variant="outlined" color="primary" 
                      disabled = {(tableMeta.rowData[11] === 'Approved' || tableMeta.rowData[11].slice(0,6)==='Refund'||tableMeta.rowData[11]==='Void')?false:true}
                      // disabled = {true}
                      onClick={() => {
                        // console.log(applications)
                        setSelectedRows(tableMeta.rowIndex)
                        if(tableMeta.rowData[3] !== 'ZCRM'){
                          handleOpenRepurchaseApplication(applications.filter(d => d.application_id === tableMeta.rowData[0])[0])
                          setOriginData(applications.filter(d => d.application_id === tableMeta.rowData[0])[0])
                        }else{
                          handleOpenRepurchaseApplication(applications.filter(d => d.policy === tableMeta.rowData[13] && d.app_date === tableMeta.rowData[18])[0])
                          setOriginData(applications.filter(d => d.policy === tableMeta.rowData[13] && d.app_date === tableMeta.rowData[18])[0])
                        }
                      }}
                  >
                    <ShoppingCartIcon/>
                  </IconButton>
              );
          }
          }
        },
      ]
    return (columns)
  }

  const options = {
    filter: true,
    filterType: "dropdown",
    // filterType: 'checkbox',
    selectableRows: 'none',  //'multiple',
    // responsive: "vertical",
    responsive: "standard",
    // rowStyle: {height: 30},
    rowsPerPage: 20,
    rowsPerPageOptions:[20,40,60,100],
    jumpToPage: true,
    viewColumns: false,
    download: false,
    // print: true,   
    page: currntPage,
    onChangePage (currentPage) {
      setCurrntPage(currentPage);
    },
    textLabels: {
      body: {
        noMatch: '', //'no matching records found',
      }
    },
    // Search ALL columns, including hidden fields that use display:false
    customSearch: (searchQuery, currentRow, columns) => {
      let isFound = false;
      currentRow.forEach(col => {
        if (col && col.toString().toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0) {
          isFound = true;
        }
      });
      return isFound;
    },    
    // setRowProps: (row, index) => { 
    //   return { style: { backgroundColor: row[11].slice(0,8)==='Refunded'? '#FF6666': null, }, }; },
    expandableRows: true,
    // expandableRowsOnClick: true,
    // onRowClick: (rowData) => {
    //   console.log(rowData);
    // },
    rowsExpanded: [selectedRows],
    renderExpandableRow: (rowData, rowMeta) => { 
      const clickedData = rowData[3] !== 'ZCRM'
                            ? (applications.filter(d => d.application_id === rowData[0]))[0]
                            : (applications.filter(d => d.policy === rowData[13]))[0]
      return (
        clickedData &&
        <tr>
          <td colSpan={15}>
          {/* <td colSpan={15} ref={scrollRef}> */}
            {!updateError && !updateLoading && updateResult && alert==='Update' && alertOpen && selectedRows ===rowMeta.dataIndex &&(
              <>
                {/* result of update */}
                {updateResult.message === 'success'
                  ?
                    <Alert severity="success" onClose={() => setAlertOpen(false)}>     
                      <AlertTitle>Success</AlertTitle>
                        The update has been completed successfully.
                    </Alert>
                  :
                    <Alert severity="error">
                      <AlertTitle>Error</AlertTitle>
                        Something went wrong. 
                    </Alert>
                }
              </>
            )}
            {/* result of sending email */}
            {sendEmailLoading
              ?
                <Alert severity='info'>   
                    <AlertTitle>Processing</AlertTitle>
                      Sending email...
                </Alert>
              :null
            }
            {!sendEmailError && !sendEmailLoading && sendEmailResult && alert==='SendEmail' && alertOpen && selectedRows ===rowMeta.dataIndex &&(
                  <Alert severity={sendEmailResult.status} 
                          onClose={() => {
                            setAlertOpen(false)
                            if (sendEmailResult.status ==='success'){
                                getSearchResult()
                            }
                          }}
                  >   
                    <AlertTitle>{sendEmailResult.status}</AlertTitle>
                    {sendEmailResult.message}
                  </Alert>
            )}
 
            <ViewDetail
              vendorID = {'*'}
              clickedData = {clickedData} 
              url = {match.url}
              sourceFrom = {rowData[3]}
              selectedRow = {rowMeta.dataIndex}
              getDocument = {getDocumentFromS3}
              getFiles = {getFiles}
              updateContact = {UpdateContactInfo}
              sendApprovedConfirmationEmail = {sendApprovedConfirmationEmail}
            />
            <hr />
          </td>
    
        </tr>
      );
    },
  };
  

  return (
    <Grid container>
      <Grid item container style={{ marginTop:'-37px' }}>         
          <QuoteBanner2 title={'Dashboard.SearchApplications'} subTitle={'Dashboard.SearchApplications.SubTitle'} links={[]}/>
        </Grid>  
        {/* <Grid item container style={{ margin:'5vh 5vh 4vh' }}> */}
        {/* <Grid item container style={{ margin:'5vh 5vh 0' }}>
          <Typography className={classes.dashboardPageTitle}>
            Travel Insurance
          </Typography>
        </Grid> */}
        <Grid item container style={{ justifyContent:'end', margin:'0 5vh 0'}}>
            <Button color="primary" 
                style={{display:(mergedLoading?'none':null)}}
                onClick={() => { mergeZSales()}}
            >
              Merge ZCRM Sales
            </Button>
             {/* result of merged */}
            {mergedLoading
              ?
              <Grid item xs={12}>
                <Alert severity='info'>   
                    <AlertTitle>Processing</AlertTitle>
                      Being merged... 
                </Alert>
              </Grid>
              :null
            }
            {!mergedError && !mergedLoading && mergedResult.status && alertOpen && (
              <Grid item xs={12}>
                <Alert severity={mergedResult.status} 
                        onClose={() => {
                            setAlertOpen(false)
                            if (mergedResult.date){getSearchResult()}
                        }}
                >     
                  <AlertTitle>{mergedResult.status}</AlertTitle>
                  {mergedResult.message }
                </Alert>
              </Grid>
            )} 

          </Grid>
        <Grid item container style={{ padding:'1vh 5vh 5vh'}}>
          {loadingApplication 
            ? <CircularProgress />
            : <MUIDataTable
                title= {
                  <div>
                    <Grid item container style={{ margin:'2vh 0' }}>
                          <Typography className={classes.tableTitle}>
                            Application List
                          </Typography>
                    </Grid>
                    <Criteria
                      criteriaData = {criteriaData}
                      setCriteriaData = {setCriteriaData}
                      onClick ={getSearchResult}
                    />
                  </div>    
                  }
                data={applicationData}
                columns={columns}
                options={options}
              />
          }
        </Grid>

        {/* update Process */}
        {updateData[0] &&
          <ProcessUpdateModal
            updateData={updateData}
            // statusProcess = {updateData[0].app_status}
            statusCodes={codes}
            user={user}
            open={updateOpen}
            setOpen={setUpdateOpen}
            onConfirm={handleConfirm}
          /> 
        }

        {/* sell Tugo Policies */}
        {sellTugoPolicyData &&
          <TugoPolicySellModal
            sellTugoPolicyData={sellTugoPolicyData}
            user={user}
            open={sellTugoPolicyOpen}
            setOpen={setSellTugoPolicyOpen}
            onConfirm={handleConfirm}
          /> 
        }

        {/* sell Carewell */}
        {sellCarewellData &&
          <CarewellSellModal
            sellCarewellData={sellCarewellData}
            user={user}
            open={sellCarewellOpen}
            setOpen={setSellCarewellOpen}
            onConfirm={handleConfirm}
          /> 
        }

        {/* Repurchase Modal */}
        {openRepurchaseApplication === true &&
          <RenewApplicationModal
            renewData={data}
            originData ={originData}
            insuraceCompany={data.applicationCompany}
            insuraceType={data.insuredPersons[0].eligilbeIns}
            applyType={data.application.applicationType}
            userRole={userRole}
            open={openRepurchaseApplication}
            handleClose={setOpenRepurchaseApplication}
          />
        }

        {/* pdf viewer  */}
        {!error && !loading && file && file.Body && openPDFViewer === true && (
          viewType === 'view' 
          ?
            <PDFViewer
              title={'Policy'}
              pdf={new Uint8Array(file.Body.data).buffer} 
              openPDFViewer={openPDFViewer}
              setOpenPDFViewer={setOpenPDFViewer}
            />
          :
          <>
            {setOpenPDFViewer(download(new Blob([new Uint8Array(file.Body.data).buffer], {type: 'application/pdf'}), filePDF[1]))}
          </>
        )}

        {!multiFilesError && !multiFilesLoading && multiFiles && multiFiles.files && multiFiles.files.length > 0 && openSendEmail === true &&
        <SendEmailForm
            data={sendEmailData}
            attachments = {multiFiles.files}
            open = {openSendEmail}
            handleClose = {setOpenSendEmail}
            onSendingEmail={handleSendingEmail}
        /> 
        }
    

    </Grid>
  );
}