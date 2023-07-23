import React from 'react'
// core components 
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
// import { Container, Box, Typography } from '@material-ui/core'
import { Text } from '../../../components/common/LanguageProvider'
//components
import MetaTags from '../../../components/common/MetaTags'
import Banner from '../../../components/common/Banner';
import Hidden from '@material-ui/core/Hidden'
import StickyLeftMenu from '../../../components/common/StickyLeftMenu'
import SectionContent from '../../../components/common/SectionContent'
import IconCardNoBk from '../../../components/common/IconCard/IconCardNoBk'
import InfoArea from '../../../components/common/InfoArea'
//icons
import Filter1Icon from '@material-ui/icons/Filter1';
import Filter2Icon from '@material-ui/icons/Filter2';
import Filter3Icon from '@material-ui/icons/Filter3';
//style
import featuresStyle from '../../../assets/jss/styles/featuresStyle'


// banner Title
const bannerTitle = [<Text tid={'How to claim travel insurance'}/>]
const links = [
  {
    to: '/',
    name: 'Home',
  },
  {
    to: '/insurance/claim',
    name: 'Claim Process',
  }]
const stickyLeftMenu = [
  {
    href: '#what-to-do-when-emergency',
    title: 'ProcessClaim.Label1',
  },
  {
    href: '#claim-process',
    title: 'ProcessClaim.ClaimProcess.label',
  },
  {
    href: '#important-note',
    title: 'ProcessClaim.ClaimProcess.extraTitle',
  },
 
]
const iconCardNoBks = [
  {
    icon: 'Filter1Icon',
    iconColor: 'primary',
    title: 'howStonewellWorksTitle1',
    desc: 'howStonewellWorksDescription1',
  },
] 

const useStyles = makeStyles(featuresStyle)

export default function ProcessClaim({match}) { 
  const metaData = {
    title: 'How to claim travel insurance',
    description: 'ProcessClaim.Detail1',
    canonical: match.url
  }

  const classes = useStyles()

  return (
    <>
      <MetaTags data={metaData} />
      <Banner
        title={bannerTitle}
        links={links}
      />
      <Grid container justify="center" spacing={0}>
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
          <Grid item sm={12} lg={6}>
            <section className="target" id="what-to-do-when-emergency">
              <SectionContent
                label="ProcessClaim.Label1"
                detail="ProcessClaim.Detail1"
              />
            </section>
        
            <section className="target" id="claim-process">
              <SectionContent
                label="ProcessClaim.ClaimProcess.label"
                detail=""
              />
              <IconCardNoBk IconCardNoBks={iconCardNoBks}/>
                
                <InfoArea
                  className={classes.infoArea}
                  icon={Filter1Icon}
                  title="ProcessClaim.ClaimProcess.label"
                  description="ProcessClaim.ClaimProcess.First.desc"
                  iconColor="primary"
                />
            
                <InfoArea
                  className={classes.infoArea}
                  icon={Filter2Icon}
                  title="ProcessClaim.ClaimProcess.Second.title"
                  description="ProcessClaim.ClaimProcess.Second.desc"
                  iconColor="primary"
                />
             
                <InfoArea
                  className={classes.infoArea}
                  icon={Filter3Icon}
                  title="ProcessClaim.ClaimProcess.Third.title"
                  description="ProcessClaim.ClaimProcess.Third.desc"
                  iconColor="primary"
                />
            </section>

            <section className="target" id="important-note" style={{ marginBottom:'20vh' }}>
              <SectionContent
                label="ProcessClaim.ClaimProcess.extraTitle"
                detail="ProcessClaim.ClaimProcess.extraDetail"
              />
            </section>
               
          </Grid>
      </Grid>


    </>
  )
}

