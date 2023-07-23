import React, { useEffect } from 'react';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { postVendorAccount } from '../../../redux/actions/vendorAccountAction';
//
import CircularProgress from '@material-ui/core/CircularProgress';
//custom component
import Submission from '../../../components/common/Submission';
import ErrorPage from '../../../components/common/ErrorPage'


const SubmitResult = (props) => {
  const { formData } = props;

  const dispatch = useDispatch();
  const vendor = useSelector(state => state.vendorAccountReducer.vendor)
  const error = useSelector(state => state.vendorAccountReducer.error)
  const loading = useSelector(state => state.vendorAccountReducer.loading)

  useEffect(()=>{
    dispatch(postVendorAccount(formData))     
  }, [dispatch,formData]);


  if(loading) return (
    <div>
      <CircularProgress />
    </div>
    )
  if(error && !loading) return(<ErrorPage/>)

  return(
    <>
      { vendor && 
        vendor.status === 'success'
        ? (
          <Submission
            confirmationNo={vendor.data}
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