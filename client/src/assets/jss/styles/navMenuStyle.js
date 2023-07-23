import { theme } from '../theme'
const navMenuStyles = {
  root: {
    height: 80,
    backgroundColor: '#fff',
    // borderBottom: '#d2d2d2b0 1px solid',
    '& a': {
      color: theme.palette.neutral.dark,
      fontWeight: 500,
      textDecoration: 'none',
      
      // textTransform: 'uppercase',
      '&:hover': {
        color: theme.palette.primary.main,
        fontWeight: 600,
        
        //textDecoration: 'none',
      },
    },
    [theme.breakpoints.down(960)]: {
      height: 70,
    },
    [theme.breakpoints.down('xs')]: {
      height: 50,
    },
  },
  navDesktop: {
    float: 'right',
    [theme.breakpoints.down(960)]: {
      display: 'none',
    },
   '& a': {
    '&:hover': {
      borderBottom: '3px solid #8EC641'
    }
   }
  },
  navSubDesktop: {
    float: 'right',
    [theme.breakpoints.down(960)]: {
      display: 'none',
    },
   '& a': {
    '&:hover': {
      // borderBottom: '3px solid #8EC641'
    }
   }
  },
  navMobile: {
    float: 'right',
    [theme.breakpoints.up(960)]: {
      display: 'none',
    },
  },
  navMainLogo: {
    height: 70,
    padding: '.43rem',
    [theme.breakpoints.down('xs')]: {
      height: 50,
    },
  },
  navList: {
    padding: 0,
  },
  navListItem: {
    display: 'inline-block',
    width: 'auto',
    lineHeight: '30px',
    fontSize:'16px',

    '&:hover': {
      '& $navSubMenu': {
        display: 'block !important',
      },
    },
   

  },
  navSubMenu: {
    display: 'none',
    position: 'absolute',
    backgroundColor: '#fff',
    width: 250,
    left: 0,
    marginTop: '10px',
    zIndex: 9999,
    paddingTop: 0,
    paddingBottom: 0,
    // borderBottom: '5px solid #8EC641',
   
  },
  nav_SubMenu_Item: {
    lineHeight: '30px',
    padding: '10px 20px',
    // borderBottom: '1px solid #22265a',
    '&:hover': {
      backgroundColor: '#eee',
      borderLeft: '5px solid #8EC641',
      color: "#fff"
    },
    '& a': {
      color: theme.palette.neutral.dark,
      textDecoration: 'none',
      '&:hover': {
        color: theme.palette.primary.main,
        borderBottom: '0'
      },
    },
  },
  // left sidebar css
  list: {
    width: 350,
  },
  navLinksMobile: {
    color: theme.palette.secondary.dark,
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none !important',
    '&:hover': {
      // color: theme.palette.common.black,
      color: theme.palette.primary,
      textDecoration: 'none',
    },
  },
  sideBarDrawer: {
    paddingTop: '20px',
    width: 250,
  },
  sideBartItem: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
  },
  sideBarButton: {
    color: theme.palette.secondary.dark,
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    textDecoration: 'none !important',
  },
  sideBarBtnRoot: {
    paddingLeft: '0',
    justifyContent: 'left !important',
  },
  sideBarSubMenu: {
    paddingLeft: '50px !important',
  },
  navLeft_expand: {
    // backgroundColor: theme.palette.primary.light,
    '& a': {
      color: '#555',
      fontWeight: 400,
      paddingLeft:'15px',
    },
  },
 

}

export default navMenuStyles
