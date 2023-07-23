import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
// import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import { Card, CardContent  } from '@mui/material';
import { Rating } from '@mui/material';
// import MetaTags from '../../../../components/common/MetaTags'
import { Text } from '../../../../components/common/LanguageProvider'

//Components
// import WhyUs from '../../common/WhyUs'
import Banner from '../../common/Banner'
// import Partner from '../../common/Partner'
// import Products from '../../../../components/common/Product/Products'
import Benefits from '../../common/Benefits'
import AccordionFAQ from '../../common/Accordion'

// icons
import HealthAndSafetySharpIcon from '@mui/icons-material/HealthAndSafetySharp';
import PaymentSharpIcon from '@mui/icons-material/PaymentSharp';
import LooksOneSharpIcon from '@mui/icons-material/LooksOneSharp';
import LooksTwoSharpIcon from '@mui/icons-material/LooksTwoSharp';
import Looks3SharpIcon from '@mui/icons-material/Looks3Sharp';
import StarIcon from '@mui/icons-material/Star';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

const useStyles = makeStyles(theme => ({
  greenlineBox: {
    padding: 0,
  },
  greenline: {
    width: '2.5rem',
    height: '3px',
    background: '#8EC641',
    display: 'inline-block',
  },
  title: {
    fontSize:'36px',
    fontWeight:'500',
    [theme.breakpoints.down('sm')]: {
      fontSize:'22px'
    },
  },
  subTitle: {
    color: '#666',
    fontSize:'1rem',
    [theme.breakpoints.down('sm')]: {
      fontSize:'14px',
      color: '#000',
      marginTop:'5vh'
    },
  },
  description: {
    margin:'1vh 0', 
    fontSize:'24px', 
    fontWeight:'300', 
    color:'#000',
    [theme.breakpoints.down('sm')]: {
        fontSize:'18px'
    },
  }
}))

// banner Title
const bannerTitle = ['Ads.TravelInsurance.Student.Title']
const bannerSubTitle = ['Ads.TravelInsurance.Student.SubTitle']
const bannerDescription = ['Ads.TravelInsurance.Student.Description']

// Section 2 - Benefit 
const benefitsTitle = ['Ads.TravelInsurance.Student.Section2.Title']
const benefitsSubTitle = ['Ads.TravelInsurance.Student.Section2.Subtitle']
const benefitsDescriptions = [
  {
    value: <Text tid={'Ads.TravelInsurance.Student.Section2.Description1'} />
  },
  {
    value: <Text tid={'Ads.TravelInsurance.Student.Section2.Description2'} />
  },
  {
    value: <Text tid={'Ads.TravelInsurance.Student.Section2.Description3'} />
  },
]
const benefitsButtonTitle = ['Ads.TravelInsurance.Student.Section2.ButtonTitle']

  // Card Contents for Section 2
const cardTitle = ['Ads.TravelInsurance.Student.Section2.cardTitle']
const cardContents = [
  {
    title:  <Text tid={'Ads.TravelInsurance.Student.Section2.Card1.Title'} />,
    value:  <Text tid={'Ads.TravelInsurance.Student.Section2.Card1.Description'} />
  },
  {
    title:  <Text tid={'Ads.TravelInsurance.Student.Section2.Card2.Title'} />,
    value:  <Text tid={'Ads.TravelInsurance.Student.Section2.Card2.Description'} />
  },
  {
    title:  <Text tid={'Ads.TravelInsurance.Student.Section2.Card3.Title'} />,
    value:  <Text tid={'Ads.TravelInsurance.Student.Section2.Card3.Description'} />
  },
  {
    title:  <Text tid={'Ads.TravelInsurance.Student.Section2.Card4.Title'} />,
    value:  <Text tid={'Ads.TravelInsurance.Student.Section2.Card4.Description'} />
  },
]

// Claim List Accordion
const claimLists = [
  {
    question: 'Ads.TravelInsurance.Student.Claims.Dental.Title',
    answer: 
    <>
        <ul>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.Dental.Contents.Case1'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.Dental.Contents.Case2'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.Dental.Contents.Case3'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.Dental.Contents.Case4'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.Dental.Contents.Case5'} /></li>
        </ul>
    </>
    ,
  },
  {
    question: 'Ads.TravelInsurance.Student.Claims.Therapies.Title',
    answer: 
    <>
        <ul>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.Therapies.Contents.Case1'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.Therapies.Contents.Case2'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.Therapies.Contents.Case3'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.Therapies.Contents.Case4'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.Therapies.Contents.Case5'} /></li>
        </ul>
    </>
  },
  {
    question: 'Ads.TravelInsurance.Student.Claims.WalkinClinic.Title',
    answer: 
    <>
        <ul>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.WalkinClinic.Contents.Case1'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.WalkinClinic.Contents.Case2'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.WalkinClinic.Contents.Case3'} /></li>
        </ul>
    </>
  },
  {
    question: 'Ads.TravelInsurance.Student.Claims.EmergencyRoom.Title',
    answer: 
    <>
        <ul>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.EmergencyRoom.Contents.Case1'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.EmergencyRoom.Contents.Case2'} /></li>
            <li><Text tid={'Ads.TravelInsurance.Student.Claims.EmergencyRoom.Contents.Case3'} /></li>
        </ul>
    </>
  },
]

// FAQ Accordion
const faqLists = [
  {
    question: 'Ads.TravelInsurance.Student.FAQ.Question1.Title',
    answer: 
    <>
      <Text tid={'Ads.TravelInsurance.Student.FAQ.Question1.Contents'} />
    </>
    ,
  },
  {
    question: 'Ads.TravelInsurance.Student.FAQ.Question2.Title',
    answer: 
    <>
      <Text tid={'Ads.TravelInsurance.Student.FAQ.Question2.Contents'} />
    </>
    ,
  },
  {
    question: 'Ads.TravelInsurance.Student.FAQ.Question3.Title',
    answer: 
    <>
      <Text tid={'Ads.TravelInsurance.Student.FAQ.Question3.Contents'} />
    </>
    ,
  }
]


const CardSection5 = [
    {
      title:  <Text tid={'Ads.TravelInsurance.Student.NoRegret.Reason1.Title'} />,
      value:  <Text tid={'Ads.TravelInsurance.Student.NoRegret.Reason1.Content'} />,
      icon: <HealthAndSafetySharpIcon style={{ color:"#2a2f71", fontSize:'3rem' }}/>
    },
    {
      title:  <Text tid={'Ads.TravelInsurance.Student.NoRegret.Reason2.Title'} />,
      value:  <Text tid={'Ads.TravelInsurance.Student.NoRegret.Reason2.Content'} />,
      icon: <PaymentSharpIcon style={{ color:"#2a2f71", fontSize:'3rem' }}/>
    }
]

const CardSection6 = [
{
    title:  <Text tid={'Ads.TravelInsurance.Student.WhyUs.Reason1.Title'} />,
    value:  <Text tid={'Ads.TravelInsurance.Student.WhyUs.Reason1.Content'} />,
    icon: <LooksOneSharpIcon style={{ color:"#2a2f71", fontSize:'3rem' }}/>
},
{
    title:  <Text tid={'Ads.TravelInsurance.Student.WhyUs.Reason2.Title'} />,
    value:  <Text tid={'Ads.TravelInsurance.Student.WhyUs.Reason2.Content'} />,
    icon: <LooksTwoSharpIcon style={{ color:"#2a2f71", fontSize:'3rem' }}/>
},
{
    title:  <Text tid={'Ads.TravelInsurance.Student.WhyUs.Reason3.Title'} />,
    value:  <Text tid={'Ads.TravelInsurance.Student.WhyUs.Reason3.Content'} />,
    icon: <Looks3SharpIcon style={{ color:"#2a2f71", fontSize:'3rem' }}/>
}
]

const CardSection8 = [
  {
    title:  <>
              <Typography style={{ fontSize:'22px', color:'#2a2f71' }}>Y.K</Typography>
              <Typography style={{ fontSize:'16px', color:'#555', marginTop:'-1vh'}}>Toronto, ON</Typography>
            </>,
    value:  <Text tid={'Ads.TravelInsurance.Student.Review1.Content'} />,
    icon:   <Rating
              name="text-feedback"
              value={5}
              readOnly
              precision={0.5}
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
  },
  {
    title:  <>
              <Typography style={{ fontSize:'22px', color:'#2a2f71' }}>K.J</Typography>
              <Typography style={{ fontSize:'16px', color:'#555', marginTop:'-1vh'}}>Montreal, QC</Typography>
            </>,
    value:  <Text tid={'Ads.TravelInsurance.Student.Review2.Content'} />,
    icon:   <Rating
              name="text-feedback"
              value={5}
              readOnly
              precision={0.5}
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
  },
  {
    title:  <>
              <Typography style={{ fontSize:'22px', color:'#2a2f71' }}>P.N</Typography>
              <Typography style={{ fontSize:'16px', color:'#555', marginTop:'-1vh'}}>Surrey, BC</Typography>
            </>,
    value:  <Text tid={'Ads.TravelInsurance.Student.Review3.Content'} />,
    icon:   <Rating
              name="text-feedback"
              value={5}
              readOnly
              precision={0.5}
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
  }
]

export default function AdsTravelStudent({match}) {     

  const classes = useStyles()

//   const metaData = {
//     title: "Meta.Home.Title",
//     description: "Meta.Home.Description",
//     canonical: match.url
//   }

  // set userLanguage if url incluede /language
//   const { userLanguage, userLanguageChange } = useContext(LanguageContext)

//   useEffect(() => {
//     if (match.params.language){
//       userLanguageChange(match.params.language)
//     }
//   },[match.params.language, userLanguageChange, userLanguage])

    // Responsive Design
    const [width, setWidth] = useState(window.innerWidth);
    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    let isMobile = (width < 769);

  return (
    <>
      {/* <MetaTags data={metaData} /> */}
    <Grid container>
    <Banner title = {bannerTitle} subTitle = {bannerSubTitle} description = {bannerDescription} quote_url="/travel-insurance/quote/product-selection" />

          <Grid item container style={{ justifyContent: 'center', margin: isMobile? '5vh 1vh':'10vh 1vh', padding: isMobile? '0 25px' : '0' }}>
            <Grid item container style={{ justifyContent: 'center' }}>
              <Typography variant="h2" align="center" gutterBottom>
                <div className={classes.title}>
                  <h3 className={classes.subTitle}>
                    <Text tid={`Ads.TravelInsurance.Student.Section1.Subtitle`} />
                  </h3>
                  <Text tid={`Ads.TravelInsurance.Student.Section1.Section1.Title`} />
                </div>
                <div className={classes.description}>
                  <Text tid={`Ads.TravelInsurance.Student.Section1.Subtitle2`} />
                </div>
              </Typography>
            </Grid>
            <Grid item container style={{ justifyContent: 'center', marginTop:'3vh', fontSize: isMobile? '14px' : '1.1em' }}>
              <Typography variant="body1" align="center" gutterBottom>
                    <Text tid={`Ads.TravelInsurance.Student.Section1.Description1`} />
              </Typography>
            </Grid>
            <Grid item container style={{ justifyContent: 'center', marginBottom:'3vh' }}>
              <Typography variant="body1" align="center" gutterBottom>
                    <Text tid={`Ads.TravelInsurance.Student.Section1.Description2`} />
              </Typography>
            </Grid>
          </Grid>

          {/* <Partner/> */}

      {/* Section 2 - Benefit */}
        <Grid item container 
            style={{ background:'#f2f3f2', margin: isMobile? '3vh 1vh': '10vh 1vh', padding: isMobile? '5vh 25px' : '10vh'}}
        >
            <Container>
                <Benefits 
                    title = {benefitsTitle} 
                    subTitle = {benefitsSubTitle} 
                    benefitsDescriptions = {benefitsDescriptions} 
                    buttonTitle = {benefitsButtonTitle}
                    quote_url="/travel-insurance/quote/product-selection"
                    cardTitle = {cardTitle}
                    cardContents = {cardContents}
                />
            </Container>
        </Grid>

      {/* Section 3 */}
          <Grid item container style={{ justifyContent: 'center', margin: '10vh 1vh', padding: isMobile? '0 25px' : '0' }}>
            <Grid item container xs={12} sm={12} md={11} lg={7} style={{ justifyContent: 'center' }}>
              <Typography variant="h2" align="center" gutterBottom>
                <div className={classes.title}>
                  <Text tid={`Ads.TravelInsurance.Student.Section3.Title`} />
                </div>
              </Typography>
            </Grid>
            <Grid item container xs={12} sm={12} md={11} lg={7} style={{ justifyContent: 'center', margin:'3vh 0' }}>
              <Typography variant="body1" align="center" gutterBottom>
                    <Text tid={`Ads.TravelInsurance.Student.Section3.Description1`} />
              </Typography>
            </Grid>
            <Grid item container xs={12} sm={12} md={11} lg={7} style={{ justifyContent: 'center', margin:'2vh 0' }}>
              <Typography variant="body1" align="center" gutterBottom>
                    <Text tid={`Ads.TravelInsurance.Student.Section3.Description2`} />
              </Typography>
            </Grid>
            <Grid item container xs={12} sm={12} md={11} lg={7} style={{ justifyContent: 'center', margin:'2vh 0', fontWeight:'700' }}>
              <Typography variant="body1" align="center" gutterBottom>
                    <Text tid={`Ads.TravelInsurance.Student.Section3.Description3`} />
              </Typography>
            </Grid>
          </Grid>

      {/* Section 4 - Claim Case*/}
          <Grid item container style={{ justifyContent: 'center', margin: '10vh 1vh', padding: isMobile? '0 25px' : '0' }}>
            <Grid item container style={{ justifyContent: 'center' }}>
              <Typography variant="h2" align="center" gutterBottom>
                <div className={classes.title}>
                  <h3 className={classes.subTitle}>
                    <Text tid={`Ads.TravelInsurance.Student.Section4.Subtitle`} />
                  </h3>
                  <Text tid={`Ads.TravelInsurance.Student.Section4.Title`} />
                </div>
              </Typography>
            </Grid>
            <Grid item container style={{ justifyContent: 'center', margin:'3vh 0' }}>
              <AccordionFAQ faqLists={claimLists}/>
            </Grid>
          </Grid>

        {/* Section 5 Why Canadian Insurance */}
          <Grid item container style={{ justifyContent: 'center', margin: '10vh 1vh', padding: isMobile? '0 25px' : '0' }}>
            <Grid item container style={{ justifyContent: 'center' }}>
              <Typography variant="h2" align="center" gutterBottom>
                <div className={classes.title}>
                  <h3 className={classes.subTitle}>
                    <Text tid={`Ads.TravelInsurance.Student.Section5.Subtitle`} />
                  </h3>
                  <Text tid={`Ads.TravelInsurance.Student.Section5.Title`} />
                </div>
              </Typography>
            </Grid>
            <Grid item container xs={12} sm={12} md={12} lg={8} xl={7} style={{ justifyContent: 'center', margin:'3vh 0' }}>
                {CardSection5.map((con, index) => (
                    <Grid item key={index} xs={12} sm={12} md={6} lg={6}>
                        <Card sx={{ minWidth: 240, height:'fit-content', margin:'5px', padding:'2vh', boxShadow:'none' }}>
                            {con.icon}
                            <CardContent>
                                <div style={{ fontSize: isMobile ? '20px':'25px', fontWeight:'400', lineHeight:'30px', color:'#2a2f71', marginBottom:'3vh'}}>
                                    {con.title}
                                </div>
                                <Typography style={{ fontSize:'16px', fontWeight:'300' }}>
                                {con.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
          </Grid>

          {/* Section 6 Why Stonewell */}
          <Grid item container style={{ justifyContent: 'center', margin: '10vh 1vh', padding: isMobile? '0 25px' : '0' }}>
            <Grid item container style={{ justifyContent: 'center' }}>
              <Typography variant="h2" align="center" gutterBottom>
                <div className={classes.title}>
                  <h3 className={classes.subTitle}>
                    <Text tid={`Ads.TravelInsurance.Student.Section6.Subtitle`} />
                  </h3>
                  <Text tid={`Ads.TravelInsurance.Student.Section6.Title`} />
                </div>
              </Typography>
            </Grid>

            <Grid item container xs={12} sm={12} md={12} lg={8} xl={7} style={{ justifyContent: 'center', margin:'3vh 0' }}>
                {CardSection6.map((con, index) => (
                    <Grid item key={index} xs={12} sm={12} md={6} lg={4}>
                        <Card sx={{ minWidth: 240, height:'fit-content', margin:'5px', padding:'2vh', boxShadow:'none' }}>
                                {con.icon}
                            <CardContent>
                                <div style={{ fontSize: isMobile ? '20px':'25px', fontWeight:'400', lineHeight:'30px', color:'#2a2f71', marginBottom:'3vh'}}>
                                    {con.title}
                                </div>
                                <Typography style={{ fontSize:'16px', fontWeight:'300' }}>
                                {con.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            
         </Grid> 

         {/* Section 7 : FAQ */}
          <Grid item container style={{ justifyContent: 'center', margin: '10vh 1vh', padding: isMobile? '0 25px' : '0' }}>
            <Grid item container style={{ justifyContent: 'center' }}>
              <Typography variant="h2" align="center" gutterBottom>
                <div className={classes.title}>
                  <h3 className={classes.subTitle}>
                    <Text tid={`Ads.TravelInsurance.Student.Section7.Subtitle`} />
                  </h3>
                  <Text tid={`Ads.TravelInsurance.Student.Section7.Title`} />
                </div>
              </Typography>
            </Grid>
            <Grid item container style={{ justifyContent: 'center', margin:'3vh 0' }}>
              <AccordionFAQ faqLists={faqLists}/>
            </Grid>
          </Grid>

          {/* Section 8 : Customer Review */}
          <Grid item container style={{ justifyContent: 'center', margin: '10vh 1vh', padding: isMobile? '0 25px' : '0' }}>
            <Grid item container style={{ justifyContent: 'center' }}>
              <Typography variant="h2" align="center" gutterBottom>
                <div className={classes.title}>
                  <h3 className={classes.subTitle}>
                    <Text tid={`Ads.TravelInsurance.Student.Section8.Subtitle`} />
                  </h3>
                  <Text tid={`Ads.TravelInsurance.Student.Section8.Title`} />
                </div>
              </Typography>
            </Grid>
            <Grid item container xs={12} sm={12} md={12} lg={8} xl={8} style={{ justifyContent: 'center', margin:'3vh 0' }}>
                {CardSection8.map((con, index) => (
                    <Grid item key={index} xs={12} sm={12} md={6} lg={4}>
                        <Card sx={{ minWidth: 240, height:'fit-content', margin:'5px', padding:'2vh', boxShadow:'none' }}>                          
                            <CardContent>
                                <div style={{ fontSize:'25px', fontWeight:'400', lineHeight:'30px', color:'#2a2f71'}}>
                                  {con.title}
                                </div>
                                  {con.icon}
                                <Typography style={{ fontSize:'16px', fontWeight:'300', marginTop:'2vh' }}>
                                  {con.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
          </Grid>

          <Grid item container style={{ justifyContent: 'center', margin: '10vh 1vh', padding: isMobile? '0 25px' : '0' }}>
            <Grid item container style={{ justifyContent: 'center' }}>
              <Typography variant="h2" align="center" gutterBottom>
                <div className={classes.title}>
                  <h3 className={classes.subTitle}>
                    <Text tid={`Ads.TravelInsurance.Student.Section9.Subtitle`} />
                  </h3>
                  <Text tid={`Ads.TravelInsurance.Student.Section9.Title`} />
                </div>
                <div className={classes.description}>
                  <Text tid={`Ads.TravelInsurance.Student.Section9.Subtitle2`} />
                </div>
                <ArrowCircleDownIcon style={{ fontSize:'3rem', marginTop:'5vh'}}/>
              </Typography>
            </Grid>
          </Grid>

    </Grid>
    </>
  )
}