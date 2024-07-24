import React from 'react';
import './style1.css';
import M_LeftSection from '../m_components/M_LeftSection.jsx';
import M_HeaderSection from '../m_components/M_HeaderSection.jsx';
import M_ProductSection from '../m_components/M_ProductSection.jsx';
import M_PromotionSection from '../m_components/M_PromotionSection.jsx';
import M_CategorySection from '../m_components/M_CategorySection.jsx';

const M_CategoryPage = () => {
    return (
        <div>
            <M_LeftSection select={'category'}/>
            {/* Right Panel */}
            <div id="right-panel" className="right-panel">
            {/* Header*/}
            <M_HeaderSection />
            {/* /#header */}
            <M_CategorySection />
            </div>
        </div>
    );
};

export default M_CategoryPage;
