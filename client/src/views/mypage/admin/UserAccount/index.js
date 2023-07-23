import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, Typography,} from '@material-ui/core'
import MUIDataTable from "mui-datatables";
// import {IconButton} from '@material-ui/core';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { getUsersByVendor } from '../../../../redux/actions/userAction';
// common customized components
import SnackPrompt from '../../../../components/common/Snackbars'
import { QuoteBanner2 } from '../../../../components/common/QuoteBanner2';
import { RegularSwitch } from '../../../../components/common/CustomSwitch';
// import { Text } from '../../../../components/common/LanguageProvider'
// icons
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
// import EditIcon from '@material-ui/icons/Edit';
//style
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';

const useStyles = makeStyles(dashboardStyles)


export default function VendorRegister() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const users = useSelector(state => state.userAccountReducer.users)

  const [snackOpen, setSnackOpen] = useState(false)

  useEffect(() => {
      dispatch(getUsersByVendor({vendor_id:'*'}))
      }, [dispatch]);


  const columns = getColumns()
  
  // Column definitions
  function getColumns(){
    const columns=[
        {name: "role", label: 'Role',
        },
        {name: "user_id", label: "ID", 
          options: {filter: false, display: false},
        },
        {name: "firstName", label: 'First Name',
          options: {filter: false},
        },
        {name: "lastName", label: 'Last Name',
          options: {filter: false},
        },
        {name: "email", label: 'Email',
          options: {filter: false},
        },
        {name: "vendor_name", label: 'Vendor Name',
        },
        {name: "isActive", label: 'Activated',
          options: {
            customBodyRender: (value, tableMeta, updateValue) => {
                return (
                  <>
                    {tableMeta.rowData[0] !=='CLT' && value
                      ?
                        <RegularSwitch  
                          disabled
                          name="is_active"
                          checked={value} 
                        />
                      : null
                    }
                  </>
                )
            }
          }
        },
        {name: "vendorRole", label: 'Vendor Role',
          options: {
            filter: false,
            customBodyRender: (value, tableMeta, updateValue) => {
              return (
                <>
                  {tableMeta.rowData[0] ==='VEN' 
                    ? (value ==='A'?'Admin': 'Sfaff')
                    : null
                  }
                </>
              )
            }
          }
        },
        {name: "activeDate", label: 'Activated date',
          options: {filter: false},
        },
        {name: "closeDate", label: 'Closed date',
          options: {filter: false},
        },
        {name: "createdAt", label: 'Created',
          options: {filter: false},
        },
        // {name: "Edit",
        //   options: { filter: false, sort: false, empty: true, print: false,
        //     customBodyRender: (value, tableMeta, updateValue) => {
        //       return (
        //           <IconButton aria-label="edit" variant="outlined" color="primary" 
        //               // onClick={() => editVendor(tableMeta.rowData[0])}
        //               >
        //             <EditIcon/>
        //           </IconButton>
        //       );
        //     }
        //   }
        // },
      ]
    return (columns)
  }

  const options = {
    filter: true,
    // filterType: "checkbox", //"dropdown", //
    filterType: "dropdown", //
    selectableRows: 'none',  //'multiple',
    // responsive: "vertical",
    responsive: "standard",
    rowStyle: {height: 30},
    viewColumns: false,
    download: false,
    print: false,   
    expandableRows: false,
    expandableRowsOnClick: false 
  };

  

  return (
    <>

    <Grid container justify="center" style={{ marginTop:'-37px' }}>
      {/* <QuoteBanner2 icon={<ManageAccountsIcon style={{ fontSize:'30px' }}/>} title={`Dashboard.VendorAccount`} subTitle={'Dashboard.VendorAccount.subtitle'} links={[]} /> */}
      <QuoteBanner2 icon={<ManageAccountsIcon style={{ fontSize:'30px' }}/>} title={`Dashboard.UserAccount`} subTitle={'Dashboard.UserAccount.subtitle'} links={[]} />
          {/* <Grid item xs={12} sm={12} md={11}>
              <main className={classes.form} style={{ padding:isMobile?'0':'0 2vh' }}>
                  <Application 
                      insuraceType = {match.params.type}
                      userID = {user}
                  />
              </main>
          </Grid> */}
        
    
        <Grid item xs={12} sm={12} md={11}>

            {/* <IconButton aria-label="add" color="primary" 
                    onClick={() => addVendor()}>
                  <LibraryAddIcon />
            </IconButton>  */}

              <MUIDataTable
                title= {
                  <div>
                    {/* <Criteria
                      criteriaData = {criteriaData}
                      setCriteriaData = {setCriteriaData}
                      onClick ={getSearchResult}
                    /> */}
                    <Grid item container style={{ margin:'2vh 0' }}>
                      <Typography className={classes.tableTitle}>
                        {/* <Text tid={'Dashboard.UserAccount.ListTitle'} /> */}
                        Registered Users
                      </Typography>
                    </Grid>

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
                data={users.data}
                columns={columns}
                options={options}
              />

        </Grid>
    </Grid>
    </>
  );
}