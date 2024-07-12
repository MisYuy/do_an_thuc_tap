import React from 'react';
import Spinner from '../components/Spinner.jsx';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar.jsx';
import CopyRight from '../components/CopyRight.jsx';
import BackToTop from '../components/BackToTop.jsx';
import Search from '../components/Search.jsx';
import FirstSection from '../components/home_components/FirstSection.jsx';
import SecondSection from '../components/home_components/SecondSection.jsx';
import ThirdSection from '../components/home_components/ThirdSection.jsx';
import FourthSection from '../components/home_components/FourthSection.jsx';
import FifthSection from '../components/home_components/FifthSection.jsx';

const HomePage = () => {
    return (
        <div>
            <Spinner />
            <Navbar />
            <Search />
            
            <FirstSection />
            <SecondSection />
            <ThirdSection />
            <FourthSection />
            <FifthSection />

            <Footer />
            <CopyRight />
            <BackToTop />
        </div>
    );
};

export default HomePage;