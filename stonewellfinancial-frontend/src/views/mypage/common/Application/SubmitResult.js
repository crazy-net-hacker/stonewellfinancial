import React, { useEffect } from 'react';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { postTravelApplication } from '../../../../redux/actions/travelApplicationAction';
//core component
import CircularProgress from '@material-ui/core/CircularProgress';
//custom component
import SubmissionDashbord from '../../../../components/common/SubmissionDashbord';
import ErrorPage from '../../../../components/common/ErrorPage'


const SubmitResult = (props) => {
  const { formData } = props;
  // console.log(formData)

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
          <SubmissionDashbord
            confirmationNo={result.data}
            submissionType={'application'}
            userRole={formData.userRole}
          />
        ):(
          <ErrorPage/>
        )
      }
    </>
  );
};

export default SubmitResult;