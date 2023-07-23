import React, { useState, useEffect, useRef, useContext } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
// import Button from '../../../components/common/CustomButtons/Button'
import { Button, Grid } from '@material-ui/core'
// import { MdExpandMore } from 'react-icons/md'
// import logo from '../../../assets/imgs/logo-transparent.png'
import { Text, LanguageContext} from '../../../components/common/LanguageProvider'
//styles
import footerStyle from '../../../assets/jss/styles/footerStyle'
//icons
import AngleDownIcon from '../../../assets/imgs/icons/angle-down.svg'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import Katalk from '../../../assets/imgs/icons/katalk.svg'

// import Hidden from '@material-ui/core/Hidden'

const useStyles = makeStyles(footerStyle)
const primaryMenus = [
  {
    title: 'Life Insurance',
    children: [
      { name: 'Term', url: '/life-insurance' },
      { name: 'Whole Life', url: '/life-insurance' },
      { name: 'Universal Life', url: '/life-insurance' },
    ],
  },
  {
    title: 'Health Insurance',
    children: [
      { name: 'Critical Illness', url: '/health-insurance' },
      { name: 'Disability', url: '/health-insurance' },
      { name: 'Personal Health', url: '/health-insurance' },
    ],
  },
  {
    title: 'Travel Insurance',
    children: [
      { name: 'Student and Companion', url: '/travel-insurance/student' },
      { name: 'Visitor to Canada', url: '/travel-insurance/visitor' },
      { name: 'Canadian Travel', url: '/travel-insurance/canadian-traveller' },
    ],
  },
  {
    title: 'Group Benefits',
    children: [
      { name: 'Small Group', url: '/group-benefits' },
      { name: 'Large Group', url: '/group-benefits' },
      { name: 'HSA', url: '/hsa' },
    ],
  },
  // {
  //   title: 'Resources',
  //   children: [
  //     { name: 'Download Forms', url: '/insurance/download' },
  //     { name: 'FAQ', url: '/insurance/faq' },
  //     { name: 'Clinic Finder', url: '/insurance/clinic-finder' },
  //   ],
  // },
]
const secondaryMenus = [
  {
    name: 'About Us',
    url: '/about-us',
  },
  {
    name: 'Privacy Policy',
    url: '/',
  },
  // {
  //   name: 'Blog',
  //   url: '/blog',
  // },
  // {
  //   name: 'Application',
  //   url: '/insurance/application',
  // },
  // {
  //   name: 'Claim',
  //   url: '/insurance/claim',
  // },
  // {
  //   name: 'Refund',
  //   url: '/insurance/refund',
  // },
]
// const resourcesMenus = [
//   {
//     name: 'Download Forms',
//     url: '/insurance/download',
//   },
//   {
//     name: 'FAQ',
//     url: '/insurance/faq',
//   },
//   {
//     name: 'Clinic Finder',
//     url: '/insurance/clinic-finder',
//   },
// ]
export default function Footer(props) {
  const classes = useStyles()
  const thisYear = new Date().getFullYear()
  const [isOpened, setIsOpened] = useState(false)

  //current language
  const currentLanguage = useContext(LanguageContext).userLanguage

   //Responsive Design
   const [width, setWidth] = useState(window.innerWidth);
   function handleWindowSizeChange() {
     setWidth(window.innerWidth);
   }
 
   useEffect(() => {
     window.addEventListener('resize', handleWindowSizeChange);
     return () => {
         window.removeEventListener('resize', handleWindowSizeChange);
     }
   }, []);
 
   let isMobile = (width <= 768);
   const isQuoteUrl =  (props.location.pathname.split(/[.-_]/)).filter(f=>f === 'quote' || f ==='application').length > 0

   //scroll
   const scrollRef = useRef(null);
   const scrollToElement = () => scrollRef.current.scrollIntoView();

   const [isShown, setIsShown] = useState(false) 


  return (
    <>
    {isQuoteUrl === true && isMobile ?
      <Button 
        style={{ display:'block', width:'100%', background:'#efefef', textTransform:'capitalize'}} 
        onClick={() => {
          setIsShown(!isShown); 
          scrollToElement();
        }}
      >
           <Text tid={'footer.howToContact'} />
          { !isShown ? <ExpandMore style={{marginLeft:'5px', color:'#2a2f71'}} /> : <ExpandLess style={{marginLeft:'5px', color:'#2a2f71'}} /> }
          
      </Button>
    : null }

    {/* Katalk chat icon if lang is Korean */}
    {currentLanguage === 'ko' ?
      <div style={{ position:'fixed', bottom: isMobile ? '40px':'70px', right: isMobile ? '5px' :'18px', width: isMobile ? '35px': '48px' }}>
        <a href="https://pf.kakao.com/_xfCGqxl/chat" target='blank'>
          <img
            src={Katalk}
            alt="Katalk-Icon"
            style={{ width:'100%' }}
          /> 
        </a>         
      </div>
    :null}

    <footer className={classes.root} ref={scrollRef}>
     {/* {isQuoteUrl === false || (isQuoteUrl === true && isShown && isMobile) || (isQuoteUrl === true && !isMobile)  */}
     {isQuoteUrl === false || (isQuoteUrl === true && isShown && isMobile) || (isQuoteUrl === true && !isMobile)
      ?
        <>   
          <nav>
            <div
              className={classNames(
                classes.primaryNav,
                isOpened ? classes.isOpened : null,
                classes.d_none_md
              )}
            >
              <div
                className={classes.primaryNavBorderTop}
                onClick={() => setIsOpened(!isOpened)}
              >
                <Grid container>
                <div className={classes.wrapper}>
                  <ul className={classes.primaryNav_List}>
                    {primaryMenus.map((el, index) => (
                    
                      <li className={classes.primaryNav_ListCol} key={index}>
                        <span className={classes.primaryNav_ListCol_Title}>
                          
                            <Text tid={el.title} />
                            <img
                              src={AngleDownIcon}
                              alt="Angle Down Icon"
                              style={{ marginLeft:'120px'}}
                            />
                        
                        </span>
                      
                        <ul className={classes.primaryNav_ListCol_Item}>
                          {el.children.map((child) => (
                            <li key={child.name}>
                              <Link to={child.url}>
                                <Text tid={child.name} />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                  
                    ))}
                  </ul>
                </div>
                </Grid>
              </div>
                
              <div className={classes.primaryNavBorderBottom}></div>
            </div>
        
          </nav>
          <div className={classes.wrapper}>
            <small className={classes.footerSmall}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={3} style={{ padding:'20px' }}>
                  {/* <ul className={classes.footerSmall_list}> */}
                    {/* <li className={classes.footerSmall_list_ItemTitle}>
                      Contact with us
                    </li> */}
              
                    {/* <li className={classes.footerSmall_SocailList}>
                      <img
                        alt={'Mobile logo'}
                        src={logo}
                        height="40"
                        className={classes.footerSmall__Sociallist_Logo}
                      />
                    </li> */}
                    {/* <li className={classes.footerSmall_list}>
                      <a href="mailto:info@stonewellfinancial.com">
                        info@stonewellfinancial.com
                      </a>
                    </li>
                    <li className={classes.footerSmall_list}>
                      <a href="tel:1-833-645-3858">Toll Free: +1 833 645 3858</a>
                    </li> */}
                  {/* </ul> */}
                  <h3 style={{ fontSize: isMobile ? "12px" : "1rem", fontWeight: isMobile ? "600" : "500"  }}>
                    <Link to={'/about-us'}>
                      <Text tid={'About Us'} />
                    </Link>
                  </h3>
                  <span>
                  <Text tid={'AboutUs.Subtitle'} />
                  </span>
                </Grid>
                <Grid item xs={12} md={3} style={{ padding: isMobile ? '3px 20px':'12px' }}>
              
                      <img
                        src="/imgs/icon/phone-call.svg"
                        alt="Phone"
                        style={{ width: isMobile ? '20px':'40px' }}
                      />
                      <a
                        className={classes.footerSmall_list_ItemTitle}
                        href="tel:1-416-645-3858"
                      >
                      &nbsp;&nbsp; +1 833 645 3858 
                      </a>
                  
                </Grid>
                <Grid item xs={12} md={3} style={{ padding: isMobile ? '3px 20px':'12px' }}>
                      <img
                        src="/imgs/icon/mail.svg"
                        alt="Email"
                        style={{ width: isMobile ? '20px':'40px' }}
                      />
                      <span className={classes.footerSmall_list_ItemTitle}>     
                      &nbsp;&nbsp; info@stonewellfinancial.com
                      </span>
                </Grid>
              
                <Grid item xs={12} md={3} style={{ padding: isMobile ? '3px 20px':'12px' }}></Grid>
                <Grid item xs={12} md={3} style={{ padding: isMobile ? '3px 20px':'12px' }}></Grid>
                <Grid item xs={12} md={3} style={{ padding: isMobile ? '3px 20px':'12px' }}>
                      <img
                        src="/imgs/icon/gps.svg"
                        alt="office"
                        style={{ marginTop: isMobile ? '-20px':'-40px', width: isMobile ? '20px':'40px' }}
                      />
                      
                      <div style={{ display:'inline-block'}}>
                        <p style={{ fontSize: isMobile ? '12px': '16px', marginBottom:'0', fontWeight:'600' }}>&nbsp; Ontario</p>
                        <p  style={{ display: 'inline-block', fontSize: isMobile ? '10px':'12px' }}>     
                        &nbsp;&nbsp; 4576 Yonge St #608 
                        { !isMobile ? <br/> : null } 
                        &nbsp;&nbsp; North York M2N 6N4 
                        </p>
                      </div>
                </Grid>
                <Grid item xs={12} md={3} style={{ padding: isMobile ? '3px 20px':'12px' }}>
                      <img
                        src="/imgs/icon/gps.svg"
                        alt="office"
                        style={{ marginTop: isMobile ? '-40px':'-60px', width: isMobile ? '20px':'40px' }}
                      />
                      
                      <div style={{ display:'inline-block'}}>
                        <p style={{ fontSize: isMobile ? '12px': '16px', marginBottom:'0', fontWeight:'600' }}>&nbsp; West Canada</p>
                        <p  style={{ display: 'inline-block',  fontSize: isMobile ? '10px':'12px' }}>      
                          &nbsp;&nbsp; * BC, AB, MB, SK <br/>   
                          &nbsp;&nbsp; 4170 Still Creek Drive #200 
                          { !isMobile ? <br/> : null } 
                          &nbsp;&nbsp; Burnaby BC V5C 6C6
                        </p>
                      </div>
                </Grid>
                <Grid item xs={12} md={3} style={{ padding: isMobile ? '3px 20px':'12px' }}>
                      <img
                        src="/imgs/icon/gps.svg"
                        alt="office"
                        style={{ marginTop: isMobile ? '-40px':'-60px', width: isMobile ? '20px':'40px' }}
                      />
                      
                      <div style={{ display:'inline-block'}}>
                        <p style={{ fontSize: isMobile ? '12px': '16px', marginBottom:'0', fontWeight:'600' }}>&nbsp; East Canada</p>
                        <p  style={{ display: 'inline-block', fontSize: isMobile ? '10px':'12px' }}> 
                        &nbsp;&nbsp; * QC, NS, NB, NL, PEI <br/>    
                        &nbsp;&nbsp; 1200 McGill College Ave #1100
                        { !isMobile ? <br/> : null } 
                        &nbsp;&nbsp; Montreal QC H3B 4G7
                        </p>
                      </div>
                </Grid>
              </Grid>
              <Grid item container style={{ borderTop:'1px solid #eee', marginTop:'2vh' , paddingTop:'1vh', paddingBottom: isMobile ? '1vh' : '0'}}>
                <Grid item xs={12} md={6}>
                  <span style={{ fontSize: isMobile ? '8px':'10px' }}>
                    Copyright @ {thisYear} &nbsp;
                    <Link to="/">Stonewell Financial Service Inc&nbsp;</Link>
                  </span>
                  <span style={{ fontSize: isMobile ? '8px':'10px' }}>All Right Reserved.</span>
                </Grid>
                { !isMobile ? 
                  <Grid item xs={12} md={6} style={{ textAlign:"right" }}>
                    <ul>
                        {secondaryMenus.map((el, index) => (
                          <li className={classes.secondaryNav_ListItem} key={index}>
                            <Link to={el.url}>
                              <Text tid={el.name} />
                            </Link>
                          </li>
                        ))}
                      </ul>
                  </Grid>
                : null }
              </Grid>
            </small>
          </div>
        </>
      :null}
       </footer>

  </>
  )
}
