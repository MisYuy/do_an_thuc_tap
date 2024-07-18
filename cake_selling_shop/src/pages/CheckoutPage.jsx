import React from 'react';
import Spinner from '../components/Spinner.jsx';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar.jsx';
import CopyRight from '../components/CopyRight.jsx';
import BackToTop from '../components/BackToTop.jsx';
import Search from '../components/Search.jsx';
import HeaderSection from '../components/checkout_components/HeaderSecton.jsx';
import ContentSection from '../components/checkout_components/ContentSection.jsx';
import './style.css';

const CheckoutPage = () => {
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

export default CheckoutPage;