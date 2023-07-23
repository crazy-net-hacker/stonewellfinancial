import React from 'react'
import { Route, Redirect } from 'react-router-dom'
// import PropTypes from 'prop-types'

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      !isAuthenticated ? <Redirect to="/signin" /> : <Component {...props} />
    }
  />
)

// PrivateRoute.propTypes = {
//   // auth: PropTypes.object.isRequired,
//   isAuthenticated: PropTypes.bool,
// }

// const mapStateToProps = (state) => ({
//   //auth: state.signIn,
//   isAuthenticated: PropTypes.bool,
// })
//export default connect(mapStateToProps)(PrivateRoute)
export default PrivateRoute
