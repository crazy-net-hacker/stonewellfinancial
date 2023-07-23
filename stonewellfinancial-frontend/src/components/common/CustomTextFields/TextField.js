import React from 'react'
// nodejs library that concatenates classes
import classNames from 'classnames'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import styles from '../../../assets/jss/styles/formStyle'
import { Text } from '../LanguageProvider'

const useStyles = makeStyles(styles)

export const RegularTextField = React.forwardRef((props, ref) => {
  const { children, className, label, ...rest } = props
  const classes = useStyles()
  const textFieldClasses = classNames({
    [classes.textField]: true,
    [className]: className,
  })
  return (
    <>
      {
        label ?
        <label
          style={{
            fontWeight: 300,
            marginLeft: 5,
            marginBottom: 0,
            marginTop: 12,
            color:'#1C1C1C',
            fontSize:'15px'
          }}
        >
          {<Text tid={label}/>}
        </label>
        : null
      }
      <TextField
        {...rest}
        ref={ref}
        variant="outlined"
        margin="dense"
        size="small"
        // inputProps={{
        //   style: { background:'#fff' },
        // }}
        className={textFieldClasses}
        // inputProps={{
        //   style: { background:'#fff' },
        // }}
      >
        {children}
      </TextField>
    </>
  )
})
RegularTextField.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  label: PropTypes.string,
}


export const SelectTextField = React.forwardRef((props, ref) => {
  const { children, className, label, ...rest } = props
  const classes = useStyles()
  const textFieldClasses = classNames({
    [classes.textField]: true,
    [className]: className,
  })
  return (
    <>
    {
      label ?
      <label
        style={{
          fontWeight: 300,
          marginLeft: 5,
          marginBottom: 0,
          marginTop: 12,
          color:'#1C1C1C',
          fontSize:'15px'
        }}
      >
        {/* {label} */}
        {<Text tid={label}/>}
      </label>
      : null
    }
      <TextField
        {...rest}
        ref={ref}
        select
        variant="outlined"
        margin="dense"
        size="small"
        SelectProps={{
          native: true,
        }}
        className={textFieldClasses}
      >
        {children}
      </TextField>
    </>
  )
})

SelectTextField.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  label: PropTypes.string,
}


export const SelectMenuTextField = React.forwardRef((props, ref) => {
  const { children, className, label, ...rest } = props
  const classes = useStyles()
  const textFieldClasses = classNames({
    [classes.textField]: true,
    [className]: className,
  })
  return (
    <>
    {
      label ?
      <label
        style={{
          fontWeight: 300,
          marginLeft: 5,
          marginBottom: 0,
          marginTop: 12,
          color:'#1C1C1C',
          fontSize:'15px'
        }}
      >
        {/* {label} */}
        {<Text tid={label}/>}
      </label>
      : null
    }
      <TextField
        {...rest}
        ref={ref}
        select
        variant="outlined"
        margin="dense"
        size="small"
        SelectProps={{
            MenuProps: {
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left"
              },
              getContentAnchorEl: null
            }
        }}
        className={textFieldClasses}
      >
        {children}
      </TextField>
    </>
  )
})

SelectMenuTextField.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  label: PropTypes.string,
}


export const AutoCompleteField = React.forwardRef((props, ref) => {
  const { children, className, label, ...rest } = props
  const classes = useStyles()
  const textFieldClasses = classNames({
    [classes.textField]: true,
    [className]: className,
  })
  return (
    <>
      {
        label ?
        <label
          style={{
            fontWeight: 300,
            marginLeft: 5,
            marginBottom: 0,
            marginTop: 12,
            color:'#1C1C1C',
            fontSize:'15px'
          }}
        >
          {label}
        </label>
        : null
      }
      <TextField
        {...rest}
        ref={ref}
        variant="outlined"
        margin="dense"
        size="small"
        // inputProps={{
        //   style: { background:'#fff' },
        // }}
        className={textFieldClasses}
        
      >
        {children}
      </TextField>
    </>
  )
})

AutoCompleteField.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  label: PropTypes.string,
}