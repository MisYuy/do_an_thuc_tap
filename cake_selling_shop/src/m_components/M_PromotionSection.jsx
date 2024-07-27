import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';
import { useNavigate } from 'react-router-dom';

const M_PromotionSection = () => {
    const [promotions, setPromotions] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState('promotion_id');
    const [sortOrder, setSortOrder] = useState('asc');
    const navigate = useNavigate();

    const token = sessionStorage.getItem("token");

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await axios.get(`${URL}/api/promotion/get-all`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setPromotions(response.data);
            } catch (error) {
                setError(error);
            }
        };

        fetchPromotions();
    }, [token]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // Filter promotions based on search term
    const filteredPromotions = promotions.filter(promotion => {
        const matchesId = promotion.promotion_id.toString().includes(searchTerm);
        const matchesName = promotion.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesId || matchesName;
    });

    // Sort promotions based on selected criteria and order
    const sortedPromotions = filteredPromotions.sort((a, b) => {
        const aValue = sortCriteria === 'promotion_id' ? a.promotion_id :
                       sortCriteria === 'name' ? a.name :
                       sortCriteria === 'discount_percentage' ? a.discount_percentage :
                       sortCriteria === 'start_date' ? new Date(a.start_date) :
                       sortCriteria === 'end_date' ? new Date(a.end_date) :
                       0;

        const bValue = sortCriteria === 'promotion_id' ? b.promotion_id :
                       sortCriteria === 'name' ? b.name :
                       sortCriteria === 'discount_percentage' ? b.discount_percentage :
                       sortCriteria === 'start_date' ? new Date(b.start_date) :
                       sortCriteria === 'end_date' ? new Date(b.end_date) :
                       0;

        return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle product click to navigate to detail page
    const handlePromotionClick = (promotionId) => {
        navigate(`/m/operation-promotion/${promotionId}`);
    };

    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card" style={{ paddingBottom: '150px' }}>
                            <div className="card-header">
                                <strong className="card-title">Danh sách khuyến mãi</strong>
                                <a href="add-promotion" type="button" className="btn btn-primary" style={{ marginLeft: '20px' }}>
                                    <i className="fa fa-plus-circle"></i>&nbsp; Thêm Khuyến mãi
                                </a>
                            </div>
                            <div className="card-body">
                                <div style={{ marginBottom: '20px' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Tìm kiếm theo ID hoặc Tên..." 
                                        value={searchTerm} 
                                        onChange={(e) => setSearchTerm(e.target.value)} 
                                        style={{ marginRight: '20px', padding: '5px', minWidth: '300px' }} 
                                    />
                                    <select 
                                        value={sortCriteria} 
                                        onChange={(e) => setSortCriteria(e.target.value)} 
                                        style={{ marginRight: '20px', padding: '5px'}}
                                    >
                                        <option value="promotion_id">Sắp xếp theo ID</option>
                                        <option value="name">Sắp xếp theo Tên</option>
                                        <option value="discount_percentage">Sắp xếp theo Giảm giá (%)</option>
                                        <option value="start_date">Sắp xếp theo Ngày bắt đầu</option>
                                        <option value="end_date">Sắp xếp theo Ngày kết thúc</option>
                                    </select>
                                    <select 
                                        value={sortOrder} 
                                        onChange={(e) => setSortOrder(e.target.value)} 
                                        style={{ padding: '5px'}}
                                    >
                                        <option value="asc">Tăng dần</option>
                                        <option value="desc">Giảm dần</option>
                                    </select>
                                </div>
                                <table id="bootstrap-data-table" className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: 'center' }}>ID Khuyến mãi</th>
                                            <th style={{ textAlign: 'center' }}>Tên Khuyến mãi</th>
                                            <th style={{ textAlign: 'center' }}>Giảm giá (%)</th>
                                            <th style={{ textAlign: 'center' }}>Ngày bắt đầu</th>
                                            <th style={{ textAlign: 'center' }}>Ngày kết thúc</th>
                                            <th style={{ textAlign: 'center' }}>Sản phẩm đang áp dụng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedPromotions.map(promotion => (
                                            <tr key={promotion.promotion_id}  onClick={() => handlePromotionClick(promotion.promotion_id)} style={{ cursor: 'pointer' }}>
                                                <td style={{ textAlign: 'center' }}>{promotion.promotion_id}</td>
                                                <td style={{ textAlign: 'center' }}>{promotion.name}</td>
                                                <td style={{ textAlign: 'center' }}>{promotion.discount_percentage}</td>
                                                <td style={{ textAlign: 'center' }}>{promotion.start_date}</td>
                                                <td style={{ textAlign: 'center' }}>{promotion.end_date}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    {promotion.products.map(product => (
                                                        <div key={product.product_id}>
                                                            {product.product_id} - {product.name}
                                                        </div>
                                                    ))}
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

export default M_PromotionSection;
