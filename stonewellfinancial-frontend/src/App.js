import React, { useEffect } from 'react'
import {
  Switch,
  Route,
  // useHistory,
} from 'react-router-dom'
// import { MuiThemeProvider } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import { LanguageProvider } from './components/common/LanguageProvider'
import { theme } from './assets/jss/theme'
import SalesIQ from './ZohoSalesIQ'

// CSS
// import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
// Pages
import { PublicLayout } from './views/layouts/main/PublicLayout'
import { PrivateLayout } from './views/layouts/main/PrivateLayout'

// Google Analytics Connections
import ReactGA from 'react-ga';

// Google Tag 
import TagManager from 'react-gtm-module';

// Google Analytics
const TRACKING_ID = "UA-227055262-1";
ReactGA.initialize(TRACKING_ID);

const tagManagerArgs = { gtmId: 'GTM-TJ35SXP' };


export default function App() {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
    TagManager.initialize(tagManagerArgs);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'Request quote'
    });
  }, []);

  return (  
      <ThemeProvider theme={theme}>
        {process.env.NODE_ENV === 'production' && <SalesIQ/>}
        <LanguageProvider>
          <Switch>
            <Route path="/myportal" component={PrivateLayout} />
            <Route path="/" component={PublicLayout} />
          </Switch>
        </LanguageProvider>
      </ThemeProvider>
  );
}