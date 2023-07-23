import React, { useEffect, useState } from 'react';
// import {useParams} from 'react-router-dom';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { getLifeQuoteByClient } from '../../../../redux/actions/lifeQuoteAction';
//core component
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, IconButton } from '@material-ui/core'

//component
import { amountFormat } from '../../../../controllers/dataFormat';
import Button from '../../../../components/common/CustomButtons/Button'
// import { LanguageContext } from '../../../../components/common/LanguageProvider';
// import { Text } from '../../../../components/common/LanguageProvider';
//icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';
// import CreditScoreIcon from '@mui/icons-material/CreditScore';
// import EditIcon from '@mui/icons-material/Edit';

//style
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';

const useStyles = makeStyles(dashboardStyles)


export default function ClientLifeInsurance({user}) { 

  const dispatch = useDispatch();
  const quotes = useSelector(state => state.lifeQuoteReducer.quotes)
  
  // const { user_id } = useParams();

  //Redux
  useEffect(() => {
    dispatch(getLifeQuoteByClient(user))
    }, [dispatch, user]);

  // criteria
  // const [criteriaData, setCriteriaData] = useState({
  //   fromDate: '2022-01-01',
  //   toDate: new Date().toISOString().replace('T', ' ').substr(0, 10),
  // })

  const [isShown, setIsShown] = useState(false)
  

  // Mobile Design
  // const [width, setWidth] = useState(window.innerWidth);
  //   function handleWindowSizeChange() {
  //       setWidth(window.innerWidth);
  //   }
  //   useEffect(() => {
  //   window.addEventListener('resize', handleWindowSizeChange);
  //     return () => {
  //         window.removeEventListener('resize', handleWindowSizeChange);
  //     }
  //   }, []);

  // let isMobile = (width < 768);

  // console.log(quotes)

  const classes = useStyles();

  return (
    <Grid container>
      <Grid item container style={{ margin:'5vh 5vh 4vh' }}>
        <Typography className={classes.dashboardPageTitle}>
          {/* <Text tid={'Vendor.StartApplication'} /> */}
          My Life Insurance
        </Typography>
      </Grid>
      <Grid item container style={{ margin:'0 5vh 2vh' }}>
        <Typography className={classes.dashboardPageSubTitle}>
          {/* <Text tid={'Vendor.StartApplication'} /> */}
          Current
        </Typography>
      </Grid>

      {/* Active Insurance List */}
      {quotes.map(row => (
        <Grid item container key={row.confirmationNo} className={classes.productBox} style={{ margin:'0 5vh 2vh' }} >

          {/* Insurance summary row */}
          <Grid item container style={{ paddingBottom: !isShown ? '1vh' : '0' }}>
            <Grid item lg={6}>
              <span className={classes.inputValue}>{row.productTypeDesc}</span><br/>
              
              {/* See more detail button */}
              <IconButton aria-label="view" color="primary" 
                  style={{ borderRadius:'0', padding:'5px 15px 5px 10px', marginTop:'15px', background:'#f7f7f7' }}
                  onClick={() => setIsShown(!isShown)}
              >
              {!isShown ?     
                  <ExpandMoreIcon />
                  :<ExpandLessIcon/>
              }
              <Typography variant="body2"  style={{ fontSize:'12px', fontWeight: '500'  }}>
                  {/* <Text tid={'TravelApplication.Product.SummaryDetail'}/> */}
                  See more detail
              </Typography>
              </IconButton>

            </Grid>

            <Grid item lg={2}>
              <label className={classes.productLable}>Insured Name</label>
              <span className={classes.inputValue}>{row.firstName} {row.lastName}</span>
            </Grid>
            <Grid item lg={2}>
              <label className={classes.productLable}>Policy Number</label>
              <span className={classes.inputValue}>123456789</span>
            </Grid>
         
            <Grid item lg={2} style={{ textAlign:'right', alignSelf:'center' }}>
                <Button
                    color={'primary'}
                    onClick={() => { 
                      // console.log('clicked')
                      // setApplicaionStatus()
                    }}
                >
                    Button
                </Button>
            </Grid>
          </Grid>

          {/* Insurance Detail info row */}
          {isShown ? 
            <Grid item container style={{ padding:'2vh 3vh', background:'#f7f7f7', borderRadius:'0 5px 5px 5px'}}>
              <Grid item lg={2}>
                <label className={classes.productLable}>Sum Insured</label>
                <span className={classes.inputValue}>{amountFormat(row.benefitAmount, 0)}</span>
              </Grid>
              
              <Grid item lg={2}>
                <label className={classes.productLable}>Payment</label>
                <span className={classes.inputValue}>{row.productKind}</span>
              </Grid> 
              <Grid item lg={2}>
                <label className={classes.productLable}>Gender</label>
                <span className={classes.inputValue}>{row.gender}</span>
              </Grid> 
              <Grid item lg={2}>
                <label className={classes.productLable}>Health Status</label>
                <span className={classes.inputValue}>{row.healthStatus}</span>
              </Grid> 
              <Grid item lg={2}>
                <label className={classes.productLable}>Smoke Status</label>
                <span className={classes.inputValue}>{ row.smokeStatus === 'true' ? 'Yes' : 'No' }</span>
              </Grid>  
          </Grid>
        :null}

          

        </Grid>
      ))}

    </Grid>
  )
}
