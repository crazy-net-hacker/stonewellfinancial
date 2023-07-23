import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { getGroupQuote } from '../../../../redux/actions/groupQuoteAction';

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
//     height: '100%',
//     background: '#f0f2f8',
//   },
//   breadCrumbsDashboard: {
//     marginBottom: '2vh',
//   },
//   snackBarMessage: {
//     marginBottom: theme.spacing(2),
//   },
//   inputLabel: {
//     fontWeight:'600',
//     paddingTop:'12px',
//     display:'block',
//     fontSize:'12px',
//     color:'#777'
//   },
//   inputValue: {
//      fontWeight:'600' 
//   },
//   sectionWrapper: {
//       margin:'1vh 8vh'
//   },
//   sectionTitle: {
//     fontWeight: '600', 
//     fontSize: '16px', 
//     margin: '1.5vh 0'
//   },
//   sectionTitleBox: {
//     margin: '5vh 0 2vh 0',
//     borderBottom:'1px solid #efefef'
//   },
//   dashboardPageTitle: {
//     fontSize:'1.2rem', 
//     fontWeight:'600', 
//     color:'#000'
//   }


// }))



// const codes = [
//   { code_name: 'Pending', code_desc: "Pending" },
//   { code_name: 'Approved', code_desc: "Approved" },
//   { code_name: 'Declined', code_desc: "Declined" },
//   { code_name: 'Void', code_desc: "Void" },
//   { code_name: 'Error', code_desc: "Error" },
// ]

export default function GroupQuote() { 

  const dispatch = useDispatch();
  const quotes = useSelector(state => state.groupQuoteReducer.quotes)

  useEffect(() => {
    dispatch(getGroupQuote())
    }, [dispatch]);

  const [snackOpen, setSnackOpen] = useState(false)
  
  // styles
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
      GroupQuoteID: row.quoteID, //row.confirmationNo,
      GroupQuoteDate: dateFormat(new Date(row.quoteDate)),
      agency: row.vendor_code === 'M'? 'Web-ManualApp': row.vendor_code === 'O' ? 'Web-Quote' : row.vendor_code,
      companyName: row.companyName,
      numberOfcovered: row.numberOfcovered,
      contactPerson: row.contactPerson,
      email : row.email,      
      status :row.app_status
    };
    return updatedRow;
  });
 


  // Column definitions
  function getColumns(){
    const columns=[
        {name: "GroupQuoteID", label: "App #", 
          // options: {filter: false, display: false},
          // options: {filter: false},
        },
        {name: "GroupQuoteDate", label: 'App Date',
          options: {filter: false}
        },
        // {name: "agency", label: 'Agency',
        // },
        
        {name: "companyName", label: 'Company',
          options: {filter: false}
        },
        {name: "numberOfcovered", label: 'Size',
          options: {filter: false}
        },

        {name: "contactPerson", label: 'Contact Person',
          options: {filter: false}
        },

        // {name: "policyID", label: 'Policy #',
        //   options: {filter: false}
        // },

       
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
        <td colSpan={10}>
          <Grid container justify="center">
              
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
                              <Grid item xs={6} md={2}>
                                <label className={classes.inputLabel}>Agency</label>
                                <span className={classes.inputValue}>{clickedData.vendor_code === 'M'? 'Web-ManualApp': clickedData.vendor_code === 'O' ? 'Web-Quote' : clickedData.vendor_code}</span>
                              </Grid>  
                            </Grid>
                          </Grid>
                      </Grid>
                </Box>  
              </Grid>

               {/* Company */}
               <Grid item xs={12} container className={classes.sectionWrapper}>
                  <Grid item container className={classes.sectionTitleBox}>
                    <span className={classes.sectionTitle}>Company</span>
                  </Grid>                    
                  <Box width="100%">
                    <Grid item xs container direction="column" spacing={0}>   
                      <Grid item xs container spacing={0}>
                        <Grid item xs={4}>
                          <label className={classes.inputLabel}>Company Name</label>
                          <span className={classes.inputValue}>{clickedData.companyName}</span>
                        </Grid>
                        <Grid item xs={4}>
                          <label className={classes.inputLabel}>Nature of Business</label>
                          <span className={classes.inputValue}>{clickedData.natureOfBusiness}</span>
                        </Grid>
                        <Grid item xs={2}>
                          <label className={classes.inputLabel}>Business Year</label>
                          <span className={classes.inputValue}>{clickedData.businessYear}</span>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
              </Grid> 

               {/* Contact Person */}
               <Grid item xs={12} container className={classes.sectionWrapper}>
                  <Grid item container className={classes.sectionTitleBox}>
                    <span className={classes.sectionTitle}>Contact Person</span>
                  </Grid>                    
                  <Box width="100%">
                    <Grid item xs container direction="column" spacing={0}>   
                        <Grid item xs container spacing={0}>
                            <Grid item xs={4}>
                            <label className={classes.inputLabel}>Contact Person</label>
                            <span className={classes.inputValue}>{clickedData.contactPerson}</span>
                            </Grid>
                            <Grid item xs={4}>
                            <label className={classes.inputLabel}>Email</label>
                            <span className={classes.inputValue}>{clickedData.email}</span>
                            </Grid>
                            <Grid item xs={2}>
                            <label className={classes.inputLabel}>Phone</label>
                            <span className={classes.inputValue}>{clickedData.phone}</span>
                            </Grid>
                            <Grid item xs={2}>
                            <label className={classes.inputLabel}>Contact Method</label>
                            <span className={classes.inputValue}>{clickedData.contactMethod}</span>
                            </Grid>
                        </Grid>
                    </Grid>

                  </Box>
              </Grid> 

              {/* Employment */}
              <Grid item xs={12} container className={classes.sectionWrapper}>
                  <Grid item container className={classes.sectionTitleBox}>
                    <span className={classes.sectionTitle}>Employment</span>
                  </Grid>                    
                  <Box width="100%">
                    <Grid item xs container direction="column" spacing={0}>   
                      <Grid item xs container spacing={0}>
                        <Grid item xs={2}>
                          <label className={classes.inputLabel}>Full Time Employees</label>
                          <span className={classes.inputValue}>{clickedData.numberOfFullTime}</span>
                        </Grid>
                        <Grid item xs={2}>
                          <label className={classes.inputLabel}>Covered Employees</label>
                          <span className={classes.inputValue}>{clickedData.numberOfcovered}</span>
                        </Grid>
                        {clickedData.reasonNotSame ? 
                            <Grid item xs={6}>
                            <label className={classes.inputLabel}>The reason why not same</label>
                            <span className={classes.inputValue}>{clickedData.reasonNotSame}</span>
                            </Grid>
                        :null}
                      </Grid>
                      
                    </Grid>
                  </Box>
              </Grid> 

              {/* Applicant */}
              <Grid item xs={12} container className={classes.sectionWrapper}>
                      <Grid item container className={classes.sectionTitleBox}>
                        <span className={classes.sectionTitle}>Employees</span>
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
                                    <label className={classes.inputLabel}>Birth date</label>
                                    <span className={classes.inputValue}>{dateFormat(new Date(row.birthDate))}</span>
                                    <div>{row.age} years</div>
                                </Grid>
                                <Grid item xs={2}>
                                    <label className={classes.inputLabel}>Gender</label>
                                    <span className={classes.inputValue}>{row.gender}</span>
                                </Grid>
                                <Grid item xs={2}>
                                    <label className={classes.inputLabel}>Province</label>
                                    <span className={classes.inputValue}>{row.province}</span>
                                </Grid>
                                <Grid item xs={2}>
                                    <label className={classes.inputLabel}>Plan Type</label>
                                    <span className={classes.inputValue}>{row.type}</span>
                                
                                </Grid>

                            </Grid>

                            </div>
                        ))}
                      </Box>

                  </Grid>

             {/* Product */}
             <Grid item xs={12} container className={classes.sectionWrapper} style={{ marginBottom:'10vh' }}>
                  <Grid item container className={classes.sectionTitleBox}>
                    <span className={classes.sectionTitle}>Insurance</span>
                  </Grid>                    
                  <Box width="100%">
                   
                    <Grid item xs container direction="column" spacing={0}>   

                       {/* Main */}
                      <Grid item xs container spacing={0}>
                        <Grid item xs={12} md={2}>
                          <label className={classes.inputLabel}>Health Plan</label>
                          <span className={classes.inputValue}>{clickedData.healthPlan}</span>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <label className={classes.inputLabel}>Dental Plan</label>
                          <span className={classes.inputValue}>{clickedData.dentalPlan}</span>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <label className={classes.inputLabel}>Paramedical Plan</label>
                          <span className={classes.inputValue}>{clickedData.paramedicalPlan}</span>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <label className={classes.inputLabel}>Presciption Drug</label>
                          <span className={classes.inputValue}>{clickedData.presciptionDrug}</span>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <label className={classes.inputLabel}>Vision Plan</label>
                          <span className={classes.inputValue}>{clickedData.visionPlan}</span>
                        </Grid>
                      </Grid>

                      {/* Add on */}
                      <Grid item xs container spacing={0} style={{ marginTop:'3vh' }}>
                        <Grid item xs={12} md={2}>
                          <label className={classes.inputLabel}>Long Term Disability</label>
                          <span className={classes.inputValue}>{clickedData.longTermDisabilty === true ? 'Included' : 'Not Included'}</span>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <label className={classes.inputLabel}>Short Term Disability</label>
                          <span className={classes.inputValue}>{clickedData.ShortTermDisability === true ? 'Included' : 'Not Included'}</span>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <label className={classes.inputLabel}>Critical Illness</label>
                          <span className={classes.inputValue}>{clickedData.CriticalIllnessInsurance === true ? 'Included' : 'Not Included'}</span>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <label className={classes.inputLabel}>Group RRSP and DPSP</label>
                          <span className={classes.inputValue}>{clickedData.GroupRRSPandDPSP === true ? 'Included' : 'Not Included'}</span>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <label className={classes.inputLabel}>Group TFSA</label>
                          <span className={classes.inputValue}>{clickedData.GroupTFSA === true ? 'Included' : 'Not Included'}</span>
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
          Group Benefit
        </Typography>
      </Grid>
      <Grid item container style={{ margin:'0 5vh 5vh' }}>
        <MUIDataTable
          title= {
            <div>
              <Grid item container style={{ margin:'2vh 0' }}>
                <Typography style={{ fontSize:'1.1rem', fontWeight:'600', color:'#000', marginLeft:'-2vh' }}>
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


