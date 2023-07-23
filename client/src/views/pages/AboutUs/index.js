import React from 'react'
import { Grid } from '@material-ui/core'
// import { makeStyles } from '@material-ui/core/styles'
import { Text } from '../../../components/common/LanguageProvider'
//components
import Hidden from '@material-ui/core/Hidden'

import MetaTags from '../../../components/common/MetaTags'
import Banner from '../../../components/common/Banner'
import StickyLeftMenu from '../../../components/common/StickyLeftMenu'
import SectionContent from '../../../components/common/SectionContent'
import WhyUs from '../../../components/common/WhyUs'

// banner Title
const bannerTitle = ['About Us']
const links = [
  {
    to: '/',
    name: 'Home',
  },
  {
    to: '/about-us',
    name: 'About Us',
  },
]
// const useStyles = makeStyles((theme) => ({
//   bgEven: {
//     backgroundColor: '#efefef',
//     padding: '50px 0',
//   },
//   titleDecoration: { border: '3px solid #8ec641', width: '2.5rem' },
//   numberWrapper: {
//     margin: '16px 8px',
//     display: 'block',
//     textAlign: 'center',
//     '& p': {
//       fontWeight: 800,
//       fontSize: '1.5rem',
//       marginBottom: 0,
//       color: theme.palette.primary.main,
//     },
//     '& span': {
//       textTransform: 'uppercase',
//       color: theme.palette.primary.main,
//       fontWeight: 600,
//     },
//   },
//   company_imgWrapper: {
//     textAlign: 'center',
//     '& img': {
//       maxWidth: '100%',
//       minHeight: '330px',
//       objectFit: 'cover',
//       borderRadius: '60px',
//       [theme.breakpoints.down('sm')]: {
//         width: '70%',
//       },
//       [theme.breakpoints.down('xs')]: {
//         width: '95%',
//       },
//     },
//   },
//   inlineFlex: { display: 'inline-flex' },
//   visionCard: {
//     textAlign: 'center',
//     margin: '16px 0',
//     '& img': {
//       maxWidth: '60px',
//       maxHeight: '60px',
//       objectFit: 'cover',
//     },
//     '& p': {
//       fontWeight: 500,
//       textTransform: 'Uppercase',
//       marginTop: 8,
//     },
//   },
//   stonwell_imgWrapper: {
//     textAlign: 'center',
//     '& img': {
//       width: '100%',
//       objectFit: 'cover',
//       [theme.breakpoints.down('md')]: {
//         width: '70%',
//       },
//       [theme.breakpoints.down('xs')]: {
//         width: '95%',
//       },
//     },
//   },
//   serviceSection: {
//     justifyContent: 'center',
//     marginBottom: '16px',
//     '& img': {
//       width: '100%',
//       padding: '16px 24px',
//       objectFit: 'cover',
//     },
//   },
// }))

const stickyLeftMenu = [
  {
    href: '#who-we-are',
    title: 'Aboutus.Stonewell.Label',
  },
  {
    href: '#what-we-do',
    title: 'Aboutus.OurVision.Label',
  },
  {
    href: '#like-a-stonewell',
    title: 'Aboutus.LikeStonewell.Label',
  },
 
  {
    href: '#how-we-work',
    title: 'Aboutus.Service.Label',
  },
  {
    href: '#why-us',
    title: 'Banner.Whyus.label',
  },
]

export default function AboutUs({match}) {  
  const metaData = {
    title: 'Meta.AboutUs.Title',
    description: 'Meta.AboutUs.Description',
    canonical: match.url
  }

  return (
    <>
      <MetaTags data={metaData} />
      <Banner title={bannerTitle} links={links}  />
      <Grid container justify="center" spacing={0}>
        {/* Side menu */}
        <Hidden mdDown>
          <Grid item lg={2}>
            <StickyLeftMenu
              pageName={<Text tid={'Travel Insurance'} />}
              lists={stickyLeftMenu}
              quote_url="/travel-insurance/quote/trip-info"
              title={<Text tid={'Travel Insurance'}/>}
            />
          </Grid>
        </Hidden>
        {/* Contents */}
        <Grid item sm={12} lg={6}>
          <section className="target" id="who-we-are">
            <SectionContent
              label="Aboutus.Stonewell.Label"
              detail="Aboutus.Stonewell.Content"
            />
          </section>
          <section className="target" id="what-we-do">
            <SectionContent
              label="Aboutus.OurVision.Label"
              detail="Aboutus.OurVision.Content"
            />
            
          </section>
          <section className="target" id="like-a-stonewell">
            <SectionContent
              label="Aboutus.LikeStonewell.Label"
              detail="Aboutus.LikeStonewell.Content"
            />
          </section>
          <section className="target" id="how-we-work">
            <SectionContent
              label="Aboutus.Service.Label"
              detail="Aboutus.Service.Content"
            />
          </section>
          <section id="why-us">
              <Grid container justify="center" >
                <Grid item xs={12}>
                  <SectionContent
                    label="Banner.Whyus.label"
                    detail="Banner.Whyus.detail"
                  />
                </Grid>
                <Grid item xs={12} style={{maxWidth:"1000px"}}>
                  <WhyUs />
                </Grid>
              </Grid>
          </section>
        </Grid>
      </Grid>
    </>
  )
}
