import React from 'react';

import Spinner from '../components/Spinner.jsx';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar.jsx';
import CopyRight from '../components/CopyRight.jsx';
import BackToTop from '../components/BackToTop.jsx';
import Search from '../components/Search.jsx';
import HeaderSection from '../components/product_detail_components/HeaderSecton.jsx';
import ContentSection from '../components/product_detail_components/ContentSection.jsx';
import { Nav_Item } from '../utils/constant.js';
import './style.css';
import ProfileSection from '../components/ProfileSection.jsx';

const ProfilePage = () => {
    return (
        <div>
            <Spinner />
            <Navbar />
            <Search />
            
            <ProfileSection />

            <Footer />
            <CopyRight />
            <BackToTop />
        </div>
    );
};

export default ProfilePage;