import React, { useContext, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'

import MetaTags from '../../../components/common/MetaTags'
import { LanguageContext, Text } from '../../../components/common/LanguageProvider'

//Components
import WhyUs from '../../../components/common/WhyUs'
import Banner from './Banner'
import Partner from './Partner'
import Products from '../../../components/common/Product/Products'
// import Process from './Process'
import Process from './Process'
// import Platform from './Platform'

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
    [theme.breakpoints.down('sm')]: {
      fontSize:'1.6rem'
    },
  },
  subTitle: {
    color: '#666',
    fontSize:'1rem',
    [theme.breakpoints.down('sm')]: {
      fontSize:'14px',
      fontWeight:'300',
      paddingLeft:'32px',
      paddingRight:'32px',
      color: '#000',
    },
  },
}))

const homeProducts = [
  {
    title: <Text tid={`Travel Insurance`} />,
    description:
    <Text tid={`HomeProduct.TravelInsurance.Description`} />,
    img: 'travelIns',
    url: 'travel-insurance',
  },
  {
    title: <Text tid={`Life Insurance`} />,
    description:
    <Text tid={`HomeProduct.LifeInsurance.Description`} />,
    img: 'lifeIns',
    url: 'life-insurance',
  },
  {
    title: <Text tid={`Health Insurance`} />,
    description:
    <Text tid={`HomeProduct.HealthInsurance.Description`} />,
    img: 'healthIns',
    url: 'health-insurance',
  },
  {
    title: <Text tid={`Group Benefits`} />,
    description:
    <Text tid={`HomeProduct.GroupInsurance.Description`} />,
    img: 'groupIns',
    url: 'group-benefits',
  },
]

const travelProducts = [
  {
    title: <Text tid={`Students`} />,
    description:
    <Text tid={`TravelProducts.Students.Description`} />,
    img: 'students',
    url: 'travel-insurance/student',
  },
  {
    title: <Text tid={`Companions`} />,
    description:
    <Text tid={`TravelProducts.Companions.Description`} /> ,
    img: 'companions',
    url: 'travel-insurance/student',
  },
  {
    title: <Text tid={`Visitors`} />,
    description:
    <Text tid={`TravelProducts.Visitors.Description`} />,
    img: 'visitors',
    url: 'travel-insurance/visitor',
  },
  {
    title: <Text tid={`Canadian Travelers`} />,
    description:
    <Text tid={`TravelProducts.Canadian Travelers.Description`} />,
    img: 'canadianTravel',
    url: 'travel-insurance/canadian-traveller',
  },
]

export default function Home({match}) {     

  const classes = useStyles()

  const metaData = {
    title: "Meta.Home.Title",
    description: "Meta.Home.Description",
    canonical: match.url
  }

  // set userLanguage if url incluede /language
  const { userLanguage, userLanguageChange } = useContext(LanguageContext)

  useEffect(() => {
    if (match.params.language){
      userLanguageChange(match.params.language)
    }
  },[match.params.language, userLanguageChange, userLanguage])


  return (
    <>
      <MetaTags data={metaData} />
      <Banner />
      <Box my={10}>
        <Container>
          <Grid container style={{ justifyContent: 'center' }}>
            <Typography variant="h2" align="center" gutterBottom>
              <div className={classes.title}>
                <h3 className={classes.subTitle}>
                  <Text tid={`Home.Section1.Subtitle`} />
                </h3>
                <Text tid={`Home.Section1.Title`} />
              </div>
              <div className={classes.greenlineBox}>
                <span className={classes.greenline}></span>
              </div>
            </Typography>
            <Typography variant="body1" align="center"></Typography>
            <Products Products={homeProducts}/>
          </Grid>
        </Container>
      </Box>
      <Box py={1} style={{ backgroundColor: '#f7f7f7' }}>
        <Container style={{ marginTop: 80, marginBottom: 80 }}>
          <Typography variant="h2" align="center" gutterBottom>
            <div className={classes.title}>
              <h3 className={classes.subTitle}>
                <Text tid={`Home.Section2.Subtitle`} />
              </h3>
              <Text tid={`Home.Section2.Title`} />
            </div>
            
            <div className={classes.greenlineBox}>
              <span className={classes.greenline}></span>
            </div>
          </Typography>
          <WhyUs />
        </Container>
      </Box>
      <Box my={10}>
        <Container style={{ marginTop: 80, marginBottom: 80 }}>
          <Typography variant="h2" align="center" gutterBottom>
            <div className={classes.title}>
              <h3 className={classes.subTitle}>
              <Text tid={`Home.Section3.Subtitle`} />
              </h3>
              <Text tid={`Home.Section3.Title`} />
            </div>
           
            <div className={classes.greenlineBox}>
              <span className={classes.greenline}></span>
            </div>
          </Typography>

          <Products Products={travelProducts} />
          {/* <TravelInsurance/> */}
        </Container>
      </Box>

      <Box my={10} style={{ backgroundColor: '#f7f7f7' }}>
        <Container
          style={{
            marginTop: 80,
            marginBottom: 40,
            paddingTop: 80,
            paddingBottom: 80,
          }}
        >
          <Process />
        </Container>
      </Box>

      <Box py={5}>
        <Container style={{ marginBottom: 80 }}>
          <Partner />
        </Container>
      </Box>
    </>
  )
}
