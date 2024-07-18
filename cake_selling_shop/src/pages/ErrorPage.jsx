import React from 'react';
import Spinner from '../components/Spinner.jsx';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar.jsx';
import CopyRight from '../components/CopyRight.jsx';
import BackToTop from '../components/BackToTop.jsx';
import Search from '../components/Search.jsx';
import HeaderSection from '../components/error_components/HeaderSection.jsx';
import ContentSection from '../components/error_components/ContentSection.jsx';
import './style.css';

const ErrorPage = () => {
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

export default ErrorPage;
