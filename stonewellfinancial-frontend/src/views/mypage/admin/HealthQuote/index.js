import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { getHealthQuote } from '../../../../redux/actions/healthQuoteAction';

import { dateFormat } from '../../../../controllers/dataFormat';
// core component
import { Box, Typography, Grid } from '@material-ui/core'
import MUIDataTable from "mui-datatables";

// component
import SnackPrompt from '../../../../components/common/Snackbars'
import Criteria from '../../common/Criteria'


// icon

//style
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';

const useStyles = makeStyles(dashboardStyles)

// const useStyles = makeStyles((theme) => ({
//   root: {
//     height: 'calc(100px - 100%)',
//     background: '#ECEEF6',
//   },
//   xsDown: {
//     color: '#111',
//     fontSize: '24px',
//     paddingTop: '2vh',
//     paddingLeft: '24px',
//     [theme.breakpoints.down('xs')]: {
//       display: 'flex',
//       fontSize: '1.5em',
//       justifyContent: 'center',
//     },
//   },
//   breadCrumbsDashboard: {
//     marginBottom: '2vh',
//   },
//   snackBarMessage: {
//     marginBottom: theme.spacing(2),
//   },
//   inputLabel: {
//     fontWeight:'500',
//     paddingTop:'12px',
//     display:'block',
//     fontSize:'15px',
//   },

// }))

// const codes = [
//   { code_name: 'Pending', code_desc: "Pending" },
//   { code_name: 'Approved', code_desc: "Approved" },
//   { code_name: 'Declined', code_desc: "Declined" },
//   { code_name: 'Void', code_desc: "Void" },
//   { code_name: 'Error', code_desc: "Error" },
// ]

export default function HealthQuote() { 

  const dispatch = useDispatch();
  const quotes = useSelector(state => state.healthQuoteReducer.quotes)

  useEffect(() => {
    dispatch(getHealthQuote())
    }, [dispatch]);

  const [snackOpen, setSnackOpen] = useState(false)

  const classes = useStyles();

  // criteria
  const [criteriaData, setCriteriaData] = useState({
    fromDate: '2022-01-01',
    toDate: new Date().toISOString().replace('T', ' ').substr(0, 10),
  })

  function getSearchResult(){
    // console.log('getSearchResult')
    // console.log(criteriaData)
  }

  // function getDataFromZoho(email){
  //   console.log('connection testing')
  //   return (
  //     `${email} get data from zoho`
  //     )
  // }

  const quotesData = quotes.map(row => {
    const updatedRow = {
      ...row,
      healthQuoteID: row.quoteID, //row.confirmationNo,
      healthQuoteDate: dateFormat(new Date(row.quoteDate)),
      // agency: row.vendor_code === 'M'? 'Web-ManualApp': row.vendor_code === 'O' ? 'Web-Quote' : row.vendor_code,
      insuredName: row.insuredpersons[0] ? row.insuredpersons[0].firstName + ' ' +row.insuredpersons[0].lastName : null,
      birthdate: row.insuredpersons[0] ? dateFormat(new Date(row.insuredpersons[0].birthDate)) : null,
      insuredType: row.insuranceKind,
      benefitAmount: row.benefitAmount,
      // tripStartDate : row.insuredpersons[0] ? dateFormat(new Date(row.insuredpersons[0].tripStartDate)) : null,
      // tripEndDate : row.insuredpersons[0] ? dateFormat(new Date(row.insuredpersons[0].tripEndDate)) : null,
      email : row.email,      
      status :row.app_status,
      province: row.province
    };
    return updatedRow;
  });
 


  // Column definitions
  function getColumns(){
    const columns=[
        {name: "healthQuoteID", label: "App #", 
          // options: {filter: false, display: false},
          // options: {filter: false},
        },
        {name: "healthQuoteDate", label: 'App Date',
          options: {filter: false}
        },
        // {name: "agency", label: 'Agency',
        // },
        
        {name: "insuredName", label: 'Name',
          options: {filter: false}
        },
        {name: "birthdate", label: 'DOB',
          options: {filter: false}
        },
        {name: "province", label: 'Province',
          // options: {filter: false}
        },
        // {name: "policyID", label: 'Policy #',
        //   options: {filter: false}
        // },
        {name: "insuredType", label: 'Product',
        },
        {name: "benefitAmount", label: 'Benefit Amount',
          options: {filter: false}
        },
       
        {name: "email", label: "Email", 
          // options: {filter: false, display: false},
        }, 
        {name: "status", label: 'Status',
        },
        // {name: "Zoho",
        //   options: { filter: false, sort: false, empty: true,
        //     customBodyRender: (value, tableMeta, updateValue) => {
        //       return (         
        //         <IconButton aria-label="detail" color="primary" 
        //           onClick={() => 
        //             getDataFromZoho(tableMeta.rowData[10])
        //             // console.log('tableMeta.rowData',tableMeta.rowData[10])
        //           }
        //           >
        //         <DescriptionIcon />
        //       </IconButton>  
        //       );
        //     }
        //   }
        // },      
      ]
    return (columns)
  }

  const columns = getColumns()

  const options = {
    filter: true,
    filterType: "dropdown",
    selectableRows: 'none',  //'multiple',
    // responsive: "vertical",
    responsive: "standard",
    rowStyle: {height: 30},
    download: true,
    print: true,   
    expandableRows: true,
    expandableRowsOnClick: true,
    // onRowClick: (rowData) => {
    //   console.log(rowData);
    // },
    renderExpandableRow: (rowData, rowMeta) => {
      // console.log('rowData',rowData)
      // const clickedData = applicationData.filter(d => d.applicationID === rowData[0] && d.insuredPersonID === rowData[1])[0]
      
      const clickedData = (quotes.filter(d => d.quoteID === rowData[0]))[0]
      
      
      
      return (
        clickedData &&
        <tr>
        <td colSpan={12}>
          <Grid container spacing={1} justify="center">
              
               {/* Application Infomation */}
               <Grid item container className={classes.sectionWrapper}>                 
                  <Box width="100%">
                        <Grid item xs container spacing={1}>
                          <Grid item container>
                            <Grid item xs container spacing={1}>
                              {/* <Grid item xs={12} md={6} style={{ alignSelf:'center' }}>
                                <span className={classes.sectionTitle}>Application Infomation</span>
                              </Grid>  */}
                              <Grid item xs={6} md={2}>
                                <label className={classes.inputLabel}>Confirmation No</label>
                                <span className={classes.inputValue}>{clickedData.confirmationNo}</span>
                              </Grid>  
                              <Grid item xs={6} md={2}>
                                <label className={classes.inputLabel}>Applicaion Date</label>
                                <span className={classes.inputValue}>{dateFormat(new Date(clickedData.quoteDate))}</span>
                              </Grid>                            
                              {/* <Grid item xs={6} md={2}>
                                <label className={classes.inputLabel}>Agency</label>
                                <span className={classes.inputValue}>{clickedData.vendor_code === 'M'? 'Web-ManualApp': clickedData.vendor_code === 'O' ? 'Web-Quote' : clickedData.vendor_code}</span>
                              </Grid>  */}
                              <Grid item xs={2}>
                                <label className={classes.inputLabel}>Province</label>
                                <span className={classes.inputValue}>{clickedData.province}</span>
                            </Grid> 
                            </Grid>
                          </Grid>
                      </Grid>
                </Box>  
              </Grid>

              {/* Applicant */}
              <Grid item xs={12} container className={classes.sectionWrapper}>
                      <Grid item container className={classes.sectionTitleBox}>
                        <span className={classes.sectionTitle}>Applicants</span>
                      </Grid>
                      <Box width="100%">
                        {clickedData.insuredpersons.map(row => (

                        <div key={row.insuredPersonID} style={{ marginBottom:'2vh'}}>

                          <Grid item xs={12} container spacing={1}>
                            <Grid item xs={2}>
                                <label className={classes.inputLabel}>First Name</label>
                                <span className={classes.inputValue}>{row.lastName}</span>
                            </Grid>
                            <Grid item xs={2}>
                                <label className={classes.inputLabel}>last Name</label>
                                <span className={classes.inputValue}>{row.firstName}</span>
                            </Grid>
                            <Grid item xs={2}>
                                <label className={classes.inputLabel}>Relationship</label>
                                <span className={classes.inputValue}>{row.relationship}</span>
                            </Grid>
                            <Grid item xs={2}>
                                <label className={classes.inputLabel}>Birth date</label>
                                <span className={classes.inputValue}>{dateFormat(new Date(row.birthDate))}</span>
                                {/* <div>{row.age} years</div> */}
                            </Grid>
                            <Grid item xs={2}>
                                <label className={classes.inputLabel}>Gender</label>
                                <span className={classes.inputValue}>{row.gender}</span>
                            </Grid>
                            <Grid item xs={2}>
                                <label className={classes.inputLabel}>Smoke Status</label>
                                <span className={classes.inputValue}>{row.smokeStatus === true ? 'Yes' : 'No'}</span>
                               
                            </Grid>
                          </Grid>
                        </div>
                        ))}
                      </Box>

                  </Grid>

              {/* Contact */}
              <Grid item xs={12} container className={classes.sectionWrapper} style={{ marginBottom:'10vh' }}>
                  <Grid item container className={classes.sectionTitleBox}>
                    <span className={classes.sectionTitle}>Contact</span>
                  </Grid>                    
                  <Box width="100%">
                    <Grid item xs container direction="column" spacing={0}>   
                      <Grid item xs container spacing={0}>
                        <Grid item xs={3}>
                          <label className={classes.inputLabel}>Phone</label>
                          <span className={classes.inputValue}>{clickedData.phone}</span>
                        </Grid>
                        <Grid item xs={9}>
                          <label className={classes.inputLabel}>Email</label>
                          <span className={classes.inputValue}>{clickedData.email}</span>
                        </Grid>
                      </Grid>
                      
                    </Grid>
                  </Box>
              </Grid>  
          </Grid>

        </td>
        </tr>

      );
    },
  };


  return (
    <Grid container>
       <Grid item container style={{ margin:'5vh 5vh 4vh' }}>
        <Typography className={classes.dashboardPageTitle}>
          {/* <Text tid={'Vendor.StartApplication'} /> */}
          Personal Health Insurance
        </Typography>
      </Grid>
      <Grid item container style={{ margin:'0 5vh 5vh' }}>
        <MUIDataTable
          title= {
            <div>
              <Grid item container style={{ margin:'2vh 0' }}>
                <Typography className={classes.tableTitle}>
                  {/* <Text tid={'Vendor.StartApplication'} /> */}
                  Quote List
                </Typography>
              </Grid>
              <Criteria
                criteriaData = {criteriaData}
                setCriteriaData = {setCriteriaData}
                onClick ={getSearchResult}
              />

              {snackOpen && (
                <SnackPrompt
                  openSnack={snackOpen}
                  // severity={error ? 'error' : 'success'}
                  severity={'success'}
                  message={
                    // error ? error.error : signInInfo ? signInInfo.success : ''
                    'Saved successfull'  
                  }
                  closeSnack={() => setSnackOpen(false)}
                />
                )}
            </div>    
            }
          data={quotesData}
          columns={columns}
          options={options}
        />
      </Grid>
    </Grid>
    
  )
}


