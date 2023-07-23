import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// redux
import { getVendorStatementsByVendor } from '../../../redux/actions/salesAction';
//  AWS S3
import { getFileFromS3 } from '../../../redux/actions/s3Action';
//core components
import { makeStyles } from '@material-ui/styles'
import {
  Grid, Typography,
  Radio, RadioGroup, FormControlLabel, FormControl,
  TableFooter, TableCell, TableRow
} from '@material-ui/core'
import MUIDataTable from "mui-datatables";
// common customized components
import { QuoteBanner2 } from '../../../components/common/QuoteBanner2';
import Criteria from './Criteria'
import { Text } from '../../../components/common/LanguageProvider'
import LoadingSpinnerScreen from '../../../components/common/loadingScreen';

//
import { monthFormat } from '../../../controllers/dataFormat';
import { amountFormat } from '../../../controllers/dataFormat';
// PDF Viewer
import PDFViewer from "../../../components/common/PDFViewer/AllPageViewer";
import { download } from '../../../functionalities/downloadFile';
// icon
import PreviewIcon from '@mui/icons-material/Preview';
import GetAppIcon from '@material-ui/icons/GetApp'
import { IconButton } from '@material-ui/core';
import ArticleIcon from '@mui/icons-material/Article';
//style
import dashboardStyles from '../../../assets/jss/styles/dashboardStyle';


export default function SalesReport(props) { 
  const { vendorID } = props;

  const useStyles = makeStyles(dashboardStyles)
  const classes = useStyles();

  const dispatch = useDispatch();
  // Statement
  const statements = useSelector(state => state.salesReducer.statements)
  const file = useSelector(state => state.s3Reducer.file)
  const loading = useSelector(state => state.s3Reducer.loading)
  const error = useSelector(state => state.s3Reducer.error)
  const loadingReports = useSelector(state => state.salesReducer.loading)

  // run useEffect only once when first render
  const [isLoaded, setIsLoaded] = useState(false)

  // criteria
  const [criteriaData, setCriteriaData] = useState({
    fromDate: new Date().toISOString().substring(0,4)+'-01', //'2021-01',
    toDate: new Date().toISOString().substring(0,7)
  })  

  const [formatType, setFormatType]= useState('L')

  const getSearchResult = useCallback(() => {
        dispatch(getVendorStatementsByVendor({fr:criteriaData.fromDate.replace('-',''),to:criteriaData.toDate.replace('-',''), vendor_id:vendorID}))
  }, [dispatch, criteriaData.fromDate, criteriaData.toDate, vendorID]);

  // run useEffect only once when first render
  useEffect(() => {
    if(isLoaded === false){
      getSearchResult()
      setIsLoaded(true)
    }
  }, [getSearchResult, isLoaded]);


  // PDF Viewer
  const [openPDFViewer, setOpenPDFViewer] = useState(false);
  const [filePDF, setFilePDF] = useState([])
  const [viewType, setViewType] = useState('')


  // get sales document
  function getDocumentFromS3(viewType,file_name){
    // setSelectedRows(selectedRow)
    setFilePDF(file_name.split('/'))
    setViewType(viewType)
    setOpenPDFViewer(true)
    dispatch(getFileFromS3({type:`Statement`, fileName:file_name.split('/')[1]})) 
  }

  //
  const statementsData = statements.map(row => {
    const updatedRow = {
      ...row,
      vendorName: row.vendor_name,
      salesDate: row.sales_date,
      insuranceStatementNum: row.invoice_document,
      insurancePremium: parseFloat(row.premium_amount),
      insuranceRefund: parseFloat(row.refund_amount),
      insuranceRebate: parseFloat(row.rebate),
      carewellStatementNum: row.carewell_invoice_document,
      carewellService: parseFloat(row.carewell_service_amount),  
      carewellRefund: parseFloat(row.carewell_refund),  
      carewellRebate: parseFloat(row.carewell_rebate),
    };
    return updatedRow;
  });


  // group by insuranceCompany, policyNum for uploading refund request form files
  var obj = Object.create(null)
  const summaryStatementData = []
  statements.forEach(function (o) {
      var key = ['vendor_name'].map(function (k) { return o[k]; }).join('|');
      if (!obj[key]) {
          obj[key] = { vendorName: o.vendor_name, 
                      insurancePremium: 0, insuranceRefund: 0, insuranceRebate: 0,
                      carewellService: 0, carewellRefund: 0, carewellRebate: 0 };
          summaryStatementData.push(obj[key]);
      }
      obj[key].insurancePremium += parseFloat(o.premium_amount?o.premium_amount:0);
      obj[key].insuranceRefund += parseFloat(o.refund_amount?o.refund_amount:0);
      obj[key].insuranceRebate += parseFloat(o.rebate?o.rebate:0);
      obj[key].carewellService += parseFloat(o.carewell_service_amount?o.carewell_service_amount:0);
      obj[key].carewellRefund += parseFloat(o.carewell_refund?o.carewell_refund:0);
      obj[key].carewellRebate += parseFloat(o.carewell_rebate?o.carewell_rebate:0);
  });

  // Column definitions
  const columns = getColumns()
  function getColumns(){
    const columns=[
        {name: "vendorName", label: 'Vendor',
          options: {filter: (vendorID==='*'? true: false), display: (vendorID==='*'? true: false)},
        },
        {name: "salesDate", label: Text({tid:'Dashboard.Table.SalesDate'}),
          options: {filter: false, display: (formatType==='L'? true: false),
            customBodyRender: (value) => {
              return (value?monthFormat(new Date(value.substring(0,4) +'-'+ value.slice(4)+'-01T00:00:00')):null);
              }
            }
          },
        {name: "insuranceStatementNum", label: Text({tid:'Dashboard.Table.InsuranceDocNum'}),
          options: {filter: false, display: (formatType==='L'? true: false),},
        },
        {name: "insurancePremium", label: Text({tid:'Dashboard.Table.Premium'}), 
          options: {filter: false, 
            setCellProps: () => ({ style: {textAlign: 'right' }}),
            customBodyRender: (value) => { 
              return ( amountFormat(value,2) );  
            }
          },
        },
        {name: "insuranceRefund", label: Text({tid:'Dashboard.Table.RefundAmount'}),
          options: {filter: false,
            setCellProps: () => ({ style: {textAlign: 'right' }}),
            customBodyRender: (value) => {   
              return ( amountFormat(value,2) );
            }
          },
        },
        {name: "insuranceRebate", label: Text({tid:'Dashboard.Table.ReferralFee'}),
          options: {filter: false,
            setCellProps: () => ({ style: {textAlign: 'right' }}),
            customBodyRender: (value) => {   
              return ( amountFormat(value,2) );
            }
          },
        },
        {name: "document", label: Text({tid:'Dashboard.Table.Document'}), 
          options: { filter: false, sort: false, empty: true, download: false, print: false, 
                      display: (formatType==='L'? true: false), 
            customHeadRender: (columnMeta) => {
              return(
                <TableCell 
                  key={columnMeta.label} 
                  align	= 'center' 
                  style={{ fontSize:'12px', fontWeight:'600'}}
                >
                  {columnMeta.label}
                </TableCell>
              );
            },          
            setCellProps: () => ({ style: {textAlign: 'center' }}),
            customBodyRender: (value, tableMeta) => {   
              // console.log(tableMeta.rowData)
              return (
                <>
                  {tableMeta.rowData[1]
                    ?
                      <>
                      {/* view */}
                      <IconButton aria-label="view" color="primary"
                        style={{ borderRadius:'0', padding:'0', margin:'0 2px' }} 
                        onClick={(e) => {
                          getDocumentFromS3('view', `Statement/${tableMeta.rowData[2]}.pdf`)
                        }}
                        ><PreviewIcon/>
                      </IconButton>
                      {/* download */}
                      <IconButton aria-label="view" color="primary"
                        style={{ borderRadius:'0', padding:'0', margin:'0 2px' }} 
                        onClick={() => {
                          getDocumentFromS3('download', `Statement/${tableMeta.rowData[2]}.pdf`)
                        }}
                        ><GetAppIcon/>
                      </IconButton>
                    </>
                    : null
                  }
                </>
              );
            }
          }
        },
        {name: "carewellStatementNum", label: Text({tid:'Dashboard.Table.CarewellDocNum'}),
          options: {filter: false, display: (formatType==='L'? true: false)},
        },
        {name: "carewellService", label: Text({tid:'Dashboard.Table.CarewellFee'}),
          options: {filter: false,
            setCellProps: () => ({ style: {textAlign: 'right' }}),
            customBodyRender: (value) => {   
              return ( value? amountFormat(value,2) : null);
            }
          },
        },
        {name: "carewellRefund", label: Text({tid:'Dashboard.Table.RefundAmount'}),
          options: {filter: false,
            setCellProps: () => ({ style: {textAlign: 'right' }}),
            customBodyRender: (value) => {   
              return ( value? amountFormat(value,2) : null);
            }
          },
        },
        {name: "carewellRebate", label: Text({tid:'Dashboard.Table.ReferralFee'}),
          options: {filter: false,
            setCellProps: () => ({ style: {textAlign: 'right' }}),
            customBodyRender: (value) => {   
              return ( value? amountFormat(value,2) : null);
            }
          },
        },
        {name: "carewellStatementNum", label: Text({tid:'Dashboard.Table.Document'}),
          options: { filter: false, sort: false, empty: true, download: false, print: false,
                      display: (formatType==='L'? true: false),
            customHeadRender: (columnMeta) => {
              return(
                <TableCell 
                  key={columnMeta.label+'carewell'} 
                  align	= 'center' 
                  style={{ fontSize:'12px', fontWeight:'600'}}
                >
                  {columnMeta.label}
                </TableCell>
              );
            },  
            setCellProps: () => ({ style: {textAlign: 'center' }}),
            customBodyRender: (value, tableMeta) => { 
              return (
                <>
                  {tableMeta.rowData[7]
                    ?
                      <>
                      {/* view */}
                      <IconButton aria-label="view" color="primary"
                        style={{ borderRadius:'0', padding:'0', margin:'0 2px' }} 
                        onClick={(e) => {
                          getDocumentFromS3('view', `Statement/${tableMeta.rowData[7]}.pdf`)
                        }}
                        ><PreviewIcon/>
                      </IconButton>
                      {/* download */}
                      <IconButton aria-label="view" color="primary"
                        style={{ borderRadius:'0', padding:'0', margin:'0 2px' }} 
                        onClick={() => {
                          getDocumentFromS3('download', `Statement/${tableMeta.rowData[7]}.pdf`)
                        }}
                        ><GetAppIcon/>
                      </IconButton>
                    </>
                    : null
                  }
                </>
              );
            }
          }
        },

        
      ]
    return (columns)
  }


  const options = {
    filter: (vendorID==='*'? true: false),
    filterType: "checkbox", //"dropdown", //
    selectableRows: 'none',  //'multiple',
    // responsive: "vertical",
    responsive: "standard", // stacked
    // showTitle: false,
    // search: false,
    rowStyle: {height: 30},
    viewColumns: false,
    download: true,
    print: true,   
    expandableRows: false,
    rowsPerPageOptions: [5, 10, 50], 
    // footer summary
    customTableBodyFooterRender: function(opts) {
      let sumInsurancePremium = 0
      let sumInsuranceRefund = 0
      let sumInsuranceRebate = 0
      let sumCarewellService = 0
      let sumCarewellRefund = 0
      let sumCarewellRebate = 0

      if (opts.data.length > 0) {

        sumInsurancePremium =
            opts.data.reduce((accu, item) => {
              return accu + parseFloat(item.data[3]?item.data[3].replace(/\$|,/g, ''):0);
            }, 0);
        sumInsuranceRefund =
            opts.data.reduce((accu, item) => {
              return accu + parseFloat(item.data[4]?item.data[4].replace(/\$|,/g, ''):0);
            }, 0);
        sumInsuranceRebate =
            opts.data.reduce((accu, item) => {
              return accu + parseFloat(item.data[5]?item.data[5].replace(/\$|,/g, ''):0);
            }, 0);
        sumCarewellService =
            opts.data.reduce((accu, item) => {
              return accu + parseFloat(item.data[8]?item.data[8].replace(/\$|,/g, ''):0);
            }, 0);
        sumCarewellRefund =
            opts.data.reduce((accu, item) => {
              return accu + parseFloat(item.data[9]?item.data[9].replace(/\$|,/g, ''):0);
            }, 0);
        sumCarewellRebate =
            opts.data.reduce((accu, item) => {
              return accu + parseFloat(item.data[10]?item.data[10].replace(/\$|,/g, ''):0);
            }, 0);
      }

      return (
        <TableFooter >
          <TableRow >
          {formatType==='L'&&<TableCell/>}
          {(formatType==='L' && vendorID==='*')&&<TableCell/>}
          <TableCell><strong>Total :</strong> </TableCell>
          <TableCell  align='right'>
            <strong>{amountFormat(sumInsurancePremium,2)}</strong>
          </TableCell>
          <TableCell  align='right'>
            <strong>{amountFormat(sumInsuranceRefund,2)}</strong>
          </TableCell>
          <TableCell  align='right'>
            <strong>{amountFormat(sumInsuranceRebate,2)}</strong>
          </TableCell>
          {formatType==='L'&&<TableCell/>}
          {formatType==='L'&&<TableCell/>}
          <TableCell  align='right'>
            <strong>{amountFormat(sumCarewellService,2)}</strong>
          </TableCell>
          <TableCell  align='right'>
            <strong>{amountFormat(sumCarewellRefund,2)}</strong>
          </TableCell>
          <TableCell  align='right'>
            <strong>{amountFormat(sumCarewellRebate,2)}</strong>
          </TableCell>
          {formatType==='L'&&<TableCell/>}
          </TableRow>
        </TableFooter>
      );
    },  
    
  };

  return (
    <Grid container justify='center'>
      <Grid item container style={{ marginTop:'-37px' }}>         
        <QuoteBanner2 title={'Dashboard.Reports'} subTitle={'Dashboard.Reports.SubTitle'} links={[]}/>
      </Grid>  

      <Grid item container xs={12} sm={12} justify='center' style={{ marginBottom:'5vh' }}>
        {statements &&
          <Grid item xs={12} style={{ margin:'3vh 5vh' }}>
            {loadingReports
              ? 
                <LoadingSpinnerScreen/>
              :
              <MUIDataTable
                title= {
                  <div>
                    <Grid item container style={{ margin:'2vh 0' }}>
                      <Typography className={classes.tableTitle}>
                        <ArticleIcon style={{ marginRight:'5px'}} />
                        <Text tid={'Dashboard.SalesStatement'} />
                      </Typography>
                    </Grid>
                    <Grid item container>
                      <Criteria
                        dateType = {'M'}
                        criteriaData = {criteriaData}
                        setCriteriaData = {setCriteriaData}
                        onClick ={getSearchResult}
                      />
                      {vendorID==='*' &&
                        <FormControl>
                          <RadioGroup style={{alignItems: 'flex-start'}}
                            name="formatType"
                            value = {formatType}
                            onChange={(e)=>{setFormatType(e.target.value)}}
                          >
                            <FormControlLabel value="L" control={<Radio />} label="List" />
                            <FormControlLabel value="S" control={<Radio />} label="Summary" />
                          </RadioGroup>
                        </FormControl>
                      }
                      </Grid>
                  </div>     
                  }
                data={formatType==='L'?statementsData:summaryStatementData}
                columns={columns}
                options={options}
              />
            }
          </Grid>
        }
      </Grid>

      {/* pdf viewer  */}
      {!error && !loading && file && file.Body && openPDFViewer === true && (
          viewType === 'view' 
          ?
            <PDFViewer
              title={'Sales'}
              pdf={new Uint8Array(file.Body.data).buffer} 
              openPDFViewer={openPDFViewer}
              setOpenPDFViewer={setOpenPDFViewer}
            />
          :
          <>
            {setOpenPDFViewer(download(new Blob([new Uint8Array(file.Body.data).buffer], {type: 'application/pdf'}), filePDF[1]))}
          </>
        )}

    </Grid>
  )
}
