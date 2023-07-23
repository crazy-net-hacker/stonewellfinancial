import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
//common components
import Typography from '@material-ui/core/Typography'
import Hidden from '@material-ui/core/Hidden'
//components
import InfoArea from '../../../components/common/InfoArea'
import { Text } from '../../../components/common/LanguageProvider'
import IconCardNoBk from '../../../components/common/IconCard/IconCardNoBk'
//style
import featuresStyle from '../../../assets/jss/styles/featuresStyle'
//icons
import Filter1Icon from '@material-ui/icons/Filter1';
import Filter2Icon from '@material-ui/icons/Filter2';
import Filter3Icon from '@material-ui/icons/Filter3';
import Filter4Icon from '@material-ui/icons/Filter4';


const iconCardNoBks = [
  {
    icon: 'Filter1Icon',
    iconColor: 'primary',
    title: 'howStonewellWorksTitle1',
    desc: 'howStonewellWorksDescription1',
  },
  // {
  //   icon: 'Filter2Icon',
  //   iconColor: 'primary',
  //   title: 'howStonewellWorksTitle2',
  //   desc: 'howStonewellWorksDescription2',
  // },
  // {
  //   icon: 'Filter3Icon',
  //   iconColor: 'primary',
  //   title: 'howStonewellWorksTitle3',
  //   desc: 'howStonewellWorksDescription3',
  // },
  // {
  //   icon: 'Filter4Icon',
  //   iconColor: 'primary',
  //   title: 'howStonewellWorksTitle4',
  //   desc: 'howStonewellWorksDescription4',
  // },
 
]

const useStyles = makeStyles(featuresStyle)

export default function Process() {
  const classes = useStyles()

  return (
    <>
      <Typography variant="h2" align="center" >
        <div className={classes.sectionTitle}>
          <h3 className={classes.subTitle} style={{ fontSize:'1rem' }}><Text tid={`Home.Section4.Subtitle`} /></h3>
          <Text tid={`Home.Section4.Title`} />
        </div>
       
        <div className={classes.greenlineBox}>
          <span className={classes.greenline}></span>
        </div>
      </Typography>
      <Box mt={5} >
        <Grid container justify="center">
          
            <Grid item container xs={12} md={6}> 
               <IconCardNoBk IconCardNoBks={iconCardNoBks}/>
                <Grid item xs={12}>
                  <InfoArea
                    className={classes.infoArea}
                    icon={Filter1Icon}
                    title="howStonewellWorksTitle1"
                    description="howStonewellWorksDescription1"
                    iconColor="primary"
                  />
                </Grid>
                <Grid item xs={12}>
                  <InfoArea
                    className={classes.infoArea}
                    icon={Filter2Icon}
                    title="howStonewellWorksTitle2"
                    description="howStonewellWorksDescription2"
                    iconColor="primary"
                  />
                </Grid>
                <Grid item xs={12}>
                  <InfoArea
                    className={classes.infoArea}
                    icon={Filter3Icon}
                    title="howStonewellWorksTitle3"
                    description="howStonewellWorksDescription3"
                    iconColor="primary"
                  />
                </Grid>
                <Grid item xs={12}>
                  <InfoArea
                    className={classes.infoArea}
                    icon={Filter4Icon}
                    title="howStonewellWorksTitle4"
                    description="howStonewellWorksDescription4"
                    iconColor="primary"
                  />
                </Grid>
          </Grid>

          <Grid item container md={5}  justify="center" alignItems="center" >
            <Hidden smDown>
            <Grid item md={10} pl={5}>
                  <img
                    className={classes.howWorkImg}
                    src={require('../../../assets/imgs/easylife.jpg').default}
                    alt="..."
                  />
                  
           </Grid>
           </Hidden>
          </Grid>

        </Grid>
        
      </Box>
    </>
  )
}
