import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import Reporter, { Browser } from '@tubefast/core';

const reporter = new Reporter();
reporter.init({
  appId: 'test',
  dsn: 'http://172.16.10.88:3001',
  plugins: [new Browser()],
  maxPool: 10,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
