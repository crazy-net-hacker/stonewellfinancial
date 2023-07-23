import React from 'react'
// nodejs library that concatenates classes
import classNames from 'classnames'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import styles from '../../../assets/jss/styles/formDashboardStyle'
import { Text } from '../LanguageProvider'
// import { Tooltip } from '@material-ui/core'
// import HelpIcon from '@mui/icons-material/Help';
import TooltipInfo from '../TooltipInfo'


const useStyles = makeStyles(styles)

export const RegularTextFieldSmall = React.forwardRef((props, ref) => {
  const { children, className, label, tooltipTitle, ...rest } = props
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
            fontWeight: 600,
            marginLeft: 5,
            marginBottom: 0,
            // marginTop: 12,
            fontSize:'14px',
            color:'#2c3e50',
          }}
        >
          {<Text tid={label}/>}
          { tooltipTitle ? 
          // <Tooltip title={<Text tid={tooltipTitle}/>} placement="right-end" enterTouchDelay={0} leaveTouchDelay={5000} color="primary">
          //     <HelpIcon/>
          // </Tooltip>
          <TooltipInfo info={<Text tid={tooltipTitle}/>}/>
          : null }
        </label>
        : null
      }
      <TextField
        {...rest}
        ref={ref}
        variant="outlined"
        margin="dense"
        size="small"
        // InputLabelProps={{
        //   shrink: true,
        // }}
        // inputProps={{
        //   style: { height: '14px', background:'#fff' },
        // }}
        className={textFieldClasses}
      >
        {children}
      </TextField>
    </>
  )
})
RegularTextFieldSmall.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  label: PropTypes.string,
}

export const SelectTextFieldSmall = React.forwardRef((props, ref) => {
  const { children, className, label, tooltipTitle, ...rest } = props
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
          fontWeight: 600,
          marginLeft: 5,
          marginBottom: 0,
          // marginTop: 12,
          fontSize:'14px',
          color:'#2c3e50'
        }}
      >
        {<Text tid={label}/>}
        { tooltipTitle ? 
          // <Tooltip title={<Text tid={tooltipTitle}/>} placement="right-end" enterTouchDelay={0} leaveTouchDelay={5000} color="primary">
          //     <HelpIcon/>
          // </Tooltip>
          <TooltipInfo info={<Text tid={tooltipTitle}/>}/>
          : null }
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
        // fullWidth
        // InputLabelProps={{
        //   shrink: true,
        // }}
        SelectProps={{
          native: true,
        }}
        // inputProps={{
        //   style: { height: '14px', background:'#fff' },
        // }}
        className={textFieldClasses}
      >
        {children}
      </TextField>
    </>
  )
})

SelectTextFieldSmall.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  label: PropTypes.string,
}


export const SelectMenuTextFieldSmall = React.forwardRef((props, ref) => {
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
          fontWeight: 600,
          marginLeft: 5,
          marginBottom: 0,
          // marginTop: 12,
          fontSize:'14px',
          color:'#2c3e50'
        }}
      >
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
        // fullWidth
        // InputLabelProps={{
        //   shrink: true,
        // }}
        SelectProps={{
          MenuProps: {
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left"
            },
            getContentAnchorEl: null
          }
      }}
        // inputProps={{
        //   style: { height: '14px', background:'#fff' },
        // }}
        className={textFieldClasses}
      >
        {children}
      </TextField>
    </>
  )
})

SelectMenuTextFieldSmall.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  label: PropTypes.string,
}