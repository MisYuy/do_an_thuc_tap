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

const M_LeftSection = ({ select }) => {
    return (
        <div>
            {/* Left Panel */}
            <aside id="left-panel" className="left-panel">
                <nav className="navbar navbar-expand-sm navbar-default" style={navbarStyles}>
                    <div id="main-menu" className="main-menu collapse navbar-collapse">
                        <ul className="nav navbar-nav">
                            <li className="menu-title">Thống kê</li>
                            <li className={select === 'statistic-revenue' ? "active" : "deactive"}>
                                <a href="/m/statistic-revenue"><i className="menu-icon fa fa-eye"></i>Theo doanh thu</a>
                            </li>
                            <li className={select === 'statistic-product' ? "active" : "deactive"}>
                                <a href="/m/statistic-product"><i className="menu-icon fa fa-eye"></i>Theo sản phẩm</a>
                            </li>
                            <li className={select === 'statistic-customer' ? "active" : "deactive"}>
                                <a href="/m/statistic-customer"><i className="menu-icon fa fa-eye"></i>Theo khách hàng</a>
                            </li>
                            <li className={select === 'statistic-material' ? "active" : "deactive"}>
                                <a href="/m/statistic-material"><i className="menu-icon fa fa-eye"></i>Theo nguyên liệu</a>
                            </li>
                            <li className="menu-title">Chức năng</li>
                            <li className={select === 'customer' ? "active" : "deactive"}>
                                <a href="/m/account/customer"><i className="menu-icon fa fa-user"></i>Khách hàng </a>
                            </li>
                            <li className={select === 'staff' ? "active" : "deactive"}>
                                <a href="/m/account/staff"><i className="menu-icon fa fa-users"></i>Nhân viên </a>
                            </li>
                            <li className={select === 'order' ? "active" : "deactive"}>
                                <a href="/m/order"><i className="menu-icon fa fa-check"></i>Đơn hàng </a>
                            </li>
                            <li className={select === 'product' ? "active" : "deactive"}>
                                <a href="/m/product"><i className="menu-icon fa fa-shopping-cart"></i>Sản phẩm </a>
                            </li>
                            <li className={select === 'promotion' ? "active" : "deactive"}>
                                <a href="/m/promotion"><i className="menu-icon fa fa-gift"></i>Khuyến mãi </a>
                            </li>
                            <li className={select === 'category' ? "active" : "deactive"}>
                                <a href="/m/category"><i className="menu-icon fa fa-tasks"></i>Danh mục</a>
                            </li>
                            <li className={select === 'material' ? "active" : "deactive"}>
                                <a href="/m/material"><i className="menu-icon fa fa-leaf"></i>Nguyên liệu</a>
                            </li>
                            <li className={select === 'order-material' ? "active" : "deactive"}>
                                <a href="/m/order-material"><i className="menu-icon fa fa-truck"></i>Nhập nguyên liệu</a>
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
