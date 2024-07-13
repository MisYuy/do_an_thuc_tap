import React, { useEffect, useState } from 'react';
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

import axios from 'axios';

const HomePage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://127.0.0.1:3500/api/test')
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
            <Navbar />
            <Search />
            
            <FirstSection />
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

            <div>
                <h2>Data from API:</h2>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        </div>
    );
};

export default HomePage;