import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { getFileFromS3, getMultiFilesFromS3 } from '../../../../redux/actions/s3Action';
import { updateTravelApplication } from '../../../../redux/actions/travelApplicationAction';
import { sendEmailToClient } from '../../../../redux/actions/emailAction';
//
import { Typography, Grid, TableCell,
        Radio, RadioGroup, FormControlLabel, FormControl,
 } from '@material-ui/core'
import MUIDataTable from "mui-datatables";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
// common customized components
import Criteria from '../../common/Criteria'
import RenewApplicationModal from '../../common/RenewalApplication/RenewModal';
import RefundApplicationModal from '../../common/RefundApplication/RefundModal';
import { ViewDetail } from '../../common/SearchApplication/ViewDetail';
import SendEmailForm from '../../common/SearchApplication/SendEmailForm';
import { Text } from '../../../../components/common/LanguageProvider'

// PDF Viewer
import PDFViewer from "../../../../components/common/PDFViewer/AllPageViewer";
import { download } from '../../../../functionalities/downloadFile';
//
import { dateFormat } from '../../../../controllers/dataFormat';
import { renewalApplication, draftApplication } from '../../../../functionalities/DuplicateApplication'; 
// icons
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@material-ui/icons/Edit';
import { RiRefund2Fill } from "react-icons/ri";
import ArticleIcon from '@mui/icons-material/Article';

// logos
import allianzLogo from '../../../../assets/imgs/logo/allianz-logo.png'
import tugoLogo from '../../../../assets/imgs/logo/tugo-logo.png'
import gmsLogo from '../../../../assets/imgs/logo/gms-logo.png'
import blueCrossLogo from '../../../../assets/imgs/logo/blueCross-logo.png'

// Import the chip component frfom Material UI or a 
// custom component of your choosing:
import Chip from '@material-ui/core/Chip';
// Import the TableFilterList from mui-datatables:
import { TableFilterList } from "mui-datatables";

//style
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';

const useStyles = makeStyles(dashboardStyles)

const formType = [
  { from: 'M', name: 'M.Application'},
  { from: 'O', name: 'P.Quote'},
  { from: 'V', name: 'Vendor'},
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


      

export const ApplicationList = (props) => {
    const { url, history, user, vendorID, vendorEmail, 
            periodType, setPeriodType, criteriaData, setCriteriaData, applications, getSearchResult, 
            selectedRows, setSelectedRows, currntPage, setCurrntPage, onAlert, setOnAlert, alertOpen, setAlertOpen,
            onPage, filterStatus, searchTextID } = props; 

  const classes = useStyles();
  const current = new Date() 
  
  const dispatch = useDispatch();

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
  

  // PDF Viewer
  const [openPDFViewer, setOpenPDFViewer] = useState(false);
  const [filePDF, setFilePDF] = useState([])
  const [viewType, setViewType] = useState('')

  // Send Email Policy
  const [openSendEmail, setOpenSendEmail] = useState(false)
  const [sendEmailData, setSendEmailData] = useState(false)
  
  // Renew (Repurchase) application modal
  const [data, setData] = useState([]);
  const [openRepurchaseApplication, setOpenRepurchaseApplication] = useState(false);

  // Refund application modal
  const [openRefundApplication, setOpenRefundApplication] = useState(false);

  // get Policy declaration
  function getDocumentFromS3(viewType,file_name, selectedRow){
    setSelectedRows(selectedRow)
    setFilePDF(file_name.split('/'))
    setViewType(viewType)
    setOpenPDFViewer(true)
    dispatch(getFileFromS3({type:file_name.split('/')[0], fileName:file_name.split('/')[1]})) 
  }

  
  // get Policy declaration file
  function getFiles(type, policyFiles, email, applicationId, selectedRow){
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

  // send policy email to insured 
  function handleSendingEmail(data){
    dispatch(sendEmailToClient(data))
    setOnAlert('SendEmail')
    setOpenSendEmail(false)
    // showResultMessage()
    setAlertOpen(true)
  }

  // update contact & address 
  function UpdateContactInfo(target, data, selectedRow){
    setSelectedRows(selectedRow)
    dispatch(updateTravelApplication({update_target: target, application_id:data.application_id, data: data}))
    setOnAlert('Update')
    showResultMessage()
    getSearchResult()
  }

  // show Updating (conatct, address info) Result Message
  function showResultMessage() {
    // scrollToElement();
    setAlertOpen(true)
    setTimeout(() => {
        setAlertOpen(false)
        setOnAlert('')
    }, 7000);
  }

  // Renew (Repurchase) application modal 
  const handleOpenRepurchaseApplication = (application) => {
    setData(renewalApplication(application, user, true))
    setOpenRepurchaseApplication(true)
  }


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
              // companyName: p.compnayName,
              insuranceCompany: p.compnayName,
              planName: p.planName,
              // policyNo: p.policyNo,
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

  // sort based on relationship,  ZCRM applications - based on birth date
  applications && applications.map(row=>
    row.insuredpersons.length>0 && row.insuredpersons.sort((a,b)=> (row.source_from==='Z'?(new Date(a.birthdate)):sortNumber(a.relationship)) - (row.source_from==='Z'?(new Date(b.birthdate)):sortNumber(b.relationship)))
  )

  // group columns
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

  // custom chip component
  const CustomChip = ({ label, onDelete }) => {
    // const CustomChip = ({ label }) => {
        return (
            <Chip
                style={{ marginLeft: '1vh'}}
                variant="outlined"
                color="primary"
                label={label}
                // onDelete={onDelete}
                onDelete={onPage==='Dashboard'?null:onDelete}
            />
        );
    };
        
  // custom filter list component
  // the custom filter chips:
  const CustomFilterList = (props) => {
    return <TableFilterList {...props} ItemComponent={CustomChip} />;
  };
    

  // columns
  const columns = getColumns()

  const applicationData = applications && applications.map(row => {
    const updatedRow = {
      ...row,
      applicationID: row.application_id,
      applicationDate: dateFormat(new Date(row.app_date+'T00:00:00')),
      vendor: row.vendor_name ? row.vendor_name : '',
      sourceFrom: formType.filter(f=>f.from===row.source_from).map(form=>form.name)[0],
      insuredGroupType: row.insured_group_type,
      insureds: row.insuredpersons[0] ?  row.insuredpersons.map(i=>{return(`${i.firstName} ${i.lastName} ${dateFormat(new Date(row.insuredpersons[0].birthdate+'T00:00:00'))} ${i.compnayName} ${i.eligilbeIns}` )}): [],
      insuredName: row.insuredpersons[0] ?  row.insuredpersons.map(i=>{return{firstName:i.firstName, lastName: i.lastName, refundRequestDate: i.refundRequestDate}}): [],
      birthdate: row.insuredpersons[0] ? row.insuredpersons.map((i)=>dateFormat(new Date(i.birthdate+'T00:00:00'))): [],
      companyName:row.insuredpersons[0]? row.insuredpersons.map(i=>i.compnayName) : [],
      insuredType: row.insuredpersons[0]? row.insuredpersons.map(i=>i.eligilbeIns.charAt(0).toUpperCase() + i.eligilbeIns.substr(1).toLowerCase()) : [],
      isInsuredTypeSame: row.insuredpersons[0] ? group('insurancePlan',row.insuredpersons):null,
      tripStartDate: row.insuredpersons[0] ? row.insuredpersons.map((i)=>dateFormat(new Date(i.tripStartDate+'T00:00:00')) ): [],
      tripEndDate: row.insuredpersons[0] ? row.insuredpersons.map((i)=>dateFormat(new Date(i.tripEndDate+'T00:00:00')) ): [],
      isTripDateSame: row.insuredpersons[0] ? group('tripDate',row.insuredpersons):null,
      email : row.email,      
      status :row.app_status,
      rateOfRefundRequested: ( parseInt(row.refund_requested_num?row.refund_requested_num:0) / row.insuredpersons.length) * 100
    };
    return updatedRow;
  });

  
  // Column definitions
  function getColumns(){
    const columns=[
        {name: "applicationID", label: "App #", 
          options: {filter: false, display: true, download: false, print: false},
        },
        {name: "applicationDate", label: Text({tid:'Dashboard.Table.ApplicationDate'}),
          options: {filter: false}
        },
        {name: "vendor", label: 'Agency',
          options: {filter: false, display: false, download: false, print: false}
        },
        {name: "sourceFrom", label: 'Source',
          options: {filter: false, display: false, download: false, print: false}
        },
        {name: "insuredName", label: Text({tid:'Dashboard.Table.Name'}),
          options: {filter: false,
            customBodyRender: (value) => {
              return (
                <>
                {value.map((i, index)=> <div key={index}>{`${i.firstName} ${i.lastName}`} {i.refundRequestDate?<RiRefund2Fill style={{color: "#FF3333"}}/>:null}</div>)}
                </>
              );
            }
          }
        },
        {name: "birthdate", label: Text({tid:'Dashboard.Table.DateOfBirth'}),
          options: {filter: false,
            customBodyRender: (value,) => {
              return (
                <>
                  { value.map((i, index)=> <div key={index}>{i} </div>)}
                </>
              );
            }
          }
        },
        {name: "companyName", label: Text({tid:'Quote.InsuranceCompany'}),
          options: { display: false}
        },
        {name: "insuredType", label: Text({tid:'Dashboard.Table.Insurance'}),
          options: { filter: true,
            customBodyRender: (value, tableMeta) => {
              var companyName = tableMeta.rowData[6];
              return (
                <>
                {value.map((insType, index)=> 
                  // <React.Fragment key={index}>
                  <div key={index}>
                    {index>0 && tableMeta.rowData[19]===true
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
                        {tableMeta.rowData[15]==='Family'?' (F)':''}
                        </>
                    }
                  </div>)}
                  {/* </React.Fragment>)} */}
              </>
              );
            }
          }
        },
        {name: "tripStartDate", label: Text({tid:'Dashboard.Table.EffectiveDate'}),
          options: {filter: false,
            customBodyRender: (value, tableMeta) => {
              return (
                <>
                {tableMeta.rowData[20]===true
                  ? value[0]
                  : value.map((i, index)=> <div key={index}>{i} </div>)
                }
                </>
              );
            }
          }
        },
        {name: "tripEndDate", label: Text({tid:'Dashboard.Table.ExpiryDate'}),
          options: {filter: false,
            customBodyRender: (value, tableMeta) => {
              return (
                <>
                {tableMeta.rowData[20]===true
                  ? value[0]
                  : value.map((i, index)=> <div key={index}>{i} </div>)
                }
                </>
              );
            }
          }
        },
        {name: "renewal", label: "Repurchased", 
          options: {filter: false, display: false, download: false, print: false,}
        },  
        {name: "status", label: Text({tid:'Dashboard.Table.Status'}),
          options: { 
            filterList: filterStatus,
            customBodyRender: (value, tableMeta, updateValue) => { 
              return (
                <React.Fragment>
                  <div style={{color: (value.slice(0,6)==='Refund' || value.slice(0,6)==='Reject')?'#FF3333':null}}>
                    {value}
                    {value === 'Draft' && onPage!=='Dashboard' &&
                      <Tooltip title="continue edit" enterTouchDelay={0}>
                        <IconButton aria-label="edit" variant="outlined" color="primary"
                          onClick={()=>{
                            history.push({
                              pathname: `/myportal/vendor/new-application/${tableMeta.rowData[7]?tableMeta.rowData[7][0].toLowerCase():''}`,
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
                  </div>
                </React.Fragment>                  
              );
            }
          }     
        }, 
        {name: "repurchase", label: Text({tid:'Dashboard.Table.Repurchase'}), 
          options: { filter: false, sort: false, empty: true, download: false, print: false, display: onPage==='Dashboard'?false:true,
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
                        setSelectedRows(tableMeta.rowIndex)
                        if(tableMeta.rowData[3] !== 'ZCRM'){
                          handleOpenRepurchaseApplication(applications.filter(d => d.application_id === tableMeta.rowData[0])[0])
                        }else{
                          handleOpenRepurchaseApplication(applications.filter(d => d.policy === tableMeta.rowData[14] && d.app_date === tableMeta.rowData[16])[0])
                        }
                      }}
                  >
                    <ShoppingCartIcon/>
                  </IconButton>
              );
            }
          }
        },
        {name: "refund", label: Text({tid:'Dashboard.Table.Refund'}), 
          options: { filter: false, sort: false, empty: true, download: false, print: false, display: onPage==='Dashboard'?false:true,
            customHeadRender: (columnMeta) => {
              return(
                <TableCell key={columnMeta.label} style={{ fontSize:'12px', fontWeight:'600'}}>
                  {columnMeta.label}
                </TableCell>
              );
            },
            customBodyRender: (value, tableMeta, updateValue) => {
              return (
                  <IconButton aria-label="refund" variant="outlined" color="primary" 
                      disabled = {((tableMeta.rowData[11] === 'Approved' || tableMeta.rowData[17] < 100 ) && tableMeta.rowData[9].filter(f=>new Date(f) > current).length > 0 ) ? false:true}
                      onClick={() => {
                              setSelectedRows(tableMeta.rowIndex)
                              if(tableMeta.rowData[3] !== 'ZCRM'){
                                handleOpenRefundApplication(
                                  applications.filter(d => (d.app_status === 'Approved' || tableMeta.rowData[17] < 100 ) 
                                                            && d.application_id === tableMeta.rowData[0] 
                                                            && d.insuredpersons.filter(f => new Date(f.tripEndDate) > current))[0]
                                )
                              }else{
                                handleOpenRefundApplication(
                                  applications.filter(d => (d.app_status === 'Approved' || tableMeta.rowData[17] < 100) 
                                                            && d.policy === tableMeta.rowData[14] 
                                                            && d.app_date === tableMeta.rowData[16] 
                                                            && d.insuredpersons.filter(f => new Date(f.tripEndDate) > current))[0]
                                )
                              }
                      }}
                  >
                    <RiRefund2Fill/>
                  </IconButton>
              );
            }
          }
        },
        {name: "policy", label: 'policy',
          options: {filter: false, display: false, download: false, print: false}
        },
        {name: "insuredGroupType", label: 'insuredGroupType',
          options: {filter: false, display: false, download: false, print: false}
        },
        {name: "app_date", label: 'appDate',
          options: {filter: false, display: false, download: false, print: false}
        },
        {name: "rateOfRefundRequested", label: 'rateOfRefund',
          options: {filter: false, display: false, download: false, print: false}
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
      ]
    return (columns)
  }

  const options = {
    filter: onPage==='Dashboard'?false:true,
    filterType: "dropdown",
    selectableRows: 'none',  //'multiple',
    // responsive: "vertical",
    responsive: "standard",
    rowStyle: {height: 30},
    viewColumns: false,
    download: false,
    print: onPage==='Dashboard'?false:true,   
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
    expandableRows: true,
    searchOpen: searchTextID?true:false,
    searchText: searchTextID,
    // expandableRowsOnClick: true,
    // onRowClick: (rowData) => {
    //   console.log(rowData);
    // },   
    rowsExpanded: [selectedRows],
    renderExpandableRow: (rowData, rowMeta) => { 
      const clickedData = rowData[3] !== 'ZCRM'
      ? (applications.filter(d => d.application_id === rowData[0]))[0]
      : (applications.filter(d => d.policy === rowData[14] && d.app_date === rowData[16]))[0]
      return (
        clickedData &&
        <tr>
          <td colSpan={15}>
            {/* result of update */}
            {!updateError && !updateLoading && updateResult && onAlert==='Update' && alertOpen && selectedRows ===rowMeta.dataIndex &&(
            // {!updateError && !updateLoading && updateResult && alertOpen && selectedRows ===rowMeta.dataIndex &&(
              <>
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
            {!sendEmailError && !sendEmailLoading && sendEmailResult && onAlert==='SendEmail' && alertOpen && selectedRows ===rowMeta.dataIndex &&(
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
              vendorID = {vendorID}
              clickedData = {clickedData} 
              url = {url}
              sourceFrom = {rowData[3]}
              selectedRow = {rowMeta.dataIndex}
              getDocument = {getDocumentFromS3}
              getFiles = {getFiles}
              updateContact = {UpdateContactInfo}
            />
            <hr />
          </td>
        </tr>

      );
    },
  };


  return (
    <> 
        <MUIDataTable
            title= {onPage==='Dashboard'? '':
                    <div>
                    <Grid item container style={{ margin:'2vh 0' }}>
                            <Typography className={classes.tableTitle}>
                            <ArticleIcon style={{ marginRight:'5px'}} />
                            <Text tid={'Dashboard.ApplicationList'} />
                            </Typography>
                        </Grid>
                    <Grid item container>
                      {onPage==='Search' &&
                        <FormControl style={{marginRight: '2vh'}}>
                          <RadioGroup style={{alignItems: 'flex-start'}}
                            name="periodType"
                            value = {periodType}
                            onChange={(e)=>{
                              if (e.target.value === 'A'){
                                  setCriteriaData({fromDate:'2017-09-01', toDate: new Date().toISOString().substring(0,10)})
                              }else{
                                setCriteriaData({fromDate:new Date().toISOString().substring(0,8)+'01', toDate: new Date().toISOString().substring(0,10)})
                              }
                              setPeriodType(e.target.value)
                            }}
                          >
                            <FormControlLabel value="P" control={<Radio />} label="Period" />
                            <FormControlLabel value="A" control={<Radio />} label="All" />
                          </RadioGroup>
                        </FormControl>
                      }
                      <Criteria
                          criteriaData = {criteriaData}
                          setCriteriaData = {setCriteriaData}
                          onClick ={getSearchResult}
                      />
                    </Grid>
                    </div>    
                }
            data={applicationData}
            columns={columns}
            options={options}
            components={{
                TableFilterList: CustomFilterList,
              }}
        />


         {/* Repurchase Modal */}
        {openRepurchaseApplication === true &&
          <RenewApplicationModal
            renewData={data}
            insuraceCompany={data.applicationCompany}
            insuraceType={data.insuredPersons[0].eligilbeIns}
            applyType={data.application.applicationType}
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
    

    </>
  );
}