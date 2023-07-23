// import React from 'react'
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Text } from '../../../components/common/LanguageProvider'

const useStyles = makeStyles((theme) => ({
  // Slide
  carouselImg1: {
    background: 'url("/imgs/banner/travel-insurance.png")',
    height: '450px',
    maxWidth: '100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    display: 'flex',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      height: '300px',
    },
  },
  carouselImg2: {
    background: 'url("/imgs/banner/life-insurance.png")',
    height: '450px',
    maxWidth: '100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    display: 'flex',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      height: '300px',
    },
  },
  carouselImg3: {
    background: 'url("/imgs/banner/health-insurance.png")',
    height: '450px',
    maxWidth: '100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    display: 'flex',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      height: '300px',
    },
  },
  carouselImg4: {
    background: 'url("/imgs/banner/group-benefits.png")',
    height: '450px',
    maxWidth: '100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    display: 'flex',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      height: '300px',
    },
  },
  carouselText: {
    fontSize: '3.5rem',
    fontWeight: '500',
    color: '#fff',
    textShadow: '1px 1px #00000070',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem',
    },
  },
  carouselSubTitle: {
    color: '#fff',
    textShadow: '1px 1px #00000070',
  },
  carouselTextWrapper: {
    marginTop: 150,
    marginLeft: '15%',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      marginLeft: '10%',
      marginRight: '10%',
      marginTop:60
    },
  },
  carouselBtn: {
    marginTop: 50,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    border:'3px solid #fff',
    borderRadius: '0',
    '&:hover': {
      backgroundColor: '#2a2f71',
      boxSshadow: '0px 2px 2px lightgray',
    },
    [theme.breakpoints.down('sm')]: {
      marginTop:'30px'
    },
  },
}))



export default function Banner() { 
  const classes = useStyles()
  //Responsive Design
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

  let isMobile = (width <= 959);

  var settings = {
    dots: true,
    arrows: isMobile ? false : true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  return (
    <>
      {/* slide header */}
      <div className={'carousel-header'} style={{ position:'relative', top: isMobile? '0':'37px' }}>
        <Slider {...settings}>
        <div className={classes.carouselImg1}>
            <div className={classes.carouselTextWrapper}>
              <Typography className={classes.carouselText}>
                <Text tid={`Travel Insurance`} />
              </Typography>
              <Typography className={classes.carouselSubTitle} variant="h5">
                <Text tid={`Travel Insurance Subtitle`} />
              </Typography>
              <Link to={`/travel-insurance/quote/trip-info`} style={{textDecoration:'none'}}>
                <Button
                  className={classes.carouselBtn}
                  variant="contained"
                  size="large"
                >
                   <Text tid={`Get a quote`} />
                </Button>
              </Link>
            </div>
          </div>
          <div className={classes.carouselImg2}>
            <div className={classes.carouselTextWrapper}>
              <Typography className={classes.carouselText}>
                <Text tid={`Life Insurance`} />
              </Typography>
              <Typography className={classes.carouselSubTitle} variant="h5">
                <Text tid={`Life Insurance Subtitle`} />
              </Typography>
              <Link to={`/life-insurance/quote/product-selection`} style={{textDecoration:'none'}}>
                <Button
                  className={classes.carouselBtn}
                  variant="contained"
                  size="large"
                >
                   <Text tid={`Get a quote`} />
                </Button>
              </Link>
            </div>
          </div>
          <div className={classes.carouselImg3}>
            <div className={classes.carouselTextWrapper}>
              <Typography className={classes.carouselText}>
                <Text tid={`Health Insurance`} />
              </Typography>
              <Typography className={classes.carouselSubTitle} variant="h5">
                <Text tid={`Health Insurance Subtitle`} />
              </Typography>
              <Link to={`/health-insurance/quote/product-selection`} style={{textDecoration:'none'}}>
                <Button
                  className={classes.carouselBtn}
                  variant="contained"
                  size="large"
                >
                 <Text tid={`Get a quote`} />
                </Button>
              </Link>
            </div>
          </div>
          <div className={classes.carouselImg4}>
            <div className={classes.carouselTextWrapper}>
              <Typography className={classes.carouselText}>
                <Text tid={`Group Benefits`} />
              </Typography>
              <Typography className={classes.carouselSubTitle} variant="h5">
              <Text tid={`Group Benefits Subtitle`} />  
              </Typography>
              <Link to={`/group-benefits/quote/product-selection`} style={{textDecoration:'none'}}>
                <Button
                  className={classes.carouselBtn}
                  variant="contained"
                  size="large"
                >
                  <Text tid={`Get a quote`} />
                </Button>
              </Link>
            </div>
          </div>
        </Slider>
      </div>
    </>
  )
}
