import React from "react";
import { Grid, Typography } from '@material-ui/core'
import spinner from "../../assets/imgs/icons/spinner.gif";


const LoadingSpinnerScreen = () => {
//   const { loading } = props;

  return (
    <Grid item container style={{ width:'100%', height:'30vh', background:'#fafafa', border:'1px solid #ddd'}}>

     <Grid item container style={{ position:'relative', top:'15vh', marginTop:'-7.5vh'}}>
        <Grid item container justify="center">
            <img src={spinner} style={{ height:'5vw'}} alt="Loading" />
        </Grid>
        <Grid item container justify="center" style={{ marginTop:'-15vh'}}>
            <Typography>Loading...</Typography>
        </Grid>
      
     </Grid>
    </Grid>
  );
}

export default LoadingSpinnerScreen;