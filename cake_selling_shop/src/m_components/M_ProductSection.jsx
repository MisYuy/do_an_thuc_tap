import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';

const M_ProductSection = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCriteria, setFilterCriteria] = useState('product_id');
    const [sortCriteria, setSortCriteria] = useState('product_id');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedStatuses, setSelectedStatuses] = useState({
        available: false,
        low_of_stock: false,
        out_of_stock: false,
    });

    useEffect(() => {
        axios.get(`${URL}/api/product/get-all`)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                setError(error);
            });
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // Filter products based on search term and selected statuses
    const filteredProducts = products.filter(product => {
        const matchesSearchTerm = 
            (filterCriteria === 'product_id' && product.product_id.toString().includes(searchTerm)) ||
            (filterCriteria === 'name' && product.name.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = selectedStatuses[product.status];

        return matchesSearchTerm && (Object.values(selectedStatuses).every(status => !status) || matchesStatus);
    });

    // Sort products based on selected criteria and order
    const sortedProducts = filteredProducts.sort((a, b) => {
        const aValue = sortCriteria === 'product_id' ? a.product_id :
                       sortCriteria === 'name' ? a.name :
                       sortCriteria === 'original_price' ? a.price :
                       sortCriteria === 'actual_price' ? a.price - a.price * (a.promotions.reduce((acc, promotion) => acc + (promotion.discount_percentage / 100), 0)) :
                       a.stock_quantity;

        const bValue = sortCriteria === 'product_id' ? b.product_id :
                       sortCriteria === 'name' ? b.name :
                       sortCriteria === 'original_price' ? b.price :
                       sortCriteria === 'actual_price' ? b.price - b.price * (b.promotions.reduce((acc, promotion) => acc + (promotion.discount_percentage / 100), 0)) :
                       b.stock_quantity;

        return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    const handleStatusChange = (status) => {
        setSelectedStatuses(prev => ({
            ...prev,
            [status]: !prev[status],
        }));
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <strong className="card-title">Thao tác</strong>
                            </div>
                            <div className="card-body">
                                <a href="add-product" type="button" className="btn btn-primary" style={{ marginRight: '20px' }}>
                                    <i className="fa fa-plus-circle"></i>&nbsp; Thêm
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <strong className="card-title">Danh sách sản phẩm</strong>
                            </div>
                            <div className="card-body">
                            <div style={{ marginBottom: '20px' }}>
                            <select 
                                    value={filterCriteria} 
                                    onChange={(e) => setFilterCriteria(e.target.value)} 
                                    style={{ marginRight: '20px', padding: '5px' }}
                                >
                                    <option value="product_id">ID Sản phẩm</option>
                                    <option value="name">Tên sản phẩm</option>
                                </select>
                                <input 
                                    type="text" 
                                    placeholder="Tìm kiếm theo ID hoặc tên..." 
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                    style={{ marginRight: '20px', padding: '5px', minWidth: '300px' }} 
                                />
                                <select 
                                    value={sortCriteria} 
                                    onChange={(e) => setSortCriteria(e.target.value)} 
                                    style={{ marginRight: '20px', padding: '5px' }}
                                >
                                    <option value="product_id">Sắp xếp theo ID</option>
                                    <option value="name">Sắp xếp theo Tên</option>
                                    <option value="original_price">Sắp xếp theo Giá gốc</option>
                                    <option value="actual_price">Sắp xếp theo Giá thực</option>
                                    <option value="stock_quantity">Sắp xếp theo Tồn kho</option>
                                </select>
                                <select 
                                    value={sortOrder} 
                                    onChange={(e) => setSortOrder(e.target.value)} 
                                    style={{ marginRight: '20px', padding: '5px' }}
                                >
                                    <option value="asc">Tăng dần</option>
                                    <option value="desc">Giảm dần</option>
                                </select>
                                <div style={{ display: 'flex', marginTop: '20px' }}>
                                    {['available', 'low_of_stock', 'out_of_stock'].map(status => (
                                        <div key={status} style={{ marginRight: '20px', display: 'flex', alignItems: 'center' }}>
                                            <input 
                                                type="checkbox" 
                                                id={status} 
                                                checked={selectedStatuses[status]} 
                                                onChange={() => handleStatusChange(status)} 
                                                style={{ marginRight: '5px' }} 
                                            />
                                            <label htmlFor={status} style={{ cursor: 'pointer' }}>
                                                {status === 'available' ? 'Còn hàng' : status === 'low of stock' ? 'Sắp hết' : 'Hết hàng'}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                </div>
                                <table id="bootstrap-data-table" className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: 'center' }}>ID</th>
                                            <th style={{ textAlign: 'center' }}>Ảnh</th>
                                            <th style={{ textAlign: 'center' }}>Tên</th>
                                            <th style={{ textAlign: 'center' }}>Giá gốc</th>
                                            <th style={{ textAlign: 'center' }}>Mã Khuyến mãi</th>
                                            <th style={{ textAlign: 'center' }}>Giá thực</th>
                                            <th style={{ textAlign: 'center' }}>Tồn kho</th>
                                            <th style={{ textAlign: 'center' }}>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedProducts.map(product => (
                                            <tr key={product.product_id}>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>{product.product_id}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>
                                                    <a href={`/m/operation-product/${product.product_id}`} >
                                                        <img className="rounded-circle" src={product.image ? `/images/product/${product.image}` : "/img/none_image.png"} style={{ minWidth: '100px', minHeight: "100px", maxWidth: '100px', maxHeight: "100px"}} alt="avatar" />
                                                    </a>
                                                </td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>{product.name}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>{product.price}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>
                                                    {product.promotions.map(promotion => (
                                                        <div key={promotion.promotion_id}>
                                                            {promotion.promotion_id} - {promotion.name} ({promotion.discount_percentage}%)
                                                        </div>
                                                    ))}
                                                </td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>
                                                    {(() => {
                                                        let discountedPrice = product.price;
                                                        product.promotions.forEach(promotion => {
                                                            discountedPrice -= discountedPrice * (promotion.discount_percentage / 100);
                                                        });
                                                        return Math.round(discountedPrice); // Round to the nearest whole number
                                                    })()}
                                                </td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>{product.stock_quantity}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>
                                                    <button className="badge badge-complete" style={{ backgroundColor: product.status === 'available' ? '#1ecc02' : product.status === 'low of stock' ? '#ebb134' : '#ff0000' }}>
                                                        {product.status === 'available' ? 'Còn hàng' : product.status === 'low of stock' ? 'Sắp hết' : 'Hết hàng'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back to Top Button */}
                <button 
                    onClick={scrollToTop} 
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        backgroundColor: '#1ecc02',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '10px 15px',
                        cursor: 'pointer',
                        zIndex: 1000,
                    }}
                >
                    Back to Top
                </button>
            </div>
        </div>
    );
};

export default M_ProductSection;
