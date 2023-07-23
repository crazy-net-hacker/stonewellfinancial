import React from 'react';
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Text } from '../../../components/common/LanguageProvider'
import WindowDimension from '../../../components/common/WindowDimension'


const useStyles = makeStyles((theme) => ({
  // Slide
  carouselImg: {
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
    fontSize: '1rem',
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


const bannerslide = [
    { img: "travel-insurance.png", title: "Travel Insurance", linkQuote:"/travel-insurance/quote/trip-info" },
    { img: "life-insurance.png", title: "Life Insurance", linkQuote: "/life-insurance/quote/product-selection"},
    { img: "health-insurance.png", title: "Health Insurance", linkQuote: "/health-insurance/quote/product-selection"},
    { img: "group-benefits.png", title: "Group Benefits", linkQuote:"/group-benefits/quote/product-selection"},
]


export default function Banner() { 

  const classes = useStyles()

  const { width } = WindowDimension();
  let isMobile = (width <= 959);

  var settings = {
  dots: true,
  arrows: isMobile ? false : true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 5000,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
  }


  return (
    <div className={'carousel-header'} style={{ position:'relative', top: isMobile? '0':'37px' }}>
    <h1 style={{ display:'none' }}><Text tid={`Meta.Home.Title`}/></h1>
      <Slider id="bannerSlider" {...settings}>
        {bannerslide.map((item, i) => (
            <div key={i}>
                <div className={classes.carouselImg} style={{ backgroundImage: "url(/imgs/banner/" + item.img + ")" }}>
                  <div className={classes.carouselTextWrapper}>
                    <Typography variant="h2" className={classes.carouselText}>
                    {/* <h1 className={classes.carouselText}> */}
                      <Text tid={item.title} />
                    {/* </h1> */}
                    </Typography>
                    <Typography className={classes.carouselSubTitle} variant="h3">
                      <Text tid={`Travel Insurance Subtitle`} />
                    </Typography>
                    <Link to={item.linkQuote} onClick={()=>{window.dataLayer.push({'event': 'Request quote'})}} style={{textDecoration:'none'}}>
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
            </div>
        ))}
      </Slider>
    </div>
  )
}
