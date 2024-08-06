// M_MyProfilePage.jsx
import React from 'react';
import BaseProfileSection from '../m_components/BaseProfileSection';
import './style1.css';
import M_LeftSection from '../m_components/M_LeftSection.jsx';
import M_HeaderSection from '../m_components/M_HeaderSection.jsx';

const M_MyProfilePage = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = sessionStorage.getItem("token");
    return (
        <div>
            <M_LeftSection />
            {/* Right Panel */}
            <div id="right-panel" className="right-panel">
            {/* Header*/}
            <M_HeaderSection />
            {/* /#header */}
            <BaseProfileSection user={user} token={token} />;
            </div>
        </div>
    );
};

export default M_MyProfilePage;
