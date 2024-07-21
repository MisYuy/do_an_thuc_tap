import React from 'react';

const navbarStyles = {
  background: '#fff',
  borderRadius: '0',
  border: 'none',
  display: 'inline-block',
  margin: '0',
  padding: '0',
  verticalAlign: 'top',
};

const M_LeftSection = () => {
    return (
        <div>
            {/* Left Panel */}
            <aside id="left-panel" className="left-panel">
                <nav className="navbar navbar-expand-sm navbar-default" style={navbarStyles}>
                    <div id="main-menu" className="main-menu collapse navbar-collapse">
                        <ul className="nav navbar-nav">
                            <li className="menu-title">Welcome</li>
                            <li className="active">
                                <a href="index.html"><i className="menu-icon fa fa-eye"></i>Thống kê </a>
                            </li>
                            <li className="menu-title">Chức năng</li>
                            <li className="deactive">
                                <a href="/m/account"><i className="menu-icon fa fa-user"></i>Khách hàng </a>
                            </li>
                            <li className="deactive">
                                <a href="index.html"><i className="menu-icon fa fa-users"></i>Nhân viên </a>
                            </li>
                            <li className="deactive">
                                <a href="index.html"><i className="menu-icon fa fa-check"></i>Đơn hàng </a>
                            </li>
                            <li className="deactive">
                                <a href="/m/product"><i className="menu-icon fa fa-shopping-cart"></i>Sản phẩm </a>
                            </li>
                            <li className="deactive">
                                <a href="index.html"><i className="menu-icon fa fa-gift"></i>Khuyến mãi </a>
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
