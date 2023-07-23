import React from 'react'
// import ReactDOM from 'react-dom'
import { render, hydrate } from 'react-dom';
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import store from './redux/store'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async';

const element = (
  <Provider store={store}>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>      
    </HelmetProvider>
  </Provider>
);

const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
  hydrate(element, rootElement
  );
} else {
  render(element, rootElement);
}


// render(
//   <Provider store={store}>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </Provider>,
//   document.getElementById('root')
// )

