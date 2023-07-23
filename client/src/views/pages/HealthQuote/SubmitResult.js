import React, { useEffect } from 'react';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { postHealthQuote } from '../../../redux/actions/healthQuoteAction';
// quote inital data
import { healthQuoteInit } from '../../layouts/InitFormData';
//core component
import CircularProgress from '@material-ui/core/CircularProgress';
//custom component
import Submission from '../../../components/common/Submission';
import ErrorPage from '../../../components/common/ErrorPage'


const SubmitResult = (props) => {
  const { healthFormData } = props;

  //stop back navigation and go first pgae of quote
  window.onpopstate = function () {
    props.updateHealthFormData(healthQuoteInit())
    window.history.go(1);
  };

  const dispatch = useDispatch();
  
  const result = useSelector(state => state.healthQuoteReducer.result)
  const error = useSelector(state => state.healthQuoteReducer.error)
  const loading = useSelector(state => state.healthQuoteReducer.loading)

  useEffect(()=>{
    dispatch(postHealthQuote(healthFormData))     
  }, [dispatch,healthFormData]);

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
            submissionType={'quote'}
          />
        ):(
          <ErrorPage/>
        )
      }
    </>
  );
};

export default SubmitResult;