import React, { useEffect } from 'react';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { updatePaymentTravelApplication } from '../../../redux/actions/travelApplicationAction';
//
import CircularProgress from '@material-ui/core/CircularProgress';
//custom component
import Submission from '../../../components/common/Submission';
import ErrorPage from '../../../components/common/ErrorPage'
import WarningPage from '../../../components/common/WarningPage'


const SubmitResult = (props) => {
  const { formData } = props;

  const dispatch = useDispatch();
  const updatedApplication  = useSelector((state) => state.travelApplicationReducer.updatedApplication)
  const UpdatedLoading = useSelector(state => state.travelApplicationReducer.UpdatedLoading)
  const UpdatedError = useSelector(state => state.travelApplicationReducer.UpdatedError)

  useEffect(()=>{
    dispatch(updatePaymentTravelApplication(formData)) 
  }, [dispatch, formData]);



  if(UpdatedLoading) return (
    <div>
      <CircularProgress />
    </div>
    )
  if(UpdatedError && !UpdatedLoading) return(<ErrorPage/>)

  return(
    <>
        { updatedApplication && updatedApplication.status && 
          (updatedApplication.status === 'success' || updatedApplication.status === 'warning')
            ?
              (updatedApplication.status === 'success' 
                ?
                <Submission
                  confirmationNo={updatedApplication.data}
                  submissionType={'payment'}
                />
                :
                <WarningPage
                  warningCode= {updatedApplication.warningCode}
                  message={updatedApplication.message}
                />
              )
            :
              <ErrorPage/>  
        }
    </>
  );

};

export default SubmitResult;