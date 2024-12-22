import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './assets/styles/MdxStyle.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter as Router } from 'react-router-dom';
import {Provider} from 'react-redux'
import store from './redux/store';
import { JssProvider, createGenerateId } from 'react-jss';

// const generateId = createGenerateId({ minify: true });

const generateId = (rule, sheet) => {
  const prefix = 'tdn-';
  const sheetName = sheet && sheet.options.classNamePrefix 
    ? sheet.options.classNamePrefix.replace(/[^a-zA-Z0-9-]/g, '') // Sanitize sheet name
    : 'global';
  return `${prefix}${sheetName}${rule.key}`;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <JssProvider generateId={generateId}>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </JssProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
