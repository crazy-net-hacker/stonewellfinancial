import React, { useEffect } from 'react';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { updateStatusCreditCard } from '../../../../redux/actions/creditcardAction';
//custom component
import Button from '../../../../components/common/CustomButtons/Button'
import { Grid } from '@material-ui/core';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const SubmitResult = (props) => {
  const { id, updateFormData, result } = props;

  const dispatch = useDispatch();
  const updatedCreditcard  = useSelector((state) => state.creditcardReducer.updatedCreditcard)
  const UpdatedLoading = useSelector(state => state.creditcardReducer.UpdatedLoading)
  const UpdatedError = useSelector(state => state.creditcardReducer.UpdatedError)


  useEffect(()=>{
    dispatch(updateStatusCreditCard({creditcard_id:id, data: updateFormData})) 
  }, [dispatch, id, updateFormData]);
    
  
  return(
    <Grid container style={{ margin: '2vh 0 3vh 0' }} spacing={3}>

      {UpdatedLoading 
        ?
        <Grid item xs={12}>
          <Alert severity='info'>   
              <AlertTitle>Processing</AlertTitle>
                The process status is updating... 
          </Alert>
        </Grid>
        :null
      }

      {!UpdatedError && !UpdatedLoading && updatedCreditcard.status &&
        <>
          <Grid item xs={12}>
              <Alert severity={updatedCreditcard.status} >
                <AlertTitle>{updatedCreditcard.status}</AlertTitle>
                {updatedCreditcard.message }
              </Alert>
          </Grid>
          <Grid container justify="center" >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                result(updatedCreditcard.status)
              }}
            >
              OK
            </Button>
          </Grid>
        </>
      }
    </Grid>
  );
  // }
};

export default SubmitResult;