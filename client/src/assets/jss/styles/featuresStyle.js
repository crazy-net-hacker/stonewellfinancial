import {
  container,
  mlAuto,
  mrAuto,
  title,
  description,
  blackColor,
  whiteColor,
  hexToRgb,
} from "../commonStyle";
import { theme } from '../theme'

const features = {
  container,
  mlAuto,
  mrAuto,
  title,
  description,
  features1: {
    textAlign: "center",
    padding: "80px 0",
  },
  features2: {
    padding: "80px 0",
  },
  features3: {
    padding: "80px 0",
    "& $phoneContainer": {
      maxWidth: "220px",
      margin: "0 auto",
    },
  },
  features4: {
    padding: "80px 0",
    "& $phoneContainer": {
      maxWidth: "260px",
      margin: "60px auto 0",
    },
  },
  features5: {
    padding: "80px 0",
    backgroundSize: "cover",
    backgroundPosition: "50%",
    backgroundRepeat: "no-repeat",
    position: "relative",
    "& $title": {
      marginBottom: "30px",
    },
    "& $title,& $container": {
      position: "relative",
      zIndex: "2",
      color: whiteColor,
    },
    "&:after": {
      background: "rgba(" + hexToRgb(blackColor) + ",0.55)",
      position: "absolute",
      width: "100%",
      height: "100%",
      content: "''",
      zIndex: "0",
      left: "0px",
      top: "0px",
    },
    "& $container": {
      "& $gridContainer:last-child": {
        "& $gridItem": {
          borderBottom: "0",
        },
      },
      "& $gridItem": {
        border: "1px solid rgba(" + hexToRgb(whiteColor) + ", 0.35)",
        borderTop: "0",
        borderLeft: "0",
        "&:last-child": {
          borderRight: "0",
        },
      },
    },
    "& $infoArea5": {
      textAlign: "center",
      maxWidth: "310px",
      minHeight: "320px",
      "& h4,& p,& svg,& .fab,& .fas,& .far,& .fal,& .material-icons": {
        color: whiteColor,
      },
    },
  },
  gridContainer: {},
  gridItem: {},
  textCenter: {
    textAlign: "center",
  },
  phoneContainer: {
    "& img": {
      width: "70%",
    },
  },
  infoArea: {
    maxWidth: "none",
    margin: "10px",
    padding: "20px 0",
    // background: "#eee",
    borderRadius: '10px',
    [theme.breakpoints.down('sm')]: {
      padding: "20px 16px",
    },
  },

  infoArea5: {},
  howWorkImg: {
    width: '100%',
    // height: '50vh',
    objectFit: 'cover',
    borderRadius: '30px 0',
    boxShadow: '2px 2px 5px #aaaaaa',
  },
  greenlineBox: {
    padding:0,
  },
  greenline: {
    width: "2.5rem",
    height: "3px",
    background: "#8EC641",
    display: "inline-block"
  },
  sectionTitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize:'1.6rem'
    },
  },
  adSectionTitle: {
    fontSize:'36px',
    fontWeight:'500',
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
  carouselBtn: {
    // marginTop: 50,
    color: '#fff',
    backgroundColor: '#92BD01',
    // border:'3px solid #fff',
    borderRadius: '0',
    '&:hover': {
      backgroundColor: '#92BD01',
      boxSshadow: '0px 2px 2px lightgray',
    },
    [theme.breakpoints.down('sm')]: {
      // marginTop:'30px'
    },
  }
};

export default features;
