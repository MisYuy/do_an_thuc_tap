import React from 'react';
import Spinner from '../components/Spinner.jsx';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar.jsx';
import CopyRight from '../components/CopyRight.jsx';
import BackToTop from '../components/BackToTop.jsx';
import Search from '../components/Search.jsx';
import HeaderSection from '../components/cart_components/HeaderSecton.jsx';
import ContentSection from '../components/cart_components/ContentSection.jsx';
import './style.css';

const CartPage = () => {
    return (
        <div>
            <Spinner />
            <Navbar />
            <Search />
            
            <HeaderSection />
            <ContentSection />

            <Footer />
            <CopyRight />
            <BackToTop />
        </div>
    );
};

export default CartPage;