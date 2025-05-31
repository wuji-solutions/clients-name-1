import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Configurations from './pages/Configurations';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path='/' element={ <Home /> }/>
                <Route path='/konfiguracja' element={ <Configurations /> } />
            </Routes>
        </Router>
    </React.StrictMode>
);

