import { theme } from '../theme'

// import { grey, blue } from '@material-ui/core/colors'
const drawerWidth = 292
const iconDrawerWidth = 50

const dashboardMenuStyles = {
  root: {
    height: 80,
    

    borderBottom: '#d2d2d2b0 1px solid',
    '& a': {
      color: theme.palette.neutral.dark,
      fontWeight: 500,
      textDecoration: 'none',

      // textTransform: 'uppercase',
      '&:hover': {
        color: theme.palette.primary.main,
        fontWeight: 600,

        textDecoration: 'none',
      },
    },
    [theme.breakpoints.down(1367)]: {
      height: 60,
    },
    [theme.breakpoints.down('xs')]: {
      height: 50,
    },
  },

  navDesktop: {
    float: 'right',
    [theme.breakpoints.down(1367)]: {
      display: 'none',
    },
    '& a': {
      '&:hover': {
        borderBottom: '3px solid #8EC641',
      },
    },
  },
  navMobile: {
    float: 'right',
    marginBottom:'-5px',
    [theme.breakpoints.up(1367)]: {
      display: 'none',
      marginRight: '0',
    },
    [theme.breakpoints.up(767)]: {
      marginRight: '12px',
    },
  },
  navMobile2: {
    float: 'right',
    [theme.breakpoints.up(767)]: {
      display: 'none',
    },
  },
  langSelector: {
    marginBottom:'-5px'
  },

  navMainLogo: {
    marginLeft: 0,
    height: 60,
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
    lineHeight: '60px',

    '&:hover': {
      '& $navSubMenu': {
        display: 'block !important',
      },
    },
  },
  navSubMenu: {
    display: 'none',
    position: 'absolute',

    width: 250,
    left: 0,
    marginTop: '10px',
    zIndex: 999,
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
      color: '#fff',
    },
    '& a': {
      color: theme.palette.neutral.dark,
      textDecoration: 'none',
      '&:hover': {
        color: theme.palette.primary.main,
        borderBottom: '0',
      },
    },
  },
 
  // left sidebar css
  list: {
    width: 250,
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
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#fff',
    boxShadow: 'none',
    padding: '0',
    borderBottom:'1px solid #ddd'
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
    // paddingLeft: '25px',
    justifyContent: 'left',
    width:'100%',
    fontSize: '15px',
    color: '#fff',
    textTransform: 'None',
    fontWeight: '500',
    paddingLeft: '0',
  },
  sideBarSubMenu: {
    // paddingLeft: '50px !important',
  },
  navLeft_expand: {
    // backgroundColor: theme.palette.primary.light,
    backgroundColor: '#2a2f71',
    '& a': {
      color: theme.palette.neutral.white,
    },
    
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerOpen: {
    width: drawerWidth,
    backgroundColor: '#2a2f71',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.up('sm')]: {
      width: -drawerWidth,
    },
  },
  drawerClose: {
    border:'none',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),

    overflowX: 'hidden',
    // width: theme.spacing(7) + 15,
    width: '0',
    [theme.breakpoints.up('sm')]: {
      // width: theme.spacing(7) + 15,
      width: '0',
    },
  },

  IconDrawerOpen: {
    width: iconDrawerWidth,
    backgroundColor: '#2a2f71',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.up('md')]: {
      width: -iconDrawerWidth,
    },
  },
  IconDrawerClose: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),

    overflowX: 'hidden',
    // width: theme.spacing(7) + 15,
    width: '0',
    [theme.breakpoints.up('md')]: {
      // width: theme.spacing(7) + 15,
      width: '0',
    },
  },

  drawerPaper: {
    width: drawerWidth,
    
  },
  fabAction: {
    position: 'fixed',
    zIndex: '2000',
    top: '64px',
    '& svg': { fontSize: 20, color: 'white' },
    backgroundColor: '#19227c',
    // border: `1px solid ${grey[300]}`,
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
      // border: `1px solid ${grey[50]}`,
      '& svg': {
        color: '#19227c',
      },
    },
  },

  fabExpand: {
    width: 50,
    height: 50,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    left: 0,
  },

  fabMinimize: {
    height:'48px',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    left: drawerWidth - 40,
  },
  drawerPlatform: {
    textAlign: 'center',
    padding: '10px 0',
  },
  drawerFooterRoot: {
    marginTop: 'auto',
    textAlign: 'left',
    padding: 20,

    // //height: 100,
    // borderTop: `1px solid ${grey[400]}`,
    '& svg': {
      width: 15,
      // color: grey[600],
      color: '#fff',
    },
    '& .MuiTypography-caption': {
      // color: grey[600],
      color: '#fff',
      fontWeight: 200,
    },
    '& .footer': {
      display: 'block',
    },
    '& a': {
      // color: blue[700],
      color: '#fff',
    },
  },
  dvSubTitle: {
    // color: 'white',
    color: '#333',
    fontWeight: '500',
    fontSize: '18px',
    paddingTop: '6.88px',
    paddingLeft: '20px',
    justifyContent: 'space-between',
  },
  platformTitle: {
    color: '#ddd',
    textAlign: 'left',
    paddingLeft: '20px',
    letterSpacing: '0',
    fontSize: '18px',
    // paddingTop:'10px'
  },
  sectionDesktop: {
    display: 'none',

    [theme.breakpoints.up(1367)]: {
      display: 'flex',
    },
  },
  sectionTablet: {
    display: 'none',

    [theme.breakpoints.up(767)]: {
      display: 'flex',
    },
  },
  sectionTabletOnly: {
    display: 'none',

    [theme.breakpoints.up(767)]: {
      display: 'flex',
    },
    [theme.breakpoints.up(1367)]: {
      display: 'none',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up(1367)]: {
      display: 'none',
    },
  },
  sectionMobileLang: {
    display: 'flex',
    [theme.breakpoints.down(767)]: {
      display: 'none',
    },
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    // padding: theme.spacing(3),
    // paddingRight:'15vw',
    backgroundColor: '#ECEEF6',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: drawerWidth,
    [theme.breakpoints.down(1367)]: {
      marginLeft: 50,
      // paddingRight:theme.spacing(3)
    },
    [theme.breakpoints.down(767)]: {
      marginLeft: 0,
      // paddingRight:theme.spacing(3),
    },
    height:'auto',
    minHeight: '100vh'
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 50,
    // marginLeft: drawerWidth,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },
  contentShiftTablet: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 292,
    // marginLeft: drawerWidth,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },
  
  XsDown: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  // iconDashboard: {
  //   color: '#fff',
  // }
  iconDashboard: {
    color: '#ccc',
    width: '12px',
    paddingLeft: '20px',
  },
  
  iconOnlyDashboard: {
    color: '#ccc',
    width: '12px',
    paddingLeft: '12px',
  },
  iconSideMenuBox: {
    paddingTop: '114px'
  },
  accountName: {
    color: '#333',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 10px',
  },
  search: {
    position: 'relative',
    left:'40px',
    borderRadius: theme.shape.borderRadius,
    // backgroundColor: alpha(theme.palette.common.white, 0.15),
    // '&:hover': {
    //   backgroundColor: alpha(theme.palette.common.white, 0.25),
    // },
    border: '1px solid #ddd',
    '&:hover': {
      backgroundColor: '#eee',
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color:'#ddd'
  },
  inputRoot: {
    color: '#333',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}

export default dashboardMenuStyles
