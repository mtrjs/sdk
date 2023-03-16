import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import Monitor, { Browser } from '../monitor';

new Monitor({
  appId: '',
  plugins: [new Browser()],
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
