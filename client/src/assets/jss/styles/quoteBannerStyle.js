import { theme } from '../theme'

const quoteBannerStyles = {
  root: {
    padding: '10px 24px',
    
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
    padding: '15px 0',
    // [theme.breakpoints.down('md')]: {
    //   height: '30vh'
    // },
    margin: '0 auto',
    [theme.breakpoints.up('md')]: {
      marginTop: '-3em',
    },
    // background: `url(/imgs/banner${window.location.pathname}.png)`,
    // backgroundPosition: 'center',
    // backgroundRepeat: 'no-repeat',
    // backgroundSize: 'cover',
    
  },
  headerBanner: {
    background: "#2a2f71",
  },
  headerSubTitle: {
    fontSize: '25px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px'
    },
    // lineHeight: '3rem',
    fontWeight: '600',
    color: '#fff',
    letterSpacing: '0',
    // textShadow: '1px 1px #00000070',
  },
  headerSubTitle2: {
    fontSize: '25px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px'
    },
    // lineHeight: '3rem',
    fontWeight: '500',
    color: '#2a2f71',
    letterSpacing: '0',
    // textShadow: '1px 1px #00000070',
  },
  subTitle: {
    fontSize: '14px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px'
    },
    color: '#f5f5f5',
  },
  subTitle2: {
    fontSize: '14px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px'
    },
    color: '#555',
  },
  // Banner Quote Style
 
  bannerQuoteLeft: {
    padding: '2rem',
    // backgroundColor: '#f5f5f5',
    // borderTop: '3px solid #8EC641',
    background: 'linear-gradient(to right,#f5f5f5,#f5f5f5, transparent)',
    flexDirection: 'column',
    display: 'flex',
    // borderRadius: '50px 0 0 0',
    height: '30vh',
    justifyContent: 'center',
   
  },
  bannerQuoteTitle: {
    fontSize: '1.4em',
    color: theme.palette.primary.main,
  },
  height: '300px',
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
    
  },
  NavigateNextIcon: {
    color: '#fff'
  },
  link: {
    color: '#fff',
  }
}

export default quoteBannerStyles
