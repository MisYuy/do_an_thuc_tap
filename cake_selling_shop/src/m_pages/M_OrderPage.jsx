import React from 'react';
import './style1.css';
import M_LeftSection from '../m_components/M_LeftSection.jsx';
import M_HeaderSection from '../m_components/M_HeaderSection.jsx';
import M_ProductSection from '../m_components/M_ProductSection.jsx';
import M_OrderSection from '../m_components/M_OrderSection.jsx';

const M_OrderPage = () => {
    return (
        <div>
            <M_LeftSection select={'order'}/>
            {/* Right Panel */}
            <div id="right-panel" className="right-panel">
            {/* Header*/}
            <M_HeaderSection />
            {/* /#header */}
            <M_OrderSection />
            </div>
        </div>
    );
};

export default M_OrderPage;
