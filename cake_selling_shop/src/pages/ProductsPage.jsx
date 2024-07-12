import React from 'react';
import Spinner from '../components/Spinner.jsx';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar.jsx';
import CopyRight from '../components/CopyRight.jsx';
import BackToTop from '../components/BackToTop.jsx';
import Search from '../components/Search.jsx';
import HeaderSection from '../components/product_components/HeaderSection';
import ContentSection from '../components/product_components/ContentSection';

const ProductsPage = () => {
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

export default ProductsPage;