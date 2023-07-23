import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
// import Container from '@material-ui/core/Container';
import { Text } from '../../../components/common/LanguageProvider'

import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '3rem',
    maxWidth: '1000px',
  
    '& span': {
      display: 'block',
    },
    // flexGrow: 1,
    // width: '100%',
    // backgroundColor: theme.palette.background.paper,
  },
  title: {
    fontSize: '1.2rem',
    color: '#222',
    fontWeight: '600'
  },
  detail: {
    margin: '0.5rem',
    fontSize: '0.9em'
  },
  list: {
    marginLeft: '8px',
    '&::before': {
      content: "'•'",
      marginRight: '8px',
    },
    fontSize: '0.9em'
  },
  boxWrapper: {
    border: "1px solid #222"
  },
  labelStyle: {
    textTransform: 'none'
  }
  // paper: {
  //   padding: theme.spacing(1),
  //   textAlign: 'center',
  //   color: theme.palette.text.secondary,
  // },
  // description: {
  //   textAlign: 'left',
  //   margin: theme.spacing(1),
  // },
  // subtitle: {
  //   marginTop: '2vh',
  //   marginBottom: '5vh',
  //   lineHeight: '1.4',
  // },
}))

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
   
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box style={{border:"1px solid #f5f5f5"}} p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export default function Types() {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const tabTerm = (
    <>
      <span className={classes.title}>
        <Text tid={'LifeInsurance.Type.term.what'} />
      </span>
      <span className={classes.detail}>
        <Text tid={'LifeInsurance.Type.term.what.detail'} />
      </span>
      <span className={classes.list}>
        <Text tid={'LifeInsurance.Type.term.what.list.benefit'} />
      </span>
      <span className={classes.list}>
        <Text tid={'LifeInsurance.Type.term.what.list.protection'} />
      </span>
      <span className={classes.list}>
        <Text tid={'LifeInsurance.Type.term.what.list.taxfree'} />
      </span>
      <br />
      <span className={classes.title}>
        <Text tid={'LifeInsurance.Type.term.whenNeed'} />
      </span>
      <span className={classes.detail}>
        <Text tid={'LifeInsurance.Type.term.whenNeed.detail'} />
      </span>
      <span className={classes.list}>
        <Text tid={`LifeInsurance.Type.term.whenNeed.list.startFamily`} />
      </span>
      <span className={classes.list}>
        <Text tid={`LifeInsurance.Type.term.whenNeed.list.buyHome`} />
      </span>
      <span className={classes.list}>
        <Text tid={`LifeInsurance.Type.term.whenNeed.list.plan`} />
      </span>
      <span className={classes.list}>
        <Text tid={`LifeInsurance.Type.term.whenNeed.list.businessOwner`} />
      </span>
      <span className={classes.list}>
        <Text tid={`LifeInsurance.Type.term.whenNeed.list.newCananda`} />
      </span>
      <br />
      <span className={classes.title}>
        <Text tid={`LifeInsurance.Type.term.right`} />
      </span>
      <span className={classes.detail}>
        <Text tid={`LifeInsurance.Type.term.right.detail`} />
      </span>
      <span className={classes.list}>
        <Text tid={`LifeInsurance.Type.term.right.list.benefit`} />
      </span>
      <span className={classes.list}>
        <Text tid={`LifeInsurance.Type.term.right.list.protection`} />
      </span>
      <span className={classes.list}>
        <Text tid={`LifeInsurance.Type.term.right.list.businessOwner`} />
      </span>
    </>
  )
  const tabWhole = (
    <>
      <span className={classes.title}>
        <Text tid={'LifeInsurance.Type.whole.what'} />
      </span>
      <span className={classes.detail}>
        <Text tid={'LifeInsurance.Type.whole.what.detail'} />
      </span>
      <span className={classes.list}>
        <Text tid={'LifeInsurance.Type.whole.what.list.lastLifetime'} />
      </span>
      <span className={classes.list}>
        <Text tid={'LifeInsurance.Type.whole.what.list.savingCash'} />
      </span>
      <span className={classes.list}>
        <Text tid={'LifeInsurance.Type.whole.what.list.deathBenefit'} />
      </span>
      <span className={classes.list}>
        <Text tid={'LifeInsurance.Type.whole.what.list.taxfree'} />
      </span>
      <br />
      <span className={classes.title}>
        <Text tid={'LifeInsurance.Type.whole.whenNeed'} />
      </span>
      <span className={classes.detail}>
        <Text tid={'LifeInsurance.Type.whole.whenNeed.detail'} />
      </span>
      <span className={classes.list}>
        <Text tid={`LifeInsurance.Type.whole.whenNeed.list.longProtection`} />
      </span>
      <span className={classes.list}>
        <Text tid={`LifeInsurance.Type.whole.whenNeed.list.businessOwner`} />
      </span>
      <span className={classes.list}>
        <Text tid={`LifeInsurance.Type.whole.whenNeed.list.familyLongitivity`} />
      </span>
      <span className={classes.list}>
        <Text tid={`LifeInsurance.Type.whole.whenNeed.list.protectAsset`} />
      </span>
      <br />
    </>
  )
  const tabUniversial = (
    <>
      <span className={classes.title}>
        <Text tid={'LifeInsurance.Type.universal.what'} />
      </span>
      <span className={classes.detail}>
        <Text tid={'LifeInsurance.Type.universal.what.detail'} />
      </span>

      <br />
    </>
  )
  return (
    <>
      <Grid container maxWidth="lg" className={classes.root}>
        <AppBar position="static" color="default" elevation={0} >
          <Tabs
            value={value}
            onChange={handleChange}
            //indicatorColor="primary"
            //textColor="primary"
            variant="fullWidth"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          
          >
            <Tab
              label={<Text tid={`LifeInsurance.Type.tab.term`} />}
              {...a11yProps(0)}
              className={classes.labelStyle}
            />
            <Tab
              label={<Text tid={`LifeInsurance.Type.tab.whole`} />}
              {...a11yProps(1)}
              className={classes.labelStyle}
            />
            <Tab
              label={<Text tid={`LifeInsurance.Type.tab.universal`} />}
              {...a11yProps(2)}
              className={classes.labelStyle}
            />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          {tabTerm}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {tabWhole}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {tabUniversial}
        </TabPanel>
      </Grid>
    </>
  )
}
