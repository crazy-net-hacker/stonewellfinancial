import React, { useState, useEffect, forwardRef, useRef, useContext } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { MdMenu } from 'react-icons/md'
// import CustomButton from '../../../components/common/CustomButtons/Button'
import {
  Drawer,
  AppBar,
  List,
  ListItem,
  Collapse,
  Button,
  IconButton,
  Divider,
  Box,
  Toolbar,
  Fab,
  Typography,
  //Menu,
  MenuItem,
  ListItemIcon,
} from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
//icon
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined'
// import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

import {
  ChevronLeftRounded,
  ChevronRightRounded,
  Copyright,
  AccountCircle,
  ExpandLess,
  ExpandMore,
} from '@material-ui/icons'
import CssBaseline from '@material-ui/core/CssBaseline'
import { userLogout } from '../../../redux/actions/userAction'
import { Email, Token, Username, UserRole } from '../constants'
import { ClearTheLocalStore, GetFromLocalStore } from '../utils'
// Components
// import LanguageSelectorDashboard from '../../../components/common/LanguageSelectorDashboard'
import LanguageSelector from '../../../components/common/LanguageSelector'
import { Text, LanguageContext } from '../../../components/common/LanguageProvider'
import logo from '../../../assets/imgs/logo-transparent.png'
import SWLogo from '../../../assets/imgs/stonewell_logo.png'
import dashboardMenuStyles from '../../../assets/jss/styles/dashboardNavMenuStyle'

import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuList from '@material-ui/core/MenuList'

//icon
// import SearchIcon from '@material-ui/icons/Search';
// import InputBase from '@material-ui/core/InputBase';
import Tooltip from '@material-ui/core/Tooltip';
//icons
import PostAddOutlinedIcon from '@material-ui/icons/PostAddOutlined';
import Katalk from '../../../assets/imgs/icons/katalk.svg'
// import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
// import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import FindInPageOutlinedIcon from '@material-ui/icons/FindInPageOutlined';
import InsertChartOutlinedOutlinedIcon from '@material-ui/icons/InsertChartOutlinedOutlined';
import SystemUpdateAltOutlinedIcon from '@material-ui/icons/SystemUpdateAltOutlined';
// import AccessAlarmsOutlinedIcon from '@material-ui/icons/AccessAlarmsOutlined';
import FlightIcon from '@mui/icons-material/Flight';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import BusinessIcon from '@mui/icons-material/Business';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ArticleIcon from '@mui/icons-material/Article';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';

const useStyles = makeStyles(dashboardMenuStyles)
const clientMenuItems = [
  {
    name: 'Dashboard.Dashboard',
    url: '/myportal/dashboard',
    icon: <DashboardOutlinedIcon />,
  },
  {
    name: 'Dashboard.StartNewApplication',
    url: '/myportal/travel/quote/trip-info',
    icon: <PostAddOutlinedIcon />,
  },
  {
    name: 'Dashboard.MyInsurance',
    url: '/myportal/insurance',
    icon: <HealthAndSafetyIcon />,
    children: [
      {
        name: 'Dashboard.TravelInsurance',
        url: '/myportal/insurance/travel',
      },
      {
        name: 'Dashboard.LifeInsurance',
        url: '/myportal/insurance/life',
      },
      {
        name: 'Dashboard.HealthInsurance',
        url: '/myportal/insurance/health',
      },
      {
        name: 'Dashboard.GroupBenefit',
        url: '/myportal/insurance/group-benefit',
      },
    ],
  },
  {
    name: 'Dashboard.MyQuote',
    url: '#',
    icon: <ArticleIcon/>
  },
]
const adminMenuItems = [
  {
    name: 'Dashboard.Dashboard',
    url: '/myportal/dashboard',
    icon: <DashboardOutlinedIcon />,
  },
  {
    name: 'Dashboard.TravelInsurance',
    url: '/travel-insurance',
    icon: <FlightIcon />,
    children: [
      {
        name: 'Dashboard.StartNewApplication',
        url: '/myportal/admin/new-application',
      },    
      {
        name: 'Dashboard.Application',
        url: '/myportal/admin/travel-application',
      },
      {
        name: 'Dashboard.Refund',
        url: '/myportal/admin/refund',
      },
      {
        name: 'Dashboard.CreditCard',
        url: '/myportal/admin/credit-card',
      },
      {
        name: 'Dashboard.Reports',
        url: '/myportal/admin/sales-report',
      },
    ],
  },
  {
    name: 'Dashboard.LifeInsurance',
    url: '/life-insurance',
    icon: <FavoriteIcon />,
    children: [
      // {
      //   name: 'New Quote',
      //   url: '/life-insurance/quote',
      // },
      {
        name: 'Dashboard.Quote',
        url: '/myportal/admin/life-quote',
      },
    ],
  },
  {
    name: 'Dashboard.HealthInsurance',
    url: '/health-insurance',
    icon: <HealthAndSafetyIcon />,
    children: [
      // {
      //   name: 'New Quote',
      //   url: '/health-insurance/quote',
      // },
      {
        name: 'Dashboard.Quote',
        url: '/myportal/admin/health-quote',
      },
    ],
  },
  {
    name: 'Dashboard.GroupBenefit',
    url: '/group-benefit',
    icon: <BusinessIcon />,
    children: [
      {
        name: 'Dashboard.Quote',
        url: '/myportal/admin/group-quote',
      },
    ],
  },
  {
    name: 'Dashboard.UserRegistration',
    url: '#',
    icon: <HowToRegIcon />,
    children: [
      {
        name: 'Dashboard.VendorAccount',
        url: '/myportal/admin/vendor-register',
      },
      {
        name: 'Dashboard.UserAccount',
        url: '/myportal/admin/user-account',
      },
    ],
  },
  {
    name: 'Resources',
    // url: '/health-insurance',
    icon: <AutoAwesomeMotionIcon />,
    children: [
      {
        name: 'Quote.MedicalQuestionnaire.Check',
        url: '/myportal/admin/medical-questionnaire',
      },
      {
        name: 'Insurance Plan Rate',
        url: '/myportal/admin/insurance-plan-rate',
      },
      {
        name: 'Chatbot',
        url: '/myportal/admin/chatbot',
      },
    ],
  },
]
const vendorMenuItems = [
  {
    name: 'Dashboard.Dashboard',
    url: '/myportal/dashboard',
    icon: <DashboardOutlinedIcon />,
  },
  {
    name: 'Dashboard.Account',
    url: '/myportal/vendor/account',
    icon: <PostAddOutlinedIcon />,
  },
  {
    name: 'Dashboard.StartNewApplication',
    url: '/myportal/vendor/new-application',
    icon: <PostAddOutlinedIcon />,
  },
  {
    name: 'Dashboard.SearchApplications',
    url: '/myportal/vendor/search-application',
    icon: <FindInPageOutlinedIcon />
  },
  // {
  //   name: 'My Applications',
  //   url: '#',
  //   icon: <InsertDriveFileOutlinedIcon />,
  //   children: [
  //     {
  //       name: 'Start a new Application',
  //       url: '/myportal/vendor/new-application',
  //       icon: <PostAddOutlinedIcon />,
  //     },
  //     {
  //       name: 'Saved Applications',
  //       url: '/myportal/vendor/saved-application',
  //       icon: <BookmarkBorderOutlinedIcon />,
  //     },
  //     {
  //       name: 'Renewal Applications',
  //       url: '/myportal/vendor/renewal-application',
  //       icon: <AccessAlarmsOutlinedIcon />
  //     },
  //     {
  //       name: 'Search Applications',
  //       url: '/myportal/vendor/search-application',
  //       icon: <FindInPageOutlinedIcon />
  //     },
  //   ],
  // },
  {
    name: 'Dashboard.Refund',
    url: '/myportal/vendor/search-requested-refund/',
    icon: <FindInPageOutlinedIcon />,
  },
  {
    name: 'Dashboard.Reports',
    url: '/myportal/vendor/reports',
    icon: <InsertChartOutlinedOutlinedIcon />,
  },
  {
    name: 'Dashboard.DownloadResources',
    url: '/myportal/vendor/download',
    icon: <SystemUpdateAltOutlinedIcon />,
  },
]
// const icon = [

// ]

const Dashboard = ({ children, vendorName, vendorRole }, props) => {

  const classes = useStyles()
  const dispatch = useDispatch()
  let history = useHistory()

  //current language
  const currentLanguage = useContext(LanguageContext).userLanguage


  const [openLeftNav, setLeftNavOpen] = React.useState(true)
  const [openLeftIconNav, setLeftIconNavOpen] = React.useState(true)
  const [roleMenuItems, setRoleMenuItems] = React.useState([])

  // Mobile left drawer menu
  const [left, setLeft] = useState(false)

  // navigation menu
  const [menu, setMenu] = useState({})
  const [leftMenu, setLeftMenu] = useState({})
  const { className, ...rest } = props

  //// toggle menu list (my account, logout) start ->
  const [anchorElOpen, setAnchorElOpen] = React.useState(false)
  const anchorRef = useRef(null)

  // const [anchorEl, setAnchorEl] = React.useState(null);
  // const open = Boolean(anchorEl);

  const handleToggle = () => {
    setAnchorElOpen((prevOpen) => !prevOpen)
  }

  const handleToggleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }
    setAnchorElOpen(false)
  }

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setAnchorElOpen(false)
    }
  }

  const handleLogout = () => {
    ClearTheLocalStore()
    history.push('/')
    dispatch(userLogout())
  }

  // const handleMyAccount = () => {
  //   history.push('/myportal/account')
  // }
  
  //responsive design
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
    
  let isMobile = (width < 769);

  // return focus to the button when we transitioned from !anchorElOpen -> anchorElOpen
  const prevOpen = useRef(anchorElOpen)
  useEffect(() => {
    if (prevOpen.current === true && anchorElOpen === false) {
      anchorRef.current.focus()
    }

    prevOpen.current = anchorElOpen
  }, [anchorElOpen])

  ///// toggle menu list (my account, logout) <- end

  // console.log('DASHBOARD PAGE')
  useEffect(() => {

    if (!GetFromLocalStore(Token) || GetFromLocalStore(Token) === '') {
      history.push('/signin')
    }

    // user do not have any authority 
    if (GetFromLocalStore(UserRole) === 'VEN' && !vendorName) {
      // handleLogout()
      ClearTheLocalStore()
      dispatch(userLogout())
      history.push('/signin')
    }

    switch (GetFromLocalStore(UserRole)) {
      case 'VEN':
        setRoleMenuItems(vendorRole==='A'?vendorMenuItems:vendorMenuItems.filter(f=>f.url !== '/myportal/vendor/account'))
        break
      case 'ADM':
        setRoleMenuItems(adminMenuItems)
        break
      default:
        setRoleMenuItems(clientMenuItems)
        break
    }

  }, [history, vendorName, vendorRole, dispatch]) //userInfo


  //sidebar Menu
  const sideBarHandleClick = (item) => {
    let newData = { ...menu, [item]: !menu[item] }
    setMenu(newData)
  }
  const handleLeftDrawer = () => {
    setLeftNavOpen(!openLeftNav)
  }

  const handleLeftIconDrawer = () => {
    setLeftIconNavOpen(!openLeftIconNav)
  }

  // const handleMenu = (event) => {
  //   setAnchorElOpen(event.currentTarget)
  // }
  // const handleClose = () => {
  //   setAnchorElOpen(null)
  // }
  const leftNavHandleClick = (item) => {
    let newData = { ...leftMenu, [item]: !leftMenu[item] }
    setLeftMenu(newData)
  }

  const CustomRouterLink = forwardRef((props, ref) => <Link {...props} />)
  const CustomRouterLinkLeftNav = forwardRef((props, ref) => (
    <Link {...props} />
  ))



  // sideBarMenu
  const roleMenu = (children, level = 0) => {
    return children.map(({ children, name, url, icon }) => {
      if (!children) {
        return (
          <List key={name}>
            <ListItem
              className={classes.item}
              style={{ padding: '0px' }}
              key={name}
              // //onClick={() => setLeft(!left)}
            >
              {/* <ListItemIcon className={classes.iconDashboard}>
                {icon}
              </ListItemIcon> */}
              <Button
                className={clsx({
                  [classes.sideBarBtnRoot]: true,
                })}
                component={CustomRouterLink}
                to={url}
              >
                <ListItemIcon className={classes.iconDashboard}>
                {icon}
                </ListItemIcon>
                <Text tid={name} />
              </Button>
            </ListItem>
          </List>
        )
      }
      return (
        <div key={name}>
          <ListItem
            className={classes.sideBarItem}
            disableGutters
            key={name}
            onClick={() => sideBarHandleClick(name)}
          >
            {/* <ListItemIcon className={classes.iconDashboard}>
              {icon}
            </ListItemIcon> */}
            <Button
              // style={{ justifyContent: 'space-between' }}
              className={clsx({
                [classes.sideBarBtnRoot]: true,
                // [classes.sideBarButton]: true,
                // [classes.sideBarSubMenu]: level,
              })}
              style={{ justifyContent: 'left', width: '100%' }}
            >
              <ListItemIcon className={classes.iconDashboard}>{icon}</ListItemIcon>
              {<Text tid={name} />}
              <ListItemIcon>
                  {menu[name] ? <ExpandLess /> : <ExpandMore/>}
              </ListItemIcon>
            </Button>
          </ListItem>
          <Collapse
            className={classes.navLeft_expand}
            in={menu[name] ? false : true}
            timeout="auto"
            unmountOnExit
          >
            {roleMenu(children, 1)}
          </Collapse>
        </div>
      )
    })
  }

  //leftMenuDrawer
  const roleMenuLeft = (children, level = 0) => {
    return children.map(({ children, name, url, links, icon }) => {
      if (!children) {
        return (
          <List key={name}>
            <ListItem
              className={classes.item}
              style={{ padding: '0px' }}
              key={name}
              // onClick={() => setLeft(!left)}
            >
              {/* <ListItemIcon className={classes.iconDashboard}>
                {icon}
              </ListItemIcon> */}
              <Button
                className={clsx({
                  [classes.sideBarBtnRoot]: true,
                })}
                component={CustomRouterLinkLeftNav}
                to={url}
              >
                <ListItemIcon className={classes.iconDashboard}>{icon}</ListItemIcon>
                <Text tid={name} />
              </Button>
            </ListItem>
          </List>
        )
      }
      return (
        <div key={name}>
          <ListItem
            className={classes.sideBarItem}
            disableGutters
            key={name}
            onClick={() => leftNavHandleClick(name)}
          >
            {/* <ListItemIcon className={classes.iconDashboard}>
              {icon}
            </ListItemIcon> */}
            <Button
              // style={{ justifyContent: 'space-between' }}
              className={clsx({
                [classes.sideBarBtnRoot]: true,
                // [classes.sideBarButton]: true,
                // [classes.sideBarSubMenu]: level,
              })}
            >
              <ListItemIcon className={classes.iconDashboard}>{icon}</ListItemIcon>
              {<Text tid={name} />}
              {leftMenu[name] ? <ExpandLess /> : <ExpandMore />}
            </Button>
          </ListItem>
          <Collapse
            className={classes.navLeft_expand}
            in={leftMenu[name] ? false : true}
            timeout="auto"
            unmountOnExit
          >
            {roleMenuLeft(children, 1)}
          </Collapse>
        </div>
      )
    })
  }

  //leftMenu Icon Drawer
  const roleMenuIconLeft = (children, level = 0) => {
    return children.map(({ children, name, url, links, icon}) => {
      if (!children) {
        return (
          <List key={name}>
            <Tooltip title={name} placement="right-end" enterTouchDelay={0}>
            <ListItem
              className={classes.item}
              style={{ padding: '0px' }}
              key={name}
              // onClick={() => setLeft(!left)}
            >
              {/* <ListItemIcon className={classes.iconDashboard}>
                {icon}
              </ListItemIcon> */}
                <Button
                  className={clsx({
                    [classes.sideBarBtnRoot]: true,
                  })}
                  component={CustomRouterLinkLeftNav}
                  to={url}
                >
                  <ListItemIcon className={classes.iconOnlyDashboard}>{icon}</ListItemIcon>
                  {/* <Text tid={name} /> */}
                </Button>
            </ListItem>
            </Tooltip>
          </List>
        )
      }
      return (
        <List key={name}>
          <Tooltip title={name} placement="right-end" enterTouchDelay={0}>
          <ListItem
            className={classes.item}
            disableGutters
           
            key={name}
            onClick={() => leftNavHandleClick(name)}
          >
            {/* <ListItemIcon className={classes.iconDashboard}>
              {icon}
            </ListItemIcon> */}
            <Button
              // style={{ justifyContent: 'space-between' }}
              className={clsx({
                [classes.sideBarBtnRoot]: true,
                // [classes.sideBarButton]: true,
                // [classes.sideBarSubMenu]: level,
              })}
            >
              <ListItemIcon className={classes.iconOnlyDashboard}>{icon}</ListItemIcon>
              {/* {<Text tid={name} />} */}
              {/* {leftMenu[name] ? <ExpandLess /> : <ExpandMore />} */}
            </Button>
          </ListItem>
          </Tooltip>
         
          <Collapse
            className={classes.navLeft_expand}
            in={leftMenu[name] ? false : true}
            timeout="auto"
            unmountOnExit
          >
            
            {roleMenuIconLeft(children, 1)}
          </Collapse>
         
        </List>
      )
    })
  }


  return (
    <>
      <CssBaseline />

      <AppBar
        className={classes.appBar}
        // elevation={1}
        //position={isSticky ? 'fixed' : 'static'}
        position="fixed"
      >
        <Toolbar style={{ padding: '0' }}>
          {/* <Container> */}
          <Grid container direction="row" alignItems="center">
            <Box className={classes.XsDown}>
              <Link to={'/'}>
                <img
                  alt={'logo'}
                  src={SWLogo}
                  className={classes.navMainLogo}
                  height="60"
                />
              </Link>
            </Box>

            <Typography variant="h4" noWrap className={classes.dvSubTitle}>
              {/*subTitle ? subTitle : null || 'Dashboard'*/}
              {/* {GetFromLocalStore(UserRole) === 'VEN' ? vendorName : null} */}
              {GetFromLocalStore(UserRole) === 'VEN' ? 'Partner' : null}
              {GetFromLocalStore(UserRole) === 'ADM' ? 'Admin' : null}
              {GetFromLocalStore(UserRole) !== 'VEN' && GetFromLocalStore(UserRole) !== 'ADM' ? 'Client' : null}
              {/* Katalk chat icon if lang is Korean */}
              {currentLanguage === 'ko' && GetFromLocalStore(UserRole) === 'VEN' && isMobile ?
                <div style={{ position:'fixed', top:'10px', left:'110px', width:'40px'}}>
                  <a href="https://open.kakao.com/o/sNULFoTe" target='blank'>
                    <img
                      src={Katalk}
                      alt="Katalk-Icon"
                      style={{ width:'100%' }}
                    /> 
                  </a>         
                </div>
              :null}
            </Typography>

            {/* Search Bar */}
            {/* <Box className={classes.sectionDesktop}>
                <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ 'aria-label': 'search' }}
                />
              </div>
            </Box> */}

            <Box style={{ flexGrow: 1 }} />
            <Box
              style={{ margin: '0 20px' }}
              className={classes.sectionDesktop}
            >
              <div className={classes.langSelector}>
              <LanguageSelector />
              </div>
            </Box>
            <Box className={classes.sectionDesktop}>
              <Box>
                {/* <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    // color="inherit"
                    edge="start"
                  >
                    <AccountCircle />
                    <span className={classes.accountName}>{GetFromLocalStore(Username)}</span>
                  </IconButton> */}
                {/* <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    open={anchorElOpen}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu> */}

                <div>
                  <Button
                    ref={anchorRef}
                    aria-controls={anchorElOpen ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                  >
                    <AccountCircle />
                    <span className={classes.accountName}>
                      {GetFromLocalStore(Username)}
                    </span>
                  </Button>
                  <Popper
                    open={anchorElOpen}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                  >
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        style={{
                          transformOrigin:
                            placement === 'bottom'
                              ? 'center top'
                              : 'center bottom',
                        }}
                      >
                        <Paper>
                          <ClickAwayListener onClickAway={handleToggleClose}>
                            <MenuList
                              autoFocusItem={anchorElOpen}
                              id="menu-list-grow"
                              onKeyDown={handleListKeyDown}
                            >
                              {/* <MenuItem onClick={handleMyAccount}>
                                My account
                              </MenuItem> */}
                              <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </div>
              </Box>
              {/* <Box>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  // color="inherit"
                  edge="start"
                >
                  <AccountCircle />
                  <span className={classes.accountName}>
                    {GetFromLocalStore(Username)}
                  </span>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  //   anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  //  open={anchorEl}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Box> */}
            </Box>
            <Box>
              <div className={classes.navMobile2}>
                <IconButton onClick={() => setLeft(true)}>
                  <MdMenu />
                </IconButton>
              </div>
              <div className={classes.navMobile}>
                <LanguageSelector />
              </div>
            </Box>
          </Grid>
          {/* </Container> */}

          {/* Mobile View Drawer */}
          <Drawer open={left} onClose={() => setLeft(false)}>
            <div className={classes.list}>
              <List>
                <ListItem
                  style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}
                >
                  <img
                    alt={'Mobile logo'}
                    src={logo}
                    height="40"
                    style={{ margin: ' 0 auto' }}
                  />
                </ListItem>
                <Divider />
                <List {...rest} className={clsx(className)} style={{background:'#2a2f71'}}>
                  {roleMenu(roleMenuItems)}
                </List>
              </List>
            </div>
          </Drawer>
        </Toolbar>
      </AppBar>



      {/* Icon Drawer Left Menu */}
      <Box open={left}>
        <Box className={classes.sectionDesktop}>
                <Drawer
                  className={clsx(classes.drawer, {
                    [classes.IconDrawerOpen]: !openLeftNav,
                    [classes.IconDrawerClose]: openLeftNav,
                  })}
                  classes={{
                    paper: clsx({
                      [classes.IconDrawerOpen]: !openLeftNav,
                      [classes.IconDrawerClose]: openLeftNav,
                    }),
                  }}
                  variant="permanent"
                >
                  <List  className={classes.iconSideMenuBox}>{roleMenuIconLeft(roleMenuItems)}</List>
                </Drawer>
        </Box>
      </Box>

      {/* Left Main Menu */}
      <Box open={left}>
        <Box className={classes.sectionDesktop}>
          <Drawer
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: openLeftNav,
              [classes.drawerClose]: !openLeftNav,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: openLeftNav,
                [classes.drawerClose]: !openLeftNav,
              }),
            }}
            variant="permanent"
          >
            <Toolbar />
            <Fab
              className={clsx(classes.fabAction, {
                [classes.fabMinimize]: openLeftNav,
                [classes.fabExpand]: !openLeftNav,
              })}
              size="small"
              onClick={handleLeftDrawer}
              // elevation={3}
            >
              {!openLeftNav ? <ChevronRightRounded /> : <ChevronLeftRounded />}
            </Fab>

            {/* <Box className={classes.drawerPlatform}>
              <Typography variant="h4" className={classes.platformTitle}>
                {' '}
                <Text tid={'Dashboard.PartnerPlatform'} />
              </Typography>
            </Box> */}
            {/* <Divider /> */}
            <Box className={classes.drawerPlatform}>
              {/* <img src={SWLogo} alt="Logo" height="60" /> */}
              <Typography variant="h6" className={classes.platformTitle}>
                {vendorName || GetFromLocalStore(Email)}
              </Typography>
            </Box>
            <Divider />
            <List>{roleMenuLeft(roleMenuItems)}</List>

            
              {/* Footer Left Nav */}
              <Box className={classes.drawerFooterRoot}>
                <Box className="footer">
                  <Typography variant="caption">
                    <Text tid={'Dashboard.Question'} />
                  </Typography>
                </Box>
                <Box className="footer">
                  <Typography variant="caption">
                    <Link
                      to="info@stonewellfinancial.com"
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.preventDefault()}
                    >
                      info@stonewellfinancial.com
                    </Link>
                  </Typography>
                </Box>
                <Box className="footer">
                  <Typography variant="caption"> 1-833-645-3858 </Typography>
                </Box>
                {/* <Box>
                  <CustomButton color="primary" size="sm">
                    <Text tid={'Dashboard.Communicate'} />
                  </CustomButton>
                </Box> */}
                {/* <Box>
                  <Copyright />
                  <Typography variant="caption">
                    {' '}
                    2022 Stonewell Financial Service Inc.
                  </Typography>
                </Box>  */}
              </Box>
         

          </Drawer>
        </Box>
      </Box>

{/* Table Left Side Menu */}

    {/* Icon Drawer Left Menu */}
    <Box open={left}>
            <Box className={classes.sectionTabletOnly}>
                    <Drawer
                      className={clsx(classes.drawer, {
                        [classes.IconDrawerOpen]: openLeftIconNav,
                        [classes.IconDrawerClose]: !openLeftIconNav,
                      })}
                      classes={{
                        paper: clsx({
                          [classes.IconDrawerOpen]: openLeftIconNav,
                          [classes.IconDrawerClose]: !openLeftIconNav,
                        }),
                      }}
                      variant="permanent"
                    >
                      <List  className={classes.iconSideMenuBox}>{roleMenuIconLeft(roleMenuItems)}</List>

                    </Drawer>
            </Box>
    </Box>

    {/* Left Main Menu */}
          <Box open={left}>
            <Box className={classes.sectionTabletOnly}>
                  <Drawer
                      className={clsx(classes.drawer, {
                        [classes.drawerOpen]: !openLeftIconNav,
                        [classes.drawerClose]: openLeftIconNav,
                      })}
                      classes={{
                        paper: clsx({
                          [classes.drawerOpen]: !openLeftIconNav,
                          [classes.drawerClose]: openLeftIconNav,
                        }),
                      }}
                      variant="permanent"
                    >
                <Toolbar />
                <Fab
                  className={clsx(classes.fabAction, {
                    [classes.fabMinimize]: !openLeftIconNav,
                    [classes.fabExpand]: openLeftIconNav,
                  })}
                  size="small"
                  onClick={handleLeftIconDrawer}
                  // elevation={3}
                >
                  {!openLeftIconNav ? <ChevronRightRounded /> : <ChevronLeftRounded />}
                </Fab>

                {/* <Box className={classes.drawerPlatform}>
                  <Typography variant="h4" className={classes.platformTitle}>
                    {' '}
                    <Text tid={'Dashboard.PartnerPlatform'} />
                  </Typography>
                </Box> */}
                {/* <Divider /> */}
                <Box className={classes.drawerPlatform}>
                  {/* <img src={SWLogo} alt="Logo" height="60" /> */}
                  <Typography variant="h6" className={classes.platformTitle}>
                    {vendorName || GetFromLocalStore(Email)}
                    {/*' Stonewell Financial Service Inc.' */}
                  </Typography>
                </Box>
                <Divider />
                <List>{roleMenuLeft(roleMenuItems)}</List>

                {/* Footer Left Nav */}
                <Box className={classes.drawerFooterRoot}>
                  <Box className="footer">
                    <Typography variant="caption">
                      <Text tid={'Dashboard.Question'} />
                    </Typography>
                  </Box>
                  <Box className="footer">
                    <Typography variant="caption">
                      <Link
                        to="info@stonewellfinancial.com"
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.preventDefault()}
                      >
                        info@stonewellfinancial.com
                      </Link>
                    </Typography>
                  </Box>
                  <Box className="footer">
                    <Typography variant="caption"> 1-833-645-3858 </Typography>
                  </Box>
                  {/* <Box>
                    <CustomButton color="primary" size="sm">
                      <Text tid={'Dashboard.Communicate'} />
                    </CustomButton>
                  </Box> */}
                  <Box>
                    <Copyright />
                    <Typography variant="caption">
                      {' '}
                      2021 Stonewell Financial Service Inc.
                    </Typography>
                  </Box>
                </Box>
              </Drawer>
            </Box>
          </Box>


      <main
        className={clsx(classes.content, {
          [classes.contentShift]: !openLeftNav,
          [classes.contentShiftTablet]: !openLeftIconNav,
        })}
      >
        <div className={classes.drawerHeader} />
        {children}
        {/* Katalk chat icon if lang is Korean */}
        {currentLanguage === 'ko' && GetFromLocalStore(UserRole) === 'VEN' && !isMobile ?
          <div style={{ position:'fixed', bottom:'70px', right:'18px' }}>
            <a href="https://open.kakao.com/o/sNULFoTe" target='blank'>
              <img
                src={Katalk}
                alt="Katalk-Icon"
              /> 
            </a>         
          </div>
        :null}
      </main>
    </>
  )
}

Dashboard.propTypes = {
  // subTitle: PropTypes.string,
  children: PropTypes.any,
}

export default Dashboard
