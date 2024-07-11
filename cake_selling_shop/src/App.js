import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/error" element={<ErrorPage />} />
          </Routes>
    </Router>
  );
}

export default App;