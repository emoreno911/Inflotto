import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/index.js';
import reportWebVitals from './reportWebVitals';
import { MoralisProvider } from "react-moralis";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MoralisProvider 
      serverUrl="https://ysodfl3bklpf.usemoralis.com:2053/server" 
      appId="DL5kOfhKt9n4q5WLZES2z6pJdmkiZGBtwh4vqvRv"
    >
      <App />
    </MoralisProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
