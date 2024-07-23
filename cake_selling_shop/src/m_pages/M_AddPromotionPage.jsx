import React from 'react';
import './style1.css';
import M_LeftSection from '../m_components/M_LeftSection.jsx';
import M_HeaderSection from '../m_components/M_HeaderSection.jsx';
import M_AddProductSection from '../m_components/M_AddProductSection.jsx';
import M_AddAccountSection from '../m_components/M_AddAccountSection.jsx';
import M_AddPromotionSection from '../m_components/M_AddPromotionSection.jsx';

const M_AddPromotionPage = () => {
    return (
        <div>
            <M_LeftSection />
            {/* Right Panel */}
            <div id="right-panel" className="right-panel">
            {/* Header*/}
            <M_HeaderSection />
            {/* /#header */}
            <M_AddPromotionSection />
            </div>
        </div>
    );
};

export default M_AddPromotionPage;
