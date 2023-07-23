import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  root: {
  
    maxWidth: '1000px',
    margin: '2em 2em 0 2em',
    // background: "#f5f5f5",
    border: '1px solid #f5f5f5',
    '& span': {
      display: 'block',
      fontSize: '0.8rem',
    },
    '& h4': {
      fontSize: '1.1rem',
      fontWeight: '600',
    },
  
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
    border: "1px solid #222",
 
  },
  labelStyle: {
    background: "#f5f5f5",
  },
  labelTitle: {
    color: "#272A31",
    fontWeight: "600",
    textTransform: 'none',
    margin: 'auto'
  
  }
 
}))

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} >
          <div key={index}>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



export default function SimpleTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const { tabs } = props

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
   
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange}  className={classes.labelStyle}  aria-label="simple tabs example">
        {tabs.map((item, index) => (
          <Tab key={index} label={item.label} className={classes.labelTitle} {...a11yProps(item.id)} />
        ))}
        </Tabs>
      </AppBar>
        {tabs.map((item, index) => (
          <TabPanel key={index} value={value} index={item.id} >
            {item.value}
          </TabPanel>
          ))}
    </div>

  );
}
