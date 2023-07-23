import { theme } from '../theme'

const formStyle = {
  title: {
    color: theme.palette.primary.main,
    fontWeight: '600',
    fontSize: '22px',
    //marginTop: '2vh',
    textAlign: 'center'
  },
  titleSmall: {
    color: theme.palette.primary.main,
    fontWeight: '600',
    fontSize: '16px',
    //textAlign: 'center'
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
  iconHelp: {
    color: theme.palette.primary.dark
  },
  formControl: {

    minWidth: '100%',

  },
//   selectBox: {
//     borderRadius: '0'
//   },
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
  price: {
    fontSize: '1.5em',
    textAlign: 'right'
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
    marginBottom: '5vh'
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
    // marginLeft: theme.spacing(2),
    // marginRight: theme.spacing(2),
    width: '100%',
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
  leftMenuUl: {
    listStyle: 'none',
    paddingTop: '15px',
    paddingBottom: '15px',
    borderRight: '1px solid',
    paddingLeft: '0',
  },
  leftMenuLi: {
    margin: '0',
    padding: '10px',
    '&:hover': {
      borderLeft: '3px solid rgb(163, 201, 84)',
      cursor: 'pointer',
    },
  },
  leftMenuLiGreen: {
    margin: '0',
    padding: '10px',
    backgroundColor: 'green',
    '&:hover': {
      borderLeft: '3px solid rgb(163, 201, 84)',
      cursor: 'pointer',
    },
  },
  leftMenuLiRed: {
    margin: '0',
    padding: '10px',
    backgroundColor: 'red',
    '&:hover': {
      borderLeft: '3px solid rgb(163, 201, 84)',
      cursor: 'pointer',
    },
  },

  leftMenuLi2: {
    //borderTop: '1px solid',
    //color: 'white',
    borderRadius: '5px',
    border: '3px solid rgba(42,46,113,255)',
    margin: '0',
    padding: '10px',
  },
  leftMenuLi3: {
    margin: '0',
    padding: '10px',
  },
  leftMenuText: {
    fontWeight: '600',
    fontStyle: 'italic',
  },
  toggleButton: {
    textTransform: 'none',
    color: 'rgba(42,46,113,255)',
    "&.Mui-selected": {
      backgroundColor: 'rgba(42,46,113,255)',
      color: 'white'
    }
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
  MuiOutlinedInput: {
   'input': {
       borderRadius:'4px'
   }
  },
 

}
export default formStyle