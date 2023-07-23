import React, { useEffect } from 'react';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { postGroupQuote } from '../../../redux/actions/groupQuoteAction';
// quote inital data
import { groupQuoteInit } from '../../layouts/InitFormData';
//core component
import CircularProgress from '@material-ui/core/CircularProgress';
//custom component
import Submission from '../../../components/common/Submission';
import ErrorPage from '../../../components/common/ErrorPage'


const SubmitResult = (props) => {
  const { groupFormData } = props;

  //stop back navigation and go first pgae of quote
  window.onpopstate = function () {
    props.updateGroupFormData(groupQuoteInit())
    window.history.go(1);
  };

  const dispatch = useDispatch();
  
  const result = useSelector(state => state.groupQuoteReducer.result)
  const error = useSelector(state => state.groupQuoteReducer.error)
  const loading = useSelector(state => state.groupQuoteReducer.loading)

  useEffect(()=>{
    dispatch(postGroupQuote(groupFormData))     
  }, [dispatch,groupFormData]);

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