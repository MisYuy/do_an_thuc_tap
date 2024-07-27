import React from 'react';
import './style1.css';
import M_LeftSection from '../m_components/M_LeftSection.jsx';
import M_HeaderSection from '../m_components/M_HeaderSection.jsx';
import M_AccountsSection from '../m_components/M_AccountsSection.jsx';
import M_StatisticRevenueSection from '../m_components/M_StatisticRevenueSection.jsx';
import M_StatisticTopCustomerSection from '../m_components/M_StatisticTopCustomerSection.jsx';
import M_StatisticProductSection from '../m_components/M_StatisticProductSection.jsx';
import M_StatisticMaterialSection from '../m_components/M_StatisticMaterialSection.jsx';

const M_StatisticMaterialPage = () => {
    return (
        <div>
            <M_LeftSection select={'statistic-material'}/>
            {/* Right Panel */}
            <div id="right-panel" className="right-panel">
            {/* Header*/}
            <M_HeaderSection />
            {/* /#header */}
            <M_StatisticMaterialSection />
            </div>
        </div>
    );
};

export default M_StatisticMaterialPage;
