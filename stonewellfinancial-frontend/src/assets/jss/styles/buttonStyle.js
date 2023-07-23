import { grayColor } from '../commonStyle'
import { theme } from '../theme'

const buttonStyle = {
  button: {
    //color: 'black',
    textAlign: 'center',
    minHeight: 'auto',
    minWidth: 'auto',
    borderRadius: '5px',
    padding: '.375rem 1.5rem',
    textTransform: 'none',
    '&:hover,&:focus': {
      boxShadow: ' 0 1rem 3rem rgba(0,0,0,.175)',
    },
    cursor: 'pointer',
    '& .fab,& .fas,& .far,& .fal,& .material-icons': {
      position: 'relative',
      display: 'inline-block',
      top: '0',
      marginTop: '-1em',
      marginBottom: '-1em',
      fontSize: '1.1rem',
      marginRight: '4px',
      verticalAlign: 'middle',
    },
    '& svg': {
      position: 'relative',
      display: 'inline-block',
      top: '0',
      width: '18px',
      height: '18px',
      marginRight: '4px',
      verticalAlign: 'middle',
    },
    '&$justIcon': {
      '& .fab,& .fas,& .far,& .fal,& .material-icons': {
        marginTop: '0px',
        marginRight: '0px',
        position: 'absolute',
        width: '100%',
        transform: 'none',
        left: '0px',
        top: '0px',
        height: '100%',
        lineHeight: '41px',
        fontSize: '20px',
      },
    },
  },
  round: {
    borderRadius: '15px',
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.neutral.white,
    border: '2px solid',
    borderColor: theme.palette.primary.main,
    '&:hover,&:focus': {
      backgroundColor: theme.palette.primary.light,
      // backgroundColor: theme.palette.neutral.white,
      // color: theme.palette.primary.main
    },
    '& a': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.neutral.white,

      '&:hover,&:focus': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
  secondary: {
    color: `${theme.palette.primary.main} !important`,
    backgroundColor: theme.palette.neutral.white,
    border: '2px solid',
    borderColor: theme.palette.primary.main,
    borderRadius:0,
    '&:hover,&:focus': {
      // backgroundColor: theme.palette.primary.main,
      backgroundColor:'#ddd',
      // color: `${theme.palette.neutral.white} !important`,
    },
    
    '& a': {
      color: `${theme.palette.primary.main} !important`,
      backgroundColor: theme.palette.neutral.white,
      border: '1px solid',
      borderColor: theme.palette.primary.main,
      '&:hover,&:focus': {
        backgroundColor: theme.palette.primary.main,
        color: `${theme.palette.neutral.white} !important`,
      },
    },
  },
  dark: {
    color: theme.palette.neutral.white,
    backgroundColor: theme.palette.primary.main,
    border: '2px solid',
    borderColor: theme.palette.primary.main,
    borderRadius:0,
    '&:hover,&:focus': {
      // backgroundColor: theme.palette.neutral.white,
      backgroundColor:'#1a1e47',
      // color: theme.palette.primary.main,
    },
    '& a': {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.neutral.white,
      border: '1px solid',
      borderColor: theme.palette.neutral.white,
      '&:hover,&:focus': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.neutral.white,
      },
    },
  },
  warning: {
    color: theme.palette.neutral.white,
    backgroundColor: '#cc3300',
    border: '2px solid',
    borderColor: '#cc3300',
    '&:hover,&:focus': {
      backgroundColor: '#aa2608',
      borderColor: '#aa2608',
      color: theme.palette.neutral.white,
    },
    '& a': {
      color: theme.palette.primary.main,
      backgroundColor: '#cc3300',
      border: '1px solid',
      '&:hover,&:focus': {
        backgroundColor: '#aa2608',
        borderColor: '#aa2608',
        color: theme.palette.neutral.white,
      },
    },
  },

  disabled: {
    opacity: '0.65',
    pointerEvents: 'none',
  },
  lg: {
    '&$justIcon': {
      '& .fab,& .fas,& .far,& .fal,& svg,& .material-icons': {
        marginTop: '-4px',
      },
    },
    padding: '0.7rem 2rem',
    fontSize: '1.25rem',
    lineHeight: '1.333333',
  },
  md: {
    '&$justIcon': {
      '& .fab,& .fas,& .far,& .fal,& svg,& .material-icons': {
        marginTop: '-2px',
      },
    },
    padding: '0.3rem 2rem',
    fontSize: '1rem',
  },
  sm: {
    minWidth: '85px',
    '&$justIcon': {
      '& .fab,& .fas,& .far,& .fal,& svg,& .material-icons': {
        marginTop: '1px',
      },
    },
    padding: '0.3rem 1rem',
    fontSize: '0.8rem',
    lineHeight: '1.5',
  },
  block: {
    width: '100% !important',
  },
  link: {
    '&,&:hover,&:focus': {
      backgroundColor: 'transparent',
      color: grayColor[0],
      boxShadow: 'none',
    },
  },
  justIcon: {
    paddingLeft: '12px',
    paddingRight: '12px',
    fontSize: '20px',
    height: '41px',
    minWidth: '41px',
    width: '41px',
    '& .fab,& .fas,& .far,& .fal,& svg,& .material-icons': {
      marginRight: '0px',
    },
    '&$lg': {
      height: '57px',
      minWidth: '57px',
      width: '57px',
      lineHeight: '56px',
      '& .fab,& .fas,& .far,& .fal,& .material-icons': {
        fontSize: '32px',
        lineHeight: '56px',
      },
      '& svg': {
        width: '32px',
        height: '32px',
      },
    },
    '&$sm': {
      height: '30px',
      minWidth: '30px',
      width: '30px',
      '& .fab,& .fas,& .far,& .fal,& .material-icons': {
        fontSize: '17px',
        lineHeight: '29px',
      },
      '& svg': {
        width: '17px',
        height: '17px',
      },
    },
  },
 
}

export default buttonStyle
