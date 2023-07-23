import React from "react";
import Carousel from "react-multi-carousel";
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import "react-multi-carousel/lib/styles.css";
//components
import { Text } from '../../../components/common/LanguageProvider'

const useStyles = makeStyles((theme) => ({
  greenlineBox: {
    padding:0,
  },
  greenline: {
    width: "2.5rem",
    height: "3px",
    background: "#8EC641",
    display: "inline-block"
  },
  title: {
    [theme.breakpoints.down('sm')]: {
      fontSize:'1.6rem'
    },
  },
  subTitle: {
    color: '#666',
    [theme.breakpoints.down('sm')]: {
      fontSize:'14px',
      fontWeight:'300',
      paddingLeft:'32px',
      paddingRight:'32px',
      color: '#000',
    },
  },
}))

// device
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 7
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    slidesToSlide: 5 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
    slidesToSlide: 3 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};

// 파트너 로고 이미지를 저장후 url 정보를 아래에 등록
const partnerLogo = [
  {name : 'Allianz', 
   logo : 'allianz-logo'
  },
  {name : 'Tugo', 
    logo : 'tugo-logo'
   },
   {name : 'GMS', 
    logo : 'gms-logo'
   },
   {name : 'Blue Cross', 
    logo : 'blueCross-logo'
   },
   {name : 'Sun LifeF inancal', 
    logo :  'sunlife-logo'
   },
   {name : 'Manu Life', 
    logo : 'canada-life-logo'
   },
   {name : 'RBC', 
    logo : 'rbc-logo'
   },
   {name : 'iA', 
    logo : 'ia-logo'
   },
   {name : 'desjardins', 
    logo : 'desjardins-logo'
   },
   {name : 'manulife', 
    logo : 'manulife-logo'
   }
]

export default function Partner() {
  const classes = useStyles()
  return (
    <>
      <Typography variant="h2" align="center">
        <div className={classes.title}>
          <h3 className={classes.subTitle} style={{ fontSize:'1rem' }}><Text tid={`Home.Section5.Subtitle`} /></h3>
          <Text tid={`Home.Section5.Title`} />  
        </div>
                
        <div className={classes.greenlineBox}>
          <span className={classes.greenline}></span>
        </div>
      </Typography>

      <Carousel
        swipeable={false}
        draggable={false}
        showDots={false}    // dot 를 숨기고 싶으시면 false
        responsive={responsive}
        ssr={true} // means to render carousel on server-side.
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={2000}
        keyBoardControl={false}
        customTransition="all .5"
        transitionDuration={500}    // 속도 조정
        containerClass="carousel-container"
        removeArrowOnDeviceType={["superLargeDesktop","desktop","tablet", "mobile"]}
        deviceType={responsive.deviceType}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
      >
        {partnerLogo.map((p) => ( 
        <div className="slide" key ={p.name}>
            <div align="center">
              <img 
                style={{ height: 70}}
                src={require('../../../assets/imgs/logo/' +
                  p.logo +
                  '.png').default}
                alt="Company-logo"
              />
            </div>
        </div>
        ))}
      </Carousel>
    </>
  );
}
