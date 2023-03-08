import React from 'react';
import ReactDOM from "react-dom/client";
import './index_style.css';
import './index_style_data.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CookiesProvider } from 'react-cookie';

const container = document.getElementById('root');

// Create a root.
const root = ReactDOM.createRoot(container);
root.render(
    <CookiesProvider>
        <App />
    </CookiesProvider>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
