import React from 'react'
// core components
import { Grid } from '@material-ui/core'
// Common components
import { Text } from '../../../../components/common/LanguageProvider';
import { QuoteBanner2 } from '../../../../components/common/QuoteBanner2';
import ImgMediaCard from '../../../../components/common/Card/ImgMediaCard';
// icons
import StudentIcon from '../../../../assets/imgs/icons/student.svg'
import VisitorIcon from '../../../../assets/imgs/icons/visitor.svg'
import TravelerIcon from '../../../../assets/imgs/icons/traveler.svg'


const VendorNewApplication = ({match}) => {

  // title
  document.title = 'Dashboard - New Application';

  const cardLists = [
    {
      icon: <img
                src={StudentIcon}
                alt="Student Icon"
                style={{ paddingBottom:'25px'}} 
            />,
      title: <Text tid={'Student and Companion Plan'} />,
      description: (
        <>
            <Text tid={'IconCard.list.students'} />, <Text tid={'IconCard.list.graduates'} />, <Text tid={'IconCard.list.companions'} />    
        </>
      ),
      button1: <Text tid={'Button.Application'} />,
      button1Link: `${match.url}/${'student'}`,
      button2: <Text tid={'Quote.Step.CheckEligibility'} />
    },
    {
      icon: <img
                src={VisitorIcon}
                alt="Visitor Icon"
                style={{ paddingBottom:'25px'}} 
            />,
      title: <Text tid={'Visitor to Canada Plan'} />,
      description: (
        <>
            <Text tid={'IconCard.list.Travelers'} />, <Text tid={'IconCard.list.Working holiday'} />, <Text tid={'IconCard.list.Foreign Workers'} />
            , <Text tid={'IconCard.list.Super Visa'} />
        </>
      ),
      button1: <Text tid={'Button.Application'} />,
      button1Link: `${match.url}/${'visitor'}`,
      button2: <Text tid={'Quote.Step.CheckEligibility'} />
    },
    {
      icon: <img
                src={TravelerIcon}
                alt="Traveler Icon"
                style={{ paddingBottom:'25px'}} 
            />,
      title: <Text tid={'Canadian Plan'} />,
      description: (
        <>
            <Text tid={'IconCard.list.pr'} />, <Text tid={'IconCard.list.canadian'} />   
        </>
      ),
      button1: <Text tid={'Button.Application'} />,
      button1Link: `${match.url}/${'canadian'}`,
      button2: <Text tid={'Quote.Step.CheckEligibility'} />
    },
  ]

  return (
    <>
        <Grid container>
          <Grid item container style={{ marginTop:'-37px' }}>
            <QuoteBanner2 title={'Dashboard.StartNewApplication'} subTitle={'Vendor.StartApplication.SubTitle'} links={[]}/>
          </Grid>
          {/* <Grid item container style={{justifyContent:'center'}}> */}
            {/* <Grid item xs={12} style={{ textAlign:'center', margin:'2vh 0', fontSize:'20px', fontWeight:'700' }}>
              <Typography variant="h5" component="div">
                <Text tid={'Dashboard.NewApplication.Title'} />
              </Typography>
            </Grid> */}
            {/* <Grid item xs={12} style={{ textAlign:'center', fontSize:'14px' }}>
              <Typography variant="h5" component="div">
                <Text tid={'Dashboard.NewApplication.Title'} />
              </Typography>
            </Grid> */}
          {/* </Grid> */}
          <Grid item container style={{ justifyContent:'center'}}>
            <ImgMediaCard cardLists={cardLists}/>
          </Grid>
        </Grid>
    </>
  )
}

export default VendorNewApplication
