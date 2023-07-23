// import { createMuiTheme } from '@material-ui/core'
import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core'
// import { languageOptions } from '../../components/languages'
// import transitions from '@material-ui/core/styles/transitions'


export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2a2f71', // Logo Color 1
      light: '#5b5d80',
      dark: '#22265a',
      contrastText: '#fff', // Contrast Ratio: 12.04
    },
    secondary: {
      main: '#8EC641', // Logo Color 2
      light: '#6e708f',
      dark: '#097135',
      contrastText: '#2B2B2B', // Contrast Ratio: 6.9
    },
    neutral: {
      dark: '#272a31',
      gray: '#BABABA',
      white: '#fafafa',
    },
  },

  typography: {
    // fontFamily: 'Montserrat, sans-serif',
    fontFamily: 'heebo, Noto Sans KR, sans-serif',
    h1: {
      // section title (primary),
      fontSize: 30,
      fontWeight: 600,
      marginBottom: 15,
      color: '#2a2f71',
    },
    h2: {
      // section sub title or explanation of h1(secondary)
      fontFamily: 'heebo, Noto Sans KR, sans-serif',// fontFamily: 'Noto Sans',
      // fontFamily: 'heebo, sans-serif',
      fontSize: '1.8rem',
      fontWeight: '700',
      // letterSpacing: '-.02em',
      lineHeight: '1.3',
      // color: '#2A2F71',
      // color: theme.palette.primary.main,
      marginBottom: '0.5em',
      color: '#2a2f71',
    },
    h4: {
      // card title,
      fontFamily: 'heebo, Noto Sans KR, sans-serif',
      fontSize: '1.1em',
      fontWeight: 600,
      color: '#222',
    },
    h5: {
      // card title,
      fontSize: '1em',
      fontWeight: 500,
      // color: '#2c2c2c',
    },
    h6: {
      // gray title,
      fontSize: 15,
      // fontWeight: 400,
      color: '#666',
      paddingLeft: '0.5em',
      margin: 'auto 0',
      letterSpacing: '1.2px',
    },
    caption: {
      // hashtag, card description,
      fontSize: 12,
      fontWeight: 400,
    },
    body1: {
      // default font
      fontSize: '1.1em',
      // fontWeight: 700,
      color: '#666',
      lineHeight: '1.8',
      // letterSpacing: '-.02em',
    },
    body2: {
      // default font
      fontSize: 15,
      fontWeight: 400,
      color: '#515151',
    },
    button: {
      fontSize: 16,
      fontWeight: 600,
      
    },
  },
  
  overrides: {
    MuiOutlinedInput: { 
      root: {
        borderRadius: '4px',
        margin: '0 5px',
        border:'1px solid #dce4ec'
      },
      input: {
        padding: '10px',
        height:'22px'
      },
      adornedStart: {
        paddingLeft:'0'
      }
      // MuiBreadcrumbs: {
      //   root: {
        
      //     justifyContent: 'left'
      //   }
      // }
    },
    MUIDataTable: {
      root: {
        backgroundColor: "#FF000",
      },
      paper: {
        boxShadow: "none",
        padding:'2vh',
        width:'100%'
      },
     
    },
    MuiPaper : {
      elevation1: {
        boxShadow:'0',
        border: '1px solid #eee',
        // background: '#f5f5f5'
      }
    },
    MuiInputBase: {
      root: {
        borderRadius: '0',
        margin: '0 5px',
      }
    },
    MuiTableCell:{
      root: {
        padding:'10px',
        fontSize: '14px'
      },
      sizeSmall: {
        padding: '3px'
      }
    },
    MUIDataTableHeadCell: {
      toolButton: {
        fontSize: '12px'
      }
    },
    // MuiToolbar: {
    //   gutters: {
    //     paddingBottom: "4vh"
    //   }
    // },
    MuiFormControlLabel: {
      root: {
        marginleft:'0',
        marginRight: '0',
        justifyContent: 'flex-end'
      }
    },
    MuiSelect: {
      outlined: {
        height: '22px',
        padding: '10.5px 65px 10.5px 12px'
      }
    },
    MuiFab: {
      root: {
        borderRadius:'none'
      }
    },
    PrivateNotchedOutline: {
      root: {
        borderWidth:0
      }
    },
    MuiButton: {
      outlinedPrimary: {
        background:'#3f51b5',
        color:'#fff',
        textTransform:'capitalize'
      },
      // root: {
      //   transitions:'none',
       
      // }
  
      

    },
    MuiTooltip: {
      tooltip: {
          fontSize: "12px",
          fontWeight:'400',
      },
  },
  MuiDropzoneArea: {
    root: {
      minHeight:'0',
      backgroundColor: '#efefef',
      padding:'1.5vh'
    },
    icon: {
      width: '25px'
    },
    text: {
      marginBottom:'0'
    },
  },
  MuiDropzonePreviewList: {
    image: {
      height:'30px'
    },
    imageContainer: {
      fontSize:'12px',
      marginTop:'1vh'
    },
  },
 
 
    // MuiSvgIcon: {
    //   root: {
    //     marginLeft:'10px'
    //   }
    // }
  
   
    
  
  },
  
})
