import React from 'react';
import './style1.css';
import M_LeftSection from '../m_components/M_LeftSection.jsx';
import M_HeaderSection from '../m_components/M_HeaderSection.jsx';
import M_AddProductSection from '../m_components/M_AddProductSection.jsx';
import M_AddAccountSection from '../m_components/M_AddAccountSection.jsx';
import M_AddPromotionSection from '../m_components/M_AddPromotionSection.jsx';
import M_AddOrderMaterialSection from '../m_components/M_AddOrderMaterialSection.jsx';

const M_AddOrderMaterialPage = () => {
    return (
        <div>
            <M_LeftSection />
            {/* Right Panel */}
            <div id="right-panel" className="right-panel">
            {/* Header*/}
            <M_HeaderSection />
            {/* /#header */}
            <M_AddOrderMaterialSection />
            </div>
        </div>
    );
};

export default M_AddOrderMaterialPage;
