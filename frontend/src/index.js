import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css';
import { BrowserRouter as Router } from "react-router-dom";
import AuthProvider from './components/auth/AuthProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <AuthProvider>
      <Router>
         <App />
      </Router>
   </AuthProvider>
);

