import React from 'react';

const M_LeftSection = () => {
    return (
        <div>
                        {/* Left Panel */}
                        <aside id="left-panel" className="left-panel">
                <nav className="navbar navbar-expand-sm navbar-default">
                    <div id="main-menu" className="main-menu collapse navbar-collapse">
                        <ul className="nav navbar-nav">
                            <li className="menu-title">Welcome</li>
                            <li className="active">
                                <a href="index.html"><i className="menu-icon fa fa-laptop"></i>Dashboard </a>
                            </li>
                            <li className="menu-title">Chức năng</li>
                            <li className="deactive">
                                <a href="index.html"><i className="menu-icon fa fa-user"></i>Tài khoản </a>
                            </li>
                            <li className="deactive">
                                <a href="index.html"><i className="menu-icon fa fa-check"></i>Đơn hàng </a>
                            </li>
                            <li className="deactive">
                                <a href="index.html"><i className="menu-icon fa fa-shopping-cart"></i>Sản phẩm </a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </aside>
            {/* /#left-panel */}
        </div>
    );
};

export default M_LeftSection;
