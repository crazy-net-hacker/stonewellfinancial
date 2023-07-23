import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { getInsurancePlan, updateInsurancePlan } from '../../../../redux/actions/insurancePlans';
//
import { Grid, Checkbox, Typography, TableCell, FormControlLabel } from '@material-ui/core'
import MUIDataTable from "mui-datatables";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
// common customized components
import { QuoteBanner2 } from '../../../../components/common/QuoteBanner2';
import { RegularSwitch } from '../../../../components/common/CustomSwitch';
import { RegularTextFieldSmall, SelectTextFieldSmall } from '../../../../components/common/CustomTextFields/TextFieldSmall';
import Button from '../../../../components/common/CustomButtons/Button'
import CustomNumberFormat from '../../../../components/common/CustomNumberFormat' 
// functionalities
import { amountFormat } from '../../../../controllers/dataFormat';
// icons
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
//style
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';

const useStyles = makeStyles(dashboardStyles)

// Group by 
const planListGroup = (data) => {
  var obj = Object.create(null);
  const group = [];
  data.forEach(function (o) {
      var key = ['insured_type','company_name', 'primary_coverage_type','trip_type','plan_id','generic_name','generic_name_kr','type_deduct','is_deleted'].map(function (k) { return o[k]; }).join('|');
      if (!obj[key]) {
        obj[key] = {insured_type: o.insured_type, 
                    insuredTypeSeq: o.insured_type === 'STUDENT' ? 1 : (o.insured_type === 'VISITOR' ? 2 : 3),
                    company_name: o.company_name,
                    companySeq: o.company_name === 'Allianz' ? 1 : (o.company_name === 'Tugo' ? 2 : 3),
                    primary_coverage_type: o.primary_coverage_type,
                    coverageSeq: o.primary_coverage_type==='MED'?1:2,
                    trip_type: o.trip_type,
                    tripTypeSeq: o.trip_type==='SINGLE'?1:2,
                    plan_id: o.plan_id,
                    generic_name: o.generic_name,
                    generic_name_kr: o.generic_name_kr,
                    type_deduct : o.type_deduct,
                    is_deleted : o.is_deleted
                    };
        group.push(obj[key]);
      }
      // obj[key].persons.push(o);
    });  
  return (group)
}  

// Group by 
const coverageGroup = (data) => {
  var obj = Object.create(null);
  const group = [];
  data.forEach(function (o) {
      var key = ['product_id','price_code'].map(function (k) { return o[k]; }).join('|');
      if (!obj[key]) {
        obj[key] = {product_id: o.product_id, 
                    price_code: o.price_code 
                    };
        group.push(obj[key]);
      }
      // obj[key].persons.push(o);
    });  
  return (group)
}


export default function InsurancePlanRate(props) { 

  const classes = useStyles();
  
  const dispatch = useDispatch();
  const plans = useSelector(state => state.insurancePlanReducer.insurancePlans)
  const loading = useSelector(state => state.insurancePlanReducer.loading)
  const updatedResult = useSelector(state => state.insurancePlanReducer.updatedResult)
  const UpdatedLoading = useSelector(state => state.insurancePlanReducer.UpdatedLoading)
  const UpdatedError = useSelector(state => state.insurancePlanReducer.UpdatedError)

  // run useEffect only once when first render
  const [isLoaded, setIsLoaded] = useState(false)
  // set selectedPlan
  const [selectedPlan, setSelectedPlan] =  useState({})
  const [selectedPlanCoverage, setSelectedPlanCoverage] =  useState([])
  // set filter
  const [insuranceSelectedFilter, setInsuranceSelectedFilter] = useState(["STUDENT"]);
  const [coverageTypeSelectedFilter, setcoverageTypeSelectedFilter] = useState(["MED"]);
  const [selectedPlanFilter, setSelectedPlanFilter] = useState()
  // set selectedRows
  const [selectedRows, setSelectedRows] = useState()
  // const [currntPage, setCurrntPage] = useState(0)
  // const [rowsExpanded, setRowsExpanded] = useState()
  // 
  const [editMode, setEditMode] = useState('')
  const [increaseRate, setIncreaseRate] = useState(0)
  const [restoreAll, setRestoreAll] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [showError, setShowError] = useState(false)
  const [isUpdated, setIsUpdated] =  useState(false)

  // run useEffect only once when first render
  useEffect(() => {
    if(isLoaded === false){
      dispatch(getInsurancePlan())
      setIsLoaded(true)
    }
  }, [dispatch,isLoaded]);
  
  // re-rendering after updating 
  useEffect(() => {
    if (!loading && isUpdated===true ){
      const plansData = plans.filter(f=>f.insured_type === selectedPlanFilter.insured_type
                                      && f.company_name === selectedPlanFilter.company_name
                                      && f.trip_type=== selectedPlanFilter.trip_type
                                      && f.primary_coverage_type === selectedPlanFilter.primary_coverage_type
                                      && f.plan_id ===  selectedPlanFilter.plan_id
                      );
      plansData.map(row=>(row.selectedRestore = false))
      setSelectedPlan(plansData);
      
      setIsUpdated(false)
    }
  }, [loading, isUpdated, plans, selectedPlanFilter]);

  // reset
  function resetCriteria(){
    setEditMode('');
    setIncreaseRate(0);
    setSelectedRows();
    setRestoreAll(false);  
  } 

  // Plan List
  const planList = planListGroup(plans);

  // Column definitions
  const planListColumns = getPlanListColumns()
  function getPlanListColumns(){
    const columns1=[
        {name: "insured_type", label: "Insurance", 
          options: { 
            filterList: insuranceSelectedFilter 
            // customFilterListOptions: { 
            //   render: v => `Insurance: ${v}` },
            // filterType: 'checkbox',
          }
        },
        {name: "company_name", label: "Company", 
        },
        {name: "trip_type", label: 'Trip Type',        
        },
        {name: "primary_coverage_type", label: 'Coverage Type',
          options: { 
            filterList: coverageTypeSelectedFilter,
          }
        },
        {name: "plan_id", label: 'Plan ID',
          options: {filter: false,  display: false},
        },
        {name: "generic_name", label: "Plan Name(EN)", 
          options: {filter: false},
        },
        {name: "generic_name_kr", label: "Plan Name(KO)", 
          options: {filter: false},
        },
        {name: "is_deleted", label: "Unused", 
          options: {filter: false,
            customBodyRender: (value) => {
                    return ( 
                      <RegularSwitch  
                        disabled
                        checked={value} 
                      />
                      
                    )
                  }
            },
        },
      ]
    return (columns1)
  }
  
  const planListOptions = {
    filter: true, // set data filter option
    onFilterChange: (changedColumn, filterList) => {
      resetCriteria()
      setSelectedPlan({}) ;
      if(changedColumn==='insured_type'){
        setInsuranceSelectedFilter(filterList[0]); 
      }else if(changedColumn ==='primary_coverage_type'){
        setcoverageTypeSelectedFilter(filterList[3]);
      }
    },
    responsive: "standard",
    rowStyle: {height: 30},
    selectableRows: 'none',
    onRowClick: (selectedRows ) => {
      resetCriteria()
      setSelectedPlanFilter({insured_type : selectedRows[0],
                              company_name : selectedRows[1],
                              trip_type : selectedRows[2],
                              primary_coverage_type : selectedRows[3],
                              plan_id :  selectedRows[4]
      })
      const plansData = plans.filter(f=>f.insured_type === selectedRows[0]
                                        && f.company_name === selectedRows[1]
                                        && f.trip_type=== selectedRows[2]
                                        && f.primary_coverage_type === selectedRows[3]
                                        && f.plan_id ===  selectedRows[4]
                        );            
      // 
      plansData.map(row=>(row.selectedRestore = false))
      //
      setSelectedPlan(plansData);
      setSelectedPlanCoverage([plansData.sort((a,b) => a.price_code - b.price_code)[0].price_code])
    },  
    search: false, // set search 
    rowsPerPage: 3,
    rowsPerPageOptions: [3, 6, 12, 18, 30],
    viewColumns: false,
    download: false,
    print: false,
    // page: currntPage,
    // onChangePage (currentPage) {
    //   setCurrntPage(currentPage);
    // },
  };

  // Plan Detail
  // Column definitions
  const columns = getColumns()
  function getColumns(){
    const columns=[
        {name: "insured_type", label: "insured_type", 
          options: {display: false},
        },
        {name: "company_name", label: "company_name", 
          options: {display: false},
        },
        {name: "trip_type", label: 'trip_type',
          options: {display: false},
        },
        {name: "primary_coverage_type", label: 'primary_coverage_type',
          options: {display: false},
        },
        {name: "plan_id", label: "plan_id", 
          options: {display: false},
        },
        {name: "price_code", label: 'Sum Insured',
          options: {
            customBodyRender: (value) => {
                  return ( amountFormat(value, 0) )
            }
          },
        },
        {name: "period_code", label: 'period_code',
          options: {display: false},
        },
        {name: "rate", label: 'Rate',
        },
        {name: "min_age", label: 'Min_Age',
          options: {
            customHeadRender: (columnMeta) => {
              return(
                <TableCell 
                  key={columnMeta.label} 
                  align	= 'right' 
                  style={{ fontSize:'12px', fontWeight:'600'}}
                >
                  {columnMeta.label}
                </TableCell>
              );
            },  
            setCellProps: () => ({ style: {textAlign: 'right' }}),
          },
        },
        {name: "max_age", label: 'Max_Age',
        },
        {name: "min_period", label: 'Min_Period',
          options: {
            customHeadRender: (columnMeta) => {
              return(
                <TableCell 
                  key={columnMeta.label} 
                  align	= 'right' 
                  style={{ fontSize:'12px', fontWeight:'600'}}
                >
                  {columnMeta.label}
                </TableCell>
              );
            },  
            setCellProps: () => ({ style: {textAlign: 'right'}}),
          },
        },
        {name: "max_period", label: 'Max_Period',
        },
        {name: "premium_rate", label: 'Premium',
          options: {
            customHeadRender: (columnMeta) => {
              return(
                <TableCell 
                  key={columnMeta.label} 
                  align	= 'right' 
                  style={{ fontSize:'12px', fontWeight:'600'}}
                >
                  (Current) {columnMeta.label}
                </TableCell>
              );
            },  
            setCellProps: () => ({ style: {textAlign: 'right' }}),
            customBodyRender: (value, tableMeta, updateValue) => {
              if((editMode ==='A' || editMode ==='R') || (editMode ==='I' && tableMeta.rowIndex === selectedRows)){
                  const currentPremium = plans.filter(f=>f.insured_type === tableMeta.rowData[0]
                                            && f.company_name === tableMeta.rowData[1] 
                                            && f.trip_type=== tableMeta.rowData[2]
                                            && f.primary_coverage_type === tableMeta.rowData[3]
                                            && f.plan_id ===  tableMeta.rowData[4]
                                            && f.price_code ===  tableMeta.rowData[5]
                                            && f.period_code ===  tableMeta.rowData[6]
                                            && f.rate ===  tableMeta.rowData[7]
                                            && f.min_age ===  tableMeta.rowData[8]
                                            && f.max_age ===  tableMeta.rowData[9])[0];
                  const increasedPremium = parseFloat(value) + Math.round(parseFloat(value) * (increaseRate?increaseRate:0))/100;

                  const previousPremium = tableMeta.rowData[16]===true&&tableMeta.rowData[14]&&tableMeta.rowData[14].length>0
                                          ? tableMeta.rowData[14].sort((a,b) => new Date(b.created_at) - new Date(a.created_at))[0].premium_rate
                                          // : currentPremium&&currentPremium.premium_rate?currentPremium.premium_rate:0;
                                          : '-';

                  return(
                    <Grid item container spacing={1}>
                      <Grid item xs={12} sm={12} md={12} lg={6} style={{marginTop:'2vh'}}>
                        {currentPremium&&currentPremium.premium_rate?`(${amountFormat(currentPremium.premium_rate, 2)})`:null}
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={6}>
                        {(editMode==='A' ||editMode==='R')
                          ?
                            <RegularTextFieldSmall
                              disabled={true}
                              name='increasedPremium'
                              value={editMode ==='A'?increasedPremium:previousPremium}
                              InputProps={{
                                inputComponent: CustomNumberFormat,
                                style: { color: "blue" }
                              }}
                            />
                          :
                            <RegularTextFieldSmall
                              name='premium_rate'
                              value={value}
                              onChange={(e)=>{updateValue(e.target.value)}}
                              InputProps={{
                                inputComponent: CustomNumberFormat,
                                style: { color: "blue" }
                              }}
                            />
                        }
                      </Grid>
                    </Grid>
                ) }
                else{
                  return ( amountFormat(value, 2) )
                }
            }
          },
        },
        {name: "calculate_rate", label: 'Rate_Base',
          options: {
            customHeadRender: (columnMeta) => {
              return(
                <TableCell 
                  key={columnMeta.label} 
                  align	= 'right' 
                  style={{ fontSize:'12px', fontWeight:'600'}}
                >
                  {columnMeta.label}
                </TableCell>
              );
            }, 
            setCellProps: () => ({ style: {textAlign: 'center' }}),
          },
        },
        {name: "history", label: 'history',
          options: {display: false},
        },
        {name: '', label: 'Edit', 
          options: { 
            display: (editMode === 'A'||editMode === 'R')?false:true,
            customBodyRender: (value, tableMeta, updateValue) => {
                if(editMode === 'A'||editMode === 'R'||UpdatedLoading){
                  return ('-');
                } else{
                  if (tableMeta.rowIndex === selectedRows){
                      return (
                        <>
                          <SaveIcon 
                              className={classes.icon}
                              aria-label="save"
                              variant="outlined"
                              onClick={() => {
                                const updateData = [{
                                  insured_type:tableMeta.rowData[0],
                                  company_name: tableMeta.rowData[1],
                                  trip_type: tableMeta.rowData[2],
                                  primary_coverage_type: tableMeta.rowData[3],
                                  plan_id: tableMeta.rowData[4],
                                  price_code: tableMeta.rowData[5],
                                  period_code: tableMeta.rowData[6],
                                  rate: tableMeta.rowData[7],
                                  min_age: tableMeta.rowData[8],
                                  max_age: tableMeta.rowData[9],
                                  updated_premium: parseFloat(tableMeta.rowData[12])
                                }]
                                updatePlan(updateData)
                              }}
                          />
                          <CancelIcon
                              className={classes.icon}
                              aria-label="cancel"
                              variant="outlined"
                              onClick={() => {resetCriteria()}}
                          />
                        </>
                      );
                  } else{
                      return (
                        <EditIcon 
                            className={classes.icon}
                            aria-label="edit"
                            variant="outlined"
                            onClick={() => {
                              if(editMode!=='A'||editMode!=='R'){
                                setEditMode('I')
                                setSelectedRows(tableMeta.rowIndex)
                              }
                            }}
                        />
                      );
                  }
              }
          }
        }
      },
      {name: 'selectedRestore', label: 'Restore',
        options: {
          display: editMode === 'R'?true:false,
          customHeadRender: (columnMeta) => {
            return(
              <TableCell 
                key={columnMeta.label} 
                align	= 'right' 
                style={{ fontSize:'12px', fontWeight:'600'}}
              >
                {columnMeta.label}  
                <FormControlLabel
                    style={{ justifyContent:"flex-start" }}
                    control={<Checkbox
                                checked={restoreAll}
                                size="small"
                                name={`restoreAll`}
                                onClick={(e)=>{
                                  setRestoreAll(e.target.checked)
                                  selectedPlan&&selectedPlan.map(row=>(row.selectedRestore = row.history&&row.history.length>0?e.target.checked:false)); 
                                }}
                              />
                    } 
                    label={'All'}
                  />
              </TableCell>
            );
          }, 
          customBodyRender: (value, tableMeta, updateValue) => {
            return(
              <Checkbox
                name='selectedRestore'
                disabled={tableMeta.rowData[14]&&tableMeta.rowData[14].length>0?false:true}
                checked={value}
                onClick={(e)=>{
                  updateValue(e.target.checked)
                    selectedPlan.filter(f=>f.insured_type === tableMeta.rowData[0]
                                            && f.company_name === tableMeta.rowData[1]
                                            && f.trip_type=== tableMeta.rowData[2]
                                            && f.primary_coverage_type === tableMeta.rowData[3]
                                            && f.plan_id ===  tableMeta.rowData[4]
                                            && f.price_code === tableMeta.rowData[5]
                                            && f.period_code === tableMeta.rowData[6]
                                            && f.rate === tableMeta.rowData[7]
                                            && f.min_age === tableMeta.rowData[8]
                                            && f.max_age === tableMeta.rowData[9])
                                  [0].selectedRestore = e.target.checked
                }}
                size="small"
              />
            )
          },
          setCellProps: () => ({ style: {textAlign: 'center' }})
        },
      },
      ]
    return (columns)
  }
  
  const options = {
    filter: false, // set data filter option
    selectableRows: 'none',  //'multiple',
    selectableRowsOnClick: false, 
    responsive: "standard",
    search: false, // set search 
    // rowsPerPage: 20,
    // rowsPerPageOptions: [20, 40, 60, 100],
    jumpToPage: true,
    viewColumns: false,
    download: false,
    print: false,
    expandableRows: true,
    renderExpandableRow: (rowData, rowMeta) => { 
      const planHistory = rowData[14]
      return (
        <tr>
          <td colSpan={9}>
            <Grid container style={{justifyContent:"center", margin:'1vh'}}>
                History
              <Grid item container style={{ border:'1px solid #ddd', marginTop:'1vh', marginLeft:'5vh'}}>
                {planHistory.length > 0
                  ? 
                    <>
                      <Grid item container spacing={1} style={{marginLeft:'2vh', marginBottom:'1vh'}}>
                        <Grid item xs={4}>Changed date</Grid>
                        <Grid item xs={4}>Premium</Grid>
                        <Grid item xs={4}>Rate base</Grid>
                      </Grid>
                      {planHistory.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).map((h,hIndex)=>(
                        <React.Fragment key={hIndex}>
                          <Grid item container spacing={1} style={{marginLeft:'2vh'}}>
                            <Grid item xs={4}>
                              {new Date(h.created_at).toLocaleString('en-CA', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })}
                            </Grid>
                            <Grid item xs={4}>
                              {amountFormat(h.premium_rate,2)}
                            </Grid>
                            <Grid item xs={4}>
                              {h.calculate_rate}
                            </Grid>
                          </Grid>
                        </React.Fragment>
                      ))}
                    </>
                  : <Grid item container spacing={1} style={{padding:'2vh'}}>N/A</Grid>
                } 
              </Grid>
            </Grid>
            <hr/>
          </td>
        </tr>

        );
    }   
  };

  // udpate
  function updatePlan(updateData){
    dispatch(updateInsurancePlan({data:updateData}))
    resetCriteria();
    setAlertOpen(true);
  }

  
  return(
    <Grid container>
      <Grid item container style={{ marginTop:'-37px' }}>         
        <QuoteBanner2 title={'Insurance Plan Rates'} subTitle={''} links={[]}/>
      </Grid>  
      <Grid item container style={{ padding:'1vh 5vh 5vh'}}>
        {/* {loading
          ? null
          :  */}
          <Grid item container spacing={2}>
            {/* Plan List */}
            <MUIDataTable
                title= {'Insurance Plans'}
                data={planList.sort((a,b) => a.insuredTypeSeq - b.insuredTypeSeq || a.companySeq - b.companySeq || a.coverageSeq - b.coverageSeq || a.tripTypeSeq - b.tripTypeSeq)}
                columns={planListColumns}
                options={planListOptions}
              />
            {/* Plan Detail */}
            {selectedPlan.length>0 &&
              <Grid item container spacing={2}>
                <Grid item xs={3} style={{  background:'#FFFFFF', marginTop:'1vh', marginBottom:'1vh' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} container spacing={0}>
                      <Grid item xs={6}>
                        <label className={classes.productLable}> Insurance</label>
                        <Typography style={{ fontWeight:'600' }}>            
                          {selectedPlan[0].insured_type}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <label className={classes.productLable}> Company</label>
                        <Typography style={{ fontWeight:'600' }}>            
                          {selectedPlan[0].company_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <label className={classes.productLable}> Coverage Type</label>
                        <Typography style={{ fontWeight:'600' }}>            
                          {selectedPlan[0].primary_coverage_type}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <label className={classes.productLable}> Trip Type</label>
                        <Typography style={{ fontWeight:'600' }}>            
                          {selectedPlan[0].trip_type}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <label className={classes.inputLabelhorizontal}> Plan Name(KO)</label>
                        <Typography style={{ fontWeight:'600' }}>            
                          {selectedPlan[0].generic_name_kr}
                        </Typography>
                      </Grid>
                      {/* <Grid item xs={12}>
                        <label className={classes.inputLabel}> Plan Name(EN)</label>
                        <Typography style={{ fontWeight:'600' }}>            
                          {selectedPlan[0].generic_name}
                        </Typography>
                      </Grid> */}
                    </Grid>

                    <Grid item xs={12} container>
                      <Grid item xs={12}>
                        <Typography style={{ fontWeight:'600' }}>            
                          Deductible
                        </Typography>
                      </Grid>
                      {selectedPlan[0].type_deduct.length>0 
                        ?
                          <>
                            <Grid item xs={5}>Value</Grid>
                            <Grid item xs={5}>Discount</Grid>
                            <Grid item xs={2}>Default</Grid>
                            {selectedPlan[0].type_deduct.sort((a,b) => a.value - b.value).map((d, dIndex)=>(
                              <React.Fragment key={dIndex}>
                                <Grid item xs={5}>
                                  {amountFormat(d.value,0)}
                                </Grid>
                                <Grid item xs={5}>
                                  {d.discount} %
                                </Grid>
                                <Grid item xs={2}>
                                  <Checkbox
                                    disabled 
                                    checked={d.default}
                                    size="small"
                                  />
                                </Grid>
                                </React.Fragment>
                              ))}
                          </>
                        : <Grid item xs={12}>N/A</Grid>
                    }
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={9}>
                  <MUIDataTable
                      title= {
                        <React.Fragment>
                          {showError &&
                            <Grid item container>
                              <Grid item xs={12}>
                                <Alert severity='error'
                                    onClose={() => {setShowError(false)}}
                                >   
                                    <AlertTitle>Restore - Error</AlertTitle>
                                      No data selected.
                                </Alert>
                              </Grid>
                            </Grid>
                          }
                          {(UpdatedLoading || loading) &&
                            <Grid item container>
                              <Grid item xs={12}>
                                <Alert severity='info'>   
                                    <AlertTitle>Processing</AlertTitle>
                                      {`${UpdatedLoading?'Updating...':'Re-loading...'}`} 
                                </Alert>
                              </Grid>
                            </Grid>
                          }
                          {/* update result */}
                          {!UpdatedError && !UpdatedLoading && updatedResult.status && alertOpen 
                            ? <Grid item container>
                                <Grid item xs={12}>
                                  <Alert severity={updatedResult.status} 
                                          onClose={() => {
                                              setAlertOpen(false)
                                              if (updatedResult.status === 'success'){
                                                dispatch(getInsurancePlan())
                                                setIsUpdated(true)
                                              }
                                          }}
                                  >     
                                    <AlertTitle>{updatedResult.status}</AlertTitle>
                                    {updatedResult.message }
                                  </Alert>
                                </Grid>
                              </Grid>
                            :
                              <Grid item container spacing={2}>
                                <Grid item xs={4} sm={4} md={2} lg={2} style={{ marginTop:'2vh', textAlign:'right' }}>
                                  <label className={classes.productLable}>Sum Insured</label>
                                </Grid>
                                <Grid item xs={8} sm={8} md={4} lg={4}>
                                  <SelectTextFieldSmall
                                    defultvalue={selectedPlanCoverage[0]}
                                    onChange={(e)=>{
                                      if (e.target.value === 'All'){
                                        setSelectedPlanCoverage(coverageGroup(selectedPlan).map(item => parseInt(item.price_code)))
                                      }else{
                                        setSelectedPlanCoverage([parseInt(e.target.value)])
                                      }
                                    }}
                                  >
                                    {coverageGroup(selectedPlan).map((item) => (
                                      <option key={item.price_code} value={item.price_code}>
                                          {amountFormat(item.price_code,0)}
                                      </option>
                                    ))}
                                    <option value='All'>All</option>
                                  </SelectTextFieldSmall>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                  {!UpdatedLoading && !loading && editMode===''&&
                                    <>
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        style={{ marginTop: '1vh', marginRight: '2vh' }}
                                        onClick={()=>{
                                            setEditMode('A')
                                            setSelectedRows()
                                        }}
                                      >
                                        Edit Mode
                                      </Button>
                                      <Button
                                        disabled={(selectedPlan.filter(f=>selectedPlanCoverage.includes(f.price_code)).map(s=>s.history.length)).filter(f=>f>0).length>0?false:true}
                                        variant="contained"
                                        color="primary"
                                        style={{ marginTop: '1vh', marginRight: '2vh' }}
                                        onClick={()=>{
                                            setEditMode('R')
                                            setSelectedRows()
                                        }}
                                      >
                                        Restore Mode
                                      </Button>
                                    </>
                                  }
                                  {editMode==='A' &&
                                    <Grid item container spacing={1}>
                                      <Grid item xs={6} sm={6} md={2} lg={2} style={{ marginTop:'2vh', textAlign:'right' }}>
                                        <label className={classes.productLable}>Increase Rate(%)</label>
                                      </Grid>
                                      <Grid item xs={6} sm={6} md={3} lg={3}>
                                        <RegularTextFieldSmall
                                          type="number"
                                          name='increaseRate'
                                          value={increaseRate}
                                          onChange={(e)=>{setIncreaseRate(e.target.value)}}
                                          InputProps={{
                                            style: { color: "blue" }
                                          }}
                                        />
                                      </Grid>

                                        <Grid item xs={12} sm={12} md={6} lg={6} style={{ marginTop:'1vh', marginRight:'2vh' }}>
                                          <Grid item container spacing={1} direction="row">
                                            <Grid item xs={6} style={{textAlign:'right'}}>
                                              {parseFloat(increaseRate) !== 0 &&
                                                <Button
                                                  variant="contained"
                                                  color="primary"
                                                  onClick={()=>{
                                                    const updateData = selectedPlan.filter(f=>selectedPlanCoverage.includes(f.price_code))
                                                                                    .map(row => {
                                                                                          const updatedRow = {
                                                                                            ...row,
                                                                                            updated_premium : parseFloat(row.premium_rate) + Math.round(parseFloat(row.premium_rate) * (increaseRate?increaseRate:0))/100 
                                                                                          };
                                                                                          return updatedRow;
                                                                                      })
                                                    updatePlan(updateData);
                                                  }}
                                                >
                                                  Save
                                                </Button>
                                              }
                                            </Grid>
                                            <Grid item xs={6}>
                                              <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={()=>{resetCriteria()}}
                                              >
                                                Cancel
                                              </Button>
                                            </Grid>
                                          </Grid>
                                        </Grid>

                                    </Grid>
                                  }
                                  {editMode==='R' &&
                                    <Grid item container spacing={1} style={{ marginTop:'1vh', marginRight:'2vh' }} >
                                      <Grid item xs={6} style={{textAlign:'right'}}>
                                        <Button
                                          variant="contained"
                                          color="primary"
                                          onClick={()=>{
                                            const updateData = selectedPlan.filter(f=>f.selectedRestore===true&&selectedPlanCoverage.includes(f.price_code))
                                                                            .map(row => {
                                                                                  const updatedRow = {
                                                                                    ...row,
                                                                                    updated_premium :  parseFloat(row.history.length>0?row.history.sort((a,b) => new Date(b.created_at) - new Date(a.created_at))[0].premium_rate:row.premium_rate)
                                                                                  };
                                                                                  return updatedRow;
                                                                              })
                                              if (updateData.length>0){
                                                setShowError(false)
                                                updatePlan(updateData)
                                                selectedPlan.map(row=>(row.selectedRestore = false))
                                              }else{
                                                setShowError(true)
                                              }
                                            // updatePlan(updateData);
                                          }}
                                        >
                                          Confirm
                                        </Button>
                                      </Grid>
                                      <Grid item xs={6}>
                                        <Button
                                          variant="contained"
                                          color="secondary"
                                          onClick={()=>{
                                            selectedPlan.map(row=>(row.selectedRestore = false))
                                            resetCriteria();
                                          }}
                                        >
                                          Cancel
                                        </Button>
                                      </Grid>
                                      <Grid item xs={12} style={{color:'red'}}>
                                        * Note: When selecting Restore, the insurance premium is modified as the insurance premium of the most recent history.
                                        </Grid>
                                    </Grid>
                                  }
                                </Grid>
                              </Grid>
                          } 
                          
                        </React.Fragment>   
                      } //title
                      data={selectedPlan.filter(f=>selectedPlanCoverage.includes(f.price_code))}
                      columns={columns}
                      options={options}
                    />
                </Grid>
              </Grid>
            }
          </Grid>
        {/* }  */}
      </Grid>
    </Grid>
  )

}
