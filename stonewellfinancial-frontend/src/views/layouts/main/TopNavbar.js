import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, Container } from '@material-ui/core'
import LanguageSelector from '../../../components/common/LanguageSelector'
// import Button from '../../../components/common/CustomButtons/Button'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'

import { Text } from '../../../components/common/LanguageProvider'

// import { userLogout } from '../../../redux/actions/userAction'
// import { ClearTheLocalStore } from '../utils'
const useStyles = makeStyles(theme => ({
  topNavBtn: {
    margin: '0 8px',
  },
  topToolbar: {
    justifyContent: 'end',
    minHeight: 30,
    height: 30,
  },
  langBtn: {
    // marginLeft: theme.spacing(2),
    // marginRight: theme.spacing(2),
  },
  topAppBar: {
    backgroundColor: '#fafbfd',
    borderTop:'10px solid #2a2f71',
    borderBottom: '1px solid #eee',
    display: 'none',
    [theme.breakpoints.up('md')]: {
      backgroundColor: '#fafbfd',
      position: 'static',
      display: 'inherit',
    },
  },
  scrollHidden: {
    display: 'none',
  },
}))

const TopNavbar = ({
  //auth: { isAuthenticated },
  setIsAuthorized,
  dispatch,
}) => {
  const classes = useStyles()

   //Responsive Design
  //  const [width, setWidth] = useState(window.innerWidth);
  //  function handleWindowSizeChange() {
  //    setWidth(window.innerWidth);
  //  }
 
  //  useEffect(() => {
  //    window.addEventListener('resize', handleWindowSizeChange);
  //    return () => {
  //        window.removeEventListener('resize', handleWindowSizeChange);
  //    }
  //  }, []);

  // const handleSignOut = () => {
  //   dispatch(userLogout())
  //   ClearTheLocalStore()
  // }

  // const [anchorEl, setAnchorEl] = React.useState(null);
  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  return (
    <>
      <AppBar className={classes.topAppBar} elevation={0}>
        <Container>
          <Toolbar className={classes.topToolbar} style={{ padding:'0' }}>
            <div>
              <Link
                to="/contact-us"
                //onClick={handleSignOut}
                style={{ color: '#333', fontSize:'12px', lineHeight:30, margin:'0 1vh'}}
              >
                <Text tid={`Email us`} /> : <span style={{fontWeight:'600'}}>info@stonewellfinancial.com</span>
              </Link>
              <Link
                to="/contact-us"
                //onClick={handleSignOut}
                style={{ color: '#333', fontSize:'12px', lineHeight:30, margin:'0 1vh'}}
              >
                <Text tid={`Call us today`} /> : <span style={{fontWeight:'600'}}>1-833-645-3858</span>
              </Link>
            </div>
            {/* {width < 1084 && */}
                  <LanguageSelector />
            {/* }             */}
            {/* <div style={{ display: 'flex' }}>
              <LanguageSelector />

              <div>
                {!IsLoggedIn() ? (
                  <Link
                    to={{
                      pathname: '/signin',
                      //state: { background: location },
                    }}
                    className={classes.topNavBtn}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button color="primary" size="sm">
                      Sign In
                    </Button>
                  </Link>
                ) : (
                  <Link
                    to="/"
                    onClick={handleSignOut}
                    className={classes.topNavBtn}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button color="primary" size="sm">
                      Sign Out
                    </Button>
                  </Link>
                )}
                {!IsLoggedIn() ? (
                  <Link to="/signup" style={{ textDecoration: 'none' }}>
                    <Button size="sm" color="secondary">
                      Register
                    </Button>
                  </Link>
                ) : (
                  <Link to="/myportal/dashboard" style={{ textDecoration: 'none' }}>
                    <Button size="sm" color="secondary">
                      My page
                    </Button>
                  </Link>
                )}
              </div>
            </div> */}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  )
}

TopNavbar.propTypes = {
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.signIn,
})

export default connect(mapStateToProps)(TopNavbar)
