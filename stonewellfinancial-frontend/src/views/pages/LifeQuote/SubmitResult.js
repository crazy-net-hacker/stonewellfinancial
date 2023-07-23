import React, { useEffect } from 'react';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { postLifeQuote } from '../../../redux/actions/lifeQuoteAction';
// quote inital data
import { lifeQuoteInit } from '../../layouts/InitFormData';
//core component
import CircularProgress from '@material-ui/core/CircularProgress';
//custom component
import Submission from '../../../components/common/Submission';
import ErrorPage from '../../../components/common/ErrorPage'


const SubmitResult = (props) => {
  const { lifeFormData } = props;

  //stop back navigation and go first pgae of quote
  window.onpopstate = function () {
    props.updateLifeFormData(lifeQuoteInit())
    window.history.go(1);
  };

  const dispatch = useDispatch();
  
  const result = useSelector(state => state.lifeQuoteReducer.result)
  const error = useSelector(state => state.lifeQuoteReducer.error)
  const loading = useSelector(state => state.lifeQuoteReducer.loading)

  useEffect(()=>{
    dispatch(postLifeQuote(lifeFormData))     
  }, [dispatch,lifeFormData]);

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