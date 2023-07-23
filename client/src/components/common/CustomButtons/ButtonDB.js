import React from 'react'
// nodejs library that concatenates classes
import classNames from 'classnames'
// nodejs library to set properties for components
import PropTypes from 'prop-types'

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import styles from '../../../assets/jss/styles/buttonDBStyle'

const useStyles = makeStyles(styles)

const RegularButton = React.forwardRef((props, ref) => {
  const {
    color,
    size,
    justIcon,
    fullWidth,
    disabled,
    children,
    round,
    className,
    ...rest
  } = props
  const classes = useStyles()
  const btnClasses = classNames({
    [classes.button]: true,
    [classes[color]]: color,
    [classes[size]]: size,
    [classes.fullWidth]: fullWidth,
    [classes.disabled]: disabled,
    [classes.justIcon]: justIcon,
    [classes.round]: round,
    [className]: className,
  })
  return (
    <Button {...rest} ref={ref} className={btnClasses}>
      {children}
    </Button>
  )
})

RegularButton.propTypes = {
  color: PropTypes.oneOf(['primary', 'secondary', 'dark', 'warning']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  round: PropTypes.bool,
  fullWidth: PropTypes.bool,
  justIcon: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
}

export default RegularButton
