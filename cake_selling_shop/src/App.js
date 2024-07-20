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
import M_AccountsPage from './m_pages/M_AccountsPage';
import M_ProductPage from './m_pages/M_ProductPage';

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

            <Route path="/m/account" element={<M_AccountsPage />} />
            <Route path="/m/product" element={<M_ProductPage />} />
          </Routes>
    </Router>
  );
}

export default App;