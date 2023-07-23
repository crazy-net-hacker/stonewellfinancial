import React, { useEffect } from 'react';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { postTravelApplication } from '../../../redux/actions/travelApplicationAction';
// travel quote inital data
import { travelQuoteInit } from '../../layouts/InitFormData';
//core component
import CircularProgress from '@material-ui/core/CircularProgress';
//custom component
import Submission from '../../../components/common/Submission';
import ErrorPage from '../../../components/common/ErrorPage'

const SubmitResult = (props) => {
  const { formData } = props;

  //stop back navigation and go first pgae of quote
  window.onpopstate = function () {
    props.updateFormData(travelQuoteInit())
    window.history.go(1);
  };

  const dispatch = useDispatch();
  const result = useSelector(state => state.travelApplicationReducer.result)
  const error = useSelector(state => state.travelApplicationReducer.error)
  const loading = useSelector(state => state.travelApplicationReducer.loading)

  useEffect(()=>{
    dispatch(postTravelApplication(formData))     
  }, [dispatch,formData]);

  if(loading) return (
    <div>
      <CircularProgress />
    </div>
    )
  if(error && !loading) return(<ErrorPage/>)

  return(
    <>
      { result && 
        result.status === 'success'
        ? (
          <Submission
            confirmationNo={result.data}
            submissionType={'application'}
          />
        ):(
          <ErrorPage/>
        )
      }
    </>
  );

};

export default SubmitResult;