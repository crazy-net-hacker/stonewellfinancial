import React, { useState, useEffect, useCallback } from 'react';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { getTravelApplications } from '../../../../redux/actions/travelApplicationAction';
//
import { Grid } from '@material-ui/core'
import { QuoteBanner2 } from '../../../../components/common/QuoteBanner2';
import { ApplicationList } from './ApplicationList'
import LoadingSpinnerScreen from '../../../../components/common/loadingScreen';


// export default function SearchApplication({match, user, vendorID}) {
export default function SearchApplication(props) {
  const { match, user, vendorID, vendorEmail } = props; 
  const queryString = new URLSearchParams(props.location.search);

  // title
  document.title = 'Dashboard - Search Applications';

  const dispatch = useDispatch();
  const applications = useSelector(state => state.travelApplicationReducer.applications)
  const loadingApplication = useSelector(state => state.travelApplicationReducer.loading)
  
  // run useEffect only once when first render
  const [isLoaded, setIsLoaded] = useState(false)

  const [periodType, setPeriodType]= useState('P')

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

  // 
  useEffect(() => {
    if(criteriaData.fromDate !== '2017-09-01' || criteriaData.toDate !== new Date().toISOString().substring(0,10)){
      setPeriodType('P')
    }
  }, [criteriaData.fromDate, criteriaData.toDate]);

  return (
    <Grid container>
        <Grid item container style={{ marginTop:'-37px' }}>         
          <QuoteBanner2 title={'Dashboard.SearchApplications'} subTitle={'Dashboard.SearchApplications.SubTitle'} links={[]}/>
        </Grid>   
        <Grid item container style={{ padding:'1vh 5vh 5vh'}}>


          {loadingApplication
            ? <LoadingSpinnerScreen/>
            :
                <ApplicationList
                    url = {match.url}
                    history = {props.history}
                    user = {user} 
                    vendorID = {vendorID}
                    vendorEmail = {vendorEmail}
                    periodType = {periodType}
                    setPeriodType = {setPeriodType}
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
                    onPage = {'Search'}
                    searchTextID= {queryString.get('id')?queryString.get('id'):null}
                />
          }
        </Grid>




    </Grid>
  );
}