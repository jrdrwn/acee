import TimeAgo from 'javascript-time-ago';
import id from 'javascript-time-ago/locale/id.json';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

TimeAgo.addDefaultLocale(id);
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
