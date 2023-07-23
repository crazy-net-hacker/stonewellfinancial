import React, { useState } from 'react';
// import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { getTravelApplications } from '../../../../redux/actions/travelApplicationAction';
//
import { Typography, Grid } from '@material-ui/core'
import MUIDataTable from "mui-datatables";
import CircularProgress from '@material-ui/core/CircularProgress';
// common customized components
import Criteria from '../../common/Criteria'
// functionality
import { dateFormat } from '../../../../controllers/dataFormat';
// icons
// import CheckIcon from '@mui/icons-material/Check';
// // logos
// import allianzLogo from '../../../../assets/imgs/logo/allianz-logo.png'
// import tugoLogo from '../../../../assets/imgs/logo/tugo-logo.png'
// import gmsLogo from '../../../../assets/imgs/logo/gms-logo.png'
// import blueCrossLogo from '../../../../assets/imgs/logo/blueCross-logo.png'

//style
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';

const useStyles = makeStyles(dashboardStyles)

// const codes = [
//   { code_name: 'Pending', code_desc: "Pending" },
//   { code_name: 'Accepted', code_desc: "Accepted" },
//   { code_name: 'Approved', code_desc: "Approved" },
//   // { code_name: 'Renewed', code_desc: "Renewed" }, // will be managed at new field
//   { code_name: 'Cancelled', code_desc: "Cancelled" },
//   { code_name: 'Void', code_desc: "Void" }
// ]

const formType = [
  { from: 'M', name: 'M.Application'},
  { from: 'O', name: 'P.Quote'},
  { from: 'V', name: 'Vendor'},
  { from: 'Z', name :'ZCRM'}
]


export default function TravelApplication({match}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const applications = useSelector(state => state.travelApplicationReducer.applications)
  const loading = useSelector(state => state.travelApplicationReducer.loading)

  // criteria
  const [criteriaData, setCriteriaData] = useState({
    fromDate: new Date().toISOString().substring(0,8)+'01',
    toDate: new Date().toISOString().substring(0,10)
  })


  // const scrollRef = useRef(null);
  // const scrollToElement = () => scrollRef.current.scrollIntoView();

  // useEffect(() => {
  //   dispatch(getTravelApplications({fr:criteriaData.fromDate,to:criteriaData.toDate, vendor_id:'*'}))
  //     }, [dispatch, criteriaData]);
  
  // get application list
  function getSearchResult(){
    // dispatch(getTravelApplications({fr:criteriaData.fromDate,to:criteriaData.toDate}))
    dispatch(getTravelApplications({fr:criteriaData.fromDate,to:criteriaData.toDate, vendor_id:'*'}))
  }

  var array = [
    { Id: "001", qty: 1 }, 
    { Id: "002", qty: 2 }, 
    { Id: "001", qty: 2 }, 
    { Id: "003", qty: 4 }
  ];
  
  var result = [];
  array.reduce(function(res, value) {
    if (!res[value.Id]) {
      res[value.Id] = { Id: value.Id, qty: 0 };
      result.push(res[value.Id])
    }
    res[value.Id].qty += value.qty;
    return res;
  }, {});
  
  console.log('sum by group', result)



  function groupBy(arr, prop) {
    const map = new Map(Array.from(arr, obj => [obj[prop], []]));
    arr.forEach(obj => map.get(obj[prop]).push(obj));
    return Array.from(map.values());
}

// const data = [{ name: "Display", group: "2020-06", id: 60, value: 4 }, 
//             { name: "Manufacturer", group: "2020-06", id: 58, value: "Apple" }, 
//             { name: "OS", group: "2020-06", id: 37, value: "Apple iOS" }];
	
// console.log(groupBy(data, "group"));

  function extract() {

    let res = applications.map(i=> 
      ({period:i.app_date.slice(0,7),
        vendor:i.vendor_name,
        premium : i.insurance_amount,
        count: 1,
        total: 0
      }))
    // )

    
    
    
     let res1 = 
      res.reduce((group, val)=>{
        let foundItemIndex = group.findIndex((obj)=>obj.period === val.period && obj.vendor === val.vendor);
      
        if(foundItemIndex < 0){
            group.push(val)
        }
        else { 
          group[foundItemIndex].premium += parseFloat(val.premium);
          group[foundItemIndex].count += 1;
        }
        return group;
        }, []).map(i=>i)
    
        console.log('res1',res1 )

    // console.log(res1.map(i=>({
    //   period: i.period
      
    // }) ))

    console.log('groupBy', groupBy(res1, "period"));

    function groupBy_test(arr, prop) {
      const map = new Map(Array.from(arr, obj => [obj[prop], []]));
      arr.forEach(obj => map.get(obj[prop]).push(obj));
      return Array.from(map.values());
  }

  console.log('groupBy_test', groupBy_test(res1, "period"));


    var groups = {};

    res1.forEach(function(val) {
        var period = val.period;
        if (period in groups) {
            groups[period].push(val)
            groups[period].total += parseFloat(val.premium)
        } else {
            groups[period] = new Array(val);
            groups[period].total = val.premium
        }
    });

    // console.log('group',
    //   res1.forEach(function(val) {
    //   var date = val.period;
    //   if (date in groups) {
    //       groups[date].push(val)
    //       groups[date].total += parseFloat(val.premium)
    //   } else {
    //       groups[date] = new Array(val);
    //       groups[date].total = val.premium
    //   }
    // }))

    console.log(groups);
    return groups;
}

extract();


 
  const columns = getColumns()
  // const applicationData = extract()
  // const applicationData = {}
  // if (app.length > 0){
  //   const applicationData = app.map(row => {
  //     const rows = {
  //       ...row
  //     };
  //     return rows;
  //   // });
  // }
  const applicationData = applications.map(row => {
    const updatedRow = {
      ...row,
      applicationID: row.application_id,
      applicationDate: dateFormat(new Date(row.app_date+'T00:00:00')),
      vendor: row.vendor_name ? row.vendor_name : '',
      sourceFrom: formType.filter(f=>f.from===row.source_from).map(form=>form.name)[0],
      insuredName: row.insuredpersons[0] ? row.insuredpersons[0].firstName + ' ' +row.insuredpersons[0].lastName : null,
      birthdate: row.insuredpersons[0] ? dateFormat(new Date(row.insuredpersons[0].birthdate+'T00:00:00')) : null,
      companyName:row.insuredpersons[0]? row.insuredpersons[0].compnayName : null,
      insuredType: row.insuredpersons[0] ? row.insuredpersons[0].eligilbeIns.charAt(0).toUpperCase() + row.insuredpersons[0].eligilbeIns.substr(1).toLowerCase() : null,
      tripStartDate : row.insuredpersons[0] ? dateFormat(new Date(row.insuredpersons[0].tripStartDate+'T00:00:00')) : null,
      tripEndDate : row.insuredpersons[0] ? dateFormat(new Date(row.insuredpersons[0].tripEndDate+'T00:00:00')) : null,
      renewal : row.renewal,      
      status :row.app_status
    };
    return updatedRow;
  });

  console.log('applicationData', applicationData)
  // Column definitions
  function getColumns(){
    const columns=[
        {name: "period", label: "Period", 
          options: {filter: false},
        },
        {name: "total", label: "Total", 
          options: {filter: false},
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
    rowStyle: {height: 30},
    // download: true,
    // print: true,   
    // jumpToPage: true,
    textLabels: {
      body: {
        noMatch: '', //'no matching records found',
      }
    },
    // setRowProps: (row, index) => { 
    //   return { style: { backgroundColor: row[11].slice(0,8)==='Refunded'? '#FF6666': null, }, }; },
    expandableRows: true,
    // expandableRowsOnClick: true,
    // onRowClick: (rowData) => {
    //   console.log(rowData);
    // },
    // rowsExpanded: [selectedRows],
    // renderExpandableRow: (rowData, rowMeta) => { 
    //   const clickedData = rowData[3] !== 'ZCRM'
    //                         ? (applications.filter(d => d.application_id === rowData[0]))[0]
    //                         : (applications.filter(d => d.policy === rowData[13]))[0]
    //   return (
    //     null

    //   );
    // },
  };
  

  return (
    <Grid container>
        <Grid item container style={{ margin:'5vh 5vh 4vh' }}>
          <Typography className={classes.dashboardPageTitle}>
            {/* <Text tid={'Vendor.StartApplication'} /> */}
            Travel Insurance Report
          </Typography>
        </Grid>
        <Grid item container style={{ padding:'0 5vh 5vh' }}>
          {loading 
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


    </Grid>
  );
}