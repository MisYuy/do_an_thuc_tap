import React from 'react';

const HeaderSection = () => {
    return (
        <div className="container-fluid page-header py-5">
            <h1 className="text-center text-white display-6">Shop</h1>
            <ol className="breadcrumb justify-content-center mb-0">
                <li className="breadcrumb-item"><a href="/home">Home</a></li>
                <li className="breadcrumb-item active text-white">Shop Detail</li>
            </ol>
        </div>
    );
};

export default HeaderSection;