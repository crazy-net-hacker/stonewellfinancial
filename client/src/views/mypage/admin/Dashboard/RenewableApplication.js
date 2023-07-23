import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
// redux
import { useSelector, useDispatch } from 'react-redux';
import { getRenewableApplications } from '../../../../redux/actions/travelApplicationAction';
// import { senEmailRenewableApplications } from '../../../../redux/actions/travelApplicationAction';
//
// import { Grid, Typography, Button } from '@material-ui/core'
import { Grid, IconButton, TableCell, Typography } from '@material-ui/core'
import MUIDataTable from "mui-datatables";
// import Alert from '@mui/material/Alert';
// import AlertTitle from '@mui/material/AlertTitle';
// components
import Button from '../../../../components/common/CustomButtons/Button'
import LoadingSpinnerScreen from '../../../../components/common/loadingScreen';
// icons
import ArticleIcon from '@mui/icons-material/Article';
// style
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';


const group = (data) => {
  var obj = Object.create(null);
  const group = [];
  data.forEach(function (o) {
      var key = ['email','insurance_company', 'insured_type'].map(function (k) { return o[k]; }).join('|');
      if (!obj[key]) {
        obj[key] = {insurance_company: o.insurance_company, 
                    insured_type: o.insured_type,
                    email: o.email,
                    persons: [] 
                    };
        group.push(obj[key]);
      }
      obj[key].persons.push(o);
    });  
  return (group)
}  

const groupByEmail = (data) => {
  var obj = Object.create(null);
  const group = [];
  data.forEach(function (o) {
      var key = ['email'].map(function (k) { return o[k]; }).join('|');
      if (!obj[key]) {
        obj[key] = {email: o.email,
                    renewable_plan: [] 
                    };
        group.push(obj[key]);
      }
      obj[key].renewable_plan.push(o);
    });  
  return (group)
} 

const addaDay = (dateTime) => {
  const date = new Date(dateTime+'T00:00:00');
  return new Date(date.setDate(date.getDate() + 1)).toISOString().slice(0,10);
}


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

const sortNumber = (relationship) => {
  const order = relationship_sort.filter(f=>f.code ===relationship)
  return order.length > 0 ? order[0].sort : 9
}


export default function RenewableApplication(props) { 
  // const { match, user } = props; 

  // title
  document.title = 'Dashboard | Stonewell Financial Service'
  
  // style
  const useStyles = makeStyles(dashboardStyles)
  const classes = useStyles()

  const dispatch = useDispatch();
  const applications = useSelector(state => state.travelApplicationReducer.renewableApplication)
  const loading = useSelector(state => state.travelApplicationReducer.renewableLoading)

  // const sendEmailResult = useSelector(state => state.travelApplicationReducer.sendEmailResult)
  // const sendEmailLoading = useSelector(state => state.travelApplicationReducer.sendEmailLoading)
  // const sendEmailError = useSelector(state => state.travelApplicationReducer.sendEmailError)

  // run useEffect only once when first render
  const [isLoaded, setIsLoaded] = useState(false)

  //
  const [currntPage, setCurrntPage] = useState(0)
  const [rowsSelected, setRowsSelected] = useState([])

  // const [alertOpen, setAlertOpen] = useState(false)

  // get renewable application list
  const getSearchResult = useCallback(() => {
    dispatch(getRenewableApplications())
  }, [dispatch]);
    

  // run useEffect only once when first render
  useEffect(() => {
    if(isLoaded === false){
      getSearchResult()
      setIsLoaded(true)
    }
  }, [getSearchResult, isLoaded]);

  const applicationData = applications 
  ? applications.sort((a,b)=> a.email - b.email).map(row => {
    const updatedRow = {
      ...row,
      renewal_effective_date: addaDay(row.expiry_date)
    };
    return updatedRow;
  })
  : [];

  const applicationByCompany = group(applicationData);
  const applicationByEmail = groupByEmail(applicationByCompany);


// send email renewable Application
// Application for renewal: 0 days, 14 days from the expiration date
// function sendEmailRenewable() {
//   setAlertOpen(true)
//   dispatch(senEmailRenewableApplications())
// }

//
const columns = getColumns()
function getColumns(){
  const columns=[
      {name: "firstname", label: 'FirstName',
        // options: {filter: false}
      },
      {name: "lastname", label: 'LastName',
      },
      {name: "birthdate", label: 'DOB',
      },
      {name: "email", label: 'Email',
      },
      {name: "application_date", label: 'Application Date',
      },           
      {name: "source_from", label: "Source", 
      },
      {name: "vendor_name", label: 'Vendor',
      },
      {name: "policy_number", label: "Policy No", 
      },
      {name: "insurance_company", label: "Insurance company", 
      },
      {name: "insured_type", label: "Insured Type", 
      }, 
      {name: "trip_type", label: "Trip Type", 
      }, 
      {name: "effective_date", label: 'Effective Date',
      },
      {name: "expiry_date", label: 'Expiry Date',
      },
      {name: "remain_days", label: 'Remaining days',
      },
      {name: "", label: 'Renwal URL',
      options: { filter: false,
                  // display: false,
        customHeadRender: (columnMeta) => {
          return(
            <TableCell key={columnMeta.label} style={{ fontSize:'12px', fontWeight:'600'}}>
              {columnMeta.label}
            </TableCell>
          );
        },                            
        customBodyRender: (value, tableMeta) => {
          // console.log('tableMeta.rowData',tableMeta.rowData)
          return (
              <IconButton aria-label="edit" variant="outlined" color="primary" 
                  onClick={() => {
                    setRowsSelected(tableMeta.currentTableData.filter(f=>f.data[3]=== tableMeta.rowData[3]).map(i=>i.index))
                  }}
              >
                <ArticleIcon/>
              </IconButton>
          );
        }
      }
    }
    ]
    return (columns)
  }

  const options = {
    filter: false,
    // filterType: "checkbox", //"dropdown", //
    selectableRows: 'multiple', //'single', //'none',  //'multiple',
    selectableRowsHideCheckboxes: true,
    responsive: "standard", // "stacked", "vertical"
    // showTitle: false,
    // search: false,
    rowStyle: {height: 30},
    viewColumns: false,
    download: false,
    print: false,   
    expandableRows: false,
    rowsPerPage: 10,
    page: currntPage,
    rowsSelected: rowsSelected,
    onChangePage (currentPage) {
      setCurrntPage(currentPage);
    },  
    customToolbarSelect: (selectedRows,rowData) => {
      const selectedData = rowData.filter(f => selectedRows.data.map(i=>i.dataIndex).includes(f.dataIndex))
      const renewableApplication= applicationByEmail.filter(f=>f.email===selectedData[0].data[3])[0];

      return(
        <Grid container>
          <Grid item xs container direction="column" spacing={0}>
            <Grid item xs container spacing={0}>
              <Grid item xs={3}>
                <label className={classes.inputLabel}>To</label>
                <Typography>            
                  {renewableApplication.email}
                </Typography>
              </Grid>
              <Grid item xs={9}>
                {renewableApplication.renewable_plan.map((i, index)=>(
                  <React.Fragment key={index}>
                    <Grid item container>
                      <Grid item xs={3}>
                      <label className={classes.inputLabel}>Insurance</label>
                        {i.insurance_company} - {i.insured_type}
                      </Grid>
                      <Grid item xs={6}> 
                      {i.persons.sort((a,b)=> (a.source_from==='Z'?(new Date(a.birthdate)):sortNumber(a.relationship)) - (a.source_from==='Z'?(new Date(b.birthdate)):sortNumber(b.relationship))).map( (p, pIndex)=>(
                        <Grid item container spacing={1} key={pIndex} >
                          <Grid item xs={6}>
                            <label className={classes.inputLabel}>Name</label>
                            {p.firstname} {p.lastname}
                          </Grid>
                          <Grid item xs={3}>
                            <label className={classes.inputLabel}>Birth Date</label>
                            {p.birthdate}
                          </Grid>
                          <Grid item xs={3}>
                            <label className={classes.inputLabel}>Expiry Date</label>
                            {p.expiry_date} 
                          </Grid>
                        </Grid>
                      ))}
                      </Grid>
                      <Grid item xs={2}>
                        <Grid item container style={{justifyContent: 'flex-end', margin:'0 7vh 0'}}>
                          <Button
                            color="primary"
                            onClick={() => {
                              const insured = JSON.stringify(
                                        i.persons.map(p => ({
                                          firstName: p.firstname,
                                          lastName: p.lastname,
                                          birthDate: p.birthdate,
                                          gender: p.gender,
                                          tripStartDate: p.renewal_effective_date
                                      }))
                                    );
                      
                              const contact = JSON.stringify({
                                                                street: i.persons[0].street?i.persons[0].street.replace('#', ' '):'', 
                                                                suiteNo: i.persons[0].suite_no, 
                                                                city: i.persons[0].city, 
                                                                province: i.persons[0].province, 
                                                                postalcode: i.persons[0].postalcode, 
                                                                country: i.persons[0].country,
                                                                email: renewableApplication.email,
                                                                phone: i.persons[0].phone
                              });
                              
                              // const baseURL = 'http://localhost:3000'
                              const baseURL = 'https://www.stonewellfinancial.com'
                              const URL = `${baseURL}/travel-insurance/d8bb983bb932b31/application/${i.insured_type.toLowerCase()}/${i.insurance_company.toLowerCase()}/individual?renewal=true&insured=${insured}&contact=${contact}`
                              // window.open(URL, '_blank')      
                              navigator.clipboard.writeText(URL)                    
                            }}
                          >
                            Copy M.F.URL
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </React.Fragment>
                ))
                }
              </Grid>

            </Grid>


          </Grid>
          
          <Grid item container style={{ justifyContent:'end'}}>
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: '1vh', marginRight: '2vh' }}
                onClick={()=>{
                  setRowsSelected([])
                }}
              >
                Close
              </Button>
          </Grid>

        </Grid>
        
      )
    },  
  };


  return (
    <Grid container>
      <Grid item container>
        <Grid item container style={{ margin:'2vh 0 2vh 4vh' }}>
          <Grid item xs={6}>
            <span className={classes.subTitleText}>
              Renewable insurance before expiration
            </span>
          </Grid>
          {/* <Grid item container style={{ justifyContent:'end', marginRight: '6vh'}}>
            <Button
              variant="contained"
              color="primary"
              onClick={()=>{
                sendEmailRenewable()
              }}
            >
              Send Email
            </Button>
            {sendEmailLoading
              ?
              <Grid item xs={12}>
                <Alert severity='info'>   
                      Sending Email ... 
                </Alert>
              </Grid>
              :null
            }
            {!sendEmailError && !sendEmailLoading && sendEmailResult.status && alertOpen && (
              <Grid item xs={12}>
                <Alert severity={sendEmailResult.status} 
                        onClose={() => {
                            setAlertOpen(false)
                        }}
                >     
                  <AlertTitle>{sendEmailResult.status}</AlertTitle>
                  {sendEmailResult.message }
                </Alert>
              </Grid>
            )} 
          </Grid> */}
        </Grid>
      </Grid>
      {/* <Grid item container style={{ padding:'1vh 5vh 5vh'}}> */}
      <Grid item container style={{ padding:'1vh 2vh 5vh'}}>
      {/* <Grid item container style={{ margin:'0 4vh', paddingBottom:'2vh' }}> */}
        {loading
          ? 
            <LoadingSpinnerScreen/>
          :
            applicationByEmail &&
              <MUIDataTable
                data={applications}
                columns={columns}
                options={options}
              />
        }
      </Grid>

    </Grid>
  )
}

