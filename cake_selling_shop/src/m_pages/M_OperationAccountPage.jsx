import React from 'react';
import './style1.css';
import M_LeftSection from '../m_components/M_LeftSection.jsx';
import M_HeaderSection from '../m_components/M_HeaderSection.jsx';
import M_AddProductSection from '../m_components/M_AddProductSection.jsx';
import M_OperationProductSection from '../m_components/M_OperationProductSection.jsx';
import M_OperationAccountSection from '../m_components/M_OperationAccountSection.jsx';

const M_OperationAccountPage = () => {
    return (
        <div>
            <M_LeftSection />
            {/* Right Panel */}
            <div id="right-panel" className="right-panel">
            {/* Header*/}
            <M_HeaderSection />
            {/* /#header */}
            <M_OperationAccountSection />
            </div>
        </div>
    );
};

export default M_OperationAccountPage;
