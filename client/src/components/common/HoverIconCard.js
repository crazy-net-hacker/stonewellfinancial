import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import classNames from 'classnames'
const useStyles = makeStyles((theme) => ({
  root: {},
  hoverCard: {
    height: 200,

    backgroundColor: '#f5f5f5', //theme.palette.primary.light,
    // border: '1px solid #dee1e3',
    position: 'relative',
    borderRadius: '30px 0',
    '&:hover': {
      // cardBack: {
      //   backgroundImage: `url('/imgs/icon/EstatePlanning.svg')`
      // },
      transform: 'scale(1.05)',
    },
  },

  cardFront: {
    position: 'absolute',
    padding: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '100%',
    textAlign: 'center',
    transition: 'opacity 600ms, visibility 600ms',
    '& img': {
      width: 50,
    },
    '& h3': {
      marginTop: 24,
      fontSize:'1em'
    },
  },
  cardBack: {
    position: 'absolute',
    padding: '1em',
    top: '50%',
    borderRadius: '30px 0',
    transform: 'translateY(-50%)',

    textAlign: 'center',
    transition: 'opacity 600ms, visibility 600ms',
    height: 200,
    width: '100%',
    backgroundSize: '150px 150px',
  },
  eventsCardTitle: {
    // color: theme.palette.primary.main,
    margin: '-0.5em 0 0.5em 0',
  },
  eventsCardContent: {
    fontSize: '0.8em',
  },
  show: {
    visibility: 'visible',
    opacity: 1,
  },
  none: {
    visibility: 'hidden',
    opacity: 0,
  },
}))

const HoverIconCard = (props) => {
  const { title, content, icon, iconBk } = props
  const classes = useStyles()
  const [hover, setHover] = useState(false)
  const [width, setWidth] = useState(window.innerWidth)

  const onHover = () => {
    // isDesktop? setHover(true) : null
    setHover(true)
    // console.log('hover')
  }
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [width])

  useEffect(() => {
    width > 960 && handleSideNavToggle()
  }, [width])

  function handleSideNavToggle() {
    setHover(false)
  }

  return (
    <Box
      className={classes.hoverCard}
      onMouseEnter={width > 960 ? onHover : null}
      onMouseLeave={width > 960 ? handleSideNavToggle : null}
    >
      <div
        className={
          hover || width < 960
            ? classNames(classes.none, classes.cardFront)
            : classNames(classes.show, classes.cardFront)
        }
        style={
          {
            // backgroundColor: '#f5f5dc73',
          }
        }
      >
        <img src={icon} alt="When do you need life insurance" />
        <Typography className={classes.eventsCardTitle} variant="h3">
          {title}
        </Typography>
      </div>
      <div
        className={
          hover || width < 960
            ? classNames(classes.show, classes.cardBack)
            : classNames(classes.none, classes.cardBack)
        }
        style={{
          backgroundImage: `url(${iconBk})`,
          backgroundPosition: 'center',
          backgroundSize: 'contained',
          backgroundRepeat: 'no-repeat',
          border: '2px solid #A3C954',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // background: `linear-gradient(rgba(163, 201, 84, 0.8), rgba(163, 201, 84, 0.8)), url(${icon}) no-repeat fixed center`,
          //background:
          //  'linear-gradient(rgba(163, 201, 84, 0.35), rgba(163, 201, 84, 0.35)), url(/imgs/icon/test04.svg) no-repeat fixed center',
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            <Typography className={classes.eventsCardTitle} variant="h3" style={{ fontSize:'1em' }}>
              {title}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.eventsCardContent} variant="body2">
              {content}
            </Typography>
          </Grid>
        </Grid>
      </div>
    </Box>
  )
}

export default HoverIconCard
