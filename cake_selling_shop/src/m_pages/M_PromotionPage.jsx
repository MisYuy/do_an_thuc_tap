import React from 'react';
import './style1.css';
import M_LeftSection from '../m_components/M_LeftSection.jsx';
import M_HeaderSection from '../m_components/M_HeaderSection.jsx';
import M_ProductSection from '../m_components/M_ProductSection.jsx';
import M_PromotionSection from '../m_components/M_PromotionSection.jsx';

const M_PromotionPage = () => {
    return (
        <div>
            <M_LeftSection select={'promotion'}/>
            {/* Right Panel */}
            <div id="right-panel" className="right-panel">
            {/* Header*/}
            <M_HeaderSection />
            {/* /#header */}
            <M_PromotionSection />
            </div>
        </div>
    );
};

export default M_PromotionPage;
