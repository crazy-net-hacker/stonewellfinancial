import React, { useEffect } from 'react';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { updateStatusTravelApplication } from '../../../../redux/actions/travelApplicationAction';
//custom component
import Button from '../../../../components/common/CustomButtons/Button'
import { Grid } from '@material-ui/core';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const SubmitResult = (props) => {
  const { id, updateFormData, result } = props;

  const dispatch = useDispatch();
  const updatedApplication  = useSelector((state) => state.travelApplicationReducer.updatedApplication)
  const UpdatedLoading = useSelector(state => state.travelApplicationReducer.UpdatedLoading)
  const UpdatedError = useSelector(state => state.travelApplicationReducer.UpdatedError)


  useEffect(()=>{
    dispatch(updateStatusTravelApplication({application_id:id, data: updateFormData})) 
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

      {!UpdatedError && !UpdatedLoading && updatedApplication.status &&
        <>
          <Grid item xs={12}>
              <Alert severity={updatedApplication.status} >
                <AlertTitle>{updatedApplication.status}</AlertTitle>
                {updatedApplication.message }
              </Alert>
          </Grid>
          <Grid container justify="center" >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                result(updatedApplication.status)
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