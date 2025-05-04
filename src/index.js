import React from 'react';
import ReactDOM from 'react-dom/client';
import { AnimationProvider } from './contexts/AnimationContext';
import App from './App';
import 'antd/dist/reset.css';
import './index.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( 
    <AnimationProvider>
        <App />
    </AnimationProvider>
);
