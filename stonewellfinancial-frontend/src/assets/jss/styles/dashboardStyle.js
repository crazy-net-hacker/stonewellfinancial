import { theme } from '../theme'

const dashboardStyles = {
  root: {
    height: '100%',
    background: '#f0f2f8',
  },
  breadCrumbsDashboard: {
    marginBottom: '2vh',
  },
  snackBarMessage: {
    marginBottom: theme.spacing(2),
  },
  titleGreyBox: {
    fontWeight: '500', 
    fontSize: '16px', 
    margin: '1.5vh 0', 
    width:'100%', 
    background:'#efefef', 
    padding:'1.5vh'
  },
  inputLabel: {
    fontWeight:'600',
    paddingTop:'12px',
    display:'block',
    fontSize:'12px',
    color:'#777'
  },
  productTitle: {
    fontWeight:'600',
    // paddingTop:'12px',
    display:'block',
    fontSize:'1.2rem',
    color:'#000',
    textAlign: 'left',
    // marginBottom: '2vh',
    paddingBottom: '0',
    borderBottom: '0',
    [theme.breakpoints.down(767)]: {
      textAlign: 'center', 
      marginBottom: '1vh', 
      paddingBottom: '2vh', 
      borderBottom: '1px solid #ddd'
    },
  },
  productLable: {
    fontWeight:'600',
    display:'block',
    fontSize:'12px',
    color:'#777'
  },
  productDetailBox: {
    padding:'2vh 3vh', 
    background:'#f7f7f7', 
    borderRadius:'0 5px 5px 5px'
  },
  productDetailValue: {
    padding: '0',
    [theme.breakpoints.down(767)]: {
      padding: '1vh'
    },
  },
  inputLabelhorizontal: {
    fontWeight:'600',
    fontSize:'12px',
    color:'#777',
    paddingRight:'1vh'
  },
  inputValue: {
     fontWeight:'600' 
  },
  iconButtonBox: {
    borderRadius:'0', 
    padding:'5px 15px 5px 10px', 
    marginTop:'15px', 
    background:'#f7f7f7',
    margin: '0', 
    // [theme.breakpoints.down(767)]: {
    //   margin: '2vh 0'
    // },
  },
  iconButtonText: {
    fontSize: '12px', 
    marginLeft: '3px', 
    fontWeight: '500'
  },
  sectionWrapper: {
      margin:'1vh 8vh'
  },
  sectionTitle: {
    fontWeight: '600', 
    fontSize: '16px', 
    margin: '1.5vh 0'
  },
  sectionTitleBox: {
    margin: '2vh 0',
    // borderBottom:'1px solid #efefef'
  },
  dashboardPageTitle: {
    fontSize:'1.2rem', 
    fontWeight:'600', 
    color:'#000',
    textAlign:'left',
    [theme.breakpoints.down(767)]: {
      width:'100%',
      textAlign:'center'
    },
  },
  dashboardPageSubTitle: {
    fontSize:'1rem', 
    fontWeight:'600', 
    color:'#000'
  },
  cardBoxTitle: {
    fontSize:'1rem', 
    fontWeight:'600', 
    color:'#000',
    textAlign:'left',
    [theme.breakpoints.down(767)]: {
      width:'100%',
      textAlign:'center'
    },
  },
  tableTitle: {
    fontSize:'1.1rem', 
    fontWeight:'600', 
    color:'#000', 
    marginLeft:'-2vh'
  },
  form: {
    width: 'auto',
    flexGrow: 1,
    marginLeft: '2vw',
    marginRight: '2vw',
    [theme.breakpoints.down(1367)]: {
      marginRight: '2vw',
    },
    [theme.breakpoints.down(767)]: {
      marginRight: '2vw',
    },
    // padding: theme.spacing(3),
    // height: '80vh',
    // overflow: 'auto',
  },
  banner: {
    // display: 'flex',
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start',
    // alignSelf: 'flex-start',
    margin: 0,
    paddingTop:'3vh',
    paddingLeft:'12px'
  },
  // paper: {
  //   elevation: 3,
  //   marginTop: theme.spacing(3),
  //   marginBottom: theme.spacing(3),
  //   padding: theme.spacing(2),
  //   boxShadow: '0 3px 15px #00000014',
  //   border: '1px solid #dadada',
  //   borderRadius: '0',
  //   flexGrow: 1,
  //   [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
  //     marginTop: theme.spacing(6),
  //     marginBottom: theme.spacing(6),
  //     padding: theme.spacing(2),
  //   },
  // },
  xsDown: {
    color: '#111',
    fontSize: '24px',
    paddingTop: '2vh',
    paddingLeft: '2vw',
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      fontSize: '1.5em',
      justifyContent: 'center',
    },
  },
  descriptionTitle: {
    color: '#555',
    paddingLeft: '2vw',
  },
  buttonGroup: {
    margin:'3vh 0 0 2vw',
    fontWeight: '500'
  },

  productBox: {
    background:'#fff',
    padding:'3vh',
    borderRadius:'15px',
    boxShadow: 'rgb(0 0 0 / 2%) 0px 3.5px 5.5px',
    margin:'0 5vh 2vh'
  },
  titleText: {
    fontSize: '20px',
    fontWeight: '600'
  },
  subTitleText: {
    fontSize: '18px',
    fontWeight: '600'
  },
  icon: {
    '&:hover': {
      cursor: 'pointer',
      color: theme.palette.secondary.dark
    },
    color: theme.palette.primary.main
  }
}

export default dashboardStyles
