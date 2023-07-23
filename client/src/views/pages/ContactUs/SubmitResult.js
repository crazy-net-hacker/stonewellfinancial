import React, { useEffect } from 'react';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { postContactUs } from '../../../redux/actions/contactUsAction';
//
import CircularProgress from '@material-ui/core/CircularProgress';
//custom component
import Submission from '../../../components/common/Submission';
import ErrorPage from '../../../components/common/ErrorPage'


const SubmitResult = (props) => {
  const { formData } = props;

  const dispatch = useDispatch();
  const result = useSelector(state => state.contactUsReducer.result)
  const error = useSelector(state => state.contactUsReducer.error)
  const loading = useSelector(state => state.contactUsReducer.loading)

  useEffect(()=>{
    dispatch(postContactUs(formData))     
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
            submissionType={'request'}
          />
        ):(
          <ErrorPage/>    
        )
      }
    </>
  );

};

export default SubmitResult;