import React, { useEffect, useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { getCreditCard } from '../../../../redux/actions/creditcardAction';
//
import { dateFormat, amountFormat } from '../../../../controllers/dataFormat';

// core component
import { Typography, Grid, TableCell } from '@material-ui/core'
import MUIDataTable from "mui-datatables";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
// component
import Criteria from '../../common/Criteria'
import { QuoteBanner2 } from '../../../../components/common/QuoteBanner2';
import { Text } from '../../../../components/common/LanguageProvider';
import LoadingSpinnerScreen from '../../../../components/common/loadingScreen';
import ProcessUpdateModal from './ProcessUpdateModal'

// icon
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import IconButton from '@material-ui/core/IconButton';
import UpdateIcon from '@material-ui/icons/Update';

//style
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';


const useStyles = makeStyles(dashboardStyles)

// status
const codes = [
    { code_name: 'Pending', code_desc: "Pending" },
    { code_name: 'Approved', code_desc: "Approved" },
    { code_name: 'Request Update', code_desc: "Request Update" },
    { code_name: 'Cancelled', code_desc: "Cancelled" },
    { code_name: 'Void', code_desc: "Void" }
  ]


export default function SearchCreditCard(props) { 
    // const { vendorID, user } = props;
    const { vendorID } = props;

  const classes = useStyles();

  const dispatch = useDispatch();
  const creditcards = useSelector(state => state.creditcardReducer.creditcards)
  const loadingRefundList = useSelector(state => state.creditcardReducer.loading)
  // update
  const updateResult = useSelector(state => state.creditcardReducer.updatedCreditcard)
  const updateError = useSelector(state => state.creditcardReducer.error)
  const updateLoading = useSelector(state => state.creditcardReducer.UpdatedLoading)
  // run useEffect only once when first render
  const [isLoaded, setIsLoaded] = useState(false)


  // criteria
  const [criteriaData, setCriteriaData] = useState({
    fromDate: new Date().toISOString().substring(0,8)+'01',
    toDate: new Date().toISOString().substring(0,10)
  })

const [alertOpen, setAlertOpen] = useState(false)
// const [alert, setAlert] = useState('') 
// update status modal
const [updateOpen, setUpdateOpen] = useState(false);
const [updateData, setUpdateData] = useState([]);


// update status 
function updateCreditCard(creditcardId){
setUpdateData(creditcards.filter(d => d.creditcard_id === creditcardId ))
setUpdateOpen(true)
};

// re get credit card list after updating
function handleConfirm(resultMessage){
// console.log("pop up update message ")
if (resultMessage === 'success'){
    getSearchResult()
}

};

  const [selectedRows, setSelectedRows] = useState()
//   const [selectedRows] = useState()
  const [currentPage, setCurrentPage] = useState(0)
//   const [rowsSelected, setRowsSelected] = useState([])
  const [rowsSelected] = useState([])



  const getSearchResult = useCallback(() => {
    dispatch(getCreditCard({fr:criteriaData.fromDate,to:criteriaData.toDate, vendor_id:vendorID}))
    // dispatch(getCreditCard())
  }, [dispatch, criteriaData.fromDate, criteriaData.toDate, vendorID]);
// }, [dispatch, vendorID]);

  // run useEffect only once when first render
  useEffect(() => {
    if(isLoaded === false){
      getSearchResult()
      setIsLoaded(true)
    }
  }, [getSearchResult, isLoaded]);


  const creditcardData = creditcards && creditcards.length > 0 
        ? creditcards.map(row => {
              const updatedRow = {
                ...row,
                creditcardId: row.creditcard_id,
                // createdDate: row.created_at,
                createdDate: dateFormat(new Date(row.created_at+'T00:00:00')),
                name: row.lastname+','+row.firstname,
                email: row.email,
                // amount: '$ '+ row.payment_amount,
                amount: amountFormat(row.payment_amount,2),
                cardHolder: row.card_holder,
                status: row.status
              };
              return updatedRow;
          })
        :[];
// console.log(creditcardData)
  // Column definitions
  function getColumns(){
    const columns=[
        {name: "creditcardId", label: "Id", 
          options: {filter: true, display: true, download: false, print: false}
        },
        {name: "createdDate", label: Text({tid:'Dashboard.Table.CreatedDate'}),
        options: {filter: true, display: true, download: false, print: false}
        },
        {name: "name", label: Text({tid:'Dashboard.Table.Name'}),
          options: {filter: true}
        },
        {name: "email", label: Text({tid:'Quote.Email'}), 
        options: {filter: true}
        },
        {name: "amount", label: Text({tid:'Quote.PaymentAmount'}), 
        options: {filter: true}
        },          
        {name: "cardHolder", label: Text({tid:'Dashboard.Table.CardHolder'}),
          options: {filter: true}
        },
        {name: "status", label: Text({tid:'Dashboard.Table.Status'}),
          options: {filter: true}
        },
        // update process
        {name: "update", label: 'Update Process',
          options: { filter: false, sort: false, empty: true, download: false, print: false,
            customHeadRender: (columnMeta) => {
              return(
                <TableCell key={columnMeta.label} style={{ fontSize:'12px', fontWeight:'600'}}>
                  {columnMeta.label}
                </TableCell>
              );
            },
        customBodyRender: (values,tableMeta) => {
              return (
                  <IconButton aria-label="edit" variant="outlined" color="primary" 
                      // disabled = {( === 'Accepted')? false : true}
                    //   disabled = {tableMeta.rowData[3] === 'ZCRM' 
                    //                 ? true
                    //                 :(tableMeta.rowData[11] === 'Draft'|| tableMeta.rowData[11] === 'Modifying'|| tableMeta.rowData[11].slice(0,1) === 'R'
                    //                   || tableMeta.rowData[9].filter(f=>new Date(f)> current).length===0)
                    //                   ? true : false}
                      onClick={() =>{ 
                            setSelectedRows(tableMeta.rowIndex)  
                            updateCreditCard(tableMeta.rowData[0])
                            // console.log(tableMeta.rowData)

                      }}>
                    <UpdateIcon/>
                    {/* {tableMeta.rowData[9].filter(f=>f>new Date())} */}
                  </IconButton>
              );
            }
          }
        },      
      ]
    return (columns)
  }

  const columns = getColumns()

  const options = {
    filter: true,
    filterType: "dropdown",
    selectableRows: 'single', //'single', //'none',  //'multiple',
    selectableRowsHideCheckboxes: true,
    // responsive: "vertical",
    responsive: "standard",
    rowStyle: {height: 30},
    viewColumns: false,
    // download: true,
    // print: true,  
    page: currentPage,
    rowsSelected: rowsSelected,
    onChangePage (currentPage) {
      setCurrentPage(currentPage);
    },  

    expandableRows: true,
    expandableRowsOnClick: true,
    // onRowClick: (creditcards) => {
    //   console.log(creditcards);
    // },
    rowsExpanded: [selectedRows],
    renderExpandableRow: (rowData, rowMeta) => {      
      const clickedData = (creditcards.filter(d => d.creditcard_id === rowData[0]))[0]
    //console.log(clickedData)
      return (
        clickedData &&
        <tr>
        <td colSpan={12}>
            {!updateError && !updateLoading && updateResult && alertOpen && selectedRows ===rowMeta.rowIndex &&(
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
          <Grid container justify='flex-end'>
              {/* Applicant */}
              <Grid item xs={12} sm={12} md={12} lg={4} style={{ border:'1px solid #ddd', margin:'1vh' }}>
                    <Grid item container style={{ background:'#efefef', padding:'1vh', fontWeight:'700' }}>
                      <PersonIcon/> Applicant
                    </Grid>             
                    <Grid item container xs={12} sm={12} style={{ padding:'1vh', fontSize:'12px', fontWeight:'500' }}>
                      <Grid item container xs={12}>
                        <Grid item xs={6}>
                          <span style={{ color:'#666' }}><Text tid={'Quote.FullName'} /></span>
                        </Grid>
                        <Grid item xs={6}>
                          <span style={{ fontWeight:'700' }}>{clickedData.lastname}, {clickedData.firstname}</span>
                        </Grid>
                      </Grid>
                      <Grid item container xs={12}>
                        <Grid item xs={6}>
                          <span style={{ color:'#666' }}><Text tid={'Quote.Email'} /></span>
                        </Grid>
                        <Grid item xs={6}>
                          <span style={{ fontWeight:'700' }}>{clickedData.email}</span>
                        </Grid>
                      </Grid>
                      <Grid item container xs={12}>
                        <Grid item xs={6}>
                          <span style={{ color:'#666' }}><Text tid={'Quote.PaymentAmount'} /></span>
                        </Grid>
                        <Grid item xs={6} style={{ color:''}}>
                          <span style={{ fontWeight:'700' }}>$ {clickedData.payment_amount}</span>
                        </Grid>
                      </Grid>
                      <Grid item container xs={12}>
                        <Grid item xs={6}>
                          <span style={{ color:'#666' }}><Text tid={'Quote.CreateDate'} /></span>
                        </Grid>
                        <Grid item xs={6}>
                          <span style={{ fontWeight:'700' }}>{clickedData.created_at}</span>
                        </Grid>
                      </Grid>
                    </Grid>
              </Grid>
              {/* Card */}
              <Grid item xs={12} sm={12} md={12} lg={6} style={{ border:'1px solid #ddd', margin:'1vh' }}>
                    <Grid item container style={{ background:'#efefef', padding:'1vh', fontWeight:'700' }}>
                      <Grid item xs={12} sm={12} md={8}>
                      <CreditCardIcon/> Credit Card
                      </Grid>
                      <Grid item xs={12} sm={12} md={4} style={{ textAlign:'right' }}>
                        <span className={classes.inputValue} style={{ color:"#8cc63f", fontSize:'14px' }}>{clickedData.staus}</span>
                      </Grid>
                    </Grid>             
                    <Grid item container xs={12}style={{ padding:'1vh', fontSize:'12px', fontWeight:'500' }}>
                      <Grid item container xs={12}>
                        <Grid item xs={5}>
                          <span style={{ color:'#666' }}><Text tid={'Quote.CardHolderName'} /></span>
                        </Grid>
                        <Grid item xs={7}>
                          <span style={{ fontWeight:'700' }}>{clickedData.card_holder}</span>
                        </Grid>
                      </Grid>
                    </Grid>  
                    <Grid item container xs={12} sm={12} md={12} style={{ padding:'1vh', fontSize:'12px', fontWeight:'500' }}>
                      <Grid item container xs={12}>
                        <Grid item xs={5}>
                          <span style={{ color:'#666' }}><Text tid={'Quote.CreditCardNumber'} /></span>
                        </Grid>
                        <Grid item xs={7}>
                          <span style={{ fontWeight:'700' }}>{clickedData.creditcard_number}</span>
                        </Grid>
                      </Grid>
                    </Grid> 
                    <Grid item container xs={12} sm={12} md={12} style={{ padding:'1vh', fontSize:'12px', fontWeight:'500' }}>
                      <Grid item container xs={12}>
                        <Grid item xs={5}>
                          <span style={{ color:'#666' }}><Text tid={'Quote.CardExpiration'} /></span>
                        </Grid>
                        <Grid item xs={7}>
                          <span style={{ fontWeight:'700' }}>{clickedData.card_expired}</span>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item container xs={12} sm={12} md={12} style={{ padding:'1vh', fontSize:'12px', fontWeight:'500' }}>
                      <Grid item container xs={12}>
                        <Grid item xs={5}>
                          <span style={{ color:'#666' }}><Text tid={'Quote.CardCVV'} /></span>
                        </Grid>
                        <Grid item xs={7}>
                          <span style={{ fontWeight:'700' }}>{clickedData.card_cvv}</span>
                        </Grid>
                      </Grid>
                    </Grid>
              </Grid>
          </Grid>

        </td>
        </tr>

      );
    },
  };


  return (
    <Grid container justify='center'>
      <Grid item container style={{ marginTop:'-37px' }}>         
        <QuoteBanner2 title={'Dashboard.CreditCard'} subTitle={'Dashboard.CreditCard.SubTitle'} links={[]}/>
      </Grid>  

      <Grid item container xs={12} sm={12} justify='center' style={{ marginBottom:'5vh' }}>
        <Grid item xs={12} style={{ margin:'3vh 5vh' }}>
          {loadingRefundList
              ? 
                <LoadingSpinnerScreen/>
              :
                <MUIDataTable
                  title= {
                    <div>
                      <Grid item container style={{ margin:'2vh 0' }}>
                        <Typography className={classes.tableTitle}>
                          <ArticleIcon style={{ marginRight:'5px'}} />
                          <Text tid={'Dashboard.CreditCard.List.Title'} />
                        </Typography>
                      </Grid>
                      <Criteria
                        criteriaData = {criteriaData}
                        setCriteriaData = {setCriteriaData}
                        onClick ={getSearchResult}
                      />
                    </div>    
                    }
                  data={creditcardData}
                  columns={columns}
                  options={options}
                />
            }

        </Grid>
      </Grid>

      {updateData[0] &&
          <ProcessUpdateModal
            updateData={updateData}
            // statusProcess = {updateData[0].app_status}
            statusCodes={codes}
            open={updateOpen}
            setOpen={setUpdateOpen}
            onConfirm={handleConfirm}
          /> 
        }
    </Grid>
    
  )
}


