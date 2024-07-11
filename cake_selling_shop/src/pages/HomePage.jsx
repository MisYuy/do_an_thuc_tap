import React, { useEffect, useRef } from 'react';
import Spinner from '../components/Spinner.jsx';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar.jsx';
import CopyRight from '../components/CopyRight.jsx';
import BackToTop from '../components/BackToTop.jsx';
import Search from '../components/Search.jsx';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

const HomePage = () => {
    return (
        <div>
            <Spinner />
            <Navbar />
            <Search />
            
            <Footer />
            <CopyRight />
            <BackToTop />
        </div>
    );
};

export default HomePage;