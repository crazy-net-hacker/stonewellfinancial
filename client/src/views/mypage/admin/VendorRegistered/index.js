import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid, Typography,
  // Table, TableHead, TableBody, TableCell, TableRow,
} from '@material-ui/core'
import MUIDataTable from "mui-datatables";
import {IconButton} from '@material-ui/core';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { getVendorAccount } from '../../../../redux/actions/vendorAccountAction';
// common customized components
import ViewDetailModal from '../../common/SearchVendor/ViewDetailModal';
import { QuoteBanner2 } from '../../../../components/common/QuoteBanner2';
import { RegularSwitch } from '../../../../components/common/CustomSwitch';
import { Text } from '../../../../components/common/LanguageProvider'
// icons
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ArticleIcon from '@mui/icons-material/Article';
//style
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';

const useStyles = makeStyles(dashboardStyles)


export default function VendorRegistered() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const vendors = useSelector(state => state.vendorAccountReducer.vendors)

  // run useEffect only once when first render
  const [isLoaded, setIsLoaded] = useState(false)

  const [viewOpen, setViewOpen] = useState(false);
  const [detailData, setDetailData] = useState([]);

  // get vendor list
  const getSearchResult = useCallback(() => {
    dispatch(getVendorAccount())
  }, [dispatch]);

  // run useEffect only once when first render
  useEffect(() => {
    if(isLoaded === false){
      getSearchResult()
      setIsLoaded(true)
    }
  }, [getSearchResult, isLoaded]);
  
  const columns = getColumns()

  const vendorData = vendors.map(row => {
    const updatedRow = {
      ...row,
      vendor_code: row.vendor_code?parseInt(row.vendor_code):''
    };
    return updatedRow;
  });
  
  // Column definitions
  function getColumns(){
    const columns=[
        {name: "vendor_id", label: "ID", 
          options: {filter: false, display: false},
        },
        //parseFloat(
        {name: "vendor_code", label: 'Code',
          options: {filter: false},
        },
        {name: "vendor_name", label: 'Vendor Name',
          options: {filter: false},
        },
        {name: "access_code", label: 'Access Code',
          options: {filter: false},
        },        
        {name: "rate", label: 'Rate',
          options: {filter: false},
        },        
        {name: "email", label: 'Email',
          options: {filter: false},
        },        
        // {name: "street", label: 'Address',
        //   options: {filter: false},
        // },
        {name: "city", label: 'City',
          options: {filter: false},
        },
        {name: "province", label: 'Province',
        },
        {name: "countryname", label: 'Country',
        },
        {name: "is_active", label: 'Activated',
          options: {
            customBodyRender: (value, tableMeta, updateValue) => {
              return( <RegularSwitch  
                        disabled
                        name="is_active"
                        checked={value} 
                      />
              )
            }
          }
        },
        {name: "Detail",
          options: { filter: false, sort: false, empty: true, print: false,
            customBodyRender: (value, tableMeta, updateValue) => {
              return (
                  <IconButton aria-label="view" variant="outlined" color="primary" 
                      onClick={() => 
                        viewVendor(tableMeta.rowData[0]) 
                      }>
                    <ArticleIcon/>
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


  function viewVendor(vendorID){
      setDetailData(vendors.filter(d => d.vendor_id === vendorID))
      setViewOpen(true)
  };

  function handleReloading(){
    getSearchResult()     
  };
  

  return (
    <>

    <Grid container justify="center" style={{ marginTop:'-37px' }}>
      <QuoteBanner2 icon={<ManageAccountsIcon style={{ fontSize:'30px' }}/>} title={`Dashboard.VendorAccount`} subTitle={'Dashboard.VendorAccount.subtitle'} links={[]} />        
    
        <Grid item xs={12} sm={12} md={11}>

          <MUIDataTable
            title= {
              <div>
                <Grid item container style={{ margin:'2vh 0' }}>
                  <Typography className={classes.tableTitle}>
                    <Text tid={'Dashboard.VendorAccount.ListTitle'} />
                  </Typography>
                </Grid>
              </div>    
              }
            // data={vendors}
            data={vendorData}
            columns={columns}
            options={options}
          />

          { detailData[0] &&
              <ViewDetailModal
                accessRole={'ADM'}
                detailData={detailData[0]}
                open={viewOpen}
                handleClose={setViewOpen}
                onConfirm={handleReloading}
              /> 
          }
        </Grid>
    </Grid>
    </>
  );
}