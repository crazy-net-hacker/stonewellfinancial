import React, { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { Text } from './LanguageProvider'

// import { Breadcrumbs } from '@material-ui/core'
// import NavigateNextIcon from '@material-ui/icons/NavigateNext'

// import Button from './CustomButtons/Button'
// import { Hidden } from '@material-ui/core'

//styles
import quoteBannerStyles from '../../assets/jss/styles/quoteBannerStyle'

const useStyles = makeStyles(quoteBannerStyles)

export const QuoteBanner2 = (props) => {
  const { title, subTitle, icon } = props
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
  
  let isMobile = (width < 768);

      return (
      <>
          {/* <Hidden smDown> */}
          {/* Breadcrumbs */}
          {/* <Grid container justify="center">
          
            <Grid item container xs={8} justify="flex-end" className={classes.BreadCrumbsWrapper}>
            
              <Breadcrumbs
                className={classes.NavigateNextIcon}
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
              >
                {links.map((link) => (
                  <Link className={classes.link} to={link.to} key={link}>
                    <Text tid={link.name} />
                  </Link>
                ))}
              </Breadcrumbs>
            
            </Grid>
          </Grid> */}
        {/* </Hidden> */}
        <Grid
          container
          // className={classes.bannerWrapper}
          style={{padding:'3vh 0', background:'#f9f9f9', marginBottom:'2vh', marginTop: isMobile ? '0px':'37px'}}
          direction="row"
          justify="center"
          alignItems="center"
        >
          {/* <Grid item md={1}></Grid> */}
          <Grid item xs={12} style={{textAlign:'center'}} className={classes.root}>
              
              <Typography className={classes.headerSubTitle2} key={title}>
                {icon} <Text tid={title} />
              </Typography>
              <Typography className={classes.subTitle2} key={subTitle}>
                <Text tid={subTitle}/>
              </Typography>
         
          </Grid>
          
        </Grid>
      </>
    )
  }

