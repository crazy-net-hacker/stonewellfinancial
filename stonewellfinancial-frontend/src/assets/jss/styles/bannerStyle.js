import { theme } from '../theme'

const bannerStyles = {
  root: {
    padding: '10px 24px',
    marginTop: '10vh',
    [theme.breakpoints.down('md')]: {
      marginTop: '0',
      padding:'0',
    },
    maxWidth: '1280px'
  },
  adsRoot: {
    padding: '4vh',
    background: '#fff',
    maxWidth: '1280px',
    [theme.breakpoints.down('md')]: {
      padding: '2vh'
    }
  },
  // Banner Header Style
  bannerBtn: {
    padding: '8px 32px',
    borderRadius: '25px',
    margin: '16px 0px',
    border: 'none',
    '&:hover': {
      backgroundColor: '#ffab00',
      boxSshadow: '0px 2px 2px lightgray',
    },
  },
  bannerWrapper: {
    height: '40vh',
    [theme.breakpoints.between('md','lg')]: {
      height: '30vh',
      textAlign:'center',
      marginBottom:'-40px'
    },
    [theme.breakpoints.between('xs','sm')]: {
      height: '35vh',
      textAlign:'center',
      marginBottom:'-40px'
    },
    margin: '0 auto',
    [theme.breakpoints.up('md')]: {
      marginTop: '-30px',
    },
    // background: `url(/imgs/banner${window.location.pathname}.png)`,
    // backgroundPosition: 'center',
    // backgroundRepeat: 'no-repeat',
    // backgroundSize: 'cover',
    
  },
  headerBanner: {
    background: `url(/imgs/banner${window.location.pathname}.png)`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  headerSubTitle: {
    fontSize: '3rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.6rem'
    },
    lineHeight: '3rem',
    fontWeight: '500',
    color: '#fff',
    letterSpacing: '0',
    // textShadow: '1px 1px #00000070',
    marginBottom: '0.3em !important',
    textShadow: "2px 2px 8px #111"
  },
  adsSubTitle: {
    fontSize: '16px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem'
    },
    lineHeight: '20px',
    fontWeight: '300',
    color: '#000',
    letterSpacing: '0',
  },
  adsTitle: {
    fontSize: '36px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px'
    },
    lineHeight: '36px',
    fontWeight: '500',
    color: '#000',
    letterSpacing: '0',
    // textShadow: '1px 1px #00000070',
    margin: '2vh 0',
  },
  adsDescription: {
    fontSize: '16px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px'
    },
    lineHeight: '20px',
    fontWeight: '300',
    color: '#000',
    letterSpacing: '0',
    // textShadow: '1px 1px #00000070',
    margin: '2vh 0',
  },
  // Banner Quote Style
  bannerQuoteWrapper: {
    marginTop: '100px',
    background: `url(/imgs/bannerQuote${window.location.pathname}.png)`,
    // borderRadius: '50px 0',
    // marginTop: '10vh',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'right',
    // boxShadows: '5px 5px 10px #eee',
    // [theme.breakpoints.down('sm')]: {
    //   background: `linear-gradient(to right,#A3C954,#A3C954e0, #A3C95410), url(/imgs/bannerQuote${window.location.pathname}.png) no-repeat 0 0`,
    //   backgroundSize: 'cover',
    //   backgroundPosition: 'center',
    // },
    [theme.breakpoints.down('md')]: {
      // height: '20vh',
      textAlign:'center',
      marginTop: '80px',
    },  
  },
  bannerQuoteLeft: {
    padding: '2rem',
    background: 'linear-gradient(to right,#f5f5f5,#f5f5f5, transparent)',
    flexDirection: 'column',
    display: 'flex',
    height: '30vh',
    justifyContent: 'center',
    [theme.breakpoints.between('sm','md')]: {
      height: '20vh',
    },
  },
  bannerQuoteTitle: {
    fontSize: '1.4em',
    color: theme.palette.primary.main,
  },
  // Banner Quote Style
  // bannerQuoteWrapper: {
  //   background: `url(/imgs/bannerQuote${window.location.pathname}.png)`,
  //   [theme.breakpoints.down('sm')]: {
  //     background: `linear-gradient(to right,#A3C954, #A3C95410), url(/imgs/bannerQuote${window.location.pathname}.png) no-repeat 0 0`,
  //     backgroundSize: 'cover',
  //     backgroundPosition: 'center',
  //   },
  //   padding: '2rem',
  //   backgroundColor: 'pink',
  //   flexDirection: 'column',
  //   display: 'flex',
  //   // borderRadius: '50px 0 0 0',
  //   height: '300px',
  //   justifyContent: 'center',
  //   boxSshadow: '1px 1px #00000070',
  //   marginTop: '10vh',
  // },

  //BreadCrumbs
  BreadCrumbsWrapper: {
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    padding: '10px 24px',
    alignItem: "center",
    maxWidth: '1280px',
    position:'relative',
    top:'50px'
    
  },
  NavigateNextIcon: {
    color: '#fff'
  },
  link: {
    color: '#fff',
  },

  carouselBtn: {
    // marginTop: 50,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    border:'3px solid #fff',
    borderRadius: '0',
    '&:hover': {
      backgroundColor: '#2a2f71',
      boxSshadow: '0px 2px 2px lightgray',
    },
    [theme.breakpoints.down('sm')]: {
      // marginTop:'30px'
    },
  },
}

export default bannerStyles
