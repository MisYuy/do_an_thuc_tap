import React,  { useEffect, useState } from 'react';
import Spinner from '../components/Spinner.jsx';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar.jsx';
import CopyRight from '../components/CopyRight.jsx';
import BackToTop from '../components/BackToTop.jsx';
import Search from '../components/Search.jsx';
import HeaderSection from '../components/product_components/HeaderSection.jsx';
import ContentSection from '../components/product_components/ContentSection.jsx';

import axios from 'axios';
import { Nav_Item } from '../utils/constant.js';
import { URL } from '../utils/constant.js';

import './style.css';

const ProductsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${URL}/api/product/get-all`)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }


    return (
        <div>
            <Spinner />
            <Navbar select={ Nav_Item.PRODUCTS }/>
            <Search />
            
            <HeaderSection />
            <ContentSection products={data} />

            <Footer />
            <CopyRight />
            <BackToTop />
        </div>
    );
};

export default ProductsPage;