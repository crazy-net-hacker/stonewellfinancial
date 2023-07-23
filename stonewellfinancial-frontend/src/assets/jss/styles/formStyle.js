import { theme } from '../theme'

const formStyle = {
  formWrapper: {
     padding:'0 2vh 0 2vh',
    [theme.breakpoints.down('1358px')]: {
      padding:'0 2vh 0 2vh',
    },
    
    [theme.breakpoints.up('1359px')]: {
      padding:'0 35vh',
    },
  },
  textFieldWrapper: {
    paddingTop: '28px', 
    // paddingLeft: '8px',
    [theme.breakpoints.down('sm')]: {
      padding:'0',
      paddingTop: '12px', 
    },
  },
  title: {
    color: theme.palette.primary.main,
    fontWeight: '600',
    fontSize: '22px',
    //marginTop: '2vh',
    textAlign: 'center'
  },
  title_question: {
    color: theme.palette.primary.main,
    fontWeight: '400',
    fontSize: '26px',
    // marginTop: '10vh',
    // marginBottom:'5vh',
    margin: '10vh 2vh 5vh',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize:'22px',
    },
    // [theme.breakpoints.down('md')]: {
    //   marginTop:'10vh',
    // },
  },
  title_question_big: {
    marginTop:'5vh',
    marginBottom:'3vh',
    fontSize:'1.2rem',
    fontWeight:'400',
    color:'#2a2f71'
  },
  titleSmall: {
    color: theme.palette.primary.main,
    fontWeight: '600',
    fontSize: '16px',
    //textAlign: 'center'
  },
  titleSmall_sub: {
    color: theme.palette.primary.main,
    fontWeight: '600',
    fontSize: '18px',
    [theme.breakpoints.down('md')]: {
      textAlign: 'center',
    },
    textAlign: 'left'
  },
  titleSmall_description: {
    color:'#555',
    fontSize:'14px',
    marginTop:'1vh'
  },
  btn_small: {
    color:'#1c1c1c',
    fontWeight:'500'
  },
  btn_small2: {
    fontSize:'14px',
    color:'rgb(163, 201, 84)',
    fontWeight:'600',
    marginTop:'1vh',

  },
  title_question_sub2:{
    display:'block',
    color: '#555',
    fontWeight: '400',
    fontSize: '16px',
    marginBottom:'5vh',
    //textAlign: 'center'
    [theme.breakpoints.down('sm')]: {
      fontSize:'14px'
    },
    [theme.breakpoints.down('md')]: {
      marginBottom:'0',    },
  },
  title_question_sub:{
    display:'block',
    color: '#ccc',
    fontWeight: '400',
    fontSize: '22px',
    marginBottom:'5vh',
    //textAlign: 'center'
    [theme.breakpoints.down('md')]: {
      fontSize: '16px',   },
  },
  textEnd: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    margin: theme.spacing(1, 1, 1, 1),
  },
  button2: {
    textTransform: 'none',
    "&:hover": {
      color: "#000000",
      textDecoration: "underline #000000"
    }
  },
  paymentBtn: {
    width:'100%',
    // margin: theme.spacing(1, 1, 1, 1),
  },
  input_box: {
    marginBottom:'15vh'
  },
  iconHelp: {
    color: theme.palette.primary.dark
  },
  formControl: {

    minWidth: '100%',

  },
  selectBox: {
    borderRadius: '0'
  },
  divider: {
    backgroundColor: '#eee',
    marginTop: '50px',

    width: '100%',
    height: '1px',
  },
  inputPadding: {
    // padding: '12px 0',
    // fontSize: '14px',
    margin: 'auto',
    color: '#666'
  },
  inputPadding2: {
    alignItems: 'center',
    padding: '12px 0',
    // fontSize: '14px',
    margin: 'auto',
    color: '#666'
  },
  row_input: {
    padding: '15px',
    [theme.breakpoints.down('md')]: {
      padding: '10px'
    },
  },
  inputPaddingTitle: {
    padding: '12px 0',
    // textAlign: 'center',
    fontWeight: '600',
    fontStyle: 'italic',
    marginBottom: '3vh',
    marginTop: '3vh'
  },
  inputPaddingSubtitle: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: '2vh',
    fontWeight: '400'
  },
  inputPaddingSubtitle2: {
    fontStyle: 'italic',
    marginBottom: '2vh',
    fontWeight: '500',
    paddingTop: '2vh',
    marginTop: '2vh',
    borderTop: '1px solid #eee'
  },
  tripInfoBox: {
    background: '#f5f5f5',
    padding: '20px',
    marginBottom: '70px',
    borderRadius: '10px'
  },
  grayLine: {
    width: '2vw',
    height: '1px',
    background: '#555',
    marginBottom: '1vh',
    display: 'inline-block'
  },
  applicant: {
    fontSize: '1.1em',
    color: '#222',
    marginTop: '2vh',
    fontStyle: 'italic',
    fontWeight: '600',
    paddingBottom: '1vh',
    borderBottom: '1px solid #f5f5f5'
    // textAlign: 'center'
  },
  travelType: {
    color: '#888'
  },
  travelTypeWrapper: {
    paddingBottom: '2vh',
    borderBottom: '1px solid #eee',
    // textAlign: 'center'
  },
  subInfoWrapper: {
    paddingTop: '10px',
    // textAlign: 'center'
  },

  sumBox: {
    margin: '10px 0',
    display: 'inline'
  },
  summaryBox: {
    marginTop: '8vh',
    background: '#f7f7f7',
    height: 'fit-content',
  },
  card: {
    textAlign: 'center',
    margin: '10px',
  },
  // cardSelected: {
  //   border: '3px solid green',
  // },
  cardTugo: {
    textAlign: 'center',
    margin: '10px',
    backgroundColor: 'rgba(245,255,248,255)'
  },
  cardAllianz: {
    textAlign: 'center',
    margin: '10px',
    backgroundColor: 'rgba(236,247,255,255)'
  },
  cardContentBox: {
    padding: '16px 16px 0 16px',
  },

  subTitle: {
    color: '#8EC641',
    padding: '5px 0',
    fontSize: '0.8em'
  },
  dropDown: {
    width: '120px',
    margin: '0 10px',
    display: 'inline-block'
  },
  boxTitle: {
   fontSize:'16px', 
   fontWeight:'600',
   [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
  },
  },
  price: {
    fontSize: '2em',
    fontWeight:'700',
    textAlign: 'right',
    color: "#3f51b5",
    //padding: '10px 0 20px 0'
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  priceOpt: {
    fontSize: '1.7em',
    fontWeight:'700',
    textAlign: 'right',
    color: "#3f51b5",
    //padding: '10px 0 20px 0'
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  price2: {
    fontSize: '1em',
    textAlign: 'right'
    //padding: '10px 0 20px 0'
  },
  priceBox: {
    padding: '12px', 
    paddingTop: '0', 
    background:'#f9f9f9',
    [theme.breakpoints.down('sm')]: {
      textAlign:'center',
      marginBottom:'2vh',
      borderBottom:'1px solid #ddd',
      paddingBottom:'24px'
    },
  },
  subDescription: {
    textAlign:'right',
    marginBottom:'2vh',
    [theme.breakpoints.down('sm')]: {
      textAlign:'center',
      fontSize:'12px',
      fontStyle:'italic'
    },
  },
  subDescriptionOpt: {
    textAlign:'right',
    marginBottom:'2vh',
    fontSize:'14px',
    [theme.breakpoints.down('sm')]: {
      textAlign:'center',
      fontSize:'12px',
      fontStyle:'italic'
    },
  },
  seeDetail: {
    // textAlign: 'center',
    display: 'block',
    color: '#8EC641',
    textTransform: 'capitalize',
    //marginTop: '20px',
    background: '#f5f5f5',

  },
  pos: {
    display: 'inline',
    fontWeight: '600',
  },
  pageTitle: {
    // textAlign: 'center',
    fontSize: '22px',
    fontWeight: '600',
    color: '#2a2f71',
    textAlign: 'center',
    marginTop: '5vh',
  },
  description: {
    textAlign: 'center',
    fontSize: '1em',
    fontWeight: '500',
    fontStyle: 'italic',
    marginBottom: '5vh'
  },
  title2: {
    marginBottom: '0',
    display: 'inline',
    color: '#1c1c1c',
    fontWeight: '400',
    fontSize:'15px',
    [theme.breakpoints.down('md')]: {
      fontSize:'12px',
      color: '#555',
    },
  },
  applicantSub: {
    fontSize: '0.8em',
    fontWeight: '600',
    color: '#222',
    marginTop: '2vh',
    textAlign: 'right'
  },
  description_sm: {
    fontSize: '0.8em',
    fontWeight: '500',
    fontStyle: 'italic',
    margin: '4vh 0',
    textAlign: 'center',
    color: 'red'
  },
  userInputTitle: {
    fontSize: '14px',
  },
  userInputValue: {
    fontWeight: 600,
  },
  gridMargin: {
    margin: theme.spacing(2, 1),
  },
  tableCell: {
    fontSize: '12px'
  },
  textField: {
    // marginLeft: theme.spacing(1),
    // marginRight: theme.spacing(1),
    width: '100%',
    [theme.breakpoints.down('md')]: {
      marginLeft: '0',
      marginRight:'0'
    },
  },
  stickyLeftMenu: {
    position: 'sticky',
    top: '100px',
    paddingTop: '30px',
    paddingLeft: '24px',
    '& h5': {
      fontWeight: 600,
      borderBottom: '1px solid #eee',
      padding: '0.5em 0',
    }
  },
  stickyLeftMenu_wide: {
    position: 'sticky',
    top: '100px',
    // paddingTop: '30px',
    // paddingLeft: '24px',
    '& h5': {
      fontWeight: 600,
      borderBottom: '1px solid #eee',
      padding: '0.5em 0',
    }
  },
  leftMenuUl: {
    listStyle: 'none',
    paddingTop: '15px',
    paddingBottom: '15px',
    // borderRight: '1px solid',
    paddingLeft: '0',
  },
  stickyLeftMenuCompanion: {
    position: 'sticky',
    top: '100px',
    background:'#fff',
    '& h5': {
      fontWeight: 600,
      padding: '0.5em 0',
    }
  },
  stickyTopMenu: {
    position: 'sticky',
    marginRight: '-1px',
    top: '100px',
    zIndex:'9998',
    '& h5': {
      fontWeight: 600,
      padding: '0.5em 0',
    }
  },
  leftMenuUlCompanion: {
    // borderTop: '1px solid rgba(209,207,207,255)',
    // borderLeft: '1px solid rgba(209,207,207,255)',
    marginBottom:'5px',
    listStyle: 'none',
    //paddingBottom: '15px',
    paddingLeft: '0',
  },

  leftMenuLi: {
    margin: '0',
    padding: '10px',
 
    '&:hover': {
      borderLeft: '5px solid rgb(163, 201, 84)',
      background:'#fcfcfc',
      cursor: 'pointer',
      boxShadow: '0 3px 15px #00000014',
      border:'1px solid #efefef'
    },
  },
  leftMenuLiCompanion: {
    margin: '0',
    padding: '10px',
    background:'#fcfcfc',
    //border: '3px solid rgba(209,207,207,255)',
    // borderBottom: '1px solid rgba(209,207,207,255)',
    // borderRight: '1px solid rgba(209,207,207,255)',
    '&:hover': {
      backgroundColor: '#eee',
      cursor: 'pointer',
    },
  },
  stickyTopMenuItem: {
    margin: '0',
    padding: '10px',
    //border: '3px solid rgba(209,207,207,255)',
    // borderBottom: '1px solid rgba(209,207,207,255)',
    borderRight: '1px solid rgba(209,207,207,255)',
    // borderTop: '1px solid rgba(209,207,207,255)',
    '&:hover': {
      // borderTop: '5px solid rgba(68,114,196,255)',
      cursor: 'pointer',
      background:"#2a2f71",
      color:'#fff'
    },
  },
  stickyTopMenuTitle: {
    margin: '0',
    padding: '10px',
    background:'#2a2f71',
    color:'#fff',
    fontSize:'14px',
    fontWeight:'600',
  },
  leftMenuLiCompanion2: {
    backgroundColor: '#fcfcfc',
    // borderRight: '3px solid rgba(242,242,242,255)',
    // borderLeft: '3px solid rgba(209,207,207,255)',
    // borderTop: '3px solid rgba(209,207,207,255)',
    // borderBottom: '1px solid rgba(209,207,207,255)',
    borderLeft: '8px solid #3f51b5',
    margin: '0',
    padding: '10px',
    '&:hover': {
      backgroundColor: '#eee',
      cursor: 'pointer',
    },
  },
  leftMenuLiGreen: {
    margin: '0',
    padding: '10px',
    backgroundColor: 'green',
    color: 'white',
    '&:hover': {
      borderLeft: '3px solid rgb(163, 201, 84)',
      cursor: 'pointer',
    },
  },
  leftMenuLiRed: {
    margin: '0',
    padding: '10px',
    backgroundColor: 'red',
    color: 'white',
    '&:hover': {
      borderLeft: '3px solid rgb(163, 201, 84)',
      cursor: 'pointer',
 
    },
  },
  companionSection: {
    backgroundColor: '#fff',
    padding:'2vh 0',
    // border: '1px solid #efefef',

  },
  productSection: {
    backgroundColor: '#f3f3f3',
    padding:'2vh 0',
    // border: '1px solid #efefef',

  },

  leftMenuLi2: {
   
    //color: 'white',
    // borderRadius: '5px',
    // border: '3px solid rgba(42,46,113,255)',
    margin: '0',
    padding: '10px',

    boxShadow: '0 3px 15px #00000014',
    border:'1px solid #efefef',
    borderLeft: '5px solid rgb(163, 201, 84)',
    backgroundColor: 'white',
  },
  leftMenuLi2Green: {
    // color: 'white',
    // borderRadius: '5px',
    // border: '3px solid rgba(42,46,113,255)',
    margin: '0',
    padding: '10px',
    backgroundColor: '#fcfcfc',
    // boxShadow: '0 3px 15px #00000014',
    // border:'1px solid #efefef',
    borderLeft: '8px solid #3f51b5',
    // backgroundColor: '#fcfcfc',
    '&:hover': {
      backgroundColor: '#eee',
      cursor: 'pointer',
    },
    
  },

  leftMenuLi2Red: { 
    // color: 'white',
    // borderRadius: '5px',
    // border: '3px solid rgba(42,46,113,255)',
    margin: '0',
    padding: '10px',

    // boxShadow: '0 3px 15px #00000014',
    // border:'1px solid #efefef',
    borderLeft: '8px solid #dfdfdf',
    backgroundColor: '#fcfcfc',
    '&:hover': {
      backgroundColor: '#eee',
      cursor: 'pointer',
    },
  },

  // leftMenuLiCompanion2: {
  //   backgroundColor: '#f3f3f3',
  //   borderLeft: '5px solid #2a2f71',
  //   margin: '0',
  //   padding: '10px',
  // },


  leftMenuLi3: {
    margin: '0',
    padding: '10px',
  },
  leftMenuText: {
    fontWeight: '600',
    // fontStyle: 'italic',
  },
 
 
  icon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#137cbd',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  },

  formMargin: {
    marginLeft: 20,
    marginRight: 20
  },

  error: {
    // border: '3px solid green',
    border: '1px solid red',
  },
  
  name_label: {
    fontWeight:400,
    paddingBottom:'10px',
    color:'#1c1c1c', 
    textAlign:'right',
    paddingTop:'15px',
    paddingRight:'6vw',
  },

  summary_app_title: {
    marginBottom:'2vh',
    fontWeight:'600',
    fontSize:'18px',
    marginTop:'10vh'
  },
  app_box: {
    textAlign:'center'
  },
  app_name_box: { 
    fontWeight:400,
    color:'#1c1c1c',
    fontSize:'20px', 
    textAlign:'center', 
  },
  app_amount_box: {
    fontWeight:700,
    color:'#2a2f71',
    fontSize:'35px', 
    textAlign:'center',
  },
  app_days_box: {
    fontWeight:400,
    color:'#999',
    fontSize:'16px', 
    textAlign:'center',
  },
  app_days_sub_box: {
    fontWeight:400,
    color:'#444',
    fontSize:'16px', 
    textAlign:'center',
  },
  cell_applicant_left: {
    background:'#efefef',
    textAlign:'left',
    fontWeight:'600'
  },
  cell_applicant_left_small: {
    background:'#efefef',
    textAlign:'left',
    fontWeight:'600',
    fontSize:'12px'
  },
  cell_contents_small: {
    fontSize:'13px'
  },

  back_button: {
    width: '100%'
  },
  next_button: {
    width: '100%'
  },
  inputLabel: {
    fontWeight:'400',
    paddingLeft:'6px',
    paddingTop:'12px',
    display:'block',
    fontSize:'15px'
  },
  inputLabel_manualForm: {
    fontWeight:'600',
    paddingLeft:'5px',
    fontSize:'14px'
  },
  sectionTitle: {
    marginBottom:'4vh',
    paddingLeft:'1vh',
    [theme.breakpoints.down('767')]: {
      background:'#f9f9f9',
      textAlign:'center',
      margin:'2vh 0',
      padding:'1.5vh' 
    },
  },
  sectionSubTitle: {
    marginBottom:'2vh',
    paddingLeft:'1vh',
    [theme.breakpoints.down('767')]: {
      // borderLeft:'5px solid #2a2f71',
      // paddingLeft:'1vh',
      // margin:'5vh 0 3vh 1vh'
    }
  },
  spanTitle: {
    borderLeft:'5px solid #2a2f71',
    paddingLeft:'1vh',
    fontWeight:'600',
    // [theme.breakpoints.up('767')]: {
    //   borderLeft:'5px solid #2a2f71',
    //   paddingLeft:'1vh',
    // },
  },
  sub_title: {
    fontSize:'12px',
    color:'#999',
    // fontStyle:'italic',
    marginLeft:'3vh'
  },
  sub_title_summary: {
    fontSize:'12px',
    color:'#999',
  },
  toggleButtonGroup: {
    textTransform: 'none',
    color: 'rgba(42,46,113,255)',
    height:'43px',
    width: '100%',
    marginLeft:'5px',
    paddingRight:'9px',
    "&.Mui-selected": {
      backgroundColor: 'rgba(42,46,113,255)',
      color: 'white'
    },
  },
  toggleButton: {
    padding:'10px',
    color:'#3f51b5',
    fontSize:'16px',
    fontWeight:'600',
    width:'100%',
    textTransform:'capitalize',
    // background:'#fff',
    "&.Mui-selected": {
      backgroundColor:'#3f51b5',
      color:'#fff'
    },
    [theme.breakpoints.down('md')]: {
      fontSize:'12px'
    },
  },
  formWrapper2: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(8),
  },
    borderLeft: {
    borderLeft: '1px solid #DDD'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  btnWrapper: {
    textAlign: 'center',
  },
  nested: {
    paddingLeft: theme.spacing(4)
  },

  infoIcon:{
    color : theme.palette.neutral.gray,
    height:'20px', 
    marginLeft:'2px'
  }

}
export default formStyle