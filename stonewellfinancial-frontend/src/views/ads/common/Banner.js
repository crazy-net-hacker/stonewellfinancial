import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { Text } from '../../../components/common/LanguageProvider'
import Button from '../../../components/common/CustomButtons/Button'

//styles
import bannerStyles from '../../../assets/jss/styles/bannerStyle'

const useStyles = makeStyles(bannerStyles)

export default function Banner(props) {
  const { title, subTitle, description, quote_url, buttonTitle } = props
  const classes = useStyles()

   // Mobile Design
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

   let isMobile = (width <= 768);

  if (quote_url) {
    return (
      <>       
        <Grid
          container
          className={classes.bannerWrapper}
          style={{
            background: `url(../../../../../imgs/banner/travel-insurance/student.png)`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            marginTop: isMobile ? '0' : '2vh'
          }}
          direction="row"
          justify="center"
          alignItems="center"
        >
          {/* <Grid item md={1}></Grid> */}
          <Grid item xs={8} className={classes.adsRoot} style={{ textAlign:'center' }}>
              <Typography variant='h2' className={classes.adsSubTitle}>
                <Text tid={subTitle} />
              </Typography>
              <Typography variant='h1' className={classes.adsTitle}>
                <Text tid={title} />
              </Typography>
              <Typography variant='h3' className={classes.adsDescription}>
                <Text tid={description} />
              </Typography>
            <Link to={quote_url} style={{ textDecoration: 'none' }}>
              <Button className={classes.carouselBtn}>
               <Text tid={ buttonTitle ? buttonTitle : `Get a quote`} />
              </Button>
            </Link>
          </Grid>
          {/* <Hidden only="xs">
            <Grid item xs={12} sm={7} className={classes.headerBanner} />
          </Hidden> */}
        </Grid>
      </>
    )
  } else {
    return (
      <>
        <Grid
          container
          className={classes.bannerWrapper}
          style={{
            // background: `url(/imgs/banner${window.location.pathname}.png)`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
          direction="row"
          justify="center"
          alignItems="center"
        >
          {/* <Grid item md={1}></Grid> */}
          <Grid item xs={8} className={classes.adsRoot}>
              <Typography variant='h2' className={classes.headerSubTitle}>
                <Text tid={subTitle} />
              </Typography>
              <Typography variant='h1' className={classes.headerSubTitle}>
                <Text tid={title} />
              </Typography>
              <Typography variant='h3' className={classes.headerSubTitle}>
                <Text tid={description} />
              </Typography>
          </Grid>
          {/* <Hidden only="xs">
            <Grid item xs={12} sm={7} className={classes.headerBanner} />
          </Hidden> */}
        </Grid>
      </>
    )
  }
}