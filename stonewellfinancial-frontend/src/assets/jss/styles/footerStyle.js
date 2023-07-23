import { theme } from '../theme'
// import AngleDownIcon from '../../../assets/imgs/icons/angle-down.svg'

const footerStyle = {
  root: {
    width: '100%',
    // padding: '0 0 40px',
    fontSize: '14px',
    backgroundColor: '#f9f9f9',
    color: '#3c3c3c',
    position: 'relative',
    '& a': {
      color: '#2c2c2c',
    },
  },
  wrapper: {
    width: '100%',
    maxWidth: 1280,
    paddingLeft: 25,
    paddingRight: 25,
    marginLeft: 'auto',
    marginRight: 'auto',
    '&::before': {
      transition: 'none .4s cubic-bezier(.19,1,.22,1)',
    },
    '&::after': {
      transition: 'none .4s cubic-bezier(.19,1,.22,1)',
    },
  },
  d_none_lg: {
    marginLeft: 140,
  
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },

  d_none_sm: {
    marginLeft: 2,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  primaryNav: {
    marginTop: 0,
    height: '100%',
    maxHeight: 48,
    borderTop: '1px solid #c1c1c1',
    overflow: 'hidden',
    transition: 'max-height .25s ease-out',
    display: 'block',
  },
  isOpened: {
    maxHeight: 178,
  },
  d_none_md: {
    display: 'block',
    [theme.breakpoints.down(760)]: {
      display: 'none',
    },
  },
  primaryNavBorderTop: {
    height: 47,
    borderBottom: '1px solid #c1c1c1',
  },
  primaryNavBorderBottom: {
    height: 130,
    borderBottom: '1px solid #c1c1c1',
  },
  primaryNav_List: {
    padding: 0,
    margin: 0,
    listStyle: 'none',
  },
  primaryNav_ListCol: {
    float: 'left',
    width: '25%',
    borderRight: 'none',
    
    marginBottom: 25,
    '&:nth-child(1)': {
      borderLeft: '1px solid #c1c1c1',
    },
   
  },
  primaryNav_ListCol_Title: {
    cursor: 'pointer',
    display: 'block',
    height: '46px',
    padding: '0 20px',
    borderRight: '1px solid #c1c1c1',
    color: '#333',
    lineHeight: '46px',
    fontSize: '14px',
    fontWeight: '500',
    background: 'AngleDownIcon',
    backgroundPosition: 'right center',
    backgroundRepeat: 'no-repeat',
   
    
  },
  primaryNav_ListCol_Item: {
    height: 130,
    paddingTop: 1,
    padding: '0 20px',
    borderRight: '1px solid #c1c1c1',
    '& li': {
      listStyle: 'none',
      textAlign: 'left',
      // padding: '0 8px',
      margin: '15px 0',
    },
  },
  secondaryNav: {
    //boxSizing: "border-box",
    '&::before': {
      transition: 'none .4s cubic-bezier(.19,1,.22,1)',
    },
    '&::after': {
      transition: 'none .4s cubic-bezier(.19,1,.22,1)',
    },
  },
  secondarysNav_List: {
    listStyle: 'none',
    margin: '30px -15px 0',
    padding: '0 20px',
    fontSize: '12px',
  },
  secondaryNav_ListItem: {
    padding: '5px 15px 0',
    display: 'inline-block',
  },
  resourcesNav_List: {
    listStyle: 'none',
    // margin: '30px -15px 0',
    padding: '0 20px',
    margin: '10px -15px 0',
    fontSize: '12px',
  },
  resourcesNav_ListItem: {
    padding: '5px 15px 0',
    display: 'inline-block',
  },
  footerSmall: {
    marginTop: 10,
    paddingTop: 10,
    display: 'block',
    boxSizing: 'border-box',
    transition: 'none .4s cubic-bezier(.19,1,.22,1)',
    [theme.breakpoints.down('sm')]: {
      paddingTop: 30,
      marginTop: 0,
    },
  },
  footerSmall_layout: {
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItem: 'center',
      justifyContent: 'center',
    },
  },
  footerSmall_list: {
    listStyle: 'none',
    paddingLeft: '10px',
    marginTop:'2vh',
    '& li': {
      margin: '5px 0',
    },
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  footerSmall_list_ItemTitle: {
    // fontWeight: 'bold',
    fontSize: '0.9rem',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      fontSize:'0.7rem'
    },
  },
  footerSmall_SocailList: {
    display: 'flex',
 
    // justifyContent: 'center',
    alignItems: 'center',
    '& img': {
      marginRight: 10,
      height: 60,
      [theme.breakpoints.down('sm')]: {
        height:40,
      }
    
    },
    [theme.breakpoints.down('sm')]: {
      // display: 'flex',
      justifyContent: 'center',
      // alignItems: 'center',
    },
  },
  footerSmall_Sociallist_Link: {
    paddingLeft: 0,
    textAlign:'right',
    '& a': {
      marginRight: 10,
      fontSize:'20px',
      color:'#2a2f71',

    },
    
  },
  footerCopyright: {
    textAlign: 'right',
    color:'#222',
    fontStyle: 'italic',
    marginTop:'2vh',
    marginBottom:'-2vh',
    paddingLeft:'10px',
    paddingTop:'15px',
    borderTop:'1px solid #c1c1c1',
    [theme.breakpoints.down('xs')]: {
      textAlign: 'left',
    },
  },
  footerSmall_list_ItemTel: {
    '&::before': {
      content: '" | "',
    },
    '&::after': {
      content: '" | "',
    },
  },
  // '&::before': {
  //   content: '"some content"',
  //   display: 'block',
  //   height: 60,
  //   marginTop: -60
  // }
}
export default footerStyle
