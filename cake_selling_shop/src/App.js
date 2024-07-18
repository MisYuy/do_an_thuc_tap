import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import ContactPage from './pages/ContactPage';
import CheckoutPage from './pages/CheckoutPage';
import AuthenticatePage from './pages/AuthenticatePage';
import M_HomePage from './m_pages/M_HomePage';

function App() {
  return (
    <Router>
          <Routes>
            <Route path="/" element={<AuthenticatePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product-detail/:productId" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/test" element={<M_HomePage />} />
          </Routes>
    </Router>
  );
}

export default App;