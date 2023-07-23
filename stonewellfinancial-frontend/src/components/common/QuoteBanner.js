import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { Text } from './LanguageProvider'

import { Breadcrumbs } from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'

// import Button from './CustomButtons/Button'
import { Hidden } from '@material-ui/core'

//styles
import quoteBannerStyles from '../../assets/jss/styles/quoteBannerStyle'

const useStyles = makeStyles(quoteBannerStyles)

export const QuoteBanner = (props) => {
  const { title, subTitle, links } = props
  const classes = useStyles()
 
    return (
      <>
               <Hidden smDown>
          {/* Breadcrumbs */}
          <Grid container justify="center">
          
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
          </Grid>
        </Hidden>

        <Grid
          container
          className={classes.bannerWrapper}
          style={{ 
            background: '#2a2f71',
          }}
          direction="row"
          justify="center"
          alignItems="center"
        >
          {/* <Grid item md={1}></Grid> */}
          <Grid item xs={8} className={classes.root}>
          
              <Typography className={classes.headerSubTitle} key={title}>
                <Text tid={title} />
              </Typography>
              <Typography className={classes.subTitle} key={subTitle}>
                <Text tid={subTitle}/>
              </Typography>
         
          </Grid>
          
        </Grid>
      </>
    )
  }

