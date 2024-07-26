import React from 'react';
import './style1.css';
import M_LeftSection from '../m_components/M_LeftSection.jsx';
import M_HeaderSection from '../m_components/M_HeaderSection.jsx';
import M_OperationOrderMaterial from '../m_components/M_OperationOrderMaterialSection.jsx';

const M_OperationOrderMaterialPage = () => {
    return (
        <div>
            <M_LeftSection />
            {/* Right Panel */}
            <div id="right-panel" className="right-panel">
                {/* Header */}
                <M_HeaderSection />
                {/* /#header */}
                <M_OperationOrderMaterial />
            </div>
        </div>
    );
};

export default M_OperationOrderMaterialPage;
