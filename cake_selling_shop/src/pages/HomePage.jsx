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
import SixSection from '../components/home_components/SixthSection.jsx';
import SevenSection from '../components/home_components/SevenSection.jsx';
import EighthSection from '../components/home_components/EighthSection.jsx';
import NinthSection from '../components/home_components/NinthSection.jsx';
import { Nav_Item } from '../utils/constant.js';

const HomePage = () => {
    return (
        <div>
            <Spinner />
            <Navbar select={ Nav_Item.HOME } />
            <Search />
            
            <FirstSection/>
            <SecondSection />
            <ThirdSection />
            <FourthSection />
            <FifthSection />
            <SixSection />
            <SevenSection />
            <EighthSection />
            <NinthSection />

            <Footer />
            <CopyRight />
            <BackToTop />
        </div>
    );
};

export default HomePage;