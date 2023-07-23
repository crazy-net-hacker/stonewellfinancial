import React, { useState } from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// Quote Form initial data
import { travelQuoteInit } from '../../../layouts/InitFormData';
//core components
import { Grid } from '@material-ui/core'
//
// import { QuoteBanner2 } from '../../../../components/common/QuoteBanner2';
// import { Text } from '../../../../components/common/LanguageProvider';
import WindowDimension from '../../../../components/common/WindowDimension'
import TripInformationForm from '../../../pages/TravelQuote/TripInformationForm'

//style
// import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';


// const useStyles = makeStyles(dashboardStyles)


export default function NewTravelApplication(props) { 
  // const classes = useStyles();
  
  // travel quote initial data --  travelQuoteInit()
  const [formData, setFormData] = useState(travelQuoteInit());
  // update form data
  const updateFormData = (data) => {
    setFormData((prevFormData) => ({ ...prevFormData, ...data }));
  };

  // Mobile Design
  const { width } = WindowDimension();
  let isMobile = (width < 768);

  return (
    <>
    <Grid container justify="center" style={{ background:'#fff',marginTop: isMobile?'0px':'-37px' }}>
      {/* <QuoteBanner2 title={<Text tid={`Travel Quote & Application`}/>} subTitle={'Quote.TravelIns.SubTitle'} links={[]} /> */}
      {/* <Grid item xs={12} sm={12} md={11}> */}
        <TripInformationForm {...props} formData={formData} updateFormData={updateFormData} countries={[]} provinces={[]} />
      {/* </Grid> */}
    </Grid>
    </>

  )
}
