import React from 'react';
import Spinner from '../components/Spinner.jsx';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar.jsx';
import CopyRight from '../components/CopyRight.jsx';
import BackToTop from '../components/BackToTop.jsx';
import Search from '../components/Search.jsx';
import HeaderSection from '../components/contact_components/HeaderSecton.jsx';
import ContentSection from '../components/contact_components/ContentSection.jsx';
import './style.css';
import OrderListSection from '../components/OrderListSection.jsx';
import { Nav_Item } from '../utils/constant.js';

const OrderListPage = () => {
    return (
        <div>
            <Spinner />
            <Navbar select={ Nav_Item.ORDER }/>
            <Search />
            
            <OrderListSection />

            <Footer />
            <CopyRight />
            <BackToTop />
        </div>
    );
};

export default OrderListPage;