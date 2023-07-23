import React, { useEffect } from 'react';
//redux
import { useSelector, useDispatch } from 'react-redux';
// import { postContactUs } from '../../../redux/actions/contactUsAction';
import { postCreditCard } from '../../../redux/actions/creditcardAction';
//
import CircularProgress from '@material-ui/core/CircularProgress';
//custom component
import Submission from '../../../components/common/Submission';
import ErrorPage from '../../../components/common/ErrorPage'
import WarningPage from '../../../components/common/WarningPage'

const SubmitResult = (props) => {
  const { formData } = props;
  
  const dispatch = useDispatch();
  const result = useSelector(state => state.creditcardReducer.result)
  const loading = useSelector(state => state.creditcardReducer.loading)
  const error = useSelector(state => state.creditcardReducer.error)


  useEffect(()=>{
    dispatch(postCreditCard(formData))     
  }, [dispatch,formData]);

  if(loading) return (
    <div>
      <CircularProgress />
    </div>
    )
  if(error && !loading) return(<ErrorPage/>)

  if(!error && !loading && result){
    return(
      <>
        { result && result.status && 
          (result.status === 'success' || result.status === 'warning')
            ?
              (result.status === 'success' 
                ?
                <Submission
                  confirmationNo={''}
                  submissionType={'providing a payment information'}
                />
                :
                <WarningPage
                  warningCode= {result.warningCode}
                  message={result.message}
                />
              )
            :
              <ErrorPage/>  
        }
      </>
    );
  }
};

export default SubmitResult;