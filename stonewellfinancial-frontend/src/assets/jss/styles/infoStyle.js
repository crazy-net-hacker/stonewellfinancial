// import {
//   primaryColor,
//   warningColor,
//   dangerColor,
//   successColor,
//   infoColor,
//   roseColor,
//   grayColor,
//   title,
// } from '../commonStyle'

import { theme } from '../theme'

const infoStyle = {
  infoArea: {
    maxWidth: '360px',
    margin: '0 auto',
    // padding: '10px 0 30px',
    textAlign: 'left',
    display: 'flex',
    padding:'16px 32px'
  },
  infoAreaSub: {  
    
    margin: '0 auto',
    // padding: '10px 0 30px',
    textAlign: 'left',
    display: 'flex',

    background: "#f7f7f7",

  },
  iconWrapper: {
    // margin: "auto 0",
    marginRight: "15px"
  },
  primary: {
    color: theme.palette.primary.main,
  },
  secondary: {
    color: theme.palette.primary.main,
  },
  gray: {
    color: theme.palette.primary.main,
  },
  icon: {
    width: '4rem',
    height: '4rem',
    fontSize: '4rem',
    fill:'#fff',
    // borderRadius: '1px solid black',
    background: theme.palette.secondary.main,
    padding: '12px',
    border: '3px solid',
    borderColor: theme.palette.secondary.main,
    borderRadius: 50,
    '& hover': {
      fill: theme.palette.neutral.white,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
      width: '3rem',
      height: '3rem',
      padding: '6px',
    },
  },
  descriptionWrapper: {
    // color: grayColor[0],
    overflow: 'hidden',
  },
  title: {
    // ...title,
    // margin: '1.75rem 0 0.875rem !important',
    minHeight: 'unset',
    fontSize: '1.1em',
    fontWeight: '700',
    color: '#222',
  },
  description: {
    // color: grayColor[0],
    overflow: 'hidden',
    marginTop: '0px',
    fontSize: '0.9em',
    color: "#666",
    '& p': {
      // color: grayColor[0],
      fontSize: '14px',
    },
  },
  iconWrapperVertical: {
    float: 'none',
  },
  iconVertical: {
    width: '61px',
    height: '61px',
  },
}

export default infoStyle
