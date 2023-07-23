import React, { useEffect } from 'react';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { updateStatusRefund } from '../../../../redux/actions/refundAction';
//custom component
import Button from '../../../../components/common/CustomButtons/Button'
import { Grid } from '@material-ui/core';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const SubmitResult = (props) => {
  const { id, updateFormData, result } = props;

  const dispatch = useDispatch();
  const updatedRefund  = useSelector((state) => state.refundReducer.updatedRefund)
  const UpdatedLoading = useSelector(state => state.refundReducer.UpdatedLoading)
  const UpdatedError = useSelector(state => state.refundReducer.UpdatedError)


  useEffect(()=>{
    dispatch(updateStatusRefund({refund_id:id, data: updateFormData})) 
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

      {!UpdatedError && !UpdatedLoading && updatedRefund.status &&
        <>
          <Grid item xs={12}>
              <Alert severity={updatedRefund.status} >
                <AlertTitle>{updatedRefund.status}</AlertTitle>
                {updatedRefund.message }
              </Alert>
          </Grid>
          <Grid container justify="center" >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                result(updatedRefund.status)
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