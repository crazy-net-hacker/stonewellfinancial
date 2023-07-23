import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
// redux
import { useSelector, useDispatch } from 'react-redux';
import { getTravelApplications } from '../../../../redux/actions/travelApplicationAction';
import { Username } from '../../../layouts/constants';
//
import { Grid, Typography, Button } from '@material-ui/core'
import { GetFromLocalStore } from '../../../layouts/utils';
import { Card, CardActions, CardContent  } from '@mui/material';

// components
import { amountFormat } from '../../../../controllers/dataFormat';
import { ApplicationList } from '../SearchApplication/ApplicationList';
import { Text } from '../../../../components/common/LanguageProvider'
import LoadingSpinnerScreen from '../../../../components/common/loadingScreen';

// style
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';
// svg
import PartyPopper from '../../../../assets/imgs/icons/partyPopper.svg'
// icons
// import CheckIcon from '@mui/icons-material/Check';
import AssessmentIcon from '@mui/icons-material/Assessment';



export default function VendorDashboard(props) { 
  const { match, user, vendorID, vendorEmail, rate } = props; 

  // title
  document.title = 'Dashboard | Stonewell Financial Service'
  
  // style
  const useStyles = makeStyles(dashboardStyles)
  const classes = useStyles()

  const dispatch = useDispatch();
  const applications = useSelector(state => state.travelApplicationReducer.applications)
  const loading = useSelector(state => state.travelApplicationReducer.loading)

  // run useEffect only once when first render
  const [isLoaded, setIsLoaded] = useState(false)

  const [filterStatus, setFilterStatus] = useState(['Approved'])

  // criteria
  const [criteriaData, setCriteriaData] = useState({
    fromDate: new Date().toISOString().substring(0,8)+'01',
    toDate: new Date().toISOString().substring(0,10)
  })
    
  //
  const [selectedRows, setSelectedRows] = useState()
  const [currntPage, setCurrntPage] = useState(0)

  const [onAlert, setOnAlert] = useState('')
  const [alertOpen, setAlertOpen] = useState(false)

  
  // get application list
  const getSearchResult = useCallback(() => {
    dispatch(getTravelApplications({fr:criteriaData.fromDate,to:criteriaData.toDate, vendor_id:vendorID}))
  }, [dispatch, criteriaData, vendorID]);
    

  // run useEffect only once when first render
  useEffect(() => {
    if(isLoaded === false){
      getSearchResult()
      setIsLoaded(true)
    }
  }, [getSearchResult, isLoaded]);

  // application Filter
  function applicationFilter(status, resultType, whatTotal ){

    // const applyFilter = (data, filter) => data.filter(obj =>
    //   Object.entries(filter).every(([prop, find]) => find.includes(obj[prop]))
    // );

    const data = applications.filter(obj => Object.entries({app_status: status}).every(([prop, find]) => find.includes(obj[prop])))

    if (resultType === 'number'){
      if (whatTotal === 'R'){
        return data.map((a) => a.insuredpersons.filter(f=>f.refundRequestDate).length).reduce((p, t) => p = p + parseFloat(t), 0)
      }else{
        return data.map((a) => a.insuredpersons.length).reduce((p, t) => p = p + parseFloat(t), 0) 
      }
    }else{
      return data.map((a) => a.insuredpersons.map(person=>whatTotal==='T'?(person.totalAmount-person.carewellServiceAmount):(person.refundAmount?person.refundAmount:0)).reduce((p, t) => p = p + parseFloat(t), 0)).reduce((a, v) => a = a + parseFloat(v), 0)
    }

  }


  const cardContents = [
    {
      title:  <Text tid={'Dashboard.Dashboard.TotalPremium'} />,
      value:  amountFormat(applicationFilter(['Approved','Refund-Requested',],'amount', 'T'),2),
    },
    {
      title:  <Text tid={'Dashboard.Dashboard.RefundAmount'} />,
      value:  amountFormat(applicationFilter(['Refunded-F', 'Refunded-P'],'amount','R'),2),
    },
    {
      title: <Text tid={'Dashboard.Dashboard.EstimatedReferralFee'} />,
      value: amountFormat((applicationFilter(['Approved','Refund-Requested',],'amount', 'T') - applicationFilter(['Refunded-F', 'Refunded-P'],'amount','R')) * rate),
    },
    {
      title: <Text tid={'Dashboard.Dashboard.ReferralRate'} />,
      value: `${rate * 100} %`,
    },
    {
      title:  <Text tid={'Dashboard.Dashboard.PolicySold'} />,
      value:  applicationFilter(['Approved'],'number'), 
      button: <Text tid={'Dashboard.Dashboard.SeeAllPoliciesSold'} />,
      status: ['Approved']
    },
    {
      title:  <Text tid={'Dashboard.Dashboard.PolicyRefunded'} />,
      value:  applicationFilter(['Refund-Requested','Refunded-F', 'Refunded-P','Rejected'],'number', 'R'), 
      button: <Text tid={'Dashboard.Dashboard.SeeAllPoliciesRefunded'} />,
      status: ['Refund-Requested','Refunded-F', 'Refunded-P', 'Rejected']
    },
    {
      title:  <Text tid={'Dashboard.Dashboard.PolicyPending'} />,
      value:  applicationFilter(['Pending'],'number'),
      button: <Text tid={'Dashboard.Dashboard.SeeAllApplicationPending'} />,
      status: ['Pending']
    },
    {
      title:  <Text tid={'Dashboard.Dashboard.PolicySaved'} />,
      value:  applicationFilter(['Draft'],'number'),
      button: <Text tid={'Dashboard.Dashboard.SeeAllApplicationSaved'} />,
      status: ['Draft']
    },
  ]
  
  return (
    // <title>dfd</title>
    <Grid container>
      <Grid item container style={{ padding:'4vh 18px', background:'rgb(249, 249, 249)' }}>
        <Grid item xs={12} sm={12} md={6}>
          <span className={classes.titleText}>
              Welcome, {GetFromLocalStore(Username)}
              <img
                src={PartyPopper}
                alt="Party Popper icon"
                style={{margin:'0 0px 5px 10px', height:'30px' }} 
              />
          </span>
        </Grid>
        {/* <Grid item xs={12} sm={12} md={6} style={{ textAlign:'end'}}>
          <span className={classes.accountName}>
            LOGO
          </span>
        </Grid> */}
      </Grid>

      <Grid item container>
        <Grid item container style={{ margin:'5vh 0 2vh 4vh' }}>
          <span className={classes.subTitleText}>
            <AssessmentIcon style={{ marginRight:'5px'}} />
            <Text tid={'Dashboard.Dashboard.ThisMonth.Title'} />
          </span>
        </Grid>
        <Grid item container style={{ margin:'0 4vh'}}>
          {cardContents.map((con, index) => (
            <Grid item key={index} xs={12} sm={12} md={4} lg={3}>
              <Card sx={{ minWidth: 240, height:'fit-content', margin:'5px' }}>
              <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="secondary" gutterBottom>
                      {con.title}
                  </Typography>
                  <Typography variant="h5" component="div">
                  {con.value}
                  </Typography>
              </CardContent>
              <CardActions>
                  <Button size="small"
                    onClick={()=>{ 
                      // console.log(con.status)
                      setFilterStatus(con.status)
                    }}
                  >
                    {con.button}
                  </Button>
              </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Grid item container>
        <Grid item container style={{ margin:'4vh 0 2vh 4vh' }}>
          <span className={classes.subTitleText}>
            {/* Applications */}
          </span>
        </Grid>
        <Grid item container style={{ margin:'0 4vh', paddingBottom:'15vh' }}>
          {loading
            ? 
              <LoadingSpinnerScreen/>
            :
              <ApplicationList
                url = {match.url}
                history = {props.history}
                user = {user} 
                vendorID = {vendorID}
                vendorEmail = {vendorEmail}
                criteriaData = {criteriaData}
                setCriteriaData = {setCriteriaData}
                applications = {applications}
                getSearchResult = {getSearchResult}
                selectedRows = {selectedRows}
                setSelectedRows = {setSelectedRows}
                currntPage = {currntPage}
                setCurrntPage = {setCurrntPage}
                onAlert = {onAlert}
                setOnAlert = {setOnAlert}
                alertOpen = {alertOpen}
                setAlertOpen = {setAlertOpen}
                onPage = {'Dashboard'}
                filterStatus = {filterStatus}
              />
          }
        </Grid>
      </Grid>
    </Grid>
  )
}

