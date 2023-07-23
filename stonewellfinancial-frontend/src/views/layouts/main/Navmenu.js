import React, { useState, forwardRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
// import { Link, useLocation } from 'react-router-dom'
import { MdMenu } from 'react-icons/md'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import {
  Container,
  AppBar,
  List,
  ListItem,
  Divider,
  Collapse,
  // Button,
} from '@material-ui/core'
import clsx from 'clsx'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import LanguageSelector from '../../../components/common/LanguageSelector'
import { Text } from '../../../components/common/LanguageProvider'
import Grid from '@material-ui/core/Grid'

// import { userLogout } from '../../../redux/actions/userAction'
import {  IsLoggedIn } from '../utils'
import Button from '../../../components/common/CustomButtons/Button'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'

//styles
import navMenuStyle from '../../../assets/jss/styles/navMenuStyle'
//logo
import logo from '../../../assets/imgs/logo-transparent.png' // relative path to image

const useStyles = makeStyles(navMenuStyle)

// navigation menu
const topMenuItems = [
  {
    name: 'Student Insurance',
    url: '/travel-insurance/student',
  },
  {
    name: 'Visitor Insurance',
    url: '/travel-insurance/visitor',
  },
  {
    name: 'Travel Insurance',
    url: '/travel-insurance',
    children: [
      // {
      //   name: 'International Students',
      //   url: '/travel-insurance/student',
      // },
      // {
      //   name: 'Visitor to Cananda',
      //   url: '/travel-insurance/visitor',
      // },
      {
        name: 'Travelling Canadians',
        url: '/travel-insurance/canadian-traveller',
      },
      {
        name: 'Claim help',
        url: '/travel-insurance/claim',
      },
      
    ],
  },
  {
    name: 'Life Insurance',
    url: '/life-insurance',
  },
  {
    name: 'Health Insurance',
    url: '/health-insurance',
  },
  {
    name: 'Group Benefits',
    url: '/group-benefits',
  },
]

const sideMenuItems = [
  {
    name: 'Student Insurance',
    url: '/travel-insurance/student',
  },
  {
    name: 'Visitor Insurance',
    url: '/travel-insurance/visitor',
  },
  {
    name: 'Travel Insurance',
    url: '/travel-insurance',
    children: [
      // {
      //   name: 'International Students',
      //   url: '/travel-insurance/student',
      // },
      // {
      //   name: 'Visitor to Cananda',
      //   url: '/travel-insurance/visitor',
      // },
      {
        name: 'Travelling Canadians',
        url: '/travel-insurance/canadian-traveller',
      },
      {
        name: 'Claim help',
        url: '/travel-insurance/claim',
      },
    ],
  },
  {
    name: 'Life Insurance',
    url: '/life-insurance',
  },
  {
    name: 'Health Insurance',
    url: '/health-insurance',
  },
  {
    name: 'Group Benefits',
    url: '/group-benefits',
  },
  // {
  //   name: 'Porcess',
  //   children: [
  //     {
  //       name: 'Applicaion',
  //       url: '/insurance/application',
  //     },
  //     {
  //       name: 'Claim',
  //       url: '/insurance/claim',
  //     },
  //     {
  //       name: 'Refund',
  //       url: '/insurance/refund',
  //     },
  //   ],
  // },
  // {
  //   name: 'Resources',
  //   children: [
  //     {      
  //       name: 'Download forms',
  //       url: '/insurance/download',
  //     },
  //     {
  //       name: 'FAQ',
  //       url: '/insurance/faq',
  //     },
  //     {
  //       name: 'Clinic Finder',
  //       url: '/insurance/clinic-finder',
  //     },
  //   ],
  // },
  // {
  //   name: 'About Us',
  //   url: '/about-us',
  // },
  // {
  //   name: 'Blog',
  //   url: '/blog',
  // },
  // {
  //   name: 'SignIn',
  //   url: '/signin',
  // },
  // {
  //   name: 'SignUp',
  //   url: '/signup',
  // },
]

export default function Navbar({ isAuthorized, setIsAuthorized }, props, dispatch) {
  // Login Register Api starts
  // const location = useLocation()
  // const hadleSignOut = async () => {
  //   await fetch('/api/accounts/signout', {
  //     method: 'POST',
  //     headers: { 'content-type': 'application/json' },
  //     body: JSON.stringify({
  //       refreshToken: localStorage.getItem('refreshToken'),
  //     }),
  //   })
  //     .then((res) => {
  //       localStorage.removeItem('refreshToken')
  //       setIsAuthorized(false)
  //     })
  //     .catch((err) => console.log(err))
  // }
  // Login Register Api end

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

  let isMobile = (width <= 1024);

  // Fixed navbar when scroll down
  const [isSticky, setSticky] = useState(false)
  const handleScroll = () => {
    if (window.scrollY <= 40) {
      setSticky(false)
    } else {
      setSticky(true)
    }
  }

  // Mobile left drawer menu
  const [left, setLeft] = useState(false)

  // navigation menu
  const [menu, setMenu] = useState({})
  const { className, ...rest } = props

  //sidebar Menub
  const sideBarHandleClick = (item) => {
    let newData = { ...menu, [item]: !menu[item] }
    setMenu(newData)
  }

  const CustomRouterLink = forwardRef((props, ref) => <Link {...props} />)

  // const handleSignOut = () => {
  //   dispatch(userLogout())
  //   ClearTheLocalStore()
  // }



  // sideBarMenu
  const sideBarMenu = (children, level = 0) => {
    return children.map(({ children, name, url, links }) => {
      if (!children) {
        return (
          <List key={name} style={{ padding: 0 }}>
            <ListItem
              className={classes.item}
              style={{ padding: '4px 16px', borderBottom:'1px solid #ddd' }}
              key={name}
              onClick={() => setLeft(!left)}
            >
              <Button
                className={clsx({
                  [classes.sideBarBtnRoot]: true,
                })}
                component={CustomRouterLink}
                to={url}
              >
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
            style={{ padding: '4px 16px', borderBottom:'1px solid #ddd' }}
          >
            <Button
              style={{ width:'100%', justifyContent:'left' }}
              className={clsx({
                [classes.sideBarBtnRoot]: true,
                // [classes.sideBarButton]: true,
                // [classes.sideBarSubMenu]: level,
              })}
            >
              {<Text tid={name} />}
              {menu[name] ? <ExpandLess style={{ position:'absolute', top:'11px', right:'0', color:'#8EC641'}} /> : <ExpandMore style={{ position:'absolute', top:'11px', right:'0', color:'#8EC641'}}/>}
            </Button>
          </ListItem>
          <Collapse
            className={classes.navLeft_expand}
            in={menu[name] ? true : false}
            timeout="auto"
            unmountOnExit
          >
            {sideBarMenu(children, 1)}
          </Collapse>
        </div>
      )
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  // window.addEventListener('scroll', handleScroll)

  return (
    <>
      <AppBar
        className={classes.root}
        elevation={0}
        position={isSticky ? 'fixed' : 'static'}
        id='header'
      >
        <Container>
          <Grid container direction="row" alignItems="center">
            <Grid item xs={3} lg={2}>
              <Link to={'/'}>
                <img alt={'logo'} src={logo} className={classes.navMainLogo} />
              </Link>
            </Grid>
            <Grid item xs={9} lg={10}>
              <div className={classes.navMobile}>
                <LanguageSelector />
                <IconButton onClick={() => setLeft(true)}>
                  <MdMenu />
                </IconButton>
              </div>

              <div className={classes.navDesktop}>
                <List className={classes.navList}>
                  {/* {topMenuItems.map((el) =>
                    el.children ? (
                      <ListItem key={el.url} className={classes.navListItem} style={{ paddingLeft: isMobile ? '0' : '16px'}}>
                        <Link to={el.url}>
                          <Text tid={el.name} />
                        </Link>
                        <List className={classes.navSubMenu}>
                          {el.children.map((child) => (
                            <ListItem
                              key={child.url}
                              className={classes.nav_SubMenu_Item}
                            >
                              <Link to={child.url}>
                                <Text tid={child.name} />
                              </Link>
                            </ListItem>
                          ))}
                        </List>
                      </ListItem>
                    ) : (
                      <ListItem key={el.url} className={classes.navListItem} style={{ paddingLeft: isMobile ? '0' : '16px'}}>
                        <Link to={el.url}>
                          <Text tid={el.name} />
                        </Link>
                      </ListItem>
                    )
                  )} */}
                  

                {/* {!IsLoggedIn() ? (
                  <>
                    <Link
                      to={{
                        pathname: '/signin',
                        //state: { background: location },
                      }}
                      className={classes.topNavBtn}
                      style={{ textDecoration: 'none', marginLeft:'2vh' }}
                    >
                      <Button color="dark" size="md" style={{fontWeight:'500'}}>
                      Sign In
                      </Button>
                    </Link>
                    <Link to="/signup" style={{ textDecoration: 'none', display:'block' }}>
                        <span>
                          New to Stonewell? Register Now
                        </span>
                    </Link>
              
                  </>
                ) : null} */}

                {IsLoggedIn() ? (
                  <Link to="/myportal/dashboard" style={{ textDecoration: 'none' }}>
                    <Button color="dark" size="md" style={{fontWeight:'500'}}>
                    <Text tid={`My page`} />
                    </Button>
                  </Link>
                ):null}
                </List>
                
              </div>
            </Grid>

          </Grid>
          </Container>

          <Grid container alignItems="center" justify="center"  style={{ background:'#fafbfd', borderBottom:'1px solid #ddd'}}>
            <Grid item container xs={12} justify="center" >
              {/* <div className={classes.navMobile}>
                <LanguageSelector />
                <IconButton onClick={() => setLeft(true)}>
                  <MdMenu />
                </IconButton>
              </div> */}
              <Grid item container xs={12} lg={10} xl={8} justify='flex-end'>
              <div className={classes.navSubDesktop}>
                <List className={classes.navList} style={{ padding:'0 10px'}}>
                  {topMenuItems.map((el) =>
                    el.children ? (
                      <ListItem key={el.url} className={classes.navListItem} style={{ paddingLeft: isMobile ? '0' : '16px'}}>
                        <Link to={el.url}>
                          <Text tid={el.name} />
                        </Link>
                        <List className={classes.navSubMenu}>
                          {el.children.map((child) => (
                            <ListItem
                              key={child.url}
                              className={classes.nav_SubMenu_Item}
                            >
                              <Link to={child.url}>
                                <Text tid={child.name} />
                              </Link>
                            </ListItem>
                          ))}
                        </List>
                      </ListItem>
                    ) : (
                      <ListItem key={el.url} className={classes.navListItem} style={{ paddingLeft: isMobile ? '0' : '16px'}}>
                        <Link to={el.url}>
                          <Text tid={el.name} />
                        </Link>
                      </ListItem>
                    )
                  )}
                  {/* {width > 1083 &&
                  <LanguageSelector />
                  } */}
                </List>
                
              </div>
              </Grid>
            </Grid>

          </Grid>
        <Drawer open={left} onClose={() => setLeft(false)}>
          <div className={classes.list}>
            <List style={{ padding: 0 }}>
              <ListItem style={{ marginBottom: '0.5rem' }}>
                <img
                  alt={'Mobile logo'}
                  src={logo}
                  height="32"
                  // style={{ margin: ' 0 auto' }}
                />
                <IconButton size='small' disableFocusRipple={true} disableRipple={true} style={{ position:'absolute', top:'13px', right:'15px' }} onClick={() => {
                  setLeft(false)
                }}>
                    <HighlightOffIcon />
                </IconButton>
              </ListItem>
              <Divider />
              <List {...rest} className={clsx(className)} style={{ padding: 0 }}>
                {sideBarMenu(sideMenuItems)}
                {!IsLoggedIn() ? (
                  <>
             
                    <Link
                      to={{
                        pathname: '/signin',
                        //state: { background: location },
                      }}
                      className={classes.topNavBtn}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button color="dark" size="md" style={{fontWeight:'500', width:'100%'}}>
                      Sign In
                      </Button>
                    </Link>
                    {/* <Link to="/signup" style={{ textDecoration: 'none', display:'block' }}>
                        <span>
                          New to Stonewell? Register Now
                        </span>
                    </Link> */}
              
                  </>
                ) : null}

                {IsLoggedIn() ? (
                  <Link to="/myportal/dashboard" style={{ textDecoration: 'none' }}>
                    <Button color="dark" size="md" style={{fontWeight:'500', width:'100%'}}>
                    <Text tid={`My page`} />
                    </Button>
                  </Link>
                ):null}
              </List>
            </List>
          </div>
        </Drawer>
      </AppBar>
    </>
  )
}
