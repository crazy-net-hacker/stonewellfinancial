import { theme } from '../theme'

const vendorFormStyle = {
  title: {
    color: theme.palette.primary.main,
    fontWeight: '600',
    fontSize: '1.2em',
    marginTop: '1vh',
    marginBottom: 10,
    //textAlign: 'center',
  },
  titleDashboard: {
    color: '#333',
    fontWeight: '700',
    fontSize: '1.2em',
    marginTop: '5vh',
    marginBottom: '3vh',
    // marginBottom: 10,
    //textAlign: 'center',
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
  textEnd: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '5vh 0',
  },
  button: {
    margin: theme.spacing(1, 1, 1, 1),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  next_button: {
    width: '100%'
  },
  back_button: {
    width: '100%'
  },
  iconHelp: {
    color: theme.palette.primary.dark,
  },
  // formControl: {
  //   minWidth: '100%',
  // },
  selectBox: {
    borderRadius: '0',
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
    color: '#666',
  },
  inputPaddingTitle: {
    padding: '12px 0',
    // textAlign: 'center',
    fontWeight: '600',
    fontStyle: 'italic',
    marginBottom: '1vh',
    // marginTop: '10vh'
  },
  inputPaddingSubtitle: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: '2vh',
    fontWeight: '400',
  },
  inputPaddingSubtitle2: {
    fontStyle: 'italic',
    marginBottom: '2vh',
    fontWeight: '500',
    paddingTop: '2vh',
    marginTop: '2vh',
    borderTop: '1px solid #eee',
  },
  tripInfoBox: {
    background: '#f5f5f5',
    padding: '20px',
    marginBottom: '70px',
    borderRadius: '10px',
  },
  grayLine: {
    width: '2vw',
    height: '1px',
    background: '#555',
    marginBottom: '1vh',
    display: 'inline-block',
  },
  applicant: {
    display: 'flex',
    fontSize: '15px',
    color: '#2c3e50',
    border:'1px solid #ddd',
    borderBottom:'none',
    borderRadius:'4px 4px 0 0',
    background:"#efefef",
    padding:'1.5vh',
    fontWeight: '600',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  applicantArrow: {
    display: 'flex',
    color: '#2c3e50',
    border:'1px solid #ddd',
    borderBottom:'none',
    borderRadius:'4px 4px 0 0',
    background:"#efefef",
    justifyContent: 'flex-end',
  },
  travelType: {
    color: '#888',
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
    display: 'inline',
  },
  summaryBox: {
    marginTop: '8vh',
    background: '#f7f7f7',
    height: 'fit-content',
  },
  // root: {
  //   textAlign: 'center',
  //   border: '1px solid #333',
  //   margin: '10px',
  //   borderRadius: '10px',
  // },
  cardContentBox: {
    padding: '16px 16px 0 16px',
  },
  subTitle: {
    color: '#8EC641',
    padding: '5px 0',
    fontSize: '0.8em',
  },
  dropDown: {
    width: '120px',
    margin: '0 10px',
    display: 'inline-block',
  },
  price: {
    fontSize: '1.5em',
    textAlign: 'right',
    //padding: '10px 0 20px 0'
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
    marginBottom: '5vh',
  },
  title2: {
    marginBottom: '0',
    display: 'inline',
    color: '#222',
    fontWeight: '600',
  },
  applicantSub: {
    fontSize: '0.8em',
    fontWeight: '600',
    color: '#222',
    marginTop: '2vh',
    textAlign: 'right',
  },
  description_sm: {
    fontSize: '0.8em',
    fontWeight: '500',
    fontStyle: 'italic',
    margin: '4vh 0',
    textAlign: 'center',
    color: 'red',
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
    fontSize: '12px',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '100%',
  },
  mailingAddressLabel: {
    textAlign: 'flex-start',
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  applicantInfo: {
    marginTop: 20,
    marginBottom: 20,
  },
  insurance: {
    marginTop: 20,
  },
  card: {
    minHeight: '100px',
  },
  noOfApplicants: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  eligiblityBox: {
    background:"#F3725A",
    margin:0,
    marginTop:'1vh',
    padding:'1.5vh'
  },
  eligible: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    fontWeight: '500',
    color:'#fff'
  },
  residential: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    fontWeight: '600',
    marginBottom: '3vh',
    // marginTop: '1vh',
  },
  deliverCard: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      margin: 0,
    },
    fontWeight: '600',
    marginTop: '1vh',
  },
  premium: {
    display: 'flex',
    justifyContent: 'flex-end',
    color: theme.palette.primary.main,
    fontWeight: '500',
    fontSize: '1em',
    marginTop: '2vh',
  },
  subTitle2: {
    padding: '1vh',
    marginTop: '5vh',
    marginBottom: '2vh',
    borderBottom: '1px solid #eee',
    fontWeight: '600',
  },
  CardBox: {
    marginBottom: '2vh',
    borderRadius:'0 0 4px 4px'
  },
  RowMarginBottom: {
    // borderBottom:'1px solid #efefef',
    paddingBottom:'1.5vh!important',
    paddingTop:'1.5vh!important',
    // marginBottom: '3vh',
  },
  RowMarginDivider: {
    borderTop:'1px solid #efefef',
    paddingTop:'1.5vh!important',
    marginTop: '2vh',
     paddingBottom:'1.5vh!important',
  },
  summaryCardLeft: {
    backgroundColor: '#f5f5f5',
    fontWeight: 700,
  },
  DetailsTable: {
    width: '100%',
    '& > table, tr, th, td': {
      border: ' 1px solid #dddddd',
      padding: '8px',
    },
    '& >  tr:nth-child(even)': {
      backgroundColor: '#f5f5f5',
    },
  },
  dateField: {
    height:'17px!important'
  },
  toggleButtonGroup: {
    textTransform: 'none',
    color: 'rgba(42,46,113,255)',
    
    width: '100%',
    "&.Mui-selected": {
      backgroundColor: 'rgba(42,46,113,255)',
      color: 'white'
    }
  },
  toggleButton: {
    padding:'10px',
    color:'#3f51b5',
    fontSize:'16px',
    fontWeight:'600',
    width:'100%',
    // background:'#fff',
    "&.Mui-selected": {
      backgroundColor:'#3f51b5',
      color:'#fff'
    }

  },
  // formControl: {
  //   border:'1px solid #dce4ec'
  // },
  Checkbox: {
    fontSize:'14px',
    marginTop:'1vh',
    
  },
  table_container: {
    boxShadow:'0 3px 15px #00000014'
  },
  
  row_title: {
    // marginBottom:'1.5vh',
    // borderBottom:'1px solid #efefef',
    fontSize:'14px',
    fontWeight:'600',
    padding:'0 1vh 0',
    color:'#5a5a5a'
  },
  cell_title: {
    width:'25%',
    fontWeight:'600',
    background:'#efefef',
    [theme.breakpoints.up('lg')]: {
      width:'40%',
    },
    [theme.breakpoints.down('md')]: {
      width:'40%',
    },
  },
  cell_subTitle: {
    color:'#2c3e50',
    fontWeight:'600',
    fontSize:'14px',
    marginBottom:'15px'
  },
  cell_applicant: {
    // width:'8%'
    background:'#efefef',
    textAlign:'center',
    fontWeight:'600'
  },
  cell_applicant_left: {
    background:'#efefef',
    textAlign:'left',
    fontWeight:'600'
  },
  cell_applicant_name: {
    fontSize:'15px',
    fontWeight:'600',
    color:'#5a5a5a',
  },
  cell_applicant_age: {
    fontSize:'14px',
    fontWeight:'500',
    color:'#aaa',
    textTransform:'lowercase',
    fontStyle:'italic',
  
  },
  cell_product: {
    padding:'0px'
  },
  subButton: {
    fontWeight:'500',
    fontSize:'13px',
    color:'#3f51b5'
  },
  tripLength: {
    fontSize:'14px',
    fontWeight:'500',
    color:'#aaa',
    textTransform:'lowercase',
    fontStyle:'italic'
  },
  naBox: {
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '10px'
  },

  group_info_container: {
    margin:'1vh 0',
    fontWeight:'600',
  },
  group_info_title: {
    paddingTop:'12px'
  },
  btn_group: {
    height:'44px',
    paddingTop:'9px'
  },
  btn_sub: {
    background:'#efefef'
  },
  summary_title: {
    color:'#2c3e50',
    fontWeight:'600',
    marginBottom:'1vh',
    paddingTop:'2vh'
  },
  modal_title: {
    fontSize:'22px',
    color:'#2a2f71',
    textAlign:'center',
    fontWeight:'600',
    paddingLeft:'0'
  },
  modal_subTitle: {
    textAlign:'center'
  },
  inputLabel: {
    fontWeight: 600,
    marginLeft: 5,
    marginBottom: 10,
    fontSize:'14px',
    color:'#2c3e50',
  },
  inputLabel_manualForm: {
    fontSize:'14px',
    fontWeight: 600,
    marginLeft:'5px'
  },
  dashboardBox_title: {
    fontSize:'14px', 
    marginBottom:'20px', 
    fontWeight:'600'
  }

  // overrides: {
  //   MuiOutlinedInput: { 
  //     root: {
  //       borderRadius: '4px!important',
  //     }
  //   }
  // }
  
}
export default vendorFormStyle
