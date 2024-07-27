import React from 'react';
import './style1.css';
import M_LeftSection from '../m_components/M_LeftSection.jsx';
import M_HeaderSection from '../m_components/M_HeaderSection.jsx';
import M_AccountsSection from '../m_components/M_AccountsSection.jsx';
import M_StatisticRevenueSection from '../m_components/M_StatisticRevenueSection.jsx';
import M_StatisticTopCustomerSection from '../m_components/M_StatisticTopCustomerSection.jsx';

const M_StatisticTopCustomerPage = () => {
    return (
        <div>
            <M_LeftSection select={'statistic-customer'}/>
            {/* Right Panel */}
            <div id="right-panel" className="right-panel">
            {/* Header*/}
            <M_HeaderSection />
            {/* /#header */}
            <M_StatisticTopCustomerSection />
            </div>
        </div>
    );
};

export default M_StatisticTopCustomerPage;
